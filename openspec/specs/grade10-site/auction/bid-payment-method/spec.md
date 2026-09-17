# grade10-site/auction/bid-payment-method Specification

## Purpose
Lets a collector authorize a card-backed hold when they commit or raise a
maximum on a listing, reusing a linked method across lots, while understanding
the buyer-premium rate without turning the bidding surface into an invoice
preview.

## Feature set

- Linked method
  - Account card on file: linking happens under bid-panel-enrollment; a linked
    method carries over to new lots by default
  - Change before first bid: the collector may change method until the first
    bid on that listing
  - Same card on raises: later bids on the listing retain the committed method
- Bid authorization
  - Silent on commit: submitting a maximum starts authorization without a
    confirmation or payment-method modal
  - Maximum coverage: the hold covers the submitted automatic-bid maximum
  - Raised commitment: a higher maximum raises the existing authorization
  - Accepted after authorization: a bid is not accepted until the authorization
    is confirmed
- Bid-CTA outcomes
  - Decline and unusable method: refusal copy near the bid action
  - Provider failure: distinct network/provider failure copy
  - Raise failure: same refusal copy as decline; prior maximum stays
  - Pending and SCA: busy or provider challenge on the listing bid surface
- Authorization lifecycle
  - One active hold: a bidder and listing have at most one active authorization
  - Outbid cancellation: being outbid cancels the authorization
  - Provider record: every authorization keeps its provider payment reference
- Premium disclosure
  - Bid-panel rate: the buyer's premium is shown as 20% of the winning bid
  - Amount withheld: the calculated premium amount is absent until an invoice exists

## Requirements

### Requirement: Bid-CTA authorization failure copy

When authorization fails on commit or raise, Grade10 SHALL show a tiny
destructive message on or near the bid action. Exact English strings:

| Outcome | English |
| --- | --- |
| Provider declines the hold, linked method is unusable, raise hold fails, or an existing hold has expired before a raise can cover the new maximum | Your card could not be authorized. Try another card. |
| Stripe or Grade10 cannot complete the authorize call (timeout, provider error, or cancelled intent) | Your bid did not go through. The card was not authorized. |

These strings SHALL not use em dashes. Localized catalogs SHALL answer the same
meanings under keys the consumer supplies to the bid surface.

#### Scenario: grade10-site-auction-bid-payment-method-SC-12 - Decline copy on the bid action
**Serves:** grade10-site-auction-bid-payment-method-US-01 - Collector authorizes a first bid on commit

- **GIVEN** a collector is authorizing a maximum on commit
- **WHEN** the provider declines the method or authorization
- **THEN** the listing bid surface shows: Your card could not be authorized. Try another card.

#### Scenario: grade10-site-auction-bid-payment-method-SC-13 - Provider-failure copy on the bid action
**Serves:** grade10-site-auction-bid-payment-method-US-01 - Collector authorizes a first bid on commit

- **GIVEN** a collector is authorizing a maximum on commit
- **WHEN** Stripe or Grade10 cannot complete the authorize call
- **THEN** the listing bid surface shows: Your bid did not go through. The card was not authorized.

### Requirement: A linked method authorizes on bid commit

Before Grade10 accepts a collector's bid or maximum on a listing, the
collector SHALL have a linked card payment method. Linking and change before
the first bid on a listing SHALL follow
`grade10-site/auction/bid-panel-enrollment`. Grade10 SHALL NOT open a
payment-method or confirmation modal solely to authorize a hold when a linked
method is already on file.

When the collector submits a valid maximum with a linked method, Grade10 SHALL
start authorization for that maximum in the background. Grade10 SHALL not
receive or persist card number, expiry, CVC, or a provider secret.

A linked method on file SHALL carry over to another listing by default. Grade10
SHALL NOT require a new method selection on a first bid solely because the
listing is different. The linked method's Change action SHALL remain enabled
until the first bid on that listing is accepted. After that first accepted bid,
the method SHALL be locked for the listing, and Grade10 SHALL hide or disable
Change for subsequent raises. The method committed for a collector and listing
after the first accepted bid SHALL remain that listing's method for raises.

