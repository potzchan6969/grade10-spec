# grade10-site/site/media-coverage Test Cases

**Status:** pending-review · 0/5
**Drafts styled:** 2026-10-28, tcs-rules r7

**Out of suite (non-GUI):** grade10-site-site-media-coverage-SC-07 - the language mark is an attribute on the link, which no screen shows

## grade10-site-site-media-coverage-US1: Collector scans the media coverage

**As a** collector,
**I want** the Media Coverage page to read as one record of what the
press has reported — each story a card naming its publication and title,
**so that** I can size up the coverage Grade10 has earned and from whom.

<!-- trace:case id=g10.site-media-coverage.TC-uiz rev=1 covers=g10.site-media-coverage.SC-zem,g10.site-media-coverage.SC-h4k -->
### grade10-site-site-media-coverage-US1-TC1-1: The page reads top to bottom, header then story cards

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-media-coverage-US-01

**Pre-conditions:**
* Two stories are on record, published in the order <story_a> then <story_b>.

**Steps:**

1. Open <g10url>/media-coverage.
2. Read the top of the page.
3. Scroll to the coverage section.

**Expected Results:**

* The page loads.
* An IN THE NEWS eyebrow sits over the top-level heading "Media Coverage" and the external-reporting intro.
* The coverage follows the header as a grid of media cards.
* Every card names its publication.
* Every card names its story title.
* The <story_a> card comes before the <story_b> card.

<!-- trace:case id=g10.site-media-coverage.TC-qvn rev=1 covers=g10.site-media-coverage.SC-20b -->
### grade10-site-site-media-coverage-US1-TC2-1: Cards run four across on a wide viewport

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-media-coverage-US-01

**Pre-conditions:**
* The browser viewport is wide, at or above the site's desktop hinge.
* At least five stories are on record.

**Steps:**

1. Open <g10url>/media-coverage.
2. Scroll to the coverage section.

**Expected Results:**

* The cards lay out four across in the grid.
* The fifth card starts a new row.

<!-- trace:case id=g10.site-media-coverage.TC-8xm rev=1 covers=g10.site-media-coverage.SC-npo -->
### grade10-site-site-media-coverage-US1-TC3-1: Cards stack in one column on a narrow viewport

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-media-coverage-US-01

**Pre-conditions:**
* The browser viewport is narrow, at handset width.
* At least two stories are on record.

**Steps:**

1. Open <g10url>/media-coverage.
2. Scroll to the coverage section.

**Expected Results:**

* The cards stack in a single column under the header.
* No card is cut off or overlaps another.

<!-- trace:case id=g10.site-media-coverage.TC-e6p rev=1 covers=g10.site-media-coverage.SC-q7m -->
### grade10-site-site-media-coverage-US1-TC4-1: A page with no coverage shows the header alone

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-media-coverage-US-01

**Pre-conditions:**
* The Admin Portal has published no coverage.

**Steps:**

1. Open <g10url>/media-coverage.
2. Scroll below the header.

**Expected Results:**

* The IN THE NEWS eyebrow, the "Media Coverage" heading and the intro show.
* No media card shows.
* No empty-state message shows.

---

## grade10-site-site-media-coverage-US2: Collector opens a story

**As a** collector,
**I want** each media card to take me to the story it names on the
publisher's site,
**so that** a headline is a door to the report rather than dead text.

<!-- trace:case id=g10.site-media-coverage.TC-w5r rev=1 covers=g10.site-media-coverage.SC-ozy -->
### grade10-site-site-media-coverage-US2-TC1-1: Each story card opens its own story in a new tab

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-media-coverage-US-02

**Pre-conditions:**
* At least two stories are on record, with different story addresses.

**Steps:**

1. Open <g10url>/media-coverage.
2. Select the first media card by its title, then return to the first tab.
3. Select the first media card by its publication, then return to the first tab.
4. Select the first media card by its Read article affordance, then return to the first tab.
5. Select the second media card.

**Expected Results:**

* Each of steps 2, 3 and 4 opens the same story's page on the publisher's site in a new tab.
* The Media Coverage page stays open in the first tab.
* Step 5 opens a different story in a new tab, matching the second card's publication and title.

## Settled

- With no coverage published, the page shows the header block over an empty grid and no message.
- Cards run in the order the Admin Portal publishes them, not re-sorted.
- A card whose story is in another language marks it on its link.
- The card composes the frame's overrides (`radius-3xl`, `gap-6`, `size-56`, `border-strong` on hover) over the published `Card`; the hover shadow is a weakened house shadow; the publication label is `secondary-foreground`.
- Media Coverage sits in the footer's Company column; the header lists no item for the page and marks nothing current.

## Reconciliation

**Run:** 2026-10-28, QA1 blind pass; read the frozen anchors (`## Purpose`, `## Feature set`) and `user-journeys.md`; denied the requirements, scenarios, `tasks.md`, `ui-design.md`, `tech-design.md`, `decisions.md` and the shipped code. Replaces the earlier draft, which was written in the same context as the spec. QA2 pass, 2026-10-28, fresh context: read the suite, spec, tech-design, ui-design, tasks, decisions and PRD beside the blind cases.

- **Merged** - the blind header case and the card-content case walk one route from one starting state (open the page, read down), and no case alone asserted the page-level scenario; they are now one case.
- **Merged** - the blind second-card case is the first-card case with another card, one case with a second step; the whole-card destination the requirement names joins it as steps 3 and 4.
- **Corrected** - the narrow case read "below the wide breakpoint", which also takes the two-column band the design decisions give the mid width; it now reads handset width, the wording About uses. The wide case reads the site's desktop hinge for the same reason.
- **Folded into spec** - the requirement says publication, title and Read article all activate the same destination; no scenario THEN stated it, so the link scenario gains that clause.
- **Merged** - the card-order scenario joins the top-to-bottom case: same route, and the two published stories are its test data.
- **New, not an extension** - `g10.site-media-coverage.TC-e6p` - the empty state needs a starting state with nothing published, which no live case has.
- **Out of suite** - the language mark is listed non-GUI above.
- **Out of suite** - hover, long-entry clamp, entering and reduced motion (ui-design.md States), none stated by a requirement scenario.
- **New, not an extension** - `g10.site-media-coverage.TC-uiz`, `TC-qvn`, `TC-8xm`, `TC-w5r` - no live case: the capability has no durable suite and no domain case walks `/media-coverage`.
- **Drift accepted** - the `## Feature set` anchors name neither the empty state, the order nor the language mark; the scenarios Serve the journeys, and the anchors stay frozen.
