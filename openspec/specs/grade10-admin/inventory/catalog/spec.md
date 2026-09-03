# grade10-admin/inventory/catalog Specification

## Purpose
Gives Grade10 one stock snapshot per catalogue product, quantity-based
application reservations with remaining / sold / vaulted / released tracking,
admin oversight by explicit `holder_kind`, and an append-only trace of every
count transition.

## Requirements

### Requirement: Product record fields

A product SHALL carry the fields below. Creating a product SHALL also seed
exactly one inventory snapshot with every stored count set to zero and status
`draft`. An authorized inventory admin SHALL mark a `draft` product `created`.
Marking `created` is one-way (`created` → `draft` is refused). Holder reserve
and adjust-up SHALL require product status `created`. Intake SHALL require
product status `created`.

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Name | Trimmed, 1 to 200 characters |
| Description | Trimmed text, may be empty |
| Status | `draft` or `created`; create defaults to `draft` |
| Created at | Set on create, immutable |
| Updated at | Set on every successful product update or status change |
| Created by | Operator user id at create, immutable |
| Remarks | Trimmed text, may be empty |

#### Scenario: catalog-SC-01 - Operator creates a draft product with empty inventory

- **GIVEN** an authorized inventory admin
- **WHEN** they create a product with a valid name
- **THEN** Grade10 persists the product with a new id and status `draft`
- **AND** creates exactly one inventory snapshot whose counts are zero
- **AND** created by is that operator

#### Scenario: catalog-SC-02 - Product create without a name is refused

- **GIVEN** an authorized inventory admin
- **WHEN** they create a product with an empty name
- **THEN** Grade10 refuses the create
- **AND** no product or inventory is persisted

#### Scenario: catalog-SC-52 - Operator marks a draft product created

- **GIVEN** a draft product
- **WHEN** an authorized inventory admin marks it created
- **THEN** product status is `created`
- **AND** updated at advances
- **AND** one `product-update` history entry records the transition

#### Scenario: catalog-SC-53 - Reserve requires a created product

- **GIVEN** a draft product whose inventory has available stock
- **WHEN** Auction reserves quantity one
- **THEN** Grade10 refuses because the product is not created
- **AND** no reservation is written

- **GIVEN** the same draft product
- **WHEN** an authorized inventory admin reserves quantity one from the product
  page or through `reservations.reserve`
- **THEN** Grade10 refuses for the same reason
- **AND** no reservation is written

#### Scenario: catalog-SC-54 - Created to draft is refused

- **GIVEN** a created product
- **WHEN** an authorized inventory admin attempts to set status to `draft`
- **THEN** Grade10 refuses the change
- **AND** status remains `created`

### Requirement: Product inventory snapshot fields

Each product SHALL own exactly one inventory snapshot. `product_id` SHALL be
unique on `inventories`. Stock up (intake) and stock down (free-pool sell or
withdraw) SHALL update this row's counters in the same locked transaction.

Each inventory row SHALL contain the latest counts below; quantities SHALL be
non-negative whole numbers.

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Product id | Required, unique, and immutable |
| Stock | Quantity on hand (available + reserved); stored; app-updated under lock |
| Reserved | Held quantity; stored; app-updated under lock to match active reservation remaining |
| Available | Derived as stock minus reserved (not stored) |
| Vaulted | Cumulative quantity vaulted; stored; app-updated under lock |
| Sold | Cumulative quantity sold; stored; app-updated under lock |
| Withdrawn | Cumulative quantity withdrawn; stored; app-updated under lock |
| Ledger | Derived as stock + sold + withdrawn + vaulted (not stored) |
| Created at | Set with the product, immutable |
| Updated at | Set on every successful inventory transition |

At all times, `available + reserved = stock`, and derived
`ledger = stock + sold + withdrawn + vaulted`. Sold, withdrawn, and vaulted
SHALL never decrease. Stock, reserved, sold, vaulted, and withdrawn SHALL be
written by the inventory service in the same locked transaction as the
mutation — not by database triggers that sync counters from reservations.
Holder-facing available on a **`created`** product is that inventory's
available.

#### Scenario: catalog-SC-03 - Counts reconcile across current and terminal stock

