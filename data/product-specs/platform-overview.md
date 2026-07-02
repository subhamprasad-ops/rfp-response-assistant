# Meridian Cloud Platform Overview

**Doc ID:** PROD-OVW-01
**Owner:** Product Management
**Last Reviewed:** 2026-05-01

## What Meridian Cloud Is

Meridian Cloud is a managed data integration and workflow automation platform that lets enterprise teams connect, transform, and orchestrate data across their SaaS and internal systems without managing infrastructure.

## Deployment Options

- **Multi-tenant SaaS (standard):** hosted entirely by Meridian Cloud across US, EU, and APAC regions.
- **Single-tenant (Enterprise):** dedicated infrastructure isolated from other customers, available for an additional fee.
- **Private VPC peering:** Enterprise customers can peer their AWS VPC directly with our environment to avoid traffic traversing the public internet.
- We do not currently offer a fully self-hosted / on-premises deployment.

## Architecture

The platform runs on Kubernetes across multiple availability zones per region, with autoscaling compute for workflow execution. Core services include the Connector Engine, Transformation Layer, Orchestration Scheduler, and the Audit & Observability Layer, each independently scalable.

## Uptime & SLA

Meridian Cloud commits to 99.9% uptime for Business plans and 99.95% uptime for Enterprise plans, measured monthly, with service credits defined in the Master Services Agreement for any shortfall. Status and historical uptime are published at a public status page updated in real time.

## Integrations

Over 300 pre-built connectors are available, spanning CRM (Salesforce, HubSpot), data warehouses (Snowflake, BigQuery, Redshift), communication tools (Slack, Microsoft Teams), and cloud storage (S3, GCS, Azure Blob). A REST and GraphQL API supports custom connector development.

## Customer Questions This Doc Typically Answers

- Is this a SaaS product or can it be self-hosted?
- What is your platform architecture?
- What is your uptime SLA?
- What integrations/connectors are available?
- Do you support private networking (VPC peering)?
