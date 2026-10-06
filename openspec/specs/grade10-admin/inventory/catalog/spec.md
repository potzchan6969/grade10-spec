# grade10-admin/inventory/catalog Specification

## Purpose

Gives Grade10 one stock snapshot per catalogue product, quantity-based
application reservations with remaining / sold / vaulted / released tracking,
admin oversight by explicit `holder_kind`, an append-only trace of every count
transition, and an ordered reusable media gallery for Auction listings whose
source items stay shared at product level or associate with one physical Cert
record.

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
- Product assets
  - Reusable gallery: inventory admins prepare ordered images and video on a catalogue product for Auction listings
  - Auction eligibility: product assets follow the Auction listing media policy, so an operator can select them into a listing
- Unsold auction stock
  - Released hold: the hold of a listing that closed with no winner reads closed and released on the product page, and available rises by its units
  - Named in history: the release's remarks say an Unsold listing released it, at the close or in the clean-up of an earlier one
  - Holder and remarks: every history entry shows when, with date and time, its holder by listing code and title, and its remarks
- Cert ID details
  - Every unit listed: each Cert record, plus a `No Cert ID` row for available regular stock and one for each active hold on regular stock
  - Correct a Cert ID: an available Cert record takes another Cert ID unused on its product
  - Assign a Cert ID: one available unit of regular stock becomes a Cert record with its Cert ID alone
  - Cert ID history: each change is one history entry naming the Cert ID before and after
  - Reverse a mistaken intake: regular stock intaken since regular stock was last held, sold, withdrawn or vaulted can be reduced, never beyond its available count, and a Cert record that has only been intaken can be removed with its tagged media; stock and the ledger fall, withdrawn does not
  - Confirm first: each reversal opens a confirmation naming what leaves, with remarks prefilled `Entered by mistake`, editable and never empty; cancelling changes nothing
  - Reversal history: each reversal is one history entry under its own action, apart from intake and withdraw
- Cert-scoped source media
  - A saved source item may be untagged and shared by the product, or tagged to one Cert record owned by that product. Every Cert record has one Cert ID.
  - The tag identifies the immutable Cert record; its Cert ID is display data.
  - An authorized Inventory operator may tag or untag saved source media. Retagging clears the original association and leaves the source item untagged and shared; assigning it to another Cert requires a separate explicit tag action.
  - Inventory without a Cert ID is regular product stock, not a Cert record or a media-tag target; its media remains product-level shared media.
  - Removing a Cert unit requires physical withdrawal; the operation removes its Cert record and currently tagged source-media rows while preserving unrelated product media.
  - Removing a Cert unit that has moved requires physical withdrawal; the operation removes its Cert record and currently tagged source-media rows while preserving unrelated product media. A Cert record that has only been intaken is reversed instead, and offers no physical withdrawal.

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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-t3x rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-01 - Operator creates a draft product with empty inventory
**Serves:** grade10-admin-inventory-catalog-US-01 - Record received stock

- **GIVEN** an authorized inventory admin
- **WHEN** they create a product with a valid name
- **THEN** Grade10 persists the product with a new id and status `draft`
- **AND** creates exactly one inventory snapshot whose counts are zero
- **AND** created by is that operator

<!-- trace:scenario id=g10adm.inventory-catalog.SC-ds5 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-02 - Product create without a name is refused
**Serves:** Product stock - product create without a name is refused

- **GIVEN** an authorized inventory admin
- **WHEN** they create a product with an empty name
- **THEN** Grade10 refuses the create
- **AND** no product or inventory is persisted

<!-- trace:scenario id=g10adm.inventory-catalog.SC-pyl rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-52 - Operator marks a draft product created
**Serves:** grade10-admin-inventory-catalog-US-06 - Inventory admin enters a validated product

- **GIVEN** a draft product with complete universal classification and valid required values for its published product schema
- **WHEN** an authorized inventory admin marks it created
- **THEN** product status is `created`
- **AND** updated at advances
- **AND** one `product-update` history entry records the transition

<!-- trace:scenario id=g10adm.inventory-catalog.SC-ilx rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-rdw rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-54 - Created to draft is refused
**Serves:** grade10-admin-inventory-catalog-US-01 - Record received stock

- **GIVEN** a created product
- **WHEN** an authorized inventory admin attempts to set status to `draft`
- **THEN** Grade10 refuses the change
- **AND** status remains `created`

### Requirement: Product inventory snapshot fields

Each product SHALL own exactly one inventory snapshot. `product_id` SHALL be
unique on `inventories`. Stock up (intake) and stock down (free-pool sell or
withdraw, or an intake reversal) SHALL update this row's counters in the same locked transaction.

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
SHALL never decrease. Derived ledger SHALL rise only by intake and fall only
by an intake reversal, which takes out units that never moved
(`Regular stock intaken since its latest move can be reduced`, `An unmoved
Cert record can be removed as never received`). Stock, reserved, sold, vaulted, and withdrawn SHALL be
written by the inventory service in the same locked transaction as the
mutation — not by database triggers that sync counters from reservations.
Holder-facing available on a **`created`** product is that inventory's
available.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-m2e rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-03 - Counts reconcile across current and terminal stock
**Serves:** Product stock - counts reconcile across current and terminal stock

- **GIVEN** an inventory with stock five, reserved two, vaulted one, sold three,
  and withdrawn one
- **WHEN** an authorized inventory admin reads it
- **THEN** available is three
- **AND** derived ledger is ten

<!-- trace:scenario id=g10adm.inventory-catalog.SC-ndx rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-fiq rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-05 - Operator intakes three
**Serves:** grade10-admin-inventory-catalog-US-01 - Record received stock

- **GIVEN** a product with stock two and derived ledger four
- **WHEN** an authorized inventory admin intakes quantity three
- **THEN** the same inventory has stock five and derived ledger seven
- **AND** reserved, vaulted, sold, and withdrawn are unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-w2g rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-06 - Repeated intakes accumulate in one inventory
**Serves:** grade10-admin-inventory-catalog-US-01 - Record received stock

- **GIVEN** a product whose inventory counts are zero
- **WHEN** an authorized inventory admin intakes two and later intakes three
- **THEN** the product still has one inventory
- **AND** stock is five and derived ledger is five

<!-- trace:scenario id=g10adm.inventory-catalog.SC-qe8 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-07 - Intake appends one quantity change
**Serves:** grade10-admin-inventory-catalog-US-01 - Record received stock

- **GIVEN** an existing product
- **WHEN** an authorized inventory admin intakes quantity ten
- **THEN** one `intake` change is appended with quantity ten
- **AND** its before and after snapshots show stock increasing by ten

<!-- trace:scenario id=g10adm.inventory-catalog.SC-zn8 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-08 - Invalid intake quantity is refused
**Serves:** Product stock - invalid intake quantity is refused

- **GIVEN** an existing product
- **WHEN** an authorized inventory admin intakes quantity zero or quantity 501
- **THEN** Grade10 refuses the intake
- **AND** the inventory and history are unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-c1e rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-f89 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-10 - Operator records a sale
**Serves:** Product stock - operator records a sale

- **GIVEN** an inventory with stock five and reserved one
- **WHEN** an authorized caller sells quantity two for 10000 minor units in HKD
- **THEN** stock decreases to three and sold increases by two
- **AND** reserved and derived ledger are unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-0rc rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-11 - Operator records a withdrawal
**Serves:** Product stock - operator records a withdrawal

- **GIVEN** an inventory with three available stock
- **WHEN** an authorized caller withdraws quantity one with a reason
- **THEN** stock decreases by one and withdrawn increases by one
- **AND** derived ledger is unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-h9y rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-d4r rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-13 - Operator lists products with aggregate counts
**Serves:** Admin console - operator lists products with aggregate counts

- **GIVEN** two products with different inventory snapshots and statuses
- **WHEN** an authorized inventory admin lists products
- **THEN** both products appear with status and all stored counts plus derived
  available and ledger
- **AND** each row's counts satisfy both reconciliation equations

<!-- trace:scenario id=g10adm.inventory-catalog.SC-cfb rev=1 -->
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
| Holder label | Optional text naming the hold to a reader; the holder app may send one with any reserve, adjust, change-product or release, which replaces the stored label; a write that sends none leaves it. Auction sends `<listing code> · <title>`, leaving out a part the listing lacks. Null for `admin` holds |
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-pax rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-14 - Auction reserves a quantity
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** a **created** product with available three
- **WHEN** Auction reserves quantity two with holder reference `listing-42`
- **THEN** one active reservation records `holder_kind` `grade10-auction`, quantity two,
  and remaining two
- **AND** reserved increases by two while stock and derived ledger remain
  unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-w3w rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-15 - Same active reference retries idempotently
**Serves:** grade10-admin-inventory-catalog-US-03 - Auction operator holds stock the vault cannot touch

- **GIVEN** Auction already has an active reservation of quantity two under
  holder reference `listing-42`
- **WHEN** Auction repeats the same reservation request
- **THEN** Grade10 returns the existing reservation
- **AND** reserved count and history do not change

<!-- trace:scenario id=g10adm.inventory-catalog.SC-hef rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-16 - Closed reference may reserve again
**Serves:** grade10-admin-inventory-catalog-US-03 - Auction operator holds stock the vault cannot touch

- **GIVEN** an Auction reservation under holder reference `listing-42` is closed
- **WHEN** Auction reserves again with the same reference, product, and quantity
- **THEN** a new active reservation is created
- **AND** reserved increases by the new quantity

<!-- trace:scenario id=g10adm.inventory-catalog.SC-fac rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-140 - A holder label follows the holder's latest write
**Serves:** grade10-admin-inventory-catalog-US-09 - the admin sees which listing held the stock

- **GIVEN** Auction reserves quantity two with holder label `7KQ2P · Charizard`
- **WHEN** Auction adjusts it to quantity three with holder label
  `7KQ2P · Charizard PSA 10`, and later releases one with no label
- **THEN** the reservation's holder label reads `7KQ2P · Charizard PSA 10`
- **AND** its holder reference is unchanged

### Requirement: Active reservations conserve aggregate stock

Creating a reservation SHALL atomically increase inventory `reserved` and the
reservation's remaining by its quantity only when that quantity does not
exceed available. If there is too little available, the complete request
SHALL be refused. Inventory `reserved` SHALL equal the sum of `remaining` on
active reservations for that product. Different `holder_kind` values MAY
reserve the same product.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-b8e rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-17 - Auction and Vault reserve the same product
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** a **created** product with stock five and no reservations
- **WHEN** Auction reserves two and Vault reserves two
- **THEN** both reservations succeed with their respective `holder_kind`
- **AND** reserved is four and available is one

<!-- trace:scenario id=g10adm.inventory-catalog.SC-zty rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-18 - Concurrent reservations cannot oversubscribe stock
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** a product with available one
- **WHEN** Auction and Vault concurrently reserve quantity one
- **THEN** exactly one reservation succeeds
- **AND** the other is refused for insufficient available inventory
- **AND** reserved and the sum of active remaining are one

<!-- trace:scenario id=g10adm.inventory-catalog.SC-5ef rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-7dm rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-66 - Own reservation counts toward effective available on edit
**Serves:** grade10-admin-inventory-catalog-US-03 - Auction operator holds stock the vault cannot touch

- **GIVEN** an active Auction reservation of remaining three on a created
  product whose global available is zero
- **WHEN** Auction validates increasing that same listing's hold to quantity
  three on explicit Save
- **THEN** effective available is three and the save is allowed
- **AND** global available remains zero until the hold changes

<!-- trace:scenario id=g10adm.inventory-catalog.SC-14b rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-20 - Vault cannot see Auction reservations
**Serves:** grade10-admin-inventory-catalog-US-03 - Auction operator holds stock the vault cannot touch

- **GIVEN** Auction reserves two and Vault reserves one of the same product
- **WHEN** Vault reads that product through its holder entrypoint
- **THEN** Vault sees available and its own quantity-one reservation with
  `holder_kind` `grade10-vault`
- **AND** no Auction reservation, quantity, remarks, or reference is returned

<!-- trace:scenario id=g10adm.inventory-catalog.SC-22a rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-21 - Another kind cannot release a reservation
**Serves:** grade10-admin-inventory-catalog-US-03 - Auction operator holds stock the vault cannot touch

- **GIVEN** Auction has an active reservation
- **WHEN** Vault attempts to release its id
- **THEN** Grade10 responds as though the reservation does not exist
- **AND** the Auction reservation and reserved remain unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-ata rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-61 - Auction eligibility list omits draft and out-of-stock
**Serves:** grade10-admin-inventory-catalog-US-03 - Auction operator holds stock the vault cannot touch

- **GIVEN** a draft product with available stock, a created product with
  available zero, and a created product with available at least one
- **WHEN** Auction lists products eligible for reservation
- **THEN** only the created in-stock product is returned
- **AND** the draft and out-of-stock products are omitted

