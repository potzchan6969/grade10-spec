# shared/auth/test-sign-in Test Cases

**Status:** pending-review · 0/24
**Drafts styled:** 2026-10-19, tcs-rules r6

## g10.shared-test-sign-in.US1: Sign-in without the /dev endpoint

**As a** QA agent,
**I want** a tester to sign in on staging without a mailbox,
**so that** the sign-in suite runs without the disposable /dev endpoint

Walked by nobody on their own. The Trace line names the Feature set group.

### g10.shared-test-sign-in.US1-TC1: A reviewer-approved run of the test-endpoint workflow from main opens the endpoint on staging

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Who may call / The test endpoint's own workflow

**Pre-conditions:**

* A dispatch of the test-endpoint workflow targets the main branch, and a reviewer is available to approve it.

**Test data:**

| Field | Value |
| --- | --- |
| Environment | staging, host `grade10-stg.com` |
| Tester | `<collector address>` |

**Steps:**

1. Open the pending dispatch of the test-endpoint workflow in GitHub Actions and approve it for the staging environment.
2. Open the run and read its repository, workflow name and branch.
3. Send a capture request for `<collector address>` to the test endpoint on `grade10-stg.com`.

**Expected Results:**

* The run shows this repository's Actions running the test-endpoint workflow from the main branch.
* Step 3 is accepted and the endpoint returns a sign-in link for `<collector address>`.

**QA2 disposition:** kept.

**QA2 covers:** shared-auth-test-sign-in-SC-01.

### g10.shared-test-sign-in.US1-TC2: A run not started by an approved dispatch from main is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Who may call / The test endpoint's own workflow

**Pre-conditions:**

* The test-endpoint workflow can be started on staging from the row's source.

**Test data:**

| Run started by | Branch | Reviewer approved | Outcome |
| --- | --- | --- | --- |
| A pull request | the pull request's branch | Yes | Refused |
| A dispatch | a branch other than main | Yes | Refused |
| A dispatch | main | No | Refused |

**Steps:**

1. Start the test-endpoint workflow with the row's source and branch.
2. If the run waits for approval, record the reviewer decision set in the row.
3. From that run, send a capture request for `<collector address>` to the test endpoint on `grade10-stg.com`.

**Expected Results:**

* The row's outcome holds: the run does not open the endpoint.
* The capture request returns no sign-in link.

**QA2 disposition:** kept with a note - the refusal and the no-link check are asserted; "nothing is changed" in SC-03, SC-04 and SC-32 is not.

**QA2 covers:** none.

### g10.shared-test-sign-in.US1-TC3: A QA agent with the committed staging token captures a named tester's sign-in link

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Who may call / The QA token

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

### g10.shared-test-sign-in.US1-TC4: A named tester with no account gets one when an action needs it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Testers / The named testers

**Pre-conditions:**

* `<admin-only address>` has never signed in on staging and has no account.

**Steps:**

1. Approve a run of the test-endpoint workflow on staging.
2. From that run, send a grant of `admin` for `<admin-only address>`.
3. Read the account for `<admin-only address>` on staging.

**Expected Results:**

* Step 2 is accepted.
* An account for `<admin-only address>` exists after step 2 and holds `admin`.

**QA2 disposition:** kept with a note - a named tester with no account; SC-10 states a plus-tag, so the named-tester start is not linked.

**QA2 covers:** none.

### g10.shared-test-sign-in.US1-TC5: A staging run generates a unique plus-tag of a named tester on each run

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Testers / The named testers

**Pre-conditions:**

* Two runs of the test-endpoint workflow are approved on staging, one after the other.

**Steps:**

1. In the first run, request a generated plus-tag for a test that needs an unused address, and record it as `<plus-tag A>`.
2. In the second run, request a generated plus-tag for the same kind of test, and record it as `<plus-tag B>`.
3. Compare the two addresses with the named testers on staging.

**Expected Results:**

* `<plus-tag A>` and `<plus-tag B>` are each a plus-tag of one named tester.
* `<plus-tag A>` and `<plus-tag B>` differ from each other.

**QA2 disposition:** over-claimed - asserts that each run's generated plus-tag is unique; no scenario states it. Fold into spec.md as a scenario.

**QA2 covers:** none.

