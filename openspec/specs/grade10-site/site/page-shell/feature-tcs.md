# grade10-site/site/page-shell Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-21, tcs-rules r3.0

## grade10-site-site-page-shell-US1: Collector opens any surface inside the site shell

**As a** collector,
**I want** every address the site answers to render its surface between the
header and the footer, at the width I browse at,
**so that** I get the site around whatever I opened, and never a surface that
shipped without it.

<!-- trace:case id=g10.site-page-shell.TC-5ah rev=1 covers=g10.site-page-shell.SC-tme,g10.site-page-shell.SC-qm2,g10.site-page-shell.SC-kxh,g10.site-page-shell.SC-o0j,g10.site-page-shell.SC-oq6 -->
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

<!-- trace:case id=g10.site-page-shell.TC-ban rev=1 covers=g10.site-page-shell.SC-tme,g10.site-page-shell.SC-qm2,g10.site-page-shell.SC-kxh,g10.site-page-shell.SC-o0j,g10.site-page-shell.SC-oq6 -->
### grade10-site-site-page-shell-US1-TC2-1: Narrow viewport reflows without clipping

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
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

<!-- trace:case id=g10.site-page-shell.TC-cnk rev=1 covers=g10.site-page-shell.SC-tme,g10.site-page-shell.SC-qm2,g10.site-page-shell.SC-kxh,g10.site-page-shell.SC-o0j,g10.site-page-shell.SC-oq6 -->
### grade10-site-site-page-shell-US1-TC3-1: A compact surface keeps its shell and navigation reachable

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-01

**Pre-conditions:**

* The site answers <surface address> at a viewport 375 CSS pixels wide.

**Test data:**

| Field | Value |
| --- | --- |
| `<surface address>` | An address the site answers |

**Steps:**

1. Set the viewport to 375 CSS pixels wide.
2. Navigate to <surface address>.
3. Open the header menu.
4. Inspect the shell and the controls in the bar and drawer.

**Expected Results:**

* The surface renders between the header and footer.
* Primary navigation and language are reachable from the drawer.
* Account / Sign In remains in the bar, and the menu panel leaves a visible gutter.
* No surface content or control is clipped.

---

## grade10-site-site-page-shell-US2: Collector sees the chrome before the session resolves

**As a** collector,
**I want** the header and the footer rendered before the session has resolved,
with only the account entry and the cart count updating once it does,
**so that** I can start navigating immediately without unrelated chrome
shifting under me.

<!-- trace:case id=g10.site-page-shell.TC-jc9 rev=1 covers=g10.site-page-shell.SC-9ud,g10.site-page-shell.SC-yxt -->
### grade10-site-site-page-shell-US2-TC1-1: Header and footer render while the session resolves

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-02

**Pre-conditions:**

* The session read is held before it resolves.

**Steps:**

1. Open an address the site answers.
2. Inspect the page before the session resolves.

**Expected Results:**

* The header and footer are rendered.
* The surface remains in the content region while it loads.

<!-- trace:case id=g10.site-page-shell.TC-ev5 rev=2 covers=g10.site-page-shell.SC-9ud,g10.site-page-shell.SC-yxt -->
### grade10-site-site-page-shell-US2-TC2-2: The session changes only the account entry and cart count

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-02

**Pre-conditions:**

* A page rendered while the session was resolving.
* The header offers Cart.

**Test data:**

| `<session>` | `<cart count badge>` |
| --- | --- |
| Signed out | none |
| Signed in, no active lines | none |
| Signed in, 2 active lines | 2, once the cart review completes |

**Steps:**

1. Let the session resolve as <session>.
2. Inspect the account entry, the Cart control and the rest of the chrome.

**Expected Results:**

* The account entry matches <session>.
* The Cart control shows <cart count badge> and keeps its place.
* No other chrome control appears, disappears, or moves.

---

## grade10-site-site-page-shell-US3: Collector reaches account destinations from the header

**As a** collector,
**I want** Sign In when I am signed out, and when I am signed in an account
menu that shows my sign-in email with its small initial avatar above My
Auctions and Sign Out on auction launch, and My Orders, My Auctions,
Membership, and Sign Out once Store answers, with Cart in the bar only once
Store answers,
**so that** one place in the header takes me where I can go for this launch,
without a second auction-orders link.

<!-- trace:case id=g10.site-page-shell.TC-eek rev=1 covers=g10.site-page-shell.SC-m3w,g10.site-page-shell.SC-0ao,g10.site-page-shell.SC-e9z,g10.site-page-shell.SC-y2l,g10.site-page-shell.SC-04a,g10.site-page-shell.SC-u71,g10.site-page-shell.SC-agf,g10.site-page-shell.SC-n9c,g10.site-page-shell.SC-3y1,g10.site-page-shell.SC-qby,g10.site-page-shell.SC-q9i,g10.site-page-shell.SC-m6b,g10.site-page-shell.SC-x1n -->
### grade10-site-site-page-shell-US3-TC1-1: A signed-out collector gets Sign In

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* A collector is signed out on an answered site surface.

**Steps:**

1. Inspect the account entry in the header.
2. Activate Sign In.

**Expected Results:**

* The account entry is a primary Sign In button, not an account icon.
* Sign-in starts.

