# grade10-site/store/discounts Specification

## MODIFIED Requirements

### Requirement: Shopify discounts tagged public are codes open to everyone

The store SHALL read the shop's live code discounts tagged `public` and offer
each as a public code to guests and members alike. A public code SHALL be told
apart from the store's own codes by the shop's list, not by its spelling, and
SHALL be sent to the draft as the shop spells it, priced by the shop. A typed
public code SHALL apply for anyone. It SHALL take the order's one
discount-code slot. A code the list does not hold SHALL be resolved as the
store's own, so a member-only code typed by a guest is refused as a code
nobody minted. A shop that does not answer SHALL leave the list it last gave,
or none.

<!-- trace:scenario id=g10.store-discounts.SC-qjc rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-31 - A public code is listed to a guest and a member
**Serves:** g10.store-discounts.US5 - Collector finds a code open to everyone

- **GIVEN** a live Shopify code discount tagged `public`
- **WHEN** a guest's or a member's basket is quoted
- **THEN** the code is listed with what it offers and what it takes off this basket
- **AND** a member's list holds it beside their own codes and rewards

<!-- trace:scenario id=g10.store-discounts.SC-vys rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-32 - A typed public code rides as the shop spells it
**Serves:** g10.store-discounts.US5 - Collector finds a code open to everyone

- **GIVEN** a guest or member types a public code in any casing
- **WHEN** they check out
- **THEN** the draft carries the code as the shop spells it, and the shop prices it
- **AND** a second code or a wallet reward beside it is refused
