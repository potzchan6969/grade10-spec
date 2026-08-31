Implementation starts only after
`repair-figma-annotation-observation` task 2.6 is complete and its verified
schema-version-2 observer and store contract are available in both repositories.

## 1. Add repository-scoped store interfaces (grade10-spec) (owner: @kinisworking)

- [x] 1.1 Create `scripts/design-sync/annotation-scope.mjs` with the fixed
  `spec | product` vocabulary, same-node scope agreement, entry-to-root scope
  resolution, and scoped baseline projection; drive it test-first from
  `scripts/design-sync/annotation-reconciliation.test.mjs`, then add explicit
  `scope` values to every root in
  `scripts/design-sync/annotation-baseline.json` without changing any root ID,
  entry, annotation key, association, or schema version, making `Annotation is
  outside registered surfaces` and `Accepted node no longer resolves` operate
  on one owning repository.
- [x] 1.2 Add `scripts/design-sync/annotation-inventory.mjs` and the
  `figma:annotations:inventory` package script, returning schema-version-1 JSON
  with one requested scope, file metadata, flat registrations, and only the
  tracked node IDs derived from entries in that scope; cover duplicate source
  registrations, missing or conflicting scope, empty scope projections, and
  deterministic ordering in the design-sync suite before implementation.
- [x] 1.3 Require `--scope spec|product` in
  `scripts/design-sync/annotation-cli.mjs`,
  `scripts/design-sync/annotation-diff.mjs`, and
  `scripts/design-sync/annotation-accept.mjs`; project comparison through
  `scripts/design-sync/annotation-reconciliation.mjs`, reject observed or
  skipped roots outside the projection, and reject cross-scope finding IDs
  before any write while preserving the complete baseline digest, making
  `Only selected findings are accepted`, `Observation changed before
  acceptance`, and `Reconciliation verifies cleanly` pass independently for
  both scopes.
- [x] 1.4 Extend the no-write fixtures in
  `scripts/design-sync/annotation-reconciliation.test.mjs` with one baseline
  containing both scopes; prove a spec snapshot cannot remove or orphan product
  entries, a product snapshot cannot remove or orphan spec entries, a mixed
  snapshot exits blocked, and cross-scope acceptance leaves the baseline and
  every related OpenSpec target byte-identical.
- [x] 1.5 Update `docs/governance/design-code-sync.md` with the ownership table,
  required command scope, shared-baseline concurrency behavior, and the rule
  that `packages/ui` belongs to `spec`; verify the group with `pnpm run
  test:design-sync`, `pnpm run lint`, `pnpm run typecheck`, and `git diff
  --check`.

## 2. Move the canonical workflow into the store (grade10-spec) (owner: @kinisworking)

This group depends on group 1. It must preserve the observer behavior verified
by `repair-figma-annotation-observation`; moving code is not permission to
redesign observation or occurrence matching.

- [x] 2.1 Move the portable Plugin API adapter from
  `grade10/scripts/reconcile-figma-annotations.mjs` into
  `scripts/design-sync/annotation-observation.mjs`, adapt it to consume the
  scoped inventory shape, and migrate its duplicate-registration,
  overlapping-root, one-catalog-read, tracked-removal, inconsistent-node,
  unsupported-operation, and blocked-transport cases into
  `scripts/design-sync/annotation-observation.test.mjs`, making `One category
  catalog resolves many annotations`, `Unresolved registered root is skipped`,
  `Every registered root is unresolved`, and `Figma Plugin API access is
  unavailable` retain their verified behavior.
- [x] 2.2 Move the exact-association, ownership, complete-body, skipped-root,
  selection, decision-preview, verification, and commit-plan logic from
  `grade10/scripts/figma-annotation-report.mjs` and the remaining reconciliation
  helper exports into `scripts/design-sync/annotation-report.mjs`; add
  `scripts/design-sync/annotation-report-cli.mjs` plus the
  `figma:annotations:report` package script, accept optional `--mine` evidence,
  and migrate the behavioral tests to
  `scripts/design-sync/annotation-report.test.mjs`, making `Exact active change
  reference is found`, `Human report includes complete annotation bodies`,
  `Human report is structured for reading`, and `Current identity is
  unavailable` pass from the store-owned implementation.
