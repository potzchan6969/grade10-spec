## Feature set

- Contact Us destination
  - Same ready email as Winner Order: setup overdue, payment overdue, cancelled, delivered and partial-payment Contact Us CTAs prefill the matching subject and body
  - Address named in the letter: the letter body names `support@grade10.com` so a collector without a mail client still has the address

## ADDED Requirements

### Requirement: Letter Contact Us carries the ready email

Setup overdue, payment overdue, cancelled, delivered and partial-payment
letters use the same ready email as Winner Order Contact Us, because a letter
cannot offer the copy dialog.

**Mailto** — Contact Us on those letters SHALL open a `mailto:` to
`support@grade10.com` whose subject and body match the ready email for that
order and reason, as `grade10-site/auction/winner-order` defines them — the
order's current invoice id in the subject when one exists, lot title when
none does.

**Reasons** — The subject reason fragment SHALL be `setup overdue`,
`payment overdue`, `cancelled`, `delivered`, or `partial payment` for those
letters respectively.

**Address in the letter** — Each of those letters' bodies SHALL name
`support@grade10.com` so a collector without a mail client still has the
address.

#### Scenario: order-mail-SC-57 - Setup overdue Contact Us prefills the lot subject and body
**Serves:** grade10-site/auction/winner-order#winner-order-US-15 - Winner emails Grade10 from a locked order

- **GIVEN** a setup-overdue letter for lot title "Charizard Base Set PSA 10"
  with no invoice issued
- **WHEN** the winner chooses Contact Us on that letter
- **THEN** the `mailto:` is to `support@grade10.com`
- **AND** its subject is
  `Auction lot Charizard Base Set PSA 10: setup overdue`
- **AND** its body names that lot title and status Setup overdue
- **AND** the letter body names `support@grade10.com`

#### Scenario: order-mail-SC-58 - Payment overdue Contact Us prefills the invoice subject and body
**Serves:** grade10-site/auction/winner-order#winner-order-US-15 - Winner emails Grade10 from a locked order

- **GIVEN** a payment-overdue letter for invoice id `INV-202609-LK7P2Q-01`
  and lot title "Charizard Base Set PSA 10"
- **WHEN** the winner chooses Contact Us on that letter
- **THEN** the `mailto:` is to `support@grade10.com`
- **AND** its subject is
  `Auction order INV-202609-LK7P2Q-01: payment overdue`
- **AND** its body names that invoice id, that lot title, and status Payment
  overdue
- **AND** the letter body names `support@grade10.com`

#### Scenario: order-mail-SC-59 - Cancelled Contact Us prefills the ready email and the letter names the address
**Serves:** grade10-site/auction/winner-order#winner-order-US-15 - Winner emails Grade10 from a locked order

- **GIVEN** an order-cancelled letter for invoice id `INV-202609-LK7P2Q-01`
  and lot title "Charizard Base Set PSA 10"
- **WHEN** the winner chooses Contact Us on that letter
- **THEN** the `mailto:` subject is
  `Auction order INV-202609-LK7P2Q-01: cancelled`
- **AND** its body names that invoice id, that lot title, and status
  Cancelled
- **AND** the letter body names `support@grade10.com`

#### Scenario: order-mail-SC-60 - Delivered Contact Us prefills the ready email and the letter names the address
**Serves:** grade10-site/auction/winner-order#winner-order-US-15 - Winner emails Grade10 from a locked order

- **GIVEN** a delivered letter for invoice id `INV-202609-LK7P2Q-01` and lot
  title "Charizard Base Set PSA 10"
- **WHEN** the winner chooses Contact Us on that letter
- **THEN** the `mailto:` subject is
  `Auction order INV-202609-LK7P2Q-01: delivered`
- **AND** its body names that invoice id, that lot title, and status
  Delivered
- **AND** the letter body names `support@grade10.com`

#### Scenario: order-mail-SC-61 - Partial-payment Contact Us prefills the ready email without the balance
**Serves:** grade10-site/auction/winner-order#winner-order-US-15 - Winner emails Grade10 from a locked order

- **GIVEN** a partial-payment letter for invoice id `INV-202609-LK7P2Q-01`,
  lot title "Charizard Base Set PSA 10", and receipt ids
  `REC-202609-LK7P2Q-01-P1`
- **WHEN** the winner chooses Contact Us on that letter
- **THEN** the `mailto:` subject is
  `Auction order INV-202609-LK7P2Q-01: partial payment`
- **AND** its body may list those receipt ids
- **AND** its body names no remaining balance
- **AND** the letter body names `support@grade10.com`

## MODIFIED Requirements

### Requirement: Delivered and cancelled letters name their facts and actions

The delivered and cancelled letters carry settled facts and action order.

**Delivered** — The delivered letter SHALL name the delivery address and the
delivered time recorded on the order at carrier confirmation, SHALL use View
order as its primary action, and SHALL offer Contact Us as its secondary
action. Contact Us SHALL open a `mailto:` to `support@grade10.com` whose
subject and body match the ready email for a delivered order, as
`grade10-site/auction/winner-order` defines it, and the letter body SHALL
name `support@grade10.com`.

**Cancelled** — The order-cancelled letter SHALL name when the order was
cancelled, SHALL NOT name a reason and SHALL NOT say anything about payment,
SHALL use Contact Us as its primary action, and SHALL offer View order as its
secondary action. Contact Us SHALL open a `mailto:` to `support@grade10.com`
whose subject and body match the ready email for a cancelled order, as
`grade10-site/auction/winner-order` defines it, and the letter body SHALL
name `support@grade10.com`.

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