- **GIVEN** an inventory with stock five, reserved two, vaulted one, sold three,
  and withdrawn one
- **WHEN** an authorized inventory admin reads it
- **THEN** available is three
- **AND** derived ledger is ten

#### Scenario: catalog-SC-04 - Product owns only one inventory

- **GIVEN** an existing product and its inventory
- **WHEN** more stock is received for that product
- **THEN** Grade10 updates the existing inventory
- **AND** no second inventory is created

### Requirement: Intake stocks up the product inventory

An authorized inventory admin SHALL intake a positive integer quantity from 1
through 500 into an existing product. Intake SHALL increase stock by that
quantity in one transaction (derived ledger rises by the same amount). It
SHALL NOT change reserved, vaulted, sold, or withdrawn. Intake for an unknown
product SHALL be refused.

#### Scenario: catalog-SC-05 - Operator intakes three

- **GIVEN** a product with stock two and derived ledger four
- **WHEN** an authorized inventory admin intakes quantity three
- **THEN** the same inventory has stock five and derived ledger seven
- **AND** reserved, vaulted, sold, and withdrawn are unchanged

#### Scenario: catalog-SC-06 - Repeated intakes accumulate in one inventory

- **GIVEN** a product whose inventory counts are zero
- **WHEN** an authorized inventory admin intakes two and later intakes three
- **THEN** the product still has one inventory
- **AND** stock is five and derived ledger is five

#### Scenario: catalog-SC-07 - Intake appends one quantity change

- **GIVEN** an existing product
- **WHEN** an authorized inventory admin intakes quantity ten
- **THEN** one `intake` change is appended with quantity ten
- **AND** its before and after snapshots show stock increasing by ten

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

Free-pool sell and withdraw are not offered on the inventory product page;
settlement runs through holder consoles and elevated APIs. When invoked, a
caller SHALL move a positive quantity of available stock to sold or withdrawn.
A sale SHALL carry a positive integer total price in minor units and an ISO
4217 currency code. A withdrawal SHALL carry a non-empty reason. Either
transition SHALL reduce stock and increase its terminal count by the same
quantity, leaving derived ledger unchanged.

A sale or withdrawal exceeding available SHALL be refused. Reserved quantity
SHALL be settled through the reservation before it can leave stock via these
free-pool transitions.

#### Scenario: catalog-SC-10 - Operator records a sale

- **GIVEN** an inventory with stock five and reserved one
- **WHEN** an authorized caller sells quantity two for 10000 minor units in HKD
- **THEN** stock decreases to three and sold increases by two
- **AND** reserved and derived ledger are unchanged

#### Scenario: catalog-SC-11 - Operator records a withdrawal

- **GIVEN** an inventory with three available stock
- **WHEN** an authorized caller withdraws quantity one with a reason
- **THEN** stock decreases by one and withdrawn increases by one
- **AND** derived ledger is unchanged

#### Scenario: catalog-SC-12 - Terminal transition cannot consume reserved stock

- **GIVEN** an inventory with stock three and reserved two
- **WHEN** an authorized caller sells or withdraws quantity two
- **THEN** Grade10 refuses the transition for insufficient available stock
- **AND** every count and active reservation is unchanged

### Requirement: Operators list and edit products

An authorized inventory admin SHALL list every product with status, stock,
derived ledger, available, reserved, vaulted, sold, and withdrawn. They
SHALL update a product's name, description, and remarks without changing
inventory counts, id, created at, created by, or status. An update SHALL
refresh product updated at.

#### Scenario: catalog-SC-13 - Operator lists products with aggregate counts

- **GIVEN** two products with different inventory snapshots and statuses
- **WHEN** an authorized inventory admin lists products
- **THEN** both products appear with status and all stored counts plus derived
  available and ledger
- **AND** each row's counts satisfy both reconciliation equations

#### Scenario: catalog-SC-57 - Operator edits product fields

- **GIVEN** a draft or created product
- **WHEN** an authorized inventory admin updates name, description, and
  remarks
- **THEN** those fields match the input
- **AND** status and inventory counts are unchanged
- **AND** updated at advances

### Requirement: Reservation record fields

