## Feature set

- Post-close letters
  - Proof not accepted: the operator's external reason and the time left to pay
  - No letter on upload: sending proof sends nothing
  - Receipt in the letter: the payment-received letter shows the receipt and attaches it as a PDF, so the winner keeps proof of payment outside Grade10
  - No invoice attachment: the invoice-sent letter attaches no PDF
- Reminder cadence
  - Held while proof is checked: no reminder or final notice while the invoice is Payment Verifying; the sequence resumes if the proof is returned

## ADDED Requirements

### Requirement: The payment-received letter carries the receipt

The payment-received letter is the one order letter that attaches a PDF: the
receipt.

**Receipt in the letter** - The payment-received letter SHALL show the order's
payment receipt, as `grade10-site/auction/winner-order` defines it, and SHALL
attach that receipt as a PDF.

**No other attachment** - No other order letter SHALL attach a PDF.

| Part | Letter body | PDF attachment |
| --- | --- | --- |
| Receipt ID | Shown | Shown, and in the file name |
| Invoice ID and lot | Shown | Shown |
| Itemised lines, order total and payment breakdown | Shown | Shown |
| Payment method | Shown | Shown |
| Manually settled mark, method and reference | Shown when an operator recorded the payment | Shown when an operator recorded the payment |
| Date the payment was confirmed | Shown | Shown |
| Proof files and their names | Never | Never |
| Internal audit number | Never | Never |

**Language and facts** - The PDF SHALL be in the same language as the letter,
and SHALL carry no fact the order's receipt does not show, so the letter is
never the only record.

**Sent once** - A payment confirmation delivered more than once SHALL send one
letter and one attachment.

#### Scenario: order-mail-SC-28 - The letter shows the receipt and attaches it
**Serves:** Post-close letters - receipt in the letter

- **GIVEN** an auction order paid by a Visa card ending 4242 at an order total of 323225 minor units in HKD, with receipt ID `REC-202609-LK7P2Q-01-P1`
- **WHEN** Grade10 sends the payment-received letter
- **THEN** the letter shows `REC-202609-LK7P2Q-01-P1`, the invoice ID, the lot, the itemised lines, the order total and the Visa ending 4242
- **AND** a PDF is attached whose file name contains `REC-202609-LK7P2Q-01-P1` and which carries the same ID, lines, total and payment method

#### Scenario: order-mail-SC-29 - A manually recorded payment's PDF says so
**Serves:** Post-close letters - receipt in the letter

- **GIVEN** an auction order an operator settled by cash with an external reference and a proof file
- **WHEN** Grade10 sends the payment-received letter
- **THEN** the attached PDF is marked as manually settled and shows cash and the reference
- **AND** neither the letter nor the PDF shows the proof file, its name, or the internal audit number

#### Scenario: order-mail-SC-30 - The receipt PDF is in the letter's language
**Serves:** Post-close letters - receipt in the letter

- **GIVEN** a payment-received letter sent in Traditional Chinese
- **WHEN** the winner opens the attached PDF
- **THEN** its labels are in Traditional Chinese

#### Scenario: order-mail-SC-31 - A repeated confirmation sends one receipt
**Serves:** Post-close letters - receipt in the letter

- **GIVEN** an auction order whose card payment was confirmed and whose payment-received letter was sent
- **WHEN** the same payment confirmation is delivered again
- **THEN** Grade10 sends no second letter and no second receipt PDF

## MODIFIED Requirements

### Requirement: Post-close letters

Grade10 SHALL send a winner these letters. Each SHALL be sent to the
collector's registered account email and SHALL follow the letter shape
`grade10-site/auction/notifications` defines.

| Letter | Trigger | Channel |
| --- | --- | --- |
| Auction won | The lot closes and the winner is determined. Asks for a delivery address and names the address deadline | Email |
| Invoice sent | An operator sends the invoice. Names the invoice total and the payment deadline | Email |
| Payment reminder | Day 3 of the current invoice's running deadline, while invoice status is `pending` | Email |
| Payment reminder | Day 6 of the current invoice's running deadline, while invoice status is `pending` | Email |
| Final notice | Immediately before the payment-deadline expiry transition, while invoice status is `pending` | Email |
| Invoice expired | Grade10 sets the invoice to `expired` at its payment deadline | Email |
| Invoice reissued | An operator reissues an invoice | Email |
| Proof not accepted | An operator returns a `payment_verifying` invoice to `pending`. Names the operator's external reason and the new payment deadline as a date and time in the winner's own timezone | Email |
| Payment received | The winner's card payment is confirmed, an operator confirms bank transfer proof, or an operator commits a manual settlement | Email |
| Shipped | Fulfilment status becomes `fulfilled` and a tracking number is attached. Primary CTA is the carrier track-and-trace link; secondary CTA opens Winner Order | Email |
| Delivered | The carrier confirms delivery | Email |
| Order cancelled | An operator cancels the order | Email |

Grade10 SHALL send no letter when the winner uploads payment proof. The proof
not accepted letter SHALL state the new payment deadline as "Pay by" with a
date and time, not as a duration, and SHALL NOT carry the operator's internal
reason. Each return sends its own letter.

An invoice is issued at the moment an operator sends it, so reminders
measured from the current invoice's issue are measured from its send, per
"Reminders follow the current invoice deadline". Grade10 SHALL queue the final
notice before writing `expired`, so a final notice is never sent for an
already-expired invoice. Reissuing parks reminders for the replaced invoice
and starts the three-reminder sequence for the new current invoice.

