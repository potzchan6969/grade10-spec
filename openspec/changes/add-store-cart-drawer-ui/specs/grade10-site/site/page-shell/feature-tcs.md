# grade10-site/site/page-shell Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-09, tcs-rules r2

## grade10-site-site-page-shell-US06: Collector opens Cart where the site answers it

**As a** collector,
**I want** the header to offer Cart only where the Store drawer is available,
**so that** the control always opens a real surface and never promises one elsewhere.

### grade10-site-site-page-shell-US06-TC01-1: Header offers Cart only on drawer-enabled surfaces

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-06

**Pre-conditions:**

* A user can open <surface>.

**Test data:**

| `<surface>` | `<Cart control>` |
| --- | --- |
| Store front door | Present |
| Unscoped Store listing | Present |
| Store product page | Present |
| Checkout | Present |
| Auction | Absent |
| Profile | Absent |
| Marketing page | Absent |

**Steps:**

1. Navigate to <surface>.
2. Inspect the header controls.
3. If <Cart control> is Present, activate **Cart**.

**Expected Results:**

* The locale label and account control are present on every row.
* The Cart control is <Cart control>, and Search is absent.
* On a Present row, activating Cart opens the Store cart drawer rather than a not-found address.
