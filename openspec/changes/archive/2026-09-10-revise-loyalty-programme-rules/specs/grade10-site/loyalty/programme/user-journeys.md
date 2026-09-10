## User journeys

### grade10-site-loyalty-programme-US-01: Member holds one balance, with tier progress counted apart

**As a** member,
**I want** earning to count toward both and redeeming to spend only the balance,
**so that** spending points cannot take my tier, and losing the balance cannot take it either.

**Accepted by:**

- `grade10-site-loyalty-programme-SC-70` — Redeeming costs no tier progress
- `grade10-site-loyalty-programme-SC-71` — Earning adds to the balance and the progress
- `grade10-site-loyalty-programme-SC-72` — Losing the balance does not lose the tier
- `grade10-site-loyalty-programme-SC-73` — Losing the tier does not lose the balance
- `grade10-site-loyalty-programme-SC-74` — A first purchase can promote
- `grade10-site-loyalty-programme-SC-75` — The triggering purchase earns at the old rate
- `grade10-site-loyalty-programme-SC-76` — A promotion dates the validity period
- `grade10-site-loyalty-programme-SC-77` — Re-qualifying keeps the tier
- `grade10-site-loyalty-programme-SC-78` — Not re-qualifying drops the tier
- `grade10-site-loyalty-programme-SC-79` — Losing a tier resets the climb
- `grade10-site-loyalty-programme-SC-80` — Spending points does not demote
- `grade10-site-loyalty-programme-SC-81` — A drop is observed, not scheduled
- `grade10-site-loyalty-programme-SC-82` — An operator removes a tier granted in error
- `grade10-site-loyalty-programme-SC-83` — Tier history records each move

### grade10-site-loyalty-programme-US-02: Member earns only on what they actually paid

**As a** member,
**I want** points from qualifying goods I paid for, and inactivity to expire the balance,
**so that** a discount, a gift card, or an auction win does not invent earn, and a quiet year empties spendable points.

**Accepted by:**

- `grade10-site-loyalty-programme-SC-84` — A discount reduces what the purchase earns
- `grade10-site-loyalty-programme-SC-85` — A coupon reduces what the purchase it pays for earns
- `grade10-site-loyalty-programme-SC-86` — An order discount cannot be pushed onto the non-earning lines
- `grade10-site-loyalty-programme-SC-87` — A fully discounted order earns nothing
- `grade10-site-loyalty-programme-SC-88` — Shipping and service fees earn nothing
- `grade10-site-loyalty-programme-SC-89` — A gift card earns once, not twice
- `grade10-site-loyalty-programme-SC-90` — An auction win earns nothing
- `grade10-site-loyalty-programme-SC-91` — A credit top-up earns nothing
- `grade10-site-loyalty-programme-SC-92` — An unlisted category earns nothing
- `grade10-site-loyalty-programme-SC-93` — An entry names its channel
- `grade10-site-loyalty-programme-SC-94` — Buying keeps the whole balance alive
- `grade10-site-loyalty-programme-SC-95` — Redeeming also resets the window
- `grade10-site-loyalty-programme-SC-96` — Expiry needs no sweep
- `grade10-site-loyalty-programme-SC-97` — Expired points do not come back
- `grade10-site-loyalty-programme-SC-98` — A correction does not extend the balance's life
- `grade10-site-loyalty-programme-SC-99` — A campaign grant does not keep the balance alive
- `grade10-site-loyalty-programme-SC-100` — A spend too small to earn still counts as activity
- `grade10-site-loyalty-programme-SC-101` — A late record cannot shorten the balance's life
- `grade10-site-loyalty-programme-SC-102` — A partial sweep converges

### grade10-site-loyalty-programme-US-03: Member redeems and can pay with points at checkout

**As a** member,
**I want** a redemption to settle as the reward it is, and points to reduce a bill at the programme's rate,
**so that** I cannot undo a spent reward, and deleting my account ends membership at once.

**Accepted by:**

- `grade10-site-loyalty-programme-SC-103` — A physical reward is not a discount code
- `grade10-site-loyalty-programme-SC-104` — A member cannot undo a redemption
- `grade10-site-loyalty-programme-SC-105` — A coupon expires on its own terms
- `grade10-site-loyalty-programme-SC-106` — Points buy nothing at an auction
- `grade10-site-loyalty-programme-SC-107` — One balance across both channels
- `grade10-site-loyalty-programme-SC-108` — The channel's copy is not the balance
- `grade10-site-loyalty-programme-SC-109` — Points reduce the bill
- `grade10-site-loyalty-programme-SC-110` — The part paid with points earns nothing
- `grade10-site-loyalty-programme-SC-111` — One debit however the channel settles it
- `grade10-site-loyalty-programme-SC-113` — Deletion clears what the member held
- `grade10-site-loyalty-programme-SC-114` — Deletion does not wait for a window
- `grade10-site-loyalty-programme-SC-115` — Base points floor before the multiplier
- `grade10-site-loyalty-programme-SC-116` — A single floor at the end
- `grade10-site-loyalty-programme-SC-117` — A foreign currency is refused
- `grade10-site-loyalty-programme-SC-118` — Backdated activity keeps its own date
- `grade10-site-loyalty-programme-SC-119` — Future-dated activity is refused
- `grade10-site-loyalty-programme-SC-120` — An expired unused code returns nothing by itself
- `grade10-site-loyalty-programme-SC-121` — An operator cancellation is the credit path
- `grade10-site-loyalty-programme-SC-122` — A used artifact is never reversed

### grade10-site-loyalty-programme-US-04: Member reads two counts and redeems from one surface

**As a** member,
**I want** my tier, balance, and activity on one surface, in the programme's dates,
**so that** I can join, redeem, and never see the operator's reasons behind an entry.

