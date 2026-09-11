## Screens

No Figma frames were supplied for these admin changes. The screen routes and
component inventory below are the implementation brief until an admin Figma
frame is added. Collector-facing Auction search and listing screens are owned
by a separate specification.

### Product Schema Workspace

- **Route** — Inventory → Product schemas
- **Figma** — Not supplied
- **Spec** — [Product schema configuration](specs/grade10-admin/inventory/catalog/spec.md#requirement-product-schemas-configure-exact-ip-item-and-category-attributes), [compatibility review](specs/grade10-admin/inventory/catalog/spec.md#requirement-admins-can-review-and-correct-incompatible-product-attributes)
- **Actions** — create and select attribute keys; select an IP, Item, and Category tuple; open a draft; open an applied product filter from a visible tag, attribute key, or value

### Attribute Key Editor

- **Route** — Product schema workspace → Attribute keys → New or selected key
- **Figma** — Not supplied
- **Spec** — [Reusable attribute keys](specs/grade10-admin/inventory/catalog/spec.md#requirement-reusable-product-attribute-keys-carry-localized-labels-and-validation)
- **Actions** — edit stable key, type, type-specific validation, option keys, and localized labels and option values; show English as required and other locales as optional

### Product Schema Draft Editor

- **Route** — Product schema workspace → selected tuple → Draft
- **Figma** — Not supplied
- **Spec** — [Product schema configuration](specs/grade10-admin/inventory/catalog/spec.md#requirement-product-schemas-configure-exact-ip-item-and-category-attributes), [atomic publishing](specs/grade10-admin/inventory/catalog/spec.md#requirement-product-schema-publishing-validates-affected-products-atomically), [Auction presentation](specs/grade10-admin/inventory/catalog/spec.md#requirement-auction-listing-attributes-and-presentation-are-scoped-to-a-listing)
- **Actions** — assign attribute keys; set required or optional; edit localized labels and select options; choose ordered Auction product fields; save draft; review compatibility; publish

### Compatibility Review

- **Route** — Product schema draft or attribute key → Review affected products
- **Figma** — Not supplied
- **Spec** — [Compatibility review](specs/grade10-admin/inventory/catalog/spec.md#requirement-admins-can-review-and-correct-incompatible-product-attributes)
- **Actions** — show each affected product, attribute key, and reason; open the product editor; open a filtered product view from the tuple, key, or value; return to the same saved review after correction

### Product Editor

- **Route** — Inventory → Product → New or selected product
- **Figma** — Not supplied
- **Spec** — [Product values](specs/grade10-admin/inventory/catalog/spec.md#requirement-products-store-values-that-satisfy-their-product-schema), [attribute filter navigation](specs/grade10-admin/inventory/catalog/spec.md#scenario-grade10-admin-inventory-catalog-sc-92---admin-opens-a-product-filter-from-an-attribute)
- **Actions** — enter IP, Item, and Category; enter typed product attributes from the published schema; select locale for translated text; show requiredness and validation; mark the product created; open filters from visible tags, attribute keys, and values

### Auction Listing Attribute Editor

- **Route** — Auction listing → Listing attributes
- **Figma** — Not supplied
- **Spec** — [Auction listing attributes](specs/grade10-admin/inventory/catalog/spec.md#requirement-auction-listing-attributes-and-presentation-are-scoped-to-a-listing)
- **Actions** — add, reorder, edit, and remove display-only items with optional localized label and value; do not show field-definition, requiredness, option, or validation controls

## Components

| Surface | Existing exports | New feature-local exports | Notes |
| --- | --- | --- | --- |
| Product schema workspace | `@grade10/frontend-console`: `SectionHeader`, `Split`, `EntryList`, `Entry`, `Search`, `StatusBadge`, `Tabs`, `Tab`, `TabPanel`, `Panel`, `Table`, `Row`, `Cell`, `Button`, `Notice`, `CursorPager` | `ProductSchemaWorkspace`, `ProductAttributeFilterLink` | `ProductAttributeFilterLink` opens the product filter with stable criteria while showing the resolved localized label and value |
| Attribute key editor | `@grade10/frontend-console`: `TextField`, `NumberField`, `Select`, `Check`, `CheckList`, `Tabs`, `Tab`, `TabPanel`, `Button`, `Notice` | `AttributeKeyEditor`, `LocalizedAttributeTextEditor`, `AttributeKeyOptionsEditor` | English is visibly required; each supported non-English locale can be left empty and reports a warning after save |
| Product schema draft editor | `@grade10/frontend-console`: `SectionHeader`, `Panel`, `Tabs`, `Tab`, `TabPanel`, `EntryList`, `Entry`, `Check`, `CheckList`, `Button`, `Notice`, `StatusBadge` | `ProductSchemaDraftEditor`, `SchemaAttributeKeyEditor`, `AuctionDisplayFieldOrderEditor` | The active published revision is read-only; only the draft exposes save and publish actions |
| Compatibility review | `@grade10/frontend-console`: `Panel`, `Table`, `Row`, `Cell`, `StatusBadge`, `Button`, `Notice`, `CursorPager` | `CompatibilityReviewPanel` | Product and attribute cells compose `ProductAttributeFilterLink`; the product action opens the product editor |
| Product editor | Existing `@grade10/inventory-admin-frontend/products`: `ProductEditor`, `ProductsPanel`; `@grade10/frontend-console`: `TextField`, `NumberField`, `Select`, `Check`, `Tabs`, `Tab`, `TabPanel`, `Button`, `Notice` | `StructuredProductAttributesEditor` | Assigned keys drive typed controls. Visible IP, Item, Category, keys, and values use `ProductAttributeFilterLink` where a product filter can be formed |
| Auction listing attribute editor | `@grade10/frontend-console`: `Panel`, `EntryList`, `Entry`, `TextField`, `Button`, `Notice` | `ListingAttributesEditor` | Ordered document editing only; no reusable-key or rule editor |

`ProductSchemaWorkspace`, `ProductAttributeFilterLink`, `AttributeKeyEditor`,
`LocalizedAttributeTextEditor`, `AttributeKeyOptionsEditor`,
`ProductSchemaDraftEditor`, `SchemaAttributeKeyEditor`,
`AuctionDisplayFieldOrderEditor`, `CompatibilityReviewPanel`,
`StructuredProductAttributesEditor`, and `ListingAttributesEditor` are new
feature-local exports in `@grade10/inventory-admin-frontend`. No existing
`@grade10/ui` block fits these admin-only workflows, and no design-system
primitive, variant, or token change is required.

## States

| Surface | State | Spec scenario |
| --- | --- | --- |
| Product schema workspace | No reusable keys or no schema for a tuple; direct the admin to create the missing configuration | `grade10-admin-inventory-catalog-SC-69`, `grade10-admin-inventory-catalog-SC-74` |
| Attribute key editor | Invalid type, validation, duplicate key, or option without English value; retain entered values and show the refusal at the relevant input | `grade10-admin-inventory-catalog-SC-70` |
| Attribute key editor and schema draft editor | Missing non-English copy; save remains available and warning identifies the locale | `grade10-admin-inventory-catalog-SC-71` |
| Product schema draft editor | Draft is editable; the published revision stays identifiable and cannot be changed from the draft form | `grade10-admin-inventory-catalog-SC-73`, `grade10-admin-inventory-catalog-SC-86` |
| Compatibility review | No incompatible product attributes; publish is available when no other publish refusal exists | `grade10-admin-inventory-catalog-SC-91` |
| Compatibility review | Affected products; show product, attribute key, and reason, then retain the review target after product correction | `grade10-admin-inventory-catalog-SC-85`, `grade10-admin-inventory-catalog-SC-91` |
| Product editor | No matching schema; save as draft but disable the created transition and name the missing schema | `grade10-admin-inventory-catalog-SC-74` |
| Product editor | Invalid, missing required, optional absent, and missing locale values; distinguish a refused update, a blocked created transition, an accepted omitted optional value, and English fallback | `grade10-admin-inventory-catalog-SC-76`, `grade10-admin-inventory-catalog-SC-77`, `grade10-admin-inventory-catalog-SC-78`, `grade10-admin-inventory-catalog-SC-79` |
| Product filter view | An attribute link applies one criterion, shows the localized label and value, and provides clear | `grade10-admin-inventory-catalog-SC-92` |
| Auction listing attribute editor | Any ordered item shape is saved as display-only content; missing locale uses English, then the supplied value | `grade10-admin-inventory-catalog-SC-88`, `grade10-admin-inventory-catalog-SC-89` |
