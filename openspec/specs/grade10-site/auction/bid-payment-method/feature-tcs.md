# grade10-site/auction/bid-payment-method Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r1

## grade10-site-auction-bid-payment-method-US1: Collector authorizes a first bid on commit

**As a** signed-in collector with a linked card,
**I want** my maximum to authorize in the background when I commit,
**so that** I am not asked to confirm a hold in a separate modal.

<!-- trace:case id=g10.auction-bid-payment-method.TC-x2e rev=1 covers=g10.auction-bid-payment-method.SC-61r,g10.auction-bid-payment-method.SC-li6,g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-whx,g10.auction-bid-payment-method.SC-joe,g10.auction-bid-payment-method.SC-le7,g10.auction-bid-payment-method.SC-4g4,g10.auction-bid-payment-method.SC-c3a -->
### grade10-site-auction-bid-payment-method-US1-TC1-1: Missing card blocks the first bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* A signed-in collector has no linked card.
* The collector is viewing an open listing.
* The submitted maximum is valid for the listing.

**Steps:**

1. Open the listing bid panel.
2. Enter the submitted maximum.
3. Select **Place Bid**.

**Expected Results:**

* The bid is not accepted.
* No authorization is created.
* Link-card setup remains available under bid-panel-enrollment.

<!-- trace:case id=g10.auction-bid-payment-method.TC-tm1 rev=1 covers=g10.auction-bid-payment-method.SC-61r,g10.auction-bid-payment-method.SC-li6,g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-whx,g10.auction-bid-payment-method.SC-joe,g10.auction-bid-payment-method.SC-le7,g10.auction-bid-payment-method.SC-4g4,g10.auction-bid-payment-method.SC-c3a -->
### grade10-site-auction-bid-payment-method-US1-TC2-1: Linked card authorizes the committed maximum

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* A signed-in collector has a linked card.
* The collector is viewing an open listing with no accepted bid.
* The submitted maximum is valid for the listing.

**Steps:**

1. Open the listing bid panel.
2. Enter the submitted maximum.
3. Select **Place Bid**.

**Expected Results:**

* One authorization for the submitted maximum stands against the linked card.
* The bid is accepted only after authorization is confirmed.
* No payment-method or confirmation modal opens for authorization.

<!-- trace:case id=g10.auction-bid-payment-method.TC-heq rev=1 covers=g10.auction-bid-payment-method.SC-61r,g10.auction-bid-payment-method.SC-li6,g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-whx,g10.auction-bid-payment-method.SC-joe,g10.auction-bid-payment-method.SC-le7,g10.auction-bid-payment-method.SC-4g4,g10.auction-bid-payment-method.SC-c3a -->
### grade10-site-auction-bid-payment-method-US1-TC3-1: Pending authentication stays on the bid surface

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* A signed-in collector has a linked card and is viewing an open listing.
* The provider requires authentication or reports the authorization as pending.

**Steps:**

1. Enter a valid maximum in the listing bid panel.
2. Select **Place Bid**.
3. Observe the bid action and the enrollment setup surface.

**Expected Results:**

* The provider challenge or pending state appears on or near the bid action.
* The bid is not shown as accepted until authorization is confirmed.
* The enrollment setup modal does not open for the pending state.

<!-- trace:case id=g10.auction-bid-payment-method.TC-h30 rev=1 covers=g10.auction-bid-payment-method.SC-61r,g10.auction-bid-payment-method.SC-li6,g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-whx,g10.auction-bid-payment-method.SC-joe,g10.auction-bid-payment-method.SC-le7,g10.auction-bid-payment-method.SC-4g4,g10.auction-bid-payment-method.SC-c3a -->
### grade10-site-auction-bid-payment-method-US1-TC4-1: Declined authorization leaves no accepted bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* A signed-in collector has a linked card and is viewing an open listing.
* The provider declines the authorization or reports the linked method as unusable.

**Steps:**

1. Enter a valid maximum in the listing bid panel.
2. Select **Place Bid**.
3. Read the bid action and the listing's accepted bid state.

**Expected Results:**

* The bid action shows: Your card could not be authorized. Try another card.
* No accepted bid or active authorization exists for the attempt.
* The collector may change the card before the first bid on the listing.

<!-- trace:case id=g10.auction-bid-payment-method.TC-b9p rev=1 covers=g10.auction-bid-payment-method.SC-61r,g10.auction-bid-payment-method.SC-li6,g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-whx,g10.auction-bid-payment-method.SC-joe,g10.auction-bid-payment-method.SC-le7,g10.auction-bid-payment-method.SC-4g4,g10.auction-bid-payment-method.SC-c3a -->
### grade10-site-auction-bid-payment-method-US1-TC5-1: Provider failure explains that no card was authorized

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* A signed-in collector has a linked card and is viewing an open listing.
* The authorize call times out, fails at the provider, or is cancelled.

**Steps:**

1. Enter a valid maximum in the listing bid panel.
2. Select **Place Bid**.
3. Read the bid action and the listing's accepted bid state.

**Expected Results:**

* The bid action shows: Your bid did not go through. The card was not authorized.
* No accepted bid or active authorization exists for the attempt.

