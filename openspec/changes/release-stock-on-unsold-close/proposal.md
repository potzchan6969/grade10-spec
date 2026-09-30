**Author:** @jeffffej0909 - 2026-09-30

## Why

An auction that closes with no winner keeps its stock held. The units never
return to available, so an operator cannot list the card again and the
inventory shows less stock than the house owns. Only a call-off releases the
hold today. Nothing in the spec says what happens to stock on an Unsold close.

**Metric:** Unsold listings still holding stock, which should fall to none; and
days from an Unsold close to the lot's next listing, which starts at no data
because the stock is stuck.

## What Changes

- **Stock returns at the Unsold close.** A listing that closes with no winner
  releases its hold in that moment. The units are available again and no operator step is needed.
- **The listing says so.** An Unsold listing shows that its stock was released,
  and when.
- **The product page and the history show it.** Available rises by the released
  units, the hold reads closed and released, and names the listing by code and
  title. Each history entry gains Holder and Remarks; the release's remarks say
  an Unsold listing released it.
- **Stock held by earlier Unsold closes is freed once.** Each such hold is
  released in one clean-up and reads in the history as released by it.
- **An Unsold listing offers Relist.** On its row in the Listings table, once
  its stock is released, outside a campaign and once per listing. It opens a
  new draft for the same product, quantity, title, copy, price, currency and
  gallery. The draft takes its own hold on Save and carries no bids or history
  from the closed listing.

No running rule is reversed. Call-off, cancellation and a paid order keep
their stock rules; a sale still moves stock from the hold to sold.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-admin/auction/listing`: the hold released at an Unsold close, the
  released note on the listing, Relist, and the clean-up of earlier holds.
- `grade10-admin/inventory/catalog`: the released hold on the product page and
  in the history when Auction releases it for an Unsold close, and the holder
  and remarks on every history entry.

## Impact

- **Admin app** — the released note and Relist on an Unsold listing; the
  released hold on the product page and in the history.
- **Auction service** — the Unsold close releases the listing's hold through
  the inventory service; one clean-up over holds left by earlier Unsold closes.
- **Inventory service** — a release whose reason is the Unsold close, and the
  clean-up's reason, on the history entry.
- **Site** — none; the collector sees the same Ended listing.

## References

- [Auction Management · Listings](../../../docs/prds/products/grade10-admin/auction/management.md#listings)
- [Products and Stock · Intake](../../../docs/prds/products/grade10-admin/inventory/catalog.md#intake)

