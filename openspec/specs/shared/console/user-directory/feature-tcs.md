# shared/console/user-directory Test Cases

**Status:** pending-review · 0/12
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7
**Out of suite (non-GUI):** shared-console-user-directory-SC-01 - a console's import of the package resolving
**Out of suite (unit):** shared-console-user-directory-SC-30, shared-console-user-directory-SC-31, shared-console-user-directory-SC-32

## Background

* The directory is the Users page of `<console url>`, the Grade10 console of the environment under test; a row opens its account in the panel beside the list. What the page offers follows the operator's grants: an operator without a grant is offered none of its moves.
* `<another account>` is an account other than the signed-in operator's, holding `user` and no elevated role.
* The console's role vocabulary is the roles Grade10 defines, each with a label and a permission summary; allowed email domains and locked roles are the ones Grade10 sets for the create dialog.

## Walk 1: An admin reads and changes one account

Starting state:

- admin(holds `user:list`, `user:set-role`, `user:ban` and `session:list`) on the Users page.

Shared test data:

| Field | Value |
| --- | --- |
| another account | as in the Background, signed in on the site |

### Route

1. Open `<another account>` from its row.
   - The panel opens beside the list, whole. `shared.console-user-directory.US4-TC1`
2. Read its sessions area.
   - Each session by identifier, no secret. `shared.console-user-directory.US2-TC1`
3. Give it `staff` in the panel, and save.
   - Saved in one step. `shared.console-user-directory.US5-TC1`
4. Start a ban from the panel, type a reason, and confirm.
   - A dialog confirms it; the reason is recorded with the ban. `shared.console-user-directory.US1-TC3`

## shared.console-user-directory.US1: Operator moderates an account from the directory

**As an** operator
**I want** to change an account's roles or auction standing through a confirmation that speaks my console's words
**so that** every change is deliberate and my console's own vocabulary is what I act in.

<!-- trace:case id=g10.shared-user-directory.TC-39a rev=1 -->
### shared.console-user-directory.US1-TC1: The roles dialog offers the console's roles with their summaries, and saves the selection in that order

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Consumer-owned vocabulary

**Pre-conditions:**

* admin(holds `user:list` and `user:set-role`) is on the Users page, which lists `<another account>`.

**Test data:**

| `<selected>` | `<holds afterwards>` |
| --- | --- |
| `staff` and `support`, chosen in that order | `support` and `staff`, in the order the dialog lists them |
| none | `user` only |

**Steps:**

1. Read the list's Joined column, then open the roles dialog from `<another account>`'s row and read the roles offered.
2. Select `<selected>`, save, and reopen the dialog.

**Expected Results:**

* Step 1: each joined date reads as Grade10 writes it; the dialog offers each Grade10 role with its label and permission summary, and no other.
* Step 2 shows `<holds afterwards>`.

<!-- trace:case id=g10.shared-user-directory.TC-2qb rev=1 covers=g10.shared-user-directory.SC-pff,g10.shared-user-directory.SC-1iw,g10.shared-user-directory.SC-kmj,g10.shared-user-directory.SC-z5x -->
### shared.console-user-directory.US1-TC2: Each row offers only the moves the operator's grants allow, ban or unban by the account's standing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-01

**Pre-conditions:**

* `<operator>` is on the Users page, which lists a banned account and an unbanned one.

**Test data:**

| `<operator>` | `<rows offer>` |
| --- | --- |
| admin holding `user:ban`, `user:set-role`, `user:delete`, `session:list` and `user:create` | unban on the banned row and ban on the other, never both; roles, delete and sessions on each; Create on the page |
| staff holding `user:list` only | no ban, unban, roles, delete or sessions; no Create |
| support holding `user:list` and `user:ban` | ban or unban by standing; no roles, delete or sessions |

**Steps:**

1. Read each row's actions, and the page's.

**Expected Results:**

* They offer `<rows offer>`.

