---
title: Roles and Permissions
spec: shared/auth/roles
audience: operator
order: 4
---

## Roles

There are seven roles, from one closed set: `user`, `staff`, `support`, `finance`, `treasurer`, `auditor` and `admin`. A name outside the set is dropped.

## Holding a Role

A product asks whether the caller holds a permission. Roles stack when a person holds several. No operator can widen what a role grants, because who holds a role is data in the database, while what a role grants lives in reviewed code.

That split limits a compromised operator account. It can hold roles it should not, but it cannot invent a permission for one.

- **Payment processing** — `auction:payment`, held by `finance`, `treasurer` and `admin`. It collects auction money: sending and reissuing an invoice, recording a payment, checking proof and cancelling an order — [Auction Management](/p/grade10-admin/auction/management#grants)
- **Payment Settings** — the premium minimums and the fee schedule sit under `auction:payment`, so finance keeps them — [Auction Management · Payment Settings](/p/grade10-admin/auction/management#payment-settings)
- **Refund processing** — `auction:refund`, held by `staff` and `admin`. It records an auction refund, apart from `auction:payment`, which collects money — [Auction Management](/p/grade10-admin/auction/management#grants)
- **Moving items** — `inventory:transfer`, held by `staff` and `admin`. It moves an item to a new owner and opens its proof — [Items](/p/grade10-admin/inventory/items#permissions)
- **Staff and treasurer together** — one person may hold both, and the grants stack. No act that approves another is taken by the person who recorded it, so a step that needs two people still needs two

:::detail{title="Gate layers" for="operator"}
Permissions are the first of three layers, all fail-closed. An elevated call re-reads the session straight from the auth worker with no cookie cache, so a ban or a role change acts at once. Then it checks every named permission. Then it requires a live second-factor stamp where the environment enforces one. Then it appends to the audit trail, without which the action refuses to run. A raw byte route — an identity capture, a sealed document, an item photo — climbs the same ladder.
:::

## Second Factor

- **Production** — required for every brand
- **Staging and development** — optional. `ADMIN_TWO_FACTOR` in [`packages/app-env`](https://github.com/9gag/grade10/blob/main/packages/app-env) sets it

## Permissions

A permission is one resource and one action, written `resource:action`. A permission outside the list grants nothing.

| Resource | Actions |
| --- | --- |
| `user` | `create` · `list` · `ban` · `set-role` · `delete` |
| `session` | `list` · `revoke` |
| `store` | `read` · `write` |
| `loyalty` | `read` · `adjust` · `invite` · `catalog` · `finance` · `demote` · `cancel` |
| `auction` | `read` · `write` · `operate` · `reserve` · `moderate` · `settle` · `payment` · `refund` · `shipment` |
| `vault` | `read` · `operate` · `approve` · `payout` |
| `kyc` | `read` · `request` |
| `grading` | `read` · `operate` · `approve` |
| `appointment` | `read` · `manage` |
| `inventory` | `read` · `write` |
| `audit` | `read` |

- **No `finance` resource** — lending is the vault's financed lane, so its cases and money sit under `vault`
- **Identity documents** — `kyc:read` reaches the identity capture, the signed document printed from it, and an account's Identity card. Reading a vault case does not, and there is no `kyc:write`
- **Requiring a verification** — `kyc:request`, held by `admin` alone. It requires an account to verify its person or its business, and drops that request — [Users](/p/grade10-admin/console/user-directory#identity)

## Vault, Split by Cost

| Runs the flow | Sets what it costs | Moves money |
| --- | --- | --- |
| `vault:operate` — intake, identity, papers, custody | `vault:approve` — a valuation, offer terms, a decline, a forfeiture | `vault:payout` — a payout, a repayment, a reversal, the money book, the finance position |

- **Staff** — holds `vault:operate` and `vault:approve`, and `kyc:read`
- **Treasurer** — holds `vault:read` and `vault:payout`, and no identity document
- **Money** — `vault:payout` is the only vault grant that moves money
