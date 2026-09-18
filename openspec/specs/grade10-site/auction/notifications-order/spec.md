# grade10-site/auction/notifications-order Specification

## Purpose
The letters Grade10 sends a winner after a lot closes: what each one fires
on, what stops a reminder, and why none of them is ever the only place a fact
lives.

## Feature set

- Post-close letters
  - Ten events: one letter per thing that happens to an auction order, from winning it to receiving it
  - Per order, never per winner: a winner of three lots is told about three orders separately
- Reminder cadence
  - Three reminders: day 3, day 6 and a final notice on day 7, measured from the current invoice issue
  - Cancellation on payment: a winner who has paid never hears about a deadline again
- Delivery discipline
  - Idempotency: a retried webhook or a replayed event sends nothing twice
  - Never the record: every fact a letter carries is visible on the auction order

## Requirements

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

### Requirement: Reminders follow the current invoice deadline

Grade10 SHALL send the day 3, day 6 and day 7 reminders measured from the
current invoice's issue time, and SHALL send each only while the invoice status
is `pending`.

Grade10 SHALL cancel every outstanding reminder the moment payment is
received. A winner who pays on day 2 SHALL NOT receive the day 3 reminder.

Where an operator reissues an invoice, Grade10 SHALL schedule reminders for
the reissued invoice's issue time and SHALL not send reminders owed only by the
superseded invoice.

#### Scenario: order-mail-SC-04 - Paying early cancels the reminders
**Serves:** Reminder cadence - paying early cancels the reminders

- **GIVEN** an auction order whose winner pays on day 2 after the current
  invoice was issued
- **WHEN** day 3 arrives
- **THEN** Grade10 sends no payment reminder for that invoice
- **AND** sends none on day 6 or day 7 either

#### Scenario: order-mail-SC-05 - Reminders follow a reissued invoice
**Serves:** Reminder cadence - reminders follow a reissued invoice

- **GIVEN** an expired auction order an operator reissues with a new payment
  deadline
- **WHEN** a reminder is due for the reissued invoice while it remains
  `pending`
- **THEN** Grade10 sends the reminder for the reissued invoice
- **AND** sends no reminder owed only by the superseded invoice

### Requirement: Letters are idempotent and per order

Grade10 SHALL NOT send a letter twice for the same event on the same auction
order, however many times the triggering event is delivered.

Where a winner holds more than one auction order, Grade10 SHALL send letters
per order and SHALL name the lot unambiguously in each. A letter SHALL never
be the sole channel of record. Every fact a letter carries SHALL be visible on
the auction order itself.

#### Scenario: order-mail-SC-06 - A retried webhook sends nothing twice
**Serves:** Delivery discipline - a retried webhook sends nothing twice

- **GIVEN** an auction order whose payment-received letter has been sent
- **WHEN** the payment confirmation webhook is delivered again
- **THEN** Grade10 sends no second letter

#### Scenario: order-mail-SC-07 - Three won lots produce three identifiable letters
**Serves:** Post-close letters - three won lots produce three identifiable letters

- **GIVEN** one winner who wins three lots in the same auction
- **WHEN** all three lots close
- **THEN** Grade10 sends three auction-won letters
- **AND** each names its own lot unambiguously

#### Scenario: order-mail-SC-08 - Every letter's facts are on the order
**Serves:** Delivery discipline - every letter's facts are on the order

- **GIVEN** any letter Grade10 has sent about an auction order
- **WHEN** the winner opens that auction order instead of reading the letter
- **THEN** every fact the letter carried is visible there

### Requirement: Delivered and cancelled letters name their facts and actions

The delivered and cancelled letters carry settled facts and action order.

**Delivered** — The delivered letter SHALL name the delivery address and the
delivered time recorded on the order at carrier confirmation, SHALL use View
order as its primary action, and SHALL offer Contact Us as its secondary
action. Contact Us SHALL open the storefront's existing Contact Us destination.

**Cancelled** — The order-cancelled letter SHALL name when the order was
cancelled, SHALL NOT name a reason and SHALL NOT say anything about payment,
SHALL use Contact Us as its primary action, and SHALL offer View order as its
secondary action. Contact Us SHALL open the storefront's existing Contact Us
destination.

#### Scenario: order-mail-SC-41 - Delivery confirmation names the address and time
**Serves:** Post-close letters - delivery confirmation names the address and time

- **GIVEN** an auction order whose carrier confirms delivery to a named
  address at a recorded delivered time
- **WHEN** Grade10 sends the delivered letter
- **THEN** the letter names that delivery address and the delivered time
- **AND** its primary action is View order
- **AND** its secondary action is Contact Us

#### Scenario: order-mail-SC-42 - Cancellation names when and leads with Contact Us
**Serves:** Post-close letters - cancellation names when and leads with Contact Us

- **GIVEN** an auction order an operator cancels at a recorded time
- **WHEN** Grade10 sends the order-cancelled letter
- **THEN** the letter names when the order was cancelled
- **AND** it names no reason
- **AND** it says nothing about payment
- **AND** its primary action is Contact Us
- **AND** its secondary action is View order
