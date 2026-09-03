---
name: reconcile-figma-annotations
description: "Use when design-system or shared UI Figma annotations need evidence-pinned, ownership-aware review and selective reconciliation in this registered store."
disable-model-invocation: true
---

# Reconcile Figma annotations

Run one guided, harness-neutral annotation transaction for the `spec` scope:
observe the registered design-system primitives and shared `packages/ui`
blocks, compare the temporary observation with the reviewed baseline, report
exact evidence and current ownership, review selected findings against
implementation evidence, accept only eligible decisions, verify against the
same observation, and offer one separately confirmed local commit or planning
handoff.

Read [references/figma-plugin-observation.md](references/figma-plugin-observation.md)
for the portable read-only adapter and
[references/team-guideline.md](references/team-guideline.md) for teammate
review guidance.

## Scope and safety contract

- This skill owns only the `spec` scope: `packages/design-system/**` and
  shared `packages/ui/**` registrations. Do not inspect or route page-layout
  roots from this skill.
- Use the current standalone store checkout as the working directory. Do not
  resolve another checkout, infer a repository path, or use a product-side
  fallback implementation.
- Every inventory, diff, report, and acceptance command must pass
  `--scope spec`. A missing or invalid scope is blocked.
- The initial observation and report are read-only. If the harness cannot
  execute the read-only Figma Plugin API (or an equivalent MCP operation),
  report blocked evidence and stop; never fall back to REST prose or claim
  clean.
- Keep the normalized snapshot, inventory, diff, report, impact review,
  decisions, and identity
  evidence in an operating-system temporary directory only. Remove them on
  exit where the harness permits.
- There are separate pauses after report and selection, after the impact
  preview, before applying eligible decisions, before any planning write, and
  after same-snapshot verification before a local commit. Selection, impact
  review, acceptance, planning, and commit consent are independent.
- Never modify Figma, a product checkout, a submodule pointer, a protected
  branch, a remote, a pull request, or unrelated store files.

## Run

1. Create a temporary working directory and request the scoped inventory:

   ```bash
   work_dir="$(mktemp -d "${TMPDIR:-/tmp}/grade10-spec-annotation.XXXXXX")"
   trap 'rm -rf "$work_dir"' EXIT
   pnpm run figma:annotations:inventory -- --scope spec --json \
     >"$work_dir/inventory.json"
   ```

   A blocked inventory stops the run. The inventory is the only registration
   input: it contains the flat source registrations and tracked node IDs for
   this scope.

2. Use the read-only adapter described in the observation reference. Invoke
   it with the inventory files and write the schema-version-2 observation to
   `"$work_dir/observation.json"`. It must read each unique registered root
   and descendant once, read one category catalog per file, preserve complete
   annotation bodies and evidence, and perform no network or Figma write.

3. Diff the observation, preserving its exit status:

   ```bash
   set +e
   pnpm run figma:annotations:diff -- --scope spec \
     --snapshot "$work_dir/observation.json" --json \
     >"$work_dir/diff.json"
   diff_code=$?
   set -e
   ```

   Exit `0` means complete/no drift, `1` means complete/drift, and `2` means
   blocked or malformed evidence. A blocked result has no acceptance path.

4. Resolve current planning identity separately, then render every finding:

   ```bash
   set +e
   pnpm plan mine >"$work_dir/mine.txt"
   mine_code=$?
   set -e
   if [ "$mine_code" -ne 0 ]; then : >"$work_dir/mine.txt"; fi

   pnpm run figma:annotations:report -- --scope spec \
     --scanner "$work_dir/diff.json" --store "$PWD" \
     --mine "$work_dir/mine.txt"
   pnpm run figma:annotations:report -- --scope spec \
     --scanner "$work_dir/diff.json" --store "$PWD" \
     --mine "$work_dir/mine.txt" --json >"$work_dir/report.json"
   ```

   Show all ownership groups and every finding, including findings owned by
   others. Keep annotation bodies verbatim with original line breaks and
   retain stable IDs, categories, pinned properties, Figma links, registered
   roots, ancestor evidence, exact OpenSpec evidence, ownership, and next
   action. List skipped roots after the groups; skipped roots are not findings
   and are not selectable.

5. Ask for individual stable finding IDs. Selection is preparation only: do
   not accept, plan, commit, or infer an outcome from the selection. Leave
   uncertain findings unselected.

