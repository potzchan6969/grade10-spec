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
- [x] 1.5 Migrate the baseline to per-node annotation occurrence arrays with
  stable local keys and per-occurrence associations, preserving schema-version-1
  evidence so `Multiple annotations are baselined independently` and
  `Property-only annotation is tracked` pass.
- [x] 1.6 Replace the single-annotation guard with order-independent multiset
  matching and occurrence-aware findings so `Annotation array order changes`,
  `Annotation text changes`, `One of several structural matches changes
  text`, `Duplicate annotation count decreases`, `Several unmatched siblings
  are ambiguous`, and `Annotation structure changes` pass.
- [x] 1.7 Verify the extended group with fixtures covering zero, one, multiple,
  duplicate, reordered, property-only, uniquely changed, structurally changed,
  and ambiguously changed annotations; `pnpm run test`; `pnpm run lint`; and
  `pnpm run typecheck`.

## 2. Prior shared nightly rail (grade10-spec)

These checked tasks record the shared rail built on group 1. Group 6 removes
the annotation-specific parts after the replacement passes.

- [x] 2.2 Add the annotation scanner to the design-sync workflow with a GitHub
  step summary and distinct drift versus blocked failures so `Annotation text
  changes` and `Figma cannot be read` remain visible to the whole team.
- [x] 2.3 Extend the design-sync governance guide with the inventory, triage,
  reviewed-baseline acceptance, stale association, and rollback procedures
  required by `Tracked annotation text is compared with a reviewed baseline`
  and `Annotation changes are traced only through exact evidence`.

## 3. Prior ownership-aware monitor skill (grade10)

These checked tasks record the read-only predecessor. Groups 5 and 7 migrate
its reusable behavior and then remove it.

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
- [x] 3.6 Update the skill's report rules to keep separate findings and
  occurrence-specific ownership for several annotations on one node, while
  preserving ambiguity for unpairable duplicates, so `Annotation text
  changes`, `Several unmatched siblings are ambiguous`, and `Actionable changes
  are found` pass together.
- [x] 3.7 Verify the extended group with one-node fixtures containing unchanged,
  independently owned, and ambiguously paired sibling annotations, then rerun
  `pnpm run agent:check-parity`, `pnpm run lint`, `pnpm run typecheck`, and
  `pnpm run test`.

Groups 1 through 3 preserve the checked implementation history and reusable
matching, ownership, and test foundations. Their uncompleted nightly-rail and
submodule tasks are superseded. Groups 4 through 7 are the active replacement
and cleanup plan.

## 4. Build the category-aware reconciliation core (grade10-spec) (owner: @kinisworking)

- [x] 4.1 Define and validate a normalized temporary observation schema with a
  pinned digest, registered roots, exact node and ancestor evidence, category
  catalog metadata, and canonical occurrences. Add fixtures for `One category
  catalog resolves many annotations`, `Content and Interaction labels are
  reported`, `Annotation has no category`, `Category evidence is incomplete`,
  and `Annotation is outside registered surfaces`.
- [ ] 4.2 Refactor the existing REST-coupled monitor into a read-only snapshot
  diff command while retaining schema-version-2 normalization, stable finding
  IDs, complete-evidence exit states, and multiset matching. Migrate the current
  fixtures so `Annotation array order changes`, `One of several annotations
  changes text`, `Duplicate multiplicity decreases`, `Several unmatched
  siblings are ambiguous`, `Annotation structure changes`, and `Only
  line-ending representation differs` remain covered.
- [ ] 4.3 Add an atomic selective-acceptance command that validates a pinned
  observation, selected finding IDs, and a complete decision document before
  writing. Cover `Existing text edit is accepted`, `Addition is confirmed`,
  `Only selected findings are accepted`, `Ambiguous duplicate is selected`,
  `Association decision is missing`, and `Observation changed before
  acceptance`.
- [ ] 4.4 Extend acceptance fixtures for removals, replacement nodes, and
  orphaned baseline entries so each requires explicit review; prove accepted
  annotation keys, exact associations, and `noImpactReason` metadata survive
  unrelated reconciliations.
- [ ] 4.5 Replace the old package command with focused snapshot diff and accept
  commands, keep all JSON and exit behavior deterministic, and prove diff never
  writes, invalid acceptance writes nothing, and successful acceptance replaces
  the baseline atomically.
- [ ] 4.6 Verify this group with the focused design-sync tests, `pnpm run test`,
  `pnpm run lint`, `pnpm run typecheck`, and `git diff --check`.

## 5. Add the single interactive reconciliation skill (grade10)

This group depends on group 4 being available in the standalone registered
`grade10-spec` store. It does not depend on the `external/grade10-spec`
submodule pointer.

