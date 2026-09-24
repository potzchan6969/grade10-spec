## Purpose

What one sellable item a collector can add from its product page, and whether
that item can be bought.

## Feature set

- Product-page sale item
  - One item: the page presents one sellable product item without a
    shopper-facing size, option, or variant choice
  - Internal identity: the Shopify sale identifier carries availability and
    cart adds without becoming a product label
  - Page response: server-rendered name and description with only that item's
    price and availability
  - Quantity request: the requested quantity reaches cart review without a
    stock-derived ceiling
- Sold-out item
  - Price kept: the item remains priced when its internal Shopify variant is
    out of stock
  - No add: the page offers no action that cannot add the item

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
The page continues to show its one sellable item's price and availability.
Shopify's sale identifier remains internal and is not a product choice or
display label.

## MODIFIED Requirements

### Requirement: A card answers at its own address

The site SHALL answer a product address with that card's page: its name, its
description, and the price and availability of the one Shopify sale identity
the page uses for the sellable product item, in the response HTML without any
script executing. The rendered page SHALL NOT show other variants' prices,
availability or names, and SHALL NOT render the internal sale identity as a
product choice or label.

Two product addresses SHALL answer with their own card — the page a collector
reads is the one the address names, not the catalogue it came from.

#### Scenario: grade10-site-store-product-page-SC-01 - A card answers whole
**Serves:** grade10-site-store-product-page-US-01 - Collector reads a card at its own address

- **GIVEN** a card with more than one Shopify variant
- **WHEN** its product address is fetched and no script executes
- **THEN** the response HTML contains that card's name and description and the
  price and availability of only the one item the page uses
- **AND** the rendered page shows no other variants' prices, availability, or
  names, and does not show the internal sale identity as a choice or label

#### Scenario: grade10-site-store-product-page-SC-02 - Two cards, two pages
**Serves:** grade10-site-store-product-page-US-01 - Collector reads a card at its own address

- **WHEN** two product addresses are fetched
- **THEN** each response carries its own card's name and price, and its own
  title, meta description and `og:url`
