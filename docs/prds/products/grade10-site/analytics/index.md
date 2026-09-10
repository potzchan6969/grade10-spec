---
title: Analytics
icon: chart-bar
---

What Grade10 measures, by domain, and where each number is read from. A
signal is read from one of three sources: an event Mixpanel holds, a record
the site's own tables hold, or a counter the systems keep as they run.
Events reach Mixpanel through the site's own backend, never from the browser
directly — [Product Analytics](/platform/tracking) holds the pipeline, the
identity rules and how a duplicate is dropped.

## Membership

| Signal | Definition | Read from | Owner |
| --- | --- | --- | --- |
| Repeat purchase rate | Share of buyers with a second purchase within 90 days, members against non-members | Order Paid, by member — [Events](#events) | Product |
| Physical attribution | Share of till sales that belong to a member | Order Paid at the till, with a member against without — [Events](#events) | Product |
| Staff-assisted redemption | Coupons used at the till per week | Redemptions and coupons — [Records](#records) | Product |
| Tier progression | Members reaching Gold per month | Tier changes — [Records](#records) | Product |
| Tier retention | Share of Gold members who earn the retention threshold inside their tier period | Tier changes, at review — [Records](#records) | Product |
| Point redemption | Share of earned points spent before the balance lapses | Points ledger — [Records](#records) | Product |
| Coupon usage | Share of issued coupons used before their own validity ends | Redemptions and coupons — [Records](#records) | Product |
| Arriving by pass | Share of till identifications made from a wallet pass, split Google against Apple | ❓ Till identifications count outcomes, not how the member was found — [Counters](#counters) | Product |
| Codes that never landed | Till identifications refused because the code expired or was already used; a Google pass drives this to zero | Till identifications — [Counters](#counters) | Product |
| Spend after an Apple identification | Apple identifications followed by a spend from the card on the site in the same visit | ❓ Nothing joins a till identification to a later order; Product confirms whether this is measured | Product |
| Points outstanding | Unexpired, unspent points, plus the money out in unused coupons, as a liability | Points ledger and coupons — [Records](#records) | Finance |
| Earning delivery | Money events awaiting delivery to the programme, and their age | Earning delivery — [Counters](#counters) | Engineering |

At $1 a point the programme returns 10% of spend at Silver, 12% at Gold and
17% at Black, so points outstanding is the one number that decides whether
the catalog's prices and the reported liability are sustainable. A member
who buys once a year never loses a point, so the balance only grows —
[Membership](/p/grade10-site/loyalty).

## Store

| Signal | Definition | Read from | Owner |
| --- | --- | --- | --- |
| Row-led product views | Share of front-door sessions that open a product page from the merchandised row; the first delivery sets the baseline | Page Viewed, then Product Viewed in the same session — [Events](#events) | Product |

## Auction

| Signal | Definition | Read from | Owner |
| --- | --- | --- | --- |
| Completed-auction payment rate | Closed listings whose winner reaches paid state, divided by closed listings with a winner | Auction listings — [Records](#records) | Product and finance |
| Time to ship | Elapsed time from paid to shipment started, for listings that reach shipped | Auction listings — [Records](#records) | Operations |
| Bid integrity incidents | Accepted bid outcomes later found to conflict with the recorded close or highest valid bid | ❓ Nothing records an incident; Engineering confirms where one is filed | Engineering and operations |

## Vault

| Signal | Definition | Read from | Owner |
| --- | --- | --- | --- |
| Financed cases | Cases that took a loan, per week | Vault ledger and positions — [Records](#records) | Product |
| Redemption rate | Share of loans repaid and the item returned | Vault ledger and positions — [Records](#records) | Product |
| Time to payout | Days from submission to payout | Vault ledger and positions — [Records](#records) | Operations |
| Recording lag | Days from a money row's value date to its recording | Vault ledger and positions — [Records](#records) | Finance |
| Loans outstanding | What is owed at a date | Vault ledger and positions — [Records](#records) | Finance |

## Events

Every event the site knows, one row each. A row without a mark is sent
today.

| Event | Fires when | Carries | Sent by |
| --- | --- | --- | --- |
| Order Paid | A paid order lands, online or at the till, and when a shop's own sale is matched to the store | Order id · currency · online or till · the goods · the whole charge · item count | The store's backend, once per order however many times the shop reports it |
| Checkout Started | A collector opens the store's checkout | Order id · currency · the goods | ❓ Nothing yet; Product confirms the site sends it |
| Product Viewed | A collector opens a product page | Product · variant | ❓ Nothing yet; Product confirms the site sends it |
| Page Viewed | A collector opens a page | Page | ❓ Nothing yet; Product confirms the site sends it |

- **The goods and the charge apart** — Order Paid carries what the goods
  came to and what was charged as two numbers, because tax and shipping are
  not revenue
- **A member or a device** — a signed-in collector's events sit on their
  profile; an anonymous visit sits on the device; an ownerless paid order
  sits on the order alone, so the money is still counted
- **Once per order** — a replayed webhook or a reconcile pass reports the
  same paid order again and Mixpanel keeps one

## Loyalty Events

The programme sends nothing to Mixpanel. Every loyalty signal is read from
the records below until these are confirmed:

- ❓ **Points Earned** — a paid order credits points; would carry the points,
  the order and the tier rate; Product confirms
- ❓ **Reward Redeemed** — a member buys a reward with points; would carry
  the reward and its cost; Product confirms
- ❓ **Tier Changed** — a member moves up or down; would carry the tiers and
  the cause; Product confirms
- ❓ **Pass Added** — a member saves the card to a wallet; would carry which
  wallet; Product confirms

## Records

What the site's own tables answer without an event. A report reads them
directly.

| Record | Answers | Domain |
| --- | --- | --- |
| Orders | Revenue, refunds, where a sale happened, which member it belongs to | [Store](/p/grade10-site/store) |
| Points ledger | Points earned, spent, returned, expired, and what a member holds, dated | [Membership](/p/grade10-site/loyalty/points) |
| Tier changes | Every move up or down, its cause, and every review's outcome | [Membership](/p/grade10-site/loyalty/tiers) |
| Redemptions and coupons | What was bought with points, what each coupon did, and where it was used | [Membership](/p/grade10-site/loyalty/coupons) |
| Auction listings | Who won, whether and how they paid, when the lot shipped | [Auction](/p/grade10-site/auction) |
| Vault ledger and positions | Cases, loans, payouts and what is outstanding at a date | [Vault](/p/grade10-site/vault) |

## Counters

What the systems count as they run. They answer how often something
happened, never who it happened to, so a signal read from a counter is an
operations number.

| Counter | Answers | Split by |
| --- | --- | --- |
| Till identifications | How many members were identified at the counter, and how many attempts were refused: a code already used, a code expired, the till paused | Shop · outcome |
| Wallet passes | How many passes were issued and ended | Wallet |
| Tier reviews | How many members kept or lost a tier at each review | Outcome |
| Earning delivery | How many money events reached the programme, were refused, or could not reach it | Outcome |

- ❓ **How a member was found** — the till counts an identification by
  outcome, not by whether it came from a pass, a typed code, an email or the
  cart; Engineering confirms the split before a wallet signal can be read

:::detail{title="Code map" for="engineer"}
- **Event catalog** —
  `packages/grade10-store/backend/src/services/analytics/events.ts`, sent
  through `services/analytics/track.ts`
- **Counters** — `ddCount` from `@grade10/utils/metrics`, read in Datadog
- **Design record** —
  [tracking architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/tracking.md)
:::
