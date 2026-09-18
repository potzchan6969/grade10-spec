# shared/auth/sign-in Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-15, tcs-rules r3.0
**Out of suite:** shared-auth-sign-in-SC-34

## Background

* Every tab a case names is open in one browser on one device, unless the case names another device.
* A tab is returned to as the person left it, never reloaded.

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
* **Automation status:** automated
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
* **Automation status:** automated
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
* **Automation status:** automated
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
* **Automation status:** automated
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
* **Automation status:** automated
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
* **Automation status:** automated
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
* **Automation status:** automated
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

### shared-auth-sign-in-US1-TC9-1: Link followed inside five minutes signs the collector in

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**

* customer is signed out.
* A sign-in email for collector@example.com, an address with an account, has gone out and its link is unused.

**Test data:**

Runs once per row of **Test data**.

| `<follow delay>` | Grade10 answers |
| --- | --- |
| 4 minutes after the send | signs the collector in |
| 4 minutes 59 seconds after the send | signs the collector in |

**Steps:**

1. Let `<follow delay>` pass after the send.
2. Follow the link in the sign-in email.

**Expected Results:**

* Grade10 answers as the row states.
* The signed-in account is the one for collector@example.com.

### shared-auth-sign-in-US1-TC10-1: Resend countdown reaching zero leaves the sent link alive

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**

* customer is on <grade10 sign-in url>, signed out, at the confirmation step.
* A sign-in email for <collector email> has gone out and <sign-in link> is unused.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<sign-in link>` | The unused link from that sign-in email |

**Steps:**

1. Wait for the Resend control to turn on again, without resending.
2. Follow <sign-in link>, ninety seconds after the send.

**Expected Results:**

* The link signs the collector in.
* The signed-in account is the one for <collector email>.

### shared-auth-sign-in-US1-TC11-1: A resent link's five minutes run from its own send

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
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**

* customer is on <grade10 sign-in url>, signed out, at the confirmation step.
* A first sign-in email for <collector email> went out sixty seconds ago and its link is unused.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<later link>` | The link from the second sign-in email |

**Steps:**

1. Resend the sign-in email.
2. Let four minutes pass after the second send.
3. Follow <later link>.

**Expected Results:**

* The link signs the collector in, five minutes after the first send.
* The signed-in account is the one for <collector email>.

### shared-auth-sign-in-US1-TC12-1: The session outlives the link that created it

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
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**

* customer is signed out.
* A sign-in link for <collector email> is unused and four minutes past its send.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<sign-in link>` | The unused link from that sign-in email |

**Steps:**

1. Follow <sign-in link>.
2. Let a further ten minutes pass.
3. Reload the account page.

**Expected Results:**

* Step 1 signs the collector in.
* The collector is still signed in fifteen minutes after the send.

### shared-auth-sign-in-US1-TC13-1: Recorded link expiry is five minutes after the send

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
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**

* customer is signed out.
* No unused sign-in link exists for <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<send time>` | The instant the sign-in email is sent |

**Steps:**

1. Send a sign-in link to <collector email> at <send time>.
2. Read the recorded expiry for that link.
3. Let the sixty-second resend wait end and read the expiry again.

**Expected Results:**

* The recorded expiry is <send time> plus five minutes.
* The expiry is unchanged at step 3.

### shared-auth-sign-in-US1-TC14-1: The email promises five minutes in every locale

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**

* customer is on <grade10 sign-in url>, signed out, with `<locale>` in force.

**Test data:**

Runs once per row of **Test data**.

| `<locale>` | The body promises |
| --- | --- |
| The default locale | five minutes |
| Traditional Chinese | five minutes |
| Simplified Chinese | five minutes |

**Steps:**

1. Submit collector@example.com at the email step.
2. Open the sign-in email.
3. Read the sentence that states how long the link lasts.

**Expected Results:**

* The body promises what the row states.
* No row's body states fifteen minutes or any other duration.

### shared-auth-sign-in-US1-TC15-1: The promised duration is the enforced duration

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**

