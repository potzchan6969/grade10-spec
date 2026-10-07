---
name: planning-pm
description: Write the proposal, decisions and journeys for an OpenSpec change, then hand the settled scope to planning-dev. Use when a product manager or designer is specifying a change.
---

# Product Manager's Artifacts

- **Scope** - Own `proposal.md`, `decisions.md` and each capability's `user-journeys.md`, in that order. A PM who already has the design also writes `ui-design.md` in the same change.

- **Designer entry** - When a designer is specifying a new change, they use this skill for these same artifacts and provide the design reference described in `planning-design`.

- **Interview** - Use [`grilling`](../grilling/SKILL.md) to resolve choices that materially affect scope or product behavior. Honor existing answers and authorization; apply routine choices without introducing an approval step. Format unresolved choices using [Questions and Blockers](../../../AGENTS.md#questions-and-blockers). Research facts; do not ask the author to size work or name exports or code touched. Follow the loaded decisions instructions for the interview checklist and for recording settled or deferred answers.

- **Product details** - Update the capability PRD before the artifact that depends on a product detail learned during planning. Use `🚧` for a confirmed outcome this change delivers and `❓` for an unresolved detail. Update `decisions.md` first when a later scope decision changes a goal, non-goal or rejected option.

- **Waivers** - Use `decisions_waived` and `page_waived` only under [The change's record](../../../docs/governance/prd-and-openspec.md#the-changes-record). A decision waiver covers genuinely nothing to settle or a legacy change whose proposal already records its scope.

- **Product judgment** - Use `prd-authoring` when the change turns on a product judgment the requirements will not preserve.

## Prepare and Draft

1. **Read the scope** - Read the capability PRD, overlapping active changes,
   durable spec and linked capabilities. Extend or supersede overlapping work
   instead of opening a competing delta. Follow
   [PRD maintenance](../../../docs/governance/prd-and-openspec.md#maintenance-workflow-for-future-agents).
2. **Open the change** - For a new change, create its record with the schema.
   Reuse an existing change when one was supplied.

   ```bash
   pnpm openspec new change <change> --schema grade10-planning
   ```

3. **Load artifact rules** - Read each artifact's enriched instructions before
   writing it, in this order:

   ```bash
   pnpm openspec instructions proposal --change <change>
   ```

   ```bash
   pnpm openspec instructions decisions --change <change>
   ```

   ```bash
   pnpm openspec instructions user-journeys --change <change>
   ```

4. **Draft and hand off** - Write the PRD details first, then the three
   artifacts under the rules above. Preserve unresolved inputs in the change
   record using [Waiting for an input](../../../docs/governance/prd-and-openspec.md#waiting-for-an-input).
   Use `planning-design` for any required UI design. Once the three artifacts
   and required design are settled, invoke `/planning-dev <change>` for the
   remaining artifacts and acceptance; PM drafts alone do not complete the plan.
