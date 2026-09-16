# grade10-site/auction Domain Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## grade10-site-auction-e2e-US08: Collector bids through the standard no-hold path

**As a** collector,
**I want** linking my card and committing a maximum to keep the lot moving
without a bid-time hold,
**so that** the standard auction path does not require a provider call.

### grade10-site-auction-e2e-US08-TC1-1: A linked collector places and resolves a no-hold bid

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02, grade10-site-auction-auto-bidding-US-05, grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* A signed-in collector has linked a card on an open listing.
* Bid-time authorization holds are disabled.
* A challenger can commit a higher valid maximum on the same listing.

**Steps:**

1. Submit the collector's valid first bid.
2. Submit the challenger's higher maximum.
3. Read the accepted bids, panel state, and bid-time authorizations.

**Expected Results:**

* The first bid is accepted and the panel moves to enrolled with Change unavailable.
* The two maxima resolve according to the listing's rules.
* No bid-time authorization is created or awaited for either bid.

## Raised

- None; this change introduces no unresolved product question.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| The cross-feature path must prove linking, first bid, and maximum resolution together without a hold | Covered as `grade10-site-auction-e2e-US08-TC1-1` |