<!-- trace:case id=g10.site-page-shell.TC-bs9 rev=1 covers=g10.site-page-shell.SC-m3w,g10.site-page-shell.SC-0ao,g10.site-page-shell.SC-e9z,g10.site-page-shell.SC-y2l,g10.site-page-shell.SC-04a,g10.site-page-shell.SC-u71,g10.site-page-shell.SC-agf,g10.site-page-shell.SC-n9c,g10.site-page-shell.SC-3y1,g10.site-page-shell.SC-qby,g10.site-page-shell.SC-q9i,g10.site-page-shell.SC-m6b,g10.site-page-shell.SC-x1n -->
### grade10-site-site-page-shell-US3-TC2-1: A signed-in collector reaches the account menu

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* A collector is signed in on an answered site surface, and Store answers.

**Steps:**

1. Activate the account control.
2. Inspect the menu.

**Expected Results:**

* The menu offers, in order, Profile, My Orders, My Auctions, and Sign out.
* The menu does not offer KYC.

<!-- trace:case id=g10.site-page-shell.TC-obx rev=1 covers=g10.site-page-shell.SC-m3w,g10.site-page-shell.SC-0ao,g10.site-page-shell.SC-e9z,g10.site-page-shell.SC-y2l,g10.site-page-shell.SC-04a,g10.site-page-shell.SC-u71,g10.site-page-shell.SC-agf,g10.site-page-shell.SC-n9c,g10.site-page-shell.SC-3y1,g10.site-page-shell.SC-qby,g10.site-page-shell.SC-q9i,g10.site-page-shell.SC-m6b,g10.site-page-shell.SC-x1n -->
### grade10-site-site-page-shell-US3-TC3-1: Sign out remains available from the account path

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
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* A signed-in collector has opened the account menu.

**Steps:**

1. Inspect the account menu.
2. Activate Sign out.
3. Inspect the signed-in profile surface.

**Expected Results:**

* The account menu offers Sign out.
* Sign-out starts.
* The profile also offers Sign out while the collector is signed in.

<!-- trace:case id=g10.site-page-shell.TC-asx rev=1 covers=g10.site-page-shell.SC-m3w,g10.site-page-shell.SC-0ao,g10.site-page-shell.SC-e9z,g10.site-page-shell.SC-y2l,g10.site-page-shell.SC-04a,g10.site-page-shell.SC-u71,g10.site-page-shell.SC-agf,g10.site-page-shell.SC-n9c,g10.site-page-shell.SC-3y1,g10.site-page-shell.SC-qby,g10.site-page-shell.SC-q9i,g10.site-page-shell.SC-m6b,g10.site-page-shell.SC-x1n -->
### grade10-site-site-page-shell-US3-TC4-1: Activating My Orders opens the collector's orders

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* A collector is signed in on an answered site surface, and Store answers.

**Steps:**

1. Activate the account control.
2. Activate My Orders.

**Expected Results:**

* The collector is taken to `/profile/orders`.

<!-- trace:case id=g10.site-page-shell.TC-5jl rev=1 covers=g10.site-page-shell.SC-m3w,g10.site-page-shell.SC-0ao,g10.site-page-shell.SC-e9z,g10.site-page-shell.SC-y2l,g10.site-page-shell.SC-04a,g10.site-page-shell.SC-u71,g10.site-page-shell.SC-agf,g10.site-page-shell.SC-n9c,g10.site-page-shell.SC-3y1,g10.site-page-shell.SC-qby,g10.site-page-shell.SC-q9i,g10.site-page-shell.SC-m6b,g10.site-page-shell.SC-x1n -->
### grade10-site-site-page-shell-US3-TC5-1: Account menu omits My Orders before Store answers

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* A collector is signed in, and Store does not yet answer.

**Steps:**

1. Activate the account control.
2. Inspect the menu.

**Expected Results:**

* The menu offers Profile, My Auctions, and Sign out.
* The menu does not offer My Orders.

<!-- trace:case id=g10.site-page-shell.TC-1su rev=1 covers=g10.site-page-shell.SC-m3w,g10.site-page-shell.SC-0ao,g10.site-page-shell.SC-e9z,g10.site-page-shell.SC-y2l,g10.site-page-shell.SC-04a,g10.site-page-shell.SC-u71,g10.site-page-shell.SC-agf,g10.site-page-shell.SC-n9c,g10.site-page-shell.SC-3y1,g10.site-page-shell.SC-qby,g10.site-page-shell.SC-q9i,g10.site-page-shell.SC-m6b,g10.site-page-shell.SC-x1n -->
### grade10-site-site-page-shell-US3-TC6-1: Auction-launch account menu shows email, avatar, and reduced items

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in, profile not carried, on an auction-launch surface, Store not yet answered) is on the site.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | The signed-in collector's email address |

**Steps:**

1. Open the account menu from the header.

**Expected Results:**

* The menu label shows `<collector email>` with a small (xs) initial avatar above the items.
* The menu lists only My Auctions and Sign Out, in that order.
* The menu does not include Profile, My Orders, Membership, or Cart.

<!-- trace:case id=g10.site-page-shell.TC-wll rev=1 covers=g10.site-page-shell.SC-m3w,g10.site-page-shell.SC-0ao,g10.site-page-shell.SC-e9z,g10.site-page-shell.SC-y2l,g10.site-page-shell.SC-04a,g10.site-page-shell.SC-u71,g10.site-page-shell.SC-agf,g10.site-page-shell.SC-n9c,g10.site-page-shell.SC-3y1,g10.site-page-shell.SC-qby,g10.site-page-shell.SC-q9i,g10.site-page-shell.SC-m6b,g10.site-page-shell.SC-x1n -->
### grade10-site-site-page-shell-US3-TC7-1: Store-launch account menu adds My Orders and Membership ahead of Sign Out

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in, profile not carried, on a surface once Store answers) is on the site.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | The signed-in collector's email address |

**Steps:**

1. Open the account menu from the header.

**Expected Results:**

