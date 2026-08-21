## Purpose

How an auction listing's photos are attached by an operator, identified by
physical side, described with optional alt text, published at named sizes, and
shown on the catalogue and the listing details page.

## ADDED Requirements

### Requirement: A listing photo belongs to one physical side

The system SHALL store at most one photo per listing per side. The sides SHALL
be `front`, `back`, `left`, `right`, `top`, and `bottom`. A listing SHALL NOT
be required to have every side, and SHALL NOT be required to have a front
photo in order to publish.

#### Scenario: A listing may omit sides

- **GIVEN** a draft listing with only a front photo
- **WHEN** an operator publishes it
- **THEN** the listing is published
- **AND** the details page shows that one photo
- **AND** no empty side is invented for the missing faces

#### Scenario: A second photo on the same side replaces rather than stacks

- **GIVEN** a draft listing that already has a front photo
- **WHEN** an operator uploads another front photo
- **THEN** the listing has exactly one front photo
- **AND** that photo is the one just uploaded

### Requirement: Operators attach photos from the admin listings table

The system SHALL let an operator with catalogue grant attach a JPEG, PNG, WebP,
or AVIF photo up to 20 MB to a side of a listing from the admin listings
table, and SHALL let them supply optional alt text of at most 200 characters
with the upload. Unsupported types and oversize bodies SHALL be refused.

#### Scenario: An accepted upload becomes that side's photo

- **GIVEN** a draft listing and an operator with catalogue grant
- **WHEN** they upload a JPEG under 20 MB to the front side
- **THEN** that side holds the photo
- **AND** the admin listings table can show it on that listing

#### Scenario: An unsupported type is refused

- **GIVEN** a draft listing
- **WHEN** an operator uploads a PDF as a listing photo
- **THEN** the system refuses the upload
- **AND** that side is unchanged

#### Scenario: An oversized photo is refused

- **GIVEN** a draft listing
- **WHEN** an operator uploads a photo larger than 20 MB
- **THEN** the system refuses the upload
- **AND** that side is unchanged

### Requirement: An operator confirms a photo before it is stored

The system SHALL NOT send listing-photo bytes to the auction service until the
operator confirms after seeing a preview of the selected file in the admin
photo manager. Choosing a file alone SHALL show that preview on the side being
filled or replaced and SHALL leave the stored photo for that side unchanged.
Discarding the preview SHALL clear the preview, leave the side unchanged, and
SHALL NOT upload. Confirm applies to both adding a missing side and replacing
a draft side.

#### Scenario: Choosing a file shows a preview without uploading

- **GIVEN** a draft listing with an empty front side
- **WHEN** an operator selects a JPEG under 20 MB for the front side
- **THEN** the admin photo manager shows a preview of that file on the front
  side
- **AND** the listing still has no stored front photo

#### Scenario: Confirming the preview stores the photo

- **GIVEN** an operator has selected a JPEG under 20 MB for a draft listing's
  front side and sees its preview
- **WHEN** they confirm the upload
- **THEN** that side holds the photo
- **AND** the preview is cleared

#### Scenario: Discarding the preview leaves the side unchanged

- **GIVEN** an operator has selected a photo for a draft listing's front side
  and sees its preview
- **WHEN** they discard the preview without confirming
- **THEN** the listing still has no stored front photo
- **AND** the preview is cleared
- **AND** no upload was sent

### Requirement: The admin photo manager reviews sides at card size with hover zoom

The admin photo manager SHALL lay out the six sides in a grid with at most
three sides per row. A stored photo SHALL be shown at card size. A magnify
control on each shown photo SHALL, on hover (or keyboard focus), reveal that
photo at zoom size in a preview at least three-quarters of the viewport
height. Leaving the control SHALL hide the zoom preview. The magnify control
SHALL NOT require a click to reveal zoom.

#### Scenario: The admin photo manager shows card size

- **GIVEN** a draft listing with a stored front photo
- **WHEN** an operator opens the photo manager for that listing
- **THEN** the front side shows the photo at card size

#### Scenario: Hovering the magnify control shows zoom size

- **GIVEN** a draft listing with a stored front photo open in the photo manager
- **WHEN** the operator hovers the magnify control on the front side
- **THEN** a zoom-size preview of that photo is shown
- **AND** that preview is at least three-quarters of the viewport height

#### Scenario: Leaving the magnify control hides zoom

- **GIVEN** the zoom-size preview is visible from hovering the magnify control
- **WHEN** the operator moves the pointer off the control
- **THEN** the zoom-size preview is hidden

### Requirement: Replace and remove only while the listing is a draft

The system SHALL refuse replacing a side that already has a photo, and SHALL
refuse removing a photo, unless the listing is a draft. A closed, settled, or
canceled listing SHALL refuse every photo mutation.

#### Scenario: Replacing a live photo is refused

- **GIVEN** a published listing with a front photo
- **WHEN** an operator uploads a new front photo
- **THEN** the system refuses the upload
- **AND** the published front photo is unchanged

#### Scenario: Removing a live photo is refused

