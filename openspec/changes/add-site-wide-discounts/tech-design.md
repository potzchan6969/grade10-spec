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

## Risks / Trade-offs

- **Whether Shopify's own combine-rule configuration reproduces a product special sale's line-only exclusivity** (open in the spec) → Not a code risk to mitigate here: it is Shopify Admin configuration. Verify empirically on staging with a real automatic discount and a real coupon before merchandising relies on it; record the answer on the manual page's ❓ line, not in code.

## Migration Plan

Purely additive to the GraphQL input — no schema, no data migration, no new query field. Safe to ship with no flag: until a merchandiser creates an automatic discount in Shopify Admin, `acceptAutomaticDiscounts: true` changes nothing about any existing draft order. Verify on staging by creating one test automatic discount in Shopify Admin, running a checkout and a POS sale through staging, and confirming the cut appears in `codeDiscountMinor` before this ships to production.
