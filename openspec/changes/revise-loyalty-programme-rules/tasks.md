# Tasks

Group 1 lands in **grade10-spec** and the submodule bump is the boundary:
groups 9 and 10 cannot start until it has shipped. Group 2 is the shared
contract every backend group reads; once it lands, groups 3 through 8 are
independent and can be claimed in any order.

Survey the engine on the grade10 **mainline**. Design decisions, what is already
built, and the open questions: [`design.md`](design.md). Screens and component
exports: [`ui.md`](ui.md).

## 1. Loyalty blocks (grade10-spec)

- [ ] 1.1 Draw the membership and console frames in Figma and link them from `ui.md`
- [ ] 1.2 Export `MembershipSummary` from `@grade10/ui` — two counts shown as two counts, the tier's validity end, and retention progress
- [ ] 1.3 Export `RewardMenu` from `@grade10/ui` — each reward priced in points, money-off rewards stating their code's validity period
- [ ] 1.4 Export `CouponList` from `@grade10/ui` — code, purpose, own expiry, and spent or void
- [ ] 1.5 Export `ActivityList` from `@grade10/ui` — entries named in terms a member reads, carrying no operator reason, retry key or internal pricing
- [ ] 1.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:stories:ui`, `pnpm run check:design-system`

## 2. Recording contract (grade10)

- [ ] 2.1 Add a required `channel` to the recording contract in `@grade10/loyalty-contracts`, valued from a closed set, and refuse a recording naming none or one outside it, so *An entry names its channel* passes
- [ ] 2.2 Carry `channel` onto `ledger_entries` and regenerate the migration
- [ ] 2.3 Extend the redemption contract with what a redemption produced — a code with its own validity period and void state, or an item owed — so *A coupon expires on its own terms* passes
- [ ] 2.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run db:drizzle:generate` with the output committed, `pnpm run check:migrations`

## 3. Migration of members already holding tiers and points (grade10)

Depends on group 2 for the `channel` column. Smaller than it looks: all four
tier columns and `activity_expires_at` are in the loyalty baseline,
`tierValidity` already deploys, and `writeEarnedTier` and `resetActivityClock`
already keep both clocks. There is no permanent-tier cohort and no member with
activity and no clock, so 3.1 and 3.3 are repair passes that should touch
nothing — they run because a throw on read is a bad way to find out otherwise.

- [ ] 3.1 Write all four tier columns together — `earned_tier_id`, `earned_tier_activated_at`, `earned_tier_period_started_at`, `earned_tier_expires_at` — activating at the deploy date, for any row holding a tier without a complete term; a partial row makes `getEarnedTerm` throw on every read
- [ ] 3.2 Settle every credit already past its own expiry date **before** writing member clocks, so the change-over revives nothing
- [ ] 3.3 Derive one `activity_expires_at` per member from that member's most recent earn or redemption, for any member missing one, leaving each credit's own date in place — `ck_ledger_entries_expires_at` requires it and the effective rule is the later of the two
- [ ] 3.4 Attribute existing ledger rows to the online store, the only channel that has sold
- [ ] 3.5 Assert row counts before and after each step, fail loudly on any shrink, and report how many rows each repair pass actually touched
- [ ] 3.6 Verify: `pnpm run test:backend`, `pnpm run check:migrations`, and each migration run against a seeded local Postgres with counts reported

## 4. Operator grants, tier removal, and channel on the ledger (grade10)

`adjustments.ts` and `earning.ts` already split the two counts correctly; 4.1 is
a test, not a change. The clock behaviour in 4.2 is the reverse of what
`earning.ts` does today ("a gift is not activity, so it moves no clock").

- [ ] 4.1 Cover that a correction credits the redeemable balance alone and a campaign grant credits both counts, so *A correction does not move a member up* and *A campaign grant moves a member up* pass
- [ ] 4.2 Reset the inactivity window on a campaign grant and leave it alone on a correction, so *A campaign grant keeps the balance alive* and *A correction does not extend the balance's life* pass together
- [ ] 4.3 Add an operator action that removes a tier inside its validity period, recorded with who and why, so *An operator removes a tier granted in error* passes — with a named permission, extending *Operators act through named permissions*. `tier_changes` already allows the `revocation` cause, so `ck_tier_changes_cause` needs no migration
- [ ] 4.4 Require `channel` on every write path into the ledger, so no row can be recorded without saying which channel sold
- [ ] 4.5 Verify: `pnpm run typecheck`, `pnpm run test:backend`
- [ ] 4.6 Keep one balance and one tier whatever channel wrote the entry, and make a channel's own copy of a balance non-authoritative, so *One balance across both channels* and *The channel's copy is not the balance* pass

## 5. Reward fulfilment (grade10)

