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
