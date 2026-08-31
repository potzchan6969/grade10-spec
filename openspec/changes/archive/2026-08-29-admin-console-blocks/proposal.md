# Admin console blocks: one home for what every console shares

**Author:** @seankcw - 2026-08-28

## Why

An operator's console is built nine times. Seven admin frontend packages and
two admin applications each compose the same surfaces from design-system
primitives, and because no designer works on the admin, nothing pulls those
copies toward a standard — they drift. A survey of all nine (2026-08-28)
found:

- The **data-table shell** — header row, bordered rows, horizontal scroll —
  exists as twelve inline copies (~600 lines) plus two shared
  implementations: the console package's table furniture and the shared UI
  package's `UserTable`. Three of the copies carry a verbatim comment
  admitting the shared rung exists and that they are not on it.
- The **async status triad** (loading / error / empty) is hand-written at
  fourteen sites, in two copy lineages (`Loading…` vs `Loading...`), and both
  brands' store dashboards render a refused read in the secondary text tone —
  an outage reads as an empty queue.
- The **section header**, **operator identity strip**, **status-badge
  mapping**, **key-value figure list**, and **cursor pager** repeat the same
  way: 22, 6, 9, 6, and 3 sites respectively. Loyalty alone holds two private
  `Figure` components that differ only by spacing.
- One console confirms five irreversible moves through the browser's native
  confirm dialog; another passes a flex-justify value its layout primitive
  silently ignores; three tables reuse an empty-string column heading as a
  list key.
- Seven filter and panel-switching controls are rows of toggled buttons; only
  one announces tab semantics. The design system's segmented and tab controls
  sit unused by every admin file.

The structural cause is that the shared home is ambiguous. The console
package in the application repo already holds a table, a form dialog, and a
debounce hook — but only four of the seven packages depend on it and only one
uses its table — while one admin block (`auth-user-directory`) lives in the
shared UI package here instead. The decision this change carries out: **admin
console UI leaves `@grade10/ui`**; the application repo's console package is
the one home, because admin surfaces carry no brand design and gain nothing
from the design-governance this repository exists to provide. External
component designs (Astryx) stay what they already are — a reference the
blocks may follow, never a runtime dependency.

**Metric:** inline reimplementations of the shared console shapes across the
nine admin surfaces — today 12 table shells, 14 status triads, 22 section
headers, 6 identity strips, 9 badge maps, 6 figure lists; zero of each after,
with every one rendered from the console package.

## What Changes

- **The console package becomes the single home.** It grows the shapes the
  survey found repeated: section header, operator identity strip, generic
  status badge, key-value figure list, and cursor pager, joining its existing
  table furniture, async status, and form dialog. Blocks compose design-system
  primitives, carry no brand, and take all content through props — an admin
  app's stylesheet is what themes them.
- **The user directory moves out of the shared UI package.** Its components,
  contract, and behavior are unchanged; only the home changes. The
  `auth-two-factor` blocks stay in `@grade10/ui` — signing in is a capability
  customer surfaces share, not admin UI.
- **All nine surfaces migrate onto the blocks.** Rendering is preserved —
  this is a consolidation, not a redesign — except where the survey found
  defects, each of which becomes a requirement: a refused read renders as an
  error, an irreversible move confirms in a dialog rather than the browser's
  native confirm, and every table amount names its ISO 4217 currency code.
- **Selection controls become legible.** Switching which panel is shown uses
  a control that announces tab semantics; narrowing a dataset uses a
  segmented choice whose selected option is announced. Both compose controls
  the design system already ships.
- **The copied utilities consolidate.** The refusal-swallowing mutation
  handler (eleven copies) and the ISO-code money formatter (five copies) move
  into the console package beside its debounce hook.

## Non-Goals

- **No redesign.** Blocks reproduce the rendering the consoles have today;
  the only visible changes are the named defect and semantics fixes. Adopting
  a new visual standard for the admin — Astryx-derived or otherwise — is a
  later change.
- **Domain-shaped surfaces stay put.** The auction listing editor and media
  manager, the vault case workspace, the audit chain strip, the POS kill
  switches, and the loyalty liability card each serve one console; extracting
  a single-consumer surface is premature.
- **The two admin applications stay two applications.** The survey found the
  second brand's admin app is a near byte-copy of the first; dissolving that
  fork (shared shell, shared pages) is its own change.
- **No design-system change.** No new primitive, variant, or token; the
  blocks compose what ships today.
- **No wire change.** Contracts, workers, and data are untouched.

## Capabilities

### New Capabilities

- `admin-console/console-blocks`: what the admin console block package is —
  where it lives, what it exports, how its blocks behave (honest async
  status, dialog confirmations, legible selection, money naming its
  currency) — and the rule that a console renders these shapes from the
  package rather than keeping a copy.
- `admin-console/user-directory`: the user-directory surface's contract,
  carried over from `shared-ui/auth-user-directory` unchanged in behavior,
  re-homed to the console package.

### Removed Capabilities

- `shared-ui/auth-user-directory`: moved to `admin-console/user-directory`.
  The shared UI package stops exporting the directory components.

## Impact

- **grade10 (application repo)** — `packages/frontend-console` grows the new
  blocks and receives the user-directory components; the seven admin frontend
  packages and both admin apps migrate onto it (audit, store, and auth
  consoles plus both apps gain the dependency they currently lack); the
  repo's layout conventions record the console package as the admin block
  home.
- **grade10-spec (this repo)** — `packages/ui` loses the
  `auth-user-directory` block directory and its public-entry exports once the
  application repo has re-pointed its imports; `specs/` gains the
  `admin-console` product and loses the `shared-ui/auth-user-directory`
  capability. `auth-two-factor`, the design system, tokens, and Figma are
  untouched.
- **Ordering** — unusually, the application repo lands first: the block must
  exist and be imported there before this repo may delete it, with the
  submodule bump closing the loop.
