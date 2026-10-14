## Goals

- An operator writes a listing's title and description in Traditional and
  Simplified Chinese beside the English
- An operator reads each language back on the listing's detail page
- A collector reads the lot in the language the site is in
- An inventory admin writes a product's name and description in each language and reads them back on the product page
- Listings already published read exactly as before until someone adds a text

## Non-Goals

- **Machine translation** - nothing translates for the operator or at read time
- **Other texts** - campaign titles and copy, listing attributes, alt text and
  every product field other than name and description keep their present behaviour
- **Korean** - the ZZZ site does not sell Auction listings; a further language
  is a later change
- **Staff-facing and sent texts** - the Listings table, order and invoice
  screens, emails, push messages and Slack alerts keep the English title
- **The slug and the listing code** - both stay as they are, from the English
  title
- **A collector search** - the site has no auction search; this change adds none
- **A backfill** - no listing or product is translated on the operator's behalf
- **Store pages** - the store's product listing, product page, cart and checkout keep reading the English name and description; they come after this change
- **Shopify** - sync and import never write translations

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which languages? | English plus Traditional Chinese and Simplified Chinese (recommended) | All four shipped languages: Korean has no Auction surface, and each language is an input to fill in |
| Q2 | A Simplified Chinese reader meets a lot with only Traditional Chinese text | English (recommended) | The other Chinese first: readable, but the wrong script for the reader |
| Q3 | How does the Copy block switch language? | One choice for the whole block, title and description together (recommended) | One choice per field: more flexible, and the two can disagree on screen |
| Q4 | What happens to the slug? | Stays as it is (author's call) | A slug per language: addresses diverge and support stops quoting one |
| Q5 | Existing listings | No backfill; a missing text falls back per field to the title and description already on the listing (author's call) | Backfilling every listing: operators have not written the texts |
| Q6 | Which search finds translated titles? | The admin Listings search only matches the English and every translated title, whichever language the operator types in - decided by the requester, because the site has no collector search | A new collector search: a surface of its own, not asked for |
| Q7 | What is required? | The English title, as today; a translation is optional and holds the same limits (title 1 to 200 characters, description up to 4,000) | Requiring all three: blocks a listing on text nobody has |
| Q8 | A translated text that is only spaces | Counts as empty and falls back (decided by the round) | Showing blank: a collector sees an empty title |
| Q9 | Relist | Carries every language (decided by the round) | English only: the operator rewrites two texts for each relist |
| Q10 | Share metadata and page title | Follow the page's language, like the lot page (decided by the round) | English only: a shared link reads in a different language from the page it opens |
| Q11 | Who is quoted in support | The English title and the address, as today (decided by the round) | The collector's language: staff and collector would quote different names for one lot |
| Q12 | A closed or called-off listing | Cannot be rewritten, as its title and description cannot (decided by the round) | Allowing translations after close: reopens the freeze the listing rule sets |
| Q13 | The localization rule | The auction listing exception is added to Localization, **BREAKING** (author's call) | Leaving the rule and treating the listing as its own case: two rules for one question |
| Q14 | Search matching | Part of a title, any case, titles only, no Traditional/Simplified folding (recommended) | Matching descriptions or folding the scripts: finds more, costs a derived column or index |
| Q15 | Copy block defaults | Opens in English, marks each text as the fallback on its own, remembers nothing (recommended) | Remembering the last language per operator: needs storage |
| Q16 | A draft with no English title | A draft may hold a Chinese title with no English one; Create refuses it (recommended) | Requiring English always: a draft cannot start from a Chinese title |
| Q17 | Padding and limits | Titles are trimmed on save; the 200 and 4,000 limits count the characters as typed (author's call) | Counting after trimming: the limit differs from what the operator sees |
| Q18 | Who writes a translation | Anyone who edits the listing's title and description today; no new permission (author's call) | A separate grant: a role to manage for one field |
| Q19 | Other surfaces | Featured, My Auctions, the watchlist, the account record, winner order pages and gallery alt text keep the English title (recommended) | Including Featured and My Auctions: more screens and tests for this change |
| Q20 | Support reference | Nothing new: a collector quotes the address, which is the same in every language, and staff find the lot by it and the English title (author's call) | A reference shown on a Chinese page: a new field nobody asked for |
| Q21 | Edit freshness | An edit reaches a collector the next time the page loads; an open page is not pushed (author's call) | Pushing the edit to open pages: a live channel for a rare edit |
| Q22 | A frozen listing's editor | A closed, settled or called-off listing shows no edit controls for translations, like its other fields (author's call) | Read-only inputs: controls that cannot be used |
| Q23 | Design | No `ui-design.md`; the Copy block's language control is the one described in the request, a row of three buttons labelled EN, 繁中 and 简中 on the auction page, like the customer view, and a Select on the product page (author's call; the human confirmed the buttons, see Q49) | A designer's pass: nothing new to draw |
| Q24 | Purpose in each delta | Composed from the durable Purpose plus one sentence, never replacing it (author's call) | A one-line Purpose: it would erase the durable one at archive |
| Q25 | Domain run | The admin Auction domain suite gets a run for the path operator writes, collector reads, staff references stay English (author's call) | No run: no case walks the cross-product path |
| Q26 | Inventory product name and description | Folded into this change and re-planned together (author's call) | A separate change: a second planning run for the same pattern |
| Q27 | Inventory scope | The inventory product editor and the Details section of the product page take a name and a description in each language; the storefront reads them later, since no auction page shows a product's name or description and the store pages come after this change (author's call; confirmed by the human) | Rendering the translated product on the store pages now: not asked for in this round |
| Q28 | Imports | A catalogue upload or edit by import never overwrites or clears a translation; Shopify is out of scope (author's call) | Imports carrying translations: a column format nobody asked for |
| Q29 | Product search | The inventory product search matches the English name and every translated name, like the Listings search (author's call) | English only: an operator cannot find a product by the name a colleague quotes |
| Q30 | Product facts | Only name and description translate; grade, Cert ID, set and other typed values stay as they are (author's call) | Translating the product's facts: a schema change of its own |
| Q31 | Product required text | The English name is required and an English description may be empty, as today; translations are optional and hold the same limits (name 1 to 200, description up to 2,000 characters after trimming; the English description keeps its present no-limit rule) (decided by the round) | Requiring all languages: blocks a product on text nobody has |
| Q32 | A Chinese listing description with an empty English one | Allowed; only the English title is required. The Copy block shows the Chinese text in its language, and a language with no text over an empty English one shows an empty text, not marked as a fallback (human, defaults) | Requiring an English description first: blocks a text nobody has |
| Q33 | A frozen listing's Copy block | The language choice still switches for reading; decision 22 removes edit controls only (human, defaults) | Locking the switch: a closed lot could not be read in each language |
| Q34 | A long Chinese title on the card | The card keeps its present two-line clamp; no new rule (human, defaults) | A new truncation rule: a design change nobody asked for |
| Q35 | Who owns the English-title check | `grade10-site/auction/listing-page` owns it (`grade10-site-auction-listing-page-SC-69`); the admin requirement keeps staff texts (human, defaults) | The admin capability: it does not draw the collector's pages |
| Q36 | Who writes a product translation | Whoever may update a product's name and description today; no new permission (human, defaults) | A separate grant: a role to manage for one field |
| Q37 | Product name counting | A product name is trimmed on save, then counted 1 to 200, as the English name is today; this differs from a listing title's typed count (human, defaults) | Counting as typed: the translation would differ from the English name |
| Q38 | A Chinese product description with an empty English one | As decision 32: the Details section shows the Chinese text in its language and an empty text, unmarked, elsewhere (human, defaults) | Requiring English first |
| Q39 | Auction `productSearch` | Stays on the English name; the store pages and any later reader come after this change (human, defaults) | Matching translated names in a public procedure no screen calls |
| Q40 | Namesake warning and import name match | English name only (human, defaults) | Matching translated names: a duplicate rule decided by the plan |
| Q41 | Labs seeding | Every admin Labs listing seed (standalone fixtures, draft, live and winner lots, the test stage, the campaign pair) fills Traditional and Simplified Chinese title and description on the listing and name and description on the product, and gives the product an English description; a recovered product is not rewritten; a lot with a generated title gets a translated prefix and generic copy (the human asked) | Seeding English only: nobody could see a translated lot in a lab |
| Q42 | Customer view languages | The shared customer view, the editor's and record's preview of the lot page, offers EN, 繁中 and 简中 on both the desktop and the phone frame; the lot page title follows the choice, falls back to the English title, never shows the other Chinese, and image alt text stays English (the human asked) | Previewing English only: the operator cannot check what a Chinese collector reads |
| Q43 | Customer view description | The customer view draws no description: its lot-page block needs shipping copy and badges, so the description is not shown (the human asked; the human confirmed the preview omits it) | Drawing the description: a new block nobody designed |
| Q44 | Found while building: product description cap | A product's translated description is trimmed and capped at 2,000 characters, not unlimited; Q31 is corrected (found while building) | No cap: an unbounded jsonb text |
| Q45 | Found while building: product name codec | A translated product name uses `text(200)`: trimmed, at most 200, a blank allowed and then dropped, not the `label` codec that refuses a blank (found while building) | `label`: a blank translation would be refused instead of ignored |
| Q46 | Found while building: types | The inventory backend has its own `Product` type in `src/contracts/schemas.ts` and the admin clients `AuctionAdminProcedureClient.ts` and `InventoryAdminProcedureClient.ts` are hand-written, so each needs `translations`, and the published-lot save payload needs it too (found while building) | Assuming the shared contract flows through |
| Q47 | Found while building: admin labels | The admin panels have no locale catalogs, so their labels are English literals (found while building) | Catalog keys in every admin locale |
| Q48 | Found while building: Storybook | The workspace Storybook was removed on main (edb53902), so the plan has no story tasks (found while building) | Updating stories |
| Q49 | Found while building: language control | The console Select fails the 44px phone touch-target check, so the auction Copy block uses the segmented ChoiceList labelled EN, 繁中 and 简中 like the customer view's strip, and the inventory Details section uses a Select labelled Language (found while building; the human confirmed the three buttons) | A Select on the auction page |
| Q50 | Found while building: storefront | The locale is passed down from the views, not read with `useLocale()`; a language pick can poison the cache, so the lot page seeds its query only when the loader's locale matches; a page already open keeps its text against pushed frames but a page that re-reads (every 15 s without a live line) shows an edit; the card's video aria-label also uses the English title (found while building) | Reading the locale in the hook |
| Q51 | Found while building: locale input | The public `locale` input is a strict `en`, `zh-Hant`, `zh-Hans` literal and the storefront maps any other page language to `en` (found while building) | Accepting any string |
| Q52 | Found while building: bundle fence | `scripts/lib/bundle-fence.mjs` must allow `zh-Hans` for the admin console (found while building) | Leaving the fence |
| Q53 | Found while building: product update | `updateProduct` without a classification is not one transaction, but the router always sends the classification, so the write is atomic in practice (found while building) | Reworking the service |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-admin/auction/listing | Are the 200 and 4,000 limits on a translation also enforced at the API, as create's requirements are, or only on the form? | Q7 |
| grade10-admin/auction/listing | May a Traditional or Simplified Chinese description be written while the English description is empty, and what does the Copy block show for that language then? | Q32 |
| grade10-admin/auction/listing | After a whitespace-only translation is saved, does the form reopen the field empty, or as typed? The input says only that it counts as not written. | Q8 |
| grade10-admin/auction/listing | Does a character outside the basic plane (an emoji, a rare Chinese character) count as one character or two against the 200 and 4,000 limits? | Q17 |
| grade10-admin/auction/listing | Does a closed, settled or called-off listing's Copy block still switch between languages for reading? Decision 22 removes the edit controls and is silent on the switch. | Q33 |
| grade10-admin/auction/listing | Does the Listings search match an English fragment exactly as it does today (title, listing code, slug), with only translated titles added? | Q14 |
| grade10-site/auction/listing-page | Do the structured data and any Twitter card tags follow the page's language like the page title, meta description and Open Graph tags? Decision 10 names only those four. | Q10 |
| grade10-site/auction/listing-page | Does the breadcrumb's last item and the lot's image alt text read the English title or the page's language? Decision 19 puts gallery alt text on the English title and is silent on the breadcrumb. | Q19 |
| grade10-site/auction/listing-page | How does the card treat a 200-character Chinese title, which has no spaces to wrap on? The PRD states truncation only for the Featured slide. | Q34 |
| grade10-site/auction/listing-page | Does decision 21 (an edit reaches a collector the next time the page loads) bind cached pages and shared-link previews, or only a fresh load? The PRD allows a stale cached preview. | Q21 |
| grade10-site/auction/listing-page | Which capability owns the check that Featured, My Auctions, the watchlist, the account record and winner order pages keep the English title (decision 19)? No feature-set line of this capability names them; case g10.shared-localization.US1-TC4 holds it for now. | Q35 |
| grade10-site/auction/listing-page | What does the collector see of 'Reference stays English' on a Chinese page? The English title is never on screen unless it is the fallback, so the case checks the address only. | Q20 |
| shared/localization | The exception reads 'an auction listing's title and description render in the page's language', which a literal reader applies wherever a listing is named; decision 19 keeps six surfaces on the English title. Should the rule's wording name the card, the lot page and its share metadata? | Q13 |
| shared/localization | Do the emails, push messages and Slack alerts that name a lot keep the English title while their other copy follows the collector's language? Decision 19's non-goal says the English title stays; the copy language is not stated. | Q19 |
| grade10-admin/inventory/catalog | What is the product description limit that 'up to what the product holds today' refers to? The description boundary case waits on a number. | Q31 |
| grade10-admin/inventory/catalog | Who may write a product's translations? Decision 18 settles the listing's grant and names no product grant. | Q36 |
| grade10-admin/inventory/catalog | Does the product search match descriptions? Decision 29 names names only and the listing search is titles only (decision 14). | Q29 |
| grade10-admin/inventory/catalog | Do product names count the characters as typed (decision 17 for listings) or after trimming, and is a translated name trimmed on save? | Q37 |
| grade10-admin/inventory/catalog | What may a catalogue upload change on a product it resolves to, given that import resolution uses the English name, taxonomy and typed values? The case checks a matching row leaves translations alone. | Q28 |
| grade10-admin/inventory/catalog | When the English description is empty and a Chinese description is written, does the Details section show the Chinese text in its language and an empty English one as fallback? | Q38 |
| grade10-admin/inventory/catalog | Does Auction's public `productSearch` (the inventory `searchAuctionProducts` read) also match translated names, or only the admin product list? Decision 29 names "the inventory product search"; the tech design leaves `searchAuctionProducts` on the English name (recommended). | Q39 |
| grade10-admin/inventory/catalog | Does the editor's namesake warning, and the English-name match an import resolves by, consider translated names? The tech design keeps both on the English name (recommended). | Q40 |