<!-- trace:scenario id=g10adm.inventory-catalog.SC-5tx rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-sge rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-22 - Vault releases a full remaining hold
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** Vault has an active reservation of quantity two and remaining two
- **WHEN** Vault releases it without specifying a quantity
- **THEN** the reservation becomes closed with released two and remaining zero
- **AND** reserved decreases by two and available increases by two
- **AND** stock and derived ledger remain unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-55o rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-8t3 rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-cub rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-48 - Decrease listing reservation 5 to 2 frees remaining
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** an active Auction reservation with quantity five and remaining five
- **WHEN** it is adjusted to quantity two
- **THEN** the same reservation id remains active with quantity two and
  remaining two
- **AND** reserved decreases by three and available increases by three
- **AND** `released` remains zero
- **AND** the reservation is not closed

<!-- trace:scenario id=g10adm.inventory-catalog.SC-w8q rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-49 - Increase refused when not enough available stock
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** an active Auction reservation with quantity three and remaining three
- **AND** product available is one
- **WHEN** it is adjusted to quantity five
- **THEN** Grade10 refuses for insufficient available inventory
- **AND** quantity, remaining, and reserved are unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-yr3 rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-vi5 rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-np5 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-63 - Product change refused when new product lacks stock
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** an active Auction reservation on product A with remaining three
- **AND** product B available is one
- **WHEN** Auction calls `changeReservationProduct` to product B with quantity
  three
- **THEN** Grade10 refuses for insufficient available inventory
- **AND** the reservation stays on product A with remaining three
- **AND** both products' **reserved** counts are unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-xig rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-64 - Product change refused for draft target product
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** an active Auction reservation on a **created** product
- **WHEN** Auction calls `changeReservationProduct` to a **draft** product
- **THEN** Grade10 refuses
- **AND** the reservation is unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-91j rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-nxz rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-36 - Auction partially sells from a reservation
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** Auction has an active reservation of quantity five, remaining five,
  and the product has stock five and reserved five
- **WHEN** Auction sells quantity two from that reservation for 8000 HKD minor
  units
- **THEN** remaining is three, reservation sold is two, status stays `active`
- **AND** inventory stock is three, reserved is three, sold is two
- **AND** vaulted and derived ledger are unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-l2k rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-ktl rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-38 - Vault partially vaults from a reservation
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** Vault has an active reservation of quantity five, remaining five,
  and the product has stock five and reserved five
- **WHEN** Vault vaults quantity two from that reservation
- **THEN** remaining is three, reservation vaulted is two, status stays `active`
- **AND** inventory stock is three, reserved is three, vaulted is two
- **AND** sold and derived ledger are unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-9p1 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-39 - Vault cannot sell from reservation
**Serves:** grade10-admin-inventory-catalog-US-03 - Auction operator holds stock the vault cannot touch

- **GIVEN** Vault has an active reservation
- **WHEN** a caller uses the Vault entrypoint and attempts sell-from-reservation
- **THEN** no sell-from-reservation method is exposed on that entrypoint

<!-- trace:scenario id=g10adm.inventory-catalog.SC-8j6 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-40 - Auction cannot vault from reservation
**Serves:** grade10-admin-inventory-catalog-US-03 - Auction operator holds stock the vault cannot touch

- **GIVEN** Auction has an active reservation
- **WHEN** a caller uses the Auction entrypoint and attempts vault-from-reservation
- **THEN** no vault-from-reservation method is exposed on that entrypoint

### Requirement: Change history fields identify every transition

Every successful product or inventory mutation SHALL append one domain change
entry in the same transaction. Each entry SHALL carry:

| Field            | Rules                                                                                                                                                                                                                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Id               | Unique, system-minted, immutable                                                                                                                                                                                                                                                                            |
| Occurred at      | Server time of the successful mutation, immutable                                                                                                                                                                                                                                                           |
| Inventory id     | Identity of the product's one inventory                                                                                                                                                                                                                                                                     |
| Changed entity   | `product` for metadata changes; `inventory` for stock and reservation changes                                                                                                                                                                                                                               |
| Actor kind       | `operator`, `application`, or `server`                                                                                                                                                                                                                                                                      |
| Actor id         | Operator user id; `grade10-auction` or `grade10-vault`; null for server                                                                                                                                                                                                                                     |
| Action           | `product-create`, `product-update`, `intake`, `reserve`, `adjust`, `change-product`, `release`, `sell-from-reservation`, `vault-from-reservation`, `sell`, `withdraw`, `cert-id-change`, or `intake-reversal`                                                                                                                |
| Quantity         | Positive transition quantity for inventory actions; one for cert-id-change; for intake-reversal, the units taken out, one for a Cert record; for adjust or change-product, the new quantity; null for product metadata                                                                                                                                                       |
| Reservation id   | Required for reserve, adjust, change-product, release, sell-from-reservation, vault-from-reservation; null otherwise                                                                                                                                                                                        |
| Sold total price | Positive integer minor units for sell / sell-from-reservation; null otherwise                                                                                                                                                                                                                               |
| Sold currency    | ISO 4217 code for sell / sell-from-reservation; null otherwise                                                                                                                                                                                                                                              |
| Reason           | The entry's remarks. Required for withdraw and intake-reversal; optional for intake and cert-id-change; on a release Auction makes for a listing that closed with no winner, `Released by unsold listing` at its close and `Released by unsold listing (clean-up)` from the one-off release of an earlier close; null otherwise |
| Before           | Canonical snapshot immediately before; null for product-create. For cert-id-change it carries the unit's Cert record as it was, and no Cert record when the unit was regular stock, read as `No Cert ID`. For an intake-reversal of a Cert record it carries the record removed                                                                                                    |
| After            | Canonical snapshot immediately after. For cert-id-change it carries the unit's Cert record as it now is                                                                                                                                                                                                     |

Product actions SHALL snapshot product metadata. Inventory actions SHALL
snapshot the affected inventory; reservation-affecting actions SHALL also
snapshot the reservation header. A cert-id-change SHALL snapshot the affected
inventory, and the unit's Cert record on each side where it has one. An
intake-reversal SHALL snapshot the affected inventory, and before it the Cert
record it removed where it removed one. Every intake, terminal transition,
intake reversal, reserve,
adjust, release, sell-from-reservation, and vault-from-reservation that changes
a stored quantity SHALL record that quantity in the changelog.

An elevated operator request SHALL also append one platform audit entry.
Failed, refused, and idempotent no-op writes SHALL append neither history nor
audit.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-l3a rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-23 - Product update records operator and snapshots

**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** an existing product named `Card A`
- **WHEN** an authorized inventory admin renames it to `Card B`
- **THEN** one `product-update` change identifies the operator
- **AND** its changed entity is `product`
- **AND** before contains `Card A` and after contains `Card B`

<!-- trace:scenario id=g10adm.inventory-catalog.SC-y6f rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-24 - Intake history carries the added quantity

**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** an inventory with stock two (derived ledger two)
- **WHEN** an authorized inventory admin intakes quantity three
- **THEN** one `intake` change records quantity three
- **AND** its changed entity is `inventory`
- **AND** before and after show stock increasing by three

<!-- trace:scenario id=g10adm.inventory-catalog.SC-1i4 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-25 - Reserve history records hold and snapshot

**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** Auction requests a valid quantity-two reservation
- **WHEN** the reservation succeeds
- **THEN** one `reserve` change records quantity two and the reservation id
- **AND** before and after show reserved increasing by two

<!-- trace:scenario id=g10adm.inventory-catalog.SC-k0a rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-26 - Release history records hold and snapshot

**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** Vault has an active reservation with remaining two
- **WHEN** Vault releases it
- **THEN** one `release` change records quantity two and the reservation id
- **AND** before and after show reserved decreasing by two

<!-- trace:scenario id=g10adm.inventory-catalog.SC-vgc rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-27 - Terminal history records action details

**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** an inventory with available stock
- **WHEN** an authorized inventory admin records a free-pool sale and later a
  withdrawal
- **THEN** one `sell` change records the sold quantity, price, and currency
- **AND** one `withdraw` change records the withdrawn quantity and reason

<!-- trace:scenario id=g10adm.inventory-catalog.SC-cyf rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-28 - Refused write leaves history unchanged

**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** a product with available one
- **WHEN** Auction attempts to reserve quantity two and Grade10 refuses
- **THEN** no new change is appended

<!-- trace:scenario id=g10adm.inventory-catalog.SC-ses rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-41 - Sell-from-reservation history

**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** Auction has an active reservation with remaining five
- **WHEN** Auction sells quantity two from that reservation
- **THEN** one `sell-from-reservation` change records quantity two and the
  reservation id
- **AND** before and after show inventory sold increasing by two and reserved
  decreasing by two

<!-- trace:scenario id=g10adm.inventory-catalog.SC-7oz rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-42 - Vault-from-reservation history

**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** Vault has an active reservation with remaining five
- **WHEN** Vault vaults quantity two from that reservation
- **THEN** one `vault-from-reservation` change records quantity two and the
  reservation id
- **AND** before and after show inventory vaulted increasing by two and reserved
  decreasing by two

<!-- trace:scenario id=g10adm.inventory-catalog.SC-txu rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-43 - Adjust history records new quantity

**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** an active Auction reservation with quantity three
- **WHEN** it is adjusted to quantity five
- **THEN** one `adjust` change records quantity five and the reservation id
- **AND** before and after show reserved increasing by two and remaining
  increasing by two

<!-- trace:scenario id=g10adm.inventory-catalog.SC-pgg rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-44 - Adjust decrease records freed quantity

**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** an active Auction reservation with quantity five and remaining five
- **WHEN** it is adjusted to quantity two
- **THEN** one `adjust` change records quantity two and the reservation id
- **AND** before and after show reserved decreasing by three

<!-- trace:scenario id=g10adm.inventory-catalog.SC-6lr rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-74t rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-136 - An Unsold release carries its remarks and the listing's label

**Serves:** grade10-admin-inventory-catalog-US-09 - the admin sees why the stock came back

- **GIVEN** Auction holds an active reservation of two for listing `7KQ2P`,
  titled `Charizard PSA 10`, which closes with no winner
- **WHEN** Auction releases it at the close
- **THEN** one `release` change records quantity two, the reservation id and
  the reason `Released by unsold listing`
- **AND** its reservation snapshot carries the holder label
  `7KQ2P · Charizard PSA 10`

<!-- trace:scenario id=g10adm.inventory-catalog.SC-h6i rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-137 - The clean-up release reads differently from the close

**Serves:** grade10-admin-inventory-catalog-US-09 - the admin sees why the stock came back

- **GIVEN** Auction holds an active reservation of five for a listing that
  closed with no winner before the release shipped
- **WHEN** the one-off release frees it
- **THEN** one `release` change records quantity five and the reason
  `Released by unsold listing (clean-up)`

<!-- trace:scenario id=g10adm.inventory-catalog.SC-pi4 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-138 - A call-off release keeps no reason

**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** Auction holds an active reservation of two for a listing an
  operator calls off before its close
- **WHEN** Auction releases it
- **THEN** one `release` change records quantity two and no reason

<!-- trace:scenario id=g10adm.inventory-catalog.SC-tbn rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-144 - A Cert ID correction records both Cert IDs

**Serves:** grade10-admin-inventory-catalog-US-04 - the admin reads which number a unit carried before

- **GIVEN** an unmoved Cert record with Cert ID `PSA-1234`
- **WHEN** an authorized inventory admin changes it to `PSA-1243` with remarks
  `Typo at intake`
- **THEN** one `cert-id-change` change records quantity one, the operator and
  the reason `Typo at intake`
- **AND** its before snapshot carries the record with `PSA-1234` and its after
  snapshot the same record with `PSA-1243`
- **AND** before and after show the same stock, reserved, sold, withdrawn and
  vaulted

<!-- trace:scenario id=g10adm.inventory-catalog.SC-6zh rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-145 - An assignment records No Cert ID before

**Serves:** grade10-admin-inventory-catalog-US-04 - the admin reads when a unit of regular stock was numbered

- **GIVEN** a product with available regular stock
- **WHEN** an authorized inventory admin gives one unit Cert ID `BGS-88` with
  no remarks
- **THEN** one `cert-id-change` change records quantity one, the operator and
  no reason
- **AND** its before snapshot carries no Cert record and its after snapshot
  carries the new record with `BGS-88`

<!-- trace:scenario id=g10adm.inventory-catalog.SC-68f rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-172 - A regular stock reduction records its units and remarks

**Serves:** grade10-admin-inventory-catalog-US-04 - the admin reads why stock fell without a withdrawal

- **GIVEN** a product with stock six, of which five units are regular stock
  that has never moved
- **WHEN** an authorized inventory admin reverses the intake of two units with
  remarks `Entered by mistake`
- **THEN** one `intake-reversal` change records quantity two, the operator and
  the reason `Entered by mistake`
