output "db_address" {
  value       = module.rds.db_address
  description = "The address of the RDS instance"
}

output "db_port" {
  value       = module.rds.db_port
  description = "The port of the RDS instance"
}

output "db_name" {
  value       = module.rds.db_name
  description = "The name of the RDS instance"
}