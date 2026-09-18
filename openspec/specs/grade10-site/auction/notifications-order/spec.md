# grade10-site/auction/notifications-order Specification

## Purpose
The letters Grade10 sends a winner after a lot closes: what each one fires
on, what stops a reminder, and why none of them is ever the only place a fact
lives.

## Feature set

- Post-close letters
  - Setup series: auction-won asks for order setup; one setup reminder at 24h; setup overdue at the 48-hour setup deadline while setup is incomplete
  - Payment path: payment reminder on invoice send or reissue; day 3 and day 6 while unpaid; final notice 24 hours before the payment deadline; payment overdue at invoice `expired`
  - Reissue is the payment reminder: an operator reissue sends the payment reminder for the new invoice; there is no separate reissued letter
  - Fulfilment and cancel: shipped, delivered, and order cancelled
  - Per order, never per winner: a winner of three lots is told about three orders separately
- Reminder cadence
  - Day 3, day 6, and final notice at payment deadline − 24h, measured from the current invoice
  - Cancellation on payment: a winner who has paid never hears about a deadline again
- Delivery discipline
  - Idempotency: a retried webhook or a replayed event sends nothing twice
  - Never the record: every fact a letter carries is visible on the auction order

## Requirements

### Requirement: Post-close letters

Grade10 SHALL send a winner these letters. Each SHALL be sent to the
collector's registered account email and SHALL follow the letter shape
`grade10-site/auction/notifications` defines. Preview links open the staging
template at `https://email.grade10-stg.com/preview/…` (same path as
`apps/emails/emails/`).

