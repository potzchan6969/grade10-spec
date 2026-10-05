# grade10-site/auction/listing-media Specification

## Feature set

- Operator image upload
  - Accepted types and size: JPEG, PNG, WebP and AVIF within the shared media
    size bound reach storage; anything else is refused
  - Upload on drop or choose: a supported file stores as soon as it is dropped
    or chosen, without a preview, confirm or discard step
  - Card-size review with zoom: the admin media manager shows stored images at
    card size and reveals a large zoom preview on hover or focus

## REMOVED Requirements

### Requirement: An operator confirms an image before it is stored

**Reason:** A direct-upload file now stores when it is dropped or chosen. A
preview and confirm step adds one avoidable press per photograph, while a
wrong upload can be removed like any other stored item.

**Migration:** The media manager stores accepted files immediately. The
replacement requirement covers single files, multi-file selection, replacement
and the order in which each file is stored.

## ADDED Requirements

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

#### Scenario: grade10-site-auction-listing-media-SC-31 - Choosing a supported file stores it immediately
**Serves:** grade10-site-auction-listing-media-US-01 - Operator attaches an image to a listing gallery

- **GIVEN** a draft listing with fewer than eight media items
- **WHEN** an operator chooses a JPEG under the media size bound
- **THEN** the image is stored in the gallery immediately
- **AND** no preview, confirm or discard step is required

#### Scenario: grade10-site-auction-listing-media-SC-32 - Several chosen files append in selection order
**Serves:** grade10-site-auction-listing-media-US-01 - Operator attaches an image to a listing gallery

- **GIVEN** a draft listing whose gallery already has one item
- **WHEN** an operator drops three supported images in a known selection order
- **THEN** the system stores them one after another after the existing item
- **AND** the gallery keeps the selection order

#### Scenario: grade10-site-auction-listing-media-SC-33 - Replacing a file stores immediately
**Serves:** grade10-site-auction-listing-media-US-01 - Operator attaches an image to a listing gallery

- **GIVEN** a draft listing with a stored image at one gallery position
- **WHEN** an operator chooses a supported replacement image for that position
- **THEN** the replacement is stored immediately at that position
- **AND** the other gallery items are unchanged

#### Scenario: grade10-site-auction-listing-media-SC-34 - A mixed selection names each refused file
**Serves:** grade10-site-auction-listing-media-US-01 - Operator attaches an image to a listing gallery

- **GIVEN** a draft listing with room for two more media items
- **WHEN** an operator chooses two supported images, a PDF, an oversized image and a file past the eight-item cap
- **THEN** the supported images are stored
- **AND** each refused file remains unstored and is named with its refusal reason

#### Scenario: grade10-site-auction-listing-media-SC-35 - Direct-upload reorder holds on drop
**Serves:** grade10-site-auction-listing-media-US-01 - Operator attaches an image to a listing gallery

- **GIVEN** a draft listing with three direct-upload images in gallery order A, B, C
- **WHEN** an operator drags C before A and drops it
- **THEN** the gallery order becomes C, A, B without a separate Save action

#### Scenario: grade10-site-auction-listing-media-SC-36 - Staged inventory order waits for Save
**Serves:** grade10-site-auction-listing-media-US-01 - Operator attaches an image to a listing gallery

- **GIVEN** a draft listing with inventory assets staged but not saved
- **WHEN** an operator changes their order and leaves the listing without saving
- **THEN** the stored listing keeps its prior inventory order
- **AND** the new order applies only after the listing is saved
