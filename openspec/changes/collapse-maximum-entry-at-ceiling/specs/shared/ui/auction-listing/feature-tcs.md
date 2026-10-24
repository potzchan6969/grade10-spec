# shared/ui/auction-listing Test Cases

**Status:** pending-review · 0/5
**Drafts styled:** 2026-10-13, tcs-rules r4

## g10.shared-auction-listing.US1: The listing surface's rendering contract

**Walked by:** nobody on their own - a component contract; the journeys live in `grade10-site/auction/listing-page`, which composes the blocks

**As an** application composing the shared bid panel,
**I want** the panel to never offer an amount the supplied currency ceiling refuses,
**so that** the collector reads the limit instead of a broken raise form.

<!-- trace:case id=g10.shared-auction-listing.TC-dej rev=1 covers=g10.shared-auction-listing.SC-huw -->
### g10.shared-auction-listing.US1-TC59: A quick bid above the ceiling is offered at the ceiling

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Quick bids

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in the row's currency.
* The collector leads with the row's committed maximum.
* The row's chips hold at least one amount above the ceiling and at least one below it.

**Test data:**

| Currency | Ceiling (major) | Committed maximum (major) | Increment (major) | Chips offered |
| --- | --- | --- | --- | --- |
| HKD | 80000000 | 79999800 | 100 | 79999900, 80000000, 80000000 |
| HKD | 80000000 | 79999700 | 100 | 79999800, 79999900, 80000000 |

**Steps:**

1. Read each quick-bid chip's caption and amount.
2. Select the chip whose stepped amount exceeds the ceiling.
3. Commit the maximum and read the callback amount.

**Expected Results:**

* Every chip amount is at or below the ceiling.
* A chip whose stepped amount exceeds the ceiling shows the ceiling and is captioned as the auction's limit, not the amount's delta.
* A chip at or below the ceiling keeps its stepped amount and caption.
* Committing a clamped chip passes the ceiling in minor units.

<!-- trace:case id=g10.shared-auction-listing.TC-w4r rev=1 covers=g10.shared-auction-listing.SC-atq -->
### g10.shared-auction-listing.US1-TC60: Chips clamped onto the same amount merge to one

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Quick bids

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in HKD.
* The collector leads with a committed maximum of `79999900`, and the increment is `100`, so all three stepped amounts land at or above the `80000000` ceiling.

**Steps:**

1. Read the quick-bid chip row.
2. Select the chip and commit.

**Expected Results:**

* The row shows one chip at `80000000`, captioned as the limit; no duplicate amount appears twice.
* The callback receives `8000000000` minor units.

<!-- trace:case id=g10.shared-auction-listing.TC-9rx rev=1 covers=g10.shared-auction-listing.SC-1mi,g10.shared-auction-listing.SC-v6g -->
### g10.shared-auction-listing.US1-TC61: A maximum at the ceiling collapses the entry group

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Raise floor

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in HKD with the `80000000` ceiling.
* The collector leads with the row's committed maximum and current bid.

**Test data:**

| Committed maximum (major) | Current bid (major) | Floor driving the collapse |
| --- | --- | --- |
| 80000000 | 1200 | maximum plus the minimum raise |
| 79999950 | 79999950 | minimum next bid 80000050, already above the ceiling |

**Steps:**

1. Read the raise group on the bid panel.
2. Look for quick-bid chips, the custom maximum field and the bid action.
3. Read the status row and the copy under it.

**Expected Results:**

* No quick-bid chip, no custom maximum field and no bid action render.
* A status row leads with `Max: 80000000` in the first row, and with `Max: 79999950` in the second.
* The row carries the private-maximum explanation behind its Info tooltip and one line that the auction accepts no higher amount; the raise mechanism line does not appear.
* The buyer-fee line still renders.

<!-- trace:case id=g10.shared-auction-listing.TC-5dh rev=1 covers=g10.shared-auction-listing.SC-cfl -->
### g10.shared-auction-listing.US1-TC62: A lot priced past the ceiling offers no entry

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Raise floor

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in HKD with the `80000000` ceiling.
* The lot's minimum next bid is above the ceiling.
* The collector holds no maximum on the lot.

**Steps:**

1. Read the bid panel's entry group.

**Expected Results:**

* No quick-bid chip, no custom maximum field and no bid action render.
* A status row names the ceiling amount and a line that bidding has reached the highest amount the auction accepts.
* The buyer-fee line still renders.

<!-- trace:case id=g10.shared-auction-listing.TC-swf rev=1 covers=g10.shared-auction-listing.SC-rnz -->
### g10.shared-auction-listing.US1-TC63: The collapse outranks the card setup lock

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Bid enrollment

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` under the needs-card enrollment signal.
* The collector leads with a committed maximum at the HKD ceiling.

**Steps:**

1. Read the bid panel's entry group.

**Expected Results:**

* The collapsed status row renders; the disabled chips, custom field and link-card action do not.

## Settled

- The field uses the listing currency's bid ceiling: USD 10,000,000, HKD 80,000,000 and JPY 5,000,000,000 whole major units (`cap-custom-maximum-at-currency-ceiling` Q1).
- Chips step 1×, 2× and 4× the increment - from the committed maximum for a leader, from the current bid otherwise; a leader's typed floor is the maximum plus 100 minor units and is not chip 1.
- Ceiling correction of a typed draft shows no maximum-bid or invalid-amount message; set and raise share the rule.
- A lost standing on the bid card is the Did not win badge alone; that the card was not charged is said on My Auctions, never on the lot card.

## Reconciliation

**Run:** QA1 read the frozen anchors - the feature-set groups, the walked-by-nobody journeys line, the proposal, the decisions and the UI states - and drafted cases without the requirement texts or scenarios. QA2 reconciled each case against the scenarios Dev wrote, adding the `covers` links below.

| Blind case | Disposition | Scenario claims verified |
| --- | --- | --- |
| US1-TC59 | **Folded in** - a stepped amount above the ceiling is offered at the ceiling and captioned as the limit; unclamped chips keep their stepped amount; a committed clamped chip passes the ceiling in minor units | SC-61 |
| US1-TC60 | **Folded in** - chips clamped onto the same amount merge to one chip | SC-62 |
| US1-TC61 | **Folded in** - both collapse readings: a maximum at the ceiling and a floor pushed past it by the minimum next bid; the row leads with `Max`, keeps the Info explanation, drops the raise-mechanism line and keeps the buyer fee | SC-63, SC-64 |
| US1-TC62 | **Folded in** - a viewer holding no maximum sees the ceiling amount and the limit line, with the fee line intact | SC-65 |
| US1-TC63 | **Folded in** - the collapse renders ahead of the needs-card lock | SC-66 |

- **Continuity** - Unchanged cases stay in the durable suite and are retained by the acceptance fold; they are not copied into this active suite.
- **Tasks** - Group 1 owns the shared helpers, component, catalogs, fixtures, stories and verification; group 2 owns consumer copy supply; the walk is group 3. This records planned verification, not executed test results.
- **Questions** - None. Q1 to Q5 settle the collapse, the trigger, the fee line and the clamp.
