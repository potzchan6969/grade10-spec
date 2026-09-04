# grade10-admin/auction/listing Specification

## Purpose
Lets an authorized Grade10 operator draft, create, and publish an Auction
listing — incomplete saves first, required fields enforced at create, publish
now or at a future scheduled time — with an ordered gallery of one to eight
images or videos (originals stored and served as uploaded), and call one off
while it has not closed. Named image sizes and optional alt live in
`grade10-site/auction/listing-media`.

## Feature set

- Draft save
  - Incomplete listing: an authorized operator saves without filling every field
  - First save mints a unit: the first draft creates an auctionable unit with no other live listing
- Create and catalogue
  - Required fields at create: title, slug, starting price, window, and media are checked on the form and the API
  - Slug as public key: collectors open a listing by slug; collisions and reuse follow the listing's state
  - Catalogue fields: an operator may write copy and taxonomy before publish
- Prices and window
  - Writable before publish: starting price and close can change until the listing is live
- Publish
  - Now or scheduled: a created listing publishes immediately or at a set time
- Call off
  - Before close: an operator withdraws a listing that has not closed
  - Closed is frozen: a closed listing cannot be rewritten here
- Gallery
  - One to eight uploads: images or videos, stored as uploaded, ordered, first item as the catalogue card
- Independent create
  - Listings create: an authorized operator starts a listing from the
    Listings section with no campaign selected
  - Empty campaign through lifecycle: draft, create, and publish all succeed
    with no campaign; public slug lookup returns the listing
  - Listings table unattached label: a row with no campaign shows "-"
- Test fixture standalone seed
  - Listings tab: a developer selects fixture ids and seeds them with no
    campaign, product reserved, media attached
  - Drop standalone fixtures: a developer removes standalone fixture listings
    and releases their inventory holds from the same tab

## Requirements

### Requirement: Operator saves a listing as a draft

An authorized operator SHALL save an Auction listing as a draft without every
required field. A draft save SHALL NOT require title, slug, starting price,
currency, starts at, scheduled close at, or media. A supplied currency SHALL
be USD, HKD, or JPY; Grade10 SHALL refuse another currency and leave the draft
unchanged.

The draft form and write contract SHALL NOT offer or accept a listing-level
minimum increment.

#### Scenario: grade10-admin-auction-listing-SC-01 - Operator saves an empty draft

- **GIVEN** an authorized operator on the auction listings section
- **WHEN** they save a listing with no title, prices, or window
- **THEN** Grade10 persists a draft that is absent from the public catalogue

#### Scenario: grade10-admin-auction-listing-SC-02 - Operator saves a partial draft

- **GIVEN** an authorized operator
- **WHEN** they save a draft with a title and no starting price
- **THEN** Grade10 persists the title and leaves the listing a draft

#### Scenario: grade10-admin-auction-listing-SC-03 - Draft rejects a malformed price

- **GIVEN** a draft listing
- **WHEN** an operator sets its starting price to a non-positive or non-integer amount
- **THEN** Grade10 refuses the write and leaves the starting price unchanged

#### Scenario: grade10-admin-auction-listing-SC-04 - Draft rejects a malformed slug

- **GIVEN** a draft listing
- **WHEN** an operator sets its slug to `Charizard PSA 9`
- **THEN** Grade10 refuses the write and leaves the slug unchanged

#### Scenario: grade10-admin-auction-listing-SC-05 - Unauthorized draft save is refused

- **GIVEN** a signed-in operator without auction price-and-window permission
- **WHEN** they save a draft
- **THEN** Grade10 refuses and persists no listing

#### Scenario: grade10-admin-auction-listing-SC-56 - Draft rejects an unsupported currency

- **GIVEN** a draft listing
- **WHEN** an operator sets its currency to EUR
- **THEN** Grade10 refuses the write
- **AND** the currency is unchanged

### Requirement: Create validates required fields on the form and the API

Create SHALL require a title, slug, starting price, starts at, scheduled close
at, media, and one supported currency. When omitted, currency SHALL default to
HKD. The form and API SHALL reject an unsupported currency independently.

The form SHALL present USD, HKD, and JPY as its only currency choices and
SHALL NOT display a minimum-increment field. The selected currency's Grade10
schedule governs the listing's bid floor.

#### Scenario: grade10-admin-auction-listing-SC-06 - Operator creates a filled draft

- **GIVEN** a complete draft with currency JPY and no minimum-increment value
- **WHEN** an authorized operator creates the listing
- **THEN** Grade10 creates it
- **AND** its bid floor uses the JPY schedule

#### Scenario: grade10-admin-auction-listing-SC-07 - Create without a title is refused on the form and the API

- **GIVEN** a draft with every required field except title
- **WHEN** the operator creates it
- **THEN** the form and API refuse it and the listing remains a draft

#### Scenario: grade10-admin-auction-listing-SC-08 - Create without a slug is refused

- **GIVEN** a draft with every required field except slug
- **WHEN** the operator creates it
- **THEN** Grade10 refuses and the listing remains a draft

#### Scenario: grade10-admin-auction-listing-SC-09 - Create without a starting price is refused

- **GIVEN** a draft with every required field except starting price
- **WHEN** the operator creates it
- **THEN** Grade10 refuses and the listing remains a draft

#### Scenario: grade10-admin-auction-listing-SC-10 - Create without media is refused

- **GIVEN** a draft with every required field except media
- **WHEN** the operator creates it
- **THEN** Grade10 refuses and the listing remains a draft

#### Scenario: grade10-admin-auction-listing-SC-11 - Created listing cannot clear a required field

