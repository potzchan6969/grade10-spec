## Feature set

- Records the winner keeps
  - Shipping tracker: while fulfilment is `fulfilled` (Shipped and Delivered), Order Progress shows the tracking number as an external carrier link; no Track shipment button and no carrier name in that chrome

## MODIFIED Requirements

### Requirement: Records the winner keeps

Each auction order SHALL carry these records, retrievable by the winner for
the life of their account. Grade10 SHALL archive every invoice PDF, replaced
invoices included, and every receipt PDF, and SHALL keep each retrievable for
at least 7 years, or for the life of the account if longer. Deleting the
account SHALL NOT shorten the 7 years.

| Record | When | Contents |
| --- | --- | --- |
| Payment receipt | Payment confirmed, by any route | A receipt ID, then itemised: winning bid, buyer's premium, Shipping & Handling, insurance when added, any tax amount, the subtotal, the payment processing fee, the order total, the invoice ID, the payment method, and the breakdown below |
| Shipping tracker | Fulfilment status is `fulfilled` (Shipped and Delivered) | On Winner Order, the tracking number as an external link to the carrier tracking page; no separate Track shipment control and no carrier name in Order Progress |
| Delivery proof | `delivery_confirmed` is set | Whatever the carrier provided — handover timestamp, signature, proof-of-delivery image |

Every receipt SHALL carry a receipt ID, unique across all receipts:
`REC-[YYYYMM]-[LISTING_ID]-[SEQ]-P[INDEX]`, for example
`REC-202609-LK7P2Q-01-P1`. `[LISTING_ID]` and `[SEQ]` are the paid invoice's.
`[YYYYMM]` is the year and month the payment was confirmed, in Hong Kong time.
`[INDEX]` counts the payments on the invoice; an invoice takes one payment, so
every receipt ends `-P1`.

Every receipt SHALL show this breakdown:

| Line | Value |
| --- | --- |
| Original Invoice Total | The paid invoice's order total |
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

This requirement governs receipt contents only. Winner Order's live balance
and its absence from the order page remain governed by the partial-payment
capability.

The receipt SHALL name the payment method:

| Route | Method shown |
| --- | --- |
| Card, paid by the winner | Card, with its brand and last four digits |
| Bank transfer, proof confirmed by an operator | Bank transfer |
| Recorded by an operator | Bank transfer, cash, or the description the operator gave for another method, with the external reference where one was recorded |

A receipt for a confirmed bank transfer SHALL NOT be marked as manually
settled. A receipt for a manually settled order SHALL be marked as manually settled,
SHALL be visually distinguishable from a card-settled receipt, and SHALL
record the amount settled, the payment method, the external reference, and a
pointer to any invoice it supersedes. No proof file, the winner's or an
operator's, SHALL appear on the receipt.

<!-- trace:scenario id=g10.auction-winner-order.SC-49p rev=1 -->
#### Scenario: winner-order-SC-18 - A receipt is itemised and stays retrievable
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order paid at an order total of 316000 minor units in HKD
- **WHEN** the winner opens the order a year later
- **THEN** the receipt shows the winning bid, buyer's premium, Shipping &
  Handling, insurance, any tax amount supplied by the separate tax capability,
  the subtotal, the payment processing fee, and the order total

<!-- trace:scenario id=g10.auction-winner-order.SC-9qq rev=1 -->
#### Scenario: winner-order-SC-19 - A manually settled receipt says so
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order an operator settled by bank transfer with an
  external reference, after reissuing and replacing an earlier invoice
- **WHEN** the winner opens the receipt
- **THEN** it is marked as manually settled and is distinguishable from a
  card-settled receipt
- **AND** it records the amount settled, which includes the payment processing
  fee, bank transfer as the method, the external reference, and the invoice it
  supersedes
- **AND** it shows no proof file

<!-- trace:scenario id=g10.auction-winner-order.SC-0wc rev=1 -->
#### Scenario: winner-order-SC-20 - The tracker appears once the lot is dispatched
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose fulfilment status has just become
  `fulfilled` with a tracking number attached
- **WHEN** the winner opens the order
- **THEN** Order Progress shows the tracking number as a link to the carrier
  tracking page
