# grade10-site/auction/notifications Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-17, tcs-rules r3.0

**Out of suite:** Opening progress (US-01), bid-activity (US-03, US-04), send-log (US-05), and close-outcome (US-06–US-08) journeys — durable suites cover them. This change re-accepts Progress closing warnings and the retired one-hour reminder only.

## grade10-site-auction-notifications-US2: Collector returns before a lot closes

**As a** collector,
**I want** to be emailed when a lot I watch or bid on is a day from its
scheduled close,
**so that** a moving deadline does not pass without me.

### grade10-site-auction-notifications-US2-TC1-1: Watcher receives closes-in-24h at scheduled minus 24h

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer(A) watches lot L with email alerts on and Auction email alerts on.
* L has a scheduled close more than 24 hours away and has not entered extended bidding.

**Steps:**

1. Advance time to 24 hours before L's scheduled close.
2. Inspect auction progress mail for A about L.

**Expected Results:**

* A receives exactly one Bidding closes in 24 hours letter for L.
* A receives no one-hour closing reminder for L.

### grade10-site-auction-notifications-US2-TC2-1: No one-hour reminder before scheduled close

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer(A) watches lot L with email alerts on and Auction email alerts on.
* A already received Bidding closes in 24 hours for L at scheduled close minus 24 hours.
* L has not entered extended bidding.

**Steps:**

1. Advance time to one hour before L's scheduled close.
2. Inspect auction progress mail for A about L from this window.

**Expected Results:**

* A receives no one-hour closing reminder for L.
* No further closing-warning letter is sent in this window beyond letters already due from other Progress rules.

### grade10-site-auction-notifications-US2-TC3-1: Bidder receives closes-in-24h at scheduled minus 24h

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
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer(A) bid on lot L with email alerts on and Auction email alerts on.
* L has a scheduled close more than 24 hours away.

**Steps:**

1. Advance time to 24 hours before L's scheduled close.
2. Inspect auction progress mail for A about L.

**Expected Results:**

* A receives exactly one Bidding closes in 24 hours letter for L.

### grade10-site-auction-notifications-US2-TC4-1: Unwatched bidder with alerts on still gets closes-in-24h

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
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer(A) bid on lot L, then unwatched it, with email alerts still on and Auction email alerts on.
* L has a scheduled close more than 24 hours away.

**Steps:**

1. Advance time to 24 hours before L's scheduled close.
2. Inspect auction progress mail for A about L.

**Expected Results:**

* A receives exactly one Bidding closes in 24 hours letter for L.

### grade10-site-auction-notifications-US2-TC5-1: Muted watcher gets no closing warnings

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
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer(A) watches lot L with email alerts off and Auction email alerts on.
* L has a scheduled close more than 24 hours away.

**Steps:**

1. Advance time to 24 hours before L's scheduled close.
2. Advance time to one hour before L's scheduled close.
3. Inspect auction progress mail for A about L across both windows.

**Expected Results:**

* A receives no Bidding closes in 24 hours letter for L.
* A receives no one-hour closing reminder for L.

### grade10-site-auction-notifications-US2-TC6-1: Account master off blocks closes-in-24h

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
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer(A) watches lot L with per-lot email alerts on and Auction email alerts off.
* L has a scheduled close more than 24 hours away.

**Steps:**

1. Advance time to 24 hours before L's scheduled close.
2. Inspect auction progress mail for A about L.

**Expected Results:**

* A receives no Bidding closes in 24 hours letter for L.

### grade10-site-auction-notifications-US2-TC7-1: Closes-in-24h keys to scheduled close not moved close

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer(A) watches lot L with email alerts on and Auction email alerts on.
* A already received Bidding closes in 24 hours for L keyed to the scheduled close.
* L enters extended bidding so the current close moves past the scheduled close.

**Steps:**

1. Advance time to 24 hours before the moved close.
2. Inspect auction progress mail for A about L in that window.

**Expected Results:**

* A receives no further Bidding closes in 24 hours letter keyed to the moved close.
* A still has only the one closes-in-24h letter from the scheduled close.

### grade10-site-auction-notifications-US2-TC8-1: Extended bidding started still mails after 24h warning

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer(A) watches lot L with email alerts on and Auction email alerts on.
* A already received Bidding closes in 24 hours for L.
* L is eligible to enter extended bidding.

**Steps:**

1. Move L into the extended bidding window.
2. Inspect auction progress mail for A about L.

**Expected Results:**

* A receives Extended bidding has started for L.
* A receives no one-hour closing reminder for L.

### grade10-site-auction-notifications-US2-TC9-1: No one-hour reminder before moved close

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer(A) watches or bid on lot L with email alerts on and Auction email alerts on.
* L is in extended bidding with a moved close more than one hour away.

**Steps:**

1. Advance time to one hour before the moved close.
2. Inspect auction progress mail for A about L from this window.

**Expected Results:**

* A receives no one-hour closing reminder for L.

### grade10-site-auction-notifications-US2-TC10-1: One closes-in-24h copy per collector per lot

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
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer(A) watches lot L with email alerts on and Auction email alerts on.
* The closes-in-24h send for L to A has already succeeded once.

**Steps:**

1. Re-run the closes-in-24h send window for L while A remains enrolled.
2. Count Bidding closes in 24 hours letters to A for L.

**Expected Results:**

* A has exactly one Bidding closes in 24 hours letter for L.

## Settled

- Late enrolment after the scheduled-close − 24h point still receives Bidding closes in 24 hours while enrolled — enrolment requirement, same pattern as opens-in-24h
- Extended bidding has started sends once per listing per collector on first entry into the window
- One-hour closing reminder stops for watchers and bidders alike

## Reconciliation

**Run:** Blind pass read the change outline (`## Feature set` only), change and durable `user-journeys.md`, `proposal.md`, `decisions.md`, PRD My Auctions / Notifications excerpt, and the existing close-outcome `feature-tcs.md` with `## Reconciliation` stripped. Denied: every `## Requirements` section, durable and archived requirement bodies under `openspec/specs/` and `openspec/changes/archive/`.

**Raised, folded:**
- Bidder still gets Bidding closes in 24 hours — folded as `grade10-site-auction-notifications-SC-47`
- No one-hour reminder before a moved close — folded as `grade10-site-auction-notifications-SC-48`
- Bidder-only one-hour path must stop — folded into the SHALL NOT on the progress requirement (not watchers alone)

**Raised, rejected:**
- Late enrolment behaviour as an open product question — already decided under enrolment; kept in `## Settled`
- Extended-bidding restart as an open product question — already once-per-lot; kept in `## Settled`

**Uncovered anchors:**
- `grade10-site-auction-notifications-SC-05`…`SC-07`, `SC-10` — **Out of suite:** durable opening-progress coverage; restated only because the MODIFIED block is copied whole
- Mute / account-master cases (`…-US2-TC5-1`, `…-US2-TC6-1`) and unwatched-bidder enrolment (`…-US2-TC4-1`) — covered by durable enrolment scenarios; kept in this suite as US-02 regression walks
