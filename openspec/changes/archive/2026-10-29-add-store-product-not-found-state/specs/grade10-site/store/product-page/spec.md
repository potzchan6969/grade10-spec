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
  - Grid entry: a card that opens on the listing, the front door or the
    rail under a card takes the collector to its own address, without a page
    load
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
  - Ceiling from the shop: the page stops a collector at what the shop has of
    the chosen variant
  - Silent where unknown: a shop exposing no count puts no ceiling on the page
- Said when it is news
  - Few left: the page says how many remain once the shop is nearly out
  - All of them asked for: the page says the same when the collector has taken
    the last one
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

## MODIFIED Requirements

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
