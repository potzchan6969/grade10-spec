---
title: Accounts
---

`shared-auth` is how a person gets into a brand's site or console, and what
happens to their account once they are in. It is shaped by brand rather than by
product: one contract serves grade10 and ZZZ alike, so a collector signing in on
the grade10 site and an operator signing in to the ZZZ console meet the same
rules.

## The collector half

There is no password anywhere. A person signs in with an emailed link, an
emailed six-digit code, or — where the brand offers it — Google. One verified
email address is one account: the first successful sign-in creates it, and every
later visit is the same person. A session covers every site of that brand and
none of another, and signing out happens in exactly one place per surface,
always with feedback.

Four capabilities carry that: **sign-in** (the methods and their limits),
**session** (who the caller is, once they are in), and **sign-out** (leaving
one). Between them they cover a collector's whole relationship with their
account.

## The operator half

An operator is a person holding a role above `user`. **Roles** names the closed
set and what each grants. **Users** is the identity directory — listing
accounts, banning, unbanning, changing roles. **Sessions** is listing where a
person is signed in and ending those sessions. **Audit** is the trail all four
of those moves land on: ban, unban, set-role and revoke, successes and refusals
alike. An action whose record cannot be written does not run.

An auditor holds exactly one grant and reads that trail without seeing names or
emails, which sit behind the directory grant everywhere else.

:::callout{kind="note"}
`session` and `sessions` are two different capabilities, not a typo. The
singular one is who the caller is; the plural one is an operator listing and
ending somebody else's sessions.
:::

:::detail{title="Where the enforcement lives" for="engineer"}
Three fail-closed layers gate every admin surface: role permissions, a second
factor, and a tamper-evident trail
([docs/architecture/security.md](https://github.com/9gag/grade10/blob/main/docs/architecture/security.md)).
`elevatedProcedure` and `elevatedRoute` are the only doors to an admin
operation — never a signed-in procedure plus a role check in the resolver.

Account deletion has one door too: an admin-only, elevated call on the auth
worker, in one transaction that asserts the account exists, writes a tombstone,
deletes the row, and appends to the trail. A failed append rolls the deletion
back. See
[docs/architecture/account-data.md](https://github.com/9gag/grade10/blob/main/docs/architecture/account-data.md).
:::
