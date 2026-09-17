---
title: Payment Settings
spec: grade10-admin/auction/payment-settings
audience: operator
order: 14
---

Payment Settings keeps the auction's buyer-premium minimums in one
operator-owned place, as the Payment settings tab under `/auction`.

## Values

| Rule | Value |
| --- | --- |
| Minimum charge | One non-negative whole amount per supported currency, in minor units |
| Currencies | **USD**, **HKD**, **JPY** |
| Initial floors | **0** in each |
| Who | Operators who can settle auction money; others neither read nor change the mapping |

- **Saved whole** — a save replaces the complete mapping at once and records
  the operator and the time
- **Where it is used** — the invoice's buyer's premium is 20% of the winning
  bid or this minimum, whichever is higher — [Winner
  Order](/p/grade10-site/auction/winner-order)

| Refused | What happens |
| --- | --- |
| A missing or unsupported currency | Nothing stored changes |
| A negative amount | Nothing stored changes |
| An amount that is not a whole number | Nothing stored changes |
| A read or a save without the settlement permission | Refused |

::story{id="auction-admin-payment-settings--loaded" title="Payment settings loaded"}

::story{id="auction-admin-payment-settings--saved" title="Payment settings saved"}

::story{id="auction-admin-payment-settings--refused" title="Payment settings refused"}

::cases{id="grade10-admin/auction/payment-settings"}

:::detail{title="Product decisions" for="pm"}
The settings belong under Auction because the minimums are used by auction
invoice premiums, while the permission is settlement-scoped because changing a
minimum changes the amount collected.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Finance operator | Reviews the auction premium minimums | Sees one value for USD, HKD, and JPY in minor units. |
| Finance operator | Updates a minimum | Saves a non-negative whole amount and sees the new value after reload. |
| Other operator | Opens Auction without settlement permission | Cannot read or change the payment settings. |

**Not in scope.** Currency conversion, adding currencies, per-listing floors,
buyer-premium rate editing, or changing Stripe account settings.
:::
