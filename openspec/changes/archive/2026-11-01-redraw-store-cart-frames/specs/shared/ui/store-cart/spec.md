## Feature set

- Site sale and promo outcomes
  - Which price is charged: hidden words say which of a struck list price and the price charged is which

## ADDED Requirements

### Requirement: A struck price says which price is charged

Wherever a cart line strikes a list price, the line SHALL read
`CartItemCopy.salePriceLabel` before the price charged and
`CartItemCopy.listPriceLabel` before the struck list price, both visually
hidden, so a screen reader says which price the shopper pays. Both words are
required on `CartItemCopy`; the block supplies no word of its own. A line with
no list price reads its price alone, with neither word. Nothing on screen
changes.

<!-- trace:scenario id=g10.shared-store-cart.SC-h7q rev=1 -->
#### Scenario: shared-ui-store-cart-SC-67 - A struck line names the price charged
**Serves:** shared-ui-store-cart-US-13 - Shopper reads a site sale on the cart lines

- **GIVEN** a line with a `price` and an `originalPrice`, and copy whose
  `salePriceLabel` is `Sale price` and `listPriceLabel` is `Was`
- **WHEN** a screen reader reads the line
- **THEN** it reads `Sale price` before the price and `Was` before the struck
  list price
- **AND** neither word shows on screen
- **AND** a line with no `originalPrice` reads its price with neither word
