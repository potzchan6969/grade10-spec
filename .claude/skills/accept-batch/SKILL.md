---
name: accept-batch
description: Take several active OpenSpec changes to Ready to accept together - scout every gate, order the changes that share a capability into stacks, settle the open items once from one decision rule, then apply, review and land each change in stack order. Use when more than two changes wait on acceptance at once, or when asked to clear the acceptance queue.
---

# Accept a Batch of Changes

- **Scope** - Several active changes, each taken to an `accept-review` verdict of `Ready to accept`. The human still accepts each one with `pnpm spec:accept`, as [planning-dev](../planning-dev/SKILL.md) says; this skill never runs it.
- **Roles** - The orchestrator orders the stacks, asks the decision rule and makes the central decisions. Readers and apply agents each hold one change.
- **Runner** - On Claude Code, run [`workflow.js`](workflow.js) with the Workflow tool for steps 1, 5 and 7 to 9; `args.step` picks `scout`, `stocktake` or `apply`. Elsewhere, run the same steps with one subagent per change, or by hand, in the order below.

## Flow

1. **Scout** - Per change, run every gate and list its capabilities, pages, `depends_on` and highest ids. Record; judge nothing.

   ```bash
   pnpm accept:preflight <change>
   pnpm run validate:changes <change>
   pnpm check:manual
   pnpm run tcs:validate
   pnpm run trace -- validate
   ```

   Workflow args: `{ step: "scout", repo, changes }`, where `repo` is a clean checkout of `origin/main`. It returns each change and the capabilities and pages two or more changes share.
2. **Order** - Put the changes that share a capability into stacks, in acceptance order, by `depends_on` and then by which change owns each shared requirement. A change that shares nothing is a stack of one. `pnpm run accept:preflight --clusters` lists the clusters.
3. **Tooling First** - A gate that refuses a form the governance defines is a tool bug, not a change's problem. Fix every such bug on one branch with an audit of the category, land it through its pull request, and start step 7 only once it is on `main`. A change branch never edits `scripts/`, `tools/`, `packages/` or `apps/`.
4. **Decision Rule** - Ask the human one rule, once, as a [Clarification Request](../../../AGENTS.md#questions-and-blockers). For example: take the recommendation unless it is an important business decision; designer asks go to design-phase changes.
5. **Stock-Take** - One cheap read-only reader per change lists every open item: gate refusals, open `## Raised` rows, ❓ and `TBC` lines on linked pages, `awaiting:` entries and open `accept-review.md` findings. Each item is `ours`, `human` or `designer`, with options, a recommendation and a business flag. Workflow args: `{ step: "stocktake", repo, changes }`.
6. **Central Decisions** - The orchestrator applies the rule to the stock-take and gives each item one directive:

   | Directive | When | The apply agent |
   | --- | --- | --- |
   | `OURS` | The page, the build or the governance settles it | Fixes it source first and hunts its siblings |
   | `DECIDED` | The rule takes the recommendation | Records a settled decision row and carries it through |
   | `DESIGNER` | The designer owns the look | Ships the recommendation as the interim and hands the ask to a design-phase change |
   | `HOLD` | The rule leaves it to the human, such as an important business decision | Leaves it open; the human answers it |
   | `STALE` | Answered elsewhere, or its premise is gone | Removes it, citing the answer |

   Put every `HOLD` to the human in one Clarification Request.
7. **Apply** - One agent per change, in stack order: restack onto its parent, apply its plan, run the gates until green, commit. QA1, Dev and QA2 of planning-dev run only when a frozen anchor moved; QA2 runs alone when only cases or scenarios changed.
8. **Review** - One fresh `accept-review` per change, counting blockers only, then at most one fix.
9. **Design and Overlap** - Write one design-phase change per group of designer asks, each awaiting `ui-design` from the designer. Then one read across the stacks for an id issued twice, one fact stated two ways, or a change branch touching tooling.

Workflow args for steps 7 to 9: `{ step: "apply", repo, root, stacks, plans, design, hands, date, land, base?, app?, session? }`. `plans` maps each change to its items with their directives; `design` maps each new design-phase change id to its asks; `hands` names the `design` and `pm` handles; `root` holds one worktree per change.

## Landing

- **Stack order** - Land planning text with `pnpm push:main`, one change at a time in stack order, so the next change restacks on `main` rather than on a long-lived branch. `land: true` lands each change after its review; with `land: false` the changes stack on branches and the tip of each stack lands later.
- **Scripts commit and push** - Every commit goes through `/commit` and every push through `pnpm push:main`, inside the step that made the change. The orchestrator commits nothing between runs.
- **Authority** - Landing needs the human's yes. Without it, run with `land: false`.

## Resume

- **Journal first** - Before resuming a run in which an agent failed, or one that ran beside other agents on the same worktrees, read its `journal.jsonl` and each worktree's `git log`. Resume only from a step whose recorded result matches the tree; otherwise start a fresh run from that change.

## Completion

- **Report** - Per change: its stack and parent, items applied and rejected, the QA readings that ran, the verdict, the open `HOLD` items and the landed revision. Then the design-phase changes with their asks, the overlap findings, and every `TOOL:` bug met.
- **Not done** - A change without `Ready to accept` is named with its blockers; a stopped stack names the changes it did not run.
