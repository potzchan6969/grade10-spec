# Tasks: Add Grade10 inventory

No grade10-spec package work is required; the UI composes existing exports.
Once group 1 lands, schema and admin frontend can proceed in parallel. The
worker depends on contracts and schema. Frontend uses contracts and fixtures,
never a running worker.

## 1. Share aggregate inventory contracts (grade10)

- [ ] 1.1 Make `catalog-SC-01 - Operator creates a draft product with no
  inventory`, `catalog-SC-02 - Product create without a name is refused`,
  `catalog-SC-03 - Counts reconcile across current and terminal stock`,
  `catalog-SC-04 - Operator creates inventory under a product`,
  `catalog-SC-13 - Operator lists products with aggregate counts`,
  `catalog-SC-52 - Operator marks a draft product created`,
  `catalog-SC-54 - Created to draft is refused`,
  `catalog-SC-55 - Operator creates a second inventory under the same product`,
  `catalog-SC-56 - Operator edits inventory remarks and status`, and
  `catalog-SC-57 - Operator edits product fields` pass with product
  (`state` draft|created), snapshot (including vaulted and remarks), count,
  and admin procedure-client schemas.
- [ ] 1.2 Make `catalog-SC-05 - Operator intakes three`, `catalog-SC-06 -
  Repeated intakes accumulate on the chosen inventory`, `catalog-SC-08 -
  Invalid intake quantity is refused`, `catalog-SC-09 - Intake for unknown
  inventory is refused`, `catalog-SC-10 - Operator records a sale`,
  `catalog-SC-11 - Operator records a withdrawal`, and `catalog-SC-12 -
  Terminal transition cannot consume reserved stock` pass with intake, sale,
  withdrawal, money, reason, and typed-refusal contracts.
- [ ] 1.3 Make `catalog-SC-14 - Auction reserves a quantity`,
  `catalog-SC-15 - Same active reference retries idempotently`,
  `catalog-SC-16 - Closed reference may reserve again`,
  `catalog-SC-22 - Vault releases a full remaining hold`, and
  `catalog-SC-35 - Partial release leaves remaining active` pass with
  reservation fields (`holder_kind`, remaining/sold/vaulted/released, state
  active/closed), inputs, outputs, actor stamps, and the 1–500 boundary.
- [ ] 1.4 Make `catalog-SC-36 - Auction partially sells from a reservation`,
  `catalog-SC-37 - Partial sell then release closes the reservation`,
  `catalog-SC-38 - Vault partially vaults from a reservation`,
  `catalog-SC-39 - Vault cannot sell from reservation`, and
  `catalog-SC-40 - Auction cannot vault from reservation` pass with
  sell-from-reservation / vault-from-reservation contracts and entrypoint
  surface narrowing.
- [ ] 1.5 Make `catalog-SC-20 - Vault cannot see Auction reservations`,
  `catalog-SC-21 - Another kind cannot release a reservation`,
  `catalog-SC-34 - Public caller cannot reach holder methods`,
  `catalog-SC-61 - Auction eligibility list omits draft and out-of-stock`, and
  `catalog-SC-62 - Eligibility available matches ready sum on created products`
  pass at the type boundary with scoped RPC surfaces,
  `AuctionInventoryService` / `VaultInventoryService` binding narrowings
  (`holder_kind` from entrypoint, never input), and the Auction eligibility
  list shape.
- [ ] 1.6 Make `catalog-SC-23 - Product update records operator and
  snapshots`, `catalog-SC-24 - Intake history carries the added quantity`,
  `catalog-SC-25 - Reserve history records allocation and snapshot`,
  `catalog-SC-26 - Release history records allocation and snapshot`,
  `catalog-SC-27 - Terminal history records action details`,
  `catalog-SC-28 - Refused write leaves history unchanged`,
  `catalog-SC-41 - Sell-from-reservation history`, and
  `catalog-SC-42 - Vault-from-reservation history` pass with typed changelog
  actions, non-null inventory reference, nullable reservation reference,
  quantity, actor, and snapshot contracts.
- [ ] 1.7 Make `catalog-SC-32 - Unauthorized inventory read is refused` and
  `catalog-SC-33 - Inventory section hidden without grants` pass by adding
  `inventory:read` / `inventory:write` to auth permission statements,
  granting them only through admin `ALL_PERMISSIONS`.
- [ ] 1.8 Verify inventory and auth contracts with `pnpm run typecheck`,
  `pnpm run lint`, and focused contract tests.

## 2. Migrate the aggregate inventory schema (grade10)

Depends on group 1.

