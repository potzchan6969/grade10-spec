---
name: planning-pm
description: Write the product manager's half of an OpenSpec change - proposal, purpose and feature set, user journeys, a blind test suite and the scenarios reconciled against it. Use when a PM or designer is specifying a change, and stop where the requirements stop.
---

# The product manager's artifacts

Four of the seven artifacts in `grade10-planning` are yours, and they are the
first four. `specs` is written in **two passes over one file**, with the blind
suite between them:

| Artifact | File | What it holds |
| --- | --- | --- |
| `proposal` | `proposal.md` | Why this problem, for whom, what it will not do |
| `specs` — pass one | `specs/<capability>/spec.md` | `## Purpose` and `## Feature set`, then stop |
| `user-journeys` | `specs/<capability>/user-journeys.md` | The stories added, changed or retired, and the ones this change leans on |
| `test-cases` | `specs/<capability>/feature-tcs.md` | A blind suite, written without sight of the scenarios |
| `specs` — pass two | `specs/<capability>/spec.md` | The requirement deltas and their scenarios, reconciled against that suite |

The schema cannot express that order — `requires` is advisory and has never
stopped anyone writing the scenarios first. The split that used to try was
undone because it bought nothing and cost three things: a status line that
called the second pass done as soon as the first wrote the file, two viewer tabs
over one document, and a change in another repository to fix the second.

**Stop there.** A designer writes `ui-design.md`, and the engineer who picks the
change up writes `tech-design.md` and `tasks.md` - on this same change, never a
second one. A change with no `tasks.md` reads as still being planned on both
boards; that is the handoff signal, and it is the only one, so say the change
needs picking up rather than assuming someone will find it.

The PRD under `docs/prds/` is yours to keep whole. Everyone writes on it - a
designer's state, an engineer's constraint, a QA case that exposes a rule nobody
wrote land there first, marked 🚧 or ❓ - and you are the hand that keeps it one
record.

## Why this workflow has the shape it has

A suite derived from the scenarios can only find inconsistency inside them. It
can never find the behaviour they left out, because it was written from them.
Boundary values, empty states, nulls, SEO - the details a test-design reading
catches and a requirement-decomposition reading does not - had no mechanism in
this store that found them.

So the scenarios and the suite are now **two independent readings of the same
anchors**, written by sub-agents that cannot see each other's work, and
reconciled after both land. The difference between them is the finding.

Ordering is not the mechanism; independence is. Writing the suite first and the
scenarios from it would be a relay, not a cross-check - whoever writes second
copies the first.

## The run

The author triggers `/planning-pm` and nothing else. Everything below happens
inside that one invocation.

```
grilling                        author answers rounds until the frontier is empty
    ↓
PRD marks 🚧 / ❓                the source of the feature set's groups
    ↓
spec-outline                    Purpose + Feature set
    ↓
user-journeys
    ↓
    ├── sub-agent A → scenario draft      identical inputs,
    └── sub-agent B → feature-tcs.md      neither sees the other
    ↓
reconciliation                  join on anchors
    ↓
spec-behaviour + ## Reconciliation
```

Everything this run produces is `draft`. Nothing in it claims review.
`/tcs-review` is QA's, in its own pull request, at its own pace.

## Steps

1. **Read from an up-to-date main.** `git fetch origin` first; when
   `git log --oneline HEAD..origin/main` is not empty, update before reading. A
   MODIFIED block copied from a stale spec silently reverts whatever landed in
   between, and an overlap scan against a stale `openspec/changes/` finds
   nothing. Then read the capability's PRD under `docs/prds/` when one exists,
   then every active change in `openspec/changes/` on its spec, then the
   capability under `openspec/specs/<product>/<domain>/<capability>/`. An active
   change already folding a requirement this one touches is extended or
   superseded, never doubled: whichever archives second reverts the first. Find
   facts yourself - bring only decisions to the author.

2. **Interview the author.** Run the `grilling` skill's round-based frontier
   interview before drafting. Do not write until the frontier is empty and the
   author confirms shared understanding. The interview scales with the open
   questions, not the change's size.

   A question settles three ways: answered, accepted as recommended, or
   **deferred** - the author saying they are not the right person for it. A
   deferred question goes under the proposal's open questions with a note on who
   should settle it, and does not hold the draft. Sizing, export names, and what
   code a change touches are never the author's to answer.

