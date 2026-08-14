---
name: prd-authoring
description: Create or revise a versioned product requirement document recording the decision behind a feature, flow, or user-facing choice.
---

# PRD authoring

Use this skill when the request is to create, revise, review, or turn an idea into a PRD.

A PRD is not where requirements live. `openspec/specs/<product>/<capability>/spec.md` is the single source of truth for every checkable requirement and component export contract; a PRD records only the product decision behind them.

1. Read `AGENTS.md`, `docs/governance/prd-and-openspec.md`, `docs/prds/README.md`, the relevant capability in `openspec/specs/`, and active `openspec/changes/` records.
2. Decide whether a PRD is warranted. If stripping every testable statement from the intended document leaves nothing behind, write the capability spec instead and skip the PRD.
3. Create `docs/prds/<product-area>/<feature>.md` from `docs/prds/_template.md`, or update the existing stable document.
4. Lead with the user problem, the evidence for it, and the intended outcome. Name the non-goals so engineering knows the edges.
5. In the Requirements section, link the capability spec. Do not restate a requirement, a state behavior, an accessibility obligation, or an export contract — those belong in the spec.
6. Name every application expected to consume the work, and what it must own.
7. Record explicit decisions, assumptions, source links, and unresolved questions. Do not bury uncertainty in prose.
8. Write the requirements themselves as an OpenSpec change carrying deltas against the capability spec.

Before handoff, check that the PRD has a stated problem with evidence, non-goals, measurement, a rollout and risk statement, a decisions table, and a working link to its capability spec — and that it contains nothing a test could decide.
