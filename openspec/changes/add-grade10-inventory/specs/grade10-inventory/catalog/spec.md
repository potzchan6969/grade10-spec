# grade10-inventory/catalog Specification

## Purpose

Gives Grade10 house stock per catalogue product — one or more inventory
stock-up rows with a stored vaulted partition, quantity-based application
reservations (header + allocations) that track remaining / sold / vaulted /
released, admin oversight by explicit `holder_kind`, and an append-only
trace of every count transition.

## Feature set

- Product stock
  - Product record: descriptive identity; lifecycle `draft` | `created`
  - Inventory snapshot(s): operators create and edit rows under a product;
    stored stock, reserved, vaulted, sold, withdrawn; derived available and
    ledger; inventory `status` `stocked` | `ready`
  - Intake: add received quantity to a chosen inventory row
  - Terminal transitions: move available stock to sold or withdrawn; move
    reservation remaining to sold (Auction) or vaulted (Vault)
- Application holds
  - Reservation classified by `holder_kind` (`auction` | `vault`)
  - Allocations pin a hold across one or more inventory rows
  - Remaining quantity: know how much of a hold is still reserved
  - Partial sell / vault / release / adjust against remaining
  - Re-reserve after close with the same kind + reference
  - Conservation: active remaining cannot exceed **ready** available
  - Scoped access: expose availability and only the calling kind's holds
- Change history
  - Mutation trace: typed actors, actions, quantities, before/after snapshots
- Admin console
  - Products list, product page, and inventory page
  - Create/edit products (`draft` → `created`); create/edit inventories under
    a product; intake, status, sell, withdraw, reserve, adjust, release,
    sell-from-reservation, vault-from-reservation; history

## User journeys

### catalog-US-01: Record received stock

As an inventory admin, I want to create a product, add inventory rows under it,
and intake quantity into a chosen inventory, so that the snapshot and derived
lifetime ledger reflect what Grade10 accepted.

Accepted by: catalog-SC-01, catalog-SC-04, catalog-SC-05, catalog-SC-06,
catalog-SC-07, catalog-SC-52, catalog-SC-54.

### catalog-US-02: Allocate, adjust, and partially settle holds

As an inventory admin, I want to see Auction and Vault holds with remaining
quantity, adjust a hold’s quantity when a draft listing changes (e.g. 3 → 5 or
5 → 2), and allow part of a hold to be sold, vaulted, or released, so that
house stock is not over-promised and vaulted stock is counted separately from
sold stock. Only **ready** inventory participates in reserve, adjust-up, sell,
vault, and free-pool sell/withdraw.

Accepted by: catalog-SC-14, catalog-SC-17, catalog-SC-18, catalog-SC-22,
catalog-SC-35, catalog-SC-36, catalog-SC-37, catalog-SC-38, catalog-SC-44,
catalog-SC-47, catalog-SC-48, catalog-SC-49, catalog-SC-50, catalog-SC-51,
catalog-SC-53.

### catalog-US-03: Use inventory through a holder-kind boundary

As a consuming application, I want to reserve, partially settle, and release my
quantity without seeing another kind's holds, so that I can safely use my
allocation. Auction sells; Vault vaults.

Accepted by: catalog-SC-15, catalog-SC-16, catalog-SC-19, catalog-SC-20,
catalog-SC-21, catalog-SC-39, catalog-SC-40, catalog-SC-61, catalog-SC-62.

### catalog-US-04: Reconstruct stock changes

As an inventory admin, I want every stock and reservation transition recorded,
so that I can explain how the latest snapshot was reached.

Accepted by: catalog-SC-23, catalog-SC-24, catalog-SC-25, catalog-SC-26,
catalog-SC-27, catalog-SC-28, catalog-SC-41, catalog-SC-42.

## ADDED Requirements

### Product stock

---

### Requirement: Product record fields

A product SHALL carry the fields below. Creating a product SHALL start it in
state `draft` with **no** inventory rows. An authorized inventory admin SHALL
create inventory rows under the product explicitly. An authorized inventory
admin SHALL be able to mark a `draft` product `created`. Marking `created`
SHALL be one-way in this capability (`created` → `draft` is refused). Holder
reserve, adjust-up, and new allocations SHALL require product state
`created`; inventory intake, status-change, and free-pool sell/withdraw MAY
run while the product is still `draft`.

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Name | Trimmed, 1 to 200 characters |
| Description | Trimmed text, may be empty |
| State | `draft` or `created`; create defaults to `draft` |
| Created at | Set on create, immutable |
| Updated at | Set on every successful product update or state change |
| Created by | Operator user id at create, immutable |
| Remarks | Trimmed text, may be empty |

#### Scenario: catalog-SC-01 - Operator creates a draft product with no inventory

