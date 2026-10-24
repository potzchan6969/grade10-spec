# shared/auth/users Test Cases

**Status:** pending-review · 0/17
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7
**Out of suite (api):** shared-auth-users-SC-43

## Background

* `<g10url>` is the Grade10 site and `<console url>` the Grade10 console of the environment under test.
* The user directory is the console's Users page; an account opens in its panel, by user id. The account holder's request to be forgotten is on `<g10url>`'s Your data page.
* A change to standing or roles shows on the affected person's next page within 70 seconds. An erasure request matures seven days after it is filed.

## Walk 1: An admin works the user directory

Starting state:

- admin(holds `user:list`, `user:ban` and `user:set-role`) on the user directory; `<subject account>` signed in on `<g10url>`.

Shared test data:

| Field | Value |
| --- | --- |
| subject account | collector@example.com, unbanned, holding `user` only |
| peer admin | another account holding `admin` |

### Route

1. Search for COLLECTOR and open `<subject account>`.
   - The account opens by its user id. `shared.auth-users.US1-TC1`
2. Narrow the directory to role `admin`.
   - Every listed account holds `admin`. `shared.auth-users.US4-TC1`
3. Give `<subject account>` `staff`, then clear it.
   - It holds `staff`, then `user` only. `shared.auth-users.US3-TC1`
4. Try to ban `<peer admin>`.
   - Refused. `shared.auth-users.US2-TC2`
5. Ban `<subject account>`, reason Account closed after a ticket.
   - Its site session ends; it stays listed, marked banned. `shared.auth-users.US2-TC1`

## Walk 2: A collector asks to be forgotten and changes their mind

Starting state:

- customer(collector) signed in on `<g10url>`, on Your data, with no request open.

Shared test data:

| Field | Value |
| --- | --- |
| collector | an account holding `user` only |

### Route

1. Select Ask to be forgotten, and confirm.
   - One open request, maturing in seven days. `shared.auth-users.US6-TC1`
2. Cancel it.
   - No request open; Ask to be forgotten offered again. `shared.auth-users.US6-TC2`

## shared.auth-users.US1: Operator lists people in the identity directory

**As an** operator who can list users,
**I want** to search and open accounts by user id,
**so that** I can find a person without seeing records I am not granted.

<!-- trace:case id=g10.shared-users.TC-oy8 rev=2 -->
### shared.auth-users.US1-TC1: An operator with the list grant searches the directory and opens an account by its user id

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

* admin(holds `user:list`) is signed in on `<console url>`; the directory holds collector@example.com, another account sharing its email attribute, and a banned account.

**Steps:**

1. Open the user directory, and search for COLLECTOR.
2. Open collector@example.com.
3. Clear the search, and find the banned account.

**Expected Results:**

* Step 1 lists this brand's accounts by user id; the search lists collector@example.com, each listed email containing collector, ignoring letter case.
* Step 2 shows its own user id, not the other account's.
* Step 3 lists the banned account, marked banned.

<!-- trace:case id=g10.shared-users.TC-caj rev=1 -->
### shared.auth-users.US1-TC2: An operator without the list grant sees no accounts

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

* staff(not holding `user:list`) is signed in on `<console url>`.

**Steps:**

1. Open the user directory.

**Expected Results:**

* The list is refused, and no account shows.

---

## shared.auth-users.US2: Operator bans and unbans an account

**As an** operator who can ban,
**I want** a ban to stop money-moving and sign-in, and an unban to restore them,
**so that** a person who must leave cannot keep acting, a mistaken ban is
reversible, and a compromised admin cannot lock peer admins out by ban.

<!-- trace:case id=g10.shared-users.TC-lde rev=2 -->
### shared.auth-users.US2-TC1: A ban stops payment and sign-in, and an unban lets the person sign in again

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

* admin(holds `user:ban`) is signed in on `<console url>`; `<subject account>`, unbanned and holding `user` only, is signed in on `<g10url>` in another browser with a product in the cart.