- **GIVEN** a created listing with a title
- **WHEN** an operator clears the title
- **THEN** Grade10 refuses and leaves the title unchanged

#### Scenario: grade10-admin-auction-listing-SC-12 - Create of a published listing is refused

- **GIVEN** a published listing
- **WHEN** an operator creates it
- **THEN** Grade10 refuses and leaves it published

#### Scenario: grade10-admin-auction-listing-SC-57 - Create refuses an unsupported currency on the form and API

- **GIVEN** a complete draft with currency EUR
- **WHEN** an operator creates the listing
- **THEN** the form prevents the request and names currency
- **AND** an API create with EUR is refused
- **AND** the listing remains a draft

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

#### Scenario: grade10-admin-auction-listing-SC-13 - Operator updates copy on a published listing

- **GIVEN** a published listing titled "Charizard 1st Edition"
- **WHEN** an authorized operator changes its copy to a new description
- **THEN** Grade10 stores the new copy
- **AND** a collector reading the listing sees the new copy
- **AND** the title, prices, and window are unchanged

#### Scenario: grade10-admin-auction-listing-SC-14 - Two categories from one taxonomy are refused

- **GIVEN** a taxonomy with categories Pokémon and Sport
- **WHEN** an operator assigns both to the same listing
- **THEN** Grade10 refuses the write
- **AND** the listing's categories are unchanged

#### Scenario: grade10-admin-auction-listing-SC-15 - Canceled sale cannot receive a listing

- **GIVEN** a canceled sale
- **WHEN** an operator attaches a draft listing to it
- **THEN** Grade10 refuses the write
- **AND** the listing's sale is unchanged

### Requirement: Slug is the listing's public lookup key

An authorized operator SHALL set a **Slug** that is the lookup key of the
listing's public address `/auction/listings/<slug>`.

- Trimmed, 1 to 64 characters, lower-case words joined by hyphens
  (`charizard-psa-9`). Empty is allowed only while `draft`. A slug that is
  present and does not match that shape SHALL be refused. The 1-to-64 length
  bound applies to a slug an operator writes.
- A slug SHALL be unique among listings that currently hold that value. No
  two listings SHALL share a slug. A draft with no slug does not occupy one.
  Setting or creating a slug that another listing already holds SHALL be
  refused, including when the other listing is `closed` or `settled`. A
  listing rewriting its own slug to the same value is not a collision. A
  `canceled` listing SHALL NOT keep the slug it held before cancel: that
  original value is free for another listing.
- Slug SHALL be writable while `draft` or `created`. A write of slug on a
  `published`, `closed`, `settled`, or `canceled` listing SHALL be refused,
  except the rewrite Grade10 applies when the listing is canceled.
- A collector SHALL receive a `published`, `closed`, or `settled` listing by
  opening `/auction/listings/<slug>`. A slug that names no such listing
  SHALL be not found. A `draft`, `created`, or `canceled` listing SHALL NOT
  answer at that address.

#### Scenario: grade10-admin-auction-listing-SC-16 - Collector opens a listing by slug

- **GIVEN** a published listing whose slug is `charizard-psa-9`
- **WHEN** a collector opens `/auction/listings/charizard-psa-9`
- **THEN** Grade10 returns that listing

#### Scenario: grade10-admin-auction-listing-SC-17 - Unknown slug is not found

- **GIVEN** no published, closed, or settled listing with slug `no-such-lot`
- **WHEN** a collector opens `/auction/listings/no-such-lot`
- **THEN** Grade10 answers as not found

#### Scenario: grade10-admin-auction-listing-SC-18 - Duplicate slug is refused

- **GIVEN** a listing that is not canceled whose slug is `charizard-psa-9`
- **WHEN** an operator sets another listing's slug to `charizard-psa-9`
- **THEN** Grade10 refuses the write
- **AND** the second listing's slug is unchanged

#### Scenario: grade10-admin-auction-listing-SC-19 - Two drafts cannot share a slug

- **GIVEN** a draft whose slug is `charizard-psa-9`
- **WHEN** an operator sets another draft's slug to `charizard-psa-9`
- **THEN** Grade10 refuses the write
- **AND** the second draft's slug is unchanged

#### Scenario: grade10-admin-auction-listing-SC-20 - Empty slugs on drafts are not a collision

- **GIVEN** a draft with no slug
- **WHEN** an operator saves another draft with no slug
- **THEN** Grade10 accepts the save
- **AND** neither draft occupies a slug

#### Scenario: grade10-admin-auction-listing-SC-21 - Create can reuse a canceled listing's original slug

- **GIVEN** a canceled listing that previously used slug `charizard-psa-9`
- **AND** a draft with every required field set, including slug
  `charizard-psa-9`
- **WHEN** the operator creates the draft
- **THEN** Grade10 moves the draft to `created`
- **AND** the canceled listing still does not hold `charizard-psa-9`

#### Scenario: grade10-admin-auction-listing-SC-22 - Create cannot reuse a closed listing's slug

- **GIVEN** a closed listing whose slug is `charizard-psa-9`
- **AND** a draft with every required field set, including slug
  `charizard-psa-9`
- **WHEN** the operator creates the draft
- **THEN** Grade10 refuses the create
- **AND** the draft remains a draft
- **AND** `/auction/listings/charizard-psa-9` still returns the closed listing

#### Scenario: grade10-admin-auction-listing-SC-23 - Published slug cannot change

- **GIVEN** a published listing whose slug is `charizard-psa-9`
- **WHEN** an operator sets slug to `charizard-psa-9-copy`
- **THEN** Grade10 refuses the write
- **AND** `/auction/listings/charizard-psa-9` still returns that listing

