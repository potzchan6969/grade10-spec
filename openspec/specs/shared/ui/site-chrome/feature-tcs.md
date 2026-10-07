# shared/ui/site-chrome Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-21, tcs-rules r3.0

**Out of suite:** shared-ui-site-chrome-SC-17, shared-ui-site-chrome-SC-29, shared-ui-site-chrome-SC-34 — walked by `grade10-site/site/page-shell`'s suite (`TC7-1`, `TC6-1`, `TC9-1`)

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

<!-- trace:case id=g10.shared-site-chrome.TC-aui rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi -->
### shared-ui-site-chrome-US1-TC8-1: Signed-out chrome presents Sign In

**Classification:**

* **Severity:** major
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

* `SiteHeader` receives a signed-out session and Sign In copy.

**Steps:**

1. Render the header.
2. Inspect the account entry.

**Expected Results:**

* A primary Sign In button appears.
* No account icon control appears.

<!-- trace:case id=g10.shared-site-chrome.TC-9d7 rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi -->
### shared-ui-site-chrome-US1-TC9-1: Signed-in chrome presents the account menu

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

<!-- trace:case id=g10.shared-site-chrome.TC-0xk rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi -->
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

* `SiteHeader` receives a signed-in session, account destinations, and a My
  Orders handler.

**Steps:**

1. Render the header.
2. Activate the account control.
3. Activate My Orders in the menu.

**Expected Results:**

* The supplied My Orders handler is invoked exactly once.
* No other account-menu handler is invoked.

<!-- trace:case id=g10.shared-site-chrome.TC-lc0 rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi -->
### shared-ui-site-chrome-US1-TC13-1: Account menu omits My Orders when its handler is not supplied

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* `SiteHeader` receives a signed-in session and no My Orders handler.

**Steps:**

1. Render the header.
2. Activate the account control.
3. Inspect the menu.

**Expected Results:**

* The menu offers Profile, My Auctions, and Sign out.
* The menu does not offer My Orders.

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

<!-- trace:case id=g10.shared-site-chrome.TC-rkf rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi -->
### shared-ui-site-chrome-US1-TC15-1: Account menu orders Profile, My Orders, My Auctions, Membership, then Sign Out when every handler is supplied

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

* `SiteHeader` receives a signed-in session and `onProfile`, `onMyOrders`, `onMembership` with `copy.membership`, and `onSignOut` handlers.

**Steps:**

1. Open the account menu.

**Expected Results:**

* The items appear in the order Profile, My Orders, My Auctions, Membership, Sign Out.
* The last item reads "Sign Out" in Title Case.

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

<!-- trace:case id=g10.shared-site-chrome.TC-y33 rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi -->
### shared-ui-site-chrome-US1-TC17-1: Account menu label falls back to the configured copy when no email is supplied

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

1. Open the account menu.

**Expected Results:**

* The menu label shows `copy.accountMenuLabel` instead of an email.

<!-- trace:case id=g10.shared-site-chrome.TC-tfo rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi -->
### shared-ui-site-chrome-US1-TC18-1: Activating Membership invokes the supplied handler without a withheld route

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

1. Open the account menu.
2. Activate Membership.

**Expected Results:**

* The supplied `onMembership` handler is invoked exactly once.
* No navigation to a membership address occurs.

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
