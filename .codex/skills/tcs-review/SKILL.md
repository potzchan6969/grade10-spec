---
name: tcs-review
description: Walk a QA reviewer through a pending test-cases.md suite one case at a time, answering their questions from the spec and recording each verdict as actual, deprecated, or still draft. Use when QA asks to review, approve, or sign off test cases for a capability or an OpenSpec change. Invoke as /tcs-review [<capability-or-change>].
---

# Review a capability's test cases with QA

Follow `docs/governance/specs-to-test-cases.md` — it defines the properties,
the statuses, and why review comes before any Qase export. Read it in full
before the first run in a session.

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
   truncated read. Then orient the reviewer: the capability, the journeys,
   how many cases each holds, and how many are `draft`.

4. **Walk the `draft` cases one at a time,** in file order, journey by
   journey. Cases already `actual` or `deprecated` are skipped unless the
   reviewer asks to revisit one. For each case, show:
   - its id and title, and the journey it sits under;
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
   | Approve | `**Status:** actual` on that case, unchanged otherwise. |
   | Change | Apply exactly the edit they asked for — wording, a property, a data row — then ask again; approve only on their yes. An edit that would add coverage the spec does not state goes to `spec.md` first, via `/spec-to-tcs`, not into the case. |
   | Defer | Leave `**Status:** draft` and note what they want resolved. |
   | Retire | `**Status:** deprecated`, only when the spec no longer states that behaviour. Never delete the case, never renumber around it. |

7. **Close the run.** When the last `draft` case has a verdict, or the
   reviewer stops:
   - If every case in the file is now `actual` or `deprecated`, set the
     file's `**Status:**` to `approved` and say the suite is exportable.
   - If any case is still `draft`, leave `pending-review` and name what is
     outstanding.
   - Report: how many cases were approved, edited, deferred, retired; the
     gaps the review surfaced for the spec's author (a scenario no case
     covers, a case whose scenario has changed, a question the spec cannot
     answer); and any other suite still awaiting review.
   - Point at `pnpm run qase:export` / `openspec-export-qase-csv` only when
     the file actually reached `approved`.

**Never do these things:**

- Never mark a case `actual` — or a file `approved` — without the reviewer
  saying yes to that specific case.
- Never approve the remaining cases in bulk because the reviewer approved
  several in a row.
- Never edit a step, precondition, or expected result into something the
  traced scenario does not say, even when the reviewer asks — that is a spec
  change; say so and route it to `/spec-to-tcs` after the spec is fixed.
- Never delete a case or a `test-cases.md` file. Retirement is
  `deprecated`.
- Never regenerate the suite from the spec mid-review. If it is badly out of
  date, stop and hand back to `/spec-to-tcs`.
- Never review under `openspec/changes/archive/`.
