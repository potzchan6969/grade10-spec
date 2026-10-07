# grade10-admin/auction/listing Specification

## Feature set

- Bought-in listings
  - Bought in label: the Listings table reads Bought in for a lot the house won
  - Relist: a bought-in lot offers Relist, and the new draft carries no internal bid

## MODIFIED Requirements

### Requirement: An Unsold close releases the listing's inventory hold

When a listing closes with no winner, or closes bought in under
`grade10-site/auction/auction`, Grade10 SHALL release the listing's whole
remaining inventory hold at that close and SHALL NOT wait for an operator.

- A failed release SHALL be retried until it succeeds and SHALL NOT delay or
  reverse the close.
- A listing that closes with a winner other than the house SHALL NOT release
  under this rule; its hold moves to sold as before.

<!-- trace:scenario id=g10adm.auction-listing.SC-t6r rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-130 - A close with no bids releases the hold
**Serves:** grade10-admin-auction-listing-US-09 - the operator finds the stock back without a step

- **GIVEN** a published listing of a created product with an active hold of
  three units, and no bids
- **WHEN** the listing closes
- **THEN** the listing is Unsold and its hold is released in full
- **AND** the product's available rises by three

<!-- trace:scenario id=g10adm.auction-listing.SC-pii rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-132 - A close with a winner keeps its hold for the sale
**Serves:** Unsold close - a sold listing's hold is settled by the sale, not released

- **GIVEN** a published listing with an active hold of one unit and a
  collector's top bid
- **WHEN** the listing closes
- **THEN** no release is written for the hold
- **AND** the hold stays active until the sale moves it to sold

<!-- trace:scenario id=g10adm.auction-listing.SC-5fx rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-133 - A failed release is retried and the close stands
**Serves:** Unsold close - the close never waits on the inventory release

- **GIVEN** a published listing with an active hold whose release fails at the
  close
- **WHEN** the listing closes
- **THEN** the listing is Unsold at its close time
- **AND** the release is retried until it succeeds, and then the reservation is
  closed once

<!-- trace:scenario id=g10adm.auction-listing.SC-5vh rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-146 - A close with only outbid bids releases the hold
**Serves:** grade10-admin-auction-listing-US-09 - the operator finds the stock back without a step

- **GIVEN** a published listing with an active hold of two units whose bids
  are all `outbid`, its top bid demoted before the close
- **WHEN** the listing closes
- **THEN** the listing is Unsold and its hold is released in full
- **AND** the product's available rises by two

### Requirement: An Unsold listing says its stock was released

The admin page of a listing that closed with no winner, or closed bought in,
SHALL show that its stock was released, with the date and time of the release,
once the release has completed.

<!-- trace:scenario id=g10adm.auction-listing.SC-le0 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-134 - An Unsold listing shows the release date
**Serves:** grade10-admin-auction-listing-US-09 - the operator sees the stock is back

- **GIVEN** a listing that closed Unsold and whose hold was released
- **WHEN** an operator opens the listing
- **THEN** it says the stock was released, with the release date and time

### Requirement: Relist opens a new draft from an Unsold listing

The Listings table row of an Unsold or a Bought in listing SHALL offer
**Relist** when every condition holds, and SHALL NOT show it otherwise; no
other row SHALL offer it:

| Condition | Rule |
| --- | --- |
| Stock | The listing's stock release has completed |
| Campaign | The listing sits in no campaign |
| Relisted | No listing has yet been saved from this listing's Relist |
| Operator | Holds the `auction:operate` grant |

1. Relist SHALL open the listing editor filled in with the source listing's
   product, quantity, Cert ID choice, title, copy, starting price, currency and
   gallery.
2. The editor SHALL start with no slug, listing code, window or internal bid;
   every other field SHALL start as on any new draft.
3. Nothing SHALL be stored and no stock SHALL be held until the operator saves.
   Relist activated again SHALL open another unsaved editor.
4. Save SHALL be an ordinary draft save that records which listing it was
   relisted from, and the source listing SHALL NOT change. The new draft SHALL
   carry no internal bid until an admin sets one under
   `grade10-admin/auction/internal-bid`.

The gallery SHALL be copied into the new listing, so later edits to either
gallery do not change the other.

Save SHALL be refused, storing nothing and holding no stock, when the source
listing:

| Refused when the source | Refusal |
| --- | --- |
| Does not exist | Listing not found |
| Did not close with no winner and did not close bought in | Not Unsold or Bought in |
| Sits in a campaign | In a campaign |
| Has no completed stock release | Stock not released |
| Already has a listing saved from its Relist | Already relisted |

The editor SHALL show the refusal's name inline.

Every refusal of an ordinary draft save, such as available stock below the
quantity, SHALL apply as well.

<!-- trace:scenario id=g10adm.auction-listing.SC-4ez rev=1 -->
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

<!-- trace:scenario id=g10adm.auction-listing.SC-lc6 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-136 - Relist stores nothing until Save
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** the editor opened by Relist on a listing of a product with
  available five and quantity three
- **WHEN** the operator leaves without saving
- **THEN** no listing is stored and available is unchanged
- **AND** when the operator instead saves, a new draft holds three units,
  available falls by three and the Unsold listing is unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-z9c rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-137 - Relist shows on the row of a released Unsold listing only
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** listings in no campaign: an Unsold listing whose stock was
  released, a listing with a winner, a live listing and a called-off listing
