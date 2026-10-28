# grade10-site/site/about Test Cases

**Status:** pending-review · 0/8
**Drafts styled:** 2026-10-17, tcs-rules r4

## grade10-site-site-about-US1: Collector learns who is behind Grade10

**As a** collector,
**I want** the About page to tell me who backs Grade10, what it does, and
where it is going,
**so that** I can trust the site with my cards before I buy, vault or
finance them.

<!-- trace:case id=g10.site-about.TC-uiz rev=1 covers=g10.site-about.SC-zem -->
### grade10-site-site-about-US1-TC1-1: The page presents its sections in order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-about-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 about url>.
2. Read the page top to bottom.

**Expected Results:**

* About Us is the page's top-level heading.
* An introduction names MemeStrategy and 9GAG.
* A "What we do" statement and a "Where we're going" statement follow.
* A Market indexes section names the four index pages ahead of the
  parent-company panel.
* A parent-company panel holds the MemeStrategy mark and a paragraph on the
  company.

<!-- trace:case id=g10.site-about.TC-km4 rev=1 covers=g10.site-about.SC-20b -->
### grade10-site-site-about-US1-TC2-1: The page splits into two columns on a wide viewport

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-about-US-01

**Pre-conditions:**
The browser viewport is wide, at or above the site's desktop hinge.

**Steps:**

1. Navigate to <grade10 about url>.
2. Read the layout of the hero and the two statements.

**Expected Results:**

* The introduction sits beside the brand heading, not beneath it.
* "What we do" and "Where we're going" sit side by side.

<!-- trace:case id=g10.site-about.TC-ns9 rev=1 covers=g10.site-about.SC-npo -->
### grade10-site-site-about-US1-TC3-1: The page stacks on a narrow viewport

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-about-US-01

**Pre-conditions:**
The browser viewport is narrow, at handset width.

**Steps:**

1. Navigate to <grade10 about url>.
2. Read the layout of every section.

**Expected Results:**

* Heading, introduction, the two statements and the parent-company panel
  stack in the page's order at the page inset.

<!-- trace:case id=g10.site-about.TC-k7w rev=1 covers=g10.site-about.SC-59c -->
### grade10-site-site-about-US1-TC4-1: The milestones read newest first with the upcoming one marked

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-about-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 about url>.
2. Read the milestones inside the parent-company panel.

**Expected Results:**

* The milestones appear newest first.
* The milestone that has not happened yet is labelled Coming soon.

## grade10-site-site-about-US2: Collector follows a link from About to a product or partner

**As a** collector,
**I want** each link on the About page to take me to the surface it names,
in a new tab when it leaves the site,
**so that** a mention of vaulting, financing, Grade10 AI, MemeStrategy or
9GAG is a door to it rather than dead text.

<!-- trace:case id=g10.site-about.TC-d13 rev=1 covers=g10.site-about.SC-ozy -->
### grade10-site-site-about-US2-TC1-1: Partner links open in a new tab

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-about-US-02

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 about url>.
2. Open the MemeStrategy link.
3. Return and open the 9GAG link.
4. Return and open the Grade10 AI link.

**Expected Results:**

* Each link opens its named destination in a new tab: MemeStrategy to
  memestrategy.com.hk, 9GAG to 9gag.com, Grade10 AI to app.grade10.com.

<!-- trace:case id=g10.site-about.TC-hli rev=1 covers=g10.site-about.SC-e1r -->
### grade10-site-site-about-US2-TC2-1: Product links open in place

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-about-US-02

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 about url>.
2. Open the Grade10 link in the milestones.

**Expected Results:**

* Grade10 opens the front door in place.

<!-- trace:case id=g10.site-about.TC-jbx rev=1 covers=g10.site-about.SC-kxj -->
### grade10-site-site-about-US2-TC3-1: A mention of an unlaunched surface is plain text

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-about-US-02

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 about url>.
2. Look for a link on the vaulting services mention and on the Grade10
   Finance mention in the milestones.

**Expected Results:**

* Neither mention is a link; both render as plain text.

<!-- trace:case id=g10.site-about.TC-cxl rev=1 covers=g10.site-about.SC-tb4 -->
### grade10-site-site-about-US2-TC4-1: Each index tab shows its live page and opens it in a new tab

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-about-US-02

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 about url>.
2. Select each of the four tabs in the Market indexes section and open its
   link.

**Expected Results:**

* Each tab swaps in a screenshot of the index's live page with its
  description underneath.
* Hat Price Index opens `grade10.com/hat-price-index` in a new tab.
* PTCG100, PTCG500 and OPCG100 open their `index.grade10.com` pages in a
  new tab.

## Settled

## Reconciliation

- **Run** — the cases above were drafted in the same context that wrote the
  journeys and the spec, not by an isolated blind pass; the suite is written
  from the journeys and feature set, and no `## Requirements` content was
  used to shape a case. The isolated-input property is therefore claimed,
  not demonstrated, and a later blind pass on the durable artifacts may
  still raise findings.
