---
title: Accounts
icon: key
---

Accounts is how a person gets into a brand's site or console, and what happens to their account once they are in. A person signs in with an emailed link, or with Google where the brand offers it. Each surface keeps its own session. Operators manage roles, users, sessions and the audit trail on the same accounts, each behind its own permission.

## Pages

| Page | What it holds |
| --- | --- |
| [Sign-In](/p/shared/auth/sign-in) | The emailed link, Google, the waits, and following a link |
| [Session](/p/shared/auth/session) | Who the caller is, the two sessions, and open tabs |
| [Sign-Out](/p/shared/auth/sign-out) | Ending one surface's session |
| [Roles and Permissions](/p/shared/auth/roles) | The closed role set and the permissions each grants |
| [Users](/p/shared/auth/users) | The directory, bans, role changes, creating accounts and erasure |
| [Sessions](/p/shared/auth/sessions) | An operator listing and ending one person's sessions |
| [Audit Log](/p/shared/auth/audit) | The trail every identity write lands on |
| [Sign-In Tests](/p/shared/auth/test-sign-in) | How QA walks sign-in on staging |

:::callout{kind="note"}
`session` and `sessions` are two capabilities, not a typo. The singular one is who the caller is. The plural one is an operator listing and ending somebody else's sessions.
:::

## Collector Half

### Signing In

There is no password. A person types their email and a sign-in link is emailed to them.

| Method | Offered on |
| --- | --- |
| Emailed link | Every brand |
| Google | A brand that has enabled it, and only a verified Google address |

- **One account per address** — the first successful sign-in creates it. Letter case does not make a second account. A plus-tag is a different address
- **One link at a time** — a new link replaces the one sent before it, so the newest email always works
- **Stays on the brand** — a session covers the surface it was made on and no other brand. A return location the brand does not trust is ignored
- 🚧 **A link signs in the surface that asked for it** — a console link signs in the console only, and a site link signs in the site only

:::flow{title="Signing in by link"}
## *Collector* — **Asks for a link**
Asking again too soon is answered with a wait, not a second email.

## *Auth* — **Emails the link**
The link expires, and the email says when.

## *Collector* — **Follows the link**
The first use signs them in. A new address gets its account here.
:::

### Two Sessions

The console is its own sign-in. Each surface holds its own session.

| Surface | Who signs in | Ends with |
| --- | --- | --- |
| Site | A collector | Signing out on the site |
| Console | An operator | Signing out of the console |

- 🚧 **Separate sessions** — signing in on one surface does not sign anyone in on the other. A person may hold one, the other or both, as two different accounts
- 🚧 **Each ends on its own** — ending one session does not end the other
- 🚧 **Operator actions need the console's sign-in** — a site sign-in never counts as the recent sign-in an operator action asks for
- 🚧 **Release asks operators to sign in once more** — the console stops honouring the site's session at release. Customer sessions are untouched

### Open Tabs

Tabs on one surface share one session. A sign-in or sign-out in one tab shows in the others. A tab that cannot reach us keeps what it last showed.

## Operator Half

An operator is a person holding a role above `user`.

- **Permissions decide** — a product asks whether the caller holds a permission, never whether a role matches. Roles are data; what a role grants is reviewed code — [Roles and Permissions](/p/shared/auth/roles)
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
