# Coupons page tickets — the wallet as promo tickets, with a scan surface

**Author:** @devin - 2026-10-23

## Why

`rewards-shop-surface` rebuilt the reward shop and parked "the coupons-page
QR" as later scope. This is that scope: `CouponList` still drew its own rows,
and the member had no way to present a coupon at the till. The wallet now
draws each coupon as a `PromoTicket`, and a Use now press opens the
`PromoQrCard` on the responsive surface `RewardCheckout` already established
— a bottom sheet under 640px, a dialog from it up.

## What Changes

- `CouponList` draws each coupon as a `PromoTicket` — purpose, a detail
  line, and a stub that reads the code where the consumer passes one.
  Spent, void and expired tickets mute and name their state.
- `CouponItem` gains `qrCode` (`PromoTicketQr`), `statusLabel` and
  `scopeLabel`. A scoped coupon names where it is spendable — "Online
  only" — and never draws Use now or a QR, so no member holds out a code
  the sale refuses.
- The scan surface draws the coupon's ticket above an unfolded `PromoQrCard`
  — sheet under 640px, dialog from it up. Its title names the coupon for
  assistive tech alone; the ticket is the visible heading.
- `CouponList` gains `onScanOpenChange`, reporting the surface's open and
  close with the coupon. ❓ on the PRD whether it survives — the wallet's
  refresh-on-return may cover it.
- `CouponItem` gains `expiringSoon` and `HeldPromoCode` `detailEmphasis` —
  an open coupon the consumer flags (inside its last 14 days at Grade10)
  reads its expiry line emphasised.
- `CouponList` drops `masked` — dead contract; no surface withholds codes.
- `CouponList`'s loading draws ticket-shaped Boneyard skeletons and its
  empty draws the `EmptyState` primitive; `AsyncState`'s empty variant
  gains `description`. `PromoTicket` gains `loading` and a
  `PromoTicketSkeleton` export.
- `AsyncState` empty gains `description`; `PromoTicket` gains `loading`.
- The preview gains a Coupons screen — heading, `Available` / `Used &
  Expired` tabs partitioning by status — and a no-coupons variant that
  drops the tab bar. ❓ on the PRD whether coupons stays its own page or
  folds into the Membership page as a section.

## Non-Goals

- The scan token's lifecycle. Presenting mints a fresh QR; whether it
  rotates while held out is parked ❓ for engineering.
- A coupon detail view. The ticket's lines are the whole surface.
- Backend or app changes. `onScanOpenChange` exists so a consumer can
  refetch on close; refresh-on-return is the settled mechanism.

## References

- [Coupons · Validity](../../../docs/prds/products/grade10-site/loyalty/coupons.md#validity)
