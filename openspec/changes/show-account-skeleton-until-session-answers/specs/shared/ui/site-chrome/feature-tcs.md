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

### g10.shared-site-chrome.US1-TC28: A pending session draws a placeholder in the account entry's place

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
* At 375 CSS pixels wide, the placeholder sits in the bar beside Cart.
* No Sign In button and no account icon renders.
* Cart renders in the bar, and primary navigation and language render where <viewport> places them.

### g10.shared-site-chrome.US1-TC29: The placeholder offers nothing to press, whatever account handlers are supplied

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

### g10.shared-site-chrome.US1-TC30: The placeholder is silent to assistive technology

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

* The placeholder has no accessible name and no status role.
* Nothing in the header is marked busy.

### g10.shared-site-chrome.US1-TC31: The placeholder takes the account icon's footprint

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
