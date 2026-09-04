---
name: spec-to-tcs
description: Derive classified test cases from the user journeys - a capability's feature-tcs.md, a domain's domain-tcs.md, a product's product-tcs.md, or the store's cross-product platform-tcs.md. Use when QA or a PM asks to turn a durable capability, a domain, or an OpenSpec change into test cases, or when a change's specs are finished and auto-generate suites. Invoke as /spec-to-tcs [platform|product|domain|feature] <target>.
---

# Generate test cases from a capability's user journeys

Follow `docs/governance/specs-to-test-cases.md` — this skill is that
document's workflow, automated, ensuring strict traceability, NLP automation readiness, and comprehensive behavior coverage. Read it in full before the first run in a session; it defines the format, the property vocabularies, and the review lifecycle this skill produces.

Invoke as `/spec-to-tcs [platform|product|domain|feature] <target>`. Reviewing a suite and transitioning it to actual/approved is handled strictly by `/tcs-review` (`.cursor/skills/tcs-review/SKILL.md`). Manual "peer review" is deprecated.

## The level comes first

| Level | Writes | Covers | Owes |
| --- | --- | --- | --- |
| `platform` | `openspec/specs/platform-tcs.md` | paths across products | nothing — smoke |
| `product` | `<product>/product-tcs.md` | paths across the domains of one product | nothing — smoke |
| `domain` | `<product>/<domain>/domain-tcs.md` | paths across the capabilities of one domain | every cross-capability path its journeys imply |
| `feature` | `<capability>/feature-tcs.md` | one capability's own journeys, its refusals and edge cases | every scenario its journeys accept |

A suite's file name carries its level. `test-cases.md` is not a suite name —
the suites that carried it were renamed at r3.0 — so never write one, and never
write a second file beside a suite that already exists.

**Which level owns a case is not a matter of taste.** The spec that states the
behaviour owns the case: a capability's feature suite covers what its own
`spec.md` says, wherever the outcome is observed. `grade10-admin/auction/listing`
SC-16 has a collector opening `/auction/listings/<slug>`, and that case is the
listing capability's even though the address is a site page.

The levels above hold only **composed** paths — ones no single spec states end
to end — and a composed case names every journey it walks:

| Level | Its cases trace |
| --- | --- |
| `domain` | ≥2 journeys, from ≥2 capabilities of that domain |
| `product` | ≥2 journeys, from ≥2 domains of that product |
| `platform` | ≥2 journeys, from ≥2 products |

A case at those levels with a single trace is a feature case written at the
wrong level, and `pnpm run tcs:validate` fails it. **Compose from evidence,
never from imagination:** read every `user-journeys.md` and every `docs/prds/`
page in scope first, and never write a path you cannot trace to journeys that
exist. Read **One purpose, one case** in the governance document before
deciding.

`product` and `platform` are **smoke passes, not coverage** — a handful of long
paths, every one `**Suites:** smoke`, written to answer *does the whole thing
still work together*. They deliberately re-walk what the levels below cover,
because they ask a different question. One that grows past a page has stopped
being a smoke pass. Write neither where there is no path to hold it: a
one-domain product has no cross-domain path, and its missing suite is not a gap.

**Infer the level from the target when no argument is given** — a directory
holding `spec.md` is `feature`, a `<product>/<domain>` directory is `domain`, a
product directory is `product`, `openspec/specs/platform-tcs.md` is `platform`,
and an explicit file path is whatever its name says. Say which level you took.
Ask only when the target itself is ambiguous (a name matching both a capability
and a domain).

**Run the levels top down** — `platform`, `product`, `domain`, then `feature` —
when a change touches more than one. The higher file names the paths; the level
below covers what those paths do not reach. Deriving in the other order makes
every lower suite a guess at what the level above will claim. Say so and offer
the higher run first when the user asks for a suite whose level above is
missing or older than the change.

### What a domain, product or platform run reads and writes

Read all of it before writing:

- the changed capability's `user-journeys.md` in whichever tree the change owns;
- every sibling capability's `user-journeys.md` under
  `openspec/specs/<product>/<domain>/`;
- the domain's product record — `docs/prds/products/<product>/<domain>/index.md`
  and each capability page — for the decisions, the product's own names for
  surfaces and controls, and the seeded values a pass is written against.

