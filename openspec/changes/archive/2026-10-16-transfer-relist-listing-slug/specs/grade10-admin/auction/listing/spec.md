# grade10-admin/auction/listing Specification

## Purpose

Lets an authorized Grade10 operator draft, create, and publish an Auction
listing — incomplete saves first, required fields enforced at create, publish
now or at a future scheduled time — with an ordered gallery of one to eight
images or videos from product assets or direct uploads, frozen when saved,
chosen for the selected physical unit with deliberate cross-Cert additions,
call one off while it has not closed, and get a lot's stock back, with a
one-step Relist, when its listing closes with no winner. Named image sizes and
optional alt live in `grade10-site/auction/listing-media`. An operator also writes a listing's title and description in English, Traditional Chinese and Simplified Chinese, reads each back on the detail page, and finds a listing by a title in any language.

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
- Listing currency
  - USD only: the listing form offers no currency choice and stores USD when none is supplied
  - Earlier lots: HKD or JPY listing currencies are overwritten to USD with amounts and history unchanged
  - Other currencies refused: HKD, JPY or any other currency is refused on a draft, create or update, by the form and API
- Prices and window
  - Writable before publish: starting price, close, extension duration, and cap can change until the listing is live
  - Starting price of 0: a draft and create accept 0 in USD; a negative, non-whole or empty price is refused, and empty is never stored as 0
- Publish
  - Now or scheduled: a created listing publishes immediately or at a set time
- Call off
  - Before close: an operator withdraws a listing that has not closed
  - Closed is frozen: a closed listing cannot be rewritten here
  - Reusable address: call off releases the original slug for another listing
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
  - Relist public address: Relist Save frees the Unsold source's slug and assigns it to the new draft in one transaction; the new draft keeps its own listing code; both listings' activity records the transfer; no redirect table
  - Relisted badge: once Relist Save linked a successor, the Unsold source shows Relisted beside Unsold on its listing detail header and in the Listings table Status column
  - Earlier holds freed: holds left by earlier Unsold closes are released once
- Unit-aware source selection
  - For a selected Cert record, the main selector offers the product's untagged source media and media tagged to that record. Every Cert record has a Cert ID.
  - Other media tagged to a printed-Cert record stays outside the main selector; the separately labelled drawer contains only that media, grouped and named by the printed Cert ID, which an explicit Add to listing action names.
  - For `No Cert ID`, the main selector offers only untagged product media.
- Listing-owned gallery snapshot
  - Adding a source item copies its bytes and current alt text into the listing gallery.
  - Listing alt text and order remain editable; later source changes do not change the listing copy.
- Title and description in each language
  - Every language carried: a listing keeps English, Traditional Chinese and Simplified Chinese titles and descriptions; Relist carries every language across

## ADDED Requirements

## MODIFIED Requirements

### Requirement: Relist opens a new draft from an Unsold listing

The Listings table row of an Unsold listing SHALL offer **Relist** when every
condition holds, and SHALL NOT show it otherwise; no other row SHALL offer it:

| Condition | Rule |
| --- | --- |
| Stock | The listing's stock release has completed |
| Campaign | The listing sits in no campaign |
| Relisted | No listing has yet been saved from this listing's Relist |
| Operator | Holds the `auction:operate` grant |

1. Relist SHALL open the listing editor filled in with the Unsold listing's
   product, quantity, Cert ID choice, title and copy in every language,
   starting price, currency, gallery and slug.
2. The editor SHALL start with no listing code or window; every other field
   SHALL start as on any new draft.
3. Nothing SHALL be stored and no stock SHALL be held until the operator saves.
   Relist activated again SHALL open another unsaved editor.
4. Save SHALL be an ordinary draft save that records which listing it was
   relisted from. In the same transaction Save SHALL free the Unsold source's
   former slug and store the form's slug on the new draft. When the form slug
   is empty, Save SHALL store the ordinary title-and-code generated slug for
   the new draft's listing code and SHALL still free the source's former slug.
   The new draft SHALL receive its own listing code. The Unsold listing's other
   fields SHALL NOT change. Both listings' activity SHALL name the slug the new
   draft holds and the other listing by listing code and English title when
   present, else the listing id. Grade10 SHALL NOT create a redirect or alias
   for the move. Once that Save linked a successor, the Unsold source's listing
   detail header and its Listings table Status column SHALL show a **Relisted**
   badge beside **Unsold**.

The gallery SHALL be copied into the new listing, so later edits to either
gallery do not change the other.

Save SHALL be refused, storing nothing and holding no stock, when the source
listing:

| Refused when the source | Refusal |
| --- | --- |
| Does not exist | Listing not found |
| Did not close with no winner | Not Unsold |
| Sits in a campaign | In a campaign |
| Has no completed stock release | Stock not released |
| Already has a listing saved from its Relist | Already relisted |

