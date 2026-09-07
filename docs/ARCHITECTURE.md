# MÂY / DEKA Cloud Architecture Specification

## 1. Executive Summary

This architecture establishes a production-ready, modular, and cost-effective cloud foundation for the **MÂY** SaaS platform and future vertical SaaS applications.

The design strictly follows the **hybrid serverless + persistent worker model**:
- **Google Cloud Run**: Serves public-facing SaaS applications (`deka-may`, `deka-tools`) and stateless API gateways (`deka-api`). It automatically scales down to zero (`min-instances = 0`) to eliminate idle compute billing.
- **Google Compute Engine (DEKA Server)**: A single, optimized VM (`e2-standard-2` or `e2-highcpu-4`) running Docker Compose for persistent background workers (FFmpeg media transcoding, Gemini AI asynchronous processing, Redis task queues, and Caddy reverse proxy).
- **Google Cloud Storage (`deka-media`)**: The central media transport layer using V4 Signed URLs for zero-egress direct client uploads/downloads and automated storage lifecycle management.
- **Managed PostgreSQL**: Relational metadata, multi-tenant accounts, project records, asset indexes, asynchronous job queues, and granular usage tracking.
- **GitHub Actions & Google Secret Manager**: Centralized, secure CI/CD and credential management with zero hardcoded secrets.

```
                    GOOGLE CLOUD
                         │
          ┌──────────────┴──────────────┐
          │                             │
     DEKA SERVER                    CLOUD RUN
   Compute Engine                  SaaS / APIs
          │                             │
     ┌────┼────┐                  ┌─────┼─────┐
     │    │    │                  │     │     │
    API  MEDIA  AI                MÂY   TOOLS  API
     │    │    │
     └────┴────┘
          │
    CLOUD STORAGE
          │
       DATABASE
```

---

## 2. Core Architectural Principles

1. **Cloud Run for Stateless Applications**: Cloud Run instances handle HTTP/HTTPS web requests and lightweight API operations. They possess no local persistent state and scale from 0 to *N* instances based on incoming traffic.
2. **Compute Engine for Heavy/Persistent Workloads**: FFmpeg video encoding, audio extraction, long-running AI batch orchestration, and worker queues run inside Docker containers on the dedicated DEKA Server. This avoids Cloud Run's CPU throttling and 60-minute request timeouts.
3. **Cloud Storage as Media Transport Layer**: Large binary media files (images, raw video, rendered packages) NEVER pass through Cloud Run or API gateway memory buffers. The client requests a pre-authenticated V4 Signed URL, uploads directly to Cloud Storage, and notifies the API to schedule a background job.
4. **No Kubernetes Overhead**: Avoids Google Kubernetes Engine (GKE) cluster management fees (~$74/month base fee per cluster + minimum node pool costs). Docker Compose on Compute Engine provides identical modularity and restart guarantees at a fraction of the cost.
5. **Least-Privilege Security**: Service accounts are segregated per workload (`deka-cloud-run`, `deka-worker`, `deka-deploy`), storage buckets are private by default, and database connections require SSL.
6. **Cost Observability & Control**: Automatic scale-to-zero, storage object lifecycle auto-deletion (3 days for temp files), and nearline transitions maximize existing Google Cloud credits.

---

## 3. High-Level System Topology

