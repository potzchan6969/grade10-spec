# grade10-site/site/page-shell Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-21, tcs-rules r3.0

## grade10-site-site-page-shell-US2: Collector sees the chrome before the session resolves

**As a** collector,
**I want** the header and the footer rendered before the session has resolved,
with only the account entry and the cart count updating once it does,
**so that** I can start navigating immediately without unrelated chrome
shifting under me.

<!-- trace:case id=g10.site-page-shell.TC-ev5 rev=2 covers=g10.site-page-shell.SC-9ud,g10.site-page-shell.SC-yxt -->
### grade10-site-site-page-shell-US2-TC2-2: The session changes only the account entry and cart count

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-02

**Pre-conditions:**

* A page rendered while the session was resolving.
* The header offers Cart.

**Test data:**

| `<session>` | `<cart count badge>` |
| --- | --- |
| Signed out | none |
| Signed in, no active lines | none |
| Signed in, 2 active lines | 2, once the cart review completes |

**Steps:**

1. Let the session resolve as <session>.
2. Inspect the account entry, the Cart control and the rest of the chrome.

**Expected Results:**

* The account entry matches <session>.
* The Cart control shows <cart count badge> and keeps its place.
* No other chrome control appears, disappears, or moves.

---

## grade10-site-site-page-shell-US8: Collector sees the cart count without opening the drawer

**As a** signed-in collector,
**I want** the header to show the same active-line count as my cart drawer as my cart changes,
**so that** I can see how many active lines I hold from any surface without opening the drawer.

<!-- trace:case id=g10.site-page-shell.TC-19a rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
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
* Run each row at 375px and 1200px.
* The cart drawer is closed.

**Test data:**

| Reviewed active lines | Expected count |
| --- | --- |
| 1 | 1 |
| 3 | 3 |
| 12 | 12 |
| 50 | 50 |

**Steps:**

1. Navigate to <grade10 store url>.
2. Observe the header after the cart review completes.
3. Click the Cart control.

**Expected Results:**

* Header shows the full active-line count before opening.
* Header count uses the round brand indicator.
* Cart control stays reachable, with no horizontal scroll.
* Drawer title count equals the header count.

<!-- trace:case id=g10.site-page-shell.TC-yv8 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
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
* The member cart holds an available line of quantity 3.
* It holds a line of quantity 2 whose price or quantity the review adjusted, awaiting checkout acknowledgement.
* It holds one sold-out line and one unavailable line.
* The cart drawer is closed.

**Steps:**

1. Navigate to <grade10 store url>.
2. Observe the header after the cart review completes.
3. Click the Cart control.

**Expected Results:**

* Header shows 2.
* Drawer title shows 2.

<!-- trace:case id=g10.site-page-shell.TC-mz6 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC3-1: Cart count follows navigation to Auction

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
3. Click Auction in the primary navigation.
4. Observe the header count.

**Expected Results:**

* The Auction header shows the Store count on arrival.
* No cart review runs on arrival.
* The drawer remains closed.

<!-- trace:case id=g10.site-page-shell.TC-mv8 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
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

<!-- trace:case id=g10.site-page-shell.TC-wf5 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
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

* customer is signed in on <grade10 store url>.
* The reviewed cart has one active line, of quantity 1.
* That line's product tile is on the listing and permits multiple quantities.
* The cart drawer is closed.

**Steps:**

1. Raise the quantity on that product tile's stepper to 2.
2. Wait for the mutation and cart review to finish.
3. Observe the header count.
4. Click the Cart control.

**Expected Results:**

* Header still shows 1 active line.
* Drawer title count equals the header count.

<!-- trace:case id=g10.site-page-shell.TC-id6 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC6-1: A cart change made elsewhere shows after the next review

Runs once per row of **Test data**.

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

* customer is signed in on <grade10 store url>.
* Header shows 2 reviewed active lines.
* The cart drawer is closed.
* <change made elsewhere> has happened since that review.

