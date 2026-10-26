# Tasks

## 1. The blocks (grade10-spec)

- [x] 1.1 `CouponItem` gains `qrCode`, `statusLabel`, `scopeLabel`;
      `CouponListCopy` drops `masked` and `expired`; `masked` leaves the
      props `grade10-site-loyalty-programme-SC-273`
- [x] 1.2 `CouponList` renders each coupon as a `PromoTicket` — open with
      Use now where `qrCode` is passed, scoped without, spent/void/expired
      muted and naming their state
      `grade10-site-loyalty-programme-SC-274`
- [x] 1.3 The scan surface: sheet under 640px, dialog from it up, ticket
      above an unfolded `PromoQrCard`, assistive-only title,
      `onScanOpenChange` reporting both edges
      `grade10-site-loyalty-programme-SC-272`
- [x] 1.4 `PromoTicket` gains `loading` and a `PromoTicketSkeleton`
      (Boneyard `store-cart-promo-ticket`); `CouponList` loading draws
      skeleton tickets, its empty draws `EmptyState`; `AsyncState` empty
      gains `description`
- [x] 1.5 Export `PromoTicketQr`, `PromoTicketSkeleton` and the changed
      types through `packages/ui/src/index.ts`
- [x] 1.6 `CouponItem` gains `expiringSoon` and `HeldPromoCode`
      `detailEmphasis`; the ticket and the scan surface's ticket read a
      flagged open coupon's expiry emphasised
      `grade10-site-loyalty-programme-SC-275`

## 2. The stories and the preview (grade10-spec)

- [x] 2.1 `coupon-list.stories.tsx` — Default states, ScanCoupon +
      ScanCouponNarrow, Codeless, Loading, Empty; `promo-ticket.stories.tsx`
      gains Loading and BoneyardCapture
- [x] 2.2 `coupons.stories.tsx` — the Coupons screen with Available /
      Used & Expired tabs, PresentAtTill, Narrow, NoCoupons; membership
      content updated
- [x] 2.3 `loyalty/coupons.md` — ordering, refresh-on-return, online-only
      and the ❓ rows for the close signal, the QR's rotation and
      page-vs-section
- [x] 2.4 `ExpiringSoon` stories on `CouponList` and `PromoTicket`; the
      Coupons screen's Available tab shows a flagged coupon
      `grade10-site-loyalty-programme-SC-275`

## 3. Follow-up (app devs)

- [ ] 3.1 Refetch the wallet on the member's return to the page; confirm or
      drop `onScanOpenChange` against the ❓
- [ ] 3.2 Confirm whether the presented QR mints once per open or rotates
      while held out
- [ ] 3.3 Confirm whether coupons lands as its own page or a Membership
      section when the UI arrives

## 4. The walk - the coupons wallet (grade10-spec)

- [ ] 4.1 Walk `grade10-site-loyalty-programme-US-11` on the workbench:
      `Loyalty/Coupons` tickets show their code only where one is passed;
      Use now opens the scan surface as a sheet under 640px and a dialog
      from it; a scoped coupon offers no Use now or QR; spent, void and
      expired tickets mute and name their state
      (`grade10-site-loyalty-programme-SC-272`, `grade10-site-loyalty-programme-SC-273`, `grade10-site-loyalty-programme-SC-274`)
