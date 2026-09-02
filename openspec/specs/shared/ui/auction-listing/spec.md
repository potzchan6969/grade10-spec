# shared/ui/auction-listing Specification

## Purpose
The shared listing product-page blocks every auction storefront composes: the
media gallery, the bid panel, and the details section. This change records the
export contract and the gallery's distinct sources for thumbnail, main frame,
and zoom.

## Feature set

- Surface exports
  - Named components: gallery, bid panel, and details from the package entry
  - Reusable parts: the gallery renders without the bid panel
- Gallery sources
  - Distinct addresses: thumbnail, main frame, and zoom each have their own source
  - Fallback to src: an omitted thumb or zoom uses the main source
- Gallery strip
  - Several items: more than one image shows a strip; one item does not
- Consumer labels
  - Supplied copy: accessible names come from the application

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

#### Scenario: auction-listing-SC-01 - An application imports the surface

- **WHEN** an application imports each name above from the shared UI package's
  public entry
- **THEN** every import resolves

#### Scenario: auction-listing-SC-02 - A part is reused alone

- **WHEN** an application renders `ListingGallery` without `ListingBidPanel`
  or `ListingDetails`
- **THEN** it renders and behaves as specified, with no missing-context error

### Requirement: A gallery image has distinct thumbnail, main, and zoom sources

`ListingGalleryImage` SHALL accept `src` for the main frame, `thumbSrc` for
the thumbnail strip, `zoomSrc` for the zoom dialog, `alt` as the accessible
name, and optional `thumbLabel` as the thumbnail's accessible name (falling
back to `alt`). When `thumbSrc` or `zoomSrc` is omitted, that slot SHALL use
`src`. The gallery SHALL NOT fetch, derive, or rewrite those addresses.

#### Scenario: auction-listing-SC-03 - Distinct sources are used in each slot

- **GIVEN** a gallery image whose `thumbSrc`, `src`, and `zoomSrc` are three
  different addresses
- **WHEN** it is rendered with at least one other image (so the strip is
  shown) and the collector opens zoom
- **THEN** the thumbnail requests `thumbSrc`
- **AND** the main frame requests `src`
- **AND** the zoom dialog requests `zoomSrc`

#### Scenario: auction-listing-SC-04 - Omitted sources fall back to src

- **GIVEN** a gallery image that supplies only `src` and `alt`
- **WHEN** it is rendered
- **THEN** the main frame, and zoom, request `src`

### Requirement: The gallery matches how many items it was given

`ListingGallery` SHALL render the gallery items in the order supplied. With
two or more items it SHALL show a thumbnail strip and enable previous/next.
With exactly one item it SHALL hide the strip and disable previous/next. With
none it SHALL render no item and SHALL NOT present previous/next as available.

#### Scenario: auction-listing-SC-05 - Several gallery items show a strip

- **GIVEN** two or more gallery items
- **WHEN** the gallery renders
- **THEN** a thumbnail exists for each item
- **AND** previous and next are enabled

#### Scenario: auction-listing-SC-06 - One gallery item has no strip

- **GIVEN** exactly one gallery item
- **WHEN** the gallery renders
- **THEN** that item is shown
- **AND** no thumbnail strip is shown
- **AND** previous and next are disabled

#### Scenario: auction-listing-SC-07 - No gallery items

- **GIVEN** an empty gallery list
- **WHEN** the gallery renders
- **THEN** no item is shown
- **AND** previous and next are not available

### Requirement: A control has no copy of its own

`ListingGallery` SHALL receive a required `copy` object
(`ListingGalleryCopy`) with `zoom`, `previous`, and `next` from the consumer.
It SHALL NOT supply default user-visible copy for those slots.

#### Scenario: auction-listing-SC-08 - Labels come from the consumer

- **GIVEN** a gallery rendered with
  `copy={{ zoom: "Click to zoom", previous: "Previous image", next: "Next image" }}`
- **WHEN** it renders
- **THEN** those strings are the accessible names and visible zoom hint
- **AND** no other language appears in those slots

### Requirement: Extension explanation copy reflects the listing policy

`ListingAuctionBidCard`, `ListingAuctionCardSidebar`, and
`ListingBidPanel` SHALL receive extension explanation copy from the
consumer. They SHALL NOT hardcode extension window or duration minutes.

When extension is armed on a listing, the consumer SHALL supply copy for the
Time left explanation and any extended-bidding row that names that listing's
extension window and extension duration. The shared components SHALL render
the supplied strings as given.

#### Scenario: auction-listing-SC-14 - Extension copy comes from the consumer

- **GIVEN** a live listing whose extension window is 300 seconds and extension
  duration is 900 seconds
- **WHEN** an application renders the bid card with copy naming a 5-minute
  window and a 15-minute extension
- **THEN** the Time left explanation shows those values
- **AND** no hardcoded "30 minutes" appears in that slot