### Requirement: Prices and window are writable before publish

While a listing is `draft` or `created`, an authorized operator SHALL be able
to set:

- **Currency** — an operator chooses an ISO 4217 three-letter code from the
  platform's supported currency list. Omitted at create SHALL store Grade10's
  store currency (`HKD`).
- **Starting price** — integer minor units greater than zero when set. Empty
  is allowed only while `draft`.
- **Minimum increment** — integer minor units greater than zero when set.
  Empty is allowed only while `draft`.
- The form SHALL show each entered minor-unit price as a separately formatted
  decimal amount in the selected currency, so an operator can verify its
  decimal placement before saving.
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
  store both as `1800`. Both zero together means extension off.
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

#### Scenario: grade10-admin-auction-listing-SC-24 - Operator corrects a created listing's starting price

- **GIVEN** a created listing with starting price 100000 minor units `HKD`
- **WHEN** an authorized operator sets starting price to 150000 minor units
- **THEN** Grade10 stores 150000 minor units `HKD`
- **AND** the listing remains created

#### Scenario: grade10-admin-auction-listing-SC-25 - Published listing refuses a price change

- **GIVEN** a published listing with starting price 100000 minor units
- **WHEN** an operator sets starting price to 150000 minor units
- **THEN** Grade10 refuses the write
- **AND** the starting price remains 100000 minor units

#### Scenario: grade10-admin-auction-listing-SC-26 - Scheduled close at in the past is refused at create

- **GIVEN** a draft listing whose scheduled close at is not after now
- **WHEN** the operator creates the listing
- **THEN** Grade10 refuses the create
- **AND** the listing remains a draft

#### Scenario: grade10-admin-auction-listing-SC-27 - Extension window without a duration is refused

- **GIVEN** a created listing
- **WHEN** an operator sets an extension window of 1800 seconds and an
  extension duration of 0
- **THEN** Grade10 refuses the write
- **AND** the listing's extension settings are unchanged

#### Scenario: grade10-admin-auction-listing-SC-27a - Omitted extension fields default to 30 minutes

- **GIVEN** a draft listing with every required field set and no extension
  window or duration supplied
- **WHEN** an authorized operator creates the listing
- **THEN** Grade10 stores extension window 1800 seconds and extension duration
  1800 seconds

#### Scenario: grade10-admin-auction-listing-SC-28 - Sandbox cannot change after create

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

#### Scenario: grade10-admin-auction-listing-SC-29 - Operator publishes a created listing immediately

- **GIVEN** a created listing with no publish at
- **WHEN** an authorized operator publishes it
- **THEN** Grade10 moves it to `published`
- **AND** a collector can read it on the public catalogue

#### Scenario: grade10-admin-auction-listing-SC-30 - Created listing publishes at the scheduled time

- **GIVEN** a created listing whose publish at is in the future
- **WHEN** that time arrives
- **THEN** Grade10 moves it to `published`
- **AND** a collector can read it on the public catalogue
- **AND** no further operator action was required

#### Scenario: grade10-admin-auction-listing-SC-31 - A publish at in the past is refused

- **GIVEN** a created listing
- **WHEN** an operator sets publish at to a time that is not after now
- **THEN** Grade10 refuses the write
- **AND** the listing remains created and unpublished

#### Scenario: grade10-admin-auction-listing-SC-32 - Create with a past publish at is refused

- **GIVEN** a draft listing with every required field set and publish at in
  the past
- **WHEN** the operator creates the listing
- **THEN** Grade10 refuses the create
- **AND** the listing remains a draft
- **AND** it stays absent from the public catalogue

#### Scenario: grade10-admin-auction-listing-SC-33 - Draft is not published when publish at arrives

- **GIVEN** a draft listing with a publish at that has arrived and a missing
  title
- **WHEN** that time is reached
- **THEN** Grade10 does not publish the listing
- **AND** it remains a draft
- **AND** it stays absent from the public catalogue

#### Scenario: grade10-admin-auction-listing-SC-34 - Manual publish of a draft is refused

- **GIVEN** a draft listing
- **WHEN** an operator publishes it
- **THEN** Grade10 refuses the publish
- **AND** the listing remains a draft

#### Scenario: grade10-admin-auction-listing-SC-35 - Publish at cannot change after publish

- **GIVEN** a published listing
- **WHEN** an operator sets a new publish at
- **THEN** Grade10 refuses the write
- **AND** the listing remains published

### Requirement: Operator may call off a listing that has not closed

An operator authorized to call a listing off SHALL cancel a listing that is
`draft`, `created`, or `published`. Cancel SHALL move the listing to
`canceled` and SHALL release every live authorization standing against it.

Cancel SHALL be refused when the listing is `closed`, `settled`, or already
`canceled`. A closed or settled listing's outcome is absolute and SHALL NOT
be reopened by cancel. Cancel of a listing that does not exist SHALL be
refused.

Cancel of a `published` listing SHALL be allowed whether or not bidding has
opened and whether or not it has accepted bids. Cancel of a `created`
listing SHALL be allowed even when a publish at is still in the future;
Grade10 SHALL NOT later publish a listing that was canceled.

When the listing has a slug, cancel SHALL rewrite that slug in the same
step: the stored slug becomes the previous slug, then `-cancelled-`, then
the listing's id from the seventh character onward (after the first six
characters). That rewrite SHALL be stored even when the result is longer
than 64 characters. A listing with no slug SHALL stay without one. After
the rewrite, the previous slug SHALL be free for another listing, and the
canceled listing SHALL NOT answer at `/auction/listings/<previous slug>`.

