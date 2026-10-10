---
name: tcs-review
description: Review or walk a feature-tcs.md, domain-tcs.md, product-tcs.md or platform-tcs.md suite. Review is journey-led: prepare the suite, give product and walk context, present draft cases, and record human verdicts. Walk mode is read-only and shows walks one by one, then ungrouped cases. Use when QA asks to review, approve, sign off, understand, or manually walk test cases. Invoke as /tcs-review [walk] <capability-or-change|domain|journey|tc>.
---

# Reviewing Test Cases With QA

Follow `docs/governance/specs-to-test-cases.md` — **Review Contract** is the
invariant rule book; **Step 5**, **The File Header** and **How a Case Reads** hold the
properties, the statuses, and the house style
(`docs/governance/tcs-conventions.md`); a bold name below is a heading there.

Invoke as `/tcs-review [<capability-or-change>]` for verdict review or
`/tcs-review walk <capability-or-domain-or-journey-or-tc>` for read-only manual
walk orientation. Generating or updating a suite is `/spec-to-tcs` (`.cursor/skills/spec-to-tcs/SKILL.md`).
The reviewer decides, never this skill: present the case beside the spec, answer
what they ask, and record their words untidied — generation copies what they approve.

For a suite belonging to an OpenSpec change, start human QA after implementation
is deployed and available. Planning produces draft cases and QA2 reconciliation,
not human review verdicts; do not move its new cases to `actual` before the
implementation can be exercised. Use `/tcs-run-sheet` to record manual test
execution; a review classification is not a pass or fail result.

## Steps

0. **Read the rulebook and the conventions whole.**
   `docs/governance/specs-to-test-cases.md` and
   `docs/governance/tcs-conventions.md`, one read each, before anything else
   on every run.

1. **Get on a review branch before the first verdict.** Use
   `git switch -c tcs-review/<level>-<target>` from `main` whatever the suite
   holds, with `<level>` one of `feature`, `domain`, `product`, `platform`.
   Use this skill's preparation and landing sequence, label the pull request
   `documentation`, and push the branch before the first verdict:
   the remote branch or its open pull request is the `in-review` signal. Never
   write `in-review` into the file, and never write verdicts on `main`.

2. **Find the suites awaiting review.** Search `openspec/specs/**/feature-tcs.md`,
   `openspec/specs/**/domain-tcs.md`, `openspec/specs/*/product-tcs.md` and
   `openspec/specs/platform-tcs.md`, plus the first two under
   `openspec/changes/*/specs/`, never `openspec/changes/archive/`. A suite is
   awaiting review when its `**Status:**` is `pending-review` or any case is
   `**Status:** draft`. Narrow to the argument when given. Before opening one,
   check `gh pr list --state open --search "<capability>"` or `git ls-remote
   --heads origin "tcs-review/*-<target>"` and report who is in it and on
   which journey — information, never a refusal.

3. **Complete the level stack first.** Levels run top down — see **Levels** and
   **Review Contract** in the governance document — so look at what sits above
   the suite named:

   | Level above | The suite itself | Do |
   | --- | --- | --- |
   | missing | missing | Offer to derive both, top down, before any review starts |
   | missing | present | Offer to derive the level above; do not review the lower suite this run |
   | present | missing | Offer to derive it, covering what the level above does not own |
   | present | present | Review it, once both are current (step 5) |

   A `product` or `platform` suite is a curated seam pass, not a fixed-size
   inventory: review whether each important seam and critical path has a
   representative case. When a domain's last
   feature suite reaches `approved` and its `domain-tcs.md` still holds
   drafts, offer it next, and the same upward.
   **Never derive silently** — say which file, level, journeys and roughly
   how many cases, and wait for a yes. Generation is `/spec-to-tcs`'s work,
   lands as its own `test(<domain>): derive <capability> test cases` commit
   before the first verdict, and writes `draft` only. Never author another
   capability's journeys — a sibling with no `user-journeys.md` is the spec
   author's gap; report it and stop.

4. **Pick one suite.** None: say so, name where suites live, offer
   `/spec-to-tcs <capability-or-change>`. One: say which and start, no menu.
   More: list `reopened` suites first, then `pending-review`: capability or
   change, path, file status and `actual/(total - deprecated)` progress, then ask.
   Overlay `in-review` when step 2 found its remote branch or pull request. One suite per run
   unless the reviewer asks to continue.

5. **Prepare before you present anything,** as `## Preparing the Suite` below
   lays out, in its order, each part its own commit, and one push when it is
   all done, before the first journey. The `rev` table under **Naming** says
   what each status allows: `draft` freely, `actual`
   still `manual` on the reviewer's yes, `automated` and `deprecated` never.

