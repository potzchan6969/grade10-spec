# grade10-site/consignment/lifecycle Specification

## Purpose

The consignment itself: an owner hands the house collectables to sell in
the store or at auction, from intake and the agreed terms through the sale
to the ending and the return.

The paper it signs is `grade10-site/consignment/documents`; the money is
`grade10-site/consignment/payout`; the consignor's own read is
`grade10-site/consignment/consignor-portal`; the counter it is worked from
is `grade10-admin/consignment/console`.

## Feature set

- Opening a consignment
  - Where it is taken: at the shop's counter or at an event such as a card
    show, the consignment recording where
  - Who consigns: an individual or a company, a company registering its own
    facts; whether a Grade10 account is linked
  - What is taken: graded collectables at launch; an ungraded item refused
  - The channel picked: the store or the auction, recorded at intake
  - Registered at intake: each item's market value and the consignment
    rates applying to it
- The terms
  - Price and floor: a list price and a floor agreed for each item before
    the agreement is prepared
  - At auction: the floor alone, which becomes the lot's start price and
    cannot be moved; no reserve
  - The schedule pinned: the commission, incentive, fees and term in force
    when the agreement is prepared stay with the consignment
- On sale
  - Checked before it publishes: an item passes intake inspection and
    photography before it is published
  - Logged on the form: each item is logged in Shopify when the consignment
    form is completed
  - One item one channel: one store product, or a draft lot staff place;
    never both
  - The first sale wins: a second sale of the same item is refunded
  - Within the floor: staff move the price without asking and the consignor
    is told; below it only on the consignor's written yes
  - The owner until delivery: the item stays the consignor's until the
    buyer has it
- A sale comes back
  - Reported on its own: the store and the auction report each sale,
    delivery and refund
  - Recorded by hand: only when a channel did not report it
- Ending
  - The term: on sale until the term ends, its remaining days counting
    down, warned at ending soon; the term's figure is unset
  - What an unsold item does: unsettled - the proposed actions a
    consignor may take are reducing the listed price, saving it to the
    vault for long-term custody, or booking an appointment to collect it
    at the shop
  - Taken back early: before it sells, for the early take-back fee where
    one is set
- Returning
  - Tracked: an item going back travels under its tracking
  - Signed for: the return closes on the signed return receipt

## ADDED Requirements

### Requirement: A consignment records where it was taken and its channel

Staff SHALL open a consignment at the shop's counter or at an event, and
SHALL record its channel, the store or the auction, when it is taken. A
consignment taken at an event SHALL name the event, and one taken at the
counter SHALL name none; either is received into the shop's site that takes
custody. Each item opened with the consignment SHALL carry the channel
recorded, and an item added later SHALL take the channel of the items
already on it.

#### Scenario: grade10-site-consignment-lifecycle-SC-01 - An event consignment names the event and its channel
**Serves:** grade10-site-consignment-lifecycle-US-02 - the consignor hands collectables in at a card show

- **GIVEN** a consignor at the Hong Kong Card Show handing in one graded card for the auction
- **WHEN** staff open the consignment there
- **THEN** it records the event's name, and the card carries the auction as its channel

#### Scenario: grade10-site-consignment-lifecycle-SC-02 - An event with no name is refused
**Serves:** grade10-site-consignment-lifecycle-US-02 - where the consignment was taken is never left blank

- **GIVEN** staff opening a consignment marked as taken at an event
- **WHEN** they give no event name, or name one for a consignment taken at the counter
- **THEN** the consignment is refused and nothing is recorded

### Requirement: Only graded items are taken, each registered with its market value

Each item registered on the consignment form SHALL carry its grader, grade
and cert, and SHALL carry its market value, the card's last-sold average, in
the brand currency's minor units. The incentive and the consignment rates
SHALL be read against that market value. An item without a grade or a
market value SHALL NOT be registered.

