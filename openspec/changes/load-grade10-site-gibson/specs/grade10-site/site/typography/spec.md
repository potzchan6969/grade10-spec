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

## ADDED Requirements

### Requirement: The site loads Gibson from the named Adobe Fonts kit

The grade10 site SHALL include the Adobe Fonts (Typekit) stylesheet for kit
`lnk7gwq` in the document head of every page it answers:

`https://use.typekit.net/lnk7gwq.css`

The site SHALL NOT load Gibson by nesting that kit inside a stylesheet that
is not first in the cascade, and SHALL NOT substitute a different Adobe Fonts
kit for the brand sans.

#### Scenario: grade10-site-site-typography-SC-01 - Every surface loads the kit

- **WHEN** a collector opens any address the grade10 site answers
- **THEN** the document head includes a stylesheet link to
  `https://use.typekit.net/lnk7gwq.css`

### Requirement: Body and heading type use the theme sans stack

Body text and headings on every grade10-site surface SHALL render through the
theme sans and heading stacks the design system maps for the Grade10 theme —
the CSS family `canada-type-gibson`, whose Typography token label is
`Gibson`. The site SHALL NOT declare a second brand sans family for body or
heading type.

#### Scenario: grade10-site-site-typography-SC-02 - Body and headings use Gibson

- **GIVEN** the Adobe Fonts kit has loaded
- **WHEN** a collector reads body copy or a heading on any grade10-site
  surface
- **THEN** that text uses the theme sans stack whose CSS family is
  `canada-type-gibson`

#### Scenario: grade10-site-site-typography-SC-03 - No second brand sans

- **WHEN** a collector opens any grade10-site surface
- **THEN** the page does not load a second brand-sans stylesheet or declare
  a second brand-sans family for body or heading type
