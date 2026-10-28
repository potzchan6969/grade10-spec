# grade10-site/site/shows Test Cases

**Status:** pending-review · 0/18
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

* The published shows are the workbench sample content (three chapters,
  the sample statistics and records); against other published content the
  names and values below are that content's.
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
* Wherever the page names the Seoul partner, it reads ZZZ.

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
* Every chapter in the chapter list can be reached and selected.
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
* The published shows are the workbench sample content; against other
  published content the editions, chapters and ids named below are that
  content's.

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
6. Select the previous arrow on the card.
7. Select the next arrow on the card.

**Expected Results:**

* Left alone for `<idle wait>`, the carousel stays on its first photo.
* The next arrow advances the photo and marks the second dot current.
* The first dot returns the first photo and marks itself current.
* The previous arrow on the first photo wraps round to the last photo and
  marks the last dot current.
* The next arrow on the last photo wraps round to the first photo and
  marks the first dot current.

<!-- trace:case id=g10.site-shows.TC-rec rev=2 covers=g10.site-shows.SC-aa1 -->
### grade10-site-site-shows-US1-TC5-2: The records list every published record in the order given

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

* The Shows content the admin published carries `<records>`.

**Test data:**

| Field | Value |
| --- | --- |
| `records` | the records the admin published, in the order the admin gave them (range: one or more); today five: Seoul Auction Private Sale & Exhibition (2026), Grade10 FEST Summer 2026 (2026), CARDJOY × Grade10 Shanghai (2026), CARDJOY × Grade10 Hangzhou (2026), Grade10 Festival 2025 (2025) |

**Steps:**

1. Open <grade10 shows url>.
2. Scroll to the Event Records section.

**Expected Results:**

* Every record in `<records>` appears, and no other, in the order
  `<records>` gives them, each with its year, title, description and
  image.
* The Seoul Auction record names its partner Seoul Auction × ZZZ.

<!-- trace:case id=g10.site-shows.TC-fmt rev=1 covers=g10.site-shows.SC-zdn -->
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

* The published shows are the workbench sample content; against other
  published content the chapters below are that content's.
* The Seoul Auction × ZZZ chapter's press release is published.

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

<!-- trace:case id=g10.site-shows.TC-jmp rev=1 covers=g10.site-shows.SC-jn1 -->
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
* The published shows are the workbench sample content; against other
  published content the editions, chapters and ids named below are that
  content's.

**Test data:**

| `<start>` | `<control>` | `<target>` | `<fragment>` |
| --- | --- | --- | --- |
| the top of the page | the Explore Shows action in the hero | the top of the Event Formats section, its heading and chapter list | `#shows-formats` |
| the top of the Event Formats section | the chapter list's link to the Overseas Partnership chapter | the Overseas Partnership chapter | `#overseas` |
| the top of the Event Formats section | the chapter list's link to the Chinese Mainland chapter | the Chinese Mainland chapter | `#chinese-mainland` |
| the Chinese Mainland chapter | the chapter list's link to the Hong Kong chapter | the Hong Kong chapter | `#hong-kong` |

**Steps:**

1. Open <grade10 shows url>.
2. Scroll to `<start>`.
3. Select `<control>`.
4. Go Back in the browser.

**Expected Results:**

* The page scrolls until `<target>` sits at the top of the view.
* The address reads <grade10 shows url> followed by `<fragment>`, and the
  page stays Shows.
* The chapter list marks the chapter now in view as current.
* The other chapters stay on the page, above or below `<target>`.
* Back restores the address it had before `<control>` and returns the page
  to `<start>`.

<!-- trace:case id=g10.site-shows.TC-spy rev=1 covers=g10.site-shows.SC-vd3 -->
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
* The published shows are the workbench sample content; against other
  published content the editions, chapters and ids named below are that
  content's.

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

<!-- trace:case id=g10.site-shows.TC-upl rev=1 covers=g10.site-shows.SC-m8p -->
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

