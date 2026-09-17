# shared/auth Cross-Feature E2E Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## shared-auth-e2e-US1: Collector signs in by link and every surface names them until they sign out

**As a** collector,
**I want** the link I follow to sign me in, every surface of the brand to know it is me, and sign-out to leave me signed out,
**so that** one sign-in carries me through the brand and one sign-out ends it.

### shared-auth-e2e-US1-TC1-1: Link sign-in names the collector and sign-out clears them

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01, shared-auth-session-US-01, shared-auth-sign-out-US-01

**Pre-conditions:**

* A customer is not signed in on <grade10 store url>.
* An unused, unexpired sign-in link has been emailed to <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | The address the sign-in link was asked for |
| `<collector account>` | The account for <collector email> |

**Steps:**

1. Follow the sign-in link emailed to <collector email>.
2. Read the signed-in state on <grade10 store url>.
3. Activate the sign-out control and wait for the auth service to answer.

**Expected Results:**

* Step 1 signs them in as <collector account>.
* Step 2 shows <collector account>'s name and email in the signed-in state.
* The page leaves the signed-in state and no longer shows their name.

### shared-auth-e2e-US1-TC2-1: Expired link leaves the page showing nobody signed in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01, shared-auth-session-US-01

**Pre-conditions:**

* A customer is not signed in on <grade10 store url>.
* A sign-in link emailed to <collector email> is past its expiry.

**Steps:**

1. Follow the expired sign-in link.
2. Read the signed-in state on <grade10 store url>.

**Expected Results:**

* Step 1 does not sign them in.
* The page shows nobody signed in.

---

## shared-auth-e2e-US2: Collector's one sign-in covers this brand and goes nowhere else

**As a** collector,
**I want** one sign-in to carry across every site of this brand, not to another brand, and not to a location off the brand,
**so that** I sign in once here and am never delivered somewhere I did not ask for.

### shared-auth-e2e-US2-TC1-1: One sign-in covers the brand and not the other

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01, shared-auth-session-US-02

**Pre-conditions:**

* A customer is not signed in on any brand.
* An unused, unexpired sign-in link has been emailed to <collector email>.

**Steps:**

1. Follow the sign-in link from <grade10 store url>.
2. Open <grade10 auction url> and read who is calling.
3. Open <zzz store url> and read who is calling.

**Expected Results:**

* Step 2 reports the same person as step 1.
* Step 3 reports no person.

### shared-auth-e2e-US2-TC2-1: Untrusted return location is ignored and sign-in stays on the brand

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-05, shared-auth-session-US-02

**Pre-conditions:**

* A customer is not signed in on any brand.
* A sign-in is started naming <off-brand location> as the place to return to.

**Test data:**

| Field | Value |
| --- | --- |
| `<off-brand location>` | A location that is not a site of this brand |

**Steps:**

1. Complete the sign-in that names <off-brand location>.
2. Read who is calling on the surface it lands on.

**Expected Results:**

* Step 1 lands on this brand and not on <off-brand location>.
* The read reports the signed-in person.

---

## shared-auth-e2e-US3: Operator bans an account and the person stops getting in

**As an** operator who can ban,
**I want** a ban to end the person's way in and to be on the identity trail, and an unban to give it back,
**so that** a person who must leave cannot sign in, and a mistaken ban is reversible and accounted for.

### shared-auth-e2e-US3-TC1-1: Ban stops the next sign-in and is on the trail

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-02, shared-auth-sign-in-US-01, shared-auth-audit-US-01

**Pre-conditions:**

