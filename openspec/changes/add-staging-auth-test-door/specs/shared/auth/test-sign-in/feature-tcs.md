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
