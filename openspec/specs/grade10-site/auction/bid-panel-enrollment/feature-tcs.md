# grade10-site/auction/bid-panel-enrollment Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-08, tcs-rules r2

## grade10-site-auction-bid-panel-enrollment-US1: Collector signs in to bid on a lot

**As a** signed-out collector on a live lot,
**I want** the bid panel to offer sign-in when I try to bid,
**so that** I can authenticate before linking a card.

### grade10-site-auction-bid-panel-enrollment-US1-TC1-1: Sign-in is offered instead of place bid

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-01

**Pre-conditions:**
The collector is signed out on <a live lot page>.

**Steps:**

1. Open <a live lot page> bid panel.
2. Inspect the primary bid action label.

**Expected Results:**

* The primary action offers sign-in to bid.
* Place bid and link a card are not offered.

### grade10-site-auction-bid-panel-enrollment-US1-TC2-1: Standing badges stay hidden while signed out

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-01

**Pre-conditions:**
The collector is signed out on <a live lot page> where recent bids are shown.

**Steps:**

1. Open <a live lot page> bid panel.
2. Inspect standing badges and the recent-bids section.

**Expected Results:**

* Highest-bid and outbid standing badges are not shown.
* Recent bids remain visible.

---

## grade10-site-auction-bid-panel-enrollment-US2: Collector links a card when none is on file

**As a** signed-in collector with no linked card,
**I want** amount entry disabled until I link a card and attest my age,
**so that** I only choose a maximum after setup is done.

### grade10-site-auction-bid-panel-enrollment-US2-TC1-1: Link CTA opens setup when no card is linked

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**
The collector is signed in with no linked card on <an open listing>.

**Steps:**

1. Open <the lot page> bid panel.
2. Inspect amount controls and the primary bid action.
3. Activate the primary bid action.

**Expected Results:**

* Quick-bid presets and the custom maximum field are visible and disabled.
* The primary bid action is labeled Link a card to bid.
* The setup modal opens.
* No bid is placed.

### grade10-site-auction-bid-panel-enrollment-US2-TC2-1: Setup requires card and attestation

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**
The collector is signed in and the first-link setup modal is open on <an open listing>.

**Steps:**

1. Leave provider card entry incomplete and age attestation unchecked.
2. Inspect continue.
3. Complete provider card entry and check age attestation.
4. Inspect continue again.

**Expected Results:**

* Link Card is disabled while card entry or attestation is incomplete.
* Link Card is enabled when both are complete.
* Continue is labeled Link Card, not Authorize.

### grade10-site-auction-bid-panel-enrollment-US2-TC3-1: Setup linking locks dismiss and controls

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**
The collector submitted Link Card on <an open listing> and the provider link is in flight.

**Steps:**

1. Inspect continue, the provider field, age attestation, and dismiss.

**Expected Results:**

* Continue is labeled Linking and busy.
* The provider field and age attestation are not interactive.
* The collector cannot dismiss the modal.

### grade10-site-auction-bid-panel-enrollment-US2-TC4-1: Dismissing setup leaves no linked card

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**
The collector is signed in with no linked card on <an open listing>.

**Steps:**

1. Open setup from the bid panel.
2. Close the modal without continuing.
3. Inspect the linked-card slot and amount controls.

**Expected Results:**

* No linked card is on file for bidding.
* The empty link prompt is shown.
* Amount controls remain visible and disabled.

### grade10-site-auction-bid-panel-enrollment-US2-TC5-1: Completing setup unlocks amount controls

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**
The collector is signed in with no linked card on <an open listing>.

**Steps:**

1. Complete setup with provider card entry and age attestation.
2. Activate Link Card.
3. Inspect the linked-card slot, amount controls, and primary bid action.

**Expected Results:**

* The setup modal closes.
* The linked card is shown with change available.
* Quick-bid presets and the custom maximum field are enabled.
* The primary bid action offers set or raise maximum.

