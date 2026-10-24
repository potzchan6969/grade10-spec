# grade10-site/auction/listing-page Test Cases

**Status:** reopened · 0/10
**Drafts styled:** 2026-10-08, tcs-rules r4
**Reviewed:** 2026-09-01, lapsed 2026-09-29

## g10.auction-listing-page.US1: Collector opens a lot at its own address

**As a** collector,
**I want** a lot's address to answer with that lot's own page in the response
HTML,
**so that** I can read its name, its description and where its bidding stands
without waiting for a script to run.

<!-- trace:case id=g10.auction-listing-page.TC-2it rev=3 covers=g10.auction-listing-page.SC-l9n -->
### g10.auction-listing-page.US1-TC3: Reused address serves only its eligible current holder

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-01

**Pre-conditions:**

* customer has `<reused_address>` saved before `<old_lot>` was called off.
* `<new_lot>` is the eligible current holder in `<replacement_state>`.
* No bid or standing change occurs during this pass.
* The browser runs no client-side scripts.

**Test data:**

| Field | Value |
| --- | --- |
| old_lot | A called-off listing with a different title and description |
| new_lot | The eligible current holder, with its own title, description and bidding standing |
| reused_address | The original address shared by both listings |

| `<replacement_state>` |
| --- |
| Published, open to collectors |
| Closed, retained by public lookup |
| Settled, retained by public lookup |

**Steps:**

1. Navigate to `<reused_address>`.
2. Read the served page.
3. Inspect its title, description and Open Graph metadata.
4. Inspect embedded data and fresh share-preview metadata.
5. Enable scripts on this same address.
6. Read the hydrated page and client lookup data.

**Expected Results:**

* Step 1 returns 200 at `<reused_address>`.
* Step 2 shows `<new_lot>`'s content and standing.
* Step 3 names `<new_lot>` and `<reused_address>`.
* No content or fresh metadata identifies `<old_lot>`.
* No redirect or called-off page appears.
* Step 4 names only `<new_lot>` as the current holder.
* Preview title, description and URL identify `<new_lot>`.
* No separate listing-code or payment-reference field appears.
* A code appears only within the full canonical address.
* The served document title and meta description name `<new_lot>`.
* Its canonical address and og:url equal `<reused_address>`.
* og:title and og:description name `<new_lot>`.
* Step 6 keeps the same `<new_lot>`, title, description and bidding standing.
* No placeholder, old-lot content or separate code field replaces served content.

<!-- trace:case id=g10.auction-listing-page.TC-tof rev=2 -->
### g10.auction-listing-page.US1-TC4: Client navigation opens the eligible replacement lot

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-01

**Pre-conditions:**

* customer has `<reused_address>` saved before `<old_lot>` was called off.
* `<new_lot>` is public and holds that released slug.
* customer is on the auction catalogue with scripts running.
* A saved link in this session names `<reused_address>`.

**Test data:**

| Field | Value |
| --- | --- |
| old_lot | A called-off listing with a different title and description |
| new_lot | The eligible current holder, with its own title and description |
| reused_address | The original address shared by both listings |

**Steps:**

1. Open the saved link through client navigation.
2. Read the lot page after its lookup completes.
3. Reload `<reused_address>`.
4. Read the served page.
5. Inspect hydrated DOM, lookup response and fresh preview metadata.

**Expected Results:**

* Step 2 shows `<new_lot>`'s content and standing.
* The address remains `<reused_address>`.
* Step 3 returns 200.
* Step 4 shows the same `<new_lot>`.
* No content identifies `<old_lot>`.
* No redirect or called-off page appears.
* Step 5 names `<new_lot>`, its title and full address.
* Neither `<old_lot>` nor its data appears.
* No separate listing-code or payment-reference field appears.

---

## g10.auction-listing-page.US3: Collector opens an address that names no lot

**As a** collector,
**I want** an address under the auction's lots that names no published lot to
answer with the site's not-found surface,
**so that** I am never shown an empty lot page or the catalogue in its place.

<!-- trace:case id=g10.auction-listing-page.TC-pdz rev=4 covers=g10.auction-listing-page.SC-s88,g10.auction-listing-page.SC-c13 -->
### g10.auction-listing-page.US3-TC3: Unavailable original address serves Page not found

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-03

