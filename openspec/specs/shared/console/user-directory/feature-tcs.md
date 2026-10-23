# shared/console/user-directory Test Cases

**Status:** pending-review · 0/14
**Drafts styled:** 2026-10-06, tcs-rules r4
**Out of suite (unit):** shared-console-user-directory-SC-30, shared-console-user-directory-SC-31, shared-console-user-directory-SC-32

## shared-console-user-directory-US1: Console renders auction standing on one account

**As a** console application,
**I want** to supply auction standing and moderation handlers to the account panel,
**so that** the panel can show the allowed move without owning the transition.

**Walked by:** nobody on their own - the admin Users panel composes this
package contract.

---

## shared-console-user-directory-US2: Operator reviews where an account is signed in

**As an** operator
**I want** to see and end an account's sessions without ever seeing what authenticates them
**so that** I can act on a compromised account without the console itself becoming the leak.

### shared-console-user-directory-US2-TC4-1: Account panel names sessions by identifier and shows no secret

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-console-user-directory-US-02

**Pre-conditions:**

* admin(holds user:list and session:list) is on `<grade10 admin users url>`.
* `<subject account>` is signed in on `<grade10 store url>` and on `<grade10 admin console url>`, with the second factor proved, so it holds one site session and one console session.

**Test data:**

| Field | Value |
| --- | --- |
| subject account | An account holding console access, other than the admin's |
| site session secret | The secret of `<subject account>`'s site session, read in the browser that holds it |
| console session secret | The secret of `<subject account>`'s console session, read in the browser that holds it |

| Field | Value |
| --- | --- |
| grade10 admin console url | The Grade10 admin console URL in the test environment; bind its URL only |
| grade10 admin users url | The Grade10 operator user-directory URL in the test environment; bind its URL only |
| grade10 store url | The Grade10 storefront URL in the test environment; bind its URL only |

**Steps:**

1. Open the account panel for `<subject account>` from its row.
2. Read each session entry in the panel's sessions area.
3. Search the panel's text and markup for `<site session secret>` and `<console session secret>`.

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-02

**Pre-conditions:**

* admin(holds user:list and session:list) is on `<grade10 admin users url>`.
* `<account with no sessions>` holds no session on any surface.

**Test data:**

| Field | Value |
| --- | --- |
| account with no sessions | An account holding console access, signed out of the site and the console, or whose every session an operator ended |

| Field | Value |
| --- | --- |
| grade10 admin users url | The Grade10 operator user-directory URL in the test environment; bind its URL only |

**Steps:**

1. Open the account panel for `<account with no sessions>` from its row.
2. Read the panel's sessions area.

**Expected Results:**

* Step 1 opens the panel.
* Step 2 says the account holds no sessions.
* Step 2 shows the control that ends every session as unavailable.

---

## shared-console-user-directory-US4: Operator reads one account beside the directory

**As an** operator,
**I want** an account's identity, the grants it holds, why its standing was
set, and where it is signed in to open together beside the list,
**so that** I judge the account from one reading instead of three
confirmations that never meet.

<!-- trace:case id=g10.shared-user-directory.TC-cvq rev=1 covers=g10.shared-user-directory.SC-xmw,g10.shared-user-directory.SC-4vh,g10.shared-user-directory.SC-2r3,g10.shared-user-directory.SC-mne,g10.shared-user-directory.SC-g8w,g10.shared-user-directory.SC-jnf,g10.shared-user-directory.SC-my2,g10.shared-user-directory.SC-58a,g10.shared-user-directory.SC-uwn,g10.shared-user-directory.SC-eo0,g10.shared-user-directory.SC-geg -->
### shared-console-user-directory-US4-TC1-1: Row opens the account panel whole

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-04

**Pre-conditions:**
Signed in as admin(holds `user:list`). Directory lists `<account with identity, grants, standing, and sessions>`.

**Test data:**

| Field | Value |
| --- | --- |
| account with identity, grants, standing, and sessions | The account seeded with identity, grants, standing and sessions for the directory read; bind its user id only |
| grade10 admin users url | The Grade10 operator user-directory URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to `<grade10 admin users url>`.
2. Open `<account with identity, grants, standing, and sessions>`.
3. Check the panel.

**Expected Results:**

* Panel shows who the account is, its actions, its grants, its timeline, and its sessions from what the console supplied.
* The directory list remains visible beside the panel.
* Role names in the list are not links.

