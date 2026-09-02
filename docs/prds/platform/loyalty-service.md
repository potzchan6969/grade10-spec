---
title: Loyalty Service
order: 3
---

Points, tiers, and a reward menu, general enough for any product. All behavior lives in `@grade10/loyalty-service`; `apps/backend/grade10/loyalty` is an assembly — program config, bindings, migrations, nothing else. Which products run one: [Multi-Product Assembly](/platform/multi-product). The core: **the ledger is an append-only list of dated point lots, every balance is a query over it, and every ledger write happens once, under that member's row lock.** Three clocks run on top of it — the member's activity clock, which says when their balance lapses; an earned tier's term, which says when it must be earned again; and a redemption's fulfilment lifecycle, which runs until the member holds what they bought.

## Model

One Postgres schema (`loyalty`) per product database (`stg-/prd-<product>-loyalty`).

| Table | Holds |
| --- | --- |
| `account_member` | one row per user id, created lazily on first write: enrolment date, the earned tier with the day it was reached and the period it is held for, the activity clock every lot's expiry is measured against, and the row every mutation locks |
| `ledger_entries` | append-only credits (+) and debits (−) |
| `ledger_consumptions` | which credit lots a debit drew down, and how much of each |
| `mutation_results` | what each request-shaped mutation answered, keyed on its idempotency key — the answer a retry replays, and the reference it was about |
| `earn_progress` | how much of a reference's money its completed spends have priced, per member — what tells a refund that overtook its earn from one settled at zero |
| `refund_progress` | how much of a reference's money has come back, per member — the cursor the next claw-back prices from |
| `tier_changes` | append-only history of the effective tier, one row per observed move, with its cause (enrollment, evaluation, invitation, revocation, review, refund) |
| `tier_invitations` | grants of an invite-only tier, revocable and optionally dated — at most one active per member and tier |
| `reward_items` | the redemption menu: cost in points, optional stock, optional active window, and how a redemption of it is handed over |
| `redemptions` | the entitlement a redeem produced: what the member bought (`issued` or `reversed`), whether they hold it yet (the fulfilment state), the code and artifact a fulfiller made, and whether it took finite stock |
| `audit_logs` | hash-chained record of every elevated admin mutation ([Admin Access Control](/platform/admin-access)) |

### What a ledger row carries

- A credit: `remaining`, `expires_at` — the floor its life is measured from — tier fuel (`qualifying_points`), and the economic facts it was earned from (amount, currency, basis, base points, multiplier)
- A `reverse` credit names the root credit it restores (`restores_entry_id`, never another restoration)
- A `revoke` debit records the refunded money (`amount_minor`) it took points for; where the reference's money has got to is `refund_progress`, floored by these rows but never derived from them — a claw-back that reached no points writes none
- Every row names the surface that wrote it (`written_by`: `commerce`, `loyalty`, `trpc`, `sweep`), set by that surface from a constant and never parsed from what a caller sent — provenance only, never part of what identifies a request

### Nothing is a second source of truth

- Balance is `SUM(remaining)` over the credits unspent and still alive at the instant asked — alive meaning past neither their own date nor the member's activity clock
- A lot's effective expiry is `greatest(expires_at, activity_expires_at)`, written in one place and read everywhere: in SQL for every balance, and in TypeScript wherever the row is already in hand
- Tier is `evaluateTier` over the earned tier the member still holds, the window's points, and any live invitation — a term that has run out is dropped before the call, so the function itself needs no clock

### The mutable columns are enumerated

