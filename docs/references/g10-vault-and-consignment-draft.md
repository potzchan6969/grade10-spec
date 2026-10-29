# G10 Vault and Consignment draft

The owner's draft PRD for a vault that pays collectors to keep cards in it and
a consignment that sells them, as of 2026-10-27, with the owner's answers to
the first gap review on the same day. The vault side is carried by
[Incentive](../prds/products/grade10-site/vault/incentive.md),
[Earnings Wallet](../prds/products/grade10-site/account/earnings-wallet.md) and
[Vault Withdrawal](../prds/products/grade10-site/vault/vault-withdrawal.md);
the consignment side by
[Consigning](../prds/products/grade10-site/consignment/consigning.md). Read this
as the shape the product starts from, not as its requirements. The draft
itself is still moving.

## Background

1. **The funnel** - storage is free; the incentive is an acquisition cost paid
   to win cards; revenue is consignment commission alone
2. **Phases**
   1. **A - Vault and incentive** - mid November 2026: deposit, authentication,
      custody moves, the price feed, the daily incentive into the balance, the
      owner's and the staff's dashboards; no cash-out yet
   2. **B - Consign and sell** - 6 December 2026: consigning from the vault,
      the agreement, the till and the auction, settlement, cash-out, KYC at the
      first cash-out or sale payout
   3. **C - Withdrawal** - not dated: taking a card back by appointment
3. **Places** - CWB is the shop and the main vault; KEC is a warehouse or a
   second shop, ❓ not confirmed; an event is a temporary place until the card
   moves; in transit is a status, not a place
4. **Owners** - a consignor who wants cards sold; an earner who wants cards to
   earn while held; a safekeeper who wants them kept

## The card

1. **States** - deposited, authenticated, in the vault and earning,
   consigned, sold, or withdrawn; ending a consignment, an unsold lot or a
   contract that runs out puts the card back in the vault
2. **Deposit** - staff pick the place, find or invite the owner, take each
   card with its condition or cert and front and back photos, optionally
   consign it, and the owner signs the vault terms and the custody receipt
3. **Authentication** - a card earns only once it passes; one that fails is
   returned and never earns

## The incentive

1. **Formula** - per card per day: the 30-day market price x the liquidity
   factor x the annual rate / 365. A HKD 10,000 card at factor 0.6 and 3% a
   year earns about HKD 0.49 a day
2. **Market price** - the median of SNKRDUNK sales over the last 30 days,
   outliers removed; at least 5 sales to earn. ❓ whether SNKRDUNK is the only
   source
3. **Liquidity factor** - ❓ draft: velocity x price stability between 0.2 and
   1; velocity is sales in 30 days over a target of about 20; a card below 0.2
   does not earn
4. **Rate** - 3% a year, config, changed by an admin and logged
5. **Which cards** - ❓ only selected products, grades or value ranges; caps per
   card and per account ❓
6. **Daily** - after midnight Hong Kong time, the previous day's amount per
   card, the price and factor fixed at the start of the day, fractions of a
   cent carried, one entry per card per day, a rerun never paying twice
7. **Stops** - ❓ when the card is marked sold, is received, or settles
8. **Pause** - staff stop a card or an account from earning

## The owner's answers, 2026-10-27

1. **Vault and finance** - two products on one vaulting base: finance is
   vaulting with a financing add-on. A case holds many cards, and each card
   carries its own incentive rate and its own financing term
2. **The clock** - per card, from the contract's effective start date. The
   incentive accrues from that day; during the first N days it is credited but
   cannot be cashed out, and becomes cashable when the N days end
3. **How it is credited** - two readings, both built and chosen by config:
   credited daily and locked until day N, or held and posted on day N
4. **Early withdrawal fee** - vault and consignment each have their own fee,
   config, and either may be 0. The vault's applies inside a separate Y-day
   period from the contract's effective start; it is paid online or at the
   shop's Shopify POS
5. **Consignment renewal** - ❓ a renewal is a newly signed version of the
   agreement linked to the one it renews, and a contract that runs out puts
   the card back in the vault on its own
6. **Two buyers, one card** - ❓ both rules built and chosen by config: the
   first hold wins and an online hold that has started payment is never taken
   back, or the till wins over an online checkout that has not paid
7. **Where a consigned card sells** - online, in the shop, or both
8. **KYC** - ❓ when it is asked for is still being discussed; the draft asks
   at the first cash-out, sale payout, withdrawal or a total vault value above
   a threshold

## Cash-out and settlement

1. **The balance** - for cashing out only, never spent at Grade10: the posted
   incentive plus released sale proceeds less cash-outs
2. **Cash-out** - ❓ at least HKD 500, once every 7 days, none while the owner
   owes money; by FPS or bank transfer to an account in the verified owner's
   name; Finance approves in batches
3. **Settlement** - 14 days after the buyer receives the card; the sale price
   less commission, never below 0; one statement and one commission invoice a
   period, a credit note for a refund after settlement; a deduction larger
   than the balance is a debt

## Open in the draft

| ID | Question | Options |
| --- | --- | --- |
| T1 | Is the draft liquidity factor the working model, and what sales target gives full velocity? | - |
| T2 | Which products, grades or value ranges earn? | - |
| T3 | The cap per card and per account a month | - |
| T4 | N, the days before the incentive is cashable | 30 · 60 |
| T5 | When the incentive stops on a sold card | marked sold · received · settled |
| T6 | The total vault value above which KYC is asked | HKD 50,000 · HKD 100,000 |
| T7 | The fee to end a consignment early | none · per card · only after the lot is prepared |