<!-- trace:case id=g10.shared-user-directory.TC-3bz rev=1 covers=g10.shared-user-directory.SC-xmw,g10.shared-user-directory.SC-4vh,g10.shared-user-directory.SC-2r3,g10.shared-user-directory.SC-mne,g10.shared-user-directory.SC-g8w,g10.shared-user-directory.SC-jnf,g10.shared-user-directory.SC-my2,g10.shared-user-directory.SC-58a,g10.shared-user-directory.SC-uwn,g10.shared-user-directory.SC-eo0,g10.shared-user-directory.SC-geg -->
### shared-console-user-directory-US4-TC2-1: Session detail and ban reason show when supplied

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-04

**Pre-conditions:**
Signed in as admin(holds `user:list`). Directory lists `<banned account with reason>` that has a session with where it was raised and when it ends, and `<banned account without reason>`.

**Test data:**

| Field | Value |
| --- | --- |
| banned account with reason | A banned account with a supplied ban reason; bind its user id only |
| banned account without reason | A banned account with no supplied ban reason; bind its user id only |
| grade10 admin users url | The Grade10 operator user-directory URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to `<grade10 admin users url>`.
2. Open `<banned account with reason>` and check standing, timeline, and sessions.
3. Open `<banned account without reason>` and check standing and timeline.

**Expected Results:**

* First panel shows the ban reason, the joined milestone, the banned milestone without an invented time, and the session's origin and expiry as supplied.
* Second panel shows banned with no reason and the joined milestone.
* No authenticating secret is shown.

<!-- trace:case id=g10.shared-user-directory.TC-3vp rev=1 covers=g10.shared-user-directory.SC-xmw,g10.shared-user-directory.SC-4vh,g10.shared-user-directory.SC-2r3,g10.shared-user-directory.SC-mne,g10.shared-user-directory.SC-g8w,g10.shared-user-directory.SC-jnf,g10.shared-user-directory.SC-my2,g10.shared-user-directory.SC-58a,g10.shared-user-directory.SC-uwn,g10.shared-user-directory.SC-eo0,g10.shared-user-directory.SC-geg -->
### shared-console-user-directory-US4-TC3-1: Grant rows, elevated mark, and empty grants

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-04

**Pre-conditions:**
Signed in as admin(holds `user:list`). Directory lists `<account with elevated and plain grants>` and `<account with no grants>`.

**Test data:**

| Field | Value |
| --- | --- |
| account with elevated and plain grants | An account holding elevated and plain grants; bind its user id only |
| account with no grants | An account with no grants; bind its user id only |
| grade10 admin users url | The Grade10 operator user-directory URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to `<grade10 admin users url>`.
2. Open `<account with elevated and plain grants>`.
3. Check the grant labels.
4. Open `<account with no grants>`.

**Expected Results:**

* Step 2 shows each grant label; the elevated mark appears at most once for the account.
* Step 3: no grant label is a link.
* Step 4 says the account holds no grants.

---

## shared-console-user-directory-US5: Operator changes an account's access from the panel

**As an** operator,
**I want** to change roles where I read the account, and still be stopped for
a confirmation on a move I cannot undo,
**so that** an ordinary change costs one step and a ban never happens by
accident.

<!-- trace:case id=g10.shared-user-directory.TC-2qb rev=1 covers=g10.shared-user-directory.SC-pff,g10.shared-user-directory.SC-1iw,g10.shared-user-directory.SC-kmj,g10.shared-user-directory.SC-z5x -->
### shared-console-user-directory-US5-TC1-1: Withheld handlers hide sessions and moderation

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-05

**Pre-conditions:**
Console renders the directory without a sessions handler and without a moderation handler.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 admin users url | The Grade10 operator user-directory URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to `<grade10 admin users url>` under that console wiring.
2. Check each row's actions.

**Expected Results:**

* No row offers sessions.
* No row offers ban or unban.

<!-- trace:case id=g10.shared-user-directory.TC-ygh rev=1 covers=g10.shared-user-directory.SC-pff,g10.shared-user-directory.SC-1iw,g10.shared-user-directory.SC-kmj,g10.shared-user-directory.SC-z5x -->
### shared-console-user-directory-US5-TC2-1: Roles save from the panel; ban confirms outside it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-05

**Pre-conditions:**
Signed in as admin(holds `user:list` and `user:set-role` and `user:ban`). Directory lists `<another account>`.

