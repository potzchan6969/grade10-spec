## Feature set

- Pending tender
  - Optional consumer-controlled state
  - Disabled inputs, tender actions and Checkout
  - Accepted figures retained until the consumer answers

## ADDED Requirements

### Requirement: Consumer pending tender prevents conflicting actions

`CartDrawerProps` and `CartDrawerFooterProps` SHALL accept optional
`tenderPending: boolean`, defaulting to false. `CartDrawer` SHALL forward it
to its footer. While true, existing points and promo inputs, points Apply,
Use max, points Remove, promo Apply, held-code selection, promo Remove and
Checkout SHALL be disabled and their callbacks SHALL NOT be invoked.
An already-open promo sheet SHALL obey the same pending state. Accepted figures
and entered values SHALL remain visible. Clearing pending SHALL restore the
existing callback-presence and other availability guards, without invoking any
action automatically. The shared component SHALL NOT quote, persist or decide
when the consumer's operation finishes.

<!-- trace:scenario id=g10.shared-store-cart.SC-9yi rev=1 -->
#### Scenario: shared-ui-store-cart-SC-37 - Pending tender prevents a second action
**Serves:** shared-ui-store-cart-US-18 - Shopper waits for the current choice to finish

- **GIVEN** supplied action callbacks and an existing accepted summary
- **WHEN** the consumer sets tenderPending true, including with the promo sheet open
- **THEN** points and promo inputs and all tender actions and Checkout are disabled
- **AND** attempted activation invokes no action callback and preserves shown figures and entered values

<!-- trace:scenario id=g10.shared-store-cart.SC-nty rev=1 -->
#### Scenario: shared-ui-store-cart-SC-38 - Clearing pending restores existing availability
**Serves:** shared-ui-store-cart-US-18 - Shopper continues after the consumer answers

- **GIVEN** the drawer was pending with some action callbacks absent
- **WHEN** the consumer clears tenderPending
- **THEN** actions resume only where their existing callbacks and availability guards permit them
- **AND** no callback is invoked automatically

<!-- trace:scenario id=g10.shared-store-cart.SC-x24 rev=1 -->
#### Scenario: shared-ui-store-cart-SC-39 - Existing consumers keep their behavior
**Serves:** shared-ui-store-cart-US-18 - Shopper uses a drawer whose consumer supplies no pending state

- **WHEN** a consumer omits tenderPending or supplies false
- **THEN** the existing layout and callback-gated availability remain unchanged
