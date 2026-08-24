## Purpose

How a listing's gallery images get optional alt text and named public sizes
(`card`, `detail`, `thumb`, `zoom`) on top of the ordered one-to-eight media
gallery defined by `grade10-auction/admin-listing`, and how the catalogue and
details page consume those sized paths. Gallery attach, order, video, and the
eight-item cap live in admin-listing; this capability covers image delivery
and alt.

## ADDED Requirements

### Requirement: Image items use the ordered gallery, not physical sides

Listing images SHALL be the image items in the listing's ordered media
gallery from `grade10-auction/admin-listing`: at most eight media items total
(image or video), positions controlled by the operator, no physical-side
vocabulary (`front`, `back`, and the rest) as identity. A listing SHALL NOT
invent empty slots for unused positions. This capability SHALL NOT introduce
a second gallery keyed by side.

#### Scenario: A listing may hold fewer than eight items

- **GIVEN** a draft listing with only one JPEG in the gallery
- **WHEN** an operator publishes it (after create)
- **THEN** the listing is published
- **AND** the details page shows that one image
- **AND** no empty gallery slots are invented

#### Scenario: A ninth media item is refused by the gallery cap

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

#### Scenario: An accepted upload becomes a gallery image

- **GIVEN** a draft listing with fewer than eight media items and an operator
  with catalogue grant
- **WHEN** they upload a JPEG under the media size bound into the gallery
- **THEN** that image is stored in gallery order
- **AND** the admin listings surface can show it on that listing

#### Scenario: An unsupported type is refused

- **GIVEN** a draft listing
- **WHEN** an operator uploads a PDF as a listing image
- **THEN** the system refuses the upload
- **AND** the gallery is unchanged

#### Scenario: An oversized image is refused

- **GIVEN** a draft listing
- **WHEN** an operator uploads an image larger than 104857600 bytes
- **THEN** the system refuses the upload
- **AND** the gallery is unchanged

### Requirement: An operator confirms an image before it is stored

The system SHALL NOT send listing-image bytes to the auction service until
the operator confirms after seeing a preview of the selected file in the
admin photo manager. Choosing a file alone SHALL show that preview for the
gallery slot being filled or replaced and SHALL leave the stored item for
that slot unchanged. Discarding the preview SHALL clear the preview, leave
the gallery unchanged, and SHALL NOT upload. Confirm applies to both adding
an item and replacing a draft item.

#### Scenario: Choosing a file shows a preview without uploading

- **GIVEN** a draft listing with an empty gallery slot the operator is filling
- **WHEN** an operator selects a JPEG under the media size bound
- **THEN** the admin photo manager shows a preview of that file
- **AND** the listing still has no new stored image for that slot

#### Scenario: Confirming the preview stores the image

- **GIVEN** an operator has selected a JPEG for a draft listing gallery slot
  and sees its preview
- **WHEN** they confirm the upload
- **THEN** that slot holds the image
- **AND** the preview is cleared

#### Scenario: Discarding the preview leaves the gallery unchanged

- **GIVEN** an operator has selected an image for a draft listing gallery
  slot and sees its preview
- **WHEN** they discard the preview without confirming
- **THEN** the gallery is unchanged
- **AND** the preview is cleared
- **AND** no upload was sent

### Requirement: The admin photo manager reviews images at card size with hover zoom

The admin photo manager SHALL lay out gallery image items in a grid with at
most three items per row (up to eight items in the gallery). A stored image
SHALL be shown at card size. A magnify control on each shown image SHALL, on
hover (or keyboard focus), reveal that image at zoom size in a preview at
least three-quarters of the viewport height. Leaving the control SHALL hide
the zoom preview. The magnify control SHALL NOT require a click to reveal
zoom.

#### Scenario: The admin photo manager shows card size

- **GIVEN** a draft listing with a stored gallery image
- **WHEN** an operator opens the photo manager for that listing
- **THEN** that image shows at card size

#### Scenario: Hovering the magnify control shows zoom size

- **GIVEN** a draft listing with a stored gallery image open in the photo
  manager
- **WHEN** the operator hovers the magnify control on that image
- **THEN** a zoom-size preview of that image is shown
- **AND** that preview is at least three-quarters of the viewport height

#### Scenario: Leaving the magnify control hides zoom

- **GIVEN** the zoom-size preview is visible from hovering the magnify control
- **WHEN** the operator moves the pointer off the control
- **THEN** the zoom-size preview is hidden

### Requirement: Replace and remove follow the admin-listing gallery rules

Replace and remove of gallery images SHALL follow
`grade10-auction/admin-listing`: writable while the listing is `draft`,
`created`, or `published`, subject to that capability's last-item and
closed-listing refusals. A closed, settled, or canceled listing SHALL refuse
every image mutation from this surface.

