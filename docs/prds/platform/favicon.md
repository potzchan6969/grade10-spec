---
title: Favicon
order: 8
---

Grade10's browser-tab icon reads on a light or a dark system and browser chrome alike, from one file.

## How It Works

- **One SVG, two fills** — `@grade10/design-system`'s `src/assets/icon.svg` draws the "10" monogram (a blocky **1**, a solid circle **0**) on a transparent background; `@media (prefers-color-scheme: light)` fills it `#0B0A0A`, `@media (prefers-color-scheme: dark)` fills it `#FFFFFF`
- **One consumer today** — the design system's own Storybook serves the file and links it as its favicon; a storefront points its own `<link rel="icon" type="image/svg+xml">` at the same asset once it adopts it

## Not Yet

- **Raster icons stay fixed** — `favicon.ico`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` and `apple-touch-icon.png` are non-adaptive placeholders until a designer regenerates them
- **Storefronts still serve their own icons** — grade10-site and the other applications have not pointed their document head at this file yet

:::detail{title="Product decisions" for="pm"}
A collector or operator running a dark system or browser theme saw Grade10's favicon as a black square in the tab strip; on a light theme it read fine. Measured by whether the glyph stays legible on both, from one file, with no report of the fixed color reopened.

**Not in scope.** The wordmark (`grade10-logo.png`) stays as it is. Regenerating the raster icon set in the same adaptive mark. Pointing a storefront's own document head at this file — a follow-on, not this decision.

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| One adaptive file vs. a light/dark pair | Decided | One SVG carries both fills behind a `prefers-color-scheme` media query, so a consumer links a single `<link rel="icon">` and the browser picks the fill; a static pair would need the consumer's own markup to pick a scheme, which a plain `<link>` tag cannot do. | Design |
| Fill values | Decided | `#0B0A0A` and `#FFFFFF` — `#0B0A0A` matches the design system's `gray-950`, its darkest neutral; nothing new was picked for this asset. | Design |
| Durable spec | Decided | Stays package-owned with no `openspec/specs/` capability, the same call made for `add-filter-chip` and `sync-tabs-from-figma` — a design-system asset with no cross-application contract yet. | Engineering |
| Raster regeneration | ❓ Open | Whether the same monogram replaces `favicon.ico` and the PWA icon set, or they stay the legacy mark. | Design |
| Who adopts it first | ❓ Open | Which storefront points its document head at this file first, and whether the others follow in the same change. | Engineering |
:::
