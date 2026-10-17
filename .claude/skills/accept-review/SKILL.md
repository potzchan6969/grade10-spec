---
name: accept-review
description: Review a planned OpenSpec change before `pnpm spec:accept` - the PRD pages, the decisions, the journeys, the designs, the deltas and the durable specs they fold into must agree. Reports findings and a verdict in its review ledger; does not edit planning sources. Use after QA2 reconciliation and before acceptance, or when asked whether a change is ready to accept.
---

# Review Before Acceptance

- **Scope** - Review a change after QA2 reconciliation and before acceptance, in a fresh context that did not write its plan. Leave planning sources untouched; this skill writes only the review ledger.
- **Completion** - Deliver source-linked findings and a verdict per change. [Planning-dev](../planning-dev/SKILL.md) owns source repairs, QA restarts, acceptance and publication.

## Flow

1. **Evidence** - Follow [Planning and Review Efficiency](../../../docs/governance/planning-review-efficiency.md) for gate receipts, scoped expansions, reruns and bounded searches. Reuse matching evidence from planning-dev; otherwise run the missing gate once. A blocked preflight stops review.

   ```bash
   pnpm plan:review-preflight <change> --json
   ```

   ```bash
   pnpm accept:preflight <change>
   ```

   ```bash
   pnpm check:manual
   ```

2. **Prior review** - Use the ledger's reviewed revision and repair diff to bound a rerun, including changed dependencies. Without usable prior coverage, review in full.
3. **Read sources** - Open the manifest's lines and scoped expansions first. Follow related durable rules that consume a changed outcome. Batch independent reads into a review packet; expand disagreements rather than unrelated sources.
4. **Review** - Apply the checks below, using Cluster Mode when changes share requirements or dependencies. Use QA2's source-linked coverage and dispositions for unchanged reconciliations; investigate changed, missing or inconsistent evidence.
5. **Record** - Write the findings, reviewed revision, coverage and verdict to each change's ledger.

## Ledger and Reruns

- **Location** - Write `openspec/changes/<change>/accept-review.md`. It is a review record outside the acceptance hash, not a contract artifact. Use this format:

```
reviewed: <store commit sha>
source-identity: <review-scope digest, or unavailable>
baseline-identity: <durable baseline identity, or unavailable>
verdict: <the verdict line>

| # | Severity | Where | Finding | Owner | Fix in | Status |

## Coverage

| Source or dependency | Checked identity | Checks applied | Carried from |
```

- **Status** - Use `open`, or `fixed <sha>` after source verification. Rewrite the ledger with the reviewed SHA on a rerun.
- **Reruns** - A blocker or changed requirement text requires an independent rerun using the scope rules above. Fresh context does not mean a full reread. Other `fix` and `note` findings need no rerun. Record checked sources and carried-forward coverage beside the findings table.
- **Identity** - The manifest digest identifies review inputs, not every gate input. Record separate gate receipts and hashes for additional dependency sources. Unavailable identities or incomplete coverage prevent reuse of that evidence; they do not excuse a check.

## Cluster Mode

- **Entry** - Review changes sharing a requirement or linked by `depends_on` as one cluster after planning-dev reconciles it.
- **Ownership** - Read the reconciliation sheet first. Each shared requirement has one owner whose delta carries the edit; no other delta restates it. Check the decision log and acceptance order agree with the deltas.
- **Output** - Read shared sources once. Keep one findings table with a `Change` column, and a ledger and verdict for each change.

## Inputs

Read the store at its `main`, never the pinned copy:

- **The change** - `proposal.md`, `decisions.md`, `ui-design.md`,
  `tech-design.md`, `tasks.md`, `.openspec.yaml`, and every
  `specs/<capability>/` file: `spec.md`, `user-journeys.md`, `feature-tcs.md`
- **The pages** - each PRD page or chapter section the proposal links, and
  every page whose frontmatter `spec:` names a capability the change has a
  delta for
- **The durable contract** - `openspec/specs/<capability>/spec.md` for each
  delta, and the files the acceptance preflight lists under
  `Durable files to write`
- **Overlapping work** - every other active change with a delta on the same
  capability, accepted or not

## Checks

- **Warnings** - A `spec ... changed meaning` warning on a page in scope is a finding.
- **Page to delta** - every 🚧 line the change adds or keeps on a page is
   served by at least one requirement in its delta. Every ADDED or MODIFIED
   requirement serves a 🚧 or unmarked line on a page. A requirement no line
   asks for is scope the PM never confirmed.
- **Same facts** - every value, set, name and outcome a page states matches
   the requirement that carries it: the number, the unit, the clock, the cap,
   each member of a closed set, the reader's word for the thing. One fact
   stated two ways is a blocker, whichever side is right.
- **Nothing open** - no ❓ or `TBC` line in scope on a page, no open row in
   `decisions.md`'s `## Raised` table, no `awaiting:` entry. A decision row
   names the page line or requirement that carries it.
- **Folded result** - read the durable files after the fold, not only the
   delta: a MODIFIED or REMOVED requirement names one that exists on `main`; no
   requirement left unchanged now contradicts a new one; an unmarked page line
   the change makes untrue is rewritten or marked 🚧; and the durable
   capability `Purpose` still carries its existing scope alongside the change.
- **Designs** - each `ui-design.md` state ties to an anchor and agrees with
   the requirement for that state; `tech-design.md` delivers every requirement
   and adds no behaviour the spec and page do not state.
- **Journeys and cases** - every journey step and feature-set anchor is
   served by a scenario; every QA2 disposition is recorded; new cases stay
   `draft`.
- **Overlap** - no other change's delta on the same capability states the
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

- **Closed rows** - List each Raised row QA2 closed on its recommendation with the source it names; a closed row holds nothing, and the accepting human reopens one with one reply
- **Human input** - List blockers requiring an unresolved human decision using [Clarification Request](../../../AGENTS.md#questions-and-blockers). A blocker with one clear source repair stays in the findings table.
- **Verdict** - End with `Ready to accept`, or `Not ready - <n> blockers`. Pass findings to planning-dev for its source-repair and QA restart procedure; use the rerun rule above for this review.
