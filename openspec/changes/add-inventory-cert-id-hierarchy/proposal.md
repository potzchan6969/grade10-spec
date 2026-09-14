**Author:** @htonyl - 2026-09-14

## Why

Collectors and operators cannot tell which physical graded item a listing
represents: inventory counts are aggregate, while certificate identity is
currently treated as loose product metadata or listing copy. The catalogue
already has the IP, Category, and Item needed to identify a product, and typed
attributes now provide the durable place for its facts; the missing piece is
an optional inventory-level identity that an auction can select explicitly.

**Metric:** share of auction listings whose selected inventory unit can be
traced from intake through the listing and its displayed attributes, with a
reduction in listing corrections caused by an incorrect certificate number.

## What Changes

- **BREAKING** Remove the Collectible type from product records and admin
  forms; IP + Category + Item become the complete product hierarchy.
- **BREAKING** Remove product metadata from inventory and Auction display
  contracts; structured product attributes become the only product facts.
- Add optional inventory Cert ID records. Intake may attach one identifier to
  each graded unit, while unnumbered stock remains valid.
- Require every reservation to carry the same explicit unit choice: one Cert
  ID or `No Cert ID`; numbered reservations are quantity one and exclusive.
- Make Auction listing creation and editing require an explicit inventory-unit
  choice: a specific available Cert ID or `No Cert ID`.
- Keep certificate identity in Inventory, validate it through the existing
  service boundary, and prevent one physical Cert ID from being held by two
  active Auction listings.
- Make Cert ID a special, always-available choice in Displayed Attributes.
  Admins can include it, remove it, and order it without creating an ordinary
  product attribute key.
- Carry the selected Cert ID through admin and public listing reads only when
  display configuration includes it; a `No Cert ID` choice contributes no
  certificate row.

## Non-Goals

- Certificate-provider verification, grading-provider integrations, or
  population reports
- Inferring a Cert ID from images or external catalogue data
- Making Cert ID a searchable product attribute or changing the IP, Category,
  and Item taxonomy
- Allowing a single physical Cert ID to represent more than one listed unit
- Replacing aggregate stock, reservation, settlement, or listing lifecycle
  rules
- Automatic conversion of arbitrary legacy metadata into typed attributes

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-admin/inventory/catalog`: replace the old product type and metadata
  layers with IP + Category + Item, add optional inventory Cert IDs, and make
  Cert ID an admin-controlled displayed field.
- `grade10-admin/auction/listing`: require an explicit Cert ID or `No Cert ID`
  choice when an operator creates or edits the inventory unit of a listing.

## Impact

- Inventory contracts, Postgres schema, migrations, intake and reservation
  services, changelog snapshots, and Auction service bindings
- Auction listing persistence, eligibility reads, create/save validation, and
  public product-display projection
- Grade10 admin product intake, product hierarchy, displayed-attributes, and
  Auction listing editor surfaces
- Existing dirty product-schema UI work in the implementation checkout must
  be preserved while the displayed-field contract changes

## References

- [Product identity](../../../docs/prds/products/grade10-admin/inventory/catalog.md#product-identity)
- [Auction presentation](../../../docs/prds/products/grade10-admin/inventory/catalog.md#auction-presentation)
- [Intake](../../../docs/prds/products/grade10-admin/inventory/catalog.md#intake)
- [Listing Management](../../../docs/prds/products/grade10-admin/auction/listing.md)
