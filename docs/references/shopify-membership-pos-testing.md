# Resilience suite — loyalty, membership and POS

The settled test plan for the loyalty engine and the Shopify membership +
POS work (`shopify-membership-pos.md`). Drafted by one advisory pass per
part, argued down by an adversarial pass that read the code and the
existing suites, then settled. Every "already in place" and "fails today"
claim below was verified against the tree as of this writing.

## What this suite is for

Two things go wrong in a points system: money is minted or destroyed silently, and a green suite says otherwise. This plan targets both.

It proves five properties end to end:

- **Points are conserved.** Every earn is bounded, every claw-back takes back exactly what its earn granted, no path mints value twice or removes value twice.
- **Every writer is guarded.** Money moves only under the member lock, a guarded single-row UPDATE, or a unique index — and each of those is observed with two real sessions, not assumed.
- **Terminal states are terminal.** A deleted pairing row, an erased customer, a reversed redemption and a used code can never be walked backwards by any writer, including ones added later.
- **The till cannot exceed the member.** A POS session acts only on the member it identified, for the amount it previewed, inside its own lifetime, and every action is in the audit chain and visible to the member.
- **Nothing ships unrun.** Every workspace member resolves to a lane, every shared behavior suite is mounted by every brand that owns its schema, and every root check/test script is named by a workflow.

**The gate is reachability, not coverage percentage.** Every green-suite lie this repo has actually had was non-execution — a spec no glob collected, a lane no script ran, a package no lane held. A percentage gate is satisfied by tests that assert nothing; the three reachability rules above are mechanically checkable and land in `scripts/check-lib-wiring.mjs`, which already runs on every PR.

**Seven defects are confirmed in shipped code.** Their tests fail today and are the reason to run the plan at all (number 5 is fixed on the current branch; its test stays as the regression pin):

1. The refund money cursor never advances when a claw-back reaches zero points (`refunds.ts:163` returns before `applyDebit`), so the next refund event re-prices the order from scratch.
2. Reversing a hand-settled redemption refunds the points and leaves the minted discount code live at the vendor.
3. A tier attained on 29 February is retained by the points that attained it — the term end clamps to 28 February and the period start derives one day behind the attaining earn. A free extra year at 1.2x.
4. Computed earn is bounded by nothing and overflows the int4 ledger columns.
5. Reconcile writes refunds under a synthesised ref on a total basis while the webhook writes the vendor's refund id on a delta basis — reconcile-then-webhook double-counts every refund. Fixed on this branch: one shared recorder keyed on the vendor's refund id, fed by webhook and reconcile alike.
6. A spend backdated past the expiry window on a clockless member writes points that are dead on arrival, while the receipt and the earn metric both claim them.
7. `parseProgramConfig` silently ignores unknown keys, so a documented flag can be switched on into a no-op.

One proof gap rides with them: nothing shows `packages/worker`'s elevated ladder records raw input by default — the exact behaviour `posProcedure` inherits for its audit rows. The behaviour exists; the test that keeps it existing does not.

