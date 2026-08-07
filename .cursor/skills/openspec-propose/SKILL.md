---
name: openspec-propose
description: Create an implementation-ready OpenSpec change carrying requirement deltas against the durable capability specs.
---

# Propose an OpenSpec change

Use this skill when implementation planning is requested. `openspec/specs/` is the single source of truth for requirements; this change is the delta against it.

1. Read the relevant capability in `openspec/specs/` and any active change for overlap. Read the PRD, when one exists, for the decision behind the current requirements.
2. Name the change in kebab-case under `openspec/changes/<change-name>/`.
3. Add `proposal.md`, `design.md`, `tasks.md`, and delta specs under `specs/`. Link the PRD near the top of the proposal when one exists.
4. Put every new or changed requirement in the delta specs, written so an engineer in the consuming repository can implement it without a follow-up question, with scenarios a test or manual pass can check. Nothing testable belongs in the proposal or the PRD.
5. Name a new capability in `openspec/specs/` when the work does not fit an existing one, and give it a `## Purpose`.
6. Describe affected consumer apps, public component exports, compatibility and migration concerns, and validation in the proposal.
7. Break tasks into small, verifiable steps and include design-system checks and consumer validation where relevant.
8. Run `openspec validate --specs` and `openspec validate <change-name>` before handoff.

Do not start implementation until the proposal makes scope, requirement deltas, and open decisions clear.
