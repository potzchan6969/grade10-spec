## Feature set

- Product identity
  - Hierarchy: IP, Category, and Item are the complete product identity
  - Product facts: typed attributes replace free-form product metadata
- Product schemas
  - Card template: shared typed facts are assigned to exact tag tuples
  - Schema manifest: validated definitions create draft revisions
- Physical units
  - Copy facts: Cert ID, grading, autograph grade, and serial belong to a unit
  - Intake: records identifiers atomically with received stock
- Bulk entry
  - Product upload: product names and schema values enter without stock
  - Inventory upload: physical copies enter against existing products
- Auction presentation
  - Displayed fields: admins control attribute and Cert ID visibility and order
  - Live values: Auction reads the selected unit through Inventory

## ADDED Requirements

### Requirement: Product identity uses IP, Category, and Item

Every product SHALL be identified by exactly one IP, one Category, and one
Item classification. The product contract and admin product form SHALL NOT
carry a Collectible type or free-form product metadata. Product facts beyond
the classification SHALL be stored as typed attributes governed by the
product's schema, except for facts that describe an individual inventory
unit.

#### Scenario: grade10-admin-inventory-catalog-SC-93 - Product form shows the complete hierarchy

- **GIVEN** an authorized inventory admin opens a product form
- **WHEN** they inspect the identity fields
- **THEN** IP, Category, and Item are available
- **AND** no Collectible type field or product metadata editor is available

#### Scenario: grade10-admin-inventory-catalog-SC-94 - Product contract has no legacy identity fields

- **GIVEN** an authorized inventory admin creates or reads a product
- **WHEN** Grade10 returns the product
- **THEN** its identity is represented by IP, Category, and Item
- **AND** the product carries no Collectible type or product metadata field

### Requirement: Inventory may own optional Cert ID records and copy facts

An inventory SHALL own zero or more records for individually tracked units.
Each record SHALL identify one physical unit and SHALL contain a system-minted
immutable record id, its owning product inventory, and its copy-level facts.
Grade Issuer SHALL identify the unit as `RAW` or name its grading issuer. A
`RAW` unit MUST NOT have a Cert ID; every graded unit MUST have a non-empty
Cert ID after trimming surrounding whitespace. Grade10 SHALL trim a supplied
Cert ID before checking its per-inventory uniqueness. Serial, Grade Issuer,
Grade, and Autograph Grade SHALL remain inventory facts rather than product
attributes. Grade SHALL be stored as text.

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

#### Scenario: grade10-admin-inventory-catalog-SC-95 - Inventory has no Cert ID records by default

- **GIVEN** an authorized inventory admin creates a product without a
  certificate identifier
- **WHEN** the product's inventory is read
- **THEN** the inventory has zero Cert ID records
- **AND** the product remains valid for ordinary unnumbered stock

#### Scenario: grade10-admin-inventory-catalog-SC-96 - Intake records a Cert ID under its product

- **GIVEN** a created product with an inventory
- **WHEN** an authorized inventory admin intakes one unit with Grade Issuer `PSA` and Cert ID `PSA-123`
- **THEN** the inventory owns one record whose displayed identifier is `PSA-123`
- **AND** that record belongs to the intaken product and no other product

#### Scenario: grade10-admin-inventory-catalog-SC-97 - Duplicate Cert ID is refused

- **GIVEN** an inventory already owns Grade Issuer `PSA` and Cert ID `PSA-123`
- **WHEN** an authorized inventory admin intakes another unit with Grade Issuer `PSA` and Cert ID `PSA-123`
- **THEN** Grade10 refuses the intake
- **AND** stock, Cert ID records, and change history are unchanged

### Requirement: Card product schemas use one shared typed template

The admin SHALL be able to create or revise a product schema for one exact
existing IP + Item + Category tuple through the schema editor or a schema
manifest upload. The common card template SHALL use the product name and the
attributes below. Each tuple SHALL have its own schema configuration, and the
same template MAY be reused for every workbook Category label after an admin
maps that label to existing IP, Item, and Category tags. The workbook's Item
column SHALL map to product name, not to the Grade10 Item tag.

