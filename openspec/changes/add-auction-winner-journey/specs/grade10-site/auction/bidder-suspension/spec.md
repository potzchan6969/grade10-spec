## Purpose

The auction-scoped suspension a missed payment deadline triggers: what it
stops a collector doing, what it must leave untouched, what becomes of the
bids they already have standing, and why only an operator lifts it.

## Feature set

- Trigger and notice
  - Deadline expiry: the one event that suspends an account, on any one of its expired invoices
  - Winner notice: what is owed and how to resolve it, so a suspension is never discovered by being refused
- Scope of the suspension
  - Auction-scoped only: bidding stops and nothing else does
  - Paying stays open: an account barred from bidding must still be able to settle what it owes
- Standing bids
  - Retraction on suspension: an account with a demonstrated default cannot go on winning lots
  - Re-resolution: the lot resolves to the next bidder at their own price, as a legitimate outcome
  - Won lots stand: a lot already won stays won and its invoice stays payable
- Reinstatement
  - Operator review only: neither paying nor a reissued invoice lifts a suspension
  - Account record: the state and its reason are visible to whoever decides

## ADDED Requirements

### Requirement: An elapsed payment deadline suspends the account

When an auction order's payment deadline passes with its invoice status still
`pending`, Grade10 SHALL suspend the winner's account from auction activity
and SHALL notify them of the expiry, the outstanding amount, and how to
resolve it.

Suspension SHALL trigger on **any one** expired invoice. A winner who is paid
up on one lot and expired on another SHALL be suspended.

Grade10 SHALL record the suspension's reason and the auction order that
caused it, and SHALL show both on the account record.

#### Scenario: suspension-SC-01 - An elapsed deadline suspends the account

- **GIVEN** an auction order whose invoice status is `pending`
- **WHEN** its payment deadline passes with no payment received
- **THEN** Grade10 suspends the winner's account from auction activity
- **AND** notifies them of the outstanding amount and how to resolve it
- **AND** records the reason and the causing auction order on the account record

#### Scenario: suspension-SC-02 - One expired lot suspends a winner paid up on another

- **GIVEN** a winner with two auction orders, one `paid` and one `pending`
- **WHEN** the `pending` order's deadline passes
- **THEN** Grade10 suspends the account
- **AND** the paid order is unaffected

### Requirement: Suspension is scoped to auction activity alone

A suspension SHALL stop and leave open exactly these capabilities.

| Capability | Suspended |
| --- | --- |
| Placing a new bid or committing a maximum | Yes |
| Standing bids on lots that have not closed | Yes — retracted |
| Paying an outstanding invoice | **No** — this SHALL remain available |
| Grade10 Store purchases | No |
| Grade10 Loyalty earning and redemption | No |
| Viewing the account, order history, and invoices | No |

A suspension SHALL NOT be a platform ban. It SHALL NOT prevent the account
signing in, and it SHALL NOT change anything `shared/auth/users` governs.

#### Scenario: suspension-SC-03 - A suspended account can still pay what it owes

- **GIVEN** a suspended account with an outstanding invoice
- **WHEN** the collector opens that invoice and pays it
- **THEN** Grade10 accepts the payment
- **AND** the invoice status becomes `paid`

#### Scenario: suspension-SC-04 - A suspended account still signs in and shops

- **GIVEN** a suspended account
- **WHEN** the collector signs in
- **THEN** Grade10 signs them in
- **AND** they can browse and buy in the Grade10 Store, earn and redeem
  loyalty, and read their own orders and invoices
- **AND** they cannot place a bid or commit a maximum

### Requirement: Suspension retracts every standing bid on an open lot

On suspension Grade10 SHALL retract every maximum the account has standing on
a lot that has not yet closed, and SHALL re-resolve each affected lot.

- Retraction SHALL apply to **every** open lot, with no value threshold and
  no partial application.
- Retraction SHALL NOT apply to a lot the account has already won. That lot
  stays won, and its invoice stays payable.
- On retraction, the auto-bidding engine SHALL re-resolve the lot normally:
  the next-highest bidder becomes leader at their own resolved price. That is
  a legitimate price outcome, not a correction.
- Grade10 SHALL log the retraction as a distinct `bid_retracted_suspension`
  event in the lot's bid history, and the resulting re-resolution as a normal
  bid resolution event.
- Outbid-to-leading notice SHALL fire as normal for the bidder who inherits
  the lead.
- Where a lot is in extended bidding when suspension triggers, retraction
  SHALL still apply, and retraction and re-resolution SHALL complete
  atomically so the lot cannot close part-way through.

Grade10 accepts that a seller may realise a lower hammer price on an affected
lot. That cost is accepted against the cost of a repeat default.

#### Scenario: suspension-SC-05 - Standing maxima on open lots are retracted

- **GIVEN** a collector leading two open lots and holding a standing maximum
  on a third
- **WHEN** their account is suspended
- **THEN** Grade10 retracts all three maxima
- **AND** logs each as a `bid_retracted_suspension` event in that lot's bid
  history

#### Scenario: suspension-SC-06 - A lot already won stays won

- **GIVEN** a suspended account that won a lot before the suspension
- **WHEN** the retraction runs
- **THEN** that lot is still won by the account
- **AND** its invoice is still payable

#### Scenario: suspension-SC-07 - The next bidder inherits at their own price

- **GIVEN** an open lot led by a suspended account, with a second bidder
  holding a lower maximum
- **WHEN** the suspended account's maximum is retracted
- **THEN** the second bidder becomes the leader at their own resolved price
- **AND** Grade10 records the re-resolution as a normal bid resolution
- **AND** notifies that bidder that they now lead

#### Scenario: suspension-SC-08 - Retraction during extended bidding is atomic

- **GIVEN** an open lot in extended bidding, led by an account being suspended
- **WHEN** the retraction and re-resolution run
- **THEN** they complete atomically
- **AND** the lot does not close part-way through the recalculation

### Requirement: Only an operator lifts a suspension

A suspension SHALL NOT lift itself. Grade10 SHALL lift one only on an
explicit operator action following review.

- Paying the outstanding invoice SHALL NOT lift the suspension. Settlement
  resolves the order; reinstatement resolves the account.
- Reissuing an invoice SHALL NOT lift the suspension. An operator may give a
  winner a fresh chance to settle one lot while the account stays barred from
  bidding on anything new.

Grade10 SHALL show the suspension state and its reason on the account record.

#### Scenario: suspension-SC-09 - Paying does not lift the suspension

- **GIVEN** a suspended account with one outstanding invoice
- **WHEN** the collector pays that invoice in full
- **THEN** the invoice status becomes `paid`
- **AND** the account is still suspended
- **AND** the account record still shows the suspension and its reason

#### Scenario: suspension-SC-10 - A reissue does not lift the suspension

- **GIVEN** a suspended account with an expired auction order
- **WHEN** an operator reissues that invoice with a new payment deadline
- **THEN** the account is still suspended
- **AND** the collector can pay the reissued invoice and still cannot bid

#### Scenario: suspension-SC-11 - An operator reinstates the account

- **GIVEN** a suspended account an operator has reviewed
- **WHEN** the operator reinstates it
- **THEN** the account can place bids and commit maxima again
- **AND** the account record retains the suspension and its reason as history
