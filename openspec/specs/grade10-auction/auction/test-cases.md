# grade10-auction/auction Test Cases

**Status:** approved
**Reviewed:** 2026-09-02

## auction-US2: Collector places a card-backed bid inside the window

**As a** bidder,
**I want** a bid accepted only when it meets the increment inside the scheduled window,
**so that** a late valid bid can extend the close without passing the cap.

### auction-US2-TC1-1: Late bid extends the close by the listing duration

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** auction-US-02

**Pre-conditions:**
An open listing whose extension window is 1800 seconds and extension duration is 1800 seconds, with 1800 seconds or less until its recorded close.

**Steps:**

1. Submit a valid bid at time T.
2. Read the listing's recorded close.

**Expected Results:**

* Grade10 accepts the bid.
* The listing close becomes T plus 1800 seconds.

### auction-US2-TC2-1: Extension cap limits an otherwise eligible extension

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** auction-US-02

**Pre-conditions:**
An open listing with an extension cap and a recorded close already at that cap.

**Steps:**

1. Submit a valid bid inside the listing's extension window.
2. Read the listing's recorded close.

**Expected Results:**

* Grade10 accepts the bid.
* The recorded close does not move beyond the configured cap.

### auction-US2-TC3-1: Window and duration may differ

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** auction-US-02

**Pre-conditions:**
An open listing whose extension window is 300 seconds and extension duration is 1800 seconds, with 300 seconds or less remaining.

**Steps:**

1. Submit a valid bid at time T with 300 seconds or less remaining.
2. Read the listing's recorded close.
3. Submit another valid bid with more than 300 seconds remaining before the new close.

**Expected Results:**

* The first bid moves the close to T plus 1800 seconds.
* The second bid does not extend the close.

### auction-US2-TC4-1: Extension off does not move the close

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** auction-US-02

**Pre-conditions:**
An open listing whose extension window and extension duration are both zero, with one second remaining.

**Steps:**

1. Submit a valid bid.
2. Read the listing's recorded close.

**Expected Results:**

* Grade10 accepts the bid.
* The recorded close is unchanged.

---

## auction-US1: Collector browses Auction listings

**As a** collector,
**I want** the catalogue to show Auction listings with money in minor units,
**so that** I am not offered Buy Now and a close with bids is absolute.

### auction-US1-TC1-1: Public listing read exposes extension policy

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** auction-US-01

**Pre-conditions:**
A published listing with extension window 1800 seconds, extension duration 1800 seconds, and an optional extension cap.

**Steps:**

1. Read the public listing contract.

**Expected Results:**

* The contract uses listing and extension terminology.
* It exposes extension window, extension duration, and extension cap when set.
* It exposes no reserve state.
