## Feature set

- Tender action gating
  - Typed promo entry: exposes code entry only when the application can apply a typed code
  - Held-code selection: exposes selection only when the application can apply a held code
  - Points entry: exposes points entry only when the application can apply points
  - Tender removal: exposes removal only when the application can remove applied tender

## ADDED Requirements

### Requirement: Promo actions render only when they can act

The cart drawer SHALL render typed promo-code entry and its Apply control only
when the consumer supplies `onApplyPromo`. It SHALL render an applicable held
promo code's Apply control only when the consumer supplies
`onSelectHeldPromo`. A missing callback SHALL make the corresponding action
absent, not present and inert or visibly disabled. Supplied held-code labels,
eligibility details, and refusal reasons SHALL remain visible.

When the matching callbacks are supplied, the drawer SHALL preserve the
existing interactive behavior and state-specific disabled and loading rules.

<!-- trace:scenario id=g10.shared-store-cart.SC-ka5 rev=1 -->
#### Scenario: shared-ui-store-cart-SC-32 - Promo context is display-only without callbacks
**Serves:** shared-ui-store-cart-US-09 - the promo context is display-only without callbacks

- **GIVEN** an open cart drawer with one applicable and one inapplicable held promo code
- **AND** the consumer supplies no typed-code apply or held-code selection callback
- **WHEN** the shopper opens the promo-code view
- **THEN** both held codes remain visible with their supplied labels and details
- **AND** the inapplicable code's refusal reason remains visible
- **AND** the typed-code input and Apply control are absent
- **AND** the applicable held code has no Apply control

<!-- trace:scenario id=g10.shared-store-cart.SC-rxp rev=1 -->
#### Scenario: shared-ui-store-cart-SC-33 - Promo callbacks expose the matching actions
**Serves:** shared-ui-store-cart-US-09 - promo callbacks expose the matching actions

- **GIVEN** an open cart drawer with an applicable held promo code
- **AND** the consumer supplies typed-code apply and held-code selection callbacks
- **WHEN** the shopper opens the promo-code view
- **THEN** the typed-code input and Apply control are present
- **AND** the applicable held code has an Apply control
- **AND** activating each action invokes only its matching callback

### Requirement: Points actions render only when they can act

The cart drawer SHALL preserve supplied points balance, basket ceiling, and
conversion-rate context whenever points context is supplied. It SHALL render
the points amount input and Apply control only when the consumer supplies
`onApplyPoints`. It SHALL render Use max only when the consumer supplies
`onUseMaxPoints`. A missing callback SHALL make the corresponding action
absent, not present and inert or visibly disabled. The drawer SHALL keep the
reviewed cart summary unchanged when no points-apply callback is supplied.

When the matching callbacks are supplied, the drawer SHALL preserve the
existing interactive behavior and state-specific disabled and loading rules.

<!-- trace:scenario id=g10.shared-store-cart.SC-x7g rev=1 -->
#### Scenario: shared-ui-store-cart-SC-34 - Points context is display-only without callbacks
**Serves:** shared-ui-store-cart-US-09 - the points context is display-only without callbacks

- **GIVEN** an open cart drawer with supplied points balance, basket ceiling, and conversion-rate context
- **AND** the consumer supplies no points-apply or Use max callback
- **WHEN** the shopper opens the points disclosure
- **THEN** the supplied points context remains visible
- **AND** the points amount input, Apply control, and Use max control are absent
- **AND** no points amount is applied and the cart summary is unchanged

<!-- trace:scenario id=g10.shared-store-cart.SC-q34 rev=1 -->
#### Scenario: shared-ui-store-cart-SC-35 - Points callbacks expose the matching actions
**Serves:** shared-ui-store-cart-US-09 - points callbacks expose the matching actions

- **GIVEN** an open cart drawer with supplied points balance, basket ceiling, and conversion-rate context
- **AND** the consumer supplies points-apply and Use max callbacks
- **WHEN** the shopper opens the points disclosure
- **THEN** the points amount input, Apply control, and Use max control are present
- **AND** activating Apply or Use max invokes only its matching callback
- **AND** the supplied points context remains visible

### Requirement: Tender actions are gated independently

The drawer SHALL evaluate each tender callback independently. The presence or
absence of one callback SHALL NOT add, remove, or disable an unrelated tender
action. Applied promo and points values SHALL remain displayable without their
matching removal callbacks, but the corresponding Remove control SHALL be
absent when that callback is missing. Promo and points disclosure controls
SHALL likewise be absent when their matching state-change callbacks are
missing.

<!-- trace:scenario id=g10.shared-store-cart.SC-ufi rev=1 -->
#### Scenario: shared-ui-store-cart-SC-36 - One missing callback removes only its action
**Serves:** shared-ui-store-cart-US-09 - one missing callback removes only its action

- **GIVEN** an open cart drawer with all tender context and callbacks supplied except one callback
- **WHEN** the drawer renders the tender controls
- **THEN** only the action owned by the missing callback is absent
- **AND** unrelated supplied actions remain available under their normal state rules
- **AND** rendering or activating an unrelated action does not invoke the missing callback
