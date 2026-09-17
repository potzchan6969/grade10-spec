## Feature set

- Post-close letters
  - Reissue is the payment reminder: an operator reissue sends the payment reminder for the new invoice (total and `Pay by …`); there is no separate reissued letter
  - Delivered letter: names the delivery address and the delivered time; View order first, Contact Us second
  - Order cancelled letter: names when the order was cancelled; no reason and nothing about payment; Contact Us first, View order second

## ADDED Requirements

### Requirement: A reissued invoice is announced by the payment reminder

Reissue uses the payment reminder, not a letter of its own.

**Payment reminder at reissue** — When an operator reissues an invoice, Grade10
SHALL send the payment reminder for the new invoice, naming its total and
`Pay by …`, and SHALL NOT send a separate invoice-reissued letter.

**Once per reissue** — A reissue confirmation delivered more than once SHALL
send that payment reminder once.

#### Scenario: order-mail-SC-40 - Reissuing an invoice sends the payment reminder
**Serves:** Post-close letters - reissuing an invoice sends the payment reminder

- **GIVEN** an auction order whose invoice an operator reissues with a new
  total of 288000 minor units in HKD and a new payment deadline
- **WHEN** the reissue is committed
- **THEN** Grade10 sends the winner the payment reminder for that new invoice
- **AND** it names 288000 minor units in HKD as the total and `Pay by …` for
  the new deadline
- **AND** Grade10 sends no separate invoice-reissued letter

#### Scenario: order-mail-SC-43 - A repeated reissue confirmation sends one payment reminder
**Serves:** Post-close letters - a repeated reissue confirmation sends one payment reminder

- **GIVEN** an auction order whose invoice was reissued and whose payment
  reminder for that reissue was sent
- **WHEN** the same reissue confirmation is delivered again
- **THEN** Grade10 sends no second payment reminder for that reissue
- **AND** it sends no invoice-reissued letter

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
