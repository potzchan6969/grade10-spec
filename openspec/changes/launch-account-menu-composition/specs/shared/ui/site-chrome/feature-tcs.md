# shared/ui/site-chrome Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-21, tcs-rules r3.0

## shared-ui-site-chrome-US1: Shared chrome contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/site/page-shell`, which composes the header and footer
**As an** application composing the shared chrome,
**I want** the chrome to expose only the controls I have answered, keep
off-site destinations safely scoped, and present one truthful, session-aware
header for any brand,
**so that** every product surface can render a correct header without
reimplementing its behavior.

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

### shared-ui-site-chrome-US1-TC15-1: Account menu orders My Orders, My Auctions, Membership, then Sign Out when every handler is supplied

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

* `SiteHeader` receives a signed-in session and `onOrders`, `onMembership` with `copy.membership`, and `onSignOut` handlers.

**Steps:**

1. Open the account menu.

**Expected Results:**

* The items appear in the order My Orders, My Auctions, Membership, Sign Out.
* The last item reads "Sign Out" in Title Case.

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

## Reconciliation

**Run:** The blind pass read this capability's `## Purpose` and `## Feature set` (this change's "Header controls" leaf), its `user-journeys.md` (`**Walked by:** nobody`), `decisions.md` (goals, non-goals, Q1-Q7, and an empty `## Raised`), `ui-design.md`, the linked PRD sections (`site-chrome.md` § Account Entry, `page-shell.md` § Account Menu), and the durable `feature-tcs.md` for id continuity (existing US1-TC1 through TC13, several of whose assertions this change supersedes). It did not read `spec.md`'s `## Requirements`, `openspec/changes/archive/`, or the scenario reading.

- **Raised, folded into spec** — the blind pass's case asserting Membership still joins after My Auctions when My Orders is not supplied is real, independently-gated behaviour no drafted scenario had asserted. Folded as `shared-ui-site-chrome-SC-38`.
- **Raised, rejected** — a case asserting the header never offers a wishlist control, even with every handler supplied. This change touches none of that behaviour; the durable requirement (`shared-ui-site-chrome-SC-06`) and the existing `shared-ui-site-chrome-US1-TC7-1` case already cover it. Not added, to avoid a duplicate-purpose case.
- **Raised, rejected** — a case asserting Profile is omitted from the menu when `onProfile` is not supplied. Every composition case above (`TC14-1`, `TC15-1`) already shows no Profile item regardless of what is supplied, and `shared-ui-site-chrome-SC-30`/`-33` state the unconditional exclusion explicitly; a dedicated case would duplicate that coverage.
- **Raised, rejected** — whether `accountEmail`'s small avatar sits above or beside the sign-in email: the PRD's own 🚧 line ("an initial avatar sits above the email, above the items") already states this; not a gap the run found.
- **Raised, rejected** — whether My Auctions and Sign Out are ever themselves handler-gated: the Feature set's "Handler-gated" leaf names search, account, cart, My Orders, and Membership only; My Auctions and Sign Out are the menu's unconditional core, which the durable requirement's "Signed in" clause already establishes ("open a menu of My Auctions and Sign out") and this change does not touch.
- **Raised, rejected** — whether the Cart control's position relative to the account entry in the bar is specified: unrelated to this change's scope (account-menu composition), unchanged from the durable spec.
- **Raised, rejected** — whether supplying `onProfile` still renders Profile at the component level: `decisions.md` Q1 states this change "supersedes the durable reading that Profile joins first whenever its handler is present," which settles it — Profile is unconditionally excluded from the menu regardless of whether `onProfile` is supplied. Reflected in `shared-ui-site-chrome-SC-32`.
- **Raised, rejected** — whether Membership requires both `onMembership` and `copy.membership`, or the handler alone: `decisions.md` Q2 states the gate explicitly as "handler-gated on `onMembership` and `copy.membership`," which settles it. Reflected in `shared-ui-site-chrome-SC-36`.
- **Raised, rejected** — whether `onOrders` ("My Auction Orders") needs its own requirement or scenario here: `decisions.md` Q7 and the proposal's Follow-on changes scope that to a future change (`add-my-auction-orders`); this capability's export contract for `onOrders` is unchanged by this change.
- **Raised, escalated** — when `accountEmail` is not supplied and the menu falls back to `copy.accountMenuLabel`, whether the small initial avatar still renders (and from what) or is omitted along with the email is not stated anywhere in the material. Landed as a row in the change's `decisions.md` `## Raised` table and a ❓ on `docs/prds/products/shared/ui/site-chrome.md` § Account Entry.
- **Uncovered anchors** — none; every scenario this change touches (`shared-ui-site-chrome-SC-17`, `-29` through `-39`) is reached by at least one case above, or by an existing durable case unaffected by this change.
- **Contradicted** — none; both readings agreed on every point they both stated.
