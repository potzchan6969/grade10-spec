# shared/console/user-directory Test Cases

**Status:** pending-review · 0/9
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-console-user-directory-US2: Operator reviews where an account is signed in

**As an** operator
**I want** to see and end an account's sessions without ever seeing what authenticates them
**so that** I can act on a compromised account without the console itself becoming the leak.

### shared-console-user-directory-US2-TC1-1: Account panel names each session's surface

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
* **Trace:** shared-console-user-directory-US-02

**Pre-conditions:**

* admin(holds user:list and session:list) is on <grade10 admin users url>.
* <subject account> is signed in on <grade10 store url> and on <grade10 admin console url>, with the second factor proved, so it holds one site session and one console session.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | An account holding console access, other than the admin's |

**Steps:**

1. Open the account panel for <subject account> from its row.
2. Read the sessions in the panel's sessions area.

**Expected Results:**

* Step 2 lists two sessions, one naming the site as its surface and one naming the console.

### shared-console-user-directory-US2-TC2-1: Ending one session in the panel leaves the other's surface listed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-02

**Pre-conditions:**

* admin(holds user:list, session:list and session:revoke) is on <grade10 admin users url>.
* <subject account> is signed in on <grade10 store url> and on <grade10 admin console url>, with the second factor proved, so it holds one site session and one console session.

**Test data:**

| <session to end> | <session that remains> |
| --- | --- |
| The session naming the site | The session naming the console |
| The session naming the console | The session naming the site |

**Steps:**

1. Open the account panel for <subject account> from its row.
2. End <session to end> from its entry in the panel's sessions area.
3. Read the sessions in the panel.

**Expected Results:**

* Step 3 no longer lists <session to end>.
* Step 3 lists only <session that remains>, still naming its own surface.

### shared-console-user-directory-US2-TC3-1: A session the console gave no surface shows none

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
* **Trace:** shared-console-user-directory-US-02

**Pre-conditions:**

* The console supplies <session with a surface> and <session without a surface> for one account.

**Test data:**

| Field | Value |
| --- | --- |
| `<session with a surface>` | A session supplied with the console as its surface, where it was raised and when it ends |
| `<session without a surface>` | A session supplied with where it was raised and when it ends, and no surface |

**Steps:**

1. Render the sessions dialog with both sessions.
2. Read each entry in the dialog.
3. Render the account panel with both sessions.
4. Read each entry in the panel.

**Expected Results:**

* Steps 2 and 4 show <session with a surface> naming the console.
* Steps 2 and 4 show <session without a surface> with where it was raised and when it ends, as supplied.
* Steps 2 and 4 show <session without a surface> naming neither the site nor the console.

### shared-console-user-directory-US2-TC4-1: Account panel names sessions by identifier and shows no secret

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-console-user-directory-US-02

**Pre-conditions:**

* admin(holds user:list and session:list) is on <grade10 admin users url>.
* <subject account> is signed in on <grade10 store url> and on <grade10 admin console url>, with the second factor proved, so it holds one site session and one console session.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | An account holding console access, other than the admin's |
| `<site session secret>` | The secret of <subject account>'s site session, read in the browser that holds it |
| `<console session secret>` | The secret of <subject account>'s console session, read in the browser that holds it |

**Steps:**

1. Open the account panel for <subject account> from its row.
2. Read each session entry in the panel's sessions area.
3. Search the panel's text and markup for <site session secret> and <console session secret>.

**Expected Results:**

* Step 2 shows each session with its identifier, the two identifiers differing.
* Step 3 finds neither secret.

### shared-console-user-directory-US2-TC5-1: Panel says an account has no sessions and offers nothing to end

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-02

**Pre-conditions:**

* admin(holds user:list and session:list) is on <grade10 admin users url>.
* <account with no sessions> holds no session on any surface.

**Test data:**

| Field | Value |
| --- | --- |
| `<account with no sessions>` | An account holding console access, signed out of the site and the console, or whose every session an operator ended |

**Steps:**

1. Open the account panel for <account with no sessions> from its row.
2. Read the panel's sessions area.

**Expected Results:**

* Step 1 opens the panel.
* Step 2 says the account holds no sessions.
* Step 2 shows the control that ends every session as unavailable.

### shared-console-user-directory-US2-TC6-1: Sessions dialog names each session's surface

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
* **Trace:** shared-console-user-directory-US-02

**Pre-conditions:**