A reservation SHALL be a **product-level** hold for one consumer classified by
**`holder_kind`**. `holder_kind` SHALL be `grade10-auction`, `grade10-vault`,
or `admin` and SHALL be an explicit stored field — Grade10 SHALL NOT infer kind
from `holder_reference`. Each reservation belongs to the product's single
inventory row.

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Product id | Required and immutable |
| Inventory id | Required; FK to the product's one inventory |
| Holder kind | `grade10-auction`, `grade10-vault`, or `admin`, immutable |
| Holder reference | Non-empty business reference, immutable; holder apps supply their own; admin reserves mint `admin-<uuid>` server-side |
| Remarks | Trimmed text, may be empty |
| Quantity | Current hold size; 1–500; changed only by adjust and set on reserve |
| Remaining | Still reserved; active when > 0 |
| Sold | Sold from this hold (Auction) |
| Vaulted | Vaulted from this hold (Vault) |
| Released | Released back to available |
| Status | `active` or `closed` |
| Created at | Set on reserve, immutable |
| Updated at | Set on every successful reservation mutation |

`quantity = remaining + sold + vaulted + released` at all times. Header
remaining and inventory `reserved` SHALL stay equal under lock.

When reserving, Grade10 SHALL refuse if the product's status is not `created`.
While any reservation is `active` under the same `(holder_kind,
holder_reference)`, that pair SHALL be unique. For `grade10-auction` and
`grade10-vault`, retrying the same product and quantity under that active pair
SHALL return the existing active reservation; a retry with a differing payload
SHALL be refused. For `admin`, each reserve SHALL mint a new unique
`holder_reference` and SHALL create a new active reservation. After the
reservation is `closed`, the same kind and reference MAY create a new
reservation (holder apps only; admin references are not reused).

#### Scenario: catalog-SC-14 - Auction reserves a quantity

- **GIVEN** a **created** product with available three
- **WHEN** Auction reserves quantity two with holder reference `listing-42`
- **THEN** one active reservation records `holder_kind` `grade10-auction`, quantity two,
  and remaining two
- **AND** reserved increases by two while stock and derived ledger remain
  unchanged

#### Scenario: catalog-SC-15 - Same active reference retries idempotently

- **GIVEN** Auction already has an active reservation of quantity two under
  holder reference `listing-42`
- **WHEN** Auction repeats the same reservation request
- **THEN** Grade10 returns the existing reservation
- **AND** reserved count and history do not change

#### Scenario: catalog-SC-16 - Closed reference may reserve again

- **GIVEN** an Auction reservation under holder reference `listing-42` is closed
- **WHEN** Auction reserves again with the same reference, product, and quantity
- **THEN** a new active reservation is created
- **AND** reserved increases by the new quantity

### Requirement: Active reservations conserve aggregate stock

Creating a reservation SHALL atomically increase inventory `reserved` and the
reservation's remaining by its quantity only when that quantity does not
exceed available. If there is too little available, the complete request
SHALL be refused. Inventory `reserved` SHALL equal the sum of `remaining` on
active reservations for that product. Different `holder_kind` values MAY
reserve the same product.

#### Scenario: catalog-SC-17 - Auction and Vault reserve the same product

- **GIVEN** a **created** product with stock five and no reservations
- **WHEN** Auction reserves two and Vault reserves two
- **THEN** both reservations succeed with their respective `holder_kind`
- **AND** reserved is four and available is one

#### Scenario: catalog-SC-18 - Concurrent reservations cannot oversubscribe stock

- **GIVEN** a product with available one
- **WHEN** Auction and Vault concurrently reserve quantity one
- **THEN** exactly one reservation succeeds
- **AND** the other is refused for insufficient available inventory
- **AND** reserved and the sum of active remaining are one

#### Scenario: catalog-SC-19 - Insufficient stock reserves nothing

- **GIVEN** a product with available one
- **WHEN** Auction reserves quantity two
- **THEN** Grade10 refuses the request
- **AND** no reservation, count, or history change is written

### Requirement: Holder-kind scoped reads hide other applications