### g10.shared-test-sign-in.US1-TC6: Capture returns the last sign-in mail link for a tester without a mailbox

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** What the workflow may do / Capture the link

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
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** What the workflow may do / Expire the unused link

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
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** What the workflow may do / Ban the address

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
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** What the workflow may do / Grant the address

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
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** What the workflow may do / Grant a scoped role

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

### g10.shared-test-sign-in.US1-TC11: Clearing the sign-in limits stops the wait between mails and the count cap from throttling a suite

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** What the workflow may do / Clear the sign-in limits

**Pre-conditions:**

* `<collector address>` has recently received sign-in mails on staging, so the wait between mails applies.

**Steps:**

1. Approve a run of the test-endpoint workflow on staging.
2. From that run, send a clear of the sign-in limits.
3. Request sign-in mails for `<collector address>` in quick succession, up to the cap a caller may ask for.

**Expected Results:**

* Step 2 is accepted.
* Every request in step 3 receives a mail, with no throttle answer.

**QA2 disposition:** kept.

**QA2 covers:** shared-auth-test-sign-in-SC-21. The cap step does not reach SC-33, which clears after the cap is reached.

### g10.shared-test-sign-in.US1-TC12: Every action opens on staging and uat

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Where it opens / Staging and uat

**Pre-conditions:**

* The test-endpoint workflow can be approved for the row's environment.

**Test data:**

| Environment | Host |
| --- | --- |
| staging | `grade10-stg.com` |
| uat | `<uat host>` |

**Steps:**

1. Approve a run of the test-endpoint workflow for the row's environment.
2. From that run, send, in turn, a capture, an expire, a ban, a grant of `admin`, a scoped role grant on a generated plus-tag, and a clear of the sign-in limits, each for `<collector address>` or its plus-tag.

**Expected Results:**

* Every action in step 2 is accepted on the row's environment.

**QA2 disposition:** kept with a note - the scoped role is on a plus-tag, as Q42 settles; SC-100 names a named tester (see Reconciliation).

**QA2 covers:** none.

### g10.shared-test-sign-in.US1-TC13: Capture and clear work on production and preview for the production collector

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Where it opens / Production, and preview with it

**Pre-conditions:**

* The production collector `<collector address>` is the only tester named for production.

**Test data:**

| Environment | Host |
| --- | --- |
| production | `<production host>` |
| preview | `<preview host>` |

**Steps:**

1. Approve a run of the test-endpoint workflow for the row's environment.
2. From that run, send a capture for `<collector address>`.
3. From that run, send a clear of the sign-in limits.

**Expected Results:**

* Steps 2 and 3 are accepted on the row's environment.

**QA2 disposition:** kept with a note - steps 2 and 3 are asserted accepted, not the link returned; SC-24 and SC-102 are not fully asserted.

**QA2 covers:** none.

### g10.shared-test-sign-in.US1-TC14: The QA token is refused for the admin-only tester and for an address that is not a tester

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Who may call / The QA token

**Pre-conditions:**

* `<admin-only address>` is the admin-only tester on staging.

**Test data:**

| Address | Outcome |
| --- | --- |
| `<admin-only address>` | Refused |
| `<non-tester address>` | Refused |

**Steps:**

1. Send a capture request for the row's address to the test endpoint on `grade10-stg.com`, with the committed QA token.
2. Read the response.

**Expected Results:**

* The response refuses the request, and no sign-in link is returned.
* The account for the row's address is unchanged and no session is created for it.

**QA2 disposition:** over-claimed - the non-tester row through the QA token has no scenario; fold into spec.md as a scenario. The admin-only row matches SC-97 but does not assert that the refusal names no rule.

**QA2 covers:** none.

### g10.shared-test-sign-in.US1-TC15: The QA token is refused for ban, grant and scoped-role actions on a tester

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Who may call / The QA token

**Pre-conditions:**

* `<collector address>` is a named tester on staging.

**Test data:**

| Action | Outcome |
| --- | --- |
| Ban `<collector address>` | Refused |
| Grant `admin` to `<collector address>` | Refused |
| Grant `staff` on a plus-tag of `<collector address>` | Refused |

**Steps:**

1. Send the row's action to the test endpoint on `grade10-stg.com`, with the committed QA token.
2. Read the response.

**Expected Results:**

