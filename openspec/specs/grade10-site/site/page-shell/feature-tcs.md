# grade10-site/site/page-shell Test Cases

**Status:** pending-review · 0/53
**Drafts styled:** 2026-10-14, tcs-rules r5

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
**so that** I can start navigating immediately without chrome appearing or
disappearing under me.

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

<!-- trace:case id=g10.site-page-shell.TC-ev5 rev=4 covers=g10.site-page-shell.SC-yxt -->
### grade10-site-site-page-shell-US2-TC2-4: The session's arrival changes only the account entry and the cart count

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-02

**Pre-conditions:**

* customer's session is <session>, and the session read is held before it answers.
* The site answers Store, so the header offers Cart.
* The viewport is <viewport>.

**Test data:**

| `<viewport>` | `<session>` | `<cart count badge>` | `<controls left of the entry>` |
| --- | --- | --- | --- |
| 1280 CSS pixels wide | Signed in, 2 active lines | 2, once the cart review completes | Keep their places |
| 1280 CSS pixels wide | Signed in, no active lines | none | Keep their places |
| 1280 CSS pixels wide | Signed out, 1 active line in this browser's cart | 1, once the cart review completes | The language control, and search where the build answers it, move left by Sign In's width less 40 CSS pixels; every other control keeps its place |
| 375 CSS pixels wide | Signed out, 1 active line in this browser's cart | 1, once the cart review completes | Keep their places |

**Steps:**

1. Navigate to <grade10 site url>.
2. Record the position of every header control, the placeholder in the account entry's place included.
3. Release the held session read.
4. Wait for the cart review to complete, then record the position of every header control again.

**Expected Results:**

* Step 3: the account entry matches <session> - the account icon signed in, Sign In signed out - in the placeholder's place.
* Between steps 2 and 4, no chrome control appears or disappears other than the count badge.
* The Cart control keeps its place and shows <cart count badge>.
* <controls left of the entry>.

---

## grade10-site-site-page-shell-US3: Collector reaches account destinations from the header

**As a** collector,
**I want** Sign In when I am signed out, and when I am signed in an account
menu that shows my sign-in email with its small initial avatar above My
Auctions and Sign Out on auction launch, with Profile first wherever the
account page is carried and My Orders ahead of My Auctions once Store
answers, and no item whose page the site withholds,
**so that** one place in the header takes me where I can go for this launch,
without a second auction-orders link.

<!-- trace:case id=g10.site-page-shell.TC-eek rev=1 covers=g10.site-page-shell.SC-0ao -->
### grade10-site-site-page-shell-US3-TC1-1: A signed-out collector gets Sign In

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
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer is signed out and on <grade10 site url>.

**Steps:**

1. Read the account entry in the header.
2. Click Sign In.

**Expected Results:**

* Step 1: a primary Sign In button, no account icon.
* Step 2: sign-in opens.

<!-- trace:case id=g10.site-page-shell.TC-bs9 rev=2 covers=none -->
### grade10-site-site-page-shell-US3-TC2-2: A signed-in collector reaches the account menu

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

<!-- trace:case id=g10.site-page-shell.TC-obx rev=2 covers=g10.site-page-shell.SC-e9z,g10.site-page-shell.SC-04a -->
### grade10-site-site-page-shell-US3-TC3-2: Sign Out is offered in the menu and on the account page

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

* customer(signed in) is on <grade10 site url>.
* The site is staging, which carries the account page.

**Steps:**

1. Navigate to <grade10 site url><lang>/profile.
2. Read the account page's controls.
3. Click the account control in the header.
4. Read the account menu's items.
5. Click Sign Out in the account menu.

**Expected Results:**

* Step 2: the account page offers Sign Out.
* Step 4: the account menu offers Sign Out.
* Step 5: the header shows Sign In in place of the account control.

<!-- trace:case id=g10.site-page-shell.TC-asx rev=1 covers=g10.site-page-shell.SC-70a -->
### grade10-site-site-page-shell-US3-TC4-1: Activating My Orders opens the collector's orders

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in) is on <grade10 site url>.
* The site is staging, which answers Store.

**Steps:**

1. Click the account control in the header.
2. Click My Orders in the account menu.

**Expected Results:**

* Step 2 opens <grade10 site url><lang>/profile/orders.

<!-- trace:case id=g10.site-page-shell.TC-5jl rev=3 covers=g10.site-page-shell.SC-u71,g10.site-page-shell.SC-79q -->
### grade10-site-site-page-shell-US3-TC5-3: Menu without Store omits My Orders and opens on Profile where the account page is carried

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* The site shell renders for a signed-in collector on a build that carries the account page and withholds Store.

**Steps:**

1. Open the account menu.
2. Read the account menu's items.

**Expected Results:**

* Step 2: the menu lists Profile, My Auctions, then Sign Out.
* Step 2: no My Orders item.

<!-- trace:case id=g10.site-page-shell.TC-1su rev=1 covers=g10.site-page-shell.SC-m3w,g10.site-page-shell.SC-u71,g10.site-page-shell.SC-n9c,g10.site-page-shell.SC-3y1 -->
### grade10-site-site-page-shell-US3-TC6-1: Auction-launch account menu shows email, avatar, and reduced items

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in as <collector email>) is on <grade10 site url>.
* The site is <lane>, which carries neither Store, the account page nor the membership page.

**Test data:**

| <lane> |
| --- |
| UAT |
| Production |

**Steps:**

1. Click the account control in the header.
2. Read the account menu.

**Expected Results:**

* Step 2: a small initial avatar above <collector email>, both above the items.
* Step 2: My Auctions, then Sign Out, and nothing else.
* Step 2: no Profile, My Orders or Membership item.

<!-- trace:case id=g10.site-page-shell.TC-wll rev=2 covers=g10.site-page-shell.SC-y2l,g10.site-page-shell.SC-3y1 -->
### grade10-site-site-page-shell-US3-TC7-2: Store-launch account menu puts My Orders ahead of My Auctions

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

* customer(signed in as <collector email>) is on <grade10 site url>.
* The site is staging, which answers Store.

**Steps:**

1. Click the account control in the header.
2. Read the account menu.

**Expected Results:**

