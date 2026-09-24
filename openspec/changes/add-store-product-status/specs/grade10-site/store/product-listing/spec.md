## Purpose

What the listing tells a collector about product availability, and how a
requested quantity reaches cart review.

## Feature set

- Listing availability
  - Tile rollup: a product is out of stock only when every Shopify variant is
    out of stock
  - No stock cue: tiles show availability without counts or scarcity
- Requested quantity
  - No browse ceiling: the collector's quantity reaches cart review without a
    stock-derived maximum

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
