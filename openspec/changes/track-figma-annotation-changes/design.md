## Context

See [proposal.md](proposal.md) for the problem. The existing design-sync job in
`grade10-spec` already reads the Grade10 Figma file every night with
`FIGMA_TOKEN`, resolves file keys from the design-system configuration, and
fails rather than claiming a clean result when Figma is unavailable. Its
component and audit rails do not persist or compare Figma annotation text.

OpenSpec planning lives in the separately registered `grade10-spec` clone,
while an engineer starts workflows from the `grade10` repository. That
repository's `pnpm plan` command already owns current-user identity and task
claims. The implementation must preserve that boundary and satisfy the
[annotation-monitoring spec](specs/design-sync/annotation-monitoring/spec.md).

## Goals / Non-Goals

**Goals:**

- Make annotation drift a deterministic, reviewable diff before AI interprets
  it.
- Reuse the current Figma credential, design-source registrations, OpenSpec
  store registry, and planning identity rather than introducing parallel
  configuration.
- Give an engineer the same short personal report through any supported agent
  harness while preserving every unassigned, ambiguous, and other-owner finding
  for team triage.
- Keep baseline acceptance and any external notification as deliberate human
  actions.

**Non-Goals:**

- Running an LLM to decide whether two annotation snapshots differ.
- Defining a scheduler adapter or automation prompt for each AI harness; the
  nightly design-sync check remains the shared daily backstop.
- Adding a database, hosted service, webhook receiver, or Figma write path.
- Guaranteeing the identity of the person who edited an annotation; the Figma
  document evidence does not provide a dependable ownership signal for this
  workflow.

## Decisions

### 1. Detection and interpretation live on opposite sides of the repo boundary

`grade10-spec` will own a read-only annotation scanner, its fixtures, the
reviewed baseline, and the design-governance documentation. It already owns the
Figma source and OpenSpec store, so a baseline there changes in the same review
as the requirement decision that accepts it.

`grade10` will own a `monitor-figma-annotations` workflow skill and its entry on
the `/dev-help` map. The skill will resolve the store path through `openspec
store list --json`, invoke the scanner in that clone, and interpret its JSON
against active OpenSpec artifacts. It will never hardcode a developer's clone
path or a Figma file path.

Alternatives considered:

- Put everything in `grade10`: rejected because it would duplicate design
  evidence outside its source-of-truth repository and the registered planning
  store.
- Put the skill in `grade10-spec`: rejected because developers enter the
  planning workflow from `grade10`, where `/dev-help`, `pnpm plan`, and current
  task ownership already live.
- Let the skill call Figma directly: rejected because AI-generated comparisons
  would be harder to test, reproduce, and run in CI.

### 2. A versioned occurrence manifest is both scan scope and accepted baseline

`scripts/design-sync/annotation-baseline.json` schema version 2 will group
entries by Figma file plus colon-form node ID. A node entry holds an
`annotations` array rather than one text value. Each accepted occurrence has a
baseline-local `annotationKey`, normalized text, category ID, a canonical
sorted pinned-property set, and its own optional exact associations to a
capability, active change, and task group. The key is unique within the node and
stable when text or array order changes; it is not derived from an array index
or mutable text.

Schema version 1 entries migrate one-to-one into node entries containing one
occurrence. The migration assigns a deterministic initial key and preserves
the entry's source root, associations, and no-impact reason. A malformed or
partly migrated baseline blocks the scan instead of mixing schemas.

Source roots are discovered from Code Connect URLs and audit tables; the
manifest may register an additional root for annotation-only design nodes that
are not represented by either source.

The scanner will inspect each root and its descendants. A separate inventory
mode will enumerate annotations in the configured Figma file for the initial
backfill, but the daily scan will stay inside registered roots so unrelated
design exploration does not flood engineering reports. An annotation found
under a registered root with no accepted entry remains an `added` and
`untracked` finding.

Text comparison will normalize carriage-return line endings to newline and
nothing semantic. Whitespace, punctuation, links, labels, and markdown remain
part of the diff because they can change the instruction.

The scanner will canonicalize each current annotation as normalized text (empty
when the annotation is property-only), category ID or null, and a sorted set of
pinned properties. Matching is local to one node and follows four deterministic
steps:

1. Cancel exact canonical matches as a multiset, independent of Figma array
   order.
2. Within each category plus pinned-property signature, pair one remaining old
   and one remaining current occurrence as changed only when that pair is
   unique.