- [ ] 5.1 Add discount-code creation, deactivation and usage lookup to `@grade10/shopify-backend`
- [ ] 5.2 Implement `RewardFulfiller` against it in the loyalty worker assembly and wire it in, for rewards that take money off; the port needs `fulfill`, `deactivate`, `usage`, `kinds` and `validateTemplate`
- [ ] 5.3 Record a physical reward as an item owed instead of issuing a code, so *A physical reward is not a discount code* passes
- [ ] 5.4 Void the issued code on reversal and gate the reversal on its usage, so *A reversal voids the coupon* passes
- [ ] 5.5 Read usage before deactivating, so a refused reversal does not kill a coupon the member can still use, and make the gate fire on manual redemptions with no fulfiller wired, so *A used coupon cannot be reversed* holds in every deployment
- [ ] 5.6 Return restored points as entries pointing back at the credits they came from, so a later claw-back can still reach them
- [ ] 5.7 Make a code that cannot be turned back into points, so *A member cannot undo a redemption* passes
- [ ] 5.8 Add the operator cancellation that credits points back for an unused expired artifact, so *An operator cancellation is the credit path* passes, and refuse it on a used one, so *A used artifact is never reversed* passes
- [ ] 5.9 Count what members forfeit to expiry where an operator can read it, so *An expired unused code returns nothing by itself* passes
- [ ] 5.10 Verify: `pnpm run typecheck`, `pnpm run test:backend`, `pnpm run build`
- [ ] 5.11 Refuse a reversal once what the redemption produced has been consumed and cancel it while it is still waiting, so *A collected reward cannot be reversed* and *A waiting collection is cancelled by the reversal* pass — the states an item owed moves through are `add-shopify-membership-pos`; this is the gate over them

## 6. Qualifying spend at the seller (grade10) (owner: @gareth0712)

The seller already sends a goods-only, after-discount amount and names its
basis, so shipping, tax and the provider's own discounts are handled. What is
missing is per-line eligibility and whole-order apportionment.

- [x] 6.1 Drop grading service fees, gift-card lines, credit top-ups and unlisted categories from the earning amount, so *Shipping and service fees earn nothing*, *A gift card earns once, not twice*, *A credit top-up earns nothing* and *An unlisted category earns nothing* pass — eligibility reads a reserved SKU prefix blocklist (default earns), not the spec's white list: no product category exists in the catalog yet, and a white list would stop every current product earning; revisit when a taxonomy lands
- [x] 6.2 Apportion an order-level discount across lines in proportion to line value, so *An order discount cannot be pushed onto the non-earning lines* passes
- [x] 6.3 Reduce the amount by any coupon that paid for it, so *A discount reduces what the purchase earns* and *A coupon reduces what the purchase it pays for earns* pass
- [x] 6.4 Record nothing when the whole order is discounted away, so *A fully discounted order earns nothing* passes
- [ ] 6.5 Send `channel` on every recording from the store
- [x] 6.6 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 7. The auction refuses points (grade10)

`packages/grade10-auction` has no loyalty binding today, so 7.2 is a guard
against one being added, not a change to existing behaviour.

- [ ] 7.1 Refuse points and coupons against an auction purchase, so *Points buy nothing at an auction* passes
- [ ] 7.2 Assert no earning is recorded for an auction win, so *An auction win earns nothing* passes
- [ ] 7.3 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 8. Tier rules the owner settled (grade10) (owner: @gareth0712)

`services/tiers/clawback.ts` already re-derives the tier after a claw-back and
`policies.tierOnRefund` selects it; Grade10 pins `keep`. Demotion reset is
genuine new work, and `testing/suites/tierValidity.ts` currently asserts the
opposite as correct.

- [x] 8.1 Set `tierOnRefund` to re-evaluate in Grade10's deployed programme config, so *A claw-back can demote* passes, and cover both policy values so the switch stays a real choice — done by removing the switch: the settled spec offers no keep, so `tierOnRefund` and the `policies` block are gone rather than defaulted (packages/loyalty/backend, commit e6c08959 in grade10). 2026-08-25 disposition: re-evaluation also withdraws a retention extension when the refunded earning was what supported it, so *A claw-back withdraws an unsupported retention extension* passes.
- [x] 8.2 Record the demotion date; no such marker exists today
- [x] 8.3 Count attainment and retention only from earnings dated after the last demotion, so *Losing a tier resets the climb* and *Tier points are derived from the same entries* agree
- [x] 8.4 Invert `re-earns a tier from the rolling window instead of resurrecting the old term` in `testing/suites/tierValidity.ts` — it asserts the behaviour this group removes
- [x] 8.5 Resolve a missing retention threshold to the tier's own attainment points and refuse a validity term that is not the qualifying window, so *A retention threshold asks more than the tier itself* and *Earned tiers measure over different windows* pass without refusing Grade10's own ladder
- [x] 8.6 Verify: `pnpm run test:backend`

## 9. Points pay for purchases (grade10) (owner: @gareth0712)

Depends on group 2 for the contract shape. Nothing of this exists today — no
rate on the config and no debit path outside the reward menu.

