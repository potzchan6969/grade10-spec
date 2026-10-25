# shared/auth/users Test Cases

**Status:** pending-review · 0/20
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7
**Out of suite (api):** shared-auth-users-SC-43

## Background

* `<g10url>` is the Grade10 site and `<console url>` the Grade10 console of the environment under test. Users is `<users>` on the console: a directory of accounts with search, Type, role and status narrowing and pages, an account opening in a panel beside the list, by user id. Each case names the grants the operator's roles hold.
* Audit is the console's audit trail, read by an auditor holding `audit:read`, filtered by user id; it names people by user id. The account holder's request to be forgotten is on `<g10url>`'s Your data page.
* A change to an account's standing, roles or sessions reaches the person's next page within 70 seconds; a tab is read by opening a page in it. An erasure request matures seven days after it is filed.

## shared.auth-users.US1: Operator lists people in the identity directory

**As an** operator who can list users,
**I want** to search and open accounts by user id,
**so that** I can find a person without seeing records I am not granted.

<!-- trace:case id=g10.shared-users.TC-caj rev=1 -->
### shared.auth-users.US1-TC2: A move the operator cannot make is not offered, nor ban on an account being erased

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
* **Trace:** shared-auth-users-US-01

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

<!-- trace:case id=g10.shared-users.TC-m1l rev=1 -->
### shared.auth-users.US1-TC6: An admin narrows Users to a role and reads an account's grants from the mapping

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-01

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

<!-- trace:case id=g10.shared-users.TC-6mr rev=1 -->
### shared.auth-users.US1-TC7: An address opens one account, and a view pasted to a colleague opens the same

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-01

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

<!-- trace:case id=g10.shared-users.TC-ez5 rev=1 -->
### shared.auth-users.US1-TC8: The panel hands off to the loyalty record and to what the account has done

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
* **Trace:** shared-auth-users-US-01

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

<!-- trace:case id=g10.shared-users.TC-ymp rev=1 -->
### shared.auth-users.US1-TC9: A row opens the account whole beside the list

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
* **Trace:** shared-auth-users-US-01

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

---

## shared.auth-users.US2: Operator bans and unbans an account

**As an** operator who can ban,
**I want** a ban to stop money-moving and sign-in, and an unban to restore them,
**so that** a person who must leave cannot keep acting, a mistaken ban is
reversible, and a compromised admin cannot lock peer admins out by ban.

<!-- trace:case id=g10.shared-users.TC-lde rev=2 -->
### shared.auth-users.US2-TC1: A ban asks for a reason in the console's own dialog, and stops the person; an unban gives them back

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
* **Trace:** shared-auth-users-US-02

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

<!-- trace:case id=g10.shared-users.TC-hx1 rev=2 -->
### shared.auth-users.US2-TC2: A ban, unban or erasure filing the operator may not make is refused

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
* **Trace:** shared-auth-users-US-02

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

<!-- trace:case id=g10.shared-users.TC-tlp rev=1 -->
### shared.auth-users.US2-TC3: An operator's erasure filing bans the account, taking over a request its holder filed

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
* **Trace:** shared-auth-users-US-02

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

<!-- trace:case id=g10.shared-users.TC-s18 rev=1 -->
### shared.auth-users.US2-TC4: Cancelling an operator's erasure request lifts the ban it applied

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**

* An admin holding `user:list` and `user:delete`; `<account>` was unbanned, then banned by an operator's erasure request filed under seven days ago.

**Steps:**

1. Open `<account>`, and cancel the erasure request.
2. Sign in as `<account>` in another browser.

**Expected Results:**

* Step 1: the request reads cancelled, and the account unbanned.
* Step 2 signs it in.

<!-- trace:case id=g10.shared-users.TC-k21 rev=1 -->
### shared.auth-users.US2-TC5: Cancelling an operator's erasure request leaves a ban it did not apply

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**

* An admin holding `user:list` and `user:delete`; `<account>` was banned for conduct, then an operator filed an erasure request over it, still open.

**Steps:**

1. Open `<account>`, and cancel the erasure request.
2. Sign in as `<account>` in another browser.

**Expected Results:**

* Step 1: the request reads cancelled, the account still banned.
* Step 2 starts no session.

---

## shared.auth-users.US3: Operator changes roles

**As an** admin,
**I want** to set roles on any account I can open — including my own — and to
strip my own `admin` when another admin remains, without stripping `admin`
from a peer,
**so that** ordinary grants and cooperative offboarding stay in the console and
peer lockout does not.

<!-- trace:case id=g10.shared-users.TC-g0n rev=2 -->
### shared.auth-users.US3-TC1: The roles dialog offers Grade10's roles, saves in one step, and the person's next page follows

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
* **Trace:** shared-auth-users-US-03

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

<!-- trace:case id=g10.shared-users.TC-g3z rev=2 -->
### shared.auth-users.US3-TC2: A role change the operator may not make is refused

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
* **Trace:** shared-auth-users-US-03

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

## shared.auth-users.US4: Operator finds the accounts they mean

**As an** operator who can list users,
**I want** to search by the name I was given and narrow the directory to the
accounts I mean,
**so that** I can reach one person from a ticket, and answer who holds a role,
without reading every account.