The editor SHALL show the refusal's name inline.

Every refusal of an ordinary draft save, such as available stock below the
quantity or a slug held by a listing other than this Relist source, SHALL
apply as well.

<!-- trace:scenario id=g10adm.auction-listing.SC-4ez rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-135 - Relist opens the editor with the lot filled in
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing in no campaign whose stock was released, with a
  product, a Cert ID choice, quantity three, a title, copy, a starting price, a
  currency, a two-item gallery and slug `umbreon-v-alt`
- **WHEN** an operator holding `auction:operate` activates Relist on its row in
  the Listings table
- **THEN** the editor shows the same product, Cert ID choice, quantity, title,
  copy, starting price, currency, both gallery items and slug `umbreon-v-alt`
- **AND** it has no window or listing code yet

<!-- trace:scenario id=g10adm.auction-listing.SC-lc6 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-136 - Relist stores nothing until Save
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** the editor opened by Relist on a listing of a product with
  available five and quantity three
- **WHEN** the operator leaves without saving
- **THEN** no listing is stored and available is unchanged
- **AND** when the operator instead saves, a new draft holds three units,
  available falls by three and the Unsold listing's product, quantity and
  outcome stay as they were

<!-- trace:scenario id=g10adm.auction-listing.SC-z9c rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-137 - Relist shows on the row of a released Unsold listing only
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** listings in no campaign: an Unsold listing whose stock was
  released, a listing with a winner, a live listing and a called-off listing
- **WHEN** an operator holding `auction:operate` opens the Listings table
- **THEN** only the Unsold listing's row offers Relist

<!-- trace:scenario id=g10adm.auction-listing.SC-j1h rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-138 - An operator without the grant is not offered Relist
**Serves:** grade10-admin-auction-listing-US-09 - only an operator who can operate auctions relists

- **GIVEN** an Unsold listing in no campaign whose stock was released, and an
  operator without `auction:operate`
- **WHEN** they open the Listings table
- **THEN** the listing's row shows no Relist

<!-- trace:scenario id=g10adm.auction-listing.SC-suv rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-141 - Relist waits for the stock release
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing in no campaign whose stock release has not yet
  completed
- **WHEN** an operator holding `auction:operate` opens the Listings table
- **THEN** the listing's row shows no Relist
- **AND** once the release completes, the row offers Relist

<!-- trace:scenario id=g10adm.auction-listing.SC-lqj rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-142 - A listing in a campaign offers no Relist
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing in a campaign whose stock was released
- **WHEN** an operator holding `auction:operate` opens the Listings table
- **THEN** the listing's row shows no Relist

<!-- trace:scenario id=g10adm.auction-listing.SC-nq1 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-143 - Relist is hidden once the listing is relisted
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing whose Relist editor was saved as a new draft
- **WHEN** an operator holding `auction:operate` opens the Listings table
- **THEN** the Unsold listing's row shows no Relist

<!-- trace:scenario id=g10adm.auction-listing.SC-rlb rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-218 - Relisted badge on the Unsold source after Relist Save
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing whose Relist editor was saved as a new draft
- **WHEN** an operator opens that Unsold listing's detail page and the Listings
  table
- **THEN** the detail header shows a Relisted badge beside Unsold
- **AND** the Listings table Status column for that row shows Relisted beside
  Unsold
- **AND** an Unsold listing that has never been Relisted shows Unsold without
  Relisted

<!-- trace:scenario id=g10adm.auction-listing.SC-2m4 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-144 - Only the first of two Relist editors saves
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** two editors opened by Relist on the same Unsold listing, of a
  product with available five and quantity three
- **WHEN** the operator saves the first and then the second
- **THEN** the first stores a draft holding three units
- **AND** the second is refused as already relisted, stores nothing and
  available stays two

<!-- trace:scenario id=g10adm.auction-listing.SC-9uj rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-145 - Save refuses a source that cannot be relisted
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** a listing with a winner, an Unsold listing in a campaign, and an
  Unsold listing whose stock release has not completed
- **WHEN** a relist save names each as its source
- **THEN** each is refused, as not Unsold, in a campaign and stock not released
  in turn
- **AND** no listing is stored and available is unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-5ry rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-196 - Relist carries every language
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing in no campaign whose stock was released, with a Traditional Chinese title and description and a Simplified Chinese title but no Simplified Chinese description
- **WHEN** an operator holding `auction:operate` activates Relist on its row and saves the draft
- **THEN** the editor opened with all three titles and the two descriptions written
- **AND** the new draft stores the same titles and descriptions, and no Simplified Chinese description
- **AND** the Unsold listing's texts are unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-ace rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-209 - Relist Save moves the source slug onto the new draft
**Serves:** grade10-admin-auction-listing-US-09 - a shared link keeps working for the lot that will sell again

