## 1. Add the shared impact-review interface (grade10-spec) (owner: @kinisworking)

- [x] 1.1 Add the schema-version-1 impact document and pure validator beside
  the store-owned report helpers, reusing stable selection and association
  validation to make `annotation-implementation-verification-SC-01` through
  `annotation-implementation-verification-SC-08` pass for complete, missing,
  stale, cross-scope, no-impact, covered, gap, and blocked fixture evidence.
- [x] 1.2 Add gap-group and outcome-partition validation that returns exact
  acceptance-eligible, planning, and blocked IDs; reject duplicate or omitted
  gaps, eligible findings in planning, invalid lanes, and duplicate changes to
  make `annotation-implementation-verification-SC-09`,
  `annotation-implementation-verification-SC-10`, and
  `annotation-implementation-verification-SC-14` pass.
- [x] 1.3 Add the read-only `figma:annotations:impact` command with required
  scope, JSON report, selected IDs, and review inputs plus deterministic JSON
  and exit codes; prove blocked input performs no baseline, OpenSpec, Git, or
  Figma write for `annotation-implementation-verification-SC-04`,
  `annotation-implementation-verification-SC-08`, and
  `annotation-implementation-verification-SC-16`.
- [ ] 1.4 Extend the shared teammate reference and spec-scope
  `reconcile-figma-annotations` skill to capture implementation, focused-test,
  and runtime evidence in `grade10-spec`, preview validated outcomes, separate
  eligible acceptance from planning groups, invoke the confirmed existing
  planning lane, and require a fresh run afterward, making
  `annotation-implementation-verification-SC-01` through
  `annotation-implementation-verification-SC-17` visible in focused skill
  tests without changing current observation or acceptance semantics.
- [ ] 1.5 Verify the group with `pnpm run test:design-sync`, `pnpm run
  agent:sync-parity`, `pnpm run agent:check-parity`, `pnpm run lint`, `pnpm run
  typecheck`, and `git diff --check`.

## 2. Extend the product reconciliation adapter (grade10)

This group depends on group 1 being merged into the registered
`grade10-spec` store's `main`; it must stop blocked when the impact command is
absent rather than adding a product-local validator.

- [ ] 2.1 Extend the product skill preflight and report phase to require
  `figma:annotations:impact`, retain the same product-scoped report as temporary
  JSON, inspect only `grade10` implementation evidence for selected IDs, and
  validate the digest-pinned review through the store command, making
  `annotation-implementation-verification-SC-01` through
  `annotation-implementation-verification-SC-04` pass in the focused agent
  suite.
- [ ] 2.2 Add the human impact preview and deterministic routing for
  `implemented`, `no-impact`, `covered`, `gap`, and `blocked`; translate only
  eligible outcomes into the existing acceptance decisions and leave every gap
  or blocker visible, making `annotation-implementation-verification-SC-05`
  through `annotation-implementation-verification-SC-08` and
  `annotation-implementation-verification-SC-14` pass.
- [ ] 2.3 Inspect the current planning board before grouping gaps, show the
  exact change/lane/artifact preview, require separate planning confirmation,
  run the existing `pm-planning` or `full-planning` skill sequentially, and end
  each gap's old reconciliation path, making
  `annotation-implementation-verification-SC-09` through
  `annotation-implementation-verification-SC-13` pass without duplicating
  planning rules.
- [ ] 2.4 Add dirty-store, incomplete-planning, fresh-observation, and
  independent-permission guards to the product skill; update `/dev-help` and
  focused agent tests so `annotation-implementation-verification-SC-15` through
  `annotation-implementation-verification-SC-17` pass without authorizing a
  commit, push, merge, task claim, implementation, submodule advance, or Figma
  write.
- [ ] 2.5 Verify the group with `pnpm run test:agent`, `pnpm run
  agent:sync-parity`, `pnpm run agent:check-parity`, `pnpm run lint`, `pnpm run
  typecheck`, and `git diff --check`.

## 3. Prove the scoped handoff end to end (grade10-spec, grade10)

This group depends on groups 1 and 2. It uses fixture or disposable planning
targets and performs no real annotation acceptance, commit, push, merge, task
claim, implementation, submodule advance, or Figma write.

- [ ] 3.1 Run one mixed fixture through both repo-local skills and prove each
  scope produces the same complete outcome partitions while using only its
  owning implementation repository; cover implemented, no-impact, covered,
  gap, blocked, stale, and mixed-outcome selections for
  `annotation-implementation-verification-SC-01` through
  `annotation-implementation-verification-SC-10` and
  `annotation-implementation-verification-SC-14`.
- [ ] 3.2 Rehearse declined `pm-planning`, confirmed `pm-planning`, confirmed
  `full-planning`, incomplete planning, a dirty-store stop, and the required
  fresh reconciliation restart against disposable targets; verify
  `annotation-implementation-verification-SC-11` through
  `annotation-implementation-verification-SC-17` and confirm the annotation
  baseline remains byte-identical.
- [ ] 3.3 Run `pnpm run test:design-sync`, `pnpm run agent:check-parity`, `pnpm
  run lint`, and `pnpm run typecheck` in `grade10-spec`; run `pnpm run
  test:agent`, `pnpm run agent:check-parity`, `pnpm run lint`, and `pnpm run
  typecheck` in `grade10`; run `openspec validate
  verify-figma-annotation-implementation --strict` and inspect both repository
  diffs before handoff.
