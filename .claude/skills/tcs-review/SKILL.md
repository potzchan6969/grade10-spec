---
name: tcs-review
description: Walk a QA reviewer through a pending feature-tcs.md, domain-tcs.md, product-tcs.md or platform-tcs.md suite one user journey at a time - every draft case in that journey together, with the spec's scenarios quoted on request - and record each verdict as actual, deprecated, or still draft. Use when QA asks to review, approve, or sign off test cases for a capability or an OpenSpec change. Invoke as /tcs-review [<capability-or-change>].
---

# Review a capability's test cases with QA

Follow `docs/governance/specs-to-test-cases.md` — it defines the properties,
the statuses, and why review comes before anything downstream reads a suite.
Read it in full
before the first run in a session.

Invoke as `/tcs-review [<capability-or-change>]`. Generating or updating a
suite is a different job: that is `/spec-to-tcs`
(`.cursor/skills/spec-to-tcs/SKILL.md`).

This skill never decides a case is correct. The reviewer decides; you present
the case beside the spec that justifies it, answer what they ask, and record
what they say.

What you record outlives this run. A case marked `actual` — with whatever
wording the reviewer settled on — is the store's evidence of how a case
should read, and the next `/spec-to-tcs` run learns its conventions from
exactly those cases (see "What the approved suites teach the next one" in
`docs/governance/specs-to-test-cases.md`). So when a reviewer reshapes a
case's wording before approving it, write their words, not a tidied version
of them: the phrasing they approve is the phrasing generation will copy.

0. **Get on a review branch before the first verdict.** Verdicts are written
   to disk as you go, so the branch has to exist before you start, not when you
   stop.

   | | |
   | --- | --- |
   | Branch | `tcs-review/<level>-<target>` — `<level>` is `feature`, `domain`, `product` or `platform`; `<target>` is the capability, domain or product id, and `platform` carries none |
   | Commits | `test(<domain>): approve <target> US<n> test cases` |
   | PR title | `test(<domain>): approve <target> US<n>–<m> test cases` — widen the range as journeys land, since the branch name never says which you took |
   | PR label | `documentation`, opened as a draft |

   On `main`, create the branch first (`git switch -c`). Never write verdicts
   on `main`. Above roughly fifteen `draft` cases, offer to split by journey
   and take one journey per branch; below that, take the file.

1. **Find the suites awaiting review.** Search both trees, every level —
   `openspec/specs/**/feature-tcs.md`, `openspec/specs/**/domain-tcs.md`,
   `openspec/specs/*/product-tcs.md` and `openspec/specs/platform-tcs.md`, plus
   the first two under `openspec/changes/*/specs/`, never
   `openspec/changes/archive/`. A suite is awaiting review when its
   `**Status:**` is `pending-review`, or when any case in it has
   `**Status:** draft`. Narrow to the argument when one was given (a change
   name, a capability id, or a path).

   Before opening a suite, check whether someone else is already in it:
   `gh pr list --state open --search "<capability>"`, or
   `git ls-remote --heads origin "tcs-review/*-<target>"`. Report what you
   find — who, which journey — and let the reviewer decide. **This is
   information, never a refusal.** Nothing reserves a suite: two reviewers on
   different journeys of one file is a supported way to work, and the file's
   status is derived precisely so the line they both touch merges without
   judgement.

2. **Complete the level stack before reviewing anything.** A suite is judged
   against the paths the levels above it already own, so a missing level above
   is not a detail to note in passing — it makes every judgement below it a
   guess. Before opening the suite the reviewer named, look at what sits above
   and beside it:

   | Level above | The suite itself | Do |
   | --- | --- | --- |
   | missing | missing | Offer to derive both, top down, before any review starts |
   | missing | present | Offer to derive the level above. Do not review the lower suite this run — it is judged against the higher one once that is approved |
   | present | missing | Offer to derive it, covering what the level above does not already own |
   | present | present | Review it, once both are current (step 4) |

   Levels run top down: `platform-tcs.md`, then that product's
   `product-tcs.md`, then a domain's `domain-tcs.md`, then the features under
   it. A level with no path to hold has no suite, and that absence is not a gap
   to raise. When the last feature suite in a domain reaches `approved` and
   that domain's `domain-tcs.md` still holds drafts, say so and offer it as the
   next run — and the same upward.

   **A `product` or `platform` suite is a smoke pass**, not coverage: a handful
   of long paths, every case `**Suites:** smoke`. Review it as such — the
   question is whether the seam still holds, not whether every scenario is
   covered, which is the feature suite's job.

   **Never derive silently.** Say which file you would write, at which level,
   from which journeys, and roughly how many cases it will hold — then wait for
   a yes. Generation is `/spec-to-tcs`'s work, it lands as its own commit with
   the `test(<domain>): derive <capability> test cases` message before the
   first verdict, and it writes `draft` and nothing else. `actual` still comes
   only from a human answering step 6.

   **Never author another capability's journeys.** Deriving a domain or
   platform suite reads every sibling `user-journeys.md`, and a sibling may not
   have one. That is a gap for the spec's author: report it and stop. Writing
   journeys for a capability the reviewer never named is PM's work done in QA's
   branch, on a file nobody asked you to open.

