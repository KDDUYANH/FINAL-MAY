# MÂY / DEKA Production Deployment Guide

This guide walks through deploying the complete MÂY / DEKA production ecosystem to Google Cloud Platform using Cloud Run, Compute Engine (DEKA Server), Cloud Storage, and Managed PostgreSQL.

---

## 1. Prerequisites

1. **Google Cloud CLI (`gcloud`)**: Installed and authenticated (`gcloud auth login`).
2. **Docker Engine**: Installed locally for building/testing container images.
3. **Active GCP Project**: Ensure billing is enabled to utilize your promotional credits.
4. **SSH Key Pair**: Generated for connecting to the DEKA Server VM.

```bash
# Set your target project and region
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="asia-southeast1" # Or us-central1, europe-west1, etc.
gcloud config set project $GCP_PROJECT_ID
```

---

## 2. Step 1: Initialize GCP Services & APIs

Run the automated GCP initialization script to enable all required Google APIs and configure Google Artifact Registry:

```bash
chmod +x scripts/*.sh
./scripts/setup-gcp.sh
```

This activates:
- `run.googleapis.com` (Cloud Run)
- `compute.googleapis.com` (Compute Engine)
- `storage.googleapis.com` (Cloud Storage)
- `secretmanager.googleapis.com` (Secret Manager)
- `artifactregistry.googleapis.com` (Container registry)
- `sqladmin.googleapis.com` (Cloud SQL PostgreSQL)

---

## 3. Step 2: Provision Storage & Lifecycle Policies

Run the storage initialization script to create the media bucket, set CORS policies for direct browser upload, and apply the lifecycle auto-deletion rule:

```bash
./scripts/setup-storage.sh
```

Verify the bucket configuration:
```bash
gcloud storage buckets describe gs://deka-media-$GCP_PROJECT_ID --format="yaml(cors, lifecycle)"
```

---

## 4. Step 3: Provision PostgreSQL Database

Run the database setup script:
```bash
./scripts/setup-database.sh
```

This creates:
- Cloud SQL PostgreSQL instance `deka-db` (or prepares an existing PostgreSQL instance)
- Database user `deka_admin`
- Database `deka_production`
- Creates application tables from `infrastructure/database/schema.sql`
- Stores the connection string in Google Secret Manager as `DATABASE_URL`

---

## 5. Step 4: Configure IAM & Service Accounts

Provision least-privilege service accounts using the IAM script:
```bash
./infrastructure/iam/setup-iam.sh
```

This creates:
1. `deka-cloud-run@$GCP_PROJECT_ID.iam.gserviceaccount.com`:
   - Role: `roles/storage.objectAdmin` (scoped to `deka-media-*`)
   - Role: `roles/secretmanager.secretAccessor`
2. `deka-worker@$GCP_PROJECT_ID.iam.gserviceaccount.com`:
   - Role: `roles/storage.objectAdmin`
   - Role: `roles/secretmanager.secretAccessor`
3. `deka-deploy@$GCP_PROJECT_ID.iam.gserviceaccount.com`:
   - Roles for GitHub Actions CI/CD deployment.

---

## 6. Step 5: Provision DEKA Server (Compute Engine)

Run the Compute Engine setup script to create the single, cost-optimized VM:

```bash
./infrastructure/compute-engine/setup-vm.sh
```

What this does:
- Provisions an `e2-standard-2` VM with Debian 12 and a 50GB balanced persistent disk.
- Automatically installs Docker CE and Docker Compose via startup script (`cloud-init.yaml`).
- Configures a static external IP and VPC firewall rules allowing port 80, 443, and 22.
- Sets up systemd service to automatically boot the Docker Compose stack on VM restart.

---

## 7. Step 6: Deploy DEKA Server Worker Containers

Deploy the persistent Docker Compose stack (Caddy, Redis, Media Worker, AI Worker, Internal API) to the DEKA Server:

```bash
./scripts/deploy-deka-server.sh
```

The script builds the worker images, pushes them to Artifact Registry, transfers `docker/deka-server/docker-compose.yml` to the VM, and executes:
```bash
docker compose pull
docker compose up -d --remove-orphans
```

Inspect the running containers:
```bash
gcloud compute ssh deka-server --zone=asia-southeast1-b --command="docker compose -f /opt/deka/docker-compose.yml ps"
```

---

## 8. Step 7: Deploy Cloud Run Applications

Deploy the public SaaS services (`deka-may`, `deka-tools`, `deka-api`):

```bash
./scripts/deploy-cloud-run.sh
```

Key configuration applied:
- `min-instances = 0` (scales to zero when idle)
- `max-instances = 10`
- `memory = 1Gi`
- `cpu = 1`
- `port = 8080`
- Environment variables injected from Google Secret Manager

Output provides the live HTTPS URLs:
- `https://deka-may-<hash>-as.a.run.app`
- `https://deka-api-<hash>-as.a.run.app`

---

## 9. Step 8: Run Production Smoke Test

Validate the entire end-to-end pipeline:
```bash
./scripts/smoke-test.sh
```

Checks:
- [x] Cloud Run API `/health` endpoint responds 200 OK
- [x] Cloud Run API `/ready` checks database connectivity
- [x] GCS V4 Signed URL generation functions properly
- [x] DEKA Server internal health endpoint responds 200 OK
- [x] Asynchronous test job successfully enqueued and processed