<!-- trace:case id=g10.auction-bid-payment-method.TC-d2o rev=1 covers=g10.auction-bid-payment-method.SC-61r,g10.auction-bid-payment-method.SC-li6,g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-whx,g10.auction-bid-payment-method.SC-joe,g10.auction-bid-payment-method.SC-le7,g10.auction-bid-payment-method.SC-4g4,g10.auction-bid-payment-method.SC-c3a -->
### grade10-site-auction-bid-payment-method-US1-TC6-1: Linked card carries to a new listing

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
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* A collector linked a card on a prior listing.
* The collector has not bid on the new open listing.
* The collector is viewing the new listing.

**Steps:**

1. Enter a valid maximum on the new listing.
2. Select **Place Bid**.

**Expected Results:**

* Authorization starts with the linked card.
* A new method selection is not required solely because the listing is different.

---

## grade10-site-auction-bid-payment-method-US2: Collector raises a bid on the same card

**As a** collector who already bid on a listing,
**I want** a higher bid to use the card I already committed to that listing,
**so that** I can raise my maximum without selecting a card again.

<!-- trace:case id=g10.auction-bid-payment-method.TC-x5g rev=1 covers=g10.auction-bid-payment-method.SC-7z5,g10.auction-bid-payment-method.SC-khw,g10.auction-bid-payment-method.SC-oa0,g10.auction-bid-payment-method.SC-1ff -->
### grade10-site-auction-bid-payment-method-US2-TC1-1: Higher maximum reuses the listing authorization

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-02

**Pre-conditions:**

* A collector is leading an open listing with an active authorization at the current maximum.
* The collector is viewing that listing.
* A higher maximum is valid for the listing.

**Steps:**

1. Select **Raise** in the listing bid panel.
2. Enter the higher maximum.
3. Confirm the raise.

**Expected Results:**

* The existing card is used without a payment-method step.
* The existing authorization covers the higher maximum.
* The raised bid is accepted only after the raised authorization is confirmed.

<!-- trace:case id=g10.auction-bid-payment-method.TC-hk4 rev=1 covers=g10.auction-bid-payment-method.SC-7z5,g10.auction-bid-payment-method.SC-khw,g10.auction-bid-payment-method.SC-oa0,g10.auction-bid-payment-method.SC-1ff -->
### grade10-site-auction-bid-payment-method-US2-TC2-1: Rejected raise resolves without a pending bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-02

**Pre-conditions:**

* A collector has an active authorization for an open listing at the prior maximum.
* The collector is viewing that listing.
* The provider refuses the raise because the existing authorization cannot be incremented.

**Steps:**

1. Select **Raise** in the listing bid panel.
2. Enter a higher valid maximum.
3. Confirm the raise.
4. Submit a later valid bid attempt on the listing.

**Expected Results:**

* The raised bid is refused with: Your card could not be authorized. Try another card.
* The prior maximum and active authorization remain unchanged.
* The attempted raise is recorded as failed rather than pending.
* Step 4 is not blocked by a pending-confirmation message from the refused raise.

---

## grade10-site-auction-bid-payment-method-US3: Collector is released when outbid

**As a** collector who has been outbid,
**I want** the hold on my card cancelled,
**so that** money is not held for a listing I cannot win.

<!-- trace:case id=g10.auction-bid-payment-method.TC-qo3 rev=1 covers=g10.auction-bid-payment-method.SC-lao,g10.auction-bid-payment-method.SC-33r -->
### grade10-site-auction-bid-payment-method-US3-TC1-1: Outbid authorization cancels once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-03

**Pre-conditions:**

* Collector A has an accepted bid and active authorization on an open listing.
* Collector B is viewing the same listing and can submit a higher valid maximum.

**Steps:**

1. As collector B, submit the higher maximum.
2. As collector A, reload the listing and open the bidding record.
3. Deliver the same authorization outcome again.

**Expected Results:**

* Collector A's authorization is cancelled without capturing money.
* No payment, order, or fulfilment outcome is created for Collector A.
* The repeated outcome does not create a second state transition, hold, or accepted bid.

## grade10-site-auction-bid-payment-method-US4: Collector understands the buyer-premium rate before bidding

**As a** collector considering a live lot,
**I want** to know the buyer's premium rate before I bid,
**so that** I understand the policy without being shown an invoice amount that
does not exist yet.

<!-- trace:case id=g10.auction-bid-payment-method.TC-lbz rev=1 covers=g10.auction-bid-payment-method.SC-x21,g10.auction-bid-payment-method.SC-oeb -->
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

<!-- trace:case id=g10.auction-bid-payment-method.TC-nvs rev=1 covers=g10.auction-bid-payment-method.SC-x21,g10.auction-bid-payment-method.SC-oeb -->
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

- Incremental and extended authorization are provider eligibility requests; the provider's returned capture deadline is authoritative for the authorization lifecycle.

## Reconciliation

**Run:** 2026-09-24; scenario and suite readings were reconciled by the author.

- **Uncovered anchors:** none. Provider option flags and the returned authorization deadline are covered by the Stripe adapter and backend verification lanes, not by a customer walk.
