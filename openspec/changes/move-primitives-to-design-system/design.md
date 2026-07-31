# Design

## The distribution problem

The two packages have opposite distribution models, and that is the whole difficulty of this change.

| | `@acetrader/pred-spec-ui` | `@acetrader/design-system` |
| --- | --- | --- |
| Consumed as | prebuilt `dist/`, committed | TypeScript source, `exports` point at `src/` |
| Published | installed from a Git submodule with `file:` | never; `private`, version `0.0.0` |
| Consumer toolchain | React + Tailwind v4, nothing else | the full monorepo dev setup |

A consuming app installs `file:vendor/pred-spec/packages/ui-components`. Nothing in that install can resolve `@acetrader/design-system`, so the naive import — leaving the bare specifier in `dist/` — produces a package that cannot be imported at all.

### Chosen approach: bundle it in

`scripts/build.mjs` replaces `tsc --project tsconfig.json`:

1. `tsc --emitDeclarationOnly` for the types. Declarations still carry the bare specifier if a design-system type reaches the public surface, so the script greps the emitted `.d.ts` files for `@acetrader/design-system` and fails the build if any is found. No public prop type references one today; the check is what keeps that true.
2. `esbuild --bundle` for the JavaScript. Every entry in `dependencies` and `peerDependencies` stays external; everything else inlines. `@acetrader/design-system` is a `devDependency`, so it is exactly what gets inlined — the externals list is derived from `package.json` rather than restated, which is what makes that invariant hold when a dependency is added later.
3. The design-system theme CSS is copied to `theme/`, and `styles.css` imports it from there. `theme.css` is generated from `tokens.json`; this is one more projection of it, and like `dist/` it is generated output that must not be hand-edited.

The composites import deep paths (`@acetrader/design-system/components/display/badge`) rather than the barrel. The barrel re-exports `sonner` and `next-themes`, which the composites do not use and which would otherwise be pulled into the bundle.

`dist/` is now one bundled `index.js` plus declarations, rather than a file-per-module tree. `styles.css` still scans it with `@source "./dist"`; a bundle contains the same class strings.

### Rejected alternatives

**Declare `@acetrader/design-system` a runtime dependency.** Simplest code change, but the consumer then installs a second `file:` package of raw `.tsx` and must transpile it and add it to their Tailwind `@source` set. That is the "prebuilt, no dev toolchain" promise in the package README, deleted.

**Vendor the design-system sources into `src/` at prebuild.** Keeps the plain `tsc` build, but puts generated source next to authored source and needs import-specifier rewriting. The bundler already does exactly this, correctly.

**Publish the design system.** The right long-term answer and out of scope here. It needs a versioning and release decision that nobody has made.

## Primitive mapping

| Was | Now | Note |
| --- | --- | --- |
| `Button variant="primary"` | `Button variant="default"` | The design-system default is a tint, not a solid fill — see [`adopt-figma-button-styling`](../adopt-figma-button-styling/proposal.md). |
| `Button size="small" \| "medium"` | `Button size="sm" \| "default"` | |
| `Button iconOnly` | `className="aspect-square px-0"` | No icon-only rung exists. |
| `Badge tone="neutral"` | `Badge variant="secondary"` | |
| `Badge tone="error"` | `Badge variant="destructive"` | |
| `Badge tone="success"` | `Badge variant="secondary"` + `bg-success text-success-foreground` | No success rung exists. |
| `Skeleton` | `Skeleton` | Ported unchanged: `shape="text" \| "line" \| "block"`. |
| `Stack` | `Stack` | Ported unchanged. `align`, `justify`, and `wrap` stay style pass-throughs so callers keep arbitrary values. |
| `Text` | `Text` | Ported unchanged. `tone` maps onto the token pairs: `muted` → `--disabled-foreground`, `success` → `--success-foreground`, `error` → `--error-foreground`. |
| `Surface variant="card"` | `Card` | `Card` owns the surface, radius, ring, vertical padding, and gap; only the inline padding stays in `styles.css`. |
| `Surface variant="panel"` | `.at-featured-panel` in `styles.css` | The panel is a layout container with a row flex direction, which `Card` (column, fixed spacing) does not model. |
| `Surface as="button" variant="ghost"` | `.at-featured-nav-item` in `styles.css` | A selectable sidebar row, not a card. |
| `SegmentedControl` | `Tabs` + `TabsList` + `TabsTrigger` | `TabsContent` is unused: both call sites render their panel elsewhere. |

`Text` absorbed two things `styles.css` used to do by attribute selector. `FeaturedMarketStat.tone` and `FeaturedMarketOutcomeValue.tone` are unions that already match `Text`'s `tone` axis exactly, so they are passed as a prop and the `[data-tone=…]` rules are gone. `data-state` on an outcome value is still an attribute selector, because it has no counterpart on any primitive.

## Storybook

`apps/ui` had no Tailwind plugin in its Vite config. That went unnoticed because every portable component was styled by hand-written CSS in `styles.css`: `@import "tailwindcss"` resolved to a stylesheet with no compiled utilities in it, and nothing needed any. With the composites now built on utility-styled primitives, `@tailwindcss/vite` has to run there, and the motion story is what proves it does — it asserts a running animation on `Skeleton`, whose only animation is `animate-pulse`.

`FoundationPrimitives` and the whole `Shared/Button` story file are deleted. They demonstrated primitives that this package no longer owns; `packages/design-system` has its own Storybook, with a story per cva option enforced by `variant-story-coverage.test.ts`.

`PortableInteractions` keeps its shape — controlled interaction, running motion, paused motion — but drives it through composites instead. One assertion needed adjusting: the design-system Button sets `pointer-events: none` when disabled, which makes `userEvent.click` throw rather than deliver a no-op click, so the disabled-promo assertion opts out of the pointer-events check.
