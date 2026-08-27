## 1. Provider send errors (grade10)

Independent of groups 2–7.

- [ ] 1.1 Make "A rate limit is retried" and "A refused address parks without burning the budget" pass at the send seam: `@grade10/email` throws a typed permanent error on provider 4xx other than 429, and a normal throw on 429, 5xx, missing ids, and partial batches, without sleeping.
- [ ] 1.2 Run `pnpm run typecheck`, `pnpm run lint`, and the `@grade10/email` suite (`pnpm --dir packages/email test`).

## 2. Shared vocabulary (grade10)

- [ ] 2.1 Add `listing_start_soon`, `listing_started`, `listing_close_soon`, `listing_extended`, and `listing_new_bid` to `AuctionPushKind` so "Two kinds share the layout" has names both ports can carry; keep push claiming on the existing eight kinds.
- [ ] 2.2 Extend the listing shape the letter renders (`startsAt` and `scheduledEndsAt` beside the effective close) so "A start letter states one zone" and the close-in-24-hours letter can name the instants the spec requires.
- [ ] 2.3 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`.

## 3. Stamps (grade10)

Needs group 2 for the kind names the columns serve.

- [ ] 3.1 Add nullable `startSoonNotifiedAt`, `startedNotifiedAt`, `closeSoonNotifiedAt`, `extendedStartedNotifiedAt`, and `newBidToldBidId` on watches, plus `closeSoonNotifiedAt`, `extendedStartedNotifiedAt`, and `newBidToldBidId` on bids for the participant fallback, satisfying at-most-once for every new letter; generate and commit the Drizzle migration.
- [ ] 3.2 Run `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`.

## 4. Shared letter copy (grade10)

Needs group 2. Parallel with group 3.

- [ ] 4.1 Make "Two kinds share the layout", "A letter that names an amount is not sent blank", and "A start letter states one zone" pass by adding English copy branches on `AuctionEmail` for the five new kinds, keeping one template; drive the render suite from the kind union as today.
- [ ] 4.2 Make "A start letter can be stopped" and "An outbid letter cannot be stopped" pass: `canUnsubscribe` true for start-soon and has-started; false for outbid and new-bid; close-soon and extended only when the recipient is a watcher who never bid.
- [ ] 4.3 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`.

## 5. Listing-lifecycle fanout (grade10)

Needs groups 1–4.

- [ ] 5.1 Make "A watcher is told open bidding starts in 24 hours", "A watcher added inside the 24-hour window still hears", "A watcher is told open bidding has started", "Start-soon is not sent when it would be false", "Has-started is not sent when it would be false", and "A non-watcher is not emailed at start" pass through a batched watcher list (50 recipients, one rendering) that drops a false statement and stamps per chunk.
- [ ] 5.2 Make "A watcher is told open bidding closes in 24 hours", "A participant who unwatched still hears the close", "Unwatching without a bid stops the close letter", "Extended bidding is announced once", "A close or extension letter is dropped when bidding has stopped", and "Watchers of one listing share one rendering" pass through close-soon and extended lists that include bid participants with no watch, anchored to `scheduledEndsAt` / first extension, without re-arming on a later extension.
- [ ] 5.3 Make "A close that landed under the send is not mailed late" and "A refused address parks without burning the budget" pass on these lists: drop-and-stamp when no longer biddable; park immediately on the permanent send error from group 1; leave the one-hour ending-soon list in place and after these lists in `WORK_LISTS`.
- [ ] 5.4 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`.

## 6. New-bid coalescing (grade10)

Needs groups 1–4. Independent of group 5 once those have landed; claim it after group 5 if one engineer is doing both, because both edit `WORK_LISTS`.

- [ ] 6.1 Make "The previous leader is told they were outbid", "An earlier bidder is told the lot received a new bid", "A snipe war does not mail every increment", and "Bid-activity mail is not sent after close" pass: new-bid list after the existing outbid list, skip the live overtake still owed outbid, stamp `newBidToldBidId` to the current leading bid, drop when the listing no longer takes bids.
- [ ] 6.2 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`.

## 7. Architecture docs (grade10)

Needs groups 5 and 6 for the lists it describes.

- [ ] 7.1 Update `docs/architecture/auction.md` so the mail table names the new kinds, audiences, 24-hour vs one-hour close, coalesced new-bid, and permanent-vs-transient parking; keep the existing receipts and ending-soon rows.
- [ ] 7.2 Update `docs/architecture/handbook.html` if the `@grade10/email` surface now exports the permanent error type.
- [ ] 7.3 Run `pnpm run check:handbook` when the handbook changed, plus `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run test:backend`.
