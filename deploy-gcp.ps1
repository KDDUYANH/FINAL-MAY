# Deploy MÂY Image Studio to Google Cloud Run from PowerShell
$ErrorActionPreference = "Stop"

$PROJECT_ID = (gcloud config get-value project 2>$null)
if (-not $PROJECT_ID) {
    Write-Error "No active GCP project found. Run 'gcloud config set project <PROJECT_ID>' first."
    exit 1
}

$SERVICE_NAME = "may-image-studio"
$REGION = "asia-southeast1"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Deploying MÂY Image Studio to Google Cloud Run" -ForegroundColor Cyan
Write-Host " Project: $PROJECT_ID | Region: $REGION" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

Write-Host "[1/3] Submitting build to Cloud Build..." -ForegroundColor Yellow
gcloud builds submit --tag "gcr.io/$PROJECT_ID/${SERVICE_NAME}:latest" .

Write-Host "[2/3] Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $SERVICE_NAME `
    --image "gcr.io/$PROJECT_ID/${SERVICE_NAME}:latest" `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated `
    --port 8080 `
    --memory 1Gi `
    --cpu 1 `
    --min-instances 0 `
    --max-instances 5

$SERVICE_URL = (gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " Deployment Complete!" -ForegroundColor Green
Write-Host " Live Production URL: $SERVICE_URL" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
