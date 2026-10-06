# shared/ui/auction-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-ui-auction-listing-US1: The listing page blocks' rendering contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/auction/listing-page`, which composes the blocks

**As a** customer,
**I want** the lot page's blocks to show the gallery, my bidding and its disclosures as the contract states,
**so that** every storefront composing them shows me the same thing.

<!-- trace:case id=g10.shared-auction-listing.TC-pz8 rev=1 covers=g10.shared-auction-listing.SC-9gi,g10.shared-auction-listing.SC-tzc,g10.shared-auction-listing.SC-as2 -->
### shared-ui-auction-listing-US1-TC55-1: A catalogue tile close follows the viewer zone

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Bid history

**Pre-conditions:**

* The same close instant is rendered on `AuctionCard` once with `Asia/Hong_Kong` and once with `America/New_York`.

**Steps:**

1. Read each card's Ends / Opens / Closed line.

**Expected Results:**

* The two clock values differ.
* The Hong Kong line names `HKT`.
* The New York line names `EDT` and does not contain `HKT`.

## Reconciliation

**Run:** QA2, 2026-10-06, for change `align-collector-times-to-local-zone`. Catalogue tile close lines follow the viewer zone.

| Finding | Disposition |
| --- | --- |
| AuctionCard close differs by zone; HK names HKT and NY names EDT | **Folded in:** `shared-ui-auction-listing-SC-55` / US1-TC55-1 |
