output "db_address" {
  value       = aws_db_instance.postgresql.address
  description = "The address of the RDS instance"
}

output "db_port" {
  value       = aws_db_instance.postgresql.port
  description = "The port of the RDS instance"
}

output "db_name" {
  value       = aws_db_instance.postgresql.db_name
  description = "The name of the RDS instance"
}

output "security_group_id" {
  value       = aws_security_group.default.id
  description = "The ID of the RDS security group"
}

output "db_instance_arn" {
  value       = aws_db_instance.postgresql.arn
  description = "The ARN of the RDS instance"
}