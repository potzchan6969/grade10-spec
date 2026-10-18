---
title: Accounts
icon: key
---

Accounts is how a person gets into a brand's site or console, and what happens to their account once they are in. A person signs in with an emailed link, or with Google where the brand offers it. Each site or console keeps its own session. Operators manage roles, users, sessions and the audit trail on the same accounts, each behind its own permission.

## Pages

| Page | What it holds |
| --- | --- |
| [Sign-In](/p/shared/auth/sign-in) | Google, the emailed link, resends, expiry and one-time use |
| [Session](/p/shared/auth/session) | The two sessions, open tabs and who is signed in |
| [Sign-Out](/p/shared/auth/sign-out) | Ending one site's or console's session |
| [Roles and Permissions](/p/shared/auth/roles) | The closed role set and the permissions each grants |
| [Users](/p/shared/auth/users) | The directory, bans, role changes, creating accounts and erasure |
| [Sessions](/p/shared/auth/sessions) | An operator listing and ending one person's sessions |
| [Audit Log](/p/shared/auth/audit) | The trail every identity write lands on |
| [Sign-In Tests](/p/shared/auth/test-sign-in) | How QA walks sign-in on staging |

:::callout{kind="note"}
`session` and `sessions` are two capabilities, not a typo. The singular one is who the caller is. The plural one is an operator listing and ending somebody else's sessions.
:::

## Collector Half

A collector signs in with an emailed link or Google, and signs out from the site. Start with [Sign-In](/p/shared/auth/sign-in). Then read [Session](/p/shared/auth/session) for what stays signed in, and [Sign-Out](/p/shared/auth/sign-out) for ending it.

## Operator Half

An operator is a person holding a role above `user`.

- **Permissions decide** — a product asks whether the caller holds a permission, never whether a role matches. Roles are data. What a role grants is reviewed code — [Roles and Permissions](/p/shared/auth/roles)
- **Three gates, fail-closed** — the role's permission, then a second factor where the environment enforces one, then the audit write. An action whose record cannot be written does not run — [Audit Log](/p/shared/auth/audit)
- **Ban is blunt** — it ends every session the account holds, refuses new sign-ins and stops money moving. The account stays in the directory, marked — [Users](/p/shared/auth/users)
- **Revoke is surgical** — it ends one session, or every session an account holds, and leaves the person able to sign in again — [Sessions](/p/shared/auth/sessions)
- **Auditors read, never act** — an auditor holds one grant, reads the trail, and sees no names or emails

## Not in Scope

- **Passwords** — there are none, on any surface
- **Profile and verified identity** — product data, not this contract. Grade10's is [Account](/p/grade10-site/account)

## Tests

🚧 **Sign-in without a mailbox** — QA walks sign-in on staging through a locked door. Collectors never see it — [Sign-In Tests](/p/shared/auth/test-sign-in)

:::detail{title="Code map" for="engineer"}
- **Contract** — `openspec/specs/shared/auth/`, one spec per capability
- **Enforcement** — `elevatedProcedure` and `elevatedRoute` are the only doors to an admin operation
- **Design records** — [security](https://github.com/9gag/grade10/blob/main/docs/architecture/security.md) and [account data](https://github.com/9gag/grade10/blob/main/docs/architecture/account-data.md)
:::

:::detail{title="Product decisions" for="pm"}
Measured on the share of email sign-ins that end in a session, from the send to the session.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Shape | Decided | Shaped by brand, not product. One contract serves grade10 and ZZZ alike, so a collector and an operator meet the same rules. | Product |
| Operator grants | Decided | Permissions are reviewed code. A person's roles are data, so an operator account cannot invent a grant. | Product |
| Closing bound | Decided | 70 seconds on every read. Under a minute needs sessions off the edge session store, so it is not offered. | Engineering |
| Session lifetime | ❓ Open | How long a session lasts, and what ends one besides signing out. | Product |
| Standing of a new account | ❓ Open | Whether a newly created account starts verified or unverified. | Product |
:::
