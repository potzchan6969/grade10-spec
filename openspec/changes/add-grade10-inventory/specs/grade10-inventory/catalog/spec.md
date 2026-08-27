# grade10-inventory/catalog Specification

## Purpose

Gives Grade10 a house stock ledger for catalogue products and serialized
physical units, with application-scoped reservations, an admin overview of
where stock is held, and history for every ledger mutation.

## Feature set

- Product catalogue
  - Product record: identity and copy an operator maintains for house stock
  - List and edit products: find every product and update its fields
  - Stock count: all current `in-stock` units, whether available or reserved
  - Ledger count: every retained unit record, including sold and withdrawn units
  - Remaining available count: how many stock units are not actively reserved
- Inventory units
  - Unit record: one physical item of a product with state and optional sold money
  - Add by quantity: create N distinct unit rows for one product in one action
  - Edit and delete units: change fields or remove an eligible unit
  - Unit identifiers for a product: list every unit id under a product
- Reservations
  - Concrete allocation: one reservation assigns distinct unit ids to one holder application
  - Conservation and exclusion: every in-stock unit is either available or in one active reservation, never two
  - Holder-scoped access: an application sees free stock and its own holdings, never another application's held units
  - Admin oversight: operators see allocation totals and hold purpose/reference across applications
- Change history
  - Mutation trail: who added, updated, deleted, reserved, or released stock
- Admin console
  - Products table and product detail: browse products, units, and reservation allocation
  - Operator writes from the console: add product, add units, edit, delete, reserve, release
- Access
  - Admin grants: global read and write reserved for admin operators
  - Application grants: Auction and Vault each receive a distinct holder-scoped service entrypoint

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
product’s id, name, stock count, ledger count, remaining available count, and
active reserved count. An update SHALL refresh updated at. Edit SHALL NOT
change id, created at, or created by.

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

### Requirement: Stock, ledger, available, and reserved counts

Stock count SHALL equal all `in-stock` units for a product. Ledger count SHALL
equal every retained inventory-unit record for that product, including
`auction-sold` and `withdrawn`. Available count SHALL equal `in-stock` units
with no active reservation. Active reserved count SHALL equal `in-stock`
units in active reservations. Therefore `available + active reserved = stock
count`, and `stock + auction-sold + withdrawn = ledger count`. The admin API
SHALL expose these counts for a product. A holder-scoped API SHALL expose only
available count and SHALL NOT expose ledger, stock, another holder's reserved
count, or another holder's unit identity.

#### Scenario: Remaining count ignores reserved and non-stock units

- **GIVEN** a product with two unreserved `in-stock` units, one `in-stock` unit reserved by Auction, and one `auction-sold` unit
- **WHEN** an authorized inventory admin reads remaining available count
- **THEN** the count is two

#### Scenario: Stock and ledger counts separate current and historical units

- **GIVEN** a product with two available `in-stock` units, one reserved `in-stock` unit, one `auction-sold` unit, and one `withdrawn` unit
- **WHEN** an authorized inventory admin reads its counts
- **THEN** available count is two and active reserved count is one
- **AND** stock count is three
- **AND** ledger count is five

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
| State | One of `in-stock`, `auction-sold`, `withdrawn` |
| Sold price | Integer minor units greater than zero when state is `auction-sold`; null otherwise |
| Sold currency | ISO 4217 code when state is `auction-sold`; null otherwise |
| Remarks | Trimmed text, may be empty |

#### Scenario: Ten units are ten records

- **GIVEN** a product
- **WHEN** an authorized inventory admin adds quantity ten for that product
- **THEN** Grade10 persists exactly ten inventory units
- **AND** each unit has a distinct id and the same product id

### Requirement: Unit state and sold money

State SHALL be one of `in-stock`, `auction-sold`, or `withdrawn`. Reservation
ownership SHALL NOT be encoded in state. When state is `auction-sold`, sold
price and sold currency SHALL both be present and valid. When state is not
`auction-sold`, sold price and sold currency SHALL both be null. A write that
sets `auction-sold` without both money fields, or that sets money while state
is not `auction-sold`, SHALL be refused. A unit with an active reservation
SHALL NOT change state; its reservation must be released first.