- [x] 9.1 Add the exchange rate to the programme config, validated at boot
- [x] 9.2 Debit points against a purchase as one recorded mutation, so *Points reduce the bill* passes and a retry cannot debit twice
- [ ] 9.3 Make a channel settling through a money-off artifact cost the same points and record one redemption, so *One debit however the channel settles it* passes
- [ ] 9.4 Exclude the points-paid amount from qualifying spend at the seller — needs group 6 — so *The part paid with points earns nothing* passes
- [ ] 9.5 Surface the points payment option in the store checkout flow
- [ ] 9.6 Verify: `pnpm run typecheck`, `pnpm run test:backend`, `pnpm run test`

## 10. Membership surface (grade10)

Depends on group 1 shipping and the submodule bump.

- [ ] 10.1 Add the membership page to `@grade10/web-spa`, composing the `@grade10/ui` exports over the existing `membership` and `rewards` feature slices
- [ ] 10.2 Show both counts as two counts, never summed, so *The two counts are shown as two counts* passes
- [ ] 10.3 Show the tier's validity end and what keeps it, rendering `tierValidityLine` rather than re-deriving the wording
- [ ] 10.4 Show the balance's lapse date from the inactivity clock, and every date in the programme's time zone, so *Dates read in the programme's time zone* passes
- [ ] 10.5 List issued coupons with their own expiry, readable the moment one is issued, so *A coupon is readable as soon as it is issued* passes
- [ ] 10.6 Invite a member with recorded activity but no join date to join, showing their existing points, so *A member who never joined is invited to* passes
- [ ] 10.7 Cost one redemption for a double submit across a reload, so *A double redemption costs one* passes
- [ ] 10.8 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`

## 11. Console (grade10)

Depends on group 1 shipping and the submodule bump. The backend rules it
surfaces land in groups 4 and 5.

- [ ] 11.1 Show a member's tier validity end and retention progress on the members page
- [ ] 11.2 Show both counts and the coupons a member holds
- [ ] 11.3 State on the reversal action that it voids the coupon, leaving the action itself unchanged
- [ ] 11.4 Surface the tier-removal and redemption-cancellation actions behind their permissions, extending *An operator runs the programme from one console*
- [ ] 11.5 Show what members forfeit to expiry
- [ ] 11.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`

## 12. Account deletion ends the membership (grade10)

Needs the account-deletion signal from the auth service — coordinate the hook
with the auth track before claiming.

- [ ] 12.1 On account deletion, zero the balance and tier progress, void unexpired coupons, and cancel anything a member is still owed, in one recorded pass, so *Deletion clears what the member held* passes
- [ ] 12.2 Keep the ledger record intact and make the pass idempotent, and act without waiting for any window, so *Deletion does not wait for a window* passes
- [ ] 12.3 Verify: `pnpm run test:backend`

## 13. Tier renaming (grade10) (owner: @gareth0712)

The feature has not launched, so names and persisted ids move together with no
compatibility mapping or data migration: `silver`, `gold`, `black`. A later
post-launch rename would require an atomic migration over
`account_member.earned_tier_id` and both tier-history columns.

- [x] 13.1 Rename the tier display names and persisted ids in the programme config and everywhere a member or operator reads them, so *The second tier is reached by spending* names Gold and *Tier records use the public identifiers* passes
- [x] 13.2 Rename the demo playground's programme and use-case copy to match
- [x] 13.3 Assert through the deployed programme and a real database that config, member state and tier history use `silver` and `gold`, with no `platinum` or `diamond` compatibility ids
- [x] 13.4 Verify: `pnpm run typecheck`, `pnpm run test`

## 14. Earning floors base points before the multiplier (grade10)

The one owner decision the engine does the opposite of today.
`computeEarnedPoints` rounds once at the end — its own comment says so — and
`program.earn` has no rounding key, so this cannot be reached by configuration.
Its own group, appended rather than folded into the earning work in group 6:
that group is about which money counts, this one is about how counted money
becomes points, and this one alone reprices every earn.

- [ ] 14.1 Add `earn.rounding` to the programme config schema, valued `base_points_first` or `once_at_end` and defaulting to `once_at_end` when absent, so an existing deployment keeps the order it already had
- [ ] 14.2 Implement `base_points_first` in `computeEarnedPoints` — floor money into whole base points, then apply the multiplier to those — leaving `once_at_end` as it is, so *Base points floor before the multiplier* and *A single floor at the end* both pass
- [ ] 14.3 Make the `base_points` stamp agree with the points actually granted under floor-first; today it is floored from the money while the total is not, so the two disagree on every multiplied earn
- [ ] 14.4 Set `rounding: "base_points_first"` in Grade10's deployed programme config, so *Grade10 floors base points before the multiplier* passes and HKD 139 at 1.2× earns 15
- [ ] 14.5 Invert `rounds once, at the end` in `test/services/earning/earning.test.ts` and the `rounding` case in `testing/suites/earning.ts` — both assert the order this group changes for Grade10; keep a case covering `once_at_end` so the config stays a real choice
- [ ] 14.6 Verify: `pnpm run typecheck`, `pnpm run test:backend`
