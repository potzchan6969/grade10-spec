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
  - Removing a Cert unit that has moved requires physical withdrawal; the operation removes its Cert record and currently tagged source-media rows while preserving unrelated product media. A Cert record that has only been intaken is reversed instead, and offers no physical withdrawal.

## MODIFIED Requirements

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

### Requirement: The product page and history name each hold's holder

The reservations table's **Reference** SHALL show a reservation's holder label
when it has one, else its holder reference.

Every change history entry on the product page SHALL show:

| Column   | Shows                                                                                                                                                                                                                                           |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| When     | The date and time the entry occurred                                                                                                                                                                                                            |
| Action   | The entry's action; a Cert ID change also shows its Cert ID before and after, as `Cert ID change · <before> → <after>`, with `No Cert ID` as the before of an assignment; an intake reversal reads `Intake reversal`, and `Intake reversal · <Cert ID>` when it removed a Cert record |
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

#### Scenario: grade10-admin-inventory-catalog-SC-174 - The product history shows each intake reversal

**Serves:** grade10-admin-inventory-catalog-US-04 - the admin finds every unit taken out as a mistake beside the other entries

- **GIVEN** a product where two units of regular stock were reversed with
  remarks `Entered by mistake`, and Cert record `PSA-1234` was reversed with
  remarks `Card never arrived`
- **WHEN** an authorized inventory admin opens the product's change history
- **THEN** one entry's Action reads `Intake reversal`, with quantity two, the
  admin as actor, Holder `—` and Remarks `Entered by mistake`
- **AND** another reads `Intake reversal · PSA-1234`, with quantity one and
  Remarks `Card never arrived`
- **AND** neither reads `withdraw` or `intake`

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
available record with no active reservation that has moved: one that is not
unmoved, as `An unmoved Cert record's Cert ID can be corrected` and `An
unmoved Cert record can be removed as never received` define it. An unmoved
record SHALL NOT be physically removed; it leaves by an intake reversal. In
the same Inventory transaction, Grade10 SHALL
decrement stock by one, increment withdrawn by one, remove the Cert record,
and delete source media tagged to that record. Untagged product media and
media tagged to other Cert records SHALL remain unchanged. Cert ID details
SHALL offer Remove physical unit only on an Available Cert record that has
moved and no active hold names.

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

#### Scenario: grade10-admin-inventory-catalog-SC-128 - Operator tags media to one same-product Cert record
**Serves:** grade10-admin-inventory-catalog-US-12 - Operator classifies source media for one copy

- **GIVEN** an untagged source media item and a Cert record with a printed Cert ID owned by the same product
- **WHEN** an authorized Inventory operator tags the media to that record
- **THEN** the tag identifies that immutable Cert record id
- **AND** the source media item remains owned by its product

#### Scenario: grade10-admin-inventory-catalog-SC-129 - Regular stock has no Cert media tag target
**Serves:** grade10-admin-inventory-catalog-US-12 - Operator classifies source media for one copy

- **GIVEN** an untagged source media item for a product with regular inventory stock and no Cert record for that stock
- **WHEN** an operator attempts to tag the media to the regular stock item
- **THEN** Grade10 refuses the tag write
- **AND** the source media remains untagged and shared at product level

#### Scenario: grade10-admin-inventory-catalog-SC-130 - Invalid Cert targets preserve the current media tag
**Serves:** grade10-admin-inventory-catalog-US-12 - Operator classifies source media for one copy

- **GIVEN** a source media item tagged to a valid Cert record
- **WHEN** an operator attempts to retag it to a missing record or a record owned by another product
- **THEN** Grade10 refuses the tag write
- **AND** the current tag and source media remain unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-131 - Operator untags media for product-level sharing
**Serves:** grade10-admin-inventory-catalog-US-12 - Operator classifies source media for one copy

- **GIVEN** a source media item tagged to a Cert record
- **WHEN** an authorized Inventory operator clears its tag
- **THEN** the source media item has no Cert tag and remains shared at product level

#### Scenario: grade10-admin-inventory-catalog-SC-132 - Retagging leaves the original source item untagged
**Serves:** grade10-admin-inventory-catalog-US-12 - Operator classifies source media for one copy

- **GIVEN** a source media item tagged to one Cert record and a second same-product Cert record with a printed Cert ID
- **WHEN** an authorized Inventory operator retags the source item
- **THEN** the existing Cert association is cleared and the source item remains on the product as untagged shared media
- **AND** Grade10 does not automatically transfer that source item to the second record