**Test data:**

| `<change made elsewhere>` | `<reviewed count>` |
| --- | --- |
| One active line became unavailable | 1 |
| The same member added a distinct line from another device | 3 |

**Steps:**

1. Observe the header count.
2. Click the Cart control.
3. Wait for the cart review to finish.
4. Observe the header count and the drawer title.

**Expected Results:**

* Before the review, the header still shows 2.
* After the review, the header shows <reviewed count>.
* Drawer title count equals the header count.

<!-- trace:case id=g10.site-page-shell.TC-xq5 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC7-1: An empty reviewed cart retains an unbadged control

Runs once per row of **Test data**.

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
* The reviewed cart holds <cart without active lines>.

**Test data:**

| `<cart without active lines>` |
| --- |
| No lines |
| Only a sold-out line and an unavailable line |

**Steps:**

1. Navigate to <grade10 store url>.
2. Observe the Cart control.

**Expected Results:**

* Cart remains visible without a count badge.

<!-- trace:case id=g10.site-page-shell.TC-70a rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
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
* Cart remains visible in the same place throughout.
* Successful review displays the active-line count.

<!-- trace:case id=g10.site-page-shell.TC-fj9 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
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

* customer is signed in on <grade10 store url>.
* Header shows a previously reviewed positive count.
* The cart drawer is closed.
* The next cart review cannot complete.

**Steps:**

1. Click the Cart control.
2. Wait for the cart review to fail.
3. Observe the header Cart control.

**Expected Results:**

* The previous count badge is absent.
* Cart remains visible.

<!-- trace:case id=g10.site-page-shell.TC-vv4 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
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

* customer is signed in on <grade10 store url> with the cart drawer open.
* Cart review failed and the header shows no count badge.
* The next cart review can complete with active lines.

**Steps:**

1. Click Retry on the review failure notice.
2. Wait for the cart review to finish.
3. Observe the header Cart control.

**Expected Results:**

* Header shows the newly reviewed active-line count.

<!-- trace:case id=g10.site-page-shell.TC-ux8 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC11-1: Visitors without a member session never display a cart count

Runs once per row of **Test data**.

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

* customer's session is <session>.

**Test data:**

| `<session>` |
| --- |
| Signed out |
| Unresolved, with the session read held |

**Steps:**

1. Navigate to <grade10 store url>.
2. Observe the Cart control.

**Expected Results:**

* Cart remains visible without a count badge.

<!-- trace:case id=g10.site-page-shell.TC-szw rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
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

* customer is signed in on <grade10 store url>.
* Header shows a positive member cart count.
* The member's next cart review is held pending.

**Steps:**

1. Click Sign Out in the account menu.
2. Observe the Cart control when the session changes.
3. Release the held cart review.
4. Observe the Cart control.

**Expected Results:**

* The previous member count disappears immediately.
* The released review does not restore a count badge.
* Cart remains visible without a count badge.

<!-- trace:case id=g10.site-page-shell.TC-rbe rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC13-1: Changing members cannot display the previous member count

Runs once per row of **Test data**.

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

* customer A has a reviewed cart count of 2.
* customer B's cart has 1 active line.
* customer A's next cart review and customer B's first review are held pending.

**Test data:**

| `<customer A review released>` |
| --- |
| Before customer B's review completes |
| After customer B's review completes |

**Steps:**

1. Navigate to <grade10 store url> as customer A.
2. Sign out, then sign in as customer B.
3. Observe the Cart control.
4. Release customer A's review and customer B's review in <customer A review released> order.
5. Observe the Cart control after each release.

**Expected Results:**

* The count 2 disappears immediately after the session changes.
* No count badge shows until customer B's review completes.
* Customer B's completed review shows 1.
* Customer A's released review never shows 2.

<!-- trace:case id=g10.site-page-shell.TC-yag rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
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