#### Scenario: In-stock unit has null sold money

- **GIVEN** a new inventory unit
- **WHEN** it is created
- **THEN** its state is `in-stock`
- **AND** sold price and sold currency are null

#### Scenario: Sold requires price and currency

- **GIVEN** an inventory unit
- **WHEN** an authorized inventory admin sets state to `auction-sold` with price
  `5000` minor units and currency `HKD`
- **THEN** Grade10 persists those values

#### Scenario: Sold without money is refused

- **GIVEN** an inventory unit in `in-stock`
- **WHEN** an authorized inventory admin sets state to `auction-sold` without price
  or currency
- **THEN** Grade10 refuses the write
- **AND** the unit is unchanged

#### Scenario: Money on a non-sold state is refused

- **GIVEN** an inventory unit in `in-stock`
- **WHEN** an authorized inventory admin sets a sold price while state stays
  `in-stock`
- **THEN** Grade10 refuses the write
- **AND** the unit is unchanged

#### Scenario: State change on a reserved unit is refused

- **GIVEN** an `in-stock` unit actively reserved by Auction
- **WHEN** an authorized inventory admin sets its state to `auction-sold` with valid money
- **THEN** Grade10 refuses the write
- **AND** the unit and reservation are unchanged

### Requirement: Operators add inventory units by quantity

An authorized inventory admin SHALL add inventory units for an existing
product by supplying a positive integer quantity and the shared create
fields (name, optional remarks). Grade10 SHALL create that many unit records
in one action, each with state `in-stock`, no active reservation, null sold money, and added by
set to that operator. Quantity SHALL be at least 1 and at most 500 per
action. Adding units for an unknown product SHALL be refused.

#### Scenario: Operator adds three units

- **GIVEN** an existing product
- **WHEN** an authorized inventory admin adds quantity three with a valid name
- **THEN** three unreserved `in-stock` units exist for that product
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

An authorized inventory admin SHALL update an existing unit’s name, state,
sold money (subject to the sold rules), and remarks. An authorized inventory
admin SHALL delete an unreserved unit whose state is `in-stock` or
`withdrawn` and which has never been assigned to a reservation. Delete of an
actively or previously reserved unit, or an `auction-sold` unit, SHALL be
refused. Delete SHALL remove the unit record and SHALL append a change-history
entry for that deletion.

#### Scenario: Operator edits a unit name

- **GIVEN** an inventory unit
- **WHEN** an authorized inventory admin changes its name
- **THEN** Grade10 persists the new name
- **AND** updated at advances

#### Scenario: Operator deletes an unreserved in-stock unit

- **GIVEN** an unreserved inventory unit in `in-stock`
- **WHEN** an authorized inventory admin deletes it
- **THEN** the unit is gone
- **AND** a change-history entry records the delete

#### Scenario: Delete of an auction-sold unit is refused

- **GIVEN** an inventory unit in `auction-sold`
- **WHEN** an authorized inventory admin deletes it
- **THEN** Grade10 refuses the delete
- **AND** the unit remains

#### Scenario: Delete of a reserved unit is refused

- **GIVEN** an `in-stock` inventory unit actively reserved by Vault
- **WHEN** an authorized inventory admin deletes it
- **THEN** Grade10 refuses the delete
- **AND** the unit and reservation remain

#### Scenario: Delete of a previously reserved unit is refused

- **GIVEN** an `in-stock` inventory unit whose reservation was released
- **WHEN** an authorized inventory admin deletes it
- **THEN** Grade10 refuses the delete
- **AND** the unit and released reservation history remain

### Requirement: Operators list inventory unit ids for a product

An authorized inventory admin SHALL list every inventory unit id for a given
product, including reserved units and units that are not `in-stock`. The list for an unknown
product SHALL be not found.

#### Scenario: Admin unit ids include held and sold units

- **GIVEN** a product with one unreserved `in-stock` unit, one unit held by Auction, and one `auction-sold` unit
- **WHEN** an authorized inventory admin lists unit ids for that product
- **THEN** all three ids are returned

