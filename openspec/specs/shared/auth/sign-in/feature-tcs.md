# shared/auth/sign-in Test Cases

**Status:** reopened · 57/105
**Drafts styled:** 2026-10-06, tcs-rules r4
**Reviewed:** 2026-09-25, tcs-rules r4, lapsed 2026-09-25
**Out of suite:** shared-auth-sign-in-SC-34

## Background

* Every tab a case names is open in one browser on one device, unless the case names another device.
* A tab is returned to as the person left it, never reloaded.

## shared-auth-sign-in-US1: Collector asks for and follows a sign-in link

**As a** collector,
**I want** a link emailed to the address I submit to sign me in once,
**so that** I reach my account without a password, and a used or expired link cannot.

<!-- trace:case id=g10.shared-sign-in.TC-2hq rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq -->
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

<!-- trace:case id=g10.shared-sign-in.TC-vx5 rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq -->
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

<!-- trace:case id=g10.shared-sign-in.TC-uto rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq -->
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

<!-- trace:case id=g10.shared-sign-in.TC-v1z rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq -->
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

<!-- trace:case id=g10.shared-sign-in.TC-ouf rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq -->
### shared-auth-sign-in-US1-TC5-1: Used link does not sign in again

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

<!-- trace:case id=g10.shared-sign-in.TC-r9c rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq -->
### shared-auth-sign-in-US1-TC6-1: Expired link does not sign in

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

<!-- trace:case id=g10.shared-sign-in.TC-6ku rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq -->
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

<!-- trace:case id=g10.shared-sign-in.TC-p0g rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq -->
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

<!-- trace:case id=g10.shared-sign-in.TC-vri rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq -->
### shared-auth-sign-in-US1-TC9-1: A link expires at five minutes

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** automated
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
| exactly 5 minutes after the send | creates no session |
| 5 minutes 1 second after the send | creates no session |
| 6 minutes after the send | creates no session |

**Steps:**

1. Let `<follow delay>` pass after the send.
2. Follow the link in the sign-in email.

**Expected Results:**

* Grade10 answers as the row states.
* A sign-in row enters the account for collector@example.com.
* A no-session row leaves the surface showing the person signed out.

<!-- trace:case id=g10.shared-sign-in.TC-2zv rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq -->
### shared-auth-sign-in-US1-TC10-1: Resend countdown reaching zero leaves the sent link alive

**Classification:**

* **Severity:** blocker
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

<!-- trace:case id=g10.shared-sign-in.TC-uee rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq -->
### shared-auth-sign-in-US1-TC11-1: A resent link's five minutes run from its own send

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

<!-- trace:case id=g10.shared-sign-in.TC-k9t rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq -->
### shared-auth-sign-in-US1-TC12-1: The session outlives the link that created it

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

<!-- trace:case id=g10.shared-sign-in.TC-fv6 rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq -->
### shared-auth-sign-in-US1-TC13-1: Recorded link expiry is five minutes after the send

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
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

<!-- trace:case id=g10.shared-sign-in.TC-j99 rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq -->
### shared-auth-sign-in-US1-TC14-1: The email promises five minutes in every locale

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
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

<!-- trace:case id=g10.shared-sign-in.TC-lw1 rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq -->
### shared-auth-sign-in-US1-TC15-1: The promised duration is the enforced duration

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
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

<!-- trace:case id=g10.shared-sign-in.TC-7f8 rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq -->
### shared-auth-sign-in-US1-TC16-1: Link followed past five minutes does not sign in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

<!-- trace:case id=g10.shared-sign-in.TC-7v1 rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq -->
### shared-auth-sign-in-US1-TC17-1: Used link stays refused inside and past five minutes

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

* customer is signed out in a fresh browser session.
* <used link> created a session two minutes after its send.

**Test data:**

Runs once per row of **Test data**.

| `<follow delay>` | Grade10 answers |
| --- | --- |
| 4 minutes after the send | creates no session |
| 6 minutes after the send | creates no session |

**Steps:**

1. Let `<follow delay>` pass after the send.
2. Follow <used link>.

**Expected Results:**

* Grade10 answers as the row states.
* The surface still shows the person as signed out.

<!-- trace:case id=g10.shared-sign-in.TC-mem rev=1 covers=g10.shared-sign-in.SC-wy5,g10.shared-sign-in.SC-h56,g10.shared-sign-in.SC-q8n,g10.shared-sign-in.SC-7vo,g10.shared-sign-in.SC-9nt,g10.shared-sign-in.SC-wkc,g10.shared-sign-in.SC-yp2,g10.shared-sign-in.SC-juf,g10.shared-sign-in.SC-jqc,g10.shared-sign-in.SC-lfj,g10.shared-sign-in.SC-hs9,g10.shared-sign-in.SC-etq -->
### shared-auth-sign-in-US1-TC18-1: Device clock set back does not revive an expired link

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
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

<!-- trace:case id=g10.shared-sign-in.TC-2dd rev=1 covers=g10.shared-sign-in.SC-eng,g10.shared-sign-in.SC-erl,g10.shared-sign-in.SC-ddm -->
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

<!-- trace:case id=g10.shared-sign-in.TC-rnu rev=1 covers=g10.shared-sign-in.SC-eng,g10.shared-sign-in.SC-erl,g10.shared-sign-in.SC-ddm -->
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

<!-- trace:case id=g10.shared-sign-in.TC-gw0 rev=1 covers=g10.shared-sign-in.SC-eng,g10.shared-sign-in.SC-erl,g10.shared-sign-in.SC-ddm -->
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

<!-- trace:case id=g10.shared-sign-in.TC-ary rev=1 covers=g10.shared-sign-in.SC-kr7,g10.shared-sign-in.SC-nev,g10.shared-sign-in.SC-jqy,g10.shared-sign-in.SC-z8l,g10.shared-sign-in.SC-05p,g10.shared-sign-in.SC-yal,g10.shared-sign-in.SC-aee,g10.shared-sign-in.SC-py9,g10.shared-sign-in.SC-jnb -->
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

<!-- trace:case id=g10.shared-sign-in.TC-hrr rev=1 covers=g10.shared-sign-in.SC-kr7,g10.shared-sign-in.SC-nev,g10.shared-sign-in.SC-jqy,g10.shared-sign-in.SC-z8l,g10.shared-sign-in.SC-05p,g10.shared-sign-in.SC-yal,g10.shared-sign-in.SC-aee,g10.shared-sign-in.SC-py9,g10.shared-sign-in.SC-jnb -->
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

<!-- trace:case id=g10.shared-sign-in.TC-9ep rev=1 covers=g10.shared-sign-in.SC-kr7,g10.shared-sign-in.SC-nev,g10.shared-sign-in.SC-jqy,g10.shared-sign-in.SC-z8l,g10.shared-sign-in.SC-05p,g10.shared-sign-in.SC-yal,g10.shared-sign-in.SC-aee,g10.shared-sign-in.SC-py9,g10.shared-sign-in.SC-jnb -->
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

<!-- trace:case id=g10.shared-sign-in.TC-4vq rev=1 covers=g10.shared-sign-in.SC-kr7,g10.shared-sign-in.SC-nev,g10.shared-sign-in.SC-jqy,g10.shared-sign-in.SC-z8l,g10.shared-sign-in.SC-05p,g10.shared-sign-in.SC-yal,g10.shared-sign-in.SC-aee,g10.shared-sign-in.SC-py9,g10.shared-sign-in.SC-jnb -->
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

<!-- trace:case id=g10.shared-sign-in.TC-4qd rev=1 covers=g10.shared-sign-in.SC-kr7,g10.shared-sign-in.SC-nev,g10.shared-sign-in.SC-jqy,g10.shared-sign-in.SC-z8l,g10.shared-sign-in.SC-05p,g10.shared-sign-in.SC-yal,g10.shared-sign-in.SC-aee,g10.shared-sign-in.SC-py9,g10.shared-sign-in.SC-jnb -->
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

<!-- trace:case id=g10.shared-sign-in.TC-kjy rev=1 covers=g10.shared-sign-in.SC-kr7,g10.shared-sign-in.SC-nev,g10.shared-sign-in.SC-jqy,g10.shared-sign-in.SC-z8l,g10.shared-sign-in.SC-05p,g10.shared-sign-in.SC-yal,g10.shared-sign-in.SC-aee,g10.shared-sign-in.SC-py9,g10.shared-sign-in.SC-jnb -->
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

<!-- trace:case id=g10.shared-sign-in.TC-yvm rev=1 covers=g10.shared-sign-in.SC-kr7,g10.shared-sign-in.SC-nev,g10.shared-sign-in.SC-jqy,g10.shared-sign-in.SC-z8l,g10.shared-sign-in.SC-05p,g10.shared-sign-in.SC-yal,g10.shared-sign-in.SC-aee,g10.shared-sign-in.SC-py9,g10.shared-sign-in.SC-jnb -->
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

<!-- trace:case id=g10.shared-sign-in.TC-3pf rev=1 covers=g10.shared-sign-in.SC-kr7,g10.shared-sign-in.SC-nev,g10.shared-sign-in.SC-jqy,g10.shared-sign-in.SC-z8l,g10.shared-sign-in.SC-05p,g10.shared-sign-in.SC-yal,g10.shared-sign-in.SC-aee,g10.shared-sign-in.SC-py9,g10.shared-sign-in.SC-jnb -->
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

<!-- trace:case id=g10.shared-sign-in.TC-wj2 rev=1 covers=g10.shared-sign-in.SC-fn7,g10.shared-sign-in.SC-p8n,g10.shared-sign-in.SC-eax -->
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

<!-- trace:case id=g10.shared-sign-in.TC-pri rev=1 covers=g10.shared-sign-in.SC-fn7,g10.shared-sign-in.SC-p8n,g10.shared-sign-in.SC-eax -->
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

<!-- trace:case id=g10.shared-sign-in.TC-3ni rev=1 covers=g10.shared-sign-in.SC-fn7,g10.shared-sign-in.SC-p8n,g10.shared-sign-in.SC-eax -->
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

## shared-auth-sign-in-US6: Collector follows a link that cannot sign them in

**As a** collector who opened a sign-in link from email,
**I want** a clear toast on the brand home when that link cannot create a session,
**so that** I know whether to ask for a new link or that I cannot sign in at all.

<!-- trace:case id=g10.shared-sign-in.TC-ryc rev=1 covers=g10.shared-sign-in.SC-4mo,g10.shared-sign-in.SC-66b,g10.shared-sign-in.SC-i3d,g10.shared-sign-in.SC-rt4,g10.shared-sign-in.SC-lja -->
### shared-auth-sign-in-US6-TC1-1: Expired link toasts on the brand home

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
* **Trace:** shared-auth-sign-in-US-06

**Pre-conditions:**

