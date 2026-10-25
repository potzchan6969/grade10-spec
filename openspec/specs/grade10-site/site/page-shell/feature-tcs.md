# grade10-site/site/page-shell Test Cases

**Status:** pending-review · 0/31
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* `<site>` is the Grade10 site: staging answers Store and carries the account page; UAT and production, the auction launch, carry neither Store, the account page nor the membership page. A wide viewport is 1280 CSS pixels; a narrow one 375.
* A held session read is the session request paused by the tester until released; a cart review is the basket read the header's count waits on.

## g10.site-page-shell.US1: Collector opens any surface inside the site shell

**As a** collector,
**I want** every address the site answers to render its surface between the
header and the footer, at the width I browse at,
**so that** I get the site around whatever I opened, and never a surface that
shipped without it.

<!-- trace:case id=g10.site-page-shell.TC-5ah rev=1 covers=g10.site-page-shell.SC-tme,g10.site-page-shell.SC-qm2,g10.site-page-shell.SC-kxh,g10.site-page-shell.SC-o0j,g10.site-page-shell.SC-oq6 -->
### g10.site-page-shell.US1-TC1: Every address renders inside the site shell, one of each landmark

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
* **Trace:** grade10-site-site-page-shell-US-01

**Pre-conditions:**

* A collector opens `<address>`.

**Test data:**

| `<address>` |
| --- |
| the brand home |
| an address the site does not recognize |

**Steps:**

1. Read the chrome and the landmarks.

**Expected Results:**

* The header and footer stand with the surface between them; there is exactly one banner, one main and one contentinfo, the surface inside main; the shell adds no heading, copy or spacing of its own.

<!-- trace:case id=g10.site-page-shell.TC-ban rev=1 covers=g10.site-page-shell.SC-tme,g10.site-page-shell.SC-qm2,g10.site-page-shell.SC-kxh,g10.site-page-shell.SC-o0j,g10.site-page-shell.SC-oq6 -->
### g10.site-page-shell.US1-TC2: A narrow viewport reflows the shell, its navigation reachable from the menu

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-01

**Pre-conditions:**

* The viewport is 375 CSS pixels wide.

**Steps:**

1. Open the brand home, and scroll it.
2. Open the header menu.

**Expected Results:**

* Step 1 scrolls vertically only, nothing clipped and every control reachable.
* Step 2 reaches primary navigation and language from the drawer, Account or Sign In staying in the bar, the panel leaving a visible gutter.

<!-- trace:case id=g10.site-page-shell.TC-6vf rev=1 -->
### g10.site-page-shell.US1-TC4: Every product area renders in the brand sans, and a blocked font leaves the page whole

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
* **Trace:** grade10-site-site-page-shell-US-01

**Pre-conditions:**

* `<font>`.

**Test data:**

| `<font>` | `<reads>` |
| --- | --- |
| the brand font loads | Gibson, never a default browser sans |
| requests to use.typekit.net are blocked, as an ad blocker would | the browser's fallback sans, with no spinner, empty state or error about the font |

**Steps:**

1. Open the home page, the store listing, an open lot and the loyalty page, reading a heading and a paragraph on each.

**Expected Results:**

* Each shows its full content and layout at once, both texts in `<reads>`.

---

## g10.site-page-shell.US2: Collector sees the chrome before the session resolves

**As a** collector,
**I want** the header and the footer rendered before the session has resolved,
with only the account entry and the cart count updating once it does,
**so that** I can start navigating immediately without chrome appearing or
disappearing under me.

<!-- trace:case id=g10.site-page-shell.TC-ev5 rev=4 covers=g10.site-page-shell.SC-yxt,g10.site-page-shell.SC-9ud -->
### g10.site-page-shell.US2-TC2: The chrome renders before the session, whose arrival changes only the account entry and the cart count

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
* **Trace:** grade10-site-site-page-shell-US-02

**Pre-conditions:**

* The site answers Store; the session read is held; the collector is `<session>` on a `<viewport>` viewport.

**Test data:**

| `<viewport>` | `<session>` | `<badge>` | `<left of the entry>` |
| --- | --- | --- | --- |
| wide | signed in, 2 active lines | 2 | keep their places |
| wide | signed in, no active lines | none | keep their places |
| wide | signed out, 1 active line in this browser's cart | 1 | the language control, and search where answered, move left by Sign In's width less 40 CSS pixels |
| narrow | signed out, 1 active line in this browser's cart | 1 | keep their places |

**Steps:**