| Product field | Stable key | Type | Requirement |
| --- | --- | --- | --- |
| Product name | Product `Name` | Text | Required |
| Year | `year` | Number | Required |
| Set | `set` | Text | Required |
| Subject | `subject` | Text | Required |
| Card Number | `card_number` | Text | Optional |
| Variety | `variety` | Text | Optional |

Serial, Cert ID, Grade Issuer, Grade, and Autograph Grade SHALL be copy-level
inventory facts and SHALL NOT be assigned as product attributes by this card
template.

#### Scenario: grade10-admin-inventory-catalog-SC-108 - Shared card template defines product facts

- **GIVEN** an authorized inventory admin opens product schema management
- **WHEN** they create a card schema from the shared template
- **THEN** Year is a required number and Set and Subject are required text
- **AND** Card Number and Variety are optional text
- **AND** Serial, Cert ID, Grade Issuer, Grade, and Autograph Grade are not product attributes

#### Scenario: grade10-admin-inventory-catalog-SC-109 - Source classification maps to existing tags

- **GIVEN** workbook rows share a broad Category but have different Set values or other source fields that identify distinct product families
- **WHEN** an authorized inventory admin maps a source classification key for a card schema
- **THEN** the key includes Category and enough additional source fields to resolve one exact existing IP, Item, and Category tuple
- **AND** a Category-only mapping is refused when that Category has multiple tuple targets
- **AND** a broad source Category such as TCG can map Pokémon, Lorcana, and One Piece rows to their respective existing tuples
- **AND** Grade10 uses the workbook Item value as product name
- **AND** Grade10 keeps source field values visible with their mapping
- **AND** Grade10 does not infer or create taxonomy tags from workbook labels

### Requirement: Schema manifests create drafts for review

An authorized inventory admin SHALL be able to upload a CSV or XLSX schema
manifest that defines reusable attribute keys and assigns them to exact
existing IP + Item + Category tuples. The preview SHALL validate stable keys,
supported types, requiredness, validation rules, displayed labels, and select
options against the existing product-schema rules. Each distinct source
classification key SHALL be explicitly mapped to one existing tag tuple.
Category alone SHALL NOT map to multiple tuples. A valid manifest SHALL create
draft schema revisions only; it SHALL NOT publish them.
An invalid manifest SHALL create no partial revisions. The admin SHALL review
and publish each schema through the existing publish flow, including its
validation of affected products.

#### Scenario: grade10-admin-inventory-catalog-SC-110 - Schema manifest imports as drafts

- **GIVEN** an authorized inventory admin has mapped each distinct source classification key to an existing tag tuple
- **WHEN** they preview and import a valid manifest
- **THEN** Grade10 creates draft schema revisions for the mapped tuples
- **AND** the current published schemas remain active until each revision is published

#### Scenario: grade10-admin-inventory-catalog-SC-111 - Invalid schema manifest creates no revisions

- **GIVEN** a schema manifest contains an unmapped source classification key, an ambiguous Category-only mapping, or an invalid attribute definition
- **WHEN** an authorized inventory admin validates and imports the manifest
- **THEN** Grade10 reports the affected rows and reasons
- **AND** no schema revision from that manifest is created or published

### Requirement: Mapped workbook values use consistent normalization

Schema-manifest, product-entry, and inventory imports SHALL trim surrounding
whitespace from every mapped workbook value. After trimming, an empty cell or
a standalone `-` SHALL mean absent; a hyphen inside a value SHALL remain part
of that value. An absent required value SHALL fail row validation. An absent
optional value SHALL remain absent. Import SHALL NOT modify the uploaded file.

#### Scenario: grade10-admin-inventory-catalog-SC-115 - Mapped values trim and omit blank placeholders

- **GIVEN** product rows contain surrounding whitespace and optional Card Number or Variety cells that are blank or `-`
- **WHEN** an authorized inventory admin previews the product upload
- **THEN** Grade10 trims surrounding whitespace from mapped values
- **AND** blank and standalone `-` optional values are absent rather than stored as text
- **AND** a blank or `-` required value is reported as missing
- **AND** the uploaded workbook is unchanged

### Requirement: Product uploads create products without inventory

