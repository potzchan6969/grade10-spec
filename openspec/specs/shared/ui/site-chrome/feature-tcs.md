# shared/ui/site-chrome Test Cases

**Status:** pending-review · 0/26
**Drafts styled:** 2026-10-06, tcs-rules r4

**Out of suite:** none.

## shared-ui-site-chrome-US1: Shared chrome contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/site/page-shell`, which composes the header and footer
**As an** application composing the shared chrome,
**I want** the chrome to expose only the controls I have answered, keep
off-site destinations safely scoped, and present one truthful, session-aware
header for any brand,
**so that** every product surface can render a correct header without
reimplementing its behavior.

<!-- trace:case id=g10.shared-site-chrome.TC-29c rev=1 covers=g10.shared-site-chrome.SC-cmm,g10.shared-site-chrome.SC-80n -->
### shared-ui-site-chrome-US1-TC1-1: External primary-nav link opens a new tab

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** External links

**Pre-conditions:**

* A `Nav` (or `SiteHeader`) is supplied a primary nav item with `external: true`.

**Steps:**

1. Render the header at a wide viewport (primary nav visible).
2. Inspect the primary-nav link attributes.
3. Open the compact menu at 375 CSS pixels and inspect the same link.

**Expected Results:**

* The wide primary-nav link has `target="_blank"` and `rel="noopener noreferrer"`.
* The compact-menu link has the same attributes.

<!-- trace:case id=g10.shared-site-chrome.TC-tyf rev=1 covers=g10.shared-site-chrome.SC-cmm,g10.shared-site-chrome.SC-80n -->
### shared-ui-site-chrome-US1-TC2-1: Same-tab link has no blank target

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** External links

**Pre-conditions:**

* A `Nav` is supplied a link with no `external` flag.

**Steps:**

1. Render the header.
2. Inspect the link attributes.

**Expected Results:**

* The link has no `target="_blank"`.

<!-- trace:case id=g10.shared-site-chrome.TC-vbw rev=1 covers=g10.shared-site-chrome.SC-xvs,g10.shared-site-chrome.SC-rfu,g10.shared-site-chrome.SC-v7l,g10.shared-site-chrome.SC-ff5,g10.shared-site-chrome.SC-7fd,g10.shared-site-chrome.SC-i31,g10.shared-site-chrome.SC-h0z -->
### shared-ui-site-chrome-US1-TC3-1: The shared chrome exports resolve

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Chrome exports

**Pre-conditions:**

* An application imports the shared chrome exports from their public entries.

**Steps:**

1. Import `Nav`, `Footer`, `SiteHeader`, and their named public types.
2. Resolve the imports.

**Expected Results:**

* Every import resolves.

<!-- trace:case id=g10.shared-site-chrome.TC-awm rev=1 covers=g10.shared-site-chrome.SC-xvs,g10.shared-site-chrome.SC-rfu,g10.shared-site-chrome.SC-v7l,g10.shared-site-chrome.SC-ff5,g10.shared-site-chrome.SC-7fd,g10.shared-site-chrome.SC-i31,g10.shared-site-chrome.SC-h0z -->
### shared-ui-site-chrome-US1-TC4-1: Header and footer render independently with supplied copy

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Chrome exports

**Pre-conditions:**

* An application supplies copy to the header and footer.

**Steps:**

1. Render the header without the footer.
2. Render the footer without the header.
3. Inspect the supplied words.

**Expected Results:**

* Each component renders without missing context from the other.
* The supplied copy appears in the component that receives it.

<!-- trace:case id=g10.shared-site-chrome.TC-5t5 rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi -->
### shared-ui-site-chrome-US1-TC5-1: No cart handler leaves no cart control

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* The application supplies no Cart handler.

**Steps:**

1. Render `SiteHeader`.
2. Inspect the trailing controls.

**Expected Results:**

* No Cart control appears.
* No space is reserved for the missing control.

<!-- trace:case id=g10.shared-site-chrome.TC-an4 rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi -->
### shared-ui-site-chrome-US1-TC6-1: Only supplied controls appear

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* The application supplies an account handler and no search or Cart handler.

**Steps:**

1. Render the header.
2. Inspect the account, search, and Cart controls.

**Expected Results:**

* The account control appears.
* Search and Cart do not appear.

<!-- trace:case id=g10.shared-site-chrome.TC-jkg rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi -->
### shared-ui-site-chrome-US1-TC7-1: Language is not a wishlist or currency control

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* The application supplies locale copy and language options.

**Steps:**

1. Render the header.
2. Inspect the controls and locale options.

**Expected Results:**

* No wishlist control appears.
* The locale presents language options and no currency switch.

<!-- trace:case id=g10.shared-site-chrome.TC-aui rev=1 covers=g10.shared-site-chrome.SC-7fd,g10.shared-site-chrome.SC-h0z -->
### shared-ui-site-chrome-US1-TC8-1: Signed-out chrome presents Sign In

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Chrome exports

