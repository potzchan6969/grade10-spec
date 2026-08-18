## Purpose

Define how every backend system separates transport, business use cases, and persistent data access, and the evidence required to change each layer safely.

## ADDED Requirements

### Requirement: Backend use-case and write boundaries

Every backend entrypoint MUST delegate a business use case to a service. An entrypoint MUST NOT perform a persistent write directly. A service MUST own a persistent write's business policy, state transitions, idempotency decision where applicable, and any transaction spanning more than one persistent operation. A repository MUST own persistence access and MUST NOT make business-policy decisions. Entrypoints MUST limit themselves to transport adaptation, authorization, and response or scheduling adaptation.

#### Scenario: A route creates a persistent domain record

- **WHEN** a backend route or procedure receives a valid create request
- **THEN** it delegates the business decision and persistence orchestration to a service
- **AND THEN** the repository performs the persistent operation without deciding whether the request is allowed by domain policy

#### Scenario: A handler accepts a write command

- **WHEN** a backend handler, procedure, webhook, or scheduled entrypoint receives a command that writes persistent state
- **THEN** it delegates the command to a service after transport adaptation and authorization
- **AND THEN** the entrypoint contains no business-state transition, idempotency decision, or direct persistent write

#### Scenario: A use case updates related records atomically

- **WHEN** a use case changes more than one persistent record as one business action
- **THEN** the service defines the transaction boundary
- **AND THEN** every repository operation participating in that action uses that boundary

### Requirement: Service test evidence

Every new or materially changed business rule, state transition, or orchestration path in a service MUST have a backend-lane unit test that runs without a worker runtime or database. The test MUST use a narrow fake persistence collaborator and MUST assert the observable outcome and required collaborator calls for its scenario.

#### Scenario: A service rejects an invalid state transition

- **WHEN** a service receives a command that violates a domain transition rule
- **THEN** its unit test supplies a fake collaborator representing the relevant prior state
- **AND THEN** the test proves the rejection and that no persistent mutation is requested

### Requirement: Repository query-shape evidence

Every new or materially changed repository query with joins, predicates, ordering, pagination, aggregates, or conflict behavior MUST have a backend-lane test that asserts the generated query's material SQL clauses and bound values, or an equally specific semantic representation of them. The test MUST assert the join relationship when the query reads across more than one relation.

#### Scenario: A repository query joins related records

- **WHEN** a repository adds or changes a query that reads related records
- **THEN** its query-shape test proves the intended join relationship, filtering, and bound values
- **AND THEN** the test fails when the query omits or changes one of those material semantics

### Requirement: Repository execution and migration evidence

Every new or materially changed repository persistence behavior MUST have a backend-lane test that executes it against the committed migrated schema in an in-memory Postgres runtime. The test MUST seed the required data and assert returned data or mutation effects. It MUST prove affected constraints, transaction behavior, and migration behavior when the change relies on them.

#### Scenario: A repository transaction rolls back a failed multi-record update

- **WHEN** a repository operation participating in a service transaction fails after an earlier mutation
- **THEN** its in-memory Postgres test executes the operation against migrated schema and seeded data
- **AND THEN** the test proves that the transaction leaves no partial persistent result

#### Scenario: A schema change adds a database constraint

- **WHEN** a backend change adds or relies on a database constraint
- **THEN** its in-memory Postgres test applies the committed migration and attempts the prohibited state
- **AND THEN** the test proves the database rejects that state

### Requirement: Backend TDD scope

Backend changes MUST begin with a failing scenario test in the layer that owns the behavior: service unit tests for business policy, query-shape tests for query semantics, and in-memory Postgres tests for executable persistence or schema behavior. A change touching more than one of those concerns MUST include the corresponding test evidence for each. A transport-only, stateless, or framework wiring change MUST add only the test evidence that can prove its changed behavior.

#### Scenario: A change modifies both domain policy and a persistent query

- **WHEN** a backend change changes a service rule and the repository query that supports it
- **THEN** the change includes a service unit scenario, a query-shape scenario, and an in-memory Postgres execution scenario
- **AND THEN** all scenarios run in the backend test lane before the change is accepted

#### Scenario: A change modifies only response mapping

- **WHEN** a backend change changes only transport response mapping and does not change service or repository behavior
- **THEN** it does not add artificial service or repository tests
- **AND THEN** it adds or updates the transport-level evidence that proves the mapping
