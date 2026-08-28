# UI: Grade10 inventory admin

## Screens

**No Figma frame exists for these surfaces.** Layout source until a designer
adds frames: the live Grade10 admin auction listings panel and listing editor
(`apps/admin/grade10` auction section) — same table → detail rhythm and
app-local table parts.

### Inventory products table

Assembly in `apps/admin/grade10` composing
`@grade10/inventory-admin-frontend`. Behavior:
[`grade10-inventory/catalog`](specs/grade10-inventory/catalog/spec.md),
especially catalog-SC-13, catalog-SC-30, catalog-SC-32, and catalog-SC-33.

### Product inventory detail

Same admin app. Behavior: catalog-SC-03, catalog-SC-05, catalog-SC-10,
catalog-SC-11, catalog-SC-12, catalog-SC-17, catalog-SC-22,
catalog-SC-23–catalog-SC-27, catalog-SC-29, and catalog-SC-31.

No collector or public inventory UI is part of this change.

## Components

Existing `@grade10/design-system` exports only:

- Fields: `TextInput` for product text, purpose, holder reference, intake
  remarks, and withdrawal reason; `NumberInput` for intake, reserve, sale,
  withdrawal quantities, and sold total price.
- Choice: `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`,
  and `SelectItem` for reservation holder and sold currency.
- Actions and layout: `Button`, `Text`, `HStack`, `VStack`, and
  `Badge`.
- Dialogs: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`,
  `DialogTitle`, `DialogBody`, `DialogFooter`, and `DialogClose`.

App-local parts, following the auction admin:

- Table / Row / Cell chrome under `pages/inventory/parts`, unless the admin
  app factors an existing helper first.
- Reservation-state badges for `active` and `released`, plus holder labels
  for Auction and Vault.
- Change-action badges for product create/update, intake, reserve, release,
  sell, and withdraw.

Nothing new is required from `@grade10/ui` or the design system.

## States

### Products table

- **Loading** — product list in flight.
- **Empty** — catalog-SC-30.
- **Populated** — catalog-SC-13.
- **Error** — list refusal or transport failure; authorization refusal is
  catalog-SC-32.
- **Section hidden** — catalog-SC-33.

### Product inventory detail

- **Snapshot** — catalog-SC-03 and catalog-SC-29.
- **Intake success** — catalog-SC-05 and catalog-SC-31.
- **Intake validation error** — catalog-SC-08 and catalog-SC-09.
- **Sale success** — catalog-SC-10.
- **Withdrawal success** — catalog-SC-11.
- **Insufficient available stock** — catalog-SC-12 and catalog-SC-19.
- **Allocation overview** — catalog-SC-17 and catalog-SC-29.
- **Reserve success / idempotent result** — catalog-SC-14–catalog-SC-16.
- **Release success** — catalog-SC-22.
- **Change history** — catalog-SC-23–catalog-SC-28.
