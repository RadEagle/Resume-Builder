data "terraform_remote_state" "prod" {
  backend = "s3"

  config = {
    bucket = "jqc-resume-tailor-state"
    key    = "prod/services/simple-webserver/terraform.tfstate"
    region = "us-east-1"
  }
}

data "terraform_remote_state" "staging" {
  backend = "s3"

  config = {
    bucket = "jqc-resume-tailor-state"
    key    = "stage/services/simple-webserver/terraform.tfstate"
    region = "us-east-1"
  }
}

resource "aws_route53_zone" "primary" {
  name = var.domain_name
}

resource "aws_route53_record" "plain" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = 300
  records = [data.terraform_remote_state.prod.outputs.instance_elastic_ip]
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"
  ttl     = 300
  records = [data.terraform_remote_state.prod.outputs.instance_elastic_ip]
}

resource "aws_route53_record" "staging" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "${var.staging_subdomain}.${var.domain_name}"
  type    = "A"
  ttl     = 300
  records = [data.terraform_remote_state.staging.outputs.instance_public_ip]
}