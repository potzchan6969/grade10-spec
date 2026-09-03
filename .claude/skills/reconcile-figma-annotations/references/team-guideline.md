# Figma annotation reconciliation guideline

Use this store-owned skill when design-system primitives or shared
`packages/ui` blocks have changed annotation evidence. It scans registered
`spec` surfaces only; it is not a whole-file inventory, a product page
workflow, or a scheduled CI check.

## Prerequisites

- Start in the standalone `grade10-spec` checkout.
- The invoking harness must provide read-only Figma Plugin API access, or an
  equivalent MCP operation, for the registered file.
- Invoke the skill explicitly and state that the run is `spec` scoped.

If the Plugin API, registered inventory, category catalog, or baseline cannot
be resolved, the result is blocked. A root that cannot be resolved is skipped
when another root resolves and is listed at the end; if every root is
unresolved, the observation is blocked. Never treat blocked evidence as clean.

## Ownership

| Group | Meaning |
| --- | --- |
| `My assigned work` | One exact associated task group is claimed by the current user. |
| `Owned by others` | One exact associated task group is claimed by another user. |
| `Authored by me` | The current user authored the associated change and no task group has an owner. |
| `Unassigned or untracked` | No exact owner exists, identity is unavailable, or evidence is ambiguous. |

Ownership is never inferred from similar wording, Figma editor identity, Git
history, component authorship, or node proximity.

## Review workflow

1. Generate a complete report with `--scope spec`. Include every finding and
   every skipped root. Each finding must show its stable ID, node heading,
   category label and ID, complete previous and current bodies verbatim,
   pinned properties, Figma link, registered-root and ancestor evidence,
   ambiguity, exact OpenSpec evidence, ownership, and next action.
2. Select individual stable IDs. Selection is preparation, not permission to
   write or proof of implementation. Leave uncertain findings unselected.
3. Before acceptance, create one temporary impact-review document for every
   selected ID. Pin it to the report observation digest and record expected
   behavior, `grade10-spec` implementation locations, focused test evidence,
   runtime evidence, and exactly one outcome: `implemented`, `no-impact`,
   `covered`, `gap`, or `blocked`. The store-owned command is the authority:

   ```bash
   pnpm run figma:annotations:impact -- --scope spec \
     --report "$work_dir/report.json" --ids "id-a,id-b" \
     --review "$work_dir/impact.json" --json
   ```

   An implemented outcome needs an exact association, successful focused test,
   and runtime observation. A no-impact outcome needs a specific non-empty
   reason. A covered outcome needs an active exact change or task group. Gaps
   and blockers are never acceptance-eligible.
4. Review the impact partition explicitly. Translate only
   `implemented`, `no-impact`, and `covered` findings into the existing
   decision preview. The preview must pin the observation digest and list
   every exact file that acceptance may change.
5. Before proposing a new change, inspect the current planning board and exact
   OpenSpec evidence. Group related gaps by capability and delivery outcome.
   Show finding IDs, expected behavior, capability path, proposed kebab-case
   change name, planning lane, affected repositories, and non-goals. Require a
   separate confirmation before invoking `/grade10-planning`.
   A declined or failed planning handoff creates no acceptance and leaves gaps
   visible.
6. Rerun the scoped diff against the same observation. Accepted findings must
   disappear, while unselected findings and blockers remain visible. Planning
   does not accept a gap; after planning starts, a later reconciliation must
   take a fresh observation, report, selection, and impact review.
7. Only after the eligible acceptance transaction is verified, separately
   decide whether to create one local standalone-store commit. Declining leaves
   the verified diff uncommitted. Planning, acceptance, commit, push, merge,
   task claiming, and implementation remain independent permissions.

## Write boundary

Acceptance may update selected occurrences in
`scripts/design-sync/annotation-baseline.json` and exact related OpenSpec files
confirmed in the preview. A local commit, when separately confirmed, stages
only that allowlist. The skill never writes Figma, a product checkout, a
submodule, a remote, or a pull request.
