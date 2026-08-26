# grade10-inventory/catalog Specification

## Purpose

Gives Grade10 operators an admin-only house stock ledger: catalogue products,
serialized inventory units (one per physical item), remaining available count,
and a change history that records every product or unit mutation — including
when the system itself updates a unit.

## Feature set

- Product catalogue
  - Product record: identity and copy an operator maintains for house stock
  - List and edit products: find every product and update its fields
  - Remaining available count: how many units of a product are still free to assign
- Inventory units
  - Unit record: one physical item of a product with status and optional sold money
  - Add by quantity: create N distinct unit rows for one product in one action
  - Edit and delete units: change fields or remove an eligible unit
  - Unit identifiers for a product: list every unit id under a product
- Change history
  - Mutation trail: who added, updated, or deleted a product or unit
- Admin console
  - Products table and product detail: browse products then their units
  - Operator writes from the console: add product, add units, edit, delete
- Access
  - Admin-only inventory grants: read and write reserved for admin operators

## ADDED Requirements

### Product catalogue

---

### Requirement: Product record fields

A product SHALL carry the fields below. Money does not appear on a product.

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Name | Trimmed, 1 to 200 characters |
| Description | Trimmed text, may be empty |
| Created at | Set on create, immutable |
| Updated at | Set on every successful update |
| Created by | Operator user id at create, immutable |
| Remarks | Trimmed text, may be empty |

#### Scenario: Operator creates a product with required name

- **GIVEN** an authorized inventory admin
- **WHEN** they create a product with a valid name
- **THEN** Grade10 persists the product with a new id
- **AND** created by is that operator
- **AND** created at and updated at are set

#### Scenario: Product create without a name is refused

- **GIVEN** an authorized inventory admin
- **WHEN** they create a product with an empty name
- **THEN** Grade10 refuses the create
- **AND** no product is persisted

### Requirement: Operators list and edit products

An authorized inventory admin SHALL list every product and SHALL update an
existing product’s name, description, and remarks. List SHALL include each
product’s id, name, and remaining available unit count. An update SHALL
refresh updated at. Edit SHALL NOT change id, created at, or created by.

#### Scenario: Operator lists products with remaining counts

- **GIVEN** two products, one with three available units and one with none
- **WHEN** an authorized inventory admin lists products
- **THEN** both products appear
- **AND** remaining available counts are three and zero respectively

#### Scenario: Operator edits a product name

- **GIVEN** an existing product
- **WHEN** an authorized inventory admin changes its name to a valid value
- **THEN** Grade10 persists the new name
- **AND** updated at advances
- **AND** id and created by are unchanged

### Requirement: Remaining available unit count

Remaining available count for a product SHALL equal the number of that
product’s inventory units whose status is `available`. Units in `reserved`,
`sold`, or `withdrawn` SHALL NOT count. The admin API SHALL expose this count
for a given product id.

#### Scenario: Remaining count ignores non-available units

- **GIVEN** a product with two `available` units, one `reserved`, and one `sold`
- **WHEN** an authorized inventory admin reads remaining available count
- **THEN** the count is two

#### Scenario: Unknown product remaining count is not found

- **GIVEN** no product with the requested id
- **WHEN** an authorized inventory admin reads remaining available count
- **THEN** Grade10 answers not found

### Inventory units

---

### Requirement: Inventory unit record fields

An inventory unit SHALL be one physical item of exactly one product. A
product with ten physical items SHALL have ten unit records, not one record
with quantity ten. Fields:

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Product id | Required, immutable after create |
| Name | Trimmed, 1 to 200 characters |
| Added by | Operator user id at create, immutable |
| Created at | Set on create, immutable |
| Updated at | Set on every successful update |
| Status | One of `available`, `reserved`, `sold`, `withdrawn` |
| Sold price | Integer minor units greater than zero when status is `sold`; null otherwise |
| Sold currency | ISO 4217 code when status is `sold`; null otherwise |
| Remarks | Trimmed text, may be empty |

#### Scenario: Ten units are ten records

- **GIVEN** a product
- **WHEN** an authorized inventory admin adds quantity ten for that product
- **THEN** Grade10 persists exactly ten inventory units
- **AND** each unit has a distinct id and the same product id

### Requirement: Unit status and sold money

Status SHALL be one of `available`, `reserved`, `sold`, or `withdrawn`. Status
names SHALL NOT encode a sales channel (for example they SHALL NOT be
auction-specific labels). When status is `sold`, sold price and sold currency
SHALL both be present and valid. When status is not `sold`, sold price and
sold currency SHALL both be null. A write that sets `sold` without both money
fields, or that sets money while status is not `sold`, SHALL be refused.

#### Scenario: Available unit has null sold money

- **GIVEN** a new inventory unit
- **WHEN** it is created
- **THEN** its status is `available`
- **AND** sold price and sold currency are null

#### Scenario: Sold requires price and currency

- **GIVEN** an inventory unit
- **WHEN** an authorized inventory admin sets status to `sold` with price
  `5000` minor units and currency `HKD`
- **THEN** Grade10 persists those values

#### Scenario: Sold without money is refused

- **GIVEN** an inventory unit in `available`
- **WHEN** an authorized inventory admin sets status to `sold` without price
  or currency
- **THEN** Grade10 refuses the write
- **AND** the unit is unchanged

#### Scenario: Money on a non-sold status is refused

- **GIVEN** an inventory unit in `available`
- **WHEN** an authorized inventory admin sets a sold price while status stays
  `available`
