## Goals

- A member can save their card to Google Wallet and Apple Wallet in the real
  deployment, once each wallet's account is enrolled.
- An operator ends the pass on a member's lost phone from the member's record,
  and the audit trail shows who did it.
- The launch check fails on a deployment that cannot issue a pass.

## Non-Goals

- NFC, in either wallet.
- Spending or collecting from an Apple pass.
- A save action in the welcome message.
- A pass for ZZZ.

## Decisions

Recovered at the acceptance review, 2026-10-06, from the page and the shipped
code in grade10; each row names where it is carried.

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Who is operator ending for? | A member whose phone is gone and who cannot reach their own page - the page's Operator ending line, the journey, and `packages/grade10-store/backend/src/trpc/routers/admin.ts:459-460` in grade10 | Any member who asks - their own page already ends a pass in one action |
| Q2 | Which grant does the ending need? | `store:write`, the grant that already shows any member's live till code from the same record; ending a pass is less than handing out a code, and the member adds a new pass in a tap. Staff hold it as well as admins - the requirement, the page's Product decisions, `packages/grade10-store/backend/src/trpc/routers/admin.ts:501` and `apps/admin/grade10/src/pages/members/MemberRecord.tsx:92-96` in grade10 | Admin only - staff already hand out a live code from the same record; a new wallet grant - one nobody holds |
| Q3 | How many wallets does one act end? | One - the requirement, `packages/grade10-store/backend/src/trpc/routers/admin.ts:497-499` in grade10 | Every wallet at once - it takes away a pass nobody asked about |
| Q4 | How does the operator know which wallet to end? | The record names the wallets the member carries a live pass in - the requirement, `packages/grade10-store/backend/src/trpc/routers/admin.ts:463-473` in grade10 | Asking the member over the phone - a guessed wallet ends nothing while the real pass goes on identifying them |
| Q5 | What does an operator without `store:write` see and get? | The record offers neither the wallets nor the ending, the wallets are read only under `store:write`, and a direct attempt is refused as forbidden while the pass stays live - the requirement, the page's Operator ending line, `apps/admin/grade10/src/pages/members/MemberRecord.tsx:165-185` in grade10 | Showing the wallets to every operator who reads the store - a list nobody holding it can act on |
| Q6 | Where is the ending recorded? | The audit trail, through the elevated ladder: the operator, the member, the wallet and the time - the requirement | A wallet log of its own - a second record of one act |
| Q7 | What does ending a wallet with no live pass do? | Ends nothing, and says nothing was held - the requirement, `packages/grade10-store/backend/src/trpc/routers/admin.ts:517` in grade10 | Reporting it ended - an operator would believe a live pass was gone |
| Q8 | Where is the enrolment run from? | The page's Setting Up runbook, in its order; groups 5 and 6 follow it step for step | A runbook in the change - two copies drift, and this one archives |
| Q9 | Does `pnpm run secrets --check` prove the launch? | Only once each wallet secret is expected where `packages/app-env` records that wallet's issuer for the brand and environment, and `WALLET_APPLE_APNS_KEY` only where the Apple issuer records an APNs key id. Every wallet secret is optional today, so the check passes with none set - the page's Launch Check line and the requirement 'A half-configured wallet says which secret is missing' | Running the check as it stands - it passes on a deployment that cannot issue a pass |
| Q10 | Does Apple's step set a new `WALLET_PASS_KEY`? | No: it reuses the value Google set, and is never given a new one once a pass exists - the page's Apple runbook | A fresh key per wallet - the two wallets share one key, and a new value re-issues every pass |
| Q11 | What is the change measured on? | Passes saved per week, per wallet, once that wallet is enrolled - the page's Product decisions | Passes live - it counts passes on phones nobody uses |
| Q12 | Does the save action draw each wallet's own artwork - Apple's "Add to Apple Wallet" badge and Google's "Add to Google Wallet" button - in place of the card's text button? | ❓ Designer - recommended: (a) yes, both vendors' brand guidelines expect it; the artwork reaches `WalletPassLinks` as consumer content through a contract change naming the export and the Grade10 site | (b) keep the text button and drop task 6.5 |
| Q14 | Does an operator ending take a typed reason? | No. The cause is always the lost phone (Q1), the act moves no value, and the member adds a new pass in a tap - the page's Product decisions, and `packages/grade10-store/contracts/src/pos.ts:393-396` in grade10, which takes none | A typed reason, as moving points takes - a box filled with the same words every time |
| Q15 | Is the member told when an operator ends their pass? | No. The member asked for it, and their own page shows the wallet no longer held - the requirement, the page's Operator ending line and Product decisions, and `packages/grade10-store/backend/src/services/wallet/passes.ts:446-458` in grade10, which sends nothing | A message to the member - it tells them what they asked for |
| Q16 | Is an ending that ended nothing recorded? | Yes, as an attempt that ended nothing: the ladder records every elevated act, and the entry carries the outcome - the requirement and the page's Operator ending line. The shipped entry carries the input alone (`packages/worker/src/trpc.ts:433-442` in grade10), so group 2 adds the outcome | Leaving it off the trail - an operator's act on a member goes unrecorded; the input alone - an auditor reads an ending that did not happen |
| Q17 | May an operator end a pass on their own member record? | Yes, nothing bars it. Their own page ends it in one action anyway; Users bars a role move on one's own account because it widens what they may do, and an ending widens nothing - the page's Product decisions | A bar on one's own record - it guards nothing the member's own page does not allow |
| Q18 | Does the record ask the operator to confirm? | Yes, naming the wallet; declining ends nothing - the requirement, the page's Operator ending line, and `apps/admin/grade10/src/pages/members/MemberRecord.tsx:96-108` in grade10 | Ending on the click, as the member's own does - the operator acts on a member's word, and an ended pass is replaced, never restored |
| Q19 | Which case proves the first goal, a member saving a pass on the enrolled deployment? | The durable suite's `grade10-site-store-wallet-member-card-US6-TC1-1`, walked on each wallet in staging by task 8.3 once group 7 is done | A journey in this change - saving a pass is US-06's, which this change leaves as it is |
| Q20 | Is an ending refused for want of `store:write` recorded in the audit trail? | No. The refusal stops before the act, and the elevated ladder records only acts that ran, for every elevated act in every service (`packages/worker/src/trpc.ts:407-419` in grade10). Whether refusals are recorded is the Audit Trail's rule for all of them - Q16's attempt is an act that ran and found nothing | Recording it for this act alone - one refusal on the trail while every other elevated act's refusal leaves none |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/store/wallet-member-card | R1. Acceptance review: should the save action draw each wallet's own artwork instead of a text button? Options: (a) yes, through a `WalletPassLinks` contract change; (b) no, and task 6.5 is dropped. Recommended: (a). Owner: Designer | ❓ Q12, and ❓ on wallet-member-card.md · Setting Up, Google step 9 and Apple step 10 |
| grade10-site/store/wallet-member-card | R2. Acceptance review: does a second brand issuing Apple passes enrol under the same Apple Developer team? Options: the same team and organisation name, or a separate enrolment. Recommended: the same team, unless the brand is a separate legal entity. Owner: Product | ❓ on wallet-member-card.md · Standing Obligations, Product's. Not this change's: only Grade10 issues a pass here, and a pass for ZZZ is a non-goal |
| grade10-site/store/wallet-member-card | R3. QA1 blind pass: does an operator ending take a typed reason? Moving points by hand carries one to the audit trail; the page records who, which wallet and when, and names no reason | Q14 |
| grade10-site/store/wallet-member-card | R4. QA1 blind pass: is the member told when an operator ends their pass? The page says the pass ends at once and the audit trail records it, and is silent on any message to the member | Q15 |
| grade10-site/store/wallet-member-card | R5. QA1 blind pass: is an ending that ended nothing recorded in the audit trail? Q7 says it ends nothing and says so; Q6 names what an ending records, never whether an act that ended nothing is one | Q16 |
| grade10-site/store/wallet-member-card | R6. QA1 blind pass: may an operator end a pass on their own member record? Users bars an operator's role moves on their own account; the page is silent on the wallet ending | Q17 |
| grade10-site/store/wallet-member-card | R7. QA1 blind pass: does the record ask the operator to confirm before ending? The member's own ending is immediate; the page names no confirmation for the operator's, and an ending cannot be undone, only replaced by a new pass. Owner: Designer | Q18 |
| grade10-site/store/wallet-member-card | R8. QA1 blind pass: which case proves the first goal, a member saving a pass on the enrolled deployment? The change's journeys carry only the operator ending, so no case here walks the save; it is either a journey this change carries, or verified by the runbook's device proof and named there | Q19 |
| grade10-site/store/wallet-member-card | R9. QA1 blind pass: is an ending refused for want of `store:write` recorded in the audit trail? Q16 records every elevated act, and an attempt that found no live pass as ending nothing; the page says only that the act is refused | Q20 |
