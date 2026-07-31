---
name: openspec-apply-change
description: Implement the tasks in an approved OpenSpec change while preserving PRD and component contracts.
---

# Apply an OpenSpec change

1. Read the change proposal, design, tasks, linked PRD, and affected durable specs before editing.
2. Implement the smallest pending task and mark its checkbox complete only after validation succeeds.
3. If an implementation choice changes product behavior, update the PRD or delta spec before continuing.
4. For design-system primitives, use `design-system-components`; run `pnpm run check:design-system` and `pnpm run test:stories:design-system`.
5. A product component's implementation lives in the consuming application: record the contract here and validate the change there.
6. Stop for a material unresolved product decision; do not invent a product policy during implementation.

When all tasks pass, summarize validation and offer to sync durable specs and archive the change.
