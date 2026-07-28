---
name: openspec-propose
description: Create an implementation-ready OpenSpec change linked to a canonical PRD.
---

# Propose an OpenSpec change

Use this skill after the product decision is captured in a PRD and implementation planning is requested.

1. Inspect `openspec/specs/` and active changes for overlap.
2. Name the change in kebab-case under `openspec/changes/<change-name>/`.
3. Add `proposal.md`, `design.md`, `tasks.md`, and focused delta specs as needed. Link the canonical PRD near the top of the proposal.
4. Describe affected consumer apps, public component exports, compatibility/migration concerns, and validation.
5. Keep durable requirements in `openspec/specs/`; add only changed requirements to the change's delta specs.
6. Break tasks into small, verifiable steps and include component-package build/check and consumer validation where relevant.

Do not start implementation until the proposal makes scope, acceptance criteria, and open decisions clear.
