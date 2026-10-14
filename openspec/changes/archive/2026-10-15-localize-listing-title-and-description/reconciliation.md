# QA2 Reconciliation

2026-10-14, QA2 for `localize-listing-title-and-description`. The per-capability dispositions are in each suite's `## Reconciliation`. This sheet holds what crosses artifacts, then the proposed answers to `decisions.md` `## Raised`.

## Cluster

None. `pnpm plan:review-preflight` reports 0 overlaps. This change owns every requirement it edits.

## Coverage

- **Tasks** - every new scenario id is cited by a test task; every task group opens with its tests, closes with a verify task, and group 8 walks all 13 journeys the deltas name (`grade10-admin-auction-listing-US-75`, `US-76`, `US-77`, `US-09`, `US-03`; `grade10-site-auction-listing-page-US-16`, `US-02`, `US-01`; `grade10-admin-inventory-catalog-US-75`, `US-76`, `US-77`, `US-06`)
- **Requirements** - all 15 requirements have scenarios and a task
- **Gap** - no task walks the domain case `g10adm.auction-dmn.US5-TC1`; add it to 8.1 or 8.2
- **Scenarios linked** - of 57 new scenarios, 30 have a single case that fully asserts them, 5 are jointly asserted by two cases, 14 are partly asserted, 4 sit out of suite (`grade10-admin-auction-listing-SC-176`, `grade10-admin-auction-listing-SC-177`, `grade10-admin-inventory-catalog-SC-205`, `grade10-admin-inventory-catalog-SC-206`) and 4 are uncovered (the holes in Dev Repair 10 other than the description half of `grade10-admin-inventory-catalog-SC-214`)

## Dev Repairs

1. **Gallery alt text** - `tech-design.md` D5 resolves `title` on the server, and `listingLotGalleryImages.ts:29` and `ListingCatalogueCard.tsx:146` fall back to `listing.title` for alt text. On a Chinese page the alt text would read the translated title. Decision 19, the admin delta and `g10.shared-localization.US1-TC2` say English. No task or scenario owns it. Carry the English title beside the resolved one, add a task and a scenario
2. **`grade10-site-auction-listing-page-SC-60`** - "neither the English nor the Simplified Chinese text" fails against the English alt text in the same HTML. Word it on the title and description elements and the head tags
3. **Name and title limits** - D3 says the wire counts the raw string for save and create and for product names. `listings.create` takes `title` as `label` and the product name is `label`, which trims and then counts; only `listings.save` is raw. Say which codec the translations use
4. **`searchAuctionProducts`** - D9, task 3.4 and the Raised row call it collector-facing. It is a `publicProcedure` with no frontend caller in grade10 that returns English `products.name`. Reword it, and name it in the proposal's Follow-on changes if it moves later
5. **Domain walk** - see Coverage
6. **Language switch** - `tech-design.md` D6 and task 6.1 rest on `g10.auction-listing-page.US16-TC13` and a per-language query key with no scenario. Fold one
7. **Edit past close** - `tech-design.md` says `editRefusal` also refuses a lot past its close; the admin requirement lets any published listing take translations. State which
8. **Feature-set wording** - "a closed or called-off listing" leaves out settled in the listing's feature set
9. **Scenarios to fold** (real behaviour, no scenario): head escaping (`US16-TC10`), the editor hiding inputs from an operator without the grant (`US75-TC11`), a search edit or clear moving results (`US77-TC5` in both suites), a Details section or Copy block on an untranslated record
10. **Holes owed a case, a row or an out-of-suite line**: `grade10-admin-auction-listing-SC-191`, `grade10-site-auction-listing-page-SC-66`, `grade10-site-auction-listing-page-SC-71`, `shared-localization-SC-42`, the description half of `grade10-admin-inventory-catalog-SC-214`

## Scenarios That Echo a Raised Row

These state an answer no Decisions row or PRD line gives. They stand only if the human confirms the row.

- `grade10-admin-auction-listing-SC-172` and `grade10-admin-inventory-catalog-SC-203` - the API refuses (row 1)
- `grade10-site-auction-listing-page-SC-68` and `grade10-site-auction-listing-page-SC-69` - the English-title check sits in this capability (row 11)
- The catalog requirement's "a description limit, which is none" (row 15) and "a name is trimmed on save" (row 18)

## Proposed Answers

Reply `defaults` to take every row's proposal. **Settled** rows are already decided by the Decisions row named and can be landed as written; **Human** rows need the human's word, with the proposed default. Rows in `decisions.md` order.

### grade10-admin/auction/listing

| # | Raised | Proposed answer | Evidence | Status |
| --- | --- | --- | --- | --- |
| 1 | Limits at the API? | Yes. The API enforces the 200 and 4,000 limits, counted as typed | Decisions 7 and 17; D3; the existing wire checks (`trpc/routers/listings.ts`) | Settled by 7, 17 |
| 2 | A Chinese description with an empty English one | Allowed; only the English title is required. The Copy block shows the Chinese text in its language; a language with no text over an empty English one shows an empty text, not marked as a fallback | Decision 7; `copy` defaults to empty | Human, default as proposed |
| 3 | Form after a spaces-only save | Reopens the field empty, because the text is stored as none | Decision 8; the scenario that stores no text for spaces | Settled by 8 |
| 4 | Characters outside the basic plane | Counted as the English text counts today: by string length, so such a character counts two. A translation holds the same limits | Decisions 7, 17; `Schema.isMaxLength` on the wire | Settled by 7, 17 |
| 5 | Copy block on a frozen listing | The language choice still switches for reading; decision 22 removes edit controls only | Decisions 15, 22; D11 (`useState`, no write) | Human, default as proposed |
| 6 | Search on English fragments | Unchanged: title, listing code, slug and the rest; translated titles are one more arm | Decisions 6, 14; D8; the requirement "every other part of the search is unchanged" | Settled by 6, 14 |

