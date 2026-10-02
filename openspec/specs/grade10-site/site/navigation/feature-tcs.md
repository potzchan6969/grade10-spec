# grade10-site/site/navigation Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-site-navigation-US1: Collector reaches the surface an address names

**As a** collector,
**I want** every address to resolve to one surface — the deepest one naming
it, or the not-found surface with a clear static message and a way home,
**so that** a link I open lands me on the surface that owns it, and when none
does I know I am still on the site and can leave for home.

<!-- trace:case id=g10.site-navigation.TC-07a rev=1 covers=g10.site-navigation.SC-70e,g10.site-navigation.SC-p5e,g10.site-navigation.SC-jo4 -->
### grade10-site-site-navigation-US1-TC1-1: Nested address answers as its parent surface

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
* **Trace:** grade10-site-site-navigation-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <an address beneath the store that no surface of its own names>.
2. Check which surface renders.

**Expected Results:**

* That parent surface renders.

<!-- trace:case id=g10.site-navigation.TC-b4n rev=1 covers=g10.site-navigation.SC-70e,g10.site-navigation.SC-p5e,g10.site-navigation.SC-jo4 -->
### grade10-site-site-navigation-US1-TC2-1: Nested lot address renders the lot, not the auction

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-navigation-US-01

**Pre-conditions:**
The catalogue publishes <a published lot>.

**Steps:**

1. Navigate to <a published lot url>.
2. Check which surface renders.

**Expected Results:**

* The nested lot surface renders, not the auction above it.

<!-- trace:case id=g10.site-navigation.TC-68k rev=2 covers=g10.site-navigation.SC-70e,g10.site-navigation.SC-p5e,g10.site-navigation.SC-jo4 -->
### grade10-site-site-navigation-US1-TC3-2: Unknown address resolves to not-found, without naming it

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
* **Trace:** grade10-site-site-navigation-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <an address under no surface the site answers>.
2. Check the rendered surface.

**Expected Results:**

* The not-found surface renders.
* The failed address does not appear anywhere on the page.

### grade10-site-site-navigation-US1-TC4-1: Not-found shows only the shared catalog's static words

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
* **Trace:** grade10-site-site-navigation-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <an address under no surface the site answers>.
2. Read the rendered title and description.

**Expected Results:**

* The title reads exactly "Nothing is here".
* The description reads exactly "The link may be wrong, or the page may have moved."
* Neither string contains any part of the address navigated to in step 1.

### grade10-site-site-navigation-US1-TC5-1: Not-found never reflects a crafted address

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
* **Trace:** grade10-site-site-navigation-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <an address under no surface the site answers, with a path
   segment carrying markup such as `<script>`>.
2. Read the rendered page's title, description, and markup.

**Expected Results:**

* The not-found surface renders the same static title and description as any
  other unknown address.
* No part of the crafted address appears anywhere on the page, as text or as
  markup.
* No script from the crafted address executes.

### grade10-site-site-navigation-US1-TC6-1: Back to Home leaves not-found for the brand home

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
* **Trace:** grade10-site-site-navigation-US-01

**Pre-conditions:**
A collector is on the not-found surface after navigating to <an address under
no surface the site answers>.

**Steps:**

1. Click "Back to Home".

**Expected Results:**

* <grade10 marketing url> renders.

---

## grade10-site-site-navigation-US2: Collector moves between surfaces without a page load

**As a** collector,
**I want** an in-app link, the chrome's included, to navigate in place while
my own click modifiers and other origins stay the browser's,
**so that** moving around the site is immediate without taking away the
browser behavior I asked for.

<!-- trace:case id=g10.site-navigation.TC-n38 rev=1 covers=g10.site-navigation.SC-jx8,g10.site-navigation.SC-4a8,g10.site-navigation.SC-xfo -->
### grade10-site-site-navigation-US2-TC1-1: Chrome link navigates in place

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-navigation-US-02

**Pre-conditions:**
A collector is on any surface.

**Steps:**

1. Navigate to <grade10 marketing url>.
2. Click a header or footer link to another surface.

**Expected Results:**

* The destination surface renders without a full document load.

