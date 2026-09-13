## Context

`packages/loyalty/backend/src/services/rewards` issues a coupon with today's flat-amount default; `packages/grade10-store/backend/src/services/coupons` prices and applies whatever definition a coupon carries. This change gives the reward its real definition shape and unifies physical-reward settlement onto the coupon mechanism. Two of its decisions turn on state owned by `mint-coupons-as-discount-codes`, a sibling change also under review, so they are pinned here rather than left to an implementer's inference.

## Decisions

**A reward's coupon lives in loyalty's own tables, never `grade10-store`'s `coupons` table.** `packages/loyalty/backend/src/services/rewards/coupons.ts`'s `couponInstances`/`couponUsages` are entirely separate from `packages/grade10-store/backend/src/db/schema/coupons.ts`; a reward is redeemed and held inside loyalty alone, reached from the store only through `orders/promise.ts`'s `reserveRewardCoupon()` calling the `CouponTender` port. So nothing in `mint-coupons-as-discount-codes`' own coupon-table work touches a reward. What this change depends on from that one is its mint machinery: every coupon's Shopify Discount code is minted when an order claims it, and a reward's code is recorded on the `orders` row beside the `loyaltyCoupon*` columns already there.

**Retiring counter collection depends on a reward coupon being able to reach a till at all, and today none can.** Verified on every leg: `posSalePlanInputSchema` is `{lines, couponCodes, points}` with no `couponId`; `planTillSale` forwards none; `promise.ts` returns `NO_REWARD` without one; the panel's coupons come from `posCouponReader` → `listSpendableCoupons` over the store's own registry, never the member's loyalty wallet; `couponInstances` has no code column, so there is nothing to type; and the tender adapter hardcodes `channel: "online"`, which loyalty's `useCoupon` checks against the definition's channels. `pos/sale/sale.ts` says it outright in a comment: "A till only ever names registry codes: it tenders no wallet Coupon." Group 4 builds that path: `posSalePlanInputSchema` gains a `couponId`, `planTillSale` forwards it, the panel lists loyalty's `memberCoupons` beside the registry's, and `CouponTender.reserve` takes the channel. Alternative considered: have only the member present the coupon, so the till never names one; rejected, because an identified till session already authorises staff to spend the member's points from the panel, and a reward coupon is no more sensitive than points.

**Staff applying a coupon and the member presenting one are the same act: a plan on the till session.** A till session already exists by the time a coupon is wanted — staff identified the member, which opens the session and attaches the member to the cart. Staff clicking a coupon in the panel is a plan carrying that coupon's id, exactly as Apply carries points today. The member opening a coupon in their own session while a till session is open is the same plan on the same session, made server-side. Both go through `planTillSale` → `upsertPromisedOrder`, so both land on the one standing order row the session already has, and both mint the code at once through `mint-coupons-as-discount-codes`' `mintOrderCodes`, which reuses the `orders` row's code columns on every later plan. Neither path redeems a reward at the till; both spend one the member already holds.

The session holds the chosen benefits server-side. A plan adds to or removes from what the session already carries rather than replacing it, so staff applying points after the member presented a coupon does not drop the coupon off the row while its code stays on the cart. Both paths are offered only once the member is attached to the cart, since a customer-scoped code refuses until then; the staff sentence says so.

The member's presentation follows `mintPosHandle`'s existing shape — a QR with a short code beneath it — but its content is the minted code itself, in the form Shopify POS scans natively (`https://{shop}.myshopify.com/discount/{CODE}`, POS 11.5 and later). The extension does not see that scan: `host.onScan` is registered only while the modal is open and routes every payload to `till.identify`. Nothing has to adopt the code afterwards, because it was minted onto the session's row before it was shown, and settlement corroborates by the code on that row. The one-time guard is the code's own `usageLimit: 1` plus its customer scope, which is what release gates 1, 5 and 10 test.

**The wallet stays where the coupons are; the store owns only the act at a counter.** The member's list of coupons — what each is for, how long it lives, what became of it — already runs on the membership page from loyalty's `me.coupons`, which is where a coupon lives. `packages/grade10-store/frontend/src/features/account/` gains the half only the store can answer: whether a till has this member's session open with them on the sale, and the code minted for that sale. A second list in the store would be a second answer to a question loyalty already answers. The two meet in the app, which is where an assembly belongs: the membership page hands the loyalty list a per-row action the store's slice drives. The square and the code beneath it are `@grade10/ui`'s `ScanPlate`, lifted out of the member card, which was the same object — something to hold up, and something to read out when the scanner will not.

**A physical reward names the variant it hands over, and issuing its coupon is what settles it.** A `collect_in_store` reward's config gains a `variantId`, required at the catalog write, and redeeming it issues a coupon taking the whole of that variant off an in-store sale: 100% against a `variants` target, living as long as the collection window it replaces, which is the term the menu already discloses. The redemption is fulfilled the moment that coupon exists — nothing is owed at a counter and no collection record is written. A reward stored before this names no variant and still parks, which is why the queue and the confirm action stay until 3.2; nothing new joins them, so the count converges. The console's reward form sends no fulfilment back for a type it does not write, so renaming one of those stored rewards is not refused by a rule written after it.