* The menu label shows `<collector email>` with its small (xs) initial avatar above the items.
* The menu lists My Orders, My Auctions, Membership, then Sign Out, in that order.
* Cart is present in the header bar and the menu does not include Profile.

<!-- trace:case id=g10.site-page-shell.TC-7s9 rev=1 covers=g10.site-page-shell.SC-m3w,g10.site-page-shell.SC-0ao,g10.site-page-shell.SC-e9z,g10.site-page-shell.SC-y2l,g10.site-page-shell.SC-04a,g10.site-page-shell.SC-u71,g10.site-page-shell.SC-agf,g10.site-page-shell.SC-n9c,g10.site-page-shell.SC-3y1,g10.site-page-shell.SC-qby,g10.site-page-shell.SC-q9i,g10.site-page-shell.SC-m6b,g10.site-page-shell.SC-x1n -->
### grade10-site-site-page-shell-US3-TC8-1: Sign Out item reads in Title Case

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in) is on the site with the account menu open.

**Steps:**

1. Read the label of the last item in the account menu.

**Expected Results:**

* The item reads "Sign Out" in Title Case, not "Sign out" or "SIGN OUT".

<!-- trace:case id=g10.site-page-shell.TC-atw rev=1 covers=g10.site-page-shell.SC-m3w,g10.site-page-shell.SC-0ao,g10.site-page-shell.SC-e9z,g10.site-page-shell.SC-y2l,g10.site-page-shell.SC-04a,g10.site-page-shell.SC-u71,g10.site-page-shell.SC-agf,g10.site-page-shell.SC-n9c,g10.site-page-shell.SC-3y1,g10.site-page-shell.SC-qby,g10.site-page-shell.SC-q9i,g10.site-page-shell.SC-m6b,g10.site-page-shell.SC-x1n -->
### grade10-site-site-page-shell-US3-TC9-1: Account menu label falls back when no sign-in email is supplied

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in, no sign-in email available to the header) is on the site.

**Steps:**

1. Open the account menu from the header.

**Expected Results:**

* The menu label shows the configured account-menu fallback label instead of an email, still above My Auctions and Sign Out.

<!-- trace:case id=g10.site-page-shell.TC-xbu rev=1 covers=g10.site-page-shell.SC-m3w,g10.site-page-shell.SC-0ao,g10.site-page-shell.SC-e9z,g10.site-page-shell.SC-y2l,g10.site-page-shell.SC-04a,g10.site-page-shell.SC-u71,g10.site-page-shell.SC-agf,g10.site-page-shell.SC-n9c,g10.site-page-shell.SC-3y1,g10.site-page-shell.SC-qby,g10.site-page-shell.SC-q9i,g10.site-page-shell.SC-m6b,g10.site-page-shell.SC-x1n -->
### grade10-site-site-page-shell-US3-TC10-1: Activating Membership invokes its handler without opening a withheld route

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
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in, on a surface once Store answers, Membership handler and copy supplied) is on the site.

**Steps:**

1. Open the account menu.
2. Activate Membership.

**Expected Results:**

* The supplied Membership handler is invoked.
* The browser does not navigate to `/membership`, `/join`, or any other membership address.

<!-- trace:case id=g10.site-page-shell.TC-fa4 rev=1 covers=g10.site-page-shell.SC-m3w,g10.site-page-shell.SC-0ao,g10.site-page-shell.SC-e9z,g10.site-page-shell.SC-y2l,g10.site-page-shell.SC-04a,g10.site-page-shell.SC-u71,g10.site-page-shell.SC-agf,g10.site-page-shell.SC-n9c,g10.site-page-shell.SC-3y1,g10.site-page-shell.SC-qby,g10.site-page-shell.SC-q9i,g10.site-page-shell.SC-m6b,g10.site-page-shell.SC-x1n -->
### grade10-site-site-page-shell-US3-TC11-1: Profile joins first, ahead of My Orders and Membership, once carried

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
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in, profile carried, on a surface once Store answers) is on the site.

**Steps:**

1. Open the account menu from the header.

**Expected Results:**

* The menu lists, in order, Profile, My Orders, My Auctions, Membership, then Sign Out.

---

## grade10-site-site-page-shell-US4: Collector follows only links the site answers

**As a** collector,
**I want** the chrome to show a control or a link only when the site answers
its destination, with language options rather than currencies,
**so that** nothing in the header or the footer leads me to a not-found page or
implies a currency I cannot switch.

<!-- trace:case id=g10.site-page-shell.TC-8rx rev=1 covers=g10.site-page-shell.SC-ovr,g10.site-page-shell.SC-ql0,g10.site-page-shell.SC-ond,g10.site-page-shell.SC-7p3,g10.site-page-shell.SC-fmx,g10.site-page-shell.SC-cex -->
### grade10-site-site-page-shell-US4-TC1-1: Auction-first chrome omits unanswered destinations

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-04

**Pre-conditions:**

* The Store cart drawer, Store, and Store Locator are not answered by the site.

**Steps:**

1. Render the header at a wide viewport.
2. Open the compact menu.
3. Inspect the available controls and language options.

**Expected Results:**

* Store, Store Locator, search, and Cart are absent.
* Language is reachable in the wide bar and from the compact menu.
* The locale options are languages, not currencies.

<!-- trace:case id=g10.site-page-shell.TC-ytf rev=1 covers=g10.site-page-shell.SC-ovr,g10.site-page-shell.SC-ql0,g10.site-page-shell.SC-ond,g10.site-page-shell.SC-7p3,g10.site-page-shell.SC-fmx,g10.site-page-shell.SC-cex -->
### grade10-site-site-page-shell-US4-TC2-1: Navigation and footer link only to real surfaces

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