Reading only the change loses the siblings that make a path cross-feature;
reading only `openspec/specs/` misses the change the run exists to cover.

A `product` run reads every domain's `user-journeys.md` in that product, and
its pages under `docs/prds/`. A `platform` run reads the same way one scope
wider: every product's `user-journeys.md` under `openspec/specs/`, and the
product records beside them. Name the products the path crosses first, then
read those.

A domain suite issues `<product>-<domain>-e2e-US<n>-TC<m>-<v>`, its journeys
numbered its own way — an `e2e` journey is a path, not a copy of a capability's
story — and each case's `**Trace:**` names every capability journey it crosses,
in the order the case reaches them. A case whose pre-conditions and steps all
sit inside one capability does not belong there: it is that capability's.

A product suite issues `<product>-e2e-US<n>-TC<m>-<v>`, and a platform suite
`platform-e2e-US<n>-TC<m>-<v>`, both the same way — `e2e` in the capability
slot, journeys numbered their own. A product case never leaves its product; a
platform case crosses products. A case that stays inside one domain belongs to
that domain, or to the capability whose spec states it.

Works against **both** trees equally — durable specs and in-flight change
deltas. The suite always lands beside the `spec.md` you resolved, next to the
`user-journeys.md` it derives from.

The output is **not** a one-to-one transcription of scenarios, and it does
**not** invent flows. The journeys are already named in `user-journeys.md`
beside the spec (with `<capability>-US-<n>` ids and the `<capability>-SC-<n>`
scenario ids that accept each story). Each journey becomes one suite section;
each case traces scenario ids.

1. **Resolve the target.** The user names a change, a capability, or a path.
   Both locations are valid; pick from what they asked for:

   | Argument | Resolves to |
   | --- | --- |
   | A change name (`add-auction-auto-bidding`) | Every delta `spec.md` under `openspec/changes/<change>/specs/` |
   | A capability id (`grade10-site/auction/auto-bidding`) | That capability under `openspec/specs/` **and/or** any active delta — see below |
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
   generation, check whether a suite already sits beside the resolved
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
   | Update this suite | Continue from step 3, in update mode (step 9). |
   | Work on another capability or change | Go back to step 1 with the new target. Leave this file untouched. |
   | Regenerate the whole suite | Only after the guard below, and only after an explicit second confirmation that review history will be lost. |

   **Refuse to regenerate or delete** — no matter how the request is
   phrased — when the file's `**Status:**` is `approved`, or when **any**
   case in it has `**Status:** actual`. Say which cases block it, and offer
   the update path instead: new scenarios become new `draft` cases, retired
   ones become `deprecated`, reviewed cases keep their ids and properties. A
   reviewer who truly wants a clean rewrite must move those cases back to
   `draft` themselves first via `/tcs-review`; never do that for them, and never delete a
   suite file.

3. **Digest the spec and the store's context — and upgrade the spec if
   journeys are missing.** Read the spec end to end from disk. Read the
   change's `proposal.md` when the target is a delta (or when a linked change
   exists): its acceptance signal is what makes a case's type `acceptance`.

   Then read what the capability assumes rather than states:

   - **`openspec/config.yaml`'s `context`** — brands and their domains, the
     products, the reader, and the conventions every spec inherits (money is
     an integer count of minor units plus an ISO 4217 code). A case's
     vocabulary comes from here: `<grade10 store url>`, not `<store front
     door URL>`.
   - **The cross-cutting specs this capability's Purpose names** — a public
     surface says "every requirement of `grade10-site/site/crawlable-pages` binds
     it"; `localization`, `money-amounts` and `dates-and-times` bind their
     subjects the same way. They carry facts the capability never repeats:
     every public address answers once per locale, the default unprefixed and
     Traditional and Simplified Chinese under `/tc` and `/sc`; each surface
     has its own title and description.

   Those are platform facts, not setups. Never write one as a pre-condition
   ("the site answers in more than one language" is true, not something a
   tester arranges) — check it where it matters instead: `URL contains
   <lang>`.

   If there is no `user-journeys.md` beside the spec, or it is empty, **do
   not stop.** First bring the capability in line with this store's rules in
   `openspec/config.yaml` (`rules.specs` and `rules.user-journeys`), then
   continue this skill on the same target:

   1. Re-read those rules in full (Purpose → Feature set → requirements in
      `spec.md`; INVEST stories in `user-journeys.md`; permanent
      `<capability>-US-<n>` / `<capability>-SC-<n>` ids; at most five
      journeys across every capability a change touches).
   2. Write `user-journeys.md` beside the spec **without inventing
      requirements**. Keep every existing SHALL and every existing scenario
      clause in `spec.md`, adding a Feature set there if it has none; derive
      the journeys from what is already written; give every story and
      scenario a stable id; write each story on three labeled lines
      (`**As a**`, `**I want**`, `**so that**`) and an `**Accepted by:**`
      bullet list of `` `id` — Scenario title `` (never a comma dump);
      number ids from 01 and never reuse a retired number. For a multi-file
      change, keep the journey cap across all of its capabilities.
   3. Validate when the target is a change:
      `openspec validate <change-name> --strict`.
   4. Report what you changed in the spec (journeys added, ids issued),
      then **continue from step 4** on the updated file.

   Only refuse when the file has no checkable scenarios at all (nothing to
   hang a journey on). That gap goes to the author; do not invent behavior.

