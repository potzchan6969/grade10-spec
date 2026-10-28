# grade10-site/site/shows Specification

## Purpose
What the Shows surface tells a collector about the events: the next dates,
the scale the shows reach, the format chapters with their editions,
and the record of every show — and where each link on it leads.

## Feature set

- What the page tells
  - Hero: Grade10 Shows over the page's top-level heading, beside an
    Upcoming Shows card listing the next dates — hidden when no show is
    current or upcoming
  - Event scale: a statement about physical proof over a show-floor photo
    and a statistic card for each published statistic
  - Event formats: the published chapters — in the sample Hong Kong, Overseas
    Partnership and Chinese Mainland — each with an intro, a video or photo presentation when it has one,
    and the edition cards it holds, carrying a carousel and a press-release
    link
  - Event records: every published record, in the order it gives them
  - Published content: the shows the admin has published, in the reader's
    language; nothing published answers not found
  - Jump navigation: the hero's Explore Shows and the sticky chapter list
    scroll to the Event Formats section or to their chapter, and the list
    marks the chapter in view
- What plays in place
  - Chapter videos show a poster and play affordance, then embed the
    YouTube video in the same container and start it playing
  - Edition carousels page through the edition's photos with arrows and
    progress dots
- Where the links lead
  - Press Releases opens `/press-releases` (every address here is at the
    reader's language)
  - Each edition's Press Release, and a chapter's, opens
    `/press-releases/{slug}` once that release is published; an edition
    without one leads to `/press-releases` and a chapter shows no link

## ADDED Requirements

### Requirement: The page presents the events
The Shows surface SHALL present, in order: Grade10 Shows as the eyebrow
over the top-level heading "Asia’s card shows, at full scale." with an
Explore Shows and a Press Releases action, beside an Upcoming Shows card
while a show is current or upcoming;
an Event Scale section headed "Real Trends. In the Room." with a
show-floor photo and a statistic card for each published statistic; an Event Formats section
headed "Three Platforms. One Community." with its chapter list over the
published chapters, stacked, one pill per chapter; and an Event Records section headed "Every
Show. A Milestone.".

Each published chapter SHALL present its title and intro, its video or
captioned photo when it has one, and its edition cards, and, while its release is
published, its Press Release link. Every edition card SHALL carry a photo
carousel, a date, a description and a Press Release link. The workbench's
sample content carries three chapters: Hong Kong, Grade10 FEST HK over its
video and two editions, Grade10 FEST Summer 2026 and Grade10 Festival 2025
dated NOV 2025; Overseas Partnership, Seoul Auction × ZZZ over a captioned
photo; and Chinese Mainland, CARDJOY × Grade10 over its video and two
editions, Shanghai and Hangzhou. The sample's statistics read 25,000+
visitors at Grade10 FEST Summer 2026, 120+ exhibitors and millions in
revenue for the industry. Wherever the sample names the Seoul partner, it
reads ZZZ.

The Upcoming Shows card SHALL list its shows in the order its content
gives them, only those whose month has not passed by the date in Hong
Kong, whatever the collector's own time zone, and SHALL leave the hero
when no show is current or upcoming.

<!-- trace:scenario id=g10.site-shows.SC-zem rev=1 -->
#### Scenario: grade10-site-site-shows-SC-01 - A collector reads the page top to bottom
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector opens `/shows` while at least one show is current
  or upcoming, with the workbench's sample content published
- **THEN** the page SHALL show, in this order: the hero, Grade10 Shows
  over the top-level heading with its Explore Shows and Press Releases
  actions beside the Upcoming Shows card; the Event Scale section with its
  photo and a card for each published statistic, three in the sample; the
  Event Formats section with its chapter list over every published chapter
  stacked, three in the sample; and the Event Records
  section, each under its heading
- **AND** wherever the page names the Seoul partner it SHALL read ZZZ

<!-- trace:scenario id=g10.site-shows.SC-zdn rev=1 -->
#### Scenario: grade10-site-site-shows-SC-10 - A collector reads the format chapters
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector scrolls through the Event Formats section with the
  workbench's sample content published and the Seoul Auction × ZZZ
  chapter's press release published
- **THEN** Hong Kong SHALL present Grade10 FEST HK over a video poster and
  the Grade10 FEST Summer 2026 and Grade10 Festival 2025 edition cards,
  the latter reading NOV 2025; Overseas Partnership SHALL present Seoul
  Auction × ZZZ over a captioned photo and a Press Release link, with no
  edition cards; and Chinese Mainland SHALL present CARDJOY × Grade10 over a video poster and
  the Shanghai and Hangzhou edition cards
- **AND** every edition card SHALL show a photo carousel, a date, a
  description and a Press Release link

<!-- trace:scenario id=g10.site-shows.SC-up1 rev=1 -->
#### Scenario: grade10-site-site-shows-SC-08 - A show leaves the Upcoming Shows card once its month has passed in Hong Kong
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector opens `/shows` on the first day after a listed
  show's month in Hong Kong, while a later listed show's month has not
  passed, from a time zone where that month has not yet ended
- **THEN** the Upcoming Shows card SHALL no longer list the passed show,
  and SHALL still list the later one

<!-- trace:scenario id=g10.site-shows.SC-m8p rev=1 -->
#### Scenario: grade10-site-site-shows-SC-11 - The Upcoming Shows card keeps a show through its month in Hong Kong
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector opens `/shows` on a day in Hong Kong before or
  within a listed show's month, up to its last day, including from a time
  zone where the next month has already begun
- **THEN** the Upcoming Shows card SHALL sit in the hero and list that
  show with its date

<!-- trace:scenario id=g10.site-shows.SC-bx1 rev=1 -->
#### Scenario: grade10-site-site-shows-SC-12 - The Upcoming Shows card leaves the hero when no show remains
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector opens `/shows` on the first day in Hong Kong after
  the last listed show's month
- **THEN** the hero SHALL show no Upcoming Shows card and no empty frame
  in its place, and SHALL still show its heading and its Explore Shows and
  Press Releases actions

### Requirement: The chapter list jumps to its chapter
The Explore Shows action SHALL be a hash link to the Event Formats
section's top, `#shows-formats`, and each pill in the chapter list SHALL be
a hash link to its chapter — the chapter's own id, in the sample
`#hong-kong`, `#overseas` and `#chinese-mainland`. Activating one SHALL scroll to its target without
hiding the other chapters and put its fragment in the address, so a
chapter can be shared and Back returns to where the collector was. The
chapter list SHALL stay pinned while the chapters scroll under it, as the
block draws it, and SHALL mark the chapter in view as active, and only
that one.

<!-- trace:scenario id=g10.site-shows.SC-jn1 rev=1 -->
#### Scenario: grade10-site-site-shows-SC-09 - A collector jumps to a chapter
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector activates Explore Shows or a pill in the chapter
  list
- **THEN** the page SHALL scroll to the Event Formats section's top or to
  that chapter, the address SHALL read `/shows` with its fragment, every
  chapter SHALL stay on the page, and the list SHALL mark the
  chapter in view active
- **AND** Back SHALL restore the previous address and return the page to
  where the collector was

<!-- trace:scenario id=g10.site-shows.SC-vd3 rev=1 -->
#### Scenario: grade10-site-site-shows-SC-13 - A collector scrolls through the chapters
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector scrolls down through the chapters and back up
- **THEN** the chapter list SHALL stay pinned in view while the chapters
  scroll under it, and SHALL mark the chapter in view active, and only
  that one, at every point

### Requirement: The page fits the viewport
On a wide viewport the Shows surface SHALL lay the hero beside the
Upcoming Shows card while it shows, the statistics beside the photo, the editions side by
side,
and each record's image beside its text; on a narrow viewport it SHALL
stack every section at the page inset, each record's image over its text,
with the whole chapter list reachable and nothing scrolling the page
sideways.

<!-- trace:scenario id=g10.site-shows.SC-20b rev=1 -->
#### Scenario: grade10-site-site-shows-SC-02 - The page splits into columns on a wide viewport
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector opens `/shows` on a wide viewport while at least
  one show is current or upcoming
- **THEN** the hero SHALL sit beside the Upcoming Shows card, the
  statistics SHALL sit beside the photo, editions SHALL sit two per row,
  and records SHALL lay image beside text

<!-- trace:scenario id=g10.site-shows.SC-npo rev=1 -->
#### Scenario: grade10-site-site-shows-SC-03 - The page stacks on a narrow viewport
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector opens `/shows` on a narrow viewport
- **THEN** every section SHALL stack in the page's order at the page inset,
  records SHALL stack image over text, every chapter in the chapter list
  SHALL be reachable, and the page SHALL NOT scroll sideways

### Requirement: Every link leads to its named surface
Every address on this surface, and the page's own, SHALL be at the
address of the reader's language. The hero Press Releases button SHALL
lead to `/press-releases`. A Press
Release link on an edition or a chapter SHALL lead to that release's
`/press-releases/{slug}` article,
only when the release is published on the site; an edition whose release is not published SHALL lead to
`/press-releases` instead, and a chapter whose release is not published
SHALL show no link. The workbench's sample content links:

| Link | Destination |
| --- | --- |
| Press Releases (hero) | `/press-releases` |
| Grade10 FEST Summer 2026 | `/press-releases/grade10-fest-summer-2026-concludes-successfully` |
| Grade10 Festival 2025 | `/press-releases/psa-10-pikachu-wall-grade10-card-fest` |
| Seoul Auction × ZZZ (chapter) | `/press-releases/grade10-south-korea-seoul-auction` |
| CARDJOY × Grade10 Shanghai | `/press-releases/cardjoy-grade10-shanghai-expansion` |
| CARDJOY × Grade10 Hangzhou | `/press-releases/cardjoy-grade10-hangzhou-show` |

<!-- trace:scenario id=g10.site-shows.SC-e1r rev=1 -->
#### Scenario: grade10-site-site-shows-SC-04 - A collector opens an edition's press release
**Serves:** grade10-site-site-shows-US-02 - Collector follows a link from Shows to a press surface

- **WHEN** a collector opens the hero Press Releases button, or a Press
  Release link whose release is published, with the workbench's sample
  content
- **THEN** the site SHALL open that link's destination address from the
  table

<!-- trace:scenario id=g10.site-shows.SC-rel rev=1 -->
#### Scenario: grade10-site-site-shows-SC-14 - An edition whose release is not published leads to the press index
**Serves:** grade10-site-site-shows-US-02 - Collector follows a link from Shows to a press surface

- **WHEN** a collector opens an edition's Press Release link while that
  edition's press release is not written or not published
- **THEN** the edition card SHALL still show its Press Release link, and
  the site SHALL open `/press-releases`, not an article address

<!-- trace:scenario id=g10.site-shows.SC-4qx rev=1 -->
#### Scenario: grade10-site-site-shows-SC-17 - A chapter whose release is not published shows no link
**Serves:** grade10-site-site-shows-US-02 - Collector follows a link from Shows to a press surface

- **WHEN** a collector reads a format chapter whose press release is not
  published
- **THEN** the chapter SHALL show no Press Release link, and SHALL still
  show its intro, its presentation if it has one, and its editions

### Requirement: The page shows what is published
The Shows surface SHALL present the Shows content the admin publishes, as
one document, in the language the address names; a published value with no
words in that language SHALL read in its base text, English. Each format chapter
SHALL stay on the page with the editions the document gives it, and a
chapter given none SHALL show no edition cards: a show has no published
state of its own. When the Shows content is not published the surface SHALL
answer not found, not an empty page.

<!-- trace:scenario id=g10.site-shows.SC-pub rev=1 -->
#### Scenario: grade10-site-site-shows-SC-15 - A collector opens the page with nothing published
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector opens `/shows` while the admin has not published the
  Shows content
- **THEN** the site SHALL answer not found and SHALL NOT draw an empty page

<!-- trace:scenario id=g10.site-shows.SC-lng rev=1 -->
#### Scenario: grade10-site-site-shows-SC-16 - A collector reads the page in their language
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector opens `/shows` at a language's address, and a
  published show has its words in that language
- **THEN** that show's title and description, and its date, SHALL read in
  that language

<!-- trace:scenario id=g10.site-shows.SC-dfo rev=1 -->
#### Scenario: grade10-site-site-shows-SC-18 - A show with no words in the reader's language reads in its base text
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector opens `/shows` at a language's address, and a
  published show has no words in that language
- **THEN** that show's title and description SHALL read in its base text,
  not empty
- **AND** `/shows` SHALL still draw the page rather than answer not found

### Requirement: Videos play inside the page
Each chapter video SHALL show the event poster with a play affordance and,
when the collector activates it, SHALL embed the named YouTube video
inside the same container without navigating away and start it playing,
with sound, on that one activation. Where a browser will not start the
embed from the activation, the embed SHALL show the player's own play
control and a second activation there SHALL start it. Each video plays on
its own: starting one SHALL NOT stop the other or return it to its poster.

<!-- trace:scenario id=g10.site-shows.SC-59c rev=1 -->
#### Scenario: grade10-site-site-shows-SC-05 - A collector plays a chapter video
**Serves:** grade10-site-site-shows-US-03 - Collector watches a show video in place

- **WHEN** a collector activates the play affordance on a chapter video
- **THEN** the poster SHALL be replaced by the named YouTube embed inside
  the same container, the video SHALL start playing with sound on that one
  activation, and the page SHALL NOT navigate or open a tab
- **AND** an embed already started in the other chapter SHALL stay in its
  container, not returned to its poster

### Requirement: Carousels page the edition's photos
Each edition card SHALL page through that edition's photo set via its
previous/next arrows and its progress dots, showing one photo at a time
with the active dot marking the current one. The arrows SHALL wrap round:
next from the last photo to the first, previous from the first to the
last. A carousel SHALL NOT advance on its own.

<!-- trace:scenario id=g10.site-shows.SC-ozy rev=1 -->
#### Scenario: grade10-site-site-shows-SC-06 - A collector pages an edition's carousel
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector leaves an edition card alone, then activates its
  arrows or another dot
- **THEN** the card SHALL stay on its photo while left alone, and SHALL
  show the corresponding photo and mark its dot current on each arrow or
  dot
- **AND** previous at the first photo SHALL wrap round to the last, and
  next at the last to the first

### Requirement: The records read in the published order
The Event Records section SHALL list every record the admin publishes, in
the order it gives them, each with its year, title, description and image. The workbench's sample
content carries five, in this order: Seoul Auction Private Sale &
Exhibition, naming its partner Seoul Auction × ZZZ, Grade10 FEST Summer
2026, CARDJOY × Grade10 Shanghai, CARDJOY × Grade10 Hangzhou, Grade10
Festival 2025 (2025).

<!-- trace:scenario id=g10.site-shows.SC-aa1 rev=1 -->
#### Scenario: grade10-site-site-shows-SC-07 - A collector reads the records
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector reads the event records, with the workbench's
  sample content published
- **THEN** every record the admin published SHALL appear, in the order it
  gives them, with its year, title, description and image
- **AND** the Seoul Auction record SHALL name Seoul Auction × ZZZ, in the
  sample