**Steps:**

1. Ban `<subject account>`, reason Account closed after a ticket.
2. In the other browser, start checkout; then sign in there as `<subject account>`.
3. Unban it, and sign in as it again.

**Expected Results:**

* Step 1: it stays listed, marked banned.
* Step 2: the payment does not complete and nobody is signed in; the sign-in starts no session.
* Step 3 signs it in.

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

* `<operator>` is signed in on `<console url>`; `<account>` is as the row says.

**Test data:**

| `<operator>` | `<account>` | `<act>` |
| --- | --- | --- |
| staff without `user:ban` | unbanned, holding `user` only | ban |
| admin holding `user:ban` | the admin's own | ban |
| support holding `user:ban` | holding `admin` | ban |
| admin holding `user:ban` | another account holding `admin` | ban |
| admin holding `user:delete` | holding `admin`, unbanned | file an erasure request |
| admin holding `user:ban` | unbanned, with a request to be forgotten its holder filed | ban, reason Erasure check |
| admin holding `user:ban` | banned by an operator's open erasure filing | unban |

**Steps:**

1. Open `<account>`, and do `<act>`.

**Expected Results:**

* It is refused, naming the open request where there is one; the standing and any request are as they were, and the holder signs in exactly as before.

<!-- trace:case id=g10.shared-users.TC-tlp rev=1 -->
### shared.auth-users.US2-TC3: An operator's erasure filing bans the account, taking over a request its holder filed

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
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**

* admin(holds `user:delete`) is signed in on `<console url>`; `<subject account>` is unbanned, with `<request>`.

**Test data:**

| `<request>` | `<request reads>` |
| --- | --- |
| no open erasure request | one open request, filed by the operator |
| a request its holder filed, inside the seven days | the same request, now filed by the operator |

**Steps:**

1. Open `<subject account>`, and file an erasure request.
2. Sign in as `<subject account>` in another browser.

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

* admin(holds `user:delete`) is signed in on `<console url>`; `<subject account>` was unbanned, then banned by an operator's erasure request filed under seven days ago.

**Steps:**

1. Open `<subject account>`, and cancel the erasure request.
2. Sign in as `<subject account>` in another browser.

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
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**

* admin(holds `user:delete`) is signed in on `<console url>`; `<subject account>` was banned for conduct, then an operator filed an erasure request over it, still open.

**Steps:**

1. Open `<subject account>`, and cancel the erasure request.
2. Sign in as `<subject account>` in another browser.

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
### shared.auth-users.US3-TC1: An admin sets roles on any account, their own included

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

* admin(holds `admin` and `user:set-role`) is signed in on `<console url>`; another account also holds `admin`.

**Test data:**

| `<account>` | `<roles saved>` | `<holds>` |
| --- | --- | --- |
| another, holding no `staff` | adds `staff` | `staff` |
| another, holding an operator role and no `admin` | no operator role | `user` only |
| the admin's own | `staff` and `admin` | `staff` and `admin` |
| the admin's own | without `admin` | no `admin` |

**Steps:**

1. Open `<account>`, and save `<roles saved>`.

**Expected Results:**

* It holds `<holds>`.

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

* `<operator>` is signed in on `<console url>`.

**Test data:**

| `<operator>` | `<account>` | `<change>` |
| --- | --- | --- |
| support, without `user:set-role` | another account | any role change |
| admin holding `user:set-role` | another account holding `admin` | remove `admin` |
| staff holding `user:set-role`, not `admin`, while one account alone holds `admin` | that account | remove `admin` |
| the one account holding `admin` | its own | remove `admin` |

**Steps:**

1. Open `<account>`, and try `<change>`.

**Expected Results:**

* It is refused, and the roles are as they were.

<!-- trace:case id=g10.shared-users.TC-q92 rev=2 -->
### shared.auth-users.US3-TC3: A role change shows on the person's next page within 70 seconds

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
* **Trace:** shared-auth-users-US-03

