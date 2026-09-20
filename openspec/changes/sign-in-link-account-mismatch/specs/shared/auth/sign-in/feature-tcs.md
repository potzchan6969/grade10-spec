# shared/auth/sign-in Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## shared-auth-sign-in-US9: Collector follows a link meant for a different account

**As a** collector already signed in,
**I want** a clear choice when a sign-in link is meant for another account,
**so that** I am not switched without asking, and can Switch or Stay.

### shared-auth-sign-in-US9-TC1-1: Mismatch toast names the link's account and leaves the session untouched

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
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

### shared-auth-sign-in-US9-TC2-1: Switch ends the current session and enters the link's account

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

### shared-auth-sign-in-US9-TC3-1: Stay keeps the current session and does not enter the link's account

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

### shared-auth-sign-in-US9-TC4-1: Dismissing the toast has the same outcome as Stay

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

### shared-auth-sign-in-US9-TC5-1: Mismatch toast stays until an explicit choice

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

1. Leave the toast untouched for a period that would clear an ordinary toast.

**Expected Results:**

* The toast is still shown.
* Switch and Stay are still offered.

### shared-auth-sign-in-US9-TC6-1: Mismatch toast is styled as a warning, not an error

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
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

### shared-auth-sign-in-US9-TC7-1: A link for the signed-in account itself shows no mismatch toast

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

## Reconciliation

**Run:** The blind pass read this capability's `## Purpose` and `## Feature set` (composed, including this change's new "Signed-in mismatch" leaf), the full `user-journeys.md` (durable US-01 through US-08 plus this change's new US-09), `decisions.md` (goals, non-goals, decisions Q1-Q6, and an empty `## Raised`), `ui-design.md`, the PRD's "Following the Link" section, and the durable `feature-tcs.md` for id continuity and house style. It did not read any `spec.md`, `openspec/changes/archive/`, or any other capability.

- **Raised, folded into spec** — TC1-1 asserted that the toast's description does not name the current session's email, which `decisions.md`'s non-goal ("Showing the current session's email on the toast — only the link's email") states but no drafted scenario had asserted. Folded as `shared-auth-sign-in-SC-64`.
- **Raised, folded into spec** — TC7-1 asserted that following a valid link for the account already signed in shows no mismatch toast, a boundary the requirement's own trigger implies but no scenario stated explicitly. Folded as `shared-auth-sign-in-SC-69`.
- **Uncovered anchors** — none; every scenario (`shared-auth-sign-in-SC-63` through `shared-auth-sign-in-SC-69`) is reached by at least one case.
- **Contradicted** — none; both readings agreed on every point they both stated.
- **Raised, deferred** — three questions the blind pass could not settle from the material went to `decisions.md`'s `## Raised` table for the author: which toast wins when a link is both invalid (expired, used, or banned) and for a different account; whether Stay or dismiss consumes the link or leaves it usable again; and what happens when a second mismatched link is followed while a mismatch toast is already showing.
