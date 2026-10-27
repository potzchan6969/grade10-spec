## Goals

- A collector sees a product the shop publishes, takes down, reprices, sells out or brings back within seconds of the shop's own reads answering the change
- A collector at a location nobody has used yet gets the listing as fast as one at a warm location
- A collector keeps browsing the listing while the shop is unreachable

## Non-Goals

- A queryable index in the store's database; the step after this, when a catalogue outgrows one memory pass
- A copy cut to what a card draws; the copy carries whole products until it passes 1 MB
- Faster than the shop; the shop's report and its own reads are the floor
- A listing narrowed to a collection, the cart's review and checkout; they read the shop live, as they do
- Suggestions, a collection combined with facets, free text past the title; sibling changes and open decisions

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where does the catalogue copy live? | One Durable Object per shop, the one copy every location follows, applying each reported change and re-reading the whole catalogue every 5 minutes, as [Product Listing · Product Data](../../../docs/prds/products/grade10-site/store/product-listing.md#product-data) says and `The listing follows the shop within seconds` requires | A copy per location: each ages on its own clock, and a quiet location walks the whole catalogue on its first request |
| Q2 | What does the copy carry? | Whole products, so the grid, its count and its sidebar answer from it alone and never read the shop, per `The listing answers while the shop is unreachable` and SC-48 | A copy cut to what a card draws: the card, the count and the sidebar would age apart |
| Q3 | What catches a change the shop never reports? | The 5-minute re-read of the whole catalogue, per SC-52 | Trusting reports alone: a lost report would leave the listing wrong until the next edit |
| Q4 | Does the measurement of the shop's read lag, the Shopify topics a stock adjustment or a bulk publish fire, and the staging answer times block the change? | No: the deployed evidence is not needed - waived 2026-10-26 by @htonyl (`tasks_waived`); the page rows Listing answer time and Change to listing (product-listing.md lines 191-192) and the figure at `store-catalogue-index.md` stay marked unmeasured until someone measures them | Holding acceptance and archive on a staging deploy and the staging shop's admin |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/store/product-listing | The proposal's three open questions - whether a manual stock adjustment and a bulk publish fire `products/update`, and how long the shop's reads lag its report - need the dev shop and staging. | Q4 |
