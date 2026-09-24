# grade10-admin/inventory/catalog Specification

## Purpose
Lets an authorized Inventory operator keep source media shared at product
level or associate it with one physical Cert record.

## Feature set

- Cert-scoped source media
  - A saved source item may be untagged and shared by the product, or tagged to one Cert record owned by that product. Every Cert record has one Cert ID.
  - The tag identifies the immutable Cert record; its Cert ID is display data.
  - An authorized Inventory operator may tag or untag saved source media. Retagging clears the original association and leaves the source item untagged and shared; assigning it to another Cert requires a separate explicit tag action.
  - Inventory without a Cert ID is regular product stock, not a Cert record or a media-tag target; its media remains product-level shared media.
  - Removing a Cert unit requires physical withdrawal; the operation removes its Cert record and currently tagged source-media rows while preserving unrelated product media.

## MODIFIED Requirements

### Requirement: Inventory may own optional Cert ID records and copy facts

An inventory SHALL represent certified physical units as Cert records and
regular stock as aggregate product inventory. A regular stock unit without a
Cert ID SHALL NOT create a Cert record.

**Cert records** - An inventory MAY own zero or more records for certified
units. Each Cert record SHALL identify one physical unit and SHALL contain a
system-minted immutable record id, its owning product inventory, one required
non-empty Cert ID, and its copy-level facts.

**Grade Issuer** - Grade Issuer SHALL name the unit's grading issuer. A unit
without a Cert ID SHALL be intaken as regular product stock, not with
`Grade Issuer` `RAW` as a Cert record.

**Cert ID** - Every Cert record MUST have a non-empty Cert ID after trimming
surrounding whitespace. Grade10 SHALL trim a supplied Cert ID before checking
its per-inventory uniqueness.

**Copy facts** - Serial, Grade Issuer, Grade, and Autograph Grade SHALL remain
inventory facts rather than product attributes. Grade SHALL be stored as text.

| Field | Rules |
| --- | --- |
| Record id | Unique, system-minted, immutable |
| Inventory | Required owner, immutable |
| Cert ID | Required and non-empty after trimming; unique within the owning inventory |
| Grade Issuer | Required copy-level text identifying a grading issuer |
| Grade | Optional copy-level text; no numeric coercion |
| Autograph Grade | Optional copy-level text |
| Serial | Optional copy-level text |
| Created at | Set when the record is received, immutable |

**Cert-scoped source media** - Each source media item owned by a product MAY
have no Cert-record tag or one tag. An untagged item SHALL remain shared at
the product level. A tag SHALL store the immutable record id of one Cert
record owned by that same product. Every Cert record has a required Cert ID;
the ID is display data and SHALL NOT be used as tag identity. Regular product
stock has no Cert record and cannot be a tag target.

An authorized Inventory operator using the existing Inventory media-management
authority SHALL be able to tag or untag a saved source media item. Retagging
SHALL clear the original association and leave the item untagged and shared;
assigning it to another Cert SHALL require a separate explicit tag action.
Grade10 SHALL refuse a tag write whose target record is missing or belongs to
a different product, and SHALL preserve the item's current tag and source
media. Physical removal of a Cert unit SHALL require an available record with
no active reservation. In the same Inventory transaction, Grade10 SHALL
decrement stock by one, increment withdrawn by one, remove the Cert record,
and delete source media tagged to that record. Untagged product media and
media tagged to other Cert records SHALL remain unchanged.

#### Scenario: grade10-admin-inventory-catalog-SC-95 - Inventory has no Cert ID records by default
**Serves:** grade10-admin-inventory-catalog-US-69 - Operator records a received graded unit

- **GIVEN** an authorized inventory admin creates a product without a
  certificate identifier
- **WHEN** the product's inventory is read
- **THEN** the inventory has zero Cert ID records
- **AND** the product remains valid for ordinary unnumbered stock

#### Scenario: grade10-admin-inventory-catalog-SC-96 - Intake records a Cert ID under its product
**Serves:** grade10-admin-inventory-catalog-US-69 - Operator records a received graded unit

- **GIVEN** a created product with an inventory
- **WHEN** an authorized inventory admin intakes one unit with Grade Issuer `PSA` and Cert ID `PSA-123`
- **THEN** the inventory owns one record whose displayed identifier is `PSA-123`
- **AND** that record belongs to the intaken product and no other product

