## Purpose

Lets an authorized Grade10 operator draft, create, and publish an Auction
listing — incomplete saves first, required fields enforced at create, publish
now or at a future scheduled time — with an unprocessed gallery of one to
eight images or videos.

## ADDED Requirements

### Requirement: Operator saves a listing as a draft

An authorized operator SHALL save an Auction listing as a draft from the
Grade10 auction admin section without filling every field. A successful draft
save SHALL persist the listing in `draft` and, on the first save, SHALL mint
a new auctionable unit that has no other live listing.

A draft SHALL allow every required field to be empty. Saving a draft SHALL
NOT refuse a missing title, starting price, minimum increment, starts at,
scheduled close at, or media. A field the operator does send SHALL still
match that field's shape (a starting price that is present MUST be integer
minor units greater than zero).

A draft listing SHALL NOT be visible on the public catalogue.

A draft save from an operator who is not authorized to set an auction's
prices and window SHALL be refused.

#### Scenario: Operator saves an empty draft

- **GIVEN** an authorized operator on the Grade10 auction listings section
- **WHEN** they save a new listing with no title, no prices, and no window
- **THEN** Grade10 persists a draft listing with those fields empty
- **AND** the listing is absent from the public catalogue

#### Scenario: Operator saves a partial draft

- **GIVEN** an authorized operator
- **WHEN** they save a draft with a title and no starting price
- **THEN** Grade10 persists the title
- **AND** the listing remains a draft
- **AND** starting price stays empty

#### Scenario: Draft rejects a malformed price

- **GIVEN** a draft listing
- **WHEN** an operator sets starting price to a non-positive or non-integer
  amount
- **THEN** Grade10 refuses the write
- **AND** starting price is unchanged

#### Scenario: Unauthorized draft save is refused

- **GIVEN** a signed-in operator who may not set an auction's prices and window
- **WHEN** they save a new draft
- **THEN** Grade10 refuses the save
- **AND** it persists no listing

### Requirement: Create validates required fields on the form and the API

An authorized operator SHALL create a `draft` listing. Create is the
validation gate: it SHALL succeed only when every required field is present
and valid. A successful create SHALL move the listing to `created`. The
listing SHALL still be absent from the public catalogue.

Required at create:

- **Title** — trimmed, 1 to 200 characters
- **Starting price** — integer minor units greater than zero
- **Minimum increment** — integer minor units greater than zero
- **Starts at** — the scheduled bidding open
- **Scheduled close at** — after starts at, and after the moment of create
- **Media** — at least one and at most eight images or videos

Optional fields, when omitted at create, take these defaults: currency
`HKD`; sort index `0`; copy empty; no sale; no categories; extension window
and extension duration both `0` (extension off); no extension cap; no
publish at; sandbox `false`.

The admin form SHALL prevent submitting create while a required field is
empty or invalid, and SHALL name the fields that fail. The API SHALL refuse
the same create independently of the form. A created listing SHALL reject a
later write that leaves a required field empty or invalid.

Create of a listing that is not `draft` SHALL be refused. Create from an
operator who is not authorized to set an auction's prices and window SHALL
be refused.

#### Scenario: Operator creates a filled draft

- **GIVEN** a draft listing with a title, a starting price of 100000 minor
  units, a minimum increment of 5000 minor units, currency `HKD`, a start in
  the future, a scheduled close at after that start, and one JPEG
- **WHEN** an authorized operator creates the listing
- **THEN** Grade10 moves it to `created`
- **AND** the listing is still absent from the public catalogue

#### Scenario: Create without a title is refused on the form and the API

- **GIVEN** a draft listing with no title and every other required field set
- **WHEN** the operator submits create
- **THEN** the admin form does not send create and names title as missing
- **AND** a create sent to the API without a title is refused
- **AND** the listing remains a draft

#### Scenario: Create without a starting price is refused

- **GIVEN** a draft listing with a title, a window, and no starting price
- **WHEN** the operator creates the listing
- **THEN** Grade10 refuses the create
- **AND** the listing remains a draft

#### Scenario: Create without media is refused

