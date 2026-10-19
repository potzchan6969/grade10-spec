---
title: Sign-In Tests
spec: shared/auth/test-sign-in
order: 8
---

QA walks sign-in on the hosted stacks through a locked door. Collectors never
see it.

## Rules

| Rule | Value |
| --- | --- |
| Who may call | The hosted lane's own workflow, on a dispatch a reviewer approved |
| A QA agent | Holds the staging QA token, committed to the repository |
| Which addresses | Each environment's named testers, and on staging and uat a unique plus-tag of one |
| Where it is open | Staging and uat, every move; production and preview, capture and clear for the collector alone |
| How long a captured mail stays readable | **Fifteen minutes**, so it outlives the link |
| Link lifetime | Five minutes — [Sign-In](/p/shared/auth/sign-in) sets it |

## Who May Call

- **The lane's own workflow** — one workflow opens the door, in the Environment
  a reviewer approves. Proving the repository is not enough: every job in it
  proves the same thing, including one running code a pull request wrote.
- **A QA agent** — an agent walking a manual pass on staging captures a tester's sign-in link through the door, so it signs in without a mailbox — [Manual QA Passes](https://github.com/9gag/grade10-spec/blob/main/docs/governance/manual-qa-passes.md)
- **The QA token** — the agent proves itself with one token, committed to the repository so a pass needs no setup. Staging alone accepts it, and only for a tester address
- **What the token may do** — capture, age and clear; never ban or prepare, so a holder can grant nothing
- **Rotating it** — a commit replaces the token, and the old one is refused from that deploy on

## Testers

- **Named testers** — staging and uat each name four: a collector, a plus-tag
  sibling, a ban-only and an admin-only address. Production names its
  collector alone. They are written into the code, so a new tester is a commit.
- **A minted plus-tag** — on staging and uat a run mints a unique plus-tag of a
  named tester, so a test that needs an address nobody has used gets one.
  Production takes no plus-tag.
- ❓ **Sweeping** — accounts for minted plus-tags accumulate on staging and uat.
  Nobody has settled how old one gets before it is removed.

## What the Job May Do

Only for a tester address:

- **Capture the link** — the last sign-in mail for that address, without opening the mailbox, so the job can follow it
- **Age the unused link** — so an expired follow can be walked without waiting five minutes
- **Ban the address** — so a banned follow can be walked without the Users desk
- **Prepare the address** — so it holds `admin` before the link is followed
- **Prepare a scoped role** — `staff`, `support`, `finance`, `treasurer` or
  `auditor` on a unique plus-tag of the collector, never on a named tester
- **Clear the sign-in limits** — the wait between two sign-in mails, and the limit on how many a caller may ask for, so a suite is not throttled as an attacker would be

Ban and prepare answer for an address that has never signed in: the account is created, then put in the state the move names.

The collector still asks for the link the ordinary way. The job only captures, ages, bans, prepares, or clears.

## Closed

- **Production** — capture and clear only, for the collector; preview runs the
  production backends and answers the same
- **Everywhere else** — local stacks open no move, and the disposable `/dev`
  door stays closed on staging, uat and production. The job does not mint a
  session without following the mail, it does not unban, and it does not seed
  store or auction data here.

:::detail{title="Code map" for="engineer"}
- **Door** — [`packages/grade10-auth/backend/src/routes/testDoor.ts`](https://github.com/9gag/grade10/blob/main/packages/grade10-auth/backend/src/routes/testDoor.ts)
- **Where it opens** — `testDoorMoves` and `qaTokenTestDoorMoves` in [`packages/utils/src/env.ts`](https://github.com/9gag/grade10/blob/main/packages/utils/src/env.ts)
- **The lock** — [`packages/worker/src/testDoorOidc.ts`](https://github.com/9gag/grade10/blob/main/packages/worker/src/testDoorOidc.ts) and [`packages/worker/src/testDoorQaToken.ts`](https://github.com/9gag/grade10/blob/main/packages/worker/src/testDoorQaToken.ts)
- **Testers** — `grade10TestDoorEmails` in [`packages/grade10-auth/contracts/src/testDoorTesters.ts`](https://github.com/9gag/grade10/blob/main/packages/grade10-auth/contracts/src/testDoorTesters.ts)
- **The lane** — [`.github/workflows/e2e-hosted.yml`](https://github.com/9gag/grade10/blob/main/.github/workflows/e2e-hosted.yml)
- **Design record** — [security](https://github.com/9gag/grade10/blob/main/docs/architecture/security.md) and [e2e](https://github.com/9gag/grade10/blob/main/docs/architecture/e2e.md)
- **Staging host** — `grade10-stg.com`
:::

:::detail{title="Product decisions" for="pm"}
Hosted auth tests need the sign-in link without opening `/dev` on a public worker. The door is one Actions workflow plus each environment's named testers, not a new environment.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Where the door is open | Decided | Staging and uat, every move; production and preview, capture and clear for the collector alone - as the door shipped, recorded by agent in decisions Q41. | Product |
| Who may call | Decided | One workflow, from main, on a reviewed dispatch, and a QA agent walking a manual pass on staging. Proving the repository alone is not enough. | Product |
| How a QA agent proves itself | Decided | A staging-only QA token committed to the repository, for capture, age and clear on a tester address. Anyone who reads the repository can sign in as a tester on staging; that is accepted for an easy setup. | Product |
| Which addresses | Decided | Each environment's named testers, written into the code, and on staging and uat a unique plus-tag of one - as the door shipped, recorded by agent in decisions Q40. | Product |
| Sweeping tester accounts | ❓ Open | How old before a minted plus-tag's account is removed. | Ops |
| Capture, age, ban, prepare, a scoped role, clear | Decided | Those six, for a tester address only; a scoped role only on a minted plus-tag of the collector - decisions Q42. | Product |
| Session mint without mail | Decided | No. Follow the captured link. | Product |
| Unban | Decided | No. A run that needs an unbanned address mints one. | Product |
| Store and auction seeds | Decided | Not this change. | Product |
| Preview and production | Decided | Capture and clear for the collector alone; preview is production backends. | Product |

Measured on the share of staging auth cases that finish a sign-in without a mailbox.
:::