<!-- trace:case id=g10.site-page-shell.TC-azw rev=1 covers=g10.site-page-shell.SC-ovr,g10.site-page-shell.SC-ql0,g10.site-page-shell.SC-ond,g10.site-page-shell.SC-7p3,g10.site-page-shell.SC-fmx,g10.site-page-shell.SC-cex -->
### grade10-site-site-page-shell-US4-TC3-1: Promo bar and utility row wait for their pages

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
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

<!-- trace:case id=g10.site-page-shell.TC-08v rev=1 covers=g10.site-page-shell.SC-ovr,g10.site-page-shell.SC-ql0,g10.site-page-shell.SC-ond,g10.site-page-shell.SC-7p3,g10.site-page-shell.SC-fmx,g10.site-page-shell.SC-cex -->
### grade10-site-site-page-shell-US4-TC4-1: Cart becomes global when Store answers

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-04

**Pre-conditions:**

* The site answers the Store cart drawer and the collector is on an Auction surface.

**Steps:**

1. Render the header.
2. Inspect the available controls.

**Expected Results:**

* Cart appears on the Auction surface.
* Search remains absent when the site does not answer a search surface.

---

## grade10-site-site-page-shell-US5: Collector locates the current surface in the navigation

**As a** collector,
**I want** the navigation item owning the address I am on to be marked, and
none marked when no item owns it,
**so that** I can tell where I am in the site without guessing.

<!-- trace:case id=g10.site-page-shell.TC-19q rev=1 covers=g10.site-page-shell.SC-q3w,g10.site-page-shell.SC-xiu -->
### grade10-site-site-page-shell-US5-TC1-1: Listed surface marks its navigation item

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
* **Trace:** grade10-site-site-page-shell-US-05

**Pre-conditions:**
A collector is on a surface the navigation lists, or on any address beneath it.

**Steps:**

1. Navigate to <grade10 store url>.
2. Check the header navigation.

**Expected Results:**

* That navigation item is marked as the current page.

<!-- trace:case id=g10.site-page-shell.TC-pm3 rev=1 covers=g10.site-page-shell.SC-q3w,g10.site-page-shell.SC-xiu -->
### grade10-site-site-page-shell-US5-TC2-1: Unlisted surface marks no navigation item

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
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

---

## grade10-site-site-page-shell-US06: Collector opens their cart from the header

**As a** collector,
**I want** the Cart control to take me to my own cart, signing me in first when
I am not,
**so that** the cart I open is the one holding what I picked, rather than an
empty room, from any surface once Store answers the cart drawer.

<!-- trace:case id=g10.site-page-shell.TC-6el rev=1 covers=g10.site-page-shell.SC-g63,g10.site-page-shell.SC-ew2,g10.site-page-shell.SC-d19,g10.site-page-shell.SC-tj7 -->
### grade10-site-site-page-shell-US06-TC1-1: A signed-out collector presses Cart

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
* **Trace:** grade10-site-site-page-shell-US-06

**Pre-conditions:**

* customer is signed out and is on a supported site surface whose header offers Cart.

**Steps:**

1. Activate the Cart control in the header.
2. Check the dialog and the cart drawer.

**Expected Results:**

* The sign-in dialog opens over the surface.
* The cart drawer does not open.

<!-- trace:case id=g10.site-page-shell.TC-kv0 rev=1 covers=g10.site-page-shell.SC-g63,g10.site-page-shell.SC-ew2,g10.site-page-shell.SC-d19,g10.site-page-shell.SC-tj7 -->
### grade10-site-site-page-shell-US06-TC2-1: Sign-in opens the cart they asked for

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
* **Trace:** grade10-site-site-page-shell-US-06

**Pre-conditions:**

* customer is signed out and is on a supported site surface whose header offers Cart.
* Sign-in was opened from the Cart control in the header.
* Sign-in can complete without leaving the surface.

**Steps:**

1. Complete sign-in successfully while remaining on the surface.
2. Check the sign-in dialog and the cart drawer.

**Expected Results:**

* The sign-in dialog is closed.
* The cart drawer is open.

<!-- trace:case id=g10.site-page-shell.TC-wbo rev=1 covers=g10.site-page-shell.SC-g63,g10.site-page-shell.SC-ew2,g10.site-page-shell.SC-d19,g10.site-page-shell.SC-tj7 -->
### grade10-site-site-page-shell-US06-TC3-1: Dismissing sign-in opens nothing

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
* **Trace:** grade10-site-site-page-shell-US-06

**Pre-conditions:**

* customer is signed out and is on a supported site surface whose header offers Cart.
* Sign-in was opened from the Cart control in the header.

**Steps:**

1. Dismiss the sign-in dialog without signing in.
2. Check the session and the cart drawer.
3. Wait <wait_1> and check the cart drawer again.

**Test data:**

| Field | Value |
| --- | --- |
| <wait_1> | 5 seconds |

**Expected Results:**

* The customer remains signed out on that surface.
* No cart drawer is open, and none opens later.

<!-- trace:case id=g10.site-page-shell.TC-b8i rev=1 covers=g10.site-page-shell.SC-g63,g10.site-page-shell.SC-ew2,g10.site-page-shell.SC-d19,g10.site-page-shell.SC-tj7 -->
### grade10-site-site-page-shell-US06-TC4-1: A member presses Cart

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
* **Trace:** grade10-site-site-page-shell-US-06

**Pre-conditions:**

* customer is signed in and is on a supported site surface whose header offers Cart.

**Steps:**

1. Activate the Cart control in the header.
2. Check the cart drawer and the dialog.

