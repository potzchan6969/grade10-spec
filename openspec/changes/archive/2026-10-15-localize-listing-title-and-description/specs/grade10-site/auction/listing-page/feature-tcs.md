# grade10-site/auction/listing-page Test Cases

**Status:** pending-review · 0/13
**Drafts styled:** 2026-10-14, tcs-rules r5
**Out of suite:** grade10-site-auction-listing-page-SC-75 - the storefront locale test of task 6.1, added after the blind pass, because a page language the brand has no field for is a mapping in the views, not a route a collector walks

## g10.auction-listing-page.US16: Collector reads a lot's title and description in their own language

**As a** collector,
**I want** the card and the lot page to show the lot's title and description in the language I browse in,
**so that** I understand the card before I bid on it.

<!-- trace:case id=g10.auction-listing-page.TC-x0c rev=1 -->
### g10.auction-listing-page.US16-TC1: Lot page shows the title and description in the page's language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_1>` is published and live with all three languages written.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A published, live listing with all three languages written, slug `<slug_1>`, the title and description texts below |
| slug_1 | the address built from the English title and the listing code |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |
| simplified title | 宝可梦 喷火龙 PSA 10 |
| simplified description | 1999 年基本系列，正面无瑕。 |

| lang | language | title reads | description reads |
| --- | --- | --- | --- |
| /tc | Traditional Chinese | `<traditional title>` | `<traditional description>` |
| /sc | Simplified Chinese | `<simplified title>` | `<simplified description>` |
| (none) | English, the default | `<english title>` | `<english description>` |

**Steps:**

1. Open the lot page at `<lang>`/auction/listings/`<slug_1>`.
2. Read the lot title.
3. Read the lot description.

**Expected Results:**

* Step 1 loads the lot page.
* Step 2 reads `<title reads>`.
* Step 3 reads `<description reads>`.
* Steps 2 and 3 show no text of another language.

<!-- trace:case id=g10.auction-listing-page.TC-juv rev=1 -->
### g10.auction-listing-page.US16-TC2: Catalogue card shows each lot's title in the page's language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_1>` has all three languages written and `<listing_2>` has an English title only.
* `<listing_1>` and `<listing_2>` are both in the state `<card state>` and appear on the catalogue.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A published listing with `<english title>`, `<traditional title>` and `<simplified title>` |
| listing_2 | A published listing with `<english title>` only |
| english title | Charizard PSA 10 |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| simplified title | 宝可梦 喷火龙 PSA 10 |

| lang | card state | card title |
| --- | --- | --- |
| /tc | Active | `<traditional title>` |
| /sc | Active | `<simplified title>` |
| /tc | Upcoming | `<traditional title>` |
| /tc | Closed | `<traditional title>` |

**Steps:**

1. Open the catalogue at `<lang>`/auction.
2. Find the card of `<listing_1>`.
3. Find the card of `<listing_2>`.

**Expected Results:**

* Step 2 reads `<card title>` as the card's title.
* Step 3 reads `<english title>` as the card's title.
* Neither card shows a description.

<!-- trace:case id=g10.auction-listing-page.TC-cmf rev=1 covers=g10.auction-listing-page.SC-sbq -->
### g10.auction-listing-page.US16-TC3: A text left unwritten falls back to English on its own

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_3>` is published with a Traditional Chinese title and no Traditional Chinese description.

**Test data:**

| Field | Value |
| --- | --- |
| listing_3 | A published listing with `<english title>`, `<english description>` and `<traditional title>`; no Traditional Chinese description |
| slug_3 | the address built from the English title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |

**Steps:**

1. Open the lot page at `/tc/auction/listings/<slug_3>`.
2. Read the lot title.
3. Read the lot description.

**Expected Results:**

* Step 2 reads `<traditional title>`.
* Step 3 reads `<english description>`.
* Step 3 shows no empty description area.

<!-- trace:case id=g10.auction-listing-page.TC-44a rev=1 -->
### g10.auction-listing-page.US16-TC4: One Chinese is never shown in place of the other

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_4>` is published with the texts named by `<written>` and none in the other Chinese.

