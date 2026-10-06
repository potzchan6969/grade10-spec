**Author:** @ecchochan - 2026-10-07

## Why

The custody agreement, the loan agreement and the release receipt name the
case by its internal id (`vc_test_456fc323-...`), in the `Case` fact and in
the footer. Every letter, the ceremony's own header, the collector's read of
the case and the counter's search name it by its six-character reference
(QC7PEQ on staging, 7 October 2026). The paper is the one place a collector or
the counter meets the case under a handle nobody speaks, types or searches.

**Metric:** console searches typed as a case-id prefix, which fall as paper
stops printing the id, against searches typed as a reference.

## What Changes

- **The reference on the paper** - the three documents name the case by its
  reference alone, in the `Case` fact and in the footer, so a collector reads
  the same six characters their letters carry and staff search the console by
  what the paper prints
- **The reference's list names the paper** - `case-intake`'s list of where
  the reference is read gains the paper, pointing at `documents-and-signing`,
  so the next surface that names a case starts from a complete list
- **Sealed paper stays as sealed** - only packets prepared after the change
  print the reference

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/vault/documents-and-signing`: each document names the case by
  its reference, in its facts and its footer
- `grade10-site/vault/case-intake`: the reference's "Where it is read" names
  the signed paper

## Impact

- **Templates** - grade10 `packages/vault/backend/src/documents/templates/`:
  the custody agreement, the loan agreement and the release receipt print the
  reference
- **Preparation** - `packages/vault/backend/src/documents/prepare.ts` hands
  the templates the case's reference; the reference never changes, so a
  re-prepare prints the same paper
- **No migration** - every case already carries a reference, and no sealed
  packet is touched
- **No API change** - no route, response or search moves

## Open questions

None.

## References

- [Documents and Signing · Document Terms](../../../docs/prds/products/grade10-site/vault/documents-and-signing.md#document-terms)
- [Collector Pages · Case Page](../../../docs/prds/products/grade10-site/vault/collector-pages.md#case-page)

## Follow-on changes

- A downloaded document's file name carries the case reference