**Test data:**

| Field | Value |
| --- | --- |
| another account | The other account in the directory, distinct from the signed-in admin; bind its user id only |
| grade10 admin users url | The Grade10 operator user-directory URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to `<grade10 admin users url>`.
2. Open `<another account>`.
3. Change the selected roles in the panel and save.
4. Start a ban from the panel.
5. Cancel the moderation dialog.

**Expected Results:**

* Step 3 submits roles in the order the options were offered.
* Step 4 opens the moderation dialog; the panel does not confirm the ban itself.
* Step 5 leaves the account unbanned.

---

## shared-console-user-directory-US6: Operator creates an account from the directory

**As an** operator,
**I want** a create dialog that collects name, email, and roles from my
console's vocabulary when the console supplies a create handler, reports the
created account on success, and reports the existing account through
`onOpenExisting` when the email is taken,
**so that** my console opens the account it created or the one already there
without the components deciding what comes next.

<!-- trace:case id=g10.shared-user-directory.TC-2uc rev=1 covers=g10.shared-user-directory.SC-3w0,g10.shared-user-directory.SC-uox,g10.shared-user-directory.SC-bm5,g10.shared-user-directory.SC-d4y,g10.shared-user-directory.SC-8ij,g10.shared-user-directory.SC-iqr,g10.shared-user-directory.SC-aan -->
### shared-console-user-directory-US6-TC1-1: Create appears only with a create handler

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-06

**Pre-conditions:**
Signed in as admin(console renders the directory without a create handler).

**Steps:**

1. Open the directory surface.
2. Check whether Create is offered.

**Expected Results:**

* Create is not offered.

<!-- trace:case id=g10.shared-user-directory.TC-al1 rev=1 covers=g10.shared-user-directory.SC-3w0,g10.shared-user-directory.SC-uox,g10.shared-user-directory.SC-bm5,g10.shared-user-directory.SC-d4y,g10.shared-user-directory.SC-8ij,g10.shared-user-directory.SC-iqr,g10.shared-user-directory.SC-aan -->
### shared-console-user-directory-US6-TC2-1: Create dialog collects console vocabulary and reports success

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-06

**Pre-conditions:**
Signed in as admin(console supplies a create handler and its role vocabulary). Create will succeed for `<new email>`.

**Test data:**

| Field | Value |
| --- | --- |
| new name | Dialog Person |
| new email | dialog.person@example.com |
| roles | a role from the console-supplied vocabulary |

**Steps:**

1. Open the directory surface.
2. Choose Create.
3. Enter `<new name>`, `<new email>`, and `<roles>`, and confirm.
4. Confirm the review.
5. Note what the create surface reports to the console.

**Expected Results:**

* Step 2 offers Create.
* Step 2's dialog offers only roles from the console-supplied vocabulary.
* Create stays disabled until name, email, and at least one role are present.
* Step 3 opens a confirmation of the draft and does not create.
* Step 4 succeeds.
* Step 5 reports the created account's identifier; the components decide nothing about what shows next.

<!-- trace:case id=g10.shared-user-directory.TC-aih rev=1 covers=g10.shared-user-directory.SC-3w0,g10.shared-user-directory.SC-uox,g10.shared-user-directory.SC-bm5,g10.shared-user-directory.SC-d4y,g10.shared-user-directory.SC-8ij,g10.shared-user-directory.SC-iqr,g10.shared-user-directory.SC-aan -->
### shared-console-user-directory-US6-TC3-1: Create dialog offers no password field

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-06

**Pre-conditions:**
Signed in as admin(console supplies a create handler).

**Steps:**

1. Open the directory surface.
2. Choose Create.
3. Read the create dialog fields.

**Expected Results:**

* The dialog collects name, email, and roles.
* The dialog offers no password field.

<!-- trace:case id=g10.shared-user-directory.TC-p29 rev=1 covers=g10.shared-user-directory.SC-3w0,g10.shared-user-directory.SC-uox,g10.shared-user-directory.SC-bm5,g10.shared-user-directory.SC-d4y,g10.shared-user-directory.SC-8ij,g10.shared-user-directory.SC-iqr,g10.shared-user-directory.SC-aan -->
### shared-console-user-directory-US6-TC4-1: Taken email refuses on the form before review

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-06

**Pre-conditions:**
Signed in as admin(console supplies a create handler and an email lookup). An account already holds `<taken email>`.

