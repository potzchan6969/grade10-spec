# grade10-site/store/product-page Specification

## Purpose

What one card's address serves: the card's own page, in the response before
any script runs, and the refusal when the catalogue holds no such card.

A product address names one card by its handle — the key the catalogue
already addresses a product by. Every requirement of
`grade10-site/site/crawlable-pages` binds it — it is a public surface, so its
title, description, share metadata and sitemap entry are that capability's,
per card rather than per page.

## Feature set

- Card page
  - Server-rendered card: name, description, and the one item's price and
    availability in the response HTML before any script runs
  - One address, one card: two product addresses answer with their own card,
    title and share metadata
- Unknown handles
  - Catalogue decides: whether a handle is a card is asked of the catalogue
    when the address is asked for
  - Not-found refusal: an address naming no card answers 404 and the site's
    not-found surface, never an empty page
- Reaching a card
  - Grid entry: a card that opens on the listing, the front door or the
    rail under a card takes the collector to its own address, without a page
    load
  - Sitemap honesty: the sitemap lists only addresses a collector can fetch,
    never an unfilled pattern
- Buying the one item
  - One item: the page offers one sellable item, the first variant for sale or
    else the first listed, with no size, option or variant choice
  - Add in place: the collector stays on that card and what the site says the
    cart holds accounts for the add
  - One line per item: adding the same item again carries the quantity on one
    line
- Sold-out item
  - Priced but unbuyable: an item nobody can buy keeps its price, reads Sold
    out, and nothing that adds it can be pressed
- Shared link picture
  - First image: a product address unfurls with the card's first catalogue
    image
  - Preview box: the picture is served at 1200×630 and the response says so
  - Padded, not cropped: the card is fitted inside the box and the rest is
    filled white
  - Honest absence: a card with no image carries no `og:image`
  - Named shape: the response says which card shape the picture is drawn in
- Free pick-up
  - Store name opens Store Locator: the store name in the free pick-up claim
    is a link to Store Locator
  - No dead label: a fulfilment label the site has no page for is not a link
- Product detail context
  - Media gallery: lets a collector inspect every supplied product image without a lightbox.
  - Purchase context: keeps current price, compare-at price, and availability together.
  - Item facts: exposes optional product facets and SKU, with fulfilment guidance in which Shipping fee is text and the store name opens Store Locator, per Free pick-up opens Store Locator.
- Product detail interaction
  - Description disclosure: lets a collector read the full description without losing their place.
  - Quantity purchase: lets a collector choose a quantity and add the product's one sellable item in place.

## Requirements

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

### Requirement: An address that names no card is refused

The catalogue SHALL be what decides whether a handle is a card, asked when the
address is asked for. An address under the store's products that names no
card in the catalogue SHALL answer with status 404 and render the Store
product page's product-specific unknown state inside the existing site shell,
never an empty product page or a redirect.

The unknown state SHALL show a localized product-specific heading equivalent to
“We couldn’t find this product”, a localized explanation equivalent to “Check
the address, or browse the store for what is available.”, and a localized
“Browse the store” action. The action SHALL open the Store product listing in
the same tab. The existing Store header and footer SHALL remain present. The
unknown state content SHALL contain no product details, Add to cart action,
product or cart controls, or related-product rail.

The change SHALL remain scoped to the Store product route. Arbitrary unknown
addresses that are not matched to an owned surface SHALL continue to render the
generic site-wide not-found surface and its existing recovery behavior.

<!-- trace:scenario id=g10.store-product-page.SC-f3e rev=2 -->
#### Scenario: grade10-site-store-product-page-SC-03 - A handle the catalogue has nothing for
**Serves:** grade10-site-store-product-page-US-01 - Collector reads a card at its own address

- **WHEN** an address under the store's products naming no card is fetched
- **THEN** the response has status 404
- **AND** the rendered page has the existing Store header and footer, a
  current-locale product-specific heading and explanation, and a
  current-locale “Browse the store” action
- **AND** activating the action opens the Store product listing in the same
  tab
