# @acetrader/design-system

The AceTrader design system: theme tokens + shadcn primitives. This is the
**design-system half** of the design-system ↔ product split — product and
compound components live elsewhere, not here.

In this repository the product half is [`packages/ui-components`](../ui-components/README.md)
(`@acetrader/pred-spec-ui`), the stateless component package consuming apps
install. This package is the primitive and token layer beneath it; the two are
independent packages and neither imports the other today.

## What lives here

| Path | Contents |
|---|---|
| `src/theme.css` | Generated design tokens — colors (light/dark), typography, radius, charts, status colors. Built from `tokens.json`; do not edit by hand. |
| `src/themes/*.css` | Per-theme token sets (`acetrader.css` generated, `default.css` hand-maintained stock shadcn). |
| `src/lib/utils.ts` | `cn()` helper. |
| `src/components/**/*.tsx` | shadcn primitives (button, card, input, select, dialog, …). Generic and reusable. |
| `src/components/**/*.stories.tsx` | Storybook examples, colocated with each primitive. |
| `src/index.ts` | Barrel export. |
| `components.json` | shadcn CLI config (see "Add a primitive"). |

Storybook for this package runs separately from the `apps/ui` workbench:

```bash
pnpm run storybook:design-system              # picks an available port
pnpm run storybook:design-system -- --port 6007
```

Colocated stories are deliberate here and differ from `packages/ui-components`,
whose examples live in `apps/ui/src/stories/`. Primitives are documented next to
the primitive; product components are reviewed in the workbench app.

Design source of truth: the `.pen` library under `designs/` at the repository
root (the `Mode` / unprefixed variable set), alongside the Figma pipeline below.

## How an app consumes it

```css
/* app src/index.css */
@import "tailwindcss";
@import "@acetrader/design-system/theme.css";   /* tokens */
@source "../../../../packages/design-system/src";  /* generate component classes */
```

```tsx
import { Button, Card } from "@acetrader/design-system"
```

Imports use the package-scoped alias `@acetrader/design-system/*` (never `@/`),
so they resolve unambiguously when the app bundles the package source and never
collide with the app's own `@` alias.

## Design → code: regenerate tokens

Tokens are projected from the `.pen` file, not hand-maintained long-term:

1. Open `designs/acetrader-ui.pen` in the Pencil desktop app.
2. Read the variables (Pencil MCP `get_variables`) — the unprefixed `Mode`
   Light/Dark set is AceTrader.
3. Regenerate `src/theme.css` from that table: each `--token` becomes a
   `:root` (Light) + `.dark` entry; `@theme inline` maps them to Tailwind
   utilities.

This is the reliable, deterministic sync direction. Component structure in the
`.pen` file is the visual spec for the matching primitive here; keep them in
step manually when a spec changes.

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
| `pnpm tokens:build` | code → CSS | `tokens.json` + config → `theme.css`, `themes/acetrader.css` |
| `pnpm tokens:push` | code → Figma | `tokens.json` → `scripts/figma/build/push.gen.js`, run inside Figma via `use_figma` or the built plugin |
| `pnpm tokens:sync` | Figma → CSS | `tokens:pull && tokens:build` (full refresh) |

**Which file.** Every leg runs inside Figma, against whichever file the plugin is
open in — nothing here selects a file over the network. `tokens.config.json` →
`figmaFile` (override per run with `FIGMA_FILE`) is therefore documentation, not
routing: the generated push/seed scripts print it at the top as a guard-rail.
Confirm it matches the file you have open before running.

**Pulling designer edits back (no Enterprise).** The REST variables endpoint is
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

**Known limits.** (1) A token whose alias target does not exist is skipped and
reported — primitives are created first, so this only bites on a ref to a name
absent from `tokens.json`. (2) Every leg needs a human to run a plugin in Figma —
there is no unattended/CI path, since the REST route is Enterprise-only.
(3) The `default` theme (`src/themes/default.css`) is code-only and outside this
pipeline.

> Note: the older Pencil-based flow described above (`designs/acetrader-ui.pen`)
> predates this Figma pipeline; reconcile which is the live design source.

## Add a primitive

Run the shadcn CLI **from this package** so files land here with the right
imports and theme:

```bash
cd packages/design-system
pnpm dlx shadcn@latest add <component> --yes
```

Then export it from `src/index.ts` and add a story next to it. The AceTrader
`.pen` library is the stock shadcn set, so most primitives come straight from
the registry, auto-themed by `theme.css`.

Before handing off, run from the repository root:

```bash
pnpm run typecheck
pnpm run lint
```

## Publishing to other consumers

This package is consumed from source: `exports` point at `src/`, so an app
bundles the TypeScript and scans `src` with Tailwind's `@source`. It has no
build step and no committed `dist/` — unlike `packages/ui-components`, which
ships prebuilt output for submodule consumers.

If the design system later needs its own release cadence, publish it (npm
package or shadcn registry) and switch consumers from `workspace:*` to the
published version. The internal structure is already repo-ready.