* customer is signed out.
* <expired link> for <collector email> is past its time to live.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<expired link>` | A sign-in link whose time to live has ended |

**Steps:**

1. Follow <expired link>.

**Expected Results:**

* No session is created.
* The collector is on this brand's home.
* A toast states that the link has expired.

<!-- trace:case id=g10.shared-sign-in.TC-bim rev=1 covers=g10.shared-sign-in.SC-4mo,g10.shared-sign-in.SC-66b,g10.shared-sign-in.SC-i3d,g10.shared-sign-in.SC-rt4,g10.shared-sign-in.SC-lja -->
### shared-auth-sign-in-US6-TC2-1: Used link toasts that it no longer works

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-06

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

* No new session is created.
* The collector is on this brand's home.
* A toast states that the link no longer works.

<!-- trace:case id=g10.shared-sign-in.TC-hdt rev=1 covers=g10.shared-sign-in.SC-4mo,g10.shared-sign-in.SC-66b,g10.shared-sign-in.SC-i3d,g10.shared-sign-in.SC-rt4,g10.shared-sign-in.SC-lja -->
### shared-auth-sign-in-US6-TC3-1: Superseded link toasts that it no longer works

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-06

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
* The collector is on this brand's home.
* A toast states that the link no longer works.

<!-- trace:case id=g10.shared-sign-in.TC-5h7 rev=1 covers=g10.shared-sign-in.SC-4mo,g10.shared-sign-in.SC-66b,g10.shared-sign-in.SC-i3d,g10.shared-sign-in.SC-rt4,g10.shared-sign-in.SC-lja -->
### shared-auth-sign-in-US6-TC4-1: Invalid link toasts that it no longer works

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-06

**Pre-conditions:**

* customer is signed out.
* <invalid link> is a sign-in link whose token is malformed or unknown.

**Test data:**

| Field | Value |
| --- | --- |
| `<invalid link>` | A sign-in link token that is malformed or unknown |

**Steps:**

1. Follow <invalid link>.

**Expected Results:**

* No session is created.
* The collector is on this brand's home.
* A toast states that the link no longer works.

<!-- trace:case id=g10.shared-sign-in.TC-1s3 rev=1 covers=g10.shared-sign-in.SC-4mo,g10.shared-sign-in.SC-66b,g10.shared-sign-in.SC-i3d,g10.shared-sign-in.SC-rt4,g10.shared-sign-in.SC-lja -->
### shared-auth-sign-in-US6-TC5-1: Banned account link follow toasts cannot sign in

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
* **Trace:** shared-auth-sign-in-US-06

**Pre-conditions:**

* customer is signed out.
* The account for <banned email> is banned.
* <banned link> is a sign-in link for <banned email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<banned email>` | banned@example.com, an address whose account is banned |
| `<banned link>` | A sign-in link for <banned email> |

**Steps:**

1. Follow <banned link>.

**Expected Results:**

* No session is created.
* The collector is on this brand's home.
* A toast states that they cannot sign in.
* The toast does not invite them to request another link.

---

## shared-auth-sign-in-US7: Collector confirms the send and can resend

**As a** collector,
**I want** the dialog titled Check Your Email, my address on its own line, and
Resend after a short wait,
**so that** I know where to look and can ask again without a Back control.

<!-- trace:case id=g10.shared-sign-in.TC-v74 rev=1 covers=g10.shared-sign-in.SC-y0g,g10.shared-sign-in.SC-66a,g10.shared-sign-in.SC-l77,g10.shared-sign-in.SC-i4n,g10.shared-sign-in.SC-4xi,g10.shared-sign-in.SC-zss,g10.shared-sign-in.SC-fa4 -->
### shared-auth-sign-in-US7-TC1-1: Successful send shows Check Your Email and the address on its own line

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
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

<!-- trace:case id=g10.shared-sign-in.TC-kxd rev=1 covers=g10.shared-sign-in.SC-y0g,g10.shared-sign-in.SC-66a,g10.shared-sign-in.SC-l77,g10.shared-sign-in.SC-i4n,g10.shared-sign-in.SC-4xi,g10.shared-sign-in.SC-zss,g10.shared-sign-in.SC-fa4 -->
### shared-auth-sign-in-US7-TC2-1: Link-sent surface has no Back control

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
* **Trace:** shared-auth-sign-in-US-07

**Pre-conditions:**

* customer is on the link-sent confirmation after a successful send.

**Steps:**

1. Inspect the controls on the dialog body.
2. Dismiss the dialog.

**Expected Results:**

* No Back control is present.
* The dialog is dismissed.
* The collector stays on the same page.

---

<!-- trace:case id=g10.shared-sign-in.TC-7ve rev=1 covers=g10.shared-sign-in.SC-y0g,g10.shared-sign-in.SC-66a,g10.shared-sign-in.SC-l77,g10.shared-sign-in.SC-i4n,g10.shared-sign-in.SC-4xi,g10.shared-sign-in.SC-zss,g10.shared-sign-in.SC-fa4 -->
### shared-auth-sign-in-US7-TC3-1: Email-step CTA is Sign In with Email

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
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

<!-- trace:case id=g10.shared-sign-in.TC-9nf rev=1 covers=g10.shared-sign-in.SC-y0g,g10.shared-sign-in.SC-66a,g10.shared-sign-in.SC-l77,g10.shared-sign-in.SC-i4n,g10.shared-sign-in.SC-4xi,g10.shared-sign-in.SC-zss,g10.shared-sign-in.SC-fa4 -->
### shared-auth-sign-in-US7-TC4-1: Resend is disabled with a countdown after a send

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** usability
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
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

<!-- trace:case id=g10.shared-sign-in.TC-5ex rev=1 covers=g10.shared-sign-in.SC-y0g,g10.shared-sign-in.SC-66a,g10.shared-sign-in.SC-l77,g10.shared-sign-in.SC-i4n,g10.shared-sign-in.SC-4xi,g10.shared-sign-in.SC-zss,g10.shared-sign-in.SC-fa4 -->
### shared-auth-sign-in-US7-TC5-1: Resend re-enables when the countdown reaches zero

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

<!-- trace:case id=g10.shared-sign-in.TC-5w7 rev=1 covers=g10.shared-sign-in.SC-y0g,g10.shared-sign-in.SC-66a,g10.shared-sign-in.SC-l77,g10.shared-sign-in.SC-i4n,g10.shared-sign-in.SC-4xi,g10.shared-sign-in.SC-zss,g10.shared-sign-in.SC-fa4 -->
### shared-auth-sign-in-US7-TC6-1: A successful resend restarts the countdown

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

<!-- trace:case id=g10.shared-sign-in.TC-jb5 rev=1 covers=g10.shared-sign-in.SC-y0g,g10.shared-sign-in.SC-66a,g10.shared-sign-in.SC-l77,g10.shared-sign-in.SC-i4n,g10.shared-sign-in.SC-4xi,g10.shared-sign-in.SC-zss,g10.shared-sign-in.SC-fa4 -->
### shared-auth-sign-in-US7-TC7-1: A link older than sixty seconds does not sign in

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** deprecated
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

<!-- trace:case id=g10.shared-sign-in.TC-oaf rev=1 covers=g10.shared-sign-in.SC-neg,g10.shared-sign-in.SC-wiy,g10.shared-sign-in.SC-laa,g10.shared-sign-in.SC-dyk,g10.shared-sign-in.SC-szm,g10.shared-sign-in.SC-lws,g10.shared-sign-in.SC-m9z -->
### shared-auth-sign-in-US8-TC1-1: Asking tab closes the dialog and shows the collector signed in

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
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

<!-- trace:case id=g10.shared-sign-in.TC-wgf rev=1 covers=g10.shared-sign-in.SC-neg,g10.shared-sign-in.SC-wiy,g10.shared-sign-in.SC-laa,g10.shared-sign-in.SC-dyk,g10.shared-sign-in.SC-szm,g10.shared-sign-in.SC-lws,g10.shared-sign-in.SC-m9z -->
### shared-auth-sign-in-US8-TC2-1: Asking tab completes what the collector was refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
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

<!-- trace:case id=g10.shared-sign-in.TC-gj2 rev=1 covers=g10.shared-sign-in.SC-neg,g10.shared-sign-in.SC-wiy,g10.shared-sign-in.SC-laa,g10.shared-sign-in.SC-dyk,g10.shared-sign-in.SC-szm,g10.shared-sign-in.SC-lws,g10.shared-sign-in.SC-m9z -->
### shared-auth-sign-in-US8-TC3-1: Tab that asked for nothing completes no action

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

<!-- trace:case id=g10.shared-sign-in.TC-iyj rev=1 covers=g10.shared-sign-in.SC-neg,g10.shared-sign-in.SC-wiy,g10.shared-sign-in.SC-laa,g10.shared-sign-in.SC-dyk,g10.shared-sign-in.SC-szm,g10.shared-sign-in.SC-lws,g10.shared-sign-in.SC-m9z -->
### shared-auth-sign-in-US8-TC4-1: Failed link follow leaves the asking tab as it was

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
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
| expired | a link older than five minutes |
| already used | a link followed once already |
| banned | a link for an account that is banned |

**Steps:**

1. Follow the <failed link> in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A shows nobody signed in.
* Tab A still shows the Check Your Email dialog.
* <listing> is in no cart.
* Tab A says nothing about the link.

<!-- trace:case id=g10.shared-sign-in.TC-zy9 rev=1 covers=g10.shared-sign-in.SC-neg,g10.shared-sign-in.SC-wiy,g10.shared-sign-in.SC-laa,g10.shared-sign-in.SC-dyk,g10.shared-sign-in.SC-szm,g10.shared-sign-in.SC-lws,g10.shared-sign-in.SC-m9z -->
### shared-auth-sign-in-US8-TC5-1: Asking tab moved on before the link was followed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
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

1. In tab A, close the **Check Your Email** dialog.
2. In tab A, go to the store home.
3. In tab B, follow the unused, unexpired link from that email.
4. Return to tab A.

**Expected Results:**

* Tab A shows the collector signed in.
* The add is not carried out.
* The cart has no line for <listing>.

<!-- trace:case id=g10.shared-sign-in.TC-54a rev=1 covers=g10.shared-sign-in.SC-neg,g10.shared-sign-in.SC-wiy,g10.shared-sign-in.SC-laa,g10.shared-sign-in.SC-dyk,g10.shared-sign-in.SC-szm,g10.shared-sign-in.SC-lws,g10.shared-sign-in.SC-m9z -->
### shared-auth-sign-in-US8-TC6-1: Refused action is done once, not twice

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** actual
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
3. Leave tab A for tab B, then return to tab A, without touching the add control.

**Expected Results:**

* The cart still holds one line for <listing>, not a doubled line.
* Returning a second time carries the add out no further times.

<!-- trace:case id=g10.shared-sign-in.TC-3kv rev=1 covers=g10.shared-sign-in.SC-neg,g10.shared-sign-in.SC-wiy,g10.shared-sign-in.SC-laa,g10.shared-sign-in.SC-dyk,g10.shared-sign-in.SC-szm,g10.shared-sign-in.SC-lws,g10.shared-sign-in.SC-m9z -->
### shared-auth-sign-in-US8-TC7-1: Asking tab on another site of the brand carries on

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

