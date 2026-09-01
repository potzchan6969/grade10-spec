**Author:** @htonyl - 2026-08-18

## Why

Backend changes can be declared correct when service tests prove a business branch but never execute the generated query. A malformed join, missing constraint, transaction boundary, or migration can therefore reach a trader-facing path despite a green unit suite. The current codebase already has fast Node and migrated PGlite lanes, but it does not define a shared boundary or a minimum test set for services and persistence.

This change establishes one backend convention so every product can add and change persistent behavior with the same reviewable separation and evidence. Success is measured by every newly introduced or materially changed persistent use case carrying the required service and repository evidence before it is accepted.

## What Changes

- Add the `backend-service-repository` capability, defining a shared transport, service, and repository boundary for all backend systems.
- Define the required backend TDD scope: low-setup service tests, generated-query tests, and migrated in-memory Postgres repository execution tests.
- Record Spring Boot's controller → service → repository separation and service-owned transaction boundary as the reference practice, without introducing Spring Boot, JPA, or a framework-specific base class.
- Plan the durable application-repository convention and a phased adoption of existing backends.

## Capabilities

### New Capabilities

- `backend-service-repository`: Shared backend boundaries and test evidence for business use cases and persistent data access.

### Modified Capabilities

- None.

## Impact

- Affected consumer: the Grade10 application repository, especially `apps/backend/**` and backend packages under `packages/**`.
- Durable guidance will be added to `docs/conventions/backend.md` in the application repository and `manual/platform/testing.md` here.
- Persistent workers and libraries will gradually adopt explicit services, repositories, unit fakes, query-shape tests, and PGlite execution tests. API gateways, log forwarding, and other stateless paths follow the transport/service boundary where relevant but do not gain artificial repositories.
- No public API, database engine, deployment topology, or frontend contract changes.

## Non-goals

- Introducing Spring Boot, JPA, a Java runtime, or a framework-wide base repository.
- Rewriting every backend in one delivery.
- Requiring repository interfaces where a domain has no persistence boundary.
- Replacing route, worker-pool, or Durable Object tests that prove behavior outside the service and repository layers.
