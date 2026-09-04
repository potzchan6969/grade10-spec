## Context

See proposal.md — Why. Three facts shape the approach.

`check-components.mjs` builds `variants: []` for a node that is a `COMPONENT`
rather than a `COMPONENT_SET`, and `checkValues` iterates that array. A
standalone component therefore falls through every value comparison without
being reported as skipped.

Its findings all land in `report.warns`. There is a `report.diffs` channel
beside it that feeds the job summary, so the structured record of a mismatch
already exists — what is missing is a severity, not a datum.

Both rails import `expectations()` from `values.mjs`. Whatever omission logic
is added has to work for both callers, or the two drift apart in exactly the
way two rails on one component would.

## Goals / Non-Goals

**Goals:**

- Coverage follows from whether a component has variant axes, not from which
  rail someone remembered to point at it.
- A disagreement about a drawn value fails; a disagreement about hygiene does
  not.
- One definition of "the code omitted what the design draws", used by both
  rails.

**Non-Goals:**

- Changing how values resolve or compare. `values.mjs`'s resolvers and the hex
  comparison are untouched.
- Auditing states. `check-components.mjs` compares base states only — a hover
  or disabled value expressed as an opacity over the variant's own colours
  stays invisible, as its header already records.
- Retiring either rail in favour of the other.

## Decisions

**The omission check moves into `values.mjs` and both rails call it.**
`tighten-figma-audit-coverage` put `nodeOmissions` in `audit-node.mjs` because
it had one caller. It now has two, and the argument it encodes — that `fills`
and `strokes` are stated by every frame, so an empty one is an answer — is a
fact about Figma, not about either script.

*Alternatives considered.* Copying the function into `check-components.mjs` —
rejected: two copies of a rule about what silence means is how the two rails
start disagreeing about the same component. Having `check-components.mjs`
import from `audit-node.mjs` — rejected: that file is an entry point with
top-level `await` and argument parsing, not a module.

**Severity is decided by what a finding claims, not by which check produced
it.** A finding that says the code draws the wrong value is an error; one that
says a description is missing or a Figma component has no code counterpart is
a warning. This splits the existing `report.warns` rather than adding a
parallel channel — `report.diffs` already carries exactly the value findings
that become errors, so the split follows a line the file already draws.

*Alternatives considered.* Every finding becomes an error — rejected: 20 of
today's 27 warnings are Figma components nobody has built, which is a backlog,
not a defect. A `--strict` flag that CI passes — rejected: a rail whose
severity depends on how it was invoked teaches people to invoke it the other
way.

**A standalone component is covered by an audit table, and the sweep knows
which components need one.** Rather than reporting a directory as uncovered,
the sweep resolves each `.figma.ts` in it, asks whether its node is a set, and
reports the standalone ones that no audit table names.

*Alternatives considered.* Extending `checkValues` to compare a standalone
component's own values directly, with no audit table — genuinely attractive,
and rejected on the element↔node mapping: a standalone component is one Figma
node against a whole rendered tree, and choosing which element to compare it
to is the judgment the audit table exists to record. The chrome's own table
needed six entries for two components, and one of them — the split root and
surface in `product-card-image` — could not have been inferred.

**The 13 tables are written from the Figma nodes, not from the code.** Reading
the class strings out of each component and calling that the expectation would
record what the code does as what the design wants, which is a table that can
never fail. Each entry is written by opening its node.

**Three findings the backfill produced, and what each turned out to be.** All
three were the audited element and the node expressing different things, not
the code rendering a wrong value — which is the outcome task 3.5 exists to
distinguish, and the reason it forbids editing a table into agreement.

- **`DropdownMenuContent`'s gap.** The popup node's `itemSpacing` separates a
  single `Items` slot and describes nothing visible; the slot's own spacing is
  4px, exactly what `gap-1` renders. One element implements two nodes, so it
  is audited as two entries — the box against the frame, the item spacing
  against the slot. The inverse of the split `product-card-image` needed.
- **`DialogContent`'s clipping.** The rail read `clipsContent: false` as the
  design refusing to clip. It is not: a frame drawn at the size of the content
  it holds clips nothing, while a dialog with a height ceiling must clip to
  scroll. `overflow-hidden` is now unchecked wherever the element also declares
  scrolling or a max height — the two facts do not contradict each other.
- **`BreadcrumbEllipsis`'s width.** Figma draws a 12px TEXT glyph; the code
  renders a 20px `DotsThree` icon, which needs a 20px box. Recorded as a
  divergence rather than reconciled, because closing it means changing what is
  drawn on one side or the other, and that is a decision for whoever owns the
  breadcrumb's appearance — not something to settle inside a coverage change.

**Divergences are recorded in the table, not dropped from it.** A row may carry
`diverges`, mapping a class to why it is deliberately not compared, and the run
prints each one. The alternative — quietly leaving the class out of `classes` —
produces a table a reader cannot distinguish from a complete one, which is the
failure this change's own risk section names.

## Risks / Trade-offs

**Thirteen components enter a rail that has never run on them, and findings
are likely.** → That is the point, and the precedent is good: the chrome's two
components produced two genuine findings, both real drift. Each finding is
triaged as it appears — corrected where the code is wrong, recorded where the
design is stale. The proposal says to expect them rather than promising green.

**Splitting warning from error could mis-sort a finding whose class is
ambiguous.** → The line is whether the finding asserts the rendered result is
wrong. `report.diffs` already contains exactly that set, so the sort is
mechanical rather than a judgment made per finding.

**A backfilled table can be written to pass.** An entry whose classes are
copied from the code compares the code against itself. → No tooling can catch
this; it is a review obligation. Each entry carries the node it was written
from, so a reviewer can open it. This risk already exists for every block
table and is not made worse here.

**Two changes queue deltas on one capability for the first time in this
store.** → Both are `ADDED`, so neither rewrites the other's requirement text,
and archive order is stated in the proposal. If the archive tooling turns out
to mind, the fallback is to archive `tighten-figma-audit-coverage` and rebase
this delta against the folded spec — cheap, because nothing here edits a
requirement that change introduced.