* customer is signed in on <grade10 store url>.
* The reviewed cart has one active line, of quantity 1.
* That line's product tile is on the listing.
* The cart drawer is closed.

**Steps:**

1. Lower the quantity on that product tile's stepper to 0.
2. Wait for the mutation and cart review to finish.
3. Observe the Cart control.

**Expected Results:**

* Cart remains visible without a count badge.

<!-- trace:case id=g10.site-page-shell.TC-4mi rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC15-1: Same-member refresh retains the last verified count

Runs once per row of **Test data**.

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

* customer is signed in on <grade10 store url> with a verified header count of 2.
* The cart drawer is closed.
* The next cart review is held pending.

**Test data:**

| `<cart update>` | `<reviewed count>` |
| --- | --- |
| Lowering one line's tile stepper to 0, which succeeds | 1 |
| Raising one line's tile stepper, which the server refuses and rolls back | 2 |

**Steps:**

1. Make <cart update> and wait for it to settle.
2. Observe the header while the review is pending.
3. Release the review and observe the header.
4. Make another cart update, fail its review, and observe the header.

**Expected Results:**

* Pending review retains 2 without a skeleton.
* Successful review shows <reviewed count>.
* Failed review hides the badge while keeping Cart available.

<!-- trace:case id=g10.site-page-shell.TC-mnz rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC16-1: A build without Store shows neither Cart nor a count

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in with a known positive active-line count.
* The build is one where Store does not answer.

**Steps:**

1. Navigate to <grade10 auction url>.
2. Observe the header.

**Expected Results:**

* The header shows no Cart control.
* The header shows no count badge.

## Settled

* The header count is one per distinct active line in the reviewed basket, whatever its quantity: adjusted lines count, sold-out and unavailable lines do not, and checkout eligibility does not decide it.
* The count refreshes on cart hydration, a settled cart change, and a cart review or retry, with the drawer open or closed; nothing polls, and a change from another device shows after the next review.
* The author chose to retain the last verified same-member count while a refresh is pending, including after failed cart updates; failed review hides the badge. Initial unknown counts and previous-member counts remain hidden.

## Reconciliation

**Run:** 2026-09-21. Independent scenario and blind suite agents read the proposal, decisions, new journey, and feature outline. The scenario reader additionally read durable page-shell and store-cart requirements; the suite reader was denied requirements, scenarios, archive, and the other reader's draft. UI uses the existing full-digit brand badge; no new visual design. No approved corpus was supplied to the blind pass, so rulebook defaults were used.

