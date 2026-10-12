## Feature set

- Draft save
  - Incomplete listing: an authorized operator saves without filling every field
  - First save mints a unit: the first draft creates an auctionable unit with no other live listing
- Create and catalogue
  - Required fields at create: title, slug, starting price, window, and media are checked on the form and the API
  - Slug as public key: collectors open a listing by slug; collisions and reuse follow the listing's state
  - Catalogue fields: an operator may write copy and taxonomy before publish
  - Listing code: Grade10 allocates a stable, opaque 5-character code for a
    listing on its first saved draft, and shows that code on the listing's admin
    screen for operators to match against a quoted support, finance or
    reconciliation reference
  - Generated slug: a saved draft starts with a distinct title-and-code address
    that an operator can replace
- Prices and window
  - Writable before publish: starting price, close, extension duration, and cap can change until the listing is live
  - Starting price of 0: a draft and create accept 0 in USD, HKD and JPY; a negative, non-whole or empty price is refused, and empty is never stored as 0
- Publish
  - Now or scheduled: a created listing publishes immediately or at a set time
- Call off
  - Before close: an operator withdraws a listing that has not closed
  - Reusable address: call off releases the original slug for another listing
  - Closed is frozen: a closed listing cannot be rewritten here
- Gallery
  - One to eight uploads: images or videos, stored as uploaded, ordered, first item as the catalogue card
  - Combined sources: selected product assets and listing-only uploads form one ordered gallery
  - Saved snapshot: a selected product asset becomes listing media on Save, unaffected by later product-media edits, reordering, or deletion
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
- Inventory unit
  - Explicit choice: product selection is paired with a Cert ID or `No Cert ID`
  - Unit hold: a selected Cert ID is held as one physical unit
- Listing lifecycle
  - Draft save: validates and preserves the selected unit
  - Create: requires the saved unit choice and matching inventory hold
- Product display
  - Selected identity: public fields resolve through Inventory
  - Unnumbered stock: `No Cert ID` displays no certificate row
- Listings Stats
  - Watchers in Stats: opening Stats shows how many collectors watch the lot, so an operator judges interest beside the bidder count
  - No table column: the Listings table does not show the watch count
- Unsold close
  - Stock released: a listing that closes with no winner releases its inventory hold at the close, with no operator step
  - Released note: an Unsold listing says its stock was released, and when
  - Relist: an Unsold listing's row in the Listings table opens a new draft with the same product, quantity and catalogue copy, once its stock is released, outside a campaign and once per listing
  - Earlier holds freed: holds left by earlier Unsold closes are released once
- Unit-aware source selection
  - For a selected Cert record, the main selector offers the product's untagged source media and media tagged to that record. Every Cert record has a Cert ID.
  - Other media tagged to a printed-Cert record stays outside the main selector; the separately labelled drawer contains only that media, grouped and named by the printed Cert ID, which an explicit Add to listing action names.
  - For `No Cert ID`, the main selector offers only untagged product media.
- Listing-owned gallery snapshot
  - Adding a source item copies its bytes and current alt text into the listing gallery.
  - Listing alt text and order remain editable; later source changes do not change the listing copy.
  - Direct listing uploads and the existing one-to-eight gallery rules remain available.

## MODIFIED Requirements

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
  original value is free for another listing. This applies to listings called
  off before or after this rule is delivered.
- Slug SHALL be writable while `draft` or `created`. A write of slug on a
  `published`, `closed`, `settled`, or `canceled` listing SHALL be refused,
  except the release Grade10 applies when the listing is canceled.
- A collector SHALL receive a `published`, `closed`, or `settled` listing by
  opening `/auction/listings/<slug>`. A slug that names no such listing
  SHALL be not found. A `draft`, `created`, or `canceled` listing SHALL NOT
  answer at that address.

<!-- trace:scenario id=g10adm.auction-listing.SC-9oe rev=1 -->
#### Scenario: g10adm.auction-listing.SC16 - Collector opens a listing by slug
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a listing in front of collectors

- **GIVEN** a published listing whose slug is `charizard-psa-9`
- **WHEN** a collector opens `/auction/listings/charizard-psa-9`
- **THEN** Grade10 returns that listing

<!-- trace:scenario id=g10adm.auction-listing.SC-4f0 rev=1 -->
#### Scenario: g10adm.auction-listing.SC17 - Unknown slug is not found
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a listing in front of collectors

- **GIVEN** no published, closed, or settled listing with slug `no-such-lot`
- **WHEN** a collector opens `/auction/listings/no-such-lot`
- **THEN** Grade10 answers as not found

