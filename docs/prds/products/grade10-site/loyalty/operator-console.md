---
title: Operator Console
spec: grade10-site/loyalty/programme
audience: operator
order: 9
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

:::detail{title="Code map" for="engineer"}
- **Design record** —
  [loyalty architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/loyalty.md)
:::
