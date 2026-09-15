---
title: Users
spec: shared/auth/users
audience: operator
order: 5
---

Only an operator holding the directory grant sees the account list. Search
matches a **name or an email** without letter case, and an operator can open an
account by user id. The list narrows by elevated or user population, a named
elevated role, status, and email verification — several at once — and the
caller chooses order (newest first when none is asked). A banned account stays
in the directory, marked, rather than vanishing — a person nobody can find is a
person nobody can unban.

A ban is the blunt instrument, and it is meant to be: it ends every session that
account holds, refuses new sign-ins, and stops money moving. An unban restores
sign-in. Moves refused outright: banning yourself, and banning any account that
holds `admin` — peers included, not only support or the last admin.

Role changes are made by an operator holding the set-role grant, from the same
directory — their own account included. Clearing every operator role leaves a
plain user. An operator cannot strip `admin` from another admin. An admin may
remove their own `admin` when another admin remains; the last admin keeps
`admin`.

Everything on this page is *what an operator may do*. What the directory
components render is the console's own capability, and each of these moves lands
on the identity trail. Grade10's page that uses this read is the
[Users access desk](/p/grade10-admin/console/user-directory).

:::callout{kind="note"}
Auction bidder bans are a separate thing with a separate switch. The auction
service keeps its own flag because an identity ban does not cross brands and the
auction is shared across them.
:::

:::flow{title="Banning an account"}
## The operator finds the account

They open the directory, which they see only if they hold the listing grant, and
search by name or email — letter case does not matter — or open by user id.

## They choose Ban and give a reason

The console asks for confirmation in its own dialog, with the reason it will
record.

## The system refuses the two forbidden cases

Nobody can ban themselves, and nobody can ban the last admin.

## The gate is walked

The session is re-read fresh from the auth worker, the ban permission is
checked, and a second factor is proven where the environment enforces one.

## The record is written first

The action, the operator and the reason go on the identity trail. If that write
fails, the ban does not happen.

## The account is shut

Every session it holds ends, new sign-ins are refused, money stops. The account
stays in the directory, marked banned, so it can be found and unbanned later.
:::