The same rewrite SHALL apply when Grade10 cancels the listing because its
sale was canceled.

Cancel from an operator who is not authorized to call a listing off SHALL
be refused, and the listing and slug SHALL be unchanged.

#### Scenario: grade10-admin-auction-listing-SC-36 - Operator calls off a draft

- **GIVEN** a draft listing
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 moves it to `canceled`
- **AND** it stays absent from the public catalogue

#### Scenario: grade10-admin-auction-listing-SC-37 - Operator calls off a created listing before publish at

- **GIVEN** a created listing with a publish at still in the future
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 moves it to `canceled`
- **AND** when that publish at arrives, Grade10 does not publish it
- **AND** it stays absent from the public catalogue

#### Scenario: grade10-admin-auction-listing-SC-38 - Operator calls off a published listing that has bids

- **GIVEN** a published listing with accepted bids and live authorizations
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 moves it to `canceled`
- **AND** it releases every live authorization standing against it
- **AND** it is absent from the public catalogue

#### Scenario: grade10-admin-auction-listing-SC-39 - Closed listing cannot be called off

- **GIVEN** a closed listing
- **WHEN** an operator calls it off
- **THEN** Grade10 refuses the cancel
- **AND** the listing remains closed

#### Scenario: grade10-admin-auction-listing-SC-40 - Settled listing cannot be called off

- **GIVEN** a settled listing
- **WHEN** an operator calls it off
- **THEN** Grade10 refuses the cancel
- **AND** the listing remains settled

#### Scenario: grade10-admin-auction-listing-SC-41 - Already canceled listing cannot be called off again

- **GIVEN** a canceled listing
- **WHEN** an operator calls it off
- **THEN** Grade10 refuses the cancel
- **AND** the listing remains canceled

#### Scenario: grade10-admin-auction-listing-SC-42 - Cancel rewrites the slug and frees the original

- **GIVEN** a published listing whose id is
  `auc_550e8400-e29b-41d4-a716-446655440000` and whose slug is
  `charizard-psa-9`
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 stores slug
  `charizard-psa-9-cancelled-0e8400-e29b-41d4-a716-446655440000`
- **AND** `/auction/listings/charizard-psa-9` does not return that listing
- **AND** a later listing may be created with slug `charizard-psa-9`

#### Scenario: grade10-admin-auction-listing-SC-43 - Cancel of a draft with no slug does not invent one

- **GIVEN** a draft listing with no slug
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 moves it to `canceled`
- **AND** the listing still has no slug

#### Scenario: grade10-admin-auction-listing-SC-44 - Unauthorized cancel is refused

- **GIVEN** a published listing
- **AND** a signed-in operator who may not call a listing off
- **WHEN** they call it off
- **THEN** Grade10 refuses the cancel
- **AND** the listing remains published
- **AND** its slug is unchanged

### Requirement: A closed listing cannot be rewritten here

A listing in `closed`, `settled`, or `canceled` SHALL reject every catalogue,
price, window, sandbox, publish at, and media write from this form. Its facts
are the record of what was offered and sold.

#### Scenario: grade10-admin-auction-listing-SC-45 - Closed listing rejects a title edit

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

Original media bytes SHALL be stored and served as uploaded. This capability
SHALL NOT resize, transcode, generate a thumbnail, or otherwise derive a
second object from the upload. Named public sizes for gallery **images** are
owned by `grade10-site/auction/listing-media` and are an additional public
contract on top of the original. Optional width and height, when supplied by
the operator's client, are untrusted layout hints and MUST NOT be treated as
measurements.

The gallery has a display order the operator controls. The first item SHALL
be the catalogue card a browse list shows.

A collector reading a published listing SHALL receive the gallery in that
order. An image item SHALL display as an image. A video item SHALL play as a
video from the uploaded bytes.

#### Scenario: grade10-admin-auction-listing-SC-46 - Operator uploads an eighth file

- **GIVEN** a draft listing with seven media items
- **WHEN** the operator uploads an eighth JPEG
- **THEN** Grade10 stores eight media items in the operator's order

#### Scenario: grade10-admin-auction-listing-SC-47 - A ninth file is refused

- **GIVEN** a draft listing with eight media items
- **WHEN** the operator uploads a ninth file
- **THEN** Grade10 refuses the upload
- **AND** the gallery still has eight items

#### Scenario: grade10-admin-auction-listing-SC-48 - Mixed images and videos are accepted

- **GIVEN** a draft listing with no media
- **WHEN** an operator uploads a JPEG, then an MP4, then a WebP
- **THEN** Grade10 stores three media items in that order
- **AND** a collector reading the published listing receives the JPEG, the
  MP4, and the WebP in that order
- **AND** the MP4 plays as video from the uploaded bytes

#### Scenario: grade10-admin-auction-listing-SC-49 - Upload is stored without processing

- **GIVEN** a draft listing
- **WHEN** an operator uploads a JPEG whose body is 2 mebibytes
- **THEN** Grade10 stores and serves that same body and type as the item's
  original
- **AND** any named-size paths for the image come from
  `grade10-site/auction/listing-media`, not from a second stored object written
  at upload

#### Scenario: grade10-admin-auction-listing-SC-50 - Unsupported type is refused

- **GIVEN** a draft listing
- **WHEN** an operator uploads a file that is not JPEG, PNG, WebP, AVIF, MP4,
  WebM, or QuickTime
- **THEN** Grade10 refuses the upload
- **AND** the gallery is unchanged

#### Scenario: grade10-admin-auction-listing-SC-51 - File over 100 mebibytes is refused

