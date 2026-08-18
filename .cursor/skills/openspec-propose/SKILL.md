---
name: openspec-propose
description: Create an implementation-ready OpenSpec change carrying requirement deltas against the durable capability specs.
---

# Propose an OpenSpec change

Use this skill when implementation planning is requested. `openspec/specs/` is the single source of truth for requirements; this change is the delta against it.

1. Read the relevant capability in `openspec/specs/` and any active change for overlap. Read the PRD, when one exists, for the decision behind the current requirements.
2. Choose the workflow schema before creating anything, by who is authoring and whether delivery is being planned now. Writing requirements — a PM or designer, or anyone whose work ends when the specs are right — takes `pm-planning`. Planning delivery you will implement here, which in practice means a delta needing a component, variant, or token under `packages/`, takes `full-planning`. The choice is not final: a `pm-planning` change is promoted to `full-planning` by the engineer who picks it up, so prefer it whenever the implementation plan would otherwise be invented ahead of that.
3. Create the change with `openspec new change <change-name> --schema <schema>`, named in kebab-case. This records the schema in the change's `.openspec.yaml`; a directory created by hand records nothing and silently takes the default in `openspec/config.yaml`.
4. Add `proposal.md` and the delta specs under `specs/`. Under `full-planning`, add `design.md`, `tasks.md`, and `ui.md` when the change alters something a user sees. Link the PRD near the top of the proposal when one exists.
5. Put every new or changed requirement in the delta specs, written so an engineer in the consuming repository can implement it without a follow-up question, with scenarios a test or manual pass can check. Nothing testable belongs in the proposal or the PRD.
6. Name a new capability in `openspec/specs/` when the work does not fit an existing one, and give it a `## Purpose`.
7. Describe affected consumer apps, public component exports, compatibility and migration concerns, and validation in the proposal.
8. Under `full-planning`, break tasks into small, verifiable steps and include design-system checks and consumer validation where relevant. A `pm-planning` change has no tasks: it is finished when its specs are, and gains them at promotion, so leave the breakdown to the engineer who promotes it.
9. Run `openspec validate --specs` and `openspec validate <change-name>` before handoff. `openspec status --change <change-name>` lists the artifacts the chosen schema expects.

Do not start implementation until the proposal makes scope, requirement deltas, and open decisions clear.
