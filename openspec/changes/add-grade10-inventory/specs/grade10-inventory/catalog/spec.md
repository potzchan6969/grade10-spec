# grade10-inventory/catalog Specification

## Purpose

Gives Grade10 one current stock snapshot per catalogue product, quantity-based
application reservations, admin oversight of where stock is held, and an
append-only trace of every count transition.

## Feature set

- Product stock
  - Product record: descriptive identity for house-managed stock
  - Inventory snapshot: latest stock, reserved, sold, withdrawn, and ledger counts
  - Intake: add received quantity to the product's existing inventory
  - Terminal transitions: move available stock to sold or withdrawn
- Application holds
  - Quantity reservation: hold part of one product for Auction or Vault
  - Conservation: prevent active reservations from exceeding stock
  - Scoped access: expose availability and only the calling application's holds
  - Admin oversight: show allocation totals and purpose/reference across holders
- Change history
  - Mutation trace: record typed actors, actions, quantities, and before/after snapshots
- Admin console
  - Inventory management: browse products, counts, reservations, and history
  - Operator writes: create, edit, intake, sell, withdraw, reserve, and release

## User journeys

### catalog-US-01: Record received stock

As an inventory admin, I want to intake a quantity into a product's inventory,
so that the current snapshot and lifetime ledger reflect what Grade10 accepted.

Accepted by: catalog-SC-01, catalog-SC-05, catalog-SC-06, catalog-SC-07.

### catalog-US-02: Allocate stock to an application

As an inventory admin, I want to see and manage Auction and Vault holds, so
that the same stock cannot be promised beyond the quantity Grade10 owns.

Accepted by: catalog-SC-14, catalog-SC-17, catalog-SC-18, catalog-SC-22.

### catalog-US-03: Use inventory through a holder boundary

As a consuming application, I want to reserve and release my quantity without
seeing another application's holds, so that I can safely use my allocation.

Accepted by: catalog-SC-15, catalog-SC-16, catalog-SC-19, catalog-SC-20,
catalog-SC-21.

### catalog-US-04: Reconstruct stock changes

As an inventory admin, I want every stock and reservation transition recorded,
so that I can explain how the latest snapshot was reached.

Accepted by: catalog-SC-23, catalog-SC-24, catalog-SC-25, catalog-SC-26,
catalog-SC-27, catalog-SC-28.

## ADDED Requirements

### Product stock

---

### Requirement: Product record fields

A product SHALL carry the fields below. Creating a product SHALL also create
its one inventory snapshot with every count set to zero.

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Name | Trimmed, 1 to 200 characters |
| Description | Trimmed text, may be empty |
| Created at | Set on create, immutable |
| Updated at | Set on every successful product update |
| Created by | Operator user id at create, immutable |
| Remarks | Trimmed text, may be empty |

#### Scenario: catalog-SC-01 - Operator creates a product with empty inventory

- **GIVEN** an authorized inventory admin
- **WHEN** they create a product with a valid name
- **THEN** Grade10 persists the product with a new id
- **AND** creates exactly one inventory snapshot whose counts are zero
- **AND** created by is that operator

#### Scenario: catalog-SC-02 - Product create without a name is refused

- **GIVEN** an authorized inventory admin
- **WHEN** they create a product with an empty name
- **THEN** Grade10 refuses the create
- **AND** no product or inventory is persisted

### Requirement: Product inventory snapshot fields

Each product SHALL own exactly one inventory snapshot. It SHALL contain the
latest counts below; quantities SHALL be non-negative whole numbers.

| Field | Rules |
| --- | --- |
| Product id | The product identity; unique and immutable |
| Stock count | Quantity currently in stock, including available and reserved stock |
| Reserved count | Sum of quantities in active reservations |
| Available count | Derived as stock count minus reserved count |
| Sold count | Cumulative quantity moved from stock to sold |
| Withdrawn count | Cumulative quantity moved from stock to withdrawn |
| Ledger count | Lifetime quantity admitted through intake |
| Created at | Set with the product, immutable |
| Updated at | Set on every successful inventory transition |

At all times, `available count + reserved count = stock count`, and `stock
count + sold count + withdrawn count = ledger count`. Ledger count SHALL
never decrease.

#### Scenario: catalog-SC-03 - Counts reconcile across current and terminal stock

- **GIVEN** an inventory with stock count five, reserved count two, sold count three, and withdrawn count one
- **WHEN** an authorized inventory admin reads it
- **THEN** available count is three
- **AND** ledger count is nine

#### Scenario: catalog-SC-04 - Product owns only one inventory

- **GIVEN** an existing product and inventory
- **WHEN** more stock is received for that product
- **THEN** Grade10 updates the existing inventory
- **AND** no second inventory is created

