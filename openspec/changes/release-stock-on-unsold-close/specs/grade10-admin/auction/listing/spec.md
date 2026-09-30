# grade10-admin/auction/listing Specification

## Purpose
Lets an authorized Grade10 operator draft, create, and publish an Auction
listing — incomplete saves first, required fields enforced at create, publish
now or at a future scheduled time — with an ordered gallery of one to eight
images or videos (originals stored and served as uploaded), call one off
while it has not closed, and get a lot's stock back, with a one-step Relist, when
its listing closes with no winner. Named image sizes and optional alt live in
`grade10-site/auction/listing-media`.

## Feature set

- Draft save
  - Incomplete listing: an authorized operator saves without filling every field
  - First save mints a unit: the first draft creates an auctionable unit with no other live listing
- Create and catalogue
  - Required fields at create: title, slug, starting price, window, and media are checked on the form and the API
  - Slug as public key: collectors open a listing by slug; collisions and reuse follow the listing's state
  - Catalogue fields: an operator may write copy and taxonomy before publish
- Prices and window
  - Writable before publish: starting price, close, extension duration, and cap can change until the listing is live
- Publish
  - Now or scheduled: a created listing publishes immediately or at a set time
- Call off
  - Before close: an operator withdraws a listing that has not closed
  - Closed is frozen: a closed listing cannot be rewritten here
- Gallery
  - One to eight uploads: images or videos, stored as uploaded, ordered, first item as the catalogue card
- Independent create
  - Listings create: an authorized operator starts a listing from the
    Listings section with no campaign selected
  - Empty campaign through lifecycle: draft, create, and publish all succeed
    with no campaign; public slug lookup returns the listing
  - Listings table unattached label: a row with no campaign shows "-"
- Test fixture standalone seed
  - Listings tab: a developer selects fixture ids and seeds them with no
    campaign, product reserved, media attached
  - Drop standalone fixtures: a developer removes standalone fixture listings
    and releases their inventory holds from the same tab
- Inventory unit
  - Explicit choice: product selection is paired with a Cert ID or `No Cert ID`
  - Unit hold: a selected Cert ID is held as one physical unit
- Listing lifecycle
  - Draft save: validates and preserves the selected unit
  - Create: requires the saved unit choice and matching inventory hold
- Product display
  - Selected identity: public fields resolve through Inventory
  - Unnumbered stock: `No Cert ID` displays no certificate row
- Listings Stats
  - Watchers in Stats: opening Stats shows how many collectors watch the lot, so an operator judges interest beside the bidder count
  - No table column: the Listings table does not show the watch count
- Unsold close
  - Stock released: a listing that closes with no winner releases its inventory hold at the close, with no operator step
  - Released note: an Unsold listing says its stock was released, and when
  - Relist: an Unsold listing opens a new draft with the same product, quantity and catalogue copy
  - Earlier holds freed: holds left by earlier Unsold closes are released once

## ADDED Requirements

### Requirement: An Unsold close releases the listing's inventory hold

When a listing closes with no winner, Grade10 SHALL release the listing's whole remaining
inventory hold at that close and SHALL NOT wait for an operator.

- A failed release SHALL be retried until it succeeds and SHALL NOT delay or
  reverse the close.
- A listing that closes with a winner SHALL NOT release under this rule; its
  hold moves to sold as before.

#### Scenario: grade10-admin-auction-listing-SC-130 - A close with no bids releases the hold
**Serves:** grade10-admin-auction-listing-US-09 - the operator finds the stock back without a step

- **GIVEN** a published listing of a created product with an active hold of
  three units, and no bids
- **WHEN** the listing closes
- **THEN** the listing is Unsold and its hold is released in full
- **AND** the product's available rises by three

#### Scenario: grade10-admin-auction-listing-SC-132 - A close with a winner keeps its hold for the sale
**Serves:** Unsold close - a sold listing's hold is settled by the sale, not released

- **GIVEN** a published listing with an active hold of one unit and a top bid
- **WHEN** the listing closes
- **THEN** no release is written for the hold
- **AND** the hold stays active until the sale moves it to sold

