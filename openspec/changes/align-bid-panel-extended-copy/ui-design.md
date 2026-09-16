# UI: align bid panel extended copy

Behavior:
[shared/ui/auction-listing delta](specs/shared/ui/auction-listing/spec.md).
This change does not redraw the bid panel. It updates the consumer-owned Time
left explanation string and the extended label the application passes in.

## Screens

### Listing bid panel — Time left explanation

- **Surface** — Storybook `Auction Listing/ListingAuctionBidCard` →
  **ExtendedBidding**; Preview `Auction Listing/Bid Panel/Flows` →
  **Countdown** (extended cases)
- **Capability** — `shared/ui/auction-listing`

**Time left (extended)** when `view.extended` is on. Info tooltip:

> After the scheduled close, each bid restarts a {duration}-minute timer.
> Bidding ends when the timer runs out with no new bid, up to the listing cap.

Layout and ⓘ placement unchanged.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `ListingAuctionBidCard` | `@grade10/ui` | Existing; renders `copy.timeLeftAutoExtended` and `copy.autoExtendedTooltip` |
| `formatAutoExtendedTooltip` | `@grade10/ui` | English stand-in for demos |

No new export, variant, or token. No new Figma component set.

**Missing / flagged for `tasks.md`**

| Missing | Kind | Where |
| --- | --- | --- |
| · | · | None — copy and Storybook only |
