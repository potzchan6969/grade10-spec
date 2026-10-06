# grade10-site/auction/listing-media Specification

## Purpose

How a listing's gallery images get optional alt text and named public sizes
(`card`, `detail`, `thumb`, `zoom`) on top of the ordered one-to-eight media
gallery defined by `grade10-admin/auction/listing`, and
how the catalogue and details page consume those sized paths. Gallery attach,
order, video, and the eight-item cap live in admin-listing; this capability
covers image delivery and alt.

## Feature set

- Gallery images, not sides
  - Ordered image items: gallery images are the image items in admin-listing's
    ordered gallery, so no physical side names identity and no empty slot is
    invented
  - Shared eight-item cap: the eight-item bound comes from admin-listing rather
    than from a second gallery defined here
- Operator image upload
  - Accepted types and size: JPEG, PNG, WebP and AVIF within the shared media
    size bound reach storage; anything else is refused
  - Card-size review with zoom: the admin media manager shows stored images at
    card size and reveals a large zoom preview on hover or focus
  - Upload on drop or choose: a supported file stores as soon as it is dropped
    or chosen, without a preview, confirm or discard step
- Image lifecycle
  - Replace and remove: image mutations follow admin-listing's writable states
    and its refusal to remove the last item after create
  - Add until close: another image may join while the listing is draft,
    created, or published, and never after it closes
- Alt text
  - Optional alt per image: trimmed, at most 200 characters, and absent when
    the value is empty
  - Title fallback: the listing title is the accessible name when an image
    carries no alt text
  - Editable until close: alt changes without touching the image bytes while
    the listing is still writable
- Named public sizes
  - card, detail, thumb, zoom: every published gallery image is fetchable at
    exactly these four named paths
  - No upscaling: an image already within a named size is answered as it is
  - Unknown size: a size name outside the set answers as a missing image
- Collector-facing gallery
  - Catalogue card image: the catalogue shows a listing's first gallery item at
    card size when that item is an image
  - Details page order: the details page shows every gallery image in gallery
    order
  - Empty and single cases: one image shows no thumbnail strip, and a listing
    with no images still renders
  - Strip by width: several images show a left rail when the details gallery is
    wide enough beside the main frame; stacked keeps previous/next and progress

## Requirements

### Requirement: Image items use the ordered gallery, not physical sides

Listing images SHALL be the image items in the listing's ordered media
gallery from `grade10-admin/auction/listing`: at most eight media items total
(image or video), positions controlled by the operator, no physical-side
vocabulary (`front`, `back`, and the rest) as identity. A listing SHALL NOT
invent empty slots for unused positions. This capability SHALL NOT introduce
a second gallery keyed by side.

<!-- trace:scenario id=g10.auction-listing-media.SC-1uo rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-01 - A listing may hold fewer than eight items
**Serves:** grade10-site-auction-listing-media-US-01 - Operator attaches an image to a listing gallery

- **GIVEN** a draft listing with only one JPEG in the gallery
- **WHEN** an operator publishes it (after create)
- **THEN** the listing is published
- **AND** the details page shows that one image
- **AND** no empty gallery slots are invented

<!-- trace:scenario id=g10.auction-listing-media.SC-c93 rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-02 - A ninth media item is refused by the gallery cap
**Serves:** grade10-site-auction-listing-media-US-01 - Operator attaches an image to a listing gallery

- **GIVEN** a draft listing with eight media items
- **WHEN** an operator uploads a ninth image
- **THEN** the system refuses the upload
- **AND** the gallery still has eight items

### Requirement: Operators attach gallery images from admin

The system SHALL let an operator with catalogue grant attach a JPEG, PNG,
WebP, or AVIF image (within the media size bound shared with admin-listing:
at most 100 mebibytes) into the listing gallery from the grade10 admin
listings surface, and SHALL let them supply optional alt text of at most 200
characters with the upload. Unsupported image types and oversize bodies
SHALL be refused. Video attach and playback stay under admin-listing; this
requirement covers image items and their alt.

