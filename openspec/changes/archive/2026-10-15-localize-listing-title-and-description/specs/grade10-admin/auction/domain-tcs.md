# grade10-admin/auction Cross-Feature E2E Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-14, tcs-rules r5

## g10adm.auction-dmn.US5: Operator writes a lot in two languages, a collector reads it, and staff keep quoting the English title

**As an** auction operator,
**I want** to write a lot's title and description in a collector's language, and every staff screen to keep quoting the English title,
**so that** the collector reads the lot in their own language while staff and the collector's support contact name one lot the same way.

<!-- trace:case id=g10adm.auction-dmn.TC-22w rev=1 covers=g10adm.auction-listing.SC-let,g10adm.auction-listing.SC-6es -->
### g10adm.auction-dmn.US5-TC1: A lot written in two languages is read by a collector and quoted by staff in English

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-auction-listing-US-75, grade10-admin-auction-listing-US-76, grade10-admin-auction-listing-US-77, post-sale-US-02

**Pre-conditions:**

* admin(holds auction:operate and payment-processing) is on `<grade10 auction admin listings url>`.
* `<listing_1>` is a draft with every field Create needs, `<english title>` and `<english description>`, a close `<close>` after publish, and no Traditional or Simplified Chinese text.
* customer A (signed in, card linked) is on `<g10 site url>` in a second session.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A listing in USD, slug `<slug_1>`, English title `<english title>`, English description `<english description>`, with product, quantity, starting price, window and media |
| slug_1 | the address built from the English title and the listing code |
| close | 5 minutes after publish (any close after the start and after now) |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |
| traditional fragment | 噴火龍 |

**Steps:**

1. Open `<listing_1>` and enter `<traditional title>` and `<traditional description>` as the Traditional Chinese title and description.
2. Click Save, then Create, then Publish now.
3. As customer A, open the lot page at `/tc/auction/listings/<slug_1>` and read the title and description.
4. As customer A, open the lot page at `/sc/auction/listings/<slug_1>` and read the title and description.
5. As customer A, open the lot page at `/auction/listings/<slug_1>` and read the title and description.
6. As customer A, open the catalogue at `/tc/auction` and read the card of `<listing_1>`.
7. As customer A, place a bid on the lot page at `/tc/auction/listings/<slug_1>`.
8. Wait until `<close>` has passed.
9. As the admin, open Listings, type `<traditional fragment>` in the Listings search and read the row.
10. As the admin, open the order of `<listing_1>` from the Orders worklist and read the lot title.
11. As the admin, open `<listing_1>`, choose Traditional Chinese in the Copy block's language choice and read the title and description.
12. Choose Simplified Chinese in the Copy block's language choice and read the title and description.

**Expected Results:**

* Step 2 publishes the listing.
* Step 3 reads `<traditional title>` and `<traditional description>`.
* Step 4 reads `<english title>` and `<english description>`, with no Traditional Chinese character.
* Step 5 reads `<english title>` and `<english description>`.
* Step 6 reads `<traditional title>` as the card title.
* Step 7 commits the bid.
* Step 9 lists `<listing_1>` once, under `<english title>`.
* Step 10 reads `<english title>`.
* Step 11 shows the Traditional Chinese title and description, not marked as the fallback.
* Step 12 shows `<english title>` and `<english description>`, both marked as the fallback.

---

## Reconciliation

**Run:** 2026-10-14, QA2 in a fresh context, after QA1's levels pass (one composed case, written from the domain's journeys and PRD pages and decision 25) and Dev's delta. It read this draft, the durable `domain-tcs.md` it joins, the four delta suites, the scenarios, `decisions.md` and `tasks.md`. The case stays `draft`.

- **Disposition** - `g10adm.auction-dmn.US5-TC1` is kept. It guards the one path no feature case walks: the operator writes a language, the collector reads it, and staff keep quoting the English title. It traces two capabilities of the domain (`grade10-admin-auction-listing-US-75`, `grade10-admin-auction-listing-US-76`, `grade10-admin-auction-listing-US-77` and `post-sale-US-02`), as a domain case must. Its collector steps follow the precedent of the durable `grade10-admin-auction-e2e-US1-TC1-1`
- **Linked** - it asserts `grade10-admin-auction-listing-SC-183` (step 12) and `grade10-admin-auction-listing-SC-185` (step 9). It is not recorded as **Covered at domain** for any scenario: each of those also has a feature case, and the collector reads are the browser route, not the response HTML the site scenarios name
- **Partly asserted** - `grade10-admin-auction-listing-SC-193` by steps 9 and 10 (the table row and the order screen); the invoice screen, the won email and the Slack alert are not read. `grade10-site-auction-listing-page-SC-66` is not asserted: step 7 bids at `/tc` and the case reads no text after it
- **Contradicted** - none
- **Raised** - none of its own
- **Uncovered anchors** - none. The journey `g10adm.auction-dmn.US5` is not named by any walk task: group 8 of `tasks.md` walks the feature journeys but not this domain case, so a task 8.x owes it
- **Shape** - the draft is styled r5 (`g10adm.auction-dmn.US5`) and the durable file r4 (`grade10-admin-auction-e2e-US*`); the journey number 5 follows the durable US4, and the fold joins by number
