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

* `SiteHeader` receives a signed-in session and account destinations.

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

* `SiteHeader` receives a signed-in session and account destinations.

**Steps:**

1. Render the header.
2. Activate the account control.
3. Activate My Orders in the menu.

**Expected Results:**

* The supplied My Orders handler is invoked exactly once.
* No other account-menu handler is invoked.

## Reconciliation

**Run:** the blind pass read this capability's `## Purpose` and `## Feature
set` (Feature set only — no `## Requirements`), `user-journeys.md`,
`decisions.md` (including `## Raised`), the change's `proposal.md`, the
linked PRD section (`docs/prds/products/shared/ui/site-chrome.md#account-entry`),
and the existing `shared-ui-site-chrome-US1-TC9-1` case for id continuity. It
was denied `## Requirements` anywhere, `openspec/specs/` beyond the two
included sections, and `openspec/changes/archive/`. No `ui-design.md` exists
for this change.

* `shared-ui-site-chrome-US1-TC9-1` — **raised, folded**: order and content
  change (My Orders joins between Profile and My Auctions) match
  `shared-ui-site-chrome-SC-17` as reconciled; case updated in place, same id.
* `shared-ui-site-chrome-US1-TC12-1` — **raised, folded**: real behavior
  already stated by the modified requirement's "Activating each item SHALL
  invoke the matching supplied handler" clause; no scenario had proven it for
  any item, so the case is added tracing the existing `Header controls`
  group rather than a new scenario, consistent with how Profile and My
  Auctions activation are already untested at scenario level.
* `shared-ui-site-chrome-US1-TC13-1` ("Account menu omits My Orders when its
  handler is not supplied") — **raised, rejected**: My Orders is a required,
  always-present menu item like Profile, My Auctions, and Sign out (see
  `decisions.md` Q4), not an independently handler-gated control like search
  or cart. "Handler not supplied" is not a reachable state for this prop, so
  the case was dropped rather than folded.
* Two raised questions escalated to `decisions.md` `## Raised`: whether My
  Orders is handler-gated (Q4), and the exact `zh-Hant`/`zh-Hans` label text
  (Q7).
* No anchor goes uncovered: `Header controls` — the group every scenario in
  the modified requirement serves — is walked by `TC5-1`, `TC8-1`, `TC9-1`,
  `TC10-1`, `TC11-1`, and now `TC12-1`.
