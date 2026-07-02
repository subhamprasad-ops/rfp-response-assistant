# Incident Response & Business Continuity

**Policy ID:** SEC-INC-04
**Owner:** Security Operations
**Last Reviewed:** 2026-02-11

## Incident Response Program

Meridian Cloud maintains a documented incident response plan aligned to NIST SP 800-61. A dedicated Security Operations Center (SOC) monitors production systems 24/7/365 using automated threat detection and anomaly alerting.

## Severity Classification

Incidents are classified SEV-1 through SEV-4 based on customer impact and data exposure risk. SEV-1 (confirmed data breach or full outage) triggers immediate executive escalation and activation of the cross-functional incident commander process.

## Customer Notification

In the event of a confirmed security incident involving customer data, affected customers are notified within 72 hours of confirmation, consistent with GDPR Article 33 requirements, via the contact designated in the customer's security notification settings. Notifications include a description of the incident, data categories affected, and remediation steps taken.

## Disaster Recovery & Business Continuity

- **RPO (Recovery Point Objective):** 15 minutes, via continuous database replication.
- **RTO (Recovery Time Objective):** 4 hours for full production restoration in a secondary region.
- Disaster recovery failover is tested twice per year with documented results available to Enterprise customers on request.
- Production infrastructure runs across a minimum of two availability zones in every active region.

## Penetration Testing

An independent third-party firm performs penetration testing at least annually, and after any major architecture change. Executive summaries are available under NDA; full reports are available to Enterprise customers who have signed an NDA and non-disclosure of vulnerability details.

## Bug Bounty

Meridian Cloud operates a private, invite-only bug bounty program with a major bug bounty platform, supplemented by a public responsible-disclosure email address monitored by the Security team.

## Customer Questions This Policy Typically Answers

- What is your incident response process?
- How quickly will you notify us of a breach?
- What are your RPO and RTO?
- Do you conduct penetration testing? Can we see the results?
- Do you have a bug bounty program?
- What is your uptime / disaster recovery approach?
