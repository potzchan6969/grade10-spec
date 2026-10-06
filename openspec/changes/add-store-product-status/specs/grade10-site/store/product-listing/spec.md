# grade10-site/store/product-listing Specification

## REMOVED Feature set

- Held to the shop's count
- Said when it is news

## REMOVED Requirements

### Requirement: The browse listing holds a collector to the shop's count

**Reason:** A stock-derived maximum prevents a collector from sending the full
requested quantity to cart review, and it reveals a difference between
available variants based on remaining stock.

**Migration:** Listing add controls retain the collector's requested quantity
without a stock-derived ceiling. `grade10-site/commerce/product-status` defines
availability and forbids browse-time stock counts; `grade10-site/store/cart-validation`
reviews the quantity when the cart opens and reports any short fill.

### Requirement: The browse listing says how many are left when that is news

**Reason:** A remaining-count message and a quantity-at-limit message disclose
stock on a browse surface, which `grade10-site/commerce/product-status` rules
out.

**Migration:** Remove remaining-count and scarcity messages from listing tiles.
The listing continues to report the product's availability as defined by
`grade10-site/commerce/product-status`.

## MODIFIED Requirements

### Requirement: Signed-out Add to cart opens sign-in

When a collector is signed out, activating Add to cart on a listing card that
offers a cart control SHALL open the site's sign-in dialog and SHALL NOT add
a line to any cart. There is no guest cart from this control.

When the collector dismisses the dialog without signing in, they SHALL remain
signed out on the listing, and the cart SHALL be unchanged.

When sign-in succeeds and the collector remains on the listing with the same
intended product and quantity, the listing SHALL complete that add into the
signed-in member cart, at the quantity asked for whatever the shop's count;
the cart's review answers that quantity. When sign-in takes the collector away
from the listing, or the intended card can no longer be bought, the listing
SHALL NOT invent a later add.

<!-- trace:scenario id=g10.store-product-listing.SC-dhn rev=1 -->
#### Scenario: grade10-site-store-product-listing-SC-44 - Signed-out Add to cart opens sign-in
**Serves:** grade10-site-store-product-listing-US-12 - Collector signs in to add from the listing

- **GIVEN** a signed-out collector on the browse listing, on a card that offers
  a cart control
- **WHEN** they activate Add to cart
- **THEN** the sign-in dialog opens over the listing
- **AND** no cart gains a line for that card

<!-- trace:scenario id=g10.store-product-listing.SC-xyt rev=1 -->
#### Scenario: grade10-site-store-product-listing-SC-45 - Dismissing sign-in adds nothing
**Serves:** grade10-site-store-product-listing-US-12 - Collector signs in to add from the listing

- **GIVEN** a signed-out collector who opened sign-in from Add to cart on the
  listing
- **WHEN** they dismiss the dialog without signing in
- **THEN** they remain signed out on the listing
- **AND** the cart is unchanged

<!-- trace:scenario id=g10.store-product-listing.SC-9gl rev=1 -->
#### Scenario: grade10-site-store-product-listing-SC-46 - Sign-in on the listing completes the add
**Serves:** grade10-site-store-product-listing-US-12 - Collector signs in to add from the listing

- **GIVEN** a signed-out collector who opened sign-in from Add to cart for a
  given card and quantity on the listing
- **WHEN** they sign in successfully and remain on the listing with that same
  intended card and quantity
- **THEN** the signed-in member cart holds that add
- **AND** the sign-in dialog is closed
