## Context

See [proposal.md](proposal.md) for the problem and the
[annotation-monitoring spec](specs/design-sync/annotation-monitoring/spec.md)
for required behavior.

The existing implementation has useful deterministic occurrence matching and
OpenSpec ownership logic, but its live scanner reads the Figma REST response.
That response exposes annotation prose without the category IDs and category
catalog needed to report labels such as `Content` and `Interaction`. The
annotation step also runs in the shared design-sync workflow, produces an
ephemeral `annotation-monitor.json`, and fails CI without providing a guided
acceptance path.

The baseline is already schema version 2 and supports several annotation
occurrences per node. OpenSpec planning lives in the separately registered
`grade10-spec` clone, while developers enter workflow skills from `grade10`.
The new design keeps those repository boundaries and replaces only the
annotation-specific automation.

## Goals / Non-Goals

**Goals:**

- Give developers one workflow from complete live observation through report,
  selective acceptance, verification, and optional local commit.
- Retrieve categories efficiently and make the current label visible beside
  every annotation finding.
- Keep matching, stable finding IDs, baseline mutation, and verification
  deterministic across AI models and harnesses.
- Preserve exact Figma and OpenSpec evidence, current ownership grouping,
  occurrence multiplicity, and reviewed baseline metadata.
- Remove superseded annotation CI and read-only monitor paths after the new
  workflow proves equivalent or stronger behavior.

**Non-Goals:**

- Adding a CI writer, bot credential, protected-branch write, scheduler, hosted
  current snapshot, or external notification.
- Reading annotations outside registered engineering surfaces.
- Making product decisions, ownership assignments, or occurrence matches from
  prose similarity.
- Modifying Figma, pushing Git commits, advancing the application repository's
  submodule, or opening a pull request.

## Decisions

### 1. One interactive Grade10 skill owns the user journey

`grade10` will expose `reconcile-figma-annotations` as the only annotation
workflow on `/dev-help`. It will guide observation, deterministic diff,
ownership-aware reporting, finding selection, decision confirmation, baseline
and related OpenSpec edits, diff review, verification, and optional commit.

The skill will resolve the standalone planning store through OpenSpec on every
run. It will never substitute `external/grade10-spec` or hardcode a developer's
clone path. Its canonical files will live under `.claude/skills/`; the existing
symlinks will provide platform parity.

The workflow has three deliberate confirmation boundaries:

1. The initial report is read-only and asks which stable finding IDs to handle.
2. A decision preview asks the developer to confirm the selected occurrences,
   exact associations or `noImpactReason`, and any related OpenSpec edits before
   files change.
3. After the resulting diff and verification report, a separate prompt asks
   whether to create a local `grade10-spec` commit.

Alternatives considered:

- Keep separate monitor and reconcile skills: rejected because developers
  would have to discover which second command continues a report, and the
  duplicated observation paths could disagree.
- Put the skill in `grade10-spec`: rejected because Grade10's project workflow,
  current-user identity, `/dev-help`, and agent parity live in `grade10`.
- Keep a CI monitor as a daily backstop: rejected because the team chose an
  on-demand harness-neutral flow and CI cannot retrieve the approved Plugin API
  evidence without adding another execution and credential model.

### 2. Figma Plugin API observation is a portable boundary, not business logic

The skill will require a harness capability that can execute a read-only Figma
Plugin API or equivalent MCP operation. A checked-in skill reference will
describe one bounded observation program. For each configured Figma file it
will:

1. load the registered roots and descendants needed for engineering scope;
2. read every annotation occurrence from those nodes;
3. read the file's annotation category catalog once;
4. resolve every category ID through an in-memory catalog map; and
5. return a normalized JSON observation to the invoking session.

The observation contract will contain schema version, file identity, observed
roots, skipped registered roots, exact node and ancestor evidence, category
catalog metadata, canonical occurrences, blockers, and a digest over the
normalized payload. A registered root that cannot be resolved is skipped when
another root in the same file resolves, and listed at the end of the report; it
is not a blocker. If every registered root is unresolved, the observation is
blocked. A null category remains `Uncategorized`. A non-null ID missing from
the catalog is a blocker. The skill will store the payload only in a newly
created operating-system temporary directory for the duration of the run and
remove it when the session completes where the harness permits.

No category call occurs per annotation. For a file with 127 occurrences, the
cost is one catalog read plus the bounded node observation, followed by local
lookups.

Alternatives considered:

- Continue using the REST response: rejected because current evidence showed
  annotation prose but no category IDs or catalog.
- Request category metadata once for every occurrence: rejected because the
  catalog is file-scoped and repeated calls add latency and failure points
  without adding evidence.
- Persist `annotation-current.json`: rejected because live state is useful only
  for the current review, creates merge churn, and risks being mistaken for
  accepted engineering state.
- Let each harness invent its own observation output: rejected because the
  deterministic commands and tests need one validated contract.

### 3. Deterministic commands consume a snapshot and own baseline semantics

