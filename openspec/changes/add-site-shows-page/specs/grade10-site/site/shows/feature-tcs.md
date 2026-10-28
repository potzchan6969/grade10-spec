# grade10-site/site/shows Test Cases

**Status:** pending-review · 0/13
**Drafts styled:** 2026-10-18, tcs-rules r4

## grade10-site-site-shows-US1: Collector sizes up the shows

**As a** collector,
**I want** the Shows page to tell me the next dates, how big the shows
are, the formats they run in, and the record of past editions,
**so that** I can decide whether a show is worth the trip.

<!-- trace:case id=g10.site-shows.TC-uiz rev=2 covers=g10.site-shows.SC-zem -->
### grade10-site-site-shows-US1-TC1-2: The page presents its sections in order

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

* At least one show the Upcoming Shows card carries falls in the current
  month or later.

**Steps:**

1. Open <grade10 shows url>.
2. Read the page top to bottom.

**Expected Results:**

* The hero shows Grade10 Shows over "Asia’s card shows, at full scale.",
  the page's top-level heading.
* The hero carries an Explore Shows action and a Press Releases action.
* An "Upcoming Shows" card sits beside the hero, listing dates.
* An Event Scale section headed "Real Trends. In the Room." shows a
  show-floor photo and three statistic cards: 25,000+ "Visitors at Grade10
  FEST Summer 2026", 120+ exhibitors, millions in industry revenue.
* An Event Formats section headed "Three Platforms. One Community."
  carries a chapter list over the Hong Kong, Overseas Partnership and
  Chinese Mainland chapters, all three on the page, stacked in that order.
* An Event Records section headed "Every Show. A Milestone." closes the
  page.
* No text on the page names ZZZ as a partner.

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

<!-- trace:case id=g10.site-shows.TC-pqz rev=2 covers=g10.site-shows.SC-npo -->
### grade10-site-site-shows-US1-TC3-2: The page stacks on a narrow viewport

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
* The chapter list scrolls sideways within itself; the page does not.
* Records stack image over text.
* No horizontal overflow appears.

<!-- trace:case id=g10.site-shows.TC-crs rev=2 covers=g10.site-shows.SC-ozy -->
### grade10-site-site-shows-US1-TC4-2: A collector pages an edition's carousel by hand

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

**Test data:**

| Field | Value |
| --- | --- |
| `idle wait` | 15 seconds (range: 10 seconds or more) |

**Steps:**

1. Open <grade10 shows url>.
2. Scroll to the Grade10 FEST Summer 2026 edition card.
3. Wait `<idle wait>` without touching the carousel.
4. Select the next arrow on the card.
5. Select the first progress dot.

**Expected Results:**

* Left alone for `<idle wait>`, the carousel stays on its first photo.
* The next arrow advances the photo and marks the second dot current.
* The first dot returns the first photo and marks itself current.

<!-- trace:case id=g10.site-shows.TC-rec rev=2 covers=g10.site-shows.SC-aa1 -->
### grade10-site-site-shows-US1-TC5-2: The records list the five editions newest first

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

1. Open <grade10 shows url>.
2. Scroll to the Event Records section.

**Expected Results:**

* The five editions appear in order: Seoul Auction Private Sale &
  Exhibition (2026), Grade10 FEST Summer 2026 (2026), CARDJOY × Grade10
  Shanghai (2026), CARDJOY × Grade10 Hangzhou (2026), Grade10 Festival
  2025 (2025), each with title, description and image.
* The Seoul Auction record names its partner Seoul Auction × ZZZ.

<!-- trace:case id=g10.site-shows.TC-fmt rev=1 -->
### grade10-site-site-shows-US1-TC6-1: Each format chapter carries its presentation and editions

**Classification:**

* **Severity:** major
* **Priority:** high
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

1. Open <grade10 shows url>.
2. Scroll to the Hong Kong chapter.
3. Scroll to the Overseas Partnership chapter.
4. Scroll to the Chinese Mainland chapter.

**Expected Results:**

* Hong Kong introduces Grade10 FEST HK over a video poster and two
  edition cards: Grade10 FEST Summer 2026 and Grade10 Festival 2025.
* The Grade10 Festival 2025 card reads NOV 2025.
* Overseas Partnership introduces Seoul Auction × ZZZ over a photo
  with its caption and a Press Release link.
* Chinese Mainland introduces CARDJOY × Grade10 over a video poster and
  two edition cards: Shanghai and Hangzhou.
* Every edition card shows a photo carousel, a date, a description and a
  Press Release link.

<!-- trace:case id=g10.site-shows.TC-jmp rev=1 -->
### grade10-site-site-shows-US1-TC7-1: A jump control scrolls to its chapter and marks it

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
* **Trace:** grade10-site-site-shows-US-01

**Pre-conditions:**
None.

**Test data:**

| `<start>` | `<control>` | `<target>` |
| --- | --- | --- |
| the top of the page | the Explore Shows action in the hero | the Event Formats section, Hong Kong first |
| the top of the Event Formats section | the Overseas Partnership link in the chapter list | the Overseas Partnership chapter |
| the top of the Event Formats section | the Chinese Mainland link in the chapter list | the Chinese Mainland chapter |
| the Chinese Mainland chapter | the Hong Kong link in the chapter list | the Hong Kong chapter |

**Steps:**

1. Open <grade10 shows url>.
2. Scroll to `<start>`.
3. Select `<control>`.

**Expected Results:**

* The page scrolls until `<target>` sits at the top of the view, just
  below the chapter list.
* The chapter list marks the chapter now in view as current.
* The other chapters stay on the page, above or below `<target>`.
* The page does not navigate away from Shows.

<!-- trace:case id=g10.site-shows.TC-spy rev=1 -->
### grade10-site-site-shows-US1-TC8-1: Scrolling through the chapters moves the current mark