* The response refuses the action.
* The account for `<collector address>` is unchanged.

**QA2 disposition:** kept with a note - asserts the ban and grant route of SC-95 only; the replaced-token route is not asserted.

**QA2 covers:** none.

### g10.shared-test-sign-in.US1-TC16: The QA token is refused on production

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Who may call / The QA token

**Pre-conditions:**

* `<collector address>` is the production collector.

**Steps:**

1. Send a capture request for `<collector address>` to the test endpoint on `<production host>`, with the committed QA token.
2. Read the response.

**Expected Results:**

* The response refuses the request, and no sign-in link is returned.

**QA2 disposition:** kept with a note - production only; SC-98's nothing-changed check and its uat and preview routes are not asserted.

**QA2 covers:** none.

### g10.shared-test-sign-in.US1-TC17: Callers other than the workflow and the QA token are refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Who may call / Every other caller is refused

**Pre-conditions:**

* `<collector address>` is a named tester on staging.

**Test data:**

| Caller | Outcome |
| --- | --- |
| No credential | Refused |
| A wrong token value | Refused |
| A signed-in customer session | Refused |

**Steps:**

1. Send a capture request for `<collector address>` to the test endpoint on `grade10-stg.com`, from the row's caller.
2. Read the response.

**Expected Results:**

* The response refuses the request, and no sign-in link is returned.

**QA2 disposition:** over-claimed - the wrong-token and signed-in customer-session rows have no scenario; fold into spec.md as a scenario. The no-credential row matches SC-05 but does not assert that nothing is changed.

**QA2 covers:** none.

### g10.shared-test-sign-in.US1-TC18: An address that is not a named tester is refused, and no account is created for it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Testers / The named testers

**Pre-conditions:**

* The row's address has no account on staging.

**Test data:**

| Address | Outcome |
| --- | --- |
| `<non-tester address>` | Refused |
| A plus-tag of `<non-tester address>` | Refused |

**Steps:**

1. Approve a run of the test-endpoint workflow on staging.
2. From that run, send a capture request for the row's address.

**Expected Results:**

* The request is refused, and no sign-in link is returned.
* No account exists for the row's address afterwards.

**QA2 disposition:** kept.

**QA2 covers:** shared-auth-test-sign-in-SC-07.

### g10.shared-test-sign-in.US1-TC19: A sign-in mail older than fifteen minutes can no longer be captured

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** What the workflow may do / Capture the link

**Pre-conditions:**

* The last sign-in mail for `<collector address>` on staging was sent more than fifteen minutes ago.

**Steps:**

1. Approve a run of the test-endpoint workflow on staging.
2. From that run, send a capture request for `<collector address>`.

**Expected Results:**

* No sign-in link is returned for the old mail.

**QA2 disposition:** kept with a note - SC-29's "call is not refused" is not asserted.

**QA2 covers:** none.

### g10.shared-test-sign-in.US1-TC20: A scoped role is refused for every named tester

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** What the workflow may do / Grant a scoped role

**Pre-conditions:**

* The four named testers on staging are `<collector address>`, `<plus-tag sibling address>`, `<ban-only address>` and `<admin-only address>`.

**Test data:**

| Tester | Outcome |
| --- | --- |
| `<collector address>` | Refused |
| `<plus-tag sibling address>` | Refused |
| `<ban-only address>` | Refused |
| `<admin-only address>` | Refused |

**Steps:**

1. Approve a run of the test-endpoint workflow on staging.
2. From that run, send a grant of `staff` for the row's tester.

**Expected Results:**

* The grant is refused.
* The row's tester does not hold `staff`.

**QA2 disposition:** kept with a note - asserts the named-tester refusal in the staff role only; SC-96's plus-tag grant is not asserted.

**QA2 covers:** none.

### g10.shared-test-sign-in.US1-TC21: Ban, grant, expire and scoped-role actions are refused on production

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Where it opens / Production, and preview with it

**Pre-conditions:**

* `<collector address>` is the production collector.

**Test data:**

| Action | Outcome |
| --- | --- |
| Ban `<collector address>` | Refused |
| Grant `admin` to `<collector address>` | Refused |
| Expire the unused link for `<collector address>` | Refused |
| Grant `staff` on a plus-tag of `<collector address>` | Refused |