- **GIVEN** an authorized inventory admin
- **WHEN** they create a product with a valid name
- **THEN** Grade10 persists the product with a new id and state `draft`
- **AND** creates no inventory rows
- **AND** created by is that operator

#### Scenario: catalog-SC-02 - Product create without a name is refused

- **GIVEN** an authorized inventory admin
- **WHEN** they create a product with an empty name
- **THEN** Grade10 refuses the create
- **AND** no product or inventory is persisted

#### Scenario: catalog-SC-52 - Operator marks a draft product created

- **GIVEN** a draft product
- **WHEN** an authorized inventory admin marks it created
- **THEN** product state is `created`
- **AND** updated at advances
- **AND** one `product-update` (or dedicated state-change) history entry
  records the transition

#### Scenario: catalog-SC-53 - Holder cannot reserve a draft product

- **GIVEN** a draft product with a ready inventory that has available stock
- **WHEN** Auction reserves quantity one
- **THEN** Grade10 refuses because the product is not created
- **AND** no reservation or allocation is written

#### Scenario: catalog-SC-54 - Created to draft is refused

- **GIVEN** a created product
- **WHEN** an authorized inventory admin attempts to set state to `draft`
- **THEN** Grade10 refuses the change
- **AND** state remains `created`

### Requirement: Product inventory snapshot fields

A product MAY own zero or more inventory snapshot rows (separate stock-ups).
An authorized inventory admin SHALL create an inventory under a product and
SHALL edit that inventory’s `status` (and remarks when present). Creating a
product SHALL NOT create an inventory. The schema MUST NOT enforce uniqueness
of `product_id`.

Each inventory row SHALL contain the latest counts below; quantities SHALL be
non-negative whole numbers.

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Product id | Required and immutable; not unique across inventories |
| Status | `stocked` or `ready`; `stocked` means on hand after intake but not usable for reserve, adjust-up, sell-from-reservation, vault-from-reservation, free-pool sell, or withdraw; `ready` means the row may take those actions |
| Stock | Quantity currently on hand on this row, including available and reserved; stored; app-updated under lock |
| Reserved | Held quantity on this row; stored; app-updated under lock to match allocation remaining |
| Available | Derived as stock minus reserved (not stored) |
| Vaulted | Cumulative quantity vaulted from this row; stored; app-updated under lock |
| Sold | Cumulative quantity sold from this row; stored; app-updated under lock |
| Withdrawn | Cumulative quantity withdrawn from this row; stored; app-updated under lock |
| Ledger | Derived as stock + sold + withdrawn + vaulted (not stored); lifetime intaken |
| Remarks | Trimmed text, may be empty; editable |
| Created at | Set with the row, immutable |
| Updated at | Set on every successful inventory transition or edit |

At all times on a row, `available + reserved = stock`, and derived
`ledger = stock + sold + withdrawn + vaulted`. Sold, withdrawn, and vaulted
SHALL never decrease. Stock, reserved, sold, vaulted, and withdrawn SHALL be
written by the inventory service in the same locked transaction as the
mutation — not by database triggers that sync counters from allocations.
Holder-facing product available SHALL be the sum of each **`ready`** row’s
available on products in state **`created`**. `stocked` rows SHALL NOT
contribute to reservable availability and SHALL NOT receive new reservation
allocations, increase-adjust acquisitions, sell-from-reservation,
vault-from-reservation, free-pool sell, or withdraw. Intake and status-change
MAY target a `stocked` row. Release and decrease-adjust MAY free remaining on
lines that already exist (those lines were created while the row was ready).

Creating an inventory SHALL set every stored count to zero and SHALL require
an initial `status` of `stocked` or `ready` (default `ready`). An authorized
inventory admin SHALL be able to set an inventory’s status to `stocked` or
`ready` and edit remarks. Changing `ready` → `stocked` SHALL be refused while
that row’s reserved is greater than zero.

#### Scenario: catalog-SC-03 - Counts reconcile across current and terminal stock

- **GIVEN** an inventory with stock five, reserved two, vaulted
  one, sold three, and withdrawn one
- **WHEN** an authorized inventory admin reads it
- **THEN** available is three
- **AND** derived ledger is ten

#### Scenario: catalog-SC-04 - Operator creates inventory under a product

- **GIVEN** a draft or created product with no inventories
- **WHEN** an authorized inventory admin creates an inventory with status
  `ready`
- **THEN** Grade10 persists an inventory with zero counts and that status
- **AND** the product still has exactly one inventory
- **AND** the schema permits additional inventory rows for the same
  product_id (no uniqueness constraint)

#### Scenario: catalog-SC-55 - Operator creates a second inventory under the same product

- **GIVEN** a product that already has one inventory
- **WHEN** an authorized inventory admin creates another inventory with
  status `stocked`
- **THEN** the product has two inventory rows
- **AND** the new row has zero counts and status `stocked`

