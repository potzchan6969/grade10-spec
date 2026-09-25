# shared/console/user-directory Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-11, tcs-rules r3.0

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
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-04

**Pre-conditions:**
Signed in as admin(holds `user:list`). Directory lists <account with identity, grants, standing, and sessions>.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Open <account with identity, grants, standing, and sessions>.
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
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-04

**Pre-conditions:**
Signed in as admin(holds `user:list`). Directory lists <banned account with reason> that has a session with where it was raised and when it ends, and <banned account without reason>.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Open <banned account with reason> and check standing, timeline, and sessions.
3. Open <banned account without reason> and check standing and timeline.

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
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-04

**Pre-conditions:**
Signed in as admin(holds `user:list`). Directory lists <account with elevated and plain grants> and <account with no grants>.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Open <account with elevated and plain grants>.
3. Check the grant labels.
4. Open <account with no grants>.

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
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-05

**Pre-conditions:**
Console renders the directory without a sessions handler and without a moderation handler.

**Steps:**

1. Navigate to <grade10 admin users url> under that console wiring.
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
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-05

**Pre-conditions:**
Signed in as admin(holds `user:list` and `user:set-role` and `user:ban`). Directory lists <another account>.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Open <another account>.
3. Change the selected roles in the panel and save.
4. Start a ban from the panel.
5. Cancel the moderation dialog.

**Expected Results:**

* Step 3 submits roles in the order the options were offered.
* Step 4 opens the moderation dialog; the panel does not confirm the ban itself.
* Step 5 leaves the account unbanned.

---

## shared-console-user-directory-US1: Console renders auction standing on one account

**As a** console application,
**I want** to supply auction standing and moderation handlers to the account panel,
**so that** the panel can show the allowed move without owning the transition.

**Walked by:** nobody on their own - the admin Users panel composes this
package contract.

<!-- trace:case id=g10.shared-user-directory.TC-6g5 rev=1 covers=g10.shared-user-directory.SC-icf,g10.shared-user-directory.SC-x0r,g10.shared-user-directory.SC-mzm -->
### shared-console-user-directory-US1-TC1-1: A consumer with both handlers gets one auction-standing move

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** One account open

**Pre-conditions:**

* customer is rendering `UserAccountPanel` with the supplied auction standing and handlers.

**Steps:**

1. Render an account panel with suspend and reinstate handlers.
2. Render one account that is not suspended and one that is suspended.

**Expected Results:**

* The first panel offers suspend only.
* The second panel offers reinstate only.

<!-- trace:case id=g10.shared-user-directory.TC-ka4 rev=1 covers=g10.shared-user-directory.SC-icf,g10.shared-user-directory.SC-x0r,g10.shared-user-directory.SC-mzm -->
### shared-console-user-directory-US1-TC2-1: A consumer missing a handler gets no auction-standing move

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
* **Trace:** One account open

**Pre-conditions:**

* customer is rendering `UserAccountPanel` with only one auction-standing handler.

**Steps:**

1. Render a panel with only one auction-standing handler.

**Expected Results:**

* The panel offers neither suspend nor reinstate.

<!-- trace:case id=g10.shared-user-directory.TC-pw0 rev=1 covers=g10.shared-user-directory.SC-icf,g10.shared-user-directory.SC-x0r,g10.shared-user-directory.SC-mzm -->
### shared-console-user-directory-US1-TC3-1: The panel delegates confirmation to the consumer dialog

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
* **Trace:** One account open

**Pre-conditions:**

* customer is rendering `UserAccountPanel` with a suspend handler and `UserModerationDialog` supplied by the consumer.

**Steps:**

1. Start suspend from an eligible panel.
2. Confirm it in the consumer's moderation dialog.

**Expected Results:**

* The panel reports the requested move without confirming it.
* The dialog receives the confirmation and its required reason.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| A partial handler set could expose an impossible move | **Raised, rejected:** both handlers are required so the consumer owns a complete standing transition |
| Panel confirmation could duplicate the consumer dialog | **Raised, folded into spec:** the account-panel confirmation requirement |
| Run | Read the shared feature set, the package journey, decisions, and the User Directory PRD; denied requirement deltas and archived changes |