- **GIVEN** a draft listing
- **WHEN** an operator uploads a file larger than 104857600 bytes
- **THEN** Grade10 refuses the upload
- **AND** the gallery is unchanged

#### Scenario: grade10-admin-auction-listing-SC-52 - First item is the catalogue card

- **GIVEN** a published listing whose gallery is a video then a JPEG
- **WHEN** a collector opens the Auction catalogue
- **THEN** that listing's card uses the video as its media
- **AND** it does not require a named physical side such as `front`

#### Scenario: grade10-admin-auction-listing-SC-53 - Operator reorders and removes media

- **GIVEN** a published listing with three images in order A, B, C
- **WHEN** an operator moves C first and removes B
- **THEN** the gallery is C, A
- **AND** a collector's catalogue card is C

#### Scenario: grade10-admin-auction-listing-SC-54 - Last media item cannot be removed after create

- **GIVEN** a published listing with one JPEG
- **WHEN** an operator removes that JPEG
- **THEN** Grade10 refuses the remove
- **AND** the gallery still has that JPEG

#### Scenario: grade10-admin-auction-listing-SC-55 - Closed listing rejects a media upload

- **GIVEN** a closed listing
- **WHEN** an operator uploads an image
- **THEN** Grade10 refuses the upload
- **AND** the gallery is unchanged

### Requirement: Listing editor exposes optional campaign selection

The Grade10 auction listing editor SHALL let an authorized operator pick at
most one **Campaign** for the listing, or clear the campaign so the listing
stands alone. The picker SHALL list only campaigns that are `draft` or
`created`. A `published` or `canceled` campaign SHALL NOT appear as a
selectable option. Operator-visible labels for this control SHALL say
**Campaign**, not **Sale**.

Selecting a campaign SHALL persist when the operator clicks explicit **Save**
alongside other catalogue fields. **`listings.create`** does not write campaign
or inventory fields — only verifies holds when product and quantity are set.
On an editable listing, **`listings.setAuction`** MAY attach or clear the
campaign after create. Clearing the campaign SHALL store no campaign.
Attaching a `published` or `canceled` campaign through the API SHALL be refused.

An operator who may catalogue a listing SHALL be able to set or clear the
campaign. The picker SHALL NOT block create or publish when no campaign is
chosen.

#### Scenario: Operator attaches a draft listing to a draft campaign

- **GIVEN** a draft listing and a draft campaign titled "September Slabs"
- **WHEN** an authorized operator selects that campaign in the listing
  editor and clicks Save
- **THEN** Grade10 stores the listing under that campaign
- **AND** the listing remains a draft

#### Scenario: Operator attaches a listing to a created campaign

- **GIVEN** a created listing and a created campaign
- **WHEN** an authorized operator selects that campaign in the listing
  editor and clicks Save
- **THEN** Grade10 stores the listing under that campaign

#### Scenario: Operator clears the campaign on a listing

- **GIVEN** a draft listing attached to a draft campaign
- **WHEN** an authorized operator clears the campaign in the listing editor
  and clicks Save
- **THEN** Grade10 stores the listing with no campaign
- **AND** the listing remains a draft

#### Scenario: Published and canceled campaigns are not offered in the picker

- **GIVEN** a published campaign, a canceled campaign, and a draft campaign
- **WHEN** an authorized operator opens the campaign picker on the listing
  editor
- **THEN** the draft campaign is offered
- **AND** the published campaign is not offered
- **AND** the canceled campaign is not offered

#### Scenario: Published campaign cannot receive a listing

- **GIVEN** a draft listing and a published campaign
- **WHEN** an authorized operator attempts to attach that campaign
- **THEN** Grade10 refuses the attach
- **AND** the listing’s campaign is unchanged

#### Scenario: Listing without a campaign still creates

- **GIVEN** a draft listing with every required create field set and no
  campaign
- **WHEN** an authorized operator creates the listing
- **THEN** Grade10 moves it to `created`
- **AND** the listing has no campaign

#### Scenario: Listing editor campaign field is labeled Campaign

- **GIVEN** an authorized operator on the listing editor
- **WHEN** they view the optional campaign control
- **THEN** the control is labeled Campaign
- **AND** it is not labeled Sale

### Requirement: Listing editor product selection uses inventory eligibility

The Grade10 auction listing editor SHALL let an authorized operator select
the catalogue **product** the listing reserves against from Grade10
inventory ([`add-grade10-inventory`](../../../../../add-grade10-inventory/proposal.md)).
The product picker SHALL list only inventory products whose **`status` is
`created`** (not `draft`) and that have **available greater than zero**.

A `draft` inventory product SHALL NOT appear in the picker. A `created`
product with zero available SHALL NOT appear unless it is the listing's
currently stored product and this listing already holds units of that product
(see effective-available save rule). Product ids that are not eligible SHALL
be refused on explicit draft-save. Create verifies an existing hold rather
than re-validating picker eligibility.

Campaign covers do **not** select a product — only listings do.

#### Scenario: Product picker omits draft inventory products

- **GIVEN** a draft inventory product with available stock and a created
  inventory product with available stock
- **WHEN** an authorized operator opens the product picker on the listing
  editor
- **THEN** the created product is offered
- **AND** the draft product is not offered

#### Scenario: Product picker omits out-of-stock inventory products

- **GIVEN** a created inventory product with available zero and another
  created inventory product with available at least one
- **WHEN** an authorized operator opens the product picker on the listing
  editor
- **THEN** the in-stock created product is offered
- **AND** the out-of-stock product is not offered

