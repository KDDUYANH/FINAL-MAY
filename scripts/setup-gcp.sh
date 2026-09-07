#!/usr/bin/env bash
# ==============================================================================
# GCP Project Initialization & Service Activation
# Idempotent: safe to run multiple times.
# ==============================================================================
set -e

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
  echo "Error: No active GCP project found. Run 'gcloud config set project <PROJECT_ID>' first."
  exit 1
fi

REGION="${GCP_REGION:-asia-southeast1}"

echo "=========================================================="
echo " Initializing GCP Project: $PROJECT_ID | Region: $REGION"
echo "=========================================================="

echo "[1/3] Enabling required Google Cloud APIs..."
gcloud services enable \
  run.googleapis.com \
  compute.googleapis.com \
  storage.googleapis.com \
  secretmanager.googleapis.com \
  artifactregistry.googleapis.com \
  sqladmin.googleapis.com \
  cloudbuild.googleapis.com \
  logging.googleapis.com \
  monitoring.googleapis.com

echo "[2/3] Configuring Google Artifact Registry repository 'deka'..."
if ! gcloud artifacts repositories describe deka --location="$REGION" &>/dev/null; then
  echo "Creating Artifact Registry repository 'deka' in $REGION..."
  gcloud artifacts repositories create deka \
    --repository-format=docker \
    --location="$REGION" \
    --description="DEKA Docker Container Repository"
else
  echo "Artifact Registry repository 'deka' already exists."
fi

echo "[3/3] Configuring Docker authentication for Artifact Registry..."
gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

echo "=========================================================="
echo " GCP Project initialization complete!"
echo "=========================================================="
