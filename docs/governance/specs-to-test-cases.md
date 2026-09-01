---
tcs_rules_rev: 1
---

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

The case components and the rules for writing them — a clean descriptive
title, explicit pre-conditions, named test data, atomic steps, an
expected-results list, priority, and traceability back to the journey —
follow
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
Every suite section is one `## User journeys` story, and every test case
traces the journey it sits under (`<capability>-US-<n>`) and is built only
from the scenarios that accept that journey. A case built from no scenario is
a new requirement in disguise and belongs back in `spec.md` first. A scenario
no case covers is a hole in the suite, reported — never quietly closed by
inventing a case.

The properties are the one part QA owns outright: they classify scenarios the
spec already states. A wrong property is fixed in review; a wrong property is
never grounds to add, remove, or reword a step or an expected result — those
still come from the scenario's own clauses, in its own language.

## Naming

Test cases use the same journey and scenario ids as the spec they derive from,
so a task, a review comment, and a Qase case can all name the same thing:

| Id | Lives in | Example |
| --- | --- | --- |
| `<capability>-US-<n>` | `spec.md` user journey | `product-listing-US-01` |
| `<capability>-SC-<n>` | `spec.md` scenario | `product-listing-SC-01` |
| `<capability>-US<n>` | `test-cases.md` journey section heading | `product-listing-US1` |
| `<capability>-US<n>-TC<m>-<v>` | `test-cases.md` test case | `product-listing-US1-TC1-1` |

`<capability>` is the spec directory's own name (`home`, `product-listing`).

Inside `test-cases.md` a journey id is written in its compact form — the
hyphen after `US` dropped, the number not zero-padded — so a section heading
and the case ids under it read as one family: spec journey
`product-listing-US-01` becomes the section `## product-listing-US1: …`,
holding `product-listing-US1-TC1-1`, `product-listing-US1-TC2-1`, …. The
spec keeps the canonical `<capability>-US-<n>` form, and that canonical form
is what a case's `**Trace:**` line carries.

Number cases per journey from `1`. The trailing `<v>` is the case version
(starts at `1`; bump only when update mode re-words an existing case). Treat
an issued id as permanent the same way spec ids are permanent: a retired case
is marked `deprecated`, never renumbered away, and a new case takes the next
unused `TC<m>` under that journey.

Older suites may still use flat `<capability>-TC-<n>` ids
(`product-listing-TC-01`), hyphenated journey-scoped case ids, or
`## <capability>-US-<n>:` section headings; the exporter accepts them. New
generation writes the compact heading and `<capability>-US<n>-TC<m>-<v>`.

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

### Automatic — in the spec's own pull request

When `pm-planning` or `full-planning` finishes the proposal and the delta
specs, and `openspec validate <change> --strict` passes, it **immediately**
runs `/spec-to-tcs <change>` against that change. The suites land beside each
delta with every case `draft`, committed to the same branch as its own
`test(<domain>): derive test cases for <capability>` commit. Generation is part
of finishing the planning lane, not a later favour.

Drafts ride in the spec's pull request because they are derived from that
spec in that commit: no window exists where `main` carries requirements with no
suite, nothing has to reopen a change directory that already merged, and the
trace check has both halves in front of it. It costs the spec's reviewer
nothing to approve — a `draft` case carries no authority, and nobody is being
asked to stand behind one here. Standing behind them is review, it needs a
human with time, and it gets its own pull request later (see **The review
lane**).

`/spec-push` refuses to push a change whose deltas have `## User journeys` but
no `test-cases.md` beside them, and runs `pnpm run tcs:validate` alongside the
other checks.

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
`draft` by hand first — the file's own status follows them — and an agent never
does that on its own.

## What the approved suites teach the next one

Review is not only a gate; it is the store's record of how a case should
read. Every `actual` case has a reviewer's yes behind it, including the
wording they changed to get there, so the approved corpus answers the
questions this document can only answer generically: how long a title runs,
how a pre-condition states its setup, how many steps a pass takes, which
severity a degradation gets here.

`/spec-to-tcs` therefore reads that corpus before it writes. It collects
every `actual` case under `openspec/specs/` and `openspec/changes/`
(never `archive/`), weights them — the capability being generated for first,
then the product, then the store — and treats a pattern as this store's
convention when it holds across three or more approved cases, or two within
the capability at hand. Below that threshold the pattern is a coincidence and
the defaults in this document stand. A corpus with fewer than three approved
cases teaches nothing, and the run says so.

