# grade10-admin/inventory/catalog Specification

## Purpose
Gives Grade10 one stock snapshot per catalogue product, quantity-based
application reservations with remaining / sold / vaulted / released tracking,
admin oversight by explicit `holder_kind`, and an append-only trace of every
count transition.

## Feature set

- Product stock
  - Product record: descriptive identity; lifecycle `draft` | `created`
  - One inventory snapshot per product: stored stock, reserved, vaulted, sold,
    withdrawn; derived available and ledger
  - Intake: stock up the product's inventory
  - Terminal transitions: move available stock to sold or withdrawn; move
    reservation remaining to sold (Auction) or vaulted (Vault)
- Application holds
  - Reservation classified by `holder_kind` (`grade10-auction` | `grade10-vault` |
    `admin`)
  - Remaining quantity and adjustable hold size
  - Partial sell / vault / release against remaining
  - Re-reserve after close with the same kind + reference (holder apps;
    `admin` mints a new reference on each reserve)
  - Conservation: active remaining cannot exceed available
  - Scoped access: expose availability and only the calling kind's holds
- Change history
  - Mutation trace: typed actors, actions, quantities, before/after snapshots
  - Every inventory or reservation quantity change appends one changelog
- Admin console
  - Products list and product page
  - Create/edit products (`draft` → `created`); intake and admin reserve;
    release admin holds from the product page; read-only oversight of Auction
    and Vault holds by `holder_kind`; history
- Product identity
  - Hierarchy: IP, Category, and Item are the complete product identity
  - Universal classification: IP, Item, and Category are required before a product becomes created
  - Product facts: typed attributes replace free-form product metadata
- Product schemas
  - Card template: shared typed facts are assigned to exact tag tuples
  - Exact tuple: one IP, one Item, and one Category select the product schema
  - Reusable attribute keys: stable keys, types, validation rules, localized labels, and select options
  - Schema manifest: validated definitions create draft revisions
  - Draft and publish: publishing validates affected products before a configuration becomes active
  - Compatibility review: admins can find and correct incompatible product attributes before publishing
- Physical units
  - Copy facts: Cert ID, grading, autograph grade, and serial belong to a unit
  - Intake: records identifiers atomically with received stock
- Bulk entry
  - Product upload: product names and schema values enter without stock
  - Inventory upload: physical copies enter against existing products
- Auction presentation
  - Displayed fields: admins control attribute and Cert ID visibility and order
  - Search and filter: universal tags and configured product attributes remain searchable by stable identity
  - Listing attributes: ordered, localized display items belong to one Auction listing and are not searchable
  - Live values: Auction reads the selected unit through Inventory

## Requirements

### Requirement: Product record fields

A product SHALL carry the fields below. Creating a product SHALL also seed
exactly one inventory snapshot with every stored count set to zero and status
`draft`. An authorized inventory admin SHALL mark a `draft` product `created`
only when its universal IP, Item, and Category classification is complete, an
exact published product schema exists for its IP + Item + Category tuple, and every
required attribute value satisfies that product schema. Marking `created` is one-way
(`created` → `draft` is refused). Holder reserve and adjust-up SHALL require
product status `created`. Intake SHALL require product status `created`.

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Name | Trimmed, 1 to 200 characters |
| Description | Trimmed text, may be empty |
| Status | `draft` or `created`; create defaults to `draft` |
| Product schema | The published product schema for the product's exact IP + Item + Category tuple; absent when no matching product schema exists; system-selected, not independently editable |
| Created at | Set on create, immutable |
| Updated at | Set on every successful product update or status change |
| Created by | Operator user id at create, immutable |
| Remarks | Trimmed text, may be empty |

#### Scenario: grade10-admin-inventory-catalog-SC-01 - Operator creates a draft product with empty inventory
**Serves:** grade10-admin-inventory-catalog-US-01 - Record received stock

- **GIVEN** an authorized inventory admin
- **WHEN** they create a product with a valid name
- **THEN** Grade10 persists the product with a new id and status `draft`
- **AND** creates exactly one inventory snapshot whose counts are zero
- **AND** created by is that operator

#### Scenario: grade10-admin-inventory-catalog-SC-02 - Product create without a name is refused
**Serves:** Product stock - product create without a name is refused

- **GIVEN** an authorized inventory admin
- **WHEN** they create a product with an empty name
- **THEN** Grade10 refuses the create
- **AND** no product or inventory is persisted

#### Scenario: grade10-admin-inventory-catalog-SC-52 - Operator marks a draft product created
**Serves:** grade10-admin-inventory-catalog-US-06 - Inventory admin enters a validated product

- **GIVEN** a draft product with complete universal classification and valid required values for its published product schema
- **WHEN** an authorized inventory admin marks it created
- **THEN** product status is `created`
- **AND** updated at advances
- **AND** one `product-update` history entry records the transition

#### Scenario: grade10-admin-inventory-catalog-SC-53 - Reserve requires a created product
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** a draft product whose inventory has available stock
- **WHEN** Auction reserves quantity one
- **THEN** Grade10 refuses because the product is not created
- **AND** no reservation is written

- **GIVEN** the same draft product
- **WHEN** an authorized inventory admin reserves quantity one from the product
  page or through `reservations.reserve`
- **THEN** Grade10 refuses for the same reason
- **AND** no reservation is written

#### Scenario: grade10-admin-inventory-catalog-SC-54 - Created to draft is refused
**Serves:** grade10-admin-inventory-catalog-US-01 - Record received stock

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

#### Scenario: grade10-admin-inventory-catalog-SC-03 - Counts reconcile across current and terminal stock
**Serves:** Product stock - counts reconcile across current and terminal stock

- **GIVEN** an inventory with stock five, reserved two, vaulted one, sold three,
  and withdrawn one
- **WHEN** an authorized inventory admin reads it
- **THEN** available is three
- **AND** derived ledger is ten

#### Scenario: grade10-admin-inventory-catalog-SC-04 - Product owns only one inventory
**Serves:** Product stock - product owns only one inventory

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

#### Scenario: grade10-admin-inventory-catalog-SC-05 - Operator intakes three
**Serves:** grade10-admin-inventory-catalog-US-01 - Record received stock

- **GIVEN** a product with stock two and derived ledger four
- **WHEN** an authorized inventory admin intakes quantity three
- **THEN** the same inventory has stock five and derived ledger seven
- **AND** reserved, vaulted, sold, and withdrawn are unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-06 - Repeated intakes accumulate in one inventory
**Serves:** grade10-admin-inventory-catalog-US-01 - Record received stock

- **GIVEN** a product whose inventory counts are zero
- **WHEN** an authorized inventory admin intakes two and later intakes three
- **THEN** the product still has one inventory
- **AND** stock is five and derived ledger is five

#### Scenario: grade10-admin-inventory-catalog-SC-07 - Intake appends one quantity change
**Serves:** grade10-admin-inventory-catalog-US-01 - Record received stock

- **GIVEN** an existing product
- **WHEN** an authorized inventory admin intakes quantity ten
- **THEN** one `intake` change is appended with quantity ten
- **AND** its before and after snapshots show stock increasing by ten

#### Scenario: grade10-admin-inventory-catalog-SC-08 - Invalid intake quantity is refused
**Serves:** Product stock - invalid intake quantity is refused

- **GIVEN** an existing product
- **WHEN** an authorized inventory admin intakes quantity zero or quantity 501
- **THEN** Grade10 refuses the intake
- **AND** the inventory and history are unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-09 - Intake for unknown product is refused
**Serves:** Product stock - intake for unknown product is refused

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

#### Scenario: grade10-admin-inventory-catalog-SC-10 - Operator records a sale
**Serves:** Product stock - operator records a sale

- **GIVEN** an inventory with stock five and reserved one
- **WHEN** an authorized caller sells quantity two for 10000 minor units in HKD
- **THEN** stock decreases to three and sold increases by two
- **AND** reserved and derived ledger are unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-11 - Operator records a withdrawal
**Serves:** Product stock - operator records a withdrawal