<!-- trace:case id=g10.shared-user-directory.TC-an1 rev=1 -->
### shared.console-user-directory.US1-TC3: A move that needs a reason collects one, a move that does not asks none, and cancel changes nothing

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
* **Trace:** shared-console-user-directory-US-01

**Pre-conditions:**

* admin(holds `user:list` and `user:ban`) is on the Users page; `<another account>` is `<standing>`.

**Test data:**

| `<standing>` | `<move>` | `<dialog>` | `<afterwards>` |
| --- | --- | --- | --- |
| unbanned | ban, typing Chargeback dispute open, then confirm | names the ban in the console's words, with a reason field | banned, the panel and the trail showing that reason |
| banned | unban, then confirm | names the unban, with no reason field | unbanned, no reason recorded |
| unbanned | ban, then cancel | names the ban | still unbanned |

**Steps:**

1. Start `<move>` from the row or the panel.

**Expected Results:**

* A dialog the page renders opens: `<dialog>`; the browser's own confirm box never appears.
* The account is `<afterwards>`.

---

## shared.console-user-directory.US2: Operator reviews where an account is signed in

**As an** operator
**I want** to see and end an account's sessions without ever seeing what authenticates them
**so that** I can act on a compromised account without the console itself becoming the leak.

<!-- trace:case id=g10.shared-user-directory.TC-i1m rev=1 -->
### shared.console-user-directory.US2-TC1: The panel names each session by its identifier, with where it was raised and when it ends, and shows no secret

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-02

**Pre-conditions:**

* admin(holds `user:list` and `session:list`) is on the Users page; `<another account>` holds console access and is signed in on the site and on the console.

**Steps:**

1. Open `<another account>`, and read its sessions area.
2. Search the panel for each session's secret, read in the browser that holds it.

**Expected Results:**

* Step 1 shows two sessions, each by a different identifier, with where it was raised and when it ends.
* Step 2 finds neither secret.

<!-- trace:case id=g10.shared-user-directory.TC-kmn rev=1 -->
### shared.console-user-directory.US2-TC2: An account with no sessions says so and offers nothing to end

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-02

**Pre-conditions:**

* admin(holds `user:list` and `session:list`) is on the Users page; an account holds no session on any surface.

**Steps:**

1. Open the account, and read its sessions area.

**Expected Results:**

* It says the account holds no sessions, and the control that ends every session is unavailable.

---

## shared.console-user-directory.US3: Operator opens a role from the account

**As an** operator,
**I want** a role name on the open account to open that role on the grants page
when the console supplies an address,
**so that** I move from who holds a role to what it can do without the list
navigating away when I meant to open the account.

<!-- trace:case id=g10.shared-user-directory.TC-uji rev=1 -->
### shared.console-user-directory.US3-TC1: A role name on the open account opens that role, while the list's role names stay plain

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-03

**Pre-conditions:**

* admin(holds `user:list`) is on the Users page; an account holds `staff`.

**Steps:**

1. Select `staff` in the list's Roles cell for the account.
2. Open the account, and select `staff` on its identity.

**Expected Results:**

* Step 1 opens the account; the role name is not a link.
* Step 2 opens `staff` on the Roles & Permissions page.

---

## shared.console-user-directory.US4: Operator reads one account beside the directory

**As an** operator,
**I want** an account's identity and actions, the grants it holds, when it
joined, and where it is signed in to open together beside the list,
**so that** I judge the account from one reading instead of three
confirmations that never meet.

<!-- trace:case id=g10.shared-user-directory.TC-cvq rev=1 covers=g10.shared-user-directory.SC-xmw,g10.shared-user-directory.SC-4vh,g10.shared-user-directory.SC-2r3,g10.shared-user-directory.SC-mne,g10.shared-user-directory.SC-g8w,g10.shared-user-directory.SC-jnf,g10.shared-user-directory.SC-my2,g10.shared-user-directory.SC-58a,g10.shared-user-directory.SC-uwn,g10.shared-user-directory.SC-eo0,g10.shared-user-directory.SC-geg -->
### shared.console-user-directory.US4-TC1: A row opens the account whole beside the list: identity, grants, timeline, standing and sessions

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
* **Trace:** shared-console-user-directory-US-04

