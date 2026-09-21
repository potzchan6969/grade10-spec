---
title: Sign-In Tests
spec: shared/auth/test-sign-in
order: 8
---

QA walks sign-in on staging through a locked door. Collectors never see it.

## Rules

| Rule | Value |
| --- | --- |
| Who may call | This repository's GitHub Actions job |
| Which addresses | A finite allowlist Ops names |
| Where it is open | Staging only |
| Link lifetime | Five minutes, same as any sign-in mail |

## Who May Call

- 🚧 **Staging job** — a run that proves it is this repository's Actions may use the door. A laptop, a fork, and any other caller are refused.

## Testers

A closed set of addresses, not a new one per run.

| Tester | Use |
| --- | --- |
| Collector | Ordinary sign-in |
| Ban-only | The banned-follow case; that address stays banned |
| Admin-only | Console cases that need `admin` |

- ❓ **Exact addresses** — Ops names the list. Until then the door has no subjects.

## What The Job May Do

Only for an address on that list:

- 🚧 **Capture the link** — the last sign-in mail for that tester, without opening the mailbox, so the job can follow it
- 🚧 **Age the unused link** — so an expired follow can be walked without waiting five minutes
- 🚧 **Ban the ban-only tester** — so a banned follow can be walked without the Users desk
- 🚧 **Prepare the admin-only tester** — so that address holds `admin` before the link is followed

The collector still asks for the link the ordinary way. The job only captures, ages, bans, or prepares.

## Closed

- 🚧 **Everywhere else** — preview, production, and the disposable `/dev` door on staging stay closed. An address not on the list is refused. The job does not mint a session without following the mail, and it does not seed store or auction data.

:::detail{title="Code map" for="engineer"}
- **Disposable `/dev` door** — [docs/architecture/e2e.md](https://github.com/9gag/grade10/blob/main/docs/architecture/e2e.md) and [docs/architecture/security.md](https://github.com/9gag/grade10/blob/main/docs/architecture/security.md)
- **Staging host** — `grade10-stg.com`
:::

:::detail{title="Product decisions" for="pm"}
Staging auth tests need the sign-in link without opening `/dev` on a public worker. The door is the Actions job plus a finite tester list, not a new environment.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Where the door is open | Decided | Staging only. | Product |
| Who may call | Decided | This repository's GitHub Actions job. | Product |
| Which addresses | Decided | A finite allowlist; one collector, one ban-only, one admin-only. | Product |
| Exact addresses | ❓ Open | Ops names them. | Ops |
| Capture, age, ban, prepare | Decided | Those four, for the matching tester only. | Product |
| Session mint without mail | Decided | No. Follow the captured link. | Product |
| Store and auction seeds | Decided | Not this change. | Product |
| Preview and production | Decided | Closed. Preview is production backends. | Product |
| Unique email per test | Decided | Not on this door. Local disposable stacks keep minting new addresses. | Product |

Measured on the share of staging auth cases that finish a sign-in without a mailbox.
:::
