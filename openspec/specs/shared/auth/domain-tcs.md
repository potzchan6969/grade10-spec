# shared/auth Cross-Feature E2E Test Cases

**Status:** pending-review · 0/8
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* `<g10url>` is the Grade10 site, `<zzz url>` the ZZZ site and `<console url>` the Grade10 console of the environment under test.
* The audit trail is the console's identity audit trail page; every entry names people by user id. A revoke or ban reaches the person's next page within 70 seconds.
* `<collector account>` holds `user` only, and its inbox is one the tester reads.

## shared.auth-dmn.US1: Collector signs in by link and every surface names them until they sign out

**As a** collector,
**I want** the link I follow to sign me in, every surface of the brand to know it is me, and sign-out to leave me signed out,
**so that** one sign-in carries me through the brand and one sign-out ends it.

<!-- trace:case id=g10.auth-domain.TC-abj rev=2 -->
### shared.auth-dmn.US1-TC1: A link sign-in names the collector on every page until they sign out

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01, shared-auth-session-US-01, shared-auth-sign-out-US-01

**Pre-conditions:**

* customer is signed out on `<g10url>`, with an unused sign-in link for `<collector account>` in its inbox.

**Steps:**

1. Follow the link.
2. Open `<g10url>/profile`.
3. Select sign out and wait for it to finish; reload.

**Expected Results:**

* Step 1 signs the collector in.
* Step 2 shows the account's name and email.
* Step 3 leaves the signed-in page, and the name shows nowhere, before and after the reload.

---

## shared.auth-dmn.US2: Collector's one sign-in covers this brand and goes nowhere else

**As a** collector,
**I want** one sign-in to carry across the brand's site I signed in on, not to another brand, and not to a location off the brand,
**so that** I sign in once here and am never delivered somewhere I did not ask for.

<!-- trace:case id=g10.auth-domain.TC-64p rev=2 -->
### shared.auth-dmn.US2-TC1: A sign-in on the store covers the auction and reaches no other brand

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01, shared-auth-session-US-02

**Pre-conditions:**

* customer is signed out on every brand, with an unused sign-in link for `<collector account>`, asked for on the store.

**Steps:**

1. Follow the link, then open the auction on `<g10url>`.
2. Open `<zzz url>`.

**Expected Results:**

* Step 1 shows the collector's name and email on the auction, with no second sign-in.
* Step 2 shows nobody signed in.

---

## shared.auth-dmn.US3: Operator bans an account and the person stops getting in

**As an** operator who can ban,
**I want** a ban to end the person's way in and to be on the identity trail, and an unban to give it back,
**so that** a person who must leave cannot sign in, and a mistaken ban is reversible and accounted for.

<!-- trace:case id=g10.auth-domain.TC-qew rev=2 -->
### shared.auth-dmn.US3-TC1: A ban stops the person's sign-in and is on the trail, and an unban gives it back

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-02, shared-auth-sign-in-US-01, shared-auth-audit-US-01

**Pre-conditions:**

* admin(holds `user:ban` and `audit:read`) is signed in on `<console url>`; `<collector account>` is unbanned, with an unused sign-in link in its inbox.

**Steps:**

1. Ban `<collector account>` from the user directory, reason Chargeback dispute open.
2. In another browser, follow the link.
3. Filter the audit trail by `<collector account>`'s user id.
4. Unban it; in the other browser, ask for a new link on `<g10url>` and follow it.

**Expected Results:**

* Step 2 does not sign the person in, and the link says the account cannot sign in.
* Step 3 lists the ban with its reason, naming the admin and the account by user id.
* Step 4 signs the person in.

---

## shared.auth-dmn.US4: Operator ends a session and the device stops being that person

**As an** operator who can revoke,
**I want** a revoked session to report nobody and the revoke to be on the trail,
**so that** a stolen device is out, and a revoke that cannot be recorded does not happen at all.

<!-- trace:case id=g10.auth-domain.TC-3wq rev=2 -->
### shared.auth-dmn.US4-TC1: A revoked session stops being the person within 70 seconds, and only the revoke is on the trail

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-01, shared-auth-sessions-US-02, shared-auth-session-US-01, shared-auth-audit-US-01

**Pre-conditions:**

* admin(holds `session:list`, `session:revoke` and `audit:read`) is signed in on `<console url>`; `<collector account>` is signed in on `<g10url>` in one other browser only.

**Steps:**

1. Open `<collector account>`'s Sessions page; filter the trail by the admin's user id.
2. Revoke the session, wait 70 seconds, and open a page in the other browser.
3. Filter the trail by `<collector account>`'s user id.

**Expected Results:**

* Step 1 lists the session with no secret, and the trail holds no entry for the listing.
* Step 2 shows nobody signed in.
* Step 3 lists the revoke, naming the admin and the account.