#### Scenario: catalog-SC-56 - Operator edits inventory remarks and status

- **GIVEN** a ready inventory with reserved zero
- **WHEN** an authorized inventory admin sets status to `stocked` and updates
  remarks
- **THEN** status is `stocked` and remarks match the input
- **AND** counts are unchanged

#### Scenario: catalog-SC-44 - Stocked inventory is not reservable

- **GIVEN** a **created** product whose only inventory is `stocked` with stock
  five and reserved zero
- **WHEN** Auction reserves quantity one
- **THEN** Grade10 refuses for insufficient reservable inventory
- **AND** no reservation or allocation is written

#### Scenario: catalog-SC-45 - Marking inventory ready enables reserve

- **GIVEN** a **created** product whose inventory is `stocked` with stock three
- **WHEN** an authorized inventory admin sets status to `ready`
- **AND** Auction then reserves quantity two
- **THEN** the reservation succeeds against that inventory
- **AND** reserved is two

#### Scenario: catalog-SC-46 - Cannot stock a row that still has reservations

- **GIVEN** a `ready` inventory with reserved two
- **WHEN** an authorized inventory admin sets status to `stocked`
- **THEN** Grade10 refuses the status change
- **AND** status remains `ready`

### Requirement: Intake adds to a chosen inventory

An authorized inventory admin SHALL intake a positive integer quantity from 1
through 500 into an existing inventory by id. Intake SHALL increase that
row’s stock by that quantity in one transaction (derived ledger rises by the
same amount). It SHALL NOT change reserved, vaulted, sold, or withdrawn.
Intake for an unknown inventory SHALL be refused. Product-level intake without
an inventory id SHALL be refused when the product has zero or more than one
inventory; with exactly one inventory, admin convenience MAY resolve to that
row.

#### Scenario: catalog-SC-05 - Operator intakes three

- **GIVEN** an inventory with stock two and derived ledger four
- **WHEN** an authorized inventory admin intakes quantity three into that
  inventory
- **THEN** that inventory has stock five and derived ledger seven
- **AND** reserved, vaulted, sold, and withdrawn are unchanged

#### Scenario: catalog-SC-06 - Repeated intakes accumulate on the chosen inventory

- **GIVEN** a product with one inventory whose counts are zero
- **WHEN** an authorized inventory admin intakes two and later intakes three
  into that inventory
- **THEN** the product still has one inventory
- **AND** stock is five and derived ledger is five

#### Scenario: catalog-SC-07 - Intake appends one quantity change

- **GIVEN** an existing inventory
- **WHEN** an authorized inventory admin intakes quantity ten into it
- **THEN** one `intake` change is appended with quantity ten
- **AND** its before and after snapshots show stock increasing by ten (derived ledger likewise)

#### Scenario: catalog-SC-08 - Invalid intake quantity is refused

- **GIVEN** an existing inventory
- **WHEN** an authorized inventory admin intakes quantity zero or quantity 501
- **THEN** Grade10 refuses the intake
- **AND** the inventory and history are unchanged

#### Scenario: catalog-SC-09 - Intake for unknown inventory is refused

- **GIVEN** no inventory with the requested id
- **WHEN** an authorized inventory admin intakes stock for that id
- **THEN** Grade10 answers not found

### Requirement: Available stock moves to terminal counts

An authorized inventory admin SHALL move a positive quantity of **ready**
available stock to sold or withdrawn. Free-pool sell and withdraw SHALL target
a `ready` inventory row only; the same actions on a `stocked` row SHALL be
refused. A sale SHALL carry a positive integer total price in minor units and
an ISO 4217 currency code. A withdrawal SHALL carry a non-empty reason. Either
transition SHALL reduce stock and increase its terminal count by the same
quantity, leaving derived ledger unchanged.

A sale or withdrawal exceeding that row’s available SHALL be refused. Reserved
quantity SHALL be released or settled through the reservation before it can
leave stock via these free-pool transitions. Sold, withdrawn, and vaulted
counts SHALL NOT be decremented in this capability.

#### Scenario: catalog-SC-10 - Operator records a sale

- **GIVEN** a **ready** inventory with stock five and reserved one
- **WHEN** an authorized inventory admin sells quantity two for 10000 minor units in HKD
- **THEN** stock decreases to three and sold increases by two
- **AND** reserved, vaulted, and derived ledger are unchanged

#### Scenario: catalog-SC-11 - Operator records a withdrawal

- **GIVEN** a **ready** inventory with three available stock
- **WHEN** an authorized inventory admin withdraws quantity one with a reason
- **THEN** stock decreases by one and withdrawn increases by one
- **AND** derived ledger is unchanged

#### Scenario: catalog-SC-12 - Terminal transition cannot consume reserved stock

