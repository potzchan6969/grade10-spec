---
name: tcs-review
description: Walk a QA reviewer through a pending test-cases.md suite one case at a time, answering their questions from the spec and recording each verdict as actual, deprecated, or still draft. Use when QA asks to review, approve, or sign off test cases for a capability or an OpenSpec change. Invoke as /tcs-review [<capability-or-change>].
---

# Review a capability's test cases with QA

Follow `docs/governance/specs-to-test-cases.md` — it defines the properties,
the statuses, and what `approved` buys. Read it in full before the first run
in a session.

Invoke as `/tcs-review [<capability-or-change>]`. Generating or updating a
suite is a different job: that is `/spec-to-tcs`
(`.cursor/skills/spec-to-tcs/SKILL.md`).

This skill never decides a case is correct. The reviewer decides; you present
the case beside the spec that justifies it, answer what they ask, and record
what they say.

1. **Find the suites awaiting review.** Search both trees —
   `openspec/specs/**/test-cases.md` and
   `openspec/changes/*/specs/**/test-cases.md`, never
   `openspec/changes/archive/`. A suite is awaiting review when its
   `**Status:**` is `pending-review`, or when any case in it has
   `**Status:** draft`. Narrow to the argument when one was given (a change
   name, a capability id, or a path).

2. **Pick one suite:**

   | Found | Do |
   | --- | --- |
   | None | Say so plainly. Name where suites live and offer `/spec-to-tcs <capability-or-change>` to generate one. Stop. |
   | Exactly one | Say which one, and start reviewing it — no menu for a single choice. |
   | More than one | List them and ask which to take: capability or change name, path, file status, and how many cases are `draft` out of the total. Review one suite per run unless the reviewer asks to continue into the next. |

3. **Open the suite and its spec together.** Read the whole
   `test-cases.md` and the `spec.md` beside it, end to end, before the first
   question. You cannot answer "where does the spec say that?" from a
   truncated read. Then orient the reviewer: the capability, its sections
   (journeys, or requirements where the spec is exempt from journeys), how
   many cases each holds, and how many are `draft`.

   **Establish who is signing.** Ask the reviewer's GitHub handle before the
   first verdict — `git config openspec.handle` is a fair default to offer,
   but confirm it. Every verdict below is recorded under that handle with
   today's date; an unsigned verdict is the thing this review exists to
   prevent, and `check:manual` warns on it (rule `signed`).

4. **Walk the `draft` cases one at a time,** in file order, section by
   section. Cases already `actual` or `deprecated` are skipped unless the
   reviewer asks to revisit one. For each case, show:
   - its id and title, and the section it sits under;
   - its description, preconditions, test data, and every step with its own
     expected result;
   - its nine properties;
   - the **full text of every scenario it traces**, quoted from `spec.md`,
     so the reviewer compares the case against the requirement rather than
     against your summary of it.

   Then ask for that case's verdict — approve, change, defer, or retire —
   and wait. One case per question. Do not batch several cases into one
   approval, and do not carry a verdict forward to the next case.

5. **Answer their questions from the spec.** A reviewer will ask why a case
   is `critical`, where a number came from, why two scenarios share one case,
   what happens in a case the suite does not cover. Answer by quoting the
   requirement or scenario clause, naming its id. When the spec does not
   answer it, say exactly that — it is a gap for the spec's author, recorded
   in step 7 — and never fill it with how the product probably behaves.
   Never talk the reviewer out of a doubt; if they think a case is wrong,
   the case is wrong until the spec says otherwise.

