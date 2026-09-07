## 1. Publish the convention

- [x] 1.1 Add the service and repository boundary, transaction ownership, and scope exceptions to the application repository's backend conventions.
- [x] 1.2 Add the service, query-shape, PGlite execution, and TDD scope definitions to the application repository's testing architecture guide.
- [ ] 1.3 Add one small, representative backend example that shows an entrypoint, service, repository port, Drizzle implementation, and the three corresponding test types.

## 2. Establish reusable test seams

- [x] 2.1 Confirm the shared PGlite fixture exposes the migrated database and transaction handle repositories require without app-specific lifecycle hooks.
- [x] 2.2 Add or document a lightweight fake-repository pattern for service tests that carries no Worker or database setup.
- [x] 2.3 Add a focused generated-query assertion helper or documented assertion style that checks material clauses and parameters without broad SQL snapshots.

## 3. Adopt in persistent backends (owner: @htonyl)

- [x] 3.1 Inventory persistent use cases in every backend worker and backend package, identifying direct transport-to-database paths and their migration priority.
- [x] 3.2 Migrate one representative persistent use case in each affected product to the convention, including service, query-shape, and PGlite execution evidence.
- [ ] 3.3 Require touched persistent paths to meet the convention and track remaining legacy paths as bounded follow-up work.

## 4. Verify adoption

- [x] 4.1 Run the backend lane for every migrated package and worker.
- [x] 4.2 Run typecheck, lint, and the migration-generation check for each schema change produced by the adoption.
- [ ] 4.3 Review the durable convention against the completed migrations and archive this change only after the application repository confirms the convention is in use.
