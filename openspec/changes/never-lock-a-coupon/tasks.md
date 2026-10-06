## 1. Settle what the shop actually gave (grade10)

- [x] 1.1 A paid sale that does not carry the reward it promised gives it back inside the paid transaction, so the capture stops spending a coupon for a cut nobody gave and the surviving code dies with it
- [x] 1.2 A paid sale carrying a reward code its own order no longer claims is counted and reported with the order on it
- [x] 1.3 The till's own trim reaches a sale that expired before it was paid, which is every sale paid more than an hour after its plan
- [x] 1.4 A reward's code runs from the order's own creation, so the claim behind it always outlasts it — a refused mint that leaves a claim standing costs nothing, because a row with no code frees its coupon at settlement
- [x] 1.5 The stale-claim sweep outlasts the code minted for the claim

## 2. Supersede frees the coupon (grade10)

- [x] 2.1 The supersede pass reads the statuses a sale can still be paid from, so a counter sale the member walked away from is seen
- [x] 2.2 Its counter branch takes the claimed coupon off the sale and enqueues its release; the sale keeps its cart
- [x] 2.3 It answers which coupon it could not free, and the claim refuses by name rather than letting the programme say the coupon is unavailable
- [x] 2.4 The till runs the pass inside its own plan, holding the sale it is planning out of its own reach
- [x] 2.5 A plan survives its own supersede: the row being written is the survivor, not the newest draft
- [x] 2.6 The reward mint's write is keyed on the usage it was minted for, so a checkout that lost its claim cannot leave a live code behind
- [x] 2.7 A claim that loses the race retries once, so the racer's row is there to be superseded

## 3. Offer what can be spent (grade10)

- [x] 3.1 One status set names where a claim can be taken back, read by the supersede pass; the cart drawer's own read of it goes in 9.6
- [x] 3.2 A claimed coupon that lapses reads lapsed, in every surface at once
- [x] 3.3 The till panel offers every coupon that is not spent, lapsed or void

## 4. Make the counter honest (grade10)

- [x] 4.1 A dropped reward's code stops being handed back to the till
- [x] 4.2 A sale a reward has left mints no more reward codes, and says so in the counter's own words
- [x] 4.3 The plan result names the member's coupon, so the extension can say when it leaves
- [x] 4.4 A reward refusal reaches the till as a sentence rather than an empty code inside a translated one

## 5. Say the refusal (grade10, grade10-spec)

- [x] 5.1 The refusal has a cause of its own, and copy in every language the store speaks

## 6. Prove it (grade10)

- [x] 6.1 A coupon on an unfinished checkout is claimed by the next one, and the earlier order is cancelled with its code dead
- [x] 6.2 A counter sale keeps its cart and loses its claim when the member spends the coupon online
- [x] 6.3 A second till takes the coupon from the first
- [x] 6.4 The reveal succeeds where an online checkout holds the coupon, and does not kill the sale it is revealing into
- [x] 6.5 A claim is refused by name where the earlier checkout will not close
- [x] 6.6 A sale that collects a deactivated code spends the coupon once and reports the other; one that carries nothing gives it back
- [x] 6.7 End to end across both ledgers: redeem, claim, move, settle — the programme's own claim and settlement, not a fake

## 7. Say what changed (grade10, grade10-spec)

- [x] 7.1 The commerce and loyalty architecture docs stop describing the claim as a lock and the sweep as the floor under it
- [x] 7.2 The PRD pages carry what a member and a shopkeeper each read

## 8. Let the programme free the key with the claim (grade10, grade10-spec)

- [x] 8.1 A key answers only while its claim is live, so a sale that gave a claim back and asks again is answered rather than refused with a coupon sitting in the member's wallet
- [x] 8.2 A retry of a claim that still stands replays it, and a claim the shop already collected still refuses a second
- [x] 8.3 A counter sale that runs out its own clock gives its coupon back, the move the supersede pass already makes on one it ends
- [x] 8.4 A Coupon claim is written onto an order only by a guarded write that refuses to write over a live one; nothing carries it in on an insert's conflict arm
- [x] 8.5 The gift a claim promised is written where the claim ends, so a paid sale that carried a gift line the order had given up can still be read
- [x] 8.6 The release outbox stops claiming a job that has spent its attempts, and reports what is owed, what has stopped, and how old the oldest is

## 9. Give back what a retired counter sale holds (grade10)