**Pre-conditions:**

* `SiteHeader` receives a signed-out session and Sign In copy.
* It also receives `onProfile`, `onMyOrders`, and `onMembership` with `copy.membership`.

**Steps:**

1. Render the header.
2. Read the account entry.
3. Read the rest of the header.

**Expected Results:**

* Step 2: a primary Sign In button, no account icon.
* Step 3: no Profile, My Orders or Membership control.

<!-- trace:case id=g10.shared-site-chrome.TC-9d7 rev=2 covers=none -->
### shared-ui-site-chrome-US1-TC9-2: Signed-in chrome presents the account menu

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* `SiteHeader` receives a signed-in session, account destinations, and a My
  Orders handler.

**Steps:**

1. Render the header.
2. Activate the account control.
3. Inspect the menu.

**Expected Results:**

* The account icon appears.
* The menu offers, in order, Profile, My Orders, My Auctions, and Sign out.
* The menu does not offer KYC.

<!-- trace:case id=g10.shared-site-chrome.TC-0xk rev=1 covers=g10.shared-site-chrome.SC-xzm -->
### shared-ui-site-chrome-US1-TC12-1: Activating My Orders invokes its handler

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* `SiteHeader` receives a signed-in session and `onMyOrders`.

**Steps:**

1. Render the header.
2. Click the account control.
3. Click My Orders in the account menu.

**Expected Results:**

* Step 3: the supplied `onMyOrders` handler is invoked exactly once.
* Step 3: no other account-menu handler is invoked.

<!-- trace:case id=g10.shared-site-chrome.TC-lc0 rev=2 covers=g10.shared-site-chrome.SC-xyv -->
### shared-ui-site-chrome-US1-TC13-2: Account menu omits My Orders when its handler is not supplied

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* `SiteHeader` receives a signed-in session, `onProfile`, and no `onMyOrders`.

**Steps:**

1. Render the header.
2. Click the account control.
3. Read the account menu's items.

**Expected Results:**

* Step 3: the menu lists Profile, My Auctions, then Sign Out.
* Step 3: no My Orders item.

<!-- trace:case id=g10.shared-site-chrome.TC-psm rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi -->
### shared-ui-site-chrome-US1-TC10-1: Compact chrome keeps account and reaches language

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* The header has primary items, utility links, and a locale handler at a viewport below the wide breakpoint.

**Steps:**

1. Render the header at 375 CSS pixels wide.
2. Open the menu.
3. Open the language row.

**Expected Results:**

* The drawer lists primary navigation before utility links.
* Language options open in a nested drawer.
* Account / Sign In and Cart remain in the bar when supplied.
* The menu panel leaves a visible gutter.

<!-- trace:case id=g10.shared-site-chrome.TC-jup rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi -->
### shared-ui-site-chrome-US1-TC11-1: Wide chrome keeps navigation in the bar

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* The header is rendered at the wide breakpoint.

**Steps:**

1. Inspect the primary navigation, language, and menu trigger.

**Expected Results:**

* Primary navigation and language appear in the bar.
* The compact menu trigger is absent.

<!-- trace:case id=g10.shared-site-chrome.TC-o41 rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi -->
### shared-ui-site-chrome-US1-TC14-1: Account menu renders only My Auctions and Sign Out with no optional handlers supplied

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* `SiteHeader` receives a signed-in session, `accountEmail`, and no My Orders, Membership, Cart, or Profile handler.

**Steps:**

1. Open the account menu.

**Expected Results:**

* The menu label shows `accountEmail` with its small (xs) initial avatar above the items.
* The menu lists only My Auctions and Sign Out, in that order.

<!-- trace:case id=g10.shared-site-chrome.TC-rkf rev=2 covers=g10.shared-site-chrome.SC-yiu,g10.shared-site-chrome.SC-hhb,g10.shared-site-chrome.SC-cl2 -->
### shared-ui-site-chrome-US1-TC15-2: Account menu orders Profile, My Orders, My Auctions, Membership, then Sign Out when every handler is supplied

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* `SiteHeader` receives a signed-in session, `accountEmail`, `onProfile`, `onMyOrders`, `onMembership` with `copy.membership`, and `onSignOut`.

**Steps:**

1. Render the header.
2. Click the account control.
3. Read the account menu.

**Expected Results:**

* Step 3: a small (`xs`) initial avatar above `accountEmail`, both above the items.
* Step 3: the menu lists Profile, My Orders, My Auctions, Membership, then Sign Out, and nothing else.
* Step 3: the last item reads "Sign Out".
* Step 3: no KYC item.

<!-- trace:case id=g10.shared-site-chrome.TC-mp4 rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi -->
### shared-ui-site-chrome-US1-TC16-1: Membership joins after My Auctions even when My Orders is not supplied

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* `SiteHeader` receives a signed-in session and `onMembership` with `copy.membership`, but no My Orders handler.

