# shared/auth/users Test Cases

**Status:** pending-review · 0/20
**Drafts styled:** 2026-10-24, tcs-rules r7
**Reviewed:** 2026-10-23, tcs-rules r7, lapsed 2026-10-24
**Out of suite (api):** shared-auth-users-SC-43

## Background

* `<g10url>` is the Grade10 site and `<console url>` the Grade10 console of the environment under test.
* The user directory is the console's Users page; an account opens in its panel, by user id. The account holder's request to be forgotten is on `<g10url>`'s Your data page.
* A change to standing or roles shows on the affected person's next page within 70 seconds.

## Walk 1: An admin works the user directory

**Starting state:**

- admin(holds `user:list`, `user:ban` and `user:set-role`) signed in on `<console url>`, on the user directory

**Shared test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | `collector@example.com`, unbanned, holding `user` only, signed in on `<g10url>` |
| `<peer admin>` | another account holding `admin` |

### Route

1. Search for `COLLECTOR` and open `<subject account>`.
   - The account opens by its user id `shared.auth-users.US1-TC1`
2. Narrow the directory to accounts that hold `admin`.
   - Every listed account holds `admin` `shared.auth-users.US4-TC2`
3. Give `<subject account>` the role `staff`, then clear it again.
   - The account holds `staff`, then `user` only `shared.auth-users.US3-TC1`
4. Try to ban `<peer admin>`.
   - The ban is refused `shared.auth-users.US2-TC2`
5. Ban `<subject account>` with reason `Account closed after a ticket`.
   - Its store session ends and it stays listed, marked banned `shared.auth-users.US2-TC1`

## Walk 2: A collector asks to be forgotten and changes their mind

**Starting state:**

- customer(collector) signed in on `<g10url>`, on the Your data page, with no request open

### Route

1. Select Ask to be forgotten and confirm.
   - One open request, maturing in seven days `shared.auth-users.US6-TC1`
2. Cancel the request.
   - It no longer shows open, and Ask to be forgotten is offered again `shared.auth-users.US6-TC2`

## shared.auth-users.US1: Operator lists people in the identity directory

**As an** operator who can list users,
**I want** to search and open accounts by user id,
**so that** I can find a person without seeing records I am not granted.

<!-- trace:case id=g10.shared-users.TC-oy8 rev=2 -->
### shared.auth-users.US1-TC1: An operator with the list grant searches the directory and opens an account by user id

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

* admin(holds `user:list`) is signed in on `<console url>`.
* The directory holds `<subject account>`, an `<other account>` sharing its email attribute, and a banned account.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | `collector@example.com` |
| `<other account>` | a different account sharing an email attribute with `<subject account>` |

**Steps:**

1. Open the user directory.
2. Search for `COLLECTOR`.
3. Open `<subject account>`.
4. Clear the search and find the banned account.

**Expected Results:**

* Step 1 lists this brand's accounts, each named by user id.
* Step 2 lists `<subject account>`, and every listed email contains `collector`, ignoring letter case.
* Step 3 shows `<subject account>`'s user id, not `<other account>`.
* Step 4 lists the banned account, marked banned.

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

* staff(does not hold `user:list`) is signed in on `<console url>`.

**Steps:**

1. Open the user directory.

**Expected Results:**

* The directory refuses the list, and no account is shown.

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
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**

* admin(holds `user:ban`) is signed in on `<console url>`.
* `<subject account>` is unbanned, signed in on `<g10url>` in another browser, with a product in the cart.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | an unbanned account holding `user` only |

**Steps:**

1. Ban `<subject account>` with reason `Account closed after a ticket`.
2. In the other browser, start checkout.
3. Sign in there as `<subject account>`.
4. Unban `<subject account>`, then sign in as `<subject account>` again.

**Expected Results:**

* Step 1: `<subject account>` stays listed, marked banned.
* Step 2: the payment does not complete, and the site shows nobody signed in.
* Step 3: no session starts.
* Step 4: `<subject account>` is signed in.

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

* The row's operator is signed in on `<console url>`.
* The row's account is in the row's state.

**Test data:**

