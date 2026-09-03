# Tasks: auction email notifications

`add-auction-watchlist` must be deployed before group 4 can be verified: four
of the six messages fire on a watch.

## 1. Provider send errors (grade10)

Independent of groups 2–7.

- [ ] 1.1 Make `notifications-SC-21` and `notifications-SC-22` pass at the send seam: `@grade10/email` throws a typed permanent error on provider 4xx other than 429, and a normal throw on 429, 5xx, missing ids, and partial batches, without sleeping.
- [ ] 1.2 Run `pnpm run typecheck`, `pnpm run lint`, and the `@grade10/email` suite (`pnpm --dir packages/email test`).

## 2. Shared vocabulary (grade10)

- [ ] 2.1 Add `listing_opens_in_24h`, `listing_opened`, `listing_closes_in_24h`, `listing_extended`, and `listing_new_bid` to `AuctionPushKind` so `notifications-SC-18` has names both ports can carry; keep push claiming on the existing eight kinds.
- [ ] 2.2 Extend the listing shape the letter renders (`startsAt` and `scheduledEndsAt` beside the effective close) so `notifications-SC-06` and `notifications-SC-08` can name the instants the spec requires.
- [ ] 2.3 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`.

## 3. Stamps and send log (grade10)

Needs group 2 for the kind names the columns serve.

- [ ] 3.1 Add nullable `opens_in_24h_notified_at`, `opened_notified_at`, `closes_in_24h_notified_at`, `extended_notified_at`, and `new_bid_told_bid_id` on watches, plus `closes_in_24h_notified_at`, `extended_notified_at`, and `new_bid_told_bid_id` on bids for the participant fallback, and create `auction.mail_sends` per `tech-design.md`; generate and commit the Drizzle migration.
- [ ] 3.2 Run `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`.

## 4. Enrolment, fanout, and coalescing (grade10)

Needs groups 1–3.

- [ ] 4.1 Resolve a lot's enrolled collectors from its watches and its bids, making `notifications-SC-01`, `notifications-SC-03`, and `notifications-SC-04` pass.
- [ ] 4.2 Make `notifications-SC-05`, `notifications-SC-06`, `notifications-SC-07`, `notifications-SC-08`, `notifications-SC-09`, and `notifications-SC-10` pass through batched watcher lists (50 recipients, one rendering) that drop a false statement and stamp per chunk; close-soon and extended include bid participants with no watch, anchored to `scheduled_ends_at` / first extension.
- [ ] 4.3 Make `notifications-SC-11`, `notifications-SC-12`, `notifications-SC-13`, `notifications-SC-14`, `notifications-SC-15`, and `notifications-SC-16` pass: new-bid list after the existing outbid list, skip the live overtake still owed outbid, stamp `new_bid_told_bid_id` to the current leading bid, drop when the listing no longer takes bids.
- [ ] 4.4 Make `notifications-SC-02`, `notifications-SC-23`, `notifications-SC-27`, and `notifications-SC-28` pass: one copy however enrolled; drop-and-stamp when no longer biddable; suppress every unsent message from call-off; leave the one-hour ending-soon list in place and after these lists in `WORK_LISTS`.
- [ ] 4.5 Verify every scenario in this group through auction backend feature tests, including a lot whose close has moved.

## 5. Rendering and delivery (grade10)

Needs group 2. Claimable against the events from group 4. Auction emits; `@grade10/email` sends.

- [ ] 5.1 Make `notifications-SC-18`, `notifications-SC-19`, and `notifications-SC-20` pass by adding English copy branches for the five new kinds, keeping one template; `canUnsubscribe` true for start-soon and has-started; false for outbid and new-bid; close-soon and extended only when the recipient is a watcher who never bid.
- [ ] 5.2 Make `notifications-SC-17` pass, resolving the recipient by user id and sending to their registered account email.
- [ ] 5.3 Render money and times using the sent-message shapes in `money-amounts` and `dates-and-times`.
- [ ] 5.4 Verify the six rendered messages against those shapes, with amounts in more than one currency exponent.

## 6. ZZZ delivery (grade10)

Claimable against the events from group 4, independently of group 5. Same email library, ZZZ identity.

- [ ] 6.1 Send the same six messages to ZZZ collectors enrolled on a shared lot, resolving their registered address through the ZZZ identity boundary.
- [ ] 6.2 Verify the ZZZ delivery lane on a lot enrolled from both brands.

## 7. Operator send log (grade10)

Needs group 3.

- [ ] 7.1 Produce the admin send-log Figma frame named in `ui-design.md` and link it there.
- [ ] 7.2 Make `notifications-SC-24`, `notifications-SC-25`, and `notifications-SC-26` pass: type, sent-to email, listing, and Sent At; no body; distinguishing sent from attempted per `tech-design.md`.
- [ ] 7.3 Verify the admin auction feature lane.

## 8. Review (grade10)

Needs groups 4–7.

- [ ] 8.1 Run the application repository's full check suite once every group above is green.
- [ ] 8.2 Verify every scenario in this change, then run `openspec validate add-auction-notifications --strict` and `openspec validate --specs`.
- [ ] 8.3 Review message volume on a lot with two active maximums before staging, per `tech-design.md`'s snipe-war coalescing.
- [ ] 8.4 After rollout is confirmed, fold the accepted delta into `openspec/specs/grade10-auction/` and archive this change.
