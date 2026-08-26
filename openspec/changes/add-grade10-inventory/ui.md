# UI: Grade10 inventory admin

## Screens

**No Figma frame exists for these surfaces.** Layout source until a designer
adds frames: the live Grade10 admin auction listings panel and listing editor
(`apps/admin/grade10` auction section) — same table → detail/editor rhythm,
local `Table` / `Row` / `Cell` / status badge parts pattern.

### Inventory products table

Assembly in `apps/admin/grade10` composing `@grade10/inventory-admin-frontend`.
Lists products with name and remaining available count. Primary actions: add
product; open a product.

### Product inventory detail

Same admin app. Shows the selected product’s fields (editable) and its
inventory units table. Actions: save product edits; add units (quantity +
shared name/remarks); edit unit; delete eligible unit.

No collector or public inventory UI in this change.

## Components

From `@grade10/design-system`, existing exports only:

- `Button`, `Input`, `TextArea` (or equivalent multiline field already used
  in admin), `Text`, `HStack`, `VStack`, `Badge`, `Dialog`, `DialogContent`,
  `DialogTitle` as needed for confirm-delete.

App-local parts (not design-system), following auction admin:

- Table / Row / Cell chrome under `pages/inventory/parts` (or shared admin
  table helpers if the app already factors them).
- Status badge mapping for `available` | `auction-listing` | `auction-sold` |
  `withdrawn`.

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
- **Add units** — `Add units form submits quantity` /
  `Operator adds three units`.
- **Edit product** — `Operator edits a product name`.
- **Edit unit** — `Operator edits a unit name`; sold-money validation from
  `Sold without money is refused` / `Money on a non-sold status is refused`.
- **Delete unit** — `Operator deletes an available unit`; blocked path
  `Delete of a sold unit is refused`.