| Operator | Account | Act |
| --- | --- | --- |
| staff without `user:ban` | unbanned, holding `user` only | ban |
| admin holding `user:ban` | the admin's own | ban |
| support holding `user:ban` | holding `admin` | ban |
| admin holding `user:ban` | another account holding `admin` | ban |
| admin holding `user:delete` | holding `admin`, unbanned | file an erasure request |
| admin holding `user:ban` | unbanned, with a request to be forgotten its holder filed | ban, reason `Erasure check` |
| admin holding `user:ban` | banned by an operator's open erasure filing | unban |

**Steps:**

1. Open the row's account and do the row's act.

**Expected Results:**

* The act is refused, naming the open request where there is one.
* The account's standing, and any request, are as they were, and the account holder can sign in exactly as before.

<!-- trace:case id=g10.shared-users.TC-tlp rev=1 -->
### shared.auth-users.US2-TC3: An operator's erasure filing bans the account

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

* admin(holds `user:delete`) is signed in on `<console url>`.
* `<subject account>` is unbanned, with no open erasure request.

**Steps:**

1. Open `<subject account>` and file an erasure request.
2. Sign in as `<subject account>` in another browser.

**Expected Results:**

* Step 1: one open erasure request stands for `<subject account>`, and it reads banned.
* Step 2: no session starts.

<!-- trace:case id=g10.shared-users.TC-s18 rev=1 -->
### shared.auth-users.US2-TC4: Cancelling an operator's erasure request lifts the ban it applied

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**

* admin(holds `user:delete`) is signed in on `<console url>`.
* `<subject account>` was unbanned, then banned by an operator's erasure request filed less than seven days ago.

**Steps:**

1. Open `<subject account>` and cancel the erasure request.
2. Sign in as `<subject account>` in another browser.

**Expected Results:**

* Step 1: the request reads cancelled, and the account unbanned.
* Step 2: `<subject account>` is signed in.

<!-- trace:case id=g10.shared-users.TC-k21 rev=1 -->
### shared.auth-users.US2-TC5: Cancelling an operator's erasure request leaves a ban it did not apply

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**

* admin(holds `user:delete`) is signed in on `<console url>`.
* `<subject account>` was banned for conduct, then an operator filed an erasure request over it, still open.

**Steps:**

1. Open `<subject account>` and cancel the erasure request.
2. Sign in as `<subject account>` in another browser.

**Expected Results:**

* Step 1: the request reads cancelled, and the account still banned.
* Step 2: no session starts.

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
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-03

**Pre-conditions:**

* admin(holds `admin` and `user:set-role`) is signed in on `<console url>`; another account also holds `admin`.

**Test data:**

| Account | Roles saved | Holds afterwards |
| --- | --- | --- |
| another, holding no `staff` | adds `staff` | `staff` |
| another, holding an operator role and no `admin` | no operator role | `user` only |
| the admin's own | `staff` and `admin` | `staff` and `admin` |
| the admin's own | without `admin` | no `admin` |

**Steps:**

1. Open the row's account and save the row's roles.

**Expected Results:**

* The account holds the row's roles.

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

* The row's operator is signed in on `<console url>`.

**Test data:**

| Operator | Account | Change |
| --- | --- | --- |
| support, without `user:set-role` | another account | any role change |
| admin holding `user:set-role` | another account holding `admin` | remove `admin` |
| staff holding `user:set-role`, not `admin`, while one account alone holds `admin` | that account | remove `admin` |
| the one account holding `admin` | its own | remove `admin` |

**Steps:**

1. Open the row's account and try the row's change.

**Expected Results:**

* The change is refused, and the account's roles are as they were.

<!-- trace:case id=g10.shared-users.TC-q92 rev=2 -->
### shared.auth-users.US3-TC3: A role change shows on the person's next page within 70 seconds

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
* **Trace:** shared-auth-users-US-03

**Pre-conditions:**

* The row's account is signed in on `<console url>` in tab A, and has just opened a page there.
* admin(holds `user:set-role`) is signed in on `<console url>` in tab B; another account also holds `admin`.

**Test data:**

