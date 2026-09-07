# MÂY / DEKA Google Cloud Cost Control & Credit Preservation Strategy

## 1. Goal & Philosophy

This infrastructure is engineered to maximize runway from existing Google Cloud promotional credits while maintaining sustained, predictable, and ultra-low recurring operating costs when self-paying.

**Core Rules**:
1. **Never pay for idle compute**: Public apps scale to zero.
2. **Never pay for managed cluster orchestrators**: No Google Kubernetes Engine ($74+/month base fee per cluster avoided).
3. **No network egress traps**: Binary files stream directly to Cloud Storage via Signed URLs; no dual-hop streaming through Cloud Run.
4. **Automated asset lifecycle**: Temporary files are deleted after 3 days; stale assets transition to nearline storage after 60 days.
5. **Right-sized Compute Engine**: Use standard or high-efficiency machine types (`e2-standard-2`), optionally configured with scheduled stops during off-peak windows.

---

## 2. Service-by-Service Cost Breakdown

| Component | Target Service | Cost Strategy | Estimated Baseline Cost |
| :--- | :--- | :--- | :--- |
| **MÂY Web UI** | Cloud Run | `min-instances: 0`, `max-instances: 10`, 1 CPU, 1Gi RAM | **$0.00** when idle. Within GCP Free Tier (first 2M requests/mo free). |
| **Public API** | Cloud Run | `min-instances: 0`, `max-instances: 20`, 1 CPU, 512Mi RAM | **$0.00** when idle. |
| **DEKA Server** | Compute Engine | `e2-standard-2` (2 vCPU, 8 GB RAM) + 50 GB Balanced PD | **~$48 - $52 / month** (or ~$25/month if scheduled 12h/day). Eligible for GCP credits. |
| **Media Storage** | Cloud Storage | Standard Tier with lifecycle rules (auto-cleanup) | **~$0.02 / GB / month** (first 5GB free). |
| **Database** | Cloud SQL Postgres | `db-custom-1-3840` or containerized Postgres on DEKA Server | **~$10 - $35 / month** (or $0 added cost if hosted in Docker on DEKA VM). |
| **Artifact Registry** | Container Storage | 30-day untagged image cleanup policy | **~$0.10 / GB / month** (first 0.5GB free). |
| **Secret Manager** | Google Secret Manager| Stores prod credentials and API keys | **$0.00** (first 6 secret versions active are free). |

---

## 3. Key Cost Optimization Mechanisms

### 3.1 Cloud Run Cold Starts & Zero Scaling
Cloud Run billing is calculated on millisecond CPU/RAM usage while processing requests.
By enforcing:
```yaml
min-instances: 0
max-instances: 5
concurrency: 80
timeout: 60s
```
If your site receives zero visitors at night, **compute cost is exactly $0.00**.

### 3.2 Compute Engine Efficiency & Scheduled Sleep
The DEKA Server runs workers in Docker containers. For non-24/7 internal processing:
1. **VM Resizing**: Start on `e2-standard-2` (2 vCPUs, 8 GB memory). If video volume increases, scale up to `e2-highcpu-4` with one gcloud command without rearchitecting.
2. **Nightly Cloud Scheduler Sleep (Optional)**:
   If your team only processes media during daytime hours, a Cloud Scheduler job can shut the VM down at 10 PM and boot it at 8 AM:
   ```bash
   # Daily stop at 22:00
   gcloud scheduler jobs create http stop-deka-server \
     --schedule="0 22 * * *" \
     --uri="https://compute.googleapis.com/compute/v1/projects/$PROJECT_ID/zones/$ZONE/instances/deka-server/stop" \
     --oauth-service-account-email="deka-deploy@$PROJECT_ID.iam.gserviceaccount.com"
   ```
   *Savings: Reduces Compute Engine cost by 40-50%.*

### 3.3 Storage Lifecycle Automation (`infrastructure/storage/lifecycle.json`)
Without automated lifecycle policies, uploaded videos and intermediate temporary frames accumulate indefinitely, ballooning storage bills.
We enforce:
- **`temp/` and `uploads/unconfirmed/`**: Automatically deleted after 3 days.
- **`processed/` and `exports/`**: Converted to `NEARLINE` storage after 60 days, cutting storage cost from $0.020/GB to $0.010/GB.

### 3.4 Direct Browser-to-GCS Transfers (Zero Ingress / Single Egress)
- Direct HTTP PUT via V4 Signed URL incurs **zero ingress cost** into GCP.
- Bypassing Cloud Run eliminates the double bandwidth fee (Client -> Cloud Run -> GCS).

### 3.5 AI Token & Budget Protection
Gemini AI calls are routed through `services/ai-worker`:
- Every call records consumed prompt and candidate tokens in `usage_ledger`.
- Hard per-user and per-project token rate limits prevent accidental runaway generation loops.

---

## 4. How to Monitor Credit Consumption & Set Alerts

Set up automated billing budget alerts in Google Cloud Console:

1. **Create Budget Alert**:
   ```bash
   # Threshold alerts at 50%, 80%, and 100% of monthly budget
   gcloud billing budgets create \
     --billing-account="YOUR_BILLING_ACCOUNT_ID" \
     --display-name="MÂY-Production-Budget" \
     --budget-amount=100USD \
     --threshold-rule=percent=0.5 \
     --threshold-rule=percent=0.8 \
     --threshold-rule=percent=1.0 \
     --all-updates-rule-pubsub-topic="projects/$PROJECT_ID/topics/billing-alerts"
   ```
2. **Track Burn Rate**:
   Navigate to `Google Cloud Console -> Billing -> Reports` and filter by Project `deka-production`.

---

## 5. Emergency Resource Teardown (Stop Spending Immediately)

If you ever need to freeze costs immediately:

```bash
# 1. Stop the Compute Engine DEKA Server (stops all VM billing immediately)
gcloud compute instances stop deka-server --zone=asia-southeast1-b

# 2. Scale Cloud Run down to zero maximum instances
gcloud run services update deka-may --max-instances=0 --region=asia-southeast1
gcloud run services update deka-api --max-instances=0 --region=asia-southeast1

# 3. Stop Cloud SQL instance (if using managed Cloud SQL)
gcloud sql instances patch deka-db --activation-policy=NEVER
```
Executing these 3 commands brings running infrastructure spend to virtually $0/day (disk preservation only).
