# grade10-site/site/media-coverage Test Cases

**Status:** pending-review · 0/4
**Drafts styled:** 2026-10-18, tcs-rules r4

## grade10-site-site-media-coverage-US1: Collector scans the media coverage

**As a** collector,
**I want** the Media Coverage page to read as one record of what the
press has reported — each story a card naming its publication and title,
**so that** I can size up the coverage Grade10 has earned and from whom.

<!-- trace:case id=g10.site-media-coverage.TC-uiz rev=1 covers=g10.site-media-coverage.SC-zem -->
### grade10-site-site-media-coverage-US1-TC1-1: The page presents its coverage in order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-media-coverage-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 media coverage url>.
2. Read the page top to bottom.

**Expected Results:**

* "Media Coverage" is the page's top-level heading under an IN THE NEWS
  eyebrow, beside the external-reporting intro.
* The coverage shows as media cards, each naming its story's publication
  and title.

<!-- trace:case id=g10.site-media-coverage.TC-4kd rev=1 covers=g10.site-media-coverage.SC-20b -->
### grade10-site-site-media-coverage-US1-TC2-1: The cards run four across on a wide viewport

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-media-coverage-US-01

**Pre-conditions:**
A viewport at the wide breakpoint or above.

**Steps:**

1. Navigate to <grade10 media coverage url>.

**Expected Results:**

* The media cards lay out four across in the grid.

<!-- trace:case id=g10.site-media-coverage.TC-qvn rev=1 covers=g10.site-media-coverage.SC-npo -->
### grade10-site-site-media-coverage-US1-TC3-1: The cards stack on a narrow viewport

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-media-coverage-US-01

**Pre-conditions:**
A viewport below the wide breakpoint.

**Steps:**

1. Navigate to <grade10 media coverage url>.

**Expected Results:**

* The media cards stack in a single column under the header.

## grade10-site-site-media-coverage-US2: Collector opens a story

**As a** collector,
**I want** each media card to take me to the story it names on the
publisher's site,
**so that** a headline is a door to the report rather than dead text.

<!-- trace:case id=g10.site-media-coverage.TC-8xm rev=1 covers=g10.site-media-coverage.SC-ozy -->
### grade10-site-site-media-coverage-US2-TC2-1: A media card opens its story in a new tab

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-media-coverage-US-02

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 media coverage url>.
2. Open the first media card.

**Expected Results:**

* The story's page on the publisher's site opens in a new tab; the Media
  Coverage page stays open behind it.

## Settled

## Reconciliation

- **Run** — the cases above were drafted in the same context that wrote
  the journeys and the spec, not by an isolated blind pass; the suite is
  written from the journeys and feature set, and no `## Requirements`
  content was used to shape a case. The isolated-input property is
  therefore claimed, not demonstrated, and a later blind pass on the
  durable artifacts may still raise findings.