An authorized inventory admin SHALL be able to upload a product-entry file
separately from an inventory file. Product upload SHALL accept CSV and XLSX
workbooks with one or more sheets. Each included row SHALL provide a product
name, a mapping from a sufficiently specific source classification key to
one existing IP + Item + Category tuple, and values for the published schema
assigned to that tuple. A Category-only key SHALL NOT be used when a broad
Category contains rows for different product families or tuple targets.
Before commit, Grade10 SHALL preview row validation and product matches. The
source fields SHALL remain visible beside their mapping in the preview.
Identical rows for the same product name, exact tuple, and schema values SHALL
resolve to one product. A successful commit SHALL create or reuse products
without creating inventory units, Cert IDs, or stock. New products SHALL use
the existing draft lifecycle, and the admin SHALL mark each valid draft
`created` through the existing product status flow before inventory upload.
Product name SHALL NOT be a global uniqueness constraint: rows with the same
product name and tuple but different schema values SHALL remain distinct.
Missing mappings, missing required values, or invalid values SHALL block the
entire commit.

#### Scenario: grade10-admin-inventory-catalog-SC-112 - Product upload creates one draft per identity

- **GIVEN** an authorized inventory admin has mapped each source classification key and a published card schema exists for each target tuple
- **WHEN** they preview and commit product rows containing repeated identical card identities
- **THEN** Grade10 creates one draft product for each distinct product name, exact tuple, and schema-value set
- **AND** no inventory quantity, unit record, or Cert ID is created
- **WHEN** the admin marks each valid imported draft `created` through the existing product status flow
- **THEN** only products with complete classification and valid required schema values become `created`

#### Scenario: grade10-admin-inventory-catalog-SC-114 - Same name keeps distinct card identities

- **GIVEN** uploaded rows share a product name and exact tuple but differ by Card Number or Set
- **WHEN** an authorized inventory admin previews and commits the product upload
- **THEN** Grade10 creates one draft product for each distinct schema-value set
- **AND** rows with repeated product name alone do not merge or block one another
- **AND** no inventory quantity, unit record, or Cert ID is created

#### Scenario: grade10-admin-inventory-catalog-SC-113 - Product upload refuses incomplete rows atomically

- **GIVEN** an authorized inventory admin uploads product rows with an unmapped Category label, missing required value, or invalid schema value
- **WHEN** they validate and attempt to commit the upload
- **THEN** Grade10 identifies the affected rows and reasons
- **AND** no product from that upload is created or changed

### Requirement: Inventory uploads create matched physical units atomically

An authorized inventory admin SHALL be able to upload inventory rows separately
from product entries. Inventory upload SHALL accept CSV and XLSX workbooks
with one or more sheets, where each included row represents one physical unit.
The source Category label SHALL remain visible beside its mapping in the
preview.
Grade10 SHALL match each row to exactly one existing `created` product using
the exact mapped IP + Item + Category tuple, product name, and supplied schema
values. A Category-only mapping SHALL NOT be used when source rows in that
Category require different tuple targets. The import preview SHALL show the
resolved product and each copy-level fact before commit. It SHALL preserve
Cert ID, Grade Issuer, Grade, Autograph Grade, and Serial as copy-level facts.
Every included row SHALL identify its Grade Issuer as `RAW` or a grading
issuer. A `RAW` row MUST NOT have a Cert ID; every graded row MUST have one.
Grade10 SHALL trim surrounding whitespace from a supplied Cert ID before
checking duplicates; duplicates within the upload or within the matched
product inventory SHALL block the whole commit. Each blank Item Status row
SHALL have its own explicit include or exclude decision before commit, with no
default applied to other rows. Successful commit SHALL add one unit per
included row, update inventory counts, store copy facts, and append the
corresponding inventory history in one atomic operation.

| Import field | Rules |
| --- | --- |
| Product match | Exactly one existing `created` product with the exact mapped tuple, product name, and supplied schema values |
| Source mapping | Category plus enough source fields to resolve one tuple; not Category alone when it spans multiple tuples |
| Cert ID | Required and trimmed for graded rows; prohibited for `RAW`; unique within the upload and matched product inventory |
| Grade Issuer | Required copy-level text identifying `RAW` or a grading issuer |
| Grade | Copy-level text |
| Autograph Grade | Optional copy-level text |
| Serial | Optional copy-level text |

