output "vpc_id" {
  value       = module.vpc.vpc_id
  description = "The ID of the VPC"
}

output "staging_public_subnet_id" {
  value       = module.vpc.staging_public_subnet_id
  description = "The ID of the staging public subnet"
}

output "production_public_subnet_id" {
  value       = module.vpc.production_public_subnet_id
  description = "The ID of the production public subnet"
}