# shared/auth/test-sign-in Test Cases

**Status:** pending-review · 0/6
**Drafts styled:** 2026-10-19, tcs-rules r6
**Out of suite (api):** shared-auth-test-sign-in-SC-06, shared-auth-test-sign-in-SC-07, shared-auth-test-sign-in-SC-08, shared-auth-test-sign-in-SC-09, shared-auth-test-sign-in-SC-10, shared-auth-test-sign-in-SC-100, shared-auth-test-sign-in-SC-101, shared-auth-test-sign-in-SC-102, shared-auth-test-sign-in-SC-103, shared-auth-test-sign-in-SC-104, shared-auth-test-sign-in-SC-23, shared-auth-test-sign-in-SC-24, shared-auth-test-sign-in-SC-25, shared-auth-test-sign-in-SC-26, shared-auth-test-sign-in-SC-27, shared-auth-test-sign-in-SC-28, shared-auth-test-sign-in-SC-30, shared-auth-test-sign-in-SC-31, shared-auth-test-sign-in-SC-34, shared-auth-test-sign-in-SC-99

## g10.shared-test-sign-in.US1: Sign-in without the /dev endpoint

**As a** QA agent,
**I want** a tester to sign in on staging without a mailbox,
**so that** the sign-in suite runs without the disposable /dev endpoint

Walked by nobody on their own. The Trace line names the Feature set group.

### g10.shared-test-sign-in.US1-TC3: A QA agent with the committed staging token captures a named tester's sign-in link

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Who may call

**Pre-conditions:**

* `<collector address>` is a named tester on staging, and its sign-in link has been requested in the last fifteen minutes.

**Test data:**

| Field | Value |
| --- | --- |
| Caller | QA agent with the committed staging QA token |
| Tester | `<collector address>` |

**Steps:**

1. As the QA agent, send a capture request for `<collector address>` to the test endpoint on `grade10-stg.com`, with the committed QA token.
2. Read the returned sign-in link.
3. Open the link in a new browser session without a mailbox.

**Expected Results:**

* Step 1 is accepted and returns the sign-in link.
* Step 3 signs in as `<collector address>`.

**QA2 disposition:** kept.

**QA2 covers:** shared-auth-test-sign-in-SC-94.

### g10.shared-test-sign-in.US1-TC6: Capture returns the last sign-in mail link for a tester without a mailbox

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Automation status:** manual
* **Testability:** manual
* **Trace:** What the workflow may do

**Pre-conditions:**

* `<collector address>` has requested a sign-in link on staging in the last fifteen minutes, and the link has not been followed.

**Steps:**

1. Approve a run of the test-endpoint workflow on staging.
2. From that run, send a capture request for `<collector address>`.
3. Open the returned link in a new browser session.

**Expected Results:**

* Step 2 returns the link from the most recent sign-in mail for `<collector address>`.
* Step 3 signs in as `<collector address>`, with no mailbox opened.

**QA2 disposition:** kept.

**QA2 covers:** shared-auth-test-sign-in-SC-12.

### g10.shared-test-sign-in.US1-TC7: Expiring an unused link refuses its follow without a five-minute wait

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Automation status:** manual
* **Testability:** manual
* **Trace:** What the workflow may do

**Pre-conditions:**

* `<collector address>` has requested a sign-in link on staging, and the link has not been followed.

**Steps:**

1. Approve a run of the test-endpoint workflow on staging.
2. From that run, send an expire for `<collector address>`.
3. Follow the sign-in link immediately, without waiting.

**Expected Results:**

* Step 2 is accepted.
* Step 3 is refused as an expired link, and no session is created.

**QA2 disposition:** kept with a note - the no-account-change check from SC-16 is not asserted.

**QA2 covers:** none.

### g10.shared-test-sign-in.US1-TC8: Banning an address refuses a later sign-in follow

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Automation status:** manual
* **Testability:** manual
* **Trace:** What the workflow may do