| Account | Change | Tab A afterwards |
| --- | --- | --- |
| another, holding no operator role | give it `staff` | the navigation shows the sections `staff` reach |
| the admin's own | remove `admin` | the navigation no longer shows the sections only `admin` reaches |

**Steps:**

1. In tab B, make the row's change.
2. Within 70 seconds, open another page in tab A.

**Expected Results:**

* Step 2: the row's outcome.

---

## shared.auth-users.US4: Operator finds the accounts they mean

**As an** operator who can list users,
**I want** to search by the name I was given and narrow the directory to the
accounts I mean,
**so that** I can reach one person from a ticket, and answer who holds a role,
without reading every account.

<!-- trace:case id=g10.shared-users.TC-axp rev=1 -->
### shared.auth-users.US4-TC1: A search matches a name without letter case

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

* admin(holds `user:list`) is signed in on `<console url>`.
* The directory holds an account named `Alex Collector`, whose email `collector@example.com` does not contain the name.

**Steps:**

1. Search the user directory for `ALEX`.

**Expected Results:**

* The account named `Alex Collector` is listed.

<!-- trace:case id=g10.shared-users.TC-1nn rev=2 -->
### shared.auth-users.US4-TC2: The directory narrows to the accounts asked for

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

* admin(holds `user:list`) is signed in on `<console url>`.
* The directory holds an account holding `admin`, one holding `staff`, one holding `user` only, and banned and unbanned accounts holding `support`.

**Test data:**

| Narrowed to | Listed | Not listed |
| --- | --- | --- |
| role `admin` | accounts holding `admin` | the `user`-only account |
| Type Elevated | accounts holding any elevated role | the `user`-only account |
| the user population | accounts holding no elevated role | the `admin` account |
| banned, and role `support` | banned accounts holding `support` | the unbanned `support` account |

**Steps:**

1. Open the user directory and narrow it as the row says.

**Expected Results:**

* Only the row's listed accounts show; the row's not-listed account is absent.

<!-- trace:case id=g10.shared-users.TC-xq6 rev=2 -->
### shared.auth-users.US4-TC3: The directory lists in the order chosen, newest first when none is

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-04

**Pre-conditions:**

* admin(holds `user:list`) is signed in on `<console url>`.
* The directory holds accounts that joined on different days.

**Steps:**

1. Order the user directory by when the account joined, oldest first.
2. Clear the order.

**Expected Results:**

* Step 1 lists the oldest account first.
* Step 2 lists the newest account first.

---

## shared.auth-users.US5: Operator creates an Auth account

**As an** operator holding `user:create`,
**I want** to create a passwordless Auth account with name, email, and roles
from the closed set for someone who has never signed in — and to be refused
when the email already exists —
**so that** access can be granted before first sign-in without loyalty enroll
or an invite mail, and a duplicate never becomes a second account.

<!-- trace:case id=g10.shared-users.TC-yx9 rev=2 -->
### shared.auth-users.US5-TC1: An operator creates a passwordless account with the roles their grants allow

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**

* The row's operator, also holding `loyalty:read`, is signed in on `<console url>`.
* No account holds the row's email; its inbox is one the tester reads.

**Test data:**

| Operator | Name | Email | Roles chosen | Holds afterwards |
| --- | --- | --- | --- | --- |
| holds `user:create` and `user:set-role` | Ada Operator | `ada.operator+<run>@example.com` | `admin` | `admin` |
| holds `user:create` only | Pat Collector | `pat.collector+<run>@example.com` | `user` | `user` only |
| holds `user:create` only | No Role Pick | `no.role+<run>@example.com` | none | `user` only |

**Steps:**

1. On the user directory, select Create, enter the row's name and email, choose the row's roles, submit and confirm.
2. Open the new account.
3. Open the email's inbox, then search the loyalty Members page for the email.

**Expected Results:**

* Step 1 asks for no password and creates one account.
* Step 2 shows the row's name and roles.
* Step 3: no invite or sign-in mail from the create, and no loyalty member or opening points.

<!-- trace:case id=g10.shared-users.TC-j13 rev=3 -->
### shared.auth-users.US5-TC2: A create the operator may not make is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**

* The row's operator, also holding `user:list`, is signed in on `<console url>`.

**Test data:**

