**Author:** @tangconst - 2026-09-15

## Why

Browser tabs that follow the system color scheme show Grade10's favicon as a
fixed dark tile. On a light chrome the mark holds; on a dark chrome it reads
as a black square. Collectors and operators who keep dark system UI lose the
mark in the tab strip.

Metric: with the browser (or OS) on light and on dark, the favicon glyph stays
legible without a second file.

## What Changes

- **`icon.svg` in `@grade10/design-system` assets** — Grade10 “10” monogram
  (blocky **1** + solid circle **0**) on a transparent background
- **Scheme-aware fill** — `@media (prefers-color-scheme: light)` fills
  `#0B0A0A`; `@media (prefers-color-scheme: dark)` fills `#FFFFFF`
- **Assets README** — documents the adaptive SVG and how a consumer links it
- **Design-system Storybook head** — serves `src/assets` and links `icon.svg`
  as the Storybook favicon

## Non-Goals

- **`grade10-logo.png`** — wordmark file stays as it is
- **Raster icons** — `favicon.ico`, `icon-192.png`, `icon-512.png`,
  `icon-maskable-512.png`, and `apple-touch-icon.png` stay non-adaptive
  placeholders until a designer regenerates them
- **App document head** — grade10-site (and other apps) still serve their own
  public icons; making this folder the source they copy from is a follow-on
- **A durable capability under `openspec/specs/`** — design-system static
  brand assets stay package-owned (`skip_specs: true`), same pattern as
  `add-filter-chip` and `sync-tabs-from-figma`

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- none — this change sets `skip_specs: true` because a design-system brand
  asset carries no durable product requirement here

## Impact

- **`@grade10/design-system`** — `src/assets/icon.svg`, `src/assets/README.md`;
  Storybook `staticDirs` and `preview-head.html`
- **Consuming apps** — optional: point `<link rel="icon" type="image/svg+xml">`
  at `@grade10/design-system/assets/icon.svg` when they adopt this folder as
  the icon source

## Follow-on changes

- Grade10 site serves the adaptive SVG (and regenerated rasters) from this
  package instead of a local copy
