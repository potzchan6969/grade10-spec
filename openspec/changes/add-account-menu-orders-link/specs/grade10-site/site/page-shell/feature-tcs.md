# grade10-site/site/page-shell Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## grade10-site-site-page-shell-US3: Collector reaches account destinations from the header

**As a** collector,
**I want** Sign In when I am signed out, and an account menu of Profile, My
Orders, My Auctions, and Sign out when I am signed in,
**so that** one place in the header takes me where I can go for this launch.

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

* The menu offers, in order, Profile, My Orders, My Auctions, and Sign out.
* The menu does not offer KYC.

### grade10-site-site-page-shell-US3-TC4-1: Activating My Orders opens the collector's orders

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
2. Activate My Orders.

**Expected Results:**

* The collector is taken to `/profile/orders`.

## Reconciliation

**Run:** the blind pass read this capability's `## Purpose` and `## Feature
set` (Feature set only — no `## Requirements`), `user-journeys.md`
(`## MODIFIED User journeys` for `US-03`), `decisions.md` (including
`## Raised`), the change's `proposal.md`, the linked PRD section
(`docs/prds/products/grade10-site/site/page-shell.md#account-menu`), and the
existing `US3-TC1-1` through `US3-TC3-1` cases for id continuity. It was
denied `## Requirements` anywhere, `openspec/specs/` beyond the two included
sections, and `openspec/changes/archive/`. No `ui-design.md` exists for this
change.

* `grade10-site-site-page-shell-US3-TC2-1` — **raised, folded**: order and
  content change (My Orders joins between Profile and My Auctions) match
  `grade10-site-site-page-shell-SC-17` as reconciled; case updated in place,
  same id.
* `grade10-site-site-page-shell-US3-TC4-1` — **raised, folded**: real
  behavior already stated by the modified requirement's "Activating My
  Orders SHALL take them to My Orders" clause; the journey's whole point
  (reaching the orders themselves) had no case before, so it is added
  tracing the existing `US-03` journey rather than a new scenario,
  consistent with how Profile and My Auctions navigation are already
  untested at scenario level.
* Two raised questions escalated to `decisions.md` `## Raised`: whether
  activating a menu item closes the menu (Q5), and whether a navigation
  failure or session lapse needs its own requirement (Q6).
* `grade10-site-site-page-shell-US3-TC1-1` and `-TC3-1` are unaffected by
  this change and are left as they stand in the durable suite.
* No anchor goes uncovered: `US-03` is walked by `TC1-1`, `TC2-1`, `TC3-1`,
  and now `TC4-1`.
