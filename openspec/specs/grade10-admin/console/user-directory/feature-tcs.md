# grade10-admin/console/user-directory Test Cases

**Status:** pending-review · 0/25
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* Users is `<users>` on the admin console: a directory of accounts with search, Type, role and status narrowing and pages, an account opening in a panel beside the list. Each case names the grants the operator's roles hold.
* Audit is the console's audit trail, read by an auditor holding `audit:read`, filtered by user id; it names people by user id. `<g10url>` is the Grade10 site. A change to an account's standing, roles or sessions reaches the person's next page within 70 seconds; a tab is read by opening a page in it.

## g10adm.console-user-directory.US1: Admin reviews who holds elevated grants

**As an** admin,
**I want** to narrow Users to the accounts holding a role and read what each
of those accounts can actually do,
**so that** I can review the elevated access in the console without reading
authorization source or asking an engineer.

<!-- trace:case id=g10adm.console-user-directory.TC-dac rev=1 covers=g10adm.console-user-directory.SC-s3c,g10adm.console-user-directory.SC-fjy,g10adm.console-user-directory.SC-2zy,g10adm.console-user-directory.SC-8pc,g10adm.console-user-directory.SC-0vu,g10adm.console-user-directory.SC-4l4,g10adm.console-user-directory.SC-w5y,g10adm.console-user-directory.SC-fy9,g10adm.console-user-directory.SC-k2t -->
### g10adm.console-user-directory.US1-TC1: An admin narrows Users to a role and reads an account's grants from the mapping

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-01

**Pre-conditions:**

* An admin holding `user:list` and `user:set-role`; the directory holds a `support` account, a banned customer, and accounts that do not hold `admin`.

**Steps:**

1. Open `<users>` with no role narrowing in the address.
2. Narrow to `admin`, then to banned accounts under Users.
3. Open the `support` account, and its activity.
4. Open `support` from the account's identity.
5. Open the admin's own account.

**Expected Results:**

* Step 1 lists elevated accounts, none without an elevated role.
* Step 2 lists only `admin` accounts with their count, then only banned accounts holding no elevated role.
* Step 3 shows exactly the grants the mapping gives `support`, each elevated one marked once, and when the account joined.
* Step 4 opens Roles & Permissions on `support`.
* Step 5's panel offers changing roles.

<!-- trace:case id=g10adm.console-user-directory.TC-k1h rev=1 covers=g10adm.console-user-directory.SC-s3c,g10adm.console-user-directory.SC-fjy,g10adm.console-user-directory.SC-2zy,g10adm.console-user-directory.SC-8pc,g10adm.console-user-directory.SC-0vu,g10adm.console-user-directory.SC-4l4,g10adm.console-user-directory.SC-w5y,g10adm.console-user-directory.SC-fy9,g10adm.console-user-directory.SC-k2t -->
### g10adm.console-user-directory.US1-TC2: A move the operator cannot make is not offered, nor ban on an account being erased

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
* **Trace:** grade10-admin-console-user-directory-US-01

**Pre-conditions:**

* `<operator>` opens `<users>`, then `<account>`.

**Test data:**

| `<operator>` | `<account>` | `<not offered>` | `<still offered>` |
| --- | --- | --- | --- |
| support holding `user:list` and `user:ban`, not `user:set-role`, `user:delete`, `session:list` or `user:create` | a customer | changing roles, erasure, sessions or Create | ban on an unbanned account, unban on a banned one, never both |
| support holding `user:list` and `user:ban`, not `user:set-role`, `user:delete`, `session:list` or `user:create` | an account with an erasure filed | ban or unban | the erasure shown as requested |
| staff holding `user:list` alone | a banned customer | ban, unban, changing roles, erasure, sessions or Create | reading the account |
| staff without `user:list` | none: Users is opened | any account; the list is refused | nothing |
| auditor | a customer | ban, unban, changing roles, erasure, sessions or Create | reading the account |
| a collector whose stored roles are `user` and `intern`, set outside the console | none: Users is opened | any account; the list is refused, a ban sent directly refused | nothing |

**Steps:**

