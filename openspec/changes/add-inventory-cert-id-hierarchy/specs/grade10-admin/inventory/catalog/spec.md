## Feature set

- Product identity
  - Hierarchy: IP, Category, and Item are the complete product identity
  - Product facts: typed attributes replace free-form product metadata
- Physical units
  - Cert ID: optional identifier for one graded unit under an inventory
  - Intake: records identifiers atomically with received stock
- Auction presentation
  - Displayed fields: admins control attribute and Cert ID visibility and order
  - Live values: Auction reads the selected unit through Inventory

## ADDED Requirements

### Requirement: Product identity uses IP, Category, and Item

Every product SHALL be identified by exactly one IP, one Category, and one
Item classification. The product contract and admin product form SHALL NOT
carry a Collectible type or free-form product metadata. Product facts beyond
the classification SHALL be stored as typed attributes governed by the
product's schema.

#### Scenario: grade10-admin-inventory-catalog-SC-69 - Product form shows the complete hierarchy

- **GIVEN** an authorized inventory admin opens a product form
- **WHEN** they inspect the identity fields
- **THEN** IP, Category, and Item are available
- **AND** no Collectible type field or product metadata editor is available

#### Scenario: grade10-admin-inventory-catalog-SC-70 - Product contract has no legacy identity fields

- **GIVEN** an authorized inventory admin creates or reads a product
- **WHEN** Grade10 returns the product
- **THEN** its identity is represented by IP, Category, and Item
- **AND** the product carries no Collectible type or product metadata field

### Requirement: Inventory may own optional Cert ID records

An inventory SHALL own zero or more Cert ID records. Each record SHALL
identify one physical graded unit and SHALL contain a system-minted immutable
record id, its owning product inventory, and a trimmed non-empty certificate
identifier. Two records under the same product inventory SHALL NOT carry the
same identifier. A Cert ID record SHALL remain an inventory fact rather than a
product attribute.

| Field | Rules |
| --- | --- |
| Record id | Unique, system-minted, immutable |
| Inventory | Required owner, immutable |
| Cert ID | Trimmed, non-empty identifier, unique within the owning inventory |
| Created at | Set when the record is received, immutable |

#### Scenario: grade10-admin-inventory-catalog-SC-71 - Inventory has no Cert ID records by default

- **GIVEN** an authorized inventory admin creates a product without a
  certificate identifier
- **WHEN** the product's inventory is read
- **THEN** the inventory has zero Cert ID records
- **AND** the product remains valid for ordinary unnumbered stock

#### Scenario: grade10-admin-inventory-catalog-SC-72 - Intake records a Cert ID under its product

- **GIVEN** a created product with an inventory
- **WHEN** an authorized inventory admin intakes one unit with Cert ID `PSA-123`
- **THEN** the inventory owns one record whose displayed identifier is `PSA-123`
- **AND** that record belongs to the intaken product and no other product

#### Scenario: grade10-admin-inventory-catalog-SC-73 - Duplicate Cert ID is refused

- **GIVEN** an inventory already owns Cert ID `PSA-123`
- **WHEN** an authorized inventory admin intakes another unit with `PSA-123`
- **THEN** Grade10 refuses the intake
- **AND** stock, Cert ID records, and change history are unchanged

### Requirement: Intake accepts optional Cert ID entries atomically

An authorized inventory admin SHALL be able to intake a positive integer
quantity with zero or more Cert IDs. Each supplied Cert ID SHALL identify one
of the intaken units, so the number of supplied identifiers SHALL be no more
than the quantity. Intake with no identifiers SHALL remain valid and SHALL
change only the aggregate inventory counters. Invalid, duplicate, or
overlapping identifiers SHALL refuse the whole operation. A successful intake
SHALL append one history entry whose after state carries the received Cert IDs
when any were supplied.

#### Scenario: grade10-admin-inventory-catalog-SC-74 - Unnumbered intake increases stock

- **GIVEN** a created product with stock two
- **WHEN** an authorized inventory admin intakes quantity three without Cert IDs
- **THEN** stock increases to five
- **AND** no Cert ID record is created

#### Scenario: grade10-admin-inventory-catalog-SC-75 - Multiple Cert IDs match intake quantity

- **GIVEN** a created product with an inventory
- **WHEN** an authorized inventory admin intakes quantity two with Cert IDs
  `PSA-123` and `BGS-456`
- **THEN** stock increases by two
- **AND** both identifiers are recorded under that inventory
- **AND** one intake history entry records the two received identifiers

#### Scenario: grade10-admin-inventory-catalog-SC-76 - Too many Cert IDs refuse the intake

- **GIVEN** a created product with an inventory
- **WHEN** an authorized inventory admin intakes quantity one with two Cert IDs
- **THEN** Grade10 refuses the intake
- **AND** stock, Cert ID records, and change history are unchanged

### Requirement: Displayed Attributes always offer Cert ID as a special field

For every product schema, the Displayed Attributes panel SHALL offer Cert ID
as a special field alongside the schema's typed product attributes. Cert ID
SHALL NOT require an ordinary attribute key. An admin SHALL be able to include
or exclude the field and place it at any position in the displayed order.
Existing typed attribute display choices SHALL remain unchanged when Cert ID
is added, moved, or removed.

#### Scenario: grade10-admin-inventory-catalog-SC-77 - Admin adds Cert ID to displayed attributes

- **GIVEN** an authorized inventory admin edits a product schema's Displayed Attributes panel
- **WHEN** they include Cert ID and place it before the first product attribute
- **THEN** the saved display order contains Cert ID first
- **AND** no ordinary Cert ID attribute key is created

#### Scenario: grade10-admin-inventory-catalog-SC-78 - Admin hides Cert ID without changing attributes

- **GIVEN** a published product schema displaying Cert ID and two typed attributes
- **WHEN** an authorized inventory admin removes Cert ID from the displayed set
- **THEN** the two typed attributes remain in their prior order
- **AND** Cert ID is not returned as a displayed field

#### Scenario: grade10-admin-inventory-catalog-SC-79 - Displayed Cert ID resolves the selected unit

- **GIVEN** an Auction listing selects Cert ID `PSA-123` and its product schema displays Cert ID
- **WHEN** a collector reads the listing
- **THEN** the displayed product fields include `PSA-123` in the configured position

#### Scenario: grade10-admin-inventory-catalog-SC-80 - No Cert ID contributes no displayed value

- **GIVEN** an Auction listing explicitly selects `No Cert ID` and its product schema displays Cert ID
- **WHEN** a collector reads the listing
- **THEN** the configured product attributes remain available
- **AND** no Cert ID row is rendered