<!-- trace:scenario id=g10.auction-listing-media.SC-dqz rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-03 - An accepted upload becomes a gallery image
**Serves:** grade10-site-auction-listing-media-US-01 - Operator attaches an image to a listing gallery

- **GIVEN** a draft listing with fewer than eight media items and an operator
  with catalogue grant
- **WHEN** they upload a JPEG under the media size bound into the gallery
- **THEN** that image is stored in gallery order
- **AND** the admin listings surface can show it on that listing

<!-- trace:scenario id=g10.auction-listing-media.SC-99z rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-04 - An unsupported type is refused
**Serves:** grade10-site-auction-listing-media-US-01 - Operator attaches an image to a listing gallery

- **GIVEN** a draft listing
- **WHEN** an operator uploads a PDF as gallery media
- **THEN** the system refuses the upload
- **AND** the gallery is unchanged

<!-- trace:scenario id=g10.auction-listing-media.SC-zlc rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-05 - An oversized image is refused
**Serves:** grade10-site-auction-listing-media-US-01 - Operator attaches an image to a listing gallery

- **GIVEN** a draft listing
- **WHEN** an operator uploads an image larger than 104857600 bytes
- **THEN** the system refuses the upload
- **AND** the gallery is unchanged

### Requirement: The admin media manager reviews images at card size with hover zoom

The admin media manager SHALL let an operator review the listing's gallery
images (at most eight items) so they can upload, replace, and inspect them.
Layout of that surface is not prescribed — any arrangement that shows the
gallery items is fine. A stored image SHALL be shown at card size. A magnify
control on each shown image SHALL, on hover (or keyboard focus), reveal that
image at zoom size in a preview at least three-quarters of the viewport
height. Leaving the control SHALL hide the zoom preview. The magnify control
SHALL NOT require a click to reveal zoom.

<!-- trace:scenario id=g10.auction-listing-media.SC-ez7 rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-09 - The admin media manager shows card size
**Serves:** grade10-site-auction-listing-media-US-02 - Operator inspects a stored image at zoom size

- **GIVEN** a draft listing with a stored gallery image
- **WHEN** an operator opens the media manager for that listing
- **THEN** that image shows at card size

<!-- trace:scenario id=g10.auction-listing-media.SC-wuz rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-10 - Hovering the magnify control shows zoom size
**Serves:** grade10-site-auction-listing-media-US-02 - Operator inspects a stored image at zoom size

- **GIVEN** a draft listing with a stored gallery image open in the media
  manager
- **WHEN** the operator hovers the magnify control on that image
- **THEN** a zoom-size preview of that image is shown
- **AND** that preview is at least three-quarters of the viewport height

<!-- trace:scenario id=g10.auction-listing-media.SC-qgb rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-11 - Leaving the magnify control hides zoom
**Serves:** grade10-site-auction-listing-media-US-02 - Operator inspects a stored image at zoom size

- **GIVEN** the zoom-size preview is visible from hovering the magnify control
- **WHEN** the operator moves the pointer off the control
- **THEN** the zoom-size preview is hidden

### Requirement: Replace and remove follow the admin-listing gallery rules

Replace and remove of gallery images SHALL follow
`grade10-admin/auction/listing`: writable while the listing is `draft`,
`created`, or `published`, subject to that capability's last-item and
closed-listing refusals. A closed, settled, or canceled listing SHALL refuse
every image mutation from this surface.

<!-- trace:scenario id=g10.auction-listing-media.SC-dgy rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-12 - Replacing a gallery image on a published listing
**Serves:** grade10-site-auction-listing-media-US-03 - Operator corrects a listing's gallery images

- **GIVEN** a published listing with a gallery image at a position
- **WHEN** an operator replaces that image (allowed by admin-listing)
- **THEN** that position holds the new image
- **AND** other gallery items are unchanged

<!-- trace:scenario id=g10.auction-listing-media.SC-gj8 rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-13 - Removing the last image after create is refused
**Serves:** grade10-site-auction-listing-media-US-03 - Operator corrects a listing's gallery images

- **GIVEN** a published listing with one JPEG
- **WHEN** an operator removes that JPEG
- **THEN** the system refuses the removal
- **AND** the gallery still has that JPEG

