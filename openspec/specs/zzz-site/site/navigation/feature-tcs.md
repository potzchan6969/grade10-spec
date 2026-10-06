# zzz-site/site/navigation Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## zzz-site-site-navigation-US1: Collector opens a ZZZ address directly

**As a** collector,
**I want** sign-in and the profile to answer at addresses of their own, and an
address under no surface to answer as not-found with a clear static message
and a way home,
**so that** a link or a refresh puts me back on the surface I was on rather
than at home, and when none answers I know I am still on the site and can
leave for home.

<!-- trace:case id=zzz.site-navigation.TC-wbf rev=1 covers=zzz.site-navigation.SC-lm3,zzz.site-navigation.SC-epz,zzz.site-navigation.SC-h76 -->
### zzz-site-site-navigation-US1-TC1-1: Sign-in and profile answer at their own addresses

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** zzz-site-site-navigation-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <zzz sign-in url> by link or by refresh.
2. Navigate to <zzz profile url> while signed in, by link or by refresh.

**Expected Results:**

* Sign-in renders at the sign-in address.
* The profile renders at the profile address.

<!-- trace:case id=zzz.site-navigation.TC-eqp rev=1 covers=zzz.site-navigation.SC-lm3,zzz.site-navigation.SC-epz,zzz.site-navigation.SC-h76 -->
### zzz-site-site-navigation-US1-TC2-1: Refresh keeps the collector on sign-in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** zzz-site-site-navigation-US-01

**Pre-conditions:**
A collector who moved from home to sign-in.

**Steps:**

1. Navigate to <zzz home url>.
2. Move to sign-in.
3. Refresh.

**Expected Results:**

* Sign-in renders, not home.

<!-- trace:case id=zzz.site-navigation.TC-c5s rev=2 covers=zzz.site-navigation.SC-lm3,zzz.site-navigation.SC-epz,zzz.site-navigation.SC-h76 -->
### zzz-site-site-navigation-US1-TC3-2: Unknown address resolves to not-found, never home, never naming it

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
* **Trace:** zzz-site-site-navigation-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <an address under no surface the zzz site answers>.
2. Check the rendered surface.

**Expected Results:**

* The not-found surface renders, not <zzz home url>.
* The failed address does not appear anywhere on the page.

<!-- trace:case id=zzz.site-navigation.TC-xmz rev=1 covers=zzz.site-navigation.SC-lm3,zzz.site-navigation.SC-epz,zzz.site-navigation.SC-h76,zzz.site-navigation.SC-gbj -->
### zzz-site-site-navigation-US1-TC4-1: Not-found shows only the shared catalog's static words

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** zzz-site-site-navigation-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <an address under no surface the zzz site answers>.
2. Read the rendered title and description.

**Expected Results:**

* The title reads exactly "Nothing is here".
* The description reads exactly "The link may be wrong, or the page may have moved."
* Neither string contains any part of the address navigated to in step 1.

<!-- trace:case id=zzz.site-navigation.TC-pfw rev=1 covers=zzz.site-navigation.SC-lm3,zzz.site-navigation.SC-epz,zzz.site-navigation.SC-h76,zzz.site-navigation.SC-gbj -->
### zzz-site-site-navigation-US1-TC5-1: Not-found never reflects a crafted address

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** zzz-site-site-navigation-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <an address under no surface the zzz site answers, with a path
   segment carrying markup such as `<script>`>.
2. Read the rendered page's title, description, and markup.

**Expected Results:**

* The not-found surface renders the same static title and description as any
  other unknown address.
* No part of the crafted address appears anywhere on the page, as text or as
  markup.
* No script from the crafted address executes.

<!-- trace:case id=zzz.site-navigation.TC-04e rev=1 covers=zzz.site-navigation.SC-lm3,zzz.site-navigation.SC-epz,zzz.site-navigation.SC-h76,zzz.site-navigation.SC-gbj -->
### zzz-site-site-navigation-US1-TC6-1: Back to Home leaves not-found for the ZZZ home

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** zzz-site-site-navigation-US-01

**Pre-conditions:**
A collector is on the not-found surface after navigating to <an address under
no surface the zzz site answers>.

**Steps:**

1. Click "Back to Home".

**Expected Results:**