- **AND** the unknown-state content has no product details, Add to cart action,
  product or cart controls, or related-product rail
- **AND** an arbitrary unknown address outside the Store product route still
  renders the existing generic site-wide not-found surface

<!-- trace:scenario id=g10.store-product-page.SC-lk8 rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-04 - A card added to the catalogue answers
**Serves:** grade10-site-store-product-page-US-01 - Collector reads a card at its own address

- **GIVEN** a card the catalogue holds
- **WHEN** its address is fetched
- **THEN** the response has status 200 and carries that card's page

### Requirement: A card is reached from the storefront

Where a card on the storefront opens, the storefront SHALL open that card's
own address, without a page load. Which cards open, and from which of their
controls, is the rule of the surface that shows them:
`grade10-site/store/product-listing` for the browse listing,
`grade10-site/store/home` for the front door, and
`grade10-site/store/cross-sell` for the rail under a card.

The sitemap lists the surfaces the build writes a document for, and a card is
not one of them: which addresses the catalogue answers is not known when the
site is built. It SHALL never list an address carrying an unfilled parameter
in place of them.

<!-- trace:scenario id=g10.store-product-page.SC-wo0 rev=2 -->
#### Scenario: grade10-site-store-product-page-SC-05 - A card is opened from the grid
**Serves:** grade10-site-store-product-page-US-02 - Collector opens a card from the storefront

- **GIVEN** a card that opens, on the listing, the front door's row or the rail under a card
- **WHEN** a collector opens it
- **THEN** that card's address is what they are on, showing that card's page
- **AND** the page was not loaded again to show it

<!-- trace:scenario id=g10.store-product-page.SC-21y rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-06 - The sitemap names no pattern
**Serves:** grade10-site-store-product-page-US-02 - Collector opens a card from the storefront

- **WHEN** the sitemap is fetched
- **THEN** every entry is an address a collector can fetch
- **AND** none of them carries an unfilled parameter

### Requirement: A card nobody can buy says so where the buying happens

A card whose one item is sold out SHALL say so on its page, in the place a
collector would otherwise buy it. It SHALL NOT offer anything that can be
pressed to add the item, and it SHALL NOT hide the item's price — a sold-out
card still costs what it costs, and a page with nothing where the buying goes
reads as a page that failed rather than a card that sold.

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

### Requirement: Signed-out Add to cart adds to the cart this browser holds

When a collector is signed out, activating Add to cart on a product page that
offers it SHALL add its one item, at the quantity asked for whatever the shop's
count, to the cart this browser holds, and SHALL NOT ask for sign-in; the
cart's review answers that quantity. When the collector signs in, the lines
this browser holds SHALL move into the signed-in member's cart.

<!-- trace:scenario id=g10.store-product-page.SC-za5 rev=2 -->
#### Scenario: grade10-site-store-product-page-SC-26 - Signed-out Add to cart adds to this browser's cart
**Serves:** grade10-site-store-product-page-US-11 - Collector adds from the product page without signing in

- **GIVEN** a signed-out collector on a product page that offers Add to cart
- **WHEN** they activate Add to cart
- **THEN** the cart this browser holds gains what they chose, at the quantity
  they chose
- **AND** no sign-in dialog opens

<!-- trace:scenario id=g10.store-product-page.SC-0j7 rev=4 -->
#### Scenario: grade10-site-store-product-page-SC-28 - Signing in keeps the product page's add
**Serves:** grade10-site-store-product-page-US-11 - Collector adds from the product page without signing in

- **GIVEN** a signed-out collector who added 5 of a product whose one item the
  shop counts at 2, from its page
- **WHEN** they sign in
- **THEN** the signed-in member's cart holds 5 of that item, for the cart's
  review to answer

### Requirement: A shared card link unfurls with the card's picture

A product address whose card the catalogue pictures SHALL carry `og:image`,
`og:image:width`, `og:image:height` and `og:image:alt` in the response HTML,
readable without executing scripts. The picture SHALL be the card's first
catalogue image, served at 1200 by 630 pixels, fitted inside that box with
the remainder filled white and never cropped. The alt text SHALL be the
image's own, or the card's name when the shop gave the image none.