3. **Pick one suite:**

   | Found | Do |
   | --- | --- |
   | None | Say so plainly. Name where suites live and offer `/spec-to-tcs <capability-or-change>` to generate one. Stop. |
   | Exactly one | Say which one, and start reviewing it — no menu for a single choice. |
   | More than one | List them and ask which to take: capability or change name, path, file status, and how many cases are `draft` out of the total. Review one suite per run unless the reviewer asks to continue into the next. |

4. **Restyle before you present anything.** Bring the file to the current
   `tcs_rules_rev` first — the reviewer's attention belongs on coverage, not
   on wording the rules already settle. This is the minor path only: a major
   bump has already swept every suite in its own commit, so after one the file
   is current by construction. What may be re-worded depends on the
   case:

   | Case | Re-wording |
   | --- | --- |
   | `draft` | Restyle freely. `<v>` unchanged, status stays `draft`. |
   | `actual`, **Automation status:** `manual` | Offer the restyle; on their yes, re-word in place. `<v>` unchanged, stays `actual`. |
   | `actual`, **Automation status:** `automated` | Leave it exactly as it is. Its script asserts that wording; changing it is a behaviour change, not a restyle. |
   | `deprecated` | Never touched. |

   Report what you restyled before the first journey. A behaviour change is
   not a restyle: that is `/spec-to-tcs`, which rewrites the case, bumps its
   `<v>` and sets it back to `draft` for review.

   **When a reviewer reshapes a pre-condition, write it the way r3.0 has
   them:** the actor is `customer` or `admin`, with the state or grant the case
   needs in brackets — `customer(gold member) is on the shopping cart page`,
   `admin(shop staff) is on the loyalty member page`. Every other role the
   specs name is one of those two holding something.

5. **Open the suite and its journeys together.** Above feature level - a
   `domain-tcs.md`, `product-tcs.md` or `platform-tcs.md` - that is every
   `user-journeys.md` its traces name, plus the matching pages under
   `docs/prds/`; each of those cases composes two or more journeys, so read
   every one it names. Read the whole
   suite and the `spec.md` beside it, end to end, before the first
   question. You cannot answer "where does the spec say that?" from a
   truncated read. Then orient the reviewer: the capability, the journeys,
   how many cases each holds, and how many are `draft`.

6. **Walk the suite one journey at a time,** in file order. A journey is the
   unit of review: a reviewer holds a whole user flow in their head at once
   and judges its cases against each other — is anything missing, does the
   negative case belong here, do two of these say the same thing — which
   reading case by case makes impossible.

   Open the journey with its three-line story, then show **every `draft` case
   under it, in full**: id and title, the nine classification properties,
   pre-conditions, test data when it has any, numbered steps, and the
   expected-results list. Cases already `actual` or `deprecated` are listed by
   id and title only, so the reviewer sees the whole journey; they are not up
   for a verdict unless the reviewer asks to revisit one.

   **Do not quote the spec's scenarios unless asked.** The reviewer knows the
   journey, and a wall of Gherkin before every case buries the cases
   themselves. Close the journey by offering them instead — the scenario ids
   that journey's `**Accepted by:**` list names, and an invitation to ask for
   any of them, or for the scenarios behind one case. When they ask, quote the
   **whole clause** from `spec.md`, never a summary of it.

   **Report duplicates before asking for verdicts.** Compare the journey's
   cases against each other, and against the domain suite's `actual` cases:
   two cases asserting the same outcomes on the same surface from the same
   starting state are one case, however differently they are worded, as is one
   whose expected results are a subset of another's. A variation in data alone
   is a row, not a case. Name the pair, quote both sets of expected results,
   and ask — never merge or drop on your own. A feature case wholly covered by
   an `approved` domain case is a trim candidate; say so and let the reviewer
   decide.

   Then ask for the journey's verdicts and wait. The reviewer answers however
   suits them — "all good", "approve except TC3", "TC2: change the
   pre-condition to …, rest fine". Two rules make that safe:

   - **Echo before you write.** Repeat the exact case ids you are about to
     mark and what each becomes, and write only what they named. A blanket
     "approve all" approves the cases you just showed for *this* journey and
     nothing else — never a case from another journey, and never one you have
     not put in front of them.
   - **A verdict never carries forward.** Finishing one journey says nothing
     about the next. Ask again.

7. **Answer their questions from the spec.** A reviewer will ask why a case
   is `critical`, where a number came from, why two scenarios share one case,
   what happens in a case the suite does not cover. Answer by quoting the
   requirement or scenario clause, naming its id. When the spec does not
   answer it, say exactly that — it is a gap for the spec's author, recorded
   in step 7 — and never fill it with how the product probably behaves.
   Never talk the reviewer out of a doubt; if they think a case is wrong,
   the case is wrong until the spec says otherwise.

