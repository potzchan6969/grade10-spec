# shared/localization Test Cases

**Status:** pending-review · 0/5
**Drafts styled:** 2026-10-14, tcs-rules r5

## g10.shared-localization.US1: Seller-typed content renders as written, except an auction listing's title and description

**Walked by:** nobody on their own - a policy both brands' sites inherit; the journeys live in the site and store capabilities that render a page in the collector's language

**As a** customer,
**I want** content a seller typed to stay in the language it was written in, unless an operator wrote it in mine,
**so that** I read what the seller meant, and a lot I decide on in my own language.

<!-- trace:case id=g10.shared-localization.TC-00z rev=1 -->
### g10.shared-localization.US1-TC1: Seller-typed content stays as the seller wrote it on a Chinese page

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Source-language content

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<content_1>` is a seller-typed text in English that the row names, with no translation of it anywhere.

**Test data:**

| Field | Value |
| --- | --- |
| content_1 | English text typed by a merchant or by an operator, on the surface the row names |

| where | what |
| --- | --- |
| A store product page, `/tc/store/products/<handle>` | The product title |
| An auction campaign cover | The campaign title and copy |
| A published lot page, `/tc/auction/listings/<slug>` | An attribute value of the lot, such as its set |

**Steps:**

1. Open `<where>` with the language prefix `/tc`.
2. Read `<what>`.

**Expected Results:**

* Step 2 reads `<what>` exactly as written in English.
* Step 2 shows no Chinese translation of it.

<!-- trace:case id=g10.shared-localization.TC-gbl rev=1 covers=g10.shared-localization.SC-2lw -->
### g10.shared-localization.US1-TC2: On a lot page only the title and description follow the page's language

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Source-language content

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_1>` is published with a Traditional Chinese title and description written and English alternatives, and carries gallery media with alt text and a campaign.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A published listing in a campaign, English title `<english title>` and description `<english description>`, Traditional Chinese title `<traditional title>` and description `<traditional description>`, a first image with no alt text of its own |
| slug_1 | the address built from the English title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |

**Steps:**

1. Open the lot page at `/tc/auction/listings/<slug_1>`.
2. Read the lot title and description.
3. Read the alt text of the first gallery image.
4. Read the campaign title the lot sells under.

**Expected Results:**

* Step 2 reads `<traditional title>` and `<traditional description>`.
* Step 3 reads `<english title>`, the English title standing in as alt text.
* Step 4 reads the campaign title as written.

