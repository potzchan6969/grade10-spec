# grade10-site/site/page-shell Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-21, tcs-rules r3.0

## grade10-site-site-page-shell-US8: Collector sees the cart count without opening the drawer

**As a** signed-in collector,
**I want** the header to show the same active-line count as my cart drawer as my cart changes,
**so that** I can see how many active lines I hold from any surface without opening the drawer.

### grade10-site-site-page-shell-US8-TC1-1: Reviewed active lines match the drawer title count

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in.
* The member cart contains the reviewed lines in Test data.
* Run each row at 375px and 1200px with fixtures where the server cart limit would otherwise prevent the boundary.
* The cart drawer is closed.

**Test data:**

| Reviewed active lines | Expected count |
| --- | --- |
| 1 | 1 |
| 3 | 3 |
| 12 | 12 |
| 123 | 123 |

**Steps:**

1. Navigate to <grade10 store url>.
2. Observe the header after the cart review completes.
3. Click the Cart control.

**Expected Results:**

* Header shows the full active-line count before opening.
* Drawer title count equals the header count.
* Header count uses the round brand indicator.

### grade10-site-site-page-shell-US8-TC2-1: Quantity and checkout eligibility do not replace active lines

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in.
* The cart has active lines with multiple quantities.
* One active line is quantity-adjusted and awaits checkout acknowledgement.
* The cart includes sold-out and unavailable lines.

**Steps:**

1. Navigate to <grade10 store url>.
2. Observe the header after the cart review completes.
3. Click the Cart control.

**Expected Results:**

* Header counts distinct active lines, including checkout-ineligible active lines.
* Sold-out and unavailable lines contribute nothing.
* Drawer title count equals the header count.

### grade10-site-site-page-shell-US8-TC3-1: Cart count follows navigation across available cart surfaces

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in.
* The reviewed cart has active lines.
* The cart drawer is closed.

**Steps:**

1. Navigate to <grade10 store url>.
2. Observe the header count.
3. Navigate to <another grade10 surface with Cart>.
4. Observe the header count.

**Expected Results:**

* Both surfaces show the same active-line count.
* The drawer remains closed.

### grade10-site-site-page-shell-US8-TC4-1: Adding a line refreshes the closed drawer count

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in on <grade10 store product url>.
* The reviewed cart is empty.
* The cart drawer is closed.
* The displayed product can be added to the cart.

**Steps:**

1. Click the product add-to-cart control.
2. Wait for the mutation and cart review to finish.
3. Observe the header count.

**Expected Results:**

* Header shows 1 active line.
* The count updates without opening the drawer.

### grade10-site-site-page-shell-US8-TC5-1: Quantity changes preserve the distinct active-line count

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in on <grade10 surface with cart quantity controls>.
* The reviewed cart has one active line.
* The active line permits multiple quantities.

**Steps:**

1. Change the active line quantity.
2. Wait for the mutation and cart review to finish.
3. Observe the header count.
4. Click the Cart control.

**Expected Results:**

* Header still shows 1 active line.
* Drawer title count equals the header count.

### grade10-site-site-page-shell-US8-TC6-1: Explicit review refreshes the displayed active-line count

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in on <grade10 cart review surface>.
* Header shows the previous reviewed active-line count.
* A previously active cart line is now unavailable.

**Steps:**

1. Click the cart review control.
2. Wait for the cart review to finish.
3. Observe the header count.

**Expected Results:**

* Header reflects the newly reviewed active-line count.
* The unavailable line contributes nothing.

### grade10-site-site-page-shell-US8-TC7-1: An empty reviewed cart retains an unbadged control

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in.
* The reviewed cart has no active lines.

**Steps:**

1. Navigate to <grade10 store url>.
2. Observe the Cart control.

**Expected Results:**

* Cart remains visible without a count badge.

### grade10-site-site-page-shell-US8-TC8-1: Initial unknown count appears only after successful review

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in.
* Initial cart review is held pending.
* The member cart contains active lines.

**Steps:**

1. Navigate to <grade10 store url>.
2. Observe the Cart control while review is pending.
3. Allow the cart review to complete.
4. Observe the Cart control.

**Expected Results:**

* Pending review shows no badge or badge skeleton.
* Cart remains visible throughout.
* Successful review displays the active-line count.

### grade10-site-site-page-shell-US8-TC9-1: Failed cart review clears the previously known count

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in on <grade10 cart review surface>.
* Header shows a previously reviewed positive count.
* The next cart review cannot complete.

**Steps:**

