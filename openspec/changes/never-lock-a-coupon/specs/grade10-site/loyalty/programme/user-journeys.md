## User journeys

### grade10-site-loyalty-programme-US-11: Member spends a coupon wherever they are, whatever they left open

**As a** member,
**I want** every coupon I hold to be spendable on the sale in front of me, whatever checkout or counter sale I walked away from,
**so that** changing my mind never costs me the coupon and never makes me wait.

**Accepted by:**

- `grade10-site-loyalty-programme-SC-190` — A coupon on an unfinished checkout is still spendable
- `grade10-site-loyalty-programme-SC-191` — A counter sale keeps its cart and loses the cut
- `grade10-site-loyalty-programme-SC-192` — The counter claims a coupon an open checkout holds
- `grade10-site-loyalty-programme-SC-193` — A second counter takes the coupon from the first
- `grade10-site-loyalty-programme-SC-194` — A claim is refused where the earlier code will not die
- `grade10-site-loyalty-programme-SC-195` — A coupon two sales collected is spent once and reported
- `grade10-site-loyalty-programme-SC-196` — The wallet shows no claimed state
- `grade10-site-loyalty-programme-SC-197` — An unpaid sale never spent the coupon
- `grade10-site-loyalty-programme-SC-200` — A coupon on a sale that took money is not moved

### grade10-site-loyalty-programme-US-06: Operator reverses a redemption a member cannot be given

**Accepted by:**

- `grade10-site-loyalty-programme-SC-198` — A reversal is refused while a sale claims the coupon
- `grade10-site-loyalty-programme-SC-199` — A claim whose code has lapsed stops refusing the operator