* The device runs in `<device zone>`, its clock set so that the moment in
  Hong Kong is `<today>`.

**Test data:**

| `<entry>` | `<today>` | `<device zone>` |
| --- | --- | --- |
| a show the Upcoming Shows card carries (any) | a day in the month before `<entry>`'s month | Asia/Hong_Kong |
| the same show | the first day of `<entry>`'s month | Asia/Hong_Kong |
| the same show | the last day of `<entry>`'s month (fixed boundary) | Asia/Hong_Kong |
| the same show | 23:30 on the last day of `<entry>`'s month (fixed boundary, Hong Kong time) | Pacific/Auckland, where the next month has already begun |

**Steps:**

1. Open <grade10 shows url>.
2. Read the Upcoming Shows card in the hero.

**Expected Results:**

* The card is in the hero and lists `<entry>` with its date.

<!-- trace:case id=g10.site-shows.TC-upd rev=1 covers=g10.site-shows.SC-up1 -->
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

* The device runs in `<device zone>`, its clock set so that the moment in
  Hong Kong is `<today>`.

**Test data:**

| Field | Value |
| --- | --- |
| `earlier entry` | a show the Upcoming Shows card carries, dated before another it carries |
| `later entry` | a show the card carries, dated in a later month than `<earlier entry>` |
| `today` | 09:00 Hong Kong time on the first day of the month after `<earlier entry>`'s month (fixed boundary), and not after `<later entry>`'s month |
| `device zone` | America/Los_Angeles, where `<earlier entry>`'s month has not yet ended |

**Steps:**

1. Open <grade10 shows url>.
2. Read the Upcoming Shows card in the hero.

**Expected Results:**

* The card does not list `<earlier entry>`.
* The card still lists `<later entry>`.

<!-- trace:case id=g10.site-shows.TC-uph rev=1 covers=g10.site-shows.SC-bx1 -->
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

* The device's clock is set so that the date in Hong Kong is `<today>`.

**Test data:**

| Field | Value |
| --- | --- |
| `last entry` | the latest-dated show the Upcoming Shows card carries |
| `today` | the first day of the month after `<last entry>`'s month in Hong Kong (fixed boundary) |

**Steps:**

1. Open <grade10 shows url>.
2. Read the hero.

**Expected Results:**

* The hero shows no Upcoming Shows card and no empty frame in its place.
* The hero's heading and its Explore Shows and Press Releases actions
  still show.

<!-- trace:case id=g10.site-shows.TC-lng rev=1 covers=g10.site-shows.SC-lng -->
### grade10-site-site-shows-US1-TC12-1: Published shows read in the reader's language

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

* The published Shows content carries `<show>` with its words in every
  language the rows name.

**Test data:**

| `<reader language>` | `<show>` | `<title>` |
| --- | --- | --- |
| English | a published show with an edition card and a record (any) | the title the admin published for `<show>` in English |
| a language the site offers other than English (any) | the same show | the title the admin published for `<show>` in `<reader language>` |

**Steps:**

1. Open <grade10 shows url> at `<reader language>`'s address.
2. Scroll to `<show>`'s edition card.
3. Scroll to the Event Records section.

**Expected Results:**

* The edition card reads `<title>`, its description in `<reader language>`.
* The edition card's date reads in `<reader language>`.
* `<show>`'s record reads `<title>`, its description in
  `<reader language>`.
* None of `<show>`'s words show in another language.

<!-- trace:case id=g10.site-shows.TC-nf4 rev=1 covers=g10.site-shows.SC-pub -->
### grade10-site-site-shows-US1-TC14-1: The page answers not found when nothing is published

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-shows-US-01

**Pre-conditions:**

* The admin has not published the Shows content.

**Steps:**

1. Open <grade10 shows url>.

**Expected Results:**

* The site's not-found page shows.
* No Shows hero, section or empty Shows frame shows.

