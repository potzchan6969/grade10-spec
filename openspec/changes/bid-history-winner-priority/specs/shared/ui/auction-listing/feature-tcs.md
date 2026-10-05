# shared/ui/auction-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-05, tcs-rules r4

## shared-ui-auction-listing-US1: The listing page blocks' rendering contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/auction/listing-page`, which composes the blocks

**As a** customer,
**I want** the lot page's blocks to show the gallery, my bidding and its disclosures as the contract states,
**so that** every storefront composing them shows me the same thing.

### shared-ui-auction-listing-US1-TC27-1: Closed sold Recent bids show a winner crown

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Public bid history outcome

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → ClosedSoldEqualMax: a closed sold lot whose first Recent bids row has `isWinner` true, with bid history copy `winner` set to `Winner`.
* Storybook renders `ListingAuctionBidCard` → Default: a live lot whose Recent bids rows carry no `isWinner`, with the same copy.

**Steps:**

1. On ClosedSoldEqualMax, read the first Recent bids row.
2. On Default, read every Recent bids row.

**Expected Results:**

* Step 1: the row shows a crown in the primary colour after the amount, with accessible name Winner.
* Step 2: no row shows a crown.

### shared-ui-auction-listing-US1-TC28-1: Equal-max non-leader shows earlier-leads tip

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Public bid history outcome

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → ClosedSoldEqualMax: its second Recent bids row has the first row's amount and `samePricePriority` true, with bid history copy `samePricePriorityTip` set to `When maximums match, the earlier one leads.`

**Steps:**

1. On the second Recent bids row, hover the Info control after the amount.
2. Read the tooltip.

**Expected Results:**

* Step 1: the Info icon shows in the same tone as the row's amount.
* Step 2: the tooltip reads When maximums match, the earlier one leads.

## Settled

- Winner is a primary crown after the amount when the consumer sets
  `isWinner` (closed sold), not a Winner badge.
- Equal-max non-leaders use the Info tip in the amount tone with
  earlier-leads copy.
- No new Badge size or footnote under Recent bids.

## Reconciliation

**Run:** Blind pass read Purpose (durable), Feature set (delta),
user-journeys.md, proposal.md, decisions.md (goals, non-goals, Q1-Q3),
ui-design.md with state dispositions stripped to the Public bid history
outcome anchor, PRD Bid History / Auction Panel Winner lines, and durable
feature-tcs.md for id continuity with Reconciliation stripped. Denied:
every Requirements section, openspec/specs/ beyond those excerpts,
openspec/changes/archive/.

**Run:** QA2 reconciliation 2026-10-05, for change `bid-history-winner-priority`. Read the blind cases above, this delta `spec.md` after the accept-review fixes, `proposal.md`, `decisions.md` (Q1 to Q3), `ui-design.md`, `tech-design.md`, `tasks.md`, the PRD lines on Bidding · Auction Panel and Listing Page Blocks · Bid History, the durable spec and suite, `cap-custom-maximum-entry`'s and `lot-gallery-strip-by-width`'s suites on this capability, and the build: `listing-bid-history-list.tsx`, `types.ts`, the ClosedSoldEqualMax and Default plays in `listing-auction-bid-card.stories.tsx`, and the `en` catalog. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| Closed sold winning row shows a winner crown | **Folded in:** `shared-ui-auction-listing-SC-50` / `shared-ui-auction-listing-US1-TC27-1` |
| Equal-max non-leader shows earlier-leads tip | **Folded in:** `shared-ui-auction-listing-SC-51` / `shared-ui-auction-listing-US1-TC28-1` |
| Live lots must not show a winner crown without `isWinner` | **Folded in:** `shared-ui-auction-listing-SC-50`'s AND; TC27 now walks Default as its own step and pre-condition, where it was an expected result with no setup |
| Raised questions from the blind pass | None - Q1 to Q3 already settled closed-only winner mark, tooltip vs footnote, and Badge reuse |
| Accept-review, 2026-10-05: case ids `TC13` and `TC14` were the durable suite's personal bid history cases, which the fold would have overwritten | **Renumbered:** `shared-ui-auction-listing-US1-TC27-1` and `shared-ui-auction-listing-US1-TC28-1`; `cap-custom-maximum-entry` takes `TC19` to `TC26` and `lot-gallery-strip-by-width` `TC10` to `TC12`, so neither collides with this change |
| `shared-ui-auction-listing-SC-50` now draws the crown only with `copy.winner` supplied; TC27 supplied none | **Folded in:** TC27's pre-conditions supply `winner` as `Winner`, as both stories' copy does |
| TC27 and TC28 were `automated`, decided by the story plays; the plays assert only that a `Winner` name and the tip's name exist, not the crown's place or colour nor the icon's tone | **Reclassified:** `manual`, Decided-by line dropped; the cases are walked under task 3.1. A play that asserts the rest flips them with `pnpm run tcs:automated` |
| TC27 and TC28 were `e2e`, both `smoke` | **Reclassified:** `unit`, as every Storybook case in the durable suite; `regression, release`, since a missing crown or tip leaves the journey usable and a journey holds at most one smoke case |
| TC28 read the accessible name in place of activating the control | **Folded in:** its steps hover the Info control and read the tooltip, `shared-ui-auction-listing-SC-51`'s WHEN |
| TC28 asserts the Info icon in the amount's tone, decided by Q2 and stated by the requirement, which no scenario's THEN carries | **Kept:** Q2 settles it; reported to Dev to add as an AND on `shared-ui-auction-listing-SC-51` |
| The requirement draws no crown where `copy.winner` is absent, and places the crown after any Info control and before You; no scenario states either | **Reported:** to Dev for a scenario; task 2.4 builds the first. No case is written for behaviour no scenario states |
| The section carried its own journey title and an application as actor, where the durable suite's `US1` names the listing page blocks and a customer | **Folded in:** heading, Walked-by line and statement copied from the durable suite |
| Facts across the PRD lines, Q1 to Q3, `ui-design.md`, `tech-design.md`, the delta and the cases | **Agree:** primary filled crown after the amount, named by consumer copy, only on a closed sold lot; Info tip in the amount tone, reading when maximums match, the earlier one leads |

**Uncovered anchors:** none. Public bid history outcome's three items - winner crown, equal-max tip, live lots - each have a case; both scenarios are asserted.
