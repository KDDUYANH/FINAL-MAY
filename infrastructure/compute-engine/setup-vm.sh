#!/usr/bin/env bash
# ==============================================================================
# DEKA Server (Compute Engine) VM Provisioning Script
# ==============================================================================
set -e

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
  echo "Error: No active GCP project configured."
  exit 1
fi

INSTANCE_NAME="deka-server"
ZONE="${GCP_ZONE:-asia-southeast1-b}"
MACHINE_TYPE="${GCP_MACHINE_TYPE:-e2-standard-2}" # 2 vCPU, 8 GB memory
BOOT_DISK_SIZE="50GB"

echo "=========================================================="
echo " Provisioning DEKA Server VM on Google Compute Engine"
echo " Project: $PROJECT_ID | Zone: $ZONE | Type: $MACHINE_TYPE"
echo "=========================================================="

# Check if instance already exists
if gcloud compute instances describe "$INSTANCE_NAME" --zone="$ZONE" &>/dev/null; then
  echo "Instance '$INSTANCE_NAME' already exists in zone '$ZONE'. Skipping creation."
  exit 0
fi

# 1. Create Firewall Rules (80, 443, 22)
echo "[1/3] Ensuring firewall rules for DEKA Server..."
if ! gcloud compute firewall-rules describe allow-deka-web &>/dev/null; then
  gcloud compute firewall-rules create allow-deka-web \
    --allow=tcp:80,tcp:443 \
    --target-tags=deka-server \
    --description="Allow incoming HTTP and HTTPS traffic to DEKA Server"
fi

# 2. Provision VM Instance
echo "[2/3] Launching Compute Engine instance '$INSTANCE_NAME'..."
gcloud compute instances create "$INSTANCE_NAME" \
  --zone="$ZONE" \
  --machine-type="$MACHINE_TYPE" \
  --image-family="debian-12" \
  --image-project="debian-cloud" \
  --boot-disk-size="$BOOT_DISK_SIZE" \
  --boot-disk-type="pd-balanced" \
  --tags="deka-server,http-server,https-server" \
  --service-account="deka-worker@${PROJECT_ID}.iam.gserviceaccount.com" \
  --scopes="cloud-platform" \
  --metadata-from-file="user-data=infrastructure/compute-engine/cloud-init.yaml"

echo "[3/3] Fetching external IP address..."
EXTERNAL_IP=$(gcloud compute instances describe "$INSTANCE_NAME" --zone="$ZONE" --format='get(networkInterfaces[0].accessConfigs[0].natIP)')

echo "=========================================================="
echo " DEKA Server provisioned successfully!"
echo " Public IP: $EXTERNAL_IP"
echo " SSH Command: gcloud compute ssh $INSTANCE_NAME --zone=$ZONE"
echo "=========================================================="