1. Open `<site>`, and record every header control's place, the surface loading in the content region.
2. Release the session read, wait for the cart review, and record them again.

**Expected Results:**

* Step 1 renders the header and footer, the placeholder in the account entry's place.
* Step 2 puts the account icon, or Sign In, in its place; no control appears or disappears but the badge; Cart keeps its place and shows `<badge>`; controls left of the entry `<left of the entry>`.

---

## g10.site-page-shell.US3: Collector reaches account destinations from the header

**As a** collector,
**I want** Sign In when I am signed out, and when I am signed in an account
menu that shows my sign-in email with its small initial avatar above My
Auctions and Sign Out on auction launch, with Profile first wherever the
account page is carried and My Orders ahead of My Auctions once Store
answers, and no item whose page the site withholds,
**so that** one place in the header takes me where I can go for this launch,
without a second auction-orders link.

<!-- trace:case id=g10.site-page-shell.TC-eek rev=1 covers=g10.site-page-shell.SC-0ao -->
### g10.site-page-shell.US3-TC1: A signed-out collector gets Sign In

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* A signed-out collector is on `<site>`.

**Steps:**

1. Read the account entry, and click Sign In.

**Expected Results:**

* It is a primary Sign In button, with no account icon; sign-in opens.

<!-- trace:case id=g10.site-page-shell.TC-1su rev=1 covers=g10.site-page-shell.SC-m3w,g10.site-page-shell.SC-u71,g10.site-page-shell.SC-n9c,g10.site-page-shell.SC-3y1,g10.site-page-shell.SC-y2l,g10.site-page-shell.SC-m6b,g10.site-page-shell.SC-79q,g10.site-page-shell.SC-o1v -->
### g10.site-page-shell.US3-TC6: The account menu shows the email and avatar, offering only what this build carries

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
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* A collector is signed in on `<build>`.

**Test data:**

| `<build>` | `<items>` |
| --- | --- |
| UAT | My Auctions, Sign Out |
| production | My Auctions, Sign Out |
| staging | Profile, My Orders, My Auctions, Sign Out |

**Steps:**

1. Click the account control, and read the menu.
2. Open the store, then an auction listing, then Profile where offered, and read the account control on each.

**Expected Results:**

* A small initial avatar sits above the sign-in email, both above `<items>`, in that order and nothing else: no KYC, no Membership, nothing opening My Auction orders; the last reads Sign Out, in Title Case.
* Step 2 names the same collector on every page, Profile with their name and email, and no other person.

<!-- trace:case id=g10.site-page-shell.TC-asx rev=1 covers=g10.site-page-shell.SC-70a,g10.site-page-shell.SC-lcs,g10.site-page-shell.SC-e9z,g10.site-page-shell.SC-04a -->
### g10.site-page-shell.US3-TC4: Each account menu item opens its destination

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
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* A collector is signed in on staging, the account menu open.

**Test data:**

| `<item>` | `<opens>` |
| --- | --- |
| Profile | the account page at `/profile`, which also offers Sign Out |
| My Orders | `/profile/orders` |
| My Auctions | `/auction/my-auctions` |
| Sign Out | sign-out, the header then showing Sign In |

**Steps:**

1. Click `<item>`.

**Expected Results:**

* It opens `<opens>`.

---

## g10.site-page-shell.US4: Collector follows only links the site answers

**As a** collector,
**I want** the chrome to show a control or a link only when the site answers
its destination, except Help which may open the documentation host Product
names, with language options rather than currencies,
**so that** nothing in the header or the footer leads me to a not-found page
or implies a currency I cannot switch, while Help can still open off-site
docs.

<!-- trace:case id=g10.site-page-shell.TC-ytf rev=2 covers=g10.site-page-shell.SC-ovr,g10.site-page-shell.SC-ql0,g10.site-page-shell.SC-ond,g10.site-page-shell.SC-7p3,g10.site-page-shell.SC-fmx,g10.site-page-shell.SC-cex,g10.site-page-shell.SC-ixf -->
### g10.site-page-shell.US4-TC2: The navigation and the footer link only where the site answers, languages not currencies

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-04

**Pre-conditions:**

* A collector is on the brand home.

**Steps:**

1. Follow every header navigation item's destination, and every footer link's; read the locale options.

**Expected Results:**

* Each leads to a surface the site answers, but Help to the documentation host and Index to the Grade10 Index hub; the footer's Index column, Hat Price Index, PTCG100, PTCG500 and OPCG100, opens each external page in a new browsing context, and a column left with nothing reachable is absent.
* The locale options are the brand's languages, none a currency.

