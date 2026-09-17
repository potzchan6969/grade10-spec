**Author:** @htonyl - 2026-09-14

## Why

Collectors and operators cannot tell which physical graded item a listing
represents: inventory counts are aggregate, while certificate identity is
currently treated as loose product metadata or listing copy. The catalogue
already has the IP, Category, and Item needed to identify a product, and typed
attributes now provide the durable place for its facts; the missing piece is
an optional inventory-level identity that an auction can select explicitly.
The auction workbook also repeats product facts for each physical copy, so
manual entry risks inconsistent product records and lost grading details.
Separate product and inventory uploads let an admin validate product schemas
and identity mappings before importing copies.

**Metric:** share of uploaded product and inventory rows committed without
later correction, alongside the share of auction listings whose selected
inventory unit can be traced from intake through its displayed attributes.

## What Changes

- **BREAKING** Remove the Collectible type from product records and admin
  forms; IP + Category + Item become the complete product hierarchy.
- **BREAKING** Remove product metadata from inventory and Auction display
  contracts; structured product attributes become the only product facts.
- Define one shared card product template for each exact existing IP + Item +
  Category schema: required product name, Year, Set, and Subject; optional
  Card Number and Variety. Serial and certification or grading facts remain
  on each physical inventory copy.
- Allow an admin to import a schema manifest into draft revisions for mapped
  tag tuples, validate it, and publish through the existing schema lifecycle.
- Add separate product-entry and inventory uploads with CSV/XLSX preview and
  row validation. Product rows create draft products without stock; the admin
  marks each valid product `created` through the existing status flow before
  inventory upload. Inventory rows match those created products and add one
  physical copy each.
- Require explicit mappings from sufficiently specific source classification
  keys to existing IP, Item, and Category tags. A broad Category such as TCG
  cannot map by Category alone when its Pokémon, Lorcana, and One Piece rows
  need different tuples; include Set or other source fields as needed. The
  workbook Item column supplies product name, not the Grade10 Item tag.
  Keep source labels visible in preview and leave the supplied workbook
  unchanged.
- Trim surrounding whitespace on mapped workbook fields and treat a blank or
  standalone `-` as absent. Require a separate include or exclude decision for
  every blank Item Status row, with no batch-wide default.
- Require graded copies to have a trimmed, non-empty Cert ID. A `RAW` copy
  MUST NOT have a Cert ID. Check supplied identifiers for duplicates within
  the upload and matched product inventory.
- Commit each product or inventory upload atomically after preview. Missing or
  ambiguous inventory matches and invalid rows block the full batch.
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
- Inferring workbook-to-tag mappings or inventing taxonomy values
- Writing changes back to the supplied workbook
- Allowing a single physical Cert ID to represent more than one listed unit
- Replacing aggregate stock, reservation, settlement, or listing lifecycle
  rules
- Automatic conversion of arbitrary legacy metadata into typed attributes

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-admin/inventory/catalog`: replace the old product type and metadata
  layers with IP + Category + Item, define the shared card template and import
  flows, retain copy-level grading facts, add optional inventory Cert IDs, and
  make Cert ID an admin-controlled displayed field.
- `grade10-admin/auction/listing`: require an explicit Cert ID or `No Cert ID`
  choice when an operator creates or edits the inventory unit of a listing.

## Impact

- Inventory contracts, Postgres schema, migrations, intake and reservation
  services, product schema management, bulk upload validation and commit,
  changelog snapshots, and Auction service bindings
- Auction listing persistence, eligibility reads, create/save validation, and
  public product-display projection
- Grade10 admin product schema, product and inventory upload, product intake,
  product hierarchy, displayed-attributes, and Auction listing editor surfaces
- Existing dirty product-schema UI work in the implementation checkout must
  be preserved while the displayed-field contract changes

## References

- [Product identity](../../../docs/prds/products/grade10-admin/inventory/catalog.md#product-identity)
- [Auction presentation](../../../docs/prds/products/grade10-admin/inventory/catalog.md#auction-presentation)
- [Intake](../../../docs/prds/products/grade10-admin/inventory/catalog.md#intake)
- [Auction Management · Listings](../../../docs/prds/products/grade10-admin/auction/management.md#listings)
