## User journeys

### loyalty-US-01: Member holds tier points and a redeemable balance apart

**As a** member,
**I want** earning to credit both counts and redeeming to spend only the balance,
**so that** spending points cannot take my tier, and losing the balance cannot take it either.

**Accepted by:**

- `loyalty-SC-70` — Redeeming costs no tier progress
- `loyalty-SC-71` — Earning credits both counts
- `loyalty-SC-72` — Losing the balance does not lose the tier
- `loyalty-SC-73` — Losing the tier does not lose the balance
- `loyalty-SC-74` — A first purchase can promote
- `loyalty-SC-75` — The triggering purchase earns at the old rate
- `loyalty-SC-76` — A promotion dates the validity period
- `loyalty-SC-77` — Re-qualifying keeps the tier
- `loyalty-SC-78` — Not re-qualifying drops the tier
- `loyalty-SC-79` — Losing a tier resets the climb
- `loyalty-SC-80` — Spending points does not demote
- `loyalty-SC-81` — A drop is observed, not scheduled
- `loyalty-SC-82` — An operator removes a tier granted in error
- `loyalty-SC-83` — Tier history records each move

### loyalty-US-02: Member earns only on what they actually paid

**As a** member,
**I want** points from qualifying goods I paid for, and inactivity to expire the balance,
**so that** a discount, a gift card, or an auction win does not invent earn, and a quiet year empties spendable points.

**Accepted by:**

- `loyalty-SC-84` — A discount reduces what the purchase earns
- `loyalty-SC-85` — A coupon reduces what the purchase it pays for earns
- `loyalty-SC-86` — An order discount cannot be pushed onto the non-earning lines
- `loyalty-SC-87` — A fully discounted order earns nothing
- `loyalty-SC-88` — Shipping and service fees earn nothing
- `loyalty-SC-89` — A gift card earns once, not twice
- `loyalty-SC-90` — An auction win earns nothing
- `loyalty-SC-91` — A credit top-up earns nothing
- `loyalty-SC-92` — An unlisted category earns nothing
- `loyalty-SC-93` — An entry names its channel
- `loyalty-SC-94` — Buying keeps the whole balance alive
- `loyalty-SC-95` — Redeeming also resets the window
- `loyalty-SC-96` — Expiry needs no sweep
- `loyalty-SC-97` — Expired points do not come back
- `loyalty-SC-98` — A correction does not extend the balance's life
- `loyalty-SC-99` — A campaign grant keeps the balance alive
- `loyalty-SC-100` — A spend too small to earn still counts as activity
- `loyalty-SC-101` — A late record cannot shorten the balance's life
- `loyalty-SC-102` — A partial sweep converges

### loyalty-US-03: Member redeems and can pay with points at checkout

**As a** member,
**I want** a redemption to settle as the reward it is, and points to reduce a bill at the programme's rate,
**so that** I cannot undo a spent reward, and deleting my account ends membership at once.

**Accepted by:**

- `loyalty-SC-103` — A physical reward is not a discount code
- `loyalty-SC-104` — A member cannot undo a redemption
- `loyalty-SC-105` — A coupon expires on its own terms
- `loyalty-SC-106` — Points buy nothing at an auction
- `loyalty-SC-107` — One balance across both channels
- `loyalty-SC-108` — The channel's copy is not the balance
- `loyalty-SC-109` — Points reduce the bill
- `loyalty-SC-110` — The part paid with points earns nothing
- `loyalty-SC-111` — One debit however the channel settles it
- `loyalty-SC-112` — A channel's own limit is disclosed before the points go
- `loyalty-SC-113` — Deletion clears what the member held
- `loyalty-SC-114` — Deletion does not wait for a window
- `loyalty-SC-115` — Base points floor before the multiplier
- `loyalty-SC-116` — A single floor at the end
- `loyalty-SC-117` — A foreign currency is refused
- `loyalty-SC-118` — Backdated activity keeps its own date
- `loyalty-SC-119` — Future-dated activity is refused
- `loyalty-SC-120` — An expired unused code returns nothing by itself
- `loyalty-SC-121` — An operator cancellation is the credit path
- `loyalty-SC-122` — A used artifact is never reversed

### loyalty-US-04: Member reads two counts and redeems from one surface

**As a** member,
**I want** my tier, balance, and activity on one surface, in the programme's dates,
**so that** I can join, redeem, and never see the operator's reasons behind an entry.