#### Scenario: grade10-site-auction-bid-payment-method-SC-01 - Commit without a linked method is refused
**Serves:** grade10-site-auction-bid-payment-method-US-01 - Collector authorizes a first bid on commit

- **GIVEN** a signed-in collector with no linked card on an open listing
- **WHEN** they attempt to submit a valid maximum
- **THEN** Grade10 does not accept the bid
- **AND** it does not create an authorization
- **AND** link-card setup remains available under bid-panel-enrollment

#### Scenario: grade10-site-auction-bid-payment-method-SC-02 - Linked method authorizes the maximum on commit
**Serves:** grade10-site-auction-bid-payment-method-US-01 - Collector authorizes a first bid on commit

- **GIVEN** a collector with a linked method who submits a valid maximum on a listing
- **WHEN** the provider confirms authorization for that maximum
- **THEN** Grade10 creates an authorization for that maximum in minor units and the listing currency
- **AND** it associates the provider payment reference with the collector, listing, and bid
- **AND** it accepts the bid only after the authorization is confirmed
- **AND** it does not open a payment-method or confirmation modal for that authorize step

#### Scenario: grade10-site-auction-bid-payment-method-SC-03 - Payment authentication stays on the bid surface
**Serves:** grade10-site-auction-bid-payment-method-US-01 - Collector authorizes a first bid on commit

- **GIVEN** a collector is authorizing a maximum on commit
- **WHEN** the provider requires authentication or reports that authorization is pending
- **THEN** the listing bid surface shows that provider challenge or a pending state on or near the bid action
- **AND** Grade10 does not show the bid as accepted until authorization is confirmed
- **AND** Grade10 does not open the enrollment setup modal for that pending state

#### Scenario: grade10-site-auction-bid-payment-method-SC-04 - A refused authorization does not place a bid
**Serves:** grade10-site-auction-bid-payment-method-US-01 - Collector authorizes a first bid on commit

- **GIVEN** a collector is authorizing a maximum on commit
- **WHEN** the provider declines the method or authorization, or the linked method is unusable
- **THEN** the listing bid surface shows: Your card could not be authorized. Try another card.
- **AND** Grade10 records no accepted bid and no active authorization for that attempt
- **AND** the collector may change card under bid-panel-enrollment before the first bid on that listing

#### Scenario: grade10-site-auction-bid-payment-method-SC-09 - Provider failure on commit does not place a bid
**Serves:** grade10-site-auction-bid-payment-method-US-01 - Collector authorizes a first bid on commit

- **GIVEN** a collector is authorizing a maximum on commit
- **WHEN** Stripe or Grade10 cannot complete the authorize call (timeout, provider error, or cancelled intent)
- **THEN** the listing bid surface shows: Your bid did not go through. The card was not authorized.
- **AND** Grade10 records no accepted bid and no active authorization for that attempt

#### Scenario: grade10-site-auction-bid-payment-method-SC-05 - A later bid retains the listing's payment method
**Serves:** grade10-site-auction-bid-payment-method-US-02 - Collector raises a bid on the same card

- **GIVEN** a collector has an active authorization for a listing
- **WHEN** they submit a higher valid bid or maximum for that listing
- **THEN** Grade10 uses the method already associated with that collector and listing
- **AND** it does not open a payment-method step

#### Scenario: grade10-site-auction-bid-payment-method-SC-10 - Linked method carries over to a new listing
**Serves:** grade10-site-auction-bid-payment-method-US-01 - Collector authorizes a first bid on commit

- **GIVEN** a collector who linked a method on a prior listing and has not bid on a new open listing
- **WHEN** they submit a valid maximum on the new listing
- **THEN** Grade10 starts authorization with that linked method
- **AND** it does not require a new method selection solely because the listing is different

