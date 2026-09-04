---
title: Profile
spec: grade10-site/loyalty/programme
order: 5
---

A member runs their whole membership from one page at `/membership`: what they
hold, what they can spend it on, what is waiting for them at the counter, the
codes they own, their own history, and the card a till reads
([[grade10-site-loyalty-programme-SC-62]], [[grade10-site-loyalty-programme-SC-63]], [[grade10-site-loyalty-programme-SC-64]]). Every section
reads for itself, so a menu that failed to load is no reason to hide a
balance.

## Joining

A member joins at `/join`, signed in. Grade10 asks for a mobile number as part
of joining — the number travels with the request, so a refused number enrols
nobody. One request enrols the member in the programme and seeds their Shopify
customer pairing behind the account; neither step waits on Shopify. A second
tap replays the first, so joining is safe to retry ([[grade10-site-loyalty-programme-SC-02]]).
Someone whose purchases were recorded before they joined is invited to join
and shown the points already waiting ([[grade10-site-loyalty-programme-SC-01]]).

## The membership page

| Section | What it shows |
| --- | --- |
| Summary | Tier, points to spend, points earned this year against the next threshold, when the tier renews, and when the points stay active until |
| Your member card | The code the till scans, the same value typed beneath it, where it was last used, and the two wallet actions |
| Rewards | The live menu, priced in points, with what the balance affords |
| Spend on your basket | Points against the current basket — an offer of a code, or a pointer to checkout where the shop takes points there |
| Waiting at the counter | Collect-in-store rewards with their deadline; a closed window says so |
| Your codes | Every money-off code in full, with value, expiry, and the undo |
| Activity | The member's own ledger, each spend saying what became of what it bought |

Every date reads in the programme's own time zone.

::story{id="loyalty-membership-membershipsummary--default" title="Tier, balance and progress"}

## The member card

The card is one code and never expires — the same value on every scan, drawn
from a space too large to guess against. Nothing has to be minted, so it opens
from a lock screen, scans with no signal, and survives being read out before
staff are ready.

It travels three ways, all showing the same code:

1. `/membership` — the card on the site
2. **Apple Wallet** — a pass added from the card
3. **Google Wallet** — the same

A pass carries the member's name, tier and balance beside the code, and
follows a change to any of them within **15 minutes**; several changes inside
that window cost one refresh.

**Replacement** is the control a durable card needs, and it sits beside the
card's own use history: one action kills the code everywhere at once, the
passes included. A till reading a replaced code says the card was replaced,
never that no member was found. An operator can replace a card for a member
who asks, on the operator record.

The typed form under the code is for a camera that will not read a dim screen —
the same value, grouped to be read aloud, in an alphabet with nothing
confusable in it. Repeated failed attempts pause code entry for that shop.

::story{id="loyalty-membership-membercard--default" title="The member card"}

## Histories

A member's activity is their own ledger, in their own words, with the
operator's reason, retry keys and the pricing behind an entry kept out of view
([[grade10-site-loyalty-programme-SC-59]], [[grade10-site-loyalty-programme-SC-60]]).

| Entry | Meaning |
| --- | --- |
| Points earned | A purchase, or a campaign grant |
| Points spent | A reward redeemed |
| Points put toward a purchase | Points paid against a bill |
| Points expired | The balance lapsed |
| Points added, Points taken off | An operator's correction |
| Points revoked | A refund's claw-back |
| Points returned | A reversal |

Beside it sit the redemptions — each with its outcome — and the card's own use
history: where and when the card identified them, whether or not any act
followed. An identification staff typed, by email at the counter, notifies
them the moment it happens.

## What a member never sees

An operator's reason, a retry key, the fulfilment attempts behind a code, who
settled or reversed something, stock counts, and anyone else's anything. The
member's surface takes no user id; it reads the session. A member's identity
lives in the identity system and never in the programme, which holds only an
opaque user id.

:::callout{kind="warning"}
Four things decided for this surface are not built. The card still mints a
single-use code per presentation and counts it down, and neither wallet pass
exists — both in flight under `add-wallet-member-card`. No welcome bonus is
granted at enrolment — the deployed programme sets none. And deleting the
account does not yet tear the membership down; the ledger has no
account-deletion pass; both in flight under `revise-loyalty-programme-rules`.
:::

:::callout{kind="note"}
No Figma frame exists for any membership surface. The `@grade10/ui` blocks —
`MembershipSummary`, `MemberCard`, `RewardMenu`, `CouponList`,
`PendingCollectionList` and `ActivityList` — and their stories are the visual
record.
:::

## Journeys

::journeys{id="grade10-site/loyalty/programme"}

::cases{id="grade10-site/loyalty/programme"}

:::detail{title="For engineers" for="engineer"}
The page is `apps/frontend/grade10/src/pages/membership` composing the
`@grade10/ui` blocks over `@grade10/loyalty-frontend`'s feature slices —
`member`, `offer`, `rewards`, `spending` — installed through the app's DI
container. Joining calls the store worker's `membership.join`, not loyalty's
`me.enroll` directly, so enrolment and pairing land together. The card is the
store's too: the store worker answers the member's code, the uses behind it and
the replacement, and mints both wallet passes from that same record. The
loyalty `me.*` surface answers summary, history, redemptions, redeem, quote,
undo and enrol, all off the session.
:::
