#!/usr/bin/env bash
# Deploy MÂY Image Studio to Google Cloud Run from Cloud Shell or local gcloud CLI
set -e

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
  echo "Error: No GCP active project found. Please run 'gcloud config set project <YOUR_PROJECT_ID>' first."
  exit 1
fi

SERVICE_NAME="may-image-studio"
REGION="asia-southeast1" # Default to Singapore / SE Asia (change as desired e.g. us-central1)

echo "=========================================================="
echo " Deploying MÂY Image Studio to Google Cloud Run"
echo " Project: $PROJECT_ID | Region: $REGION"
echo "=========================================================="

echo "[1/3] Submitting build to Google Cloud Build..."
gcloud builds submit --tag "gcr.io/$PROJECT_ID/$SERVICE_NAME:latest" .

echo "[2/3] Deploying container to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image "gcr.io/$PROJECT_ID/$SERVICE_NAME:latest" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 5

SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --platform managed --region "$REGION" --format 'value(status.url)')

echo "=========================================================="
echo " Deployment Complete!"
echo " Live Production URL: $SERVICE_URL"
echo "=========================================================="
