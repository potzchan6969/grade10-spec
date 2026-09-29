# grade10-site/auction Cross-Feature E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4

## grade10-site-auction-e2e-US03: Collector links a card and places a first bid

**As a** collector,
**I want** to study the gallery, link my card once, and bid inside the window,
**so that** the card I looked at is the card my hold is taken against.

### grade10-site-auction-e2e-US03-TC01-2: Gallery study leads to an accepted first bid

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05, grade10-site-auction-auction-US-02, grade10-site-auction-auction-US-03

**Pre-conditions:**

* A user is signed in with <card> saved and is on <listing_5>.
* <listing_5> is live, holds no bids, and its starting price is <starting price>.
* <listing_5> holds more than one gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<card>` | Visa ending 4242 |
| `<listing_5>` | A live listing with no bids, several gallery images, in HKD |
| `<starting price>` | 120000 minor units |
| `<bid amount>` | 124000 minor units, <starting price> plus the HKD step of 4000 at <starting price> |

**Steps:**

1. Step through the gallery thumbnails and open one image at zoom size.
2. Enter <bid amount> in the bid field and select **Place Bid**.
3. Read Time left, Highest bid and Recent Bids.

**Expected Results:**

* The gallery walks in order at thumb, detail and zoom sizes.
* The bid is accepted and one hold for <bid amount> stands against <card>.
* Highest bid reads <starting price>, where a lone first bid stands, the bid count reads 1, and Recent Bids shows the user's own bid as You.

## Reconciliation

**Run:** the level check of `allow-zero-starting-price`, by the run itself; the case was found by the `grade10-site/auction/auction` blind pass, which reads this suite.

- **Revised:** `grade10-site-auction-e2e-US03-TC01-1` bid at the starting price, which the first-bid rule this change states (Q12) refuses; as `grade10-site-auction-e2e-US03-TC01-2` it bids the starting price plus its tier increment and reads the lot standing at the starting price, back to `draft` until its automated test asserts the new amount.
- **No change:** the cases where a lone maximum leads at a positive starting price keep their result; that price is unchanged.
