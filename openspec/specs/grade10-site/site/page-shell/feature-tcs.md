# grade10-site/site/page-shell Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-21, tcs-rules r3.0

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
with only the account entry updating once it does,
**so that** I can start navigating immediately without unrelated chrome
shifting under me.

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

### grade10-site-site-page-shell-US2-TC2-1: The session changes only the account entry

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

**Test data:**

| `<session>` |
| --- |
| Signed out |
| Signed in |

**Steps:**

1. Let the session resolve as <session>.
2. Inspect the account entry and the rest of the chrome.

**Expected Results:**

* The account entry matches <session>.
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

## grade10-site-site-page-shell-US06: Collector opens their cart from the header

**As a** collector,
**I want** the Cart control to take me to my own cart, signing me in first when
I am not,
**so that** the cart I open is the one holding what I picked, rather than an
empty room, from any surface once Store answers the cart drawer.

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
