# grade10-site/store/product-page Specification

## Feature set

- Reaching a card
  - Grid entry: a card that opens on the listing, the front door or the
    rail under a card takes the collector to its own address, without a page
    load

## MODIFIED Requirements

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