**Pre-conditions:**

* `<account>` is signed in on `<console url>` in tab A and has just opened a page; admin(holds `user:set-role`) is in tab B; another account also holds `admin`.

**Test data:**

| `<account>` | `<change>` | `<tab A shows>` |
| --- | --- | --- |
| another, holding no operator role | give it `staff` | the sections `staff` reach |
| the admin's own | remove `admin` | no longer the sections only `admin` reaches |

**Steps:**

1. In tab B, make `<change>`.
2. Within 70 seconds, open another page in tab A.

**Expected Results:**

* Tab A's navigation shows `<tab A shows>`.

---

## shared.auth-users.US4: Operator finds the accounts they mean

**As an** operator who can list users,
**I want** to search by the name I was given and narrow the directory to the
accounts I mean,
**so that** I can reach one person from a ticket, and answer who holds a role,
without reading every account.

<!-- trace:case id=g10.shared-users.TC-1nn rev=2 -->
### shared.auth-users.US4-TC1: The directory finds a name in any case, narrows to the accounts asked for, and lists in the order chosen

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
* **Trace:** shared-auth-users-US-04

**Pre-conditions:**

* admin(holds `user:list`) is on the user directory; it holds Alex Collector (collector@example.com), an `admin`, a `staff`, a `user`-only account, and banned and unbanned `support` accounts, joined on different days.

**Test data:**

| `<asked>` | `<listed>` | `<not listed>` |
| --- | --- | --- |
| search ALEX | Alex Collector | accounts whose name lacks Alex |
| role `admin` | accounts holding `admin` | the `user`-only account |
| Type Elevated | accounts holding any elevated role | the `user`-only account |
| the user population | accounts with no elevated role | the `admin` account |
| banned, and role `support` | banned `support` accounts | the unbanned `support` account |
| ordered by joined, oldest first | the oldest account first | none left out |
| that order cleared | the newest account first | none left out |

**Steps:**

1. Apply `<asked>`.

**Expected Results:**

* It lists `<listed>`, and not `<not listed>`.

---

## shared.auth-users.US5: Operator creates an Auth account

**As an** operator holding `user:create`,
**I want** to create a passwordless Auth account with name, email, and roles
from the closed set for someone who has never signed in — and to be refused
when the email already exists —
**so that** access can be granted before first sign-in without loyalty enroll
or an invite mail, and a duplicate never becomes a second account.

<!-- trace:case id=g10.shared-users.TC-yx9 rev=2 -->
### shared.auth-users.US5-TC1: An operator creates a passwordless account with the roles their grants allow, sending nothing

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

* `<operator>`, also holding `loyalty:read`, is signed in on `<console url>`; no account holds `<email>`, an inbox the tester reads.

**Test data:**

| `<operator>` | `<name>` | `<email>` | `<roles>` | `<holds>` |
| --- | --- | --- | --- | --- |
| holds `user:create` and `user:set-role` | Ada Operator | ada.operator+run@example.com | `admin` | `admin` |
| holds `user:create` only | Pat Collector | pat.collector+run@example.com | `user` | `user` only |
| holds `user:create` only | No Role Pick | no.role+run@example.com | none | `user` only |

**Steps:**

1. Select Create on the user directory, enter `<name>` and `<email>`, choose `<roles>`, submit and confirm.
2. Open the new account.
3. Open `<email>`'s inbox, and search the loyalty Members page for it.

**Expected Results:**

* Step 1 asks for no password, and creates one account.
* Step 2 shows `<name>` and `<holds>`.
* Step 3: no invite or sign-in mail from the create, and no loyalty member or opening points.

<!-- trace:case id=g10.shared-users.TC-j13 rev=3 -->
### shared.auth-users.US5-TC2: A create the operator may not make is refused, keeping the form

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
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**

* `<operator>`, also holding `user:list`, is signed in on `<console url>`.