- **AND** it shows no separate Track shipment control and no carrier name in
  Order Progress

#### Scenario: winner-order-SC-221 - The tracker remains after delivery is confirmed
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order that is `fulfilled` with a tracking number, and
  `delivery_confirmed` is set
- **WHEN** the winner opens the order
- **THEN** Order Progress still shows the tracking number as a link to the
  carrier tracking page

<!-- trace:scenario id=g10.auction-winner-order.SC-8xb rev=1 -->
#### Scenario: winner-order-SC-21 - Delivery proof records what the carrier provided
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** a dispatched auction order for which the carrier reports delivery
  with a handover timestamp and a signature
- **WHEN** `delivery_confirmed` is set
- **THEN** the order records that timestamp and that signature
- **AND** does not reduce them to a bare confirmation flag

<!-- trace:scenario id=g10.auction-winner-order.SC-g94 rev=1 -->
#### Scenario: winner-order-SC-36 - A card receipt names the card
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order the winner paid by a Visa card ending 4242
- **WHEN** the winner opens the receipt
- **THEN** the payment method reads as a Visa card ending 4242

<!-- trace:scenario id=g10.auction-winner-order.SC-f2w rev=1 -->
#### Scenario: winner-order-SC-112 - Every receipt carries a receipt ID
**Serves:** Records the winner keeps - receipt ID and breakdown

- **GIVEN** one order paid by card, one confirmed from bank transfer proof, and one settled manually
- **WHEN** the winner opens each receipt
- **THEN** each carries a receipt ID ending `-P1`
- **AND** each names its invoice ID

<!-- trace:scenario id=g10.auction-winner-order.SC-vxf rev=1 -->
#### Scenario: winner-order-SC-113 - A confirmed bank transfer receipt names bank transfer
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose bank transfer proof an operator confirmed at an order total of 317000 minor units in HKD
- **WHEN** the winner opens the receipt
- **THEN** the payment method reads Bank transfer and the amount paid is 317000 minor units in HKD
- **AND** it is not marked as manually settled
- **AND** it shows no proof file and no file name

<!-- trace:scenario id=g10.auction-winner-order.SC-kiz rev=1 -->
#### Scenario: winner-order-SC-131 - A receipt ID takes the paid invoice and the payment month
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an order whose bank transfer invoice `INV-202609-LK7P2Q-02` has an order total of 317000 minor units in HKD
- **WHEN** an operator confirms its proof at 2026-09-30T16:30:00Z, which is 1 October in Hong Kong, and the winner opens the receipt
- **THEN** the receipt ID is `REC-202610-LK7P2Q-02-P1`
- **AND** it shows Original Invoice Total 317000, Previous Payments 0, Current Payment Received 317000 and Remaining Balance Due 0, in minor units of HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-e8v rev=1 -->
#### Scenario: winner-order-SC-132 - Two receipts never share an ID
**Serves:** Records the winner keeps - receipt ID and breakdown

- **GIVEN** two paid orders on different listings
- **WHEN** the winner opens both receipts
- **THEN** the two receipt IDs differ

<!-- trace:scenario id=g10.auction-winner-order.SC-pvg rev=1 -->
#### Scenario: winner-order-SC-135 - A repeated confirmation keeps one receipt ID
**Serves:** Records the winner keeps - receipt ID and breakdown

- **GIVEN** an auction order whose receipt ID is `REC-202609-LK7P2Q-01-P1`
- **WHEN** the payment confirmation is delivered again
- **THEN** the receipt ID is still `REC-202609-LK7P2Q-01-P1`
- **AND** no other receipt ID and no other internal audit number is issued

<!-- trace:scenario id=g10.auction-winner-order.SC-xqw rev=1 -->
#### Scenario: winner-order-SC-133 - Invoice and receipt PDFs outlive a deleted account
**Serves:** Records the winner keeps - retention

- **GIVEN** a paid order with a replaced invoice, its current invoice and a receipt, whose winner deleted their account a year after payment
- **WHEN** Grade10 retrieves the order's documents 6 years after payment
- **THEN** the replaced invoice PDF, the current invoice PDF and the receipt PDF are all returned