- [ ] 5.1 Add the canonical `reconcile-figma-annotations` skill and a reusable
  read-only Figma Plugin API observation reference that reads registered roots,
  reads one category catalog per file, resolves categories locally, emits the
  normalized temporary snapshot, and performs no Figma or repository write.
  Cover `Figma Plugin API access is unavailable` and the category observation
  scenarios with fixture-based contract tests.
- [ ] 5.2 Migrate the existing exact-association and ownership helper into the
  new report path. Show stable finding ID, category ID and label, Figma URL,
  node and ancestor evidence, old and current text, pinned properties,
  ambiguity, exact OpenSpec evidence, owner group, and next action for `Exact
  active change reference is found`, `Similar prose is the only lead`,
  `Matching task group belongs to the current user`, `Proposal authorship does
  not override another owner`, and `Current identity is unavailable`.
- [ ] 5.3 Implement the guided report, finding selection, decision collection,
  and pre-write confirmation. Prove the initial phase is read-only, unselected
  findings remain drift, blocked evidence offers no write, and no association
  or `noImpactReason` is inferred.
- [ ] 5.4 Invoke the registered store's acceptance command for the confirmed
  selection, prepare any exact related OpenSpec edits as one validated patch,
  show the resulting standalone-store Git diff, and rerun diff against the same
  observation digest. Cover `Reconciliation verifies cleanly` with clean,
  partial, rejected, stale, ambiguous, removal, replacement, and orphan cases.
- [ ] 5.5 Add the second explicit commit confirmation and an exact staging
  allowlist. Cover `Developer confirms the commit` and `Developer declines the
  commit`, including unrelated and overlapping dirty-store changes, and prove
  the workflow never pushes, advances a submodule, opens a pull request, or
  modifies Figma.
- [ ] 5.6 Replace the annotation entry on `/dev-help` with the new skill, restore
  `.claude/skills/` parity symlinks, and rehearse the same observation and
  report contract from representative Codex, Claude, Gemini, and Cursor-style
  harness inputs.
- [ ] 5.7 Verify this group with focused skill and helper tests, `pnpm run
  agent:check-parity`, `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`,
  and `git diff --check`.

## 6. Remove deprecated annotation automation (grade10-spec)

This group depends on the end-to-end workflow in groups 4 and 5 passing.

- [ ] 6.1 Remove the annotation scan, annotation failure handling, and ephemeral
  `annotation-monitor.json` from the existing design-sync workflow. Verify
  `Design-sync workflow still checks registered components`: preserve its
  triggers and component, rendered-value, token, audit, and Code Connect checks.
- [ ] 6.2 Remove the REST live-fetch path, old scanner entry point, obsolete
  annotation package command, and CI-specific summary rendering after migrating
  every useful canonicalization, matching, blocker, and fixture test to the
  snapshot diff and acceptance commands.
- [ ] 6.3 Replace the annotation section of the governance guide with one
  end-to-end example: Figma Plugin API observation -> temporary snapshot ->
  ownership-aware drift report -> finding selection -> confirmed baseline and
  spec decisions -> Git diff -> verification -> optional local commit. State
  that there is no CI snapshot, `annotation-current.json`, automatic push, or
  Figma write.
- [ ] 6.4 Verify this group with workflow syntax and design-sync checks, the
  focused annotation tests, `pnpm run check:design-system`, `pnpm run test`,
  `pnpm run lint`, `pnpm run typecheck`, and `git diff --check`.

## 7. Remove deprecated read-only workflow surfaces (grade10)

This group depends on group 5 passing and the governance update in group 6
being available in the registered store.

- [ ] 7.1 Remove the `monitor-figma-annotations` skill, its agent metadata, and
  its `/dev-help` route so `A supported harness opens the annotation workflow`
  exposes only `reconcile-figma-annotations`.
- [ ] 7.2 Fold the old monitor helper, tests, package commands, and any duplicate
  annotation wrapper into the new reporting and reconciliation paths, then
  delete the obsolete names. Preserve exact-association, ownership,
  multi-occurrence, ambiguity, and blocked-evidence coverage.
- [ ] 7.3 Run `pnpm run agent:check-parity`, `pnpm run lint`, `pnpm run
  typecheck`, `pnpm run test`, and `git diff --check`; confirm the canonical
  skill remains under `.claude/skills/` and parity paths remain symlinks.
- [ ] 7.4 Perform the final cross-repository acceptance run with categorized
  multiple annotations, partial acceptance, related OpenSpec metadata, Git diff,
  remaining-drift verification, declined commit, and confirmed local commit.
  Confirm no tracked current snapshot, annotation CI step, REST live fetch,
  deprecated skill, automatic push, submodule advance, or Figma write remains.