- The menu, by audited admin edit: name, description, `point_cost`, `stock`, `fulfillment`, the active window, `archived_at`. The cost and the fulfilment template are copied onto each redemption, so repricing or retemplating never rewrites what a member paid or what an in-flight redemption produces
- The member row under its own lock: `enrolled_at` stamped once; `earned_tier_id`, `earned_tier_activated_at`, `earned_tier_period_started_at` and `earned_tier_expires_at` moving together on attainment, extension or lapse; `activity_expires_at` moving forwards only
- A credit's `remaining`, drawing down and never below zero
- A redemption's lifecycle: `state` flips `issued → reversed` once; `fulfillment_state` walks the machine forward; `fulfillment_code` is written once, before any vendor call; `fulfillment_used` only ever climbs; `fulfillment_artifact`, `attempts`, `next_attempt_at`, `last_error`, `fulfilled_at`, `fulfilled_by`, `unparked_by`, `unparked_at` and `reversed_at` follow it
- An invitation's `revoked_at` and the operator in `revoked_by`, one way
- Everything else is append-only and triggers enforce it: the ledger apart from `remaining`, consumptions, tier history, mutation results, audit logs

## Invariants

- Every debit's consumptions sum to exactly its amount — no debit is unallocated, including expiries, admin adjustments and refund claw-backs
- Every credit's consumptions sum to at most its amount, and `remaining = amount − consumed` at all times
- Therefore `SUM(amount) = SUM(remaining over open credits) ≥ 0` — the two ways of adding the ledger up always agree, and no member goes negative
- The balance anyone reads is the part of that which is past neither its own date nor the member's clock
- A member's earned tier, the day it was reached, and the two ends of the period it is held for are all set or all null — a term over no tier governs nothing, a tier without one could never lapse, and a period with no start is retention measured from nowhere
- The shared behavior suite reconciles all of this after every scenario, plus that every restoration names a root that is not itself a restoration — an allocator bug fails a test, not a reconciliation months later

## Mutation protocol

### Every member write runs in one transaction, on one lock and one clock

1. `SELECT … FOR UPDATE` the member row — the single writer for that user
2. Capture one transaction timestamp; use it for every check and every column
3. A request-shaped mutation replays its stored answer before any side effect
4. Do the work; metrics are captured inside the transaction and emitted only after commit, so a rollback leaves no count behind and a replay adds none

### First writers upsert, prior-state writers demand

- A writer that may be the first (spend, bonus, redeem, adjust, enroll, invitation grant) upserts the member row before locking it (lazy rows, [Account Data](/platform/account-data))
- A writer that needs prior state (refund, reversal, revocation, both sweeps) treats a missing row as an error
- The row is not enrolment: `me.enroll` stamps `enrolled_at`; until then the member is someone points were recorded for, not someone who joined

### Idempotency replays the stored answer verbatim

- Request-shaped mutations (spend, bonus, refund, redeem, adjust) look up `(user_id, idempotency_key)` in `mutation_results`
- A hit with the same request fingerprint returns the stored answer, marked replayed; a different fingerprint throws `CONFLICT` loudly
- A call that gained a field answers to both forms — a refund fingerprinted before it carried a currency still replays, so widening a call never strands events queued against the older service
- The fingerprint is the canonical JSON of the mutation input, instants as ISO strings, so the event date counts
- The writer label is dropped from it: which binding carried an event is not which event it is, so the same event redelivered through a second binding replays instead of conflicting — and a fingerprint stored back when the label was canonicalized still matches
- Nothing is recomputed: an outcome that wrote no ledger row — a spend too small to earn a point, a claw-back whose points were all spent — replays like any other
- One carve-out, and only where the reference has earned no credit at all: a refund carrying more money than that reference's completed spends have priced throws `NOT_FOUND` and stores nothing, because the earn has not landed yet. Money a spend priced into no points at all is settled at zero instead — an order too small to earn a point is not waiting on an earn that is never coming. Once a credit exists the refund always settles: money past what the reference earned on simply buys nothing

### Writers with no request behind them guard on state

