# grade10-site/site/about Specification

## Purpose
What the About surface tells a collector about the company: who backs it,
what it does, where it is going, and the parent company's record — and
where each link on it leads.

## Feature set

- What the page tells
  - Heading and introduction: About Us as the page's top-level heading
    beside a paragraph naming its backers
  - What we do and where we're going: two statements, side by side on a
    wide viewport, stacked on a narrow one
  - Parent company: the MemeStrategy mark, a paragraph on the company, and
    its milestones newest first, the upcoming one labelled Coming soon
- Where the links lead
  - Partner surfaces open in a new tab
  - Product surfaces open in place

## ADDED Requirements

### Requirement: The page presents the company
The About surface SHALL present, in order: About Us as the page's
top-level heading beside an introduction naming MemeStrategy and 9GAG, a
"What we do" statement, a "Where we're going" statement, and a
parent-company panel holding the MemeStrategy mark, a paragraph on the
company, and the company's milestones.

<!-- trace:scenario id=g10.site-about.SC-zem rev=1 -->
#### Scenario: grade10-site-site-about-SC-01 - A collector reads the page top to bottom
**Serves:** grade10-site-site-about-US-01 - Collector learns who is behind Grade10

- **WHEN** a collector opens `/about`
- **THEN** the page SHALL show About Us as its top-level heading, an
  introduction naming MemeStrategy and 9GAG, the What we do and Where we're
  going statements, and the parent-company panel, in that order

### Requirement: The page fits the viewport
On a wide viewport the About surface SHALL lay the heading beside the
introduction and the two statements side by side; on a narrow viewport it
SHALL stack every section at the page inset.

<!-- trace:scenario id=g10.site-about.SC-20b rev=1 -->
#### Scenario: grade10-site-site-about-SC-02 - The page splits into two columns on a wide viewport
**Serves:** grade10-site-site-about-US-01 - Collector learns who is behind Grade10

- **WHEN** a collector opens `/about` on a wide viewport
- **THEN** the introduction SHALL sit beside the About Us heading and the
  two statements SHALL sit side by side

<!-- trace:scenario id=g10.site-about.SC-npo rev=1 -->
#### Scenario: grade10-site-site-about-SC-03 - The page stacks on a narrow viewport
**Serves:** grade10-site-site-about-US-01 - Collector learns who is behind Grade10

- **WHEN** a collector opens `/about` on a narrow viewport
- **THEN** every section SHALL stack in the page's order at the page inset

### Requirement: The milestones read newest first
The parent-company panel SHALL list the company's milestones newest first,
and the milestone that has not happened yet SHALL be labelled Coming soon.

<!-- trace:scenario id=g10.site-about.SC-59c rev=1 -->
#### Scenario: grade10-site-site-about-SC-04 - The upcoming milestone opens the list labelled Coming soon
**Serves:** grade10-site-site-about-US-01 - Collector learns who is behind Grade10

- **WHEN** a collector reads the parent-company panel
- **THEN** the milestones SHALL appear newest first with the upcoming
  milestone labelled Coming soon

### Requirement: Every link leads to its named surface
Each link on the About surface SHALL lead to the surface it names, in a new
tab when the surface is another site's:

| Link | Destination | New tab |
| --- | --- | --- |
| MemeStrategy | `https://memestrategy.com.hk/` | yes |
| 9GAG | `https://9gag.com/` | yes |
| Grade10 AI | `https://app.grade10.com/` | yes |
| vaulting services | the vault page | no |
| Grade10 Finance | `/finance` | no |
| Grade10 | the front door | no |

<!-- trace:scenario id=g10.site-about.SC-ozy rev=1 -->
#### Scenario: grade10-site-site-about-SC-05 - A partner link opens in a new tab
**Serves:** grade10-site-site-about-US-02 - Collector follows a link from About to a product or partner

- **WHEN** a collector opens the MemeStrategy, 9GAG or Grade10 AI link
- **THEN** the destination SHALL open in a new tab

<!-- trace:scenario id=g10.site-about.SC-e1r rev=1 -->
#### Scenario: grade10-site-site-about-SC-06 - A product link opens in place
**Serves:** grade10-site-site-about-US-02 - Collector follows a link from About to a product or partner

- **WHEN** a collector opens the vaulting services, Grade10 Finance or
  Grade10 link
- **THEN** the named surface SHALL open in place
