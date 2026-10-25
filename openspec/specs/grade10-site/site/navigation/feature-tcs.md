# grade10-site/site/navigation Test Cases

**Status:** pending-review · 0/11
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* On the Grade10 site, `<home>` is the brand's marketing page, `<store>` the store, and `<bidding history>` the collector's own bidding history, which asks for an account. A collector signed out reads as customer(signed out).

## g10.site-navigation.US1: Collector reaches the surface an address names

**As a** collector,
**I want** every address to resolve to one surface — the deepest one naming
it, or the not-found surface with a clear static message and a way home,
**so that** a link I open lands me on the surface that owns it, and when none
does I know I am still on the site and can leave for home.

<!-- trace:case id=g10.site-navigation.TC-07a rev=1 covers=g10.site-navigation.SC-70e,g10.site-navigation.SC-p5e,g10.site-navigation.SC-jo4 -->
### g10.site-navigation.US1-TC1: An address renders the deepest surface naming it

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
* **Trace:** grade10-site-site-navigation-US-01

**Pre-conditions:**

* The catalogue publishes a lot.

**Test data:**

| `<address>` | `<renders>` |
| --- | --- |
| beneath the store, naming no surface of its own | the store |
| the published lot's | the lot, not the auction above it |

**Steps:**

1. Open `<address>`.

**Expected Results:**

* `<renders>` renders.

<!-- trace:case id=g10.site-navigation.TC-68k rev=2 covers=g10.site-navigation.SC-70e,g10.site-navigation.SC-p5e,g10.site-navigation.SC-jo4,g10.site-navigation.SC-m4k -->
### g10.site-navigation.US1-TC3: An unknown address reaches the not-found surface, which leads home

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-navigation-US-01

**Pre-conditions:**

* A collector holds an address under no surface the site answers.

**Steps:**

1. Open it, and read the page.
2. Click Back to Home.

**Expected Results:**

* Step 1 renders the not-found surface, titled exactly Nothing is here, described exactly The link may be wrong, or the page may have moved., the address appearing nowhere on it.
* Step 2 renders `<home>`.

---

## g10.site-navigation.US2: Collector moves between surfaces without a page load

**As a** collector,
**I want** an in-app link, the chrome's included, to navigate in place while
my own click modifiers and other origins stay the browser's,
**so that** moving around the site is immediate without taking away the
browser behavior I asked for.

<!-- trace:case id=g10.site-navigation.TC-n38 rev=1 covers=g10.site-navigation.SC-jx8,g10.site-navigation.SC-4a8,g10.site-navigation.SC-xfo -->
### g10.site-navigation.US2-TC1: A chrome link navigates in place

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-navigation-US-02

**Pre-conditions:**

* A collector is on `<home>`.

**Steps:**

1. Click a header or footer link to another surface.

**Expected Results:**

* The destination renders without a full document load.

<!-- trace:case id=g10.site-navigation.TC-nt8 rev=1 covers=g10.site-navigation.SC-jx8,g10.site-navigation.SC-4a8,g10.site-navigation.SC-xfo -->
### g10.site-navigation.US2-TC2: A modified click and another origin stay the browser's

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-navigation-US-02

**Pre-conditions:**

* A collector is on a surface showing `<link>`.

**Test data:**

| `<link>` | `<clicked>` | `<browser does>` |
| --- | --- | --- |
| an in-app link | with a modifier that opens a new tab | its own behavior, unaltered |
| a link to another origin | plainly | a normal page load |

**Steps:**

1. Click it `<clicked>`.

**Expected Results:**

* The browser does `<browser does>`.

---

## g10.site-navigation.US4: Collector resumes a surface where they left it

**As a** collector,
**I want** back and forward to return me to the scroll position I left an
entry at, and a new entry to start at the top,
**so that** I keep my place in a surface I return to instead of finding it
from the beginning.

<!-- trace:case id=g10.site-navigation.TC-3dz rev=1 covers=g10.site-navigation.SC-a0s,g10.site-navigation.SC-5ju -->
### g10.site-navigation.US4-TC1: A new surface starts at the top, and back returns to where the collector left

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-navigation-US-04

**Pre-conditions:**

* A collector is on `<home>`, scrolled partway down.

**Steps:**

1. Follow a link to another surface.
2. Go back.

**Expected Results:**

* Step 1 renders the destination at its top.
* Step 2 returns `<home>` scrolled where it was left.

---

## g10.site-navigation.US5: Collector downloads only the surface they open

**As a** collector,
**I want** a surface to cost only its own page code, loaded when I navigate to
it,
**so that** opening one surface does not make me pay for the ones I did not
open.

<!-- trace:case id=g10.site-navigation.TC-kk4 rev=1 covers=g10.site-navigation.SC-8k5,g10.site-navigation.SC-36n -->
### g10.site-navigation.US5-TC1: A surface's page code loads on arrival, not before

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-navigation-US-05

**Pre-conditions:**

* A cold browser with an empty cache, its network log open.

**Steps:**

1. Open `<home>`, and read the scripts downloaded.
2. Navigate to the store, and read them again.

**Expected Results:**

