# grade10-site/store/product-page — delta

## Feature set

- Shared link picture
  - First image: a product address unfurls with the card's first catalogue
    image
  - Preview box: the picture is served at 1200×630 and the response says so
  - Padded, not cropped: the card is fitted inside the box and the rest is
    filled white
  - Honest absence: a card with no image carries no `og:image`

## User journeys

### product-page-US-05: Collector shares a card and the preview shows it

**As a** collector,
**I want** a product link I pass on to unfurl with the card's own picture,
whole,
**so that** whoever receives it sees the card rather than a text-only preview
or one with its edges cut off.

**Accepted by:**

- `product-page-SC-19` — A preview fetcher reads the card's picture
- `product-page-SC-20` — A card with no picture unfurls without one

## ADDED Requirements

### Requirement: A shared card link unfurls with the card's picture

A product address whose card the catalogue pictures SHALL carry `og:image`,
`og:image:width`, `og:image:height` and `og:image:alt` in the response HTML,
readable without executing scripts. The picture SHALL be the card's first
catalogue image, served at 1200 by 630 pixels, fitted inside that box with
the remainder filled white and never cropped. The alt text SHALL be the
image's own, or the card's name when the shop gave the image none.

A product address whose card the catalogue pictures no way SHALL carry no
`og:image`.

#### Scenario: product-page-SC-19 - A preview fetcher reads the card's picture

- **GIVEN** a card the catalogue pictures
- **WHEN** its product address is fetched and no script executes
- **THEN** the response carries `og:image` naming the card's first image at
  1200 by 630 pixels, padded white
- **AND** `og:image:width` is `1200`, `og:image:height` is `630`, and
  `og:image:alt` is the image's alt text or the card's name

#### Scenario: product-page-SC-20 - A card with no picture unfurls without one

- **GIVEN** a card the catalogue lists no image for
- **WHEN** its product address is fetched and no script executes
- **THEN** the response carries its title, description and `og:url`
- **AND** no `og:image`
