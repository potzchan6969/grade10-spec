# grade10-admin/auction/post-sale Specification

## Feature set

- Queue
  - Partial payment outcome: lets an operator distinguish a collection still in progress from a fully settled order
- Resolving an unpaid order
  - Partial collection: records more than one operator-entered payment against one invoice
  - Closing tolerance: lets the operator close a near-settled invoice or keep its real balance open, and refuses a close below the tolerance
- Audit trail
  - Payment receipts: gives each recorded payment its own auditable receipt

## ADDED Requirements

### Requirement: Operators can record an ordered partial-payment history

An operator with `payment-processing` SHALL be able to record more than one
operator-entered payment against one `pending`, `expired`, or `partially_paid`
invoice. Each payment SHALL include
amount, method, reference and proof, receive its own receipt number, and be
ordered oldest first. The cumulative amount SHALL determine the remaining
balance. While money remains due, including after the payment deadline, the
order outcome SHALL be Partially Paid. An exact cumulative match to the
original invoice total SHALL mark the invoice Paid without a prompt.
When cumulative payments reach 90% of the original invoice total, every later
payment that leaves money due SHALL require the operator to choose whether to
close the invoice as Paid or keep collecting.
When a payment would exceed the original invoice total, Grade10 SHALL require
the operator to confirm the overpayment before recording it and marking the
invoice Paid. The payment record SHALL keep the full amount; the excess SHALL
not become a separate adjustment line.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-fmz rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-140 - A partial payment starts collection
**Serves:** post-sale-US-12 - Operator collects a lot's price across more than one payment

- **GIVEN** an unpaid invoice with a 100000 minor-unit HKD balance
- **WHEN** the operator records a 40000 minor-unit payment with method, reference and proof
- **THEN** the payment is accepted with its own receipt number
- **AND** the order reads Partially Paid with 60000 minor units remaining

<!-- trace:scenario id=g10adm.auction-post-sale.SC-z26 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-141 - Repeated payments keep one order history
**Serves:** post-sale-US-12 - Operator collects a lot's price across more than one payment

- **GIVEN** a Partially Paid invoice with one recorded payment
- **WHEN** the operator records another payment smaller than the current balance
- **THEN** both payments remain in oldest-first order
- **AND** the order remains Partially Paid

<!-- trace:scenario id=g10adm.auction-post-sale.SC-u2w rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-143 - An overpayment needs confirmation before Paid
**Serves:** post-sale-US-12 - Operator collects a lot's price across more than one payment

- **GIVEN** cumulative payments of 90000 minor units against a 100000 minor-unit invoice
- **WHEN** the operator records a 15000 minor-unit payment
- **THEN** Grade10 asks the operator to confirm the overpayment before recording it
- **AND** after confirmation the full 15000-minor-unit payment is recorded and the invoice is Paid
- **AND** the excess is not recorded as a separate adjustment line

### Requirement: Closing tolerance is explicit and preserves payments

An invoice SHALL close as Paid by the operator's choice only once cumulative
payments, counting the payment being recorded, reach 90% of the original
invoice total; below 90%, updating the invoice to Paid SHALL be refused and
the invoice SHALL stay Partially Paid at the real remaining balance. When
cumulative payments reach 90% of the original invoice total, a new payment that
leaves money due SHALL require the operator to choose whether to close the
invoice as Paid or keep collecting, including when the invoice had expired, and
the choice SHALL be asked again on every later payment while cumulative payments
are still under 100%. Closing SHALL record no separate write-off entry; Remaining
Balance Due SHALL read zero. Keeping it open SHALL retain the real balance and
every payment. An exact balance payment SHALL close the invoice without a second
tolerance prompt. A payment SHALL never be discarded or silently rounded.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-k4t rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-142 - The closing prompt does not discard the payment
**Serves:** post-sale-US-12 - Operator collects a lot's price across more than one payment

- **GIVEN** cumulative payments of 90000 minor units against a 100000 minor-unit invoice
- **WHEN** the operator records 5000 minor units and chooses to keep the invoice open
- **THEN** the order remains Partially Paid with the real balance
- **AND** recording the exact 5000-minor-unit balance closes it as Paid without another prompt

<!-- trace:scenario id=g10adm.auction-post-sale.SC-9nm rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-144 - Paid is refused below the closing tolerance
**Serves:** post-sale-US-12 - Operator collects a lot's price across more than one payment

- **GIVEN** cumulative payments of 80000 minor units against a 100000 minor-unit invoice
- **WHEN** the operator records 5000 minor units and tries to update the invoice to Paid
- **THEN** the update is refused because 85000 minor units is below 90% of the invoice total
- **AND** the payment is recorded and the order reads Partially Paid with its real 15000-minor-unit balance
- **AND** a payment bringing the total to 90000 minor units or more offers the choice to close as Paid or keep collecting
