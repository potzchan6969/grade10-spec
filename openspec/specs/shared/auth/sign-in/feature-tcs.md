# shared/auth/sign-in Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## shared-auth-sign-in-US1: Collector asks for and follows a sign-in link

**As a** collector,
**I want** a link emailed to the address I submit to sign me in once,
**so that** I reach my account without a password, and a used or expired link cannot.

### shared-auth-sign-in-US1-TC1-1: Activating again during flight starts no second request

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**
A sign-in command whose request is in flight. Network manipulation holds that request.

**Steps:**

1. Navigate to <grade10 sign-in url>.
2. Activate the running command again.

**Expected Results:**

* No second request reaches the auth service.
* Both activations settle with the one request's outcome.

### shared-auth-sign-in-US1-TC2-1: Email step runs one command and only that one looks busy

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**
A collector on the email step whose send-link request is in flight.

**Steps:**

1. Navigate to <grade10 sign-in url> and start send-link.
2. Activate the send-code control while send-link is in flight.
3. Check busy states.

**Expected Results:**

* No code request starts and no second email is sent.
* Only the running command shows its busy state.

### shared-auth-sign-in-US1-TC3-1: Settled request frees the email step

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**
An email step whose in-flight request has settled.

**Steps:**

1. Navigate to <grade10 sign-in url>.
2. Activate either control after the previous request settled.

**Expected Results:**

* That command starts normally.

### shared-auth-sign-in-US1-TC4-1: Valid unused link creates a session

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**
A person who asked for a sign-in link at an email address.

**Steps:**

1. Follow the unused, unexpired link from that email.

**Expected Results:**

* They are signed in as the account for that address.

### shared-auth-sign-in-US1-TC5-1: Used link does not sign in again

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**
A sign-in link that has already created a session.

**Steps:**

1. Follow that link again.

**Expected Results:**

* No new session is created.

### shared-auth-sign-in-US1-TC6-1: Expired link does not sign in

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**
A sign-in link whose time to live has ended.

**Steps:**

1. Follow that link.

**Expected Results:**

* No session is created.

### shared-auth-sign-in-US1-TC7-1: Failed send is reported and does not sign in

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**
<The sign-in link send endpoint> is mocked to fail.

**Steps:**

1. Navigate to <grade10 sign-in url>.
2. Ask for a sign-in link.

**Expected Results:**

* The surface states that the link was not sent.
* The person is not signed in.

### shared-auth-sign-in-US1-TC8-1: First send does not disclose whether the address is new

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**
An email that has never signed in.

**Steps:**

1. Navigate to <grade10 sign-in url>.
2. Ask for a sign-in link and wait for the send to go out.

**Expected Results:**

* The surface treats it as a sent link.
* It does not state that no account exists.

### shared-auth-sign-in-US1-TC9-1: New link kills the earlier unused link

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**
An unused unexpired sign-in link for an address.

**Steps:**

1. Ask for a later sign-in-link email to that address.
2. Follow the earlier link.

**Expected Results:**

* Following the earlier link creates no session.

---

## shared-auth-sign-in-US2: Collector signs in with an emailed code

**As a** collector,
**I want** a code emailed to the address I submit to sign me in,
**so that** I can finish on the same device, and a wrong or spent code cannot.

### shared-auth-sign-in-US2-TC1-1: Correct unused code creates a session

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-02

**Pre-conditions:**
A person who asked for a sign-in code at an email address.

**Steps:**

1. Navigate to <grade10 sign-in url>.
2. Submit the unused, unexpired code from that email.

**Expected Results:**

* They are signed in as the account for that address.

### shared-auth-sign-in-US2-TC2-1: Incorrect code is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-02

**Pre-conditions:**
A person on the code step for an address that has an unused code.

**Steps:**

1. Submit a code that is not the unused code for that address.

**Expected Results:**

* The surface states that the code did not work.
* They are not signed in.

### shared-auth-sign-in-US2-TC3-1: Expired code is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-02

**Pre-conditions:**
A sign-in code whose time to live has ended.

**Steps:**

1. Submit that code.

**Expected Results:**

* The surface states that the code did not work.
* They are not signed in.

### shared-auth-sign-in-US2-TC4-1: Three wrong submits kill the unused code

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-02

**Pre-conditions:**
A person who has submitted three incorrect codes for the unused code sent to an address.

**Steps:**

1. Submit that unused code.

**Expected Results:**

* They are not signed in.

### shared-auth-sign-in-US2-TC5-1: New code kills the earlier unused link

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-02

**Pre-conditions:**
An unused unexpired sign-in link for an address.

**Steps:**

1. Ask for a later sign-in-code email to that address.
2. Follow the earlier link.

**Expected Results:**

* Following the earlier link creates no session.

---

## shared-auth-sign-in-US3: Collector signs in with Google when the brand offers it

**As a** collector,
**I want** Google sign-in when this brand offers it,
**so that** I can use an account I already have, and a brand that does not offer it does not show it.

### shared-auth-sign-in-US3-TC1-1: Brand with Google offers it and a verified email signs in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-03

**Pre-conditions:**
A brand that has Google sign-in.

