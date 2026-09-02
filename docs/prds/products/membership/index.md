---
title: Membership
---

One points programme across every Grade10 door. A member earns on qualifying
spend, their tier sets the rate they earn at, and points buy things off a
reward menu — online and at the counter of the physical shop. Grade10 runs in
HKD on Hong Kong time: one point per HKD 10 of qualifying spend, and one point
pays HKD 1 back.

Three audiences touch it. **Members** join at `/join`, carry a member card in
the app, and see tier, balance, what is expiring and their own history on one
surface. **Staff** run a loyalty terminal inside Shopify POS at the till.
**Operators** run the programme from the admin console — finding members,
granting points, editing the reward menu, granting and revoking invitation
tiers, unparking stuck fulfilments and reading what the programme still owes.

:::detail{title="Product decisions" for="pm"}
Repeat purchase is the cheapest revenue Grade10 has, and the physical store —
the majority of card sales — sells to anonymous guests. The programme gives a
returning buyer a visible, growing reason to buy again, makes the counter a
member channel, lets the business run promotions and reward individual
members without a deploy, and keeps what a purchase earns auditable. The
owner's draft it implements is
[the programme reference](/references/grade10-loyalty-program); the
checkable rules are [[grade10-store/loyalty]] and the in-store capability.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Buyer | Has bought before, browsing again | Sees what they have accumulated and what it is nearly worth |
| Buyer | Deciding between Grade10 and elsewhere | Knows this purchase moves them toward a better rate |
| Buyer | At the counter | Registers, earns, spends points, and collects rewards without their own phone doing more than showing a code |
| Store staff | Member at the counter | Identifies them in seconds and reads, spends, or hands over on their behalf |
| Support operator | A buyer disputes a balance | Can read the member's history and correct it, on the record |
| Marketing operator | Running a sign-up promotion | Can grant points that count toward tier, without a deploy |
| Owner | Deciding who gets the top tier | Grants it deliberately, to a named person, with a reason |

