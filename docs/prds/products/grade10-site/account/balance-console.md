---
title: Balance Console
audience: operator
order: 8
---

The Balance section of the admin console: the payouts finance makes, the
bills it confirms, and every holder's lines.

## Queue

| View | What it lists |
| --- | --- |
| Payout requests | asked for and not yet paid, oldest first, by state |
| Before payout | holders with something available and no verified identity |
| Debts | holders whose balance is below nothing |
| Bills to confirm | FPS receipts uploaded and not yet confirmed or sent back |
| Open bills | raised and unpaid, by the service that raised them |
| Batches | FPS and bank batches, exported or not |

- 🚧 **Refusals in words** - a request that cannot be approved names why: no
  verified identity, a debt, no account in the holder's name, less than the
  minimum
- 🚧 **Counts** - each view carries its count

## One Holder

- 🚧 **The page** - the account or partner, the identity standing, the
  payout account masked, the four figures, every line with the product and
  the fact behind it, the bills, the payouts and the statements
- 🚧 **Reveal** - finance reveals one masked number at a time, and each
  reveal is recorded with who and when
- 🚧 **Locked lines** - each yield line shows the day it becomes
  withdrawable

## Acts

- 🚧 **Ask for a payout** - for a holder, up to what is available
- 🚧 **Approve** - never the person who asked; whoever set a holder's
  commission outside the schedule does not approve that holder's payouts
- 🚧 **Batch** - approved requests gathered into one FPS or bank batch and
  exported as the bank's file; each marked paid with the bank's reference,
  or failed, which puts the amount back
- 🚧 **Confirm a bill** - an FPS receipt confirmed against the bank, or sent
  back with a reason; a payment at the counter recorded with its method and
  reference
- 🚧 **Export** - a CSV of a period's payouts, bills and lines, on the audit
  chain

## Settings

| Setting | Default | Choices |
| --- | --- | --- |
| Minimum payout | ❓ **HKD 800** | any amount |
| Statement period | monthly | monthly |
| Payee for FPS bills | the entity's FPS identifier and bank account, as the vault's loan prints them | per entity |
| Card on bills | on | on or off |

- **Who** - `balance:settings`, held by admins; every change on the audit
  chain with the old and new value

## Grants

| Grant | Roles | Opens |
| --- | --- | --- |
| `balance:read` | staff, treasurer, admin | a holder's figures, lines and bills |
| `balance:payout` | treasurer, admin | ask for a payout for a holder, the queue and the export |
| `balance:finance` | treasurer, admin | approve and batch payouts, mark them paid or failed, reveal a masked number, confirm a bill or record one paid at the counter |
| `balance:settings` | admin | change a setting |

- **Two people for money** - a payout is approved by someone other than
  whoever asked for it
- **Second factor and audit** - as the vault's: required in production, and
  every act filed under its holder

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| One payout desk | Decided | Finance pays every product's money from one queue, under the balance's grants, instead of a payout desk per product - 2026-10-26 | Finance |
| Who set the rate never pays it | Decided | Carried over from consignment: the check reads the holder, since the balance pools every consignment and every item - 2026-10-26 | Finance |
| A bill confirmed by a person | Decided | FPS has no feed; a treasurer matches the transfer to the bill's reference, as the vault's loan and the auction's orders are matched - 2026-10-26 | Finance |
:::