- [x] 2.3 Create
  `.claude/skills/reconcile-figma-annotations/{SKILL.md,agents/openai.yaml}` and
  its focused Plugin API and teammate references for `--scope spec`; keep the
  three confirmation pauses and all existing safety constraints, describe
  design-system primitives and `packages/ui` blocks as the only local surface,
  and add the skill to `.claude/skills/dev-help/SKILL.md`, making `A supported
  harness opens the annotation workflow` expose one spec-owned path in this
  repository.
- [x] 2.4 Verify the relocated modules have no import or behavior dependency on
  the `grade10` checkout, the skill contains no guessed store path or product
  scope fallback, and the product copies are still present until group 3; run
  the skill validator when available, `pnpm run test:design-sync`, `pnpm run
  agent:sync-parity`, `pnpm run agent:check-parity`, `pnpm run lint`, `pnpm run
  typecheck`, and `git diff --check`.

## 3. Replace the mixed workflow with the page adapter (grade10) (owner: @kinisworking)

This group depends on groups 1 and 2 being merged to the registered
`grade10-spec` store's `main`. It resolves that standalone store at runtime and
does not depend on an `external/grade10-spec` submodule bump.

- [x] 3.1 Rewrite
  `.claude/skills/reconcile-figma-annotations/SKILL.md` as a product adapter:
  resolve `grade10-spec` through `openspec list --json`, require the store's
  inventory/report/diff/accept interfaces, pass `--scope product` to every
  command, pass `pnpm plan mine` output to reporting, and stop blocked instead
  of using local logic when the scope-aware store interface is absent, making
  `Annotation is outside registered surfaces`, `Actionable findings are
  reported`, and `A supported harness opens the annotation workflow` apply only
  to page-layout roots.
- [x] 3.2 Update
  `.claude/skills/reconcile-figma-annotations/agents/openai.yaml` and
  `.claude/skills/dev-help/SKILL.md` to describe page-layout reconciliation;
  replace the duplicated Plugin API and teammate references under the product
  skill with links loaded from the resolved store, while retaining the three
  approval pauses, exact-evidence rules, same-snapshot verification, separate
  store-commit confirmation, and prohibition on Figma, product-repo, submodule,
  push, and pull-request writes.
- [x] 3.3 After comparing the migrated store tests with every case in
  `scripts/reconcile-figma-annotations.test.mjs` and
  `scripts/reconcile-figma-annotations.report.test.mjs`, remove those tests,
  `scripts/reconcile-figma-annotations.mjs`,
  `scripts/figma-annotation-report.mjs`, and the now-empty `test:tooling` script
  from `package.json`; do not alter application, frontend, or submodule files.
- [x] 3.4 Verify the product skill has no primitive/shared-block route and no
  fallback implementation, then run the skill validator when available,
  `pnpm run agent:sync-parity`, `pnpm run agent:check-parity`, `pnpm run lint`,
  `pnpm run typecheck`, and `git diff --check`.

## 4. Prove cross-repository isolation (grade10) (owner: @kinisworking)

This group depends on all implementation groups. It is a read-only acceptance
rehearsal; it must not select or accept findings.

- [x] 4.1 From `grade10`, resolve the standalone store and run one mixed fixture
  through `figma:annotations:inventory`, observation, diff, and report once as
  `spec` and once as `product`; assert each run contains only its owning roots,
  tracked nodes, findings, and skipped roots, with zero cross-scope removals or
  orphans and unchanged stable IDs within each projection.
- [x] 4.2 Use the live read-only Figma Plugin API in two independent captures
  sourced from the same current baseline: invoke the `grade10-spec` skill for
  `spec`, then the `grade10` skill for `product`; preserve one category-catalog
  read per file, complete bodies and evidence, no mixed roots, and exit
  `0`/`1` rather than blocked when evidence is complete. Record counts and
  blockers, discard both temporary snapshots, and perform no acceptance or Git
  write.
- [x] 4.3 Re-run `pnpm run test:design-sync`, `pnpm run agent:check-parity`,
  `pnpm run lint`, and `pnpm run typecheck` in `grade10-spec`; re-run `pnpm run
  agent:check-parity`, `pnpm run lint`, and `pnpm run typecheck` in `grade10`;
  inspect both diffs and confirm only the plan's named paths changed before
  handing the groups off for their separate repository commits.
