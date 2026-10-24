# shared/auth Cross-Feature E2E Test Cases

**Status:** pending-review · 0/8
**Drafts styled:** 2026-10-24, tcs-rules r7

## Background

* `<g10url>` is the Grade10 site, `<zzz url>` the ZZZ site, and `<console url>` the Grade10 console of the environment under test.
* The audit trail is the console's identity audit trail page; every entry names people by user id.

## shared.auth-dmn.US1: Collector signs in by link and every surface names them until they sign out

**As a** collector,
**I want** the link I follow to sign me in, every surface of the brand to know it is me, and sign-out to leave me signed out,
**so that** one sign-in carries me through the brand and one sign-out ends it.

<!-- trace:case id=g10.auth-domain.TC-abj rev=2 -->
### shared.auth-dmn.US1-TC1: A link sign-in names the collector until they sign out

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

* customer is signed out on `<g10url>`, with an unused sign-in link in `<collector email>`'s inbox.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | an inbox the tester reads, with an account |

**Steps:**

1. Follow the link.
2. Open `<g10url>/profile`.
3. Select sign out and wait for it to finish.

**Expected Results:**

* Step 1 signs the collector in.
* Step 2 shows the account's name and email.
* Step 3 leaves the signed-in page, and the name shows nowhere.

---

## shared.auth-dmn.US2: Collector's one sign-in covers this brand and goes nowhere else

**As a** collector,
**I want** one sign-in to carry across the brand's site I signed in on, not to another brand, and not to a location off the brand,
**so that** I sign in once here and am never delivered somewhere I did not ask for.

<!-- trace:case id=g10.auth-domain.TC-64p rev=2 -->
### shared.auth-dmn.US2-TC1: One sign-in covers the brand's site and no other brand

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

* customer is signed out on every brand, with an unused sign-in link in `<collector email>`'s inbox, asked for on the store.

**Steps:**

1. Follow the link.
2. Open the auction on `<g10url>`.
3. Open `<zzz url>`.

**Expected Results:**

* Step 2 shows the collector's name and email, with no new sign-in.
* Step 3 shows nobody signed in.

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
* **Testability:** manual
* **Trace:** shared-auth-users-US-02, shared-auth-sign-in-US-01, shared-auth-audit-US-01

**Pre-conditions:**

