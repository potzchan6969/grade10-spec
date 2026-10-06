# grade10-site/store/product-listing Specification

## Feature set

- Opening a card
  - Name and photo alike: a card's name and its photo open that card's own page
  - Sold out, closed: a sold-out card opens from neither, because the listing sells

## ADDED Requirements

### Requirement: A card on the listing opens its own product page

A card on the browse listing SHALL open its own product page from its name
and from its photo alike. Because the listing sells, a sold-out card SHALL
open from neither.

#### Scenario: grade10-site-store-product-listing-SC-55 - A card's name opens its own page
**Serves:** grade10-site-store-product-listing-US-16 - Collector opens a card from the listing

- **GIVEN** a card on the listing that is not sold out
- **WHEN** a collector activates the card's name
- **THEN** that card's own page renders
- **AND** activating the card's photo instead renders the same page

#### Scenario: grade10-site-store-product-listing-SC-56 - A sold-out card does not open
**Serves:** grade10-site-store-product-listing-US-16 - Collector opens a card from the listing

- **GIVEN** a sold-out card on the listing
- **WHEN** a collector presses the card's name and its photo
- **THEN** the listing stays where it is and no product page renders