* Step 2: a small initial avatar above <collector email>, both above the items.
* Step 2: My Orders immediately before My Auctions.
* Step 2: Sign Out is the last item.
* Step 2: no KYC item.
* Step 2: no item opening <grade10 my auction orders url>.

<!-- trace:case id=g10.site-page-shell.TC-7s9 rev=1 covers=g10.site-page-shell.SC-m6b -->
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

* customer(signed in) is on <grade10 site url>.

**Steps:**

1. Click the account control in the header.
2. Read the last item in the account menu.

**Expected Results:**

* Step 2: the item reads Sign Out, in Title Case.

<!-- trace:case id=g10.site-page-shell.TC-atw rev=2 covers=none -->
### grade10-site-site-page-shell-US3-TC9-2: Account menu label falls back when no sign-in email is supplied

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in) is on <grade10 site url>.
* The header receives no sign-in email for the session.

**Steps:**

1. Click the account control in the header.
2. Read the account menu.

**Expected Results:**

* Step 2: the account label shows in place of an email.
* Step 2: My Auctions and Sign Out are still listed.

<!-- trace:case id=g10.site-page-shell.TC-xbu rev=2 covers=none -->
### grade10-site-site-page-shell-US3-TC10-2: Activating Membership invokes its handler without opening a withheld route

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
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

<!-- trace:case id=g10.site-page-shell.TC-fa4 rev=3 covers=g10.site-page-shell.SC-y2l,g10.site-page-shell.SC-79q,g10.site-page-shell.SC-o1v -->
### grade10-site-site-page-shell-US3-TC11-3: Account menu opens on Profile, which opens the account page

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
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in) is on <grade10 site url>.
* The site is staging, which carries the account page and answers Store.

**Steps:**

1. Click the account control in the header.
2. Read the account menu's items.
3. Click Profile in the account menu.

**Expected Results:**

* Step 2: Profile is the first item.
* Step 2: My Orders comes before My Auctions.
* Step 2: Sign Out is the last item.
* Step 3 opens the account page at <grade10 site url><lang>/profile.

<!-- trace:case id=g10.site-page-shell.TC-kw9 rev=1 covers=g10.site-page-shell.SC-agf,g10.site-page-shell.SC-th1 -->
### grade10-site-site-page-shell-US3-TC12-1: Store menu leaves out the account and membership pages a build withholds

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* The site shell renders for a signed-in collector on a build that answers Store and withholds the account page and the membership page.

**Steps:**

1. Open the account menu.
2. Read the account menu's items.

**Expected Results:**

* Step 2: the menu lists My Orders, My Auctions, then Sign Out, and nothing else.
* Step 2: no Profile item.
* Step 2: no Membership item.

<!-- trace:case id=g10.site-page-shell.TC-74a rev=1 covers=g10.site-page-shell.SC-lcs -->
### grade10-site-site-page-shell-US3-TC13-1: Activating My Auctions opens My Auctions

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

* customer(signed in) is on <grade10 site url>.

**Steps:**

1. Click the account control in the header.
2. Click My Auctions in the account menu.

**Expected Results:**

* Step 2 opens My Auctions at <grade10 site url><lang>/auction/my-auctions.

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

<!-- trace:case id=g10.site-page-shell.TC-pm3 rev=2 covers=g10.site-page-shell.SC-xiu -->
### grade10-site-site-page-shell-US5-TC2-2: Unlisted surface marks no navigation item

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

* customer(signed in) is on <grade10 site url>.
* The site is staging, which carries the account page.

**Steps:**

1. Navigate to <grade10 site url><lang>/profile.
2. Read the header navigation.

**Expected Results:**

* Step 2: no navigation item is marked as the current page.

---

## grade10-site-site-page-shell-US06: Collector opens their cart from the header

**As a** collector,
**I want** the Cart control to open the cart holding what I picked, whether or
not I am signed in,
**so that** I can review it from any surface once Store answers the cart
drawer.

<!-- trace:case id=g10.site-page-shell.TC-6el rev=2 covers=g10.site-page-shell.SC-g63 -->
### grade10-site-site-page-shell-US06-TC1-2: A signed-out collector presses Cart

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
* This browser's cart holds <line_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <line_1> | One in-stock product line |

**Steps:**

1. Activate the Cart control in the header.
2. Check the dialog and the cart drawer.

**Expected Results:**

* The cart drawer opens and shows <line_1>.
* No sign-in dialog opens.

<!-- trace:case id=g10.site-page-shell.TC-b8i rev=1 covers=g10.site-page-shell.SC-tj7 -->
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

<!-- trace:case id=g10.site-page-shell.TC-kv0 rev=2 covers=none -->
### grade10-site-site-page-shell-US06-TC2-2: Sign-in opens the cart they asked for

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
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

<!-- trace:case id=g10.site-page-shell.TC-wbo rev=2 covers=none -->
### grade10-site-site-page-shell-US06-TC3-2: Dismissing sign-in opens nothing

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
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

---

## grade10-site-site-page-shell-US07: Collector opens Help from the header

**As a** collector,
**I want** Help in the primary nav to open the documentation site in a new tab
(the last item — after Shows when present, else Store Locator, else Auction),
**so that** I can read help without losing the page I was on, whether I am on
auction-only or full primary nav.

<!-- trace:case id=g10.site-page-shell.TC-ho3 rev=2 covers=g10.site-page-shell.SC-o1e,g10.site-page-shell.SC-53q -->
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
* Help is supplied in the primary nav after Shows; Store Locator is absent.

**Steps:**

1. Locate Help in the primary navigation after Shows.
2. Confirm Store Locator is not in the primary navigation.
3. Activate Help.
4. Check the new browsing context and the original page.

**Expected Results:**

* Help is present in the primary navigation after Shows.
* Store Locator is absent from the primary navigation.
* The documentation site opens in a new browsing context.
* The auction page remains open in the original context.

<!-- trace:case id=g10.site-page-shell.TC-wno rev=2 covers=g10.site-page-shell.SC-o1e,g10.site-page-shell.SC-53q -->
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
* Help is supplied in the primary nav after Shows.

**Steps:**

1. Locate Help in the primary navigation after Shows.
2. Activate Help.
3. Check the new browsing context and the original page.

**Expected Results:**

* Help is present in the primary navigation after Shows alongside the
  full primary nav.
