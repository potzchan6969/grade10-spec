## Purpose

What Grade10 records in Mixpanel: the collector events, who may send
each name, how a visitor is named, the user-profile snapshot, and
what never leaves the site. SQL records stay the ledger. Datadog
counters stay how-often. Identity rules in `shared/auth/session` still
name a signed-in person by user id and an anonymous visit by device.

## Feature set

- Identity
  - Session stamps the person: a signed-in event is the user id and still names the device
  - Anonymous is the device: a signed-out event is never a user id
  - Ownerless paid order: money still counts, on the order, never merged onto a later claim
  - Audience: collector or staff, on every identified event
  - Session end starts a new device: sign-out and session expiry; the next anonymous visit is not the previous person
  - Server keeps device: Checkout Started, web Order Paid, and other server emits that continue a browser or till visit name `$device_id` when known
  - Account Created: once, when the store first knows a user id
  - Geolocation: collector IP on import and engage when known; never stored as a property
- Events
  - Client names: the browser may send only those
  - Server names: a browser cannot submit them
  - Store funnel: page, product, add, cart, checkout, paid order
  - Auction funnel: lot view, card, bid, watch, outbid, win, invoice paid
  - Loyalty facts: points on the paid order, reward redeemed, pass added, till identified
  - Vault conversion: submitted, visit booked, offer, payout, identity bound
  - First-touch campaign: UTM on Page Viewed and Lot Viewed when present; Initial Referrer on the first Page Viewed for a device
- User profile
  - Snapshot: audience, member, tier, identity standing, wallet pass, created-at once
  - Known users only: never a profile for an anonymous device
  - Server writes: when those facts change
- Refusals
  - No PII: email, name, phone, address, KYC payload, coupon codes, secrets
  - No operator Mixpanel: admin consoles send nothing
  - No ZZZ emit: Grade10 events only; shared ingest is the groundwork
  - No ledger in Mixpanel: refunds, expiry, loans outstanding, bid ticks

## ADDED Requirements

### Requirement: Analytics names a visitor by session, never by the client

WHEN a Grade10 event is recorded and the caller is signed in, the event
SHALL be attributed to that person's user id and SHALL still name the
device. WHEN the caller is not signed in, the event SHALL be attributed
to the device and SHALL NOT be attributed to a user id. The client SHALL
NOT choose the user. A signed-in identified event SHALL carry Audience
as `collector` when the session holds only the collector role, and as
`staff` when it holds any operator role. WHEN the collector signs out or the signed-in session expires,
the next analytics event from that browser SHALL use a new device and
SHALL NOT be attributed to the previous person. WHEN a server event
continues a browser or till visit and Grade10 still holds that visit's
device id, the event SHALL name that `$device_id` — including Checkout
Started and Order Paid with Origin `web` — so anonymous browse merges
onto the person after pay or sign-in. The order-only device used for an
ownerless paid order SHALL NOT be reused as a browser device id.

#### Scenario: grade10-site-analytics-SC-01 - A signed-in event is the user and the device

**Serves:** Identity - a signed-in event names the user and the device
- **GIVEN** a collector signed in
- **WHEN** Grade10 records an analytics event for that visit
- **THEN** the event is attributed to that collector's user id
- **AND** it still names that device
- **AND** Audience is `collector`

#### Scenario: grade10-site-analytics-SC-02 - An anonymous event is the device

**Serves:** Identity - an anonymous event names only the device
- **GIVEN** a caller who is not signed in
- **WHEN** Grade10 records an analytics event for that visit
- **THEN** the event is attributed to the device
- **AND** it is not attributed to a user id

#### Scenario: grade10-site-analytics-SC-03 - A client cannot claim a user

**Serves:** Identity - a client cannot claim a user id
- **GIVEN** a caller who is not signed in
- **WHEN** they submit an analytics event that names a user id
- **THEN** the recorded event is not attributed to that user id

#### Scenario: grade10-site-analytics-SC-04 - Staff are marked staff

**Serves:** Identity - staff browsing the collector site are marked staff
- **GIVEN** a signed-in operator browsing the collector site
- **WHEN** Grade10 records an analytics event for that visit
- **THEN** Audience is `staff`

#### Scenario: grade10-site-analytics-SC-34 - Sign-out starts a new device

**Serves:** Identity - sign-out starts a new device
- **GIVEN** a collector who was signed in on a browser
- **WHEN** they sign out
- **THEN** the next analytics event from that browser is attributed to a new device
- **AND** it is not attributed to that collector

#### Scenario: grade10-site-analytics-SC-41 - Session expiry starts a new device

**Serves:** Identity - session expiry starts a new device
- **GIVEN** a collector whose signed-in session has expired on a browser
- **WHEN** the next analytics event is recorded from that browser
- **THEN** the event is attributed to a new device
- **AND** it is not attributed to that collector

### Requirement: An ownerless paid order is counted once and never merged

