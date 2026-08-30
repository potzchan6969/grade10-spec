---
name: spec-to-tcs
description: Derive a capability's classified test-cases.md from the user journeys in its spec under openspec/specs/ or openspec/changes/. Use when QA or a PM asks to turn a durable capability or an OpenSpec change into test cases, or when pm-planning finishes specs and auto-generates suites. Invoke as /spec-to-tcs <capability-or-change>.
---

# Generate test cases from a capability's user journeys

Follow `docs/governance/specs-to-test-cases.md` — this skill is that
document's workflow, automated. Read it in full before the first run in a
session; it defines the format, the property vocabularies, and the review
lifecycle this skill produces.

Invoke as `/spec-to-tcs <capability-or-change>`. Reviewing a suite is a
different job: that is `/tcs-review` (`.cursor/skills/tcs-review/SKILL.md`).

Works against **both** trees equally — durable specs and in-flight change
deltas. The suite always lands beside the `spec.md` you resolved.

The output is **not** a one-to-one transcription of scenarios, and it does
**not** invent flows. Specs already name journeys under `## User journeys`
(with `<capability>-US-<n>` ids and the `<capability>-SC-<n>` scenario ids
that accept each story). Each journey becomes one suite section; each case
traces scenario ids.

1. **Resolve the target.** The user names a change, a capability, or a path.
   Both locations are valid; pick from what they asked for:

   | Argument | Resolves to |
   | --- | --- |
   | A change name (`add-auction-auto-bidding`) | Every delta `spec.md` under `openspec/changes/<change>/specs/` |
   | A capability id (`grade10-auction/auto-bidding`) | That capability under `openspec/specs/` **and/or** any active delta — see below |
   | A path containing `openspec/specs/` or `openspec/changes/` | Exactly that tree; do not switch |

   When a capability id matches **both** a durable spec and an active delta:
   - If the user said which tree (`specs/` vs the change name), use that.
   - If they did not, **ask** before writing — do not guess, and do not treat
     the delta as the only legitimate target. Durable and delta are both
     first-class.
   - Never write both locations in one run unless the user asked for both.

   When the capability exists only under `openspec/specs/`, use the durable
   spec. When it exists only under a change, use the delta. Archive
   (`openspec/changes/archive/`) is never a target.

2. **Stop if a suite is already there.** Before reading the spec for
   generation, check whether `test-cases.md` already sits beside the resolved
   `spec.md`. If it does, **do not write anything yet.** Read it, then show
   the user what is there:
   - the file's `**Status:**` line;
   - each journey and how many cases it holds;
   - the count of cases by `**Status:**` — `draft`, `actual`, `deprecated`;
   - what changed in the spec since: scenario ids no case traces (missing
     coverage) and traced ids the spec no longer defines (retired).

   Then ask what they want, and wait for the answer:

   | Choice | Do |
   | --- | --- |
   | Update this suite | Continue from step 3, in update mode (step 8). |
   | Work on another capability or change | Go back to step 1 with the new target. Leave this file untouched. |
   | Regenerate the whole suite | Only after the guard below, and only after an explicit second confirmation that review history will be lost. |

   **Refuse to regenerate or delete** — no matter how the request is
   phrased — when the file's `**Status:**` is `approved`, or when **any**
   case in it has `**Status:** actual`. Say which cases block it, and offer
   the update path instead: new scenarios become new `draft` cases, retired
   ones become `deprecated`, reviewed cases keep their ids and properties. A
   reviewer who truly wants a clean rewrite must move those cases back to
   `draft` themselves first; never do that for them, and never delete a
   `test-cases.md` file.

