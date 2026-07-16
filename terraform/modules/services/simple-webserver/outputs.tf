output "instance_id" {
  description = "The ID of the EC2 instance."
  value       = aws_instance.resume_server.id
}

output "instance_public_ip" {
  description = "Stable public IP when EIP is enabled, otherwise ephemeral public IP"
  value       = var.enable_eip ? aws_eip.resume_server[0].public_ip : aws_instance.resume_server.public_ip
}

output "instance_private_ip" {
  description = "The private IP address of the EC2 instance."
  value       = aws_instance.resume_server.private_ip
}

output "instance_elastic_ip" {
  description = "The Elastic IP address of the EC2 instance."
  value       = var.enable_eip ? aws_eip.resume_server[0].public_ip : ""
}

output "instance_public_dns" {
  description = "The public DNS name of the EC2 instance."
  value       = aws_instance.resume_server.public_dns
}

output "instance_private_dns" {
  description = "The private DNS name of the EC2 instance."
  value       = aws_instance.resume_server.private_dns
}

output "instance_arn" {
  description = "The ARN of the EC2 instance."
  value       = aws_instance.resume_server.arn
}