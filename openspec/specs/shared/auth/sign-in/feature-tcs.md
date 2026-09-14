# shared/auth/sign-in Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0
**Out of suite:** shared-auth-sign-in-SC-34

## shared-auth-sign-in-US1: Collector asks for and follows a sign-in link

**As a** collector,
**I want** a link emailed to the address I submit to sign me in once,
**so that** I reach my account without a password, and a used or expired link cannot.

### shared-auth-sign-in-US1-TC1-1: Valid unused link signs the collector in

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
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**
customer is on <grade10 sign-in url>, signed out.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Submit <collector email> at the email step.
2. Open the sign-in email and follow its unused, unexpired link.

**Expected Results:**

* The link lands the collector on this brand, signed in.
* The signed-in account is the one for <collector email>.

### shared-auth-sign-in-US1-TC2-1: Email step offers the link and no code control

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**
customer is signed out.

**Steps:**

1. Navigate to <grade10 sign-in url>.
2. Reach the email step.

**Expected Results:**

* The step offers sending a sign-in link.
* No control asks for or sends a sign-in code.

### shared-auth-sign-in-US1-TC3-1: Activating again during flight starts no second request

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**

* customer is on <grade10 sign-in url>, signed out.
* The send-link request is held open by manipulated network conditions, so it stays in flight.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Submit <collector email> at the email step.
2. Activate the same send-link command again while its request is held.
3. Release the held request.

**Expected Results:**

* Only one send-link request reaches the auth service.
* Both activations settle with that one request's outcome.

### shared-auth-sign-in-US1-TC4-1: First send does not disclose that the address is new

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**
customer is on <grade10 sign-in url>, signed out.

**Test data:**

| Field | Value |
| --- | --- |
| `<new email>` | newcomer@example.com, an address that has never signed in |

**Steps:**

1. Submit <new email> at the email step.

**Expected Results:**

* The surface treats it as a sent link.
* Nothing on the surface states that no account exists.

### shared-auth-sign-in-US1-TC5-1: Used link does not sign in again

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
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**

* A sign-in link for <collector email> has already created a session.
* customer is signed out in a fresh browser session.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<used link>` | The sign-in link that already created a session |

**Steps:**

1. Follow <used link>.

**Expected Results:**

* No session is created.
* The surface still shows the person as signed out.

### shared-auth-sign-in-US1-TC6-1: Expired link does not sign in

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
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**

* customer is signed out.
* A sign-in link for <collector email> is past its time to live.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<expired link>` | A sign-in link whose time to live has ended |

**Steps:**

1. Follow <expired link>.

**Expected Results:**

* No session is created.
* The surface still shows the person as signed out.

### shared-auth-sign-in-US1-TC7-1: New link kills the earlier unused link

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
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**

