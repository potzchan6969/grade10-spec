## Feature set

- Post-close letters
  - Setup series: auction-won asks for order setup; one setup reminder at 24h (formerly address reminder); setup overdue at the 48-hour setup deadline while setup is incomplete
  - Payment overdue: the letter at invoice `expired` (replacing invoice-expired naming)

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