#### Scenario: grade10-site-consignment-lifecycle-SC-03 - A graded card is registered with its market value
**Serves:** grade10-site-consignment-lifecycle-US-03 - staff register each item's market value at intake

- **GIVEN** a PSA 9 card with cert 60112847 and a market value of HKD 12,000.00
- **WHEN** staff register it on the consignment form
- **THEN** the item keeps its grader, grade, cert and the market value of HKD 12,000.00

### Requirement: A company consigns under its registered office

A consignor SHALL be an individual or a company. A company SHALL register
its registered office, and an individual SHALL register none; a company
with no registered office SHALL be refused.

#### Scenario: grade10-site-consignment-lifecycle-SC-04 - A company registers its office
**Serves:** grade10-site-consignment-lifecycle-US-08 - a company consigns under its own name

- **GIVEN** Tin Hau Card Co. Ltd consigning with its registered office at 12/F, 88 Hennessy Road, Wan Chai
- **WHEN** staff open the consignment
- **THEN** it records a company consignor and that office

#### Scenario: grade10-site-consignment-lifecycle-SC-05 - A company with no office is refused
**Serves:** grade10-site-consignment-lifecycle-US-08 - a company's own facts are on its paper

- **GIVEN** a company consignor with a blank registered office
- **WHEN** staff open the consignment
- **THEN** the consignment is refused and nothing is recorded

### Requirement: The completed form logs each store item in Shopify

When the consignment agreement seals, each received item bound for the
store SHALL be logged in Shopify as a draft product, with its photographs,
price and seller line; going on sale SHALL publish that same product. An
item bound for the auction SHALL NOT be logged as a store product; it
becomes a draft lot when it is listed.

#### Scenario: grade10-site-consignment-lifecycle-SC-06 - The seal logs a store item as a draft
**Serves:** grade10-site-consignment-lifecycle-US-04 - the item is on sale without the consignor listing anything

- **GIVEN** a received card bound for the store on an agreement out for signature
- **WHEN** the consignor signs and the agreement seals
- **THEN** the store is owed the card's product, not live, and creates it as a draft

#### Scenario: grade10-site-consignment-lifecycle-SC-07 - Listing publishes the draft
**Serves:** grade10-site-consignment-lifecycle-US-04 - one item is one store product

- **GIVEN** a store product logged as a draft at the seal
- **WHEN** staff put the item on sale
- **THEN** the same product is published and stocked at one, and no second product is made

### Requirement: An item goes on sale only once received

An item SHALL go on sale only once it is received: identified, checked,
photographed, labelled and put away at intake, which is its inspection and
its photography. Listing an item not yet received SHALL be refused by name.

#### Scenario: grade10-site-consignment-lifecycle-SC-08 - An item not received is not listed
**Serves:** grade10-site-consignment-lifecycle-US-04 - nothing is published before it is checked

- **GIVEN** a signed consignment whose item is still with its owner
- **WHEN** staff read what the item offers
- **THEN** listing it is withheld as not received

### Requirement: A shipped return travels under its tracking

An item going back by post SHALL carry its courier and tracking number once
the house has posted it, and the return SHALL close on the signed return
receipt. An item collected at a shop SHALL carry no tracking.

#### Scenario: grade10-site-consignment-lifecycle-SC-09 - A shipped return carries its tracking
**Serves:** grade10-site-consignment-lifecycle-US-07 - the consignor follows a return home

- **GIVEN** an item going back to its consignor by post
- **WHEN** staff record SF Express and the waybill number SF1234567890
- **THEN** the item reads that courier and number, and still offers its return to be completed

#### Scenario: grade10-site-consignment-lifecycle-SC-10 - A collected return takes no tracking
**Serves:** grade10-site-consignment-lifecycle-US-07 - tracking belongs to a parcel

- **GIVEN** an item going back by collection at a shop
- **WHEN** staff try to record a tracking number on it
- **THEN** it is refused and the return is unchanged
