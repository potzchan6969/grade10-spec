## Purpose

Lets a collector establish one card-backed authorization for a listing before
their first bid, then safely reuse that commitment while they raise their bid.

## Feature set

- Payment method before bidding
  - Listing-specific choice: a collector selects a method before their first bid on a listing
  - Hosted entry: card details and required authentication stay in the payment provider's field
  - Same card: later bids for the listing retain the selected method
- Bid authorization
  - Maximum coverage: the hold covers the submitted bid or automatic-bid maximum
  - Raised commitment: a higher maximum raises the existing authorization
  - Accepted after authorization: a bid is not accepted until the authorization is confirmed
- Authorization lifecycle
  - One active hold: a bidder and listing have at most one active authorization
  - Outbid cancellation: being outbid cancels the authorization
  - Provider record: every authorization keeps its provider payment reference

## User journeys

### bid-payment-method-US-01: Collector authorizes a first bid

**As a** signed-in collector,
**I want** to select a card and authorize my maximum before placing my first
bid on a listing,
**so that** I know the bid is backed by the card I chose.

**Accepted by:**

- `bid-payment-method-SC-01` — First bid requires a payment method
- `bid-payment-method-SC-02` — A selected payment method authorizes the maximum
- `bid-payment-method-SC-03` — Payment authentication stays in the dialog
- `bid-payment-method-SC-04` — A refused authorization does not place a bid

### bid-payment-method-US-02: Collector raises a bid on the same card

**As a** collector who already bid on a listing,
**I want** a higher bid to use the card I already committed to that listing,
**so that** I can raise my maximum without selecting a card again.

**Accepted by:**

- `bid-payment-method-SC-05` — A later bid retains the listing's payment method
- `bid-payment-method-SC-06` — Raising a maximum raises the authorization

### bid-payment-method-US-03: Collector is released when outbid

**As a** collector who has been outbid,
**I want** the hold on my card cancelled,
**so that** money is not held for a listing I cannot win.

**Accepted by:**

- `bid-payment-method-SC-07` — An outbid cancels the authorization
- `bid-payment-method-SC-08` — Provider outcomes remain idempotent

## ADDED Requirements

### Requirement: A collector chooses a payment method before their first bid

Before Grade10 accepts a collector's first bid on a listing, it SHALL require
that collector to choose a card payment method for that listing. The payment
method flow SHALL appear in the bid dialog and SHALL use a provider-hosted
field for card details and any required customer authentication. Grade10 SHALL
not receive or persist card number, expiry, CVC, or a provider secret.

The method selected for a collector and listing SHALL remain that listing's
method. Grade10 SHALL not ask the collector to select a method again when they
raise their bid on that listing. A first bid on another listing SHALL require
a new selection, even if the collector has saved methods.

#### Scenario: bid-payment-method-SC-01 - First bid requires a payment method

- **GIVEN** a signed-in collector who has not bid on an open listing
- **WHEN** they submit a valid bid or maximum for that listing
- **THEN** Grade10 opens the payment-method step in the bid dialog
- **AND** it does not accept the bid before the collector selects a method

#### Scenario: bid-payment-method-SC-02 - A selected payment method authorizes the maximum

- **GIVEN** a collector at the payment-method step for their first bid on a listing
- **WHEN** they successfully select a method and authorize a maximum
- **THEN** Grade10 creates an authorization for that maximum in minor units and the listing currency
- **AND** it associates the provider payment reference with the collector, listing, and bid
- **AND** it accepts the bid only after the authorization is confirmed

#### Scenario: bid-payment-method-SC-03 - Payment authentication stays in the dialog

- **GIVEN** a collector is authorizing their first bid
- **WHEN** the provider requires authentication or reports that authorization is pending
- **THEN** the bid dialog remains open and shows that provider flow or pending state
- **AND** Grade10 does not show the bid as accepted until authorization is confirmed

#### Scenario: bid-payment-method-SC-04 - A refused authorization does not place a bid

- **GIVEN** a collector is authorizing their first bid
- **WHEN** the provider refuses the method or authorization
- **THEN** the bid dialog shows a refusal and lets the collector correct or select a method
- **AND** Grade10 records no accepted bid and no active authorization

#### Scenario: bid-payment-method-SC-05 - A later bid retains the listing's payment method

- **GIVEN** a collector has an active authorization for a listing
- **WHEN** they submit a higher valid bid or maximum for that listing
- **THEN** Grade10 uses the method already associated with that collector and listing
- **AND** it does not show the payment-method step

### Requirement: A listing authorization covers the committed maximum

For a collector and listing, Grade10 SHALL maintain at most one active
authorization. Its amount SHALL equal the collector's committed maximum: the
submitted bid when no automatic maximum applies, or the submitted automatic
maximum when one does. When a collector raises that maximum, Grade10 SHALL
raise the active authorization before accepting the raised bid. Grade10 SHALL
not lower an authorization by submitting a lower amount.

Each authorization SHALL have one provider payment reference stored by
Grade10. A repeated request or a repeated provider outcome SHALL return the
already-recorded outcome and SHALL not create another active authorization,
accepted bid, or provider charge.

#### Scenario: bid-payment-method-SC-06 - Raising a maximum raises the authorization

- **GIVEN** a collector has an active authorization for a listing at one maximum
- **WHEN** they submit a higher valid maximum for that listing
- **THEN** Grade10 raises the existing authorization to the new maximum
- **AND** it accepts the raised bid only after the raised authorization is confirmed

#### Scenario: bid-payment-method-SC-08 - Provider outcomes remain idempotent

- **GIVEN** Grade10 has begun an authorization for a collector and listing
- **WHEN** the bid request or its provider outcome is delivered again
- **THEN** Grade10 returns the recorded outcome
- **AND** exactly one active authorization and accepted bid outcome exist for that request

### Requirement: An outbid authorization is cancelled without capture

When Grade10 accepts a higher bid from another collector, it SHALL cancel the
outbid collector's active authorization. It SHALL record the cancellation
outcome against the stored provider payment reference. Cancellation or expiry
of an authorization SHALL not capture funds or create a payment, order, or
fulfilment outcome.

#### Scenario: bid-payment-method-SC-07 - An outbid cancels the authorization

- **GIVEN** a collector has an active authorization for a listing
- **WHEN** Grade10 accepts a higher bid from another collector
- **THEN** Grade10 requests cancellation of the first collector's authorization
- **AND** it records the provider's cancellation outcome
- **AND** it does not capture money from the first collector