An application SHALL reach inventory through the named service entrypoint for
its `holder_kind`; kind SHALL NOT be caller input. A holder SHALL read
available and its own reservations (including remaining / sold / vaulted /
released). It SHALL NOT receive stock, derived ledger, aggregate reserved,
vaulted totals, or another kind's reservation fields. Admin reads SHALL expose
the complete hold ledger grouped by `holder_kind`.

The Auction entrypoint (and inventory admin reads used by the auction listing
editor) SHALL list products eligible for a new listing reservation: product
status **`created`** and **available greater than zero**. `draft` products and
products with zero available SHALL be omitted. Auction listing edit flows MAY
also offer a listing's **current** product when that listing's active hold
accounts for the product's remaining free pool (consumed by
[`add-admin-auction-campaigns`](../../../../../add-admin-auction-campaigns/proposal.md)).

#### Scenario: catalog-SC-66 - Own reservation counts toward effective available on edit

- **GIVEN** an active Auction reservation of remaining three on a created
  product whose global available is zero
- **WHEN** Auction validates increasing that same listing's hold to quantity
  three on explicit Save
- **THEN** effective available is three and the save is allowed
- **AND** global available remains zero until the hold changes

#### Scenario: catalog-SC-20 - Vault cannot see Auction reservations

- **GIVEN** Auction reserves two and Vault reserves one of the same product
- **WHEN** Vault reads that product through its holder entrypoint
- **THEN** Vault sees available and its own quantity-one reservation with
  `holder_kind` `grade10-vault`
- **AND** no Auction reservation, quantity, remarks, or reference is returned

#### Scenario: catalog-SC-21 - Another kind cannot release a reservation

- **GIVEN** Auction has an active reservation
- **WHEN** Vault attempts to release its id
- **THEN** Grade10 responds as though the reservation does not exist
- **AND** the Auction reservation and reserved remain unchanged

#### Scenario: catalog-SC-61 - Auction eligibility list omits draft and out-of-stock

- **GIVEN** a draft product with available stock, a created product with
  available zero, and a created product with available at least one
- **WHEN** Auction lists products eligible for reservation
- **THEN** only the created in-stock product is returned
- **AND** the draft and out-of-stock products are omitted

#### Scenario: catalog-SC-62 - Eligibility available matches inventory available

- **GIVEN** a created product whose inventory has stock ten and reserved three
- **WHEN** Auction lists eligibility for that product
- **THEN** available is seven

### Requirement: Reservations release remaining quantity (partial allowed)

The owning kind or an authorized inventory admin SHALL release a positive
quantity up to the reservation's remaining. Omitting quantity SHALL release
all remaining. Release SHALL atomically increase `released`, decrease
`remaining` and inventory `reserved` by that quantity, and leave stock and
derived ledger unchanged. When remaining reaches zero, the reservation SHALL
become `closed`.

#### Scenario: catalog-SC-22 - Vault releases a full remaining hold

- **GIVEN** Vault has an active reservation of quantity two and remaining two
- **WHEN** Vault releases it without specifying a quantity
- **THEN** the reservation becomes closed with released two and remaining zero
- **AND** reserved decreases by two and available increases by two
- **AND** stock and derived ledger remain unchanged

#### Scenario: catalog-SC-35 - Partial release leaves remaining active

- **GIVEN** Auction has an active reservation of quantity five and remaining five
- **WHEN** Auction releases quantity two
- **THEN** remaining is three, released is two, and status stays `active`
- **AND** reserved decreases by two

### Requirement: Active reservations may adjust quantity

The owning kind or an authorized inventory admin SHALL adjust an active
reservation to a new `quantity` via `adjustReservation`. Adjust SHALL keep the
same reservation id and `holder_reference` and SHALL NOT release-and-recreate
the hold.

Let `floor = sold + vaulted + released`. The new quantity SHALL be at least
`floor` and at most 500. Desired remaining is `newQuantity - floor`. Adjust
SHALL:

- **Increase** when new quantity is greater: acquire the delta from available,
  increase remaining and quantity, increase inventory `reserved`; refuse if
  available is insufficient — leave the reservation unchanged.
- **Decrease** when new quantity is less: free the delta from remaining back to
  available, decrease remaining and quantity, decrease inventory `reserved`;
  do **not** increase `released`.