- **GIVEN** an inventory with three available stock
- **WHEN** an authorized caller withdraws quantity one with a reason
- **THEN** stock decreases by one and withdrawn increases by one
- **AND** derived ledger is unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-12 - Terminal transition cannot consume reserved stock
**Serves:** Product stock - terminal transition cannot consume reserved stock

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

#### Scenario: grade10-admin-inventory-catalog-SC-13 - Operator lists products with aggregate counts
**Serves:** Admin console - operator lists products with aggregate counts

- **GIVEN** two products with different inventory snapshots and statuses
- **WHEN** an authorized inventory admin lists products
- **THEN** both products appear with status and all stored counts plus derived
  available and ledger
- **AND** each row's counts satisfy both reconciliation equations

#### Scenario: grade10-admin-inventory-catalog-SC-57 - Operator edits product fields
**Serves:** Admin console - operator edits product fields

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

#### Scenario: grade10-admin-inventory-catalog-SC-14 - Auction reserves a quantity
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** a **created** product with available three
- **WHEN** Auction reserves quantity two with holder reference `listing-42`
- **THEN** one active reservation records `holder_kind` `grade10-auction`, quantity two,
  and remaining two
- **AND** reserved increases by two while stock and derived ledger remain
  unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-15 - Same active reference retries idempotently
**Serves:** grade10-admin-inventory-catalog-US-03 - Auction operator holds stock the vault cannot touch

- **GIVEN** Auction already has an active reservation of quantity two under
  holder reference `listing-42`
- **WHEN** Auction repeats the same reservation request
- **THEN** Grade10 returns the existing reservation
- **AND** reserved count and history do not change

#### Scenario: grade10-admin-inventory-catalog-SC-16 - Closed reference may reserve again
**Serves:** grade10-admin-inventory-catalog-US-03 - Auction operator holds stock the vault cannot touch

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

#### Scenario: grade10-admin-inventory-catalog-SC-17 - Auction and Vault reserve the same product
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** a **created** product with stock five and no reservations
- **WHEN** Auction reserves two and Vault reserves two
- **THEN** both reservations succeed with their respective `holder_kind`
- **AND** reserved is four and available is one

#### Scenario: grade10-admin-inventory-catalog-SC-18 - Concurrent reservations cannot oversubscribe stock
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** a product with available one
- **WHEN** Auction and Vault concurrently reserve quantity one
- **THEN** exactly one reservation succeeds
- **AND** the other is refused for insufficient available inventory
- **AND** reserved and the sum of active remaining are one

#### Scenario: grade10-admin-inventory-catalog-SC-19 - Insufficient stock reserves nothing
**Serves:** grade10-admin-inventory-catalog-US-03 - Auction operator holds stock the vault cannot touch

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

#### Scenario: grade10-admin-inventory-catalog-SC-66 - Own reservation counts toward effective available on edit
**Serves:** grade10-admin-inventory-catalog-US-03 - Auction operator holds stock the vault cannot touch

- **GIVEN** an active Auction reservation of remaining three on a created
  product whose global available is zero
- **WHEN** Auction validates increasing that same listing's hold to quantity
  three on explicit Save
- **THEN** effective available is three and the save is allowed
- **AND** global available remains zero until the hold changes

#### Scenario: grade10-admin-inventory-catalog-SC-20 - Vault cannot see Auction reservations
**Serves:** grade10-admin-inventory-catalog-US-03 - Auction operator holds stock the vault cannot touch

- **GIVEN** Auction reserves two and Vault reserves one of the same product
- **WHEN** Vault reads that product through its holder entrypoint
- **THEN** Vault sees available and its own quantity-one reservation with
  `holder_kind` `grade10-vault`
- **AND** no Auction reservation, quantity, remarks, or reference is returned

#### Scenario: grade10-admin-inventory-catalog-SC-21 - Another kind cannot release a reservation
**Serves:** grade10-admin-inventory-catalog-US-03 - Auction operator holds stock the vault cannot touch

- **GIVEN** Auction has an active reservation
- **WHEN** Vault attempts to release its id
- **THEN** Grade10 responds as though the reservation does not exist
- **AND** the Auction reservation and reserved remain unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-61 - Auction eligibility list omits draft and out-of-stock
**Serves:** grade10-admin-inventory-catalog-US-03 - Auction operator holds stock the vault cannot touch

- **GIVEN** a draft product with available stock, a created product with
  available zero, and a created product with available at least one
- **WHEN** Auction lists products eligible for reservation
- **THEN** only the created in-stock product is returned
- **AND** the draft and out-of-stock products are omitted

#### Scenario: grade10-admin-inventory-catalog-SC-62 - Eligibility available matches inventory available
**Serves:** grade10-admin-inventory-catalog-US-03 - Auction operator holds stock the vault cannot touch

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

#### Scenario: grade10-admin-inventory-catalog-SC-22 - Vault releases a full remaining hold
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** Vault has an active reservation of quantity two and remaining two
- **WHEN** Vault releases it without specifying a quantity
- **THEN** the reservation becomes closed with released two and remaining zero
- **AND** reserved decreases by two and available increases by two
- **AND** stock and derived ledger remain unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-35 - Partial release leaves remaining active
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

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

#### Scenario: grade10-admin-inventory-catalog-SC-47 - Increase listing reservation 3 to 5 acquires more stock
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

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

#### Scenario: grade10-admin-inventory-catalog-SC-48 - Decrease listing reservation 5 to 2 frees remaining
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** an active Auction reservation with quantity five and remaining five
- **WHEN** it is adjusted to quantity two
- **THEN** the same reservation id remains active with quantity two and
  remaining two
- **AND** reserved decreases by three and available increases by three
- **AND** `released` remains zero
- **AND** the reservation is not closed

#### Scenario: grade10-admin-inventory-catalog-SC-49 - Increase refused when not enough available stock
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** an active Auction reservation with quantity three and remaining three
- **AND** product available is one
- **WHEN** it is adjusted to quantity five
- **THEN** Grade10 refuses for insufficient available inventory
- **AND** quantity, remaining, and reserved are unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-50 - Cannot adjust below sold plus vaulted plus released
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

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

#### Scenario: grade10-admin-inventory-catalog-SC-51 - Listing product change moves hold in one transaction
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

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

#### Scenario: grade10-admin-inventory-catalog-SC-63 - Product change refused when new product lacks stock
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** an active Auction reservation on product A with remaining three
- **AND** product B available is one
- **WHEN** Auction calls `changeReservationProduct` to product B with quantity
  three
- **THEN** Grade10 refuses for insufficient available inventory
- **AND** the reservation stays on product A with remaining three
- **AND** both products' **reserved** counts are unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-64 - Product change refused for draft target product
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** an active Auction reservation on a **created** product
- **WHEN** Auction calls `changeReservationProduct` to a **draft** product
- **THEN** Grade10 refuses
- **AND** the reservation is unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-65 - Product change refused below settled floor
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

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

#### Scenario: grade10-admin-inventory-catalog-SC-36 - Auction partially sells from a reservation
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** Auction has an active reservation of quantity five, remaining five,
  and the product has stock five and reserved five
- **WHEN** Auction sells quantity two from that reservation for 8000 HKD minor
  units
- **THEN** remaining is three, reservation sold is two, status stays `active`
- **AND** inventory stock is three, reserved is three, sold is two
- **AND** vaulted and derived ledger are unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-37 - Partial sell then release closes the reservation
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

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

#### Scenario: grade10-admin-inventory-catalog-SC-38 - Vault partially vaults from a reservation
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** Vault has an active reservation of quantity five, remaining five,
  and the product has stock five and reserved five
- **WHEN** Vault vaults quantity two from that reservation
- **THEN** remaining is three, reservation vaulted is two, status stays `active`
- **AND** inventory stock is three, reserved is three, vaulted is two
- **AND** sold and derived ledger are unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-39 - Vault cannot sell from reservation
**Serves:** grade10-admin-inventory-catalog-US-03 - Auction operator holds stock the vault cannot touch