- **THEN** Grade10 refuses the write
- **AND** the unit is unchanged

### Requirement: Operators add inventory units by quantity

An authorized inventory admin SHALL add inventory units for an existing
product by supplying a positive integer quantity and the shared create
fields (name, optional remarks). Grade10 SHALL create that many unit records
in one action, each with status `available`, null sold money, and added by
set to that operator. Quantity SHALL be at least 1 and at most 500 per
action. Adding units for an unknown product SHALL be refused.

#### Scenario: Operator adds three units

- **GIVEN** an existing product
- **WHEN** an authorized inventory admin adds quantity three with a valid name
- **THEN** three `available` units exist for that product
- **AND** each names the same added-by operator

#### Scenario: Quantity zero is refused

- **GIVEN** an existing product
- **WHEN** an authorized inventory admin adds quantity zero
- **THEN** Grade10 refuses the add
- **AND** no new units are persisted

#### Scenario: Add for unknown product is refused

- **GIVEN** no product with the requested id
- **WHEN** an authorized inventory admin adds units for that id
- **THEN** Grade10 refuses the add

### Requirement: Operators edit and delete inventory units

An authorized inventory admin SHALL update an existing unit’s name, status,
sold money (subject to the sold rules), and remarks. An authorized inventory
admin SHALL delete a unit whose status is `available` or `withdrawn`. Delete
of a `reserved` or `sold` unit SHALL be refused. Delete SHALL remove the unit
record and SHALL append a change-history entry for that deletion.

#### Scenario: Operator edits a unit name

- **GIVEN** an inventory unit
- **WHEN** an authorized inventory admin changes its name
- **THEN** Grade10 persists the new name
- **AND** updated at advances

#### Scenario: Operator deletes an available unit

- **GIVEN** an inventory unit in `available`
- **WHEN** an authorized inventory admin deletes it
- **THEN** the unit is gone
- **AND** a change-history entry records the delete

#### Scenario: Delete of a sold unit is refused

- **GIVEN** an inventory unit in `sold`
- **WHEN** an authorized inventory admin deletes it
- **THEN** Grade10 refuses the delete
- **AND** the unit remains

### Requirement: Operators list inventory unit ids for a product

An authorized inventory admin SHALL list every inventory unit id for a given
product, including units that are not `available`. The list for an unknown
product SHALL be not found.

#### Scenario: Unit ids include reserved and sold

- **GIVEN** a product with one `available`, one `reserved`, and one `sold` unit
- **WHEN** an authorized inventory admin lists unit ids for that product
- **THEN** all three ids are returned

### Change history

---

### Requirement: Every product or unit mutation is recorded

Every successful create, update, or delete of a product or inventory unit
SHALL append one change-history entry. Each entry SHALL record: when it
happened; the actor; the subject kind (`product` or `inventory-unit`); the
subject id; the action (`create`, `update`, or `delete`); and a details
payload sufficient to see what changed. The actor SHALL be the operator’s
user id when a person performed the write, or the literal `server` when the
system updated a unit without an operator (for example marking a unit sold
from an automated path). Failed writes SHALL NOT append an entry.

#### Scenario: Operator create appends history with user actor

- **GIVEN** an authorized inventory admin
- **WHEN** they create a product
- **THEN** a change-history entry exists for that product create
- **AND** the actor is that operator’s user id

#### Scenario: Server update appends history with server actor

- **GIVEN** an inventory unit updated by an automated server path
- **WHEN** the update succeeds
- **THEN** a change-history entry exists for that unit update
- **AND** the actor is `server`

#### Scenario: Refused write leaves history unchanged

- **GIVEN** an inventory unit
- **WHEN** an unauthorized caller attempts an update and is refused
- **THEN** no new change-history entry is appended

### Admin console

---

### Requirement: Operators manage stock from the Grade10 admin panel

The Grade10 admin panel SHALL offer an Inventory section to authorized
inventory admins. The section SHALL show a products table. Choosing a product
SHALL show that product’s inventory units. From the section an operator SHALL
add a product, add units for a product by quantity, edit a product, and edit
or delete an eligible unit. Loading, empty, and error states SHALL be visible
when the corresponding list or write fails or returns no rows.

#### Scenario: Operator opens a product’s units from the products table

- **GIVEN** a product with two inventory units
- **WHEN** an authorized inventory admin opens that product in Inventory
- **THEN** both units are listed

#### Scenario: Empty products table

- **GIVEN** no products
- **WHEN** an authorized inventory admin opens Inventory
- **THEN** the products table shows an empty state

#### Scenario: Add units form submits quantity

- **GIVEN** an existing product open in Inventory
- **WHEN** an authorized inventory admin adds quantity two with a valid name
- **THEN** two new units appear on that product’s unit list

### Access

---

### Requirement: Inventory APIs and console are admin-only

Inventory read and write SHALL require inventory admin grants. A signed-in
person who lacks those grants SHALL be refused every inventory procedure and
SHALL NOT see the Inventory section. Collector and public callers SHALL have
no inventory surface in this capability.

#### Scenario: Unauthorized list products is refused

- **GIVEN** a signed-in person without inventory admin grants
- **WHEN** they request the product list
- **THEN** Grade10 refuses the request

#### Scenario: Inventory section hidden without grants

- **GIVEN** a signed-in person without inventory admin grants
- **WHEN** they use the Grade10 admin panel
- **THEN** the Inventory section is not offered
