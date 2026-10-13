# grade10-site/auction Cross-Feature E2E Test Cases

**Status:** reopened · 0/1
**Reviewed:** 2026-09-29, tcs-rules r4, lapsed 2026-10-02
**Drafts styled:** 2026-10-08, tcs-rules r4

## grade10-site-auction-e2e-US11: Collector follows an old link to a hidden lot

**As a** collector,
**I want** a called-off lot gone from browse and search,
**so that** its former address answers the current lot or Page not found.

<!-- trace:case id=g10.auction-domain.TC-dw9 rev=4 -->
### grade10-site-auction-e2e-US11-TC01-4: Released address follows its new public holder

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-02, grade10-site-auction-listing-page-US-03, grade10-site-auction-listing-page-US-01, grade10-site-auction-lot-status-US-03


**Pre-conditions:**

* `<lot_1>` was published and listed in the catalogue, then an operator called it off.
* customer A bid on `<lot_1>` before call off.
* `<original_code>` is its reserved code from admin.
* The account history was recorded before call off.
* customer A has `<lot_1 address>` saved from when `<lot_1>` was published.
* `<lot_2>` is a complete draft holding the released slug, with a different title.

**Test data:**

| Field | Value |
| --- | --- |
| lot_1 | A lot that was published, listed in the catalogue, then called off by an operator |
| lot_1 address | The address of `<lot_1>` from when it was published |
| lot_2 | A replacement draft with the same slug and a different title |

**Steps:**

1. Navigate to `<grade10 auction url>`.
2. Search the catalogue for the title of `<lot_1>`.
3. Navigate to `<lot_1 address>`.
4. As customer A, read `<lot_1>` in My Auctions.
5. As admin(holds auction:operate), read `<lot_1>`'s code.
6. Create `<lot_2>`.
7. Publish `<lot_2>`.
8. As customer A, navigate to `<lot_1 address>`.
9. Navigate to `<grade10 my auctions url>`.
10. As admin(holds auction:operate), reopen `<lot_1>`.
11. As customer A, search its original title in the catalogue.

**Expected Results:**

* Step 2: `<lot_1>` does not appear in the catalogue.
* Step 3 returns 404 and Page not found.
* Step 8 returns 200 and `<lot_2>`'s page.
* Step 8 shows `<lot_2>`'s title, not `<lot_1>`'s.
* Step 9 still lists `<lot_1>` for customer A.
* Steps 4 and 9 retain `<lot_1>`'s original bids/history.
* Both rows say the card was not charged.
* Neither row links to `<lot_2>`.
* Step 5 keeps `<original_code>` reserved on `<lot_1>`.
* The replacement has a different code.
* Step 10 shows canceled with `<original_code>` unchanged.
* Step 11 does not find `<lot_1>`.
* `<lot_1>` stays out of public browse and watchlist after reuse.

---

## Reconciliation

**Run:** QA2, 2026-10-12. QA1 used frozen bundle `02ba99d366a1f619b3df386916067b23a31ec77462132a92d7eddd4bd474713f`. QA2 read both independent readings, all 3 deltas, the complete feature maps, current and durable journeys, durable context, and the linked owner decisions. Case dispositions were recorded before scenario links.

- **Disposition** - TC-dw9@4 checks the original code and no-charge bidder history before and after reuse, with public removal and replacement lookup. It does not drive cancellation, the non-bidder session or full metadata/hydration, so it receives no scenario link for those outcomes. SC14 is fully checked by lot-status TC-byf@3; SC55 by listing-page TC-2it@3. The other 26 inherited cases retain their identities, bodies and classifications.
- **Coverage** - Complete case and scenario dispositions, source locations, anchor coverage and carried baseline findings are in the QA2 handoff. Missing scenario links are explicit gaps, not inferred coverage.
- **Decision** - All called-off original slugs are reusable, including earlier records. The eligible current holder answers; otherwise the address is not found. Codes stay reserved and do not become public routes. Bidder history stays with the original listing. Q1-Q4 are settled.
- **Classification** - New and changed active cases remain draft. No runtime execution or human approval is claimed.
