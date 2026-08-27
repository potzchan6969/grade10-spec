# Tasks: Add Grade10 inventory

No grade10-spec package work is required; the UI composes existing exports.
Once group 1 lands, schema and admin frontend can proceed in parallel. The
worker depends on contracts and schema. Frontend uses contracts and fixtures,
never a running worker.

## 1. Share inventory and reservation contracts (grade10)

- [ ] 1.1 Make `Operator creates a product with required name`, `Product
  create without a name is refused`, `Operator edits a product name`, `Ten
  units are ten records`, and `In-stock unit has null sold money` pass with
  product and serialized-unit schemas.
- [ ] 1.2 Make `Sold requires price and currency`, `Sold without money is
  refused`, `Money on a non-sold state is refused`, and `State change on a
  reserved unit is refused` pass with the `in-stock` | `auction-sold` |
  `withdrawn` state and sold-money contracts.
- [ ] 1.3 Make `Auction reserves units with purpose and reference`, `Same
  holder reference retries idempotently`, `Reservation quantity outside the
  batch limit is refused`, and `Released holder reference never reactivates`
  pass with reservation inputs, outputs, typed refusals, and the 1–500 batch
  boundary on PostgreSQL `integer` values.
- [ ] 1.4 Make `Vault cannot see Auction-held units` and `Another holder
  cannot release a reservation` pass at the type boundary with one scoped RPC
  surface and `AuctionInventoryService` / `VaultInventoryService` binding
  narrowings whose DTOs cannot carry another holder's allocation.
- [ ] 1.5 Make `Operator lists products with remaining counts`, `Remaining
  count ignores reserved and non-stock units`, `Stock and ledger counts
  separate current and historical units`, `Unknown product remaining count is
  not found`, `Admin unit ids include held and sold units`, and `Admin sees
  allocation by holder` pass in admin procedure-client and fixture contracts.
- [ ] 1.6 Make `Unauthorized list products is refused`, `Inventory section
  hidden without grants`, and `Public caller cannot reach holder reservation
  methods` pass by adding `inventory:read` / `inventory:write` to auth
  `PERMISSION_STATEMENTS`, granting them only through admin
  `ALL_PERMISSIONS`, and excluding holder RPC from HTTP contracts.
- [ ] 1.7 Verify inventory and auth contracts with `pnpm run typecheck`, `pnpm
  run lint`, and focused contract tests.

## 2. Migrate the inventory and reservation schema (grade10)

Depends on group 1.

- [ ] 2.1 Make `Ten units are ten records`, `Admin unit ids include held and
  sold units`, `Stock and ledger counts separate current and historical
  units`, `Unit update records before and after snapshots`, and `Quantity add
  records every created unit` pass with the exact products, inventories,
  changelog actor/subject/action/before/after columns, count/history indexes,
  subject-action checks, immutable reservation-unit history, the shared
  per-worker `audit_logs`, and append-only guards outlined in `design.md`.
- [ ] 2.2 Make `Auction and Vault reserve disjoint units of one product` and
  `Overlapping reservation is impossible under concurrency` pass structurally
  with reservations, immutable reservation-unit history, active ownership,
  composite same-product foreign keys, unique `(holder, holder_reference)`,
  and primary-key exclusion of a second active owner.
- [ ] 2.3 Make `Released holder reference never reactivates`, `Vault releases a
  reservation`, `Release records the custody transition`, and `Delete of a
  previously reserved unit is refused` pass structurally by retaining
  reservation and unit history while deleting only current active-owner rows
  on release and restricting deletion of any historically assigned unit.
- [ ] 2.4 Generate migration artifacts for
  `apps/backend/grade10/inventory`, then run `pnpm run db:drizzle:generate`,
  `pnpm run check:migrations`, `pnpm run typecheck`, and `pnpm run
  test:backend`.

## 3. Implement the inventory worker, admin API, and holder entrypoints (grade10)

Depends on groups 1 and 2.

- [ ] 3.1 Scaffold `apps/backend/grade10/inventory` and
  `packages/inventory/backend`; register Grade10 `inventory` in app-env and
  deployment/dev/Neon registries; bind admin HTTP behind `/inventory`; export
  `AuctionInventoryService` and `VaultInventoryService` without caller
  bindings.
- [ ] 3.2 Make `Operator creates a product with required name`, `Product
  create without a name is refused`, `Operator lists products with remaining
  counts`, `Operator edits a product name`, `Unknown product remaining count
  is not found`, and `Unauthorized list products is refused` pass through
  elevated product procedures and repositories.
- [ ] 3.3 Make `Operator adds three units`, `Quantity zero is refused`, `Add
  for unknown product is refused`, `Operator edits a unit name`, `Operator
  deletes an unreserved in-stock unit`, `Delete of an auction-sold unit is
  refused`, `Delete of a reserved unit is refused`, and `Delete of a previously
  reserved unit is refused` pass through elevated unit procedures.
- [ ] 3.4 Make `In-stock unit has null sold money`, `Sold requires price and
  currency`, `Sold without money is refused`, `Money on a non-sold state is
  refused`, and `State change on a reserved unit is refused` pass through unit
  state transitions that take the product-row lock.
- [ ] 3.5 Make `Auction reserves units with purpose and reference`, `Same
  holder reference retries idempotently`, `Reservation quantity outside the
  batch limit is refused`, `Released holder reference never reactivates`,
  `Insufficient stock reserves nothing`, and `Vault releases a reservation`
  pass through transactional reserve/release services.
