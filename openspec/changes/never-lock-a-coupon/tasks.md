## 1. Settle what the shop actually gave (grade10)

- [x] 1.1 A paid sale that does not carry the reward it promised gives it back inside the paid transaction, so the capture stops spending a coupon for a cut nobody gave and the surviving code dies with it
- [x] 1.2 A paid sale carrying a reward code its own order no longer claims is counted and reported with the order on it
- [x] 1.3 The till's own trim reaches a sale that expired before it was paid, which is every sale paid more than an hour after its plan
- [x] 1.4 A reward's code runs from the order's own creation, so the claim behind it always outlasts it — a refused mint that leaves a claim standing costs nothing, because a row with no code frees its coupon at settlement
- [x] 1.5 The stale-claim sweep outlasts the code minted for the claim

## 2. Supersede frees the coupon (grade10)

- [x] 2.1 The supersede pass reads the statuses a sale can still be paid from, so a counter sale the member walked away from is seen
- [x] 2.2 Its counter branch takes the claimed coupon off the sale and enqueues its release; the sale keeps its cart and collects without the cut
- [x] 2.3 It answers which coupon it could not free, and the claim refuses by name rather than letting the programme say the coupon is unavailable
- [x] 2.4 The till runs the pass inside its own plan, holding the sale it is planning out of its own reach
- [x] 2.5 A plan survives its own supersede: the row being written is the survivor, not the newest draft
- [x] 2.6 The reward mint's write is keyed on the usage it was minted for, so a checkout that lost its claim cannot leave a live code behind
- [x] 2.7 A claim that loses the race retries once, so the racer's row is there to be superseded

## 3. Offer what can be spent (grade10)

- [x] 3.1 One status set names where a claim can be taken back, read by the supersede and the cart drawer alike
- [x] 3.2 A claimed coupon that lapses reads lapsed, in every surface at once
- [x] 3.3 The till panel offers every coupon that is not spent, lapsed or void

## 4. Make the counter honest (grade10)

- [x] 4.1 A dropped reward's code stops being handed back to the till
- [x] 4.2 A sale a reward has left mints no more reward codes, and says so in the counter's own words
- [x] 4.3 The plan result names the member's coupon, so the extension can say when it leaves
- [x] 4.4 A reward refusal reaches the till as a sentence rather than an empty code inside a translated one

## 5. Say the refusal (grade10, grade10-spec)

- [x] 5.1 The refusal has a cause of its own, and copy in every language the store speaks

## 6. Prove it (grade10)

- [x] 6.1 A coupon on an unfinished checkout is claimed by the next one, and the earlier order is cancelled with its code dead
- [x] 6.2 A counter sale keeps its cart and loses its cut when the member spends the coupon online
- [x] 6.3 A second till takes the coupon from the first
- [x] 6.4 The reveal succeeds where an online checkout holds the coupon, and does not kill the sale it is revealing into
- [x] 6.5 A claim is refused by name where the earlier checkout will not die
- [x] 6.6 A sale that collects a deactivated code spends the coupon once and reports the other; one that carries nothing gives it back
- [x] 6.7 End to end across both ledgers: redeem, claim, move, settle — the programme's own claim and settlement, not a fake

## 7. Say what changed (grade10, grade10-spec)

- [x] 7.1 The commerce and loyalty architecture docs stop describing the claim as a lock and the sweep as the floor under it
- [x] 7.2 The PRD pages carry what a member and a shopkeeper each read

## 8. Let the programme free the key with the claim (grade10, grade10-spec)

- [x] 8.1 A key answers only while its claim is live, so a sale that gave a claim back and asks again is answered rather than refused with a coupon sitting in the member's wallet
- [x] 8.2 A retry of a claim that still stands replays it, and a claim the shop already collected still refuses a second
- [x] 8.3 A counter sale that runs out its own clock gives its coupon back, the move the supersede pass already makes on one it ends
- [x] 8.4 A Coupon claim is written onto an order only by a guarded write that refuses to write over a live one; nothing carries it in on an insert's conflict arm
- [x] 8.5 The gift a claim promised is written where the claim ends, so a paid sale that carried a gift line the order had given up can still be read
- [x] 8.6 The release outbox stops claiming a job that has spent its attempts, and reports what is owed, what has stopped, and how old the oldest is