3. Emit every still-unmatched baseline occurrence as removed and every
   still-unmatched current occurrence as added.
4. Mark a signature ambiguous when more than one old and current occurrence
   remain, and do not transfer an occurrence-specific association by guess.

Identical duplicate annotations retain multiplicity. When one of two identical
occurrences disappears, the scanner reports one removal; if those baseline
duplicates carry different associations, ownership remains ambiguous because
Figma supplies no occurrence identity that can prove which one was removed.

Alternatives considered:

- Scan the whole file every day: rejected because the design file contains
  exploratory and documentation areas outside any shipped surface.
- Store only a hash: rejected because reviewers and reports need the old text
  without recovering an earlier artifact.
- Store the last scan as an unversioned CI artifact: rejected because an
  expired or replaced artifact would silently redefine the comparison point.
- Derive scope only from Code Connect: rejected because some audited or
  annotation-only nodes are not component mappings.
- Use Figma array position as identity: rejected because reordering unchanged
  annotations would create false changed findings and move associations.
- Use a text hash as identity: rejected because editing the text would turn one
  change into an unrelated removal and addition.
- Pair duplicates by edit distance or prose similarity: rejected because a
  deterministic-looking guess could transfer the wrong OpenSpec ownership.

### 3. The scanner has a stable JSON contract and meaningful exit states

`scripts/design-sync/annotation-monitor.mjs` will share existing Figma file-key
and environment-loading utilities rather than add a client dependency. Its
`--json` output will contain a schema version, overall status, scanned sources,
blockers, and findings. Every finding will carry a stable ID, file and node
link, node name, annotation key when matched, canonical annotation structure,
change kind, old and current text where applicable, ambiguity details,
registered source, and baseline associations. Finding identity includes the
annotation occurrence so two changes of the same kind on one node never
collide. Inventory emits one record per occurrence rather than one record per
annotated node. An unmatched current occurrence uses its canonical fingerprint
plus a one-based multiplicity ordinal after canonical sorting, never its raw
Figma array position, so repeated scans of the same multiset keep stable IDs.

Exit `0` means every registered surface was read and no drift was found. Exit
`1` means the scan completed and found annotation drift. Exit `2` means some
evidence was blocked or malformed. The JSON remains available for exits `1`
and `2`, so the workflow skill can report the evidence instead of reducing it
to a command failure. Human output and the GitHub step summary will be rendered
from the same result object.

Tests will use Node's built-in test runner and checked-in Figma response
fixtures. The root test command will include the design-sync tests, avoiding a
new production or development dependency.

Alternatives considered:

- Exit successfully when drift exists: rejected because the shared nightly
  rail would then require someone to open a passing run to notice the change.
- Use one failure exit for drift and inaccessible evidence: rejected because a
  developer must know whether to review a real edit or repair the scanner.
- Print human prose only: rejected because the skill would have to scrape an
  unstable presentation format.

### 4. Baseline acceptance is a reviewed patch, never a scanner side effect

The scanner will not expose an in-place update flag. Its inventory and JSON
forms provide candidate values, but an engineer must patch the baseline and
record either an exact OpenSpec association or an explicit no-impact reason.
The resulting Git diff is the acceptance record and can be reviewed beside the
relevant requirement, design, or implementation change.

A baseline annotation occurrence may point to a durable capability without an
active task. Active change and task-group associations are optional and should
be removed or updated when they stop being true. Stale references are findings,
not reasons to guess a successor.

Alternatives considered:

- Automatically snapshot after every successful scan: rejected because the
  first scan after an edit would erase the evidence it was meant to report.
- Let the AI skill rewrite the baseline: rejected because report generation
  must stay read-only and safe to schedule unattended.

### 5. Personal responsibility comes from planning claims, with explicit precedence

The skill will call `pnpm plan mine` to obtain the same normalized current
handle and task claims as the existing planning workflow, then read the board
and exact active artifacts from the registered store. It will not duplicate
the `OPENSPEC_HANDLE` / clone config / GitHub-login precedence in skill prose.

An annotation is eligible for a task owner only when the baseline or active
artifact gives an exact change and task-group association. The report applies
the spec's precedence: current user's claimed group, another user's claimed
group, current user's proposal authorship with no applicable claimed group,
then unassigned or untracked. Multiple exact candidates remain ambiguous.

The AI layer may recommend how to handle the prose, but each recommendation
must cite the deterministic finding and exact mapping evidence. Similar words
can be shown as a search lead only if clearly labelled non-authoritative; they
cannot affect ownership or hide an untracked finding.

