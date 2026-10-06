# grade10-site/commerce/product-status Specification

## Purpose

What a collector is told about buying a product: Shopify's answer for its
variants, the listing tile's product-level rollup, and the product page's one
internal sale identity. This capability also defines the answer for a quantity
the collector asks for. When the store acts on an answer for a cart, that is
`grade10-site/store/cart-validation`'s.

## Feature set

- Variant availability
  - Shop's answer: a variant is available when the shop offers it for sale on
    the store's channel, out of stock when it does not
  - No second derivation: the store reads neither a count nor the shop's
    inventory policy to decide availability
- Requested quantity
  - Three answers: a request is fillable, fillable in part naming what can be
    filled, or not fillable
  - Count as bound: only a count above zero the shop exposes bounds a request
- Cards on browse surfaces
  - Tile rollup: a card is available while any variant on it is
  - One item per card: the tile and the page show one item's price, and both
    add it — the first variant for sale or else the first listed, using its
    internal Shopify sale identity
  - No variant choice: the page does not render the Shopify variant as a
    shopper-facing choice or label
  - No quantity: browse surfaces say whether the card or its one page item can
    be bought and nothing about how many remain
  - No browse ceiling: a browse add control keeps the quantity a collector asks
    for, whatever the shop's count
  - Priced but unbuyable: an out-of-stock variant keeps its price and offers no
    control that cannot be used
- Unpublished products
  - Absent, not marked: an unpublished product is missing from the listing and
    its address refuses

## ADDED Requirements

### Requirement: A variant's availability is the shop's answer for it

The shop decides whether a variant can be bought, and the store repeats its
answer.

**Shop's answer** - The store SHALL take a variant's availability from the
shop: a variant the shop offers for sale on the store's sales channel SHALL be
available, and a variant the shop does not SHALL be out of stock. A collector
SHALL read out of stock as Sold out.

**No second derivation** - The store SHALL NOT derive availability from a
count, and SHALL NOT read the shop's inventory policy.

**Zero or no count** - A variant the shop keeps offering at zero quantity
SHALL be available; a variant the shop stops offering at zero SHALL be out of
stock; a variant whose count the shop does not expose SHALL be whatever the
shop answers. Whether a variant sells past zero is decided on the shop.

**Purchasable** - The sale identity a surface offers SHALL be purchasable
when it is available, whatever count remains, and SHALL NOT be purchasable on
any surface when it is out of stock.

<!-- trace:scenario id=g10.commerce-product-status.SC-zdl rev=1 -->
#### Scenario: grade10-site-commerce-product-status-SC-01 - The shop offers the variant
**Serves:** grade10-site-commerce-product-status-US-01 - Collector sees whether a card can be bought

- **GIVEN** a variant the shop offers for sale with a count of 12
- **THEN** it is available
- **AND** it can be added to the cart

<!-- trace:scenario id=g10.commerce-product-status.SC-dvw rev=1 -->
#### Scenario: grade10-site-commerce-product-status-SC-02 - The shop no longer offers the variant
**Serves:** grade10-site-commerce-product-status-US-01 - Collector sees whether a card can be bought

- **GIVEN** a variant the shop stopped offering when its count reached 0
- **THEN** it is out of stock
- **AND** it cannot be added to the cart

<!-- trace:scenario id=g10.commerce-product-status.SC-jwx rev=1 -->
#### Scenario: grade10-site-commerce-product-status-SC-03 - The shop sells past zero
**Serves:** grade10-site-commerce-product-status-US-01 - Collector sees whether a card can be bought

- **GIVEN** a variant the shop still offers for sale at a count of 0
- **THEN** it is available
- **AND** it can be added to the cart, exactly as a variant with 12 can

<!-- trace:scenario id=g10.commerce-product-status.SC-w6q rev=1 -->
#### Scenario: grade10-site-commerce-product-status-SC-04 - The shop exposes no count
**Serves:** grade10-site-commerce-product-status-US-01 - Collector sees whether a card can be bought

- **GIVEN** a variant the shop offers for sale and exposes no count for
- **THEN** it is available
- **AND** it can be added to the cart

### Requirement: Availability is also answerable for a requested quantity

A cart line or a checkout line asks for a quantity, and the store answers for
the variant and that quantity together.

**Three answers** - Where a quantity is requested — a cart line, or a line
offered for checkout — the store SHALL answer for the variant and that quantity
together, as one of three outcomes.

| Answer | When |
| --- | --- |
| Fillable | The variant is available, and the shop exposes no bounding count or the request is at or below it |
| Fillable in part | The variant is available, the shop exposes a count above zero, and the request is above it; the answer names that count |
| Not fillable | The variant is out of stock |

