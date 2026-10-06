# shared/ui/site-chrome Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## shared-ui-site-chrome-US1: Cart count chrome contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/site/page-shell`, which composes the header and footer
**As an** application composing the shared chrome,
**I want** the cart control to carry the supplied active-line count,
**so that** the header and cart drawer show the same count.

<!-- trace:case id=g10.shared-site-chrome.TC-f8v rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi,g10.shared-site-chrome.SC-6id,g10.shared-site-chrome.SC-szi,g10.shared-site-chrome.SC-1ow,g10.shared-site-chrome.SC-xw7,g10.shared-site-chrome.SC-bc3 -->
### shared-ui-site-chrome-US1-TC21-1: A cart slot replaces the built-in control

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

* `Nav` receives a cart slot and a Cart handler.

**Steps:**

1. Render `Nav` with the cart slot and Cart handler.
2. Inspect the cart control position.

**Expected Results:**

* The slot content appears in the cart control position.
* The built-in cart icon button is not rendered.

<!-- trace:case id=g10.shared-site-chrome.TC-6iz rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi,g10.shared-site-chrome.SC-6id,g10.shared-site-chrome.SC-szi,g10.shared-site-chrome.SC-1ow,g10.shared-site-chrome.SC-xw7,g10.shared-site-chrome.SC-bc3 -->
### shared-ui-site-chrome-US1-TC22-1: An empty cart hides the count indicator

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

* `SiteHeader` receives a Cart handler and no active cart lines.

**Steps:**

1. Render the header.
2. Inspect the cart control.

**Expected Results:**

* The Cart control appears.
* No count indicator appears on it.

<!-- trace:case id=g10.shared-site-chrome.TC-1qr rev=1 covers=g10.shared-site-chrome.SC-5a2,g10.shared-site-chrome.SC-at6,g10.shared-site-chrome.SC-aq6,g10.shared-site-chrome.SC-dti,g10.shared-site-chrome.SC-bv8,g10.shared-site-chrome.SC-cp9,g10.shared-site-chrome.SC-y8d,g10.shared-site-chrome.SC-bjp,g10.shared-site-chrome.SC-bzz,g10.shared-site-chrome.SC-agk,g10.shared-site-chrome.SC-cl2,g10.shared-site-chrome.SC-w7p,g10.shared-site-chrome.SC-oe5,g10.shared-site-chrome.SC-0eb,g10.shared-site-chrome.SC-79u,g10.shared-site-chrome.SC-ebi,g10.shared-site-chrome.SC-6id,g10.shared-site-chrome.SC-szi,g10.shared-site-chrome.SC-1ow,g10.shared-site-chrome.SC-xw7,g10.shared-site-chrome.SC-bc3 -->
### shared-ui-site-chrome-US1-TC23-1: Active cart counts appear in full

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

* `SiteHeader` receives a Cart handler and <active-line count>.

**Test data:**

| `<active-line count>` |
| --- |
| 1 |
| 3 |
| 12 |

**Steps:**

1. Render the header with <active-line count>.
2. Inspect the count indicator on the cart control.

**Expected Results:**

* A brand count indicator appears for each positive count.
* The indicator displays the full <active-line count>.
* The count for 3 is the same active-line count the cart drawer title uses.

## Reconciliation

**Run:** 2026-09-18 · the blind suite and the cart-count scenario reading were reconciled against the shared chrome decisions.

| Spec scenario or anchor | Suite coverage |
| --- | --- |
| shared-ui-site-chrome-SC-22 | US1-TC1-1 |
| shared-ui-site-chrome-SC-23 | US1-TC2-1 |
| shared-ui-site-chrome-SC-24, SC-25, SC-26 | US1-TC3-1 |
| Uncovered anchors | none |
| Contradicted readings | none |