* customer is signed out.
* A sign-in email for <collector email> has gone out and <sign-in link> is unused.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<sign-in link>` | The unused link from that sign-in email |
| `<promised duration>` | The lifetime the email body states |

**Steps:**

1. Read <promised duration> from the email body.
2. Follow <sign-in link> thirty seconds before <promised duration> ends.

**Expected Results:**

* <promised duration> reads five minutes.
* The link signs the collector in.

### shared-auth-sign-in-US1-TC16-1: Link followed past five minutes does not sign in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**

* customer is signed out.
* A sign-in email for collector@example.com, an address with an account, has gone out and its link is unused.

**Test data:**

Runs once per row of **Test data**.

| `<follow delay>` | Grade10 answers |
| --- | --- |
| exactly 5 minutes after the send | creates no session |
| 5 minutes 1 second after the send | creates no session |
| 6 minutes after the send | creates no session |

**Steps:**

1. Let `<follow delay>` pass after the send.
2. Follow the link in the sign-in email.

**Expected Results:**

* Grade10 answers as the row states.
* The surface still shows the person as signed out.

### shared-auth-sign-in-US1-TC17-1: Used link stays refused inside its five minutes

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
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**

* customer is signed out in a fresh browser session.
* <used link> created a session two minutes after its send, and four minutes have passed since that send.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<used link>` | The sign-in link that already created a session |

**Steps:**

1. Follow <used link>.
2. Read the signed-in state on the surface.

**Expected Results:**

* No session is created.
* The surface still shows the person as signed out.

### shared-auth-sign-in-US1-TC18-1: Device clock set back does not revive an expired link

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**

