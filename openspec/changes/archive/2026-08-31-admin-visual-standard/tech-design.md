# Design — admin-visual-standard

## Context

See `proposal.md` — Why. What follows is only what shapes the approach.

The admin theming as it stands, in both applications' `src/index.css`:
Tailwind v4 compiles against `@grade10/design-system/theme.css`, whose
`@theme inline` block maps `--color-*` names onto brand semantic variables
(`--color-border: var(--border)`), and `themes/grade10.css` sets those 64
semantic values under `.theme-grade10`, the class `index.html` puts on the
document. ZZZ imports only `themes/default.css` and sets no brand class.

Astryx is a StyleX design system that ships **precompiled** CSS —
`reset.css` and `astryx.css` — plus a theme package. `@stylexjs/stylex` is a
peer dependency at runtime only: `tools/openspec-viewer` consumes Astryx
through `@vitejs/plugin-react` alone, with no StyleX build plugin. Adopting it
needs no compiler change.

The admin surface to move: `packages/frontend-console` (13 modules behind one
entry), seven `packages/*/admin-frontend` packages, and 32 page components
across the two shells — reaching 33 distinct design-system and `@grade10/ui`
import paths today.

Two facts decide the approach. The first was measured, because the proposal
calls two global stylesheets over one document "the central risk this change
has to resolve, not defer":

- **The two stylesheets barely overlap.** Compiling
  `apps/admin/grade10/src/index.css` through Tailwind 4.3.3 and diffing the
  emitted custom properties against `@astryxdesign/theme-neutral`'s
  `theme.css` gives **one** name declared by both: `--radius-full`, at 999px
  against Astryx's 9999px, which `astryx.css` reads in 8 places. Every other
  name is disjoint. The reason is that `@theme inline` *substitutes* rather
  than emits — `bg-accent` compiles to `background-color: var(--accent)`, and
  `--color-accent` never reaches the document at all. So the design system
  emits the unprefixed brand semantics (`--accent`, `--border`, `--card`)
  that Astryx never reads, and Astryx emits the `--color-*` names that the
  design system's compiled utilities never read. Both sheets can sit at
  `:root` safely. The probe is kept at
  `scratchpad/tw-collision-probe.mjs` in the implementing session and is
  worth re-running on any Astryx upgrade.
- **The shared two-factor block cannot become Astryx.** `TwoFactorEnrollment`
  and `TwoFactorVerifyForm` live in `packages/ui/src/blocks/auth-two-factor`
  in grade10-spec and are rendered by customer surfaces too. Making them
  Astryx would push Astryx into the storefront, which the proposal rules out.

`admin-console-blocks` was the precondition and is **finished**: its groups 3
(the grade10-spec deletion) and 9 (delivery) closed and the change archived as
`2026-08-29-admin-console-blocks`.

## Goals / Non-Goals

**Goals:**

- Astryx renders every admin surface, with the design system reaching admin
  pixels only underneath the shared two-factor block.
- A brand's admin identity authored once, in Astryx's own theme mechanism.
- The shared two-factor block keeps one definition and still looks native.
- A revert route that the migration's own shape keeps open.

**Non-Goals:**

- No StyleX build integration. Astryx's CSS is precompiled; if a future
  version requires the compiler, that is its own change.
- No Astryx in `packages/ui` or any storefront surface.
- No admin theme for ZZZ beyond Astryx's base. ZZZ has no brand overlay today
  and inventing one is not this change's business.
- No consolidation of the two admin applications.

## Decisions

### The two stylesheets coexist; only `--radius-full` is arbitrated

Both sheets load at `:root`. Astryx's imports come last, so its
`--radius-full: 9999px` wins the single overlap — a difference between two
values that both mean "fully rounded" and that no element in the admin is
large enough to distinguish.

This is the decision the measurement above buys, and it is what makes the
migration incremental: a half-migrated page renders both vocabularies
correctly, so surfaces move one group at a time with no flag and no big-bang
CSS flip.

Alternatives:

