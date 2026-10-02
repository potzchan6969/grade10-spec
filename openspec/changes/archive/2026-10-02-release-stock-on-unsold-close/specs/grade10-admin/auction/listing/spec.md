# grade10-admin/auction/listing Specification

## Purpose
Lets an authorized Grade10 operator draft, create, and publish an Auction
listing — incomplete saves first, required fields enforced at create, publish
now or at a future scheduled time — with an ordered gallery of one to eight
images or videos from product assets or direct uploads, frozen when saved,
call one off while it has not closed, and get a lot's stock back, with a
one-step Relist, when its listing closes with no winner. Named image sizes and
optional alt live in `grade10-site/auction/listing-media`.

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
  - Relist: an Unsold listing's row in the Listings table opens a new draft with the same product, quantity and catalogue copy, once its stock is released, outside a campaign and once per listing
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

#### Scenario: grade10-admin-auction-listing-SC-146 - A close with only outbid bids releases the hold
**Serves:** grade10-admin-auction-listing-US-09 - the operator finds the stock back without a step

- **GIVEN** a published listing with an active hold of two units whose bids
  are all `outbid`, its top bid demoted before the close
- **WHEN** the listing closes
- **THEN** the listing is Unsold and its hold is released in full
- **AND** the product's available rises by two

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

The Listings table row of an Unsold listing SHALL offer **Relist** when every
condition holds, and SHALL NOT show it otherwise; no other row SHALL offer it:

| Condition | Rule |
| --- | --- |
| Stock | The listing's stock release has completed |
| Campaign | The listing sits in no campaign |
| Relisted | No listing has yet been saved from this listing's Relist |
| Operator | Holds the `auction:operate` grant |

1. Relist SHALL open the listing editor filled in with the Unsold listing's
   product, quantity, Cert ID choice, title, copy, starting price, currency and
   gallery.
2. The editor SHALL start with no slug, listing code or window; every other
   field SHALL start as on any new draft.
3. Nothing SHALL be stored and no stock SHALL be held until the operator saves.
   Relist activated again SHALL open another unsaved editor.
4. Save SHALL be an ordinary draft save that records which listing it was
   relisted from, and the Unsold listing SHALL NOT change.

The gallery SHALL be copied into the new listing, so later edits to either
gallery do not change the other.

Save SHALL be refused, storing nothing and holding no stock, when the source
listing:

| Refused when the source | Refusal |
| --- | --- |
| Does not exist | Listing not found |
| Did not close with no winner | Not Unsold |
| Sits in a campaign | In a campaign |
| Has no completed stock release | Stock not released |
| Already has a listing saved from its Relist | Already relisted |

The editor SHALL show the refusal's name inline.

Every refusal of an ordinary draft save, such as available stock below the
quantity, SHALL apply as well.

#### Scenario: grade10-admin-auction-listing-SC-135 - Relist opens the editor with the lot filled in
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing in no campaign whose stock was released, with a
  product, a Cert ID choice, quantity three, a title, copy, a starting price, a
  currency and a two-item gallery
- **WHEN** an operator holding `auction:operate` activates Relist on its row in
  the Listings table
- **THEN** the editor shows the same product, Cert ID choice, quantity, title,
  copy, starting price, currency and both gallery items
- **AND** it has no window, slug or listing code yet

#### Scenario: grade10-admin-auction-listing-SC-136 - Relist stores nothing until Save
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** the editor opened by Relist on a listing of a product with
  available five and quantity three
- **WHEN** the operator leaves without saving
- **THEN** no listing is stored and available is unchanged
- **AND** when the operator instead saves, a new draft holds three units,
  available falls by three and the Unsold listing is unchanged

#### Scenario: grade10-admin-auction-listing-SC-137 - Relist shows on the row of a released Unsold listing only
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** listings in no campaign: an Unsold listing whose stock was
  released, a listing with a winner, a live listing and a called-off listing
- **WHEN** an operator holding `auction:operate` opens the Listings table
- **THEN** only the Unsold listing's row offers Relist

#### Scenario: grade10-admin-auction-listing-SC-138 - An operator without the grant is not offered Relist
**Serves:** grade10-admin-auction-listing-US-09 - only an operator who can operate auctions relists

- **GIVEN** an Unsold listing in no campaign whose stock was released, and an
  operator without `auction:operate`
- **WHEN** they open the Listings table
- **THEN** the listing's row shows no Relist

#### Scenario: grade10-admin-auction-listing-SC-141 - Relist waits for the stock release
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing in no campaign whose stock release has not yet
  completed
- **WHEN** an operator holding `auction:operate` opens the Listings table
- **THEN** the listing's row shows no Relist
- **AND** once the release completes, the row offers Relist

#### Scenario: grade10-admin-auction-listing-SC-142 - A listing in a campaign offers no Relist
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing in a campaign whose stock was released
- **WHEN** an operator holding `auction:operate` opens the Listings table
- **THEN** the listing's row shows no Relist

#### Scenario: grade10-admin-auction-listing-SC-143 - Relist is hidden once the listing is relisted
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing whose Relist editor was saved as a new draft
- **WHEN** an operator holding `auction:operate` opens the Listings table
- **THEN** the Unsold listing's row shows no Relist

#### Scenario: grade10-admin-auction-listing-SC-144 - Only the first of two Relist editors saves
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** two editors opened by Relist on the same Unsold listing, of a
  product with available five and quantity three
- **WHEN** the operator saves the first and then the second
- **THEN** the first stores a draft holding three units
- **AND** the second is refused as already relisted, stores nothing and
  available stays two

#### Scenario: grade10-admin-auction-listing-SC-145 - Save refuses a source that cannot be relisted
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** a listing with a winner, an Unsold listing in a campaign, and an
  Unsold listing whose stock release has not completed
- **WHEN** a relist save names each as its source
- **THEN** each is refused, as not Unsold, in a campaign and stock not released
  in turn
- **AND** no listing is stored and available is unchanged

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
