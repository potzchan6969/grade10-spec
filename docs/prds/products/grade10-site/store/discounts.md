---
title: Discounts
spec: grade10-site/store/discounts
order: 20
---

## Kinds of Discount

Site discounts are the shop's own automatics, with no code. Amounts are HKD.

| Kind | What it is | Authored by | Class |
| --- | --- | --- | --- |
| **Sale price** | The product's compare-at price, above its price | Merchandiser, on the product in Shopify Admin | The price itself |
| **Product discount** | An automatic amount off named products, variants or collections, a % or a fixed amount off each item, with or without a minimum | Merchandiser, Shopify Admin automatic discounts | Product |
| **Order discount** | An automatic amount off the whole order, a % or a fixed amount, with or without a spend minimum | Merchandiser, Shopify Admin automatic discounts | Order |
| **Buy X get Y** | An automatic: a reward product discounted or free after a trigger purchase | Merchandiser, Shopify Admin automatic discounts | Product |
| **Order coupon** | A code for a fixed amount off the whole order, or off named products or variants; single use, `PREFIX-XXXXXXXX`, one member, an expiry | Operator, the store admin console | Order, or product where it names products |
| **Product coupon** | A reward: a fixed amount, or a % with a ceiling, off its scope — [Rewards](/p/grade10-site/loyalty/rewards#reward-types) | Operator defines the reward in the loyalty admin; the member redeems it | Product, or order where its scope is the whole order |
| **Gift** | A reward or a store coupon: the gift product at 100% off once the goods pass a threshold, handed over at the till alone | As a product coupon, or an operator mints it | Product |
| **Public code** | A Shopify discount code open to everyone, not minted to a member; shown in the drawer's picker to guests and members — [Public Codes](#public-codes) | Merchandiser, Shopify Admin | Order |
| **Points** | **$1** per point, paid against the bill — [Paying with Points](/p/grade10-site/loyalty/paying-with-points) | The member, in the cart drawer or at the till | Outside the count |

### Public Codes

- **Shown in the drawer** - the picker lists public codes to guests and members - [Cart Drawer](/p/grade10-site/store/cart#promo-code)
- **Source** - Shopify discounts tagged `public`, read by the store
- **Order beside wallet codes** - those that fit first, soonest to expire first, across both

## Authoring Rules

| Discount | Allowed | Combines with |
| --- | --- | --- |
| Sale price | **Yes** | · — it is the price, so nothing drops it |
| Automatic amount off products, variants or collections | **Yes** | **Product and order discounts**, so a code stacks with it; one set not to combine refuses every product coupon in the cart |
| Automatic amount off order | **Yes**, a spend threshold included | **Product and order discounts**, so a code stacks with it |
| Automatic buy X get Y | **Yes** | **Order discounts and codes** — its order and product boxes |
| Order coupon | **Yes** | What its mint states, else the store default: 🚧 product, order and shipping discounts |
| Product coupon, gift | **Yes** | The reward's Combines with, else the store default |
| Points | **Always** | Every discount — a payment, outside the count |

- **Both sides decide** — two discounts stack only when each allows the
  other's class, so an automatic's refusal beats a code's own setting

### A Product Discount Beside a Sale Price

- **The struck price** - the cut comes off the price, and the compare-at is
  struck where it is above it: $880, compare-at $1,000, 10% off reads $792
- **A code joins** - the shop keeps the combination that takes the most off,
  so a product discount not set to combine can leave the cart above the card

[Test cases · grade10-site/store/site-discounts](https://github.com/9gag/grade10-spec/tree/main/openspec/specs/grade10-site/store/site-discounts)

## Order of Application

The shop prices every combination its combine rules allow, online and at the
till, and keeps the one that takes the most off. Grade10 accepts its price.

```
for each combination the combine rules allow
  1  sale price      the price every step starts from
  2  buy X get Y     the units it gives or buys take no other product cut
  3  product cuts    one per line, the larger
  4  order cuts      minimum read here · rates first, then fixed amounts
keep the combination that takes the most off
  5  points          what is left of qualifying goods, up to the balance
  6  shipping        paid in money
```

- **Minimum** — read on what the product cuts left, so a product coupon can
  take the basket under an order discount's minimum
- **Larger wins** — on a tie, the fewer discounts, then an automatic over a
  code
- **Points** — capped at the qualifying goods less the site discounts and
  the code, and at the balance; an ask past it is trimmed —
  [at the till](#the-sale-step-by-step) too

### One Discount at a Time

- **In the count** — a discount code or a reward's coupon, one of them; a
  second replaces the first in the [cart](/p/grade10-site/store/cart#promo-code)
- **Outside the count** — points, free shipping and the site discounts
- **Set aside** — a code the shop drops for a site discount that gives more
  goes back to the member's wallet, the order goes through at the shop's
  price, and the member is told
- **Refused** — only a code the shop refuses outright stops the checkout

:::detail{title="Pricing code map" for="engineer"}
- **The shop's rules** — `priceDiscounts`, `packages/shopify/backend/src/money/discountPricing.ts`
- **The cart's quote** — `packages/grade10-store/backend/src/services/orders/quote.ts`, `shopPricing.ts`, `tender.ts`
- **The listing's read** — `packages/grade10-store/backend/src/services/catalog/siteDiscounts.ts`, `siteSaleOf` in `@grade10/store-frontend/catalog`
- **Combine default** — `DEFAULT_COMBINES_WITH`, `@grade10/coupons-contracts`
:::

## Where Each Shows

| Discount | Listing card | Product page | Cart line | Cart footer | Shopify invoice |
| --- | --- | --- | --- | --- | --- |
| Sale price | Price, compare-at struck | Price, compare-at struck | 🚧 Price, compare-at struck | In the subtotal | The price |
| Order discount, no minimum, a % or a fixed amount off each item | Price after it, the higher struck | Price after it, the higher struck, and named | Not struck | `Discount (<title>)` | On the order |
| Order discount with a minimum, or a fixed amount once across the order | Nothing | Named | Not struck | `Discount (<title>)`, once reached | On the order |
| Buy X get Y | Nothing | Named | Price after it, unit price struck | Subtotal after it | On the line |
| Product discount, no minimum | Price after it, the higher struck | Price after it, the higher struck, and named | Price after it, unit price struck | Subtotal after it | On the line |
| Product discount with a minimum | Nothing | Named | Price after it, unit price struck | Subtotal after it | On the line |
| Code or reward | · | · | Not struck | `Discount (<code or title>)`, Remove | The code |
| Gift | · | · | 🚧 A line at no charge | In the code's row | The code |
| Points | · | · | · | `Points`, Remove | 🚧 `Deduction from Points` |

- **Named** — among the product page's badges, by its title in the shop; the
  listing card names none, and of two cuts on one card the larger shows —
  [Product Listing](/p/grade10-site/store/product-listing)

### Struck Price on a Cart Line

A line strikes one higher price, the first that applies:

1. **Repriced** — the price the member saw before the shop repriced it
2. 🚧 **On sale** — the compare-at price, where it is above the price
3. **Cut by the shop** — the unit price before a product cut the shop
   applied, such as a buy X get Y

### Cart Footer

1. **Subtotal** · 小計 — the goods after the site discounts' product cuts
2. **Order discount** — `Discount (<title>)` · `優惠 (<title>)`, one row
   each, by its title in the shop, with no Remove
3. **Code** — `Discount (<code>)` · `優惠 (<code>)`, the code or the
   reward's title, with Remove
4. **Points** · 積分 — with Remove
5. **Shipping** · 運費 — calculated at checkout
6. **Estimated Total** · 預計總額 — the subtotal less every row above it

:::detail{title="Worked examples" for="pm"}
Each footer is the drawer's, before Shipping. The goods: a booster box at
$880, an elite trainer box at $420, booster packs at $60, sleeves at $210.

**(a) A sale price** — a booster box at $880, compare-at $1,000. The card,
the product page and the cart line read $880 with $1,000 struck.

| Row | Amount |
| --- | --- |
| Subtotal | $880 |
| Estimated Total | $880 |

**(b) A spend threshold** — the order discount *Spend $1,000, save $100*;
two booster boxes. No line is struck.

| Row | Amount |
| --- | --- |
| Subtotal | $1,760 |
| Discount (Spend $1,000, save $100) | −$100 |
| Estimated Total | $1,660 |

**(c) An order discount and a coupon, stacked** — the same order discount; a
booster box and an elite trainer box; the reward *$50 off Pokémon*, which
combines with order discounts. The coupon comes off first, the goods left
($1,250) still clear the $1,000 minimum, and both apply.

| Row | Amount |
| --- | --- |
| Subtotal | $1,300 |
| Discount (Spend $1,000, save $100) | −$100 |
| Discount ($50 off Pokémon) · Remove | −$50 |
| Estimated Total | $1,150 |

**(d) A code that does not combine** — the same basket and order discount;
the order coupon `VIP-7K2M9QXA`, $80 off the order, set not to combine
with order discounts.
The two cannot stack, and $100 is larger, so the shop keeps the order
discount. The code's field reads *A site discount takes more off this
basket, so the shop applies it instead. This promo code stays in your
wallet.* · 網站優惠為這張訂單減得更多，商店會改用網站優惠；此優惠碼會保留在你的錢包。

| Row | Amount |
| --- | --- |
| Subtotal | $1,300 |
| Discount (Spend $1,000, save $100) | −$100 |
| Estimated Total | $1,200 |

A $150 code is the larger instead: `Discount (VIP-7K2M9QXA)` −$150, no order
discount row, and $1,150.

**(e) A coupon under the minimum** — the same order discount; two elite
trainer boxes and sleeves; the reward *$120 off Pokémon*, which combines with
order discounts. After the coupon the goods are $930, under the minimum, so
the two cannot both apply, and $120 is the larger.

| Row | Amount |
| --- | --- |
| Subtotal | $1,050 |
| Discount ($120 off Pokémon) · Remove | −$120 |
| Estimated Total | $930 |

A $60 coupon loses to the order discount's $100 instead, and is set aside as
in (d).

**(f) Buy X get Y** — *Buy 2 packs, get 1 free*; three booster packs. The
shop gives the cheapest pack free, $60 off the line, which reads $40 a pack
with $60 struck. The product page names the offer.

| Row | Amount |
| --- | --- |
| Subtotal | $120 |
| Estimated Total | $120 |

**(g) Points after a code** — a booster box and an elite trainer box; the
reward *$50 off any order*; 600 points, Use max. The ceiling is the smaller
of the balance and the $1,250 the code leaves.

| Row | Amount |
| --- | --- |
| Subtotal | $1,300 |
| Discount ($50 off any order) · Remove | −$50 |
| Points · Remove | −$600 |
| Estimated Total | $650 |

With 2,000 points, an ask of 2,000 is trimmed to 1,250; the total is $0 and
shipping is paid in money.
:::

## Online Draft Order Mechanism

A Draft Order is created for each checkout, carrying at most one discount
code, points and the site discounts it accepts:
- **Discount code, order coupon, product coupon, or gift** (Shopify
  Discount code) — whichever one the checkout carries, minted when it is
  submitted; a percentage coupon keeps its own rate, which the shop takes
- **Points** (order-wise discount)
- **Shipping** ([Shipping](/p/grade10-site/store/shipping)) fee is determined by custom carrier service API, conditionally free

Nothing is held for a draft order: points and a discount code alike stay
spendable until a paid order takes them.

- **The newer promise retires the older** — an online checkout, and a sale planned at a counter,
  each retire the member's earlier sales carrying points, a reward or one of the store's own
  coupons, whatever the newer one carries; a retired online order is cancelled, and the
  member's cart keeps its lines
- **A retired counter sale keeps its cart** — the shop owns that cart and it
  can still collect, so the sale is never cancelled; it takes no new plan
- **A retired counter sale gives back its reward** — whatever reward it
  holds, the one the newer sale claims or another; its code is deactivated,
  and a gift's line stays on the cart — [Coupons](/p/grade10-site/loyalty/coupons)


## At the Till

Shopify POS rings the sale on its own cart. Our POS UI extension (a home tile) puts the member's benefits on that cart, and the store records one order per till session. The cart decides what landed, never the plan.

- **POS Pro only** — the shop's automatics are the POS cart's own, and one
  reaches a counter only where its "Apply on POS Pro locations" switch is on,
  off by default

### The sale, step by step

:::detail{title="Each step" for="operator"}
1. **Staff ring the goods** — barcode scanner into Shopify POS's own cart; the extension adds nothing here
2. **Staff identify the member** — the QR on the member card (membership page), on one of the member's coupons or on a wallet pass, or the exact account email; phone number and "the customer already on the sale" are switches, off by default. A miss says only that no member was found
   - A card presentation lives ten minutes and is consumed once; a second till scanning the same screenshot is refused, naming where the first was used. A coupon's QR is a card presentation and follows the same rule
3. **A session opens** — ten minutes from the server's clock, bound to the shop and the member, never to the staff label; a second identify of the same member at the same shop ends the first; a switch flipped mid-session only ever takes capability away
   - A scanned session outlives the modal: reopening it resumes, and it ends only when the customer on the sale becomes somebody else
4. **The member goes on the sale** — the extension sets the cart's customer to the member's paired Shopify customer and confirms it against the cart; an attach that did not take is retried on apply
5. **Staff read the panel** — tier, balance, window progress, renewal and points-active-until dates, recent activity, the coupons the member may spend. The member's reward coupons are in that list beside the store's own
6. **Staff choose** — points ("Use max" is the smaller of the balance and what the shop's offers leave of the qualifying goods, at **HKD 1** a point) and coupons (chips from the panel or typed). The member can also open a coupon on their own phone, with or without a sale; the till scans it, and it counts as chosen the same way. The coupon's QR is a card presentation that names it, on a sale or not: one scan identifies the member and chooses the coupon, and a scan over the member's own sale opens a new session that keeps that sale and the points already on it
   - Qualifying goods: the cart's lines after their own discounts, without gift cards and without our gift lines
   - Apply stays off and says why while the session expired, this arm may not spend, the cart is locked for tender, the cart's customer is not the member, the balance is empty, or the points asked exceed what the offers leave of the goods
   - Beside the shop's offers, points are capped at what the offers leave of the goods: POS cuts a fixed order discount to fit, so points past that would be held for money the member never saves
   - **Somebody else's discount in the sale's one custom order discount** — the panel says 此單已有其他非會員系統的折扣，請先移除。 The shop's offer and any discount code are never in that slot, so points go on beside them
     - **A staff order discount** — Apply stays off while points are asked; a coupon alone goes on beside it, because only points write the slot
     - **A fixed amount staff keyed under a points title ([Paying with Points](/p/grade10-site/loyalty/paying-with-points#rules)) on a sale the extension never marked** — the panel shows only that sentence, with no points field, no coupons and no Apply, because the order id Apply writes would make the discount read as the member's points
   - A sale already carrying **another customer** is refused rather than taken: attaching this member over them would spend their points on somebody else's basket, and earn on it
7. **Apply — the store plans the sale** — from the cart's lines (a claim, bounded later by what the shop takes), the coupons chosen and the points asked for: coupons priced against the lines, gifts priced from the catalog, points capped at the goods and the balance, one `orders` row written for the session (origin `pos`, ref `pos-sale:<session>`) and the member's other open promises retired. A re-plan rewrites the same row; twenty plans per session per five minutes
8. **Apply — the extension edits the cart**, each write confirmed against the cart signal, one deadline for the whole edit:
   1. `grade10_order_id` cart attribute — first, before any money: a sale carrying it and fewer benefits settles only what the shop took, a discount without it is money off nobody can bound
   2. Gift — a line added under a gift property and discounted to nothing; a gift carries no code at the till; a gift the oversell guard declines is skipped, a gift line left at full price is removed
   3. Points — one order-level fixed-amount discount, titled as [Paying with Points](/p/grade10-site/loyalty/paying-with-points#rules) says; a plan with no points removes the earlier one
   4. Product coupon or order coupon — added as a Shopify discount code the shop evaluates, whichever one the plan carries; a product coupon's code is minted the moment it is taken; taken only when the cart shows one more discount than before
   - A step that did not take is a sentence staff read aloud, never a retry loop
9. **Apply — the store trims the promise** to what landed, and the cart has the last word: a write that landed after its own deadline counts as landed, so a coupon the shop is still taking off is never freed underneath it. Points the shop never discounted, a code it dropped, a coupon refused and a gift blocked come off the row. Idempotent, and a sale already settled is left alone
10. **The extension keeps watching** — every cart signal is read against what the sale was promised, because anybody at the terminal can take a benefit off without telling it (POS's own 管理折扣 → 全部移除, a staff order discount replacing ours, the customer lifted off the sale). What the cart stops showing goes back to the member, our own gift line comes off once it stops being free or once the goods fall below the gift's minimum spend, and staff are told in a sentence
    - A points discount POS cuts smaller after a line change, never past the amount written, keeps its points held; settlement takes them in proportion to what the discount took
11. **Staff tender** — Shopify POS takes the payment; nothing of ours runs
12. **The paid order arrives** by webhook or sweep, carrying the attribute, and binds to the row only when the row is a till promise with no payment yet, the order came through the POS channel (a cart permalink could write our attribute on a web order), its customer is the member's, and the currency matches. Anything else counts `store.pos.sale.unbound` for an operator's claw-back, never silence
13. **Settlement** — the shop's own allocations price the sale, line by line
    - **Points** leave the balance at what the shop allocated to the points discount, found by either points title; a discount under any other title is never the points discount
    - **A coupon** settles only where the order corroborates it — a product or order coupon by its own code among the codes the sale carried, a gift by its line — and the rest are freed and counted
    - **A discount no instrument accounts for**, a promotion the shop ran itself, is counted and never read as points on a sale that names its points discount
    - **A sale whose named discounts carry neither points title** is read for points like one that names none: the applied total less every other instrument, never more than promised, because a shop can retitle the points discount and still take the money off
    - **Earning** is on the goods, as online
:::

### Undo

| Button | Where | What comes off | The shop's offer |
| --- | --- | --- | --- |
| **全部移除** | The extension, 此單項目 | This sale's gift lines and points discount; a code stays | Stays |
| **移除所有折扣** (Remove every discount) | The extension, 此單項目 | Every code, the points discount, a staff discount, and this sale's gift lines | Stays |
| **全部移除** | POS, 管理折扣 | Every discount | Off for that cart, until 購物車 ⋯ → 自動折扣 puts it back |

- **Before tender** — the extension's 全部移除 takes gift lines off by their property and the points discount by its title, as [Paying with Points](/p/grade10-site/loyalty/paying-with-points#rules) names it, then tells the store what is left. The balance was never touched. A discount code — a product coupon or an order coupon — comes off only with every other discount (the platform offers nothing narrower), so staff are told; 移除所有折扣 is the last resort
- **A coupon that would not come off** — it stays on the sale and the store is told so: the order id stays, so the landed order still binds, and the coupon's ride stays, so settlement has something to spend. Drop either and the shop goes on honouring the cut against a sale nobody can settle — the member keeps a coupon they used, and the shop pays for it twice
- **The member taken off the sale** — the promise goes back for everything the sale no longer shows, and what can still be removed is. A cut nobody can remove keeps its ride and the order id with it: no sale binds while the cart names no customer, and the member coming back is what spends it
- **After tender** — a refund, on the refund's own rule
- **Walked away** — the promise lives an hour, then the row goes `expired`, never `canceled`: the shop's cart can still collect, and `expired → paid` stays legal
- **Walked away with a reward** — at that hour the reward comes off and its code is deactivated; the sale keeps its cart, a gift's line with it, and a cart still carrying the code or that line is settled against what it carried — [Coupons](/p/grade10-site/loyalty/coupons)
- **A reward's code removed** — once it leaves the sale, no reward goes back on that sale, that coupon or another; points still go on, and a reward needs a new sale
- **A second person steps up** — a reopened modal reads the cart back; a sale the shop's open promises name as this member's stays, points and all, anybody else's benefits are stripped before the new session

### What guarantees it

:::detail{title="Each guarantee" for="engineer"}
- **The cart decides, and goes on deciding** — capture is what the shop allocated to the points, the attribute first means a bare discount can never bind, and the sale is read again on every cart signal for as long as it stands: a promise the cart no longer shows is points nobody may be debited for
- **A coupon is the member's own** — a code the landed sale carried is adopted onto the row and spent, but only where it belongs to the buyer: a code is a string anybody can carry to a counter
- **One session, one row; one member, one open promise** — the row is rewritten, never duplicated, and the newer promise retires the older
- **Every unhappy answer is a value** — the sale is happening whatever the programme thinks; nothing throws, nothing leaves staff on a spinner
- **Replay is dead** — a card presentation is consumed by one guarded update, so two tills scanning at once open exactly one session
- **Throttles** — short-code misses ten per five minutes per shop, email and phone twenty, plans twenty per session
- **A row that closed cannot be rewritten** — a sale that landed, whose own hour ran out, or that a newer promise retired, refuses the next plan and asks staff to ring the goods on a new sale rather than reopening itself: a fresh scan would leave a deactivated code on the same cart
- **A fresh scan on an open sale's cart** - a till session lives ten minutes and a sale's hour outlasts it, so staff reach the cart again through a fresh scan; on the member's own open sale it continues that sale and the code it carries, and on their closed sale still carrying a reward's code it is refused
- **A fresh scan on a closed sale's cart that carries no reward's code** - after a sale with only points or a gift's line runs out its hour, the apply takes that gift's line and points off the cart and opens a new sale on it; a cart tendered without a new apply still names the closed sale, and one paid showing its gift's line is reported and settled as [Coupons](/p/grade10-site/loyalty/coupons#spending-one) says
- **A tender reaches stored value, and comes back only whole** — one discount over every line the shop sold, so a gift card on the sale is part-paid by points (`store.points_tender.gift_card_on_sale`) and nothing comes back while the card is kept; the member left short is counted (`store.points_tender.return_held`) and paid by hand
:::

- ❓ **A sale that names no allocations** — settlement falls back to what settlement read before the shop stated them — the variant alone corroborates a welded coupon, so a cut staff took off still spends it, and the points capture is the applied total less every other instrument, in which an adopted order code counts at the cut recorded when its code was minted, and at its face value only for a code minted before those records (grade10 `packages/grade10-store/backend/src/services/coupons/money.ts:92-98`). A source that cannot name a cut cannot rule one out either, so refusing there would free every coupon on every sale it reports; whether a POS sale ever reaches us that way is the open part, for engineering to confirm with Shopify POS.

### Switches

Per shop, flipped from the admin console, enforced on the next request: terminal, email spend, phone identify, phone spend, cart identify, cart spend. The QR carries no switch of its own, so stopping the counter means the terminal switch.

## Designs

::story{id="store-cart-blocks-cartdrawerfooter-interactive--interactive-member" title="A code typed in the cart"}

::story{id="store-order-detail-blocks-orderdetails--item-coupon" title="An order with a product coupon"}

::story{id="store-order-detail-blocks-orderdetails--order-discount" title="An order with an order coupon"}

:::detail{title="Draft order" for="engineer"}
- **Where** — `packages/grade10-store/backend/src/services/coupons`,
  `services/pointsTender.ts`, `adapters/shopify/shopifyProvider.ts`,
  `services/shipping/rates.ts`, `worker/routes/carrier.ts`,
  `packages/shopify/backend/src/admin/draftOrders.ts`,
  `packages/shopify/backend/src/admin/discounts.ts`
:::

:::detail{title="Product decisions" for="pm"}
A draft order can now accept Shopify's own automatic discounts, added to
Shopify's API after this store's original discount design; that removes the
reason site discounts and reward coupons needed a discount engine of
grade10's own.

- **A gift at the till is its own line** — discounted to nothing, with no code: a code as well would take the benefit twice and use the order's one code slot
- **One code slot** — one coupon per order, by choice, to keep the sale simple: a free reward and a money-off coupon are two sales, and a collector eligible for more picks one. The picker isolates the rule, so a later change can widen it
- **Nothing is held** — points and coupons stay spendable until a paid order takes them, so a member is never locked out of their own coupon by a draft or a sale they walked away from
- **A product's sale** — a product discount in the shop as well as the compare-at price, so a merchandiser can run a sale on some items without editing each price
- **Order discounts authored to combine** — a Shopify order discount cannot exclude products, so one that does not combine leaves the shop keeping the larger instead of stacking a code
- **An order discount strikes no line** — it is a row of its own after the subtotal, because Shopify's checkout prints it on the order, not the lines
- **The shop's rules, read off its answers** — the order of application is read off the shop's own answers on a dev shop, never off its docs
- **Not in scope** — an admin screen in grade10 for authoring site discounts; merchandisers author them in Shopify Admin, where the sale price already lives
- ❓ **Preview against the shop** — whether the shop's price preview answers each code and each site discount line by line, as the store reads it; to be confirmed on a dev shop. Engineering confirms
- ❓ **A site discount for some customers only** — one the shop authors for a customer segment shows on the listing to everyone; whether the listing hides it from the rest. Product confirms
- ❓ **A free item alone online** — a 100%-off reward with nothing else in the basket is an HKD 0 order plus shipping; whether it ships free, or is collection only. Product confirms
- ❓ **A tier ladder** — Shopify holds one order discount per tier, and tiers authored to combine add up on a basket that clears two; whether a ladder combines with order discounts at all. Product confirms
- ❓ **A public code beside the cart's code** — whether the invoice takes a second code beside the cart's, or replaces it. Product confirms
:::
