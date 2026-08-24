# Tasks

Group 1 lands in **grade10-spec** and the submodule bump is the boundary:
groups 9 and 10 cannot start until it has shipped. Group 2 is the shared
contract every backend group reads; once it lands, groups 3 through 8 are
independent and can be claimed in any order.

Design decisions, the survey of what is already built, and the open questions:
[`design.md`](design.md). Screens and component exports: [`ui.md`](ui.md).

## 1. Loyalty blocks (grade10-spec)

- [ ] 1.1 Draw the membership and console frames in Figma and link them from `ui.md`
- [ ] 1.2 Export `MembershipSummary` from `@grade10/ui` — two counts shown as two counts, the tier's validity end, and retention progress
- [ ] 1.3 Export `RewardMenu` from `@grade10/ui` — each reward priced in points and stating its coupon's validity period
- [ ] 1.4 Export `CouponList` from `@grade10/ui` — code, purpose, own expiry, and spent or void
- [ ] 1.5 Export `ActivityList` from `@grade10/ui` — entries named in terms a member reads, carrying no operator reason, retry key or internal pricing
- [ ] 1.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:stories:ui`, `pnpm run check:design-system`

## 2. Recording contract (grade10)

- [ ] 2.1 Add a required `channel` to the recording contract in `@grade10/loyalty-contracts`, valued from a closed set, so *An entry names its channel* passes
- [ ] 2.2 Carry `channel` onto `ledger_entries` and regenerate the migration
- [ ] 2.3 Extend the redemption contract with the coupon a redemption issues — its code, its own validity period, and whether it is void — so *A coupon expires on its own terms* passes
- [ ] 2.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run drizzle:generate` with the output committed

## 3. Migration of members already holding tiers and points (grade10)

Depends on group 2 for the `channel` column.

- [ ] 3.1 Activate every held earned tier at the deploy date, so no member is demoted on day one under a rule that did not exist when they earned it
- [ ] 3.2 Derive one `activity_expires_at` per member from that member's most recent earn or redemption, so *A quiet year empties the balance* measures from real activity
- [ ] 3.3 Attribute existing ledger rows to the online store, the only channel that has sold
- [ ] 3.4 Assert row counts before and after each step and fail loudly on any shrink
- [ ] 3.5 Verify: `pnpm run test:backend`, and each migration run against a seeded local Postgres with counts reported

## 4. Operator grants and channel on the ledger (grade10)

- [ ] 4.1 Split the operator paths so a correction credits the redeemable balance alone and a campaign grant credits both counts, making *A correction does not move a member up* and *A campaign grant moves a member up* pass together
- [ ] 4.2 Require `channel` on every write path into the ledger, so no row can be recorded without saying which channel sold
- [ ] 4.3 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 5. Shopify coupon fulfiller (grade10)

- [ ] 5.1 Add discount-code creation, deactivation and usage lookup to `@grade10/shopify-backend`
- [ ] 5.2 Implement `RewardFulfiller` against it in the loyalty worker assembly and wire it in, so *A physical reward is still a coupon* passes for every reward kind
- [ ] 5.3 Void the issued code on reversal and gate the reversal on its usage, so *A reversal voids the coupon* passes
- [ ] 5.4 Make a code that cannot be turned back into points, so *A member cannot undo a redemption* passes
- [ ] 5.5 Verify: `pnpm run typecheck`, `pnpm run test:backend`, `pnpm run build`

## 6. Qualifying spend at the seller (grade10)

- [ ] 6.1 Reduce an order to what the member actually paid, after item discounts and after coupons, so *A discount reduces what the purchase earns* and *A coupon reduces what the purchase it pays for earns* pass
- [ ] 6.2 Apportion an order-level discount across lines in proportion to line value, so *An order discount cannot be pushed onto the non-earning lines* passes
- [ ] 6.3 Drop shipping, grading service fees, gift cards, credit top-ups and unlisted categories from the earning amount, so *Shipping and service fees earn nothing*, *A gift card earns once, not twice*, *A credit top-up earns nothing* and *An unlisted category earns nothing* pass
- [ ] 6.4 Record nothing when the whole order is discounted away, so *A fully discounted order earns nothing* passes
- [ ] 6.5 Send `channel` on every recording from the store
- [ ] 6.6 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 7. The counter (grade10)

Built as a service-to-service lookup with no operator session. Terminal
sign-in, POS attribution controls, and outage fallback are auth-platform and
store-ops questions (see [`design.md`](design.md) Open Questions) — nothing in
this group waits on them.