**Collection stays until that path is verified.** Task 3.2 deletes the till's collection-confirm action, the fulfilment queue, and `waitingCollections` — which is also the only list of who is owed an item. It waits on three things: the till path above, release gates 1, 5 and 10 from `docs/references/shopify-membership-pos.md` recorded with date and tester (a customer-scoped `usageLimit: 1` code applying at tender after the customer is attached; two terminals unable to both complete one code; whether a deactivated code is revalidated at tender), and `select count(*) from redemptions where state='issued' and fulfillment_state='awaiting_collection'` reading zero, which task 3.1 makes reachable within one collection window. A row that lapses in the meantime is remedied by the operator reversal that already exists, which returns the points.

**The staff-assisted notification fires where the counter's claim becomes what the sale carries.** That is the paid order online, and at the till the trim-to-what-landed pass of `discounts.md` step 9 — never while staff are still applying, which a member could watch them undo. Step 9 runs before tender and before settlement, so what it reports is a claim the shop has not priced yet: that is why a correction exists, not a reason to wait. A sale that never reaches the pass told the member nothing and sends nothing.

**The notice is an outbox row, written in the settlement's own transaction.** `store.member_notices` holds **one row per order**, never one per message, and the last writer wins while nobody has read it. The trim pass reports a claim the shop has not priced, so its numbers are the promise; the paid order seconds later carries what was honoured. First-writer-wins would send the promise and drop the truth — a shop that honoured half would buzz the member with the whole — and the drain runs every five minutes, so the truth is almost always known before the notice leaves. Once it has been read the row stands: a second buzz about one sale is the stack of contradictions this outbox exists to prevent, and `delivered_at` is the whole of that rule. A correction keeps the numbers the member read rather than reading them again: by then the benefit is back, so the order says they saved nothing, which is true and is the wrong thing to say in a message about what they were told they saved. A notice nobody has read yet is withdrawn instead — a member never told a spend landed has nothing to be told back. Sending is a network call and settling is not, so the two are held apart and a push service that is down never costs a member their sale; the cron drains the row beside the auction's push pull.

**The member is told it is back exactly where it comes back.** `canceled` and `failed` are the two transitions that release the points and kill the mints, and the retraction shares that one predicate rather than keeping a list beside it. `expired` is not one of them: it says this store stopped polling, not that the sale is over — the points stay held, the codes stay live, and `expired → paid` is legal — so an expired sale keeps the notice that says a spend landed, because one did. A refund is not a correction either: that sale landed, the member was told so truthfully, and money coming back is its own news.

**What the notice says is the member's own benefit, never the counter's.** The money is their points plus their coupons' own cut rows plus their reward's evaluation — not `order_items.discount_minor`, which is where a till's claimed staff discount and a coupon's cut are added together and can no longer be told apart. Telling a member they saved what staff gave away is the one thing a receipt of somebody else's act may not do. The coupons answer through `coupon_mints.amount_minor` — the cut a coupon actually made against the basket that claimed it, one row per coupon, dead the moment the ride is dropped — so a code the till never reported and a fixed coupon the basket was too small for both read honestly, which neither the registry's face value nor the line's own column can do. A gift takes no money off and is still the thing a member most wants to hear was handed over, so the row carries it as its own fact. The payload carries data and no words: the kind, the order, the points, the money, whether a gift was handed over, and the currency, with the sentences built by whichever storefront renders them. Never the code — a bearer string on a device — and never the till: no storefront has words for a location id, and the page a click lands on names the shop from the member's own activity. The row keeps the claim for whoever has to ask which counter it was.

**A refunded sale does not return the coupon.** The coupon stays used and the points it cost stay spent — the terms `SC-141` already sets for every coupon reward, now reaching a physical item because one can leave the shop and come back. Points the member spent as a discount on that same order are returned, which the refund path already does through `returnSpend`; the two movements are separate and only the coupon is lost. Recorded as an accepted loss, not a gap: building the alternative means a new `returned` state on `couponUsages` reachable from `applied`, since `settleCouponUsage` refuses any usage that is not `pending`.

## Risks / Trade-offs

