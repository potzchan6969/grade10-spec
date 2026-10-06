---
name: accept-review
description: Review a planned OpenSpec change before `pnpm spec:accept` - the PRD pages, the decisions, the journeys, the designs, the deltas and the durable specs they fold into must agree. Reports findings and a verdict; edits nothing. Use after QA2 reconciliation and before acceptance, or when asked whether a change is ready to accept.
---

# Review Before Acceptance

Acceptance publishes the deltas into `openspec/specs/`, and implementation
builds from that durable contract alone. A PRD line the spec contradicts, or a
requirement no page line asked for, reaches the engineer as settled. This
review catches that before `pnpm spec:accept`, not at archive.

Run it in a fresh context that did not write the plan. It reads and reports;
the owning hand fixes the source.

## Inputs

Read the store at its `main`, never the pinned copy:

- **The change** - `proposal.md`, `decisions.md`, `ui-design.md`,
  `tech-design.md`, `tasks.md`, `.openspec.yaml`, and every
  `specs/<capability>/` file: `spec.md`, `user-journeys.md`, `feature-tcs.md`
- **The pages** - each PRD page or chapter section the proposal links, and
  every page whose frontmatter `spec:` names a capability the change has a
  delta for
- **The durable contract** - `openspec/specs/<capability>/spec.md` for each
  delta, and the files `pnpm accept:preflight <change>` lists under
  `Durable files to write`
- **Overlapping work** - every other active change with a delta on the same
  capability, accepted or not

## Checks

1. **Machine gates** - run `pnpm accept:preflight <change>` and `pnpm
   check:manual`. A refusal is a blocker; a `spec ... changed meaning` warning
   on a page in scope is a finding.
2. **Page to delta** - every 🚧 line the change adds or keeps on a page is
   served by at least one requirement in its delta. Every ADDED or MODIFIED
   requirement serves a 🚧 or unmarked line on a page. A requirement no line
   asks for is scope the PM never confirmed.
3. **Same facts** - every value, set, name and outcome a page states matches
   the requirement that carries it: the number, the unit, the clock, the cap,
   each member of a closed set, the reader's word for the thing. One fact
   stated two ways is a blocker, whichever side is right.
4. **Nothing open** - no ❓ or `TBC` line in scope on a page, no open row in
   `decisions.md`'s `## Raised` table, no `awaiting:` entry. A decision row
   names the page line or requirement that carries it.
5. **Folded result** - read the durable files after the fold, not only the
   delta: a MODIFIED or REMOVED requirement names one that exists on `main`; no
   requirement left unchanged now contradicts a new one; an unmarked page line
   the change makes untrue is rewritten or marked 🚧.
6. **Designs** - each `ui-design.md` state ties to an anchor and agrees with
   the requirement for that state; `tech-design.md` delivers every requirement
   and adds no behaviour the spec and page do not state.
7. **Journeys and cases** - every journey step and feature-set anchor is
   served by a scenario; every QA2 disposition is recorded; new cases stay
   `draft`.
8. **Overlap** - no other change's delta on the same capability states the
   same requirement differently. An accepted one means this acceptance is an
   amendment against its result.

## Report

One table, blockers first:

| # | Severity | Where | Finding | Owner | Fix in |
| --- | --- | --- | --- | --- | --- |

- **Severity** - `blocker` holds acceptance; `fix` is cheap and should land
  first; `note` holds nothing
- **Where** - both sides of a disagreement, as `path:line` or requirement id
- **Fix in** - the source first: a product fact on the page and
  `decisions.md`, then the delta, then cases and tasks, per
  [PRDs and OpenSpec](../../../docs/governance/prd-and-openspec.md)

Under the table, list every blocker the owning hand cannot fix without a
human's decision as a [Clarification Request](../../../docs/governance/round-summary.md#clarification-request).
A blocker with one obvious fix stays in the table alone.

End with one verdict line: `Ready to accept`, or `Not ready - <n> blockers`.
A fix that moves a frozen anchor restarts QA1 and Dev; any other fix reruns QA2
and then this review, per `planning-dev`.

## Related

- `planning-dev` - runs this review between QA2 and acceptance
- `prd-authoring` - what a page line may say
- `tcs-review` - the human suite review after implementation
