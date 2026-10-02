# grade10-admin/inventory/catalog Specification

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
  - Assign a Cert ID: one available unit of regular stock becomes a Cert record with its copy facts
  - Cert ID history: each change is one history entry naming the Cert ID before and after

## MODIFIED Requirements

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
| Action           | `product-create`, `product-update`, `intake`, `reserve`, `adjust`, `change-product`, `release`, `sell-from-reservation`, `vault-from-reservation`, `sell`, `withdraw`, or `cert-id-change`                                                                                                                  |
| Quantity         | Positive transition quantity for inventory actions; one for cert-id-change; for adjust or change-product, the new quantity; null for product metadata                                                                                                                                                       |
| Reservation id   | Required for reserve, adjust, change-product, release, sell-from-reservation, vault-from-reservation; null otherwise                                                                                                                                                                                        |
| Sold total price | Positive integer minor units for sell / sell-from-reservation; null otherwise                                                                                                                                                                                                                               |
| Sold currency    | ISO 4217 code for sell / sell-from-reservation; null otherwise                                                                                                                                                                                                                                              |
| Reason           | The entry's remarks. Required for withdraw; optional for intake and cert-id-change; on a release Auction makes for a listing that closed with no winner, `Released by unsold listing` at its close and `Released by unsold listing (clean-up)` from the one-off release of an earlier close; null otherwise |
| Before           | Canonical snapshot immediately before; null for product-create. For cert-id-change it carries the unit's Cert record as it was, and no Cert record when the unit was regular stock, read as `No Cert ID`                                                                                                    |
| After            | Canonical snapshot immediately after. For cert-id-change it carries the unit's Cert record as it now is                                                                                                                                                                                                     |

Product actions SHALL snapshot product metadata. Inventory actions SHALL
snapshot the affected inventory; reservation-affecting actions SHALL also
snapshot the reservation header. A cert-id-change SHALL snapshot the affected
inventory, and the unit's Cert record on each side where it has one. Every intake, terminal transition, reserve,
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

#### Scenario: grade10-admin-inventory-catalog-SC-136 - An Unsold release carries its remarks and the listing's label

**Serves:** grade10-admin-inventory-catalog-US-09 - the admin sees why the stock came back

- **GIVEN** Auction holds an active reservation of two for listing `7KQ2P`,
  titled `Charizard PSA 10`, which closes with no winner
- **WHEN** Auction releases it at the close
- **THEN** one `release` change records quantity two, the reservation id and
  the reason `Released by unsold listing`
- **AND** its reservation snapshot carries the holder label
  `7KQ2P · Charizard PSA 10`

#### Scenario: grade10-admin-inventory-catalog-SC-137 - The clean-up release reads differently from the close

**Serves:** grade10-admin-inventory-catalog-US-09 - the admin sees why the stock came back

- **GIVEN** Auction holds an active reservation of five for a listing that
  closed with no winner before the release shipped
- **WHEN** the one-off release frees it
- **THEN** one `release` change records quantity five and the reason
  `Released by unsold listing (clean-up)`

#### Scenario: grade10-admin-inventory-catalog-SC-138 - A call-off release keeps no reason

**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** Auction holds an active reservation of two for a listing an
  operator calls off before its close
- **WHEN** Auction releases it
- **THEN** one `release` change records quantity two and no reason

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

#### Scenario: grade10-admin-inventory-catalog-SC-145 - An assignment records No Cert ID before

**Serves:** grade10-admin-inventory-catalog-US-04 - the admin reads when a unit of regular stock was numbered

- **GIVEN** a product with available regular stock
- **WHEN** an authorized inventory admin gives one unit Cert ID `BGS-88` with
  no remarks
- **THEN** one `cert-id-change` change records quantity one, the operator and
  no reason
- **AND** its before snapshot carries no Cert record and its after snapshot
  carries the new record with `BGS-88`

### Requirement: The product page and history name each hold's holder

The reservations table's **Reference** SHALL show a reservation's holder label
when it has one, else its holder reference.

Every change history entry on the product page SHALL show:

