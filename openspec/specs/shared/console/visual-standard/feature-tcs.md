# shared/console/visual-standard Test Cases

**Status:** pending-review · 0/3
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* `<console url>` is the Grade10 console and `<zzz console url>` the ZZZ console of the environment under test; one operator can open both.
* A console's refused, empty and loading reads, its tabs, filters and confirmation dialogs are walked in the console's own suites; these cases compare consoles side by side.

## shared.console-visual-standard.US1: Operator moves between consoles in one shift

**As an** operator,
**I want** every console I open to arrange the same kinds of fact the same way,
**so that** moving between nine of them costs me no re-reading.

<!-- trace:case id=g10.shared-visual-standard.TC-3h8 rev=1 covers=g10.shared-visual-standard.SC-f6s,g10.shared-visual-standard.SC-04e,g10.shared-visual-standard.SC-cm9 -->
### shared.console-visual-standard.US1-TC1: Two consoles arrange the same kind of control the same way

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-visual-standard-US-01

**Pre-conditions:**

* An operator is signed in on `<console url>` and `<zzz console url>`.

**Test data:**

| `<control>` |
| --- |
| a queue's filter and its rows |
| an account panel beside a list |
| a confirmation dialog |

**Steps:**

1. Read `<control>` on `<console url>`, then on `<zzz console url>`.

**Expected Results:**

* Both arrange it the same way, in the same parts and order; no surface of either shows it in a second style.

<!-- trace:case id=g10.shared-visual-standard.TC-a78 rev=1 covers=g10.shared-visual-standard.SC-f6s,g10.shared-visual-standard.SC-04e,g10.shared-visual-standard.SC-cm9 -->
### shared.console-visual-standard.US1-TC2: A component the site also shows looks native in the console

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-visual-standard-US-01

**Pre-conditions:**

* An operator opens a `<console url>` page showing a component the Grade10 site also shows.

**Steps:**

1. Read the component beside the console around it, then the same component on the site.

**Expected Results:**

* It reads as the same component on both, and does not look foreign to the console around it.

---

## shared.console-visual-standard.US2: Operator recognises which brand they are administering

**As an** operator who administers both brands,
**I want** each console to look like the brand it belongs to,
**so that** I never act on one brand's data believing it is the other's.

<!-- trace:case id=g10.shared-visual-standard.TC-fsv rev=1 covers=g10.shared-visual-standard.SC-aro,g10.shared-visual-standard.SC-uk3 -->
### shared.console-visual-standard.US2-TC1: The two brands' consoles differ only in their brand

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-visual-standard-US-02

**Pre-conditions:**

* An operator is signed in on `<console url>` and `<zzz console url>`.

**Steps:**

1. Open the same page on both consoles, and compare them.

**Expected Results:**

* Each reads as its own brand; every difference is the brand's colour, type or mark, never a part's layout or wording.
