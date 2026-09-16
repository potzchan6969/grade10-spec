# grade10-site/auction/auction Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## grade10-site-auction-auction-US2: Collector places a bid inside the window

**As a** bidder,
**I want** a valid bid to stand without requiring a bid-time authorization in
the standard configuration,
**so that** a card hold does not block me from competing.

### grade10-site-auction-auction-US2-TC5-1: The default bid path creates no authorization hold

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* Bid-time authorization holds are disabled.
* A collector is signed in on an open listing with a valid linked card.

**Steps:**

1. Submit a valid bid on the open listing.
2. Read the bid result and the listing's bid-time authorizations.

**Expected Results:**

* Grade10 accepts the bid according to the listing's bid rules without waiting for Stripe.
* No bid-time authorization is created.

## Raised

- None; this change introduces no unresolved product question.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| The standard first-bid journey needed an explicit no-hold path | Covered as `grade10-site-auction-auction-US2-TC5-1` |
