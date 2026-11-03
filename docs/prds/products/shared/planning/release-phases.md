---
title: Release Phases
order: 2
---

Which of the five release phases each section of the manual launches in, how far it is through QA, and the run desk where QA marks the results. Every fact is read from the pages, the suites and the run desk, so nothing is set by hand - [Change Stages](/p/shared/planning/change-stages).

## Phases

- 🚧 **Phase** — a named release in the order work launches, listed once for every product, with an optional target day or month
  - **Named Without the Word** — a phase's name never carries the word phase, so a number names one release only
- 🚧 **The Five** — the releases, in order
  1. **Auction** — the auction
  2. **Internal Consignment** — inventory, vault and consignment, in the admin panel only
  3. **Pre-Store Launch** — campaigns, and membership up to tiers, points and top-ups
  4. **Store Launch 1** — the store, the cart, checkout, site discounts and orders, with no membership feature
  5. **Store Launch 2** — every membership feature in the store
- 🚧 **Release Priority** — how much a phase depends on a section
  - **P0** — the phase does not launch without it
  - **P1** — launches in the phase if it is ready; otherwise it moves to the next phase
  - **P2** — stretch; moves like a P1, and is walked after it
  - **Not a Case's Priority** — a case's priority is its run order, so the two keep separate names and separate values
- ❓ **Targets** — no phase has a target day or month yet. Product confirms
- 🚧 **One Plan** — the vault's own three phases and the tills-only "Phase 1" on Consigning and Store Listings give way to the five
  - **Staff-Only Flows** — the vault's and consignment's admin flows launch in Internal Consignment
  - **Collector-Facing Pages** — vault and wallet pages are placed one by one when phases are first assigned
  - **Mail-In and Retrieval** — no phase until one is planned

## Marking a Section

The phase sits on the section it belongs to, and part of a section can launch in another.

- 🚧 **Phase Block** — a block under a heading puts every line under it in a phase, at a release priority
  - **Every Line** — lines built and lines still being built alike; the marks keep their meaning
  - **Page First** — a block before a page's first heading covers the whole page, so most pages need one block
  - **Nearest Block Wins** — a rule takes the phase named for it, else its section's, else the phase of the heading above, else the page's
  - **Children Follow** — a rule's nested rules take its phase
- 🚧 **Part of a Section** — a second block names the rules that launch in another phase; the rest keep the section's
- 🚧 **No Phase** — once every page is placed, a line in no phase reads by its mark
  - **Launched** — an unmarked line
  - **Unplanned** — a line still being built; its page carries an Unplanned chip
  - **Open** — an unconfirmed line, a question rather than unplanned work
- 🚧 **Adopted per Page** — on a page that names a phase, a line still being built in no phase is flagged
- 🚧 **Renames Carry It** — renaming a rule moves the blocks that name it, as it moves the cases that trace it
- 🚧 **First Assignment** — drafted as one table of page, split, phase, release priority and a reason, which the product manager marks up before any block is written

## Reading a Phase

- 🚧 **Phase Chip** — beside a page's title: its phase and release priority, and its readiness where the unit is its capability
  - **Only Where It Differs** — a section or a rule carries a chip only where its phase differs from the page's, so headings stay quiet
- 🚧 **Readiness in the QA Tab** — a section's readiness heads its cases in the QA tab: each step passed, the one holding it, and whose turn it is
- 🚧 **Phase Board** — every unit in a phase, P0 first, with its readiness, its lines, its cases and its latest run
  - **Can It Launch** — the board opens on the release's own check: P0 units passed, units failing by triage, automated fails not triaged, questions in units that would launch, and the units that will move
  - **Waiting On** — units grouped by whose turn it is: a role in the team map, or a bug's assignee
  - **QA's Queue** — units reviewed and waiting for a run, by phase, then release priority, then how long each has waited
  - **Every Phase** — each phase's units counted by readiness, beside its target
- ❓ **Phase View** — a board row opens its page as of its phase, lines launching later faded and named; built only if the first assignment splits enough pages. The product manager confirms

## Readiness

QA's unit is a section in a phase on a store page, whose cases trace its rules, and a capability in a phase elsewhere, whose cases are its suite.

- 🚧 **Readiness Ladder** — where a unit stands, each step read from the pages, the suites or the run desk
  1. **Planned** — a phase block covers it
  2. **Prepared** — cases cover it: every rule on a store page; elsewhere, its capability's suite holds cases
     - **No Suite** — a page that names no capability, or one with no suite, says so instead of waiting at Planned
  3. **Reviewed** — QA has reviewed its cases against the build; a draft case keeps it at Prepared
  4. **In QA** — its cases are in a run on the phase's QA environment
  5. **Passed** — every case's latest verdict passes, at the revision it ran; Failing or Blocked where one does not
  6. **Released** — its phase is released