<!-- trace:scenario id=g10adm.auction-listing.SC-ng3 rev=1 -->
#### Scenario: g10adm.auction-listing.SC18 - Duplicate slug is refused
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a listing that is not canceled whose slug is `charizard-psa-9`
- **WHEN** an operator sets another listing's slug to `charizard-psa-9`
- **THEN** Grade10 refuses the write
- **AND** the second listing's slug is unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-g0h rev=1 -->
#### Scenario: g10adm.auction-listing.SC19 - Two drafts cannot share a slug
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a draft whose slug is `charizard-psa-9`
- **WHEN** an operator sets another draft's slug to `charizard-psa-9`
- **THEN** Grade10 refuses the write
- **AND** the second draft's slug is unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-hp2 rev=1 -->
#### Scenario: g10adm.auction-listing.SC20 - Empty slugs on drafts are not a collision
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a draft with no slug
- **WHEN** an operator saves another draft with no slug
- **THEN** Grade10 accepts the save
- **AND** neither draft occupies a slug

<!-- trace:scenario id=g10adm.auction-listing.SC-jx5 rev=1 -->
#### Scenario: g10adm.auction-listing.SC21 - Create can reuse a canceled listing's original slug
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a canceled listing that previously used slug `charizard-psa-9`
- **AND** a draft with every required field set, including slug
  `charizard-psa-9`
- **WHEN** the operator creates the draft
- **THEN** Grade10 moves the draft to `created`
- **AND** the canceled listing still does not hold `charizard-psa-9`

<!-- trace:scenario id=g10adm.auction-listing.SC-4kw rev=1 -->
#### Scenario: g10adm.auction-listing.SC22 - Create cannot reuse a closed listing's slug
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a closed listing whose slug is `charizard-psa-9`
- **AND** a draft with every required field set, including slug
  `charizard-psa-9`
- **WHEN** the operator creates the draft
- **THEN** Grade10 refuses the create
- **AND** the draft remains a draft
- **AND** `/auction/listings/charizard-psa-9` still returns the closed listing

<!-- trace:scenario id=g10adm.auction-listing.SC-2d5 rev=1 -->
#### Scenario: g10adm.auction-listing.SC23 - Published slug cannot change
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a listing in front of collectors

- **GIVEN** a published listing whose slug is `charizard-psa-9`
- **WHEN** an operator sets slug to `charizard-psa-9-copy`
- **THEN** Grade10 refuses the write
- **AND** `/auction/listings/charizard-psa-9` still returns that listing

<!-- trace:scenario id=g10adm.auction-listing.SC-xck rev=1 -->
#### Scenario: g10adm.auction-listing.SC155 - Field exit and Save accept a released address
**Serves:** grade10-admin-auction-listing-US-73 - the operator selects an available address before saving

- **GIVEN** a called-off listing formerly used slug charizard-psa-9 and no listing now holds it
- **WHEN** an operator leaves Slug with charizard-psa-9 on another draft and saves
- **THEN** the editor reports available and Save stores that slug on the draft without exposing the called-off listing

<!-- trace:scenario id=g10adm.auction-listing.SC-yml rev=1 -->
#### Scenario: g10adm.auction-listing.SC156 - Existing called-off addresses become reusable
**Serves:** grade10-admin-auction-listing-US-03 - the operator creates a replacement for an earlier withdrawn lot

- **GIVEN** a listing called off before this rule was delivered previously held charizard-psa-9
- **WHEN** an operator saves and creates another complete draft using charizard-psa-9
- **THEN** the new listing holds the slug and becomes created; the old listing retains its listing code and bidder history without retaining that slug


### Requirement: Operator may call off a listing that has not closed

An operator authorized to call a listing off SHALL cancel a listing that is
`draft`, `created`, or `published`. Cancel SHALL move the listing to
`canceled` and SHALL call off every bid standing on it. No bidder SHALL be
charged, and the listing's stock SHALL be released per "Listing cancel
releases inventory hold".

Cancel SHALL be refused when the listing is `closed`, `settled`, or already
`canceled`. A closed or settled listing's outcome is absolute and SHALL NOT
be reopened by cancel. Cancel of a listing that does not exist SHALL be
refused.

Cancel of a `published` listing SHALL be allowed whether or not bidding has
opened and whether or not it has accepted bids. Cancel of a `created`
listing SHALL be allowed even when a publish at is still in the future;
Grade10 SHALL NOT later publish a listing that was canceled.

When the listing has a slug, cancel SHALL release its original value as part
of the same successful cancellation. The canceled listing SHALL NOT retain
that slug or answer at its former address. Grade10 SHALL NOT create an alias,
redirect, or alternate public address for the called-off listing. A listing
with no slug SHALL stay without one. The same release rule SHALL apply when
Grade10 cancels the listing because its campaign was canceled.

