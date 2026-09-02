# grade10-auction/bid-panel-enrollment Test Cases

**Status:** draft

## bid-panel-enrollment-US1: Collector signs in to bid on a lot

**As a** signed-out collector on a live lot,
**I want** the bid panel to offer sign-in when I try to bid,
**so that** I can authenticate before enrollment begins.

### bid-panel-enrollment-US1-TC1-1: Sign-in is offered instead of place bid

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** bid-panel-enrollment-US-01, bid-panel-enrollment-SC-01

**Pre-conditions:**
The collector is signed out on <a live lot page>.

**Steps:**

1. Open <a live lot page> bid panel.
2. Inspect the primary bid action label.

**Expected Results:**

* The primary action offers sign-in to bid.
* Place bid is not offered.

### bid-panel-enrollment-US1-TC2-1: Standing badges stay hidden while signed out

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** bid-panel-enrollment-US-01, bid-panel-enrollment-SC-02

**Pre-conditions:**
The collector is signed out on <a live lot page> where recent bids are shown.

**Steps:**

1. Open <a live lot page> bid panel.
2. Inspect standing badges and the recent-bids section.

**Expected Results:**

* Highest-bid and outbid standing badges are not shown.
* Recent bids remain visible.

---

## bid-panel-enrollment-US2: Collector enrolls for a lot before bidding

**As a** signed-in collector who has not enrolled on this lot,
**I want** to link a card and attest my age in one setup step,
**so that** I know this lot is ready before I bid.

### bid-panel-enrollment-US2-TC1-1: Place bid opens setup before enrollment

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** bid-panel-enrollment-US-02, bid-panel-enrollment-SC-03

**Pre-conditions:**
The collector is signed in and has not enrolled on <an open listing>.

**Steps:**

1. Open <the lot page> bid panel.
2. Activate the primary bid action.

**Expected Results:**

* The setup modal opens.
* No bid is placed.

### bid-panel-enrollment-US2-TC2-1: Setup requires card and attestation

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** bid-panel-enrollment-US-02, bid-panel-enrollment-SC-04

**Pre-conditions:**
The collector is signed in and the first-link setup modal is open on <an open listing>.

**Steps:**

1. Leave provider card entry incomplete and age attestation unchecked.
2. Inspect continue.
3. Complete provider card entry and check age attestation.
4. Inspect continue again.

**Expected Results:**

* Continue is disabled while card entry or attestation is incomplete.
* Continue is enabled when both are complete.

### bid-panel-enrollment-US2-TC3-1: Dismissing setup leaves the lot unenrolled

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** bid-panel-enrollment-US-02, bid-panel-enrollment-SC-05

**Pre-conditions:**
The collector is signed in on <an open listing> they have not enrolled on.

**Steps:**

1. Open setup from the bid panel.
2. Close the modal without continuing.
3. Inspect the linked-card slot.

**Expected Results:**

* The lot remains unenrolled.
* The empty link prompt is shown.
* No linked card row is shown.

### bid-panel-enrollment-US2-TC4-1: Completing setup shows the linked card

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** bid-panel-enrollment-US-02, bid-panel-enrollment-SC-06

**Pre-conditions:**
The collector is signed in on <an open listing> they have not enrolled on.

**Steps:**

1. Complete setup with provider card entry and age attestation.
2. Activate continue.
3. Inspect the linked-card slot and primary bid action.

**Expected Results:**

* The setup modal closes.
* The linked card is shown with change available.
* The primary bid action remains available.

---

## bid-panel-enrollment-US3: Collector changes the linked card before their first bid

**As a** collector enrolled on a lot who has not yet bid on it,
**I want** to change the linked card from the panel,
**so that** I can update payment before my first bid without a separate flow.

### bid-panel-enrollment-US3-TC1-1: Change opens the setup modal

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** bid-panel-enrollment-US-03, bid-panel-enrollment-SC-07

**Pre-conditions:**
The collector is enrolled on <an open listing> and has not bid on it.

**Steps:**

1. Open <the lot page> bid panel.
2. Activate change on the linked card.

**Expected Results:**

* The setup modal opens.
* The linked-card row remains visible behind the modal.

### bid-panel-enrollment-US3-TC2-1: Change reuses setup copy with prior card shown

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** bid-panel-enrollment-US-03, bid-panel-enrollment-SC-08

**Pre-conditions:**
The collector is changing the linked card before their first bid on <an open listing>.

**Steps:**

1. Open setup through change.
2. Compare the modal title, description, and provider field area to first-link setup.

**Expected Results:**

* Title and description match first-link setup.
* The provider field area indicates the previously linked card on file.

### bid-panel-enrollment-US3-TC3-1: Attestation is pre-checked when already given

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** bid-panel-enrollment-US-03, bid-panel-enrollment-SC-09

**Pre-conditions:**
The collector already attested on a prior lot and is changing card on <a new open listing> before their first bid on it.

**Steps:**

1. Open setup through change.
2. Inspect age attestation and continue.

**Expected Results:**

* Age attestation is pre-checked.
* Continue is enabled once provider card entry is satisfied.

---

## bid-panel-enrollment-US4: Collector bids after enrolling on a lot

**As a** collector who has enrolled on a lot,
**I want** the linked card to lock after my first bid on that lot,
**so that** my committed payment method stays stable while I raise bids.

### bid-panel-enrollment-US4-TC1-1: Change is hidden after the first bid

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** bid-panel-enrollment-US-04, bid-panel-enrollment-SC-10

**Pre-conditions:**
The collector is enrolled on <an open listing> and has placed at least one bid on it.

**Steps:**

1. Open <the lot page> bid panel.
2. Inspect the linked-card slot.

**Expected Results:**

* The linked card is shown.
* Change is not offered.

### bid-panel-enrollment-US4-TC2-1: First auto bid may open confirm-maximum

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** bid-panel-enrollment-US-04, bid-panel-enrollment-SC-11

**Pre-conditions:**
The collector is enrolled on <an open listing> in auto-bid mode and has not acknowledged the auto-bid introduction on that listing.

**Steps:**

1. Enter a valid maximum on the bid panel.
2. Activate the primary bid action.

**Expected Results:**

* The confirm-maximum step opens per auto-bidding.
* The setup modal does not open.
