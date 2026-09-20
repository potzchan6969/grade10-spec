---
name: spec-to-tcs
description: Write classified test cases from the anchors - a capability's feature-tcs.md as a blind pass that never reads the scenarios, or a domain's domain-tcs.md, a product's product-tcs.md, or the store's cross-product platform-tcs.md. Use when QA or a PM asks to turn a durable capability, a domain, or an OpenSpec change into test cases, or when a change's specs are finished and auto-generate suites. Invoke as /spec-to-tcs [platform|product|domain|feature] <target>.
---

# Generating Test Cases

Follow `docs/governance/specs-to-test-cases.md` — this skill is that document's
workflow, automated. It holds the format, the vocabularies, the review
lifecycle, and every rule this skill points at by section name in bold. Where
the two differ, the document is correct.

Invoke as `/spec-to-tcs [platform|product|domain|feature] <target>`. Reviewing
a suite and moving its cases to `actual` is `/tcs-review`'s job
(`.claude/skills/tcs-review/SKILL.md`). Manual "peer review" is deprecated.

## A feature run is blind

**A feature-level run never reads `## Requirements`.** The suite is not derived
from the scenarios; it is an independent second reading of the same anchors,
and a suite derived from the scenarios can only find inconsistency inside them,
never the behaviour they left out. Holding that property is this skill's first
obligation, above every convention below.

The blind pass reads the bundle **The Isolated Input** describes in the
rulebook, assembled by the caller, and nothing outside it:

- **Included** - `## Purpose` and `## Feature set` from the capability's
  `spec.md`, its `user-journeys.md`, the change's `proposal.md`,
  `decisions.md` - its `## Raised` table included, which says what earlier runs
  asked and what came of it - and `ui-design.md` where they exist, with the
  dispositions the requirements pass wrote onto its state bullets stripped. The
  decisions say what
  the change is for and what it rules out, the design lands before the
  requirements and ties its states to anchors, and neither holds a requirement,
  so neither carries a leak - the linked pages under `docs/prds/`,
  `openspec/config.yaml`'s `context`, the existing `feature-tcs.md` for id
  continuity with its `## Reconciliation` stripped, and that suite's
  `## Settled` - the questions earlier runs asked and had answered. Reading
  those is what stops you raising a refused reading again, and it tells you
  nothing about what the scenarios say.

  **Write no case for a non-goal.** `decisions.md` names what this change
  deliberately does not do; a case against one of those is not a gap the
  scenarios left, and filing it as one spends the reconciliation's credibility
  on a question already closed.
- **Excluded** - every `## Requirements` section, `openspec/specs/` beyond the
  two included sections, and `openspec/changes/archive/` entirely. An archived
  change keeps an un-stripped `## Reconciliation` naming scenario ids, so
  reading archive reopens the leak invisibly on the next change.

When the caller has not built an isolated input - a human running this skill by
hand on a durable capability - assemble it yourself and say so in the report.
Never read the requirements "just to check": that is how the property is lost,
and nothing downstream can detect that it was.

Work an explicit test-design checklist rather than paraphrasing the journeys:
boundary values, equivalence partitions, state transitions, CRUD completeness,
empty / one / many, null and missing, permission matrix, error taxonomy, SEO
and indexability. Two readings that use the same method produce synonyms, and
the reconciliation then finds nothing.

Domain, product and platform runs already read journeys rather than scenarios
and are unchanged.

## The Level

| Level | Writes | Owes |
| --- | --- | --- |
| `platform` | `openspec/specs/platform-tcs.md` | nothing — smoke |
| `product` | `<product>/product-tcs.md` | nothing — smoke |
| `domain` | `<product>/<domain>/domain-tcs.md` | every cross-capability path its journeys imply |
| `feature` | `<capability>/feature-tcs.md` | every anchor - each journey, or each feature set root group where nobody walks the capability |

- **Which level owns a case** — **Levels** and **One purpose, one case**. A
  composed case traces two or more journeys that exist, from two or more
  capabilities, domains or products; `pnpm run tcs:validate` fails a single one
- **Smoke passes** — `product` and `platform` hold a handful of long paths,
  every one `**Suites:** smoke`; write neither where no path exists
- **Infer the level when no argument is given** — a directory holding
  `spec.md` is `feature`, a `<product>/<domain>` directory is `domain`, a
  product directory is `product`, `openspec/specs/platform-tcs.md` is
  `platform`, an explicit file path is whatever its name says. Say which level
  you took; ask only when the target matches both a capability and a domain
- **Run top down** — `platform`, `product`, `domain`, `feature` — when a change
  touches more than one. When the user asks for a suite whose level above is
  missing or older than the change, say so and offer the higher run first
