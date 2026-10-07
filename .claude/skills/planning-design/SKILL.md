---
name: planning-design
description: Specify the user-facing design for an OpenSpec change, including its screens, composed exports, states and design references. Use when a change alters something a user sees.
---

# Designer's Artifact

- **Scope** - Own `ui-design.md` when a change has a user-facing surface. Follow the `grade10-planning` schema instructions for its sections and format.
- **New change** - Start with `/workflow-plan`, which owns the proposal, decisions and journeys. Write `ui-design.md` on the same change and supply the design reference; do not write the spec outline, cases, scenarios or tasks.
- **Existing change** - Add `ui-design.md` to the existing change. Read its proposal, decisions and journeys, plus the durable capability spec and PRD where present. Do not wait for the change's own `spec.md`; it is written after this file.
- **No user-facing surface** - Omit `ui-design.md`; do not create an empty file. Record `ui_waived: <why>` in the change record.

## Design Reference

- **Inventory** - Check Storybook, `packages/design-system`, `packages/ui` and `packages/i18n` before naming components, tokens or copy. The design reference grounds the outline and requirements in what exists.
- **Citations** - Cite the relevant inventory in `ui-design.md` wherever a reader would otherwise have to guess. Use exact component export names from the capability contract.
- **Missing work** - Flag each missing primitive variant, token, compound component or message key so the task plan can carry it. Primitive work belongs in `packages/design-system/src/components/`, tokens in `packages/design-system/tokens.json`, compound components in `packages/ui/src/blocks/`, and copy in `packages/i18n/messages/`; follow `design-system-primitives`, `design-tokens` and the layer rules.
- **Design parity** - A primitive may not add a variant or size the Figma component set lacks. Record a real code/design disagreement as an OpenSpec change; follow [Design Code Sync](../../../docs/governance/design-code-sync.md).

## Screens and States

- **Frames** - Use one subsection per user-facing surface and link its Figma frame. If the ask lacks a frame for a screen, record the missing frame with `awaiting:` in the change record and describe no replacement screen.
- **States** - Use a markdown table under one `###` per screen, with columns `State`, `Shows` and `Anchor`; give each state one row. Anchor each row to a journey id or a root group already issued by the durable capability's `## Feature set`. Copy the full id in backticks from its heading; do not infer its prefix. If no journey or root group fits, tell the journey owner to add one; do not invent it.
- **Scenarios** - Do not cite scenario ids or fill in requirement dispositions. `/planning-dev` writes the requirements and closes every row with its scenario or `**Out of suite:**` naming where the state is stated instead.
- **Product detail** - Put a state or variant on the PRD first only when it changes what the reader can do, see counted or is refused; replace the superseded outcome line with one `🚧` line. Breakpoints, tokens, labels and loading, empty, error or edge treatments stay in the States table and have a `::story` card on the PRD. Record a scope change in `decisions.md` before changing this file.
- **Layout and behavior** - Figma owns layout, the capability spec owns behavior, and `tech-design.md` owns technical decisions. Link to those sources instead of restating them.

- **Questions** - Use the [Clarification Request](../../../AGENTS.md#questions-and-blockers) for unresolved design choices.

## Related

- **Planning** - `planning-pm` owns the proposal, decisions and journeys; `/workflow-plan` opens and runs that round. `workflow-round` owns waits for missing frames and the landing sequence.
- **Implementation planning** - `planning-dev` writes the technical design, requirements, cases and tasks.
- **Design work** - `page-from-figma` converts a drafted screen; `design-system-primitives`, `design-tokens` and `design-sync-check` own the related design-system workflows.