8. **Adding a case the reviewer asks for.** A reviewer may want a case the
   suite does not hold. Before writing it:

   - **Check the spec.** It must be built from a scenario that accepts this
     journey. A case with no scenario behind it is a new requirement in
     disguise: say so, and route it to the spec's author rather than into the
     file.
   - **Check for one that already covers it** — this journey's cases first,
     then the rest of the file, then the domain suite. On a hit, show the
     existing case in full beside what the reviewer described, and ask:
     update that case, add this one because it is genuinely distinct, or drop
     it because it is covered.
   - **Write it as a `draft`** at the next unused `TC<m>` under that journey,
     `<v>` at `1`, in the current style — then walk it like any other draft
     and take the reviewer's verdict. Never write a case straight to `actual`,
     even one the reviewer dictated.

   Record what the reviewer said distinguishes a case they added over a
   duplicate you raised, so the next run does not re-raise it.

9. **Record each verdict in the file as you go,** so an interrupted review
   is not lost. **Re-read the file from disk immediately before each write** —
   a session runs for hours, another reviewer may have landed a verdict in
   another journey, and writing back a copy held in memory would silently
   revert their work.

   | Verdict | Write |
   | --- | --- |
   | Approve | `**Status:** actual` on that case, unchanged otherwise. It becomes house-style evidence from that moment. |
   | Change | Apply exactly the edit they asked for — wording, a property, a data row — then ask again; approve only on their yes. An edit that would add coverage the spec does not state goes to `spec.md` first, via `/spec-to-tcs`, not into the case. |
   | Defer | Leave `**Status:** draft` and note what they want resolved. |
   | Retire | `**Status:** deprecated`, only when the spec no longer states that behaviour. Never delete the case, never renumber around it. |

   Then **recompute the file's header** from the cases, every time:
   `**Status:**` is `approved` when no `draft` remains, `in-review` when at
   least one `actual` or `deprecated` sits beside a `draft`, `pending-review`
   otherwise. Add `**Reviewed:** <today>, tcs-rules r<n>` — the revision the
   cases were approved under — when and only when the file reaches
   `approved`, and remove it if it ever falls back out. That revision is what
   lets the next `/spec-to-tcs` run tell a suite that teaches the current
   conventions from one frozen under older ones. Drop the
   `**Drafts styled:**` line once no draft is left. The status is derived; it
   is never a judgement you or the reviewer makes. `pnpm run tcs:validate`
   fails a file whose header and cases disagree.

10. **Close the run — and land the work.** When the last journey in scope has
   its verdicts, or the reviewer stops for the day:

   - Run `pnpm run tcs:validate` and fix anything it names before committing.
   - Commit the verdicts and push the branch. Ensure a draft pull request
     exists (`/pr-push`), so a day's progress is visible even mid-review.
   - **Merge at journey boundaries.** A finished journey is worth landing on
     its own: mark the PR ready and merge it even while other journeys of the
     same suite are still `draft`. The file lands as `in-review`, the approved
     cases are banked on `main`, and an interrupted review leaves its work
     where the next person will find it. Do not hold a whole 50-case suite on
     one branch waiting for completeness.
   - Say plainly what is left and where: which journeys still hold drafts, and
     whether the branch continues tomorrow or a new one starts.

   Then:
   - If every case in the file is now `actual` or `deprecated`, set the
     file's `**Status:**` to `approved` and say the suite is ready to hand on —
     that is the bar every downstream reader waits for.
   - If any case is still `draft`, leave `pending-review` and name what is
     outstanding.
   - When the reviewer's edits repeated a theme — the same rewording asked
     for on case after case — say so, and tell them those approved cases now
     carry that convention into the next generation run. If they want it
     written down as a rule rather than inferred, point at
     `docs/governance/specs-to-test-cases.md` as the place to amend.
   - Report: how many cases were approved, edited, deferred, retired; the
     gaps the review surfaced for the spec's author (a scenario no case
     covers, a case whose scenario has changed, a question the spec cannot
     answer); and any other suite still awaiting review.

**Never do these things:**

- Never mark a case `actual` — or a file `approved` — without the reviewer
  saying yes to a batch that case was in, having seen it in full.
- Never widen a batch. An approval covers the journey you just showed; it
  never reaches a case in another journey, one you skipped, or one the
  reviewer excluded by name.
- Never carry a journey's verdict into the next journey.
- Never bury the cases under scenarios the reviewer did not ask for.
- Never type a file status as a judgement. Recompute it from the cases after
  every verdict.
- Never write verdicts on `main`, and never hold a finished journey off `main`
  because the rest of the suite is unreviewed.
- Never refuse to open a suite because another branch or PR is touching it.
  Report it and let the reviewer decide.
- Never edit a step, precondition, or expected result into something the
  traced scenario does not say, even when the reviewer asks — that is a spec
  change; say so and route it to `/spec-to-tcs` after the spec is fixed.
- Never delete a case or a suite file. Retirement is
  `deprecated`.
- Never regenerate the suite from the spec mid-review. If it is badly out of
  date, stop and hand back to `/spec-to-tcs`.
- Never review under `openspec/changes/archive/`.
- Never derive a suite without naming what you would write and waiting for a
  yes, and never let generation and verdicts share a commit.
- Never write a `user-journeys.md` for a capability the reviewer did not name.
