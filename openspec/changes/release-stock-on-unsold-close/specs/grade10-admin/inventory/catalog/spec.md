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
- Unsold auction stock
  - Released hold: the hold of a listing that closed with no winner reads closed and released on the product page, and available rises by its units
  - Named in history: the history entry says the Unsold close, or the clean-up of an earlier one, released it

## MODIFIED Requirements

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
| Reason | Required for withdraw; optional remarks for intake; `unsold close` or `unsold clean-up` on a release Auction makes for a listing that closed with no winner; null otherwise |
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

#### Scenario: grade10-admin-inventory-catalog-SC-136 - An Unsold release names its reason and listing
**Serves:** grade10-admin-inventory-catalog-US-09 - the admin sees why the stock came back

- **GIVEN** Auction holds an active reservation of two for a listing that
  closes with no winner
- **WHEN** Auction releases it at the close
- **THEN** one `release` change records quantity two, the reservation id and
  the reason `unsold close`
- **AND** its reservation snapshot names the listing

#### Scenario: grade10-admin-inventory-catalog-SC-137 - The clean-up release reads differently from the close
**Serves:** grade10-admin-inventory-catalog-US-09 - the admin sees why the stock came back

- **GIVEN** Auction holds an active reservation of five for a listing that
  closed with no winner before the release shipped
- **WHEN** the one-off release frees it
- **THEN** one `release` change records quantity five and the reason
  `unsold clean-up`

#### Scenario: grade10-admin-inventory-catalog-SC-138 - A call-off release keeps no reason
**Serves:** grade10-admin-inventory-catalog-US-04 - Reconstruct stock changes

- **GIVEN** Auction holds an active reservation of two for a listing an
  operator calls off before its close
- **WHEN** Auction releases it
- **THEN** one `release` change records quantity two and no reason

## ADDED Requirements

### Requirement: The product page shows an Unsold hold as released

The product page's reservations table SHALL keep an Auction hold released for a
listing that closed with no winner, showing it as closed with its released
quantity and naming the listing by title and listing code. Available SHALL
include its units. Other holds SHALL be unchanged.

#### Scenario: grade10-admin-inventory-catalog-SC-139 - The product page shows the hold released
**Serves:** grade10-admin-inventory-catalog-US-09 - the admin sees unsold stock come back

- **GIVEN** a created product with stock ten, an Auction hold of four for a
  listing that has just closed with no winner, and an active Vault hold of one
- **WHEN** an authorized inventory admin opens the product page
- **THEN** available reads nine and reserved reads one
- **AND** the Auction hold reads closed with released four and names the
  listing by title and listing code
- **AND** the Vault hold is still active
