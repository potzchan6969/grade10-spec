# grade10-site/auction/bid-payment-method Specification

## Purpose

Lets a collector bid on the card linked to their account: the card carries to
every lot, can change until their first accepted bid on a lot, and is then
locked to that lot. Nothing is held or charged on the card when they bid; only
the winner pays, by the invoice on their winner order. The bid panel
discloses the buyer-premium rate without turning the bidding surface into an
invoice preview.

## Feature set

- Linked method
  - Account card on file: linking happens under bid-panel-enrollment; a linked
    method carries over to new lots by default
  - Change before first bid: the collector may change method until the first
    accepted bid on that listing
  - Same card on raises: later bids on the listing retain the committed method
- Premium disclosure
  - Bid-panel rate: the buyer's premium is shown as 20% of the winning bid
  - Amount withheld: the calculated premium amount is absent until an invoice exists
- Card on file
  - No card hold: committing or raising a maximum takes nothing from the card
    and waits on no payment provider
  - Winner pays at Checkout: only the winner is charged, through the winner
    order, never by the bid
- Card refusals
  - No card: a bid with no linked card is refused, and the bid form asks for one
  - Locked card: a bid on another card after the first accepted bid is refused,
    and the bid form says the lot's card is locked

## Requirements

### Requirement: The bid panel discloses the buyer-premium rate

The listing bid panel SHALL show the buyer's premium rate as **20%** of the
winning bid before a collector submits a bid. The panel SHALL show the rate in
all supported auction currencies and SHALL not show a calculated premium amount,
an invoice total, or a premium line amount before an invoice exists.

<!-- trace:scenario id=g10.auction-bid-payment-method.SC-x21 rev=1 -->
#### Scenario: grade10-site-auction-bid-payment-method-SC-16 - Bid panel shows the premium rate
**Serves:** grade10-site-auction-bid-payment-method-US-04 - Collector understands the buyer-premium rate before bidding

- **GIVEN** a collector opens an active auction listing
- **WHEN** the bid panel is rendered
- **THEN** it shows that the buyer's premium rate is 20% of the winning bid
- **AND** it shows no calculated premium amount or invoice total

<!-- trace:scenario id=g10.auction-bid-payment-method.SC-oeb rev=1 -->
#### Scenario: grade10-site-auction-bid-payment-method-SC-17 - Premium rate is consistent across currencies
**Serves:** grade10-site-auction-bid-payment-method-US-04 - Collector understands the buyer-premium rate before bidding

- **GIVEN** a collector opens active listings in USD, HKD, and JPY
- **WHEN** they read each bid panel
- **THEN** each panel shows the buyer's premium rate as 20%
- **AND** no panel shows a currency-specific premium amount

### Requirement: A bid stands on the linked card, which the first accepted bid locks to the listing

Before Grade10 accepts a collector's bid or maximum on a listing, the
collector SHALL have a linked card. Linking and changing a card follow
`grade10-site/auction/bid-panel-enrollment`. Grade10 SHALL NOT open a
payment-method or confirmation step when a linked card is on file, and SHALL
NOT receive or keep a card number, expiry, CVC, or a provider secret.

A linked card SHALL carry over to another listing by default; Grade10 SHALL
NOT ask for a card again on a first bid solely because the listing is
different. Change SHALL stay open until the collector's first accepted bid on
that listing; a refused bid locks nothing. The first accepted bid SHALL lock
the card to the listing: later bids by that collector on it use that card,
Change is hidden, and a bid naming another card is refused.

Committing or raising a maximum SHALL take nothing from the card: nothing is
held, authorized or charged, and acceptance SHALL NOT wait on the payment
provider. Only the winner pays, by the invoice on their winner order under
`grade10-site/auction/winner-order`; a bidder who does not win is never
charged for the listing.

| Refused when | The bid form says |
| --- | --- |
| No linked card | Link a card to bid. |
| Another card after the first accepted bid on the listing | This listing's card is locked after the first accepted bid. |

