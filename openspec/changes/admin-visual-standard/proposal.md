**Author:** @sean - 2026-08-29

## Why

The admin ships without a designer, and it shows. Nobody has ever decided what
an operator console should look like here, so its appearance is the accumulated
default of whoever built each surface: `admin-console-blocks` surveyed nine of
them and counted 22 section headers, 6 identity strips, 9 badge maps and 12
table shells, each independently invented. That change consolidates them — one
header, one badge, one table — but consolidation answers *how many* shapes
there are, never *which* shape is right. After it lands, the admin has one
appearance that no one chose.

The cost is not aesthetic. An operator moves between nine consoles in a shift,
and every surface that arranges the same facts differently is a surface they
read more slowly. It is also a governance gap with no owner: the design system
covers the storefronts through Figma sync, a token pipeline, and the
`design-sync/audit-coverage` rail, and all three deliberately exclude the
admin — that exclusion is the premise `admin-console-blocks` was built on. The
admin is the one product surface where a visual decision has no home.

Astryx is already in this codebase, in both roles the argument needs: the
design system's `Divider` follows its design as a reference, and
`tools/openspec-viewer` renders its components as a runtime. It is a complete
operator vocabulary — shell, side navigation, headings, badges, banners,
segmented control, spinner — designed for exactly the surface the admin is,
by people whose job that was.

**Metric:** admin surfaces rendering a design-system primitive directly —
today 29 distinct component paths across nine consoles and two shells; zero
after, with every admin pixel coming from one vocabulary. Counter-metric,
because this change can fail loudly: operator-visible regressions in the
semantics `admin-console-blocks` established — announced tab and filter
selection, refused reads in the error tone, dialog confirmations — must be
zero, and each is testable today.

## What Changes

- **Astryx becomes the admin runtime.** `@astryxdesign/core` is a dependency of
  the admin applications, and admin surfaces render its components rather than
  the design system's primitives. The console package's blocks compose Astryx;
  the nine product console surfaces and both application shells follow.
- **The admin's brand identity is restated in Astryx's terms.** Both admin
  applications theme themselves today by compiling Tailwind against the design
  system's tokens scoped to a brand class. Astryx ships its own stylesheet and
  theme mechanism. This change decides which one carries brand identity in the
  admin, and the answer must survive both brands rendering the same console.
- **The semantics already won are carried across, not re-litigated.** Every
  behavioural requirement `admin-console-blocks` established holds afterward:
  three distinguishable async states with refusal in the error tone,
  irreversible moves confirmed in a rendered dialog, panel switches announced
  as tabs, row filters as a segmented choice, tabular amounts naming an ISO
  4217 code, and longer queues walkable.
- **Surfaces customers also see keep one definition.** Two-factor enrollment is
  rendered by both admin applications and by customer surfaces, from one shared
  block. This change states how that block appears inside an Astryx admin
  without forking it — a fork would reverse a decision `admin-console-blocks`
  makes deliberately.
- **The dependency carries stated terms.** A third-party runtime under an
  operator surface is a standing liability: this change fixes the version
  discipline, what a breaking upgrade obliges, and what reverting looks like.

## Non-Goals

- **No behaviour change.** What an operator can do, see, and be refused is
  unchanged. This governs appearance and the vocabulary that produces it.
- **No storefront change.** The customer surfaces keep the design system, Figma
  sync, and the audit rail. Nothing here is a precedent for them.
- **No design-system change.** No primitive is added, removed, or restyled to
  accommodate the admin; the design system stops being the admin's supplier
  rather than changing for it.
- **The two admin applications stay two applications.** Dissolving that fork is
  still its own change.
- **No wire change.** Contracts, workers, permissions, and data are untouched.

## Capabilities

### New Capabilities

- `admin-console/visual-standard`: what an operator console looks like, which
  vocabulary renders it, how brand identity reaches it, and the terms the
  third-party runtime is held to.

### Modified Capabilities

None. `admin-console/console-blocks` governs what the blocks *are* and what
they export; this change governs what they *look like* and what renders them,
and does not alter a requirement there. That capability also does not exist in
`openspec/specs/` yet — it lands when `admin-console-blocks` archives, which
is a precondition for this change rather than a conflict with it.

## Impact

- **Blocked on `admin-console-blocks` archiving.** That change is what makes
  this one a swap rather than a rewrite: it collapses 12 table shells and 22
  headers into roughly ten blocks behind one public entry. Starting before it
  lands means paying its consolidation cost twice.
- **`packages/frontend-console`** — every block's markup, and its dependency on
  `@grade10/design-system`.
- **Nine product console surfaces** under `packages/*/admin-frontend`, and both
  shells under `apps/admin/`.
- **Theming, in both applications.** `apps/admin/*/src/index.css` compiles
  Tailwind against `@grade10/design-system/theme.css` plus a brand theme scoped
  to a document class. Astryx ships `reset.css` and `astryx.css` and its own
  theme mode. Two global stylesheets over one document is the central risk this
  change has to resolve, not defer.
- **A 0.x dependency under a production surface.** `@astryxdesign/core` is
  `0.5.0` upstream and `^0.1.9` where this repository already uses it — four
  minor versions apart on a line where minors carry breaking changes. The
  openspec-viewer absorbs that because it is a developer tool; an operator
  console does not.
- **A second component vocabulary for the same engineers.** Astryx and the
  design system both publish `Badge`, `HStack`, `VStack`, and
  `SegmentedControl`. Every admin file will import one and every storefront
  file the other, under the same names.