- **GIVEN** a **ready** inventory with stock three and reserved two
- **WHEN** an authorized inventory admin sells or withdraws quantity two
- **THEN** Grade10 refuses the transition for insufficient available stock
- **AND** every count and active reservation is unchanged

#### Scenario: catalog-SC-51 - Stocked inventory cannot free-pool sell or withdraw

- **GIVEN** a `stocked` inventory with stock five and reserved zero
- **WHEN** an authorized inventory admin attempts a free-pool sale or withdrawal
- **THEN** Grade10 refuses because the inventory is not ready
- **AND** every count is unchanged

### Requirement: Operators list and edit products

An authorized inventory admin SHALL list every product with state, aggregate
stock, derived ledger, available, reserved, vaulted, sold, and withdrawn
(sums across that product’s inventories). They SHALL update a product's name,
description, and remarks without changing inventory counts, id, created at,
created by, or state. An update SHALL refresh product updated at. Marking
`draft` → `created` is a separate write (catalog-SC-52).

#### Scenario: catalog-SC-13 - Operator lists products with aggregate counts

- **GIVEN** two products with different inventory snapshots and states
- **WHEN** an authorized inventory admin lists products
- **THEN** both products appear with state, all stored count aggregates plus
  derived available and ledger
- **AND** each inventory row's counts satisfy both reconciliation equations

#### Scenario: catalog-SC-57 - Operator edits product fields

- **GIVEN** a draft or created product
- **WHEN** an authorized inventory admin updates name, description, and
  remarks
- **THEN** those fields match the input
- **AND** state and inventory counts are unchanged
- **AND** updated at advances

### Application holds

---

### Requirement: Reservation record fields

A reservation SHALL be a **product-level** hold for one consumer classified by
**`holder_kind`**. `holder_kind` SHALL be `auction` or `vault` and SHALL be an
explicit stored field — Grade10 SHALL NOT infer kind from `holder_reference`,
reservation id, or purpose. The reservation SHALL NOT store a single
`inventory_id`; quantity on concrete stock-up rows SHALL live on
**allocation lines**.

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Product id | Required and immutable |
| Holder kind | `auction` or `vault`, immutable |
| Holder reference | Non-empty holder-owned business reference, immutable |
| Purpose | Trimmed, 1 to 200 characters |
| Quantity | Hold size; set on reserve; changed by adjust; always equals remaining + sold + vaulted + released |
| Remaining | Still reserved across all allocation lines |
| Sold | Quantity sold from this reservation |
| Vaulted | Quantity vaulted from this reservation |
| Released | Quantity returned to available via **release** (not via reduce-adjust) |
| State | `active` while remaining > 0; `closed` when remaining = 0 |
| Created at | Set on reserve, immutable |
| Updated at | Set on every successful reservation mutation |
| Created actor kind and id | Actor that reserved the quantity |
| Closed at | Null while active; set when remaining reaches zero |
| Closed actor kind and id | Null while active; actor of the closing mutation |

At all times on a reservation:
`quantity = remaining + sold + vaulted + released`.

Each reservation SHALL have one or more **allocation** lines. Each line SHALL
carry `inventory_id`, `quantity` (grows/shrinks with adjust), and `remaining` /
`sold` / `vaulted` / `released` with the same partition equation. Header
remaining / sold / vaulted / released SHALL equal the sums of the allocation
columns. Each inventory’s `reserved` SHALL equal the sum of allocation
`remaining` for that inventory (maintained by the service under lock, not by
counter triggers).

When reserving, Grade10 SHALL refuse if the product’s state is not `created`.
Otherwise it SHALL lock the product’s inventory rows and allocate FIFO by
`(created_at, id)` across rows with **`status = ready`** and available stock
until the requested quantity is filled (or refuse if ready available is
insufficient). `stocked` rows SHALL NOT receive allocations. Sell-from-
reservation, vault-from-reservation, release, and decrease-adjust SHALL draw
down allocation lines **LIFO** (newest line first). Increase-adjust SHALL
acquire more ready stock **FIFO** (oldest stock-up first). Products may have
multiple ready inventories; multi-line fill MUST be supported.

While any reservation is `active` under the same `(holder_kind,
holder_reference)`, that pair SHALL be unique. Retrying the same product,
quantity, and purpose SHALL return the existing active reservation. A retry
with a differing payload SHALL be refused. After the reservation is `closed`,
the same kind and reference MAY create a new reservation.

#### Scenario: catalog-SC-14 - Auction reserves a quantity

- **GIVEN** a **created** product with ready available three
- **WHEN** Auction reserves quantity two with purpose `listing allocation` and
  holder reference `listing-42`
- **THEN** one active reservation records `holder_kind` `auction`, quantity two,
  and remaining two
- **AND** at least one allocation line ties that quantity to an inventory of
  the product
- **AND** reserved increases by two while stock, vaulted, and derived ledger remain
  unchanged