* The console supplies <site session> and <console session> for one account.

**Test data:**

| Field | Value |
| --- | --- |
| `<site session>` | A session supplied with the site as its surface |
| `<console session>` | A session supplied with the console as its surface |

**Steps:**

1. Render the sessions dialog with both sessions.
2. Read each entry in the dialog.

**Expected Results:**

* Step 2 shows <site session> naming the site.
* Step 2 shows <console session> naming the console.

### shared-console-user-directory-US2-TC7-1: Ending a session in the dialog leaves the other's surface listed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-console-user-directory-US-02

**Pre-conditions:**

* The console supplies a site session and a console session for one account, and the sessions dialog is rendered with both.

**Test data:**

| <session to end> | <session that remains> |
| --- | --- |
| The session naming the site | The session naming the console |
| The session naming the console | The session naming the site |

**Steps:**

1. End <session to end> from its entry in the dialog.
2. Read what the dialog reports.
3. Render the dialog again with <session that remains> only, as the console would supply it after the end.
4. Read the entry in the dialog.

**Expected Results:**

* Step 2 reports <session to end> by its own identifier.
* Step 4 shows <session that remains> still naming its own surface.

### shared-console-user-directory-US2-TC8-1: Sessions dialog names sessions by identifier and shows no secret

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-console-user-directory-US-02

**Pre-conditions:**

* The console holds a secret for each of two sessions and supplies only their identifiers.

**Test data:**

| Field | Value |
| --- | --- |
| `<first session secret>` | A secret the console holds for the first session and does not supply |
| `<second session secret>` | A secret the console holds for the second session and does not supply |

**Steps:**

1. Render the sessions dialog with the two sessions.
2. Read each session entry in the dialog.
3. Search the dialog's text and markup for <first session secret> and <second session secret>.

**Expected Results:**

* Step 2 shows each session with its identifier, the two identifiers differing.
* Step 3 finds neither secret.

### shared-console-user-directory-US2-TC9-1: Dialog says an account has no sessions and offers nothing to end

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-console-user-directory-US-02

**Pre-conditions:**

* The console supplies no session for <account with no sessions>.

**Test data:**

| Field | Value |
| --- | --- |
| `<account with no sessions>` | An account the console supplies no session for |

**Steps:**

1. Render the sessions dialog for <account with no sessions>.
2. Read the dialog.

**Expected Results:**

* Step 2 says the account holds no sessions.
* Step 2 shows the control that ends every session as unavailable.

---

## Settled

* Both session views show the surface: the sessions dialog and the account panel render the same session row, so a surface the console supplies shows in each.
* The users desk renders the account panel's sessions area and does not mount `UserSessionsDialog`, which the console package ships (`ui-design.md`, `tasks.md` 5.5). The cases that open a view from a row in the desk are e2e on the panel; the dialog is walked at the unit layer, on the same assertions.
* A session supplied no surface shows none in either view. The console supplies a surface for every session it lists and reads a session made before release as the site's, so the omission is the components' rule and not a state an operator meets.
* A session names its surface in the console's own words, the site's or the console's; the components show what the console supplied and add nothing.
* Ending one session or every session is the sessions capability's: one session leaves the other surface signed in, every session and a ban end both, and ending the session in use signs the operator out. This surface reports the revocation by the session's identifier and shows the sessions the console supplies next.
* Where a session was raised, when it ends and which surface it belongs to are shown as supplied. What authenticates a session is never supplied or shown, and an identifier is not it.
* The no-secret guarantee stops at what the components render and accept. What the console's own list carries is the sessions capability's.
* Which sessions the console lists, their order, whether an ended one lingers, who may end one, whether ending asks for a confirmation and what the dialog shows when an end fails are not decided here. They are the console's and the sessions capability's, and this change moves none of them.

## Reconciliation

**Run:** QA2, 2026-10-06, in a fresh context. QA1's blind pass ran in a separate context on the frozen anchor `shared-console-user-directory-US-02` and wrote ten cases and nine questions. It was denied every `## Requirements` section; the rest of its bundle is the caller's statement and not this line's, and its questions cite the User Directory page's Allowance and the durable case `US5-TC1-1` and no scenario. QA2 read QA1's draft, `user-journeys.md`, the delta `spec.md`, the durable spec and suite, the User Directory page, `proposal.md`, `decisions.md`, `ui-design.md`, `tech-design.md`, `tasks.md`, the sessions delta and its suite, and this change's `domain-tcs.md`. The one case this file held before, `US2-TC1-1`, was drafted by hand beside `shared-console-user-directory-SC-40` when decision Q10 reached this capability; it was not blind and it is rewritten below, not kept. This is a statement, not proof. No case of this change has been accepted or published, so a draft keeps its `<v>` when it is reworded.