#### Scenario: grade10-admin-inventory-catalog-SC-133 - Unauthorized source-media tag writes are refused
**Serves:** grade10-admin-inventory-catalog-US-12 - Operator classifies source media for one copy

- **GIVEN** a source media item and an operator without existing Inventory media-management authority
- **WHEN** the operator attempts to change its Cert tag
- **THEN** Grade10 refuses the write under existing Inventory authorization
- **AND** the tag and source media remain unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-134 - Removing an available Cert unit withdraws the unit and its tagged media
**Serves:** grade10-admin-inventory-catalog-US-13 - Operator removes an available copy and its source media

- **GIVEN** an available Cert record that an Admin hold once named and released, with one source media item tagged to it and no active reservation
- **WHEN** an authorized Inventory operator removes the physical unit and its Cert record
- **THEN** stock decreases by one and withdrawn increases by one
- **AND** the inventory ledger remains unchanged
- **AND** the Cert record and its tagged source media are removed
- **AND** untagged product media and media tagged to other Cert records remain unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-135 - A Cert unit that fails a removal guard cannot be removed
**Serves:** grade10-admin-inventory-catalog-US-13 - Operator removes an available copy and its source media

- **GIVEN** a Cert record is not available, has an active reservation, or is unmoved
- **WHEN** an authorized Inventory operator attempts to remove the physical unit
- **THEN** Grade10 refuses the removal
- **AND** the reservation, stock, withdrawn count, Cert record, and tagged source media remain unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-175 - Remove physical unit is offered only on a record that has moved

**Serves:** `grade10-admin-inventory-catalog-US-13`, `grade10-admin-inventory-catalog-US-16` - each Cert record offers one way out

- **GIVEN** a product with unmoved Cert record `PSA-1`, and Cert record
  `PSA-2` that an Admin hold named and released, both Available
- **WHEN** an authorized inventory admin selects each in Cert ID details
- **THEN** `PSA-1` offers `Remove` and no `Remove physical unit`
- **AND** `PSA-2` offers `Remove physical unit` and no `Remove`
- **WHEN** a physical removal of `PSA-1` is sent anyway
- **THEN** Grade10 refuses it, and stock, withdrawn, the record, its media and
  the history are unchanged

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

#### Scenario: grade10-admin-inventory-catalog-SC-176 - A No Cert ID row shows a reduction

**Serves:** grade10-admin-inventory-catalog-US-14 - the admin reads why the regular stock count fell

- **GIVEN** a product that intook four units of regular stock and Cert record
  `PSA-1`, then reversed two units of regular stock and then `PSA-1`
- **WHEN** an authorized inventory admin selects the `No Cert ID` row
- **THEN** the history shows, newest first, the `Intake reversal` of two and
  the `intake`
- **AND** it does not show `Intake reversal · PSA-1`

## ADDED Requirements

### Requirement: Regular stock intaken since its latest move can be reduced

**Move of regular stock** - an entry of the regular stock history, as `Cert ID
details shows each unit's history` lists it, other than an intake, a Cert ID
assignment or an intake reversal: a hold naming no Cert record taken,
resized, released, sold, vaulted or moved to or from another product, and a
sale or withdrawal of available stock naming no Cert record. Nothing done to a
Cert record moves regular stock, a record given its Cert ID from regular stock
included: after its assignment the record is judged on its own.

**Reducible count** - the units of regular stock intaken after the latest
move, or since the first intake where regular stock never moved, less the
units given a Cert ID or reduced after that move, and never more than
available regular stock.

| After the latest move                   | Reducible count                   |
| --------------------------------------- | --------------------------------- |
| An intake                               | Rises by its units with no Cert ID |
| A Cert ID assignment from regular stock | Falls by 1                        |
| A reduction of regular stock            | Falls by its units                |
| A move of regular stock                 | Starts again from 0               |

Example: a product holds 4 units of regular stock and sells 1 from available
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

#### Scenario: grade10-admin-inventory-catalog-SC-180 - A Cert record's moves leave regular stock reducible

**Serves:** grade10-admin-inventory-catalog-US-16 - a sold numbered card does not stop the admin fixing the count

- **GIVEN** a product that intook three units of regular stock and Cert record
  `PSA-1`, gave one unit of regular stock Cert ID `BGS-88`, then sold `PSA-1`
  through an Auction hold and took an Admin hold on `BGS-88`