### Reservations

---

### Requirement: Reservation records explain how stock is held

A reservation SHALL assign one or more concrete inventory unit ids from one
product to exactly one holder application. Holder SHALL be `auction` or
`vault` in this capability. A reservation SHALL carry a system-minted id,
product id, holder, holder-owned reference, trimmed purpose of 1 to 200
characters, state (`active` or `released`), created at, updated
at, created actor kind and id, released at, released actor kind and id, and its
assigned unit ids. Release fields SHALL be null while active and set according
to the change-history actor rules when released. Holder and holder-owned
reference SHALL be immutable and unique together, so retrying the same request
is idempotent. A retry with different product, quantity, or purpose SHALL be
refused. Reservation quantity SHALL be an integer from 1 through 500 per
request.

#### Scenario: Auction reserves units with purpose and reference

- **GIVEN** a product with three unreserved `in-stock` units
- **WHEN** Auction reserves quantity two with purpose `listing allocation` and holder reference `listing-42`
- **THEN** one active Auction reservation assigns two distinct unit ids
- **AND** the reservation records that purpose and reference

#### Scenario: Same holder reference retries idempotently

- **GIVEN** Auction already reserved two units under holder reference `listing-42`
- **WHEN** Auction repeats the same reservation request
- **THEN** Grade10 returns the existing reservation and unit ids
- **AND** no additional unit is reserved

#### Scenario: Reservation quantity outside the batch limit is refused

- **GIVEN** a product with sufficient available stock
- **WHEN** Auction requests quantity zero or quantity 501
- **THEN** Grade10 refuses the request
- **AND** no reservation or assignment is persisted

#### Scenario: Released holder reference never reactivates

- **GIVEN** an Auction reservation under holder reference `listing-42` is released
- **WHEN** Auction repeats the original reservation request
- **THEN** Grade10 returns the existing released reservation
- **AND** no unit becomes reserved

### Requirement: Active reservations are exclusive and conserve inventory

An `in-stock` unit SHALL have zero or one active reservation. Creating a
reservation SHALL select and assign the requested number of unreserved
`in-stock` units in one transaction. If there are too few, the complete
request SHALL be refused and no assignment SHALL be written. For every
product, the count of units in active reservations plus the count of units
available for reservation SHALL equal its stock count.
Different applications MAY reserve the same product only through disjoint
unit assignments.

#### Scenario: Auction and Vault reserve disjoint units of one product

- **GIVEN** a product with five unreserved `in-stock` units
- **WHEN** Auction reserves two and Vault reserves two
- **THEN** both reservations succeed with four distinct unit ids
- **AND** one unit remains unreserved
- **AND** active reserved count four plus available count one equals stock count five

#### Scenario: Overlapping reservation is impossible under concurrency

- **GIVEN** one unreserved `in-stock` unit
- **WHEN** Auction and Vault concurrently reserve quantity one
- **THEN** exactly one reservation succeeds
- **AND** the other is refused for insufficient available inventory
- **AND** the unit appears in only the successful reservation

#### Scenario: Insufficient stock reserves nothing

- **GIVEN** a product with one unreserved `in-stock` unit
- **WHEN** Auction reserves quantity two
- **THEN** Grade10 refuses the request
- **AND** no unit is reserved by that request

### Requirement: Holder-scoped reads hide other applications' reservations

An application SHALL reach inventory through the named service-binding
entrypoint for that holder; holder identity SHALL come from the entrypoint and
SHALL NOT be accepted as caller input. A holder SHALL read unreserved
in-stock availability and its own reservations and assigned units. It SHALL
NOT receive another holder's reservation, assigned unit id, purpose,
reference, or holder-specific count. Admin reads are exempt and SHALL expose
the complete allocation.

#### Scenario: Vault cannot see Auction-held units

- **GIVEN** Auction actively reserves two units and Vault actively reserves one unit of the same product
- **WHEN** Vault reads that product through `VaultInventoryService`
- **THEN** Vault sees its own reservation and assigned unit
- **AND** neither Auction reservation nor either Auction-held unit is returned
- **AND** the available count includes only unreserved `in-stock` units

