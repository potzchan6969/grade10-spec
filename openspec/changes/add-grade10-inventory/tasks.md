# Tasks: Add Grade10 inventory

No grade10-spec package work is required; the UI composes existing exports.
Once group 1 lands, schema and admin frontend can proceed in parallel. The
worker depends on contracts and schema. Frontend uses contracts and fixtures,
never a running worker.

## 1. Share aggregate inventory contracts (grade10)

- [ ] 1.1 Make `catalog-SC-01 - Operator creates a product with empty
  inventory`, `catalog-SC-02 - Product create without a name is refused`,
  `catalog-SC-03 - Counts reconcile across current and terminal stock`,
  `catalog-SC-04 - Product owns only one inventory`, and `catalog-SC-13 -
  Operator lists products with aggregate counts` pass with product, snapshot,
  count, and admin procedure-client schemas.
- [ ] 1.2 Make `catalog-SC-05 - Operator intakes three`, `catalog-SC-06 -
  Repeated intakes accumulate in one inventory`, `catalog-SC-08 - Invalid
  intake quantity is refused`, `catalog-SC-09 - Intake for unknown product
  is refused`, `catalog-SC-10 - Operator records a sale`, `catalog-SC-11 -
  Operator records a withdrawal`, and `catalog-SC-12 - Terminal transition
  cannot consume reserved stock` pass with intake, sale, withdrawal, money,
  reason, and typed-refusal contracts.
- [ ] 1.3 Make `catalog-SC-14 - Auction reserves a quantity`,
  `catalog-SC-15 - Same holder reference retries idempotently`,
  `catalog-SC-16 - Released holder reference never reactivates`, and
  `catalog-SC-22 - Vault releases a reservation` pass with quantity
  reservation inputs, outputs, actor stamps, and the 1–500 boundary.
- [ ] 1.4 Make `catalog-SC-20 - Vault cannot see Auction reservations`,
  `catalog-SC-21 - Another holder cannot release a reservation`, and
  `catalog-SC-34 - Public caller cannot reach holder methods` pass at the
  type boundary with one scoped RPC surface and
  `AuctionInventoryService` / `VaultInventoryService` binding narrowings.
- [ ] 1.5 Make `catalog-SC-23 - Product update records operator and
  snapshots`, `catalog-SC-24 - Intake history carries the added quantity`,
  `catalog-SC-25 - Reserve history records allocation and snapshot`,
  `catalog-SC-26 - Release history records allocation and snapshot`,
  `catalog-SC-27 - Terminal history records action details`, and
  `catalog-SC-28 - Refused write leaves history unchanged` pass with typed
  changelog action, quantity, actor, action-detail, and snapshot contracts.
- [ ] 1.6 Make `catalog-SC-32 - Unauthorized inventory read is refused` and
  `catalog-SC-33 - Inventory section hidden without grants` pass by adding
  `inventory:read` / `inventory:write` to auth permission statements,
  granting them only through admin `ALL_PERMISSIONS`.
- [ ] 1.7 Verify inventory and auth contracts with `pnpm run typecheck`,
  `pnpm run lint`, and focused contract tests.

## 2. Migrate the aggregate inventory schema (grade10)

Depends on group 1.

- [ ] 2.1 Make `catalog-SC-01 - Operator creates a product with empty
  inventory`, `catalog-SC-03 - Counts reconcile across current and terminal
  stock`, `catalog-SC-04 - Product owns only one inventory`,
  `catalog-SC-05 - Operator intakes three`, `catalog-SC-06 - Repeated
  intakes accumulate in one inventory`, `catalog-SC-10 - Operator records a
  sale`, and `catalog-SC-11 - Operator records a withdrawal` pass
  structurally with the one-to-one product/inventory key, bigint count checks,
  reconciliation checks, and monotonic-ledger trigger from `design.md`.
- [ ] 2.2 Make `catalog-SC-14 - Auction reserves a quantity`,
  `catalog-SC-17 - Auction and Vault reserve the same product`,
  `catalog-SC-18 - Concurrent reservations cannot oversubscribe stock`,
  `catalog-SC-19 - Insufficient stock reserves nothing`, and
  `catalog-SC-22 - Vault releases a reservation` pass with quantity
  reservations, unique holder references, active/released checks, and indexes.