- **GIVEN** an Unsold listing in no campaign whose stock was released, whose
  slug is `umbreon-v-alt` and whose listing code is `LK423`
- **WHEN** an operator holding `auction:operate` activates Relist, leaves the
  prefilled slug as `umbreon-v-alt`, and saves the draft
- **THEN** the new draft holds slug `umbreon-v-alt` and a listing code other
  than `LK423`
- **AND** the Unsold source no longer holds `umbreon-v-alt` and still holds
  code `LK423`
- **AND** no redirect or alias is stored

<!-- trace:scenario id=g10adm.auction-listing.SC-d22 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-210 - Relist Save stores a replaced slug and frees the source's former address
**Serves:** grade10-admin-auction-listing-US-09 - the operator may choose another address before Save

- **GIVEN** an Unsold listing whose slug is `umbreon-v-alt`, opened by Relist
  with that slug filled in
- **WHEN** the operator sets Slug to `umbreon-again` and saves
- **THEN** the new draft holds `umbreon-again`
- **AND** the Unsold source no longer holds `umbreon-v-alt`
- **AND** `umbreon-v-alt` is free for another listing

<!-- trace:scenario id=g10adm.auction-listing.SC-359 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-211 - The shared address is not found between Relist Save and Publish
**Serves:** grade10-admin-auction-listing-US-09 - draft and created still stay off the public address

- **GIVEN** Relist Save has moved slug `umbreon-v-alt` onto a new draft
- **WHEN** a collector opens `/auction/listings/umbreon-v-alt` before that
  draft is published
- **THEN** Grade10 answers as not found

<!-- trace:scenario id=g10adm.auction-listing.SC-fde rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-212 - After Publish the shared address opens the successor
**Serves:** grade10-admin-auction-listing-US-09 - a shared link opens the live lot

- **GIVEN** Relist Save moved slug `umbreon-v-alt` onto a new draft that is
  later published
- **WHEN** a collector opens `/auction/listings/umbreon-v-alt`
- **THEN** Grade10 returns that published successor

<!-- trace:scenario id=g10adm.auction-listing.SC-eaf rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-213 - Activity on both listings names the transferred slug
**Serves:** grade10-admin-auction-listing-US-09 - operators see that the public address moved

- **GIVEN** Relist Save moved slug `umbreon-v-alt` from an Unsold listing whose
  listing code is `LK423` and English title is `Umbreon V` onto a new draft
  whose listing code is `MN891` and English title is `Umbreon V`
- **WHEN** an operator opens activity on the Unsold source and on the new draft
- **THEN** each listing shows an entry that names `umbreon-v-alt` and the other
  listing by listing code and English title
- **AND** the source entry names `MN891` and `Umbreon V`
- **AND** the draft entry names `LK423` and `Umbreon V`

<!-- trace:scenario id=g10adm.auction-listing.SC-ib3 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-217 - Clearing the Relist slug stores a generated address and frees the source
**Serves:** grade10-admin-auction-listing-US-09 - the operator may clear the address before Save

- **GIVEN** an Unsold listing titled `Umbreon V` whose slug is `umbreon-v-alt`,
  opened by Relist with that slug filled in
- **WHEN** the operator clears Slug and saves
- **THEN** the new draft stores a title-and-code slug built from `Umbreon V` and
  its new listing code
- **AND** the Unsold source no longer holds `umbreon-v-alt`
- **AND** `umbreon-v-alt` is free for another listing

<!-- trace:scenario id=g10adm.auction-listing.SC-8b7 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-214 - After Relist Save the Unsold source no longer reserves its former slug
**Serves:** grade10-admin-auction-listing-US-73 - collision follows who currently holds the address

- **GIVEN** Relist Save moved slug `umbreon-v-alt` from an Unsold listing onto
  a new draft, and a second unrelated draft
- **WHEN** an operator sets the second draft's slug to `umbreon-v-alt` and
  saves
- **THEN** Grade10 refuses the write because the Relist draft holds that slug
- **AND** when the Relist draft instead holds a different slug, Save of
  `umbreon-v-alt` on the second draft is accepted and the Unsold source still
  does not hold it

### Requirement: A saved draft receives an editable generated slug

The listing editor gives an operator a distinct starting address without
overwriting an address they chose.

