## ADDED Requirements

### Requirement: The page's struck price says which price is charged

Where the product page strikes a list price beside the price charged, it SHALL
read the store catalogue's Sale price word before the price charged and its Was
word before the struck list price, both visually hidden, in the page's
language. Nothing on screen changes.

<!-- trace:scenario id=g10.store-product-page.SC-r2m rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-39 - A discounted card names the price charged
**Serves:** grade10-site-store-product-page-US-01 - Collector reads a card at its own address

- **GIVEN** a card whose item has a compare-at price above its price
- **WHEN** a screen reader reads the page's prices in English
- **THEN** it reads `Sale price` before the price and `Was` before the struck
  list price, and neither word shows on screen
