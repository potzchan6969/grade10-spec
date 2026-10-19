# shared/ui/auction-listing Specification

## Purpose

Shared auction listing blocks disclose the buyer's premium on the bid panel
before a collector commits a maximum. They are the shared listing product-page
blocks every auction storefront composes: the media gallery, the bid panel,
the bid history, and the details section. The bid history carries accepted
instants so collector activity can be localized without changing the listing's
authoritative event data.

## Feature set

- Gallery sources
  - Distinct addresses: thumbnail, main frame, and magnifier each have their own source
  - Fallback to src: an omitted thumb or magnifier source uses the main source
- Gallery magnification
  - In place: a lens follows the pointer over the selected image; focused, it moves with the arrow keys and Escape hides it
  - Not touch: a touch pointer never raises the lens, and the lens never blocks scroll or swipe
  - No dialog: no zoom dialog, and no magnifier button opens one
- Consumer labels
  - Supplied copy: accessible names come from the application

## ADDED Requirements

### Requirement: A gallery magnifies the selected image in place

`ListingGallery` and `ListingLotGallery` SHALL magnify the selected image in
place: a lens follows the pointer over the main frame and renders the
image's magnified view inside it. Leaving the frame SHALL hide the lens.

The lens SHALL be a focusable group. While focused, each arrow key SHALL
move it within the frame and Escape SHALL hide it. The magnified content
inside the lens SHALL be hidden from assistive technology and unreachable
by keyboard.

A touch pointer SHALL NOT raise the lens, and the lens SHALL NOT block
scrolling or slide swiping. `ListingLotGallery` SHALL make only the
selected slide's lens focusable. `ListingGallery` SHALL present no lens on
a video item. Neither gallery SHALL present a zoom dialog or a control
that opens one.

<!-- trace:scenario id=g10.shared-auction-listing.SC-teu rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-67 - The pointer raises the lens over the selected image
**Serves:** Gallery magnification - the lens follows the pointer

- **GIVEN** a gallery whose selected item is an image
- **WHEN** the pointer moves over the main frame
- **THEN** a magnifier lens is shown at the pointer position
- **AND** it magnifies the area beneath it
- **WHEN** the pointer leaves the frame
- **THEN** the lens is hidden

<!-- trace:scenario id=g10.shared-auction-listing.SC-bk7 rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-68 - A focused lens moves with the arrow keys
**Serves:** Gallery magnification - arrows move the focused lens

- **GIVEN** a gallery whose lens group is focused
- **WHEN** an arrow key is pressed
- **THEN** the lens moves within the frame
- **AND** the gallery does not step to another image

<!-- trace:scenario id=g10.shared-auction-listing.SC-53x rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-69 - Escape hides the lens
**Serves:** Gallery magnification - Escape hides the lens

- **GIVEN** a gallery whose lens is shown
- **WHEN** Escape is pressed
- **THEN** the lens is hidden

<!-- trace:scenario id=g10.shared-auction-listing.SC-qlq rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-70 - A touch pointer does not raise the lens
**Serves:** Gallery magnification - a touch pointer raises nothing

- **GIVEN** a gallery whose selected item is an image
- **WHEN** a touch pointer moves over the main frame
- **THEN** no lens is shown
- **AND** a swipe still steps the gallery

<!-- trace:scenario id=g10.shared-auction-listing.SC-qyd rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-71 - Only the selected slide's lens is focusable
**Serves:** Gallery magnification - non-selected slides stay out of the tab order

- **GIVEN** a `ListingLotGallery` with several images
- **WHEN** the collector tabs through the gallery
- **THEN** only the selected slide's lens group takes focus

<!-- trace:scenario id=g10.shared-auction-listing.SC-73b rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-72 - A video item has no lens
**Serves:** Gallery magnification - video carries no magnifier

- **GIVEN** a `ListingGallery` whose selected item is a video
- **WHEN** the pointer moves over it
- **THEN** no lens is shown
- **AND** the video's own controls keep working

## MODIFIED Requirements

### Requirement: A gallery image has distinct thumbnail, main, and zoom sources

`ListingGalleryImage` SHALL accept `src` for the main frame, `thumbSrc` for
the thumbnail strip, `zoomSrc` for the magnified lens view, `alt` as the
accessible name, and optional `thumbLabel` as the thumbnail's accessible
name (falling back to `alt`). When `thumbSrc` or `zoomSrc` is omitted, that
slot SHALL use `src`. The gallery SHALL NOT fetch, derive, or rewrite those
addresses.

<!-- trace:scenario id=g10.shared-auction-listing.SC-v9a rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-03 - Distinct sources are used in each slot
**Serves:** Gallery sources - distinct sources are used in each slot

- **GIVEN** a gallery image whose `thumbSrc`, `src`, and `zoomSrc` are three
  different addresses
- **WHEN** it is rendered with at least one other image (so the strip is
  shown) and the collector magnifies the main frame
- **THEN** the thumbnail requests `thumbSrc`
- **AND** the main frame requests `src`
- **AND** the magnified view requests `zoomSrc`

<!-- trace:scenario id=g10.shared-auction-listing.SC-4sr rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-04 - Omitted sources fall back to src
**Serves:** Gallery sources - omitted sources fall back to src

- **GIVEN** a gallery image that supplies only `src` and `alt`
- **WHEN** it is rendered
- **THEN** the main frame, and the magnified view, request `src`

### Requirement: A control has no copy of its own

`ListingGallery` SHALL receive a required `copy` object
(`ListingGalleryCopy`) with `zoom`, `previous`, and `next`, and an optional
`zoomInstructions` for the magnifier group, from the consumer.
`ListingLotGallery` SHALL receive its copy the same way. Neither gallery
SHALL supply default user-visible copy for those slots.

<!-- trace:scenario id=g10.shared-auction-listing.SC-ogg rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-08 - Labels come from the consumer
**Serves:** Consumer labels - labels come from the consumer

- **GIVEN** a gallery rendered with
  `copy={{ zoom: "Hover to magnify", zoomInstructions: "Move the pointer or use the arrow keys; Escape hides the magnifier", previous: "Previous image", next: "Next image" }}`
- **WHEN** it renders
- **THEN** those strings are the magnifier group's accessible name and the
  controls' names
- **AND** no other language appears in those slots
