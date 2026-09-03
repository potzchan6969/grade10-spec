## Context

See [proposal.md](proposal.md) for motivation and the existing
[annotation-monitoring specification](../track-figma-annotation-changes/specs/shared/design-sync/annotation-monitoring/spec.md)
for required behavior.

The reviewed baseline stores one flat record per engineering registration. It
currently contains 77 records for 57 unique Figma roots because 20 roots are
intentionally registered by both audit and Code Connect evidence. The live
observer instead treats each registration as a traversal root, so repeated root
IDs are resolved and traversed twice, duplicated roots fail store validation,
and annotations are counted twice. Distinct registered roots can also overlap
in the Figma tree; the current node merge unions root IDs but appends the same
node annotations again.

The observer and store separately canonicalize observations. The observer keeps
the Plugin API's nearest-parent-first ancestor chain, while the store sorts that
chain by node ID before hashing. A complete observer snapshot can therefore
carry a digest the store rejects. The current portable reference also permits
`loadAllPagesAsync`, which the Codex Figma adapter explicitly does not support,
and full descendant output can exceed the adapter transport limit even when
only a small fraction of nodes carry relevant evidence.

## Goals / Non-Goals

**Goals:**

- Keep the durable registration inventory intact while deriving one temporary
  traversal root per Figma node.
- Represent each live node and annotation occurrence once even when registered
  roots overlap.
- Give the store sole ownership of canonicalization and the digest used by
  reporting and acceptance.
- Preserve final-annotation removal evidence without transporting unrelated
  zero-annotation descendants.
- Keep one read-only, harness-neutral observation boundary with deterministic
  blocked behavior for incomplete evidence.

**Non-Goals:**

- Redesign occurrence matching, association decisions, ownership, acceptance,
  or transaction behavior.
- Add an observation cache, remote relay, Figma-side state, or second scanning
  workflow.
- Preserve temporary schema-version-1 snapshots after the coordinated
  cross-repository migration.

## Decisions

### 1. Registrations remain flat; observed roots become unique

`annotation-baseline.json` remains schema version 2 and keeps its flat root
records unchanged. The observation adapter accepts those records as
`registrations`, groups them by normalized `fileKey + nodeId`, and emits one
root containing a canonically sorted `sources` array. A source carries only
registration provenance (`kind`, `path`, `label`, `component`, and `covers`);
the root carries live node identity, type, name, and ancestor evidence.

Exact duplicate source records and conflicting file metadata are malformed
observation input. Distinct audit, Code Connect, and surface registrations are
preserved. Unresolved duplicate registrations produce one skipped root with all
of its sources.

Alternatives considered:

- Collapse the durable 77-record baseline to 57 roots: rejected because those
  records are the engineering source inventory, not traversal output.
- Pick one source as canonical: rejected because it discards exact ownership
  and association evidence.
- Give each source a synthetic root ID: rejected because source provenance is
  not Figma identity and would retain duplicate traversal.

### 2. Temporary observation schema version 2 carries source multiplicity

Schema version 2 replaces `roots[].source` with `roots[].sources[]` and applies
the same root shape to `skippedRoots`. Each file's roots remain unique by node
ID, and each node's `rootIds` refers only to those Figma node IDs. Source order
is not meaningful and is canonicalized by its normalized field tuple.

The migration is deliberately breaking: observations are operating-system
temporary files for one run, not durable artifacts. Both repositories move to
version 2 before the repaired workflow is accepted; no schema-version-1 file is
migrated or retained.

Alternatives considered:

- Add `sources` while keeping schema version 1: rejected because changing the
  canonical root shape and digest semantics without changing the version makes
  compatibility claims unreliable.
- Emit both `source` and `sources`: rejected because two representations can
  disagree and force every consumer to choose precedence.

### 3. Node evidence is merged independently of root traversal

The adapter resolves and traverses each unique root once. A file-level map owns
one evidence record per node ID. The first visit records live name, type,
nearest-parent-first ancestors, and normalized annotations. Later visits only
add root IDs after verifying that the repeated live evidence is identical.
Different repeated evidence blocks the file as `inconsistent-node-observation`
instead of selecting one version.

This makes annotation multiplicity describe Figma occurrences rather than the
number of registration paths that reached them.

Alternatives considered:

- Deduplicate only equal root IDs: rejected because distinct ancestor and
  descendant roots can overlap.
