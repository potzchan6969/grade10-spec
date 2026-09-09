---
title: Discounts
order: 20
---

A discount is money off the bill. Four kinds reach a collector, and every one
lands on the order through the same Shopify draft order.

- **Sale price** — set on the product in Shopify; the listing, the card, and
  the cart show the price and, struck through, the price it was
- **Discount code** — typed in the cart drawer; the total shows the cut, and a
  code the shop refuses stops the checkout with the code named
- **Rewards** — earned with points, on a birthday, or on registering
  ([Rewards](/p/grade10-site/loyalty/rewards)), selected to use in cart OR
  auto-applied
  1. **Order coupon** — an amount off the whole order, never more than the
     reward's cap; a single-use code `PREFIX-XXXXXXXX` with an expiry, bind to
     a Shopify Discount
  2. **Product coupon** — an amount off each unit of the products a
     custom-data group names, custom per-product discount on the draft order,
     NOT bind to Shopify Discount
  3. **Gift** — an item added free once the goods pass a threshold,
     custom per-item discount on the draft order, NOT bind to Shopify
     Discount
- **Points as credits** — **HKD 1** per point
  1. **Nothing is held** — points stay spendable until an order is paid; a
     checkout walked away from costs nothing, and a newer checkout replaces
     the older one
  2. **Where it is on** — everywhere


## One discount at a time

An order carries one discount, whichever kind reached it:

- **In the count** — a discount code, or a reward's coupon; one of them, never
  both, and a second is refused rather than stacked
- **Points as credits** — its own add-on, outside the count
- **Free shipping** — its own add-on, outside the count
- **Both channels** — the same rule in the cart and at the till

## Online draft order mechanism

A Draft Order is created for each checkout, with the following discounts (if any):
- **Discount code** (Shopify Discount code)
- **Order coupon** (Shopify Discount code)
- **Per-product coupon** (per-product custom discount)
- **Points as credits** (order-wise discount)
- **Gift** (per-item 100% off custom discount)
- **Shipping** ([Shipping](/p/grade10-site/store/shipping)) fee is determined by custom carrier service API, conditionally free


## On-site mechanism

Shopify POS rings the sale on its own cart. Our POS UI extension (a home tile) puts the member's benefits on that cart, and the store records one order per till session. The cart decides what landed, never the plan, and nothing is held until the sale is paid.

### The sale, step by step

1. **Staff ring the goods** — barcode scanner into Shopify POS's own cart; the extension adds nothing here
2. **Staff identify the member** — the QR on the member card (profile page), the short code under it, or the exact account email; phone number and "the customer already on the sale" are switches, off by default. A miss says only that no member was found
   - A card presentation lives ten minutes and is consumed once; a second till scanning the same screenshot is refused, naming where the first was used
3. **A session opens** — ten minutes from the server's clock, bound to the shop and the member, never to the staff label; a second identify of the same member at the same shop ends the first; a switch flipped mid-session only ever takes capability away
   - A scanned session outlives the modal: reopening it resumes, and it ends only when the customer on the sale becomes somebody else
4. **The member goes on the sale** — the extension sets the cart's customer to the member's paired Shopify customer and confirms it against the cart; an attach that did not take is retried on apply
5. **Staff read the panel** — tier, balance, window progress, renewal and points-active-until dates, recent activity, the coupons the member may spend, pending collections
6. **Staff choose** — points ("Use max" is the smaller of the balance and the qualifying goods, at **HKD 1** a point) and coupons (chips from the panel or typed)
   - Qualifying goods: the cart's lines after their own discounts, without gift cards and without our gift lines
   - Apply stays off and says why while the session expired, this arm may not spend, the cart is locked for tender, the cart's customer is not the member, another cart-level discount is on the sale, the balance is empty, or the points asked exceed the goods
   - A sale already carrying **another customer** is refused rather than taken: attaching this member over them would spend their points on somebody else's basket, and earn on it
7. **Apply — the store plans the sale** — from the cart's lines (a claim, bounded later by what the shop takes), the coupons chosen and the points asked for: coupons priced against the lines, gifts priced from the catalog, points capped at the goods and the balance, one `orders` row written for the session (origin `pos`, ref `pos-sale:<session>`) and the member's other open promise retired. A re-plan rewrites the same row; twenty plans per session per five minutes
8. **Apply — the extension edits the cart**, each write confirmed against the cart signal, one deadline for the whole edit:
   1. `grade10_order_id` cart attribute — first, before any money: a sale carrying it and fewer benefits settles only what the shop took, a discount without it is money off nobody can bound
   2. Gift — a line added under a gift property, then a 100% line discount titled by the gift; a gift the oversell guard declines is skipped, a gift line left at full price is removed
   3. Product coupon — a fixed per-unit line discount on **every** line carrying that variant, since the cut is priced per unit across all of them; a line already carrying a discount refuses it
   4. Points — one order-level fixed-amount discount titled `Points`; a plan with no points removes the earlier one
   5. Order coupon — added as a Shopify discount code the shop evaluates; taken only when the cart shows one more discount than before
   - A step that did not take is a sentence staff read aloud, never a retry loop