- **GIVEN** Vault has an active reservation
- **WHEN** a caller uses the Vault entrypoint and attempts sell-from-reservation
- **THEN** no sell-from-reservation method is exposed on that entrypoint

#### Scenario: grade10-admin-inventory-catalog-SC-40 - Auction cannot vault from reservation
**Serves:** grade10-admin-inventory-catalog-US-03 - Auction operator holds stock the vault cannot touch

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

#### Scenario: grade10-admin-inventory-catalog-SC-23 - Product update records operator and snapshots
**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** an existing product named `Card A`
- **WHEN** an authorized inventory admin renames it to `Card B`
- **THEN** one `product-update` change identifies the operator
- **AND** its changed entity is `product`
- **AND** before contains `Card A` and after contains `Card B`

#### Scenario: grade10-admin-inventory-catalog-SC-24 - Intake history carries the added quantity
**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** an inventory with stock two (derived ledger two)
- **WHEN** an authorized inventory admin intakes quantity three
- **THEN** one `intake` change records quantity three
- **AND** its changed entity is `inventory`
- **AND** before and after show stock increasing by three

#### Scenario: grade10-admin-inventory-catalog-SC-25 - Reserve history records hold and snapshot
**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** Auction requests a valid quantity-two reservation
- **WHEN** the reservation succeeds
- **THEN** one `reserve` change records quantity two and the reservation id
- **AND** before and after show reserved increasing by two

#### Scenario: grade10-admin-inventory-catalog-SC-26 - Release history records hold and snapshot
**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** Vault has an active reservation with remaining two
- **WHEN** Vault releases it
- **THEN** one `release` change records quantity two and the reservation id
- **AND** before and after show reserved decreasing by two

#### Scenario: grade10-admin-inventory-catalog-SC-27 - Terminal history records action details
**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** an inventory with available stock
- **WHEN** an authorized inventory admin records a free-pool sale and later a
  withdrawal
- **THEN** one `sell` change records the sold quantity, price, and currency
- **AND** one `withdraw` change records the withdrawn quantity and reason

#### Scenario: grade10-admin-inventory-catalog-SC-28 - Refused write leaves history unchanged
**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** a product with available one
- **WHEN** Auction attempts to reserve quantity two and Grade10 refuses
- **THEN** no new change is appended

#### Scenario: grade10-admin-inventory-catalog-SC-41 - Sell-from-reservation history
**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** Auction has an active reservation with remaining five
- **WHEN** Auction sells quantity two from that reservation
- **THEN** one `sell-from-reservation` change records quantity two and the
  reservation id
- **AND** before and after show inventory sold increasing by two and reserved
  decreasing by two

#### Scenario: grade10-admin-inventory-catalog-SC-42 - Vault-from-reservation history
**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** Vault has an active reservation with remaining five
- **WHEN** Vault vaults quantity two from that reservation
- **THEN** one `vault-from-reservation` change records quantity two and the
  reservation id
- **AND** before and after show inventory vaulted increasing by two and reserved
  decreasing by two

#### Scenario: grade10-admin-inventory-catalog-SC-43 - Adjust history records new quantity
**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** an active Auction reservation with quantity three
- **WHEN** it is adjusted to quantity five
- **THEN** one `adjust` change records quantity five and the reservation id
- **AND** before and after show reserved increasing by two and remaining
  increasing by two

#### Scenario: grade10-admin-inventory-catalog-SC-44 - Adjust decrease records freed quantity
**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** an active Auction reservation with quantity five and remaining five
- **WHEN** it is adjusted to quantity two
- **THEN** one `adjust` change records quantity two and the reservation id
- **AND** before and after show reserved decreasing by three

#### Scenario: grade10-admin-inventory-catalog-SC-45 - Change-product history records both inventories
**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

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
the product page (partial or full, per grade10-admin-inventory-catalog-SC-35). Free-pool sell and
withdraw, adjust, change reservation product, release,
sell-from-reservation, and vault-from-reservation for Auction and Vault holds
SHALL be triggered from holder consoles or elevated APIs, not from the inventory
product page. Auction and Vault reservation rows on the product page are
read-only oversight; only `admin` rows MAY offer Release on this page
(grade10-admin-inventory-catalog-SC-68). Loading, empty, and error states SHALL be visible.

#### Scenario: grade10-admin-inventory-catalog-SC-59 - Operator reserves admin hold from product page
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** a created product with stock five and reserved zero
- **WHEN** an authorized inventory admin reserves quantity two from the product
  page with optional remarks
- **THEN** one active reservation records `holder_kind` `admin`, a server-minted
  `holder_reference`, quantity two, and the remarks
- **AND** reserved increases by two while stock and derived ledger remain
  unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-60 - Operator releases admin hold from product page
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

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

#### Scenario: grade10-admin-inventory-catalog-SC-68 - Product page release is limited to admin holds
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** a created product with active Auction, Vault, and `admin`
  reservations on the product page
- **WHEN** an authorized inventory admin views the reservations table
- **THEN** only `admin` rows offer a Release action
- **AND** Auction and Vault rows show no settlement actions on this page

#### Scenario: grade10-admin-inventory-catalog-SC-29 - Operator oversees inventory and holds on the product page
**Serves:** Admin console - operator oversees inventory and holds on the product page

- **GIVEN** a created product with Auction, Vault, and `admin` reservations and
  prior vaulted and sold transitions
- **WHEN** an authorized inventory admin opens that product page
- **THEN** all counts including vaulted, each holder kind's reservations with
  remaining, and change history appear
- **AND** both count equations reconcile

#### Scenario: grade10-admin-inventory-catalog-SC-30 - Empty products table
**Serves:** Admin console - empty products table

- **GIVEN** no products
- **WHEN** an authorized inventory admin opens Inventory
- **THEN** the products table shows an empty state

#### Scenario: grade10-admin-inventory-catalog-SC-31 - Intake form updates the snapshot on the product page
**Serves:** Admin console - intake form updates the snapshot on the product page

- **GIVEN** a product page for an existing product
- **WHEN** an authorized inventory admin intakes quantity two
- **THEN** its stock increases by two (derived ledger likewise)
- **AND** one intake entry appears in history

#### Scenario: grade10-admin-inventory-catalog-SC-58 - Operator creates a product from the products list
**Serves:** Admin console - operator creates a product from the products list

- **GIVEN** an authorized inventory admin on the products list
- **WHEN** they create a product with a valid name
- **THEN** they land on the new product page in status `draft`
- **AND** the inventory snapshot shows zero counts

### Requirement: Elevated admin reservation mutations

The inventory worker's elevated `reservations.reserve` and `reservations.release`
procedures SHALL implement the same `admin` hold semantics as the product page
(`grade10-admin-inventory-catalog-SC-59`, `grade10-admin-inventory-catalog-SC-60`). `reservations.reserve` SHALL NOT accept
`holder_kind` or `holder_reference` from the caller; it SHALL always create
`holder_kind` `admin` with a server-minted `holder_reference`. Each call SHALL
create a new active reservation (no idempotent retry on reference).

#### Scenario: grade10-admin-inventory-catalog-SC-67 - Elevated admin reserve mints holder reference
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

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

#### Scenario: grade10-admin-inventory-catalog-SC-32 - Unauthorized inventory read is refused
**Serves:** Admin console - unauthorized inventory read is refused

- **GIVEN** a signed-in person without inventory admin grants
- **WHEN** they request the product list
- **THEN** Grade10 refuses the request

#### Scenario: grade10-admin-inventory-catalog-SC-33 - Inventory section hidden without grants
**Serves:** Admin console - inventory section hidden without grants

- **GIVEN** a signed-in person without inventory admin grants
- **WHEN** they use the Grade10 admin panel
- **THEN** the Inventory section is not offered

#### Scenario: grade10-admin-inventory-catalog-SC-34 - Public caller cannot reach holder methods
**Serves:** Admin console - public caller cannot reach holder methods

