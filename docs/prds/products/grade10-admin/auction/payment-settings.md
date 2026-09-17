---
title: Payment settings
spec: grade10-admin/auction/payment-settings
order: 14
---

Payment Settings keeps the auction's buyer-premium minimums in one operator-owned
place. It is reached as the Payment settings tab under `/auction` and is
available to operators who can settle auction money.

- **Minimum charge** — one non-negative integer amount per supported currency, in minor units
- **Supported currencies** — USD, HKD, and JPY
- **Initial floors** — USD 0 minor units, HKD 0 minor units, and JPY 0 minor units
- **Audit** — each saved mapping is recorded with its operator and timestamp

::story{id="auction-admin-payment-settings--loaded" title="Payment settings loaded"}

::story{id="auction-admin-payment-settings--saved" title="Payment settings saved"}

::story{id="auction-admin-payment-settings--refused" title="Payment settings refused"}

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