- **GIVEN** a draft listing with every required field set except media
- **WHEN** the operator creates the listing
- **THEN** Grade10 refuses the create
- **AND** the listing remains a draft

#### Scenario: Created listing cannot clear a required field

- **GIVEN** a created listing with a title
- **WHEN** an operator clears the title
- **THEN** Grade10 refuses the write
- **AND** the title is unchanged

#### Scenario: Create of a published listing is refused

- **GIVEN** a published listing
- **WHEN** an operator creates it
- **THEN** Grade10 refuses the create
- **AND** the listing remains published

### Requirement: Catalogue fields an operator may write

While a listing is `draft`, `created`, or `published`, an authorized operator
SHALL be able to set these catalogue fields. Each write SHALL replace the
stored value; an omitted field on an update SHALL leave the stored value
unchanged.

- **Title** — required at create; trimmed, 1 to 200 characters when set. Empty
  is allowed only while `draft`.
- **Copy** — optional, at most 4000 characters, empty allowed.
- **Sort index** — optional whole number ≥ 0. Empty on draft SHALL store
  nothing until create, which stores `0` when omitted.
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

### Requirement: Prices and window are writable before publish

While a listing is `draft` or `created`, an authorized operator SHALL be able
to set:

- **Currency** — an ISO 4217 three-letter code. Empty on draft is allowed.
  Omitted at create SHALL store Grade10's store currency (`HKD`).
- **Starting price** — integer minor units greater than zero when set. Empty
  is allowed only while `draft`.
- **Minimum increment** — integer minor units greater than zero when set.
  Empty is allowed only while `draft`.
- **Starts at** — the scheduled bidding open. Empty is allowed only while
  `draft`.
- **Scheduled close at** — the published close. Empty is allowed only while
  `draft`. When both starts at and scheduled close at are set, scheduled
  close at MUST be after starts at. At create, scheduled close at MUST also
  be after now.
- **Extension window (seconds)** and **Extension duration (seconds)** —
  whole numbers ≥ 0, set together or both zero (extension off). A bid
  inside the extension window of the close moves the close to now plus the
  extension duration. The extension window MUST NOT be greater than the
  extension duration. Empty on draft is allowed. Omitted at create SHALL
  store both as `0`.
- **Extension cap (seconds)** — optional whole number ≥ 0, or absent for an
  uncapped listing. The close MUST NOT move past scheduled close at plus
  this cap. A cap below the extension duration is a hard final deadline,
  not an error.

A write of any of these fields on a `published`, `closed`, `settled`, or
`canceled` listing SHALL be refused. The effective close is not an operator
field: extension writes it, and this form SHALL NOT accept it.

**Sandbox** SHALL be writable only while `draft`. A sandbox listing runs on
test-mode payment credentials instead of live money, so the house can
rehearse a sale. A write of sandbox on a `created` or later listing SHALL
be refused.

#### Scenario: Operator corrects a created listing's starting price

- **GIVEN** a created listing with starting price 100000 minor units `HKD`
- **WHEN** an authorized operator sets starting price to 150000 minor units
- **THEN** Grade10 stores 150000 minor units `HKD`
- **AND** the listing remains created

#### Scenario: Published listing refuses a price change

- **GIVEN** a published listing with starting price 100000 minor units
- **WHEN** an operator sets starting price to 150000 minor units
- **THEN** Grade10 refuses the write
- **AND** the starting price remains 100000 minor units

#### Scenario: Scheduled close at in the past is refused at create

- **GIVEN** a draft listing whose scheduled close at is not after now
- **WHEN** the operator creates the listing
- **THEN** Grade10 refuses the create
- **AND** the listing remains a draft

#### Scenario: Extension window without a duration is refused

- **GIVEN** a created listing
- **WHEN** an operator sets an extension window of 1800 seconds and an
  extension duration of 0
- **THEN** Grade10 refuses the write
- **AND** the listing's extension settings are unchanged

#### Scenario: Sandbox cannot change after create

- **GIVEN** a created listing that was drafted as sandbox
- **WHEN** an operator clears sandbox
- **THEN** Grade10 refuses the write
- **AND** the listing remains sandbox

