# grade10-site/auction/auction Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-auction-auction-US5: Collector reads the catalogue in one order

**As a** collector,
**I want** the catalogue to lead with the lots I can bid on, soonest to close
first, and to keep that order as I read on,
**so that** what I can still bid on is in front of me and reading further never
shows me a lot twice or skips one.

### grade10-site-auction-auction-US5-TC1-1: Open lots lead the catalogue

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* Lots in all three bands, among them an Ended lot that closed before an Active
  lot closes.

**Steps:**

1. Open the Auction catalogue.
2. Read the lots in the order they are listed.

**Expected Results:**

* Every Active lot is listed before every Upcoming lot.
* Every Upcoming lot is listed before every Ended lot.

### grade10-site-auction-auction-US5-TC2-1: Each band has its own order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* Two Active lots closing an hour apart.
* Two Upcoming lots starting a day apart.
* Two Ended lots closed a week apart.

**Steps:**

1. Open the Auction catalogue.
2. Read the lots in the order they are listed.

**Expected Results:**

* The Active lots are listed soonest close first.
* The Upcoming lots are listed soonest start first.
* The Ended lots are listed most recent close first.

### grade10-site-auction-auction-US5-TC3-1: A tie is settled the same way every read

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* Two lots in one band that the band's order cannot tell apart.

**Steps:**

1. Read the catalogue.
2. Read the catalogue a second time.

**Expected Results:**

* The two lots are in the same order both times.

### grade10-site-auction-auction-US5-TC4-1: Paging does not change the order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* A catalogue holding more lots than one page lists.

**Steps:**

1. Read the catalogue a page at a time to the end, collecting the lots in order.
2. Read the catalogue whole, collecting the lots in order.

**Expected Results:**

* The two readings list the lots in the same order.
* No lot is listed twice and none is missing.