- [ ] 2.1 Make `catalog-SC-01 - Operator creates a draft product with no
  inventory`, `catalog-SC-03 - Counts reconcile across current and terminal
  stock`, `catalog-SC-04 - Operator creates inventory under a product`,
  `catalog-SC-05 - Operator intakes three`, `catalog-SC-06 - Repeated intakes
  accumulate on the chosen inventory`, `catalog-SC-10 - Operator records a
  sale`, `catalog-SC-11 - Operator records a withdrawal`,
  `catalog-SC-44 - Stocked inventory is not reservable`,
  `catalog-SC-45 - Marking inventory ready enables reserve`,
  `catalog-SC-46 - Cannot stock a row that still has reservations`,
  `catalog-SC-51 - Stocked inventory cannot free-pool sell or withdraw`,
  `catalog-SC-52 - Operator marks a draft product created`,
  `catalog-SC-54 - Created to draft is refused`, and
  `catalog-SC-55 - Operator creates a second inventory under the same product`
  pass structurally with the product/inventory key (non-unique `product_id`),
  product `state` check (`draft` | `created`), inventory `status` check
  (`stocked` | `ready`), stored bigint counts
  (`stock`, `reserved`, `vaulted`, `sold`, `withdrawn` — no `ledger` column),
  derived ledger identity (`stock + sold + withdrawn + vaulted`), and
  monotonic triggers for sold / withdrawn / vaulted from `design.md`.
- [ ] 2.2 Make `catalog-SC-14 - Auction reserves a quantity`,
  `catalog-SC-16 - Closed reference may reserve again`,
  `catalog-SC-17 - Auction and Vault reserve the same product`,
  `catalog-SC-18 - Concurrent reservations cannot oversubscribe stock`,
  `catalog-SC-19 - Insufficient stock reserves nothing`,
  `catalog-SC-22 - Vault releases a full remaining hold`,
  `catalog-SC-35 - Partial release leaves remaining active`,
  `catalog-SC-36 - Auction partially sells from a reservation`,
  `catalog-SC-38 - Vault partially vaults from a reservation`,
  `catalog-SC-43 - Reserve fills across multiple inventories when present`,
  `catalog-SC-47 - Increase listing reservation 3 to 5 acquires more stock`,
  `catalog-SC-48 - Decrease listing reservation 5 to 2 frees newest allocation first`,
  `catalog-SC-49 - Increase refused when not enough ready stock`, and
  `catalog-SC-50 - Cannot adjust below sold plus vaulted plus released`
  pass with reservation headers, `reservation_allocations`, `holder_kind`,
  non-unique `inventories.product_id`, partial-unique active
  `(holder_kind, holder_reference)`, active/closed checks, and indexes.
- [ ] 2.3 Make `catalog-SC-07 - Intake appends one quantity change`,
  `catalog-SC-23 - Product update records operator and snapshots`,
  `catalog-SC-24 - Intake history carries the added quantity`,
  `catalog-SC-25 - Reserve history records allocation and snapshot`,
  `catalog-SC-26 - Release history records allocation and snapshot`,
  `catalog-SC-27 - Terminal history records action details`,
  `catalog-SC-28 - Refused write leaves history unchanged`,
  `catalog-SC-41 - Sell-from-reservation history`, and
  `catalog-SC-42 - Vault-from-reservation history` pass structurally with
  the non-null inventory foreign key, subject/action checks (including
  sell-from-reservation and vault-from-reservation), composite
  reservation/inventory foreign key, action-specific checks, history indexes,
  append-only guards, and shared per-worker `audit_logs`.
- [ ] 2.4 Generate migration artifacts for
  `apps/backend/grade10/inventory`, then run
  `pnpm run db:drizzle:generate`, `pnpm run check:migrations`,
  `pnpm run typecheck`, and `pnpm run test:backend`.

## 3. Implement inventory domain services (grade10)

Depends on groups 1 and 2.

- [ ] 3.1 Make `catalog-SC-01 - Operator creates a draft product with no
  inventory`, `catalog-SC-02 - Product create without a name is refused`,
  `catalog-SC-04 - Operator creates inventory under a product`,
  `catalog-SC-13 - Operator lists products with aggregate counts`,
  `catalog-SC-52 - Operator marks a draft product created`,
  `catalog-SC-53 - Holder cannot reserve a draft product`,
  `catalog-SC-54 - Created to draft is refused`,
  `catalog-SC-55 - Operator creates a second inventory under the same product`,
  `catalog-SC-56 - Operator edits inventory remarks and status`, and
  `catalog-SC-57 - Operator edits product fields` pass through product and
  inventory services.