WHEN a paid order has no owner, Order Paid SHALL be attributed to the
order as a device and SHALL NOT be attributed to a user id. WHEN that
order is later claimed, Grade10 SHALL NOT send Order Paid again and
SHALL NOT merge that order device onto the claimer's profile.

#### Scenario: grade10-site-analytics-SC-05 - An ownerless paid order sits on the order

**Serves:** Identity - an ownerless paid order sits on the order alone
- **GIVEN** a paid order with no owner
- **WHEN** Grade10 records Order Paid
- **THEN** the event is attributed to that order as a device
- **AND** it is not attributed to a user id

#### Scenario: grade10-site-analytics-SC-06 - A later claim does not send Order Paid again

**Serves:** Identity - a later claim does not resend or merge Order Paid
- **GIVEN** Order Paid already recorded for an ownerless order
- **WHEN** that order is later claimed by a member
- **THEN** Grade10 does not send Order Paid again for that order
- **AND** Mixpanel does not merge that order device onto the member

### Requirement: Account Created fires once when the store first knows a user id

WHEN the store first creates a user id, including a checkout-created
unverified account, it SHALL record Account Created once for that id.
WHEN the store finds an account that already existed, it SHALL NOT
record Account Created. The identity worker SHALL NOT record Mixpanel
events.

#### Scenario: grade10-site-analytics-SC-07 - A new account is created once

**Serves:** Identity - Account Created fires once when the store first knows a user id
- **GIVEN** an email that has no account
- **WHEN** the store creates an unverified account for that email
- **THEN** Mixpanel records Account Created for that user id once

#### Scenario: grade10-site-analytics-SC-08 - Finding an existing account is not Account Created

**Serves:** Identity - finding an existing account is not Account Created
- **GIVEN** an account that already exists
- **WHEN** the store asks to create an account for that same email
- **THEN** Mixpanel does not record Account Created for that request

#### Scenario: grade10-site-analytics-SC-09 - Auth does not talk to Mixpanel

**Serves:** Identity - the identity worker records no Mixpanel event
- **WHEN** the identity worker creates, verifies, or signs a person in
- **THEN** it records no Mixpanel event

### Requirement: The browser may send client event names only

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
| Bid Placed            | A collector's maximum is accepted after authorization confirms        | Listing ID; Bid ID; Currency; Maximum Minor; Amount Minor; Leading (boolean); Commit (`first` \| `raise`)                                                                                                                                                     |
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
retry counts once. Invoice Paid SHALL fire when the invoice is paid,
never when a bid hold is captured. Lot Watched SHALL fire on an explicit
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
- **WHEN** a collector's maximum is accepted after authorization confirms
- **THEN** Mixpanel records Bid Placed once for that bid
- **AND** Maximum Minor is the accepted cap in integer minor units

#### Scenario: grade10-site-analytics-SC-19 - Engine auto-bids are not Bid Placed

**Serves:** Events - engine auto-bids are not Bid Placed
- **WHEN** the auction engine places an auto-bid step under a collector's already-accepted maximum
- **THEN** Mixpanel does not record Bid Placed for that step

#### Scenario: grade10-site-analytics-SC-20 - A hold capture is not Invoice Paid

**Serves:** Events - a hold capture is not Invoice Paid
- **WHEN** a bid hold is captured
- **THEN** Mixpanel does not record Invoice Paid

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

### Requirement: Mixpanel geolocation uses the collector's IP

WHEN Grade10 sends an event or user-profile write to Mixpanel, it SHALL
pass the collector's client IP for geolocation when that address is known
— `ip` on import, `$ip` on engage — including server emits that follow a
browser or till request. Mixpanel SHALL NOT receive the worker's address
as the person's location: when no collector IP is known, engage SHALL set
`$ip` to `0` and import SHALL omit a fabricated datacenter IP. Grade10
SHALL NOT store an IP address as an event or profile property; Mixpanel
discards the address after deriving geolocation.

#### Scenario: grade10-site-analytics-SC-38 - /api/track stamps the client IP

**Serves:** Identity - client ingest stamps the collector IP for geo
- **WHEN** the browser posts a client event batch to `/api/track`
- **THEN** each event Mixpanel receives carries that request's client IP
  for geolocation
- **AND** the event does not store an IP address as a property

#### Scenario: grade10-site-analytics-SC-39 - A server emit keeps the collector IP

**Serves:** Identity - a server emit keeps the collector IP for geo
- **GIVEN** a checkout request that captured the collector's client IP
- **WHEN** the worker later records Order Paid for that order
- **THEN** the Mixpanel event carries that collector IP for geolocation
- **AND** not the worker's address

#### Scenario: grade10-site-analytics-SC-40 - A profile write without a client IP does not stamp the worker

**Serves:** Identity - a profile write without a client IP does not stamp the worker
- **GIVEN** a tier change with no collector IP on hand
- **WHEN** the backend writes the user profile
- **THEN** `$ip` is `0`
- **AND** Mixpanel does not set the person's location from the worker