<!-- trace:case id=g10.site-page-shell.TC-8rx rev=1 covers=g10.site-page-shell.SC-ovr,g10.site-page-shell.SC-ql0,g10.site-page-shell.SC-ond,g10.site-page-shell.SC-7p3,g10.site-page-shell.SC-fmx,g10.site-page-shell.SC-cex -->
### g10.site-page-shell.US4-TC1: The auction-first chrome omits what the site does not answer

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-04

**Pre-conditions:**

* The site answers neither the cart drawer, Store, Store Locator nor any utility destination.

**Steps:**

1. Read the header on a wide viewport, and open the compact menu.

**Expected Results:**

* Store, Store Locator, search, Cart, the promotional bar and the utility row are absent; language is reachable in the bar and the menu.

<!-- trace:case id=g10.site-page-shell.TC-08v rev=1 covers=g10.site-page-shell.SC-ovr,g10.site-page-shell.SC-ql0,g10.site-page-shell.SC-ond,g10.site-page-shell.SC-7p3,g10.site-page-shell.SC-fmx,g10.site-page-shell.SC-cex -->
### g10.site-page-shell.US4-TC4: Cart is global once Store answers

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-04

**Pre-conditions:**

* The site answers the cart drawer; a collector is on an Auction surface.

**Steps:**

1. Read the header.

**Expected Results:**

* Cart appears; search stays absent while no search surface answers.

---

## g10.site-page-shell.US5: Collector locates the current surface in the navigation

**As a** collector,
**I want** the navigation item owning the address I am on to be marked, and
none marked when no item owns it,
**so that** I can tell where I am in the site without guessing.

<!-- trace:case id=g10.site-page-shell.TC-19q rev=1 covers=g10.site-page-shell.SC-q3w,g10.site-page-shell.SC-xiu -->
### g10.site-page-shell.US5-TC1: A listed surface marks its navigation item

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-05

**Pre-conditions:**

* A collector opens the store, or an address beneath it.

**Steps:**

1. Read the header navigation.

**Expected Results:**

* Store is marked as the current page.

<!-- trace:case id=g10.site-page-shell.TC-pm3 rev=2 covers=g10.site-page-shell.SC-xiu -->
### g10.site-page-shell.US5-TC2: An unlisted surface marks no navigation item

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-05

**Pre-conditions:**

* A signed-in collector on staging opens `/profile`.

**Steps:**

1. Read the header navigation.

**Expected Results:**

* No item is marked current.

---

## g10.site-page-shell.US6: Collector opens their cart from the header

**As a** collector,
**I want** the Cart control to open the cart holding what I picked, whether or
not I am signed in,
**so that** I can review it from any surface once Store answers the cart
drawer.

<!-- trace:case id=g10.site-page-shell.TC-6el rev=2 covers=g10.site-page-shell.SC-g63,g10.site-page-shell.SC-tj7 -->
### g10.site-page-shell.US6-TC1: Cart opens the drawer, signed in or out, with no sign-in in front

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
* **Trace:** grade10-site-site-page-shell-US-06

**Pre-conditions:**

* A `<collector>` is on a surface whose header offers Cart.

**Test data:**

| `<collector>` | `<drawer shows>` |
| --- | --- |
| signed-out collector, this browser's cart holding one in-stock line | that line |
| signed-in collector | their cart |

**Steps:**

1. Activate the Cart control.

**Expected Results:**

* The drawer opens, showing `<drawer shows>`; no sign-in dialog opens.

---

## g10.site-page-shell.US7: Collector opens Help from the header

**As a** collector,
**I want** Help in the primary nav to open the documentation site in a new tab
(after Store Locator when present, after Auction on auction-only),
**so that** I can read help without losing the page I was on, whether I am on
auction-only or full primary nav.

<!-- trace:case id=g10.site-page-shell.TC-ho3 rev=3 covers=g10.site-page-shell.SC-o1e,g10.site-page-shell.SC-53q,g10.site-page-shell.SC-ixn -->
### g10.site-page-shell.US7-TC1: Help and Index open their sites in a new tab, Help last in the primary nav

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-07

**Pre-conditions:**

* A collector is on `<surface>`, Index and Help supplied in the primary nav.

**Test data:**

| `<surface>` | `<read in>` |
| --- | --- |
| the auction, auction-only nav, wide | the primary navigation |
| the store, full nav, wide | the primary navigation |
| the auction, narrow | the header menu's drawer |