**Steps:**

1. Open the account menu.

**Expected Results:**

* Membership appears immediately after My Auctions.
* My Orders does not appear, and Sign Out is the last item.

<!-- trace:case id=g10.shared-site-chrome.TC-y33 rev=2 covers=g10.shared-site-chrome.SC-bzz -->
### shared-ui-site-chrome-US1-TC17-2: Account menu shows the configured label and no avatar when no email is supplied

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* `SiteHeader` receives a signed-in session, no `accountEmail`, and `copy.accountMenuLabel`.

**Steps:**

1. Render the header.
2. Click the account control.
3. Read the top of the account menu.

**Expected Results:**

* Step 3: `copy.accountMenuLabel` shows above the items in place of an email.
* Step 3: no avatar.

<!-- trace:case id=g10.shared-site-chrome.TC-tfo rev=2 covers=g10.shared-site-chrome.SC-oe5 -->
### shared-ui-site-chrome-US1-TC18-2: Activating Membership invokes the supplied handler

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* `SiteHeader` receives a signed-in session and `onMembership` with `copy.membership`.

**Steps:**

1. Render the header.
2. Click the account control.
3. Click Membership in the account menu.

**Expected Results:**

* Step 3: the supplied `onMembership` handler is invoked exactly once.
* Step 3: no other account-menu handler is invoked.

<!-- trace:case id=g10.shared-site-chrome.TC-isx rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi -->
### shared-ui-site-chrome-US1-TC19-1: Membership is omitted without its handler

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* `SiteHeader` receives a signed-in session, a My Orders handler, and no `onMembership` handler.

**Steps:**

1. Open the account menu.

**Expected Results:**

* Membership does not appear in the menu.
* My Orders, My Auctions, and Sign Out remain, in that order.

<!-- trace:case id=g10.shared-site-chrome.TC-ylo rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi -->
### shared-ui-site-chrome-US1-TC20-1: Membership is omitted when its handler is supplied but its copy is not

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* `SiteHeader` receives a signed-in session and an `onMembership` handler with no `copy.membership`.

**Steps:**

1. Open the account menu.

**Expected Results:**

* Membership does not appear in the menu, even though `onMembership` was supplied.

<!-- trace:case id=g10.shared-site-chrome.TC-f8v rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi,g10.shared-site-chrome.SC-6id,g10.shared-site-chrome.SC-szi,g10.shared-site-chrome.SC-1ow,g10.shared-site-chrome.SC-xw7,g10.shared-site-chrome.SC-bc3,g10.shared-site-chrome.SC-92l -->
### shared-ui-site-chrome-US1-TC21-1: A cart slot replaces the built-in control

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* `Nav` receives a cart slot with its own action, and <Cart handler>.

**Test data:**

| `<Cart handler>` |
| --- |
| A Cart handler |
| No Cart handler |

**Steps:**

1. Render `Nav`.
2. Inspect the cart control position.
3. Activate the slot content.

**Expected Results:**

* The slot content appears in the cart control position.
* The built-in cart icon button is not rendered.
* Activating the slot runs only the slot's own action, never a supplied Cart handler.

<!-- trace:case id=g10.shared-site-chrome.TC-6iz rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi,g10.shared-site-chrome.SC-6id,g10.shared-site-chrome.SC-szi,g10.shared-site-chrome.SC-1ow,g10.shared-site-chrome.SC-xw7,g10.shared-site-chrome.SC-bc3,g10.shared-site-chrome.SC-92l -->
### shared-ui-site-chrome-US1-TC22-1: An empty cart hides the count indicator

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* `SiteHeader` receives a Cart handler, `Basket` as its cart label, and <empty count>.

**Test data:**

| `<empty count>` |
| --- |
| A count of 0 |
| No count |

**Steps:**

1. Render the header with <empty count>.
2. Inspect the cart control.

**Expected Results:**

* The Cart control appears.
* No count indicator appears on it.
* The Cart control's accessible name reads `Basket`, with no count.

<!-- trace:case id=g10.shared-site-chrome.TC-1qr rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi,g10.shared-site-chrome.SC-6id,g10.shared-site-chrome.SC-szi,g10.shared-site-chrome.SC-1ow,g10.shared-site-chrome.SC-xw7,g10.shared-site-chrome.SC-bc3,g10.shared-site-chrome.SC-92l -->
### shared-ui-site-chrome-US1-TC23-1: Active cart counts appear in full

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* `SiteHeader` receives a Cart handler, `Basket` as its cart label, and <active-line count>.
* `CartDrawerHeader` receives the same <active-line count>.

**Test data:**

| `<active-line count>` |
| --- |
| 1 |
| 3 |
| 123 |

**Steps:**