**One finding is a preference, not a defect — and preferences are deployed configuration.** Whether a full refund takes back the tier it reached is an open product call. The engine keeps the tier today ("the end never retreats while one tier reigns"), and the claw-back already stops the refunded points counting toward retention through the revoke's consumptions dated at the root credit; the owner may yet prefer re-evaluation. So the plan does what rounding already did: build both behaviours, let one deployed switch pick, and exercise both branches continuously so the unpicked one cannot rot. These one-way-or-undo preferences gather in one `policies` block of the programme config — the tier's refund effect, the expired-redemption reclaim the docs already promise, and the re-attribution shortfall rule — each defaulting to "what happened stands", all confirmed later in one pass. The excess-property refusal (defect 7's fix) is what makes the block trustworthy: a typo'd policy key fails at boot instead of parsing into a no-op.

**Fix the shape, not the instance.** Each defect is one instance of a structural habit, and the fix lands on the habit:

- *A fact derived from a side effect* (1, 3, 5). The refund cursor is reconstructed from revoke rows, so a zero-point claw-back loses the money fact; the retention period start is re-derived by inverting clamped month arithmetic when the activation instant is already stored; reconcile mints its own identity for a refund Shopify already named. Record the fact once and read it back: refund progress advanced unconditionally by the pass that owns it, the period start read from the stored anchor, every external refund keyed by the vendor's refund id through one shared recorder that the webhook and reconcile both feed.
- *An invariant enforced at the boundary instead of by its owner* (4, 7). Transport schemas bound each field, so nothing bounds the product; the config decoder tolerates unknown keys, so a documented flag parses into a no-op. The ceiling moves onto the ledger writers, where every producer inherits it — the quantity-redeem product lands on the same guard — and config decoding refuses excess properties, closing every typo'd key at boot.
- *A state machine with a fall-through, keyed on a proxy* (2). Reversal deactivates by the artifact when the persisted code is the fact, and the unmatched combination falls through an `else`. The mapping becomes a closed table keyed on what is actually stored; an unknown combination is an error, never a pass-through.
- *A clamp scattered across branches* (6). The null-clock branch writes a past date the non-null branch could not. One function owns the life a credit gets, every caller and metric derives from its answer, and a credit born dead is a loud refusal or an explicit answer — never a receipt claiming points the balance will not show.

---

## Earning

### Failure modes

| Title | Scenario | Severity |
|---|---|---|
| Stale refund cursor | `recordRefund` advances the money cursor only by writing a `revoke` row, and `applied === 0` returns before `applyDebit`. A refund that reaches an empty balance leaves the cursor at zero, so the next refund event re-prices the order from the first credit's rate — under-clawing on a split refund, and re-clawing the whole order on a re-delivery with a fresh event id. | high |
| Refund carries no currency | `RecordRefundInput` has no `currency`. The web drain refuses a currency mismatch for the whole drain, but external-order refunds ingest ahead of identity as ownerless refund event rows and are replayed at attribution time; ingestion's own currency refusal guards the order row, not the replay. Foreign minor units get priced as programme minor units. | high |
| Unbounded computed earn | `amountMinor` is capped at 1e12 and admin `points` at 1e8 as independent bounds; the product is bounded by nothing. On the flat programme 1e12/100 × 2.5 = 2.5e10 overflows the int4 `amount` column as an opaque database error; on the ladder it silently mints 1.7e9 points. Quantity redeem (`pointCost × quantity`) is a second unbounded product landing on the same columns. | high |
| Revoke-then-re-attribute mints silently | Revoking an external order's claim emits a claw-back against member A. If A spent the points, it clamps to zero and reports a shortfall. Re-attribution then earns the full amount for B. Under the programme's one-way rule that cost is accepted — but only as a recorded one: if the shortfall is not surfaced to the operator at re-attribution time and counted, one order's money mints twice with nobody told, and re-claiming to the same member doubles their earn invisibly. | high |
| Unearnable refund poisons the queue | An order too small to earn a point writes no ledger row. Its refund throws `NotFound` with no stored result, and the store's sink re-queues on every refusal. A permanent retry loop, a permanently failing metric, and nothing actually wrong. | medium |
| Dead-on-arrival earn | A backfill dated 400 days back for a member with no clock: `resetActivityClock` moves the clock only forwards, so with a null clock it writes the past date unchanged. The credit is born dead — the call answers 100 points and balance 0, and the earn metric counts 100. | medium |
| Metrics counted inside the transaction | Duplicate webhook delivery is routine. An earn metric emitted before the replay check inflates the earn and liability dashboards with no extra ledger row — a monitoring lie that hides a real over-earn. | medium |
| Writer label inside request identity | The service stamps `writtenBy` into the fingerprinted input, so the same order event retried through a second binding is a CONFLICT nobody can clear. Two new writers are planned. | medium |
| Basis label cannot be verified | `insertCredit` writes `basis` from config, never from what the caller computed. The sink can only compare a config string to its own constant, so two ingestion paths can send money on different rules under one label and nothing fires. | medium |

### Tests — unit

- **Points ceiling on the ledger writers.** `insertCredit` and `applyDebit` refuse a points value above `MAX_POINTS` with a loyalty validation error, naming the ceiling, writing nothing. Placed on the writers rather than on `computeEarnedPoints` so every producer of a computed points figure inherits the bound — the earn product today, the quantity-redeem product next. Includes one case seeding a balance above 2^31 and asserting `getBalance` (`::int`) and `getOutstandingPoints` (`::bigint`) agree or both refuse.
- **`computeEarnedPoints` under both rounding configs** — already in place.
- **`occurredAt` skew allowance and future-date refusal** — already in place. *The suite half of this coverage is mislabelled: the backdated case runs through a helper that passes `occurredAt` as `now`, against a member whose clock is already a year out. It proves the opposite of a backfill and must not be cited as covering backdating.*
- **`walkPoints`: own-rate pricing, split additivity, cursor advance, over-refund buys nothing** — already in place.

### Tests — behavior suite (pglite)

- **A claw-back that reached nothing still remembers the money it refunded.** Two credits at two rates on one order (720 points), redeem all, refund the first tranche (applies 0), reverse the redemption, refund the last tranche. The second event must claw 120 — the dearer credit's own rate — and the points taken across all refund events must never exceed 720. Absorbs the over-refund boundary: a second refund event with a fresh event id after a full refund applies 0, proven from the stored `revoke` rows.
- **Revoke-then-re-attribute is a recorded cost, never a silent one.** Earn on an external order for A, redeem, revoke the claim (claw-back applies 0, shortfall recorded), re-attribute to B, B earns in full. The starting policy is the one-way default: A's spend stands, B's purchase earns, and the unreachable claw-back is a counted cost the re-attribution answer surfaces at decision time. Whether re-attribution should instead be blocked on an unreachable claw-back is a switch in the same policies block, confirmed with the rest; the test asserts the surfaced shortfall either way. Repeat with A as the re-claimant: two earn credits, the same surfaced shortfall, never an invisible second mint.
- **A refund of an order too small to earn settles instead of retrying forever.** Spend 999 minor units (no row written), refund 999, expect a completed mutation of applied 0 / shortfall 0. The remedy is loyalty's, not the seller's: `recordRefund` answers zero-zero when a completed `earn:<event>` mutation result exists for that reference with zero points. The seller cannot own it — the sink does not keep the earn's answer.
- **A backdated spend against a clockless member is dead on arrival.** One table over {clock a year ahead, no clock at all} × {`occurredAt` inside the window, outside it}. The clock-ahead / outside-window cell is already in place and proves the credit rides the member's clock; the clockless / outside-window cell is the new one and fails today. Pins what the result and the earn metric report for points nobody can spend.
- **A replayed spend and a conflicting one count no points earned.** One `loyalty.points.earned` marker in total across a spend, its replay and a conflict — the capture-inside / emit-after-commit shape for the path duplicate deliveries actually take.
- **The same event id through two bindings replays.** `writtenBy` is provenance, not identity: it has its own append-only column. Exclude it from the fingerprint and assert the second call replays rather than conflicting. Two new writers are planned; a CONFLICT nobody can clear is not the behaviour to pin.
- **Refuses a claw-back in another currency.** Add `currency` to `RecordRefundInput`, the RPC schema and the external refund replay path; the test is what makes the field load-bearing. Framed on the external-order seam, which is the one with no rule today.
- **Every earn credit reconciles with its own money.** An invariant over earn rows: `basePoints === floor(amountMinor / minorUnitsPerPoint)`. Breaks the moment a path sends money on a different basis than its label claims. Paired with an assertion that both ingestion paths check against the *same* basis constant.
- **Refuses money in another currency (spend path)** — already in place.
- **Replays a spend with the same event id; refuses one reused for a different request or event time** — already in place.
- **Claw-back clamping, shortfall by cause, lineage through a reversal, refund before its earn** — already in place.
- **Ledger invariants after every scenario** — already in place. *These cannot cover the stale refund cursor: taking the wrong number of points still leaves every row internally consistent, so both totals agree and every balance reconciles while the member is robbed. Invariants are orthogonal to pricing correctness.*

### Not built

`_program` is unused in `recordRefund` and pricing already comes from the stored credit rows. Delete the parameter rather than writing a test that an unused argument stays unused. Enumerating malformed money against the RPC entrypoint tests Effect Schema. A backdated spend earning at today's tier is arithmetically an ordinary spend and is already fixed by the existing multiplier test.

---

## Expiry and ledger

### Failure modes

| Title | Scenario | Severity |
|---|---|---|
| One expiry rule, three implementations | `isAlive`/`isExpired` use `greatest(expires_at, activity_expires_at)`; the sweep's candidate scan uses two conjuncts so the indexes stay usable, plus `remaining > 0`; `effectiveExpiry` in TypeScript is a third copy read by the operator page and the invariant walk. An edit to one burns live points or leaves dead lots the balance already ignores. | high |
| Double-spend race | Serialization of every debit rests on one `SELECT … FOR UPDATE` of the member row. A new spending path that writes a debit without it lets two readers allocate the same lots; the guarded `remaining >= amount` update is the only backstop and it throws a raw error, not a refusal. Nothing in the repo can observe it — pglite is one session. | high |
| Checkout carries an unbounded settle | `resetActivityClock` settles every dead lot inside the checkout transaction with no cap, three round trips per lot. A dormant member with a large backlog can exceed the request budget, and every retry does the same work — that member can never transact again. | high |
| Backdated import mints live points | `assertOccurredAt` bounds only the future. A year of history imported for an active member is born under `greatest(floor, clock)` and lives a whole further period. | high |
| Sweep failure path is untested | A member the sweep cannot settle is added to a `failed` set and excluded for the rest of the run. No test anywhere enters that branch — every existing assertion reads `failures: 0`. If the exclusion regressed, the run would burn its whole budget re-picking one member. | high |
| Ledger tampering | Balance derives from `remaining`; any UPDATE, DELETE or increase would mint or destroy points with no trace. The database triggers are the whole defence. | high |
| Activity clock moves backwards | `activity_expires_at` is forward-only by one read-compare under the member lock; nothing in the database enforces it. A new writer — POS till, order ingestion, a console fix — that lowers it removes an extension. *It cannot kill a lot whose own stored floor is still ahead, because effective expiry is `greatest(floor, clock)`.* | medium |
| Reversal after a lapse | A reversal restores credits carrying the root lot's floor. After the clock lapsed those are born dead, while the operator's answer reports the full points restored against a balance that stays 0. A version that stamped a fresh expiry would resurrect written-off points. | medium |
| Invariant hook reads two instants | `expectLedgerInvariants` captures `at = new Date()`, walks every row, then calls `getBalance` with its own later default. A lot dying between the two reads makes the walk and the aggregate disagree — in a hook that runs after every scenario. Harmless at day-scale dates, a real flake the moment a scenario pins a millisecond boundary. | low |

### Tests — db suite (pglite)

- **One expiry rule, three implementations, one verdict.** Exhaustive table over stored floor × activity clock (null, before, equal, after) × asked instant (floor−1ms, floor, floor+1ms, clock, clock+1ms) × `remaining` (0, positive): the rows `expiredLots` selects are exactly the rows `isAlive` excludes, and both agree with the TypeScript verdict. The `remaining` dimension is load-bearing — `expiredLots` carries `gt(remaining, 0)` and `isExpired` does not, which is the likeliest divergence of the three.
- **A checkout for a member with a thousand dead lots.** Seed the backlog, run a spend, assert exactly 1000 expire debits, 1000 consumptions, no lot settled twice, and the balance equal to the new earn alone. The bound asserted is the **statement count**, not wall-clock time — three round trips per lot today, which a wall-clock assertion would measure as the CI runner's speed and flake on. The structural fix is set-based settling, which makes that number three regardless of N.
- **A reversal after the balance lapsed restores nothing spendable.** Redeem, lapse, sweep, reverse. The restored credits carry the root's floor, the balance stays 0 at every instant after the lapse, and the next sweep writes them off with exactly one debit each.
- **A raw UPDATE lowering the activity clock is a recorded defect.** Assert the current behaviour honestly rather than adding a forward-only trigger: a trigger would not close the hole that exists (the null-clock branch writes a past date, which is the dead-on-arrival bug) and would permanently block repairing it. The structural fix is a lower bound on `occurredAt`, which closes both.
- **Append-only guards on `ledger_entries`, `ledger_consumptions`, `mutation_results`** — already in place.
- **`planConsumption` / `applyDebit` unit suite** — already in place.
- **Settle-before-extend with and without the sweep having run first** — already in place; both orderings end with a byte-identical ledger, so no concurrent version is needed.
- **Sweep convergence and budget scenarios** — already in place. *They do not cover the poisoned member: both runs assert `failures: 0`.*
- **Liability counts only what is still owed** — already in place.
- **Calendar arithmetic across DST, month clamps and ambiguous readings** — already in place.

### Tests — pg lane (two real sessions)

- **Two debits of one balance in flight.** The till's `redeemFor` (key `pos:<intentId>`) and the member's own redemption on their phone: two idempotency namespaces, one member lock. Session A parks mid-transaction, B blocks on the member row, A commits, B re-reads and is refused for insufficient points. Exactly one redemption row, no negative balance, invariants hold. **This is the group's one lock test** — the same mechanism underlies every duplicate-delivery and clamp scenario, and those are all proven sequentially already.

### Fix, not a test

Pass `at` into the invariant hook's `getBalance` call so both sides read one instant, then add a scenario whose lot dies within milliseconds of the assertion to prove the hook is stable under shuffled file order. A flaky invariant hook is the one thing that gets disabled rather than fixed.

### Not built

FIFO tie-breaking on a small pglite table returns rows in insertion order regardless of the `id` tiebreak — a test that passes for the wrong reason. A concurrent sweep-versus-checkout test buys only "the lock was taken", which the one lock test covers.

---

## Tiers

### Failure modes

| Title | Scenario | Severity |
|---|---|---|
| Leap-day attainment retains itself | A tier attained on 2024-02-29 clamps its term end to 2025-02-28; the retention period start derives back to 2024-02-28, one day *behind* the attaining earn. The points that bought the tier now sit inside the retention period, so the member's next trivial purchase extends the term to 2026. Exactly one anchor in four years at a twelve-month term; twenty-seven at six months. | high |
| The tier-on-refund switch drifts or half-works | Whether a refund takes back a reached tier is a deployed policy, confirmed later; both branches ship. The regressions to guard: the default drifting from "keep", the claw-back's retention-fuel reduction quietly stopping (it must hold under both branches), and the unpicked branch rotting unexercised — any one moves real money. | medium |
| One unreviewable member starves the review | The candidate scan has no `ORDER BY` and no offset; its only defence against re-picking a failing row is the in-run `failed` set. Remove it and the run burns its budget on one member while every lapsed member keeps a tier they lost. | high |
| A spend between the pick and the lock is demoted anyway | The sweep picks a lapsed member, who then buys something that re-attains. Correctness rests on a re-read under the member lock that nothing observes. | high |
| The unknown-tier guard is dead code where it matters | When a deploy drops a tier, the `-1` guard fires only for members whose term is still running. A lapsed holder reaches the guard as `null`, scores the base rank, and the very next branch nulls all three tier columns — so the nightly review erases the anniversary a rollforward would have restored. | medium |
| Two reviews at once record one demotion twice | The candidate scan takes no lock. `tier_changes` has no unique key, so a duplicate demotion row is silent — and once downgrade mail exists, mailed twice. | medium |
| An expiring invitation demotes with nothing recorded | The candidate scan reads only the earned-tier expiry, while invitations resolve live. Every read drops to the earned tier; `tier_changes` keeps saying the old one until the member's next write. | medium |
| A budget-bound run hides the backlog | Leftover is re-counted from the table. If that drifted to a loop counter, a permanent backlog would read as a clean night. | medium |
| A ladder that pays less higher up | The parser refuses duplicate ids, misplaced base tiers, non-climbing thresholds and mixed windows. It does not refuse a higher tier whose multiplier is at or below the one under it. | medium |
| Nothing records who revoked an invitation | `revokeInvitation` writes `revoked_at` and nothing else — no actor, no audit entry. | low |

### Tests — unit

- **A retention period never opens before the instant its term was stamped.** Enumerate all 366 leap-year anchors plus a non-leap control, asserting `windowStart(validUntil(anchor, months), months) >= anchor`, generalised over `months` — that is where the fragility scales. Enumeration beats seeded randomness here: at twelve months exactly one day in four years fails, and a generator would find it only sometimes. No DST dimension — the only programme with a validity term runs in Asia/Hong Kong, which has had no DST since 1979.
- **Refuses a ladder that pays less higher up, and a programme table missing an environment key.** Only these two. Duplicate base tiers, an empty ladder and a zero retention threshold are already refused by the schema; testing them tests Effect Schema.
- **Unknown tier ids score base rank loudly and are never overwritten** — already in place.

### Tests — db suite (pglite)

- **A tier attained on 29 February is not retained by the points that attained it.** Attain at 2024-02-29 with an explicit instant, spend 10 points on 2024-03-05, assert the term is still 2025-02-28 and retention progress is 0. Fails today.
- **A fully refunded order, under both tier policies.** One order attains Gold, refunded in full the same day, run against a keep-programme and a re-evaluate-programme. Keep: tier and term unchanged, the next HKD 1,000 spend earns 120, and the term lapses on schedule unless retention is re-earned. Re-evaluate: the tier is re-derived without the refunded points and the drop is recorded like any other change. Both: retention fuel reduced by what the claw-back applied. The same contrast pattern the rounding suites use, so the unpicked branch stays continuously exercised.
- **One member the review cannot finish is skipped for the rest of the run.** Three lapsed members, one whose write throws through a Proxy over the real drizzle handle. With batch size 3: demoted 2, failures 1, leftover 1 — and, as the discriminator, the candidate scan ran at most twice. Drop the `failed` set and the scan count climbs while the healthy members are already done, so it fails on the starvation, not on a log line. **This one Proxy serves both sweeps** — the expiry sweep's failure path is the same code and needs no second, timing-dependent version.
- **A budget-bound run names the backlog and the next run finishes it.** Five lapsed members, batch size 2 / max batches 1 → members 2, leftover 3, metric and log both reporting 3; an unbounded second run drains it and every member ends with exactly one demotion row.
- **The review records what the reads already showed, for every kind of lapse.** One cohort at instant T: lapsed attaining nothing, lapsed re-attaining the same tier, lapsed attaining a lower rung, lapsed under a live invitation, term still running. Snapshot every summary at T, run the sweep at T, assert every summary unchanged and `tier_changes` gained a row exactly for members whose effective tier moved. The nightly job is a recorder, not a second policy — no single-scenario test can show that.
- **An invitation that lapses leaves the recorded tier behind until the member's next write.** Honest pinning of a real gap, and it fails the day the candidate scan is widened.
- **A config that no longer knows a held tier changes no row.** Two members holding Gold — one live term, one lapsed — against a ladder without Gold. Today the live one survives and the lapsed one is wiped. Assert both rows intact and both restored on the same anniversary when the full ladder returns.
- **A repeated revoke changes nothing and says so.** The second call rejects with the state error while `revoked_at`, the single `tier_changes` row and the effective tier stay as the first left them.
- **A revoke names the operator who made it.** Lands as a recorded defect until the column or the audit call exists; it is the only evidence available when a member disputes losing a tier.
- **Live lapse, one demotion row with its own cause, re-attainment from the rolling window** — already in place.
- **One extension per period; a backdated order in a closed period buys no second one** — already in place. The existing re-anchor scenario already dates its order before the current period's start.
- **Refuses a second invitation to a tier the member already holds** — already in place.

### Tests — pg lane (two real sessions)

- **A spend that re-earns the tier between the pick and the lock is not demoted.** Session A holds an open transaction recording a re-attaining spend; B runs the review and blocks on the member lock; A commits; B re-reads and finds nothing lapsed. The only way to observe the lock-time re-read.
- **Two tier reviews at once demote each member exactly once.** Twenty lapsed members, two concurrent runs: demoted counts sum to 20, no member has two `tier_changes` rows, neither run throws. This is the group's one concurrent-sweep test — the expiry sweep's equivalent is covered by a loud unique-key violation and needs no second test.

### Not built

The till card versus the sale, and a redelivered Shopify order fuelling a tier twice, both sit at the vendor seam over code that does not exist yet — they belong to the POS and external-orders suites, and the tiers-side property they need is already pinned by the existing multiplier test.

---

## Pairing

Nothing here is built. Every test is a landing requirement for the pairing implementation, not a retrofit.

### Failure modes

| Title | Scenario | Severity |
|---|---|---|
| Lost `customerSet` response makes a second customer | The vendor commits and the response is lost. A retry that bare-creates instead of upserting on the member metafield leaves two customers: history splits, the paired ref names one, and any code minted later is scoped to the customer the till does not attach. | high |
| Two drains claim one pending row | The cron overlaps a manual drain; both call `customerSet` and both write back. Without `for update skip locked` inside the due subquery plus a guarded write-back, one customer is orphaned at the vendor carrying a live member key. | high |
| Enrolment blocks on Shopify | A vendor call inline in sign-up means every registration during an outage hangs or fails at the counter — the one thing joining must never do. | high |
| A writer resurrects an erased customer | Deletion claims `any → deleted` and starts vendor erasure. The drain, a repair-on-use mark, or our own delete echo re-entering the row re-creates personal data after the member asked for erasure. | high |
| Drain creates a customer whose write-back matches zero rows | Between the vendor call and the write-back the row moves to `deleted`. The created customer — carrying the member key and email — is alive at Shopify with nothing pointing at it. | high |
| A lost-response create after the terminal move | A `customerSet` whose response was lost committed; the row then moves to `deleted` before any retry stores the ref. Erasure by ref finds nothing and reports success while the data stays. | high |
| Adoption on an unverified email hands over a stranger's history | An attacker registers with a victim's address unverified. Shopify refuses create on collision; adoption finds the victim's till-created customer and stamps the attacker's key on it. | high |
| Adoption stamps over another member's key | A shared household email or a merged duplicate already carries member B's key. Overwriting moves every future POS attribution and code between two accounts, undetectable from either side. | high |
| An unguarded state move walks the row backwards | A writer that read `paired` writes `orphaned` without naming the state it saw. Zero rows must be an outcome, not an error, or the drain treats a normal race as a failure. | high |
| A seventh write site outside the module | A merge handler, admin fix-up, backfill or POS gateway writing `payment_customers` directly reintroduces every guarantee as a bug in one line. | high |
| Admin unpark applied to a terminal row | The "re-run pairing" button moving a `deleted` row to `pending` re-creates a customer for an erased member. | high |
| A minted code outlives the customer it was scoped to | Every points code is scoped to the paired customer. A repair or merge repoints the pairing and every outstanding code is now scoped to a customer the till will never attach — the member's codes fail at tender with their points already spent, and staff cannot tell that from a wrong code. | high |
| Erasure leaves the member's live codes at the vendor | The deletion protocol clears the metafield, deletes the customer, nulls the ref — and never touches the bearer value the member is holding. After erasure we can no longer write, so the codes are unreachable forever, carrying value against a customer that no longer exists. The ordering is forced: codes first, customer second. | medium |
| A 200 carrying `userErrors` read as success | Treated as success the row pairs with a null ref; treated as a hard error an email collision retries forever instead of entering adoption; a throttle misread as permanent parks a healthy row. | medium |
| Forged, replayed or unknown `customers/delete` | An unsigned POST orphans arbitrary rows; a replay re-arms the backoff; an unknown customer creates a row or 500s so Shopify retries forever. | medium |
| Repair re-creates before a merge can repoint | A merged duplicate reported missing produces a third customer, which staff merge again. One backoff interval is the whole defence. | medium |
| Orphan-marking throws inside a consumer | A read path must never fail because pairing needs repair. | medium |
| Parked rows hide inside the backlog metric | One conflict parked for a month keeps depth and age permanently above threshold, until the alert is ignored or the threshold raised past a real backlog. | medium |
| A row stops being retried | An uncapped attempt counter, a clock-skewed future timestamp, or a claim with no ordering starves an old row forever with the table saying `pending`. | medium |
| Our email match and Shopify's disagree | Too loose and adoption stamps the wrong person; too strict and adoption misses the customer that just refused our create. | medium |
| New state written against an old CHECK | Code writing `conflict` or `deleted` deployed before the widening migration raises on every write. The reverse: a missing unique on `customer_ref` lets two members' rows name one customer. | medium |
| The backfill run twice | Unconditional inserts duplicate rows or mint a second member key; touching `deleted` or `conflict` rows resurrects erased members or clears an operator's park. | medium |

### Tests — unit (pglite repo tests)

- **`ensurePairing` writes one row, mints one key, and never touches Shopify.** Constructed with a vendor port whose every method throws, enrolment still returns with an empty call log — "sign-up never waits on Shopify" proven by the vendor being unusable, not by counting a mock. A database failure, by contrast, propagates.
- **The transition matrix.** Table-driven over {pending, orphaned, paired, conflict, deleted} × the six writers. Legal moves update one row and return it; every other move updates zero rows and returns a `stale` outcome rather than throwing; `deleted` is a sink for all six. Thirty cells, exhaustive, no property test needed. This is the protocol contract only — the deletion and admin specs prove the behaviour with the real writers.
- **The claim is fair and bounded.** Rows come back oldest-due-first, capped at the batch limit, and a NULL `next_attempt_at` is claimed rather than skipped. Plus the emitted-SQL pin that `for update skip locked` sits inside the due subquery, not on the outer UPDATE. The backoff curve itself is already in place and is not re-proven.
- **`customerSet` userErrors are classified, never swallowed.** Against stubbed wire bytes: an email-taken userError decodes to a typed `emailTaken` (the only trigger for adoption); a throttle decodes to retryable, not a park; an unknown userError decodes to `rejected` carrying the message; a 200 with no customer id fails the codec.
- **The adoption lookup is exact on the identifier we verified.** Case, surrounding whitespace and plus-addressing — the cases where the answer changes what we send — plus the assertion that bites: the lookup builds an exact `customerByIdentifier` email query and never a fuzzy search. No lookalike-character row: our normaliser and Shopify's index are different code in different companies, so that row says nothing about whether adoption would find the wrong customer.
- **The phone codec and the column CHECK share one vector set.** Every vector the codec accepts inserts under the database CHECK and every vector it refuses is refused by both; the national-plan auto-prefix cases (HK: exactly eight digits leading 2–9) and the `needsCountryCode` refusals sit in the same table, so the codec's output grammar and the database's cannot drift apart.

### Tests — fake-vendor integration (store db lane)

- **A lost response is adopted by the retry, and two claims make one customer.** With the fake scripted to commit and then throw, the row stays pending with no ref; the retry stores the id the first call created, and the fake holds exactly one customer.
- **Adoption happens only on a verified email and only onto a keyless customer.** Three cases: collision + unverified → no lookup made at all, no metafield write, no pairing; collision + verified + keyless customer → key stamped, ref stored, prior orders still attached; collision + verified + another member's key → `conflict` with reason and candidate ref, and zero metafield writes on that customer.
- **Deletion claims the terminal state before any vendor call.** With the vendor throwing on every method the row still lands `deleted`; a subsequent drain, repair mark and verified delete delivery produce zero vendor calls naming it. Then, with the vendor healthy, the ordering runs: **every outstanding code deactivated first**, then the metafield cleared, then the customer deleted or erasure requested, then the ref nulled. A pending redemption is cancelled rather than minted. A repeated run is a no-op, and the fake holds no live code for that member afterwards.
- **A drain whose write-back matches zero rows deletes the customer it just created.** The test wedges the row to `deleted` through an injected seam between the vendor call and the write-back; the fake then records a delete for exactly the id that call created. Deterministic, not timing-based. This compensation decides whether erasure is honest or merely claimed.
- **One backoff interval after the terminal move, a lookup by member key cleans up what is still at the vendor.** Before the interval, no lookup is made — the window that lets an in-flight retry land is real. After it, the customer is found by member key and deleted — or, when it carries orders, erasure is requested and the acknowledgment recorded (`erasure_requested_at` plus the request id). The acknowledgment is the terminal condition: the row leaves the deletion queue on it, never on vendor absence (erasure is async and delete is refused for customers with orders, so absence-as-terminal loops forever), and a customer still findable past the window feeds the `erasure_stuck` gauge — an acknowledged row can never be claimed again, so that gauge reads the acknowledgment's own age rather than dueness, and a pass that could not reach the vendor reports `unchecked` instead of silence.
- **A compensation firing on an adopted customer clears the metafield, never deletes.** Wedge the row to `deleted` after adoption stamped a pre-existing customer: the compensation removes the member key from that customer and leaves the customer — and their order history — standing at the fake. Deleting is only for customers the drain itself created.
- **A repoint re-scopes the member's outstanding codes.** Mint a code for a paired member, orphan the row, let the drain create a new customer. Assert the repair pass re-scoped that code at the fake and that the store's record names the new ref. A code that could not be re-scoped is counted and named, never left pointing at a dead customer.
- **An orphaned row waits one interval, then re-creates.** At now+1s the drain claims nothing; at now+interval it claims and produces exactly one customer, converging orphaned → paired without passing through pending.
- **A consumer that finds the customer missing marks orphaned and keeps going.** The real order-attribution consumer against a fake answering "customer not found": the row moves to orphaned, the consumer returns retryable, no customer is created inline, and the rest of the batch is processed. With the row already `deleted`, it marks nothing and still does not throw.

### Tests — worker lane

- **`customers/delete` acts only on a verified body, once, and never on a deleted row.** Unsigned and foreign-secret deliveries answer 401 with the row byte-identical; a verified delivery moves a paired row to orphaned; the identical replay matches zero rows; an unknown ref answers 200 and creates no row; our own erasure echo leaves a deleted row deleted with no vendor call. HMAC math is already in place and is not re-proven.

### Tests — db suite and migration

- **Unpark is conflict-only, audited, and bounded.** conflict → pending with an audit row naming the operator and the candidate ref; against `paired` or `deleted` it matches zero rows and answers a typed refusal. Pressing twice leaves one row and does not reset attempts a second time. A verified `customers/delete` naming the conflict ref unparks automatically.
- **Backlog counts pending and orphaned only; conflicts are their own number.** Asserted on the emitted `__DD_METRIC__` markers, so the metric name and tags are pinned, not just the arithmetic.
- **The migration accepts every state the code can write, and the database refuses two rows on one customer.** Iterates the code's exported state union rather than a literal list, so an expand migration that lags the code fails here.
- **The backfill is re-runnable over a mixed population.** Second run inserts nothing, leaves every member key unchanged, moves neither the deleted nor the conflicted row, makes zero vendor calls, and reports the same counts.

### Tests — static check

- **`payment_customers` is written through the pairing module and nowhere else.** A repo walk in `check:libs`, in the same idiom as the existing money and date checks: no insert/update/delete naming the table outside the pairing module, no `.delete(` on it anywhere, and the module's exported write surface is exactly a declared list. **Extend the same check to loyalty's `redemptions` table** — it has seven writers today, and the hand-settled-reversal defect is what a writer that did not know about `fulfillment_code` looks like. This is the test that keeps every other pairing test true as the merge handler and POS gateway land.

### Release gate

Against a real dev shop, recorded with a date and a tester before pairing ships: a `customerSet` retried after a killed connection returns the same customer id; the member metafield definition refuses a second customer carrying the same value; an email collision surfaces as the userError shape our decoder expects; `customerRequestDataErasure` on a customer with orders is observed for what it leaves behind. Without this, every fake-vendor test above proves only that our model of Shopify is self-consistent. The fake's file header names, per modelled constraint, which gate justifies it — so a reader can see which rules are evidence and which are assumption.

---

## External orders and attribution

Not built. The suite lands with the ingestion and attribution code.

### Failure modes

| Title | Scenario | Severity |
|---|---|---|
| Reconcile and the webhook record one refund twice | Reconcile records refunds under a synthesised `reconcile:<orderId>:<total>` ref on a total basis; the webhook records the vendor's refund gid on a delta basis. The refs never collide. Webhook-first is saved by a non-positive delta; **reconcile-first is not** — `refunded_minor` reads double and loyalty claws back twice. Fixed on this branch for the web path — one recorder keyed on the vendor's refund id; the external sweep must feed that same recorder, never mint refs of its own. | high |
| A points code may not lower the earn it paid for | The whole redemption design rests on "spending points lowers the same order's earn". Whether Shopify's subtotal nets an order-level discount code decides it. If it does not, every redemption is followed by an earn on money the member never paid. The refund side compounds it: a pro-rated claw-back on the gross goods basis takes back more than the earn ever granted. | high |
| Webhook and sweep each create an order row | Two writers for one sale seconds apart. A plain insert, or an upsert not targeting the payment-ref unique index, doubles the row, the earn and finance's revenue. | high |
| Our own checkout ingested as external | The cart-token guard compares Shopify's bare token against a recorded ref of a different shape, or the web order crashed before recording one. The order ingests as a second unattributed row, claimable for a second earn on the same money. | high |
| A blank token makes the guard refuse every POS order | The guard searches all orders for a recorded ref containing this token. An empty token matches everything, so the entire POS channel silently never ingests. No error, no counter. | high |
| The merge signal swallowed or escaped | An external row already holds the order gid when the web order learns it. Escaping as a 500 makes Shopify retry until it drops the settlement; swallowed, the buyer sits on a pending order that expires. | high |
| A refund on an ownerless order is dropped | Answering 200 with no durable record loses the money, because nothing re-reads Shopify refunds for an order already recorded paid. The record is an ownerless refund event row plus the refunded totals on the order — a path that forgets either half under-claws every later attribution. | high |
| A refund taken under one claim is not replayed to the next | A replay priced from owned event rows alone reads nothing after a revoke — the new owner earns on money the shop already gave back. The replay must price cumulatively from the order's `refunded_goods_minor` under the row lock. | high |
| Two operators attribute one order | Without a partial unique index on the live claim, both insert and both stamp; two members earn on one sale. | high |
| A claim survives a stamp that matched nothing | The guarded `UPDATE … WHERE user_id IS NULL` matching zero rows must abort the transaction, or a live claim exists against someone else's order. | high |
| A claw-back priced from today | Recomputing from the current rate or current refunded totals removes too much or too little. A silent clamp to zero makes a wrong attribution permanently profitable. | high |
| A refund racing an attribution | A refund committing between the attribution's read of recorded refunds and its commit is never converted to a claw-back. | high |
| No eligible-goods basis | Reusing the web fallback earns on tax and shipping, or inserts NULL into a NOT NULL column and fails the whole attribution as a 500 the operator sees. | high |
| An unclassifiable line treated as eligible | Earning on gift cards is a closed loop that mints value; earning on grading fees is excluded by the programme. | high |
| Two channels earn different money under one label | The sink can only compare a config string to its own constant, so a half-migrated pair passes every single-path test. | high |
| The watermark advances past orders never ingested | A page cap or a mid-page failure that still writes the newest `updated_at` makes a busy day permanently invisible. Same effect from deriving the watermark from our clock rather than the shop's. | high |
| An unset channel filter sweeps every order | Web sales ingest as external rows and become operator-claimable. | high |
| Attribution resolves a customer through an erased pairing row | The deletion protocol claims `deleted` first and works the vendor on its own backoff. A sale in that window writes an `order_events` row naming a member auth has deleted. Every plan tests that writers skip a deleted row; nothing tests that readers do. | medium |
| Attribution overwrites a customer staff already attached | A POS sale where staff attached a customer natively already names someone. Setting ours over the top detaches the customer the shop's reporting runs on — and if it is another member's paired customer, moves the sale between accounts at the vendor. | medium |
| A re-swept order silently repriced | A merchant edits a paid order; overwriting the money on an earned row desyncs the ledger with no claw-back or top-up. | medium |
| A backdated claim earns at the claim's clock | Stamped with the operator's time, a six-month-old sale lands in the current qualifying window, buys a tier and resets activity expiry. | medium |
| A replayed claw-back handed out before its earn | Identical timestamps break arbitrarily; loyalty answers NOT_FOUND, the row backs off and parks undelivered at the attempt cap. | medium |
| Recorded refunds exceed what the order took | The itemised arm adds with no ceiling, and the total delta basis has none either. | medium |
| The origin migration meets code that predates it | Without a default for origin the still-deployed checkout inserts rows violating the new CHECK, so every online checkout 500s during the rollout. | medium |

### Tests — unit

- **The eligible-goods basis over the line shapes a real shop sends.** Gift-card, shipping, grading-fee, discounted, zero-priced and untyped/untagged lines, tax-inclusive and tax-exclusive. The load-bearing row is the line carrying no type or tag: it yields null, never "eligible".
- **A sweep with no POS channel configured refuses to run.** The emitted query is the only artifact that can answer — the widened case is unobservable from a fixture holding only POS orders, and the failure it prevents is unbounded.
- **The claim query puts `for update skip locked` inside the due-rows subquery** — already in place; the new sweep and attribution claims join the pinned queries.

### Tests — db suite (pglite, committed migrations)

- **Reconcile-then-webhook records one refund once.** Reconcile a fully refunded order first, then deliver `refunds/create` for the same money. `refunded_minor` equals the money returned once, exactly one goods claw-back exists, and the second write reports already-recorded. The rule the test forces: an external refund is identified by the vendor's refund id on every path, and the reconcile pass stops minting refs of its own.
- **A points code lowers what the member earns.** One basket with one points code, through the web checkout and as a POS order: the queued earn equals the eligible goods **after** the points code. Then refund it whole and assert the claw-back equals that earn exactly. *This question goes on the release-gate list — whether the subtotal we read nets an order-level discount — because the fixture is only as true as that answer.*
- **Webhook and sweep converge on one order row, in either order.** Exactly one order row, one attribution-due row, one set of money facts each way.
- **An order our own checkout created is never ingested as external.** A table over the spellings Shopify actually uses for one cart — the bare token, the recorded gid-with-query-string form, case variants — each recognised and refused.
- **A POS order with no cart token still ingests.** Null and empty token match no recorded ref. The structural fix while designing: extract the cart token into its own indexed column at cart creation, and the guard becomes an equality lookup rather than an unindexed containment scan — killing the class, not the instance.
- **A web order the sweep already ingested is merged, not duplicated.** One surviving row keeping `origin=web` and the buyer, one paid event, one earn, and the unique violation reaching the merge path rather than a 500 or a silent no-op.
- **A refund on an unclaimed order is kept and replayed at attribution time.** An ownerless refund event row plus updated refunded totals, no owned event, a 200 — and the event drain's claim query never picks the ownerless row up. Then attribution queues the earn and the claw-back exactly once, netting to goods-after-refund.
- **A refund taken under one claim is replayed to the next.** Ingest, attribute to A, refund while owned, revoke, re-attribute to B: B's earn is accompanied by the same claw-back, priced from the order's cumulative `refunded_goods_minor` under the row lock — the pricing that lets refunds taken while owned ride into the next claim's replay.
- **A refund for an order we never ingested fetches it and records both** — plus the transport-failure arm: nothing written, a redelivery asked for, the redelivery completing the job once.
- **A claim whose stamp matches no row writes nothing at all.** Zero rows aborts the transaction: no claim, no event, a named refusal.
- **Revoking a claim reverses exactly the earn that claim produced.** Keyed to that claim's own earn event id, priced from the basis recorded on it, with a fresh key on re-attribution. Loyalty-side clamping and shortfall are already in place and are not repeated.
- **A replayed claw-back handed out before its earn still lands.** The refusal keeps the row queued, a later pass delivers both, the row never reaches the attempt cap — and the attribution transaction gives the two rows a deterministic delivery order so the normal case needs no retry.
- **An external order with no eligible-goods basis is refused, loudly.** A counted refusal before any insert; no NOT NULL failure downstream.
- **The same basket earns the same online and at the till.** Same amount, same basis label. A half-migrated pair passes every single-path test and fails this one.
- **Attribution refuses an erased pairing row.** A `deleted` row: attribution refuses with a counted outcome, writes no claim and no event, leaves the order ingested and unattributed. The POS badge read answers "not found", never the member's panel.
- **Attribution never overwrites a customer staff already attached.** No vendor call when the attached customer is already the member's paired one; a disagreement counted and left alone; an attached customer belonging to another member's pairing row refuses the claim outright.
- **The sweep never advances its watermark past what it ingested** — page cap and mid-page failure, with the re-run deduping by payment ref.
- **The sweep reads the shop's clock, not ours.** An order stamped behind and one stamped ahead are both ingested, and the watermark derives from the orders seen.
- **A re-swept order that already earned is not silently repriced.** The divergence is reported the way amount drift already is for the web paths.
- **A claim earns at the sale's time and refuses a sale too old to claim.**
- **Refunds cannot record more money than the order took.** Aimed at the two real gaps: the itemised arm adds with no ceiling, and the total-basis delta has none. The pro-rated goods arm already clamps and is not re-tested.
- **The origin migration is safe on a table that already holds orders.** Apply committed migrations up to the one before, seed legacy web orders — owned rows and guest rows carrying only a checkout email — apply the rest: legacy rows survive, an insert naming no origin still writes a web order, the CHECK refuses a web order with neither a user nor a checkout email, accepts a guest web order on the email alone, and accepts a POS order with neither. No lock claims — pglite cannot observe a table lock.
- **A drain whose programme earns on other money or in another currency fails whole** — already in place. *It does not cover the two-channel split: two drains both declaring the same label while computing from different money both pass it. The cross-channel equality test is the only cover.*
- **A redelivered refund takes money off the order only once**, and **a refund that outruns its payment asks to be sent again** — already in place for the web path.

### Tests — worker lane

- **A refund whose order the Admin API does not know stops asking.** A 200 with a counted unknown-order outcome and the delivery recorded, so a permanent condition never lands on the vendor's 48-hour retry ladder.

### Tests — pg lane (two real sessions)

- **A refund landing during an attribution becomes a claw-back, not an orphan.** Session A holds the attribution transaction past its read of recorded refunds; B delivers the refund and blocks on the order row lock; after A commits, B records an owned claw-back. **The one test that earns the pg lane here** — the row lock ordering is invisible in pglite and getting it wrong mints points on money already returned. The two-operator claim assertion rides in the same spec: the loser blocks on the uncommitted tuple and gets a typed refusal rather than a 500.

### Not built

A two-session test that one order gid produces one row proves Postgres implements `ON CONFLICT`; our half is the sequential convergence test plus the emitted-SQL pin.

---

## Redemption

### Failure modes

| Title | Scenario | Severity |
|---|---|---|
| Hand-settled redemption reversed leaves the code live | The drain persists the code before the vendor call, the vendor creates the discount and the response is lost, the row parks failed. An operator settles it by hand (no artifact). A later reversal returns early because there is no artifact, the state falls through unchanged, and nothing deactivates the code the vendor holds. Points back **and** a spendable code. | high |
| Lost mint response mints two codes | A retry that mints fresh instead of reusing the persisted code gives one redemption two live codes. | high |
| Reversing a collect-in-store redemption leaves it collectable | The reversal's state mapping is a closed set of arms with a fall-through. Adding `awaiting_collection` without an arm silently produces reversed-and-still-awaiting, and a till hands the goods over after the points came back. | high |
| Two tills confirm one collection | Without a guarded transition off `awaiting_collection`, both writes succeed and the member walks out with two units of stock decremented once. | high |
| Cancel after tender | Shopify offers no synchronous tender read, so a cancel inside the propagation window returns the points for a discount that was actually applied. | high |
| Usage falls on refund | Usage derived from live vendor state rather than a monotonic record lets a refunded order make a spent code look unused, re-opening reversal. | high |
| Quantity redeem debits and mints different amounts | The debit and the mint are computed at opposite ends; any disagreement mints money. Zero, negative, fractional or overflowing quantities turn a debit into a credit or abort mid-transaction. The POS transport reaches the same service function, so a bound in the router schema is not a bound. | high |
| A stale rate keeps minting | Moving the point value leaves stored reward templates minting at the old rate, indefinitely and invisibly. | high |
| A 200 with `userErrors` marked fulfilled | The member is shown a code that does not exist and their points are gone. | high |
| A redemption-scoped mint races the cron drain | If the till's synchronous pass bypasses the shared claim, two vendor mints for one debit and one orphan live code. | high |
| The drain's cron drifts from the worker's dispatch | The handler branches on a literal cron expression and throws for anything else. A one-character edit to the wrangler config silently stops all fulfilment. | high |
| Unpark resets attempts with no cap and no record | Retry sets attempts to zero guarded only on `failed`, and records no operator — unlike the settle beside it. A permanently-refusing row can be walked back through the whole curve indefinitely, one click at a time, with nothing naming who did it. | medium |
| `awaiting_collection` rows swept into the delivery queue | A copy-paste into either the claim's state list or the backlog query burns attempts against a fulfiller that cannot deliver, and pages whoever owns the backlog alarm every night. | medium |
| Breakage double-counted | An expired-unused counter emitted from a scan rather than a transition counts the same dead code 288 times a day. | medium |
| A documented flag that parses into a no-op | The config parser ignores excess keys, so `expiryReclaim: true` — and every other typo'd key — is silently dropped. | medium |
| Restock twice, or phantom restock | A lapsed collection restocks and a later goodwill reversal restocks again; or a reward that was unlimited at redeem time and finite later gets a unit back it never took. | medium |
| A reversal that cannot settle gives nothing back and says so | After the gate deactivated the code, three failed flip attempts leave the member holding a dead reward with their points still spent, and nothing counts it. | medium |
| The daily cap counts a UTC day | On a Hong Kong programme, 23:30 and 00:30 local fall in one UTC day and the cap shuts a member out early. On a UTC CI box the bug reads correct. | medium |

### Tests — unit

- **An unknown programme-config key fails at boot.** Set the decoder to error on excess properties and assert an unknown key refuses. This closes the whole category rather than writing a rule for one named flag — a documented-but-unimplemented flag stops being a special case.
- **Redeem refuses a quantity outside its bounds at the service, not only at the router.** Quantity 0, −1, 1.5, cap+1, and a value whose product overflows: each refused, nothing written, stock untouched. A bound that lives only in the input schema fails this the day a second transport exists.
- **The stored-template rate audit refuses a catalog write that disagrees with the live rate**, and, run as an importable function over drifted templates, fails loudly naming each one.

### Tests — db suite (behavior suite, pglite)

- **Reversing a hand-settled redemption takes back the code the drain had already minted.** The fake registers the code live then answers permanent; the row parks with the code set and no artifact; an operator settles by hand; an admin reverses. Assert the code is deactivated, the fake holds nothing live, and the points came back exactly once. Fails today.
- **No reversed row keeps a live code.** The invariant, run in the existing after-each hook: **no row in state `reversed` may carry a non-null `fulfillment_code` unless its fulfilment state is `void_pending` or `voided`.** A state-pair table alone would pass on the defect above, because reversed-and-fulfilled is a documented legal pair — the code clause is the load-bearing half. Keep the pair table too, extended with `awaiting_collection`, to catch the fall-through class.
- **A mint whose response was lost is retried with the same code and yields one live discount.** Assert the drain hands the persisted code back — two fulfil calls carrying the same code, one live code at the fake, one artifact. Not the fake's artifact arithmetic, which is derived from the code we passed it.
- **Reversing a redemption awaiting collection makes it uncollectable, and a till that tries is refused.** Two independent guards: the reversal has an arm for the new state, and collection guards on the redemption state as well as the fulfilment state.
- **Two tills confirming one collection collect it once**, and the second is told when and where — a distinct already-collected refusal, with the first collection's staff label and timestamp intact.
- **A redemption awaiting collection is never claimed by the drain and never ages the backlog alarm.** One scenario covering both state lists, which live hundreds of lines apart and drift by copy-paste.
- **A quantity redemption debits once and mints one artifact worth the whole quantity.** The debit is read from the ledger and the mint from the fake, so a disagreement cannot pass. Includes the fingerprint assertion — the same key with a different quantity conflicts rather than replaying — as two extra lines, since the whole input is already fingerprinted.
- **A quantity above one is refused on a finite-stock reward, and the debit rolls back with it.**
- **The per-member daily cap counts the programme's day, not UTC.** Two redemptions straddling local midnight are two days; two inside one local day hit the cap. Driven through the service so the cap is proven to sit under the member lock. Run on a lane whose TZ is pinned off UTC — without the pin it passes vacuously.
- **An expired unused code stays spent, is counted once, and leaves the outstanding number.** The counter increments exactly once across three consecutive sweep runs — the repeat is the whole point, since a scan-based counter passes the single-run version.
- **A collection window that lapses restocks the unit exactly once**, and a later reversal changes stock no further.
- **A reversal that cannot settle gives nothing back and says so** — no reverse entry, no stock change, an error naming the redemption, and a counted metric, because the member is left holding a dead reward.
- **Unpark is bounded and attributable.** Three retry presses against a permanently-refusing fulfiller: total vendor attempts stay under a lifetime cap, each press writes an audit row naming the operator, and a press against a fulfilled or reversed row matches zero rows and returns a typed refusal.
- **A cancelled or reversed redemption never returns points twice for one code.** Reverse a fulfilled redemption, mark the code used, reverse again: the second is refused and the points do not come back twice. Then the ordering that matters — reverse first, mark used second — assert the mismatch is countable as a metric or a queryable state, not something discoverable only by reading two systems side by side.
- **A redemption-scoped fulfilment pass and the cron drain never both mint.** The scoped pass goes through the shared claim, so a drain in the window claims zero rows and the fake sees one fulfil call. Hand-interleaved; the actual exclusion rests on the pinned claim SQL.
- **The claim pins `for update skip locked` inside the subquery and bumps the attempt before trying** — already in place.
- **Reversal mid-flight: takes back what it just made, makes nothing for a row reversed before its first write** — already in place.
- **Deactivate-then-read-usage ordering, the used-refusal, and the re-gate when fulfilment moves under it** — already in place.
- **Restock only what a reversal really took** — already in place.
- **The backoff curve to the attempt cap, and a permanent refusal parking on attempt one** — already in place.
- **An in-flight redemption stays on the template it was made against** — already in place.
- **A fulfilled redemption's stored answer replays verbatim and carries no code** — already in place, and it is why the till's retry must re-read the redemption.

### Tests — fake-vendor integration

- **A Shopify response carrying `userErrors` is never fulfilled.** Duplicate code, bad combination rules and discount-limit answers classify as permanent or retryable per error code; no artifact stored, the message on the row, the member surface still preparing.
- **A second mint for the same code creates no second discount.** The fake refuses a taken code the way Shopify does; the fulfiller looks it up and returns the existing node as fulfilled.
- **The minted code carries every control that bounds its value.** Fixed amount = per-unit × quantity, usage limit 1, once per customer, customer scope = the member's paired customer, minimum subtotal = the code's own value, combination rules, end date. Honest about its limit: it proves the controls are requested, not that Shopify honours them — the release gates do that.
- **A code seen on an order after its redemption was reversed raises one loud mismatch.** Redelivering the webhook three times produces one mismatch and one metric; nothing moves points automatically.
- **Usage never falls: a refunded order still counts as a use**, and the reversal stays refused.

### Repo check, not a spec

**The crons a worker dispatches are the crons its deploy installs.** For each wrangler config declaring crons, every expression must appear in that worker's dispatch. A one-character edit otherwise silently stops all fulfilment — and every worker with a scheduled handler has the same seam, so this belongs beside the existing money and date checks, not in one app's spec.

---

## POS session and gateway

Not built. The gateway, the extension and the handle table land with this suite.

### Failure modes

| Title | Scenario | Severity |
|---|---|---|
| Two legitimate intents, one balance | Preview mints an intent per call and pins an amount. Staff tap "use max", back out, tap again — two valid intents, each pinned to the whole balance. If redeem honours the pinned number instead of re-reading the live balance, two debits and two codes for one balance. No forgery, no attacker, two honest taps. | high |
| Cancel returns points while the code is live | Cancel credits the points but nothing deactivates the minted code, and cancel is only refused once the order carrying it is *seen* — a webhook signal that lags tender. Spend, apply, cancel, tender: discount plus points, repeatable. | high |
| A failed identify burns the presentation | The handle is consumed by a guarded claim, then identify fans out. A throw after the claim leaves the member's QR dead with no session opened — and hands staff a plausible "scan it again" cover for a real replay. | high |
| A session opens on a partial fan-out | If the loyalty leg fails and the code degrades rather than refusing, a session opens with a null or zero balance and preview pins an amount against a balance nobody read. | high |
| Cancel reaches a physical-reward redemption | Cancel an `awaiting_collection` row in-session, take the points back, then complete the collection and walk out with the goods. | high |
| A presentation consumed more than once | A photographed QR or a noted code re-scanned later opens a second session for a member who is not in the shop. | high |
| Two tills claim one presentation at once | Read-then-update rather than a guarded claim opens two sessions with both calls looking successful. | high |
| The short code is guessable or ambiguous | Shortening it "for usability"; a modulo-biased generator cutting real entropy by several bits; or two live presentations colliding on one code so staff type a valid code and get a stranger's panel. | high |
| The throttle counts the wrong thing | Keyed on the claimed staff label or the device session, an attacker rotates and guesses freely; a fixed window lets nineteen attempts through in two minutes; an over-broad pause bricks a whole terminal on ten typos. | high |
| Email lookup is an oracle, or matches the wrong member | Different answers for "no member" and "not paired" enumerate customers; helpful normalisation resolves a plus-tagged address onto someone else's account. | high |
| A session outlives the member's presence | A TTL from a client-supplied timestamp, or checked only at identify, lets staff spend forty minutes after the member left. | high |
| A session used outside its shop, member or lifetime | A token whose verified destination is another shop; a new identify that does not end the previous session server-side; a modal close that only clears client state. | high |
| The redeem amount comes from the request | An invented intent id treated as a fresh idempotency key, or a request `points` honoured over the previewed amount. The worst single outcome in this part. | high |
| One intent debits twice | A double tap or a retry reaching loyalty as two calls: debited twice, two single-use codes for one sale. | high |
| A lost response after the points are gone | The retry must find the same intent, mint nothing new, and answer the code. Starting fresh charges twice; answering permanent leaves points spent with no code. | high |
| Cancel reaches beyond this session's last redemption | An enumerable id turns a shop-only terminal into free points from a stranger's account. | high |
| Token verification accepts what it should refuse | Algorithm confusion, an unchecked audience, a destination read from a header instead of the verified claim, an unchecked expiry. The whole authorization boundary. | high |
| Rotation breaks every till or never retires a key | Not consulting the previous secret hard-fails mid-trading; reading an unset previous secret as `""` verifies anything. | high |
| The kill switch is not immediate | Cached per isolate, a manager's flip takes minutes during live abuse; a missing flag row 500s every till; the narrow flag implemented as the broad one goes dark. | high |
| A procedure added later misses a rung | The ladder is applied procedure by procedure, so a new one can ship unauthenticated or unaudited. | high |
| POS reads are unaudited | The shipped elevated ladder audits mutations only. `identify` and the badge read are the disclosing calls and would run with no row. | high |
| The mint fails permanently after the debit | Revoked scopes or a permanent `userErrors`: the points are gone, policy forbids auto-reversal, the row parks. Nothing says the member ever learns why. | medium |
| The identify panel is the disclosure, unsignalled | The panel is far richer than the badge — balances, window progress, renewal dates, recent activity, open codes — handed over on an email session on a typed address, with no member-visible signal on lookup. | medium |
| Provenance defaulted or client-supplied | The email-spend kill switch then never fires on the sessions it exists for, and the rollout comparison measures nothing. | medium |
| The receipt is best-effort, or carries the code | On an email session the notification is the member's only containment; a payload carrying the code makes a lock screen spendable. | medium |
| The limiter keyed on something the caller controls | IP starves a shop behind one NAT; a body field resets on rotation. And an undefined failure policy fails open on email or closed on QR. | medium |
| CORS leaks past the POS router | The worker mounts credentialed CORS on its whole base path with a trusted-origin predicate. Widening that for the extension CDNs hands credentialed cross-site reads to every storefront and account route. | medium |
| The extension's baked origin drifts from the route | Each bundle bakes its gateway origin at build time and ships on a manual per-location activation lane. A route edit or a wrong client id per environment bricks every till until a manager re-activates by hand. | medium |
| A sick gateway blocks the sale | A hang, a throw into the host, or a spend button left enabled. And a cart-discount call that resolves while the cart never shows the code. | medium |
| Claimed labels used for authorization | A claimed staff id consulted for a permission decision is a fake authorization surface; an unbounded one bloats the audit chain. | medium |
| Client and gateway deployed apart | A field made required breaks tills that cannot be rolled forward in the same minute. | medium |

### Tests — unit (membership package)

- **The short code's parameters are the ones the throttle was sized for.** Pins the alphabet (the 22 digit-free Crockford letters), length 8, and computes attempts-to-first-hit from those plus the cap and a stated ceiling on live presentations. *Correct the doc while doing it: digit-free Crockford at 8 characters is 22^8 ≈ 2^35.7, not 2^40 — the 2^40 figure kept the digits the same sentence forbids.* Also pins confusable handling as a deterministic normalise-or-refuse that cannot map one live code onto another.
- **The generator rejects out-of-range bytes.** Feed the scripted RNG bytes in the rejected range and assert no symbol is emitted for them — three lines, deterministic, and it fails on a modulo-biased generator outright. No chi-squared harness: modulo bias is a structural property, and a statistical gate in CI is slow and untriageable.
- **A forced collision retries, and an ambiguous code refuses.** A scripted RNG repeating a live code makes the mint retry; two live rows sharing a code make identify refuse rather than pick one.
- **What session-token verification refuses.** Scoped to what our code decides: the destination is this shop, the previous secret verifies while a retired third does not, an unset previous secret never becomes a universal key, the algorithm allowlist is present (one confusion case), and a malformed token is a typed refusal rather than a 500. *If the verifier is hand-rolled rather than a library call, expand to the full forgery table — algorithm none, audience, expiry, swapped payload, oversized and non-JSON bodies. Against a library with an explicit algorithm allowlist, those rows test the library.* No single-byte-mutation property pass: that re-tests HMAC, which is already covered at the same primitive.
- **Secrets are declared per environment and land on the right brand.** The POS secrets appear in the declaration the `--check` run reads, for every environment, without landing on the brand that has no POS app. A named environment inherits no vars, so a missing declaration is the empty-secret bug arriving by a different door.
- **Every POS procedure stands on the whole ladder.** Enumerate the router's own procedure paths against a total classification map — public / member / elevated / pos — so a new procedure makes the map non-total and fails to compile. Assert each classification matches what the procedure declares: permissions for elevated, the POS principal and audit-required for pos. **This one oracle carries the store's non-POS procedures too**, as another arm of the same map, and it needs no database.
- **The wire contract is additive-only.** A committed schema per procedure with a diff check: fail when a field goes optional → required, is removed, or an enum narrows. No per-version fixture corpus — a hand-curated corpus that must be extended every release decays into a check nobody runs, which is the exact defect this plan exists to prevent.
- **The gateway origin the extension bakes equals the route the store declares.** A total map over brand × environment in the app-env test, plus the POS client id present exactly where a POS app exists.

### Tests — store db suite

- **A presentation is consumed once, and the second till is told where the first was.** Asserted on rows, so a refusal that still opened a session fails.
- **A failed identify does not burn the presentation.** Script the loyalty binding to throw after the handle claim: the handle is still unconsumed, no session row exists, the caller gets a typed unavailable — and the same token identifies on retry. Mirror case: a slow-but-successful panel read consumes it exactly once.
- **A partial fan-out opens no session.** Fail each dependency in turn during identify: no session row, no consumed presentation, a typed refusal — and no path renders a zero-balance panel that spend can act on.
- **Ten failures in five minutes pause the shop, not the staffer.** Nine wrong codes then a good one still identifies; the tenth wrong code pauses code entry for that shop even across three claimed labels and two device sessions. Attempts at T+0 and T+4:59 both count, and the pause does not lift on a fixed boundary. QR and email still work while paused. *Note what the forensic row can say: the audit redactor blanks any key containing `code`, so the attempted short code is `[redacted]` — the row proves an attempt happened, not what was typed.*
- **An email miss is one answer whatever is missing.** Nonexistent, unpaired, conflict-parked, deleted, other-brand: whole-object equality on the response so an added reason field fails, while the audit row still records what was attempted.
- **Email match is exact, and ambiguity refuses.** Plus-tagged does not match the base address; a mixed-case address is found exactly the way the auth store canonicalises it, asserted against the auth-owned rule; two rows that would both match refuse rather than return the first.
- **Two legitimate intents, one balance.** Preview the full balance twice in one session. Redeem A: one debit, one code. Redeem B: a typed insufficient-balance refusal on the **live** balance, no loyalty call, no second code, balance never negative.
- **An intent is the amount, the session, and nothing else.** A differing `points` value is refused, never re-pinned; an invented id is refused, never treated as a fresh key; an intent from another session, another member, an ended session or past its TTL is refused. Each refusal typed and distinct.
- **Double tap costs once and both answers carry the same code.** The fake loyalty terminal deliberately does not dedupe — it mints a fresh code per call — so the test cannot pass by exercising the fake.
- **A lost response is a retry, and a crash after the debit is recoverable.** With the fulfilment pass scripted to throw after the debit, the retry mints exactly one code and answers it; parked in preparing, the retry answers the code once minted and never a second.
- **The session TTL is the server's clock.** One second past is refused with no loyalty call and no debit; a far-future client timestamp does not extend it; a second identify ends the first session so a queued redeem on the old id is refused; closing the modal ends it server-side.
- **Cancel undoes the last redemption of this session and nothing else — and takes the code back.** Another member's, another session's and an earlier id are refused with the target row byte-identical; a second cancel credits nothing. **After a successful cancel the fake has recorded a deactivate for that exact code, and applying it afterwards is refused. A cancel whose deactivate fails refuses and credits nothing.** A cancel after the order carrying the code has been seen is refused and raises the mismatch signal.
- **Cancel cannot reach a physical-reward redemption.** An `awaiting_collection` row refuses with a message distinct from the last-redemption-only one, and collection after any cancel of it is refused.
- **A till session can only touch the member it identified.** Cancel and collection with another member's redemption id are refused and leave the target row byte-identical.
- **A re-tapped staff redeem answers the code the first tap minted** — not "preparing", one debit, one mint, without waiting on the next cron.
- **A permanent mint failure after the debit is named, counted and visible.** With the fake answering `userErrors` permanently: a named terminal state distinct from the transient one, a metric, and a reason on the member's own view of the redemption.
- **One pending collection completes once**, with a distinct already-collected refusal naming when and where, no collection past the window, and the member notified on the successful one.
- **The kill switches act on the next request.** Flip between two calls on one instance; a per-isolate or TTL cache fails. `config` still answers under the switch. A missing flag row reads as the documented default. The email-spend flag refuses spend on an email session only.
- **Provenance is server-derived and lands on every record.** All three paths produce their value on the session row, the store audit row, the fields handed to loyalty, the redemption record and the metric tags — five places, since drift on any one blinds the kill switch or the rollout comparison. A request carrying its own provenance is ignored.
- **Every staff-assisted spend notifies, and never with the code.** Push failure falls back to email; both failing leaves the redemption standing but counted and queued. The payload carries points, amount and location and is scanned for the code, the QR token and the session id.
- **POS reads are audited.** The badge read and identify both refuse without a sink — the gap the inherited ladder leaves, since it guards mutations only. Rows carry the shop-derived actor, the session id joining the store and loyalty chains, the intent id, provenance, and staff and location marked as claims.
- **The audit chain carries no secrets the redactor cannot see.** The chain already blanks keys containing token/code/secret, so assert the cases it cannot see: a code under an innocuous key, and a code interpolated into a message string. Include a negative control that plants a raw code, so the scan is proven able to fail.
- **The staff label is a label.** Identical behaviour for any claimed id, including an admin's; oversized labels, emails and tokens refused by the input bounds before reaching the append-only chain.
- **The badge and the panel disclose only what they name.** Whole-object equality on both — the panel is the richer disclosure and is where a field added later actually leaks. The badge consumes no presentation, opens no session, returns no code or email. Every identify, hit or miss, emits a counted metric tagged with shop and provenance, so the top-lookups report the containment story assumes has a series to read.

### Tests — store worker lane

- **The shop is the verified destination, and the limiter is keyed on it.** Against the **real** rate-limit binding, which the pinned miniflare implements: a body or header claiming another shop does not move the key, two shops do not share a budget, and a bad token is refused before any database work. A stub would only prove which key we hand our own stub.
- **A limiter that is down fails closed on email and open on QR.** Both outcomes counted, so the degradation policy is a decision in code rather than whatever the try/catch did.
- **CORS lives on the POS router alone.** Extension CDN origins get headers on the POS router; another origin gets none; an arbitrary origin is not reflected with credentials; a cookie-authenticated storefront route on the same worker carries no CORS headers at all. **And the POS router's responses carry no `Access-Control-Allow-Credentials`** — it authenticates with a bearer token, so inheriting the worker-wide credentialed policy is precisely the overreach.

### Tests — pg lane (two real sessions)

- **Two connections claim one presentation — exactly one session.** The only test that separates a guarded single-statement claim from read-then-write.
- **Two concurrent redeems of one intent.** Against a non-deduping fake loyalty: exactly one call reaches loyalty, and the loser gets the same code or a typed in-flight refusal whose retry returns it.
- **Two legitimate intents submitted concurrently.** The loser refuses on the live balance, not on its pinned number.
- **The per-shop daily cap holds at its boundary.** At cap minus one, two concurrent redeems: one passes, one gets the typed refusal. The sequential version passes on a select-sum-then-insert.
- **One pending collection completes once under two connections.**

### Tests — POS frontend (jsdom, fake host)

- **The till never blocks the sale.** Against a gateway that times out, 500s, answers garbage, an unknown refusal code, or a newer shape: the flow lands in the unavailable state, calls no cart-discount, never throws into the host, never leaves spend enabled. A discount call that resolves while the cart never shows the code reports "not applied, code saved" — confirmation is against the cart, never the promise. A staff manual discount already on the cart disables spend up front with its reason.

---

## Enforcement

### Failure modes

| Title | Scenario | Severity |
|---|---|---|
| The pg fan-out puts two apps on one CI database | The Postgres workflow provisions a single database and passes one URL. The server fixture truncates every table in every schema, and migrations are gated on one global high-water mark. Fan the root script out over a second app and the newer app's migrations are silently skipped while each suite clears the other's rows — the lane the money races depend on reports green having proven nothing. | high |
| New code lands outside every lane | The workspace globs and the lane resolver both cover only `apps/` and `packages/`, and the resolver drops anything else silently. A top-level integrations directory ships with no lane, no wiring walk and no typecheck while three test commands pass. | high |
| The races the money path rests on never run | The root `test:pg` names one app by path and the workflow runs only that script. A new `test/pg/` folder sits unrun. | high |
| A widened CHECK meets code that predates it | Deploys are per-service dispatches. For a window, new code writes a new fulfilment state while the previously deployed drain still claims it as due — retrying and parking a redemption a member is waiting to collect. | high |
| A new procedure ships outside the ladder | Nothing checks that every membership procedure uses the audited POS procedure, and the store app has no router oracle. An enumerable disclosure endpoint lands with no audit row and no test failure. | high |
| The fake is an unreviewed specification | The Shopify fake has no test of its own and already encodes vendor decisions. Extended for membership it will encode upsert-on-metafield, uniqueness refusal and single-use burn. If it is wrong, every suite standing on it is green and wrong. | high |
| Vendor misbehaviour is undesignable | The fake's whole fault vocabulary is throw and commit-then-throw. Throttles, timeouts and 200-with-userErrors are handled by code that has never been executed against them. | high |
| Delivery order and duplicates assumed | Shopify gives no ordering and at-least-once delivery, and each handler is tested against its own happy sequence. | high |
| The brand pair copy-pastes its specs | Two store apps assemble the same package. Today three spec files are byte-identical across the pair and one has already drifted 920 lines against 330. Pairing and POS ingestion land on exactly this pair, so one brand would ship a store proven only against the other's assembly. | medium |
| Wall-clock reads make TTLs untestable | Presentation and session TTLs, code end dates, collection windows and the sweep watermark are all clock-based; an unreachable clock makes the boundary either unasserted or sleep-based. | medium |
| Suites read correct on CI's UTC machine | The store project pins no timezone and is about to render collection deadlines and day-bounded caps. | medium |
| Order-dependence decays into a retry | The db lanes share one module registry. New module-level state fails only in some file orders, and the cheapest fix — a retry setting — turns a one-in-three race into permanent green. | medium |
| A check exists and nothing runs it | Three root scripts are in the manifest and in no workflow today, before this feature adds any. | medium |

### Rules added to `check:libs`

- **Every workspace member resolves to a lane.** Make the resolver total: an entry the workspace listing returns whose path matches no lane rule fails by name instead of being dropped. Admit `integrations/*/*` to the workspace globs, the lane resolver and the wiring walk in the same commit. Assert no integration project declares a deploy script (it ships through the vendor CLI, not our Deploy) and that each carries a lane-reachable test script or a named exemption.
- **A shared behavior suite is mounted by every assembly that owns its schema.** Every `describe*Behavior` export from a package's testing surface must be imported by at least one app spec, and where the apps are a brand pair, by every app in the pair. **Plus the direction that catches what is already in the tree: no two spec files across a brand pair may be byte-identical** — a verbatim duplicate is an unextracted shared suite. Run it on today's tree; it must fail on the two duplicated store specs before any POS code is written.
- **The real-Postgres lane is reachable from the root and from CI.** An app with `test/pg/**` declares a `pg` project and a `test:pg` script; the root script fans out over every app declaring one; the workflow runs the root script. **And every such app has its own database and its own URL named in the workflow** — with one deliberate case pointing two apps at one URL and asserting the run fails loudly on the migration gate rather than proceeding with missing tables.
- **Every root check/test script is named by a workflow, and every workflow step names a script that exists.** Exemptions are named in the check with a reason, so "deliberately manual" is a recorded decision.
- **Time-dependent membership and pairing code reads an injected clock.** Bans a clock read inside a function body; **allows the `now: Date = new Date()` default-parameter form**, which the loyalty engine already uses at roughly thirty sites and which is fully drivable from a test.
- **A suite reaching the dates module pins a non-UTC timezone** in its project config. Documented today and enforced nowhere, which is how the store project stayed unset.
- **No vitest config sets `retry` or `repeats`** without a named exemption. A retried suite reports green for a race that happens a third of the time — exactly the class of bug the handle and claim paths can have.
- **The crons a worker dispatches are the crons its config installs** (from the redemption section — one rule, every worker).
- **`payment_customers` and `redemptions` are written only through their owning modules** (from the pairing section).

### Tests

- **The Shopify fake's self-test.** Pins the vendor semantics it encodes: upsert keyed on the member metafield returns the same customer after a lost response; a colliding email is refused, not silently adopted; a single-use code applied twice succeeds once with a distinguishable refusal; refund creation is idempotent on its note; commit-then-throw leaves state changed; a scripted throttle classifies as retryable and a `userErrors` answer is not success. Its honest limit: it proves the fake matches what we believe, and the release gates validate the belief.
- **Webhook delivery is order-independent where it must be.** Split the oracle. **Order-independent facts, asserted over every replay:** one order row on the payment-ref unique, one earn event, one refund row per order-and-refund-ref. **Terminal pairing state, asserted by named scenarios** — a delete arriving last is genuinely not the same outcome as one arriving first, so "converges on one state" would be either weak or wrong. The suite is the named inversions (each delivery before its causal predecessor, plus duplicates and one stale late replay); the exhaustive permutation sweep is a dispatchable run, not a per-PR cost.
- **The awaiting-collection migration is additive and safe against a half-deployed fleet.** Every pre-existing state still inserts and updates; the new state is accepted; an illegal transition out of it is rejected by the database; and — the partial-deploy case — **the drain's due-state claim query as shipped does not claim a row in the new state**, so a redemption waiting at the till cannot be retried and parked by a worker deployed a minute earlier.
- **A shuffled-order backend run**, as a dispatchable workflow the author runs when adding module-level state, with the seed reported. Not nightly: a scheduled red nobody owns at 3am becomes a red nobody reads.

### Not built

A metric-name catalog check cannot close the loop it claims to — the monitor definition lives outside this repo, so a catalog renames the literal without ever reconciling it against the alert, and the cost is a repo-wide refactor bolted onto a POS feature. The instrument that works already exists and several tests above use it: pin the exact string with the metric-capture helper at the scenario that would otherwise be silent.

---

## Shared test infrastructure

Only what survived. Several asks turned out to be already in the tree and are listed here so nobody builds them twice.

**Already in place — do not rebuild**

- The metric-capture helper, used in the store db lane today.
- A test clock, already wired into the store fixture and exposed on it.
- The fake fulfiller's lost-response behaviour (a during-fulfil hook plus a retryable answer), its deterministic artifact, and its per-code call log.
- Committed-migration reading and application as exported functions — a migration prefix is a slice over the returned array, not a fixture feature.
- The two-session Postgres server fixture with `hold()`, and the auction app's fixture and vitest project as the template.
- The real rate-limit binding under the workers pool, in the pinned miniflare.

**To build**

1. **A real-Postgres lane for the store and loyalty apps.** A `pg` vitest project each (no file parallelism, statement timeout under the test timeout), a `test:pg` script each, a root script that fans out, and the workflow extended. **Each app gets its own database and its own URL** — without that, the fan-out breaks the auction lane rather than enabling the new ones.
2. **The Shopify fake grown into a fake Admin API with fault seams.** Per-method scripted throttle (both the HTTP and GraphQL shapes), timeout, and 200-with-`userErrors`, alongside the existing throw and commit-then-throw. Plus the surfaces membership needs: customer upsert on the member metafield with a uniqueness registry, lookup by identifier, order customer set, delete and erasure request, merge, discount create with usage-limit and scope semantics and a single-use burn, and order listing paged by update time. Its file header names, per modelled constraint, the release gate that justifies it.
3. **`deliverInEveryOrder(deliveries, run)`** in the same testing package — replays a delivery set in a named set of inversions with duplicates and one stale late replay, signing with the existing webhook signer.
4. **`describePairingBehavior(makeFixture)`** exported from the store package and mounted by **both** brands' store apps, with `expectPairingInvariants(db)` after every scenario (one live row per provider-and-user, no deleted row ever revived, every non-terminal row carrying a next attempt).
5. **`describePosGatewayBehavior(makeFixture)`** exported from the membership package and mounted by the one brand that has a POS app — so the other brand mounting nothing is a visible fact rather than an omission.
6. **`FakeLoyaltyTerminal`** — scriptable and deliberately **non-deduping**: it mints a fresh code on every call and records each verbatim, with hooks to throw after the debit, park in preparing, and delay. Its non-idempotence is the point; a deduping fake would make every gateway idempotency test a test of the fake.
7. **A POS session-token minter** in the membership package's testing surface: configurable audience, destination, expiry and skew, plus a previous-secret variant.
8. **A random-bytes port** on the short-code minter, so a scripted RNG can force a collision and exercise rejection sampling.
9. **A rate-limiter port** with a deterministic in-memory fake — scoped to the database-backed sliding-window policy, not to the Cloudflare binding, which the worker lane exercises for real.
10. **A recording notifier** (push and email) with per-channel scripted failure.
11. **A fake POS host** for the extension frontend — customer set, cart discount, cart signals, scanner, toast — so the modal's state machine runs in jsdom with no vendor global. The extension itself cannot be driven in CI; this fake is the only place its logic is ever asserted.
12. **A fault-injection Proxy** over the real drizzle handle in the loyalty testing helpers: throws for one named member's write and counts candidate scans. **One helper, both sweeps.**
13. **A raw lot seeder and clock setter** in the loyalty testing helpers, so exhaustive expiry tables and large backlogs are built from dates stated directly.
14. **A three-rung ladder programme** with two points tiers, so a lapse can land on a lower points rung — a genuinely different code path from lapsing to base, and unreachable with today's fixture ladder.
15. **Split `occurredAt` from `now` in the ladder spend helper.** It passes the event time as the clock today, so every backdated scenario in the repo runs with a rewound clock and models no real backfill. **Do this before writing any backdating test**, or they will all assert the wrong thing.
16. **Hoist the test clock** out of the payment-provider testing package into the shared test helpers, so the pglite lanes and the workers lane pin time the same way.
17. **A non-UTC timezone on the loyalty and store `db` projects** — one line each, on the existing projects, not new ones.
18. **Collect-in-store support in the loyalty fixture**: a reward whose fulfilment ends awaiting collection, the collection call on the caller type, and a window the scenario can advance.
19. **External-order fixtures**: POS paid and refund bodies and the matching Admin order shape, with line items carrying type and tag so gift-card, shipping and fee lines are separable, in tax-inclusive and tax-exclusive variants.
20. **Direct entry points for the new cron passes** (external sweep, attribution, pairing drain) so the db lane drives them the way it drives the reconcile pass — no test may infer a pass ran from a green cron tick.
21. **A recording loyalty sink** bound into the store db lane's drain, so a test can assert the emitted keys, amounts, event times and delivery order.

---

## Release gates

Evidence a dev shop gives, recorded with a date and a tester. No test in this repo can settle these, and the fakes encode them as assumptions until they are answered.

1. A customer upsert retried after a killed connection returns the same customer id.
2. The member metafield definition refuses a second customer carrying the same value.
3. An email collision surfaces as the `userErrors` shape our decoder expects.
4. A customer-scoped single-use code is refused at POS with no customer attached, and two terminals cannot both complete one code.
5. Data-erasure on a customer with orders — what it leaves behind, and whether the metafield survives.
6. POS `orders/paid` exposes line items well enough to compute the eligible-goods basis, **and whether the subtotal we read nets an order-level discount code** — this second half decides both the earn and the refund claw-back on every points redemption.

**Ingestion must not ship before gate 6.** Without it every POS order parks unearning, and no suite here would say which half is wrong.

---

## Build order

The POS, pairing and external-order code does not exist. Its suite is a landing requirement, not a retrofit — each phase ships with its tests or does not ship.

### Phase 0 — loyalty engine and lanes (no new product code)

Independent of everything below, and it removes the confirmed money defects before any new writer touches the ledger. Each fix takes the structural shape named at the top, not the local patch.

Lands with:

- Refund progress as its own recorded fact, advanced unconditionally by `recordRefund` — the cursor fix — with its claw-back test; the revoke-then-re-attribute rule and test.
- The points ceiling on the ledger writers, with the balance-cast case.
- The zero-earn refund answering zero-zero.
- The tier work: the period start read from the stored anchor (the leap-day fix), the tier-on-refund policy under both branches, the lapsed-holder rollback case, the non-climbing-multiplier parser check.
- The unknown-config-key refusal, as a decoder-wide excess-property error.
- The `policies` block of the programme config — the one place the one-way preferences live (tier on refund, expiry reclaim, re-attribution shortfall) — with the tier switch implemented both ways. Expiry reclaim joins implemented in phase 3 with the redemption work; until then its key is refused at boot, so the flag can never parse into a no-op again.
- The refund identity rule — one refund recorder keyed by the vendor's refund id, fed by the webhook and reconcile alike — landed on this branch; phase 0 keeps the reconcile-then-webhook test as its pin. The external sweep inherits the recorder in phase 2 instead of inheriting the bug.
- The expiry-rule table with the `remaining` dimension; the invariant hook reading one instant; the reversal-after-lapse test.
- The backdating helper split, then the clock-and-floor table.
- Deleting the unused programme parameter from the refund path; removing the writer label from the fingerprint.
- **Lanes and checks:** the store and loyalty pg lanes with per-app databases; the lane-totality, shared-suite, byte-identical-spec, script-in-workflow, clock, timezone and retry rules; the cron-dispatch and table-write-surface checks; the fake's fault seams and its self-test.

### Phase 1 — pairing

Lands with: `describePairingBehavior` mounted by both brands, the transition matrix, the claim tests, the userErrors classifier, the adoption tests, all four deletion tests including code deactivation before customer delete, the repoint re-scoping test, the webhook tests, repair-on-use, admin unpark, backlog metrics, the schema migration test, the backfill re-run, and the write-surface check. Gated on release gates 1, 2, 3 and 5.

### Phase 2 — external orders and attribution

Lands with: the reconcile-versus-webhook refund rule, the guard tests (own checkout, blank token, merge), the convergence tests, the ownerless and re-attributed refund tests, the claim and claw-back tests, the eligible-goods table, the cross-channel equality test, the points-code basis test, the watermark and channel-scope tests, the deleted-pairing and staff-attached-customer refusals, the origin migration test, and the one pg spec (refund racing attribution, carrying the two-operator claim assertion). Gated on release gate 6 — **do not turn earning on without it**.

### Phase 3 — redemption fixes and the POS gateway

Lands with: the hand-settled reversal fix and the reversed-row-keeps-no-code invariant, the awaiting-collection migration and its partial-deploy assertion, quantity redeem, the daily cap on a pinned timezone, the breakage counter, the bounded and audited unpark, the mint-control pin and the userErrors classification, the router ladder oracle, the token and rotation tests, the intent tests including two legitimate intents, cancel-deactivates-the-code, the identify failure and partial-fan-out tests, the audit and provenance tests, the notification tests, the kill-switch tests, CORS, the wire-schema diff, and the four POS pg specs. Gated on release gate 4.

### Phase 4 — the POS extension

Lands with: the fake-host modal tests, the baked-origin map, and the collection tests. The extension ships on a manual per-location activation lane, so the wire-schema diff check must already be in place before the first bundle is activated.