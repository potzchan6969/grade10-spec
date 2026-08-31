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
   write. Leave uncertain findings unselected.
3. Record exactly one association or non-empty `noImpactReason` per selected
   occurrence. Removed, ambiguous, replacement, and orphaned occurrences need
   the explicit occurrence or old-to-new decision required by the store.
4. Review and explicitly confirm the decision preview before acceptance. It
   must pin the observation digest and list every exact file that may change.
5. Rerun the scoped diff against the same observation. Accepted findings must
   disappear, while unselected findings and blockers remain visible.
6. Only after verification, separately decide whether to create one local
   standalone-store commit. Declining leaves the verified diff uncommitted.

## Write boundary

Acceptance may update selected occurrences in
`scripts/design-sync/annotation-baseline.json` and exact related OpenSpec files
confirmed in the preview. A local commit, when separately confirmed, stages
only that allowlist. The skill never writes Figma, a product checkout, a
submodule, a remote, or a pull request.
