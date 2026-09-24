**Author:** @htonyl - 2026-09-24

## Why

An operator selecting a specific physical Cert record for an Auction listing
cannot distinguish its photographs from product-level photographs or from a
different copy's photographs. The listing can therefore start with the wrong
visual evidence even though the selected unit is explicit.

**Metric:** share of specific-Cert listings whose initial selectable source
contains only product-level media and media tagged to that Cert; count of
other-Cert items deliberately added from the separate drawer.

## What Changes

- **Cert-scoped Inventory media** - lets an authorized Inventory operator
  leave source media untagged for the product, or tag it to exactly one
  same-product Cert record with a printed Cert ID. The tag stores the immutable
  Cert record id, not its printed Cert ID. Media for a record without a printed
  Cert ID remains untagged. Removing a media tag or retagging leaves the
  originally tagged source item untagged. Removing a physical unit is allowed
  only for an available Cert record with no active reservation; it withdraws
  the unit, removes its Cert record, and deletes source media tagged to it.
- **Cert-aware listing source** — when an authorized Auction operator selects
  a product and one Cert ID, the main source selector contains that product's
  untagged source media and media tagged to the selected Cert record. Source
  media tagged to another Cert is absent from that selector.
- **Deliberate other-Cert selection** — a separately labelled Other Cert media
  drawer groups hidden source items by their printed Cert ID. An operator can
  inspect them and add one only through an explicit action that names that ID.
- **No-Cert source** — a listing whose explicit unit is No Cert ID offers
  product-level untagged source media only; it does not bring forward
  Cert-tagged media by default.
- **Listing snapshot** — adding a source item copies its bytes and current alt
  text into the listing-owned gallery. The operator may edit the copied alt
  text and gallery order. Later source edits, retagging, untagging, or Cert
  deletion do not change an existing listing gallery.

## Non-Goals

- Cert-scoped media on storefront product pages or any collector-facing
  product gallery.
- Bulk tagging one media item to multiple Cert records, or changing Inventory
  reservation, hold, sale, or vault behavior. The guarded physical-unit
  removal path uses the existing withdrawn accounting.
- Changing direct listing upload, the one-to-eight listing-gallery cap, its
  accepted file types, or its order rules.
- A new permission, a new shared UI component, or a new design-system
  primitive.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `grade10-admin/inventory/catalog` — Inventory source media gains its
  optional, same-product Cert-record tag and its lifecycle.
- `grade10-admin/auction/listing` — listing media selection gains its
  unit-aware default source and other-Cert drawer while retaining the listing
  gallery snapshot.

## Impact

- **Consumer apps:** Grade10 Admin inventory media management and Auction
  listing editor change. No collector-facing application changes.
- **Component exports:** none named or changed. The drawer and selectors are
  application-owned composition.
- **Services:** Inventory owns source media and Cert-tag validation; Auction
  reads eligible source media and copies a selected source into its existing
  listing-owned gallery.
- **Authorization:** existing Inventory media-management authority gates
  source-media tag writes. Existing Auction listing-edit authority gates main
  selector and Other Cert media drawer reads and additions. No new grant is
  introduced.

No domain impact: the changed journeys add Inventory media classification and unit removal to an Inventory-to-Auction path; existing Auction domain composed paths do not trace these new journeys.

No platform impact: this change stays within Grade10 Admin and leaves collector-facing journeys unchanged.

## References

- [Products and Stock · Intake](../../../docs/prds/products/grade10-admin/inventory/catalog.md#intake)
- [Auction Management · Listings](../../../docs/prds/products/grade10-admin/auction/management.md#listings)