1. Read the page's, the row's and the panel's moves.

**Expected Results:**

* None offers `<not offered>`; `<still offered>` stands.

<!-- trace:case id=g10adm.console-user-directory.TC-g59 rev=1 -->
### g10adm.console-user-directory.US1-TC3: The roles dialog offers Grade10's roles, saves in one step, and the person's next page follows

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-01

**Pre-conditions:**

* An admin holding `user:list` and `user:set-role` is on `<users>` in tab B; another account also holds `admin`; `<account>` is signed in on the console in tab A.

**Test data:**

| `<account>` | `<roles saved>` | `<holds>` | `<tab A shows>` |
| another, holding no operator role | `staff` and `support`, chosen in that order | `support` and `staff`, in the dialog's order | the sections `staff` and `support` reach |
| another, holding an operator role and no `admin` | none | `user` alone | no operator section |
| the admin's own | `staff` and `admin` | `staff` and `admin` | the sections `admin` reaches |
| the admin's own | `staff`, without `admin` | `staff` alone | no section only `admin` reaches |

**Steps:**

1. Read the list's Joined column; open `<account>`'s roles from its row, and read the roles offered.
2. Select `<roles saved>`, save, and reopen the roles.
3. Within 70 seconds, open another page in tab A.
4. As an auditor, filter Audit by the account's user id.

**Expected Results:**

* Step 1: each joined date reads as Grade10 writes it; the dialog offers each Grade10 role with its label and permission summary, and no other.
* Step 2 saves with no confirmation; the account holds `<holds>`.
* Step 3's navigation shows `<tab A shows>`.
* Step 4 lists one role change for the save, naming the admin and the account by user id.

<!-- trace:case id=g10adm.console-user-directory.TC-wex rev=1 -->
### g10adm.console-user-directory.US1-TC4: A role change the operator may not make is refused

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
* **Trace:** grade10-admin-console-user-directory-US-01

**Pre-conditions:**

* `<operator>` is on `<users>`.

**Test data:**

| `<operator>` | `<account>` | `<change>` |
| --- | --- | --- |
| support, without `user:set-role` | another account | any role change |
| admin holding `user:set-role` | another account holding `admin` | remove `admin` |
| staff holding `user:set-role`, not `admin`, while one account alone holds `admin` | that account | remove `admin` |
| the one account holding `admin` | its own | remove `admin` |
| admin holding `user:set-role` | an account whose roles Grade10 marks blocked | any role change |

**Steps:**

1. Open `<account>`, and try `<change>`.

**Expected Results:**

* It is not offered, shown blocked, or refused; the roles are as they were.

---

## g10adm.console-user-directory.US2: Operator works one account from a single address

**As an** operator,
**I want** one address that opens the account I was sent to and carries on to
whatever it points at,
**so that** a colleague's link, a trail entry and my own bookmark all land me
in the same place, and I never hunt for the person twice.

<!-- trace:case id=g10adm.console-user-directory.TC-ww8 rev=1 covers=g10adm.console-user-directory.SC-kyo,g10adm.console-user-directory.SC-pix,g10adm.console-user-directory.SC-thq,g10adm.console-user-directory.SC-akc,g10adm.console-user-directory.SC-wee,g10adm.console-user-directory.SC-xy1 -->
### g10adm.console-user-directory.US2-TC1: An address opens one account, and a view pasted to a colleague opens the same

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-02

**Pre-conditions:**

* An operator holding `user:list`; a colleague holds the same grants.

**Steps:**

1. Search, narrow, page past the first, and open a known account.
2. Copy the address; open it in the colleague's session.
3. Search for a query that matches only in the other Type, and follow the link offered.

**Expected Results:**

* Step 1 opens the panel beside the list, the list still there.
* Step 2 shows the same search, narrowing, page and open panel, nothing searched again.
* Step 3's empty list offers the query in the other Type, and following it keeps the query.