#### Scenario: grade10-admin-inventory-catalog-SC-116 - Inventory upload previews matched copy facts

- **GIVEN** an authorized inventory admin uploads rows that each match one created product
- **WHEN** they preview and confirm the inventory upload
- **THEN** each row resolves to one product and one physical unit
- **AND** Cert ID, Grade Issuer, Grade, Autograph Grade, and Serial are shown as copy-level facts
- **AND** the rows are committed only after confirmation

#### Scenario: grade10-admin-inventory-catalog-SC-117 - Blank status requires per-row choice and RAW has no Cert ID

- **GIVEN** an inventory upload has two blank Item Status rows, one `RAW` row without Cert ID and one graded row with Cert ID
- **WHEN** an authorized inventory admin previews the upload without deciding either row
- **THEN** Grade10 requires an explicit include or exclude decision for each blank-status row
- **WHEN** the admin includes the RAW row and excludes the graded row
- **THEN** the RAW row is valid without Cert ID
- **AND** only the included RAW row adds a unit and stock

#### Scenario: grade10-admin-inventory-catalog-SC-118 - Missing or ambiguous product match blocks import

- **GIVEN** an inventory upload contains a row with no matching product or more than one matching product
- **WHEN** an authorized inventory admin attempts to commit the upload
- **THEN** Grade10 identifies the unmatched or ambiguous row
- **AND** no row in the upload changes inventory or history

#### Scenario: grade10-admin-inventory-catalog-SC-119 - Duplicate Cert ID blocks the whole upload

- **GIVEN** an inventory upload contains a Cert ID already present under its matched product inventory or repeated in another upload row
- **WHEN** an authorized inventory admin attempts to commit the upload
- **THEN** Grade10 reports the duplicate after trimming surrounding whitespace
- **AND** no row in the upload changes inventory, unit records, or history

#### Scenario: grade10-admin-inventory-catalog-SC-120 - Invalid inventory row leaves every unit unchanged

- **GIVEN** an inventory upload contains a row with an invalid value or unresolved required mapping
- **WHEN** an authorized inventory admin validates and attempts to commit the upload
- **THEN** Grade10 reports the row and reason
- **AND** no inventory count, unit fact, or history entry from that upload is committed

#### Scenario: grade10-admin-inventory-catalog-SC-121 - Copy facts trim and omit blank placeholders

- **GIVEN** inventory rows contain surrounding whitespace and optional copy facts that are blank or `-`
- **WHEN** an authorized inventory admin previews the inventory upload
- **THEN** Grade10 trims surrounding whitespace from mapped copy facts
- **AND** blank and standalone `-` optional facts are absent rather than stored as text
- **AND** the uploaded workbook is unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-122 - Graded rows require Cert ID and RAW rows forbid it

- **GIVEN** an inventory upload contains one `RAW` row with Cert ID and one graded row without Cert ID
- **WHEN** an authorized inventory admin validates the upload
- **THEN** Grade10 reports both rows as invalid
- **AND** no inventory quantity, unit record, or history entry is committed

### Requirement: Intake accepts optional Cert ID entries atomically

An authorized inventory admin SHALL be able to intake a positive integer
quantity with zero or more individually tracked unit records. Each tracked
unit SHALL identify its Grade Issuer and SHALL follow the Cert ID rules for
`RAW` or graded units. The number of tracked unit records SHALL be no more
than the intake quantity. Intake with no unit records SHALL remain valid and
SHALL change only the aggregate inventory counters. Invalid, duplicate, or
overlapping identifiers SHALL refuse the whole operation. A successful intake
SHALL append one history entry whose after state carries the received unit
records when any were supplied.

#### Scenario: grade10-admin-inventory-catalog-SC-98 - Unnumbered intake increases stock

- **GIVEN** a created product with stock two
- **WHEN** an authorized inventory admin intakes quantity three without unit records
- **THEN** stock increases to five
- **AND** no individually tracked unit record is created

#### Scenario: grade10-admin-inventory-catalog-SC-99 - Multiple Cert IDs match intake quantity