#### Scenario: Replacing a gallery image on a published listing

- **GIVEN** a published listing with a gallery image at a position
- **WHEN** an operator replaces that image (allowed by admin-listing)
- **THEN** that position holds the new image
- **AND** other gallery items are unchanged

#### Scenario: Removing the last image after create is refused

- **GIVEN** a published listing with one JPEG
- **WHEN** an operator removes that JPEG
- **THEN** the system refuses the removal
- **AND** the gallery still has that JPEG

#### Scenario: A draft gallery image can be replaced and removed

- **GIVEN** a draft listing with one gallery image
- **WHEN** an operator replaces it, then removes it
- **THEN** the listing has no gallery images

### Requirement: A gallery image may be added until the listing closes

The system SHALL accept an additional image while the listing is `draft`,
`created`, or `published` and the gallery has fewer than eight items. Once
the listing has closed, settled, or been canceled, an add SHALL be refused.

#### Scenario: A published listing can gain another image

- **GIVEN** a published listing with one gallery image and room under the
  eight-item cap
- **WHEN** an operator uploads a second JPEG
- **THEN** the details page shows both images in gallery order
- **AND** the first image is unchanged

#### Scenario: Adding after close is refused

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

#### Scenario: Missing alt uses the listing title

- **GIVEN** a published listing titled "1999 Charizard, PSA 10" whose first
  gallery image has no alt text
- **WHEN** a collector opens the listing
- **THEN** that image's accessible name is "1999 Charizard, PSA 10"

#### Scenario: Supplied alt is shown

- **GIVEN** a published listing whose first gallery image has alt text "Holo
  Charizard, front of slab"
- **WHEN** a collector opens the listing
- **THEN** that image's accessible name is "Holo Charizard, front of slab"

#### Scenario: Alt can be edited on a published listing

- **GIVEN** a published listing with a gallery image
- **WHEN** an operator changes only that image's alt text
- **THEN** the image bytes are unchanged
- **AND** the details page uses the new alt text

#### Scenario: Over-length alt is refused

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

#### Scenario: The catalogue uses card size for an image card

- **GIVEN** a published listing whose first gallery item is an image
- **WHEN** a collector opens the auction catalogue
- **THEN** that listing's card image is requested at size `card`

#### Scenario: The details gallery uses thumb, detail, and zoom

- **GIVEN** a published listing with two gallery images
- **WHEN** a collector opens that listing
- **THEN** the thumbnail strip requests size `thumb`
- **AND** the main frame requests size `detail`
- **AND** zoom requests size `zoom`

#### Scenario: An unknown size is not found

- **GIVEN** a published listing image
- **WHEN** a browser requests it at a size other than `card`, `detail`,
  `thumb`, or `zoom`
- **THEN** the system answers as it would for an image that does not exist

### Requirement: The catalogue shows the first gallery image when it is an image

The auction catalogue SHALL show each listing's first gallery item at card
size when that item is an image. When the gallery is empty, or the first item
is not an image, the listing SHALL still appear; this capability SHALL NOT
invent a placeholder image. Which item is first is gallery order from
admin-listing, not a physical side named `front`.

#### Scenario: A listing with a first gallery image shows it on the catalogue

- **GIVEN** a published listing whose gallery is image A then image B
- **WHEN** a collector opens the auction catalogue
- **THEN** the listing row shows image A at card size
- **AND** it does not show image B on the card

#### Scenario: A listing without a catalogue image still lists

- **GIVEN** a published listing with no gallery images
- **WHEN** a collector opens the auction catalogue
- **THEN** the listing appears with its title and price
- **AND** no image is shown for it by this capability

### Requirement: The details page shows gallery images in order

The listing details page SHALL show every gallery image attached to the
listing in gallery order, omitting nothing that is an image item the page
renders through `ListingGallery`. A listing with one image SHALL NOT present
thumbnail or previous/next controls as if further images existed. A listing
with no images SHALL render the rest of the page. Video items in the gallery
remain admin-listing's concern for playback; this requirement covers the
sized image slots passed into the shared gallery.

#### Scenario: Several images appear in gallery order

- **GIVEN** a published listing with three gallery images uploaded in order
  A, B, C
- **WHEN** a collector opens that listing
- **THEN** the gallery shows three images in the order A, B, C

#### Scenario: One image has no strip

- **GIVEN** a published listing with only one gallery image
- **WHEN** a collector opens that listing
- **THEN** the gallery shows that image
- **AND** it does not show a thumbnail strip

#### Scenario: No images still shows the listing

- **GIVEN** a published listing with no gallery images
- **WHEN** a collector opens that listing
- **THEN** the page shows the listing's title and bid panel
- **AND** the gallery has no image
