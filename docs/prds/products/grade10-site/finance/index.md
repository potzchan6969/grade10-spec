---
title: Finance
---

Finance is a scaffold. There is no lending product yet, and nobody uses it,
because there is nothing to use.

What exists is real: a deployed worker, its own database, an audit chain, an
hourly cron, and the session and permission ladder every procedure will mount
behind. What does not exist is any business logic at all — no lending tables, no
repositories, no services, no customer surface, no operator surface, and no
section in the admin console. Its permission map is literally empty, pinned that
way by a test, and its only other test proves the app assembles.

That is deliberate rather than abandoned. The shell exists so the first
mortgage-lending procedure lands behind the database, session, permission ladder
and audit sink it needs, with no wiring change and no scramble to give a new
service a home.

The intended product is mortgage lending, split the way the vault's pawn lending
is split: whoever agrees what a loan costs is not whoever moves the money. That
split is already in the shared permission vocabulary even though nothing checks
it yet — staff can read, operate and approve; the treasurer can read and pay
out; the two are disjoint on payout, so a disbursement takes two people.

:::flow{title="The only path a request can take today"}
## An operator asks for the audit trail
The single mounted surface is the shared audit read — list the chain, or verify
it.
## The session is resolved through the auth worker
An auth outage fails the request in staging and production. Only development is
allowed to degrade to signed out.
## The elevated ladder checks the operator
Named permission, second factor, and a place to record the action.
## The chain is read or walked
And that is the end of it. There is nothing else to reach.
:::

:::callout{kind="warning"}
Treat every plan that names finance as unbuilt. It carries a chain and a
gateway path so it is visible from day one, and the other services already list
it as a product they could serve — the diary and the identity store both name it
in their vocabulary — but none of them has an entrypoint for it, because there
is no feature that books a visit or checks an identity. The owner's notes for
the lending product are [the finance reference](/references/grade10-finance);
no spec carries them yet.
:::

:::callout{kind="note"}
No spec covers finance. The store has no finance spec and no change that
mentions mortgage lending. It appears in the application repository only as an
isolation and ledger policy sentence, a line about its hourly chain walk, and
its own permission comments.
:::

:::detail{title="For engineers" for="engineer"}
`packages/grade10-finance/` and `apps/backend/grade10/finance/` in the
application repository, deployed as `grade10-finance-service`. It owns
`audit_logs` and its verify cursor and nothing else. Its database is its own
project — a wall around money, alongside auth, the identity store and the vault
— so a leaked application credential cannot reach it and it restores on its own
clock. It walks its chain hourly but writes no verified head to the archive the
way the vault does, so the outside witness is missing.

Every future ledger is already stated in advance: append-only double entry,
erasure that anonymizes rather than deletes, scheduled logical dumps to object
storage, and money movement behind a step-up re-auth on a cache-bypassed
session.

Background:
[account data](https://github.com/9gag/grade10/blob/main/docs/architecture/account-data.md)
for the isolation and ledger policy, and
[operations](https://github.com/9gag/grade10/blob/main/docs/operations.md) for
the chain walk.
:::