**Pre-conditions:**

* admin(holds `user:list`) is on the Users page; `<account>` is listed.

**Test data:**

| `<account>` | `<panel shows>` |
| --- | --- |
| holding `admin` and `user`, with a session | each grant by its label, the elevated mark once; the joined milestone with its time; its session |
| holding no grants | that it holds no grants, naming none |
| banned with reason Chargeback dispute open | banned with that reason; the joined milestone and a banned milestone with no invented time |
| banned with no reason | banned, with no reason |

**Steps:**

1. Open `<account>` from its row.

**Expected Results:**

* The panel opens beside the list, still visible, showing who the account is, its actions and `<panel shows>`; no grant label is a link, and no area appears that holds nothing.

<!-- trace:case id=g10.shared-user-directory.TC-ht4 rev=1 -->
### shared.console-user-directory.US4-TC2: The filters speak the console's words, Any clears one alone, Users locks Roles, and a column orders the list

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Narrowing and order

**Pre-conditions:**

* admin(holds `user:list`) is on the Users page, with Status set to Banned and Email narrowed; the list holds accounts that joined on different days.

**Test data:**

| `<choose>` | `<filters afterwards>` |
| --- | --- |
| Any on Status | Status cleared, Email still narrowed |
| Any on Email | Email cleared, Status still Banned |
| Type Users | Roles shows the user label and cannot be chosen |
| to order by Joined, oldest first, on the Joined column | the list ordered oldest first, the column marked so |

**Steps:**

1. Read the Type, Roles, Status and Email options.
2. Choose `<choose>`.

**Expected Results:**

* Step 1 offers Grade10's labels and options, and no other.
* Step 2 leaves `<filters afterwards>`, the list narrowing to match.

---

## shared.console-user-directory.US5: Operator changes an account's access from the panel

**As an** operator,
**I want** to change roles where I read the account, and still be stopped for
a confirmation on a move I cannot undo,
**so that** an ordinary change costs one step and a ban never happens by
accident.

<!-- trace:case id=g10.shared-user-directory.TC-ygh rev=1 covers=g10.shared-user-directory.SC-pff,g10.shared-user-directory.SC-1iw,g10.shared-user-directory.SC-kmj,g10.shared-user-directory.SC-z5x -->
### shared.console-user-directory.US5-TC1: Roles save from the panel in one step, while a ban started there confirms outside it

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
* **Trace:** shared-console-user-directory-US-05

**Pre-conditions:**

* admin(holds `user:list`, `user:set-role` and `user:ban`) has `<account>` open in the panel.

**Test data:**

| `<account>` | `<panel offers>` |
| --- | --- |
| `<another account>` | its roles to change, and ban |
| an account whose roles Grade10 marks blocked | the blocked mark, and no change of roles |

**Steps:**

1. Change the selected roles where offered, and save.
2. Start a ban from the panel, then cancel the dialog.

**Expected Results:**

* Step 1: the panel offers `<panel offers>`; a change saves with no confirmation, in the order the options are offered.
* Step 2: the moderation dialog opens; the panel confirms nothing itself, and the account stays unbanned.

---

## shared.console-user-directory.US6: Operator creates an account from the directory

**As an** operator,
**I want** a create dialog that collects name, email, and roles from my
console's vocabulary when the console supplies a create handler, reports the
created account on success, and reports the existing account through
`onOpenExisting` when the email is taken,
**so that** my console opens the account it created or the one already there
without the components deciding what comes next.

