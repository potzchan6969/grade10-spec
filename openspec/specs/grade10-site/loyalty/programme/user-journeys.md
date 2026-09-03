## User journeys

### loyalty-US-01: Member earns points on qualifying spend

**As a** member,
**I want** my balance to follow the money I spend and keep spent, priced once
at my tier's rate in the programme's own currency,
**so that** what I can redeem is exactly what my qualifying spend earned.

**Accepted by:**

- `loyalty-SC-01` — Activity precedes joining
- `loyalty-SC-03` — Balance excludes expired and spent points
- `loyalty-SC-04` — A balance never goes negative
- `loyalty-SC-05` — Every debit is fully accounted
- `loyalty-SC-06` — Rounding happens once
- `loyalty-SC-07` — A foreign currency is refused
- `loyalty-SC-08` — Backdated activity keeps its own date
- `loyalty-SC-09` — Future-dated activity is refused
- `loyalty-SC-10` — A retry is free
- `loyalty-SC-11` — A reused key with new input is refused
- `loyalty-SC-12` — Expiry needs no sweep
- `loyalty-SC-13` — A partial sweep converges
- `loyalty-SC-23` — A purchase earns at the member's rate
- `loyalty-SC-35` — A split refund matches a single refund
- `loyalty-SC-36` — A member who already spent the points is not driven negative
- `loyalty-SC-37` — A refund before its earning is not lost
- `loyalty-SC-38` — A claw-back cancels the tier contribution it removes
- `loyalty-SC-39` — Points survive an outage
- `loyalty-SC-40` — A repeated delivery grants nothing twice
- `loyalty-SC-41` — One money event, one identity
- `loyalty-SC-42` — A partial refund claws back only its own part
- `loyalty-SC-43` — A currency mismatch stops the product from starting
- `loyalty-SC-44` — A refused recording is reported, not swallowed

### loyalty-US-02: Member advances through the tier ladder

**As a** member,
**I want** my tier derived from what I earned and kept when those points
expire,
**so that** the rate I earn at reflects the standing I reached rather than what
my balance happens to be today.

**Accepted by:**

- `loyalty-SC-14` — Earned tier holds after points expire
- `loyalty-SC-15` — An invitation lapse is observed, not scheduled
- `loyalty-SC-16` — Tier history records each move
- `loyalty-SC-17` — Two tiers share an identifier
- `loyalty-SC-18` — No entry tier, or more than one
- `loyalty-SC-19` — The entry tier is not the lowest rung
- `loyalty-SC-20` — A higher tier is cheaper than the one below it
- `loyalty-SC-21` — Earned tiers measure over different windows
- `loyalty-SC-22` — The programme names a zone that does not exist
- `loyalty-SC-24` — The second tier is reached by spending
- `loyalty-SC-25` — The top tier cannot be bought

### loyalty-US-03: Member redeems points for a reward

**As a** member,
**I want** to spend my points on a reward at the price it carried when I
redeemed it,
**so that** a later reprice, a sell-out or a reversal never changes what that
redemption cost me.

**Accepted by:**

- `loyalty-SC-29` — Repricing does not rewrite history
- `loyalty-SC-30` — Stock is not oversold
- `loyalty-SC-31` — A reward outside its window cannot be redeemed
- `loyalty-SC-32` — The public menu shows only what a member can buy
- `loyalty-SC-33` — Restored points keep their original expiry
- `loyalty-SC-34` — An unlimited reward returns no stock
- `loyalty-SC-63` — A double redemption costs one

### loyalty-US-04: Member runs their membership from one surface

**As a** member,
**I want** my tier, balance, progress and expiring points on one surface, in
the programme's own dates,
**so that** I can join and read my own activity without being shown the
operating record behind it.

**Accepted by:**

- `loyalty-SC-02` — Joining is idempotent
- `loyalty-SC-59` — An operator's reason stays out of a member's view
- `loyalty-SC-60` — Retry keys and internal pricing stay out of a member's view
- `loyalty-SC-61` — A retired reward is still readable in history
- `loyalty-SC-62` — A member who never joined is invited to
- `loyalty-SC-64` — Dates read in the programme's time zone

### loyalty-US-05: Operator runs the programme from one console

**As an** operator,
**I want** to find a member and act on their loyalty under my own permissions,
**so that** I can correct, reward and invite without holding powers I was not
given, and every change I made stays provable.

**Accepted by:**

- `loyalty-SC-26` — A grant names an unknown tier
- `loyalty-SC-27` — A grant names the entry tier
- `loyalty-SC-28` — Live grants can be found
- `loyalty-SC-45` — A permission is required per action
- `loyalty-SC-46` — The record survives an attempt to rewrite it
- `loyalty-SC-47` — An action with no place to record it does not run
- `loyalty-SC-48` — A correction does not move a member up
- `loyalty-SC-49` — A campaign grant moves a member up
- `loyalty-SC-50` — Sections match permissions
- `loyalty-SC-51` — A missing second factor opens the gate
- `loyalty-SC-52` — A stale console reports what broke
- `loyalty-SC-53` — A member can be found again later
- `loyalty-SC-54` — A loyalty permission alone shows no identities
- `loyalty-SC-55` — A service connection is not an authorisation
- `loyalty-SC-56` — Identity is never served from a shared cache
- `loyalty-SC-57` — An identity read is recorded without copying the identities
- `loyalty-SC-58` — A failed identity read does not degrade to blanks
