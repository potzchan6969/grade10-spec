**Author:** @mason5991 - 2026-10-07

Product context: [Bidding · Auction Panel](../../../docs/prds/products/grade10-site/auction/bidding.md#auction-panel).

## Why

Public Recent Bids avatars all read as **B**, because the lot page derives
the avatar from the listing pseudonym `Bidder N`. Collectors cannot tell
rivals apart by avatar even when their emails start with different letters.

**Metric:** share of public Recent Bids rows whose avatar letter matches the
first `A-Z` or `0-9` of that bidder's email local part (or **B** when none or
the email is erased); target 100% on the live lot page.

## What Changes

- **Email-derived avatar letter** — every public bid row that paints an
  avatar shows one character from that bidder's email local part
  (uppercased). Readable label stays **Bidder N** (and **You** for the
  viewer).
- **Separate from the label** — the public payload carries that letter
  apart from the listing pseudonym, so the avatar never has to parse
  `Bidder N`.
- **Privacy bound** — full email and name stay off every public surface;
  missing or erased email falls back to **B**.
- **Lot page wiring** — Recent Bids on the lot, including live updates, use
  the new letter. No Storybook or shared-block redesign.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/bidding-history` — public reads may expose one
  email-derived avatar character; still not the identity (name or full
  email) behind a listing pseudonym.
- `grade10-site/auction/listing-page` — the lot page maps that character
  onto each public Recent Bids avatar, including live updates.

## Impact

- Auction public listing and live bid payloads add a one-character avatar
  initial per public bid row.
- `grade10-site` listing mapper stops using `Bidder N` as the avatar
  source.
- Manual pages: Bidding Auction Panel, Display Auction Details, Auction
  landing decision, Auction Service public-reads note.
- Shared `ListingBidHistoryList` / Storybook fixtures already demo varied
  letters; no design-system or Storybook redesign.

## References

- [Bidding · Auction Panel](../../../docs/prds/products/grade10-site/auction/bidding.md#auction-panel)
- [Display · Auction Details](../../../docs/prds/products/grade10-site/auction/display.md#auction-details)
- [Auction Service · Public reads and cache](../../../docs/prds/platform/auction-service.md#public-reads-and-cache)
