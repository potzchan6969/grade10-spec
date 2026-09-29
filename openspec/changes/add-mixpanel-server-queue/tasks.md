## 1. Outbox package (grade10) (owner: @ecchochan)

- [x] 1.1 Test the fold, the batch packing and the answer classification, and the outbox against pglite: frozen insert, no token, accepted, refused per record, an unnamed 400 split, retry on the ladder, 413 split, a refused fold split by `seq`, held profile passed by a later write, erasure `grade10-site-analytics-SC-48`, `grade10-site-analytics-SC-49`, `grade10-site-analytics-SC-50`, `grade10-site-analytics-SC-51`, `grade10-site-analytics-SC-52`, `grade10-site-analytics-SC-53`, `grade10-site-analytics-SC-54`, `grade10-site-analytics-SC-55`, `grade10-site-analytics-SC-56`, `grade10-site-analytics-SC-57`
- [x] 1.2 Add `@grade10/mixpanel/outbox` - table factory, writer, send pass, work list, erasure - and move `/api/track`'s tracker to `@grade10/mixpanel/ingest` `grade10-site-analytics-SC-48`, `grade10-site-analytics-SC-49`, `grade10-site-analytics-SC-50`, `grade10-site-analytics-SC-51`, `grade10-site-analytics-SC-52`, `grade10-site-analytics-SC-53`, `grade10-site-analytics-SC-54`, `grade10-site-analytics-SC-55`, `grade10-site-analytics-SC-56`, `grade10-site-analytics-SC-57`
- [x] 1.3 Answer `1` to `/engage` in the capture helper, and let it refuse named insert ids
- [x] 1.4 Verify: `pnpm --dir packages/mixpanel test`, `pnpm run check:handbook`

## 2. Vault adoption (grade10) (owner: @ecchochan)

- [x] 2.1 Test each vault send recorded with its transition, including verdicts the sweep settles, none on rollback, and erasure `grade10-site-analytics-SC-46`, `grade10-site-analytics-SC-47`, `grade10-site-analytics-SC-56`
- [x] 2.2 Add the outbox tables and the `mixpanel_outbox` migration; record every vault send and Identity Standing in its transaction and remove the direct sends; register the send list; erase with the user `grade10-site-analytics-SC-46`, `grade10-site-analytics-SC-47`, `grade10-site-analytics-SC-56`
- [x] 2.3 Verify: the vault package tests and the vault app's db lane

## 3. Loyalty adoption (grade10) (owner: @ecchochan)

- [x] 3.1 Test Reward Redeemed and the Member and Tier writes recorded with their facts, none on rollback, and an erasure that records the end of membership once `grade10-site-analytics-SC-46`, `grade10-site-analytics-SC-47`, `grade10-site-analytics-SC-56`
- [x] 3.2 Add the outbox tables and the `mixpanel_outbox` and `member_erased_at` migrations; record Reward Redeemed in the redemption and Member and Tier on enrolment, every tier change and the end of membership; remove the direct sends and the store's Member and Tier writes; register the send list `grade10-site-analytics-SC-46`, `grade10-site-analytics-SC-47`, `grade10-site-analytics-SC-56`
- [x] 3.3 Verify: the loyalty package tests and the loyalty app's db lane

## 4. Store adoption (grade10) (owner: @ecchochan)

- [x] 4.1 Test Order Paid in the drain's commit and once per order under one identity, Account Created with the order owner, Checkout Started with the payment refs, the counter sale, Member Identified, Wallet Pass, the cron pass with a token, erasure, and no token `grade10-site-analytics-SC-46`, `grade10-site-analytics-SC-47`, `grade10-site-analytics-SC-48`, `grade10-site-analytics-SC-56`, `grade10-site-analytics-SC-57`, `grade10-site-analytics-SC-58`
- [x] 4.2 Add the outbox tables and migrations for Grade10 and ZZZ, and the Order Paid mark; add the send pass to the cron; record every store send with its fact and remove the direct sends `grade10-site-analytics-SC-46`, `grade10-site-analytics-SC-47`, `grade10-site-analytics-SC-48`, `grade10-site-analytics-SC-56`, `grade10-site-analytics-SC-57`, `grade10-site-analytics-SC-58`
- [x] 4.3 Test two overlapping passes on real Postgres never send an older fold first `grade10-site-analytics-SC-54`
- [x] 4.4 Verify: the store package tests, both store apps' db lanes, and the store's `test/pg` lane

## 5. Auction adoption (grade10) (owner: @ecchochan)

- [x] 5.1 Test Auction Won, Invoice Paid, Card Linked, Lot Watched, Bid Placed and Bidder Outbid recorded with their facts, none on rollback, and erasure `grade10-site-analytics-SC-46`, `grade10-site-analytics-SC-47`, `grade10-site-analytics-SC-56`
- [x] 5.2 Add the outbox tables and the `mixpanel_outbox` migration; record every auction send in its fact's transaction and remove the direct sends; register the send list `grade10-site-analytics-SC-46`, `grade10-site-analytics-SC-47`, `grade10-site-analytics-SC-56`
- [x] 5.3 Verify: the auction package tests and the auction app's db lane

## 6. Operations (grade10) (owner: @ecchochan)

- [x] 6.1 Test: `check-best-effort` finds no unmarked `waitUntil` above the lowered baseline
- [x] 6.2 Lower the baseline, describe the outbox in `docs/architecture/tracking.md`, and name the held, oldest-age and no-data monitors in `docs/operations.md`
- [x] 6.3 Verify: `pnpm run check:libs`, `pnpm run check:handbook`

## 7. Walk the suite (grade10-spec)

- [ ] 7.1 Review `feature-tcs.md` with `/tcs-review add-mixpanel-server-queue`, flip the cases the tests decide with `pnpm run tcs:automated`, and name in `rounds.md` the cases that stay walked by hand: arrival within the sweep bound, an outage of hours, and the held alarm firing
- [ ] 7.2 Verify: `pnpm run tcs:validate`