**Steps:**

1. In `<read in>`, find Index and Help; activate Index, then Help.
2. Read the original tab, and whether Index is ever marked current.

**Expected Results:**

* Index sits after Shows, Help after Index and last; Store Locator is absent on the auction-only nav; each carries the external-link glyph.
* Index opens the Grade10 Index hub, and Help the documentation site, each in a new browsing context, the original page staying open; Index is never marked current.

---

## g10.site-page-shell.US8: Collector sees the cart count without opening the drawer

**As a** collector,
**I want** the header to show the same active-line count as my cart drawer as my cart changes,
**so that** I can see how many active lines I hold from any surface without opening the drawer.

<!-- trace:case id=g10.site-page-shell.TC-19a rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### g10.site-page-shell.US8-TC1: The header counts the reviewed active lines, as the drawer does, wherever the collector goes

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
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* A signed-in collector's reviewed cart holds `<lines>`, the drawer closed, on a wide and a narrow viewport.

**Test data:**

| `<lines>` | `<count>` |
| --- | --- |
| 1 active line | 1 |
| 3 active lines | 3 |
| 50 active lines | 50 |
| an available line of quantity 3, an adjusted line of quantity 2 awaiting acknowledgement, a sold-out and an unavailable line | 2 |

**Steps:**

1. Open the store, and read the header after the review.
2. Click Auction, and read the header.
3. Click Cart, and read the drawer's title.

**Expected Results:**

* Step 1 shows `<count>` in the round brand indicator, Cart reachable with no horizontal scroll.
* Step 2 shows the same count on arrival, no review running, the drawer closed.
* Step 3's title count equals the header's.

<!-- trace:case id=g10.site-page-shell.TC-mv8 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### g10.site-page-shell.US8-TC4: A settled cart change refreshes the closed drawer's count, a quantity change keeping it

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
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* A signed-in collector on the store, the drawer closed, holds `<cart>`.

**Test data:**

| `<cart>` | `<change>` | `<count after>` |
| --- | --- | --- |
| an empty reviewed cart | add a product to the cart | 1 |
| one active line of quantity 1 | raise its tile's stepper to 2 | 1 |

**Steps:**

1. Make `<change>`, and wait for it and the review to settle; read the header, then the drawer's title.

**Expected Results:**

* The header shows `<count after>` without the drawer opening; the title count equals it.

<!-- trace:case id=g10.site-page-shell.TC-xq5 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### g10.site-page-shell.US8-TC7: A cart with no active line keeps Cart and shows no badge

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* A signed-in collector's reviewed cart `<cart>`.

**Test data:**

| `<cart>` |
| --- |
| holds no line |
| holds only a sold-out and an unavailable line |
| held one active line of quantity 1, its tile's stepper lowered to 0 and settled |

**Steps:**

1. Read the Cart control on the store.

**Expected Results:**

* Cart stays visible with no count badge.

<!-- trace:case id=g10.site-page-shell.TC-id6 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### g10.site-page-shell.US8-TC6: A change made elsewhere shows after the next review

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
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* A signed-in collector's header shows 2, the drawer closed; since that review, `<change>`.

**Test data:**

| `<change>` | `<count>` |
| --- | --- |
| an active line became unavailable | 1 |
| the same collector added a distinct line from another device | 3 |

**Steps:**

1. Read the header; click Cart, wait for the review, and read the header and the title.

**Expected Results:**

* The header shows 2 before the review and `<count>` after it, the title count equal.

<!-- trace:case id=g10.site-page-shell.TC-70a rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### g10.site-page-shell.US8-TC8: An unknown count shows no badge until a review succeeds

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* A signed-in collector's cart holds active lines; the first review is held.

**Steps:**

1. Open the store, and read the Cart control; release the review, and read it again.

**Expected Results:**

* While pending, no badge or skeleton shows, Cart in place throughout; the successful review shows the count.

<!-- trace:case id=g10.site-page-shell.TC-4mi rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### g10.site-page-shell.US8-TC15: A same-collector refresh keeps the verified count while it runs

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
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* A signed-in collector's verified count is 2; the next review is held.

**Test data:**

| `<update>` | `<count>` |
| --- | --- |
| lower a line's stepper to 0, which succeeds | 1 |
| raise a line's stepper, which the server refuses and rolls back | 2 |

**Steps:**

1. Make `<update>` and let it settle; read the header while the review is held, then release it.

**Expected Results:**

