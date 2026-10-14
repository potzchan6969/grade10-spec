## Context

Motivation is in [proposal.md](proposal.md); the settled answers are in
[decisions.md](decisions.md). Facts read from `grade10` that the design rests on:

- **Auction text** - `auction.auction_listings.title` (nullable text) and `copy`
  (`NOT NULL DEFAULT ''`) are the English title and description
  (`packages/grade10-auction/backend/src/db/schema/listings.ts`). Both are
  written in two places under the listing lock: `saveListing`
  (`services/listings/draft.ts`, insert and update, gated by `editRefusal`,
  which refuses `closed`, `settled`, `canceled` and a lot past its close as
  `NOT_EDITABLE`) and `createListing` (`services/listings/schedule.ts`).
  `listings.save` checks `title` at 200 and `copy` at 4,000 characters on the
  raw string and the service then trims the title; `listings.create` takes
  `title` as `label`, which trims and then counts. Decision 17 is met by `save`
  today and not by `create`; translations use the raw-string check in both (D3)
- **Auction reads** - `publicListingState` (`services/listings/publicState.ts`)
  builds the lot page, `SUMMARY_COLUMNS` and the mapping in
  `repositories/listings.ts` build the card, `readPublicAuctionDetail` the
  campaign's cards. The public tRPC procedures `listing`, `listings` and
  `auction` (`trpc/routers/public.ts`) take no locale. The same state is read by
  watches, the `AuctionService` RPC, Featured, orders, email and Slack, none of
  which pass a locale. Live frames (`contracts/src/live.ts`) carry no title or
  copy. `PUBLIC_READ_CACHE` is defined and used nowhere, and the public
  procedures are not in the `cached` tier, so no cache holds these reads today
- **Admin search** - `listingSearch` (`repositories/listings.ts`) ORs
  `ilike(title)`, slug, listing code prefix, Cert number prefix and, with an `@`,
  a counted bidder's email, through `likeContains` from
  `@grade10/postgres/like`
- **Relist** - `readRelistSource` (`services/listings/relist.ts`) reads and
  copies the gallery only. Title and copy reach the new draft through the
  editor: `NewListing.tsx` reads the source with `useAdminListing`, and
  `listingForm.ts` fills the form from `relistSource`
- **Admin screens** - the Copy block is the `OverviewBlock title="Copy"` in
  `ListingOverview.tsx`; the title and description inputs are the `copy`
  `EditorPanel` in `ListingEditor.tsx`, read-only once `ended`
- **Storefront** - the lot route loader (`apps/frontend/grade10/src/routes/auction-listing.tsx`)
  calls `readListing(slug)` with no locale. The root loader decides the locale
  from the address (`prefixedLocale`; every surface with variants is the
  default when unprefixed), and `localeOfMatches` hands it to `meta`.
  `listingIdentity(listing, locale)` in `surfaceHead.ts` builds the page title,
  meta description and Open Graph tags from `listing.title` and `listing.copy`,
  and falls back to a catalog sentence naming the title when the copy is blank.
  `useListing` keys its query by `listingKeys.detail(slug)` and seeds it from
  the loader's read
- **Inventory text** - `inventory.products.name` (`NOT NULL`) and
  `description` (`NOT NULL DEFAULT ''`) (`packages/inventory/backend/src/db/schema/products.ts`).
  `createProduct`/`createProductRecord` and `updateProduct` in
  `services/productService.ts` write them (name trimmed, 1 to 200; description
  trimmed, no cap); `updateProduct` patches only the fields named. The product
  editor is `ProductCreator.tsx` and the Details section is
  `record/DetailsTab.tsx`
- **Product search** - `matching` in `repositories/products.ts` backs the admin
  list's `q`: an `ilike` on `name`, a text attribute value, or a Cert ID prefix.
  `searchAuctionProducts` (`services/productService.ts`) is a second, separate
  `ilike` on `name` that Auction's `productSearch` procedure calls
- **Imports** - the catalogue import reaches `products` only through
  `createProductRecord` (`catalogImportService.ts`) and matches existing
  products by `products.name`; nothing in it updates a product row
- **No Auction page shows a product's name or description** - the listing's
  `productDisplay` carries typed attribute fields only, so decision 27 leaves no
  storefront reader to build
