---
title: Membership
icon: medal
---

One points programme across every Grade10 door. A member earns on qualifying
spend, their tier sets the rate they earn at, and points settle two ways: as a
coupon an order carries at either checkout, or straight off the bill. Grade10
runs in HKD on Hong Kong time: one point per HKD 10 of qualifying goods, and
one point pays HKD 1 back.

Repeat purchase is the cheapest revenue Grade10 has, and the physical store —
the majority of card sales — sells to anonymous guests. The programme gives a
returning buyer a visible, growing reason to buy again, makes the counter a
member channel, lets the business run promotions and reward individual members
without a deploy, and keeps what a purchase earns auditable.

The engine is brand-neutral and names no vendor. Shopify is a channel — the
online checkout and the POS at the counter — and never the source of truth for
a balance, a tier or a code. ZZZ has no programme.

| Page | What it holds |
| --- | --- |
| [Points](/p/grade10-site/loyalty/points) | The earning rules, qualifying goods, refunds, expiry and operator grants |
| [Tiers](/p/grade10-site/loyalty/tiers) | Silver, Gold and Black — how a tier is reached, kept, lost and given |
| [Rewards](/p/grade10-site/loyalty/rewards) | What a reward is, the catalog, the shop, what a member holds, and how one is given |
| [Paying with Points](/p/grade10-site/loyalty/paying-with-points) | Points straight off a bill, online and at the till |
| [Coupons](/p/grade10-site/loyalty/coupons) | How a coupon reaches an order at each checkout, and what happens when one goes wrong |
| [Profile](/p/grade10-site/loyalty/profile) | Membership with the account, the membership page, the member card and the member's own histories |
| [Shopify Integration](/p/grade10-site/loyalty/shopify-integration) | Customer pairing, the draft-order checkout, the POS extension, discounts and shipping |
| [Member Card in a Wallet](/p/grade10-site/loyalty/wallet-member-card) | The card in Google Wallet and Apple Wallet — what each code can do, and how a pass stays current |

Three audiences touch it. **Members** get the membership with their account,
carry a member card at `/membership`, and read tier, balance, what is expiring,
what the next purchase moves them toward, and their own history on one
surface. **Staff** run a loyalty terminal inside Shopify POS at the till, and
identify a member in seconds to read, spend or hand over on their behalf.
**Operators** run the programme from the admin console: finding a member and
correcting a balance on the record, granting campaign points without a deploy,
and giving the top tier to a named person with a reason.

## Not in Scope

- **Paid membership** — every tier is free, and the top one is given
- **Earning outside the store and the counter** — beyond operator-granted
  campaign points; auction wins and credit top-ups are later-phase candidates
  and earn nothing today
- **Redeeming against an auction** — points and coupons buy nothing there, in
  any phase
- **SMS verification**, and NFC tap in any wallet
- **Tier-based discounts beyond the earn multiplier** — no tier gets a
  percentage off or free shipping
- **Cross-brand membership** — ZZZ buyers are a separate population with no
  programme

## References

- [Analytics](/p/grade10-site/analytics#membership) — what the programme is
  measured by, and where each number is read from
- [The programme reference](/references/grade10-loyalty-program) — the owner's
  draft the programme implements
- [The Shopify membership and POS notes](/references/shopify-membership-pos) —
  the delivery plan for the counter
- [[grade10-site/loyalty/programme]] — the checkable rules, with the till's in
  the in-flight `grade10-site/store/membership` capability
