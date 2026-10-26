---
title: Balance
order: 5
---

| Setting | Default |
| --- | --- |
| Currency | the brand's; HKD for Grade10 |
| Payout | by FPS or bank transfer, to an account in the holder's own name |
| Minimum payout | **HKD 800**, about USD 100 at the peg, on every payout |
| Yield lock | **30** days from the day an item's yield starts - [Yield](/p/grade10-site/vault/yield) |
| Paying Grade10 | from the balance, by FPS, by card, or at the counter |
| Statement | monthly, to a holder whose balance moved |

## One Balance

What the house owes one Grade10 account, whichever product owes it.

- 🚧 **One per account** - consignment's proceeds and the vault's yield land
  in the account's one balance; a partner's is the company account an admin
  opens for it
- **Withdrawn, never spent** - the balance pays out to the holder's own
  account; it buys nothing in the store or at auction
- 🚧 **A credit says when it can be withdrawn** - yield from **30** days
  after its item's yield started, everything else at once; a sale's proceeds
  only reach the balance once its return window has closed
- 🚧 **Four figures** - the balance, every line summed; available, what may
  be asked for now; locked, credits not yet withdrawable; and debt, a balance
  below nothing
- 🚧 **A debt** - a refund or a chargeback after the window can take the
  balance below nothing; nothing is paid out until later credits or a
  payment clear it, and a debit note says so
- 🚧 **Never rewritten** - each line is keyed by the fact it follows, so a
  product that tells the balance twice is paid once; a correction is a new
  line naming the one it takes back
- ❓ Legal - **Whose debt it is** - the house sells and the custodian holds;
  whether one balance may carry what both owe, each line naming its entity,
  or each entity pays out its own

| Line | Comes from | Withdrawable |
| --- | --- | --- |
| Proceeds | consignment, when a sale's return window closes | at once |
| Refund or chargeback | consignment, after the window | a debit |
| Yield | the vault, for each day an item earned | **30** days after its yield started |
| Payout | the holder's request, as it is asked for | a debit |
| Payout returned | a payout that failed | at once |
| Fee paid from the balance | a bill the holder pays from what is available | a debit |
| Debt repaid | a debt bill paid by FPS, card or at the counter | at once |

## Cash-Out

- 🚧 **Asked for** - by the holder on their page, or by finance for them,
  for any amount from the minimum up to what is available
- 🚧 **What stops it** - no verified identity, a debt, no payout account in
  the holder's own name, less than the minimum, or a request to be erased
- 🚧 **Held as it is asked** - the amount leaves the available figure at
  once, so nothing is asked for twice; a failed or cancelled payout puts it
  back
- 🚧 **Paid by finance** - approved by someone other than whoever asked,
  gathered into an FPS or bank batch, exported as the bank's file, and marked
  paid with the bank's reference or failed
- **A paid payout sent back** - stays paid; finance settles it by hand
- 🚧 **No payout below the minimum** - every payout asks for at least
  **HKD 800**, emptying the balance or not

## Paying Grade10

A bill is an amount an account owes the house, for one named reason: the
vault's early take-out fee, or a debt.

- 🚧 **Four ways to pay** - from what is available; by FPS, scanning a code
  that carries the amount and the bill's reference; by card, on the card
  processor's hosted page; or at the counter, recorded by finance
- 🚧 **FPS is confirmed by a person** - the holder may upload the bank's
  receipt, and finance marks the bill paid against the bank; a receipt sent
  back says why
- 🚧 **Card is confirmed by the processor** - the bill is paid when the
  processor reports it, never when the holder comes back to the page
- 🚧 **Paid once** - a second payment for a paid bill is recorded and
  flagged for a refund
- 🚧 **The bill unlocks the act** - the service that raised it reads it paid;
  the vault releases an item once its fee is paid
- ❓ Legal - **Set-off** - that paying the house's fee from the balance is a
  set-off the terms allow, as commission is deducted from proceeds, and not
  spending the balance

## Identity and Details

- 🚧 **Verified before the first payout** - the identity check the vault or
  the counter recorded; a company also passes its business check
- 🚧 **Payout account** - an FPS identifier or a bank account in the
  holder's own name; one stands at a time, a replaced one is retired, never
  deleted
- 🚧 **Sensitive details** - payout account numbers are stored encrypted,
  shown masked, and revealed to finance one at a time, each reveal recorded
- 🚧 **Kept** - seven years after the holder's last movement; an erasure
  request in that time restricts the account instead, and is refused while
  anything is owed either way

## What the Holder Hears

| Message | When |
| --- | --- |
| Payout requested | a payout was asked for, with the amount and the account it goes to |
| Paid | the payout left, with the bank's reference |
| Payout failed | the payout came back, and the amount is available again |
| Yield available | the first day an item's yield can be withdrawn |
| Bill | a bill was raised, with what it is for and how to pay it |
| Bill paid | the bill was paid, and how |
| Debt | the balance went below nothing, with the debit note |
| Statement | each month the balance moved, every line in it |

- **By email** - in the holder's language, from the brand's catalogue

:::detail{title="Product decisions" for="pm"}
Consignment opened with a payout balance per consignor; the vault now pays a
daily yield to an item's owner. Two balances would mean two payout accounts,
two identity gates and two payouts for one person, so the balance belongs to
the account and each product only tells it what it owes.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Earns from a sale and from a card in the vault | Sees one figure, knows what can be withdrawn and when, and is paid in one transfer |
| Collector | Owes the house a fee | Pays it from the balance, by FPS or by card, without a visit |
| Partner | Sells in bulk | One balance and one statement for every deal |
| Treasurer | Payouts due | Approves, batches and records each once, against the bank's file |

**Not in scope.** Spending the balance in the store or at auction; a
balance in a second currency; interest on the balance itself; automated bank
matching.

**Measurement.** Payouts paid within five working days of their request; bills
paid by each method; balances held by age.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| One balance per account | Decided | Every product that owes an account money pays into one balance the account owns, not one per product - on the owner's direction, 2026-10-26 | Product |
| Products tell, the balance keeps | Decided | Consignment and the vault tell the balance each credit once, keyed by its fact; payouts, payout accounts, the identity gate and reveals live with the balance and nowhere else - 2026-10-26 | Engineering |
| A lock is a date on a line | Decided | Rules that differ by product are when each credit becomes withdrawable, never a second balance - 2026-10-26 | Product |
| Bills are paid like the auction's orders | Decided | FPS by a code and a person's confirmation, card by the processor's hosted page, both as the auction takes them; the balance and the counter as two more ways - on the owner's direction, 2026-10-26 | Product |
| Every balance is an account's | Decided | A partner holds its balance on a company account an admin opens for it, so no balance stands without an account - decided by the owner, 2026-10-26 | Owner |
| The minimum payout | Decided | **HKD 800**, about USD 100 at the peg, on every payout - decided by the owner, 2026-10-26 | Owner |
| Set-off of a fee | ❓ Open | Paying the house's fee from the balance | Legal |
| Two entities, one balance | ❓ Open | Whether the custodian's yield and the house's proceeds share a balance | Legal |
:::
