# grade10-site/consignment/payout Specification

## Purpose

The money behind a consignment: the incentive paid at consignment, the
commission and fees pinned to its agreement, the settlement statement and
commission invoice a sale issues, and the payout the consignor receives.

When the consignment itself moves is `grade10-site/consignment/lifecycle`;
who records the money is `grade10-admin/consignment/console`.

## Feature set

- The incentive
  - Paid at consignment: a share of the item's estimated value - the card's
    value from its last-sold average - paid instantly to the consignor
  - Against the payout: whether the paid incentive is set against the
    sale's payout is unsettled
- Commission and fees
  - Pinned at the agreement: the schedule in force when the agreement is
    prepared is the consignment's
  - The intended figures: a consignment fee intended at 10-12% of the sale
    price at sale, and the incentive intended at 5% of the estimated
    value; the exact figures are unset
  - Outside the schedule: a negotiated commission only on an approver's act
- The sale's paper
  - A settlement statement: issued at sale, naming what the consignor is
    paid
  - A commission invoice: issued at sale, naming the fee
  - Contact details: the paper carries how payment questions reach the
    house
- The payout
  - What is paid: the listed price less commission and fees; at auction the
    hammer price less them, the buyer's premium being the house's
  - When: after the return window by default; at the sale, or one monthly
    statement, where the setting runs
  - The flow: unsettled - a bank transfer directly, a payout the consignor
    requests and a bank transfer follows, or credits or points
  - Recorded: a treasurer records the bank transfer and its reference; a
    correction takes a second holder of the grant
- Refunds
  - Inside the window: reverses the sale, and the item goes back on sale
    for the rest of its term
  - After payout: set against the next payout by default, and the item
    comes back to the consignor with the choices
  - The buyer keeps it: a refund where the buyer keeps the card is the
    house's

## ADDED Requirements

### Requirement: The incentive is owed from the seal and recorded once

Once a consignment's agreement seals it SHALL owe the incentive: each
item's market value times the incentive's pinned rate, to the minor unit,
summed. The due list SHALL show it due on the day the agreement sealed. A
holder of the payout grant SHALL record it once, at exactly the amount
owed, with a reference the bank or the till shows and a value date on or
after the seal and not in the future. A consignment not yet sealed, or
whose pinned schedule set no incentive, SHALL owe none.

#### Scenario: grade10-site-consignment-payout-SC-01 - The incentive is owed from the seal
**Serves:** grade10-site-consignment-payout-US-01 - the consignor is paid the incentive at consignment

- **GIVEN** two cards at market values of HKD 4,000.00 and HKD 1,234.56 under a 5% incentive, sealed 13 days ago
- **WHEN** the treasurer reads the due list
- **THEN** it shows HKD 261.73 owed, due the day the agreement sealed

#### Scenario: grade10-site-consignment-payout-SC-02 - The incentive is recorded once at the amount owed
**Serves:** grade10-site-consignment-payout-US-01 - the incentive is paid once

- **GIVEN** a sealed consignment owing HKD 261.73
- **WHEN** the treasurer records HKD 260.00, then HKD 261.73, then HKD 261.73 again
- **THEN** the first is refused as not the amount owed, the second is recorded, the third is refused as already paid, and the due list no longer shows it

#### Scenario: grade10-site-consignment-payout-SC-03 - Nothing is owed before the seal
**Serves:** grade10-site-consignment-payout-US-01 - the incentive follows the signature

- **GIVEN** a consignment whose agreement has not sealed
- **WHEN** the treasurer reads the due list or records the incentive
- **THEN** none is listed and recording it is refused as not signed

### Requirement: The incentive is never set against a payout

The incentive SHALL NOT be taken off a sale's payout: a payout SHALL be the
listed price, or the hammer price, less commission and fees, whether or not
the incentive was paid.

#### Scenario: grade10-site-consignment-payout-SC-04 - A sale's payout ignores the incentive
**Serves:** grade10-site-consignment-payout-US-02 - the consignor is paid the payout after the window

- **GIVEN** a consignment owing an incentive and no sale
- **WHEN** the treasurer reads the due list
- **THEN** the incentive is listed on its own and no payout row is due
