# grade10-site/site/page-shell Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## grade10-site-site-page-shell-US1: Collector opens any surface inside the site shell

**As a** collector,
**I want** every address the site answers to render its surface between the
header and the footer, at the width I browse at,
**so that** I get the site around whatever I opened, and never a surface that
shipped without it.

### grade10-site-site-page-shell-US1-TC1-1: Every address is wrapped in header, main and footer

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
* **Trace:** grade10-site-site-page-shell-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 marketing url>.
2. Check landmarks and chrome.
3. Navigate to <an address the site does not recognize> and check the same.

**Expected Results:**

* Header and footer are present, with the surface between them.
* The page carries exactly one banner, one main, and one contentinfo landmark, with the surface inside main.
* The shell adds no heading, copy, or spacing of its own to that surface's content.

### grade10-site-site-page-shell-US1-TC2-1: Narrow viewport reflows without clipping

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-01

**Pre-conditions:**
A viewport 375 CSS pixels wide.

**Steps:**

1. Set the viewport to 375 CSS pixels wide.
2. Navigate to <grade10 marketing url>.
3. Check scrolling and controls.

**Expected Results:**

* The page scrolls vertically only.
* No content is clipped and no control is unreachable.

---

## grade10-site-site-page-shell-US2: Collector sees the chrome before the session resolves

**As a** collector,
**I want** the header and the footer rendered before the session has resolved,
and unchanged once it does,
**so that** I can start navigating immediately without the chrome shifting
under me.

### grade10-site-site-page-shell-US2-TC1-1: Header and footer paint while the session resolves

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-02

**Pre-conditions:**
Network manipulation holds the session from resolving.

**Steps:**

1. Navigate to <grade10 marketing url>.
2. Check the chrome and the content region before the session resolves.

**Expected Results:**

* The header and the footer are already rendered.
* The content region shows that the surface is loading.

### grade10-site-site-page-shell-US2-TC2-1: Chrome does not shift when the session arrives

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-02

**Pre-conditions:**
A page rendered while the session was resolving.

**Steps:**

1. Navigate to <grade10 marketing url> with the session still resolving.
2. Wait until the session resolves.
3. Check the chrome controls.

**Expected Results:**

* No chrome control appears, disappears, or moves.

---

## grade10-site-site-page-shell-US3: Collector reaches their account from the header

**As a** collector,
**I want** an account control that leads to my profile when I am signed in and
to sign-in when I am not,
**so that** one control in the header always takes me where I can go, and
signing out has a single home.

### grade10-site-site-page-shell-US3-TC1-1: Signed-in account control opens the profile

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
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**
Signed in as a collector.

**Steps:**

1. Navigate to <grade10 marketing url>.
2. Activate the account control.

**Expected Results:**

* They arrive at their profile.

### grade10-site-site-page-shell-US3-TC2-1: Signed-out account control opens sign-in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**
The collector is not signed in.

**Steps:**

1. Navigate to <grade10 marketing url>.
2. Activate the account control.

**Expected Results:**

* They arrive at sign-in.

### grade10-site-site-page-shell-US3-TC3-1: Header offers no sign-out

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**
Signed in as a collector.

**Steps:**

1. Navigate to <grade10 marketing url> and check the header.
2. Navigate to <grade10 profile url>.

**Expected Results:**

* The header offers no way to sign out.
* A signed-in collector can sign out from their profile.

---

## grade10-site-site-page-shell-US4: Collector follows only links the site answers

**As a** collector,
**I want** the chrome to show a control or a link only when the site answers
its destination,
**so that** nothing in the header or the footer leads me to a not-found page.

### grade10-site-site-page-shell-US4-TC1-1: Header shows locale and account, not search or cart

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-04

**Pre-conditions:**
The site does not yet answer search or cart.

**Steps:**

1. Navigate to <grade10 marketing url>.
2. Check the header controls.

**Expected Results:**

* The header shows the locale label and the account control.
* No search or cart control appears.

### grade10-site-site-page-shell-US4-TC2-1: Navigation and footer link only to real surfaces

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-04

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 marketing url>.
2. Check every header navigation item destination.
3. Check every footer link destination.