<!-- trace:case id=g10.shared-sign-in.TC-j4x rev=1 covers=g10.shared-sign-in.SC-neg,g10.shared-sign-in.SC-wiy,g10.shared-sign-in.SC-laa,g10.shared-sign-in.SC-dyk,g10.shared-sign-in.SC-szm,g10.shared-sign-in.SC-lws,g10.shared-sign-in.SC-m9z -->
### shared-auth-sign-in-US8-TC8-1: Another brand's dialog does not close

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
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out on both brands.
* Tab A is on <zzz store url> showing Check Your Email for a ZZZ link.
* An unused, unexpired Grade10 sign-in link has been sent to <collector email>.

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

<!-- trace:case id=g10.shared-sign-in.TC-0m4 rev=1 covers=g10.shared-sign-in.SC-neg,g10.shared-sign-in.SC-wiy,g10.shared-sign-in.SC-laa,g10.shared-sign-in.SC-dyk,g10.shared-sign-in.SC-szm,g10.shared-sign-in.SC-lws,g10.shared-sign-in.SC-m9z -->
### shared-auth-sign-in-US8-TC9-1: Two tabs asked for a link before either was followed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
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

1. Ask for a sign-in link at <collector email> on tab B.
2. Follow the newest link from that address in tab B.
3. Return to tab A, then to tab C.

**Expected Results:**

* Both tabs show the collector signed in.
* Tab A carries out its add and tab C carries out its bid: each surface that asked completes its own refusal, whether or not its own link was the one that worked.

<!-- trace:case id=g10.shared-sign-in.TC-lnk rev=1 covers=g10.shared-sign-in.SC-neg,g10.shared-sign-in.SC-wiy,g10.shared-sign-in.SC-laa,g10.shared-sign-in.SC-dyk,g10.shared-sign-in.SC-szm,g10.shared-sign-in.SC-lws,g10.shared-sign-in.SC-m9z -->
### shared-auth-sign-in-US8-TC10-1: Refused action that can no longer be done is refused, not skipped

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
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

<!-- trace:case id=g10.shared-sign-in.TC-4z2 rev=2 covers=g10.shared-sign-in.SC-neg,g10.shared-sign-in.SC-wiy,g10.shared-sign-in.SC-laa,g10.shared-sign-in.SC-dyk,g10.shared-sign-in.SC-szm,g10.shared-sign-in.SC-lws,g10.shared-sign-in.SC-m9z -->
### shared-auth-sign-in-US8-TC11-2: Dialog on a tab that asked for nothing closes too, on its own side

Runs once per row of **Test data**.

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

* Nobody is signed in on <side url>, with tabs A and C open on it, each showing the sign-in dialog.
* A sign-in link was asked for in tab A only.

**Test data:**

| Side | <side url> | <person email> | <second factor code> |
| --- | --- | --- | --- |
| Site | <grade10 store url> | collector@example.com, an address with an account | None asked |
| Console | <grade10 admin console url> | operator@example.com, the address of an account holding console access | A valid current code from that account's authenticator |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab A, entering <second factor code> where the console asks for one.
3. Return to tab C.

**Expected Results:**

* Step 2 shows tab A with no sign-in dialog and <person email>'s account signed in.
* Step 3 shows tab C with no sign-in dialog and the same account signed in.

---

## shared-auth-sign-in-US9: Collector follows a link meant for a different account

**As a** collector already signed in,
**I want** a clear choice when a sign-in link is meant for another account,
**so that** I am not switched without asking, and can Switch or Stay.

<!-- trace:case id=g10.shared-sign-in.TC-19a rev=1 covers=g10.shared-sign-in.SC-vu9,g10.shared-sign-in.SC-9y1,g10.shared-sign-in.SC-nnn,g10.shared-sign-in.SC-yxx,g10.shared-sign-in.SC-c6r,g10.shared-sign-in.SC-hy8,g10.shared-sign-in.SC-fda -->
### shared-auth-sign-in-US9-TC1-1: Mismatch toast names the link's account and leaves the session untouched

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-09

**Pre-conditions:**

* customer is signed in as `<current account email>`.
* A sign-in link for `<link account email>`, a different address with its own account, is unused and unexpired.

**Test data:**

| Field | Value |
| --- | --- |
| `<current account email>` | collector@example.com, an address with an account, currently signed in |
| `<link account email>` | collector-other@example.com, a different address with its own account |

**Steps:**

1. Follow the link for `<link account email>`.

**Expected Results:**

* The toast states the collector is signed in with a different account.
* The description names `<link account email>`.
* The description does not name `<current account email>`.
* The current session is unaffected: still signed in as `<current account email>`.

<!-- trace:case id=g10.shared-sign-in.TC-xyg rev=1 covers=g10.shared-sign-in.SC-vu9,g10.shared-sign-in.SC-9y1,g10.shared-sign-in.SC-nnn,g10.shared-sign-in.SC-yxx,g10.shared-sign-in.SC-c6r,g10.shared-sign-in.SC-hy8,g10.shared-sign-in.SC-fda -->
### shared-auth-sign-in-US9-TC2-1: Switch ends the current session and enters the link's account

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
* **Trace:** shared-auth-sign-in-US-09

**Pre-conditions:**

* customer is signed in as `<current account email>`.
* The mismatch toast is shown, offering Switch and Stay, after following a sign-in link for `<link account email>`, a different address with its own account.

**Test data:**

| Field | Value |
| --- | --- |
| `<current account email>` | collector@example.com, an address with an account, currently signed in |
| `<link account email>` | collector-other@example.com, a different address with its own account |

**Steps:**

1. Activate Switch.

**Expected Results:**

* The session for `<current account email>` ends.
* The collector is signed in as the account for `<link account email>`.

<!-- trace:case id=g10.shared-sign-in.TC-evk rev=1 covers=g10.shared-sign-in.SC-vu9,g10.shared-sign-in.SC-9y1,g10.shared-sign-in.SC-nnn,g10.shared-sign-in.SC-yxx,g10.shared-sign-in.SC-c6r,g10.shared-sign-in.SC-hy8,g10.shared-sign-in.SC-fda -->
### shared-auth-sign-in-US9-TC3-1: Stay keeps the current session and does not enter the link's account

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
* **Trace:** shared-auth-sign-in-US-09

**Pre-conditions:**

* customer is signed in as `<current account email>`.
* The mismatch toast is shown, offering Switch and Stay, after following a sign-in link for `<link account email>`, a different address with its own account.

**Test data:**

| Field | Value |
| --- | --- |
| `<current account email>` | collector@example.com, an address with an account, currently signed in |
| `<link account email>` | collector-other@example.com, a different address with its own account |

**Steps:**

1. Activate Stay.

**Expected Results:**

* The collector remains signed in as `<current account email>`.
* The account for `<link account email>` is not entered.

<!-- trace:case id=g10.shared-sign-in.TC-0cv rev=1 covers=g10.shared-sign-in.SC-vu9,g10.shared-sign-in.SC-9y1,g10.shared-sign-in.SC-nnn,g10.shared-sign-in.SC-yxx,g10.shared-sign-in.SC-c6r,g10.shared-sign-in.SC-hy8,g10.shared-sign-in.SC-fda -->
### shared-auth-sign-in-US9-TC4-1: Dismissing the toast has the same outcome as Stay

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
* **Trace:** shared-auth-sign-in-US-09

**Pre-conditions:**

* customer is signed in as `<current account email>`.
* The mismatch toast is shown, offering Switch and Stay, after following a sign-in link for `<link account email>`, a different address with its own account.

**Test data:**

| Field | Value |
| --- | --- |
| `<current account email>` | collector@example.com, an address with an account, currently signed in |
| `<link account email>` | collector-other@example.com, a different address with its own account |

**Steps:**

1. Activate the toast's close control.

**Expected Results:**

* The collector remains signed in as `<current account email>`.
* The account for `<link account email>` is not entered.

<!-- trace:case id=g10.shared-sign-in.TC-dr6 rev=1 covers=g10.shared-sign-in.SC-vu9,g10.shared-sign-in.SC-9y1,g10.shared-sign-in.SC-nnn,g10.shared-sign-in.SC-yxx,g10.shared-sign-in.SC-c6r,g10.shared-sign-in.SC-hy8,g10.shared-sign-in.SC-fda -->
### shared-auth-sign-in-US9-TC5-1: Mismatch toast stays until an explicit choice

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
* **Trace:** shared-auth-sign-in-US-09

**Pre-conditions:**

* customer is signed in as `<current account email>`.
* The mismatch toast is shown, offering Switch and Stay, after following a sign-in link for `<link account email>`, a different address with its own account.

**Test data:**

| Field | Value |
| --- | --- |
| `<current account email>` | collector@example.com, an address with an account, currently signed in |
| `<link account email>` | collector-other@example.com, a different address with its own account |

**Steps:**

1. Do not activate Switch, Stay, or the close control.
2. Wait ten seconds, long enough for an ordinary toast to clear.
3. Read the mismatch toast.

**Expected Results:**

* The toast is still shown.
* Switch and Stay are still offered.

<!-- trace:case id=g10.shared-sign-in.TC-tpc rev=1 covers=g10.shared-sign-in.SC-vu9,g10.shared-sign-in.SC-9y1,g10.shared-sign-in.SC-nnn,g10.shared-sign-in.SC-yxx,g10.shared-sign-in.SC-c6r,g10.shared-sign-in.SC-hy8,g10.shared-sign-in.SC-fda -->
### shared-auth-sign-in-US9-TC6-1: Mismatch toast is styled as a warning, not an error

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** actual
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-09

**Pre-conditions:**

* customer is signed in as `<current account email>`.
* The mismatch toast is shown, offering Switch and Stay, after following a sign-in link for `<link account email>`, a different address with its own account.

**Test data:**

| Field | Value |
| --- | --- |
| `<current account email>` | collector@example.com, an address with an account, currently signed in |
| `<link account email>` | collector-other@example.com, a different address with its own account |

**Steps:**

1. Read the toast's visual type.

**Expected Results:**

* The toast uses the warning style, distinct from the error style of the failed-follow toasts.

<!-- trace:case id=g10.shared-sign-in.TC-0gq rev=1 covers=g10.shared-sign-in.SC-vu9,g10.shared-sign-in.SC-9y1,g10.shared-sign-in.SC-nnn,g10.shared-sign-in.SC-yxx,g10.shared-sign-in.SC-c6r,g10.shared-sign-in.SC-hy8,g10.shared-sign-in.SC-fda -->
### shared-auth-sign-in-US9-TC7-1: A link for the signed-in account itself shows no mismatch toast

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
* **Trace:** shared-auth-sign-in-US-09

**Pre-conditions:**

* customer is signed in as `<current account email>`.
* A sign-in link for `<current account email>` itself is unused and unexpired.

