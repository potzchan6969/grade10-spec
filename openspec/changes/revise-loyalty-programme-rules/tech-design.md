# Design

## Context

Most of the programme engine this change asks for is already standing on the
grade10 mainline.

| Already built | Where |
| --- | --- |
| Tier progress summed apart from the balance | `ledger_entries.qualifying_points` |
| Tier activation, validity end, re-qualification, downgrade | `account_member.earned_tier_activated_at` / `_expires_at`; written in `services/tiers/evaluation.ts`, scanned and driven by `services/tiers/review.ts` |
| Balance expiry measured from last activity | `account_member.activity_expires_at` |
| Boot refusal on a bad retention threshold or validity term | `loyaltyProgram.ts` |
| A redemption code, minted by the drain | `services/rewards/fulfillment.ts` (`newCode`, `ensureCode`) |
| A reversal that voids the code and refuses a used one | `services/rewards/fulfillment.ts` (`deactivateFulfillment`), `services/rewards/reversal.ts` |
| Tier re-evaluation on claw-back | `services/tiers/clawback.ts` |

A claw-back re-evaluates the tier, and that is now the only behaviour. The
engine had a `policies.tierOnRefund` switch with a `keep` value; since the
settled rules offer no keep, the switch and the `policies` block were removed
rather than defaulted, so no deployment can select a rule the spec does not
have.

What is missing is at the edges — where the programme meets the seller, the
shop, and the vendor that makes a coupon real:

- Nothing records **which channel** sold. Every ledger row says which surface
  wrote it (`written_by`), which is not the same fact and cannot stand in for
  it.
- **Per-line earn eligibility and order-discount apportionment** do not exist.
  The seller already sends a goods-only, after-discount amount and names its
  basis (`goods_after_discount`), so shipping and tax are already dropped and
  the provider's discounts already netted; what is missing is dropping grading fees
  and gift-card lines, and splitting a whole-order discount across lines.
- No **fulfiller** is wired into the loyalty worker, so the only reward a
  deployment can hand over today is a manual one. The port exists
  (`services/rewards/fulfiller.ts`); no implementation does.
- **Points paying at checkout** does not exist in any form — no exchange rate on
  the config, no debit path outside the reward menu.
- **Demotion does not reset progress**: a lapsed term still re-attains from the
  same rolling window. `testing/suites/tierValidity.ts` covers this as
  *re-earns a tier from the rolling window instead of resurrecting the old term*
  — an assertion that today's behaviour is correct, so it has to be inverted, not
  extended.
- The **auction** does not refuse points.

Requirements: [`specs/grade10-site/loyalty/programme/spec.md`](specs/grade10-site/loyalty/programme/spec.md).
The membership capability and the store channel belong to
`add-shopify-membership-pos`.

## Decisions

### Progress stays a column on the one ledger

`qualifying_points` on each entry is what that entry contributes to progress;
`remaining` on each credit is what is left to spend. Both are read from the same
append-only ledger, so a single write keeps them consistent and no
reconciliation job can drift.

Rejected: a second ledger for progress. It doubles every write and creates a
state where one landed and the other did not — on an append-only financial
record, that is unrecoverable without a manual repair.

### Earning floors base points before the multiplier

This is the one owner decision the engine today does the opposite of.
`computeEarnedPoints` rounds once at the end and says so in its own comment;
`program.earn` has no rounding key, and the config parser refuses an unknown
one, so this cannot be turned on by configuration alone.

The change adds `earn.rounding` to the config schema with two values.
`base_points_first` floors money into whole base points and applies the
multiplier to those; `once_at_end` keeps today's behaviour. Grade10 deploys
`base_points_first` — HKD 139 at 1.2× earns 15, where once-at-end pays 16.

Keeping both is what makes this a business lever rather than a one-way rewrite.
The default when the key is absent is `base_points_first` — the owner's order,
so a programme that names nothing earns the way Grade10 does, and one that wants
`once_at_end` says so. `base_points` and `multiplier_x100` are stamped on every
earn; the ledger invariant checks the granted points against that stamp under
the deployed order, so the two cannot disagree quietly.

