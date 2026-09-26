# NB-03 Google Cloud baseline

This OpenTofu root prepares the `dev` baseline in `europe-west1`. It does not select a project, attach billing, or contain credentials. No resource is created by `init`, `fmt`, `validate`, or the local policy tests.

## Approval gates

Do not run `tofu apply` until the owner approves the exact project, its billing association, the monthly cost estimate, and the additional `billingbudgets.googleapis.com` API. The budget alert is not a spending cap.

The Hindsight provider and API key remain operator inputs. Runtime deployment defaults off until the database URL and provider key versions exist in Secret Manager. Store the Cloud SQL `postgres` operator password in its separate Secret Manager secret, set that password through the secure interactive Cloud SQL user flow, create the Hindsight login interactively, and run `infra/cloud/database/hindsight-bootstrap.sql` as the operator. Add the finished connection URL and provider key directly to Secret Manager. Runtime identities cannot read the operator-password secret. Do not add secret payloads, database passwords, `*.tfvars`, or state files to Git.

## Local checks

From the repository root on Windows:

```powershell
pwsh -File tooling/scripts/install-opentofu.ps1
& .\.tools\opentofu\tofu.exe fmt -check -recursive infra/cloud/tofu
& .\.tools\opentofu\tofu.exe -chdir=infra/cloud/tofu init -backend=false -input=false
& .\.tools\opentofu\tofu.exe -chdir=infra/cloud/tofu validate
node --test tests/integration/nb03-cloud-infrastructure.test.mjs
```

The committed provider lock file pins the signed Google provider. State and plan files are ignored by Git. Create only the state bucket first with a reviewed targeted plan, then migrate local state to the GCS backend before applying the rest. Never commit local or remote state.

After the owner approves and links billing, set `TF_VAR_project_id`, `TF_VAR_billing_account_id`, and `TF_VAR_monthly_budget_usd` from approved values. Initialize locally with `-backend=false`, review and apply only the state-bucket target, then reinitialize with `-migrate-state` and the state bucket name. Plan all remaining resources and review the saved plan before applying. Populate the two Secret Manager values outside OpenTofu; set `TF_VAR_hindsight_llm_provider` and `TF_VAR_enable_hindsight_runtime=true` only after the selected LLM provider and key are ready.

## Resources in this root

- The listed Google APIs plus `billingbudgets.googleapis.com` for a project-filtered monthly budget and default billing email notifications.
- Two dedicated runtime service accounts; per-secret Secret Manager access; Cloud SQL Client limited to the single database instance.
- One zonal PostgreSQL 16 `db-f1-micro` instance, 10 GiB SSD, one database, automatic backups, and no point-in-time recovery at this milestone.
- One versioned, private, regional recovery bucket with a 30-day lifecycle and seven-day soft-delete window.
- One versioned, private OpenTofu state bucket with a seven-day soft-delete window and deletion protection.
- One Artifact Registry remote Docker repository for the public Hindsight image hosted on GHCR.
- One private, request-billed Hindsight API service (zero minimum, one maximum) and one manually pinned Hindsight worker pool (one instance). Both use separate service accounts and Secret Manager references.
- One Cloud Monitoring API error alert and a USD 75 monthly billing budget alert.

Hindsight release `0.10.1` image index is pinned to digest `sha256:35a1c04c3b50172707d627f82d7f7800d7695b8d9e630142354e3365e5ce56ba`. Verify its Cosign signature before first deployment. The full image requires 2 GiB for the API and worker; the worker remains provisioned continuously because Cloud Run worker pools use manual instance counts.

## Estimate

Planning estimate: **USD 35–60/month** with one continuously running 1-vCPU/2-GiB worker, the minimum zonal Cloud SQL instance with 10 GiB SSD, low storage use, and normal free-tier availability. Google publishes USD 16.83/month before free tier for a 1-vCPU/512-MiB worker pool; 2 GiB requires a higher memory estimate. Cloud SQL compute and 10 GiB SSD contribute about USD 11.06/month before backups. Exact charges vary by free-tier use, image cache size, backup growth, logs, network egress, and API traffic. Hindsight's external LLM usage is excluded and has no configured spend cap.

Cost sources (official): [Cloud Run](https://cloud.google.com/run/pricing), [Cloud SQL](https://cloud.google.com/sql/pricing), [Cloud Storage](https://cloud.google.com/storage/pricing), [Artifact Registry](https://cloud.google.com/artifact-registry/pricing), and [Hindsight deployment requirements](https://github.com/vectorize-io/hindsight/blob/main/skills/hindsight-docs/references/developer/installation.md).
