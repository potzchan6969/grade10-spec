# Tasks

## 1. The panel drops an empty choice (grade10)

- [ ] 1.1 Filter a facet group's own choices to those counted above zero while the query is unnarrowed, so *A choice with nothing counted behind it* (`SC-42`) passes without disturbing an all-zero group's existing drop or a narrowed group's full list
- [ ] 1.2 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 2. The manual (grade10-spec)

- [ ] 2.1 Mark the PRD's `Filter` line with the zero-count choice rule this change delivers
- [ ] 2.2 Verify: `pnpm check:manual`