Runs once per row of **Test data**.

**Pre-conditions:**

* customer is outside the business and has `<original_address>` saved.
* The original listing is in `<state>`.
* No eligible public listing holds its original slug.
* The browser runs no client-side scripts.
* For called-off rows, the collector watched the original before call off.

**Test data:**

| `<state>` | `<original_address>` |
| --- | --- |
| Draft, never published | The draft's address |
| Called off in this pass | Its saved address before call off |
| Called off before this release | Its saved address before call off |
| Called off, slug saved by a new unpublished draft | The shared slug's address |
| Called off, slug held by a created unpublished replacement | The shared slug's address |

**Steps:**

1. Navigate to `<original_address>`.
2. Check the response status.
3. Check the served page.
4. Inspect its response body and embedded data.
5. Open the original listing code alone as the lot address.
6. Inspect that response and page.
7. Open the original collector's watchlist.
8. Search for the called-off original listing.

**Expected Results:**

* Step 2 returns 404.
* Step 3 shows Page not found.
* Neither original listing nor unpublished replacement appears.
* No empty lot page, redirect or catalogue replaces it.
* Step 4 contains no original-lot or replacement-lot data.
* Step 4 contains no listing code or payment reference.
* Step 5 returns 404.
* Step 6 shows Page not found with no lot data or code.
* Step 8 does not show the called-off original in the watchlist.
* An unpublished replacement does not appear there either.

<!-- trace:case id=g10.auction-listing-page.TC-x03 rev=2 covers=g10.auction-listing-page.SC-b49,g10.auction-listing-page.SC-w3i -->
### g10.auction-listing-page.US3-TC4: Client navigation refuses an ineligible released address

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-03

**Pre-conditions:**

* customer is on the auction catalogue with scripts running.
* `<old_lot>` is called off and `<holder_state>` applies.
* A saved link in this session names `<released_address>`.

**Test data:**

| `<holder_state>` | `<released_address>` |
| --- | --- |
| No listing holds the released slug | `<old_lot>`'s former address |
| A new unpublished draft holds the released slug | `<old_lot>`'s former address |
| A created unpublished replacement holds the released slug | `<old_lot>`'s former address |

**Steps:**

1. Open the saved link through client navigation.
2. Read the page after its lookup completes.
3. Inspect the client lookup response.
4. Reload the address.
5. Open the original code alone through client navigation.
6. Reload that code-only address.

**Expected Results:**

* Step 2 shows Page not found.
* Neither `<old_lot>` nor the unpublished holder appears.
* Step 3 contains no lot data or listing code.
* Step 4 returns 404 with the same not-found surface.
* Steps 5 and 6 show Page not found, with no lot data.
* Step 6 returns 404 and no listing code.
* No redirect, empty lot page or catalogue replaces it.

---

## g10.auction-listing-page.US10: Collector quotes a published lot

**As a** collector browsing a listing,
**I want** to reference and share a lot by its title and URL,
**so that** I can discuss it with others and return to it easily.

<!-- trace:case id=g10.auction-listing-page.TC-87q rev=3 covers=g10.auction-listing-page.SC-57v -->
### g10.auction-listing-page.US10-TC2: Listing code absent from the page once scripts finish running

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.
* Its bidding standing stays unchanged during the pass.
* The browser initially runs no scripts.

**Steps:**

1. Open `<a published lot's address>` with scripts disabled.
2. Record its served title, description and bidding standing.
3. Enable scripts on the same address.
4. Read the hydrated page, DOM, source and document metadata.
5. Inspect every listing-code occurrence.

**Expected Results:**

* Step 2 provides the addressed lot's title, description and bidding standing.
* Step 4 keeps those same served values after hydration.
* No placeholder replaces served content.
* Hydrated DOM and document metadata name the same lot.
* No separate listing-code or payment-reference field appears.
* A code occurs only within the full canonical address.

<!-- trace:case id=g10.auction-listing-page.TC-6de rev=2 covers=g10.auction-listing-page.SC-dc3 -->
### g10.auction-listing-page.US10-TC9: Listing code stays absent once an order exists on the lot

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A lot's auction has closed with a winning bid, so an order now exists on that lot.

**Steps:**

