# UI: Adaptive SVG favicon

Layout SoT: the Grade10 wordmark digits in `g10-logo-mono` / `grade10-logo.png`
(blocky **1** + solid circle **0**). No Figma component set owns the favicon;
the asset is the brand file under `@grade10/design-system/assets/icon.svg`.

## Screens

- Browser tab favicon — any surface that links `icon.svg` as
  `rel="icon" type="image/svg+xml"`
- Design-system Storybook chrome — same file via `/assets/icon.svg`

## Components

| Export / file | Package | Notes |
| --- | --- | --- |
| `icon.svg` | `@grade10/design-system` assets | Adaptive “10” monogram; transparent background; scheme media queries |
| `G10LogoMono` | `@grade10/design-system` | Unchanged; geometry source for the **1** and **0** paths only |
| `grade10-logo.png` | `@grade10/design-system` assets | Unchanged wordmark |

No new primitive or `@grade10/ui` export.

## States

| State | Treatment |
| --- | --- |
| Light color scheme (`prefers-color-scheme: light`) | Glyph fill `#0B0A0A` on transparent |
| Dark color scheme (`prefers-color-scheme: dark`) | Glyph fill `#FFFFFF` on transparent |
| No preference / unsupported media | Default fill `#0B0A0A` |

`skip_specs: true` — these states have no scenario ids; they are verified by
inspecting the SVG and the browser tab under each scheme.