**Accepted by:**

- `grade10-site-loyalty-programme-SC-123` — The two counts are never summed
- `grade10-site-loyalty-programme-SC-124` — A member's activity carries nothing operator-facing
- `grade10-site-loyalty-programme-SC-125` — The components take content, not sources
- `grade10-site-loyalty-programme-SC-03` — Balance excludes expired and spent points
- `grade10-site-loyalty-programme-SC-126` — Tier progress is derived from the same entries
- `grade10-site-loyalty-programme-SC-04` — A balance never goes negative
- `grade10-site-loyalty-programme-SC-05` — Every debit is fully accounted
- `grade10-site-loyalty-programme-SC-17` — Two tiers share an identifier
- `grade10-site-loyalty-programme-SC-18` — No entry tier, or more than one
- `grade10-site-loyalty-programme-SC-19` — The entry tier is not the lowest rung
- `grade10-site-loyalty-programme-SC-20` — A higher tier is cheaper than the one below it
- `grade10-site-loyalty-programme-SC-21` — Earned tiers measure over different windows
- `grade10-site-loyalty-programme-SC-127` — A retention threshold asks more than the tier itself
- `grade10-site-loyalty-programme-SC-128` — An earned tier has no validity period
- `grade10-site-loyalty-programme-SC-129` — The programme has no inactivity window
- `grade10-site-loyalty-programme-SC-22` — The programme names a zone that does not exist
- `grade10-site-loyalty-programme-SC-23` — A purchase earns at the member's rate
- `grade10-site-loyalty-programme-SC-130` — A fractional point is dropped
- `grade10-site-loyalty-programme-SC-131` — Grade10 floors base points before the multiplier
- `grade10-site-loyalty-programme-SC-24` — The second tier is reached by spending
- `grade10-site-loyalty-programme-SC-132` — Tier records use the public identifiers
- `grade10-site-loyalty-programme-SC-133` — Gold is retained by earning again
- `grade10-site-loyalty-programme-SC-134` — Gold lapses after a quiet year
- `grade10-site-loyalty-programme-SC-135` — A quiet year empties the balance
- `grade10-site-loyalty-programme-SC-136` — A point is worth one Hong Kong dollar at checkout
- `grade10-site-loyalty-programme-SC-25` — The top tier cannot be bought
- `grade10-site-loyalty-programme-SC-29` — Repricing does not rewrite history
- `grade10-site-loyalty-programme-SC-137` — Re-dating a reward's coupon does not shorten one already issued
- `grade10-site-loyalty-programme-SC-30` — Stock is not oversold
- `grade10-site-loyalty-programme-SC-31` — A reward outside its window cannot be redeemed
- `grade10-site-loyalty-programme-SC-32` — The public menu shows only what a member can buy
- `grade10-site-loyalty-programme-SC-138` — A reversal voids the coupon
- `grade10-site-loyalty-programme-SC-139` — A collected reward cannot be reversed
- `grade10-site-loyalty-programme-SC-140` — A waiting collection is cancelled by the reversal
- `grade10-site-loyalty-programme-SC-141` — A used coupon cannot be reversed
- `grade10-site-loyalty-programme-SC-142` — A member cannot reverse their own redemption
- `grade10-site-loyalty-programme-SC-33` — Restored points keep their original expiry
- `grade10-site-loyalty-programme-SC-143` — A reversal after the balance expired returns nothing
- `grade10-site-loyalty-programme-SC-144` — Tier progress is untouched by a reversal
- `grade10-site-loyalty-programme-SC-34` — An unlimited reward returns no stock
- `grade10-site-loyalty-programme-SC-35` — A split refund matches a single refund
- `grade10-site-loyalty-programme-SC-36` — A member who already spent the points is not driven negative
- `grade10-site-loyalty-programme-SC-37` — A refund before its earning is not lost
- `grade10-site-loyalty-programme-SC-38` — A claw-back cancels the tier contribution it removes
- `grade10-site-loyalty-programme-SC-145` — A claw-back withdraws an unsupported retention extension
- `grade10-site-loyalty-programme-SC-146` — A claw-back can demote
- `grade10-site-loyalty-programme-SC-147` — The two counts are shown as two counts
- `grade10-site-loyalty-programme-SC-59` — An operator's reason stays out of a member's view
- `grade10-site-loyalty-programme-SC-60` — Retry keys and internal pricing stay out of a member's view
- `grade10-site-loyalty-programme-SC-61` — A retired reward is still readable in history
- `grade10-site-loyalty-programme-SC-62` — A member who never joined is invited to
- `grade10-site-loyalty-programme-SC-63` — A double redemption costs one
- `grade10-site-loyalty-programme-SC-148` — A coupon is readable as soon as it is issued
- `grade10-site-loyalty-programme-SC-64` — Dates read in the programme's time zone

### grade10-site-loyalty-programme-US-05: Operator runs the programme from one console

**As an** operator,
**I want** each action behind a named permission, with a record that cannot be rewritten,
**so that** I can correct, reverse, and find a member without holding powers I was not given.

**Accepted by:**

- `grade10-site-loyalty-programme-SC-45` — A permission is required per action
- `grade10-site-loyalty-programme-SC-149` — Moving points does not carry tier removal
- `grade10-site-loyalty-programme-SC-46` — The record survives an attempt to rewrite it
- `grade10-site-loyalty-programme-SC-47` — An action with no place to record it does not run
- `grade10-site-loyalty-programme-SC-50` — Sections match permissions
- `grade10-site-loyalty-programme-SC-51` — A missing second factor opens the gate
- `grade10-site-loyalty-programme-SC-52` — A stale console reports what broke
- `grade10-site-loyalty-programme-SC-53` — A member can be found again later