**Test data:**

| Field | Value |
| --- | --- |
| `<current account email>` | collector@example.com, an address with an account, currently signed in |

**Steps:**

1. Follow that link.

**Expected Results:**

* No mismatch toast is shown.
* The collector remains signed in as `<current account email>`.

---

## shared-auth-sign-in-US10: Collector sees the wait end when they sign in from another device

**As a** collector who asked for a sign-in link on one device,
**I want** that device's wait to end once I sign in from another,
**so that** I am not left resending for an address I already used to sign in
elsewhere.

<!-- trace:case id=g10.shared-sign-in.TC-uxi rev=1 covers=g10.shared-sign-in.SC-s9k,g10.shared-sign-in.SC-4ki,g10.shared-sign-in.SC-5yx,g10.shared-sign-in.SC-zsr,g10.shared-sign-in.SC-rpa,g10.shared-sign-in.SC-45a,g10.shared-sign-in.SC-2ky,g10.shared-sign-in.SC-6ov,g10.shared-sign-in.SC-j5r -->
### shared-auth-sign-in-US10-TC1-1: Wait ends with a message when the link is followed on another device

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
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer is signed out, with device A on <grade10 store url> showing Check Your Email for <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Follow the unused, unexpired link from that email on device B.
2. Return to device A.

**Expected Results:**

* Device A ends its wait with a message that sign-in completed on another device.
* Device A is not signed in.
* Only device B holds a session.

<!-- trace:case id=g10.shared-sign-in.TC-6va rev=1 covers=g10.shared-sign-in.SC-s9k,g10.shared-sign-in.SC-4ki,g10.shared-sign-in.SC-5yx,g10.shared-sign-in.SC-zsr,g10.shared-sign-in.SC-rpa,g10.shared-sign-in.SC-45a,g10.shared-sign-in.SC-2ky,g10.shared-sign-in.SC-6ov,g10.shared-sign-in.SC-j5r -->
### shared-auth-sign-in-US10-TC2-1: Wait ends the same way when the other device signs in with Google

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
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer is signed out, with device A on <grade10 sign-in url> showing Check Your Email for <collector email>.
* Device A's brand has Google sign-in.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Complete Google sign-in with <collector email> on device B.
2. Return to device A.

**Expected Results:**

* Device A ends its wait with a message that sign-in completed on another device.
* Device A is not signed in.

<!-- trace:case id=g10.shared-sign-in.TC-jal rev=1 covers=g10.shared-sign-in.SC-s9k,g10.shared-sign-in.SC-4ki,g10.shared-sign-in.SC-5yx,g10.shared-sign-in.SC-zsr,g10.shared-sign-in.SC-rpa,g10.shared-sign-in.SC-45a,g10.shared-sign-in.SC-2ky,g10.shared-sign-in.SC-6ov,g10.shared-sign-in.SC-j5r -->
### shared-auth-sign-in-US10-TC3-1: The asking device's own link followed on a different device still only closes the wait

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
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer is signed out, with device A on <grade10 store url> showing Check Your Email after asking for a link at <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Follow the unused, unexpired link asked for on device A, but open it on device B instead.
2. Return to device A.

**Expected Results:**

* Device A ends its wait with a message that sign-in completed on another device.
* Device A is not signed in.
* Device A does not carry on any action the way a same-device tab would.

<!-- trace:case id=g10.shared-sign-in.TC-1jo rev=1 covers=g10.shared-sign-in.SC-s9k,g10.shared-sign-in.SC-4ki,g10.shared-sign-in.SC-5yx,g10.shared-sign-in.SC-zsr,g10.shared-sign-in.SC-rpa,g10.shared-sign-in.SC-45a,g10.shared-sign-in.SC-2ky,g10.shared-sign-in.SC-6ov,g10.shared-sign-in.SC-j5r -->
### shared-auth-sign-in-US10-TC4-1: A failed attempt on the other device leaves the wait running

Runs once per row of **Test data**.

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
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer is signed out, with device A on <grade10 store url> showing Check Your Email for <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

| `<failed attempt>` | What it is |
| --- | --- |
| expired link | a link older than five minutes, followed on device B |
| already used link | a link followed once already, followed again on device B |
| banned account | a link for <collector email> after the account is banned, followed on device B |

**Steps:**

1. Attempt the <failed attempt> on device B.
2. Return to device A.

**Expected Results:**

* Device A still shows Check Your Email, counting down toward Resend.
* Device A is not signed in.

<!-- trace:case id=g10.shared-sign-in.TC-nir rev=1 covers=g10.shared-sign-in.SC-s9k,g10.shared-sign-in.SC-4ki,g10.shared-sign-in.SC-5yx,g10.shared-sign-in.SC-zsr,g10.shared-sign-in.SC-rpa,g10.shared-sign-in.SC-45a,g10.shared-sign-in.SC-2ky,g10.shared-sign-in.SC-6ov,g10.shared-sign-in.SC-j5r -->
### shared-auth-sign-in-US10-TC5-1: A settle for a different address leaves the wait running

Runs once per row of **Test data**.

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
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer is signed out, with device A on <grade10 store url> showing Check Your Email for <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

| `<other address>` | What it is |
| --- | --- |
| unrelated@example.com | an address with no relation to <collector email> |
| collector+shop@example.com | the plus-tag variant of <collector email>, its own account |

**Steps:**

1. Sign in as <other address> on device B.
2. Return to device A.

**Expected Results:**

* Device A still shows Check Your Email, counting down toward Resend.
* Device A is not signed in.

<!-- trace:case id=g10.shared-sign-in.TC-uje rev=1 covers=g10.shared-sign-in.SC-s9k,g10.shared-sign-in.SC-4ki,g10.shared-sign-in.SC-5yx,g10.shared-sign-in.SC-zsr,g10.shared-sign-in.SC-rpa,g10.shared-sign-in.SC-45a,g10.shared-sign-in.SC-2ky,g10.shared-sign-in.SC-6ov,g10.shared-sign-in.SC-j5r -->
### shared-auth-sign-in-US10-TC6-1: Every surface waiting on the address ends its wait

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
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer is signed out, with device A and device C each showing Check Your Email after separately asking for a link at <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Complete Google sign-in with <collector email> on device B.
2. Return to device A, then to device C.

**Expected Results:**

* Both device A and device C end their wait with a message that sign-in completed on another device.
* Neither device A nor device C is signed in.

<!-- trace:case id=g10.shared-sign-in.TC-uhd rev=1 covers=g10.shared-sign-in.SC-s9k,g10.shared-sign-in.SC-4ki,g10.shared-sign-in.SC-5yx,g10.shared-sign-in.SC-zsr,g10.shared-sign-in.SC-rpa,g10.shared-sign-in.SC-45a,g10.shared-sign-in.SC-2ky,g10.shared-sign-in.SC-6ov,g10.shared-sign-in.SC-j5r -->
### shared-auth-sign-in-US10-TC7-1: A backgrounded waiting surface shows the message once returned to

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer is signed out, with device A showing Check Your Email for <collector email>, left in the background.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Complete Google sign-in with <collector email> on device B while device A stays backgrounded.
2. Bring device A back to the foreground.

**Expected Results:**

* Device A shows the message that sign-in completed on another device.
* Device A is not signed in.

<!-- trace:case id=g10.shared-sign-in.TC-g9e rev=1 covers=g10.shared-sign-in.SC-s9k,g10.shared-sign-in.SC-4ki,g10.shared-sign-in.SC-5yx,g10.shared-sign-in.SC-zsr,g10.shared-sign-in.SC-rpa,g10.shared-sign-in.SC-45a,g10.shared-sign-in.SC-2ky,g10.shared-sign-in.SC-6ov,g10.shared-sign-in.SC-j5r -->
### shared-auth-sign-in-US10-TC8-1: The wait ends the same way whether or not Resend has turned on

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer is signed out, with device A showing Check Your Email for <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

| `<resend state>` | On device A |
| --- | --- |
| Resend disabled, counting down | less than sixty seconds since the send |
| Resend enabled | sixty seconds or more since the send, Resend not yet activated |

**Steps:**

1. Reach <resend state> on device A.
2. Complete Google sign-in with <collector email> on device B.
3. Return to device A.

**Expected Results:**

* Device A ends its wait with a message that sign-in completed on another device.
* No further resend email goes out from device A.

<!-- trace:case id=g10.shared-sign-in.TC-pif rev=1 covers=g10.shared-sign-in.SC-s9k,g10.shared-sign-in.SC-4ki,g10.shared-sign-in.SC-5yx,g10.shared-sign-in.SC-zsr,g10.shared-sign-in.SC-rpa,g10.shared-sign-in.SC-45a,g10.shared-sign-in.SC-2ky,g10.shared-sign-in.SC-6ov,g10.shared-sign-in.SC-j5r -->
### shared-auth-sign-in-US10-TC9-1: The check does not disclose whether an unrelated address is signed in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* <signed-in address> is signed in on device B.
* customer is on <grade10 sign-in url> on device A, signed out, having asked for no link.

**Test data:**

| Field | Value |
| --- | --- |
| `<signed-in address>` | collector@example.com, currently signed in on device B |

**Steps:**

1. Ask the auth service, from device A, whether <signed-in address> currently holds a session, naming no flow of device A's own.

**Expected Results:**

* The request is refused.
* Nothing in the response states whether <signed-in address> holds a session.

---

## shared-auth-sign-in-US11: Collector is offered Google sign-in without opening the dialog

**As a** collector, signed out, on a brand that offers Google sign-in,
**I want** Google's own prompt to offer my account without me opening sign-in first,
**so that** I can sign in with a tap, and it never shows at the same time as a sign-in dialog I already opened.

<!-- trace:case id=g10.shared-sign-in.TC-6rq rev=1 covers=g10.shared-sign-in.SC-ph5,g10.shared-sign-in.SC-iaq,g10.shared-sign-in.SC-5lg,g10.shared-sign-in.SC-emf,g10.shared-sign-in.SC-bp4,g10.shared-sign-in.SC-75s,g10.shared-sign-in.SC-psv,g10.shared-sign-in.SC-l6p,g10.shared-sign-in.SC-qqs,g10.shared-sign-in.SC-fsu,g10.shared-sign-in.SC-dl3 -->
### shared-auth-sign-in-US11-TC1-1: Signed-out visitor on a Google-enabled brand is shown the corner prompt unprompted

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
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**
customer is signed out on a brand that has Google sign-in.

**Steps:**

1. Navigate to a page of that brand, signed out, without opening sign-in.

**Expected Results:**

* Google's own corner prompt appears offering sign-in.
* No sign-in dialog is open.

