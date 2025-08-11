provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_artifact_registry_repository" "sec_repo" {
  provider  = google
  location  = var.region
  repository_id = "sec-images"
  description   = "Docker repository for storing container images"
  format        = "DOCKER"
}
