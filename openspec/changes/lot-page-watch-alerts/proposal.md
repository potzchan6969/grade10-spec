**Author:** @tangconst - 2026-09-10

Product context: [Listing Details](../../../docs/prds/products/grade10-site/auction/display.md#auction-details),
[My Auctions](../../../docs/prds/products/grade10-site/auction/bidding.md#my-auctions-watchlist-and-notifications).

## Why

A collector on a lot page can watch and unwatch, but the control does not
say what that means for email alerts, and a collector who has already bid
can still treat Watch as optional even though a bid bookmarks the lot.
They learn about alerts only after the fact — or try to unwatch a lot they
cannot leave.

**Metric:** watch → My Auctions reach (toast CTA) and bid-lot mute rate on
My Auctions (collectors who stay enrolled after the once-per-lot alerts
toast). **Acceptance signal:** no-bid Watch/Unwatch toasts match My Auctions
tone (alerts on + **View My Auctions**; unwatch + Undo); a bid locks Watching
disabled and shows the alerts-on toast once per lot for that collector.

## What Changes

- **No bid — Watch / Unwatch.** The lot-page control toggles watch. Watch
  announces email alerts on for the lot, with toast action **View My
  Auctions**. Unwatch announces the reverse (alerts off / left the list) with
  Undo, same pattern as My Auctions Unwatch.
- **Bid locks Watching.** A collector who has bid on the lot is auto-
  watching it. The control shows disabled **Watching** and does not
  unwatch. Grade10 announces email alerts on for that lot **once per
  listing per collector**, recorded on the account (survives devices), at
  the moment the bid bookmarks the lot — later visits stay quiet.
- **Closed lots hide Watch.** Sold, unsold, or any other close: no watch
  control on the lot page.
- **Shared `WatchButton`.** When the application says the control is locked
  (bid stands), it shows Watching disabled and does not report press.
  Optional confirmation copy + action label for watch/unwatch toasts when
  the application supplies them — same content-ownership rule as email-
  alerts toasts on the row.
- Aligns with in-flight `redesign-my-auctions-table`: Unwatch only without
  a bid. Archive order: fold that change's account-record Unwatch rule
  before or with this one so SC-13 does not flip twice.

## Non-Goals

- Changing mail kinds, mute semantics, or the account auction email-alerts
  master (`add-account-notifications`).
- Showing the once-per-lot bid toast again after the collector clears
  storage or switches browsers when the account already recorded it.
- Catalogue watch control beyond what account-record already requires
  (this change’s toast copy is specified for the lot page; catalogue may
  reuse the same product rules later).
- Redesigning My Auctions table layout (that is `redesign-my-auctions-table`).
- ZZZ lot page.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/listing-page`: lot-page Watch / Watching states,
  watch and unwatch toasts, bid-locked control, once-per-lot bid alerts
  toast on that page’s surface.
- `grade10-site/auction/account-record`: watch/unwatch announcements and
  Undo; once-per-lot bid alerts toast owned on the account. Unwatch refused
  while a bid stands is carried by `redesign-my-auctions-table`'s block on
  the same requirement, so the two changes do not both fold it.
- `shared/ui/auction-record`: `WatchButton` locked Watching; optional
  watch/unwatch toast copy with action label.

## Impact

- `packages/ui` `WatchButton` props/copy; Storybook lot / WatchButton
  stories; `packages/i18n` auction watch toast strings.
- Grade10 site lot details wiring and account watch/bid bookmark writes.
- Overlaps `redesign-my-auctions-table` (Unwatch only without bid) and
  `add-account-notifications` (alerts default on with watch/bid).

## Open questions

None — timing (toast on bid bookmark, once, account-persisted), Unwatch
toast with Undo, and **View My Auctions** CTA settled with the author.
