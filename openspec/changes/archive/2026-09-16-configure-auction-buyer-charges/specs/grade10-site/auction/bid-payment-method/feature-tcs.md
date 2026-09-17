# grade10-site/auction/bid-payment-method Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r1

## grade10-site-auction-bid-payment-method-US4: Collector understands the buyer-premium rate before bidding

**As a** collector considering a live lot,
**I want** to know the buyer's premium rate before I bid,
**so that** I understand the policy without being shown an invoice amount that
does not exist yet.

### grade10-site-auction-bid-payment-method-US-04-TC1-1: Active listing shows the rate without a premium amount

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-04

**Pre-conditions:**

* A collector is viewing an active auction listing before submitting a bid.

**Steps:**

1. Read the bid panel.

**Expected Results:**

* The panel says the buyer's premium rate is 20%.
* The panel shows no calculated premium amount.
* The panel shows no invoice total.

### grade10-site-auction-bid-payment-method-US-04-TC2-1: Supported currencies use the same disclosed rate

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-04

**Pre-conditions:**

* Active auction listings exist in USD, HKD, and JPY.

**Steps:**

1. Read the bid panel for each listing.

**Expected Results:**

* Each panel shows 20%.
* None shows a currency-specific premium amount.

## Raised

- The latest product reading confirms that the bid panel shows the fixed 20% rate only; the calculated premium amount remains invoice-only.

## Settled

## Reconciliation

**Run:** 2026-09-16; scenario and suite readings were reconciled by the author.

- **Uncovered anchors:** none.
