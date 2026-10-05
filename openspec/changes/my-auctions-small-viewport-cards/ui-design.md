# UI: My Auctions small-viewport cards

Layout SoT for phone widths: Storybook
**[Auction Card](?path=/story/my-auctions-auction-card--leading)**
(`AuctionRecordRow` `presentation="card"`, one story per variant). Page
composition:
**[Filled — small viewport](?path=/story/my-auctions-my-auctions--filled-small-viewport)**
and **Pages/Auction/My Auctions Page**. Desktop table remains Figma
`Auction Watchlist` (`6507:5463`). Figma card component:
[`AcutionRecordCard`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7005-1676)
(`7005:1676`).

## Screens

### My Auctions — small viewport

::story{id="pages-auction-my-auctions-page--default" title="My Auctions"}

Below `md`: breadcrumbs, title + count badge, then a vertical list of lot
cards. No sideways scroll of the lot list. From `md`: existing five-column
table.

### Auction card (small viewport)

::story{id="my-auctions-auction-card--leading" title="Leading"}

Isolated card variants under **My Auctions / Auction Card**: Leading, Outbid,
Watching, Ended, Didn’t win, Hold releasing, Awaiting Setup, Pending Payment.
Same export as the list rows below `md`.

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `AuctionRecord` | `@grade10/ui` | Dual surface: card list below `md`, table from `md` |
| `AuctionRecordRow` | `@grade10/ui` | Shared facts; table row from `md`; `presentation="card"` below `md` |

No new design-system primitive. Column copy labels reuse as card fact labels.

## Card anatomy (below `md`)

| Zone | Treatment |
| --- | --- |
| Card | Border, `rounded-2xl`, `p-2`; stacked with `gap-3` between cards; whole card navigates via `href` (Winner Order or listing); Unwatch and Email alerts stay separately tappable |
| Identity | `size-14` (max 56px) thumb with `rounded-md` + Status badge (when labelled) + title + close / detail (`text-xs` secondary); thumb uses `object-contain` |
| Bid | Inline `Current Bid: {amount}` (`text-xs`; amount medium) — no separate Status column |
| Footer | Top border; Unwatch (`Link` error `xs`) or View order / Setup (`Link` `xs`) left; Email alerts label + Switch right |

## States

| State | Shows | Anchor |
| --- | --- | --- |
| Filled, small viewport | Card stack; bid lots first; whole card opens `href`; alerts + Unwatch / View order stay separately tappable | `shared-ui-auction-record-SC-17`, `SC-19` |
| Filled, from `md` | Existing table unchanged | `shared-ui-auction-record-SC-08`, `SC-18` |
| Empty | Page empty state (unchanged) | **Out of suite:** existing empty scenarios unchanged by this change |
