## Context

`packages/shopify/backend/src/admin/draftOrders.ts` builds every `DraftOrderInput` through one function, `draftOrderVariables()`, shared by `draftOrderCreate` and `draftOrderCalculate`. Neither call sets `acceptAutomaticDiscounts` today, so Shopify's own automatic discounts never reach a draft order — see proposal.md.

The client also derives `codeDiscountMinor` for a price preview by subtraction: `totalDiscountsSet - weldedDiscountMinor`. That already conflates any cut Shopify itself applied with what a discount code took off; once automatic discounts start applying, it would silently fold their amount into "code discount" too.

Shopify's `DraftOrderPlatformDiscount` (on both `DraftOrder` and `CalculatedDraftOrder`) exists to tell these apart: `{ automaticDiscount: Boolean, code: String, title: String, totalAmount: MoneyV2 }`, one row per discount the shop actually applied.

## Goals / Non-Goals

**Goals:**
- Every draft order this store creates accepts Shopify's automatic discounts.
- A price preview and a completed draft order both report an automatic discount's amount separately from a discount code's amount.

**Non-Goals:**
- Authoring, editing, or listing site discounts from grade10 — that stays entirely in Shopify Admin.
- Reproducing Shopify's own combine-rule evaluation locally.

## Decisions

**`acceptAutomaticDiscounts: true` is unconditional, not input-configurable.** There is no caller today that wants a draft priced without automatic discounts — a draft order carrying a customer's own coupon or code is still priced correctly whether or not an automatic discount also happens to apply, since acceptance only matters when one exists and is eligible. Alternative considered: thread a flag through `ShopifyDraftOrderInput`; rejected as a parameter nothing will ever set to `false`.

**Add `platformDiscounts` to both `DRAFT_ORDER_FIELDS` and `DRAFT_ORDER_CALCULATE`, and derive `automaticDiscountMinor` and `codeDiscountMinor` from it** — summing `totalAmount` over rows where `automaticDiscount` is `true` for the first, `false` for the second — replacing the current `totalDiscountsSet` subtraction. This is strictly more correct even before this change ships, since the subtraction already mislabels any welded order-level discount reported inside `totalDiscountsSet` on some API versions; `platformDiscounts` is a direct read instead of a derived guess. Alternative considered: keep the subtraction and accept that its meaning changes once an automatic discount exists; rejected — a price breakdown reading a merchandiser's site discount as "code discount" is exactly the kind of silent wrong number this change exists to avoid.

**`ShopifyDraftOrderPricing` gains `automaticDiscountMinor`.** Existing callers of `calculateDraftOrder` that only read `totalMinor` are unaffected; nothing currently reads `codeDiscountMinor` in a way this redefinition breaks (verify at implementation — grep every reader before changing its meaning).

## Risks / Trade-offs

- **Whether Shopify's own combine-rule configuration reproduces a product special sale's line-only exclusivity** (open in the spec) → Not a code risk to mitigate here: it is Shopify Admin configuration. Verify empirically on staging with a real automatic discount and a real coupon before merchandising relies on it; record the answer on the manual page's ❓ line, not in code.
- **`platformDiscounts` is new to this client's queries** → Confirm the field exists and returns the expected shape on this store's pinned Admin API version before relying on it; fall back to the existing subtraction only if it does not, and file that as its own gap rather than shipping silently degraded.

## Migration Plan

Purely additive to the GraphQL input and query fields — no schema, no data migration. Safe to ship with no flag: until a merchandiser creates an automatic discount in Shopify Admin, `acceptAutomaticDiscounts: true` changes nothing about any existing draft order. Verify on staging by creating one test automatic discount in Shopify Admin, running a checkout and a POS sale through staging, and confirming the cut appears and `platformDiscounts` reports it correctly before this ships to production.
