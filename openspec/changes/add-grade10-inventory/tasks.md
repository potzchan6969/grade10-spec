# Tasks: Add Grade10 inventory

No grade10-spec package work is required; the UI composes existing design-system
exports. Once group 1 lands, groups 2–4 are sequential on schema and domain
code; group 5 builds against contracts and fixtures from groups 1 and 4, not a
running worker.

## 1. Share aggregate inventory contracts (grade10)

- [x] 1.1 Make `catalog-SC-01 - Operator creates a draft product with empty
  inventory`, `catalog-SC-02 - Product create without a name is refused`,
  `catalog-SC-03 - Counts reconcile across current and terminal stock`,
  `catalog-SC-04 - Product owns only one inventory`,
  `catalog-SC-13 - Operator lists products with aggregate counts`,
  `catalog-SC-52 - Operator marks a draft product created`,
  `catalog-SC-54 - Created to draft is refused`, and
  `catalog-SC-57 - Operator edits product fields` pass with product
  (`status` draft|created), snapshot (including vaulted), count, and admin
  procedure-client schemas from `design.md` Contracts.
- [x] 1.2 Make `catalog-SC-05 - Operator intakes three`, `catalog-SC-06 -
  Repeated intakes accumulate in one inventory`, `catalog-SC-08 - Invalid
  intake quantity is refused`, `catalog-SC-09 - Intake for unknown product
  is refused`, `catalog-SC-10 - Operator records a sale`, `catalog-SC-11 -
  Operator records a withdrawal`, and `catalog-SC-12 - Terminal transition
  cannot consume reserved stock` pass with intake, sale, withdrawal, money,
  reason, and typed-refusal contracts.
- [x] 1.3 Make `catalog-SC-14 - Auction reserves a quantity`,
  `catalog-SC-15 - Same active reference retries idempotently`,
  `catalog-SC-16 - Closed reference may reserve again`,
  `catalog-SC-22 - Vault releases a full remaining hold`,
  `catalog-SC-35 - Partial release leaves remaining active`, `catalog-SC-59`,
  `catalog-SC-67`, and `catalog-SC-47` through `catalog-SC-50`, `catalog-SC-51`,
  and `catalog-SC-63` through `catalog-SC-65` pass with reservation fields
  (`holder_kind` including `admin`, remaining/sold/vaulted/released, status
  active/closed, adjustable quantity), `adminReservationsByHolderKind` (`admin`
  bucket on `products.get`), `adminReservationsReserveInput` (no holder fields),
  outputs, actor stamps, and the 1–500 boundary.
- [x] 1.4 Make `catalog-SC-36 - Auction partially sells from a reservation`,
  `catalog-SC-37 - Partial sell then release closes the reservation`,
  `catalog-SC-38 - Vault partially vaults from a reservation`,
  `catalog-SC-39 - Vault cannot sell from reservation`, and
  `catalog-SC-40 - Auction cannot vault from reservation` pass with
  sell-from-reservation / vault-from-reservation contracts and entrypoint
  surface narrowing.
- [ ] 1.5 Make `catalog-SC-20 - Vault cannot see Auction reservations`,
  `catalog-SC-21 - Another kind cannot release a reservation`,
  `catalog-SC-34 - Public caller cannot reach holder methods`,
  `catalog-SC-61 - Auction eligibility list omits draft and out-of-stock`,
  `catalog-SC-62 - Eligibility available matches inventory available`, and
  `catalog-SC-66 - Own reservation counts toward effective available on edit`
  pass at the type boundary with scoped RPC surfaces,
  `AuctionInventoryService` / `VaultInventoryService` binding narrowings
  (`holder_kind` from entrypoint, never input), and the Auction eligibility
  list shape. Contract binding stubs cover resolve/refusal shape; runtime
  coverage for SC-20, SC-21, SC-61, and SC-62 lives in
  `packages/inventory/backend/test/holder-scope.test.ts` and
  `eligible-products.test.ts`; SC-34 in `trpc-access.test.ts`; SC-66 in
  auction listing-edit tests — still open for contract-level assertions on
  the narrowed entrypoint surfaces.
- [x] 1.6 Make `catalog-SC-23 - Product update records operator and
  snapshots`, `catalog-SC-24 - Intake history carries the added quantity`,
  `catalog-SC-25 - Reserve history records hold and snapshot`,
  `catalog-SC-26 - Release history records hold and snapshot`,
  `catalog-SC-27 - Terminal history records action details`,
  `catalog-SC-28 - Refused write leaves history unchanged`,
  `catalog-SC-41 - Sell-from-reservation history`,
  `catalog-SC-42 - Vault-from-reservation history`,
  `catalog-SC-43 - Adjust history records new quantity`, and
  `catalog-SC-44 - Adjust decrease records freed quantity`, and
  `catalog-SC-45 - Change-product history records both inventories` pass with typed
  changelog changed-entity, non-null inventory reference, nullable reservation
  reference, action (including `adjust` and `change-product`), quantity, actor,
  action-detail, and snapshot contracts.
