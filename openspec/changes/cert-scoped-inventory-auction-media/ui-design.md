## Screens

### Inventory product media dialog

**Figma:** None by the [Admin console design decision](../../../docs/prds/products/shared/console/index.md).

**Code reference:** [ProductMediaDialog.tsx](https://github.com/9gag/grade10/blob/main/packages/inventory/admin-frontend/src/features/catalog/product-media/presentation/views/ProductMediaDialog.tsx).

### Inventory Cert ID details

**Figma:** None by the [Admin console design decision](../../../docs/prds/products/shared/console/index.md).

**Code reference:** [CertIdDetailDialog.tsx](https://github.com/9gag/grade10/blob/main/packages/inventory/admin-frontend/src/features/catalog/products/presentation/views/dialog/CertIdDetailDialog.tsx).

### Auction listing media dialog

**Figma:** None by the [Admin console design decision](../../../docs/prds/products/shared/console/index.md).

**Code reference:** [MediaDialog.tsx](https://github.com/9gag/grade10/blob/main/packages/grade10-auction/admin-frontend/src/features/catalog/listings/presentation/views/dialog/MediaDialog.tsx) and [ProductAssetPicker.tsx](https://github.com/9gag/grade10/blob/main/packages/grade10-auction/admin-frontend/src/features/catalog/listings/presentation/views/dialog/ProductAssetPicker.tsx).

## Components

- **Inventory product media dialog** - Existing `InfoDialog`, `Button`, `FilePicker`, `IconButton`, `Inline`, `Notice`, `Stack`, `Text`, and `TextField` exports from `@grade10/frontend-console`; the product media gallery and tag controls remain application-owned composition.
- **Inventory Cert ID details** - Existing `InfoDialog`, `Button`, `Inline`, `Notice`, `Stack`, `Table`, `Text`, and `StatusBadge` exports from `@grade10/frontend-console`; removal confirmation remains application-owned composition.
- **Auction listing media dialog** - Existing `InfoDialog`, `Button`, `Disclosure`, `Inline`, `Stack`, `Text`, and `TextField` exports from `@grade10/frontend-console`; the Other Cert drawer, product asset picker, and mixed listing gallery remain application-owned composition.
- **Missing work** - No design-system export, `@grade10/ui` export, token, or localized message is required. Admin copy follows the existing console vocabulary.

## States

### Inventory product media dialog

| State | Shows | Anchor |
| --- | --- | --- |
| Loading source media | Loading status; media actions wait for the source list | `grade10-admin-inventory-catalog-US-12` |
| Empty source media | Empty gallery with the existing upload control | `grade10-admin-inventory-catalog-US-12` |
| Untagged source item | Product-level media with a control for assigning one printed-Cert record | `grade10-admin-inventory-catalog-US-12` |
| Tagged source item | Current printed-Cert label; retagging clears the old association and leaves the item shared before any separate tag assignment | `grade10-admin-inventory-catalog-US-12` |
| Tag write refused | Error notice; existing tag and source media remain visible | `grade10-admin-inventory-catalog-US-12` |

### Inventory Cert ID details

| State | Shows | Anchor |
| --- | --- | --- |
| No Cert records | Existing empty Cert list | `grade10-admin-inventory-catalog-US-13` |
| Removable Cert record | Selected Cert record with a removal action when its removal guard passes | `grade10-admin-inventory-catalog-US-13` |
| Removal pending | Confirmation remains open and the removal action is pending | `grade10-admin-inventory-catalog-US-13` |
| Removal refused | Error notice identifies an active reservation; no record, counter, history, or media changes | `grade10-admin-inventory-catalog-US-13` |
| Removal complete | Cert record and its tagged source media are gone; the physical unit is counted as withdrawn | `grade10-admin-inventory-catalog-US-13` |

### Auction listing media dialog

| State | Shows | Anchor |
| --- | --- | --- |
| Loading source media | Loading status while Inventory resolves the selected product and unit | `grade10-admin-auction-listing-US-11` |
| Matching source media | Untagged media and selected-Cert media in the main source selector | `grade10-admin-auction-listing-US-11` |
| No matching source media | Empty main selector with the existing direct-upload gallery available | `grade10-admin-auction-listing-US-11` |
| Other Cert drawer closed | Separate Other Cert entry point; other-Cert media is not in the main selector | `grade10-admin-auction-listing-US-12` |
| Other Cert drawer open | Media groups labelled by printed Cert ID, with an explicit add action naming the source Cert | `grade10-admin-auction-listing-US-12` |
| No Cert ID selected | Untagged product-level media only in the main source selector | `grade10-admin-auction-listing-US-13` |
| Gallery at capacity | Combined gallery count is eight; adding more source or direct media is disabled | `grade10-admin-auction-listing-US-14` |
| Source selection stale | Save error; the existing listing gallery remains unchanged | `grade10-admin-auction-listing-US-14` |
| Listing snapshot saved | Copied listing media with editable listing alt text and order | `grade10-admin-auction-listing-US-14` |
