## Screens

No SPA or admin screen ships in this change. Collectors see these letters
in an inbox. There is no Figma frame for auction email; the layout’s
source of truth is the existing `AuctionEmail` used by every kind today.

Preview while implementing: the exhaustive render suite
`apps/backend/grade10/auction/test/db/email/render.spec.ts` (one fixture
per kind). `pnpm dev:email-demo` stays the login letter; auction letters
are product-owned and are not moved into that demo.

The storefront `/profile/alerts` page that watch-driven letters already
link does not exist yet (`docs/architecture/auction-gaps.md`). This change
does not add it.

## Components

No `@grade10/ui` or `@grade10/design-system` export is added or changed.
Inboxes do not load those packages.

| Piece | Export | Role |
| --- | --- | --- |
| Shared chrome | `BaseLayout` from `@grade10/email/render` | HTML shell + preview text. Already used by `LoginEmail` and `AuctionEmail`. |
| Auction letter | `AuctionEmail` in the auction service (not a public UI package export) | Heading, body, one listing `Button`, footer, optional unsubscribe `Link`. |
| Action control | `Button`, `Heading`, `Link`, `Section`, `Text` from `@react-email/components` | Same set `AuctionEmail` already uses. |

No new variant or token. A kind that cannot yet be expressed with heading /
body / button / footer would be work in this letter, not in grade10-spec
packages.

## States

Tied to [`grade10-auction/notifications`](specs/grade10-auction/notifications/spec.md).

| What the collector sees | Spec scenario |
| --- | --- |
| Start-soon letter, listing + start instant, unsubscribe | A watcher is told open bidding starts in 24 hours |
| Has-started letter, unsubscribe | A watcher is told open bidding has started |
| Close-in-24h letter, scheduled close; unsubscribe only if they never bid | A watcher is told open bidding closes in 24 hours; A participant who unwatched still hears the close |
| Extended-bidding letter, recorded close; unsubscribe only if they never bid | Extended bidding is announced once |
| Outbid letter, own amount + new lead, no unsubscribe | The previous leader is told they were outbid |
| New-bid letter, listing, no unsubscribe | An earlier bidder is told the lot received a new bid |
| Same heading / body / button / footer on two kinds | Two kinds share the layout |
| No letter | Start-soon is not sent when it would be false; Has-started is not sent when it would be false; A close or extension letter is dropped when bidding has stopped; Bid-activity mail is not sent after close |

There is no loading or empty inbox state to design: a letter is either
sent or it is not. Permanent provider failure is an operator parked-mail
row, not a collector-facing screen.