<!-- trace:case id=g10.shared-sign-in.TC-08n rev=1 covers=g10.shared-sign-in.SC-ph5,g10.shared-sign-in.SC-iaq,g10.shared-sign-in.SC-5lg,g10.shared-sign-in.SC-emf,g10.shared-sign-in.SC-bp4,g10.shared-sign-in.SC-75s,g10.shared-sign-in.SC-psv,g10.shared-sign-in.SC-l6p,g10.shared-sign-in.SC-qqs,g10.shared-sign-in.SC-fsu,g10.shared-sign-in.SC-dl3 -->
### shared-auth-sign-in-US11-TC2-1: Brand without Google sign-in never shows the prompt

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
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**
customer is signed out on a brand that does not have Google sign-in.

**Steps:**

1. Navigate to a page of that brand, signed out.
2. Wait long enough for the prompt to have appeared on a Google-enabled brand.

**Expected Results:**

* No corner prompt appears.
* No Google sign-in control of any kind is shown.

<!-- trace:case id=g10.shared-sign-in.TC-y7m rev=1 covers=g10.shared-sign-in.SC-ph5,g10.shared-sign-in.SC-iaq,g10.shared-sign-in.SC-5lg,g10.shared-sign-in.SC-emf,g10.shared-sign-in.SC-bp4,g10.shared-sign-in.SC-75s,g10.shared-sign-in.SC-psv,g10.shared-sign-in.SC-l6p,g10.shared-sign-in.SC-qqs,g10.shared-sign-in.SC-fsu,g10.shared-sign-in.SC-dl3 -->
### shared-auth-sign-in-US11-TC3-1: Signed-in collector never sees the prompt

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
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**
customer is signed in on `<brand>`.

**Test data:**

Runs once per row of **Test data**.

| `<brand>` | `<why chosen>` |
| --- | --- |
| A brand with Google sign-in | confirms the signed-in check withholds it, not just the brand rule |
| A brand without Google sign-in | confirms the brand rule alone already withholds it |

**Steps:**

1. Remain signed in on `<brand>`.
2. Wait long enough for the prompt to have appeared for a signed-out visitor.

**Expected Results:**

* No corner prompt appears on `<brand>`.

<!-- trace:case id=g10.shared-sign-in.TC-m40 rev=1 covers=g10.shared-sign-in.SC-ph5,g10.shared-sign-in.SC-iaq,g10.shared-sign-in.SC-5lg,g10.shared-sign-in.SC-emf,g10.shared-sign-in.SC-bp4,g10.shared-sign-in.SC-75s,g10.shared-sign-in.SC-psv,g10.shared-sign-in.SC-l6p,g10.shared-sign-in.SC-qqs,g10.shared-sign-in.SC-fsu,g10.shared-sign-in.SC-dl3 -->
### shared-auth-sign-in-US11-TC4-1: Prompt does not appear while the sign-in dialog is already open

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
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**
customer is signed out on a brand that has Google sign-in, with the sign-in dialog open.

**Steps:**

1. Open the sign-in dialog.
2. Wait long enough for the prompt to have appeared had the dialog not been open.

**Expected Results:**

* No corner prompt appears while the dialog is open.
* The sign-in dialog remains the only sign-in ask on the page.

<!-- trace:case id=g10.shared-sign-in.TC-ma7 rev=1 covers=g10.shared-sign-in.SC-ph5,g10.shared-sign-in.SC-iaq,g10.shared-sign-in.SC-5lg,g10.shared-sign-in.SC-emf,g10.shared-sign-in.SC-bp4,g10.shared-sign-in.SC-75s,g10.shared-sign-in.SC-psv,g10.shared-sign-in.SC-l6p,g10.shared-sign-in.SC-qqs,g10.shared-sign-in.SC-fsu,g10.shared-sign-in.SC-dl3 -->
### shared-auth-sign-in-US11-TC5-1: Opening the sign-in dialog while the prompt is showing dismisses the prompt

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
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**
customer is signed out on a brand that has Google sign-in, with the corner prompt already showing.

**Steps:**

1. Open the sign-in dialog.

**Expected Results:**

* The corner prompt is dismissed.
* Only the sign-in dialog remains as a sign-in ask.

<!-- trace:case id=g10.shared-sign-in.TC-nvs rev=1 covers=g10.shared-sign-in.SC-ph5,g10.shared-sign-in.SC-iaq,g10.shared-sign-in.SC-5lg,g10.shared-sign-in.SC-emf,g10.shared-sign-in.SC-bp4,g10.shared-sign-in.SC-75s,g10.shared-sign-in.SC-psv,g10.shared-sign-in.SC-l6p,g10.shared-sign-in.SC-qqs,g10.shared-sign-in.SC-fsu,g10.shared-sign-in.SC-dl3 -->
### shared-auth-sign-in-US11-TC6-1: Completing the prompt signs the visitor in

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
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**

* customer is signed out on a brand that has Google sign-in.
* Google's own corner prompt is showing.

**Test data:**

Runs once per row of **Test data**.

| `<google account>` | `<outcome>` |
| --- | --- |
| A verified Google address with no account yet | an account is created for it and the collector is signed in as that account |
| A verified Google address with an account already created by an emailed sign-in link | the collector is signed in as that same account |
| A verified Google address with an account already created by the Google control | the collector is signed in as that same account |

**Steps:**

1. Complete the prompt's account chooser for `<google account>`.

**Expected Results:**

* The collector is signed in as `<outcome>` states.
* The corner prompt is gone.

<!-- trace:case id=g10.shared-sign-in.TC-7qn rev=1 covers=g10.shared-sign-in.SC-ph5,g10.shared-sign-in.SC-iaq,g10.shared-sign-in.SC-5lg,g10.shared-sign-in.SC-emf,g10.shared-sign-in.SC-bp4,g10.shared-sign-in.SC-75s,g10.shared-sign-in.SC-psv,g10.shared-sign-in.SC-l6p,g10.shared-sign-in.SC-qqs,g10.shared-sign-in.SC-fsu,g10.shared-sign-in.SC-dl3 -->
### shared-auth-sign-in-US11-TC7-1: Prompt is offered on any page a signed-out collector visits, including checkout

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
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**
customer is signed out on a brand that has Google sign-in.

**Test data:**

Runs once per row of **Test data**.

| `<page>` |
| --- |
| the brand home |
| a listing page |
| the checkout page |

**Steps:**

1. Navigate to `<page>`, signed out, without opening sign-in.

**Expected Results:**

* Google's own corner prompt appears on `<page>`.

<!-- trace:case id=g10.shared-sign-in.TC-w1p rev=1 covers=g10.shared-sign-in.SC-ph5,g10.shared-sign-in.SC-iaq,g10.shared-sign-in.SC-5lg,g10.shared-sign-in.SC-emf,g10.shared-sign-in.SC-bp4,g10.shared-sign-in.SC-75s,g10.shared-sign-in.SC-psv,g10.shared-sign-in.SC-l6p,g10.shared-sign-in.SC-qqs,g10.shared-sign-in.SC-fsu,g10.shared-sign-in.SC-dl3 -->
### shared-auth-sign-in-US11-TC8-1: Ignoring the prompt leaves the page exactly as it was

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
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**
customer is signed out on a brand that has Google sign-in, with the corner prompt showing.

**Steps:**

1. Interact with the page underneath the prompt without tapping it or opening sign-in — scroll, and open a listing.
2. Read the page state.

**Expected Results:**

* The collector is not signed in.
* The interaction from step 1 completes exactly as it would with no prompt showing.
* No sign-in dialog opens.

<!-- trace:case id=g10.shared-sign-in.TC-2jt rev=1 covers=g10.shared-sign-in.SC-ph5,g10.shared-sign-in.SC-iaq,g10.shared-sign-in.SC-5lg,g10.shared-sign-in.SC-emf,g10.shared-sign-in.SC-bp4,g10.shared-sign-in.SC-75s,g10.shared-sign-in.SC-psv,g10.shared-sign-in.SC-l6p,g10.shared-sign-in.SC-qqs,g10.shared-sign-in.SC-fsu,g10.shared-sign-in.SC-dl3 -->
### shared-auth-sign-in-US11-TC9-1: Declining the dialog suppresses the prompt for the rest of the visit

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
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**

* customer is signed out on a brand that has Google sign-in.
* The corner prompt was showing, then opening the sign-in dialog dismissed it.

**Steps:**

1. Close the sign-in dialog without completing sign-in.
2. Navigate to another page of the same brand in the same visit.

**Expected Results:**

* The collector remains signed out.
* The corner prompt does not appear again on either page for the rest of the visit.

<!-- trace:case id=g10.shared-sign-in.TC-f02 rev=1 covers=g10.shared-sign-in.SC-ph5,g10.shared-sign-in.SC-iaq,g10.shared-sign-in.SC-5lg,g10.shared-sign-in.SC-emf,g10.shared-sign-in.SC-bp4,g10.shared-sign-in.SC-75s,g10.shared-sign-in.SC-psv,g10.shared-sign-in.SC-l6p,g10.shared-sign-in.SC-qqs,g10.shared-sign-in.SC-fsu,g10.shared-sign-in.SC-dl3 -->
### shared-auth-sign-in-US11-TC10-1: Unverified Google account offered through the prompt does not sign in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**

* customer is signed out on a brand that has Google sign-in.
* The Google account chooser is stubbed to return `<unverified google email>` with its verified flag false.
* The corner prompt is showing.

**Steps:**

1. Complete the prompt's account chooser for `<unverified google email>`.

**Expected Results:**

* No account is created for `<unverified google email>`.
* The collector is not signed in.

<!-- trace:case id=g10.shared-sign-in.TC-x2b rev=1 covers=g10.shared-sign-in.SC-ph5,g10.shared-sign-in.SC-iaq,g10.shared-sign-in.SC-5lg,g10.shared-sign-in.SC-emf,g10.shared-sign-in.SC-bp4,g10.shared-sign-in.SC-75s,g10.shared-sign-in.SC-psv,g10.shared-sign-in.SC-l6p,g10.shared-sign-in.SC-qqs,g10.shared-sign-in.SC-fsu,g10.shared-sign-in.SC-dl3 -->
### shared-auth-sign-in-US11-TC11-1: Prompt failing to initialize does not block the page

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**

* customer is signed out on a brand that has Google sign-in.
* The browser or environment prevents Google's prompt from initializing (for example, third-party sign-in prompts are blocked).

**Steps:**

1. Navigate to a page of that brand, signed out.
2. Read the page state.

**Expected Results:**

* The page loads and behaves normally with no corner prompt shown.
* No error is shown to the collector.
* The sign-in dialog is still reachable and works as it always does.

---

## shared-auth-sign-in-US12: Operator follows a sign-in link and only the console is signed in

**As an** operator,
**I want** a link I asked for from the console to sign in the console and nothing else,
**so that** my shopping session on the site stays as it was, whoever it belongs to.

### shared-auth-sign-in-US12-TC1-1: Link asked from the console signs in the console only

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <grade10 admin console url> and on <grade10 store url>.
* <operator account> holds console access and has requested a sign-in link from the console, which has not been followed.
* Tab A is open on <grade10 admin console url>, showing Check Your Email.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |
| `<operator TOTP code>` | A valid current code from <operator account>'s authenticator |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab A and enter <operator TOTP code>.
3. In tab C, navigate to <grade10 store url>.

