# UI: Grade10 inventory admin

## Screens

**No Figma frame exists for these surfaces.** Layout source until a designer
adds frames: the live Grade10 admin auction listings panel and listing editor
(`apps/admin/grade10` auction section) — same list → detail rhythm and
app-local table parts.

Assembly in `apps/admin/grade10` composing `@grade10/inventory-admin-frontend`.
Behavior: [`grade10-inventory/catalog`](specs/grade10-inventory/catalog/spec.md).

No collector or public inventory UI is part of this change.

### Products list

Route: Inventory section root. Behavior: catalog-SC-13, catalog-SC-30,
catalog-SC-32, catalog-SC-33, catalog-SC-58.

Columns: name, **state** (`draft` | `created`), aggregate stock, available,
reserved, vaulted, sold, withdrawn, derived ledger. Primary action: create
product. Row opens the product page.

### Product page

Route: product detail / create. Behavior: catalog-SC-01, catalog-SC-02,
catalog-SC-29, catalog-SC-52, catalog-SC-54, catalog-SC-57, catalog-SC-58,
catalog-SC-59, catalog-SC-60, plus reservation and history scenarios used from
this page (catalog-SC-14–catalog-SC-22, catalog-SC-35–catalog-SC-38,
catalog-SC-47–catalog-SC-50, catalog-SC-23–catalog-SC-28,
catalog-SC-41–catalog-SC-42).

Shows:

- Product fields (name, description, remarks) with create and edit
- Product **state** badge; action to mark `draft` → `created` (one-way)
- Inventories table for this product (id, status, counts); create inventory;
  row opens the inventory page
- Reservations grouped by **`holder_kind`** (`auction` | `vault`) with
  remaining / sold / vaulted / released and state
- Product-scoped change history

Reserve / adjust / release / sell-from-reservation / vault-from-reservation
dialogs live here (holds are product-level).

### Inventory page

Route: inventory create under a product, or inventory detail. Behavior:
catalog-SC-03, catalog-SC-04, catalog-SC-05–catalog-SC-12, catalog-SC-31,
catalog-SC-44–catalog-SC-46, catalog-SC-51, catalog-SC-55, catalog-SC-56,
catalog-SC-59, catalog-SC-60.

Shows:

- Parent product link and product state
- Inventory fields: **status** (`stocked` | `ready`), remarks, create and edit
- Snapshot counts including vaulted and derived available / ledger
- Intake, free-pool sell, and withdraw (ready-only for sell/withdraw)
- Inventory-scoped change history

## Components

Existing `@grade10/design-system` exports only:

- Fields: `TextInput` for product text, purpose, holder reference, intake
  remarks, inventory remarks, and withdrawal reason; `NumberInput` for intake,
  reserve, release, sell, vault, and withdrawal quantities, and sold total
  price.
- Choice: `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`,
  and `SelectItem` for **`holder_kind`** (Auction / Vault), inventory
  **status** (Stocked / Ready), and sold currency.
- Actions and layout: `Button`, `Text`, `HStack`, `VStack`, and
  `Badge`.
- Dialogs: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`,
  `DialogTitle`, `DialogBody`, `DialogFooter`, and `DialogClose`.

App-local parts, following the auction admin:

- Table / Row / Cell chrome under `pages/inventory/parts`, unless the admin
  app factors an existing helper first.
- Product-state badges for `draft` and `created`.
- Reservation-state badges for `active` and `closed`, plus **`holder_kind`**
  labels for Auction and Vault (kind is the classifier — not inferred from
  reference).
- Inventory-status badges for `stocked` and `ready`.
- Change-action badges for product create/update, inventory create/update,
  intake, status-change, reserve, adjust, release, sell-from-reservation,
  vault-from-reservation, sell, and withdraw.

Nothing new is required from `@grade10/ui` or the design system.

## States

### Products list

- **Loading** — product list in flight.
- **Empty** — catalog-SC-30.
- **Populated** — catalog-SC-13 (includes state and vaulted).
- **Create product** — catalog-SC-58 / catalog-SC-01 / catalog-SC-02.
- **Error** — list refusal or transport failure; authorization refusal is
  catalog-SC-32.
- **Section hidden** — catalog-SC-33.

### Product page

- **Create / edit product** — catalog-SC-01, catalog-SC-02, catalog-SC-57.
- **Draft vs created** — catalog-SC-52, catalog-SC-54; holder reserve blocked
  while draft is catalog-SC-53.
- **Inventories empty / populated** — catalog-SC-58, catalog-SC-59,
  catalog-SC-60.
- **Oversight** — catalog-SC-29 (vaulted and reservations by kind).
- **Allocation by holder_kind** — catalog-SC-17 and catalog-SC-29.
- **Reserve success / idempotent active retry** — catalog-SC-14–catalog-SC-15.
- **Re-reserve after close** — catalog-SC-16.
- **Partial / full release** — catalog-SC-22 and catalog-SC-35.
- **Adjust reservation quantity** — catalog-SC-47–catalog-SC-50.
- **Sell-from-reservation** — catalog-SC-36 and catalog-SC-37.
- **Vault-from-reservation** — catalog-SC-38.
- **Insufficient available stock** — catalog-SC-12 and catalog-SC-19.
- **Change history** — catalog-SC-23–catalog-SC-28, catalog-SC-41–catalog-SC-42.

### Inventory page

- **Create / edit inventory** — catalog-SC-04, catalog-SC-55, catalog-SC-56,
  catalog-SC-59.
- **Snapshot** — catalog-SC-03 and inventory counts on open (catalog-SC-60).
- **Stocked vs ready** — catalog-SC-44–catalog-SC-46, catalog-SC-51.
- **Intake success** — catalog-SC-05 and catalog-SC-31.
- **Intake validation error** — catalog-SC-08 and catalog-SC-09.
- **Sale success** — catalog-SC-10.
- **Withdrawal success** — catalog-SC-11.