**Not in scope.** Paid membership — every tier is free, the top one is given.
Earning outside Grade10 store and counter purchases, beyond operator-granted
campaign points; auction wins and credit top-ups are later-phase candidates
and earn nothing today. Redeeming against an auction — points and coupons buy
nothing there, in any phase. Phone-number identification, SMS, and wallet
passes at the counter; the member card and email carry identification.
Cross-brand membership — ZZZ buyers are a separate population with no
programme.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Repeat purchase rate | Share of buyers with a second purchase within 90 days, members against non-members | Product |
| Physical attribution | Share of physical-store transactions attributed to a member | Product |
| Staff-assisted redemption | Staff-assisted redemptions completed per week | Product |
| Tier progression | Members reaching the second tier per month | Product |
| Tier retention | Share of Gold members who earn the retention threshold inside their validity period | Product |
| Point redemption | Share of earned points redeemed before the balance expires | Product |
| Coupon usage | Share of issued coupons used before their own validity ends | Product |
| Points outstanding | Unexpired, unredeemed points at HKD 1 each, plus unused issued coupons, as a liability | Finance |
| Earning delivery | Money events awaiting delivery to the programme, and their age | Engineering |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Programme currency | Decided | The programme runs in HKD, and the store sells in HKD. Earning is priced at HKD 10 per point and the programme keeps Hong Kong time; a store selling in another currency would be refused every purchase, so the two are pinned together and checked at startup | Product |
| Tier economics live in code | Decided | The earn rate, rounding order, expiry window, tier ladder, validity periods and retention thresholds are deployed and reviewed, not edited by an operator. An operator who can rewrite what a purchase earns can mint money; the reward menu is the intended lever and is editable | Engineering |
| Second tier at 500 points | Decided | From the owner's draft. Roughly HKD 5,000 of spend at the entry rate | Owner |
| Gold earns 1.2×, Black 1.7× | Decided | The step to Gold is small enough to be worth chasing at 500 points; Black's is large because it is a gift, not a target. Both are integer percentages, so earning never computes on a float | Product |
| Silver, Gold, Black | Decided | Metal names read as status without implying a price, and Silver and Gold sit in the order a buyer already expects. Display names only — multipliers and thresholds are untouched | Owner |
| A tier is valid for twelve months | Decided | A permanent tier pays 1.2× forever to a member who bought once and left, so the programme's most expensive members become the ones it no longer has. Re-qualification is measured on tier points earned in the period rather than on the balance — spending points never demotes anyone | Owner |
| Retention threshold | ❓ Decided at 500, under review | The baseline is the same 500 that qualifies for the tier. Whether a lower figure, around 400, should re-qualify as a softer landing is deployed configuration — a value, not the model — but it changes the size of the first downgrade cohort, so it is wanted before the earliest lapse | Owner |
| Upgrade is immediate, the higher rate is not | Decided | A member is promoted the instant they cross the threshold, including on their first purchase, because the status is the reward. The rate applies from the next purchase, so one large purchase cannot claim a rate it had not reached when it was made | Product |
| Demotion resets tier progress | Decided | Earnings before a drop count toward nothing afterwards. Otherwise a demoted member is re-promoted the next day out of the same rolling window that just lapsed, and the tier flip-flops | Owner |
| Tier points and redeemable points are counted separately | Decided | Under a single count, redeeming would reduce tier progress — the programme would punish the exact behaviour it exists to encourage. Two counts derived from one append-only ledger keep redemption free of tier consequences, with nothing to reconcile between them | Product |
| Points expire on inactivity, not per purchase | Decided | Expiring a returning buyer's oldest points while they are actively buying is the wrong nudge; the liability worth shedding belongs to members who have gone quiet. Any earn or redemption resets the clock for the whole balance | Owner |
| Earning is priced on the after-discount, after-coupon value | Decided | Points earned on a coupon's face value would let a redemption earn back part of what it spent, compounding into an earn-on-redeemed-value loop | Product |
| Earning floors base points before the multiplier | Decided | HKD 139 at 1.2× earns 15, never 16. The floor's place is deployed configuration, and every earn records the base points and multiplier it was priced with | Owner |
| Order-level discounts are apportioned by line | Decided, assumption | The draft does not say how a whole-order discount splits between earning and non-earning lines. Splitting it in proportion to each line's pre-discount amount is the only rule that cannot be gamed by attributing the discount to shipping. Flagged for the owner to confirm | Product |
| Gift cards and store credit are excluded as a top-up, not as a tender | Decided, assumption | The draft excludes gift cards from earning and parks credit top-ups. Read as excluding the purchase of the card or the top-up, not the goods later bought with it — otherwise a member paying by gift card earns nothing at all, and the exclusion becomes a penalty rather than a double-earn guard | Product |
| Phase 1 earns online and at the counter | Decided | Shopify handles the online store and, through a POS extension, the counter. Both earn and both redeem | Owner |
| Auctions and credit top-ups | ❓ Deferred | Phase 2 candidates for earning only. Neither earns today, and auctions never accept points or coupons in any phase | Owner |
| Exchange rate | Decided | A point is worth HKD 1 when it pays at checkout. With earning at a point per HKD 10, the programme returns 10% at Silver, 12% at Gold and 17% at Black — high for retail, and the number that sets the liability Finance reports | Owner |
| What a redemption gives the member | Decided | It settles by what the reward is: points paid against the bill at checkout or at the till, a single-use money-off code both checkouts accept, or a physical item collected at the counter. A physical reward is never dressed up as a discount code | Owner |
| Members cannot reverse a redemption; operators can | Decided | Redemption is one way, so no member surface offers points back. An operator can reverse one on the record, which voids the coupon — a support remedy, not a member-facing option. A used artifact is never reversed, and a reversal after the member's balance has already expired voids the artifact but returns no points | Product |
| An artifact left to expire stays spent | Decided | An unused code that reaches its own end date returns nothing by itself; points come back only through an operator's recorded cancellation. The alternative silently re-credits every forgotten coupon, and the liability never settles | Owner |
| Coupon validity is set per reward | Decided | A coupon's life is a property of what it buys, not of the balance it came from, so the menu carries it per item and a redemption remembers the validity it was issued with | Product |
| One-way preferences live in one policy block | Decided | Every "does a later event undo an earlier one" choice — the refund's effect on a reached tier, reclaiming an expired redemption, the shortfall rule when an order is re-attributed — is a named switch in one deployed policy block. Unsettled ones default to "what happened stands" | Owner |
| A claw-back re-evaluates the tier at once | Decided | Refunded spend is spend that never happened, so the tier it bought does not survive it | Owner |
| In-store identification | Decided | A dynamic single-use code on the member card, or the member's exact email; one scan or lookup authorizes the till for the visit, with no confirmation on the member's phone. The member is notified on every staff-assisted act. The programme records the identity and never the email, and an unrecognised member never blocks a sale | Owner |
| One Shopify customer per member | Decided | Pairing is server-side and never blocks sign-up: it either converges or parks visibly for an operator. Erasure removes the vendor record irreversibly | Engineering |
| Account deletion clears the membership | Decided | Balance, tier progress, coupons and pending collections end immediately; the ledger record survives for audit. Waiting out a window would leave spendable value attached to an account the member asked to be rid of | Owner |
| An operator can always remove a tier | Decided | A tier granted or reached in error is removable on the record, whatever its term says. Without it a mistaken grant pays a higher rate for twelve months with no remedy | Owner |
| The loyalty engine is in-house | Decided | Built on Grade10 auth/CRM. Shopify, the POS and Stripe are channels; none of them is the source of truth for a balance, a tier or a coupon | Engineering |
| Top tier by invitation | Decided | Black is given deliberately to a named member with a reason, is revocable, and is never reachable by spending | Owner |
| Annual cap and approval on the top tier | ❓ Open | The draft caps it annually and requires CEO approval. Neither the number nor the approver is fixed, and the programme enforces neither — any operator holding the invitation permission can grant without limit, recorded but unconstrained | Owner |
| Campaign points count toward tier | Decided | A campaign grant counts toward the next tier and toward retention, and keeps the balance alive. A correction to fix a mistake does neither — otherwise fixing an error promotes someone | Product |
| Physical reward menu | ❓ Open | Which items, their point prices, the collection window's length, and how counter stock decrements | Product |
| Public names for the two counts | ❓ Open | What tier points and redeemable points are called to members; "Status points" is the working candidate | Product |
| ZZZ has no programme | Decided | The second brand's loyalty product is retired rather than kept as an unused placeholder | Owner |

**Risks.** Earning is delivered at least once and retried, so a member who
buys during an outage still earns; the alternative is silent, uncorrectable
point loss for real purchases. At HKD 1 per point the programme returns 10%
of spend at the entry tier and 17% at the top — generous against retail
norms, and the single input that decides whether the menu's prices and the
reported liability are sustainable. Tier validity is already running, so
members lapse on their own schedule; the retention threshold has to be
settled before the earliest of those dates, and the members approaching one
sized and warned. Activity-based expiry makes the outstanding balance
stickier: a member who buys once a year never loses a point. The till
degrades to a guest sale rather than blocking one — an unidentifiable member,
a paused pairing, or an unreachable programme all end in a completed sale
attributable afterwards. Staff act for members with no confirmation on the
member's own device; the controls are the instant notification, the audit on
every till act, the session's short life, and the per-shop kill switches.
The top tier earns at 1.7× with no cap on how many exist; until the cap
lands, the control is the operator log and who holds the invitation
permission. A member's identity never enters the programme, so a leak of the
loyalty database exposes balances and identifiers, not people.
:::