- **GIVEN** a collector or unauthenticated caller
- **WHEN** they request an inventory HTTP route
- **THEN** no reserve, release, adjust, sell-from-reservation,
  vault-from-reservation, or holder-scoped read method is exposed

### Requirement: Product identity uses IP, Category, and Item

A product is named by its IP, Category and Item, and everything else about it
is a typed attribute.

**Hierarchy** - Every product SHALL be identified by exactly one IP, one
Category, and one Item classification.

**No free-form metadata** - The product contract and admin product form SHALL
NOT carry a Collectible type or free-form product metadata.

**Product facts** - Product facts beyond the classification SHALL be stored as
typed attributes governed by the product's schema, except for facts that
describe an individual inventory unit.

#### Scenario: grade10-admin-inventory-catalog-SC-93 - Product form shows the complete hierarchy
**Serves:** grade10-admin-inventory-catalog-US-70 - Operator configures the product identity and display

- **GIVEN** an authorized inventory admin opens a product form
- **WHEN** they inspect the identity fields
- **THEN** IP, Category, and Item are available
- **AND** no Collectible type field or product metadata editor is available

#### Scenario: grade10-admin-inventory-catalog-SC-94 - Product contract has no legacy identity fields
**Serves:** grade10-admin-inventory-catalog-US-70 - Operator configures the product identity and display

- **GIVEN** an authorized inventory admin creates or reads a product
- **WHEN** Grade10 returns the product
- **THEN** its identity is represented by IP, Category, and Item
- **AND** the product carries no Collectible type or product metadata field

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

### Requirement: Card product schemas use one shared typed template

Every card tuple gets its own schema, built from one shared set of product
fields.

**Card template** - The admin SHALL be able to create or revise a product
schema for one exact existing IP + Item + Category tuple through the schema
editor or a schema manifest upload. The common card template SHALL use the
product name and the attributes below.

**One schema per tuple** - Each tuple SHALL have its own schema configuration,
and the same template MAY be reused for every workbook Category label after an
admin maps that label to existing IP, Item, and Category tags.

**Workbook Item column** - The workbook's Item column SHALL map to product
name, not to the Grade10 Item tag.

| Product field | Stable key | Type | Requirement |
| --- | --- | --- | --- |
| Product name | Product `Name` | Text | Required |
| Year | `year` | Number | Required |
| Set | `set` | Text | Required |
| Subject | `subject` | Text | Required |
| Card Number | `card_number` | Text | Optional |
| Variety | `variety` | Text | Optional |

**Copy facts** - Serial, Cert ID, Grade Issuer, Grade, and Autograph Grade
SHALL be copy-level inventory facts and SHALL NOT be assigned as product
attributes by this card template.

#### Scenario: grade10-admin-inventory-catalog-SC-108 - Shared card template defines product facts
**Serves:** grade10-admin-inventory-catalog-US-72 - Operator configures card schemas and imports products

- **GIVEN** an authorized inventory admin opens product schema management
- **WHEN** they create a card schema from the shared template
- **THEN** Year is a required number and Set and Subject are required text
- **AND** Card Number and Variety are optional text
- **AND** Serial, Cert ID, Grade Issuer, Grade, and Autograph Grade are not product attributes

#### Scenario: grade10-admin-inventory-catalog-SC-109 - Source classification maps to existing tags
**Serves:** grade10-admin-inventory-catalog-US-72 - Operator configures card schemas and imports products

- **GIVEN** workbook rows share a broad Category but have different Set values or other source fields that identify distinct product families
- **WHEN** an authorized inventory admin maps a source classification key for a card schema
- **THEN** the key includes Category and enough additional source fields to resolve one exact existing IP, Item, and Category tuple
- **AND** a Category-only mapping is refused when that Category has multiple tuple targets
- **AND** a broad source Category such as TCG can map Pokémon, Lorcana, and One Piece rows to their respective existing tuples
- **AND** Grade10 uses the workbook Item value as product name
- **AND** Grade10 keeps source field values visible with their mapping
- **AND** Grade10 does not infer or create taxonomy tags from workbook labels

### Requirement: Schema manifests create drafts for review

An admin uploads a schema manifest, and a valid one lands as drafts to review
and publish.

**Schema manifest** - An authorized inventory admin SHALL be able to upload a
CSV or XLSX schema manifest that defines reusable attribute keys and assigns
them to exact existing IP + Item + Category tuples.

**Preview** - The preview SHALL validate stable keys, supported types,
requiredness, validation rules, displayed labels, and select options against
the existing product-schema rules.

**Mapping** - Each distinct source classification key SHALL be explicitly
mapped to one existing tag tuple. Category alone SHALL NOT map to multiple
tuples.

**Drafts only** - A valid manifest SHALL create draft schema revisions only;
it SHALL NOT publish them. An invalid manifest SHALL create no partial
revisions.

**Review and publish** - The admin SHALL review and publish each schema
through the existing publish flow, including its validation of affected
products.

#### Scenario: grade10-admin-inventory-catalog-SC-110 - Schema manifest imports as drafts
**Serves:** grade10-admin-inventory-catalog-US-72 - Operator configures card schemas and imports products

- **GIVEN** an authorized inventory admin has mapped each distinct source classification key to an existing tag tuple
- **WHEN** they preview and import a valid manifest
- **THEN** Grade10 creates draft schema revisions for the mapped tuples
- **AND** the current published schemas remain active until each revision is published

#### Scenario: grade10-admin-inventory-catalog-SC-111 - Invalid schema manifest creates no revisions
**Serves:** grade10-admin-inventory-catalog-US-72 - Operator configures card schemas and imports products

- **GIVEN** a schema manifest contains an unmapped source classification key, an ambiguous Category-only mapping, or an invalid attribute definition
- **WHEN** an authorized inventory admin validates and imports the manifest
- **THEN** Grade10 reports the affected rows and reasons
- **AND** no schema revision from that manifest is created or published

### Requirement: Mapped workbook values use consistent normalization

Every imported cell is trimmed, and an empty or `-` cell means nothing was
supplied.

**Trimming** - Schema-manifest, product-entry, and inventory imports SHALL
trim surrounding whitespace from every mapped workbook value.

**Absent values** - After trimming, an empty cell or a standalone `-` SHALL
mean absent; a hyphen inside a value SHALL remain part of that value. An
absent required value SHALL fail row validation. An absent optional value
SHALL remain absent.

**Uploaded file** - Import SHALL NOT modify the uploaded file.

#### Scenario: grade10-admin-inventory-catalog-SC-115 - Mapped values trim and omit blank placeholders
**Serves:** grade10-admin-inventory-catalog-US-72 - Operator configures card schemas and imports products

- **GIVEN** product rows contain surrounding whitespace and optional Card Number or Variety cells that are blank or `-`
- **WHEN** an authorized inventory admin previews the product upload
- **THEN** Grade10 trims surrounding whitespace from mapped values
- **AND** blank and standalone `-` optional values are absent rather than stored as text
- **AND** a blank or `-` required value is reported as missing
- **AND** the uploaded workbook is unchanged

### Requirement: Product uploads create products without inventory

A product upload enters product names and schema values, and creates no
stock.

**Product upload** - An authorized inventory admin SHALL be able to upload a
product-entry file separately from an inventory file. Product upload SHALL
accept CSV and XLSX workbooks with one or more sheets.

**Each row** - Each included row SHALL provide a product name, a mapping from
a sufficiently specific source classification key to one existing IP + Item +
Category tuple, and values for the published schema assigned to that tuple. A
Category-only key SHALL NOT be used when a broad Category contains rows for
different product families or tuple targets.

**Preview** - Before commit, Grade10 SHALL preview row validation and product
matches. The source fields SHALL remain visible beside their mapping in the
preview.

**Identical rows** - Identical rows for the same product name, exact tuple,
and schema values SHALL resolve to one product.

