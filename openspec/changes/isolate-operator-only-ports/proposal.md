**Author:** @seankcw - 2026-08-23

## Why

The `frontend-composition` capability says a composition root MUST NOT name an
individual feature slice's dependency-injection module. Both merged admin
panels do exactly that today, and have since the convention was recorded:
`apps/admin/grade10/src/di/container.ts` and its ZZZ sibling each load the
two-factor slice's module by name, under a comment explaining why the rule
could not be followed.

The comment is the evidence. Only an operator's auth client carries the
two-factor plugin, so the port that slice resolves is one no collector-facing
surface can satisfy. Publishing the module in the product's shared list would
leave an unbound token in every storefront that loads it. Faced with that, the
convention has one escape and engineering took it: bind the port optionally in
the shared core module, keep the slice out of the published list, and name it
by hand in each root that can supply the client.

That escape is the actual defect, and it is a category rather than an instance.
An optional port in a shared core module is a hole in a compile-time boundary:
nothing stops a collector-facing root from omitting the client and loading the
slice anyway, and nothing but a comment tells the next person why they must
not. Any product that grows an operator-only surface reaches the same wall and
writes the same carve-out. Two of the four capability requirements are
unsatisfied for this one slice — the root-loads-lists rule, and the rule that
an operator-serving package publishes its modules as one list.

Success is measured by the count of composition roots naming an individual
feature slice module, which is two today and must be zero, and by the count of
optional client ports in a shared core module, likewise two today and zero
after.

## What Changes

- Add a requirement to `frontend-composition`: a client port a
  collector-facing surface cannot satisfy lives in the product's
  operator-facing frontend package, and a shared core module never declares a
  port optional to accommodate one.
- Bring the auth product into conformance: the operator's second factor moves
  to that product's operator-facing frontend package, which publishes its own
  module list and its own core-module factory, and the shared package's port
  set returns to what every surface can satisfy.
- Leave the three existing requirements unedited. They were right; the code
  was not.

## Non-Goals

- Splitting the collector-facing session slices. Sign-in and sign-out are
  mounted by every surface over a port both client kinds satisfy, and a second
  copy for operators would be duplication with no boundary behind it.
- Moving the panels' own presentation. How a brand words and arranges a
  second-factor screen stays brand-owned view code in each panel, as it is for
  every other capability they show.
- A general rule that operator and collector code never share a package. The
  boundary drawn here is the client port; a package split follows a port a
  collector cannot satisfy, not an audience.
- Deriving which packages a panel composes. Written out, per the existing
  capability.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `frontend-composition`: adds where an operator-only client port lives, and
  forbids the optional-port escape that let a composition root name a slice
  module directly.

## Impact

- Affected consumer: the Grade10 application repository — the auth product's
  frontend packages, and both `apps/admin/*/src/di/container.ts`.
- One new workspace package for the auth product's operator-facing frontend;
  both admin panels take it as a dependency.
- No user-visible behavior, no wire contract, no backend change, no design
  token or component export. Every binding that resolves today resolves after,
  and an operator's enrollment, verification and disable paths are unchanged.
- Durable guidance follows in `docs/conventions/packages.md`, the Handbook, and
  the application repository's `react-clean-architecture` skill.
- Recorded after the fact. The implementation was written in the application
  repository before this change was opened, so the tasks describe work that
  already exists rather than work to be scheduled; they are claimed and
  checked off once that work is pushed, on the same terms as any other. The
  normal order is proposal first, and this one inverts it.
