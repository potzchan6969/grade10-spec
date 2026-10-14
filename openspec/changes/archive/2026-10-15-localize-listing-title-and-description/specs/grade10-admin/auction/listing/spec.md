# grade10-admin/auction/listing — delta

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

- Texts in each language
  - Entered per language: the create and edit forms take a title and a description in English, Traditional Chinese and Simplified Chinese
  - English is the base: only the English title is required, and a translation holds the same limits
  - Empty translation: a blank or whitespace-only translation counts as not written
  - Frozen with the listing: a closed or called-off listing cannot have a translation written
- Reading the Copy block
  - One language choice: a single choice switches the title and the description together
  - Fallback marked: a language with no text shows the English text, marked as the fallback
- What staff quote
  - English title stays: the slug, the listing code, the Listings table and every staff reference stay on the English title
- Listings search
  - Translated titles: the search matches the English title and every translated title, in whichever language the operator types
- Relist
  - Every language carried: a relist draft opens with all three texts

## ADDED Requirements

### Requirement: An operator writes a listing's title and description in each language

While a listing is `draft`, `created` or `published`, an authorized operator
SHALL be able to write, beside the English title and copy, a title and a
description in Traditional Chinese (`zh-Hant`) and in Simplified Chinese
(`zh-Hans`), on the create and edit forms. Only the English title is required,
as before. A translation is optional and holds the limits of the English text:
a title of 1 to 200 characters and a description of up to 4,000, counted as
typed. A title is trimmed on save. A translated title or description that is
empty or only spaces counts as not written and is stored as none.

An update that omits the translations SHALL leave every stored one unchanged;
one that names them SHALL replace all of them, so a language the operator
cleared is stored as none. A draft MAY hold a translated title with no English
title; Create SHALL refuse it exactly as it refuses a missing English title.
Whoever may edit a listing's title and description today may write the
translations; no new permission exists.

<!-- trace:scenario id=g10adm.auction-listing.SC-eo6 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-170 - An operator writes a title and description in each language
**Serves:** grade10-admin-auction-listing-US-75 - Operator writes a listing's title and description in each language

- **GIVEN** a draft with an English title and an English description
- **WHEN** an authorized operator saves a Traditional Chinese and a Simplified Chinese title and description
- **THEN** Grade10 stores all three titles and all three descriptions
- **AND** the English title and description are unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-ze7 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-171 - A listing is created with no translation
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a draft with an English title and every other required field, and no translated text
- **WHEN** an authorized operator creates it
- **THEN** Grade10 creates the listing
- **AND** it reads in every language exactly as it did before translations existed

<!-- trace:scenario id=g10adm.auction-listing.SC-56a rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-172 - A translation holds the limits of the English text
**Serves:** grade10-admin-auction-listing-US-75 - Operator writes a listing's title and description in each language

- **GIVEN** a draft
- **WHEN** an operator saves a Traditional Chinese title of 201 characters
- **THEN** Grade10 refuses the save and stores no translation
- **WHEN** they save a Simplified Chinese description of 4,001 characters
- **THEN** Grade10 refuses the save and stores no translation
- **WHEN** they save a title of 200 characters and a description of 4,000 characters in either language
- **THEN** Grade10 stores both

<!-- trace:scenario id=g10adm.auction-listing.SC-gg1 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-173 - A translated title is trimmed and the limit counts what was typed
**Serves:** grade10-admin-auction-listing-US-75 - Operator writes a listing's title and description in each language

- **GIVEN** a draft
- **WHEN** an operator saves a Traditional Chinese title with a space before and after its text
- **THEN** Grade10 stores the title without the spaces
- **WHEN** they save a title of 200 characters with a space before and after it
- **THEN** Grade10 refuses the save, because 202 characters were typed

<!-- trace:scenario id=g10adm.auction-listing.SC-i3e rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-174 - A blank translation counts as not written
**Serves:** grade10-admin-auction-listing-US-75 - Operator writes a listing's title and description in each language

- **GIVEN** a draft
- **WHEN** an operator saves a Traditional Chinese title and a Simplified Chinese description made only of spaces
- **THEN** Grade10 stores no Traditional Chinese title and no Simplified Chinese description
- **AND** the listing's Copy block marks both as the English fallback

