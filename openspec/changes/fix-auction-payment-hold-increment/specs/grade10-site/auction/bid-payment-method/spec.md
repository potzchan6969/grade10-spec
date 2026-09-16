## Feature set

- Raised authorization
  - Existing hold increment: raises one active authorization to the new committed maximum.
  - Provider eligibility: asks for incremental and extended authorization when the payment method supports them.
- Refusal resolution
  - Terminal raise outcome: resolves a refused raise without changing the prior accepted commitment.
  - Pending cleanup: prevents a completed provider refusal from leaving a bid that blocks the next action.

## MODIFIED Requirements

The following authorization and raise rules apply when bid-time authorization
holds are enabled. The standard auction path leaves this optional feature off.

### Requirement: A listing authorization covers the committed maximum

For a collector and listing, Grade10 SHALL maintain at most one active
authorization. Its amount SHALL equal the collector's committed maximum: the
submitted bid when no automatic maximum applies, or the submitted automatic
maximum when one does. When a collector raises that maximum, Grade10 SHALL
raise the active authorization before accepting the raised bid. A supported
raise SHALL use the existing authorization and provider payment reference;
Grade10 SHALL NOT cancel and recreate it or lower an authorization by
submitting a lower amount.

When a raise authorization fails because the provider declines, the method is
unusable, an existing hold has expired before the raise can cover the new
maximum, or the provider cannot increment the existing authorization, Grade10
SHALL show: Your card could not be authorized. Try another card. The prior
maximum and active authorization SHALL remain unchanged, and the attempted
raise SHALL resolve instead of remaining pending.

Each authorization SHALL have one provider payment reference stored by
Grade10. A repeated request or a repeated provider outcome SHALL return the
already-recorded outcome and SHALL not create another active authorization,
accepted bid, or provider charge.

#### Scenario: grade10-site-auction-bid-payment-method-SC-06 - Raising a maximum raises the authorization
**Serves:** grade10-site-auction-bid-payment-method-US-02 - Collector raises a bid on the same card

- **GIVEN** a collector has an active authorization for a listing at one maximum
- **WHEN** they submit a higher valid maximum for that listing
- **THEN** Grade10 raises the existing authorization to the new maximum
- **AND** it retains the existing provider payment reference
- **AND** it accepts the raised bid only after the raised authorization is confirmed

#### Scenario: grade10-site-auction-bid-payment-method-SC-11 - Raise authorization failure keeps the prior maximum
**Serves:** grade10-site-auction-bid-payment-method-US-02 - Collector raises a bid on the same card

- **GIVEN** a collector has an active authorization for a listing at one maximum
- **WHEN** they submit a higher valid maximum and the raise authorization fails
  (decline, unusable method, expired hold, or an unsupported increment)
- **THEN** Grade10 refuses the raise
- **AND** the listing bid surface shows: Your card could not be authorized. Try another card.
- **AND** the prior maximum and active authorization remain unchanged
- **AND** the attempted raise is no longer pending

#### Scenario: grade10-site-auction-bid-payment-method-SC-08 - Provider outcomes remain idempotent
**Serves:** grade10-site-auction-bid-payment-method-US-03 - Collector is released when outbid

- **GIVEN** Grade10 has begun an authorization for a collector and listing
- **WHEN** the bid request or its provider outcome is delivered again
- **THEN** Grade10 returns the recorded outcome
- **AND** exactly one active authorization and accepted bid outcome exist for that request

## ADDED Requirements

### Requirement: A hold requests eligible authorization capabilities

When Grade10 creates a manual-capture authorization for a committed maximum,
it SHALL request incremental authorization and an extended authorization
window when available from the provider and the payment method. The request
SHALL be intended to support an authorization window of at least fourteen
days after the scheduled close when the provider offers that eligibility. The
provider's returned capture deadline SHALL remain authoritative for expiry and
reauthorization; Grade10 SHALL NOT represent a shorter or unavailable window
as a fourteen-day guarantee.

#### Scenario: grade10-site-auction-bid-payment-method-SC-14 - An eligible hold requests an extended window
**Serves:** Raised authorization - an eligible hold requests an extended window

- **GIVEN** a collector with a linked method submits a valid maximum
- **WHEN** the provider creates the manual-capture authorization
- **THEN** Grade10 requests incremental authorization and an extended authorization window when available
- **AND** it records the provider's returned capture deadline for the authorization lifecycle
- **AND** it does not treat an unavailable or shorter provider deadline as a fourteen-day guarantee

### Requirement: A provider refusal resolves the attempted raise

When a provider refuses to increment an existing authorization because its
PaymentIntent is in an unexpected or otherwise unsupported state, Grade10
SHALL treat the result as a card authorization refusal rather than an
uncategorized provider fault. It SHALL mark the attempted raise and its
replacement hold as failed, leave the prior accepted bid and active
authorization unchanged, and expose the existing refusal copy on the bid
surface. A later bid attempt SHALL not be blocked by the completed refusal.

#### Scenario: grade10-site-auction-bid-payment-method-SC-15 - An unsupported increment does not leave a pending bid
**Serves:** grade10-site-auction-bid-payment-method-US-02 - Collector raises a bid on the same card

- **GIVEN** a collector has an active authorization and submits a higher maximum
- **WHEN** the provider refuses the increment because the existing authorization is in an unexpected state
- **THEN** Grade10 refuses the raised bid with: Your card could not be authorized. Try another card.
- **AND** the prior maximum and active authorization remain unchanged
- **AND** the attempted raise is recorded as failed rather than pending
- **AND** a later bid attempt is not blocked by a pending-confirmation message from that refusal
