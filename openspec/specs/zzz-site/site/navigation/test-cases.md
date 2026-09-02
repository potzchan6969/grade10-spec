# zzz-site/site/navigation Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## navigation-US1: Collector opens a ZZZ address directly

**As a** collector,
**I want** sign-in and the profile to answer at addresses of their own, and an
address under no surface to answer as not-found,
**so that** a link or a refresh puts me back on the surface I was on rather
than at home.

### navigation-US1-TC1-1: Sign-in and profile answer at their own addresses

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** navigation-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <zzz sign-in url> by link or by refresh.
2. Navigate to <zzz profile url> while signed in, by link or by refresh.

**Expected Results:**

* Sign-in renders at the sign-in address.
* The profile renders at the profile address.

### navigation-US1-TC2-1: Refresh keeps the collector on sign-in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** navigation-US-01

**Pre-conditions:**
A collector who moved from home to sign-in.

**Steps:**

1. Navigate to <zzz home url>.
2. Move to sign-in.
3. Refresh.

**Expected Results:**

* Sign-in renders, not home.

### navigation-US1-TC3-1: Unknown address resolves to not-found, never home

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** navigation-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <an address under no surface the zzz site answers>.
2. Check the rendered surface.

**Expected Results:**

* The not-found surface renders, naming the address that failed.

---

## navigation-US2: Collector asks for a session-decided address

**As a** collector,
**I want** home, sign-in, and the profile to answer with what my session
allows, replacing the entry they correct,
**so that** I land on the surface I am actually allowed, and going back never
bounces me forward again.

### navigation-US2-TC1-1: Signed-in collector landing on home is sent to the profile

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** navigation-US-02

**Pre-conditions:**
Signed in as a collector on ZZZ.

**Steps:**

1. Navigate to <zzz home url>.
2. Check the surface and the address.

**Expected Results:**

* Their profile renders.
* The address reads as the profile.

### navigation-US2-TC2-1: Signed-in collector asking for sign-in is sent to the profile

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** navigation-US-02

**Pre-conditions:**
Signed in as a collector on ZZZ.

**Steps:**

1. Navigate to <zzz sign-in url>.
2. Check the surface and the address.

**Expected Results:**

* Their profile renders.
* The address reads as the profile.

### navigation-US2-TC3-1: Signed-out collector asking for the profile is sent to sign-in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** navigation-US-02

**Pre-conditions:**
The collector is not signed in.

**Steps:**

1. Navigate to <zzz profile url>.
2. Check the surface and the address.

**Expected Results:**

* The sign-in surface renders.
* The address reads as sign-in.

### navigation-US2-TC4-1: Back never returns to a corrected address

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** navigation-US-02

**Pre-conditions:**
A collector whose navigation was just corrected.

**Steps:**

1. Navigate to <zzz home url> while signed out.
2. Open <zzz profile url> and wait for the correction to sign-in.
3. Go back.

**Expected Results:**

* They arrive where they were before asking, never at the address that corrected them forward.

### navigation-US2-TC5-1: Not-found does not wait for the session

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** navigation-US-02

**Pre-conditions:**
The session has not yet resolved.

**Steps:**

1. Navigate to <an address under no surface the zzz site answers> before the session resolves.
2. Check which surface renders.

**Expected Results:**

* The not-found surface renders without waiting for the session.

---

## navigation-US3: Collector moves between surfaces without a page load

**As a** collector,
**I want** movement between the site's surfaces to stay in the page, with
history stepping back through it and my own click modifiers left alone,
**so that** moving around the site is immediate without taking away the
browser behavior I asked for.

### navigation-US3-TC1-1: Sign-in opens in place from home

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** navigation-US-03

**Pre-conditions:**
A collector is on home.

**Steps:**

1. Navigate to <zzz home url>.
2. Choose to sign in.

**Expected Results:**

* The sign-in surface renders at its address without a full document load.

### navigation-US3-TC2-1: Back steps back into the site without a page load

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** navigation-US-03

**Pre-conditions:**
A collector who moved from home to sign-in.

**Steps:**

1. Navigate to <zzz home url>.
2. Move to sign-in.
3. Go back.

**Expected Results:**

* Home renders, still without a full document load.

### navigation-US3-TC3-1: Modified click stays the browser's

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** navigation-US-03

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <zzz home url>.
2. Click an in-app link with a modifier held that opens a new tab.

**Expected Results:**

* The browser's own behavior happens, unaltered.

### navigation-US3-TC4-1: Other-origin link is a normal page load

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** navigation-US-03

**Pre-conditions:**
A surface shows a link to another origin.

**Steps:**

1. Navigate to that surface.
2. Click the other-origin link.

**Expected Results:**

* The browser follows it as a normal page load.

---

## navigation-US4: Collector resumes a surface where they left it

**As a** collector,
**I want** back and forward to return me to the scroll position I left an
entry at, and a new entry to start at the top,
**so that** I keep my place in a surface I return to instead of finding it
from the beginning.

### navigation-US4-TC1-1: Back returns to the left scroll position

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** navigation-US-04

**Pre-conditions:**
A collector who scrolled partway down a surface and navigated from there.

**Steps:**

1. Navigate to <zzz home url> and scroll partway down.
2. Navigate to another surface.
3. Go back.

**Expected Results:**

* The surface is scrolled to where they left it.

### navigation-US4-TC2-1: New surface starts at the top

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** navigation-US-04

**Pre-conditions:**
A collector scrolled partway down a surface.

**Steps:**

1. Navigate to <zzz home url> and scroll partway down.
2. Navigate to another surface.

**Expected Results:**

* The destination renders scrolled to the top.

---

## navigation-US5: Collector downloads only the surface they open

**As a** collector,
**I want** a surface to cost only its own page code, loaded when I move to it,
**so that** opening one surface does not make me pay for the ones I did not
open.

### navigation-US5-TC1-1: Cold home visit downloads no profile or sign-in page code

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** performance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** navigation-US-05

**Pre-conditions:**
A cold browser with an empty cache.

**Steps:**

1. Open the network log.
2. Navigate to <zzz home url>.
3. Check downloaded scripts.

**Expected Results:**

* No script containing the profile's or sign-in's page code is downloaded.

### navigation-US5-TC2-1: Sign-in page code loads on arrival

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** performance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** navigation-US-05

**Pre-conditions:**
A collector is on home.

**Steps:**

1. Navigate to <zzz home url>.
2. Move to sign-in.
3. Check downloaded scripts and the rendered surface.

**Expected Results:**

* Sign-in's page code loads and sign-in renders.