**Count as bound** - Only a count above zero SHALL bound a request. A shop
that exposes no count for a variant, or a count of zero while still offering
it, SHALL bound nothing: every request of that variant is fillable, and the
shop's own checkout answers for what it can deliver.

**Availability unchanged** - Requesting a quantity SHALL NOT change a
variant's availability. A variant that is fillable in part for a request of 50
SHALL remain available.

<!-- trace:scenario id=g10.commerce-product-status.SC-csg rev=1 -->
#### Scenario: grade10-site-commerce-product-status-SC-05 - The request can be filled
**Serves:** grade10-site-commerce-product-status-US-02 - Collector asks for more than the shop can fill

- **WHEN** 3 are requested of an available variant with a count of 12
- **THEN** the request is fillable

<!-- trace:scenario id=g10.commerce-product-status.SC-fhg rev=1 -->
#### Scenario: grade10-site-commerce-product-status-SC-06 - The request can be filled exactly
**Serves:** grade10-site-commerce-product-status-US-02 - Collector asks for more than the shop can fill

- **WHEN** 12 are requested of an available variant with a count of 12
- **THEN** the request is fillable

<!-- trace:scenario id=g10.commerce-product-status.SC-l64 rev=1 -->
#### Scenario: grade10-site-commerce-product-status-SC-07 - More is asked for than the count
**Serves:** grade10-site-commerce-product-status-US-02 - Collector asks for more than the shop can fill

- **WHEN** 5 are requested of an available variant with a count of 2
- **THEN** the request is fillable in part, naming 2
- **AND** the variant is still available

<!-- trace:scenario id=g10.commerce-product-status.SC-jj1 rev=1 -->
#### Scenario: grade10-site-commerce-product-status-SC-08 - Nothing remains to fill the request
**Serves:** grade10-site-commerce-product-status-US-02 - Collector asks for more than the shop can fill

- **WHEN** 5 are requested of an out-of-stock variant
- **THEN** the request is not fillable

<!-- trace:scenario id=g10.commerce-product-status.SC-2mz rev=1 -->
#### Scenario: grade10-site-commerce-product-status-SC-09 - An unbounded variant fills any request
**Serves:** grade10-site-commerce-product-status-US-02 - Collector asks for more than the shop can fill

- **GIVEN** an available variant the shop exposes no count for, and another the
  shop still offers at a count of 0
- **WHEN** 50 are requested of each
- **THEN** both requests are fillable

### Requirement: A browse surface communicates no quantity beyond whether a variant can be bought

While browsing, a collector learns whether a variant can be bought and nothing
about how many remain.

**No quantity** - The listing and a card's own page SHALL communicate whether
a variant can be bought and nothing more about how much remains.

**No scarcity cue** - Neither SHALL display a remaining count, a scarcity
treatment, or any label that distinguishes one available variant from another
by quantity, so two available variants are offered identically however far
apart their counts are.

**No browse ceiling** - A browse add control SHALL NOT cap or reduce a
requested quantity to the shop's count. The quantity a collector asks for
reaches the cart, whose review answers it.

**Browse surfaces only** - This binds the surfaces a collector browses on.
What the cart tells a collector about a line it could not fill in full is
`grade10-site/store/cart-validation`'s, and is told at the moment the store
acts on the quantity rather than as a cue to buy sooner.

<!-- trace:scenario id=g10.commerce-product-status.SC-my5 rev=1 -->
#### Scenario: grade10-site-commerce-product-status-SC-10 - A scarce variant is offered as any other
**Serves:** grade10-site-commerce-product-status-US-01 - Collector sees whether a card can be bought

- **GIVEN** one available variant with a count of 1 and another with a count of
  400
- **WHEN** a collector sees each of them on the listing
- **THEN** both read available, with the same treatment and the same controls
- **AND** neither shows a remaining count or a scarcity label

<!-- trace:scenario id=g10.commerce-product-status.SC-oaw rev=1 -->
#### Scenario: grade10-site-commerce-product-status-SC-11 - No count reaches the collector while browsing
**Serves:** grade10-site-commerce-product-status-US-01 - Collector sees whether a card can be bought

- **WHEN** the listing or a card's page communicates a variant's availability
- **THEN** it names no remaining quantity

<!-- trace:scenario id=g10.commerce-product-status.SC-0pg rev=1 -->
#### Scenario: grade10-site-commerce-product-status-SC-17 - A browse add keeps the quantity asked for
**Serves:** grade10-site-commerce-product-status-US-02 - Collector asks for more than the shop can fill

- **GIVEN** a card whose item the shop offers at a count of 2
- **WHEN** a collector asks for 5 on the card's listing tile, and again on the
  card's page, and adds each
