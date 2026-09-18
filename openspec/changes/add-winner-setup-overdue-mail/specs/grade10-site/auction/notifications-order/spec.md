## Feature set

- Post-close letters
  - Auction-won asks for delivery address, payment method and billing address setup, and names the setup deadline
  - One setup reminder at 24h (formerly address reminder); no second reminder at 72h
  - Setup overdue at the 48-hour setup deadline while setup is incomplete
  - Payment overdue at invoice `expired`, replacing invoice-expired naming

## MODIFIED Requirements

### Requirement: Post-close letters

For an auction-won order, Grade10 SHALL send the winner an auction-won letter
that identifies the lot, asks for delivery address, payment method and billing
address setup, names the setup deadline, and opens Winner Order as its primary
action. It SHALL name no amount owed.

When an invoice reaches `expired`, Grade10 SHALL send the payment-overdue
letter instead of the invoice-expired letter. The payment-overdue letter SHALL
name the outstanding amount, explain that self-service payment is no longer
available, name any applicable penalties or extra charges, use Contact Us as
its primary action, and offer View order as its secondary action. It SHALL
not promise automatic cancellation; an operator reviews the next action.

#### Scenario: order-mail-SC-01 - Winning a lot is announced by email
**Serves:** Post-close letters - winning a lot is announced by email

- **WHEN** a lot closes and a winner is determined
- **THEN** Grade10 sends that winner the auction-won letter by email
- **AND** the email identifies the lot
- **AND** it asks the winner to confirm a delivery address, payment method and
  billing address
- **AND** it names the setup deadline
- **AND** it names no amount owed
- **AND** its primary action opens that lot's Winner Order

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

#### Scenario: order-mail-SC-03 - A manual settlement produces the payment-received letter
**Serves:** Post-close letters - a manual settlement produces the payment-received letter

- **GIVEN** an auction order an operator settles manually
- **WHEN** the settlement is committed
- **THEN** Grade10 sends the winner the payment-received letter
- **AND** it names the amount paid, payment date and settlement method
- **AND** its primary action opens Winner Order
- **AND** it carries no receipt PDF attachment

#### Scenario: order-mail-SC-11 - Dispatch sends a shipped letter with track-and-trace
**Serves:** Post-close letters - dispatch sends a shipped letter with track-and-trace

- **GIVEN** fulfilment becomes `fulfilled` with a tracking number and carrier
  URL
- **WHEN** Grade10 sends the shipped letter
- **THEN** it names the delivery address, carrier, tracking number and shipped
  time
- **AND** its primary action opens the carrier URL
- **AND** it offers Winner Order as a secondary action

#### Scenario: order-mail-SC-09 - Sending the invoice tells the winner what to pay and by when
**Serves:** Post-close letters - sending the invoice tells the winner what to pay and by when

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator sends its invoice
- **THEN** Grade10 sends the invoice-sent letter with the invoice total and
  payment deadline
- **AND** its primary action opens Winner Order
- **AND** it carries no invoice PDF attachment

#### Scenario: order-mail-SC-10 - A card payment produces the payment-received letter
**Serves:** Post-close letters - a card payment produces the payment-received letter

- **GIVEN** an auction order whose pending invoice is paid by card
- **WHEN** the payment is confirmed
- **THEN** Grade10 sends the payment-received letter
- **AND** it names the amount, date and masked card method
- **AND** it carries no receipt PDF attachment

## ADDED Requirements

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
- **AND** its secondary action is View order
- **AND** it explains that self-service setup is closed and manual review is
  required
- **AND** it promises no automatic cancellation