### Balance expiry is one date per member, not a rewrite of every lot

`account_member.activity_expires_at` moves forward on any earn or redemption,
and a lot counts while *either* its own date or the member's clock is still
ahead. One row moves per activity.

Rejected: rewriting every open lot's `expires_at` on each purchase. A member
with hundreds of lots pays for all of them on every transaction, and the ledger
stops being append-only.

### The seller computes qualifying spend; the programme trusts the number

`grade10-store` reduces the order to what the member actually paid for earning
lines — after item discounts, after order-level discounts apportioned across
lines, after coupons — and sends one amount. The programme prices it and does
not see the basket.

Rejected: sending the basket to loyalty. It would move product knowledge
(which categories earn, how the provider represents a discount) into a package that
must stay brand-neutral, and every catalogue change would then be a loyalty
deploy.

The apportionment rule matters and is easy to get wrong: an order-level
discount is split across lines **in proportion to line value**, so a discount
cannot be pushed onto the shipping line to protect the earning ones.

### Channel is a required field on every recording

A new required `channel` on the recording contract, valued from a closed set
the contract owns. Required rather than optional, so a caller that forgets it
fails at the type boundary instead of writing an unattributable row onto a
financial ledger.

Rejected: deriving it from `written_by`. That column records which surface
wrote the row, not which channel sold — the shop and the online store can
reach the programme through the same surface.

### A money-off reward is a Coupon the programme holds; a physical one is not

A reward that takes money off mints a `coupon_instances` row inside the redeem
transaction — the built-in `coupon` kind — carrying its own validity and a
snapshot of the definition it was made from. The store honours it through its
`CouponTender` port: reserve at checkout, settle on the authoritative order
outcome, release when the order dies. No vendor issues the code, so nothing
external has to be voided on reversal; the row is.

The `RewardFulfiller` port stays for kinds a vendor makes. No shipped
deployment wires one, so the drain, its retry ladder and the artifact arms of a
reversal run against an empty set today; they are kept because a vendor-issued
reward is one config edit away, not because anything reaches them.

A physical reward is handed over instead and never becomes a code. Where it
waits in between is `add-shopify-membership-pos`, with the shop that hands it
over.

Rejected: a discount code minted at the commerce provider. The provider's
code is scoped to that provider's checkout, while the same coupon has to pay
at the till and online from one wallet.

### Tier ids match their public names before launch

The ladder uses `silver`, `gold` and `black` as its persisted identifiers and
Silver, Gold and Black as its display names. The feature has not launched, so
there is no production cohort or history to migrate and no compatibility alias
to preserve. Development and demo databases reset onto the renamed config.

This direct rename is deliberately pre-launch. Once member rows and tier
history exist in production, changing an id requires one transaction that
rewrites `account_member.earned_tier_id` and both tier-history columns alongside
the config change; changing only the config would strand those members behind
the engine's unknown-tier guard.

### An operator correction adds no progress

A correction repairs a balance the member should already have had; it is not
spend, so it moves nothing toward a tier. A campaign or sign-up grant is a
reward and does count.

The untouched requirement *Operator point grants distinguish correction from
reward* already draws that line, so the two-counts rule credits both counts for
an earning and a reward grant, and names the correction case separately rather
than saying "every grant".

### One-way preferences are one deployed policy block

Every "does a later event undo an earlier one" question — the refund's effect on
a reached tier, reclaiming an expired redemption, the shortfall rule when an
order is re-attributed — is a named switch in one deployed policy block, so the
answers sit together and can be read at a glance. The owner has settled the
first: a claw-back re-evaluates the tier. The rest default to *what happened
stands*, and each is swapped without a code change once confirmed.

### Rules the owner settled against the running engine

- **Demotion resets tier progress.** Earnings before a drop count toward nothing
  after it. The engine re-promotes a demoted member from the rolling attainment
  window the day after the sweep takes the tier away.
- **A claw-back re-evaluates the tier at once.** Refunded spend is spend that
  never happened; the tier it bought does not survive it.