#### Scenario: grade10-admin-inventory-catalog-SC-97 - Duplicate Cert ID is refused
**Serves:** grade10-admin-inventory-catalog-US-69 - Operator records a received graded unit

- **GIVEN** an inventory already owns Grade Issuer `PSA` and Cert ID `PSA-123`
- **WHEN** an authorized inventory admin intakes another unit with Grade Issuer `PSA` and Cert ID `PSA-123`
- **THEN** Grade10 refuses the intake
- **AND** stock, Cert ID records, and change history are unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-128 - Operator tags media to one same-product Cert record
**Serves:** grade10-admin-inventory-catalog-US-12 - Operator classifies source media for one copy

- **GIVEN** an untagged source media item and a Cert record with a printed Cert ID owned by the same product
- **WHEN** an authorized Inventory operator tags the media to that record
- **THEN** the tag identifies that immutable Cert record id
- **AND** the source media item remains owned by its product

#### Scenario: grade10-admin-inventory-catalog-SC-129 - Regular stock has no Cert media tag target
**Serves:** grade10-admin-inventory-catalog-US-12 - Operator classifies source media for one copy

- **GIVEN** an untagged source media item for a product with regular inventory stock and no Cert record for that stock
- **WHEN** an operator attempts to tag the media to the regular stock item
- **THEN** Grade10 refuses the tag write
- **AND** the source media remains untagged and shared at product level

#### Scenario: grade10-admin-inventory-catalog-SC-130 - Invalid Cert targets preserve the current media tag
**Serves:** grade10-admin-inventory-catalog-US-12 - Operator classifies source media for one copy

- **GIVEN** a source media item tagged to a valid Cert record
- **WHEN** an operator attempts to retag it to a missing record or a record owned by another product
- **THEN** Grade10 refuses the tag write
- **AND** the current tag and source media remain unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-131 - Operator untags media for product-level sharing
**Serves:** grade10-admin-inventory-catalog-US-12 - Operator classifies source media for one copy

- **GIVEN** a source media item tagged to a Cert record
- **WHEN** an authorized Inventory operator clears its tag
- **THEN** the source media item has no Cert tag and remains shared at product level

#### Scenario: grade10-admin-inventory-catalog-SC-132 - Retagging leaves the original source item untagged
**Serves:** grade10-admin-inventory-catalog-US-12 - Operator classifies source media for one copy

- **GIVEN** a source media item tagged to one Cert record and a second same-product Cert record with a printed Cert ID
- **WHEN** an authorized Inventory operator retags the source item
- **THEN** the existing Cert association is cleared and the source item remains on the product as untagged shared media
- **AND** Grade10 does not automatically transfer that source item to the second record

#### Scenario: grade10-admin-inventory-catalog-SC-133 - Unauthorized source-media tag writes are refused
**Serves:** grade10-admin-inventory-catalog-US-12 - Operator classifies source media for one copy

- **GIVEN** a source media item and an operator without existing Inventory media-management authority
- **WHEN** the operator attempts to change its Cert tag
- **THEN** Grade10 refuses the write under existing Inventory authorization
- **AND** the tag and source media remain unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-134 - Removing an available Cert unit withdraws the unit and its tagged media
**Serves:** grade10-admin-inventory-catalog-US-13 - Operator removes an available copy and its source media

- **GIVEN** an available Cert record with one source media item tagged to it and no active reservation
- **WHEN** an authorized Inventory operator removes the physical unit and its Cert record
- **THEN** stock decreases by one and withdrawn increases by one
- **AND** the inventory ledger remains unchanged
- **AND** the Cert record and its tagged source media are removed
- **AND** untagged product media and media tagged to other Cert records remain unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-135 - A Cert unit that fails a removal guard cannot be removed
**Serves:** grade10-admin-inventory-catalog-US-13 - Operator removes an available copy and its source media

- **GIVEN** a Cert record is not available or has an active reservation
- **WHEN** an authorized Inventory operator attempts to remove the physical unit
- **THEN** Grade10 refuses the removal
- **AND** the reservation, stock, withdrawn count, Cert record, and tagged source media remain unchanged