- **One file per level** — `test-cases.md` is not a suite name; never write
  one, and never write a second file beside a suite that already exists

## What a Run Reads

- **Feature** — the isolated input above, and nothing else: `## Purpose` and
  `## Feature set` from `spec.md` but never its requirements,
  `user-journeys.md`, the change's `proposal.md` and `ui-design.md` when they
  exist, the pages under `docs/prds/`, and `openspec/config.yaml`'s `context`. A platform fact
  is checked where it matters (`URL contains <lang>`), never written as a
  pre-condition
- **Domain** — **Compose from evidence** under **One purpose, one case**:
  the changed capability's `user-journeys.md`, every sibling's under
  `openspec/specs/<product>/<domain>/`, and the domain's pages under
  `docs/prds/products/<product>/<domain>/`
- **Product, platform** — every domain's `user-journeys.md` in the product,
  or every product's under `openspec/specs/`, and the pages under `docs/prds/`
  beside them; a platform run names the products the path crosses first
- **Both trees** — durable specs and in-flight deltas alike. The suite lands
  beside the `spec.md` you resolved, next to the `user-journeys.md` it
  derives from. Ids are **Naming**'s: `<product>-<domain>-e2e-US<n>-TC<m>-<v>`,
  `<product>-e2e-US<n>-TC<m>-<v>`, `platform-e2e-US<n>-TC<m>-<v>`

## Steps

0. **Read the rulebook whole.** `docs/governance/specs-to-test-cases.md`,
   one read, under 450 lines, before step 1 on every run; a bold name below
   is a heading there.

1. **Resolve the target.** **When Suites Are Generated** in the document
   holds the argument table: a change name is every delta `spec.md` under
   `openspec/changes/<change>/specs/`; a path containing `openspec/specs/` or
   `openspec/changes/` is exactly that tree. When a capability id matches both
   a durable spec and an active delta, use the tree the user named, and ask
   when they named none — never guess, never write both unless asked. A
   capability in one tree only resolves there. Archive is never a target.

2. **Stop if a suite is already there.** Read it and show the user: the
   `**Status:**` line; each journey and its case count; cases by
   `**Status:**` — `draft`, `actual`, `deprecated`; scenario ids no case
   traces and traced ids the spec no longer defines. Then ask, and wait:
   update (continue from step 3, in update mode), another target (back to
   step 1, file untouched), or regenerate — only under the **Regeneration
   guard** in **When a Suite Already Exists**, and only after a second explicit confirmation that review history
   will be lost. Say which cases block a refused regeneration and offer the
   update path. Never move a case back to `draft` for a reviewer, and never
   delete a suite file.

3. **Digest the capability, and upgrade the journeys if missing.** Read as
   **What a Run Reads** says. When `user-journeys.md` is missing or empty, do
   not stop: write it as **Step 1** in the document and `openspec/config.yaml`
   (`rules.specs`, `rules.user-journeys`) direct — from the feature set
   and the PRD rather than the requirements you cannot see, adding no
   behaviour, ids numbered from `01` and never reusing a retired number. There
   is no cap on the number of journeys. A capability nobody walks says
   `**Walked by:** nobody on their own - <who inherits it>` and still gets a
   suite, anchored on its feature set. Run `pnpm run validate:changes
   <change-name>` when the target is a change, report what you changed, then
   continue from step 4. Refuse only when the feature set and the journeys
   together describe nothing checkable; that gap is the author's.

4. **Learn the house style from the approved corpus.** **What the approved
   suites teach the next one** holds which cases count, the weighting, the
   threshold, the major-revision filter, and what the corpus may never teach.
   Scan `openspec/specs/**/*-tcs.md` and `openspec/changes/*/specs/**/*-tcs.md`,
   never `archive/`, for title shape, pre-condition phrasing, step
   granularity, expected-result shape, property calibration and domain
   vocabulary. A suite approved under an older major or with no revision is
   named in the report as approved-but-stale and read for nothing; a corpus
   under three cases is said to be thin and the defaults stand; an approved
   case contradicting a written rule is reported in step 10 and the rule
   followed. Then bring every `draft` in the resolved suite — yours and an
   earlier run's — to the learned conventions: id kept, `<v>` unchanged,
   status still `draft`, coverage untouched; never an `actual` or
   `deprecated` case. List every draft you re-worded, and why, in step 10.