- **No-op** when new quantity equals current quantity: return the reservation
  without history.

Every successful adjust SHALL append one `adjust` changelog with the new
quantity and before/after snapshots of inventory and reservation.

#### Scenario: catalog-SC-47 - Increase listing reservation 3 to 5 acquires more stock

- **GIVEN** a **created** product with available five
- **AND** an active Auction reservation for listing `listing-42` with quantity
  three and remaining three
- **WHEN** an authorized inventory admin (or Auction) adjusts that reservation
  to quantity five
- **THEN** the same reservation id remains active with quantity five and
  remaining five
- **AND** reserved increases by two
- **AND** no second reservation is created for `listing-42`
- **AND** `released` is unchanged

#### Scenario: catalog-SC-48 - Decrease listing reservation 5 to 2 frees remaining

- **GIVEN** an active Auction reservation with quantity five and remaining five
- **WHEN** it is adjusted to quantity two
- **THEN** the same reservation id remains active with quantity two and
  remaining two
- **AND** reserved decreases by three and available increases by three
- **AND** `released` remains zero
- **AND** the reservation is not closed

#### Scenario: catalog-SC-49 - Increase refused when not enough available stock

- **GIVEN** an active Auction reservation with quantity three and remaining three
- **AND** product available is one
- **WHEN** it is adjusted to quantity five
- **THEN** Grade10 refuses for insufficient available inventory
- **AND** quantity, remaining, and reserved are unchanged

#### Scenario: catalog-SC-50 - Cannot adjust below sold plus vaulted plus released

- **GIVEN** an Auction reservation with quantity five, sold two, remaining three,
  released zero
- **WHEN** it is adjusted to quantity one
- **THEN** Grade10 refuses
- **AND** the reservation is unchanged

### Requirement: Active reservations may change product atomically

The owning kind or an authorized inventory admin SHALL move an **active**
reservation to a different **created** product and new quantity via
`changeReservationProduct`. The call SHALL keep the same reservation id and
`holder_reference`. It SHALL NOT close the reservation and create a new row.

Input: reservation id, `newProductId`, `newQuantity` (integer 1–500). The new
product SHALL be **`status` `created`**. The new quantity SHALL be at least
`sold + vaulted + released` on the reservation and SHALL not exceed the new
product's available plus this reservation's current **remaining** when the
product is unchanged (for product switches, available on the new product
only).

Under one database transaction the service SHALL:

1. Lock both affected inventory rows in deterministic **`product_id`** order.
2. Refuse when the new product lacks sufficient available for `newQuantity`,
   when the reservation is not **active**, when the new product is **draft**,
   or when `newQuantity` is below `sold + vaulted + released` — leaving the
   reservation and both inventories unchanged.
3. Decrease inventory **`reserved`** on the old product by the reservation's
   current **remaining** (freeing that stock back to available). Do **not**
   increase reservation **`released`** for this transition.
4. Reassign the reservation row to `newProductId` and its inventory id; set
   **`quantity`** and **`remaining`** to `newQuantity`; increase the new
   product's inventory **`reserved`** by `newQuantity`.
5. Append one changelog recording the product change and before/after snapshots
   for both inventories and the reservation.

Auction listing explicit Saves call this RPC when product changes; quantity-only
changes on the same product SHALL use `adjustReservation` instead.

#### Scenario: catalog-SC-51 - Listing product change moves hold in one transaction

- **GIVEN** an active Auction reservation for listing `listing-42` on product A
  with quantity three and remaining three
- **AND** product B is **created** with available at least three
- **WHEN** Auction calls `changeReservationProduct` with product B and quantity
  three
- **THEN** the same reservation id is **active** on product B with quantity
  three and remaining three
- **AND** product A **reserved** decreases by three and product B **reserved**
  increases by three
- **AND** stock and derived ledger on both products are unchanged
- **AND** exactly one reservation remains active for `listing-42`

#### Scenario: catalog-SC-63 - Product change refused when new product lacks stock

- **GIVEN** an active Auction reservation on product A with remaining three
- **AND** product B available is one
- **WHEN** Auction calls `changeReservationProduct` to product B with quantity
  three
