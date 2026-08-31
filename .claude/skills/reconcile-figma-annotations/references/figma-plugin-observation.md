# Read-only Figma Plugin API observation

This reference defines the portable observation boundary. The invoking
harness supplies a read-only Plugin API adapter; the deterministic store
commands consume only the resulting schema-version-2 JSON.

## Required adapter operations

For each file in the schema-version-1 inventory, the adapter must provide:

- `figma.fileKey` (or the configured file key);
- `figma.getNodeByIdAsync(id)` for each registered root;
- `figma.annotations.getAnnotationCategoriesAsync()`; and
- descendant traversal through `root.findAll(() => true)` or an equivalent
  read-only traversal.

The adapter must not call `figma.loadAllPagesAsync()` or any network API. If a
required operation is unavailable, rejected, or returns malformed data, return
a blocked observation. Do not substitute a REST response: it does not supply
the category catalog required by this contract.

## Inventory and observation algorithm

1. Consume one `files[]` item from `figma:annotations:inventory --scope spec`.
   Group its flat `registrations` by normalized node ID while preserving every
   distinct source. Resolve each unique root once. If one root cannot be
   found, skip it with every source; if all roots are unresolved, block with
   `unresolved-registered-root`.
2. Fetch the category catalog exactly once per file. Resolve category IDs in
   memory while preserving each category's `id`, `label`, `color`, and
   `isPreset`.
3. Traverse each unique root and descendant. Merge overlapping traversal
   results into one node per node ID, union all root IDs, and emit each
   annotation occurrence once. Repeated node evidence must match exactly or
   block as `inconsistent-node-observation`.
4. Include annotation-bearing nodes and inventory `trackedNodeIds`. Tracked
   empty nodes make final annotation removals observable without serializing
   every empty descendant.
5. Read `labelMarkdown` (falling back to `label`), `categoryId`, and
   `properties[].type`. Normalize line endings and sort and de-duplicate
   pinned property types. A null category is valid as `Uncategorized`; an ID
   absent from the catalog blocks the observation.
6. Sort occurrences canonically and derive temporary
   `current:<fingerprint>:<ordinal>` keys. The store assigns reviewed keys
   only after explicit acceptance.
7. Emit schema version `2` with files, roots and sources, skipped roots,
   category catalogs, compact nodes, and blockers. Do not compute or persist a
   producer digest; the store normalizer owns the canonical digest.

The public seam is
`observeRegisteredFile({ figma, file })` in
`scripts/design-sync/annotation-observation.mjs`, where `file` is one
inventory file with `registrations` and `trackedNodeIds`. It is read-only and
does not assign annotations, change categories, write plugin data, or call a
network API.

## Minimal adapter shape

```js
await observeRegisteredFile({
  figma,
  file: {
    fileKey,
    fileUrl,
    registrations: [{ nodeId, kind, path, label, component, covers }],
    trackedNodeIds: [nodeId],
  },
});
```

For multiple files, call `observeRegisteredFiles({ figma, inventory })` and
pass the returned temporary observation to the store normalizer. Category
lookup remains one call per file, never one call per annotation.
