## ADDED Requirements

### Requirement: Signed-out Add to cart opens sign-in

When a collector is signed out, activating Add to cart on a product page that
offers it SHALL open the site's sign-in dialog and SHALL NOT add a line to any
cart. There is no guest cart from this control.

When the collector dismisses the dialog without signing in, they SHALL remain
signed out on that product page, and the cart SHALL be unchanged.

When sign-in succeeds and the collector remains on that product page with the
same intended variant and quantity, the page SHALL complete that add into the
signed-in member cart. When sign-in takes the collector away from the page, or
the intended variant or quantity is no longer available, the page SHALL NOT
invent a later add.

#### Scenario: grade10-site-store-product-page-SC-26 - Signed-out Add to cart opens sign-in

- **GIVEN** a signed-out collector on a product page that offers Add to cart
- **WHEN** they activate Add to cart
- **THEN** the sign-in dialog opens over the page
- **AND** no cart gains a line for that product

#### Scenario: grade10-site-store-product-page-SC-27 - Dismissing sign-in adds nothing

- **GIVEN** a signed-out collector who opened sign-in from Add to cart on a
  product page
- **WHEN** they dismiss the dialog without signing in
- **THEN** they remain signed out on that product page
- **AND** the cart is unchanged

#### Scenario: grade10-site-store-product-page-SC-28 - Sign-in on the product page completes the add

- **GIVEN** a signed-out collector who opened sign-in from Add to cart for a
  given variant and quantity on a product page
- **WHEN** they sign in successfully and remain on that page with that same
  intended variant and quantity
- **THEN** the signed-in member cart holds that add
- **AND** the sign-in dialog is closed
