# grade10-site/consignment/consignor-portal Specification

## Purpose

What a signed-in consignor can read about their own consignments: each
consignment and every item's status - an auction-bound one before its lot
lists - the prices, the terms, the sales, the payouts, the documents and
the messages sent.

What happens to the consignment is `grade10-site/consignment/lifecycle`;
the screens that read this are the designers' to draw.

## Feature set

- Their consignments
  - Under the linked account: the consignments under the consignor's own
    account
  - Every item's status: an auction-bound one showing once checked in,
    before its lot lists
  - Its channel shown: the shop, the online store or the auction
  - Prices and terms: each item's agreed list price and floor, the
    commission rate, the consignor's estimated net payout, the days left
    on the term, and the terms pinned to the agreement
- The money
  - Sales: each sale and what the consignor is paid
  - Payouts: the payouts made and when the next is due
- The record
  - The paper: the agreement, the receipts, each statement and invoice
  - The messages: the emails the consignment sent
- Signed in
  - The account link: intake records and links the consignor's Grade10
    account

## ADDED Requirements

### Requirement: A consignor reads each item from check-in, with its rate, estimated net and days left

A signed-in consignor SHALL read every item of their own consignments once
it is checked in, an auction-bound one before its lot lists, with its
channel, its agreed list price and floor, its market value, the commission
rate it sells under and the estimated net payout at the agreed price, both
under the pinned terms or, before the agreement, the schedule in force; an
item on sale SHALL also read the whole days left on its term. A sold item
SHALL read the rate and net of its sale. The consignment SHALL read the
incentive owed and whether it was paid.

#### Scenario: grade10-site-consignment-consignor-portal-SC-01 - An auction-bound item reads before its lot lists
**Serves:** grade10-site-consignment-consignor-portal-US-01 - the consignor checks a consignment's status

- **GIVEN** a checked-in card bound for the auction at a floor of HKD 3,000.00 under a 10% auction rate, its agreement not yet sealed
- **WHEN** the consignor reads their consignments
- **THEN** the card reads the auction, the floor, a 10% rate and an estimated net of HKD 2,700.00, and no days left

#### Scenario: grade10-site-consignment-consignor-portal-SC-02 - An item on sale reads its days left
**Serves:** grade10-site-consignment-consignor-portal-US-01 - the consignor sees how long the item has left

- **GIVEN** a card on sale in the store for 10 days of a 90-day term at HKD 4,200.00 under a 15% band
- **WHEN** the consignor reads the consignment
- **THEN** the card reads a 15% rate, an estimated net of HKD 3,570.00 and 80 days left, and the consignment reads the incentive owed
