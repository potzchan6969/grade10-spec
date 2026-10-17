# grade10-site/store/cart-drawer Specification

## MODIFIED Requirements

### Requirement: The promo picker lists public codes to everyone

The drawer's promo picker SHALL list the public codes the quote answers for
the reviewed basket. A guest SHALL see the public codes alone. A member SHALL
see them in one list with their own codes and rewards, the codes that fit
first and the soonest to expire first among them, across both kinds.

<!-- trace:scenario id=g10.store-cart-drawer.SC-f9m rev=1 -->
#### Scenario: g10.store-cart-drawer.SC52 - A guest picks a public code
**Serves:** g10.store-cart-drawer.US12 - Guest applies a public code

- **GIVEN** a signed-out collector and a live public code that fits the basket
- **WHEN** they open the promo picker
- **THEN** the public code is listed with no member section or loyalty call to action
- **AND** picking or typing it applies it to the quote

<!-- trace:scenario id=g10.store-cart-drawer.SC-7rc rev=1 -->
#### Scenario: g10.store-cart-drawer.SC53 - A member sees public codes beside their own
**Serves:** g10.store-cart-drawer.US13 - Member sees public codes beside their own

- **GIVEN** a member holding a wallet code and a live public code
- **WHEN** they open the promo picker
- **THEN** both are listed under one heading, those that fit first and the soonest to expire first
