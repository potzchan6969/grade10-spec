## ADDED Requirements

### Requirement: Signed-out Add to cart opens sign-in

When a collector is signed out, activating Add to cart on a listing card that
offers a cart control SHALL open the site's sign-in dialog and SHALL NOT add
a line to any cart. There is no guest cart from this control.

When the collector dismisses the dialog without signing in, they SHALL remain
signed out on the listing, and the cart SHALL be unchanged.

When sign-in succeeds and the collector remains on the listing with the same
intended product and quantity, the listing SHALL complete that add into the
signed-in member cart. When sign-in takes the collector away from the listing,
or the intended product or quantity is no longer available, the listing SHALL
NOT invent a later add.

#### Scenario: grade10-site-store-product-listing-SC-44 - Signed-out Add to cart opens sign-in

- **GIVEN** a signed-out collector on the browse listing, on a card that offers
  a cart control
- **WHEN** they activate Add to cart
- **THEN** the sign-in dialog opens over the listing
- **AND** no cart gains a line for that card

#### Scenario: grade10-site-store-product-listing-SC-45 - Dismissing sign-in adds nothing

- **GIVEN** a signed-out collector who opened sign-in from Add to cart on the
  listing
- **WHEN** they dismiss the dialog without signing in
- **THEN** they remain signed out on the listing
- **AND** the cart is unchanged

#### Scenario: grade10-site-store-product-listing-SC-46 - Sign-in on the listing completes the add

- **GIVEN** a signed-out collector who opened sign-in from Add to cart for a
  given card and quantity on the listing
- **WHEN** they sign in successfully and remain on the listing with that same
  intended card and quantity
- **THEN** the signed-in member cart holds that add
- **AND** the sign-in dialog is closed