- **GIVEN** a created product with an inventory
- **WHEN** an authorized inventory admin intakes quantity two with one unit
  from issuer `PSA` with Cert ID `PSA-123` and one from issuer `BGS` with Cert
  ID `BGS-456`
- **THEN** stock increases by two
- **AND** both identifiers are recorded under that inventory
- **AND** one intake history entry records the two received identifiers

#### Scenario: grade10-admin-inventory-catalog-SC-100 - Too many Cert IDs refuse the intake

- **GIVEN** a created product with an inventory
- **WHEN** an authorized inventory admin intakes quantity one with two graded
  unit records, each with Grade Issuer `PSA` and a Cert ID
- **THEN** Grade10 refuses the intake
- **AND** stock, Cert ID records, and change history are unchanged

### Requirement: Displayed Attributes always offer Cert ID as a special field

For every product schema, the Displayed Attributes panel SHALL offer Cert ID
as a special field alongside the schema's typed product attributes. Cert ID
SHALL NOT require an ordinary attribute key. An admin SHALL be able to include
or exclude the field and place it at any position in the displayed order.
Existing typed attribute display choices SHALL remain unchanged when Cert ID
is added, moved, or removed.

#### Scenario: grade10-admin-inventory-catalog-SC-101 - Admin adds Cert ID to displayed attributes

- **GIVEN** an authorized inventory admin edits a product schema's Displayed Attributes panel
- **WHEN** they include Cert ID and place it before the first product attribute
- **THEN** the saved display order contains Cert ID first
- **AND** no ordinary Cert ID attribute key is created

#### Scenario: grade10-admin-inventory-catalog-SC-102 - Admin hides Cert ID without changing attributes

- **GIVEN** a published product schema displaying Cert ID and two typed attributes
- **WHEN** an authorized inventory admin removes Cert ID from the displayed set
- **THEN** the two typed attributes remain in their prior order
- **AND** Cert ID is not returned as a displayed field

#### Scenario: grade10-admin-inventory-catalog-SC-103 - Displayed Cert ID resolves the selected unit

- **GIVEN** an Auction listing selects Cert ID `PSA-123` and its product schema displays Cert ID
- **WHEN** a collector reads the listing
- **THEN** the displayed product fields include `PSA-123` in the configured position

#### Scenario: grade10-admin-inventory-catalog-SC-104 - No Cert ID contributes no displayed value

- **GIVEN** an Auction listing explicitly selects `No Cert ID` and its product schema displays Cert ID
- **WHEN** a collector reads the listing
- **THEN** the configured product attributes remain available
- **AND** no Cert ID row is rendered

### Requirement: Every reservation requires an explicit inventory unit choice

Any reservation created against inventory SHALL carry an explicit unit choice.
The choice SHALL be either one available Cert ID owned by the selected product
inventory or the literal choice `No Cert ID`. A Cert ID reservation SHALL have
quantity one and SHALL be exclusive to one active reservation. `No Cert ID`
SHALL use the existing product-level quantity reservation path without
allocating a certificate record.

#### Scenario: grade10-admin-inventory-catalog-SC-105 - Reservation selects a Cert ID

- **GIVEN** a created product with available Cert IDs `PSA-123` and `BGS-456`
- **WHEN** an authorized holder requests a reservation for `PSA-123`
- **THEN** the reservation stores the opaque Cert ID record identity
- **AND** its quantity is one and `PSA-123` is unavailable to other active reservations

#### Scenario: grade10-admin-inventory-catalog-SC-106 - Reservation selects No Cert ID

- **GIVEN** a created product with available stock and no intended numbered unit
- **WHEN** an authorized holder explicitly requests `No Cert ID` for quantity three
- **THEN** the reservation uses product-level quantity three
- **AND** no Cert ID record is allocated

#### Scenario: grade10-admin-inventory-catalog-SC-107 - Reservation without a unit choice is refused

- **GIVEN** a created product with available stock
- **WHEN** an authorized holder requests a reservation without a Cert ID or `No Cert ID`
- **THEN** Grade10 refuses the request without changing stock, reserved, or Cert ID records