- [ ] 9.1 Tests first: a counter sale retired by a checkout naming another coupon gives back the coupon it held, deactivates its code and keeps its cart, and its next plan asks for a new sale `grade10-site-loyalty-programme-SC-224`, `grade10-site-store-discounts-SC-24`
- [ ] 9.2 The supersede pass's counter branch gives back whatever reward the sale holds, `giveBackReward(order, null)`, and still answers whether the coupon this checkout names came free
- [ ] 9.3 Tests first: a coupon whose cancelled order has not yet given it back is claimed at the till rather than refused as unavailable `grade10-site-loyalty-programme-SC-227`
- [ ] 9.4 A claim the programme answers `not_available` first runs the unsettled releases of this member's dead orders carrying that coupon, then asks once more
- [ ] 9.5 Tests first: the cart drawer offers every coupon the member holds that is not spent, lapsed or void, among them one whose cancelled order has not yet given it back and one whose claim names an order never written, whatever that claim's age `grade10-site-loyalty-programme-SC-196`
- [ ] 9.6 The drawer offers every reward coupon the wallet quote returns, as the till panel does, and reads no orders to decide it: `spendableRewards` and its read of open orders go (`services/orders/quote.ts:263-293`)
- [ ] 9.7 Tests first, across both ledgers with the programme's own operation: a claim a checkout left when it stopped before its order was written is released and taken at the till and online once it is five minutes old, and a younger one is refused by name and not released `grade10-site-loyalty-programme-SC-231`, `grade10-site-loyalty-programme-SC-232`
- [ ] 9.8 The programme's `releaseUnwrittenClaim` releases a coupon's pending claim for an order id only where it is older than five minutes, and answers `too_recent` otherwise; a claim the programme answers `not_available` calls it where the wallet's `reservedForOrderId` names no store row, then asks once more, and refuses by name on `too_recent`, as the supersede pass does for a checkout that will not close; the promise's row write refuses a claim it made more than a minute before

## 10. Let a sale go on without its reward (grade10)

- [ ] 10.1 Tests first: after Remove every discount a points-only re-plan goes through and a reward applied again is refused naming a new sale; a till sale whose plan was refused after it claimed claims again on the next plan `grade10-site-store-discounts-SC-22`, `grade10-site-store-discounts-SC-17`, `grade10-site-loyalty-programme-SC-203`
- [ ] 10.2 The plan refuses `coupon_off_sale` only when it names a reward, and the till's sentence names a reward rather than this coupon
- [ ] 10.3 Tests first: a till sale a newer promise retired, and one that was paid, is refused on its next plan with a sentence that tells staff to ring the goods on a new sale, never to scan the card again `grade10-site-store-discounts-SC-24`, `grade10-site-store-discounts-SC-29`
- [ ] 10.4 `sale_closed`'s till sentence names a new sale rather than a fresh scan, for every closed sale alike (`integrations/shopify-pos/grade10/src/till/sentences.ts:45`)
- [ ] 10.5 Tests first: a fresh scan on a cart whose sale ran out its hour, or was retired, and still carries its reward code is refused with `sale_closed` and mints no code onto that cart `grade10-site-store-discounts-SC-27`
- [ ] 10.6 `PosSalePlanInput` gains `cartOrderId`, which the extension reads off the cart before it writes its own; `planTillSale` refuses `sale_closed` when it names a row of this member's that this session did not write, that is no longer `pending`, and that carries a reward's code; a `pending` row waits on Raised R1

## 11. Word the refusals (grade10-spec)

- [ ] 11.1 `checkout.refusal.held_elsewhere` in every locale the store speaks: "An earlier order still carries this promo code.", true of an order that took the money, one that could not be closed and one still being submitted
- [ ] 11.2 `checkout.refusal.idempotency_conflict` says the promo code was used on another order, not that it is held for another checkout, in every locale

## 12. Carry the refusal by name (grade10)

- [ ] 12.1 Tests first: a claim against an earlier checkout that will not close, or that the provider reports collected, reaches the checkout as `held_elsewhere` and never as `not_available` `grade10-site-loyalty-programme-SC-194`, `grade10-site-loyalty-programme-SC-200`
- [ ] 12.2 `CouponRefusalCause` gains `held_elsewhere`; `checkoutResult` carries it as its own cause rather than English detail inside `coupon_refused`, and the cart drawer and `/checkout` render its copy; the till plan maps `coupon_held_elsewhere` from that cause rather than from `SALE_HOLDS_IT`'s sentence (`services/pos/sale/sale.ts:659`), and the store's own `idempotency_conflict` sentence (`services/coupons/apply.ts:125`) says the coupon was used on another order
- [ ] 12.3 Move the spec submodule to the commit carrying group 11's copy
- [ ] 12.4 The till's `coupon_held_elsewhere` sentence says an earlier order of the member's still carries this coupon, with no advice to try again, since an order that took the money never lets it go (`integrations/shopify-pos/grade10/src/till/sentences.ts:48-49`)

