---
title: Sign-In Tests
spec: shared/auth/test-sign-in
order: 8
---

QA walks sign-in on staging through a locked door. Collectors never see it.

## Rules

| Rule | Value |
| --- | --- |
| Who may call | 🚧 The door's own workflow, on a dispatch a reviewer approved |
| Which addresses | 🚧 Any address under the tester domain |
| Where it is open | 🚧 Staging only |
| How long a captured mail stays readable | 🚧 **Fifteen minutes**, so it outlives the link |
| Link lifetime | Five minutes — [Sign-In](/p/shared/auth/sign-in) sets it |

## Who May Call

- 🚧 **The door's own workflow** — one workflow opens the door, and nobody else can.

Proving the repository is not enough on its own: every job in it proves the same thing, including one running code a pull request wrote.

## Testers

Any address under one tester domain, minted per run. A test names its own address and puts it in whatever state it needs.

- ❓ **The domain** — Ops names it. Until then the door has no subjects.
- ❓ **Delivery** — Ops gives the domain a catch-all inbox, so a sign-in mail to a tester address is delivered like any other and nothing bounces.
- ❓ **Sweeping** — tester accounts accumulate on staging. Nobody has settled how old one gets before it is removed.

## What the Job May Do

Only for an address under that domain:

- 🚧 **Capture the link** — the last sign-in mail for that address, without opening the mailbox, so the job can follow it
- 🚧 **Age the unused link** — so an expired follow can be walked without waiting five minutes
- 🚧 **Ban the address** — so a banned follow can be walked without the Users desk
- 🚧 **Prepare the address** — so it holds `admin` before the link is followed
- 🚧 **Clear the sign-in limits** — the wait between two sign-in mails, and the limit on how many a caller may ask for, so a suite is not throttled as an attacker would be

Ban and prepare answer for an address that has never signed in: the account is created, then put in the state the move names.

The collector still asks for the link the ordinary way. The job only captures, ages, bans, prepares, or clears.

## Closed

- 🚧 **Everywhere else** — preview, production, and the disposable `/dev` door on staging stay closed. An address outside the tester domain is refused. The job does not mint a session without following the mail, it does not unban, and it does not seed store or auction data.

:::detail{title="Code map" for="engineer"}
- **Disposable `/dev` door** — [docs/architecture/e2e.md](https://github.com/9gag/grade10/blob/main/docs/architecture/e2e.md) and [docs/architecture/security.md](https://github.com/9gag/grade10/blob/main/docs/architecture/security.md)
- **Staging host** — `grade10-stg.com`
:::

:::detail{title="Product decisions" for="pm"}
Staging auth tests need the sign-in link without opening `/dev` on a public worker. The door is one Actions workflow plus one tester domain, not a new environment.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Where the door is open | Decided | Staging only. | Product |
| Who may call | Decided | One workflow, from main, on a reviewed dispatch. Proving the repository alone is not enough. | Product |
| Which addresses | Decided | Any address under one tester domain, minted per run. | Product |
| The domain | ❓ Open | Ops names it. | Ops |
| Delivery | ❓ Open | A catch-all inbox on that domain, so nothing bounces. | Ops |
| Sweeping tester accounts | ❓ Open | How old before one is removed. | Ops |
| Capture, age, ban, prepare, clear | Decided | Those five, for a tester address only. | Product |
| Session mint without mail | Decided | No. Follow the captured link. | Product |
| Unban | Decided | No. A run that needs an unbanned address mints one. | Product |
| Store and auction seeds | Decided | Not this change. | Product |
| Preview and production | Decided | Closed. Preview is production backends. | Product |

Measured on the share of staging auth cases that finish a sign-in without a mailbox.
:::
