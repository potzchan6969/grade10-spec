# grade10-site/site/page-shell Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-21, tcs-rules r3.0

## grade10-site-site-page-shell-US3: Collector reaches account destinations from the header

**As a** collector,
**I want** Sign In when I am signed out, and when I am signed in an account
menu that shows my sign-in email with its small initial avatar above My
Auctions and Sign Out on auction launch, and My Orders, My Auctions,
Membership, and Sign Out once Store answers, with Cart in the bar only once
Store answers,
**so that** one place in the header takes me where I can go for this launch,
without Profile or a second auction-orders link.

### grade10-site-site-page-shell-US3-TC6-1: Auction-launch account menu shows email, avatar, and reduced items

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in, on an auction-launch surface, Store not yet answered) is on the site.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | The signed-in collector's email address |

**Steps:**

1. Open the account menu from the header.

**Expected Results:**

* The menu label shows `<collector email>` with a small (xs) initial avatar above the items.
* The menu lists only My Auctions and Sign Out, in that order.
* The menu does not include Profile, My Orders, Membership, or Cart.

### grade10-site-site-page-shell-US3-TC7-1: Store-launch account menu adds My Orders and Membership ahead of Sign Out

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in, on a surface once Store answers) is on the site.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | The signed-in collector's email address |

**Steps:**

1. Open the account menu from the header.

**Expected Results:**

* The menu label shows `<collector email>` with its small (xs) initial avatar above the items.
* The menu lists My Orders, My Auctions, Membership, then Sign Out, in that order.
* Cart is present in the header bar and the menu does not include Profile.

### grade10-site-site-page-shell-US3-TC8-1: Sign Out item reads in Title Case

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in) is on the site with the account menu open.

**Steps:**

1. Read the label of the last item in the account menu.

**Expected Results:**

* The item reads "Sign Out" in Title Case, not "Sign out" or "SIGN OUT".

### grade10-site-site-page-shell-US3-TC9-1: Account menu label falls back when no sign-in email is supplied

**Classification:**

* **Severity:** normal
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

* customer(signed in, no sign-in email available to the header) is on the site.

**Steps:**

1. Open the account menu from the header.

**Expected Results:**

* The menu label shows the configured account-menu fallback label instead of an email, still above My Auctions and Sign Out.

### grade10-site-site-page-shell-US3-TC10-1: Activating Membership invokes its handler without opening a withheld route

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in, on a surface once Store answers, Membership handler and copy supplied) is on the site.

**Steps:**

1. Open the account menu.
2. Activate Membership.

**Expected Results:**

* The supplied Membership handler is invoked.
* The browser does not navigate to `/membership`, `/join`, or any other membership address.

## Reconciliation

**Run:** The blind pass read this capability's `## Purpose` (unchanged, so composed text was not written) and `## Feature set` (this change's "Account control" leaf), the full `user-journeys.md` (durable US-01, US-02, US-04 through US-07, plus this change's MODIFIED US-03), `decisions.md` (goals, non-goals, Q1-Q7, and an empty `## Raised`), `ui-design.md`, the linked PRD sections (`page-shell.md` § Account Menu, `site-chrome.md` § Account Entry), and the durable `feature-tcs.md` for id continuity (existing US3-TC1 through TC5, whose assertions this change supersedes). It did not read `spec.md`'s `## Requirements`, `openspec/changes/archive/`, or the scenario reading.

- **Raised, folded into spec** — the blind pass's case asserting that activating Membership invokes its handler and does not navigate to a withheld route named behaviour `decisions.md` Q3 states ("Do not wire the item to a withheld membership address") but no drafted scenario had asserted at this capability. Folded as `grade10-site-site-page-shell-SC-34`.
- **Raised, folded elsewhere** — the blind pass's case asserting Membership still joins after My Auctions when My Orders is not supplied is independent-handler-gating behaviour this capability's own requirement does not model at that granularity (its own "Each item" clause treats My Orders and Membership as joining together once Store answers). The rule belongs to the component contract that actually enforces it. Folded into `shared/ui/site-chrome` as `shared-ui-site-chrome-SC-38`, not duplicated here.
- **Raised, rejected as out of suite** — the blind pass's case asserting Membership is omitted post-Store-answer without its handler tests the same component-level handler-gating granularity this capability's requirement does not itself state; `shared/ui/site-chrome`'s suite already covers it (`shared-ui-site-chrome-US1-TC19-1`, tracing `shared-ui-site-chrome-SC-31`).
- **Raised, rejected** — whether "KYC stays out" is gated by a handler or unconditional: the durable requirement's "Not offered" clause is untouched by this change and was already unconditional before it; not a finding of this run.
- **Uncovered anchors** — none; the new scenarios (`grade10-site-site-page-shell-SC-17`, `-27`, `-28`, `-29`, `-30`, `-31`, `-32`, `-33`, `-34`) are each reached by at least one case above, or by an existing durable case unaffected by this change.
- **Contradicted** — none; both readings agreed on every point they both stated.