**Pre-conditions:**

* `<ban-only address>` has signed in on staging before.

**Steps:**

1. Approve a run of the test-endpoint workflow on staging.
2. From that run, send a ban for `<ban-only address>`.
3. Request a sign-in link for `<ban-only address>` and follow it.

**Expected Results:**

* Step 2 is accepted.
* Step 3 is refused as a banned account, and no session is created.

**QA2 disposition:** kept.

**QA2 covers:** shared-auth-test-sign-in-SC-19.

### g10.shared-test-sign-in.US1-TC9: Granting the admin-only tester admin lets its followed link sign in as admin

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** none
* **Automation status:** manual
* **Testability:** manual
* **Trace:** What the workflow may do

**Pre-conditions:**

* `<admin-only address>` has an account on staging that does not yet hold `admin`.

**Steps:**

1. Approve a run of the test-endpoint workflow on staging.
2. From that run, send a grant of `admin` for `<admin-only address>`.
3. From that run, send a capture for `<admin-only address>` and follow the link.

**Expected Results:**

* Step 2 is accepted.
* Step 3 signs in as `<admin-only address>` and the session holds `admin`.

**QA2 disposition:** kept.

**QA2 covers:** shared-auth-test-sign-in-SC-20.

### g10.shared-test-sign-in.US1-TC10: A scoped role granted to a generated plus-tag of the collector signs in with that role only

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** none
* **Automation status:** manual
* **Testability:** manual
* **Trace:** What the workflow may do

**Pre-conditions:**

* The run generates a unique plus-tag of `<collector address>`, recorded as `<collector plus-tag>`.

**Test data:**

| Role |
| --- |
| staff |
| support |
| finance |
| treasurer |
| auditor |

**Steps:**

1. Approve a run of the test-endpoint workflow on staging, and generate `<collector plus-tag>`.
2. From that run, send a grant of the row's role for `<collector plus-tag>`.
3. Send a capture for `<collector plus-tag>` and follow the link.

**Expected Results:**

* Step 2 is accepted.
* Step 3 signs in as `<collector plus-tag>` holding the row's role.

**QA2 disposition:** kept with a note - the title says "only" and the expected results do not; SC-96's named-tester refusal is not asserted.

**QA2 covers:** shared-auth-test-sign-in-SC-06.

## Reconciliation

Run: QA2, 2026-10-19. Read the blind cases above, this change's `spec.md` scenarios, `decisions.md` (Q1 to Q54) and the procedure. Nothing else. TC25 was added on 2026-10-19; no other case's steps or expected results changed.

**Covered in full** - SC-01 (TC1), SC-06 (TC10), SC-07 (TC18), SC-12 (TC6), SC-19 (TC8), SC-20 (TC9), SC-21 (TC11), SC-25 (TC23), SC-26, SC-27, SC-28 (TC24), SC-94 (TC3), SC-101 (TC21), SC-103 (TC22), SC-104 (TC25, added 2026-10-19). SC-NN is shared-auth-test-sign-in-SC-NN.

**Not covered in full** - no case asserts the scenario: SC-02, SC-08, SC-09, SC-11, SC-13, SC-14, SC-15, SC-17, SC-18, SC-22, SC-23, SC-30, SC-31, SC-33, SC-34, SC-99. Partly asserted, see the case notes: SC-03, SC-04, SC-05, SC-32 (no nothing-changed check), SC-10, SC-16, SC-24, SC-29, SC-95, SC-96, SC-97, SC-98, SC-102.

**Over-claimed** - TC5 (unique plus-tag per run), TC14 (non-tester row via the QA token), TC17 (wrong-token and customer-session rows). Each states behaviour no scenario states; fold into spec.md.

**Contradictions** - None open. SC-100 once set a scoped role for a named tester, against Q42; it now names capture, expire, ban, grant `admin` and clear only.

**Repairs** - None. No case contradicts a settled decision.

**Raised** - None unsettled.
