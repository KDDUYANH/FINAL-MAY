#!/usr/bin/env bash
# ==============================================================================
# Deploy Worker & Internal Stack to DEKA Server (Compute Engine)
# ==============================================================================
set -e

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
  echo "Error: No active GCP project configured."
  exit 1
fi

ZONE="${GCP_ZONE:-asia-southeast1-b}"
REGION="${GCP_REGION:-asia-southeast1}"
INSTANCE_NAME="deka-server"
REGISTRY="${REGION}-docker.pkg.dev/${PROJECT_ID}/deka"
TAG="${TAG:-latest}"

echo "=========================================================="
echo " Deploying Workers to DEKA Server VM: $INSTANCE_NAME"
echo "=========================================================="

# 1. Build and push container images
echo "[1/4] Building and pushing media-worker..."
docker build -t "${REGISTRY}/media-worker:${TAG}" -f services/media-worker/Dockerfile services/media-worker
docker push "${REGISTRY}/media-worker:${TAG}"

echo "[2/4] Building and pushing ai-worker..."
docker build -t "${REGISTRY}/ai-worker:${TAG}" -f services/ai-worker/Dockerfile services/ai-worker
docker push "${REGISTRY}/ai-worker:${TAG}"

echo "[3/4] Building and pushing api-service (Internal Dispatcher)..."
docker build -t "${REGISTRY}/api-service:${TAG}" -f services/api-service/Dockerfile services/api-service
docker push "${REGISTRY}/api-service:${TAG}"

# 2. Upload Docker Compose and Caddy configuration to VM
echo "[4/4] Syncing configuration and updating containers on $INSTANCE_NAME..."
gcloud compute scp --zone="$ZONE" --recurse \
  docker/deka-server/docker-compose.yml \
  docker/deka-server/Caddyfile \
  "${INSTANCE_NAME}:/opt/deka/"

# 3. Pull latest images and restart stack remotely
gcloud compute ssh "$INSTANCE_NAME" --zone="$ZONE" --command="
  export REGISTRY_HOST=${REGION}-docker.pkg.dev
  export GCP_PROJECT_ID=${PROJECT_ID}
  export TAG=${TAG}
  cd /opt/deka
  gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet
  docker compose pull
  docker compose up -d --remove-orphans
  docker compose ps
"

echo "=========================================================="
echo " DEKA Server worker stack updated successfully!"
echo "=========================================================="
