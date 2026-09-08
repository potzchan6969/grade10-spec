## User journeys

### grade10-site-loyalty-programme-US-01: Member earns points on qualifying spend

**As a** member,
**I want** my balance to follow the money I spend and keep spent, priced once
at my tier's rate in the programme's own currency,
**so that** what I can redeem is exactly what my qualifying spend earned.

**Accepted by:**

- `grade10-site-loyalty-programme-SC-01` — Activity precedes joining
- `grade10-site-loyalty-programme-SC-03` — Balance excludes expired and spent points
- `grade10-site-loyalty-programme-SC-04` — A balance never goes negative
- `grade10-site-loyalty-programme-SC-05` — Every debit is fully accounted
- `grade10-site-loyalty-programme-SC-06` — Rounding happens once
- `grade10-site-loyalty-programme-SC-07` — A foreign currency is refused
- `grade10-site-loyalty-programme-SC-08` — Backdated activity keeps its own date
- `grade10-site-loyalty-programme-SC-09` — Future-dated activity is refused
- `grade10-site-loyalty-programme-SC-10` — A retry is free
- `grade10-site-loyalty-programme-SC-11` — A reused key with new input is refused
- `grade10-site-loyalty-programme-SC-23` — A purchase earns at the member's rate
- `grade10-site-loyalty-programme-SC-35` — A split refund matches a single refund
- `grade10-site-loyalty-programme-SC-36` — A member who already spent the points is not driven negative
- `grade10-site-loyalty-programme-SC-37` — A refund before its earning is not lost
- `grade10-site-loyalty-programme-SC-38` — A claw-back cancels the tier contribution it removes
- `grade10-site-loyalty-programme-SC-39` — Points survive an outage
- `grade10-site-loyalty-programme-SC-40` — A repeated delivery grants nothing twice
- `grade10-site-loyalty-programme-SC-41` — One money event, one identity
- `grade10-site-loyalty-programme-SC-42` — A partial refund claws back only its own part
- `grade10-site-loyalty-programme-SC-43` — A currency mismatch stops the product from starting
- `grade10-site-loyalty-programme-SC-44` — A refused recording is reported, not swallowed
- `grade10-site-loyalty-programme-SC-94` — Buying keeps the whole balance alive
- `grade10-site-loyalty-programme-SC-95` — Redeeming also resets the window
- `grade10-site-loyalty-programme-SC-96` — Expiry needs no sweep
- `grade10-site-loyalty-programme-SC-97` — Expired points do not come back
- `grade10-site-loyalty-programme-SC-98` — A correction does not extend the balance's life
- `grade10-site-loyalty-programme-SC-99` — A campaign grant does not keep the balance alive
- `grade10-site-loyalty-programme-SC-100` — A spend too small to earn still counts as activity
- `grade10-site-loyalty-programme-SC-101` — A late record cannot shorten the balance's life
- `grade10-site-loyalty-programme-SC-102` — A partial sweep converges
- `grade10-site-loyalty-programme-SC-150` — The window is calendar months, not a day count
- `grade10-site-loyalty-programme-SC-151` — A record older than the window is written already lapsed

### grade10-site-loyalty-programme-US-02: Member advances through the tier ladder

**As a** member,
**I want** my tier derived from what I earned and kept when those points
expire,
**so that** the rate I earn at reflects the standing I reached rather than what
my balance happens to be today.

**Accepted by:**

- `grade10-site-loyalty-programme-SC-14` — Earned tier holds after points expire
- `grade10-site-loyalty-programme-SC-15` — An invitation lapse is observed, not scheduled
- `grade10-site-loyalty-programme-SC-16` — Tier history records each move
- `grade10-site-loyalty-programme-SC-17` — Two tiers share an identifier
- `grade10-site-loyalty-programme-SC-18` — No entry tier, or more than one
- `grade10-site-loyalty-programme-SC-19` — The entry tier is not the lowest rung
- `grade10-site-loyalty-programme-SC-20` — A higher tier is cheaper than the one below it
- `grade10-site-loyalty-programme-SC-21` — Earned tiers measure over different windows
- `grade10-site-loyalty-programme-SC-22` — The programme names a zone that does not exist
- `grade10-site-loyalty-programme-SC-24` — The second tier is reached by spending
- `grade10-site-loyalty-programme-SC-25` — The top tier cannot be bought

### grade10-site-loyalty-programme-US-03: Member redeems points for a reward

**As a** member,
**I want** to spend my points on a reward at the price it carried when I
redeemed it,
**so that** a later reprice, a sell-out or a reversal never changes what that
redemption cost me.

**Accepted by:**

- `grade10-site-loyalty-programme-SC-29` — Repricing does not rewrite history
- `grade10-site-loyalty-programme-SC-30` — Stock is not oversold
- `grade10-site-loyalty-programme-SC-31` — A reward outside its window cannot be redeemed
- `grade10-site-loyalty-programme-SC-32` — The public menu shows only what a member can buy
- `grade10-site-loyalty-programme-SC-33` — Restored points keep their original expiry
- `grade10-site-loyalty-programme-SC-34` — An unlimited reward returns no stock
- `grade10-site-loyalty-programme-SC-63` — A double redemption costs one

### grade10-site-loyalty-programme-US-04: Member runs their membership from one surface

**As a** member,
**I want** my tier, balance, progress and expiring points on one surface, in
the programme's own dates,
**so that** I can join and read my own activity without being shown the
operating record behind it.

**Accepted by:**

- `grade10-site-loyalty-programme-SC-02` — Joining is idempotent
- `grade10-site-loyalty-programme-SC-59` — An operator's reason stays out of a member's view
- `grade10-site-loyalty-programme-SC-60` — Retry keys and internal pricing stay out of a member's view
- `grade10-site-loyalty-programme-SC-61` — A retired reward is still readable in history
- `grade10-site-loyalty-programme-SC-62` — A member who never joined is invited to
- `grade10-site-loyalty-programme-SC-64` — Dates read in the programme's time zone

### grade10-site-loyalty-programme-US-05: Operator runs the programme from one console

**As an** operator,
**I want** to find a member and act on their loyalty under my own permissions,
**so that** I can correct, reward and invite without holding powers I was not
given, and every change I made stays provable.

**Accepted by:**

- `grade10-site-loyalty-programme-SC-26` — A grant names an unknown tier
- `grade10-site-loyalty-programme-SC-27` — A grant names the entry tier
- `grade10-site-loyalty-programme-SC-28` — Live grants can be found
- `grade10-site-loyalty-programme-SC-45` — A permission is required per action
- `grade10-site-loyalty-programme-SC-46` — The record survives an attempt to rewrite it
- `grade10-site-loyalty-programme-SC-47` — An action with no place to record it does not run
- `grade10-site-loyalty-programme-SC-48` — A correction does not move a member up
- `grade10-site-loyalty-programme-SC-49` — A campaign grant moves a member up
- `grade10-site-loyalty-programme-SC-50` — Sections match permissions
- `grade10-site-loyalty-programme-SC-51` — A missing second factor opens the gate
- `grade10-site-loyalty-programme-SC-52` — A stale console reports what broke
- `grade10-site-loyalty-programme-SC-53` — A member can be found again later
- `grade10-site-loyalty-programme-SC-54` — A loyalty permission alone shows no identities
- `grade10-site-loyalty-programme-SC-55` — A service connection is not an authorisation
- `grade10-site-loyalty-programme-SC-56` — Identity is never served from a shared cache
- `grade10-site-loyalty-programme-SC-57` — An identity read is recorded without copying the identities
- `grade10-site-loyalty-programme-SC-58` — A failed identity read does not degrade to blanks
