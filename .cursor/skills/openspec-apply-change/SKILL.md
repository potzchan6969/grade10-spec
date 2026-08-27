---
name: openspec-apply-change
description: Implement the tasks in an approved OpenSpec change while preserving the durable specs and component contracts.
---

# Apply an OpenSpec change

1. Read the change proposal, design, tasks, the affected capability in `openspec/specs/`, and the linked PRD before editing.
2. Implement the smallest pending task and mark its checkbox complete only after validation succeeds.
3. If an implementation choice changes required behavior, update the delta spec before continuing. Update the PRD only when the product decision behind it changed.
4. For design-system primitives, use `design-system-components`; run `pnpm run design-system:check` and `pnpm run test:stories:design-system`.
5. A shared product component's implementation lives in `packages/ui` here, with the capability spec as its export contract; validate with `pnpm run test:stories:ui`. Application-owned state, adapters, and wiring remain work in each consuming application, which picks the change up through a submodule bump.
6. Stop for a material unresolved product decision; do not invent a product policy during implementation.

When all tasks pass, summarize validation and offer to fold the deltas into `openspec/specs/` and archive the change.