<!-- trace:case id=g10.site-navigation.TC-nt8 rev=1 covers=g10.site-navigation.SC-jx8,g10.site-navigation.SC-4a8,g10.site-navigation.SC-xfo -->
### grade10-site-site-navigation-US2-TC2-1: Modified click stays the browser's

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-site-navigation-US-02

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 marketing url>.
2. Click an in-app link with a modifier held that opens a new tab.

**Expected Results:**

* The browser's own behavior happens, unaltered.

<!-- trace:case id=g10.site-navigation.TC-djm rev=1 covers=g10.site-navigation.SC-jx8,g10.site-navigation.SC-4a8,g10.site-navigation.SC-xfo -->
### grade10-site-site-navigation-US2-TC3-1: Other-origin link is a normal page load

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-navigation-US-02

**Pre-conditions:**
A surface shows a link to another origin.

**Steps:**

1. Navigate to that surface.
2. Click the other-origin link.

**Expected Results:**

* The browser follows it as a normal page load.

---

## grade10-site-site-navigation-US4: Collector resumes a surface where they left it

**As a** collector,
**I want** back and forward to return me to the scroll position I left an
entry at, and a new entry to start at the top,
**so that** I keep my place in a surface I return to instead of finding it
from the beginning.

<!-- trace:case id=g10.site-navigation.TC-3dz rev=1 covers=g10.site-navigation.SC-a0s,g10.site-navigation.SC-5ju -->
### grade10-site-site-navigation-US4-TC1-1: Back returns to the left scroll position

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-navigation-US-04

**Pre-conditions:**
A collector who scrolled partway down a surface and followed a link from there.

**Steps:**

1. Navigate to <grade10 marketing url> and scroll partway down.
2. Follow a link to another surface.
3. Go back.

**Expected Results:**

* The surface is scrolled to where they left it.

<!-- trace:case id=g10.site-navigation.TC-d2e rev=1 covers=g10.site-navigation.SC-a0s,g10.site-navigation.SC-5ju -->
### grade10-site-site-navigation-US4-TC2-1: New surface starts at the top

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-navigation-US-04

**Pre-conditions:**
A collector scrolled partway down a surface.

**Steps:**

1. Navigate to <grade10 marketing url> and scroll partway down.
2. Follow a link to another surface.

**Expected Results:**

* The destination renders scrolled to the top.

---

## grade10-site-site-navigation-US5: Collector downloads only the surface they open

**As a** collector,
**I want** a surface to cost only its own page code, loaded when I navigate to
it,
**so that** opening one surface does not make me pay for the ones I did not
open.

<!-- trace:case id=g10.site-navigation.TC-kk4 rev=1 covers=g10.site-navigation.SC-8k5,g10.site-navigation.SC-36n -->
### grade10-site-site-navigation-US5-TC1-1: Cold marketing visit downloads no store or auction page code

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** performance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-navigation-US-05

**Pre-conditions:**
A cold browser with an empty cache.

**Steps:**

1. Open the network log.
2. Navigate to <grade10 marketing url>.
3. Check downloaded scripts.

**Expected Results:**

* No script containing the store's or the auction's page code is downloaded.

<!-- trace:case id=g10.site-navigation.TC-xkh rev=1 covers=g10.site-navigation.SC-8k5,g10.site-navigation.SC-36n -->
### grade10-site-site-navigation-US5-TC2-1: Store page code loads on arrival

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** performance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-navigation-US-05

**Pre-conditions:**
A collector is on the marketing page.

**Steps:**

1. Navigate to <grade10 marketing url>.
2. Navigate to the store.
3. Check downloaded scripts and the rendered surface.

**Expected Results:**

* The store's page code loads and the store renders.

---

## grade10-site-site-navigation-US6: Collector follows a link to a surface that needs an account

**As a** collector without a session,
**I want** to be asked to sign in where I am standing rather than taken to the
surface first,
**so that** dismissing the ask leaves me reading what I was reading, and
signing in puts me on the surface I asked for.