5. **Take the journeys as the suite's sections.** **Step 2** in the document:
   one `## <capability>-US<n>: <title>` per `### <capability>-US-<n>` in
   `user-journeys.md`, in spec order, compact id, title and three-line statement
   copied unchanged, no `Covers:` list, description or count, a `---` rule
   between sections. The actor resolves to `customer` or `admin` — **Who the Actor
   Is**; a journey with another actor gets no cases and is reported. A
   case with no observable user-facing outcome — a schema change, a cron job,
   internal state — is not written. Where the journeys file says
   `**Walked by:** nobody`, the file carries exactly one section,
   `## <capability>-US1: <what the capability holds>`, with the declaration's
   line in place of the journey — never one section per feature set group, which
   would number a case by that group's position and renumber it the day the
   groups are reordered. The groups go on the cases instead: each `**Trace:**`
   names the one it walks. Every case sits under a section; an orphan is not
   written.

6. **Write the cases.** **Step 3** and **Step 4** in the document hold the
   case's parts and their shape, the pre-condition rules, `## Background`,
   placeholders, roles, test data, the clause map, and **Mechanism is yours,
   coverage is the spec's**. What the skill adds:

   - **Id** — `<capability>-US<n>-TC<m>-<v>`; `n` from the journey, `TC`
     from `1` under each journey, `<v>` from `1`
   - **Order** — positive first, then empty, missing and failure, then
     destructive only where the scenarios state cancel, remove, withdraw or
     unwind
   - **One pass, not one clause** — **Step 3**'s rule that a case reads like
     a run; a one-step case left out arrival and observation
   - **Standing rules** — atomicity (one intent per case), independence (no
     case leans on another having run), NLP automation readiness (the same
     condition phrased identically everywhere, no blank expected results)

7. **Classify every case** — **Step 5** in the document, ten properties in
   its order with `*` bullets. On generation `**Status:**` is `draft` and
   `**Automation status:**` is `manual`; `exploratory` is never written; a
   feature case traces one anchor — a journey in canonical form
   (`<capability>-US-<n>`), or, where nobody walks the capability, a
   `## Feature set` root group name matched verbatim. A case never traces a
   scenario id: on a feature run the scenarios do not exist yet.
   **A Case That Already Exists Is Not Written Twice**: extend the existing
   case, report the pair, and name a feature case wholly covered by an
   `approved` domain case as a trim candidate, never deleting it. A journey
   accepted by refusal, empty-state or failure scenarios does not ship with
   only `positive` cases.

8. **Check coverage against the anchors** before writing: every case traces an
   anchor that exists, and every anchor has at least one case under it. The
   other direction — a scenario no case reaches — is not this run's to check:
   the scenarios are written after this suite, and reconciliation compares the
   two. Scenario ids stay off the case. Gaps go to step 10.

9. **Write the file** beside the resolved `spec.md` — `feature-tcs.md`,
   `domain-tcs.md`, `product-tcs.md` or `platform-tcs.md` — to **The Format**,
   with the header lines directly under the title and no preamble. **The
   File Header** is computed, never chosen: `**Status:**` from the cases
   (`pending-review`, `in-review`, `approved`); `**Drafts styled:** <today>,
   tcs-rules r<major>.<minor>` from `tcs_rules_rev` in the document's
   frontmatter, present exactly while a `draft` remains; `**Reviewed:**` is
   `/tcs-review`'s and never yours. `pnpm run tcs:validate`
   (`scripts/openspec/validate-test-cases.mjs`) refuses:

   - **Header** — a status its cases do not imply; `**Drafts styled:**`
     with no draft under it or missing above one; `**Reviewed:**` on a file
     not `approved`; a revision above the store's
   - **Journey** — a heading not `## <capability>-US<n>: <title>`, a prefix
     the spec does not issue, a journey it does not define, one missing
     `**As a**`, `**I want**` or `**so that**`
   - **Case** — an id not `<capability>-US<n>-TC<m>-<v>`, under the wrong
     journey, `TC<m>` repeated, `<v>` below `1`; a property missing, out of
     order or outside its vocabulary; `Suites` empty or `none` beside another
     value; `Type` holding `smoke` or `regression`; a trace naming neither a
     journey the spec defines nor a feature set root group, two on a feature
     case, fewer than two on a composed one; no
     `**Pre-conditions:**` text, no numbered step, an empty
     `**Expected Results:**` list
   - **Older shapes** — `-` property bullets, `**Preconditions:**`,
     `**Description:**`, `**Properties:**`, `**Covers:**`, `## Journey:` /
     `## Flow` / `## Requirement:` headings, step tables

   Run it on what you wrote before reporting. In update mode — **When a
   Suite Already Exists** and its **A delta that moves the ground under an
   `actual` case** — an `actual` or `deprecated` case whose scenarios are
   unchanged stays exactly as it is, older shape included; a `draft` keeps its
   coverage and takes the step 4 conventions; a case whose traced scenario
   the delta moved is re-worded with `<v>` bumped and `**Status:** draft`, or
   set `**Status:** deprecated`, or left `actual` and said so — no fourth way;
   every uncovered user-facing scenario gets the next unused `TC<m>`; the
   file `**Status:**` is recomputed.