#### Scenario: Admin sees allocation by holder

- **GIVEN** Auction and Vault each actively reserve units of one product
- **WHEN** an authorized inventory admin opens that product
- **THEN** the response shows every active reservation grouped by holder
- **AND** active reserved units plus available units equal stock count

### Requirement: Reservations release without losing their trace

The holder that owns an active reservation or an authorized inventory admin
SHALL release it. Release SHALL atomically change the reservation state to
`released` and make all of its still-`in-stock` units unreserved. A released
reservation and its assigned-unit history SHALL remain readable to admins and
invisible to other holders. Releasing a non-active reservation SHALL return
its current state without changing stock or appending a duplicate mutation.

#### Scenario: Vault releases a reservation

- **GIVEN** Vault has an active reservation containing two `in-stock` units
- **WHEN** Vault releases it
- **THEN** the reservation state is `released`
- **AND** both units become unreserved in the same transaction
- **AND** available count increases by two

#### Scenario: Another holder cannot release a reservation

- **GIVEN** Auction has an active reservation
- **WHEN** Vault attempts to release its id
- **THEN** Grade10 responds as though that reservation does not exist
- **AND** the Auction reservation remains active

### Change history

---

### Requirement: Every ledger mutation is recorded

Every successful create, update, or delete of a product or inventory unit and
every successful reservation create or release SHALL be recorded —
no successful ledger mutation may complete without a history entry. Grade10
SHALL append one domain change-history (`changelogs`) entry per mutated domain
subject in the same transaction as the mutation. A bulk add of N units SHALL
therefore append N inventory-unit entries. Reservation assignment rows are
persistence beneath the reservation subject and SHALL NOT append separate
entries.

Every changelog entry SHALL carry these fields:

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Occurred at | Server time of the successful mutation, immutable |
| Product id | Product whose ledger changed; retained when an inventory unit is deleted |
| Actor kind | One of `operator`, `application`, or `server` |
| Actor id | Operator user id for `operator`; `auction` or `vault` for `application`; null for `server` |
| Subject kind | One of `product`, `inventory-unit`, or `reservation` |
| Subject id | Id of the changed product, inventory unit, or reservation |
| Action | `create` or `update` for a product; `create`, `update`, or `delete` for an inventory unit; `reserve` or `release` for a reservation |
| Before | Canonical subject snapshot immediately before the mutation; null for `create` and `reserve` |
| After | Canonical subject snapshot immediately after the mutation; null for inventory-unit `delete` |

A product or inventory-unit snapshot SHALL contain every field of that record.
A reservation snapshot SHALL contain its id, product id, holder, holder
reference, purpose, state, created at, updated at, created actor kind and id,
released at, released actor kind and id, and assigned unit ids in stable id
order. Thus `reserve`
records null before and the active allocation after; `release` records the
same allocation first as active and then as released. Snapshot keys and
assigned unit ordering SHALL be canonical so equivalent writes serialize
identically.

An elevated operator request MAY produce one platform `audit_logs` entry while
producing several changelog entries, such as one per unit in a quantity add.
Application and server mutations write domain history only. Failed, refused,
and idempotent no-op writes SHALL NOT append a changelog or audit entry.

#### Scenario: Operator create appends history with user actor

- **GIVEN** an authorized inventory admin
- **WHEN** they create a product
- **THEN** a change-history entry exists for that product create
- **AND** actor kind is `operator` and actor id is that operator’s user id
- **AND** before is null and after is the created product snapshot

#### Scenario: Server update appends history with server actor

- **GIVEN** an inventory unit updated by an automated server path
- **WHEN** the update succeeds
- **THEN** a change-history entry exists for that unit update
- **AND** actor kind is `server` and actor id is null

#### Scenario: Unit update records before and after snapshots

- **GIVEN** an inventory unit named `Card A` in `in-stock`
- **WHEN** an authorized inventory admin renames it to `Card B`
- **THEN** one `inventory-unit` `update` entry identifies that unit and product
- **AND** before contains name `Card A` and after contains name `Card B`
- **AND** both snapshots contain the unit’s complete record

#### Scenario: Quantity add records every created unit

