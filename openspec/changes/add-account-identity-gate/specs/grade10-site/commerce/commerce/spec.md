## Feature set

- The identity bar at checkout
  - Priced first: the basket's goods are priced live before any order is made
  - A verified buyer above the bar: a buyer the identity store answers `verified` for proceeds; another is sent to verify
  - A guest above the bar: asked to sign in, because a standing belongs to an account

## ADDED Requirements

### Requirement: A checkout whose goods reach the identity bar needs a verified buyer

The system SHALL price the basket's goods live, before any order is made, and
compare the goods' value before any discount to the brand's bar. At or above
the bar it SHALL proceed only for a signed-in buyer whose standing is
`verified` on the day of the checkout; it SHALL refuse any other signed-in
buyer, naming the bar and the goods' value and sending them to their account
to verify; and it SHALL refuse a guest, asking them to sign in. A refused
checkout SHALL leave no order behind. Below the bar a checkout SHALL ask
nothing about identity. On a brand that deploys no identity store the bar
SHALL not exist.

#### Scenario: grade10-site-commerce-commerce-SC-26 - An unverified buyer above the bar is sent to verify

- **GIVEN** a signed-in buyer whose standing is `unverified` or `expired`, and a
  basket whose goods are worth the bar or more
- **WHEN** they check out
- **THEN** the checkout is refused naming the bar and the goods' value, no
  order is made, and they are sent to their account to verify

#### Scenario: grade10-site-commerce-commerce-SC-27 - A verified buyer above the bar checks out

- **GIVEN** a signed-in buyer whose standing is `verified`, and a basket whose
  goods are worth the bar or more
- **WHEN** they check out
- **THEN** the checkout proceeds as any other

#### Scenario: grade10-site-commerce-commerce-SC-28 - A basket below the bar asks nothing

- **GIVEN** a basket whose goods are worth less than the bar
- **WHEN** any buyer checks out
- **THEN** no standing is read and the checkout proceeds as any other

#### Scenario: grade10-site-commerce-commerce-SC-29 - A guest above the bar is asked to sign in

- **GIVEN** a buyer with no session, and a basket whose goods are worth the bar
  or more
- **WHEN** they check out with a typed address
- **THEN** the checkout is refused and they are asked to sign in, and no order
  is made
