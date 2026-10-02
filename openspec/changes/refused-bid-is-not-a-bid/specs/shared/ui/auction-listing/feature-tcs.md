# shared/ui/auction-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## shared-ui-auction-listing-US1: The listing page blocks' rendering contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/auction/listing-page`, which composes the blocks

**As a** customer,
**I want** the lot page's blocks to show the gallery, my bidding and its disclosures as the contract states,
**so that** every storefront composing them shows me the same thing.

### shared-ui-auction-listing-US1-TC18-2: A lost standing shows the badge and no banner

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Lost standing

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` on a closed listing the viewer bid on and lost.

**Steps:**

1. Read the standing on the bid card.
2. Scan the card for a banner.

**Expected Results:**

* Step 1: the standing reads Did not win.
* Step 2: no banner shows on the card.

## Settled

- A lost standing on the bid card is the Did not win badge alone; that the card was not charged is said on My Auctions, never on the lot card (decisions Q2).
- The linked-card tooltip scenario keeps its title, since retitling needs a new id (decisions Q18).

## Reconciliation

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded in** - `shared-ui-auction-listing-SC-46` by `shared-ui-auction-listing-US1-TC18-2`
- **Revised** - QA1 kept `shared-ui-auction-listing-US1-TC18-1`, but it now reads no banner of any kind under a lost standing, so it moves up a revision
- **Out of suite** - the enrollment blocks' props, which no longer take `authorizing` or `authorizationRefused`: the store's type check and the block stories. `shared-ui-auction-listing-SC-30` changed its Serves line only and stands by its story
- **Raised, answered** - Q18: `shared-ui-auction-listing-SC-30` keeps its title, since retitling needs a new id, recommended; answer in `## Settled`
- **Contradicted** - none
- **Uncovered anchors** - none
