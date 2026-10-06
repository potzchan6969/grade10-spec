# shared/auth Cross-Feature E2E Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## shared-auth-e2e-US1: Collector signs in by link and every surface names them until they sign out

**As a** collector,
**I want** the link I follow to sign me in, every surface of the brand to know it is me, and sign-out to leave me signed out,
**so that** one sign-in carries me through the brand and one sign-out ends it.

<!-- trace:case id=g10.auth-domain.TC-abj rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq,g10.shared-session.SC-xll,g10.shared-session.SC-yja,g10.shared-session.SC-4uk,g10.shared-session.SC-ol8,g10.shared-session.SC-qd6,g10.shared-sign-out.SC-9oa,g10.shared-sign-out.SC-vrp,g10.shared-sign-out.SC-x67 -->
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

<!-- trace:case id=g10.auth-domain.TC-be8 rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq,g10.shared-session.SC-xll,g10.shared-session.SC-yja,g10.shared-session.SC-4uk,g10.shared-session.SC-ol8,g10.shared-session.SC-qd6 -->
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

<!-- trace:case id=g10.auth-domain.TC-64p rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq,g10.shared-session.SC-pre,g10.shared-session.SC-hvi -->
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

<!-- trace:case id=g10.auth-domain.TC-kfq rev=1 covers=g10.shared-sign-in.SC-fn7,g10.shared-sign-in.SC-p8n,g10.shared-sign-in.SC-eax,g10.shared-session.SC-pre,g10.shared-session.SC-hvi -->
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
2. Read the signed-in state on the page it lands on.

**Expected Results:**

* Step 1 lands on this brand and not on <off-brand location>.
* Step 2 shows the signed-in person's name and email.

---

## shared-auth-e2e-US3: Operator bans an account and the person stops getting in

**As an** operator who can ban,
**I want** a ban to end the person's way in and to be on the identity trail, and an unban to give it back,
**so that** a person who must leave cannot sign in, and a mistaken ban is reversible and accounted for.

<!-- trace:case id=g10.auth-domain.TC-qew rev=1 covers=g10.shared-users.SC-bc9,g10.shared-users.SC-1m7,g10.shared-users.SC-57f,g10.shared-users.SC-qss,g10.shared-users.SC-s2t,g10.shared-users.SC-dbb,g10.shared-users.SC-v7f,g10.shared-users.SC-uoq,g10.shared-users.SC-y5y,g10.shared-users.SC-vpv,g10.shared-users.SC-5vl,g10.shared-users.SC-z5x,g10.shared-users.SC-xp8,g10.shared-users.SC-2ey,g10.shared-users.SC-4gk,g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq,g10.shared-audit.SC-s5y,g10.shared-audit.SC-hya,g10.shared-audit.SC-6pa,g10.shared-audit.SC-pgv,g10.shared-audit.SC-m8q,g10.shared-audit.SC-qhl,g10.shared-audit.SC-r4t,g10.shared-audit.SC-jbf -->
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

<!-- trace:case id=g10.auth-domain.TC-emm rev=1 covers=g10.shared-users.SC-bc9,g10.shared-users.SC-1m7,g10.shared-users.SC-57f,g10.shared-users.SC-qss,g10.shared-users.SC-s2t,g10.shared-users.SC-dbb,g10.shared-users.SC-v7f,g10.shared-users.SC-uoq,g10.shared-users.SC-y5y,g10.shared-users.SC-vpv,g10.shared-users.SC-5vl,g10.shared-users.SC-z5x,g10.shared-users.SC-xp8,g10.shared-users.SC-2ey,g10.shared-users.SC-4gk,g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq -->
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

<!-- trace:case id=g10.auth-domain.TC-3wq rev=1 covers=g10.shared-sessions.SC-h95,g10.shared-sessions.SC-bo7,g10.shared-sessions.SC-jz2,g10.shared-sessions.SC-4af,g10.shared-sessions.SC-lr6,g10.shared-sessions.SC-txa,g10.shared-sessions.SC-bcq,g10.shared-sessions.SC-ots,g10.shared-sessions.SC-bui,g10.shared-session.SC-xll,g10.shared-session.SC-yja,g10.shared-session.SC-4uk,g10.shared-session.SC-ol8,g10.shared-session.SC-qd6,g10.shared-audit.SC-s5y,g10.shared-audit.SC-hya,g10.shared-audit.SC-6pa,g10.shared-audit.SC-pgv,g10.shared-audit.SC-m8q,g10.shared-audit.SC-qhl,g10.shared-audit.SC-r4t,g10.shared-audit.SC-jbf -->
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
3. Read the signed-in state on <collector session>.

**Expected Results:**

* Step 1 shows that account's sessions and no session secret, and writes no trail entry.
* Step 3 shows nobody signed in.
* The trail records the actor, <collector account>, and the revoke.

<!-- trace:case id=g10.auth-domain.TC-zsj rev=1 covers=g10.shared-audit.SC-r7d,g10.shared-audit.SC-1rb,g10.shared-audit.SC-ci1,g10.shared-sessions.SC-4af,g10.shared-sessions.SC-lr6,g10.shared-sessions.SC-txa,g10.shared-sessions.SC-bcq,g10.shared-sessions.SC-ots,g10.shared-sessions.SC-bui,g10.shared-session.SC-xll,g10.shared-session.SC-yja,g10.shared-session.SC-4uk,g10.shared-session.SC-ol8,g10.shared-session.SC-qd6 -->
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
2. Read the signed-in state on <collector session>.