**The corpus refines how a case is written, never what it claims.** It cannot
add coverage a spec does not state, loosen "mechanism is yours, coverage is
the spec's", licence an invented label in place of a placeholder, or overrule any
rule in this document. An approved case that appears to contradict one of
those is not a new rule: the run reports it and follows the written rule, and
a human decides whether the document or the case is wrong. That is how a
convention becomes permanent — someone amends this document — rather than by
accumulating quietly in the suites.

What the run does with what it learned is settled: every `draft` case in the
suite it resolved, whether written this run or left by an earlier one, is
brought to the convention — re-worded, `<v>` bumped, id kept, status still
`draft`. Cases marked `actual` or `deprecated` are never restyled, however
far they sit from current practice; their wording is the reviewer's, and
re-wording it would quietly discard the yes behind it. Restyling never
changes a case's coverage: the steps, pre-conditions and expected results
still say what the spec says, in the words the corpus favours.

A reviewer who wants the loop to move faster has a direct lever: edit a case
during `/tcs-review` until it reads the way this store should write, then
approve it. That case is evidence from then on.

## The review lane

Review is the one part of this pipeline that a person does, so it gets its own
branch and its own pull request — never the spec's.

| | |
| --- | --- |
| Branch | `test/tcs-<capability>`, or `test/tcs-<capability>-us<n>` when the suite is split by journey |
| Commits | `test(<domain>): approve <capability> US<n> test cases` |
| PR label | `documentation` |
| Merges | At journey boundaries — not only when the whole suite is finished |

**Split a large suite by journey.** Above roughly fifteen cases, a single
branch lives for days against a moving `main` and banks nothing until it lands.
One branch per journey keeps each pull request readable and each merge small.
Below that, take the whole file on one branch; the split costs more than it
saves.

**Merge partial progress.** A journey's worth of approved cases is worth
landing on its own: the suite goes to `in-review`, the approved cases are
banked, and an interrupted review leaves its work on `main` rather than on a
branch nobody picks up again. This is also what makes `in-review` visible to
the next person.

**Push at the end of each session.** When the reviewer stops for the day,
`/tcs-review` offers to commit and push what has a verdict. Nothing is lost to
a closed laptop, and the pull request shows the day's progress. It stays a
draft PR until the branch's journeys are done.

**Two reviewers on one file is allowed.** Nothing here reserves a suite.
`/tcs-review` reports any open pull request touching the file it is about to
open — as information, never as a refusal — and re-reads the file from disk
before each verdict it writes, so a long session cannot write back a stale copy
of somebody else's approved case.

```text
/tcs-review [<capability-or-change>]
```

Review is a conversation, one **journey** at a time, and only a human approves.
A reviewer judges a journey's cases against each other — what is missing, what
is duplicated, whether the negative case belongs here — and that is not
possible one case at a time. The
`tcs-review` skill finds every suite awaiting review — any file holding a
`draft` case, which is every file not marked `approved`:

- **None** → say so, and name where suites would live.
- **Exactly one** → review it directly.
- **More than one** → list the capabilities and changes with their pending
  counts and ask which to take.

A journey arrives whole: its story, then every `draft` case under it in full,
with cases already `actual` or `deprecated` listed by id so the shape of the
journey is visible. The spec's scenarios are **offered, not quoted** — the
reviewer knows the flow, and a wall of Gherkin before every case buries the
cases. Ask for the scenarios behind a case and they are quoted in full.