- **GIVEN** a published listing with a front photo
- **WHEN** an operator removes the front photo
- **THEN** the system refuses the removal
- **AND** the published front photo is unchanged

#### Scenario: A draft photo can be replaced and removed

- **GIVEN** a draft listing with a front photo
- **WHEN** an operator replaces it, then removes it
- **THEN** the listing has no front photo

### Requirement: A missing side may be added until the listing closes

The system SHALL accept a photo on a side that has none while the listing is a
draft or published. Once the listing has closed, settled, or been canceled, an
add SHALL be refused.

#### Scenario: A published listing can gain a missing side

- **GIVEN** a published listing with a front photo and no back photo
- **WHEN** an operator uploads a back photo
- **THEN** the details page shows front and back
- **AND** the front photo is unchanged

#### Scenario: Adding after close is refused

- **GIVEN** a closed listing with no back photo
- **WHEN** an operator uploads a back photo
- **THEN** the system refuses the upload
- **AND** the listing still has no back photo

### Requirement: Alt text is optional and editable until close

The system SHALL store optional alt text per photo, trim surrounding
whitespace, treat an empty value as absent, and refuse alt text longer than
200 characters. When alt text is absent, the listing title SHALL be used as
the accessible name. An operator SHALL be able to change alt text without
replacing the photo while the listing is a draft or published. After close,
an alt-only edit SHALL be refused.

#### Scenario: Missing alt uses the listing title

- **GIVEN** a published listing titled "1999 Charizard, PSA 10" whose front
  photo has no alt text
- **WHEN** a collector opens the listing
- **THEN** that photo's accessible name is "1999 Charizard, PSA 10"

#### Scenario: Supplied alt is shown

- **GIVEN** a published listing whose front photo has alt text "Holo Charizard,
  front of slab"
- **WHEN** a collector opens the listing
- **THEN** that photo's accessible name is "Holo Charizard, front of slab"

#### Scenario: Alt can be edited on a published listing

- **GIVEN** a published listing with a front photo
- **WHEN** an operator changes only that photo's alt text
- **THEN** the photo bytes are unchanged
- **AND** the details page uses the new alt text

#### Scenario: Over-length alt is refused

- **GIVEN** a draft listing
- **WHEN** an operator sets alt text longer than 200 characters
- **THEN** the system refuses the edit
- **AND** any previous alt text is unchanged

### Requirement: Each photo is published at named sizes

The system SHALL offer every published photo at exactly these named sizes:
`card`, `detail`, `thumb`, and `zoom`. Each size SHALL be a path a browser can
fetch, not an absolute URL. When the stored photo is larger than the named
size, the system SHALL transform it to that size before answering. When it is
already within the named size, the system SHALL NOT upscale it. An unknown
size name SHALL be indistinguishable from a missing photo.

#### Scenario: The catalogue uses card size

- **GIVEN** a published listing with a front photo
- **WHEN** a collector opens the auction catalogue
- **THEN** the listing's front photo is requested at size `card`

#### Scenario: The details gallery uses thumb, detail, and zoom

- **GIVEN** a published listing with front and back photos
- **WHEN** a collector opens that listing
- **THEN** the thumbnail strip requests size `thumb`
- **AND** the main frame requests size `detail`
- **AND** zoom requests size `zoom`

#### Scenario: An unknown size is not found

- **GIVEN** a published listing photo
- **WHEN** a browser requests it at a size other than `card`, `detail`,
  `thumb`, or `zoom`
- **THEN** the system answers as it would for a photo that does not exist

### Requirement: The catalogue shows the front photo when one exists

The auction catalogue SHALL show each listing's front photo at card size when
that side has a photo. When it does not, the listing SHALL still appear, with
no placeholder photo invented. The catalogue SHALL NOT show any side other
than front.

#### Scenario: A listing with a front photo shows it on the catalogue

- **GIVEN** a published listing with a front photo and a back photo
- **WHEN** a collector opens the auction catalogue
- **THEN** the listing row shows the front photo at card size
- **AND** it does not show the back photo

#### Scenario: A listing without a front photo still lists

- **GIVEN** a published listing with no front photo
- **WHEN** a collector opens the auction catalogue
- **THEN** the listing appears with its title and price
- **AND** no photo is shown for it

### Requirement: The details page shows every attached side

The listing details page SHALL show every photo attached to the listing,
ordered front, back, left, right, top, bottom, omitting sides that have no
photo. A listing with one photo SHALL NOT present thumbnail or previous/next
controls as if further photos existed. A listing with no photos SHALL render
the rest of the page.

#### Scenario: Several sides appear in side order

- **GIVEN** a published listing with back, front, and top photos
- **WHEN** a collector opens that listing
- **THEN** the gallery shows three photos in the order front, back, top

#### Scenario: One photo has no strip

- **GIVEN** a published listing with only a front photo
- **WHEN** a collector opens that listing
- **THEN** the gallery shows that photo
- **AND** it does not show a thumbnail strip

#### Scenario: No photos still shows the listing

- **GIVEN** a published listing with no photos
- **WHEN** a collector opens that listing
- **THEN** the page shows the listing's title and bid panel
- **AND** the gallery has no photo
