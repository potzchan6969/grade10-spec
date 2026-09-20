# shared/ui/auction-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## shared-ui-auction-listing-US1: The bid panel's rendering contract

**As an** application composing the shared bid panel,
**I want** every standing and every disclosure to render exactly as the
contract states,
**so that** each storefront embedding the panel shows collectors the same thing.

### shared-ui-auction-listing-US1-TC1-1: Buyer fee shows inline at 20%

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Buyer-fee disclosure

**Pre-conditions:**

* Storybook or preview renders `ListingAuctionBidCard` for a signed-in
  collector on an open listing.

**Steps:**

1. Open the bid panel footer.
2. Read the copy under the primary bid action.

**Expected Results:**

* Secondary copy states that a 20% buyer fee is added on top of the winning
  bid.
* No buyer-fee info tooltip is present.

### shared-ui-auction-listing-US1-TC2-1: Signed-out panel omits the fee line

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Buyer-fee disclosure

**Pre-conditions:**

* `ListingAuctionBidCard` renders with `bidEnrollment` `signed-out`.

**Steps:**

1. Render the card.
2. Look for the buyer-fee line.

**Expected Results:**

* The buyer-fee line is absent.

## Raised

- None; this change introduces no unresolved product question.