4. **Learn the house style from the cases QA has already approved.** Before
   writing anything, read the store's approved corpus and let it settle the
   questions this skill's prose can only answer generically. Scan
   `openspec/specs/**/*-tcs.md` and
   `openspec/changes/*/specs/**/*-tcs.md` (never `archive/`) and collect
   every case whose `**Status:**` is `actual` **in a file whose
   `**Reviewed:**` line names the current **major** of `tcs_rules_rev`**. Those
   cases — and only those — are evidence: a reviewer read each one against its spec and
   stood behind it, including any wording they changed on the way. `draft`
   cases are your own past output and prove nothing; `deprecated` cases are
   retired.

   A suite approved under an older **major**, or before the revision was
   recorded at all, is **not** evidence. A minor behind still teaches: a minor
   moves wording a little, and filtering it out would empty the corpus every
   time one landed. Its wording was right for the rules
   of its day and nothing re-words an approved case for style alone, so
   learning from it would undo the rules change one generated suite at a time.
   Read it for nothing, and name it in the report as approved-but-stale.

   Weight the evidence: approved cases in the capability you are generating
   for first, then the same product, then anywhere in the store. A pattern
   counts as a convention when it holds across **three or more** approved
   cases, or **two within the capability you are writing for**. Below that
   it is a coincidence — ignore it and follow this skill's defaults. When
   the corpus holds fewer than three approved cases at the current revision,
   say so in the report and generate from the defaults alone — which is the
   expected state right after a rules bump, not a problem to work around.

   What to take from the corpus:

   | Learn | Examples of what you are reading for |
   | --- | --- |
   | Title shape | How long, whether the actor leads, sentence case, the verbs reviewers kept |
   | Pre-condition phrasing | How the setup is stated — the mocking, seeding and manipulation vocabulary this store approves |
   | Step granularity | How many steps a case runs to, how the arrival step is worded, what counts as one action |
   | Expected-result shape | How many bullets, how outcomes are phrased, when step numbers are named |
   | Property calibration | Which severity / priority / type / layer / testability values reviewers approved for which kinds of case |
   | Domain vocabulary | The store's own names for surfaces, controls and states, as reviewers left them |

   **What you may never learn.** The corpus refines *how a case is written*,
   never *what it claims*. It cannot add coverage the spec does not state,
   loosen the rules in step 6's "line to hold", authorise inventing a label
   without `e.g.`, or change any prohibition in this skill or in
   `docs/governance/specs-to-test-cases.md`. Where an approved case appears
   to contradict one of those, the case is not a new rule — report it in
   step 10 as something for a human to resolve, and follow the written rule
   this run.

   **Apply what you learned to the drafts already in the resolved suite.**
   Every case whose `**Status:**` is `draft` — the ones you are writing now
   and the ones a previous run left behind — is brought to the learned
   convention: reword it, bump its `<v>`, and leave it `draft`. Keep its id.
   Never touch a case whose status is `actual` or `deprecated`, and never
   change a case's coverage while restyling it — the steps, pre-conditions
   and expected results still say exactly what the spec says, in the words
   the corpus favours. List every draft you re-worded, and why, in step 10.

