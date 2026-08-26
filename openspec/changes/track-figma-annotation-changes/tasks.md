## 1. Build the annotation scan contract (grade10-spec)

- [x] 1.1 Implement the versioned baseline schema, source-root discovery, and
  fixture-driven comparison that make `Annotation text changes`, `Annotation is
  added under a tracked design surface`, `Annotation is removed from an
  existing node`, and `Only line-ending representation differs` pass.
- [x] 1.2 Implement complete-evidence validation, orphan handling, and explicit
  untracked findings that make `Figma cannot be read`, `A baseline node no
  longer resolves`, and `An annotation has no project association` pass.
- [x] 1.3 Expose human, inventory, and stable JSON output with the documented
  clean, drift, and blocked exit states, and include its Node test lane in the
  repository test command.
- [x] 1.4 Verify the group with the design-sync fixture tests, `pnpm run test`,
  `pnpm run lint`, and `pnpm run typecheck`.

## 2. Establish the shared nightly rail (grade10-spec)

This group depends on group 1's scanner contract landing first.

- [ ] 2.1 Inventory the configured Figma file, review linked and explicit
  annotation roots, and add the initial baseline with exact capability, change,
  task-group, or no-impact associations so `Annotation is added under a tracked
  design surface` and `An annotation has no project association` are exercised
  against representative current nodes.
- [x] 2.2 Add the annotation scanner to the design-sync workflow with a GitHub
  step summary and distinct drift versus blocked failures so `Annotation text
  changes` and `Figma cannot be read` remain visible to the whole team.
- [x] 2.3 Extend the design-sync governance guide with the inventory, triage,
  reviewed-baseline acceptance, stale association, and rollback procedures
  required by `Tracked annotation text is compared with a reviewed baseline`
  and `Annotation changes are traced only through exact evidence`.
- [ ] 2.4 Verify the group with clean, changed, removed, untracked, orphaned,
  and unavailable-Figma fixtures; a read-only live `pnpm run
  figma:annotations -- --json` when `FIGMA_TOKEN` is available; `pnpm run
  check:design-system`; `pnpm run test`; `pnpm run lint`; and `pnpm run
  typecheck`.

## 3. Add the ownership-aware workflow skill (grade10)

This group depends on groups 1 and 2 landing in `grade10-spec`; advancing the
submodule is the boundary before the application-repository work begins.

- [ ] 3.1 Advance `external/grade10-spec` to the landed annotation-monitoring
  revision and confirm the submodule is clean and fetchable.
- [x] 3.2 Add the canonical `monitor-figma-annotations` project skill that
  resolves the registered store, captures scanner JSON for all documented exit
  states, cites only exact baseline or OpenSpec evidence, and performs no writes,
  making `Active change references the exact node`, `Two active changes match
  exactly`, and `Only similar words are found` pass.
- [x] 3.3 Make the skill use `pnpm plan mine` and active task claims for its
  ownership precedence, with fixture-based rehearsals for `Matching task group
  is assigned to the current user`, `Proposal author does not override another
  owner`, `Authored change has no matching claimed group`, and `Current identity
  cannot be resolved`.
- [x] 3.4 Render the concise personal report and inspectable other-owner detail
  for `Actionable changes are found`, `No tracked annotations changed`, and
  `Work owned by others is present`; make `A supported harness invokes the
  workflow skill` pass by adding the skill to `/dev-help`, restoring
  agent-platform parity from the canonical source, and keeping scheduling out of
  the project contract.
- [x] 3.5 Verify the group with controlled clean, drift, blocked, ambiguous,
  current-owner, authored, unassigned, and other-owner invocations; `pnpm run
  agent:check-parity`; `pnpm run lint`; `pnpm run typecheck`; and `pnpm run
  test`.