- Expiry keys each debit on its lot (`expire:<lot id>`), and both the sweep and an activity that settles a lapse first write through the same key — so the row lands once between them, and a run that dies half way converges on the next one
- The tier review re-reads the term under the member's lock: one still running is nobody's to review
- Reversing a redemption and revoking an invitation guard on the flip itself (`issued → reversed`, `revoked_at IS NULL`) and fail loudly on a second call rather than answering twice
- Granting an invitation allows at most one active per member and tier, checked under the member lock, so a retried grant cannot leave an orphan that would make a later revoke a silent no-op
- Grant and revoke both answer with the member's effective tier after the operation
- Every fulfilment move is a guarded single-row UPDATE naming the state its writer saw, so a reversal landing mid-attempt reads as zero rows updated rather than as an overwrite

### Lock order, stock, and what the drain never locks

- Lock order is always member row → reward row, so concurrent redemptions of the same reward cannot deadlock
- Stock decrements by a guarded `UPDATE … WHERE stock IS NULL OR stock > 0`; zero rows affected rolls the whole transaction back
- The fulfilment drain takes no member lock at all: it touches redemptions only, claims with `for update skip locked`, and calls the vendor outside any transaction — a lock held across a network call is how a nightly job deadlocks a checkout

## Policies

### The programme is a config, refused whole at boot

- Every environment's entry is parsed at assembly, not just the one this isolate serves, so a bad staging table fails the boot here rather than at the first request after the promotion that made it live
- An unknown key is an error, never a stripped one: a misspelled flag, or one this build has not implemented yet, fails the boot instead of parsing into a no-op nobody notices

### Points lapse on inactivity, not on their own birthday

- Every credit is born with a date — its event date plus the program's expiry months — and lives to the later of that and the member's `activity_expires_at`
- A spend or a redemption pushes that clock to its own event date plus the same months; the clock only moves forwards and only to an instant still ahead, so a webhook that arrives late shortens nothing and no member ever carries a clock that lapsed before it was written
- Activity settles first: whatever is already dead is written off under the lock before the clock moves, so no extension reaches back over points that had already died
- A bonus fuels the tier and adds points but is not activity, and neither is a reversal
- The per-lot date is a floor no update rewrites — it is what makes FIFO deterministic and what the sweep's index scans — so a member's page, an operator's ledger and the sweep all read one effective date
- An expiry debit says `sweep` whoever noticed the dead lot: which mutation happened to see it first is not what wrote it off
- How long one event's points live is computed in one place (`creditLife`), so the date stamped on the credit and the date the clock lands on can never disagree
- Settling a lapse is one statement whatever the backlog — the debits, their consumptions and the drawn-down credits move together — so a dormant member with a thousand dead lots can still check out

### Tiers are earned for a term and re-earned inside it

- Attainment: the member's own points reach a rank above the one they hold, so the tier, the day and a fresh term are stamped together
- Retention: the same tier, its threshold already earned inside the current period, extends the term by one more from the term's own end — the anniversary is kept, and it lands the moment an evaluation sees it rather than at a year-end reckoning
- The period's start is stamped with its end, never inverted back out of it: month arithmetic clamps, so a term stamped on 29 February ends on 28 February and the inversion would open the period a day before the earn that bought it. An extension opens the next period where this one ends, so the measurement window rolls forward with the term and re-anchoring is once per period by construction
- A start behind the attainment it belongs to is read as the attainment, loudly — the deploy window between the migration and the code writes exactly that row, with no start after a first attainment and a closed period's start after a re-attainment. A tier with no attainment instant or no end is a broken row and throws
- The term itself never moves on a claw-back: the window is derived on each side of the debit, and the member gives up a rung only where the window attained it before and no longer does — a tier held on its term rather than on today's window is not a claw-back's to take. The member lands on the rung the window still attains for the period they are already holding, and only a drop to the base tier clears the four columns
- Lapse: the term ran out and the rolling window attains nothing, so all four columns go back to null and the member is on the base tier
- Losing a tier — a lapse or a claw-back demotion — also stamps `demoted_at`, the floor every later tier point count is read under: an earn dated before that instant counts toward reaching or retaining nothing, so the climb starts at zero and a stale rolling-window earn can never flip a demotion back into a promotion on its own. Only a fresh demotion moves it; a later attainment needs no clearing, since its own period start already reads later than it
- What a tier is retained on defaults to what it was attained on. A config that asks more to keep a tier than to reach it is refused at boot, as is a term that is not exactly the qualifying window, and as is a rung that pays no more than the one beneath it — a points tier is compared against the points tier below it on the chain, an invitation tier against whatever it was placed over, because the evaluation hands out the highest rank's multiplier whatever qualified it
- Every evaluation runs twice — once ignoring invitations, once with them — so a tier earned while invited survives losing the invitation, and an invitation never becomes the floor nor extends a term
- A floor naming a tier the running config no longer knows is logged and left exactly as it is, so a config rollback finds it intact
- `tier_changes` records one row per effective-tier move; `loyalty.tier.changed` counts moves between tiers, not the null → base anchor row a new member gets