<!-- trace:scenario id=g10.auction-listing-media.SC-82s rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-14 - A draft gallery image can be replaced and removed
**Serves:** grade10-site-auction-listing-media-US-03 - Operator corrects a listing's gallery images

- **GIVEN** a draft listing with one gallery image
- **WHEN** an operator replaces it, then removes it
- **THEN** the listing has no gallery images

### Requirement: A gallery image may be added until the listing closes

The system SHALL accept an additional image while the listing is `draft`,
`created`, or `published` and the gallery has fewer than eight items. Once
the listing has closed, settled, or been canceled, an add SHALL be refused.

<!-- trace:scenario id=g10.auction-listing-media.SC-cnb rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-15 - A published listing can gain another image
**Serves:** grade10-site-auction-listing-media-US-01 - Operator attaches an image to a listing gallery

- **GIVEN** a published listing with one gallery image and room under the
  eight-item cap
- **WHEN** an operator uploads a second JPEG
- **THEN** the details page shows both images in gallery order
- **AND** the first image is unchanged

<!-- trace:scenario id=g10.auction-listing-media.SC-r6j rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-16 - Adding after close is refused
**Serves:** grade10-site-auction-listing-media-US-01 - Operator attaches an image to a listing gallery

- **GIVEN** a closed listing with one gallery image
- **WHEN** an operator uploads another image
- **THEN** the system refuses the upload
- **AND** the gallery is unchanged

### Requirement: Alt text is optional and editable until close

The system SHALL store optional alt text per gallery image, trim surrounding
whitespace, treat an empty value as absent, and refuse alt text longer than
200 characters. When alt text is absent, the listing title SHALL be used as
the accessible name. An operator SHALL be able to change alt text without
replacing the image while the listing is a draft, created, or published.
After close, an alt-only edit SHALL be refused. Video items are outside this
alt requirement.

<!-- trace:scenario id=g10.auction-listing-media.SC-mo0 rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-17 - Missing alt uses the listing title
**Serves:** grade10-site-auction-listing-media-US-04 - Operator describes a gallery image with alt text

- **GIVEN** a published listing titled "1999 Charizard, PSA 10" whose first
  gallery image has no alt text
- **WHEN** a collector opens the listing
- **THEN** that image's accessible name is "1999 Charizard, PSA 10"

<!-- trace:scenario id=g10.auction-listing-media.SC-k31 rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-18 - Supplied alt is shown
**Serves:** grade10-site-auction-listing-media-US-04 - Operator describes a gallery image with alt text

- **GIVEN** a published listing whose first gallery image has alt text "Holo
  Charizard, front of slab"
- **WHEN** a collector opens the listing
- **THEN** that image's accessible name is "Holo Charizard, front of slab"

<!-- trace:scenario id=g10.auction-listing-media.SC-46l rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-19 - Alt can be edited on a published listing
**Serves:** grade10-site-auction-listing-media-US-04 - Operator describes a gallery image with alt text

- **GIVEN** a published listing with a gallery image
- **WHEN** an operator changes only that image's alt text
- **THEN** the image bytes are unchanged
- **AND** the details page uses the new alt text

<!-- trace:scenario id=g10.auction-listing-media.SC-0b1 rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-20 - Over-length alt is refused
**Serves:** grade10-site-auction-listing-media-US-04 - Operator describes a gallery image with alt text

- **GIVEN** a draft listing
- **WHEN** an operator sets alt text longer than 200 characters
- **THEN** the system refuses the edit
- **AND** any previous alt text is unchanged

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

### Requirement: The catalogue shows the first gallery image when it is an image

The auction catalogue SHALL show each listing's first gallery item at card
size when that item is an image. When the gallery is empty, or the first item
is not an image, the listing SHALL still appear; this capability SHALL NOT
invent a placeholder image. Which item is first is gallery order from
admin-listing, not a physical side named `front`.

<!-- trace:scenario id=g10.auction-listing-media.SC-78a rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-24 - A listing with a first gallery image shows it on the catalogue
**Serves:** grade10-site-auction-listing-media-US-05 - Collector views a listing's gallery images