- **GIVEN** an existing product
- **WHEN** an authorized inventory admin adds quantity three
- **THEN** three `inventory-unit` `create` entries are appended
- **AND** each entry has null before and the distinct created unit as after

#### Scenario: Holder reservation appends history with application actor

- **GIVEN** Auction requests a valid reservation through its named entrypoint
- **WHEN** the reservation succeeds
- **THEN** one `reservation` `reserve` entry exists for that reservation
- **AND** actor kind is `application` and actor id is `auction`
- **AND** before is null
- **AND** after identifies the holder, purpose, reference, active state, and every assigned unit id

#### Scenario: Release records the custody transition

- **GIVEN** Vault has an active reservation containing two units
- **WHEN** Vault releases it
- **THEN** one `reservation` `release` entry exists for that reservation
- **AND** actor kind is `application` and actor id is `vault`
- **AND** before records the active reservation and both assigned unit ids
- **AND** after records the released reservation and the same assigned unit ids

#### Scenario: Refused write leaves history unchanged

- **GIVEN** an inventory unit
- **WHEN** an unauthorized caller attempts an update and is refused
- **THEN** no new change-history entry is appended

### Admin console

---

### Requirement: Operators manage stock from the Grade10 admin panel

The Grade10 admin panel SHALL offer an Inventory section to authorized
inventory admins. The section SHALL show a products table with stock, ledger,
available, and actively reserved counts. Choosing a product SHALL show its
inventory units and current reservations, including holder, purpose,
reference, state, and assigned unit ids. From the section an operator SHALL
add a product, add units by quantity, edit a product, edit or delete an
eligible unit, reserve units on behalf of Auction or Vault, and release an
active reservation. Loading, empty, and error states SHALL be visible when
the corresponding list or write fails or returns no rows.

#### Scenario: Operator opens a product’s units from the products table

- **GIVEN** a product with two inventory units
- **WHEN** an authorized inventory admin opens that product in Inventory
- **THEN** both units are listed

#### Scenario: Operator oversees where units are held

- **GIVEN** a product with active Auction and Vault reservations
- **WHEN** an authorized inventory admin opens that product in Inventory
- **THEN** each reservation shows its holder, purpose, reference, and assigned unit ids
- **AND** available plus active reserved reconciles to stock count
- **AND** stock plus sold and withdrawn reconciles to ledger count

#### Scenario: Empty products table

- **GIVEN** no products
- **WHEN** an authorized inventory admin opens Inventory
- **THEN** the products table shows an empty state

#### Scenario: Add units form submits quantity

- **GIVEN** an existing product open in Inventory
- **WHEN** an authorized inventory admin adds quantity two with a valid name
- **THEN** two new units appear on that product’s unit list

#### Scenario: Operator reserves and releases on behalf of a holder

- **GIVEN** a product with two unreserved `in-stock` units
- **WHEN** an authorized inventory admin reserves them for Vault with a purpose and reference
- **THEN** the Vault reservation appears in the allocation view
- **WHEN** the operator releases that reservation
- **THEN** both units return to the unreserved count

### Access

---

### Requirement: Global inventory APIs and console are admin-only

Inventory read and write SHALL require inventory admin grants. A signed-in
person who lacks those grants SHALL be refused every inventory procedure and
SHALL NOT see the Inventory section. Collector and public callers SHALL have
no inventory surface in this capability. Holder-scoped service-binding
entrypoints are machine-only capability grants and SHALL NOT be reachable
through the public API gateway.

#### Scenario: Unauthorized list products is refused

- **GIVEN** a signed-in person without inventory admin grants
- **WHEN** they request the product list
- **THEN** Grade10 refuses the request

#### Scenario: Inventory section hidden without grants

- **GIVEN** a signed-in person without inventory admin grants
- **WHEN** they use the Grade10 admin panel
- **THEN** the Inventory section is not offered

#### Scenario: Public caller cannot reach holder reservation methods

- **GIVEN** a collector or unauthenticated caller
- **WHEN** they request an inventory HTTP route
- **THEN** no reserve, release, or holder-scoped read method is exposed
