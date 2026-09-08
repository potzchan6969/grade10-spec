---
title: Vault operations
summary: The queue a shop works, and the book behind the loans it writes.
icon: vault
---

The operator half of the vault. A case is picked up from a queue cut by what
it is waiting for, valued and offered at the counter, signed, taken into a
locker, paid out and settled — and the money behind every one of those acts is
read back as a register, a position and a list of loans running late.

The collector's half — the request, the visit, the offer, the loan and the
paper — is [Vault](/p/grade10-site/vault), and the two are held to separate
specs because they are held by separate people.

| Capability | What it governs | Where it is written up |
| --- | --- | --- |
| `grade10-admin/vault/operator-queue` | The queue's views and badges, search, one case's tabs, the grants behind every act, and the physical vault | [Operator Console](/p/grade10-site/vault/operator-console) |
| `grade10-admin/vault/money-book` | The register of every money record in a period, the position the loan book stands at, and the loans in arrears | [Operator Console](/p/grade10-site/vault/operator-console) and [Loan and Money](/p/grade10-site/vault/loan-and-money) |

:::callout{kind="note"}
Both pages sit with the vault's own, because a shop reads the console beside
the product it is working. The specs are filed under `grade10-admin` because
that is the application held to them.
:::
