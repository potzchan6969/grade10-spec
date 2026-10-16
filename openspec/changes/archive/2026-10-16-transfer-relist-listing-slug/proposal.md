**Author:** @mason5991 - 2026-10-15

## Why

A collector who shared a lot link during the sale, or who opens that link after
an Unsold close, lands on the closed page once the house Relists. Relist saves
a new listing with a new listing code, and the slug is regenerated from title
plus that code, so the public address changes while the closed lot keeps the
old one. UAT rehearsal finding B1 (P0), 14 Oct 2026.

**Metric:** Shared `/auction/listings/<slug>` hits that open the live successor
after Relist, which should rise from none today to essentially all after the
transfer ships.

## What Changes

- **Relist keeps the public address.** On Relist Save, the Unsold source's slug
  is freed and assigned to the new draft in the same transaction. The editor
  opens with that slug filled in. The new draft still receives its own listing
  code. **BREAKING** for anyone who expected the closed Unsold page to keep
  answering at that address after Relist Save.
- **One canonical URL, no redirect table.** The successor holds the slug; there
  is no permanent redirect from a second address.
- **Activity records the transfer.** Both the Unsold source and the new draft
  gain an activity entry that names the slug move and the other listing.
- **Admin shows Relisted on the source.** After Relist Save, the Unsold source
  shows a **Relisted** badge beside **Unsold** on its listing detail header and
  in the Listings table Status column.
- **Collision rules follow the move.** After the transfer, the source no longer
  reserves that address; other completed, expired or unsold listings still do.
  Field-exit availability for the Relist draft treats the source's current slug
  as available to that draft.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-admin/auction/listing`: Relist Save transfers the source slug, keeps
  a distinct listing code, records activity, shows Relisted on the Unsold
  source in admin, and adjusts slug reservation for that source.

## Impact

- **Auction service** - Relist draft save (`relistOf`) frees and reassigns the
  source slug atomically with the new draft insert, writes activity on both
  listings, and leaves listing-code allocation unchanged.
- **Admin app** - Relist editor opens with the source slug; slug helper and
  availability treat that source as the transfer exception; activity shows the
  transfer on both lots; the Unsold source shows Relisted beside Unsold on its
  detail header and Listings Status column once Relist Save linked a successor.
- **Site** - `/auction/listings/<slug>` follows whoever holds the slug; after
  Relist Save the Unsold source no longer answers there, and the successor
  answers once published, created-or-closed rules unchanged.

## References

- [Auction Management · Listings](../../../docs/prds/products/grade10-admin/auction/management.md#listings)
- [Auction Display · Listing Code](../../../docs/prds/products/grade10-site/auction/display.md#listing-code)
- Rehearsal findings B1 (P0), 14 Oct 2026
