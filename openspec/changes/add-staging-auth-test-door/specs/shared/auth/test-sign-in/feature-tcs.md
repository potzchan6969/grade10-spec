# shared/auth/test-sign-in Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-21, tcs-rules r3.0

## shared-auth-test-sign-in-US1: How the staging Actions job walks sign-in without the disposable /dev door

**Walked by:** nobody on their own - a makers door for the staging Actions job; collectors walk sign-in, operators walk ban and role on the Users desk
**As a** admin,
**I want** this repository's Actions job to walk staging sign-in through a locked door,
**so that** collectors still walk sign-in and the disposable door stays closed.

### shared-auth-test-sign-in-US1-TC1-1: Proven staging job may use the door

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Who may call

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* A last sign-in mail exists for <collector tester>.

**Steps:**

1. Call the staging door to capture the last sign-in mail for <collector tester>.

**Expected Results:**

* The door accepts the call.
* The call is not refused as an unknown caller.

### shared-auth-test-sign-in-US1-TC2-1: Laptop caller is refused the staging door

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Who may call

**Pre-conditions:**

* admin(a laptop) is calling the staging door.
* Ops has named the tester list.
* A last sign-in mail exists for <collector tester>.

**Steps:**

1. Call the staging door to capture the last sign-in mail for <collector tester>.

**Expected Results:**

* The door refuses the call.
* No last sign-in mail is returned.

### shared-auth-test-sign-in-US1-TC3-1: A fork's Actions job is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Who may call

**Pre-conditions:**