- 🚧 **Out of the Unit** — where a capability spans two phases, a case left out of a finalized run of that phase, with its reason, is not that phase's
- 🚧 **Overlays** — beside the step, never a step of their own
  - **Questions** — unconfirmed lines among the unit's own, tables and prose included and detail blocks never, counted; a unit that would launch cannot be released with one
  - **Still Being Built** — lines that still carry the mark, counted
  - **Stale** — a case revised after the run that marked it
  - **At Risk** — a P0 unit not passed within 7 days of its phase's target, on the board only

## Handing a Phase to QA

- 🚧 **A Run per Phase** — the run sheet selects by phase, release priority and readiness, resolves to explicit cases, and opens a run on the run desk once a person confirms its dry run
  - **Ready** — a unit reviewed or further
  - **A Run Names Its Phase** — a run selected by phase records it in its print commit; only such a run leaves cases out of a unit, and results attach to cases whatever the run
- 🚧 **Which Cases** — what each unit brings to a run
  - **Store Pages** — the cases tracing a rule in the unit
  - **Other Pages** — the suite of the capability; where it spans two phases, QA leaves out the other phase's cases in the dry run with a reason
- 🚧 **Re-Run** — the failed and blocked rows of a run, opened as a new run

## Run Desk

The run tab QA marks today, live in the manual: the same columns, banners and words, with its results reaching the pages.

- 🚧 **Same Tab** — what each run tab holds today
  - **The Case** — id, title, pre-conditions, test data, steps and expected results, as the suite says them, never edited on the desk
  - **The Marks** — Web, Mobile, Auto web and Auto mobile in the six result words, and Notes
  - **Banners** — a page's banner over its sections' banners, each folding the rows under it
  - **Held Columns** — the case's id and title stay in view however far the run scrolls
- 🚧 **One Case, Its Rows** — a case run once per row of its test data shows its shared text once and one line per row, each marked on its own
- 🚧 **Filters** — product, domain, capability, level, severity, priority, phase, surface and result; a filter changes what shows, never what is in the run
- 🚧 **Run Header** — each surface's counts and pass rate, as the Summary tab gives them, with n/a left out of the rate
- 🚧 **Your Surface** — a tester marks one surface, chosen once on each device; a phone starts on Mobile, and the automated columns are never in a person's path
- 🚧 **Marking** — keyboard first on a computer, in the tab's grid
  - **On a Phone** — one case a screen, with large buttons for the surface being tested, so a tester walking the mobile site marks it on the same phone
  - **No Bulk Verdict** — many rows at once only as blocked, skipped, n/a or to do; a pass or a fail is marked one row at a time
- 🚧 **Several at Once** — a mark reaches every open copy of the run, and the run shows who is on which row, as the Sheet does today
- 🚧 **Signed** — every mark keeps the signed-in e-mail, shown as the team map's handle where the map knows it
- 🚧 **Frozen Content** — a row keeps its case as selected, so a later edit to a suite never changes a run
- 🚧 **History** — every change is kept, with who and when
- 🚧 **Export** — a run downloads as a spreadsheet file
- 🚧 **Run States** — in order
  1. **Open** — the selection can change, and the marks on rows that stay are kept
  2. **Finalized** — the selection is frozen and recorded in git, as printed runs are today; marking goes on
  3. **Closed** — marking ends
- 🚧 **Where It Runs** — on the manual's own deployment, behind the Cloudflare Access that already guards it; the store's "not an application" rule names it as its one exception
- 🚧 **Left With the Sheet** — cell comments, columns of QA's own and pasted screenshots; Notes, the linked issue and the export carry what they held

## Results

- 🚧 **One Verdict per Row** — where Web or Mobile is in play, a person's marks decide; automation decides alone only on a case nobody can walk
  - **Automation Disagrees** — an automated fail beside a person's pass counts as a pass, and the phase cannot sign off until it is triaged
  - **Worst First** — fail, then blocked, then not run, then skipped, then pass; a case takes its worst row
  - **Latest Run, Same Revision** — the newest run on the phase's QA environment counts, while the case's revision matches the one in the run
- 🚧 **Triage** — on each fail, blocked or skipped mark, with the issue it links; the row's verdict still follows One Verdict per Row
  - **Bug** — the product is wrong; failing, for the issue's assignee
  - **Spec** — product and page disagree and nobody decided; failing, for the product manager, as an open question on the page
  - **Case** — the case is wrong; walked again in a re-run once QA fixes it in its suite
  - **Environment** — the environment was down or behind, or the section is not deployed yet; walked again, once a developer fixes it
  - **Data** — the test data was missing; walked again once QA prepares it
  - **Flaky** — on an automated fail only: the test failed where the product works; its author fixes the test
  - **Deferred** — on a skip only: left on purpose; a P0 unit waits for it
