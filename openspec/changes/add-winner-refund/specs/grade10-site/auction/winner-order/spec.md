## Feature set

- Records the winner keeps
  - Refunded order: shows the terminal outcome while retaining invoices and receipts
  - Refund details: Amount, Transfer to and Reason; Reference for a bank refund; Note only when the operator recorded one

## ADDED Requirements

### Requirement: Winner Order renders a refunded order as a retained record

When an order is Refunded, Winner Order SHALL show Refunded as the order and
invoice status, the invoice and receipts already issued, and no stepper, Pay,
address form or other self-service action. The page SHALL show the refund
details in a dialog that stacks, each a label above its value: Amount, then
Transfer to, then Reference when the refund is a bank transfer, then Reason,
then Note when the operator recorded one. Transfer to SHALL use `PaymentMethodCard`. A card refund SHALL show
the brand logo and only the last four digits, and SHALL not show a provider
reference. A bank refund SHALL show a bank icon, the masked destination on the
primary line, and the free-text bank name as secondary text under it, and SHALL
show the operator's bank provider reference as Reference. The page SHALL omit
Note when the operator left none. The page SHALL not show operator proof, a
Stripe provider reference, a full card number, or a full account number.

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
showing the operator's proof or a Stripe provider reference.

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

- **GIVEN** a refunded order with a card refund, a refund detail record and an operator note
- **WHEN** the winner opens the refund details
- **THEN** the details show Amount, then Transfer to, then Reason, then Note
- **AND** Transfer to shows the card brand logo and only the last four digits
- **AND** Reference is not shown
- **AND** the full card number, Stripe provider reference and proof are not shown

#### Scenario: winner-order-SC-173 - Bank refund details show destination and reference
**Serves:** winner-order-US-16 - matching a bank refund against their own statement

- **GIVEN** a refunded order with a bank transfer refund and a refund detail record with no operator note
- **WHEN** the winner opens the refund details
- **THEN** the details show Amount, then Transfer to, then Reference, then Reason
- **AND** Transfer to shows a bank icon, the masked destination on the primary line, and the free-text bank name as secondary text under it
- **AND** Reference shows the operator's bank provider reference
- **AND** Note is not shown
- **AND** the full account number and proof are not shown