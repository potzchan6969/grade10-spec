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
| Q8 | Capture when that tester has no last mail? | Return no link. Last mail names a send; none is none. | Refuse the call, or invent a link. |
| Q9 | Capture naming no address? | Refused. Every move names a tester. | Read a missing address as the collector tester. |
| Q10 | Capture while another tester holds a last mail? | Return the named tester's last mail only. | Return whichever mail was sent last across testers. |
| Q11 | Age of a used or missing link? | A used link is unchanged; a missing one ages none. Age is for an unused link. | Age whatever last mail exists, used or not. |
| Q12 | Capture of a used last mail, and a second capture? | Last mail is the last send, used included, and a second capture returns it until another send. | Capture only an unused mail. |
| Q13 | Prepare when the admin-only tester already holds `admin`? | Leave it holding `admin`. | Strip and grant again, or refuse. |
| Q14 | Ban when the ban-only tester is already banned? | Leave it banned. The plain ban starts unbanned so the move is observable. | Unban first, or refuse the second ban. |
| Q15 | Which tester's unused link may be aged? | Any allowlisted tester. | The collector tester only. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/auth/test-sign-in | Capture when that tester has no last mail: last mail is named, and none is placed on neither side. | Q8 |
| shared/auth/test-sign-in | Capture naming no address: the list is empty or three named testers, and a call naming no address is not placed. | Q9 |
| shared/auth/test-sign-in | Asking for tester B while tester A holds a last mail: the other tester's mail is placed as neither withheld nor returned. | Q10 |
| shared/auth/test-sign-in | Age of a used link: unused is named, and used is placed on neither side. | Q11 |
| shared/auth/test-sign-in | Age of a missing link: unused is named, and missing is not placed. | Q11 |
| shared/auth/test-sign-in | Capture of a used last mail: last mail is named, and unused is named only for age. | Q12 |
| shared/auth/test-sign-in | A second capture before another send is not placed. | Q12 |
| shared/auth/test-sign-in | Prepare when that tester already holds `admin` is not placed. | Q13 |
| shared/auth/test-sign-in | Ban-only before the job bans: whether it starts unbanned, so the ban is the move, is not placed. | Q14 |
| shared/auth/test-sign-in | Ban when that address is already banned is not placed. | Q14 |
| shared/auth/test-sign-in | Which tester's unused link may be aged: unused is named, not which of the three. | Q15 |