- **WHEN** an authorized inventory admin reduces regular stock by two units
- **THEN** Grade10 accepts it: stock falls by two and sold is unchanged
- **AND** `No Cert ID` Available reads 0 and the hold on `BGS-88` is unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-181 - A quantity outside one to the reducible count is refused

**Serves:** grade10-admin-inventory-catalog-US-16 - the admin cannot take out more than was intaken since the last move

- **GIVEN** a product that held 3 units of regular stock, sold 1 from
  available stock and then intook 2, so `No Cert ID` Available reads 4 and the
  reducible count is 2
- **WHEN** a reduction of three units, of zero units, and of 1.5 units is sent
- **THEN** Grade10 refuses each
- **AND** stock reads as before and no entry is appended

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

#### Scenario: grade10-admin-inventory-catalog-SC-183 - A removed Cert ID can be intaken again

**Serves:** grade10-admin-inventory-catalog-US-16 - the right card can arrive under the same number

- **GIVEN** Cert record `PSA-1234` was removed as never received on its
  product
- **WHEN** an authorized inventory admin intakes one unit with Cert ID
  `PSA-1234` on that product
- **THEN** Grade10 accepts the intake
- **AND** Cert ID details lists a Cert record `PSA-1234`, Available, whose
  history starts at that intake

#### Scenario: grade10-admin-inventory-catalog-SC-184 - A record numbered from regular stock can be removed

**Serves:** grade10-admin-inventory-catalog-US-16 - a unit numbered and then found never received leaves whole

- **GIVEN** a product that intook three units of regular stock and gave one
  Cert ID `BGS-88`, and nothing has moved
- **WHEN** an authorized inventory admin removes `BGS-88`
- **THEN** `BGS-88` is no longer listed and stock reads two
- **AND** `No Cert ID` Available still reads 2

#### Scenario: grade10-admin-inventory-catalog-SC-185 - A Cert record that has moved is not reversed

**Serves:** grade10-admin-inventory-catalog-US-16 - a card once handled stays in the ledger

- **GIVEN** Cert record `PSA-1`, whose Auction hold was released so it reads
  Available, and Cert record `PSA-2`, sold
- **WHEN** an authorized inventory admin selects each in Cert ID details
- **THEN** neither offers `Remove`
- **WHEN** a removal of either as never received is sent anyway
- **THEN** Grade10 refuses it, and no record, count, media or entry changes

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

#### Scenario: grade10-admin-inventory-catalog-SC-189 - Empty remarks cannot be confirmed

**Serves:** grade10-admin-inventory-catalog-US-16 - every unit taken out says why

- **GIVEN** the confirmation is open on an unmoved Cert record `PSA-1`
- **WHEN** an authorized inventory admin clears the remarks, leaving three
  spaces
- **THEN** Confirm is unavailable
- **WHEN** a removal of `PSA-1` with blank remarks is sent anyway
- **THEN** Grade10 refuses it, and `PSA-1` is still listed with no entry
  appended

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

#### Scenario: grade10-admin-inventory-catalog-SC-191 - A hold taken first refuses the removal

**Serves:** Cert ID details - a hold and a removal on one card never both land

- **GIVEN** Cert record `PSA-1` is unmoved and an inventory admin has the
  confirmation open on it
- **WHEN** Auction reserves `PSA-1`, and then the admin confirms
- **THEN** Grade10 refuses the removal
- **AND** the hold names `PSA-1`, stock is unchanged and no `intake-reversal`
  entry is appended

#### Scenario: grade10-admin-inventory-catalog-SC-192 - A hold on regular stock taken first refuses the reduction

**Serves:** Cert ID details - a hold and a reduction on regular stock never both land

- **GIVEN** regular stock that has never moved reads `No Cert ID` Available 3
  and an inventory admin has the confirmation open for two units
- **WHEN** an Admin hold takes one unit of regular stock, and then the admin
  confirms
- **THEN** Grade10 refuses the reduction, since the hold is a move after every
  intake and the reducible count is 0
- **AND** stock is unchanged and no `intake-reversal` entry is appended

#### Scenario: grade10-admin-inventory-catalog-SC-193 - Two reductions at once take only what is there

**Serves:** Cert ID details - two admins fixing one count never take out more than was intaken

- **GIVEN** regular stock that has never moved reads `No Cert ID` Available 3
- **WHEN** two inventory admins each reduce it by two at the same moment
- **THEN** exactly one reduction lands, `No Cert ID` Available reads 1, and
  one `intake-reversal` entry is appended
- **AND** the other is refused
