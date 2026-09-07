#!/usr/bin/env bash
# ==============================================================================
# Deploy SaaS Applications & API Gateway to Google Cloud Run
# Idempotent: Builds containers, pushes to Artifact Registry, deploys to Cloud Run.
# ==============================================================================
set -e

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
  echo "Error: No active GCP project found. Run 'gcloud config set project <PROJECT_ID>' first."
  exit 1
fi

REGION="${GCP_REGION:-asia-southeast1}"
REGISTRY="${REGION}-docker.pkg.dev/${PROJECT_ID}/deka"
TAG="${TAG:-latest}"

echo "=========================================================="
echo " Deploying Cloud Run Services to: $REGION"
echo " Registry: $REGISTRY"
echo "=========================================================="

# 1. Deploy deka-api (Cloud Run Gateway)
echo "[1/3] Building and Deploying deka-api..."
docker build -t "${REGISTRY}/api:${TAG}" -f apps/api/Dockerfile apps/api
docker push "${REGISTRY}/api:${TAG}"

gcloud run deploy deka-api \
  --image "${REGISTRY}/api:${TAG}" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 20 \
  --concurrency 100 \
  --timeout 60 \
  --service-account "deka-cloud-run@${PROJECT_ID}.iam.gserviceaccount.com" \
  --set-env-vars "NODE_ENV=production,GCS_BUCKET=deka-media-${PROJECT_ID},GCP_PROJECT_ID=${PROJECT_ID}"

API_URL=$(gcloud run services describe deka-api --region "$REGION" --format 'value(status.url)')
echo "deka-api deployed: $API_URL"

# 2. Deploy deka-may (MÂY SaaS Frontend)
echo "[2/3] Building and Deploying deka-may..."
docker build -t "${REGISTRY}/may:${TAG}" -f apps/may/Dockerfile apps/may
docker push "${REGISTRY}/may:${TAG}"

gcloud run deploy deka-may \
  --image "${REGISTRY}/may:${TAG}" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --concurrency 80 \
  --timeout 60 \
  --service-account "deka-cloud-run@${PROJECT_ID}.iam.gserviceaccount.com" \
  --set-env-vars "NODE_ENV=production,NEXT_PUBLIC_API_URL=${API_URL}"

MAY_URL=$(gcloud run services describe deka-may --region "$REGION" --format 'value(status.url)')
echo "deka-may deployed: $MAY_URL"

# 3. Deploy deka-tools (SaaS Utility Tools)
echo "[3/3] Building and Deploying deka-tools..."
docker build -t "${REGISTRY}/tools:${TAG}" -f apps/tools/Dockerfile apps/tools
docker push "${REGISTRY}/tools:${TAG}"

gcloud run deploy deka-tools \
  --image "${REGISTRY}/tools:${TAG}" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 5 \
  --service-account "deka-cloud-run@${PROJECT_ID}.iam.gserviceaccount.com" \
  --set-env-vars "NODE_ENV=production"

TOOLS_URL=$(gcloud run services describe deka-tools --region "$REGION" --format 'value(status.url)')

echo "=========================================================="
echo " All Cloud Run services deployed successfully!"
echo " MÂY SaaS Web App: $MAY_URL"
echo " API Gateway:     $API_URL"
echo " SaaS Tools:      $TOOLS_URL"
echo "=========================================================="
