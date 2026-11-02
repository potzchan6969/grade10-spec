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

Counts and waiting gauges for membership and delivery. The ledger stays on
[Site Records](/p/grade10-site/analytics/site-records); who did what stays on
[Mixpanel Events](/p/grade10-site/analytics/mixpanel-events).

| Signal               | Answers                                                                                                                     | Split by                            |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Till identifications | Identifications and refusals at the till                                                                                    | Shop · outcome · how found · wallet |
| Wallet passes        | Passes issued and ended, and passes still waiting on a refresh or expiry                                                    | Wallet                              |
| Tier moves           | Members who changed tier, kept or lost one at review, and reviews that could not finish                                     | Outcome · cause                     |
| Points movement      | Points earned, redeemed, expired, never shown on the balance, and claw-backs that could not reclaim spent or expired points | Tier · source · cause               |
| Campaign grants      | Invitation or campaign points granted or refused                                                                            | Kind · outcome                      |
| Earning delivery     | Money events that reached the programme or did not, and events still waiting with their age                                 | Outcome · kind                      |
| Reward fulfilment    | Rewards handed to a vendor, failed, parked, voided, or still owed, and how old the oldest owed is                           | Outcome                             |
| Mixpanel delivery    | Backend events and profile writes submitted or refused, records waiting or held, and the oldest waiting age                 | Product · kind                      |

Workers across the store, auction, vault, appointments, and shared
services also count traffic, refusals, and work waiting on money paths
and notices. Those feed operator boards in Datadog; they are not product
funnels.

:::detail{title="Code map" for="engineer"}
**Emitters** — `ddCount`, `ddGauge`, and `ddDistribution` from `@grade10/utils/metrics`.
**Naming and tags** — `docs/conventions/datadog-metrics.md` in grade10.
**Monitors** — `docs/operations.md` in grade10.
:::