**Test data:**

| Field | Value |
| --- | --- |
| taken email | taken.dialog@example.com |

| Field | Value |
| --- | --- |
| existing account | The existing account whose email is `<taken email>`; bind its user id only |

**Steps:**

1. Open the directory surface.
2. Choose Create.
3. Enter a name, `<taken email>`, and a role from the console vocabulary, and confirm Create on the form.
4. Choose the open-existing action that steers them to change roles.
5. Note what the create surface reports to the console.

**Expected Results:**

* Step 3 stays on the create form, does not open the review, shows the duplicate refuse and open-existing, and does not call create.
* Step 5 reports `<existing account>`'s identifier through `onOpenExisting`; the components decide nothing about what shows next.

<!-- trace:case id=g10.shared-user-directory.TC-07a rev=1 covers=g10.shared-user-directory.SC-3w0,g10.shared-user-directory.SC-uox,g10.shared-user-directory.SC-bm5,g10.shared-user-directory.SC-d4y,g10.shared-user-directory.SC-8ij,g10.shared-user-directory.SC-iqr,g10.shared-user-directory.SC-aan -->
### shared-console-user-directory-US6-TC5-1: Create warns when the email is malformed or off the console list

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-06

**Pre-conditions:**
Signed in as admin(console supplies a create handler and a non-empty list of allowed email domains).

**Test data:**

| Field | Value |
| --- | --- |
| off-list email | someone@example.com |
| malformed email | not-an-email |

**Steps:**

1. Open the directory surface.
2. Choose Create.
3. Enter a name and `<off-list email>`, and confirm.
4. Read the warning and choose Back.
5. Confirm Create again, then confirm the warning.
6. Repeat from Create with `<malformed email>`, confirm Create, then confirm the warning.

**Expected Results:**

* Step 3 shows a confirmation with the email notes and does not create.
* Step 4 returns to the create form and creates nothing.
* Step 5 creates the account.
* Step 6 shows the malformed note, then creates after confirm.

<!-- trace:case id=g10.shared-user-directory.TC-ttp rev=1 covers=g10.shared-user-directory.SC-3w0,g10.shared-user-directory.SC-uox,g10.shared-user-directory.SC-bm5,g10.shared-user-directory.SC-d4y,g10.shared-user-directory.SC-8ij,g10.shared-user-directory.SC-iqr,g10.shared-user-directory.SC-aan -->
### shared-console-user-directory-US6-TC6-1: Create warns when a locked role is selected, and combines with an email check

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-06

**Pre-conditions:**
Signed in as admin(console supplies a create handler, a locked-role list, and a non-empty list of allowed email domains).

**Test data:**

| Field | Value |
| --- | --- |
| fine email | someone@9gag.com |
| off-list email | someone@example.com |
| locked role | a role on the consumer-supplied locked list |

**Steps:**

1. Open the directory surface.
2. Choose Create.
3. Enter a name, `<fine email>`, and `<locked role>`, and confirm.
4. Read the warning and choose Back.
5. Confirm Create again, then confirm the warning.
6. Repeat from Create with `<off-list email>` and `<locked role>`, and confirm.

**Expected Results:**

* Step 3 shows a confirmation with the locked-role note and does not create.
* The locked role label is in bold; the confirmation includes a note that the role cannot be removed once created; there is no email note.
* Step 4 returns to the create form and creates nothing.
* Step 5 creates the account.
* Step 6 shows email and locked-role notes on the same confirmation; the typed email and the locked role label are both in bold.

<!-- trace:case id=g10.shared-user-directory.TC-ce7 rev=1 covers=g10.shared-user-directory.SC-3w0,g10.shared-user-directory.SC-uox,g10.shared-user-directory.SC-bm5,g10.shared-user-directory.SC-d4y,g10.shared-user-directory.SC-8ij,g10.shared-user-directory.SC-iqr,g10.shared-user-directory.SC-aan -->
### shared-console-user-directory-US6-TC7-1: Create reviews a free well-formed on-list email with no locked role

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-06

**Pre-conditions:**
Signed in as admin(console supplies a create handler and a non-empty list of allowed email domains).

**Test data:**

| Field | Value |
| --- | --- |
| fine email | someone@9gag.com |
| roles | a role that is not on the consumer-supplied locked list |

**Steps:**

