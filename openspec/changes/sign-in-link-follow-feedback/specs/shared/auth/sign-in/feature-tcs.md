# shared/auth/sign-in Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r1

## shared-auth-sign-in-US6: Collector follows a link that cannot sign them in

**As a** collector who opened a sign-in link from email,
**I want** a clear toast on the brand home when that link cannot create a session,
**so that** I know whether to ask for a new link or that I cannot sign in at all.

### shared-auth-sign-in-US6-TC1-1: Expired link toasts on the brand home

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-06

**Pre-conditions:**
A sign-in link whose time to live has ended.

**Steps:**

1. Follow that link.

**Expected Results:**

* No session is created.
* They are on this brand's home.
* A toast states that the link has expired.

### shared-auth-sign-in-US6-TC2-1: Used link toasts that it no longer works

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-06

**Pre-conditions:**
A sign-in link that has already created a session.

**Steps:**

1. Follow that link again.

**Expected Results:**

* No new session is created.
* They are on this brand's home.
* A toast states that the link no longer works.

### shared-auth-sign-in-US6-TC3-1: Superseded link toasts that it no longer works

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-06

**Pre-conditions:**
An unused unexpired sign-in link that a later sign-in-link email for the same address replaced.

**Steps:**

1. Follow the earlier link.

**Expected Results:**

* No session is created.
* They are on this brand's home.
* A toast states that the link no longer works.

### shared-auth-sign-in-US6-TC4-1: Invalid link toasts that it no longer works

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-06

**Pre-conditions:**
A sign-in link token that is malformed or unknown.

**Steps:**

1. Follow that link.

**Expected Results:**

* No session is created.
* They are on this brand's home.
* A toast states that the link no longer works.

### shared-auth-sign-in-US6-TC5-1: Banned account link follow toasts cannot sign in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-06

**Pre-conditions:**
A banned account and a sign-in link for that account's address.

**Steps:**

1. Follow that link.

**Expected Results:**

* No session is created.
* They are on this brand's home.
* A toast states that they cannot sign in.
* The toast does not invite them to request another link.
