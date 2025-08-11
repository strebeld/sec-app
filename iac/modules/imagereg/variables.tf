variable "project_id" {
  description = "The GCP project ID to deploy resources into."
  type        = string
  default = "clgcporg10-170"
}

variable "region" {
  description = "The GCP region for all resources."
  type        = string
  default     = "us-central1"
}