<!-- trace:case id=g10.shared-users.TC-1nn rev=2 -->
### shared.auth-users.US4-TC1: Search and filters narrow the list in the console's words, and a column orders it

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
* **Trace:** shared-auth-users-US-04

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

---

## shared.auth-users.US5: Operator creates an Auth account

**As an** operator holding `user:create`,
**I want** to create a passwordless Auth account with name, email, and roles
from the closed set for someone who has never signed in — and to be refused
when the email already exists —
**so that** access can be granted before first sign-in without loyalty enroll
or an invite mail, and a duplicate never becomes a second account.

<!-- trace:case id=g10.shared-users.TC-yx9 rev=2 -->
### shared.auth-users.US5-TC1: Create reviews the draft, then opens the new account's panel

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
* **Trace:** shared-auth-users-US-05

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

<!-- trace:case id=g10.shared-users.TC-j13 rev=3 -->
### shared.auth-users.US5-TC2: A create the form or the operator's grants refuse keeps what was typed

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
* **Trace:** shared-auth-users-US-05

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

<!-- trace:case id=g10.shared-users.TC-1gw rev=1 -->
### shared.auth-users.US5-TC8: Create is not offered without user:create

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**

* An operator holds `user:list` and `user:set-role`, not `user:create`.

**Steps:**

1. Open `<users>`, and look for Create.

**Expected Results:**

* Create is not offered.

<!-- trace:case id=g10.shared-users.TC-mqa rev=1 -->
### shared.auth-users.US5-TC9: A taken email is refused on the form and opens the existing account

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**

* An operator holding `user:list`, `user:create` and `user:set-role`; an account already holds already.there@example.com.

**Steps:**

1. Choose Create, enter a name, already.there@example.com and a role, and confirm on the form.
2. Choose the way offered to open the existing account.

**Expected Results:**

* Step 1 stays on the form with the duplicate refusal, opening no review and creating nothing.
* Step 2 opens the existing account's panel; no second account holds the email.

---

## shared.auth-users.US6: Account holder files their own request to be forgotten

**As a** person with an account,
**I want** to file the request to be forgotten from my own account's Your data
page, and to cancel it there inside the seven days,
**so that** I need not ask an operator to file it, and can change my mind
before anything is erased.

<!-- trace:case id=g10.shared-users.TC-kac rev=2 -->
### shared.auth-users.US6-TC1: Asking to be forgotten opens one seven-day window and leaves sign-in working

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
* **Trace:** shared-auth-users-US-06

**Pre-conditions:**

* customer(holds `user` only, nothing held in the vault) is on Your data, having `<history>`.

**Test data:**

| `<history>` | `<ask>` |
| --- | --- |
| never filed a request | Ask to be forgotten, confirmed |
| filed one earlier and cancelled it | Ask to be forgotten, confirmed |
| never filed a request | Ask to be forgotten, confirmed in tab A, then in tab B without reloading it |

**Steps:**

1. Make `<ask>`, and read the confirmation before it.
2. Reload Your data; sign out, and sign in again.

**Expected Results:**

* Step 1 first names the seven-day window and that it can be cancelled inside it.
* Step 2 shows one open request, filed today, maturing in seven days; sign-in works, the request not blocking it.

<!-- trace:case id=g10.shared-users.TC-ov6 rev=1 -->
### shared.auth-users.US6-TC2: The holder cancels their request inside the window, once however often they ask

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
* **Trace:** shared-auth-users-US-06

**Pre-conditions:**

* customer is on Your data, with a request they filed six days ago.

**Test data:**

| `<cancel>` |
| --- |
| cancel once |
| cancel in tab A, then in tab B without reloading it |

**Steps:**

1. `<cancel>`; reload Your data.

**Expected Results:**

* No request shows open, nothing else changed, and Ask to be forgotten is offered again.

<!-- trace:case id=g10.shared-users.TC-vwr rev=2 -->
### shared.auth-users.US6-TC4: The holder cannot cancel once the window has passed or an operator took the request over

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-06

**Pre-conditions:**

* customer is on Your data, with `<request>`.

**Test data:**

| `<request>` | `<shown>` |
| --- | --- |
| filed by the holder seven days ago | filed, the window passed, no cancel offered |
| filed by the holder, then filed over by an operator inside the window | a cancel, if selected, is refused |

**Steps:**

1. Read the request, and select cancel where offered.
2. Reload.

**Expected Results:**

* Step 1 shows `<shown>`.
* Step 2: the request is still open; a taken-over one reads filed by the operator.

---

## Settled

- An empty role selection at create leaves the account `user` only (Q13); name and email are required (Q14).
- A newly created account's email-verification standing is open on the PRD.
- A read already in flight when a ban or role change commits falls inside the 70-second bound.
- Once an operator's filing takes a holder's request over, only the run or an operator's cancel ends it; the ban that filing applied stands while it is open.
- Filing and cancelling have no limit and no cool-down, one open request at a time.
- The holder's cancel is refused from the first instant of the day an erasure may run, and the request stands until every product has erased what it holds.
