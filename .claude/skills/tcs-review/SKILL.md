---
name: tcs-review
description: Walk a QA reviewer through a pending feature-tcs.md, domain-tcs.md, product-tcs.md or platform-tcs.md suite one user journey at a time - first preparing it (regenerate or restyle, cover every scenario by claim, fill in how to run each case, propose test data), then every draft case in a journey together, with the spec's scenarios quoted on request - record each verdict as actual, deprecated, or still draft, and end by offering the writing rules the review taught as conventions. Use when QA asks to review, approve, or sign off test cases for a capability or an OpenSpec change. Invoke as /tcs-review [<capability-or-change>].
---

# Reviewing Test Cases With QA

Follow `docs/governance/specs-to-test-cases.md` — **The Review Lane** is this
skill's rule book; **Step 5**, **The File Header** and **How a Case Reads** hold the
properties, the statuses, and the house style
(`docs/governance/tcs-conventions.md`); a bold name below is a heading there.

Invoke as `/tcs-review [<capability-or-change>]`. Generating or updating a suite is `/spec-to-tcs` (`.cursor/skills/spec-to-tcs/SKILL.md`).
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

1. **Get on a review branch before the first verdict.** Names are the table in
   **The Review Lane**: `git switch -c tcs-review/<level>-<target>` from
   `main` whatever the suite holds, `<level>` one of `feature`, `domain`,
   `product`, `platform`; commits, pushes and the one pull request as that
   table says, label `documentation`. Push the branch before the first verdict:
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

3. **Complete the level stack first.** Levels run top down — **Levels** and
   **Top down** under **The Review Lane** — so look at what sits above the suite named:

   | Level above | The suite itself | Do |
   | --- | --- | --- |
   | missing | missing | Offer to derive both, top down, before any review starts |
   | missing | present | Offer to derive the level above; do not review the lower suite this run |
   | present | missing | Offer to derive it, covering what the level above does not own |
   | present | present | Review it, once both are current (step 5) |

   A `product` or `platform` suite is a smoke pass, every case `**Suites:**
   smoke`: review whether the seam holds, not coverage. When a domain's last
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
   all done, before the first journey. **Prepare first** under **The Review Lane** and the `<v>` table
   under **Naming** say what each status allows: `draft` freely, `actual`
   still `manual` on the reviewer's yes, `automated` and `deprecated` never.

6. **Open the suite and its journeys together.** Read the whole suite and the
   `spec.md` beside it end to end — above feature level, every `user-journeys.md`
   its traces name and the matching `docs/prds/` pages — then orient the
   reviewer: capability, journeys, cases per journey, drafts.

7. **Walk the suite one journey at a time,** in file order, as **The Review
   Lane** describes: the journey, every `draft` case in full — id and title,
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
   `draft` at the next unused `TC<m>`, `<v>` at `1`, and walk it like any
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
   `## What the Review Taught` below lays out, and commit what follows from
   it. Run `pnpm run tcs:validate` and fix what it names. Then push once and
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

## Preparing the Suite

Before the first journey, in this order. Each part is its own commit, named in
**The Review Lane**'s table; the branch is pushed once, when every part is
done, so the verdict commits hold only the reviewer's decisions.

1. **Regenerate or restyle.** A suite whose `**Drafts styled:**` sits below
   `tcs_rules_rev` has its drafts regenerated, as **Rules Revisions** says,
   without asking and without narrating it: the levels above first, then the
   file from line 1 to its end, through `/spec-to-tcs`. `actual` cases are
   skipped; one whose behaviour or journey the new rule changes is shown and
   asked about, and goes back to `draft` only on a yes. A suite at the current
   revision has its drafts restyled to `docs/governance/tcs-conventions.md`
   instead.

2. **Check coverage by claim.** **Coverage is checked by claim** holds the
   rule. Read every scenario serving the suite's journeys and find the case
   whose expected results assert its THEN; a case that only traces the
   journey does not count. A scenario no case asserts gets a new `draft` at
   the journey's next unused `TC<m>`, `<v>` at `1`, without asking — it is
   walked like any other draft. A journey with no case at all is covered the
   same way. List the scenarios under `**Out of suite:**` and ask whether to
   write a case for each; write one only on a yes, and take its id off the
   list.

3. **Fill in the mechanism.** Read the spec's flow requirement,
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

4. **Propose test data.** Rows the rule implies, as **Rows may add what the
   rule implies** says, each with the rule it traces. The reviewer takes or
   refuses each row; a taken row is written in. A row added to an `actual`
   case changes what it verifies: `<v>` bumped, back to `draft`.

5. **Push, then summarise.** Push the branch once. Then one message before
   the first journey: the cases written for bare scenarios and the
   out-of-suite answers, the steps filled per case, the results sharpened,
   the values changed, the rows added and refused, the flow disagreements and
   how each was classified, the mocked states without automation, and the
   questions the spec could not answer. Test data is its own list. The
   regenerate is not narrated.

## What the Review Taught

When the verdicts are done, and before the pull request is marked ready:

- **Only a writing rule is a candidate** — each Change the reviewer asked
  for, each "how do I run this" answer written into a case, each row taken or
  refused, is read for the rule it suggests about how a case is written: a
  title, a step, a result, a pre-condition, a placeholder, a test-data value,
  an actor, the case's shape. One line each: what changed, and the rule
- **A fact is not a candidate** — an edit that names one product's page,
  control, label, status value or behaviour, where a value is read, or how a
  state is reached stays in the case it was made to. It is not offered, and
  not mentioned; `## Setup Recipes` and `## Where Things Are` take no line
  from a review
- **One at a time** — the reviewer confirms, rewords or refuses each. A
  confirmed line applies everywhere and lands under `## Store-wide` as
  `- <YYYY-MM-DD>, <suite path>: <the rule>`; only a line worded in one
  domain's vocabulary is scoped narrower, saying why, and then the reviewer is
  asked which scope. A refused line lands under `## Refused` with the
  reviewer's reason
- **Never offered twice** — a candidate matching a `## Refused` line is not
  offered again; one that contradicts the rulebook is reported, not offered
- **Applied at once** — as the conventions file's rule on applying a
  confirmed line says: the reviewed file's remaining drafts and its `actual`
  cases still `manual`, then the `actual` cases still `manual` in every other
  suite in the same domain folder, skipping one with an open `tcs-review/*`
  branch or pull request. Unasked, and not narrated in the conversation: the
  pull request's description lists what changed
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
