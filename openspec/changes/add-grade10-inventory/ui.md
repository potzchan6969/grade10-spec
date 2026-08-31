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

Columns: name, **status** (`draft` | `created`), stock, available, reserved,
vaulted, sold, withdrawn, derived ledger. Primary action: create product. Row
opens the product page.

### Product page

Route: product detail / create. Behavior: catalog-SC-01, catalog-SC-02,
catalog-SC-29, catalog-SC-52, catalog-SC-54, catalog-SC-57, catalog-SC-58,
plus reservation and history scenarios (catalog-SC-14–catalog-SC-22,
catalog-SC-35–catalog-SC-38, catalog-SC-47–catalog-SC-51, catalog-SC-63–catalog-SC-65,
catalog-SC-23–catalog-SC-28, catalog-SC-41–catalog-SC-45).

Shows:

- Product fields (name, description, remarks) with create and edit
- Product **status** badge; action to mark `draft` → `created` (one-way)
- The product's **single inventory snapshot** (counts including vaulted)
- Reservations grouped by **`holder_kind`** (`grade10-auction` | `grade10-vault`) with
  remaining / sold / vaulted / released and status
- Product-scoped change history

Intake, free-pool sell/withdraw, reserve, adjust, change-product, partial
release, sell-from-reservation, and vault-from-reservation dialogs live on
this page.

## Components

Existing `@grade10/design-system` exports only:

- Fields: `TextInput` for product text, reservation remarks, holder reference, intake
  remarks, and withdrawal reason; `NumberInput` for intake, reserve, adjust,
  change-product, release, sell, vault, and withdrawal quantities, and sold
  total price.
- Choice: `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`,
  and `SelectItem` for **`holder_kind`** (Auction / Vault) and sold currency.
- Actions and layout: `Button`, `Text`, `HStack`, `VStack`, and `Badge`.
- Dialogs: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`,
  `DialogTitle`, `DialogBody`, `DialogFooter`, and `DialogClose`.

App-local parts, following the auction admin:

- Table / Row / Cell chrome under `pages/inventory/parts`.
- Product-status badges for `draft` and `created`.
- Reservation-status badges for `active` and `closed`, plus **`holder_kind`**
  labels for Auction and Vault.
- Change-action badges for product create/update, intake, reserve, adjust,
  change-product, release, sell-from-reservation, vault-from-reservation,
  sell, and withdraw.

Nothing new is required from `@grade10/ui` or the design system.

## States

### Products list

- **Loading** — product list in flight.
- **Empty** — catalog-SC-30.
- **Populated** — catalog-SC-13 (includes status and vaulted).
- **Create product** — catalog-SC-58 / catalog-SC-01 / catalog-SC-02.
- **Error** — list refusal or transport failure; authorization refusal is
  catalog-SC-32.
- **Section hidden** — catalog-SC-33.

### Product page

- **Create / edit product** — catalog-SC-01, catalog-SC-02, catalog-SC-57.
- **Draft vs created** — catalog-SC-52, catalog-SC-54; holder reserve blocked
  while draft is catalog-SC-53.
- **Oversight** — catalog-SC-29 (vaulted and reservations by kind).
- **Intake success** — catalog-SC-05 and catalog-SC-31.
- **Intake validation error** — catalog-SC-08 and catalog-SC-09.
- **Sale success** — catalog-SC-10.
- **Withdrawal success** — catalog-SC-11.
- **Insufficient available stock** — catalog-SC-12 and catalog-SC-19.
- **Reserve success / idempotent active retry** — catalog-SC-14–catalog-SC-15.
- **Re-reserve after close** — catalog-SC-16.
- **Partial / full release** — catalog-SC-22 and catalog-SC-35.
- **Adjust reservation quantity** — catalog-SC-47–catalog-SC-50.
- **Change reservation product** — catalog-SC-51, catalog-SC-63–catalog-SC-65.
- **Sell-from-reservation** — catalog-SC-36 and catalog-SC-37.
- **Vault-from-reservation** — catalog-SC-38.
- **Change history** — catalog-SC-23–catalog-SC-28, catalog-SC-41–catalog-SC-45.
