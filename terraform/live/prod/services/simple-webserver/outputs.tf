output "instance_id" {
  value       = module.simple-webserver.instance_id
  description = "The ID of the EC2 instance."
}

output "instance_public_ip" {
  value       = module.simple-webserver.instance_public_ip
  description = "The public IP address of the EC2 instance."
}

output "instance_elastic_ip" {
  value       = module.simple-webserver.instance_elastic_ip
  description = "The Elastic IP address of the EC2 instance."
}