<!-- trace:case id=g10.site-shows.TC-o3j rev=1 covers=g10.site-shows.SC-dfo -->
### grade10-site-site-shows-US1-TC15-1: A show with no words in the reader's language reads in its base text

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

* The published Shows content carries `<show>` with its words in English
  only.

**Test data:**

| Field | Value |
| --- | --- |
| `reader language` | a language the site offers other than English (any) |
| `show` | a published show with an edition card and a record (any) |
| `base title` | the title the admin published for `<show>` in English |

**Steps:**

1. Open <grade10 shows url> at `<reader language>`'s address.
2. Scroll to `<show>`'s edition card.
3. Scroll to the Event Records section.

**Expected Results:**

* The Shows page shows, not the site's not-found page.
* The edition card reads `<base title>` and its English description, with
  no empty title or description.
* `<show>`'s record reads `<base title>` and its English description.

## grade10-site-site-shows-US2: Collector follows a link from Shows to a press surface

**As a** collector,
**I want** each Press Release link on the Shows page to take me to the
article it names,
**so that** a show's coverage is a door to the report rather than dead
text.

<!-- trace:case id=g10.site-shows.TC-hli rev=2 covers=g10.site-shows.SC-e1r -->
### grade10-site-site-shows-US2-TC1-2: Press-release links open their articles once published

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

* Each edition's press release, and the Seoul Auction × ZZZ chapter's,
  is published.

**Test data:**

| `<link>` | `<destination>` |
| --- | --- |
| the Press Releases action in the hero | `/press-releases` |
| the Press Release link on the Grade10 FEST Summer 2026 edition card | `/press-releases/` and its published release's slug, today `grade10-fest-summer-2026-concludes-successfully` |
| the Press Release link on the Grade10 Festival 2025 edition card | `/press-releases/` and its published release's slug, today `psa-10-pikachu-wall-grade10-card-fest` |
| the Press Release link in the Seoul Auction × ZZZ chapter | `/press-releases/` and its published release's slug, today `grade10-south-korea-seoul-auction` |
| the Press Release link on the Shanghai edition card | `/press-releases/` and its published release's slug, today `cardjoy-grade10-shanghai-expansion` |
| the Press Release link on the Hangzhou edition card | `/press-releases/` and its published release's slug, today `cardjoy-grade10-hangzhou-show` |

**Steps:**

1. Open <grade10 shows url>.
2. Scroll to `<link>`.
3. Select `<link>`.

**Expected Results:**

* The site opens `<destination>`.

<!-- trace:case id=g10.site-shows.TC-idx rev=1 covers=g10.site-shows.SC-rel -->
### grade10-site-site-shows-US2-TC2-1: An edition without a published release leads to the press index

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-shows-US-02

**Pre-conditions:**

* The published shows are the workbench sample content; against other
  published content the editions, chapters and ids named below are that
  content's.

* The published Shows content carries `<edition>`, and its press release
  is `<release state>`.

**Test data:**

| `<edition>` | `<release state>` |
| --- | --- |
| an edition card in the Hong Kong chapter (any) | not written |
| an edition card in the Chinese Mainland chapter (any) | written and not published |

**Steps:**

1. Open <grade10 shows url>.
2. Scroll to `<edition>`.
3. Select the Press Release link on `<edition>`.

**Expected Results:**

* `<edition>` shows its Press Release link.
* The site opens `/press-releases`, not an article address.

<!-- trace:case id=g10.site-shows.TC-nol rev=1 covers=g10.site-shows.SC-4qx -->
### grade10-site-site-shows-US2-TC3-1: A chapter without a published release shows no link

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-shows-US-02

**Pre-conditions:**

* The published shows are the workbench sample content; against other
  published content the editions, chapters and ids named below are that
  content's.

* The Seoul Auction × ZZZ chapter's press release is not published.

**Steps:**

1. Open <grade10 shows url>.
2. Scroll to the Overseas Partnership chapter.

