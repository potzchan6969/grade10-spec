# shared/ui/store-cart Specification

## MODIFIED Requirements

### Requirement: The promo sheet merges the public codes it is given

`CartDrawer` SHALL accept an optional `publicPromoCodes` list of
`HeldPromoCode` and `copy.publicPromoCodes` heading. The promo sheet SHALL
list the codes that can apply — held first, then public — under that heading,
and the codes that cannot apply apart from them, muted with their reasons. A
public code SHALL be picked through `onSelectHeldPromo` like a held one.

<!-- trace:scenario id=g10.shared-store-cart.SC-g6x rev=1 -->
#### Scenario: shared-ui-store-cart-SC-81 - Public codes join the held list under one heading
**Serves:** shared.ui-store-cart.US22 - Shopper sees public codes in the picker

- **GIVEN** a drawer given one applicable held code, one applicable public code and one public code that cannot apply
- **WHEN** the shopper opens the promo sheet
- **THEN** both applicable codes are listed under `copy.publicPromoCodes` with an Apply control
- **AND** the inapplicable public code is listed apart, muted with its reason