<!-- trace:case id=g10.site-navigation.TC-8kz rev=2 covers=g10.site-navigation.SC-ceg,g10.site-navigation.SC-32w,g10.site-navigation.SC-jzp,g10.site-navigation.SC-rrx -->
### grade10-site-site-navigation-US6-TC1-2: Link to the bidding history asks in place, then lands it

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
* **Trace:** grade10-site-site-navigation-US-06

**Pre-conditions:**

* customer is signed out and is on <grade10 store url>.

**Steps:**

1. Follow a link to <grade10 bidding history url>.
2. Read the address bar.
3. Complete sign-in in the dialog.

**Expected Results:**

* The sign-in dialog opens over the store, which stays rendered.
* Step 2 shows the store's address, not the bidding history's.
* The dialog closes and the bidding history renders at <grade10 bidding history url>.

<!-- trace:case id=g10.site-navigation.TC-qei rev=2 covers=g10.site-navigation.SC-ceg,g10.site-navigation.SC-32w,g10.site-navigation.SC-jzp,g10.site-navigation.SC-rrx -->
### grade10-site-site-navigation-US6-TC2-2: Dismissing the ask leaves the collector reading the store

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
* **Trace:** grade10-site-site-navigation-US-06

**Pre-conditions:**

* customer is signed out, scrolled partway down <grade10 store url>, and has
  been asked to sign in after following a link to
  <grade10 bidding history url>.

**Steps:**

1. Dismiss the sign-in dialog.
2. Read the address bar.

**Expected Results:**

* The store renders, still scrolled where it was.
* Step 2 shows the store's address.
* The bidding history does not render.

<!-- trace:case id=g10.site-navigation.TC-lbj rev=2 covers=g10.site-navigation.SC-ceg,g10.site-navigation.SC-32w,g10.site-navigation.SC-jzp,g10.site-navigation.SC-rrx -->
### grade10-site-site-navigation-US6-TC3-2: A dismissed ask leaves no entry to go back to

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
* **Trace:** grade10-site-site-navigation-US-06

**Pre-conditions:**

* customer is signed out and reached <grade10 store url> from
  <grade10 marketing url>.

**Steps:**

1. Follow a link to <grade10 bidding history url>.
2. Dismiss the sign-in dialog.
3. Press the browser's Back.

**Expected Results:**

* <grade10 marketing url> renders.
* The bidding history's address is never reached.

---

## grade10-site-site-navigation-US7: Collector opens a surface that needs an account at its own address

**As a** collector arriving from a bookmark, a mailed link or the back button,
**I want** the address I asked for to stay the address I am at while I sign in,
**so that** what I came for is what renders the moment I have a session,
without being sent anywhere else first.

<!-- trace:case id=g10.site-navigation.TC-gpo rev=2 covers=g10.site-navigation.SC-b18,g10.site-navigation.SC-yjb,g10.site-navigation.SC-pih,g10.site-navigation.SC-1vk -->
### grade10-site-site-navigation-US7-TC1-2: The bidding history's own address asks there and renders there

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
* **Trace:** grade10-site-site-navigation-US-07

**Pre-conditions:**

* customer is signed out.

**Steps:**

1. Navigate to <grade10 bidding history url>.
2. Read the address bar.
3. Complete sign-in in the dialog.

**Expected Results:**

* The sign-in dialog opens and the surface shows nothing of its own.
* Step 2 shows <grade10 bidding history url>, uncorrected.
* The bidding history renders at that same address, with no navigation in between.

<!-- trace:case id=g10.site-navigation.TC-3xk rev=2 covers=g10.site-navigation.SC-b18,g10.site-navigation.SC-yjb,g10.site-navigation.SC-pih,g10.site-navigation.SC-1vk -->
### grade10-site-site-navigation-US7-TC2-2: Back onto a surface that asks is answered there

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
* **Trace:** grade10-site-site-navigation-US-07

**Pre-conditions:**

* customer was signed in on <grade10 bidding history url>, then navigated to
  <grade10 store url> and signed out there.

**Steps:**

1. Press the browser's Back.
2. Read the address bar.

**Expected Results:**

* Step 2 shows <grade10 bidding history url>.
* The sign-in dialog opens over it.