**Test data:**

| `<operator>` | `<name>` | `<email>` | `<role>` |
| --- | --- | --- | --- |
| holds `user:set-role`, not `user:create` | No Create | no.create@example.com, held by no account | `user` |
| holds `user:create`, not `user:set-role` | Almost Staff | almost.staff@example.com, held by no account | `staff` |
| holds `user:create`, not `user:set-role` | Almost Admin | almost.admin@example.com, held by no account | `admin` |
| holds `user:create` and `user:set-role` | Second Taker | the email of an account that has signed in | `user` |
| holds `user:create` | nothing | nobody.named@example.com | `user` |
| holds `user:create` | No At | no.at.example.com | `user` |
| holds `user:create` | Long Address | a 255-character address | `user` |

**Steps:**

1. Select Create, enter `<name>` and `<email>`, choose `<role>`, and submit.
2. Search the directory for `<email>`.

**Expected Results:**

* Step 1 is refused, keeping what was typed.
* Step 2 lists no new account; an email already held still has exactly one.

---

## shared.auth-users.US6: Account holder files their own request to be forgotten

**As a** person with an account,
**I want** to file the request to be forgotten from my own account's Your data
page, and to cancel it there inside the seven days,
**so that** I need not ask an operator to file it, and can change my mind
before anything is erased.

<!-- trace:case id=g10.shared-users.TC-kac rev=2 -->
### shared.auth-users.US6-TC1: The holder files a request, opening a seven-day window and leaving sign-in working

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

* customer(holds `user` only) is on Your data on `<g10url>`, having `<history>`.

**Test data:**

| `<history>` |
| --- |
| never filed a request |
| filed one earlier and cancelled it |

**Steps:**

1. Select Ask to be forgotten, and confirm.
2. Sign out, and sign in again.

**Expected Results:**

* Step 1 first names the seven-day window and that it can be cancelled inside it; then one open request, filed today, maturing in seven days.
* Step 2 signs in; the open request does not block it.

<!-- trace:case id=g10.shared-users.TC-ov6 rev=1 -->
### shared.auth-users.US6-TC2: The holder cancels the request inside the window

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

* customer is on Your data on `<g10url>`, with a request they filed six days ago.

**Steps:**

1. Cancel the request.

**Expected Results:**

* No request shows open, and Ask to be forgotten is offered again.

<!-- trace:case id=g10.shared-users.TC-z1x rev=2 -->
### shared.auth-users.US6-TC3: Asking or cancelling twice counts once

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
* **Trace:** shared-auth-users-US-06

**Pre-conditions:**

* customer has Your data open on `<g10url>` in tabs A and B, with `<state>`.

**Test data:**

| `<state>` | `<act>` | `<afterwards>` |
| --- | --- | --- |
| no request open | file the request | one open request, maturing on tab A's date |
| one request open | cancel it | no request open, nothing else changed |

**Steps:**

1. Do `<act>` in tab A, then in tab B without reloading it.
2. Reload tab B.

**Expected Results:**

* Step 2 shows `<afterwards>`.

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

* customer is on Your data on `<g10url>`, with `<request>`.

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

## Settled

- An empty role selection at create leaves the account `user` only (Q13); name and email are required (Q14).
- A newly created account's email-verification standing is open on the PRD.
- A read already in flight when a ban or role change commits falls inside the 70-second bound.
- Once an operator's filing takes a holder's request over, only the run or an operator's cancel ends it; the ban that filing applied stands while it is open.
- Filing and cancelling have no limit and no cool-down, one open request at a time.
- The holder's cancel is refused from the first instant of the day an erasure may run, and the request stands until every product has erased what it holds.

## Reconciliation

- **Covered at domain** - `shared.auth-dmn.US3-TC1` walks a ban stopping sign-in, landing on the trail, and an unban giving it back; `shared.auth-dmn.US5-TC1` walks a saved role deciding the person's next action
