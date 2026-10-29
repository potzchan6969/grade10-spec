## Goals

- A consignor hands collectables in at the counter or an event in one
  visit, and is paid the incentive there and then
- A consigned item goes on sale in the channel recorded at intake - the
  store or the auction - and the consignor watches it and is paid on a
  known day
- Staff run the whole consignment - intake, terms, signing, listing, sale,
  payout, return - from one queue and one consignment page
- Every figure - commission, the incentive, fees, the term, the windows -
  is a setting an admin changes, pinned to the consignment when its
  agreement is prepared

## Non-Goals

- A grading service for consignments; intake takes graded collectables at
  launch
- A request page a consignor opens themselves online; only staff open a
  consignment
- Payouts by card or into a wallet, and consignments in a currency other
  than the brand's - the PRD's own non-goals
- A consignor setting a price below the floor themselves
- The consignor-facing screens' design - this change records the read the
  service owes; the screens are the designers'

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What the "5% incentive" means | The owner is paid an incentive on the item's estimated value - the card's value from its last-sold average - instantly when the consignment is taken - decided by the round; the figure itself is intended at **5%** and unset - see Q9 | A fee charged at intake, or an incentive folded into the sale fee; the brief's own line settles it Superseded by Q22. |
| Q2 | What "store stock or on an optional basis" means at intake | Staff record the channel - the store or the auction - for the consignment when it is taken - decided by the round | Reading it as house purchase vs consignment; every intake here is a consignment Superseded by Q22. |
| Q3 | Whether auction-bound items show before listing | A consigned item appears on the consignor's signed-in page once it is checked in, before its lot is listed - decided by the round | Holding the item invisible until the lot lists |
| Q4 | What paper a sale produces | A sale issues the consignor a settlement statement and a commission invoice, with the contact details for payment - decided by the round | The payout statement alone Superseded by Q22. |
| Q5 | Who may consign | An individual or a company; a company registers its own facts, its registered office address among them - decided by the round | Individual collectors only |
| Q6 | Whether the consignor's Grade10 account matters | Intake records whether the consignor has one and links it - decided by the round | Consignments identified by email alone, with nothing to sign in to |
| Q7 | When items reach the catalogue | Each item is logged in Shopify when the consignment form is completed - decided by the round | Logging at signing or at listing |
| Q8 | Whether ungraded items are taken | ❓ Product - recommended: graded collectables only at launch, there being no grading service on day 1. Decided by agent: built as recommended - an item is registered only with its grade and cert - until the owner settles it | Ungraded items taken too; the brief says "most likely" |
| Q9 | The exact consignment figures | ❓ Product - recommended: a consignment fee of **10–12%** of the sale price at sale, and the incentive at **5%** of the estimated value, as the brief states | A single figure; the fee schedule is banded per channel Superseded by Q22. |
| Q10 | The incentive against the payout | ❓ Product - recommended: not set against it - the incentive is paid at consignment and the payout is the sale less commission and fees. Decided by agent: built as recommended until the owner settles it | Netting the paid incentive out of the payout Superseded by Q22. |
| Q11 | What an item passes before it is published | An item passes intake inspection and photography before it is published - decided by the round | Publishing straight from the completed consignment form |
| Q12 | What an item shows while it sells | Each item names its channel - the shop, the online store or the auction - its agreed list price, the commission rate and the consignor's estimated net payout, and counts down the days left on its term - decided by the round | Naming the consignment alone and asking the shop for the rest |
| Q13 | The term's figure | ❓ Product - the running default is **90** days; the brief asks **30** or **60**; the figure is unset | Treating the default as decided; it predates this change but the owner reopened it Superseded by Q22. |
| Q14 | What an unsold item does at term's end | ❓ Product - the proposed actions a consignor may take: reduce the listed price, save it to the vault for long-term custody, or book an appointment to collect it at the shop | The PRD's earlier choice list, which this question reopens Superseded by Q22. |
| Q15 | The payout flow | ❓ Product - proposed: a bank transfer directly, a payout the consignor requests and a bank transfer follows, or credits or points | Settling on the recorded bank transfer alone; it stands meanwhile Superseded by Q22. |
| Q16 | Where the consignor's pages sit | ❓ Designer - proposed: the signed-in area splits into three sections by what the items mean - Submissions for items in service, Vault Portfolio for held assets, Consignments and Sales for items entrusted to sell; the consignor's pages live under the last | Folding consignor pages into the vault portfolio or the account page Superseded by Q22. |
| Q17 | What "records whether the consignor has a Grade10 account and links it" means at the counter | Decided by agent: every person consigns under an account found in the directory; someone with none is added in People first, because the item register names an account as an item's owner | A consignment with no account, which the register cannot own |
| Q18 | When the incentive is owed, and who records it | Decided by agent: owed from the agreement's seal, listed on the payout due list that day, and recorded once under `consignment:payout` with the bank's or the till's reference | Recording it at intake before anything is signed; a till line staff take, which puts money in staff hands Superseded by Q22. |
| Q19 | Which items the completed form logs in Shopify | Decided by agent: each received store item, as a draft product at the agreement's seal, published on listing; an auction item becomes a draft lot only when it is listed | Logging auction items as store products too, which puts one item in two channels |
| Q20 | How an event is recorded | Decided by agent: the origin `event` with the event's name, and the shop's site the items are received into | An event as a site of its own in the register, which inventory would have to hold |
| Q21 | What stands while Q9, Q13, Q14 and Q15 stay open | Decided by agent: the build's defaults - the rates and the incentive unset until an admin sets them, a 90-day term, the ended choices as built, and the treasurer's recorded bank transfer | Holding the service until each is settled |
| Q22 | Whether the vault-first model replaces this change's intake model | Decided by @ecchochan, 2026-10-29: yes. A card is consigned online from the vault, not taken in at the counter (Q2); it earns a daily incentive in the vault, not one at the seal (Q1, Q9, Q10, Q18); the collector sets only a lowest acceptable price; proceeds reach the earnings wallet 3 business days after the buyer pays, and the collector cashes out from it (Q15); papers are issued each period per consignor, as built (Q4); the period is a year (Q13); an unsold card goes back to the vault, earning (Q14); the collector's cards sit on the vault Portfolio (Q16). What this change built and the model keeps stands - [Consignment](/p/grade10-site/consignment), [Vault](/p/grade10-site/vault) | Finishing this change on its own model, then replacing it |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