#### Scenario: grade10-admin-auction-listing-SC-133 - A failed release is retried and the close stands
**Serves:** Unsold close - the close never waits on the inventory release

- **GIVEN** a published listing with an active hold whose release fails at the
  close
- **WHEN** the listing closes
- **THEN** the listing is Unsold at its close time
- **AND** the release is retried until it succeeds, and then the reservation is
  closed once

### Requirement: An Unsold listing says its stock was released

The admin page of a listing that closed with no winner SHALL show that its stock
was released, with the date and time of the release, once the release has
completed.

#### Scenario: grade10-admin-auction-listing-SC-134 - An Unsold listing shows the release date
**Serves:** grade10-admin-auction-listing-US-09 - the operator sees the stock is back

- **GIVEN** a listing that closed Unsold and whose hold was released
- **WHEN** an operator opens the listing
- **THEN** it says the stock was released, with the release date and time

### Requirement: Relist opens a new draft from an Unsold listing

An Unsold listing SHALL offer **Relist** to an operator who holds the
`auction:operate` grant, and to nobody else. No other listing SHALL offer it.

1. Relist SHALL open the listing editor filled in with the Unsold listing's
   product, quantity, Cert ID choice, title, copy, price, currency and gallery.
2. The editor SHALL start with no slug, listing code or window.
3. Nothing SHALL be stored until the operator saves.
4. Saving is an ordinary draft save.

The gallery SHALL be copied into the new listing, so later edits to either
gallery do not change the other.

#### Scenario: grade10-admin-auction-listing-SC-135 - Relist opens the editor with the lot filled in
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing with a product, a Cert ID choice, quantity three,
  a title, copy, a price, a currency and a two-item gallery
- **WHEN** an operator holding `auction:operate` activates Relist
- **THEN** the editor shows the same product, Cert ID choice, quantity, title,
  copy, price, currency and both gallery items
- **AND** it has no window, slug or listing code yet

#### Scenario: grade10-admin-auction-listing-SC-136 - Relist stores nothing until Save
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** the editor opened by Relist on a listing of a product with
  available five and quantity three
- **WHEN** the operator leaves without saving
- **THEN** no listing is stored and available is unchanged
- **AND** when the operator instead saves, a new draft holds three units and
  available falls by three

#### Scenario: grade10-admin-auction-listing-SC-137 - Relist is offered on an Unsold listing only
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing whose hold was released, a listing with a winner,
  a live listing and a called-off listing
- **WHEN** an operator holding `auction:operate` opens each
- **THEN** only the Unsold listing offers Relist and says its stock was released

#### Scenario: grade10-admin-auction-listing-SC-138 - An operator without the grant is not offered Relist
**Serves:** grade10-admin-auction-listing-US-09 - only an operator who can operate auctions relists

- **GIVEN** an Unsold listing and an operator without `auction:operate`
- **WHEN** they open the listing
- **THEN** Relist is not shown

### Requirement: Holds left by earlier Unsold closes are released once

Grade10 SHALL provide one release that frees every active hold whose listing
closed with no winner before this rule shipped. Each such reservation SHALL
close as released, and the listing SHALL show the release note dated by the
release. A hold of a listing with a winner, of a live listing, of a called-off
listing, or already released SHALL be left as it is. Running it again SHALL
change nothing.

#### Scenario: grade10-admin-auction-listing-SC-139 - The clean-up frees each stuck hold
**Serves:** Unsold close - stock held by earlier Unsold closes is freed

- **GIVEN** two listings that closed Unsold earlier and still hold five and one
  units, a live listing holding two, and a listing with a winner holding one
- **WHEN** the one-off release runs
- **THEN** the two Unsold holds are closed as released and available rises by
  five and one
- **AND** the live listing's and the winner's holds are unchanged

#### Scenario: grade10-admin-auction-listing-SC-140 - Running the clean-up again changes nothing
**Serves:** Unsold close - the clean-up is safe to run twice

- **GIVEN** the one-off release has already run
- **WHEN** it runs again
- **THEN** no reservation, count or history entry changes
