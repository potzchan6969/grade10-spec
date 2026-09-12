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
- `grade10-site-loyalty-programme-SC-166` — A coupon reaches the counter by the member presenting it
- `grade10-site-loyalty-programme-SC-172` — Staff apply a member's coupon from the till session
- `grade10-site-loyalty-programme-SC-160` — A member cannot undo a redemption
- `grade10-site-loyalty-programme-SC-161` — A coupon expires on its own terms
- `grade10-site-loyalty-programme-SC-162` — Points buy nothing at an auction

The order's-one-discount-slot behaviour this journey used to cite
(`SC-163`) is accepted by `grade10-site/store/discounts`' own scenario
instead, covering a reward coupon as one case of any coupon rather than a
second copy of the rule.

### grade10-site-loyalty-programme-US-06: Operator reverses a redemption a member cannot be given

**As an** operator,
**I want** to return a member's points and void their coupon while it is still unused,
**so that** a reward we cannot honour costs the member nothing.

**Accepted by:**

- `grade10-site-loyalty-programme-SC-168` — A reversal voids the coupon
- `grade10-site-loyalty-programme-SC-169` — A used coupon cannot be reversed
- `grade10-site-loyalty-programme-SC-167` — A refunded sale does not return the coupon
- `grade10-site-loyalty-programme-SC-170` — A member cannot reverse their own redemption
- `grade10-site-loyalty-programme-SC-171` — Restored points keep their original expiry

This journey replaces the durable `US-06`, whose story promised a physical
reward waiting for collection and whose `SC-67`, `SC-68` and `SC-69`
acceptances retire with the queue. `SC-65` and `SC-66` — a reward's own
per-unit stock — are untouched and stay where they are.

### grade10-site-loyalty-programme-US-08: Member sees what a channel does to their points, before and after

**As a** member,
**I want** a channel's own spending limit disclosed before points leave, and every activity entry to name the channel it came from,
**so that** I always know what happened to my balance and why.

**Accepted by:**

- `grade10-site-loyalty-programme-SC-112` — A channel's own limit is disclosed before the points go
- `grade10-site-loyalty-programme-SC-165` — An activity entry names its channel

### grade10-site-loyalty-programme-US-09: Operator authors a reward's full definition from the console

**As an** operator,
**I want** the reward form to set a reward's kind, discount, scope and combine setting,
**so that** publishing any reward never needs the admin API.

**Accepted by:**

- `grade10-site-loyalty-programme-SC-158` — A reward with a definition is created from the console alone
- `grade10-site-loyalty-programme-SC-173` — A reward's combine setting reaches its code

### grade10-site-loyalty-programme-US-10: Operator cancels a redemption under its own permission

**As an** operator,
**I want** cancelling a redemption gated by its own permission,
**so that** being trusted to move points does not also trust me to undo what a member redeemed.

**Accepted by:**

- `grade10-site-loyalty-programme-SC-164` — Moving points does not carry redemption cancellation