**Classification:**

* **Severity:** minor
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

1. Open <grade10 shows url>.
2. Scroll down through the Hong Kong chapter.
3. Scroll on into the Overseas Partnership chapter.
4. Scroll on into the Chinese Mainland chapter.
5. Scroll back up into the Hong Kong chapter.

**Expected Results:**

* The chapter list stays pinned in view while the chapters scroll under it.
* At each step the list marks the chapter in view as current, and only
  that one.
* Scrolling back up returns the mark to Hong Kong.

<!-- trace:case id=g10.site-shows.TC-upl rev=1 -->
### grade10-site-site-shows-US1-TC9-1: The Upcoming Shows card keeps a show through its month

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-shows-US-01

**Pre-conditions:**

* The date the page reads is set to `<today>`.

**Test data:**

| `<entry>` | `<today>` |
| --- | --- |
| a show the Upcoming Shows card carries (any) | a day in the month before `<entry>`'s month |
| the same show | the first day of `<entry>`'s month |
| the same show | the last day of `<entry>`'s month (fixed boundary) |

**Steps:**

1. Open <grade10 shows url>.
2. Read the Upcoming Shows card in the hero.

**Expected Results:**

* The card is in the hero and lists `<entry>` with its date.

<!-- trace:case id=g10.site-shows.TC-upd rev=1 -->
### grade10-site-site-shows-US1-TC10-1: A show drops off the card once its month has passed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-shows-US-01

**Pre-conditions:**

* The date the page reads is set to `<today>`.

**Test data:**

| Field | Value |
| --- | --- |
| `earlier entry` | a show the Upcoming Shows card carries, dated before another it carries |
| `later entry` | a show the card carries, dated in a later month than `<earlier entry>` |
| `today` | the first day of the month after `<earlier entry>`'s month (fixed boundary), and not after `<later entry>`'s month |

**Steps:**

1. Open <grade10 shows url>.
2. Read the Upcoming Shows card in the hero.

**Expected Results:**

* The card does not list `<earlier entry>`.
* The card still lists `<later entry>`.

<!-- trace:case id=g10.site-shows.TC-uph rev=1 -->
### grade10-site-site-shows-US1-TC11-1: The Upcoming Shows card leaves the hero when none remain

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-shows-US-01

**Pre-conditions:**

* The date the page reads is set to `<today>`.

**Test data:**

| Field | Value |
| --- | --- |
| `last entry` | the latest-dated show the Upcoming Shows card carries |
| `today` | the first day of the month after `<last entry>`'s month (fixed boundary) |

**Steps:**

1. Open <grade10 shows url>.
2. Read the hero.

**Expected Results:**

* The hero shows no Upcoming Shows card and no empty frame in its place.
* The hero's heading and its Explore Shows and Press Releases actions
  still show.

## grade10-site-site-shows-US2: Collector follows a link from Shows to a press surface

**As a** collector,
**I want** each Press Release link on the Shows page to take me to the
article it names,
**so that** a show's coverage is a door to the report rather than dead
text.

<!-- trace:case id=g10.site-shows.TC-hli rev=1 covers=g10.site-shows.SC-e1r -->
### grade10-site-site-shows-US2-TC1-1: Press-release links open their articles

Runs once per row of **Test data**.

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

**Test data:**

| `<link>` | `<destination>` |
| --- | --- |
| the Press Releases action in the hero | `/press-releases` |
| the Press Release link on the Grade10 FEST Summer 2026 edition card | `/press-releases/grade10-fest-summer-2026-concludes-successfully` |
| the Press Release link on the Grade10 Festival 2025 edition card | `/press-releases/psa-10-pikachu-wall-grade10-card-fest` |
| the Press Release link in the Seoul Auction × ZZZ chapter | `/press-releases/grade10-south-korea-seoul-auction` |
| the Press Release link on the Shanghai edition card | `/press-releases/cardjoy-grade10-shanghai-expansion` |
| the Press Release link on the Hangzhou edition card | `/press-releases/cardjoy-grade10-hangzhou-show` |

**Steps:**

1. Open <grade10 shows url>.
2. Scroll to `<link>`.
3. Select `<link>`.

**Expected Results:**

* The site opens `<destination>`.

## grade10-site-site-shows-US3: Collector watches a show video in place

**As a** collector,
**I want** the chapter videos to play inside the page when I click the
poster,
**so that** I can see a show's atmosphere without leaving the page or
opening a new tab.

<!-- trace:case id=g10.site-shows.TC-vid rev=2 covers=g10.site-shows.SC-59c -->
### grade10-site-site-shows-US3-TC1-2: A chapter video plays in its container

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

1. Open <grade10 shows url>.
2. Scroll to the Hong Kong chapter's video.
3. Select the play control on the poster.
4. Scroll to the Chinese Mainland chapter's video.
5. Select the play control on the poster.

**Expected Results:**

* Each container first shows the event poster with its badge and a play
  control.
* On selection the YouTube embed replaces the poster inside the same
  container and plays — Hong Kong plays `Nf4UZyct5uM`, Chinese Mainland
  plays `fy7AfZ8ZhQo`.
* The page does not navigate and no new tab opens.

## Settled

- The Festival 2025 card reads NOV 2025, the live page's date (Q7).
- The chapter tabs are jump navigation over stacked chapters (Q1).
- The Shows chrome entry belongs to `navigation`, not to this page (Q6).

## Reconciliation

- **Run** — the cases above were drafted in the same context that wrote the
  journeys and the spec, not by an isolated blind pass; the suite is written
  from the journeys and feature set, and no `## Requirements` content was
  used to shape a case. The isolated-input property is therefore claimed,
  not demonstrated, and a later blind pass on the durable artifacts may
  still raise findings.
