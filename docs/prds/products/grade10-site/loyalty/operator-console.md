---
title: Operator Console
spec: grade10-site/loyalty/programme
audience: operator
order: 9
reviewed: 2026-10-06
---

## Moving Points

An operator moves points by hand from the admin console two ways, and the two
part on one question: do the points count toward the tier?

- **Campaign grant** — a sign-up promotion, a goodwill gift; adds to the
  redeemable balance and to what counts toward the next tier and retention, so
  it can promote a member
- **Correction** — putting a mistake right; adds to or takes from the
  redeemable balance alone, so it never promotes anyone
- **Neither moves the date** — the points take the date the balance
  already has — [Points](/p/grade10-site/loyalty/points#expiry)
- **The form states the date** — before the operator writes, it names the
  day the points will lapse
- **Both carry a reason** — what the operator types goes to the audit trail;
  the ledger carries only its digest

❓ **Welcome bonus** — the owner's draft posts points at enrolment; none is
granted until the size is set. The owner's call.

## Restarting the Expiry

An operator gives a balance more time without the member buying or redeeming.

- **From today** — the window runs again from the day the operator restarts
  it, never a day they pick
- **Never shortens it** — a member whose date is already further out keeps it
- **Never a revival** — whatever has already lapsed is written off first and
  stays lapsed
- **Moves no points** — the balance is untouched, so nothing reaches the
  member's activity list; the reason goes to the audit trail
- **Same permission as moving points** — an operator who can grant can
  restart

## Authoring a Reward

An operator writes a reward's whole definition in the console's reward form,
with no call to the admin API. The form offers three choices, each saved as
one of the two kinds on [Reward Types](/p/grade10-site/loyalty/rewards#reward-types).

- **Money off** — a discount and a scope, saved as a product coupon
- **Gift with a purchase** — one variant and a minimum spend, saved as a gift
- 🚧 **Free item** — one variant at 100% off with no maximum discount, saved
  as the product coupon Money off would save; a stored reward of that shape
  opens, and duplicates, as a Free item
- **Online only by product or filter** — the form saves such a reward for
  online alone, one stored for the till as well included —
  [Reward Types](/p/grade10-site/loyalty/rewards#reward-types)
- **Missing parts** — nothing is saved while the choice lacks a part it
  needs, or the window ends before it starts; the form names what is missing
- **Basket check** — beside the form, the operator builds a basket by search
  and reads what the coupon would take off it, before saving

:::detail{title="Code map" for="engineer"}
- **Design record** —
  [loyalty architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/loyalty.md)
:::

:::detail{title="Product decisions" for="pm"}
The most common physical reward is one item at nothing, and an operator should
not have to build it out of a money-off discount. Nothing a coupon takes off
changes. Measured by the choices an operator makes to create a free item: two,
where the money-off route takes four.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Free item | Decided | Its own choice, saved as the coupon Money off saves, rather than `Everything (free)` under Money off, then Named variants, then a variant. | Product |
:::