* The documentation site opens in a new browsing context.
* The store page remains open in the original context.

<!-- trace:case id=g10.site-page-shell.TC-mgo rev=2 covers=g10.site-page-shell.SC-o1e,g10.site-page-shell.SC-53q -->
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
* Help is supplied among the primary nav items after Shows; Store Locator is
  absent.

**Steps:**

1. Open the header menu.
2. Locate Help among the primary items in the drawer after Shows.
3. Confirm Store Locator is not in the drawer.
4. Activate Help.
5. Check the new browsing context and the original page.

**Expected Results:**

* Help is reachable in the drawer after Shows.
* Store Locator is absent from the drawer.
* The documentation site opens in a new browsing context.
* The auction page remains open in the original context.

---

## grade10-site-site-page-shell-US8: Collector sees the cart count without opening the drawer

**As a** collector,
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

<!-- trace:case id=g10.site-page-shell.TC-ux8 rev=2 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### grade10-site-site-page-shell-US8-TC11-2: A guest's count is this browser's cart, and an unresolved session shows none

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
* This browser's cart holds 2 active lines.

**Test data:**

| `<session>` | `<cart count badge>` |
| --- | --- |
| Signed out | 2, once the cart review completes |
| Unresolved, with the session read held | none |

**Steps:**

1. Navigate to <grade10 store url>.
2. Observe the Cart control.

**Expected Results:**

* Cart remains visible and shows <cart count badge>.

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

---

## grade10-site-site-page-shell-US9: Collector is not offered Sign In before their session answers

**As a** collector,
**I want** the header to hold the account entry's place until my session has
answered,
**so that** I am never offered Sign In while I am already signed in.

<!-- trace:case id=g10.site-page-shell.TC-lir rev=1 covers=g10.site-page-shell.SC-3s6 -->
### grade10-site-site-page-shell-US9-TC1-1: The account entry's place holds a placeholder until the session answers

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer's session is <session>, and the session read is held before it answers.
* The site answers Store, so the header offers Cart.
* The viewport is <viewport>.

**Test data:**

| `<viewport>` | `<session>` |
| --- | --- |
| 1280 CSS pixels wide | Signed in |
| 375 CSS pixels wide | Signed in |
| 1280 CSS pixels wide | Signed out, with no session in this browser |

**Steps:**

1. Navigate to <grade10 site url>.
2. Look at the header while the session read is held.

**Expected Results:**

* A round placeholder 40 CSS pixels across sits in the account entry's place.
* At 375 CSS pixels wide, the placeholder sits in the bar beside Cart.
* Neither Sign In nor the account icon shows.

<!-- trace:case id=g10.site-page-shell.TC-nms rev=1 covers=g10.site-page-shell.SC-gua -->
### grade10-site-site-page-shell-US9-TC2-1: The placeholder offers nothing to press

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer(signed in) is on a browser whose session read is held before it answers.
* The site answers Store, so the header offers Cart.
* The viewport is 1280 CSS pixels wide.

**Steps:**

1. Navigate to <grade10 site url>.
2. Click the placeholder in the account entry's place.
3. Put keyboard focus on the first control in the header, then press Tab until focus reaches Cart.

**Expected Results:**

* Step 2: nothing opens - no sign-in and no account menu - and the page stays as it was.
* Step 3: focus never rests on the placeholder.

<!-- trace:case id=g10.site-page-shell.TC-an4 rev=1 covers=g10.site-page-shell.SC-0lr -->
### grade10-site-site-page-shell-US9-TC3-1: The placeholder is not read aloud

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer(signed in) is on a browser whose session read is held before it answers.
* A screen reader is running.

**Steps:**

1. Navigate to <grade10 site url>.
2. Move through the header with the screen reader's reading keys, from its first control to its last.
3. Inspect the header in the browser's accessibility tree.

**Expected Results:**

* Step 2: the screen reader reads nothing for the placeholder - no label, and no busy or loading status.
* Step 3: the placeholder has no accessible name and no status role, and nothing in the header is marked busy.

<!-- trace:case id=g10.site-page-shell.TC-din rev=1 covers=g10.site-page-shell.SC-31a -->
### grade10-site-site-page-shell-US9-TC4-1: The first answer puts the account entry in the placeholder's place

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
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer's session is <session>.
* The session read is held for 10 seconds, a slow read that still answers, then answers.

**Test data:**

| `<session>` | `<entry>` | `<never shown>` |
| --- | --- | --- |
| Signed in | The account icon | Sign In |
| Signed out, with no session in this browser | Sign In | The account icon |

**Steps:**

1. Navigate to <grade10 site url>.
2. Watch the account entry until the session read answers, and for 5 seconds after.

**Expected Results:**

* Until the read answers, the placeholder shows.
* When the read answers, <entry> shows in the placeholder's place at once.
* <never shown> never shows.

<!-- trace:case id=g10.site-page-shell.TC-fo4 rev=1 covers=g10.site-page-shell.SC-31a,g10.site-page-shell.SC-i26 -->
### grade10-site-site-page-shell-US9-TC5-1: A signed-in collector's first paints never show Sign In

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer(signed in) on a browser whose session is read as usual, with nothing held.
* The browser's developer tools record the page load frame by frame, with screenshots, and the network requests.

**Test data:**

| `<address>` |
| --- |
| <grade10 site url>, opened in a new tab |
| <written page address>, an address the site serves as a page written before any session is read |

**Steps:**

1. Start the recording, then open <address>.
2. Stop the recording once the account icon shows.
3. Step through the recorded frames from the first paint.

**Expected Results:**

* No frame shows Sign In in the header.
* Every frame before the session read's response arrives shows the placeholder in the account entry's place; the account icon shows only after that response, then stays.
* Once the account icon shows, it stays.

<!-- trace:case id=g10.site-page-shell.TC-79s rev=1 covers=g10.site-page-shell.SC-tah -->
### grade10-site-site-page-shell-US9-TC6-1: A written page holds the placeholder before the app takes over

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
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* JavaScript is turned off in the browser, so the page shows only what the site wrote.

**Test data:**

| Field | Value |
| --- | --- |
| `<written page address>` | An address the site serves as a page written before any session is read |

**Steps:**

1. Navigate to <written page address>.
2. Look at the header's account entry.

**Expected Results:**

