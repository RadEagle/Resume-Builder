output "staging_fqdn" {
  value       = aws_route53_record.staging.fqdn
  description = "The fully qualified domain name for the staging environment"
}

output "apex_fqdn" {
  value       = aws_route53_record.plain.fqdn
  description = "The fully qualified domain name for the production environment"
}

output "name_servers" {
  value       = data.aws_route53_zone.primary.name_servers
  description = "The list of records that direct computers where to find the servers"
}