6. **Open the suite and its journeys together.** Read the whole suite and the
   `spec.md` beside it end to end — above feature level, every `user-journeys.md`
   its traces name and the matching `docs/prds/` pages. Determine the review
   mode from the suite, not the person's identity: a suite without a current
   `**Reviewed:**` line needs a full orientation; a previously reviewed suite
   needs a delta walkthrough for changed journeys and a short refresher. The
   repository cannot prove whether the same human is reviewing again.
   Give the reviewer a suite-level product walkthrough before the first
   verdict: who is acting, where the journey starts, what the product is
   expected to do, which outcome ends it, and which higher or lower suite owns
   the adjacent path. Explain TCS concepts just in time — anchor, outcome
   grouping, partition, row, formal `Trace`, post-hoc `covers`, and status —
   using the current suite. Prefer a narrated route from product documents;
   a live route is orientation only and never changes the requirement or
   produces a test result.

7. **Review one journey at a time,** in file order: explain the product route
   for that journey, show all walk context
   that references it, then present every `draft` case in full — id and title,
   classification block, pre-conditions, test data, steps, expected results —
   and `actual` or `deprecated` cases by id and title only. A case preparation
   changed carries a one-line note of what changed — steps filled, a result
   sharpened, a value changed, a row added — with test data called out apart
   from the rest. Scenarios are
   offered, never quoted unasked; when asked, quote the whole clause from
   `spec.md`. Before asking for verdicts, report duplicates — **A Case That
   Already Exists Is Not Written Twice**, against the journey and the domain
   suite's `actual` cases — name the pair, quote both expected results, and
   ask; never merge or drop on your own. Then ask and wait. **Echo before you
   write:** repeat the ids about to be marked and what each becomes; "all
   good" covers the cases just shown and nothing else. **A verdict never
   carries forward:** ask again for the next journey. Moving on from a journey
   whose cases changed, commit that journey's verdicts and edits as one
   commit; never push between journeys.

8. **Answer their questions from the spec,** quoting the requirement or
   scenario clause by id. When the spec does not answer, say so — a gap for
   the spec's author, recorded at close — never how the product probably
   behaves. Never talk the reviewer out of a doubt; a doubted case is wrong
   until the spec says otherwise. "How do I run this" means the case fails
   **Executable without asking**: answer from the spec's flow, `ui-design.md`,
   the PRD and the conventions' `## Setup Recipes`, and offer the answer as
   an edit to the case — a Change verdict like any other. A doubt about the
   journey itself is a finding for the spec's author, as **Journeys are the
   author's** says; never edit `user-journeys.md`.

9. **Add a case the reviewer asks for** only where the anchor it traces already
   carries the behaviour — otherwise it is a new requirement, routed to the
   spec's author.
   Check the journey, the file, then the domain suite for one that covers it;
   on a hit show both and ask: update, add as distinct, or drop. Write it as
   `draft` at the next unused `TC<m>`, `rev=1`, and walk it like any
   other draft — never straight to `actual`, even dictated. Record what
   distinguishes a case added over a duplicate.

10. **Record each verdict in the file as you go**, re-reading it from disk
   immediately before each write.

   | Verdict | Write |
   | --- | --- |
   | Approve | `**Status:** actual`, unchanged otherwise |
   | Change | Exactly the edit asked for, then ask again; approve only on their yes. An edit adding coverage the spec does not state goes to `spec.md` first, via `/spec-to-tcs` |
   | Defer | Leave `**Status:** draft` and note what they want resolved |
   | Retire | `**Status:** deprecated`, only when the spec no longer states the behaviour; never delete or renumber |

   Then recompute the header as **The File Header** says, comparing the file
   read before the verdict with the result: a lower approved share writes
   `reopened`; an equal share keeps `reopened`; a higher incomplete share writes
   `pending-review`; 100% writes `approved`; no active cases writes `retired`.
   Write the compact `actual/(total - deprecated)` ratio except on `retired`.
   `**Reviewed:** <today>, tcs-rules r<n>` is written fresh when the
   file reaches `approved`, and marked `, lapsed <today>` if it falls back; `**Drafts
   styled:**` dropped once no draft is left. Never type the status.

11. **Close the run and land the work.** Offer what the review taught, as
   `## What the Review Taught` below lays out. Before offering a convention,
   run `tcs-conventions.md`'s **Before Adding a Convention** gate; a conflict
   with the creation contract is reported as a core-rule finding, not written
   as a convention. Commit what follows from the accepted verdicts. Run
   `pnpm run tcs:validate` and fix what it names. Then push once and
   open the one pull request (`/pr-push`), titled with the range that has
   verdicts — `test(<domain>): approve <target> US<n>–<m> test cases` — its
   description listing every case the follow-ups changed, file by file. The
   file lands with the state transition and compact progress that step 10
   computed. The branch or pull request, not the file, is `in-review`.
   Say which journeys still hold drafts; when the file is
   `approved`, say the suite is ready to hand on. Report cases approved,
   edited, deferred and retired, the conventions confirmed and refused, the
   gaps and journey findings for the spec's author, and any other suite still
   awaiting review.

   **A reviewer who leaves midway** — **Leaving midway still lands**: commit
   what is done, push, and open the pull request with the journeys that have
   verdicts, then stop.