**Expected Results:**

* Step 2 shows <operator account> signed in on the console, unreloaded.
* Step 3 shows nobody signed in on the site.

### shared-auth-sign-in-US12-TC2-1: Link asked on the site signs in the site only

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <grade10 store url> and on <grade10 admin console url>.
* <operator account> holds console access and has requested a sign-in link from the site, which has not been followed.
* Tab A is open on <grade10 store url>, showing Check Your Email.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab A.
3. In tab C, navigate to <grade10 admin console url>.

**Expected Results:**

* Tab A shows <operator account> signed in on the site, unreloaded.
* Step 3 shows the console's sign-in page, not the console.

### shared-auth-sign-in-US12-TC3-1: Console link leaves the site session untouched

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* <collector account> is signed in on <grade10 store url> in tab A, with <cart item> in its cart.
* <collector account> has requested a sign-in link from <grade10 admin console url> and it has not been followed.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector account>` | A customer account holding `user` only that also holds console access |
| `<cart item>` | A card in <collector account>'s cart |
| `<console TOTP code>` | A valid current code from <collector account>'s authenticator |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Enter <console TOTP code> on the console.
3. Return to tab A.

**Expected Results:**

* Step 2 opens the console as <collector account>.
* Tab A still names <collector account>, with <cart item> in its cart.
* The site session is the one it was before step 1.

### shared-auth-sign-in-US12-TC4-1: Console link signs in its own account beside a different site account

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* <collector account> is signed in on <grade10 store url> in tab A.
* admin is signed out on <grade10 admin console url>.
* <operator account>, a different account, has requested a sign-in link from the console and it has not been followed.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector account>` | A customer account holding `user` only |
| `<operator account>` | A different account holding console access |
| `<operator TOTP code>` | A valid current code from <operator account>'s authenticator |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Enter <operator TOTP code> on the console.
3. Return to tab A.

**Expected Results:**

* Step 1 shows no different-account toast.
* Step 2 opens the console as <operator account>.
* Tab A still names <collector account>.

### shared-auth-sign-in-US12-TC5-1: Different-account choice on the console is judged on the console session

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* <operator account A> is signed in on <grade10 admin console url> with the second factor proved.
* <operator account B> is signed in on <grade10 store url> in the same browser.
* A sign-in link for <operator account B>, requested from the console, is unused and unexpired.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account A>` | An account holding console access, signed in on the console |
| `<operator account B>` | A different account holding console access, signed in on the site |

**Steps:**

1. Follow that link in a new tab.

**Expected Results:**

* The console's own sign-in page states inline that the person is signed in with a different account and names <operator account B>'s email.
* The inline choice offers Switch and Stay.
* No toast shows.
* The console session and the site session are both unchanged.

### shared-auth-sign-in-US12-TC6-1: A site session as a different account raises no mismatch on a console link

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* <operator account A> is signed in on <grade10 admin console url> with the second factor proved.
* <collector account> is signed in on <grade10 store url> in the same browser.
* A sign-in link for <operator account A>, requested from the console, is unused and unexpired.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account A>` | An account holding console access, signed in on the console |
| `<collector account>` | A customer account holding `user` only |

**Steps:**

1. Follow that link in a new tab.

**Expected Results:**

* No different-account toast shows.
* The console session and the site session are both unchanged.

### shared-auth-sign-in-US12-TC7-1: Switch on the console ends the console session only

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* <operator account A> is signed in on <grade10 admin console url> in tab A.
* <collector account> is signed in on <grade10 store url> in tab B.
* The console's own sign-in page is showing the inline different-account choice, offering Switch and Stay, after following a link for <operator account C>, requested from the console.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account A>` | An account holding console access |
| `<collector account>` | A customer account holding `user` only |
| `<operator account C>` | A different account holding console access |
| `<operator TOTP code>` | A valid current code from <operator account C>'s authenticator |

**Steps:**

1. Activate Switch.
2. Enter <operator TOTP code> on the console.
3. Return to tab B.

**Expected Results:**

* Step 1 ends <operator account A>'s console session.
* Step 2 opens the console as <operator account C>.
* Tab B still names <collector account>.

### shared-auth-sign-in-US12-TC8-1: Console link followed with no console tab open still signs in the console

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <grade10 admin console url> and on <grade10 store url>.
* <operator account> requested a sign-in link from the console on another device, and no tab is waiting on this device.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |
| `<operator TOTP code>` | A valid current code from <operator account>'s authenticator |

**Steps:**

1. Follow the unused, unexpired link from that email on this device.
2. Enter <operator TOTP code> on the console.
3. Navigate to <grade10 store url>.

**Expected Results:**

* Step 2 opens the console as <operator account>.
* Step 3 shows nobody signed in on the site.

### shared-auth-sign-in-US12-TC9-1: Waiting console tab carries on while a signed-out site tab does not

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on both surfaces.
* Tab A is on <grade10 admin console url>, showing Check Your Email, after requesting a link for <operator account>.
* Tab B is on <grade10 store url>, signed out, in the background.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |
| `<operator TOTP code>` | A valid current code from <operator account>'s authenticator |

**Steps:**

1. Follow the unused, unexpired link in tab C.
2. Return to tab A and enter <operator TOTP code>.
3. Return to tab B.

**Expected Results:**

* Tab A shows <operator account> signed in on the console, and the Check Your Email dialog is gone.
* Tab B still shows nobody signed in, unreloaded.

### shared-auth-sign-in-US12-TC10-1: ZZZ console link signs in the ZZZ console only

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <zzz admin console url> and on <zzz store url>.
* <zzz operator account> has requested a sign-in link from the ZZZ console and it has not been followed.

**Test data:**

| Field | Value |
| --- | --- |
| `<zzz operator account>` | An account holding console access on ZZZ |
| `<zzz operator TOTP code>` | A valid current code from <zzz operator account>'s authenticator |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Enter <zzz operator TOTP code> on the ZZZ console.
3. In tab C, navigate to <zzz store url>.

**Expected Results:**

* Step 2 opens the ZZZ console as <zzz operator account>.
* Step 3 shows nobody signed in on the ZZZ site.

### shared-auth-sign-in-US12-TC11-1: Resend from the console keeps the console as the surface that asked

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <grade10 admin console url> and on <grade10 store url>.
* <operator account> has requested a sign-in link from the console and Resend has turned on.
* Tab A is open on <grade10 admin console url>, showing Check Your Email.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |
| `<operator TOTP code>` | A valid current code from <operator account>'s authenticator |

**Steps:**

1. In tab A, activate Resend.
2. Follow the unused, unexpired link the resend sent in tab B.
3. Return to tab A and enter <operator TOTP code>.
4. In tab C, navigate to <grade10 store url>.

**Expected Results:**

* Step 3 shows <operator account> signed in on the console.
* Step 4 shows nobody signed in on the site.

### shared-auth-sign-in-US12-TC12-1: A link asked from the console that names a site location lands on the console

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <grade10 admin console url> and on <grade10 store url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of an account holding console access |
| `<site location>` | A page of <grade10 store url> |

**Steps:**

1. Ask for a sign-in link as the console for <operator email>, naming <site location> as the location to return to.
2. Follow the unused, unexpired link.

**Expected Results:**

* Step 2 ends on <grade10 admin console url>, not on <site location>.
* The site has no signed-in person.

### shared-auth-sign-in-US12-TC13-1: Console session as a different account is kept when a console link is followed

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* <operator account A> is signed in on <grade10 admin console url> with the second factor proved.
* A sign-in link for <operator account B>, requested from the console, is unused and unexpired.
* <collector account> is signed in on <grade10 store url> in the same browser.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account A>` | An account holding console access, signed in on the console |
| `<operator account B>` | A different account holding console access |
| `<collector account>` | A customer account holding `user` only |

**Steps:**

1. Follow that link in a new tab and make no choice there.
2. Reload the console tab.
3. Reload <grade10 store url>.

**Expected Results:**

* Step 2 still shows <operator account A> on the console.
* No console session exists for <operator account B>.
* Step 3 still names <collector account>.

### shared-auth-sign-in-US12-TC14-1: Google sign-in on the console signs in the console only

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
* **Trace:** Google

**Pre-conditions:**

* Grade10 offers Google sign-in.
* admin is signed out on <grade10 admin console url> and on <grade10 store url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<google account>` | A Google account with a verified email, whose address belongs to an account holding console access |
| `<operator TOTP code>` | A valid current code from that account's authenticator |

**Steps:**

1. On <grade10 admin console url>, choose Google and complete it with <google account>.
2. Enter <operator TOTP code> on the console.
3. In tab B, navigate to <grade10 store url>.

**Expected Results:**

* Step 2 opens the console as the account for <google account>'s address.
* Step 3 shows nobody signed in on the site.

### shared-auth-sign-in-US12-TC15-1: A product's verified-email sign-in is the site's and never the console's

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Link surface

**Pre-conditions:**