- **Precedents** - Appointment keeps `translations jsonb NOT NULL DEFAULT '{}'`
  on services, locations and resources, with a per-text fallback
  (`appointment/contracts/src/localize.ts`: `inLanguage`, `publicService`, and a
  locale tuple that names only the translated locales). Inventory attribute
  labels already use the `en`/`zh-Hant`/`zh-Hans` triple. Loyalty uses
  `name_zh_hant` columns

## Goals / Non-Goals

**Goals:**

- One locale-text mechanism, shared by Auction and Inventory, that a third
  language or a third translated field extends without a new rule
- Base columns, and every reader that does not name a locale, keep behaving as
  they do today

**Non-Goals:**

- Anything the proposal and decisions rule out: store pages, Shopify, other
  fields, other languages, a backfill, machine translation
- Edge caching for the public auction reads

## Decisions

The specs own behaviour; these rows are how it lands.

| # | Decision | Instead of |
| --- | --- | --- |
| D1 | **Storage** - one `translations jsonb NOT NULL DEFAULT '{}'` on `auction.auction_listings` and on `inventory.products`, keyed by locale then field (`{"zh-Hant": {"title": "…", "copy": "…"}}`; products `name`, `description`). Base columns unchanged. The auction key is `copy`, the column's own name | Per-language columns, as Loyalty's `name_zh_hant`: four columns on each table now and a migration per language later. A child table: a join on every read for two fields. Appointment already stores `translations` this way |
| D2 | **One shared module** - `packages/utils/src/localizedText.ts`, exported as `@grade10/utils/localized-text`: `TEXT_TRANSLATION_LOCALES = ["zh-Hant", "zh-Hans"]`, `textIn(base, translations, locale, field)` (a non-blank translation of exactly that locale, else the base; an unknown locale is the base; one Chinese never answers for the other), `isWritten(text)`, `cleanTranslations(input, { trimmed })` (trim the named fields, drop blank fields and empty locales) and `translationsSchema(fields)` for the two contracts. React-free and pure, so a route loader, a service and a form all import it | A copy in each product's contracts: the two would drift on the blank rule. `@grade10/i18n`: that package is the platform's catalogs, not operator text |
| D3 | **Writes** - `translations` is optional on `listings.save`, `listings.create`, `products.create` and `products.update`. Omitted leaves the stored object alone; named replaces it whole, after `cleanTranslations`. A listing's translated title and description use the raw-string check (200 and 4,000) in both `save` and `create`, so the limit counts what was typed (decision 17); the English `create` title keeps its own `label` codec. A product's translated name uses `text(200)`: trimmed, at most 200, a blank allowed and then dropped by `cleanTranslations` (Q45); its translated description is trimmed and capped at 2,000 characters (Q44), while the English description keeps no limit. An unknown locale key is dropped at decode | A per-locale patch: a second merge rule, and a cleared language would need a tombstone |
| D4 | **Atomicity** - `translations` is written in the same `INSERT`/`UPDATE` as `title` and `copy` (listing: under `withListingLock`, behind `editRefusal`; product: in the same `updateProduct` transaction that writes the changelog). `editRefusal` also refuses a lot past its close, so "published" in the requirements means published and not yet closed. Nothing else is owed, so no due row; the save's existing `listingPurgeTags` purge covers it. Frozen listings need no new gate: `NOT_EDITABLE` refuses the whole save | A separate translations write: base and translations could disagree after a fault |
| D5 | **Public reads resolve on the server** - `publicRouter.listing`, `listings` and `auction` take an optional `locale` (`en`, `zh-Hant`, `zh-Hans`; default `en`) and return today's shapes with `title`/`copy` already resolved. `publicListingState` and the summary projection take `locale?`; the translations never leave the service on a public wire. The public listing state and the card also carry `englishTitle`, the stored English title, because gallery and card image alt text (`listingLotGalleryImages.ts`, `ListingCatalogueCard.tsx`) fall back to the title and decision 19 keeps alt text on the English one. Every other caller passes none and gets English, so decisions 11 and 19 hold structurally | Shipping `translations` to the client and resolving there: three languages on every payload, and every consumer, the head included, must remember to resolve. The same shape as Appointment's `publicService(service, locale)` |
| D6 | **Where the locale comes from** - the lot route loader reads `localeFromAddress(requestedAddress(pathname))`, which is what the root loader answers for any surface with variants, and passes it to `readListing(slug, locale)`. In the browser the views pass the locale down to the hooks; the hooks do not read `useLocale()` (Q50). The lot page seeds its query from the loader only when the loader's locale equals the page's, because a language pick can otherwise put one language's text under another's key. Query keys gain it: `listingKeys.detail(slug, locale)` and the catalogue's keys, so a switch of language never serves another language's cached text, and the loader's seed and the hook share a key. The head needs no new code: `listingIdentity` already receives the locale and reads the resolved `title` and `copy`, with its blank-copy sentence naming the resolved title | A cookie read on the server: the address already says the language, and a document must be one set of bytes per address |
| D7 | **Cache keys** - nothing caches these reads today (D5's context). The lot document is rendered per request at an address whose prefix is the locale, and the lot render sets no cache directive of its own, so the URL is already the key. Were a cache put in front of the public procedures, `locale` is a three-valued input and so a bounded part of the key. The query-key change in D6 is the only key work | Adding an edge cache here: not asked for, and an edit shows on the next load either way (decision 21) |
| D8 | **Search** - `translatedTextContains(column, field, term)` in `@grade10/postgres/like` returns an `OR` of `ilike(column #>> '{<locale>,<field>}', likeContains(term))` over `TEXT_TRANSLATION_LOCALES`. `listingSearch` adds it for `title`; `matching` in `repositories/products.ts` adds it for `name`. No index: the existing title arm is an unindexed `ilike` too, and decision 14 rules out a derived column or index. Descriptions are not searched and the scripts are not folded because the helper is given the one field and compares text as stored. Both searches call one helper so they cannot drift | A GIN or trigram index, or folding Traditional into Simplified: a derived column nobody asked for (decision 14) |
| D9 | **Auction `productSearch` stays English** - `searchAuctionProducts` is not changed (decision 39). It is a `publicProcedure` that returns the English `products.name` and no grade10 frontend calls it; a later change that gives it a reader is named in the proposal's Follow-on changes | Changing it silently: a public matching rule decided by the plan |
| D10 | **Relist** - no backend change. `AdminListing` gains `translations`, `listingForm.ts` fills the form's translations from `relistSource`, and the draft's `save` stores them. A language the source left empty stays empty | Copying on the server inside `readRelistSource`: the editor, not the server, builds the new draft today |
| D11 | **Admin read** - `adminListingSchema` and the admin product read expose `translations` (staff only). The Copy block's language is `useState` in `ListingOverview`, initialised to `en`, drawn as the segmented `ChoiceList` (EN, Traditional Chinese, Simplified Chinese) because the console `Select` fails the 44px phone touch target; the inventory Details section uses a `Select` labelled Language (Q49). Admin labels are English literals, as the admin panels have no locale catalogs (Q47), using `textIn` and `isWritten` to render the text and the fallback mark; nothing is stored (decision 15). `ListingEditor` and `listingForm` add the Traditional and Simplified Chinese title and description inputs in the existing `copy` panel and render none when `readOnly` (decision 22) | A server-side "view as language" read: the admin already holds all three texts |
| D12 | **Imports leave translations structurally** - the import path inserts through `createProductRecord` with no `translations` (the column defaults to `{}`), and never updates a product row; `updateProduct` patches `translations` only when the caller names them. A test pins both. Shopify sync is out of scope (decision 28) | A guard in the import that restores translations: there is nothing to restore when nothing writes them |
| D13 | **Product history** - `toProduct` includes `translations`, so the `product-update` changelog's `before`/`after` records a translation edit like any other product field; history lists and holds still print `name` | Excluding translations from the audit record: a change nobody could trace |
| D14 | **Fixtures** - the auction and inventory admin fixture transports (`FixtureInventoryProcedureTransport`, the listing fixtures) carry `translations`, so tests exercise the same shape; there are no stories to update, the workspace Storybook having been removed (Q48) | Fixtures left English-only: the components under test would never see a translation |
| D15 | **Types and clients** - `translations` is added to the inventory backend's own `Product` type (`packages/inventory/backend/src/contracts/schemas.ts`), to the hand-written admin clients `AuctionAdminProcedureClient.ts` and `InventoryAdminProcedureClient.ts`, and to the published-lot save payload (Q46) | Trusting the shared contract to flow into them: the typecheck passes and the field is dropped on the wire |
| D16 | **Labs seeding** - the Labs seeds (`devFixtures/seedDevListing.ts`, `seedDevDraftListing.ts`, `seedDevLiveListing.ts`, `seedDevCreatedCampaign.ts`, `seedDevWinnerFixture.ts`, `labLot.ts` and `devFixtureProduct.ts`) write translations through a table in `devFixtures/fixtureTranslations.ts`. A lot with a generated title gets a translated prefix and generic copy; a product recovered by an earlier seed is not rewritten, and a new product also gets an English description (Q41) | Seeding English only |
| D17 | **Customer view** - the shared `CustomerView` and `StorefrontFrame` in `packages/frontend-console` offer EN, 繁中 and 简中 on the desktop and the phone frame; the listing projection (`listingCustomerView.tsx`, `programme/customer-view/projection.ts`) resolves the lot page title with `textIn`, keeps image alt text on the English title and draws no description (Q42, Q43). `scripts/lib/bundle-fence.mjs` allows `zh-Hans` for the admin console (Q52) | A second preview component for the listing |
| D18 | **Public locale and card** - the public `locale` input is the strict literal `en`, `zh-Hant`, `zh-Hans`, and the storefront maps any other page language to `en` (Q51). The card's image alt text and its video `aria-label` use `englishTitle` (Q50) | Accepting any string |
| D19 | **Product update atomicity** - `updateProduct` without a classification writes outside its transaction, but the `products.update` router always sends the classification, so the translated write and its changelog land together in practice (Q53) | Reworking the service now |

## Database Schema

Both changes add one column and nothing else.

| Table | Column | Type | Null | Default | Authority |
| --- | --- | --- | --- | --- | --- |
| `auction.auction_listings` | `translations` | `jsonb` | no | `'{}'::jsonb` | Operator-written; `title`/`copy` stay authoritative English |
| `inventory.products` | `translations` | `jsonb` | no | `'{}'::jsonb` | Inventory-admin-written; `name`/`description` stay authoritative English |

Shape, typed in each contracts package from `translationsSchema`:

```json
{ "zh-Hant": { "title": "噴火龍 首版", "copy": "…" }, "zh-Hans": { "title": "喷火龙 首版" } }
```

A missing locale, a missing field and a blank string are the same fact (not
written). The write path stores none of the blank ones; the reader (`textIn`)
tolerates all of them, so a hand-edited row cannot show an empty title. Drizzle
declares it as `jsonb("translations").$type<ListingTranslations>().notNull().default({})`.
There is no `CHECK`: `{}` is the default, the wire schema is the one writer's
validation, and Appointment's three `translations` columns carry none.

## Service Interfaces

**`saveListing(args)`** (`services/listings/draft.ts`) - `SaveListingArgs` gains
`translations?: ListingTranslations`. Under `withListingLock`, after
`editRefusal`, the update spreads `{ translations: cleanTranslations(args.translations, { trimmed: ["title"] }) }`
only when `args.translations !== undefined`, in the same `updateListingRow`
that writes `title` and `copy`; the insert branch stores the cleaned object.
Refusals are unchanged (`NOT_EDITABLE`, `INVALID_TITLE`). A translated title
with a blank English title is a draft's legal state (decision 16); the English
title check at `createListing` is the only gate.

```text
in:  { listingId: "lst_1", copy: "Mint.", translations: { "zh-Hant": { title: "  噴火龍 ", copy: "全新" }, "zh-Hans": { title: "   " } } }
row: title "Charizard" (unchanged), copy "Mint.", translations { "zh-Hant": { title: "噴火龍", copy: "全新" } }
out: ok(row)
```

**`createListing(args)`** (`services/listings/schedule.ts`) - the same optional
`translations`, cleaned the same way and written in the update that completes
the draft; `title.trim()` empty still returns `INVALID_TITLE`.

**`publicListingState(db, args, inventory, now)`** - `PublicListingArgs` gains
`locale?: string`. The returned `title` is `textIn(listing.title, listing.translations, locale, "title")`
and `copy` likewise; with no locale it is the stored text. `PublicListingSlugArgs`
and `publicListingStateBySlug` forward it. `listPublicListingsPage` and
`readPublicAuctionDetail` take `locale?` and resolve each card's `title`, with
`translations` added to `SUMMARY_COLUMNS` and dropped from the mapped item.

```text
in:  listing { title "Charizard", copy "Mint.", translations { zh-Hant { title "噴火龍" } } }, locale "zh-Hans"
out: { title "Charizard", copy "Mint." }   // one Chinese never answers for the other
in:  the same, locale "zh-Hant"
out: { title "噴火龍", copy "Mint." }       // per text
```

**`listingSearch(db, q)`** - one more arm, `translatedTextContains(listings.translations, "title", q)`.
Nothing else in the search changes, and the Listings table still prints `listings.title`.

**`createProduct` / `updateProduct`** (`services/productService.ts`) - the same
optional `translations` (`name`, `description`), cleaned with `trimmed: ["name"]`
and written in the insert or in the one patch of `updateProduct`, which already
runs inside the transaction that appends the `product-update` changelog.
`createProductRecord`, which the import calls, is given none.

**Entrypoints** stay adapters: the routers decode, call the service and map the
refusal. The Details language state and the editor inputs are presentation
only; no frontend decides what a translation is except through
`@grade10/utils/localized-text`.

End to end for a collector: `/tc/auction/charizard-ab12` → root loader answers
`zh-Hant` from the prefix → the route loader calls `readListing("charizard-ab12", "zh-Hant")`
→ `publicRouter.listing({ slug, locale })` → `publicListingState` resolves the
texts → the document, the head and the hydrated query (same key) carry them.

## API Contracts

All additive; every existing caller is unchanged.

- **Auction admin** - `listings.save` and `listings.create` input: optional
  `translations`. `adminListingSchema` output: `translations`
- **Auction public** - `listing`, `listings`, `auction` input: optional `locale`.
  Output shapes gain `englishTitle` on the lot and the card
- **Inventory admin** - `products.create` and `products.update` input: optional
  `translations`; `productSchema` output: `translations`
- Regenerate the API docs (`pnpm --dir packages/api-docs run generate`) and
  commit the output

## Risks / Trade-offs

- **[A reader forgets the locale and shows English on a Chinese page]** →
  Resolution is in the one projection and the one query key, and the lot page,
  the card and the head are covered by a server-rendered test per language
- **[A client caches one language's text under another's key]** → The key
  carries the locale; a test switches language on one slug and reads both
- **[A stray caller passes a locale to a staff or sent text]** → Only the three
  public procedures accept `locale`; staff reads, orders, email, Featured,
  watches and the RPC call the projection without one
- **[Unindexed `ilike` on jsonb text]** → Same scan class as the existing title
  arm, on an admin-only, paged read; decision 14 accepts the cost
- **[Old worker against the new column, new worker against the old schema]** →
  Expand-only column with a default, migrated before the worker ships
- **[A blank or hand-written bad value in `translations`]** → `textIn` accepts
  only a non-blank string of the exact locale; the writer never stores a blank

## Migration Plan

1. Auction `apps/backend/grade10/auction/src/db/migrations/0030_*.sql` and
   inventory `…/inventory/src/db/migrations/0009_*.sql`, generated with
   `pnpm run db:drizzle:generate`: `ALTER TABLE … ADD COLUMN "translations" jsonb DEFAULT '{}'::jsonb NOT NULL;`
   A constant default is a catalog change in Postgres 11 and later, with no table
   rewrite, and `check:migrations` flags neither it nor a `NOT NULL` with a default
2. No backfill (decision 5): every existing row reads as `{}`, which resolves to
   the English text
3. One statement per migration, applied in the applier's single transaction and
   recorded in the journal, so a rerun applies nothing
4. Order: migrate, then deploy. A merge to `main` migrates staging first; production,
   staging-2 and uat take the `Migrate` workflow before the deploy
5. Rollback: redeploy the previous workers. The column is inert to them and no
   data needs undoing

## Open Questions

None that change the specs, the approach or the tasks. Every choice the plan raised is settled in `decisions.md` rows 32 to 40.