**Expected Results:**

* The cart drawer opens.
* No sign-in dialog opens.

---

## grade10-site-site-page-shell-US07: Collector opens Help from the header

**As a** collector,
**I want** Help in the primary nav to open the documentation site in a new tab
(after Store Locator when present, after Auction on auction-only),
**so that** I can read help without losing the page I was on, whether I am on
auction-only or full primary nav.

<!-- trace:case id=g10.site-page-shell.TC-ho3 rev=1 covers=g10.site-page-shell.SC-o1e,g10.site-page-shell.SC-53q -->
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

<!-- trace:case id=g10.site-page-shell.TC-wno rev=1 covers=g10.site-page-shell.SC-o1e,g10.site-page-shell.SC-53q -->
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

<!-- trace:case id=g10.site-page-shell.TC-mgo rev=1 covers=g10.site-page-shell.SC-o1e,g10.site-page-shell.SC-53q -->
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

---

## grade10-site-site-page-shell-US8: Collector sees the cart count without opening the drawer

**As a** signed-in collector,
**I want** the header to show the same active-line count as my cart drawer as my cart changes,
**so that** I can see how many active lines I hold from any surface without opening the drawer.

<!-- trace:case id=g10.site-page-shell.TC-19a rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC1-1: Reviewed active lines match the drawer title count

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in.
* The member cart contains the reviewed lines in Test data.
* Run each row at 375px and 1200px.
* The cart drawer is closed.

**Test data:**

| Reviewed active lines | Expected count |
| --- | --- |
| 1 | 1 |
| 3 | 3 |
| 12 | 12 |
| 50 | 50 |

**Steps:**

1. Navigate to <grade10 store url>.
2. Observe the header after the cart review completes.
3. Click the Cart control.

**Expected Results:**

* Header shows the full active-line count before opening.
* Header count uses the round brand indicator.
* Cart control stays reachable, with no horizontal scroll.
* Drawer title count equals the header count.

<!-- trace:case id=g10.site-page-shell.TC-yv8 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC2-1: Quantity and checkout eligibility do not replace active lines

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in.
* The member cart holds an available line of quantity 3.
* It holds a line of quantity 2 whose price or quantity the review adjusted, awaiting checkout acknowledgement.
* It holds one sold-out line and one unavailable line.
* The cart drawer is closed.

**Steps:**

1. Navigate to <grade10 store url>.
2. Observe the header after the cart review completes.
3. Click the Cart control.

**Expected Results:**

* Header shows 2.
* Drawer title shows 2.

<!-- trace:case id=g10.site-page-shell.TC-mz6 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC3-1: Cart count follows navigation to Auction

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in.
* The reviewed cart has active lines.
* The cart drawer is closed.

**Steps:**

1. Navigate to <grade10 store url>.
2. Observe the header count.
3. Click Auction in the primary navigation.
4. Observe the header count.

**Expected Results:**

* The Auction header shows the Store count on arrival.
* No cart review runs on arrival.
* The drawer remains closed.

<!-- trace:case id=g10.site-page-shell.TC-mv8 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC4-1: Adding a line refreshes the closed drawer count

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in on <grade10 store product url>.
* The reviewed cart is empty.
* The cart drawer is closed.
* The displayed product can be added to the cart.

**Steps:**

1. Click the product add-to-cart control.
2. Wait for the mutation and cart review to finish.
3. Observe the header count.

**Expected Results:**

* Header shows 1 active line.
* The count updates without opening the drawer.

<!-- trace:case id=g10.site-page-shell.TC-wf5 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC5-1: Quantity changes preserve the distinct active-line count

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in on <grade10 store url>.
* The reviewed cart has one active line, of quantity 1.
* That line's product tile is on the listing and permits multiple quantities.
* The cart drawer is closed.

**Steps:**

1. Raise the quantity on that product tile's stepper to 2.
2. Wait for the mutation and cart review to finish.
3. Observe the header count.
4. Click the Cart control.

**Expected Results:**

* Header still shows 1 active line.
* Drawer title count equals the header count.

<!-- trace:case id=g10.site-page-shell.TC-id6 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC6-1: A cart change made elsewhere shows after the next review

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in on <grade10 store url>.
* Header shows 2 reviewed active lines.
* The cart drawer is closed.
* <change made elsewhere> has happened since that review.

**Test data:**

| `<change made elsewhere>` | `<reviewed count>` |
| --- | --- |
| One active line became unavailable | 1 |
| The same member added a distinct line from another device | 3 |

**Steps:**

1. Observe the header count.
2. Click the Cart control.
3. Wait for the cart review to finish.
4. Observe the header count and the drawer title.

**Expected Results:**

* Before the review, the header still shows 2.
* After the review, the header shows <reviewed count>.
* Drawer title count equals the header count.

<!-- trace:case id=g10.site-page-shell.TC-xq5 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC7-1: An empty reviewed cart retains an unbadged control

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in.
* The reviewed cart holds <cart without active lines>.

**Test data:**

| `<cart without active lines>` |
| --- |
| No lines |
| Only a sold-out line and an unavailable line |

**Steps:**

1. Navigate to <grade10 store url>.
2. Observe the Cart control.

**Expected Results:**

* Cart remains visible without a count badge.

<!-- trace:case id=g10.site-page-shell.TC-70a rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC8-1: Initial unknown count appears only after successful review

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in.
* Initial cart review is held pending.
* The member cart contains active lines.

**Steps:**

1. Navigate to <grade10 store url>.
2. Observe the Cart control while review is pending.
3. Allow the cart review to complete.
4. Observe the Cart control.

**Expected Results:**