### Requirement: Intake adds to the existing inventory

An authorized inventory admin SHALL intake a positive integer quantity from 1
through 500 into an existing product. Intake SHALL increase stock count and
ledger count by that quantity in one transaction. It SHALL NOT change reserved,
sold, or withdrawn counts. Intake for an unknown product SHALL be refused.

#### Scenario: catalog-SC-05 - Operator intakes three

- **GIVEN** a product with stock count two and ledger count four
- **WHEN** an authorized inventory admin intakes quantity three
- **THEN** the same inventory has stock count five and ledger count seven
- **AND** reserved, sold, and withdrawn counts are unchanged

#### Scenario: catalog-SC-06 - Repeated intakes accumulate in one inventory

- **GIVEN** a product whose inventory counts are zero
- **WHEN** an authorized inventory admin intakes two and later intakes three
- **THEN** the product still has one inventory
- **AND** stock count and ledger count are both five

#### Scenario: catalog-SC-07 - Intake appends one quantity change

- **GIVEN** an existing product
- **WHEN** an authorized inventory admin intakes quantity ten
- **THEN** one `intake` change is appended with quantity ten
- **AND** its before and after snapshots show stock and ledger increasing by ten

#### Scenario: catalog-SC-08 - Invalid intake quantity is refused

- **GIVEN** an existing product
- **WHEN** an authorized inventory admin intakes quantity zero or quantity 501
- **THEN** Grade10 refuses the intake
- **AND** the inventory and history are unchanged

#### Scenario: catalog-SC-09 - Intake for unknown product is refused

- **GIVEN** no product with the requested id
- **WHEN** an authorized inventory admin intakes stock for that id
- **THEN** Grade10 answers not found

### Requirement: Available stock moves to terminal counts

An authorized inventory admin SHALL move a positive quantity of available
stock to sold or withdrawn. A sale SHALL carry a positive integer total price
in minor units and an ISO 4217 currency code. A withdrawal SHALL carry a
non-empty reason. Either transition SHALL reduce stock count and increase its
terminal count by the same quantity, leaving ledger count unchanged.

A sale or withdrawal exceeding available count SHALL be refused. Reserved
quantity SHALL be released before it can leave stock. Sold and withdrawn
counts SHALL NOT be decremented in this capability.

#### Scenario: catalog-SC-10 - Operator records a sale

- **GIVEN** an inventory with stock count five and reserved count one
- **WHEN** an authorized inventory admin sells quantity two for 10000 minor units in HKD
- **THEN** stock count decreases to three and sold count increases by two
- **AND** reserved count and ledger count are unchanged

#### Scenario: catalog-SC-11 - Operator records a withdrawal

- **GIVEN** an inventory with three available stock
- **WHEN** an authorized inventory admin withdraws quantity one with a reason
- **THEN** stock count decreases by one and withdrawn count increases by one
- **AND** ledger count is unchanged

#### Scenario: catalog-SC-12 - Terminal transition cannot consume reserved stock

- **GIVEN** an inventory with stock count three and reserved count two
- **WHEN** an authorized inventory admin sells or withdraws quantity two
- **THEN** Grade10 refuses the transition for insufficient available stock
- **AND** every count and active reservation is unchanged

### Requirement: Operators list and edit products

An authorized inventory admin SHALL list every product with stock, ledger,
available, reserved, sold, and withdrawn counts. They SHALL update a product's
name, description, and remarks without changing inventory counts, id, created
at, or created by. An update SHALL refresh product updated at.

#### Scenario: catalog-SC-13 - Operator lists products with aggregate counts

- **GIVEN** two products with different inventory snapshots
- **WHEN** an authorized inventory admin lists products
- **THEN** both products appear with all six counts
- **AND** each row's counts satisfy both reconciliation equations

### Application holds

---

### Requirement: Reservation record fields

A reservation SHALL assign a quantity of exactly one product to one holder
application. Holder SHALL be `auction` or `vault` in this capability.

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Product id | Required and immutable |
| Holder | `auction` or `vault`, immutable |
| Holder reference | Non-empty holder-owned idempotency reference, immutable |
| Purpose | Trimmed, 1 to 200 characters |
| Quantity | Integer from 1 through 500, immutable |
| State | `active` or `released` |
| Created at | Set on reserve, immutable |
| Updated at | Set on reserve and release |
| Created actor kind and id | Actor that reserved the quantity |
| Released at | Null while active; set on release |
| Released actor kind and id | Null while active; actor that released it |

Holder and holder reference SHALL be unique together. Retrying the same
product, quantity, and purpose SHALL return the existing reservation. A retry
with a differing payload SHALL be refused. A released reference SHALL return
the released reservation and SHALL NOT reactivate it.

