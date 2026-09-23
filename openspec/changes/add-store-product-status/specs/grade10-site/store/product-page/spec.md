## REMOVED Requirements

### Requirement: A card's page holds a collector to the shop's count

**Reason:** A stock-derived maximum prevents a collector from sending the full
requested quantity to cart review, and it reveals a difference between
available variants based on remaining stock.

**Migration:** Product-page add controls retain the collector's requested
quantity without a stock-derived ceiling. `grade10-site/commerce/product-status`
defines availability and forbids browse-time stock counts;
`grade10-site/store/cart-validation` reviews the quantity when the cart opens
and reports any short fill.

### Requirement: A card's page says how many are left when that is news

**Reason:** Remaining-count and scarcity messages on a product page conflict
with `grade10-site/commerce/product-status`, which limits browse surfaces to
whether a variant can be bought.

**Migration:** Remove remaining-count and scarcity messages from the page.
The page continues to show each variant's price and availability, as required
by `grade10-site/commerce/product-status` and the existing product-page
capability.
