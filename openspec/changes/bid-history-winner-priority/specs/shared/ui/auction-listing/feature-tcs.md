# shared/ui/auction-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-30, tcs-rules r3.0

## shared-ui-auction-listing-US1: The bid panel's rendering contract

**As an** application composing the shared bid panel,
**I want** every standing and every disclosure to render exactly as the
contract states,
**so that** each storefront embedding the panel shows collectors the same thing.

### shared-ui-auction-listing-US1-TC27-1: Closed sold Recent bids show a winner crown

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Public bid history outcome

**Decided by:** `packages/ui/src/blocks/auction-listing/listing-auction-bid-card.stories.tsx`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → ClosedSoldEqualMax with the
  winning public row `isWinner` true.

**Steps:**

1. Read the Recent bids list.

**Expected Results:**

* The winning row shows a crown with accessible name Winner after the amount.
* A live Default story without `isWinner` shows no winner crown.

### shared-ui-auction-listing-US1-TC28-1: Equal-max non-leader shows earlier-leads tip

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Public bid history outcome

**Decided by:** `packages/ui/src/blocks/auction-listing/listing-auction-bid-card.stories.tsx`

**Pre-conditions:**

* Storybook renders ClosedSoldEqualMax with a same-price non-leading row
  `samePricePriority` true and equal-max tip copy.

**Steps:**

1. Find the Info control on the equal-max non-leading row.
2. Read its accessible name / tooltip content.

**Expected Results:**

* The tip states that when maximums match, the earlier one leads.
* The Info icon matches the amount text tone.

## Settled

- Winner is a primary crown after the amount when the consumer sets
  `isWinner` (closed sold), not a Winner badge.
- Equal-max non-leaders use the Info tip in the amount tone with
  earlier-leads copy.
- No new Badge size or footnote under Recent bids.

## Reconciliation

**Run:** Blind pass read Purpose (durable), Feature set (delta),
user-journeys.md, proposal.md, decisions.md (goals, non-goals, Q1–Q3),
ui-design.md with state dispositions stripped to the Public bid history
outcome anchor, PRD Bid History / Auction Panel Winner lines, and durable
feature-tcs.md for id continuity with Reconciliation stripped. Denied:
every Requirements section, openspec/specs/ beyond those excerpts,
openspec/changes/archive/.

| Finding | Disposition |
| --- | --- |
| Closed sold winning row shows a winner crown | Folded as covered by `shared-ui-auction-listing-SC-50` / `shared-ui-auction-listing-US1-TC27-1` |
| Equal-max non-leader shows earlier-leads tip | Folded as covered by `shared-ui-auction-listing-SC-51` / `shared-ui-auction-listing-US1-TC28-1` |
| Live lots must not show a winner crown without `isWinner` | Folded into `shared-ui-auction-listing-SC-50` |
| Raised questions from the blind pass | None — Q1–Q3 already settled closed-only winner mark, tooltip vs footnote, and Badge reuse |
| Accept-review, 2026-10-05: case ids `TC13` and `TC14` were the durable suite's personal bid history cases, which the fold would have overwritten | **Renumbered:** `shared-ui-auction-listing-US1-TC27-1` and `shared-ui-auction-listing-US1-TC28-1`; `cap-custom-maximum-entry` takes `TC19` to `TC26` |