| Letter | Trigger | Channel | Preview |
| --- | --- | --- | --- |
| Auction won | The lot closes and the winner is determined. Asks for order setup and names the setup deadline | Email | [auction-won.tsx](https://email.grade10-stg.com/preview/auction/order/auction-won) |
| Setup reminder | 24 hours after lot close while setup is incomplete | Email | [setup-reminder.tsx](https://email.grade10-stg.com/preview/auction/order/setup-reminder) |
| Setup overdue | The setup deadline (48 hours after lot close) passes while setup is incomplete. Self-service setup is closed; Contact Us is primary | Email | [setup-overdue.tsx](https://email.grade10-stg.com/preview/auction/order/setup-overdue) |
| Payment reminder | An operator sends or reissues the invoice. Names the invoice total and the payment deadline | Email | [payment-reminder.tsx](https://email.grade10-stg.com/preview/auction/order/payment-reminder) |
| Payment reminder | Day 3 after the current invoice is issued while invoice status is `pending` | Email | [payment-reminder-day-three.tsx](https://email.grade10-stg.com/preview/auction/order/payment-reminder-day-three) |
| Payment reminder | Day 6 after the current invoice is issued while invoice status is `pending` | Email | [payment-reminder-day-six.tsx](https://email.grade10-stg.com/preview/auction/order/payment-reminder-day-six) |
| Final notice | 24 hours before the payment deadline, while invoice status is `pending` | Email | [payment-reminder-final.tsx](https://email.grade10-stg.com/preview/auction/order/payment-reminder-final) |
| Payment overdue | Grade10 sets the invoice to `expired` at its payment deadline | Email | [payment-overdue.tsx](https://email.grade10-stg.com/preview/auction/order/payment-overdue) |
| Payment received | Payment is confirmed, or an operator commits a manual settlement | Email | [payment-received.tsx](https://email.grade10-stg.com/preview/auction/order/payment-received) |
| Shipped | Fulfilment status becomes `fulfilled` and a tracking number is attached. Primary CTA is the carrier track-and-trace link; secondary CTA opens Winner Order | Email | [order-shipped.tsx](https://email.grade10-stg.com/preview/auction/order/order-shipped) |
| Delivered | The carrier confirms delivery | Email | [order-delivered.tsx](https://email.grade10-stg.com/preview/auction/order/order-delivered) |
| Order cancelled | An operator cancels the order | Email | [order-cancelled.tsx](https://email.grade10-stg.com/preview/auction/order/order-cancelled) |

An invoice is issued at the moment an operator sends it, so reminders
measured from the current invoice's issue are measured from its send. The
final notice SHALL fire 24 hours before the payment deadline. Grade10 SHALL
queue it before writing `expired`, so a final notice is never sent for an
already-expired invoice. Reissuing parks reminders for the replaced invoice,
sends the payment reminder for the new invoice, and starts the reminder
sequence for that invoice. Grade10 SHALL NOT send a separate invoice-reissued
letter.

Unless a letter names another primary action, every letter's primary listing
action SHALL open that lot's Winner Order. On every order letter, the lot
image and lot title SHALL open that lot's Winner Order. When the collector is
signed out, Grade10's existing sign-in flow SHALL run first, then Winner
Order. The payment-reminder and payment-received letters SHALL
NOT attach a PDF; the invoice and receipt PDFs remain on Winner Order. The
shipped letter SHALL name the confirmed delivery address, the carrier, and
the tracking number with the shipped time, SHALL use the carrier
track-and-trace URL as its primary action, and SHALL offer Winner Order as a
secondary action on the same row.

#### Scenario: order-mail-SC-01 - Winning a lot is announced by email
**Serves:** Post-close letters - winning a lot is announced by email

- **WHEN** a lot closes and a winner is determined
- **THEN** Grade10 sends that winner the auction-won letter by email
- **AND** the email identifies the lot and asks the winner to complete
  order setup
- **AND** it names the setup deadline
- **AND** it names no amount owed
- **AND** its primary action opens that lot's Winner Order
- **AND** the lot image and lot title open that lot's Winner Order

#### Scenario: order-mail-SC-02 - Expiry is announced with what is owed
**Serves:** Post-close letters - expiry is announced with what is owed

- **GIVEN** an auction order whose invoice is `pending`
- **WHEN** its payment deadline passes and Grade10 sets the invoice to
  `expired`
- **THEN** Grade10 sends the winner the payment-overdue letter
- **AND** it names the outstanding amount and how to resolve it

#### Scenario: order-mail-SC-40 - Reissuing an invoice sends the payment reminder
**Serves:** Post-close letters - reissuing an invoice sends the payment reminder

- **GIVEN** an auction order whose invoice an operator reissues with a new
  total and a new payment deadline
- **WHEN** the reissue is committed
- **THEN** Grade10 sends the winner the payment reminder for that new invoice
- **AND** Grade10 sends no separate invoice-reissued letter

#### Scenario: order-mail-SC-43 - A repeated reissue confirmation sends one payment reminder
**Serves:** Post-close letters - a repeated reissue confirmation sends one payment reminder

- **GIVEN** an auction order whose invoice was reissued and whose payment
  reminder for that reissue was sent
- **WHEN** the same reissue confirmation is delivered again
- **THEN** Grade10 sends no second payment reminder for that reissue
- **AND** it sends no invoice-reissued letter

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
- **THEN** Grade10 sends the winner the payment-reminder letter by email
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

### Requirement: Setup reminder and setup overdue follow the setup window

Grade10 SHALL remind a winner whose setup is incomplete, and SHALL tell them
when the setup deadline has passed.

**Setup reminder** — 24 hours after lot close, while setup is incomplete,
Grade10 SHALL send the setup-reminder letter. This letter is the former
address reminder. Grade10 SHALL NOT send a second setup reminder at 72 hours
or at any other time after the first.

**Setup overdue** — When the setup deadline (48 hours after lot close) passes
while setup is incomplete, Grade10 SHALL send the setup-overdue letter. Its
primary action SHALL be Contact Us.

**Park on confirm** — Setup reminder and setup overdue SHALL park once the
winner confirms setup.

#### Scenario: order-mail-SC-50 - Setup reminder fires while setup is incomplete
**Serves:** Post-close letters - setup reminder fires while setup is incomplete

- **GIVEN** an auction order whose winner has not confirmed setup
- **WHEN** 24 hours after lot close arrive
- **THEN** Grade10 sends the winner the setup-reminder letter

#### Scenario: order-mail-SC-54 - No second setup reminder at 72 hours
**Serves:** Post-close letters - setup reminder fires while setup is incomplete

- **GIVEN** an auction order whose winner has not confirmed setup
- **AND** the setup-reminder letter at 24 hours has been sent
- **WHEN** 72 hours after lot close arrive
- **THEN** Grade10 sends no second setup-reminder letter

#### Scenario: order-mail-SC-51 - Setup overdue fires at the setup deadline
**Serves:** Post-close letters - setup overdue fires at the setup deadline

- **GIVEN** an auction order whose winner has not confirmed setup
- **WHEN** the setup deadline 48 hours after lot close passes
- **THEN** Grade10 sends the winner the setup-overdue letter
- **AND** the letter's primary action is Contact Us

### Requirement: Reminders follow the current invoice deadline

Grade10 SHALL send the day 3 and day 6 reminders and the final notice measured
from the current invoice's issue time, and SHALL send each only while the
invoice status is `pending`. The final notice SHALL fire 24 hours before the
payment deadline.

Grade10 SHALL cancel every outstanding reminder the moment payment is
received. A winner who pays on day 2 SHALL NOT receive the day 3 reminder.

Where an operator reissues an invoice, Grade10 SHALL schedule reminders for
the reissued invoice's issue time and SHALL not send reminders owed only by the
replaced invoice.

#### Scenario: order-mail-SC-04 - Paying early cancels the reminders
**Serves:** Reminder cadence - paying early cancels the reminders

- **GIVEN** an auction order whose winner pays on day 2 after the current
  invoice was issued
- **WHEN** day 3 arrives
- **THEN** Grade10 sends no payment reminder for that invoice
- **AND** sends none on day 6 or the final notice either

#### Scenario: order-mail-SC-05 - Reminders follow a reissued invoice
**Serves:** Reminder cadence - reminders follow a reissued invoice

- **GIVEN** an expired auction order an operator reissues with a new payment
  deadline
- **WHEN** a reminder is due for the reissued invoice while it remains
  `pending`
- **THEN** Grade10 sends the reminder for the reissued invoice
- **AND** sends no reminder owed only by the replaced invoice

#### Scenario: order-mail-SC-52 - Final notice fires 24 hours before the payment deadline
**Serves:** Reminder cadence - final notice fires 24 hours before the payment deadline

- **GIVEN** an auction order whose invoice is `pending` with a payment deadline
- **WHEN** 24 hours before that deadline arrive
- **THEN** Grade10 sends the winner the final-notice letter
- **AND** it does not wait until the deadline transition itself

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
