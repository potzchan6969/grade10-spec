# shared/auth Cross-Feature E2E Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-04, tcs-rules r4

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
* **Automation status:** automated
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
* **Automation status:** automated
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
* **Status:** actual
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
2. Open <grade10 auction url> and read the signed-in state.
3. Open <zzz store url> and read the signed-in state.

**Expected Results:**

* Step 2 shows the signed-in person's name and email.
* Step 3 shows nobody signed in.

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

* customer is not signed in on any brand.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | An inbox the tester reads, with an account |
| `<off-brand location>` | `https://example.com/landing`, any location that is not a site of this brand |

**Steps:**

1. Start a sign-in on <grade10 store url> naming <off-brand location> as the return location.
2. Ask for a sign-in link at <collector email>.
3. Follow the link from that email.
4. Read the signed-in state on the page step 3 lands on.

**Expected Results:**

* Step 3 lands on this brand, not on <off-brand location>.
* Step 4 shows the collector's name and email.

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

* admin(holds `user:ban` and `audit:read`) is on <grade10 admin users url>.
* <collector account> is not banned.
* An unused, unexpired sign-in link has been emailed to <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector account>` | An unbanned account holding `user` only |
| `<collector email>` | That account's email, an inbox the tester reads |
| `<ban reason>` | Chargeback dispute open, any reason the operator states |

**Steps:**

1. Paste <collector account>'s user id into the search.
2. Choose Ban in the account's panel.
3. Enter <ban reason> and confirm.
4. In a separate browser, follow the link emailed to <collector email>.
5. Open the audit trail from the account's panel.

**Expected Results:**

* Step 4 does not sign that person in.
* Step 5 shows the ban, naming the operator and <collector account> by user id.
* The ban entry keeps <ban reason>.

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

* admin(holds `user:ban`) is on <grade10 admin users url>.
* <collector account> is banned.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector account>` | A banned account holding `user` only |
| `<collector email>` | That account's email, an inbox the tester reads |

**Steps:**

1. Paste <collector account>'s user id into the search.
2. Choose Unban in the account's panel and confirm.
3. In a separate browser, ask for a sign-in link at <collector email> on <grade10 store url>.
4. Follow the link from that email.

**Expected Results:**

* Step 1 lists <collector account>.
* Step 2 leaves <collector account> listed.
* Step 4 signs that person in.

---

## shared-auth-e2e-US4: Operator ends a session and the device stops being that person

**As an** operator who can revoke,
**I want** a revoked session to report nobody and the revoke to be on the trail,
**so that** a stolen device is out, and a revoke that cannot be recorded does not happen at all.

### shared-auth-e2e-US4-TC1-1: Revoked session leaves the page showing nobody signed in and the revoke is on the trail

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

* admin(holds `session:list`, `session:revoke` and `audit:read`) is on <grade10 admin users url>.
* <collector account> is signed in on <grade10 store url> in one browser, <collector browser>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector account>` | An account signed in on one browser only |
| `<collector browser>` | The browser holding that session |

**Steps:**

1. Paste <collector account>'s user id into the search.
2. Read the sessions in the account's panel.
3. Open the audit trail from the account's panel.
4. Revoke the session in the account's panel.
5. Wait 70 seconds.
6. Reload <grade10 store url> in <collector browser>.
7. Open the audit trail again.

**Expected Results:**

* Step 2 lists that account's session, with no session secret shown.
* Step 3 shows no entry for the listing.
* Step 6 shows nobody signed in.
* Step 7 shows the revoke, naming the operator and <collector account>.

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

* admin(holds `session:list` and `session:revoke`) is on <grade10 admin users url>.
* <collector account> is signed in on <grade10 store url> in one browser, <collector browser>.
* The identity trail is mocked to refuse a new entry.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector account>` | An account signed in on one browser only |
| `<collector browser>` | The browser holding that session |

**Steps:**

1. Paste <collector account>'s user id into the search.
2. Revoke the session in the account's panel.
3. Wait 70 seconds.
4. Reload <grade10 store url> in <collector browser>.

**Expected Results:**

* Step 2 is refused and the panel still lists the session.
* Step 4 shows that person's name and email.

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

**Blocked:** 2026-09-17 tcs-review skipped this journey. Expected results say only that an auction operate action is allowed and a ban is refused, with no screen to check; the title says catalogue and step 3 says operate. A later pass names an observable (for example Create listing on the Listings section) before a verdict.

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

* admin(role `support`) is on <grade10 admin users url>.
* <admin account> holds `admin`, is unbanned, and is signed in on one session.
* <collector account> holds `user` only.

**Test data:**

| Field | Value |
| --- | --- |
| `<admin account>` | An account holding `admin`, signed in on one session |
| `<collector account>` | An account holding `user` only |

**Steps:**

1. Paste <admin account>'s user id into the search.
2. Try to list <admin account>'s sessions.
3. Try to ban <admin account>.
4. Paste <collector account>'s user id into the search.
5. Try to set <collector account>'s roles.
6. As admin(holds `audit:read`), open the audit trail.

**Expected Results:**

* Step 2 is refused and shows no session.
* Step 3 is refused; <admin account> stays unbanned.
* Step 5 is refused; <collector account>'s roles are unchanged.
* Step 6 shows the refused ban, recorded as not succeeding.

---

## shared-auth-e2e-US7: Collector follows a link in one tab and the tab they left carries on

**As a** collector,
**I want** the tab I asked from to sign me in and finish what it stopped me doing once I follow the link elsewhere,
**so that** one sign-in finishes the thing I was in the middle of, on every tab of the brand.

### shared-auth-e2e-US7-TC1-1: Link followed in a second tab signs the first in and completes its refused add

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-08, shared-auth-session-US-04

**Pre-conditions:**

* customer is not signed in, with tab A open on <listing> and tab C open on <grade10 store url>.
* In tab A, the add to cart on <listing> was refused, and a sign-in link was asked for at <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | An inbox the tester reads, with an account |
| `<listing>` | A card listing with an add-to-cart control |

**Steps:**

1. Open tab B and follow the link emailed to <collector email>.
2. Return to tab A.
3. Switch to tab C without reloading it.

**Expected Results:**

* Step 2 shows no sign-in dialog and names the collector.
* <listing> is in the collector's cart, without the add being clicked again.
* Step 3 names the collector.
