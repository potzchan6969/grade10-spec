# grade10-site/store/product-page Specification

## Feature set

- Card page
  - Server-rendered card: name, description, and the one item's price and
    availability in the response HTML before any script runs
- Buying the one item
  - One item: the page offers one sellable item, the first variant for sale or
    else the first listed, with no size, option or variant choice
  - Add in place: the collector stays on that card and what the site says the
    cart holds accounts for the add
  - One line per item: adding the same item again carries the quantity on one
    line
- Sold-out item
  - Priced but unbuyable: an item nobody can buy keeps its price, reads Sold
    out, and offers nothing to press

## REMOVED Feature set

- Buying from the page
- Sold-out cards
- Held to the shop's count
- Said when it is news

## ADDED Requirements

### Requirement: A card's one item is added to the cart from its own page

A card's page SHALL let a collector choose a quantity and add that many of
its one sellable item to the storefront's cart, without leaving the page and
without returning to the grid. The item is the one
`grade10-site/commerce/product-status` names. The page SHALL NOT render or
require a choice among sizes, options or variants, and SHALL NOT show the
internal Shopify sale identity as a product choice or label.

After a card is added the collector SHALL still be on that card, and what the
site says the cart holds SHALL account for what was added. Adding the same
item again SHALL carry the quantity on one cart line.

<!-- trace:scenario id=g10.store-product-page.SC-fpg rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-33 - A card with several variants offers one item
**Serves:** grade10-site-store-product-page-US-03 - Collector adds the product from its page

- **GIVEN** a card listing a sold-out variant followed by two variants for sale
- **WHEN** a collector opens its page and adds without choosing anything
- **THEN** the page offers no size, option or variant choice
- **AND** the cart holds the first variant for sale

<!-- trace:scenario id=g10.store-product-page.SC-b01 rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-34 - A card with one item adds it
**Serves:** grade10-site-store-product-page-US-03 - Collector adds the product from its page

- **GIVEN** a card with one variant for sale
- **WHEN** a collector adds it without choosing anything
- **THEN** the cart holds that item

<!-- trace:scenario id=g10.store-product-page.SC-y8c rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-35 - The collector keeps their place
**Serves:** grade10-site-store-product-page-US-03 - Collector adds the product from its page

- **WHEN** a collector adds a card from its page
- **THEN** they are still on that card's address, reading that card
- **AND** what the site says the cart holds has changed to account for it

<!-- trace:scenario id=g10.store-product-page.SC-o6j rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-36 - The same item twice
**Serves:** grade10-site-store-product-page-US-03 - Collector adds the product from its page

- **GIVEN** a collector who has already added a card's item from its page
- **WHEN** they add it again
- **THEN** the cart holds the quantity they added, as one line rather than two

<!-- trace:scenario id=g10.store-product-page.SC-gvt rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-37 - A chosen quantity is added
**Serves:** grade10-site-store-product-page-US-03 - Collector adds the product from its page

- **GIVEN** a card with one variant for sale and an empty cart
- **WHEN** a collector sets the quantity to 3 on its page and adds
- **THEN** the cart holds 3 of that item, on one line

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

### Requirement: A card is added to the cart from its own page

**Reason:** The page no longer offers a choice among variants, so a scenario
that adds the grade a collector chose describes nothing the page does.

**Migration:** `A card's one item is added to the cart from its own page`
replaces it: the page adds its one item, the first variant for sale or else the
first listed, without a choice, and keeps the place-keeping and one-line rules.

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

<!-- trace:scenario id=g10.store-product-page.SC-b5k rev=2 -->
#### Scenario: grade10-site-store-product-page-SC-01 - A card answers whole
**Serves:** grade10-site-store-product-page-US-01 - Collector reads a card at its own address

- **GIVEN** a card with more than one Shopify variant
- **WHEN** its product address is fetched and no script executes
- **THEN** the response HTML contains that card's name and description and the
  price and availability of only the one item the page uses
- **AND** the rendered page shows no other variants' prices, availability, or
  names, and does not show the internal sale identity as a choice or label

