## Feature set

- Records the winner keeps
  - Receipt payment breakdown: each receipt identifies the invoice total,
    prior payments, the current payment and remaining amount
  - Historical receipt values: issued receipts and later receipts' prior-payment
    values remain unchanged after a refund or reversal

## ADDED Requirements

### Requirement: Every receipt records its payment-time breakdown

Every payment receipt SHALL record the values for the payment it proves:

| Line | Value |
| --- | --- |
| Original Invoice Total | The total of the invoice the payment was made against |
| Previous Payments | The payments recorded against that invoice before this payment |
| Current Payment Received | The amount recorded for this payment |
| Remaining Balance Due | The amount still owed after this payment, floored at 0 once the invoice is Paid |

The four lines SHALL appear on receipts for a single full payment, ordered
partial payments, a payment that closes an invoice within the agreed tolerance,
and a confirmed overpayment. A tolerance-close or overpayment SHALL show
`Remaining Balance Due` as `0`; it SHALL NOT add a shortfall, write-off or
negative-credit line.

The values SHALL describe the invoice and payment state when the receipt was
issued. Grade10 SHALL NOT reissue a receipt or mutate an issued receipt after a
refund or reversal. A later receipt's `Previous Payments` value SHALL remain
the value recorded when that later receipt was issued.

This requirement governs receipt contents only. Winner Order's live balance and
its absence from the order page remain governed by
`add-winner-partial-payment`.

#### Scenario: winner-order-SC-204 - A full payment receipt shows zero previous and remaining
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an invoice total of 100000 minor units in HKD with one confirmed
  payment of 100000 minor units
- **WHEN** the winner opens that payment receipt
- **THEN** Original Invoice Total is 100000 minor units in HKD
- **AND** Previous Payments is 0
- **AND** Current Payment Received is 100000 minor units in HKD
- **AND** Remaining Balance Due is 0

#### Scenario: winner-order-SC-205 - Ordered partial receipts preserve the payment history
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an invoice total of 100000 minor units in HKD
- **AND** a first payment of 40000 minor units and a second payment of
  30000 minor units were recorded in that order
- **WHEN** the winner opens the receipt for each payment
- **THEN** the first receipt shows Original Invoice Total 100000,
  Previous Payments 0, Current Payment Received 40000 and Remaining Balance
  Due 60000, all in minor units of HKD
- **AND** the second receipt shows Original Invoice Total 100000,
  Previous Payments 40000, Current Payment Received 30000 and Remaining
  Balance Due 30000, all in minor units of HKD

#### Scenario: winner-order-SC-206 - A tolerance-close receipt floors the remaining balance at zero
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an invoice total of 100000 minor units in HKD
- **AND** 90000 minor units have already been paid
- **AND** the operator records a 5000-minor-unit payment and closes the invoice
  as Paid within the agreed closing tolerance
- **WHEN** the winner opens that payment receipt
- **THEN** Original Invoice Total is 100000 minor units in HKD
- **AND** Previous Payments is 90000 minor units in HKD
- **AND** Current Payment Received is 5000 minor units in HKD
- **AND** Remaining Balance Due is 0
- **AND** the receipt contains no shortfall or write-off line

#### Scenario: winner-order-SC-207 - A confirmed overpayment receipt records the full payment
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an invoice total of 100000 minor units in HKD
- **AND** the operator confirms a payment of 110000 minor units
- **WHEN** the winner opens that payment receipt
- **THEN** Original Invoice Total is 100000 minor units in HKD
- **AND** Previous Payments is 0
- **AND** Current Payment Received is 110000 minor units in HKD
- **AND** Remaining Balance Due is 0
- **AND** the receipt contains no negative balance or credit line

#### Scenario: winner-order-SC-208 - A refund or reversal does not rewrite issued receipts
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an invoice total of 100000 minor units in HKD
- **AND** payments of 20000, 30000 and 10000 minor units were recorded in that
  order, with a receipt issued for each
- **AND** the second payment is later refunded or reversed
- **WHEN** the winner opens the three receipts
- **THEN** the first receipt still shows Previous Payments 0,
  Current Payment Received 20000 and Remaining Balance Due 80000
- **AND** the second receipt still shows Previous Payments 20000,
  Current Payment Received 30000 and Remaining Balance Due 50000
- **AND** the third receipt still shows Previous Payments 50000,
  Current Payment Received 10000 and Remaining Balance Due 40000
- **AND** no issued receipt is reissued
