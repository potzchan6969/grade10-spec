# shared/auth Cross-Feature E2E Test Cases

**Status:** pending-review · 3/12
**Drafts styled:** 2026-10-06, tcs-rules r4

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
**I want** one sign-in to carry across the brand's site I signed in on, not to another brand, and not to a location off the brand,
**so that** I sign in once here and am never delivered somewhere I did not ask for.

---

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
* **Testability:** automation
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

## Settled

None.