| Column   | Shows                                                                                                                                                                                                                                           |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| When     | The date and time the entry occurred                                                                                                                                                                                                            |
| Action   | The entry's action; a Cert ID change also shows its Cert ID before and after, as `Cert ID change · <before> → <after>`, with `No Cert ID` as the before of an assignment                                                                        |
| Quantity | The entry's quantity                                                                                                                                                                                                                            |
| Actor    | The entry's actor                                                                                                                                                                                                                               |
| Holder   | The holder kind, read as Auction, Vault or Admin, of the reservation the entry moved, followed by its holder label, else its holder reference, as its after snapshot holds them, else its before snapshot; `—` for an entry with no reservation |
| Remarks  | The entry's reason; `—` when it has none                                                                                                                                                                                                        |

The words Auction, Vault and Admin SHALL be the page's; the stored holder kind
and holder reference SHALL be unchanged.

#### Scenario: grade10-admin-inventory-catalog-SC-141 - An Unsold release names its holder and remarks in the history

**Serves:** grade10-admin-inventory-catalog-US-09 - the admin sees why the stock came back

- **GIVEN** a product whose Auction hold of two for listing `7KQ2P`, titled
  `Charizard PSA 10`, was released at an Unsold close
- **WHEN** an authorized inventory admin opens the product's change history
- **THEN** the release entry shows its date and time, `release`, quantity two
  and the Auction actor
- **AND** its Holder shows `Auction` and
  `7KQ2P · Charizard PSA 10`, and its Remarks read `Released by unsold listing`

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

## ADDED Requirements

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

#### Scenario: grade10-admin-inventory-catalog-SC-148 - Held regular stock reads Available 0

**Serves:** grade10-admin-inventory-catalog-US-14 - the admin sees regular stock that is all held

- **GIVEN** a created product with no Cert record, three units of regular
  stock sold, one withdrawn, and two on hand held by one Auction hold
- **WHEN** an authorized inventory admin opens Cert ID details
- **THEN** the rows read `No Cert ID` Available `—` 0, then `No Cert ID`
  Reserved with the Auction hold's holder and 2
- **AND** no row lists the sold or withdrawn units

#### Scenario: grade10-admin-inventory-catalog-SC-149 - A released hold returns its units to the available row

**Serves:** grade10-admin-inventory-catalog-US-14 - the admin sees a released hold's units come back

- **GIVEN** Cert ID details shows `No Cert ID` Available 1 and an Admin hold
  row of 2 on regular stock
- **WHEN** an authorized inventory admin releases the Admin hold whole from
  the product page and opens Cert ID details again
- **THEN** `No Cert ID` Available reads 3
- **AND** the Admin hold's row is gone

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
| `product-create`, `product-update`                                                                  | Never                                       |

#### Scenario: grade10-admin-inventory-catalog-SC-150 - A corrected record keeps its earlier history

**Serves:** grade10-admin-inventory-catalog-US-04 - the admin follows one unit across a Cert ID change

- **GIVEN** Cert record `PSA-1234` was intaken, changed to `PSA-1243`, and
  then held by an Admin hold
- **WHEN** an authorized inventory admin selects `PSA-1243` in Cert ID details
- **THEN** its history reads, newest first, the reserve, the Cert ID change
  `PSA-1234 → PSA-1243` and the intake

#### Scenario: grade10-admin-inventory-catalog-SC-151 - An assigned record's history starts at its assignment

**Serves:** grade10-admin-inventory-catalog-US-04 - the admin sees when a unit was numbered

- **GIVEN** three units of regular stock intaken last week, one of which was
  given Cert ID `BGS-88` today
- **WHEN** an authorized inventory admin selects `BGS-88` in Cert ID details
- **THEN** its history holds one entry, `Cert ID change · No Cert ID → BGS-88`
- **AND** last week's intake is not in it

#### Scenario: grade10-admin-inventory-catalog-SC-152 - A No Cert ID row shows the regular stock history

**Serves:** grade10-admin-inventory-catalog-US-14 - the admin reads how the regular stock moved

- **GIVEN** a product that intook three units with one Cert record `PSA-1`,
  then took an Admin hold of one unit of regular stock and an Auction hold on
  `PSA-1`, then gave a unit of regular stock Cert ID `BGS-88`