<!-- trace:scenario id=g10.store-product-page.SC-ok3 rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-02 - Two cards, two pages
**Serves:** grade10-site-store-product-page-US-01 - Collector reads a card at its own address

- **WHEN** two product addresses are fetched
- **THEN** each response carries its own card's name and price, and its own
  title, meta description and `og:url`

### Requirement: A card nobody can buy says so where the buying happens

A card whose one item is sold out SHALL say so on its page, in the place a
collector would otherwise buy it. It SHALL NOT show a control that cannot be
used, and it SHALL NOT hide the item's price — a sold-out card still costs
what it costs, and a page with nothing where the buying goes reads as a page
that failed rather than a card that sold.

The item is sold out only when no variant the card lists is for sale. While
any is, the page offers that one, and shows no other variant as sold out or as
a choice.

<!-- trace:scenario id=g10.store-product-page.SC-prx rev=2 -->
#### Scenario: grade10-site-store-product-page-SC-11 - Nothing on the card is for sale
**Serves:** grade10-site-store-product-page-US-04 - Collector meets a product that cannot be bought

- **GIVEN** a card the catalogue lists with no variant for sale
- **WHEN** a collector opens its page
- **THEN** the page says the card is sold out
- **AND** the first listed variant's price is still shown
- **AND** there is nothing to press that would add it

<!-- trace:scenario id=g10.store-product-page.SC-1p0 rev=2 -->
#### Scenario: grade10-site-store-product-page-SC-12 - One grade sold, another still for sale
**Serves:** grade10-site-store-product-page-US-04 - Collector meets a product that cannot be bought

- **GIVEN** a card listing one sold-out variant followed by one for sale
- **WHEN** a collector opens its page
- **THEN** the page reads for sale, with the price of the variant for sale
- **AND** adding is offered for that variant
- **AND** the sold-out variant is shown neither as a choice nor as sold out

### Requirement: Signed-out Add to cart opens sign-in

When a collector is signed out, activating Add to cart on a product page that
offers it SHALL open the site's sign-in dialog and SHALL NOT add a line to any
cart. There is no guest cart from this control.

When the collector dismisses the dialog without signing in, they SHALL remain
signed out on that product page, and the cart SHALL be unchanged.

When sign-in succeeds and the collector remains on that product page with the
same intended quantity, the page SHALL complete that add of its one item into
the signed-in member cart, at the quantity asked for whatever the shop's count;
the cart's review answers that quantity. When sign-in takes the collector away
from the page, or the item can no longer be bought, the page SHALL NOT invent
a later add.

<!-- trace:scenario id=g10.store-product-page.SC-za5 rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-26 - Signed-out Add to cart opens sign-in
**Serves:** grade10-site-store-product-page-US-11 - Collector signs in to add from the product page

- **GIVEN** a signed-out collector on a product page that offers Add to cart
- **WHEN** they activate Add to cart
- **THEN** the sign-in dialog opens over the page
- **AND** no cart gains a line for that product

<!-- trace:scenario id=g10.store-product-page.SC-eeg rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-27 - Dismissing sign-in adds nothing
**Serves:** grade10-site-store-product-page-US-11 - Collector signs in to add from the product page

- **GIVEN** a signed-out collector who opened sign-in from Add to cart on a
  product page
- **WHEN** they dismiss the dialog without signing in
- **THEN** they remain signed out on that product page
- **AND** the cart is unchanged

<!-- trace:scenario id=g10.store-product-page.SC-0j7 rev=2 -->
#### Scenario: grade10-site-store-product-page-SC-28 - Sign-in on the product page completes the add
**Serves:** grade10-site-store-product-page-US-11 - Collector signs in to add from the product page

- **GIVEN** a signed-out collector who opened sign-in from Add to cart for a
  given quantity on a product page
- **WHEN** they sign in successfully and remain on that page with that same
  intended quantity
- **THEN** the signed-in member cart holds that add
- **AND** the sign-in dialog is closed