* customer is signed out on a device whose clock is set one hour behind.
* <expired link> for <collector email> is six minutes past its send.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<expired link>` | A sign-in link whose time to live has ended |

**Steps:**

1. Follow <expired link>.
2. Read the signed-in state on the surface.

**Expected Results:**

* No session is created.
* The surface still shows the person as signed out.

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
* **Automation status:** automated
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
* **Automation status:** automated
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
* **Automation status:** automated
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
* **Automation status:** automated
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
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-05

**Pre-conditions:**
customer opened <grade10 sign-in url> directly, so the sign-in names no return location, and is signed out.

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
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
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
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-05

Runs once per row of **Test data**.

**Pre-conditions:**
customer is on <grade10 sign-in url> naming <off-brand location>, signed out.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

| `<off-brand location>` | `<why it is off brand>` |
| --- | --- |
| https://collector-rewards.example.com/claim | an address outside this store |
| <zzz sign-in url> | another brand of this store |

**Steps:**

1. Submit <collector email> at the email step.
2. Follow the unused, unexpired link from that email.

**Expected Results:**

* The collector lands on this brand.
* The collector is not sent to <off-brand location>.

---

## shared-auth-sign-in-US7: Collector confirms the send and can resend

**As a** collector,
**I want** the dialog titled Check Your Email, my address on its own line, and
Resend after a short wait,
**so that** I know where to look and can ask again without a Back control.

### shared-auth-sign-in-US7-TC1-1: Successful send shows Check Your Email and the address on its own line

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-07

**Pre-conditions:**

* customer is signed out and is on <grade10 sign-in url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com |

**Steps:**

1. Enter <collector email> at the email step.
2. Activate **Sign In with Email**.
3. Wait until the send settles successfully.

**Expected Results:**

* The dialog title is **Check Your Email**.
* A confirmation lead line is shown.
* <collector email> appears on the line below that lead.
* The surface does not state whether an account already exists.

---

### shared-auth-sign-in-US7-TC2-1: Link-sent surface has no Back control

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-07

**Pre-conditions:**

* customer is on the link-sent confirmation after a successful send.

**Steps:**

1. Inspect the controls on the dialog body.

**Expected Results:**

* No Back control is present.
* Leaving the dialog is by dismissing it.

---

### shared-auth-sign-in-US7-TC3-1: Email-step CTA is Sign In with Email

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-07

**Pre-conditions:**

* customer is signed out and is on <grade10 sign-in url>.

**Steps:**

1. Reach the email step.
2. Read the send action label and the other controls on the surface.

**Expected Results:**

* The send action is labelled **Sign In with Email**.
* No control on the surface uses the words magic link.

---

### shared-auth-sign-in-US7-TC4-1: Resend is disabled with a countdown after a send

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-07

**Pre-conditions:**

* customer just completed a successful Sign In with Email send to
  <collector email>.

**Steps:**

1. Read the Resend control on the link-sent surface.

**Expected Results:**

* Resend is disabled.
* Its label is **Resend (n)** with the whole seconds left in the sixty-second
  wait.

---

### shared-auth-sign-in-US7-TC5-1: Resend re-enables when the countdown reaches zero

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
* **Trace:** shared-auth-sign-in-US-07

**Pre-conditions:**

* customer is on the link-sent confirmation with Resend disabled and counting
  down.

**Steps:**

1. Wait until sixty seconds have passed since the last successful send.
2. Read the Resend control.

**Expected Results:**

* Resend is enabled.
* Its label is **Resend**.

---

### shared-auth-sign-in-US7-TC6-1: A successful resend restarts the countdown

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
* **Trace:** shared-auth-sign-in-US-07

**Pre-conditions:**

* customer is on the link-sent confirmation with Resend enabled.
* more than sixty seconds have passed since the previous send.

**Steps:**

1. Activate **Resend**.
2. Wait until the send settles successfully.
3. Read the Resend control.

**Expected Results:**

* Resend is disabled again for sixty seconds.
* Its label is **Resend (n)** with the whole seconds left.

---

### shared-auth-sign-in-US7-TC7-1: A link older than sixty seconds does not sign in

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-07

**Pre-conditions:**

* a sign-in link for <collector email> was sent more than sixty seconds ago.

**Test data:**

| Field | Value |
| --- | --- |
| `<expired link>` | The sign-in link whose time to live has ended |

**Steps:**

1. Follow <expired link>.

**Expected Results:**

* No session is created.

---

## shared-auth-sign-in-US8: Collector follows the link and the tab that asked carries on

**As a** collector who asked for a sign-in link and followed it in another tab,
**I want** the tab I asked from to finish what it stopped me doing,
**so that** I am not sent back to press the same thing a second time.

### shared-auth-sign-in-US8-TC1-1: Asking tab closes the dialog and shows the collector signed in

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out, with tab A on <grade10 store url> showing Check Your Email.
* Tab A is in the background.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A shows the collector signed in, unreloaded.
* The Check Your Email dialog is gone.

### shared-auth-sign-in-US8-TC2-1: Asking tab completes what the collector was refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out on <refused action>'s surface in tab A.
* Tab A shows Check Your Email after asking for a link at <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<listing>` | a card listing with an add-to-cart control |
| `<lot>` | a live auction lot open to bid on |
| `<bid amount>` | the lowest bid the lot accepts |
| `<signed-in-only page>` | the collector's orders list, which only they may read |

| `<refused action>` | What must have happened |
| --- | --- |
| add <listing> to the cart | <listing> is in the collector's cart |
| bid <bid amount> on <lot> | the bid stands on <lot> |
| open <signed-in-only page> | tab A is on <signed-in-only page> |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab A.

**Expected Results:**

* <refused action> is done in tab A.
* The collector is not asked to do it again.

### shared-auth-sign-in-US8-TC3-1: Tab that asked for nothing completes no action

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
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out, with tab A on <grade10 store url> showing Check Your Email.
* Tab C is open on <listing>, where nothing was asked for and nothing was refused.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<listing>` | a card listing with an add-to-cart control |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab C.

**Expected Results:**

* Tab C shows the collector signed in.
* Tab C adds nothing to the cart and places no bid.

### shared-auth-sign-in-US8-TC4-1: Failed link follow leaves the asking tab as it was

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out on <listing> in tab A, refused the add to the cart.
* Tab A shows Check Your Email after asking for a link at <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<listing>` | a card listing with an add-to-cart control |

| `<failed link>` | What it is |
| --- | --- |
| expired | a link older than sixty seconds |
| already used | a link followed once already |
| banned | a link for an account that is banned |

