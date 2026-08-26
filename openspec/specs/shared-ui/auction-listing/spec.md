# shared-ui/auction-listing Specification

## Purpose
The shared listing product-page blocks every auction storefront composes: the
media gallery, the bid panel, and the details section. This change records the
export contract and the gallery's distinct sources for thumbnail, main frame,
and zoom.

## Requirements

### Requirement: The listing surface exports

The shared UI package SHALL export, from its public entry, these components
for the listing product page — `ListingGallery`, `ListingBidPanel`, and
`ListingDetails` — and these types: `ListingGalleryImage`,
`ListingGalleryProps`, `ListingGalleryCopy`, `ListingBidPanelProps`,
`ListingBidPanelCopy`, `ListingDetailsFact`, `ListingDetailsSection`,
`ListingDetailsProps`, and `ListingDetailsCopy`.

Each of those components SHALL be renderable on its own, so a later surface can
reuse the gallery without the bid panel.

#### Scenario: An application imports the surface

- **WHEN** an application imports each name above from the shared UI package's
  public entry
- **THEN** every import resolves

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

### Requirement: The gallery matches how many items it was given

`ListingGallery` SHALL render the gallery items in the order supplied. With
two or more items it SHALL show a thumbnail strip and enable previous/next.
With exactly one item it SHALL hide the strip and disable previous/next. With
none it SHALL render no item and SHALL NOT present previous/next as available.

#### Scenario: Several gallery items show a strip

- **GIVEN** two or more gallery items
- **WHEN** the gallery renders
- **THEN** a thumbnail exists for each item
- **AND** previous and next are enabled

#### Scenario: One gallery item has no strip

- **GIVEN** exactly one gallery item
- **WHEN** the gallery renders
- **THEN** that item is shown
- **AND** no thumbnail strip is shown
- **AND** previous and next are disabled

#### Scenario: No gallery items

- **GIVEN** an empty gallery list
- **WHEN** the gallery renders
- **THEN** no item is shown
- **AND** previous and next are not available

### Requirement: A control has no copy of its own

`ListingGallery` SHALL receive a required `copy` object
(`ListingGalleryCopy`) with `zoom`, `previous`, and `next` from the consumer.
It SHALL NOT supply default user-visible copy for those slots.

#### Scenario: Labels come from the consumer

- **GIVEN** a gallery rendered with
  `copy={{ zoom: "Click to zoom", previous: "Previous image", next: "Next image" }}`
- **WHEN** it renders
- **THEN** those strings are the accessible names and visible zoom hint
- **AND** no other language appears in those slots