1. Open the directory surface.
2. Choose Create.
3. Enter a name, `<fine email>`, and `<roles>`, and confirm.
4. Confirm the review.

**Expected Results:**

* Step 3 shows a confirmation of the draft and does not create.
* The confirmation has no email note and no locked-role note.
* Step 4 creates the account.

## Settled

* The users desk renders the account panel's sessions area and does not mount `UserSessionsDialog`, which the console package ships (`ui-design.md`). The cases that open a view from a row in the desk are e2e on the panel; the dialog is walked at the unit layer, on the same assertions.
* Ending one session or every session is the sessions capability's: one session leaves the other surface signed in, every session and a ban end both, and ending the session in use signs the operator out. This surface reports the revocation by the session's identifier and shows the sessions the console supplies next.
* Where a session was raised and when it ends are shown as supplied. What authenticates a session is never supplied or shown, and an identifier is not it.
* The no-secret guarantee stops at what the components render and accept. What the console's own list carries is the sessions capability's.
* Which sessions the console lists, their order, whether an ended one lingers, who may end one, whether ending asks for a confirmation and what the dialog shows when an end fails are not decided here. They are the console's and the sessions capability's, and this change moves none of them.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| A partial handler set could expose an impossible move | **Raised, rejected:** both handlers are required so the consumer owns a complete standing transition |
| Panel confirmation could duplicate the consumer dialog | **Raised, folded into spec:** the account-panel confirmation requirement |
| Run | Read the shared feature set, the package journey, decisions, and the User Directory PRD; denied requirement deltas and archived changes |

**Run:** Blind pass read Purpose, Feature set, user-journeys.md, proposal.md, decisions.md (Raised included), linked Moves PRD section, and this suite for id continuity with Reconciliation stripped. Denied: every Requirements section, openspec/specs/ beyond Purpose and Feature set, openspec/changes/archive/.

**Raised, folded into spec**

- Create gated on handler, dialog vocabulary, success reports identifier, no password field — folded as a scenario through `scenario`.
- Taken email refuses on the form before review; open-existing via `onOpenExisting` — folded as a scenario.
- Review notes when the email is malformed or off the console-supplied list; Back returns to the form — folded as a scenario.
- Review notes when a locked role is selected; email and locked-role notes on one confirmation — folded as a scenario.
- Review opens when the email is free (or lookup skipped / fails open) — folded as a scenario.

**Uncovered anchors**

- a scenario — **Out of suite:** export contract; verified by package import / typecheck in the consuming repository.

**Run:** QA2, 2026-10-06, in a fresh context. QA1's blind pass ran in a separate context on the frozen anchor `shared-console-user-directory-US-02` and wrote ten cases and nine questions. It was denied every `## Requirements` section; the rest of its bundle is the caller's statement and not this line's, and its questions cite the User Directory page's Allowance and the durable case `US5-TC1-1` and no scenario. QA2 read QA1's draft, `user-journeys.md`, the delta `spec.md`, the durable spec and suite, the User Directory page, `proposal.md`, `decisions.md`, `ui-design.md`, `tech-design.md`, `tasks.md`, the sessions delta and its suite, and this change's `domain-tcs.md`. This is a statement, not proof. No case of this change has been accepted or published, so a draft keeps its `<v>` when it is reworded.

