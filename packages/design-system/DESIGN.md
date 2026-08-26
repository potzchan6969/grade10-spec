# @grade10/design-system

The Grade10 design system: theme tokens + shadcn primitives. This is the
**design-system half** of the design-system ↔ product split — product and
compound components live elsewhere, not here.

The product half lives in the consuming application: each app implements its own
product components against these tokens. This repository once shipped them as
`packages/ui-components`; that package was removed, and this package is now the
only one here.

## What lives here

| Path | Contents |
|---|---|
| `src/theme.css` | Generated design tokens — colors (light/dark), typography, radius, charts, status colors. Built from `tokens.json`; do not edit by hand. |
| `src/themes/*.css` | Per-theme token sets (`grade10.css` generated, `default.css` hand-maintained stock shadcn). |
| `src/lib/utils.ts` | `cn()` helper. |
| `src/components/**/*.tsx` | shadcn primitives (button, card, input, select, dialog, …). Generic and reusable. |
| `src/components/**/*.stories.tsx` | Storybook examples, colocated with each primitive. |
| `src/index.ts` | Barrel export. |
| `components.json` | shadcn CLI config (see "Add a primitive"). |

Storybook for this package runs separately from the `apps/preview` app:

```bash
pnpm run storybook:design-system              # picks an available port
pnpm run storybook:design-system -- --port 6007
```

The published combined Storybook (pages + UI + these primitives) is the
workbench — see `apps/preview/README.md` and
https://grade10-storybook.memeland-qa.workers.dev.

Colocated stories are deliberate: a primitive is documented next to the
primitive. Product components are reviewed in the application that implements
them.

Every story also runs as a test in headless Chromium, with axe checks from
`@storybook/addon-a11y` applied to each rendered story:

```bash
pnpm run setup:browsers                   # once, installs Playwright Chromium
pnpm run test:stories:design-system       # this package only
pnpm run test:stories                     # both Storybooks, as CI runs them
```

`a11y.test` is set to `"todo"` in `.storybook/preview.tsx`, so violations are
reported but do not fail the run. Set it to `"error"` to gate CI once the
outstanding violations are cleared.

Design source of truth: the Figma file, via the token pipeline below. (A
diverged Pencil `.pen` library under a root `designs/` directory was the
original source; it was removed in August 2026 and survives only in git
history.)

## How an app consumes it

```css
/* app src/index.css */
@import "tailwindcss";
@import "@grade10/design-system/theme.css";            /* preamble + primitives */
@import "@grade10/design-system/themes/default.css";   /* :root slot values */
@import "@grade10/design-system/themes/grade10.css"; /* .theme-grade10 overrides */
@source "../../../../packages/design-system/src";  /* generate component classes */
```

All three imports are required, in that order. `theme.css` carries the `@theme
inline` mapping and the mode-independent primitives but no slot *values*;
`default.css` defines them on `:root`, and `grade10.css` overrides that base
under `.theme-grade10`. Importing `theme.css` alone leaves every slot
undefined. Apply the theme by putting `theme-grade10` on `<html>` — see
`ColorThemeProvider`, whose class dimension is orthogonal to the `dark` class.

Brand sans is Gibson from Adobe Fonts. Load the Typekit kit in the document
head — a nested `@import` inside `theme.css` is illegal once that file sits
after Tailwind/shadcn in the bundle, so the kit is not shipped that way:

```html
<link rel="stylesheet" href="https://use.typekit.net/lnk7gwq.css" />
```

The CSS family name is `canada-type-gibson` (mapped to `--font-sans` /
`--font-heading`); the Typography token `family-sans` keeps the designer
label `Gibson`.

```tsx
import { Button, Card } from "@grade10/design-system"
```

Imports use the package-scoped alias `@grade10/design-system/*` (never `@/`),
so they resolve unambiguously when the app bundles the package source and never
collide with the app's own `@` alias.

## Tokens: 2-way Figma sync

`tokens.json` (package root) is the **source of truth** — designer-owned token
DATA (primitives + per-theme semantic values, refs written `{name}`). The
engineer-owned PROJECTION rules (shadcn `slotMap`, selectors, Figma collection
names) live in `tokens.config.json`. Figma and the CSS files are both
*projections* of `tokens.json`, never sources.

```
   Figma Variables ──tokens:pull──▶  tokens.json  ──tokens:build──▶  theme.css + themes/*.css
   (designer edits)                 (git, canonical)                 (consumed by apps)
                        ◀──tokens:push──┘  (engineer edits → Figma plugin script)
```

| Command | Direction | Does |
|---|---|---|
| `pnpm tokens:pull` | Figma → code | Dump → `tokens.json` (needs `FIGMA_DUMP=<file>` from the dump plugin) |
| `pnpm tokens:build` | code → CSS | `tokens.json` + config → `theme.css`, `themes/grade10.css` |
| `pnpm tokens:push` | code → Figma | `tokens.json` → `scripts/figma/build/push.gen.js`, run inside Figma via `use_figma` or the built plugin |
| `pnpm tokens:sync` | Figma → CSS | `tokens:pull && tokens:build` (full refresh) |

**Which file.** Every leg runs inside Figma, against whichever file the plugin is
open in — nothing here selects a file over the network. `tokens.config.json` →
`figmaFile` (override per run with `FIGMA_FILE`) is therefore documentation, not
routing: the generated push/seed scripts print it at the top as a guard-rail.
Confirm it matches the file you have open before running.