- **Agreed** - QA1's TC1 and TC2 with `shared-console-user-directory-SC-40`: the dialog and the account panel each name the surface of each session, and the two read as different surfaces, as `shared-console-user-directory-US2-TC1-1` on the panel and `shared-console-user-directory-US2-TC6-1` on the dialog; QA1's TC4 with `shared-console-user-directory-SC-41`, as `shared-console-user-directory-US2-TC2-1` and `shared-console-user-directory-US2-TC7-1`; QA1's TC6 with `shared-console-user-directory-SC-07`, as `shared-console-user-directory-US2-TC4-1` and `shared-console-user-directory-US2-TC8-1`; QA1's TC7 with `shared-console-user-directory-SC-08`, as `shared-console-user-directory-US2-TC5-1` and `shared-console-user-directory-US2-TC9-1`; QA1's TC8 with `shared-console-user-directory-SC-42`, as `shared-console-user-directory-US2-TC3-1`
- **Adjusted, by QA2** - `US2-TC1-1` joins QA1's TC1 and TC2, which walked one starting state and one route in two cases, and drops their origin and expiry results to the durable cases below; `US2-TC2-1` runs once per row for the site's session and the console's, where QA1 fixed one, and reads the surface of the session that remains rather than its origin and expiry, since `shared-console-user-directory-SC-41` states the surface; `US2-TC3-1` sits at the `unit` layer and plans `automation`, since the console always supplies a surface and only a consumer that supplies none produces the state, and its other session carries a surface, so a label copied or defaulted onto the session without one shows; `US2-TC4-1` searches for the two real secrets as test data where QA1 searched for a token and a cookie value; `US2-TC5-1` reads the sessions area only; the smoke suite stays on `US2-TC1-1`, a journey holding at most one, where QA1 put it on two
- **Adjusted, by QA2 (review), the desk renders the panel** - `US2-TC1-1`, `US2-TC2-1`, `US2-TC4-1` and `US2-TC5-1` opened a sessions dialog from a row, which the grade10 users desk does not render: it mounts the sessions area of `UserAccountPanel` and ships `UserSessionsDialog` unmounted (`ui-design.md`, `tasks.md` 5.5). They are reworded to the panel's sessions area, opened from the row, and `US2-TC1-1` drops its dialog steps; `US2-TC2-1` reads the remaining session in the panel alone. Each dialog assertion is kept as a new unit draft with no blind reading beside it, on the same fixtures as `US2-TC3-1`: `US2-TC6-1` for the surface, `US2-TC7-1` for ending one session and the other's surface, `US2-TC8-1` for the identifier and no secret, and `US2-TC9-1` for the empty dialog. `shared-console-user-directory-SC-07`, `shared-console-user-directory-SC-08` and `shared-console-user-directory-SC-41` named the dialog alone, so no case on the panel could walk them: they now read the dialog or the account panel, as the requirement already does ("`UserSessionsDialog` and `UserAccountPanel` alike"), their ids, titles and markers as they were. `shared-console-user-directory-SC-40` and `shared-console-user-directory-SC-42` name each view and are as they were; neither requires the desk to mount the dialog
- **Adjusted, by QA2, the hand draft corrected** - the hand draft left `shared-console-user-directory-SC-07`, `shared-console-user-directory-SC-08` and `shared-console-user-directory-SC-16` to the durable cases while noting the durable suite holds none under `shared-console-user-directory-US-02`. It is the second that holds: no durable case traces `shared-console-user-directory-SC-07` or `shared-console-user-directory-SC-08`, and `pnpm run tcs:validate` reports the journey with no section there. This suite writes them, as `US2-TC4-1` and `US2-TC5-1`. `shared-console-user-directory-SC-16` serves `shared-console-user-directory-US-04`, whose durable `US4-TC1-1` and `US4-TC2-1` carry it
- **Raised, folded into spec** - two scenarios added to the delta, each asserting what the requirement already states and no scenario did: `shared-console-user-directory-SC-41` for QA1's TC4 and the requirement's "a revocation SHALL be reported by that same identifier", with the surface of the session that remains; `shared-console-user-directory-SC-42` for QA1's TC8 and the requirement's "each rendered when supplied and omitted when not", read for the new surface, with a second session that does supply one. `tasks.md` 5.1 and 5.5 name both
- **Raised, rejected** - QA1's TC3, which asserts that the sessions action lists the chosen account's sessions only: which account's sessions arrive is the console's to supply and `shared/auth/sessions` states it (`shared-auth-sessions-SC-01`); the components render what they are given. QA1's TC5, two sessions with one origin and surface ended separately: it tests how a session is identified, which this change leaves word for word, and the surface joins no identity; ending by identifier is reached by `US2-TC2-1`. QA1's TC9, a session missing its origin or its expiry: the change moves no origin or expiry rule, and the new detail's own omission is `US2-TC3-1`. QA1's TC10, a session that fails to end stays listed and the failure is reported: nothing states what the dialog shows on a failed end, and the components report a revocation and decide nothing about what follows; it is the console's and the sessions capability's, and this change touches no ending flow. The panel halves of QA1's TC7 and TC2 beyond the surface: the panel's empty sessions area and the place of the sessions area are unchanged behaviour, left to `US4-TC1-1` below
- **Raised, settled by the artifacts** - QA1's questions on what an end reaches (one session, every session, and whether the surface scopes it): the sessions capability and decision Q9 state one session leaves the other surface and every session and a ban end both. What "where a session was raised" is and what counts as "what authenticates it": the requirement has the consumer supply where it was raised already in words, and the secret is what authenticates a session, never the identifier. Whether the no-secret guarantee reaches what the console receives: the Purpose and the Allowance limit this capability to what the components render and the contract they expose, and `shared-auth-sessions-SC-01` holds the list. Whether the surface is only the site's or the console's, whose words mark it, and whether one account may mix sessions with and without one: `tech-design.md` D1 names the two surfaces, the requirement and `ui-design.md` give the words to the console, and each session is rendered on what it was supplied. Each is in `## Settled`; none goes to `decisions.md`
- **Raised, rejected** - QA1's questions on whether ending is confirmed or cancelled and whether an operator may end the session in use; on whether an ended or expired session is listed, in what order and up to what number; on how the panel treats an account with no sessions; on whether ending is gated by a handler apart from listing; and on ending a session that has already ended. This change adds a surface label to a session row and alters no ending flow, handler, grant, expiry or order, so none of these is its to settle. The one the artifacts do answer is the session in use: ending it signs the operator out (`shared-auth-sessions-SC-08`). The rest are existing behaviour no artifact decides, and none is a row for `decisions.md`; they are named in `## Settled` as the console's and the sessions capability's
- **Raised, escalated** - none
- **Left to the durable cases** - `shared-console-user-directory-SC-16`, for the panel: `US4-TC1-1` and `US4-TC2-1` assert where a session was raised and when it ends as supplied, and the list staying beside the panel, which are QA1's TC1 and TC2 results on those details. The last line of `shared-console-user-directory-SC-16` read that a session supplied with neither shows its identifier alone, which no longer held once a session may carry a surface; it now reads that such a session shows no place and no end time, only its identifier and whatever else it was supplied, such as its surface. Neither durable case asserts it, which is an existing gap outside this change, and `US2-TC3-1` reaches the surface half
- **Not covered at domain** - `shared-auth-e2e-US8-TC1-1` step 4 lists one site session and one console session, each naming its surface, but in no named view, and asserts nothing of the dialog and the panel each; `shared-console-user-directory-SC-40` is not left to it
- **Contradicted** - none
- **Uncovered anchors** - none: `shared-console-user-directory-US-02` has `US2-TC1-1` to `US2-TC9-1`; every scenario serving it is reached, the panel by an e2e case and the dialog by a unit case: `shared-console-user-directory-SC-07` by `US2-TC4-1` and `US2-TC8-1`, `shared-console-user-directory-SC-08` by `US2-TC5-1` and `US2-TC9-1`, `shared-console-user-directory-SC-40` by `US2-TC1-1` and `US2-TC6-1`, `shared-console-user-directory-SC-41` by `US2-TC2-1` and `US2-TC7-1`, and `shared-console-user-directory-SC-42` by `US2-TC3-1`
- **Trace markers** - the new scenarios and cases carry none yet; the trace CLI allocates them with the walk
