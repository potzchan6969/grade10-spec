# grade10-site/auction Cross-Feature E2E Test Cases

**Status:** reopened · 0/1
**Reviewed:** 2026-09-29, tcs-rules r4, lapsed 2026-10-02
**Drafts styled:** 2026-10-08, tcs-rules r4

## g10.auction-dmn.US11: Collector follows an old link to a hidden lot

**As a** collector,
**I want** a called-off lot gone from browse and search,
**so that** its former address answers the current lot or Page not found.

<!-- trace:case id=g10.auction-dmn.TC-dw9 rev=4 covers=g10.auction-lot-status.SC-pe2 -->
### g10.auction-dmn.US11-TC1: Released address follows its new public holder

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
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

**Run:** QA2 repair pass, 2026-10-13, after the re-key to durable case ids and the lot-status Bidder exception repair. Read the 3 deltas, their journeys and the durable site and admin auction suites. Cases were reconciled against the delta scenarios' trace ids; no scenario text shaped a case, and only bodies the pass read were linked.

- **Disposition** - TC-dw9@4 now carries one link, SC07 (the catalogue and search no longer list the called-off lot). It was linked to SC06, SC07, SC08, SC13, SC-11, SC54 and SC55. None of the others is asserted by this route: it has no draft or unsold control (SC06), no watchlist step (SC08), no listing-data read (SC-11), no code-only request (SC13), no client navigation or client lookup (SC54) and no served metadata or hydration read (SC55). The earlier line that the case received no link is corrected by this one. Those scenarios stay covered by TC-7m2@4, TC-x03@2, TC-2it@3 and durable lot-status cases.
- **Coverage** - No uncovered scenario at this level. The case asserts the new outcome: 404 before reuse, the new holder's page after reuse, the bidder row unchanged, the code reserved. It is the one domain case on the released-address path and is traced at domain by US-02, US-03 and US-01.
- **Contradictions** - None in this delta: Walk 3 steps 7-15 matched TC-dw9@4. The old case title and 200 result are replaced.
- **Decision** - None new. Q1-Q4 stay settled.
- **Classification** - New and changed active cases remain draft. No runtime execution or human approval is claimed.

**Run:** Walk repair, 2026-10-25, after `usd-lot-currency-winner-settlement-choice` archived. The three carried walks were catch-alls that named cases this delta does not define, and the regenerated durable suite no longer holds them. They are removed; TC-dw9@4 is unchanged.