- **Agreed** - QA1's TC6 with `shared-console-user-directory-SC-07`, as `shared-console-user-directory-US2-TC4-1` on the panel and `shared-console-user-directory-US2-TC8-1` on the dialog; QA1's TC7 with `shared-console-user-directory-SC-08`, as `shared-console-user-directory-US2-TC5-1` and `shared-console-user-directory-US2-TC9-1`
- **Adjusted, by QA2** - `US2-TC4-1` searches for the two real secrets as test data where QA1 searched for a token and a cookie value; `US2-TC5-1` reads the sessions area only
- **Adjusted, by QA2 (review), the desk renders the panel** - `US2-TC4-1` and `US2-TC5-1` opened a sessions dialog from a row, which the grade10 users desk does not render: it mounts the sessions area of `UserAccountPanel` and ships `UserSessionsDialog` unmounted (`ui-design.md`). They are reworded to the panel's sessions area, opened from the row. Each dialog assertion is kept as a new unit draft with no blind reading beside it: `US2-TC8-1` for the identifier and no secret, and `US2-TC9-1` for the empty dialog. `shared-console-user-directory-SC-07` and `shared-console-user-directory-SC-08` named the dialog alone, so no case on the panel could walk them: they now read the dialog or the account panel, as the requirement already does ("`UserSessionsDialog` and `UserAccountPanel` alike"), their ids, titles and markers as they were
- **Adjusted, by QA2, the hand draft corrected** - the hand draft left `shared-console-user-directory-SC-07`, `shared-console-user-directory-SC-08` and `shared-console-user-directory-SC-16` to the durable cases while noting the durable suite holds none under `shared-console-user-directory-US-02`. It is the second that holds: no durable case traces `shared-console-user-directory-SC-07` or `shared-console-user-directory-SC-08`, and `pnpm run tcs:validate` reports the journey with no section there. This suite writes them, as `US2-TC4-1` and `US2-TC5-1`. `shared-console-user-directory-SC-16` serves `shared-console-user-directory-US-04`, whose durable `US4-TC1-1` and `US4-TC2-1` carry it
- **Withdrawn, 2026-10-12** - the surface cases `US2-TC1-1`, `US2-TC2-1`, `US2-TC3-1`, `US2-TC6-1` and `US2-TC7-1`, and the scenarios they traced, `shared-console-user-directory-SC-40`, `shared-console-user-directory-SC-41` and `shared-console-user-directory-SC-42`: the console shows no surface beside a session, because the sessions dialog and the account panel that would carry it no longer exist after the console redesign. The operator list still returns each session's surface (`shared-auth-sessions-SC-10`)
- **Raised, rejected** - QA1's TC3, which asserts that the sessions action lists the chosen account's sessions only: which account's sessions arrive is the console's to supply and `shared/auth/sessions` states it (`shared-auth-sessions-SC-01`); the components render what they are given. QA1's TC5, two sessions with one origin and surface ended separately: it tests how a session is identified, which this change leaves word for word. QA1's TC9, a session missing its origin or its expiry: the change moves no origin or expiry rule. QA1's TC10, a session that fails to end stays listed and the failure is reported: nothing states what the dialog shows on a failed end, and the components report a revocation and decide nothing about what follows; it is the console's and the sessions capability's, and this change touches no ending flow. The panel halves of QA1's TC7 and TC2: the panel's empty sessions area and the place of the sessions area are unchanged behaviour, left to `US4-TC1-1` below
- **Raised, settled by the artifacts** - QA1's questions on what an end reaches (one session, every session): the sessions capability and decision Q9 state one session leaves the other surface and every session and a ban end both. What "where a session was raised" is and what counts as "what authenticates it": the requirement has the consumer supply where it was raised already in words, and the secret is what authenticates a session, never the identifier. Whether the no-secret guarantee reaches what the console receives: the Purpose and the Allowance limit this capability to what the components render and the contract they expose, and `shared-auth-sessions-SC-01` holds the list. Each is in `## Settled`; none goes to `decisions.md`
- **Raised, rejected** - QA1's questions on whether ending is confirmed or cancelled and whether an operator may end the session in use; on whether an ended or expired session is listed, in what order and up to what number; on how the panel treats an account with no sessions; on whether ending is gated by a handler apart from listing; and on ending a session that has already ended. This change alters no ending flow, handler, grant, expiry or order, so none of these is its to settle. The one the artifacts do answer is the session in use: ending it signs the operator out (`shared-auth-sessions-SC-08`). The rest are existing behaviour no artifact decides, and none is a row for `decisions.md`; they are named in `## Settled` as the console's and the sessions capability's
- **Raised, escalated** - none
- **Left to the durable cases** - `shared-console-user-directory-SC-16`, for the panel: `US4-TC1-1` and `US4-TC2-1` assert where a session was raised and when it ends as supplied, and the list staying beside the panel, which are QA1's TC1 and TC2 results on those details.
- **Contradicted** - none
- **Uncovered anchors** - none: `shared-console-user-directory-US-02` has `US2-TC4-1`, `US2-TC5-1`, `US2-TC8-1` and `US2-TC9-1`; every scenario serving it is reached, the panel by an e2e case and the dialog by a unit case: `shared-console-user-directory-SC-07` by `US2-TC4-1` and `US2-TC8-1`, and `shared-console-user-directory-SC-08` by `US2-TC5-1` and `US2-TC9-1`
- **Trace markers** - the new scenarios and cases carry none yet; the trace CLI allocates them with the walk
