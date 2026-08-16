# Reinstate a shared compound-component package

**Author:** @seankcw - 2026-08-14

## Why

A shopper is about to see the same store surfaces in two applications.
`zzz-store` is being stood up as a second consuming application alongside the
Grade10 store, and the store-listing primitives that landed in the design
system on 2026-08-14 (product card, pagination, breadcrumbs, checkbox lists,
stepper) exist to be composed into surfaces both stores render.

Today the contract says each application implements its own compound
components. That rule was recorded when there was exactly one consuming
application: the portable component package was removed because a prebuilt
package with a single consumer was distribution overhead with no reuse payoff.
With a second application, the same rule produces the opposite problem — the
same component source written twice, drifting independently, so a shopper sees
different behavior per store and every fix lands twice. The evidence is the
removal itself: the costs it solved (a committed `dist/`, lockstep versioning
for one consumer) were costs of *prebuilding*, not of *sharing*, and
`@grade10/design-system` already demonstrates the source-consumed alternative
working across the submodule boundary.

## What would move

If this change works, a shared compound-component fix or contract change ships
as exactly one implementation change in this repository plus props wiring in
each application. The number of application-owned copies of a compound
component named in a capability spec is zero; without this change it trends to
one per application per component.

## Scope

- **A new workspace package, `packages/ui`.** One shared component set,
  organized by capability, consumed from source through the submodule exactly
  as the design system is. No build step, no committed artifact. Requirements
  are carried in the new `shared-ui/component-package` capability delta.
- **The package starts empty.** The former featured-markets capability was
  retired as a product decision: its spec, PRD, and design file are removed
  from this repository, and no export is carried forward. The first shared
  components arrive with the store-listing surface's own change.
- **Governance updates.** The package list, the component-source statements in
  the agent instructions, the UI component contracts guide, and the spec
  README's product groupings all change to record the new home.

## Affected component exports and consuming applications

No component export changes hands in this change: the package ships empty,
and the retired featured-markets capability leaves no export behind for any
application to implement or import.

Consuming applications:

- **grade10** — nothing to migrate; it bumps the submodule SHA and gains the
  package as the import source for future shared components.
- **zzz-store application** — no migration; it adopts the package when it
  builds its first surface and never grows a local copy.

## Non-goals

- **No new compound components.** The store-listing surface (PLP) is a
  separate future change with its own capability spec; this change only builds
  the home it will ship from.
- **No zzz-store capability specs.** What zzz-store renders is specified when
  that product's capabilities are written.
- **No prebuilt or published artifact.** The package is source-consumed; this
  change does not reintroduce a build step, a `dist/`, or an npm publication.
- **No change to design-system ownership.** Primitives, the token pipeline,
  and the Figma sync rules are untouched; the new package composes primitives
  and adds none.
- **No movement of application-owned state.** Data fetching, routing, stores,
  analytics, and adapters stay in the applications, as the capability specs
  already require.

## Compatibility and migration

Nothing breaks: no application implements or renders a shared compound
component today, so this change only creates the home future ones ship from.
Because the package is consumed from source, no versioning or publish step is
introduced; applications continue to pin the submodule SHA and move it by
normal pull request.

## Validation

- In this repository: `pnpm run typecheck`, `pnpm run lint`, and
  `openspec validate reinstate-shared-ui-package`.
- After the agent-instruction edits: `pnpm run agent:sync-parity` and
  `pnpm run agent:check-parity`.