### A lapse is observed, and the review only records it

- Every read resolves the tier live: a term that ran out a second ago already reads as base, and a dated invitation stops counting the instant it expires
- The nightly review writes the history — under each member's lock it re-reads the term, re-evaluates, and appends the `review` row — then counts who fell and who re-earned what they held or better
- A lapsed member does not drop to base by default: they land on the highest tier their rolling window still attains, as a fresh attainment with a fresh term. Any landing below the tier they held — a lower rung or the base — also stamps `demoted_at`, so only earnings dated after the drop count toward climbing back, wherever the member landed
- A member the review settles nothing for — a tier this config no longer knows, which is left exactly as it is — leaves the run on the same terms a failure does: counted under its own name, out of the batch, and still in the leftover the next run picks up. A row the review changes nothing about matches the candidate scan again, so keeping it in would burn the whole budget on it and starve every member behind it

### Rounding floors base points first, then the multiplier

- The floor's place is deployed config (`earn.rounding`): the default `base_points_first` is the owner's rule — money becomes whole base points before the tier rate touches it, so HKD 139 at 1.2× earns 15; `once_at_end` lets the multiplier see the money and floors the total once (16)
- Swapping the order is a one-line config edit, never an operator action
- Each credit records `base_points` and `multiplier`, so what an entry granted is explained by the entry alone

### Claw-back is priced cumulatively and clamped

- The money already refunded is walked over the reference's credits first, in earn order at each credit's own recorded rate, so a refund split into several events claws back exactly what one event for the whole sum would
- Every completed refund advances that cursor by the money it was handed, whether it took any points or not, and asserts its currency against the program's before the transaction opens
- It reaches the unspent, still-live part of that money's lineage — those credits plus whatever a reversed redemption restored from them
- It never touches a bonus that merely shares the reference, and never drives a member negative
- What it cannot reach is counted by cause, spent-first: `loyalty.clawback.shortfall` carries `cause:redeemed` — the pricing signal for the redeem-then-refund loop — or `cause:expired`
- It prices the goods that came back, at the rate the earn used: the seller sends the goods share of a refund, never the charge, so refunding a delivery removes no points ([Commerce](/platform/commerce))

### Claw-backs age out with their earn

- Every debit writes zero tier fuel; a claw-back subtracts qualifying points through its consumptions, dated by the root credit
- The penalty cancels exactly that earn's window contribution and slides out of the window with it — never a double penalty for an earn the window already forgot

### Event time is the caller's, within reason

- A backdated spend is accepted — late webhooks are real — and its expiry, its clock reset and its window membership follow `occurredAt`
- Backdated far enough that its whole life is already past, the credit is born dead: the earn stands and replays like any other, `EarnResult.deadAt` says when it died, and it is counted as `loyalty.points.dead_on_arrival` rather than as points earned
- The multiplier is the tier held when the spend is processed
- A spend dated more than five minutes ahead is refused