- **THEN** Grade10 refuses for insufficient available inventory
- **AND** the reservation stays on product A with remaining three
- **AND** both products' **reserved** counts are unchanged

#### Scenario: catalog-SC-64 - Product change refused for draft target product

- **GIVEN** an active Auction reservation on a **created** product
- **WHEN** Auction calls `changeReservationProduct` to a **draft** product
- **THEN** Grade10 refuses
- **AND** the reservation is unchanged

#### Scenario: catalog-SC-65 - Product change refused below settled floor

- **GIVEN** an Auction reservation with quantity five, sold two, remaining three
- **WHEN** it is changed to another product with quantity one
- **THEN** Grade10 refuses
- **AND** the reservation and both inventories are unchanged

### Requirement: Auction sells from reservation remaining

Auction (or an authorized inventory admin acting for an Auction reservation)
SHALL sell a positive quantity up to remaining. Sell-from-reservation SHALL
atomically: decrease remaining and inventory reserved and stock by that
quantity; increase reservation sold and inventory sold; leave vaulted and
derived ledger unchanged; require price and currency. When remaining reaches
zero, the reservation SHALL become `closed`. Vault entrypoints SHALL NOT
expose sell-from-reservation.

#### Scenario: catalog-SC-36 - Auction partially sells from a reservation

- **GIVEN** Auction has an active reservation of quantity five, remaining five,
  and the product has stock five and reserved five
- **WHEN** Auction sells quantity two from that reservation for 8000 HKD minor
  units
- **THEN** remaining is three, reservation sold is two, status stays `active`
- **AND** inventory stock is three, reserved is three, sold is two
- **AND** vaulted and derived ledger are unchanged

#### Scenario: catalog-SC-37 - Partial sell then release closes the reservation

- **GIVEN** Auction has remaining three after a prior partial sell on a
  quantity-five reservation
- **WHEN** Auction releases quantity three
- **THEN** the reservation is closed with sold two, released three, remaining zero
- **AND** reserved decreases by three

### Requirement: Vault vaults from reservation remaining

Vault (or an authorized inventory admin acting for a Vault reservation) SHALL
vault a positive quantity up to remaining. Vault-from-reservation SHALL
atomically: decrease remaining and inventory reserved and stock by that
quantity; increase reservation vaulted and inventory vaulted; leave sold and
derived ledger unchanged. When remaining reaches zero, the reservation SHALL
become `closed`. Auction entrypoints SHALL NOT expose vault-from-reservation.

#### Scenario: catalog-SC-38 - Vault partially vaults from a reservation

- **GIVEN** Vault has an active reservation of quantity five, remaining five,
  and the product has stock five and reserved five
- **WHEN** Vault vaults quantity two from that reservation
- **THEN** remaining is three, reservation vaulted is two, status stays `active`
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

### Requirement: Change history fields identify every transition

Every successful product or inventory mutation SHALL append one domain change
entry in the same transaction. Each entry SHALL carry:

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Occurred at | Server time of the successful mutation, immutable |
| Inventory id | Identity of the product's one inventory |
| Changed entity | `product` for metadata changes; `inventory` for stock and reservation changes |
| Actor kind | `operator`, `application`, or `server` |
| Actor id | Operator user id; `grade10-auction` or `grade10-vault`; null for server |
| Action | `product-create`, `product-update`, `intake`, `reserve`, `adjust`, `change-product`, `release`, `sell-from-reservation`, `vault-from-reservation`, `sell`, or `withdraw` |
| Quantity | Positive transition quantity for inventory actions; for adjust or change-product, the new quantity; null for product metadata |
| Reservation id | Required for reserve, adjust, change-product, release, sell-from-reservation, vault-from-reservation; null otherwise |
| Sold total price | Positive integer minor units for sell / sell-from-reservation; null otherwise |
| Sold currency | ISO 4217 code for sell / sell-from-reservation; null otherwise |
| Reason | Required for withdraw; optional remarks for intake; null otherwise |
| Before | Canonical snapshot immediately before; null for product-create |
| After | Canonical snapshot immediately after |

