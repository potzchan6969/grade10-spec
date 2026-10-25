# shared/auth/sign-out Test Cases

**Status:** pending-review · 0/3
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* `<g10url>` is the Grade10 site and `<console url>` the Grade10 console of the environment under test. An operator on the console has proved the second factor.

## Walk 1: An operator signs out of each side in turn

Starting state:

- staff(operator) signed in on `<console url>` in tab A and on `<g10url>` in tab B, with a card in the cart.

Shared test data:

| Field | Value |
| --- | --- |
| card | a card in the operator's cart on the site |

### Route

1. In tab A, select sign out and wait for it to finish.
   - The control is busy until it finishes; the console shows its sign-in page. `shared.auth-sign-out.US1-TC1`
2. Return to tab B.
   - Still signed in, the card in the cart, no signed-out message. `shared.auth-sign-out.US3-TC1`
3. In tab B, open the profile and sign out.
   - The marketing page, signed out. `shared.auth-sign-out.US1-TC1`

## shared.auth-sign-out.US1: Collector or operator signs out and lands signed out

**As a** signed-in person,
**I want** the control to show the request in flight and, on success, leave the signed-in surface,
**so that** I know the tap registered and I am not still looking at my account.

<!-- trace:case id=g10.shared-sign-out.TC-lsq rev=2 -->
### shared.auth-sign-out.US1-TC1: Sign-out is busy until it finishes, then leaves the signed-in page for good

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-out-US-01

**Pre-conditions:**

* `<person>` is signed in on `<page>`; the sign-out request is slowed so it stays in flight a few seconds.

**Test data:**

| `<person>` | `<page>` | `<lands on>` |
| --- | --- | --- |
| customer(collector) | `<g10url>/profile` | the marketing page |
| admin | `<console url>` | the console's sign-in page |

**Steps:**

1. Select sign out, and select it again while it is still running.
2. Wait for it to finish, then reload.

**Expected Results:**

* Step 1: the control shows it is busy, and the second select starts nothing.
* Step 2 shows `<lands on>` before and after the reload, nobody signed in.

---

## shared.auth-sign-out.US2: Collector or operator retries a refused sign-out

**As a** signed-in person,
**I want** a refused sign-out named as a failure I can retry,
**so that** a network miss does not leave me signed in with no explanation.

<!-- trace:case id=g10.shared-sign-out.TC-d61 rev=2 -->
### shared.auth-sign-out.US2-TC1: A refused sign-out is reported, and a retry clears it and signs out

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-out-US-02

**Pre-conditions:**

* `<person>` is signed in on `<page>`; the first sign-out request is made to fail and the next to succeed.

**Test data:**

| `<person>` | `<page>` | `<lands on>` |
| --- | --- | --- |
| customer(collector) | `<g10url>/profile` | the marketing page |
| admin | `<console url>` | the console's sign-in page |

**Steps:**

1. Select sign out.
2. Select sign out again.

**Expected Results:**

* Step 1: still signed in, with a failure message beside the control.
* Step 2: the message clears, then `<lands on>` shows.

---

## shared.auth-sign-out.US3: Operator signs out of the console and stays signed in on the site

**As an** operator,
**I want** signing out of one surface to end that surface's session only,
**so that** I do not lose my cart or watchlist by closing the console, nor leave the console open by leaving the site.

<!-- trace:case id=g10.shared-sign-out.TC-vnx rev=2 -->
### shared.auth-sign-out.US3-TC1: Signing out of one side leaves the other signed in, whoever it holds

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-out-US-03

**Pre-conditions:**

* staff(operator) is signed in on `<console url>`, and on `<g10url>` as `<site account>` with a card in the cart, each in its own tab.

**Test data:**

| `<site account>` | `<signed out of>` | `<other tab shows>` |
| --- | --- | --- |
| the operator's own | the console | the site, still the operator, the card in the cart |
| another account | the console | the site, still that account, the card in the cart |
| the operator's own | the site | the console, still the operator |

**Steps:**

1. In the `<signed out of>` tab, sign out and wait for it to finish.
2. Return to the other tab, then reload it.

**Expected Results:**

* Both times it shows `<other tab shows>`, with no signed-out message.

## Settled

* A console sign-out leaves the site's cart alone: only the surface that signed out empties its own cart, and only on its own confirmed sign-out.
* A console tab follows the console's session and no other, so a site sign-out leaves it showing the console (decisions Q11).

## Reconciliation

- **Covered at domain** - `shared.auth-dmn.US1-TC1` walks a site sign-out clearing the collector everywhere; `shared.auth-dmn.US8-TC1` walks a site sign-out leaving the console signed in
