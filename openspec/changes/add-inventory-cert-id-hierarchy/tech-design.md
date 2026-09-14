## Context

The inventory service currently owns one aggregate snapshot per product. Product
schemas already own typed attribute definitions and an ordered Auction display
list, while the Auction service stores only a product id and quantity for its
inventory hold. The application checkout also contains uncommitted product
schema editor work; the implementation must preserve that work and adapt its
display-order contract.

## Goals / Non-Goals

**Goals:**

- Keep physical unit identity in Inventory and cross the service boundary with
  opaque ids.
- Preserve aggregate stock and reservation arithmetic for unnumbered units.
- Make a numbered unit exclusive to one active Auction hold.
- Make the Displayed Attributes order explicit enough to contain a system
  field without minting a fake product attribute.
- Remove legacy product type and metadata from the public product shape.

**Non-Goals:**

- Certificate provider verification or grading integrations
- A general lot allocator for multiple certificates per listing
- Cross-schema database foreign keys between Inventory and Auction

## Decisions

The capability specs govern the product hierarchy, optional Cert ID intake,
explicit reservation and Auction unit choice, and display visibility/order.
The implementation uses a single Inventory-owned certificate record for each
supplied identifier. Every reservation carries an explicit unit choice. A
reservation carrying one certificate record has quantity one and is exclusive
to that record; the existing aggregate reservation path remains the
implementation for `No Cert ID`. Auction holds use this same Inventory
reservation contract rather than a listing-only variant.

The selected certificate record id, not its displayed identifier, crosses the
Inventory/Auction boundary. Inventory validates ownership and active-hold
availability under its own transaction. Auction stores the opaque record id on
its listing and passes it back to Inventory for every hold and display read.

The display order changes from a list of attribute-key strings to an ordered
list of tagged entries: an attribute entry names a typed attribute key, and a
Cert ID entry names the system field. Existing attribute-only orders migrate
to attribute entries without changing their order.

The implementation rejects three alternatives: Cert ID as a product attribute
(one product can own many identifiers), Cert ID in Auction listing attributes
(intake and physical availability belong to Inventory), and direct database
joins between the two services (the existing binding is the service seam).

## Database Schema

Inventory remains authoritative for product identity, aggregate counters,
certificate records, and certificate allocation. Auction remains authoritative
for listing lifecycle and the opaque selected certificate record id. Available,
ledger, and certificate-held state are derived from the authoritative rows.

| Table | Change | Type / nullability / default |
| --- | --- | --- |
| `inventory.products` | Remove legacy product type and metadata | Drop the two legacy columns |
| `inventory.inventory_cert_ids` | New physical-unit records | `id text` PK; `inventory_id text` required; `cert_id text` required; `created_at` timestamp required; unique `(inventory_id, cert_id)` |
| `inventory.reservations` | Identify a numbered hold | `inventory_cert_id text` nullable, default `NULL`; indexed and restricted to one active reservation per certificate; `NULL` is valid only for explicit `No Cert ID` |
| `auction.auction_listings` | Persist selected unit | `inventory_cert_id text` nullable, default `NULL`; opaque Inventory record id |
| `inventory.product_schema_revisions` | Encode system display field | Existing JSON order entries migrate to tagged attribute entries; Cert ID uses a tagged system entry |

```text
products 1──1 inventories 1──* inventory_cert_ids
                         │
                         └──* reservations 1──? auction_listings
```

The migration is append-only for new tables/columns. The legacy metadata
column is removed only after a preflight confirms its disposition; no automatic
conversion to typed attributes is attempted. The migration carries the
repository's required contract marker and is checked with the Drizzle and
migration gates.

## Service Interfaces

