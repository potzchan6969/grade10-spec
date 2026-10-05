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

* Storybook renders `ListingAuctionBidCard` → ClosedSoldEqualMax: a closed sold lot whose first Recent bids row is the viewer's and has `isWinner` true, with bid history copy `winner` set to `Winner`.
* Storybook renders `ListingAuctionBidCard` → Default: a live lot whose Recent bids rows carry no `isWinner`, with the same copy.

**Steps:**

1. On ClosedSoldEqualMax, read the first Recent bids row.
2. On Default, read every Recent bids row.

**Expected Results:**

* Step 1: the row shows a crown in the primary colour after the amount and before the You badge, with accessible name Winner.
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

### shared-ui-auction-listing-US1-TC29-1: No crown without its name

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Public bid history outcome

**Pre-conditions:**

* `ListingAuctionBidCard` renders ClosedSoldEqualMax's args - a closed sold lot whose first Recent bids row has `isWinner` true - with bid history copy that leaves `winner` unset.

**Steps:**

1. Read every Recent bids row.

**Expected Results:**

* No row shows a crown.
* No row carries an accessible name the copy does not supply, Winner included.

## Settled

- Winner is a primary crown after the amount when the consumer sets
  `isWinner` (closed sold), not a Winner badge.
- Equal-max non-leaders use the Info tip in the amount tone with
  earlier-leads copy.
- No new Badge size or footnote under Recent bids.
- The tip icon's tone and the crown's place before You are requirement
  clauses the cases walk, with no scenario of their own (decisions Q5).

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
| TC28 asserts the Info icon in the amount's tone, decided by Q2 and stated by the requirement, which no scenario's THEN carries | **Kept:** reported to Dev for an AND on `shared-ui-auction-listing-SC-51`; Q5 declined it, since the requirement's Equal-max tip clause states the tone and TC28 walks it |
| The requirement draws no crown where `copy.winner` is absent, and places the crown after any Info control and before You; no scenario states either | **Folded in:** the first as `shared-ui-auction-listing-SC-54` / `shared-ui-auction-listing-US1-TC29-1`, below; Q5 declined a scenario for the second, so TC27 now asserts the crown after the amount and before You on ClosedSoldEqualMax's viewer row, as the requirement's Winner crown clause states |
| The section carried its own journey title and an application as actor, where the durable suite's `US1` names the listing page blocks and a customer | **Folded in:** heading, Walked-by line and statement copied from the durable suite |
| Facts across the PRD lines, Q1 to Q3, `ui-design.md`, `tech-design.md`, the delta and the cases | **Agree:** primary filled crown after the amount, named by consumer copy, only on a closed sold lot; Info tip in the amount tone, reading when maximums match, the earlier one leads |
| Accept-review fix round, 2026-10-05, at the owner's word: the crown draws only with `copy.winner`, a rule with no scenario | **Folded in:** `shared-ui-auction-listing-SC-54` / `shared-ui-auction-listing-US1-TC29-1`; task 2.4 builds it |

**Run:** QA2 reconciliation 2026-10-05, rerun after Q4 and Q5, for change `bid-history-winner-priority`. Reread every case against `shared-ui-auction-listing-SC-50`, `-SC-51` and `-SC-54`, the requirement as Q4 left it, `decisions.md` (Q1 to Q5), `ui-design.md`, `tech-design.md`, `tasks.md`, the PRD lines on Bidding · Auction Panel and Listing Page Blocks · Bid History, the durable spec and suite, `cap-custom-maximum-entry`'s and `lot-gallery-strip-by-width`'s suites on this capability, and the build: `listing-bid-history-list.tsx`, the ClosedSoldEqualMax and Default stories and their meta, and the `en` catalog. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| Q4: the Equal-max flag now covers any older tie lower down | **Agree:** the list draws whatever row the consumer flags, so `shared-ui-auction-listing-SC-51` and TC28 hold unchanged; where the flag is set is the lot page's, walked there |
| TC29, written without a QA2 read, against `shared-ui-auction-listing-SC-54` | **Folded in:** its result asserts no row carries a name the copy does not supply, the scenario's AND, where it read only Winner |
| TC29's pre-condition named a Storybook render, but no story leaves `winner` unset and the bid card's `copy` is not a Storybook control | **Reported:** to Dev; task 2.4 owes a story or a play that renders ClosedSoldEqualMax without `winner`. The case stays `draft`, and fails until task 2.4 removes the built-in `"Winner"` |
| Case ids `US1-TC27-1` to `US1-TC29-1` | **Checked:** the durable suite ends at `TC18`; `cap-custom-maximum-entry` takes `TC19` to `TC26` and `lot-gallery-strip-by-width` `TC10` to `TC12`. No collision |
| Facts across the PRD lines, Q1 to Q5, `ui-design.md`, `tech-design.md`, the delta and the cases | **Agree:** primary filled crown after the amount and any tip, before You, named only by consumer copy, on a closed sold lot; Info tip in the amount tone on every row the consumer flags, reading when maximums match, the earlier one leads |
| Raised questions | None - Q1 to Q5 settle what this capability turns on |

**Run:** QA2 reconciliation 2026-10-05, rerun after Q6, for change `bid-history-winner-priority`. Reread every case against `shared-ui-auction-listing-SC-50`, `-SC-51` and `-SC-54`, the requirement, `decisions.md` (Q1 to Q6), `ui-design.md`, `tech-design.md`, `tasks.md` 2.1 to 2.4, the PRD lines on Bidding · Auction Panel and Listing Page Blocks · Bid History, the durable spec and suite, `cap-custom-maximum-entry`'s and `lot-gallery-strip-by-width`'s suites on this capability, and the build: `types.ts`, the ClosedSoldEqualMax story and its scenario lines. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| Q6: rows tied on amount list in the order their maximums were set | **Agree:** the order and the flag are the consumer's, walked on the lot page; the list draws whatever row is flagged, so `shared-ui-auction-listing-SC-51` and TC28 hold unchanged |
| The `samePricePriority` doc comment in `types.ts` says the row matches the leading price, which Q4 widened to any older tie | **Agree:** task 2.4 corrects it; no case reads a doc comment |
| TC29 still has no render that leaves `winner` unset | **Kept:** task 2.4 owes the story; the case stays `draft` |
| Case ids `US1-TC27-1` to `US1-TC29-1` | **Checked:** the durable suite ends at `TC18`; `cap-custom-maximum-entry` takes `TC19` to `TC26` and `lot-gallery-strip-by-width` `TC10` to `TC12`. No collision |
| Raised questions | None - Q1 to Q6 settle what this capability turns on |

**Uncovered anchors:** none. Public bid history outcome's three items each have a case - winner crown by TC27 and TC29, equal-max tip by TC28, live lots by TC27's second step - and `shared-ui-auction-listing-SC-50`, `-SC-51` and `-SC-54` are each asserted by one of them.