- **GIVEN** a published listing whose gallery is image A then image B
- **WHEN** a collector opens the auction catalogue
- **THEN** the listing row shows image A at card size
- **AND** it does not show image B on the card

<!-- trace:scenario id=g10.auction-listing-media.SC-0nc rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-25 - A listing without a catalogue image still lists
**Serves:** grade10-site-auction-listing-media-US-05 - Collector views a listing's gallery images

- **GIVEN** a published listing with no gallery images
- **WHEN** a collector opens the auction catalogue
- **THEN** the listing appears with its title and price
- **AND** no image is shown for it by this capability

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

### Requirement: An operator stores a chosen image without confirmation

The system SHALL store a supported JPEG, PNG, WebP or AVIF when an operator
drops or chooses it in the admin media manager. It SHALL not require a preview,
confirm or discard step before storing the file. A replacement SHALL take the
same immediate path as an added file.

When one drop or file selection contains several files, the system SHALL
process them one after another in selection order, starting after the last
item in the current gallery. A file refused for type, size or the eight-item
cap SHALL remain unstored and SHALL be named with the reason; accepted files
from the same selection SHALL remain stored.

For direct-upload items, a new gallery order SHALL hold when the operator
drops the reordered item. While inventory assets are staged, their order SHALL
continue to wait for the listing's Save.

<!-- trace:scenario id=g10.auction-listing-media.SC-41j rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-31 - Choosing a supported file stores it immediately
**Serves:** grade10-site-auction-listing-media-US-01 - Operator attaches an image to a listing gallery

- **GIVEN** a draft listing with fewer than eight media items
- **WHEN** an operator chooses a JPEG under the media size bound
- **THEN** the image is stored in the gallery immediately
- **AND** no preview, confirm or discard step is required

<!-- trace:scenario id=g10.auction-listing-media.SC-j5f rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-32 - Several chosen files append in selection order
**Serves:** grade10-site-auction-listing-media-US-01 - Operator attaches an image to a listing gallery

- **GIVEN** a draft listing whose gallery already has one item
- **WHEN** an operator drops three supported images in a known selection order
- **THEN** the system stores them one after another after the existing item
- **AND** the gallery keeps the selection order

<!-- trace:scenario id=g10.auction-listing-media.SC-1mk rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-33 - Replacing a file stores immediately
**Serves:** grade10-site-auction-listing-media-US-01 - Operator attaches an image to a listing gallery

- **GIVEN** a draft listing with a stored image at one gallery position
- **WHEN** an operator chooses a supported replacement image for that position
- **THEN** the replacement is stored immediately at that position
- **AND** the other gallery items are unchanged

<!-- trace:scenario id=g10.auction-listing-media.SC-su1 rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-34 - A mixed selection names each refused file
**Serves:** grade10-site-auction-listing-media-US-01 - Operator attaches an image to a listing gallery

- **GIVEN** a draft listing with room for two more media items
- **WHEN** an operator chooses two supported images, a PDF, an oversized image and a file past the eight-item cap
- **THEN** the supported images are stored
- **AND** each refused file remains unstored and is named with its refusal reason

<!-- trace:scenario id=g10.auction-listing-media.SC-y9i rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-35 - Direct-upload reorder holds on drop
**Serves:** grade10-site-auction-listing-media-US-01 - Operator attaches an image to a listing gallery

- **GIVEN** a draft listing with three direct-upload images in gallery order A, B, C
- **WHEN** an operator drags C before A and drops it
- **THEN** the gallery order becomes C, A, B without a separate Save action

<!-- trace:scenario id=g10.auction-listing-media.SC-dva rev=1 -->
#### Scenario: grade10-site-auction-listing-media-SC-36 - Staged inventory order waits for Save
**Serves:** grade10-site-auction-listing-media-US-01 - Operator attaches an image to a listing gallery

- **GIVEN** a draft listing with inventory assets staged but not saved
- **WHEN** an operator changes their order and leaves the listing without saving
- **THEN** the stored listing keeps its prior inventory order
- **AND** the new order applies only after the listing is saved