Alternatives considered:

- Use the Figma editor or annotation author: rejected because the fetched node
  is design evidence, not a reliable assignment source.
- Use Git blame or component ownership: rejected because code history does not
  express who currently handles the OpenSpec work.
- Treat proposal authorship as assignment: rejected because proposals and task
  claims intentionally have separate owners.
- Add a second user mapping file: rejected because it would drift from
  `pnpm plan mine` and create conflicting identities.

### 6. Shared CI detection and harness-neutral skill reporting serve different audiences

The nightly `design-sync` workflow will run the scanner after the existing
Figma checks, append its human summary to the GitHub job summary, and fail on
drift or blocked evidence. This is the team-visible backstop.

The committed Grade10 skill will be the portable personal-reporting interface.
It will live in the canonical project skill location and flow to Codex, Claude,
Cursor, and other supported integrations through the repository's existing
agent-platform parity. Its contract defines how to invoke the scanner and
render the result, but it does not define a recurrence. A developer may run it
on demand or schedule it with facilities supplied by their chosen harness.

Alternatives considered:

- Create GitHub issues or messages automatically: deferred because those are
  external writes, require channel-specific permissions and deduplication, and
  are unnecessary to prove the detection and ownership model.
- Define a Codex-specific automation: rejected because the team uses different
  models and harnesses, and a project workflow for one would not be portable.
- Build scheduler adapters for every harness: rejected because their scheduling
  APIs, storage, permissions, and lifecycle differ; that work does not improve
  the shared detection or report contract.
- Rely only on GitHub Actions: rejected because a failed shared check does not
  tell each developer which findings are likely theirs.

### 7. This change has no product UI artifact

The output is terminal text, a GitHub summary, and an agent-session reply. There
is no customer or admin screen, no Figma source for the reporting surface, and
no responsive or accessibility behaviour to specify in `ui.md`.

Alternatives considered:

- Add a dashboard: rejected as a new hosted surface and operating burden before
  the team has evidence that the report needs persistent browsing.

## Risks / Trade-offs

- [Tracked roots miss an annotation elsewhere in the file] -> Inventory the
  whole configured file during backfill, report source coverage, and make
  explicit roots reviewable in the baseline.
- [Large initial inventory creates noisy ownership gaps] -> Land an explicit
  reviewed baseline before enforcing the nightly step and leave uncertain
  entries untracked rather than guessing.
- [A Figma node is replaced and receives a new ID] -> Report the old node as
  orphaned and the new annotation as untracked; require one reviewed patch to
  reconnect them.
- [Several same-structure annotations change together] -> Report unmatched
  removals and additions with ambiguity evidence rather than transferring the
  wrong annotation key or owner.
- [Figma reorders annotations] -> Compare canonical occurrences as a multiset
  and never use array position as identity.
- [OpenSpec task groups are renamed, archived, or reassigned] -> Resolve active
  artifacts on every run and surface stale associations as ambiguous or
  unassigned.
- [An individual harness does not schedule or invoke the skill] -> Keep the
  independent nightly GitHub check as the shared daily detection rail.
- [Annotation prose is mistaken for an approved requirement] -> Label the AI
  classification as a recommendation and require OpenSpec plus baseline review
  before acceptance.
- [Scanner exit `1` complicates AI invocation] -> Require the skill to capture
  stdout for all documented exit states and branch on the JSON status.

## Migration Plan

1. Add fixture-driven scanner tests and migrate the single-annotation baseline
   schema to occurrence arrays without enabling CI enforcement.
2. Run whole-file inventory against the configured Figma file, review every
   annotation occurrence, tracked root, and association, and commit a clean
   schema-version-2 baseline.
3. Enable the annotation step in the nightly design-sync workflow and confirm a
   controlled fixture or temporary annotation difference produces the expected
   GitHub summary and exit state.
4. Land the Grade10 skill and `/dev-help` entry after the scanner contract is
   available in the planning store, then verify clean, drift, blocked,
   unassigned, current-owner, and other-owner reports.
5. Restore agent-platform parity, verify the same skill contract is visible to
   every supported harness path, and document only the on-demand invocation and
   report contract; harness-specific scheduling remains outside the project.

Rollback disables the nightly annotation step and removes the project skill.
The baseline remains harmless versioned evidence and can be removed in a
reviewed follow-up if the workflow is abandoned; no production data or API
migration is involved.