- Deduplicate annotations by text or fingerprint after collection: rejected
  because Figma may legitimately contain duplicate annotation occurrences with
  identical content.

### 4. The adapter emits annotation-bearing and baseline-tracked nodes

Traversal still validates every descendant under a registered root. The
temporary snapshot emits a node only when it currently has an annotation or
its ID appears in the accepted baseline entries for that file. Roots remain in
the separate root inventory. Baseline-tracked nodes are emitted with an empty
annotation list when their final annotation has been removed; a tracked node
not reached under any root remains an orphan finding.

The file configuration therefore carries `trackedNodeIds` derived from every
baseline entry alongside its flat registrations. This keeps removal semantics
while reducing transport from the whole design subtree to review-relevant
evidence.

Alternatives considered:

- Emit every zero-annotation descendant: rejected because it creates large
  snapshots without changing any finding except for baseline-tracked nodes.
- Fetch only annotation nodes directly: rejected because the Plugin API does
  not provide a complete annotation index and registered-surface containment
  still has to be established.

### 5. The registered store owns canonicalization and digest creation

The adapter writes schema-version-2 evidence without a digest. The registered
store validates and canonicalizes it, preserves ancestor order while rejecting
duplicate ancestor IDs, and computes the observation digest returned by the
diff command. Decisions pin that digest, and acceptance recomputes it from the
same temporary file.

The observer no longer carries a second digest implementation. Report and
acceptance behavior continue to use the store's normalized result.

Alternatives considered:

- Keep matching digest implementations in both repositories: rejected because
  the current ancestor-order disagreement proves they can drift silently.
- Sort ancestors to make the store deterministic: rejected because an ancestor
  list is an ordered hierarchy, not a set.

### 6. One supported Plugin API invocation produces each file capture

The portable adapter requires `getNodeByIdAsync`, one annotation-category
catalog read, and root-local descendant traversal. It does not call
`loadAllPagesAsync`; an adapter that cannot resolve a registered root through
the supported async lookup records a skipped root or blocks when every root is
unresolved.

All roots for one Figma file are observed in one invocation and one in-memory
capture. Independent invocations are never stitched together. If the compact
capture cannot be returned and materialized completely, the file is blocked as
incomplete evidence.

Alternatives considered:

- Split roots across repeated MCP calls: rejected because the document can
  change between calls and no shared revision token proves consistency.
- Persist capture chunks in Figma plugin data: rejected because observation is
  read-only and Figma-side state is outside the workflow contract.

### 7. Source expansion happens before reporting

The store expands each observed root into one registered-source record per
`sources[]` entry. Node `rootIds` map to all source records for those roots, not
the first matching record. Existing findings and reports keep their
`registeredSources[]` interface. Skipped-root renderers show the unique Figma
root once and list each source beneath it.

Alternatives considered:

- Teach every report consumer about nested root sources: rejected because the
  reconciliation layer already owns the finding evidence contract.

## Risks / Trade-offs

- [The two repositories temporarily disagree on observation version] → Land
  and verify the store contract first, update the application adapter
  immediately afterward, and do not run acceptance between those steps.
- [Compaction omits a node needed to detect removal] → Derive tracked node IDs
  from every baseline entry and cover final removal and orphan scenarios at the
  adapter/store seam.
- [A repeated node changes during one capture] → Block the file rather than
  emitting mixed evidence.
- [A harness still truncates the compact payload] → Treat the observation as
  blocked; never recover by combining independent calls.
- [Schema-version-1 decisions are in progress during migration] → Discard the
  temporary run and start a new version-2 observation; no repository write has
  occurred before decision confirmation.

## Migration Plan

1. Add schema-version-2 normalization and multi-source expansion in
   `grade10-spec`, retaining the durable baseline unchanged.
2. Update the `grade10` adapter to group flat registrations, merge overlapping
   node evidence, compact emitted nodes, and omit the producer digest.
3. Update report rendering, the portable observation reference, and governance
   wording in their owning repositories.
4. Run both focused suites and a cross-repository temporary-snapshot rehearsal
   through the registered store, followed by one read-only live registered-file
   capture in a single Plugin API invocation. Verify one catalog read, unique
   roots, exact source preservation, non-duplicated occurrences, removal
   evidence, complete transport, and store-generated digest stability.
5. Roll back by reverting both implementation commits together. The durable
   baseline needs no data rollback.
