# shared/ui/site-chrome Test Cases

**Status:** in-review
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

* Step 3: `accountEmail` shows with its small (`xs`) initial avatar above the items.
* Step 3: the menu lists Profile, My Orders, My Auctions, Membership, then Sign Out, and nothing else.
* Step 3: the last item reads "Sign Out".
* Step 3: no KYC item.

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

## Settled

* `SiteHeader` takes no second orders item: `SiteHeaderProps` and
  `SiteHeaderCopy` name only the account menu's five items.
* Profile always has its label, because `SiteHeaderCopy` requires `profile`;
  only Membership needs its copy as well as its handler.
* The account entry renders only with its handler or its slot, and
  `SiteHeader` always supplies one: `onSignIn` signed out, the account menu
  signed in.

## REMOVED Settled

* `onOrders` ("My Auction Orders") keeps its existing export contract; a
  dedicated account-menu requirement for it is `add-my-auction-orders`'s to
  raise, not this capability's.

## Reconciliation

**Run:** QA1 blind pass, 2026-10-06, for `omit-profile-account-menu`, `shared/ui/site-chrome`. It wrote US1-TC25 and US1-TC26 and raised two questions, now rows of `decisions.md`'s `## Raised` table. It left no statement of what it read and was denied, so none is claimed here.

**Run:** QA2 reconciliation, 2026-10-06. The blind cases were joined to the modified requirement's scenarios on `Header controls`. It moves `shared-ui-site-chrome-SC-39` and `shared-ui-site-chrome-SC-17`; the rest are carried word for word. `shared-ui-site-chrome-SC-17` and `shared-ui-site-chrome-SC-29` leave `**Out of suite:**`, because the page-shell cases that walked them changed.

**Run:** QA2 reconciliation rerun, 2026-10-06. It joined the two cases the first QA2 run left out of the table, US1-TC8 and US1-TC27, and folded the second as a scenario.

**Run:** QA2 reconciliation, third run, 2026-10-06, after US1-TC8's marker was narrowed to the two Chrome exports scenarios it walks. Every Header controls scenario the old marker named is still covered by a durable case under that group, US1-TC5 to US1-TC20, so nothing is left uncovered. No disposition moved.

**Run:** QA2 reconciliation, fourth run, 2026-10-06, after the acceptance review's third round. `## REMOVED Settled` retracts the durable line that kept `onOrders`, and `## Settled` records Q8, Q9 and Q11. No case or scenario moved.

**Run:** QA2 reconciliation, fifth run, 2026-10-06, after the delta's feature set kept only the Handler-gated and Account menu lines (Q12). `Chrome exports` and `Header controls` still resolve from the durable feature set, so every case keeps its trace. `shared-ui-site-chrome-SC-17` and `shared-ui-site-chrome-SC-29` now serve `Header controls`, and no case moved.

**Run:** QA2 reconciliation, sixth run, 2026-10-06, after the acceptance review's fourth round. The Handler-gated line names the cart slot beside the account slot, as `Nav` shows Cart for a supplied slot with no handler (Q12). `Header controls` did not move, and every case and scenario was joined again; no disposition moved.

**Run:** QA2 reconciliation, seventh run, 2026-10-06, in a fresh context. It joined the durable cases of the modified requirement as well as this suite's. Two had drifted from it: `shared-ui-site-chrome-US1-TC9-1` still read "Sign out" and walked nothing the other cases do not, so it retires; `shared-ui-site-chrome-US1-TC12-1` walked the My Orders handler, which the requirement now states only as "each item", so it folds as `shared-ui-site-chrome-SC-43`. `shared-ui-site-chrome-SC-34` leaves `**Out of suite:**`. No anchor moved.

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
| `shared-ui-site-chrome-SC-17`, `shared-ui-site-chrome-SC-29` | Re-anchored to `Header controls` | Each served `grade10-site-site-page-shell-US-03`, which names neither Profile nor Membership and holds both open (Q1, Q5). `shared-ui-site-chrome-SC-17` supplies every handler, Membership included, which no site supplies; `shared-ui-site-chrome-SC-29` shows Profile with no My Orders, which no lane reaches, since none carries the account page and withholds Store. Both are the header's fixed order, which `shared-ui-site-chrome-US1-TC15-2` and `shared-ui-site-chrome-US1-TC13-2` walk under `Header controls` |
| `shared-ui-site-chrome-US1-TC9-2` | Retired, `deprecated`, bumped | A durable case of the modified requirement: it expects "Sign out", which `shared-ui-site-chrome-SC-37` refutes, and its menu is the fixed order with no Membership, walked by `shared-ui-site-chrome-US1-TC15-2` and `shared-ui-site-chrome-US1-TC19-1`. Its marker covers none. `shared-ui-site-chrome-US1-TC15-2` keeps the smoke suite |
| `shared-ui-site-chrome-US1-TC12-1` | Folded as a scenario | The requirement dropped its sentence "Activating My Orders SHALL invoke its matching handler" for "Activating each item SHALL invoke the matching supplied handler", and no scenario stated the My Orders half, while Profile and Membership each have one. Folded as `shared-ui-site-chrome-SC-43`, which this case walks and task 1.1 tests; its precondition names `onMyOrders`, its version stands |
| Contradictions | None | Where a case and a scenario state the same behaviour they agree |

