---
title: Profile
spec: grade10-site/loyalty/programme
order: 5
---

A member runs their whole membership from one page at `/membership`: what they
hold, what they can spend it on, what is waiting for them at the counter, the
codes they own, their own history, and the card a till reads
([[loyalty-SC-62]], [[loyalty-SC-63]], [[loyalty-SC-64]]). Every section
reads for itself, so a menu that failed to load is no reason to hide a
balance.

## Joining

A member joins at `/join`, signed in. Grade10 asks for a mobile number as part
of joining — the number travels with the request, so a refused number enrols
nobody. One request enrols the member in the programme and seeds their Shopify
customer pairing behind the account; neither step waits on Shopify. A second
tap replays the first, so joining is safe to retry ([[loyalty-SC-02]]).
Someone whose purchases were recorded before they joined is invited to join
and shown the points already waiting ([[loyalty-SC-01]]).

## The membership page

| Section | What it shows |
| --- | --- |
| Summary | Tier, points to spend, points earned this year against the next threshold, when the tier renews, and when the points stay active until |
| Your member card | The QR the till scans, the short code beneath it, and a countdown |
| Rewards | The live menu, priced in points, with what the balance affords |
| Spend on your basket | Points against the current basket — an offer of a code, or a pointer to checkout where the shop takes points there |
| Waiting at the counter | Collect-in-store rewards with their deadline; a closed window says so |
| Your codes | Every money-off code in full, with value, expiry, and the undo |
| Activity | The member's own ledger, each spend saying what became of what it bought |

Every date reads in the programme's own time zone.

::story{id="loyalty-membership-membershipsummary--default" title="Tier, balance and progress"}

## The member card

The card is how a member proves they are standing at the till. Each
presentation is one QR and one eight-character short code backing the same
record: it lives ten minutes, and whichever of the two a till takes first
consumes it — the other is refused, naming where and when the first was used.
The card renews on demand, and an earlier presentation stays alive until it is
used or expires, so reopening the page mid-queue does not kill the code a
member just read out. The QR's payload is answered once and never stored; a
leaked database cannot replay it.

The short code exists for a camera that will not read a dim screen. Its
alphabet has no digits and none of I, L, O or U, so nothing typed is
confusable, and ten failed attempts in five minutes pause code entry for that
shop.

::story{id="loyalty-membership-membercard--default" title="The member card"}

::story{id="loyalty-membership-membercard--already-used" title="A code a till has taken"}

## Histories

A member's activity is their own ledger, in their own words, with the
operator's reason, retry keys and the pricing behind an entry kept out of view
([[loyalty-SC-59]], [[loyalty-SC-60]]).

| Entry | Meaning |
| --- | --- |
| Points earned | A purchase, or a campaign grant |
| Points spent | A reward redeemed |
| Points put toward a purchase | Points paid against a bill |
| Points expired | The balance lapsed |
| Points added, Points taken off | An operator's correction |
| Points revoked | A refund's claw-back |
| Points returned | A reversal |

Beside it sit the redemptions — each with its outcome — and the card's own
history: the last twenty presentations and, for each one a till took, where
and when. An identification the member did not present for, by email at the
counter, notifies them the moment it happens.

## What a member never sees

An operator's reason, a retry key, the fulfilment attempts behind a code, who
settled or reversed something, stock counts, and anyone else's anything. The
member's surface takes no user id; it reads the session. A member's identity
lives in the identity system and never in the programme, which holds only an
opaque user id.

:::callout{kind="warning"}
Two things decided for this surface are not built. No welcome bonus is
granted at enrolment — the deployed programme sets none. And deleting the
account does not yet tear the membership down; the ledger has no
account-deletion pass. Both are in flight under `revise-loyalty-programme-rules`.
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
store's too: `membership.presentCard` mints a `pos_handles` row, storing only
the QR token's digest, and `membership.presentations` reads the history. The
loyalty `me.*` surface answers summary, history, redemptions, redeem, quote,
undo and enrol, all off the session.
:::