* Pending review shows no badge or badge skeleton.
* Cart remains visible in the same place throughout.
* Successful review displays the active-line count.

<!-- trace:case id=g10.site-page-shell.TC-fj9 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC9-1: Failed cart review clears the previously known count

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in on <grade10 store url>.
* Header shows a previously reviewed positive count.
* The cart drawer is closed.
* The next cart review cannot complete.

**Steps:**

1. Click the Cart control.
2. Wait for the cart review to fail.
3. Observe the header Cart control.

**Expected Results:**

* The previous count badge is absent.
* Cart remains visible.

<!-- trace:case id=g10.site-page-shell.TC-vv4 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC10-1: Retry restores the count after a failed review

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in on <grade10 store url> with the cart drawer open.
* Cart review failed and the header shows no count badge.
* The next cart review can complete with active lines.

**Steps:**

1. Click Retry on the review failure notice.
2. Wait for the cart review to finish.
3. Observe the header Cart control.

**Expected Results:**

* Header shows the newly reviewed active-line count.

<!-- trace:case id=g10.site-page-shell.TC-ux8 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC11-1: Visitors without a member session never display a cart count

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer's session is <session>.

**Test data:**

| `<session>` |
| --- |
| Signed out |
| Unresolved, with the session read held |

**Steps:**

1. Navigate to <grade10 store url>.
2. Observe the Cart control.

**Expected Results:**

* Cart remains visible without a count badge.

<!-- trace:case id=g10.site-page-shell.TC-szw rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC12-1: Signing out clears the count before another review

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in on <grade10 store url>.
* Header shows a positive member cart count.
* The member's next cart review will be held pending.

**Steps:**

1. Click the Cart control, then close the drawer while its review is held.
2. Click Sign Out in the account menu.
3. Observe the Cart control when the session changes.
4. Release the held cart review.
5. Observe the Cart control.

**Expected Results:**

* The previous member count disappears immediately.
* The released review does not restore a count badge.
* Cart remains visible without a count badge.

<!-- trace:case id=g10.site-page-shell.TC-rbe rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC13-1: Changing members cannot display the previous member count

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer A has a reviewed cart count of 2.
* customer B's cart has 1 active line.
* customer A's next cart review and customer B's first review will be held pending.

**Test data:**

| `<customer A review released>` |
| --- |
| Before customer B's review completes |
| After customer B's review completes |

**Steps:**

1. Navigate to <grade10 store url> as customer A, and wait for the header to show 2.
2. Click the Cart control, then close the drawer while its review is held.
3. Sign out, then sign in as customer B.
4. Observe the Cart control.
5. Release customer A's review and customer B's review in <customer A review released> order.
6. Observe the Cart control after each release.

**Expected Results:**

* The count 2 disappears immediately after the session changes.
* No count badge shows until customer B's review completes.
* Customer B's completed review shows 1.
* Customer A's released review never shows 2.

<!-- trace:case id=g10.site-page-shell.TC-yag rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC14-1: Removing the last active line clears the badge

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in on <grade10 store url>.
* The reviewed cart has one active line, of quantity 1.
* That line's product tile is on the listing.
* The cart drawer is closed.

**Steps:**

1. Lower the quantity on that product tile's stepper to 0.
2. Wait for the mutation and cart review to finish.
3. Observe the Cart control.

**Expected Results:**

* Cart remains visible without a count badge.

<!-- trace:case id=g10.site-page-shell.TC-4mi rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC15-1: Same-member refresh retains the last verified count

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in on <grade10 store url> with a verified header count of 2.
* The cart drawer is closed.
* The next cart review is held pending.

**Test data:**

| `<cart update>` | `<reviewed count>` |
| --- | --- |
| Lowering one line's tile stepper to 0, which succeeds | 1 |
| Raising one line's tile stepper, which the server refuses and rolls back | 2 |

**Steps:**

1. Make <cart update> and wait for it to settle.
2. Observe the header while the review is pending.
3. Release the review and observe the header.
4. Make another cart update, fail its review, and observe the header.

**Expected Results:**

* Pending review retains 2 without a skeleton.
* Successful review shows <reviewed count>.
* Failed review hides the badge while keeping Cart available.

<!-- trace:case id=g10.site-page-shell.TC-mnz rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC16-1: A build without Store shows neither Cart nor a count

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* customer is signed in with a known positive active-line count.
* The build is one where Store does not answer.

**Steps:**

1. Navigate to <grade10 auction url>.
2. Observe the header.

**Expected Results:**

* The header shows no Cart control.
* The header shows no count badge.

## Settled

* Help sits in the primary nav for auction-only and full nav (wide and
  compact): after Auction on auction-first, after Store Locator when that item
  is present.
* Auction-first primary nav omits Store Locator until the shop is open.
* Help opens the documentation site in a new tab.
* The durable host address stays open until Product confirms it.
* Signed-in account entry opens a menu, the sign-in email with its small
  initial avatar above the items, offering My Auctions and Sign Out on
  auction launch, plus Profile once carried, My Orders and Membership once
  Store answers — not the profile directly; the header offers Sign Out from
  that menu as well as the profile wherever it is carried.
* Cart is absent until the site answers the Store cart drawer, then appears on
  every surface it answers, including Auction; visibility does not depend on
  session state.
* The account menu's item order under every combination of {Profile carried,
  Store answers} is fully specified: Profile (when carried), My Orders (when
  Store answers), My Auctions, Membership (when Store answers), Sign Out — in
  that fixed order, each omitted independently when its own condition is not
  met.
* Whether "KYC stays out" is gated by a handler or unconditional: unconditional,
  unaffected by the account-menu launch composition.