<!-- trace:case id=g10adm.console-user-directory.TC-uh8 rev=1 covers=g10adm.console-user-directory.SC-kyo,g10adm.console-user-directory.SC-pix,g10adm.console-user-directory.SC-thq,g10adm.console-user-directory.SC-akc,g10adm.console-user-directory.SC-wee,g10adm.console-user-directory.SC-xy1 -->
### g10adm.console-user-directory.US2-TC2: The panel hands off to the loyalty record and to what the account has done

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
* **Trace:** grade10-admin-console-user-directory-US-02

**Pre-conditions:**

* An operator holding `user:list`, who may read the trail, opens `<account>`.

**Test data:**

| `<account>` | `<offers>` |
| --- | --- |
| a customer holding no elevated role | the loyalty record and what the account has done, ahead of ban, unban or erase |
| an elevated account | what the account has done, ahead of ban, unban or erase, and no loyalty record |

**Steps:**

1. Read the panel's actions.

**Expected Results:**

* It offers `<offers>`.

<!-- trace:case id=g10adm.console-user-directory.TC-l4h rev=1 -->
### g10adm.console-user-directory.US2-TC3: Search and filters narrow the list in the console's words, and a column orders it

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
* **Trace:** grade10-admin-console-user-directory-US-02

**Pre-conditions:**

* An operator holding `user:list` is on `<users>`; it holds Alex Collector (collector@example.com), an account sharing its email attribute, an `admin`, a `staff`, a `user`-only account, and banned and unbanned `support` accounts, joined on different days.

**Test data:**

| `<asked>` | `<listed>` |
| --- | --- |
| search COLLECTOR | accounts whose email contains collector, in any case, each by its own user id |
| search ALEX | Alex Collector alone |
| role `admin` | accounts holding `admin` alone |
| Type Elevated | accounts holding an elevated role, never the `user`-only one |
| Type Users | accounts with no elevated role; Roles shows the user label and cannot be chosen |
| Status Banned and role `support` | the banned `support` account alone, marked banned |
| Status Banned and Email narrowed, then Any on Status | Email still narrowed, Status cleared |
| Status Banned and Email narrowed, then Any on Email | Status still Banned, Email cleared |
| Joined ordered oldest first, then that order cleared | the oldest first, the column marked so; then the newest first |

**Steps:**

1. Read the Type, Roles, Status and Email options, the Status filter with a screen reader; apply `<asked>`.
2. As an auditor, filter Audit by the operator's user id.

**Expected Results:**

* The options are Grade10's labels and no other, the Status filter announced as one choice with its selected option; the list shows `<listed>`.
* Step 2 lists no entry for the search.

<!-- trace:case id=g10adm.console-user-directory.TC-xz2 rev=1 -->
### g10adm.console-user-directory.US2-TC4: A row opens the account whole beside the list

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
* **Trace:** grade10-admin-console-user-directory-US-02

**Pre-conditions:**

* An operator holding `user:list` is on `<users>`; `<account>` is listed.

**Test data:**

| `<account>` | `<panel shows>` |
| --- | --- |
| holding `admin` and `staff`, with a session | each grant by its label, the elevated mark once; the joined milestone with its time; its session |
| holding no grants | that it holds no grants, naming none |
| banned with reason Chargeback dispute open | banned with that reason; the joined milestone and a banned milestone with no invented time |
| banned with no reason | banned, with no reason |
| stored roles `user` and `intern`, set outside the console | `user` alone, `intern` nowhere |

**Steps:**

1. Select a role name in `<account>`'s Roles cell in the list.
2. Read the panel; select a role name on its identity.

**Expected Results:**

* Step 1 opens the account in the panel beside the list, the role name not a link there.
* Step 2 shows the account's own user id, its actions and `<panel shows>`, with no area that holds nothing, and opens that role on Roles & Permissions.

<!-- trace:case id=g10adm.console-user-directory.TC-pu4 rev=1 -->
### g10adm.console-user-directory.US2-TC5: A ban asks for a reason in the console's own dialog, and stops the person; an unban gives them back

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-02

**Pre-conditions:**

* An admin holding `user:list` and `user:ban` is on `<users>`; `<account>`, holding `user` alone, is `<standing>` and signed in on `<g10url>` in another browser, with a product in the cart, and on the console in a third.

