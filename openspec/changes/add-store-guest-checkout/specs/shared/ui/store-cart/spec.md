# shared/ui/store-cart Specification

## MODIFIED Requirements

### Requirement: The footer offers a signed-out shopper a sign-in under checkout

`CartDrawerFooter` and `CartDrawer` SHALL accept an optional `onSignIn`
callback. With `onSignIn` and `copy.signInAction` supplied, the footer SHALL
render one quiet line under the checkout button — `copy.signInPrompt`, the
`copy.signInAction` link and `copy.signInSuffix` — whose link calls
`onSignIn`, disabled under the same loading, pending and redirecting rules as
checkout. Without `onSignIn` the line SHALL NOT render. `heldPromoCodes: null`
SHALL hide the member's held-code section, its empty state and the loyalty
call to action.

<!-- trace:scenario id=g10.shared-store-cart.SC-v4g rev=1 -->
#### Scenario: shared-ui-store-cart-SC-80 - A guest footer offers sign-in under checkout
**Serves:** shared.ui-store-cart.US21 - Shopper sees a guest checkout in the cart footer

- **GIVEN** a footer given `onSignIn`, `copy.signInAction` and `heldPromoCodes: null`
- **WHEN** it renders a ready cart
- **THEN** a sign-in line shows under the checkout button and its link calls `onSignIn`
- **AND** no member held-code section, empty state or loyalty call to action shows
- **AND** while the drawer is pending or redirecting the link is disabled