1. Open the lot's own address on the public listing page.
2. View the page, its source, and its share-preview metadata.
3. Inspect every occurrence of the lower-case listing-code suffix, which is now also the order's payment reference.
4. Inspect hydrated DOM, page lookup responses, title and description.

**Expected Results:**

* The page and preview contain no labelled listing-code or payment-reference field.
* The code appears only as the lower-case suffix of the canonical address.
* All surfaces name the same lot and its full address.
* Title and description contain no listing code or payment reference.
* Embedded and network data contain no separate code or payment reference.

<!-- trace:case id=g10.auction-listing-page.TC-y7l rev=2 covers=g10.auction-listing-page.SC-suj -->
### g10.auction-listing-page.US10-TC10: An address naming no lot carries no listing code

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* The catalogue publishes no lot for `<a lot address naming no published lot>`.

**Steps:**

1. Fetch `<a lot address naming no published lot>`.
2. Search the response, including any error detail, for a listing code.
3. Check the not-found page and embedded data.

**Expected Results:**

* Response status is 404.
* No listing code appears anywhere in the response.
* No lot content or separate payment reference appears.

<!-- trace:case id=g10.auction-listing-page.TC-90g rev=2 -->
### g10.auction-listing-page.US10-TC11: Closed and settled listings retain their public addresses

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A previously published listing has canonical address `<listing_url>` and code `<listing_code>`.
* The listing is closed or settled, and removed from browse and search without explicit deletion.
* The listing was not called off.

**Steps:**

1. Browse the auction catalogue and search for the listing.
2. Open `<listing_url>` directly.
3. Inspect the rendered page, response source and fresh share-preview metadata.

**Expected Results:**

* Browse and search do not return the listing.
* `<listing_url>` still returns its public listing page.
* The page and fresh preview identify the listing by its public title and canonical URL.
* Outside the lower-case suffix of `<listing_url>`, `<listing_code>` is absent from the page, embedded data, network responses and fresh preview metadata.
* Removal from browse and search does not release or replace `<listing_url>` or `<listing_code>`.

---

## g10.auction-listing-page.US11: Collector contacts support about a lot

**As a** collector contacting support about a lot,
**I want** support to quickly identify which lot I'm referring to,
**so that** my inquiry is resolved faster without having to copy listing URLs or titles.

