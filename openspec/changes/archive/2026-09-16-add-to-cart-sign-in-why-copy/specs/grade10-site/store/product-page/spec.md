## ADDED Requirements

### Requirement: Add to cart sign-in title names why

When a signed-out collector opens the sign-in dialog from Add to cart on a
product page that offers Add to cart, the dialog title SHALL be
**Sign In to Add to Cart**. The product page SHALL pass that wording through
the sign-in surface's consumer-owned title copy.

#### Scenario: grade10-site-store-product-page-SC-29 - Add to cart sign-in title names why
**Serves:** grade10-site-store-product-page-US-12 - Collector sees why sign-in is asked when adding from the product page

- **GIVEN** a signed-out collector on a product page that offers Add to cart
- **WHEN** they activate Add to cart and the sign-in dialog opens
- **THEN** the dialog title is **Sign In to Add to Cart**
