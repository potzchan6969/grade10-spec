# grade10-site/analytics/analytics Specification

## Feature set

- Events
  - Client names: the browser may send only those
  - Server names: a browser cannot submit them
  - Store funnel: page, product, add, cart, checkout, paid order
  - Auction funnel: lot view, card, bid, watch, outbid, win, invoice paid
  - Loyalty facts: points on the paid order, reward redeemed, pass added, till identified
  - Vault conversion: submitted, visit booked, offer, payout, identity bound
  - First-touch campaign: UTM on Page Viewed and Lot Viewed when present; Initial Referrer on the first Page Viewed for a device

## RENAMED Requirements

- FROM: `### Requirement: The browser may send client event names only`
- TO: `### Requirement: The browser sends client event names only`

### Requirement: The browser sends client event names only

Grade10 SHALL hold one Mixpanel catalog for the Grade10 site. Event
names and property keys SHALL be Title Case. Money SHALL be an integer
count of minor units plus an ISO 4217 code. The browser SHALL be able to
submit only the client names in the catalog. Ingest SHALL reject a
server name from the browser.

Client events:

| Event          | Fires when                                                                           | Properties                                                                                                                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page Viewed    | The collector's address on the site becomes current, including an in-page navigation | Page (the surface, 1–200 characters, without listing-filter query); optional Locale (`en` \| `zh-Hant` \| `zh-Hans`); optional UTM Source, UTM Medium, UTM Campaign, UTM Content when the address carried those query keys; optional Initial Referrer on the first Page Viewed for that device when the document had a referrer |
| Product Viewed | The collector opens a product page                                                   | Product; optional Variant; Source (`Row` \| `Listing` \| `Search` \| `Direct`)                                                                                                                                             |
| Product Added  | The collector's first successful add of that product this session                    | Product; optional Variant; Quantity; Currency; Value Minor; Source (`Listing` \| `Page`)                                                                                                                                   |
| Cart Opened    | The collector opens the cart                                                         | Item Count; optional Currency; optional Value Minor                                                                                                                                                                        |
| Lot Viewed     | The collector opens a lot page                                                       | Listing ID; Lot Status (`upcoming` \| `live` \| `ended` \| `called_off`); optional Campaign ID; optional UTM Source, UTM Medium, UTM Campaign, UTM Content when the address carried those query keys                      |

Server events:

| Event                 | Fires when                                                            | Properties                                                                                                                                                                                                                                                    |
| --------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Checkout Started      | The store accepts a checkout                                          | Order ID; Currency; Value Minor; the checkout browser's `$device_id` when known                                                                                                                                                                              |
| Order Paid            | A paid order lands, online or at the till                             | Order ID; Currency; Origin (`web` \| `pos`); Value Minor; Charged Minor; Item Count; Member (boolean); optional Tier (`Silver` \| `Gold` \| `Black`); Points Earned; Points Spent; optional Reward Coupon (boolean); optional Session ID when Origin is `pos` |
| Card Linked           | A collector links a card to bid                                       | Listing ID; First Card (boolean)                                                                                                                                                                                                                              |
| Bid Placed            | A collector's maximum is accepted                                     | Listing ID; Bid ID; Currency; Maximum Minor; Amount Minor; Leading (boolean); Commit (`first` \| `raise`)                                                                                                                                                     |
| Lot Watched           | A collector watches a lot                                             | Listing ID; Lot Status                                                                                                                                                                                                                                        |
| Bidder Outbid         | That collector stops leading                                          | Listing ID; Currency; Amount Minor                                                                                                                                                                                                                            |
| Auction Won           | A listing closes with this collector as winner and an order is issued | Listing ID; Order ID; Currency; Amount Minor                                                                                                                                                                                                                  |
| Invoice Paid          | The winner's invoice is paid                                          | Order ID; Listing ID; Currency; Value Minor; Charged Minor; Method (`stripe` \| `manual`)                                                                                                                                                                     |
| Pass Added            | A member card is issued to a wallet                                   | Wallet (`Google` \| `Apple`); Tier                                                                                                                                                                                                                            |
| Reward Redeemed       | A member buys a reward with points                                    | Reward ID; Reward (1–200 characters); Points; Quantity; Channel (`Online` \| `In Store`); Balance After                                                                                                                                                       |
| Member Identified     | A till identification succeeds                                        | Provenance (`QR` \| `Code` \| `Pass` \| `Email` \| `Phone` \| `Cart`); optional Wallet (`Google` \| `Apple`); Shop; Session ID; Can Spend (boolean)                                                                                                           |
| Vault Case Submitted  | A collector submits a case                                            | Case ID; Lane (`storage` \| `financed`); Category (`trading_card` \| `coin` \| `bullion` \| `watch` \| `jewellery` \| `other`); optional Currency; optional Amount Requested Minor                                                                            |
| Vault Visit Booked    | A vault visit is booked                                               | Case ID; Lane; Visit Kind (`intake` \| `pickup`); Location ID; Actor (`collector` \| `staff`)                                                                                                                                                                 |
| Vault Offer Made      | Staff make an offer, including a counter-offer                        | Case ID; Lane; Offer ID; Currency; Principal Minor; Term Days                                                                                                                                                                                                 |
| Vault Offer Accepted  | The offer is accepted                                                 | Case ID; Lane; Offer ID; Actor (`collector` \| `staff`)                                                                                                                                                                                                       |
| Vault Offer Declined  | The offer is declined and the case stays open                         | Case ID; Lane; Offer ID; Actor (`collector` \| `staff`)                                                                                                                                                                                                       |
| Vault Payout Recorded | The treasurer records the payout                                      | Case ID; Lane; Offer ID; Currency; Principal Minor                                                                                                                                                                                                            |
| Identity Bound        | A case gains a verified identity                                      | Case ID; Method (`hosted` \| `counter` \| `reuse`); Standing After (`verified`)                                                                                                                                                                               |
| Account Created       | The store first knows a user id                                       | (none)                                                                                                                                                                                                                                                        |