Product actions SHALL snapshot product metadata. Inventory actions SHALL
snapshot the affected inventory; reservation-affecting actions SHALL also
snapshot the reservation header. Every intake, terminal transition, reserve,
adjust, release, sell-from-reservation, and vault-from-reservation that changes
a stored quantity SHALL record that quantity in the changelog.

An elevated operator request SHALL also append one platform audit entry.
Failed, refused, and idempotent no-op writes SHALL append neither history nor
audit.

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
- **AND** its changed entity is `inventory`
- **AND** before and after show stock increasing by three

#### Scenario: catalog-SC-25 - Reserve history records hold and snapshot

- **GIVEN** Auction requests a valid quantity-two reservation
- **WHEN** the reservation succeeds
- **THEN** one `reserve` change records quantity two and the reservation id
- **AND** before and after show reserved increasing by two

#### Scenario: catalog-SC-26 - Release history records hold and snapshot

- **GIVEN** Vault has an active reservation with remaining two
- **WHEN** Vault releases it
- **THEN** one `release` change records quantity two and the reservation id
- **AND** before and after show reserved decreasing by two

#### Scenario: catalog-SC-27 - Terminal history records action details

- **GIVEN** an inventory with available stock
- **WHEN** an authorized inventory admin records a free-pool sale and later a
  withdrawal
- **THEN** one `sell` change records the sold quantity, price, and currency
- **AND** one `withdraw` change records the withdrawn quantity and reason

#### Scenario: catalog-SC-28 - Refused write leaves history unchanged

- **GIVEN** a product with available one
- **WHEN** Auction attempts to reserve quantity two and Grade10 refuses
- **THEN** no new change is appended

#### Scenario: catalog-SC-41 - Sell-from-reservation history

- **GIVEN** Auction has an active reservation with remaining five
- **WHEN** Auction sells quantity two from that reservation
- **THEN** one `sell-from-reservation` change records quantity two and the
  reservation id
- **AND** before and after show inventory sold increasing by two and reserved
  decreasing by two

#### Scenario: catalog-SC-42 - Vault-from-reservation history

- **GIVEN** Vault has an active reservation with remaining five
- **WHEN** Vault vaults quantity two from that reservation
- **THEN** one `vault-from-reservation` change records quantity two and the
  reservation id
- **AND** before and after show inventory vaulted increasing by two and reserved
  decreasing by two

#### Scenario: catalog-SC-43 - Adjust history records new quantity

- **GIVEN** an active Auction reservation with quantity three
- **WHEN** it is adjusted to quantity five
- **THEN** one `adjust` change records quantity five and the reservation id
- **AND** before and after show reserved increasing by two and remaining
  increasing by two

#### Scenario: catalog-SC-44 - Adjust decrease records freed quantity

- **GIVEN** an active Auction reservation with quantity five and remaining five
- **WHEN** it is adjusted to quantity two
- **THEN** one `adjust` change records quantity two and the reservation id
- **AND** before and after show reserved decreasing by three

#### Scenario: catalog-SC-45 - Change-product history records both inventories

- **GIVEN** an active Auction reservation on product A with quantity three and
  remaining three
- **AND** product B is **created** with available at least three
- **WHEN** Auction calls `changeReservationProduct` to product B with quantity
  three
- **THEN** one `change-product` change records quantity three and the
  reservation id
- **AND** before and after show product A reserved decreasing by three and
  product B reserved increasing by three

### Requirement: Operators manage aggregate inventory from the admin panel

The Grade10 admin panel SHALL offer an Inventory section with:

1. **Products list** — every product with status and snapshot counts (including
   vaulted).
2. **Product page** — create and edit the product (name, description, remarks),
   mark `draft` → `created`, show the product's single inventory snapshot,
   reservations grouped by **`holder_kind`**, and change history.

Operators SHALL intake stock and reserve admin holds from the product page.
Admin reserve SHALL always use `holder_kind` `admin` and SHALL mint
`holder_reference` server-side; operators supply quantity and optional remarks
only. Operators SHALL release active `admin` holds from the reservations table on
the product page (partial or full, per catalog-SC-35). Free-pool sell and
withdraw, adjust, change reservation product, release,
sell-from-reservation, and vault-from-reservation for Auction and Vault holds
SHALL be triggered from holder consoles or elevated APIs, not from the inventory
product page. Auction and Vault reservation rows on the product page are
read-only oversight; only `admin` rows MAY offer Release on this page
(catalog-SC-68). Loading, empty, and error states SHALL be visible.