- **WHEN** an authorized inventory admin selects a `No Cert ID` row
- **THEN** the history shows the Cert ID change to `BGS-88`, the Admin
  `reserve` and the `intake`
- **AND** it does not show the Auction `reserve` of `PSA-1`

#### Scenario: grade10-admin-inventory-catalog-SC-153 - A unit's oldest entry is reachable on a busy product

**Serves:** grade10-admin-inventory-catalog-US-04 - the admin reads a unit's full history

- **GIVEN** Cert record `PSA-1` was intaken before 150 other entries on its
  product
- **WHEN** an authorized inventory admin selects `PSA-1` and reads its history
  to the end
- **THEN** the history reaches its intake entry

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

#### Scenario: grade10-admin-inventory-catalog-SC-155 - A Cert ID already used on the product is refused

**Serves:** grade10-admin-inventory-catalog-US-15 - the admin cannot give two units one number

- **GIVEN** a product with unmoved Cert record `PSA-1` and sold Cert record
  `PSA-2`
- **WHEN** an authorized inventory admin changes `PSA-1` to `PSA-2`, and then
  to `PSA-1`
- **THEN** Grade10 refuses both; the first refusal names `PSA-2` and Sold, the
  second `PSA-1` and Available
- **AND** the record still reads `PSA-1` and no entry is appended

#### Scenario: grade10-admin-inventory-catalog-SC-156 - A held or sold record keeps its Cert ID

**Serves:** grade10-admin-inventory-catalog-US-15 - the admin sees why a unit cannot change

- **GIVEN** Cert record `PSA-1` held by an Auction listing and Cert record
  `PSA-2` sold
- **WHEN** an authorized inventory admin selects each in Cert ID details
- **THEN** neither offers Change Cert ID, and each shows that its Cert ID is
  fixed because the unit has been held or has moved
- **WHEN** a change to either is sent anyway
- **THEN** Grade10 refuses it, and no record, count or entry changes

#### Scenario: grade10-admin-inventory-catalog-SC-157 - A blank Cert ID is refused

**Serves:** grade10-admin-inventory-catalog-US-15 - the admin cannot clear a Cert ID

- **GIVEN** an unmoved Cert record `PSA-1`
- **WHEN** an authorized inventory admin changes its Cert ID to three spaces
- **THEN** Grade10 refuses it
- **AND** the record still reads `PSA-1` and no entry is appended

#### Scenario: grade10-admin-inventory-catalog-SC-167 - A released record cannot be corrected

**Serves:** grade10-admin-inventory-catalog-US-15 - a unit once held keeps the number it was held under

- **GIVEN** Cert record `PSA-1` was held by an Auction listing that closed
  with no winner, and its hold was released, so it reads Available
- **WHEN** an authorized inventory admin selects it in Cert ID details
- **THEN** it offers no Change Cert ID and shows that its Cert ID is fixed
- **WHEN** a change to `PSA-11` is sent anyway
- **THEN** Grade10 refuses it, and the record still reads `PSA-1` with no
  entry appended

#### Scenario: grade10-admin-inventory-catalog-SC-168 - No Cert ID is not a Cert ID

**Serves:** grade10-admin-inventory-catalog-US-15 - a numbered unit never reads as regular stock

- **GIVEN** an unmoved Cert record `PSA-1` and available regular stock on the
  same product
- **WHEN** an authorized inventory admin changes `PSA-1` to `no cert id`,
  and assigns `NO CERT ID` with Grade Issuer `PSA` to a unit of regular stock
- **THEN** Grade10 refuses both
- **AND** no record changes or is created and no entry is appended

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
2. They enter the unit's facts and optional remarks, and save.
3. Grade10 creates one Available Cert record with those facts, takes the unit
   out of regular stock, and appends one `cert-id-change` entry.

| Field           | Rules                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Cert ID         | Required; trimmed; never `No Cert ID`; not held by any Cert record of the product, whatever its status, compared as for a correction |
| Grade Issuer    | Required; trimmed; names a grading issuer, never `RAW`                                                                               |
| Grade           | Optional text; blank or `-` is absent                                                                                                |
| Autograph Grade | Optional text; blank or `-` is absent                                                                                                |
| Serial          | Optional text; blank or `-` is absent                                                                                                |
| Remarks         | Optional; trimmed                                                                                                                    |

