# Decisions

## Goals

- Every coupon is a `PromoTicket`; presenting one opens its `PromoQrCard`
  on the surface `RewardCheckout` established.
- The wallet never offers a code a sale can refuse: scoped coupons name
  their scope and carry no scan.
- A member's history is one tab away: Available holds what can still be
  spent, Used & Expired the rest.

## Non-Goals

- The scan token's rotation — minted on open, its refresh while held out is
  unconfirmed and engineering's call.
- A coupon detail surface beyond the ticket's own lines.
- Lifting the scan surface's state to the consumer — it stays the block's,
  reported through `onScanOpenChange` while that callback is unconfirmed.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which change owns the coupon wallet's contract moves? | A new `coupons-page-tickets` — it is the scope `rewards-shop-surface` parked as "the coupons-page QR", and it references that change's ticket and sheet/dialog pattern | Folding into `rewards-shop-surface` — already one of five deltas colliding on the exports anchor |
| Q2 | Does the stub still read the coupon's code? | Where the consumer passes one — the member-readable code `rewards-shop-surface` mints; a codeless coupon reads its amount | Dropping the code from the ticket entirely — the slim scanner-failure fallback is the consumer's call to withhold |
| Q3 | What does an online-scoped coupon offer at the till? | Nothing to scan — `scopeLabel` names where it is good ("Online only") and suppresses Use now and the QR outright | Letting the consumer simply not pass `qrCode` — a weaker guarantee that still allows a confusing scan |
| Q4 | How does the wallet learn a presented coupon was spent? | It refreshes when the member returns to the page; `onScanOpenChange` stays marked ❓ for engineering to confirm | Polling or listening while the scan card is up |
| Q5 | How do the two wallet halves order? | Available reads nearest expiry first; Used & Expired reads newest first — the consumer sorts, the block renders what it is passed | A sort inside `CouponList` — ordering is the consumer's product rule |
| Q6 | What does a void coupon tell the member? | "Void {date}. Points returned" | A bare "Void" — unexplained, it invites support tickets |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/loyalty/programme | whether the scan surface's open/close callback stays on `CouponList`, or refresh-on-return covers it | the ❓ on `loyalty/coupons.md` |
| grade10-site/loyalty/programme | whether the presented QR rotates while held out, as the member pass's does | the ❓ on `loyalty/coupons.md` |
| grade10-site/loyalty/programme | whether coupons is its own page or a section of the Membership page | the ❓ on `loyalty/coupons.md` — UI forthcoming |
