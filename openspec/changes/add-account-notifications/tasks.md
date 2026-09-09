# Tasks: account notifications (auction email)

Watching with email alerts must exist before group 4 progress mail can be
verified. This change absorbs archived
`add-auction-notifications` (`openspec/changes/archive/2026-09-09-add-auction-notifications/`);
My Auctions mute UI remains on `add-auction-watchlist`.

## 1. Provider send errors (grade10) (owner: @mason5991)

Independent of groups 2–8.

- [x] 1.1 Make `grade10-site-auction-notifications-SC-21` and `grade10-site-auction-notifications-SC-22` pass at the send seam: `@grade10/email` throws a typed permanent error on provider 4xx other than 429, and a normal throw on 429, 5xx, missing ids, and partial batches, without sleeping.
- [x] 1.2 Run `pnpm run typecheck`, `pnpm run lint`, and the `@grade10/email` suite (`pnpm --dir packages/email test`).

## 2. Shared vocabulary (grade10) (owner: @mason5991)

- [ ] 2.1 Add `listing_opens_in_24h`, `listing_opened`, `listing_closes_in_24h`, `listing_extended`, and `listing_new_bid` to `AuctionPushKind` so `grade10-site-auction-notifications-SC-18` has names both ports can carry; keep push claiming on the existing eight kinds.
- [ ] 2.2 Extend the listing shape the letter renders (`startsAt`, `scheduledEndsAt`, and optional `primaryImageUrl` beside the effective close) so `grade10-site-auction-notifications-SC-06`, `grade10-site-auction-notifications-SC-08`, `grade10-site-auction-notifications-SC-29`, and `grade10-site-auction-notifications-SC-30` can name the instants and show or omit the lot picture the spec requires.
- [ ] 2.3 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`.

## 3. Stamps, mute prefs, and send log (grade10)

Needs group 2 for the kind names the columns serve.

- [ ] 3.1 Add nullable `opens_in_24h_notified_at`, `opened_notified_at`, `closes_in_24h_notified_at`, `extended_notified_at`, and `new_bid_told_bid_id` on watches, plus `closes_in_24h_notified_at`, `extended_notified_at`, and `new_bid_told_bid_id` on bids for the participant fallback; add `email_alerts` (default true) on watches and the bid-only mute path; add account auction email alerts master storage; create `auction.mail_sends` per `tech-design.md`; generate and commit the Drizzle migration.
- [ ] 3.2 Run `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`.

## 4. Enrolment, fanout, and coalescing (grade10)

Needs groups 1–3.

- [ ] 4.1 Resolve a lot's enrolled collectors from its watches and its bids with `email_alerts` and account master on, making `grade10-site-auction-notifications-SC-01`, `grade10-site-auction-notifications-SC-03`, `grade10-site-auction-notifications-SC-04`, `grade10-site-auction-notifications-SC-32`, and `grade10-site-auction-notifications-SC-33` pass.
- [ ] 4.2 Make `grade10-site-auction-notifications-SC-05`, `grade10-site-auction-notifications-SC-06`, `grade10-site-auction-notifications-SC-07`, `grade10-site-auction-notifications-SC-08`, `grade10-site-auction-notifications-SC-09`, and `grade10-site-auction-notifications-SC-10` pass through batched watcher lists (50 recipients, one rendering) that drop a false statement and stamp per chunk; close-soon and extended include bid participants with no watch, anchored to `scheduled_ends_at` / first extension.
- [ ] 4.3 Make `grade10-site-auction-notifications-SC-11`, `grade10-site-auction-notifications-SC-12`, `grade10-site-auction-notifications-SC-13`, `grade10-site-auction-notifications-SC-14`, `grade10-site-auction-notifications-SC-15`, `grade10-site-auction-notifications-SC-16`, and `grade10-site-auction-notifications-SC-31` pass: new-bid list after the existing outbid list, skip the live overtake still owed outbid, skip a leader whose maximum still holds, stamp `new_bid_told_bid_id` to the current leading bid, drop when the listing no longer takes bids.
- [ ] 4.4 Make `grade10-site-auction-notifications-SC-02`, `grade10-site-auction-notifications-SC-23`, `grade10-site-auction-notifications-SC-27`, and `grade10-site-auction-notifications-SC-28` pass: one copy however enrolled; drop-and-stamp when no longer biddable; suppress every unsent message from call-off; leave the one-hour ending-soon list in place and after these lists in `WORK_LISTS`.
- [ ] 4.5 Verify every scenario in this group through auction backend feature tests, including a lot whose close has moved.

## 5. Rendering and delivery (grade10)

Needs group 2. Claimable against the events from group 4. Auction emits; `@grade10/email` sends. English only this change.

- [ ] 5.0 Produce the shared auction-letter Figma frame set named in `ui-design.md` (chrome + six bodies, one primary lot image) and link it there.
- [ ] 5.1 Make `grade10-site-auction-notifications-SC-18`, `grade10-site-auction-notifications-SC-19`, `grade10-site-auction-notifications-SC-20`, `grade10-site-auction-notifications-SC-29`, and `grade10-site-auction-notifications-SC-30` pass by adding English copy branches for the six kinds on the shared emailcn / React Email template; optional English `@grade10/i18n` keys with locale selection forced to English; `canUnsubscribe` true whenever per-lot email alerts are on (progress and bid-activity); footer CTA **Turn them off** (after “Email alerts are on for this lot.”) → signed-in My Auctions mute; lot block shows one primary image when present and omits it when absent.
- [ ] 5.2 Make `grade10-site-auction-notifications-SC-17` pass, resolving the recipient by user id and sending to their registered account email.
- [ ] 5.3 Render money and times using the sent-message shapes in `money-amounts` and `dates-and-times`.
- [ ] 5.4 Verify the six rendered messages against those shapes (including preheader and lot image), with amounts in more than one currency exponent, using React Email `email dev` for authoring preview.

## 6. My Auctions mute and account master (grade10)

Needs group 3. Owns the mute UI that replaces the older watchlist My Auctions alerts surface.

- [ ] 6.1 Make `grade10-site-auction-watchlist-SC-01`, `grade10-site-auction-watchlist-SC-02`, `grade10-site-auction-watchlist-SC-18`, and `grade10-site-auction-watchlist-SC-19` pass on My Auctions: per-row Email alerts; mute leaves the watch; unwatch turns alerts off; Bidding rows carry Email alerts without Unwatch.
- [ ] 6.2 Ship Account → Notifications with the auction email alerts master only (no inbox, no channel toggles); master off suppresses fanout and shows per-lot toggles off or disabled per `ui-design.md`.
- [ ] 6.3 Verify Storybook / preview states named in `ui-design.md` (`Email alerts muted`, `Email alerts pending`, `Email alerts master off`).

## 7. Operator send log (grade10)

Needs group 3.

- [ ] 7.1 Produce the admin send-log Figma frame named in `ui-design.md` and link it there.
- [ ] 7.2 Make `grade10-site-auction-notifications-SC-24`, `grade10-site-auction-notifications-SC-25`, and `grade10-site-auction-notifications-SC-26` pass: type, sent-to email, listing, and Sent At; no body; distinguishing sent from attempted per `tech-design.md`.
- [ ] 7.3 Verify the admin auction feature lane.

## 8. Manual and review (grade10-spec + grade10)

Needs groups 4–7.

- [ ] 8.1 Update the auction notifications (and watchlist alerts) pages under `docs/prds/` for this change; run `pnpm check:manual` in the store.
- [ ] 8.2 Run the application repository's full check suite once every group above is green.
- [ ] 8.3 Verify every scenario in this change, then run `openspec validate add-account-notifications --strict` and `openspec validate --specs`.
- [ ] 8.4 Review message volume on a lot with two active maximums before staging, per `tech-design.md`'s snipe-war coalescing.

## Remarked for a later change (not this task list)

- Enable account-locale rendering for the six kinds.
- Migrate the eight bid-state / ending-soon kinds onto this spine.
- In-app notification center, shell badge, in-app toggler, global channel toggles.
- ZZZ delivery of the six kinds.
- Account deletion / retention for send log and mute prefs.