- [ ] 2.3 Make `catalog-SC-07 - Intake appends one quantity change`,
  `catalog-SC-23 - Product update records operator and snapshots`,
  `catalog-SC-24 - Intake history carries the added quantity`,
  `catalog-SC-25 - Reserve history records allocation and snapshot`,
  `catalog-SC-26 - Release history records allocation and snapshot`,
  `catalog-SC-27 - Terminal history records action details`, and
  `catalog-SC-28 - Refused write leaves history unchanged` pass structurally
  with changelog action-specific checks, history indexes, append-only guards,
  and shared per-worker `audit_logs`.
- [ ] 2.4 Generate migration artifacts for
  `apps/backend/grade10/inventory`, then run
  `pnpm run db:drizzle:generate`, `pnpm run check:migrations`,
  `pnpm run typecheck`, and `pnpm run test:backend`.

## 3. Implement the inventory worker and APIs (grade10)

Depends on groups 1 and 2.

- [ ] 3.1 Scaffold `apps/backend/grade10/inventory` and
  `packages/inventory/backend`; register Grade10 `inventory` in app-env,
  deployment/dev/Neon registries; bind admin HTTP behind `/inventory`; export
  both named holder entrypoints without caller bindings.
- [ ] 3.2 Make `catalog-SC-01 - Operator creates a product with empty
  inventory`, `catalog-SC-02 - Product create without a name is refused`,
  `catalog-SC-09 - Intake for unknown product is refused`,
  `catalog-SC-13 - Operator lists products with aggregate counts`, and
  `catalog-SC-32 - Unauthorized inventory read is refused` pass through
  elevated product procedures and repositories.
- [ ] 3.3 Make `catalog-SC-05 - Operator intakes three`, `catalog-SC-06 -
  Repeated intakes accumulate in one inventory`, `catalog-SC-08 - Invalid
  intake quantity is refused`, `catalog-SC-10 - Operator records a sale`,
  `catalog-SC-11 - Operator records a withdrawal`, and `catalog-SC-12 -
  Terminal transition cannot consume reserved stock` pass through snapshot
  transitions that lock the inventory row and commit history atomically.
- [ ] 3.4 Make `catalog-SC-14 - Auction reserves a quantity`,
  `catalog-SC-15 - Same holder reference retries idempotently`,
  `catalog-SC-16 - Released holder reference never reactivates`,
  `catalog-SC-19 - Insufficient stock reserves nothing`, and
  `catalog-SC-22 - Vault releases a reservation` pass through transactional
  reserve/release services.
- [ ] 3.5 Make `catalog-SC-17 - Auction and Vault reserve the same product`
  and `catalog-SC-18 - Concurrent reservations cannot oversubscribe stock`
  pass with real PostgreSQL tests proving the inventory-row lock serializes
  count reads and the loser receives the typed refusal rather than SQLSTATE
  `23514`.
- [ ] 3.6 Make `catalog-SC-20 - Vault cannot see Auction reservations`,
  `catalog-SC-21 - Another holder cannot release a reservation`, and
  `catalog-SC-34 - Public caller cannot reach holder methods` pass with
  separate admin/holder repositories and auxiliary-worker tests exercising
  both named entrypoints and the empty public/default surface.
- [ ] 3.7 Make `catalog-SC-07 - Intake appends one quantity change`,
  `catalog-SC-23 - Product update records operator and snapshots`,
  `catalog-SC-24 - Intake history carries the added quantity`,
  `catalog-SC-25 - Reserve history records allocation and snapshot`,
  `catalog-SC-26 - Release history records allocation and snapshot`,
  `catalog-SC-27 - Terminal history records action details`, and
  `catalog-SC-28 - Refused write leaves history unchanged` pass with one
  changelog per business transition and one platform audit per elevated write.
- [ ] 3.8 Verify worker, RPC, gateway, schema, and configuration with
  `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`,
  `pnpm run cf-typegen`, `pnpm run check:libs`, and `pnpm run build`.

## 4. Build the inventory admin feature slice (grade10)

