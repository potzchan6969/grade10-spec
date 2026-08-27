# UI: Grade10 inventory admin

## Screens

**No Figma frame exists for these surfaces.** Layout source until a designer
adds frames: the live Grade10 admin auction listings panel and listing editor
(`apps/admin/grade10` auction section) — same table → detail/editor rhythm,
local `Table` / `Row` / `Cell` / status badge parts pattern.

### Inventory products table

Assembly in `apps/admin/grade10` composing `@grade10/inventory-admin-frontend`.
Lists products with name, stock count, ledger count, available count, and
active reserved count. Primary actions: add product; open a product.

### Product inventory detail

Same admin app. Shows the selected product’s fields, allocation totals,
inventory units, and reservations. Unit rows show state and active holder.
Reservation rows show holder, purpose, reference, state, and assigned unit
ids. Actions: save product edits; add units; edit or delete an eligible unit;
reserve units for Auction or Vault; release an active reservation.

No collector or public inventory UI in this change.

## Components

From `@grade10/design-system`, existing exports only:

- Fields: `TextInput` for product/unit text, description, remarks, purpose,
  and holder reference; `NumberInput` for add/reserve quantity.
- Choice: `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, and
  `SelectItem` for unit state and reservation holder.
- Actions and layout: `Button`, `Text`, `HStack`, `VStack`, and `Badge`.
- Dialogs: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`,
  `DialogTitle`, `DialogBody`, `DialogFooter`, and `DialogClose`.

App-local parts (not design-system), following auction admin:

- Table / Row / Cell chrome under `pages/inventory/parts` (or shared admin
  table helpers if the app already factors them).
- Unit-state badge mapping for `in-stock` | `auction-sold` | `withdrawn`.
- Reservation-state badge mapping for `active` | `released`, plus holder labels
  for `auction` and `vault`.

**Nothing new in `@grade10/ui` or the design system.** If a designer later
wants a shared stock status chip or quantity stepper as a design-system
primitive, that is a separate grade10-spec change — flag only; do not block
this delivery.

## States

Tied to
[`grade10-inventory/catalog`](specs/grade10-inventory/catalog/spec.md).

### Products table

- **Loading** — products list in flight.
- **Empty** — `Empty products table`.
- **Populated** — `Operator lists products with remaining counts`.
- **Error** — list refused or transport failure (same refusal path as
  `Unauthorized list products is refused` when grants are missing; generic
  error otherwise).
- **Section hidden** — `Inventory section hidden without grants`.

### Product detail / units

- **Product units listed** — `Operator opens a product’s units from the
  products table`.
- **Allocation overview** — `Operator oversees where units are held` / `Admin
  sees allocation by holder`.
- **Add units** — `Add units form submits quantity` /
  `Operator adds three units`.
- **Reserve** — `Operator reserves and releases on behalf of a holder`;
  insufficient-stock error from `Insufficient stock reserves nothing`.
- **Release** — `Operator reserves and releases on behalf of a holder` /
  `Vault releases a reservation`.
- **Edit product** — `Operator edits a product name`.
- **Edit unit** — `Operator edits a unit name`; sold-money validation from
  `Sold without money is refused` / `Money on a non-sold state is refused`;
  held-state refusal from `State change on a reserved unit is refused`.
- **Delete unit** — `Operator deletes an unreserved in-stock unit`; blocked
  paths `Delete of an auction-sold unit is refused` and `Delete of a reserved
  unit is refused`.
