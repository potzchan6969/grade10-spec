## Purpose

Lets an authorized Grade10 operator create and update an Auction listing —
its catalogue copy, prices, window, and an unprocessed gallery of up to eight
images or videos — and publishes that gallery to collectors in the same order.

## ADDED Requirements

### Requirement: Operator creates a listing as a draft

An authorized operator SHALL create an Auction listing from the Grade10
auction admin section. A successful create SHALL persist a draft listing and
SHALL mint a new auctionable unit that has no other live listing. The listing
SHALL NOT become visible on the public catalogue until it is published.

Creating a listing SHALL require a title, a starting price, a minimum
increment, a start time, and a scheduled close. Every other field on the
create form is optional and, when omitted, takes the default named with that
field.

A create from an operator who is not authorized to set an auction's prices
and window SHALL be refused.

#### Scenario: Operator creates a complete draft

- **GIVEN** an authorized operator on the Grade10 auction listings section
- **WHEN** they submit a new listing with a title, a starting price of 100000
  minor units, a minimum increment of 5000 minor units, currency `HKD`, a
  start in the future, and a scheduled close after that start
- **THEN** Grade10 persists a draft listing with those facts
- **AND** the listing is absent from the public catalogue

#### Scenario: Create without a title is refused

- **GIVEN** an authorized operator
- **WHEN** they submit a new listing with a blank title
- **THEN** Grade10 refuses the create
- **AND** it persists no listing

#### Scenario: Unauthorized create is refused

- **GIVEN** a signed-in operator who may not set an auction's prices and window
- **WHEN** they submit a new listing
- **THEN** Grade10 refuses the create
- **AND** it persists no listing

### Requirement: Catalogue fields an operator may write

While a listing is `draft` or `published`, an authorized operator SHALL be
able to set these catalogue fields. Each write SHALL replace the stored
value; an omitted field on an update SHALL leave the stored value unchanged.

- **Title** — required, trimmed, 1 to 200 characters.
- **Copy** — optional, at most 4000 characters, empty allowed.
- **Listing label** — optional catalogue number such as `12A`, trimmed, 1 to
  32 characters when set. Unique within the listing's sale. Two listings
  with no sale SHALL be allowed to share a label. Clearing the label SHALL
  store no label.
- **Sort index** — optional whole number ≥ 0. Omitted on create SHALL store 0.
- **Sale** — optional. Omit or clear for a listing sold on its own. A listing
  SHALL join only a sale that is `draft` or `published`. A canceled sale
  SHALL be refused.
- **Categories** — optional set of existing categories. At most one category
  per taxonomy. An update that names categories SHALL replace the listing's
  whole set, including to empty.

An operator who may catalogue a listing and not operate its window SHALL
still be able to write these fields on an existing editable listing.

#### Scenario: Operator updates copy on a published listing

- **GIVEN** a published listing titled "Charizard 1st Edition"
- **WHEN** an authorized operator changes its copy to a new description
- **THEN** Grade10 stores the new copy
- **AND** a collector reading the listing sees the new copy
- **AND** the title, prices, and window are unchanged

#### Scenario: Listing label collides inside a sale

- **GIVEN** a sale that already has a listing labelled `12A`
- **WHEN** an operator sets another listing in that sale to `12A`
- **THEN** Grade10 refuses the write
- **AND** the second listing's label is unchanged

#### Scenario: Two categories from one taxonomy are refused

- **GIVEN** a taxonomy with categories Pokémon and Sport
- **WHEN** an operator assigns both to the same listing
- **THEN** Grade10 refuses the write
- **AND** the listing's categories are unchanged

#### Scenario: Canceled sale cannot receive a listing

- **GIVEN** a canceled sale
- **WHEN** an operator attaches a draft listing to it
- **THEN** Grade10 refuses the write
- **AND** the listing's sale is unchanged

### Requirement: Prices and window are writable only on a draft

While a listing is `draft`, an authorized operator SHALL be able to set:

- **Currency** — an ISO 4217 three-letter code. Omitted on create SHALL store
  Grade10's store currency (`HKD`).
- **Starting price** — integer minor units greater than zero.
- **Minimum increment** — integer minor units greater than zero.
- **Starts at** — the scheduled bidding open.
- **Scheduled close** — the published close. It MUST be after starts-at and
  after the moment of the write.
- **Snipe window (seconds)** and **extension reach (seconds)** — whole
  numbers ≥ 0, set together or both zero (extension off). The snipe window
  MUST NOT be greater than the reach.
- **Extension cap (seconds)** — optional whole number ≥ 0, or absent for an
  uncapped listing. A cap below the reach is a hard final deadline, not an
  error.

A write of any of these fields on a `published`, `closed`, `settled`, or
`canceled` listing SHALL be refused. The effective close is not an operator
field: extension writes it, and this form SHALL NOT accept it.

**Sandbox** SHALL be set only at create (whether the listing runs on
test-mode money). A later write of sandbox SHALL be refused.

#### Scenario: Operator corrects a draft's starting price

