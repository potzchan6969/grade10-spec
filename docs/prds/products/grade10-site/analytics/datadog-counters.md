---
title: Datadog Counters
spec: grade10-site/analytics
order: 2
---

How often something happened, never who — read in Datadog. Domain signals
that use them sit on [Analytics](/p/grade10-site/analytics).

## Inventory

| Counter | Answers | Split by |
| --- | --- | --- |
| Till identifications | Identifications and refusals at the counter | Shop · outcome · how found · wallet |
| Wallet passes | Passes issued and ended | Wallet |
| Tier reviews | Members who kept or lost a tier at review | Outcome |
| Earning delivery | Money events that reached the programme, were refused, or could not | Outcome |

:::detail{title="Code map" for="engineer"}
- **Counters** — `ddCount` from `@grade10/utils/metrics`, read in Datadog
:::