**Test data:**

| Field | Value |
| --- | --- |
| listing_4 | A published listing with `<english title>`, `<english description>` and only the `<written>` texts |
| slug_4 | the address built from the English title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |
| simplified title | 宝可梦 喷火龙 PSA 10 |
| simplified description | 1999 年基本系列，正面无瑕。 |

| lang | written |
| --- | --- |
| /sc | Traditional Chinese title and description |
| /tc | Simplified Chinese title and description |

**Steps:**

1. Open the lot page at `<lang>`/auction/listings/`<slug_4>`.
2. Read the lot title.
3. Read the lot description.

**Expected Results:**

* Step 2 reads `<english title>`.
* Step 3 reads `<english description>`.
* Steps 2 and 3 show no text of the language `<written>`.

<!-- trace:case id=g10.auction-listing-page.TC-xjc rev=1 -->
### g10.auction-listing-page.US16-TC5: A listing with no translations reads as it did before

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_5>` was published before translations existed and has an English title and description only.

**Test data:**

| Field | Value |
| --- | --- |
| listing_5 | A published listing with `<english title>` and `<english description>` only |
| slug_5 | the address built from the English title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |

**Steps:**

1. Open the lot page at `/tc/auction/listings/<slug_5>`.
2. Read the lot title.
3. Read the lot description.
4. Open the lot page at `/auction/listings/<slug_5>`.
5. Read the lot title and description.

**Expected Results:**

* Step 2 reads `<english title>`.
* Step 3 reads `<english description>`.
* Step 5 reads the same title and description as steps 2 and 3.

<!-- trace:case id=g10.auction-listing-page.TC-pda rev=1 -->
### g10.auction-listing-page.US16-TC6: A translation saved as spaces falls back to English

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_6>` is published and its Traditional Chinese `<field>` was saved as 3 spaces; its other Traditional Chinese text is written.

**Test data:**

| Field | Value |
| --- | --- |
| listing_6 | A published listing with `<english title>`, `<english description>`, `<traditional title>` and `<traditional description>` before the row's text was set to 3 spaces |
| slug_6 | the address built from the English title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |

| field | expected title | expected description |
| --- | --- | --- |
| title | `<english title>` | `<traditional description>` |
| description | `<traditional title>` | `<english description>` |

**Steps:**

1. Open the lot page at `/tc/auction/listings/<slug_6>`.
2. Read the lot title.
3. Read the lot description.

**Expected Results:**

* Step 2 reads `<expected title>`.
* Step 3 reads `<expected description>`.
* The page shows no blank title and no blank description area.

<!-- trace:case id=g10.auction-listing-page.TC-e8q rev=1 -->
### g10.auction-listing-page.US16-TC7: The first response already carries the title and description in the page's language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_1>` is published and live with all three languages written.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A published, live listing with all three languages written, slug `<slug_1>` |
| slug_1 | the address built from the English title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |
| simplified title | 宝可梦 喷火龙 PSA 10 |
| simplified description | 1999 年基本系列，正面无瑕。 |

| lang | language | title reads | description reads |
| --- | --- | --- | --- |
| /tc | Traditional Chinese | `<traditional title>` | `<traditional description>` |
| /sc | Simplified Chinese | `<simplified title>` | `<simplified description>` |
| (none) | English, the default | `<english title>` | `<english description>` |

**Steps:**

1. Request `<lang>`/auction/listings/`<slug_1>` with scripts disabled.
2. Read the lot title in the response HTML.
3. Read the lot description in the response HTML.

**Expected Results:**

* Step 2 reads `<title reads>`.
* Step 3 reads `<description reads>`.

