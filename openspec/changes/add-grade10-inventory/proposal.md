**Author:** @mason5991 - 2026-08-26

## Why

Grade10 operators have no house-owned stock ledger for physical inventory held
for Auction, Vault, and future consumer applications. Today a listing and a
sale sit on Auction alone; there is no central product stock snapshot and no
record of how much each application has reserved. Two applications can
therefore believe they may consume the same stock, and operations cannot
reconcile available, reserved, sold, and withdrawn quantities.

**Metric:** products created in the Grade10 inventory admin section, and the
share whose stock reconciles as available plus reservations grouped by holder.
**Acceptance signal:** an admin can create a product, intake quantities into
its single inventory, see every hold and its application/purpose/reference,
move available stock to sold or withdrawn, and trace every count transition
without allowing aggregate reservations to exceed stock.

## What Changes

- **New Grade10 Inventory product** — a house stock ledger with one catalogue
  product and one current inventory snapshot per product, domain change
  history, a global admin API and console, and scoped machine-to-machine
  reservation entrypoints.
- **Products and inventory snapshots** — products hold descriptive fields.
  Each product owns exactly one inventory snapshot with stock, reserved, sold,
  withdrawn, and ledger counts. Intake adds quantity to the existing snapshot;
  it never creates per-unit rows.
- **Count meanings** — stock is the quantity currently eligible to remain
  available or reserved. Ledger is the lifetime quantity admitted through
  intake and never decreases. `available + reserved = stock`, and `stock +
  sold + withdrawn = ledger`.
- **Application reservations** — a reservation assigns a quantity of one
  product to one holder application (`auction` or `vault` in this change),
  with a purpose and holder-owned reference. Different applications may
  reserve the same product while the sum of active reservation quantities
  remains at or below stock.
- **Scoped visibility** — admins see the complete inventory and allocation by
  application. A consumer application sees unreserved availability and its
  own reservations only; quantities held by another application do not appear
  in its reads or totals.
- **Change history** — every successful product create/update, intake,
  reserve, release, sale, and withdrawal records the action quantity, actor,
  and canonical before/after snapshot. Operator writes also use the platform
  audit chain.
- **Admin console** — Grade10 admin section with products, aggregate counts,
  allocation, and history; actions for product create/edit, intake, sale,
  withdrawal, reserve, and release.
- **Admin and application-scoped APIs** — elevated admin procedures manage
  the whole ledger. Named service-binding entrypoints grant Auction and Vault
  only their own reserve/release/read surface; holder identity comes from the
  bound entrypoint, never caller input.
- **Consumer wiring remains a follow-on** — this change defines and implements
  the inventory-side Auction and Vault reservation surfaces, but does not yet
  change either application’s product flows to call them.

## Capabilities

### New Capabilities

- `grade10-inventory/catalog`: products, one aggregate inventory per product,
  quantity intake and terminal transitions, application reservations, scoped
  visibility, change history, and admin console behaviours.

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

- Identifying, tagging, or tracing individual physical items. Add a serialized
  asset capability later if custody needs item-level identity.
- Wiring Auction or Vault product flows to the reservation entrypoints, or
  mapping Auction settlement onto inventory sale transitions.
- Collector or public inventory APIs; storefront stock display.
- Replacing or syncing Shopify inventory levels.
- Multi-brand (ZZZ) inventory worker.
- Barcode / SKU scanning, warehouses, transfers, purchase orders, or a full
  receiving workflow beyond recording an intake quantity.
- Soft-delete / archive of products.
- New `@grade10/ui` or design-system primitives.

## Validation

- `openspec validate add-grade10-inventory --strict`
- Scenarios cover aggregate intake, monotonic ledger counts, stock terminal
  transitions, reservation conservation and atomic exclusion, holder-scoped
  visibility, structured history, and unauthorized refusal.