Every other refusal, and the order refusals answer in, is
`grade10-site/auction/auction`'s.

<!-- trace:scenario id=g10.auction-bid-payment-method.SC-s1o rev=2 -->
#### Scenario: grade10-site-auction-bid-payment-method-SC-01 - Commit without a linked method is refused
**Serves:** grade10-site-auction-bid-payment-method-US-01 - a collector with no card linked yet tries to bid

- **GIVEN** a signed-in collector with no linked card on an open listing
- **WHEN** they submit a valid maximum
- **THEN** Grade10 refuses the bid, and the bid form says: Link a card to bid.
- **AND** it records no bid for that attempt
- **AND** link-card setup remains available under bid-panel-enrollment

<!-- trace:scenario id=g10.auction-bid-payment-method.SC-7z5 rev=2 -->
#### Scenario: grade10-site-auction-bid-payment-method-SC-05 - A later bid retains the listing's payment method
**Serves:** grade10-site-auction-bid-payment-method-US-02 - Collector raises a bid on the same card

- **GIVEN** a collector with an accepted bid on a listing, placed on their
  linked card
- **WHEN** they submit a higher valid maximum for that listing
- **THEN** Grade10 accepts it on the card already locked to that collector and
  listing
- **AND** it does not open a payment-method step

<!-- trace:scenario id=g10.auction-bid-payment-method.SC-c3a rev=2 -->
#### Scenario: grade10-site-auction-bid-payment-method-SC-10 - Linked method carries over to a new listing
**Serves:** grade10-site-auction-bid-payment-method-US-01 - Collector bids on the card already linked

- **GIVEN** a collector who linked a card on a prior listing and has not bid on
  a new open listing
- **WHEN** they submit a valid maximum on the new listing
- **THEN** Grade10 accepts it on that linked card
- **AND** it does not ask for a card again solely because the listing is
  different

<!-- trace:scenario id=g10.auction-bid-payment-method.SC-mlo rev=1 -->
#### Scenario: grade10-site-auction-bid-payment-method-SC-18 - Bidding takes nothing from the card
**Serves:** grade10-site-auction-bid-payment-method-US-01 - Collector bids on the card already linked

- **GIVEN** a collector with a linked card on an open listing
- **WHEN** they commit a maximum, and later raise it
- **THEN** each maximum is accepted in the same answer
- **AND** nothing is held, authorized or charged on the card, and no payment
  provider is asked

<!-- trace:scenario id=g10.auction-bid-payment-method.SC-l44 rev=1 -->
#### Scenario: grade10-site-auction-bid-payment-method-SC-19 - A bidder who does not win is never charged
**Serves:** grade10-site-auction-bid-payment-method-US-01 - a collector bids, loses the lot, and pays nothing

- **GIVEN** collectors A and B with accepted bids on a listing
- **WHEN** the listing closes with A winning
- **THEN** nothing is charged on B's card for the listing
- **AND** only A pays, by the invoice on A's winner order

#### Scenario: grade10-site-auction-bid-payment-method-SC-20 - Another card after the first accepted bid is refused
**Serves:** grade10-site-auction-bid-payment-method-US-02 - Collector raises a bid on the same card

- **GIVEN** a collector whose first accepted bid on a listing locked card X to
  it
- **WHEN** they submit a higher maximum naming card Y
- **THEN** Grade10 refuses it, and the bid form says: This listing's card is
  locked after the first accepted bid.
- **AND** it records no bid, and card X stays the listing's card

<!-- trace:scenario id=g10.auction-bid-payment-method.SC-o6l rev=1 -->
#### Scenario: grade10-site-auction-bid-payment-method-SC-21 - A refused first bid leaves the card changeable
**Serves:** grade10-site-auction-bid-payment-method-US-01 - a collector's first bid on a lot is refused

- **GIVEN** a collector with a linked card and no accepted bid on an open
  listing
- **WHEN** their first maximum on it is refused
- **THEN** the card is not locked to the listing
- **AND** Change is still offered
