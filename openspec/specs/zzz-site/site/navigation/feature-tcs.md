# zzz-site/site/navigation Test Cases

**Status:** pending-review · 0/11
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* The ZZZ site answers at `<zzz home url>`, with sign-in at `<zzz sign-in url>` and the profile at `<zzz profile url>`; `<unknown address>` is an address under no surface the site answers.
* A full document load shows in the browser's network log as a new document request.

## zzz.site-navigation.US1: Collector opens a ZZZ address directly

**As a** collector,
**I want** sign-in and the profile to answer at addresses of their own, and an
address under no surface to answer as not-found with a clear static message
and a way home,
**so that** a link or a refresh puts me back on the surface I was on rather
than at home, and when none answers I know I am still on the site and can
leave for home.

<!-- trace:case id=zzz.site-navigation.TC-wbf rev=1 covers=zzz.site-navigation.SC-lm3,zzz.site-navigation.SC-epz,zzz.site-navigation.SC-h76 -->
### zzz.site-navigation.US1-TC1: A surface's own address opens that surface, by link or refresh

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** zzz-site-site-navigation-US-01

**Pre-conditions:**

* A collector, `<session>`.

**Test data:**

| `<session>` | `<reach>` | `<surface>` |
| --- | --- | --- |
| signed out | following a link to `<zzz sign-in url>` | sign-in |
| signed out | moving from home to sign-in, then refreshing | sign-in |
| signed in | following a link to `<zzz profile url>` | the profile |
| signed in | opening `<zzz profile url>`, then refreshing | the profile |

**Steps:**

1. Reach the page by `<reach>`; read the surface and the address.

**Expected Results:**

* `<surface>` renders at its own address, never home.

<!-- trace:case id=zzz.site-navigation.TC-c5s rev=2 covers=zzz.site-navigation.SC-lm3,zzz.site-navigation.SC-epz,zzz.site-navigation.SC-h76,zzz.site-navigation.SC-gbj -->
### zzz.site-navigation.US1-TC3: An unknown address shows not-found in fixed words, and stays

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** zzz-site-site-navigation-US-01

**Pre-conditions:**

* None.

**Steps:**

1. Open `<unknown address>`; read the title and the description.
2. Wait without clicking; read the address bar and the surface.

**Expected Results:**

* Step 1 renders not-found, never home: the title reads Nothing is here, the description The link may be wrong, or the page may have moved., and no part of the address shows on the page.
* Step 2 still shows not-found at the address opened.

<!-- trace:case id=zzz.site-navigation.TC-04e rev=1 covers=zzz.site-navigation.SC-lm3,zzz.site-navigation.SC-epz,zzz.site-navigation.SC-h76,zzz.site-navigation.SC-gbj -->
### zzz.site-navigation.US1-TC6: Back to Home leaves not-found for home

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** zzz-site-site-navigation-US-01

**Pre-conditions:**

* A collector is on not-found after opening `<unknown address>`.

**Steps:**

1. Click Back to Home.

**Expected Results:**

* Home renders at `<zzz home url>`.

---

## zzz.site-navigation.US2: Collector asks for a session-decided address

**As a** collector,
**I want** home and sign-in to answer with what my session allows, replacing
the entry they correct,
**so that** I land on the surface I am actually allowed, and going back never
bounces me forward again.

<!-- trace:case id=zzz.site-navigation.TC-wvn rev=1 covers=zzz.site-navigation.SC-wwn,zzz.site-navigation.SC-i43,zzz.site-navigation.SC-q5b,zzz.site-navigation.SC-zrz -->
### zzz.site-navigation.US2-TC1: A signed-in collector asking for home or sign-in lands on the profile, and Back skips the correction

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** zzz-site-site-navigation-US-02

**Pre-conditions:**

* A signed-in collector is on a page outside the site.

**Test data:**

| `<asked for>` |
| --- |
| `<zzz home url>` |
| `<zzz sign-in url>` |

**Steps:**

1. Open `<asked for>`; read the surface and the address.
2. Press the browser's Back.

**Expected Results:**

* Step 1 renders their profile, the address reading as the profile.
* Step 2 returns to the page outside the site, never to `<asked for>`.

<!-- trace:case id=zzz.site-navigation.TC-l1w rev=1 covers=zzz.site-navigation.SC-wwn,zzz.site-navigation.SC-i43,zzz.site-navigation.SC-q5b,zzz.site-navigation.SC-zrz -->
### zzz.site-navigation.US2-TC4: Not-found renders before the session is known

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** zzz-site-site-navigation-US-02

**Pre-conditions:**

* The session's check is made slow to answer.

**Steps:**

1. Open `<unknown address>`; read the surface before the check answers.

**Expected Results:**

* Not-found renders without waiting for the session.

---

## zzz.site-navigation.US3: Collector moves between surfaces without a page load

**As a** collector,
**I want** movement between the site's surfaces to stay in the page, with
history stepping back through it and my own click modifiers left alone,
**so that** moving around the site is immediate without taking away the
browser behavior I asked for.

