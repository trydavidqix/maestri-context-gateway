variable "project_id" {
  description = "Explicit, owner-approved Google Cloud project ID. No gcloud default is used."
  type        = string

  validation {
    condition     = length(trimspace(var.project_id)) > 0
    error_message = "Set project_id explicitly to an approved Nexus project."
  }
}

variable "billing_account_id" {
  description = "Billing account approved for this Nexus project and project-scoped budget."
  type        = string
  sensitive   = true
}

variable "region" {
  description = "Primary Google Cloud region."
  type        = string
  default     = "europe-west1"

  validation {
    condition     = var.region == "europe-west1"
    error_message = "NB-03 currently approves europe-west1 only."
  }
}

variable "environment" {
  description = "Deployment environment."
  type        = string
  default     = "dev"

  validation {
    condition     = var.environment == "dev"
    error_message = "NB-03 currently authorizes dev only."
  }
}

variable "hindsight_llm_provider" {
  description = "Hindsight LLM provider name; set after choosing a provider and supplying its key through Secret Manager."
  type        = string
  default     = null
  nullable    = true
}

variable "enable_hindsight_runtime" {
  description = "Enable Hindsight API and worker only after required Secret Manager versions are populated."
  type        = bool
  default     = false
}

variable "monthly_budget_usd" {
  description = "Project budget threshold in USD. Budget notifications do not cap spend."
  type        = number
  default     = 75

  validation {
    condition     = var.monthly_budget_usd >= 1
    error_message = "Monthly budget must be at least 1 USD."
  }
}

variable "hindsight_image_digest" {
  description = "Immutable Hindsight API OCI index digest resolved from upstream release 0.10.1."
  type        = string
  default     = "sha256:35a1c04c3b50172707d627f82d7f7800d7695b8d9e630142354e3365e5ce56ba"

  validation {
    condition     = can(regex("^sha256:[a-f0-9]{64}$", var.hindsight_image_digest))
    error_message = "Set hindsight_image_digest to an immutable SHA-256 OCI digest."
  }
}
