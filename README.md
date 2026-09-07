# MÂY / DEKA Cloud Architecture & SaaS Ecosystem

> **Production-Ready Google Cloud Architecture for MÂY & Vertical AI SaaS Products**

[![CI Status](https://github.com/KDDUYANH/FINAL-MAY/actions/workflows/ci.yml/badge.svg)](https://github.com/KDDUYANH/FINAL-MAY/actions/workflows/ci.yml)

---

## 1. Target Architecture Overview

The system follows a **hybrid serverless + persistent worker model** optimized to maximize the value of Google Cloud credits while keeping recurring costs ultra-low:

```text
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

### Core Architecture Pillars:
1. **Cloud Run (`min-instances = 0`)**: Hosts public SaaS frontends (`apps/may`, `apps/tools`) and stateless API gateways (`apps/api`). Scales to zero when idle for $0 compute cost.
2. **Compute Engine (DEKA Server)**: A single VM (`e2-standard-2`) running Docker Compose for persistent workers: FFmpeg media processing, Gemini AI asynchronous jobs, Redis task queues, and Caddy reverse proxy.
3. **Cloud Storage (`deka-media`)**: Two-phase media transport layer using V4 Signed URLs. Large media uploads/downloads bypass Cloud Run request bodies directly to GCS.
4. **Managed PostgreSQL**: Multi-tenant users, projects, asset registries, job queues, and granular AI token / compute credit tracking.
5. **Zero Committed Secrets**: Centralized via Google Secret Manager.

---

## 2. Monorepo Repository Structure

```text
/
├── apps/
│   ├── may/                     # Primary MÂY SaaS Web Application (Next.js 15)
│   ├── tools/                   # Modular micro-tools (photo, light, color analyzers)
│   └── api/                     # Cloud Run Public API Gateway (Express / GCS Broker)
│
├── services/
│   ├── media-worker/            # Persistent FFmpeg video/image worker
│   ├── ai-worker/               # Asynchronous Google Gemini AI worker
│   └── api-service/             # DEKA Server internal dispatcher & ops API
│
├── infrastructure/
│   ├── cloud-run/               # Cloud Run Knative YAML manifests
│   ├── compute-engine/          # DEKA Server cloud-init and VM setup scripts
│   ├── storage/                 # GCS bucket lifecycle rules & CORS configs
│   ├── database/                # PostgreSQL schema DDL & migrations
│   └── iam/                     # Least-privilege IAM service account provisioning
│
├── docker/
│   └── deka-server/             # Production Docker Compose stack & Caddyfile
│
├── scripts/
│   ├── setup-gcp.sh             # Idempotent GCP API activation & Artifact Registry
│   ├── setup-storage.sh         # GCS bucket, CORS & lifecycle setup
│   ├── setup-database.sh        # Cloud SQL PostgreSQL provisioning
│   ├── deploy-cloud-run.sh      # Cloud Run deployment script
│   ├── deploy-deka-server.sh    # DEKA Server deployment script
│   └── smoke-test.sh            # Production validation & smoke test suite
│
├── .github/
│   └── workflows/
│       ├── ci.yml               # Comprehensive test & build validation
│       ├── deploy-cloud-run.yml # Automated Cloud Run deployment
│       └── deploy-deka.yml      # Automated DEKA Server deployment
│
├── docs/
│   ├── ARCHITECTURE.md          # Comprehensive architectural specification
│   ├── DEPLOYMENT.md            # Step-by-step production deployment manual
│   ├── COST_CONTROL.md          # Credit preservation & budget management
│   └── SECURITY.md              # IAM, secret management & network hardening
│
├── .env.example                 # Standardized environment configuration template
├── docker-compose.yml           # 1-command local development environment
└── README.md
```

---

## 3. Quick Start: Local Development

Spin up the entire ecosystem (Postgres, Redis, API Gateway, Internal Dispatcher, Media Worker, AI Worker, MÂY Frontend) with **one command**:

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Start full-stack Docker Compose environment
docker compose up -d

# 3. View running services
docker compose ps
```

### Local Endpoints:
- **MÂY Studio UI**: [http://localhost:3000](http://localhost:3000)
- **Cloud Run API Gateway**: [http://localhost:8080/health](http://localhost:8080/health)
- **DEKA Server Internal Dispatcher**: [http://localhost:4000/health](http://localhost:4000/health)
- **PostgreSQL**: `localhost:5432` (`deka_development`)
- **Redis**: `localhost:6379`

---

## 4. Production Deployment to Google Cloud

### Step 1: Initialize GCP Services & APIs
```bash
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="asia-southeast1" # Or us-central1, europe-west1
gcloud config set project $GCP_PROJECT_ID

chmod +x scripts/*.sh
./scripts/setup-gcp.sh
```

### Step 2: Provision Storage & Database
```bash
# Creates deka-media bucket with 3-day temp cleanup & CORS
./scripts/setup-storage.sh

# Provisions Cloud SQL Postgres & stores secrets
./scripts/setup-database.sh

# Configures least-privilege IAM service accounts
./infrastructure/iam/setup-iam.sh
```

### Step 3: Provision & Deploy DEKA Server (Compute Engine)
```bash
# 1. Provision VM instance (e2-standard-2)
./infrastructure/compute-engine/setup-vm.sh

# 2. Build and deploy persistent workers
./scripts/deploy-deka-server.sh
```

### Step 4: Deploy Cloud Run Applications
```bash
./scripts/deploy-cloud-run.sh
```

### Step 5: Run Production Smoke Test
```bash
./scripts/smoke-test.sh
```

---

## 5. Media & Asynchronous AI Workflows

### Direct GCS Media Transfer (Two-Phase Upload)
```text
User Browser ──(1. POST /assets/upload-request)──► Cloud Run API
User Browser ◄──(2. V4 Signed Upload URL)───────── Cloud Run API
User Browser ──(3. Direct HTTP PUT)──────────────► Cloud Storage (uploads/{id}/raw.bin)
User Browser ──(4. POST /jobs)──────────────────► Cloud Run API
                                                       │ (Enqueue)
                                                       ▼
DEKA Server (FFmpeg Worker) ◄───(5. Dequeue)────── Redis Queue
DEKA Server ───(6. Download Raw & Upload Processed)─► Cloud Storage (processed/{id}/)
DEKA Server ───(7. Commit Dimensions & State)────► PostgreSQL
```

---

## 6. Cost Control & Credit Preservation Strategy

- **Scale-to-Zero (`min-instances: 0`)**: All public web applications and APIs scale to zero when idle.
- **No Kubernetes ($74/mo saved)**: DEKA Server uses Docker Compose on a single `e2-standard-2` VM.
- **Direct Cloud Storage Uploads**: Eliminates dual-hop egress bandwidth fees.
- **Storage Lifecycle Auto-Purge**: Temporary files in `temp/` and unconfirmed uploads automatically delete after 3 days. Assets over 60 days automatically transition to Nearline storage.
- **Budget Alerts**: Enforced via Cloud Console budget tracking to safeguard your promotional credits.

For complete details, see [`docs/COST_CONTROL.md`](docs/COST_CONTROL.md).

---

## 7. Security Architecture

- **Private Buckets**: `deka-media` strictly blocks public access. All reads/writes require short-lived V4 Signed URLs.
- **Zero Committed Secrets**: Secrets (`DATABASE_URL`, `GEMINI_API_KEY`, `INTERNAL_API_KEY`) live in Google Secret Manager.
- **Network Isolation**: Compute Engine VM only exposes ports 80/443 (via Caddy) and SSH. Database and Redis ports are bound strictly to internal Docker networks.

For complete details, see [`docs/SECURITY.md`](docs/SECURITY.md).
