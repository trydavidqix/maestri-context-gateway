locals {
  prefix = "nexus-${var.environment}"

  services = toset([
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "storage.googleapis.com",
    "secretmanager.googleapis.com",
    "artifactregistry.googleapis.com",
    "iam.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "serviceusage.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
    # Required for the approved budget alerts; absent from the owner's API allowlist.
    "billingbudgets.googleapis.com",
  ])
}

data "google_project" "current" {
  project_id = var.project_id
}

resource "google_project_service" "required" {
  for_each                   = local.services
  project                    = var.project_id
  service                    = each.value
  disable_dependent_services = false
  disable_on_destroy         = false
}

resource "google_service_account" "hindsight_api" {
  project      = var.project_id
  account_id   = "${local.prefix}-hindsight-api"
  display_name = "Nexus ${var.environment} Hindsight API"
  depends_on   = [google_project_service.required]
}

resource "google_service_account" "hindsight_worker" {
  project      = var.project_id
  account_id   = "${local.prefix}-hindsight-worker"
  display_name = "Nexus ${var.environment} Hindsight worker"
  depends_on   = [google_project_service.required]
}

resource "google_sql_database_instance" "postgres" {
  project             = var.project_id
  name                = "${local.prefix}-postgres"
  region              = var.region
  database_version    = "POSTGRES_16"
  deletion_protection = true

  settings {
    tier              = "db-f1-micro"
    availability_type = "ZONAL"
    disk_type         = "PD_SSD"
    disk_size         = 10
    disk_autoresize   = false

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = false

      backup_retention_settings {
        retained_backups = 7
        retention_unit   = "COUNT"
      }
    }

    ip_configuration {
      ipv4_enabled   = true
      ssl_mode       = "ENCRYPTED_ONLY"
      server_ca_mode = "GOOGLE_MANAGED_INTERNAL_CA"
    }
  }

  depends_on = [google_project_service.required]
}

resource "google_sql_database" "hindsight" {
  project  = var.project_id
  name     = "hindsight"
  instance = google_sql_database_instance.postgres.name
}

resource "google_storage_bucket" "recovery" {
  project                     = var.project_id
  name                        = "${local.prefix}-recovery-${var.project_id}"
  location                    = var.region
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
  force_destroy               = false

  versioning {
    enabled = true
  }

  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      age = 30
    }
  }

  soft_delete_policy {
    retention_duration_seconds = 604800
  }

  depends_on = [google_project_service.required]
}

resource "google_storage_bucket" "state" {
  project                     = var.project_id
  name                        = "${local.prefix}-tofu-state-${var.project_id}"
  location                    = var.region
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
  force_destroy               = false

  versioning {
    enabled = true
  }

  soft_delete_policy {
    retention_duration_seconds = 604800
  }

  lifecycle {
    prevent_destroy = true
  }

  depends_on = [google_project_service.required]
}

resource "google_artifact_registry_repository" "hindsight_upstream" {
  project       = var.project_id
  location      = var.region
  repository_id = "${local.prefix}-hindsight-upstream"
  description   = "Remote cache for signed upstream Hindsight images."
  format        = "DOCKER"
  mode          = "REMOTE_REPOSITORY"

  remote_repository_config {
    docker_repository {
      custom_repository {
        uri = "https://ghcr.io"
      }
    }
  }

  depends_on = [google_project_service.required]
}

resource "google_secret_manager_secret" "hindsight_database_url" {
  project   = var.project_id
  secret_id = "${local.prefix}-hindsight-database-url"

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }

  depends_on = [google_project_service.required]
}

resource "google_secret_manager_secret" "hindsight_llm_key" {
  project   = var.project_id
  secret_id = "${local.prefix}-hindsight-llm-key"

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }

  depends_on = [google_project_service.required]
}

resource "google_secret_manager_secret" "postgres_operator_password" {
  project   = var.project_id
  secret_id = "${local.prefix}-postgres-operator-password"

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }

  depends_on = [google_project_service.required]
}

resource "google_secret_manager_secret_iam_member" "api_database_url" {
  project   = var.project_id
  secret_id = google_secret_manager_secret.hindsight_database_url.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.hindsight_api.email}"
}

resource "google_secret_manager_secret_iam_member" "worker_database_url" {
  project   = var.project_id
  secret_id = google_secret_manager_secret.hindsight_database_url.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.hindsight_worker.email}"
}

resource "google_secret_manager_secret_iam_member" "api_llm_key" {
  project   = var.project_id
  secret_id = google_secret_manager_secret.hindsight_llm_key.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.hindsight_api.email}"
}

resource "google_secret_manager_secret_iam_member" "worker_llm_key" {
  project   = var.project_id
  secret_id = google_secret_manager_secret.hindsight_llm_key.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.hindsight_worker.email}"
}

resource "google_project_iam_member" "api_cloudsql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.hindsight_api.email}"

  condition {
    title      = "Nexus dev Hindsight API Cloud SQL instance only"
    expression = "resource.name == \"projects/${var.project_id}/instances/${google_sql_database_instance.postgres.name}\""
  }
}

resource "google_project_iam_member" "worker_cloudsql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.hindsight_worker.email}"

  condition {
    title      = "Nexus dev Hindsight worker Cloud SQL instance only"
    expression = "resource.name == \"projects/${var.project_id}/instances/${google_sql_database_instance.postgres.name}\""
  }
}

