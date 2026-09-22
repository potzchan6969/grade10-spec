## Goals

- QA can walk staging sign-in for a tester address without a mailbox
- Banned and expired follows can be walked on addresses a run mints for itself
- Console cases that need `admin` can put a tester address in that state
- The existing auth specs run against staging with their own addresses
- Preview, production, other callers, and other addresses stay refused

## Non-Goals

- Opening the disposable `/dev` door on staging
- Opening this door on preview or production
- Minting a session without following the sign-in mail
- Unbanning through this door
- Store or auction seeds
- Calling the door from a laptop, or from a run a pull request started
- Sweeping the tester accounts a run leaves behind

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where is the door open? | Staging only. (recommended) | Preview, production, or flipping staging to the disposable environment. Preview is production backends. |
| Q2 | Who may call? | Superseded by Q16. This repository's GitHub Actions job. | A shared secret, Cloudflare Access, or any signed-in tester. A secret leaks; Access is people, not the job. |
| Q3 | Which addresses? | Superseded by Q17. A finite allowlist: one collector, one ban-only, one admin-only. | A plus-tag prefix, or minting a new address per test. Those grow unbounded staging users. |
| Q4 | Which moves? | Superseded by Q19. Capture the last sign-in mail, age an unused link, ban the ban-only tester, prepare the admin-only tester. | Every disposable `/dev` move, including minting a session without mail. |
| Q5 | Session without following the mail? | No. The job follows the captured link. (recommended) | `/dev/login` on staging. |
| Q6 | Store and auction seeds? | Not this change. (recommended) | Full E2E on `grade10-stg.com`. |
| Q7 | Unique email per test? | Superseded by Q17. Only on disposable local stacks. | Rewriting the local suite to one email. |
| Q8 | Capture when that address has no last mail? | Return no link. Last mail names a send; none is none. | Refuse the call, or invent a link. |
| Q9 | Capture naming no address? | Refused. Every move names an address. | Read a missing address as a default one. |
| Q10 | Capture while another address holds a last mail? | Return the named address's last mail only. | Return whichever mail was sent last across addresses. |
| Q11 | Age of a used or missing link? | A used link is unchanged; a missing one ages none. Age is for an unused link. | Age whatever last mail exists, used or not. |
| Q12 | Capture of a used last mail, and a second capture? | Last mail is the last send, used included, and a second capture returns it until another send. | Capture only an unused mail. |
| Q13 | Prepare when the address already holds `admin`? | Superseded by Q17 — a run mints an address that holds nothing. | Strip and grant again, or refuse. |
| Q14 | Ban when the address is already banned? | Superseded by Q17 — a run mints an unbanned address. | Unban first, or refuse the second ban. |
| Q15 | Which address may be aged? | Superseded by Q17 — any tester address. | The collector only. |
| Q16 | Who may call, given every job in the repository proves the same thing? | One workflow, from the main branch, on a dispatch a reviewer approved. Proving the repository is what a pull-request run proves too, and that run carries code a pull request wrote. | The repository claim alone, which the labelled-PR lane would have handed to PR-authored code. |
| Q17 | Which addresses, given three fixed ones cannot run the suite? | Any address under one tester domain, minted per run. Three reused addresses collide with the per-address send wait, with a ban this door will not reverse, and with twenty-five cases that mint their own address — one of which needs two addresses that differ only by a plus tag. | Three fixed testers, which was Q3. Its cost was unbounded staging accounts, and that is now Q21's problem rather than a reason to refuse. |
| Q18 | Delivery to an address with no mailbox? | Ops gives the tester domain a catch-all inbox, so the mail is delivered and nothing bounces. | Skipping the send for a tester address, which removes the one check that Resend still delivers. |
| Q19 | The throttle a suite trips? | A fifth move clears the sign-in limits for a tester address and for the caller. | Waiting out the wall clock, which is over half an hour a run, or exempting tester traffic inside the limiter, which puts the exception on the live path rather than behind the door. |
| Q20 | Ban or prepare of an address that never signed in? | The account is created, then put in the state the move names. | Refusing, which would make a run sign in before it could ban. |
| Q21 | Sweeping the tester accounts? | ❓ Open. Ops settles how old an account gets before it is removed. | Deciding it here, before anyone has seen how many a week leaves. |
| Q22 | How long a sent mail stays capturable? | Fifteen minutes, three times the link's own life. A capture after it answers nothing, so the bound is product-visible and sits on the page, not only in the design. | The link's five minutes, which races every scenario that ages a link and then reads it back. |
| Q23 | What does a refusal answer, and does the door admit it is there? | Every refusal reads alike: the call is refused and nothing changes. The status the caller reads is the design's, and a prober learns nothing about which rule it failed or whether the door exists on preview and production. | Naming the failed rule in the answer, which tells a prober how to get closer. |
| Q24 | Is an aged link's follow told apart from a used one? | Yes. Aging pushes the link past its lifetime, and `shared/auth/sign-in` already tells an expired follow from a used one. That difference is what makes the move observable. | A move that removes the link, which reads as a used follow and so proves nothing. |
| Q25 | What counts as under the tester domain? | The part after the last `@`, read without regard to case, equal to the domain and nothing more. A subdomain is outside it. | A suffix match, which admits `evil-test.<tester domain>` registered by anyone. |
| Q26 | Do two addresses differing only by a plus tag count as two? | Two. Each is acted on and each holds its own last mail. | Normalising the tag away, which breaks the one suite case Q17 named. |
| Q27 | What are the limit values, and who is the caller to the limiter? | `shared/auth/sign-in` owns both numbers and this door names neither. The caller is the network origin the limiter keys, which for a run is its runner. | Restating the values here, which leaves two places to change one number. |
| Q28 | A move repeated, or made after the follow? | Every move is idempotent: a second identical one lands the same state. A move after the follow acts on the account, not on the open session. | Refusing a second move, which turns a retry into a failure. |
| Q29 | How long does an approved dispatch's proof hold? | As long as the run's own token, which expires with the run. Within it a run may call any number of times, on any address under the domain. | A single-use proof, which costs a mint per move for no gain. |
| Q30 | Which moves create an account? | Ban and prepare only, per Q20. Capture, age, and clear need none, so an address that never signed in is left with none. | Creating one on every move, which leaves an account behind for a capture that found nothing. |
| Q31 | An address a previous run left behind, or a send that fails? | Neither is this door's. A run mints an address it has not used, and a failed send is `shared/auth/sign-in`'s; the door records what was sent. | A door move that removes an address, which is Q21's sweep wearing another name. |
| Q32 | Is a captured link bound to the run that captured it? | No. It is an ordinary sign-in link and anyone holding it can follow it. The lock is on the door, not on the link. | Binding the link to its caller, which changes sign-in's link for everyone to guard a staging door. |
| Q33 | Is an absent subject a refusal, or an answer with nothing in it? | An answer with nothing in it, both ways: a capture with no last mail returns no link and is not refused, and an age with no unused link ages none and changes nothing. | A refusal, which would make a run tell an empty state apart from a wrong caller by its own bookkeeping. |
| Q34 | What happens when a captured link is followed twice? | `shared/auth/sign-in` sets the link's one-time use, and capture does not touch it. | Restating one-time use here, which puts sign-in's rule in two places. |
| Q35 | Does clearing name an address, given it also acts on a caller? | Yes. Clearing names a tester address and clears the caller's counters alongside it, so every move names an address without exception. | A move that names no address, which would be the one hole in the address gate. |
| Q36 | Is a mail asked for at the ordinary sign-in surface the one capture records? | Yes. The door records the ordinary send and neither skips nor replaces it, so what a run asks for at the sign-in surface is what capture returns. | A separate send the door makes for itself, which would stop the suite proving that ordinary sign-in still sends. |
| Q37 | Does prepare grant anything besides `admin`? | No. `admin` on the terms `shared/auth/roles` sets, and nothing else. | A bundle of grants the console happens to need, which drifts from what an ordinary admin holds. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/auth/test-sign-in | What does a refused caller get back? Nothing says whether the answer names the rule, so a tester cannot tell a refusal from an outage. | Q23 |
| shared/auth/test-sign-in | Is an absent subject a refusal or an answer with nothing in it? Capture with no last mail and age with no link are both undecided. | Q33 |
| shared/auth/test-sign-in | What happens when a captured link is followed twice? The input turns on used against unused and never says. | Q34 |
| shared/auth/test-sign-in | Can a tester tell an expired follow from a used one? If not, no case can prove the age move worked. | Q24 |
| shared/auth/test-sign-in | Is a subdomain of the tester domain under it, and does case matter? | Q25 |
| shared/auth/test-sign-in | Are two addresses differing only by a plus tag one subject or two? | Q26 |
| shared/auth/test-sign-in | What are the wait and the count the fifth move clears? Neither number appears anywhere. | Q27 |
| shared/auth/test-sign-in | Who is the caller the limits are cleared for — the run, the workflow, the door, or an address? | Q27 |
| shared/auth/test-sign-in | Does clearing name an address, given it also acts on a caller that may have none? | Q35 |
| shared/auth/test-sign-in | What does a second identical move do — age twice, ban an already banned address, prepare one that already holds `admin`? | Q28 |
| shared/auth/test-sign-in | How many calls does one approved dispatch carry, and does its proof outlive the run? | Q29 |
| shared/auth/test-sign-in | Do capture, age, and clear create an account for an address that never signed in, as ban and prepare do? | Q30 |
| shared/auth/test-sign-in | What state does a run meet when it mints an address a previous run left behind? | Q31 |
| shared/auth/test-sign-in | What does the door answer when the send itself failed? | Q31 |
| shared/auth/test-sign-in | Is a mail asked for at the ordinary sign-in surface the one capture records? | Q36 |
| shared/auth/test-sign-in | Does prepare grant anything besides `admin`? | Q37 |
| shared/auth/test-sign-in | May a leaked captured link be followed by anyone, or only by the caller that captured it? | Q32 |
| shared/auth/test-sign-in | What do preview and production answer — a refusal, or nothing at all? | Q23 |
| shared/auth/test-sign-in | Does an unauthorised probe learn the door exists? | Q23 |
| shared/auth/test-sign-in | Is a move made after the follow refused, ignored, or applied to the open session? | Q28 |