- **THEN** each add control keeps 5, with no ceiling and no remaining count
- **AND** the cart line requests what was added, for the cart's review to
  answer as fillable in part

### Requirement: A card's listing availability is that of its most available variant

A card's listing tile is available while any Shopify variant is available.

**Tile rollup** - Where a card lists more than one variant, the card's own
availability SHALL be that of its most available variant, with available
beating out of stock. A card SHALL be out of stock only when every variant it
lists is out of stock. The listing SHALL communicate each card's rolled-up
availability on that card's tile.

<!-- trace:scenario id=g10.commerce-product-status.SC-h7u rev=2 -->
#### Scenario: grade10-site-commerce-product-status-SC-12 - One grade sold, another still for sale
**Serves:** grade10-site-commerce-product-status-US-01 - Collector sees whether a card can be bought

- **GIVEN** a card listing one out-of-stock variant followed by one available variant
- **WHEN** a collector sees the card on the listing and opens its page
- **THEN** the tile reads available, at the price of the first available item
  in the product read's order
- **AND** the page shows that item's price and availability
- **AND** the page offers no variant choice or variant display label

<!-- trace:scenario id=g10.commerce-product-status.SC-uei rev=2 -->
#### Scenario: grade10-site-commerce-product-status-SC-13 - Nothing left on the card
**Serves:** grade10-site-commerce-product-status-US-01 - Collector sees whether a card can be bought

- **GIVEN** a card whose every listed variant is out of stock
- **WHEN** a collector sees it on the listing
- **THEN** the card's tile reads Sold out
- **AND** the tile keeps the first listed variant's price
- **AND** the tile offers no usable add control

### Requirement: Every surface communicates the same availability

Every surface uses one internal sale identity per card, and none of them
hides a price or offers a control that does nothing.

**One answer** - Each card SHALL have one internal Shopify sale identity: the
first available variant in the product read's order, or the first listed
variant when none is available. A listing tile SHALL show that identity's
price; the card's page SHALL use it for its price, availability and cart add;
a listing add and a page add SHALL both put it in the cart; and the cart line
SHALL communicate its current availability. The tile's own availability is
its rollup. No surface SHALL derive availability from stock counts.

**No variant choice** - The page SHALL NOT render or require the collector to
choose among sizes, options, or variants, and SHALL NOT show the internal sale
identity as a product choice or display label.

**Priced but unbuyable** - A surface SHALL NOT hide a price because a variant
is out of stock, and SHALL NOT offer a purchase control that cannot be used.

<!-- trace:scenario id=g10.commerce-product-status.SC-ns0 rev=2 -->
#### Scenario: grade10-site-commerce-product-status-SC-14 - The page and cart use the available item
**Serves:** grade10-site-commerce-product-status-US-01 - Collector sees whether a card can be bought

- **GIVEN** a card with one out-of-stock variant followed by one available
  variant in the product read
- **WHEN** a collector sees the tile, adds the card from the listing, opens the
  page, and adds the item from the page, while the shop's answer does not move
- **THEN** the tile reads available
- **AND** the page uses the available item for its price, status, and add
- **AND** the listing add and the page add put that same internal sale identity
  in the cart, on one line that reads available

<!-- trace:scenario id=g10.commerce-product-status.SC-5rs rev=1 -->
#### Scenario: grade10-site-commerce-product-status-SC-15 - A sold-out item keeps its price
**Serves:** grade10-site-commerce-product-status-US-01 - Collector sees whether a card can be bought

- **GIVEN** a card with one listed variant and that variant is out of stock
- **WHEN** a collector opens the card's page
- **THEN** the page keeps the item's price and says it is sold out
- **AND** no usable purchase control is offered

### Requirement: An unpublished product is absent from browsing rather than marked

An unpublished product is missing from browsing rather than shown as
unavailable.

**Absent, not marked** - A product not published to the store's sales channel
SHALL NOT appear in the listing, and its address SHALL answer as
`grade10-site/store/product-page` requires rather than rendering a card marked
unavailable.

**Two answers only** - Unavailable SHALL NOT be an availability a browse
surface communicates: every tile reads available or out of stock.

**In the cart** - Where a collector still meets an unpublished product — a
cart line whose product ceased to be published after it was added — is
`grade10-site/store/cart-validation`'s.

<!-- trace:scenario id=g10.commerce-product-status.SC-g9e rev=1 -->
#### Scenario: grade10-site-commerce-product-status-SC-16 - An unpublished product is not listed
**Serves:** grade10-site-commerce-product-status-US-01 - Collector sees whether a card can be bought

- **GIVEN** a product not published to the store's sales channel
- **WHEN** a collector opens the listing
- **THEN** no tile for that product appears, with or without an unavailable
  treatment
- **AND** every tile that does appear reads available or out of stock