- **AND** its changed entity is `inventory`, it names no reservation and no
  Cert record, and before and after show stock falling by two
- **AND** before and after show the same reserved, sold, withdrawn and vaulted

<!-- trace:scenario id=g10adm.inventory-catalog.SC-s46 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-173 - A Cert record removal records the Cert ID it removed

**Serves:** grade10-admin-inventory-catalog-US-04 - the admin reads which numbered unit was taken out

- **GIVEN** an unmoved Cert record `PSA-1234` on a product with stock three
- **WHEN** an authorized inventory admin reverses its intake with remarks
  `Card never arrived`
- **THEN** one `intake-reversal` change records quantity one, the operator and
  the reason `Card never arrived`
- **AND** its before snapshot carries the record with `PSA-1234`
- **AND** before and after show stock falling by one and the same reserved,
  sold, withdrawn and vaulted

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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-clm rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-59 - Operator reserves admin hold from product page
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** a created product with stock five and reserved zero
- **WHEN** an authorized inventory admin reserves quantity two from the product
  page with optional remarks
- **THEN** one active reservation records `holder_kind` `admin`, a server-minted
  `holder_reference`, quantity two, and the remarks
- **AND** reserved increases by two while stock and derived ledger remain
  unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-crz rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-iv0 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-68 - Product page release is limited to admin holds
**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** a created product with active Auction, Vault, and `admin`
  reservations on the product page
- **WHEN** an authorized inventory admin views the reservations table
- **THEN** only `admin` rows offer a Release action
- **AND** Auction and Vault rows show no settlement actions on this page

<!-- trace:scenario id=g10adm.inventory-catalog.SC-kqn rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-29 - Operator oversees inventory and holds on the product page
**Serves:** Admin console - operator oversees inventory and holds on the product page

- **GIVEN** a created product with Auction, Vault, and `admin` reservations and
  prior vaulted and sold transitions
- **WHEN** an authorized inventory admin opens that product page
- **THEN** all counts including vaulted, each holder kind's reservations with
  remaining, and change history appear
- **AND** both count equations reconcile

<!-- trace:scenario id=g10adm.inventory-catalog.SC-s0h rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-30 - Empty products table
**Serves:** Admin console - empty products table

- **GIVEN** no products
- **WHEN** an authorized inventory admin opens Inventory
- **THEN** the products table shows an empty state

<!-- trace:scenario id=g10adm.inventory-catalog.SC-mdm rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-31 - Intake form updates the snapshot on the product page
**Serves:** Admin console - intake form updates the snapshot on the product page

- **GIVEN** a product page for an existing product
- **WHEN** an authorized inventory admin intakes quantity two
- **THEN** its stock increases by two (derived ledger likewise)
- **AND** one intake entry appears in history

<!-- trace:scenario id=g10adm.inventory-catalog.SC-ubw rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-axn rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-erz rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-32 - Unauthorized inventory read is refused
**Serves:** Admin console - unauthorized inventory read is refused

- **GIVEN** a signed-in person without inventory admin grants
- **WHEN** they request the product list
- **THEN** Grade10 refuses the request

<!-- trace:scenario id=g10adm.inventory-catalog.SC-io4 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-33 - Inventory section hidden without grants
**Serves:** Admin console - inventory section hidden without grants

- **GIVEN** a signed-in person without inventory admin grants
- **WHEN** they use the Grade10 admin panel
- **THEN** the Inventory section is not offered

<!-- trace:scenario id=g10adm.inventory-catalog.SC-oqk rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-sls rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-93 - Product form shows the complete hierarchy
**Serves:** grade10-admin-inventory-catalog-US-70 - Operator configures the product identity and display

- **GIVEN** an authorized inventory admin opens a product form
- **WHEN** they inspect the identity fields
- **THEN** IP, Category, and Item are available
- **AND** no Collectible type field or product metadata editor is available

<!-- trace:scenario id=g10adm.inventory-catalog.SC-ux1 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-94 - Product contract has no legacy identity fields
**Serves:** grade10-admin-inventory-catalog-US-70 - Operator configures the product identity and display

- **GIVEN** an authorized inventory admin creates or reads a product
- **WHEN** Grade10 returns the product
- **THEN** its identity is represented by IP, Category, and Item
- **AND** the product carries no Collectible type or product metadata field

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
media. Physical removal of a Cert unit, Remove physical unit, SHALL require an
available record that has moved and that no active reservation names. A
record that has moved is one that is not unmoved, as `An unmoved Cert record's Cert ID can be corrected` and `An
unmoved Cert record can be removed as never received` define it. An unmoved
record SHALL NOT be physically removed; it leaves by an intake reversal. In
the same Inventory transaction, Grade10 SHALL
decrement stock by one, increment withdrawn by one, remove the Cert record,
and delete source media tagged to that record. Untagged product media and
media tagged to other Cert records SHALL remain unchanged. Cert ID details
SHALL offer Remove physical unit only on an Available Cert record that has
moved and no active hold names. Remove physical unit SHALL open a confirmation that
names the Cert ID and holds its required reason; Confirm SHALL stay
unavailable while the reason is blank, and cancelling SHALL change nothing.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-fq8 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-95 - Inventory has no Cert ID records by default
**Serves:** grade10-admin-inventory-catalog-US-69 - Operator records a received graded unit

- **GIVEN** an authorized inventory admin creates a product without a
  certificate identifier
- **WHEN** the product's inventory is read
- **THEN** the inventory has zero Cert ID records
- **AND** the product remains valid for ordinary unnumbered stock

<!-- trace:scenario id=g10adm.inventory-catalog.SC-irv rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-96 - Intake records a Cert ID under its product
**Serves:** grade10-admin-inventory-catalog-US-69 - Operator records a received graded unit

- **GIVEN** a created product with an inventory
- **WHEN** an authorized inventory admin intakes one unit with Grade Issuer `PSA` and Cert ID `PSA-123`
- **THEN** the inventory owns one record whose displayed identifier is `PSA-123`
- **AND** that record belongs to the intaken product and no other product

<!-- trace:scenario id=g10adm.inventory-catalog.SC-a57 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-97 - Duplicate Cert ID is refused
**Serves:** grade10-admin-inventory-catalog-US-69 - Operator records a received graded unit

- **GIVEN** an inventory already owns Grade Issuer `PSA` and Cert ID `PSA-123`
- **WHEN** an authorized inventory admin intakes another unit with Grade Issuer `PSA` and Cert ID `PSA-123`
- **THEN** Grade10 refuses the intake
- **AND** stock, Cert ID records, and change history are unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-sbt rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-128 - Operator tags media to one same-product Cert record
**Serves:** grade10-admin-inventory-catalog-US-12 - Operator classifies source media for one copy

- **GIVEN** an untagged source media item and a Cert record with a printed Cert ID owned by the same product
- **WHEN** an authorized Inventory operator tags the media to that record
- **THEN** the tag identifies that immutable Cert record id
- **AND** the source media item remains owned by its product

<!-- trace:scenario id=g10adm.inventory-catalog.SC-hcz rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-129 - Regular stock has no Cert media tag target
**Serves:** grade10-admin-inventory-catalog-US-12 - Operator classifies source media for one copy

- **GIVEN** an untagged source media item for a product with regular inventory stock and no Cert record for that stock
- **WHEN** an operator attempts to tag the media to the regular stock item
- **THEN** Grade10 refuses the tag write
- **AND** the source media remains untagged and shared at product level

<!-- trace:scenario id=g10adm.inventory-catalog.SC-ec6 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-130 - Invalid Cert targets preserve the current media tag
**Serves:** grade10-admin-inventory-catalog-US-12 - Operator classifies source media for one copy

- **GIVEN** a source media item tagged to a valid Cert record
- **WHEN** an operator attempts to retag it to a missing record or a record owned by another product
- **THEN** Grade10 refuses the tag write
- **AND** the current tag and source media remain unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-6tq rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-131 - Operator untags media for product-level sharing
**Serves:** grade10-admin-inventory-catalog-US-12 - Operator classifies source media for one copy

- **GIVEN** a source media item tagged to a Cert record
- **WHEN** an authorized Inventory operator clears its tag
- **THEN** the source media item has no Cert tag and remains shared at product level

<!-- trace:scenario id=g10adm.inventory-catalog.SC-fbv rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-132 - Retagging leaves the original source item untagged
**Serves:** grade10-admin-inventory-catalog-US-12 - Operator classifies source media for one copy

- **GIVEN** a source media item tagged to one Cert record and a second same-product Cert record with a printed Cert ID
- **WHEN** an authorized Inventory operator retags the source item
- **THEN** the existing Cert association is cleared and the source item remains on the product as untagged shared media
- **AND** Grade10 does not automatically transfer that source item to the second record

<!-- trace:scenario id=g10adm.inventory-catalog.SC-hhf rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-133 - Unauthorized source-media tag writes are refused
**Serves:** grade10-admin-inventory-catalog-US-12 - Operator classifies source media for one copy

- **GIVEN** a source media item and an operator without existing Inventory media-management authority
- **WHEN** the operator attempts to change its Cert tag
- **THEN** Grade10 refuses the write under existing Inventory authorization
- **AND** the tag and source media remain unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-gpb rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-134 - Removing an available Cert unit withdraws the unit and its tagged media
**Serves:** grade10-admin-inventory-catalog-US-13 - Operator removes an available copy and its source media

- **GIVEN** an available Cert record that an Admin hold once named and released, with one source media item tagged to it and no active reservation
- **WHEN** an authorized Inventory operator removes the physical unit and its Cert record
- **THEN** stock decreases by one and withdrawn increases by one
- **AND** the inventory ledger remains unchanged
- **AND** the Cert record and its tagged source media are removed
- **AND** untagged product media and media tagged to other Cert records remain unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-k3v rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-135 - A Cert unit that fails a removal guard cannot be removed
**Serves:** grade10-admin-inventory-catalog-US-13 - Operator removes an available copy and its source media

- **GIVEN** a Cert record is not available, has an active reservation, or is unmoved
- **WHEN** an authorized Inventory operator attempts to remove the physical unit
- **THEN** Grade10 refuses the removal
- **AND** the reservation, stock, withdrawn count, Cert record, and tagged source media remain unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-lvy rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-175 - Remove physical unit is offered only on a record that has moved

**Serves:** `grade10-admin-inventory-catalog-US-13`, `grade10-admin-inventory-catalog-US-16` - each Cert record offers one way out

- **GIVEN** a product with unmoved Cert record `PSA-1`, and Cert record
  `PSA-2` that an Admin hold named and released, both Available
- **WHEN** an authorized inventory admin selects each in Cert ID details
- **THEN** `PSA-1` offers `Remove` and no `Remove physical unit`
- **AND** `PSA-2` offers `Remove physical unit` and no `Remove`
- **WHEN** the admin chooses `Remove physical unit` on `PSA-2`
- **THEN** a confirmation names `PSA-2` and asks for a reason, and Confirm
  stays unavailable until one is entered
- **WHEN** the admin cancels it
- **THEN** `PSA-2` is still listed, Available, and stock, withdrawn, its media
  and the history are unchanged
- **WHEN** a physical removal of `PSA-1` is sent anyway
- **THEN** Grade10 refuses it, and stock, withdrawn, the record, its media and
  the history are unchanged

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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-ml0 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-108 - Shared card template defines product facts
**Serves:** grade10-admin-inventory-catalog-US-72 - Operator configures card schemas and imports products

- **GIVEN** an authorized inventory admin opens product schema management
- **WHEN** they create a card schema from the shared template
- **THEN** Year is a required number and Set and Subject are required text
- **AND** Card Number and Variety are optional text
- **AND** Serial, Cert ID, Grade Issuer, Grade, and Autograph Grade are not product attributes

<!-- trace:scenario id=g10adm.inventory-catalog.SC-p05 rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-30a rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-110 - Schema manifest imports as drafts
**Serves:** grade10-admin-inventory-catalog-US-72 - Operator configures card schemas and imports products

- **GIVEN** an authorized inventory admin has mapped each distinct source classification key to an existing tag tuple
- **WHEN** they preview and import a valid manifest
- **THEN** Grade10 creates draft schema revisions for the mapped tuples
- **AND** the current published schemas remain active until each revision is published

<!-- trace:scenario id=g10adm.inventory-catalog.SC-ikp rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-hqo rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-1d9 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-112 - Product upload creates one draft per identity
**Serves:** grade10-admin-inventory-catalog-US-72 - Operator configures card schemas and imports products

- **GIVEN** an authorized inventory admin has mapped each source classification key and a published card schema exists for each target tuple
- **WHEN** they preview and commit product rows containing repeated identical card identities
- **THEN** Grade10 creates one draft product for each distinct product name, exact tuple, and schema-value set
- **AND** no inventory quantity, unit record, or Cert ID is created
- **WHEN** the admin marks each valid imported draft `created` through the existing product status flow
- **THEN** only products with complete classification and valid required schema values become `created`

