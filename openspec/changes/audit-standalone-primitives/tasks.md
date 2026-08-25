## 1. One definition of omission, two callers (grade10-spec)

- [x] 1.1 Move the fill-and-stroke omission check out of `audit-node.mjs` into `values.mjs` beside `expectations()`, keeping the per-node union of claims, and have `audit-node.mjs` call it from its new home with no change to what it reports.
- [x] 1.2 Call it from the variant-set comparison, reading each variant's own fills and strokes, so a variant fill no class in the configuration names is a finding — making *A variant fills what the code never names* pass.
- [x] 1.3 Confirm `pnpm run figma:audit --all-blocks` reports exactly what it did before the move; the refactor changes where the rule lives, not what it finds.

## 2. A rail that fails (grade10-spec)

- [x] 2.1 Sort findings by what they claim: value disagreements — the set already carried in `report.diffs` — become errors; descriptions, unmapped axis options, and Figma components with no code counterpart stay warnings — making *A variant's fill stops matching* and *A hygiene finding* pass.
- [x] 2.2 Verify against today's corpus: all 27 existing warnings are hygiene, so `pnpm run check:design-system` must still exit 0 after the split, with the same warnings and no errors.
- [x] 2.3 Verify the other direction with a deliberate local edit — change one variant's fill class, confirm the run fails and names both values, then revert.

## 3. Cover the standalone components (grade10-spec)

- [ ] 3.1 Write `packages/design-system/src/components/display/audit.json` for `Breadcrumbs`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`, `List`, `List Item`, `Pagination`, and `PaginationEllipsis`, each entry written from its Figma node rather than from the code.
- [ ] 3.2 Write `packages/design-system/src/components/forms/audit.json` for `Checkbox List` and `Radio List`.
- [ ] 3.3 Write `packages/design-system/src/components/overlays/audit.json` for `Dialog`, `Dialog Header`, and `Dropdown Menu`.
- [ ] 3.4 Write `navigation-list` into the existing `layout/audit.json` beside the chrome, completing all 13 — making *A standalone component drifts* pass.
- [ ] 3.5 Triage every finding the three new tables produce: correct the code where it drifted, and where the design is the stale side, record it rather than editing the table to agree with the code. Report the triage before moving on — a finding resolved by loosening its own table is the one failure this change cannot detect.

## 4. Report coverage by component (grade10-spec)

- [x] 4.1 Resolve each `.figma.ts` in a swept directory to its node kind, and report as uncovered the standalone components no audit table names, rather than the directory — making *Coverage is reported by component* pass.
- [x] 4.2 Confirm a component whose Figma counterpart defines variant axes is neither audited by a table nor listed as uncovered — making *A component with variant axes* pass.

## 5. Verify (grade10-spec)

- [ ] 5.1 Run `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run test:stories`, `pnpm run check:design-system`, and `pnpm run figma:audit --all-blocks`; then `openspec validate audit-standalone-primitives --strict`.
- [ ] 5.2 Confirm the metric: all 40 design-system components with a Figma counterpart are compared by a rail that can fail — 25 by the variant-set comparison, 15 by audit tables — and the run reports no component as uncovered.
