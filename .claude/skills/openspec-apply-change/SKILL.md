---
name: openspec-apply-change
description: Implement the tasks in an approved OpenSpec change while preserving the durable specs and component contracts.
---

# Apply an OpenSpec change

1. Read the change proposal, design, tasks, the affected capability in `openspec/specs/`, and the capability's PRD in `docs/prds/` before editing.
2. Implement the smallest pending task. Once it is validated and pushed, check it off with `pnpm plan done <change> <task-id>` from `grade10`: that records the checkmark on this store's `main`, claims the group if nobody holds it, and refuses a group someone else holds. Never tick `tasks.md` by hand.
3. If an implementation choice changes required behavior, write it on the PRD first — a 🚧 line for the new outcome, ❓ for what nobody has confirmed — then update the delta spec before continuing. A choice that changes no outcome — a mechanism, a key, a metric — stays in `tech-design.md` and the architecture doc; the PRD's engineer block is a code map of names and links. Update the PRD's `Product decisions` block only when the product decision behind it changed.
4. For design-system primitives, use `design-system-primitives`; run `pnpm run design-sync:check` and `pnpm run test:stories:design-system`.
5. A shared product component's implementation lives in `packages/ui` here, with the capability spec as its export contract; validate with `pnpm run test:stories:ui`. Application-owned state, adapters, and wiring remain work in each consuming application, which picks the change up through a submodule bump.
6. Stop for a material unresolved product decision; do not invent a product policy during implementation.

When all tasks pass, summarize validation and offer to fold the deltas into `openspec/specs/` and archive the change.