Depends on group 1. Fixtures only; no running worker.

- [ ] 4.1 Make `catalog-SC-03 - Counts reconcile across current and terminal
  stock`, `catalog-SC-13 - Operator lists products with aggregate counts`,
  and `catalog-SC-29 - Operator oversees inventory and allocation` pass
  through repositories, use cases, fixtures, and query invalidation for every
  snapshot count, allocation, and history.
- [ ] 4.2 Make `catalog-SC-01 - Operator creates a product with empty
  inventory`, `catalog-SC-05 - Operator intakes three`,
  `catalog-SC-10 - Operator records a sale`, `catalog-SC-11 - Operator
  records a withdrawal`, and `catalog-SC-12 - Terminal transition cannot
  consume reserved stock` pass through admin mutations and fixtures.
- [ ] 4.3 Make `catalog-SC-14 - Auction reserves a quantity`,
  `catalog-SC-15 - Same holder reference retries idempotently`,
  `catalog-SC-16 - Released holder reference never reactivates`,
  `catalog-SC-19 - Insufficient stock reserves nothing`, and
  `catalog-SC-22 - Vault releases a reservation` pass through reservation
  use cases and invalidation.
- [ ] 4.4 Verify `@grade10/inventory-admin-frontend` with focused module/hook
  tests, `pnpm run typecheck`, and `pnpm run lint`.

## 5. Compose the Grade10 admin Inventory section (grade10)

Depends on groups 1 and 4. Fixtures only; no running worker.

- [ ] 5.1 Make `catalog-SC-30 - Empty products table`,
  `catalog-SC-32 - Unauthorized inventory read is refused`, and
  `catalog-SC-33 - Inventory section hidden without grants` pass with the
  section door and table loading/empty/error states.
- [ ] 5.2 Make `catalog-SC-13 - Operator lists products with aggregate
  counts` and `catalog-SC-29 - Operator oversees inventory and allocation`
  pass using the exact existing components in `ui.md`, with all snapshot
  columns, holder allocation, and reconciliation.
- [ ] 5.3 Make `catalog-SC-08 - Invalid intake quantity is refused`,
  `catalog-SC-10 - Operator records a sale`, `catalog-SC-11 - Operator
  records a withdrawal`, `catalog-SC-12 - Terminal transition cannot consume
  reserved stock`, and `catalog-SC-31 - Intake form updates the snapshot`
  pass in intake/sale/withdraw dialogs and inline errors.
- [ ] 5.4 Make `catalog-SC-14 - Auction reserves a quantity`,
  `catalog-SC-16 - Released holder reference never reactivates`,
  `catalog-SC-19 - Insufficient stock reserves nothing`, and
  `catalog-SC-22 - Vault releases a reservation` pass in reserve/release
  dialogs and idempotent-result states.
- [ ] 5.5 Make `catalog-SC-23 - Product update records operator and
  snapshots`, `catalog-SC-24 - Intake history carries the added quantity`,
  `catalog-SC-25 - Reserve history records allocation and snapshot`, and
  `catalog-SC-26 - Release history records allocation and snapshot`, and
  `catalog-SC-27 - Terminal history records action details` pass in
  the product change-history view.
- [ ] 5.6 Verify the admin app with `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run test`, and `pnpm run build`.

## 6. Deliver and review (grade10)

- [ ] 6.1 Provision Neon `grade10-inventory` databases, apply migrations via
  the Migrate workflow, and confirm the admin `/inventory` binding and both
  named holder entrypoints resolve in staging.
- [ ] 6.2 Verify every scenario in
  `specs/grade10-inventory/catalog/spec.md`, then run
  `openspec validate add-grade10-inventory --strict`.
- [ ] 6.3 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
  `pnpm run test:backend`, `pnpm run check:libs`, and
  `pnpm run build`.
- [ ] 6.4 Review standards and spec coverage separately, focusing on snapshot
  reconciliation, monotonic ledger, row-lock serialization, holder leakage,
  idempotency, and transition history.
- [ ] 6.5 After rollout, fold the accepted delta into
  `openspec/specs/grade10-inventory/catalog/`, update the specs index if
  required, and archive the change.
