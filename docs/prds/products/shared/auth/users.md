---
title: Users
spec: shared/auth/users
audience: operator
order: 5
reviewed: 2026-09-29
---

## Directory

Only holders of the directory grant see the list. Search matches a name or an email, letter case ignored, and an account opens by user id. The list narrows by elevated or user population, a named elevated role, status and email verification, several at once. The caller chooses the order, newest first when none is asked. A banned account stays in the directory, marked. A person nobody can find is a person nobody can unban.

## Ban and Unban

- **Blunt by design** — a ban ends every session the account holds, refuses new sign-ins and stops money moving. An unban restores sign-in
- **Refused outright** — banning yourself, or any account holding `admin`, peers included, not only support or the last admin
- **Closes within 70 seconds** — a ban stops answering signed in on every read within 70 seconds, not only on a mutation or an elevated call. A browse page's cached copy of the session would otherwise last five minutes

:::flow{title="Banning an account"}
## The operator finds the account

They open the directory, which they see only if they hold the listing grant, and search by name or email, or open by user id.

## They choose Ban and give a reason

The console asks for confirmation in its own dialog, with the reason it will record.

## The system refuses the two forbidden cases

Nobody can ban themselves, and nobody can ban the last admin.

## The gate is walked

The session is re-read fresh from the auth worker, the ban permission is checked, and a second factor is proven where the environment enforces one.

## The record is written first

The action, the operator and the reason go on the identity trail. If that write fails, the ban does not happen.

## The account is shut

Every session it holds ends, new sign-ins are refused, and money stops. The account stays in the directory, marked banned, so it can be found and unbanned later.
:::

## Role Changes

- **Who may change** — an operator holding the set-role grant, from the same directory, their own account included
- **Clearing roles** — clearing every operator role leaves a plain user
- **Admin is protected** — an operator cannot strip `admin` from another admin. An admin may remove their own `admin` when another admin remains. The last admin keeps `admin`
- **Reflects within 70 seconds** — an ordinary, non-elevated read of the person's permissions answers the new roles within 70 seconds, not only on an elevated call

Everything on this page is what an operator may do. Each of these moves lands on the identity trail — [Audit Log](/p/shared/auth/audit). The page of Grade10 that uses this read is the [Users access desk](/p/grade10-admin/console/user-directory).

## Create Account

- **Create** — an operator holding `user:create` may create a passwordless Auth account with a name, an email and roles from the closed set. A duplicate email is refused. Creating with a role other than `user` also requires `user:set-role`. No loyalty enrolment or invite mail is sent
- ❓ **Email verification on create** — what verification standing a newly created Auth account starts with: unverified until the person proves the address, or verified because an operator typed it. Owner: Product

:::callout{kind="note"}
Auction bidder bans are a separate thing with a separate switch. The auction service keeps its own flag, because an identity ban does not cross brands and the auction is shared across them.
:::

## Erasure

- **The account holder files their own request** — from a product's Your data page, and cancels it there inside the seven days. A self-filed request bans nothing — [Account Data](/platform/account-data#erasure)
- **Standing waits for the request** — while an erasure request is open, a ban or an unban of that account is refused by name. The request closing, cancelled or completed is what changes standing

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| What create buys | Decided | Auth and roles only. It simulates ordinary account creation, then an elevated grant. It is not Override's loyalty enrolment or opening points. | Product |
| Who may create | Decided | Offer Create only with `user:create`. A non-`user` role also needs `user:set-role`. | Product |
| Password and invitation | Decided | Passwordless, with no password field. The create is silent, with no invite or magic-link email. | Product |
| Empty roles | Decided | The account is left as `user` only. | Product |
| Name and email | Decided | Both are required. Confirm stays disabled until both are present after trim. | Product |
| Which moves close within 70 seconds | Decided | Ban, revoke and role change. Account deletion is not a capability here yet, so a deleted account's cached read keeps its five minutes until a change specifies deletion. | Product |
| Closing bound | Decided | 70 seconds everywhere: the session store's one-minute spread plus a 10-second margin. Not "the next read", which only the location that made the change can keep. Under a minute needs sessions off the edge session store. | Engineering |
:::