6. **Record each verdict in the file as you go,** so an interrupted review
   is not lost:

   | Verdict | Write |
   | --- | --- |
   | Approve | `**Status:** actual` on that case, plus the reviewer line below. Unchanged otherwise. |
   | Change | Apply exactly the edit they asked for — wording, a property, a data row — then ask again; approve only on their yes. An edit that would add coverage the spec does not state goes to `spec.md` first, via `/spec-to-tcs`, not into the case. |
   | Defer | Leave `**Status:** draft` and note what they want resolved. |
   | Retire | `**Status:** deprecated` plus a `- **Retired:** <why>` bullet under it, plus the reviewer line. Never delete the case, never renumber around it. |

   **Every verdict is signed.** `actual` and `deprecated` carry, directly
   under the status (and the `**Retired:**` bullet where there is one):

   ```markdown
   - **Reviewed by:** @quinn - 2026-09-01
   ```

   The handle is the reviewer's, never yours, and the date is the day the
   verdict was given. A re-reviewed case gets the line replaced, not
   appended — the current verdict has one signer.

   **Retiring covers two verdicts, and the reason says which** — the spec no
   longer states the behaviour, or the reviewer finds the case redundant or
   aimed at the wrong thing:

   ```markdown
   - **Status:** deprecated
   - **Retired:** redundant with `loyalty-TC-12`, which covers the same clause
   ```

   Both are `deprecated`; neither is a reason to leave a case `draft` forever,
   which was the only other place those verdicts had to go. The reason is its
   own bullet, never a trailing clause on the `**Status:**` line: the store
   reader takes the whole rest of that line as the status word and would
   refuse the file (`apps/manual/src/store/read-specs.mts`).

   A case tracing several scenarios where the spec dropped only some is not
   retired. Retrace it to the ids that survive and review it again — half a
   case is still a case.

7. **Close the run.** When the last `draft` case has a verdict, or the
   reviewer stops:
   - If every case in the file is now `actual` or `deprecated`, set the
     file's `**Status:**` to `approved`. That is the end of the loop: the
     suite is the reviewed record, and `check:manual` now holds it to that.
     There is no export — `pnpm run qase:export` and
     `openspec-export-qase-csv` do not exist, so never point at them.
   - If any case is still `draft`, leave `pending-review` and name what is
     outstanding. Setting `approved` over a `draft` case **fails the build**
     (`check:manual` rule `authority`), so it is never a shortcut.
   - Report: how many cases were approved, edited, deferred, retired; the
     gaps the review surfaced for the spec's author (a scenario no case
     covers, a case whose scenario has changed, a question the spec cannot
     answer); and any other suite still awaiting review.

8. **What the build says about the file you just wrote.** Run
   `pnpm run check:manual` when the review changed anything, and read its QA
   rules as part of closing:

   | Rule | Level | Says |
   | --- | --- | --- |
   | `authority` | fails | `approved` over a case still `draft`. |
   | `trace` | fails | A case traces an id the spec issues nowhere — retrace it or retire it. |
   | `coverage` | warns | A scenario no living case traces — a `deprecated` case's traces do not count. Close it deliberately with an `**Out of suite:**` line, or leave it as the hole it is; never invent a case to silence it. |
   | `covers` | warns | A `**Covers:**` bullet quotes a scenario title the spec has since reworded. The id survived a rename by design, so this is the only signal that the words behind a signed-off case moved — re-review the cases under that bullet, or update the quote if the meaning did not change. |
   | `signed` | warns | An `actual` or `deprecated` case with no `**Reviewed by:**` line — a verdict nobody's name stands behind. |

**Never do these things:**

- Never mark a case `actual` — or a file `approved` — without the reviewer
  saying yes to that specific case.
- Never record a verdict without its `**Reviewed by:**` line, and never sign
  one with a handle the reviewer did not confirm as theirs.
- Never approve the remaining cases in bulk because the reviewer approved
  several in a row.
- Never edit a step, precondition, or expected result into something the
  traced scenario does not say, even when the reviewer asks — that is a spec
  change; say so and route it to `/spec-to-tcs` after the spec is fixed.
- Never delete a case or a `test-cases.md` file. Retirement is
  `deprecated`, and it always says why.
- Never promise a Qase export, or point at `pnpm run qase:export` — neither
  exists. `approved` is the record, not a handoff.
- Never regenerate the suite from the spec mid-review. If it is badly out of
  date, stop and hand back to `/spec-to-tcs`.
- Never review under `openspec/changes/archive/`.