#### Scenario: Draft product id is refused on listing save

- **GIVEN** a draft listing and a draft inventory product id
- **WHEN** an authorized operator attempts to save that product id on the
  listing
- **THEN** Grade10 refuses the write
- **AND** the listing's product id is unchanged

#### Scenario: Out-of-stock product id is refused on listing save

- **GIVEN** a draft listing with quantity one and a created inventory
  product whose available is zero and no active hold for this listing
- **WHEN** an authorized operator attempts to save that product id on the
  listing
- **THEN** Grade10 refuses the save
- **AND** the listing's product id is unchanged

#### Scenario: Current product remains selectable when this listing holds the last units

- **GIVEN** a draft listing with an active inventory hold of quantity three
  on a created product whose global available is zero
- **WHEN** an authorized operator opens the product picker on that listing
- **THEN** the current product is offered
- **AND** other out-of-stock products are not offered

### Requirement: Listing editor saves catalogue fields only on explicit Save

The Grade10 auction listing editor SHALL NOT persist catalogue fields —
including **product**, **quantity**, and **campaign** — until an authorized
operator clicks an explicit **Save** control. Changing a field in the form
SHALL update local editor state only and SHALL NOT call `listings.saveDraft`,
inventory reserve, adjust, release, or product-change mutations.

Auto-save, debounced save, or save-on-blur for catalogue fields SHALL NOT
be used on the listing editor.

#### Scenario: Picking a product does not reserve stock until Save

- **GIVEN** a draft listing with no active inventory hold
- **WHEN** an authorized operator selects a created inventory product in the
  editor but has not clicked Save
- **THEN** Grade10 has not created an inventory reservation
- **AND** the listing's stored product id is unchanged

#### Scenario: Changing quantity does not adjust the hold until Save

- **GIVEN** a draft listing with an active inventory hold of quantity two
- **WHEN** an authorized operator changes quantity to five in the editor but
  has not clicked Save
- **THEN** the hold remains quantity two
- **AND** the listing's stored quantity is unchanged

### Requirement: Listing quantity defaults when a product is chosen

The listing editor SHALL expose a **quantity** field — a whole number from
**1 to 500**, the same bounds as inventory reservations.

When an operator selects a catalogue product and quantity is empty, the
editor SHALL default quantity to **1** in local form state. Quantity MAY
remain empty only while no product is selected.

On explicit Save with both **productId** and **quantity** set, Grade10 SHALL
synchronize inventory as defined below. Save with a product and no quantity
SHALL NOT create or change an inventory hold.

#### Scenario: Product selection defaults quantity to one in the form

- **GIVEN** a draft listing with no product selected and empty quantity
- **WHEN** an authorized operator selects a created inventory product
- **THEN** the editor shows quantity one in the form
- **AND** no inventory reservation exists until Save

### Requirement: Draft save synchronizes an active inventory reservation

When an authorized operator explicitly saves a draft listing with both
**productId** and **quantity** set, Grade10 SHALL synchronize inventory
**before** persisting the listing fields:

1. Validate the product is inventory **`status` `created`**. Refuse draft
   inventory products.
2. Compute **effective available** for the requested product: global
   `available` plus this listing's **remaining** on an active hold for the
   same product, if any. Refuse when requested quantity exceeds effective
   available.
3. If no active hold exists for this listing → call
   `AuctionInventoryService.reserve` with `holderReference` = listing id,
   the product, and quantity. The reservation SHALL be **`active`**.
4. If an active hold exists on the **same** product with a different
   quantity → call `adjustReservation` to the new quantity. Decreasing
   quantity SHALL decrease inventory **`reserved`** without increasing
   reservation **`released`**.
5. If an active hold exists on a **different** product → call
   `changeReservationProduct` on that reservation with the new product and
   quantity in one inventory transaction.
6. Persist listing **productId** and **quantity** only after inventory
   succeeds. On inventory refusal, listing fields SHALL be unchanged.

Clearing **productId** or **quantity** on Save SHALL release any active hold
for this listing (full release of remaining) before persisting the cleared
field(s).

#### Scenario: First explicit save with product and quantity reserves stock

- **GIVEN** a draft listing with no active inventory hold
- **AND** a created inventory product with available at least three
- **WHEN** an authorized operator sets product and quantity three and clicks
  Save
- **THEN** Grade10 creates an active reservation of quantity three keyed by
  the listing id
- **AND** the product's inventory **reserved** increases by three
- **AND** the listing stores product id and quantity three

#### Scenario: Save increases quantity adjusts the same reservation

- **GIVEN** a draft listing with an active hold of quantity three on product A
- **AND** product A has available at least two
- **WHEN** an authorized operator changes quantity to five and clicks Save
- **THEN** the same reservation id stays active with quantity five
- **AND** product A **reserved** increases by two
- **AND** reservation **released** is unchanged

#### Scenario: Save decreases quantity frees stock without release counter

- **GIVEN** a draft listing with an active hold of quantity five
- **WHEN** an authorized operator changes quantity to two and clicks Save
- **THEN** the same reservation id stays active with quantity two
- **AND** inventory **reserved** decreases by three
- **AND** reservation **released** remains zero

#### Scenario: Save changes product moves the hold atomically

- **GIVEN** a draft listing with an active hold of quantity three on product A
- **AND** product B is **created** with available at least three
- **WHEN** an authorized operator selects product B, keeps quantity three,
  and clicks Save
- **THEN** Grade10 moves the hold to product B with quantity three in one
  inventory transaction
- **AND** product A **reserved** decreases by three
- **AND** product B **reserved** increases by three
- **AND** the listing stores product B

