reviewed: 61efc7448d56fec29b7f51e6d6eb66ab85f7a56b
source-identity: 7f4757d18a1a03c8580c113c56f0ae6238d42cdfb79512e04f362f8d3f2f8bfe
baseline-identity: 8fecd17d29c3b40f5a77081ff53c01b78f23534191230049eaa192af0ad17157
verdict: Not ready - 6 blockers

| # | Severity | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | blocker | `decisions.md:72` (Q50) against `decisions.md:105` (Raised row) | Q50 says the user decided "taking the recommendation", but the Raised row recommends A (the token acts on any staging tester but the admin-only one), and Q50's recorded answer is B (capture, expire and clear only). The spec (`test-sign-in/spec.md:47-51`), the page (`sign-in.md:159`, `:221`) and the audit cases all follow B. Which one the person chose is unknown. | Product manager | `decisions.md` Q50 after the person answers; then the spec, page and cases if the answer is A | open |
| 2 | blocker | `decisions.md:7` (Goals) and `decisions.md:12` (Non-Goals) against `decisions.md:63` (Q41), `test-sign-in/spec.md:500-504`, `sign-in.md:164-166` | The goals keep preview and production refused, and the non-goals rule out opening the endpoint on preview or production. Q41 opens production and preview for capture and clear, decided by agent. Q40, Q42 and Q45 also move scope (named testers, a sixth action, a modified audit capability) and are decided by agent. A row that moves scope or a non-goal is held for the product manager. | Product manager | `decisions.md` goals, non-goals and Q40, Q41, Q42, Q45 once answered | open |
| 3 | blocker | `proposal.md:14-16`, `proposal.md:32-34`, `proposal.md:54` against `test-sign-in/spec.md:500-504` and `sign-in.md:166`, `:189` | The proposal's acceptance signal and "Closed everywhere else" say preview and production are refused and production stays closed; its Impact names the staging worker only. The spec and page open production and preview for capture and clear, and uat for every action. One fact stated two ways. Line 29 of the same proposal already names a production collector. | Product manager | `proposal.md`, after finding 2 settles | open |
| 4 | blocker | `tech-design.md:72-82`, `:123-136`, `:228-241`, `:282-286`, `:333-339`, `:38-41` against `test-sign-in/spec.md` and `audit/spec.md` | The design does not deliver several requirements and states behaviour the spec contradicts. Missing: the QA token caller and its limits, the admin-only refusal, uat, production capture and clear, named testers, the scoped-role action, and the audit entries. Contradicted: a tester domain secret instead of named testers (Q40), staging alone with preview closed (Q41), five processors (Q42). Its Open Questions ask about tester-account removal, which Q21 settled. | Dev | `tech-design.md` | open |
| 5 | blocker | `audit/spec.md:7-9` ("SHALL each be recorded") against `decisions.md:75` (Q53), `audit/spec.md:44-48` (SC-42), `audit/feature-tcs.md` US4-TC8-1 ("one more entry") | A ban or grant that creates an account: the requirement records the creation and the ban each, so two entries. Q53 and US4-TC8-1 expect one entry naming `ban`. SC-42 says "one entry naming the caller's kind and the new user id", but not whether the ban entry is that entry or a second one. The entry count is stated two ways. | Product manager, then Dev | `decisions.md` Q53 (one entry or two), then the audit requirement and SC-42, then US4-TC8-1 | open |
| 6 | blocker | `sign-in.md:165`, `sign-in.md:171` against `test-sign-in/spec.md:164-167` | The page lets every action reach "the named testers and a unique plus-tag of one". The plus-tag line says a run generates a plus-tag "of a named tester". The spec counts a plus-tag of any named tester for capture, expire and clear only. Ban, grant and a scoped role take a plus-tag of the collector alone. The set of addresses ban and grant reach is stated two ways. | Product manager | `sign-in.md` Where It Opens and Testers | fixed f45903298 |
| 7 | fix | `test-sign-in/spec.md:50-51` (The token's limits), SC-95 at `:123-129` against `decisions.md:72` (Q50) and `test-sign-in/feature-tcs.md` US1-TC15 | Q50 refuses the token any ban, grant or scoped role, and TC15 tests a scoped-role refusal. The requirement and SC-95 refuse only a ban or a grant. A scoped role via the token is refused only by implication from "capture, expire and clear". | Dev | `test-sign-in/spec.md` The token's limits and SC-95 | open |
| 8 | fix | `audit/spec.md:7-16` against `audit/spec.md:50-54` (SC-43), `decisions.md:69` (Q46), `test-sign-in/spec.md:54-55`, `:133-135` | The requirement never says that a refused endpoint ban is recorded. SC-43 and Q46 say it is. It also does not settle which refused calls write an entry. A QA token off staging is refused "as any wrong caller", and a wrong caller has no kind to name. The test-sign-in "A refused call changes nothing" bullet does not mention the trail entry. | Dev | `audit/spec.md` requirement text; `test-sign-in/spec.md` A refused call | open |
| 9 | fix | `openspec/specs/shared/auth/audit/spec.md:3-13` (Purpose, Feature set) and `:30-35` (Ban, unban, set-role, and revoke are recorded) | After the fold, the durable Purpose and Feature set still name only operator acts, trusted-product writes and second-factor writes. The test endpoint's writes appear nowhere in them. The unchanged requirement still requires every ban entry to name the actor's user id and the roles the actor held. The new requirement replaces the user id with the caller's kind but says nothing about roles. | Dev | `audit/spec.md` delta: Purpose and Feature set lines, and a MODIFIED or explicit roles clause | open |
| 10 | fix | `sign-in.md:159` against `sign-in.md:160` and `tasks.md:13` (2.6); `decisions.md:65` (Q43) against `decisions.md:105` | An unmarked line says a token holder signs in as any tester "except the admin-only one". Task 2.6 has not shipped that, and the 🚧 line below it carries the same outcome. Q43 says the shipped token reaches any staging tester; the Q50 Raised row says it reaches every tester but the admin-only one. Neither confirms whether "Never ban or grant" is running today. | Product manager | `sign-in.md:159`: move the admin-only clause under 🚧, and mark the ban and grant refusal 🚧 if it has not shipped | open |
| 11 | fix | `tasks.md:13-15` against `test-sign-in/spec.md` SC-94 to SC-103 and `audit/spec.md` SC-40 to SC-45 | No task cites SC-94, SC-95, SC-96, SC-99, SC-100, SC-101, SC-102 or SC-103. Task 2.7 cites only audit SC-38 and SC-39. No task delivers the token's action limits (SC-95). | Dev | `tasks.md` | open |
| 12 | fix | `test-sign-in/feature-tcs.md` Reconciliation; `audit/feature-tcs.md` Reconciliation | No case covers 16 test-sign-in scenarios, and 13 more are only partly asserted. The fold of over-claimed TC5, TC14 and TC17 into scenarios has not landed. In the audit suite, only SC-39 and SC-45 are fully covered. A feature suite owes every scenario a case, or an `Out of suite` entry. | QA | both `feature-tcs.md` files, or `spec.md` for the folds | open |
| 13 | fix | `audit/feature-tcs.md` US1-TC9-1, US1-TC8-1, US4-TC8-1 against `test-sign-in/spec.md:158-159`, `decisions.md:31`, `:58` (Q9, Q35) | US1-TC9-1 bans and grants a `<target user id>`, but every action names an address. US1-TC8-1's steps name no address; QA2 noted this and left it. The title of US4-TC8-1 says "as created", but its expected result is `ban`. | QA | `audit/feature-tcs.md` | open |
| 14 | fix | `proposal.md:62`, `:92-98` | The References skip `audit.md`, which the change marks 🚧, and the Impact list leaves out the Audit Log page. Each reference link carries two fragments (`#staging-tests#who-may-call`). | Product manager | `proposal.md` | open |
| 15 | note | `sign-in.md:1-5` frontmatter | No page names `shared/auth/test-sign-in` in its `spec:` frontmatter, so the review manifest fell back to the linked pages. The capability's PRD is a section of the sign-in page. | Product manager | `sign-in.md`, if the manual should index it | open |
| 16 | note | `sign-in.md:218` | A stray `\| --- \|` row sits mid-table in Product decisions and renders as a row of dashes. | Product manager | `sign-in.md` | fixed f45903298 |
| 17 | note | `test-sign-in/feature-tcs.md` Reconciliation | The reconciliation still reports SC-100 as contradicted and asks Dev to correct it; commit 57f648ca8 already did. It also says Q48 and Q51 cite TC30 and TC13, but those rows cite no case. | QA | `test-sign-in/feature-tcs.md` | fixed f45903298 |
| 18 | note | `audit/spec.md:19`, `:26`, `:32`, `:39`, `:51`, `:57`, `:64` | The endpoint scenarios serve US-01, "Operator's identity action is recorded", but the actor is the test endpoint, not an operator. The test-sign-in suite names a QA agent as actor, though its journeys say nobody walks it. The proposal's follow-on already tracks this. | Product manager | `audit/user-journeys.md`, or the follow-on | open |

## Closed Rows

QA2 or the round closed these Raised rows on its recommendation; any one reopens with one reply:

- **Q46** - a refused endpoint ban is on the trail. Source: the audit page's "Refusals too" line and the delta's requirement sentence
- **Q47** - no create action; ban and grant create the account. Source: Q20, Q30, Q42
- **Q48** - no status code asserted for a refusal until the design names one. Source: Q23
- **Q52** - the auditor sees user ids, not names. Source: `audit.md` Reading the Trail
- **Q53** - an account-creating ban names `ban`. Source: Q47 (see finding 5)
- **Q54** - US-04-TC2 retired; no find action. Source: Q47, Q49

## Human Input

### Questions

1. **QA token actions** - Which did you choose for Q50: may the QA token only capture, expire and clear, or may it also ban, grant and set a scoped role on any staging tester but the admin-only one?
   - **A - Capture, expire and clear only - Recommended** - Matches the spec, the page and the repaired audit cases. Only Q50's "taking the recommendation" wording changes. A committed secret cannot change roles.
   - **B - Every action but on the admin-only tester** - The Raised row's recommendation. The token's limits, SC-95, the page lines `sign-in.md:159` and `:221`, and four audit cases have to be rewritten.
   - **Why it matters** - Anyone who reads the repository holds the token, so this sets what any reader can do to a staging account.
   - **Blocks** - Acceptance. Task 2.6 and the token's audit rows.
   - **Reasons** - `decisions.md:72` says "Decided by the user, taking the recommendation". `decisions.md:105` recommends A, and A is the opposite of the recorded answer.
2. **Production and the agent-decided scope rows** - Do you confirm opening the test endpoint on production and preview for capture and clear on the production collector (Q41), and the agent decisions Q40, Q42 and Q45?
   - **A - Confirm, and rewrite the goal and non-goal - Recommended** - The record follows what shipped. Goals line 7 and non-goal line 12 change, and the proposal follows.
   - **B - Keep production and preview closed** - The goal and non-goal stand. The spec's Production bullet, SC-24, SC-101, SC-102, the page's Where It Opens and Closed sections and task 2.1 change, and the shipped production capture becomes a fix in grade10.
   - **Why it matters** - A capture on production returns a working sign-in link for the production collector's account.
   - **Blocks** - Acceptance, and findings 3 and 4.
   - **Reasons** - `decisions.md:12` lists "Opening this endpoint on preview or production" as a non-goal. `decisions.md:63` records it as "Decided by agent: as shipped".
3. **Entries for an account-creating ban** - When a ban or a grant creates the account for an address that never signed in, does the trail hold one entry naming the action, or two entries (the creation, then the action)?
   - **A - One entry naming the action - Recommended** - Matches Q53 and US4-TC8-1, since the endpoint has no create action. Only the requirement's "each" sentence and SC-42 change.
   - **B - Two entries** - Matches the requirement as written. Q53, SC-42 and US4-TC8-1 change.
   - **Why it matters** - An auditor reads how a staging user id appeared from these entries.
   - **Blocks** - Acceptance (finding 5).
   - **Reasons** - `audit/spec.md:7-9` against `decisions.md:75`.

## Coverage

| Source or dependency | Checked identity | Checks applied | Carried from |
| --- | --- | --- | --- |
| Gate: `pnpm plan:review-preflight add-staging-auth-test-door --json` | exit 0, sourceIdentity 7f4757d1…, no overlaps, scoped expansion to accounts, audit, sign-in pages | evidence | caller receipt, rerun once for detail |
| Gate: `pnpm accept:preflight add-staging-auth-test-door` | exit 0, fingerprint 9d3b4ac57919b4fe8427991d38ea4aadc2f7cb8531a47eead9eda0674dafc7f9, baseline 8fecd17d…; Purpose drift checked from 28f746273 only | evidence | caller receipt, rerun once for detail |
| Gate: `pnpm check:manual` | 0 failures; no warning on sign-in, audit or accounts pages | Warnings | caller receipt, filtered rerun |
| `proposal.md` | f632b8aa46 | Page to delta, Same facts | none |
| `decisions.md` | 1d78a63dd0 | Nothing open, Same facts | none |
| `tech-design.md` | ccd5df5191 | Designs | none |
| `tasks.md` | 0b6d2e8bac | Journeys and cases (task coverage) | none |
| `.openspec.yaml` | 4783f464f3 | evidence | none |
| `specs/shared/auth/test-sign-in/spec.md` | c472fdeb3c | Page to delta, Same facts, Folded result (new capability) | none |
| `specs/shared/auth/test-sign-in/user-journeys.md` | c660359a08 | Journeys and cases | none |
| `specs/shared/auth/test-sign-in/feature-tcs.md` | b39c8cc16e | Journeys and cases (QA2 dispositions, draft status) | QA2 reconciliation, checked not repeated |
| `specs/shared/auth/audit/spec.md` | d04bc69ebe | Page to delta, Same facts, Folded result | none |
| `specs/shared/auth/audit/user-journeys.md` | aa79425a60 | Journeys and cases | none |
| `specs/shared/auth/audit/feature-tcs.md` | eb6e77e349 | Journeys and cases (QA2 dispositions, draft status) | QA2 reconciliation, checked not repeated |
| `docs/prds/products/grade10-site/account/sign-in.md` (intro, Staging Tests, decisions rows) | a21be35e19 | Page to delta, Same facts, Nothing open | none |
| `docs/prds/products/grade10-site/account/audit.md` | 0dab58ad69 | Page to delta, Same facts | none |
| `docs/prds/products/grade10-site/account/accounts.md` (Tests) | 25f507abcb | Page to delta | none |
| `openspec/specs/shared/auth/audit/spec.md` | 9cc3956b88 | Folded result | none |
| `openspec/specs/shared/auth/audit/user-journeys.md` | 6145774357 | Journeys and cases | none |
| `openspec/specs/shared/auth/audit/feature-tcs.md` | 950820bf21 | Fold target (US4-TC2-1 present) | none |
| Overlapping changes on `shared/auth/audit`, `shared/auth/test-sign-in` | none found at 61efc7448 | Overlap | none |
| `shared/auth/sign-in`, `shared/auth/users`, `shared/auth/roles` | not opened | consumers named by reference only; no outcome they own changes | none |
