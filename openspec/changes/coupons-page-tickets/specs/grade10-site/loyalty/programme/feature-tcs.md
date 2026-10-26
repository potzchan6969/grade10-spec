# grade10-site/loyalty/programme Test Cases

**Status:** pending-review · 0/0

## Reconciliation

**Run:** no blind pass — a surface change over settled rules: `CouponList`
draws tickets, gains the scan surface `rewards-shop-surface` parked, and a
scoped coupon never offers a scan.

- **Staying** — `grade10-site-loyalty-programme-SC-123`, `-SC-124`,
  `-SC-125`, `-SC-185`, `-SC-186`, `-SC-243`, restated unchanged.
- **Arriving** — `grade10-site-loyalty-programme-SC-272` (Use now opens the
  ticket above an unfolded card), `-SC-273` (a scoped coupon names its
  scope, no scan), `-SC-274` (closed coupons name their state, no scan or
  action), `-SC-275` (a flagged expiring coupon reads its expiry
  emphasised, an unflagged one plainly).
- **Unconfirmed** — the scan surface's `onScanOpenChange` callback and the
  QR's rotation stay ❓ on the coupons PRD page; no case asserts them.