```mermaid
flowchart TD
    subgraph ClientLayer["Clients & Web Browsers"]
        User["SaaS User / Studio Creator"]
    end

    subgraph GCP["Google Cloud Platform Project"]
        subgraph Serverless["Cloud Run (Stateless Public Services)"]
            MayApp["deka-may (Next.js 15 UI)"]
            ToolsApp["deka-tools (Utility Micro-Apps)"]
            PublicAPI["deka-api (Express/Fastify Gateway)"]
        end

        subgraph Storage["Cloud Storage Layer"]
            GCS[("deka-media Bucket\n/uploads\n/projects\n/processed\n/thumbnails\n/temp")]
        end

        subgraph DekaVM["DEKA Server (Compute Engine: e2-standard-2)"]
            subgraph Compose["Docker Compose Runtime"]
                Caddy["Caddy Reverse Proxy (HTTPS / Auth)"]
                InternalAPI["Internal Dispatcher API"]
                RedisQ[("Redis 7 (BullMQ Engine)")]
                MediaWorker["Media Worker (FFmpeg / ImageMagick)"]
                AIWorker["AI Worker (Gemini 2.5 / 1.5 Pro)"]
            end
        end

        subgraph Data["Data & Secrets"]
            Postgres[("Cloud SQL PostgreSQL\n(db-custom-1-3840 / db-f1-micro)")]
            SecretManager["Google Secret Manager"]
        end
    end

    User -->|1. HTTPS Request| MayApp
    User -->|2. Request Upload Signed URL| PublicAPI
    PublicAPI -->|3. Generate V4 PUT URL| User
    User -->|4. Direct Upload (PUT)| GCS
    User -->|5. Trigger Job| PublicAPI
    PublicAPI -->|6. Enqueue Job| InternalAPI
    InternalAPI --> RedisQ
    RedisQ --> MediaWorker
    RedisQ --> AIWorker
    MediaWorker -->|7. Download Raw & Upload Processed| GCS
    AIWorker -->|8. Inference & Analysis| GCS
    MediaWorker -->|9. Update Job & Asset State| Postgres
    AIWorker -->|10. Record Token & Time Usage| Postgres
    PublicAPI -->|11. Poll Status / Webhook| Postgres
    PublicAPI -->|Fetch Config| SecretManager
    InternalAPI -->|Fetch Config| SecretManager
```

---

## 4. Workload Separation & Component Responsibilities

| Workload | Host Service | Port / Protocol | Autoscaling | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **deka-may** | Cloud Run | 8080 (HTTPS) | 0 to 10 instances | MÂY Image Studio web UI (Next.js 15, React 19, Tailwind) |
| **deka-tools** | Cloud Run | 8080 (HTTPS) | 0 to 5 instances | Modular micro-tools (photo, light, color analyzers) |
| **deka-api** | Cloud Run | 8080 (HTTPS) | 0 to 20 instances | Public REST API, Auth, Signed URL broker, Project CRUD |
| **deka-server** | Compute Engine | 22 (SSH), 443 (HTTPS) | 1 VM instance | Persistent processing hub running Docker Compose |
| **caddy** | DEKA Server | 80, 443 (HTTP/HTTPS)| Containerized | Automated TLS termination, reverse proxy, internal rate limiting |
| **internal-api** | DEKA Server | 4000 (Internal) | Containerized | Secure job queue ingestion point for Cloud Run |
| **redis** | DEKA Server | 6379 (Internal) | Containerized | In-memory message broker & state store for BullMQ |
| **media-worker** | DEKA Server | Worker process | Concurrency: 2-4 | Video transcoding, HLS segmentation, image thumbnails via FFmpeg |
| **ai-worker** | DEKA Server | Worker process | Concurrency: 4-8 | Gemini API orchestrator, prompt processing, usage ledger recording |
| **PostgreSQL** | Cloud SQL / VM | 5432 (TCP/SSL) | Managed instance | System of record for users, assets, jobs, billing |

---

## 5. Media Pipeline Architecture

Passing high-resolution product photography and 4K cosmetic video renders through application servers causes severe memory spikes, slow request times, and high network egress fees. The MÂY media pipeline uses direct two-phase transfers:

```
User Browser
    │
    │ 1. POST /assets/upload-request
    ▼
Cloud Run API (deka-api)
    │
    │ 2. Validates user, generates UUID, issues V4 Signed PUT URL (15m expiry)
    ▼
User Browser
    │
    │ 3. Direct HTTP PUT to Cloud Storage (streamed binary)
    ▼
Google Cloud Storage (uploads/{assetId}/raw.bin)
    │
    │ 4. POST /jobs (assetId, jobType="PROCESS_VIDEO" / "IMAGE_ENHANCE")
    ▼
Cloud Run API
    │
    │ 5. Dispatches job to DEKA Server internal endpoint (authenticated via Bearer Secret)
    ▼
DEKA Server Internal API -> Redis Queue
    │
    │ 6. Media Worker claims task
    ▼
Media Worker (DEKA Server)
    │
    │ 7. Streams raw object from GCS
    │ 8. Executes FFmpeg / Sharp transformations locally on disk (/tmp volume)
    │ 9. Streams optimized variants back to GCS (processed/{assetId}/, thumbnails/{assetId}/)
    │ 10. Deletes local temporary files
    │ 11. Commits asset metadata & dimensions to PostgreSQL
    ▼
Cloud Storage (processed/{assetId}/...) & Database (status="available")
```

### Storage Directory Prefixes:
- `uploads/`: Raw uploaded source assets awaiting processing.
- `projects/`: Project workspace bundles and export manifests.
- `processed/`: Production-ready images, web-optimized MP4s, and HLS streaming playlists.
- `thumbnails/`: Low-resolution previews and UI thumbnails (WebP/JPEG).
- `exports/`: Generated client packages, zips, and high-res master exports.
- `temp/`: Ephemeral chunks, intermediate frames, and transient buffers. Automatically cleaned up after 3 days via GCS lifecycle rules.

---

## 6. Asynchronous AI Job Pipeline

All generative and analytical AI operations are processed asynchronously to ensure sub-100ms API responses:

```
Frontend (MÂY Studio)
    │
    │ 1. POST /ai/analyze { assetId, prompt, targetRegions }
    ▼
Cloud Run API
    │
    │ 2. Writes row to jobs table (status="queued")
    │ 3. Enqueues job to DEKA Server
    ▼
DEKA Server (Redis / BullMQ)
    │
    │ 4. AI Worker dequeues task, transitions DB status to "processing"
    ▼
AI Worker
    │
    │ 5. Retrieves asset reference & generates signed read URL
    │ 6. Executes Google Gemini 2.5 / 1.5 Pro multimodal call with Structured Output
    │ 7. Evaluates Product Integrity Guardrails (locks label regions & text)
    │ 8. Writes generated output/coordinates to GCS or DB
    │ 9. Inserts token count and compute cost into usage_ledger
    │ 10. Updates jobs table (status="completed", completed_at=NOW())
    ▼
PostgreSQL Database
    │
    │ 11. Frontend polls GET /jobs/:id/status or receives WebSocket/SSE notification
    ▼
Frontend (Renders result with before/after compositing)
```

---

## 7. Multi-Tenant Future SaaS Extension

The architecture is explicitly constructed to support multiple vertical tools without replicating cloud infrastructure.
Future tools (`photo-analyzer`, `light-analyzer`, `color-analyzer`, `beauty-content`) plug directly into the shared foundation:

```
                     ┌──────────────────┐
                     │   SaaS APPS      │
                     │  (Cloud Run)     │
                     ├──────────────────┤
                     │ • deka-may       │
                     │ • photo-analyzer │
                     │ • light-analyzer │
                     │ • color-analyzer │
                     └────────┬─────────┘
                              │
               Shared Unified Infrastructure
    ┌─────────────────────────┼─────────────────────────┐
    ▼                         ▼                         ▼
deka-api (Gateway)      deka-media (Storage)      deka-database (Postgres)
• User authentication   • Tenant prefixing       • Multi-tenant user accounts
• Role-based access     • Signed upload broker   • Project management
• Job dispatcher        • Asset registry         • Token & compute billing
```

Every new SaaS tool is simply an additional container deployed to Cloud Run or a route within the `apps/` directory, sharing the single DEKA Server worker cluster, database, and storage bucket.
