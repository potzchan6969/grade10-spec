# grade10-site/auction/bid-payment-method Specification

## Purpose

Lets a collector bid on the card linked to their account: the card carries to
every lot, can change until their first accepted bid on a lot, and is then
locked to that lot. Nothing is held or charged on the card when they bid; only
the winner pays, through hosted Checkout on the winner order. The bid panel
discloses the buyer-premium rate without turning the bidding surface into an
invoice preview.

## Feature set

- Linked method
  - Change before first bid: the collector may change method until the first
    accepted bid on that listing
- Card on file
  - No card hold: committing or raising a maximum takes nothing from the card
    and waits on no payment provider
  - Winner pays at Checkout: only the winner is charged, through the winner
    order, never by the bid
- Card refusals
  - No card: a bid with no linked card is refused, and the bid form asks for one
  - Locked card: a bid on another card after the first accepted bid is refused,
    and the bid form says the lot's card is locked

## RENAMED Requirements

- FROM: `### Requirement: A linked method authorizes on bid commit`
- TO: `### Requirement: A bid stands on the linked card, which the first accepted bid locks to the listing`

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
provider. Only the winner pays, through hosted Checkout on the winner order
under `grade10-site/auction/winner-order`; a bidder who does not win is never
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

#### Scenario: grade10-site-auction-bid-payment-method-SC-19 - A bidder who does not win is never charged
**Serves:** grade10-site-auction-bid-payment-method-US-01 - a collector bids, loses the lot, and pays nothing

- **GIVEN** collectors A and B with accepted bids on a listing
- **WHEN** the listing closes with A winning
- **THEN** nothing is charged on B's card for the listing
- **AND** A pays through hosted Checkout on the winner order

#### Scenario: grade10-site-auction-bid-payment-method-SC-20 - Another card after the first accepted bid is refused
**Serves:** grade10-site-auction-bid-payment-method-US-02 - Collector raises a bid on the same card

- **GIVEN** a collector whose first accepted bid on a listing locked card X to
  it
- **WHEN** they submit a higher maximum naming card Y
- **THEN** Grade10 refuses it, and the bid form says: This listing's card is
  locked after the first accepted bid.
- **AND** it records no bid, and card X stays the listing's card

#### Scenario: grade10-site-auction-bid-payment-method-SC-21 - A refused first bid leaves the card changeable
**Serves:** grade10-site-auction-bid-payment-method-US-01 - a collector's first bid on a lot is refused

- **GIVEN** a collector with a linked card and no accepted bid on an open
  listing
- **WHEN** their first maximum on it is refused
- **THEN** the card is not locked to the listing
- **AND** Change is still offered

## REMOVED Requirements

### Requirement: Bid-CTA authorization failure copy

**Reason:** No card is authorized when a collector bids, so no bid fails on a
card authorization or on the provider's answer to one.

**Migration:** The bid form's words for every refusal are
`grade10-site/auction/auction`'s, in "A refused bid places nothing".
`grade10-site-auction-bid-payment-method-SC-12` and
`grade10-site-auction-bid-payment-method-SC-13` retire.

### Requirement: A listing authorization covers the committed maximum

**Reason:** No authorization exists to cover a maximum or to raise with it; a
raise is accepted or refused on the auction's rules alone.

**Migration:** Retrying a bid so it answers its first outcome is a later
change. `grade10-site-auction-bid-payment-method-SC-06`,
`grade10-site-auction-bid-payment-method-SC-11` and
`grade10-site-auction-bid-payment-method-SC-08` retire.

### Requirement: An outbid authorization is cancelled without capture

**Reason:** Being outbid has no authorization to cancel; nothing was held.

**Migration:** `grade10-site-auction-bid-payment-method-SC-07` retires.

### Requirement: A hold requests eligible authorization capabilities

**Reason:** No hold is created, so no authorization window is requested.

**Migration:** `grade10-site-auction-bid-payment-method-SC-14` retires.

### Requirement: A provider refusal resolves the attempted raise

**Reason:** No raise asks the provider for anything, so no provider refusal
can leave a raise pending.

**Migration:** `grade10-site-auction-bid-payment-method-SC-15` retires.