**Expected Results:**

* The chapter shows its intro, photo and caption.
* No Press Release link or control shows in the chapter.

## grade10-site-site-shows-US3: Collector watches a show video in place

**As a** collector,
**I want** the chapter videos to play inside the page when I click the
poster,
**so that** I can see a show's atmosphere without leaving the page or
opening a new tab.

<!-- trace:case id=g10.site-shows.TC-vid rev=3 covers=g10.site-shows.SC-59c -->
### grade10-site-site-shows-US3-TC1-3: One selection plays a chapter video in its container

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
* The published shows are the workbench sample content; against other
  published content the editions, chapters and ids named below are that
  content's.

**Steps:**

1. Open <grade10 shows url>.
2. Scroll to the Hong Kong chapter's video.
3. Select the play control on the poster.
4. Scroll to the Chinese Mainland chapter's video.
5. Select the play control on the poster.
6. Scroll back to the Hong Kong chapter's video.

**Expected Results:**

* Each container first shows the event poster with its badge and a play
  control.
* On selection the YouTube embed replaces the poster inside the same
  container — Hong Kong embeds `Nf4UZyct5uM`, Chinese Mainland embeds
  `fy7AfZ8ZhQo`.
* That one selection starts the video playing, with its sound on; its time
  advances with no further selection on the embed.
* The page does not navigate and no new tab opens.
* Starting the Chinese Mainland video leaves the Hong Kong container
  holding its embed; the page does not return it to its poster.

## Settled

- The Festival 2025 card reads NOV 2025, the live page's date (Q7).
- The chapter tabs are jump navigation over stacked chapters (Q1).
- The Shows chrome entry belongs to `navigation`, not to this page (Q6).
- The Seoul partner is ZZZ wherever the page names it (Q8).
- The page's content is what the admin publishes, in the reader's language; the section copy and button words are code (Q9).
- A Press Release link opens its `/press-releases/{slug}` article only once that release is published; an edition without one leads to `/press-releases`, and a chapter without one shows no link (Q10).
- The Upcoming Shows card judges a show's month by the date in Hong Kong, whatever the viewer's time zone (Q11).
- The Upcoming Shows card lists its shows in the order the content gives; the block does not sort them (Q12).
- Explore Shows lands on the Event Formats section's top, `#shows-formats`, not the Hong Kong chapter (Q13).
- Each chapter jump is a hash link: the address carries the chapter's fragment, and Back returns (Q14).
- The chapter list stays sticky as the block draws it (Q15).
- An edition carousel's arrows wrap round at the first and last photo; no arrow is unavailable (Q16).
- Each chapter video plays on its own; starting one does not stop the other (Q17).
- With nothing published, `/shows` answers not found, not an empty page (Q18).
- One selection on a chapter video starts it playing; no second selection is needed (Q19).
- The admin publishes the shows as one document: a chapter is always on the page with the editions it holds, and a show has no published state of its own (Q20).
- Event Records lists every record the admin publishes, in the order it gives them; five is the workbench's sample, not a limit (Q21).
- A show with no words in the reader's language reads in its base text, not empty and not not found (Q22).
- The one-selection start plays with sound; the selection is the reader's own gesture (Q23).
- Where a browser will not start the embed from the selection, the player's own play control shows and a second tap starts it; this is not a failure (Q24).

## Reconciliation

