# shared/ui/site-chrome Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

**Out of suite:** shared-ui-site-chrome-SC-34 — walked by `grade10-site/site/page-shell`'s suite (`US3-TC6-1`, `US3-TC7-2`)

## shared-ui-site-chrome-US1: Shared chrome contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/site/page-shell`, which composes the header and footer
**As an** application composing the shared chrome,
**I want** the chrome to expose only the controls I have answered, keep
off-site destinations safely scoped, and present one truthful, session-aware
header for any brand,
**so that** every product surface can render a correct header without
reimplementing its behavior.

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

<!-- trace:case id=g10.shared-site-chrome.TC-thx rev=1 covers=g10.shared-site-chrome.SC-cp9 -->
### shared-ui-site-chrome-US1-TC21-1: Profile is omitted when onProfile is not supplied

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
### shared-ui-site-chrome-US1-TC22-1: Activating Profile invokes its handler

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

<!-- trace:case id=g10.shared-site-chrome.TC-rkf rev=2 covers=g10.shared-site-chrome.SC-yiu,g10.shared-site-chrome.SC-cl2 -->
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

* Step 3: `accountEmail` shows with its small (`xs`) initial avatar above the items.
* Step 3: the menu lists Profile, My Orders, My Auctions, Membership, then Sign Out, and nothing else.
* Step 3: the last item reads "Sign Out".
* Step 3: no KYC item.

<!-- trace:case id=g10.shared-site-chrome.TC-aui rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi -->
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
* **Trace:** Header controls

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

<!-- trace:case id=g10.shared-site-chrome.TC-hf6 rev=1 covers=g10.shared-site-chrome.SC-61e -->
### shared-ui-site-chrome-US1-TC23-1: The header takes no second orders item

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

## Reconciliation

**Run:** QA1 blind pass, 2026-10-06, for `omit-profile-account-menu`, `shared/ui/site-chrome`. It wrote US1-TC21 and US1-TC22 and raised two questions, now rows of `decisions.md`'s `## Raised` table. It left no statement of what it read and was denied, so none is claimed here.

**Run:** QA2 reconciliation, 2026-10-06. The blind cases were joined to the modified requirement's scenarios on `Header controls`. It moves `shared-ui-site-chrome-SC-39` and `shared-ui-site-chrome-SC-17`; the rest are carried word for word. `shared-ui-site-chrome-SC-17` and `shared-ui-site-chrome-SC-29` leave `**Out of suite:**`, because the page-shell cases that walked them changed.

**Run:** QA2 reconciliation rerun, 2026-10-06. It joined the two cases the first QA2 run left out of the table, US1-TC8 and US1-TC23, and folded the second as a scenario.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `shared-ui-site-chrome-US1-TC21-1` | Reached | `shared-ui-site-chrome-SC-30`: no `onProfile`, the menu opens on My Orders; its Membership result agrees with `shared-ui-site-chrome-SC-38` |
| `shared-ui-site-chrome-US1-TC22-1` | Reached | `shared-ui-site-chrome-SC-32` |
| `shared-ui-site-chrome-US1-TC18-2` | Rewritten, bumped | `shared-ui-site-chrome-SC-39` dropped its withheld-address line: `SiteHeader` never routes, and **No application state** already says so. The case drops its no-navigation result and takes the scenario's "no other handler" result |
| Raised: Profile without `copy.profile` | Landed as Q8, settled | `SiteHeaderCopy` requires `profile`, so Profile always has its label; only Membership's copy is optional, which is why only Membership names both |
| Raised: the account entry in the handler-gated line | Landed as Q9, settled | `Nav` shows its account control only with a handler or an account slot, and `SiteHeader` always supplies one. The feature set keeps account in the line; the proposal's line now names it too |
| `shared-ui-site-chrome-US1-TC13-2` | Rewritten, bumped | `shared-ui-site-chrome-SC-29` was out of suite, walked by page-shell `US3-TC6-1`, which now walks a menu with no Profile and so no longer proves it. The case supplies `onProfile`, as the scenario does, and now traces it |
| `shared-ui-site-chrome-US1-TC15-2` | Rewritten, bumped | `shared-ui-site-chrome-SC-17` was out of suite, walked by page-shell `US3-TC7-1`, which this change rewrote without Profile or Membership. The case already supplied every handler; it adds `accountEmail` and the email, KYC and "no other item" results, and now traces it with `shared-ui-site-chrome-SC-37` |
| `**Out of suite:**` | Rewritten | Only `shared-ui-site-chrome-SC-34` stays out, walked by page-shell `US3-TC6-1` and `US3-TC7-2`, which both assert the email with its small initial avatar |
| `shared-ui-site-chrome-US1-TC8-1` | Reached, result joined | `shared-ui-site-chrome-SC-16` and `shared-ui-site-chrome-SC-33`: no case asserted that a signed-out header ignores the Profile, My Orders and Membership handlers, so the result joined this case on the same run and its version stands. It leaves the smoke suite, which `shared-ui-site-chrome-US1-TC15-2` holds for the journey |
| `shared-ui-site-chrome-US1-TC23-1` | Case added, folded as a scenario | The requirement says `SiteHeaderProps` and `SiteHeaderCopy` take no second orders item, and no scenario stated it: `shared-ui-site-chrome-SC-17` proves the rendered menu, not the types. Folded as `shared-ui-site-chrome-SC-41`, which this case walks and task 1.1 tests |
| `shared-ui-site-chrome-SC-17` | Bumped | It adds "and no other item": `SiteHeader` drops its second orders item, so the account menu's five items are the whole set |
| Contradictions | None | Where a case and a scenario state the same behaviour they agree |

