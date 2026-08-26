# Tasks: Add Grade10 inventory

No grade10-spec package work in this change (no new `@grade10/ui` or tokens).
Once contracts land, backend and admin frontend groups are parallel unless a
prose line says otherwise. Frontend builds against contracts and fixtures,
never a running worker.

## 1. Share inventory contracts (grade10)

- [ ] 1.1 Make the product and unit contract scenarios pass: publish product
  fields, inventory-unit fields, status vocabulary
  (`available` | `auction-listing` | `auction-sold` | `withdrawn`), and sold price/currency
  nullability rules from `Product record fields`, `Inventory unit record
  fields`, `Unit status and sold money`, and `Ten units are ten records`.
- [ ] 1.2 Make the admin procedure-client and fixture scenarios pass for list
  products (with remaining count), remaining count by product id, list unit
  ids, create/update product, add units by quantity, update/delete unit, and
  unauthorized refusal (`Operators list and edit products`, `Remaining
  available unit count`, `Operators add inventory units by quantity`,
  `Operators edit and delete inventory units`, `Operators list inventory unit
  ids for a product`, `Inventory APIs and console are admin-only`).
- [ ] 1.3 Add `inventory:read` / `inventory:write` to auth
  `PERMISSION_STATEMENTS` so only `admin` receives them via
  `ALL_PERMISSIONS` (`Inventory APIs and console are admin-only`), and pin
  the inventory procedure permission map in contracts.
- [ ] 1.4 Verify contracts (and auth contract tests touched) with
  `pnpm run typecheck`, `pnpm run lint`, and focused contract tests.

## 2. Migrate the inventory schema (grade10)

- [ ] 2.1 Make the greenfield schema scenarios pass: products, inventories
  (unit rows), changelogs, and per-worker `audit_logs` with append-only
  protections, matching `Product record fields`, `Inventory unit record
  fields`, and `Every product or unit mutation is recorded`.
- [ ] 2.2 Generate migration artifacts for `apps/backend/grade10/inventory`
  and verify with `pnpm run db:drizzle:generate`,
  `pnpm run check:migrations`, `pnpm run typecheck`, and
  `pnpm run test:backend`.

## 3. Implement the inventory worker and API (grade10)

Depends on groups 1 and 2.

- [ ] 3.1 Scaffold `apps/backend/grade10/inventory` and
  `packages/inventory/backend`, register `inventory` in app-env /
  `BRAND_SERVICES.grade10`, bind `INVENTORY_SERVICE` on the grade10 API
  gateway, and add Neon / dev-service registry entries so the worker boots
  behind `/inventory`.
- [ ] 3.2 Make product write and list scenarios pass through elevated
  procedures with audit append:
  `Operator creates a product with required name`, `Product create without a
  name is refused`, `Operator lists products with remaining counts`,
  `Operator edits a product name`, `Unauthorized list products is refused`.
- [ ] 3.3 Make unit quantity-add, edit, delete, remaining-count, and list-ids
  scenarios pass:
  `Operator adds three units`, `Quantity zero is refused`, `Add for unknown
  product is refused`, `Ten units are ten records`, `Available unit has null
  sold money`, `Sold requires price and currency`, `Sold without money is
  refused`, `Money on a non-sold status is refused`, `Operator edits a unit
  name`, `Operator deletes an available unit`, `Delete of a sold unit is
  refused`, `Remaining count ignores non-available units`, `Unknown product
  remaining count is not found`, `Unit ids include auction-listing and auction-sold`.
- [ ] 3.4 Make change-history scenarios pass for operator and server actors:
  `Operator create appends history with user actor`, `Server update appends
  history with server actor`, `Refused write leaves history unchanged`
  (include an internal helper that updates a unit as `server` for the
  server-actor test; do not wire Auction).
- [ ] 3.5 Verify the worker and gateway wiring with `pnpm run typecheck`,
  `pnpm run lint`, `pnpm run test:backend`, `pnpm run cf-typegen` after
  wrangler edits, and `pnpm run build`.

## 4. Inventory admin feature slice (grade10)

Depends on group 1. Fixtures only — no running worker.

- [ ] 4.1 Make repository and fixture scenarios pass for product list/create
  /update, remaining count, unit list/add/update/delete, and query
  invalidation after successful writes (`Operators list and edit products`,
  `Operators add inventory units by quantity`, `Operators edit and delete
  inventory units`, `Operators manage stock from the Grade10 admin panel`).
- [ ] 4.2 Verify `@grade10/inventory-admin-frontend` with focused module/hook
  tests, `pnpm run typecheck`, and `pnpm run lint`.

## 5. Compose the Grade10 admin Inventory section (grade10)

Depends on groups 1 and 4. Fixtures, not a running backend.

- [ ] 5.1 Make `Inventory section hidden without grants` and section door on
  `inventory:read` pass in `apps/admin/grade10` sections / DI wiring,
  mounting inventory admin modules and the inventory audit chain slot.
- [ ] 5.2 Make products-table and product-detail scenarios pass using the UI
  sources in `ui.md`: `Empty products table`, `Operator lists products with
  remaining counts`, `Operator opens a product’s units from the products
  table`, `Add units form submits quantity`, `Operator edits a product
  name`, `Operator edits a unit name`, `Operator deletes an available unit`,
  and inline refusal for `Delete of a sold unit is refused` /
  sold-money validation scenarios.
- [ ] 5.3 Verify the admin app with `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run test`, and `pnpm run build`.

## 6. Delivery and review (grade10)

- [ ] 6.1 Provision Neon `grade10-inventory` databases for staging (and
  production when ready), apply migrations via the Migrate workflow, and
  confirm the API `/inventory` binding resolves in staging before relying on
  the admin section there.
- [ ] 6.2 Verify every scenario in
  `specs/grade10-inventory/catalog/spec.md`, then run
  `openspec validate add-grade10-inventory --strict`.
- [ ] 6.3 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
  `pnpm run test:backend`, and `pnpm run build` after feature lanes pass.
- [ ] 6.4 Review the branch for convention drift and for delta coverage
  separately: requirements missing, partial, or implemented differently than
  specified.
- [ ] 6.5 After rollout is confirmed, fold the accepted delta into
  `openspec/specs/grade10-inventory/catalog/`, note the product in the specs
  README if required, and archive this change.