| Operator | Name | Email | Role |
| --- | --- | --- | --- |
| holds `user:set-role`, not `user:create` | No Create | `no.create@example.com`, held by no account | `user` |
| holds `user:create`, not `user:set-role` | Almost Staff | `almost.staff@example.com`, held by no account | `staff` |
| holds `user:create`, not `user:set-role` | Almost Admin | `almost.admin@example.com`, held by no account | `admin` |
| holds `user:create` and `user:set-role` | Second Taker | the email of an account that has signed in | `user` |
| holds `user:create` | nothing | `nobody.named@example.com` | `user` |
| holds `user:create` | No At | `no.at.example.com` | `user` |
| holds `user:create` | Long Address | a 255-character address | `user` |

**Steps:**

1. On the user directory, select Create, enter the row's name and email, choose the row's role and submit.
2. Search the directory for the row's email.

**Expected Results:**

* Step 1 is refused, and what was typed stays in the form.
* Step 2 lists no new account; an email already held still has exactly one.

---

## shared.auth-users.US6: Account holder files their own request to be forgotten

**As a** person with an account,
**I want** to file the request to be forgotten from my own account's Your data
page, and to cancel it there inside the seven days,
**so that** I need not ask an operator to file it, and can change my mind
before anything is erased.

<!-- trace:case id=g10.shared-users.TC-kac rev=2 -->
### shared.auth-users.US6-TC1: The account holder files a request, which opens a seven-day window and leaves sign-in working

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-06

**Pre-conditions:**

* customer(holds `user` only) is signed in on `<g10url>`, on the Your data page, with the row's history.

**Test data:**

| History |
| --- |
| never filed a request |
| filed one earlier and cancelled it |

**Steps:**

1. Select Ask to be forgotten.
2. Confirm the request.
3. Sign out, then sign in again.

**Expected Results:**

* Step 1: a confirmation names the seven-day window and that the request can be cancelled inside it.
* Step 2: one open request, filed today, maturing in seven days.
* Step 3: signed in; the open request does not block it.

<!-- trace:case id=g10.shared-users.TC-ov6 rev=1 -->
### shared.auth-users.US6-TC2: The account holder cancels the request inside the window

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

* customer is signed in on `<g10url>`, on the Your data page, with a request they filed six days ago, so the day an erasure may run has not opened.

**Steps:**

1. Cancel the request.

**Expected Results:**

* The request no longer shows as open, and Ask to be forgotten is offered again.

<!-- trace:case id=g10.shared-users.TC-z1x rev=2 -->
### shared.auth-users.US6-TC3: Asking twice is asking once

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-06

**Pre-conditions:**

* customer is signed in on `<g10url>`, with the Your data page open in tabs A and B, in the row's state.

**Test data:**

| State | In tab A | Then in tab B, not reloaded | Afterwards |
| --- | --- | --- | --- |
| no request open | file the request | file the request | one open request, maturing on tab A's date |
| one request open | cancel it | cancel it | no request open, and nothing else changes |

**Steps:**

1. Do the row's act in tab A.
2. Do the row's act in tab B.
3. Reload tab B.

**Expected Results:**

* Step 3: the row's outcome.

<!-- trace:case id=g10.shared-users.TC-vwr rev=2 -->
### shared.auth-users.US6-TC4: The account holder cannot cancel once the window has passed or an operator took the request over

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
* **Trace:** shared-auth-users-US-06

**Pre-conditions:**

* customer is signed in on `<g10url>`, on the Your data page, with the row's request.

**Test data:**

| Request | Shown |
| --- | --- |
| filed by the holder seven days ago, so today an erasure may run | the request reads filed, the window passed, and no cancel is offered |
| filed by the holder, then an operator filed over it, inside the window | a cancel, if selected, is refused |

**Steps:**

1. Read the request, and select cancel where it is offered.
2. Reload the page.

**Expected Results:**

* Step 1: the row's outcome.
* Step 2: the request is still open; a taken-over one reads filed by the operator.

<!-- trace:case id=g10.shared-users.TC-o0n rev=1 -->
### shared.auth-users.US6-TC5: An operator's filing over the holder's request bans the account and takes the request over

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-06

