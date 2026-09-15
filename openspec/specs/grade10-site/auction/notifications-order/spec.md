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
| Auction won | The lot closes and the winner is determined | Email |
| Payment reminder | Day 3 after the current invoice is issued while invoice status is `pending` | Email |
| Payment reminder | Day 6 after the current invoice is issued while invoice status is `pending` | Email |
| Final notice | Day 7 after the current invoice is issued while invoice status is `pending` | Email |
| Invoice expired | The payment deadline elapses with the invoice still `pending` | Email |
| Invoice reissued | An operator reissues an invoice | Email |
| Payment received | Payment is confirmed, or an operator commits a manual settlement | Email |
| Shipped | Fulfilment status becomes `fulfilled` and a tracking number is attached | Email |
| Delivered | The carrier confirms delivery | Email |
| Order cancelled | An operator cancels the order | Email |

#### Scenario: order-mail-SC-01 - Winning a lot is announced by email
**Serves:** Post-close letters - winning a lot is announced by email

- **WHEN** a lot closes and a winner is determined
- **THEN** Grade10 sends that winner the auction-won letter by email
- **AND** the email identifies the lot and what the winner owes

#### Scenario: order-mail-SC-02 - Expiry is announced with what is owed
**Serves:** Post-close letters - expiry is announced with what is owed

- **GIVEN** an auction order whose payment deadline elapses with the invoice
  status still `pending`
- **WHEN** the expiry is processed
- **THEN** Grade10 sends the winner the invoice-expired letter
- **AND** it names the outstanding amount and how to resolve it

#### Scenario: order-mail-SC-03 - A manual settlement produces the payment-received letter
**Serves:** Post-close letters - a manual settlement produces the payment-received letter

- **GIVEN** an auction order an operator settles manually
- **WHEN** the settlement is committed
- **THEN** Grade10 sends the winner the payment-received letter
- **AND** it is the same letter a Stripe payment produces

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

- **GIVEN** one winner who wins three lots in the same auction
- **WHEN** all three lots close
- **THEN** Grade10 sends three auction-won letters
- **AND** each names its own lot unambiguously

#### Scenario: order-mail-SC-08 - Every letter's facts are on the order
**Serves:** Delivery discipline - every letter's facts are on the order

- **GIVEN** any letter Grade10 has sent about an auction order
- **WHEN** the winner opens that auction order instead of reading the letter
- **THEN** every fact the letter carried is visible there
