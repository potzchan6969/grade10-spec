**Author:** @mason5991 - 2026-08-26

## Why

Grade10 operators have no house-owned stock ledger for physical inventory held
for Auction, Vault, and future consumer applications. Today a listing and a
sale sit on Auction alone; there is no central product stock snapshot and no
record of how much each application has reserved or vaulted. Two applications
can therefore believe they may consume the same stock, and operations cannot
reconcile available, reserved, vaulted, sold, and withdrawn quantities.

Auction settles by selling; Vault settles by vaulting (custody), not selling.
Reservations must support partial sell, partial vault, partial release, and
quantity adjust, and must classify the consumer with an explicit
`holder_kind` (`grade10-auction` | `grade10-vault`) rather than inferring it from ids.

**Metric:** products created in the Grade10 inventory admin section, and the
share whose stock reconciles as available plus reservations grouped by
`holder_kind`.
**Acceptance signal:** an admin can create a draft product with one inventory
row, mark it created, intake quantities, see every hold with kind/remarks/
reference and remaining quantity, adjust a hold's quantity, move remaining
stock to sold (Auction), vaulted (Vault), or back to available, and trace
every count transition without allowing aggregate reservations to exceed
available stock.

## What Changes

- **New Grade10 Inventory product** — a house stock ledger with one catalogue
  product and exactly one inventory snapshot per product (`UNIQUE(product_id)`),
  domain change history, a global admin API and console, and scoped
  machine-to-machine reservation entrypoints.
- **Products and inventory snapshots** — products hold descriptive fields and
  lifecycle **`status`**: `draft` (default) or `created` (one-way mark). Each
  product owns **one** inventory row seeded at create. Each row **stores**
  stock, reserved, vaulted, sold, and withdrawn — updated by the inventory
  service in the same locked transaction as the mutation. Intake stocks up;
  free-pool sell/withdraw stock down. **Available** and **ledger** are derived,
  not columns.
- **Application reservations** — a product-level hold for one consumer
  identified by **`holder_kind`** plus a holder-owned reference. Quantity
  partitions live on the reservation header (`remaining`, `sold`, `vaulted`,
  `released`); there is **no** `reservation_allocations` table. Inventory
  `reserved` tracks the sum of active `remaining`.
- **Adjust quantity** — an active reservation's quantity MAY change up or down
  under the same id; inventory `reserved` syncs in the same transaction.
- **Change product** — an active reservation MAY move to another **created**
  product via `changeReservationProduct` in one transaction; both inventories'
  **`reserved`** sync; reservation **`released`** does not increase for the
  freed remaining (same rule as adjust-down).
  Changelog records every adjust and product change.
- **Partial settle and release** — Auction may sell part of remaining; Vault may
  vault part of remaining; either may release part back to available. A
  reservation closes when remaining reaches zero. Closed references may be
  reserved again (new row).
- **Scoped visibility** — admins see the complete inventory and holds grouped
  by `holder_kind`. Consumer entrypoints see unreserved availability and
  their own reservations only.
- **Change history** — every successful product create/update, intake, reserve,
  adjust, change-product, release, sell-from-reservation,
  vault-from-reservation, free-pool sell, and withdrawal records quantity,
  actor, and before/after snapshots.
- **Admin console** — products list and product page (single inventory per
  product); create/edit product, draft→created, intake, reserve, adjust,
  change-product, partial release, sell-from-reservation,
  vault-from-reservation, free-pool sale/withdrawal, history.
- **Admin and application-scoped APIs** — elevated admin procedures manage the
  whole ledger. Named service-binding entrypoints grant Auction and Vault only
  their own surface; `holder_kind` comes from the bound entrypoint, never
  caller input. Auction exposes eligibility: `created` products with available
  > 0 (consumed by [`add-admin-auction-campaigns`](../add-admin-auction-campaigns/proposal.md)).

## Capabilities

### New Capabilities

- `grade10-admin/inventory/catalog`: products (`draft` | `created`), one inventory
  row per product, quantity intake and terminal transitions, application
  reservations with remaining/sold/vaulted/released tracking, vaulted stock
  partition, derived ledger/available, scoped visibility, change history, and
  admin console (products list, product page).

### Modified Capabilities

- (none) — RBAC vocabulary growth for `inventory:read` / `inventory:write`
  is delivery detail in `design.md`.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/backend/grade10/inventory` | New worker: persistence, admin procedures, audit chain, Neon DB. |
| `apps/backend/grade10/api` | Route `/inventory` via service binding to the new worker. |
| `apps/admin/grade10` | New Inventory section composing `@grade10/inventory-admin-frontend`. |
| `packages/inventory/{contracts,backend,admin-frontend}` | New product packages (`@grade10/inventory-*`), including holder-scoped RPC contracts. |
| `@grade10/auth-contracts` | Add `inventory` resource permissions; admin-only grants. |
| `packages/app-env` / deploy / Neon | Register `inventory` service id, Hyperdrive, migrations. |
| Grade10 Auction / Vault | Holder RPCs (`reserve`, `adjustReservation`, `changeReservationProduct`, `release`); listing sync in `add-admin-auction-campaigns`. |

Shopify store inventory and POS stock stay Shopify's; this ledger is Grade10's
house-managed Auction and Vault stock, not a replacement for store catalogue
quantity.

## Non-goals

- Identifying, tagging, or tracing individual physical items.
- `reservation_allocations` or multi-row inventory per product.
- Inventory `status` (stocked / ready) or ready-only gating.
- Wiring Auction or Vault flows beyond holder RPCs and the listing reservation
  sync defined in [`add-admin-auction-campaigns`](../add-admin-auction-campaigns/proposal.md).
- Unvault / reverse of `vaulted` back to stock.
- Collector or public inventory APIs; storefront stock display.
- Replacing or syncing Shopify inventory levels.
- Multi-brand (ZZZ) inventory worker.
- Soft-delete / archive of products; reverting `created` → `draft`.
- New `@grade10/ui` or design-system primitives.

## Validation

- `openspec validate add-grade10-inventory --strict`
- Scenarios cover intake, monotonic sold/vaulted/withdrawn, stock terminal
  transitions, reservation remaining conservation, partial sell/vault/release,
  adjust with inventory sync, change-product atomically, re-reserve after close,
  concurrent exclusion,
  holder-scoped visibility, structured history, and unauthorized refusal.
