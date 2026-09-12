**Author:** @constancetang - 2026-09-12

## Why

A signed-in collector who has set or raised a private maximum on a lot can see
the live cap on the bid panel and the amounts Grade10 placed for them, but
cannot scan **when they raised the ceiling and to what** without reading the
full account chronology at `/bids`. Today's lot dialog collapses both ideas
under one **Your bid** column, so support and collectors confuse the authorized
cap with the auto-bid sequence.

**Measurement:** share of lot-page support tickets that confuse maximum vs
bid-step after the dialog lands; share of maximum raises that follow an open of
**Your bidding** on the same lot.

## What Changes

- Supersede the single-table personal-history dialog from
  `add-lot-user-bid-history`: keep one accessory beside public recent bids;
  rename the entry and title to **Your bidding**.
- Extend `ListingUserBidHistory` so the dialog shows two peer tabs in order —
  **Bid placed** | **Your maximums** — each with its own scrollable table
  (not one merged table, not stacked full tables). The live current maximum
  stays on the bid panel only; the dialog has no sticky **Your maximum now**
  summary.
- Default the active tab to **Bid placed** (including when that list is empty;
  show the empty bids state there).
- Project lot **Your maximums** from accepted configure/raise private events
  only; project **Bid placed** from the owner's auto-bid sequence; keep
  refused maximum attempts on the account chronology only.
- Clarify maximum set/raised/refused labels on account `/bids`; add no new
  account tab or route.
- Refresh shared `auctionListing` copy slots for the renamed entry, tabs,
  columns, and empty bids state.

**New export (proposed):** `ListingUserMaximumHistoryRow`. Existing exports
`ListingUserBidHistory`, `ListingUserBidHistoryProps`,
`ListingUserBidHistoryCopy`, and `ListingUserBidHistoryRow` stay and widen.
Engineer confirms the set when delivery is planned.

## Non-Goals

- A second bid-card link or a separate maximum-only dialog
- A sticky **Your maximum now** summary inside the lot dialog (live cap stays
  on the bid panel)
- **Set** / **Raised** (or other) status words on lot **Your maximums** rows —
  amount and time only
- Stacked full-height tables in one scroll
- A new `/bids` filter, tab, or maximums-only account page
- Refused maximum attempts on the lot dialog
- Showing maximum history in the public recent-bids list
- Manual-vs-automatic type badges on bid-sequence rows
- Lowering, cancelling, or editing a past maximum from history
- Export, share, or print of maximum history
- ZZZ storefront surfaces
- Pixel Figma delivery (listing blocks still have no Figma frame; stories remain
  the review source)

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/bidding-history`: lot dialog projects private maximum
  history and bid-sequence lists for the owner; account chronology keeps the
  full audit and clearer maximum labels; refused attempts stay account-only.
- `shared/ui/auction-listing`: `ListingUserBidHistory` renders two tabs and
  separate maximum / bid-sequence row lists with consumer-supplied copy; no
  current-maximum summary in the dialog.

## Impact

- `@grade10/ui`: widen `ListingUserBidHistory` props, copy, and row types;
  keep `recentBidsAccessory` composition on the bid card.
- `@grade10/i18n`: rename and add shared `auctionListing` keys for link, title,
  description, tabs, columns, and empty bids; clarify
  `auctionBiddingHistory` maximum event labels.
- `apps/preview` / Storybook: lot personal-bidding stories for the tabbed
  dialog.
- `@grade10/auction-frontend` (consumer): supply maximum rows from accepted
  configure/raise events and bid-sequence rows from automatic bids for the
  signed-in owner; keep the live current maximum on the bid panel.
- Active change `add-lot-user-bid-history`: this change supersedes its
  personal-history dialog contract (SC-09–11). Keep its accessory slot; do not
  fold the single-table dialog requirement as the lasting shape.

## Assumptions

- Grilling frontier was empty after the settled UX plan at
  `docs/max-bid-history-ux.md` (Project store), the approved Storybook pass,
  and repo reading: primary surface, tabs without a dialog maximum summary,
  default tab always **Bid placed**, event split, privacy, account label-only
  scope, and v1 non-goals are decided. No further product interview was
  required.
- No domain impact: the lot dialog and `/bids` label clarifications stay inside
  `grade10-site/auction/bidding-history` journeys; `shared/ui/auction-listing`
  is walked by nobody on its own, and no new cross-capability auction path is
  introduced. No platform impact: Grade10 sitefront only.
- Auction already retains `automatic_max_configured` and
  `automatic_max_raised` for the owner; the consumer can project those into lot
  dialog rows without a new money model.
- Author handle follows the related lot personal-history change; correct if
  another owner wrote this proposal.

## References

- [Bidding History · Lot Personal Bidding](../../../docs/prds/products/grade10-site/auction/bidding-history.md#lot-personal-bidding)
- [Bidding History · One listing's story](../../../docs/prds/products/grade10-site/auction/bidding-history.md#one-listings-story)
- [Listing Page Blocks · Personal Bidding](../../../docs/prds/products/shared/ui/auction-listing.md#personal-bidding)
- [Auto-Bidding · Past Maximums](../../../docs/prds/products/grade10-site/auction/auto-bidding.md#past-maximums)

## Follow-on changes

- Refused maximum attempts on the lot **Your maximums** tab, with a safe reason
- Pagination or “show more” inside a tab if pane height proves insufficient
