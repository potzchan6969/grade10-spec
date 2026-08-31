# Deriving test cases from a capability's spec

A capability's `spec.md` is written for an implementing engineer: feature set,
user journeys, then requirements with Given/When/Then scenarios. The journeys
are the product's own answer to *who is doing what, start to finish* — named
and id'd in the spec under `## User journeys`, at most five across every
delta a change touches (see `openspec/config.yaml` specs rules).

A QA reviewer running a manual pass, a PM confirming acceptance before a
change ships, or a support engineer reproducing a report needs that same
coverage as numbered test cases: a short title, the journey it serves, what
has to be true first, the steps to take, what should happen, and properties so
a suite can be filtered, planned, and imported into Qase. This document
defines that derivation — **spec journeys → classified test cases** — where
the suites live, when they are generated, how they are reviewed, and the
commands QA runs by hand.

The case components and the rules for writing them — an action-oriented
title, a description, explicit preconditions, named test data, atomic steps
each with their own expected result, priority, and traceability back to the
requirement — follow
[Virtuoso QA's test case writing guide](https://www.virtuosoqa.com/post/test-cases),
including its warnings: no vague steps, no missing expected results, no case
that quietly depends on another having run first. The property vocabularies
are Qase's own, so a suite exports without a translation step.

## The rule

`test-cases.md` is a derived reading of a capability's `spec.md`, not a
second source of truth. It carries no coverage the spec does not already
state as a scenario, and a change proposal never links it in place of a
spec delta. Where the two disagree, `spec.md` is correct — regenerate the
test case, never the other way round.

Journeys are already in the spec, so this file does **not** invent flows.
Every suite section is one `## User journeys` story; every test case traces
one or more scenario ids (`<capability>-SC-<n>`). A case that traces nothing
is a new requirement in disguise and belongs back in `spec.md` first. A
scenario id no case traces is a hole in the suite, reported — never quietly
closed by inventing a case.

The properties are the one part QA owns outright: they classify scenarios the
spec already states. A wrong property is fixed in review; a wrong property is
never grounds to add, remove, or reword a step or an expected result — those
still come from the scenario's own clauses, in its own language.

## Naming

Test cases use the same id shape as the spec they derive from, so a task, a
review comment, and a Qase case can all name the same thing:

| Id | Lives in | Example |
| --- | --- | --- |
| `<capability>-US-<n>` | `spec.md` user journey | `home-US-01` |
| `<capability>-SC-<n>` | `spec.md` scenario | `home-SC-01` |
| `<capability>-TC-<n>` | `test-cases.md` test case | `home-TC-01` |

`<capability>` is the spec directory's own name (`home`, `admin-listing`).
Number test cases sequentially across the whole file, in journey order,
starting at 01. Treat an issued `TC` id as permanent the same way spec ids are
permanent: a retired case is marked `deprecated`, never renumbered away, and a
new case takes the next unused number.

## Where it lives

`test-cases.md` always sits beside the `spec.md` it was derived from. Both
trees are first-class targets for `/spec-to-tcs`:

| Spec location | Suite location |
| --- | --- |
| Durable: `openspec/specs/<product>/<capability>/spec.md` | `openspec/specs/<product>/<capability>/test-cases.md` |
| In-flight change: `openspec/changes/<change>/specs/<product>/<capability>/spec.md` | `openspec/changes/<change>/specs/<product>/<capability>/test-cases.md` |

`/spec-to-tcs` resolves whichever tree the argument names and writes only
there. When a capability exists in both, ask which one — do not prefer the
delta by default. When a change is archived, `openspec archive`'s spec sync
carries the delta's `test-cases.md` into the durable location the same way
it carries the delta `spec.md`.

Write a suite for every capability whose spec (durable or delta) has
checkable scenarios. When `## User journeys` is missing or empty,
`/spec-to-tcs` first rewrites that `spec.md` to match `openspec/config.yaml`
specs rules (Feature set, User journeys, permanent `US`/`SC` ids) from the
behavior already there, then derives the suite. A file with no scenarios at
all is not ready — finish the requirements first.

## When suites are generated

### Automatic — after pm-planning

When the `pm-planning` skill finishes the proposal and the delta specs, and
`openspec validate <change> --strict` passes, it **immediately** runs
`/spec-to-tcs <change>` against that change. The suites land beside each
delta with every case `draft` before the change is handed off for promotion.
Generation is part of finishing the planning lane, not a later favour.

A change that sets `skip_specs: true` has nothing to generate. A change
whose deltas still lack `## User journeys` is upgraded in place by
`/spec-to-tcs` before the suites are written — not left for a later pass.

### Manual — generate or extend by agent command

```text
/spec-to-tcs <capability-or-change>
```

Runs against **either** tree. Pick the argument that names the tree you
want:

| Argument | Resolves to |
| --- | --- |
| A change name (`add-auction-auto-bidding`) | Every delta under `openspec/changes/<change>/specs/` |
| A capability id (`grade10-store/home`) | The durable `openspec/specs/<product>/<capability>/spec.md`, or — if an active delta also exists — ask which tree |
| An explicit path under `openspec/specs/` or `openspec/changes/` | Exactly that path's tree |

Examples:

```text
/spec-to-tcs grade10-store/home
/spec-to-tcs add-auction-auto-bidding
/spec-to-tcs grade10-auction/auto-bidding
```

If the resolved `spec.md` has no `## User journeys` (or an empty one),
`/spec-to-tcs` rewrites it to the shape in `openspec/config.yaml` specs
rules — Purpose, Feature set, User journeys with INVEST stories and
permanent `<capability>-US-<n>` / `<capability>-SC-<n>` ids — **without
adding requirements**, then continues and writes `test-cases.md`. Report
the spec rewrite in the same run.

### When a suite already exists

A second run against a capability that already has `test-cases.md` is never a
silent overwrite. `/spec-to-tcs` shows the suite it found — its file status,
its journeys, its cases and their statuses, and any scenario the spec has
gained or lost since — and asks what the user wants before writing:

| Choice | Does |
| --- | --- |
| Update | Add cases for scenarios no case traces, re-word cases whose scenarios changed, mark `deprecated` any case whose scenario the spec no longer has. Existing ids and reviewed properties survive. |
| Another target | Leave this suite untouched and resolve a different capability or change. |
| Regenerate | Rewrite the whole file from the spec. Destroys review history. Only after an explicit confirmation, and only when the guard below allows it. |

**The regeneration guard.** Regenerating or deleting a suite is refused when
either is true:

- the file's `**Status:**` is `approved`, or
- any case in it has `**Status:** actual`.

Those cases have a reviewer's name behind them and may already be in Qase.
Update the suite in place instead — new scenarios become new `draft` cases,
retired ones become `deprecated`, and reviewed cases keep their ids. A
reviewer who genuinely wants a clean rewrite moves the affected cases back to
`draft` (and the file back to `pending-review`) by hand first; an agent never
does that on its own.

## Reviewing a suite

```text
/tcs-review [<capability-or-change>]
```

Review is a conversation, one case at a time, and only a human approves. The
`tcs-review` skill finds every suite awaiting review — a file marked
`pending-review`, or any file holding a `draft` case:

- **None** → say so, and name where suites would live.
- **Exactly one** → review it directly.
- **More than one** → list the capabilities and changes with their pending
  counts and ask which to take.

For each `draft` case the reviewer sees the case beside the scenario text it
traces, and answers: approve it, change it, defer it, or retire it. The
reviewer's questions ("why is this `critical`?", "where does the spec say
20000?") are answered from the spec, quoting the clause — never from an
assumption about how the product probably works. Approving sets that case's
`**Status:**` to `actual`; deferring leaves it `draft`; retiring sets
`deprecated`. When every case in the file is `actual` or `deprecated`, the
file's `**Status:**` becomes `approved`, and only then does it export.

## Step 1: digest the spec (upgrade journeys if missing)

Read the capability's `spec.md` end to end — `## Purpose`, `## Feature set`,
`## User journeys`, then the requirements and their scenarios. Do not work
from a truncated view. Read the change's `proposal.md` when one exists: its
acceptance signal is what makes a case's type `acceptance`.

If `## User journeys` is missing or empty, rewrite that `spec.md` first to
match `openspec/config.yaml` `rules.specs`: keep every existing SHALL and
scenario clause, add Feature set and User journeys derived from them, issue
permanent story and scenario ids, and format each journey for a human reader
(`**As a**` / `**I want**` / `**so that**`, then `**Accepted by:**` as
`` `id` — title `` bullets — see `openspec/config.yaml` specs rules).
Validate a change with `openspec validate <change> --strict`, then continue
this document from Step 2 on the updated file.

Confirm every journey heading carries a stable id
(`### <capability>-US-<n>: …`) and lists the scenario ids that accept it,
and every scenario heading carries its id
(`#### Scenario: <capability>-SC-<n> - …`). Specs that already have journeys
but predate these ids get the same upgrade pass for ids only.

## Step 2: take the journeys as the suite's sections

Do not invent flows. Each `### <capability>-US-<n>` under `## User journeys`
becomes one `## <capability>-US-<n>: …` section in `test-cases.md`, in the
order the spec states them, carrying the same three-line story the spec
carries. The actor is the role the story names — an end user of the product
(operator, admin, collector, customer), never a developer, worker, or "the
system".

A scenario id listed under a journey belongs to that journey's cases. A
scenario that appears under no journey is a hole in the spec (the journey
list is incomplete) — report it; do not invent a journey to hold it. A
journey that lists a scenario id the requirements never define is also a
hole — report it.

Across a change, keep the journey count the specs already chose (at most
five total). Splitting or merging journeys is a specs edit, not a test-case
edit.

## Step 3: write the test case

Each test case is one intent, written in the language of the scenario or
scenarios it traces, and carries the components a tester needs to run it
without asking anyone a question.

| Component | Rule |
| --- | --- |
| **Id** | `<capability>-TC-<n>`, sequential across the file. |
| **Title** | Action-oriented: the actor, the action, and the condition being verified. "Collector opens a collection tile and reaches its browse listing", not "Tile works". |
| **Description** | One or two sentences of purpose and scope, saying what the case proves and why it exists — the context the title has no room for. |
| **Preconditions** | Everything that must be true before the first step: system state, the actor's sign-in state, the data the environment must hold, configuration. Bullets, one condition each. A case that genuinely needs nothing states `None.` |
| **Test data** | The specific values the case uses, taken from the scenario — never a placeholder like "a valid amount". A case that takes no input says `None — the case takes no input.` |
| **Steps** | Atomic actions in a table, each paired with its own expected result. |
| **Properties** | The nine in Step 4. |
| **Trace** | The scenario ids the case derives from. |

Within a journey, order cases the way the actor would hit them: the positive
path first, then negatives. A journey whose cases are all positive is
unfinished — refusal scenarios listed under that journey are cases too.

### Steps are atomic, and every step states its expected result

One action per step. "Sign in, open settings, and change the password" is
three steps. Each step names what the actor does, in the actor's own words,
and what should happen when they do it — never an action whose outcome the
reader has to infer from a later step:

```markdown
**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Open the store front door. | The marketing hero renders with its headline and copy. |
| 2 | Activate the hero's shopping affordance. | The browse listing renders, unscoped. |
```

The scenario's Given/When/Then clauses supply every word of that substance:

| Scenario clause | Where it lands |
| --- | --- |
| `GIVEN` | A precondition bullet, or a test-data row when it carries a value. |
| `WHEN` | A step's **Action**. |
| `AND` following a `WHEN` | The next step's **Action**, in order. |
| `THEN` | The **Expected result** of the step that produced it. |
| `AND` following a `THEN` | Another sentence in that step's expected result, or its own verification step when checking it is a separate act. |

A verification the actor performs — reading a page, reading a log, comparing
two responses — is a step like any other, with the fact it should find as its
expected result.

### Every case stands alone

A case never depends on another case having run, and never refers to another
case or scenario for its setup. "The listing from `SC-10`, where A's maximum
is 50000" becomes preconditions and test data written out in full, in this
case. Two cases repeating the same setup is cheaper than a suite that only
passes when run in order.

### Say it plainly, and say only what the spec says

Write for whoever runs it: specific, unambiguous, no jargon, no internal
names. "Activate the collection tile" beats "dispatch the tile's click
handler". But the plainness has a limit this store enforces — a step, a
precondition, an expected result, or a data value that the traced scenario
does not state is a new requirement, however reasonable it sounds. Where the
spec names a control by its role rather than its label ("the hero's shopping
affordance"), the case says the same; it does not invent the button's text.
If a case cannot be written without inventing something, the gap goes back to
the spec.

## Step 4: give the case its test data

Test data is a component, not a decoration: the tester should never have to
choose a value. State every value the case uses, as a `Field | Value` table
when there is more than one, and refer to it from the steps rather than
repeating it.

```markdown
**Test data:**

| Field | Value |
| --- | --- |
| Starting price | 20000 minor units |
| Minimum increment | 2500 minor units |
| Bidder A maximum | 50000 minor units |
```

When several scenarios differ only in a value and share an expected result,
one case may carry a row per scenario with its own outcome column, and the
steps refer to the row ("commit the maximum in each row") instead of
restating a value:

```markdown
**Test data:**

| Affordance | Renders |
| --- | --- |
| Shopping | the browse listing, unscoped |
| Auction | the auction surface |
```

Every value comes from a scenario. A data table is not a place to generate
variations the spec never stated, and a case that takes no input says so
rather than leaving the field out.

## Step 5: classify the case

Nine properties, in this order, every one of them on every case. The
vocabularies are Qase's, so a suite exports without translation.

### Severity

How bad it is when this case fails:

| Value | Means |
| --- | --- |
| `blocker` | The journey cannot start or continue; later cases in it cannot be attempted. |
| `critical` | Money, permission, or the public record is wrong. |
| `major` | The journey's main outcome is wrong, but nothing irreversible and no rule bypassed. |
| `normal` | A supporting behaviour is wrong while the journey still completes. |
| `minor` | Convenience or presentation, data correct underneath. |
| `trivial` | Cosmetic. |

A refusal that protects money or permission is `critical` even when the
expected result is "nothing happened".

### Priority

How soon this case runs when a pass cannot run everything. Severity is about
the failure; priority is about the schedule, and they diverge — a `trivial`
bug on the first screen every collector sees can be `high` priority.

| Value | Means |
| --- | --- |
| `high` | Runs in every pass, including a smoke pass before a release. |
| `medium` | Runs in a full pass of this capability. |
| `low` | Runs when there is time, or when this area changed. |

### Status

The case's own review state, distinct from the file's:

| Value | Means |
| --- | --- |
| `draft` | Generated or edited since its last review. Not exported. |
| `actual` | A reviewer read it against the scenarios it traces and stands behind it. Exports. |
| `deprecated` | The spec no longer states this behaviour. Kept for history, never exported, never renumbered away. |

Generation always writes `draft`. Only `/tcs-review` — with a human saying
yes — writes `actual`.

### Behaviour

| Value | Means |
| --- | --- |
| `positive` | The actor does the intended thing and it works. |
| `negative` | Invalid input, a wrong lifecycle state, or a missing permission; the product refuses and the stored facts are unchanged. |
| `destructive` | The actor deliberately removes, withdraws, or cancels something and the product must unwind it cleanly — a called-off listing, a deleted account, a released authorization. |

A case at the edge of a stated limit — the eighth item accepted, the ninth
refused — is `positive` when the edge value is accepted and `negative` when it
is refused; say "at the limit" in the title so the boundary is not lost.

### Type

Exactly one, from Qase's vocabulary. Use `functional` when nothing more
specific fits:

| Value | Means |
| --- | --- |
| `functional` | Verifies a behaviour the requirement states. The default. |
| `smoke` | The one case per journey whose failure means that journey is unusable. At most one per journey. |
| `regression` | An invariant that has broken before, or is easy to break, worth re-running on every change to this capability. |
| `acceptance` | Traces directly to the proposal's acceptance signal. Omit when no proposal is linked. |
| `usability` | About what renders and how it responds to a person, not about the stored result. |
| `security` | Permission, ownership, or disclosure — who may act and what may be seen. |
| `performance` | A timing or volume statement the spec makes. |
| `compatibility` | Behaviour across browsers, devices, or locales the spec names. |
| `integration` | The seam between this capability and another service the spec names. |
| `exploratory` | Reserved for cases a reviewer adds by hand; generation never writes it. |

### Layer

Where the case is exercised:

| Value | Means |
| --- | --- |
| `e2e` | Through the interface the actor actually uses. |
| `api` | Against the contract beneath it — the scenario is about a response or a stored fact, not a rendering. |
| `unit` | A pure rule with no I/O — a calculation, a validation, a state transition. |

### Automation status

Whether a test for this case exists **today**:

| Value | Means |
| --- | --- |
| `manual` | No automated test runs it yet; a person does. |
| `automated` | An automated test covers it and runs in CI. |

Generation always writes `manual` — nothing is automated at the moment it is
written. Engineering flips it to `automated` when the test lands. A case whose
testability is `automation` but whose automation status is still `manual` is
the backlog of what to automate next.

### Testability

Whether the case *can* be automated. One or both values, comma-separated —
a case that is worth both an automated assertion and an occasional manual
pass carries both tags:

| Value | Means |
| --- | --- |
| `automation` | Deterministic; a script can assert the expected result exactly. |
| `manual` | Depends on a perceptual or exploratory judgment a script cannot reliably assert. |
| `manual, automation` | Both — automatable, and still worth a human's eye. |

### Trace

The spec ids this case derives from: the `<capability>-SC-<n>` scenarios it
covers, comma-separated when it covers several, and the
`<capability>-US-<n>` journey when the case belongs to a journey other than
its own section (rare — normally the section heading carries it). Fall back
to `<requirement> / <scenario title>` only when the spec has no ids yet.

A case with no trace does not belong in the file.

## File status

```markdown
**Status:** pending-review
```

| Value | Means |
| --- | --- |
| `pending-review` | At least one case is still `draft`. Nothing in the file exports to Qase. |
| `approved` | Every case is `actual` or `deprecated`; a reviewer stands behind the suite. |

The file status is a summary of its cases, not an independent judgment.
`/tcs-review` flips it to `approved` only when it has walked the last `draft`
case with a human; generation never writes `approved`, and a suite that gains
a new `draft` case goes back to `pending-review`.

## The format

````markdown
# <product>/<capability> Test Cases

**Status:** pending-review

## <capability>-US-<n>: <copied from the journey heading>

**As a** <role>,
**I want** <capability>,
**so that** <benefit>.

**Covers:**

- `<capability>-SC-<a>` — <scenario title>
- `<capability>-SC-<b>` — <scenario title>

### <capability>-TC-01: <actor> <action> <condition being verified>

**Description:** <one or two sentences: what this case proves, and why>

**Preconditions:**

- <from GIVEN — one condition per bullet, or a single "None." bullet>

**Test data:**

| <field> | <value> |
| --- | --- |
| <from a scenario> | <from a scenario> |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | <from WHEN> | <from the THEN it produces> |
| 2 | <from the next AND> | <what that step should produce> |

**Properties:**

- **Severity:** blocker | critical | major | normal | minor | trivial
- **Priority:** high | medium | low
- **Status:** draft | actual | deprecated
- **Behaviour:** positive | negative | destructive
- **Type:** functional | smoke | regression | acceptance | usability | security | performance | compatibility | integration | exploratory
- **Layer:** e2e | api | unit
- **Automation status:** manual | automated
- **Testability:** automation | manual | manual, automation
- **Trace:** <capability>-SC-<n>[, <capability>-SC-<m>]
````

The journey heading, its three-line story, and its `**Covers:**` bullets are
copied from `spec.md` — the same shape the spec uses, so the two files read
alike side by side.

`**Test data:**` may be the line `None — the case takes no input.` instead of
a table. Nothing else is optional: a case without a description, without
preconditions, or with a step whose expected result is blank is not finished.

Execution belongs to the run, not to this file. There is no Actual result and
no Pass/Fail column here — a suite is the authored artifact, and what happened
on a given run lives in Qase (or wherever the pass is recorded) against the
exported case.

## Workflow summary

1. **pm-planning** writes proposal + specs (with Feature set, User journeys,
   and id'd scenarios) → validates → **auto-generates** `test-cases.md` for
   every delta that has journeys via `/spec-to-tcs <change>`, every case
   `draft`.
2. **QA reviews** with `/tcs-review`, case by case: `draft` → `actual`, and
   the file `pending-review` → `approved` when the last one lands.
3. **Keep suites current** with the specs: when a delta adds, edits, or
   removes a scenario or journey, run `/spec-to-tcs` in the same PR and take
   the update path — new cases arrive `draft`, retired ones become
   `deprecated`, reviewed ones keep their ids.
4. Only `actual` cases in `approved` suites are exported by
   `pnpm run qase:export` / `openspec-export-qase-csv`.

## What this is not

- Not a spec. `prd-and-openspec.md`'s "if a statement is testable, it belongs
  in the spec" rule is unaffected. Journeys and scenario ids live in
  `spec.md`; this file only classifies them.
- Not a place to invent journeys. If the actor obviously takes a step the
  spec has no scenario for, that gap goes to the spec's author.
- Not the automated coverage obligation in `ui-component-testing.md`. Setting
  a case's testability to `automation` plans QA's suite; it does not satisfy
  the browser-test gate or a `tasks.md` checkbox.

## The tools

| Tool | Does |
| --- | --- |
| `/spec-to-tcs <capability-or-change>` (`spec-to-tcs` skill) | If journeys are missing, rewrites the resolved `spec.md` to `openspec/config.yaml` specs rules, then derives suites under `openspec/specs/` or `openspec/changes/` and writes `test-cases.md` beside that `spec.md` with every new case `draft`. Shows an existing suite and asks before touching it; refuses to regenerate over `actual` cases or an `approved` file. Read `.cursor/skills/spec-to-tcs/SKILL.md`. |
| `/tcs-review [<capability-or-change>]` (`tcs-review` skill) | Finds suites awaiting review, walks their `draft` cases with a human one at a time, answers questions from the spec, and records `actual` / `deprecated` / left-`draft`. Read `.cursor/skills/tcs-review/SKILL.md`. |
| `pm-planning` skill | After proposal + specs validate, runs `/spec-to-tcs <change>` automatically. |
| `pnpm run qase:export` / `openspec-export-qase-csv` | Exports the `actual` cases of every `approved` suite to a Qase-shaped CSV. Skips `pending-review` files, `draft` cases, and `deprecated` cases. |

## Example

[`openspec/specs/grade10-store/home/test-cases.md`](../../openspec/specs/grade10-store/home/test-cases.md)
is the durable worked example: five collector journeys (`home-US-01` …
`home-US-05`), twenty scenarios traced by id (`home-SC-01` …) across
`home-TC-01` … `home-TC-18`, each with a description, its own preconditions,
its test data, atomic steps carrying their own expected results, and the nine
properties. Its sibling
[`spec.md`](../../openspec/specs/grade10-store/home/spec.md) was upgraded to
`openspec/config.yaml` Feature set / User journeys / permanent ids as part of
`/spec-to-tcs grade10-store/home`.

Change deltas use the same format under
`openspec/changes/<change>/specs/<product>/<capability>/test-cases.md`.

## See also

- [`prd-and-openspec.md`](prd-and-openspec.md) — why `spec.md` is the sole
  source of truth
- [`ui-component-testing.md`](ui-component-testing.md) — the separate
  automated coverage obligation for UI components
- `openspec/config.yaml` — Feature set, User journeys, and id rules this
  derivation assumes
