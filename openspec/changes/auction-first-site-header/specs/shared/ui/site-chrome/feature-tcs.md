# shared/ui/site-chrome Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## shared-ui-site-chrome-US1: Shared auction-first chrome contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/site/page-shell`, which composes the header and footer
**As an** application composing the shared chrome,
**I want** the auction-first header contract to expose only answered controls,
**so that** every product surface can render one truthful header.

### shared-ui-site-chrome-US1-TC1-1: The shared chrome exports resolve

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

### shared-ui-site-chrome-US1-TC2-1: Header and footer render independently with supplied copy

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

### shared-ui-site-chrome-US1-TC3-1: No cart handler leaves no cart control

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

### shared-ui-site-chrome-US1-TC4-1: Only supplied controls appear

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

### shared-ui-site-chrome-US1-TC5-1: Language is not a wishlist or currency control

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

### shared-ui-site-chrome-US1-TC6-1: Signed-out chrome presents Sign In

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

### shared-ui-site-chrome-US1-TC7-1: Signed-in chrome presents the auction account menu

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

* `SiteHeader` receives a signed-in session and account destinations.

**Steps:**

1. Render the header.
2. Activate the account control.
3. Inspect the menu.

**Expected Results:**

* The account icon appears.
* The menu offers Profile, My Auctions, and Sign out.
* The menu does not offer Orders or KYC.

### shared-ui-site-chrome-US1-TC8-1: Compact chrome keeps account and reaches language

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

### shared-ui-site-chrome-US1-TC9-1: Wide chrome keeps navigation in the bar

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

## Reconciliation

**Run:** 2026-09-18 · the blind suite and the shared chrome scenario reading were reconciled against the auction-first decisions.

| Spec scenario or anchor | Suite coverage |
| --- | --- |
| shared-ui-site-chrome-SC-01, SC-15 | US1-TC1-1 |
| shared-ui-site-chrome-SC-02, SC-03 | US1-TC2-1 |
| shared-ui-site-chrome-SC-04, SC-18 | US1-TC3-1 |
| shared-ui-site-chrome-SC-05 | US1-TC4-1 |
| shared-ui-site-chrome-SC-06, SC-07 | US1-TC5-1 |
| shared-ui-site-chrome-SC-16, SC-19 | US1-TC6-1 |
| shared-ui-site-chrome-SC-17 | US1-TC7-1 |
| shared-ui-site-chrome-SC-20 | US1-TC8-1 |
| shared-ui-site-chrome-SC-21 | US1-TC9-1 |
| Uncovered anchors | none |
| Contradicted readings | none |