#### Scenario: catalog-SC-15 - Same active reference retries idempotently

- **GIVEN** Auction already has an active reservation of quantity two under
  holder reference `listing-42`
- **WHEN** Auction repeats the same reservation request
- **THEN** Grade10 returns the existing reservation
- **AND** reserved and history do not change

#### Scenario: catalog-SC-16 - Closed reference may reserve again

- **GIVEN** an Auction reservation under holder reference `listing-42` is closed
- **WHEN** Auction reserves again with the same reference, product, and a valid
  quantity
- **THEN** Grade10 creates a new active reservation
- **AND** reserved increases by that quantity
- **AND** the prior closed reservation remains unchanged

#### Scenario: catalog-SC-43 - Reserve fills across multiple ready inventories when present

- **GIVEN** a product with two **ready** inventory rows, available two and
  available three respectively (schema allows this; behaviour under test may
  insert the second row via fixture)
- **WHEN** Auction reserves quantity five for one holder reference
- **THEN** one active reservation of quantity five exists
- **AND** allocation lines total five across both inventories (for example 2 + 3)
- **AND** each inventory’s reserved equals its allocation remaining
- **AND** product-level ready available is zero

### Requirement: Active reservations conserve aggregate stock

Creating a reservation SHALL atomically increase reserved by its
quantity only when that quantity does not exceed **ready** available across
the product's ready inventory rows. If there is too little ready available,
the complete request SHALL be refused. For each inventory row, reserved SHALL
equal the sum of allocation `remaining` for that inventory (service-maintained
under lock). Different `holder_kind` values MAY reserve the same product.

#### Scenario: catalog-SC-17 - Auction and Vault reserve the same product

- **GIVEN** a product with stock five and no reservations
- **WHEN** Auction reserves two and Vault reserves two
- **THEN** both reservations succeed with their respective `holder_kind`
- **AND** reserved is four and available is one

#### Scenario: catalog-SC-18 - Concurrent reservations cannot oversubscribe stock

- **GIVEN** a product with available one
- **WHEN** Auction and Vault concurrently reserve quantity one
- **THEN** exactly one reservation succeeds
- **AND** the other is refused for insufficient available inventory
- **AND** reserved and the sum of active remainings are one

#### Scenario: catalog-SC-19 - Insufficient stock reserves nothing

- **GIVEN** a product with available one
- **WHEN** Auction reserves quantity two
- **THEN** Grade10 refuses the request
- **AND** no reservation, count, or history change is written

### Requirement: Holder-kind scoped reads hide other applications

An application SHALL reach inventory through the named service entrypoint for
its `holder_kind`; kind SHALL NOT be caller input. A holder SHALL read
available and its own reservations (including remaining / sold / vaulted /
released). It SHALL NOT receive stock, derived ledger, aggregate reserved
count, vaulted aggregate, or another kind's reservation fields. Admin reads
SHALL expose the complete allocation grouped by `holder_kind`.

The Auction entrypoint (and inventory admin reads used by the auction listing
editor) SHALL list products eligible for a new listing reservation: product
state **`created`** and holder-facing **ready available greater than zero**.
`draft` products and products with zero ready available SHALL be omitted.
Vault’s entrypoint MAY expose the same eligibility shape for its own
reservation UX; it SHALL still omit another kind’s reservation fields.

#### Scenario: catalog-SC-20 - Vault cannot see Auction reservations

- **GIVEN** Auction reserves two and Vault reserves one of the same product
- **WHEN** Vault reads that product through its holder entrypoint
- **THEN** Vault sees available and its own quantity-one reservation with
  `holder_kind` `vault`
- **AND** no Auction reservation, quantity, purpose, or reference is returned

#### Scenario: catalog-SC-21 - Another kind cannot release a reservation

- **GIVEN** Auction has an active reservation
- **WHEN** Vault attempts to release its id
- **THEN** Grade10 responds as though the reservation does not exist
- **AND** the Auction reservation and reserved remain unchanged

#### Scenario: catalog-SC-61 - Auction eligibility list omits draft and out-of-stock

- **GIVEN** a draft product with ready available, a created product with ready
  available zero, and a created product with ready available at least one
- **WHEN** Auction lists products eligible for reservation
- **THEN** only the created in-stock product is returned
- **AND** the draft and out-of-stock products are omitted

#### Scenario: catalog-SC-62 - Eligibility available matches ready sum on created products

- **GIVEN** a created product with two ready inventories available two and
  three
- **WHEN** Auction lists eligibility for that product
- **THEN** ready available is five
- **AND** stocked-only rows do not contribute

### Requirement: Reservations release remaining quantity (partial allowed)