#### Scenario: Save refused when quantity exceeds effective available

- **GIVEN** a draft listing with an active hold of quantity three on product A
- **AND** product A available is one
- **WHEN** an authorized operator changes quantity to five and clicks Save
- **THEN** Grade10 refuses the save
- **AND** the hold and listing fields are unchanged

#### Scenario: Clearing product on Save releases the hold

- **GIVEN** a draft listing with an active hold on a product
- **WHEN** an authorized operator clears the product and clicks Save
- **THEN** Grade10 releases the hold
- **AND** inventory **reserved** decreases by the hold's remaining
- **AND** the listing stores no product id

#### Scenario: Clearing quantity on Save releases the hold

- **GIVEN** a draft listing with an active hold of quantity three
- **WHEN** an authorized operator clears quantity and clicks Save
- **THEN** Grade10 releases the hold
- **AND** inventory **reserved** decreases by three
- **AND** the listing stores no quantity

#### Scenario: Save with product but no quantity creates no hold

- **GIVEN** a draft listing with no active hold
- **WHEN** an authorized operator sets a created product but clears quantity
  and clicks Save
- **THEN** Grade10 persists the product id
- **AND** no inventory reservation is created

### Requirement: Create verifies an existing inventory hold

`listings.create` SHALL move a listing from **`draft`** to **`created`** only
when every other create requirement is met **and**, when the listing stores
both **productId** and **quantity**, an **active** inventory reservation
exists for that listing with the same product and quantity.

Create SHALL **not** call inventory reserve, adjust, or product-change
mutations. The operator MUST have saved the draft with product and quantity
first so the hold already exists.

#### Scenario: Create succeeds when hold matches saved product and quantity

- **GIVEN** a draft listing stored with product A and quantity three
- **AND** an active inventory hold of quantity three on product A for this
  listing
- **WHEN** an authorized operator creates the listing with every other
  required field set
- **THEN** Grade10 moves the listing to **created**
- **AND** the hold remains active with quantity three

#### Scenario: Create refused when no hold exists

- **GIVEN** a draft listing stored with product A and quantity three
- **AND** no active inventory hold for this listing
- **WHEN** an authorized operator attempts create
- **THEN** Grade10 refuses the create
- **AND** the listing remains **draft**

#### Scenario: Create refused when hold quantity mismatches

- **GIVEN** a draft listing stored with quantity five
- **AND** an active hold of quantity three for this listing
- **WHEN** an authorized operator attempts create
- **THEN** Grade10 refuses the create
- **AND** the listing remains **draft**

#### Scenario: Create refused when hold product mismatches

- **GIVEN** a draft listing stored with product B and quantity three
- **AND** an active hold of quantity three on product A for this listing
- **WHEN** an authorized operator attempts create
- **THEN** Grade10 refuses the create
- **AND** the listing remains **draft**

### Requirement: Product change warns before moving an existing hold

When an operator changes the catalogue **product** on a listing that already
has an **active** inventory reservation from a prior explicit Save, the
editor SHALL show a confirmation dialog before applying the new product to
local form state. The dialog SHALL state that confirming and clicking Save
will move the hold to the new product and free reserved stock on the prior
product.

The dialog SHALL NOT appear when:

- the listing has never had an active hold (first product selection on a
  new or never-saved draft), or
- the listing has no active hold (draft saved without product or quantity,
  or hold already released).

Canceling the dialog SHALL leave the selected product unchanged in the form.

#### Scenario: Product change prompts when a hold already exists

- **GIVEN** a draft listing with an active hold on product A from a prior Save
- **WHEN** an authorized operator selects product B in the picker
- **THEN** the editor shows a confirmation dialog that Save will move the
  hold to product B and free reserved stock on product A
- **AND** no inventory mutation runs until Save

#### Scenario: First product selection does not prompt

- **GIVEN** a draft listing with no active hold
- **WHEN** an authorized operator selects product A
- **THEN** no confirmation dialog is shown
- **AND** quantity defaults to one in the form

#### Scenario: Canceling the product-change dialog keeps the prior product

- **GIVEN** a draft listing with an active hold on product A
- **WHEN** an authorized operator selects product B and cancels the
  confirmation dialog
- **THEN** the form still shows product A
- **AND** the hold on product A is unchanged

### Requirement: Product-change save failure surfaces an editor error

When Save calls `changeReservationProduct` and inventory refuses — for example
insufficient stock on the new product, a draft target product, or quantity
below the settled floor — the listing editor SHALL show an operator-visible
error. The listing's stored **productId** and **quantity** SHALL remain the
values from before that Save attempt, and the hold on the prior product SHALL
be unchanged.

#### Scenario: Save shows error when new product has insufficient stock

- **GIVEN** a draft listing with an active hold on product A
- **AND** product B available is less than the requested quantity
- **WHEN** an authorized operator selects product B and clicks Save
- **THEN** Grade10 refuses the save
- **AND** the editor shows an error naming insufficient stock
- **AND** the listing still stores product A with the prior quantity
- **AND** the hold on product A is unchanged

### Requirement: Listing cancel releases inventory hold

When a listing is canceled through operator call-off or campaign fan-out,
Grade10 SHALL release any **active** inventory reservation for that listing
(full release of remaining) before or as part of the cancel transition.

#### Scenario: Cancel releases remaining stock

- **GIVEN** a created listing with an active hold of quantity three and
  remaining three
- **WHEN** an authorized operator cancels the listing
- **THEN** the reservation becomes **closed**
- **AND** inventory **reserved** decreases by three
- **AND** the listing moves to **canceled**

