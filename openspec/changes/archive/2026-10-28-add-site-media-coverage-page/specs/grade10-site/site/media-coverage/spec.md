# grade10-site/site/media-coverage Specification

## Purpose
What the Media Coverage surface tells a collector about the record: the
stories the press has published about Grade10, each card naming its
publication and title — and where each story leads.

## Feature set

- What the page tells
  - Header: an IN THE NEWS eyebrow over the page's top-level heading
    "Media Coverage" and the external-reporting intro
  - The coverage as a grid of media cards, each naming its publication
    and title
- Where the links lead
  - Each media card opens its story on the publisher's site in a new tab

## ADDED Requirements

### Requirement: The page presents the coverage
The Media Coverage surface SHALL present, in order: an IN THE NEWS
eyebrow over the top-level heading "Media Coverage" and the
external-reporting intro, then the coverage as a grid of media cards,
each card naming the story's publication and title.

<!-- trace:scenario id=g10.site-media-coverage.SC-zem rev=1 -->
#### Scenario: grade10-site-site-media-coverage-SC-01 - A collector reads the page top to bottom
**Serves:** grade10-site-site-media-coverage-US-01 - Collector scans the media coverage

- **WHEN** a collector opens `/media-coverage`
- **THEN** the page SHALL show the heading block and the media cards,
  each card naming its story's publication and title

### Requirement: The page fits the viewport
On a wide viewport the Media Coverage surface SHALL lay the cards four
across in the frame's grid; on a narrow viewport it SHALL stack the
cards in a single column under the header.

<!-- trace:scenario id=g10.site-media-coverage.SC-20b rev=1 -->
#### Scenario: grade10-site-site-media-coverage-SC-02 - The cards run four across on a wide viewport
**Serves:** grade10-site-site-media-coverage-US-01 - Collector scans the media coverage

- **WHEN** a collector opens `/media-coverage` on a wide viewport
- **THEN** the media cards SHALL lay out four across in the grid

<!-- trace:scenario id=g10.site-media-coverage.SC-npo rev=1 -->
#### Scenario: grade10-site-site-media-coverage-SC-03 - The cards stack on a narrow viewport
**Serves:** grade10-site-site-media-coverage-US-01 - Collector scans the media coverage

- **WHEN** a collector opens `/media-coverage` on a narrow viewport
- **THEN** the media cards SHALL stack in a single column under the
  header

### Requirement: Every card leads to its story
Each media card on the Media Coverage surface SHALL be the link to that
story on the publisher's site, opening in a new tab — the card's
publication, title, and Read article affordance all activate the same
destination.

<!-- trace:scenario id=g10.site-media-coverage.SC-ozy rev=1 -->
#### Scenario: grade10-site-site-media-coverage-SC-04 - A collector opens a story
**Serves:** grade10-site-site-media-coverage-US-02 - Collector opens a story

- **WHEN** a collector opens a media card
- **THEN** that story's page on the publisher's site SHALL open in a new
  tab
- **AND** the card's publication, title, and Read article affordance
  SHALL each open that same destination

### Requirement: The cards keep the published order
The Media Coverage surface SHALL run the cards in the order the Admin
Portal publishes them.

<!-- trace:scenario id=g10.site-media-coverage.SC-h4k rev=1 -->
#### Scenario: grade10-site-site-media-coverage-SC-05 - The cards follow the published order
**Serves:** grade10-site-site-media-coverage-US-01 - Collector scans the media coverage

- **GIVEN** the Admin Portal has published several stories in a set order
- **WHEN** a collector opens `/media-coverage`
- **THEN** the media cards SHALL run in that order

### Requirement: A page with no coverage shows the header alone
While the Admin Portal has published no coverage, the Media Coverage
surface SHALL show the header block over an empty grid, with no
message.

<!-- trace:scenario id=g10.site-media-coverage.SC-q7m rev=1 -->
#### Scenario: grade10-site-site-media-coverage-SC-06 - No coverage is published
**Serves:** grade10-site-site-media-coverage-US-01 - Collector scans the media coverage

- **GIVEN** the Admin Portal has published no coverage
- **WHEN** a collector opens `/media-coverage`
- **THEN** the page SHALL show the heading block and no media cards
- **AND** the page SHALL show no empty-state message

### Requirement: A card marks a story in another language
A media card whose story is written in another language SHALL mark that
language on the card's link.

<!-- trace:scenario id=g10.site-media-coverage.SC-w2d rev=1 -->
#### Scenario: grade10-site-site-media-coverage-SC-07 - A story in another language is marked
**Serves:** grade10-site-site-media-coverage-US-02 - Collector opens a story

- **GIVEN** a published story is written in another language
- **WHEN** a collector views its media card
- **THEN** the card's link SHALL mark the story's language
