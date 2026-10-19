## Goals

- QA can walk staging sign-in for a tester address without a mailbox
- Banned and expired follows can be walked on addresses a run generates for itself
- Console cases that need `admin` can put a tester address in that state
- The existing auth specs run against staging with their own addresses
- Production and preview open capture and clear for production's own named testers, by the workflow alone, so a smoke test can sign in there
- Other callers and other addresses stay refused everywhere

## Non-Goals

- Opening the disposable `/dev` endpoint on staging
- Banning, granting or setting a role on production or preview
- The QA token anywhere but staging
- Generating a session without following the sign-in mail
- Unbanning through this endpoint
- Store or auction seeds
- Calling the test endpoint from a laptop, or from a run a pull request started, other than as Q38's QA agent
- Removing a named tester's account

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where is the test endpoint open? | Staging only. (recommended) | Preview, production, or flipping staging to the disposable environment. Preview is production backends. |
| Q2 | Who may call? | Superseded by Q16. This repository's GitHub Actions workflow. | A shared secret, Cloudflare Access, or any signed-in tester. A secret leaks; Access is people, not the workflow. |
| Q3 | Which addresses? | Superseded by Q17. A finite allowlist: one collector, one ban-only, one admin-only. | A plus-tag prefix, or generating a new address per test. Those grow unbounded staging users. |
| Q4 | Which actions? | Superseded by Q19. Capture the last sign-in mail, expire an unused link, ban the ban-only tester, grant the admin-only tester. | Every disposable `/dev` action, including generating a session without mail. |
| Q5 | Session without following the mail? | No. The workflow follows the captured link. (recommended) | `/dev/login` on staging. |
| Q6 | Store and auction seeds? | Not this change. (recommended) | Full E2E on `grade10-stg.com`. |
| Q7 | Unique email per test? | Superseded by Q17. Only on disposable local stacks. | Rewriting the local suite to one email. |
| Q8 | Capture when that address has no last mail? | Return no link. Last mail names a send; none is none. | Refuse the call, or invent a link. |
| Q9 | Capture naming no address? | Refused. Every action names an address. | Read a missing address as a default one. |
| Q10 | Capture while another address holds a last mail? | Return the named address's last mail only. | Return whichever mail was sent last across addresses. |
| Q11 | Expiry of a used or missing link? | A used link is unchanged; a missing one expires none. Expire is for an unused link. | Expire whatever last mail exists, used or not. |
| Q12 | Capture of a used last mail, and a second capture? | Last mail is the last send, used included, and a second capture returns it until another send. | Capture only an unused mail. |
| Q13 | Grant when the address already holds `admin`? | Superseded by Q17 — a run generates an address that holds nothing. | Strip and grant again, or refuse. |
| Q14 | Ban when the address is already banned? | Superseded by Q17 — a run generates an unbanned address. | Unban first, or refuse the second ban. |
| Q15 | Which address may be expired? | Superseded by Q17 — any tester address. | The collector only. |
| Q16 | Who may call, given every workflow in the repository proves the same thing? | One workflow, from the main branch, on a dispatch a reviewer approved. Proving the repository is what a pull-request run proves too, and that run carries code a pull request wrote. | The repository claim alone, which the labelled-PR lane would have handed to PR-authored code. |
| Q17 | Which addresses, given three fixed ones cannot run the suite? | Any address under one tester domain, generated per run. Three reused addresses collide with the per-address send wait, with a ban this endpoint will not reverse, and with twenty-five cases that generate their own address — one of which needs two addresses that differ only by a plus tag. | Three fixed testers, which was Q3. Its cost was unbounded staging accounts, and that is now Q21's problem rather than a reason to refuse. |
| Q18 | Delivery to an address with no mailbox? | Ops gives the tester domain a catch-all inbox, so the mail is delivered and nothing bounces. | Skipping the send for a tester address, which removes the one check that Resend still delivers. |
| Q19 | The throttle a suite trips? | A fifth action clears the sign-in limits for a tester address and for the caller. | Waiting out the wall clock, which is over half an hour a run, or exempting tester traffic inside the limiter, which puts the exception on the live path rather than behind the test endpoint. |
| Q20 | Ban or grant of an address that never signed in? | The account is created, then put in the state the action names. | Refusing, which would make a run sign in before it could ban. |
| Q21 | Removing the tester accounts? | Decided by the user: a generated plus-tag's account is removed in the next cleanup after the run that generated it. The named testers are never removed. | Keeping accounts until Ops picks an expire, which leaves staging unbounded. |
| Q22 | How long a sent mail stays capturable? | Fifteen minutes, three times the link's own life. A capture after it answers nothing, so the bound is product-visible and sits on the page, not only in the design. | The link's five minutes, which races every scenario that expires a link and then reads it back. |
| Q23 | What does a refusal answer, and does the test endpoint admit it is there? | Every refusal reads alike: the call is refused and nothing changes. The status the caller reads is the design's, and a prober learns nothing about which rule it failed or whether the test endpoint exists on preview and production. | Naming the failed rule in the answer, which tells a prober how to get closer. |
| Q24 | Is an expired link's follow told apart from a used one? | Yes. Aging pushes the link past its lifetime, and `shared/auth/sign-in` already tells an expired follow from a used one. That difference is what makes the action observable. | An action that removes the link, which reads as a used follow and so proves nothing. |
| Q25 | What counts as under the tester domain? | The part after the last `@`, read without regard to case, equal to the domain and nothing more. A subdomain is outside it. | A suffix match, which admits `evil-test.<tester domain>` registered by anyone. |
| Q26 | Do two addresses differing only by a plus tag count as two? | Two. Each is acted on and each holds its own last mail. | Normalising the tag away, which breaks the one suite case Q17 named. |
| Q27 | What are the limit values, and who is the caller to the limiter? | `shared/auth/sign-in` owns both numbers and this endpoint names neither. The caller is the network origin the limiter keys, which for a run is its runner. | Restating the values here, which leaves two places to change one number. |
| Q28 | An action repeated, or made after the follow? | Every action is idempotent: a second identical one lands the same state. An action after the follow acts on the account, not on the open session. | Refusing a second action, which turns a retry into a failure. |
| Q29 | How long does an approved dispatch's proof hold? | As long as the run's own token, which expires with the run. Within it a run may call any number of times, on any address under the domain. | A single-use proof, which costs a generate per action for no gain. |
| Q30 | Which actions create an account? | Ban and grant only, per Q20. Capture, expire, and clear need none, so an address that never signed in is left with none. | Creating one on every action, which leaves an account behind for a capture that found nothing. |
| Q31 | An address a previous run left behind, or a send that fails? | Neither is this endpoint's. A run generates an address it has not used, and a failed send is `shared/auth/sign-in`'s; the test endpoint records what was sent. | A endpoint action that removes an address, which is Q21's cleanup wearing another name. |
| Q32 | Is a captured link bound to the run that captured it? | No. It is an ordinary sign-in link and anyone holding it can follow it. The access check is on the test endpoint, not on the link. | Binding the link to its caller, which changes sign-in's link for everyone to guard a staging endpoint. |
| Q33 | Is an absent subject a refusal, or an answer with nothing in it? | An answer with nothing in it, both ways: a capture with no last mail returns no link and is not refused, and an expire with no unused link expires none and changes nothing. | A refusal, which would make a run tell an empty state apart from a wrong caller by its own bookkeeping. |
| Q34 | What happens when a captured link is followed twice? | `shared/auth/sign-in` sets the link's one-time use, and capture does not touch it. | Restating one-time use here, which puts sign-in's rule in two places. |
| Q35 | Does clearing name an address, given it also acts on a caller? | Yes. Clearing names a tester address and clears the caller's counters alongside it, so every action names an address without exception. | An action that names no address, which would be the one hole in the address gate. |
| Q36 | Is a mail asked for at the ordinary sign-in surface the one capture records? | Yes. The test endpoint records the ordinary send and neither skips nor replaces it, so what a run asks for at the sign-in surface is what capture returns. | A separate send the test endpoint makes for itself, which would stop the suite proving that ordinary sign-in still sends. |
| Q37 | Does grant grant anything besides `admin`? | No. `admin` on the terms `shared/auth/roles` sets, and nothing else. | A bundle of grants the console happens to need, which drifts from what an ordinary admin holds. |
| Q38 | May an agent walking a manual QA pass call the test endpoint? | Yes, as a second caller beside Q16's workflow, so an agent signs in on staging without a mailbox. How it proves itself, and which actions it may make, is open on the page. | The workflow alone, which leaves agents unable to walk any signed-in case on staging. |
| Q39 | How does Q38's agent prove itself? | A staging-only QA token committed to the repository, accepted only for a tester address and only to capture, expire and clear; a commit rotates it. Anyone who reads the repository can sign in as a tester on staging, accepted so a pass needs no setup. | Q2's refusal of a shared secret, kept for the workflow's own actions: the token never bans or grants. A token kept in the environment's secrets, which is safer and costs a setup step. |
| Q40 | Which addresses does the shipped endpoint act on? | Superseding Q17 and Q25: each environment's named testers, written into `@grade10/auth-contracts` — four on staging, four on uat, the collector on production — and on staging and uat a unique plus-tag of one, generated per run. No tester-domain secret exists. Confirmed by the user, 2026-10-19: a small named set, written in the code, so each tester is easy to identify | A tester domain Ops names, which nobody named, so the test endpoint would still have no subjects |
| Q41 | Where does the shipped endpoint open? | Superseding Q1: staging and uat every action; production, and preview with it, capture and clear for production's named testers; local stacks none. Confirmed by the user, 2026-10-19, so a smoke test can check production and preview have not broken. Production names its own testers, today the collector alone; a new one is a commit | Staging only |
| Q42 | Is there a sixth action? | Yes: a scoped role — `staff`, `support`, `finance`, `treasurer` or `auditor` — on a unique plus-tag of the collector, never a named tester and never `admin`. Confirmed by the user, 2026-10-19 | Grant granting `admin` alone, which leaves those walks unrunnable |
| Q43 | May the QA token act on the admin-only tester? | No, on any environment. Decided by the user. The shipped code accepts the token for any tester on staging, so the grade10 change is task 2.6. | A token that reaches `admin`, which lets any reader of the repository grant `admin` on staging. |
| Q44 | Does the QA token work off staging? | No. Staging alone accepts it, on uat, preview and production it is refused as any wrong caller. Preview runs production backends. Shipped as `qaTokenTestDoorMoves`. Decided by agent for staging ease: the token stays on the one environment it is committed for. | Uat with the token, which widens the committed secret to a second environment for no QA gain. |
| Q45 | Does the test endpoint's writes reach the identity trail? | Yes: a ban, a grant, a scoped role, and an account the test endpoint creates. The entry names the caller's kind in place of a user id, because the test endpoint has none. Capture, expire, and clear write no entry. Confirmed by the user, 2026-10-19: the audit spec requires every identity write on the trail, and the test endpoint's writes are identity writes. | An unrecorded endpoint write, which would let a staging account change with no trace. |
| Q48 | Does a refused call read 403, as an earlier draft asserted? | No code is asserted until the design names one: the status a refused call reads is the design's - decided by the round, citing Q23. | Asserting 403 from the spec, which the Closed anchor does not state. |
| Q46 | Is a refused endpoint ban on the trail? | Yes, for a caller the access check admitted, naming the caller's kind in place of a user id, as a refused operator ban is. A call the access check refuses has no caller kind and writes nothing. - decided by the round. Source: the change's requirement sentence "the same as the operator's own identity writes", and the PRD's "Refusals too" line in `docs/prds/products/grade10-site/account/audit.md`. | A refused endpoint ban left off the trail, which would let a refused call on staging leave no trace. |
| Q47 | Does the test endpoint have a create action? | No. An account for an address that never signed in is made by ban or grant, per Q20 and Q30. The six actions are capture, expire, clear, ban, grant and scoped role, per Q42. - decided by the round. Source: Q20, Q30 and Q42 in this file. | A create action, which no decision names. |
| Q49 | Does a grant that changes nothing write an entry? | Yes. Every grant is recorded, as the requirement says. Decided by the user, taking the recommendation. | Leaving a repeated grant off the trail, which would hide a second change. |
| Q50 | May the QA token ban, grant, set a scoped role or create an account? | No. The token captures, expires and clears only, on a tester address. The other actions run through the workflow alone. Decided by the user, 2026-10-19; this keeps Q39's wording that the token never bans or grants, and matches the shipped token. | The token acting on any staging tester but the admin-only one, which would widen a committed secret to the actions the workflow alone should hold. |
| Q51 | Is a mixed-case tester address acted on? | Yes, matched without regard to case, as the Case rule and SC-34 say. Decided by the user, taking the recommendation. | Refusing it, which would make `Tester@…` and `tester@…` two accounts for one person. |
| Q52 | Does the auditor see names on the test endpoint's entries? | No. The auditor sees user ids, as the audit page's Reading the Trail states. - decided by the round, citing `docs/prds/products/grade10-site/account/audit.md`. | Showing names, which the audit page rules out. |
| Q53 | Does a ban that creates an account name `ban` or `created`? | `ban`, in one entry: the entry names the action the call made and the new user id, and the creation writes no entry of its own, since the endpoint has no create action (Q47). Ban and grant keep creating the account. Decided by the user, 2026-10-19. | Naming `created`, which no action the endpoint offers would write. |
| Q54 | Is there a test-endpoint action that finds an account without changing it? | No. The endpoint has no create-or-find action (Q47), so US-04-TC2 is retired. The no-change find of the identity trail stays with its own requirement. - decided by the round, citing Q47 and Q49. | A find action, which Q47 gives no endpoint. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/auth/test-sign-in | What does a refused caller get back? Nothing says whether the answer names the rule, so a tester cannot tell a refusal from an outage. | Q23 |
| shared/auth/test-sign-in | Is an absent subject a refusal or an answer with nothing in it? Capture with no last mail and expire with no link are both undecided. | Q33 |
| shared/auth/test-sign-in | What happens when a captured link is followed twice? The input turns on used against unused and never says. | Q34 |
| shared/auth/test-sign-in | Can a tester tell an expired follow from a used one? If not, no case can prove the expire action worked. | Q24 |
| shared/auth/test-sign-in | Is a subdomain of the tester domain under it, and does case matter? | Q25 |
| shared/auth/test-sign-in | Are two addresses differing only by a plus tag one subject or two? | Q26 |
| shared/auth/test-sign-in | What are the wait and the count the fifth action clears? Neither number appears anywhere. | Q27 |
| shared/auth/test-sign-in | Who is the caller the limits are cleared for — the run, the workflow, the test endpoint, or an address? | Q27 |
| shared/auth/test-sign-in | Does clearing name an address, given it also acts on a caller that may have none? | Q35 |
| shared/auth/test-sign-in | What does a second identical action do — expire twice, ban an already banned address, grant one that already holds `admin`? | Q28 |
| shared/auth/test-sign-in | How many calls does one approved dispatch carry, and does its proof outlive the run? | Q29 |
| shared/auth/test-sign-in | Do capture, expire, and clear create an account for an address that never signed in, as ban and grant do? | Q30 |
| shared/auth/test-sign-in | What state does a run meet when it generates an address a previous run left behind? | Q31 |
| shared/auth/test-sign-in | What does the test endpoint answer when the send itself failed? | Q31 |
| shared/auth/test-sign-in | Is a mail asked for at the ordinary sign-in surface the one capture records? | Q36 |
| shared/auth/test-sign-in | Does grant grant anything besides `admin`? | Q37 |
| shared/auth/test-sign-in | May a leaked captured link be followed by anyone, or only by the caller that captured it? | Q32 |
| shared/auth/test-sign-in | What do preview and production answer — a refusal, or nothing at all? | Q23 |
| shared/auth/test-sign-in | Does an unauthorised probe learn the test endpoint exists? | Q23 |
| shared/auth/test-sign-in | Is an action made after the follow refused, ignored, or applied to the open session? | Q28 |
| shared/auth/test-sign-in | Is a mixed-case tester address refused, as an earlier draft said, or acted on, as the spec's Case rule and SC-34 say? A - act on it, matched without regard to case, as Q25 does for the domain (recommended: A); B - refuse it and amend the Case rule. | Q51 |
| shared/auth/test-sign-in | Does a refused call read 403, as an earlier draft asserted? A - assert no status code until the design names one (recommended: A); B - assert 403 once the design says so. | Q48 |
| shared/auth/audit | Does a grant that changes nothing write an entry? The change's requirement says every grant is recorded; one blind case expects no entry. A - every grant writes an entry, as the requirement states; recommended: A. B - a grant that changes nothing writes none, as the unchanged trusted-product find does; the requirement's grant sentence changes. | Q49 |
| shared/auth/audit | May the QA token ban, grant, set a scoped role or create an account? Q39 says it never bans or grants; Q43, Q44 and the shipped code accept it for any staging tester except the admin-only one. A - it acts on any staging tester except the admin-only one, and Q39's wording is superseded; recommended: A. B - it captures, expires and clears only, and the other actions run through the workflow alone. | Q50 |
| shared/auth/audit | Is a refused endpoint ban on the trail, naming the caller's kind? A - yes, as a refused operator ban is; recommended: A. B - no. | Q46 |
| shared/auth/audit | Does the test endpoint have a create action for an address that never signed in? A - no; ban and grant create that account; recommended: A. B - yes, a create action. | Q47 |
| shared/auth/audit | Does the auditor see names on the test endpoint's entries, or only user ids? US2-TC4-1 says the auditor sees no names, and no scenario or decision states it. A - the auditor sees user ids only, as the entry rule states, and the no-names clause is dropped; recommended: A. B - the trail never shows names, and a scenario says so. | Q52 |
| shared/auth/audit | Does a ban that creates an account for a never-signed-in address write one entry naming `ban` or `created`? Q47 removed the create action, so US4-TC8-1 now bans and names `ban`. A - the entry names the action the call made, `ban`; recommended: A. B - the entry names `created`, the outcome of an account create. | Q53 |
| shared/auth/audit | Is there a test-endpoint action that finds an existing account without changing it, and so writes no entry? US-04-TC2 uses "create or find"; Q47 gives the endpoint no create action, and Q49 records every grant. A - retire US-04-TC2 until the endpoint has such an action; recommended: A. B - name the find action, its entry rule and its scenario, then rewrite the case. | Q54 |
