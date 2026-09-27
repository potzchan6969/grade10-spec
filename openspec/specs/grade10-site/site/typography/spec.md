# grade10-site/site/typography Specification

## Purpose
How the grade10 site loads and applies its brand sans — Gibson from Adobe
Fonts — on every surface a collector opens, so the site never ships on a
fallback family while the design system already names Gibson.

## Feature set

- One brand sans
  - Gibson via the named Adobe Fonts kit, loaded in the document head
  - Body and heading use that family through the theme sans stack
  - No second brand sans stylesheet or family on the site
- Site-wide
  - Every surface the site answers inherits the same load and stack

## Requirements

### Requirement: The site loads Gibson from the named Adobe Fonts kit

Gibson comes from one Adobe Fonts kit, linked in the head of every page.

**The kit** - The grade10 site SHALL include the Adobe Fonts (Typekit)
stylesheet for kit `lnk7gwq` in the document head of every page it answers:

`https://use.typekit.net/lnk7gwq.css`

**No other route** - The site SHALL NOT load Gibson by nesting that kit inside
a stylesheet that is not first in the cascade, and SHALL NOT substitute a
different Adobe Fonts kit for the brand sans.

<!-- trace:scenario id=g10.site-typography.SC-6z2 rev=1 -->
#### Scenario: grade10-site-site-typography-SC-01 - Every surface loads the kit
**Serves:** Site-wide - every surface loads the kit

- **WHEN** a collector opens any address the grade10 site answers
- **THEN** the document head includes a stylesheet link to
  `https://use.typekit.net/lnk7gwq.css`

### Requirement: Body and heading type use the theme sans stack

Body text and headings on every grade10-site surface SHALL render through the
theme sans and heading stacks the design system maps for the Grade10 theme —
the CSS family `canada-type-gibson`, whose Typography token label is
`Gibson`. The site SHALL NOT declare a second brand sans family for body or
heading type.

<!-- trace:scenario id=g10.site-typography.SC-wxa rev=1 -->
#### Scenario: grade10-site-site-typography-SC-02 - Body and headings use Gibson
**Serves:** One brand sans - body and headings use Gibson

- **GIVEN** the Adobe Fonts kit has loaded
- **WHEN** a collector reads body copy or a heading on any grade10-site
  surface
- **THEN** that text uses the theme sans stack whose CSS family is
  `canada-type-gibson`

<!-- trace:scenario id=g10.site-typography.SC-6rg rev=1 -->
#### Scenario: grade10-site-site-typography-SC-03 - No second brand sans
**Serves:** One brand sans - no second brand sans

- **WHEN** a collector opens any grade10-site surface
- **THEN** the page does not load a second brand-sans stylesheet or declare
  a second brand-sans family for body or heading type

### Requirement: A blocked or delayed kit never shows a loading or error state

The kit load never blocks rendering or introduces UI of its own.

**No blocking** - The site SHALL NOT delay or block rendering of body or
heading content while the Adobe Fonts kit request is in flight, and SHALL NOT
show a loading, empty, or error state tied to that request.

**Fallback** - Where the kit request is blocked or delayed, the site SHALL
render body and heading text in the browser's default fallback sans until the
kit resolves, with no retry or timeout logic of its own.

<!-- trace:scenario id=g10.site-typography.SC-45e rev=1 -->
#### Scenario: grade10-site-site-typography-SC-04 - A blocked kit falls back without an error surface
**Serves:** One brand sans - no forced wait or error state on a blocked kit

- **GIVEN** the Adobe Fonts kit request is blocked or fails
- **WHEN** a collector opens any address the grade10 site answers
- **THEN** the page renders its full content immediately in the browser's
  fallback sans, with no loading, empty, or error state shown for the
  missing font
