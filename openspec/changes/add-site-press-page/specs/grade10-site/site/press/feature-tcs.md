# grade10-site/site/press Test Cases

**Status:** pending-review · 0/5
**Drafts styled:** 2026-10-18, tcs-rules r4

## grade10-site-site-press-US1: Collector scans the press record

**As a** collector,
**I want** the Press page to read as one official record — the releases
grouped by year, newest first,
**so that** I can size up what Grade10 has announced and when.

<!-- trace:case id=g10.site-press.TC-uiz rev=1 covers=g10.site-press.SC-zem -->
### grade10-site-site-press-US1-TC1-1: The page presents its record in order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-press-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 press url>.
2. Read the page top to bottom.

**Expected Results:**

* "Press Releases" is the page's top-level heading under a PRESS
  eyebrow, beside the official-record intro and the All Time filter.
* The releases group under year headings — 2026 before 2025 — each
  group newest first.

<!-- trace:case id=g10.site-press.TC-km4 rev=1 covers=g10.site-press.SC-20b -->
### grade10-site-site-press-US1-TC2-1: The page splits into columns on a wide viewport

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-press-US-01

**Pre-conditions:**
A viewport at the wide breakpoint or above.

**Steps:**

1. Navigate to <grade10 press url>.

**Expected Results:**

* The filter sits at the header's right foot.
* Each release reads date, title, arrow across the row.

<!-- trace:case id=g10.site-press.TC-qvn rev=1 covers=g10.site-press.SC-npo -->
### grade10-site-site-press-US1-TC3-1: The page stacks on a narrow viewport

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-press-US-01

**Pre-conditions:**
A viewport below the wide breakpoint.

**Steps:**

1. Navigate to <grade10 press url>.

**Expected Results:**

* The filter stacks under the header.
* Each release's date sits over its title.

## grade10-site-site-press-US2: Collector opens a press release

**As a** collector,
**I want** each release on the Press page to take me to the article it
names,
**so that** a headline is a door to the report rather than dead text.

<!-- trace:case id=g10.site-press.TC-e1r rev=1 covers=g10.site-press.SC-e1r -->
### grade10-site-site-press-US2-TC2-1: A release row opens its article

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-press-US-02

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 press url>.
2. Open the first release of the newest year group.

**Expected Results:**

* The release's `/press-releases/{slug}` article opens in place.

## grade10-site-site-press-US3: Collector narrows the record by year

**As a** collector,
**I want** the All Time filter to show me one year's releases,
**so that** I can read a single year's record without scrolling the rest.

<!-- trace:case id=g10.site-press.TC-59c rev=1 covers=g10.site-press.SC-59c -->
### grade10-site-site-press-US3-TC3-1: The filter narrows the list to one year

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-press-US-03

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 press url>.
2. Open the All Time filter and choose a year.
3. Choose All Time again.

**Expected Results:**

* On the year choice, only that year's group and releases show.
* On All Time, the full record returns.

## Settled

## Reconciliation

- **Run** — the cases above were drafted in the same context that wrote the
  journeys and the spec, not by an isolated blind pass; the suite is written
  from the journeys and feature set, and no `## Requirements` content was
  used to shape a case. The isolated-input property is therefore claimed,
  not demonstrated, and a later blind pass on the durable artifacts may
  still raise findings.