### Requirement: A listing authorization covers the committed maximum

For a collector and listing, Grade10 SHALL maintain at most one active
authorization. Its amount SHALL equal the collector's committed maximum: the
submitted bid when no automatic maximum applies, or the submitted automatic
maximum when one does. When a collector raises that maximum, Grade10 SHALL
raise the active authorization before accepting the raised bid. Grade10 SHALL
not lower an authorization by submitting a lower amount.

When a raise authorization fails because the provider declines, the method is
unusable, or an existing hold has expired before the raise can cover the new
maximum, Grade10 SHALL show: Your card could not be authorized. Try another
card. The prior maximum and active authorization SHALL remain unchanged.

Each authorization SHALL have one provider payment reference stored by
Grade10. A repeated request or a repeated provider outcome SHALL return the
already-recorded outcome and SHALL not create another active authorization,
accepted bid, or provider charge.

#### Scenario: grade10-site-auction-bid-payment-method-SC-06 - Raising a maximum raises the authorization
**Serves:** grade10-site-auction-bid-payment-method-US-02 - Collector raises a bid on the same card

- **GIVEN** a collector has an active authorization for a listing at one maximum
- **WHEN** they submit a higher valid maximum for that listing
- **THEN** Grade10 raises the existing authorization to the new maximum
- **AND** it accepts the raised bid only after the raised authorization is confirmed

#### Scenario: grade10-site-auction-bid-payment-method-SC-11 - Raise authorization failure keeps the prior maximum
**Serves:** grade10-site-auction-bid-payment-method-US-02 - Collector raises a bid on the same card

- **GIVEN** a collector has an active authorization for a listing at one maximum
- **WHEN** they submit a higher valid maximum and the raise authorization fails
  (decline, unusable method, or expired hold)
- **THEN** Grade10 refuses the raise
- **AND** the listing bid surface shows: Your card could not be authorized. Try another card.
- **AND** the prior maximum and active authorization remain unchanged

#### Scenario: grade10-site-auction-bid-payment-method-SC-08 - Provider outcomes remain idempotent
**Serves:** grade10-site-auction-bid-payment-method-US-03 - Collector is released when outbid

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

#### Scenario: grade10-site-auction-bid-payment-method-SC-07 - An outbid cancels the authorization
**Serves:** grade10-site-auction-bid-payment-method-US-03 - Collector is released when outbid

- **GIVEN** a collector has an active authorization for a listing
- **WHEN** Grade10 accepts a higher bid from another collector
- **THEN** Grade10 requests cancellation of the first collector's authorization
- **AND** it records the provider's cancellation outcome
- **AND** it does not capture money from the first collector

### Requirement: The bid panel discloses the buyer-premium rate

The listing bid panel SHALL show the buyer's premium rate as **20%** of the
winning bid before a collector submits a bid. The panel SHALL show the rate in
all supported auction currencies and SHALL not show a calculated premium amount,
an invoice total, or a premium line amount before an invoice exists.

#### Scenario: grade10-site-auction-bid-payment-method-SC-16 - Bid panel shows the premium rate
**Serves:** grade10-site-auction-bid-payment-method-US-04 - Collector understands the buyer-premium rate before bidding

- **GIVEN** a collector opens an active auction listing
- **WHEN** the bid panel is rendered
- **THEN** it shows that the buyer's premium rate is 20% of the winning bid
- **AND** it shows no calculated premium amount or invoice total

#### Scenario: grade10-site-auction-bid-payment-method-SC-17 - Premium rate is consistent across currencies
**Serves:** grade10-site-auction-bid-payment-method-US-04 - Collector understands the buyer-premium rate before bidding

- **GIVEN** a collector opens active listings in USD, HKD, and JPY
- **WHEN** they read each bid panel
- **THEN** each panel shows the buyer's premium rate as 20%
- **AND** no panel shows a currency-specific premium amount
