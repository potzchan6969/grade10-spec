---
title: Users
spec: shared/auth/users
audience: operator
order: 5
reviewed: 2026-09-29
---

Only an operator holding the directory grant sees the account list. Search
matches a **name or an email** without letter case, and an operator can open an
account by user id. The list narrows by elevated or user population, a named
elevated role, status, and email verification — several at once — and the
caller chooses order (newest first when none is asked). A banned account stays
in the directory, marked, rather than vanishing — a person nobody can find is a
person nobody can unban.

## Ban and Unban

A ban is the blunt instrument, and it is meant to be: it ends every session that
account holds, refuses new sign-ins, and stops money moving. An unban restores
sign-in. Moves refused outright: banning yourself, and banning any account that
holds `admin` — peers included, not only support or the last admin.

- 🚧 **Closes within 70 seconds** — a ban stops answering signed in on every
  read within 70 seconds, not only on a mutation or an elevated call, rather
  than after the five minutes a browse page's cached copy of the session
  would otherwise last.

## Role Changes

Role changes are made by an operator holding the set-role grant, from the same
directory — their own account included. Clearing every operator role leaves a
plain user. An operator cannot strip `admin` from another admin. An admin may
remove their own `admin` when another admin remains; the last admin keeps
`admin`.

- 🚧 **Browse reads close too** — a role change used to leave an ordinary,
  non-elevated read of the caller's permissions answering the old roles for
  up to five minutes; an elevated call already read fresh. It now reaches
  that read within 70 seconds as well.

Everything on this page is *what an operator may do*. What the directory
components render is the console's own capability, and each of these moves lands
on the identity trail. Grade10's page that uses this read is the
[Users access desk](/p/grade10-admin/console/user-directory).

## Create Account

- **Create** — an operator holding `user:create` may create a passwordless
  Auth account with name, email, and roles from the closed set; a duplicate
  email is refused; creating with a non-`user` role also requires
  `user:set-role`; no loyalty enroll or invite mail
- ❓ **Email verification on create** — what verification standing a newly
  created Auth account starts with (unverified until they prove the address,
  or verified because an operator typed it) — @rita-liu

:::detail{title="Product decisions" for="pm"}
| Decision | Choice |
| --- | --- |
| What create buys | Auth + roles only — simulate ordinary account creation then an elevated grant; not Override's loyalty enroll or opening points |
| Who may create | Offer Create only with `user:create`; a non-`user` role also needs `user:set-role` |
| Password | Passwordless — no password field |
| Tell the new person | Silent create — no invite or magic-link email |
| Empty roles | Leave the account as `user` only |
| Name and email | Required; Confirm stays disabled until both are present after trim |
:::

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

## Erasure

- 🚧 **The account holder files their own request** — from a product's Your
  data page, and cancels it there inside the seven days; a self-filed request
  bans nothing — [Account Data](/platform/account-data#erasure)
- **Standing waits for the request** — while an erasure request is open, a ban
  or an unban of that account is refused by name; the request closing,
  cancelled or completed, is what changes standing