## Walk Mode

Invoke `/tcs-review walk <target>` when the goal is to help a human tester
understand or manually walk the suite rather than approve it. Walk mode is
read-only: it does not create a review branch, change a case status, or write a
run sheet.

- **Resolve the target** — accept a capability, domain, journey, or stable case id. A case target shows its owning journey and every walk that references it; a journey or broader target shows the matching suites in file order
- **Walk the product first** — give the same narrated product orientation as a first review, then explain only the TCS concepts needed by the selected material
- **Show walks one by one** — for each `## Walk`, show its starting state, shared test data, route, referenced case title and the complete result the tester must observe. Keep the case definition in its owning suite; the walk supplies the route, not a new assertion
- **Finish with ungrouped cases** — list the ungrouped case headers after the walks, state which have no walk reference, and ask which case or cases the tester wants to walk next. Do not silently invent a route
- **Keep the mode separate** — after the tester chooses an ungrouped case, show its own pre-conditions, data, steps and Expected Results; do not turn that choice into a verdict or add a walk without consent

## Preparing the Suite

Before the first journey, in this order. Each part is its own commit, named in
the review steps above; the branch is pushed once, when every part is done, so
the verdict commits hold only the reviewer's decisions.

1. **Migrate legacy case headings.** Before restyling or presenting a case,
   convert every legacy case heading in the selected suite to
   `### <scope>.TC-<sequence> (US<n>-TC<m>): <title>`. Keep the existing
   trace marker id, `rev`, local journey number, case number, title and case
   content unchanged. A case with no marker receives one through the trace
   CLI or a validated batch manifest; preserve its current `Trace` journey and
   preserve any existing `covers` links. If no links are present, leave the
   marker anchor-only for QA2; never derive links from scenario text or title
   similarity. If its formal anchor cannot be resolved, record the case as a
   preparation blocker for the suite owner rather than inventing a marker.
   After migration,
   within every journey group, including groups under `## Ungrouped`, preserve
   the order of non-deprecated cases and move every `deprecated` case to the
   bottom. This is a presentation-only reorder: it changes no purpose, status,
   id or `rev`. Migration and ordering are one preparation commit.

2. **Regenerate or restyle.** A suite whose `**Drafts styled:**` sits below
   `tcs_rules_rev` has its drafts regenerated, as **Rules Revisions** says,
   without asking and without narrating it: the levels above first, then the
   file from line 1 to its end, through `/spec-to-tcs`. `actual` cases are
   skipped; one whose behaviour or journey the new rule changes is shown and
   asked about, and goes back to `draft` only on a yes. A suite at the current
   revision has its drafts restyled to `docs/governance/tcs-conventions.md`
   instead.

3. **Check formal coverage by anchor.** Read every journey serving the suite
   and verify that each anchor has an asserting case or an explicit higher-level
   owner. A case that only names a journey without asserting an outcome does not
   count. Do not create a Cartesian product of values or add a case only because
   a scenario has a different input. Record same-purpose values as rows and
   report unresolved anchor gaps.

4. **Reconcile scenario links only after the independent readings.** When QA2
   material is present, compare each scenario's THEN with the reviewed case's
   Expected Results and add `covers` links through the trace workflow. One case
   may link several scenarios only when one route and one checking fully assert
   each. A case with no link remains anchor-covered and scenario-link-pending;
   never invent a link by title similarity. Record uncovered scenarios,
   over-claimed cases and contradictions for the spec owner.

5. **Fill in the mechanism.** Read the spec's flow requirement,
   `ui-design.md`, the PRD pages, and the conventions' `## Setup Recipes` and
   `## Where Things Are`. Bring every `draft` to **Executable without
   asking**: where to go, which control, what goes in, how a state is
   reached. Results may be sharpened into what a tester sees, as **A result
   may sharpen, never move** allows; a value that only stands for the rule
   may change within its class, as **A value is the rule, or stands for it**
   allows. Never the trace, never an assertion added or removed, never an
   outcome, never a value that is the rule. Where the spec gives no flow,
   leave the step and list it as a question for the reviewer. Where the flow
   disagrees with the case, classify it as **A flow that disagrees is
   classified, not fixed** says. List every case needing a mocked state whose
   Testability plans no `automation`. An `actual` case still `manual` is
   filled only on the reviewer's yes.

