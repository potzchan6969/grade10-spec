# Design

## Context

Most of the engine this change asks for is already standing. The loyalty
backend in `grade10` (surveyed at `489a4a4c` on `feat/loyalty-program`) already
carries the dual count, both clocks, and the ladder validation this change
specifies:

| Already built | Where |
| --- | --- |
| Tier points separate from the spendable balance | `ledger_entries.qualifying_points` |
| Tier activation, validity end, re-qualification, downgrade | `account_member.earned_tier_activated_at` / `_expires_at`, `services/tiers/review.ts` |
| Balance expiry measured from last activity | `account_member.activity_expires_at` |
| Boot refusal on a bad retention threshold or validity term | `loyaltyProgram.ts` |
| A redemption that issues a code, and a reversal that voids it | `services/rewards/fulfillment.ts`, `redemptions.ts` |

What is missing is everything at the edges — where the programme meets the
seller, the counter, and the vendor that makes a coupon real:

- Nothing records **which channel** sold. Every ledger row says which surface
  wrote it (`written_by`), which is not the same fact and cannot stand in for
  it.
- Nothing computes **qualifying spend**. The programme is handed a money amount
  and prices it; no seller yet reduces that amount by discounts and coupons, or
  drops the lines that do not earn.
- No **fulfiller** is wired into the loyalty worker, so the only reward a
  deployment can hand over today is a manual one. The port exists
  (`services/rewards/fulfiller.ts`); no implementation does.
- The **counter** does not exist as a caller at all.
- The **auction** does not refuse points.

Requirements: [`specs/grade10-store/loyalty/spec.md`](specs/grade10-store/loyalty/spec.md).

## Decisions

### Tier points stay a column on the one ledger

`qualifying_points` on each entry is the tier count; `remaining` on each credit
is the spendable one. Both are derived by asking the same append-only ledger,
so a single write keeps the two consistent and no reconciliation job can drift.

Rejected: a second ledger for tier points. It doubles every write and creates a
state where one landed and the other did not — on an append-only financial
record, that is unrecoverable without a manual repair.

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
(which categories earn, how Shopify represents a discount) into a package that
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
wrote the row, not which channel sold — the counter and the online store can
reach the programme through the same surface.

### A coupon is a Shopify discount code, made behind the existing port

Every reward — discount or physical item — settles as a Shopify discount code.
That lands as a `RewardFulfiller` implementation in the app assembly, not in
the loyalty package: the port already has `fulfill`, `deactivate` and `usage`,
which is exactly what issuing, voiding and gating a reversal need.

This vendor choice is recorded in the programme's source material and not in
the specs, which never name a vendor. Physical rewards are the same path — the
member gets a code and the counter honours it — so there is one settlement
mechanism, not two.

Rejected: keeping the self-generated code that `fulfillment.ts` produces today.
Nothing at checkout would honour it, so a member would hold a code that does
not work.

### An operator correction adds no tier points

A correction repairs a balance the member should already have had; it is not
spend, so it moves nothing toward a tier. A campaign or sign-up grant is a
reward and does count.

This resolves a contradiction the proposal's wording created: "every grant of
points adds to both counts" would have swallowed corrections, which the
untouched requirement *Operator point grants distinguish correction from
reward* explicitly excludes. The requirement now says "every earning and every
reward grant", and names the correction case.

### Decisions from the 21 Aug review (Jeff)

The running engine was demoed against the proposal and five rules came back
decided; the spec delta now carries them:

- **Demotion resets tier progress.** The engine as built re-promoted a demoted
  member from the rolling attainment window the day after the sweep took the
  tier away. Decided: earnings before the drop count toward nothing afterwards.
- **A claw-back re-evaluates the tier at once.** Refunded spend is spend that
  never happened; the tier it bought does not survive it. This replaces the
  earlier "no demotion inside a validity period".
- **A reversal is for unused coupons only** — the out-of-stock remedy. A used
  coupon is never reversed. The engine already refuses this; the spec now says
  what the code does.
- **Points pay at checkout** at the programme's exchange rate — decided at
  HKD 1 per point for Grade10, deployed configuration like the earn rate.
- **Account deletion clears the membership immediately** — balance, tier
  progress, coupons, pending collections; the ledger record survives.
- **Tier names**: Silver (was Platinum) and Gold (was Diamond); multipliers and
  thresholds unchanged.

## Risks / Trade-offs

- **The seller becomes the authority on what earns.** A bug in apportionment
  mints or destroys points silently, and the ledger is append-only. The
  arithmetic gets its own tests at the store boundary, and every recording
  carries the basis it was priced from so a wrong number can be found later.
- **The counter cannot be blocked on the programme.** A till that stops selling
  because loyalty is down is worse than a lost point. Every counter path
  completes the sale first and records after, which means a real window where a
  purchase exists and its points do not.
- **A vendor now sits inside a redemption.** Points leave the balance before
  Shopify confirms the code. The existing drain covers this — the code is
  committed before the vendor call and the same code is retried — but a
  permanent vendor failure leaves a member paid-for and empty-handed until an
  operator reverses it.

## Migration Plan

Members already hold tiers under the old permanent rule and lots under the old
per-purchase expiry.

1. **Tier activation.** Set every held tier's activation to the deploy date, so
   everyone gets a full validity period to re-qualify in. Backdating to the
   purchase that first qualified them would demote members on day one under a
   rule that did not exist when they earned it.
2. **Balance expiry.** Derive one `activity_expires_at` per member from that
   member's most recent earn or redemption. Existing per-lot dates stay on the
   rows and stop being the binding constraint, because a lot lives to the later
   of the two.
3. **Channel backfill.** Existing rows predate the field; they are attributed
   to the online store, the only channel that has sold so far.

Nothing here is reversible by re-running it, so each step is a migration with
its own row counts asserted before and after.

## Open Questions

- **Retention threshold** — 500 (the qualification number) or a softer 400.
  Still undecided at the 21 Aug review; deployed configuration, boot
  validation accepts both.
- **Overflow tier points on large purchases** — a single purchase far above a
  threshold (an HKD 7,500 spend against a 500-point bar) may deserve special
  handling for the excess; PM marked it TBC.
- **External naming** of the two counts ("Status points" is the working
  candidate) — marketing to confirm before member-facing UI.
- **Coupon-and-refund lifecycle** — a coupon spent on an order later refunded,
  the shortfall write-off when clawed-back points were already spent, and the
  physical-reward collection window are all explicitly TBC from the 21 Aug
  review; the operator's manual correction endpoints are the stopgap.
- **Counter surface** — how staff sign in to the loyalty terminal, POS
  attribution controls, and outage fallback are auth-platform and store-ops
  questions, flagged to those tracks; this change builds the counter recording
  path behind a rate-limited, logged service lookup and nothing more.
- **"HKD 10 or equivalent"** — whether foreign-currency or crypto spend should
  ever earn. The engine refuses non-HKD by design; any change here is its own
  proposal.
