# UI: Grade10 inventory admin

## Screens

**No Figma frame exists for these surfaces.** Layout source until a designer
adds frames: the live Grade10 admin auction listings panel and listing editor
(`apps/admin/grade10` auction section) — same list → detail rhythm and
app-local table parts.

Assembly in `apps/admin/grade10` composing `@grade10/inventory-admin-frontend`.
Behavior: [`grade10-admin/inventory/catalog`](specs/grade10-admin/inventory/catalog/spec.md).

No collector or public inventory UI is part of this change.

### Products list

Route: Inventory section root. Behavior: grade10-admin-inventory-catalog-SC-13, grade10-admin-inventory-catalog-SC-30,
grade10-admin-inventory-catalog-SC-32, grade10-admin-inventory-catalog-SC-33, grade10-admin-inventory-catalog-SC-58.

Columns: name, **status** (`draft` | `created`), stock, available, reserved,
vaulted, sold, withdrawn, derived ledger. Primary action: create product. Row
opens the product page.

### Product page

Route: product detail / create. Behavior: grade10-admin-inventory-catalog-SC-01, grade10-admin-inventory-catalog-SC-02,
grade10-admin-inventory-catalog-SC-29, grade10-admin-inventory-catalog-SC-52, grade10-admin-inventory-catalog-SC-54, grade10-admin-inventory-catalog-SC-57, grade10-admin-inventory-catalog-SC-58,
plus reservation and history scenarios (grade10-admin-inventory-catalog-SC-14–grade10-admin-inventory-catalog-SC-22,
grade10-admin-inventory-catalog-SC-35–grade10-admin-inventory-catalog-SC-38, grade10-admin-inventory-catalog-SC-47–grade10-admin-inventory-catalog-SC-51, grade10-admin-inventory-catalog-SC-63–grade10-admin-inventory-catalog-SC-65,
grade10-admin-inventory-catalog-SC-23–grade10-admin-inventory-catalog-SC-28, grade10-admin-inventory-catalog-SC-41–grade10-admin-inventory-catalog-SC-45).

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
- **Empty** — grade10-admin-inventory-catalog-SC-30.
- **Populated** — grade10-admin-inventory-catalog-SC-13 (includes status and vaulted).
- **Create product** — grade10-admin-inventory-catalog-SC-58 / grade10-admin-inventory-catalog-SC-01 / grade10-admin-inventory-catalog-SC-02.
- **Error** — list refusal or transport failure; authorization refusal is
  grade10-admin-inventory-catalog-SC-32.
- **Section hidden** — grade10-admin-inventory-catalog-SC-33.

### Product page

- **Create / edit product** — grade10-admin-inventory-catalog-SC-01, grade10-admin-inventory-catalog-SC-02, grade10-admin-inventory-catalog-SC-57.
- **Draft vs created** — grade10-admin-inventory-catalog-SC-52, grade10-admin-inventory-catalog-SC-54; holder reserve blocked
  while draft is grade10-admin-inventory-catalog-SC-53.
- **Oversight** — grade10-admin-inventory-catalog-SC-29 (vaulted and reservations by kind).
- **Intake success** — grade10-admin-inventory-catalog-SC-05 and grade10-admin-inventory-catalog-SC-31.
- **Intake validation error** — grade10-admin-inventory-catalog-SC-08 and grade10-admin-inventory-catalog-SC-09.
- **Sale success** — grade10-admin-inventory-catalog-SC-10.
- **Withdrawal success** — grade10-admin-inventory-catalog-SC-11.
- **Insufficient available stock** — grade10-admin-inventory-catalog-SC-12 and grade10-admin-inventory-catalog-SC-19.
- **Reserve success / idempotent active retry** — grade10-admin-inventory-catalog-SC-14–grade10-admin-inventory-catalog-SC-15.
- **Re-reserve after close** — grade10-admin-inventory-catalog-SC-16.
- **Partial / full release** — grade10-admin-inventory-catalog-SC-22 and grade10-admin-inventory-catalog-SC-35.
- **Adjust reservation quantity** — grade10-admin-inventory-catalog-SC-47–grade10-admin-inventory-catalog-SC-50.
- **Change reservation product** — grade10-admin-inventory-catalog-SC-51, grade10-admin-inventory-catalog-SC-63–grade10-admin-inventory-catalog-SC-65.
- **Sell-from-reservation** — grade10-admin-inventory-catalog-SC-36 and grade10-admin-inventory-catalog-SC-37.
- **Vault-from-reservation** — grade10-admin-inventory-catalog-SC-38.
- **Change history** — grade10-admin-inventory-catalog-SC-23–grade10-admin-inventory-catalog-SC-28, grade10-admin-inventory-catalog-SC-41–grade10-admin-inventory-catalog-SC-45.