**Test data:**

| `<standing>` | `<move>` | `<dialog>` | `<afterwards>` |
| --- | --- | --- | --- |
| unbanned | ban, typing Chargeback dispute open, then confirm | names the ban, with a reason field | listed, marked banned with that reason; within 70 seconds the site and the console sign it out, checkout does not complete and sign-in starts no session |
| banned | unban, then confirm | names the unban, with no reason field | unbanned, no reason recorded; it signs in again |

**Steps:**

1. Start `<move>` from the row or the panel.
2. After 70 seconds, in the other browsers, start checkout and sign in as `<account>`.
3. Start the opposite move, and cancel its dialog.
4. As an auditor, filter Audit by `<account>`'s user id, and expand the entry.

**Expected Results:**

* A dialog the page renders opens: `<dialog>`; the browser's own confirm box never appears.
* The account is `<afterwards>`.
* Step 3 changes nothing.
* Step 4 lists one entry for the move, with its reason where one was typed, naming the admin and the account by user id, never by address; nothing for the cancel.

<!-- trace:case id=g10adm.console-user-directory.TC-tfk rev=1 -->
### g10adm.console-user-directory.US2-TC6: A ban, unban or erasure filing the operator may not make is refused

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
* **Trace:** grade10-admin-console-user-directory-US-02

**Pre-conditions:**

* `<operator>` is on `<users>`; `<account>` is as the row says.

**Test data:**

| `<operator>` | `<account>` | `<act>` |
| --- | --- | --- |
| admin holding `user:ban` | the admin's own | ban |
| support holding `user:ban` | holding `admin` | ban |
| admin holding `user:ban` | another account holding `admin` | ban |
| admin holding `user:delete` | holding `admin`, unbanned | file an erasure request |
| admin holding `user:ban` | unbanned, with a request to be forgotten its holder filed | ban, reason Erasure check |
| admin holding `user:ban` | banned by an operator's open erasure filing | unban |

**Steps:**

1. Open `<account>`, and do `<act>`.
2. As an auditor, filter Audit by `<account>`'s user id.

**Expected Results:**

* It is refused, naming the open request where there is one; the standing and any request are as they were, and the holder signs in exactly as before.
* Step 2 lists the act marked not succeeded, naming the operator.

<!-- trace:case id=g10adm.console-user-directory.TC-muq rev=1 -->
### g10adm.console-user-directory.US2-TC7: An operator's erasure filing bans the account, taking over a request its holder filed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-02

**Pre-conditions:**

* An admin holding `user:list` and `user:delete` is on `<users>`; `<account>` is unbanned, with `<request>`.

**Test data:**

| `<request>` | `<request reads>` |
| --- | --- |
| no open erasure request | one open request, filed by the operator |
| a request its holder filed, inside the seven days | the same request, now filed by the operator |

**Steps:**

1. Open `<account>`, and file an erasure request.
2. Sign in as `<account>` in another browser.

**Expected Results:**

* Step 1 shows `<request reads>`, and the account banned.
* Step 2 starts no session.

<!-- trace:case id=g10adm.console-user-directory.TC-sd3 rev=1 -->
### g10adm.console-user-directory.US2-TC8: Cancelling an operator's erasure request lifts the ban it applied

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-02

**Pre-conditions:**

* An admin holding `user:list` and `user:delete`; `<account>` was unbanned, then banned by an operator's erasure request filed under seven days ago.

**Steps:**

1. Open `<account>`, and cancel the erasure request.
2. Sign in as `<account>` in another browser.

**Expected Results:**

* Step 1: the request reads cancelled, and the account unbanned.
* Step 2 signs it in.

<!-- trace:case id=g10adm.console-user-directory.TC-lxb rev=1 -->
### g10adm.console-user-directory.US2-TC9: Cancelling an operator's erasure request leaves a ban it did not apply

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-02

**Pre-conditions:**

* An admin holding `user:list` and `user:delete`; `<account>` was banned for conduct, then an operator filed an erasure request over it, still open.

**Steps:**