**Pre-conditions:**

* `<subject account>` holds a request it filed itself, inside the seven-day window.
* admin(holds `user:delete`) is signed in on `<console url>`.

**Steps:**

1. Open `<subject account>` and file an erasure request.
2. Sign in as `<subject account>` on `<g10url>`.

**Expected Results:**

* Step 1: the request reads filed by the operator, and the account banned.
* Step 2: no session starts.

## Settled

- Empty role selection at create leaves the account as `user` only (Q13).
- Name and email are required on create (Q14).
- Email-verification standing of a newly created account is open on the PRD.
- A read already in flight when a ban or role change commits needs no rule of its own - the requirement is a 70-second bound, and such a read falls inside it.
- Which endpoints are cached browse reads and which are elevated calls is the implementation's mapping, not a suite question.
- Per-session versus per-account cache-version keying changes no case's expected result here.
- Once an operator's filing takes a self-filed request over, the request is the shop's: the account holder's own cancel is refused, and only the run or an operator's cancel ends it. No standing changes while an erasure request is open, so the ban that filing applied stands and the person does not reach their own data page.
- There is neither a limit nor a cool-down on filing and cancelling: a person may ask and change their mind as often as they like, one open request at a time.
- The cancel is refused from the first instant of the day an erasure may run, and the request stands until every product has erased what it holds. The guard that holds it to that day is the tech design's, raised there for engineering.

## Reconciliation

- **Assumed** - an email address has one `@`, a domain containing a `.`, and at most 254 characters; after a refused submit, what was typed stays (Common Rules). They ride on `shared.auth-users.US5-TC2`

**Run:** Blind pass read Purpose, Feature set, user-journeys.md, decisions.md (Raised included), the linked Users · Ban and Unban / Role Changes PRD sections, this suite for id continuity, and `shared/auth/domain-tcs.md` for id continuity, all with Reconciliation/Requirements stripped. Denied: every Requirements section, openspec/specs/ beyond Purpose, Feature set and the domain suite, openspec/changes/archive/. (Change: `close-revoked-session-cache-gap`.)

**Raised, folded into spec**

- The in-flight-read boundary - first folded into both requirements as "the next read that starts after", then replaced by the 70-second bound.

**Raised, rejected**

- Which endpoints count as cached versus elevated — tech-design's job, not a suite question.
- Per-session versus per-user invalidation keying - does not change any case's observable expected result here.

**Raised, landed as decisions**

- Empty role selection — Q13.
- Name and email required — Q14.
- The in-flight-read boundary - `close-revoked-session-cache-gap` decisions.md Q4, superseded by Q5.

**Uncovered anchors**

- All scenarios under Account create / US-05 covered by US5-TC1 through TC7.
- Cross-account isolation on ban and role change (an admin action on one account must not touch another account's cache) is not observable through a black-box signed-in/permissions read. **Out of suite:** the per-user cache-version helper's own unit test in grade10.
- The 70-second bound at a location other than the one the ban or role change was made at is not observable on a single-location stack, where the change reaches the next read at once. **Out of suite:** grade10's cache-version settling-window unit test and the auth worker's before/after-race regression test.
- All other scenarios under Ban and unban / US-02 and Role changes / US-03, the 70-second closing and reflecting included, are covered by `US2-TC1-1` through `US2-TC7-1` and `US3-TC1-1` through `US3-TC7-1` above.

**Verdicts (@sean, quick pass in chat, not a full `/tcs-review`)**

- `US2-TC7-1` — Retired (`deprecated`), on writing its Playwright walk: `US2-TC1-1`'s own cached-read assertion (`store.page`'s pre-ban session, read with no `fresh` flag) already proves the same close once its `test.fail` placeholder for the then-unfixed cache is removed. A Case That Already Exists Is Not Written Twice.
- `US3-TC7-1` — Approved (`actual`).