<!-- trace:scenario id=g10adm.auction-listing.SC-17a rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-175 - A draft may hold a Chinese title and Create needs the English one
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a draft with a Traditional Chinese title and no English title
- **WHEN** an operator saves it
- **THEN** Grade10 stores the draft with the Traditional Chinese title
- **WHEN** they create it with every other required field
- **THEN** Grade10 refuses the create for the missing English title
- **AND** the draft is unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-vyp rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-176 - Saving without translations leaves them
**Serves:** grade10-admin-auction-listing-US-75 - Operator writes a listing's title and description in each language

- **GIVEN** a draft holding a Traditional Chinese title and description
- **WHEN** an operator saves a new English description and names no translations
- **THEN** the English description changes
- **AND** the Traditional Chinese title and description are unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-ap7 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-177 - A save naming translations replaces all of them
**Serves:** grade10-admin-auction-listing-US-75 - Operator writes a listing's title and description in each language

- **GIVEN** a draft holding Traditional Chinese and Simplified Chinese titles
- **WHEN** an operator saves only a Simplified Chinese title
- **THEN** Grade10 stores the Simplified Chinese title and no Traditional Chinese text

<!-- trace:scenario id=g10adm.auction-listing.SC-8ee rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-178 - A published listing's translations can change like its copy
**Serves:** grade10-admin-auction-listing-US-75 - Operator writes a listing's title and description in each language

- **GIVEN** a published listing with an English title and no translation
- **WHEN** an authorized operator writes a Traditional Chinese title and description
- **THEN** Grade10 stores them
- **AND** the English title, prices and window are unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-mku rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-179 - The grant that edits a title writes its translations
**Serves:** grade10-admin-auction-listing-US-75 - Operator writes a listing's title and description in each language

- **GIVEN** an operator who may edit a listing's title and copy, and one who may not
- **WHEN** each saves a Traditional Chinese title on a draft
- **THEN** Grade10 stores the first operator's title
- **AND** refuses the second operator's, storing nothing

<!-- trace:scenario id=g10adm.auction-listing.SC-jyk rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-199 - An operator who cannot edit a listing sees no translation inputs
**Serves:** grade10-admin-auction-listing-US-75 - Operator writes a listing's title and description in each language

- **GIVEN** a draft listing and an operator who may read listings but not edit their title and copy
- **WHEN** they open the listing in the editor
- **THEN** it shows no input for a Traditional Chinese or Simplified Chinese title or description

### Requirement: The Copy block reads a listing's texts in one chosen language

The listing's detail page SHALL show the title and the description of its Copy
block in a language chosen once for the whole block, with three buttons
labelled EN, 繁中 and 简中. The block SHALL open in English and SHALL
remember no choice. Each text SHALL fall back on its own: a field with no text
in the chosen language SHALL show the English text of that field, marked as the
English fallback, and one Chinese SHALL never stand in for the other.

Where the English text is empty and a Chinese text is written, a language with no
text shows an empty text, not marked as a fallback. A closed, settled or
called-off listing's Copy block still switches language for reading.

<!-- trace:scenario id=g10adm.auction-listing.SC-z8j rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-180 - The Copy block opens in English
**Serves:** grade10-admin-auction-listing-US-76 - Operator reads a listing's texts in each language

- **GIVEN** a listing with Traditional Chinese and Simplified Chinese texts
- **WHEN** an operator opens its detail page
- **THEN** the Copy block shows the English title and description

<!-- trace:scenario id=g10adm.auction-listing.SC-0sv rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-181 - One choice switches the title and the description together
**Serves:** grade10-admin-auction-listing-US-76 - Operator reads a listing's texts in each language

- **GIVEN** a listing with a title and a description in each language
- **WHEN** an operator chooses Traditional Chinese for the Copy block
- **THEN** the title and the description both show their Traditional Chinese text
- **AND** the block offers no second choice for either field

<!-- trace:scenario id=g10adm.auction-listing.SC-jiz rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-182 - A language with no text shows the English text marked as the fallback
**Serves:** grade10-admin-auction-listing-US-76 - Operator reads a listing's texts in each language

- **GIVEN** a listing with a Simplified Chinese title and no Simplified Chinese description
- **WHEN** an operator chooses Simplified Chinese
- **THEN** the title shows its Simplified Chinese text with no mark
- **AND** the description shows the English description, marked as the English fallback