### Calendar math runs in the program's time zone

- Window starts, expiry dates and tier terms are computed once in `program.timeZone` and passed to SQL as absolute instants; no `now() − interval` in a query
- Month arithmetic clamps the day: Jan 31 + 1 month is the end of February
- An ambiguous wall-clock reading is the earlier instant; a skipped one lands just past the gap

### A redemption is what the member bought; fulfilment is whether they hold it

- `state` is the sale (`issued`, `reversed`); `fulfillment_state` is the handover, and only these pairs exist: `issued` × `pending | fulfilled | failed`, `reversed` × `cancelled | void_pending | voided | fulfilled`
- A `manual` reward is handed over at the counter, so it is fulfilled the moment the points are spent; every other kind is owed, and due to the drain immediately
- A reward may only offer a kind the running deployment can fulfil, checked when the menu is written — a reward nobody can deliver is a member's points spent on nothing
- The kind and its template are snapshotted onto the redemption, the same doctrine the point-cost copy follows
- The member sees `preparing` or `ready` and nothing else: how many attempts it cost and what the vendor said are the operator's business, and the promise is the same either way

### The drain delivers, and parks what it cannot

- One UPDATE claims what is due (`for update skip locked`), counts the attempt and pushes the next one out of reach; the vendor call runs outside any transaction and completion is a single guarded UPDATE
- The code is random, not derived — it is bearer value — and committed before the first call, so a crash leaves a code someone can find and the retry asks for the same one
- Backoff doubles from 60s to an hour; a permanent refusal or fifteen attempts parks the row as `failed`, where an operator retries it, settles it by hand, or reverses it
- Fifteen is a lifetime bound: un-parking re-arms the next attempt against the operator who asked and leaves the count alone, so no number of clicks walks a row nothing can fix back through the curve
- Whether an attempt is worth repeating is the port's answer, never the drain's: only the thing talking to the vendor can tell a rate limit from a rejected request
- It runs every five minutes, and once more straight after a redeem — deferred, on its own connection, so a member never waits on a vendor and a failure costs five minutes

### A reversal takes back what the row actually holds

- What it owes is read off three stored facts — the fulfilment state, whether a code was persisted, and whether an artifact was stored — through a closed table; a combination missing from it is refused loudly rather than passed through
- Nothing made yet is simply `cancelled`; a code already out leaves the deactivation owed (`void_pending`), which the drain retries forever — value still in the world is always worth taking back
- The line is the code, not the artifact: the drain persists a code before it calls, so a lost answer leaves one live at the vendor with nothing to show for it, and settling that by hand takes nothing back — reversing it still owes a deactivation
- An artifact the member already holds is taken back synchronously first, by the code the row was written with and never the artifact's copy of it: deactivate, read its usage, and refuse the whole reversal if it has been spent — restoring points on top of a used reward would pay for it twice
- That reading is taken outside the transaction, because it calls a vendor; the flip then takes the row for update and reads the same three facts again, so a fulfilment that moved underneath is gated again rather than overwritten
- Three stale readings in a row give up: nothing goes back, and it is counted, because the gate may already have killed a code the member is still holding
- Usage is kept at its high-water mark rather than re-read from the vendor, which can fall — and a code spent after its reversal already paid the member is counted and left on the row, because neither system knows on its own what the other did
- A manual handover stays `fulfilled`: nothing was ever minted for it

### Reversing a redemption restores the original lots

- Each consumed lot comes back as its own credit on that lot's own stored date, naming the root credit it restores
- So a reversal cannot extend the life of points — how long they really live is the member's clock, as for every other lot — and a later claw-back can still reach them
- Restocking is part of the same transaction and happens only when the redemption actually took a unit: a reward that was unlimited at redemption time gets nothing back

### What a reward actually is stays outside the package