**Accepted by:**

- `loyalty-SC-123` — The two counts are never summed
- `loyalty-SC-124` — A member's activity carries nothing operator-facing
- `loyalty-SC-125` — The components take content, not sources
- `loyalty-SC-03` — Balance excludes expired and spent points
- `loyalty-SC-126` — Tier points are derived from the same entries
- `loyalty-SC-04` — A balance never goes negative
- `loyalty-SC-05` — Every debit is fully accounted
- `loyalty-SC-17` — Two tiers share an identifier
- `loyalty-SC-18` — No entry tier, or more than one
- `loyalty-SC-19` — The entry tier is not the lowest rung
- `loyalty-SC-20` — A higher tier is cheaper than the one below it
- `loyalty-SC-21` — Earned tiers measure over different windows
- `loyalty-SC-127` — A retention threshold asks more than the tier itself
- `loyalty-SC-128` — An earned tier has no validity period
- `loyalty-SC-129` — The programme has no inactivity window
- `loyalty-SC-22` — The programme names a zone that does not exist
- `loyalty-SC-23` — A purchase earns at the member's rate
- `loyalty-SC-130` — A fractional point is dropped
- `loyalty-SC-131` — Grade10 floors base points before the multiplier
- `loyalty-SC-24` — The second tier is reached by spending
- `loyalty-SC-132` — Tier records use the public identifiers
- `loyalty-SC-133` — Gold is retained by earning again
- `loyalty-SC-134` — Gold lapses after a quiet year
- `loyalty-SC-135` — A quiet year empties the balance
- `loyalty-SC-136` — A point is worth one Hong Kong dollar at checkout
- `loyalty-SC-25` — The top tier cannot be bought
- `loyalty-SC-29` — Repricing does not rewrite history
- `loyalty-SC-137` — Re-dating a reward's coupon does not shorten one already issued
- `loyalty-SC-30` — Stock is not oversold
- `loyalty-SC-31` — A reward outside its window cannot be redeemed
- `loyalty-SC-32` — The public menu shows only what a member can buy
- `loyalty-SC-138` — A reversal voids the coupon
- `loyalty-SC-139` — A collected reward cannot be reversed
- `loyalty-SC-140` — A waiting collection is cancelled by the reversal
- `loyalty-SC-141` — A used coupon cannot be reversed
- `loyalty-SC-142` — A member cannot reverse their own redemption
- `loyalty-SC-33` — Restored points keep their original expiry
- `loyalty-SC-143` — A reversal after the balance expired returns nothing
- `loyalty-SC-144` — Tier progress is untouched by a reversal
- `loyalty-SC-34` — An unlimited reward returns no stock
- `loyalty-SC-35` — A split refund matches a single refund
- `loyalty-SC-36` — A member who already spent the points is not driven negative
- `loyalty-SC-37` — A refund before its earning is not lost
- `loyalty-SC-38` — A claw-back cancels the tier contribution it removes
- `loyalty-SC-145` — A claw-back withdraws an unsupported retention extension
- `loyalty-SC-146` — A claw-back can demote
- `loyalty-SC-147` — The two counts are shown as two counts
- `loyalty-SC-59` — An operator's reason stays out of a member's view
- `loyalty-SC-60` — Retry keys and internal pricing stay out of a member's view
- `loyalty-SC-61` — A retired reward is still readable in history
- `loyalty-SC-62` — A member who never joined is invited to
- `loyalty-SC-63` — A double redemption costs one
- `loyalty-SC-148` — A coupon is readable as soon as it is issued
- `loyalty-SC-64` — Dates read in the programme's time zone

### loyalty-US-05: Operator runs the programme from one console

**As an** operator,
**I want** each action behind a named permission, with a record that cannot be rewritten,
**so that** I can correct, reverse, and find a member without holding powers I was not given.

**Accepted by:**

- `loyalty-SC-45` — A permission is required per action
- `loyalty-SC-149` — Moving points does not carry tier removal
- `loyalty-SC-46` — The record survives an attempt to rewrite it
- `loyalty-SC-47` — An action with no place to record it does not run
- `loyalty-SC-50` — Sections match permissions
- `loyalty-SC-51` — A missing second factor opens the gate
- `loyalty-SC-52` — A stale console reports what broke
- `loyalty-SC-53` — A member can be found again later