**Expected Results:**

* Every navigation item leads to a surface the site answers.
* Every footer link leads to a surface the site answers, and a column left with no reachable link is absent entirely.

### grade10-site-site-page-shell-US4-TC3-1: Promo bar and utility row wait for their pages

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-04

**Pre-conditions:**
The site answers none of the utility destinations.

**Steps:**

1. Navigate to <grade10 marketing url>.
2. Check the header for the promotional bar and the utility row.

**Expected Results:**

* Neither the promotional bar nor the utility row appears.

---

## grade10-site-site-page-shell-US5: Collector locates the current surface in the navigation

**As a** collector,
**I want** the navigation item owning the address I am on to be marked, and
none marked when no item owns it,
**so that** I can tell where I am in the site without guessing.

### grade10-site-site-page-shell-US5-TC1-1: Listed surface marks its navigation item

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-05

**Pre-conditions:**
A collector is on a surface the navigation lists, or on any address beneath it.

**Steps:**

1. Navigate to <grade10 store url>.
2. Check the header navigation.

**Expected Results:**

* That navigation item is marked as the current page.

### grade10-site-site-page-shell-US5-TC2-1: Unlisted surface marks no navigation item

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-05

**Pre-conditions:**
A collector is on the profile, sign-in, or an unrecognized address.

**Steps:**

1. Navigate to <grade10 profile url> while signed in.
2. Check the header navigation.

**Expected Results:**

* No navigation item is marked as the current page.

## grade10-site-site-page-shell-US07: Collector opens Help from the header

**As a** collector,
**I want** Help in the primary nav to open the documentation site in a new tab
(after Store Locator when present, after Auction on auction-only),
**so that** I can read help without losing the page I was on, whether I am on
auction-only or full primary nav.

### grade10-site-site-page-shell-US07-TC1-1: Help on auction-only header opens docs in a new tab

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
* **Trace:** grade10-site-site-page-shell-US-07

**Pre-conditions:**

* customer is on <grade10 auction url> with auction-only primary nav and a wide
  viewport.
* Help is supplied in the primary nav after Auction; Store Locator is absent.

**Steps:**

1. Locate Help in the primary navigation after Auction.
2. Confirm Store Locator is not in the primary navigation.
3. Activate Help.
4. Check the new browsing context and the original page.

**Expected Results:**

* Help is present in the primary navigation after Auction.
* Store Locator is absent from the primary navigation.
* The documentation site opens in a new browsing context.
* The auction page remains open in the original context.

### grade10-site-site-page-shell-US07-TC2-1: Help on full primary nav opens docs in a new tab

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-07

**Pre-conditions:**

* customer is on <grade10 store url> whose primary nav lists Store and Auction,
  on a wide viewport.
* Help is supplied in the primary nav after Store Locator.

**Steps:**

1. Locate Help in the primary navigation after Store Locator.
2. Activate Help.
3. Check the new browsing context and the original page.

**Expected Results:**

* Help is present in the primary navigation after Store Locator alongside the
  full primary nav.
* The documentation site opens in a new browsing context.
* The store page remains open in the original context.

### grade10-site-site-page-shell-US07-TC3-1: Help in the compact menu opens docs in a new tab

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
* **Trace:** grade10-site-site-page-shell-US-07

**Pre-conditions:**

* customer is on <grade10 auction url> at a viewport 375 CSS pixels wide.
* Help is supplied among the primary nav items after Auction; Store Locator is
  absent.

**Steps:**

1. Open the header menu.
2. Locate Help among the primary items in the drawer after Auction.
3. Confirm Store Locator is not in the drawer.
4. Activate Help.
5. Check the new browsing context and the original page.

**Expected Results:**

* Help is reachable in the drawer after Auction.
* Store Locator is absent from the drawer.
* The documentation site opens in a new browsing context.
* The auction page remains open in the original context.

## Settled

* Help sits in the primary nav for auction-only and full nav (wide and
  compact): after Auction on auction-first, after Store Locator when that item
  is present.
* Auction-first primary nav omits Store Locator until the shop is open.
* Help opens the documentation site in a new tab.
* The durable host address stays open until Product confirms it.
