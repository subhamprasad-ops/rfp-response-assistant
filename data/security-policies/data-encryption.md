# Data Encryption Policy

**Policy ID:** SEC-ENC-01
**Owner:** Security Engineering
**Last Reviewed:** 2026-03-14

## Encryption at Rest

All customer data stored within Meridian Cloud infrastructure is encrypted at rest using AES-256. Encryption keys are managed through a dedicated hardware security module (HSM)-backed key management service. Keys are rotated automatically every 90 days, and customers on Enterprise plans may bring their own encryption keys (BYOK) via AWS KMS or Google Cloud KMS integration.

## Encryption in Transit

All data in transit between customer systems and Meridian Cloud is encrypted using TLS 1.2 or higher. TLS 1.0 and 1.1 are disabled on all public endpoints. Internal service-to-service communication within our production environment is also encrypted using mutual TLS (mTLS).

## Database-Level Encryption

Primary and replica databases use transparent data encryption (TDE). Backups are encrypted with a separate key hierarchy from production data, ensuring that a compromise of production keys does not expose backup archives.

## Key Management

- Keys are never stored alongside the data they encrypt.
- Access to key management systems is restricted to a named set of security engineers and requires hardware MFA token approval.
- All key access events are logged to an immutable audit trail retained for 7 years.

## Field-Level Encryption

Sensitive fields (e.g., SSNs, payment identifiers, government IDs) that customers choose to store are additionally encrypted at the application layer before being written to the database, so that database administrators cannot view plaintext values.

## Customer Questions This Policy Typically Answers

- Do you encrypt data at rest and in transit?
- What encryption standard do you use (AES-256, TLS version)?
- Can we bring our own encryption keys?
- How often are encryption keys rotated?
- Is backup data encrypted separately from production data?