- `RewardFulfiller` is the port: which kinds this deployment offers, whether a template is valid, make one, take it back, and how often it was used
- The app assembly plugs one in. With none, `manual` is the only kind the catalog accepts, nothing is ever owed, and the drain has nothing to claim
- No vendor is named anywhere in the package — a discount code and a printed voucher are the same columns to the lifecycle

### The only personal data is the user id

- No name, email, or address is copied here; identity stays in auth
- Nothing an operator types reaches an append-only table: a request fingerprint carries a digest of an adjustment's reason, never the words
- The words go to the audit trail, which is meant to hold them
- Loyalty is a named exemption from erasure ([Account Data](/platform/account-data)): every id here is an opaque FK that still balances once the auth user is gone, and the exemption's column inventory is pinned in CI

## Surfaces

### tRPC at `/api/trpc`

- `me.*` for the signed-in member: summary, history, redemptions, enroll, redeem
- `catalog.list` and `program` are public — the menu and the offer itself (currency, time zone, expiry months, tier validity, the tier ladder)
- `admin.*` is elevated; `admin.identity.*` proxies auth's directory (search, lookup) so admin screens render names while the identity database stays in auth
- Admin permissions in the shared RBAC vocabulary: `loyalty:read`, `loyalty:adjust`, `loyalty:invite`, `loyalty:catalog`, `loyalty:finance`, plus `audit:read` for the audit trail; `staff` holds `loyalty:read`, `admin` holds every one
- `admin.liability` reads what the program still owes, behind `loyalty:finance`, which no scoped role holds. Two registers at one instant: every unspent, unexpired point across all members — still a count, because what a point is worth in money is Finance's answer and not this surface's — and the money out in the codes those points bought, which already carries a face value and is reported as money. The second register belongs to the fulfiller: what is still spendable, what expired unused (breakage), and the three mismatch signals a person has to settle. A deployment that mints no codes answers `none` and one whose minter cannot be reached answers `unavailable` with the reason — never a zero, which an operator would read as "nothing to look at"
- `admin.redemptions.*` is the fulfilment queue: list it, retry a parked one, or settle one by hand — each recorded against the operator who did it; `admin.reverseRedemption` gives the points back. Retrying, settling and reversing all sit with `loyalty:adjust`, because un-parking a fulfilment moves what a member is owed
- `me.summary` carries both clocks: when the balance lapses without activity, when the earned tier lapses, and how far through retaining it the member is
- `me.history` answers a member-facing entry (id, kind, amount, occurredAt, effective expiresAt, reference, reward name, createdAt), never the ledger row — the row carries the request fingerprint, which is the retry key's business and nobody else's

### RPC over a service binding

- A worker that only sells things binds `CommerceEntrypoint` and reaches `recordSpend`, `recordRefund` and `getProgram` alone; the full stub adds `recordBonus` and `getSummary`, which are admin-grade and belong to nobody yet
- Any product worker that knows a purchase happened calls them with its own event id; the event id is the idempotency key
- `getProgram` is a handshake, not a getter: a caller checks its currency and its earn basis against the program once per drain, so a store pricing goods after discount can never feed a program pricing something else
- The caller's half is `@grade10/loyalty-contracts/commerce` — the selling surface as types plus `commerceServiceBinding()` to narrow the binding, none of the worker assembly
- `CommerceService` implements that same contract type
- Every RPC and admin input is bounded at the trust boundary (`src/utils/limits.ts`): lengths on ids and keys, caps on points and amounts ahead of the int4 columns; a violation answers `VALIDATION`, not an opaque database error
- A points figure nobody typed is bounded where it is written, not where it came from: both ledger writers refuse anything above `MAX_POINTS`, so every producer of a computed figure — money priced into points today, a quantity redeem next — inherits the same ceiling and writes nothing past it

### Two crons, three jobs

