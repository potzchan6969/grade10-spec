## Context

`packages/shopify/backend/src/admin/draftOrders.ts` builds every `DraftOrderInput` through one function, `draftOrderVariables()`, shared by `draftOrderCreate` and `draftOrderCalculate`. Neither call sets `acceptAutomaticDiscounts` today, so Shopify's own automatic discounts never reach a draft order — see proposal.md.

`ShopifyDraftOrderPricing.codeDiscountMinor` is already documented for exactly this day: "What the codes and any automatic promotion took off, together." It is derived as `totalDiscountsSet - weldedDiscountMinor`, which already folds an automatic discount's amount in once one exists — no field or derivation change needed here.

## Goals / Non-Goals

**Goals:**
- Every draft order this store creates accepts Shopify's automatic discounts.

**Non-Goals:**
- Authoring, editing, or listing site discounts from grade10 — that stays entirely in Shopify Admin.
- Reproducing Shopify's own combine-rule evaluation locally.
- Separating an automatic discount's amount from a code's in the pricing result — `codeDiscountMinor` already covers both by design; splitting it is a later change if a caller ever needs the breakdown, not this one.

## Decisions

**`acceptAutomaticDiscounts: true` is unconditional, not input-configurable.** There is no caller today that wants a draft priced without automatic discounts — a draft order carrying a customer's own coupon or code is still priced correctly whether or not an automatic discount also happens to apply, since acceptance only matters when one exists and is eligible. Alternative considered: thread a flag through `ShopifyDraftOrderInput`; rejected as a parameter nothing will ever set to `false`.

**The till is not a draft-order channel.** Shopify POS rings a sale on its own cart and the paid order arrives by webhook; the only production callers of `createDraftOrder` are the web checkout's provider and the admin console's till simulator. So `acceptAutomaticDiscounts` reaches the online checkout and the simulator, and nothing else — at a real counter the automatics are the POS cart's own, already on, and the only thing grade10 controls is whether it turns them off. It does not: `removeAllDiscounts(false)` preserves them deliberately. That is what the requirement states for the till, in place of a draft-order property no till has.

**The code's combine setting is the coupon's own, and grade10 accepts what the shop priced.** `COMBINES_WITH` is a module constant on every minted code today, so a merchandiser cannot author an order-threshold automatic that stacks with a member's coupon whatever they set in Shopify Admin. `mint-coupons-as-discount-codes` makes it a mint parameter sourced from the coupon's definition, with today's value as the default, so a merchandiser and a reward author together decide what stacks. Shopify's documented rule for two discounts that cannot combine is that the better one applies and the other is dropped; that change's tasks 4.12–4.13 turn a dropped code into a completed sale with the coupon returned. Task 2.3 records what the draft-order response shows for the applied automatic, which is what that split reads.

## Risks / Trade-offs

- **A non-combinable automatic discount that beats a coupon completes the sale without it.** `shopifyProvider` compares every requested code against the codes the created draft landed, and `mint-coupons-as-discount-codes` tasks 4.12-4.13 answer a skipped one as replaced rather than refused: the order stands at the shop's price and the coupon goes back to the wallet. Staging confirms both halves above.
- **Whether Shopify's own combine-rule configuration reproduces a product special sale's line-only exclusivity** (open in the spec) → Shopify Admin configuration, not code. Verify empirically on staging with a real automatic discount and a real coupon before merchandising relies on it; record the answer on the manual page's ❓ line.
- **The points tender rides as an order-level `appliedDiscount` on the very builder this flag is added to.** Staging shows the two stack: a 100-point basket under a live 5% automatic is charged for both.
- **Accepted risk, shared with `mint-coupons-as-discount-codes`**: grade10 prices every benefit it computes locally — the points basis, and a percentage benefit's base and ceiling — against a basket the shop may discount further, because the order row is written before the draft-order call returns `totalDiscountsSet`. The product record already decides the combination itself ("Points always redeem, even on a product special sale"); what is unresolved is the allocation, which task 2.3 records.

## Migration Plan

Purely additive to the GraphQL input — no schema, no data migration, no new query field. No flag is needed, because deleting the automatic discount in Shopify Admin is itself a kill switch requiring no deploy — but this is not "safe to ship unguarded": until a merchandiser creates an automatic discount nothing changes, and the moment one exists the combine-rule outcome above is live for every coupon checkout. So task 2.3 is a gate to clear on staging before any automatic discount is created in production, not a verification trailing the ship.