* admin(holds `user:ban` and `audit:read`) is signed in on `<console url>`.
* `<collector account>` is unbanned, with an unused sign-in link in its inbox.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector account>` | an account holding `user` only, whose inbox the tester reads |

**Steps:**

1. Open `<collector account>` in the user directory and ban it with reason `Chargeback dispute open`.
2. In another browser, follow the link.
3. Open the audit trail and filter by `<collector account>`'s user id.
4. Unban `<collector account>`.
5. In the other browser, ask for a new link on `<g10url>` and follow it.

**Expected Results:**

* Step 2 does not sign the person in.
* Step 3 lists the ban, naming the admin and `<collector account>` by user id, with its reason.
* Step 5 signs the person in.

---

## shared.auth-dmn.US4: Operator ends a session and the device stops being that person

**As an** operator who can revoke,
**I want** a revoked session to report nobody and the revoke to be on the trail,
**so that** a stolen device is out, and a revoke that cannot be recorded does not happen at all.

<!-- trace:case id=g10.auth-domain.TC-3wq rev=2 -->
### shared.auth-dmn.US4-TC1: A revoked session stops being the person, and the revoke is on the trail

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sessions-US-01, shared-auth-sessions-US-02, shared-auth-session-US-01, shared-auth-audit-US-01

**Pre-conditions:**

* admin(holds `session:list`, `session:revoke` and `audit:read`) is signed in on `<console url>`.
* `<collector account>` is signed in on `<g10url>` in one other browser only.

**Steps:**

1. Open `<collector account>`'s Sessions page.
2. Open the audit trail, filtered by the admin's user id.
3. Revoke the session, wait 70 seconds, then open a page in the other browser.
4. Open the audit trail again, filtered by `<collector account>`'s user id.

**Expected Results:**

* Step 1 lists the session, with no secret shown.
* Step 2 shows no entry for the listing.
* Step 3 shows nobody signed in.
* Step 4 lists the revoke, naming the admin and `<collector account>`.

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
* **Testability:** manual
* **Trace:** shared-auth-users-US-03, shared-auth-roles-US-02, shared-auth-audit-US-01

**Pre-conditions:**

* admin(holds `user:set-role` and `audit:read`) is signed in on `<console url>`.
* `<operator account>` holds `user` only, and is signed in on `<console url>` in another browser.

**Steps:**

1. Open `<operator account>` in the user directory, give it `staff` and save.
2. As `<operator account>`, open the auction catalogue and operate it.
3. As `<operator account>`, open the user directory and try to ban an account.
4. As the admin, open the audit trail and filter by `<operator account>`'s user id.

**Expected Results:**

* Step 1: `<operator account>` holds `staff`.
* Step 2: the change is saved.
* Step 3: no accounts are listed, and the ban is refused.
* Step 4 lists the role change, naming the admin and `<operator account>` by user id.

---

## shared.auth-dmn.US6: Support's narrower grants are refused across the console and the refusal is kept

**As an** operator whose role is support,
**I want** the moves my role does not grant to be refused wherever I try them, and the refusal recorded,
**so that** a narrower role cannot be widened by picking a different screen.

<!-- trace:case id=g10.auth-domain.TC-rub rev=2 -->
### shared.auth-dmn.US6-TC1: Support is refused on an admin's account and on roles, and the refusal is kept

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-roles-US-02, shared-auth-users-US-02, shared-auth-sessions-US-01, shared-auth-audit-US-01

**Pre-conditions:**

* support is signed in on `<console url>`.
* `<admin account>` holds `admin`, is unbanned and has one session; `<collector account>` holds `user` only.

**Steps:**

1. Open `<admin account>`'s Sessions page.
2. Try to ban `<admin account>`.
3. Try to change `<collector account>`'s roles.
4. As admin(holds `audit:read`), open the audit trail, filtered by `<admin account>`'s user id.

**Expected Results:**

* Step 1 lists no session.
* Step 2 is refused, and `<admin account>` stays unbanned.
* Step 3 is refused, and the roles are as they were.
* Step 4 lists the ban, marked not succeeded.

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

* customer is signed out; tab A was refused the orders list and asked for a link for `<collector email>`; tab C is open on `<g10url>`.

**Steps:**

1. In tab B, follow the link.
2. Return to tab A.
3. Switch to tab C without reloading it.

**Expected Results:**

* Step 2: no sign-in dialog; tab A names the collector and is on the orders list, without opening it again.
* Step 3: tab C names the collector.

---

## shared.auth-dmn.US8: Operator holds a console session and a site session that each end on their own

**As an** operator,
**I want** my console session and my site session to start, show and end separately, and to end together only when an admin ends every session of my account,
**so that** signing in or out on one never changes the other.

### shared.auth-dmn.US8-TC1: An operator's console and site sessions start, end and are listed apart, and end together only when every session is ended

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-session-US-07, shared-auth-sign-in-US-12, shared-auth-sign-out-US-03, shared-auth-sessions-US-03, shared-auth-sessions-US-04

**Pre-conditions:**

* `<operator account>` holds console access and is signed out of `<g10url>` and `<console url>`.
* admin(holds `session:list` and `session:revoke`) is signed in on `<console url>` in another browser.

**Steps:**

1. Follow a sign-in link asked for on `<g10url>`.
2. Open `<console url>`.
3. Follow a sign-in link asked for on `<console url>`, then enter the current second-factor code.
4. As the admin, open `<operator account>`'s Sessions page.
5. Sign out on `<g10url>`, then open `<console url>`.
6. As the admin, revoke every session of `<operator account>`; wait 70 seconds, then open `<console url>` and `<g10url>`.

**Expected Results:**

* Step 1 signs the operator in on the site; step 2 shows the console's sign-in page.
* Step 3 opens the console, and the site stays signed in.
* Step 4 lists one site session and one console session, each naming its surface.
* Step 5 signs out the site only; the console is still signed in.
* Step 6 shows nobody signed in on either.

## Settled

None.