### Requirement: Publish happens now or at a scheduled time

An authorized operator SHALL publish a `created` listing. Publish SHALL move
it to `published` and SHALL make it visible on the public catalogue.

An authorized operator SHALL be able to set **Publish at**, an optional
timestamp that MUST be after now.

- While `draft` or `created`, publish at SHALL be writable when the value is
  after now, and SHALL be clearable. A write of publish at on a `published`
  or later listing SHALL be refused.
- A publish at that is not after now SHALL be refused on the admin form and
  on the API. Create SHALL refuse if publish at is set and not after now.
- When publish at is unset, the listing SHALL stay `created` until an
  operator publishes it.
- When publish at arrives and the listing is `created`, Grade10 SHALL
  publish it without a further operator action.
- A `draft` listing SHALL NOT be published, by hand or when publish at
  arrives. Publish of a listing that is not `created` SHALL be refused.

#### Scenario: Operator publishes a created listing immediately

- **GIVEN** a created listing with no publish at
- **WHEN** an authorized operator publishes it
- **THEN** Grade10 moves it to `published`
- **AND** a collector can read it on the public catalogue

#### Scenario: Created listing publishes at the scheduled time

- **GIVEN** a created listing whose publish at is in the future
- **WHEN** that time arrives
- **THEN** Grade10 moves it to `published`
- **AND** a collector can read it on the public catalogue
- **AND** no further operator action was required

#### Scenario: A publish at in the past is refused

- **GIVEN** a created listing
- **WHEN** an operator sets publish at to a time that is not after now
- **THEN** Grade10 refuses the write
- **AND** the listing remains created and unpublished

#### Scenario: Create with a past publish at is refused

- **GIVEN** a draft listing with every required field set and publish at in
  the past
- **WHEN** the operator creates the listing
- **THEN** Grade10 refuses the create
- **AND** the listing remains a draft
- **AND** it stays absent from the public catalogue

#### Scenario: Draft is not published when publish at arrives

- **GIVEN** a draft listing with a publish at that has arrived and a missing
  title
- **WHEN** that time is reached
- **THEN** Grade10 does not publish the listing
- **AND** it remains a draft
- **AND** it stays absent from the public catalogue

#### Scenario: Manual publish of a draft is refused

- **GIVEN** a draft listing
- **WHEN** an operator publishes it
- **THEN** Grade10 refuses the publish
- **AND** the listing remains a draft

#### Scenario: Publish at cannot change after publish

- **GIVEN** a published listing
- **WHEN** an operator sets a new publish at
- **THEN** Grade10 refuses the write
- **AND** the listing remains published

### Requirement: A closed listing cannot be rewritten here

A listing in `closed`, `settled`, or `canceled` SHALL reject every catalogue,
price, window, sandbox, publish at, and media write from this form. Its facts
are the record of what was offered and sold.

#### Scenario: Closed listing rejects a title edit

- **GIVEN** a closed listing
- **WHEN** an operator changes its title
- **THEN** Grade10 refuses the write
- **AND** the title is unchanged

### Requirement: Listing media is an ordered gallery of one to eight uploads

While a listing is `draft`, `created`, or `published`, an authorized operator
SHALL be able to attach, replace, remove, and reorder media on that listing.

A listing SHALL hold at most **eight** media items. Each item is one uploaded
file, either an image or a video. A ninth attach SHALL be refused and SHALL
leave the gallery unchanged.

A draft SHALL be allowed to have zero media. Create SHALL require at least
one media item. A `created` or `published` listing SHALL reject a remove that
would leave zero items.

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
be the catalogue card a browse list shows.

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

#### Scenario: Last media item cannot be removed after create

- **GIVEN** a published listing with one JPEG
- **WHEN** an operator removes that JPEG
- **THEN** Grade10 refuses the remove
- **AND** the gallery still has that JPEG

#### Scenario: Closed listing rejects a media upload

- **GIVEN** a closed listing
- **WHEN** an operator uploads an image
- **THEN** Grade10 refuses the upload
- **AND** the gallery is unchanged
