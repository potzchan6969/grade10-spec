## Purpose

The shared listing product-page blocks every auction storefront composes: the
photo gallery, the bid panel, and the details section. This change records the
export contract and the gallery's distinct sources for thumbnail, main frame,
and zoom.

## ADDED Requirements

### Requirement: The listing surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the listing product page — `ListingGallery`, `ListingBidPanel`,
and `ListingDetails` — and exactly these types: `ListingGalleryImage`,
`ListingGalleryProps`, `ListingBidPanelProps`, `ListingDetailsFact`,
`ListingDetailsSection`, and `ListingDetailsProps`.

Each of those components SHALL be renderable on its own, so a later surface can
reuse the gallery without the bid panel.

#### Scenario: An application imports the surface

- **WHEN** an application imports each name above from the shared UI package's
  public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: A part is reused alone

- **WHEN** an application renders `ListingGallery` without `ListingBidPanel`
  or `ListingDetails`
- **THEN** it renders and behaves as specified, with no missing-context error

### Requirement: A gallery image has distinct thumbnail, main, and zoom sources

`ListingGalleryImage` SHALL accept `src` for the main frame, `thumbSrc` for
the thumbnail strip, `zoomSrc` for the zoom dialog, `alt` as the accessible
name, and optional `thumbLabel` as the thumbnail's accessible name (falling
back to `alt`). When `thumbSrc` or `zoomSrc` is omitted, that slot SHALL use
`src`. The gallery SHALL NOT fetch, derive, or rewrite those addresses.

#### Scenario: Distinct sources are used in each slot

- **GIVEN** a gallery image whose `thumbSrc`, `src`, and `zoomSrc` are three
  different addresses
- **WHEN** it is rendered with at least one other image (so the strip is
  shown) and the collector opens zoom
- **THEN** the thumbnail requests `thumbSrc`
- **AND** the main frame requests `src`
- **AND** the zoom dialog requests `zoomSrc`

#### Scenario: Omitted sources fall back to src

- **GIVEN** a gallery image that supplies only `src` and `alt`
- **WHEN** it is rendered
- **THEN** the main frame, and zoom, request `src`

### Requirement: The gallery matches how many photos it was given

`ListingGallery` SHALL render the photos in the order supplied. With two or
more photos it SHALL show a thumbnail strip and enable previous/next. With
exactly one photo it SHALL hide the strip and disable previous/next. With none
it SHALL render no photo and SHALL NOT present previous/next as available.

#### Scenario: Several photos show a strip

- **GIVEN** two or more gallery images
- **WHEN** the gallery renders
- **THEN** a thumbnail exists for each image
- **AND** previous and next are enabled

#### Scenario: One photo has no strip

- **GIVEN** exactly one gallery image
- **WHEN** the gallery renders
- **THEN** that photo is shown
- **AND** no thumbnail strip is shown
- **AND** previous and next are disabled

#### Scenario: No photos

- **GIVEN** an empty images list
- **WHEN** the gallery renders
- **THEN** no photo is shown
- **AND** previous and next are not available

### Requirement: A control has no copy of its own

`ListingGallery` SHALL receive `zoomLabel`, `previousLabel`, and `nextLabel`
from the consumer. It SHALL NOT supply default user-visible copy for those
slots.

#### Scenario: Labels come from the consumer

- **GIVEN** a gallery rendered with `zoomLabel` "Click to zoom",
  `previousLabel` "Previous image", and `nextLabel` "Next image"
- **WHEN** it renders
- **THEN** those strings are the accessible names and visible zoom hint
- **AND** no other language appears in those slots
