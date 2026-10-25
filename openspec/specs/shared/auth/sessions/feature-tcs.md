# shared/auth/sessions Test Cases

**Status:** pending-review · 0/4
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* `<g10url>` is the Grade10 site and `<console url>` the Grade10 console of the environment under test. Users is `<users>` on the console: a directory of accounts with search, Type, role and status narrowing and pages, an account opening in a panel beside the list, by user id. Each case names the grants the operator's roles hold.
* Audit is the console's audit trail, read by an auditor holding `audit:read`, filtered by user id; it names people by user id.
* A change to an account's standing, roles or sessions reaches the person's next page within 70 seconds; a tab is read by opening a page in it.

## shared.auth-sessions.US1: Operator lists a person's sessions

**As an** operator who can list sessions,
**I want** to see one account's sessions without their secrets,
**so that** I can tell which device is signed in without becoming that person.

<!-- trace:case id=g10.shared-sessions.TC-7dr rev=2 -->
### shared.auth-sessions.US1-TC2: An operator whose grant does not cover an account sees no session to list or end

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
* **Trace:** shared-auth-sessions-US-01

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

## shared.auth-sessions.US2: Operator ends a session

**As an** operator who can revoke,
**I want** to end one session or every session of an account,
**so that** a stolen device is signed out, including my own if I revoke the current one.

<!-- trace:case id=g10.shared-sessions.TC-ffj rev=2 -->
### shared.auth-sessions.US2-TC1: Ending a session signs that one out within 70 seconds, and no other

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
* **Trace:** shared-auth-sessions-US-02

**Pre-conditions:**

* An admin holding `user:list`, `session:list` and `session:revoke` is on `<users>`; `<sessions>` are open, each in its own tab.

**Test data:**

| `<sessions>` | `<ended>` | `<afterwards>` |
| --- | --- | --- |
| an account on `<g10url>` on two devices | the first device's | the first signed out; the second still signed in |
| an account on `<g10url>` and the console | the site's | the site signed out; the console still signed in |
| an account on `<g10url>` and the console | the console's | the console signed out; the site still signed in |
| the admin's own, on the console | the one in use | the admin signed out of the console |

**Steps:**

1. Open the account, and end `<ended>` in its sessions area.
2. After 70 seconds, open a page in each tab.
3. As an auditor, filter Audit by the account's user id.

**Expected Results:**

* Step 2 shows `<afterwards>`.
* Step 3 lists one revoke for each ending, naming the admin, and no secret.

---

## shared.auth-sessions.US3: Operator tells a console session from a site session

**As an** operator,
**I want** each listed session to say whether it is the site's or the console's,
**so that** I know what I am ending before I end it.

<!-- trace:case id=g10.shared-sessions.TC-kts rev=1 -->
### shared.auth-sessions.US3-TC1: The panel lists each session as the site's or the console's, by identifier, with no secret

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
* **Trace:** shared-auth-sessions-US-03

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

---

## shared.auth-sessions.US4: Operator ends every session of an account on both surfaces

**As an** operator,
**I want** ending every session of an account to close its site and console sessions together,
**so that** a person I have cut off keeps no live console session.

<!-- trace:case id=g10.shared-sessions.TC-vip rev=1 -->
### shared.auth-sessions.US4-TC1: Ending every session signs the account out of the site and the console

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-04

**Pre-conditions:**

* An admin holding `user:list`, `session:list` and `session:revoke` is on `<users>`; an account holding console access is signed in on `<g10url>` in tab A and on the console in tab B.

**Steps:**

1. Open the account, and end every session in its sessions area.
2. After 70 seconds, open a page in tabs A and B.
3. As an auditor, filter Audit by the account's user id.

**Expected Results:**

* Step 2: tab A is signed out, and tab B shows the console's sign-in page.
* Step 3 lists the revoke, naming the admin, and no secret.

---

## Settled

- A read already in flight when a revoke commits falls inside the 70-second bound and needs no rule of its own.
- One per-account version covers both surfaces, so a revoke of one session or of all closes within the same 70 seconds on each.
- A session an operator held before release lists as a site session; a session with no surface reads as the site.
