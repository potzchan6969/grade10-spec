# shared/auth/users Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-24, tcs-rules r3.0

## shared-auth-users-US5: Operator creates an Auth account

**As an** operator holding `user:create`,
**I want** to create a passwordless Auth account with name, email, and roles
from the closed set for someone who has never signed in — and to be refused
when the email already exists —
**so that** access can be granted before first sign-in without loyalty enroll
or an invite mail, and a duplicate never becomes a second account.

### shared-auth-users-US5-TC1-1: Create passwordless Auth account with elevated role

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as admin(holds `user:create` and `user:set-role`). No Auth account holds <new email>.

**Test data:**

| Field | Value |
| --- | --- |
| <new name> | Ada Operator |
| <new email> | ada.operator@example.com |
| <roles> | `admin` |

**Steps:**

1. Create an Auth account with <new name>, <new email>, and <roles>.
2. Open the account named by <new email>.
3. Check that account's roles and whether a password was required at create.

**Expected Results:**

* Step 1 succeeds and creates one Auth account for <new email>.
* Step 2 opens that account with <new name> and roles including `admin`.
* Create collected no password.

### shared-auth-users-US5-TC2-1: Create plain user with only user:create

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as admin(holds `user:create`, not `user:set-role`). No Auth account holds <plain email>.

**Test data:**

| Field | Value |
| --- | --- |
| <plain name> | Pat Collector |
| <plain email> | pat.collector@example.com |
| <roles> | `user` |

**Steps:**

1. Create an Auth account with <plain name>, <plain email>, and <roles>.
2. Open the account named by <plain email>.

**Expected Results:**

* Step 1 succeeds.
* Step 2 opens that account with roles `user` only.

### shared-auth-users-US5-TC3-1: Create without user:create is refused

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
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as admin(holds `user:list` and `user:set-role`, not `user:create`). No Auth account holds <attempted email>.

**Test data:**

| Field | Value |
| --- | --- |
| <attempted email> | no.create@example.com |

**Steps:**

1. Try to create an Auth account with name, <attempted email>, and role `user`.

**Expected Results:**

* The system refuses the create.
* No Auth account holds <attempted email>.

### shared-auth-users-US5-TC4-1: Elevated role without user:set-role is refused

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
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as admin(holds `user:create`, not `user:set-role`). No Auth account holds <elevated email>.

**Test data:**

| Field | Value |
| --- | --- |
| <elevated email> | almost.admin@example.com |
| <roles> | `admin` |

**Steps:**

1. Try to create an Auth account with a name, <elevated email>, and <roles>.

**Expected Results:**

* The system refuses the create.
* No Auth account holds <elevated email>.

### shared-auth-users-US5-TC5-1: Duplicate email is refused

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as admin(holds `user:create` and `user:set-role`). Auth already holds <existing email> on <existing account>.

**Test data:**

| Field | Value |
| --- | --- |
| <existing email> | taken@example.com |

**Steps:**

1. Try to create an Auth account with a new name, <existing email>, and role `user`.
2. Count Auth accounts whose email is <existing email>.

**Expected Results:**

* Step 1 is refused.
* Step 2 still counts exactly one account for <existing email>.

### shared-auth-users-US5-TC6-1: Create does not enroll loyalty or send invite mail

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as admin(holds `user:create` and `user:set-role`). No Auth account holds <silent email>. No outbound mail is queued for <silent email>.

**Test data:**

| Field | Value |
| --- | --- |
| <silent name> | Silent Create |
| <silent email> | silent.create@example.com |
| <roles> | `staff` |

**Steps:**

1. Create an Auth account with <silent name>, <silent email>, and <roles>.
2. Check loyalty enrollment for that account.
3. Check outbound mail for <silent email>.

**Expected Results:**

* Step 1 succeeds.
* Step 2 shows no loyalty enroll and no opening points from create.
* Step 3 shows no invite or magic-link mail from create.

### shared-auth-users-US5-TC7-1: Empty roles at create leave a user

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
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as admin(holds `user:create`). No Auth account holds <empty-roles email>.

**Test data:**

| Field | Value |
| --- | --- |
| <empty-roles name> | No Role Pick |
| <empty-roles email> | no.role@example.com |

**Steps:**

1. Create an Auth account with <empty-roles name>, <empty-roles email>, and no role selected.
2. Open the account named by <empty-roles email>.

**Expected Results:**

* Step 1 succeeds.
* Step 2 opens that account with roles `user` only.

## Settled

- Empty role selection at create leaves the account as `user` only (Q13).
- Name and email are required on create (Q14).
- Email-verification standing of a newly created account is open on the PRD.

## Reconciliation

**Run:** Blind pass read Purpose, Feature set, user-journeys.md, proposal.md, decisions.md (Raised included), linked Create Account PRD section, and this suite for id continuity with Reconciliation stripped. Denied: every Requirements section, openspec/specs/ beyond Purpose and Feature set, openspec/changes/archive/.

**Raised, folded into spec**

- Loyalty enroll and invite mail absent on create — folded as `shared-auth-users-SC-28`.
- Empty roles at create — folded as `shared-auth-users-SC-33`; case `shared-auth-users-US5-TC7-1` added after Q13.

**Raised, escalated**

- Email-verification standing of a newly created Auth account — ❓ on Users · Create Account; no scenario written.

**Raised, landed as decisions**

- Empty role selection — Q13.
- Name and email required — Q14.

**Uncovered anchors**

- All scenarios under Account create / US-05 covered by US5-TC1 through TC7.