<!-- trace:scenario id=g10adm.auction-listing.SC-let rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-183 - The other Chinese is never borrowed
**Serves:** grade10-admin-auction-listing-US-76 - Operator reads a listing's texts in each language

- **GIVEN** a listing with a Traditional Chinese title and no Simplified Chinese text
- **WHEN** an operator chooses Simplified Chinese
- **THEN** the title shows the English title, marked as the English fallback

<!-- trace:scenario id=g10adm.auction-listing.SC-ilx rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-184 - The choice is not remembered
**Serves:** grade10-admin-auction-listing-US-76 - Operator reads a listing's texts in each language

- **GIVEN** an operator who chose Traditional Chinese for a listing's Copy block
- **WHEN** they open that listing's detail page again, or another listing's
- **THEN** the Copy block opens in English

<!-- trace:scenario id=g10adm.auction-listing.SC-mt4 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-197 - A listing nobody translated shows the English text in each Chinese choice
**Serves:** grade10-admin-auction-listing-US-76 - Operator reads a listing's texts in each language

- **GIVEN** a listing with an English title and description and no translation
- **WHEN** an operator chooses Traditional Chinese and then Simplified Chinese for the Copy block
- **THEN** each choice shows the English title and description, each marked as the English fallback


<!-- trace:scenario id=g10adm.auction-listing.SC-lna rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-207 - A language with no text over an empty English text shows an empty text
**Serves:** grade10-admin-auction-listing-US-76 - Operator reads a listing's texts in each language

- **GIVEN** a draft with a Traditional Chinese description and an empty English description
- **WHEN** an operator chooses Traditional Chinese, and then Simplified Chinese, for the Copy block
- **THEN** Traditional Chinese shows its description
- **AND** Simplified Chinese shows an empty description, not marked as a fallback

<!-- trace:scenario id=g10adm.auction-listing.SC-qhj rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-208 - A frozen listing's Copy block still switches language
**Serves:** grade10-admin-auction-listing-US-76 - Operator reads a listing's texts in each language

- **GIVEN** a closed listing and a called-off listing with Traditional Chinese texts
- **WHEN** an operator opens each detail page and chooses Traditional Chinese for the Copy block
- **THEN** the title and the description show their Traditional Chinese text

### Requirement: The Listings search finds a listing by a translated title

The admin Listings search SHALL match a listing whose English title or any
translated title holds the typed term, anywhere in the title and in any case,
whichever language the operator types. It SHALL match titles only: a
description in any language is not searched, and Traditional and Simplified
Chinese are not folded into each other. Every other part of the search is
unchanged, and a listing found by a translated title SHALL show its English
title in the table.

<!-- trace:scenario id=g10adm.auction-listing.SC-6es rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-185 - A translated title finds the listing
**Serves:** grade10-admin-auction-listing-US-77 - Operator finds a listing by a translated title

- **GIVEN** a listing with the Traditional Chinese title "寶可夢 噴火龍" and another with an unrelated title
- **WHEN** an operator searches the Listings table for "噴火龍"
- **THEN** only the first listing is listed
- **AND** its row shows its English title

<!-- trace:scenario id=g10adm.auction-listing.SC-orh rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-186 - A Simplified Chinese title finds the listing
**Serves:** grade10-admin-auction-listing-US-77 - Operator finds a listing by a translated title

- **GIVEN** a listing with the Simplified Chinese title "宝可梦 喷火龙"
- **WHEN** an operator searches for "喷火龙"
- **THEN** that listing is listed

<!-- trace:scenario id=g10adm.auction-listing.SC-1x3 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-187 - The English title still finds the listing
**Serves:** grade10-admin-auction-listing-US-77 - Operator finds a listing by a translated title

- **GIVEN** a listing titled "Charizard 1st Edition" with translated titles
- **WHEN** an operator searches for "charizard"
- **THEN** that listing is listed

<!-- trace:scenario id=g10adm.auction-listing.SC-d0k rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-188 - A part of a translated title in any case matches
**Serves:** grade10-admin-auction-listing-US-77 - Operator finds a listing by a translated title

- **GIVEN** a listing with the Traditional Chinese title "PSA 10 噴火龍"
- **WHEN** an operator searches for "psa 10"
- **THEN** that listing is listed

<!-- trace:scenario id=g10adm.auction-listing.SC-46l rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-189 - A description is not searched
**Serves:** grade10-admin-auction-listing-US-77 - Operator finds a listing by a translated title

