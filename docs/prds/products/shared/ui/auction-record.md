---
title: Auction Record Blocks
spec: shared/ui/auction-record
order: 9
---

Blocks make the account's auction record, written once and composed by every
application that shows it. What the record means — the states, the ordering,
the privacy — is [My Auctions](/p/grade10-site/auction/account-record); this
capability is the component contract underneath it.

## The Blocks

- **Page frame** — the title with its badge, whose number is the count of
  rows the application supplies
- 🚧 **One table** — bid rows before watch-only, replacing the Bidding and
  Watching sections; a row is Auction (image, title, close), Current Bid,
  Your Standing (a badge, or the application's no-standing placeholder),
  Email alerts, and Unwatch only when the application supplies a watch toggle
- **Tabs** — Active, Upcoming and Ended, filled by the application
- **Empty state** — one, for a collector who bookmarks nothing
- **Watch control** — marks a lot wherever it is shown; each block renders
  on its own, so a lot page takes the watch control without adopting the
  frame
- 🚧 **Locked watch control** — with a bid standing on the lot it shows the
  watching label, disabled, and reports no press
- 🚧 **Watch confirmations** — the control announces only after the
  application has changed the value, and exposes the action the copy names:
  View My Auctions on watch, Undo on unwatch

## Ownership

- **No product state** — what lot, what standing, what was paid and what was
  released arrive as props the application resolved
- **Every string through props** — the copy group carries the fact labels and
  the wording of an email-alerts confirmation
- **Reports, never acts** — a press is reported through its callback, so
  watching, muting, tab changes and retries stay the application's writes
- **Confirms after the write** — the row announces a mute only after the
  application has changed the value it was given, so the confirmation cannot
  outrun the write, and one row's switch never moves another's

:::detail{title="Code map" for="engineer"}
- **Blocks** — `AuctionRecord`, `AuctionRecordRow`, `AuctionRecordEmpty`,
  `AuctionRecordTabs` and `WatchButton`, in `packages/ui`
- **Retiring** — `WatchingList` and `BiddingList`, with the one-table
  redesign
:::