1. Open `<account>`, and cancel the erasure request.
2. Sign in as `<account>` in another browser.

**Expected Results:**

* Step 1: the request reads cancelled, the account still banned.
* Step 2 starts no session.

<!-- trace:case id=g10adm.console-user-directory.TC-fp0 rev=1 -->
### g10adm.console-user-directory.US2-TC10: The panel lists each session as the site's or the console's, by identifier, with no secret

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-02

**Pre-conditions:**

* An admin holding `user:list` and `session:list` is on `<users>`; `<account>` holds `<sessions>`.

**Test data:**

| `<account>` | `<sessions>` | `<listed>` |
| --- | --- | --- |
| one holding console access | the site on a desktop, the console on the same desktop, the site on a phone | two site sessions and one console session |
| one holding console access | the console only | one console session |
| the admin's own | the console in use and the site | one console and one site session |
| one signed in before release | that session | one site session |
| one signed in nowhere | none | that it holds no sessions, ending every session unavailable |

**Steps:**

1. Open `<account>`, and read its sessions area.
2. Search the panel for each session's secret, read in the browser that holds it.
3. As an auditor, filter Audit by the admin's user id.

**Expected Results:**

* Step 1 lists `<listed>`, each by a different identifier, named as the site's or the console's, with where it was raised and when it ends.
* Step 2 finds no secret.
* Step 3 lists no entry for reading the sessions.

<!-- trace:case id=g10adm.console-user-directory.TC-tio rev=1 -->
### g10adm.console-user-directory.US2-TC11: Ending a session signs that one out within 70 seconds, and ending every session signs out both surfaces

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-02

**Pre-conditions:**

* An admin holding `user:list`, `session:list` and `session:revoke` is on `<users>`; `<sessions>` are open, each in its own tab.

**Test data:**

| `<sessions>` | `<ended>` | `<afterwards>` |
| --- | --- | --- |
| an account on `<g10url>` on two devices | the first device's | the first signed out; the second still signed in |
| an account on `<g10url>` and the console | the site's | the site signed out; the console still signed in |
| an account on `<g10url>` and the console | the console's | the console signed out; the site still signed in |
| an account on `<g10url>` and the console | every session | the site signed out, and the console showing its sign-in page |
| the admin's own, on the console | the one in use | the admin signed out of the console |

**Steps:**

1. Open the account, and end `<ended>` in its sessions area.
2. After 70 seconds, open a page in each tab.
3. As an auditor, filter Audit by the account's user id.

**Expected Results:**

* Step 2 shows `<afterwards>`.
* Step 3 lists one revoke for each ending, naming the admin, and no secret.

<!-- trace:case id=g10adm.console-user-directory.TC-wwl rev=1 -->
### g10adm.console-user-directory.US2-TC12: An operator whose grant does not cover an account sees no session to list or end

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
* **Trace:** grade10-admin-console-user-directory-US-02

**Pre-conditions:**

* `<operator>` is on `<users>`; `<account>` is signed in on `<g10url>` in another tab.

**Test data:**

| `<operator>` | `<account>` | `<panel shows>` |
| --- | --- | --- |
| staff holding `user:list`, not `session:list` | a customer | no session, and that the operator may not see them |
| staff holding `user:list` and `session:list`, not `session:revoke` | a customer | its session, with nothing to end it |
| support holding `user:list` and `session:list` | an account holding `admin` | no session, and that the operator may not see them |

**Steps:**

1. Open `<account>`, and read its sessions area.
2. After 70 seconds, open a page in `<account>`'s tab.

**Expected Results:**

* Step 1 shows `<panel shows>`.
* Step 2: `<account>` is still signed in.

---

## g10adm.console-user-directory.US3: Operator suspends an account from auctions

**As an** operator holding `auction:moderate`,
**I want** to suspend an account from auctions from its panel on Users, and
reinstate it later,
**so that** I can stop a bidder I have reason to stop without banning them
from the whole platform.