9. **Apply — the store trims the promise** to what landed, and the cart has the last word: a write that landed after its own deadline counts as landed, so a coupon the shop is still taking off is never freed underneath it. Points the shop never discounted, a code it dropped, a coupon refused and a gift blocked come off the row. Idempotent, and a sale already settled is left alone
10. **The extension keeps watching** — every cart signal is read against what the sale was promised, because anybody at the terminal can take a benefit off without telling it (POS's own "remove all discounts", a staff discount replacing ours, the customer lifted off the sale). What the cart stops showing goes back to the member, our own gift line comes off once it stops being free, and staff are told in a sentence
11. **Staff tender** — Shopify POS takes the payment; nothing of ours runs
12. **The paid order arrives** by webhook or sweep, carrying the attribute, and binds to the row only when the row is a till promise with no payment yet, the order came through the POS channel (a cart permalink could write our attribute on a web order), its customer is the member's, and the currency matches. Anything else counts `store.pos.sale.unbound` for an operator's claw-back, never silence
13. **Settlement** — the shop's own allocations price the sale, line by line
    - **Points** leave the balance at what the shop allocated to the `Points` cut
    - **A coupon** settles only where the order corroborates it — an order code among the codes the sale carried, a gift or product variant among the lines still carrying that coupon's own cut — and the rest are freed and counted
    - **A discount no instrument accounts for**, a promotion the shop ran itself, is counted and never read as points
    - **Earning** is on the goods, as online

### Undo

- **Before tender** — Clear takes this sale's benefits off, targeted: gift lines by their property, product coupons by their variant, the `Points` discount by its title; then the store is told what is left. The balance was never touched. A discount code comes off only with every other discount (the platform offers nothing narrower), so staff are told; "Remove every discount" is the last resort
- **A coupon that would not come off** — it stays on the sale and the store is told so: the order id stays, so the landed order still binds, and the coupon's ride stays, so settlement has something to spend. Drop either and the shop goes on honouring the cut against a sale nobody can settle — the member keeps a coupon they used, and the shop pays for it twice
- **The member taken off the sale** — the promise goes back for everything the sale no longer shows, and what can still be removed is. A cut nobody can remove keeps its ride and the order id with it: no sale binds while the cart names no customer, and the member coming back is what spends it
- **After tender** — a refund, on the refund's own rule
- **Walked away** — the promise lives an hour, then the row goes `expired`, never `canceled`: the shop's cart can still collect, and `expired → paid` stays legal
- **A second person steps up** — a reopened modal reads the cart back; a sale the shop's open promises name as this member's stays, points and all, anybody else's benefits are stripped before the new session

### What guarantees it

- **Nothing is held** — points leave when the paid order lands; an abandoned cart costs nothing
- **The cart decides, and goes on deciding** — capture is what the shop allocated to the points, the attribute first means a bare discount can never bind, and the sale is read again on every cart signal for as long as it stands: a promise the cart no longer shows is points nobody may be debited for
- **A coupon is the member's own** — a code the landed sale carried is adopted onto the row and spent, but only where it belongs to the buyer: a code is a string anybody can carry to a counter
- **One session, one row; one member, one open promise** — the row is rewritten, never duplicated, and the newer promise retires the older
- **Every unhappy answer is a value** — the sale is happening whatever the programme thinks; nothing throws, nothing leaves staff on a spinner
- **Replay is dead** — a card presentation is consumed by one guarded update, so two tills scanning at once open exactly one session
- **Throttles** — short-code misses ten per five minutes per shop, email and phone twenty, plans twenty per session
- **A row that closed cannot be rewritten** — a sale that landed, or whose own hour ran out, refuses the next plan and asks for a fresh scan rather than reopening itself
- **A tender reaches stored value, and comes back only whole** — one discount over every line the shop sold, so a gift card on the sale is part-paid by points (`store.points_tender.gift_card_on_sale`) and nothing comes back while the card is kept; the member left short is counted (`store.points_tender.return_held`) and paid by hand

❓ **A sale that names no allocations** — settlement falls back to what settlement read before the shop stated them — the variant alone corroborates a welded coupon, so a cut staff took off still spends it, and the points capture is the applied total less every other instrument, in which an adopted order code counts at its face value. A source that cannot name a cut cannot rule one out either, so refusing there would free every coupon on every sale it reports; whether a POS sale ever reaches us that way is the open part.

### Collection

A physical reward is handed over through the same session: the pending redemption shows the reward, the points paid and the date; staff verify and confirm, once. A second till is told when and by whom it was already given.

### Switches

Per shop, flipped from the admin console, enforced on the next request: terminal, email spend, phone identify, phone spend, cart identify, cart spend. QR and short code carry no switch of their own, so stopping the counter means the terminal switch.

## Designs

::story{id="store-cart-cartdrawerfooter--interactive-member" title="A code typed in the cart"}

::story{id="store-order-detail-orderdetails--item-coupon" title="An order with a product coupon"}

::story{id="store-order-detail-orderdetails--order-discount" title="An order with an order coupon"}

:::detail{title="Draft order" for="engineer"}
- **Where** — `packages/grade10-store/backend/src/services/coupons`,
  `services/pointsTender.ts`, `adapters/shopify/shopifyProvider.ts`,
  `services/shipping/rates.ts`, `worker/routes/carrier.ts`
:::