`grade10-spec` will refactor the existing annotation monitor into a small
deterministic command surface that consumes the normalized temporary
observation instead of fetching Figma:

- `pnpm figma:annotations:diff --snapshot <path> --json` validates the snapshot
  and baseline, then emits blockers and stable findings without writes.
- `pnpm figma:annotations:accept --snapshot <path> --ids <id,...>
  --decisions <path>` validates a complete selected decision set and applies an
  atomic baseline and related-OpenSpec patch. The diff includes a
  `baselineDigest`; acceptance requires that digest as well as the observation
  digest, so concurrent baseline metadata edits cannot be overwritten.

Names may be adjusted to the repository's final command style, but snapshot
input, stable JSON output, selective IDs, and no implicit live fetch are fixed
interfaces. Existing canonicalization and multiset matching will be extracted
from the REST-coupled CLI rather than rewritten. Existing fixtures will be
migrated to normalized snapshot fixtures and expanded with category catalogs,
blocked evidence, and acceptance cases.

The baseline remains schema version 2. `categoryId` is authoritative accepted
identity; labels, colors, and preset flags are resolved current presentation
metadata. This avoids rewriting every accepted occurrence when a category's
display label or color is edited while still showing developers the current
Figma category.

Exit `0` means complete evidence with no drift, exit `1` means complete
evidence with drift, and exit `2` means blocked or malformed evidence. All
states retain machine-readable output.

Alternatives considered:

- Put comparison and acceptance inside skill prose: rejected because behavior
  would vary by model and would be difficult to test atomically.
- Generate keys for every observed addition: rejected because an unreviewed
  observation must not acquire accepted identity.
- Store category labels in each accepted occurrence: rejected because category
  IDs are the stable Figma reference and duplicated display metadata would
  create unrelated baseline churn.
- Use array order, text hashes, or edit distance as identity: rejected because
  reordering and edits would transfer keys or associations without evidence.

### 4. Acceptance is selected, evidence-pinned, and atomic

The diff result will bind every stable finding ID to the observation digest and
an accepted-baseline digest. Before acceptance, the skill will collect a decision
for each selected ID:

- retain or set exactly one existing capability, change, or change/task-group
  association; or
- record an explicit `noImpactReason`.

The skill may draft a related OpenSpec patch, but the developer must confirm
the requirement text and association. Similar prose may be shown as a search
lead only and cannot populate a decision.

The acceptance command will validate the entire selected set before writing,
including association keys and target existence in the registered store. A
related file payload contains an exact relative OpenSpec path, expected
pre-write content digest, and complete replacement content. It validates the
resulting baseline and every related file, checks that no target is dirty or
overlapping, then installs all files through one rollback-capable transaction.
It will reject stale digests, unknown IDs, missing decisions, ambiguous
duplicates, and overlapping or malformed operations. A unique text edit keeps
its accepted key. A confirmed addition gets a new reviewed key at apply time.
A selected removal deletes only its confirmed occurrence. Replaced nodes and
orphans require an explicit old-to-new decision rather than inference.

Baseline changes are built in memory, validated as a complete schema-version-2
document, written to a sibling temporary file, and atomically renamed. When a
related OpenSpec edit is needed, the skill will prepare and validate all file
patches before applying any of them; a failed validation leaves every target
unchanged. The skill will refuse to overwrite unrelated changes in a target
file.

Alternatives considered:

- Update the baseline during observation: rejected because seeing a change is
  not accepting its engineering meaning.
- Accept every finding in one command: rejected because developers need partial
  progress and unselected drift must remain visible.
- Auto-pair duplicate additions and removals: rejected because Figma provides
  no occurrence identity that proves the relationship.
- Update the baseline first and ask for metadata later: rejected because it can
  leave accepted state without traceability.

### 5. Exact OpenSpec evidence and ownership remain reporting inputs

The Grade10 reporting helper will retain the existing exact-association and
ownership precedence logic. It will enrich deterministic findings with active
artifacts from the registered store and current identity from `pnpm plan mine`.
Reviewed baseline associations, exact node or registered-ancestor references,
and exact component registrations are authoritative. Similar prose, Figma
editors, and Git authors are not.

The report will show all findings and use four groups in order: `My assigned
work`, `Owned by others`, `Authored by me`, and `Unassigned or untracked`.
Category ID and current label will appear beside every finding. Ambiguous exact
matches will name every candidate and remain unassigned.

Alternatives considered:

- Infer the current developer from code ownership or Git blame: rejected
  because those sources do not represent current OpenSpec task claims.
- Treat proposal authorship as assignment: rejected because an explicitly
  claimed task group has stronger evidence.
- Hide other-owner findings: rejected because shared design changes may still
  reveal cross-team drift that must remain inspectable.

### 6. Verification reuses the same observation and commit is a separate action

After applying selected decisions, the skill will show `git diff` from the
standalone `grade10-spec` clone and rerun the deterministic diff against the
same temporary observation digest. Accepted findings must disappear; rejected
and unselected findings must remain. The skill will report blockers and
remaining drift before offering a commit.