6. **Propose test data.** Rows the rule implies, as **Rows may add what the
   rule implies** says, each with the rule it traces. The reviewer takes or
   refuses each row; a taken row is written in. A row added to an `actual`
   case changes what it verifies: `rev` bumped, back to `draft`.

6. **Push, then summarise.** Push the branch once. Then one message before
   the first journey: the cases written for bare scenarios and the
   out-of-suite answers, the steps filled per case, the results sharpened,
   the values changed, the rows added and refused, the flow disagreements and
   how each was classified, the mocked states without automation, and the
   questions the spec could not answer. Test data is its own list. The
   regenerate is not narrated.

## What the Review Taught

When the verdicts are done, and before the pull request is marked ready:

- **Convention follow-up is conditional** — offer a convention only when a
  confirmed, reusable writing rule emerged. A case-specific edit, product fact,
  or style change with no reusable rule produces no candidate and no convention
  commit. A rule that changes coverage, ownership, traceability, lifecycle or
  validation is reported as a governance finding instead
- **A fact is not a candidate** — an edit that names one product's page,
  control, label, status value or behaviour, where a value is read, or how a
  state is reached stays in the case it was made to. It is not offered, and
  not mentioned; `## Setup Recipes` and `## Where Things Are` take no line
  from a review
- **One at a time** — the reviewer confirms, rewords or refuses each candidate.
  A confirmed line lands under `## Store-wide` as
  `- <YYYY-MM-DD>, <suite path>: <the rule>`; only a line worded in one
  domain's vocabulary is scoped narrower, saying why, and then the reviewer is
  asked which scope. A refused line lands under `## Refused` with the
  reviewer's reason
- **Never offered twice** — a candidate matching a `## Refused` line is not
  offered again; one that contradicts the rulebook is reported, not offered
- **Applied at once** — apply a confirmed line to the reviewed suite's
  remaining drafts and manual `actual` cases. A same-domain propagation may be
  a separately listed style-only follow-up, preserving purpose, Expected
  Results, Trace, status, test-data meaning and automation links; a semantic
  change waits for that suite's review. The pull request's description lists
  every propagated case
- **Follow-up commits** — `docs(governance): conventions from the <target>
  review`, then `test(<domain>): apply conventions from the <target>
  review`, batched by purpose; committed only, pushed with the rest when the
  process ends

## Closing a feature review

Before the file goes `approved`, do three things.

**Check the raised rows landed.** They are in the change's `decisions.md`,
under `## Raised`, one row per question the blind pass could not settle, each
owing a landing — a `Decisions` row in that file, or a ❓ on the capability's
PRD. A row with an empty landing is the pass's finding about to be lost, and it
is the reviewer's to chase before the suite is signed off. Where the change is
already archived, read the table there and check the landings it names still
stand.

Then do two things to the file's `## Reconciliation`.

**Walk the rejected rows with the reviewer.** Dropping a blind-pass finding as a
misreading is the cheapest way to finish a planning run, and a wrong rejection
leaves no trace afterwards. A row survives only if no rule anywhere states what
the case claimed.

**Copy each surviving rejection into `## Settled`** — one line, the claim and
why no rule states it, no scenario ids. The next blind pass reads that section,
so a rejection you agree with is answered once rather than raised by every run
from here on.

**Strip the scenario ids** from `## Reconciliation`, leaving the dispositions
and the reasons. Those ids
belong to the change's lifetime alone: the next blind pass reads this file for
id continuity, and an id left here is how it stops being blind.

A case carrying `**Blocked:**` is an open question, not a draft you are late in
reviewing. It stays `draft`, it does not hold the file's status against the
reviewer, and it is never resolved here — only by the person named on it.

## Never

- Never mark a case `actual`, or a file `approved`, without the reviewer's yes
  to a batch that case was in, having seen it in full
- Never edit a step, pre-condition or expected result into something the
  traced scenario does not say, even when asked; route it to `/spec-to-tcs`
  after the spec is fixed
- Never delete a case or a suite file; retirement is `deprecated`
- Never regenerate once the first verdict is written; regeneration is
  preparation, and a suite found badly out of date mid-review stops the review
  and goes back to `/spec-to-tcs`
- Never edit `user-journeys.md`; a journey finding goes to the spec's author
- Never write a line into `docs/governance/tcs-conventions.md` the reviewer
  did not confirm, and never fold preparation into a verdict commit
- Never push between journeys; push once after preparation, once when the
  process ends, and once if the reviewer leaves midway
- Never resolve, re-word or drop a case carrying `**Blocked:**`, and never
  reclassify a deferred finding as a rejected one — a question nobody could
  answer is not a misreading
- Never leave scenario ids in `## Reconciliation` on a file you approved
