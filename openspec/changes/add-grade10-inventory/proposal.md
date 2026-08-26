**Author:** @mason5991 - 2026-08-26

## Why

Grade10 operators have no house-owned stock ledger for physical units they
sell through Auction and related channels. Today a listing and a sale sit on
Auction alone; there is no product identity, no per-unit inventory row, and
no operator console to add stock by quantity or see how many units remain.
Without that ledger, Auction cannot later bind a listing to a real unit, and
ops cannot tell available stock from units already reserved or sold.

**Metric:** products created in the Grade10 inventory admin section, and the
share of those products whose remaining available unit count matches the
physical stock operators intend to sell. **Acceptance signal:** an admin can
add a product, add N inventory units in one action, edit product and unit
fields, delete an eligible unit, and read remaining available count and unit
ids for a product — all from the Grade10 admin panel, admin-only.

## What Changes

- **New Grade10 Inventory product** — a house stock ledger of catalogue
  products and serialized inventory units (one row per physical unit), with
  per-entity change history and an admin-only API and console.
- **Products** — unique id, name, description, created/updated times,
  created-by operator, remarks. Operators list products, add, and edit.
- **Inventory units** — one unit per physical item of a product. Operators
  add units for a product by **quantity** (N identical unit rows, distinct
  ids, same product). Operators edit or delete a unit. Status is
  **channel-tied**: `available`, `auction-listing`, `auction-sold`,
  `withdrawn` in this change — so a sold unit records *how* it sold
  (Auction today; Store or other channels later as e.g. `store-sold`). Sold
  price (integer minor units) and sold currency (ISO 4217) are set only when
  status is a sold status (`auction-sold` now); otherwise null.
- **Change history** — **every** successful add, update, and delete on a
  product or unit is recorded (platform audit for operator elevated writes,
  plus domain changelogs for every mutation including server-driven ones).
  Actor is the operator’s user id, or `server` when the system updates a
  unit (for example marking `auction-sold`).
- **Admin console** — Grade10 admin section: products table; open a product
  to see its units; add product; add units by quantity; edit product; edit
  or delete a unit.
- **Admin-only API** — list products; remaining available unit count for a
  product; inventory unit ids for a product; the writes above. No collector
  or public surface in this change.
- **Auction seam (documented only)** — Auction will later take a product id
  in its listing editor and map listing lifecycle onto unit
  `auction-listing` / `auction-sold`. This change does **not** wire that
  connection.

## Capabilities

### New Capabilities

- `grade10-inventory/catalog`: products, serialized inventory units, status
  and sold-money rules, remaining available count, change history, and the
  admin-only API and Grade10 admin console behaviours for this product.

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
| `packages/inventory/{contracts,backend,admin-frontend}` | New product packages (`@grade10/inventory-*`). |
| `@grade10/auth-contracts` | Add `inventory` resource permissions; admin-only grants. |
| `packages/app-env` / deploy / Neon | Register `inventory` service id, Hyperdrive, migrations. |
| Grade10 Auction | **No code in this change.** Design records the future `productId` seam. |

Shopify store inventory and POS stock stay Shopify’s; this ledger is the
house Auction-oriented unit stock, not a replacement for store catalogue qty.

## Non-goals

- Wiring Auction listing create/edit to a product id, or mapping listing
  lifecycle onto unit status (follow-on).
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
- Spec scenarios cover product and unit CRUD, quantity add, status and sold
  money rules, remaining count, change history actors, and unauthorized
  refusal.
