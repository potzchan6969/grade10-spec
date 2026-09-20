## Feature set

- Post-close letters
  - Setup letter copy: auction-won and setup-reminder name delivery address, payment method and billing address as bullets; setup overdue stays generic and never cancels on its own

## ADDED Requirements

### Requirement: Setup letters name what setup asks for

Auction-won and the setup-reminder letter SHALL name delivery address, payment
method, and billing address as bullets, and SHALL use Complete Order Setup as
the primary action with a Confirm-by deadline.

The setup-overdue letter SHALL speak of order setup generically (no field
list), SHALL say self-service setup is closed, SHALL use Contact Us as primary
and View order as secondary, SHALL name manual review, and SHALL NOT cancel
the order by itself.

#### Scenario: order-mail-SC-55 - Auction-won and setup-reminder name the setup bullets
**Serves:** Post-close letters - setup letters name what setup asks for

- **GIVEN** an auction order whose winner has not confirmed setup
- **WHEN** Grade10 sends the auction-won letter or the setup-reminder letter
- **THEN** the letter names delivery address, payment method, and billing
  address as bullets
- **AND** its primary action is Complete Order Setup
- **AND** it names a Confirm-by deadline

#### Scenario: order-mail-SC-56 - Setup overdue stays generic and does not cancel
**Serves:** Post-close letters - setup letters name what setup asks for

- **GIVEN** an auction order whose winner has not confirmed setup
- **WHEN** Grade10 sends the setup-overdue letter
- **THEN** the letter names order setup generically with no field list
- **AND** its primary action is Contact Us
- **AND** its secondary action is View order
- **AND** it does not cancel the order
