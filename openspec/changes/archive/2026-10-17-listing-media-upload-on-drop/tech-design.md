## Context

The auction listing media manager currently holds a selected direct-upload file
in a preview until the operator confirms it. The change makes a supported file
store on drop or choose, supports several files in one selection, and keeps
the existing listing-media service contract unchanged.

## Goals / Non-Goals

**Goals:**

- Store supported direct-upload files immediately from both drop and file
  chooser paths.
- Append a multi-file selection after the last gallery item in selection order.
- Apply the same immediate path to replacement files.
- Report a refusal for each unsupported, oversized or over-cap file without
  removing accepted files from the same selection.
- Persist direct-upload reorder on drop while preserving Save for staged
  inventory assets.
- Keep removal confirmation and all existing type, size, cap, alt-text, zoom
  and writable-state rules.

**Non-Goals:**

- No auction service or storage API change.
- No change to accepted media types, the 100 mebibyte bound or the eight-item
  cap.
- No upload undo, cropping, rotation or image editing.
- No change to inventory asset selection, copying or Save semantics.

## Decisions

1. **One immediate path for drop, choose and replace**
   - Normalize dropped and chosen files through the existing gallery upload
     path, and invoke the same path for replacement. Do not create a preview
     state that can diverge between add and replace.

2. **Sequential batch processing**
   - Process the files in the order supplied by the browser, starting after the
     last current item. Await each storage result before processing the next so
     gallery order and per-file refusal messages are deterministic.

3. **Per-file failure isolation**
   - Validate type, size and remaining capacity for each file. A refusal does
     not roll back previously stored files from the same selection, and the
     refusal includes the reason for that file.

4. **Reorder persistence follows the source**
   - Persist a direct-upload reorder on drop. Keep inventory-backed items in
     the existing staged state until Save, so selecting inventory assets does
     not gain an unrelated auto-save.

5. **Removal remains guarded**
   - Keep the existing remove confirmation and last-item refusal. Immediate
     upload does not imply immediate destructive removal.

## Interfaces and Risks

- The frontend continues to call the existing auction media service. No new
  endpoint, payload field or service permission is needed.
- The upload state must distinguish an in-flight file from a stored item so a
  second selection cannot reorder or replace an item before the first result
  is placed.
- A batch may contain both accepted and refused files. The gallery and its
  error surface must retain accepted files and identify each refused file.
- Existing direct-upload and inventory-asset tests must prove that only direct
  uploads auto-persist order.

## Verification

- Unit or component tests cover immediate add, batch order, per-file refusal,
  immediate replacement, direct-upload reorder and staged inventory reorder.
- The changed feature cases remain draft for post-deployment `/tcs-review`.
- Run the repository's typecheck, lint, focused frontend tests and the
  listing-media end-to-end walk before implementation handoff.