#### Scenario: catalog-SC-59 - Operator reserves admin hold from product page

- **GIVEN** a created product with stock five and reserved zero
- **WHEN** an authorized inventory admin reserves quantity two from the product
  page with optional remarks
- **THEN** one active reservation records `holder_kind` `admin`, a server-minted
  `holder_reference`, quantity two, and the remarks
- **AND** reserved increases by two while stock and derived ledger remain
  unchanged

#### Scenario: catalog-SC-60 - Operator releases admin hold from product page

- **GIVEN** a created product with an active `admin` reservation of quantity two
  and remaining two
- **WHEN** an authorized inventory admin releases the full remaining quantity
  from the product page
- **THEN** the reservation closes with `released` two and `remaining` zero
- **AND** reserved decreases by two and available increases by two

- **GIVEN** the same product with an active `admin` reservation of quantity five
  and remaining five
- **WHEN** an authorized inventory admin releases quantity two from the product
  page
- **THEN** remaining is three, released is two, and status stays `active`
- **AND** reserved decreases by two

#### Scenario: catalog-SC-68 - Product page release is limited to admin holds

- **GIVEN** a created product with active Auction, Vault, and `admin`
  reservations on the product page
- **WHEN** an authorized inventory admin views the reservations table
- **THEN** only `admin` rows offer a Release action
- **AND** Auction and Vault rows show no settlement actions on this page

#### Scenario: catalog-SC-29 - Operator oversees inventory and holds on the product page

- **GIVEN** a created product with Auction, Vault, and `admin` reservations and
  prior vaulted and sold transitions
- **WHEN** an authorized inventory admin opens that product page
- **THEN** all counts including vaulted, each holder kind's reservations with
  remaining, and change history appear
- **AND** both count equations reconcile

#### Scenario: catalog-SC-30 - Empty products table

- **GIVEN** no products
- **WHEN** an authorized inventory admin opens Inventory
- **THEN** the products table shows an empty state

#### Scenario: catalog-SC-31 - Intake form updates the snapshot on the product page

- **GIVEN** a product page for an existing product
- **WHEN** an authorized inventory admin intakes quantity two
- **THEN** its stock increases by two (derived ledger likewise)
- **AND** one intake entry appears in history

#### Scenario: catalog-SC-58 - Operator creates a product from the products list

- **GIVEN** an authorized inventory admin on the products list
- **WHEN** they create a product with a valid name
- **THEN** they land on the new product page in status `draft`
- **AND** the inventory snapshot shows zero counts

### Requirement: Elevated admin reservation mutations

The inventory worker's elevated `reservations.reserve` and `reservations.release`
procedures SHALL implement the same `admin` hold semantics as the product page
(`catalog-SC-59`, `catalog-SC-60`). `reservations.reserve` SHALL NOT accept
`holder_kind` or `holder_reference` from the caller; it SHALL always create
`holder_kind` `admin` with a server-minted `holder_reference`. Each call SHALL
create a new active reservation (no idempotent retry on reference).

#### Scenario: catalog-SC-67 - Elevated admin reserve mints holder reference

- **GIVEN** a created product with stock five and reserved zero
- **WHEN** an authorized inventory admin calls `reservations.reserve` with
  `productId`, quantity two, and optional remarks
- **THEN** one active reservation records `holder_kind` `admin`, a
  server-minted `holder_reference`, quantity two, and the remarks
- **AND** reserved increases by two while stock and derived ledger remain
  unchanged

- **GIVEN** the same product after one successful admin reserve
- **WHEN** the admin calls `reservations.reserve` again with quantity one
- **THEN** a second active reservation is created with a different
  `holder_reference`
- **AND** reserved increases by one

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
- **THEN** no reserve, release, adjust, sell-from-reservation,
  vault-from-reservation, or holder-scoped read method is exposed
