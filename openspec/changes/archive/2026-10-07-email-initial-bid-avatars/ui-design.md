## Screens

### Lot detail - Recent Bids

Existing Storybook bid-card stories already paint varied avatar letters via
`ListingBidHistoryRow.initials`. No new frame. Production will pass the
email-derived character into that same prop; the readable label stays
Bidder N / You.

## Components

| Export | Role |
| --- | --- |
| `ListingBidHistoryList` | Draws the avatar from `row.initials` via `avatarInitial` |
| `ListingBidHistoryRow` | Carries `initials` (avatar source string); no new field or variant |
| `ListingAuctionBidCard` | Composes the public Recent Bids list |

No new design-system primitive, token, or i18n key.

## States

### Lot detail - Recent Bids

| State | Shows | Anchor |
| --- | --- | --- |
| Rival with lettered email | Avatar shows that letter; amount and time; no name or email | `grade10-site-auction-listing-page-SC-52` |
| Viewer row | Avatar shows the viewer's email letter; You badge; label not rewritten | `grade10-site-auction-listing-page-SC-52` |
| Missing or erased email | Avatar shows **B** | `grade10-site-auction-bidding-history-SC-53` |
| Live update adds a bid | New row avatar uses that bidder's letter without reload | `grade10-site-auction-listing-page-SC-53` |