<!-- trace:case id=g10.auction-listing-page.TC-k7m rev=1 -->
### g10.auction-listing-page.US16-TC8: Page title, meta description and Open Graph tags follow the page's language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_1>` is published with all three languages written.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A published listing with all three languages written, slug `<slug_1>` |
| slug_1 | the address built from the English title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |
| simplified title | 宝可梦 喷火龙 PSA 10 |
| simplified description | 1999 年基本系列，正面无瑕。 |

| lang | language | title reads | description reads |
| --- | --- | --- | --- |
| /tc | Traditional Chinese | `<traditional title>` | `<traditional description>` |
| /sc | Simplified Chinese | `<simplified title>` | `<simplified description>` |
| (none) | English, the default | `<english title>` | `<english description>` |

**Steps:**

1. Request `<lang>`/auction/listings/`<slug_1>` and read the response HTML.
2. Read the page title.
3. Read the meta description.
4. Read the Open Graph title.
5. Read the Open Graph description.

**Expected Results:**

* Step 2 includes `<title reads>`.
* Step 3 includes `<description reads>`.
* Step 4 includes `<title reads>`.
* Step 5 includes `<description reads>`.

<!-- trace:case id=g10.auction-listing-page.TC-hmv rev=1 -->
### g10.auction-listing-page.US16-TC9: Share metadata falls back to English one text at a time

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_3>` is published with a Traditional Chinese title and no Traditional Chinese description.

**Test data:**

| Field | Value |
| --- | --- |
| listing_3 | A published listing with `<english title>`, `<english description>` and `<traditional title>`; no Traditional Chinese description |
| slug_3 | the address built from the English title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |

**Steps:**

1. Request `/tc/auction/listings/<slug_3>` and read the response HTML.
2. Read the page title and the Open Graph title.
3. Read the meta description and the Open Graph description.

**Expected Results:**

* Step 2 includes `<traditional title>` in both.
* Step 3 includes `<english description>` in both.

<!-- trace:case id=g10.auction-listing-page.TC-aam rev=1 -->
### g10.auction-listing-page.US16-TC10: A title with markup characters renders as text in the page and in metadata

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_7>` is published with a Traditional Chinese title containing the characters in `<markup title>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_7 | A published listing with a Traditional Chinese title `<markup title>` and description containing the same characters |
| slug_7 | the address built from the English title |
| markup title | 噴火龍 <b>"PSA"</b> & <script>1</script> |

**Steps:**

1. Open the lot page at `/tc/auction/listings/<slug_7>`.
2. Read the lot title.
3. Read the Open Graph title and the meta description in the response HTML.

**Expected Results:**

* Step 2 shows `<markup title>` as typed, as text.
* Step 3 shows the characters escaped, with no extra tag or attribute created.
* No script runs.

<!-- trace:case id=g10.auction-listing-page.TC-11y rev=1 covers=g10.auction-listing-page.SC-xpl -->
### g10.auction-listing-page.US16-TC11: Every language answers at the same lot address and the address names the English title

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_1>` is published with all three languages written.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A published listing with all three languages written, slug `<slug_1>` |
| slug_1 | the address built from `<english title>`, not from a Chinese title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |
| simplified title | 宝可梦 喷火龙 PSA 10 |
| simplified description | 1999 年基本系列，正面无瑕。 |

| lang | language |
| --- | --- |
| /tc | Traditional Chinese |
| /sc | Simplified Chinese |
| (none) | English, the default |

**Steps:**

1. Open the catalogue at `<lang>`/auction.
2. Click the card of `<listing_1>`.
3. Read the address of the lot page.

**Expected Results:**

* Step 2 opens the lot page.
* Step 3 ends with `/auction/listings/<slug_1>` after the language prefix `<lang>`.
* Step 3 shows the same `<slug_1>` for every row, built from the English title.