* The placeholder shows in the account entry's place.
* Neither Sign In nor the account icon shows.

<!-- trace:case id=g10.site-page-shell.TC-0r0 rev=1 covers=g10.site-page-shell.SC-qnl -->
### grade10-site-site-page-shell-US9-TC7-1: A failed session read shows Sign In

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer(signed in) is on a browser whose session read fails with <failure>.

**Test data:**

| `<failure>` |
| --- |
| A 500 server error |
| A dropped connection, with no response |

**Steps:**

1. Navigate to <grade10 site url>.
2. Look at the account entry once the session read has failed.
3. Click Sign In.

**Expected Results:**

* Step 2: Sign In shows in the placeholder's place.
* Step 3: sign-in opens.

<!-- trace:case id=g10.site-page-shell.TC-89t rev=1 covers=g10.site-page-shell.SC-uqh -->
### grade10-site-site-page-shell-US9-TC8-1: A slow session read keeps the placeholder until it answers

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer(signed in) is on a browser whose session read is held until step 4 releases it.

**Test data:**

| Field | Value |
| --- | --- |
| `<wait>` | 60 seconds |

**Steps:**

1. Navigate to <grade10 site url>.
2. Watch the account entry for <wait>.
3. Click Auction in the primary navigation.
4. Release the held session read.

**Expected Results:**

* Step 2: the placeholder stays for the whole <wait>, and Sign In never shows.
* Step 3: the Auction surface opens, with the placeholder still in the account entry's place.
* Step 4: the account icon takes the placeholder's place, and Sign In never shows.

<!-- trace:case id=g10.site-page-shell.TC-zmu rev=1 covers=g10.site-page-shell.SC-gmi -->
### grade10-site-site-page-shell-US9-TC9-1: A later session read keeps the entry already shown

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer's session is <session>, and <grade10 site url> shows <entry> after its first answer.
* The site's next session read will be held before it answers.

**Test data:**

| `<session>` | `<entry>` | `<re-read>` |
| --- | --- | --- |
| Signed out | Sign In | Switch to another browser tab, then back |
| Signed in | The account icon | Switch to another browser tab, then back |
| Signed in | The account icon | Click Auction in the primary navigation |

**Steps:**

1. <re-read>.
2. Watch the account entry while the session read is held.
3. Release the held session read.

**Expected Results:**

* Step 2: <entry> stays in place, and the placeholder does not show.
* Step 3: <entry> still shows.

<!-- trace:case id=g10.site-page-shell.TC-v1f rev=1 covers=g10.site-page-shell.SC-nuz -->
### grade10-site-site-page-shell-US9-TC10-1: Signing in or out after the first answer does not bring the placeholder back

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer is <before> on <grade10 site url>, and the header shows the entry from the page's first answer.

**Test data:**

| `<before>` | `<action>` | `<after>` |
| --- | --- | --- |
| Signed in | Click the account icon, then Sign Out in the account menu | Sign In |
| Signed out | Click Sign In and complete sign-in | The account icon |

**Steps:**

1. <action>.
2. Watch the account entry until it shows <after>.

**Expected Results:**

* The account entry shows <after>.
* No page that has already shown Sign In or the account icon shows the placeholder again.

<!-- trace:case id=g10.site-page-shell.TC-an5 rev=1 covers=g10.site-page-shell.SC-ra1 -->
### grade10-site-site-page-shell-US9-TC11-1: A later session read that fails keeps the entry already shown

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer is signed in, and <grade10 site url> shows the account icon after the session's first answer.
* The site's next session read will answer with <answer>.

**Test data:**

| `<answer>` | `<entry>` |
| --- | --- |
| A server error (500) | The account icon |
| A dropped connection | The account icon |
| No session, as after signing out in another browser | Sign In |

**Steps:**

1. Switch to another browser tab, then back.
2. Watch the account entry until the session read has answered.

**Expected Results:**

* Step 2: <entry> shows, and the placeholder does not show at any point.

## Settled

* Help sits last in the primary nav for auction-only and full nav (wide and
  compact): after Shows when that item is present, else Store Locator, else
  Auction.
* Shows joins the primary nav ahead of Help once the site answers `/shows`;
  About, Shows, Press Releases and Media Coverage form the footer's Company
  column.
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
* Signed-in account entry opens a menu, the sign-in email with its small
  initial avatar above the items, offering My Auctions and Sign Out on auction
  launch, Profile first wherever the account page is carried, and My Orders
  ahead of My Auctions once Store answers - not the account page directly;
  Sign Out is offered from that menu and from the account page wherever it is
  carried.
* Membership follows the membership page by the rule Profile follows, and a
  later change offers it; until then the menu never offers it.
* The menu offers no item whose page the site withholds: My Orders, Profile or
  Membership.
* The account label in place of the sign-in email is `SiteHeader`'s alone: a
  signed-in collector always has an email.
* A later session read that fails keeps the account entry already shown; a
  later read that returns no session shows Sign In.
* What Cart opens before the session first answers is the cart's own rule; the
  account placeholder holds only the account entry.
* When the session arrives, only the language and search controls on the wide
  header may move, and only by the account entry's change in width; the
  centred primary navigation, Cart and the compact bar stay where they are.

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

**Run:** QA1 blind pass, 2026-10-06, for `omit-profile-account-menu`, `grade10-site/site/page-shell`. It rewrote US3-TC3, US3-TC5 and US3-TC11, retired US3-TC2, added a KYC result to US3-TC7, and raised one question, now a row of `decisions.md`'s `## Raised` table. It left no statement of what it read and was denied, so none is claimed here.

**Run:** QA2 reconciliation, 2026-10-06. The blind cases were joined to the delta's scenarios on `grade10-site-site-page-shell-US-03`. Every US3 case is carried in this suite, because each durable marker covered scenarios this change removes; each now covers the scenarios it walks. The journey was corrected to Page Shell · Account Menu, which holds Profile (Q1) and Membership (Q5) open: it names neither, and no case asserts either.

**Run:** QA2 reconciliation rerun, 2026-10-06, after QA1's third round raised Q14 and the scenarios were renumbered. It corrected every scenario id the table cited, retired US3-TC9, moved US3-TC5 to the unit layer, and named UAT in place of Preview in US3-TC6.