#### Scenario: catalog-SC-14 - Auction reserves a quantity

- **GIVEN** a product with available count three
- **WHEN** Auction reserves quantity two with purpose `listing allocation` and holder reference `listing-42`
- **THEN** one active Auction reservation records quantity two
- **AND** reserved count increases by two while stock and ledger remain unchanged

#### Scenario: catalog-SC-15 - Same holder reference retries idempotently

- **GIVEN** Auction already reserved quantity two under holder reference `listing-42`
- **WHEN** Auction repeats the same reservation request
- **THEN** Grade10 returns the existing reservation
- **AND** reserved count and history do not change

#### Scenario: catalog-SC-16 - Released holder reference never reactivates

- **GIVEN** an Auction reservation under holder reference `listing-42` is released
- **WHEN** Auction repeats the original reservation request
- **THEN** Grade10 returns the released reservation
- **AND** reserved count does not change

### Requirement: Active reservations conserve aggregate stock

Creating a reservation SHALL atomically increase reserved count by its
quantity only when that quantity does not exceed available count. If there is
too little available stock, the complete request SHALL be refused. For each
product, reserved count SHALL equal the sum of quantities in active
reservations. Different holders MAY reserve the same product.

#### Scenario: catalog-SC-17 - Auction and Vault reserve the same product

- **GIVEN** a product with stock count five and no reservations
- **WHEN** Auction reserves two and Vault reserves two
- **THEN** both reservations succeed
- **AND** reserved count is four and available count is one

#### Scenario: catalog-SC-18 - Concurrent reservations cannot oversubscribe stock

- **GIVEN** a product with available count one
- **WHEN** Auction and Vault concurrently reserve quantity one
- **THEN** exactly one reservation succeeds
- **AND** the other is refused for insufficient available inventory
- **AND** reserved count and the sum of active reservation quantities are one

#### Scenario: catalog-SC-19 - Insufficient stock reserves nothing

- **GIVEN** a product with available count one
- **WHEN** Auction reserves quantity two
- **THEN** Grade10 refuses the request
- **AND** no reservation, count, or history change is written

### Requirement: Holder-scoped reads hide other applications

An application SHALL reach inventory through the named service entrypoint for
that holder; holder identity SHALL NOT be caller input. A holder SHALL read
available count and its own reservations. It SHALL NOT receive stock count,
ledger count, aggregate reserved count, another holder's reservation quantity,
purpose, or reference. Admin reads SHALL expose the complete allocation.

#### Scenario: catalog-SC-20 - Vault cannot see Auction reservations

- **GIVEN** Auction reserves two and Vault reserves one of the same product
- **WHEN** Vault reads that product through its holder entrypoint
- **THEN** Vault sees available count and its own quantity-one reservation
- **AND** no Auction reservation, quantity, purpose, or reference is returned

#### Scenario: catalog-SC-21 - Another holder cannot release a reservation

- **GIVEN** Auction has an active reservation
- **WHEN** Vault attempts to release its id
- **THEN** Grade10 responds as though the reservation does not exist
- **AND** the Auction reservation and reserved count remain unchanged

### Requirement: Reservations release their full quantity

The owning holder or an authorized inventory admin SHALL release an active
reservation. Release SHALL atomically mark it released and decrease reserved
count by its quantity. Stock and ledger counts SHALL remain unchanged.
Releasing a non-active reservation SHALL return its current state without
changing counts or appending duplicate history. Partial release is not
supported.

#### Scenario: catalog-SC-22 - Vault releases a reservation

- **GIVEN** Vault has an active reservation of quantity two
- **WHEN** Vault releases it
- **THEN** the reservation becomes released
- **AND** reserved count decreases by two and available count increases by two
- **AND** stock and ledger counts remain unchanged

### Change history

---

### Requirement: Change history fields identify every transition

Every successful product or inventory mutation SHALL append one domain change
entry in the same transaction. Each entry SHALL carry:

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Occurred at | Server time of the successful mutation, immutable |
| Product id | Product whose catalogue or inventory changed |
| Actor kind | `operator`, `application`, or `server` |
| Actor id | Operator user id; `auction` or `vault`; null for server |
| Action | `product-create`, `product-update`, `intake`, `reserve`, `release`, `sell`, or `withdraw` |
| Quantity | Positive transition quantity for inventory actions; null for product actions |
| Reservation id | Required for reserve/release; null otherwise |
| Sold total price | Positive integer minor units for sell; null otherwise |
| Sold currency | ISO 4217 code for sell; null otherwise |
| Reason | Required for withdraw; optional remarks for intake; null otherwise |
| Before | Canonical snapshot immediately before; null for product-create |
| After | Canonical snapshot immediately after |