**On commit** - A successful commit SHALL create or reuse products without
creating inventory units, Cert IDs, or stock. New products SHALL use the
existing draft lifecycle, and the admin SHALL mark each valid draft `created`
through the existing product status flow before inventory upload.

**Product name** - Product name SHALL NOT be a global uniqueness constraint:
rows with the same product name and tuple but different schema values SHALL
remain distinct.

**Blocked** - Missing mappings, missing required values, or invalid values
SHALL block the entire commit.

#### Scenario: grade10-admin-inventory-catalog-SC-112 - Product upload creates one draft per identity
**Serves:** grade10-admin-inventory-catalog-US-72 - Operator configures card schemas and imports products

- **GIVEN** an authorized inventory admin has mapped each source classification key and a published card schema exists for each target tuple
- **WHEN** they preview and commit product rows containing repeated identical card identities
- **THEN** Grade10 creates one draft product for each distinct product name, exact tuple, and schema-value set
- **AND** no inventory quantity, unit record, or Cert ID is created
- **WHEN** the admin marks each valid imported draft `created` through the existing product status flow
- **THEN** only products with complete classification and valid required schema values become `created`

#### Scenario: grade10-admin-inventory-catalog-SC-114 - Same name keeps distinct card identities
**Serves:** grade10-admin-inventory-catalog-US-72 - Operator configures card schemas and imports products

- **GIVEN** uploaded rows share a product name and exact tuple but differ by Card Number or Set
- **WHEN** an authorized inventory admin previews and commits the product upload
- **THEN** Grade10 creates one draft product for each distinct schema-value set
- **AND** rows with repeated product name alone do not merge or block one another
- **AND** no inventory quantity, unit record, or Cert ID is created

#### Scenario: grade10-admin-inventory-catalog-SC-113 - Product upload refuses incomplete rows atomically
**Serves:** grade10-admin-inventory-catalog-US-72 - Operator configures card schemas and imports products

- **GIVEN** an authorized inventory admin uploads product rows with an unmapped Category label, missing required value, or invalid schema value
- **WHEN** they validate and attempt to commit the upload
- **THEN** Grade10 identifies the affected rows and reasons
- **AND** no product from that upload is created or changed

### Requirement: Inventory uploads create matched physical units atomically

An inventory upload adds one physical unit per row against products that
already exist, all at once or not at all.

**Inventory upload** - An authorized inventory admin SHALL be able to upload
inventory rows separately from product entries. Inventory upload SHALL accept
CSV and XLSX workbooks with one or more sheets, where each included row
represents one physical unit.

**Source label** - The source Category label SHALL remain visible beside its
mapping in the preview.

**Product match** - Grade10 SHALL match each row to exactly one existing
`created` product using the exact mapped IP + Item + Category tuple, product
name, and supplied schema values. A Category-only mapping SHALL NOT be used
when source rows in that Category require different tuple targets.

**Preview** - The import preview SHALL show the resolved product and each
copy-level fact before commit. It SHALL preserve Cert ID, Grade Issuer, Grade,
Autograph Grade, and Serial as copy-level facts.

**Grade Issuer** - Every included row SHALL identify its Grade Issuer as `RAW`
or a grading issuer.

**Cert ID** - A `RAW` row MUST NOT have a Cert ID; every graded row MUST have
one. Grade10 SHALL trim surrounding whitespace from a supplied Cert ID before
checking duplicates; duplicates within the upload or within the matched
product inventory SHALL block the whole commit.

**Blank Item Status** - Each blank Item Status row SHALL have its own explicit
include or exclude decision before commit, with no default applied to other
rows.

**On commit** - Successful commit SHALL add one unit per included row, update
inventory counts, store copy facts, and append the corresponding inventory
history in one atomic operation.

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
**Serves:** grade10-admin-inventory-catalog-US-73 - Operator bulk imports matched inventory units

- **GIVEN** an authorized inventory admin uploads rows that each match one created product
- **WHEN** they preview and confirm the inventory upload
- **THEN** each row resolves to one product and one physical unit
- **AND** Cert ID, Grade Issuer, Grade, Autograph Grade, and Serial are shown as copy-level facts
- **AND** the rows are committed only after confirmation

#### Scenario: grade10-admin-inventory-catalog-SC-117 - Blank status requires per-row choice and RAW has no Cert ID
**Serves:** grade10-admin-inventory-catalog-US-73 - Operator bulk imports matched inventory units

- **GIVEN** an inventory upload has two blank Item Status rows, one `RAW` row without Cert ID and one graded row with Cert ID
- **WHEN** an authorized inventory admin previews the upload without deciding either row
- **THEN** Grade10 requires an explicit include or exclude decision for each blank-status row
- **WHEN** the admin includes the RAW row and excludes the graded row
- **THEN** the RAW row is valid without Cert ID
- **AND** only the included RAW row adds a unit and stock

#### Scenario: grade10-admin-inventory-catalog-SC-118 - Missing or ambiguous product match blocks import
**Serves:** grade10-admin-inventory-catalog-US-73 - Operator bulk imports matched inventory units

- **GIVEN** an inventory upload contains a row with no matching product or more than one matching product
- **WHEN** an authorized inventory admin attempts to commit the upload
- **THEN** Grade10 identifies the unmatched or ambiguous row
- **AND** no row in the upload changes inventory or history

#### Scenario: grade10-admin-inventory-catalog-SC-119 - Duplicate Cert ID blocks the whole upload
**Serves:** grade10-admin-inventory-catalog-US-73 - Operator bulk imports matched inventory units

- **GIVEN** an inventory upload contains a Cert ID already present under its matched product inventory or repeated in another upload row
- **WHEN** an authorized inventory admin attempts to commit the upload
- **THEN** Grade10 reports the duplicate after trimming surrounding whitespace
- **AND** no row in the upload changes inventory, unit records, or history

#### Scenario: grade10-admin-inventory-catalog-SC-120 - Invalid inventory row leaves every unit unchanged
**Serves:** grade10-admin-inventory-catalog-US-73 - Operator bulk imports matched inventory units

- **GIVEN** an inventory upload contains a row with an invalid value or unresolved required mapping
- **WHEN** an authorized inventory admin validates and attempts to commit the upload
- **THEN** Grade10 reports the row and reason
- **AND** no inventory count, unit fact, or history entry from that upload is committed

#### Scenario: grade10-admin-inventory-catalog-SC-121 - Copy facts trim and omit blank placeholders
**Serves:** grade10-admin-inventory-catalog-US-73 - Operator bulk imports matched inventory units

- **GIVEN** inventory rows contain surrounding whitespace and optional copy facts that are blank or `-`
- **WHEN** an authorized inventory admin previews the inventory upload
- **THEN** Grade10 trims surrounding whitespace from mapped copy facts
- **AND** blank and standalone `-` optional facts are absent rather than stored as text
- **AND** the uploaded workbook is unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-122 - Graded rows require Cert ID and RAW rows forbid it
**Serves:** grade10-admin-inventory-catalog-US-73 - Operator bulk imports matched inventory units

- **GIVEN** an inventory upload contains one `RAW` row with Cert ID and one graded row without Cert ID
- **WHEN** an authorized inventory admin validates the upload
- **THEN** Grade10 reports both rows as invalid
- **AND** no inventory quantity, unit record, or history entry is committed

### Requirement: Intake accepts optional Cert ID entries atomically

Intake receives a quantity and, when the admin has them, the records of the
units inside it.

**Intake** - An authorized inventory admin SHALL be able to intake a positive
integer quantity with zero or more individually tracked unit records.

**Each tracked unit** - Each tracked unit SHALL identify its Grade Issuer and
SHALL follow the Cert ID rules for `RAW` or graded units. The number of
tracked unit records SHALL be no more than the intake quantity.

**No unit records** - Intake with no unit records SHALL remain valid and SHALL
change only the aggregate inventory counters.

**Refused** - Invalid, duplicate, or overlapping identifiers SHALL refuse the
whole operation.

**History** - A successful intake SHALL append one history entry whose after
state carries the received unit records when any were supplied.