1. Render the header and the cart drawer header with <active-line count>.
2. Inspect the count indicator on the cart control.
3. Inspect the drawer title badge.
4. Inspect the `cartSlot` `SiteHeader` hands `Nav`, and the props `NavProps` takes.

**Expected Results:**

* A brand count indicator appears on the Cart control.
* The indicator displays the full <active-line count>.
* The Cart control's accessible name reads `Basket (<active-line count>)`.
* The indicator itself is hidden from assistive technology.
* The drawer title badge displays the same <active-line count>.
* The badged Cart control is the `cartSlot` `Nav` renders, with no built-in cart control beside it.
* `NavProps` takes no cart count.

<!-- trace:case id=g10.shared-site-chrome.TC-uca rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi,g10.shared-site-chrome.SC-6id,g10.shared-site-chrome.SC-szi,g10.shared-site-chrome.SC-1ow,g10.shared-site-chrome.SC-xw7,g10.shared-site-chrome.SC-bc3,g10.shared-site-chrome.SC-92l -->
### shared-ui-site-chrome-US1-TC24-1: A count without a Cart handler adds no Cart control

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* `SiteHeader` receives a count of 3 and no Cart handler.

**Steps:**

1. Render the header.
2. Inspect the header controls.

**Expected Results:**

* No Cart control appears, and no space is reserved for one.
* No count indicator appears in the header.

<!-- trace:case id=g10.shared-site-chrome.TC-thx rev=1 covers=g10.shared-site-chrome.SC-cp9 -->
### shared-ui-site-chrome-US1-TC25-1: Profile is omitted when onProfile is not supplied

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* `SiteHeader` receives a signed-in session, `accountEmail`, `onMyOrders`, `onMembership` with `copy.membership`, and no `onProfile`.

**Steps:**

1. Render the header.
2. Click the account control.
3. Read the account menu's items.

**Expected Results:**

* Step 3: the menu lists My Orders, My Auctions, Membership, then Sign Out.
* Step 3: no Profile item.

<!-- trace:case id=g10.shared-site-chrome.TC-3cf rev=1 covers=g10.shared-site-chrome.SC-bjp -->
### shared-ui-site-chrome-US1-TC26-1: Activating Profile invokes its handler

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* `SiteHeader` receives a signed-in session and `onProfile` with `copy.profile`.

**Steps:**

1. Render the header.
2. Click the account control.
3. Click Profile in the account menu.

**Expected Results:**

* Step 3: the supplied `onProfile` handler is invoked exactly once.
* Step 3: no other account-menu handler is invoked.

<!-- trace:case id=g10.shared-site-chrome.TC-hf6 rev=1 covers=g10.shared-site-chrome.SC-61e -->
### shared-ui-site-chrome-US1-TC27-1: The header takes no second orders item

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Chrome exports

**Pre-conditions:**

* A consuming application renders `SiteHeader` with a signed-in session.

**Steps:**

1. Pass `onOrders` to `SiteHeader`.
2. Add `orders` to its `copy`.
3. Run the application's type check.

**Expected Results:**

* Step 3: `SiteHeaderProps` refuses `onOrders`.
* Step 3: `SiteHeaderCopy` refuses `orders`.

## Raised

* Should external links show a trailing external-link icon?

## Settled

* `external` is optional on `NavLink`; the application supplies it. Behaviour
  applies in primary nav (wide and compact) and utility regions.
* The account menu's fixed item order is Profile, My Orders, My Auctions,
  Membership, Sign Out; each of Profile, My Orders, and Membership is
  independently omitted without a matching handler (Membership also needs
  `copy.membership`), and the menu opens directly on whichever item is next.
* Session-gating (signed out shows Sign In) always overrides handler-gating:
  supplying `onProfile`, `onMyOrders`, and `onMembership` handlers while
  signed out renders none of them.
* The header never offers a wishlist control, even with every other handler
  supplied — already stated by the durable requirement and `TC7-1`.
* The small initial avatar sits above the account label, never beside it.
* My Auctions and Sign Out are the menu's unconditional core; they are never
  themselves handler-gated, unlike Profile, My Orders, and Membership.
* Whether Cart's position relative to the account entry in the bar is
  specified is unrelated to the account menu's own composition.
* `onOrders` ("My Auction Orders") keeps its existing export contract; a
  dedicated account-menu requirement for it is `add-my-auction-orders`'s to
  raise, not this capability's.
* The application supplies the header's cart count; the chrome shows it unchanged and never counts cart lines itself.
* The count shows in full, never capped at `99+`.
* `SiteHeader` takes no second orders item: `SiteHeaderProps` and
  `SiteHeaderCopy` name only the account menu's five items.
* Profile always has its label, because `SiteHeaderCopy` requires `profile`;
  only Membership needs its copy as well as its handler.
* The account entry renders only with its handler or its slot, and
  `SiteHeader` always supplies one: `onSignIn` signed out, the account menu
  signed in.

