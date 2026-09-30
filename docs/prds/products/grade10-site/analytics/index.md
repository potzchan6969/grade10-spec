---
title: Analytics
spec: grade10-site/analytics/analytics
icon: chart-bar
reviewed: 2026-09-30
---

What Grade10 measures, by domain, and where each number is read from.
The pipeline that carries events is [Product Analytics](/platform/tracking);
the engineering record is
[tracking architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/tracking.md).

| Page                                                           | What it holds                                                      |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| [Mixpanel Events](/p/grade10-site/analytics/mixpanel-events)   | Who did what in a session or funnel, and the user-profile snapshot |
| [Datadog Counters](/p/grade10-site/analytics/datadog-counters) | How often something happened, never who                            |
| [Site Records](/p/grade10-site/analytics/site-records)         | Money, liability, and durable outcomes in the site's own tables    |

A signal names one source. The same fact may appear in two places for
different jobs — Order Paid describes a paid moment; Orders hold revenue.

## Membership

| Signal                              | Definition                                                                         | Source                                                                                           | Owner       |
| ----------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------- |
| Repeat purchase rate                | Share of buyers with a second purchase within 90 days, members against non-members | [Mixpanel Events](/p/grade10-site/analytics/mixpanel-events) · Order Paid                        | Product     |
| Physical attribution                | Share of till sales that belong to a member                                        | [Mixpanel Events](/p/grade10-site/analytics/mixpanel-events) · Order Paid                        | Product     |
| Staff-assisted redemption           | Coupons used at the till per week                                                  | [Site Records](/p/grade10-site/analytics/site-records) · Redemptions and coupons                 | Product     |
| Tier progression                    | Members reaching Gold per month                                                    | [Site Records](/p/grade10-site/analytics/site-records) · Tier changes                            | Product     |
| Tier retention                      | Share of Gold members who earn the retention threshold inside their tier period    | [Site Records](/p/grade10-site/analytics/site-records) · Tier changes                            | Product     |
| Point redemption                    | Share of earned points spent before the balance lapses                             | [Site Records](/p/grade10-site/analytics/site-records) · Points ledger                           | Product     |
| Coupon usage                        | Share of issued coupons used before their own validity ends                        | [Site Records](/p/grade10-site/analytics/site-records) · Redemptions and coupons                 | Product     |
| Arriving by pass                    | Share of till identifications from a wallet pass, Google against Apple             | [Datadog Counters](/p/grade10-site/analytics/datadog-counters) · Till identifications            | Product     |
| Codes that never landed             | Till identifications refused because the code expired or was already used          | [Datadog Counters](/p/grade10-site/analytics/datadog-counters) · Till identifications            | Product     |
| Spend after an Apple identification | Apple identification followed by a spend from the card in the same visit           | [Mixpanel Events](/p/grade10-site/analytics/mixpanel-events) · Member Identified then Order Paid | Product     |
| Points outstanding                  | Unexpired points plus unused coupon money, as a liability                          | [Site Records](/p/grade10-site/analytics/site-records) · Points ledger and coupons               | Finance     |
| Earning delivery                    | Money events awaiting delivery to the programme, and their age                     | [Datadog Counters](/p/grade10-site/analytics/datadog-counters) · Earning delivery                | Engineering |

Order Paid carries member, the tier the spend was priced at, and the
points that order earned and spent.

Mixpanel records a reward bought with points, a member card saved to a
wallet, and a successful till identification.

At $1 a point the programme returns 10% / 12% / 17% of spend at Silver /
Gold / Black, so points outstanding decides whether prices and liability
stay sustainable — [Membership](/p/grade10-site/loyalty).

## Store

| Signal                    | Definition                                                                                 | Source                                                                                                      | Owner   |
| ------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | ------- |
| Row-led product views     | Share of front-door sessions that open a product from the merchandised row                 | [Mixpanel Events](/p/grade10-site/analytics/mixpanel-events) · Page Viewed then Product Viewed (Source Row) | Product |
| Identified paid orders | Share of Order Paid whose distinct_id is a user id, among orders that had a checkout email | [Mixpanel Events](/p/grade10-site/analytics/mixpanel-events) · Order Paid                                   | Product |

The storefront records page view, product view and source, add to cart,
cart open, and a checkout the worker started.

## Auction

| Signal                         | Definition                                                                    | Source                                                                                    | Owner                      |
| ------------------------------ | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------- |
| Completed-auction payment rate | Closed listings whose winner reaches paid, over closed listings with a winner | [Site Records](/p/grade10-site/analytics/site-records) · Auction listings                 | Product and finance        |
| Time to ship                   | Elapsed time from paid to shipment started                                    | [Site Records](/p/grade10-site/analytics/site-records) · Auction listings                 | Operations                 |
| Bid integrity incidents        | Accepted bids later found to conflict with the close                          | ❓ Nothing records an incident; Engineering confirms where one is filed                   | Engineering and operations |
| Bid conversion              | Share of Lot Viewed sessions that reach Bid Placed                            | [Mixpanel Events](/p/grade10-site/analytics/mixpanel-events) · Lot Viewed then Bid Placed | Product                    |

Mixpanel holds the collector funnel: lot view, card linked, bid, watch,
outbid, win, and invoice paid. Payment rate and time to ship stay on
[Site Records](/p/grade10-site/analytics/site-records).

## Vault

| Signal            | Definition                                          | Source                                                                              | Owner      |
| ----------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------- |
| Financed cases    | Cases that took a loan, per week                    | [Site Records](/p/grade10-site/analytics/site-records) · Vault ledger and positions | Product    |
| Redemption rate   | Share of loans repaid and the item returned         | [Site Records](/p/grade10-site/analytics/site-records) · Vault ledger and positions | Product    |
| Time to payout    | Days from submission to payout                      | [Site Records](/p/grade10-site/analytics/site-records) · Vault ledger and positions | Operations |
| Recording lag     | Days from a money row's value date to its recording | [Site Records](/p/grade10-site/analytics/site-records) · Vault ledger and positions | Finance    |
| Loans outstanding | What is owed at a date                              | [Site Records](/p/grade10-site/analytics/site-records) · Vault ledger and positions | Finance    |

Mixpanel holds financed-case conversion: submitted, visit booked, offer
made or answered, payout recorded, and identity bound. Financed cases and
loans outstanding stay on [Site Records](/p/grade10-site/analytics/site-records).

:::detail{title="Product decisions" for="pm"}
**Not in scope.** Mixpanel as the money or liability ledger. Operator
consoles. ZZZ storefront emit. A consent gate. Bid ticks, KYC payloads,
coupon codes, and pass serials.

**Measurement.** [Bid conversion](#auction) once auction is live;
[Identified paid orders](#store) once the store is live.

**Decisions.**

| Item                | Status  | Decision                                                                                                                            | Owner   |
| ------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Where Mixpanel sits | Decided | Who did what in a session. Records stay the ledger. Counters stay how-often.                                                        | Product |
| One Grade10 project | Decided | Store, auction, loyalty, and vault events share it so a lot view can join a bid. ZZZ gets its own project when it has a storefront. | Product |
| Consent             | ❓ Open | Whether a gate sits in front of the browser client. The library can already drop.                                                   | Legal   |
| Mixpanel erasure    | ❓ Open | Whether a deleted account must be deleted in Mixpanel. First-party data is the console checklist; Mixpanel is not on it.            | Legal   |
:::

:::detail{title="Test cases" for="qa"}
::cases{id="grade10-site/analytics/analytics"}
:::
