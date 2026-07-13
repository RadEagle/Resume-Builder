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

data "aws_route53_zone" "primary" {
  private_zone = false
  zone_id      = "Z0453937G5AXXWOT8SPM"
}

resource "aws_route53_record" "plain" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = 300
  records = [var.legacy_prod_ip]
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"
  ttl     = 300
  records = [var.legacy_prod_ip]
}

resource "aws_route53_record" "staging" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = "${var.staging_subdomain}.${var.domain_name}"
  type    = "A"
  ttl     = 300
  records = [data.terraform_remote_state.staging.outputs.instance_public_ip]
}

resource "aws_route53_record" "preview" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = "${var.preview_subdomain}.${var.domain_name}"
  type    = "A"
  ttl     = 300
  records = [data.terraform_remote_state.prod.outputs.instance_elastic_ip]
}