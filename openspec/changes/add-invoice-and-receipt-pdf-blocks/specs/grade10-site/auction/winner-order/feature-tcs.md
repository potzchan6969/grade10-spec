# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## winner-order-US24: Winner confirms the time zone for a won lot

**As a** winner,
**I want** to confirm the time zone used for my order's payment deadline,
**so that** the deadline and my invoice use a time I can recognise wherever I open them.

### winner-order-US24-TC1-1: Winner confirms a time zone for setup

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-24

**Pre-conditions:**

* A winner is completing Order Setup in a browser suggesting `Europe/London`.

**Steps:**

1. Change the shown time zone to `America/New_York` and confirm setup.
2. Open the order after the invoice is sent.

**Expected Results:**

* The order stores the selected IANA zone and shows the deadline in that named zone.

### winner-order-US24-TC2-1: Setup refuses an invalid time zone

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-24

**Pre-conditions:**

* A winner has completed every other setup field.

**Steps:**

1. Submit with no zone, then with `Not/A_Zone`.

**Expected Results:**

* Both submissions are refused with the zone named; the order stays Awaiting Setup.

### winner-order-US24-TC3-1: Travel does not change the deadline zone

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-24

**Pre-conditions:**

* A winner confirmed `America/New_York` and has a sent invoice.

**Steps:**

1. Open Winner Order from a browser in `Asia/Hong_Kong`.
2. Open the invoice PDF.

**Expected Results:**

* Winner Order and the invoice still show the deadline in the named New York zone.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| US24-TC1 (confirmed zone overrides browser suggestion) | Covered by `winner-order-SC-300` |
| US24-TC2 (missing or invalid zone) | Covered by `winner-order-SC-301` |
| US24-TC3 (travel after confirmation) | Covered by `winner-order-SC-302` |
| Uncovered anchors | None - setup capture and deadline display each have a scenario and case |
| Contradicted readings | None |