* While held the header keeps 2, with no skeleton; after, it shows `<count>`.

<!-- trace:case id=g10.site-page-shell.TC-fj9 rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### g10.site-page-shell.US8-TC9: A failed review clears the count until a review succeeds

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* A signed-in collector's header shows a reviewed count; the next review cannot complete, the one after can.

**Steps:**

1. Click Cart, and let the review fail; read the Cart control.
2. Click Retry on the failure notice; read it again.

**Expected Results:**

* Step 1 drops the badge, Cart staying visible.
* Step 2 shows the newly reviewed count.

<!-- trace:case id=g10.site-page-shell.TC-ux8 rev=2 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### g10.site-page-shell.US8-TC11: A guest counts this browser's cart, and an unresolved session counts nothing

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
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* This browser's cart holds 2 active lines; the session is `<session>`.

**Test data:**

| `<session>` | `<badge>` |
| --- | --- |
| signed out | 2, once the review completes |
| unresolved, its read held | none |

**Steps:**

1. Open the store, and read the Cart control.

**Expected Results:**

* Cart stays visible showing `<badge>`.

<!-- trace:case id=g10.site-page-shell.TC-szw rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### g10.site-page-shell.US8-TC12: A count never outlives its collector

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* Collector A's header shows 2, their next review held; `<then>`.

**Test data:**

| `<then>` | `<after>` |
| --- | --- |
| A signs out, then A's review is released | no badge |
| A signs out and B, with 1 active line, signs in; A's review is released before B's | no badge until B's review, then 1 |
| as above, A's review released after B's | 1 |

**Steps:**

1. Read the Cart control as the session changes, and after each release.

**Expected Results:**

* The 2 disappears at once, and A's released review never shows it; the control reads `<after>`.

<!-- trace:case id=g10.site-page-shell.TC-mnz rev=1 covers=g10.site-page-shell.SC-6jx,g10.site-page-shell.SC-awn,g10.site-page-shell.SC-8v4,g10.site-page-shell.SC-e9p,g10.site-page-shell.SC-rae,g10.site-page-shell.SC-r0e,g10.site-page-shell.SC-7el,g10.site-page-shell.SC-mzr,g10.site-page-shell.SC-79p,g10.site-page-shell.SC-k7b,g10.site-page-shell.SC-o8b,g10.site-page-shell.SC-b9m,g10.site-page-shell.SC-z8c,g10.site-page-shell.SC-kfr -->
### g10.site-page-shell.US8-TC16: A build without Store shows neither Cart nor a count

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-08

**Pre-conditions:**

* On a build where Store does not answer, a signed-in collector holds a known count.

**Steps:**

1. Open the auction, and read the header.

**Expected Results:**

* No Cart control and no count badge.

---

## g10.site-page-shell.US9: Collector is not offered Sign In before their session answers

**As a** collector,
**I want** the header to hold the account entry's place until my session has
answered,
**so that** I am never offered Sign In while I am already signed in.

<!-- trace:case id=g10.site-page-shell.TC-lir rev=1 covers=g10.site-page-shell.SC-3s6,g10.site-page-shell.SC-31a -->
### g10.site-page-shell.US9-TC1: The account entry's place holds a placeholder until the session answers, then the answer

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
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* The site answers Store; the session read is held 10 seconds, then answers; the collector is `<session>` on a `<viewport>` viewport.

**Test data:**

| `<viewport>` | `<session>` | `<entry>` | `<never shown>` |
| --- | --- | --- | --- |
| wide | signed in | the account icon | Sign In |
| narrow | signed in | the account icon | Sign In |
| wide | signed out, no session in this browser | Sign In | the account icon |

**Steps:**

1. Open `<site>`, and watch the account entry until the read answers and 5 seconds after.

**Expected Results:**

* Until it answers, a round placeholder 40 CSS pixels across holds the entry's place, beside Cart on narrow; then `<entry>` takes its place at once; `<never shown>` never shows.

<!-- trace:case id=g10.site-page-shell.TC-fo4 rev=1 covers=g10.site-page-shell.SC-31a,g10.site-page-shell.SC-i26 -->
### g10.site-page-shell.US9-TC5: A signed-in collector's first paints never show Sign In

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* A signed-in collector's session reads as usual; the browser records the load frame by frame.

**Test data:**

| `<opened>` |
| --- |
| `<site>`, in a new tab |
| an address the site writes before any session is read |

**Steps:**

1. Record opening `<opened>` until the account icon shows, and step through the frames.

