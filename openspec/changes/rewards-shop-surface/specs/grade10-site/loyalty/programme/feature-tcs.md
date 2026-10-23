# grade10-site/loyalty/programme Test Cases

**Status:** pending-review · 0/0

## Reconciliation

**Run:** no blind pass — a surface redesign plus one product rule: `RewardMenu`
becomes the card list, `RewardCheckout` joins the exports drawing the
checkout-and-redeemed surface, and a money-off redemption mints a
member-readable code unique to it.

- **Staying** — `grade10-site-loyalty-programme-SC-123`, `-SC-124`, `-SC-125`,
  `-SC-255`, `-SC-256`, `-SC-257`, `-SC-185`, `-SC-186`, restated unchanged.
- **Modified** — `grade10-site-loyalty-programme-SC-243` (rev 2): the list
  shows the code each coupon is passed, not "a reward coupon carries none" —
  a money-off redemption now mints one.
- **Arriving** — `grade10-site-loyalty-programme-SC-262` (one code per
  redemption), `-SC-263` (a good mints a code its collection ticket leaves
  unseen), `-SC-264` (a card per reward,
  press reports), `-SC-265` (no quantity), `-SC-266` (sheet under 640px,
  dialog from it), `-SC-267` (short balance refused whole), `-SC-268`
  (code or collection on the ticket, never Apply), `-SC-269` (a run-out
  refusal closes the surface), `-SC-270` (a retryable refusal keeps it),
  `-SC-271` (a dropped balance re-reads the deficit).
- **Settled** — the redeemed ticket's QR is in the requirement: folded
  behind a Use now control on till-facing surfaces, drawn from the
  redemption's code, gone once spent. The coupons-page QR remains later
  scope, not a case here.
