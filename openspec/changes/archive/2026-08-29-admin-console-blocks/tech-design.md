# Design — admin-console-blocks

## Context

Nine admin surfaces in the grade10 repo compose the same console shapes from
design-system primitives; the survey behind the proposal counts the copies.
The shared rung is split three ways today: `packages/frontend-console` in
grade10 (`Table`/`Row`/`Cell`/`At`/`Money`/`Status`, `FormDialog`,
`useDebounced` — 305 lines, four of seven packages depend on it, one uses its
table), the `auth-user-directory` block in `@grade10/ui`, and twelve inline
copies. Requirements live in
[`shared/console/blocks`](specs/shared/console/blocks/spec.md)
and [`shared/console/user-directory`](specs/shared/console/user-directory/spec.md).

Two facts constrain the plan:

- grade10 consumes this repo at a pinned submodule SHA. The design system
  gained `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and
  `TableCell` primitives on `main` after grade10's current pin, so the
  console package cannot compose them until a bump.
- Deleting the `auth-user-directory` block here before grade10 re-points its
  imports would break grade10's build at the next bump; the application repo
  must adopt first.

## Decisions

### The home is `@grade10/frontend-console`, in the application repo

Admin surfaces carry no brand design and no designer; the design governance
this repo provides (Figma sync, token pipeline, capability-per-block specs)
buys them nothing, while the application repo's console package already holds
a third of the shapes. Rejected:

- **Promote frontend-console into `@grade10/ui`** — reverses the recorded
  decision that admin UI leaves the shared UI package; every admin block
  would re-enter Figma-sync governance nothing exercises.
- **Adopt Astryx as the admin runtime** — a 0.x dependency under a
  production surface, a second component vocabulary for the same engineers,
  and its packaged themes bypass the brand-token theming both admin apps rely
  on. Astryx stays what it already is here: a design reference a component
  may follow (the design system's `Divider` is the precedent).
- **Status quo** — the survey's drift (two `Loading` lineages, an error
  rendered as an empty state, three homes for one table shell) is the cost,
  and it compounds.

### Port, don't redesign

Every new block reproduces the markup the survey found — the twelve table
copies are near byte-identical, so the shape is already agreed. A
rendering-preserving migration is what makes churn across nine surfaces
reviewable; the only visible changes are the ones the spec names (error tone,
dialog confirmations, selector semantics, currency codes, walkable queues).

### The console table furniture rebases onto the new design-system Table primitives

`frontend-console`'s `Table`/`Row`/`Cell` currently render raw `<table>`
markup because no primitive existed. It now does: compose
`Table`/`TableHeader`/`TableBody`/`TableRow`/`TableHead`/`TableCell` from
`@grade10/design-system`, keeping the console package's higher-level props
surface (headings array, `Status`, `At`, `Money`) unchanged for consumers.
The blank-heading list-key defect is fixed once here — the shell keys
headings positionally — which retires the three inline copies of that bug
structurally. Requires the early submodule bump below. Rejected: keeping raw
markup — it would re-fork the shape the primitives now own.

### The user directory moves by copy, adopt, then delete

The block's sources and tests copy into `frontend-console` unchanged in
behavior and export names; its internal table shell lands on the console
package's own furniture, dissolving the third table home. grade10-auth's
admin frontend re-points its imports in the same repo. Only then does this
repo delete `packages/ui/src/blocks/auth-user-directory` and its entry
exports. The `auth-two-factor` blocks stay: customer surfaces share them
(`console-blocks-SC-04`).

### Selector mapping uses existing primitives, not a new block

- Panel switching (`console-blocks-SC-10`): `Tabs`/`TabsList`/`TabsTrigger`/
  `TabsContent` — the sites are the grade10 admin app's vault, auction, and
  appointments pages; two sites already use Tabs and prove the fit.
- Dataset narrowing (`console-blocks-SC-11`): `SegmentedControl`/
  `SegmentedControlItem` — auction's bidders and fulfillment filters, both
  dashboards' window selectors.
- Long pickers (appointments' shop picker): `Select`, as post-sale already
  does.

Rejected: a `FilterBar` block wrapping these — the primitives already carry
the semantics; a wrapper would add a layer with no decision inside it.

### `StatusBadge` shares the shape, never the vocabulary

`StatusBadge` renders a `Badge` from a consumer-supplied
`Record<value, variant>` (plus optional label map) — the nine sites keep
their domain vocabularies local, per the directory precedent that shared
components carry no product vocabulary. Rejected: a central status → tone
vocabulary — auction's `capture_failed` and audit's chain states share
nothing.

### `CursorPager` composes the Pagination primitives

Newest/older cursor paging (audit's and the members page's hand-written
pair) becomes one block on `Pagination`/`PaginationPrevious`/
`PaginationNext`. It also closes auction's dead-end bidders footer
(`console-blocks-SC-14`). The auth directory's offset pager ("1–25 of 340")
is a genuinely different control and stays inside `UserTable` as ported.

### Utilities consolidate beside `useDebounced`

- `keepRefusal` (eleven copies, two comment wordings): exported once with
  one comment.
- The ISO-code money formatter (five copies including vault's exported
  `formatMinor`): one exported formatter; the `Money` cell composes it, and
  vault re-exports from the package or repoints its consumers.

## Risks / Trade-offs

- **Churn across nine surfaces.** Mitigated by rendering-preserving ports
  and per-package task groups, each verified by that package's own test
  suite before the next is claimed.
- **Cross-repo deletion ordering.** The delete-after-adopt sequence is
  enforced by group dependencies in tasks.md and by `check:submodules` at
  each bump; the failure mode (removed block, un-repointed import) cannot
  merge because grade10's typecheck breaks in the bump PR, not at runtime.
- **Selector semantics change real DOM.** Tabs and SegmentedControl bring
  their own styling; the three panel-switch sites and four filter sites get
  a visual diff. Bounded by keeping those conversions in their own tasks and
  eyeballing each surface in `pnpm dev --only=admin`.
- **Two submodule bumps.** One early (Table primitives), one late (after the
  block deletion). More ceremony, but each bump is a small reviewable PR and
  `check:submodules` gates both.

## Migration Plan

1. grade10: bump `external/grade10-spec` to current store `main` (brings the
   Table primitives); grow `frontend-console` (new blocks, utilities, table
   rebase).
2. grade10: copy the user directory into `frontend-console`; re-point
   grade10-auth admin-frontend.
3. grade10-spec: delete the `auth-user-directory` block and entry exports;
   update the shared-ui and specs READMEs.
4. grade10: migrate the seven packages and two apps group by group.
5. grade10: final submodule bump past the deletion; record the console
   package as the admin block home in `docs/conventions/code-layout.md`;
   full validation.