- **A send is not covered by the claim's lock.** The claim is one autocommitting UPDATE, so the row is free for the whole round-trip and a writer can rewrite it underneath. The writes that follow a send are pinned to `attempts`, which the claim already returns and a rewrite resets, so they land on the notice that went out and on nothing else; a miss is counted and logged, and the rewrite has already re-armed the row for the next pass. A cancel landing inside that same round-trip still sends a notice nothing can unsend — no code recovers a push already on the wire.
- **A worker deployed before this change throws on a spend payload.** A service worker outlives every page, so the member running last month's build is the ordinary case rather than the edge. The reader dispatches on the `spend_` prefix and falls back to generic words for a kind it has never heard of, which is what keeps a store that learns to say something new from spending the browser's "updated in the background" notice — goodwill `userVisibleOnly` grants once per push. A build older than the spend reader itself has no such fallback and will show that notice until the browser updates it.
- **The concurrent-double-handover guard is loyalty's own, not a Shopify one.** `useCoupon`'s conditional `available → reserved` update and the real partial unique index `uq_coupon_usages_live` on `couponId` let exactly one reservation through, and `settleCouponUsage` marks the instance `used` at the same moment a `usageLimit: 1` code is consumed. So task 3.1 — issuing a physical reward as a coupon at all — is what carries the guard; the minted code adds no second one. `coupon_mints`' `(orderId, couponId)` uniqueness does not close a cross-order race and is not credited with doing so.
- **A window the codebase documents in its own source stays open**: `services/loyalty/sink.ts` records that loyalty's stale-reservation sweep can release a coupon while its order is still payable, so the coupon returns to the wallet and the order later pays. Today that costs a double weld; after this change the second instrument is a code rather than an abandoned invoice. Not created here and not closed here — bounded instead by the mint's own 24-hour `endsAt`, which matches the sweep's horizon.
- **The presentation path is new member-facing surface.** `packages/grade10-store/frontend/src/features/account/` holds card, identity, notifications and profile, and no coupon surface — so the member's wallet and its presentation are built by this change, not inherited.
- **A reward coupon at the till inherits the one-code limits of `mint-coupons-as-discount-codes`.** A code can only be cleared by "Remove every discount", and a re-plan whose cut has changed refuses the coupon rather than minting a second code. Staff read the same sentences for a reward coupon as for a product coupon.
- **Retiring `waitingCollections` removes the only enumeration of outstanding handovers**, which is why 3.2's zero-row precondition is a literal check rather than a note.

## What staging showed

A counter sale on the staging shop, rung up from the admin's till against the
real shop, told the member what it honoured and nothing else.

The member spent 100 points on a HK$780 box while the shop ran its own 5% off.
The shop priced the sale at HK$641 and named both cuts: Points HK$100.00 and
ALL 5% OFF HK$39.00. The member's ledger was charged 100 points for HK$100 —
the shop's own promotion was counted and never captured for — and the notice
said HK$100 too, not the HK$139 the shop took off altogether.

One row stood for the sale across both writers. The counter's trim pass wrote
it while the shop had not yet priced the basket; the paid order rewrote it
ninety seconds later, moving the time it says the spend landed onto the sale
the shop actually made. The till's own location stayed on the row and out of
what would be sent.

The row is still queued. Staging holds no push keypair, so the drain answers
that this brand offers no push at all and never claims it — the outbox fills
and starts draining the day a keypair exists, which is what it says it does.

Two counter sales alongside it wrote nothing: one with no member on it, and one
attributed to a member who spent nothing of theirs. A sale that gave the member
nothing is not news.

A coupon staff applied rode the same sale shape. A HK$150 whole-order coupon
went on another HK$780 box while the shop's own 5% off stood, and the shop
honoured the coupon: HK$630 paid, HK$150 off, the 5% beaten rather than added
to. The coupon's own code never left the store — what the shop was handed is
the code minted against that one basket, on a discount node created for it, and
that code is what the sale names, what the mint records as spent for HK$150,
and what the notice reports. The coupon is now used against that order, and the
sale earned on HK$630 rather than on HK$780.

The member presented one themselves on the next sale, and it reached the same
place. Their own screen offered the coupon only once staff had the sale open
with them on it, and answered with a QR and a short code — a code minted for
that one sale on a discount node of its own, never the coupon's identity. The
counter took it, the shop honoured HK$78 of a HK$780 box, and the redemption
now records the code and the node it rode on.

What the counter refuses is worth stating, because it is what the staff
sentence promises. A coupon whose code is already minted on the sale cannot be
swapped from the panel: staff typing another code are told to clear every
discount first, because the shop takes a code off only with all of them.

The notice is the two together: one row, HK$79 — a point and a reward coupon —
and the sale earned on what the member actually paid.

A fourth sale showed the notice claiming money the member never got. The coupon
staff applied minted HK$200 against the basket and the trim pass wrote that as
what landed; four seconds later the shop priced the sale at its own automatic's
HK$200 and beat the code, so the paid order named no coupon and the member's
part of the sale was nothing. The claim still stood, because the writer that
empties one returned early rather than touching it. Settlement now takes such a
claim back: unread, the row is dropped, by the rule a withdrawal already runs
on — a member never told has nothing to be told back. Read, it stands and is
reported, since the words for a taken-back notice say the sale was never paid,
and this one was.

## Migration Plan

Additive: a reward's contract gains fields it did not carry before (kind, discount, scope, combine setting), and a physical reward's redemption changes shape (a coupon instead of an item-owed record) only for redemptions issued after this change ships. No backfill of already-issued physical-reward redemptions is in scope; they settle under the collection-confirm path already in place until task 3.2's preconditions are met, and any that lapse are remedied by the operator reversal.