- [ ] 3.6 Make `Auction and Vault reserve disjoint units of one product` and
  `Overlapping reservation is impossible under concurrency` pass with real
  Postgres tests proving the per-product lock serializes candidate reads, one
  active owner survives, and the loser receives the typed insufficient-stock
  refusal rather than SQLSTATE `23505`.
- [ ] 3.7 Make `Remaining count ignores reserved and non-stock units`, `Stock
  and ledger counts separate current and historical units`, `Admin unit ids
  include held and sold units`, and `Admin sees allocation by holder` pass
  through separately scoped admin and holder repositories.
- [ ] 3.8 Make `Vault cannot see Auction-held units`, `Another holder cannot
  release a reservation`, and `Public caller cannot reach holder reservation
  methods` pass with auxiliary-worker tests exercising both named entrypoints,
  foreign/unknown identifiers, and the empty default/public surface.
- [ ] 3.9 Make `Operator create appends history with user actor`, `Server
  update appends history with server actor`, `Unit update records before and
  after snapshots`, `Quantity add records every created unit`, `Holder
  reservation appends history with application actor`, `Release records the
  custody transition`, and `Refused write leaves history unchanged` pass with
  one changelog per mutated domain subject in each transaction, canonical
  snapshots, and one platform audit entry per elevated request.
- [ ] 3.10 Verify worker, RPC, gateway, schema, and configuration with `pnpm
  run typecheck`, `pnpm run lint`, `pnpm run test:backend`, `pnpm run
  cf-typegen`, `pnpm run check:libs`, and `pnpm run build`.

## 4. Build the inventory admin feature slice (grade10)

Depends on group 1. Fixtures only; no running worker.

- [ ] 4.1 Make `Operator lists products with remaining counts`, `Remaining
  count ignores reserved and non-stock units`, `Stock and ledger counts
  separate current and historical units`, and `Operator oversees where units
  are held` pass through repositories, use cases, fixtures, and query
  invalidation for stock, ledger, available, reserved, sold, and withdrawn
  counts.
- [ ] 4.2 Make `Operator creates a product with required name`, `Operator edits
  a product name`, `Operator adds three units`, `Operator edits a unit name`,
  and `Operator deletes an unreserved in-stock unit` pass through admin feature
  mutations and their fixtures.
- [ ] 4.3 Make `Operator reserves and releases on behalf of a holder`,
  `Insufficient stock reserves nothing`, `Reservation quantity outside the
  batch limit is refused`, and `Released holder reference never reactivates`
  pass through reservation use cases and invalidation.
- [ ] 4.4 Verify `@grade10/inventory-admin-frontend` with focused module/hook
  tests, `pnpm run typecheck`, and `pnpm run lint`.

## 5. Compose the Grade10 admin Inventory section (grade10)

Depends on groups 1 and 4. Fixtures only; no running worker.

- [ ] 5.1 Make `Inventory section hidden without grants` pass with the
  `inventory:read` section door, inventory modules, and the inventory
  audit-chain slot.
- [ ] 5.2 Make `Empty products table`, `Operator lists products with remaining
  counts`, and `Stock and ledger counts separate current and historical units`
  pass using the exact existing components in `ui.md`, showing stock, ledger,
  available, and active-reserved columns.
- [ ] 5.3 Make `Operator opens a product’s units from the products table`,
  `Operator oversees where units are held`, `Admin sees allocation by holder`,
  and `Add units form submits quantity` pass in product detail and allocation
  views.
- [ ] 5.4 Make `Operator edits a product name`, `Operator edits a unit name`,
  `Sold without money is refused`, `Money on a non-sold state is refused`,
  `State change on a reserved unit is refused`, `Operator deletes an
  unreserved in-stock unit`, `Delete of an auction-sold unit is refused`, and
  `Delete of a reserved unit is refused`, and `Delete of a previously reserved
  unit is refused` pass in edit/delete dialogs and inline errors.
- [ ] 5.5 Make `Operator reserves and releases on behalf of a holder`,
  `Insufficient stock reserves nothing`, `Reservation quantity outside the
  batch limit is refused`, and `Released holder reference never reactivates`
  pass in reserve/release dialogs and idempotent-result states.
- [ ] 5.6 Verify the admin app with `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run test`, and `pnpm run build`.

## 6. Deliver and review (grade10)

- [ ] 6.1 Provision Neon `grade10-inventory` databases, apply migrations via
  the Migrate workflow, and confirm the admin `/inventory` binding and both
  named holder entrypoints resolve in staging before use.
- [ ] 6.2 Verify every scenario in
  `specs/grade10-inventory/catalog/spec.md`, then run `openspec validate
  add-grade10-inventory --strict`.
- [ ] 6.3 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm
  run test:backend`, `pnpm run check:libs`, and `pnpm run build` after feature
  lanes pass.
- [ ] 6.4 Review standards and spec coverage separately, with explicit focus
  on count reconciliation, per-product serialization, cross-product foreign
  keys, cross-holder data leakage, idempotency, and mutation history.
- [ ] 6.5 After rollout is confirmed, fold the accepted delta into
  `openspec/specs/grade10-inventory/catalog/`, update the specs index if
  required, and archive this change.
