# grade10-site/auction/listing-media Specification

## Purpose
How a listing's gallery images get optional alt text and named public sizes
(`card`, `detail`, `thumb`, `zoom`) on top of the ordered one-to-eight media
gallery defined by `grade10-admin/auction/listing`, and
how the catalogue and details page consume those sized paths. Gallery attach,
order, video, and the eight-item cap live in admin-listing; this capability
covers image delivery and alt.

## Feature set

- Collector-facing gallery
  - Catalogue card image: the catalogue shows a listing's first gallery item at
    card size when that item is an image
  - Details page order: the details page shows every gallery image in gallery
    order
  - Empty and single cases: one image shows no thumbnail strip, and a listing
    with no images still renders
  - Strip by width: several images show a left rail when the details gallery is
    wide enough beside the main frame; stacked keeps previous/next and progress

## MODIFIED Requirements

### Requirement: Each gallery image is published at named sizes

The system SHALL offer every published gallery **image** at exactly these
named sizes: `card`, `detail`, `thumb`, and `zoom`. Each size SHALL be a path
a browser can fetch, not an absolute URL. When the stored image is larger
than the named size, the system SHALL transform it to that size before
answering. When it is already within the named size, the system SHALL NOT
upscale it. An unknown size name SHALL be indistinguishable from a missing
image. Video gallery items SHALL keep their original public path from
admin-listing; named sizes apply to images only.

<!-- trace:scenario id=g10.auction-listing-media.SC-wbd rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-21 - The catalogue uses card size for an image card
**Serves:** grade10-site-auction-listing-media-US-05 - Collector views a listing's gallery images

- **GIVEN** a published listing whose first gallery item is an image
- **WHEN** a collector opens the auction catalogue
- **THEN** that listing's card image is requested at size `card`

<!-- trace:scenario id=g10.auction-listing-media.SC-ds2 rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-22 - The details gallery uses thumb, detail, and zoom
**Serves:** grade10-site-auction-listing-media-US-05 - Collector views a listing's gallery images

- **GIVEN** a published listing with two gallery images
- **AND** the details gallery is wide enough for a left rail beside the main
  frame
- **WHEN** a collector opens that listing
- **THEN** the thumbnail rail requests size `thumb`
- **AND** the main frame requests size `detail`
- **AND** zoom requests size `zoom`

<!-- trace:scenario id=g10.auction-listing-media.SC-7si rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-23 - An unknown size is not found
**Serves:** grade10-site-auction-listing-media-US-05 - Collector views a listing's gallery images

- **GIVEN** a published gallery image
- **WHEN** a browser requests it at a size other than `card`, `detail`,
  `thumb`, or `zoom`
- **THEN** the system answers as it would for an image that does not exist

### Requirement: The details page shows gallery images in order

The listing details page SHALL show every gallery image attached to the
listing in gallery order, omitting nothing that is an image item the page
renders through `ListingLotGallery`. A listing with one image SHALL NOT present
thumbnail or previous/next controls as if further images existed. A listing
with no images SHALL render the rest of the page. Video items in the gallery
remain admin-listing's concern for playback; this requirement covers the
sized image slots passed into the shared lot gallery.

**Strip by width** - With two or more images, the details page SHALL show a
left thumbnail rail only when the gallery is wide enough to place that rail
beside the main frame. When the gallery is stacked, it SHALL hide the rail and
SHALL keep previous/next and carousel progress.

<!-- trace:scenario id=g10.auction-listing-media.SC-yei rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-26 - Several images appear in gallery order
**Serves:** grade10-site-auction-listing-media-US-05 - Collector views a listing's gallery images

- **GIVEN** a published listing with three gallery images uploaded in order
  A, B, C
- **WHEN** a collector opens that listing
- **THEN** the gallery shows three images in the order A, B, C

<!-- trace:scenario id=g10.auction-listing-media.SC-iki rev=2 -->
#### Scenario: grade10-site-auction-listing-media-SC-27 - One image has no strip
**Serves:** grade10-site-auction-listing-media-US-05 - Collector views a listing's gallery images

- **GIVEN** a published listing with only one gallery image
- **WHEN** a collector opens that listing
- **THEN** the gallery shows that image
- **AND** it does not show a thumbnail strip
- **AND** previous and next are not available

<!-- trace:scenario id=g10.auction-listing-media.SC-70a rev=2 -->
#### Scenario: grade10-site-auction-listing-media-SC-28 - No images still shows the listing
**Serves:** grade10-site-auction-listing-media-US-05 - Collector views a listing's gallery images

- **GIVEN** a published listing with no gallery images
- **WHEN** a collector opens that listing
- **THEN** the page shows the listing's title and bid panel
- **AND** the gallery has no image
- **AND** previous and next are not available

<!-- trace:scenario id=g10.auction-listing-media.SC-5tk rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-29 - Wide details gallery shows a left rail
**Serves:** grade10-site-auction-listing-media-US-05 - Collector views a listing's gallery images

- **GIVEN** a published listing with two or more gallery images
- **AND** the details gallery is wide enough for a left rail beside the main
  frame
- **WHEN** a collector opens that listing
- **THEN** a thumbnail rail is shown beside the main frame

<!-- trace:scenario id=g10.auction-listing-media.SC-cd3 rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-30 - Stacked details gallery hides the rail
**Serves:** grade10-site-auction-listing-media-US-05 - Collector views a listing's gallery images

- **GIVEN** a published listing with two or more gallery images
- **AND** the details gallery is stacked and not wide enough for a left rail
  beside the main frame
- **WHEN** a collector opens that listing
- **THEN** no thumbnail rail is shown
- **AND** previous and next remain available
- **AND** carousel progress remains available
