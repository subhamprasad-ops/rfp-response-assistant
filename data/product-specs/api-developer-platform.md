# API & Developer Platform

**Doc ID:** PROD-API-02
**Owner:** Developer Platform Team
**Last Reviewed:** 2026-04-18

## API Availability

Meridian Cloud exposes a REST API (JSON) and a GraphQL API covering 100% of functionality available in the web application — there is no functionality exclusive to the UI. Full OpenAPI 3.1 and GraphQL schema specifications are publicly published.

## Authentication

API access uses OAuth 2.0 client credentials flow or scoped API keys. API keys can be restricted to specific workspaces, IP ranges, and permission scopes. Tokens expire after 1 hour by default and support refresh token rotation.

## Rate Limits

- Standard plan: 300 requests/minute per workspace
- Business plan: 1,200 requests/minute per workspace
- Enterprise plan: custom limits negotiated per contract, with dedicated capacity available

Rate limit status is returned in response headers (`X-RateLimit-Remaining`, `X-RateLimit-Reset`).

## Webhooks & Events

Customers can subscribe to over 40 event types (record created, workflow failed, user provisioned, etc.) via outbound webhooks with HMAC signature verification, or stream events to a Kafka-compatible endpoint on Enterprise plans.

## SDKs

Official SDKs are maintained for Python, Node.js/TypeScript, Java, and Go. Community-maintained SDKs exist for Ruby and PHP but are not officially supported.

## Sandbox Environment

Every workspace includes a free sandbox environment with synthetic data for testing integrations before promoting workflows to production.

## Customer Questions This Doc Typically Answers

- Do you have a public API? REST or GraphQL?
- What are your API rate limits?
- Do you support webhooks?
- What SDKs/client libraries do you provide?
- Is there a sandbox/test environment?
