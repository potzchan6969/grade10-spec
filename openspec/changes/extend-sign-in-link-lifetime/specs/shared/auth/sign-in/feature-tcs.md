# shared/auth/sign-in Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-17, tcs-rules r3.0

## shared-auth-sign-in-US1: Collector asks for and follows a sign-in link

**As a** collector,
**I want** a link emailed to the address I submit to sign me in once,
**so that** I reach my account without a password, and a used or expired link cannot.

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

## Raised

* Is a link followed at exactly five minutes accepted or refused? The feature set says a link "lasts five minutes" and the acceptance signal jumps from four minutes to six, so the boundary itself is unstated; the suite asserts 4 minutes 59 seconds and 5 minutes 1 second and nothing at the mark.
* Which instant starts the five minutes — the request, the send, or the provider's delivery? The goal is a collector whose mail arrives late, and a slow provider makes the three visibly different.
* Whose clock measures the five minutes, the service's or the follower's device's? TC18 assumes the service's; nothing in the input says so.
* Which locales does the sign-in email speak? The impact line says "every locale" without naming them; the suite runs the default, Traditional Chinese and Simplified Chinese.
* Does every locale write the number the same way — a digit everywhere, or each language's own word for five? The case asserts only that each body promises five minutes.
* May the email carry an absolute expiry time beside the duration, or is the duration the only form the promise takes? The interview chose a number over "it expires shortly" without ruling on a timestamp.
* Does the link's lifetime bound the session it creates? The suite assumes a session made at four minutes survives past the five-minute mark, and nothing states the session's own life.
* Does a used link stay refused for the rest of its five minutes, or does its record clear at first use? At sixty seconds the used and expired windows nearly coincided; at five minutes there is a four-minute stretch where a link is used and unexpired at once.
* Is five minutes a fixed number or one an environment can set? The E2E impact line ends the lifetime "on the record" for the expired case, which is a test seam rather than an answer, and a configurable number would need the email's promise to follow it.
* Does the confirmation dialog tell a collector how long they have, or does the promise live only in the email? "Check Your Email" names Resend and its countdown and no lifetime, so a collector who never opens the mail sees only the sixty-second number.

## Reconciliation

**Run:** 2026-09-17, input `98c18f1aa3e6` — outline, journeys, decisions,
proposal, the PRD's After the Send section, and the existing US1 cases for id
continuity. The suite pass read no requirements section anywhere; the scenario
pass read the durable requirements and no suite.

| Raised | Disposition |
| --- | --- |
| A device clock reading inside the five minutes revives an expired link (TC18-1) | **Folded in.** No scenario said whose clock measures the lifetime, and a follower's device answering the question is exactly the misreading a reader would ship. Now stated in the requirement and carried by `shared-auth-sign-in-SC-62` |
| The boundary at exactly five minutes is unstated | **Folded in.** `shared-auth-sign-in-SC-59` refuses at five minutes rather than after them, and TC16-1 gained a row at the mark |
| A resent link's five minutes run from its own send (TC11-1) | **Already stated.** The requirement measures the lifetime from the send, per link; the case walks that rule and no scenario was added |
| The recorded expiry sits five minutes after the send (TC13-1) | **Already stated**, at a different layer. Kept as the deterministic reading of `shared-auth-sign-in-SC-59` |
| The promised duration is the enforced one (TC15-1) | **Already stated**, jointly by `shared-auth-sign-in-SC-61` and `shared-auth-sign-in-SC-59`. Kept: the agreement between the two is this change's second goal, and neither scenario proves it alone |
| A used link stays refused inside its five minutes (TC17-1) | **Already stated** by one-time use, which this change does not move. The five-minute lifetime is what makes the used-and-unexpired window worth walking |
| The session outlives the link that made it (TC12-1) | **Real, and belongs to `shared/auth/session`** — which states no session lifetime at all, and neither does `shared/auth/sessions`. Raised here because the lifetime is this change's subject; recorded as a ❓ on the Session page rather than specified here, where it would be a second capability's requirement |
| Which instant starts the clock, and which locales the email speaks | **Answered from the store.** The clock starts at the send, and the shared catalog speaks the four languages it is written in; both are in the requirement's own words |
| Whether the email may also carry an absolute expiry time | **Rejected.** Nobody asked for a second form of the promise; this change corrects the number the email already gives |
| Whether the confirmation dialog should state the lifetime | **Rejected.** The dialog says nothing about the lifetime today, and adding a surface is not this change's scope — `decisions.md` holds the edge |
| Whether five minutes is settable per environment or brand | **Rejected.** One lifetime, everywhere; the E2E seam ends a link's life on the record and sets no second number |

No anchor went uncovered, and no case is blocked: every question above was
settled from the store or from the author's own decisions.