* <operator account> holds console access and is signed out on <grade10 admin console url> and on <grade10 store url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account>` | An account holding console access |

**Steps:**

1. A Grade10 product that has verified <operator account>'s email signs that account in.
2. Ask who is calling as the site.
3. Ask who is calling as the console.

**Expected Results:**

* Step 2 receives <operator account>.
* Step 3 receives no person.

### shared-auth-sign-in-US12-TC16-1: A console link right after a site link for the same address is sent and the site link stays alive

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <grade10 admin console url> and on <grade10 store url>.
* <operator account> asked for a sign-in link from <grade10 store url> less than a minute ago, and it is unused and unexpired.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |

**Steps:**

1. Ask for a sign-in link for <operator email> on <grade10 admin console url>.
2. Follow the link asked from <grade10 store url>.
3. Navigate to <grade10 admin console url>.

**Expected Results:**

* Step 1 sends the link and does not tell them to wait.
* Step 2 signs in <operator account> on the site.
* Step 3 shows nobody signed in on the console.

### shared-auth-sign-in-US12-TC17-1: A second console link in a minute is told to wait

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <grade10 admin console url> and on <grade10 store url>.
* <operator account> asked for a sign-in link from <grade10 admin console url> less than a minute ago, and it is unused and unexpired.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |

**Steps:**

1. Ask again for a sign-in link for <operator email> on <grade10 admin console url>.

**Expected Results:**

* Step 1 sends no second email and tells them to wait.

### shared-auth-sign-in-US12-TC18-1: A sign-in on one surface stops only that surface's wait and leaves the other surface's wait running

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on both surfaces.
* Tab A is on <grade10 admin console url>, showing Check Your Email, after requesting a link for <operator account>.
* Tab B is on <grade10 store url>, showing Check Your Email, after requesting a link for <operator account>.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |

**Steps:**

1. Follow the unused, unexpired link asked from <grade10 store url> in tab C.
2. Return to tab B.
3. Return to tab A.
4. In tab B, open sign-in again and request a link for <operator email>, waiting out the resend wait if it shows.
5. Follow the unused, unexpired link asked from <grade10 admin console url> in tab C.
6. Return to tab B.
7. Return to tab A.

**Expected Results:**

* Step 2 shows tab B no longer waiting, with the message that sign-in completed on another device.
* Step 3 shows tab A still on Check Your Email, with no such message.
* Step 4 sends a link for the site without ending tab A's wait.
* Step 6 shows tab B still on Check Your Email, with no such message.
* Step 7 shows tab A no longer waiting, with the message that sign-in completed on another device.

### shared-auth-sign-in-US12-TC19-1: A failed console link lands on the console's sign-in page with an inline message

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <grade10 admin console url> and on <grade10 store url>.
* A sign-in link asked from <grade10 admin console url> for <operator account> has expired.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |

**Steps:**

1. Follow the expired link.

**Expected Results:**

* Step 1 lands on the console's own sign-in page.
* The page states inline that the link has expired.
* No toast shows.
* Nobody is signed in on the console or the site.

### shared-auth-sign-in-US12-TC20-1: A banned account's console link says inline that they cannot sign in

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <grade10 admin console url> and on <grade10 store url>.
* <banned operator account> is banned, and a sign-in link asked from <grade10 admin console url> for its address is unused and unexpired.

**Test data:**

| Field | Value |
| --- | --- |
| `<banned operator account>` | An account holding console access that an admin has banned |

**Steps:**

1. Follow that link.

**Expected Results:**

* Step 1 lands on the console's own sign-in page.
* The page states inline that they cannot sign in and does not invite them to request another link.
* No toast shows.
* Nobody is signed in on the console or the site.

### shared-auth-sign-in-US12-TC21-1: Stay on the console's inline choice keeps the console session

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* <operator account A> is signed in on <grade10 admin console url> with the second factor proved.
* The console's own sign-in page is showing the inline different-account choice, offering Switch and Stay, after following a link for <operator account C>, requested from the console.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account A>` | An account holding console access |
| `<operator account C>` | A different account holding console access |

**Steps:**

1. Activate Stay.

**Expected Results:**

* Step 1 keeps <operator account A> signed in on the console.
* <operator account C> is not entered.

### shared-auth-sign-in-US12-TC22-1: A site link an operator action sends signs in the site and not the console

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Link surface

**Pre-conditions:**

* <operator account> holds `admin` and is signed in on <grade10 admin console url> with the second factor proved.
* <customer account> is signed out on <grade10 store url> and on <grade10 admin console url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account>` | An account holding `admin`, which holds `user:create` |
| `<customer account>` | A customer account holding `user` only |
| `<customer email>` | The address of <customer account> |
| `<site location>` | A page of <grade10 store url> |

**Steps:**

1. As the console, with <operator account>'s session, ask for a sign-in link for the site to <customer email>, naming <site location> as the location to return to.
2. Follow the unused, unexpired link with a client that holds no cookies.
3. Ask who is calling as the site.
4. Ask who is calling as the console.

**Expected Results:**

* Step 2 ends on <site location>, not on <grade10 admin console url>.
* Step 3 receives <customer account>.
* Step 4 receives no person.

### shared-auth-sign-in-US12-TC23-1: Following an operator action's site link keeps the console session in place

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Link surface

**Pre-conditions:**

* <operator account> holds `admin` and is signed in on <grade10 admin console url> with the second factor proved, in one client.
* <customer account> is signed out on <grade10 store url>.
* An operator action asked for a sign-in link for the site to <customer email> and it has not been followed.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account>` | An account holding `admin`, which holds `user:create` |
| `<customer account>` | A customer account holding `user` only |
| `<customer email>` | The address of <customer account> |

**Steps:**

1. In the client holding the console session, follow the unused, unexpired link.
2. Ask who is calling as the site.
3. Ask who is calling as the console.

**Expected Results:**

* Step 2 receives <customer account>.
* Step 3 receives <operator account>.

### shared-auth-sign-in-US12-TC24-1: A site link asked for with no console session is refused

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Link surface

**Pre-conditions:**

* <operator account> holds `admin`, is signed in on <grade10 store url>, and is signed out on <grade10 admin console url>.
* <customer account> has received no sign-in email since the case began.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account>` | An account holding `admin`, which holds `user:create` |
| `<customer account>` | A customer account holding `user` only |
| `<customer email>` | The address of <customer account> |

**Steps:**

1. As the console, presenting only <operator account>'s site session, ask for a sign-in link for the site to <customer email>.
2. Read the mail sent to <customer email>.

**Expected Results:**

* Step 1 is refused as not signed in.
* Step 2 shows no sign-in email.

### shared-auth-sign-in-US12-TC25-1: A site link asked for by a console role without user:create is refused

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
* **Trace:** Link surface

**Pre-conditions:**

* <operator account> holds `support` only and is signed in on <grade10 admin console url> with the second factor proved.
* <customer account> has received no sign-in email since the case began.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account>` | An account whose only operator role is `support`, which holds no `user:create` |
| `<customer account>` | A customer account holding `user` only |
| `<customer email>` | The address of <customer account> |

**Steps:**

1. As the console, with <operator account>'s console session, ask for a sign-in link for the site to <customer email>.
2. Read the mail sent to <customer email>.

**Expected Results:**

* Step 1 is refused as not allowed.
* Step 2 shows no sign-in email.

### shared-auth-sign-in-US12-TC26-1: A site link asked for with an unproved second factor is refused

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
* **Trace:** Link surface

**Pre-conditions:**

* <operator account> holds `admin`, has a second factor set up, and is signed in on <grade10 admin console url> without having proved it on this session.
* <customer account> has received no sign-in email since the case began.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account>` | An account holding `admin`, which holds `user:create`, with a second factor set up |
| `<customer account>` | A customer account holding `user` only |
| `<customer email>` | The address of <customer account> |

**Steps:**

1. As the console, with <operator account>'s console session, ask for a sign-in link for the site to <customer email>.
2. Read the mail sent to <customer email>.

**Expected Results:**

* Step 1 is refused and asks for the second factor.
* Step 2 shows no sign-in email.

### shared-auth-sign-in-US12-TC27-1: A console session does not withhold Google's prompt on the site

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
* **Trace:** Google

**Pre-conditions:**

* Grade10 offers Google sign-in.
* <operator account> is signed in on <grade10 admin console url> only, with the second factor proved where the console asks for it, and signed out on <grade10 store url>.
* No sign-in dialog is open.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account>` | An account holding console access, with a second factor set up |

**Steps:**

1. Navigate to <grade10 store url> in the same browser, without opening the sign-in dialog.
2. Read the page.

**Expected Results:**

* Google's own corner prompt appears offering sign-in.
* No sign-in dialog is open.

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
* A pending, unused, unexpired link stays valid after its address settles
  elsewhere by another method; only the link's own expiry or a later send
  ends it, exactly as before this change.
* A settle on a different brand does not close this brand's wait: grade10
  and zzz run entirely separate auth deployments and databases (no shared
  account, no shared check between them), so a settle on one brand
  affecting the other's wait is not a reachable case for this capability's
  mechanism to guard against.
* Dismissing the wait and reopening sign-in starts fresh: already governed
  by the existing dismiss/reopen contract (opening sign-in again starts at
  the email step); nothing persists across a dismissal that would need
  asserting separately.
* A link asked from the console signs in the console whoever follows it and on whichever device: the token names the surface, so a follow with no console tab open still signs in the console.
* A sign-in link sent before release carries no surface and signs in the site, as every pre-release link did. A token that is malformed, unknown or carries no console prefix reads the same way, so a failed follow of one lands on the brand home with the site's toast.
* The send cap and a new link's replacing earlier links count per address and surface: a console link right after a site link for the same address is sent and does not invalidate it (decisions Q12).
* When an address signs in on one surface, only a wait on the same surface stops; a wait on the other surface keeps running (decisions Q13).
* A failed, expired, banned or different-account console-asked link lands on the console's own sign-in page with an inline message, and the different-account case offers Switch and Stay there; the console has no toasts (decisions Q14).
* A sign-in dialog closes for a session that arrives on its own side: two tabs of the site, or two of the console, close together, and a sign-in on the other side leaves a dialog open (decisions Q11).
* The brand guard that ignores an off-brand location also ignores a location on the other surface, on send and again on follow, so a console link naming a site page lands on the console.
* A link an operator action on the console sends for a customer account asks for the site and signs in the site, not the console: it is the one exception to the asking surface, only an elevated console session whose role holds `user:create` may ask for it, a request with no console session, a role without the grant or a second factor not yet proved is refused and sends nothing, and the sender's console session is left as it was (decisions Q16). The human confirmed the grant 2026-10-06, which the planning run had named from the test-winner action's existing gate in `complete-auction-post-sale`.
* Google's auto-prompt is the site's and reads the session of the surface it shows on, so a console session does not withhold it: a person signed in on the console only is still offered it on the site. The site's SPAs mount the prompt and the console does not; this change adds no console mount, since no decision gives the console one, so there is no console prompt for a site session to withhold or offer.

## Reconciliation

**Run:** QA2, 2026-10-06, in a fresh context. QA1's blind pass read the Purpose and Feature set, `user-journeys.md`, `proposal.md`, `decisions.md` (its `## Raised` was empty), the Session and Sign-In pages, the durable suite for id continuity and `shared/auth/domain-tcs.md`, and was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read both readings, `decisions.md`, `tech-design.md`, `tasks.md`, the delta and the durable suite. It is a statement, not proof. No case of this change has been accepted or published, so a draft keeps its `<v>` when it is reworded.

