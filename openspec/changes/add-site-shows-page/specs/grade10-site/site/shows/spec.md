# grade10-site/site/shows Specification

## Purpose
What the Shows surface tells a collector about the events: the next dates,
the scale the shows reach, the three format chapters with their editions,
and the record of every show — and where each link on it leads.

## Feature set

- What the page tells
  - Hero: Grade10 Shows over the page's top-level heading, beside an
    Upcoming Shows card listing the next dates — hidden when no show is
    current or upcoming
  - Event scale: a statement about physical proof over a show-floor photo
    and three statistic cards
  - Event formats: three chapters — Hong Kong, Overseas Partnership,
    Chinese Mainland — each with an intro, a video or photo presentation,
    and edition cards carrying a carousel and a press-release link
  - Event records: the five editions newest first
  - Jump navigation: the hero's Explore Shows and the sticky chapter list
    scroll to their chapter, and the list marks the chapter in view
- What plays in place
  - Chapter videos show a poster and play affordance, then embed the
    YouTube video in the same container
  - Edition carousels page through the edition's photos with arrows and
    progress dots
- Where the links lead
  - Press Releases opens `/press-releases`
  - Each edition's Press Release, and the Seoul Auction × ZZZ
    chapter's, opens `/press-releases/{slug}`

## ADDED Requirements

### Requirement: The page presents the events
The Shows surface SHALL present, in order: Grade10 Shows as the eyebrow
over the top-level heading "Asia’s card shows, at full scale." with an
Explore Shows and a Press Releases action, beside an Upcoming Shows card;
an Event Scale section headed "Real Trends. In the Room." with a
show-floor photo and three statistic cards — 25,000+ visitors at Grade10
FEST Summer 2026, 120+ exhibitors, millions in revenue for the industry;
an Event Formats section headed "Three Platforms. One Community." with
its chapter list over the Hong Kong, Overseas Partnership and Chinese
Mainland chapters, stacked; and an Event Records section headed "Every
Show. A Milestone.".

Hong Kong SHALL present Grade10 FEST HK over its video and two edition
cards, Grade10 FEST Summer 2026 and Grade10 Festival 2025, the latter
dated NOV 2025. Overseas Partnership SHALL present Seoul Auction × ZZZ
over a captioned photo and its Press Release link. Chinese Mainland SHALL
present CARDJOY × Grade10 over its video and two edition cards, Shanghai
and Hangzhou. Every edition card SHALL carry a photo carousel, a date, a
description and a Press Release link. Wherever the page names the Seoul
partner, it SHALL read ZZZ.

The Upcoming Shows card SHALL list its shows in the order its content
gives them, only those whose month has not passed by the date in Hong
Kong, whatever the collector's own time zone, and SHALL leave the hero
when no show is current or upcoming.

<!-- trace:scenario id=g10.site-shows.SC-zem rev=1 -->
#### Scenario: grade10-site-site-shows-SC-01 - A collector reads the page top to bottom
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector opens `/shows` while at least one show is current
  or upcoming
- **THEN** the page SHALL show, in this order: the hero, Grade10 Shows
  over the top-level heading with its Explore Shows and Press Releases
  actions beside the Upcoming Shows card; the Event Scale section with its
  photo and three statistic cards; the Event Formats section with its
  chapter list over all three chapters stacked; and the Event Records
  section, each under its heading
- **AND** wherever the page names the Seoul partner it SHALL read ZZZ

<!-- trace:scenario id=g10.site-shows.SC-zdn rev=1 -->
#### Scenario: grade10-site-site-shows-SC-10 - A collector reads the format chapters
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector scrolls through the Event Formats section
- **THEN** Hong Kong SHALL present Grade10 FEST HK over a video poster and
  the Grade10 FEST Summer 2026 and Grade10 Festival 2025 edition cards,
  the latter reading NOV 2025; Overseas Partnership SHALL present Seoul
  Auction × ZZZ over a captioned photo and a Press Release link; and
  Chinese Mainland SHALL present CARDJOY × Grade10 over a video poster and
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
a hash link to its chapter — `#hong-kong`, `#overseas`,
`#chinese-mainland`. Activating one SHALL scroll to its target without
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
  that chapter, the address SHALL read `/shows` with its fragment, all
  three chapters SHALL stay on the page, and the list SHALL mark the
  chapter in view active
- **AND** Back SHALL restore the previous address and return the page to
  where the collector was

<!-- trace:scenario id=g10.site-shows.SC-vd3 rev=1 -->
#### Scenario: grade10-site-site-shows-SC-13 - A collector scrolls through the chapters
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector scrolls down through the three chapters and back up
- **THEN** the chapter list SHALL stay pinned in view while the chapters
  scroll under it, and SHALL mark the chapter in view active, and only
  that one, at every point

### Requirement: The page fits the viewport
On a wide viewport the Shows surface SHALL lay the hero beside the
Upcoming Shows card, the statistics beside the photo, the editions side by
side,
and each record's image beside its text; on a narrow viewport it SHALL
stack every section at the page inset, each record's image over its text,
with the whole chapter list reachable and nothing scrolling the page
sideways.

<!-- trace:scenario id=g10.site-shows.SC-20b rev=1 -->
#### Scenario: grade10-site-site-shows-SC-02 - The page splits into columns on a wide viewport
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector opens `/shows` on a wide viewport
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
Each link on the Shows surface SHALL lead to the surface it names: the
hero Press Releases button to `/press-releases`, and each Press Release
link, the Seoul Auction × ZZZ chapter's included, to that
press-release article. The links ship with the page and open their
addresses before the press index and articles land in their follow-on
change; what an address shows is the press surfaces' own:

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

- **WHEN** a collector opens the hero Press Releases button or a Press
  Release link
- **THEN** the site SHALL open that link's destination address from the
  table

### Requirement: Videos play inside the page
Each chapter video SHALL show the event poster with a play affordance and,
when the collector activates it, SHALL embed the named YouTube video
inside the same container without navigating away. Each video plays on its
own: starting one SHALL NOT stop the other or return it to its poster.

<!-- trace:scenario id=g10.site-shows.SC-59c rev=1 -->
#### Scenario: grade10-site-site-shows-SC-05 - A collector plays a chapter video
**Serves:** grade10-site-site-shows-US-03 - Collector watches a show video in place

- **WHEN** a collector activates the play affordance on a chapter video
- **THEN** the poster SHALL be replaced by the named YouTube embed inside
  the same container, and the page SHALL NOT navigate or open a tab
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

### Requirement: The records read in frame order
The Event Records section SHALL list the five editions in the frame's
order — Seoul Auction Private Sale & Exhibition, Grade10 FEST Summer 2026,
CARDJOY × Grade10 Shanghai, CARDJOY × Grade10 Hangzhou, Grade10 Festival
2025 (Nov 2025) — each with its year, title, description and image, the
Seoul Auction record naming its partner Seoul Auction × ZZZ.

<!-- trace:scenario id=g10.site-shows.SC-aa1 rev=1 -->
#### Scenario: grade10-site-site-shows-SC-07 - A collector reads the records
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector reads the event records
- **THEN** the five editions SHALL appear in the frame's order with their
  years, titles, descriptions and images, and the Seoul Auction record
  SHALL name Seoul Auction × ZZZ
