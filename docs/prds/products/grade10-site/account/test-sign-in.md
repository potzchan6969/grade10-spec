---
title: Sign-In Tests
spec: shared/auth/test-sign-in
order: 8
---

QA walks sign-in on the hosted stacks through a gated endpoint. Collectors never see it.

## Who May Call

- **The lane's own workflow** — one workflow, from main, opens the test endpoint in an environment a reviewer approves. Proving the repository is not enough. A run a pull request starts is refused
- **A QA agent** — an agent walking a manual pass on staging captures a tester's sign-in link through the test endpoint, so it signs in without a mailbox — [Manual QA Passes](https://github.com/9gag/grade10-spec/blob/main/docs/governance/manual-qa-passes.md)
- **The QA token** — the agent proves itself with one token, committed to the repository so a pass needs no setup. Staging alone accepts it, and only for a tester address
- **What the token may do** — capture, expire and clear on a tester address, and on staging alone. Never ban or grant. A holder can sign in as any tester on staging except the admin-only one
- **The admin-only tester** — the token never reaches it, on any environment. Its link is followed by the workflow, which grants its `admin` before the follow
- **Rotating it** — a commit replaces the token, and the old one is refused from that deploy on. Anyone who reads the repository gets the new token too, so rotation cuts off only copies made earlier

## Where It Opens

- **Staging and uat** — every action, for the named testers and a unique plus-tag of one
- **Production and preview** — capture and clear, for the collector alone, by the workflow only

## Testers

- **Named testers** — staging and uat each name four: a collector, a plus-tag sibling, a ban-only address and an admin-only address. Production names its collector alone. They are written into the code, so a new tester is a commit
- **A generated plus-tag** — on staging and uat, a run generates a unique plus-tag of a named tester, so a test that needs an unused address gets one. Production takes no plus-tag
- **Removing** — accounts for generated plus-tags build up on staging and uat. Each is removed in the next cleanup after the run that generated it

## What the Workflow May Do

Only for a tester address:

- **Capture the link** — the last sign-in mail for that address, read without opening the mailbox. The mail stays readable for **fifteen minutes**, so it outlives the five-minute link
- **Expire the unused link** — so an expired follow can be walked without waiting five minutes
- **Ban the address** — so a banned follow can be walked without the Users desk
- **Grant the address** — so it holds `admin` before the link is followed
- **Grant a scoped role** — `staff`, `support`, `finance`, `treasurer` or `auditor` on a unique plus-tag of the collector, never on a named tester
- **Clear the sign-in limits** — the wait between two sign-in mails, and the cap on how many a caller may ask for, so a suite is not throttled as an attacker would be

Ban and grant answer for an address that has never signed in. The account is created, then put in the state the action names. The collector still asks for the link the ordinary way. The workflow only captures, expires, bans, grants or clears.

## Closed

- **Production** — capture and clear only, for the collector. Preview runs the production backends and answers the same
- **Everywhere else** — local stacks open no action, and the disposable `/dev` endpoint stays closed on staging, uat and production. The workflow does not generate a session without following the mail, does not unban, and does not seed store or auction data here

:::detail{title="Code map" for="engineer"}
- **Endpoint** — [`packages/grade10-auth/backend/src/routes/testDoor.ts`](https://github.com/9gag/grade10/blob/main/packages/grade10-auth/backend/src/routes/testDoor.ts)
- **Where it opens** — `testDoorMoves` and `qaTokenTestDoorMoves` in [`packages/utils/src/env.ts`](https://github.com/9gag/grade10/blob/main/packages/utils/src/env.ts)
- **The access check** — [`packages/worker/src/testDoorOidc.ts`](https://github.com/9gag/grade10/blob/main/packages/worker/src/testDoorOidc.ts) and [`packages/worker/src/testDoorQaToken.ts`](https://github.com/9gag/grade10/blob/main/packages/worker/src/testDoorQaToken.ts)
- **Testers** — `grade10TestDoorEmails` in [`packages/grade10-auth/contracts/src/testDoorTesters.ts`](https://github.com/9gag/grade10/blob/main/packages/grade10-auth/contracts/src/testDoorTesters.ts)
- **The lane** — [`.github/workflows/e2e-hosted.yml`](https://github.com/9gag/grade10/blob/main/.github/workflows/e2e-hosted.yml)
- **Design record** — [security](https://github.com/9gag/grade10/blob/main/docs/architecture/security.md) and [e2e](https://github.com/9gag/grade10/blob/main/docs/architecture/e2e.md)
- **Staging host** — `grade10-stg.com`
:::

:::detail{title="Product decisions" for="pm"}
Hosted auth tests need the sign-in link without opening `/dev` on a public worker. The test endpoint is one Actions workflow plus each environment's named testers, not a new environment.

Measured on the share of staging auth cases that finish a sign-in without a mailbox.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Where the test endpoint is open | Decided | Staging and uat, every action. Production and preview, capture and clear for the collector alone. | Product |
| Who may call | Decided | One workflow, from main, on a reviewed dispatch, and a QA agent walking a manual pass on staging. Proving the repository alone is not enough. | Product |
| How a QA agent proves itself | Decided | A staging-only QA token committed to the repository, for capture, expire and clear on a tester address. Anyone who reads the repository can sign in as a tester on staging. That is accepted for an easy setup. | Product |
| The admin-only tester and the QA token | Decided | Refused on every environment. The token never reaches it, so a reader of the repository cannot sign in as `admin`. | Product |
| Test-endpoint writes on the trail | Decided | A ban, a grant, a scoped role and an account the test endpoint creates are on the audit trail, named by the caller's kind. Capture, expire and clear write none. | Product |
| Which addresses | Decided | Each environment's named testers, written into the code, and on staging and uat a unique plus-tag of one. | Product |
| Removing tester accounts | Decided | A generated plus-tag's account is removed in the next cleanup after the run that generated it. | Ops |
| Capture, expire, ban, grant, a scoped role, clear | Decided | Those six, for a tester address only. A scoped role only on a generated plus-tag of the collector. | Product |
| Session generate without mail | Decided | No. Follow the captured link. | Product |
| Unban | Decided | No. A run that needs an unbanned address generates one. | Product |
| Store and auction seeds | Decided | Not this change. | Product |
| Preview and production | Decided | Capture and clear for the collector alone. Preview is production backends. | Product |
:::