## Reconciliation

**Run:** 2026-09-18 · the blind suite and the cart-count scenario reading were reconciled against the shared chrome decisions.

**Run:** 2026-10-06, QA2. A fresh reader joined the blind cases and the scenarios on `Header controls`, read against the site-chrome PRD's Cart Count, the decisions, the UI design and `packages/ui/src/blocks/site-chrome/site-header.tsx`. No domain suite sits above `shared/ui`.

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| `shared-ui-site-chrome-SC-22` | Slot replaces the built-in control while `onCartClick` is supplied | Folded: TC21 |
| `shared-ui-site-chrome-SC-23` | TC22 named "no active lines", a host idea; the contract's input is a count of 0 or none | Folded: TC22 takes 0 and omitted as rows |
| `shared-ui-site-chrome-SC-24`, `shared-ui-site-chrome-SC-25`, `shared-ui-site-chrome-SC-26` | The requirement hides the indicator from assistive technology and no scenario or case asserted it | Folded: TC23 asserts it; `shared-ui-site-chrome-SC-24` gains the clause |
| `shared-ui-site-chrome-SC-41` | The requirement hides the count without a Cart handler, and a supplied slot would otherwise put Cart in the header; no scenario or case walked it | Folded: new scenario `shared-ui-site-chrome-SC-41` and new case TC24 |
| `shared-ui-site-chrome-SC-01` to `shared-ui-site-chrome-SC-07`, `shared-ui-site-chrome-SC-19` to `shared-ui-site-chrome-SC-21` | The modified requirements add the cart slot to the props and the handler-or-slot rule; their scenarios are unchanged | Durable TC3 to TC11 hold them; the slot clause is TC21 |
| Q8, the count's meaning | Raised by this pass | Settled above; the site's rule is the page-shell suite's |
| Uncovered anchors | Every `Header controls` scenario this change adds or modifies is reached | None |
| Contradicted readings | No case and scenario disagree | None |

**Run:** 2026-10-06, QA2 second reading. A fresh reader re-joined the four cases and every `Header controls` scenario this change adds or modifies against the Cart Count section, the decisions, the UI design, `packages/ui/src/blocks/site-chrome/site-header.tsx:207` and `packages/design-system/src/components/layout/nav.tsx:327`.

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| `shared-ui-site-chrome-SC-22` | TC21 never activated the slot, so the scenario's last THEN went unasserted; the modified handler rule lets a slot alone put Cart in the bar, and no case walked it | Folded: TC21 activates the slot and takes a Cart handler and none as rows |
| `shared-ui-site-chrome-SC-25` | TC23 claimed the drawer title's count without rendering the drawer header | Folded: TC23 renders `CartDrawerHeader` with the same count and compares its title badge on every row |
| `shared-ui-site-chrome-SC-24`, `shared-ui-site-chrome-SC-26` | The requirement fixes the accessible name as the label then the count in parentheses; TC23 asserted only that it includes the count | Folded: TC23 asserts `Cart (<active-line count>)` |
| TC21, TC22, TC23 | Per-row cases without the per-row line, or with it below the classification | Restyled: the line sits under each title |
| Uncovered anchors | Every scenario this change adds or modifies under `Header controls` is reached | None |
| Contradicted readings | No case and scenario disagree, and none disagrees with the page | None |

**Run:** 2026-10-06, QA2 third reading, after the accept review. A fresh reader re-joined the four cases and the `Header controls` scenarios against the moved Cart slot feature-set line, the handler-or-slot requirement and `packages/design-system/src/components/layout/nav.tsx:327`.

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| `shared-ui-site-chrome-SC-04` | The requirement shows Cart for a slot alone, so "no cart handler" no longer meant no Cart | Revised: the scenario takes neither a cart handler nor a cart slot; durable TC5 still holds it, since `SiteHeader` supplies a slot only with a Cart handler |
| `shared-ui-site-chrome-SC-22` | TC21's no-handler row asserted a slot-only Cart that no scenario stated | Revised: the scenario takes a slot with or without `onCartClick`, and both TC21 rows stand on it |
| TC21 | The last expected result named a Cart handler the no-handler row never supplies | Restyled: the slot never runs a supplied Cart handler |
| Cart slot feature-set line | It now carries the slot rule that left the Handler-gated line to `omit-profile-account-menu` | No case reads a feature-set line |
| Uncovered anchors | Every scenario this change adds or modifies under `Header controls` is reached | None |
| Contradicted readings | No case and scenario disagree, and none disagrees with the page | None |