<!-- trace:scenario id=g10adm.inventory-catalog.SC-3c8 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-114 - Same name keeps distinct card identities
**Serves:** grade10-admin-inventory-catalog-US-72 - Operator configures card schemas and imports products

- **GIVEN** uploaded rows share a product name and exact tuple but differ by Card Number or Set
- **WHEN** an authorized inventory admin previews and commits the product upload
- **THEN** Grade10 creates one draft product for each distinct schema-value set
- **AND** rows with repeated product name alone do not merge or block one another
- **AND** no inventory quantity, unit record, or Cert ID is created

<!-- trace:scenario id=g10adm.inventory-catalog.SC-t1v rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-3ab rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-116 - Inventory upload previews matched copy facts
**Serves:** grade10-admin-inventory-catalog-US-73 - Operator bulk imports matched inventory units

- **GIVEN** an authorized inventory admin uploads rows that each match one created product
- **WHEN** they preview and confirm the inventory upload
- **THEN** each row resolves to one product and one physical unit
- **AND** Cert ID, Grade Issuer, Grade, Autograph Grade, and Serial are shown as copy-level facts
- **AND** the rows are committed only after confirmation

<!-- trace:scenario id=g10adm.inventory-catalog.SC-1c7 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-117 - Blank status requires per-row choice and RAW has no Cert ID
**Serves:** grade10-admin-inventory-catalog-US-73 - Operator bulk imports matched inventory units

- **GIVEN** an inventory upload has two blank Item Status rows, one `RAW` row without Cert ID and one graded row with Cert ID
- **WHEN** an authorized inventory admin previews the upload without deciding either row
- **THEN** Grade10 requires an explicit include or exclude decision for each blank-status row
- **WHEN** the admin includes the RAW row and excludes the graded row
- **THEN** the RAW row is valid without Cert ID
- **AND** only the included RAW row adds a unit and stock

<!-- trace:scenario id=g10adm.inventory-catalog.SC-crr rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-118 - Missing or ambiguous product match blocks import
**Serves:** grade10-admin-inventory-catalog-US-73 - Operator bulk imports matched inventory units

- **GIVEN** an inventory upload contains a row with no matching product or more than one matching product
- **WHEN** an authorized inventory admin attempts to commit the upload
- **THEN** Grade10 identifies the unmatched or ambiguous row
- **AND** no row in the upload changes inventory or history

<!-- trace:scenario id=g10adm.inventory-catalog.SC-dc8 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-119 - Duplicate Cert ID blocks the whole upload
**Serves:** grade10-admin-inventory-catalog-US-73 - Operator bulk imports matched inventory units

- **GIVEN** an inventory upload contains a Cert ID already present under its matched product inventory or repeated in another upload row
- **WHEN** an authorized inventory admin attempts to commit the upload
- **THEN** Grade10 reports the duplicate after trimming surrounding whitespace
- **AND** no row in the upload changes inventory, unit records, or history

<!-- trace:scenario id=g10adm.inventory-catalog.SC-bc7 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-120 - Invalid inventory row leaves every unit unchanged
**Serves:** grade10-admin-inventory-catalog-US-73 - Operator bulk imports matched inventory units

- **GIVEN** an inventory upload contains a row with an invalid value or unresolved required mapping
- **WHEN** an authorized inventory admin validates and attempts to commit the upload
- **THEN** Grade10 reports the row and reason
- **AND** no inventory count, unit fact, or history entry from that upload is committed

<!-- trace:scenario id=g10adm.inventory-catalog.SC-4hn rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-121 - Copy facts trim and omit blank placeholders
**Serves:** grade10-admin-inventory-catalog-US-73 - Operator bulk imports matched inventory units

- **GIVEN** inventory rows contain surrounding whitespace and optional copy facts that are blank or `-`
- **WHEN** an authorized inventory admin previews the inventory upload
- **THEN** Grade10 trims surrounding whitespace from mapped copy facts
- **AND** blank and standalone `-` optional facts are absent rather than stored as text
- **AND** the uploaded workbook is unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-sfn rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-skp rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-98 - Unnumbered intake increases stock
**Serves:** grade10-admin-inventory-catalog-US-69 - Operator records a received graded unit

- **GIVEN** a created product with stock two
- **WHEN** an authorized inventory admin intakes quantity three without unit records
- **THEN** stock increases to five
- **AND** no individually tracked unit record is created

<!-- trace:scenario id=g10adm.inventory-catalog.SC-ah9 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-99 - Multiple Cert IDs match intake quantity
**Serves:** grade10-admin-inventory-catalog-US-69 - Operator records a received graded unit

- **GIVEN** a created product with an inventory
- **WHEN** an authorized inventory admin intakes quantity two with one unit
  from issuer `PSA` with Cert ID `PSA-123` and one from issuer `BGS` with Cert
  ID `BGS-456`
- **THEN** stock increases by two
- **AND** both identifiers are recorded under that inventory
- **AND** one intake history entry records the two received identifiers

<!-- trace:scenario id=g10adm.inventory-catalog.SC-0ac rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-q36 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-101 - Admin adds Cert ID to displayed attributes
**Serves:** grade10-admin-inventory-catalog-US-70 - Operator configures the product identity and display

- **GIVEN** an authorized inventory admin edits a product schema's Displayed Attributes panel
- **WHEN** they include Cert ID and place it before the first product attribute
- **THEN** the saved display order contains Cert ID first
- **AND** no ordinary Cert ID attribute key is created

<!-- trace:scenario id=g10adm.inventory-catalog.SC-u9i rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-102 - Admin hides Cert ID without changing attributes
**Serves:** grade10-admin-inventory-catalog-US-70 - Operator configures the product identity and display

- **GIVEN** a published product schema displaying Cert ID and two typed attributes
- **WHEN** an authorized inventory admin removes Cert ID from the displayed set
- **THEN** the two typed attributes remain in their prior order
- **AND** Cert ID is not returned as a displayed field

<!-- trace:scenario id=g10adm.inventory-catalog.SC-6vy rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-103 - Displayed Cert ID resolves the selected unit
**Serves:** grade10-admin-inventory-catalog-US-70 - Operator configures the product identity and display

- **GIVEN** an Auction listing selects Cert ID `PSA-123` and its product schema displays Cert ID
- **WHEN** a collector reads the listing
- **THEN** the displayed product fields include `PSA-123` in the configured position

<!-- trace:scenario id=g10adm.inventory-catalog.SC-rn5 rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-bck rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-105 - Reservation selects a Cert ID
**Serves:** grade10-admin-inventory-catalog-US-71 - Holder reserves a specific inventory unit

- **GIVEN** a created product with available Cert IDs `PSA-123` and `BGS-456`
- **WHEN** an authorized holder requests a reservation for `PSA-123`
- **THEN** the reservation stores the opaque Cert ID record identity
- **AND** its quantity is one and `PSA-123` is unavailable to other active reservations

<!-- trace:scenario id=g10adm.inventory-catalog.SC-63a rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-106 - Reservation selects No Cert ID
**Serves:** grade10-admin-inventory-catalog-US-71 - Holder reserves a specific inventory unit

- **GIVEN** a created product with available stock and no intended numbered unit
- **WHEN** an authorized holder explicitly requests `No Cert ID` for quantity three
- **THEN** the reservation uses product-level quantity three
- **AND** no Cert ID record is allocated

<!-- trace:scenario id=g10adm.inventory-catalog.SC-ol8 rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-h69 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-69 - Operator defines a localized reusable field
**Serves:** grade10-admin-inventory-catalog-US-05 - Inventory admin configures a localized product schema

- **GIVEN** an authorized inventory admin
- **WHEN** they define `card_number` as a text field with English, Traditional Chinese, and Simplified Chinese labels and a text pattern
- **THEN** Grade10 stores one reusable field with one stable key
- **AND** each supplied locale returns its own displayed label
- **AND** the attribute is available for assignment to product schemas

<!-- trace:scenario id=g10adm.inventory-catalog.SC-tmz rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-rbs rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-n01 rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-n2c rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-72 - Operator configures a Pokémon TCG product schema
**Serves:** grade10-admin-inventory-catalog-US-05 - Inventory admin configures a localized product schema

- **GIVEN** reusable fields for language, card number, card set, grading, and PSA population
- **WHEN** an authorized inventory admin configures the exact `Pokémon` + `Single card` + `TCG` product schema
- **THEN** language, card number, card set, and grading can be assigned as required or optional attributes
- **AND** PSA population can be assigned as an optional attribute
- **AND** every assigned attribute has its own displayed label separate from its stable key

<!-- trace:scenario id=g10adm.inventory-catalog.SC-a78 rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-hih rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-74 - Product without a matching product schema remains a draft
**Serves:** grade10-admin-inventory-catalog-US-06 - Inventory admin enters a validated product

- **GIVEN** an authorized inventory admin creates a product with valid universal classification but no published product schema for its IP + Item + Category tuple
- **WHEN** they save the product
- **THEN** Grade10 saves it as `draft`
- **AND** the product cannot be marked `created`
- **AND** no Auction reservation or listing may use it

<!-- trace:scenario id=g10adm.inventory-catalog.SC-eoz rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-75 - Operator saves localized Pokémon TCG values
**Serves:** grade10-admin-inventory-catalog-US-06 - Inventory admin enters a validated product

- **GIVEN** a published Pokémon + Single card + TCG product schema with required language, card number, card set, and grading attributes
- **WHEN** an authorized inventory admin supplies valid English, Traditional Chinese, and Simplified Chinese values where translations are available
- **THEN** Grade10 stores the values under their stable field keys
- **AND** each product read returns the field's displayed label and the value for the requested locale

<!-- trace:scenario id=g10adm.inventory-catalog.SC-hwd rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-76 - Invalid structured value is refused
**Serves:** grade10-admin-inventory-catalog-US-06 - Inventory admin enters a validated product

- **GIVEN** a product with a published product schema whose card number requires a configured pattern
- **WHEN** an authorized inventory admin supplies a value that fails that pattern or the field's data type
- **THEN** Grade10 refuses the product update
- **AND** the product's previous structured values remain unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-kdl rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-77 - Missing required value blocks creation
**Serves:** grade10-admin-inventory-catalog-US-06 - Inventory admin enters a validated product

- **GIVEN** a draft product with a published product schema and no grading value
- **WHEN** an authorized inventory admin attempts to mark it `created`
- **THEN** Grade10 refuses the status change
- **AND** reports grading as a missing required value

<!-- trace:scenario id=g10adm.inventory-catalog.SC-44a rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-78 - Missing optional value remains valid
**Serves:** grade10-admin-inventory-catalog-US-06 - Inventory admin enters a validated product

- **GIVEN** a published Pokémon + Single card + TCG product schema where PSA population is optional
- **WHEN** an authorized inventory admin marks a product with no PSA population value `created`
- **THEN** Grade10 accepts the status change when all required values are valid
- **AND** the missing optional value remains absent

<!-- trace:scenario id=g10adm.inventory-catalog.SC-e2o rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-79 - A missing locale falls back to English
**Serves:** grade10-admin-inventory-catalog-US-06 - Inventory admin enters a validated product

- **GIVEN** a product has an English grading value and no Simplified Chinese grading translation
- **WHEN** Auction reads the product in Simplified Chinese
- **THEN** the English grading value is displayed
- **AND** no stable field key or raw translation key is displayed

<!-- trace:scenario id=g10adm.inventory-catalog.SC-uv0 rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-eze rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-80 - Auction filters by universal and structured fields
**Serves:** grade10-admin-inventory-catalog-US-07 - Collector finds and reads a card through Auction fields

- **GIVEN** Auction products with different IP, Category, language, and grading values
- **WHEN** a collector filters by an IP tag, a product attribute, or both
- **THEN** Auction returns only products whose stable tag or field value matches
- **AND** the filter labels and values use the active locale

<!-- trace:scenario id=g10adm.inventory-catalog.SC-3qz rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-81 - Missing optional value is excluded from its filter
**Serves:** grade10-admin-inventory-catalog-US-07 - Collector finds and reads a card through Auction fields

- **GIVEN** one Auction product has a PSA population value and another has no PSA population value
- **WHEN** a collector filters by a PSA population value
- **THEN** only the product with that value matches
- **AND** the product without a value remains available in an unfiltered result

<!-- trace:scenario id=g10adm.inventory-catalog.SC-dme rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-74n rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-83 - Operator configures different Auction fields per product schema
**Serves:** grade10-admin-inventory-catalog-US-07 - Collector finds and reads a card through Auction fields

- **GIVEN** Pokémon and One Piece product schemas with card number, language, and grading attributes
- **WHEN** an authorized inventory admin selects card number for Pokémon and card number plus character for One Piece
- **THEN** Pokémon Auction listings omit grading
- **AND** One Piece Auction listings show the card number and character, such as Luffy or Chopper
- **AND** both product schemas retain grading for validation and search/filter when assigned

