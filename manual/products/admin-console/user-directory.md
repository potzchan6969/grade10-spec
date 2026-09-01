---
title: The user directory surface
summary: The account table both consoles render, and the three confirmations behind changing an account.
spec: admin-console/user-directory
audience: operator
order: 2
---

This is the operator's view of the identity directory: a table of accounts, and
three dialogs — roles, moderation, and where the account is signed in. Both
brands' consoles render it from the same source.

It carries no identity vocabulary of its own. The role list, each account's
roles and every displayed date arrive as props the console already resolved; the
components never name a role, parse a stored role value, or format a date. A
saved role selection comes back in the order the options were offered rather
than the order they were clicked, and selecting none submits an empty list,
leaving what an empty list means to the console.

The table offers only the moves the console permits. Sessions are on every row;
roles and delete appear only when the console supplies a handler, so a console
can withhold a move the operator's grants do not allow. A row offers ban or
unban according to the account's standing, and never both.

::spec{id="admin-console/user-directory" requirement="A session is named without its secret"}

One confirmation serves every moderation move. The console supplies the words,
the tone, and whether a reason is collected; the dialog reports back one
signature either way, so a console reads the same result whichever move it
asked for.

What an operator is *allowed* to do here — who may list, ban, set roles, or end
a session — is [the identity directory](/p/shared-auth/users) and
[where a person is signed in](/p/shared-auth/sessions). This capability governs
only what the components render.

:::callout{kind="note"}
This surface used to live in the shared-UI package as `auth-user-directory`. It
carries those requirements forward unchanged in behaviour; only its home moved,
to where admin UI belongs.
:::

## The contract

::spec{id="admin-console/user-directory"}
