#!/usr/bin/env bash
# ==============================================================================
# Google Cloud Storage Setup Script for MÂY / DEKA Ecosystem
# Idempotent: Creates bucket, applies CORS & Lifecycle policies.
# ==============================================================================
set -e

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
  echo "Error: No active GCP project found."
  exit 1
fi

BUCKET_NAME="${GCS_BUCKET:-deka-media-${PROJECT_ID}}"
REGION="${GCP_REGION:-asia-southeast1}"

echo "=========================================================="
echo " Configuring Cloud Storage: gs://$BUCKET_NAME"
echo " Location: $REGION"
echo "=========================================================="

# 1. Create Bucket if not exists
if ! gcloud storage buckets describe "gs://$BUCKET_NAME" &>/dev/null; then
  echo "Creating storage bucket gs://$BUCKET_NAME..."
  gcloud storage buckets create "gs://$BUCKET_NAME" \
    --project="$PROJECT_ID" \
    --location="$REGION" \
    --default-storage-class="STANDARD" \
    --uniform-bucket-level-access \
    --public-access-prevention
else
  echo "Storage bucket gs://$BUCKET_NAME already exists."
fi

# 2. Apply CORS Policy (Allows direct browser-to-bucket PUT uploads)
echo "Applying CORS policy from infrastructure/storage/cors.json..."
gcloud storage buckets update "gs://$BUCKET_NAME" \
  --cors-file="infrastructure/storage/cors.json"

# 3. Apply Lifecycle Rules (Auto-deletes temp files after 3 days, nearline after 60 days)
echo "Applying Lifecycle policy from infrastructure/storage/lifecycle.json..."
gcloud storage buckets update "gs://$BUCKET_NAME" \
  --lifecycle-file="infrastructure/storage/lifecycle.json"

echo "=========================================================="
echo " Cloud Storage configuration complete!"
echo " Uniform Bucket-Level Access: Enabled"
echo " Public Access: Blocked (All transfers require Signed URLs)"
echo " Lifecycle: Active (3-day temp auto-purge)"
echo "=========================================================="
