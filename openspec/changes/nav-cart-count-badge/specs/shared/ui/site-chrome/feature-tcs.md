# shared/ui/site-chrome Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-21, tcs-rules r3.0

## shared-ui-site-chrome-US1: Shared chrome contract

**Walked by:** nobody on their own - a component contract; the journeys live in `grade10-site/site/page-shell`, which composes the header and footer
**As an** application composing the shared chrome,
**I want** the chrome to expose only the controls I have answered, keep
off-site destinations safely scoped, and present one truthful, session-aware
header for any brand,
**so that** every product surface can render a correct header without
reimplementing its behavior.

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

* `SiteHeader` receives a Cart handler and <empty count>.

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
* The Cart control's accessible name carries no count.

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

* `SiteHeader` receives a Cart handler, `Cart` as its cart label, and <active-line count>.
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

**Expected Results:**

* A brand count indicator appears on the Cart control.
* The indicator displays the full <active-line count>.
* The Cart control's accessible name reads `Cart (<active-line count>)`.
* The indicator itself is hidden from assistive technology.
* The drawer title badge displays the same <active-line count>.

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

## Settled

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
