locals {
  inbound_rules = merge({
    ssh = {
      port        = 22
      protocol    = "tcp"
      cidr        = var.admin_ip_cidr
      description = "Allow SSH from admin IP"
    }
    http = {
      port        = 80
      protocol    = "tcp"
      cidr        = "0.0.0.0/0"
      description = "Allow public HTTP traffic"
    }
    },
    var.enable_https ? {
      https = {
        port        = 443
        protocol    = "tcp"
        cidr        = "0.0.0.0/0"
        description = "Allow public HTTPS traffic"
      }
    } : {}
  )
}

resource "aws_security_group" "resume_server" {
  name        = "${var.instance_name}-sg"
  description = "Security group for the resume servers"
  vpc_id      = var.vpc_id
}

resource "aws_vpc_security_group_ingress_rule" "dynamic_rules" {
  for_each = local.inbound_rules

  security_group_id = aws_security_group.resume_server.id
  description       = each.value.description

  cidr_ipv4   = each.value.cidr
  ip_protocol = each.value.protocol
  from_port   = each.value.port
  to_port     = each.value.port
}

resource "aws_vpc_security_group_egress_rule" "all_egress" {
  security_group_id = aws_security_group.resume_server.id
  description       = "Allow all egress traffic"

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "-1"
}