1. Click the cart review control.
2. Wait for the cart review to fail.
3. Observe the Cart control.

**Expected Results:**

* The previous count badge is absent.
* Cart remains visible.

### grade10-site-site-page-shell-US8-TC10-1: Retry restores the count after a failed review

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in on <grade10 cart review surface>.
* Cart review failed and its count is unknown.
* The next cart review can complete with active lines.

**Steps:**

1. Click the cart retry control.
2. Wait for the cart review to finish.
3. Observe the Cart control.

**Expected Results:**

* Header shows the newly reviewed active-line count.

### grade10-site-site-page-shell-US8-TC11-1: Signed-out visitors never display a member cart count

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed out.

**Steps:**

1. Navigate to <grade10 store url>.
2. Observe the Cart control.

**Expected Results:**

* Cart remains visible without a count badge.

### grade10-site-site-page-shell-US8-TC12-1: Signing out clears the count before another review

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in on <grade10 account surface>.
* Header shows a positive member cart count.

**Steps:**

1. Click Sign out.
2. Observe the Cart control when the session changes.

**Expected Results:**

* The previous member count disappears immediately.
* Cart remains visible without a count badge.

### grade10-site-site-page-shell-US8-TC13-1: Changing members cannot display the previous member count

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer A has a reviewed positive cart count.
* customer B has a different member cart.
* customer B cart review is held pending.

**Steps:**

1. Navigate to <grade10 store url> as customer A.
2. Change the signed-in session to customer B.
3. Observe the Cart control before review completes.
4. Allow customer B cart review to complete.

**Expected Results:**

* Previous member count disappears immediately after session ownership changes.
* Pending review shows no count badge.
* Completed review shows only customer B active-line count.

### grade10-site-site-page-shell-US8-TC14-1: Removing the last active line clears the badge

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in on <grade10 cart surface>.
* The reviewed cart has one active line.

**Steps:**

1. Click the active line removal control.
2. Wait for the mutation and cart review to finish.
3. Observe the Cart control.

**Expected Results:**

* Cart remains visible without a count badge.


### grade10-site-site-page-shell-US8-TC15-1: Same-member refresh retains the last verified count

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in with a verified header count of 2.
* The next cart review is held pending after a cart update settles.
* Run for a successful update and a failed update whose cart state is restored.

**Steps:**

1. Settle the cart update and observe the header while review is pending.
2. Complete review with 1 active line and observe the header.
3. Start another review, fail it, and observe the header.

**Expected Results:**

* Pending review retains 2 without a skeleton.
* Successful review replaces the count with 1.
* Failed review hides the badge while keeping Cart available.

## Settled

- The author chose to retain the last verified same-member count while a refresh is pending, including after failed cart updates; failed review hides the badge. Initial unknown counts and previous-member counts remain hidden.


## Reconciliation

**Run:** 2026-09-21. Independent scenario and blind suite agents read the proposal, decisions, new journey, and feature outline. The scenario reader additionally read durable page-shell and store-cart requirements; the suite reader was denied requirements, scenarios, archive, and the other reader's draft. UI uses the existing full-digit brand badge; no new visual design. No approved corpus was supplied to the blind pass, so rulebook defaults were used.

| Anchor | Reading | Disposition |
| --- | --- | --- |
| grade10-site-site-page-shell-US-08 | Count, quantity, navigation and mutation cases agree | Covered by `grade10-site-site-page-shell-SC-30`, `grade10-site-site-page-shell-SC-31`, `grade10-site-site-page-shell-SC-34`, and `grade10-site-site-page-shell-SC-35` |
| grade10-site-site-page-shell-US-08 | Unknown, failed, retry and ownership cases agree | Covered by `grade10-site-site-page-shell-SC-36` through `grade10-site-site-page-shell-SC-40` |
| grade10-site-site-page-shell-US-08 | Wide/compact boundary was explicit in scenario reading | Added widths to TC1; `grade10-site-site-page-shell-SC-32` |
| grade10-site-site-page-shell-US-08 | Pending refresh and failed mutation behavior needs a decision | Author chose retain while checking for the same member, hide on failure; Q9, TC15 and `grade10-site-site-page-shell-SC-41` |

**Out of suite:** `grade10-site-site-page-shell-SC-04` and `grade10-site-site-page-shell-SC-05` retain their existing coverage in the durable page-shell suite. `grade10-site-site-page-shell-SC-33` retains absent-control coverage in that suite and shared header stories; Group 5 verifies it through application composition.