3. **Mark the PRDs first.** One 🚧 line per outcome the reader can see, in the
   reader's words and in the section it belongs to; a ❓ line or decisions row
   for what the author deferred; the decisions the change turns on
   (`prd-authoring`). House style is `docs/governance/writing.md`.

   **These marks are the source of the feature set's root groups.** Every group
   traces back to a line here, which is also why a change that marks a 🚧 line
   can never claim `skip_specs`.

   A capability with no PRD gets one first, or the change records
   `page_waived: <why>`. `pnpm check:manual` refuses a change carrying deltas
   with neither a 🚧 line under a linked section nor the waiver.

4. **Create the change through the CLI.**

   ```bash
   pnpm openspec new change <change-name> --schema grade10-planning
   ```

   Kebab-case. A directory made by hand records nothing in `.openspec.yaml`.

5. **Read the enriched instructions as you reach each artifact.**

   ```bash
   openspec instructions proposal --change <change-name>
   openspec instructions specs --change <change-name>
   openspec instructions user-journeys --change <change-name>
   openspec instructions test-cases --change <change-name>
   ```

   These carry this store's own rules on top of the schema's. Read them rather
   than working from memory; `specs` carries both of its passes.

   `openspec status` calls `specs` done as soon as the outline exists, because a
   file is there. **`pnpm check:manual` is the gate that means anything** - it
   fails a capability whose suite sits beside a `spec.md` that carries no
   requirements section, which is the only machine evidence that pass two
   happened at all. It is never downgraded to a warning. (`pnpm plan:preflight`
   is unrelated: it guards `tasks.md` against being overwritten while
   engineering is implementing.)

6. **Write the proposal, the outline and the journeys**, in that order.
   Under the proposal's `## References`, link every section you marked, so the
   manual shows the change under that heading.

7. **Run the two readings.** Dispatch both sub-agents. They get identical
   inputs and never see each other's output. `spec-to-tcs` builds the isolated
   input for the suite pass; the scenario pass does not read `feature-tcs.md`.

8. **Reconcile, then write the second pass.** Join on anchors, take the
   dispositions below, and write the scenarios that survive together with the
   `## Reconciliation` block.

9. **Validate.**

   ```bash
   openspec validate <change-name> --strict
   pnpm check:manual
   pnpm run tcs:validate
   ```

## Anchors

Neither file points at the other. Both point up.

> **Anchor set** = the capability's full story set once this change folds,
> **union** the root groups of its `## Feature set`.

- A scenario carries `**Serves:** <anchor> - <prose>`, under its heading and
  above `**GIVEN**` / `**WHEN**`.
- A case carries `**Trace:** <anchor>`, as it always has - a story id, or a
  feature set root group for a capability nobody walks.
- **There is no `**Accepted by:**`.** It was the hand-maintained link through
  which the two files inherited each other's blind spots. Where a story-to-
  scenario listing is wanted, tooling joins on `**Serves:**`.

Before the dash is machine-read and must resolve; after it is prose for a human.
An anchor that resolves to nothing fails loudly rather than dangling.

Coverage is checked at group level: every anchor served by at least one scenario
and walked by at least one case. That is coarse on purpose - the real coverage
mechanism is the blind pass, and the rule only catches a whole group being
forgotten.

## The blind pass

Independence that relies on an agent's restraint is not independence. The
orchestrator builds an isolated input in scratch space, and the suite sub-agent
sees nothing else.

**Included:** `## Purpose`, `## Feature set`, this capability's
`user-journeys.md`, the linked PRD sections, and the existing `feature-tcs.md`
for id continuity, with `## Reconciliation` stripped.

**Excluded:** `openspec/specs/` entirely, `openspec/changes/archive/` entirely,
and any `## Requirements` section anywhere.

The archive exclusion is not housekeeping. An archived change keeps an
un-stripped `## Reconciliation` naming scenario ids, so missing that path
reopens the leak on the next change to the same capability, invisibly.

The suite pass works a test-design checklist - boundary values, equivalence
partitions, state transitions, CRUD completeness, empty / one / many, null and
missing, permission matrix, error taxonomy, SEO and indexability - rather than
paraphrasing the stories. Two readings using the same method produce synonyms,
and the reconciliation then finds nothing.

