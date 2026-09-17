---
title: Auction operations
summary: Drafting, publishing and closing out the lots collectors bid on.
spec: grade10-admin/auction/payment-settings
icon: gavel
---

The operator half of the auction. A listing is drafted here, filled with
catalogue copy and a gallery, priced and scheduled, and published — or called
off. When a lot closes with a winner, the sale is worked forward from here
until the card is in the buyer's hands.

The collector's half — browsing, bidding, watching — is
[Auction](/p/grade10-site/auction), and the two are held to separate specs
because they are held by separate people.

**Payment settings** — Under `/auction`, an authorized payment operator can
read and update the minimum buyer premium for each supported auction currency.
Values are stored in minor units and start at zero for USD, HKD, and JPY.