Available regular stock SHALL fall by one. Stock, reserved, available, sold,
withdrawn and vaulted SHALL NOT change. The new record SHALL be unmoved and
have no tagged media.

| Refused when                                               | Result                                                                                        |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Available regular stock is 0                               | Nothing changes and no entry is appended                                                      |
| The Cert ID is empty after trimming, or reads `No Cert ID` | Nothing changes and no entry is appended                                                      |
| A Cert record of the product holds the Cert ID             | Nothing changes, no entry is appended, and the refusal names that record's Cert ID and status |
| The Grade Issuer is empty after trimming, or is `RAW`      | Nothing changes and no entry is appended                                                      |

Cert ID details SHALL offer Assign Cert ID only on the available `No Cert ID`
row while it reads at least 1, and SHALL show on a hold's row, and on an
available row reading 0, that no free unit of regular stock can take a Cert
ID.

#### Scenario: grade10-admin-inventory-catalog-SC-159 - Admin gives a unit of regular stock its Cert ID

**Serves:** grade10-admin-inventory-catalog-US-15 - the admin numbers a unit without intaking it again

- **GIVEN** a created product with stock five and reserved one, three units of
  regular stock, and an Admin hold of one on regular stock, so `No Cert ID`
  Available reads 2
- **WHEN** an authorized inventory admin assigns Cert ID `BGS-88`, Grade
  Issuer `BGS`, Grade `9.5`, Autograph Grade `-` and no Serial
- **THEN** Cert ID details lists a Cert record `BGS-88`, Available
- **AND** the `cert-id-change` entry's after snapshot carries that record with
  Grade Issuer `BGS`, Grade `9.5`, and no Autograph Grade or Serial
- **AND** `No Cert ID` Available reads 1 and the Admin hold's row still reads 1
- **AND** stock reads five, reserved one and available four

#### Scenario: grade10-admin-inventory-catalog-SC-160 - Held regular stock cannot be given a Cert ID

**Serves:** grade10-admin-inventory-catalog-US-15 - the admin cannot number a unit a holder has

- **GIVEN** a product whose two units of regular stock are both in one Auction
  hold
- **WHEN** an authorized inventory admin opens Cert ID details
- **THEN** `No Cert ID` Available reads 0, no row offers Assign Cert ID, and
  the rows show that no free unit of regular stock can take a Cert ID
- **WHEN** an assignment is sent anyway
- **THEN** Grade10 refuses it, and no record, count or entry changes

#### Scenario: grade10-admin-inventory-catalog-SC-161 - RAW or a missing Grade Issuer is refused

**Serves:** grade10-admin-inventory-catalog-US-15 - every numbered unit names its issuer

- **GIVEN** a product with available regular stock
- **WHEN** an authorized inventory admin assigns Cert ID `BGS-88` with Grade
  Issuer `RAW`, and then with no Grade Issuer
- **THEN** Grade10 refuses both
- **AND** no Cert record is created and available regular stock is unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-162 - A taken or blank Cert ID is refused on assignment

**Serves:** grade10-admin-inventory-catalog-US-15 - the admin cannot give two units one number

- **GIVEN** a product with available regular stock and a sold Cert record
  `PSA-2`
- **WHEN** an authorized inventory admin assigns `PSA-2` with Grade Issuer
  `PSA`, and then a blank Cert ID
- **THEN** Grade10 refuses both, the first naming `PSA-2` and Sold
- **AND** no Cert record is created and no entry is appended

#### Scenario: grade10-admin-inventory-catalog-SC-163 - An assigned unit can be held by its Cert ID

**Serves:** grade10-admin-inventory-catalog-US-15 - the numbered unit can go to a listing

- **GIVEN** a unit of regular stock was given Cert ID `BGS-88`
- **WHEN** Auction reserves `BGS-88`
- **THEN** the hold has quantity one and names that record
- **AND** available regular stock is unchanged

### Requirement: Only an inventory admin who may write inventory changes a Cert ID

Correcting and assigning a Cert ID SHALL need the grant that intake needs. An
inventory admin with read access only SHALL see the rows and the history in
Cert ID details, with no Change Cert ID or Assign Cert ID.

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
