# Access Control & Authentication Policy

**Policy ID:** SEC-ACC-02
**Owner:** Security Engineering
**Last Reviewed:** 2026-04-02

## Principle of Least Privilege

Access to production systems and customer data is granted strictly on a least-privilege, need-to-know basis. All access requests require manager approval and are reviewed quarterly by the Security team. Unused access is automatically revoked after 30 days of inactivity.

## Employee Authentication

All Meridian Cloud employees authenticate to internal systems using single sign-on (SSO) backed by SAML 2.0, with mandatory hardware-key or authenticator-app multi-factor authentication (MFA). Password-only authentication is disabled company-wide.

## Customer-Facing Authentication

Customers can configure the following authentication methods for their Meridian Cloud workspace:

- SSO via SAML 2.0 or OpenID Connect (Okta, Azure AD, Google Workspace, OneLogin, Ping Identity)
- SCIM-based automated user provisioning and de-provisioning
- Enforced MFA for all workspace members (Enterprise and Business plans)
- Role-based access control (RBAC) with custom roles and granular permissions down to the resource level
- IP allowlisting and session timeout policies configurable per workspace

## Privileged Access Management

Engineers who need temporary elevated access to production (e.g., for incident response) must request just-in-time access through a break-glass workflow, which is time-boxed to 4 hours and automatically logged and reviewed by a second engineer within 24 hours.

## Background Checks

All employees and contractors with access to production systems undergo a criminal background check and reference verification prior to hire.

## Customer Questions This Policy Typically Answers

- Do you support SSO/SAML? Which identity providers?
- Do you support SCIM provisioning?
- Can we enforce MFA for our users?
- What is your internal access control model?
- Do you perform background checks on employees?
- Do you support IP allowlisting?
