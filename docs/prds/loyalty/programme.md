# Grade10 loyalty programme

## Summary

Grade10 buyers get a membership that rewards them for spending: a point per
HKD 10, three tiers that earn at increasing rates, and a menu of items those
points buy. Silver is where everyone starts, Gold is earned at 500 tier
points and pays 1.2×, and Black pays 1.7× and is given, not earned.

A tier is a standing, not a possession: it is activated the moment a member
reaches it and holds for twelve months, after which the member re-qualifies or
falls back to Silver. Tier progress and the spendable balance are counted
separately, so redeeming never costs a member their tier. The balance itself
expires only after twelve months of silence, and a redemption is settled as a
coupon the member takes to checkout or the counter.

## Context

- Problem or opportunity: repeat purchase is the cheapest revenue Grade10 has,
  and nothing today gives a returning buyer a reason to come back rather than
  buy the same item elsewhere.
- Evidence and links: the owner's programme draft — three tiers, HKD 10 per
  point, 500 points to the second tier, twelve-month clocks, top tier by
  invitation with CEO approval and an annual cap — as revised into the dual-ledger
  model, twelve-month tier validity, and coupon settlement.
- Related: [`openspec/specs/grade10-store/loyalty/spec.md`](../../../openspec/specs/grade10-store/loyalty/spec.md),
  archived change `loyalty-earning-and-surfaces`, active change
  `revise-loyalty-programme-rules`.

## Goals

- Give a returning buyer a visible, growing reason to buy again.
- Let the business run promotions and reward individual members without a deploy.
- Keep what a purchase earns auditable and hard to tamper with.

## Non-goals

- Paid membership. Every tier is free; the top one is given.
- Earning outside Grade10 store and counter purchases, beyond operator-granted
  campaign points. Auction wins and credit top-ups are later-phase candidates
  and earn nothing today.
- Turning points into a payment method at checkout. Points buy from a menu, and
  the menu pays out in coupons.
- Redeeming against an auction. Points and coupons buy nothing there, in any
  phase.
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

1. A buyer completes a purchase online or at the counter and earns points at
   their tier's rate, on what they actually paid.
2. They open their membership and see two figures — what decides their tier and
   what they can spend — plus when their tier lapses and when their balance does.
3. Points accumulate; at the threshold their tier rises on the spot, and the
   better rate applies from their next purchase.
4. They spend points from the reward menu and receive a coupon, which they use
   at checkout or at the counter.
5. Inside the following twelve months they either earn the retention threshold
   again and keep the tier, or fall back to Silver when the period ends.

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
| Tier retention | Share of Gold members who earn the retention threshold inside their validity period | Product |
| Point redemption | Share of earned points redeemed before the balance expires | Product |
| Coupon usage | Share of issued coupons used before their own validity ends | Product |
| Points outstanding | Unexpired, unredeemed points, plus unused issued coupons, as a liability | Finance |
| Earning delivery | Money events awaiting delivery to the programme, and their age | Engineering |

## Decisions and open questions