A product address whose card the catalogue pictures no way SHALL carry no
`og:image`.

The response SHALL name the card shape a preview is drawn in, because a
fetcher that reads the picture may still size the card from that name alone:
the wide shape where the response carries a picture, and the small shape where
it carries none.

<!-- trace:scenario id=g10.store-product-page.SC-vzq rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-30 - A preview fetcher reads the card's picture
**Serves:** grade10-site-store-product-page-US-13 - Collector shares a card and the preview shows it

- **GIVEN** a card the catalogue pictures
- **WHEN** its product address is fetched and no script executes
- **THEN** the response carries `og:image` naming the card's first image at
  1200 by 630 pixels, padded white
- **AND** `og:image:width` is `1200`, `og:image:height` is `630`, and
  `og:image:alt` is the image's alt text or the card's name
- **AND** `twitter:card` is `summary_large_image`

<!-- trace:scenario id=g10.store-product-page.SC-sia rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-31 - A card with no picture unfurls without one
**Serves:** grade10-site-store-product-page-US-13 - Collector shares a card and the preview shows it

- **GIVEN** a card the catalogue lists no image for
- **WHEN** its product address is fetched and no script executes
- **THEN** the response carries its title, description and `og:url`
- **AND** no `og:image`
- **AND** `twitter:card` is `summary`

<!-- trace:scenario id=g10.store-product-page.SC-eji rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-32 - A small original is enlarged to fill the box
**Serves:** grade10-site-store-product-page-US-13 - Collector shares a card and the preview shows it

- **GIVEN** a card whose first catalogue image is smaller than 1200 by 630
  pixels in at least one dimension
- **WHEN** its product address is fetched and no script executes
- **THEN** the delivered `og:image` is exactly 1200 by 630 pixels, the
  original enlarged to fill the box rather than left at its native size
  inside more padding

### Requirement: Free pick-up opens Store Locator

The store name in the free pick-up claim is the way into Store Locator.

**Store name as control** - When the product page shows free pick-up at Hong
Kong Grade10 Store, that claim SHALL open the Store Locator surface. The store
name in the claim SHALL be the control that reaches Store Locator, in the same
tab and in the product page's language.

**No dead label** - A fulfilment label the site has no page for SHALL NOT be a
link.

<!-- trace:scenario id=g10.store-product-page.SC-21b rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-25 - Free pick-up reaches Store Locator
**Serves:** grade10-site-store-product-page-US-10 - Collector opens Store Locator from free pick-up

- **GIVEN** a product page showing free pick-up at Hong Kong Grade10 Store
- **WHEN** a collector activates that store name
- **THEN** Store Locator renders in the same tab
- **AND** in the product page's language

<!-- trace:scenario id=g10.store-product-page.SC-res rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-38 - A label with no page is not a link
**Serves:** grade10-site-store-product-page-US-10 - the collector reading the shipping and pickup lines finds one link, the shop's

- **GIVEN** a product page showing its shipping and pickup lines
- **WHEN** a collector reads them
- **THEN** Shipping fee is not a link
- **AND** the store name in free pick-up is the only link among them

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

### Requirement: A product detail page presents complete catalogue context

The product page SHALL render every image supplied for the product in the
catalogue order, with descriptive alternative text, and SHALL render an
accessible placeholder when the catalogue supplies no image. It SHALL show the
product's one sellable item's current price and SHALL show a compare-at price
only when the catalogue supplies one greater than the current price. It SHALL
NOT show a remaining quantity, as `grade10-site/commerce/product-status`
requires.

<!-- trace:scenario id=g10.store-product-page.SC-n6k rev=2 -->
#### Scenario: grade10-site-store-product-page-SC-13 - A product page shows its media and price context
**Serves:** grade10-site-store-product-page-US-06 - Collector reviews a product's catalogue context

- **GIVEN** a product with two images and one sellable item whose current price is 10500 minor units, compare-at price is 12300 minor units, and finite quantity is 3
- **WHEN** a collector opens the product page
- **THEN** the page renders both images in catalogue order with descriptive alternative text
- **AND** it renders the current price and the greater compare-at price
- **AND** it says nothing about how many remain

