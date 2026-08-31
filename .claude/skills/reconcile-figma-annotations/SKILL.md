---
name: reconcile-figma-annotations
description: "Use when design-system or shared UI Figma annotations need evidence-pinned, ownership-aware review and selective reconciliation in this registered store."
disable-model-invocation: true
---

# Reconcile Figma annotations

Run one guided, harness-neutral annotation transaction for the `spec` scope:
observe the registered design-system primitives and shared `packages/ui`
blocks, compare the temporary observation with the reviewed baseline, report
exact evidence and current ownership, accept only explicitly selected
decisions, verify against the same observation, and offer one separately
confirmed local commit.

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
- Keep the normalized snapshot, inventory, diff, decisions, and identity
  evidence in an operating-system temporary directory only. Remove them on
  exit where the harness permits.
- There are three pauses: after the initial report and finding selection,
  before applying decisions, and after same-snapshot verification before a
  local commit. Selection is not write consent, and acceptance is not commit
  consent.
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
   ```

   Show all ownership groups and every finding, including findings owned by
   others. Keep annotation bodies verbatim with original line breaks and
   retain stable IDs, categories, pinned properties, Figma links, registered
   roots, ancestor evidence, exact OpenSpec evidence, ownership, and next
   action. List skipped roots after the groups; skipped roots are not findings
   and are not selectable.

5. Ask for individual stable finding IDs. For every selected ID collect
   exactly one exact capability/change/task-group association or a specific,
   non-empty `noImpactReason`. Do not infer ownership from prose, proximity,
   Figma editors, or Git authors. Leave uncertain findings unselected.

6. Show a decision preview with the observation digest, selected IDs, each
   decision, and exact related OpenSpec files. After explicit confirmation,
   write decisions to the temporary directory and invoke:

   ```bash
   pnpm run figma:annotations:accept -- --scope spec \
     --snapshot "$work_dir/observation.json" \
     --ids "id-a,id-b" --decisions "$work_dir/decisions.json" --json
   ```

   Stale observation or baseline digests, blocked evidence, unknown IDs,
   missing decisions, ambiguous occurrences, malformed patches, or dirty
   overlapping targets must leave every target unchanged.

7. Inspect the exact store diff and rerun the same scoped diff against the
   same observation. Accepted findings must disappear; unselected findings
   and blockers must remain visible. Report remaining drift before offering a
   commit.

8. Ask a separate commit question. If confirmed, stage only the baseline and
   exact confirmed OpenSpec files, inspect the staged diff, and create one
   local `type(base): ...` commit. Do not push, open a pull request, advance a
   submodule, or write Figma.

## Failure meanings

| State | Meaning | Action |
| --- | --- | --- |
| clean | Complete scoped evidence and no findings | State no tracked changes; do not create an empty acceptance. |
| drift | Complete scoped evidence with findings | Report and select individual IDs. |
| skipped root | A registered root could not be resolved while another resolves | List it after the report; it is not a finding. |
| blocked | Store, Figma, category, scope, snapshot, or baseline evidence is unavailable or invalid | Explain blockers and rerun; never write or claim clean. |

This is the only reconciliation workflow in this store. Scheduling belongs to
the invoking harness, not to the skill.