<!-- trace:scenario id=g10adm.inventory-catalog.SC-88u rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-84 - Auction shows localized labels and values in configured order
**Serves:** grade10-admin-inventory-catalog-US-07 - Collector finds and reads a card through Auction fields

- **GIVEN** an Auction listing whose product schema selects language before card number and supplies Traditional Chinese translations
- **WHEN** a collector opens the listing in Traditional Chinese
- **THEN** the selected fields appear in the configured order
- **AND** each field uses its Traditional Chinese displayed label and value
- **AND** a missing translation falls back to English

<!-- trace:scenario id=g10adm.inventory-catalog.SC-fkn rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-88 - Listing-specific PSA cert number does not change the product
**Serves:** grade10-admin-inventory-catalog-US-07 - Collector finds and reads a card through Auction fields

- **GIVEN** two Auction listings use the same Pokémon product
- **WHEN** an authorized auction admin enters a different PSA cert number on each listing
- **THEN** each listing displays its own PSA cert number
- **AND** the product's grading and product attribute values remain unchanged
- **AND** PSA cert number is not offered as an Auction search or filter criterion

<!-- trace:scenario id=g10adm.inventory-catalog.SC-o05 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-89 - Flexible listing attribute falls back to English
**Serves:** grade10-admin-inventory-catalog-US-07 - Collector finds and reads a card through Auction fields

- **GIVEN** an Auction listing has a PSA cert number item with an English label and value but no Simplified Chinese translations
- **WHEN** a collector opens the listing in Simplified Chinese
- **THEN** Auction displays the English PSA cert number label and value
- **AND** no stable listing attribute key or raw translation key is displayed

<!-- trace:scenario id=g10adm.inventory-catalog.SC-9wr rev=1 -->
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

<!-- trace:scenario id=g10adm.inventory-catalog.SC-a1d rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-85 - Invalid existing product blocks product schema publish
**Serves:** grade10-admin-inventory-catalog-US-08 - Inventory admin publishes a safe product-schema configuration

- **GIVEN** an existing product matches the product schema's IP + Item + Category tuple but lacks a newly required grading value
- **WHEN** an authorized inventory admin attempts to publish that product schema
- **THEN** Grade10 refuses the publish
- **AND** reports the product and missing value
- **AND** the previously published product schema remains active

<!-- trace:scenario id=g10adm.inventory-catalog.SC-o0r rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-86 - Valid product schema publishes atomically
**Serves:** grade10-admin-inventory-catalog-US-08 - Inventory admin publishes a safe product-schema configuration

- **GIVEN** every affected product has valid required values and optional fields may be absent
- **WHEN** an authorized inventory admin publishes the product schema
- **THEN** the complete product schema configuration becomes active
- **AND** its attributes and search/filter behavior take effect together

<!-- trace:scenario id=g10adm.inventory-catalog.SC-ahs rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-87 - Legacy product without a matching product schema stays visible but unavailable to Auction
**Serves:** grade10-admin-inventory-catalog-US-08 - Inventory admin publishes a safe product-schema configuration

- **GIVEN** a `created` product predates product schemas and has no published product schema for its IP + Item + Category tuple
- **WHEN** an authorized inventory admin opens the product and Auction evaluates its eligibility
- **THEN** the product remains visible to the inventory admin with a reported missing product schema
- **AND** Auction refuses to list or reserve it until a matching published product schema and valid required values exist

### Requirement: Product assets are an ordered reusable gallery

A product has an ordered gallery of reusable media assets.

While the product is editable, an authorized inventory admin SHALL be able to
add, replace, remove, reorder, and clear its assets. A product gallery MAY be
empty and SHALL hold at most eight assets. An operation that would add a ninth
asset SHALL be refused and SHALL leave the gallery unchanged.

Each asset SHALL be one JPEG, PNG, WebP, AVIF, MP4, WebM, or QuickTime file.
An unsupported type, an empty file, or a file larger than 104857600 bytes
SHALL be refused and SHALL leave the gallery unchanged.

A product asset SHALL be available for selection by listings of that product.
The same product asset MAY be selected by more than one listing.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-nmq rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-123 - Inventory admin orders a product gallery
**Serves:** grade10-admin-inventory-catalog-US-74 - inventory admin keeps an ordered reusable gallery

- **GIVEN** an editable product and an authorized inventory admin
- **WHEN** they add supported assets and arrange them
- **THEN** Grade10 stores the assets in that order
- **AND** the gallery may contain from zero through eight assets

<!-- trace:scenario id=g10adm.inventory-catalog.SC-w9x rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-124 - Invalid product assets are refused
**Serves:** grade10-admin-inventory-catalog-US-74 - inventory admin keeps a valid gallery

- **GIVEN** an editable product and an authorized inventory admin
- **WHEN** they add an unsupported, empty, over-104857600-byte, or ninth asset
- **THEN** Grade10 refuses the operation
- **AND** the product gallery is unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-hwk rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-125 - Inventory admin maintains an editable product gallery
**Serves:** grade10-admin-inventory-catalog-US-74 - inventory admin maintains product media

- **GIVEN** an editable product with ordered assets and an authorized inventory admin
- **WHEN** they replace, remove, reorder, or clear assets
- **THEN** Grade10 applies the requested change
- **AND** clearing the gallery leaves the product with zero assets

<!-- trace:scenario id=g10adm.inventory-catalog.SC-vz9 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-126 - Unauthorized product-gallery management is refused
**Serves:** grade10-admin-inventory-catalog-US-74 - product media follows inventory administration access

- **GIVEN** a caller without inventory-admin access
- **WHEN** they attempt to change a product gallery
- **THEN** Grade10 refuses the request under the existing admin authorization behavior
- **AND** the product gallery is unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-qs1 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-127 - A product asset is reusable across listings
**Serves:** grade10-admin-inventory-catalog-US-74 - product media can serve more than one listing

- **GIVEN** a product asset
- **WHEN** authorized operators select it for two listings of that product
- **THEN** each listing may save the asset
- **AND** selecting it for one listing does not remove it from the product or the other listing

### Requirement: The product page shows an Unsold hold as released

The product page's reservations table SHALL keep an Auction hold released for a
listing that closed with no winner, showing it as closed with its released
quantity and naming the listing by its holder label. Available SHALL include
its units. Other holds SHALL be unchanged.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-evn rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-139 - The product page shows the hold released
**Serves:** grade10-admin-inventory-catalog-US-09 - the admin sees unsold stock come back

- **GIVEN** a created product with stock ten, an Auction hold of four for
  listing `7KQ2P`, titled `Charizard PSA 10`, that has just closed with no
  winner, and an active Vault hold of one
- **WHEN** an authorized inventory admin opens the product page
- **THEN** available reads nine and reserved reads one
- **AND** the Auction hold reads closed with released four, and its Reference
  reads `7KQ2P · Charizard PSA 10`
- **AND** the Vault hold is still active

### Requirement: The product page and history name each hold's holder

The reservations table's **Reference** SHALL show a reservation's holder label
when it has one, else its holder reference.

Every change history entry on the product page SHALL show:

| Column   | Shows                                                                                                                                                                                                                                           |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| When     | The date and time the entry occurred                                                                                                                                                                                                            |
| Action   | The entry's action; a Cert ID change also shows its Cert ID before and after, as `Cert ID change · <before> → <after>`, with `No Cert ID` as the before of an assignment; an intake reversal reads `Intake reversal · No Cert ID` when it reduced regular stock, and `Intake reversal · <Cert ID>` when it removed a Cert record |
| Quantity | The entry's quantity                                                                                                                                                                                                                            |
| Actor    | The entry's actor                                                                                                                                                                                                                               |
| Holder   | The holder kind, read as Auction, Vault or Admin, of the reservation the entry moved, followed by its holder label, else its holder reference, as its after snapshot holds them, else its before snapshot; `—` for an entry with no reservation |
| Remarks  | The entry's reason; `—` when it has none                                                                                                                                                                                                        |

The words Auction, Vault and Admin SHALL be the page's; the stored holder kind
and holder reference SHALL be unchanged.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-j3i rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-141 - An Unsold release names its holder and remarks in the history

**Serves:** grade10-admin-inventory-catalog-US-09 - the admin sees why the stock came back

- **GIVEN** a product whose Auction hold of two for listing `7KQ2P`, titled
  `Charizard PSA 10`, was released at an Unsold close
- **WHEN** an authorized inventory admin opens the product's change history
- **THEN** the release entry shows its date and time, `release`, quantity two
  and the Auction actor
- **AND** its Holder shows `Auction` and
  `7KQ2P · Charizard PSA 10`, and its Remarks read `Released by unsold listing`

<!-- trace:scenario id=g10adm.inventory-catalog.SC-k28 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-142 - An entry with no hold and no remarks shows dashes

**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** a product with one `product-update` entry
- **WHEN** an authorized inventory admin opens the product's change history
- **THEN** that entry's Holder and Remarks each read `—`

#### Scenario: grade10-admin-inventory-catalog-SC-143 - A hold with no label is named by its reference

**Serves:** grade10-admin-inventory-catalog-US-02 - Oversee holds and settle them from holder apps

- **GIVEN** a product with an active Vault hold under holder reference
  `vault-7` and no holder label
- **WHEN** an authorized inventory admin opens the product page
- **THEN** the hold's Reference reads `vault-7`
- **AND** its `reserve` entry's Holder shows `Vault` and
  `vault-7`

<!-- trace:scenario id=g10adm.inventory-catalog.SC-76r rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-146 - The product history shows each Cert ID change

**Serves:** grade10-admin-inventory-catalog-US-04 - the admin reads every Cert ID change beside the other entries

- **GIVEN** a product where Cert ID `PSA-1234` was changed to `PSA-1243` with
  remarks `Typo at intake`, and a unit of regular stock was given `BGS-88`
- **WHEN** an authorized inventory admin opens the product's change history
- **THEN** one entry's Action reads `Cert ID change · PSA-1234 → PSA-1243`,
  with quantity one, the admin as actor, Holder `—` and Remarks
  `Typo at intake`
- **AND** another reads `Cert ID change · No Cert ID → BGS-88`, with Remarks
  `—`

<!-- trace:scenario id=g10adm.inventory-catalog.SC-mci rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-174 - The product history shows each intake reversal

**Serves:** grade10-admin-inventory-catalog-US-04 - the admin finds every unit taken out as a mistake beside the other entries

- **GIVEN** a product where two units of regular stock were reversed with
  remarks `Entered by mistake`, and Cert record `PSA-1234` was reversed with
  remarks `Card never arrived`
- **WHEN** an authorized inventory admin opens the product's change history
- **THEN** one entry's Action reads `Intake reversal · No Cert ID`, with quantity two, the
  admin as actor, Holder `—` and Remarks `Entered by mistake`
- **AND** another reads `Intake reversal · PSA-1234`, with quantity one and
  Remarks `Card never arrived`
- **AND** neither reads `withdraw` or `intake`

### Requirement: Cert ID details lists every unit the product holds

Cert ID details, opened from View Cert IDs on the product page, SHALL list
each Cert record of the product and the regular stock on hand. It SHALL show
each unit's Cert ID, status, holder and quantity, and no copy facts.

**Regular stock** - the units in stock that have no Cert record. **Available
regular stock** is regular stock minus the remaining of every active hold that
names no Cert record. The **regular stock history** is defined in `Cert ID
details shows each unit's history`.

| Row                                        | Cert ID      | Status                                          | Holder                                                                                                    | Quantity                            |
| ------------------------------------------ | ------------ | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Each Cert record                           | Its Cert ID  | Available, Reserved, Sold, Withdrawn or Vaulted | The holder kind and holder label, else holder reference, of the active hold naming it; `—` when none does | 1                                   |
| Available regular stock                    | `No Cert ID` | Available                                       | `—`                                                                                                       | Available regular stock, 0 included |
| Each active hold that names no Cert record | `No Cert ID` | Reserved                                        | The hold's holder kind and holder label, else holder reference                                            | The hold's remaining                |

The rows SHALL read in that order: Cert records by Cert ID, then the
available row, then the hold rows. The available row SHALL show whenever the
regular stock history holds any entry, reading 0 when no unit is free, and
SHALL NOT show when it holds none. Sold, withdrawn and vaulted regular stock
SHALL NOT be listed, since no unit of it is tracked. A product with no row
SHALL show one line saying no unit is on hand.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-4o8 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-147 - Regular stock is listed beside the Cert records

**Serves:** grade10-admin-inventory-catalog-US-14 - the admin finds every unit without adding up counts

- **GIVEN** a created product with stock six: Cert record `PSA-1` available,
  Cert record `PSA-2` held by Auction listing `7KQ2P · Charizard`, and four
  units of regular stock, of which a Vault hold `vault-7` holds one and an
  Admin hold holds two
