# grade10-site/navigation Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## navigation-US1: Collector reaches the surface an address names

**As a** collector,
**I want** every address to resolve to one surface — the deepest one naming
it, or the not-found surface,
**so that** a link I open lands me on the surface that owns it, and tells me
which address failed when none does.

### navigation-US1-TC1-1: Nested address answers as its parent surface

**Classification:**

* **Severity:** critical
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

1. Navigate to <an address beneath the store that no surface of its own names>.
2. Check which surface renders.

**Expected Results:**

* That parent surface renders.

### navigation-US1-TC2-1: Nested lot address renders the lot, not the auction

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
The catalogue publishes <a published lot>.

**Steps:**

1. Navigate to <a published lot url>.
2. Check which surface renders.

**Expected Results:**

* The nested lot surface renders, not the auction above it.

### navigation-US1-TC3-1: Unknown address resolves to not-found naming it

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

1. Navigate to <an address under no surface the site answers>.
2. Check the rendered surface.

**Expected Results:**

* The not-found surface renders, naming the address that failed.

---

## navigation-US2: Collector moves between surfaces without a page load

**As a** collector,
**I want** an in-app link, the chrome's included, to navigate in place while
my own click modifiers and other origins stay the browser's,
**so that** moving around the site is immediate without taking away the
browser behavior I asked for.

### navigation-US2-TC1-1: Chrome link navigates in place

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
A collector is on any surface.

**Steps:**

1. Navigate to <grade10 marketing url>.
2. Click a header or footer link to another surface.

**Expected Results:**

* The destination surface renders without a full document load.

### navigation-US2-TC2-1: Modified click stays the browser's

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** navigation-US-02

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 marketing url>.
2. Click an in-app link with a modifier held that opens a new tab.

**Expected Results:**

* The browser's own behavior happens, unaltered.

### navigation-US2-TC3-1: Other-origin link is a normal page load

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** navigation-US-02

**Pre-conditions:**
A surface shows a link to another origin.

**Steps:**

1. Navigate to that surface.
2. Click the other-origin link.

**Expected Results:**

* The browser follows it as a normal page load.

---

## navigation-US3: Collector asks for a session-decided address

**As a** collector,
**I want** the profile and sign-in addresses to answer with what my session
allows, replacing the entry they correct,
**so that** I land on the surface I am actually allowed, and going back never
bounces me forward again.

### navigation-US3-TC1-1: Signed-out profile address corrects to sign-in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** navigation-US-03

**Pre-conditions:**
The collector is not signed in.

**Steps:**

1. Navigate to <grade10 profile url>.
2. Check the surface and the address.

**Expected Results:**

* The sign-in surface renders.
* The address reads as sign-in.

### navigation-US3-TC2-1: Signed-in sign-in address corrects to the profile

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
Signed in as a collector.

**Steps:**

1. Navigate to <grade10 sign-in url>.
2. Check the surface and the address.

**Expected Results:**

* Their profile renders.
* The address reads as the profile.

### navigation-US3-TC3-1: Back never returns to a corrected address

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
A collector whose navigation was just corrected.

**Steps:**

1. Navigate to <grade10 marketing url> while signed out.
2. Open <grade10 profile url> and wait for the correction to sign-in.
3. Go back.

**Expected Results:**

* They arrive where they were before asking, never at the address that corrected them forward.

### navigation-US3-TC4-1: Public surface does not wait for the session

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
The session has not yet resolved.

**Steps:**

1. Navigate to <grade10 marketing url> before the session resolves.
2. Check which surface renders.

**Expected Results:**

* That surface renders without waiting for the session.

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
A collector who scrolled partway down a surface and followed a link from there.

**Steps:**

1. Navigate to <grade10 marketing url> and scroll partway down.
2. Follow a link to another surface.
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

1. Navigate to <grade10 marketing url> and scroll partway down.
2. Follow a link to another surface.

**Expected Results:**

* The destination renders scrolled to the top.

---

## navigation-US5: Collector downloads only the surface they open

**As a** collector,
**I want** a surface to cost only its own page code, loaded when I navigate to
it,
**so that** opening one surface does not make me pay for the ones I did not
open.

### navigation-US5-TC1-1: Cold marketing visit downloads no store or auction page code

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
2. Navigate to <grade10 marketing url>.
3. Check downloaded scripts.

**Expected Results:**

* No script containing the store's or the auction's page code is downloaded.

### navigation-US5-TC2-1: Store page code loads on arrival

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
A collector is on the marketing page.

**Steps:**

1. Navigate to <grade10 marketing url>.
2. Navigate to the store.
3. Check downloaded scripts and the rendered surface.

**Expected Results:**

* The store's page code loads and the store renders.
