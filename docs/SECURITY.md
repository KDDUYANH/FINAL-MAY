# MÂY / DEKA Google Cloud Security Blueprint

## 1. Core Security Commandments

1. **Zero Committed Secrets**: No passwords, API keys, or GCP service account credentials (`.json` keys) in GitHub.
2. **Google Secret Manager as Central Vault**: All runtime credentials (database strings, Gemini API keys, JWT secrets) are stored in Secret Manager and injected at runtime.
3. **Private Buckets by Default**: `deka-media` is strictly private with uniform bucket-level access. No object is publicly readable.
4. **V4 Signed URLs with Tight Expirations**: Upload URLs expire in 15 minutes; download URLs expire in 30 minutes.
5. **Least-Privilege Workload Identity**: Each service account possesses only the exact permissions needed for its operational scope.
6. **Isolated Network Ports**: The DEKA Server VM only exposes port 80/443 (via Caddy with automated HTTPS) and SSH. Database, Redis, and internal APIs are bound to internal Docker bridges.

---

## 2. IAM Service Account Architecture

```
                       GCP Project: deka-production
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
   deka-cloud-run              deka-worker               deka-deploy
(Cloud Run Services)        (DEKA Server VM)          (GitHub Actions CI)
          │                         │                         │
• storage.objectAdmin     • storage.objectAdmin     • run.admin
  (on deka-media)           (on deka-media)         • compute.instanceAdmin
• secretmanager.accessor  • secretmanager.accessor  • artifactregistry.writer
• cloudsql.client         • cloudsql.client         • iam.serviceAccountUser
```

### Required IAM Bindings:
- **`deka-cloud-run`**:
  - `roles/storage.objectAdmin` (on `deka-media-*`)
  - `roles/secretmanager.secretAccessor` (access secrets)
  - `roles/cloudsql.client` (connect to Cloud SQL over IAM Auth / Auth Proxy)
- **`deka-worker`**:
  - `roles/storage.objectAdmin` (download raw files, upload transcode outputs)
  - `roles/secretmanager.secretAccessor`
- **`deka-deploy`**:
  - Used in GitHub Actions CI/CD via Workload Identity Federation (WIF) or an ephemeral secret key.
  - `roles/run.admin`
  - `roles/artifactregistry.writer`
  - `roles/compute.instanceAdmin.v1`

---

## 3. Storage Security & Signed URL Integrity

### 3.1 Bucket Lockdown
- **Uniform Bucket-Level Access**: Enabled. ACLs are disabled to eliminate permission drift.
- **Public Access Prevention**: Enforced (`publicAccessPrevention: enforced`).

### 3.2 Secure Upload Flow
1. Client calls `POST /assets/upload-request` with JWT bearer token.
2. Server validates:
   - File size < `100MB` (or configured plan limit).
   - MIME type matches an approved whitelist (`image/jpeg`, `image/png`, `image/webp`, `video/mp4`, `video/quicktime`).
3. Server generates a Google Cloud Storage V4 Signed URL with:
   - Method: `PUT`
   - Content-Type constraint matching validated MIME type.
   - Expiration: `900` seconds (15 minutes).
4. Client uploads directly to the URL. Tampered headers or altered content types are rejected by Google Cloud Storage at the edge.

---

## 4. DEKA Server Compute Engine Security

1. **OS Hardening**:
   - Debian 12 minimal installation with automated security patching (`unattended-upgrades`).
   - Root login disabled. SSH access restricted to authenticated GCP IAP (Identity-Aware Proxy) or SSH key pairs.
2. **Host Firewall (UFW & GCP VPC Firewall)**:
   - Ports open to Internet: `80` (HTTP -> redirected to HTTPS), `443` (HTTPS).
   - Port `22` (SSH): Restricted to trusted IP range or GCP IAP (`35.235.240.0/20`).
   - Internal ports (`6379` Redis, `4000` Internal API, `5432` Postgres): Bound strictly to Docker internal bridge network (`172.20.0.0/16`), inaccessible from public VM IP.
3. **Automated TLS & Reverse Proxy (Caddy)**:
   - Caddy automatically provisions and renews Let's Encrypt / ZeroSSL TLS certificates with modern cipher suites (TLS 1.3).
   - Security headers injected on all responses:
     ```
     X-Content-Type-Options: nosniff
     X-Frame-Options: DENY
     X-XSS-Protection: "1; mode=block"
     Referrer-Policy: strict-origin-when-cross-origin
     Strict-Transport-Security: "max-age=31536000; includeSubDomains; preload"
     ```

---

## 5. Secret Management Checklist

| Secret Name | Purpose | Stored In | Consumed By |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | Secret Manager | `deka-api`, `media-worker`, `ai-worker` |
| `JWT_SECRET` | Auth session signing key | Secret Manager | `deka-api` |
| `INTERNAL_API_KEY` | DEKA Server internal dispatch auth | Secret Manager | `deka-api`, `deka-server` |
| `GEMINI_API_KEY` | Google Gemini AI inference | Secret Manager | `ai-worker` |
| `REDIS_PASSWORD` | DEKA Server queue password | Secret Manager | `internal-api`, workers |
| `GCP_SA_KEY` (or WIF) | GitHub Actions deployment | GitHub Repo Secret | CI/CD runners |

---

## 6. Incident Response & Audit Logging

- **Cloud Audit Logs**: All administrative actions on Cloud Run, Compute Engine, and Storage are automatically ingested into Google Cloud Logging.
- **Audit Table**: Critical business operations (user privilege changes, project deletions, API key generations) are written to the database `audit_logs` table with client IP and user agent.
- **Log Retention**: Default 30-day retention in Cloud Logging covers compliance requirements without extra storage fees.