- Nightly (`0 3 * * *`): the expiry sweep, then the tier review. Neither reads what the other wrote — an expiry debit carries no tier fuel, a demotion spends no points — so the order is only which one gets the budget first, and that is the one that owes members a balance
- Every five minutes (`*/5 * * * *`): the fulfilment drain, and nothing else
- Every job is state-based and budgeted: it re-reads what is due under the relevant lock, stops on a soft deadline well inside the invocation's allowance, and reports what it did not reach. A partial run converges on the next invocation; no scheduler state exists to corrupt
- A failing member is isolated, not fatal: logged, counted, skipped for the rest of the run, picked up next run; the run's metrics emit regardless. The review and the drain report their zeros too, so a night with nothing to do and a night the job never ran do not read the same
- An expression the handler does not know throws rather than guessing which job it meant
- `POST /dev/sweep` and `POST /dev/drain` run the same code on demand; dev environments only, and the only way a local redemption is ever delivered

### Metrics

Every one reaches Datadog through the tail worker.

- Points: `loyalty.points.earned` (`tier:` on a spend, `source:bonus` on a grant), `loyalty.points.redeemed` (`reward:`), `loyalty.points.expired`, `loyalty.points.dead_on_arrival` — its own series, never a tag on the earn, so no dashboard sums in points the balance will never show
- Claw-back: `loyalty.clawback.shortfall` (`reference_type:`, and `cause:redeemed` or `cause:expired`)
- Expiry sweep: `loyalty.expiry.failures`, `loyalty.expiry.leftover`, `loyalty.expiry.backlog_age_seconds`
- Tiers: `loyalty.tier.changed` (`tier:`, `cause:`), and per review `loyalty.tier.review.demoted`, `.retained`, `.failures`, `.skipped`, `.leftover`
- Fulfilment: `loyalty.fulfillment.delivered`, `.failed`, `.undelivered`, `.parked`, `.void_pending`, `.backlog_age_seconds`, `.used_after_reversal`
- Redemption: `loyalty.redemption.reversal_stuck` — a reversal that ran out of readings and gave nothing back
- Both backlogs report age beside depth on purpose: one redemption owed since yesterday is worse news than a hundred owed since a minute ago

## Extension points

Deliberately not built, and where each lands when it does:

| Extension | Where it lands |
| --- | --- |
| A `shopify_discount` fulfiller | a `RewardFulfiller` in the grade10 assembly, gated on product decisions rather than engineering: the exchange rate that prices the menu, how a member binds to a Shopify customer, and whether Wave POS honours a code minted here |
| POS earning and redemption | ingestion in the store, which already owns the money events loyalty prices — a Wave Commerce sale reaches the same commerce RPC an online order does |
| Vouchers, stamp cards, stored value, referrals | new entitlement tables beside `redemptions`, on the same ledger |
| Campaign earn rules (double points, category bonuses) | a rules table plus an attribution column on the ledger, so an audit can say which rule paid |
| Negative-balance claw-back | a business decision the shortfall metric is there to inform |
| Email and Mixpanel | the tracking checklist in [Product Analytics](/platform/tracking), unchanged |
| Catalog response caching | tag purge on menu edits ([Edge Caching](/platform/edge-cache)), not the tRPC cache tier |

## Decision record

The program implements the owner's 2026-08 draft ([the programme reference](/references/grade10-loyalty-program)): activity-based expiry, tier validity with downgrade, and redemption as a Shopify coupon. Where the draft is silent or contradicts itself, engineering picked the default below and built it. Nothing has been deployed and no database exists yet, so every one of these is still cheap to reverse.