The owning kind or an authorized inventory admin SHALL release a positive
quantity up to the reservation's remaining. Omitting quantity SHALL
release all remaining. Release SHALL draw down allocation lines LIFO
(newest first), atomically increase `released`, decrease `remaining` and
inventory reserved by that quantity, and leave stock and derived ledger
unchanged. When remaining reaches zero, the reservation
SHALL become `closed`. Releasing a closed reservation SHALL return its current
state without changing counts or appending duplicate history.

#### Scenario: catalog-SC-22 - Vault releases a full remaining hold

- **GIVEN** Vault has an active reservation of quantity two and remaining two
- **WHEN** Vault releases it without specifying a quantity
- **THEN** the reservation becomes closed with released two and remaining
  zero
- **AND** reserved decreases by two and available increases by two
- **AND** stock, vaulted, and derived ledger remain unchanged

#### Scenario: catalog-SC-35 - Partial release leaves remaining active

- **GIVEN** Auction has an active reservation of quantity five and remaining five
- **WHEN** Auction releases quantity two
- **THEN** remaining is three, released is two, and state stays
  `active`
- **AND** reserved decreases by two

### Requirement: Active reservations may adjust quantity

The owning kind or an authorized inventory admin SHALL adjust an active
reservation to a new `quantity` via `adjustReservation`. Adjust SHALL keep the
same reservation id and `holder_reference` and SHALL NOT release-and-recreate
the hold.

Let `floor = sold + vaulted + released`. The new quantity SHALL be at least
`floor` and at most 500. Desired remaining is `newQuantity - floor`. Adjust
SHALL:

- **Increase** when new quantity is greater: acquire the delta from ready
  inventories **FIFO (oldest stock-up first)**, increase remaining and
  quantity, add or grow allocation lines; refuse if reservable available is
  insufficient — leave the reservation unchanged.
- **Decrease** when new quantity is less: free the delta from allocation
  remaining **LIFO (newest allocation line first)** back to available,
  decrease remaining and quantity; do **not** increase `released` (that
  column is only for explicit release).
- **No-op** when new quantity equals current quantity: return the reservation
  without history.

This covers admin draft listing edits (e.g. reserved 3, change listing qty to 5
or to 2) and equivalent Vault case quantity edits.

#### Scenario: catalog-SC-47 - Increase listing reservation 3 to 5 acquires more stock

- **GIVEN** two ready inventories for the product, older A with available three
  and newer B with available five
- **AND** an active Auction reservation for listing `listing-42` with quantity
  three, remaining three, and a single allocation on A of three
- **WHEN** an authorized inventory admin (or Auction) adjusts that reservation
  to quantity five
- **THEN** the same reservation id remains active with quantity five and
  remaining five
- **AND** allocations are A:3 and B:2 (delta taken from the next oldest ready
  stock with capacity)
- **AND** reserved increases by two overall
- **AND** no second reservation is created for `listing-42`
- **AND** `released` is unchanged

#### Scenario: catalog-SC-48 - Decrease listing reservation 5 to 2 frees newest allocation first

- **GIVEN** an active Auction reservation with quantity five, remaining five,
  and allocations A:3 (older line) and B:2 (newer line)
- **WHEN** it is adjusted to quantity two
- **THEN** the same reservation id remains active with quantity two and
  remaining two
- **AND** allocation B is cleared first (newest), then one unit is taken from A,
  leaving A:2 only
- **AND** reserved decreases by three and available increases by three
- **AND** `released` remains zero
- **AND** the reservation is not closed

#### Scenario: catalog-SC-49 - Increase refused when not enough ready stock

- **GIVEN** an active Auction reservation with quantity three and remaining three
- **AND** product ready available is one
- **WHEN** it is adjusted to quantity five
- **THEN** Grade10 refuses for insufficient reservable inventory
- **AND** quantity, remaining, reserved, and allocations are unchanged

#### Scenario: catalog-SC-50 - Cannot adjust below sold plus vaulted plus released

- **GIVEN** an Auction reservation with quantity five, sold two, remaining three,
  released zero
- **WHEN** it is adjusted to quantity one
- **THEN** Grade10 refuses
- **AND** the reservation is unchanged

### Requirement: Auction sells from reservation remaining

Auction (or an authorized inventory admin acting for an Auction reservation)
SHALL sell a positive quantity up to remaining. Sell-from-reservation SHALL draw down allocation lines LIFO (newest first) and
atomically: decrease remaining and inventory reserved and stock by that
quantity; increase reservation sold and inventory sold by that
quantity; leave vaulted and derived ledger unchanged; require price and currency. When
remaining reaches zero, the reservation SHALL become `closed`. Vault
entrypoints SHALL NOT expose sell-from-reservation.

#### Scenario: catalog-SC-36 - Auction partially sells from a reservation

- **GIVEN** Auction has an active reservation of quantity five, remaining five,
  and the product has stock five and reserved five
- **WHEN** Auction sells quantity two from that reservation for 8000 HKD minor
  units
