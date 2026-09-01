---
title: Points and Rewards
spec: grade10-store/loyalty
order: 1
---

The programme runs on one idea: a member's balance is never a stored number.
Behind every member is an append-only ledger of dated point lots, and a balance
is a query over it. Nothing is edited, so nothing can quietly drift, and a
mutation repeated under its own key answers once and records nothing twice.

The engine itself is brand-neutral and names no vendor anywhere. Everything
Shopify — minting a discount code, the till gateway, the member panel — sits
outside it.

## Earning

A money amount becomes points once, at the programme's rate times the member's
tier multiplier, and a purchase reaches the programme exactly once even when
loyalty is unreachable at the moment of sale: the store queues the order event in
its own database and a drain delivers it, so a sale never waits on the programme.
The store's own event id is the idempotency key, which is what makes a redelivery
free.

Grade10 runs in HKD on Hong Kong time. A member earns one point per HKD 10 of
qualifying spend, and one point pays HKD 1 back.

## Tiers

Tier is derived from earning, never stored as a decision. It ratchets up, it
survives the expiry of the points that won it, and it never silently drops. A
ladder that is ambiguous about which tier a member holds stops the product at
boot rather than at the moment a member is evaluated — a misconfigured ladder is
found by the deploy, not by a customer.

:::callout{kind="warning"}
The tiers ship as **Silver** (base, 1×), **Gold** (1.2×, 500 qualifying points
in a rolling twelve months) and **Black** (1.7×, invitation only), with persisted
ids `silver`, `gold`, `black`. The durable spec still calls the first two
Platinum and Diamond. The programme reference, the QA docs and the code all use
Silver / Gold / Black, and the in-flight rules rewrite states that no record uses
`platinum` or `diamond` — the spec is the pre-launch naming and has not caught up.
:::

## Spending

Rewards are priced in points, optionally stocked, optionally live only inside a
window. A redemption remembers what the member paid, so repricing a reward never
rewrites what an earlier redemption cost. Reversing one returns each consumed lot
as its own credit carrying that lot's original expiry date, rather than a fresh
credit with a fresh clock.

Points are consumed oldest-first, and a redemption beyond the balance is refused
whole rather than partially filled. A refund claws back what that money earned,
and never more than the member still holds from it.

:::callout{kind="warning"}
**The expiry clock in the spec is not the one that ships.** The spec says points
expire on a fixed window measured from the activity that earned them. What runs is
an activity clock: the balance lapses only after twelve months with no earning or
spending, and every purchase or redemption pushes that date forward. This is a
contradiction rather than a gap — the spec describes the programme as it was
before the rebuild, and the rewrite is in flight.
:::

:::callout{kind="warning"}
More of the programme ships without spec coverage than with it. None of the
following is in a durable capability today: the till and everything POS, paying
with points directly at checkout, collect-in-store rewards and their collection
window, the redemption fulfilment lifecycle (the five-minute drain, the backoff
curve, parking at fifteen attempts), tier terms and the nightly tier review, the
refund basis, the liability register, and the member card and `/join` surface.
Their requirements sit in unarchived changes or in architecture docs.
:::

## Journeys

::journeys{id="grade10-store/loyalty"}

::cases{id="grade10-store/loyalty"}

## The member's own surface

A member sees their own state and never the operating record behind it — no
operator reasons, no retry keys, no internal pricing. Dates read in the
programme's own time zone.

:::callout{kind="note"}
No Figma frame exists for any loyalty surface — not the membership page, the
reward menu, the member card, or the till — and no `@grade10/ui` block covers
loyalty. The Storybook stories below are the visual record.
:::

::story{id="loyalty-membership-membershipsummary--default" title="Tier, balance and progress"}

::story{id="loyalty-membership-membercard--default" title="The member card staff scan"}

::story{id="loyalty-membership-rewardmenu--default" title="The reward menu"}

::story{id="loyalty-membership-pendingcollectionlist--default" title="Rewards waiting to be collected in person"}

::story{id="loyalty-membership-couponlist--default" title="Codes the member holds"}

:::detail{title="For engineers" for="engineer"}
The design record is
[loyalty architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/loyalty.md)
— the ledger, tier derivation, expiry, claw-back, the fulfilment drain, the crons
and the metrics. Pre-production audit state is
[the loyalty QA record](https://github.com/9gag/grade10/blob/main/docs/qa/loyalty.md);
the owner's decided reference is
[the programme reference](https://github.com/9gag/grade10/blob/main/docs/references/grade10-loyalty-program.md).

Append-only is enforced by Postgres, not by application code: update and delete
triggers guard the audit log, consumptions, tier changes and mutation results,
and the only legal update to a ledger entry is its remaining amount, downward,
never below zero and never on a debit. A later migration re-arms every guard as
`ENABLE ALWAYS`, because before it one session setting took all of them off.

Permissions split five ways — `loyalty:read`, `loyalty:adjust`, `loyalty:invite`,
`loyalty:catalog`, `loyalty:finance` — plus `audit:read`. `staff` holds read
only; `admin` holds all of them; `loyalty:finance` is held by no scoped role at
all. An adjustment earns no tier fuel and a bonus does: that pair is the whole
difference between a correction and a campaign.
:::