- 🚧 **Filing a Bug** — a fail opens the app's bug report filled from the case and the run, and reads "bug, no issue yet" until the issue's link is pasted in
- 🚧 **Automated Results** — entered by hand, as they are today
- 🚧 **Row Identity** — a case run once per row of its test data is one row each, so a failure names its row
- 🚧 **Results on the Page** — the QA tab, the page chip and the phase board read the run desk's latest verdicts when opened; results never reach git

## Releasing a Phase

- 🚧 **Checked** — once every case of a unit passes, its lines marked being built lose the mark, in one commit
- 🚧 **Release** — one command, run first as a dry run that lists what launches, what moves and the marks that come off, and written once a person confirms it
  - **Launches** — every P0 unit, and every P1 or P2 unit that passed, none holding a question
  - **Moves** — every P1 or P2 unit not passed, to the next phase
  - **Recorded** — the commit records the release date and removes the phase's blocks, so its lines read as launched; its message lists the units released and moved
- 🚧 **Sign-Off** — every P0 unit passed, no question in a unit that launches, and no automated fail left untriaged
- 🚧 **A Slip** — a unit moved before the release is a one-line edit of its block, so git keeps the slip

:::detail{title="How it is written" for="engineer"}
- **Registry** — `phases.yaml` beside the team map: one entry per phase with its id, name, an optional target and its QA environment; `released` is written by the release command alone
- **Block** — `::phase{id="store-launch-2" priority="P1"}` under the heading; `rules="held-codes"` names rule anchors, the ones case traces already use
- **Checks** — the manual's check fails an unknown phase, a priority outside P0 to P2, a rule the section does not have, a rule named twice and two whole-section blocks under one heading; it warns on a line being built in no phase on a page that names one, and on a block naming a released phase. It reads nothing live, so At Risk stays on the board
- **One Reader** — the manual, the run sheet and the release command read units and readiness from the same pure reader, so a board, a run and a release cannot disagree. Store suites come from the pages; elsewhere the reader takes the OpenSpec suites through the store's reader at build, and a repository without OpenSpec shows no readiness outside the store
- **Run Desk** — one Durable Object holds every run in SQLite storage, in a Worker of its own that the manual's Worker reaches through a binding; a manual deploy, made on every push to main, never restarts it or drops a tester's connection
- **One Address** — the desk's Worker has no address of its own, so every request passes the Access in front of the manual
- **Reads** — pages and the board fetch results once when opened; only a run's own page holds a live connection
- **Identity** — Cloudflare Access names the tester by e-mail; a mark keeps the e-mail, and the team map turns it into a handle where it can, never refusing one it cannot
- **Idempotent Marks** — each mark carries an id, so a retried mark is a no-op and marks made offline send on reconnect
- **Service Token** — the run sheet, the release command and the finalized-run check reach the desk through an Access service token
:::

:::detail{title="Product decisions" for="pm"}
QA deciding what to walk next, the product manager deciding what a phase holds, and whoever cuts a release read the same units. Phases are written today as words on each page, and the same words already name different releases.

- **A phase is a release** — five phases in one registry for every product, so a phase's name means one launch wherever it is written
- **Every line, not only open ones** — pages such as Main Page, Product Details, Tiers and Top-ups carry no mark, yet have not launched; marks say what is built, and a phase says when it launches
- **A block, not words** — the check can hold a block, the editor can offer it and the run sheet can select on it; a phase written into a line's words was ruled out
- **No sixth phase for later** — once every page is placed, a line's mark already tells launched from unplanned
- **Release priority, not priority** — a case's priority is already its run order
- **A question never holds a step** — 73 of the 531 sections on the pages hold an unconfirmed line, 42 of them a single one among five or more rules; a ladder that stopped there would hide every result QA marks. A question holds the release instead
- **Reviewed is a step** — 1,550 cases are draft against 237 reviewed, and the run sheet prints reviewed cases only, so a unit with draft cases is not ready for a run
- **Capabilities outside the store** — only the store's cases trace a page's rules; elsewhere a section's readiness would be its whole suite's, so the unit is the capability
- **No deployment state** — of the 204 sections with lines being built, 110 are linked from no change and only 58 from an active one, so a built or deployed state read through changes would be wrong more often than right; a section not yet deployed shows as Blocked when QA runs it
- **The tab QA already marks** — QA's run 5, store-stage1, held 170 cases as 326 rows under 45 section banners; the desk keeps that tab's shape. What it adds over the Sheet is results reaching the pages and the release, triage on each mark, rows named apart and reprints that keep marks; marking together and a cell's history the Sheet already gave
- **Derived, never set** — readiness is read from the pages, the suites and the run desk; a status somebody sets goes stale when nobody updates it
- **The case rules are untouched** — where results live is reworded by the rules' owner when the Sheet retires
- **Not in scope** — a phase calendar or burndown, moving work between phases from the manual, and a personal queue
- ❓ **Measured by** — days from Reviewed to a unit's first run, and P0 units passed by their phase's target; nothing records them yet. Product confirms
:::
