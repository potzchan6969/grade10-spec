# Decisions

## Goals

- **One legible rule** - a member can predict what keeps their balance
  alive: buy something, or buy points.
- **Money in, not points out** - only actions that bring money into the
  programme extend a balance's life (pending the open call on redemption).

## Non-Goals

- **Operator movements** - grants, corrections, reversals and the console
  restart are unchanged; they were never member activity.
- **Reminder timing** - who is warned before the day stays with
  `add-point-expiry-reminders`, which this change follows.
- **Earn pricing** - what a purchase earns is untouched; this change is
  only about what counts as activity.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What counts as activity? | A purchase, online or in store, and a points top-up - decided by the owner 2026-10-27 | The running rule's "earning or redemption", which never named what earning covers |
| Q2 | What counts as a purchase? | Any amount of qualifying spend, however tendered - including a bill paid partly or fully with points, and a purchase later refunded in full; the spend happened, so the reset stands. Decided by the owner 2026-10-27 | Only purchases that earned points, or excluding refunded orders |
| Q3 | When does a top-up count? | On the day it is credited - payment and credit sit a payment-gateway instant apart. Decided by the owner 2026-10-27 | The payment date |
| Q4 | Does redeeming still keep the balance alive? | **Open - PM to confirm.** Proposed: no - a redemption spends points without money coming in, so it stops resetting the window. The delta below is written to the proposal; if the PM rules the other way, the delta reverts to the running rule on this line alone | Keeping redemption as activity (the running rule) |
| Q5 | Is a reward redemption a "purchase"? | **Open - PM to confirm.** Proposed: no - redeeming a reward with points is a redemption, not a purchase, so it inherits Q4's answer | Treating a redemption's coupon sale as a purchase |
| Q6 | Do operator actions count? | No - unchanged from the running rule: a grant, a correction, a reversal and a console restart are never member activity. Decided by the owner 2026-10-27 | Letting a grant extend the date |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/loyalty/programme` | Does a redemption keep the balance alive? | Q4 |
| `grade10-site/loyalty/programme` | Is a reward redemption a purchase for activity? | Q5 |

`SC-95`'s heading is permanent and reads "Redeeming also resets the
window"; if Q4 lands as proposed, its body flips under that heading and
planning-dev should retitle or retire it there.