- [ ] 3.2 Make `catalog-SC-05 - Operator intakes three`, `catalog-SC-06 -
  Repeated intakes accumulate on the chosen inventory`, `catalog-SC-08 -
  Invalid intake quantity is refused`, `catalog-SC-09 - Intake for unknown
  inventory is refused`, `catalog-SC-10 - Operator records a sale`,
  `catalog-SC-11 - Operator records a withdrawal`, and `catalog-SC-12 -
  Terminal transition cannot consume reserved stock` pass through snapshot
  mutations under inventory-row lock.
- [ ] 3.3 Make `catalog-SC-14 - Auction reserves a quantity`,
  `catalog-SC-15 - Same active reference retries idempotently`,
  `catalog-SC-16 - Closed reference may reserve again`,
  `catalog-SC-19 - Insufficient stock reserves nothing`,
  `catalog-SC-22 - Vault releases a full remaining hold`, and
  `catalog-SC-35 - Partial release leaves remaining active` pass through
  transactional reserve/release services with remaining tracking.
- [ ] 3.4 Make `catalog-SC-17 - Auction and Vault reserve the same product`
  and `catalog-SC-18 - Concurrent reservations cannot oversubscribe stock`
  pass with two real entrypoints and `SELECT … FOR UPDATE` serialization.
- [ ] 3.5 Make `catalog-SC-36 - Auction partially sells from a reservation`,
  `catalog-SC-37 - Partial sell then release closes the reservation`, and
  `catalog-SC-38 - Vault partially vaults from a reservation` pass through
  sell-from-reservation and vault-from-reservation services updating both
  reservation partitions and inventory `sold` / `vaulted`.
- [ ] 3.6 Make `catalog-SC-20 - Vault cannot see Auction reservations`,
  `catalog-SC-21 - Another kind cannot release a reservation`,
  `catalog-SC-39 - Vault cannot sell from reservation`,
  `catalog-SC-40 - Auction cannot vault from reservation`,
  `catalog-SC-61 - Auction eligibility list omits draft and out-of-stock`, and
  `catalog-SC-62 - Eligibility available matches ready sum on created products`
  pass through entrypoint-scoped services.
- [ ] 3.7 Make `catalog-SC-23` through `catalog-SC-28`, `catalog-SC-41`, and
  `catalog-SC-42` pass with domain changelog + elevated audit writes.
- [ ] 3.8 Verify with `pnpm run typecheck`, `pnpm run lint`, and
  `pnpm run test:backend`.

## 4. Expose admin and holder RPC surfaces (grade10)

Depends on group 3.

- [ ] 4.1 Make `catalog-SC-01`, `catalog-SC-13`, `catalog-SC-32`, and
  `catalog-SC-34` pass through admin procedures and gateway routing.
- [ ] 4.2 Make free-pool intake/sell/withdraw and catalog-SC-12 pass through
  admin mutations and fixtures.
- [ ] 4.3 Make reserve, partial release, sell-from-reservation,
  vault-from-reservation, catalog-SC-16, and catalog-SC-35–catalog-SC-40 pass
  through reservation admin and holder entrypoints.
- [ ] 4.4 Make history scenarios including catalog-SC-41 and catalog-SC-42
  pass through read models.
- [ ] 4.5 Verify with `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run test:backend`, and `pnpm run build` for the inventory worker /
  API wiring.

## 5. Compose Grade10 inventory admin UI (grade10)

Depends on groups 1 and 4 (fixtures; no live worker required for UI tests).

- [ ] 5.1 Make `catalog-SC-13`, `catalog-SC-30`, `catalog-SC-32`,
  `catalog-SC-33`, and `catalog-SC-58` pass on the products list (state column,
  create product → product page).
- [ ] 5.2 Make `catalog-SC-01`, `catalog-SC-29`, `catalog-SC-52`,
  `catalog-SC-54`, `catalog-SC-57`, `catalog-SC-59`, and `catalog-SC-60` pass
  on the product page (create/edit product, draft→created, inventories list,
  open inventory, reservations by `holder_kind`).
- [ ] 5.3 Make `catalog-SC-04`, `catalog-SC-55`, `catalog-SC-56`, intake,
  free-pool sell/withdraw, and catalog-SC-12 / catalog-SC-31 /
  catalog-SC-44–catalog-SC-46 / catalog-SC-51 pass on the inventory page
  (create/edit inventory, snapshot, ready-only outbound actions).
- [ ] 5.4 Make reserve, partial release, sell-from-reservation,
  vault-from-reservation, catalog-SC-16, catalog-SC-35–catalog-SC-38, and
  catalog-SC-53 pass in product-page allocation dialogs.
- [ ] 5.5 Make history including product/inventory create-update,
  sell-from-reservation, and vault-from-reservation badges pass.
- [ ] 5.6 Verify with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
  and `pnpm run build` for the admin app slice.