5. **Take the journeys as the suite's sections.** Each
   `### <capability>-US-<n>: …` in `user-journeys.md` becomes one
   `## <capability>-US<n>: …` section, in spec order — the journey id in its
   compact form (hyphen after `US` dropped, no zero-pad: spec `grade10-site-store-home-US-01`
   becomes section `## grade10-site-store-home-US1:`), the journey title copied unchanged.
   **You must restate the user journey completely:** carry over the same
   three-line story (`**As a**` / `**I want**` / `**so that**`) exactly as
   the spec uses it. **Do not include a `Covers:` bullet list of scenario
   ids**, a section description, or a case count. Separate one journey
   section from the next with a `---` rule on its own line.

   **User-Perspective Strictness:** The actor is the role the story names, and it resolves to one of two classes — `customer` (anyone outside the business) or `admin` (anyone inside it). Every other role the specs name — collector, member, shopper, bidder, borrower, auction operator, shop staff, treasurer, auditor — is one of those two holding a state or a grant, which is a pre-condition, not an actor. A journey whose actor is neither class is not a journey: report it, and do not derive cases from it. If a traced scenario represents a purely technical requirement (e.g., database schema changes, backend cron jobs, internal system state) with no observable user-facing outcome, **do not generate a test case for it**. A scenario under no journey, a purely technical scenario, or a journey listing an id the requirements never define, is reported in step 10. Every case must map 1-to-N to a User Story. Orphaned test cases are strictly prohibited.