* customer is signed out.
* <earlier link> is unused and unexpired for <collector email>.
* The sixty-second window since <earlier link> was sent has passed.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<earlier link>` | The unused unexpired link from the first sign-in email |

**Steps:**

1. Submit <collector email> at the email step to send a later sign-in email.
2. Follow <earlier link>.

**Expected Results:**

* No session is created from <earlier link>.
* The surface still shows the person as signed out.

### shared-auth-sign-in-US1-TC8-1: Failed send is reported and does not sign in

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**

* customer is on <grade10 sign-in url>, signed out.
* The sign-in-link send is mocked to fail.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Submit <collector email> at the email step.

**Expected Results:**

* The surface states that the link was not sent.
* The person is not signed in.

---

## shared-auth-sign-in-US3: Collector signs in with Google when the brand offers it

**As a** collector,
**I want** Google sign-in when this brand offers it,
**so that** I can use an account I already have, and a brand that does not offer it does not show it.

### shared-auth-sign-in-US3-TC1-1: Brand with Google offers it and a verified email signs in

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
* **Trace:** shared-auth-sign-in-US-03

**Pre-conditions:**
customer is signed out on a brand that has Google sign-in.

**Test data:**

| Field | Value |
| --- | --- |
| `<verified google email>` | collector@example.com, verified by Google |

**Steps:**

1. Navigate to <sign-in url of a brand with google sign-in>.
2. Activate the Google control.
3. Complete Google sign-in with <verified google email>.

**Expected Results:**

* Step 1 shows the Google control on the sign-in surface.
* The collector is signed in as the account for <verified google email>.

### shared-auth-sign-in-US3-TC2-1: Brand without Google hides the control

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-03

**Pre-conditions:**
customer is signed out on a brand that does not have Google sign-in.

**Steps:**

1. Navigate to <sign-in url of a brand without google sign-in>.

**Expected Results:**

* No Google sign-in control is shown.

### shared-auth-sign-in-US3-TC3-1: Unverified Google email does not sign in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-03

**Pre-conditions:**

* customer is signed out on a brand that has Google sign-in.
* The Google sign-in response is stubbed to return <unverified google email> with its verified flag false.

**Test data:**

| Field | Value |
| --- | --- |
| `<unverified google email>` | collector@workspace-example.com, returned by Google as not verified |

**Steps:**

1. Navigate to <sign-in url of a brand with google sign-in>.
2. Complete Google sign-in with <unverified google email>.

**Expected Results:**

* No account is created for <unverified google email>.
* The person is not signed in.

---

## shared-auth-sign-in-US4: Collector keeps one account for one verified address

**As a** collector,
**I want** every successful sign-in at an address to be the same person,
**so that** a later visit, a product-created account, or letter case does not split me.

### shared-auth-sign-in-US4-TC1-1: First sign-in at a new address creates the account

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
* **Trace:** shared-auth-sign-in-US-04

**Pre-conditions:**
customer is on <grade10 sign-in url>, signed out.

**Test data:**

| Field | Value |
| --- | --- |
| `<new email>` | newcomer@example.com, an address that has never signed in |

**Steps:**

1. Submit <new email> at the email step.
2. Follow the unused, unexpired link from that email.

**Expected Results:**

* An account exists for <new email>.
* The person is signed in as that account.

### shared-auth-sign-in-US4-TC2-1: Later sign-in at the same address enters one account

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-04

Runs once per row of **Test data**.

**Pre-conditions:**

* <link-created email> has an account created by an emailed link.
* customer is signed out.

**Test data:**

| Field | Value |
| --- | --- |
| `<link-created email>` | collector-link@example.com, an account created by an emailed link |

| `<method>` | `<outcome>` |
| --- | --- |
| A later emailed link at <link-created email> | the same account, not a second one |
| Google sign-in at <link-created email> on a brand that has Google | the same account, not a second one |

**Steps:**

1. Complete sign-in by <method>.
2. Read the signed-in account.

**Expected Results:**

* The person enters <outcome>.
* No second account exists for <link-created email>.

### shared-auth-sign-in-US4-TC3-1: Letter case does not create a second account

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-04

**Pre-conditions:**

* An account exists for Collector@example.com.
* customer is signed out.

**Test data:**

| Field | Value |
| --- | --- |
| `<lower case address>` | collector@example.com |

**Steps:**

1. Submit <lower case address> at the email step.
2. Follow the unused, unexpired link from that email.
3. Read the signed-in account.

**Expected Results:**

* The person enters the account for Collector@example.com.
* No second account exists for that address.

### shared-auth-sign-in-US4-TC4-1: Plus-tag is a different address

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-04

**Pre-conditions:**

* An account exists for collector@example.com.
* customer is signed out.

**Test data:**

| Field | Value |
| --- | --- |
| `<plus-tag address>` | collector+shop@example.com |

**Steps:**

1. Submit <plus-tag address> at the email step.
2. Follow the unused, unexpired link from that email.
3. Read the signed-in account.

**Expected Results:**

* A second account exists for <plus-tag address>.
* It is not the account for collector@example.com.

### shared-auth-sign-in-US4-TC5-1: Trusted product creates or enters by verified email

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-04

Runs once per row of **Test data**.

**Pre-conditions:**
A product of this brand has verified <address>.

**Test data:**

| `<address>` | `<outcome>` |
| --- | --- |
| newcomer@example.com, never signed in | an account exists for it and its user id is returned |
| collector@example.com, with an account from an emailed link | that same account's user id is returned |

**Steps:**

1. Ask the auth service to create or enter the account for <address>.

**Expected Results:**

* The product receives <outcome>.
* No second account exists for <address>.

### shared-auth-sign-in-US4-TC6-1: Trusted product signs the person in on this brand

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-04

**Pre-conditions:**

* customer is signed out on this brand.
* <trusted product> has verified <product-verified email> in its own flow.

**Test data:**

| Field | Value |
| --- | --- |
| `<trusted product>` | The Grade10 hosted identity verification (e-KYC), a product of this brand |
| `<product-verified email>` | collector-verified@example.com, verified by <trusted product> (e-KYC) |

**Steps:**

1. Complete <trusted product>'s identity verification for <product-verified email>.
2. Ask the auth service, as <trusted product>, to sign that account in.
3. Read who the caller is on this brand.

**Expected Results:**

* The person is signed in as the account for <product-verified email>.
* No sign-in link or Google sign-in was completed for it.

### shared-auth-sign-in-US4-TC7-1: Sign-in after a product-created account is the same person

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-04

**Pre-conditions:**

* <product-verified email> has an account created when a product verified it.
* customer is on <grade10 sign-in url>, signed out.

**Test data:**

| Field | Value |
| --- | --- |
| `<product-verified email>` | collector-verified@example.com, verified by the hosted identity verification (e-KYC) |

**Steps:**

1. Submit <product-verified email> at the email step.
2. Follow the unused, unexpired link from that email.
3. Read the signed-in account.

**Expected Results:**

* The person enters the product-created account.
* No second account exists for <product-verified email>.

### shared-auth-sign-in-US4-TC8-1: Client cannot claim an email

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-04

Runs once per row of **Test data**.

**Pre-conditions:**

* <untrusted client> holds no trusted-product credential for this brand.
* customer is signed out on this brand.

**Test data:**

| Field | Value |
| --- | --- |
| `<untrusted client>` | A caller outside this brand's products, such as a script posting to the auth service directly |

| `<claimed email>` | `<directory after>` |
| --- | --- |
| victim@example.com, an address with an account on this brand | the existing account is unchanged |
| stranger@example.com, an address with no account | no account exists for it |

**Steps:**

1. Send the auth service a create-or-sign-in request naming <claimed email>, as <untrusted client>.
2. Read who the caller is on this brand.
3. Look <claimed email> up in the identity directory.

**Expected Results:**

* No account is created from that request.
* The caller is not signed in as <claimed email>.
* The directory shows <directory after>.

---

## shared-auth-sign-in-US5: Collector is not spammed or sent off-brand

**As a** collector,
**I want** a second email within a minute to wait, and a return only to this brand,
**so that** I am not flooded and not delivered to an untrusted address.

### shared-auth-sign-in-US5-TC1-1: Sign-in naming no location stays on the brand

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-05

**Pre-conditions:**
customer is on <grade10 sign-in url> with no location named, signed out.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Submit <collector email> at the email step.
2. Follow the unused, unexpired link from that email.

**Expected Results:**

* The collector lands on this brand.

### shared-auth-sign-in-US5-TC2-1: Second link send in a minute is told to wait

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-05

**Pre-conditions:**

* A sign-in-link email went out to <collector email> less than sixty seconds ago.
* customer is on <grade10 sign-in url>, signed out.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Ask for another sign-in link at <collector email>.

**Expected Results:**

* No second email is sent.
* The surface tells the collector to wait.
* The surface does not state that the link was not sent.

### shared-auth-sign-in-US5-TC3-1: Untrusted location is ignored

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
* **Trace:** shared-auth-sign-in-US-05

**Pre-conditions:**
customer is on <grade10 sign-in url> naming <off-brand location>, signed out.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<off-brand location>` | A location that is not this brand |

**Steps:**

1. Submit <collector email> at the email step.
2. Follow the unused, unexpired link from that email.

**Expected Results:**

* The collector lands on this brand.
* The collector is not sent to <off-brand location>.