- **Agreed** - `shared-auth-sign-in-US12-TC1-1` with `shared-auth-sign-in-SC-91`; `shared-auth-sign-in-US12-TC2-1` with `shared-auth-sign-in-SC-92`; `shared-auth-sign-in-US12-TC3-1` with `shared-auth-sign-in-SC-91`, the site session left as it was; `shared-auth-sign-in-US12-TC4-1` with `shared-auth-sign-in-SC-96`; `shared-auth-sign-in-US12-TC6-1` with `shared-auth-sign-in-SC-69` read on the console and `shared-auth-sign-in-SC-96`; `shared-auth-sign-in-US12-TC8-1` with `shared-auth-sign-in-SC-91`; `shared-auth-sign-in-US12-TC9-1` with `shared-auth-sign-in-SC-91` and the durable followed-elsewhere rule; `shared-auth-sign-in-US12-TC10-1` with `shared-auth-sign-in-SC-91` on ZZZ, one case for the second brand
- **Adjusted, by QA2** - `shared-auth-sign-in-US12-TC3-1` and `shared-auth-sign-in-US12-TC7-1` named `<operator TOTP code>` from an account the case does not hold; TC3 now takes the code from `<collector account>` and TC7 from `<operator account C>`, the account each one signs in on the console
- **Adjusted, by QA2 (review)** - `shared-auth-sign-in-US12-TC18-1` walked only the site half of the pair; it now also signs in the console while a site wait runs, so `shared-auth-sign-in-SC-102` is reached by a step and not by the title alone
- **Adjusted, by QA2, a case revised** - `shared-auth-sign-in-US8-TC11-2` revises the durable `US8-TC11-1`, whose pre-condition read "tabs A and C open on the same brand" and so claimed more than the re-scoped `shared-auth-sign-in-SC-51` states: two tabs on the same side, the site or the console. It runs once per row for the site and for the console, goes back to `draft` as the durable case was `actual`, and carries the durable case's `trace:case` marker at `rev=2` with its `covers` list as it was, since `pnpm run accept:preflight` refuses a revised case that reuses a durable case's id without it; no marker is allocated for it
- **Adjusted, by QA2 (second pass)** - `shared-auth-sign-in-SC-110` and `shared-auth-sign-in-US12-TC24-1` now name an account whose role holds `user:create`, so the missing console session is the one thing that refuses the request, and both say no console session where they said no elevated one, a wording `shared-auth-sign-in-SC-111` and `shared-auth-sign-in-SC-112` now share; `shared-auth-sign-in-US12-TC22-1` and `shared-auth-sign-in-US12-TC23-1` name `admin` and its grant where they said any console access, which `support` also holds and which the requirement refuses
- **Raised, folded into spec** - a console session as a different account when a console link is followed, which `shared-auth-sign-in-US12-TC5-1` and `shared-auth-sign-in-US12-TC7-1` asserted and no scenario stated: `shared-auth-sign-in-SC-98`, which holds what decisions Q8 settles (the console's own session is judged, kept, and no console session is made for the link's account) and leaves the choice's presentation to the raised row below; its case is `shared-auth-sign-in-US12-TC13-1`. Scenarios no QA1 case walked: `shared-auth-sign-in-SC-93` by `shared-auth-sign-in-US12-TC11-1`; `shared-auth-sign-in-SC-97` by the api case `shared-auth-sign-in-US12-TC12-1`; `shared-auth-sign-in-SC-94` by `shared-auth-sign-in-US12-TC14-1`; `shared-auth-sign-in-SC-95` by the api case `shared-auth-sign-in-US12-TC15-1`
- **Raised, rejected** - none
- **Raised, settled by the artifacts** - whether a link followed with no console tab open still signs in the console, and what a link sent before release signs in (the token's prefix, decisions Q8 and `shared-auth-sign-in-SC-91`). Each is in `## Settled`; none goes to `decisions.md`
- **Raised, answered 2026-10-06** - the three rows below were put to the human and landed as decisions Q12 to Q14: the send cap and supersession count per address and surface, so `shared-auth-sign-in-SC-99` and `shared-auth-sign-in-SC-100`, walked by `shared-auth-sign-in-US12-TC16-1` and `shared-auth-sign-in-US12-TC17-1`; a wait stops only for a sign-in on the same surface, so `shared-auth-sign-in-SC-101` and `shared-auth-sign-in-SC-102`, walked by `shared-auth-sign-in-US12-TC18-1`; a failed or different-account console-asked link lands on the console's sign-in page with an inline message, so `shared-auth-sign-in-SC-103`, walked by `shared-auth-sign-in-US12-TC19-1`, `shared-auth-sign-in-SC-104`, walked by `shared-auth-sign-in-US12-TC20-1`, `shared-auth-sign-in-SC-105`, walked by `shared-auth-sign-in-US12-TC5-1`, `shared-auth-sign-in-SC-106`, walked by `shared-auth-sign-in-US12-TC7-1`, and `shared-auth-sign-in-SC-107`, walked by `shared-auth-sign-in-US12-TC21-1`, with `shared-auth-sign-in-US12-TC5-1` and `shared-auth-sign-in-US12-TC7-1` reworded from a toast to the inline choice. The cases are new drafts; no case was `actual`.
- **Raised after QA2, answered 2026-10-06** - which surface a link signs in when a console operator sends it for a customer account, as the test-winner flow in `complete-auction-post-sale` does: the site, the one exception to decisions Q8 and `shared-auth-sign-in-SC-91` (decisions Q16). The new scenarios are `shared-auth-sign-in-SC-108`, walked by `shared-auth-sign-in-US12-TC22-1`, `shared-auth-sign-in-SC-109`, walked by `shared-auth-sign-in-US12-TC23-1`, and `shared-auth-sign-in-SC-110`, walked by `shared-auth-sign-in-US12-TC24-1`. The cases are new drafts, written by the author from the answer: no fresh blind pass was run for them, and none was `actual`
- **Raised after QA2, the grant confirmed 2026-10-06** - which elevated console session may ask for a site link: one whose role holds `user:create`, the grant the test-winner action already needs, named by the planning run from `complete-auction-post-sale` and confirmed by the human (decisions Q16). It adds `shared-auth-sign-in-SC-111`, walked by `shared-auth-sign-in-US12-TC25-1`, for a role without the grant, refused as not allowed, and `shared-auth-sign-in-SC-112`, walked by `shared-auth-sign-in-US12-TC26-1`, for a second factor not yet proved, refused with the ask for it. Both are new drafts; no case was `actual`
- **Written after the blind pass, reconciled here** - `shared-auth-sign-in-SC-108` to `shared-auth-sign-in-SC-112` with `shared-auth-sign-in-US12-TC22-1` to `shared-auth-sign-in-US12-TC26-1`, written from the human's answer Q16, the grant named by the planning run and confirmed by the human; and the re-scope of `shared-auth-sign-in-SC-51` with `shared-auth-sign-in-US8-TC11-2`, written at the human's direction to read the dialog requirement against decisions Q11 to Q13. QA1's blind pass never saw them, so none of them has a blind reading beside it; QA2 reconciled them against the delta, `decisions.md`, `tech-design.md` D2 and D5, `tasks.md` 4.1, 4.3 and 4.11 and the durable suite in this fresh context, in a second pass the same day as the run above. It is a statement, not proof
- **Raised, as escalated** - three rows in `decisions.md`'s `## Raised`: whether the send cap and link supersession are per address or per address and surface; whether a wait ends when the address signs in on the other surface; where a failed or mismatched console-asked link lands and how the console says so. `shared-auth-sign-in-US12-TC5-1` and `shared-auth-sign-in-US12-TC7-1` assume a Switch and Stay choice on the console and were reworded when the third was answered
- **Adjusted, by QA2 (review), same-side wording** - the GIVENs and WHENs of `shared-auth-sign-in-SC-70` to `shared-auth-sign-in-SC-78` now name the sign-in, the follow or the settle as on another device on the same side as the waiting surface, or on the side the link was asked from, so none reads as a settle across the brand or across surfaces. Their ids and markers are as they were
- **Raised after QA2, the auto-prompt's reading** - `shared-auth-sign-in-SC-86` read "a person who already has a session" with no surface, so a console session could be read as withholding the prompt on the site. The requirement is modified: it is the site's prompt, `shared-auth-sign-in-SC-80` to `shared-auth-sign-in-SC-90` carry their markers, `shared-auth-sign-in-SC-86` reads "a site session", and `shared-auth-sign-in-SC-114`, a console session on the site, is new. `shared-auth-sign-in-US12-TC27-1` walks it, with one row, the person signed in on the console only visiting the site; it is a new draft with no blind reading beside it, and no case was `actual`. The first draft also had shared-auth-sign-in-SC-113, a site session on a console page that offers the prompt, and a console row in the case. Both were removed before acceptance: only the site's SPAs mount the prompt, the console does not, and no decision in `decisions.md` adds a console mount, so the scenario described a surface that does not exist. shared-auth-sign-in-SC-113 is retired and its id is not reused. The durable `US11-TC3-1` still holds on the site and is left as it is
- **Adjusted, by QA2 (review), loose wording** - `shared-auth-sign-in-SC-23` and its requirement now say the site, "on this brand's site", with `shared-auth-sign-in-SC-21` to `shared-auth-sign-in-SC-25` carried with their markers. The durable case `US4-TC6-1`, "Trusted product signs the person in on this brand", still holds on the site and is left as it is
- **Left to the durable cases** - `shared-auth-sign-in-SC-31` and `shared-auth-sign-in-SC-32`, whose wording only gained the surface: `US5-TC1-1` and `US5-TC3-1` still verify them and are left as they are; `shared-auth-sign-in-SC-63` to `shared-auth-sign-in-SC-69`, the site's mismatch, by `US9-TC1-1` to `US9-TC7-1`; the settled-elsewhere wait by `US10-TC1-1` to `US10-TC9-1`, whose scenarios gained only the same-side wording and whose `US10-TC6-1` reads "every surface waiting" on the site's own surfaces and stays as it is, since the wait is now scoped to the same surface (decisions Q13); `shared-auth-sign-in-SC-37` to `shared-auth-sign-in-SC-41`, whose GIVEN now says the link was asked from the site, by the customer cases `US6-TC1-1` to `US6-TC5-1`, which stay as they are because the wording moved nothing they assert; `shared-auth-sign-in-SC-50`, by `US8-TC1-1`, which holds on either side; and `US8-TC7-1`, whose "another site of the brand" is a page of the one customer site, so it still holds, stays `actual` and `automated`, and is not touched
- **Covered at domain** - the site's link sign-in, which this change leaves as it was, is walked by `shared-auth-e2e-US2-TC1-1`; the console-against-site lifecycle across session, sign-in and sessions is a draft domain case in this change's `domain-tcs.md` (`shared-auth-e2e-US8-TC1-1`)
- **Contradicted** - none
- **Uncovered anchors** - none: `shared-auth-sign-in-US-12` has `US12-TC1-1` to `US12-TC21-1`; every scenario from `shared-auth-sign-in-SC-91` to `shared-auth-sign-in-SC-112`, and `shared-auth-sign-in-SC-114`, is reached, shared-auth-sign-in-SC-113 being retired; the `Google` group has `US12-TC14-1` and `US12-TC27-1` beside the durable `US3-TC1-1` to `US3-TC3-1`, and the `Link surface` group has `US12-TC15-1` and `US12-TC22-1` to `US12-TC26-1`; `shared-auth-sign-in-US-08` has `US8-TC11-2` beside the durable `US8-TC1-1` to `US8-TC10-1`. `shared-auth-sign-in-SC-51` is walked by `US8-TC11-2` but not joined to it through an anchor, since it serves the `Emailed link` group and the case traces the journey; the durable suite held the same gap and this change leaves it
- **Trace markers** - the new scenarios and cases carry none yet; the trace CLI allocates them with the walk; `shared-auth-sign-in-US8-TC11-2` carries the durable marker revised to `rev=2`, as `shared-auth-session-US2-TC1-2` does, and `shared-auth-sign-in-SC-50` and `shared-auth-sign-in-SC-51` carry the durable markers they already had, as the other modified scenarios do
