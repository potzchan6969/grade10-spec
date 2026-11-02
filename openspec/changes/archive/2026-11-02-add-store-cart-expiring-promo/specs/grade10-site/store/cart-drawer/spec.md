# Cart Drawer — delta

## Feature set

- Member tender context
  - Near-expiry promo detail: makes a live picker code's existing expiry detail noticeable without changing its discount title, wording, or choice behavior

## ADDED Requirements

### Requirement: The cart picker emphasizes live near-expiry promo details

For every live held or public promo code that the cart picker displays, the
Grade10 consumer SHALL keep the existing discount in the title slot and the
existing expiry and conditions text in the detail slot. It SHALL derive the
ticket's consumer-owned `detailEmphasis` boolean from the live quote's existing
`expiresAt` value and the consumer clock: the value SHALL be true when the
code expires within the last 14 days, including exactly 14 days, and false
when the live code is more than 14 days from expiry or has no expiry.

The same rule SHALL apply to held and public codes and to a live code the
quote lists as unable to apply. Existing muted refusal treatment, refusal
reason, Apply availability, selection behavior and list ordering SHALL remain
unchanged. The consumer SHALL NOT change the title, detail text, code,
translation key or date format, and SHALL NOT replace either existing ticket
slot with expiry text.

For an applicable code, the title SHALL continue to carry the discount and
the `detailLabel` supplied to the shared ticket SHALL carry the existing
expiry/conditions detail, such as the existing `Use by` string; the mapper
SHALL NOT put a repeated discount-worth value in that detail slot. This is a
slot-assignment correction using existing copy, not a new or changed message.

<!-- trace:scenario id=g10.store-cart-drawer.SC-dsp rev=1 -->
#### Scenario: g10.store-cart-drawer.SC59 - A near-expiry held promo keeps its ticket slots
**Serves:** g10.store-cart-drawer.US4 - Signed-in collector reads tender choices for the reviewed basket

- **GIVEN** a signed-in collector with a reviewed basket and a live held promo whose quote expiry is exactly 14 days from the current consumer clock
- **WHEN** the collector opens the cart promo picker
- **THEN** the ticket title continues to show the discount
- **AND** the existing expiry and conditions text remains in the detail slot with the near-expiry emphasis
- **AND** the code, Apply control and picker ordering remain unchanged

<!-- trace:scenario id=g10.store-cart-drawer.SC-x5k rev=1 -->
#### Scenario: g10.store-cart-drawer.SC60 - Distant and undated promos stay plain
**Serves:** g10.store-cart-drawer.US4 - Signed-in collector reads tender choices for the reviewed basket

- **GIVEN** a signed-in collector with a reviewed basket, one live held promo expiring more than 14 days from the current consumer clock and one live held promo with no quote expiry
- **WHEN** the collector opens the cart promo picker
- **THEN** both tickets keep their discount titles and existing expiry or conditions details in their original slots
- **AND** neither detail slot receives the near-expiry emphasis
- **AND** codes, Apply controls and list ordering remain unchanged

<!-- trace:scenario id=g10.store-cart-drawer.SC-h3r rev=1 -->
#### Scenario: g10.store-cart-drawer.SC61 - A guest sees emphasis on a public promo detail
**Serves:** g10.store-cart-drawer.US12 - Guest applies a public code

- **GIVEN** a signed-out collector with a reviewed browser cart and a live public promo expiring within the last 14 days
- **WHEN** the collector opens the cart promo picker
- **THEN** the public code remains in the existing guest list with its discount title and expiry or conditions detail in separate slots
- **AND** the existing detail slot uses the near-expiry emphasis without new wording
- **AND** the guest can use the existing Apply behavior

<!-- trace:scenario id=g10.store-cart-drawer.SC-y5o rev=1 -->
#### Scenario: g10.store-cart-drawer.SC62 - A member keeps public promo emphasis in the merged list
**Serves:** g10.store-cart-drawer.US13 - Member sees public codes beside their own

- **GIVEN** a signed-in collector with one live held promo and one live public promo, both expiring within the last 14 days
- **WHEN** the collector opens the merged cart promo picker
- **THEN** both codes remain under the existing picker heading in the existing order
- **AND** each ticket keeps its discount title and expiry or conditions detail in separate slots with the near-expiry emphasis on the detail slot
- **AND** both existing Apply controls remain available

<!-- trace:scenario id=g10.store-cart-drawer.SC-0pz rev=1 -->
#### Scenario: g10.store-cart-drawer.SC63 - An inapplicable near-expiry held promo stays muted
**Serves:** g10.store-cart-drawer.US4 - Signed-in collector reads tender choices for the reviewed basket

- **GIVEN** a signed-in collector with a reviewed basket and a live held promo expiring within the last 14 days that the quote marks unable to apply
- **WHEN** the collector opens the cart promo picker
- **THEN** the ticket remains in the existing inapplicable section with its muted treatment, refusal reason and no Apply control
- **AND** its discount title and expiry or conditions detail remain in separate slots, with only the detail slot emphasized
- **AND** the code and list ordering remain unchanged

<!-- trace:scenario id=g10.store-cart-drawer.SC-cke rev=1 -->
#### Scenario: g10.store-cart-drawer.SC64 - A public near-expiry refusal stays muted
**Serves:** g10.store-cart-drawer.US12 - Guest applies a public code

- **GIVEN** a signed-out collector with a reviewed browser cart and a live public promo expiring within the last 14 days that the quote marks unable to apply
- **WHEN** the collector opens the cart promo picker
- **THEN** the public code remains in the existing guest list with its muted treatment, refusal reason and no Apply control
- **AND** its discount title and existing expiry or conditions detail remain in separate slots, with only the detail slot emphasized
- **AND** the code and list ordering remain unchanged
