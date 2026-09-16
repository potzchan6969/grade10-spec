# grade10-site/auction/auto-bidding Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## grade10-site-auction-auto-bidding-US5: Collector's automatic bids work with or without a hold

**As a** collector,
**I want** Grade10 to resolve automatic bids without requiring a bid-time
authorization by default,
**so that** my commitment can compete without a provider hold.

### grade10-site-auction-auto-bidding-US5-TC1-1: A maximum works without a bid-time authorization

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Pre-conditions:**

* Bid-time authorization holds are disabled.
* A listing has an accepted maximum for one bidder.

**Steps:**

1. Commit a higher valid maximum for a challenger.
2. Read the resolved bids and the listing's bid-time authorizations.

**Expected Results:**

* Grade10 resolves the two maxima and records the resulting bid.
* No bid-time authorization is created or awaited.

## Raised

- None; this change introduces no unresolved product question.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Maximum resolution must remain usable when bid-time holds are disabled | Covered as `grade10-site-auction-auto-bidding-US5-TC1-1` |
