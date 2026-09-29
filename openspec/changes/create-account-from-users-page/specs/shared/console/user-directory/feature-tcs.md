# shared/console/user-directory Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-24, tcs-rules r3.0

## shared-console-user-directory-US6: Operator creates an account from the directory

**As an** operator,
**I want** a create dialog that collects name, email, and roles from my
console's vocabulary when the console supplies a create handler, reports the
created account on success, and reports the existing account through
`onOpenExisting` when the email is taken,
**so that** my console opens the account it created or the one already there
without the components deciding what comes next.

### shared-console-user-directory-US6-TC1-1: Create appears only with a create handler

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
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

### shared-console-user-directory-US6-TC2-1: Create dialog collects console vocabulary and reports success

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-06

**Pre-conditions:**
Signed in as admin(console supplies a create handler and its role vocabulary). Create will succeed for <new email>.

**Test data:**

| Field | Value |
| --- | --- |
| <new name> | Dialog Person |
| <new email> | dialog.person@example.com |
| <roles> | a role from the console-supplied vocabulary |

**Steps:**

1. Open the directory surface.
2. Choose Create.
3. Enter <new name>, <new email>, and <roles>, and confirm.
4. Confirm the review.
5. Note what the create surface reports to the console.

**Expected Results:**

* Step 2 offers Create.
* Step 2's dialog offers only roles from the console-supplied vocabulary.
* Create stays disabled until name, email, and at least one role are present.
* Step 3 opens a confirmation of the draft and does not create.
* Step 4 succeeds.
* Step 5 reports the created account's identifier; the components decide nothing about what shows next.

### shared-console-user-directory-US6-TC3-1: Create dialog offers no password field

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
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

### shared-console-user-directory-US6-TC4-1: Duplicate open-existing reports the existing account

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-06

**Pre-conditions:**
Signed in as admin(console supplies a create handler). Create will be refused because <taken email> already exists on <existing account>, and the consumer can supply that account's identifier.

**Test data:**

| Field | Value |
| --- | --- |
| <taken email> | taken.dialog@example.com |

**Steps:**

1. Open the directory surface.
2. Choose Create.
3. Enter a name, <taken email>, and a role from the console vocabulary, and confirm.
4. Confirm the review.
5. Choose the open-existing action.
6. Note what the create surface reports to the console.

**Expected Results:**

* Step 3 opens a confirmation of the draft and does not create.
* Step 4 is refused with a clear message and an open-existing action.
* Step 6 reports <existing account>'s identifier through `onOpenExisting`; the components decide nothing about what shows next.

### shared-console-user-directory-US6-TC5-1: Create warns when the email is malformed or off the console list

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-06

**Pre-conditions:**
Signed in as admin(console supplies a create handler and a non-empty list of allowed email domains).

**Test data:**

| Field | Value |
| --- | --- |
| <off-list email> | someone@example.com |
| <malformed email> | not-an-email |

**Steps:**

1. Open the directory surface.
2. Choose Create.
3. Enter a name and <off-list email>, and confirm.
4. Read the warning and go back.
5. Confirm Create again, then confirm the warning.
6. Repeat from Create with <malformed email>, confirm Create, then confirm the warning.

**Expected Results:**

* Step 3 shows a confirmation with the email notes and does not create.
* Step 4 returns to the create form and creates nothing.
* Step 5 creates the account.
* Step 6 shows the malformed note, then creates after confirm.

### shared-console-user-directory-US6-TC6-1: Create warns when a locked role is selected, and combines with an email check

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-06

**Pre-conditions:**
Signed in as admin(console supplies a create handler, a locked-role list, and a non-empty list of allowed email domains).

**Test data:**

| Field | Value |
| --- | --- |
| <fine email> | someone@9gag.com |
| <off-list email> | someone@example.com |
| <locked role> | a role on the consumer-supplied locked list |

**Steps:**

1. Open the directory surface.
2. Choose Create.
3. Enter a name, <fine email>, and <locked role>, and confirm.
4. Read the warning and go back.
5. Confirm Create again, then confirm the warning.
6. Repeat from Create with <off-list email> and <locked role>, and confirm.

**Expected Results:**

* Step 3 shows a confirmation with the locked-role note and does not create.
* The locked role label is in bold; the confirmation includes a note that the role cannot be removed once created; there is no email note.
* Step 4 returns to the create form and creates nothing.
* Step 5 creates the account.
* Step 6 shows email and locked-role notes on the same confirmation; the typed email and the locked role label are both in bold.

### shared-console-user-directory-US6-TC7-1: Create still reviews a well-formed on-list email with no locked role

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-06

**Pre-conditions:**
Signed in as admin(console supplies a create handler and a non-empty list of allowed email domains).

**Test data:**

| Field | Value |
| --- | --- |
| <fine email> | someone@9gag.com |
| <roles> | a role that is not on the consumer-supplied locked list |

**Steps:**

1. Open the directory surface.
2. Choose Create.
3. Enter a name, <fine email>, and <roles>, and confirm.
4. Confirm the review.

**Expected Results:**

* Step 3 shows a confirmation of the draft and does not create.
* The confirmation has no email note and no locked-role note.
* Step 4 creates the account.

## Settled

## Reconciliation

**Run:** Blind pass read Purpose, Feature set, user-journeys.md, proposal.md, decisions.md (Raised included), linked Moves PRD section, and this suite for id continuity with Reconciliation stripped. Denied: every Requirements section, openspec/specs/ beyond Purpose and Feature set, openspec/changes/archive/.

**Raised, folded into spec**

- Create gated on handler, dialog vocabulary, success reports identifier, no password field — folded as `shared-console-user-directory-SC-33` through `SC-35`.
- Duplicate open-existing via `onOpenExisting` — folded as `shared-console-user-directory-SC-36` (ui-design contract alignment).
- Review notes when the email is malformed or off the console-supplied list — folded as `shared-console-user-directory-SC-37`.
- Review notes when a locked role is selected; email and locked-role notes on one confirmation — folded as `shared-console-user-directory-SC-38`.
- Review still opens for a well-formed on-list email with no locked role — folded as `shared-console-user-directory-SC-39`.

**Uncovered anchors**

- `shared-console-user-directory-SC-01` — **Out of suite:** export contract; verified by package import / typecheck in the consuming repository.