- **GIVEN** a listing whose Traditional Chinese description holds "首版" and no title holds it
- **WHEN** an operator searches for "首版"
- **THEN** that listing is not listed

<!-- trace:scenario id=g10adm.auction-listing.SC-4uh rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-190 - The two Chinese scripts are not folded
**Serves:** grade10-admin-auction-listing-US-77 - Operator finds a listing by a translated title

- **GIVEN** a listing whose only Chinese title is the Traditional Chinese "噴火龍"
- **WHEN** an operator searches for the Simplified Chinese spelling "喷火龙"
- **THEN** that listing is not listed

<!-- trace:scenario id=g10adm.auction-listing.SC-eg4 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-191 - A draft with only a Chinese title is found
**Serves:** grade10-admin-auction-listing-US-77 - Operator finds a listing by a translated title

- **GIVEN** a draft with a Traditional Chinese title and no English title
- **WHEN** an operator searches for part of that title
- **THEN** the draft is listed

<!-- trace:scenario id=g10adm.auction-listing.SC-12q rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-198 - An edit or a clear moves what the search finds
**Serves:** grade10-admin-auction-listing-US-77 - Operator finds a listing by a translated title

- **GIVEN** a listing found by its Traditional Chinese title "噴火龍"
- **WHEN** an operator changes that title to "水箭龜" and searches for each
- **THEN** only "水箭龜" finds the listing
- **WHEN** they clear the translated title and search for "水箭龜"
- **THEN** the listing is not listed

### Requirement: What staff quote stays on the English title

A translation SHALL change no text staff read or the platform sends. The slug,
the listing code, the Listings table, the order and invoice screens, emails,
push messages and Slack alerts and the gallery alt text SHALL keep the English
title. The collector-side surfaces that keep it are owned by
`grade10-site/auction/listing-page`. A collector quotes the listing's address,
which is the same in every language.

<!-- trace:scenario id=g10adm.auction-listing.SC-55h rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-192 - Translations leave the slug and the code alone
**Serves:** What staff quote - English title stays

- **GIVEN** a saved draft with an English title, a generated slug and a listing code
- **WHEN** an operator writes Traditional Chinese and Simplified Chinese titles
- **THEN** the slug and the listing code are unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-71p rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-193 - Staff and sent texts keep the English title
**Serves:** What staff quote - English title stays

- **GIVEN** a listing with a Traditional Chinese title that closes with a winner
- **WHEN** the Listings table, the winner's order and invoice screens, the won email and the Slack alert show the lot
- **THEN** each names the lot by its English title

### Requirement: Labs listing seeds are written in every language

Every listing the admin Labs seeds (the standalone fixtures, the draft, live
and winner lots, the test stage and the campaign pair) SHALL carry a
Traditional Chinese and a Simplified Chinese title and description, and its
product a name and a description in both, with an English description. A
product an earlier seed recovered is not rewritten. A lot whose title is
generated gets a translated prefix and generic copy.

<!-- trace:scenario id=g10adm.auction-listing.SC-q52 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-200 - A seeded lot carries every language
**Serves:** grade10-admin-auction-listing-US-75 - Operator writes a listing's title and description in each language

- **GIVEN** the Labs
- **WHEN** a developer seeds a standalone fixture, a draft, a live lot, a winner lot, the test stage and a campaign pair
- **THEN** each listing has a Traditional Chinese and a Simplified Chinese title and description
- **AND** each new product has a name and a description in both, and an English description

<!-- trace:scenario id=g10adm.auction-listing.SC-pnv rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-201 - A recovered product is not rewritten
**Serves:** grade10-admin-auction-listing-US-75 - Operator writes a listing's title and description in each language

- **GIVEN** a product an earlier seed left behind with its own texts
- **WHEN** a developer seeds a lot that recovers it
- **THEN** the product's name, description and translations are as they were

<!-- trace:scenario id=g10adm.auction-listing.SC-53a rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-202 - A generated title is translated by prefix
**Serves:** grade10-admin-auction-listing-US-75 - Operator writes a listing's title and description in each language

- **GIVEN** a Labs lot whose English title is generated
- **WHEN** it is seeded
- **THEN** its Traditional Chinese and Simplified Chinese titles carry a translated prefix
- **AND** its descriptions are generic copy in each language

### Requirement: The customer view previews the lot in each language