Unless a letter names another primary action, every letter's primary listing
action SHALL open that lot's Winner Order. On every order letter, the lot
image and lot title SHALL open that lot's Winner Order. When the collector is
signed out, Grade10's existing sign-in flow SHALL run first, then Winner
Order. The invoice-sent letter SHALL NOT attach a PDF; the invoice PDF remains on
Winner Order. The payment-received letter SHALL attach the receipt PDF, per
"The payment-received letter carries the receipt". The
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
- **AND** the letter attaches the receipt PDF

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
- **AND** the letter attaches the receipt PDF

#### Scenario: order-mail-SC-20 - Returned proof sends the reason and the new deadline
**Serves:** Post-close letters - proof not accepted

- **GIVEN** a bank transfer invoice that became `payment_verifying` with 3 days left
- **WHEN** an operator returns it to `pending` at 2026-09-16T09:00:00Z with the external reason "Amount does not match" and an internal reason
- **THEN** Grade10 sends the winner the proof-not-accepted letter
- **AND** it names "Amount does not match" and "Pay by" with the deadline 2026-09-19T09:00:00Z as a date and time in the winner's own timezone
- **AND** it states no duration left
- **AND** it does not name the internal reason
- **AND** its primary action opens that lot's Winner Order

#### Scenario: order-mail-SC-21 - Uploading proof sends no letter
**Serves:** Post-close letters - no letter on upload

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** the winner uploads payment proof
- **THEN** Grade10 sends the winner no letter

#### Scenario: order-mail-SC-22 - Confirmed proof sends the payment-received letter
**Serves:** Post-close letters - confirmed proof is payment received

- **GIVEN** an invoice that is `payment_verifying` with an order total of 317000 minor units in HKD
- **WHEN** an operator confirms the proof
- **THEN** Grade10 sends the winner the payment-received letter naming 317000 minor units in HKD and bank transfer
- **AND** the letter attaches the receipt PDF

#### Scenario: order-mail-SC-26 - Each return sends its own letter
**Serves:** Post-close letters - proof not accepted

- **GIVEN** a bank transfer invoice whose proof an operator returned once with the external reason "Amount does not match", and whose second upload is `payment_verifying`
- **WHEN** an operator returns it again with the external reason "Reference missing"
- **THEN** Grade10 sends a second proof-not-accepted letter
- **AND** it names "Reference missing"

### Requirement: Reminders follow the current invoice deadline

Grade10 SHALL send the day 3 and day 6 reminders and the final notice measured
on the current invoice's running deadline, and SHALL send each only while the
invoice status is `pending`. The running deadline counts time from the
invoice's issue and does not count time while the invoice is
`payment_verifying`, so day 3 falls once 3 days of running time have passed.

Grade10 SHALL cancel every outstanding reminder the moment payment is
received. A winner who pays on day 2 SHALL NOT receive the day 3 reminder.

While the invoice is `payment_verifying`, Grade10 SHALL hold every reminder
and the final notice. When an operator returns the proof, Grade10 SHALL send
each reminder not yet sent at its place on the running deadline, which the
check has moved later. Grade10 SHALL NOT send a reminder at the return because
its original time passed during the check, and SHALL NOT send a reminder
already sent again.

Where an operator reissues an invoice, Grade10 SHALL schedule reminders for
the reissued invoice's issue time and SHALL not send reminders owed only by the
replaced invoice.

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
- **AND** sends no reminder owed only by the replaced invoice

#### Scenario: order-mail-SC-23 - No reminder goes out while proof is checked
**Serves:** Reminder cadence - held while proof is checked

- **GIVEN** an invoice sent at 2026-09-12T09:00:00Z that became `payment_verifying` at 2026-09-13T09:00:00Z
- **WHEN** 2026-09-15T09:00:00Z, 2026-09-18T09:00:00Z and 2026-09-19T09:00:00Z pass with the invoice still `payment_verifying`
- **THEN** Grade10 sends no payment reminder and no final notice

#### Scenario: order-mail-SC-24 - Reminders resume on the paused clock after a return
**Serves:** Reminder cadence - the sequence resumes if the proof is returned

- **GIVEN** an invoice sent at 2026-09-12T09:00:00Z that became `payment_verifying` at 2026-09-13T09:00:00Z
- **WHEN** an operator returns it to `pending` at 2026-09-16T09:00:00Z
- **THEN** Grade10 sends the day 3 reminder at 2026-09-18T09:00:00Z and the day 6 reminder at 2026-09-21T09:00:00Z
- **AND** queues the final notice immediately before the new deadline of 2026-09-22T09:00:00Z

#### Scenario: order-mail-SC-25 - A reminder already sent is not repeated after a return
**Serves:** Reminder cadence - held while proof is checked

- **GIVEN** an invoice sent at 2026-09-12T09:00:00Z whose day 3 reminder went out, and which became `payment_verifying` at 2026-09-16T09:00:00Z
- **WHEN** an operator returns it to `pending` at 2026-09-17T09:00:00Z
- **THEN** Grade10 sends no second day 3 reminder
- **AND** sends the day 6 reminder at 2026-09-19T09:00:00Z

#### Scenario: order-mail-SC-27 - A return sends no held reminder at once
**Serves:** Reminder cadence - the sequence resumes if the proof is returned

- **GIVEN** an invoice sent at 2026-09-12T09:00:00Z that became `payment_verifying` at 2026-09-13T09:00:00Z, so its day 3 reminder did not go out at 2026-09-15T09:00:00Z
- **WHEN** an operator returns it to `pending` at 2026-09-16T09:00:00Z
- **THEN** Grade10 sends no reminder at 2026-09-16T09:00:00Z
- **AND** the day 3 reminder waits for 2026-09-18T09:00:00Z