**Run:** 2026-10-06, QA2 fourth reading. A fresh reader re-joined the four cases and every `Header controls` scenario this change adds or modifies against the Site Header and Footer page, the decisions, the UI design, `packages/ui/src/blocks/site-chrome/site-header.tsx:207` and `packages/design-system/src/components/layout/nav.tsx:327`, and read the Handler-gated line `omit-profile-account-menu` carries.

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| `shared-ui-site-chrome-SC-04` | `SiteHeader` builds its cart slot only with a Cart handler, so durable TC5 still supplies neither | Folded: durable TC5 |
| `shared-ui-site-chrome-SC-22` to `shared-ui-site-chrome-SC-26`, `shared-ui-site-chrome-SC-41` | Each scenario has a case that asserts every THEN, and each case row stands on a scenario | Folded: TC21 to TC24 |
| The page's handler rule | The page showed a control only for a handler, while `Nav` shows account and cart for a slot alone | Corrected: the page names a control of the application's own for account and cart |
| Handler-gated feature-set line | `omit-profile-account-menu` gates cart on its handler and names the account slot alone, against the Cart slot line | Raised: Q11 names the cart slot on that line |
| Uncovered anchors | Every scenario this change adds or modifies under `Header controls` is reached | None |
| Contradicted readings | No case and scenario disagree, and none disagrees with the page | None |

**Run:** 2026-10-06, QA2 fifth reading. A fresh reader re-joined the four cases and every `Header controls` scenario this change adds or modifies against the Site Header and Footer page, the decisions, `packages/ui/src/blocks/site-chrome/site-header.tsx:207-237` and `packages/design-system/src/components/layout/nav.tsx:326-327`, and read the Handler-gated line on `omit-profile-account-menu`'s branch.

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| Handler-gated feature-set line | Q11 said that change's line names the cart slot; it names the account slot alone, so it still says Cart needs its handler | Raised: Q11 restated, and the edit is that change's |
| Story block | Its Walked-by line kept a dash the journeys file no longer carries | Restyled to match the journeys file |
| `shared-ui-site-chrome-SC-04`, `shared-ui-site-chrome-SC-22` to `shared-ui-site-chrome-SC-26`, `shared-ui-site-chrome-SC-41` | Unchanged since the fourth reading | Folded as recorded above |
| Uncovered anchors | Every scenario this change adds or modifies under `Header controls` is reached | None |
| Contradicted readings | No case and scenario disagree, and none disagrees with the page | None |

**Run:** 2026-10-06, after the accept review's third round. The review's fixes were joined to TC23 against the Cart Count section, the decisions and `packages/ui/src/blocks/site-chrome/site-header.tsx:207-237`; a fresh QA2 reading follows.

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| `shared-ui-site-chrome-SC-24` | The requirement passes the badged control through `Nav`'s `cartSlot` and keeps the count off `Nav`; no scenario or case asserted either | Folded: the scenario gains both clauses, and TC23 asserts them on every row |
| `shared-ui-site-chrome-SC-25` | The requirement builds the name from the supplied `copy.cart`; every case supplied `Cart`, the word `site-header.tsx:216-217` invents when it is omitted, so a fallback passed unseen | Folded: the scenario and TC23 supply `Basket` and assert `Basket (<active-line count>)` |
| Handler-gated feature-set line | `omit-profile-account-menu` now names both slots, as Q11 asks | No case reads a feature-set line |
| Uncovered anchors | Every scenario this change adds or modifies under `Header controls` is reached | None |
| Contradicted readings | No case and scenario disagree, and none disagrees with the page | None |

**Run:** 2026-10-06, QA2 sixth reading. A fresh reader re-joined the four cases and every `Header controls` scenario this change adds or modifies against the Cart Count section, the decisions, the UI design, `packages/ui/src/blocks/site-chrome/site-header.tsx:207-237`, `packages/design-system/src/components/layout/nav.tsx:60-77` and the Handler-gated line at `omit-profile-account-menu`'s head.

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| `shared-ui-site-chrome-SC-23` | The requirement names the control by the supplied `copy.cart`; TC22 asserted only that the name carries no count, so the `Cart` fallback passed unseen, as it had on TC23 | Folded: the scenario and TC22 supply `Basket` and assert the name `Basket`, with no count |
| `shared-ui-site-chrome-SC-24`, `shared-ui-site-chrome-SC-25` | TC23 asserts the `cartSlot` hand-off, the bare `NavProps` and `Basket (<active-line count>)` on every row | Folded: TC23 |
| `shared-ui-site-chrome-SC-04`, `shared-ui-site-chrome-SC-22`, `shared-ui-site-chrome-SC-26`, `shared-ui-site-chrome-SC-41` | Unchanged since the fifth reading | Folded as recorded above |
| Handler-gated feature-set line | `omit-profile-account-menu` names both slots, as Q11 records | No case reads a feature-set line |
| Uncovered anchors | Every scenario this change adds or modifies under `Header controls` is reached | None |
| Contradicted readings | No case and scenario disagree, and none disagrees with the page | None |

**Run:** QA1 blind pass, 2026-10-06, for `omit-profile-account-menu`, `shared/ui/site-chrome`. It wrote US1-TC25 and US1-TC26 and raised two questions, now rows of `decisions.md`'s `## Raised` table. It left no statement of what it read and was denied, so none is claimed here.