<!-- trace:scenario id=g10.store-product-page.SC-dd3 rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-14 - A product without media has an honest placeholder
**Serves:** grade10-site-store-product-page-US-06 - Collector reviews a product's catalogue context

- **GIVEN** a product with no catalogue images
- **WHEN** a collector opens the product page
- **THEN** the page renders one accessible placeholder in the media gallery
- **AND** it does not render an empty image or an image URL made by the page

<!-- trace:scenario id=g10.store-product-page.SC-h7c rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-15 - A product page shows supplied item facts
**Serves:** grade10-site-store-product-page-US-06 - Collector reviews a product's catalogue context

- **GIVEN** a product with supplied product-type, world, and language badges and a SKU
- **WHEN** a collector opens the product page
- **THEN** the page renders the supplied badges as non-interactive labels
- **AND** it renders this static fulfilment copy for every product:
  - `Shipping calculated at checkout. Shipping fee`
  - `Free pick-up at Hong Kong Grade10 Store`
- **AND** it renders the supplied SKU below the fulfilment copy
- **AND** it omits each optional product fact the catalogue did not supply

The fulfilment copy is locale-catalogue copy in v1, not a field from the
product contract. `Shipping fee` is text; the `Hong Kong Grade10 Store` label
opens Store Locator, per `Free pick-up opens Store Locator`.

### Requirement: A product description can be disclosed in place

The product page SHALL render a long description collapsed to at most three
lines by default and SHALL provide a button labelled for expansion. A
description that fits within three lines SHALL be shown in full without a
disclosure button. The button SHALL expose its state through `aria-expanded`
and SHALL reference the description region with `aria-controls`. Activating it
SHALL expand the full description and change the button to the collapse action;
activating it again SHALL restore the collapsed state without navigating away.

<!-- trace:scenario id=g10.store-product-page.SC-yaj rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-16 - A collector expands and collapses the description
**Serves:** grade10-site-store-product-page-US-07 - Collector expands the product description in place

- **GIVEN** a product with a description longer than three lines
- **WHEN** a collector opens the product page
- **THEN** the description is collapsed and the disclosure button has `aria-expanded="false"`
- **WHEN** the collector activates the disclosure button
- **THEN** the full description is visible and the button has `aria-expanded="true"`
- **WHEN** the collector activates the button again
- **THEN** the description is collapsed again and the page remains at the same product address

### Requirement: A product page adds a chosen quantity in place

The product page SHALL render a quantity stepper defaulting to one for the
product's one sellable item. While an add is pending, the stepper and the add
action SHALL be disabled and the action SHALL show its loading state labelled
for adding. After a successful add, the page SHALL open the cart drawer and
reset the quantity stepper to one, and SHALL NOT show an on-page added
confirmation. When the item is sold out, the add action itself SHALL read Sold
out.

<!-- trace:scenario id=g10.store-product-page.SC-lqp rev=2 -->
#### Scenario: grade10-site-store-product-page-SC-17 - A collector adds a chosen quantity in place
**Serves:** grade10-site-store-product-page-US-03 - Collector adds the product from its page

- **GIVEN** a product with one available sellable item
- **WHEN** a collector changes the stepper to 2 and activates Add to cart
- **THEN** the pending action disables the stepper and add control
- **AND** the add control shows its loading label
- **WHEN** the add settles
- **THEN** the cart drawer opens
- **AND** the quantity stepper resets to one
- **AND** the page shows no on-page added confirmation

<!-- trace:scenario id=g10.store-product-page.SC-xny rev=2 -->
#### Scenario: grade10-site-store-product-page-SC-18 - A sold-out product's add reads Sold out and cannot be pressed
**Serves:** grade10-site-store-product-page-US-04 - Collector meets a product that cannot be bought

- **GIVEN** a product whose one sellable item is sold out
- **WHEN** a collector opens the product page
- **THEN** the add action reads Sold out and cannot be pressed