| Item | Status | Decision, assumption, or question | Owner |
| --- | --- | --- | --- |
| Programme currency | Decided | The programme runs in HKD, and the store sells in HKD. The draft prices earning at HKD 10 per point and the programme keeps Hong Kong time; a store selling in another currency would be refused every purchase, so the two are pinned together and checked at startup | Product |
| Tier economics live in code | Decided | The earn rate, expiry window, tier ladder, validity periods and retention thresholds are deployed and reviewed, not edited by an operator. An operator who can rewrite what a purchase earns can mint money; the reward menu is the intended lever and is editable | Engineering |
| Second tier at 500 points | Decided | From the owner's draft. Roughly HKD 5,000 of spend at the entry rate | Owner |
| Gold earns 1.2×, Black 1.7× | Decided | The step to Gold is small enough to be worth chasing at 500 points; Black's is large because it is a gift, not a target. Both are integer percentages, so earning never computes on a float | Product |
| Silver, Gold, Black | Decided | Metal names read as status without implying a price, and leave room above and below if the ladder ever grows | Owner |
| A tier is valid for twelve months | Decided | Supersedes the earlier decision that a tier once earned is kept. A permanent tier pays 1.2× forever to a member who bought once and left, so the programme's most expensive members become the ones it no longer has. The rationale behind the old decision — that demoting a member for the passage of time makes the tier meaningless — is answered by measuring re-qualification on tier points earned in the period rather than on the balance, so spending points still never demotes anyone | Owner |
| Retention threshold | **Open** | The baseline is the same 500 that qualifies for the tier. The business needs to decide whether a lower figure, around 400, should re-qualify as a softer landing. It is deployed configuration, so the answer changes a value, not the model — but it changes the size of the first downgrade cohort, so it is wanted before launch | Owner |
| Upgrade is immediate, the higher rate is not | Decided | A member is promoted the instant they cross the threshold, including on their first purchase, because the status is the reward. The rate applies from the next purchase, so one large purchase cannot claim a rate it had not reached when it was made | Product |
| Tier points and redeemable points are counted separately | Decided | Under a single balance, redeeming would reduce tier progress — the programme would punish the exact behaviour it exists to encourage. Two counts from one ledger keep redemption free of tier consequences | Product |
| Points expire on inactivity, not per purchase | Decided | Supersedes the earlier twelve-month-from-earning expiry. Expiring a returning buyer's oldest points while they are actively buying is the wrong nudge; the liability worth shedding belongs to members who have gone quiet. Any earn or redemption resets the clock for the whole balance | Owner |
| Earning is priced on the after-discount, after-coupon value | Decided | Points earned on a coupon's face value would let a redemption earn back part of what it spent, compounding into an earn-on-redeemed-value loop | Product |
| Order-level discounts are apportioned by line | Decided, assumption | The brief did not say how a whole-order discount splits between earning and non-earning lines. Splitting it in proportion to each line's pre-discount amount is the only rule that cannot be gamed by attributing the discount to shipping. Flagged for the owner to confirm rather than left silent | Product |
| Gift cards and store credit are excluded as a top-up, not as a tender | Decided, assumption | The brief excludes gift cards from earning and parks credit top-ups. Read as excluding the purchase of the card or the top-up, not the qualifying goods later bought with it — otherwise a member paying by gift card earns nothing at all, and the exclusion becomes a penalty rather than a double-earn guard | Product |
| Phase 1 earns online and at the counter | Decided | Shopify handles the online store; Wave Commerce POS handles the counter and syncs to Shopify. Both earn and both redeem | Owner |
| Auctions and credit top-ups | Deferred | Phase 2 candidates for earning only. Neither earns today, and auctions never accept points or coupons in any phase | Owner |
| A redemption is settled as a coupon | Decided | Supersedes the open question of what a redemption gives the member. Every reward, a discount or a physical item, is issued as a discount code, so one settlement path covers the whole menu and the counter needs no second mechanism | Product |
| Members cannot reverse a redemption; operators can | Decided | The conversion to a coupon is one way, so no member surface offers points back and no coupon converts back into points. An operator can still reverse one on the record, which voids the coupon — a support remedy for a mistake, not a member-facing option, and it is refused once the member's balance has already expired | Product |
| Coupon validity is set per reward | Decided | A coupon's life is a property of what it buys, not of the balance it came from, so the menu carries it per item and a redemption remembers the validity it was issued with | Product |
| Exchange rate | **Open** | Still undecided, and now the binding one: it sets the value of every item on the reward menu and therefore the programme's whole economics. Until it is set the menu cannot be priced, the programme cannot open redemption, and points outstanding cannot be reported as a liability | Finance |
| The counter identifies a member by account email | Decided | The email on the Grade10 account is the in-store member ID, resolved through the identity system to the account identity. The programme records the identity and never the email, so the identity boundary is unchanged. An unrecognised email never blocks a sale | Owner |
| The loyalty engine is in-house | Decided | Built on Grade10 auth/CRM. Shopify, the POS and Stripe are channels; none of them is the source of truth for a balance, a tier or a coupon | Engineering |
| Black's full rules are parked | Open | Invitation-only, 1.7×, CEO approval and an annual cap come from the draft; the programme enforces neither the cap nor the approval, and the rest of Black's rules are deliberately unwritten. Today any operator holding the invitation permission can grant without limit, recorded but unconstrained | Owner |
| Campaign points count toward tier | Decided | The draft counts bonus points toward progression, so an operator's campaign grant does, and it counts toward retention as well as toward the next tier. A correction to fix a mistake does not — otherwise fixing an error promotes someone | Product |
| ZZZ has no programme | Decided | The second brand's loyalty product is retired rather than kept as an unused placeholder | Owner |

## Rollout and risks

- Earning is delivered at least once and retried, so a member who buys during an
  outage still earns. The risk of the alternative is silent, uncorrectable point
  loss for real purchases.
- The first downgrade cohort lands twelve months after this ships, all at once,
  because every existing member's tier is activated on the deploy date rather
  than backdated. That is deliberate — backdating would demote members on day
  one under a rule that did not exist when they earned the tier — but it means
  the retention threshold must be settled well before that anniversary, and the
  cohort should be sized and warned before it lands.
- Activity-based expiry makes the outstanding balance stickier than per-purchase
  expiry did: a member who buys once a year never loses a point. The liability
  grows faster and sheds only from members who have genuinely gone quiet.
- Points outstanding are a real liability, and issued coupons are a second one.
  Without a recorded point value the programme can report neither — this is the
  open question most likely to matter first, and it now blocks opening the menu
  at all.
- The top tier earns at 1.7× with no cap on how many exist. Until the cap
  lands, the control is the operator log and who holds the invitation
  permission.
- A member's identity never enters the programme; operators read it from the
  identity system per request, and the counter resolves an email through it
  rather than storing one. A leak of the loyalty database exposes balances and
  identifiers, not people.
