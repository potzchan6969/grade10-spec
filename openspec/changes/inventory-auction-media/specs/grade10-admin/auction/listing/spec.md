## Purpose

Lets an authorized Grade10 operator draft, create, and publish an Auction
listing — incomplete saves first, required fields enforced at create, publish
now or at a future scheduled time — with an ordered gallery of one to eight
images or videos from product assets or direct uploads, frozen when saved, and
call one off while it has not closed. Named image sizes and optional alt live
in `grade10-site/auction/listing-media`.

## Feature set

- Gallery
  - Combined sources: selected product assets and listing-only uploads form one ordered gallery
  - Saved snapshot: a selected product asset becomes listing media on Save, unaffected by later product-media edits, reordering, or deletion

## MODIFIED Requirements

### Requirement: Listing media is an ordered gallery of one to eight uploads

While a listing is `draft`, `created`, or `published`, an authorized operator
SHALL be able to attach, replace, remove, and reorder direct uploads and
selected assets from the listing's product.

A listing SHALL hold at most eight media items across direct uploads and
selected product assets. A ninth item SHALL be refused and SHALL leave the
gallery unchanged. Direct uploads and selected product assets SHALL share one
operator-controlled display order.

A listing MAY select only assets from its selected product. A selected product
asset SHALL be available at Save time. If its latest source asset is absent at
Save time, Grade10 SHALL refuse the save.

On a successful Save, Grade10 SHALL snapshot every selected product asset into
the listing gallery. Later replacement, removal, reordering, or other changes
to the product gallery SHALL NOT alter the saved listing gallery.

A draft SHALL be allowed to have zero media. Create SHALL require at least one
media item. A `created` or `published` listing SHALL reject a remove that would
leave zero items.

Each direct upload is one file, either an image or a video. Accepted image
types are JPEG, PNG, WebP, and AVIF. Accepted video types are MP4, WebM, and
QuickTime. Any other type or an empty file SHALL be refused. Each direct upload
SHALL be at most 104857600 bytes; a larger file SHALL be refused.

The first item SHALL be the catalogue card a browse list shows. A collector
reading a published listing SHALL receive the gallery in its display order.

#### Scenario: grade10-admin-auction-listing-SC-46 - Operator uploads an eighth file
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a draft listing with seven media items
- **WHEN** the operator uploads an eighth JPEG
- **THEN** Grade10 stores eight media items in the operator's order

#### Scenario: grade10-admin-auction-listing-SC-47 - A ninth file is refused
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a draft listing with eight media items
- **WHEN** the operator uploads a ninth file
- **THEN** Grade10 refuses the upload
- **AND** the gallery still has eight items

#### Scenario: grade10-admin-auction-listing-SC-48 - Mixed images and videos are accepted
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a draft listing with no media
- **WHEN** an operator uploads a JPEG, an MP4, and a WebP
- **THEN** Grade10 stores three media items in that order

#### Scenario: grade10-admin-auction-listing-SC-49 - Upload is stored without processing
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a draft listing
- **WHEN** an operator uploads a JPEG
- **THEN** Grade10 stores and serves that same body and type as the item's original

#### Scenario: grade10-admin-auction-listing-SC-50 - Unsupported type is refused
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a draft listing
- **WHEN** an operator uploads an unsupported file
- **THEN** Grade10 refuses the upload

#### Scenario: grade10-admin-auction-listing-SC-51 - File over 100 mebibytes is refused
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a draft listing
- **WHEN** an operator uploads a file larger than 104857600 bytes
- **THEN** Grade10 refuses the upload

#### Scenario: grade10-admin-auction-listing-SC-52 - First item is the catalogue card
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a listing in front of collectors

- **GIVEN** a published listing whose gallery starts with a video
- **WHEN** a collector opens the Auction catalogue
- **THEN** that listing's card uses the first gallery item

#### Scenario: grade10-admin-auction-listing-SC-53 - Operator reorders and removes media
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a published listing with three images in order A, B, C
- **WHEN** an operator moves C first and removes B
- **THEN** the gallery is C, A

#### Scenario: grade10-admin-auction-listing-SC-54 - Last media item cannot be removed after create
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a published listing with one JPEG
- **WHEN** an operator removes that JPEG
- **THEN** Grade10 refuses the remove

#### Scenario: grade10-admin-auction-listing-SC-55 - Closed listing rejects a media upload
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a closed listing
- **WHEN** an operator uploads an image
- **THEN** Grade10 refuses the upload

#### Scenario: grade10-admin-auction-listing-SC-95 - Operator combines direct uploads and product assets
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a listing with a selected product that has reusable assets
- **WHEN** an authorized operator adds direct uploads and selects product assets in an interleaved order
- **THEN** Grade10 saves one listing gallery in that order

#### Scenario: grade10-admin-auction-listing-SC-96 - Listing selection is limited to its product assets
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a listing with a selected product and another product with assets
- **WHEN** an authorized operator attempts to select an asset from the other product
- **THEN** Grade10 refuses the selection
- **AND** the listing gallery is unchanged

#### Scenario: grade10-admin-auction-listing-SC-97 - The combined gallery cannot exceed eight items
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a listing whose direct uploads and selected product assets total eight items
- **WHEN** an authorized operator adds or selects another item
- **THEN** Grade10 refuses the operation
- **AND** the gallery still has eight items

#### Scenario: grade10-admin-auction-listing-SC-98 - Saving snapshots selected product assets
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a selected product asset available to a listing editor
- **WHEN** an authorized operator selects it and saves the listing
- **THEN** Grade10 stores that asset in the listing gallery as saved media

#### Scenario: grade10-admin-auction-listing-SC-99 - A missing source asset refuses Save
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** an operator has selected a product asset for a listing
- **AND** the asset is absent from the product gallery before Save
- **WHEN** the operator saves the listing
- **THEN** Grade10 refuses the save

#### Scenario: grade10-admin-auction-listing-SC-100 - A saved listing does not follow later product-gallery changes
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a listing saved with a selected product asset
- **WHEN** the product asset is replaced, removed, or reordered later
- **THEN** the saved listing gallery remains unchanged
