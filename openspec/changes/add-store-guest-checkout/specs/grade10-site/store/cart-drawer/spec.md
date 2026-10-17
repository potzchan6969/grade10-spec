# grade10-site/store/cart-drawer Specification

## MODIFIED Requirements

### Requirement: A signed-out drawer leads with guest checkout

A signed-out collector's drawer SHALL offer Check out as guest as its primary
action, with a quiet Sign in link under it for points and rewards, and no
extra step between them and Shopify's page. A guest SHALL see no points
controls and no member's codes or rewards. Signing in from the drawer SHALL
hand this browser's cart to the account and reopen the drawer on the same
page, where points and the wallet then show.

<!-- trace:scenario id=g10.store-cart-drawer.SC-1dq rev=1 -->
#### Scenario: g10.store-cart-drawer.SC50 - A signed-out drawer checks out as a guest
**Serves:** g10.store-cart-drawer.US15 - Signed-out collector finds guest checkout first

- **GIVEN** a signed-out collector with a reviewed browser cart
- **WHEN** the drawer opens
- **THEN** its primary action is Check out as guest, with a Sign in link under it
- **AND** no points controls or member codes show
- **AND** pressing Check out as guest sends a guest checkout for the reviewed lines

<!-- trace:scenario id=g10.store-cart-drawer.SC-ftc rev=1 -->
#### Scenario: g10.store-cart-drawer.SC51 - Signing in from the drawer keeps the cart
**Serves:** g10.store-cart-drawer.US11 - Collector signs in from the drawer and keeps the cart

- **GIVEN** a signed-out collector with lines in the browser cart
- **WHEN** they choose Sign in under the checkout action and complete sign-in
- **THEN** the browser's lines merge into their member cart
- **AND** the drawer reopens on the same page with points and their wallet codes
