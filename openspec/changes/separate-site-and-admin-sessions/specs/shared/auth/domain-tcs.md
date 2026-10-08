# shared/auth Cross-Feature E2E Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-auth-e2e-US2: Collector's one sign-in covers this brand and goes nowhere else

**As a** collector,
**I want** one sign-in to carry across the brand's site I signed in on, not to another brand, and not to a location off the brand,
**so that** I sign in once here and am never delivered somewhere I did not ask for.

---

## shared-auth-e2e-US8: Operator holds a console session and a site session that each end on their own

**As an** operator,
**I want** my console session and my site session to start, show and end separately, and to end together only when an admin ends every session of my account,
**so that** signing in or out on one never changes the other.

### shared-auth-e2e-US8-TC1-1: Console and site sessions start, end and are listed separately

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-07, shared-auth-sign-in-US-12, shared-auth-sign-out-US-03, shared-auth-sessions-US-03, shared-auth-sessions-US-04

**Pre-conditions:**

* <operator account> holds console access and is signed out on <grade10 admin console url> and on <grade10 store url>.
* admin is signed in on <grade10 admin console url> in another browser, able to end sessions.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |
| `<operator TOTP code>` | A valid current code from <operator account>'s authenticator |

**Steps:**

1. Follow a sign-in link asked from <grade10 store url> for <operator email>.
2. Navigate to <grade10 admin console url> and read the signed-in state.
3. Follow a sign-in link asked from <grade10 admin console url> for <operator email>, then enter <operator TOTP code>.
4. Open the session list for <operator account> as admin.
5. Sign out on <grade10 store url>.
6. Read the signed-in state on <grade10 admin console url>.
7. As admin, end every session of <operator account>.
8. Read the signed-in state on <grade10 admin console url> and on <grade10 store url>.

**Expected Results:**

* Step 1 signs <operator account> in on the site.
* Step 2 shows nobody signed in on the console.
* Step 3 opens the console as <operator account> and leaves the site signed in.
* Step 4 lists one site session and one console session, each naming its surface.
* Step 5 signs out the site only.
* Step 6 still shows <operator account> signed in on the console.
* Step 8 shows nobody signed in on either surface.

---

## Settled

None.