| Processor | Input | Success / refusal |
| --- | --- | --- |
| Inventory intake | product id, quantity, optional Cert ID strings, actor and reason | updated aggregate snapshot plus received records / invalid, duplicate, or too-many refusal |
| List Auction inventory choices | optional listing id for own-hold inclusion | products with available counts and certificate choices / authenticated refusal |
| Reserve inventory | product id, explicit unit choice (`cert-id` with opaque record id or `no-cert-id`), quantity, holder reference | active reservation / missing choice, product, certificate ownership, conflict, stock, or quantity refusal |
| Read Auction product display | product id, optional opaque certificate record id, locale | ordered typed fields plus Cert ID when configured / product or certificate refusal |
| Create or save listing | listing fields, product id, quantity, explicit unit choice | listing and matching hold / missing choice, wrong product, held certificate, or stock refusal |

Intake locks the product inventory first, validates every supplied identifier
and the quantity bound, inserts the records, updates the aggregate counters,
and writes one changelog entry before the transaction commits. Any failed
identifier check rolls back the inserts and counter update.

For a numbered reservation, Inventory locks the certificate row and its
inventory, checks that no active reservation owns it, then increments the
aggregate reservation counters and inserts the reservation carrying the
certificate record id. Releasing or settling the reservation clears the
certificate allocation in the same transaction. An unnumbered hold follows
the existing product-level lock and counter path. Omitted unit choice is
invalid; callers must send the explicit `no-cert-id` choice for aggregate
stock.

Auction validates the product/unit pair through the binding before saving. A
draft save synchronizes Inventory first; only after success does it persist
the listing's product, quantity, and opaque certificate id. Create verifies the
existing hold and never mints an allocation. A product change clears the local
unit selection until a unit for the new product is chosen.

The browser reaches the new data through the existing authenticated admin
procedure clients and feature repositories. Fixtures implement the same
contracts so admin tests do not require a running worker. Auction public reads
call Inventory's display processor with the listing's selected certificate;
they no longer call a product-metadata processor.

## API Contracts

- Inventory admin intake adds optional `certIds` and returns the received
  certificate records in the product detail response.
- Inventory Auction eligibility returns certificate choices for each eligible
  product and accepts an optional listing id so a listing can retain its own
  held unit.
- Inventory holder APIs add the shared explicit certificate-aware reserve and
  display inputs while retaining the existing product-level path for `No Cert
  ID`.
- Auction listing admin read, save, and create shapes add nullable
  `inventoryCertId`; the UI separately carries the explicit `No Cert ID`
  choice.
- Product display order entries use tagged attribute/system shapes, and the
  selected Cert ID is resolved at read time rather than copied into product
  attributes.

## Risks / Trade-offs

- [Legacy metadata may contain values with no typed equivalent] → Run a
  migration preflight and record the data disposition before dropping it.
- [A certificate could be double-listed under concurrent saves] → Lock the
  certificate row and enforce a unique active-allocation index in Inventory.
- [Existing draft listings have no explicit unit choice] → Treat them as
  incomplete at create and provide `No Cert ID` as an explicit editor choice.
- [Old display orders decode as strings] → Expand the decoder temporarily and
  migrate every existing entry to the tagged representation before writes.
- [Dirty schema-editor edits may conflict mechanically] → Keep their paths in
  the coordinator worktree and integrate the display-field changes as a
  focused patch.

## Migration Plan

1. Add the certificate table, nullable reservation/listing columns, and tagged
   display-order decoder in an expand migration.
2. Backfill existing display orders as tagged attribute entries and verify
   their order and count.
3. Deploy Inventory and Auction code that reads both old and new listing rows
   during the transition, while new writes use the new fields.
4. Confirm no legacy product metadata remains in the approved disposition,
   then drop the product type and metadata columns in the contract migration.
5. Run `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, backend
   tests, and application build before changing the submodule pointer.

Rollback before the contract migration is the prior application version;
certificate rows and nullable columns are additive. After the legacy columns
are dropped, rollback requires restoring from the migration backup because
arbitrary metadata is not reconstructible from typed attributes.

## Open Questions

None that change the specified behavior or task breakdown. Certificate
provider names and verification remain follow-on work.
