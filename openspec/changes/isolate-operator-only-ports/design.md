## Context

`frontend-composition` already fixes what a composition root may load and what
a frontend package must publish. It does not say where a port lives when only
some surfaces can satisfy it, and that omission is what the auth product ran
into: one better-auth client kind carries the two-factor plugin and the other
does not, so the port the second-factor slice resolves is unsatisfiable in a
storefront.

The escape taken at the time — an optional binding in the shared core module,
the slice withheld from the published list, the module named by hand in the two
roots that can supply the client — is the state this change replaces. See
proposal.md for why that is a defect rather than a workaround.

Two constraints shape the approach. Dependency-injection tokens intern by
description across one application container, so two packages loaded into the
same panel cannot reuse a description. And a brand's panels are assembled from
several products' packages at once, so anything added here is composed
alongside the store, auction and audit packages rather than in isolation.

## Goals / Non-Goals

**Goals:**

- Make the boundary a dependency fact: a surface that cannot satisfy a port
  does not install the package that declares it.
- Return both admin composition roots to the published-list rule with no
  carve-out and no explanatory comment standing in for a boundary.
- Leave the collector-facing session slices reachable exactly as they are, from
  the same subpaths, for all six surfaces that mount them.

**Non-Goals:**

- Consolidating the panels' own second-factor screens. See proposal.md.
- Changing how a slice is laid out internally, or how its bindings are tested.

## Decisions

**A separate workspace package, not a second core module inside the shared
one.** A package is the only boundary that a consumer cannot cross by accident:
a storefront that never depends on it cannot import a subpath of it, and its
module list cannot reach a container that did not ask for it. Two alternatives
were rejected. Keeping the slice in the shared package behind a second,
required core-module factory fixes the optional binding but leaves every
subpath importable from a storefront, so the boundary is still a convention.
Discriminating the shared core module on a client kind — one factory that
accepts either client and binds what that kind supports — keeps one package but
makes every consumer's capabilities a runtime property of what it passed, which
is the optional port again with more machinery.

**The port is a required dependency of the new core-module factory.** This is
the whole point rather than a detail: an optional port is a hole in a
compile-time boundary, and a required one means a consumer that cannot build
the client cannot call the factory at all. The requirement added to the
capability is written against this, not against the package layout.

**The new package declares its own token namespace.** Tokens intern by
description, and a panel holds this package's bindings beside the shared auth
package's, the store admin's and the audit console's. The description carries
the product and the operator role, so neither the shared package's namespace
nor a bare one is reused.

**No dependency on the sibling collector-facing package.** The capability
sanctions an admin package composing its sibling's core for shared plumbing,
but there is nothing to share here: the container plumbing comes from the
browser DI package directly, as it does in every other frontend package, and
the two auth packages name each other nowhere. A panel passing one client to
both factories is what connects them, at the composition root, which is where
the capability already puts that knowledge.

**The panels keep their own presentation.** Each brand's second-factor screens
stay brand-owned view code composing shared blocks, as they are for every other
capability a panel shows. The slice ships commands, not screens.

**One negative test is replaced rather than moved.** The old suite asserted
that a container without a two-factor client could not resolve the repository —
a property that existed only because the port was optional. Its replacement
asserts that the slice resolves nothing without its core module, which is the
property that survives: the slice reaches its client through the port and never
builds one.

## Risks / Trade-offs

- **One product, two frontend packages.** A reader looking for a session slice
  now has two places to look. Mitigated by the split being the same one every
  other product with an operator surface already makes, and by the packages
  being named for the audience rather than for the feature.
- **A package per operator-only slice is a low bar to clear.** The auth package
  ships one slice today. This is the same bet the capability already made for a
  single-slice published list: the second slice joins a package that exists
  rather than triggering a migration.
- **The panels' duplicated second-factor screens are untouched** and remain
  near-identical between brands. That duplication is brand-owned composition
  over shared blocks, which the layout rules allow deliberately; this change
  neither worsens nor addresses it.