- **WHEN** an operator holding `auction:operate` opens the Listings table
- **THEN** only the Unsold listing's row offers Relist

<!-- trace:scenario id=g10adm.auction-listing.SC-j1h rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-138 - An operator without the grant is not offered Relist
**Serves:** grade10-admin-auction-listing-US-09 - only an operator who can operate auctions relists

- **GIVEN** an Unsold listing in no campaign whose stock was released, and an
  operator without `auction:operate`
- **WHEN** they open the Listings table
- **THEN** the listing's row shows no Relist

<!-- trace:scenario id=g10adm.auction-listing.SC-suv rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-141 - Relist waits for the stock release
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing in no campaign whose stock release has not yet
  completed
- **WHEN** an operator holding `auction:operate` opens the Listings table
- **THEN** the listing's row shows no Relist
- **AND** once the release completes, the row offers Relist

<!-- trace:scenario id=g10adm.auction-listing.SC-lqj rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-142 - A listing in a campaign offers no Relist
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing in a campaign whose stock was released
- **WHEN** an operator holding `auction:operate` opens the Listings table
- **THEN** the listing's row shows no Relist

<!-- trace:scenario id=g10adm.auction-listing.SC-nq1 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-143 - Relist is hidden once the listing is relisted
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing whose Relist editor was saved as a new draft
- **WHEN** an operator holding `auction:operate` opens the Listings table
- **THEN** the Unsold listing's row shows no Relist

<!-- trace:scenario id=g10adm.auction-listing.SC-2m4 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-144 - Only the first of two Relist editors saves
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** two editors opened by Relist on the same Unsold listing, of a
  product with available five and quantity three
- **WHEN** the operator saves the first and then the second
- **THEN** the first stores a draft holding three units
- **AND** the second is refused as already relisted, stores nothing and
  available stays two

<!-- trace:scenario id=g10adm.auction-listing.SC-9uj rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-145 - Save refuses a source that cannot be relisted
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** a listing with a winner, an Unsold listing in a campaign, and an
  Unsold listing whose stock release has not completed
- **WHEN** a relist save names each as its source
- **THEN** each is refused, as not Unsold or Bought in, in a campaign and
  stock not released in turn
- **AND** no listing is stored and available is unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-02v rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-147 - A bought-in close releases the hold
**Serves:** grade10-admin-auction-listing-US-09 - the house bought the lot in and the stock comes back

- **GIVEN** a published listing of a created product with an active hold of
  one unit, where the house leads
- **WHEN** the listing closes
- **THEN** the listing is Bought in and its hold is released in full
- **AND** the product's available rises by one

<!-- trace:scenario id=g10adm.auction-listing.SC-khm rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-148 - Relist from a bought-in listing carries no internal bid
**Serves:** grade10-admin-auction-listing-US-09 - a lot the house bought in goes back on sale

- **GIVEN** a Bought in listing in no campaign whose stock was released, and
  whose internal bid was Placed at 50000 HKD minor units
- **WHEN** an admin holding `auction:operate` and `auction:reserve` activates
  Relist on its row and saves the new draft
- **THEN** the new draft has no internal bid
- **AND** the Bought in listing still reads Bought in

## ADDED Requirements

### Requirement: The Listings table reads Bought in

A listing that closed bought in under `grade10-site/auction/auction` SHALL
read **Bought in** in the Listings table, under its Closed status, where an
Unsold listing reads Unsold. It SHALL NOT read Unsold and SHALL NOT be
counted in the Unsold view, and it SHALL NOT be counted in the Won view or
offer an order to open. Every operator who can read the Listings table SHALL
see the label once the listing has closed; before its close, no row SHALL say
that the house leads or that the listing has an internal bid.

<!-- trace:scenario id=g10adm.auction-listing.SC-qgd rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-149 - A lot the house won reads Bought in
**Serves:** grade10-admin-auction-listing-US-09 - the operator finds a bought-in lot on the table

- **GIVEN** three closed listings: one with a collector winner, one with no
  bids, and one the house won
- **WHEN** an operator opens the Listings table
- **THEN** the house's listing reads Closed and Bought in, with no order to
  open
- **AND** the listing with no bids reads Unsold, and the collector's listing
  opens its order

<!-- trace:scenario id=g10adm.auction-listing.SC-x1a rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-150 - A bought-in lot is in neither the Won nor the Unsold view
**Serves:** grade10-admin-auction-listing-US-09 - the operator filters the table by outcome

- **GIVEN** the listings of `grade10-admin-auction-listing-SC-149`
- **WHEN** an operator filters the Listings table to Unsold, and then to Won
- **THEN** the house's listing is in neither

<!-- trace:scenario id=g10adm.auction-listing.SC-cvx rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-151 - A protected lot reads as any live lot before its close
**Serves:** Bought-in listings - a live lot the house leads shows no sign of it before its close

- **GIVEN** a published listing still taking bids, where the house leads
- **AND** an operator whose roles are exactly `staff`
- **WHEN** they open the Listings table
- **THEN** its row reads as any published listing with a leading bid
- **AND** nothing on the row says Bought in, the house or an internal bid