Product actions SHALL snapshot the complete product. Inventory actions SHALL
snapshot the complete inventory and, for reserve/release, the affected
reservation. Reserve SHALL show a null reservation before and an active one
after. Release SHALL show that reservation active before and released after.
Snapshot keys SHALL be canonical.

An elevated operator request SHALL also append one platform audit entry.
Application and server mutations write domain history only. Failed, refused,
and idempotent no-op writes SHALL append neither history nor audit.

#### Scenario: catalog-SC-23 - Product update records operator and snapshots

- **GIVEN** an existing product named `Card A`
- **WHEN** an authorized inventory admin renames it to `Card B`
- **THEN** one `product-update` change identifies the operator
- **AND** before contains `Card A` and after contains `Card B`

#### Scenario: catalog-SC-24 - Intake history carries the added quantity

- **GIVEN** an inventory with stock count two and ledger count two
- **WHEN** an authorized inventory admin intakes quantity three
- **THEN** one `intake` change records quantity three
- **AND** before records both counts as two and after records both as five

#### Scenario: catalog-SC-25 - Reserve history records allocation and snapshot

- **GIVEN** Auction requests a valid quantity-two reservation
- **WHEN** the reservation succeeds
- **THEN** one `reserve` change records quantity two and the reservation id
- **AND** actor kind is `application` and actor id is `auction`
- **AND** before and after show reserved count increasing by two

#### Scenario: catalog-SC-26 - Release history records allocation and snapshot

- **GIVEN** Vault has an active quantity-two reservation
- **WHEN** Vault releases it
- **THEN** one `release` change records quantity two and the reservation id
- **AND** before and after show reserved count decreasing by two
- **AND** the reservation snapshot changes from active to released

#### Scenario: catalog-SC-27 - Terminal history records action details

- **GIVEN** an inventory with available stock
- **WHEN** an authorized inventory admin records a sale and later a withdrawal
- **THEN** the sell change records its quantity, total price, and currency
- **AND** the withdraw change records its quantity and reason
- **AND** both changes show stock decreasing while ledger stays unchanged

#### Scenario: catalog-SC-28 - Refused write leaves history unchanged

- **GIVEN** an existing product
- **WHEN** an unauthorized caller attempts an intake and is refused
- **THEN** no history or audit entry is appended

### Admin console

---

### Requirement: Operators manage aggregate inventory from the admin panel

The Grade10 admin panel SHALL offer an Inventory section to authorized
inventory admins. The products table SHALL show stock, ledger, available,
reserved, sold, and withdrawn counts. Product detail SHALL show the current
snapshot, reservations grouped by holder, and change history. Operators SHALL
create and edit products, intake quantity, record sale or withdrawal, reserve
for Auction or Vault, and release active reservations. Loading, empty, and
error states SHALL be visible.

#### Scenario: catalog-SC-29 - Operator oversees inventory and allocation

- **GIVEN** a product with Auction and Vault reservations and prior terminal transitions
- **WHEN** an authorized inventory admin opens that product
- **THEN** all counts, both holders' reservations, and change history appear
- **AND** both count equations reconcile

#### Scenario: catalog-SC-30 - Empty products table

- **GIVEN** no products
- **WHEN** an authorized inventory admin opens Inventory
- **THEN** the products table shows an empty state

#### Scenario: catalog-SC-31 - Intake form updates the snapshot

- **GIVEN** an existing product open in Inventory
- **WHEN** an authorized inventory admin intakes quantity two
- **THEN** its stock and ledger counts each increase by two
- **AND** one intake entry appears in history

### Access

---

### Requirement: Global inventory APIs and console are admin-only

Global inventory reads and writes SHALL require inventory admin grants. A
signed-in person without those grants SHALL be refused and SHALL NOT see the
Inventory section. Holder-scoped service entrypoints are machine-only
capability grants and SHALL NOT be reachable through the public API gateway.

#### Scenario: catalog-SC-32 - Unauthorized inventory read is refused

- **GIVEN** a signed-in person without inventory admin grants
- **WHEN** they request the product list
- **THEN** Grade10 refuses the request

#### Scenario: catalog-SC-33 - Inventory section hidden without grants

- **GIVEN** a signed-in person without inventory admin grants
- **WHEN** they use the Grade10 admin panel
- **THEN** the Inventory section is not offered

#### Scenario: catalog-SC-34 - Public caller cannot reach holder methods

- **GIVEN** a collector or unauthenticated caller
- **WHEN** they request an inventory HTTP route
- **THEN** no reserve, release, or holder-scoped read method is exposed