resource "google_cloud_run_v2_service" "hindsight_api" {
  count               = var.enable_hindsight_runtime ? 1 : 0
  project             = var.project_id
  name                = "${local.prefix}-hindsight-api"
  location            = var.region
  ingress             = "INGRESS_TRAFFIC_INTERNAL_ONLY"
  deletion_protection = true

  template {
    service_account                  = google_service_account.hindsight_api.email
    execution_environment            = "EXECUTION_ENVIRONMENT_GEN2"
    max_instance_request_concurrency = 10
    scaling {
      min_instance_count = 0
      max_instance_count = 1
    }

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.hindsight_upstream.repository_id}/vectorize-io/hindsight-api@${var.hindsight_image_digest}"

      resources {
        limits = {
          cpu    = "1"
          memory = "2Gi"
        }
      }

      ports {
        container_port = 8080
      }

      command = ["hindsight-api"]
      args    = ["--host", "0.0.0.0", "--port", "8080"]

      env {
        name = "HINDSIGHT_API_DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.hindsight_database_url.secret_id
            version = "latest"
          }
        }
      }

      env {
        name  = "HINDSIGHT_API_LLM_PROVIDER"
        value = var.hindsight_llm_provider
      }

      env {
        name = "HINDSIGHT_API_LLM_API_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.hindsight_llm_key.secret_id
            version = "latest"
          }
        }
      }

      volume_mounts {
        name       = "cloudsql"
        mount_path = "/cloudsql"
      }
    }

    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.postgres.connection_name]
      }
    }
  }

  depends_on = [
    google_project_service.required,
    google_secret_manager_secret_iam_member.api_database_url,
    google_secret_manager_secret_iam_member.api_llm_key,
    google_project_iam_member.api_cloudsql_client,
  ]
}

resource "google_cloud_run_v2_worker_pool" "hindsight_worker" {
  count               = var.enable_hindsight_runtime ? 1 : 0
  project             = var.project_id
  name                = "${local.prefix}-hindsight-worker"
  location            = var.region
  deletion_protection = true

  scaling {
    scaling_mode          = "MANUAL"
    manual_instance_count = 1
  }

  template {
    service_account = google_service_account.hindsight_worker.email

    containers {
      image   = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.hindsight_upstream.repository_id}/vectorize-io/hindsight-api@${var.hindsight_image_digest}"
      command = ["hindsight-worker"]

      resources {
        limits = {
          cpu    = "1"
          memory = "2Gi"
        }
      }

      env {
        name = "HINDSIGHT_API_DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.hindsight_database_url.secret_id
            version = "latest"
          }
        }
      }

      env {
        name  = "HINDSIGHT_API_LLM_PROVIDER"
        value = var.hindsight_llm_provider
      }

      env {
        name = "HINDSIGHT_API_LLM_API_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.hindsight_llm_key.secret_id
            version = "latest"
          }
        }
      }

      env {
        name  = "HINDSIGHT_API_WORKER_ID"
        value = "${local.prefix}-hindsight-worker"
      }

      volume_mounts {
        name       = "cloudsql"
        mount_path = "/cloudsql"
      }
    }

    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.postgres.connection_name]
      }
    }
  }

  depends_on = [
    google_project_service.required,
    google_secret_manager_secret_iam_member.worker_database_url,
    google_secret_manager_secret_iam_member.worker_llm_key,
    google_project_iam_member.worker_cloudsql_client,
  ]
}

resource "google_billing_budget" "nexus_dev" {
  billing_account = var.billing_account_id
  display_name    = "${local.prefix} monthly spend alert"

  budget_filter {
    projects               = ["projects/${data.google_project.current.number}"]
    credit_types_treatment = "INCLUDE_ALL_CREDITS"
    calendar_period        = "MONTH"
  }

  amount {
    specified_amount {
      currency_code = "USD"
      units         = floor(var.monthly_budget_usd)
      nanos         = floor((var.monthly_budget_usd - floor(var.monthly_budget_usd)) * 1000000000)
    }
  }

  threshold_rules {
    threshold_percent = 0.5
  }
  threshold_rules {
    threshold_percent = 0.8
  }
  threshold_rules {
    threshold_percent = 1.0
    spend_basis       = "FORECASTED_SPEND"
  }

  depends_on = [google_project_service.required]
}

resource "google_monitoring_alert_policy" "hindsight_api_errors" {
  project      = var.project_id
  display_name = "${local.prefix} Hindsight API errors"
  combiner     = "OR"
  enabled      = true

  conditions {
    display_name = "Hindsight API HTTP 5xx responses"
    condition_threshold {
      filter          = "resource.type = \"cloud_run_revision\" AND resource.labels.service_name = \"${local.prefix}-hindsight-api\" AND metric.type = \"run.googleapis.com/request_count\" AND metric.labels.response_code_class = \"5xx\""
      comparison      = "COMPARISON_GT"
      threshold_value = 0
      duration        = "300s"
      aggregations {
        alignment_period   = "300s"
        per_series_aligner = "ALIGN_DELTA"
      }
    }
  }

  depends_on = [google_project_service.required]
}
