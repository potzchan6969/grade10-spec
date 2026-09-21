# shared/ui/site-chrome Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## shared-ui-site-chrome-US1: Shared chrome contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/site/page-shell`, which composes the header and footer
**As an** application composing the shared chrome,
**I want** the chrome to expose only the controls I have answered, keep
off-site destinations safely scoped, and present one truthful, session-aware
header for any brand,
**so that** every product surface can render a correct header without
reimplementing its behavior.

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

### shared-ui-site-chrome-US1-TC15-1: Activating Profile invokes its handler

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

* `SiteHeader` receives a signed-in session, account destinations, and a
  Profile handler.

**Steps:**

1. Render the header.
2. Activate the account control.
3. Activate Profile in the menu.

**Expected Results:**

* The supplied Profile handler is invoked exactly once.
* No other account-menu handler is invoked.

### shared-ui-site-chrome-US1-TC18-1: Signed-out session shows Sign In despite Profile and My Orders handlers

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
* **Trace:** Header controls

**Pre-conditions:**

* `SiteHeader` receives a signed-out session, a Profile handler, and a My
  Orders handler.

**Steps:**

1. Render the header.
2. Inspect the account entry.

**Expected Results:**

* A primary Sign In button appears.
* No account icon control, Profile, or My Orders appears.

## Reconciliation

**Run:** hide-profile-until-launch, 2026-09-21. Scenario pass read the durable requirements plus this change's journeys, decisions and the linked PRD; blind suite pass read only the isolated input (this change's Purpose/Feature set, journeys, decisions.md, the linked PRD, and the durable `feature-tcs.md` for id continuity with `## Reconciliation` stripped) — no `## Requirements` section, no archive.

- **Folded in as scenarios:** `TC15-1` → `SC-32` (activating Profile invokes its handler — real behaviour the scenario pass's own edits to `SC-17`/`SC-29` implied but never stated as its own scenario). `TC18-1` → `SC-33` (signed-out ignores both handlers — a genuine gap: the scenario pass edited `SC-17` and `SC-29` for the signed-in branch but never re-asserted that session-gating still overrides handler-gating entirely when signed out).
- **Already covered, no new scenario:** `TC14-1` matches `SC-30`; `TC16-1` matches `SC-31`; `TC17-1` matches the edited `SC-29`. All three converged independently with the scenario pass, which is the cross-check working as intended rather than a gap.
- **Pre-existing, unrelated to this change:** the durable file's own `## Raised` question ("Should external links show a trailing external-link icon?") was already answered by the `## Settled` facts beside it — `external` already ships as an optional `NavLink` prop, in production, per the Feature set's "External links" group. Folded into `## Settled` below rather than left as an open row, since a change carrying its own `decisions.md` may not also carry a suite-level `## Raised`.

## Settled

- The account menu's fixed item order is Profile, My Orders, My Auctions, Sign out; each of Profile and My Orders is independently omitted without a matching handler, and the menu opens directly on whichever item is next.
- Session-gating (signed out shows Sign In) always overrides handler-gating: supplying `onProfile` and `onMyOrders` handlers while signed out renders neither.
- `external` is optional on `NavLink`; the application supplies it. Behaviour applies in primary nav (wide and compact) and utility regions.
