#!/usr/bin/env bash
# ==============================================================================
# Production Smoke Test Suite for MÂY / DEKA Ecosystem
# ==============================================================================
set -e

API_URL="${API_URL:-http://localhost:8080}"
echo "=========================================================="
echo " Running Production Smoke Tests against: $API_URL"
echo "=========================================================="

# 1. Health Check
echo -n "[Test 1/5] Testing GET /health ... "
HEALTH_RESP=$(curl -s -w "\n%{http_code}" "$API_URL/health")
HTTP_CODE=$(echo "$HEALTH_RESP" | tail -n1)
BODY=$(echo "$HEALTH_RESP" | head -n -1)

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "PASSED (HTTP 200)"
else
  echo "FAILED (HTTP $HTTP_CODE): $BODY"
  exit 1
fi

# 2. Readiness Check
echo -n "[Test 2/5] Testing GET /ready ... "
READY_RESP=$(curl -s -w "\n%{http_code}" "$API_URL/ready")
READY_CODE=$(echo "$READY_RESP" | tail -n1)
if [ "$READY_CODE" -eq 200 ]; then
  echo "PASSED (HTTP 200)"
else
  echo "WARNING (HTTP $READY_CODE) - check database connection"
fi

# 3. Signed Upload URL Generation
echo -n "[Test 3/5] Testing POST /assets/upload-request ... "
UPLOAD_REQ=$(curl -s -X POST "$API_URL/assets/upload-request" \
  -H "Content-Type: application/json" \
  -d '{"filename": "test-product.png", "mimeType": "image/png"}')

if echo "$UPLOAD_REQ" | grep -q "uploadUrl"; then
  echo "PASSED (Signed URL issued)"
else
  echo "FAILED: $UPLOAD_REQ"
  exit 1
fi

# 4. Asynchronous Job Enqueueing
echo -n "[Test 4/5] Testing POST /jobs ... "
JOB_REQ=$(curl -s -X POST "$API_URL/jobs" \
  -H "Content-Type: application/json" \
  -d '{"jobType": "IMAGE_ENHANCE", "assetId": "smoke-test-asset", "payload": {"protectLabels": true}}')

if echo "$JOB_REQ" | grep -q "queued"; then
  echo "PASSED (Job enqueued)"
else
  echo "FAILED: $JOB_REQ"
  exit 1
fi

# 5. Direct AI Endpoint Check
echo -n "[Test 5/5] Testing POST /ai/analyze ... "
AI_REQ=$(curl -s -X POST "$API_URL/ai/analyze" \
  -H "Content-Type: application/json" \
  -d '{"assetId": "smoke-test-asset", "prompt": "Check mandelic acid label"}')

if echo "$AI_REQ" | grep -q "AI_PRODUCT_ANALYSIS"; then
  echo "PASSED (AI Job accepted)"
else
  echo "FAILED: $AI_REQ"
  exit 1
fi

echo "=========================================================="
echo " ALL SMOKE TESTS PASSED SUCCESSFULLY!"
echo "=========================================================="
