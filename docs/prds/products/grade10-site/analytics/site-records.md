---
title: Site Records
spec: grade10-site/analytics/analytics
order: 3
---

The site's own tables for money, liability, and outcomes. Domain signals
that read them sit on [Analytics](/p/grade10-site/analytics).

## Inventory

| Record | Answers | Domain |
| --- | --- | --- |
| Orders | Revenue, refunds, where a sale happened, which member | [Store](/p/grade10-site/store) |
| Points ledger | Points earned, spent, returned, expired, and held | [Membership](/p/grade10-site/loyalty/points) |
| Tier changes | Every move up or down, its cause, every review | [Membership](/p/grade10-site/loyalty/tiers) |
| Redemptions and coupons | What points bought, what each coupon did, where used | [Membership](/p/grade10-site/loyalty/coupons) |
| Auction listings | Who won, whether and how they paid, when shipped | [Auction](/p/grade10-site/auction) |
| Vault ledger and positions | Cases, loans, payouts, what is outstanding | [Vault](/p/grade10-site/vault) |

Site records are the ledger. [Mixpanel Events](/p/grade10-site/analytics/mixpanel-events)
describe a moment; they do not replace these tables.