**Steps:**

1. Follow the <failed link> in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A shows nobody signed in.
* <listing> is in no cart.
* Tab A says nothing about the link.

### shared-auth-sign-in-US8-TC5-1: Asking tab moved on before the link was followed

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
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out on <listing> in tab A, refused the add to the cart.
* Tab A shows Check Your Email after asking for a link at <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<listing>` | a card listing with an add-to-cart control |

**Steps:**

1. Dismiss the dialog in tab A and navigate to <grade10 store url>.
2. Follow the unused, unexpired link from that email in tab B.
3. Return to tab A.

**Expected Results:**

* Tab A shows the collector signed in.
* The add is not carried out: dismissing the ask dropped it.
* The cart holds no line for <listing>.

### shared-auth-sign-in-US8-TC6-1: Refused action is done once, not twice

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out on <listing> in tab A, refused the add to the cart.
* Tab A shows Check Your Email after asking for a link at <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<listing>` | a card listing with an add-to-cart control |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab A, and confirm <listing> is in the cart once.
3. Leave tab A and return to it again, without touching the add control.

**Expected Results:**

* The cart still holds one line for <listing>, not a doubled line.
* Returning a second time carries the add out no further times.

### shared-auth-sign-in-US8-TC7-1: Asking tab on another site of the brand carries on

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
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out on <lot> in tab A, refused the bid.
* Tab A shows Check Your Email after asking for a link at <collector email>.
* The link lands on <grade10 store url>, another site of the brand.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<lot>` | a live auction lot open to bid on |
| `<bid amount>` | the lowest bid the lot accepts |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A shows the collector signed in, unreloaded.
* The bid of <bid amount> stands on <lot>.

### shared-auth-sign-in-US8-TC8-1: Another brand's dialog does not close

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
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out on both brands.
* Tab A is on <zzz store url> showing Check Your Email for a ZZZ link.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Follow the unused, unexpired Grade10 link in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A still shows Check Your Email.
* Tab A shows nobody signed in.

### shared-auth-sign-in-US8-TC9-1: Two tabs asked for a link before either was followed

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
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out, refused the add to the cart on <listing> in tab A.
* customer is refused the bid on <lot> in tab C.
* Both tabs show Check Your Email after asking for a link at <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<listing>` | a card listing with an add-to-cart control |
| `<lot>` | a live auction lot open to bid on |

**Steps:**

1. Follow the newest link from that address in tab B.
2. Return to tab A, then to tab C.

**Expected Results:**

* Both tabs show the collector signed in.
* Tab A carries out its add and tab C carries out its bid: each surface that asked completes its own refusal, whether or not its own link was the one that worked.

### shared-auth-sign-in-US8-TC10-1: Refused action that can no longer be done is refused, not skipped

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out on <listing> in tab A, refused the add to the cart.
* Tab A shows Check Your Email after asking for a link at <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<listing>` | a card listing with an add-to-cart control, of which one remains |

**Steps:**

1. Sell the last <listing> so it can no longer be added.
2. Follow the unused, unexpired link from that email in tab B.
3. Return to tab A.

**Expected Results:**

* Tab A shows the collector signed in.
* Tab A reports the refusal an add is ordinarily refused with when the listing is gone.
* Tab A does not pass the add over in silence.

### shared-auth-sign-in-US8-TC11-1: Dialog on a tab that asked for nothing closes too

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
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out, with tabs A and C open on the same brand, each showing the sign-in dialog.
* A sign-in link was asked for in tab A only.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab A, then to tab C.

**Expected Results:**

* Neither tab still shows the sign-in dialog.
* Both tabs show the collector signed in.

## Settled

* Whether a console tab carries on a refused action after its second factor
  belongs to the console's own capability, which specifies no second factor
  at all today.
* An absolute expiry time alongside the link's duration was rejected; the
  duration is the only form the promise takes.
* The confirmation dialog stating the link's lifetime was rejected; the
  promise lives in the email only.
* A lifetime settable per environment or brand was rejected; one lifetime
  applies everywhere.
