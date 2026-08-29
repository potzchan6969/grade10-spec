---
title: Operator console
summary: The queue staff work, the four grants that split it, and the one thing only a treasurer may record.
order: 3
---

The console is a queue of cases, filtered by where each one stands: **Needs
staff** (submitted, under valuation, offer made), **Agreeing** (accepted,
signing), **In custody** (vaulted, active, repaid), **Closed** (every terminal
status), and **Drafts**. It opens on Needs staff, because that is the only filter
holding work nobody has started.

One case opens into four tabs — Case, Documents, Custody and Payouts — and the
last of those is shown only to someone who may record money.

## Who may do what

Four grants split the console, and the split is the point rather than a
convenience:

- **Read** — staff, treasurer and admin. Seeing cases, items, documents and what
  is owed.
- **Operate** — staff and admin. Running the flow: starting a valuation,
  accepting, preparing and minting documents, vaulting, releasing, unwinding, and
  the case's visit.
- **Approve** — staff and admin. What a loan costs: recording valuations, making
  offers, declining, forfeiting.
- **Pay out** — treasurer and admin. Money moving: payouts, repayments,
  settlement.

:::callout{kind="decision"}
Staff and treasurer are disjoint on money, so a payout takes two people. Nothing
a single staff member can do moves money out of the business.
:::

The diary is a separate section — locations, rules, exceptions and a day's
bookings. The vault console reads the appointment service and runs the diary, but
it never moves a case's visit from there; a case's visit is moved on the case.

:::callout{kind="warning"}
The architecture doc is stale on where this console lives. It says vault admin is
in-app pages rather than an admin-frontend package, because the vault runs in one
brand's panel only. That package now exists, with four feature slices — cases,
valuation, compliance and settlement — landed after the doc's last edit. Its
"where it lives" table is stale for the same reason.
:::

:::callout{kind="warning"}
The two-factor policy is written down twice and the two do not agree. The security
architecture doc says the admin policy is required in staging and production; the
shipped environment config sets staging to optional and production to required,
with a comment saying staging stays optional deliberately. The doc line is the
stale one.
:::

:::callout{kind="note"}
No spec covers any of this. The grant table, the queue filters and the moves each
slice offers are read from the vault's permissions module, its admin router and
the feature slices themselves.
:::

## Decisions still open

The architecture doc keeps its own list, and these are the ones that touch
operators directly: the legal retention period per jurisdiction, to be decided
before the first production case; the storage fee schedule, if storage stops
being free; whether photo metadata keeps its location data once any of it is
shown outside a staff surface; and finance's own flow, cases and documents.

Forfeiture also has no materiality test and no grace period today, and thirty-six
configuration values are still unprovisioned.

:::detail{title="For engineers" for="engineer"}
Grants are `packages/vault/contracts/src/permissions.ts` and the procedure-level
mapping is `packages/vault/backend/src/trpc/routers/admin.ts` — every admin
procedure names the grant it needs, and audit listing and verification ride
`audit:read` rather than any vault grant.

The four operator slices are in `packages/vault/admin-frontend` under
`src/features/custody/`, each carrying its own doc comment as its description.
The pages that render them are in the grade10 admin panel, with case detail split
across the four tabs above.

Finance is a shell rather than the vault's lending half: the reuse of vault
machinery by finance is enabled, not wired — no entrypoint is minted and no
binding declared. See
[vault architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md)
and
[the elevated-procedure ladder](https://github.com/9gag/grade10/blob/main/docs/architecture/security.md).
:::