**Run:** QA2 reconciliation, third run, 2026-10-06, after Page Shell · Account Menu gained its Withheld pages line and the proposal became neutral on Q1. Every case and scenario was joined again; no disposition moved. It dropped the journeys file's context journeys, which no scenario or case of this change anchors on.

**Run:** QA2 reconciliation, fourth run, 2026-10-06, after the acceptance review's third round. The journey dropped its Cart clause, so `grade10-site-site-page-shell-US3-TC6-1` and `grade10-site-site-page-shell-US3-TC7-2` dropped their Cart results and keep their versions. The three deprecated cases cover none. The two durable Settled lines this change makes false are struck by hand at acceptance. No other disposition moved.

**Run:** QA2 reconciliation, fifth run, 2026-10-06, after the deltas' feature sets kept only the lines they change (Q12). The anchor `grade10-site-site-page-shell-US-03` did not move, and every case and scenario was joined again; no disposition moved. The Context journeys row now gives its reason without the suite warning, which the gate no longer issues for a context journey.

**Run:** QA2 reconciliation, sixth run, 2026-10-06, after the acceptance review's fourth round. `grade10-site-site-page-shell-SC-14` names the account page in place of the profile, so `grade10-site-site-page-shell-US5-TC2-2` follows it, and the journeys file restates `grade10-site-site-page-shell-US-05` as context. `## Settled` drops the line that said Profile and Membership wait on Product: an open question is never settled, and `decisions.md` Q1 and Q5 hold it.

**Run:** QA2 reconciliation, seventh run, 2026-10-06, in a fresh context. Every case and scenario was joined again on `grade10-site-site-page-shell-US-03` and `grade10-site-site-page-shell-US-05`, and every lane and address a case names was checked against grade10 `src/surfaces.ts`. `grade10-site-site-page-shell-US5-TC2-2` walks the unlisted surface alone, so its marker drops `grade10-site-site-page-shell-SC-13`, which the durable `grade10-site-site-page-shell-US5-TC1-1` walks. No disposition moved.

**Applied:** 2026-10-07, the product owner's answers to Q1, Q5 and Q13; not a QA2 reading, which reruns on them. Profile joins first wherever the account page is carried, so `grade10-site-site-page-shell-SC-66` and `grade10-site-site-page-shell-SC-67` are added, `grade10-site-site-page-shell-US3-TC5-3` and `grade10-site-site-page-shell-US3-TC11-3` are unblocked and rewritten, and the journey names Profile. Membership follows its page and a later change offers it, so `## Settled` says so.