**Pulling designer edits back (no Enterprise).** The step-by-step procedure, its
failure messages, and what the configured collections leave behind are in
[`docs/governance/figma-token-export.md`](../../docs/governance/figma-token-export.md);
the summary is here. The REST variables endpoint is
Enterprise-gated and this org is not on it, so the pull runs off a dump instead.
`pnpm tokens:plugin dump` builds `scripts/figma/build/dump/`, imported the same way; it reads the local
variables and hands back the exact `{ meta }` shape REST would have returned —
Download writes `figma-dump.json` to your Downloads folder. Then:

```
FIGMA_DUMP=~/Downloads/figma-dump.json pnpm tokens:sync   # pull + build
git diff tokens.json                                       # what the designer changed
```

Round-trip is lossless: pushing `tokens.json` into an empty file, dumping it, and
pulling it back reproduces `tokens.json` byte for byte.

**Running a push when the MCP bridge won't cooperate.** `use_figma` executes
against whichever file the Figma plugin is bound to, which is not always the one
you asked for. `pnpm tokens:plugin push` (or `seed`) wraps the generated script
into an importable plugin folder — Figma → Plugins → Development → Import plugin
from manifest… → `scripts/figma/build/push/manifest.json`. It runs inside the file you have
open, so there is no binding to get wrong. Open Plugins → Development → Open
console first; the headline lands in a toast, the full JSON in the console.

**Ownership boundary (how conflicts are avoided):** designers own values in Figma
(land via `tokens:pull` → PR); engineers own the contract/`slotMap` and code-only
themes. `tokens.json` is the git merge point — two people editing the same token
is a normal PR conflict a human resolves. There is no automatic value merge.

**Identity** is the normalized token name (e.g. `slate-950`, `layer-01`). Push
matches live Figma variables by that name and **updates in place**, so the real
2-way case (Figma already has the variables) is lossless and preserves the
primitive→semantic alias graph.

**Seeding a fresh file.** `tokens:push` creates whatever is missing — collections,
the theme mode, and variables — so it also seeds an empty file. A created variable
is filed under a group derived from its name (`Color/slate-950`, `Layer/layer-01`);
since `norm()` strips the group, that choice never affects matching later, and
variables that already exist keep the names they have. Re-running creates nothing
and re-sets the same values.

**What is and is not pulled.** `pull.mjs` reads the collections named in
`tokens.config.json`: every entry of `primitiveCollections` (currently
`Foundation` and `Typography`) plus `semanticCollection`. Each primitive entry
maps a **tokens.json section** to a **Figma collection** — `Typography` lands in
a `typography` section and gets its own labelled block inside the single `:root`
of `theme.css`. Keeping the sections apart is what lets `tokens:push` file a
newly created token back into the collection it came from; flattening them all
into `primitives` would silently relocate every Typography token to Foundation
on the next push.

Because those sections share one `:root`, a key collision across collections is
a hard failure: `Size/size-4` and `Typeset/size-4` both normalize to `size-4`,
so the pull stops and names both rather than picking a winner.

The Figma file still carries `Motion` and `Sizing`, and those remain ignored.
`Sizing` in particular models modes as *size variants* (`default`/`sm`/`xs`)
that must coexist on one page, which the config's one-selector-per-mode theme
model cannot express. Wiring them up is tracked separately; do not assume a
green `tokens:sync` means the whole file landed.

**Units.** A Figma FLOAT is a bare number, so the CSS unit is inferred from the
variable's Figma *scopes*, falling back to the token name; anything unmatched
stays `px`. `FONT_WEIGHT` emits unitless (`--weight-medium: 500`, not `500px`)
and `OPACITY` emits a percentage. A STRING variable such as `family-sans`
("Gibson") passes through as-is and is typed `fontFamily`. Note that `tokens:push`
only *creates* COLOR and FLOAT variables — a new STRING token is reported as
unconvertible rather than guessed at, so add those in Figma by hand.

**Known limits.** (1) A token whose alias target does not exist is skipped and
reported — primitives are created first, so this only bites on a ref to a name
absent from `tokens.json`. (2) Every leg needs a human to run a plugin in Figma —
there is no unattended/CI path, since the REST route is Enterprise-only.
(3) The `default` theme (`src/themes/default.css`) is code-only and outside this
pipeline.

**Both legs fail hard on a missing theme.** A renamed Figma mode used to warn and
exit 0: the pull wrote `themes: {}` and the build then *skipped* rewriting
`themes/<name>.css`, leaving the previous file on disk pointing at primitives the
same run had just renamed. Stale-and-dangling builds and lints clean, so it only
showed up in a browser. Both now exit 1 — `pull.mjs` lists the collection's real
mode names, and it checks before writing, so a failed pull leaves `tokens.json`
untouched.

> **Resolved: one design source.** A Pencil `.pen` flow predated this Figma
> pipeline and the two diverged. The July 2026 resync made Figma live
> (semantic-layer rewrite plus three collections with no Pencil counterpart),
> and the `designs/` directory was removed in August 2026 — Figma is the only
> design source. The Pencil flow survives in git history alone; never sync
> from it, a `.pen` pull would revert the Figma work.

## Add a primitive

Run the shadcn CLI **from this package** so files land here with the right
imports and theme:

```bash
cd packages/design-system
pnpm dlx shadcn@latest add <component> --yes
```

Then export it from `src/index.ts` and add a story next to it. The Grade10
component set is the stock shadcn set, so most primitives come straight from
the registry, auto-themed by `theme.css`.

Before handing off, run from the repository root:

```bash
pnpm run typecheck
pnpm run lint
```

## Publishing to other consumers

This package is consumed from source: `exports` point at `src/`, so an app
bundles the TypeScript and scans `src` with Tailwind's `@source`. It has no
build step and no committed `dist/`.

If the design system later needs its own release cadence, publish it (npm
package or shadcn registry) and switch consumers from `workspace:*` to the
published version. The internal structure is already repo-ready.