- **THEN** remaining is three, reservation sold is two, state stays
  `active`
- **AND** inventory stock is three, reserved is three, sold is two
- **AND** vaulted and derived ledger are unchanged

#### Scenario: catalog-SC-37 - Partial sell then release closes the reservation

- **GIVEN** Auction has remaining three after a prior partial sell on a
  quantity-five reservation
- **WHEN** Auction releases quantity three
- **THEN** the reservation is closed with sold two, released three,
  remaining zero
- **AND** reserved decreases by three

### Requirement: Vault vaults from reservation remaining

Vault (or an authorized inventory admin acting for a Vault reservation) SHALL
vault a positive quantity up to remaining. Vault-from-reservation SHALL draw down allocation lines LIFO (newest first) and
atomically: decrease remaining and inventory reserved and stock by that
quantity; increase reservation vaulted and inventory vaulted by
that quantity; leave sold and derived ledger unchanged. When remaining reaches zero,
the reservation SHALL become `closed`. Auction entrypoints SHALL NOT expose
vault-from-reservation. Vaulteds SHALL NOT decrease in this capability.

#### Scenario: catalog-SC-38 - Vault partially vaults from a reservation

- **GIVEN** Vault has an active reservation of quantity five, remaining five,
  and the product has stock five and reserved five
- **WHEN** Vault vaults quantity two from that reservation
- **THEN** remaining is three, reservation vaulted is two, state stays
  `active`
- **AND** inventory stock is three, reserved is three, vaulted is two
- **AND** sold and derived ledger are unchanged

#### Scenario: catalog-SC-39 - Vault cannot sell from reservation

- **GIVEN** Vault has an active reservation
- **WHEN** a caller uses the Vault entrypoint and attempts sell-from-reservation
- **THEN** no sell-from-reservation method is exposed on that entrypoint

#### Scenario: catalog-SC-40 - Auction cannot vault from reservation

- **GIVEN** Auction has an active reservation
- **WHEN** a caller uses the Auction entrypoint and attempts vault-from-reservation
- **THEN** no vault-from-reservation method is exposed on that entrypoint

### Change history

---

### Requirement: Change history fields identify every transition

Every successful product or inventory mutation SHALL append one domain change
entry in the same transaction. Each entry SHALL carry:

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Occurred at | Server time of the successful mutation, immutable |
| Inventory id | Identity of the affected inventory row; null only for pure product metadata changes; when a reservation mutation touches multiple inventories, one changelog row per affected inventory |
| Changed entity | `product` for metadata changes; `inventory` for stock and reservation changes |
| Actor kind | `operator`, `application`, or `server` |
| Actor id | Operator user id; `auction` or `vault`; null for server |
| Action | `product-create` or `product-update` for product (including draft → created); `inventory-create`, `inventory-update`, `intake`, `status-change`, `reserve`, `adjust`, `release`, `sell-from-reservation`, `vault-from-reservation`, `sell`, or `withdraw` for inventory |
| Quantity | Positive transition quantity for inventory actions; null for product actions; for adjust, the absolute new quantity |
| Reservation id | Required for reserve, adjust, release, sell-from-reservation, vault-from-reservation; null otherwise |
| Sold total price | Positive integer minor units for sell / sell-from-reservation; null otherwise |
| Sold currency | ISO 4217 code for sell / sell-from-reservation; null otherwise |
| Reason | Required for withdraw; optional remarks for intake; null otherwise |
| Before | Canonical snapshot immediately before; null for product-create |
| After | Canonical snapshot immediately after |

Product actions SHALL snapshot product metadata. Inventory actions SHALL
snapshot the affected inventory; reservation-affecting actions SHALL also
snapshot the reservation header and the allocation line for that inventory
when `inventory_id` is set. Snapshot keys SHALL be canonical.

An elevated operator request SHALL also append one platform audit entry.
Application and server mutations write domain history only. Failed, refused,
and idempotent no-op writes SHALL append neither history nor audit.

#### Scenario: catalog-SC-23 - Product update records operator and snapshots

- **GIVEN** an existing product named `Card A`
- **WHEN** an authorized inventory admin renames it to `Card B`
- **THEN** one `product-update` change identifies the operator
- **AND** its changed entity is `product`
- **AND** before contains `Card A` and after contains `Card B`

#### Scenario: catalog-SC-24 - Intake history carries the added quantity

- **GIVEN** an inventory with stock two (derived ledger two)
- **WHEN** an authorized inventory admin intakes quantity three
- **THEN** one `intake` change records quantity three
- **AND** its changed entity is `inventory` and it references that inventory
- **AND** before records both counts as two and after records both as five

#### Scenario: catalog-SC-25 - Reserve history records allocation and snapshot