- **GIVEN** a draft listing with starting price 100000 minor units `HKD`
- **WHEN** an authorized operator sets starting price to 150000 minor units
- **THEN** Grade10 stores 150000 minor units `HKD`
- **AND** the listing remains a draft

#### Scenario: Published listing refuses a price change

- **GIVEN** a published listing with starting price 100000 minor units
- **WHEN** an operator sets starting price to 150000 minor units
- **THEN** Grade10 refuses the write
- **AND** the starting price remains 100000 minor units

#### Scenario: Scheduled close in the past is refused

- **GIVEN** an authorized operator creating or editing a draft
- **WHEN** they set a scheduled close that is not after both starts-at and now
- **THEN** Grade10 refuses the write

#### Scenario: Snipe window without a reach is refused

- **GIVEN** a draft listing
- **WHEN** an operator sets a snipe window of 1800 seconds and an extension
  reach of 0
- **THEN** Grade10 refuses the write
- **AND** the listing's extension knobs are unchanged

#### Scenario: Sandbox cannot change after create

- **GIVEN** a draft listing created as sandbox
- **WHEN** an operator clears sandbox
- **THEN** Grade10 refuses the write
- **AND** the listing remains sandbox

### Requirement: A closed listing cannot be rewritten here

A listing in `closed`, `settled`, or `canceled` SHALL reject every catalogue,
price, window, sandbox, and media write from this form. Its facts are the
record of what was offered and sold.

#### Scenario: Closed listing rejects a title edit

- **GIVEN** a closed listing
- **WHEN** an operator changes its title
- **THEN** Grade10 refuses the write
- **AND** the title is unchanged

### Requirement: Listing media is an ordered gallery of up to eight uploads

While a listing is `draft` or `published`, an authorized operator SHALL be
able to attach, replace, remove, and reorder media on that listing.

A listing SHALL hold at most **eight** media items. Each item is one uploaded
file, either an image or a video. A ninth attach SHALL be refused and SHALL
leave the gallery unchanged.

Accepted image types: JPEG, PNG, WebP, AVIF. Accepted video types: MP4, WebM,
QuickTime. Any other type SHALL be refused. An empty file SHALL be refused.
Each file SHALL be at most 100 mebibytes (104857600 bytes); a larger file
SHALL be refused.

Media SHALL be stored and served as uploaded. Grade10 SHALL NOT resize,
transcode, generate a thumbnail, or otherwise derive a second object from the
upload in this capability. Optional width and height, when supplied by the
operator's client, are untrusted layout hints and MUST NOT be treated as
measurements.

The gallery has a display order the operator controls. The first item SHALL
be the catalogue card a browse list shows. A listing with no media SHALL
publish no catalogue card.

A collector reading a published listing SHALL receive the gallery in that
order. An image item SHALL display as an image. A video item SHALL play as a
video from the uploaded bytes.

#### Scenario: Operator uploads an eighth file

- **GIVEN** a draft listing with seven media items
- **WHEN** the operator uploads an eighth JPEG
- **THEN** Grade10 stores eight media items in the operator's order

#### Scenario: A ninth file is refused

- **GIVEN** a draft listing with eight media items
- **WHEN** the operator uploads a ninth file
- **THEN** Grade10 refuses the upload
- **AND** the gallery still has eight items

#### Scenario: Mixed images and videos are accepted

- **GIVEN** a draft listing with no media
- **WHEN** an operator uploads a JPEG, then an MP4, then a WebP
- **THEN** Grade10 stores three media items in that order
- **AND** a collector reading the published listing receives the JPEG, the
  MP4, and the WebP in that order
- **AND** the MP4 plays as video from the uploaded bytes

#### Scenario: Upload is stored without processing

- **GIVEN** a draft listing
- **WHEN** an operator uploads a JPEG whose body is 2 mebibytes
- **THEN** Grade10 serves that same body and type for the item
- **AND** it serves no derived smaller or differently typed object for it

#### Scenario: Unsupported type is refused

- **GIVEN** a draft listing
- **WHEN** an operator uploads a file that is not JPEG, PNG, WebP, AVIF, MP4,
  WebM, or QuickTime
- **THEN** Grade10 refuses the upload
- **AND** the gallery is unchanged

#### Scenario: File over 100 mebibytes is refused

- **GIVEN** a draft listing
- **WHEN** an operator uploads a file larger than 104857600 bytes
- **THEN** Grade10 refuses the upload
- **AND** the gallery is unchanged

#### Scenario: First item is the catalogue card

- **GIVEN** a published listing whose gallery is a video then a JPEG
- **WHEN** a collector opens the Auction catalogue
- **THEN** that listing's card uses the video as its media
- **AND** it does not require a named physical side such as `front`

#### Scenario: Operator reorders and removes media

- **GIVEN** a published listing with three images in order A, B, C
- **WHEN** an operator moves C first and removes B
- **THEN** the gallery is C, A
- **AND** a collector's catalogue card is C

#### Scenario: Closed listing rejects a media upload

- **GIVEN** a closed listing
- **WHEN** an operator uploads an image
- **THEN** Grade10 refuses the upload
- **AND** the gallery is unchanged
