## Feature set

- Post-close letters
  - Address first: the auction-won letter asks for a delivery address and names no amount, since none is owed yet
  - Invoice sent: a new letter carries the amount and the deadline, because sending is what opens the payment window
  - Expiry letter: fires when Grade10 writes `expired` on the invoice at its deadline

## MODIFIED Requirements

### Requirement: Post-close letters

Grade10 SHALL send a winner these letters. Each SHALL be sent to the
collector's registered account email and SHALL follow the letter shape
`grade10-site/auction/notifications` defines.

| Letter | Trigger | Channel |
| --- | --- | --- |
| Auction won | The lot closes and the winner is determined. Asks for a delivery address | Email |
| Invoice sent | An operator sends the invoice. Names the order total and the payment deadline | Email |
| Payment reminder | Day 3 after the current invoice is issued while invoice status is `pending` | Email |
| Payment reminder | Day 6 after the current invoice is issued while invoice status is `pending` | Email |
| Final notice | On day 7, immediately before the payment-deadline expiry transition, while invoice status is `pending` | Email |
| Invoice expired | Grade10 sets the invoice to `expired` at its payment deadline | Email |
| Invoice reissued | An operator reissues an invoice, on a re-quote or after expiry | Email |
| Payment received | Payment is confirmed, or an operator commits a manual settlement | Email |
| Shipped | Fulfilment status becomes `fulfilled` and a tracking number is attached | Email |
| Delivered | The carrier confirms delivery | Email |
| Order cancelled | An operator cancels the order | Email |

An invoice is issued at the moment an operator sends it, so reminders
measured from the current invoice's issue are measured from its send. The day 7
final notice is due immediately before the deadline transition; Grade10 SHALL
queue it before writing `expired`, so a final notice is never sent for an
already-expired invoice. Re-quoting or reissuing parks reminders for the
superseded invoice and starts the three-reminder sequence for the new current
invoice.

#### Scenario: order-mail-SC-01 - Winning a lot is announced by email
**Serves:** Post-close letters - winning a lot is announced by email

- **WHEN** a lot closes and a winner is determined
- **THEN** Grade10 sends that winner the auction-won letter by email
- **AND** the email identifies the lot and asks the winner to confirm a
  delivery address
- **AND** it names no amount owed

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

#### Scenario: order-mail-SC-09 - Sending the invoice tells the winner what to pay and by when
**Serves:** Post-close letters - sending the invoice tells the winner what to pay and by when

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator sends its invoice with an order total of 312000 minor
  units in HKD
- **THEN** Grade10 sends the winner the invoice-sent letter by email
- **AND** it names 312000 minor units in HKD and the payment deadline in the
  winner's own timezone