6. Review implementation impact for every selected ID. Write one temporary
   schema-version-1 document containing the observation digest, expected
   behavior, owning-repository implementation evidence, focused test evidence,
   runtime evidence, and exactly one outcome (`implemented`, `no-impact`,
   `covered`, `gap`, or `blocked`) per ID. Implementation evidence must name
   `grade10-spec` and exact relative paths; evidence from `grade10` is context,
   never proof. A complete implementation entry needs an exact association,
   successful focused test, and runtime observation. A `no-impact` entry needs
   a specific non-empty reason. A `covered` entry needs an active exact change
   or task-group association. A `gap` needs missing behavior and one planning
   group; a `blocked` entry needs its unresolved blockers.

   Validate the document through the read-only store command:

   ```bash
   set +e
   pnpm run figma:annotations:impact -- --scope spec \
     --report "$work_dir/report.json" \
     --ids "id-a,id-b" --review "$work_dir/impact.json" --json \
     >"$work_dir/impact-result.json"
   impact_code=$?
   set -e
   ```

   Exit `0` means every selected finding is acceptance-eligible, `1` means
   one or more validated gaps need planning, and `2` means blocked, stale, or
   malformed evidence. Show the observation digest, every outcome, the
   acceptance-eligible IDs, the planning groups, and blockers. Do not continue
   when the command returns `2`.

7. For acceptance-eligible findings, collect the existing exact capability,
   change, or task-group decision (or the existing `noImpactReason`) and show
   a decision preview with the observation digest, selected eligible IDs, each
   decision, and exact related OpenSpec files. Gaps and blockers stay visible
   and are excluded from this preview. After explicit confirmation, write
   decisions to the temporary directory and invoke:

   ```bash
   pnpm run figma:annotations:accept -- --scope spec \
     --snapshot "$work_dir/observation.json" \
     --ids "id-a,id-b" --decisions "$work_dir/decisions.json" --json
   ```

   Stale observation or baseline digests, blocked evidence, unknown IDs,
   missing decisions, ambiguous occurrences, malformed patches, or dirty
   overlapping targets must leave every target unchanged.

8. Inspect the exact store diff and rerun the same scoped diff against the
   same observation. Accepted findings must disappear; unselected findings
   and blockers must remain visible. Report remaining drift before offering a
   commit or planning handoff.

9. If validated planning groups remain, inspect the current planning board and
   exact OpenSpec evidence before proposing work. For each group show its
   finding IDs, expected behavior, capability path, proposed kebab-case change
   name, affected repositories, and
   non-goals. Ask a separate planning-confirmation question. A decline leaves
   every gap visible and creates no planning artifact. On confirmation, invoke
   the existing `/grade10-planning` workflow for that group; it
   owns its interview, artifact validation, commit, push, and merge gates.
   Finish or stop the eligible acceptance transaction first, and stop if the
   registered store is dirty rather than mixing acceptance and planning
   writes. Planning does not accept the gap and does not authorize a commit,
   push, merge, task claim, implementation, submodule advance, or Figma write.
   Once planning starts, end the old reconciliation path. A later acceptance
   requires a fresh live observation, report, selection, and impact review.

10. Ask a separate commit question for the eligible acceptance transaction. If
    confirmed, stage only the baseline and exact confirmed OpenSpec files,
    inspect the staged diff, and create one local `type(base): ...` commit. Do
    not push, open a pull request, advance a submodule, or write Figma.

## Failure meanings

| State | Meaning | Action |
| --- | --- | --- |
| clean | Complete scoped evidence and no findings | State no tracked changes; do not create an empty acceptance. |
| drift | Complete scoped evidence with findings | Report and select individual IDs. |
| skipped root | A registered root could not be resolved while another resolves | List it after the report; it is not a finding. |
| blocked | Store, Figma, category, scope, snapshot, or baseline evidence is unavailable or invalid | Explain blockers and rerun; never write or claim clean. |
| impact planning | The selected impact review has validated gaps | Keep gaps unaccepted and preview a separately confirmed planning handoff. |
| impact blocked | Impact evidence is stale, malformed, cross-scope, or incomplete | Keep every affected finding visible; do not accept or plan it. |

This is the only reconciliation workflow in this store. Scheduling belongs to
the invoking harness, not to the skill.