<!-- trace:case id=g10adm.console-user-directory.TC-3ua rev=1 covers=g10adm.console-user-directory.SC-8ll,g10adm.console-user-directory.SC-e0b,g10adm.console-user-directory.SC-gn2,g10adm.console-user-directory.SC-25v -->
### g10adm.console-user-directory.US3-TC1: An operator suspends an account from auctions with a reason, and reinstates one

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-03

**Pre-conditions:**

* An operator holding `user:list` and `auction:moderate`; one account is active and unbanned, another suspended for a missed payment deadline.

**Steps:**

1. Open the active account, choose suspend from auctions, enter Suspected shill bidding, and confirm.
2. Open the deadline-suspended account, choose reinstate, and confirm.

**Expected Results:**

* Step 1's panel shows it suspended from auctions with the reason, who and when, offering reinstate, the account still not banned.
* Step 2's panel shows it not suspended, offering suspend.

<!-- trace:case id=g10adm.console-user-directory.TC-ed0 rev=1 covers=g10adm.console-user-directory.SC-8ll,g10adm.console-user-directory.SC-e0b,g10adm.console-user-directory.SC-gn2,g10adm.console-user-directory.SC-25v -->
### g10adm.console-user-directory.US3-TC2: Suspending cannot be confirmed without a reason

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-03

**Pre-conditions:**

* An operator holding `user:list` and `auction:moderate` opens an active account.

**Steps:**

1. Choose suspend from auctions, and try to confirm with the reason empty.

**Expected Results:**

* It cannot be confirmed; the account is not suspended.

<!-- trace:case id=g10adm.console-user-directory.TC-a2x rev=1 covers=g10adm.console-user-directory.SC-8ll,g10adm.console-user-directory.SC-e0b,g10adm.console-user-directory.SC-gn2,g10adm.console-user-directory.SC-25v -->
### g10adm.console-user-directory.US3-TC4: An operator without the grant is offered neither move

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-03

**Pre-conditions:**

* An operator holding `user:list`, not `auction:moderate`; one account is suspended, another not.

**Steps:**

1. Open each account's panel.

**Expected Results:**

* Neither offers suspend or reinstate.

---

## g10adm.console-user-directory.US4: Admin creates an account from Users

**As an** admin holding `user:create`,
**I want** to create a passwordless Auth account from Users with name, email,
and roles, open the new account's panel when create succeeds, and open the
existing account when the email is already taken,
**so that** I can stand up elevated access before the person signs in without
leaving the access desk or using Override.

<!-- trace:case id=g10adm.console-user-directory.TC-2zn rev=1 covers=g10adm.console-user-directory.SC-8z1,g10adm.console-user-directory.SC-v25,g10adm.console-user-directory.SC-dz7,g10adm.console-user-directory.SC-z2a,g10adm.console-user-directory.SC-dcl,g10adm.console-user-directory.SC-xr8 -->
### g10adm.console-user-directory.US4-TC1: Create reviews the draft, then opens the new account's panel

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
* **Trace:** grade10-admin-console-user-directory-US-04

**Pre-conditions:**

* An operator holding `user:list` and `<grants>`; no account holds `<email>`. Users create expects `@9gag.com` or `@memestrategy.com`.

**Test data:**

| `<grants>` | `<email>` | `<role>` | `<review notes>` |
| --- | --- | --- | --- |
| `user:create` and `user:set-role` | someone@9gag.com | `admin` | the admin note: `admin`, in bold, cannot be removed once created; no email note |
| `user:create` and `user:set-role` | someone@example.com | `admin` | the email check and the admin note together |
| `user:create` alone | desk.user@9gag.com | `user` | neither note |
| `user:create` alone | no.role@9gag.com | none | neither note; the account holds `user` alone |

**Steps:**

1. Choose Create, and read the form; enter a name, `<email>` and `<role>`, and confirm.
2. Choose Back, confirm again, and confirm the review.
3. Read the open panel and the address; open `<email>`'s inbox, and search the loyalty Members page for it.

**Expected Results:**

* Step 1's form asks for a name, an email and Grade10's roles, with no password field, Create unavailable until a name and an email are present; it then shows a review with `<review notes>`, creating nothing; Back returns to the form, creating nothing.
* Step 2 creates one account; step 3 opens its panel beside the list, holding `<role>` alone, addressed as picking its row is, with no mail sent from the create and no loyalty member or opening points.

