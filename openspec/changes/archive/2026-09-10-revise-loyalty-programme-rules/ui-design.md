# UI

Two surfaces change: the member's own membership page and the operator
console.

## Screens

**No Figma frame exists for either surface.** The `@grade10/ui` blocks below
are shipped under `packages/ui/src/blocks/loyalty-membership/`; nothing here
describes a layout — that is the frame's job once it exists.

| Surface | App | State today |
| --- | --- | --- |
| Membership | `@grade10/web-spa` | `pages/membership` composes the blocks over the slices in `packages/loyalty/frontend/src/features/programme/{member,offer,rewards}`. Coupons have no view yet (10.5). |
| Console | `@grade10/admin` (grade10) | Pages exist: `members`, `rewards`, `invitations`, `liability`. Members show both counts, the tier's validity end and retention progress; no coupon wallet, tier removal or cancellation yet (11.2–11.5). |

## Components

The set **grade10-spec** exports from `@grade10/ui`:

| Export | Carries |
| --- | --- |
| `MembershipSummary` | Both counts as two counts, the tier held, its validity end, and progress toward retention |
| `RewardMenu` | The live menu, each reward priced in points, a money-off reward stating its code's validity period |
| `CouponList` | Issued coupons — the code where the shop takes one, what it is for, its own expiry, and whether it is spent, void or expired |
| `ActivityList` | The member's own entries, named in member-readable terms |

No design-system token or primitive changes. The store checkout gains a
points-payment control (group 9) — its frame lands with the same Figma work as
the membership surface. The console composes the same exports as brand-owned
view code; it needs no exports of its own.

`tierValidityLine` in
`packages/loyalty/frontend/src/features/programme/membership/presentation/`
already produces the one-line retention wording and takes the page's own date
formatter — `MembershipSummary` renders that string rather than re-deriving it.

## States

Each state below exists because a scenario in
[`specs/grade10-site/loyalty/programme/spec.md`](specs/grade10-site/loyalty/programme/spec.md)
defines it.

| Surface | State | Scenario behind it |
| --- | --- | --- |
| Membership | Two separate counts, never summed | *The two counts are shown as two counts* |
| Membership | Not joined — existing points shown with an invitation to join | *A member who never joined is invited to* |
| Membership | Tier term and what keeps it | *Re-qualifying keeps the tier* |
| Membership | Balance lapse date, from the inactivity clock | *A quiet year empties the balance* |
| Membership | Coupon readable the moment it is issued | *A coupon is readable as soon as it is issued* |
| Membership | Redeem submitted twice — one redemption, no second charge | *A double redemption costs one* |
| Membership | Every date in the programme's time zone | *Dates read in the programme's time zone* |
| Membership | A reward that has since been archived still names itself in history | *A retired reward is still readable in history* |
| Console | Sections shown only where the operator's permission allows | *Sections match permissions* |
| Console | Missing second factor opens the enrol/verify gate, not a refusal | *A missing second factor opens the gate* |
| Console | Reversal states that it voids the coupon | *A reversal voids the coupon* |
| Console | Reversal after the balance expired returns nothing, and says why | *A reversal after the balance expired returns nothing* |
| Console | Cancelling an unused expired artifact credits the points back | *An operator cancellation is the credit path* |
| Both | A response whose shape is unrecognised names the call that failed | *A stale console reports what broke* |

An operator's reason, retry keys and the internal pricing of an entry never
reach the membership surface — *An operator's reason stays out of a
member's view* and *Retry keys and internal pricing stay out of a member's
view*.
