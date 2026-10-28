# grade10-site/site/press Specification

## Purpose

What the Press surface tells a collector about the record: the releases
Grade10 has published, grouped by year newest first, narrowable to a
single year — and where each release leads.

## Feature set

- What the page tells
  - Header: a PRESS eyebrow over the page's top-level heading "Press
    Releases" and the official-record intro, beside the year filter
  - The releases grouped under year headings, newest first
- What narrows in place
  - The All Time filter carries one option per year the record holds and
    narrows the list to the chosen year
- Where the links lead
  - Each release row opens `/press-releases/{slug}`
- What the article tells
  - A Press breadcrumb back to the record over the release's title, its
    publish date and its location badges
  - The release's 1200:630 feature image — the same asset as its OG
    image — then the body an editor composed
  - The fixed sidebar every article shares: About Grade10, About
    MemeStrategy, Media Enquiries
- What the body draws
  - Every element an editor composes — paragraphs, bold and inline
    links, headings two through six, bullet and numbered lists,
    blockquotes, images with or without captions — in the template's
    own styles

## Requirements

### Requirement: The page presents the record

The Press surface SHALL present, in order: a PRESS eyebrow over the
top-level heading "Press Releases" and the official-record intro beside
the All Time filter, then the releases grouped under year headings,
newest first.

<!-- trace:scenario id=g10.site-press.SC-zem rev=1 -->
#### Scenario: grade10-site-site-press-SC-01 - A collector reads the page top to bottom
**Serves:** grade10-site-site-press-US-01 - Collector scans the press record

- **WHEN** a collector opens `/press-releases`
- **THEN** the page SHALL show the heading block and the releases grouped
  under their year headings, 2026 before 2025, each group's releases
  newest first

### Requirement: The page fits the viewport

On a wide viewport the Press surface SHALL lay the filter beside the
intro at the header's foot and draw each release as a date-title-arrow
row; on a narrow viewport it SHALL stack the filter under the header and
each release's date over its title.

<!-- trace:scenario id=g10.site-press.SC-20b rev=1 -->
#### Scenario: grade10-site-site-press-SC-02 - The page splits into columns on a wide viewport
**Serves:** grade10-site-site-press-US-01 - Collector scans the press record

- **WHEN** a collector opens `/press-releases` on a wide viewport
- **THEN** the filter SHALL sit at the header's right foot and each
  release SHALL read date, title, arrow across the row

<!-- trace:scenario id=g10.site-press.SC-npo rev=1 -->
#### Scenario: grade10-site-site-press-SC-03 - The page stacks on a narrow viewport
**Serves:** grade10-site-site-press-US-01 - Collector scans the press record

- **WHEN** a collector opens `/press-releases` on a narrow viewport
- **THEN** the filter SHALL stack under the header and each release's
  date SHALL sit over its title

### Requirement: Every release leads to its article

Each release row on the Press surface SHALL be the link to that
release's article at `/press-releases/{slug}` — the row's date, title,
and arrow all activate the same destination.

<!-- trace:scenario id=g10.site-press.SC-e1r rev=1 -->
#### Scenario: grade10-site-site-press-SC-04 - A collector opens a release
**Serves:** grade10-site-site-press-US-02 - Collector opens a press release

- **WHEN** a collector opens a release row
- **THEN** that release's `/press-releases/{slug}` article SHALL open in
  place

### Requirement: The filter narrows the record by year

The All Time filter SHALL carry one option per year the record holds;
choosing a year SHALL show only that year's group and releases, and
choosing All Time SHALL restore the full record.

<!-- trace:scenario id=g10.site-press.SC-59c rev=1 -->
#### Scenario: grade10-site-site-press-SC-05 - A collector filters to one year
**Serves:** grade10-site-site-press-US-03 - Collector narrows the record by year

- **WHEN** a collector chooses a year in the filter
- **THEN** only that year's group and its releases SHALL show, until the
  collector chooses All Time again

### Requirement: The article presents the release

The article surface SHALL present, in order: a breadcrumb — the Press
crumb back to `/press-releases` and the current crumb "Press Release" —
the release's title as the page's top-level heading, and its publish
date, written `Sep 15, 2026`, and location badges.

<!-- trace:scenario id=g10.site-press.SC-v6k rev=1 -->
#### Scenario: grade10-site-site-press-SC-06 - A collector opens an article
**Serves:** grade10-site-site-press-US-04 - Collector reads a press release

- **WHEN** a collector opens `/press-releases/{slug}`
- **THEN** the page SHALL show the breadcrumb, the release's title as the
  top-level heading, and its publish date, written `Sep 15, 2026`, and
  location badges

<!-- trace:scenario id=g10.site-press.SC-r4d rev=1 -->
#### Scenario: grade10-site-site-press-SC-07 - A collector goes back to the record
**Serves:** grade10-site-site-press-US-05 - Collector returns to the record

- **WHEN** a collector opens the breadcrumb's Press crumb
- **THEN** `/press-releases` SHALL open in place

### Requirement: The feature image leads the article

The article SHALL draw the release's feature image at the 1200:630 ratio
ahead of its body; the same asset SHALL serve as the article's OG image.

<!-- trace:scenario id=g10.site-press.SC-t9w rev=1 -->
#### Scenario: grade10-site-site-press-SC-08 - The feature image holds its ratio
**Serves:** grade10-site-site-press-US-04 - Collector reads a press release

- **WHEN** a collector opens `/press-releases/{slug}`
- **THEN** the feature image SHALL render at the 1200:630 ratio between
  the title and the body

### Requirement: The body draws what the editor composed

Every element an editor composes SHALL render in the template's styles:
paragraphs; bold and inline links inside them; headings two through six;
bullet and numbered lists; blockquotes with their attribution; images
with or without captions.

<!-- trace:scenario id=g10.site-press.SC-m7h rev=1 -->
#### Scenario: grade10-site-site-press-SC-09 - The body shows its elements
**Serves:** grade10-site-site-press-US-04 - Collector reads a press release

- **WHEN** an article's body carries each element
- **THEN** each SHALL render in the template's styles — the headings at
  their levels, the lists marked, the quotes ruled, the links underlined

<!-- trace:scenario id=g10.site-press.SC-q3x rev=1 -->
#### Scenario: grade10-site-site-press-SC-10 - A figure carries no caption
**Serves:** grade10-site-site-press-US-04 - Collector reads a press release

- **WHEN** a figure in an article's body carries no caption
- **THEN** no caption SHALL render below the image

### Requirement: Every article carries the fixed sidebar

The article SHALL carry the fixed cards — About Grade10, About
MemeStrategy, Media Enquiries — shared across articles; on a wide
viewport they SHALL sit sticky beside the body, and on a narrow viewport
they SHALL stack after it.

<!-- trace:scenario id=g10.site-press.SC-k2p rev=1 -->
#### Scenario: grade10-site-site-press-SC-11 - The sidebar sits beside the body
**Serves:** grade10-site-site-press-US-04 - Collector reads a press release

- **WHEN** a collector opens `/press-releases/{slug}` on a wide viewport
- **THEN** the three cards SHALL sit in a column beside the feature
  image and the body, holding their place as the article scrolls

<!-- trace:scenario id=g10.site-press.SC-z8n rev=1 -->
#### Scenario: grade10-site-site-press-SC-12 - The sidebar lands after the body
**Serves:** grade10-site-site-press-US-04 - Collector reads a press release

- **WHEN** a collector opens `/press-releases/{slug}` on a narrow
  viewport
- **THEN** the three cards SHALL stack after the article's body