**Expected Results:**

* Step 2 shows that person's name and email in the signed-in state.
* <collector session> remains signed in.

---

## shared-auth-e2e-US5: Admin changes a person's roles and the new grants decide what they may do

**As an** admin,
**I want** the roles I save on another account to be what that person's next action is checked against, and the change to be on the trail,
**so that** a grant takes effect where it is used and can be traced back to me.

<!-- trace:case id=g10.auth-domain.TC-a7t rev=1 covers=g10.shared-users.SC-cg2,g10.shared-users.SC-3pf,g10.shared-users.SC-3br,g10.shared-users.SC-a8m,g10.shared-users.SC-xhl,g10.shared-users.SC-m57,g10.shared-users.SC-jw6,g10.shared-users.SC-7i8,g10.shared-roles.SC-2bw,g10.shared-roles.SC-pq2,g10.shared-roles.SC-s22,g10.shared-roles.SC-q3k,g10.shared-roles.SC-xb7,g10.shared-roles.SC-pvk,g10.shared-roles.SC-qv7,g10.shared-roles.SC-yjl,g10.shared-roles.SC-bye,g10.shared-roles.SC-gk8,g10.shared-roles.SC-11t,g10.shared-roles.SC-gip,g10.shared-roles.SC-tyx,g10.shared-roles.SC-eny,g10.shared-roles.SC-xss,g10.shared-roles.SC-a54,g10.shared-roles.SC-njl,g10.shared-audit.SC-s5y,g10.shared-audit.SC-hya,g10.shared-audit.SC-6pa,g10.shared-audit.SC-pgv,g10.shared-audit.SC-m8q,g10.shared-audit.SC-qhl,g10.shared-audit.SC-r4t,g10.shared-audit.SC-jbf -->
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

<!-- trace:case id=g10.auth-domain.TC-rub rev=1 covers=g10.shared-roles.SC-2bw,g10.shared-roles.SC-pq2,g10.shared-roles.SC-s22,g10.shared-roles.SC-q3k,g10.shared-roles.SC-xb7,g10.shared-roles.SC-pvk,g10.shared-roles.SC-qv7,g10.shared-roles.SC-yjl,g10.shared-roles.SC-bye,g10.shared-roles.SC-gk8,g10.shared-roles.SC-11t,g10.shared-roles.SC-gip,g10.shared-roles.SC-tyx,g10.shared-roles.SC-eny,g10.shared-roles.SC-xss,g10.shared-roles.SC-a54,g10.shared-roles.SC-njl,g10.shared-users.SC-bc9,g10.shared-users.SC-1m7,g10.shared-users.SC-57f,g10.shared-users.SC-qss,g10.shared-users.SC-s2t,g10.shared-users.SC-dbb,g10.shared-users.SC-v7f,g10.shared-users.SC-uoq,g10.shared-users.SC-y5y,g10.shared-users.SC-vpv,g10.shared-users.SC-5vl,g10.shared-users.SC-z5x,g10.shared-users.SC-xp8,g10.shared-users.SC-2ey,g10.shared-users.SC-4gk,g10.shared-sessions.SC-h95,g10.shared-sessions.SC-bo7,g10.shared-sessions.SC-jz2,g10.shared-audit.SC-s5y,g10.shared-audit.SC-hya,g10.shared-audit.SC-6pa,g10.shared-audit.SC-pgv,g10.shared-audit.SC-m8q,g10.shared-audit.SC-qhl,g10.shared-audit.SC-r4t,g10.shared-audit.SC-jbf -->
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

---

## shared-auth-e2e-US7: Collector follows a link in one tab and the tab they left carries on

**As a** collector,
**I want** the tab I asked from to sign me in and finish what it stopped me doing once I follow the link elsewhere,
**so that** one sign-in finishes the thing I was in the middle of, on every tab of the brand.

<!-- trace:case id=g10.auth-domain.TC-79b rev=1 covers=g10.shared-sign-in.SC-neg,g10.shared-sign-in.SC-wiy,g10.shared-sign-in.SC-laa,g10.shared-sign-in.SC-dyk,g10.shared-sign-in.SC-szm,g10.shared-sign-in.SC-lws,g10.shared-sign-in.SC-m9z,g10.shared-session.SC-fnz,g10.shared-session.SC-fmt,g10.shared-session.SC-lgf,g10.shared-session.SC-hc7,g10.shared-session.SC-sqp -->
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

* A customer is not signed in, with tab A open on <listing> and tab C open on <grade10 store url>.
* The customer was refused the add to the cart on <listing> in tab A and asked for a sign-in link at <collector email> there.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<listing>` | a card listing with an add-to-cart control |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab A.
3. Open tab C.

**Expected Results:**

* Tab A no longer shows the sign-in dialog and names the collector.
* <listing> is in the collector's cart, without the add being activated a second time.
* Tab C names the collector too, without being reloaded.
