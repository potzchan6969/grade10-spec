## Feature set

- Accessibility
  - Struck price words: a discounted tile says which price is charged, in words the consumer supplies

## ADDED Requirements

### Requirement: A tile's struck price says which price is charged

Where a tile strikes a list price, it SHALL read the copy's `salePriceLabel`
before the price charged and `listPriceLabel` before the struck list price,
both visually hidden, wherever the consumer supplies them. The tile supplies no
word of its own; nothing on screen changes.

<!-- trace:scenario id=g10.shared-store-product-listing.SC-w4t rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-102 - A discounted tile names the price charged
**Serves:** Accessibility - a discounted tile names the price charged

- **GIVEN** a tile with a `price` and an `originalPrice`, and copy whose
  `salePriceLabel` is `Sale price` and `listPriceLabel` is `Was`
- **WHEN** a screen reader reads the tile
- **THEN** it reads `Sale price` before the price and `Was` before the struck
  list price, and neither word shows on screen
