# grade10-site/site/press Test Cases

**Status:** pending-review · 0/7
**Drafts styled:** 2026-10-18, tcs-rules r4

## grade10-site-site-press-US4: Collector reads a press release

**As a** collector,
**I want** each release to open as a real article — its date, place,
feature image and body laid out to read, with the about-the-company
cards at hand,
**so that** a headline becomes the report it promised.

<!-- trace:case id=g10.site-press.TC-x4m rev=1 covers=g10.site-press.SC-v6k -->
### grade10-site-site-press-US4-TC1-1: The article presents the release in order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-press-US-04

**Pre-conditions:**
None.

**Steps:**

1. Open a release from the Press page.
2. Read the article top to bottom.

**Expected Results:**

* A breadcrumb opens the page — a Press crumb back to the record and the
  current crumb "Press Release".
* The release's title is the page's top-level heading.
* The release's publish date and location show as badges under the
  title.

<!-- trace:case id=g10.site-press.TC-9hd rev=1 covers=g10.site-press.SC-t9w -->
### grade10-site-site-press-US4-TC2-1: The feature image holds its ratio

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-press-US-04

**Pre-conditions:**
None.

**Steps:**

1. Open a release's article.

**Expected Results:**

* The feature image renders between the title and the body at the
  1200:630 ratio — the same asset the article serves as its OG image.

<!-- trace:case id=g10.site-press.TC-b7k rev=1 covers=g10.site-press.SC-m7h -->
### grade10-site-site-press-US4-TC3-1: The body shows its elements in the template's styles

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-press-US-04

**Pre-conditions:**
An article whose body carries each element — paragraphs with bold and
inline links, headings two through six, both list styles, a blockquote,
figures with and without captions.

**Steps:**

1. Open the article and read the body.

**Expected Results:**

* Paragraphs render at body size; bold runs read semibold; inline links
  read underlined in the accent colour and open their destination —
  external ones in a new tab.
* Each heading level renders at its own size and weight, h2 largest
  through h6.
* Bullet and numbered lists render with their markers; each item's bold
  lead-in reads semibold.
* A blockquote renders against the primary-coloured left rule with its
  attribution line below — name semibold, role regular.
* Figures render the image with its caption below.

<!-- trace:case id=g10.site-press.TC-p2z rev=1 covers=g10.site-press.SC-q3x -->
### grade10-site-site-press-US4-TC4-1: A figure without a caption shows none

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-press-US-04

**Pre-conditions:**
An article whose body carries a figure with no caption.

**Steps:**

1. Open the article to the figure.

**Expected Results:**

* The image renders; no caption renders below it.

<!-- trace:case id=g10.site-press.TC-w6t rev=1 covers=g10.site-press.SC-k2p -->
### grade10-site-site-press-US4-TC5-1: The sidebar holds beside the body on a wide viewport

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-press-US-04

**Pre-conditions:**
A viewport at the wide breakpoint or above.

**Steps:**

1. Open a release's article.
2. Scroll the body.

**Expected Results:**

* About Grade10, About MemeStrategy and Media Enquiries sit in a column
  beside the feature image and the body.
* The column holds its place as the article scrolls.

<!-- trace:case id=g10.site-press.TC-d3q rev=1 covers=g10.site-press.SC-z8n -->
### grade10-site-site-press-US4-TC6-1: The sidebar lands after the body on a narrow viewport

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-press-US-04

**Pre-conditions:**
A viewport below the wide breakpoint.

**Steps:**

1. Open a release's article.

**Expected Results:**

* The article reads title, feature image, body in one column; the three
  cards stack after the body.

## grade10-site-site-press-US5: Collector returns to the record

**As a** collector,
**I want** the breadcrumb's Press crumb to take me back to the releases,
**so that** I can leave one article and keep scanning the record.

<!-- trace:case id=g10.site-press.TC-n8f rev=1 covers=g10.site-press.SC-r4d -->
### grade10-site-site-press-US5-TC1-1: The Press crumb opens the record

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-press-US-05

**Pre-conditions:**
None.

**Steps:**

1. Open a release's article.
2. Open the breadcrumb's Press crumb.

**Expected Results:**

* `/press-releases` opens in place.

## Settled

## Reconciliation

- **Run** — the cases above were drafted in the same context that wrote the
  journeys and the spec, not by an isolated blind pass; the suite is written
  from the journeys and feature set, and no `## Requirements` content was
  used to shape a case. The isolated-input property is therefore claimed,
  not demonstrated, and a later blind pass on the durable artifacts may
  still raise findings.
