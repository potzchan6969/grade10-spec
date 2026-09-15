## Screens

### Inventory product page

Figma frame: not supplied; the existing Grade10 admin product-page composition
is the source surface until a reviewed frame is linked.

The page reuses its existing product, inventory snapshot, intake dialog, and
schema-display compositions. The behavior and acceptance states are owned by
[`grade10-admin/inventory/catalog`](specs/grade10-admin/inventory/catalog/spec.md).

### Product schema Displayed Attributes panel

Figma frame: not supplied; the existing product-schema editor composition is
the source surface until a reviewed frame is linked.

Cert ID appears in the same ordered field editor as typed attributes, with its
special-field identity visible to the admin rather than as a fabricated key.

### Auction listing editor

Figma frame: not supplied; the existing Grade10 admin listing editor is the
source surface until a reviewed frame is linked.

The product choice is followed by the product-scoped Cert ID choice. The
behavior and create gate are owned by
[`grade10-admin/auction/listing`](specs/grade10-admin/auction/listing/spec.md).

## Components

Existing composition exports remain the surface contract:

- `Panel`, `Stack`, `Inline`, `Grid`, `Table`, `Row`, `Cell`, `Text`, `Title`,
  `Badge`, `StatusBadge`, `Button`, `Select`, `TextField`, `NumberField`, and
  `FormDialog` from `@grade10/frontend-console`
- `ProductEditor`, `MutationDialog`, `ProductSchemaDraftEditor`, and
  `ListingEditor` in the implementing applications

No new design-system primitive, token, or `@grade10/ui` compound component is
required by this change. No missing component work is carried into `tasks.md`.

## States

| Screen | State | Spec scenario |
| --- | --- | --- |
| Inventory product page | Product identity shows IP, Category, and Item with no legacy fields | `grade10-admin-inventory-catalog-SC-69` |
| Inventory product page | Empty Cert ID set remains valid for unnumbered stock | `grade10-admin-inventory-catalog-SC-71` |
| Inventory product page | Intake accepts identifiers up to the quantity and shows received records | `grade10-admin-inventory-catalog-SC-72`, `SC-75` |
| Inventory product page | Duplicate or too-many identifiers show refusal and preserve stock | `grade10-admin-inventory-catalog-SC-73`, `SC-76` |
| Displayed Attributes panel | Cert ID is available, selected, reordered, or removed without an ordinary key | `grade10-admin-inventory-catalog-SC-77`, `SC-78` |
| Auction listing editor | Product with records offers each record and `No Cert ID` | `grade10-admin-auction-listing-SC-70` |
| Auction listing editor | Product without records offers `No Cert ID` and can proceed | `grade10-admin-auction-listing-SC-71` |
| Auction listing editor | Product change clears the prior Cert ID choice | `grade10-admin-auction-listing-SC-72` |
| Auction listing editor | Wrong or already-held Cert ID shows refusal; no-cert uses aggregate quantity | `grade10-admin-auction-listing-SC-73` through `SC-75` |
| Auction listing page | Selected Cert ID displays in configured order; `No Cert ID` displays no certificate row | `grade10-admin-auction-listing-SC-79`, `SC-80` |