A replayed webhook or reconcile pass SHALL record Order Paid once per
order. Bid Placed SHALL derive its identity from the accepted bid so a
retry counts once. Invoice Paid SHALL fire when the invoice is paid.
Lot Watched SHALL fire on an explicit
watch, not because a bid was placed. Vault Payout Recorded SHALL NOT
replace the vault ledger as the count of financed cases.

A property with no applicable value SHALL be omitted, never sent empty
or null. A server event that mirrors a domain write SHALL carry that
write's time and a stable insert id derived from the domain key. WHEN
a server event continues a browser or till visit and Grade10 still holds
that visit's device id, the event SHALL name that `$device_id`. WHEN
Order Paid Origin is `web` and checkout started from a device, Order
Paid SHALL still name that device and SHALL NOT drop it.

#### Scenario: grade10-site-analytics-SC-10 - The browser cannot submit Order Paid

**Serves:** Events - the browser cannot submit Order Paid
- **WHEN** the browser submits an event named Order Paid
- **THEN** ingest rejects it

#### Scenario: grade10-site-analytics-SC-11 - The browser cannot submit Bid Placed

**Serves:** Events - the browser cannot submit Bid Placed
- **WHEN** the browser submits an event named Bid Placed
- **THEN** ingest rejects it

#### Scenario: grade10-site-analytics-SC-12 - Page Viewed fires on in-page navigation

**Serves:** Events - Page Viewed fires on in-page navigation
- **GIVEN** a collector already on the Grade10 site
- **WHEN** they open another page without a full document load
- **THEN** Mixpanel records Page Viewed for that surface

#### Scenario: grade10-site-analytics-SC-35 - Page Viewed carries UTM from the landing

**Serves:** Events - Page Viewed carries UTM from the landing
- **GIVEN** a collector opens a page whose address carries UTM query keys
- **WHEN** Mixpanel records Page Viewed
- **THEN** the event includes those UTM Source, UTM Medium, UTM Campaign, and UTM Content values that were present

#### Scenario: grade10-site-analytics-SC-44 - First Page Viewed may carry Initial Referrer

**Serves:** Events - the first Page Viewed may carry Initial Referrer
- **GIVEN** a device whose first Page Viewed is for a document that had a referrer
- **WHEN** Mixpanel records that Page Viewed
- **THEN** the event includes Initial Referrer

#### Scenario: grade10-site-analytics-SC-45 - Lot Viewed carries UTM from the landing

**Serves:** Events - Lot Viewed carries UTM from the landing
- **GIVEN** a collector opens a lot whose address carries UTM query keys
- **WHEN** Mixpanel records Lot Viewed
- **THEN** the event includes those UTM Source, UTM Medium, UTM Campaign, and UTM Content values that were present

