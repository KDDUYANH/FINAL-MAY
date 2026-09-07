#!/usr/bin/env bash
# ==============================================================================
# IAM Least-Privilege Provisioning Script for MÂY / DEKA Ecosystem
# ==============================================================================
set -e

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
  echo "Error: No GCP active project found. Run 'gcloud config set project <PROJECT_ID>' first."
  exit 1
fi

echo "Setting up least-privilege IAM service accounts for project: $PROJECT_ID"

# 1. Service Account for Cloud Run (Public apps & API Gateway)
SA_CLOUDRUN="deka-cloud-run"
if ! gcloud iam service-accounts describe "${SA_CLOUDRUN}@${PROJECT_ID}.iam.gserviceaccount.com" &>/dev/null; then
  echo "Creating service account: $SA_CLOUDRUN"
  gcloud iam service-accounts create "$SA_CLOUDRUN" \
    --display-name="DEKA Cloud Run Service Account"
fi

# 2. Service Account for DEKA Server (Compute Engine Worker VM)
SA_WORKER="deka-worker"
if ! gcloud iam service-accounts describe "${SA_WORKER}@${PROJECT_ID}.iam.gserviceaccount.com" &>/dev/null; then
  echo "Creating service account: $SA_WORKER"
  gcloud iam service-accounts create "$SA_WORKER" \
    --display-name="DEKA Compute Engine Worker Service Account"
fi

# 3. Service Account for CI/CD Deployment (GitHub Actions)
SA_DEPLOY="deka-deploy"
if ! gcloud iam service-accounts describe "${SA_DEPLOY}@${PROJECT_ID}.iam.gserviceaccount.com" &>/dev/null; then
  echo "Creating service account: $SA_DEPLOY"
  gcloud iam service-accounts create "$SA_DEPLOY" \
    --display-name="DEKA GitHub Actions CI/CD Deployment Service Account"
fi

echo "Granting roles..."

# Cloud Run Roles: Access GCS objects & Secret Manager
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_CLOUDRUN}@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin" --condition=None >/dev/null

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_CLOUDRUN}@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" --condition=None >/dev/null

# Worker Roles: Read/Write GCS & Secret Manager
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_WORKER}@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin" --condition=None >/dev/null

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_WORKER}@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" --condition=None >/dev/null

# Deploy Roles: Manage Cloud Run, Artifact Registry, Compute Engine
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_DEPLOY}@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/run.admin" --condition=None >/dev/null

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_DEPLOY}@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer" --condition=None >/dev/null

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_DEPLOY}@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/compute.instanceAdmin.v1" --condition=None >/dev/null

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_DEPLOY}@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser" --condition=None >/dev/null

echo "IAM service accounts and least-privilege bindings configured successfully."
