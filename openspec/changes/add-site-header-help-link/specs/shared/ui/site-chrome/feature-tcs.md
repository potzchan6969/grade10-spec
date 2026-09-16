# shared/ui/site-chrome Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## shared-ui-site-chrome-US1: External links

**As an** application composing the shared chrome,
**I want** a `NavLink` marked `external` to open in a new tab with
`noopener noreferrer`,
**so that** off-site destinations leave the storefront page open and do not
inherit the opener.

### shared-ui-site-chrome-US1-TC1-1: External primary-nav link opens a new tab

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** External links

**Pre-conditions:**

* A `Nav` (or `SiteHeader`) is supplied a primary nav item with `external: true`.

**Steps:**

1. Render the header at a wide viewport (primary nav visible).
2. Inspect the primary-nav link attributes.
3. Open the compact menu at 375 CSS pixels and inspect the same link.

**Expected Results:**

* The wide primary-nav link has `target="_blank"` and `rel="noopener noreferrer"`.
* The compact-menu link has the same attributes.

### shared-ui-site-chrome-US1-TC2-1: Same-tab link has no blank target

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** External links

**Pre-conditions:**

* A `Nav` is supplied a link with no `external` flag.

**Steps:**

1. Render the header.
2. Inspect the link attributes.

**Expected Results:**

* The link has no `target="_blank"`.

## Raised

* Should external links show a trailing external-link icon?

## Settled

* `external` is optional on `NavLink`; the application supplies it.
* Behaviour applies in primary nav (wide and compact) and utility regions.

## Reconciliation

**Run:** blind suite + scenarios reconciled 2026-09-16.

* **Raised, deferred** — external-link icon — non-goal for this change.
* **Uncovered anchors** — none; `SC-27` / `SC-28` match the suite.