<!-- trace:case id=g10adm.console-user-directory.TC-pp4 rev=1 covers=g10adm.console-user-directory.SC-8z1,g10adm.console-user-directory.SC-v25,g10adm.console-user-directory.SC-dz7,g10adm.console-user-directory.SC-z2a,g10adm.console-user-directory.SC-dcl,g10adm.console-user-directory.SC-xr8 -->
### g10adm.console-user-directory.US4-TC2: Create is not offered without user:create

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-04

**Pre-conditions:**

* An operator holds `user:list` and `user:set-role`, not `user:create`.

**Steps:**

1. Open `<users>`, and look for Create.

**Expected Results:**

* Create is not offered.

<!-- trace:case id=g10adm.console-user-directory.TC-p4u rev=1 covers=g10adm.console-user-directory.SC-8z1,g10adm.console-user-directory.SC-v25,g10adm.console-user-directory.SC-dz7,g10adm.console-user-directory.SC-z2a,g10adm.console-user-directory.SC-dcl,g10adm.console-user-directory.SC-xr8 -->
### g10adm.console-user-directory.US4-TC3: A taken email is refused on the form and opens the existing account

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-04

**Pre-conditions:**

* An operator holding `user:list`, `user:create` and `user:set-role`; an account already holds already.there@example.com.

**Steps:**

1. Choose Create, enter a name, already.there@example.com and a role, and confirm on the form.
2. Choose the way offered to open the existing account.

**Expected Results:**

* Step 1 stays on the form with the duplicate refusal, opening no review and creating nothing.
* Step 2 opens the existing account's panel; no second account holds the email.

<!-- trace:case id=g10adm.console-user-directory.TC-xnp rev=1 -->
### g10adm.console-user-directory.US4-TC6: A create the form or the operator's grants refuse keeps what was typed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-04

**Pre-conditions:**

* `<operator>`, holding `user:list` and `user:create`, is on `<users>`.

**Test data:**

| `<operator>` | `<name>` | `<email>` | `<role>` |
| --- | --- | --- | --- |
| not holding `user:set-role` | Almost Staff | almost.staff@9gag.com, held by no account | `staff` |
| not holding `user:set-role` | Almost Admin | almost.admin@9gag.com, held by no account | `admin` |
| also holding `user:set-role` | nothing | nobody.named@9gag.com | `user` |
| also holding `user:set-role` | No At | no.at.9gag.com, which the review notes as malformed | `user` |
| also holding `user:set-role` | Long Address | a 255-character address | `user` |

**Steps:**

1. Choose Create, enter `<name>`, `<email>` and `<role>`, and confirm as far as the form allows.
2. Search the directory for `<email>`.

**Expected Results:**

* Step 1 is refused or stays unavailable, keeping what was typed.
* Step 2 lists no new account.

---

## g10adm.console-user-directory.US5: Admin asks an account to verify

**As an** admin holding `kyc:request`,
**I want** to read an account's identity on its panel and require it to verify
its person or its business, with a reason,
**so that** the account's bids wait until Grade10 knows who stands behind it.

<!-- trace:case id=g10adm.console-user-directory.TC-6k8 rev=1 -->
### g10adm.console-user-directory.US5-TC1: An admin requires a business from the panel, and can drop it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-05

**Pre-conditions:**

* An admin holding `user:list`, `kyc:read` and `kyc:request`; an account has no identity request.

**Steps:**

1. Open its panel, choose Require KYB, enter a reason, and confirm.

**Expected Results:**

* The Identity card shows a `business` request with that reason, and offers Drop on it.

<!-- trace:case id=g10adm.console-user-directory.TC-j95 rev=1 -->
### g10adm.console-user-directory.US5-TC2: Without kyc:read the panel shows no identity

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-05

**Pre-conditions:**

* An operator holds `user:list`, not `kyc:read`.

**Steps:**

1. Open an account's panel.

**Expected Results:**

* No Identity card is shown.