<!-- trace:case id=g10.site-navigation.TC-0qn rev=2 covers=g10.site-navigation.SC-b18,g10.site-navigation.SC-yjb,g10.site-navigation.SC-pih,g10.site-navigation.SC-1vk -->
### grade10-site-site-navigation-US7-TC3-2: Leaving the ask at the bidding history's address lands the brand home

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
* **Trace:** grade10-site-site-navigation-US-07

**Pre-conditions:**

* customer is signed out and reached <grade10 bidding history url> from
  outside the site.

**Steps:**

1. Dismiss the sign-in dialog.
2. Read the address bar.
3. Press the browser's Back.

**Expected Results:**

* <grade10 marketing url> renders.
* Step 2 shows the brand home's address, not the bidding history's.
* Step 3 leaves the site, never returning to the bidding history.

---

## grade10-site-site-navigation-US8: Collector opens a surface that asks nothing of them

**As a** collector with no session, or none yet answered,
**I want** a surface that is public, that invites me to sign in in its own
words, or that my link's own secret opens, to render as asked,
**so that** I am not stopped by a dialog in front of something I could already
read.

<!-- trace:case id=g10.site-navigation.TC-rnw rev=1 covers=g10.site-navigation.SC-clu,g10.site-navigation.SC-wnv,g10.site-navigation.SC-hxe -->
### grade10-site-site-navigation-US8-TC1-1: A collector's own visits opens and invites sign-in itself

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
* **Trace:** grade10-site-site-navigation-US-08

**Pre-conditions:**

* customer is signed out and is on <grade10 store url>.

**Steps:**

1. Navigate to <grade10 my visits url>.
2. Read the page.

**Expected Results:**

* That surface renders at <grade10 my visits url>.
* It invites the collector to sign in, in its own words.
* No sign-in dialog opens in front of it.

<!-- trace:case id=g10.site-navigation.TC-afw rev=1 covers=g10.site-navigation.SC-clu,g10.site-navigation.SC-wnv,g10.site-navigation.SC-hxe -->
### grade10-site-site-navigation-US8-TC2-1: A booking's private link opens for someone with no account

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
* **Trace:** grade10-site-site-navigation-US-08

**Pre-conditions:**

* customer holds <a booking's private link> and has no account on the site.

**Steps:**

1. Open <a booking's private link>.

**Expected Results:**

* The surface that link names renders.
* No sign-in dialog opens before it.

<!-- trace:case id=g10.site-navigation.TC-cts rev=1 covers=g10.site-navigation.SC-clu,g10.site-navigation.SC-wnv,g10.site-navigation.SC-hxe -->
### grade10-site-site-navigation-US8-TC3-1: A public surface renders before the session answers

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
* **Trace:** grade10-site-site-navigation-US-08

**Pre-conditions:**

* The session request is delayed so it has not yet answered.

**Steps:**

1. Navigate to <grade10 store url>.

**Expected Results:**

* The store renders without waiting for the session.

## Settled

Which locale the not-found surface's words render in is `shared/localization`'s
job, not this capability's — `shared-localization-SC-19` and
`shared-localization-SC-27` already guarantee a not-found surface renders in
the visiting locale for any unknown address, platform-wide.

## Reconciliation

**Run:** QA2, 2026-10-02, for change `retire-vault-collector-site`. QA1's blind pass read the Feature set, the journeys, `decisions.md` through Q15, the proposal and the durable suite; it was denied every requirement. QA2 read both suites, this delta, `tech-design.md`, `tasks.md` and the worker they name: `ROUTES.bids` and the navigation tests. It is a statement, not proof.

- **Raised** - none
- **Revised** - `grade10-site-site-navigation-US6-TC1-2`, `grade10-site-site-navigation-US6-TC2-2`, `grade10-site-site-navigation-US6-TC3-2`, `grade10-site-site-navigation-US7-TC1-2`, `grade10-site-site-navigation-US7-TC2-2`, `grade10-site-site-navigation-US7-TC3-2` ask at the bidding history in place of the vault (Q8); `<v>` moves, since the surface verified changed. Where the link to it sits is left to review
- **Contradicted** - none
- **Uncovered anchors** - none
