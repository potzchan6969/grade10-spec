---
title: Datadog Counters
spec: grade10-site/analytics/analytics
order: 2
---

How often something happened, and how much work is still waiting — never
who. Read in Datadog. Domain signals that use them sit on
[Analytics](/p/grade10-site/analytics). A lost count is gone;
[Product Analytics · Delivery](/platform/tracking#delivery).

## Inventory

| Counter              | Answers                                                                                           | Split by                            |
| -------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Till identifications | Identifications and refusals at the till                                                          | Shop · outcome · how found · wallet |
| Wallet passes        | Passes issued and ended                                                                           | Wallet                              |
| Tier reviews         | Members who kept or lost a tier at review, and reviews that could not finish                      | Outcome                             |
| Points movement      | Points earned, redeemed, expired, or never shown on the balance                                   | Tier · source                       |
| Earning delivery     | Money events that reached the programme or did not, and events still waiting with their age       | Outcome · kind                      |
| Reward fulfilment    | Rewards handed to a vendor, failed, parked, or still owed                                         | Outcome                             |
| Mixpanel outbox      | Backend records waiting to send, the oldest one's age, and how many Mixpanel refused and are held | Product · kind                      |

Workers across the store, auction, vault, appointments, and shared
services also count traffic, refusals, and work waiting on money paths
and notices. Those feed operator boards in Datadog; they are not product
funnels.

:::detail{title="Code map" for="engineer"}
- **Emitters** — `ddCount`, `ddGauge`, and `ddDistribution` from `@grade10/utils/metrics`
- **Naming and tags** — `docs/conventions/datadog-metrics.md` in grade10
- **Monitors** — `docs/operations.md` in grade10
:::