* <zzz home url> renders.

<!-- trace:case id=zzz.site-navigation.TC-7f7 rev=1 covers=zzz.site-navigation.SC-lm3,zzz.site-navigation.SC-epz,zzz.site-navigation.SC-h76,zzz.site-navigation.SC-gbj -->
### zzz-site-site-navigation-US1-TC7-1: Not-found does not correct itself to home on its own

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** zzz-site-site-navigation-US-01

**Pre-conditions:**
A collector has navigated to <an address under no surface the zzz site
answers>.

**Steps:**

1. Wait, without clicking anything.
2. Read the address bar and the rendered surface.

**Expected Results:**

* The not-found surface is still rendered.
* <zzz home url> has not been reached.
* The address bar still shows the address navigated to.

---

## zzz-site-site-navigation-US2: Collector asks for a session-decided address

**As a** collector,
**I want** home and sign-in to answer with what my session allows, replacing
the entry they correct,
**so that** I land on the surface I am actually allowed, and going back never
bounces me forward again.

<!-- trace:case id=zzz.site-navigation.TC-wvn rev=1 covers=zzz.site-navigation.SC-wwn,zzz.site-navigation.SC-i43,zzz.site-navigation.SC-q5b,zzz.site-navigation.SC-zrz -->
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

<!-- trace:case id=zzz.site-navigation.TC-i9g rev=1 covers=zzz.site-navigation.SC-wwn,zzz.site-navigation.SC-i43,zzz.site-navigation.SC-q5b,zzz.site-navigation.SC-zrz -->
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

<!-- trace:case id=zzz.site-navigation.TC-lr1 rev=1 covers=zzz.site-navigation.SC-wwn,zzz.site-navigation.SC-i43,zzz.site-navigation.SC-q5b,zzz.site-navigation.SC-zrz -->
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

<!-- trace:case id=zzz.site-navigation.TC-l1w rev=1 covers=zzz.site-navigation.SC-wwn,zzz.site-navigation.SC-i43,zzz.site-navigation.SC-q5b,zzz.site-navigation.SC-zrz -->
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

## zzz-site-site-navigation-US3: Collector moves between surfaces without a page load

**As a** collector,
**I want** movement between the site's surfaces to stay in the page, with
history stepping back through it and my own click modifiers left alone,
**so that** moving around the site is immediate without taking away the
browser behavior I asked for.

<!-- trace:case id=zzz.site-navigation.TC-ox6 rev=1 covers=zzz.site-navigation.SC-guq,zzz.site-navigation.SC-9ws,zzz.site-navigation.SC-mbz,zzz.site-navigation.SC-e3y -->
### zzz-site-site-navigation-US3-TC1-1: Sign-in opens in place from home

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** zzz-site-site-navigation-US-03

**Pre-conditions:**
A collector is on home.

**Steps:**

1. Navigate to <zzz home url>.
2. Choose to sign in.

**Expected Results:**

* The sign-in surface renders at its address without a full document load.

<!-- trace:case id=zzz.site-navigation.TC-d18 rev=1 covers=zzz.site-navigation.SC-guq,zzz.site-navigation.SC-9ws,zzz.site-navigation.SC-mbz,zzz.site-navigation.SC-e3y -->
### zzz-site-site-navigation-US3-TC2-1: Back steps back into the site without a page load

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** zzz-site-site-navigation-US-03

**Pre-conditions:**
A collector who moved from home to sign-in.

**Steps:**

1. Navigate to <zzz home url>.
2. Move to sign-in.
3. Go back.

**Expected Results:**

* Home renders, still without a full document load.

<!-- trace:case id=zzz.site-navigation.TC-dkp rev=1 covers=zzz.site-navigation.SC-guq,zzz.site-navigation.SC-9ws,zzz.site-navigation.SC-mbz,zzz.site-navigation.SC-e3y -->
### zzz-site-site-navigation-US3-TC3-1: Modified click stays the browser's

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** zzz-site-site-navigation-US-03

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <zzz home url>.
2. Click an in-app link with a modifier held that opens a new tab.

**Expected Results:**

* The browser's own behavior happens, unaltered.