### Requirement: Mixpanel holds a user-profile snapshot of the latest state

WHEN a Grade10 collector exists as a Mixpanel person, the backend SHALL
write a user profile that is the latest snapshot of the properties
below. The browser SHALL NOT write a user profile. Each property SHALL
be written when that fact changes, and SHALL overwrite the previous
value. Grade10 SHALL NOT write a user profile for an anonymous device.
Created-at SHALL be written once, when Account Created fires. A
user-profile write SHALL set `$ip` to the collector's client IP when
Grade10 knows it, so Mixpanel can derive geolocation; when no collector
IP is known, `$ip` SHALL be `0` so the worker's address is not written.
The profile SHALL NOT store an IP address as a property.

| Property          | Values                                  | Written when                                              |
| ----------------- | --------------------------------------- | --------------------------------------------------------- |
| Audience          | `collector` \| `staff`                  | An identified event is recorded                           |
| Member            | boolean                                 | The person is a member, or stops being one                |
| Tier              | `Silver` \| `Gold` \| `Black`           | The held tier changes; omitted when they are not a member |
| Identity Standing | `unverified` \| `verified` \| `expired` | Standing changes                                          |
| Wallet Pass       | `none` \| `apple` \| `google` \| `both` | A pass is issued or ended                                 |
| Created           | Mixpanel created-at                     | Account Created, once                                     |

The profile SHALL NOT carry email, name, phone, address, date of birth,
document numbers, coupon codes, pass serials, a stored IP address, or a
device fingerprint.

#### Scenario: grade10-site-analytics-SC-25 - A tier change updates the snapshot

**Serves:** User profile - a tier change updates the snapshot
- **GIVEN** a member on Silver
- **WHEN** they reach Gold
- **THEN** the Mixpanel user profile's Tier is `Gold`

#### Scenario: grade10-site-analytics-SC-26 - The browser cannot write a user profile

**Serves:** User profile - the browser cannot write a user profile
- **WHEN** the browser submits a user-profile update
- **THEN** Mixpanel does not take that update as the person

#### Scenario: grade10-site-analytics-SC-27 - Contact fields stay off the profile

**Serves:** User profile - contact fields stay off the snapshot
- **WHEN** the backend writes a user profile
- **THEN** the profile does not carry an email address

#### Scenario: grade10-site-analytics-SC-37 - An anonymous device has no user profile

**Serves:** User profile - an anonymous device has no user profile
- **GIVEN** a caller who is not signed in
- **WHEN** Grade10 records an analytics event for that visit
- **THEN** Mixpanel does not hold a user profile for that device

### Requirement: Mixpanel SHALL NOT carry PII, operator traffic, or another brand's emit

Events and profiles SHALL NOT carry email, name, phone, address, KYC
document payload, coupon codes, pass secrets, a private maximum from
the browser, or a stored IP address. Grade10 admin consoles SHALL NOT send Mixpanel events. This
capability SHALL NOT require ZZZ storefront events. A ZZZ emit catalog is
a later change. This capability SHALL NOT change whether ZZZ mounts
shared ingest.

Grade10 SHALL NOT send Mixpanel events for: refunds, points expiry,
tier reviews as a stream, bid standing ticks, operator post-sale,
document contents, or crawler answers from the serving worker.

#### Scenario: grade10-site-analytics-SC-28 - Email is not an event property

**Serves:** Refusals - email is not an event property
- **WHEN** Grade10 records any Mixpanel event
- **THEN** the event does not carry an email address

#### Scenario: grade10-site-analytics-SC-29 - Admin consoles send nothing

**Serves:** Refusals - admin consoles send nothing to Mixpanel
- **WHEN** an operator uses a Grade10 admin console
- **THEN** Mixpanel records no event for that use

#### Scenario: grade10-site-analytics-SC-30 - ZZZ storefront emit is not required

**Serves:** Refusals - ZZZ storefront emit is not required
- **WHEN** this capability is implemented
- **THEN** Grade10 records the catalog
- **AND** ZZZ is not required to emit storefront events

#### Scenario: grade10-site-analytics-SC-31 - The winner's invoice paid is Invoice Paid

**Serves:** Events - the winner invoice paid is Invoice Paid
- **WHEN** the winner's invoice is paid
- **THEN** Mixpanel records Invoice Paid

#### Scenario: grade10-site-analytics-SC-32 - A bid does not record Lot Watched

**Serves:** Events - a bid does not record Lot Watched
- **WHEN** a collector places an accepted bid
- **THEN** Mixpanel does not record Lot Watched for that bid

#### Scenario: grade10-site-analytics-SC-33 - A till paid order carries the session

**Serves:** Events - a till paid order carries the till session
- **GIVEN** a till identification that succeeded for a session
- **WHEN** Order Paid is recorded for that till sale
- **THEN** Origin is `pos`
- **AND** Session ID is that session