<!-- trace:case id=g10.shared-localization.TC-1cl rev=1 -->
### g10.shared-localization.US1-TC3: Where the operator wrote no translation the source text stands untranslated

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Source-language content

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_2>` is published with an English title and description only.

**Test data:**

| Field | Value |
| --- | --- |
| listing_2 | A published listing with `<english title>` and `<english description>` only |
| slug_2 | the address built from the English title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |

**Steps:**

1. Open the lot page at `/sc/auction/listings/<slug_2>`.
2. Read the lot title and description.
3. Read the rest of the page's copy, such as the bid panel.

**Expected Results:**

* Step 2 reads `<english title>` and `<english description>` as the operator wrote them.
* Step 2 shows no translation made at read time.
* Step 3 reads in Simplified Chinese from the site's own catalogue.

<!-- trace:case id=g10.shared-localization.TC-15d rev=1 covers=g10.auction-listing-page.SC-9yd -->
### g10.shared-localization.US1-TC4: Other surfaces that name a listing keep its English title on a Chinese page

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Source-language content

**Pre-conditions:**

* customer is signed in and browsing in Traditional Chinese.
* `<listing_3>` has a Traditional Chinese title and is in the state the row needs.

**Test data:**

| Field | Value |
| --- | --- |
| listing_3 | A published listing with English title `<english title>` and Traditional Chinese title `<traditional title>` |
| english title | Charizard PSA 10 |
| traditional title | 寶可夢 噴火龍 PSA 10 |

| where | state the row needs |
| --- | --- |
| The Featured carousel | `<listing_3>` is a Featured slide |
| My Auctions | customer has bid on `<listing_3>` |
| The watchlist | customer watches `<listing_3>` |
| The account record | customer's account record names `<listing_3>` |
| A winner order page | customer won `<listing_3>` |

**Steps:**

1. Open `<where>` with the language prefix `/tc`.
2. Find `<listing_3>`.
3. Read the title it is shown under.

**Expected Results:**

* Step 3 reads `<english title>`.
* Step 3 does not read `<traditional title>`.

<!-- trace:case id=g10.shared-localization.TC-xle rev=1 -->
### g10.shared-localization.US1-TC5: Emails about a lot name it by its English title

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Source-language content

**Pre-conditions:**

* customer is browsing in Traditional Chinese and has bid on `<listing_3>`.
* `<listing_3>` has a Traditional Chinese title.

**Test data:**

| Field | Value |
| --- | --- |
| listing_3 | A published listing with English title `<english title>` and Traditional Chinese title `<traditional title>` |
| english title | Charizard PSA 10 |
| traditional title | 寶可夢 噴火龍 PSA 10 |

| email |
| --- |
| The email sent when the customer is outbid |
| The email sent when the customer wins |

**Steps:**

1. Cause the email named by `<email>` to be sent for `<listing_3>`.
2. Read the email.

**Expected Results:**

* Step 2 names the lot by `<english title>`.
* Step 2 does not name it by `<traditional title>`.

---

## Reconciliation

**Run:** 2026-10-14, QA2 in a fresh context, after QA1's blind pass (5 draft cases from the frozen anchor, `proposal.md` and `decisions.md`) and Dev's independent delta. It read this suite, the delta's `spec.md`, the durable `shared/localization` spec and journeys, `decisions.md` with `## Raised`, `tech-design.md`, `tasks.md` and the [Localization](/p/platform/shared/localization) page. No case was written or reworded from a scenario, and every case stays `draft`. QA1's own bundle line is not in the draft; the planning run adds it.

- **Linked** - `g10.shared-localization.US1-TC2` asserts `shared-localization-SC-40`; `US1-TC4` asserts `grade10-site-auction-listing-page-SC-69` on its five rows (a case here may cover a scenario of another capability, and the question of which capability owns the check is Raised below)
- **Jointly asserted, not linked** - `shared-localization-SC-41` is split between `US1-TC3` (the Simplified Chinese address) and `grade10-site-auction-listing-page` `US16-TC5` (the Traditional Chinese and the default address). One `/tc` row on `US1-TC3` would close it
- **Partly asserted, not linked** - `grade10-admin-auction-listing-SC-193` by `US1-TC5`: the outbid and won emails name the English title; the Listings table, the order and invoice screens and the Slack alert are other cases' or no case's
- **Uncovered** - `shared-localization-SC-42` (a store product whose inventory record holds a Traditional Chinese name still renders as authored): `US1-TC1` names a product "with no translation of it anywhere", the opposite state, and reads neither the page's own copy nor the product's description. It owes a row with a translated product, or a case. This is the one scenario that proves the exception is narrow
- **Carried** - the durable `shared-localization-SC-03` (a product listing's title renders as authored) is unchanged. "Listing" there could be read as a lot, which the exception now overrides; the delta adds the exception beside it and does not reword it. `US1-TC1` walks the durable rule on three rows
- **Cases with no scenario** - `US1-TC2` also expects the first image's alt text to read the English title and the campaign title as written. Both are stated (the admin delta's alt text sentence, decision 19, the Non-Goals) and neither has a scenario. The alt text is the contradiction in the site suite's reconciliation: `tech-design.md` D5 would make it the translated title
- **Over-claimed** - none
- **Contradicted** - none between a case and a scenario
- **Raised, settled** - every row this pass raised is landed in `decisions.md` (Q7 to Q40, the human's defaults); the open PM confirmations are Q43 and Q49 in `decisions.md`; no case waits on a row
- **Anchors** - `Source-language content` is the one anchor of this walked-by-nobody capability; all five cases trace it. The delta's feature set has one sub-line under it and the durable line is not restated
- **After the human's reply (2026-10-14)** - `shared-localization-SC-42` is verified by task 3.2 and the store-page walk; rows settled in `decisions.md` 13 and 19
