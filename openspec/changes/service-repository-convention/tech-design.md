## Context

Grade10 backends run TypeScript Workers and backend packages, with request routing, use-case code, Drizzle persistence, and a backend test lane. The project already provides PGlite fixtures that apply committed migration SQL and roll each test back. The missing contract is which layer owns business decisions and transactions, and which evidence proves a service did not pass only because its fake persistence behaved differently from the real query.

This design adopts the useful boundaries commonly associated with Spring Boot: controllers (or route procedures) handle transport, services own use cases, and repositories own data access. It applies those responsibilities to the current Worker and Drizzle stack rather than adopting Spring Boot itself.

## Goals / Non-Goals

**Goals:**

- Give each persistent use case one visible owner for business rules and transaction orchestration.
- Keep service tests fast, isolated, and friendly to agents working from a narrow behavior contract.
- Prove generated query shape and execute repository behavior against migrated Postgres before merge.
- Make the required TDD evidence proportional to the changed layer.

**Non-Goals:**

- Make every function a service or every data read a repository abstraction.
- Require a database interface for in-memory Durable Object storage.
- Change existing product behavior as part of documenting the convention.

## Decisions

### Use a transport → service → repository direction

Routes, tRPC procedures, scheduled entrypoints, and Worker handlers adapt input, authorization, and output. Persistent writes always enter through a service; a handler never makes a direct write. A service coordinates one use case, applies business policy and idempotency, and owns a transaction that spans multiple writes. A repository encapsulates a persistence concern and accepts the database or transaction handle that the service supplies.

This mirrors Spring Boot's controller/service/repository separation while preserving the current dependency injection and Drizzle approach. The alternative—allowing route handlers to query directly—keeps local code shorter but repeats business policy and hides transaction ownership at every entrypoint.

### Keep services concrete and test them with small fakes

A service depends on a narrow repository port or injected persistence collaborator. Its tests use fakes that model only the collaborator behavior required by the scenario; they do not start a worker, PGlite, or a real network binding. This gives a low-cost, agent-friendly feedback loop for rules, transitions, and orchestration.

The alternative—using only database tests—would prove persistence but make business-rule feedback slower and more awkward to set up. A pass-through wrapper that adds no business decision or coordination is not a service and should not be introduced merely to satisfy a folder pattern.

### Prove query construction separately from execution

Repository tests inspect the typed query layer's generated SQL and bound parameters for material query paths, especially joins, predicates, ordering, pagination, aggregates, and lock or conflict behavior. These tests pinpoint an incorrect query definition without relying on fixture data that might accidentally conceal it.

SQL snapshots of every trivial lookup were considered and rejected: they create noise and over-couple tests to harmless formatting. Assertions should target the clauses, joins, selected fields, and parameters whose semantics the repository promises.

### Execute every material repository path against migrated PGlite

Repository tests use the shared PGlite fixture and committed migration SQL to seed data and execute real queries. They prove returned rows, joins, database constraints, transactions, and migrations for the affected persistence behavior. A rejected-database-state suite uses database isolation when the rejection itself is the assertion.

Pure service tests alone were rejected because fakes can make an invalid query look correct. Query-shape tests alone were rejected because SQL text does not prove a query runs against the schema or obeys constraints and transactions.

### Scope TDD by the changed layer

Each new or changed service behavior begins with a failing service scenario test. Each material repository change begins with a failing query-shape or PGlite scenario test, and includes both when it changes query semantics. A schema or migration change begins with a PGlite scenario that would fail against the prior schema. The implementation is complete only when the relevant tests pass in the backend lane.

This requires red-green-refactor evidence without forcing a test category that cannot prove the change. The alternative—requiring every layer's test for every edit—would encourage meaningless tests for transport-only or non-persistent code.

## Risks / Trade-offs

- The initial adoption adds tests and small seams before feature work feels faster; the payback is earlier detection of query and transaction defects.
- Narrow repository ports can become needless indirection if they mirror a single query without serving a use case. Reviews should remove those wrappers.
- PGlite is Postgres-compatible but not production infrastructure; database-specific behavior that it cannot represent still needs the existing integration or deployment validation.
- Existing code will be migrated incrementally. A change touching legacy persistence must improve the touched path; untouched paths are inventory work, not a reason to block unrelated delivery.