<!-- trace:case id=zzz.site-navigation.TC-11a rev=1 covers=zzz.site-navigation.SC-guq,zzz.site-navigation.SC-9ws,zzz.site-navigation.SC-mbz,zzz.site-navigation.SC-e3y -->
### zzz-site-site-navigation-US3-TC4-1: Other-origin link is a normal page load

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** zzz-site-site-navigation-US-03

**Pre-conditions:**
A surface shows a link to another origin.

**Steps:**

1. Navigate to that surface.
2. Click the other-origin link.

**Expected Results:**

* The browser follows it as a normal page load.

---

## zzz-site-site-navigation-US4: Collector resumes a surface where they left it

**As a** collector,
**I want** back and forward to return me to the scroll position I left an
entry at, and a new entry to start at the top,
**so that** I keep my place in a surface I return to instead of finding it
from the beginning.

<!-- trace:case id=zzz.site-navigation.TC-gan rev=1 covers=zzz.site-navigation.SC-2ks,zzz.site-navigation.SC-kt9 -->
### zzz-site-site-navigation-US4-TC1-1: Back returns to the left scroll position

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** zzz-site-site-navigation-US-04

**Pre-conditions:**
A collector who scrolled partway down a surface and navigated from there.

**Steps:**

1. Navigate to <zzz home url> and scroll partway down.
2. Navigate to another surface.
3. Go back.

**Expected Results:**

* The surface is scrolled to where they left it.

<!-- trace:case id=zzz.site-navigation.TC-93k rev=1 covers=zzz.site-navigation.SC-2ks,zzz.site-navigation.SC-kt9 -->
### zzz-site-site-navigation-US4-TC2-1: New surface starts at the top

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** zzz-site-site-navigation-US-04

**Pre-conditions:**
A collector scrolled partway down a surface.

**Steps:**

1. Navigate to <zzz home url> and scroll partway down.
2. Navigate to another surface.

**Expected Results:**

* The destination renders scrolled to the top.

---

## zzz-site-site-navigation-US5: Collector downloads only the surface they open

**As a** collector,
**I want** a surface to cost only its own page code, loaded when I move to it,
**so that** opening one surface does not make me pay for the ones I did not
open.

<!-- trace:case id=zzz.site-navigation.TC-qpt rev=1 covers=zzz.site-navigation.SC-ghb,zzz.site-navigation.SC-hgk -->
### zzz-site-site-navigation-US5-TC1-1: Cold home visit downloads no profile or sign-in page code

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** performance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** zzz-site-site-navigation-US-05

**Pre-conditions:**
A cold browser with an empty cache.

**Steps:**

1. Open the network log.
2. Navigate to <zzz home url>.
3. Check downloaded scripts.

**Expected Results:**

* No script containing the profile's or sign-in's page code is downloaded.

<!-- trace:case id=zzz.site-navigation.TC-cyz rev=1 covers=zzz.site-navigation.SC-ghb,zzz.site-navigation.SC-hgk -->
### zzz-site-site-navigation-US5-TC2-1: Sign-in page code loads on arrival

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** performance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** zzz-site-site-navigation-US-05

**Pre-conditions:**
A collector is on home.

**Steps:**

1. Navigate to <zzz home url>.
2. Move to sign-in.
3. Check downloaded scripts and the rendered surface.

**Expected Results:**

* Sign-in's page code loads and sign-in renders.

---

## zzz-site-site-navigation-US6: Collector opens the profile with no session

**As a** collector without a session,
**I want** the profile's own address to stay put while I sign in, and to be
sent home if I leave without one,
**so that** what I came for is what renders the moment I have a session, and
leaving puts me somewhere I can read instead of on a blank page.

<!-- trace:case id=zzz.site-navigation.TC-w65 rev=1 covers=zzz.site-navigation.SC-wjt,zzz.site-navigation.SC-q90,zzz.site-navigation.SC-pan -->
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

<!-- trace:case id=zzz.site-navigation.TC-9tc rev=1 covers=zzz.site-navigation.SC-wjt,zzz.site-navigation.SC-q90,zzz.site-navigation.SC-pan -->
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

## Settled

Which locale the not-found surface's words render in is `shared/localization`'s
job, not this capability's — `shared-localization-SC-19` and
`shared-localization-SC-27` already guarantee a not-found surface renders in
the visiting locale for any unknown address, platform-wide.