10. **Report.** The corpus first: how many `actual` cases you read and from
   which capabilities, each convention with the approved ids behind it,
   patterns rejected for want of evidence, any approved case contradicting a
   written rule, whether the corpus was thin; then the drafts re-worded, with
   their `<v>`. Then what you wrote: each suite path and its tree, the
   journeys and their case counts, the ids added, re-worded and deprecated,
   every `actual` case moved, and any `spec.md` step 3 rewrote. Separately,
   as gaps for the spec's author: a requirement whose prose states a rule no
   scenario covers, a scenario under no journey, a journey naming an unknown
   scenario id. Point at `/tcs-review` next; the suite is not ready to hand on
   until every case is `actual`. When `pnpm run tcs:stale` named this suite,
   say the revision it moved from and to and how many drafts moved; each
   capability is its own run and pull request, so do not offer the rest.

## End with what you had to decide

Every point the isolated input did not settle, written as a question for the
author. It is the most valuable thing the run produces: the cases are the part
a derived reading could also have written, and this is the part it could not.

**It does not close this file.** It goes to the change's `decisions.md`, under
`## Raised` — `Capability | Raised | Landed` — one row per question, naming the
capability whose pass asked. Leave `Landed` empty; the author fills it, and
`pnpm check:manual` refuses a row that is still empty when the change merges.
That is the file the author already reads, and the deadline the list never had
at the bottom of a suite. Write the suite no `## Raised` of its own:
`pnpm run tcs:validate` refuses one there.

A question belongs there when the input is *silent*, not when you missed
something it says and not when you would simply like to know more. "Is a
scheduled lot open to bid on? The rule names not-yet-published, ended and called
off as failures and never places scheduled on either side" is the shape: a state
the material walked past, which you cannot write a case without choosing.

Write no scenario id in a row: `decisions.md` goes into the next blind pass's
isolated input whole.

The table is required and may be empty. Empty is a claim on the record that
the input settled everything; make it only when it is true.

Where the change carries no `decisions.md` — it predates the artifact — say so
in the report and hand the questions to the caller, who takes them to the
author. Never write them into the suite instead.

## What happens to this suite next

On a feature run inside `/specify`, the scenarios are being drafted in
parallel by a sub-agent that cannot see this file. When both land, the caller
joins them on anchors and writes a `## Reconciliation` section at the bottom of
this suite: what was raised and folded into the spec, what was raised and
rejected and why, what was escalated to the author, what was deferred because
nobody could settle it, and which anchors no case reaches.

That section is not yours to write, and not yours to read on a later run — it
is stripped from the isolated input, because it names scenario ids.

A case the reconciliation could not settle stays here as `draft` carrying
`**Blocked:** <who should settle this>`. Never re-word it, never resolve it, and
never let a later run quietly drop it: an unanswered question is not a
misreading.

## Never

- Never state a step, pre-condition, expected result or data value the traced
  scenarios do not say; where the spec names a control by its role, say the
  same and never invent its label or hedge about whether the product exists
- Never write a step that embeds its outcome, several actions in one step, an
  empty `**Expected Results:**` list, or a case that depends on another
- Never write `**Description:**`, `**Covers:**`, a summary sentence, a
  `**Properties:**` block, or `**Test data:**` on a case with no input
- Never invent a journey the scenarios do not justify; step 3 adds no behaviour
- Never overwrite, regenerate or delete a suite without showing it and asking,
  and never at all over an `actual` case or an `approved` file
- Never write `**Status:** actual`, `**Status:** approved` or `**Reviewed:**`,
  and never choose a file status; it is derived
- Never sweep every stale suite in one run, and never write a QA-review or any other task into `tasks.md` for a suite;
  review state lives in the suite's status lines
- Never write in the tree the user did not ask for, and never under
  `openspec/changes/archive/`
- Never learn from a `draft` or `deprecated` case, and never let the corpus
  add coverage, soften a prohibition or overrule the spec
- Never restyle, renumber or re-word an `actual` case
- Never read a `## Requirements` section, a durable `spec.md` beyond its Purpose
  and feature set, or anything under `openspec/changes/archive/` on a feature
  run — the blind property cannot be recovered once lost, and nothing
  downstream can tell that it was
