## Context

The cart picker already receives live held and public promo presentation data
through the shared `HeldPromoCode` shape. The product change is a presentation
state handoff: Grade10 owns the expiry calculation from the quote it already
has, while the shared ticket owns only the visual treatment.

The shared implementation already has the intended prop-driven seam in this
store checkout: `HeldPromoCode` has an optional `detailEmphasis` field,
`PromoTicket` applies the existing accent-and-medium treatment to its detail
slot when that field is true, and the `ExpiringSoon` story supplies the state.
This change makes that seam part of the durable shared contract and proves the
Grade10 mapping against the cart journeys. It adds no new ticket variant,
token, copy key or timer.

## Design

### Keep the two ticket slots and their owners

The cart ticket keeps the discount in its title slot. The expiry and conditions
remain the consumer-supplied detail slot. Near expiry changes only the detail
slot's existing emphasis treatment; it does not replace the title, combine the
two strings, change the wording or introduce an urgency label.

The Grade10 mapper must preserve that slot ownership before it adds the boolean:
the cart ticket's `detailLabel` is the existing expiry/conditions line (the
`Use by` string), not a repeated discount-worth line. This is an existing-slot
mapping correction, not new copy: reuse the current expiry/conditions formatter
and keep the discount amount in the title. If no existing expiry/conditions
detail is available, leave the detail absent as before.

The shared `PromoTicket` receives an additive optional
`HeldPromoCode.detailEmphasis` boolean. `true` selects the existing detail
treatment; `false` or omission keeps the existing plain treatment. The shared
component does not parse `expiresAt`, read the current time, count days or
decide whether a code is live. It preserves the supplied title, detail text,
code, refusal reason, Apply action and list order, including for a muted code
that cannot apply.

### Derive the state once in the Grade10 consumer

The Grade10 cart quote's existing nullable `expiresAt` is the only expiry
source. In the existing quote-to-`HeldPromoCode` mapping used by
`CartDrawerHost`, derive a boolean from the current consumer clock for every
live held and public code:

```text
detailEmphasis = expiresAt != null
  && expiresAt > now
  && expiresAt <= now + 14 days
```

The upper boundary is inclusive. A missing expiry and an expiry at or before
the current instant are not near-expiry live states, so they receive `false`;
the existing quote/status path continues to decide whether a code is listed.
The mapper passes the boolean through unchanged for applicable and
inapplicable codes. It does not alter the quote, applicability, refusal,
selection, ordering or displayed date formatting. Focused tests also assert
that an applicable ticket does not put the discount-worth string into its
detail slot.

The mapper's clock input is fixed in focused tests so the 14-day boundary is
deterministic. The application may use its existing clock access at runtime;
no shared timer, interval, countdown or browser storage is introduced.

### Interfaces and compatibility

| Boundary | Existing input | Change | Compatibility |
| --- | --- | --- | --- |
| Store quote → Grade10 mapper | Held/public promo answers, nullable `expiresAt` | Derive `detailEmphasis` from the existing quote fact and consumer clock | No response, request, quote, or wire-field change |
| Grade10 mapper → shared UI | `HeldPromoCode` presentation data | Pass the additive optional boolean for every live code | Existing callers that omit it remain plain |
| Shared `PromoTicket` | `HeldPromoCode` and existing action/refusal props | Emphasize only the supplied detail slot | No title, copy, action, ordering, or layout variant change |
| Coupons consumer | Existing `HeldPromoCode` use from `coupons-page-tickets` | Continue using the same consumer-owned field | No second expiry prop or shared date calculation |

The public shared TypeScript prop is an additive UI contract change. It is not
a backend or service API migration. There is no backend, quote API, database,
schema, persistence, checkout, translation-catalog or date-format change.

### Active-change overlap

- `add-store-public-codes` already makes held and public codes share one
  picker and one `HeldPromoCode` presentation shape. This change applies the
  same expiry-state rule to both sources and does not duplicate public-code
  ordering or guest/member behavior.
- `coupons-page-tickets` already uses `detailEmphasis` for a consumer-marked
  coupon ticket. The shared cart contract is the single owner of the visual
  field; the cart consumer derives it from quote `expiresAt`, while the coupon
  consumer derives its own state. Neither consumer moves clock logic into
  `PromoTicket`.
- Existing cart, guest-checkout, pending-tender and cart-picture contracts
  remain unchanged. Their callbacks, loading guards, public-code merge and
  reviewed-cart facts are inputs to this change, not new behavior here.

## Verification

Shared UI verification covers the public contract and renderer boundary:

- assert that `detailEmphasis: true` emphasizes only the existing detail slot;
- assert that `false` and omission remain plain and preserve the existing
  title, detail text, code and callbacks;
- assert that an inapplicable ticket keeps its muted refusal and no-Apply
  treatment while its supplied detail may be emphasized; and
- assert that the Grade10 adapter supplies the existing expiry/conditions
  detail, rather than a repeated discount-worth line, without changing its
  wording; and
- prove the story/type surface with the existing `packages/ui` checks, without
  introducing a new design-system token or a component-side clock.

Grade10 verification covers the adapter boundary with a fixed clock and
decoded quote fixtures. It checks the inclusive 14-day boundary, a date beyond
the window, a missing expiry, a past expiry, held and public codes, and an
inapplicable code. Each case also checks that discount title, expiry/conditions
detail, code, Apply/refusal behavior and ordering are unchanged. No backend or
database lane is owed by this change.

The final local walk uses the existing cart picker at the guest and member
surfaces, including a public code and a held code, and checks the near-expiry,
plain, no-expiry and inapplicable states at the supported responsive widths.

## Delivery and reversal

1. Land the shared contract evidence in `grade10-spec` and publish the
   accepted change.
2. Advance the Grade10 `external/grade10-spec` gitlink to that published
   revision through the supported submodule workflow.
3. Land the Grade10 mapper tests before the mapper/wiring change, then pass the
   derived boolean to the existing cart drawer props.
4. Keep the Grade10 Cart Drawer PRD outcome and decision row aligned with the
   accepted contract; no PRD copy or translation key is added by the mapper.
5. Run the local walk after the shared pin and frontend checks are green.

Reversal is a code and gitlink revert: remove the derived boolean and restore
the prior optional field behavior. No data migration, backend rollback,
service-version coordination or production operation is required.

## Open questions

None. Product decisions Q1–Q4 settle the audience, slot ownership, inclusive
boundary and consumer/shared ownership of the calculation.
