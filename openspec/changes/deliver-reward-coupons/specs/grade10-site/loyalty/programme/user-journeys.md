## User journeys

### grade10-site-loyalty-programme-US-07: Member redeems any reward as one coupon

**As a** member,
**I want** every reward I redeem — money off, a gift, or a physical item — to become a coupon with its own kind, discount and scope,
**so that** a physical reward settles like an ordinary purchase and I never wait for a separate collection.

**Accepted by:**

- `grade10-site-loyalty-programme-SC-152` — A fixed-amount coupon takes a set amount off its scope
- `grade10-site-loyalty-programme-SC-153` — A percentage coupon is capped at its maximum discount
- `grade10-site-loyalty-programme-SC-154` — A coupon scoped to a catalog filter matches worlds and types
- `grade10-site-loyalty-programme-SC-155` — A coupon scoped to the whole order applies across every line
- `grade10-site-loyalty-programme-SC-156` — A gift adds a free line for its own variant
- `grade10-site-loyalty-programme-SC-157` — A gift below its minimum spend does not apply
- `grade10-site-loyalty-programme-SC-159` — A physical reward's coupon takes 100% off its own variant

The order's-one-discount-slot behavior this journey used to cite
(`SC-163`) is accepted by `grade10-site/store/discounts`'s own scenario
instead — `mint-coupons-as-discount-codes` delivers it, covering a reward
coupon as one case of "any coupon," not a second copy of the rule.

### grade10-site-loyalty-programme-US-08: Member sees what a channel does to their points, before and after

**As a** member,
**I want** a channel's own spending limit disclosed before points leave, and every activity entry to name the channel it came from,
**so that** I always know what happened to my balance and why.

**Accepted by:**

- `grade10-site-loyalty-programme-SC-112` — A channel's own limit is disclosed before the points go
- `grade10-site-loyalty-programme-SC-165` — An activity entry names its channel

### grade10-site-loyalty-programme-US-09: Operator authors a reward's full definition from the console

**As an** operator,
**I want** the reward form to set a reward's kind, discount and scope,
**so that** publishing any reward never needs the admin API.

**Accepted by:**

- `grade10-site-loyalty-programme-SC-158` — A reward with a definition is created from the console alone

### grade10-site-loyalty-programme-US-10: Operator cancels a redemption under its own permission

**As an** operator,
**I want** cancelling a redemption gated by its own permission,
**so that** being trusted to move points does not also trust me to undo what a member redeemed.

**Accepted by:**

- `grade10-site-loyalty-programme-SC-164` — Moving points does not carry redemption cancellation
