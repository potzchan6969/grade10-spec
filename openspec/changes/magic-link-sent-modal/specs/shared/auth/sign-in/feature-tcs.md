# shared/auth/sign-in Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3.0

## shared-auth-sign-in-US7: Collector confirms the send and can resend or go back

**As a** collector,
**I want** the dialog to name the address the sign-in email went to, and to
let me resend or return to Google and email entry,
**so that** I know where to look and can fix a mistyped address without
dismissing the dialog.

### shared-auth-sign-in-US7-TC1-1: Successful send shows confirmation naming the address

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

* The surface shows confirmation copy that names <collector email>.
* The surface does not state whether an account already exists.

---

### shared-auth-sign-in-US7-TC2-1: Resend asks again for the same address

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

* customer is on the link-sent confirmation after a successful send to
  <collector email>.
* more than sixty seconds have passed since that send.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com |

**Steps:**

1. Activate **Resend**.

**Expected Results:**

* The system treats it as another ask for a sign-in link at <collector email>.
* The one-email-a-minute cap still applies on a further ask inside a minute.

---

### shared-auth-sign-in-US7-TC3-1: Back returns to Google and email entry

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

* brand has Google sign-in.
* customer is on the link-sent confirmation after a successful send.

**Steps:**

1. Activate **Back**.

**Expected Results:**

* The Google control and the email step are shown again.
* The confirmation step is no longer shown.

---

### shared-auth-sign-in-US7-TC4-1: Email-step CTA is Sign In with Email

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

### shared-auth-sign-in-US7-TC5-1: Resend is disabled with a countdown after a send

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

### shared-auth-sign-in-US7-TC6-1: Resend re-enables when the countdown reaches zero

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

### shared-auth-sign-in-US7-TC7-1: A successful resend restarts the countdown

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

### shared-auth-sign-in-US7-TC8-1: A link older than sixty seconds does not sign in

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