### grade10-site-auction-bid-panel-enrollment-US2-TC6-1: Empty linked-card slot opens setup

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**
The collector is signed in with no linked card and the empty linked-card slot is visible on <an open listing>.

**Steps:**

1. Attempt to activate a disabled quick-bid preset.
2. Attempt to focus or type in the custom maximum field.
3. Activate the empty-slot link control.

**Expected Results:**

* Disabled presets and the custom maximum field do not open setup.
* The empty-slot link control opens the setup modal.

---

## grade10-site-auction-bid-panel-enrollment-US3: Collector changes the linked card before their first bid

**As a** collector with a linked card on a lot who has not yet bid on it,
**I want** to change or link another card from the panel,
**so that** I can update payment before my first bid without a separate flow.

### grade10-site-auction-bid-panel-enrollment-US3-TC1-1: Change opens the setup modal

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-03

**Pre-conditions:**
The collector has a linked card on <an open listing> and has not bid on it.

**Steps:**

1. Open <the lot page> bid panel.
2. Activate change on the linked card.

**Expected Results:**

* The setup modal opens.
* The linked-card row remains visible behind the modal.

### grade10-site-auction-bid-panel-enrollment-US3-TC2-1: Change reuses setup copy with prior card shown

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-03

**Pre-conditions:**
The collector is changing the linked card before their first bid on <an open listing>.

**Steps:**

1. Open setup through change.
2. Compare the modal title, description, and provider field area to first-link setup.

**Expected Results:**

* Title is Link a card to bid.
* Description discloses that setting a maximum authorizes a hold and that the collector is charged only if they win.
* The provider field area indicates the previously linked card on file.

### grade10-site-auction-bid-panel-enrollment-US3-TC3-1: Attestation is pre-checked when already given

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-03

**Pre-conditions:**
The collector already attested on a prior lot and is changing card on <a new open listing> before their first bid on it.

**Steps:**

1. Open setup through change.
2. Inspect age attestation and continue.

**Expected Results:**

* Age attestation is pre-checked.
* Link Card is enabled once provider card entry is satisfied.

---

## grade10-site-auction-bid-panel-enrollment-US4: Collector bids after linking a card

**As a** collector who has a linked card on a lot,
**I want** the linked card to lock after my first bid on that lot,
**so that** my committed payment method stays stable while I raise bids.

### grade10-site-auction-bid-panel-enrollment-US4-TC1-1: Change is hidden after the first bid

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-04

**Pre-conditions:**
The collector has a linked card on <an open listing> and has placed at least one bid on it.

**Steps:**

1. Open <the lot page> bid panel.
2. Inspect the linked-card slot.

**Expected Results:**

* The linked card is shown.
* Change is not offered.

### grade10-site-auction-bid-panel-enrollment-US4-TC2-1: First maximum does not reopen setup

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-04

**Pre-conditions:**
The collector has a linked card on <an open listing> and has not placed a bid on it.

**Steps:**

1. Enter a valid maximum on the bid panel.
2. Activate the primary bid action.

**Expected Results:**

* The setup modal does not open.
* The commitment proceeds under auto-bidding and payment authorization.

---

## grade10-site-auction-bid-panel-enrollment-US5: Collector returns to a new lot with a card already linked

**As a** signed-in collector who linked a card on a prior lot,
**I want** that card and enabled amount controls on a new lot without setup,
**so that** I am not asked to link again before I bid.

### grade10-site-auction-bid-panel-enrollment-US5-TC1-1: Card on file carries over to a new lot

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-05

**Pre-conditions:**
The collector linked a card on a prior lot and has not bid on <a new open listing>.

**Steps:**

1. Open <the new lot page> bid panel.
2. Inspect the linked-card slot, amount controls, and whether setup is open.

**Expected Results:**

* The linked-card slot shows the card on file with change available.
* Quick-bid presets and the custom maximum field are enabled.
* The setup modal does not open.
