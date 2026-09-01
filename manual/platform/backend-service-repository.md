---
title: Services and repositories
summary: One backend boundary — transport, service, repository — and the test evidence each seam owes.
spec: backend-service-repository
---

A backend change can be declared correct today when service tests prove a
business branch but never execute the generated query — so a malformed join, a
missing constraint or a transaction boundary can reach a trader-facing path
under a green unit suite. This convention defines the shared boundary every
backend follows: transport at the edge, services owning business decisions and
transactions, repositories owning persistence.

The evidence is the point. A new or materially changed persistent use case
carries low-setup service tests, generated-query tests, and repository
execution tests against migrated in-memory Postgres — the fast lanes the
codebase already has, made a minimum rather than an option.

The reference practice is Spring Boot's controller → service → repository
separation with the service owning the transaction — the shape, not the
framework: no Spring, no JPA, no framework base class comes with it.
