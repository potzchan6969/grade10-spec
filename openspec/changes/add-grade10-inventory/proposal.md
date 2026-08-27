**Author:** @mason5991 - 2026-08-26

## Why

Grade10 operators have no house-owned stock ledger for physical units held
for Auction, Vault, and future consumer applications. Today a listing and a
sale sit on Auction alone; there is no product identity, no per-unit inventory
row, and no central record of which application has reserved each physical
item. Without that ledger, two applications can believe they may consume the
same stock, and ops cannot tell free stock from units held elsewhere.

**Metric:** products created in the Grade10 inventory admin section, and the
share whose stock count reconciles as available plus reservations grouped by
holder application. **Acceptance signal:** an admin can add a product, add N
inventory units in one action, edit product and unit fields, delete an
eligible unit, see every active hold and its application/purpose/reference,
distinguish current stock from the complete unit ledger, and verify that no
unit is held by more than one application.

## What Changes

- **New Grade10 Inventory product** — a house stock ledger of catalogue
  products and serialized inventory units (one row per physical unit), with
  per-entity change history, a global admin API and console, and scoped
  machine-to-machine reservation entrypoints.
- **Products** — unique id, name, description, created/updated times,
  created-by operator, remarks. Operators list products, add, and edit.
- **Inventory units** — one unit per physical item of a product. Operators
  add units for a product by **quantity** (N identical unit rows, distinct
  ids, same product). Unit state is independent from reservation ownership:
  `in-stock`, `auction-sold`, or `withdrawn`. Sold price (integer minor units)
  and sold currency (ISO 4217) are set only for `auction-sold`.
- **Application reservations** — first-class reservation records assign
  concrete unit ids to one holder application (`auction` or `vault` in this
  change), with a purpose and holder-owned reference describing how they are
  held. A unit can have at most one active reservation. Different
  applications may reserve disjoint units of the same product, so for every
  product `available + active reserved = stock count`; sold and withdrawn
  records remain in the larger ledger count.
- **Scoped visibility** — the admin surface sees all reservations and their
  allocation by application. A consumer application sees unreserved
  in-stock availability and its own reservations only; units reserved by a
  different application do not appear in its reads or totals.
- **Change history** — **every** successful add, update, delete, reserve, and
  release is recorded (platform audit for operator elevated writes, plus
  domain changelogs for every mutation including application-driven ones).
  Actor identifies the operator, holder application, or server path.
- **Admin console** — Grade10 admin section: products table; open a product
  to see its units and reservation allocation; add product; add units by
  quantity; edit product; edit or delete an eligible unit; create or release
  a reservation on behalf of a holder application.
- **Admin and application-scoped APIs** — elevated admin procedures manage
  the whole ledger. Named service-binding entrypoints grant Auction and Vault
  only their own reserve/release/read surface; holder identity comes from the
  bound entrypoint, never caller input.
- **Consumer wiring remains a follow-on** — this change defines and implements
  the inventory-side Auction and Vault reservation surfaces, but does not yet
  change either application’s product flows to call them.

## Capabilities

### New Capabilities

- `grade10-inventory/catalog`: products, serialized inventory units,
  application reservations, scoped visibility, unit state and sold-money
  rules, availability, change history, and admin console behaviours.

### Modified Capabilities

- (none) — RBAC vocabulary growth for `inventory:read` / `inventory:write`
  is delivery detail in `design.md`; the durable `shared-auth/roles` map is
  already behind the implementing repo and is not restated here.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/backend/grade10/inventory` | New worker: persistence, admin procedures, audit chain, Neon DB. |
| `apps/backend/grade10/api` | Route `/inventory` via service binding to the new worker. |
| `apps/admin/grade10` | New Inventory section composing `@grade10/inventory-admin-frontend`. |
| `packages/inventory/{contracts,backend,admin-frontend}` | New product packages (`@grade10/inventory-*`), including holder-scoped RPC contracts. |
| `@grade10/auth-contracts` | Add `inventory` resource permissions; admin-only grants. |
| `packages/app-env` / deploy / Neon | Register `inventory` service id, Hyperdrive, migrations. |
| Grade10 Auction / Vault | Bindings and call sites remain follow-on work; inventory mints a named entrypoint for each holder. |

Shopify store inventory and POS stock stay Shopify’s; this ledger is Grade10’s
house-managed Auction and Vault stock, not a replacement for store catalogue
quantity.

## Non-goals

- Wiring Auction or Vault product flows to the reservation entrypoints, or
  mapping Auction settlement onto `auction-sold` (follow-on).
- Collector or public inventory APIs; storefront stock display.
- Replacing or syncing Shopify inventory levels.
- Multi-brand (ZZZ) inventory worker.
- Barcode / SKU scanning, warehouses, transfers, purchase orders, or
  receiving workflows.
- Soft-delete / archive of products (products are edited; units may be
  deleted when eligible).
- New `@grade10/ui` or design-system primitives (compose existing admin
  patterns).

## Validation

- `openspec validate add-grade10-inventory --strict`
- Spec scenarios cover product and unit CRUD, quantity add, reservation
  conservation and atomic exclusion, holder-scoped visibility, state and
  sold-money rules, change-history actors, and unauthorized refusal.