**Run:** QA2 reconciliation, eighth run, 2026-10-07, in a fresh context, on the answers to Q1, Q5 and Q13. Every case and scenario was joined again, and every lane a case names was checked against grade10 `src/surfaces.ts:343-399`. `grade10-site-site-page-shell-US3-TC5-3` drops "and nothing else": the build `store-shut.test.tsx` renders carries the membership page, and no scenario closes the menu there, so the result would turn false once a later change offers Membership (Q5). The table now names task 2.2 and `shared-ui-site-chrome-US1-TC17-2`. No other disposition moved.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-site-page-shell-US3-TC1-1` | Reached | `grade10-site-site-page-shell-SC-07`; unchanged |
| `grade10-site-site-page-shell-US3-TC2-2` | Retired, `deprecated`, bumped | It put Profile first, which the removed `grade10-site-site-page-shell-SC-17` stated; the Store menu is `grade10-site-site-page-shell-US3-TC7-2`. Its marker covers none, so a retired case never reads as coverage of `grade10-site-site-page-shell-SC-56` |
| `grade10-site-site-page-shell-US3-TC3-2` | Reached, bumped | `grade10-site-site-page-shell-SC-08` and `grade10-site-site-page-shell-SC-57`. The account page offers Sign Out only on a build that carries it, so the case runs on staging |
| `grade10-site-site-page-shell-US3-TC4-1` | Reached | `grade10-site-site-page-shell-SC-64`; unchanged |
| `grade10-site-site-page-shell-US3-TC5-3` | Rewritten on Q1, moved to unit | Its no-My-Orders result is `grade10-site-site-page-shell-SC-58`. With the account page carried, Profile is first (`grade10-site-site-page-shell-SC-66`), so the no-Profile result became a Profile-first result, and task 2.2 tests that state in `store-shut.test.tsx`. No lane carries the account page and withholds Store (grade10 `src/surfaces.ts:343-399`), so the case runs on the rendered shell with the gates overridden. It does not assert "nothing else": that build carries the membership page, which a later change offers (Q5) |
| `grade10-site-site-page-shell-US3-TC6-1` | Reached, lane corrected | `grade10-site-site-page-shell-SC-06`, `grade10-site-site-page-shell-SC-58`, `grade10-site-site-page-shell-SC-60` and `grade10-site-site-page-shell-SC-61` on the auction-launch lanes. "Preview" is no lane in the gate table; the rows are UAT, where the walk runs, and Production. Its no-Cart result left with the journey's Cart clause: `grade10-site-site-page-shell-US-04` and `grade10-site-site-page-shell-US-06` own Cart |
| `grade10-site-site-page-shell-US3-TC7-2` | Reached, rewritten | The blind reading listed Membership after My Auctions, from the journey; Membership follows its own page and a later change offers it (Q5), and no scenario places it, so the result is dropped. Its "no Profile" result needed a lane that answers Store and withholds the account page, which no lane is; it moved to `grade10-site-site-page-shell-US3-TC12-1`. The case runs on staging and walks `grade10-site-site-page-shell-SC-56` and `grade10-site-site-page-shell-SC-61`. Its Cart result left with the journey's Cart clause |
| `grade10-site-site-page-shell-US3-TC8-1` | Reached | `grade10-site-site-page-shell-SC-62`; unchanged |
| `grade10-site-site-page-shell-US3-TC9-2` | Retired, `deprecated`, bumped | The label fallback left this capability with Q14: a signed-in session always carries an email, so the fallback is `SiteHeader`'s alone, walked by `shared-ui-site-chrome-US1-TC17-2`. Its marker covers none: the retired `grade10-site-site-page-shell-SC-31` leaves the spec at the fold |
| `grade10-site-site-page-shell-US3-TC10-2` | Retired, `deprecated`, bumped | `grade10-site-site-page-shell-SC-34` is removed: the app never supplies Membership, and a later change offers it (Q5) with its own case. Its marker covers none, not `grade10-site-site-page-shell-SC-63`, the opposite outcome, which `grade10-site-site-page-shell-US3-TC12-1` walks |
| `grade10-site-site-page-shell-US3-TC11-3` | Rewritten on Q1 | On staging, which carries the account page, Profile is first and opens it (`grade10-site-site-page-shell-SC-66`, `grade10-site-site-page-shell-SC-67`); the rest of the case is `grade10-site-site-page-shell-SC-56` |
| `grade10-site-site-page-shell-US3-TC12-1` | Case added | `grade10-site-site-page-shell-SC-59` and `grade10-site-site-page-shell-SC-63` had no case. No lane answers Store and withholds those pages, so the case runs on the rendered shell with the gates overridden, as task 2.2 does |
| `grade10-site-site-page-shell-US3-TC13-1` | Case added | `grade10-site-site-page-shell-SC-65` had no case, before this change or after it |
| Raised: Membership in the journey once Store answers | Landed as Q5, journey corrected | The journey named Membership once Store answers and "never a Profile item". Page Shell is the source: the journey names Profile first wherever the account page is carried (Q1), and not Membership, which a later change offers (Q5) |
| Raised: the label fallback without an email | Landed as Q14, settled | The site always has the email, so page-shell drops the fallback with its scenario and `grade10-site-site-page-shell-US3-TC9-2` retires |
| Settled: the menu's Membership lines | Retracted | The durable suite settled Membership once Store answers, in two lines, while Membership follows its own page and a later change offers it (Q5). The fold has no rule that removes a durable Settled line, so acceptance strikes both from the durable suite by hand: the line that reads "plus Profile once carried, My Orders and Membership once Store answers", and the line that opens "The account menu's item order under every combination of {Profile carried, Store answers}". This suite's own menu line holds neither phrase. `## Settled` states the menu this change settles, its withheld pages, Membership and the label fallback (Q14) |
| Journey: Cart in the bar | Dropped | No scenario serving `grade10-site-site-page-shell-US-03` states Cart; `grade10-site-site-page-shell-US-04` and `grade10-site-site-page-shell-US-06` own it, so the clause and the two Cart results left |
| Context journeys | Dropped, one restated | No scenario or case of this change anchors on US-01, US-02, US-04, US-06 or US-07. `grade10-site-site-page-shell-SC-13` and `grade10-site-site-page-shell-SC-14` serve `grade10-site-site-page-shell-US-05`, so the journeys file restates it as context beside `grade10-site-site-page-shell-US-03`, which the change modifies |
| `grade10-site-site-page-shell-US5-TC2-2` | Rewritten, bumped | `grade10-site-site-page-shell-SC-14` now reads "the account page". The case opens the account page on staging, which carries it, in place of `<grade10 profile url>`. It asserts no marked item and nothing about a listed surface, so its marker covers `grade10-site-site-page-shell-SC-14` alone |
| Settled: Profile and Membership wait on Product | Dropped, then restated | A Settled line is read as answered by the next blind pass, so an open question never sits there. Q1 and Q5 are now answered: `## Settled` places Profile in the menu line and states Membership's rule |
| Scenarios | All reached | Every scenario the delta carries has a case asserting its outcome: `grade10-site-site-page-shell-SC-06` to `grade10-site-site-page-shell-SC-08`, `grade10-site-site-page-shell-SC-13`, `grade10-site-site-page-shell-SC-14` and `grade10-site-site-page-shell-SC-56` to `grade10-site-site-page-shell-SC-67`; `grade10-site-site-page-shell-SC-13` by the durable `grade10-site-site-page-shell-US5-TC1-1` |
| Contradictions | None | Where a case and a scenario state the same behaviour they agree |

**Run:** removal reconciliation, 2026-10-12, for `remove-my-auction-orders`, `grade10-site/site/page-shell`. The modified requirement drops "or My Auction Orders" from its not-offered rule and from `grade10-site-site-page-shell-SC-56`. No case moves - no case asserted the name, and the menu's closed set is unchanged by it.

- **Run** - QA1 blind pass, 2026-10-14. Read: the method (`spec-to-tcs` skill, `specs-to-test-cases.md` at `tcs_rules_rev` 5, `writing.md`); the change's `proposal.md`, `decisions.md` (goals, non-goals, Q1-Q7, empty `## Raised`) and `ui-design.md`; page-shell's durable `## Purpose` and `## Feature set`, the change's feature-set outline, the durable and change `user-journeys.md`; the existing `feature-tcs.md` with its `## Reconciliation` stripped; the Page Shell and Site Header and Footer PRDs; the `openspec/config.yaml` context. Denied: every `## Requirements` section, scenario text, `tech-design.md`, `tasks.md`, `openspec/specs/` beyond the supplied sections, and `openspec/changes/archive/`. Not supplied: `tcs-conventions.md` and the `grade10-site/site` domain suite.