#### Scenario: grade10-site-analytics-SC-13 - Product Viewed names the source

**Serves:** Events - Product Viewed names the merchandising source
- **WHEN** a collector opens a product from the merchandised row
- **THEN** Mixpanel records Product Viewed with Source `Row`

#### Scenario: grade10-site-analytics-SC-14 - Checkout Started is recorded when checkout is accepted

**Serves:** Events - Checkout Started fires when checkout is accepted
- **GIVEN** a signed-in collector with a cart
- **WHEN** the store accepts checkout
- **THEN** Mixpanel records Checkout Started for that order
- **AND** the event is a server event

#### Scenario: grade10-site-analytics-SC-42 - Checkout Started names the browser device

**Serves:** Identity - Checkout Started names the browser device
- **GIVEN** a collector whose browser has a device id
- **WHEN** the store accepts checkout for that visit
- **THEN** Checkout Started names that `$device_id`

#### Scenario: grade10-site-analytics-SC-15 - Order Paid carries member and points

**Serves:** Events - Order Paid carries member, tier, and points
- **WHEN** a paid order lands for a member
- **THEN** Mixpanel records Order Paid with Member true
- **AND** Points Earned and Points Spent are the integers that order credited and paid
- **AND** Tier is the tier held when that spend was priced, when the programme priced it

#### Scenario: grade10-site-analytics-SC-36 - A web Order Paid still names the checkout device

**Serves:** Identity - a web Order Paid still names the checkout device
- **GIVEN** Checkout Started recorded from a device
- **WHEN** Order Paid Origin `web` is recorded for that order
- **THEN** the event still names that device
- **AND** browse events from that device can join the paid account after sign-in

#### Scenario: grade10-site-analytics-SC-43 - A server emit that continues a visit keeps the device

**Serves:** Identity - a server emit that continues a visit keeps the device
- **GIVEN** a browser visit that recorded Page Viewed under a device
- **WHEN** a later server event for that visit is recorded and Grade10 still holds the device id
- **THEN** the server event names that `$device_id`

#### Scenario: grade10-site-analytics-SC-16 - A refused checkout records nothing

**Serves:** Events - a refused checkout records nothing
- **WHEN** the store refuses checkout
- **THEN** Mixpanel does not record Checkout Started

#### Scenario: grade10-site-analytics-SC-17 - Lot Viewed is not Product Viewed

**Serves:** Events - Lot Viewed is not Product Viewed
- **WHEN** a collector opens a lot page
- **THEN** Mixpanel records Lot Viewed
- **AND** it does not record Product Viewed for that listing

#### Scenario: grade10-site-analytics-SC-18 - Bid Placed fires after the maximum is accepted

**Serves:** Events - Bid Placed fires after the maximum is accepted
- **WHEN** a collector's maximum is accepted
- **THEN** Mixpanel records Bid Placed once for that bid
- **AND** Maximum Minor is the accepted cap in integer minor units

#### Scenario: grade10-site-analytics-SC-19 - Engine auto-bids are not Bid Placed

**Serves:** Events - engine auto-bids are not Bid Placed
- **WHEN** the auction engine places an auto-bid step under a collector's already-accepted maximum
- **THEN** Mixpanel does not record Bid Placed for that step

#### Scenario: grade10-site-analytics-SC-21 - Watching a lot is not a bid

**Serves:** Events - watching a lot records Lot Watched
- **WHEN** a collector watches a lot without bidding
- **THEN** Mixpanel records Lot Watched

#### Scenario: grade10-site-analytics-SC-22 - A till identification success is Member Identified

**Serves:** Events - a till identification success is Member Identified
- **WHEN** a till identification succeeds
- **THEN** Mixpanel records Member Identified with how they were found

#### Scenario: grade10-site-analytics-SC-23 - A till identification refusal is not Mixpanel

**Serves:** Events - a till identification refusal is not Mixpanel
- **WHEN** a till identification is refused
- **THEN** Mixpanel does not record Member Identified

#### Scenario: grade10-site-analytics-SC-24 - Vault payout is a funnel join

**Serves:** Events - Vault Payout Recorded joins the funnel, not the ledger
- **WHEN** the treasurer records a payout
- **THEN** Mixpanel records Vault Payout Recorded for that case
- **AND** financed cases per week are still read from the vault ledger