- [x] 1.7 Make `catalog-SC-32 - Unauthorized inventory read is refused` and
  `catalog-SC-33 - Inventory section hidden without grants` pass by adding
  `inventory:read` / `inventory:write` to auth permission statements,
  granting them only through admin `ALL_PERMISSIONS`.
- [x] 1.8 Verify inventory and auth contracts with `pnpm run typecheck`,
  `pnpm run lint`, and focused contract tests.

## 2. Migrate the aggregate inventory schema (grade10)

Depends on group 1.

- [x] 2.1 Make `catalog-SC-01`, `catalog-SC-03`, `catalog-SC-04`,
  `catalog-SC-05`, `catalog-SC-06`, `catalog-SC-10`, `catalog-SC-11`,
  `catalog-SC-52`, and `catalog-SC-54` pass structurally with the one-to-one
  product/inventory key (`UNIQUE product_id`), product **`status`** check
  (`draft` | `created`), stored bigint counts (`stock`, `reserved`, `vaulted`,
  `sold`, `withdrawn` — no `ledger` column and no inventory `status` column),
  derived ledger identity (`stock + sold + withdrawn + vaulted`), and monotonic
  triggers for sold / withdrawn / vaulted from `design.md`.
- [x] 2.2 Make `catalog-SC-14 - Auction reserves a quantity`,
  `catalog-SC-16 - Closed reference may reserve again`,
  `catalog-SC-17 - Auction and Vault reserve the same product`,
  `catalog-SC-18 - Concurrent reservations cannot oversubscribe stock`,
  `catalog-SC-19 - Insufficient stock reserves nothing`,
  `catalog-SC-22 - Vault releases a full remaining hold`,
  `catalog-SC-35 - Partial release leaves remaining active`,
  `catalog-SC-36 - Auction partially sells from a reservation`,
  `catalog-SC-38 - Vault partially vaults from a reservation`,
  `catalog-SC-47 - Increase listing reservation 3 to 5 acquires more stock`,
  `catalog-SC-48 - Decrease listing reservation 5 to 2 frees remaining`,
  `catalog-SC-49 - Increase refused when not enough available stock`, and
  `catalog-SC-50 - Cannot adjust below sold plus vaulted plus released`
  pass with reservation headers (no allocation table), `holder_kind` (including
  `admin` via a schema migration expanding the check constraint),
  partial-unique active `(holder_kind, holder_reference)`, active/closed checks,
  and indexes.
- [x] 2.3 Make `catalog-SC-07`, `catalog-SC-23`, `catalog-SC-24`,
  `catalog-SC-25`, `catalog-SC-26`, `catalog-SC-27`, `catalog-SC-28`,
  `catalog-SC-41`, `catalog-SC-42`, `catalog-SC-43`, `catalog-SC-44`, and
  `catalog-SC-45` pass structurally with the non-null inventory foreign key,
  subject/action checks (including `adjust`, `change-product`,
  sell-from-reservation, vault-from-reservation),
  reservation/inventory foreign key, action-specific checks, history indexes,
  append-only guards, and shared per-worker `audit_logs`.
- [x] 2.4 Generate migration artifacts for
  `apps/backend/grade10/inventory` (including a migration to add `admin` to
  `reservations.holder_kind`), then run `pnpm run db:drizzle:generate`,
  `pnpm run check:migrations`, `pnpm run typecheck`, and `pnpm run test:backend`.

## 3. Implement inventory domain services (grade10)

Depends on groups 1 and 2.

- [x] 3.1 Make `catalog-SC-01`, `catalog-SC-02`, `catalog-SC-04`,
  `catalog-SC-13`, `catalog-SC-52`, `catalog-SC-53`, `catalog-SC-54`, and
  `catalog-SC-57` pass through product and inventory services.
- [x] 3.2 Make `catalog-SC-05`, `catalog-SC-06`, `catalog-SC-08`,
  `catalog-SC-09`, `catalog-SC-10`, `catalog-SC-11`, and `catalog-SC-12`
  pass through snapshot mutations under inventory-row lock.
- [x] 3.3 Make `catalog-SC-14`, `catalog-SC-15`, `catalog-SC-16`,
  `catalog-SC-19`, `catalog-SC-22`, `catalog-SC-35`, `catalog-SC-60`, and admin
  reserve (`catalog-SC-59`, `catalog-SC-67`) pass through transactional
  reserve/release services with remaining tracking
  (`createReservationService("admin")` + `mintAdminHolderReference()` for
  elevated reserve).
- [x] 3.4 Make `catalog-SC-17` and `catalog-SC-18` pass with two real
  entrypoints and `SELECT … FOR UPDATE` serialization.
- [x] 3.5 Make `catalog-SC-36`, `catalog-SC-37`, and `catalog-SC-38` pass
  through sell-from-reservation and vault-from-reservation services updating
  reservation partitions and inventory `sold` / `vaulted`.
