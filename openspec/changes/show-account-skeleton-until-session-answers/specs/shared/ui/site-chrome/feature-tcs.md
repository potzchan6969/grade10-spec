# shared/ui/site-chrome Test Cases

**Status:** pending-review · 0/4
**Drafts styled:** 2026-10-14, tcs-rules r5

## g10.shared-site-chrome.US1: Shared chrome contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/site/page-shell`, which composes the header and footer
**As an** application composing the shared chrome,
**I want** the chrome to expose only the controls I have answered, keep
off-site destinations safely scoped, and present one truthful, session-aware
header for any brand,
**so that** every product surface can render a correct header without
reimplementing its behavior.

<!-- trace:case id=g10.shared-site-chrome.TC-hxc rev=1 -->
### g10.shared-site-chrome.US1-TC29: A pending session draws a placeholder in the account entry's place

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Header controls

**Pre-conditions:**

* `SiteHeader` receives a pending session, `onSignIn` with its Sign In copy, a Cart handler, primary items and a locale handler.

**Test data:**

| `<viewport>` |
| --- |
| 1280 CSS pixels wide |
| 375 CSS pixels wide |

**Steps:**

1. Render the header at <viewport>.
2. Inspect the account entry's place and the other controls.

**Expected Results:**

* A round placeholder sits in the account entry's place.
* The placeholder sits in the bar beside Cart.
* No Sign In button and no account icon renders.
* Cart renders in the bar, and primary navigation and language render where <viewport> places them.

<!-- trace:case id=g10.shared-site-chrome.TC-cdi rev=1 -->
### g10.shared-site-chrome.US1-TC30: The placeholder offers nothing to press, whatever account handlers are supplied

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

* `SiteHeader` receives a pending session, `accountEmail`, `onSignIn`, `onProfile`, `onMyOrders`, `onMembership` with `copy.membership`, every other account-menu handler it takes, and a Cart handler.

**Steps:**

1. Render the header.
2. Click the placeholder in the account entry's place.
3. Press Tab through the header's controls, from the first to the last.

**Expected Results:**

* Step 2: no supplied handler is invoked and no account menu opens.
* No Profile, My Orders, My Auctions, Membership or Sign Out item renders.
* Step 3: focus never rests on the placeholder.

<!-- trace:case id=g10.shared-site-chrome.TC-u5p rev=1 -->
### g10.shared-site-chrome.US1-TC31: The placeholder is silent to assistive technology

**Classification:**

* **Severity:** normal
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

* `SiteHeader` receives a pending session and `onSignIn` with its Sign In copy.

**Steps:**

1. Render the header.
2. Inspect the header's accessibility tree.

**Expected Results:**

* The placeholder has no role and no accessible name.
* Nothing in the header is marked busy.

<!-- trace:case id=g10.shared-site-chrome.TC-8u7 rev=1 -->
### g10.shared-site-chrome.US1-TC32: The placeholder takes the account icon's footprint

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
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

* `SiteHeader` receives `onSignIn` with its Sign In copy, the account menu's handlers, `accountEmail`, a Cart handler, primary items and a locale handler.

**Test data:**

| `<viewport>` |
| --- |
| 1280 CSS pixels wide |
| 375 CSS pixels wide |

**Steps:**

1. Render the header at <viewport> with a pending session.
2. Record the box of the placeholder and of every other control.
3. Re-render the same header with a signed-in session.
4. Record the box of the account icon and of every other control.

**Expected Results:**

* Step 2: the placeholder is a circle 40 CSS pixels across.
* Step 4: the account icon's box matches the placeholder's box from step 2.
* Step 4: every other control's box matches its box from step 2.
* Step 4: the placeholder no longer renders.

## Settled

* Session-gating (signed out shows Sign In) always overrides handler-gating:
  supplying `onProfile`, `onMyOrders`, and `onMembership` handlers while
  signed out renders none of them.
* The account entry renders only with its handler or its slot, and
  `SiteHeader` always supplies one: `onSignIn` signed out, the account menu
  signed in.

## Reconciliation

