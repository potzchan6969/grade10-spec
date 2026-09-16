## Feature set

- Post-close letters
  - Address first: the auction-won letter asks for a delivery address, names
    the address deadline (`Confirm by …`), and names no amount, since none is
    owed yet; address-reminder drafts name the same deadline
  - Invoice sent: after address confirm and operator send — invoice total,
    payment deadline (`Pay by …`), CTA to Winner Order (sign-in first when
    signed out); never attaches the invoice PDF; does not name a payment method
  - Payment received: confirms payment with amount, payment date, and method
    (card brand and masked number, or bank transfer with bank and masked
    account); CTA to Winner Order for the receipt; never attaches the receipt
    PDF
  - Shipped: delivery address first, then carrier and tracking number with
    shipped time; primary CTA is the carrier track-and-trace link; secondary
    CTA opens Winner Order (both on one row)
  - Expiry letter: fires when Grade10 writes `expired` on the invoice at its
    deadline
  - Letter destination: default CTA opens that lot's Winner Order; lot image
    and lot title always open Winner Order; shipped letter uses
    track-and-trace as primary and Winner Order as secondary

## MODIFIED Requirements

### Requirement: Post-close letters

Grade10 SHALL send a winner these letters. Each SHALL be sent to the
collector's registered account email and SHALL follow the letter shape
`grade10-site/auction/notifications` defines.

| Letter | Trigger | Channel |
| --- | --- | --- |
| Auction won | The lot closes and the winner is determined. Asks for a delivery address and names the address deadline | Email |
| Invoice sent | An operator sends the invoice. Names the invoice total and the payment deadline | Email |
| Payment reminder | Day 3 after the current invoice is issued while invoice status is `pending` | Email |
| Payment reminder | Day 6 after the current invoice is issued while invoice status is `pending` | Email |
| Final notice | On day 7, immediately before the payment-deadline expiry transition, while invoice status is `pending` | Email |
| Invoice expired | Grade10 sets the invoice to `expired` at its payment deadline | Email |
| Invoice reissued | An operator reissues an invoice, on a re-quote or after expiry | Email |
| Payment received | Payment is confirmed, or an operator commits a manual settlement | Email |
| Shipped | Fulfilment status becomes `fulfilled` and a tracking number is attached. Primary CTA is the carrier track-and-trace link; secondary CTA opens Winner Order | Email |
| Delivered | The carrier confirms delivery | Email |
| Order cancelled | An operator cancels the order | Email |

An invoice is issued at the moment an operator sends it, so reminders
measured from the current invoice's issue are measured from its send. The day 7
final notice is due immediately before the deadline transition; Grade10 SHALL
queue it before writing `expired`, so a final notice is never sent for an
already-expired invoice. Re-quoting or reissuing parks reminders for the
superseded invoice and starts the three-reminder sequence for the new current
invoice.

Unless a letter names another primary action, every letter's primary listing
action SHALL open that lot's Winner Order. On every order letter, the lot
image and lot title SHALL open that lot's Winner Order. When the collector is
signed out, Grade10's existing sign-in flow SHALL run first, then Winner
Order. The invoice-sent and payment-received letters SHALL
NOT attach a PDF; the invoice and receipt PDFs remain on Winner Order. The
shipped letter SHALL name the confirmed delivery address, the carrier, and
the tracking number with the shipped time, SHALL use the carrier
track-and-trace URL as its primary action, and SHALL offer Winner Order as a
secondary action on the same row.

#### Scenario: order-mail-SC-01 - Winning a lot is announced by email
**Serves:** Post-close letters - winning a lot is announced by email

- **WHEN** a lot closes and a winner is determined
- **THEN** Grade10 sends that winner the auction-won letter by email
- **AND** the email identifies the lot and asks the winner to confirm a
  delivery address
- **AND** it names the address confirm deadline
- **AND** it names no amount owed
- **AND** its primary action opens that lot's Winner Order
- **AND** the lot image and lot title open that lot's Winner Order

#### Scenario: order-mail-SC-02 - Expiry is announced with what is owed
**Serves:** Post-close letters - expiry is announced with what is owed

- **GIVEN** an auction order whose invoice is `pending`
- **WHEN** its payment deadline passes and Grade10 sets the invoice to
  `expired`
- **THEN** Grade10 sends the winner the invoice-expired letter
- **AND** it names the outstanding amount and how to resolve it

#### Scenario: order-mail-SC-03 - A manual settlement produces the payment-received letter
**Serves:** Post-close letters - a manual settlement produces the payment-received letter

- **GIVEN** an auction order an operator settles manually
- **WHEN** the settlement is committed
- **THEN** Grade10 sends the winner the payment-received letter
- **AND** it is the same letter a card payment produces
- **AND** it names the amount paid, the payment date, and the settlement
  method with a masked account or reference as recorded
- **AND** its primary action opens that lot's Winner Order for the receipt
- **AND** the letter carries no receipt PDF attachment

#### Scenario: order-mail-SC-11 - Dispatch sends a shipped letter with track-and-trace
**Serves:** Post-close letters - dispatch sends a shipped letter with track-and-trace

- **GIVEN** an auction order whose fulfilment becomes `fulfilled` with a
  tracking number and carrier track-and-trace URL attached
- **WHEN** Grade10 sends the shipped letter
- **THEN** the letter names the confirmed delivery address
- **AND** it names the carrier and tracking number with the shipped time
- **AND** its primary action opens the carrier track-and-trace URL
- **AND** it offers Winner Order as a secondary action on the same row
- **AND** the lot image and lot title open that lot's Winner Order

#### Scenario: order-mail-SC-09 - Sending the invoice tells the winner what to pay and by when
**Serves:** Post-close letters - sending the invoice tells the winner what to pay and by when

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator sends its invoice with an invoice total of 312000 minor
  units in HKD
- **THEN** Grade10 sends the winner the invoice-sent letter by email
- **AND** it names 312000 minor units in HKD as the invoice total and the
  payment deadline in the winner's own timezone
- **AND** its primary action opens that lot's Winner Order so the winner can
  check the invoice and pay
- **AND** the letter carries no invoice PDF attachment
- **AND** the letter does not name a payment method

#### Scenario: order-mail-SC-10 - A card payment produces the payment-received letter
**Serves:** Post-close letters - a card payment produces the payment-received letter

- **GIVEN** an auction order whose invoice is `pending`
- **WHEN** the winner's card payment is confirmed for a Visa ending 4242
- **THEN** Grade10 sends the winner the payment-received letter
- **AND** it names the amount paid, the payment date, and the card brand with
  a masked number
- **AND** its primary action opens that lot's Winner Order for the receipt
- **AND** the letter carries no receipt PDF attachment