**Run:** 2026-10-14, QA2. A fresh reader joined QA1's blind cases and Dev's scenarios on `grade10-site-site-page-shell-US-02` and `grade10-site-site-page-shell-US-09`, read against the Session section of the Page Shell PRD, the Account Entry section of the Site Header and Footer PRD, `decisions.md` Q1 to Q10, `ui-design.md`, `tech-design.md` and `tasks.md`. After QA1 the coordinator wrote `grade10-site-site-page-shell-US9-TC11-1` from Q8 and reworded the `Stable layout` feature-set leaf to name the language and search controls (Q10), both non-anchor clarifications. A case links a scenario only where its route, starting state and checks assert every THEN; four do. No domain, product or platform suite traces either journey: `grade10-site/site` holds no `domain-tcs.md`.

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| `grade10-site-site-page-shell-US2-TC2-4` | Revised by QA1 from the durable `US2-TC2-3`. Its wide rows assert every THEN of `grade10-site-site-page-shell-SC-05`, moving only the language and search controls, by Sign In's width less 40 CSS pixels, as Q10 names them. Its 375 CSS pixel row keeps every control in place, which the requirement and Q10 state and no scenario does | Reached: covers `grade10-site-site-page-shell-SC-05`. The 375 row folds into that scenario (Dev) |
| `grade10-site-site-page-shell-US9-TC1-1` | A round placeholder 40 CSS pixels across at both widths, signed in or out, beside Cart at 375, with neither Sign In nor the account icon. It does not walk the inert and silent clause, which TC2-1 and TC3-1 walk. Beside Cart is the requirement's Both widths paragraph, not a scenario's | Reached in part: `grade10-site-site-page-shell-SC-68`. Links once that scenario splits and its THEN names Cart (Dev) |
| `grade10-site-site-page-shell-US9-TC2-1` | A click and a Tab pass on the wide header: nothing opens, and focus never rests on the placeholder | Reached in part: the inert clause of `grade10-site-site-page-shell-SC-68`. Links to the scenario that clause becomes (Dev) |
| `grade10-site-site-page-shell-US9-TC3-1` | A screen reader reads nothing for the placeholder, and the accessibility tree gives it no name or status role, with nothing busy | Reached in part: the silent clause of `grade10-site-site-page-shell-SC-68`. Links to the scenario that clause becomes (Dev) |
| `grade10-site-site-page-shell-US9-TC4-1` | Signed in, a read held 10 seconds: the placeholder until the answer, then the account icon in its place, and Sign In never. Signed out, Sign In in its place at once, the THEN of `grade10-site-site-page-shell-SC-05`. No check of the other controls | Reached in part: `grade10-site-site-page-shell-SC-70` all but its last AND. Links once that AND goes (Dev) |
| `grade10-site-site-page-shell-US9-TC5-1` | Frames recorded from the first paint, signed in: no Sign In, only the placeholder or the account icon, and the icon stays. Its written-page row is the scripts taking the written page over | Reached in part: `grade10-site-site-page-shell-SC-70` all but its last AND, and the last AND of `grade10-site-site-page-shell-SC-69`. Links once both edits land (Dev) |
| `grade10-site-site-page-shell-US9-TC6-1` | With JavaScript off, the written page shows the placeholder and neither Sign In nor the account icon. It cannot reach the scripts taking the page over | Reached in part: `grade10-site-site-page-shell-SC-69` all but its last AND. Links once that AND is its own scenario (Dev) |
| `grade10-site-site-page-shell-US9-TC7-1` | A 500 and a dropped connection on the first read each show Sign In in the placeholder's place, and Sign In opens sign-in | Reached: covers `grade10-site-site-page-shell-SC-71` |
| `grade10-site-site-page-shell-US9-TC8-1` | A read held 60 seconds keeps the placeholder with no Sign In, but the read is never released, so the account icon arriving after it is not asserted. Step 3 opens Auction with the placeholder still in place, which the requirement's Placeholder row implies and no scenario states | Reached in part: `grade10-site-site-page-shell-SC-73`. Links once the case releases the read (QA1) and the scenario states the move to another surface (Dev) |
| `grade10-site-site-page-shell-US9-TC9-1` | Back to the tab signed out and signed in, and on to Auction signed in: the entry stays while the read is held, the placeholder never shows, and the same session leaves the entry as it was. A move between surfaces may start no read; the results hold either way | Reached: covers `grade10-site-site-page-shell-SC-72` |
| `grade10-site-site-page-shell-US9-TC10-1` | Signing out from the account menu, and signing in through Sign In, after the first answer: the entry changes and the placeholder never returns. `grade10-site-site-page-shell-SC-72` keeps the placeholder away on a read, not on signing in or out, and the case does not walk its read under way | Behaviour no scenario states, and real (Q3, the requirement's Once paragraph): folds as a new scenario (Dev) |
| `grade10-site-site-page-shell-US9-TC11-1` | Written by the coordinator after QA1 from Q8, not by the blind pass. A later 500 or dropped read keeps the account icon with no placeholder; a later read with no session shows Sign In | Reached: covers `grade10-site-site-page-shell-SC-74` |
| `grade10-site-site-page-shell-SC-04` | Unchanged; no case in this suite asserts it | Durable `grade10-site-site-page-shell-US2-TC1-1` holds it |
| `grade10-site-site-page-shell-SC-05` | `grade10-site-site-page-shell-US2-TC2-4` asserts every THEN | Reached |
| `grade10-site-site-page-shell-SC-68` | The placeholder, its inertness and its silence are three cases, US9-TC1-1, US9-TC2-1 and US9-TC3-1; none asserts all three | Uncovered as one scenario: Dev splits it |
| `grade10-site-site-page-shell-SC-69` | US9-TC6-1 asserts the written page and US9-TC5-1 the scripts taking it over; neither asserts both | Uncovered as one scenario: Dev splits its last AND |
| `grade10-site-site-page-shell-SC-70` | US9-TC4-1 and US9-TC5-1 assert the account icon with no Sign In; only US2-TC2-4 checks that nothing else moves, and not from the first paint | Uncovered as one scenario: Dev drops its last AND, which `grade10-site-site-page-shell-SC-05` states for the account icon |
| `grade10-site-site-page-shell-SC-71` | `grade10-site-site-page-shell-US9-TC7-1` asserts every THEN | Reached |
| `grade10-site-site-page-shell-SC-72` | `grade10-site-site-page-shell-US9-TC9-1` asserts every THEN | Reached |
| `grade10-site-site-page-shell-SC-73` | US9-TC8-1 asserts the minute; no case asserts the answer after it | Uncovered: US9-TC8-1 releases the read (QA1) |
| `grade10-site-site-page-shell-SC-74` | `grade10-site-site-page-shell-US9-TC11-1` asserts every THEN | Reached |
| `Stable layout` feature-set leaf | Reworded by the coordinator after QA1 to name the language and search controls (Q10); no journey moved | No case reads a feature-set line; none moves |
| `Account placeholder` feature-set leaf | Reworded by the coordinator after acceptance review to say a first read that fails shows Sign In and a later read keeps the entry shown unless it finds a different session (Q4, Q8); no journey moved | US9-TC7-1, US9-TC9-1, US9-TC10-1 and US9-TC11-1 already agree; none moves |
| Raised: a later read that fails | Landed as Q8 | `grade10-site-site-page-shell-US9-TC11-1` walks it; settled above |
| Raised: Cart before the first answer | Landed as Q9: not this change's | No case asserts what Cart opens before the first answer; settled above |
| Raised: which controls move | Landed as Q10 | The feature-set leaf names them and `grade10-site-site-page-shell-SC-05` does not yet (contradicted readings); settled above |
| Uncovered anchors | `grade10-site-site-page-shell-US-02` has US2-TC2-4; `grade10-site-site-page-shell-US-09` has eleven cases | None |
| Over-claimed cases | No marker this run wrote names a scenario its case does not assert whole. The durable `grade10-site-site-page-shell-US2-TC1-1` marker still names `grade10-site-site-page-shell-SC-05`, which it does not assert | Legacy marker, valid; narrowing it means carrying the case here |
| Contradicted readings | `grade10-site-site-page-shell-SC-05` moves "the controls to the account entry's left", the reading Q10 refused, while US2-TC2-4 keeps the primary navigation in place. The requirement's state table shows the account icon only after a signed-in latest read, while its Once paragraph, `grade10-site-site-page-shell-SC-74` and US9-TC11-1 keep it after a later failed read | Settled by Q10 and Q8: Dev rewords both; no Raised row |

**Run:** 2026-10-14, QA2 second reading, narrow. It read the repair to the first reading and what it touches: `grade10-site-site-page-shell-SC-68` naming Cart, with `grade10-site-site-page-shell-SC-75` and `grade10-site-site-page-shell-SC-76` split out of it; `grade10-site-site-page-shell-SC-77` split out of `grade10-site-site-page-shell-SC-69`; `grade10-site-site-page-shell-SC-70` without its last AND; `grade10-site-site-page-shell-SC-73` gaining the move to another surface; `grade10-site-site-page-shell-SC-78`; `grade10-site-site-page-shell-SC-05` naming the language and search controls; the requirement's state table; US9-TC8-1 releasing the held read; and the tasks and lanes citing the new scenarios. It read grade10's sign-in dialog (`apps/frontend/grade10/src/chrome/SignInOverlay.tsx` and `SignInFlow`) for whether signing in leaves the page. Findings the repair did not touch are carried forward.

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| `grade10-site-site-page-shell-US9-TC1-1` | Unchanged; the scenario now asks for Cart beside the placeholder in the compact bar, which the case's 375 row asserts | Reached: covers `grade10-site-site-page-shell-SC-68` |
| `grade10-site-site-page-shell-US9-TC2-1` | Unchanged; "the page stays as it was" holds the address the scenario names | Reached: covers `grade10-site-site-page-shell-SC-75` |
| `grade10-site-site-page-shell-US9-TC3-1` | Unchanged: the screen reader reads no label and no busy or loading status for the placeholder | Reached: covers `grade10-site-site-page-shell-SC-76` |
| `grade10-site-site-page-shell-US9-TC4-1` | Unchanged; the scenario dropped the other controls, which US2-TC2-4 walks under `grade10-site-site-page-shell-SC-05` | Reached: covers `grade10-site-site-page-shell-SC-70` |
| `grade10-site-site-page-shell-US9-TC5-1` | Every frame may show "the placeholder or the account icon", so an account icon shown before the session read answers, from a session the browser remembered, passes it. That is the risk `grade10-site-site-page-shell-SC-77` holds, and a non-goal; the placeholder coming before the account icon in `grade10-site-site-page-shell-SC-70` is not asserted either. The first reading's promise of these links was too lenient | Reached in part: `grade10-site-site-page-shell-SC-70` and `grade10-site-site-page-shell-SC-77`. Links once the case asserts the placeholder until the session read's response and the account icon only after it (QA1) |
| `grade10-site-site-page-shell-US9-TC6-1` | Unchanged; the scenario now ends at Sign In not appearing | Reached: covers `grade10-site-site-page-shell-SC-69` |
| `grade10-site-site-page-shell-US9-TC8-1` | Now held until step 4: a minute of placeholder with no Sign In, Auction opening with the placeholder still in place, and the account icon taking its place once the read is released | Reached: covers `grade10-site-site-page-shell-SC-73` |
| `grade10-site-site-page-shell-US9-TC10-1` | Unchanged. It keeps the placeholder away on the page where the collector signs in or out, "no page that has already shown Sign In or the account icon". The magic link lands on a new page, which the reload rule starts at the placeholder; Google signs in without leaving the page. The scenario reads on that page | Reached: covers `grade10-site-site-page-shell-SC-78`. "On that page" in the scenario would say so (Dev, optional) |
| `grade10-site-site-page-shell-US2-TC2-4`, `grade10-site-site-page-shell-US9-TC7-1`, `grade10-site-site-page-shell-US9-TC9-1`, `grade10-site-site-page-shell-US9-TC11-1` | Untouched by the repair; `grade10-site-site-page-shell-SC-05` now names the language and search controls and keeps every other control in place, as US2-TC2-4's rows assert | Reached as recorded above |
| `grade10-site-site-page-shell-SC-77` | US9-TC5-1, after the coordinator's repair: every frame before the session read's response shows the placeholder, and the account icon only after it | Covered: US9-TC5-1, linked |
| `grade10-site-site-page-shell-SC-04`, `grade10-site-site-page-shell-SC-05`, `grade10-site-site-page-shell-SC-68` to `grade10-site-site-page-shell-SC-76`, `grade10-site-site-page-shell-SC-78` | Each has a case that asserts every THEN; `grade10-site-site-page-shell-SC-04` stays with the durable `grade10-site-site-page-shell-US2-TC1-1` | Reached |
| The requirement's state table | The Account icon and Sign In rows now read the latest read that did not fail, as Q8 decides. Sign In's "or the first read failed" stays true after a later read finds the collector signed in, when the Account icon row holds as well | Dev: "or every read so far has failed" |
| Uncovered anchors | Unchanged | None |
| Over-claimed cases | Each marker names only scenarios its case asserts whole; the durable US2-TC1-1 legacy marker stands as recorded above | None |
| Contradicted readings | `grade10-site-site-page-shell-SC-05` and the state table now agree with Q10, Q8 and the cases | None |

**Coordinator repair, 2026-10-14:** US9-TC5-1 now records the network requests and asserts the placeholder in every frame before the session read's response, the account icon only after it; linked to `grade10-site-site-page-shell-SC-70` and `grade10-site-site-page-shell-SC-77`. No scenario is left uncovered.