Cancel SHALL preserve the listing code, its permanent reservation and the
bidder's account record. Closed and settled listing slugs SHALL remain
reserved.

Cancel from an operator who is not authorized to call a listing off SHALL
be refused, and the listing and slug SHALL be unchanged.

<!-- trace:scenario id=g10adm.auction-listing.SC-pfl rev=1 -->
#### Scenario: g10adm.auction-listing.SC36 - Operator calls off a draft
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a draft listing
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 moves it to `canceled`
- **AND** it stays absent from the public catalogue

<!-- trace:scenario id=g10adm.auction-listing.SC-2px rev=1 -->
#### Scenario: g10adm.auction-listing.SC37 - Operator calls off a created listing before publish at
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a created listing with a publish at still in the future
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 moves it to `canceled`
- **AND** when that publish at arrives, Grade10 does not publish it
- **AND** it stays absent from the public catalogue

<!-- trace:scenario id=g10adm.auction-listing.SC-oc9 rev=1 -->
#### Scenario: g10adm.auction-listing.SC38 - Operator calls off a published listing that has bids
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a published listing with a leading bid, an outbid bid and stock
  held for it
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 moves it to `canceled`
- **AND** both bids are called off, and no bidder is charged
- **AND** the stock held for it is released
- **AND** it is absent from the public catalogue

<!-- trace:scenario id=g10adm.auction-listing.SC-e1b rev=1 -->
#### Scenario: g10adm.auction-listing.SC39 - Closed listing cannot be called off
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a closed listing
- **WHEN** an operator calls it off
- **THEN** Grade10 refuses the cancel
- **AND** the listing remains closed

<!-- trace:scenario id=g10adm.auction-listing.SC-f4v rev=1 -->
#### Scenario: g10adm.auction-listing.SC40 - Settled listing cannot be called off
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a settled listing
- **WHEN** an operator calls it off
- **THEN** Grade10 refuses the cancel
- **AND** the listing remains settled

<!-- trace:scenario id=g10adm.auction-listing.SC-j48 rev=1 -->
#### Scenario: g10adm.auction-listing.SC41 - Already canceled listing cannot be called off again
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a canceled listing
- **WHEN** an operator calls it off
- **THEN** Grade10 refuses the cancel
- **AND** the listing remains canceled

<!-- trace:scenario id=g10adm.auction-listing.SC-ysx rev=2 -->
#### Scenario: g10adm.auction-listing.SC42 - Cancel releases the original slug
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a published listing whose slug is charizard-psa-9
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 releases charizard-psa-9 for another listing
- **AND** the listing no longer answers at that address
- **AND** the listing is absent from browse and search
- **AND** its listing code and bidder history are retained

<!-- trace:scenario id=g10adm.auction-listing.SC-lj7 rev=1 -->
#### Scenario: g10adm.auction-listing.SC43 - Cancel of a draft with no slug does not invent one
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a draft listing with no slug
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 moves it to `canceled`
- **AND** the listing still has no slug

<!-- trace:scenario id=g10adm.auction-listing.SC-tjj rev=1 -->
#### Scenario: g10adm.auction-listing.SC44 - Unauthorized cancel is refused
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a published listing
- **AND** a signed-in operator who may not call a listing off
- **WHEN** they call it off
- **THEN** Grade10 refuses the cancel
- **AND** the listing remains published
- **AND** its slug is unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-euk rev=1 -->
#### Scenario: g10adm.auction-listing.SC157 - Campaign cancellation releases each called-off address
**Serves:** grade10-admin/auction/campaign#grade10-admin-auction-campaign-US-05 - the operator withdraws the campaign and its remaining lots

- **GIVEN** a campaign contains draft, created and published listings with slugs and a closed listing
- **WHEN** the operator cancels the campaign and its eligible listings are called off
- **THEN** each successfully called-off listing releases its original slug under the listing cancel rules; the closed listing retains its slug and outcome

<!-- trace:scenario id=g10adm.auction-listing.SC-ejg rev=1 -->
#### Scenario: g10adm.auction-listing.SC158 - Competing drafts reserve one released address
**Serves:** grade10-admin-auction-listing-US-73 - the operator receives the authoritative result when another draft saves first

- **GIVEN** a called-off listing has released charizard-psa-9 and two drafts select it
- **WHEN** the operators save both drafts concurrently
- **THEN** at most one draft holds charizard-psa-9; the other Save is refused as reserved and leaves its stored slug unchanged
