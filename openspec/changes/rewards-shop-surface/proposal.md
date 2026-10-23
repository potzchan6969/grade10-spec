# Rewards shop surface — list, checkout sheet and redeemed state

**Author:** @devin - 2026-10-22

## Why

The rewards a member can buy today render as `RewardMenu`'s plain rows with an
inline Redeem button, and nothing draws what a redemption looks like. The
designer has drafted the flow in Figma (Grade10-DS-2026, nodes `7254:500`,
`7254:2285`, `7254:2460`, `7264:6580`, `7266:6742`, `7266:6909`,
`7266:6875`): the shop is a list of reward cards — an item card with its
picture and deadline, a coupon card with the gift tile — and a press opens a
checkout surface, a bottom sheet under 640px and a dialog from it up, that
restates the reward, names where the coupon is spendable and how long it is
good for, shows the point balance before and after, and redeems in place.
The same surface then draws the redeemed state: the ticket the redemption
issued, with the unique per-redemption code a discount coupon carries and
the collection line a good carries.

## What Changes

- `RewardMenu` is rebuilt to the Figma cards: one card per reward —
  kind `item` or `coupon`, item art or the coupon gift tile, name,
  description, an optional redemption deadline, and the price in points. The
  whole card reports `onSelect(rewardId)`; affordability stays judged
  against the supplied balance. **BREAKING**: `maxQuantity`,
  `quantities`, `onQuantityChange`, `validity`, `limits`,
  `collectionWindow`, `busyRewardId`, `failedRewardId` and
  `onRedeem(id, qty)` leave the props — a redemption is always one unit, and
  the busy and refused states live on the checkout surface.
- `RewardCheckout` joins the exports: the checkout-and-redeemed surface,
  drawn as a bottom sheet under 640px and as a dialog from 640px up. In the
  confirm phase it draws the reward's hero (item image or coupon gift
  tile), an optional deadline badge, the name and description, `Use at` and
  `Valid for` detail rows, the balance as `before → after`, and a
  `Redeem for N pts` button that disables when the balance is short — the
  balance row then names the deficit in the warning tone. Given a
  redemption it draws the redeemed phase instead: the check, the
  consumer-worded title, the points line, and the promo ticket — a
  discount coupon's ticket carries the unique code minted at redemption, a
  good's carries its collect-by and the collect-in-store line and no code
  and no apply.
- `RewardItem` joins the exports — the card `RewardMenu` draws per reward,
  on its own for consumers that place one outside the menu.
- `RewardCheckoutCopy`, `RewardCheckoutProps`, `RewardRedemption`,
  `RewardCheckoutReward`, `RewardItemProps` join the type exports;
  `RewardMenuItem` gains
  `kind`, `description`, `image`, `deadline`, `useAt` and `validFor` and
  loses `maxQuantity`, `validity`, `limits` and `collectionWindow`.
- A reward coupon now carries a member-readable code: minted once, unique
  per redemption, member-bound, good online and at the till. This revises
  the line `never-lock-a-coupon` wrote — a code was minted only for the
  sale that claims a coupon and never shown. The per-sale minting stays;
  the member-readable code is separate, minted at redemption.
- The preview gains a Rewards screen (Figma `7254:500`) composing
  `RewardMenu` and `RewardCheckout` with fixture state, and the membership
  screen's rewards section repoints at the new surface.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/loyalty/programme`: the membership surface exports —
  `RewardMenu`'s contract and the `RewardCheckout` export — and the coupon
  code rule a redemption mints.

## Impact

- **`packages/ui`** - `reward-menu.tsx` rebuilt; `reward-checkout.tsx` and
  `reward-redeemed` content new; `types.ts` changes; `index.ts` exports.
- **`apps/preview`** - new Rewards screen; `loyalty-content.ts` and the
  membership screen repointed.
- **Consuming apps** - any consumer importing `RewardMenu`,
  `RewardMenuItem`, `RewardMenuCopy` or `RewardMenuProps` must adapt; the
  quantity props are gone and selection replaces redemption on the menu.
- **Revises** - `never-lock-a-coupon`'s member-visible-code rule; the
  per-sale code minting is untouched.

## References

- [Rewards · Reward Shop](../../../docs/prds/products/grade10-site/loyalty/rewards.md#reward-shop)
- [Coupons · Validity](../../../docs/prds/products/grade10-site/loyalty/coupons.md#validity)
- Figma: Grade10-DS-2026 — `7254:500`, `7254:2285`, `7254:2460`, `7264:6580`,
  `7266:6742`, `7266:6909`, `7266:6875`
