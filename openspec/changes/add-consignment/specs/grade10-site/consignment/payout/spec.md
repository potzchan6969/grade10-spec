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
