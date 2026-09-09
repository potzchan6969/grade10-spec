---
title: Membership
icon: medal
---

One points programme across every Grade10 door. A member earns on qualifying
spend, their tier sets the rate they earn at, and points settle two ways: as a
coupon an order carries at either checkout, or straight off the bill. Grade10 runs in HKD on Hong Kong
time: one point per HKD 10 of qualifying goods, and one point pays HKD 1 back.

The engine is brand-neutral and names no vendor. Shopify is a channel — the
online checkout and the POS at the counter — and never the source of truth for
a balance, a tier or a code.

| Page | What it holds |
| --- | --- |
| [Points](/p/grade10-site/loyalty/points) | The earning rules, qualifying goods, refunds, expiry and operator grants |
| [Tiers](/p/grade10-site/loyalty/tiers) | Silver, Gold and Black — how a tier is reached, kept, lost and given |
| [Rewards](/p/grade10-site/loyalty/rewards) | What a reward is, the catalog, the shop, what a member holds, and how one is given |
| [Paying with Points](/p/grade10-site/loyalty/paying-with-points) | Points straight off a bill, online and at the till |
| [Coupons](/p/grade10-site/loyalty/coupons) | How a coupon reaches an order at each checkout, and what happens when one goes wrong |
| [Profile](/p/grade10-site/loyalty/profile) | Joining, the membership page, the member card and the member's own histories |
| [Shopify Integration](/p/grade10-site/loyalty/shopify-integration) | Customer pairing, the draft-order checkout, the POS extension, discounts and shipping |

Three audiences touch it. **Members** join at `/join`, carry a member card at
`/membership`, and read tier, balance, what is expiring and their own history
on one surface. **Staff** run a loyalty terminal inside Shopify POS at the
till. **Operators** run the programme from the admin console — finding
members, granting points, editing the reward catalog, granting and revoking
invitation tiers, unparking stuck fulfilments, flipping the till's switches and
reading what the programme still owes.

