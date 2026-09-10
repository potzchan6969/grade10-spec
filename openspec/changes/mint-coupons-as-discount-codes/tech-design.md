## Context

`packages/grade10-store/backend/src/services/coupons/create.ts` — `createCoupon()` already mints a real Shopify Discount (`deps.discounts.createCodeDiscount`) for an `order`-kind coupon, at redemption time, then compensates (`deactivateCodeDiscount`) if the local insert that follows fails. A `product` or `gift` coupon takes a separate branch today that inserts a plain row with a generated code and mints nothing.

`packages/grade10-store/backend/src/services/coupons/apply.ts` — `resolveCoupons()` is the shared pricing evaluator (web and POS both call it). It already refuses a second `order`-kind code in one request (line ~162), but a `product` or `gift` coupon can still resolve alongside an `order` coupon today, welding `lineDiscounts` independently of `orderCodes`.

`coupons.md`'s own Validity rule already commits every coupon to its reward's definition "as it stood on the day it was bought" — a coupon is deliberately frozen at redemption, never recomputed against a later catalog state. That existing philosophy is what makes most of this change cheap: minting at redemption, the same moment `order` already does it, is not a new risk class for a `gift` or a flat-amount `product` coupon — it is the same one the store already accepts.

## Goals / Non-Goals

**Goals:**
- A `product` and a `gift` coupon each carry their own real Shopify Discount, the same as `order` does today.
- A checkout never carries more than one discount code, however it got there.

**Non-Goals:**
- Changing coupon eligibility, threshold, or redemption rules.
- A new Shopify discount value type — everything mints as `fixed_amount`, computing percentage-with-ceiling locally first, exactly as the evaluator already does for a weld.

## Decisions

**Mint timing splits on whether the cut's money value is knowable at redemption.**

| Coupon shape | Money value | Mint timing |
| --- | --- | --- |
| Order coupon | Fixed, from the definition | At redemption (unchanged) |
| Gift | The gift variant's catalog price at redemption | At redemption |
| Product coupon, fixed-amount benefit | Fixed, from the definition | At redemption |
| Product coupon, percentage-with-ceiling benefit | `min(percentage × eligible line total, ceiling)` — depends on the basket at checkout | At checkout submit, never at a price preview |

The first three extend `createCoupon()`'s existing Shopify-minting branch (currently gated to `definition.kind === "order"`) to also cover `gift` and a fixed-amount `product` coupon — reusing `codeScope`, `shopTarget`, `COMBINES_WITH`, and `compensateMint` exactly as written. A gift's mint additionally needs the resolved variant's current catalog price (`deps.catalog`), looked up once at redemption alongside the existing `resolveVariantRef` call.

The fourth shape cannot be pre-minted: its value depends on a basket that does not exist yet at redemption. It keeps using the local evaluator (`evaluateCoupon`, already used for the weld today) to compute the cut against the real basket, but only at the checkout that will spend it — never during `calculateDraftOrder`'s price preview, which keeps using the local number for display. Minting happens once, immediately before `createDraftOrder`; a failure after minting deactivates the code, mirroring `compensateMint`.

**`resolveCoupons()` refuses more than one requested code, full stop** — replacing the narrower `order`-only check. Every coupon shape now rides the same one discount-code slot, so the existing per-`order` rule generalizes without changing its shape: `requested.length > 1` refuses immediately, before evaluation. Alternative considered: allow multiple and pick the best value automatically; rejected — the proposal decided the collector picks, and grade10 has no product ranking to substitute for that choice.

**`CheckoutCouponFacts` gains `discountCodes: readonly string[]`, replacing the `orderCodes` / `lineDiscounts` split for anything code-shaped.** A `gift`, a fixed `product` coupon, and an `order` coupon all resolve to one already-minted code, added here. A percentage-with-ceiling `product` coupon resolves to a computed amount that the checkout-submit step mints just before use. `lineDiscounts` stays only for what still welds — nothing, once this change ships, other than points (which is not a coupon and does not go through this path).

## Service Interfaces

**`resolveCoupons()`** — signature unchanged; behavior changes only in what `CheckoutCouponFacts` carries and the new one-code refusal, both already covered above.

**`mintComputedCouponCode()`** (new, `coupons/apply.ts` or a sibling module) — called only from the checkout-submit path, never from a price preview:
- **Input:** the single resolved `CouponRide` for a percentage-with-ceiling product coupon, the computed `cutMinor`, and the mint deps (`discounts`, `config`, `clock`).
- **Success:** `{ outcome: "minted"; code: string; nodeId: string }`.
- **Failure:** the same outcome union `createCodeDiscount` already returns (`codeTaken`, `customerRefused`, `rejected`, `throttled`) — the caller's existing retry-on-`codeTaken` and refusal handling in `createCoupon()` is the pattern to reuse, not reinvent.
- **Compensation:** on any failure of the `createDraftOrder` call that follows, deactivate the minted node — same `compensateMint` shape as `coupons/create.ts`.

## Risks / Trade-offs

- **A gift or a fixed-amount product coupon's price is frozen at redemption, same as an order coupon already is** → Not a new risk: `coupons.md`'s Validity rule already commits to this for every coupon. No mitigation needed beyond what already exists.
- **Extending `resolveCoupons()`'s one-code refusal changes behavior for any basket that today combines a product/gift coupon with an order coupon** → This is the product decision the proposal already made (collector picks one). Verify no existing test or fixture assumes the old combining behavior before this ships.
- **The frontend and the POS extension currently let a collector apply more than one coupon without being asked to choose** → Out of this backend change's own scope, but the refusal above means an untouched frontend would show a generic "refused" error instead of a choice. Sequence the frontend task before this ships, not after.

## Migration Plan

Additive to the mint path and the evaluator; no schema change (product/gift rows already carry `code` and gain `shopifyNodeId`, a column `order` coupons already use). Verify on staging: redeem one product coupon and one gift, confirm each mints a real Shopify Discount and settles a real checkout by it; redeem a percentage-with-ceiling product coupon, confirm it mints only at submit and never during a price preview; attempt to apply two coupons at once and confirm the refusal.