<!-- trace:case id=g10.auction-listing-page.TC-du4 rev=3 covers=g10.auction-listing-page.SC-51n -->
### g10.auction-listing-page.US11-TC1: No listing code available on the page for the collector to send

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-11

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>`.
2. Read the public lot title and full address.
3. Inspect the page and source for a separate code field.
4. As admin(support), find the public lot by that title.
5. Open the matched lot.

**Expected Results:**

* Step 2 provides the public title and full address.
* Step 3 offers no separate code or payment reference.
* Step 4 finds the lot without a listing code.
* Support lookup shows no separate listing-code or payment-reference field.
* Step 5 identifies the same lot by title and full address.
* The opened public lot shows no separate code to support.

<!-- trace:case id=g10.auction-listing-page.TC-h6y rev=2 -->
### g10.auction-listing-page.US11-TC3: Title and address stay the collector's only reference once an order exists

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-11

**Pre-conditions:**

* A lot's auction has closed with a winning bid, so an order now exists on that lot.

**Steps:**

1. Open the lot's own address on the public listing page.
2. Note its title and address.
3. Inspect DOM, source, embedded data and fresh preview metadata.
4. As admin(support), find and open the lot by title.

**Expected Results:**

* The title and canonical address are unchanged by the order.
* The page has no labelled listing-code or payment-reference field; the code appears only as the lower-case canonical-address suffix.
* Step 3 exposes no separate code or payment reference.
* Step 4 finds the same lot without a code.

<!-- trace:case id=g10.auction-listing-page.TC-sa9 rev=2 covers=none -->
### g10.auction-listing-page.US11-TC4: Called-off listing remains directly accessible

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-11

**Pre-conditions:**

* A listing has an allocated canonical address and listing code.

**Steps:**

1. Call the listing off before close.
2. Open its canonical address directly.
3. Search browse and search results for the listing.
4. Try the listing code as the address.

**Expected Results:**

* The canonical address still resolves to the called-off listing.
* The listing is absent from browse and search.
* The listing code does not resolve as a public route.

**Retired:** Permanent called-off access is replaced by released-address cases in US3 and the auction domain cancellation walk.

---

## Reconciliation

**Run:** QA2, 2026-10-12. QA1 used frozen bundle `02ba99d366a1f619b3df386916067b23a31ec77462132a92d7eddd4bd474713f`. QA2 read both independent readings, all 3 deltas, the complete feature maps, current and durable journeys, durable context, and the linked owner decisions. Case dispositions were recorded before scenario links.

- **Disposition** - All 14 listing-page scenarios have complete routes. TC-2it@3 fetches the replacement without scripts, checks served metadata, then reads hydrated/client data for published, closed and settled holders. TC-x03@2 checks private draft/created client refusal and served 404 on reload. TC-5rp@3, TC-du4@3, TC-y7l@2, TC-87q@3 and TC-6de@2 close the five inherited identifier gaps through preview/document metadata, support lookup, not-found response, hydration continuity and order-existing client data. TC-sa9 remains deprecated under Q2; no case links the retired SC28.
- **Coverage** - Complete case and scenario dispositions, source locations, anchor coverage and carried baseline findings are in the QA2 handoff. Missing scenario links are explicit gaps, not inferred coverage.
- **Decision** - All called-off original slugs are reusable, including earlier records. The eligible current holder answers; otherwise the address is not found. Codes stay reserved and do not become public routes. Bidder history stays with the original listing. Q1-Q4 are settled.
- **Classification** - New and changed active cases remain draft. No runtime execution or human approval is claimed.
- **Walks** - Feature walks name cases this change does not define, so this delta carries none. The durable walks keep the earlier called-off steps until task 1.3 rewrites them through `/tcs-review`. The revised cases above govern.

**Run:** QA2 repair pass, 2026-10-13, after the re-key to durable case ids and the lot-status Bidder exception repair. Read the 3 deltas, their journeys and the durable site and admin auction suites. Cases were reconciled against the delta scenarios' trace ids; no scenario text shaped a case, and only bodies the pass read were linked.

- **Disposition** - Of 14 listing-page scenarios, 11 are linked and 3 are not. Added: TC-pdz@4 now also links SC-04, since every row asserts 404 and the Page not found screen for an address naming no published lot. Kept after re-reading: TC-2it@3 to SC55, TC-x03@2 to SC54 and SC56, TC-5rp@3 to SC-21, TC-du4@3 to SC-23, TC-y7l@2 to SC-24, TC-87q@3 to SC-25, TC-6de@2 to SC-27, TC-pdz@4 to SC-19. Unlinked on purpose: TC-tof@2 (US1-TC4) reads hydrated and lookup data and fresh preview metadata but not the served title, description and canonical URL without scripts that SC55 names, and TC-2it@3 already covers SC55; TC-zq9@2 (US10-TC4) checks only the tab title and meta description, not `og:url`, `og:title` and `og:description` of SC-21; TC-h6y@2 (US11-TC3) does not inspect client-fetched responses that SC-27 names; TC-90g@2 (US10-TC11) asserts a closed or settled listing keeps its address, for which this delta has no scenario.
- **Coverage** - Uncovered scenarios: SC-20 (generated canonical address in the served response without scripts), SC-22 (client-fetched lot data carries no listing code on a published lot) and SC-26 (the code in place of a published lot's address answers not found). The delta mints new ids for them, no durable case claims them, and the inherited durable cases claim only SC-21. TC-pdz@4 and TC-x03@2 test the code-only address only for called-off lots, not for a published lot, so they cannot take SC-26. Record these 3 for a case, or a deliberate decision to leave them to the walk, before approval. No over-claimed case.
- **Contradictions** - No active case in this delta asserts that a called-off address stays reachable or that the canonical slug is retained. TC-sa9 holds that outcome and stays deprecated under Q2. The durable Walk 10 steps 6-9 (`The canonical address still resolves to the called-off listing`) remain until task 1.3.
- **Decision** - None new. Q1-Q4 stay settled.
- **Classification** - New and changed active cases remain draft. No runtime execution or human approval is claimed.
- **Walks** - Unchanged: this delta carries none, and task 1.3 repairs the durable walks through `/tcs-review`.