### Requirement: Listings section creates an independent listing

An authorized operator SHALL start a new Auction listing from the Grade10
auction **Listings** section. The Listings section SHALL expose a **Create
listing** action for an operator who holds the `auction:operate` grant.

Activating Create listing SHALL open the listing editor with **no Campaign**
selected. The operator SHALL NOT be required to choose a campaign before
saving a draft, creating, or publishing. Campaign attachment remains optional.

A listing saved, created, or published with no campaign SHALL persist with
`campaign_id` null. A collector SHALL open that listing by its slug on the
public catalogue. The Listings table SHALL show "-" in the campaign column
when a row has no campaign.

An operator without the `auction:operate` grant SHALL NOT be offered Create
listing. A draft save sent without that grant SHALL be refused.

#### Scenario: grade10-admin-auction-listing-SC-68 - Create listing is offered on the Listings section

- **GIVEN** an authorized operator on the Grade10 auction Listings section
- **WHEN** they read the section heading row
- **THEN** a Create listing action is present

#### Scenario: grade10-admin-auction-listing-SC-69 - Listing editor opens with no campaign selected

- **GIVEN** an authorized operator who activates Create listing on the
  Listings section
- **WHEN** the listing editor opens
- **THEN** the Campaign control has no campaign selected

#### Scenario: grade10-admin-auction-listing-SC-58 - Draft saves with the campaign left empty

- **GIVEN** a new listing opened from the Listings section with no campaign
- **WHEN** an authorized operator saves a draft with a title and no campaign
- **THEN** Grade10 persists a draft listing with no campaign
- **AND** the listing is absent from the public catalogue

#### Scenario: grade10-admin-auction-listing-SC-59 - Listing creates with no campaign

- **GIVEN** a draft listing with every required create field set and no campaign
- **WHEN** an authorized operator creates the listing
- **THEN** Grade10 moves it to `created`
- **AND** the listing has no campaign
- **AND** it is still absent from the public catalogue

#### Scenario: grade10-admin-auction-listing-SC-60 - Listing publishes with no campaign

- **GIVEN** a created listing with no campaign and no publish at
- **WHEN** an authorized operator publishes it
- **THEN** Grade10 moves it to `published`
- **AND** the listing still has no campaign

#### Scenario: grade10-admin-auction-listing-SC-61 - Collector opens the published listing by slug

- **GIVEN** a published listing with no campaign whose slug is
  `standalone-lot-1`
- **WHEN** a collector opens `/auction/listings/standalone-lot-1`
- **THEN** Grade10 returns that listing

#### Scenario: grade10-admin-auction-listing-SC-62 - Listings table shows an unattached listing

- **GIVEN** a listing with no campaign
- **WHEN** an authorized operator reads the Listings section table
- **THEN** that row's campaign column shows "-"
- **AND** it does not display a campaign id as a label

#### Scenario: grade10-admin-auction-listing-SC-63 - Create listing is not offered to an unauthorized operator

- **GIVEN** a signed-in operator without the `auction:operate` grant
- **WHEN** they read the Grade10 auction Listings section
- **THEN** Create listing is not offered
- **AND** a draft save sent for a new listing is refused

### Requirement: Test panel seeds and drops standalone fixture listings

The Grade10 auction **Test** panel (visible only when `LOCAL_FIXTURES_ENABLED`
is true) SHALL expose a **Listings** tab beside the existing **Campaign** tab.

The Listings tab SHALL let a developer select one or more fixture ids from the
same list used by the Campaign tab, then seed those fixtures as standalone
listings with no campaign. Each seeded listing SHALL receive:

- An inventory product with reserved stock (quantity 1), via the same
  inventory seed path the Campaign tab uses.
- A media item attached, via the same upload path.
- `campaign_id` null — no campaign is created or attached.

The tab SHALL show how many instances of each fixture have been seeded. A
**Drop listings** control SHALL let the developer select a standalone fixture
listing from the existing ones and remove it along with any hold on its
inventory product. The drop removes only listings whose slug matches the
standalone fixture slug pattern and whose `campaign_id` is null.

This surface and its backend procedures SHALL NOT be reachable outside a
locally enabled dev environment (`assertDevEndpointsAllowed`).

#### Scenario: grade10-admin-auction-listing-SC-64 - Listings tab is present in the Test panel

- **GIVEN** the Grade10 auction Test panel with `LOCAL_FIXTURES_ENABLED` true
- **WHEN** a developer opens the Test panel
- **THEN** a Listings tab is present beside the Campaign tab

#### Scenario: grade10-admin-auction-listing-SC-65 - Developer seeds fixture listings with no campaign

- **GIVEN** the Listings tab in the Test panel
- **WHEN** a developer selects one or more fixture ids and clicks Add listings
- **THEN** Grade10 creates each selected fixture as a listing with no campaign
- **AND** each listing has a reserved inventory product and a media item
- **AND** the instance counts on the tab update

#### Scenario: grade10-admin-auction-listing-SC-66 - Seeded standalone listings appear in the Listings section with no campaign

- **GIVEN** a fixture listing seeded from the Test panel Listings tab
- **WHEN** an authorized operator reads the Listings section
- **THEN** that listing appears in the table
- **AND** its campaign column shows "-"

#### Scenario: grade10-admin-auction-listing-SC-67 - Developer drops standalone fixture listings

- **GIVEN** one or more standalone fixture listings seeded from the Listings tab
- **WHEN** a developer selects one and clicks Drop listing
- **THEN** Grade10 removes that listing and releases its inventory hold
- **AND** the listing no longer appears in the Listings section
