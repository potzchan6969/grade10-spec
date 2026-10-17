# grade10-site/site/shows Specification

## Purpose
What the Shows surface tells a collector about the events: the next dates,
the scale the shows reach, the three format chapters with their editions,
and the record of every show — and where each link on it leads.

## Feature set

- What the page tells
  - Hero: Grade10 Shows over the page's top-level heading, beside a Latest
    Shows card listing the next three dates
  - Event scale: a statement about physical proof over a show-floor photo
    and three statistic cards
  - Event formats: three chapters — Hong Kong, Overseas Partnership,
    Chinese Mainland — each with an intro, a video or photo presentation,
    and edition cards carrying a carousel and a press-release link
  - Event records: the five editions newest first
- What plays in place
  - Chapter videos show a poster and play affordance, then embed the
    YouTube video in the same container
  - Edition carousels page through the edition's photos with arrows and
    progress dots
- Where the links lead
  - Press Releases opens `/press-releases`
  - Each edition's Press Release opens `/press-releases/{slug}`

## ADDED Requirements

### Requirement: The page presents the events
The Shows surface SHALL present, in order: Grade10 Shows as the eyebrow
over the top-level heading "Where Cards Come Alive. Where Collectors
Belong." beside a Latest Shows card, an Event Scale section headed "Real
Trends. In the Room." with three statistic cards, an Event Formats section
headed "Three Platforms. One Community." carrying the Hong Kong, Overseas
Partnership and Chinese Mainland chapters, and an Event Records section
headed "Every Show. A Milestone.".

<!-- trace:scenario id=g10.site-shows.SC-zem rev=1 -->
#### Scenario: grade10-site-site-shows-SC-01 - A collector reads the page top to bottom
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector opens `/shows`
- **THEN** the page SHALL show the hero, the event-scale statistics, the
  three event-format chapters, and the event-records timeline, in that
  order

### Requirement: The page fits the viewport
On a wide viewport the Shows surface SHALL lay the hero beside the Latest
Shows card, the statistics beside the photo, the editions side by side,
and each record's image beside its text; on a narrow viewport it SHALL
stack every section at the page inset.

<!-- trace:scenario id=g10.site-shows.SC-20b rev=1 -->
#### Scenario: grade10-site-site-shows-SC-02 - The page splits into columns on a wide viewport
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector opens `/shows` on a wide viewport
- **THEN** the hero SHALL sit beside the Latest Shows card, the statistics
  SHALL sit beside the photo, editions SHALL sit two per row, and records
  SHALL lay image beside text

<!-- trace:scenario id=g10.site-shows.SC-npo rev=1 -->
#### Scenario: grade10-site-site-shows-SC-03 - The page stacks on a narrow viewport
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector opens `/shows` on a narrow viewport
- **THEN** every section SHALL stack in the page's order at the page inset

### Requirement: Every link leads to its named surface
Each link on the Shows surface SHALL lead to the surface it names: the
hero Press Releases button to `/press-releases`, and each Press Release
link to that edition's press-release article:

| Link | Destination |
| --- | --- |
| Press Releases (hero) | `/press-releases` |
| Grade10 FEST Summer 2026 | `/press-releases/grade10-fest-summer-2026-concludes-successfully` |
| Grade10 Festival 2025 | `/press-releases/psa-10-pikachu-wall-grade10-card-fest` |
| Seoul Auction × Gana Art (chapter) | `/press-releases/grade10-south-korea-seoul-auction` |
| CARDJOY × Grade10 Shanghai | `/press-releases/cardjoy-grade10-shanghai-expansion` |
| CARDJOY × Grade10 Hangzhou | `/press-releases/cardjoy-grade10-hangzhou-show` |

<!-- trace:scenario id=g10.site-shows.SC-e1r rev=1 -->
#### Scenario: grade10-site-site-shows-SC-04 - A collector opens an edition's press release
**Serves:** grade10-site-site-shows-US-02 - Collector follows a link from Shows to a press surface

- **WHEN** a collector opens an edition's Press Release link
- **THEN** the edition's press-release article SHALL open in place

### Requirement: Videos play inside the page
Each chapter video SHALL show the event poster with a play affordance and,
when the collector activates it, SHALL embed the named YouTube video
inside the same container without navigating away.

<!-- trace:scenario id=g10.site-shows.SC-59c rev=1 -->
#### Scenario: grade10-site-site-shows-SC-05 - A collector plays a chapter video
**Serves:** grade10-site-site-shows-US-03 - Collector watches a show video in place

- **WHEN** a collector activates the play affordance on a chapter video
- **THEN** the poster SHALL be replaced by the named YouTube embed inside
  the same container

### Requirement: Carousels page the edition's photos
Each edition card SHALL page through that edition's photo set via its
previous/next arrows and its progress dots, showing one photo at a time
with the active dot marking the current one.

<!-- trace:scenario id=g10.site-shows.SC-ozy rev=1 -->
#### Scenario: grade10-site-site-shows-SC-06 - A collector pages an edition's carousel
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector activates the next arrow or another dot on an
  edition card
- **THEN** the card SHALL show the corresponding photo and mark its dot
  current

### Requirement: The records read in frame order
The Event Records section SHALL list the five editions in the frame's
order — Seoul Auction Private Sale & Exhibition, Grade10 FEST Summer 2026,
CARDJOY × Grade10 Shanghai, CARDJOY × Grade10 Hangzhou, Grade10 Festival
2025 — each with its year, title, description and image.

<!-- trace:scenario id=g10.site-shows.SC-aa1 rev=1 -->
#### Scenario: grade10-site-site-shows-SC-07 - A collector reads the records
**Serves:** grade10-site-site-shows-US-01 - Collector sizes up the shows

- **WHEN** a collector reads the event records
- **THEN** the five editions SHALL appear in the frame's order with their
  years, titles, descriptions and images