---

## shared.auth-dmn.US5: Admin changes a person's roles and the new grants decide what they may do

**As an** admin,
**I want** the roles I save on another account to be what that person's next action is checked against, and the change to be on the trail,
**so that** a grant takes effect where it is used and can be traced back to me.

<!-- trace:case id=g10.auth-domain.TC-a7t rev=2 -->
### shared.auth-dmn.US5-TC1: A saved staff role is what the person's next action is checked against

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-03, shared-auth-roles-US-02, shared-auth-audit-US-01

**Pre-conditions:**

* admin(holds `user:set-role` and `audit:read`) is signed in on `<console url>`; `<operator account>` holds `user` only and is signed in on `<console url>` in another browser.

**Steps:**

1. Give `<operator account>` `staff` in the user directory, and save.
2. As `<operator account>`, operate the auction catalogue, then open the user directory and try to ban an account.
3. As the admin, filter the trail by `<operator account>`'s user id.

**Expected Results:**

* Step 2 saves the catalogue change; the directory lists no accounts and the ban is refused.
* Step 3 lists the role change, naming the admin and `<operator account>` by user id.

---

## shared.auth-dmn.US6: Support's narrower grants are refused across the console and the refusal is kept

**As an** operator whose role is support,
**I want** the moves my role does not grant to be refused wherever I try them, and the refusal recorded,
**so that** a narrower role cannot be widened by picking a different screen.

<!-- trace:case id=g10.auth-domain.TC-rub rev=2 -->
### shared.auth-dmn.US6-TC1: Support is refused on an admin's account and on roles, and the refused ban is kept

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-02, shared-auth-users-US-02, shared-auth-sessions-US-01, shared-auth-audit-US-01

**Pre-conditions:**

* support is signed in on `<console url>`; `<admin account>` holds `admin`, unbanned, with one session; `<collector account>` holds `user` only.

**Steps:**

1. Open `<admin account>`'s Sessions page, then try to ban it.
2. Try to change `<collector account>`'s roles.
3. As admin(holds `audit:read`), filter the trail by `<admin account>`'s user id.

**Expected Results:**

* Step 1 lists no session, and the ban is refused; `<admin account>` stays unbanned.
* Step 2 is refused; the roles are as they were.
* Step 3 lists the ban, marked not succeeded.

---

## shared.auth-dmn.US7: Collector follows a link in one tab and the tab they left carries on

**As a** collector,
**I want** the tab I asked from to sign me in and finish what it stopped me doing once I follow the link elsewhere,
**so that** one sign-in finishes the thing I was in the middle of, on every tab of the brand.

<!-- trace:case id=g10.auth-domain.TC-79b rev=2 -->
### shared.auth-dmn.US7-TC1: A link followed in a second tab signs the first tab in and opens the page it was refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-08, shared-auth-session-US-04

**Pre-conditions:**

* customer is signed out; tab A was refused the orders list and asked for a link for `<collector account>`; tab C is open on `<g10url>`.

**Steps:**

1. In tab B, follow the link.
2. Return to tab A, then to tab C, without reloading either.

**Expected Results:**

* Tab A shows no sign-in dialog; it names the collector and is on the orders list, without opening it again.
* Tab C names the collector.

---

## shared.auth-dmn.US8: Operator holds a console session and a site session that each end on their own

**As an** operator,
**I want** my console session and my site session to start, show and end separately, and to end together only when an admin ends every session of my account,
**so that** signing in or out on one never changes the other.

<!-- trace:case id=g10.auth-dmn.TC-0cx rev=1 -->
### shared.auth-dmn.US8-TC1: An operator's console and site sessions start, end and are listed apart, and end together only when every session is ended

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-07, shared-auth-sign-in-US-12, shared-auth-sign-out-US-03, shared-auth-sessions-US-03, shared-auth-sessions-US-04

**Pre-conditions:**

* `<operator account>` holds console access and is signed out of `<g10url>` and `<console url>`; admin(holds `session:list` and `session:revoke`) is signed in on `<console url>` in another browser.

**Steps:**

1. Follow a sign-in link asked for on `<g10url>`, then open `<console url>`.
2. Follow a link asked for on `<console url>` and enter the current second-factor code.
3. As the admin, open `<operator account>`'s Sessions page.
4. Sign out on `<g10url>`, then open `<console url>`.
5. As the admin, revoke every session of `<operator account>`; after 70 seconds open `<console url>` and `<g10url>`.

**Expected Results:**

* Step 1 signs in the site; the console shows its sign-in page.
* Step 2 opens the console; the site stays signed in.
* Step 3 lists one site session and one console session, each naming its surface.
* Step 4 signs out the site only; the console is still signed in.
* Step 5 shows nobody signed in on either.
