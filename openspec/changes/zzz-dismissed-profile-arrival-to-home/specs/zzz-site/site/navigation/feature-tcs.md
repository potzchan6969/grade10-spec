# zzz-site/site/navigation Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3

## zzz-site-site-navigation-US2: Collector asks for a session-decided address

**As a** collector,
**I want** home and sign-in to answer with what my session allows, replacing
the entry they correct,
**so that** I land on the surface I am actually allowed, and going back never
bounces me forward again.

### zzz-site-site-navigation-US2-TC1-1: Signed-in collector landing on home is sent to the profile

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
* **Trace:** zzz-site-site-navigation-US-02

**Pre-conditions:**
Signed in as a collector on ZZZ.

**Steps:**

1. Navigate to <zzz home url>.
2. Check the surface and the address.

**Expected Results:**

* Their profile renders.
* The address reads as the profile.

### zzz-site-site-navigation-US2-TC2-1: Signed-in collector asking for sign-in is sent to the profile

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
* **Trace:** zzz-site-site-navigation-US-02

**Pre-conditions:**
Signed in as a collector on ZZZ.

**Steps:**

1. Navigate to <zzz sign-in url>.
2. Check the surface and the address.

**Expected Results:**

* Their profile renders.
* The address reads as the profile.

### zzz-site-site-navigation-US2-TC3-1: Back never returns to a corrected address

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** zzz-site-site-navigation-US-02

**Pre-conditions:**
Signed in as a collector on ZZZ, on the profile after following a link there
from <zzz home url> before it corrected.

**Steps:**

1. Navigate to <zzz home url>.
2. Wait for the correction to the profile.
3. Go back.

**Expected Results:**

* They arrive where they were before opening home, never at home again.

### zzz-site-site-navigation-US2-TC4-1: Not-found does not wait for the session

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** zzz-site-site-navigation-US-02

**Pre-conditions:**
The session has not yet resolved.

**Steps:**

1. Navigate to <an address under no surface the zzz site answers> before the session resolves.
2. Check which surface renders.

**Expected Results:**

* The not-found surface renders without waiting for the session.

---

## zzz-site-site-navigation-US6: Collector opens the profile with no session

**As a** collector without a session,
**I want** the profile's own address to stay put while I sign in, and to be
sent home if I leave without one,
**so that** what I came for is what renders the moment I have a session, and
leaving puts me somewhere I can read instead of on a blank page.

### zzz-site-site-navigation-US6-TC1-1: The profile's address stays put while it asks

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** zzz-site-site-navigation-US-06

**Pre-conditions:**
The collector is not signed in.

**Steps:**

1. Navigate to <zzz profile url>.
2. Check the surface and the address.
3. Complete sign-in in the dialog.

**Expected Results:**

* The sign-in dialog opens over a blank profile.
* Step 2 shows the profile's own address, uncorrected.
* The dialog closes and the profile renders at that same address, with no
  navigation in between.

### zzz-site-site-navigation-US6-TC2-1: Leaving the ask at the profile's address goes home

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** zzz-site-site-navigation-US-06

**Pre-conditions:**
The collector is not signed in and has opened <zzz profile url>.

**Steps:**

1. Dismiss the sign-in dialog.
2. Read the address bar.
3. Press the browser's Back.

**Expected Results:**

* <zzz home url> renders.
* Step 2 shows home's address, not the profile's.
* Step 3 leaves the site rather than returning to the profile.