<!-- trace:case id=g10.shared-user-directory.TC-al1 rev=1 covers=g10.shared-user-directory.SC-3w0,g10.shared-user-directory.SC-uox,g10.shared-user-directory.SC-bm5,g10.shared-user-directory.SC-d4y,g10.shared-user-directory.SC-8ij,g10.shared-user-directory.SC-iqr,g10.shared-user-directory.SC-aan -->
### shared.console-user-directory.US6-TC1: The create dialog takes a name, an email and the console's roles, reviews the draft, then creates and opens the account

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-06

**Pre-conditions:**

* admin(holds `user:list`, `user:create` and `user:set-role`) is on the Users page; no account holds someone@9gag.com.

**Steps:**

1. Select Create, and read the dialog.
2. Enter Dialog Person and someone@9gag.com, choose a role that is not locked, and confirm.
3. Confirm the review.

**Expected Results:**

* Step 1 collects name, email and roles, offering only Grade10's roles and no password field; Create stays disabled until a name, an email and a role are present.
* Step 2 shows a review of the draft with no email or locked-role note, and creates nothing yet.
* Step 3 creates the account, and the console opens it.

<!-- trace:case id=g10.shared-user-directory.TC-p29 rev=1 covers=g10.shared-user-directory.SC-3w0,g10.shared-user-directory.SC-uox,g10.shared-user-directory.SC-bm5,g10.shared-user-directory.SC-d4y,g10.shared-user-directory.SC-8ij,g10.shared-user-directory.SC-iqr,g10.shared-user-directory.SC-aan -->
### shared.console-user-directory.US6-TC2: A taken email is refused on the form, which offers to open the existing account

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

* admin(holds `user:list`, `user:create` and `user:set-role`) is on the Users page; an account holds taken.dialog@example.com.

**Steps:**

1. Select Create, enter a name, taken.dialog@example.com and a role, and confirm.
2. Choose the open-existing action.

**Expected Results:**

* Step 1 stays on the form, opening no review: it says the email is taken and offers to open the existing account; nothing is created.
* Step 2 opens the existing account, to change its roles there.

<!-- trace:case id=g10.shared-user-directory.TC-ttp rev=1 covers=g10.shared-user-directory.SC-3w0,g10.shared-user-directory.SC-uox,g10.shared-user-directory.SC-bm5,g10.shared-user-directory.SC-d4y,g10.shared-user-directory.SC-8ij,g10.shared-user-directory.SC-iqr,g10.shared-user-directory.SC-aan -->
### shared.console-user-directory.US6-TC3: The review warns of an email off the allowed list, a malformed one, or a locked role, and Back creates nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-user-directory-US-06

**Pre-conditions:**

* admin(holds `user:list`, `user:create` and `user:set-role`) is on the Users page.

**Test data:**

| `<email>` | `<role>` | `<review notes>` |
| --- | --- | --- |
| someone@example.com | one not locked | the email is off the allowed list |
| not-an-email | one not locked | the email is malformed |
| someone@9gag.com | a locked role | the locked role, in bold, cannot be removed once created; no email note |
| someone@example.com | a locked role | both notes, the email and the role in bold |

**Steps:**

1. Select Create, enter a name, `<email>` and `<role>`, and confirm.
2. Choose Back.
3. Confirm again, then confirm the review.

**Expected Results:**

* Step 1 shows a review with `<review notes>`, creating nothing.
* Step 2 returns to the form, creating nothing.
* Step 3 creates the account.

## Settled

* The Users page shows an account's sessions in its panel; ending one or every session, and who may, are the sessions capability's.
* Where a session was raised and when it ends are shown as supplied; what authenticates a session is never shown, and an identifier is not it.
* Which sessions are listed, their order, and whether ending asks for confirmation are the console's and the sessions capability's.

## Reconciliation

- **Covered at domain** - `shared.auth-dmn.US3-TC1` walks a ban from the user directory landing on the trail, and an unban; `shared.auth-dmn.US5-TC1` walks a role saved in the directory deciding the person's next action
