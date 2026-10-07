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
  - Server-rendered card: name, description and every variant's price in the
    response HTML before any script runs
  - One address, one card: two product addresses answer with their own card,
    title and share metadata
- Unknown handles
  - Catalogue decides: whether a handle is a card is asked of the catalogue
    when the address is asked for
  - Not-found refusal: an address naming no card answers 404 and the site's
    not-found surface, never an empty page
- Reaching a card
  - Grid entry: the storefront opens a card's own address from that card,
    without a page load
  - Sitemap honesty: the sitemap lists only addresses a collector can fetch,
    never an unfilled pattern
- Buying from the page
  - Variant choice: the page opens on the variant it prices and adds whichever
    one the collector chose
  - Add in place: the collector stays on that card and what the site says the
    cart holds accounts for the add
  - One line per variant: adding the same variant again carries the quantity on
    one line
- Sold-out cards
  - Per-variant availability: each variant reads as for sale or sold out on its
    own, and only the ones for sale can be added
  - Priced but unbuyable: a card nobody can buy keeps its prices and offers
    nothing to press
- Held to the shop's count
  - Ceiling from the shop: the page stops a collector at what the shop has of the chosen variant
  - Silent where unknown: a shop exposing no count puts no ceiling on the page
- Said when it is news
  - Few left: the page says how many remain once the shop is nearly out
  - All of them asked for: the page says the same when the collector has taken the last one
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

## Requirements

### Requirement: A card answers at its own address

The site SHALL answer a product address with that card's page: its name, its
description, what each variant it lists costs, and which of them can be
bought — in the response HTML without any script executing.

Two product addresses SHALL answer with their own card — the page a collector
reads is the one the address names, not the catalogue it came from.

<!-- trace:scenario id=g10.store-product-page.SC-b5k rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-01 - A card answers whole
**Serves:** grade10-site-store-product-page-US-01 - Collector reads a card at its own address

- **WHEN** a product address is fetched and no script executes
- **THEN** the response HTML contains that card's name, its description, and
  a price for every variant it lists

<!-- trace:scenario id=g10.store-product-page.SC-ok3 rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-02 - Two cards, two pages
**Serves:** grade10-site-store-product-page-US-01 - Collector reads a card at its own address

- **WHEN** two product addresses are fetched
- **THEN** each response carries its own card's name and price, and its own
  title, meta description and `og:url`

### Requirement: An address that names no card is refused

The catalogue SHALL be what decides whether a handle is a card, asked when the
address is asked for. An address under the store's products that names no
card in the catalogue SHALL answer with status 404 and the site's not-found
surface, never an empty product page.

<!-- trace:scenario id=g10.store-product-page.SC-f3e rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-03 - A handle the catalogue has nothing for
**Serves:** grade10-site-store-product-page-US-01 - Collector reads a card at its own address

- **WHEN** an address under the store's products naming no card is fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the site's not-found surface

<!-- trace:scenario id=g10.store-product-page.SC-lk8 rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-04 - A card added to the catalogue answers
**Serves:** grade10-site-store-product-page-US-01 - Collector reads a card at its own address

- **GIVEN** a card the catalogue holds
- **WHEN** its address is fetched
- **THEN** the response has status 200 and carries that card's page

### Requirement: A card is reached from the storefront

The storefront SHALL open a card's own address from that card in the grid,
without a page load.

The sitemap lists the surfaces the build writes a document for, and a card is
not one of them: which addresses the catalogue answers is not known when the
site is built. It SHALL never list an address carrying an unfilled parameter
in place of them.

<!-- trace:scenario id=g10.store-product-page.SC-wo0 rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-05 - A card is opened from the grid
**Serves:** grade10-site-store-product-page-US-02 - Collector opens a card from the storefront

- **GIVEN** a collector on the storefront
- **WHEN** they open a card in the grid
- **THEN** that card's address is what they are on, showing that card's page

<!-- trace:scenario id=g10.store-product-page.SC-21y rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-06 - The sitemap names no pattern
**Serves:** grade10-site-store-product-page-US-02 - Collector opens a card from the storefront

- **WHEN** the sitemap is fetched
- **THEN** every entry is an address a collector can fetch
- **AND** none of them carries an unfilled parameter