## Reconciliation

| Diff | Disposition |
| --- | --- |
| Case has it, no scenario does, and it is real behaviour | Fold it in as a scenario |
| Case has it, no scenario does, and it is a misreading | Drop the case, record the reason |
| Case has it, and **nobody ever decided it** | **Pause. Open a grilling round.** |
| Case has it, and **nobody present can settle it** | Keep the case `draft` + `**Blocked:**`. See below. |
| A scenario no case reaches | Add a case, or `**Out of suite:**` naming where it is verified instead |

**The run stops for the third row.** A workflow that cannot pause there is worse
than the one it replaces, because the agent would be deciding the product.
Automation removes the typing, not the judgement.

**On resume, patch - never re-run a pass.** The answer becomes a scenario, and a
case where one is warranted. Re-running the blind pass once the answer is known
produces a fake independent reading and erases the record of the real one.

**When nobody can settle it**, the case stays in the suite as `draft` carrying
`**Blocked:** <who should settle this>`, a ❓ goes on the PRD, an open question
goes on the proposal, and no scenario is written. The run continues, consistent
with a deferral not holding the draft. This row exists because without it the
case gets filed as *rejected* - the nearest disposition that lets the run finish
- and the most valuable thing the mechanism produces would be deleted because
nobody was free that afternoon, with everything looking normal afterwards.

After reconciliation the ordinary adjudication resumes: **the spec is correct**,
and a suite that disagrees with it is regenerated.

`## Reconciliation` is the evidence the pass happened and what it bought.
Without it, a pass that found nothing and a pass that never ran look identical
in git. Scenario ids belong there only while the change is open.

## Escape hatches

| Hatch | Who decides | Test |
| --- | --- | --- |
| `skip_specs: <why>` | Author | No spec delta exists at all |
| `blind_pass_skipped` | **The checker** | A delta exists but carries no new behaviour |
| `**Walked by:** nobody` | Author | Not a hatch - anchors route to the feature set |

`skip_specs` is the one switch that disables the whole cross-check, and the
cheapest line in the file to write. It takes a **reason, never `true`**, and a
change that lays down a 🚧 mark cannot claim it: 🚧 means an outcome a reader can
see, so claiming both is the author contradicting themselves. The realistic
failure is not dishonesty - it is an author who sincerely believes a refactor
changes no behaviour and is wrong.

`blind_pass_skipped` is granted by the checker when the spec diff **adds no
scenario id** and **modifies no `**GIVEN**` / `**WHEN**` / `**THEN**` line** -
splitting a requirement for readability, a typo in a table's prose, a rename, a
scenario moved under the requirement it always belonged to. The author cannot
declare it. Where the checker refuses and the author disagrees, that is a
grilling round, not a self-service waiver.

## Commits

| # | Commit | Proves |
| --- | --- | --- |
| 1 | `docs(prd): …` | The product judgement is in the reader's words |
| 2 | `spec(<domain>): outline and journeys` | The anchor set is fixed |
| 3 | `test(<domain>): blind pass suites` | The blind reading, uncontaminated |
| 4 | `spec(<domain>): scenarios and reconciliation` | What the second reading caught |

Commit 3 precedes commit 4 not because the suite produced the scenarios, but
because the committed scenarios are the reconciled ones. **The scenario draft is
never committed** - its only trace is the `## Reconciliation` block, which is
why that block is not optional.

## Where a statement belongs

| Statement | Home |
| --- | --- |
| What the product should be, in the reader's words | The PRD, marked 🚧 or ❓ |
| Anything testable | The delta spec, and nowhere else |
| Who walks it | `user-journeys.md` beside that spec |
| Why this problem, for whom, what was ruled out, what will be measured | The PRD's `Product decisions` block |
| How it will be built | `tech-design.md` - not yours |

## Related

- `grilling` - the interview that precedes the proposal, and the escalation.
- `spec-to-tcs` - the blind pass and the isolated input it builds.
- `planning-qa` - the review that comes after, and the wider suites.
- `openspec-propose` - who writes what across the whole change.
- `prd-authoring` - for the product judgment a requirement will not preserve.
- `planning-design`, `planning-dev` - the artifacts that come after yours.
