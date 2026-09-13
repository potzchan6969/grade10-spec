---
name: tcs-review
description: Walk a QA reviewer through a pending feature-tcs.md, domain-tcs.md, product-tcs.md or platform-tcs.md suite one user journey at a time - every draft case in that journey together, with the spec's scenarios quoted on request - and record each verdict as actual, deprecated, or still draft. Use when QA asks to review, approve, or sign off test cases for a capability or an OpenSpec change. Invoke as /tcs-review [<capability-or-change>].
---

# Reviewing Test Cases With QA

Follow `docs/governance/specs-to-test-cases.md` — **The Review Lane** is this
skill's rule book; **Step 5**, **The File Header** and **What the approved
suites teach the next one** hold the properties, the statuses, and why review
comes first; a bold name below is a heading there.

Invoke as `/tcs-review [<capability-or-change>]`. Generating or updating a suite is `/spec-to-tcs` (`.cursor/skills/spec-to-tcs/SKILL.md`).
The reviewer decides, never this skill: present the case beside the spec, answer
what they ask, and record their words untidied — generation copies what they approve.

## Steps

0. **Read the rulebook whole.** `docs/governance/specs-to-test-cases.md`,
   one read, under 450 lines, before anything else on every run.

0. **Get on a review branch before the first verdict.** Names are the table in
   **The Review Lane**: `git switch -c tcs-review/<level>-<target>` from
   `main` whatever the suite holds, `<level>` one of `feature`, `domain`,
   `product`, `platform`; commits `test(<domain>): approve <target> US<n> test
   cases`; the pull request a draft, label `documentation`. Never write
   verdicts on `main`.

1. **Find the suites awaiting review.** Search `openspec/specs/**/feature-tcs.md`,
   `openspec/specs/**/domain-tcs.md`, `openspec/specs/*/product-tcs.md` and
   `openspec/specs/platform-tcs.md`, plus the first two under
   `openspec/changes/*/specs/`, never `openspec/changes/archive/`. A suite is
   awaiting review when its `**Status:**` is `pending-review` or any case is
   `**Status:** draft`. Narrow to the argument when given. Before opening one,
   check `gh pr list --state open --search "<capability>"` or `git ls-remote
   --heads origin "tcs-review/*-<target>"` and report who is in it and on
   which journey — information, never a refusal.

2. **Complete the level stack first.** Levels run top down — **Levels** and
   **Top down** under **The Review Lane** — so look at what sits above the suite named:

   | Level above | The suite itself | Do |
   | --- | --- | --- |
   | missing | missing | Offer to derive both, top down, before any review starts |
   | missing | present | Offer to derive the level above; do not review the lower suite this run |
   | present | missing | Offer to derive it, covering what the level above does not own |
   | present | present | Review it, once both are current (step 4) |

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

3. **Pick one suite.** None: say so, name where suites live, offer
   `/spec-to-tcs <capability-or-change>`. One: say which and start, no menu.
   More: list capability or change, path, file status and `draft` count out of
   the total, then ask. One suite per run unless the reviewer asks to continue.

4. **Restyle before you present anything.** **Restyle first** under **The Review Lane** and
   the `<v>` table under **Naming** say what each status allows: `draft`
   freely, `actual` still `manual` on the reviewer's yes, `automated` and
   `deprecated` never. Report what you restyled before the first journey; a
   behaviour change is `/spec-to-tcs`'s, not a restyle. A pre-condition the
   reviewer reshapes reads as **Who the Actor Is** has it —
   `customer(gold member) is on the shopping cart page`.

5. **Open the suite and its journeys together.** Read the whole suite and the
   `spec.md` beside it end to end — above feature level, every `user-journeys.md`
   its traces name and the matching `docs/prds/` pages — then orient the
   reviewer: capability, journeys, cases per journey, drafts.

6. **Walk the suite one journey at a time,** in file order, as **The Review
   Lane** describes: the story, every `draft` case in full — id and title,
   classification block, pre-conditions, test data, steps, expected results —
   and `actual` or `deprecated` cases by id and title only. Scenarios are
   offered, never quoted unasked; when asked, quote the whole clause from
   `spec.md`. Before asking for verdicts, report duplicates — **A Case That
   Already Exists Is Not Written Twice**, against the journey and the domain
   suite's `actual` cases — name the pair, quote both expected results, and
   ask; never merge or drop on your own. Then ask and wait. **Echo before you
   write:** repeat the ids about to be marked and what each becomes; "all
   good" covers the cases just shown and nothing else. **A verdict never
   carries forward:** ask again for the next journey.

7. **Answer their questions from the spec,** quoting the requirement or
   scenario clause by id. When the spec does not answer, say so — a gap for
   the spec's author, recorded at close — never how the product probably
   behaves. Never talk the reviewer out of a doubt; a doubted case is wrong
   until the spec says otherwise.

8. **Add a case the reviewer asks for** only from a scenario that accepts the
   journey — otherwise it is a new requirement, routed to the spec's author.
   Check the journey, the file, then the domain suite for one that covers it;
   on a hit show both and ask: update, add as distinct, or drop. Write it as
   `draft` at the next unused `TC<m>`, `<v>` at `1`, and walk it like any
   other draft — never straight to `actual`, even dictated. Record what
   distinguishes a case added over a duplicate.

9. **Record each verdict in the file as you go**, re-reading it from disk
   immediately before each write.

   | Verdict | Write |
   | --- | --- |
   | Approve | `**Status:** actual`, unchanged otherwise |
   | Change | Exactly the edit asked for, then ask again; approve only on their yes. An edit adding coverage the spec does not state goes to `spec.md` first, via `/spec-to-tcs` |
   | Defer | Leave `**Status:** draft` and note what they want resolved |
   | Retire | `**Status:** deprecated`, only when the spec no longer states the behaviour; never delete or renumber |

   Then recompute the header as **The File Header** says: `**Status:**` from
   the cases; `**Reviewed:** <today>, tcs-rules r<n>` added when and only
   when the file reaches `approved`, removed if it falls back; `**Drafts
   styled:**` dropped once no draft is left. Never type the status.

10. **Close the run and land the work.** Run `pnpm run tcs:validate` and fix
   what it names. Commit, push, and open the pull request even unfinished
   (`/pr-push`), titled with the range that has verdicts —
   `test(<domain>): approve <target> US<n>–<m> test cases`. Merge at journey
   boundaries: mark the PR ready and merge a finished journey while others
   are still `draft`; the file lands as `in-review`. Say which journeys hold
   drafts and whether the branch continues or a new one starts; when the file
   is `approved`, say the suite is ready to hand on. When the reviewer's edits
   repeated a theme, say those approved cases carry it into the next
   generation run, and point at the document as the place to write it as a
   rule. Report cases approved, edited, deferred and retired, the gaps for the
   spec's author, and any other suite still awaiting review.

## Never

- Never mark a case `actual`, or a file `approved`, without the reviewer's yes
  to a batch that case was in, having seen it in full
- Never edit a step, pre-condition or expected result into something the
  traced scenario does not say, even when asked; route it to `/spec-to-tcs`
  after the spec is fixed
- Never delete a case or a suite file; retirement is `deprecated`
- Never regenerate the suite mid-review; if it is badly out of date, stop and
  hand back to `/spec-to-tcs`