* Step 1 downloads no script holding the store's or the auction's page code.
* Step 2 loads the store's page code, and the store renders.

---

## g10.site-navigation.US6: Collector follows a link to a surface that needs an account

**As a** collector without a session,
**I want** to be asked to sign in where I am standing rather than taken to the
surface first,
**so that** dismissing the ask leaves me reading what I was reading, and
signing in puts me on the surface I asked for.

<!-- trace:case id=g10.site-navigation.TC-8kz rev=2 covers=g10.site-navigation.SC-ceg,g10.site-navigation.SC-32w,g10.site-navigation.SC-jzp,g10.site-navigation.SC-rrx -->
### g10.site-navigation.US6-TC1: A link to a surface that needs an account asks in place, then lands it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-navigation-US-06

**Pre-conditions:**

* A signed-out collector is on `<store>`.

**Steps:**

1. Follow a link to `<bidding history>`, and read the address bar.
2. Sign in in the dialog.

**Expected Results:**

* Step 1 opens the sign-in dialog over the store, still rendered, the address still the store's.
* Step 2 closes it, and `<bidding history>` renders at its own address.

<!-- trace:case id=g10.site-navigation.TC-qei rev=2 covers=g10.site-navigation.SC-ceg,g10.site-navigation.SC-32w,g10.site-navigation.SC-jzp,g10.site-navigation.SC-rrx -->
### g10.site-navigation.US6-TC2: Dismissing the ask leaves the collector reading where they were, with no entry left behind

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-navigation-US-06

**Pre-conditions:**

* A signed-out collector came to `<store>` from `<home>`, and is scrolled partway down it.

**Steps:**

1. Follow a link to `<bidding history>`, and dismiss the dialog; read the address bar.
2. Press Back.

**Expected Results:**

* Step 1 leaves the store rendered, scrolled where it was, at the store's address; the bidding history does not render.
* Step 2 renders `<home>`, the bidding history's address never reached.

---

## g10.site-navigation.US7: Collector opens a surface that needs an account at its own address

**As a** collector arriving from a bookmark, a mailed link or the back button,
**I want** the address I asked for to stay the address I am at while I sign in,
**so that** what I came for is what renders the moment I have a session, and
leaving without one puts me somewhere I can read instead of on a blank page.

<!-- trace:case id=g10.site-navigation.TC-gpo rev=2 covers=g10.site-navigation.SC-b18,g10.site-navigation.SC-yjb,g10.site-navigation.SC-pih,g10.site-navigation.SC-1vk -->
### g10.site-navigation.US7-TC1: A surface that needs an account asks at its own address, and renders there

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-navigation-US-07

**Pre-conditions:**

* A collector `<arrives>`.

**Test data:**

| `<arrives>` |
| --- |
| signed out, opening `<bidding history>` directly |
| signed in on `<bidding history>`, then on `<store>` signed out, pressing Back |

**Steps:**

1. Read the page and the address bar.
2. Sign in in the dialog.

**Expected Results:**

* Step 1 opens the sign-in dialog, the surface showing nothing of its own, the address still `<bidding history>`.
* Step 2 renders the bidding history at that same address, with no navigation between.

<!-- trace:case id=g10.site-navigation.TC-0qn rev=2 covers=g10.site-navigation.SC-b18,g10.site-navigation.SC-yjb,g10.site-navigation.SC-pih,g10.site-navigation.SC-1vk -->
### g10.site-navigation.US7-TC3: Leaving the ask at the surface's own address lands the brand home

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-navigation-US-07

**Pre-conditions:**

* A signed-out collector reached `<bidding history>` from outside the site.

**Steps:**

1. Dismiss the dialog, and read the address bar.
2. Press Back.

**Expected Results:**

* Step 1 renders `<home>` at its own address.
* Step 2 leaves the site, never returning to the bidding history.

---

## g10.site-navigation.US8: Collector opens a surface that asks nothing of them

**As a** collector with no session, or none yet answered,
**I want** a surface that is public, that invites me to sign in in its own
words, or that my link's own secret opens, to render as asked,
**so that** I am not stopped by a dialog in front of something I could already
read.

<!-- trace:case id=g10.site-navigation.TC-rnw rev=1 covers=g10.site-navigation.SC-clu,g10.site-navigation.SC-wnv,g10.site-navigation.SC-hxe -->
### g10.site-navigation.US8-TC1: A surface that asks nothing renders as asked, with no sign-in in front

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-navigation-US-08

**Pre-conditions:**

* `<collector>`.

**Test data:**

| `<collector>` | `<opens>` | `<renders>` |
| --- | --- | --- |
| a signed-out collector on `<store>` | their own visits | at its own address, inviting sign-in in its own words |
| a holder of a booking's private link, with no account | the link | the surface it names |
| any collector, the session not yet answered | `<store>` | without waiting for the session |

**Steps:**

1. Open `<opens>`.

**Expected Results:**

* It renders `<renders>`, and no sign-in dialog opens before it.

## Settled

- Which locale the not-found surface's words render in is `shared/localization`'s job, not this capability's — `shared-localization-SC-19` and `shared-localization-SC-27` already guarantee a not-found surface renders in the visiting locale for any unknown address, platform-wide.