3. **Digest the spec, and settle what a missing journeys section means.**
   Read it end to end from disk. Read the change's `proposal.md` when the
   target is a delta (or when a linked change exists): its acceptance signal
   is what makes a case's type `acceptance`.

   If `## User journeys` is missing or empty, do not reach for the same
   answer twice. `openspec/config.yaml` **exempts** a capability no end user
   reaches on its own — a cross-cutting policy every other spec inherits, a
   package or composition contract, a backend convention. There the missing
   section is correct, and adding journeys to it breaks the store's own rule
   and edits a spec the PM owns. Ask who reaches this capability on their
   own; when the answer is "another package", it is exempt.

   **Exempt — derive the suite from the scenarios, and touch nothing in the
   spec:**

   1. One `## <Requirement name>` section per `### Requirement:`, in spec
      order, carrying that requirement's `**Covers:**` bullets (`` `id` —
      Scenario title ``). No `**As a**` / `**I want**` / `**so that**` lines
      — there is no actor to write them about — and no invented `-US-` ids.
   2. Cases as in step 5, numbered `<capability>-TC-<n>` across the whole
      file, each tracing the scenario ids it proves.
   3. One `**Out of suite:**` line listing the scenario ids no case covers —
      the internal invariants nobody can exercise by hand. `check:manual`
      subtracts them from coverage, so what it still reports is real work.
      A scenario left out with no line is a hole, not a decision.

   **Not exempt — the spec is unfinished, so upgrade it in place** and then
   continue on the updated file:

   1. Re-read `openspec/config.yaml` specs rules in full (Purpose → Feature
      set → User journeys → requirements; INVEST stories; permanent
      `<capability>-US-<n>` / `<capability>-SC-<n>` ids; at most five
      journeys across every file a change touches).
   2. Rewrite the resolved `spec.md` into that shape **without inventing
      requirements**. Keep every existing SHALL and every existing scenario
      clause; add Feature set and User journeys derived from them; give
      every story and scenario a stable id; under each story write the
      story on three labeled lines (`**As a**`, `**I want**`, `**so that**`)
      and an `**Accepted by:**` bullet list of `` `id` — Scenario title ``
      (never a comma dump); number ids from 01 and never reuse a retired
      number. For a multi-file change, keep the journey cap across all of
      its deltas.
   3. Validate when the target is a change:
      `openspec validate <change-name> --strict`.
   4. Report what you changed in the spec (journeys added, ids issued).

   Either way, continue from step 4. Only refuse when the file has no
   checkable scenarios at all — that gap goes to the author; do not invent
   behavior.

4. **Take the journeys as the suite's sections.** Each
   `### <capability>-US-<n>: …` under `## User journeys` becomes one
   `## <capability>-US-<n>: …` section, in spec order, carrying the same
   three-line story (`**As a**` / `**I want**` / `**so that**`) and a
   `**Covers:**` bullet list of the scenario ids and titles — the same shape
   the spec uses. The actor is the role the story names — an end user
   (operator, admin, collector, customer), never a developer, worker, or
   "the system". A scenario under no journey, or a journey listing an id the
   requirements never define, is reported in step 9 — never given an
   invented home. For an exempt spec the sections are its requirements
   instead, exactly as step 3 sets out.

5. **Write the test cases for each journey.** Number them
   `<capability>-TC-<n>` sequentially across the whole file, in journey
   order, from 01 — the same id shape as the spec's `-US-` and `-SC-` ids.
   Positive path first, then negatives. Take every step and expected result
   from the traced scenarios' own clauses, in their own words, per the
   governance doc's clause mapping. Each case carries, in this order:

   - **Title** — actor, action, and the condition being verified, in the
     third person. "Collector opens a collection tile and reaches its
     browse listing", never "Tile works" or "Test the grid".
   - **Description** — one or two sentences saying what the case proves and
     why it exists. Not a restatement of the title.
   - **Preconditions** — a bullet per condition that must hold before step
     1: the actor's state, the data the environment must hold, the
     lifecycle state of the thing under test. `None.` only when the case
     truly needs nothing.
   - **Test data** — a `Field | Value` table of the values the case uses,
     every one of them taken from a scenario, or the line
     `None — the case takes no input.`
   - **Steps** — a `| # | Action | Expected result |` table. One action per
     row; a row whose expected result is blank is not finished. A check the
     actor performs (reading a page, a log, a response) is its own row.
   - **Properties** — the nine in step 6.

   Two rules the governance doc takes from the Virtuoso guide, both easy to
   break: **atomicity** — "sign in, open settings, change the password" is
   three rows, not one — and **independence** — a case never says "the
   listing from `SC-10`" or leans on an earlier case's leftovers; it writes
   that setup out in its own preconditions and test data, however much that
   repeats.