<!-- trace:case id=zzz.site-navigation.TC-ox6 rev=1 covers=zzz.site-navigation.SC-guq,zzz.site-navigation.SC-9ws,zzz.site-navigation.SC-mbz,zzz.site-navigation.SC-e3y -->
### zzz.site-navigation.US3-TC1: Moving to sign-in and back stays in the page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** zzz-site-site-navigation-US-03

**Pre-conditions:**

* A signed-out collector is on home, the network log open.

**Steps:**

1. Choose to sign in; read the surface, the address and the network log.
2. Press the browser's Back; read them again.

**Expected Results:**

* Step 1 renders sign-in at its own address with no full document load.
* Step 2 renders home, still with no full document load.

<!-- trace:case id=zzz.site-navigation.TC-dkp rev=1 covers=zzz.site-navigation.SC-guq,zzz.site-navigation.SC-9ws,zzz.site-navigation.SC-mbz,zzz.site-navigation.SC-e3y -->
### zzz.site-navigation.US3-TC3: A modified click or a link to another site does what the browser does

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** zzz-site-site-navigation-US-03

**Pre-conditions:**

* A collector is on a surface showing `<link>`.

**Test data:**

| `<link>` | `<click>` | `<outcome>` |
| --- | --- | --- |
| an in-site link | with the new-tab modifier held | the link opens in a new tab, this one unmoved |
| a link to another origin | plainly | the other site loads as a normal page load |

**Steps:**

1. Click `<link>` `<click>`.

**Expected Results:**

* `<outcome>`.

---

## zzz.site-navigation.US4: Collector resumes a surface where they left it

**As a** collector,
**I want** back and forward to return me to the scroll position I left an
entry at, and a new entry to start at the top,
**so that** I keep my place in a surface I return to instead of finding it
from the beginning.

<!-- trace:case id=zzz.site-navigation.TC-gan rev=1 covers=zzz.site-navigation.SC-2ks,zzz.site-navigation.SC-kt9 -->
### zzz.site-navigation.US4-TC1: A new surface opens at the top, and Back returns to where the collector left

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** zzz-site-site-navigation-US-04

**Pre-conditions:**

* A collector is on home, scrolled partway down.

**Steps:**

1. Move to another surface; read where it is scrolled.
2. Press the browser's Back; read where home is scrolled.

**Expected Results:**

* Step 1 opens at the top.
* Step 2 returns to home where it was left.

---

## zzz.site-navigation.US5: Collector downloads only the surface they open

**As a** collector,
**I want** a surface to cost only its own page code, loaded when I move to it,
**so that** opening one surface does not make me pay for the ones I did not
open.

<!-- trace:case id=zzz.site-navigation.TC-qpt rev=1 covers=zzz.site-navigation.SC-ghb,zzz.site-navigation.SC-hgk -->
### zzz.site-navigation.US5-TC1: Home loads no other surface's page code until the collector moves there

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** zzz-site-site-navigation-US-05

**Pre-conditions:**

* A browser with an empty cache, the network log open.

**Steps:**

1. Open `<zzz home url>`; read the scripts loaded.
2. Move to sign-in; read the scripts loaded and the surface.

**Expected Results:**

* Step 1 loads no script holding sign-in's or the profile's page code.
* Step 2 loads sign-in's page code, and sign-in renders.

---

## zzz.site-navigation.US6: Collector opens the profile with no session

**As a** collector without a session,
**I want** the profile's own address to stay put while I sign in, and to be
sent home if I leave without one,
**so that** what I came for is what renders the moment I have a session, and
leaving puts me somewhere I can read instead of on a blank page.

<!-- trace:case id=zzz.site-navigation.TC-w65 rev=1 covers=zzz.site-navigation.SC-wjt,zzz.site-navigation.SC-q90,zzz.site-navigation.SC-pan -->
### zzz.site-navigation.US6-TC1: The profile's address stays put while it asks for sign-in, and renders once signed in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** zzz-site-site-navigation-US-06

**Pre-conditions:**

* The collector is not signed in.

**Steps:**

1. Open `<zzz profile url>`; read the surface and the address.
2. Complete sign-in in the dialog; read the surface and the address.

**Expected Results:**

* Step 1 opens the sign-in dialog over a blank profile, the address the profile's own.
* Step 2 closes the dialog and renders the profile at that same address, with no navigation between.

<!-- trace:case id=zzz.site-navigation.TC-9tc rev=1 covers=zzz.site-navigation.SC-wjt,zzz.site-navigation.SC-q90,zzz.site-navigation.SC-pan -->
### zzz.site-navigation.US6-TC2: Leaving the ask at the profile's address goes home

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** zzz-site-site-navigation-US-06

**Pre-conditions:**

* The collector is not signed in, and has opened `<zzz profile url>` from a page outside the site.

**Steps:**

1. Dismiss the sign-in dialog; read the surface and the address.
2. Press the browser's Back.

**Expected Results:**

* Step 1 renders home, the address reading as home.
* Step 2 returns to the page outside the site, never to the profile.

---

## Settled

Which locale the not-found surface's words render in is `shared/localization`'s
job, not this capability's — `shared-localization-SC-19` and
`shared-localization-SC-27` already guarantee a not-found surface renders in
the visiting locale for any unknown address, platform-wide.