## 13. Spend a coupon a paid sale carried (grade10)

- [ ] 13.1 Tests first, across both ledgers with the programme's own operation: a sale paid with a code it gave up spends the coupon nobody claims, a gift line is read like a code, and a sale whose coupon another sale claims spends nothing and the claiming sale spends it, in either order `grade10-site-store-discounts-SC-23`, `grade10-site-store-discounts-SC-25`, `grade10-site-store-discounts-SC-21`, `grade10-site-loyalty-programme-SC-195`
- [ ] 13.2 The programme's `spendCarriedCouponFor` moves an available coupon to used with an applied usage keyed on the order, in one transaction, without pricing it again; it refuses a coupon claimed, spent, lapsed or void, and replays its own applied usage
- [ ] 13.3 Settlement puts the carried coupon on the paid order's event, and the sink spends it through `spendCarriedCouponFor`; a refusal delivers the event and reports
- [ ] 13.4 `store.coupons.reward_double_ride` is tagged by whether the coupon was spent, and joins the commerce monitors as an alert on any
- [ ] 13.5 The commerce architecture doc says a sale paid with a code it gave up spends the coupon where it is free

## 14. Trace what is built (grade10)

- [ ] 14.1 The tests behind groups 1 to 8 cite the scenarios they prove, and a missing one is written `grade10-site-loyalty-programme-SC-190`, `grade10-site-loyalty-programme-SC-191`, `grade10-site-loyalty-programme-SC-192`, `grade10-site-loyalty-programme-SC-193`, `grade10-site-loyalty-programme-SC-196`, `grade10-site-loyalty-programme-SC-197`, `grade10-site-loyalty-programme-SC-198`, `grade10-site-loyalty-programme-SC-199`, `grade10-site-loyalty-programme-SC-201`, `grade10-site-loyalty-programme-SC-202`, `grade10-site-loyalty-programme-SC-204`, `grade10-site-loyalty-programme-SC-205`, `grade10-site-loyalty-programme-SC-225`, `grade10-site-loyalty-programme-SC-226`, `grade10-site-loyalty-programme-SC-228`, `grade10-site-loyalty-programme-SC-229`, `grade10-site-loyalty-programme-SC-230`, `grade10-site-store-discounts-SC-19`, `grade10-site-store-discounts-SC-26`, `grade10-site-store-discounts-SC-28`
- [ ] 14.2 The release outbox's give-up deadline outlasts the programme's sweep, held by the test that reads both clocks
- [ ] 14.3 The tests behind the forfeit count and the member's coupon list cite the scenarios that now name the coupon rather than its code, and a missing one is written, among them a code that dies with its sale counting no forfeit `grade10-site-loyalty-programme-SC-120`, `grade10-site-loyalty-programme-SC-148`, `grade10-site-loyalty-programme-SC-233`

## 15. Count what the measures read (grade10)

- [ ] 15.1 Tests first: a refused coupon's metric carries its cause and, for `not_available`, the standing that refused it, on both channels; a counter sale's give-back, at its hour or retired, is tagged when it freed a reward; a coupon spent within a day of a counter sale giving it back is counted, and one spent after an online order gave it back is not
- [ ] 15.2 The programme's `not_available` answer names the standing that refused it, `claimed`, `spent` or `not_live`; a refused coupon is counted with its cause and that standing, online on `store.checkout.outcome` and at the till on `store.pos.sale.refused`, so claims refused as unavailable for another claim read on `cause:not_available` and `standing:claimed`
- [ ] 15.3 A counter sale's give-back tags `store.pos.sale.expired` and `store.pos.sale.superseded` with `reward:given_back`; the programme's answer to a capture names the order whose claim on that coupon it released less than 24 hours before, and the store's sink counts `store.coupons.used_after_counter_release` when that order is a counter sale other than the paying one

## 16. The walk (grade10)

- [ ] 16.1 On staging, a member leaves an online checkout and a counter sale each holding a coupon, spends both coupons elsewhere, lets a counter sale run out its hour and pays it with its old code, and is refused by name where an earlier checkout will not close; then `/tcs-review never-lock-a-coupon`