**Run:** QA2 reconciliation, 2026-10-06. The blind cases were joined to the modified requirement's scenarios on `Header controls`. It moves `shared-ui-site-chrome-SC-39` and `shared-ui-site-chrome-SC-17`; the rest are carried word for word. `shared-ui-site-chrome-SC-17` and `shared-ui-site-chrome-SC-29` leave `**Out of suite:**`, because the page-shell cases that walked them changed.

**Run:** QA2 reconciliation rerun, 2026-10-06. It joined the two cases the first QA2 run left out of the table, US1-TC8 and US1-TC27, and folded the second as a scenario.

**Run:** QA2 reconciliation, third run, 2026-10-06, after US1-TC8's marker was narrowed to the two Chrome exports scenarios it walks. Every Header controls scenario the old marker named is still covered by a durable case under that group, US1-TC5 to US1-TC20, so nothing is left uncovered. No disposition moved.

**Run:** QA2 reconciliation, fourth run, 2026-10-06, after the acceptance review's third round. The durable Settled line "`onOrders` ("My Auction Orders") keeps its existing export contract ..." is now false, and acceptance strikes it by hand, because the fold has no rule that removes one. `## Settled` records Q8, Q9 and Q11. No case or scenario moved.

**Run:** QA2 reconciliation, fifth run, 2026-10-06, after the delta's feature set kept only the Handler-gated and Account menu lines (Q12). `Chrome exports` and `Header controls` still resolve from the durable feature set, so every case keeps its trace. `shared-ui-site-chrome-SC-17` and `shared-ui-site-chrome-SC-29` now serve `Header controls`, and no case moved.

**Run:** QA2 reconciliation, sixth run, 2026-10-06, after the acceptance review's fourth round. The Handler-gated line names the cart slot beside the account slot, as `Nav` shows Cart for a supplied slot with no handler (Q12). `Header controls` did not move, and every case and scenario was joined again; no disposition moved.

**Run:** QA2 reconciliation, seventh run, 2026-10-06, in a fresh context. It joined the durable cases of the modified requirement as well as this suite's. Two had drifted from it: `shared-ui-site-chrome-US1-TC9-1` still read "Sign out" and walked nothing the other cases do not, so it retires; `shared-ui-site-chrome-US1-TC12-1` walked the My Orders handler, which the requirement now states only as "each item", so it folds as `shared-ui-site-chrome-SC-43`. `shared-ui-site-chrome-SC-34` leaves `**Out of suite:**`. No anchor moved.

**Run:** QA2 reconciliation, eighth run, 2026-10-07, after the acceptance review's fifth round. The durable Settled line "The small initial avatar sits above the account label, never beside it." now settles an avatar shown with `copy.accountMenuLabel`, the look Q6 holds open, so acceptance strikes it by hand and `## Settled` places the avatar above the sign-in email. No case or scenario moved.

**Applied:** 2026-10-07, the interim answers to Q6 and the acceptance review's avatar finding; not a QA2 reading, which reruns on them. The requirement places the avatar above `accountEmail` and shows the label alone with no avatar when no email is supplied, so `shared-ui-site-chrome-SC-34` and `shared-ui-site-chrome-SC-35` move to revision 2, `shared-ui-site-chrome-US1-TC17-2` joins this suite, and `## Settled` drops its avatar line.

