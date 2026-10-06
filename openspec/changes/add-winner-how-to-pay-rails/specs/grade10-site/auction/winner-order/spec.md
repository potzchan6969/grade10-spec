# grade10-site/auction/winner-order Specification

## Feature set

- Bank transfer
  - View Bank Details: Order summary secondary control opens a dialog with amount due (no Copy) and three pill tabs defaulting to FPS; each tab shows that rail’s fields then payment reference as a detail row (no Copy) with memo warning — FPS (ID, account name, QR), HK Local (bank name, bank code, branch code, full account number including bank and branch code), SWIFT (beneficiary name, beneficiary address, bank name, bank address, SWIFT/BIC, full account number or IBAN, then payment reference, then OUR charges note)
  - Two entry points: Submit Payment Proof opens the proof dialog; View Bank Details opens the rails dialog; both hide when Pay is hidden
  - Payment proof: one upload of 1 to 3 files (1 required) in Submit Payment Proof, behind a confirm step; proof fields and upload only (no amount or reference chrome)
  - Payment Verifying: the deadline stops, Submit Payment Proof, View Bank Details and further uploads are hidden
  - Proof not accepted: the latest reason the winner reads, and the deadline running again with the time that was left

## MODIFIED Requirements

### Requirement: A bank transfer invoice shows how to pay

A pending bank transfer invoice tells the winner where to send the money and
what reference to quote.

**Two entry points** - While an invoice sent for bank transfer is `pending`,
Winner Order's order summary SHALL offer **Submit Payment Proof** as the
primary control and **View Bank Details** as a secondary control immediately under
it. **View Bank Details** SHALL open the View Bank Details dialog. **Submit Payment
Proof** SHALL open the Submit Payment Proof dialog. Grade10 SHALL hide both
controls whenever Pay is hidden, including while the invoice is `payment_verifying`.

**View Bank Details** - The View Bank Details dialog SHALL show the total amount due
and three tabs with FPS selected by default. Each tab SHALL show that rail’s
fields as labelled detail rows without copy controls, then the invoice's bank
reference as a labelled detail row without a copy control, and a warning that
the winner must enter the reference in the bank app's memo or remarks field.
Live account details and the FPS QR come from Finance-owned configuration.
Grade10 snapshots those approved instructions on the issued bank-transfer
invoice; the preview uses Grade10 Finance Limited and HSBC Hong Kong samples.

| Way to pay | Details shown |
| --- | --- |
| FPS (default) | FPS ID, account name, scannable FPS QR |
| Hong Kong local bank transfer | Bank name, bank code, branch code, full account number including bank and branch code |
| SWIFT (International) | Beneficiary name, beneficiary address, bank name, bank address (main branch address, city, country), SWIFT/BIC, full account number or IBAN; after the payment reference, a note to choose OUR for transfer fees so Grade10 receives the full order total |

**Submit Payment Proof** - Submit Payment Proof SHALL be a separate dialog
titled Submit Payment Proof. It SHALL NOT show amount due, transfer reference,
or the three rail tabs. Proof upload rules stay under "The winner uploads
payment proof once".

**No card Pay** - Grade10 SHALL offer no card Pay control on a bank transfer
invoice and SHALL refuse a card payment attempted against one. A winner who
wants to pay by card asks Grade10, and an operator reissues the invoice.

<!-- trace:scenario id=g10.auction-winner-order.SC-bmm rev=1 -->
#### Scenario: winner-order-SC-95 - A bank transfer invoice shows three ways and the reference
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose invoice was sent for bank transfer and is `pending`
- **WHEN** the winner opens View Bank Details
- **THEN** FPS, Hong Kong local bank transfer and SWIFT details are available as tabs with the fields above
- **AND** the bank reference is shown at the bottom of the selected tab
- **AND** no card Pay control is offered

<!-- trace:scenario id=g10.auction-winner-order.SC-dvp rev=1 -->
#### Scenario: winner-order-SC-96 - A card payment on a bank transfer invoice is refused
**Serves:** Bank transfer - card Pay is not offered on a bank transfer invoice

- **GIVEN** an auction order whose invoice was sent for bank transfer and is `pending`
- **WHEN** a card payment is attempted for that invoice
- **THEN** Grade10 refuses it
- **AND** the invoice is still `pending`

<!-- trace:scenario id=g10.auction-winner-order.SC-zbt rev=1 -->
#### Scenario: winner-order-SC-180 - Order summary offers Submit Payment Proof and View Bank Details
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose invoice was sent for bank transfer and is `pending`
- **WHEN** the winner opens Winner Order
- **THEN** Order summary shows Submit Payment Proof
- **AND** View Bank Details sits under it
- **AND** View Bank Details opens the View Bank Details dialog
- **AND** Submit Payment Proof opens the Submit Payment Proof dialog

<!-- trace:scenario id=g10.auction-winner-order.SC-zx9 rev=1 -->
#### Scenario: winner-order-SC-181 - View Bank Details opens on FPS
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose invoice was sent for bank transfer and is `pending`
- **WHEN** the winner opens View Bank Details
- **THEN** the FPS tab is selected
- **AND** FPS ID, account name and an FPS QR are shown

<!-- trace:scenario id=g10.auction-winner-order.SC-tf6 rev=1 -->
#### Scenario: winner-order-SC-182 - HK Local tab shows branch code
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** the View Bank Details dialog is open
- **WHEN** the winner selects HK Local
- **THEN** bank name, bank code, branch code and the full account number including bank and branch code are shown

<!-- trace:scenario id=g10.auction-winner-order.SC-oii rev=1 -->
#### Scenario: winner-order-SC-183 - SWIFT tab shows OUR note after payment reference
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** the View Bank Details dialog is open
- **WHEN** the winner selects International (SWIFT)
- **THEN** beneficiary name, beneficiary address, bank name, bank address, SWIFT/BIC and the full account number or IBAN are shown
- **AND** the payment reference and memo warning are shown
- **AND** a note after the payment reference tells the winner to choose OUR for transfer fees so Grade10 receives the full order total

<!-- trace:scenario id=g10.auction-winner-order.SC-fm9 rev=1 -->
#### Scenario: winner-order-SC-184 - Submit Payment Proof is proof-only
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose invoice was sent for bank transfer and is `pending`
- **WHEN** the winner opens Submit Payment Proof from Order summary
- **THEN** the dialog title is Submit Payment Proof
- **AND** amount due and transfer reference are not shown
- **AND** no FPS, HK Local or SWIFT tab is shown
