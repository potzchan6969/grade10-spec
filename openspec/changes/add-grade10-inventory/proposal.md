**Author:** @mason5991 - 2026-08-26

## Why

Grade10 operators have no house-owned stock ledger for physical inventory held
for Auction, Vault, and future consumer applications. Today a listing and a
sale sit on Auction alone; there is no central product stock snapshot and no
record of how much each application has reserved or vaulted. Two applications
can therefore believe they may consume the same stock, and operations cannot
reconcile available, reserved, vaulted, sold, and withdrawn quantities.

Auction settles by selling; Vault settles by vaulting (custody), not selling.
Reservations must therefore support partial sell, partial vault, and partial
release back to available, and must classify the consumer with an explicit
`holder_kind` (`auction` | `vault`) rather than inferring it from ids.

**Metric:** products created in the Grade10 inventory admin section, and the
share whose stock reconciles as available plus reservations grouped by
`holder_kind`.
**Acceptance signal:** an admin can create a draft product, add one or more
inventory rows under it, mark the product created, intake quantities into a
chosen inventory, see every hold with kind/purpose/reference and remaining
quantity, move remaining stock to sold (Auction), vaulted (Vault), or back to
available, and trace every count transition without allowing aggregate
reservations to exceed available stock.

## What Changes

- **New Grade10 Inventory product** — a house stock ledger with one catalogue
  product and inventory snapshot row(s) per product, domain change history, a
  global admin API and console, and scoped machine-to-machine reservation
  entrypoints.
- **Products and inventory snapshots** — products hold descriptive fields and a
  lifecycle **`state`**: `draft` (default on create) or `created` (one-way
  mark). Each product may have **zero or more** inventory rows (separate
  stock-ups). Creating a product does **not** seed inventory; admins create
  and edit inventory rows under the product. Schema does **not** enforce
  uniqueness on `product_id`. Each inventory row has a **`status`**: `stocked`
  (on hand, not reservable) or `ready` (may be reserved / settled). Each row
  **stores** stock, reserved, vaulted, sold, and withdrawn — all updated by
  the inventory service in the same locked transaction as the mutation (not
  by Postgres counter triggers). Intake adds quantity to a chosen inventory
  row; it never creates per-unit rows. Holder reserve requires product
  `created` plus ready available.
- **Count meanings** — stock is on-hand (available + reserved). Reserved is
  held quantity. Vaulted / sold / withdrawn are lifetime partitions out of
  stock. **Available** (`stock - reserved`) and **ledger**
  (`stock + sold + withdrawn + vaulted`, lifetime intaken) are **derived**,
  not columns. Holder-facing product available sums availables on **`ready`**
  rows only.
- **Application reservations** — a reservation is a **product-level** hold for
  one consumer identified by **`holder_kind`** (`auction` or `vault`) plus a
  holder-owned reference (`listingId` / `caseId`). Quantity partitions live on
  the header; **`reservation_allocations`** pin slices to inventory rows so a
  hold can span multiple stock-ups when one row lacks enough available.
  Different kinds may reserve the same product while active remaining stays
  within product-level available.
- **Partial settle, release, and adjust** — Auction may sell part of a
  reservation’s remaining; Vault may vault part of remaining; either may
  release part of remaining back to available. An active reservation’s
  quantity MAY be **adjusted** up or down (e.g. admin edits a draft listing
  from 3 to 5 or 3 to 2) under the same reservation id — acquire more ready
  stock or release the difference — **without** releasing the whole hold and
  re-reserving (that would race). A reservation closes when remaining reaches
  zero. Closed references may be reserved again (new row).
- **Scoped visibility** — admins see the complete inventory and allocation by
  `holder_kind`. A consumer application sees unreserved availability and its
  own reservations only; quantities held by another kind do not appear in its
  reads or totals.
- **Change history** — every successful product create/update, intake,
  status-change, reserve, adjust, release, sell-from-reservation,
  vault-from-reservation, free-pool sell, and withdrawal records the action
  quantity, actor, and canonical before/after snapshot. Operator writes also
  use the platform audit chain.
- **Admin console** — Grade10 Inventory section with a products list, a
  **product page** (create/edit product, draft→created, inventories list,
  product-level reservations and history), and an **inventory page**
  (create/edit inventory under the product, snapshot, intake, status,
  free-pool sale/withdrawal, row history). Also reserve, adjust, partial
  release, sell-from-reservation, and vault-from-reservation from the product
  page.
- **Admin and application-scoped APIs** — elevated admin procedures manage
  the whole ledger. Named service-binding entrypoints grant Auction and Vault
  only their own surface; `holder_kind` comes from the bound entrypoint, never
  caller input. Auction may sell-from-reservation and adjust; Vault may
  vault-from-reservation and adjust; neither impersonates the other. Auction
  (and admin reads for the listing editor) expose an **eligibility list**:
  `created` products with ready available > 0 — consumed by
  [`add-admin-auction-campaigns`](../add-admin-auction-campaigns/proposal.md)
  for listing `productId` selection.
- **Consumer wiring remains mostly follow-on** — this change implements the
  inventory-side Auction and Vault surfaces including eligibility reads;
  Auction’s listing editor product picker lands in
  `add-admin-auction-campaigns`; full reserve-on-create wiring may still
  trail.

## Capabilities

### New Capabilities

- `grade10-inventory/catalog`: products (`draft` | `created`), zero or more
  inventory rows per product with explicit create/edit, quantity intake and
  terminal transitions, application reservations with allocations and
  remaining/sold/vaulted/released tracking, vaulted stock partition, derived
  ledger/available, scoped visibility, change history, and admin console
  (products list, product page, inventory page).

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
| Grade10 Auction / Vault | Named entrypoints + eligibility list in this change; listing `productId` picker consumes eligibility via `add-admin-auction-campaigns`; reserve-on-create / vault case wiring remain follow-on. |

Shopify store inventory and POS stock stay Shopify’s; this ledger is Grade10’s
house-managed Auction and Vault stock, not a replacement for store catalogue
quantity.

## Non-goals

- Identifying, tagging, or tracing individual physical items. Add a serialized
  asset capability later if custody needs item-level identity.
- Full Auction/Vault reserve-on-create (or vault-case) wiring beyond the
  eligibility list this change ships and the listing product picker in
  `add-admin-auction-campaigns`.
- Unvault / reverse of `vaulted` back to stock (vaulted is monotonic in
  this capability, like sold).
- Collector or public inventory APIs; storefront stock display.
- Replacing or syncing Shopify inventory levels.
- Multi-brand (ZZZ) inventory worker.
- Barcode / SKU scanning, warehouses, transfers, purchase orders, or a full
  receiving workflow beyond recording an intake quantity.
- Soft-delete / archive of products.
- Reverting `created` → `draft`.
- New `@grade10/ui` or design-system primitives.

## Validation

- `openspec validate add-grade10-inventory --strict`
- Scenarios cover aggregate intake, monotonic sold/vaulted/withdrawn (derived ledger), stock terminal
  transitions, reservation remaining conservation, partial sell/vault/release,
  re-reserve after close, concurrent exclusion, holder-scoped visibility,
  structured history, and unauthorized refusal.