**Run:** QA2 reconciliation, ninth run, 2026-10-07, in a fresh context, on the interim answer to Q6. Every scenario of the modified requirement was joined to this suite's cases and the durable `Chrome exports` and `Header controls` cases, and `SiteHeader` was read at `packages/ui/src/blocks/site-chrome/site-header.tsx:165-177`: the avatar sits above `accountEmail`, and with no email the label shows alone. No disposition moved.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `shared-ui-site-chrome-US1-TC25-1` | Reached | `shared-ui-site-chrome-SC-30`: no `onProfile`, the menu opens on My Orders; its Membership result agrees with `shared-ui-site-chrome-SC-38` |
| `shared-ui-site-chrome-US1-TC26-1` | Reached | `shared-ui-site-chrome-SC-32` |
| `shared-ui-site-chrome-US1-TC18-2` | Rewritten, bumped | `shared-ui-site-chrome-SC-39` dropped its withheld-address line: `SiteHeader` never routes, and **No application state** already says so. The case drops its no-navigation result and takes the scenario's "no other handler" result |
| Raised: Profile without `copy.profile` | Landed as Q8, settled | `SiteHeaderCopy` requires `profile`, so Profile always has its label; only Membership's copy is optional, which is why only Membership names both |
| Raised: the account entry in the handler-gated line | Landed as Q9, settled | `Nav` shows its account control only with a handler or an account slot, and `SiteHeader` always supplies one. The feature set keeps account in the line; the proposal's line now names it too |
| `shared-ui-site-chrome-US1-TC13-2` | Rewritten, bumped | `shared-ui-site-chrome-SC-29` was out of suite, walked by page-shell `US3-TC6-1`, which now walks a menu with no Profile and so no longer proves it. The case supplies `onProfile`, as the scenario does, and now traces it |
| `shared-ui-site-chrome-US1-TC15-2` | Rewritten, bumped | `shared-ui-site-chrome-SC-17` was out of suite, walked by page-shell `US3-TC7-1`, which this change rewrote without Profile or Membership. The case already supplied every handler; it adds `accountEmail` and the email, KYC and "no other item" results, and now traces it with `shared-ui-site-chrome-SC-37` |
| `**Out of suite:**` | Emptied | `shared-ui-site-chrome-US1-TC15-2` asserts `accountEmail` with its `xs` avatar above the items, which is `shared-ui-site-chrome-SC-34`, so the scenario is walked in this suite and its marker names it. The line reads `none.` so the fold replaces the durable list of three, all now traced here |
| `shared-ui-site-chrome-US1-TC8-1` | Reached, result joined | `shared-ui-site-chrome-SC-16` and `shared-ui-site-chrome-SC-33`: no case asserted that a signed-out header ignores the Profile, My Orders and Membership handlers, so the result joined this case on the same run and its version stands. It leaves the smoke suite, which `shared-ui-site-chrome-US1-TC15-2` holds for the journey. Both scenarios serve Chrome exports, so the case traces that group and its marker covers those two alone; every Header controls scenario its old marker named stays covered by its own cases |
| `shared-ui-site-chrome-US1-TC27-1` | Case added, folded as a scenario | The requirement says `SiteHeaderProps` and `SiteHeaderCopy` take no second orders item, and no scenario stated it: `shared-ui-site-chrome-SC-17` proves the rendered menu, not the types. Folded as `shared-ui-site-chrome-SC-42`, which this case walks and task 1.1 tests |
| `shared-ui-site-chrome-SC-17` | Bumped | It adds "and no other item": `SiteHeader` drops its second orders item, so the account menu's five items are the whole set |
| `shared-ui-site-chrome-SC-17`, `shared-ui-site-chrome-SC-29` | Re-anchored to `Header controls` | Each served `grade10-site-site-page-shell-US-03`, the menu a collector meets on the site, which offers no Membership until a later change does (Q5). `shared-ui-site-chrome-SC-17` supplies every handler, Membership included, which no site supplies; `shared-ui-site-chrome-SC-29` shows Profile with no My Orders, which no lane reaches, since none carries the account page and withholds Store. Both are the header's fixed order, which `shared-ui-site-chrome-US1-TC15-2` and `shared-ui-site-chrome-US1-TC13-2` walk under `Header controls` |
| `shared-ui-site-chrome-US1-TC9-2` | Retired, `deprecated`, bumped | A durable case of the modified requirement: it expects "Sign out", which `shared-ui-site-chrome-SC-37` refutes, and its menu is the fixed order with no Membership, walked by `shared-ui-site-chrome-US1-TC15-2` and `shared-ui-site-chrome-US1-TC19-1`. Its marker covers none. `shared-ui-site-chrome-US1-TC15-2` keeps the smoke suite |
| `shared-ui-site-chrome-US1-TC12-1` | Folded as a scenario | The requirement dropped its sentence "Activating My Orders SHALL invoke its matching handler" for "Activating each item SHALL invoke the matching supplied handler", and no scenario stated the My Orders half, while Profile and Membership each have one. Folded as `shared-ui-site-chrome-SC-43`, which this case walks and task 1.1 tests; its precondition names `onMyOrders`, its version stands |
| Settled: the avatar above the account label | Retracted, moved to the requirement | This change names `copy.accountMenuLabel` the account label (Q14), and with that label the menu shows no avatar (Q6), so the durable line "The small initial avatar sits above the account label, never beside it." is false. Acceptance strikes the line by hand, because the fold has no rule that removes a Settled line. The requirement and `shared-ui-site-chrome-SC-34` place the avatar above `accountEmail` |
| `shared-ui-site-chrome-SC-34` | Bumped | It said the avatar sits with `accountEmail` above the items; it now says the avatar sits above `accountEmail`, as the page and `site-header.tsx:165-177` do. `shared-ui-site-chrome-US1-TC15-2` asserts that order |
| `shared-ui-site-chrome-SC-35`, `shared-ui-site-chrome-US1-TC17-2` | Bumped; case carried from the durable suite | With no email the menu shows the label alone and no avatar (Q6). The durable `shared-ui-site-chrome-US1-TC17-1` asserted the label only, so it is carried here with the no-avatar result, and its marker narrows to the scenario it walks |
| Contradictions | None | Where a case and a scenario state the same behaviour they agree |