#### Scenario: grade10-admin-inventory-catalog-SC-98 - Unnumbered intake increases stock
**Serves:** grade10-admin-inventory-catalog-US-69 - Operator records a received graded unit

- **GIVEN** a created product with stock two
- **WHEN** an authorized inventory admin intakes quantity three without unit records
- **THEN** stock increases to five
- **AND** no individually tracked unit record is created

#### Scenario: grade10-admin-inventory-catalog-SC-99 - Multiple Cert IDs match intake quantity
**Serves:** grade10-admin-inventory-catalog-US-69 - Operator records a received graded unit

- **GIVEN** a created product with an inventory
- **WHEN** an authorized inventory admin intakes quantity two with one unit
  from issuer `PSA` with Cert ID `PSA-123` and one from issuer `BGS` with Cert
  ID `BGS-456`
- **THEN** stock increases by two
- **AND** both identifiers are recorded under that inventory
- **AND** one intake history entry records the two received identifiers

#### Scenario: grade10-admin-inventory-catalog-SC-100 - Too many Cert IDs refuse the intake
**Serves:** grade10-admin-inventory-catalog-US-69 - Operator records a received graded unit

- **GIVEN** a created product with an inventory
- **WHEN** an authorized inventory admin intakes quantity one with two graded
  unit records, each with Grade Issuer `PSA` and a Cert ID
- **THEN** Grade10 refuses the intake
- **AND** stock, Cert ID records, and change history are unchanged

### Requirement: Displayed Attributes always offer Cert ID as a special field

Cert ID is always on offer in Displayed Attributes, with no product attribute
behind it.

**Displayed fields** - For every product schema, the Displayed Attributes
panel SHALL offer Cert ID as a special field alongside the schema's typed
product attributes. Cert ID SHALL NOT require an ordinary attribute key.

**Include and order** - An admin SHALL be able to include or exclude the field
and place it at any position in the displayed order.

**Other attributes unchanged** - Existing typed attribute display choices
SHALL remain unchanged when Cert ID is added, moved, or removed.

#### Scenario: grade10-admin-inventory-catalog-SC-101 - Admin adds Cert ID to displayed attributes
**Serves:** grade10-admin-inventory-catalog-US-70 - Operator configures the product identity and display

- **GIVEN** an authorized inventory admin edits a product schema's Displayed Attributes panel
- **WHEN** they include Cert ID and place it before the first product attribute
- **THEN** the saved display order contains Cert ID first
- **AND** no ordinary Cert ID attribute key is created

#### Scenario: grade10-admin-inventory-catalog-SC-102 - Admin hides Cert ID without changing attributes
**Serves:** grade10-admin-inventory-catalog-US-70 - Operator configures the product identity and display

- **GIVEN** a published product schema displaying Cert ID and two typed attributes
- **WHEN** an authorized inventory admin removes Cert ID from the displayed set
- **THEN** the two typed attributes remain in their prior order
- **AND** Cert ID is not returned as a displayed field

#### Scenario: grade10-admin-inventory-catalog-SC-103 - Displayed Cert ID resolves the selected unit
**Serves:** grade10-admin-inventory-catalog-US-70 - Operator configures the product identity and display

- **GIVEN** an Auction listing selects Cert ID `PSA-123` and its product schema displays Cert ID
- **WHEN** a collector reads the listing
- **THEN** the displayed product fields include `PSA-123` in the configured position

#### Scenario: grade10-admin-inventory-catalog-SC-104 - No Cert ID contributes no displayed value
**Serves:** grade10-admin-inventory-catalog-US-70 - Operator configures the product identity and display

- **GIVEN** an Auction listing explicitly selects `No Cert ID` and its product schema displays Cert ID
- **WHEN** a collector reads the listing
- **THEN** the configured product attributes remain available
- **AND** no Cert ID row is rendered

### Requirement: Every reservation requires an explicit inventory unit choice

A reservation names the unit it takes: one Cert ID, or none.

**Explicit choice** - Any reservation created against inventory SHALL carry an
explicit unit choice. The choice SHALL be either one available Cert ID owned
by the selected product inventory or the literal choice `No Cert ID`.

**Cert ID reservation** - A Cert ID reservation SHALL have quantity one and
SHALL be exclusive to one active reservation.

**No Cert ID** - `No Cert ID` SHALL use the existing product-level quantity
reservation path without allocating a certificate record.

#### Scenario: grade10-admin-inventory-catalog-SC-105 - Reservation selects a Cert ID
**Serves:** grade10-admin-inventory-catalog-US-71 - Holder reserves a specific inventory unit

- **GIVEN** a created product with available Cert IDs `PSA-123` and `BGS-456`
- **WHEN** an authorized holder requests a reservation for `PSA-123`
- **THEN** the reservation stores the opaque Cert ID record identity
- **AND** its quantity is one and `PSA-123` is unavailable to other active reservations

#### Scenario: grade10-admin-inventory-catalog-SC-106 - Reservation selects No Cert ID
**Serves:** grade10-admin-inventory-catalog-US-71 - Holder reserves a specific inventory unit

- **GIVEN** a created product with available stock and no intended numbered unit
- **WHEN** an authorized holder explicitly requests `No Cert ID` for quantity three
- **THEN** the reservation uses product-level quantity three
- **AND** no Cert ID record is allocated

#### Scenario: grade10-admin-inventory-catalog-SC-107 - Reservation without a unit choice is refused
**Serves:** grade10-admin-inventory-catalog-US-71 - Holder reserves a specific inventory unit

- **GIVEN** a created product with available stock
- **WHEN** an authorized holder requests a reservation without a Cert ID or `No Cert ID`
- **THEN** Grade10 refuses the request without changing stock, reserved, or Cert ID records

### Requirement: Reusable product attribute keys carry localized labels and validation

An authorized inventory admin SHALL be able to define a reusable product attribute key
with a stable key, a data type, validation rules, and a displayed label for
each supported locale. The initial Grade10 locale set SHALL be English (`en`),
Traditional Chinese (`zh-Hant`), and Simplified Chinese (`zh-Hans`); the set
SHALL be expandable without changing existing field keys or product values.

The data types SHALL be `text`, `number`, `boolean`, `single-select`, or
`multi-select`. Text fields MAY define length and pattern rules. Number fields
MAY define minimum and maximum rules. Select fields SHALL define stable option
keys and SHALL allow a displayed value for each option in each supported
locale. English SHALL be required for every field label and selectable value;
non-English translations SHALL be optional. A missing non-English translation
SHALL be reported to the admin and SHALL fall back to English when displayed.

| Field | Rules |
| --- | --- |
| Key | Required, trimmed, stable, and unique across reusable fields |
| Data type | One of `text`, `number`, `boolean`, `single-select`, or `multi-select`; immutable after a product uses the field |
| Label | One English label required; a label may be supplied for every supported locale; labels are displayed values, not field keys |
| Validation | Rules valid for the selected data type; invalid combinations refused |
| Options | Required for select fields; each option has a stable key and one English displayed value; non-English displayed values are optional |
| Search/filter | Enabled for attributes assigned as required or optional product attributes |

#### Scenario: grade10-admin-inventory-catalog-SC-69 - Operator defines a localized reusable field
**Serves:** grade10-admin-inventory-catalog-US-05 - Inventory admin configures a localized product schema

- **GIVEN** an authorized inventory admin
- **WHEN** they define `card_number` as a text field with English, Traditional Chinese, and Simplified Chinese labels and a text pattern
- **THEN** Grade10 stores one reusable field with one stable key
- **AND** each supplied locale returns its own displayed label
- **AND** the attribute is available for assignment to product schemas

#### Scenario: grade10-admin-inventory-catalog-SC-70 - Invalid field definition is refused
**Serves:** grade10-admin-inventory-catalog-US-05 - Inventory admin configures a localized product schema

- **GIVEN** an authorized inventory admin
- **WHEN** they define a field with an unsupported data type, invalid validation rule, duplicate key, or a select option without an English displayed value
- **THEN** Grade10 refuses the definition
- **AND** no invalid field or option is available for product entry

