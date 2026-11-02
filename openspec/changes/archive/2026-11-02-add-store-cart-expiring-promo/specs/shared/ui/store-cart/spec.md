# Shared Store Cart — delta

## Feature set

- Site sale and promo outcomes
  - Near-expiry detail: lets a consumer mark an expiry detail line for the shared promo ticket's existing emphasis treatment

## ADDED Requirements

### Requirement: Promo tickets render consumer-owned detail emphasis

`HeldPromoCode` SHALL expose an optional consumer-owned `detailEmphasis`
boolean. `PromoTicket` SHALL apply its existing emphasis treatment only to the
detail slot when the value is true. The title slot SHALL continue to carry the
consumer-supplied discount, and the detail slot SHALL continue to carry the
consumer-supplied expiry and conditions text. The code, refusal treatment,
Apply availability, selection callback and list order SHALL remain unchanged.

When `detailEmphasis` is false or omitted, the detail slot SHALL render with
its existing plain treatment. The shared component SHALL NOT receive or parse
`expiresAt`, read the clock, calculate a 14-day window or derive this boolean;
the consumer SHALL own that state. The same prop-driven treatment SHALL work
for applicable and inapplicable tickets without changing their supplied copy.

<!-- trace:scenario id=g10.shared-store-cart.SC-n0y rev=1 -->
#### Scenario: g10.shared-store-cart.SC70 - An emphasized promo ticket keeps its slots
**Serves:** shared.ui-store-cart.US22 - Shopper sees public codes in the picker

- **GIVEN** a promo ticket supplied with a discount title, expiry and conditions detail, code, Apply callback and `detailEmphasis` true
- **WHEN** the shared promo ticket renders
- **THEN** only the existing detail slot uses the emphasis treatment
- **AND** the title and detail text remain exactly as supplied
- **AND** the code, Apply callback and ticket ordering remain available as before

<!-- trace:scenario id=g10.shared-store-cart.SC-rt4 rev=1 -->
#### Scenario: g10.shared-store-cart.SC71 - A plain promo ticket does not derive emphasis
**Serves:** shared.ui-store-cart.US22 - Shopper sees public codes in the picker

- **GIVEN** two otherwise identical promo tickets, one with `detailEmphasis` false and one with the field omitted
- **WHEN** the shared promo ticket renders them
- **THEN** both detail slots use the existing plain treatment
- **AND** their discount titles, expiry and conditions text, codes and callbacks remain exactly as supplied
- **AND** the shared component does not derive a different state from the displayed text or any clock

<!-- trace:scenario id=g10.shared-store-cart.SC-p5j rev=1 -->
#### Scenario: g10.shared-store-cart.SC72 - An inapplicable near-expiry ticket keeps its refusal treatment
**Serves:** shared.ui-store-cart.US22 - Shopper sees public codes in the picker

- **GIVEN** an inapplicable promo ticket supplied with an expiry detail, a refusal reason and `detailEmphasis` true
- **WHEN** the shared promo sheet renders the ticket
- **THEN** the ticket keeps its existing muted treatment and refusal reason
- **AND** it offers no Apply control while the expiry detail uses the existing emphasis treatment
- **AND** the title, detail text, code and list position remain unchanged
