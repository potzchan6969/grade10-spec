---
name: openspec-propose
description: Start a new OpenSpec change - what to read first, and which role skill writes each artifact. Use when implementation planning is requested and the artifact's owner is not already obvious.
disable-model-invocation: true
---

# Propose an OpenSpec Change

- **Scope** - Route a new planning request or named change to the skill that owns its next artifact. [AGENTS.md](../../../AGENTS.md#product-specification-workflow) owns the artifact map.
- **New Change** - Pass the requested outcome to `/workflow-plan` ([workflow-plan](../workflow-plan/SKILL.md)). It checks overlap, opens or extends the change, and runs the proposal, decisions and journeys through [planning-pm](../planning-pm/SKILL.md).
- **UI Design** - For an existing change needing a user-facing design, pass the change and available frames to [workflow-design](../workflow-design/SKILL.md).
- **Delivery Plan** - Once proposal, decisions, journeys and required UI design are settled, pass the change to [planning-dev](../planning-dev/SKILL.md) for the accepted and published contract and delivery plan.
- **Capability Scope** - Every capability named in the proposal gets a delta, and no other capability does. Place a capability under `shared/` only when at least two applications are held to it.
- **No Behavior Change** - Use planning-pm's `skip_specs` rules for pure refactoring, tooling or documentation work.
- **Completion** - Follow the selected owner's procedure and completion boundary. Report the resulting change, artifacts and unresolved questions or blockers; do not begin implementation from a pending delta.