* Membership requires both its handler and its destination copy before it
  joins the menu; the handler-gating granularity for individual items (My
  Orders vs. Membership joining independently) is `shared/ui/site-chrome`'s to
  state, not this capability's.
* The header count is one per distinct active line in the reviewed basket, whatever its quantity: adjusted lines count, sold-out and unavailable lines do not, and checkout eligibility does not decide it.
* The count refreshes when the member's cart loads, when a cart change settles, saved or failed, when the drawer opens, and on Retry, with the drawer open or closed; nothing polls, and a change from another device shows after the next of these.
* The author chose to retain the last verified same-member count while a refresh is pending, including after failed cart updates; failed review hides the badge. Initial unknown counts and previous-member counts remain hidden.

## Reconciliation

**Run:** 2026-09-21. Independent scenario and blind suite agents read the proposal, decisions, new journey, and feature outline. The scenario reader additionally read durable page-shell and store-cart requirements; the suite reader was denied requirements, scenarios, archive, and the other reader's draft. UI uses the existing full-digit brand badge; no new visual design. No approved corpus was supplied to the blind pass, so rulebook defaults were used.

**Run:** 2026-10-06, QA2. A fresh reader joined the blind cases and the scenarios on `grade10-site-site-page-shell-US-08` and `grade10-site-site-page-shell-US-02`, read against the Cart section of the page-shell PRD, the decisions, the tech design and the grade10 cart drawer host (`apps/frontend/grade10/src/chrome/CartDrawerHost.tsx`) for how a review and a retry are reached. No domain, product or platform suite traces either journey: `grade10-site/site` holds no `domain-tcs.md`.

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| `grade10-site-site-page-shell-SC-42` | TC2 holds quantity, adjusted, sold-out and unavailable lines; TC1 compares the drawer title | Folded: TC1, TC2 |
| `grade10-site-site-page-shell-SC-43` | TC7 named "no active lines" without the all-excluded partition | Folded: TC7 gains the empty and sold-out-plus-unavailable rows; TC14 walks the transition to zero |
| `grade10-site-site-page-shell-SC-44` | TC1 ran 375px and 1200px but asserted no overflow; a 123-line row exceeded the 50-line cap grade10 holds a cart to (`packages/grade10-store/contracts/src/schemas.ts:422`) | Folded: TC1 tops out at 50 and asserts reachability without horizontal scroll |
| `grade10-site-site-page-shell-SC-45` | No blind case: once Cart is global, a surface without Cart is a build where Store does not answer | Folded: TC16 walks that build with a known positive count |
| `grade10-site-site-page-shell-SC-46` | TC1 and TC8 observe the count with the drawer closed | Folded: TC1, TC8 |
| `grade10-site-site-page-shell-SC-47` | Add, quantity change and remove with the drawer closed | Folded: TC4, TC5, TC14 |
| `grade10-site-site-page-shell-SC-48` | TC8 kept Cart visible but not in place | Folded: TC8 asserts the same place |
| `grade10-site-site-page-shell-SC-49` | TC9 and TC10 named a "review control" the site does not have; a review runs on drawer open and a retry from the failure notice | Folded: TC9 opens the drawer, TC10 clicks Retry |
| `grade10-site-site-page-shell-SC-50` | TC11 covered signed out only | Folded: TC11 gains the unresolved-session row |
| `grade10-site-site-page-shell-SC-51` | TC12 did not hold a late response | Folded: TC12 releases a held review after sign-out |
| `grade10-site-site-page-shell-SC-52` | TC13 held only B's review, so a late response from A was not walked | Folded: TC13 releases A's held review before and after B's |
| `grade10-site-site-page-shell-SC-53` | Pending refresh and failed mutation behaviour needed a decision | Author chose retain while checking for the same member, hide on failure; Q9 and TC15 |
| `grade10-site-site-page-shell-SC-54` | No blind case reached a change from another device; TC6 walked a line turning unavailable, the same run with a different change | Folded: TC6 takes both changes as rows and asserts the count before the review |
| `grade10-site-site-page-shell-SC-55` | TC3 named an unnamed surface and did not assert the count arrives without a review | Folded: TC3 moves to Auction and asserts no review on arrival |
| `grade10-site-site-page-shell-SC-04` | The badge clause adds nothing to the first paint | Durable US2-TC1 holds it |
| `grade10-site-site-page-shell-SC-05` | The modified requirement lets the session decide the cart count badge, and the badge must not move Cart; durable US2-TC2 said only the account entry changes | Folded: US2-TC2-2, revised with session rows for the badge and the Cart control's place |
| Q8, the count's meaning | Raised by the shared chrome pass | Settled above; the shared suite records the chrome's half |
| Q10, the refresh triggers | Settled in decisions | Settled above |

**Run:** 2026-10-06, QA2 second reading. A fresh reader re-joined every case and scenario on both journeys against the Cart section of the page-shell PRD, the decisions and the tech design, and read the grade10 surfaces a case drives: the listing tile's stepper sets a line's quantity and takes it out at zero with the drawer closed (`apps/frontend/grade10/src/pages/store/ProductListingPage.tsx:357`), and the review failure notice carries Retry (`apps/frontend/grade10/src/chrome/CartDrawerHost.tsx:275`).

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| `grade10-site-site-page-shell-SC-42` | TC2 named the partitions but asserted no number, so a quantity total could pass it | Folded: TC2 takes the scenario's basket and asserts `2` on the header and the drawer title |
| `grade10-site-site-page-shell-SC-47` | TC5 and TC14 named a quantity control and a removal control outside the drawer without saying where; the drawer was not held closed | Folded: both drive the listing tile's stepper with the drawer closed |
| `grade10-site-site-page-shell-SC-53` | TC15 ran a successful and a failed update as a sentence, not rows, and released a count the refused update could not reach | Folded: TC15 takes the two updates as rows, each with its reviewed count |
| `grade10-site-site-page-shell-SC-52` | TC13 changed member with no step a collector can take | Folded: TC13 signs out and signs in as B |
| `grade10-site-site-page-shell-SC-05` | US2-TC2-2 ran per row without saying so | Folded: the per-row line added |
| Uncovered anchors | Every scenario serving `grade10-site-site-page-shell-US-02` and `grade10-site-site-page-shell-US-08` is asserted by a case | None |
| Contradicted readings | No case and scenario disagree, and none disagrees with the page | None |