<!-- trace:case id=g10.auction-listing-page.TC-ofr rev=1 covers=g10.auction-listing-page.SC-ex9 -->
### g10.auction-listing-page.US16-TC12: An edited translation shows on the next load and is not pushed to an open page

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_1>` is published with `<traditional title>` written.
* admin(auction operator) can edit `<listing_1>` in a second session.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A published, live listing with `<english title>` and `<traditional title>` |
| slug_1 | the address built from the English title |
| english title | Charizard PSA 10 |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| new traditional title | 寶可夢 噴火龍 初版 PSA 10 |

**Steps:**

1. Open the lot page at `/tc/auction/listings/<slug_1>` and read the title.
2. In the second session, replace the Traditional Chinese title with `<new traditional title>` and click Save.
3. In the first session, read the title without reloading.
4. Reload the lot page.
5. Read the title.

**Expected Results:**

* Step 3 still reads `<traditional title>`.
* Step 5 reads `<new traditional title>`.

<!-- trace:case id=g10.auction-listing-page.TC-p0g rev=1 -->
### g10.auction-listing-page.US16-TC13: Switching the page language switches the lot's texts

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on the lot page of `<listing_1>` at `/tc/auction/listings/<slug_1>`.
* `<listing_1>` is published with all three languages written.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A published listing with all three languages written, slug `<slug_1>` |
| slug_1 | the address built from the English title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |
| simplified title | 宝可梦 喷火龙 PSA 10 |
| simplified description | 1999 年基本系列，正面无瑕。 |

**Steps:**

1. Read the lot title and description.
2. Choose Simplified Chinese in the site's language choice.
3. Read the lot title and description.
4. Choose English in the site's language choice.
5. Read the lot title and description.

**Expected Results:**

* Step 1 reads `<traditional title>` and `<traditional description>`.
* Step 3 reads `<simplified title>` and `<simplified description>`, at the `/sc` address.
* Step 5 reads `<english title>` and `<english description>`, at the unprefixed address.

---

## Reconciliation

**Run:** 2026-10-14, QA2 in a fresh context, after QA1's blind pass (13 draft cases from the frozen anchors, `proposal.md`, `decisions.md` and the domain draft) and Dev's independent delta. It read this suite, the delta's `spec.md` and `user-journeys.md`, `decisions.md` with `## Raised`, `tech-design.md`, `tasks.md`, the [Auction](/p/grade10-site/auction/display#listing-schema) page, and the shipped code in grade10 (`surfaceHead.ts`, `structuredData.ts`, `listingLotGalleryImages.ts`, `ListingCatalogueCard.tsx`). No case was written or reworded from a scenario, and every case stays `draft`. QA1's own bundle line is not in the draft; the planning run adds it.