**Steps:**

1. Approve a run of the test-endpoint workflow for production.
2. From that run, send the row's action.

**Expected Results:**

* The row's action is refused.
* The account and its sign-in link for `<collector address>` are unchanged.

**QA2 disposition:** kept.

**QA2 covers:** shared-auth-test-sign-in-SC-101. The ban row does not reach SC-24, which also asserts a link is received.

### g10.shared-test-sign-in.US1-TC22: Local stacks open no test-endpoint action

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Closed / Everywhere else

**Pre-conditions:**

* A local stack runs the auth backend from this repository.

**Steps:**

1. Send a capture request for `<collector address>` to the test endpoint on the local stack.
2. Send a ban for `<ban-only address>` to the same endpoint on the local stack.

**Expected Results:**

* Both requests are refused.
* No sign-in link is returned and no account changes.

**QA2 disposition:** kept.

**QA2 covers:** shared-auth-test-sign-in-SC-103.

### g10.shared-test-sign-in.US1-TC23: The disposable `/dev` endpoint stays closed on staging, uat and production

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Closed / Everywhere else

**Pre-conditions:**

* The row's environment is deployed.

**Test data:**

| Environment | Host |
| --- | --- |
| staging | `grade10-stg.com` |
| uat | `<uat host>` |
| production | `<production host>` |

**Steps:**

1. Send a request for `<collector address>` to the `/dev` endpoint on the row's host.
2. Read the response.

**Expected Results:**

* The endpoint answers closed, and no session is created.

**QA2 disposition:** kept.

**QA2 covers:** shared-auth-test-sign-in-SC-25.

### g10.shared-test-sign-in.US1-TC24: The test-endpoint workflow does not generate a session, unban an address or seed store and auction data

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Closed / Everywhere else

**Pre-conditions:**

* `<ban-only address>` is banned on staging.

**Test data:**

| Request | Outcome |
| --- | --- |
| Generate a session for `<collector address>` without following the mail | Refused, no session |
| Unban `<ban-only address>` | Refused, still banned |
| Seed store or auction data | Refused, no data created |

**Steps:**

1. Approve a run of the test-endpoint workflow on staging.
2. From that run, send the row's request.

**Expected Results:**

* The row's outcome holds.
* The account state and store or auction data are unchanged.

**QA2 disposition:** kept.

**QA2 covers:** shared-auth-test-sign-in-SC-26, shared-auth-test-sign-in-SC-27, shared-auth-test-sign-in-SC-28.

## Reconciliation

Run: QA2, 2026-10-19. Read the blind cases above, this change's `spec.md` scenarios, `decisions.md` (Q1 to Q51) and the procedure. Nothing else. Case steps and expected results are unchanged.

**Covered in full** - SC-01 (TC1), SC-06 (TC10), SC-07 (TC18), SC-12 (TC6), SC-19 (TC8), SC-20 (TC9), SC-21 (TC11), SC-25 (TC23), SC-26, SC-27, SC-28 (TC24), SC-94 (TC3), SC-101 (TC21), SC-103 (TC22). SC-NN is shared-auth-test-sign-in-SC-NN.

**Not covered in full** - no case asserts the scenario: SC-02, SC-08, SC-09, SC-11, SC-13, SC-14, SC-15, SC-17, SC-18, SC-22, SC-23, SC-30, SC-31, SC-33, SC-34, SC-99. Partly asserted, see the case notes: SC-03, SC-04, SC-05, SC-32 (no nothing-changed check), SC-10, SC-16, SC-24, SC-29, SC-95, SC-96, SC-97, SC-98, SC-102. SC-100 is contradicted, below.

**Over-claimed** - TC5 (unique plus-tag per run), TC14 (non-tester row via the QA token), TC17 (wrong-token and customer-session rows). Each states behaviour no scenario states; fold into spec.md.

**Contradictions** - SC-100 says uat sets a scoped role for a named tester. The requirement "Grant a scoped role" and SC-96 refuse that, and Q42 settles it: never a named tester. TC12 already uses a plus-tag. Dev corrects SC-100.

**Repairs** - None. No case contradicts a settled decision.

**Raised** - None unsettled; `decisions.md` is unchanged. Q48 and Q51 cite TC30 and TC13, which this suite no longer holds.
