---
name: accept-batch
description: Take several active OpenSpec changes to Ready to accept together - run every gate once, order the changes that share a capability or a page section into stacks, settle the open items once from one decision rule, then apply, review and land each stack. Use when more than two changes wait on acceptance at once, or when asked to clear the acceptance queue.
---

# Accept a Batch of Changes

- **Scope** - Several active changes, each taken to an `accept-review` verdict of `Ready to accept`. The human still accepts each one with `pnpm spec:accept`, as [planning-dev](../planning-dev/SKILL.md) says; this skill never runs it.
- **Roles** - The orchestrator runs the gates, orders the stacks, asks the decision rule and makes the central decisions. Readers and apply agents each hold one change; a review holds one stack.
- **Runner** - On Claude Code, run [`workflow.js`](workflow.js) with the Workflow tool for step 5 and steps 7 to 10; `args.step` picks `stocktake` or `apply`, and a missing argument stops the run. Elsewhere, run the same steps with one subagent per change, or by hand, in the order below.

## Flow

1. **Scout** - In a clean checkout of `origin/main`, run every gate once. Record; judge nothing.

   ```bash
   pnpm accept:preflight --stacks --clusters --changes <a>,<b>,<c>
   pnpm check:manual
   pnpm run tcs:validate
   pnpm run trace -- validate
   pnpm run validate:changes <change>   # once per change
   ```

   `--stacks` joins the listed changes on a shared requirement, capability or page section, or on `depends_on`, and names the highest id each capability has issued. `--clusters` lists the requirements two changes share.
2. **Order** - Take the stacks `--stacks` prints, in its order; within a stack, put the change that owns each shared requirement first. A change that shares nothing is a stack of one. For each stack of two or more, draft the [planning-dev](../planning-dev/SKILL.md) step 5 sheet for its first change's `reconciliation.md`: **Ownership** from `--clusters`, **Order** from the stack, and **Decisions** after step 6.
3. **Tooling First** - A gate that refuses a form the governance defines is a tool bug, not a change's problem. Fix every such bug on one branch with an audit of the category, land it through its pull request, and start step 7 only once it is on `main`. A change branch never edits `scripts/`, `tools/`, `packages/` or `apps/`.
4. **Decision Rule** - Ask the human one rule, once, as a [Clarification Request](../../../AGENTS.md#questions-and-blockers). For example: take the recommendation unless it is an important business decision; designer asks go to design-phase changes.
5. **Stock-Take** - One cheap read-only reader per change lists every open item: the scout's refusals that name its paths, open `## Raised` rows, ❓ and `TBC` lines on linked pages, `awaiting:` entries and open `accept-review.md` findings. Each item is `ours`, `human` or `designer`, with options, a recommendation and a business flag. Workflow args: `{ step: "stocktake", repo, changes, gates }`, where `gates` is the scout's output.
6. **Central Decisions** - The orchestrator applies the rule to the stock-take and gives each item one directive:

   | Directive | When | The apply agent |
   | --- | --- | --- |
   | `OURS` | The page, the build or the governance settles it | Fixes it source first and hunts its siblings |
   | `DECIDED` | The rule takes the recommendation | Lands the Raised row on a new `Q<n>` Decisions row, `<option> - decided by the round`, takes the ❓ off the page line, and carries the answer through the delta, cases and tasks |
   | `DESIGNER` | The designer owns the look | Ships the recommendation as the interim, or takes the item out of scope where the recommendation puts it elsewhere; lands the Raised row on a new `Q<n>` row, `<option> - decided by the round`, naming the design-phase change that confirms or redraws it |
   | `HOLD` | The rule leaves it to the human, such as an important business decision | Leaves it open; its refusals stay |
   | `STALE` | Answered elsewhere, or its premise is gone | Lands a Raised row on the `Q<n>` that answers it; removes any other item, citing the answer |

   - **Written twice** - For a Raised row, `DECIDED`, `DESIGNER` and `STALE` also write the disposition to the capability's `feature-tcs.md` `## Reconciliation` and the answer to its `## Settled`, as [specs-to-test-cases](../../../docs/governance/specs-to-test-cases.md#raised) requires
   - **One request** - Put every `HOLD` to the human in one Clarification Request
   - **The sheet** - Add each stack's shared decisions to its `reconciliation.md` draft
7. **Apply** - One agent per change, in stack order: restack onto its parent, write the stack's sheet on its first change, apply its plan, run the gates until green, commit. The run fetches once before any agent starts. The commits' own `git diff` decides the readings: a changed journey or `## Feature set` reruns QA1, Dev and QA2 of planning-dev; a changed case or scenario reruns QA2 alone. A reading that returns nothing stops the stack.
8. **Review** - One fresh Cluster Mode `accept-review` per stack, counting blockers only, with each change's ledger and verdict. After a fix, one more fresh review, as accept-review's Reruns rule says. A stack is ready when every change's last verdict is `Ready to accept`, or its only blockers are the plan's `HOLD` items.
9. **Land** - Only a ready stack lands, its tip in one `pnpm push:main`, one stack at a time.
10. **Design and Overlap** - Write one design-phase change per group of designer asks, each awaiting `ui-design` from the designer. A group of looks only skips specs; a group whose ask changes what a reader can do awaits `specs` and carries journeys. Then one read across the stacks for one fact stated two ways, or a change branch touching tooling. `pnpm check:manual` refuses an id two active changes issue.

Workflow args for steps 7 to 10: `{ step: "apply", repo, root, stacks, plans, sheets, design, hands, date, land, base?, app?, session? }`.

| Arg | Holds |
| --- | --- |
| `stacks` | Each stack's change ids, in acceptance order |
| `plans` | Each change's items, each with its `id` and `directive` |
| `sheets` | Each multi-change stack's `reconciliation.md`, keyed by its first change |
| `design` | Each new design-phase change id against `{ looks, asks }` |
| `hands` | The `design` and `pm` handles, when `design` holds a group |
| `root` | The directory holding one worktree per change |

## Landing

- **Stack tip** - Land planning text with `pnpm push:main`. A stack's tip holds every change of it in order, so one push lands the stack; landings run one at a time. With `land: false` the stacks stay on their branches and the tips land later.
- **Scripts commit and push** - Every commit goes through `/commit` and every push through `pnpm push:main`, inside the step that made the change. The orchestrator commits nothing between runs.
- **Authority** - Landing needs the human's yes. Without it, run with `land: false`.

## Resume

- **Journal first** - Before resuming a run in which an agent failed, or one that ran beside other agents on the same worktrees, read its `journal.jsonl` and each worktree's `git log`. Resume only from a step whose recorded result matches the tree; otherwise start a fresh run from that change.

## Completion

- **Report** - Per stack: its changes and their parents, items applied, rejected and dropped, the QA readings that ran, each verdict, the open `HOLD` items and the landed revision. Then the design-phase changes with their asks, the overlap findings, and every `TOOL:` bug met.
- **Not done** - A change without `Ready to accept` is named with its blockers; a stopped stack names the changes it did not run.