## What staging showed

One automatic order discount live on the staging shop — `ALL 5% OFF`, 5% off the entire order, every customer — over a HK$780 basket, so the automatic is worth HK$39. Every row is a draft order the store created through `draftOrderVariables()` with the flag on. Online, every coupon reaches the shop as the code minted for it and its cuts are stripped from the wire, so each row is one code against one automatic.

| The coupon that rode | What the shop priced |
| --- | --- |
| None | The automatic alone — HK$741 |
| Order coupon, HK$10 | The automatic. The code is dropped and the checkout completes |
| Order coupon, HK$60 | The code — HK$720. The automatic is dropped |
| Product coupon, HK$20 | The automatic. The code is dropped and the checkout completes |
| Product coupon, HK$200 | The code, off the line — HK$580. The automatic is dropped |
| Gift coupon, a HK$5 item | The automatic alone — HK$741. The gift line is taken off the basket, so the buyer is never charged for it |
| Reward coupon, HK$30, at the counter | The automatic. The reward's code is dropped and the sale completes |
| 100 points | Both — HK$780 less HK$39 less HK$100, HK$641 |

Shopify keeps the better of a code and an automatic that cannot combine and drops the other. Points are the exception. They ride as the draft's own order-level discount and stack with the automatic, so the flag is safe for the baskets that carry points.

Each named type of automatic discount, read twice — the till's own pricing call, which is where `codeDiscountMinor` surfaces, and a web checkout's draft order.

| The automatic | The basket | What the shop took |
| --- | --- | --- |
| Product special sale — 50% off one box | That box, HK$260 | HK$130. The line is halved |
| Buy X get Y — buy one box, get another free | Both boxes, HK$1,560 | HK$780. The second box is sent at HK$0.00 |
| Order threshold — HK$200 off over HK$1,000 | Two boxes, HK$1,560 | HK$200, named on the draft as `QA order threshold probe` |

Two automatics never stack. Where more than one fits a basket the shop keeps the larger and drops the rest, so each probe above is measured on a basket only its own automatic reaches.

Two hand probes in Shopify Admin, on a draft order carrying the same three things the store sends:

- **A code worth more than the line it targets clamps.** HK$500 off a HK$5 Potatoz took the line to zero and stopped: the HK$260 box beside it stayed HK$260, and the leftover HK$495 evaporated. A fixed-amount code never spills onto a line it does not name.
- **The flag is honoured, the code is dropped by name, and an order-level discount survives both.** Turning on "apply all eligible automatic discounts" over a draft already carrying a code answered *"QA-SPILL-PROBE couldn't be used with your existing discounts"* and put Fire Sale on instead — HK$260 down to HK$130. The custom order discount beside it stood: HK$135 less HK$20 is HK$115. So the rule holds for a product automatic as well as an order one, and the order-level slot the points tender rides is not the slot a code and an automatic compete for.

A dropped coupon costs a member nothing online: `couponReplaced` releases it, and every coupon above was live again once its draft stood. Three things the store still owes the member:

- **A gift's line survives its dropped code.** The code is what zeroes the line, so when the automatic beats it the buyer is charged for the free item and the larger basket earns the automatic a larger cut. A gift whose code did not land has to leave the basket with it.
- **The answer states a cut the shop never took.** `couponLineDiscountMinor` carries what the coupon was promised to be worth, replaced or not.
- **Nothing on the wire says a coupon came back.** `replacedCouponCodes` stops at the service; `CheckoutResult` has no field for it, so no surface can tell the member.

Three counter sales through the admin's till, against the same shop with the
same automatics live:

| The sale | What the shop took |
| --- | --- |
| HK$3,000, nobody on it | `QA order threshold probe` — HK$200 |
| HK$500, a member who spent nothing | `ALL 5% OFF` — HK$25 |
| HK$780 box, 100 points | Both — `ALL 5% OFF` HK$39 and Points HK$100 |

So the counter reads the way the web checkout does: an automatic reaches a till
sale, the shop keeps the larger of two that fit, and the points tender stacks
with it because it rides a slot no code competes for.

The extension's own half of this is not answerable here. The shop applies an
automatic while pricing the draft, seconds after the counter has handed the
basket over, so it never sits on the till's cart — and `foreignCartDiscount`
reads the cart. Only the POS app, where the platform puts the automatic on the
cart itself, can say whether Apply is blocked or whether "Remove every
discount" confirms.