### Requirement: A card is added to the cart from its own page

A card's page SHALL let a collector add a variant it lists to the storefront's
cart, without leaving the page and without returning to the grid.

The page SHALL open with the variant it prices already chosen, so a card
listing one thing to buy needs no choice made. A collector SHALL be able to
choose any other variant the page lists, and what is added SHALL be the one
chosen — never whichever the catalogue listed first.

After a card is added the collector SHALL still be on that card, and what the
site says the cart holds SHALL account for what was added.

<!-- trace:scenario id=g10.store-product-page.SC-jt1 rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-07 - A collector adds the grade they chose
**Serves:** grade10-site-store-product-page-US-03 - Collector adds a variant to the cart

- **GIVEN** a card whose page lists more than one variant for sale
- **WHEN** a collector chooses one that is not the one the page opened with,
  and adds it
- **THEN** the cart holds that variant, and not the one the page opened with

<!-- trace:scenario id=g10.store-product-page.SC-b7g rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-08 - A card with one thing to buy needs no choice
**Serves:** grade10-site-store-product-page-US-03 - Collector adds a variant to the cart

- **GIVEN** a card whose page lists one variant for sale
- **WHEN** a collector adds it without choosing anything
- **THEN** the cart holds that variant

<!-- trace:scenario id=g10.store-product-page.SC-qmb rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-09 - The collector keeps their place
**Serves:** grade10-site-store-product-page-US-03 - Collector adds a variant to the cart

- **WHEN** a collector adds a card from its page
- **THEN** they are still on that card's address, reading that card
- **AND** what the site says the cart holds has changed to account for it

<!-- trace:scenario id=g10.store-product-page.SC-tl5 rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-10 - The same card twice
**Serves:** grade10-site-store-product-page-US-03 - Collector adds a variant to the cart

- **GIVEN** a collector who has already added a variant from a card's page
- **WHEN** they add the same variant again
- **THEN** the cart holds the quantity they added, as one line rather than two

### Requirement: A card nobody can buy says so where the buying happens

A card the catalogue lists with nothing for sale SHALL say so on its page, in
the place a collector would otherwise buy from. It SHALL NOT show a control
that cannot be used, and it SHALL NOT hide the price it lists — a sold-out
card still costs what it costs, and a page with nothing where the buying goes
reads as a page that failed rather than a card that sold.

A card listing some variants for sale and others not SHALL offer the ones for
sale and refuse the ones not, each said per variant. A variant that cannot be
bought SHALL NOT become what is added by being chosen.

<!-- trace:scenario id=g10.store-product-page.SC-prx rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-11 - Nothing on the card is for sale
**Serves:** grade10-site-store-product-page-US-04 - Collector meets a card with nothing for sale

- **GIVEN** a card the catalogue lists with no variant for sale
- **WHEN** a collector opens its page
- **THEN** the page says the card cannot be bought
- **AND** every variant it lists is still priced
- **AND** there is nothing to press that would add it

<!-- trace:scenario id=g10.store-product-page.SC-1p0 rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-12 - One grade sold, another still for sale
**Serves:** grade10-site-store-product-page-US-04 - Collector meets a card with nothing for sale

- **GIVEN** a card listing one variant for sale and one sold out
- **WHEN** a collector opens its page
- **THEN** each variant reads as for sale or sold out on its own
- **AND** adding is offered for the one for sale
- **AND** choosing the sold-out one offers no add

### Requirement: A card's page holds a collector to the shop's count

The page SHALL NOT let a collector ask for more of the chosen variant than the
shop has left of it. Where the shop exposes no count for that variant, the
page SHALL put no ceiling on what a collector asks for.

The ceiling is what the shop last said, so it is advisory: the cart's own
review remains what decides a quantity, and goes on reducing a line the shop
can no longer fill.

Choosing a different variant SHALL bring that variant's ceiling with it, since
one grade of a card selling out says nothing about another.

<!-- trace:scenario id=g10.store-product-page.SC-yw4 rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-19 - The page stops at what the shop has
**Serves:** grade10-site-store-product-page-US-05 - Collector takes the last of a grade from its page

