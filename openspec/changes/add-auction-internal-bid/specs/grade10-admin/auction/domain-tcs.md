# grade10-admin/auction Cross-Feature E2E Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-admin-auction-e2e-US4: Admin protects a lot, the house buys it in, and the card goes back on sale

**As an** auction admin,
**I want** a lot the house buys in to free its stock and offer Relist without the internal bid,
**so that** the card goes back on sale behind a floor I choose again.

<!-- trace:case id=g10adm.auction-domain.TC-98w rev=1 covers=g10adm.auction-internal-bid.SC-dq6,g10adm.auction-internal-bid.SC-glg,g10adm.auction-internal-bid.SC-hat,g10adm.auction-listing.SC-02v,g10adm.auction-listing.SC-khm,g10adm.auction-listing.SC-qgd,g10adm.auction-listing.SC-hfn -->
### grade10-admin-auction-e2e-US4-TC1-1: A bought-in lot releases its stock and relists with no internal bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-01, grade10-admin-auction-internal-bid-US-06, grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_4>` is published in no campaign, taking bids, holding `<held quantity>` units of `<product_4>`, with no internal bid.
* customer A leads `<listing_4>` at `<starting price>` with maximum `<user A maximum>`, and will not bid again.
* admin(holds auction:reserve and auction:operate) is on `<listing_4>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | A published HKD listing for `<product_4>`, starting price `<starting price>`, scheduled close an hour away, extension duration 1800s (30mins) |
| `<product_4>` | A product with `<available before>` units available beside the hold |
| `<held quantity>` | 2 units (any quantity from 1 to 500) |
| `<available before>` | 3 units (any count) |
| `<starting price>` | 400000 minor units (HK$4,000.00) |
| `<user A maximum>` | 500000 minor units (HK$5,000.00) |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<commit time>` | 10 minutes from now |
| `<final price>` | 508000 minor units: `<user A maximum>` plus its 8000 increment |
| `<close date>` | The date `<listing_4>`'s close passes |

**Steps:**

1. In the Internal bid section, enter `<house maximum>` and `<commit time>`, and click Save.
2. Wait until `<commit time>` passes, then read the Internal bid section.
3. Wait until `<listing_4>`'s close passes, taking no action.
4. Reload <grade10 auction admin listings url> and read `<listing_4>`'s row.
5. Open `<listing_4>` and read its status and stock note.
6. Read `<product_4>`'s available count on its product page.
7. Open the lot page for `<listing_4>` as customer A.
8. Click Relist on `<listing_4>`'s row in the Listings table.
9. Read the new draft's form, the Internal bid section included.

**Expected Results:**

* Step 2 shows the internal bid committed at `<commit time>`.
* Step 4: the row reads Bought in and offers Relist.
* Step 5 says the stock was released on `<close date>`.
* Step 6 reads `<available before>` plus `<held quantity>`.
* Step 7 reads Did not win, the lot sold at `<final price>`.
* Step 9 shows the editor filled in for `<product_4>`, quantity `<held quantity>`, starting price `<starting price>`, with no window.
* Step 9: the Internal bid section holds no amount and no time.

## Reconciliation

**Run:** QA2, 2026-10-08. QA1's levels pass composed these paths from every `user-journeys.md` in the domain and the domain's PRD pages, before the feature readings and without any `## Requirements` section, `tech-design.md` or the archive. QA2 joined each composed case to the scenarios its journeys accept, after Q26 to Q29 landed. It is a statement, not proof.

- **Folded in** - `grade10-admin-auction-e2e-US4-TC1-1` walks `grade10-admin-auction-internal-bid-US-01`, `grade10-admin-auction-internal-bid-US-06` and `grade10-admin-auction-listing-US-09`, asserting `grade10-admin-auction-internal-bid-SC-01`, `grade10-admin-auction-internal-bid-SC-08`, `grade10-admin-auction-internal-bid-SC-17`, `grade10-admin-auction-listing-SC-147`, `grade10-admin-auction-listing-SC-148` and `grade10-admin-auction-listing-SC-149`; its step 5 asserted the released note for a bought-in lot, which no scenario stated, and became `grade10-admin-auction-listing-SC-154`
- **Corrected** - step 9 read a new draft; Relist opens an unsaved editor, so it now reads the editor filled in, with no window
- **Rejected** - none
- **Raised** - none
- **Uncovered anchors** - none