- [x] 3.6 Make `catalog-SC-47`, `catalog-SC-48`, `catalog-SC-49`, and
  `catalog-SC-50` pass through `adjustReservation` syncing inventory
  `reserved` and reservation quantity/remaining with changelog.
- [x] 3.7 Make `catalog-SC-51`, `catalog-SC-63`, `catalog-SC-64`, and
  `catalog-SC-65` pass through `changeReservationProduct` locking both
  inventory rows and syncing both products' `reserved`.
- [ ] 3.8 Make `catalog-SC-20`, `catalog-SC-21`, `catalog-SC-39`,
  `catalog-SC-40`, `catalog-SC-61`, `catalog-SC-62`, and `catalog-SC-66`
  pass through entrypoint-scoped services. Holder-kind domain services and
  `holderBindingApi` exist; SC-20, SC-21, SC-39, SC-40, SC-61, and SC-62
  pass at the reservation-service layer; SC-66 passes in auction
  listing-edit integration — still open through `AuctionInventoryService` /
  `VaultInventoryService` RPC entrypoints.
- [ ] 3.9 Make `catalog-SC-07`, `catalog-SC-23` through `catalog-SC-28`,
  `catalog-SC-41`, `catalog-SC-42`, `catalog-SC-43`, `catalog-SC-44`, and
  `catalog-SC-45` pass with domain changelog + elevated audit writes.
  Changelog append and read-model tests pass; `appendAudit` is wired on tRPC
  context but not yet called from mutations.
- [x] 3.10 Verify with `pnpm run typecheck`, `pnpm run lint`, and
  `pnpm run test:backend`.

## 4. Expose admin and holder RPC surfaces (grade10)

Depends on group 3.

- [ ] 4.1 Make `catalog-SC-01`, `catalog-SC-13`, `catalog-SC-32`, and
  `catalog-SC-34` pass through admin procedures and gateway routing.
  Worker routers and `trpc-access.test.ts` cover SC-32 and SC-34
  partially; `reservations.reserve` is implemented but not yet asserted in
  `trpc-access.test.ts`; no worker-level list/get/create E2E yet.
- [ ] 4.2 Make intake and `catalog-SC-12` pass through admin mutations and
  fixtures where applicable. Domain and admin-frontend fixture paths pass;
  worker tRPC mutation E2E still open. Free-pool sell/withdraw are not on the
  inventory product page.
- [x] 4.3 Make elevated `reservations.reserve` and admin
  `reservations.release` (`catalog-SC-59`, `catalog-SC-60`, `catalog-SC-67`)
  pass through the inventory worker (`admin-reserve.test.ts`).
- [ ] 4.4 Make holder reserve, adjust, change-product, partial release,
  sell-from-reservation, vault-from-reservation, `catalog-SC-16`, and
  `catalog-SC-35`–`catalog-SC-40` pass through holder entrypoints. Domain and
  fixtures pass; holder RPC E2E still open.
- [ ] 4.5 Make history scenarios including `catalog-SC-43`, `catalog-SC-44`,
  and `catalog-SC-45` pass through read models.
- [ ] 4.6 Verify with `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run test:backend`, and `pnpm run build` for the inventory worker /
  API wiring.

## 5. Compose Grade10 inventory admin UI (grade10)

Depends on groups 1 and 4. Fixtures, not a live worker.

- [x] 5.1 Make `catalog-SC-13`, `catalog-SC-30`, `catalog-SC-32`,
  `catalog-SC-33`, and `catalog-SC-58` pass on the products list.
- [x] 5.2 Make `catalog-SC-01`, `catalog-SC-29`, `catalog-SC-52`,
  `catalog-SC-54`, `catalog-SC-57`, and `catalog-SC-58` pass on the product
  page (create/edit, draft→created, single inventory snapshot, reservations
  by `holder_kind` including `admin`, combined reservations table).
- [x] 5.3 Make intake and `catalog-SC-31` pass in dialogs on the product page
  (`productsViews.test.tsx`). Free-pool sell/withdraw and `catalog-SC-12` are
  out of scope for the inventory product page.
- [x] 5.4 Make admin reserve (`catalog-SC-59`, `catalog-SC-67`), admin release
  on the product page (`catalog-SC-60`, partial per `catalog-SC-35`),
  admin-only release actions (`catalog-SC-68`), and `catalog-SC-53` pass in the
  product-page dialogs. Auction/Vault reservation adjust, change-product,
  release, sell-from-reservation, and vault-from-reservation are out of scope
  for the inventory product page — they ship from Auction listing and Vault
  consoles instead (`productsViews.test.tsx`).
- [ ] 5.5 Make history badges pass for product-page mutations. Intake,
  reserve, and release badges pass in RTL (`productsViews.test.tsx`);
  reservation settlement badges are holder-console scope.
- [ ] 5.6 Verify with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
  and `pnpm run build` for the admin app slice. Package typecheck and tests
  pass; full admin-app build not yet recorded on this change.