- [ ] 7.1 Resolve a counter sale's member by the email on their account through the identity system, storing the account identity and never the email, so *The counter earns against the account, not the email* passes
- [ ] 7.2 Rate-limit and log the lookup per terminal, so probing which emails have accounts is bounded and visible
- [ ] 7.3 Complete the sale and record nothing when the email matches no account, telling the counter why, so *An unrecognised email does not block a sale* passes
- [ ] 7.4 Record counter earning and redemption against the same balance as the online store, so *One balance across both channels* passes
- [ ] 7.5 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 8. The auction refuses points (grade10)

- [ ] 8.1 Refuse points and coupons against an auction purchase, so *Points buy nothing at an auction* passes
- [ ] 8.2 Record no earning for an auction win, so *An auction win earns nothing* passes
- [ ] 8.3 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 9. Membership surface (grade10)

Depends on group 1 shipping and the submodule bump.

- [ ] 9.1 Add the membership page to `@grade10/grade10-spa`, composing the `@grade10/ui` exports over the existing `membership` and `rewards` feature slices
- [ ] 9.2 Show both counts as two counts, never summed, so *The two counts are shown as two counts* passes
- [ ] 9.3 Show the tier's validity end and what keeps it, rendering `tierValidityLine` rather than re-deriving the wording
- [ ] 9.4 Show the balance's expiry date from the inactivity clock, and every date in the programme's time zone, so *Dates read in the programme's time zone* passes
- [ ] 9.5 List issued coupons with their own expiry, readable the moment one is issued, so *A coupon is readable as soon as it is issued* passes
- [ ] 9.6 Invite a member with recorded activity but no join date to join, showing their existing points, so *A member who never joined is invited to* passes
- [ ] 9.7 Cost one redemption for a double submit across a reload, so *A double redemption costs one* passes
- [ ] 9.8 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`

## 10. Console (grade10)

Depends on group 1 shipping and the submodule bump.

- [ ] 10.1 Show a member's tier validity end and retention progress on the members page
- [ ] 10.2 Show both counts, and the coupons a member holds, on the members page
- [ ] 10.3 State on the reversal action that it voids the coupon, leaving the action itself unchanged
- [ ] 10.4 Return nothing and say why when a reversal lands after the balance expired, so *A reversal after the balance expired returns nothing* passes
- [ ] 10.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`

## 11. Tier renaming (grade10) (owner: @gareth0712)

Display names only — Silver was Platinum, Gold was Diamond; multipliers,
thresholds, and config ids are untouched unless a rename there is free.

- [x] 11.1 Rename the tier display names in the programme config and everywhere a member or operator reads them, so *The second tier is reached by spending* names Gold
- [x] 11.2 Rename the demo playground's programme and use-case copy to match
- [x] 11.3 Verify: `pnpm run typecheck`, `pnpm run test`

## 12. Demotion resets tier progress (grade10)

- [ ] 12.1 Make attainment and retention count only earnings dated after the member's last demotion, so *Losing a tier resets the climb* passes and the flip-flop dies
- [ ] 12.2 Update the demo's "Demoted at the term's end, re-promoted the next day" use case and test to show the new behaviour — demoted stays demoted until a fresh 500
- [ ] 12.3 Verify: `pnpm run test:backend`, demo tests

## 13. A claw-back re-evaluates the tier (grade10)

- [ ] 13.1 Re-evaluate the tier inside the claw-back path, so *A claw-back can demote* passes and a refunded promotion is taken back
- [ ] 13.2 Update the demo's "A full refund claws the points back, and the tier stays" use case and test to the new rule — the tier no longer stays
- [ ] 13.3 Verify: `pnpm run test:backend`, demo tests

## 14. Points pay at checkout (grade10)

Depends on group 2 for the contract shape; the exchange rate is deployed
configuration beside the earn rate.

- [ ] 14.1 Add the exchange rate to the programme config, validated at boot
- [ ] 14.2 Debit points against a checkout payment as one recorded mutation, so *Points reduce the bill* passes and a retry cannot debit twice
- [ ] 14.3 Exclude the points-paid amount from qualifying spend at the seller, so *The part paid with points earns nothing* passes
- [ ] 14.4 Surface the points payment option in the store checkout flow
- [ ] 14.5 Verify: `pnpm run typecheck`, `pnpm run test:backend`, `pnpm run test`

## 15. Account deletion ends the membership (grade10)

Needs the account-deletion signal from the auth service — coordinate the hook
with the auth track before claiming.

- [ ] 15.1 On account deletion, zero the balance and tier progress, void unexpired coupons, and cancel pending collections in one recorded pass, so *Deletion clears what the member held* passes
- [ ] 15.2 Keep the ledger record intact and make the pass idempotent, so a replayed deletion signal changes nothing
- [ ] 15.3 Verify: `pnpm run test:backend`
