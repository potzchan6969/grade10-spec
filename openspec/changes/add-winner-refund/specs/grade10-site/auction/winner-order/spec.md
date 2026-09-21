## Feature set

- Records the winner keeps
  - Refunded order: shows the terminal outcome while retaining invoices and receipts

## ADDED Requirements

### Requirement: Winner Order renders a refunded order as a retained record

When an order is Refunded, Winner Order SHALL show Refunded as the order and
invoice status, the invoice and receipts already issued, and no stepper, Pay,
address form or other self-service action. The page SHALL show the refund
reason, note and Transfer to destination in the details dialog. Each detail is
a label above its value. Transfer to SHALL use `PaymentMethodCard`. A card
refund SHALL show the brand logo and only the last four digits. A bank refund
SHALL show a bank icon, the bank name and only the last four digits of the
account, as `Bank name, ···· ####`.
The page SHALL not show operator proof, the full provider reference, a full
card number, or a full account number.

#### Scenario: winner-order-SC-157 - A refunded order keeps its documents
**Serves:** winner-order-US-14 - seeing a refunded order after full or partial payment

- **GIVEN** a refunded order that had one partial payment and an invoice
- **WHEN** the winner opens Winner Order
- **THEN** the order and invoice read Refunded
- **AND** the invoice and payment receipt remain downloadable
- **AND** no Pay, address form or stepper appears
- **AND** the refund details show Transfer to with the card payment marks or bank destination

### Requirement: Winner Order shows an overpayment without closing the order

When an overpayment is returned, Winner Order SHALL show only the returned
difference below Order Total. It SHALL keep the order's existing status and
the invoice lines unchanged, and SHALL offer the refund details without
showing the operator's proof or full provider reference.

#### Scenario: winner-order-SC-155 - An overpayment keeps the order open
**Serves:** winner-order-US-15 - seeing an overpayment returned without closing the sale

- **GIVEN** an order whose recorded payment exceeds its invoice total and the
  difference has been returned
- **WHEN** the winner opens Winner Order
- **THEN** the order status and invoice lines are unchanged
- **AND** the returned difference appears below Order Total
- **AND** the winner can open the refund details

#### Scenario: winner-order-SC-172 - Refund details show statement-recognition clues
**Serves:** winner-order-US-14 - seeing a refunded order after full or partial payment

- **GIVEN** a refunded order with a card refund and a refund detail record
- **WHEN** the winner opens the refund details
- **THEN** Transfer to shows the card brand logo and only the last four digits
- **AND** the full card number, provider reference and proof are not shown

#### Scenario: winner-order-SC-173 - Bank Transfer to shows bank name and last four
**Serves:** winner-order-US-14 - seeing a refunded order after full or partial payment

- **GIVEN** a refunded order with a bank transfer refund and a refund detail record
- **WHEN** the winner opens the refund details
- **THEN** Transfer to shows a bank icon, the bank name and only the last four digits of the account
- **AND** the full account number, provider reference and proof are not shown