- *Scope the design system's sheet to a wrapper element around each
  `@grade10/ui` block.* This is what the collision would have forced, and it
  is real machinery — a component, a 64-name mapping, and a seam to keep
  honest. The measurement says it buys nothing. Kept in Risks as the
  contingency if a later Astryx version widens the overlap.
- *Rename the design system's emitted namespace.* A change to
  `@grade10/design-system`, which every storefront compiles against — a
  non-goal, and a large blast radius for a problem that turns out not to
  exist.
- *Let import order fall where it may.* Leaves `--radius-full` decided by a
  line's position in a file nobody reads. `shared-console-visual-standard-SC-05` asks that
  exactly one mechanism set a value; stating the order is what satisfies it.

### The shared block matches by palette, not by a token bridge

`TwoFactorEnrollment` and `TwoFactorVerifyForm` keep one definition, keep
their design-system tokens, and are rendered directly by the admin pages. They
read as part of the console because the admin's Astryx theme and the design
system's brand sheet carry **the same brand values** — the agreement is
authored, not adapted at runtime.

That is the mechanism `shared-console-visual-standard-SC-03` asks to be stated. It is checked
by looking at the two-factor page beside another console page, which is a task
in group 2, before anything else depends on the palette being right.

Alternative: *a boundary component that maps design-system variables from
Astryx's at runtime.* More faithful in principle, but it makes the block's
appearance depend on a 64-name mapping table that nobody can review by eye,
and it only matters if the palettes disagree — in which case fixing the theme
is the better repair.

### Tailwind stays in the admin, narrowed to the shared block

Because the two-factor block renders design-system components, Tailwind must
still compile in both admin applications. What changes is its reach: the
`@source` list drops `packages/frontend-console/src` and every
`packages/*/admin-frontend/src` entry as each migrates, ending at the two that
remain — the design system's and `packages/ui`'s sources.

The shrinking `@source` list is the migration's own progress meter: a package
still listed is a package still rendering Tailwind classes.

Alternatives:

- *Adopt Astryx's `tailwind-theme.css` bridge and keep writing utility classes
  in admin code.* Rejected: it makes "which vocabulary is this file in"
  unanswerable by looking at it, and `shared-console-visual-standard-SC-01` is a rule about
  surfaces.
- *Drop Tailwind entirely.* Requires forking the two-factor block.

### The runtime is pinned at an exact `0.5.0`

Both admin applications depend on `@astryxdesign/core` and the theme package
at `0.5.0` exactly — no caret. Astryx is public on npm, `latest` is `0.5.0`,
and its 0.x line carries breaking changes in minors. An exact pin is what
makes `shared-console-visual-standard-SC-09` checkable: a version moves only in a change that
re-runs this capability's scenarios.

`tools/openspec-viewer` keeps its own `^0.1.9` — it is a separate pnpm
workspace with its own lockfile, so the two never resolve together, and a
developer tool has different stakes than an operator console. Verified at
0.5.0 by unpacking the tarball: the exports this change needs are all present
(`Table`, `TabList`, `Dialog`, `SegmentedControl`, `Pagination`, `theme`), and
the peer dependencies are unchanged from 0.1.9.

Alternative: *track `^0.5.0`.* Rejected — a minor upgrade would reach
operators without anyone re-establishing the scenarios.

### A brand's identity is one `defineTheme` theme per application

A new `packages/admin-theme` exports `grade10AdminTheme`, built with
`defineTheme` from `@astryxdesign/core/theme` and carrying the same palette
values `themes/grade10.css` holds. Each admin root renders
`<Theme theme={...}>`; ZZZ renders Astryx's base theme, matching the fact that
it has no brand overlay today. The `.theme-grade10` document class stays only
as long as the two-factor block needs it, and the design-system brand import
stays with it.

`defineTheme` overrides only what differs from the defaults, so the package
holds the brand's deltas rather than a second full palette.

Alternatives:

- *Generate the Astryx theme from the design system's brand CSS at build
  time.* Keeps one authored palette, but the two token surfaces do not map
  one-to-one (64 semantic names against ~172), so the generator would need a
  hand-written mapping table anyway — a pipeline to maintain on top of the
  mapping it was meant to avoid.
