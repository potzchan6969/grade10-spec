---
title: Ticket operations
summary: The events, orders, refunds and door behind every ticket.
icon: ticket
---

The operator half of tickets. An event is drafted, given its ticket types
and put on sale here; invitations are sent to a named list; an order is
found, refunded or cancelled; and the door admits tickets by QR code or by
reference. The console's screens for it are not built yet.

- 🚧 **The Tickets section** — events, passes, prices, Fast Pass, sales,
  promo codes, free tickets, orders, refunds, invitations and the door,
  designed and built in the console
- 🚧 **The passcode door** — a door page of its own for volunteers, with no
  account — [Door](/p/grade10-admin/ticketing/door)

The collector's half, buying and holding tickets, is
[Tickets](/p/grade10-site/ticketing).

## Who Can Do What

Every act needs a recent sign-in, and a two-factor check where one is on.
Every change, and every search by a reference or an address, is entered on
the [audit chain](/p/grade10-admin/audit) — never the address searched for.

| Grant | Lets an operator |
| --- | --- |
| `ticketing:read` | read events, orders, refunds, invitations and the attendees |
| `ticketing:manage` | shape events and ticket types, send and take back invitations, cancel a free order, resend a confirmation |
| 🚧 `ticketing:manage`, besides | make promo codes, give free tickets, and fix an order |
| `ticketing:refund` | send money back |
| `ticketing:checkin` | run the door |

- **Cancelling an event** — needs both `ticketing:manage` and
  `ticketing:refund`, because it refunds every paid order on it
- **Staff** — hold all four; admins hold them through every permission
- 🚧 **Door role** — holds only `ticketing:checkin`, for door volunteers
  with a console account

:::detail{title="Code map" for="engineer"}
- **Console data layer** — `@grade10/ticketing-admin-frontend` (`packages/ticketing/admin-frontend`)
- **Grant map** — `TICKETING_ADMIN_PERMISSIONS` in `@grade10/ticketing-contracts`
- **Roles** — `packages/grade10-auth/contracts/src/schemas.ts`
:::

:::detail{title="Product decisions" for="pm"}
The people who run an event, answer its buyers and work its door are a
small team on show day, and the one act that costs money — a refund — must
never ride along with an edit. Out of scope: per-event access, and
operators outside grade10.

| Measure | Counts |
| --- | --- |
| Draft to on sale | Time from an event's draft to its publish |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Grants split by cost | Decided | Reading, shaping, money and the door are four grants, so a refund is never a side effect of editing. | Product |
| Door-only role | Decided | A `door` role holds only the door, and the passcode door needs no account at all. | Operations |
:::
