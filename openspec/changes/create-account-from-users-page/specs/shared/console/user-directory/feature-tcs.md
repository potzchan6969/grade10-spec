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
4. Note what the create surface reports to the console.

**Expected Results:**

* Step 2 offers Create.
* Step 2's dialog offers only roles from the console-supplied vocabulary.
* Step 3 succeeds.
* Step 4 reports the created account's identifier; the components decide nothing about what shows next.

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
4. Choose the open-existing action.
5. Note what the create surface reports to the console.

**Expected Results:**

* Step 3 is refused with a clear message and an open-existing action.
* Step 5 reports <existing account>'s identifier through `onOpenExisting`; the components decide nothing about what shows next.

## Settled

## Reconciliation

**Run:** Blind pass read Purpose, Feature set, user-journeys.md, proposal.md, decisions.md (Raised included), linked Moves PRD section, and this suite for id continuity with Reconciliation stripped. Denied: every Requirements section, openspec/specs/ beyond Purpose and Feature set, openspec/changes/archive/.

**Raised, folded into spec**

- Create gated on handler, dialog vocabulary, success reports identifier, no password field — folded as `shared-console-user-directory-SC-33` through `SC-35`.
- Duplicate open-existing via `onOpenExisting` — folded as `shared-console-user-directory-SC-36` (ui-design contract alignment).

**Uncovered anchors**

- `shared-console-user-directory-SC-01` — **Out of suite:** export contract; verified by package import / typecheck in the consuming repository.