- **WHEN** an authorized inventory admin opens Cert ID details
- **THEN** the rows read, in order: `PSA-1` Available `—` 1; `PSA-2` Reserved
  Auction `7KQ2P · Charizard` 1; `No Cert ID` Available `—` 1; `No Cert ID`
  Reserved Vault `vault-7` 1; `No Cert ID` Reserved Admin with its reference
  and 2
- **AND** the quantities add up to the product's stock of six
- **AND** no row shows a Grade Issuer, Grade, Autograph Grade or Serial

<!-- trace:scenario id=g10adm.inventory-catalog.SC-2h0 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-148 - Held regular stock reads Available 0

**Serves:** grade10-admin-inventory-catalog-US-14 - the admin sees regular stock that is all held

- **GIVEN** a created product with no Cert record, three units of regular
  stock sold, one withdrawn, and two on hand held by one Auction hold
- **WHEN** an authorized inventory admin opens Cert ID details
- **THEN** the rows read `No Cert ID` Available `—` 0, then `No Cert ID`
  Reserved with the Auction hold's holder and 2
- **AND** no row lists the sold or withdrawn units

<!-- trace:scenario id=g10adm.inventory-catalog.SC-nf2 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-149 - A released hold returns its units to the available row

**Serves:** grade10-admin-inventory-catalog-US-14 - the admin sees a released hold's units come back

- **GIVEN** Cert ID details shows `No Cert ID` Available 1 and an Admin hold
  row of 2 on regular stock
- **WHEN** an authorized inventory admin releases the Admin hold whole from
  the product page and opens Cert ID details again
- **THEN** `No Cert ID` Available reads 3
- **AND** the Admin hold's row is gone

<!-- trace:scenario id=g10adm.inventory-catalog.SC-ji2 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-170 - A product with no regular stock history lists no No Cert ID row

**Serves:** grade10-admin-inventory-catalog-US-14 - the admin sees only the units the product has had

- **GIVEN** one product that intook one unit with Cert record `PSA-1` and no
  regular stock, and another created product that never intook stock
- **WHEN** an authorized inventory admin opens Cert ID details on each
- **THEN** the first lists `PSA-1` alone, with no `No Cert ID` row
- **AND** the second lists no row and shows one line saying no unit is on hand

### Requirement: Cert ID details shows each unit's history

Selecting a row in Cert ID details SHALL show that unit's history, newest
first, with the columns of the product's change history. Every entry of the
unit SHALL be reachable however old it is.

| Row selected         | History shows                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| A Cert record        | Every entry naming the record: from its intake, or from the Cert ID change that gave it a Cert ID, onwards |
| Any `No Cert ID` row | The regular stock history, below                                                                           |

| Entry                                                                                               | In the regular stock history when           |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `intake`                                                                                            | It received more units than Cert records    |
| `sell`, `withdraw`                                                                                  | It names no Cert record                     |
| `reserve`, `adjust`, `change-product`, `release`, `sell-from-reservation`, `vault-from-reservation` | Its hold names no Cert record               |
| `cert-id-change`                                                                                    | It gave a unit of regular stock its Cert ID |
| `intake-reversal`                                                                                   | It names no Cert record                     |
| `product-create`, `product-update`                                                                  | Never                                       |

<!-- trace:scenario id=g10adm.inventory-catalog.SC-z64 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-150 - A corrected record keeps its earlier history

**Serves:** grade10-admin-inventory-catalog-US-04 - the admin follows one unit across a Cert ID change

- **GIVEN** Cert record `PSA-1234` was intaken, changed to `PSA-1243`, and
  then held by an Admin hold
- **WHEN** an authorized inventory admin selects `PSA-1243` in Cert ID details
- **THEN** its history reads, newest first, the reserve, the Cert ID change
  `PSA-1234 → PSA-1243` and the intake

<!-- trace:scenario id=g10adm.inventory-catalog.SC-59i rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-151 - An assigned record's history starts at its assignment

**Serves:** grade10-admin-inventory-catalog-US-04 - the admin sees when a unit was numbered

- **GIVEN** three units of regular stock intaken last week, one of which was
  given Cert ID `BGS-88` today
- **WHEN** an authorized inventory admin selects `BGS-88` in Cert ID details
- **THEN** its history holds one entry, `Cert ID change · No Cert ID → BGS-88`
- **AND** last week's intake is not in it

<!-- trace:scenario id=g10adm.inventory-catalog.SC-ekd rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-152 - A No Cert ID row shows the regular stock history

**Serves:** grade10-admin-inventory-catalog-US-14 - the admin reads how the regular stock moved

- **GIVEN** a product that intook three units with one Cert record `PSA-1`,
  then took an Admin hold of one unit of regular stock and an Auction hold on
  `PSA-1`, then gave a unit of regular stock Cert ID `BGS-88`
- **WHEN** an authorized inventory admin selects a `No Cert ID` row
- **THEN** the history shows the Cert ID change to `BGS-88`, the Admin
  `reserve` and the `intake`
- **AND** it does not show the Auction `reserve` of `PSA-1`

<!-- trace:scenario id=g10adm.inventory-catalog.SC-kdh rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-153 - A unit's oldest entry is reachable on a busy product

**Serves:** grade10-admin-inventory-catalog-US-04 - the admin reads a unit's full history

- **GIVEN** Cert record `PSA-1` was intaken before 150 other entries on its
  product
- **WHEN** an authorized inventory admin selects `PSA-1` and reads its history
  to the end
- **THEN** the history reaches its intake entry

<!-- trace:scenario id=g10adm.inventory-catalog.SC-oth rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-176 - A No Cert ID row shows a reduction

**Serves:** grade10-admin-inventory-catalog-US-14 - the admin reads why the regular stock count fell

- **GIVEN** a product that intook four units of regular stock and Cert record
  `PSA-1`, then reversed two units of regular stock and then `PSA-1`
- **WHEN** an authorized inventory admin selects the `No Cert ID` row
- **THEN** the history shows, newest first, the `Intake reversal · No Cert ID` of two and
  the `intake`
- **AND** it does not show `Intake reversal · PSA-1`

### Requirement: An unmoved Cert record's Cert ID can be corrected

A Cert record is **unmoved** while its status is Available and no hold,
active or closed, has ever named it: its history holds only its intake and
Cert ID changes. A record that was ever reserved, listed by Auction, sold,
withdrawn or vaulted is not unmoved, even when it is Available again.

An inventory admin SHALL correct the Cert ID of an unmoved Cert record from
Cert ID details:

1. The admin selects an unmoved Cert record and chooses Change Cert ID.
2. They enter the new Cert ID and optional remarks, and save.
3. Grade10 trims the Cert ID, changes it on the same record, and appends one
   `cert-id-change` entry.

The record SHALL keep its status, Grade Issuer, Grade, Autograph Grade,
Serial, tagged media and earlier history. Stock, reserved, available, sold,
withdrawn and vaulted SHALL NOT change. A Cert ID SHALL NOT be cleared.

**Cert ID check** - Cert IDs SHALL be compared exactly after trimming, so
letter case counts: `psa-1243` and `PSA-1243` are different Cert IDs. The
text `No Cert ID`, in any letter case after trimming, SHALL NOT be a Cert ID.

| Refused when                                                                                        | Result                                                                                        |
| --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| The record is not unmoved                                                                           | Nothing changes and no entry is appended                                                      |
| The new Cert ID is empty after trimming, or reads `No Cert ID`                                      | Nothing changes and no entry is appended                                                      |
| A Cert record of the product holds the new Cert ID, whatever its status, the record itself included | Nothing changes, no entry is appended, and the refusal names that record's Cert ID and status |
| The record does not exist, or belongs to another product                                            | Nothing changes and no entry is appended                                                      |

Cert ID details SHALL offer Change Cert ID only on an unmoved Cert record, and
SHALL show on any other Cert record that its Cert ID is fixed because the unit
has been held or has moved.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-u13 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-154 - Admin corrects a wrong Cert ID

**Serves:** grade10-admin-inventory-catalog-US-15 - the admin makes the record match the slab

- **GIVEN** an unmoved Cert record `PSA-1234` with Grade Issuer `PSA`, Grade
  `10` and one image tagged to it, on a product with stock three and reserved
  one
- **WHEN** an authorized inventory admin changes its Cert ID to `PSA-1243`
  with remarks `Typo at intake`
- **THEN** Cert ID details lists the same record as `PSA-1243`, Available
- **AND** the `cert-id-change` entry's after snapshot carries that record with
  Grade Issuer `PSA` and Grade `10`, and the image is still tagged to it
- **AND** stock reads three and reserved one

<!-- trace:scenario id=g10adm.inventory-catalog.SC-9io rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-155 - A Cert ID already used on the product is refused

**Serves:** grade10-admin-inventory-catalog-US-15 - the admin cannot give two units one number

- **GIVEN** a product with unmoved Cert record `PSA-1` and sold Cert record
  `PSA-2`
- **WHEN** an authorized inventory admin changes `PSA-1` to `PSA-2`, and then
  to `PSA-1`
- **THEN** Grade10 refuses both; the first refusal names `PSA-2` and Sold, the
  second `PSA-1` and Available
- **AND** the record still reads `PSA-1` and no entry is appended

<!-- trace:scenario id=g10adm.inventory-catalog.SC-auy rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-156 - A held or sold record keeps its Cert ID

**Serves:** grade10-admin-inventory-catalog-US-15 - the admin sees why a unit cannot change

- **GIVEN** Cert record `PSA-1` held by an Auction listing and Cert record
  `PSA-2` sold
- **WHEN** an authorized inventory admin selects each in Cert ID details
- **THEN** neither offers Change Cert ID, and each shows that its Cert ID is
  fixed because the unit has been held or has moved
- **WHEN** a change to either is sent anyway
- **THEN** Grade10 refuses it, and no record, count or entry changes

<!-- trace:scenario id=g10adm.inventory-catalog.SC-blo rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-157 - A blank Cert ID is refused

**Serves:** grade10-admin-inventory-catalog-US-15 - the admin cannot clear a Cert ID

- **GIVEN** an unmoved Cert record `PSA-1`
- **WHEN** an authorized inventory admin changes its Cert ID to three spaces
- **THEN** Grade10 refuses it
- **AND** the record still reads `PSA-1` and no entry is appended

<!-- trace:scenario id=g10adm.inventory-catalog.SC-d8o rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-167 - A released record cannot be corrected

**Serves:** grade10-admin-inventory-catalog-US-15 - a unit once held keeps the number it was held under

- **GIVEN** Cert record `PSA-1` was held by an Auction listing that closed
  with no winner, and its hold was released, so it reads Available
- **WHEN** an authorized inventory admin selects it in Cert ID details
- **THEN** it offers no Change Cert ID and shows that its Cert ID is fixed
- **WHEN** a change to `PSA-11` is sent anyway
- **THEN** Grade10 refuses it, and the record still reads `PSA-1` with no
  entry appended

<!-- trace:scenario id=g10adm.inventory-catalog.SC-sky rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-168 - No Cert ID is not a Cert ID

**Serves:** grade10-admin-inventory-catalog-US-15 - a numbered unit never reads as regular stock

- **GIVEN** an unmoved Cert record `PSA-1` and available regular stock on the
  same product
- **WHEN** an authorized inventory admin changes `PSA-1` to `no cert id`,
  and assigns `NO CERT ID` to a unit of regular stock
- **THEN** Grade10 refuses both
- **AND** no record changes or is created and no entry is appended

<!-- trace:scenario id=g10adm.inventory-catalog.SC-tl1 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-169 - Letter case makes a different Cert ID

**Serves:** grade10-admin-inventory-catalog-US-15 - the admin enters the number exactly as printed

- **GIVEN** a product with sold Cert record `PSA-1243` and unmoved Cert record
  `PSA-1234`
- **WHEN** an authorized inventory admin changes `PSA-1234` to `psa-1243`
- **THEN** the record reads `psa-1243`
- **AND** one `cert-id-change` entry is appended

### Requirement: An available unit of regular stock can be given a Cert ID

An inventory admin SHALL give one unit of available regular stock a Cert ID
from the available `No Cert ID` row of Cert ID details:

1. The admin selects the available `No Cert ID` row and chooses Assign Cert ID.
2. They enter the Cert ID and optional remarks, and save.
3. Grade10 creates one Available Cert record with that Cert ID, takes the unit
   out of regular stock, and appends one `cert-id-change` entry.

| Field   | Rules                                                                                                                                |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Cert ID | Required; trimmed; never `No Cert ID`; not held by any Cert record of the product, whatever its status, compared as for a correction |
| Remarks | Optional; trimmed                                                                                                                    |

The new record SHALL carry no Grade Issuer, Grade, Autograph Grade or Serial.
A Grade Issuer, Grade, Autograph Grade or Serial sent with an assignment SHALL
be ignored: the record is created without it, and the assignment is neither
refused nor changed by it.