6. **Write the test cases for each journey.** Number them
   `<capability>-US<n>-TC<m>-<v>` per journey (no hyphen after `US`/`TC`, no
   zero-pad — e.g. `grade10-site-store-product-listing-US1-TC1-1`). `n` is the journey number
   from the matching spec `US` id; start `TC` at `1` under each journey;
   start `<v>` at `1` and bump only when update mode re-words an existing
   case. Positive / happy path first, then empty / missing / failure
   (negative), then destructive only when the journey's scenarios state
   cancel, remove, withdraw, or unwind behaviour.

   Take substance from the traced scenarios' GIVEN / WHEN / THEN clauses,
   written strictly from the user's perspective. Each case carries, in this
   exact order:

   - **Title** — A short, clean, descriptive line — roughly five to twelve
     words — naming the behaviour or condition under verification, in
     sentence case: "Core navigation is accessible before scripts run",
     "Collection missing cover image and title", "Recovering from a catalogue
     service failure". Do not open with the actor unless the actor is the
     point of the case, do not restate the journey title, and **never**
     append a trailing bracketed tag like `(Negative)`.
   - **Classification Block** — Immediately following the title, under the
     label `**Classification:**` and a blank line, a bulleted list (`*`) of
     all ten required properties (Severity, Priority, Status, Behaviour,
     Type, Suites, Layer, Automation status, Testability, Trace). Nothing comes
     between the title and this block — no description, no summary sentence.
     See step 7 for the property vocabulary.
   - **Pre-conditions** — Label exactly `**Pre-conditions:**`, with the
     condition on the line below it. Write the **concrete setup a tester
     performs** to put the system into the state the scenario's GIVEN names,
     in the environment's own terms — not the spec's abstract phrasing of
     that state. Four shapes cover almost everything: a manipulated
     condition ("Network manipulation is applied to delay the catalogue
     response by 5 seconds", "Client-side JavaScript execution is delayed or
     disabled in the browser settings"), a stubbed upstream ("<The catalogue
     endpoint> is mocked to return a `500 Internal Server Error`"), seeded
     data ("The catalogue in <test environment> holds at least two active
     collections"), or where the actor already is ("The collector is viewing
     the collection tiles on the front door"). Never state that the feature
     exists — a suite is written for a built site, so that is assumed; state
     only what state it is in. Write them as bullets, one condition each,
     holding five rules: **state, not actions** (where the system is and what
     data exists — never a click, a submit or a navigation); **specific**
     (qualified by what the rule under test needs, not "a signed-in user");
     **domain words** (no endpoint names, tables or provider product names);
     **independent** (each case sets up everything it needs, and never
     describes another case's outcome); **reusable** (the same condition
     phrased identically everywhere it appears, so one step definition binds
     it). `None.` only when the case truly needs nothing.

     A suite whose cases genuinely all share a setup may carry one
     `## Background` section before the first journey holding those
     conditions and their data once; each case then adds only what is its
     own. Background is optional and belongs only where *every* case shares
     what it holds.
   - **Roles** — inside a case the actor is `customer` or `admin`, with the
     state or grant the case needs in brackets after it, stated in the
     pre-conditions: `customer(gold member) is on the shopping cart page`,
     `admin(shop staff) is on the loyalty member page`, `admin(holds
     `auction:operate`) is on <grade10 auction admin listings url>`. A bare
     `customer` is one in no particular state. Two of a class acting are
     `customer A` and `customer B`. Journey titles and stories keep the
     product's own words; the cases under them carry the class. A role is
     never a test data row.
   - **Test data (Optional)** — A `Field | Value` table of the values the
     case uses, taken from the scenario. Do not use hard-coded PII. When the
     case takes no input, omit the whole section — no empty table, no "None"
     line.

     **Name the data, then use the name.** Any value a run could reasonably
     change — a file, an amount, a seeded record, a moment on the clock —
     gets a `<placeholder>` row and is referred to by that name from the
     pre-conditions, the steps and the expected results. A literal in a step
     is a value the next tester cannot vary and a script cannot vary at all.
     Where an expected value is derived, state the derivation rather than the
     arithmetic: "Highest bid reads `<user B maximum>` plus `<increment>`"
     survives a change of seed; "Highest bid reads 530000" does not.

     **One name, one state.** A placeholder stands for one record in one
     state across the whole file: `<listing_1>` and `<listing_6>` when two
     cases need a listing in different states, numbered in order of first
     appearance, each row defining what it stands for ("A live listing led by
     user A, current bid `<leader price>`"). Cases needing the same state
     share the name and repeat the row. One name for two states produces a
     suite that cannot pass against one seeded environment.

     **Make the spec's markers concrete.** Where the spec names a moment or a
     quantity abstractly ("a valid bid at time T"), give the tester a number
     as test data, derived from the rule rather than invented against it:
     `<bid time>` "5 minutes before the recorded close", and the expected
     `<new time left>` "one `<extension duration>` from the accepted bid".
     Keep the derivation in the expected result, and never let the concrete
     value contradict the rule it came from.

     **One case, many rows.** When the steps are identical and only the data
     differs, write one case with a row per run — a column per varying value
     and one for the outcome — and put "Runs once per row of **Test data**."
     on the line under the title. Two refusals with one set of steps are one
     case.
   - **Steps** — Under `**Steps:**` and a blank line, a numbered list of
     atomic actions the tester performs, in the order a person performs
     them: **arrive, look, act**. A case must be runnable cold, so the
     arrival is stated somewhere — either as the first step (`Navigate to
     <store front door URL>`) or as a pre-condition placing the actor there
     (`The admin is on <admin listings url>`), in which case the steps start
     at the first action under test; one or the other, never neither; then the looking (`Observe the
     hero section area`, `Scroll to the collections section`, `Inspect the
     page source for the metadata tags`) and the acting (`Click the
     incomplete collection tile`, `Click the browser's Back button`, `Wait
     for the catalogue request to fail`). One action per number, no expected
     outcome on a step line, typically one to four steps and never more than
     about 10–15.
   - **Expected Results** — Under `**Expected Results:**` and a blank line, a
     bulleted list (`*`) of one to three observable outcomes for the case as
     a whole, each a full sentence: the thing that worked, and — where the
     spec states it — the thing that must survive alongside it ("The core
     navigation links remain visible and functional"). The first bullet may
     confirm the surface came up ("The front door renders successfully"), so
     a tester can tell "I could not get there" from "the behaviour is wrong";
     a case whose expected results are *only* that arrival has nothing to
     verify. When a multi-step flow
     needs it, name which step produced which outcome ("Step 2 navigates
     successfully to the item's detail page."). Every bullet is checkable by
     looking. An empty list is not finished.

   Write a case as the pass a tester actually makes, not as one scenario
   transcribed. Related scenarios under the same journey that share a
   condition belong in one case; a distinct way the same behaviour is
   reached or broken — where the spec states what should happen when it is —
   is its own case with its own pre-condition. A one-step case that restates
   a single WHEN means the arrival and the observation were left out.

   **The line to hold:** how the tester reaches the condition, where they
   look and what they click is the case's own — invent it freely and
   concretely, because the spec never states it. What must then be true is
   the spec's, always. An expected result the traced scenarios do not state
   is a new requirement, and a failure mode the spec says nothing about is
   not a case at all — report it as a gap in step 10.

   **Write for a site that is built.** Development here follows the specs and
   a suite is run after the development is finished, so assume the surface
   exists and is deployed — no conditionals about whether a page is there.
   What such a pass needs but the spec leaves open — an address, an endpoint,
   a record — gets an **angle-bracket placeholder** the tester substitutes
   when they run: `Navigate to <store front door URL>`, `<the catalogue
   endpoint> is mocked to return a 500`, `Click the tile for <a collection
   holding cards>`. A placeholder is self-describing and uses the store's own
   names (`<grade10 store url>`, not `<store front door URL>`; never
   `<url1>`, never `<TBD>`; never a bare `<store url>` where the store runs
   more than one brand), is the same in every case in the suite, never wraps
   across a line and never takes a capital, may appear in pre-conditions,
   steps and expected results alike, and is used only where the spec leaves
   the value open — where the spec names a control, name the UI thing a
   tester clicks (`Click the shop button in the hero`), not the spec's UX
   term and not an invented label. Do not invent a
   label and soften it with an `e.g.`; use `e.g.` only where the spec itself
   gives the example.

   **Name the UI event, not the spec's UX term.** Specs name a control by the
   job it does ("shopping affordance") and a state by a product word
   ("unscoped", "narrowing"). Cases name the click, the navigation, the URL,
   or the listed cards a tester actually checks: `Click the shop button in
   the hero`, `The browser navigates to <grade10 browse listing url>`, `The
   listing URL names no collection`, `Cards from the whole catalogue are
   listed`. Do not paste UX or HCI terms into steps or expected results —
   affordance, unscoped, narrowing, way on, scoped — even when the spec uses
   them.

   **Say it in as few words as possible.** A tester reads a case while doing
   something else. Ten words is plenty for an expected-result bullet; a step
   is a short imperative. Cut "successfully", "as expected", "the
   application", "the user is able to". One idea per bullet. Short is not
   vague — `Hero is missing` is vague, `Hero collapses, page layout intact`
   is short and checkable.

   A finished case reads like this:

   ```markdown
   ### grade10-site-store-home-US1-TC3-1: Core navigation survives a failed stylesheet load

   **Classification:**

   * **Severity:** major
   * **Priority:** medium
   * **Status:** draft
   * **Behaviour:** negative
   * **Type:** functional
   * **Suites:** regression
   * **Layer:** e2e
   * **Automation status:** manual
   * **Testability:** automation, manual
   * **Trace:** grade10-site-store-home-US-01

   **Pre-conditions:**
   Stylesheets blocked by network manipulation.

   **Steps:**

   1. Navigate to <grade10 store url>.
   2. Check the unstyled page.
   3. Click the shop button in the hero.

   **Expected Results:**

   * Front door renders unstyled, hero headline and both buttons readable.
   * Step 3 opens <grade10 browse listing url>.
   * The listing URL names no collection.
   ```

   Map scenario clauses into the case like this:

   | Scenario clause | Lands in |
   | --- | --- |
   | `GIVEN` | **Pre-conditions**, or a test-data row when it carries a value |
   | `WHEN` / `AND` after `WHEN` | Numbered **Steps** |
   | `THEN` / `AND` after `THEN` | Bullets under **Expected Results** |

   Three standing rules: **atomicity** (one intent per case — prefer
   splitting when two scenarios verify unrelated behaviours), **independence** (a
   case never leans on another case having run; write setup out in full),
   and **NLP automation readiness** (standardized phrasing, no blank
   expected results).

7. **Classify every case** with all ten properties inside the Classification Block, using asterisks (`*`) for bullets, in this exact order:
   - **Severity** — `blocker`, `critical`, `major`, `normal`, `minor`,
     `trivial`. Usual shapes: a core positive path is `critical`, a
     degradation the journey survives `major`, an empty state `normal`, a
     presentational fallback `minor`.
   - **Priority** — `high`, `medium`, `low`; `high` for the core paths,
     `medium` for degradations and empty states, `low` for presentation.
   - **Status** — always `draft` on generation. Never write `actual`.
   - **Behaviour** — `positive`, `negative`, or `destructive`. A case whose
     pre-condition feeds the product something broken, missing, stubbed out
     or cut off is `negative` even when the expected result is that it
     carries on gracefully.
   - **Type** — exactly one of `functional`, `acceptance`, `usability`,
     `security`, `performance`, `compatibility`, `integration`. What kind of
     verification this is, never which run it belongs to.
   - **Suites** — which runs it belongs to: zero or more of `smoke`,
     `regression`, `release`, comma-separated, or `none`. At most one `smoke`
     per journey. Never write `exploratory`; only a reviewer adds those.
   - **Layer** — `e2e`, `api`, or `unit`.
   - **Automation status** — always `manual` on generation.
   - **Testability** — `automation`, `manual`, or `automation, manual`.
   - **Trace** — the journey this case derives from, in the spec's canonical
     form: `<capability>-US-<n>` (`grade10-site-store-home-US-01`), even though the section
     heading above it uses the compact `grade10-site-store-home-US1`. One journey per case. A
     case with no trace does not belong in the file.

   **Coverage shape:** A journey whose `Accepted by` list includes refusal,
   empty-state, or failure scenarios must not ship with only `positive`
   cases — add the matching `negative` (and `destructive` when the
   scenarios state unwind behaviour). Do **not** invent destructive cases
   the scenarios do not justify.

8. **Check the coverage both ways** before writing the file. Every case
   traces its journey and is built only from scenarios that accept that
   journey, and every user-facing scenario accepting a journey is covered by
   at least one of that journey's cases. Scenario ids are not written on the
   case — the check happens here, and anything uncovered is reported in
   step 10.

9. **Write the file beside the resolved `spec.md`** — durable suite under
   `openspec/specs/.../feature-tcs.md`, or delta suite under
   `openspec/changes/<change>/specs/.../feature-tcs.md` — with its header lines
   under the file title and no preamble paragraph between them.

   **The header is computed, never chosen** (see "The file header" in
   `docs/governance/specs-to-test-cases.md`):

   - `**Status:**` is a function of the case statuses below it — `approved`
     when no `draft` remains, `in-review` when at least one `actual` or
     `deprecated` sits beside a `draft`, `pending-review` otherwise. A fresh
     suite is `pending-review` because every case in it is `draft`; an update
     that adds a `draft` to an approved suite recomputes to `in-review`, and
     you write that rather than leaving a status that is now false.
   - `**Drafts styled:** <today>, tcs-rules r<major>.<minor>` goes on every
     file you leave holding a `draft`, taking the revision from
     `tcs_rules_rev` in that document's frontmatter. Omit the line entirely when the run leaves no draft.
   - `**Reviewed:**` is `/tcs-review`'s to write. Never write it, and never
     write `**Status:** approved` — a suite reaches that only through a human.

   Run `pnpm run tcs:validate` on what you wrote before reporting; it checks
   the header against the cases, the ids, and every trace against the spec. **Output the file matching this exact Markdown template.
   Do not invent your own structure or spacing:** a blank line follows every
   `**Label:**` that heads a list, a blank line separates every part of a
   case, and a `---` rule separates journey sections.

   ````markdown
   # <product>/<domain>/<capability> Test Cases

   **Status:** pending-review

   ## <capability>-US<n>: <Journey Title>

   **As a** <role>,
   **I want** <goal>,
   **so that** <reason>.

   ### <capability>-US<n>-TC<m>-<v>: <Clean Descriptive Title>

   **Classification:**

   * **Severity:** …
   * **Priority:** …
   * **Status:** draft
   * **Behaviour:** …
   * **Type:** …
   * **Suites:** …
   * **Layer:** …
   * **Automation status:** manual
   * **Testability:** …
   * **Trace:** <capability>-US-<n>

   **Pre-conditions:**
   <from GIVEN, or None.>

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

   `**Test data:**` is the only section a case may leave out. Everything
   else — the classification block with all ten bullets, the pre-conditions
   line, at least one step, at least one expected result — is on every case.

   In **update mode** (a suite already existed and the user chose update):
   - Keep every `actual` and `deprecated` case whose scenarios are unchanged
     exactly as it is, including one written in an older shape — never
     reformat a reviewed case to match the template or the learned
     conventions.
   - Keep the coverage of a `draft` case whose scenarios are unchanged, but
     bring its wording to the conventions learned in step 4 — id kept, `<v>`
     unchanged, status still `draft`. A restyle never bumps `<v>`.
   - **Resolve every case whose traced scenario the delta moved, `actual`
     ones included.** A reviewed case that still asserts the behaviour a
     change replaced is worse than no coverage. Three outcomes, and no
     fourth: the scenario changed what the case must verify → re-word it,
     bump `<v>`, set `**Status:** draft`; the behaviour is gone →
     `**Status:** deprecated`; the change did not touch what this case
     asserts → leave it `actual` and say so in the report.
   - Add a case for every user-facing scenario no case covers (next unused
     `TC<m>` under that journey).
   - Recompute the file's `**Status:**` from the cases below it — never type
     it — and report every `actual` case this run moved.

10. **Report** what you learned and what you wrote. Open with the corpus:
   how many `actual` cases you read and from which capabilities, the
   conventions you drew from them (each with the approved case ids that
   justify it), the ones you rejected for want of evidence, and any approved
   case that contradicts a written rule — named, and left for a human to
   resolve. Say plainly when the corpus was too thin to learn from and the
   defaults were used. Then report the drafts you re-worded to match, with
   their old and new `<v>`.

   Then report what you wrote: each suite path (and whether it is
   durable or a change delta), the journeys (US ids) and how many cases
   each holds, the ids added, re-worded, and deprecated, and — when step 3
   upgraded the spec — which `spec.md` paths you rewrote. Report separately
   any requirement whose prose states a rule no scenario covers, any
   scenario under no journey, and any journey listing an unknown scenario
   id — those are gaps for the spec's author. Point the user at
   `/tcs-review` as the next step; do not tell them the suite is ready to hand
   on — it isn't, until every case is `actual`.

   When the run was a **rules-revision update** — `pnpm run tcs:stale` named
   this suite and you brought its drafts up — say so plainly: the revision it
   moved from and to, and how many drafts were re-worded. Do not offer to work
   through the rest of the stale list in one go; each capability is its own
   run and its own pull request.

**Never do these things:**

- Never state a step, pre-condition, expected result, or data value the
  traced scenarios don't already say. Where the spec names a control by its
  role rather than its label, say the same — do not invent the button text
  to make a step sound concrete.
- Never write a step that embeds its expected result, an empty **Expected
  Results** list, several actions in one step, or a case that depends on
  another case having run.
- Never put a `**Description:**` paragraph, a `**Covers:**` list, or a
  summary sentence into a generated case or journey section, never move the
  ten properties to the end of the case under a `**Properties:**` heading,
  and never write a `**Test data:**` section for a case that takes no
  input.
- Never invent a journey the upgraded spec does not justify from existing
  scenarios — step 3 may reshape the file, but it must not add behavior.
- Never overwrite, regenerate, or delete an existing suite without showing
  it and asking first, and never at all when it holds an `actual` case or
  the file is `approved`.
- Never write a case's `**Status:**` as `actual`, a file's as `approved`, or a
  `**Reviewed:**` line. Only `/tcs-review`, with a human answering, does that.
- Never leave a file status that contradicts the cases under it, and never
  treat the status as something to choose — it is derived, and
  `pnpm run tcs:validate` fails a file where the two disagree.
- Never sweep every stale suite in one run. `pnpm run tcs:stale` reports;
  a human picks the capability, one pull request at a time.
- Never write a QA-review (or any other) task into `tasks.md` for these
  suites — review state lives in the suite's own status lines.
- Never write a durable suite when the user asked for a change delta, or a
  delta suite when they asked for durable — match the resolved tree.
- Never write under `openspec/changes/archive/`.
- Never write a case that hedges about whether the product exists, and never
  invent a concrete URL, endpoint or label where a placeholder belongs.
- Never treat a `draft` or `deprecated` case as evidence of house style, and
  never let the approved corpus add coverage, soften a prohibition, or
  overrule the spec — it teaches wording and calibration, nothing else.
- Never restyle, renumber, or re-word a case whose `**Status:**` is `actual`
  or `deprecated`, however far it sits from the current conventions.