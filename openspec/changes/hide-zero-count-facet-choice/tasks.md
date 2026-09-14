# Tasks

## 1. The panel drops an empty choice (grade10)

- [ ] 1.1 Fetch each choice's baseline count with a second, unnarrowed `useCatalogFilters` call, and keep a choice or group only where that baseline is above zero or the choice is selected, so *A choice with nothing counted behind it* (`SC-42`) and *A narrowing cannot resurrect a choice the catalogue never carries* (`SC-43`) both pass without disturbing *A narrowing that starves the catalogue* (`SC-17`)
- [ ] 1.2 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 2. The manual (grade10-spec)

- [ ] 2.1 Mark the PRD's `Filter` line with the zero-count choice rule this change delivers
- [ ] 2.2 Verify: `pnpm check:manual`
