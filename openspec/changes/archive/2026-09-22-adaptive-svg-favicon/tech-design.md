# Tech design: Adaptive SVG favicon

All work lands in this store (`grade10-spec`). No application task group.

## Approach

Replace `packages/design-system/src/assets/icon.svg` in place. The glyph is
the wordmark’s **1** path and **0** circle from `g10-logo-mono`, translated
into a square viewBox with transparent background. A `<style>` block sets
`.mark` fill from `prefers-color-scheme` (`#0B0A0A` light, `#FFFFFF` dark).

Package export `./assets/*` already resolves the file; no export map change.

Storybook serves the folder through `staticDirs` and links the SVG from
`preview-head.html` so the design-system preview shows the same mark.

## Out of scope here

Consuming apps keep their own `public/` icons until a separate change copies
or imports from this package. Raster placeholders are not regenerated.
