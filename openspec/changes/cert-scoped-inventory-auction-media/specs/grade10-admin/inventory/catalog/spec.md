# grade10-admin/inventory/catalog Specification

## Purpose
Lets an authorized Inventory operator keep source media shared at product
level or associate it with one physical Cert record.

## Feature set

- Cert-scoped source media
  - A saved source item may be untagged and shared by the product, or tagged to one Cert record with a printed Cert ID owned by that product.
  - The tag identifies the immutable Cert record; its printed Cert ID is display data and may be absent.
  - An authorized Inventory operator may tag or untag saved source media. Retagging clears the original association and leaves the source item untagged and shared; assigning it to another Cert requires a separate explicit tag action.
  - A record without a printed Cert ID has no tag; its media remains product-level shared media.
  - Removing a Cert record clears its source-media tags and preserves the uploaded media as untagged product media.

## MODIFIED Requirements

### Requirement: Inventory may own optional Cert ID records and copy facts

An inventory can track its units one by one, each with the facts that belong
to that copy.

**Unit records** - An inventory SHALL own zero or more records for
individually tracked units. Each record SHALL identify one physical unit and
SHALL contain a system-minted immutable record id, its owning product
inventory, and its copy-level facts.

**Grade Issuer** - Grade Issuer SHALL identify the unit as `RAW` or name its
grading issuer.

**Cert ID** - A `RAW` unit MUST NOT have a Cert ID; every graded unit MUST
have a non-empty Cert ID after trimming surrounding whitespace. Grade10 SHALL
trim a supplied Cert ID before checking its per-inventory uniqueness.

**Copy facts** - Serial, Grade Issuer, Grade, and Autograph Grade SHALL remain
inventory facts rather than product attributes. Grade SHALL be stored as text.

| Field | Rules |
| --- | --- |
| Record id | Unique, system-minted, immutable |
| Inventory | Required owner, immutable |
| Cert ID | Prohibited for `RAW`; required and non-empty after trimming for graded units; unique within the owning inventory |
| Grade Issuer | Required copy-level text identifying `RAW` or a grading issuer |
| Grade | Optional copy-level text; no numeric coercion |
| Autograph Grade | Optional copy-level text |
| Serial | Optional copy-level text |
| Created at | Set when the record is received, immutable |

**Cert-scoped source media** - Each source media item owned by a product MAY
have no Cert-record tag or one tag. An untagged item SHALL remain shared at
the product level. A tag SHALL store the immutable record id of one Cert
record owned by that same product. The target record SHALL have a printed
Cert ID; the printed ID is display data and SHALL NOT be used as tag identity.
A record without a printed Cert ID SHALL receive no tag, and its source media
SHALL remain untagged and shared at product level.

An authorized Inventory operator using the existing Inventory media-management
authority SHALL be able to tag or untag a saved source media item. Retagging
SHALL clear the original association and leave the item untagged and shared;
assigning it to another Cert SHALL require a separate explicit tag action.
Grade10 SHALL refuse a tag write whose target record is missing, belongs to a
different product, or has no printed Cert ID, and SHALL preserve the item's
current tag and source media. Physical removal of a Cert unit SHALL require an available record with no
active reservation. In the same Inventory transaction, Grade10 SHALL decrement
stock by one, increment withdrawn by one, remove the Cert record, and delete
source media tagged to that record. Untagged product media and media tagged to
other Cert records SHALL remain unchanged.

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

#### Scenario: grade10-admin-inventory-catalog-SC-129 - Media for a record without a printed Cert ID stays shared
**Serves:** grade10-admin-inventory-catalog-US-12 - Operator classifies source media for one copy

- **GIVEN** an untagged source media item and a same-product Cert record without a printed Cert ID
- **WHEN** an operator attempts to tag the media to that record
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

#### Scenario: grade10-admin-inventory-catalog-SC-135 - A reserved Cert unit cannot be removed
**Serves:** grade10-admin-inventory-catalog-US-13 - Operator removes an available copy and its source media

- **GIVEN** a Cert record has an active reservation
- **WHEN** an authorized Inventory operator attempts to remove the physical unit
- **THEN** Grade10 refuses the removal
- **AND** the reservation, stock, withdrawn count, Cert record, and tagged source media remain unchanged
