# Order Notifications - delta

## Feature set

- Post-close letters
  - Shipped with no tracker link: the primary action is View order, opening Winner Order, and the tracking number reads as plain text; a tracker link still leads with the carrier's tracking

## MODIFIED Requirements

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
| Payment reminder | Day 3 of the current invoice's running deadline, while invoice status is `pending` | Email | [payment-reminder-day-three.tsx](https://email.grade10-stg.com/preview/auction/order/payment-reminder-day-three) |
| Payment reminder | Day 6 of the current invoice's running deadline, while invoice status is `pending` | Email | [payment-reminder-day-six.tsx](https://email.grade10-stg.com/preview/auction/order/payment-reminder-day-six) |
| Final notice | 24 hours before the payment deadline, while invoice status is `pending` | Email | [payment-reminder-final.tsx](https://email.grade10-stg.com/preview/auction/order/payment-reminder-final) |
| Payment overdue | Grade10 sets the invoice to `expired` at its payment deadline | Email | [payment-overdue.tsx](https://email.grade10-stg.com/preview/auction/order/payment-overdue) |
| Proof not accepted | An operator returns a `payment_verifying` invoice to `pending`. Names the operator's external reason and the new payment deadline in `Asia/Hong_Kong` as `GMT+8` | Email | — |
| Payment received | The winner's card payment is confirmed, an operator confirms bank transfer proof, or an operator commits a manual settlement | Email | [payment-received.tsx](https://email.grade10-stg.com/preview/auction/order/payment-received) |
| Partial payment received | An operator records a payment whose cumulative total remains below the invoice total. Names the current invoice and receipt IDs, attaches that receipt PDF, and uses the partial-payment Contact Us mailto without a remaining balance | Email | — |
| Shipped | Fulfilment status becomes `fulfilled` and a tracking number is attached. With a tracker link, the primary CTA is the carrier track-and-trace link and the secondary CTA opens Winner Order; with none, the primary CTA is View order, opening Winner Order, and the tracking number reads as plain text | Email | [order-shipped.tsx](https://email.grade10-stg.com/preview/auction/order/order-shipped) |
| Delivered | The carrier confirms delivery | Email | [order-delivered.tsx](https://email.grade10-stg.com/preview/auction/order/order-delivered) |
| Order cancelled | An operator cancels the order | Email | [order-cancelled.tsx](https://email.grade10-stg.com/preview/auction/order/order-cancelled) |

Grade10 SHALL send no letter when the winner uploads payment proof. The proof
not accepted letter SHALL state the new payment deadline as "Pay by" with a
date and time, not as a duration, and SHALL NOT carry the operator's internal
reason. Each return sends its own letter.

An invoice is issued at the moment an operator sends it, so reminders
measured from the current invoice's issue are measured from its send, per
"Reminders follow the current invoice deadline". The final notice SHALL fire
24 hours before the payment deadline. Grade10 SHALL queue it before writing
`expired`, so a final notice is never sent for an already-expired invoice.
Reissuing parks reminders for the replaced invoice, sends the payment
reminder for the new invoice, and starts the reminder sequence for that
invoice. Grade10 SHALL NOT send a separate invoice-reissued letter.

Unless a letter names another primary action, every letter's primary listing
action SHALL open that lot's Winner Order. On every order letter, the lot
image and lot title SHALL open that lot's Winner Order. When the collector is
signed out, Grade10's existing sign-in flow SHALL run first, then Winner
Order. The payment-reminder letter SHALL NOT attach a PDF; the invoice PDF remains on
Winner Order. The payment-received letter SHALL attach the receipt PDF, per
"The payment-received letter carries the receipt". The
shipped letter SHALL name the confirmed delivery address, the carrier, and
the tracking number with the shipped time. Where the operator recorded a
tracker link at dispatch, the shipped letter SHALL use that carrier
track-and-trace URL as its primary action, and SHALL offer Winner Order as a
secondary action on the same row. Where no tracker link was recorded, its
primary action SHALL be View order, opening Winner Order; the tracking number
SHALL read as plain text, and the letter SHALL offer no track-and-trace action.

<!-- trace:scenario id=g10.auction-notifications-order.SC-2d0 rev=1 -->
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

<!-- trace:scenario id=g10.auction-notifications-order.SC-kkg rev=1 -->
#### Scenario: order-mail-SC-02 - Expiry is announced with what is owed
**Serves:** Post-close letters - expiry is announced with what is owed

- **GIVEN** an auction order whose invoice is `pending`
- **WHEN** its payment deadline passes and Grade10 sets the invoice to
  `expired`
- **THEN** Grade10 sends the winner the payment-overdue letter
- **AND** it names the outstanding amount
- **AND** it says self-service payment is no longer available
- **AND** it names any applicable penalties or extra charges
- **AND** its primary action is Contact Us
- **AND** its secondary action is View order
- **AND** it promises no automatic cancellation

<!-- trace:scenario id=g10.auction-notifications-order.SC-s24 rev=1 -->
#### Scenario: order-mail-SC-40 - Reissuing an invoice sends the payment reminder
**Serves:** Post-close letters - reissuing an invoice sends the payment reminder

- **GIVEN** an auction order whose invoice an operator reissues with a new
  total and a new payment deadline
- **WHEN** the reissue is committed
- **THEN** Grade10 sends the winner the payment reminder for that new invoice
- **AND** Grade10 sends no separate invoice-reissued letter

<!-- trace:scenario id=g10.auction-notifications-order.SC-dv3 rev=1 -->
#### Scenario: order-mail-SC-43 - A repeated reissue confirmation sends one payment reminder
**Serves:** Post-close letters - a repeated reissue confirmation sends one payment reminder

- **GIVEN** an auction order whose invoice was reissued and whose payment
  reminder for that reissue was sent
- **WHEN** the same reissue confirmation is delivered again
- **THEN** Grade10 sends no second payment reminder for that reissue
- **AND** it sends no invoice-reissued letter

<!-- trace:scenario id=g10.auction-notifications-order.SC-nrz rev=1 -->
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

<!-- trace:scenario id=g10.auction-notifications-order.SC-7jz rev=1 -->
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

<!-- trace:scenario id=g10.auction-notifications-order.SC-pnf rev=1 -->
#### Scenario: order-mail-SC-09 - Sending the invoice tells the winner what to pay and by when
**Serves:** Post-close letters - sending the invoice tells the winner what to pay and by when

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator sends its invoice with an invoice total of 312000 minor
  units in HKD
- **THEN** Grade10 sends the winner the payment-reminder letter by email
- **AND** it names 312000 minor units in HKD as the invoice total and the
  payment deadline in `Asia/Hong_Kong` as `GMT+8`
- **AND** its primary action opens that lot's Winner Order so the winner can
  check the invoice and pay
- **AND** the letter carries no invoice PDF attachment
- **AND** the letter does not name a payment method

<!-- trace:scenario id=g10.auction-notifications-order.SC-wmw rev=1 -->
#### Scenario: order-mail-SC-10 - A card payment produces the payment-received letter
**Serves:** Post-close letters - a card payment produces the payment-received letter

- **GIVEN** an auction order whose invoice is `pending`
- **WHEN** the winner's card payment is confirmed for a Visa ending 4242
- **THEN** Grade10 sends the winner the payment-received letter
- **AND** it names the amount paid, the payment date, and the card brand with
  a masked number
- **AND** its primary action opens that lot's Winner Order for the receipt
- **AND** the letter attaches the receipt PDF

<!-- trace:scenario id=g10.auction-notifications-order.SC-y5o rev=1 -->
#### Scenario: order-mail-SC-20 - Returned proof sends the reason and the new deadline
**Serves:** Post-close letters - proof not accepted

- **GIVEN** a bank transfer invoice that became `payment_verifying` with 3 days left
- **WHEN** an operator returns it to `pending` at 2026-09-16T09:00:00Z with the external reason "Amount does not match" and an internal reason
- **THEN** Grade10 sends the winner the proof-not-accepted letter
- **AND** it names "Amount does not match" and "Pay by" with the deadline 2026-09-19T09:00:00Z as 2026-09-19 17:00 `GMT+8`
- **AND** it states no duration left
- **AND** it does not name the internal reason
- **AND** its primary action opens that lot's Winner Order

<!-- trace:scenario id=g10.auction-notifications-order.SC-3di rev=1 -->
#### Scenario: order-mail-SC-21 - Uploading proof sends no letter
**Serves:** Post-close letters - no letter on upload

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** the winner uploads payment proof
- **THEN** Grade10 sends the winner no letter

<!-- trace:scenario id=g10.auction-notifications-order.SC-18a rev=1 -->
#### Scenario: order-mail-SC-22 - Confirmed proof sends the payment-received letter
**Serves:** Post-close letters - confirmed proof is payment received

- **GIVEN** an invoice that is `payment_verifying` with an order total of 317000 minor units in HKD
- **WHEN** an operator confirms the proof
- **THEN** Grade10 sends the winner the payment-received letter naming 317000 minor units in HKD and bank transfer
- **AND** the letter attaches the receipt PDF

<!-- trace:scenario id=g10.auction-notifications-order.SC-4u6 rev=1 -->
#### Scenario: order-mail-SC-26 - Each return sends its own letter
**Serves:** Post-close letters - proof not accepted

- **GIVEN** a bank transfer invoice whose proof an operator returned once with the external reason "Amount does not match", and whose second upload is `payment_verifying`
- **WHEN** an operator returns it again with the external reason "Reference missing"
- **THEN** Grade10 sends a second proof-not-accepted letter
- **AND** it names "Reference missing"

<!-- trace:scenario id=g10.auction-notifications-order.SC-bgc rev=1 -->
#### Scenario: order-mail-SC-62 - A shipped letter with no tracker link leads with the order
**Serves:** Post-close letters - shipped with no tracker link

- **GIVEN** an auction order whose fulfilment becomes `fulfilled` with a
  tracking number and no tracker link recorded
- **WHEN** Grade10 sends the shipped letter
- **THEN** its primary action is View order, opening that lot's Winner Order
- **AND** the tracking number reads as plain text, not a link
- **AND** the letter offers no track-and-trace action
