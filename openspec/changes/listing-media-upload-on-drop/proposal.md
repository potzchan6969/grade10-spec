**Author:** @htonyl - 2026-09-28

## Why

An operator filling a listing gallery picks one slot, picks one file, waits
for its preview, and presses Confirm, then does it again for every photograph.
A card shot front, back, and two close-ups costs eight presses before any alt
text is written, and a wrong file costs no less to fix after it lands than
before: it is removed like any other item. The author reviewed the admin media
manager against the upload flows collectors' own tools use - Etsy, Turo,
Airbnb and Zillow store a photograph as it is dropped and order the gallery by
dragging - and asked for the same.

**Metric:** presses from opening an empty gallery to four stored photographs,
from eight (choose and confirm per file) to one drop; share of listings created
with three or more gallery items.

## What Changes

- **BREAKING Upload on drop** - a file the operator drops or chooses is stored
  at once, with no preview to confirm or discard. The requirement that an
  operator confirms an image before it is stored is removed, and its scenarios
  and cases (choosing shows a preview, confirming stores, discarding leaves the
  gallery unchanged) retire with it.
- **Several files at once** - one drop or one pick may hold several files. They
  store one after another after the last item in the gallery; a file past the
  eighth, or of a type or size the gallery refuses, is named with its reason
  and nothing is stored for it.
- **Replace stores at once** - a replacement file takes the item's place as
  soon as it is chosen, the same way an added file stores.
- **Order holds on drop** - the operator drags an item beside another, and the
  new order holds as soon as it is dropped. While inventory assets are staged,
  the order still waits for the listing's Save, as it does today.
- **Remove still asks** - removing a stored item keeps its confirmation, since
  it cannot be undone.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `grade10-site/auction/listing-media` - the requirement "An operator confirms
  an image before it is stored" is replaced by one that stores a chosen file at
  once, several at a time, and names each file it refuses; journey US-01 no
  longer promises a preview to confirm.

## Impact

- **grade10 admin** - the auction listing media dialog and the Inventory
  product media dialog move to one shared gallery in the admin console: upload
  on drop, drag to reorder, and one panel for the selected item's alt text,
  replace and remove. Built on the grade10 branch
  `claude/eloquent-hopper-aezqcs` (9gag/grade10#632).
- **Suites** - `grade10-site-auction-listing-media-US1-TC3-2` rewrites the
  versioned file-stores-at-once case; `US1-TC4-1` and `US1-TC5-1` retire with
  the confirm step, and new draft cases cover batches, refusals, replacement
  and order persistence. The E2E walks on that branch already follow.
- **No service change** - the auction service already stores whatever the
  admin sends; the confirm step lived only in the admin panel.

## References

- [Auction Management · Listings](../../../docs/prds/products/grade10-admin/auction/management.md#listings)