- *Give ZZZ an authored admin theme too.* Invents a brand decision that
  nobody has made; `shared-console-visual-standard-SC-04` only asks that the difference come
  from the mechanism, and "base theme" is an answer that mechanism gives.

### Blocks first, then products, then shells

The console package's blocks move to Astryx before any consumer does. Because
`admin-console-blocks` collapsed the surfaces onto ~13 exports behind one
entry, the blocks are where the vocabulary actually changes; the product
packages and pages then change only where they reach past a block to a
primitive directly. This is the reason the proposal makes archiving a
precondition rather than a courtesy.

Where a page needs a control Astryx has no counterpart for, the console
package gains it composed from Astryx — `shared-console-visual-standard-SC-02` — rather than
the page reaching for a design-system primitive.

### The revert route is the console package's entry

Reverting means restoring the blocks' design-system implementations behind the
same exports, restoring the two `index.css` files, and dropping the
dependency. It stays possible only if no admin surface imports
`@astryxdesign/*` directly past the console package — the pages compose
blocks, not the runtime. One lint rule enforces it: `@astryxdesign/*` is
importable from `packages/frontend-console/src` and the two application roots
(for `<Theme>`) and nowhere else. That rule is what makes
`shared-console-visual-standard-SC-10` a property of the code rather than a promise.

Alternative: *let any admin file import Astryx.* Simpler to write, but the
revert cost then grows with every file, and the route stops being describable.

## Risks / Trade-offs

- **An Astryx upgrade widens the one-name overlap into a real collision.** →
  The collision probe is a script, not a memory: re-run it in the upgrade
  change that `shared-console-visual-standard-SC-09` already requires, and if the overlap
  grows, scope the design system's sheet to a wrapper around the two-factor
  block — the alternative costed above, held in reserve.
- **Brand drift between the storefront palette and the admin theme.** Two
  authored sources for the same brand's colors will diverge. → The admin theme
  package carries the `themes/grade10.css` values as its literal input, with a
  test asserting the mapped names still resolve to them; drift shows as a
  failing test, not a slow visual slide.
- **The palettes agree in the theme but not to the eye.** Astryx's token
  structure is not the design system's, so the two-factor page may still read
  as foreign. → It is migrated in group 2, before any other surface depends on
  the theme, so a wrong answer is cheap. The boundary component is the repair
  if the theme cannot get there.
- **A 0.x runtime under a production surface.** → The exact pin plus the
  revert rule bounds it: an upgrade is a change with a scenario re-run, and a
  withdrawal is a package-local rewrite behind unchanged exports.
- **Astryx's precompiled CSS could require the StyleX compiler in a later
  version.** → Nothing here depends on it staying precompiled; the exact pin
  means that arrives in a deliberate change.
- **The console package's tests are the only proof the semantics survive.** The
  `console-blocks-SC-*` scenarios have no test naming them today —
  `blocks.test.tsx`, `table.test.tsx`, and `FormDialog.test.tsx` cover the
  behavior, but only the user-directory tests cite scenario ids. → Each
  migration task re-runs those suites unchanged; where a suite asserts a
  design-system class that Astryx renders differently, the assertion moves to
  the operator-visible fact — tone, role, announced state — which is what the
  scenario says.

## Migration Plan

1. **`admin-console-blocks` has archived.** Its groups 3 and 9 are closed and
   the submodule bump has landed, so the markup this change migrates is no
   longer moving underneath it. This step is done; group 1 can start.
2. **Runtime, theme, and stylesheets land together, no surface change.** Both
   sheets at `:root`, Astryx last. Nothing renders differently yet.
3. **The two-factor page first**, so the palette is proven before anything is
   built on it.
4. **Blocks, then products, then shells** — each step narrowing the `@source`
   list, each verifiable on its own.
5. **Close it out.** Add the import rule and confirm no admin surface reaches
   the runtime directly.

Rollback at any step is a revert of that step's commits: the blocks' exports
do not change shape and both stylesheets coexist, so a half-migrated admin is
a working admin.