### Requirement: Admins can review and correct incompatible product attributes

An authorized inventory admin SHALL be able to query the product attributes
incompatible with a saved attribute-key update or saved product-schema draft.
The result SHALL identify each affected product, attribute key, and reason. The
admin SHALL be able to correct the returned product attributes through normal
product editing. Saving the review target SHALL NOT itself change product
attributes. Product-schema publication SHALL repeat compatibility validation
and remain refused until the incompatible product attributes are corrected.

#### Scenario: grade10-admin-inventory-catalog-SC-91 - Admin corrects product attributes after a schema change
**Serves:** grade10-admin-inventory-catalog-US-08 - Inventory admin publishes a safe product-schema configuration

- **GIVEN** a saved product-schema draft makes a required `grading` attribute
  missing or invalid on matching products
- **WHEN** an authorized inventory admin reviews incompatible product attributes
- **THEN** Grade10 returns every affected product, its `grading` attribute key,
  and the incompatibility reason
- **WHEN** the admin corrects each returned product through product editing
- **THEN** the review no longer returns those product attributes
- **AND** the product schema can publish when no other incompatibilities remain

#### Scenario: grade10-admin-inventory-catalog-SC-71 - Missing non-English translations are reported without blocking publish
**Serves:** grade10-admin-inventory-catalog-US-08 - Inventory admin publishes a safe product-schema configuration

- **GIVEN** a reusable field has an English label and no Simplified Chinese label
- **WHEN** an authorized inventory admin reviews or publishes a product schema that uses it
- **THEN** the CMS reports the missing Simplified Chinese translation
- **AND** the product schema remains eligible for publishing
- **AND** Auction displays the English label when the active locale is Simplified Chinese

### Requirement: Product schemas configure exact IP, Item, and Category attributes

An authorized inventory admin SHALL be able to create a product schema for one
exact IP + Item + Category tuple. A product schema SHALL assign reusable
product attributes as `required` or `optional`, supply the displayed label for
every assigned attribute, and define the localized displayed values for any
select options it uses. A product schema SHALL have at most one published
configuration for an exact tuple.
The IP, Item, and Category tags SHALL all participate in selecting a content
type.

| Product-schema attribute | Rules |
| --- | --- |
| IP | One existing universal IP tag; required |
| Item | One existing universal Item tag; required |
| Category | One existing universal Category tag; required |
| Assigned attributes | Reusable product attributes, each assigned once with `required` or `optional` status |
| Displayed labels | One English label per assigned attribute required; translations optional; a product schema may override the reusable attribute's labels |
| Option values | Stable option keys with localized displayed values; English required, other supported locales optional |

#### Scenario: grade10-admin-inventory-catalog-SC-72 - Operator configures a Pokémon TCG product schema
**Serves:** grade10-admin-inventory-catalog-US-05 - Inventory admin configures a localized product schema

- **GIVEN** reusable fields for language, card number, card set, grading, and PSA population
- **WHEN** an authorized inventory admin configures the exact `Pokémon` + `Single card` + `TCG` product schema
- **THEN** language, card number, card set, and grading can be assigned as required or optional attributes
- **AND** PSA population can be assigned as an optional attribute
- **AND** every assigned attribute has its own displayed label separate from its stable key

#### Scenario: grade10-admin-inventory-catalog-SC-73 - Duplicate published product schema for exact tuple is refused
**Serves:** grade10-admin-inventory-catalog-US-05 - Inventory admin configures a localized product schema

- **GIVEN** a published product schema for the exact `Pokémon` + `Single card` + `TCG` tuple
- **WHEN** an authorized inventory admin attempts to publish another product schema for that exact tuple
- **THEN** Grade10 refuses the publish
- **AND** the existing published product schema remains active

### Requirement: Products store values that satisfy their product schema

When a product has an exact published product schema, an authorized inventory
admin SHALL be able to enter values for its assigned attributes while creating or
editing the product. A draft MAY omit required values and MAY be saved without
a matching product schema, but every value supplied SHALL satisfy its attribute's
data type and validation rules. A product SHALL NOT be marked `created` without
complete universal classification, a matching published product schema, and all
required values.

Product values SHALL retain the stable field key and the underlying value. A
text value MAY have one value per supported locale. A number or boolean SHALL
have one language-neutral value. A select value SHALL use its stable option
key, and a multi-select value SHALL use a set of stable option keys. When a
value is displayed, Grade10 SHALL use the active locale's value or fall back
to English when that translation is missing.

#### Scenario: grade10-admin-inventory-catalog-SC-74 - Product without a matching product schema remains a draft
**Serves:** grade10-admin-inventory-catalog-US-06 - Inventory admin enters a validated product

- **GIVEN** an authorized inventory admin creates a product with valid universal classification but no published product schema for its IP + Item + Category tuple
- **WHEN** they save the product
- **THEN** Grade10 saves it as `draft`
- **AND** the product cannot be marked `created`
- **AND** no Auction reservation or listing may use it

#### Scenario: grade10-admin-inventory-catalog-SC-75 - Operator saves localized Pokémon TCG values
**Serves:** grade10-admin-inventory-catalog-US-06 - Inventory admin enters a validated product

- **GIVEN** a published Pokémon + Single card + TCG product schema with required language, card number, card set, and grading attributes
- **WHEN** an authorized inventory admin supplies valid English, Traditional Chinese, and Simplified Chinese values where translations are available
- **THEN** Grade10 stores the values under their stable field keys
- **AND** each product read returns the field's displayed label and the value for the requested locale

#### Scenario: grade10-admin-inventory-catalog-SC-76 - Invalid structured value is refused
**Serves:** grade10-admin-inventory-catalog-US-06 - Inventory admin enters a validated product

- **GIVEN** a product with a published product schema whose card number requires a configured pattern
- **WHEN** an authorized inventory admin supplies a value that fails that pattern or the field's data type
- **THEN** Grade10 refuses the product update
- **AND** the product's previous structured values remain unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-77 - Missing required value blocks creation
**Serves:** grade10-admin-inventory-catalog-US-06 - Inventory admin enters a validated product

- **GIVEN** a draft product with a published product schema and no grading value
- **WHEN** an authorized inventory admin attempts to mark it `created`
- **THEN** Grade10 refuses the status change
- **AND** reports grading as a missing required value

#### Scenario: grade10-admin-inventory-catalog-SC-78 - Missing optional value remains valid
**Serves:** grade10-admin-inventory-catalog-US-06 - Inventory admin enters a validated product

- **GIVEN** a published Pokémon + Single card + TCG product schema where PSA population is optional
- **WHEN** an authorized inventory admin marks a product with no PSA population value `created`
- **THEN** Grade10 accepts the status change when all required values are valid
- **AND** the missing optional value remains absent

#### Scenario: grade10-admin-inventory-catalog-SC-79 - A missing locale falls back to English
**Serves:** grade10-admin-inventory-catalog-US-06 - Inventory admin enters a validated product

- **GIVEN** a product has an English grading value and no Simplified Chinese grading translation
- **WHEN** Auction reads the product in Simplified Chinese
- **THEN** the English grading value is displayed
- **AND** no stable field key or raw translation key is displayed

#### Scenario: grade10-admin-inventory-catalog-SC-92 - Admin opens a product filter from an attribute
**Serves:** grade10-admin-inventory-catalog-US-06 - Inventory admin enters a validated product

- **GIVEN** an inventory admin can see an IP, Item, Category, product attribute
  key, or product attribute value in a product list, product editor, schema
  review, or compatibility review
- **WHEN** the admin selects that visible attribute
- **THEN** Grade10 opens the product filter view with the selected stable
  classification or attribute criterion applied
- **AND** the filter view uses the displayed localized label and value
- **AND** the admin can clear the applied criterion

### Requirement: Universal tags and product attributes are searchable and filterable

