# grade10-site/site/shows Test Cases

**Status:** pending-review · 0/7
**Drafts styled:** 2026-10-18, tcs-rules r4

## grade10-site-site-shows-US1: Collector sizes up the shows

**As a** collector,
**I want** the Shows page to tell me the next dates, how big the shows
are, the formats they run in, and the record of past editions,
**so that** I can decide whether a show is worth the trip.

<!-- trace:case id=g10.site-shows.TC-uiz rev=1 covers=g10.site-shows.SC-zem -->
### grade10-site-site-shows-US1-TC1-1: The page presents its sections in order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-shows-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 shows url>.
2. Read the page top to bottom.

**Expected Results:**

* "Asia’s card shows, at full scale." is the page's
  top-level heading beside an Upcoming Shows card listing only shows
  whose month has not passed.
* An Event Scale section headed "Real Trends. In the Room." holds three
  statistic cards: 25,000+ visitors at Grade10 FEST Summer 2026, 120+
  exhibitors, millions in industry revenue.
* An Event Formats section headed "Three Platforms. One Community."
  carries the Hong Kong, Overseas Partnership and Chinese Mainland
  chapters.
* An Event Records section headed "Every Show. A Milestone." closes the
  page.

<!-- trace:case id=g10.site-shows.TC-km4 rev=1 covers=g10.site-shows.SC-20b -->
### grade10-site-site-shows-US1-TC2-1: The page splits into columns on a wide viewport

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-shows-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 shows url> on a wide viewport.

**Expected Results:**

* The hero sits beside the Upcoming Shows card.
* The statistics sit beside the event-scale photo.
* Editions sit two per row inside their chapter.
* Each record lays its image beside its text.

<!-- trace:case id=g10.site-shows.TC-pqz rev=1 covers=g10.site-shows.SC-npo -->
### grade10-site-site-shows-US1-TC3-1: The page stacks on a narrow viewport

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-shows-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 shows url> on a narrow viewport.

**Expected Results:**

* Every section stacks in the page's order at the page inset.
* Records stack image over text.
* No horizontal overflow appears.

<!-- trace:case id=g10.site-shows.TC-crs rev=1 covers=g10.site-shows.SC-ozy -->
### grade10-site-site-shows-US1-TC4-1: A collector pages an edition's carousel

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-shows-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 shows url>.
2. On the Grade10 FEST Summer 2026 edition card, activate the next arrow.
3. Activate the first progress dot.

**Expected Results:**

* The next arrow advances the photo and marks the second dot current.
* The first dot returns the first photo and marks itself current.

<!-- trace:case id=g10.site-shows.TC-rec rev=1 covers=g10.site-shows.SC-aa1 -->
### grade10-site-site-shows-US1-TC5-1: The records read in frame order

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-shows-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 shows url>.
2. Read the event-records list.

**Expected Results:**

* The five editions appear in order: Seoul Auction Private Sale &
  Exhibition (2026), Grade10 FEST Summer 2026 (2026), CARDJOY × Grade10
  Shanghai (2026), CARDJOY × Grade10 Hangzhou (2026), Grade10 Festival
  2025 (2025), each with title, description and image.

## grade10-site-site-shows-US2: Collector follows a link from Shows to a press surface

**As a** collector,
**I want** each Press Release link on the Shows page to take me to the
article it names,
**so that** a show's coverage is a door to the report rather than dead
text.

<!-- trace:case id=g10.site-shows.TC-hli rev=1 covers=g10.site-shows.SC-e1r -->
### grade10-site-site-shows-US2-TC1-1: Press-release links open their articles

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-shows-US-02

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 shows url>.
2. Open the hero Press Releases link.
3. Return and open each edition's Press Release link.

**Expected Results:**

* Press Releases opens `/press-releases`.
* Each edition opens its own `/press-releases/{slug}` article: FEST Summer
  2026 → `grade10-fest-summer-2026-concludes-successfully`, Festival 2025 →
  `psa-10-pikachu-wall-grade10-card-fest`, Seoul Auction chapter →
  `grade10-south-korea-seoul-auction`, Shanghai →
  `cardjoy-grade10-shanghai-expansion`, Hangzhou →
  `cardjoy-grade10-hangzhou-show`.

## grade10-site-site-shows-US3: Collector watches a show video in place

**As a** collector,
**I want** the chapter videos to play inside the page when I click the
poster,
**so that** I can see a show's atmosphere without leaving the page or
opening a new tab.

<!-- trace:case id=g10.site-shows.TC-vid rev=1 covers=g10.site-shows.SC-59c -->
### grade10-site-site-shows-US3-TC1-1: A chapter video plays in its container

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-shows-US-03

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 shows url>.
2. In the Hong Kong chapter, activate the video's play affordance.
3. Repeat in the Chinese Mainland chapter.

**Expected Results:**

* Each container first shows the event poster with its badge and a play
  affordance.
* On activation the YouTube embed replaces the poster inside the same
  container — Hong Kong plays `Nf4UZyct5uM`, Chinese Mainland plays
  `fy7AfZ8ZhQo`.
* The page does not navigate.

## Settled

## Reconciliation

- **Run** — the cases above were drafted in the same context that wrote the
  journeys and the spec, not by an isolated blind pass; the suite is written
  from the journeys and feature set, and no `## Requirements` content was
  used to shape a case. The isolated-input property is therefore claimed,
  not demonstrated, and a later blind pass on the durable artifacts may
  still raise findings.