**Run:** 2026-10-06, QA2. A fresh reader joined the blind cases and the scenarios on `grade10-site-site-page-shell-US-08` and `grade10-site-site-page-shell-US-02`, read against the Cart section of the page-shell PRD, the decisions, the tech design and the grade10 cart drawer host (`apps/frontend/grade10/src/chrome/CartDrawerHost.tsx`) for how a review and a retry are reached. No domain, product or platform suite traces either journey: `grade10-site/site` holds no `domain-tcs.md`.

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| `grade10-site-site-page-shell-SC-42` | TC2 holds quantity, adjusted, sold-out and unavailable lines; TC1 compares the drawer title | Folded: TC1, TC2 |
| `grade10-site-site-page-shell-SC-43` | TC7 named "no active lines" without the all-excluded partition | Folded: TC7 gains the empty and sold-out-plus-unavailable rows; TC14 walks the transition to zero |
| `grade10-site-site-page-shell-SC-44` | TC1 ran 375px and 1200px but asserted no overflow; a 123-line row exceeded the 50-line cap grade10 holds a cart to (`packages/grade10-store/contracts/src/schemas.ts:422`) | Folded: TC1 tops out at 50 and asserts reachability without horizontal scroll |
| `grade10-site-site-page-shell-SC-45` | No blind case: once Cart is global, a surface without Cart is a build where Store does not answer | Folded: TC16 walks that build with a known positive count |
| `grade10-site-site-page-shell-SC-46` | TC1 and TC8 observe the count with the drawer closed | Folded: TC1, TC8 |
| `grade10-site-site-page-shell-SC-47` | Add, quantity change and remove with the drawer closed | Folded: TC4, TC5, TC14 |
| `grade10-site-site-page-shell-SC-48` | TC8 kept Cart visible but not in place | Folded: TC8 asserts the same place |
| `grade10-site-site-page-shell-SC-49` | TC9 and TC10 named a "review control" the site does not have; a review runs on drawer open and a retry from the failure notice | Folded: TC9 opens the drawer, TC10 clicks Retry |
| `grade10-site-site-page-shell-SC-50` | TC11 covered signed out only | Folded: TC11 gains the unresolved-session row |
| `grade10-site-site-page-shell-SC-51` | TC12 did not hold a late response | Folded: TC12 releases a held review after sign-out |
| `grade10-site-site-page-shell-SC-52` | TC13 held only B's review, so a late response from A was not walked | Folded: TC13 releases A's held review before and after B's |
| `grade10-site-site-page-shell-SC-53` | Pending refresh and failed mutation behaviour needed a decision | Author chose retain while checking for the same member, hide on failure; Q9 and TC15 |
| `grade10-site-site-page-shell-SC-54` | No blind case reached a change from another device; TC6 walked a line turning unavailable, the same run with a different change | Folded: TC6 takes both changes as rows and asserts the count before the review |
| `grade10-site-site-page-shell-SC-55` | TC3 named an unnamed surface and did not assert the count arrives without a review | Folded: TC3 moves to Auction and asserts no review on arrival |
| `grade10-site-site-page-shell-SC-04` | The badge clause adds nothing to the first paint | Durable US2-TC1 holds it |
| `grade10-site-site-page-shell-SC-05` | The modified requirement lets the session decide the cart count badge, and the badge must not move Cart; durable US2-TC2 said only the account entry changes | Folded: US2-TC2-2, revised with session rows for the badge and the Cart control's place |
| Q8, the count's meaning | Raised by the shared chrome pass | Settled above; the shared suite records the chrome's half |
| Q10, the refresh triggers | Settled in decisions | Settled above |

**Run:** 2026-10-06, QA2 second reading. A fresh reader re-joined every case and scenario on both journeys against the Cart section of the page-shell PRD, the decisions and the tech design, and read the grade10 surfaces a case drives: the listing tile's stepper sets a line's quantity and takes it out at zero with the drawer closed (`apps/frontend/grade10/src/pages/store/ProductListingPage.tsx:357`), and the review failure notice carries Retry (`apps/frontend/grade10/src/chrome/CartDrawerHost.tsx:275`).

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| `grade10-site-site-page-shell-SC-42` | TC2 named the partitions but asserted no number, so a quantity total could pass it | Folded: TC2 takes the scenario's basket and asserts `2` on the header and the drawer title |
| `grade10-site-site-page-shell-SC-47` | TC5 and TC14 named a quantity control and a removal control outside the drawer without saying where; the drawer was not held closed | Folded: both drive the listing tile's stepper with the drawer closed |
| `grade10-site-site-page-shell-SC-53` | TC15 ran a successful and a failed update as a sentence, not rows, and released a count the refused update could not reach | Folded: TC15 takes the two updates as rows, each with its reviewed count |
| `grade10-site-site-page-shell-SC-52` | TC13 changed member with no step a collector can take | Folded: TC13 signs out and signs in as B |
| `grade10-site-site-page-shell-SC-05` | US2-TC2-2 ran per row without saying so | Folded: the per-row line added |
| Uncovered anchors | Every scenario serving `grade10-site-site-page-shell-US-02` and `grade10-site-site-page-shell-US-08` is asserted by a case | None |
| Contradicted readings | No case and scenario disagree, and none disagrees with the page | None |