The reviewer then answers for the journey: approve, change, defer, or retire,
in whatever shape suits them ("all good", "approve except TC3"). Before
anything is written the ids are echoed back, and only what was named is
marked — an approval covers the journey just shown and never widens to a case
nobody saw. Their questions ("why is this `critical`?", "where does the spec
say 20000?") are answered from the spec, quoting the clause — never from an
assumption about how the product probably works. Approving sets that case's
`**Status:**` to `actual`; deferring leaves it `draft`; retiring sets
`deprecated`. The file's own status follows from those verdicts without anyone
setting it: `in-review` from the first approval, `approved` once no `draft`
remains — and only then does it export.

## Keeping drafts at the current rules revision

Wording and styling rules in this document change while suites already exist.
When they do, bump `tcs_rules_rev` in the frontmatter and let the change reach
the drafts the same way every other convention reaches them — through a
`/spec-to-tcs` run on one capability at a time.

```text
pnpm run tcs:stale              # which suites' drafts sit below the current rev
/spec-to-tcs <capability>       # bring one suite's drafts up, one PR each
```

The report is a report. There is no sweep that rewrites every stale suite in
one commit: a diff that large is approved without being read, which is the
failure this whole pipeline exists to prevent. Run the capabilities you care
about, in their own pull requests, in the order you plan to review them.

What a run touches is unchanged from **What the approved suites teach the next
one**: `draft` cases are re-worded, `<v>` bumped, ids kept, status still
`draft`; `actual` and `deprecated` cases are never restyled. Only the
`**Drafts styled:**` line moves to the new revision.

This is transitional machinery, and it should decay. If the rules are still
churning after a year of review, the problem is the rules.

## Step 1: digest the spec (upgrade journeys if missing)

Read the capability's `spec.md` end to end — `## Purpose`, `## Feature set`,
`## User journeys`, then the requirements and their scenarios. Do not work
from a truncated view. Read the change's `proposal.md` when one exists: its
acceptance signal is what makes a case's type `acceptance`.

Then read the store's own context, because a capability spec assumes it:

- **`openspec/config.yaml`'s `context`** — the brands and their domains, the
  products, what a collector is, and the conventions every spec inherits
  (money is an integer count of minor units plus an ISO 4217 code, never a
  float). This is where a case's vocabulary comes from: write `<grade10 store
  url>`, not `<store front door URL>`, because the store has more than one
  brand and the tester needs to know which one.
- **The cross-cutting specs the Purpose names.** A public surface says so
  outright — "every requirement of `grade10-site/crawlable-pages` binds it" —
  and `localization`, `money-amounts` and `dates-and-times` bind their
  subjects the same way. Read them. They carry facts the capability spec
  never repeats: that every public address answers once per locale, that the
  default is unprefixed and Traditional and Simplified Chinese sit under
  `/tc` and `/sc`, that a title and description are per-surface.

Those facts are the platform's, not the capability's, so they belong in a
case the way the tester meets them — as something to check on the way past,
never as a pre-condition. "The site answers in more than one language" is not
a setup a tester performs; it is true. Where it matters, check it: `URL
contains <lang>`.

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
becomes one `## <capability>-US<n>: <journey title>` section in
`test-cases.md` — the compact heading id from Naming, the journey's title
copied unchanged — in the order the spec states them, carrying the same
three-line story the spec carries. **Do not include a `Covers:` bullet list
of scenario ids**, and do not add a section description, a summary, or a
case count. The actor is the role the story names — an end user of the
product (operator, admin, collector, customer), never a developer, worker,
or "the system".

Separate one journey section from the next with a horizontal rule (`---`) on
its own line, so a reader can see where a journey ends.

A scenario id listed under a journey belongs to that journey's cases. A
scenario that appears under no journey is a hole in the spec (the journey
list is incomplete) — report it; do not invent a journey to hold it. A
journey that lists a scenario id the requirements never define is also a
hole — report it.

Across a change, keep the journey count the specs already chose (at most five
total). Splitting or merging journeys is a specs edit, not a test-case edit.

## Step 3: write the test case

Each test case is one intent, written in the language of the scenarios it
derives from. It carries the components a tester needs to run it without
asking anyone a question — the nine properties from Step 5 first, then the
setup, the actions, and the outcomes.

| Component | Rule |
| --- | --- |
| **Id** | `<capability>-US<n>-TC<m>-<v>`, numbered per journey (no hyphen after `US`/`TC`, no zero-pad). |
| **Title** | A short, clean, descriptive line — roughly five to twelve words — naming the behaviour or condition under verification: "Core navigation is accessible before scripts run", "Collection missing cover image and title", "Recovering from a catalogue service failure". Sentence case. Do not open with the actor unless the actor is the point of the case, do not restate the journey title, and **never** append a trailing bracketed tag like `(Negative)`. |
| **Classification** | Immediately after the title, under the label `**Classification:**` and a blank line, a `*` bulleted list of all nine properties in the Step 5 order (Severity, Priority, Status, Behaviour, Type, Layer, Automation status, Testability, Trace). Nothing comes between the title and this block — no description, no summary sentence. |
| **Pre-conditions** | Label exactly `**Pre-conditions:**`, with the condition on the line below it. Everything that must be true before step 1: the state the actor is in, the data the catalogue holds, the configuration or network condition the scenario's GIVEN names ("Network conditions are manipulated to block static styling assets (CSS)"). Prefer one sentence; short bullets when several conditions are independent. A case that genuinely needs nothing states `None.` |
| **Test data** | Optional. The specific values the case uses, taken from the scenario — never a placeholder like "a valid amount". A `Field \| Value` table. When the case takes no input, omit the whole section — no empty table, no "None" line. |
| **Steps** | Under `**Steps:**` and a blank line, a numbered list of atomic actions the tester performs — navigate, observe, click, scroll, retry. No expected outcome on a step line. |
| **Expected Results** | Under `**Expected Results:**` and a blank line, a `*` bulleted list of observable outcomes for the case as a whole. When a multi-step flow needs it, name which step produced which outcome ("Step 2 navigates successfully to the item's detail page."). |

Those components appear in exactly that order, separated by blank lines.
There is no description field: the title says what the case is, and the
classification, pre-conditions, steps, and expected results say the rest.

Within a journey, order cases the way the actor would hit them: the positive
path first, then negatives / empty / failure paths. A journey whose cases are
all positive while its `Accepted by` list includes refusal or empty-state
scenarios is unfinished. Write `destructive` only when the journey's
scenarios state cancel, remove, withdraw, or unwind behaviour.

### A case reads like a run, not like a transcribed scenario

A scenario is one clause; a case is the pass a person actually makes. The
tester has to get to the surface, put the system into the state the scenario
assumes, look at the right place, and act — and none of that is in the
scenario's own words, because the spec is written for the engineer building
the behaviour, not for the person exercising it. A typical case is one to
four steps and one to three expected results. A one-step case that restates a
single WHEN is a scenario transcribed rather than a case written: the arrival
and the observation were left out.

Related scenarios under one journey that share a condition belong in one
case. Scenarios that verify unrelated behaviours stay separate cases, and a
distinct way the same behaviour can be reached or broken — as long as the
spec states what should happen when it is — is its own case with its own
pre-condition.

#### Pre-conditions: the setup a tester performs

State the concrete setup, in the environment's own terms, that puts the
system into the condition the scenario's GIVEN names. Not "the catalogue has
not answered" — that is the spec's phrasing of a state, and it leaves the
tester to invent the mechanism. Write what they do:

- **Manipulated conditions** — "Network manipulation is applied to delay the
  catalogue response by 5 seconds", "Network conditions are manipulated to
  block static styling assets (CSS)", "Client-side JavaScript execution is
  delayed or disabled in the browser settings".
- **Stubbed upstreams** — "The catalogue endpoint is mocked to return a
  `500 Internal Server Error`", "The store context endpoint is configured to
  return an empty payload (`null` or `{}`)".
- **Seeded data** — "The store catalogue contains multiple active
  collections", "At least one collection in the catalogue is missing its
  artwork".
- **Where the actor already is** — "The collector is viewing the collection
  tiles on the front door", "The catalogue section is currently displaying a
  failed error state, and the network manipulation is removed so the next
  request succeeds".

One sentence where one will do, two when the setup has a second half (a
failure state plus its removal). Short bullets when several conditions are
genuinely independent. `None.` only when the case truly needs nothing.

Write them against a deployed site, with placeholders where the value is the
environment's: "The catalogue in `<test environment>` holds at least two
active collections", "`<the catalogue endpoint>` is mocked to return a
`500 Internal Server Error`". A pre-condition never says the feature exists —
that is assumed — only what state it is in.

#### Steps: arrive, look, act

Number them, one action each, in the order a person performs them. The first
step is almost always the arrival — "Navigate to the store front door URL" —
because a case that starts mid-surface cannot be run cold. Then the looking
("Observe the hero section area", "Scroll to the collections section",
"Inspect the page source for the metadata tags") and the acting ("Click the
incomplete collection tile", "Click the browser's Back button", "Wait for the
catalogue request to fail"). No expected outcome on a step line.

#### Expected results: what the tester must see

One to three bullets, each an observable outcome — the thing that worked,
and, where the spec states it, the thing that must survive alongside it
("Both buttons still work", "Rest of the page renders"). Name the step when a
multi-step flow needs it ("Step 2 opens the card's page"). Every bullet is
checkable by looking; none is a step in disguise.

#### Name the UI event, not the spec's UX term

A spec talks to an engineer, so it names a control by the job it does
("shopping affordance") and a state by a product word ("unscoped",
"narrowing"). A case talks to a tester looking at a page. Write the step or
expected result as the UI event or page state they actually check:

- **Activate** → the click that fires it (`Click the shop button in the hero`)
- **Navigate / render** → the browser event (`The browser navigates to
  <grade10 browse listing url>`)
- **Unscoped / not narrowed** → what the address and the list show (`The
  listing URL names no collection`, `Cards from the whole catalogue are
  listed`)

Do not paste UX or HCI terms into the steps or expected results —
affordance, unscoped, narrowing, way on, scoped — even when the spec uses
them. Translate each into the click, the navigation, the URL, or the listed
cards it stands for. Coverage is unchanged: you are not adding a
requirement, you are naming the event that already satisfies one.

The spec still identifies *which* control (shop vs auction). A placeholder
still stands in for a value the spec leaves open. Do not invent a visible
label (`"Shop now"`) unless the spec itself gives it.

#### Say it in as few words as possible

A tester reads a case while doing something else, so every line has to land
at a glance. Ten words is plenty for a bullet; a step is a short imperative.
Drop the throat-clearing — "The front door renders successfully, with the
marketing hero visible immediately" is `Front door renders, hero visible`.
Cut "successfully", "as expected", "the application", "the user is able to".
One idea per bullet; split rather than joining with "and" twice. Short is not
vague: `Hero is missing` is vague, `Hero collapses, page layout intact` is
short and checkable.

#### Write for a site that is built, and name what it will have

This store develops from its specs, and a suite is written for a pass that
runs after the development is finished. So write every case as though the
surface exists and is deployed: no conditionals about whether a page is
there, no hedging about what the application "would" do, no case that only
makes sense against an unbuilt product. The tester opens the site and runs it.

Much of what such a pass needs is certain to exist without the spec fixing
its value — the front door has an address, the catalogue is read from
somewhere, a collection has a scoped listing. Name those with an
**angle-bracket placeholder** and let the tester substitute the real value
when they run:

```markdown
**Steps:**

1. Navigate to <store front door URL>.
2. Scroll to the collections section.
3. Click the tile for <a collection holding cards>.

**Expected Results:**

* The front door renders successfully.
* The browser navigates to <that collection's scoped listing URL>, showing
  only that collection's cards.
```

Rules for a placeholder:

- **Self-describing, in the store's own words.** A tester resolves it
  without asking anyone, and it names the brand or product the store names:
  `<grade10 store url>`, `<grade10 browse listing url>`, `<the catalogue
  endpoint>`, `<a collection with no artwork>`. Never `<url1>`, never
  `<TBD>`, and never a generic `<store url>` where the store runs more than
  one brand.
- **`<lang>` is the locale segment.** Public addresses answer once per locale,
  so `<lang>` stands for the prefix in force — nothing for the default,
  `/tc`, `/sc`. `URL contains <lang>` is the standing check that a localized
  address behaved.
- **Only for what the spec leaves open.** A placeholder is for the value, not
  for the thing. Where the spec names a control, name the UI thing a tester
  clicks (`Click the shop button in the hero`), not the spec's UX term and
  not an invented label.
- **Consistent within a suite.** The same surface is the same placeholder in
  every case, so a tester resolving one resolves all of them.
- **Anywhere in the case.** Pre-conditions, steps and expected results all
  take placeholders; "The browser navigates to `<browse listing URL>`" is a
  perfectly checkable outcome.
- **Never wrapped, never capitalised.** A placeholder stays on one line so it
  can be found and substituted mechanically, and it reads the same wherever
  it appears — rewrite the sentence rather than break `<a collection holding
  cards>` across a line or open one with a capital because it fell at the
  start of a sentence.

This retires the older habit of inventing a label and softening it with an
`e.g.` — `Click the UI option (e.g., "View All")` guesses at the product,
where `Click the row's browse-all button` states what the spec guarantees
and leaves the visible label to the person looking at the screen. Use `e.g.`
only where the spec itself gives the example.

#### The arrival is allowed its own assertion

A case may confirm, as its first expected result, that the surface it
navigated to came up — "The front door renders successfully", "The listing
loads". That is not new coverage; it is what lets a tester tell "I could not
get there" apart from "the behaviour is wrong", and it is the one outcome a
built site is assumed to provide. Everything after that first bullet is the
spec's, and a case whose expected results are *only* the arrival is not a
case — it is a smoke check with nothing to verify.

#### The line: mechanism is yours, coverage is the spec's

How the tester reaches the condition, where they look, and what they click is
the case's own — invent it freely and concretely, because the spec never
states it. **What must then be true is the spec's, always.** An expected
result the traced scenarios do not state is a new requirement however
reasonable it sounds, and a failure mode the spec says nothing about is not a
case at all: it is a gap, reported to the spec's author. "The CSS is blocked"
is a legitimate pre-condition only because the spec says the surface answers
whole in the response HTML; "the page renders a fallback hero" is only a
legitimate expected result if the spec says so somewhere.

### Steps and expected results

One action per numbered step. "Sign in, open settings, and change the
password" is three steps. Outcomes live in **Expected Results**, never inline
beside a step:

```markdown
**Pre-conditions:**
Client-side JavaScript execution is delayed or disabled in the browser
settings.

**Steps:**

1. Navigate to <store front door URL>.
2. Observe the initial page load state.
3. Click the shop button in the hero.
4. Click the auction button in the hero.

**Expected Results:**

* Front door renders, hero visible.
* Both buttons open their destinations without JavaScript.
```

A continuous user flow whose Then-chain is one outcome stays one case
(several steps, one expected-results list). Prefer splitting when two
scenarios verify unrelated behaviours.

The scenario's Given/When/Then clauses fix what each part is *about*; the
tester-facing wording of the setup, the arrival and the looking is the case's
own:

| Scenario clause | Where it lands |
| --- | --- |
| `GIVEN` | **Pre-conditions**, written as the setup that produces that state, or a test-data row when it carries a value. |
| `WHEN` | A numbered **Steps** entry, preceded by the steps needed to reach it. |
| `AND` following a `WHEN` | The next numbered step, in order. |
| `THEN` / `AND` following a `THEN` | Bullets under **Expected Results**, in the spec's own substance. |

### Every case stands alone

A case never depends on another case having run, and never refers to another case or scenario for its setup. "The listing from `SC-10`, where A's maximum is 50000" becomes pre-conditions and test data written out in full, in this case. Two cases repeating the same setup is cheaper than a suite that only passes when run in order.

### Say it plainly, and say only what the spec claims

Write for whoever runs it: specific, unambiguous, no jargon, no internal
names. "Click the collection tile" beats "dispatch the tile's click handler".
Prefer the concrete over the abstract everywhere the concreteness is the
tester's to choose — the URL they open, the section they scroll to, the way
the environment is manipulated.

The limit is on claims, not on concreteness. An expected result, or a rule a
step assumes, that the traced scenarios do not state is a new requirement
however reasonable it sounds. Where the spec leaves a value open, a
placeholder names it without claiming anything; where the spec names a
control by its role, the case uses the spec's words. If a case cannot be
written without claiming something the spec does not say, the gap goes back
to the spec's author.

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

| Control | Renders |
| --- | --- |
| Shop button | the browse listing, whole catalogue |
| Auction button | the auction surface |
```

Every value comes from a scenario. A data table is not a place to generate
variations the spec never stated. A case that takes no input omits the
`**Test data:**` section entirely — it carries neither an empty table nor a
"None" line.

## Step 5: classify the case

Nine properties, in this order, every one of them on every case. The
vocabularies are Qase's, so a suite exports without translation.

Most cases in a UI suite land in the same place, and the shapes below are the
starting point, not a substitute for reading the case: a core positive path
is `critical` / `high`; a degradation the journey survives is `major` /
`medium`; an empty state is `normal` / `medium`; a presentational fallback is
`minor` / `low`. A case a person exercises through the interface is `e2e`, and
a case worth both a script and an occasional human eye is
`automation, manual`.

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

A case whose pre-condition is something broken, missing, stubbed out or cut
off — an empty payload, a blocked asset, a `500`, a dropped connection, a
malformed parameter — is `negative`, even when the expected result is that
the product carries on gracefully. What makes it negative is what the case
feeds the product, not whether the product survives it.

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
| `automation, manual` | Both — automatable, and still worth a human's eye. |

### Trace

The journey this case derives from, in the spec's canonical form —
`<capability>-US-<n>` (`home-US-01`) — even though the section heading above
it uses the compact `home-US1`. One journey per case: a case that would have
to trace two journeys is two cases, or belongs to a journey the spec has not
written yet. Fall back to `<requirement> / <journey title>` only when the
spec has no ids yet.

A case with no trace does not belong in the file.

Scenario-level coverage is still checked, just not recorded case by case on
this line: generation verifies that every user-facing scenario accepting a
journey is covered by at least one of that journey's cases, and reports any
scenario nothing covers as a gap for the spec's author.

## The file header

A suite carries at most three lines under its title, and every one of them is
computed rather than chosen:

```markdown
# <product>/<capability> Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-05, tcs-rules r1
**Reviewed:** 2026-09-12
```

### Status is derived, never claimed

The file status is a pure function of the statuses of the cases below it:

| Cases in the file | File status |
| --- | --- |
| Every case `draft` (or the file holds none yet) | `pending-review` |
| At least one `actual` or `deprecated`, and at least one `draft` left | `in-review` |
| No `draft` left | `approved` |

Nobody types it. `/spec-to-tcs` and `/tcs-review` recompute it after every
write, and `pnpm run tcs:validate` fails a file whose header disagrees with its
cases. Two consequences worth stating outright:

- **`in-review` is progress, not a claim.** It says a reviewer has started and
  has not finished. It reserves nothing: a second reviewer may take another
  journey of the same suite at the same time, on their own branch. Being
  derived is what makes that safe — the one line two branches are guaranteed
  to collide on has a single correct value that either side can recompute from
  the merged cases, so the conflict resolves mechanically instead of by
  judgement.
- **A suite can lose `approved`.** A spec change that adds a `draft` case drops
  the file back to `in-review` on its own, without anyone remembering to.

Only `approved` exports. `pending-review` and `in-review` files export nothing,
whatever the state of the individual cases inside them.

### Drafts styled

```markdown
**Drafts styled:** 2026-09-05, tcs-rules r1
```

The revision of *this document* that the file's `draft` cases were last written
against, and when. It is present exactly when the file holds at least one
`draft`, and absent otherwise.

The scope is the point. `actual` cases are deliberately out of it: a reviewer's
yes is what makes a case's wording house style, so an approved case is at the
current convention by definition and carries no revision of its own. A
file-level stamp claiming to cover every case would be a lie the moment a suite
is mixed — half of it re-worded this week, half frozen under whatever rules
were current when it was approved.

`tcs_rules_rev` in this document's own frontmatter is the current revision.
Bump it by hand when you change how a case should read; leave it alone for a
typo. `pnpm run tcs:stale` then lists the suites whose drafts sit below it.

### Reviewed

```markdown
**Reviewed:** 2026-09-12
```

The date the file last reached `approved`, written by `/tcs-review` on that
transition and removed if the file falls back out of `approved`. Present
exactly when the status is `approved`. No reviewer name: git already records
who, and a name in the file goes stale the moment a second person touches the
suite.

## The format

A suite is the file title, the file status, then one section per journey,
separated by horizontal rules. Every case is a title, a classification block,
pre-conditions, optional test data, numbered steps, and an expected-results
list — in that order, a blank line between each part:

````markdown
# <product>/<capability> Test Cases

**Status:** pending-review
**Drafts styled:** <YYYY-MM-DD>, tcs-rules r<n>

## <capability>-US<n>: <journey title, copied from the spec heading>

**As a** <role>,
**I want** <goal>,
**so that** <reason>.

### <capability>-US<n>-TC<m>-<v>: <clean descriptive title>

**Classification:**

* **Severity:** blocker | critical | major | normal | minor | trivial
* **Priority:** high | medium | low
* **Status:** draft
* **Behaviour:** positive | negative | destructive
* **Type:** functional | smoke | regression | acceptance | usability | security | performance | compatibility | integration
* **Layer:** e2e | api | unit
* **Automation status:** manual
* **Testability:** automation | manual | automation, manual
* **Trace:** <capability>-US-<n>

**Pre-conditions:**
<from GIVEN — one sentence, or short bullets; or "None.">

**Test data:**

| Field | Value |
| --- | --- |
| <Key> | <Value> |

**Steps:**

1. <from WHEN>
2. <from the next AND>

**Expected Results:**

* <from THEN>
* <from AND following THEN>

### <capability>-US<n>-TC<m+1>-<v>: <the next case under this journey>

…

---

## <capability>-US<n+1>: <the next journey>
````

Fixed points, none of them optional:

- The header lines are computed, not chosen — see **The file header**.
  `**Drafts styled:**` is present exactly while the file holds a `draft`;
  `**Reviewed:**` exactly while it is `approved`.
- The journey heading and its three-line story are copied from `spec.md`,
  the heading id in its compact form. No `**Covers:**` list.
- `**Classification:**` sits immediately under the case title, its nine
  bullets marked with `*`, in the order above. Generation always writes
  `**Status:** draft` and `**Automation status:** manual`.
- `**Test data:**` is the one section a case may omit — omitted whole when
  the case takes no input.
- A blank line follows every `**Label:**` that heads a list, and separates
  every part of a case. A `---` rule separates journey sections.
- A case with no pre-conditions line, or an empty **Expected Results** list,
  is not finished.

Older suites may still carry a `**Description:**` paragraph, a `**Covers:**`
list, `**Preconditions:**` (no hyphen), a `**Properties:**` block at the end
of the case with `-` bullets, or a `| # | Action | Expected result |` steps
table. New generation writes the shape above; the Qase exporter accepts both.

Execution belongs to the run, not to this file. There is no Actual result and
no Pass/Fail column here — a suite is the authored artifact, and what happened
on a given run lives in Qase (or wherever the pass is recorded) against the
exported case.

## Workflow summary

Two pull requests, two audiences.

**The spec PR** — written by whoever owns the requirements:

1. `pm-planning` or `full-planning` writes proposal + specs (Feature set, User
   journeys, id'd scenarios) → `openspec validate --strict` →
   **auto-generates** `test-cases.md` for every delta that has journeys via
   `/spec-to-tcs <change>`, every case `draft`, as its own commit on the same
   branch.
2. `/spec-push` validates (including `pnpm run tcs:validate`), pushes, and
   merges. `main` now carries requirements and their draft coverage together.

**The review PR** — written by QA, one per capability or per journey:

3. `/tcs-review` walks the `draft` cases with a human: `draft` → `actual` or
   `deprecated`, pushed at the end of each session, merged at journey
   boundaries. The file's status follows its cases on its own —
   `pending-review` → `in-review` → `approved`.

**Standing maintenance:**

4. When a delta adds, edits, or removes a scenario or journey, run
   `/spec-to-tcs` in the same PR and take the update path — new cases arrive
   `draft`, retired ones become `deprecated`, reviewed ones keep their ids.
5. When this document's wording rules change, bump `tcs_rules_rev`, then work
   `pnpm run tcs:stale` one capability at a time.
6. Only `actual` cases in `approved` suites leave this repository, and only
   when someone runs an export. Nothing exports on its own.

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
| `/spec-to-tcs <capability-or-change>` (`spec-to-tcs` skill) | If journeys are missing, rewrites the resolved `spec.md` to `openspec/config.yaml` specs rules; learns this store's conventions from every `actual` case in the corpus; then derives suites under `openspec/specs/` or `openspec/changes/` and writes `test-cases.md` beside that `spec.md` with every new case `draft`, bringing the suite's existing drafts to the same conventions. Shows an existing suite and asks before touching it; refuses to regenerate over `actual` cases or an `approved` file. Read `.cursor/skills/spec-to-tcs/SKILL.md`. |
| `/tcs-review [<capability-or-change>]` (`tcs-review` skill) | Finds suites awaiting review, walks their `draft` cases with a human one journey at a time, quotes the spec's scenarios on request, and records `actual` / `deprecated` / left-`draft`. Every case it marks `actual`, edits included, becomes evidence the next `/spec-to-tcs` run learns from. Read `.cursor/skills/tcs-review/SKILL.md`. |
| `pm-planning` / `full-planning` skills | After proposal + specs validate, run `/spec-to-tcs <change>` automatically and commit the drafts to the spec's own branch. |
| `spec-push` skill | Refuses a change whose deltas have journeys but no suite, and runs `pnpm run tcs:validate` with the other checks before pushing. |
| `pnpm run tcs:validate` (`scripts/openspec/validate-test-cases.mjs`) | Checks every suite against this document: the header matches the cases below it, ids are unique and journey-scoped, a trace resolves against the `spec.md` beside it, no case ships with an empty Expected Results list. Errors fail; suites in older shapes warn. Runs in CI on every push. |
| `pnpm run tcs:stale` | Lists the suites whose `draft` cases sit below the current `tcs_rules_rev`. A report, not a sweep. |

Change deltas use the same format under
`openspec/changes/<change>/specs/<product>/<capability>/test-cases.md`.

## See also

- [`prd-and-openspec.md`](prd-and-openspec.md) — why `spec.md` is the sole
  source of truth
- [`ui-component-testing.md`](ui-component-testing.md) — the separate
  automated coverage obligation for UI components
- `openspec/config.yaml` — Feature set, User journeys, and id rules this
  derivation assumes
