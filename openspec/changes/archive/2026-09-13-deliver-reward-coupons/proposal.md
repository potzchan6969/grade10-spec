**Author:** @ecchochan - 2026-09-10

## Why

The programme's tier, points and redemption rules are done, and so is the
till — but the reward path they both point at is still a stub: every reward
takes a flat amount off any order, a physical reward waits behind a counter
and a fulfilment queue nobody wants to run, and the console still needs the
admin API to publish anything with a real definition. Four small process gaps
were also carved out of those two changes for this one to pick up. The
manual already states the target shape; this change delivers it.

Metric: share of redemptions used at the till within 30 days of being bought.

## What Changes

- A reward carries a kind — a product coupon or a gift — a discount (a fixed
  amount, or a percentage capped at a maximum) and a scope (named products or
  variants, a filter over the catalog's worlds and types, or the whole
  order), read by the coupon wherever it is spent, online or at the till. It
  also carries a combine setting — which of the shop's own product, order and
  shipping discounts its coupon stacks with — copied onto the coupon here and
  carried to the shop by `mint-coupons-as-discount-codes`.
- A gift adds a free line for the variant it names, and needs a minimum
  spend above zero.
- The console's reward form sets that whole definition, so no reward needs
  the admin API.
- A physical reward settles like any other: its coupon takes 100% off the
  reward's own variant on an ordinary sale. Counter collection and the
  fulfilment queue are retired once a coupon can reach a counter.
- At the counter a reward coupon reaches the sale two ways, both inside the
  till session staff opened: staff apply it from the member's open coupons
  in the panel, or the member presents it from their own session and the
  till scans it. Either way its Shopify Discount code is minted the moment
  it is chosen, reused for that sale, and never shown as the coupon's own
  identity.
- A reward coupon holds the order's one-discount slot, the same as any
  coupon.
- Cancelling a redemption becomes its own operator permission, apart from
  moving points.
- A channel that settles points through an artifact discloses its own
  spending limit before the points leave the balance.
- An activity entry names which channel it came from.
- A member is notified once staff-spent points or an applied coupon at the
  till actually settles, not while it is still a re-plannable claim.
- A reversal returns points and voids a coupon only while that coupon is
  unused. A refunded sale returns the goods, the money and any points spent
  as a discount on it — never the coupon.

## Non-Goals

- No coupon that lives in Shopify — a coupon is Grade10's own record, and a
  Shopify discount on the draft order, a line discount or a code is only how
  its price reaches the order.
- No NFC identification.
- No birthday or registration rewards — still open on the rewards page.

## Capabilities

### Modified Capabilities

- `grade10-site/loyalty/programme`: reward definitions (kind, discount,
  scope) and the console form that authors them; unified coupon settlement
  for a physical reward; how a coupon reaches a counter; reversal restated
  over an unused coupon alone; the cancellation permission split; channel
  disclosure and activity's channel name.
- `grade10-site/store/membership`: the till session drops the collection
  step for one coupon path, and notifies the member on settlement for any
  staff-assisted spend.

## Impact

- Rewards service (`packages/loyalty/backend/src/services/rewards`) gains a
  reward definition instead of a fixed-amount default.
- Loyalty-admin's reward form gains kind, discount, scope and combine-setting
  fields.
- `packages/grade10-store/frontend/src/features/account/` gains the member's
  coupon wallet and the presentation a till reads; it holds no coupon surface
  today.
- The POS plan carries a reward coupon by id, the till panel lists the
  member's reward coupons beside the store's own, and the coupon tender takes
  the channel it is spent on — the till path no reward coupon has today.
- The POS extension's collection-confirm surface, the fulfilment queue it
  serves, and `waitingCollections` are removed once a coupon can reach a
  counter and no redemption is still awaiting one — see this change's
  tech-design.md for the four preconditions.
- Design decisions this change builds on:
  `openspec/changes/archive/2026-09-10-revise-loyalty-programme-rules/tech-design.md`
  and
  `openspec/changes/archive/2026-09-10-add-shopify-membership-pos/tech-design.md`.
- Dependency: `mint-coupons-as-discount-codes` owns "a coupon is the order's
  one discount" end to end, including the reward's own `couponId` path, and
  owns the mint machinery that turns a claimed coupon into a Shopify Discount
  code. This change's groups 3, 4 and 6 build on that work rather than
  duplicating or racing it; recorded as `depends_on` in `.openspec.yaml` as
  well as in tasks.md.

## References

- [Rewards · Using a Reward](../../../docs/prds/products/grade10-site/loyalty/rewards.md#using-a-reward)
- [Rewards · Reward Catalog](../../../docs/prds/products/grade10-site/loyalty/rewards.md#reward-catalog)
- [Coupons · Applying one](../../../docs/prds/products/grade10-site/loyalty/coupons.md#applying-one)
- [Profile · Membership Page](../../../docs/prds/products/grade10-site/loyalty/profile.md#membership-page)
- [Shopify Integration · POS Extension](../../../docs/prds/products/grade10-site/loyalty/shopify-integration.md#pos-extension)
