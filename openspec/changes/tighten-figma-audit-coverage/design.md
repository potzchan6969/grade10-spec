## Context

See proposal.md — Why. Two facts shape the approach.

`auditExpectations(classString, v)` builds its expectation list by iterating
the classes the audit table supplies. Every rail is therefore class-triggered:
`nodeValues()` already reads the node's `fill` off the REST response, but
nothing compares it unless a `bg-*` class exists to raise the expectation. The
data needed to catch the `Nav` defect was fetched and discarded.

`--all-blocks` resolves a single `blocksDir` and walks its immediate children,
skipping `shared/`. The path is a constant, not a parameter.

The script already carries the argument this change generalizes. `overflow-hidden`
is checked non-optionally, and the comment says why: *"clipsContent is stated by
every frame and component, so this one is not optional: silence would itself be
the answer."* Fill and stroke are in exactly that class, and were treated as
optional only because nothing raised them.

## Goals / Non-Goals

**Goals:**

- Omission and drift are the same kind of finding for a property a node always
  states.
- One sweep covers both packages, so where a component lives stops determining
  whether it is checked.
- The tightened rail lands green: no known drift outstanding when it ships.

**Non-Goals:**

- Changing how values are resolved or compared. `values.mjs`, the token
  resolver, and the hex comparison are untouched.
- Auditing anything below a component's root. The audit table stays the unit of
  coverage, listing the elements the converter chose.
- A general "every Figma property must be accounted for" rail. Only fill and
  stroke change category.

## Decisions

**Expectations become node-driven for fill and stroke, class-driven for
everything else.** After the per-class loop, a second pass reads the node's
values and raises an expectation for a drawn fill or stroke that no class
claimed. The finding must name the value the node draws — a bare "missing
background" would send the reader back to Figma to learn what to write.

*Alternatives considered.* Requiring every audit-table entry to declare a
`bg-*` class explicitly, `bg-transparent` where there is none — rejected: it
turns a rail into a documentation chore, and an entry written before the rule
would read as compliant while saying nothing. Comparing whole computed styles
against the node — rejected as far beyond the script's remit and its resolver.

**The sweep takes a list of roots.** `blocksDir` becomes an array: the
`packages/ui/src/blocks` capability directories as today, plus the design-system
component directories. The `shared/` exemption stays, keyed by path rather than
by bare directory name so it does not accidentally exempt a same-named directory
under the new root.

*Alternatives considered.* Discovering `audit.json` by glob across the whole
repository — rejected: a directory carrying no table must report as *uncovered*,
which requires knowing the set of directories that ought to have one; a glob
finds only the files that exist and silently loses the gaps. Moving `Nav` and
`Footer` into `packages/ui` so the existing single root finds them — rejected in
the proposal's Non-Goals.

**Coverage is reported per root.** With two roots the uncovered list mixes
blocks and design-system components, and `store-profile` next to `overlays`
reads as one flat set of equals. Group the tail by root so a reader can tell
which package a gap is in.

**`Footer` is repainted in this change, not a follow-up.** The rail must ship
green; a nightly that goes red on landing is one people learn to ignore. The
direction is settled by the source of truth: `footer.figma.ts` points at
`4171:9653`, that node draws `Base/primary`, so the code is what is stale.

*Alternatives considered.* Landing the rail red with the repaint tracked
separately — rejected above. Withholding the chrome `audit.json` until the
repaint lands — rejected: it ships coverage that deliberately excludes the
component that motivated the change.

**`Nav`'s fill is already fixed** and is deliberately not re-litigated here.
Verifying it is what produced this change; the rail must now be able to catch
its recurrence, which is what the chrome `audit.json` is for.

## Risks / Trade-offs

**A node with a fill the code intentionally does not paint** — a component
whose background is the consumer's to supply — now fails. → The audit table
already carries per-element classes; an element that means it can say
`bg-transparent`, which raises an expectation that the node's fill is absent
and fails honestly rather than passing by silence. If a legitimate case appears
that this cannot express, it is evidence for an explicit opt-out, not for
loosening the rail.

**The chrome's `audit.json` covers only the roots of `Nav` and `Footer`.** The
promo bar, the utility row, and the bottom bar go unaudited unless listed. →
List the regions the two conversions actually styled, not just the roots. The
coverage is still partial by construction, which is what the uncovered
reporting exists to make visible.

**Repainting `Footer` changes both storefronts' appearance on their next
submodule bump.** → That is the intended correction, and it is the design's own
value. It is called out in the proposal's Impact so neither application is
surprised, and `ui.md` names the frame both should compare against.

**The rail still compares values, not variable names.** A hardcoded
`bg-[#1a1a1a]` passes where `bg-primary` was meant. → Unchanged by this work and
recorded in the proposal's Non-Goals; `get_variable_defs` in an interactive
session remains the check that distinguishes them.
