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