**Steps:**

1. Navigate to <grade10 sign-in url>.
2. Complete Google sign-in with a verified email.

**Expected Results:**

* The Google control is present.
* Completing Google sign-in with a verified email signs them in as the account for that address.

### shared-auth-sign-in-US3-TC2-1: Unverified Google email does not sign in

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-03

**Pre-conditions:**
A brand that has Google sign-in.

**Steps:**

1. Navigate to <grade10 sign-in url>.
2. Complete Google sign-in with an email Google has not verified.

**Expected Results:**

* No account is created from that request.
* They are not signed in.

### shared-auth-sign-in-US3-TC3-1: Brand without Google hides the control

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-03

**Pre-conditions:**
A brand that does not have Google sign-in.

**Steps:**

1. Navigate to that brand's sign-in surface.

**Expected Results:**

* No Google sign-in control is shown.

---

## shared-auth-sign-in-US4: Collector keeps one account for one verified address

**As a** collector,
**I want** every successful sign-in at an address to be the same person,
**so that** a later visit, a product-created account, or letter case does not split me.

### shared-auth-sign-in-US4-TC1-1: First visit creates the account

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-04

**Pre-conditions:**
An email address that has never signed in.

**Steps:**

1. Complete any offered sign-in method at that address.

**Expected Results:**

* An account exists for that address.
* The person is signed in as it.

### shared-auth-sign-in-US4-TC2-1: Later visit by another method is the same account

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-04

**Pre-conditions:**
An account that signed in with an emailed link.

**Steps:**

1. Sign in later at the same address with an emailed code, or with Google when the brand has it.

**Expected Results:**

* They enter the same account, not a second one.

### shared-auth-sign-in-US4-TC3-1: Letter case does not create a second account

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-04

**Pre-conditions:**
An account that signed in at `Collector@example.com`.

**Steps:**

1. Sign in later at `collector@example.com`.

**Expected Results:**

* They enter the same account, not a second one.

### shared-auth-sign-in-US4-TC4-1: Plus-tag is a different address

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-04

**Pre-conditions:**
An account at `collector@example.com`.

**Steps:**

1. Complete sign-in at `collector+shop@example.com`.

**Expected Results:**

* A second account exists for that plus-tag address.

### shared-auth-sign-in-US4-TC5-1: Trusted product creates or enters by verified email

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-04

**Pre-conditions:**
A product of this brand that has verified an email.

**Steps:**

1. Ask that product to create or enter the account for a never-signed-in email.
2. Ask again for an email that already signed in with a link.
3. Ask that product to sign that account in.

**Expected Results:**

* A new verified email creates an account and returns that user id.
* A known verified email returns the same account, not a second one.
* The person is signed in as that account on this brand.

### shared-auth-sign-in-US4-TC6-1: Client cannot claim an email

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-04

**Pre-conditions:**
None.

**Steps:**

1. From a client, name an email and ask to create an account or a session.

**Expected Results:**

* No account is created from that request.
* The person is not signed in.

### shared-auth-sign-in-US4-TC7-1: Sign-in after a product-created account is the same person

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-04

**Pre-conditions:**
An account created when a product verified an email.

**Steps:**

1. Sign in later at that address with an emailed link, an emailed code, or Google when the brand has it.

**Expected Results:**

* They enter the same account.

---

## shared-auth-sign-in-US5: Collector is not spammed or sent off-brand

**As a** collector,
**I want** a second email within a minute to wait, and a return only to this brand,
**so that** I am not flooded and not delivered to an untrusted address.

### shared-auth-sign-in-US5-TC1-1: Second link send in a minute is told to wait

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-05

**Pre-conditions:**
A sign-in-link email already sent to one address in the last sixty seconds.

**Steps:**

1. Ask that address for another sign-in link.

**Expected Results:**

* No second email is sent.
* The surface tells them to wait.
* It does not state that the link was not sent.

### shared-auth-sign-in-US5-TC2-1: Second code send in a minute is told to wait

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-05

**Pre-conditions:**
A sign-in-code email already sent to one address in the last sixty seconds.

**Steps:**

1. Ask that address for another sign-in code.

**Expected Results:**

* No second email is sent.
* The surface tells them to wait.
* It does not state that the code was not sent.

### shared-auth-sign-in-US5-TC3-1: Code send after a link in a minute is told to wait

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-05

**Pre-conditions:**
A sign-in-link email already sent to one address in the last sixty seconds.

**Steps:**

1. Ask that address for a sign-in code.

**Expected Results:**

* No code email is sent.
* The surface tells them to wait.

### shared-auth-sign-in-US5-TC4-1: Untrusted redirect is ignored

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-05

**Pre-conditions:**
A sign-in that names a location off this brand.

**Steps:**

1. Complete sign-in.

**Expected Results:**

* They are on this brand.
* They are not sent to that location.

### shared-auth-sign-in-US5-TC5-1: Missing redirect stays on the brand

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-05

**Pre-conditions:**
A sign-in that names no location.

**Steps:**

1. Complete sign-in.

**Expected Results:**

* They are on this brand.
