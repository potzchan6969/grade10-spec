---
title: Vault
---

The vault is physical custody. A collector submits an item online, books a visit
to a shop, staff value it at the counter and sign documents with them on an
in-store iPad, and the item goes into a locker until whatever it owes is settled.
It is not a pure software product: the item is really in a locker, and the money
is really a bank transfer somebody made.

Two products share one case, deliberately — custody is the product, and financing
is an attachment on a case. Intake asks whether the collector wants a loan against
the item. If they do not, the case runs the storage-only lane and skips the offer,
the payout and the repayment steps entirely, but still records a valuation,
because custody and insurance need one. Storage is free today.

One case is one item, enforced by a unique index. A collector arriving with three
items leaves with three cases; the visit is booked on the lead case and staff open
the siblings in the shop.

## Who uses it

- **Collectors** open a request, photograph the item, book the visit, sign on the
  shop's iPad, watch the case, and ask for the item back.
- **Staff** work the queue: start a valuation, record a value, make or counter an
  offer, record the identity check, prepare and mint documents, confirm the item
  vaulted, release it, cancel it.
- **Treasurers** are the only people who record money — payouts, repayments,
  settlement. Staff and treasurer are disjoint on money, so a payout takes two
  people.
- **Admins** hold everything, as everywhere else.

:::callout{kind="note"}
The vault has one capability, and it is new: `grade10-site/vault/identity-check`,
which `add-hosted-identity-verification` adds. Everything else on these pages —
the custody lifecycle, four operator feature slices, two QA audits — still comes
from the architecture and QA docs and the code they describe, so the rest cannot
be embedded as a requirement the way other products' pages
embed theirs.
:::

There is no Figma frame and no shared UI block for any vault surface either. The
collector's pages and the operator's console are both app-owned.

:::detail{title="Where the design is written down" for="engineer"}
- [Vault architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md)
  — the case machine, the lanes, the vocabulary, and the decisions taken
- [Document-handling compliance audit](https://github.com/9gag/grade10/blob/main/docs/qa/vault.md)
- [Production-readiness review](https://github.com/9gag/grade10/blob/main/docs/qa/vault-production-review.md)
  — vault, doc-sign and auth together
- [Account data](https://github.com/9gag/grade10/blob/main/docs/architecture/account-data.md)
  — who owns the verified identity record the case only references

The code is `packages/vault/{contracts,backend,frontend,admin-frontend}` with
`packages/appointment`, `packages/doc-sign` and `packages/e-kyc` beside it. The
collector's pages are in the grade10 SPA and the console pages in the grade10
admin panel.
:::
