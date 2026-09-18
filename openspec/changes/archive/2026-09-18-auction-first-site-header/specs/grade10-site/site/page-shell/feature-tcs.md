# grade10-site/site/page-shell Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## grade10-site-site-page-shell-US1: Collector opens any surface inside the site shell

**As a** collector,
**I want** every address the site answers to render its surface between the
header and the footer, at the width I browse at,
**so that** I get the site around whatever I opened, and never a surface that
shipped without it.

### grade10-site-site-page-shell-US1-TC1-1: A compact surface keeps its shell and navigation reachable

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
**I want** Sign In when I am signed out, and an account menu of Profile, My
Auctions, and Sign out when I am signed in,
**so that** one place in the header takes me where I can go for this launch.

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

* A collector is signed in on an answered site surface.

**Steps:**

1. Activate the account control.
2. Inspect the menu.

**Expected Results:**

* The menu offers Profile, My Auctions, and Sign out.
* The menu does not offer Orders or KYC.

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

### grade10-site-site-page-shell-US4-TC2-1: Cart becomes global when Store answers

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

### grade10-site-site-page-shell-US5-TC1-1: Navigation marks only the owning surface

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-05

**Pre-conditions:**

* The header has navigation items and the current address is <address state>.

**Test data:**

| `<address state>` |
| --- |
| Owned by one navigation item |
| Owned by none of the navigation items |

**Steps:**

1. Render the header at <address state>.
2. Inspect the navigation items.

**Expected Results:**

* The owning item is marked and announced as current when <address state> is owned.
* No item is marked as current when <address state> is owned by none.

## Reconciliation

**Run:** 2026-09-18 · the blind suite and the page-shell scenario reading were reconciled against the auction-first decisions.

| Spec scenario or anchor | Suite coverage |
| --- | --- |
| grade10-site-site-page-shell-SC-17 | US3-TC2-1 |
| grade10-site-site-page-shell-SC-18 | US3-TC3-1 |
| grade10-site-site-page-shell-SC-20 | US1-TC1-1 |
| grade10-site-site-page-shell-SC-04, SC-05 | US2-TC1-1, US2-TC2-1 |
| grade10-site-site-page-shell-SC-06, SC-07, SC-08 | US3-TC2-1, US3-TC1-1, US3-TC3-1 |
| grade10-site-site-page-shell-SC-09, SC-16, SC-19 | US4-TC1-1, US4-TC2-1 |
| grade10-site-site-page-shell-US-05 | US5-TC1-1; no scenario was added by this delta |
| Uncovered anchors | none |
| Contradicted readings | none |