- **GIVEN** a card whose chosen variant the shop has three of
- **WHEN** a collector raises the quantity past three
- **THEN** the quantity stays at three

<!-- trace:scenario id=g10.store-product-page.SC-1e2 rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-20 - A shop that counts nothing stops nothing
**Serves:** grade10-site-store-product-page-US-05 - Collector takes the last of a grade from its page

- **GIVEN** a card whose chosen variant the shop exposes no count for
- **WHEN** a collector raises the quantity above three
- **THEN** the quantity rises as asked

<!-- trace:scenario id=g10.store-product-page.SC-yyk rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-21 - Another grade brings its own ceiling
**Serves:** grade10-site-store-product-page-US-05 - Collector takes the last of a grade from its page

- **GIVEN** a card listing one variant the shop has two of and another it has ten of
- **WHEN** a collector chooses the one the shop has ten of and raises the quantity to ten
- **THEN** the quantity rises to ten

### Requirement: A card's page says how many are left when that is news

The page SHALL say how many the shop has left of the chosen variant when the
shop has three or fewer of it, and when the collector has asked for every one
there is. It SHALL say nothing about what is left at any other time.

Three or fewer is what counts as nearly out across this store, and the page
SHALL NOT hold its own number.

<!-- trace:scenario id=g10.store-product-page.SC-vkx rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-22 - Nearly out is said on the page
**Serves:** grade10-site-store-product-page-US-05 - Collector takes the last of a grade from its page

- **GIVEN** a card whose chosen variant the shop has three of
- **WHEN** the page renders
- **THEN** the page says three are left

<!-- trace:scenario id=g10.store-product-page.SC-hvy rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-23 - Asking for the last one is answered
**Serves:** grade10-site-store-product-page-US-05 - Collector takes the last of a grade from its page

- **GIVEN** a card whose chosen variant the shop has forty-one of
- **WHEN** a collector raises the quantity to forty-one
- **THEN** the page says forty-one are left
- **AND** the quantity does not rise past forty-one

<!-- trace:scenario id=g10.store-product-page.SC-82g rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-24 - A well-stocked card says nothing
**Serves:** grade10-site-store-product-page-US-05 - Collector takes the last of a grade from its page

- **GIVEN** a card whose chosen variant the shop has forty-one of
- **WHEN** the page renders
- **THEN** the page says nothing about how many are left

### Requirement: Signed-out Add to cart opens sign-in

When a collector is signed out, activating Add to cart on a product page that
offers it SHALL open the site's sign-in dialog and SHALL NOT add a line to any
cart. There is no guest cart from this control.

When the collector dismisses the dialog without signing in, they SHALL remain
signed out on that product page, and the cart SHALL be unchanged.

When sign-in succeeds and the collector remains on that product page with the
same intended variant and quantity, the page SHALL complete that add into the
signed-in member cart. When sign-in takes the collector away from the page, or
the intended variant or quantity is no longer available, the page SHALL NOT
invent a later add.

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

<!-- trace:scenario id=g10.store-product-page.SC-0j7 rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-28 - Sign-in on the product page completes the add
**Serves:** grade10-site-store-product-page-US-11 - Collector signs in to add from the product page

- **GIVEN** a signed-out collector who opened sign-in from Add to cart for a
  given variant and quantity on a product page
- **WHEN** they sign in successfully and remain on that page with that same
  intended variant and quantity
- **THEN** the signed-in member cart holds that add
- **AND** the sign-in dialog is closed

### Requirement: Add to cart sign-in title names why

When a signed-out collector opens the sign-in dialog from Add to cart on a
product page that offers Add to cart, the dialog title SHALL be
**Sign In to Add to Cart**. The product page SHALL pass that wording through
the sign-in surface's consumer-owned title copy.

<!-- trace:scenario id=g10.store-product-page.SC-zl0 rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-29 - Add to cart sign-in title names why
**Serves:** grade10-site-store-product-page-US-12 - Collector sees why sign-in is asked when adding from the product page

- **GIVEN** a signed-out collector on a product page that offers Add to cart
- **WHEN** they activate Add to cart and the sign-in dialog opens
- **THEN** the dialog title is **Sign In to Add to Cart**

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