- **A reversal is for unused coupons only** — the out-of-stock remedy. A used
  coupon is never reversed. The engine already refuses this, with two edges the
  spec now closes: the gate only fires when a fulfiller is wired and the row
  carries a code, and `deactivate` runs before the usage read, so a refused
  reversal still kills the member's coupon.
- **Points pay at checkout** at the programme's exchange rate — decided at
  HKD 1 per point for Grade10, deployed configuration like the earn rate.
- **Account deletion clears the membership immediately** — balance, tier
  progress, coupons, pending collections; the ledger record survives.
- **Tier names and ids**: members and operators read Silver and Gold, while the
  persisted identifiers are `silver` and `gold`. Multipliers and thresholds
  are unchanged.

## Risks / Trade-offs

- **The seller becomes the authority on what earns.** A bug in apportionment
  mints or destroys points silently, and the ledger is append-only. The
  arithmetic gets its own tests at the store boundary, and every spend carries
  the basis it was priced from so a wrong number can be found later. Bonus
  grants stamp no basis today; they price no money, so there is nothing to
  attribute.
- **A vendor now sits inside a redemption.** Points leave the balance before
  the provider confirms the code. The existing drain covers this — the code is
  committed before the vendor call and the same code is retried — but a
  permanent vendor failure leaves a member paid-for and empty-handed until an
  operator reverses it.
- **Tier ids become expensive to rename after launch.** The direct
  `silver`/`gold` rename is safe only because no production member or tier
  history exists yet. Any later id change requires an atomic data migration.

## Migration Plan

Less is needed here than the shape of the change suggests. Tier validity and
activity-based expiry are not new rules being introduced over old data: all four
tier columns and `activity_expires_at` are in the loyalty baseline migration,
`tierValidity: { months: 12 }` is already deployed, `writeEarnedTier` stamps the
whole term on every attainment, and `resetActivityClock` moves the member clock
on every earn and redemption. There is no cohort holding a permanent tier, and
no member with activity and no clock.

So the migration covers only what this change actually adds, plus repair of any
row the engine has not touched:

1. **Channel backfill.** `channel` is new. Existing rows predate it and are
   attributed to the online store, the only channel that has sold so far.
2. **Tier column repair.** Any row holding `earned_tier_id` without a complete
   term gets all four columns written together, activating at the deploy date.
   All four or none: `getEarnedTerm` throws on a tier without both dates and
   logs when the period start is behind the activation, so a partial write
   breaks that member's every summary read. Expect this to touch nothing; it
   runs because a throw on read is not an acceptable way to discover otherwise.
3. **Expiry repair.** Settle any credit already past its own date **before**
   writing a member clock. `repositories/ledger.ts` reads the later of the two
   dates, so a clock written ahead of a dead credit revives it. Each credit
   keeps its own date — `ck_ledger_entries_expires_at` requires every credit to
   carry one, so dropping them is not available.

Each step asserts its row counts before and after, and none is reversible by
re-running it.

**What this does change for rollout:** the first downgrade cohort is not a
migration artifact landing twelve months after deploy. Members are already
carrying real activation dates from real attainments, so downgrades arrive on
the schedule the engine has been building all along.

## Open Questions

None of these change a requirement. Each is a deployed value or a later
proposal, and the specs stand whichever way they land.

- **Retention threshold** — the spec and the deployed config say 500, the same
  number that attains the tier. The business may prefer a softer 400; boot
  validation accepts either, so the answer moves a value.
- **Overflow progress on large purchases** — whether a single purchase far
  above a threshold (an HKD 7,500 spend against a 500-point bar) should carry
  its excess forward. Today it does not, and the spec says so; changing that is
  its own proposal.
- **External naming** of the balance and the progress ("Status points" is the working
  candidate) — marketing to confirm before member-facing UI. It renames labels,
  not counts.
- **Coupon-and-refund lifecycle** — a coupon spent on an order later refunded,
  and the shortfall write-off when clawed-back points were already spent. The
  operator's manual correction endpoints are the stopgap until it is settled.
- **"HKD 10 or equivalent"** — whether foreign-currency or crypto spend should
  ever earn. The engine refuses non-HKD by design; any change here is its own
  proposal.