:::detail{title="Product decisions" for="pm"}
Repeat purchase is the cheapest revenue Grade10 has, and the physical store —
the majority of card sales — sells to anonymous guests. The programme gives a
returning buyer a visible, growing reason to buy again, makes the counter a
member channel, lets the business run promotions and reward individual
members without a deploy, and keeps what a purchase earns auditable. The
owner's draft it implements is
[the programme reference](/references/grade10-loyalty-program); the delivery
plan for the counter is [the Shopify membership and POS
notes](/references/shopify-membership-pos). The checkable rules are
[[grade10-site/loyalty/programme]] and the in-flight
`grade10-site/store/membership` capability.

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
nothing there, in any phase. SMS verification; the member card, its pass and
email carry identification at the counter, and the phone arm ships dark. Apple
Wallet, and NFC tap in any wallet. Tier-based discounts beyond the earn multiplier — no tier gets a
percentage off or free shipping. Cross-brand membership — ZZZ buyers are a
separate population with no programme.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Repeat purchase rate | Share of buyers with a second purchase within 90 days, members against non-members | Product |
| Physical attribution | Share of physical-store transactions attributed to a member | Product |
| Staff-assisted redemption | Staff-assisted redemptions completed per week | Product |
| Tier progression | Members reaching Gold per month | Product |
| Tier retention | Share of Gold members who earn the retention threshold inside their validity period | Product |
| Point redemption | Share of earned points redeemed before the balance expires | Product |
| Coupon usage | Share of issued codes used before their own validity ends | Product |
| Arriving by pass | Share of counter identifications made from a wallet pass | Product |
| Codes that never landed | Counter identifications that expired or replayed before staff scanned them | Product |
| Points outstanding | Unexpired, unredeemed points, plus the money out in unused codes, as a liability | Finance |
| Earning delivery | Money events awaiting delivery to the programme, and their age | Engineering |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Programme currency | Decided | The programme runs in HKD and the store sells in HKD. Earning is priced at HKD 10 per point and the programme keeps Hong Kong time; a store selling in another currency is refused every purchase, so the two are pinned together and checked at startup | Product |
| Tier economics live in code | Decided | The earn rate, rounding order, expiry window, tier ladder, validity periods and retention thresholds are deployed and reviewed, not edited by an operator. An operator who can rewrite what a purchase earns can mint money; the reward catalog is the intended lever and is editable | Engineering |
| Silver, Gold, Black | Decided | Metal names read as status without implying a price. Persisted ids are `silver`, `gold`, `black`; no record uses the pre-launch names | Owner |
| Gold at 500 points, earning 1.2×; Black at 1.7× | Decided | Roughly HKD 5,000 of spend at the entry rate reaches Gold. The step to Gold is small enough to be worth chasing; Black's is large because it is a gift, not a target. Both are integer percentages, so earning never computes on a float | Product |
| A tier is valid for twelve months | Decided | A permanent tier pays 1.2× forever to a member who bought once and left. Re-qualification is measured on the points earned in the period, so spending points never demotes anyone, and a retained period keeps its anniversary | Owner |
| Retention threshold | ❓ Decided at 500, under review | The deployed programme sets no separate retention figure, so keeping Gold falls back to the same 500 that reaches it. A softer figure around 400 is a new `retentionPoints` key on the Gold rung, not a changed value, and it changes the size of the first downgrade cohort | Owner |
| Upgrade is immediate, the higher rate is not | Decided | A member is promoted the instant they cross the threshold, including on their first purchase. The rate applies from the next purchase, because the multiplier is read before the purchase is priced | Product |
| Demotion resets tier progress | Decided | Earnings dated before a drop count toward nothing afterwards, so a demoted member is not re-promoted the next day out of the window that just lapsed | Owner |
| A claw-back demotion resets progress too | ❓ Open | The engine stamps the demotion on a claw-back drop as on a lapse, so a member refunded down from a higher rung reads zero retention progress while still holding the unrefunded points that landed them on the lower rung — and their period columns keep the higher rung's dates. Whether "losing a tier" covers the one demotion whose fuel the claw-back already netted out, and whether the lower rung gets a fresh period, is the owner's call | Owner |
| Re-qualifying early banks nothing until the next period | ❓ Open | Re-earning the retention threshold in month two extends the period from its own end, and the new period counts from zero at that end — so earnings for the rest of the year count toward neither retention nor the next rung. The requirement says so; whether that is the intended nudge is unrecorded | Owner |
| One balance, with tier progress summed beside it | Decided | Both read from one append-only ledger: earning adds to the balance and counts toward progress, a redemption spends only the balance, and there is nothing to reconcile between them | Product |
| Points expire on inactivity, not per purchase | Decided | The whole balance lapses after twelve months with no purchase or redemption; each of those resets the clock. Each credit also keeps its own date, and counts while the later of the two is ahead — which is what lets a correction or a restored redemption live under a lapsed window | Owner |
| A campaign grant is not activity | Decided | A grant moves no date. The points it adds live out their own twelve months under whatever window the member has, so a dormant member is revived only by buying or redeeming | Owner |
| Earning is priced on the after-discount, after-coupon value | Decided | Points earned on a coupon's face value would let a redemption earn back part of what it spent | Product |
| Earning floors base points before the multiplier | Decided | HKD 139 at 1.2× earns 15, never 16. The floor's place is deployed configuration, and every earn records the base points and multiplier it was priced with | Owner |
| Order-level discounts are apportioned by line | Decided | A whole-order discount splits across every line in proportion to line value, so it cannot be attributed to the non-earning part of a basket | Product |
| Gift cards, top-ups and grading fees earn nothing | Decided | Excluded as products, by SKU prefix and by product type or tag, not as a tender. Shipping and tax never enter the basis at all | Product |
| Exchange rate | Decided | A point is worth HKD 1 when it settles. With earning at a point per HKD 10 the programme returns 10% at Silver, 12% at Gold and 17% at Black — the number that sets the liability Finance reports | Owner |
| How points settle | Decided | By what the reward is: a coupon an order carries at either checkout, or points straight off the bill. A physical reward is a gift coupon whose free line is the item, so it hands over the product rather than its value in money | Owner |
| A used coupon is never bought back | Decided | Used is used: cancelling or refunding the order that carried a coupon leaves it used and its points spent. An operator may reverse one the member still holds — the coupon is voided and the points come back on their own dates — and where that is refused, grants the reward again or grants points instead. No member surface offers a reversal | Owner |
| An artifact left to expire stays spent | Decided | An unused coupon that reaches its own end date returns nothing by itself. What members forfeit is counted as breakage where Finance can read it | Owner |
| Coupon validity is set per reward | Decided | A code's life is a property of what it buys, so the catalog carries it per item and a redemption remembers the validity it was issued with | Product |
| A claw-back re-evaluates the tier at once | Decided | Refunded spend is spend that never happened, so the tier it bought does not survive it | Owner |
| In-store identification | Decided | A dynamic single-use code on the member card, its typed short code, or the member's exact email. One scan or lookup authorizes the till for ten minutes with no confirmation on the member's phone; the member is notified on every act they did not present for. An unrecognised member never blocks a sale | Owner |
| The card in a phone wallet | Decided | Google Wallet. Its pass regenerates the barcode on the phone from a secret it already holds, so the code is current with no signal and a photograph of it is worthless within the minute — the card keeps the security it has and gains a lock screen | Product |
| A pass in Apple Wallet | Decided | Apple has no rotating code, so the pass carries one durable code Grade10 makes: it identifies on every visit with no signal, and a session opened from it reads the panel and can spend nothing. A member spending points opens the card on the site | Owner |
| Phone lookup at the till | ❓ Deferred | Grade10 asks for a mobile number at join and mirrors it to the Shopify customer, but the till's phone arm ships switched off until numbers are verified | Owner |
| Points at the online checkout are a merchant discount, not a code | Decided | Every online checkout is a Shopify draft order, and the points come off as its one order-level fixed discount, chosen against the priced basket. Nothing is held until the invoice is paid | Engineering |
| Points at the till are a cart discount, or a code | Decided | Which instrument the till uses is a per-shop switch: a fixed amount off the sale, or a customer-scoped single-use code. The code instrument is the default until the switch is flipped | Engineering |
| One Shopify customer per member | Decided | Paired server-side behind the account, keyed on an opaque member id in a unique customer metafield. Pairing never blocks sign-up; it converges on retry or parks where an operator can see it. Erasure removes the vendor record irreversibly | Engineering |
| Account deletion clears the membership | Decided | Balance, tier progress and coupons end immediately; the ledger record survives for audit | Owner |
| An operator can always remove a tier | Decided | A tier granted or reached in error is removable on the record, whatever its period says | Owner |
| The loyalty engine is in-house | Decided | Built on Grade10 auth. Shopify and the POS are channels; a money-off reward is a Coupon the programme holds and the store spends through its own port, so no vendor mints a code. The fulfiller port stays for a vendor-issued kind, and no deployment wires one | Engineering |
| Top tier by invitation | Decided | Black is given deliberately to a named member with a reason, is revocable, and is never reachable by spending | Owner |
| Annual cap and approval on the top tier | ❓ Open | The draft caps it annually and requires CEO approval. Neither is fixed, and the programme enforces neither. An invitation granted with no end date holds until revoked | Owner |
| Campaign points count toward tier | Decided | A campaign grant counts toward the next tier and toward retention. A correction does neither. Neither keeps the balance alive | Product |
| Physical reward catalog | ❓ Open | Which items and their point prices. Per-unit quantities stay off until the per-redemption and per-day bounds are chosen | Product |
| Welcome bonus | ❓ Open | The draft posts a welcome bonus at enrolment; the deployed programme grants none until the size is set | Owner |
| Public names for the two counts | ❓ Open | The membership page says "Points to spend" and "Points earned this year"; whether those are the launch names is undecided | Product |
| Tier removal sits on the tier grant | Decided | Taking back an earned tier is the same axis as granting or revoking an invitation (`loyalty:invite`), so an operator who may only move points cannot demote anyone | Engineering |
| Non-sale ledger rows name `internal` | Decided | A correction, an expiry and a campaign grant sold nothing, so they carry a third value in the closed channel set rather than the online store's — the counter's share finance reads is never overstated by rows no channel sold | Engineering |
| ZZZ has no programme | Decided | The second brand's loyalty product is retired rather than kept as an unused placeholder | Owner |

**Risks.** Earning is delivered at least once and retried, so a member who
buys during an outage still earns; the alternative is silent, uncorrectable
point loss for real purchases. At HKD 1 per point the programme returns 10%
of spend at the entry tier and 17% at the top — generous against retail
norms, and the single input that decides whether the catalog's prices and the
reported liability are sustainable. Tier validity is running, so members
lapse on their own schedule; the retention threshold has to be settled before
the earliest of those dates. Activity-based expiry makes the outstanding
balance stickier: a member who buys once a year never loses a point. The till
degrades to a guest sale rather than blocking one — an unidentifiable member,
a parked pairing, or an unreachable programme all end in a completed sale
attributable afterwards. Staff act for members with no confirmation on the
member's own device; the controls are the instant notification, the audit on
every till act, the session's ten-minute life, and the per-shop switches. The
top tier earns at 1.7× with no cap on how many exist and no forced end date;
until the cap lands, the control is the operator log and who holds the
invitation permission. A member's identity never enters the programme, so a
leak of the loyalty database exposes balances and identifiers, not people.
:::
