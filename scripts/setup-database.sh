#!/usr/bin/env bash
# ==============================================================================
# Managed PostgreSQL Setup Script for MÂY / DEKA Ecosystem
# ==============================================================================
set -e

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
  echo "Error: No active GCP project found."
  exit 1
fi

REGION="${GCP_REGION:-asia-southeast1}"
INSTANCE_NAME="deka-db"
DB_NAME="deka_production"
DB_USER="deka_admin"

echo "=========================================================="
echo " Database Setup: Cloud SQL PostgreSQL ($INSTANCE_NAME)"
echo " Project: $PROJECT_ID | Region: $REGION"
echo "=========================================================="

if ! gcloud sql instances describe "$INSTANCE_NAME" &>/dev/null; then
  echo "Generating secure database password..."
  DB_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=' | cut -c1-20)

  echo "Creating cost-optimized Cloud SQL instance (db-custom-1-3840)..."
  gcloud sql instances create "$INSTANCE_NAME" \
    --database-version="POSTGRES_16" \
    --tier="db-custom-1-3840" \
    --region="$REGION" \
    --storage-size=20GB \
    --storage-auto-increase \
    --storage-type=SSD \
    --backup-start-time="02:00" \
    --enable-point-in-time-recovery=false \
    --availability-type="ZONAL" # Zonal saves 50% vs Regional HA for cost control

  echo "Creating database '$DB_NAME'..."
  gcloud sql databases create "$DB_NAME" --instance="$INSTANCE_NAME"

  echo "Creating user '$DB_USER'..."
  gcloud sql users create "$DB_USER" \
    --instance="$INSTANCE_NAME" \
    --password="$DB_PASSWORD"

  CONNECTION_NAME=$(gcloud sql instances describe "$INSTANCE_NAME" --format='value(connectionName)')
  DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@/${DB_NAME}?host=/cloudsql/${CONNECTION_NAME}"

  echo "Storing DATABASE_URL in Google Secret Manager..."
  echo -n "$DATABASE_URL" | gcloud secrets create DATABASE_URL --data-file=- 2>/dev/null || \
    echo -n "$DATABASE_URL" | gcloud secrets versions add DATABASE_URL --data-file=-

  echo "Database created successfully and credentials stored in Secret Manager."
else
  echo "Cloud SQL instance '$INSTANCE_NAME' already exists."
fi
