---
title: Roles and Permissions
spec: shared/auth/roles
audience: operator
order: 4
---

A person's roles come from one closed set — `user`, `staff`, `support`,
`finance`, `treasurer`, `auditor`, `admin` — and a name outside it is dropped
rather than honoured.

The rule that matters most is how a grant is checked. A product asks whether the
caller holds a *permission*, never whether their role string matches something.
Roles stack when a person holds several, and no operator can widen what a role
grants, because who holds a role is data in the database while what a role
grants lives in reviewed code.

That split is what makes a compromised operator account a limited problem: it
can hold roles it should not, but it cannot invent a permission for one.

- **Payment processing** — `auction:payment`, held by `finance`, `treasurer`
  and `admin`; collecting auction money: sending and reissuing an invoice,
  recording a payment, checking proof and cancelling an order — [Auction
  Management](/p/grade10-admin/auction/management#grants)
- 🚧 **Payment Settings** — the premium minimums and the fee schedule sit
  under `auction:payment`, so finance keeps them — [Auction Management ·
  Payment Settings](/p/grade10-admin/auction/management#payment-settings)
- **Refund processing** — `auction:refund`, held by `staff` and `admin`;
  recording an auction refund, apart from `auction:payment`, which collects
  money — [Auction Management](/p/grade10-admin/auction/management#grants)
- 🚧 **Moving items** — `inventory:transfer`, held by `staff` and `admin`;
  moving an item to a new owner and opening its proof —
  [Items](/p/grade10-admin/inventory/items#permissions)
- 🚧 **Staff and treasurer together** — one person may hold both, and the
  grants stack; no act that approves another is taken by the person who
  recorded it, so a step that needs two people still needs two

:::detail{title="Gate layers" for="operator"}
Permissions are only the first of three layers, all fail-closed. An elevated
call re-reads the session straight from the auth worker with no cookie cache,
so a ban or a role change acts immediately; then it checks every named
permission; then it requires a live second-factor stamp where the environment
enforces one; then it appends to the audit trail, without which the action
refuses to run. A raw byte route — an identity capture, a sealed document, an
item photo — climbs the same ladder.
:::

## Permissions

A permission is one resource and one action, written `resource:action`, from a
list every product shares; a permission outside the list grants nothing.

| Resource | Actions |
| --- | --- |
| `user` | `create` · `list` · `ban` · `set-role` · `delete` |
| `session` | `list` · `revoke` |
| `store` | `read` · `write` |
| `loyalty` | `read` · `adjust` · `invite` · `catalog` · `finance` · `demote` · `cancel` |
| `auction` | `read` · `write` · `operate` · `reserve` · `moderate` · `settle` · `payment` · `refund` · `shipment` |
| `vault` | `read` · `operate` · `approve` · `payout` |
| `kyc` | `read` |
| `grading` | `read` · `operate` · `approve` |
| `appointment` | `read` · `manage` |
| `inventory` | `read` · `write` |
| `audit` | `read` |

- 🚧 **Moving items** — `inventory:transfer` joins `inventory` with
  [Items](/p/grade10-admin/inventory/items#permissions)
- 🚧 **No `finance` resource** — lending is the vault's financed lane, so its
  cases and money sit under `vault`
- 🚧 **Identity documents** — `kyc:read` reaches the identity capture and the
  signed document printed from it; reading a vault case does not, and there is
  no `kyc:write`

### Vault, Split by Cost

| Runs the flow | Sets what it costs | Moves money |
| --- | --- | --- |
| `vault:operate` — intake, identity, papers, custody | `vault:approve` — a valuation, offer terms, a decline, a forfeiture | `vault:payout` — a payout, a repayment, a reversal, the money book, the finance position |

- 🚧 **Staff** — holds `vault:operate` and `vault:approve`, and `kyc:read`
- 🚧 **Treasurer** — holds `vault:read` and `vault:payout`, and no identity
  document
- 🚧 **Money** — `vault:payout` is the only vault grant that moves money

:::callout{kind="warning"}
Two-factor is the second of the three gates and no capability of this
product's own covers it, although the UI blocks and stories for it ship. The
written policy is now one thing everywhere: a platform-wide rule requires a
second factor in production only, for every brand, and leaves it optional in
staging and development — `packages/app-env`'s `ADMIN_TWO_FACTOR` states it,
`docs/prds/platform/admin-access.md` and the vault's own
`grade10-admin/vault/operator-queue` spec agree.
:::