* admin(holds user:ban) is on <admin users directory url>.
* <collector account> is not banned and has an unused, unexpired sign-in link.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector account>` | An unbanned account named by user id |
| `<ban reason>` | Chargeback dispute open |

**Steps:**

1. Open <collector account> by user id.
2. Ban it with <ban reason>.
3. Follow the sign-in link as <collector account>.

**Expected Results:**

* Step 3 does not sign that person in.
* The identity trail records the actor, <collector account>, and the ban, naming both by user id.
* The trail entry keeps <ban reason>.

### shared-auth-e2e-US3-TC2-1: Unban lets the same person sign in again

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-02, shared-auth-sign-in-US-01

**Pre-conditions:**

* admin(holds user:ban) is on <admin users directory url>.
* <collector account> is banned and has an unused, unexpired sign-in link.

**Steps:**

1. Open <collector account> by user id.
2. Unban it.
3. Follow the sign-in link as <collector account>.

**Expected Results:**

* <collector account> is listed in the directory throughout.
* Step 3 signs that person in.

---

## shared-auth-e2e-US4: Operator ends a session and the device stops being that person

**As an** operator who can revoke,
**I want** a revoked session to report nobody and the revoke to be on the trail,
**so that** a stolen device is out, and a revoke that cannot be recorded does not happen at all.

### shared-auth-e2e-US4-TC1-1: Revoked session reports no person and the revoke is on the trail

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-01, shared-auth-sessions-US-02, shared-auth-session-US-01, shared-auth-audit-US-01

**Pre-conditions:**

* admin(holds session:list and session:revoke) is on <admin sessions url>.
* <collector account> is signed in on <collector session>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector account>` | An account signed in on one device |
| `<collector session>` | That account's signed-in session |

**Steps:**

1. List <collector account>'s sessions by user id.
2. Revoke <collector session>.
3. Read who is calling on <collector session>.

**Expected Results:**

* Step 1 shows that account's sessions and no session secret, and writes no trail entry.
* Step 3 reports no person.
* The trail records the actor, <collector account>, and the revoke.

### shared-auth-e2e-US4-TC2-1: Revoke that cannot be recorded leaves the session signed in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-audit-US-03, shared-auth-sessions-US-02, shared-auth-session-US-01

**Pre-conditions:**

* admin(holds session:revoke) is on <admin sessions url>.
* <collector account> is signed in on <collector session>.
* The identity trail is mocked to refuse a new entry.

**Steps:**

1. Revoke <collector session>.
2. Read who is calling on <collector session>.

**Expected Results:**

* Step 2 reports that person.
* <collector session> remains signed in.

---

## shared-auth-e2e-US5: Admin changes a person's roles and the new grants decide what they may do

**As an** admin,
**I want** the roles I save on another account to be what that person's next action is checked against, and the change to be on the trail,
**so that** a grant takes effect where it is used and can be traced back to me.

### shared-auth-e2e-US5-TC1-1: Saved staff role grants the catalogue and nothing more

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-03, shared-auth-roles-US-02, shared-auth-audit-US-01

**Pre-conditions:**

* admin(holds user:set-role) is on <admin users directory url>.
* <operator account> holds `user` only.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account>` | An account holding `user` only, named by user id |

**Steps:**

1. Open <operator account> by user id.
2. Set its roles to `staff` and save.
3. As <operator account>, take an auction operate action.
4. As <operator account>, try to ban an account.

**Expected Results:**

* <operator account>'s roles include `staff`.
* Step 3 is allowed and step 4 is refused.
* The trail records the actor, <operator account>, and the set-role, naming both by user id.

---

## shared-auth-e2e-US6: Support's narrower grants are refused across the console and the refusal is kept

**As an** operator whose role is support,
**I want** the moves my role does not grant to be refused wherever I try them, and the refusal recorded,
**so that** a narrower role cannot be widened by picking a different screen.

### shared-auth-e2e-US6-TC1-1: Support is refused on an admin account and on setting roles

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-02, shared-auth-users-US-02, shared-auth-sessions-US-01, shared-auth-audit-US-01

**Pre-conditions:**

* admin(operator role is support) is on <admin users directory url>.
* <admin account> holds `admin` and is signed in on one session.
* <collector account> holds `user` only.

**Test data:**

| Field | Value |
| --- | --- |
| `<admin account>` | An account holding `admin`, signed in on one session |
| `<collector account>` | An account holding `user` only |

**Steps:**

1. Try to list <admin account>'s sessions.
2. Try to ban <admin account>.
3. Try to set <collector account>'s roles.

**Expected Results:**

* Each step is refused and returns no sessions.
* <admin account> remains unbanned and <collector account>'s roles are unchanged.
* The trail records the refused ban and records that it did not succeed.
