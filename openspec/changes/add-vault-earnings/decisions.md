## Goals

- An owner hands in many cards in one visit and each card earns its own
  daily incentive from its contract's effective start
- The owner sees one balance: what can be cashed out, and what is locked
  until which day
- An admin can change every figure, and the crediting rule, without a
  release, and a card keeps the terms it took effect under
- Taking a card back early costs the fee an admin set, paid online or at
  the shop's till before the card is handed back
- Phase A of the owner's draft is live in mid November 2026

## Non-Goals

- Cashing the balance out - the draft's Phase B, with its minimum, frequency,
  rails and approval
- Consigning from the vault, and dropping the incentive at consignment -
  `add-consignment` and a change after this one
- Withdrawal by appointment, the move to CWB and the withdrawal note - the
  draft's Phase C
- Abuse signals, reports and the staff dashboard's incentive figures
- Moving cards between CWB, KEC and an event under leave-and-arrive
  confirmation - the inventory register's moves already carry it
- Deciding which cards earn, the caps, the liquidity factor and when the
  incentive stops on a sale - the draft's T1, T2, T3 and T5, held as ❓ on
  [Earnings](../../../docs/prds/products/grade10-site/vault/earnings.md)

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Whether the earning vault replaces the loan vault | One vaulting base: the vault and finance are separate products, and finance is vaulting with a financing add-on; a case holds many cards, each with its own incentive rate and financing term - decided by the owner | Replacing the loan lane, which rewrites its statuses and specs before Phase A; or a second vault beside it, two copies of custody |
| Q2 | What the lock's clock runs on | Per card, from its contract's effective start date - decided by the owner | Per case, which gives a card authenticated later an earlier clock |
| Q3 | Whether the incentive accrues during the first N days | It accrues from the effective start; the N days only stop it being cashed out - decided by the owner | Accruing only from day N, which pays nothing for the first N days |
| Q4 | How the first N days are credited | Both readings built behind one admin switch: credited daily and locked, or held and credited on day N - decided by the owner | One reading fixed in code, which the evolving draft would reverse |
| Q5 | When the vault's early withdrawal fee applies | Inside a Y-day period of its own from the card's effective start, separate from N; either figure and the fee may be 0 - decided by the owner | Tying the fee to the N-day lock, which couples a cash rule to a custody rule |
| Q6 | How the fee is paid | From a payment link online, or at the shop's till against the withdrawal's reference; the card is released only once it is paid - decided by the owner, the till path recommended by the round | Staff recording a payment taken outside the system, which leaves no audited link from the money to the withdrawal |
| Q7 | Whether consignment's early fee and the vault's are one figure | Two figures, each the product's own - decided by the owner | One fee across both, which cannot price a consignment's handling apart from custody |
| Q8 | When identity is required | Each point is a setting an admin switches; the owner's answer is still open - decided by the owner, the points themselves ❓ on [Identity Check](../../../docs/prds/products/grade10-site/vault/identity-check.md#gate) | Keeping today's identity before the custody paperwork fixed in code |
| Q9 | Where the balance lives | A ledger of its own beside the vault, one balance per owner, cashed out only - decided by the round | Inside the vault's database, which consignment's sale proceeds may not reach; or the loyalty ledger, which holds points that expire and are spent |
| Q10 | Whether a figure change reaches a card already earning | No: a card keeps the rate, N, Y and fee pinned when its contract took effect; each day's credit records the price and factor it used - decided by the round | Reading the current settings every day, which changes a signed contract's terms under it |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