**Expected Results:**

* No frame shows Sign In; every frame before the session's answer shows the placeholder, the account icon only after, then staying.

<!-- trace:case id=g10.site-page-shell.TC-nms rev=1 covers=g10.site-page-shell.SC-gua,g10.site-page-shell.SC-0lr -->
### g10.site-page-shell.US9-TC2: The placeholder offers nothing to press, and nothing to read aloud

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* A signed-in collector's session read is held; a screen reader runs, on a wide viewport.

**Steps:**

1. Click the placeholder; tab from the first header control to Cart.
2. Move through the header with the reader's keys, and inspect the accessibility tree.

**Expected Results:**

* Step 1 opens nothing, the page unchanged, focus never resting on it.
* Step 2 reads nothing for it, no busy or loading status; it has no accessible name or status role, and nothing is marked busy.

<!-- trace:case id=g10.site-page-shell.TC-79s rev=1 covers=g10.site-page-shell.SC-tah -->
### g10.site-page-shell.US9-TC6: A written page holds the placeholder before the scripts take it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* JavaScript is off in the browser.

**Steps:**

1. Open an address the site writes before any session is read, and read the account entry.

**Expected Results:**

* The placeholder shows, neither Sign In nor the account icon.

<!-- trace:case id=g10.site-page-shell.TC-0r0 rev=1 covers=g10.site-page-shell.SC-qnl -->
### g10.site-page-shell.US9-TC7: A failed first session read shows Sign In

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* A signed-in collector's session read fails with `<failure>`.

**Test data:**

| `<failure>` |
| --- |
| a 500 server error |
| a dropped connection |

**Steps:**

1. Open `<site>`, and read the entry once the read fails; click Sign In.

**Expected Results:**

* Sign In takes the placeholder's place, and opens sign-in.

<!-- trace:case id=g10.site-page-shell.TC-89t rev=1 covers=g10.site-page-shell.SC-uqh -->
### g10.site-page-shell.US9-TC8: A slow session read keeps the placeholder until it answers

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* A signed-in collector's session read is held until released.

**Steps:**

1. Open `<site>`, and watch the entry for 60 seconds.
2. Click Auction; then release the read.

**Expected Results:**

* The placeholder stays throughout, on the Auction surface too, Sign In never showing; on release the account icon takes its place.

<!-- trace:case id=g10.site-page-shell.TC-zmu rev=1 covers=g10.site-page-shell.SC-gmi,g10.site-page-shell.SC-nuz,g10.site-page-shell.SC-ra1 -->
### g10.site-page-shell.US9-TC9: Once answered, the entry stays through later reads, failed or not, and through signing in or out

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
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* A collector's page shows `<entry>` after its first answer.

**Test data:**

| `<entry>` | `<then>` | `<shows>` |
| --- | --- | --- |
| Sign In | a held re-read, switching tabs and back, then released | Sign In |
| the account icon | a held re-read, switching tabs and back, then released | the account icon |
| the account icon | a held re-read, clicking Auction, then released | the account icon |
| the account icon | a re-read answering a 500 error, or a dropped connection | the account icon |
| the account icon | a re-read answering no session, as after signing out elsewhere | Sign In |
| the account icon | Sign Out from the account menu | Sign In |
| Sign In | signing in | the account icon |

**Steps:**

1. Make `<then>`, watching the entry.

**Expected Results:**

* It shows `<shows>`, the placeholder never showing again.

## Settled

* Help sits last in the primary nav for auction-only and full nav (wide and
  compact): after Index when that item is present, else Shows, else Store
  Locator, else Auction.
* Shows joins the primary nav ahead of Index and Help once the site answers
  `/shows`; About, Shows, Press Releases and Media Coverage form the
  footer's Company column.
* Index joins the primary nav after Shows and before Help, opening the
  Grade10 Index hub in a new tab; the four index pages — Hat Price Index,
  PTCG100, PTCG500, OPCG100 — form the footer's Index column ahead of Help
  and Legal, each external. External primary items carry the external-link
  glyph after their label — Index and Help alike.
* Auction-first primary nav omits Store Locator until the shop is open.
* Help opens the documentation site in a new tab.
* The durable host address stays open until Product confirms it.
* Cart is absent until the site answers the Store cart drawer, then appears on
  every surface it answers, including Auction; visibility does not depend on
  session state.
* Whether "KYC stays out" is gated by a handler or unconditional: unconditional,
  unaffected by the account-menu launch composition.
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

