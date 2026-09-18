# grade10-site/auction/notifications Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3.0

**Out of suite:** Progress, bid-activity, delivery, and send-log scenarios this change does not re-accept — existing durable journeys cover them. Close-outcome scenarios SC-37…SC-43 only.

## grade10-site-auction-notifications-US6: Collector who lost hears the lot closed

**As a** collector who bid on a lot,
**I want** to be emailed when someone else wins it,
**so that** I know the outcome without reopening the lot.

### grade10-site-auction-notifications-US6-TC1-1: Losing bidder receives did-not-win letter

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-06

**Pre-conditions:**

* Collector A bid on lot L with email alerts on.
* Collector B is the winner of L.

**Steps:**

1. Close lot L with B as winner.
2. Inspect close-outcome mail for A.

**Expected Results:**

* A receives exactly one did-not-win close letter (campaign `lot_closed_didnt_win`).
* When amounts are supplied, the letter names the winning bid and A's bid.

### grade10-site-auction-notifications-US6-TC2-1: Watcher who also bid gets one close letter

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-06

**Pre-conditions:**

* Collector A watches and bid on lot L with email alerts on.
* Another collector wins L.

**Steps:**

1. Close lot L.
2. Count close-outcome letters to A.

**Expected Results:**

* A receives exactly one close-outcome letter.
* It is the did-not-win letter (campaign `lot_closed_didnt_win`), not a watched sold or watched ended letter.

### grade10-site-auction-notifications-US6-TC3-1: Winner gets no close-outcome letter

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
* **Trace:** grade10-site-auction-notifications-US-06

**Pre-conditions:**

* Collector W wins lot L and also watches it with email alerts on.

**Steps:**

1. Close lot L with W as winner.
2. Inspect close-outcome mail for W from this capability.

**Expected Results:**

* W receives no close-outcome letter from auction notifications.

## grade10-site-auction-notifications-US7: Watcher hears a sold lot ended

**As a** collector watching a lot without bidding,
**I want** to be emailed when that lot ends with a winner,
**so that** I know bidding is over on a lot I followed.

### grade10-site-auction-notifications-US7-TC1-1: Watch-only sold letter names Sold for

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-07

**Pre-conditions:**

* Collector W watches lot L with email alerts on and has never bid.
* L closes with a winning bid amount supplied.

**Steps:**

1. Close lot L with a winner.
2. Inspect mail for W.

**Expected Results:**

* W receives the watched sold letter (campaign `lot_watched_sold`).
* The letter names the winning bid as Sold for.

### grade10-site-auction-notifications-US7-TC2-1: Muted watcher gets no close letter

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-07

**Pre-conditions:**

* Collector W watches lot L with email alerts off.

**Steps:**

1. Close lot L with a winner.
2. Inspect mail for W.

**Expected Results:**

* W receives no watched sold letter.

## grade10-site-auction-notifications-US8: Collector hears a no-bids close as ended only

**As a** collector watching a lot,
**I want** to be emailed that the lot ended when nobody bid,
**so that** I learn the close without being told the lot did not sell.

### grade10-site-auction-notifications-US8-TC1-1: Watcher no-bids letter is Ended-only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-08

**Pre-conditions:**

* Collector W watches lot L with email alerts on and has never bid.
* L closes with no bids.

**Steps:**

1. Close lot L with no bids.
2. Inspect watched ended mail for W (campaign `lot_watched_ended`).

**Expected Results:**

* W receives the watched ended letter (campaign `lot_watched_ended`).
* Subject, preheader and body say the lot has ended or bidding has closed.
* Copy does not contain unsold, did not sell, didn't sell, no sale, or no bids.
* Letter has no Sold for, Winning bid, or Highest bid highlight.

### grade10-site-auction-notifications-US8-TC2-1: No-bids close skips bidder letter and does not send lot_ended

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
* **Trace:** grade10-site-auction-notifications-US-08

**Pre-conditions:**

* Lot L closes with no bids.
* At least one enrolled watcher has email alerts on.

**Steps:**

1. Close lot L with no bids.
2. Inspect all close-outcome mail for that lot.

**Expected Results:**

* No bidder close-outcome letter is sent.
* No letter with campaign `lot_ended` is sent.
* Each enrolled watcher receives the watched ended letter (campaign
  `lot_watched_ended`) with no winning amount.
* That letter has no Sold for, Winning bid, or Highest bid highlight.
* Its subject, preheader and body do not contain unsold, did not sell,
  didn't sell, no sale, or no bids.

## Reconciliation

**Run:** 2026-09-16; scenario and suite readings were reconciled by the author.

- **Uncovered anchors:** none.

## Settled

- Late enrolment after the scheduled-close − 24h point still receives Bidding closes in 24 hours while enrolled — enrolment requirement, same pattern as opens-in-24h
- Extended bidding has started sends once per listing per collector on first entry into the window
- One-hour closing reminder stops for watchers and bidders alike