| Question | What is built | Why |
| --- | --- | --- |
| Do bonus points reset the expiry clock? | No — only a spend or a redemption does | The draft says the balance lapses after twelve months with no earn or redeem activity, then says any purchase or redemption resets it. Points nobody paid for should not buy the balance another year |
| Can a settled lapse be revived? | No — activity settles what is already dead before it moves the clock | A balance that came back would depend on when the sweep last ran |
| Is a reversal activity? | No | It undoes a redemption; the member did nothing new |
| What holds a tier for another term? | The tier's attainment points — 500 for Gold | The softer 400 is an open business question; the config carries a separate retention threshold for the day it closes |
| Where does a lapsed member land? | On the highest tier their rolling window still attains, as a fresh attainment with a fresh term | Dropping to base while holding a window's worth of points would demote and re-promote in the same breath |
| When is a tier verdict made? | At processing time, from the state the evaluation reads | A backdated earn counts the moment it lands and the multiplier is the tier held when the spend is processed — never a reconstruction of what the member would have been |
| Reversing a redemption whose coupon was used? | Refused loudly; the points stay spent | The reward was consumed; giving the points back would pay for it twice |
| What prices the menu? | Nothing yet — no fulfiller ships, so `manual` is the only kind a catalog can offer | The exchange rate is the business's to set, and inventing one in code would make it engineering's |

The `grade10-spec` store still carries the superseded requirements — they describe the program before this rebuild. When it is next updated it owes:

- **Spec deltas**: expiry on a member activity clock; tier validity, retention and the review sweep; the redemption fulfilment lifecycle; and the refund basis — a claw-back prices the goods that came back, at the rate the earn used.
- **Product decision rows** on [Membership](/p/grade10-site/loyalty): the exchange rate; how a member's identity binds to a Shopify customer; whether Wave POS honours a code minted here; the retention threshold (500 or 400); Black's annual cap, parked; verification that the excluded categories — shipping, grading fees, gift cards — are what the catalog actually excludes; and who funds POS ingestion.

## Q & A

- Why is every balance a query instead of a stored column?
  - A stored balance is a second source of truth that drifts; `SUM(remaining)` cannot disagree with the ledger it is derived from.
- Why keep a per-lot expiry when the member's clock decides?
  - The clock is one member-wide floor; the lot's own date is what orders FIFO, what the sweep indexes, and the fact of when those points were earned. Rewriting a date onto every lot at every purchase would be a write per lot per sale.
- Why does the fulfilment drain take no member lock?
  - It moves nothing a balance depends on, and a lock held for as long as a vendor is slow would block that member's next checkout.
- Why does a refund on a reference that has earned no credit yet throw `NOT_FOUND` instead of storing an answer?
  - That money is missing an earn, not terminal — the retry claws it back once the earn lands. Money a spend already priced at zero points is terminal, and the money those spends recorded is what tells the two apart. Asking only whether some spend arrived would settle a refund for money nobody has priced yet, and the earn that follows would never be clawed back.
- Why is a tier's period start stored when its end already implies it?
  - It does not imply it. Month arithmetic clamps the day, so a term stamped on 29 February ends on 28 February and walking that end back a year lands on the 28th — a day before the earn that attained the tier, which would then also count towards keeping it. Recording the start is one column; inverting clamped arithmetic is a free extra year at the higher multiplier, once every four years.
- Why are the two money cursors their own tables rather than sums over the rows the mutations left?
  - Because the mutations that move them may leave no row at all. A claw-back that reaches an empty balance writes no revoke row and would lose the money it refunded; a spend too small to earn a point writes no credit and would leave its refund refusing forever. Each writer advances its own cursor unconditionally, so the fact survives the side effect that never happened.
- Why does each cursor read still take a `max` over the old rows?
  - A deploy-window shim, both halves (`services/earning/progress.ts`): a mutation completed between the migration and the deploy landed only in the revoke rows or the stored spend requests. Once a later migration re-runs the backfills over that window, each cursor is total on its own and the floor reads come out.
- Why a digest of an adjustment's reason in the fingerprint, never the words?
  - The fingerprint lands in an append-only column no UPDATE can reach; words that may need erasure belong in the audit trail.
- Why does `CommerceService` implement the published contract type?
  - A rename then breaks this package's own build instead of a consumer's next release.