**Run:** 2026-10-06, QA2 third reading. A fresh reader re-joined every case and scenario on both journeys against the Cart section of the page-shell PRD and its new refresh decision, the decisions and the tech design, and read how the drawer starts a review (`apps/frontend/grade10/src/chrome/CartDrawerHost.tsx`).

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| `grade10-site-site-page-shell-SC-51` | TC12 held the member's next review but no step started one, so no late response could arrive | Folded: TC12 opens and closes the drawer to start the held review before signing out |
| `grade10-site-site-page-shell-SC-52` | TC13 held A's next review with no step that started it, and never showed A's 2 first | Folded: TC13 waits for 2, then opens and closes the drawer to start A's held review before changing member |
| `grade10-site-site-page-shell-SC-53` | TC15's cart update starts the review it holds; TC9 and TC10 start theirs by opening the drawer and by Retry | Folded: TC15, TC9, TC10 |
| `grade10-site-site-page-shell-SC-04`, `grade10-site-site-page-shell-SC-05`, `grade10-site-site-page-shell-SC-42` to `grade10-site-site-page-shell-SC-50`, `grade10-site-site-page-shell-SC-54`, `grade10-site-site-page-shell-SC-55` | Unchanged since the second reading | Folded as recorded above |
| Uncovered anchors | Every scenario serving `grade10-site-site-page-shell-US-02` and `grade10-site-site-page-shell-US-08` is asserted by a case | None |
| Contradicted readings | No case and scenario disagree, and none disagrees with the page | None |

**Run:** 2026-10-06, QA2 fifth reading. A fresh reader re-joined every case and scenario on both journeys against the Cart section of the page-shell PRD, the decisions, the tech design and `useCartPresentation` in grade10 (`packages/grade10-store/frontend/src/features/orders/cart/presentation/hooks/useCartPresentation.ts:42-70`), which keeps a same-member count while checking and drops it when the basket read or the review fails.

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| The refresh requirement | It listed opening the drawer among triggers that run "even while the drawer is closed" | Clarified: loading and settled changes review with the drawer open or closed, and opening the drawer and Retry review too; no case moves |
| `grade10-site-site-page-shell-SC-49` | A later review on opening the drawer or on Retry restores the count; TC9 fails the drawer-open review, TC10 restores on Retry | Folded: TC9, TC10 |
| `grade10-site-site-page-shell-SC-04`, `grade10-site-site-page-shell-SC-05`, `grade10-site-site-page-shell-SC-42` to `grade10-site-site-page-shell-SC-48`, `grade10-site-site-page-shell-SC-50` to `grade10-site-site-page-shell-SC-55` | Unchanged since the third reading | Folded as recorded above |
| Uncovered anchors | Every scenario serving `grade10-site-site-page-shell-US-02` and `grade10-site-site-page-shell-US-08` is asserted by a case | None |
| Contradicted readings | No case and scenario disagree, and none disagrees with the page | None |

**Run:** 2026-10-06, QA2 sixth reading. A fresh reader re-joined every case and scenario on both journeys against the Cart section of the page-shell PRD, its opening session rule, the decisions and the tech design.

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| `grade10-site-site-page-shell-SC-04`, `grade10-site-site-page-shell-SC-05`, `grade10-site-site-page-shell-SC-42` to `grade10-site-site-page-shell-SC-55` | Unchanged since the fifth reading; each THEN has a case that asserts it | Folded as recorded above |
| Uncovered anchors | Every scenario serving `grade10-site-site-page-shell-US-02` and `grade10-site-site-page-shell-US-08` is asserted by a case | None |
| Contradicted readings | No case and scenario disagree, and none disagrees with the page | None |

**Run:** 2026-10-07, QA2 seventh reading. A fresh reader re-joined every case and scenario on both journeys against the Cart section of the page-shell PRD, the decisions, the tech design and `useCartPresentation`, mounted once at `apps/frontend/grade10/src/root.tsx:162`, so moving to Auction starts no review.

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| US8 section and its cases | Numbered `US08`, against the compact form's no zero-pad (`docs/governance/specs-to-test-cases.md:88`) | Restyled: `grade10-site-site-page-shell-US8` and `US8-TC1-1` to `US8-TC16-1`; durable `US06` and `US07` keep their ids |
| `grade10-site-site-page-shell-SC-04`, `grade10-site-site-page-shell-SC-05`, `grade10-site-site-page-shell-SC-42` to `grade10-site-site-page-shell-SC-55` | Unchanged since the sixth reading; each case's `covers` names exactly the scenarios serving its journey | Folded as recorded above |
| Uncovered anchors | Every scenario serving `grade10-site-site-page-shell-US-02` and `grade10-site-site-page-shell-US-08` is asserted by a case | None |
| Contradicted readings | No case and scenario disagree, and none disagrees with the page | None |