The customer view, the preview of the lot page in a listing's editor and
record, SHALL offer English, Traditional Chinese and Simplified Chinese on both
its desktop and its phone frame. The lot page title SHALL follow the chosen
language and fall back to the English title; one Chinese SHALL never stand in
for the other. Image alt text stays on the English title. The view draws no
description.

<!-- trace:scenario id=g10adm.auction-listing.SC-xiv rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-203 - The customer view offers three languages on both frames
**Serves:** grade10-admin-auction-listing-US-76 - Operator reads a listing's texts in each language

- **GIVEN** a listing's customer view
- **WHEN** an operator opens the desktop frame and then the phone frame
- **THEN** each offers EN, 繁中 and 简中

<!-- trace:scenario id=g10adm.auction-listing.SC-de8 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-204 - The lot page title follows the chosen language
**Serves:** grade10-admin-auction-listing-US-76 - Operator reads a listing's texts in each language

- **GIVEN** a listing with Traditional Chinese and Simplified Chinese titles
- **WHEN** an operator chooses 繁中 and then 简中
- **THEN** the lot page title shows that language's title each time

<!-- trace:scenario id=g10adm.auction-listing.SC-l45 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-205 - The customer view falls back to English and never borrows the other Chinese
**Serves:** grade10-admin-auction-listing-US-76 - Operator reads a listing's texts in each language

- **GIVEN** a listing with a Traditional Chinese title and no Simplified Chinese title
- **WHEN** an operator chooses 简中
- **THEN** the lot page title shows the English title

<!-- trace:scenario id=g10adm.auction-listing.SC-mid rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-206 - The customer view keeps English alt text and draws no description
**Serves:** grade10-admin-auction-listing-US-76 - Operator reads a listing's texts in each language

- **GIVEN** a listing with translated titles, descriptions and an image
- **WHEN** an operator chooses 繁中 in the customer view
- **THEN** the image's alt text is the English title
- **AND** the view shows no description

## MODIFIED Requirements

### Requirement: A closed listing cannot be rewritten here

A listing in `closed`, `settled`, or `canceled` SHALL reject every catalogue,
translation, price, window, sandbox, publish at, and media write from this form. Its facts
are the record of what was offered and sold. Its editor SHALL show no control
to write a translation, like its other fields.

<!-- trace:scenario id=g10adm.auction-listing.SC-ztg rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-45 - Closed listing rejects a title edit
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a closed listing
- **WHEN** an operator changes its title
- **THEN** Grade10 refuses the write
- **AND** the title is unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-21e rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-194 - Closed listing rejects a translation
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a closed listing and a called-off listing
- **WHEN** an operator writes a Traditional Chinese title on each
- **THEN** Grade10 refuses both writes
- **AND** each listing's translations are unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-kzb rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-195 - A frozen listing's editor offers no translation inputs
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a closed listing, a settled listing and a called-off listing
- **WHEN** an operator opens each in the listing editor
- **THEN** none shows an input for a Traditional Chinese or Simplified Chinese title or description

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
   starting price, currency and gallery.
2. The editor SHALL start with no slug, listing code or window; every other
   field SHALL start as on any new draft.
3. Nothing SHALL be stored and no stock SHALL be held until the operator saves.
   Relist activated again SHALL open another unsaved editor.
4. Save SHALL be an ordinary draft save that records which listing it was
   relisted from, and the Unsold listing SHALL NOT change.

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
quantity, SHALL apply as well.

<!-- trace:scenario id=g10adm.auction-listing.SC-4ez rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-135 - Relist opens the editor with the lot filled in
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing in no campaign whose stock was released, with a
  product, a Cert ID choice, quantity three, a title, copy, a starting price, a
  currency and a two-item gallery
- **WHEN** an operator holding `auction:operate` activates Relist on its row in
  the Listings table
- **THEN** the editor shows the same product, Cert ID choice, quantity, title,
  copy, starting price, currency and both gallery items
- **AND** it has no window, slug or listing code yet

<!-- trace:scenario id=g10adm.auction-listing.SC-lc6 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-136 - Relist stores nothing until Save
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** the editor opened by Relist on a listing of a product with
  available five and quantity three
- **WHEN** the operator leaves without saving
- **THEN** no listing is stored and available is unchanged
- **AND** when the operator instead saves, a new draft holds three units,
  available falls by three and the Unsold listing is unchanged

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
