# grade10-site/auction/bid-panel-enrollment Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## grade10-site-auction-bid-panel-enrollment-US2: Collector links a card when none is on file

**As a** signed-in collector with no linked card,
**I want** setup to leave me ready to bid immediately,
**so that** the panel does not wait for a bid-time authorization that the
backend does not require.

### grade10-site-auction-bid-panel-enrollment-US2-TC7-1: Card linking leaves the collector ready to bid

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

* A signed-in collector has no linked card on an open listing.
* Bid-time authorization holds are disabled.

**Steps:**

1. Complete card-link setup with age attestation.
2. Inspect the linked-card slot and amount controls when setup closes.

**Expected Results:**

* The existing pre-bid linked-card state shows the card with Change available.
* Quick-bid presets and the custom maximum field are enabled immediately.
* The panel does not wait for a bid-time authorization.

### grade10-site-auction-bid-panel-enrollment-US2-TC8-1: An accepted bid moves directly to enrolled

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

* A collector has linked a card and has not bid on the open listing.
* Bid-time authorization holds are disabled.

**Steps:**

1. Submit a valid first bid.
2. Inspect the panel state and linked-card actions after the backend accepts it.

**Expected Results:**

* The panel moves directly to the existing `enrolled` state.
* Change is no longer offered for that listing.
* The panel does not add or display a client-side hold state.

### grade10-site-auction-bid-panel-enrollment-US2-TC9-1: Default setup copy does not promise a bid-time hold

**Classification:**

* **Severity:** major
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

* A signed-in collector has no linked card on an open listing.
* Bid-time authorization holds are disabled.

**Steps:**

1. Open the setup modal.
2. Read the modal description.

**Expected Results:**

* The description is "Link a card for bidding. You're only charged if you win."
* The description does not promise a bid-time hold.

### grade10-site-auction-bid-panel-enrollment-US2-TC10-1: Enabled hold setup copy discloses the authorization

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* A signed-in collector has no linked card on an open listing.
* Bid-time authorization holds are enabled.

**Steps:**

1. Open the setup modal.
2. Read the modal description and primary action.

**Expected Results:**

* The description discloses that setting a maximum authorizes a hold.
* Continue remains labeled Link Card.

### grade10-site-auction-bid-panel-enrollment-US2-TC11-1: Default payment-method tooltip does not promise a hold

**Classification:**

* **Severity:** major
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

* A signed-in collector has a linked card on an open listing.
* Bid-time authorization holds are disabled.

**Steps:**

1. Open the linked-card payment-method tooltip.

**Expected Results:**

* The copy authorizes the card for bidding.
* The copy does not promise a bid-time hold.

## Raised

- None; this change introduces no unresolved product question.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Linking remains a readiness step, not a bid-time hold trigger | Covered as `grade10-site-auction-bid-panel-enrollment-US2-TC7-1` |
| The first accepted bid still locks Change without changing panel states | Covered as `grade10-site-auction-bid-panel-enrollment-US2-TC8-1` |
| Default setup copy must not promise a hold | Covered as `grade10-site-auction-bid-panel-enrollment-US2-TC9-1` |
| Enabled-hold setup still discloses authorization | Covered as `grade10-site-auction-bid-panel-enrollment-US2-TC10-1` |
| Default payment-method tooltip must not promise a hold | Covered as `grade10-site-auction-bid-panel-enrollment-US2-TC11-1` |