- **Generated value** - On a draft's first successful Save, Grade10 SHALL
  normalize its title with Unicode normalization, lower-casing,
  transliteration where available, replacement of non-alphanumeric runs with
  one hyphen, hyphen collapse, and trim. It SHALL append one hyphen and the
  lower-case listing code. Before appending, Grade10 SHALL truncate the title
  portion so the complete slug is at most 64 characters. When normalization
  yields no title words, it SHALL use `lot` as the title portion. When the
  Save carries a non-empty form slug, including a Relist Save that keeps or
  replaces the Unsold source's slug, Grade10 SHALL store that form slug and
  SHALL NOT replace it with the generated value.
- **Title edits** - When a later title edit occurs while the stored slug equals
  the immediately preceding generated value, Grade10 SHALL replace only its
  title portion and retain the same lower-case code suffix. It SHALL NOT
  replace a slug an operator changed.
- **Field exit** - When an operator leaves the Slug field, Grade10 SHALL check
  the selected value against the same reservation rule enforced on Save and
  report whether it is available. The helper text SHALL state: `Slug must be
  unique. Completed, expired, and unsold listings also reserve their
  addresses.` The check SHALL NOT disclose another listing's private details.
  For an unsaved Relist editor, the Unsold source's current slug SHALL report
  as available to that Relist draft.
- **Authoritative save** - Save SHALL remain authoritative. If another listing
  claims a slug after an available field-exit check, Grade10 SHALL refuse the
  Save and leave the draft's stored slug unchanged.

<!-- trace:scenario id=g10adm.auction-listing.SC-w4n rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-118 - First saved draft receives a generated slug
**Serves:** grade10-admin-auction-listing-US-73 - Operator starts from a distinct public address

- **GIVEN** an unsaved draft titled `Charizard PSA 10`
- **WHEN** an operator saves it
- **THEN** the draft stores a listing code and slug `charizard-psa-10-<lowercase code>`

<!-- trace:scenario id=g10adm.auction-listing.SC-hi0 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-119 - A title-less saved draft uses the neutral prefix
**Serves:** grade10-admin-auction-listing-US-73 - Operator can save an unfinished listing without losing a valid address

- **GIVEN** an unsaved draft with no title
- **WHEN** an operator saves it
- **THEN** the draft stores slug `lot-<lowercase code>`

<!-- trace:scenario id=g10adm.auction-listing.SC-7ew rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-120 - A title edit refreshes an untouched generated slug
**Serves:** grade10-admin-auction-listing-US-73 - Operator keeps the generated address aligned with the title while drafting

- **GIVEN** a saved draft whose slug equals its last generated value
- **WHEN** an operator changes its title
- **THEN** the slug's title portion changes and its lower-case code suffix stays the same

<!-- trace:scenario id=g10adm.auction-listing.SC-jow rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-121 - A title edit preserves an operator slug
**Serves:** grade10-admin-auction-listing-US-73 - Operator retains an address they selected

- **GIVEN** a saved draft whose operator changed the generated slug
- **WHEN** the operator changes its title
- **THEN** the slug remains unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-96t rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-122 - Slug field exit reports a retained collision
**Serves:** grade10-admin-auction-listing-US-73 - Operator learns that a chosen address is unavailable before Save

- **GIVEN** a completed, expired, or unsold listing holds the selected slug
- **WHEN** an operator leaves Slug on another draft
- **THEN** the editor reports the slug unavailable, keeps its value for correction, and shows the retained-address note

<!-- trace:scenario id=g10adm.auction-listing.SC-tb7 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-123 - Save rejects a collision after an available check
**Serves:** grade10-admin-auction-listing-US-73 - Operator receives the authoritative collision result when another save races

- **GIVEN** Slug reported available on a draft and another listing later claims that slug
- **WHEN** the operator saves the draft
- **THEN** Grade10 refuses the Save and leaves the draft's stored slug unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-c90 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-215 - Relist field exit treats the source slug as available
**Serves:** grade10-admin-auction-listing-US-73 - the operator learns the transferred address is free for this Relist draft

- **GIVEN** an Unsold listing whose slug is `umbreon-v-alt`, opened by Relist
  with that slug filled in and not yet saved
- **WHEN** the operator leaves Slug with `umbreon-v-alt`
- **THEN** the editor reports available
- **AND** the check does not expose the Unsold listing's private details

<!-- trace:scenario id=g10adm.auction-listing.SC-c83 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-216 - Relist Save does not overwrite a form slug with a generated address
**Serves:** grade10-admin-auction-listing-US-73 - a transferred or chosen address survives first Save

- **GIVEN** an Unsold listing titled `Umbreon V` whose slug is `umbreon-v-alt`,
  opened by Relist
- **WHEN** the operator saves with slug `umbreon-v-alt` still in the form
- **THEN** the new draft stores `umbreon-v-alt`
- **AND** it does not store a title-and-new-code slug built from the new
  listing code
