---
name: openspec-apply-change
description: Implement the tasks in an approved OpenSpec change while preserving PRD and component contracts.
---

# Apply an OpenSpec change

1. Read the change proposal, design, tasks, linked PRD, and affected durable specs before editing.
2. Implement the smallest pending task and mark its checkbox complete only after validation succeeds.
3. If an implementation choice changes product behavior, update the PRD or delta spec before continuing.
4. For shared components, use `stateless-ui-components`; run `pnpm run check:components` and `pnpm run build:components`.
5. Validate consuming-app compatibility when a public component export changes.
6. Stop for a material unresolved product decision; do not invent a product policy during implementation.

When all tasks pass, summarize validation and offer to sync durable specs and archive the change.