Available regular stock SHALL fall by one. Stock, reserved, available, sold,
withdrawn and vaulted SHALL NOT change. The new record SHALL be unmoved and
have no tagged media.

| Refused when                                               | Result                                                                                        |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Available regular stock is 0                               | Nothing changes and no entry is appended                                                      |
| The Cert ID is empty after trimming, or reads `No Cert ID` | Nothing changes and no entry is appended                                                      |
| A Cert record of the product holds the Cert ID             | Nothing changes, no entry is appended, and the refusal names that record's Cert ID and status |

Cert ID details SHALL offer Assign Cert ID only on the available `No Cert ID`
row while it reads at least 1, and SHALL show on a hold's row, and on an
available row reading 0, that no free unit of regular stock can take a Cert
ID.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-e5t rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-159 - Admin gives a unit of regular stock its Cert ID alone

**Serves:** grade10-admin-inventory-catalog-US-15 - the admin numbers a unit with the one field intake asks for

- **GIVEN** a created product with stock five and reserved one, three units of
  regular stock, and an Admin hold of one on regular stock, so `No Cert ID`
  Available reads 2
- **WHEN** an authorized inventory admin chooses Assign Cert ID on the
  available `No Cert ID` row
- **THEN** the form asks for the Cert ID and remarks, and for no Grade Issuer,
  Grade, Autograph Grade or Serial
- **WHEN** they enter Cert ID `BGS-88` and save
- **THEN** Cert ID details lists a Cert record `BGS-88`, Available
- **AND** the `cert-id-change` entry's after snapshot carries that record with
  no Grade Issuer, Grade, Autograph Grade or Serial
- **AND** `No Cert ID` Available reads 1 and the Admin hold's row still reads 1
- **AND** stock reads five, reserved one and available four

<!-- trace:scenario id=g10adm.inventory-catalog.SC-nlh rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-160 - Held regular stock cannot be given a Cert ID

**Serves:** grade10-admin-inventory-catalog-US-15 - the admin cannot number a unit a holder has

- **GIVEN** a product whose two units of regular stock are both in one Auction
  hold
- **WHEN** an authorized inventory admin opens Cert ID details
- **THEN** `No Cert ID` Available reads 0, no row offers Assign Cert ID, and
  the rows show that no free unit of regular stock can take a Cert ID
- **WHEN** an assignment is sent anyway
- **THEN** Grade10 refuses it, and no record, count or entry changes

<!-- trace:scenario id=g10adm.inventory-catalog.SC-myo rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-162 - A taken or blank Cert ID is refused on assignment

**Serves:** grade10-admin-inventory-catalog-US-15 - the admin cannot give two units one number

- **GIVEN** a product with available regular stock and a sold Cert record
  `PSA-2`
- **WHEN** an authorized inventory admin assigns `PSA-2`, and then a blank
  Cert ID
- **THEN** Grade10 refuses both, the first naming `PSA-2` and Sold
- **AND** no Cert record is created and no entry is appended

<!-- trace:scenario id=g10adm.inventory-catalog.SC-sbe rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-163 - An assigned unit can be held by its Cert ID

**Serves:** grade10-admin-inventory-catalog-US-15 - the numbered unit can go to a listing

- **GIVEN** a unit of regular stock was given Cert ID `BGS-88` and carries no
  other copy fact
- **WHEN** Auction reserves `BGS-88`
- **THEN** the hold has quantity one and names that record
- **AND** available regular stock is unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-zu9 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-171 - Copy facts sent with an assignment are ignored

**Serves:** grade10-admin-inventory-catalog-US-15 - an assignment sent from outside the page records what the page would

- **GIVEN** a product with available regular stock
- **WHEN** an assignment of Cert ID `BGS-89` is sent from outside Cert ID
  details with Grade Issuer `RAW`, Grade `10`, Autograph Grade `9` and Serial
  `1/1`
- **THEN** Grade10 creates Cert record `BGS-89`, Available, with no Grade
  Issuer, Grade, Autograph Grade or Serial
- **AND** available regular stock falls by one and one `cert-id-change` entry
  is appended

### Requirement: Only an inventory admin who may write inventory changes a Cert ID

Correcting and assigning a Cert ID SHALL need the grant that intake needs. An
inventory admin with read access only SHALL see the rows and the history in
Cert ID details, with no Change Cert ID or Assign Cert ID.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-pwt rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-164 - A reader without the write grant cannot change a Cert ID

**Serves:** grade10-admin-inventory-catalog-US-14 - a reader accounts for units without changing them

- **GIVEN** an inventory admin who may read inventory but not write it, and a
  product with an unmoved Cert record and available regular stock
- **WHEN** they open Cert ID details
- **THEN** they see every row and each unit's history, and no row offers
  Change Cert ID or Assign Cert ID
- **WHEN** they send a correction or an assignment anyway
- **THEN** Grade10 refuses it, and no record, count or entry changes

### Requirement: A Cert ID change lands whole against holds and other changes

A correction or an assignment SHALL check its unit, the Cert ID and available
regular stock in the transaction that writes it, after any hold, sale or Cert
ID change on the same product that committed first. It SHALL land whole or
not at all.

#### Scenario: grade10-admin-inventory-catalog-SC-165 - A hold taken first refuses the correction

**Serves:** Cert ID details - a hold and a correction on one unit never both land against the old state

- **GIVEN** Cert record `PSA-1` is unmoved and an inventory admin has Change
  Cert ID open on it
- **WHEN** Auction reserves `PSA-1`, and then the admin saves `PSA-11`
- **THEN** Grade10 refuses the correction
- **AND** the hold names `PSA-1` and no `cert-id-change` entry is appended

#### Scenario: grade10-admin-inventory-catalog-SC-166 - Two assignments at once take only what is there

**Serves:** Cert ID details - two admins numbering units at once never overdraw regular stock

- **GIVEN** a product with one unit of available regular stock
- **WHEN** two inventory admins assign `BGS-1` and `BGS-2` at the same moment
- **THEN** exactly one Cert record is created, available regular stock is 0,
  and one `cert-id-change` entry is appended
- **AND** the other assignment is refused

### Requirement: Regular stock intaken since its latest move can be reduced

**Move of regular stock** - any of these on the product:

| Move | Moves regular stock when |
| --- | --- |
| A hold taken, resized, released, or sold or vaulted from | The hold names no Cert record |
| A hold moved to another product | It named no Cert record on this product |
| A hold moved from another product | It names no Cert record on this product |
| A sale or withdrawal of available stock | It names no Cert record |

An intake, a Cert ID assignment and an intake reversal are not moves. Nothing
done to a Cert record moves regular stock, a record given its Cert ID from
regular stock included: after its assignment the record is judged on its
own.

**Reducible count** - the units of regular stock intaken after the latest
move, or since the first intake where regular stock never moved, less the
units given a Cert ID or reduced after that move; never below 0, and never
more than available regular stock.

| After the latest move                   | Reducible count                   |
| --------------------------------------- | --------------------------------- |
| An intake                               | Rises by its units with no Cert ID |
| A Cert ID assignment from regular stock | Falls by 1                        |
| A reduction of regular stock            | Falls by its units                |
| A move of regular stock                 | Starts again from 0               |

Example: a product has 4 units of regular stock and sells 1 from available
stock, then intakes 10 by mistake and gives one unit Cert ID `BGS-88`.

| Step              | Available regular stock | Reducible count |
| ----------------- | ----------------------- | --------------- |
| After the sale    | 3                       | 0               |
| After the intake  | 13                      | 10              |
| After `BGS-88`    | 12                      | 9               |
| After reducing 9  | 3                       | 0               |

The 3 units intaken before the sale stay.

An inventory admin SHALL reduce regular stock from Cert ID details:

1. The admin selects the available `No Cert ID` row and chooses `Reduce
   quantity`.
2. The confirmation opens; they enter the number of units, keep or edit the
   remarks, and confirm.
3. Grade10 lowers stock and available regular stock by that number and
   appends one `intake-reversal` entry.

| Field    | Rules                                                          |
| -------- | -------------------------------------------------------------- |
| Quantity | Required; opens empty; a whole number from 1 to the reducible count |
| Remarks  | Required; trimmed; never empty                                 |

Available and derived ledger SHALL fall by the quantity. Reserved, sold,
withdrawn and vaulted, and every Cert record, SHALL NOT change.

| Refused when                                                                    | Result                                   |
| ------------------------------------------------------------------------------- | ---------------------------------------- |
| The quantity is above the reducible count                                       | Nothing changes and no entry is appended |
| The quantity is not a whole number, or is below 1                               | Nothing changes and no entry is appended |
| The remarks are empty after trimming                                            | Nothing changes and no entry is appended |

Cert ID details SHALL offer `Reduce quantity` on the available `No Cert ID`
row only while the reducible count is at least 1. While the reducible count
is 0 and the row reads at least 1, the row SHALL show that its units were
intaken before regular stock last moved and cannot be reduced.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-w4o rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-177 - Admin reduces regular stock intaken by mistake

**Serves:** grade10-admin-inventory-catalog-US-16 - the admin takes back units counted twice

- **GIVEN** a created product that intook five units of regular stock and Cert
  record `PSA-1`, with stock six and derived ledger six, and nothing held,
  sold, withdrawn or vaulted
- **WHEN** an authorized inventory admin reduces regular stock by two units
  with remarks `Entered by mistake`
- **THEN** stock reads four, derived ledger four and withdrawn zero
- **AND** `No Cert ID` Available reads 3 and `PSA-1` is still listed
  Available
- **AND** one `intake-reversal` entry with quantity two is appended

<!-- trace:scenario id=g10adm.inventory-catalog.SC-zoe rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-178 - A Cert ID assignment leaves regular stock reducible

**Serves:** grade10-admin-inventory-catalog-US-16 - numbering one unit does not lock the rest in

- **GIVEN** a product that intook three units of regular stock and gave one
  Cert ID `BGS-88`, so `No Cert ID` Available reads 2, and nothing has moved
- **WHEN** an authorized inventory admin selects the available `No Cert ID`
  row
- **THEN** it offers `Reduce quantity`
- **WHEN** they reduce it by two units
- **THEN** `No Cert ID` Available reads 0, `BGS-88` is still listed
  Available, and stock reads one

<!-- trace:scenario id=g10adm.inventory-catalog.SC-nnc rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-179 - Regular stock with nothing intaken since it moved cannot be reduced

**Serves:** grade10-admin-inventory-catalog-US-16 - units that were handled stay in the ledger

- **GIVEN** product A, whose Admin hold of one unit of regular stock was
  released, so `No Cert ID` Available reads 3; product B, which lost one unit
  of regular stock to a withdrawal of available stock and has 2 left; and
  product C, whose Auction hold on one unit of regular stock was moved to
  another product, leaving 2; none has intaken regular stock since
- **WHEN** an authorized inventory admin opens Cert ID details on each
- **THEN** no available `No Cert ID` row offers `Reduce quantity`, and each
  shows that its units were intaken before regular stock last moved
- **WHEN** a reduction of one unit is sent anyway on each
- **THEN** Grade10 refuses all three, and no count or entry changes

<!-- trace:scenario id=g10adm.inventory-catalog.SC-srm rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-180 - A Cert record's moves leave regular stock reducible

**Serves:** grade10-admin-inventory-catalog-US-16 - a sold numbered card does not stop the admin fixing the count

- **GIVEN** a product that intook three units of regular stock and Cert record
  `PSA-1`, gave one unit of regular stock Cert ID `BGS-88`, then sold `PSA-1`
  through an Auction hold and took an Admin hold on `BGS-88`
- **WHEN** an authorized inventory admin reduces regular stock by two units
- **THEN** Grade10 accepts it: stock falls by two and sold is unchanged
- **AND** `No Cert ID` Available reads 0 and the hold on `BGS-88` is unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-zu3 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-181 - A quantity outside one to the reducible count is refused

**Serves:** grade10-admin-inventory-catalog-US-16 - the admin cannot take out more than was intaken since the last move

- **GIVEN** a product with 3 units of regular stock that sold 1 from
  available stock and then intook 2, so `No Cert ID` Available reads 4 and the
  reducible count is 2
- **WHEN** a reduction of three units, of zero units, and of 1.5 units is sent
- **THEN** Grade10 refuses each
- **AND** stock reads as before and no entry is appended

<!-- trace:scenario id=g10adm.inventory-catalog.SC-9lp rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-194 - An over-intake after a sale can be reduced by the units intaken since

**Serves:** grade10-admin-inventory-catalog-US-16 - a product with sales can still fix an over-intake

- **GIVEN** a product with 4 units of regular stock that sold 1 from available
  stock, then intook 10 by mistake, so `No Cert ID` Available reads 13
- **WHEN** an authorized inventory admin selects the available `No Cert ID`
  row and chooses `Reduce quantity`