### grade10-site/auction/listing-page

| # | Raised | Proposed answer | Evidence | Status |
| --- | --- | --- | --- | --- |
| 7 | Structured data and Twitter tags | Nothing to follow. The lot page has no structured data (`structuredData.ts` is the store's product card) and its only Twitter tag is `twitter:card` | Decision 10; `surfaceHead.ts` | Settled by 10 |
| 8 | Breadcrumb and image alt text | The breadcrumb's last item is catalogue copy, not the title; alt text keeps the English title. The design must change to hold this (Dev Repair 1) | Decision 19; `ListingView.tsx` (`lotBreadcrumb`) | Settled by 19 |
| 9 | A 200-character Chinese title on the card | The card keeps its present two-line clamp; no new rule | `ListingCatalogueCard.tsx` (`line-clamp-2`) | Human, default as proposed |
| 10 | Decision 21 and cached previews | Binds a fresh load only; no cache of ours holds these reads, and a stale preview is the fetcher's | Decision 21; D7; the PRD | Settled by 21 |
| 11 | Who owns the English-title check | `grade10-site/auction/listing-page` owns it (`grade10-site-auction-listing-page-SC-69`); the admin requirement keeps staff texts and links here | Decision 19; the delta placement | Human, default as proposed |
| 12 | What a collector sees of the English reference | The address only, the same in every language; no new reference on screen | Decision 20; `grade10-site-auction-listing-page-SC-68` | Settled by 20 |

### shared/localization

| # | Raised | Proposed answer | Evidence | Status |
| --- | --- | --- | --- | --- |
| 13 | Name the surfaces in the exception | Yes: the card, the lot page and its share metadata; the six surfaces of decision 19 keep the English title | Decisions 13, 19 | Settled by 13, 19 |
| 14 | Language of an email, push or Slack alert's other copy | Unchanged by this change; only the lot's name is the English title | Decision 19; Non-Goals "Staff-facing and sent texts" | Settled by 19 |

### grade10-admin/inventory/catalog

| # | Raised | Proposed answer | Evidence | Status |
| --- | --- | --- | --- | --- |
| 15 | The product description limit | A translated description is trimmed and capped at 2,000 characters; the English description keeps no limit | Decisions Q31, Q44 | Settled by 31, 44 |
| 16 | Who may write a translation | Whoever may update a product's name and description today; no new permission | Decisions 18, 26 by analogy; no product grant is named | Human, default as proposed |
| 17 | Does the product search read descriptions | No: names only | Decision 29; the requirement; decision 14 by analogy | Settled by 29 |
| 18 | Name counting and trim | Trim on save, then count 1 to 200, as the English name does today (`label`); this differs from the listing title's typed count | Decision 31; `schema.ts` (`bounded`); Dev Repair 3 | Human, default as proposed |
| 19 | What a catalogue upload may change | Nothing about translations; it resolves a product by English name and taxonomy and writes none | Decision 28; D12 | Settled by 28 |
| 20 | Chinese description under an empty English one | As row 2: the Details section shows the Chinese text in its language and an empty text, unmarked, elsewhere | Decisions 7, 31 | Human, default as proposed |
| 21 | Translated names in `productSearch` | No: leave `searchAuctionProducts` on the English name. It is a public procedure that returns English names, and the store pages come later | Decisions 29, 30; `public.ts`; Dev Repair 4 | Human, default as proposed |
| 22 | Namesake warning and import name match | English name only | Decisions 28, 30; D12 | Human, default as proposed |

## Summary

22 rows. **13 settled** by a Decisions row (rows 1, 3, 4, 6, 7, 8, 10, 12, 13, 14, 15, 17, 19). **9 need the human**, each with a default (rows 2, 5, 9, 11, 16, 18, 20, 21, 22).


## Dev Update After The Spike (2026-10-14)

- **Anchors left as written** - the Labs seeding and the customer view have no feature-set line or journey of their own in the admin listing delta. Their scenarios serve `grade10-admin-auction-listing-US-75` and `grade10-admin-auction-listing-US-76`. Adding a feature-set group (`Labs seeds`, `Customer view`) and a journey (`Operator previews the lot in each language`) is an anchor edit and restarts QA1 and Dev; it was not made
- **No capability for the customer view** - `packages/frontend-console` `CustomerView` has no spec under `openspec/specs/shared/console/`, so the requirement sits in `grade10-admin/auction/listing`
- **New scenarios** - `grade10-admin-auction-listing-SC-200` to `SC-206`, `grade10-admin-inventory-catalog-SC-217`, `grade10-site-auction-listing-page-SC-75`; `grade10-site-auction-listing-page-SC-67` and `SC-72` are revised (rev 2)
- **New ❓ for the PM** - Q43 (the customer view draws no description) and Q49 (segmented control instead of a dropdown); both stay open and block nothing

## Accepted Notes

`grade10-admin-auction-listing-SC-200` to `SC-206` (Labs seeds and the customer view) serve the existing journeys US-75 and US-76; they have no Feature-set line or journey of their own, and their outcomes are listed Out of suite in the suite with reasons. The Feature-set line "a closed or called-off listing" omits settled; the requirement text and Q22 name it, so no anchor edit is made.