- **GIVEN** Auction requests a valid quantity-two reservation
- **WHEN** the reservation succeeds
- **THEN** one `reserve` change records quantity two and the reservation id
- **AND** its changed entity is `inventory` and the reservation belongs to that inventory
- **AND** actor kind is `application` and actor id is `auction`
- **AND** before and after show reserved increasing by two
- **AND** the reservation snapshot shows `holder_kind` `auction` and remaining two

#### Scenario: catalog-SC-26 - Release history records allocation and snapshot

- **GIVEN** Vault has an active quantity-two reservation
- **WHEN** Vault releases it
- **THEN** one `release` change records quantity two and the reservation id
- **AND** before and after show reserved decreasing by two
- **AND** the reservation snapshot changes from active remaining two to closed
  remaining zero

#### Scenario: catalog-SC-27 - Terminal history records action details

- **GIVEN** an inventory with available stock
- **WHEN** an authorized inventory admin records a free-pool sale and later a
  withdrawal
- **THEN** the sell change records its quantity, total price, and currency
- **AND** the withdraw change records its quantity and reason
- **AND** both changes show stock decreasing while derived ledger stays unchanged

#### Scenario: catalog-SC-28 - Refused write leaves history unchanged

- **GIVEN** an existing product
- **WHEN** an unauthorized caller attempts an intake and is refused
- **THEN** no history or audit entry is appended

#### Scenario: catalog-SC-41 - Sell-from-reservation history

- **GIVEN** Auction has an active reservation with remaining five
- **WHEN** Auction sells quantity two from that reservation
- **THEN** one `sell-from-reservation` change records quantity two and the
  reservation id
- **AND** before and after show inventory sold increasing by two and reserved
  decreasing by two
- **AND** the reservation snapshot shows remaining decreasing by two and sold
  count increasing by two

#### Scenario: catalog-SC-42 - Vault-from-reservation history

- **GIVEN** Vault has an active reservation with remaining five
- **WHEN** Vault vaults quantity two from that reservation
- **THEN** one `vault-from-reservation` change records quantity two and the
  reservation id
- **AND** before and after show inventory vaulted increasing by two and reserved
  decreasing by two
- **AND** the reservation snapshot shows remaining decreasing by two and
  vaulted increasing by two

### Admin console

---

### Requirement: Operators manage aggregate inventory from the admin panel

The Grade10 admin panel SHALL offer an Inventory section to authorized
inventory admins with three surfaces:

1. **Products list** — every product with state and aggregate counts
   (including vaulted).
2. **Product page** — create and edit the product (name, description,
   remarks), mark `draft` → `created`, list that product’s inventories, open
   create-inventory, show product-level reservations grouped by
   `holder_kind` with remaining / sold / vaulted / released, and change
   history.
3. **Inventory page** — create or open an inventory under a product; show
   that row’s snapshot (including status), edit status and remarks, intake,
   free-pool sell/withdraw, and row-relevant history.

Operators SHALL also reserve for Auction or Vault, adjust active reservation
quantity, partially release, sell-from-reservation, and vault-from-reservation
from the product page (product-level holds). Loading, empty, and error states
SHALL be visible.

#### Scenario: catalog-SC-29 - Operator oversees inventory and allocation on the product page

- **GIVEN** a created product with Auction and Vault reservations and prior
  vaulted and sold transitions
- **WHEN** an authorized inventory admin opens that product page
- **THEN** all aggregate counts including vaulted, both kinds' reservations
  with remaining, inventories for the product, and change history appear
- **AND** both count equations reconcile

#### Scenario: catalog-SC-30 - Empty products table

- **GIVEN** no products
- **WHEN** an authorized inventory admin opens Inventory
- **THEN** the products table shows an empty state

#### Scenario: catalog-SC-31 - Intake form updates the snapshot on the inventory page

- **GIVEN** an inventory open on its inventory page
- **WHEN** an authorized inventory admin intakes quantity two
- **THEN** its stock increases by two (derived ledger likewise)
- **AND** one intake entry appears in history

#### Scenario: catalog-SC-58 - Operator creates a product from the products list

- **GIVEN** an authorized inventory admin on the products list
- **WHEN** they create a product with a valid name
- **THEN** they land on the new product page in state `draft`
- **AND** the inventories list is empty

#### Scenario: catalog-SC-59 - Operator creates inventory from the product page

- **GIVEN** a product page with no inventories
- **WHEN** an authorized inventory admin creates an inventory with status
  `ready`
- **THEN** they land on that inventory page with zero counts
- **AND** the product page inventories list includes the new row

#### Scenario: catalog-SC-60 - Operator opens inventory page from the product page

- **GIVEN** a product with at least one inventory
- **WHEN** an authorized inventory admin opens an inventory from the product
  page
- **THEN** the inventory page shows that row’s status and counts

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
- **THEN** no reserve, release, sell-from-reservation, vault-from-reservation,
  or holder-scoped read method is exposed