- **THEN** the confirmation says at most 10 units can be reduced
- **WHEN** they reduce it by 10 units
- **THEN** `No Cert ID` Available reads 3, stock falls by 10 and sold is
  unchanged
- **AND** the row offers no `Reduce quantity` and shows that its units were
  intaken before regular stock last moved

<!-- trace:scenario id=g10adm.inventory-catalog.SC-sm9 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-195 - A Cert ID given after the latest move lowers the reducible count

**Serves:** grade10-admin-inventory-catalog-US-16 - a unit numbered from the over-intake is no longer regular stock to take out

- **GIVEN** a product with 4 units of regular stock that sold 1 from available
  stock, then intook 10, then gave one unit of regular stock Cert ID `BGS-88`,
  so `No Cert ID` Available reads 12
- **WHEN** an authorized inventory admin chooses `Reduce quantity` on the
  available `No Cert ID` row
- **THEN** the confirmation says at most 9 units can be reduced
- **WHEN** a reduction of 10 units is sent anyway
- **THEN** Grade10 refuses it, and no count or entry changes

<!-- trace:scenario id=g10adm.inventory-catalog.SC-c7i rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-196 - A move after an intake ends that intake's reduction

**Serves:** grade10-admin-inventory-catalog-US-16 - units intaken before regular stock was handled stay in the ledger

- **GIVEN** a product that intook 5 units of regular stock, then took an Admin
  hold of 1 unit of regular stock, so `No Cert ID` Available reads 4
- **WHEN** an authorized inventory admin opens Cert ID details
- **THEN** the available `No Cert ID` row offers no `Reduce quantity`
- **WHEN** the product intakes 2 more units of regular stock
- **THEN** the row offers `Reduce quantity`, and its confirmation says at most
  2 units can be reduced

### Requirement: An unmoved Cert record can be removed as never received

An inventory admin SHALL remove an unmoved Cert record, as `An unmoved Cert
record's Cert ID can be corrected` defines it, from Cert ID details. A record
given its Cert ID from regular stock is removed the same way while it has not
moved since; its moves are its own and never count against regular stock. A
hold that named the record counts, though it was later moved to another
product.

1. The admin selects an unmoved Cert record and chooses `Remove`.
2. The confirmation opens; they keep or edit the remarks and confirm.
3. Grade10 lowers stock by one, deletes the Cert record and the source media
   tagged to it, and appends one `intake-reversal` entry naming its Cert ID.

Available and derived ledger SHALL fall by one. Reserved, sold, withdrawn,
vaulted and available regular stock SHALL NOT change. Untagged product media
and media tagged to other Cert records SHALL remain. The Cert ID SHALL then be
free on the product: a later intake or assignment may take it, as a new Cert
record.

| Refused when                                             | Result                                   |
| -------------------------------------------------------- | ---------------------------------------- |
| The record is not unmoved                                | Nothing changes and no entry is appended |
| The remarks are empty after trimming                     | Nothing changes and no entry is appended |
| The record does not exist, or belongs to another product | Nothing changes and no entry is appended |

Cert ID details SHALL offer `Remove` only on an unmoved Cert record.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-cbm rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-182 - Admin removes a Cert record intaken by mistake

**Serves:** grade10-admin-inventory-catalog-US-16 - the admin takes out a card that never arrived

- **GIVEN** a product with stock three: unmoved Cert record `PSA-1234` with
  one image tagged to it, Cert record `PSA-5` with one image tagged to it, one
  unit of regular stock, and one untagged product image
- **WHEN** an authorized inventory admin removes `PSA-1234` with remarks
  `Card never arrived`
- **THEN** Cert ID details no longer lists `PSA-1234`
- **AND** stock reads two, derived ledger falls by one and withdrawn is
  unchanged
- **AND** the image tagged to `PSA-1234` is deleted, and the image tagged to
  `PSA-5` and the untagged image remain

<!-- trace:scenario id=g10adm.inventory-catalog.SC-i1t rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-183 - A removed Cert ID can be intaken again

**Serves:** grade10-admin-inventory-catalog-US-16 - the right card can arrive under the same number

- **GIVEN** Cert record `PSA-1234` was removed as never received on its
  product
- **WHEN** an authorized inventory admin intakes one unit with Cert ID
  `PSA-1234` on that product
- **THEN** Grade10 accepts the intake
- **AND** Cert ID details lists a Cert record `PSA-1234`, Available, whose
  history starts at that intake

<!-- trace:scenario id=g10adm.inventory-catalog.SC-8rx rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-184 - A record numbered from regular stock can be removed

**Serves:** grade10-admin-inventory-catalog-US-16 - a unit numbered and then found never received leaves whole

- **GIVEN** a product that intook three units of regular stock and gave one
  Cert ID `BGS-88`, and nothing has moved
- **WHEN** an authorized inventory admin removes `BGS-88`
- **THEN** `BGS-88` is no longer listed and stock reads two
- **AND** `No Cert ID` Available still reads 2

<!-- trace:scenario id=g10adm.inventory-catalog.SC-8m1 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-185 - A Cert record that has moved is not reversed

**Serves:** grade10-admin-inventory-catalog-US-16 - a card once handled stays in the ledger

- **GIVEN** Cert record `PSA-1`, whose Auction hold was released so it reads
  Available, and Cert record `PSA-2`, sold
- **WHEN** an authorized inventory admin selects each in Cert ID details
- **THEN** neither offers `Remove`
- **WHEN** a removal of either as never received is sent anyway
- **THEN** Grade10 refuses it, and no record, count, media or entry changes

<!-- trace:scenario id=g10adm.inventory-catalog.SC-x7l rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-186 - A hold moved to another product still counts

**Serves:** grade10-admin-inventory-catalog-US-16 - a card a listing once held stays handled after the listing changes product

- **GIVEN** an Auction hold named Cert record `PSA-1` and was then moved to
  another product, so `PSA-1` reads Available with no hold naming it
- **WHEN** an authorized inventory admin selects `PSA-1` in Cert ID details
- **THEN** it offers neither Change Cert ID nor `Remove`, and shows that its
  Cert ID is fixed
- **AND** it offers `Remove physical unit`
- **WHEN** a removal as never received or a Cert ID change of `PSA-1` is sent
  anyway
- **THEN** Grade10 refuses both, and no record, count or entry changes

### Requirement: A reversal is confirmed with remarks first

Each reversal SHALL be offered under its own name, with a tooltip on hover.

| Row                                | Action            | Tooltip                                                                                         |
| ---------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------- |
| The available `No Cert ID` row     | `Reduce quantity` | It takes out units intaken by mistake, as if they were never received; withdrawn does not move |
| A Cert record that has only been intaken | `Remove`    | It takes out a unit intaken by mistake, as if it was never received; withdrawn does not move   |

Choosing either SHALL open a confirmation before anything changes.

| Part     | On a Cert record                                                   | On the available `No Cert ID` row                                       |
| -------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Names    | Its Cert ID                                                        | The number of units, entered by the admin; the field opens empty        |
| Limit    | -                                                                  | The reducible count, as the most units that can be reduced             |
| Says     | Stock and the ledger fall by 1, and media tagged to it are deleted | Stock and the ledger fall by the number entered                         |
| Remarks  | Prefilled `Entered by mistake`; editable                           | Prefilled `Entered by mistake`; editable                                |

Confirm SHALL be unavailable while the remarks are empty after trimming, or,
on the `No Cert ID` row, while the number is empty or not a whole number from
1 to the reducible count. Cancelling SHALL change nothing and append no entry.
The entry's reason SHALL be the remarks as confirmed, trimmed.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-9iv rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-187 - The confirmation names the Cert record and cancelling changes nothing

**Serves:** grade10-admin-inventory-catalog-US-16 - a misclick takes nothing out

- **GIVEN** an unmoved Cert record `PSA-1234` with one image tagged to it, on
  a product with stock three
- **WHEN** an authorized inventory admin chooses `Remove` on it
- **THEN** a confirmation names `PSA-1234`, says stock and the ledger fall by
  1 and its tagged media are deleted, and holds remarks reading
  `Entered by mistake`
- **WHEN** they cancel
- **THEN** `PSA-1234` is still listed with its image, stock reads three and no
  entry is appended

<!-- trace:scenario id=g10adm.inventory-catalog.SC-4jy rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-188 - The number opens empty and edited remarks are recorded

**Serves:** grade10-admin-inventory-catalog-US-16 - the admin chooses the number on purpose and says why the count was wrong

- **GIVEN** a product whose regular stock has never moved and reads
  `No Cert ID` Available 5
- **WHEN** an authorized inventory admin chooses `Reduce quantity` on that row
- **THEN** the number of units is empty, the confirmation says at most 5
  units can be reduced, and Confirm is unavailable
- **WHEN** they enter 3 and replace the remarks with `Counted twice at intake`
- **THEN** the confirmation says stock and the ledger fall by 3, and Confirm
  is available
- **WHEN** they confirm
- **THEN** the `intake-reversal` entry records quantity three and the reason
  `Counted twice at intake`

<!-- trace:scenario id=g10adm.inventory-catalog.SC-7hq rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-189 - Empty remarks cannot be confirmed

**Serves:** grade10-admin-inventory-catalog-US-16 - every unit taken out says why

- **GIVEN** the confirmation is open on an unmoved Cert record `PSA-1`
- **WHEN** an authorized inventory admin clears the remarks, leaving three
  spaces
- **THEN** Confirm is unavailable
- **WHEN** a removal of `PSA-1` with blank remarks is sent anyway
- **THEN** Grade10 refuses it, and `PSA-1` is still listed with no entry
  appended

<!-- trace:scenario id=g10adm.inventory-catalog.SC-grz rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-197 - Each reversal action explains itself on hover

**Serves:** grade10-admin-inventory-catalog-US-16 - the admin tells a reversal from a withdrawal before choosing it

- **GIVEN** a product whose regular stock has never moved and reads
  `No Cert ID` Available 2, and unmoved Cert record `PSA-1`
- **WHEN** an authorized inventory admin hovers over `Reduce quantity` on the
  available `No Cert ID` row, and over `Remove` on `PSA-1`
- **THEN** each shows a tooltip saying it takes out units intaken by mistake
  as if they were never received, and that withdrawn does not move
- **AND** nothing changes

### Requirement: Only an inventory admin who may write inventory reverses an intake

Reversing an intake SHALL need the grant that intake needs. An inventory
admin with read access only SHALL see the rows and the history in Cert ID
details, with no `Reduce quantity` and no `Remove`.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-4lh rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-190 - A reader without the write grant cannot reverse an intake

**Serves:** grade10-admin-inventory-catalog-US-14 - a reader accounts for units without taking any out

- **GIVEN** an inventory admin who may read inventory but not write it, and a
  product with an unmoved Cert record and regular stock that has never moved
- **WHEN** they open Cert ID details
- **THEN** they see every row and each unit's history, and no row offers
  `Reduce quantity` or `Remove`
- **WHEN** they send a reduction or a removal anyway
- **THEN** Grade10 refuses it, and no record, count, media or entry changes

### Requirement: A reversal lands whole against holds and other changes

A reduction or a removal SHALL check its unit, whether it has moved, and the
reducible count in the transaction that writes it, after any hold, sale,
intake, Cert ID change or reversal on the same product that committed first.
It SHALL land whole or not at all.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-gbg rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-191 - A hold taken first refuses the removal

**Serves:** grade10-admin-inventory-catalog-US-16 - a hold and a removal on one card never both land

- **GIVEN** Cert record `PSA-1` is unmoved and an inventory admin has the
  confirmation open on it
- **WHEN** Auction reserves `PSA-1`, and then the admin confirms
- **THEN** Grade10 refuses the removal
- **AND** the hold names `PSA-1`, stock is unchanged and no `intake-reversal`
  entry is appended

<!-- trace:scenario id=g10adm.inventory-catalog.SC-y0i rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-192 - A hold on regular stock taken first refuses the reduction

**Serves:** grade10-admin-inventory-catalog-US-16 - a hold and a reduction on regular stock never both land

- **GIVEN** regular stock that has never moved reads `No Cert ID` Available 3
  and an inventory admin has the confirmation open for two units
- **WHEN** an Admin hold takes one unit of regular stock, and then the admin
  confirms
- **THEN** Grade10 refuses the reduction, since the hold is a move after every
  intake and the reducible count is 0
- **AND** stock is unchanged and no `intake-reversal` entry is appended

#### Scenario: grade10-admin-inventory-catalog-SC-193 - Two reductions at once take only what is there

**Serves:** grade10-admin-inventory-catalog-US-16 - two admins fixing one count never take out more than was intaken

- **GIVEN** regular stock that has never moved reads `No Cert ID` Available 3
- **WHEN** two inventory admins each reduce it by two at the same moment
- **THEN** exactly one reduction lands, `No Cert ID` Available reads 1, and
  one `intake-reversal` entry is appended
- **AND** the other is refused
