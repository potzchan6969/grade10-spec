---
title: Users
spec: shared/auth/users
audience: operator
order: 5
---

Only an operator holding the directory grant sees the account list, and search
there matches an email whatever its letter case. An account that has been banned
stays in the directory, marked, rather than vanishing — a person nobody can find
is a person nobody can unban.

A ban is the blunt instrument, and it is meant to be: it ends every session that
account holds, refuses new sign-ins, and stops money moving. An unban restores
sign-in. Two moves are refused outright — banning yourself, and banning the last
admin.

Role changes are made by an operator holding the set-role grant, from the same
directory. Clearing every operator role leaves a plain user, and an operator
cannot change their own roles.

Everything on this page is *what an operator may do*. What the directory
components render is the console's own capability, and each of these moves lands
on the identity trail.

:::callout{kind="note"}
Auction bidder bans are a separate thing with a separate switch. The auction
service keeps its own flag because an identity ban does not cross brands and the
auction is shared across them.
:::

:::flow{title="Banning an account"}
## The operator finds the account

They open the directory, which they see only if they hold the listing grant, and
search by email — letter case does not matter.

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
