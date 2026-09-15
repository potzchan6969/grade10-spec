---
title: Users (access desk)
spec: grade10-admin/console/user-directory
order: 3
reviewed: 2026-09-15
---

The Grade10 Users page is the **access desk** — who holds what, standing,
sessions, and the grants an account actually carries — with the loyalty record
kept next door rather than merged.

- **Search** — name or email, without letter case; paste a user id to open that
  account
- **Narrow** — Type (Elevated or Users; Elevated when the address names no
  roles), a named elevated role when Type is Elevated, status, and whether
  the email is verified; several combine
- **Search miss** — the other Type as a link that keeps the query
- **Order** — by when the account joined or by email; newest first when none is
  asked
- **Panel** — one account open beside the list: identity, resolved grants
  (elevated marked), standing with reason, sessions with origin and expiry
- **Moves** — roles in the panel (not on the signed-in operator's own account);
  ban, unban, and erasure confirmed in dialogs; only the moves the session may
  make appear; ban and unban are not offered while erasure is filed
- **Address** — `?user=` opens the panel; search, filters, order, and page
  survive a paste; no `roles` in the address means elevated
- **Hand-offs** — loyalty record when the account holds no elevated role;
  audit trail when the session may read it; a role name on identity opens
  [Roles & Permissions](/p/grade10-admin/console/roles-and-permissions) when
  the session may open that page

Shared rules for the read and the components:
[Users](/p/shared/auth/users),
[User Directory](/p/shared/console/user-directory).

:::detail{title="Product decisions" for="pm"}
An operator holding a ticket that names a person could not find them by name,
could not ask who holds `admin`, and had to open separate confirmations to see
roles, standing, and sessions. The loyalty finder already matched name or email
but is the wrong shape for an access desk.

| User | Job |
| --- | --- |
| Support / admin | Find the person on a ticket and see their access whole |
| Admin | Answer who holds a closed role right now from Users alone |

| Measure | Reading |
| --- | --- |
| Ticket person found | Name or email fragment from the ticket reaches the account |
| Who holds admin | Directory narrowed to `admin` without leaving Users |

Non-goals:

- **Not the loyalty record** — points and tiers stay on Members; the two link
- **Not editing the grant map** — that stays on Roles & Permissions
- **Not ZZZ** — shared components grow; ZZZ adopts when it chooses
:::
