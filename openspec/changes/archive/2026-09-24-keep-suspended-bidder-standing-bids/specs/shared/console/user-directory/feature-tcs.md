# shared/console/user-directory Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## shared-console-user-directory-US1: Console renders auction standing on one account

**As a** console application,
**I want** to supply auction standing and moderation handlers to the account panel,
**so that** the panel can show the allowed move without owning the transition.

**Walked by:** nobody on their own — the admin Users panel composes this
package contract.

### shared-console-user-directory-US1-TC1-1: A consumer with both handlers gets one auction-standing move

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** One account open

**Pre-conditions:**

* customer is rendering `UserAccountPanel` with the supplied auction standing and handlers.

**Steps:**

1. Render an account panel with suspend and reinstate handlers.
2. Render one account that is not suspended and one that is suspended.

**Expected Results:**

* The first panel offers suspend only.
* The second panel offers reinstate only.

### shared-console-user-directory-US1-TC2-1: A consumer missing a handler gets no auction-standing move

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** One account open

**Pre-conditions:**

* customer is rendering `UserAccountPanel` with only one auction-standing handler.

**Steps:**

1. Render a panel with only one auction-standing handler.

**Expected Results:**

* The panel offers neither suspend nor reinstate.

### shared-console-user-directory-US1-TC3-1: The panel delegates confirmation to the consumer dialog

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** One account open

**Pre-conditions:**

* customer is rendering `UserAccountPanel` with a suspend handler and `UserModerationDialog` supplied by the consumer.

**Steps:**

1. Start suspend from an eligible panel.
2. Confirm it in the consumer's moderation dialog.

**Expected Results:**

* The panel reports the requested move without confirming it.
* The dialog receives the confirmation and its required reason.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| A partial handler set could expose an impossible move | **Raised, rejected:** both handlers are required so the consumer owns a complete standing transition |
| Panel confirmation could duplicate the consumer dialog | **Raised, folded into spec:** `shared-console-user-directory-SC-32` |
| Run | Read the shared feature set, the package journey, decisions, and the User Directory PRD; denied requirement deltas and archived changes |
