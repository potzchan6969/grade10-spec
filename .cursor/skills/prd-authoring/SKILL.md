---
name: prd-authoring
description: Create or revise a versioned product requirement document for a feature, flow, or user-facing decision.
---

# PRD authoring

Use this skill whenever the request is to create, revise, review, or turn an idea into a PRD.

1. Read `AGENTS.md`, `docs/prds/README.md`, adjacent PRDs, and active `openspec/changes/` records.
2. Create `docs/prds/<product-area>/<feature>.md` from `docs/prds/_template.md`, or update the existing stable document.
3. Lead with the user problem and intended outcome. Keep product behavior separate from application implementation choices.
4. Make the primary flow and loading, empty, error, permission, and narrow-screen states testable.
5. List reusable component contracts as prop-driven interfaces and name every app expected to consume the work.
6. Record explicit decisions, assumptions, source links, and unresolved questions. Do not bury uncertainty in prose.
7. When implementation is approved, create an OpenSpec change that links this PRD and contains only implementation deltas.

Before handoff, check that the PRD has measurable acceptance criteria, non-goals, accessibility considerations, and a rollout/risk statement.