- **Run** - QA1 blind pass, 2026-10-14. Read: the method (`spec-to-tcs` skill, `specs-to-test-cases.md` at `tcs_rules_rev` 5, `writing.md`); the change's `proposal.md`, `decisions.md` (goals, non-goals, Q1-Q7, empty `## Raised`) and `ui-design.md`; site-chrome's durable `## Purpose` and `## Feature set`, the change's feature-set outline, the durable and change `user-journeys.md` (walked by nobody on their own); the existing `feature-tcs.md` with its `## Reconciliation` stripped; the Site Header and Footer and Page Shell PRDs; the `openspec/config.yaml` context. Denied: every `## Requirements` section, scenario text, `tech-design.md`, `tasks.md`, `openspec/specs/` beyond the supplied sections, and `openspec/changes/archive/`. Not supplied: `tcs-conventions.md` and the `shared/ui` domain suite.

**Run:** 2026-10-14, QA2. A fresh reader joined QA1's blind cases and Dev's scenarios on `Header controls`, read against the Account Entry section of the Site Header and Footer PRD, `decisions.md` Q1 to Q10, `ui-design.md`, `tech-design.md` and `tasks.md`, and joined the durable suite's markers for the scenarios the modified requirement carries. A case links a scenario only where its route, starting state and checks assert every THEN; none does yet. No domain suite sits above `shared/ui`.

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| `g10.shared-site-chrome.US1-TC29` | Pending at 1280 and 375 CSS pixels: a round placeholder in the account entry's place, beside Cart at 375 only, no Sign In button or account icon, and the other controls still rendering. No size, and no box against the account icon | Reached in part: the place and absence clauses of `shared-ui-site-chrome-SC-45`. Links once the footprint leaves that scenario (Dev) and the case puts the placeholder beside Cart on both rows (QA1); its other-controls result folds into that scenario |
| `g10.shared-site-chrome.US1-TC30` | A click and a Tab pass with every account handler supplied: no handler runs, no menu or item renders, and focus never rests on the placeholder | Reached in part: `shared-ui-site-chrome-SC-46` all but its assistive-technology AND. Links once that AND is its own scenario (Dev) |
| `g10.shared-site-chrome.US1-TC31` | No accessible name, no status role and nothing busy; the requirement says no role at all | Reached in part: the assistive-technology AND of `shared-ui-site-chrome-SC-46`. Links once that AND is its own scenario (Dev) and the case asserts no role (QA1) |
| `g10.shared-site-chrome.US1-TC32` | Pending, then signed in, at both widths: a circle 40 CSS pixels across, the account icon's box equal to it, and every other control's box unchanged. Not beside Cart, and not the absence of Sign In and the menu | Reached in part: the footprint clauses of `shared-ui-site-chrome-SC-45`. Links once they are their own scenario (Dev); its other-boxes result folds into it |
| `shared-ui-site-chrome-SC-45` | US1-TC29 asserts the place and US1-TC32 the footprint; neither asserts both | Uncovered as one scenario: Dev splits the footprint into its own |
| `shared-ui-site-chrome-SC-46` | US1-TC30 asserts the inertness and US1-TC31 the silence; neither asserts both | Uncovered as one scenario: Dev splits the silence into its own |
| `shared-ui-site-chrome-SC-15` to `shared-ui-site-chrome-SC-18`, `shared-ui-site-chrome-SC-29` to `shared-ui-site-chrome-SC-40`, `shared-ui-site-chrome-SC-42`, `shared-ui-site-chrome-SC-43` | Carried word for word with the modified requirement | Durable markers hold them |
| Case number US1-TC29 | `restrict-auctions-by-region`'s suite adds its own `g10.shared-site-chrome.US1-TC29`. The fold replaces a durable case by its TC number, so accepting that change after this one would overwrite this US1-TC29 and inherit its marker | That change's case takes the next unused number, US1-TC32 (coordinator) |
| Uncovered anchors | `Header controls` has US1-TC29 to US1-TC32 | None |
| Over-claimed cases | No marker names a scenario | None |
| Contradicted readings | No case and scenario disagree | None |
| Raised | The blind pass raised nothing on this capability | None |