* admin(a fork's Actions job) is calling the staging door.
* Ops has named the tester list.
* A last sign-in mail exists for <collector tester>.

**Steps:**

1. Call the staging door to capture the last sign-in mail for <collector tester>.

**Expected Results:**

* The door refuses the call.
* No last sign-in mail is returned.

### shared-auth-test-sign-in-US1-TC4-1: Any other caller is refused the door

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Who may call

**Pre-conditions:**

* admin(another repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* A last sign-in mail exists for <collector tester>.

**Steps:**

1. Call the staging door to capture the last sign-in mail for <collector tester>.

**Expected Results:**

* The door refuses the call.
* No last sign-in mail is returned.

### shared-auth-test-sign-in-US1-TC5-1: Named list accepts the three testers

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Testers

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* A last sign-in mail exists for that row's address.

**Test data:**

| Address | Role |
| --- | --- |
| <collector tester> | collector |
| <ban-only tester> | ban-only |
| <admin-only tester> | admin-only |

**Steps:**

1. Call the staging door to capture the last sign-in mail for that address.

**Expected Results:**

* The door accepts that address as a tester.
* The call is not refused as an unknown address.

### shared-auth-test-sign-in-US1-TC6-1: Unnamed list refuses every address

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Testers

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has not named the tester list.
* The door has no subjects.

**Steps:**

1. Call the staging door to capture the last sign-in mail for <an address>.
2. Call the staging door to capture the last sign-in mail for <another address>.

**Expected Results:**

* Step 1 is refused.
* Step 2 is refused.
* No last sign-in mail is returned for either address.

### shared-auth-test-sign-in-US1-TC7-1: Capture with no address named is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Testers

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.

**Steps:**

1. Call the staging door to capture the last sign-in mail with no address named.

**Expected Results:**

* The door refuses the call.
* No last sign-in mail is returned.

### shared-auth-test-sign-in-US1-TC8-1: Capture for one tester does not return another's mail

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Testers

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* A last sign-in mail exists for <collector tester>.
* A last sign-in mail exists for <admin-only tester>.

**Steps:**

1. Call the staging door to capture the last sign-in mail for <admin-only tester>.

**Expected Results:**

* The last sign-in mail for <admin-only tester> is returned.
* The last sign-in mail for <collector tester> is not returned.

### shared-auth-test-sign-in-US1-TC9-1: Proven job captures last mail for collector tester

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* A last sign-in mail exists for <collector tester>.

**Steps:**

1. Call the staging door to capture the last sign-in mail for <collector tester>.

**Expected Results:**

* The last sign-in link for <collector tester> is returned.

### shared-auth-test-sign-in-US1-TC10-1: Capture returns the last of several mails

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* An earlier sign-in mail exists for <collector tester>.
* A later last sign-in mail exists for <collector tester>.

**Steps:**

1. Call the staging door to capture the last sign-in mail for <collector tester>.

**Expected Results:**

* The later last sign-in mail is returned.
* The earlier sign-in mail is not returned.

### shared-auth-test-sign-in-US1-TC11-1: Capture with no last mail returns none

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* No last sign-in mail exists for <collector tester>.

**Steps:**

1. Call the staging door to capture the last sign-in mail for <collector tester>.

**Expected Results:**

* No sign-in link is returned.

### shared-auth-test-sign-in-US1-TC12-1: Unused link is aged without waiting

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* An unused last sign-in link exists for <collector tester>.
* That unused link is still inside its five-minute life.

**Steps:**

1. Call the staging door to age the unused link for <collector tester>.

**Expected Results:**

* The unused link is past its five-minute life.

### shared-auth-test-sign-in-US1-TC13-1: Used link is not aged

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* A used last sign-in link exists for <collector tester>.

**Steps:**

1. Call the staging door to age the unused link for <collector tester>.

**Expected Results:**

* The door does not age that used link.
* The used link is unchanged.

### shared-auth-test-sign-in-US1-TC14-1: Missing link is not aged

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* No last sign-in mail exists for <collector tester>.

**Steps:**

1. Call the staging door to age the unused link for <collector tester>.

**Expected Results:**

* No unused link is aged.

### shared-auth-test-sign-in-US1-TC15-1: Ban-only tester is banned and stays banned

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* <ban-only tester> is not banned.

**Steps:**

1. Call the staging door to ban <ban-only tester>.
2. Read whether that address is banned.
3. Read whether that address is banned again.

**Expected Results:**

* Step 2 shows <ban-only tester> is banned.
* Step 3 still shows <ban-only tester> is banned.

### shared-auth-test-sign-in-US1-TC16-1: Ban of a non-ban-only tester is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* That row's address is not banned.

**Test data:**

| Address |
| --- |
| <collector tester> |
| <admin-only tester> |

**Steps:**

1. Call the staging door to ban that address.

**Expected Results:**

* The door refuses the call.
* That address is not banned.

### shared-auth-test-sign-in-US1-TC17-1: Admin-only tester is prepared to hold admin

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* <admin-only tester> does not hold admin.

**Steps:**

1. Call the staging door to prepare <admin-only tester>.
2. Read whether that address holds admin.

**Expected Results:**

* <admin-only tester> holds admin.

### shared-auth-test-sign-in-US1-TC18-1: Prepare of a non-admin-only tester is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* That row's address does not hold admin.

**Test data:**

| Address |
| --- |
| <collector tester> |
| <ban-only tester> |

**Steps:**

1. Call the staging door to prepare that address.

**Expected Results:**

* The door refuses the call.
* That address does not hold admin.

### shared-auth-test-sign-in-US1-TC19-1: Address not on the list is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Closed

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.

**Test data:**

| Move |
| --- |
| capture the last sign-in mail |
| age the unused link |
| ban |
| prepare to hold admin |

**Steps:**

1. Call the staging door to perform that move for <address not on the list>.

**Expected Results:**

* The door refuses the call.
* The named testers are unchanged.

### shared-auth-test-sign-in-US1-TC20-1: The preview door stays closed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Closed

**Pre-conditions:**

* admin(this repository's Actions job) is calling the preview door.
* Ops has named the tester list.
* A last sign-in mail exists for <collector tester>.

**Steps:**

1. Call the preview door to capture the last sign-in mail for <collector tester>.

**Expected Results:**

* The door refuses the call.
* No last sign-in mail is returned.

### shared-auth-test-sign-in-US1-TC21-1: The production door stays closed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Closed

**Pre-conditions:**

* admin(this repository's Actions job) is calling the production door.
* Ops has named the tester list.
* A last sign-in mail exists for <collector tester>.

**Steps:**

1. Call the production door to capture the last sign-in mail for <collector tester>.

**Expected Results:**

* The door refuses the call.
* No last sign-in mail is returned.

### shared-auth-test-sign-in-US1-TC22-1: Disposable door on staging stays closed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Closed

**Pre-conditions:**

* admin(this repository's Actions job) is on staging.

**Steps:**

1. Call the disposable `/dev` door on staging.

**Expected Results:**

* The disposable `/dev` door stays closed.

### shared-auth-test-sign-in-US1-TC23-1: Session mint without following mail is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Closed

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* <collector tester> has no session.

**Steps:**

1. Call the staging door to mint a session for <collector tester> without following mail.

**Expected Results:**

* The door refuses the call.
* <collector tester> has no session.

### shared-auth-test-sign-in-US1-TC24-1: Capture does not mint a session

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Closed

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* A last sign-in mail exists for <collector tester>.
* <collector tester> has no session.

**Steps:**

1. Call the staging door to capture the last sign-in mail for <collector tester>.
2. Read whether <collector tester> has a session.

**Expected Results:**

* The last sign-in link is returned.
* <collector tester> has no session.

### shared-auth-test-sign-in-US1-TC25-1: Store and auction seeds are not offered

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Closed

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.

**Steps:**

1. Call the staging door to seed store data.
2. Call the staging door to seed auction data.

**Expected Results:**

* Store seed is refused or not offered.
* Auction seed is refused or not offered.

### shared-auth-test-sign-in-US1-TC26-1: Second capture returns the same last mail

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* A last sign-in mail exists for <collector tester>.
* No later send has gone out for that tester.

**Steps:**

1. Call the staging door to capture the last sign-in mail for <collector tester>.
2. Call the staging door to capture the last sign-in mail for <collector tester> again.

**Expected Results:**

* Step 1 returns that last mail.
* Step 2 returns the same last mail.

### shared-auth-test-sign-in-US1-TC27-1: Prepare when already admin leaves admin

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* <admin-only tester> already holds admin.

**Steps:**

1. Call the staging door to prepare <admin-only tester>.
2. Read whether that address holds admin.

**Expected Results:**

* <admin-only tester> holds admin.

### shared-auth-test-sign-in-US1-TC28-1: Ban when already banned leaves banned

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* <ban-only tester> is already banned.

**Steps:**

1. Call the staging door to ban <ban-only tester>.
2. Read whether that address is banned.

**Expected Results:**

* <ban-only tester> is banned.

### shared-auth-test-sign-in-US1-TC29-1: Capture of a used last mail still returns it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* A last sign-in mail exists for <collector tester>.
* That last mail has already been followed.

**Steps:**

1. Call the staging door to capture the last sign-in mail for <collector tester>.

**Expected Results:**

* The last sign-in mail is returned.

### shared-auth-test-sign-in-US1-TC30-1: Unban through this door is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* admin(this repository's Actions job) is calling the staging door.
* Ops has named the tester list.
* <ban-only tester> is banned.

**Steps:**

1. Call the staging door to unban <ban-only tester>.

**Expected Results:**

* The door refuses the call.
* <ban-only tester> stays banned.

## Reconciliation

**Run:** add-staging-auth-test-door, 2026-09-21. Scenario pass read this change's Purpose, Feature set, journeys, proposal, decisions, Sign-In Tests PRD, and the durable `shared/auth/sign-in` and `shared/auth/users` requirements so it would not restate collector or operator contracts. Blind suite pass read only the isolated input (Purpose, Feature set, journeys, proposal, decisions.md with an empty Raised table, Sign-In Tests PRD, store context) — no `## Requirements`, no `openspec/specs/` beyond house-style `*-tcs.md`, no archive.

- **Raised, folded into spec:** Capture with no last mail returns none — `shared-auth-test-sign-in-US1-TC11-1` → `shared-auth-test-sign-in-SC-17`.
- **Raised, folded into spec:** Capture naming no address is refused — `shared-auth-test-sign-in-US1-TC7-1` → `shared-auth-test-sign-in-SC-23`.
- **Raised, folded into spec:** Capture for one tester does not return another's mail — `shared-auth-test-sign-in-US1-TC8-1` → `shared-auth-test-sign-in-SC-18`.
- **Raised, folded into spec:** Last of several mails is the later send — `shared-auth-test-sign-in-US1-TC10-1` → `shared-auth-test-sign-in-SC-19`.
- **Raised, folded into spec:** A used link is not aged — `shared-auth-test-sign-in-US1-TC13-1` → `shared-auth-test-sign-in-SC-20`.
- **Raised, folded into spec:** A missing link is not aged — `shared-auth-test-sign-in-US1-TC14-1` → `shared-auth-test-sign-in-SC-21`.
- **Raised, folded into spec:** Capture does not mint a session — `shared-auth-test-sign-in-US1-TC24-1` → `shared-auth-test-sign-in-SC-22`.
- **Raised, folded into spec:** Last mail is the last send, including a used one — `shared-auth-test-sign-in-US1-TC29-1` → `shared-auth-test-sign-in-SC-27`.
- **Raised, folded into spec:** A second capture returns the same last mail until another send — `shared-auth-test-sign-in-US1-TC26-1` → `shared-auth-test-sign-in-SC-24`.
- **Raised, folded into spec:** Preparing an admin-only tester that already holds admin leaves it holding admin — `shared-auth-test-sign-in-US1-TC27-1` → `shared-auth-test-sign-in-SC-25`.
- **Raised, folded into spec:** Banning an already-banned ban-only tester leaves it banned — `shared-auth-test-sign-in-US1-TC28-1` → `shared-auth-test-sign-in-SC-26`.
- **Raised, folded into spec:** Unban through this door is refused — `shared-auth-test-sign-in-US1-TC30-1` → `shared-auth-test-sign-in-SC-09` (scenario reading; the suite's first pass skipped unban as a non-goal feature, then added the refusal case so the SHALL NOT is walked).
- **Raised, rejected:** Ban-only starts unbanned — setup for the happy-path ban (`shared-auth-test-sign-in-SC-07`), not a product rule. The already-banned partition is `shared-auth-test-sign-in-SC-26`.
- **Raised, rejected:** Age is only for the collector tester — the PRD already limits every move to an address on the list; `shared-auth-test-sign-in-SC-06` GIVEN is any allowlisted tester.
- **Uncovered anchors:** none. Every Feature set root group has a scenario and a case.