Auction SHALL support search and filter criteria for every universal IP, Item,
and Category tag and every required or optional product attribute assigned by a
product schema. The filter control and displayed values SHALL use the active locale,
while matching SHALL preserve the stable field and option identity. A product
without a value for an optional field SHALL be excluded when that field is
filtered, and SHALL remain in an unfiltered result.

#### Scenario: grade10-admin-inventory-catalog-SC-80 - Auction filters by universal and structured fields
**Serves:** grade10-admin-inventory-catalog-US-07 - Collector finds and reads a card through Auction fields

- **GIVEN** Auction products with different IP, Category, language, and grading values
- **WHEN** a collector filters by an IP tag, a product attribute, or both
- **THEN** Auction returns only products whose stable tag or field value matches
- **AND** the filter labels and values use the active locale

#### Scenario: grade10-admin-inventory-catalog-SC-81 - Missing optional value is excluded from its filter
**Serves:** grade10-admin-inventory-catalog-US-07 - Collector finds and reads a card through Auction fields

- **GIVEN** one Auction product has a PSA population value and another has no PSA population value
- **WHEN** a collector filters by a PSA population value
- **THEN** only the product with that value matches
- **AND** the product without a value remains available in an unfiltered result

#### Scenario: grade10-admin-inventory-catalog-SC-82 - Listing attribute cannot be filtered
**Serves:** grade10-admin-inventory-catalog-US-07 - Collector finds and reads a card through Auction fields

- **GIVEN** an Auction listing has a `vaulted` listing attribute
- **WHEN** a collector opens Auction search and filter controls
- **THEN** `vaulted` is not offered as a search or filter criterion
- **AND** its stored value remains available for Auction display

### Requirement: Auction listing attributes and presentation are scoped to a listing

An authorized auction admin SHALL choose and order the product attributes shown
for each published IP + Item + Category product schema. The selection MAY
include universal tags and required or optional product attributes. A product
attribute that is stored and searchable MAY be omitted from Auction display.

An authorized auction admin SHALL be able to enter listing attributes on each
Auction listing. A listing attribute belongs to one listing, not the product.
It is display-only: Grade10 SHALL not require a configured key, data type,
validation rule, or translation. The listing attribute document SHALL preserve
the administrator's item order and MAY carry a localized displayed label and
value for each item. When a requested locale is absent, Auction SHALL use the
item's English value when present, then its supplied value. Listing attributes
SHALL NOT be searchable or filterable.

Auction SHALL obtain a published listing's product fields through the current
published product schema's Inventory display contract, then render those fields
in that schema's configured order followed by the listing's own listing
attribute document in saved item order. The contract SHALL return only fields
selected by the published schema, with localized labels and values resolved
through the supported fallback. Inventory SHALL retain published revisions and
their referenced product attributes while an Auction listing can read them, and
SHALL refuse a schema publication whose selected display fields cannot be
resolved. An Inventory schema, attribute, or translation change MAY update the
product fields shown by a published Auction listing, but SHALL NOT make that
listing fail to render.

#### Scenario: grade10-admin-inventory-catalog-SC-83 - Operator configures different Auction fields per product schema
**Serves:** grade10-admin-inventory-catalog-US-07 - Collector finds and reads a card through Auction fields

- **GIVEN** Pokémon and One Piece product schemas with card number, language, and grading attributes
- **WHEN** an authorized inventory admin selects card number for Pokémon and card number plus character for One Piece
- **THEN** Pokémon Auction listings omit grading
- **AND** One Piece Auction listings show the card number and character, such as Luffy or Chopper
- **AND** both product schemas retain grading for validation and search/filter when assigned

#### Scenario: grade10-admin-inventory-catalog-SC-84 - Auction shows localized labels and values in configured order
**Serves:** grade10-admin-inventory-catalog-US-07 - Collector finds and reads a card through Auction fields

- **GIVEN** an Auction listing whose product schema selects language before card number and supplies Traditional Chinese translations
- **WHEN** a collector opens the listing in Traditional Chinese
- **THEN** the selected fields appear in the configured order
- **AND** each field uses its Traditional Chinese displayed label and value
- **AND** a missing translation falls back to English

#### Scenario: grade10-admin-inventory-catalog-SC-88 - Listing-specific PSA cert number does not change the product
**Serves:** grade10-admin-inventory-catalog-US-07 - Collector finds and reads a card through Auction fields

- **GIVEN** two Auction listings use the same Pokémon product
- **WHEN** an authorized auction admin enters a different PSA cert number on each listing
- **THEN** each listing displays its own PSA cert number
- **AND** the product's grading and product attribute values remain unchanged
- **AND** PSA cert number is not offered as an Auction search or filter criterion

#### Scenario: grade10-admin-inventory-catalog-SC-89 - Flexible listing attribute falls back to English
**Serves:** grade10-admin-inventory-catalog-US-07 - Collector finds and reads a card through Auction fields

- **GIVEN** an Auction listing has a PSA cert number item with an English label and value but no Simplified Chinese translations
- **WHEN** a collector opens the listing in Simplified Chinese
- **THEN** Auction displays the English PSA cert number label and value
- **AND** no stable listing attribute key or raw translation key is displayed

#### Scenario: grade10-admin-inventory-catalog-SC-90 - Product schema change keeps an Auction listing renderable
**Serves:** grade10-admin-inventory-catalog-US-07 - Collector finds and reads a card through Auction fields

- **GIVEN** a published Auction listing has listing attributes and its product
  has a published product schema
- **WHEN** an authorized inventory admin changes the product's schema, attributes, or translations
- **THEN** the published Auction listing renders the current resolved product
  fields and its listing attribute document
- **AND** Auction obtains its product fields through the Inventory display contract
- **AND** the Inventory change does not make the listing fail to render

### Requirement: Product schema publishing validates affected products atomically

An authorized inventory admin SHALL edit a product schema as a `draft` and
publish it only after Grade10 validates every existing product with the same
IP + Item + Category tuple against the proposed required fields, data types, and validation
rules. A product with a missing optional value SHALL pass. Missing non-English
translations SHALL be reported but SHALL NOT block publishing. If any affected
product fails product-value validation, Grade10 SHALL refuse the publish, keep
the current published configuration active, and report the affected products
and reasons.

| Configuration state | Rules |
| --- | --- |
| Draft | Editable by an authorized inventory admin; not used for created-product eligibility or Auction output |
| Published | One active configuration for an exact IP + Item + Category tuple; used for product validation and search/filter |

#### Scenario: grade10-admin-inventory-catalog-SC-85 - Invalid existing product blocks product schema publish
**Serves:** grade10-admin-inventory-catalog-US-08 - Inventory admin publishes a safe product-schema configuration

- **GIVEN** an existing product matches the product schema's IP + Item + Category tuple but lacks a newly required grading value
- **WHEN** an authorized inventory admin attempts to publish that product schema
- **THEN** Grade10 refuses the publish
- **AND** reports the product and missing value
- **AND** the previously published product schema remains active

#### Scenario: grade10-admin-inventory-catalog-SC-86 - Valid product schema publishes atomically
**Serves:** grade10-admin-inventory-catalog-US-08 - Inventory admin publishes a safe product-schema configuration

- **GIVEN** every affected product has valid required values and optional fields may be absent
- **WHEN** an authorized inventory admin publishes the product schema
- **THEN** the complete product schema configuration becomes active
- **AND** its attributes and search/filter behavior take effect together

#### Scenario: grade10-admin-inventory-catalog-SC-87 - Legacy product without a matching product schema stays visible but unavailable to Auction
**Serves:** grade10-admin-inventory-catalog-US-08 - Inventory admin publishes a safe product-schema configuration

- **GIVEN** a `created` product predates product schemas and has no published product schema for its IP + Item + Category tuple
- **WHEN** an authorized inventory admin opens the product and Auction evaluates its eligibility
- **THEN** the product remains visible to the inventory admin with a reported missing product schema
- **AND** Auction refuses to list or reserve it until a matching published product schema and valid required values exist
