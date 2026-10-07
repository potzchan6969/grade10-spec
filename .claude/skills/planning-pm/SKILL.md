---
name: planning-pm
description: Write the proposal, decisions and journeys for an OpenSpec change, then hand the settled scope to planning-dev. Use when a product manager or designer is specifying a change.
---

# Product Manager's Artifacts

- **Scope** - Own `proposal.md`, `decisions.md` and each capability's `user-journeys.md`, in that order. A PM who already has the design also writes `ui-design.md` in the same change.

- **Designer entry** - When a designer is specifying a new change, they use `/workflow-plan` for these same artifacts and provide the design reference described in `planning-design`.

- **Artifact rules** - Follow the `grade10-planning` schema instructions for each file's content, order and marks. The proposal, decisions and journeys are drafts; the plan is not complete until `/planning-dev` has written and accepted the remaining artifacts.

- **Interview** - Use [`grilling`](../grilling/SKILL.md), the [Round Summary and Landing interview](../../../docs/governance/round-summary.md#interview) and `workflow-round`'s question rules. Format unresolved choices using [Questions and Blockers](../../../AGENTS.md#questions-and-blockers). Research facts; do not ask the author to size work or name exports or code touched. Challenge silent assumptions about clocks, starting states and existing defaults; separate outcomes from proposed mechanisms; ask about edge cases, failures, affected parties and non-goals. State your alternative and reason when you disagree. Put deferred questions in the proposal with their owner and on the PRD as `❓`; do not record them as decisions.

- **Product details** - Update the capability PRD before the artifact that depends on a product detail learned during planning. Use `🚧` for a confirmed outcome this change delivers and `❓` for an unresolved detail. Update `decisions.md` first when a later scope decision changes a goal, non-goal or rejected option.

- **Legacy decision waiver** - For a change opened before `decisions.md` existed, use `decisions_waived` only when its scope is already in the proposal; otherwise write the interview record. See [The change's record](../../../docs/governance/prd-and-openspec.md#the-changes-record).

- **Handoff** - When the three artifacts are settled, and `ui-design.md` is ready where needed, invoke `/planning-dev <change>`. That run owns technical design, requirements, cases, tasks, clarification and acceptance.

- **Related** - `workflow-plan` runs the PM round; `planning-design` owns the design file and inventory; `planning-dev` completes the plan; `prd-authoring` helps when the change turns on a product judgment the requirements will not preserve.
