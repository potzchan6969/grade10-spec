# shared/auth/sessions Test Cases

**Status:** pending-review · 0/5
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* `<g10url>` is the Grade10 site and `<console url>` the Grade10 console of the environment under test.
* An account's sessions are on its Sessions page in the console, opened by user id. A revoke reaches the session's next page within 70 seconds; a tab is read by opening a page in it.
* `<subject account>` holds console access, no `admin`, and signs in on the console with its second factor.

## Walk 1: An admin reads and ends one account's sessions

Starting state:

- admin(holds `session:list` and `session:revoke`) on `<subject account>`'s Sessions page; `<subject account>` signed in on `<g10url>` in tab A and on `<console url>` in tab B.

Shared test data:

| Field | Value |
| --- | --- |
| subject account | an account holding console access |

### Route

1. Read the list.
   - One site session and one console session, no secret shown. `shared.auth-sessions.US3-TC1`
2. Revoke the console session; after 70 seconds read tabs A and B.
   - Tab B is signed out; tab A still signed in. `shared.auth-sessions.US2-TC1`
3. Revoke every session; after 70 seconds read tab A.
   - Tab A is signed out too. `shared.auth-sessions.US4-TC1`

## shared.auth-sessions.US1: Operator lists a person's sessions

**As an** operator who can list sessions,
**I want** to see one account's sessions without their secrets,
**so that** I can tell which device is signed in without becoming that person.

<!-- trace:case id=g10.shared-sessions.TC-jes rev=1 -->
### shared.auth-sessions.US1-TC1: An operator with the list grant sees one account's sessions, never their secrets

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-01

**Pre-conditions:**

* staff(holds `session:list`) is signed in on `<console url>`; `<subject account>` is signed in on two devices.

**Steps:**

1. Open `<subject account>`'s Sessions page.

**Expected Results:**

* Two sessions are listed, with no session secret or token shown.

<!-- trace:case id=g10.shared-sessions.TC-7dr rev=2 -->
### shared.auth-sessions.US1-TC2: An operator whose grant does not cover an account sees no sessions to list or end

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

* `<operator>` is signed in on `<console url>`; `<account>` is signed in on `<g10url>` in another tab.

**Test data:**

| `<operator>` | `<account>` | `<page shows>` |
| --- | --- | --- |
| staff without `session:list` | `<subject account>` | no session, and that the operator may not see them |
| staff holding `session:list`, not `session:revoke` | `<subject account>` | its session, with no revoke control |
| support | an account holding `admin` | no session, and that the operator may not see them |

**Steps:**

1. Open `<account>`'s Sessions page.
2. After 70 seconds, read `<account>`'s tab.

**Expected Results:**

* Step 1 shows `<page shows>`.
* Step 2: `<account>` is still signed in.

---

## shared.auth-sessions.US2: Operator ends a session

**As an** operator who can revoke,
**I want** to end one session or every session of an account,
**so that** a stolen device is signed out, including my own if I revoke the current one.

<!-- trace:case id=g10.shared-sessions.TC-ffj rev=2 -->
### shared.auth-sessions.US2-TC1: A revoked session is signed out within 70 seconds, and no other is

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

* admin(holds `session:list` and `session:revoke`) is signed in on `<console url>`; `<sessions>` are open, each in its own tab.

**Test data:**

| `<sessions>` | `<revoked>` | `<afterwards>` |
| --- | --- | --- |
| `<subject account>` on `<g10url>` on two devices | the first device's | the first signed out; the second still signed in |
| `<subject account>` on `<g10url>` and `<console url>` | the site's | the site signed out; the console still signed in |
| `<subject account>` on `<g10url>` and `<console url>` | the console's | the console signed out; the site still signed in |
| the admin's own, on `<console url>` | the one in use | the admin signed out of the console |

**Steps:**

1. Revoke `<revoked>` on the account's Sessions page.
2. After 70 seconds, read each tab.

**Expected Results:**

* Step 2 shows `<afterwards>`.

---

## shared.auth-sessions.US3: Operator tells a console session from a site session

**As an** operator,
**I want** each listed session to say whether it is the site's or the console's,
**so that** I know what I am ending before I end it.

<!-- trace:case id=g10.shared-sessions.TC-kts rev=1 -->
### shared.auth-sessions.US3-TC1: Each listed session says whether it is the site's or the console's

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
* **Trace:** shared-auth-sessions-US-03

**Pre-conditions:**

* admin(holds `session:list`) is signed in on `<console url>`; `<account>` holds `<sessions>`.

**Test data:**

| `<account>` | `<sessions>` | `<listed>` |
| --- | --- | --- |
| `<subject account>` | the site on a desktop, the console on the same desktop, the site on a phone | two site sessions and one console session |
| `<subject account>` | the console only | one console session |
| the admin's own | the console in use and the site | one console and one site session |
| an account signed in before release | that session | one site session |

**Steps:**

1. Open `<account>`'s Sessions page.

**Expected Results:**

* It lists `<listed>`, each named as the site's or the console's, with no secret.

---

## shared.auth-sessions.US4: Operator ends every session of an account on both surfaces

**As an** operator,
**I want** ending every session of an account to close its site and console sessions together,
**so that** a person I have cut off keeps no live console session.

<!-- trace:case id=g10.shared-sessions.TC-vip rev=1 -->
### shared.auth-sessions.US4-TC1: Ending every session, or a ban, signs the account out of the site and the console

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
* **Trace:** shared-auth-sessions-US-04

**Pre-conditions:**

* admin(holds `session:revoke` and `user:ban`) is signed in on `<console url>`; `<subject account>` is unbanned and signed in on `<g10url>` in tab A and `<console url>` in tab B.

**Test data:**

| `<action>` |
| --- |
| revoke every session on its Sessions page |
| ban it from the user directory, reason Chargeback dispute open |

**Steps:**

1. Do `<action>`.
2. After 70 seconds, read tabs A and B.

**Expected Results:**

* Tab A is signed out, and tab B shows the console's sign-in page.

## Settled

- A read already in flight when a revoke commits falls inside the 70-second bound and needs no rule of its own.
- One per-account version covers both surfaces, so a revoke of one session or of all closes within the same 70 seconds on each.
- A session an operator held before release lists as a site session; a session with no surface reads as the site.

## Reconciliation

- **Covered at domain** - `shared.auth-dmn.US4-TC1` walks one revoke signing a device out and landing on the trail; `shared.auth-dmn.US8-TC1` walks the site and console sessions listed apart and ended together
