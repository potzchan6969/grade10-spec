# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## winner-order-US9: Winner confirms delivery when five addresses are already saved

**As a** winner with five saved shipping addresses,
**I want** to confirm a different address for this order without saving a sixth,
**so that** a full address book does not block settlement before the address deadline.

### winner-order-US9-TC1-1: Winner opens Add new address when the account book already holds five saved addresses

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**
An authenticated winner account with exactly five saved shipping addresses, viewing <the winner's auction order url> before the address deadline.

**Steps:**

1. Open the order's Confirm Delivery Address selector.
2. Select Add new address.

**Expected Results:**

* The Add new address form opens.
* No message blocks the form from opening.

### winner-order-US9-TC2-1: Winner confirms a one-time delivery address for the order when the book is full

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**
An authenticated winner account with exactly five saved shipping addresses, viewing <the winner's auction order url> before the address deadline.

**Test data:**

| Field | Value |
| --- | --- |
| New address | <a new shipping address's full details> |

**Steps:**

1. Open the order's Confirm Delivery Address selector.
2. Select Add new address.
3. Enter the new address's details in the form.
4. Leave Save this address for future orders unselected.
5. Confirm the address for this order.

**Expected Results:**

* The order's delivery address is set to the entered address.
* The account's saved address count remains five.

### winner-order-US9-TC3-1: A one-time address entered at the cap sits as a draft at the top of the address picker

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**
An authenticated winner account with exactly five saved shipping addresses, viewing <the winner's auction order url> before the address deadline.

**Test data:**

| Field | Value |
| --- | --- |
| New address | <a new shipping address's full details> |

**Steps:**

1. Open the order's Confirm Delivery Address selector.
2. Select Add new address and enter the new address's details.
3. Select Use this address.

**Expected Results:**

* The one-time address appears as a draft entry at the top of the address picker list.
* The five saved addresses remain listed below the draft entry.

### winner-order-US9-TC4-1: Save this address for future orders is refused when the book already holds five addresses

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**
An authenticated winner account with exactly five saved shipping addresses, viewing <the winner's auction order url> before the address deadline.

**Test data:**

| Field | Value |
| --- | --- |
| New address | <a new shipping address's full details> |

**Steps:**

1. Open the order's Confirm Delivery Address selector.
2. Select Add new address and enter the new address's details.
3. Attempt to select Save this address for future orders.

**Expected Results:**

* The Save this address for future orders checkbox is disabled and unchecked.
* An Info tooltip beside the checkbox states a short reason the save is refused.

### winner-order-US9-TC5-1: Save this address for future orders remains available below the cap

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
* **Trace:** winner-order-US-09

**Pre-conditions:**
An authenticated winner account with exactly four saved shipping addresses, viewing <the winner's auction order url> before the address deadline.

**Test data:**

| Field | Value |
| --- | --- |
| New address | <a new shipping address's full details> |

**Steps:**

1. Open the order's Confirm Delivery Address selector.
2. Select Add new address and enter the new address's details.
3. Select Save this address for future orders.
4. Confirm the address for this order.

**Expected Results:**

* The Save this address for future orders checkbox is enabled and can be checked.
* The new address is added to the account's saved address book, bringing the saved count to five.

### winner-order-US9-TC6-1: Removing a saved address frees a slot so saving becomes available again

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
* **Trace:** winner-order-US-09

**Pre-conditions:**
An authenticated winner account with exactly five saved shipping addresses, including <a saved address named "Home">.

**Steps:**

1. Remove <a saved address named "Home"> from the account's shipping address book.
2. Open <the winner's auction order url>'s Confirm Delivery Address selector.
3. Select Add new address and enter <a new shipping address's full details>.
4. Attempt to select Save this address for future orders.

**Expected Results:**

* The account's saved address count is four after the removal.
* The Save this address for future orders checkbox is enabled.

### winner-order-US9-TC7-1: Editing a saved address at the cap does not consume an additional slot

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**
An authenticated winner account with exactly five saved shipping addresses, including <a saved address named "Home">.

**Test data:**

| Field | Value |
| --- | --- |
| Updated field on "Home" | <an updated street address> |

**Steps:**

1. Open <a saved address named "Home"> for editing.
2. Change the address's street field to the updated value.
3. Save the edit.

**Expected Results:**

* The account's saved address count remains five.
* The address book shows the edited entry once, with the updated value.

### winner-order-US9-TC8-1: An account already holding more than five saved addresses keeps them and still refuses new saves

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**
An authenticated winner account with six saved shipping addresses, held from before the cap took effect, viewing <the winner's auction order url> before the address deadline.

**Test data:**

| Field | Value |
| --- | --- |
| New address | <a new shipping address's full details> |

**Steps:**

1. Open the account's shipping address book.
2. Open the order's Confirm Delivery Address selector.
3. Select Add new address and enter the new address's details.
4. Attempt to select Save this address for future orders.

**Expected Results:**

* All six existing saved addresses remain listed in the account's address book.
* The Save this address for future orders checkbox is disabled and unchecked for the new address.

## Raised

(none — the questions the two readings raised on this journey were dispositioned in `## Reconciliation` below; nothing here was left unsettled.)

## Reconciliation

**Run:** 2026-09-16 — `cap-winner-order-saved-addresses`. Scenario draft (sub-agent A, given the outline, journeys, decisions.md, ui-design.md, the linked PRD section, and the durable requirement it modifies — never this suite) and this suite (sub-agent B, given the isolated input only — outline, journeys, decisions.md, ui-design.md, proposal.md, the linked PRD section, and the prior `winner-order-US1/US2/US8` suite for id continuity — never `## Requirements`) were drafted independently and joined here on the `winner-order-US-09` anchor.

- **Raised, rejected:** TC1's arrival step and the generic "saving a sixth address is refused" behaviour are both already carried by `winner-order-SC-73` through `winner-order-SC-75`; no separate scenario needed.
- **Raised, rejected:** the exact refusal-reason copy (TC4 / scenario draft's own raised question) — content detail, not a behaviour gap; copied to the durable suite's `## Settled` at fold.
- **Raised, rejected:** account-wide vs. Winner-Order-only enforcement (scenario draft's raised question, and TC8's implicit scope question) — already settled by the durable requirement's unchanged first paragraph; copied to `## Settled` at fold.
- **Raised, rejected:** whether archiving is reachable from within Winner Order, and whether over-cap accounts can still edit/archive freely (TC6/TC8's implicit questions) — both already granted by the durable requirement's unchanged second paragraph; copied to `## Settled` at fold.
- **Case carried behaviour no scenario stated, and it was real:** TC3 (the one-time address stays visible ahead of the saved addresses) — folded into `spec.md` as `winner-order-SC-79`, plus a sentence added to the modified requirement.
- **Raised, escalated:** TC3's further question — whether the one-time draft entry is visually distinguished from saved entries, and whether it survives navigating away and back or a page reload — the isolated input (`ui-design.md`, `decisions.md`) is silent on persistence. Escalated to the PRD (`docs/prds/products/grade10-site/auction/winner-order.md`, ❓ **One-time address persistence**) and to `proposal.md`'s `## Open questions`, for @tangconst.
- **Uncovered anchors:** none — every scenario under `winner-order-US-09` traces to a case above, and every case traces `winner-order-US-09`.