On explicit commit confirmation, the skill will stage an allowlist containing
only the baseline and exact related OpenSpec files shown in the decision
preview. It will inspect the staged diff, use the repository's commit-message
convention, and create one local commit. Existing unrelated or overlapping
working-tree changes block this step. It will never push, open a pull request,
advance `external/grade10-spec`, or modify Figma.

Alternatives considered:

- Fetch Figma again for verification: rejected because the design may change
  between acceptance and verification; the pinned observation is the reviewed
  evidence for this transaction.
- Commit immediately after writing: rejected because the developer must see
  the actual diff and remaining drift first.
- Reuse the application repository's `/commit` blindly: rejected because the
  changes live in the separately registered store and need an explicit path
  allowlist there.

### 7. Deprecated paths are removed only after replacement verification

Cleanup will be the final implementation phase. In `grade10-spec`, remove only
the annotation scanner steps and annotation report handling from
`design-sync.yml`; preserve all existing workflow triggers and non-annotation
checks. Remove the REST fetch path and obsolete command names after their
matching, normalization, and fixture coverage has moved to the snapshot-based
commands. Update governance documentation to describe the interactive flow.

In `grade10`, remove `monitor-figma-annotations`, its agent metadata, old helper
and wrapper names, and its `/dev-help` entry only after the new skill and tests
pass. Migrate the exact-association and ownership implementation and tests into
the new reporting path. Restore parity from `.claude/skills/` and prove no real
copies replaced the symlinks.

Alternatives considered:

- Delete old code before building the replacement: rejected because useful
  matching, ownership, fixtures, and failure semantics would lose their
  regression coverage.
- Leave both workflows indefinitely: rejected because two supported paths
  would drift and make it unclear which one may write.
- Remove the whole design-sync workflow: rejected because its component,
  token, rendered-value, audit, and Code Connect checks remain valuable and are
  outside this change.

### 8. This change has no product UI artifact

The output is an agent-session report, terminal JSON, Git diff, and local
commit. There is no customer or admin screen and no Figma-authored reporting
surface, so this change does not need `ui.md`.

Alternatives considered:

- Add a dashboard: rejected because it would add a hosted product and storage
  model before the team has evidence that persistent browsing is needed.

## Risks / Trade-offs

- [A harness cannot execute the Figma Plugin API] -> Block before writing and
  explain the required capability; do not fall back to incomplete REST evidence.
- [Registered roots miss engineering annotations] -> Keep roots explicit and
  reviewable; do not widen a normal run to the whole exploratory file.
- [A category ID cannot be resolved] -> Treat the observation as incomplete and
  make no repository write.
- [Figma changes during a review] -> Pin report, acceptance, and verification
  to one observation digest; require a new run for newer evidence.
- [Several same-structure annotations change together] -> Report removals and
  additions as ambiguous and require explicit occurrence review.
- [A node is replaced] -> Keep the old entry orphaned and the new occurrence
  added as reviewable drift until the developer confirms the replacement;
  reserve blocked/no-write for incomplete or malformed evidence.
- [The standalone store contains unrelated edits] -> Allow read-only reporting,
  but block writes or commits that overlap target files and stage only an
  explicit allowlist.
- [Removing CI reduces passive visibility] -> Make the project skill the sole,
  documented workflow and keep reports concise enough to run during normal
  implementation and design review.
- [Category labels change while IDs remain stable] -> Always display labels
  from the current file catalog while keeping category ID as accepted identity.

## Migration Plan

1. In `grade10-spec`, extract the existing schema-version-2 normalization,
   multiset matching, blockers, and stable findings into snapshot-driven diff
   code. Add category-aware normalized snapshot fixtures and retain all current
   occurrence regression coverage.
2. Add the selective acceptance command and tests for stable keys, additions,
   partial acceptance, ambiguity, stale evidence, metadata retention, atomic
   writes, removals, replacements, and orphans.
3. In `grade10`, add the canonical `reconcile-figma-annotations` skill,
   read-only Plugin API observation reference, ownership-aware report, guided
   decision flow, diff and verification, and separately confirmed commit.
4. Verify the new workflow end to end with clean, drift, blocked, categorized,
   multiple-occurrence, partial-acceptance, dirty-tree, declined-commit, and
   confirmed-commit fixtures across both repositories.
5. Remove the annotation-specific CI step and ephemeral report from
   `grade10-spec`, then remove the REST live-fetch entry point. Keep all other
   design-sync behavior.
6. Remove the deprecated Grade10 monitor skill, helper and wrapper entry points,
   and duplicate package scripts after migrating their ownership and
   exact-association tests. Update `/dev-help` and restore skill parity.
7. Rewrite governance documentation around: Figma observation -> temporary
   normalized snapshot -> drift report -> finding selection -> baseline and
   spec decisions -> Git diff -> verification -> optional local commit.

Rollback restores the old files from Git only if the new skill has not become
the documented path. Accepted schema-version-2 baseline data remains valid;
there is no production data, deployed API, or hosted state to migrate.