**Run:** 2026-10-28, round 3. QA1 ran a blind pass this round, in an isolated context, on the frozen anchors `grade10-site-site-shows-US-01` to `grade10-site-site-shows-US-03`, after the Feature set changed three anchors - Published content, a Press Release link opening its article only once published, and one click playing: it read the isolated bundle `docs/governance/specs-to-test-cases.md` names and the existing suite without this section, was denied every `## Requirements` section and scenario, gave `US1-TC6-1` a published-release pre-condition, revised `US2-TC1-1` to `US2-TC1-2` and `US3-TC1-2` to `US3-TC1-3`, added `US1-TC12-1`, `US1-TC13-1`, `US1-TC14-1`, `US2-TC2-1` and `US2-TC3-1`, and raised five questions, closed as Q20 to Q24. QA2 reconciled in a fresh context, reading the delta `spec.md`, `user-journeys.md`, `proposal.md`, `decisions.md`, `ui-design.md`, `tasks.md`, the Shows PRD page, the `ShowsPageBody` block, and the site's published-shows reading in the application repository (`showsPageOf`, `readIn`). This is the run's statement, not proof. No case has been accepted, so a draft reworded here keeps its `rev`.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-site-shows-US1-TC1-2` | Reached | `grade10-site-site-shows-SC-01` |
| `grade10-site-site-shows-US1-TC2-1` | Reached | `grade10-site-site-shows-SC-02` |
| `grade10-site-site-shows-US1-TC3-2` | Reached | `grade10-site-site-shows-SC-03` |
| `grade10-site-site-shows-US1-TC4-2` | Reached | `grade10-site-site-shows-SC-06` |
| `grade10-site-site-shows-US1-TC5-2` | Reached, adjusted | `grade10-site-site-shows-SC-07`. Q21: the records are every record the admin publishes, in its order, and five is the workbench's sample. The case named five fixed editions; it now takes `<records>` as the published list, today the same five, and checks every one and no other in that order. The requirement is renamed "The records read in the published order" and keeps the sample's five as its example; the Feature set's frozen "the five editions newest first" is left as it stands |
| `grade10-site-site-shows-US1-TC6-1` | Reached, adjusted in spec | `grade10-site-site-shows-SC-10`. QA1's new pre-condition, the chapter's release published, is Q10's: the chapter link shows only then. The requirement's Overseas Partnership line and `SC-10`'s WHEN now carry the same condition |
| `grade10-site-site-shows-US1-TC7-1` | Reached | `grade10-site-site-shows-SC-09` |
| `grade10-site-site-shows-US1-TC8-1` | Reached | `grade10-site-site-shows-SC-13` |
| `grade10-site-site-shows-US1-TC9-1` | Reached | `grade10-site-site-shows-SC-11` |
| `grade10-site-site-shows-US1-TC10-1` | Reached | `grade10-site-site-shows-SC-08` |
| `grade10-site-site-shows-US1-TC11-1` | Reached | `grade10-site-site-shows-SC-12` |
| `grade10-site-site-shows-US1-TC12-1` | Reached, adjusted | `grade10-site-site-shows-SC-16`, narrowed to a show that has words in the reader's language. The case opens the language's address, as the requirement names it, rather than setting a site language; gains the edition date, which `SC-16` states; and its "no published show's words show in another language" is narrowed to `<show>`, since under Q22 another show without a translation reads in its base text |
| `grade10-site-site-shows-US1-TC13-1` | Dropped, misreading | Q20: the admin publishes the shows as one document, so a show has no published state of its own, and "a show the admin has not published" is not a state the page has. Its three observations - off the Upcoming Shows card, off its chapter, off the records - have no starting state a tester can prepare. The number is not reused |
| `grade10-site-site-shows-US1-TC14-1` | Reached, adjusted | `grade10-site-site-shows-SC-15`. Its pre-condition "no show published" reads, by Q20, the Shows content not published; `SC-15`'s WHEN says the same |
| `grade10-site-site-shows-US1-TC15-1` | Added by QA2 | `grade10-site-site-shows-SC-18`, new. Q22 settles the fallback; a show read in its base text is the other direction of `US1-TC12-1`, so it is its own case. Base text is the English the admin wrote, as the site's `readIn` falls back |
| `grade10-site-site-shows-US2-TC1-2` | Reached | `grade10-site-site-shows-SC-04`, whose WHEN now names a link whose release is published, matching the case's pre-condition and Q10 |
| `grade10-site-site-shows-US2-TC2-1` | Reached | `grade10-site-site-shows-SC-14`, split to the edition: the link still shows and opens `/press-releases`. Its pre-condition reads the edition as part of the published content (Q20). The rows, a release not written and one written but not published, are both "not on the site" in the site's reading |
| `grade10-site-site-shows-US2-TC3-1` | Folded | `grade10-site-site-shows-SC-17`, new, split from `SC-14`'s chapter clause so each case fully asserts the scenario it covers; it carries the intro and presentation staying, which the case asserts |
| `grade10-site-site-shows-US3-TC1-3` | Reached, adjusted | `grade10-site-site-shows-SC-05`. Q23 adds "with its sound on" to the one-selection start; `SC-05` states it |
| `grade10-site-site-shows-SC-01` to `grade10-site-site-shows-SC-18` | Reached | each by the one case whose `covers` names it |

- **Raised** - QA1's five rows closed as Q20 to Q24, decided by the round; each answer, with Q9, Q10, Q18 and Q19 decided with the human, is in `## Settled`. Q20 went against QA1's recommendation and reframed it: there is no per-show published state, so a chapter is never removed. Q21 kept every published record but in the admin's order, not newest first. Q22 to Q24 took QA1's recommendation
- **Folded into spec** - `grade10-site-site-shows-SC-17` and `grade10-site-site-shows-SC-18` are new; `SC-04`, `SC-05`, `SC-07`, `SC-10`, `SC-14`, `SC-15` and `SC-16` now state what their cases assert. "The page shows what is published" now carries Q20's one document and Q22's base-text fallback; "Videos play inside the page" carries Q23's sound and Q24's second tap; the records requirement carries Q21
- **Contradicted** - `US1-TC13-1` against Q20, the author's decision; dropped above, and none is left open
- **Uncovered scenarios** - none: each of the eighteen scenarios is named in exactly one case's `covers`
- **Over-claimed cases** - none: each case fully asserts the THEN of the scenario it covers. Three rules stay in their requirement alone: Q12's order, which shows only as the list itself; Q20's chapter with no editions, which the Overseas Partnership chapter already shows as `US1-TC6-1` walks it; and Q24's second tap, since no anchor names a browser a tester can set up to refuse the embed's start
- **New, not an extension** - `grade10-site-site-shows-US1-TC6-1` - `US1-TC1-2` reads the sections' order and headings as the smoke case; what each chapter carries is a different purpose at a lower severity
- **New, not an extension** - `grade10-site-site-shows-US1-TC7-1` - no live case selects a jump control or reads the address
- **New, not an extension** - `grade10-site-site-shows-US1-TC8-1` - no live case scrolls through the chapters checking the list
- **New, not an extension** - `grade10-site-site-shows-US1-TC9-1` - no live case sets the clock; it keeps a show, the opposite direction of `US1-TC10-1`
- **New, not an extension** - `grade10-site-site-shows-US1-TC10-1` - no live case sets the clock; it drops a show, the opposite of `US1-TC9-1`
- **New, not an extension** - `grade10-site-site-shows-US1-TC11-1` - no live case sets the clock; the card leaves the hero, an outcome no other case reaches
- **New, not an extension** - `grade10-site-site-shows-US1-TC12-1` - no live case opens a language's address or prepares translated content
- **New, not an extension** - `grade10-site-site-shows-US1-TC14-1` - every other case starts with the content published; not found is an outcome no live case reaches
- **New, not an extension** - `grade10-site-site-shows-US1-TC15-1` - it reads in the base text, the other direction of `US1-TC12-1`
- **New, not an extension** - `grade10-site-site-shows-US2-TC2-1` - `US2-TC1-2` opens articles with every release published; leading to the index is the other direction
- **New, not an extension** - `grade10-site-site-shows-US2-TC3-1` - the chapter link hidden is the other direction of `US2-TC1-2`'s chapter row