**Run:** the blind pass read this capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md` and `decisions.md` with its `## Raised` table, `ui-design.md` with the state dispositions stripped, and the PRD sections the proposal links. It was denied every `## Requirements` section, `openspec/specs/` and `openspec/changes/archive/` entirely, and `tech-design.md`. Fourteen cases came back over two journeys; the scenario pass issued a range of scenarios, a range of scenarios.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `shared-auth-users-US2-TC1-1` to `shared-auth-users-US2-TC7-1` | Carried | ban and unban behaviour the durable spec already states and this delta does not touch; the cases came across with the journey as the durable suite words them, and the erasure cases take the ids after them |
| `shared-auth-users-US6-TC1-1` | Joined | its scenario |
| `shared-auth-users-US6-TC2-1` | Joined | its scenario |
| `shared-auth-users-US6-TC3-1` | Joined | its scenario |
| `shared-auth-users-US6-TC4-1` | Joined | its scenario |
| `shared-auth-users-US6-TC5-1` | Joined | its scenario |
| `shared-auth-users-US6-TC6-1` | Joined | its scenario |
| `shared-auth-users-US6-TC7-1` | Joined | its scenario; the cancel is refused from the first instant of the day an erasure may run and the request stays open, which the author confirmed as Q50 |
| `shared-auth-users-US6-TC8-1` | Joined | its scenario; the take-over keeps the day an erasure may run, confirmed as Q51 |
| Raised: what the account holder sees once a filing takes their request over | Escalated, then folded, then corrected | settled as Q48 and Q65: the request is the shop's from the take-over on, and the account holder's own cancel is refused. Folded as its scenario. The first fold read the page after a lifted ban, which nothing reaches: no standing changes while an erasure request is open. its scenario now sends the own cancel instead, walked by `shared-auth-users-US6-TC9-2`, the case's version bumped because the requirement changed what it verifies |
| Raised: a limit or a cool-down on file-then-cancel cycles | Escalated, then settled | settled as Q49: there is neither. No scenario beyond the one that already lets a new request be filed once none is open |
| Raised: the maturity guard behind the cancel | Deferred | the behaviour stands in its scenario; the mechanism that enforces it is the tech design's cancel binding, raised for engineering in `decisions.md` |
| its scenario | Case added | `shared-auth-users-US6-TC10-1`, tracing `Erasure requests`, the group the scenario serves, so the group anchor is walked |
| its scenario | Case added | `shared-auth-users-US2-TC8-1` |
| its scenario | Case added | `shared-auth-users-US2-TC9-1` |
| its scenario | Case added | `shared-auth-users-US2-TC10-1` |
| its scenario | Folded, then walked | an erasure filed over an account that holds `admin` is refused by name, as a direct ban of one is, settled as Q52; walked by `shared-auth-users-US2-TC11-1` |
| its scenario | Written for a shipped rule, case added | The vault walk found auth refusing a ban or an unban by name while an erasure request is open, with only the console's hidden buttons in any spec. The rule now stands in `An operator's erasure request bans the account`, and `shared-auth-users-US2-TC12-2` walks it, a row per filer |
| Design: Ask available, Ask confirmation, Ask filed, Ask cancelled, Window passed | Closed on the row | `ui-design.md` under Your data now names the scenarios these states prove, beside the vault scenarios that state what the same rows render |

### Manual

| Manual | Why |
| --- | --- |
| `shared-auth-users-US6-TC1-1` | a person reads the confirmation: that it names the seven days and says the ask can be cancelled inside them |
| `shared-auth-users-US6-TC2-1` | a person signs in while their own request is open, through the method they would really use |
| `shared-auth-users-US6-TC3-1` | a person reads the page back to Ask available after the cancel |
| `shared-auth-users-US6-TC4-1` | a person walks the page from cancelled to a fresh ask |
| `shared-auth-users-US6-TC5-1` | a person asks a second time from the page and reads the same request back |
| `shared-auth-users-US6-TC7-1` | a person reads the window as passed and finds no cancel offered |
| `shared-auth-users-US6-TC8-1` | a person tries to sign in after the shop's filing takes the request over |

- **Joined under tcs-rules r7** - `shared-auth-users-US5-TC4-1` became the elevated-role rows of `shared-auth-users-US5-TC3-2`, and `shared-auth-users-US5-TC7-1` the empty-roles row of `shared-auth-users-US5-TC2-2`; their API calls became the create the console offers.