- **Linked** - `g10.auction-listing-page.US16-TC3` asserts `grade10-site-auction-listing-page-SC-63`; `US16-TC11` asserts `grade10-site-auction-listing-page-SC-68`; `US16-TC12` asserts `grade10-site-auction-listing-page-SC-67`. `grade10-site-auction-listing-page-SC-69` is asserted by `g10.shared-localization.US1-TC4`, which walks all five surfaces; the link sits on that case
- **Jointly asserted, not linked** - `grade10-site-auction-listing-page-SC-60` is split between `US16-TC1` (rendered page, no text of another language) and `US16-TC7` (the response HTML, with no exclusion read). The scenario's "neither the English nor the Simplified Chinese text" is also contradicted below
- **Partly asserted, not linked** - `grade10-site-auction-listing-page-SC-61` by `US16-TC2`: no default-address row, so the English card at `/auction` is unread. `grade10-site-auction-listing-page-SC-62` by `US16-TC4`: it reads the rendered page where the scenario reads the response HTML with no script. `grade10-site-auction-listing-page-SC-64` by `US16-TC6`: the lot page only, the card and catalogue unread. `grade10-site-auction-listing-page-SC-65` by `US16-TC5`: no Simplified Chinese address and no card. `grade10-site-auction-listing-page-SC-70` by `US16-TC8`: `og:url` is unread
- **Uncovered** - `grade10-site-auction-listing-page-SC-66` (the language survives the handover and a live bid): no case reads the lot after scripts run and a bid lands; task 6.1 tests it, and the domain case places a bid at `/tc` without reading the text after it. `grade10-site-auction-listing-page-SC-71` (a Simplified Chinese address of a Traditional-only lot unfurls in English): `US16-TC9` reads a Traditional address with one text missing, which is `grade10-site-auction-listing-page-SC-63` in the head, and no case fetches `/sc` for a Traditional-only lot. Each owes a case, a row, or an `Out of suite` line naming task 6.1
- **Carried** - `grade10-site-auction-listing-page-SC-03` is unchanged; the durable suite holds its case
- **Cases with no scenario** - `US16-TC10` (a title with markup characters renders as text in the page and the head): real and unstated; check whether `grade10-site/site/crawlable-pages` already owns head escaping, else fold a scenario. `US16-TC13` (switching the page language switches the lot's texts): real, and `tech-design.md` D6 and task 6.1 ("a query key per language") rest on it with no scenario; fold. The `Upcoming` and `Closed` rows of `US16-TC2` and the English-title slug of `US16-TC11` extend `grade10-site-auction-listing-page-SC-61` and `grade10-site-auction-listing-page-SC-68` to states and a decision (4) they do not name
- **Over-claimed** - `US16-TC2` expects neither card to show a description; no scenario or decision says so
- **Contradicted** - `grade10-site-auction-listing-page-SC-60` says the response HTML contains neither the English nor the Simplified Chinese text of either, and decision 19 puts the English title in the gallery alt text, which is in that HTML. Worse, `tech-design.md` D5 resolves `title` on the server and `listingLotGalleryImages.ts` and `ListingCatalogueCard.tsx` fall back to `listing.title` for the alt text, so on a Chinese page the alt text would read the translated title: against decision 19, the admin delta's "gallery alt text SHALL keep the English title", and step 3 of `g10.shared-localization.US1-TC2`. Task 6.3 confirms the head needs no change and no task or scenario owns the alt text. It goes to Dev: carry the English title beside the resolved one, or resolve alt text apart, with a task and a scenario; and word SC-60 on the title and description elements and the head
- **Contradicted, anchor** - `grade10-site-auction-listing-page-SC-70` and `grade10-site-auction-listing-page-SC-71` serve `grade10-site-auction-listing-page-US-02`, and the cases that assert them (`US16-TC8`, `US16-TC9`) trace `grade10-site-auction-listing-page-US-16`; `grade10-site-auction-listing-page-SC-68` and `grade10-site-auction-listing-page-SC-69` serve a feature-set line no case traces
- **Raised, settled** - every row this pass raised is landed in `decisions.md` (Q7 to Q40, the human's defaults); the open PM confirmations are Q43 and Q49 in `decisions.md`; no case waits on a row
- **Anchors** - `grade10-site-auction-listing-page-US-16` holds all 13 cases. The context journeys `grade10-site-auction-listing-page-US-01` and `grade10-site-auction-listing-page-US-02` hold no case here; the durable suite keeps theirs
- **Levels** - the site domain suite traces `grade10-site-auction-listing-page-US-01` and `grade10-site-auction-listing-page-US-02` and walks the English address; this change adds no cross-capability path there, so the proposal carries `No domain impact` for it. The operator-writes, collector-reads path is the admin domain case `g10adm.auction-dmn.US5-TC1`
- **After the human's reply (2026-10-14)** - Dev folded `US16-TC10` as `grade10-site-auction-listing-page-SC-73` and `US16-TC13` as `grade10-site-auction-listing-page-SC-74`, added `grade10-site-auction-listing-page-SC-72` for the alt text, and reworded `grade10-site-auction-listing-page-SC-60` to the title and description elements and the head. `grade10-site-auction-listing-page-SC-66` and `grade10-site-auction-listing-page-SC-71` are verified by task 6.1. Rows settled in `decisions.md` 34 and 35
