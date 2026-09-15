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
| Inventory product page | Product identity shows IP, Category, and Item with no legacy fields | `grade10-admin-inventory-catalog-SC-93` |
| Inventory product page | Empty Cert ID set remains valid for unnumbered stock | `grade10-admin-inventory-catalog-SC-95` |
| Inventory product page | Intake accepts identifiers up to the quantity and shows received records | `grade10-admin-inventory-catalog-SC-96`, `SC-75` |
| Inventory product page | Duplicate or too-many identifiers show refusal and preserve stock | `grade10-admin-inventory-catalog-SC-97`, `SC-76` |
| Displayed Attributes panel | Cert ID is available, selected, reordered, or removed without an ordinary key | `grade10-admin-inventory-catalog-SC-101`, `SC-78` |
| Auction listing editor | Product with records offers each record and `No Cert ID` | `grade10-admin-auction-listing-SC-70` |
| Auction listing editor | Product without records offers `No Cert ID` and can proceed | `grade10-admin-auction-listing-SC-71` |
| Auction listing editor | Product change clears the prior Cert ID choice | `grade10-admin-auction-listing-SC-72` |
| Auction listing editor | Wrong or already-held Cert ID shows refusal; no-cert uses aggregate quantity | `grade10-admin-auction-listing-SC-73` through `SC-75` |
| Auction listing page | Selected Cert ID displays in configured order; `No Cert ID` displays no certificate row | `grade10-admin-auction-listing-SC-79`, `SC-80` |
| Product schema workspace | Shared card template has required Year, Set, and Subject; Card Number and Variety are optional | `grade10-admin-inventory-catalog-SC-108` |
| Product schema workspace | Source classification fields remain visible while the admin maps a sufficiently specific key to one existing taxonomy tuple; Category-only is unavailable when broad TCG rows target different tuples | `grade10-admin-inventory-catalog-SC-109` |
| Product schema workspace | Valid schema manifest creates drafts; invalid rows report reasons without partial revisions | `grade10-admin-inventory-catalog-SC-110`, `SC-111` |
| Product schema workspace | Cert ID is available in display order as a special field | `grade10-admin-inventory-catalog-SC-77`, `SC-78` |
| Product entry import | Repeated identical identities produce one draft; same-name cards with different attributes remain distinct | `grade10-admin-inventory-catalog-SC-112`, `SC-114` |
| Product entry import | Mapped values show trimmed text; blank or standalone `-` optional values are absent, while missing required values block commit | `grade10-admin-inventory-catalog-SC-115` |
| Product entry import | Unmapped, incomplete, or invalid rows block product commit and show row reasons | `grade10-admin-inventory-catalog-SC-113` |
| Inventory unit import | Matched copy facts are reviewed before confirmation | `grade10-admin-inventory-catalog-SC-116` |
| Inventory unit import | Each blank Item Status row has its own include or exclude control; RAW rows omit Cert ID and graded rows require it | `grade10-admin-inventory-catalog-SC-117`, `SC-122` |
| Inventory unit import | Copy facts show trimmed values; blank or standalone `-` optional facts are absent | `grade10-admin-inventory-catalog-SC-121` |
| Inventory unit import | Missing or ambiguous matches, duplicate Cert IDs, and invalid rows refuse the entire batch | `grade10-admin-inventory-catalog-SC-118` through `SC-120` |
