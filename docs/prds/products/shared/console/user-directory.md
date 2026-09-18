---
title: User Directory
spec: shared/console/user-directory
audience: operator
order: 2
reviewed: 2026-09-15
---

This is the operator's view of the identity directory: a table of accounts,
filters the console offers, an account panel beside the list, and the dialogs
that confirm irreversible moves. Both brands' consoles render it from the same
source; Grade10 wires the access desk on
[Users](/p/grade10-admin/console/user-directory).

It carries no identity vocabulary of its own. The role list, each account's
roles, filter options, grant rows, and every displayed date arrive as props the
console already resolved; the components never name a role, parse a stored role
value, or format a date. A saved role selection comes back in the order the
options were offered rather than the order they were clicked, and selecting none
submits an empty list, leaving what an empty list means to the console.

## Moves

- **Handler-gated** — sessions, ban, and unban join roles and delete in
  appearing only when the console supplies a handler
- **Ban or unban** — a row offers one according to standing, never both; an
  erasing row withholds unban
- **Open** — a row can report opening the account; the table decides nothing
  about what shows next
- **Order** — sortable headings report the column and direction; the table
  does not reorder the rows it was given

## Account Panel

Four sections, in order, when the console supplies them: who the account is,
the grants it holds (elevated marked), standing with reason, and sessions
(origin and expiry when supplied). Roles save in the panel under the
roles-dialog contract, or stay blocked when the console marks them so. Ban,
unban, and delete report out for the moderation dialog — the panel never
confirms them. Status on the table stays one line; the ban reason lives on the
panel.

## Auction Suspension

🚧 The account panel offers suspending the account from auctions, or reinstating
it, only when the console supplies a handler, and never both at once. Both are
confirmed in the moderation dialog, suspension with a reason. The handler uses
the same auction-suspension standing as the auction Bidders control and a
missed payment deadline; it does not use the platform ban.

## Filters

Type, Roles, Status, and Email — labels and option words from the console.
Type is Elevated or Users; Roles is choosable only for Elevated. Any on Status
or Email clears that narrowing and leaves the others alone.

## Moderation Dialog

One confirmation serves every irreversible move. The console supplies the words,
the tone, and whether a reason is collected; the dialog reports one signature.

## Allowance

What an operator may do here is [the identity directory](/p/shared/auth/users)
and [where a person is signed in](/p/shared/auth/sessions). This capability
governs only what the components render.

## Role Links

- **On the account** — a role name may open the address the console supplied
- **In the table** — Roles stays plain text
- **Grade10** — wires those chips to
  [Roles & Permissions](/p/grade10-admin/console/roles-and-permissions)

:::callout{kind="note"}
This surface used to live in the shared-UI package as `auth-user-directory`. It
carries those requirements forward; only its home moved, to where admin UI
belongs.
:::
