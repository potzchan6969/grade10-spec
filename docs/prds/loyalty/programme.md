# Grade10 loyalty programme

## Summary

Grade10 buyers get a membership that rewards them for spending: a point per
HKD 10, three tiers that earn at increasing rates, and a menu of items those
points buy. Platinum is where everyone starts, Diamond is earned at 500
qualifying points and pays 1.2×, and Black pays 1.7× and is given, not earned.

## Context

- Problem or opportunity: repeat purchase is the cheapest revenue Grade10 has,
  and nothing today gives a returning buyer a reason to come back rather than
  buy the same item elsewhere.
- Evidence and links: the owner's programme draft — three tiers, HKD 10 per
  point, 500 points to the second tier, twelve-month expiry, top tier by
  invitation with CEO approval and an annual cap.
- Related: [`openspec/specs/grade10-store/loyalty/spec.md`](../../../openspec/specs/grade10-store/loyalty/spec.md),
  change `loyalty-earning-and-surfaces`.

## Goals

- Give a returning buyer a visible, growing reason to buy again.
- Let the business run promotions and reward individual members without a deploy.
- Keep what a purchase earns auditable and hard to tamper with.

## Non-goals

- Paid membership. Every tier is free; the top one is given.
- Earning outside Grade10 purchases, beyond operator-granted campaign points.
- Turning points into a payment method at checkout. Points buy from a menu.
- Cross-brand membership. ZZZ buyers are a separate population with no programme.

## Users and jobs to be done

| User | Situation | Desired outcome |
| --- | --- | --- |
| Buyer | Has bought before, browsing again | Sees what they have accumulated and what it is nearly worth |
| Buyer | Deciding between Grade10 and elsewhere | Knows this purchase moves them toward a better rate |
| Support operator | A buyer disputes a balance | Can read the member's history and correct it, on the record |
| Marketing operator | Running a sign-up promotion | Can grant points that count toward tier, without a deploy |
| Owner | Deciding who gets the top tier | Grants it deliberately, to a named person, with a reason |

## Experience

### Primary flow

1. A buyer completes a purchase and earns points at their tier's rate.
2. They open their membership and see tier, balance, what expires soon, and how
   far they are from the next tier.
3. Points accumulate; at the threshold their tier rises and stays risen.
4. They spend points from the reward menu.

## Requirements

`openspec/specs/grade10-store/loyalty/spec.md`

## Consuming applications and integration

| Application | How it consumes this work | Compatibility consideration |
| --- | --- | --- |
| `grade10-store` backend | Records purchases and refunds against the programme | Must sell in the programme's currency |
| `grade10-loyalty` console | Operators run the programme from it | Identity shown only under the identity permission |
| `grade10-loyalty` membership surface | Members read and spend | — |

## Measurement

| Signal | Definition | Owner |
| --- | --- | --- |
| Repeat purchase rate | Share of buyers with a second purchase within 90 days, members against non-members | Product |
| Tier progression | Members reaching the second tier per month | Product |
| Point redemption | Share of earned points redeemed before expiry | Product |
| Points outstanding | Unexpired, unspent points, as a liability | Finance |
| Earning delivery | Money events awaiting delivery to the programme, and their age | Engineering |

## Decisions and open questions

| Item | Status | Decision, assumption, or question | Owner |
| --- | --- | --- | --- |
| Programme currency | Decided | The programme runs in HKD, and the store sells in HKD. The draft prices earning at HKD 10 per point and the programme keeps Hong Kong time; a store selling in another currency would be refused every purchase, so the two are pinned together and checked at startup | Product |
| Tier economics live in code | Decided | The earn rate, expiry window and tier ladder are deployed and reviewed, not edited by an operator. An operator who can rewrite what a purchase earns can mint money; the reward menu is the intended lever and is editable | Engineering |
| Second tier at 500 points | Decided | From the owner's draft. Roughly HKD 5,000 of spend at the entry rate | Owner |
| Diamond earns 1.2×, Black 1.7× | Decided | The step to Diamond is small enough to be worth chasing at 500 points; Black's is large because it is a gift, not a target. Both are integer percentages, so earning never computes on a float | Product |
| Platinum, Diamond, Black | Decided | Metal names read as status without implying a price, and leave room above and below if the ladder ever grows | Owner |
| Twelve-month expiry | Decided | From the owner's draft, applied from the date of the activity that earned the points | Owner |
| A tier once earned is kept | Decided | Expiring points do not demote a member. Demotion on expiry punishes a member for the passage of time and makes the tier meaningless as a status | Product |
| Top tier by invitation | Decided | Given deliberately to a named member with a reason, revocable, never reachable by spending | Owner |
| Annual cap and approval on the top tier | Open | The draft caps it annually and requires CEO approval. Neither number nor approver is fixed, and the programme enforces neither — today any operator holding the invitation permission can grant without limit, recorded but unconstrained | Owner |
| What a point is worth | Open | The draft says points are money. No monetary value is recorded against a point or a reward, so points outstanding cannot be reported as a liability | Finance |
| Campaign points count toward tier | Decided | The draft counts bonus points toward progression, so an operator's campaign grant does. A correction to fix a mistake does not — otherwise fixing an error promotes someone | Product |
| What a redemption gives the member | Open | Likely automatic store discounts online and something equivalent at the counter. Undecided, so a redemption today records an entitlement and an operator settles it | Product |
| ZZZ has no programme | Decided | The second brand's loyalty product is retired rather than kept as an unused placeholder | Owner |

## Rollout and risks

- Earning is delivered at least once and retried, so a member who buys during an
  outage still earns. The risk of the alternative is silent, uncorrectable point
  loss for real purchases.
- Points outstanding grow from launch and are a real liability. Without a
  recorded point value, the programme cannot report it — this is the open
  question most likely to matter first.
- The top tier earns at 1.7× with no cap on how many exist. Until the cap
  lands, the control is the operator log and who holds the invitation
  permission.
- A member's identity never enters the programme; operators read it from the
  identity system per request. A leak of the loyalty database exposes balances
  and identifiers, not people.
