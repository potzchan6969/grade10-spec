## Screens

### Lot bid card — Your bidding dialog

Behavior: [auction-listing delta](specs/shared/ui/auction-listing/spec.md),
[bidding-history delta](specs/grade10-site/auction/bidding-history/spec.md).

- **Figma** — ❓ No auction-listing frame is recorded in Grade10-DS-2026 for
  this dialog (same gap as the other listing blocks). Stories are the review
  source until design supplies a frame.
- **Capability** — `shared/ui/auction-listing` (export contract);
  `grade10-site/auction/bidding-history` (who sees which rows)
- **Review surface** —
  [`Auction Listing/ListingUserBidHistory`](../../../packages/ui/src/blocks/auction-listing/listing-user-bid-history.stories.tsx)
  (approved Storybook: pill tabs, **Bid placed** / **Your maximums**, no
  sticky maximum summary)

### Account `/bids` — maximum event labels

No new screen. Existing combined chronology gains clearer maximum
set / raised / refused wording only. Layout unchanged.

- **Figma** — none for this copy-only pass
- **Capability** — `grade10-site/auction/bidding-history`
- **Review surface** — account bidding-history stories / preview as already
  composed for `/bids`

## Components

| Export | Role |
| --- | --- |
| `ListingUserBidHistory` | Lot personal-bidding entry + dialog. Widens to `maximumRows` + `bidRows`, two peer tabs, consumer `copy`. Renders nothing when both lists are empty. |
| `ListingUserBidHistoryProps` / `ListingUserBidHistoryCopy` | Prop and copy contracts; every user-visible string arrives through props. |
| `ListingUserBidHistoryRow` | Bid-sequence row: `amountLabel` + `acceptedAtMs` (optional `timeOverride`). |
| `ListingUserMaximumHistoryRow` | Maximum-history row: amount + time only (no Set / Raised). |
| `ListingAuctionBidCard` | Existing optional `recentBidsAccessory` hosts the entry beside public recent bids; unchanged public list. |
| `Link` | Dialog trigger (`sm`, secondary, button semantics). |
| `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogBody` | Modal shell; title + description stay fixed. |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | Peer panes. `TabsList` uses `variant="pill"` (Figma Tab List `6586:6340`). Tab order: bids, then maximums. Initial value: bids tab. |
| `Table`, `TableHeader`, `TableHead`, `TableBody`, `TableRow`, `TableCell` | One table per active tab; amount + time columns only. Table body scrolls; title, description, and tab list stay fixed. |

**Presentation (not a new requirement).** Empty bids copy uses the existing
`text-secondary-foreground` token (`Base/secondary-foreground`).

**Missing / flagged for `tasks.md`**

| Missing | Kind | Where |
| --- | --- | --- |
| Widen `ListingUserBidHistory` to two tab panes + dual row lists (current main is still the single-table dialog) | compound | `packages/ui/src/blocks/auction-listing/` |
| Export `ListingUserMaximumHistoryRow` | compound type | `packages/ui` + capability export requirement |
| Shared `auctionListing` copy keys for link/title/description/tabs/columns/empty bids; clearer `auctionBiddingHistory` maximum labels | copy | `packages/i18n` |
| Storybook / preview stories for both tabs, empty bids, raised maximums | stories | `packages/ui` / `apps/preview` |

No new design-system primitive, `TabsList` variant, or token. Pill tabs and
`secondary-foreground` already ship.

## States

| Surface state | Spec scenarios |
| --- | --- |
| Both lists present — opens on **Bid placed**; no sticky current-maximum summary; tab order bids then maximums | `shared-ui-auction-listing-SC-31`, `grade10-site-auction-bidding-history-SC-43` |
| Maximums only — still defaults to **Bid placed** with empty-bids copy; maximums tab lists caps | `shared-ui-auction-listing-SC-32`, `grade10-site-auction-bidding-history-SC-42` |
| No personal rows — link and dialog absent | `shared-ui-auction-listing-SC-33` |
| Long active tab — table body scrolls; title, description, and tab list fixed | `shared-ui-auction-listing-SC-34` |
| Raised maximums without refusals on the lot | `grade10-site-auction-bidding-history-SC-44` |
| Owner-only / public recent bids unchanged / reading inert | `grade10-site-auction-bidding-history-SC-45` |
| `/bids` chronology names maximum set, raised, refused | `grade10-site-auction-bidding-history-SC-46` |
