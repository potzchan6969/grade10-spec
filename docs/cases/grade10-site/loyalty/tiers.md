---
page: grade10-site/loyalty/tiers
reviewed: TBC
---

The page's own example is a case too, cited by its id: `three-years`. The
rows below prove what no example walks. Cite one as
`grade10-site/loyalty/tiers#<id>`.

## Ladder

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| ladder-gold-reached | a Silver member with 450 points earned in the last 12 months | an order earning 50 completes | Gold from that instant | smoke |
| ladder-black-not-earned | a Silver member | they earn any number of points | never Black by earning alone | |
| ladder-operator-cannot-edit | an operator in the console | they look for a tier's rate or threshold | nothing lets them change it; only a deploy does | manual |

## Tier Progress

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| progress-redeem-untouched | a Gold member with a balance of 600 and progress of 600 | they redeem a reward for 500 points | balance 100, progress 600, still Gold | smoke |
| progress-earn-adds | a member | they earn 40 points | the balance and the progress both rise by 40 | |
| progress-refund-own-day | an order of 2026/03/01 that earned 300 | it is refunded in full on 2026/06/01 | the 300 leave the progress counted from 2026/03/01, not from the refund day | |
| progress-refund-ends-tier | a member held at Gold only by one order's points | that order is refunded in full | they stop holding Gold at once | |
| progress-refund-withdraws-extension | a Gold member whose one order passed 500 and extended the period | that order is refunded in full and what remains is under 500 | the period goes back to its old end; Gold holds until then | |
| progress-tier-lost-balance-kept | a Gold member with a balance of 950 | they lose Gold at the end of the period | the balance is still 950 | |
| progress-late-record | a tier period that began 2026/03/01 | an order of 2026/02/20 is recorded on 2026/03/05 | it counts toward the rolling 12 months, not toward keeping the tier | |

## Earn Multiplier

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| multiplier-promoting-order | a Silver member with 450 points earned in the last 12 months | a $1,000 order completes | 100 points at 1×, and Gold from that instant | smoke |
| multiplier-next-order | the same member, now Gold | the next $1,000 order completes | 120 points at 1.2× | smoke |
| multiplier-first-purchase | a member with no earning yet | a first order of $5,000 completes | 500 points at 1×, and Gold from that instant | |

## Keeping a Tier

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| keep-requalified | a Gold member with 500 points earned inside the tier period | the period ends | a new 12-month period from the old end, its progress at 0 | smoke |
| keep-short | a Gold member with 300 points earned inside the tier period | the period ends | Silver from that instant | smoke |
| keep-short-invited | a Gold member short of 500, with a live Black invitation | the period ends | Black while the invitation lives; Gold is gone | |
| keep-spent-points | a Gold member who redeems every point that reached Gold | inside the period | still Gold until the period ends | |
| keep-climb-restarts | a member who lost Gold on 480 points earned | they earn 30 the next week | still Silver; only the 30 count toward Gold | |
| keep-operator-removes | an operator with the tier permission | they remove a Gold reached in error, mid-period | the member falls to the highest tier they still hold; the record names who and why | |
| keep-points-only-operator | an operator who may only move points | they try to remove a member's tier | not allowed | |

## Black Tier

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| black-grant | an operator with the tier permission | they grant Black with a reason and no end date | the member holds Black until it is revoked | smoke |
| black-end-date | an invitation ending 2026/12/31 | the date passes | the member stops holding Black that instant; the history records it at the next evaluation | |
| black-revoked | a member holding Black by invitation, Silver by earning | the invitation is revoked | Silver | |
| black-one-live | a member with a live Black invitation | an operator grants Black again | the member never holds two live invitations to Black | |
| black-gold-survives | a member who earned Gold while invited | the invitation ends | still Gold | |
| black-no-extension | an invited Gold member who earned 300 in the tier period | the period ends | Gold ends on its own date; the invitation extends nothing | |
| black-refused | an operator | they grant a tier the programme does not have, or Silver | refused; nothing is recorded | |
| black-listed | three live invitations | an operator lists invitations | each shows its member, tier, reason and end date | |