6. **Classify every case** with all nine properties, in this order (the
   governance doc holds the full vocabulary and how to choose):
   - **Severity** — `blocker`, `critical`, `major`, `normal`, `minor`,
     `trivial`: how bad the failure is.
   - **Priority** — `high`, `medium`, `low`: how soon it runs.
   - **Status** — always `draft` on generation. Never write `actual`.
   - **Behaviour** — `positive`, `negative`, or `destructive`.
   - **Type** — exactly one of `functional`, `smoke`, `regression`,
     `acceptance`, `usability`, `security`, `performance`, `compatibility`,
     `integration`. At most one `smoke` per journey. Never write
     `exploratory` — that is a reviewer's tag.
   - **Layer** — `e2e`, `api`, or `unit`.
   - **Automation status** — always `manual` on generation; engineering
     flips it when a test lands.
   - **Testability** — `automation`, `manual`, or both tags as
     `manual, automation`.
   - **Trace** — the `<capability>-SC-<n>` ids, comma-separated when a case
     covers several. Fall back to `<requirement> / <scenario title>` only
     when the spec has no scenario ids yet.

   A journey whose cases are all positive is unfinished.

7. **Check the traceability both ways** before writing the file. Every case
   traces at least one scenario id (or legacy title), and every scenario in
   the requirements is either traced by a case or named on an
   `**Out of suite:**` line. A case tracing an id the spec does not issue
   fails `check:manual`; an untraced scenario warns.

8. **Write the file beside the resolved `spec.md`** — durable suite under
   `openspec/specs/.../test-cases.md`, or delta suite under
   `openspec/changes/<change>/specs/.../test-cases.md` — with
   `**Status:** pending-review` under the title and no preamble paragraph
   between them, using the template in the governance doc.

   In **update mode** (a suite already existed and the user chose update):
   - Keep every case whose traced scenarios are unchanged exactly as it is —
     same id, same wording, same properties. A reviewed case is not re-tagged
     unless the user asks.
   - Re-word a case whose scenario changed, and set its `**Status:**` back to
     `draft`.
   - Add a case for every scenario no case traces, taking the next unused
     `TC` number — never reusing a retired one.
   - Set `**Status:** deprecated` on a case when the spec has dropped
     **every** scenario it traces, and add the reason bullet under it:
     `- **Retired:** the spec no longer states this behaviour`. Do not
     delete it and do not renumber around it.
   - A case tracing several scenarios where only some were dropped is not
     retired: retrace it to the ids that survive and set it back to `draft`.
   - Leave `actual` cases `actual` unless their scenario actually changed.
   - Set the file's `**Status:**` back to `pending-review` whenever the run
     leaves at least one `draft` case.

9. **Report** what you wrote: each `test-cases.md` path (and whether it is
   durable or a change delta), the journeys (US ids) and how many cases
   each holds, the ids added, re-worded, and deprecated, and — when step 3
   upgraded the spec — which `spec.md` paths you rewrote. Report separately
   any requirement whose prose states a rule no scenario covers, any
   scenario under no journey, and any journey listing an unknown scenario
   id — those are gaps for the spec's author. Point the user at
   `/tcs-review` as the next step. There is nowhere else to point them: no
   Qase export exists, and `approved` is the record itself.

**Never do these things:**

- Never state a step, precondition, expected result, or data value the
  traced scenario doesn't already say. Where the spec names a control by its
  role rather than its label, say the same — do not invent the button text
  to make a step sound concrete.
- Never write a step whose expected result is blank, several actions in one
  step, or a case that depends on another case having run.
- Never invent a journey the upgraded spec does not justify from existing
  scenarios — step 3 may reshape the file, but it must not add behavior.
- Never add `## User journeys` to a spec `openspec/config.yaml` exempts from
  them. A package or composition contract has no actor; writing one in edits
  a PM's spec to say something the store's own rules call wrong.
- Never overwrite, regenerate, or delete an existing suite without showing
  it and asking first, and never at all when it holds an `actual` case or
  the file is `approved`.
- Never write a case's `**Status:**` as `actual`, or a file's as `approved`.
  Only `/tcs-review`, with a human answering, does that.
- Never write a QA-review (or any other) task into `tasks.md` for these
  suites — review state lives in the suite's own status lines.
- Never write a durable suite when the user asked for a change delta, or a
  delta suite when they asked for durable — match the resolved tree.
- Never write under `openspec/changes/archive/`.
