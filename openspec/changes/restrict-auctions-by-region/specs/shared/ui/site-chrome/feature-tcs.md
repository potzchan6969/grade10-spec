# shared/ui/site-chrome Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-08, tcs-rules r4

**Out of suite:** none.

## g10.shared-site-chrome.US1: Shared chrome contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/site/page-shell`, which composes the header and footer
**As an** application composing the shared chrome,
**I want** the chrome to expose only the controls I have answered, keep
off-site destinations safely scoped, and present one truthful, session-aware
header for any brand,
**so that** every product surface can render a correct header without
reimplementing its behavior.

### g10.shared-site-chrome.US1-TC28: My Auctions is omitted when onMyAuctions is not supplied

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

* `SiteHeader` receives a signed-in session and no `onMyAuctions` handler.

**Steps:**

1. Render the header.
2. Click the account control.
3. Read the account menu's items.

**Expected Results:**

* Step 3: the menu offers Sign Out, and every other gated item whose handler
  is supplied.
* Step 3: no My Auctions item.

## Settled

None.

## Reconciliation

- **Raised** — nothing: the durable contract gates every other account-menu
  item on its handler, and this change extends the same rule to My Auctions
- **Uncovered anchors** — none of this delta's:
  `shared-ui-site-chrome-SC-44` is walked by
  `shared-ui-site-chrome-US1-TC28-1`

**Run:** Read the durable capability's `## Purpose` and `## Feature set`,
its `user-journeys.md`, the change's `decisions.md` and `ui-design.md`, and
the durable suite for id continuity; denied `## Requirements` sections and
`openspec/changes/archive/`.
