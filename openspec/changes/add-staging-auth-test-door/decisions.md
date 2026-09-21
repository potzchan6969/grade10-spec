## Goals

- QA can walk staging sign-in for an allowlisted tester without a mailbox
- Banned and expired follows can be walked on dedicated testers
- Console cases that need `admin` can use a dedicated tester
- Preview, production, other callers, and other addresses stay refused

## Non-Goals

- Opening the disposable `/dev` door on staging
- Opening this door on preview or production
- Minting a session without following the sign-in mail
- Store or auction seeds
- A new email address per test on this door
- Calling the door from a laptop
- Unbanning the ban-only tester
- Full current Playwright tree against `grade10-stg.com`

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where is the door open? | Staging only. (recommended) | Preview, production, or flipping staging to the disposable environment. Preview is production backends. |
| Q2 | Who may call? | This repository's GitHub Actions job. (recommended) | A shared secret, Cloudflare Access, or any signed-in tester. A secret leaks; Access is people, not the job. |
| Q3 | Which addresses? | A finite allowlist: one collector, one ban-only, one admin-only. (recommended) | A plus-tag prefix, or minting a new address per test. Those grow unbounded staging users. |
| Q4 | Which moves? | Capture the last sign-in mail, age an unused link, ban the ban-only tester, prepare the admin-only tester. (recommended) | Every disposable `/dev` move, including minting a session without mail. |
| Q5 | Session without following the mail? | No. The job follows the captured link. (recommended) | `/dev/login` on staging. |
| Q6 | Store and auction seeds? | Not this change. (recommended) | Full E2E on `grade10-stg.com`. |
| Q7 | Unique email per test? | Only on disposable local stacks. This door reuses the three testers. (recommended) | Rewriting the local suite to one email. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
