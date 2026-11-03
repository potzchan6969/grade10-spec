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
  - **P2** — stretch; never holds the phase
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
  - **No Block, No Phase** — a line in no phase is launched already, or not planned yet
- 🚧 **Part of a Section** — a second block names the rules that launch in another phase; the rest keep the section's
- 🚧 **Adopted per Page** — on a page that names a phase, a line still being built in no phase is flagged
- 🚧 **Renames Carry It** — renaming a rule moves the blocks that name it, as it moves the cases that trace it

## Reading a Phase

- 🚧 **Phase Chip** — beside a page's title and each section's heading: the phase, the release priority and how far the section is through QA; a section with rules in another phase says how many
- 🚧 **Rule Chip** — on a rule whose phase differs from its section's
- 🚧 **Readiness Card** — opened from a chip: each step the section has passed, the one holding it, and whose turn it is
- 🚧 **Phase Board** — every section in a phase, P0 first, with its readiness, its lines, its cases and its latest run
  - **QA's Queue** — the sections prepared for QA, by phase, then release priority, then how long each has waited
  - **Every Phase** — each phase's sections counted by readiness, beside its target

## Readiness

A section in a phase is one unit of QA's work, so a section split across phases is one unit per phase.

- 🚧 **Readiness Ladder** — where a unit stands, each step read from the pages, the suites or the run desk
  1. **Planned** — a phase block covers it
  2. **Settled** — nothing under it is unconfirmed
  3. **Prepared** — cases cover it: by rule on a store page, by its capability's suite elsewhere
  4. **In QA** — its cases are in a run on the phase's QA environment
  5. **Passed** — every case's latest verdict passes, at the revision it ran; Failing or Blocked where one does not
  6. **Released** — its phase is released
- 🚧 **Overlays** — beside the step, never a step of their own
  - **Questions** — unconfirmed lines, counted
  - **Still Being Built** — lines that still carry the mark, counted
  - **Unreviewed** — cases still draft
  - **Stale** — a case revised after the run that marked it
  - **At Risk** — a P0 unit not passed within 7 days of its phase's target

## Handing a Phase to QA

- 🚧 **A Run per Phase** — the run sheet selects by phase, release priority and readiness, resolves to explicit cases, and opens a run on the run desk once a person confirms its dry run
  - **No Phase on the Run** — results attach to cases, so a run need not be printed per phase
- 🚧 **Which Cases** — what each section brings to a run
  - **Store Pages** — the cases tracing a rule in the unit
  - **Other Pages** — the suite of the capability the page documents; where that capability spans two phases, QA drops the other phase's cases in the dry run with a reason
- 🚧 **Re-Run** — the failed and blocked rows of a run, opened as a new run

## Run Desk

- 🚧 **Run Desk** — the manual's own page for a run, where QA marks each row on its four surfaces, several testers at once; it replaces the Google Sheet
  - **Marking** — keyboard first on a computer, and one case a screen on a phone
  - **Live** — a mark reaches every open copy of the run at once, and the run shows who is on which row
  - **Signed** — every mark names its tester, from the team map
  - **Frozen Content** — a row keeps its case as selected, so a later edit to a suite never changes a run
  - **History** — every change is kept, with who and when
  - **Export** — a run downloads as a spreadsheet file
- 🚧 **Run States** — in order
  1. **Open** — the selection can change, and the marks on rows that stay are kept
  2. **Finalized** — the selection is frozen and recorded in git, as printed runs are today; marking goes on
  3. **Closed** — marking ends
- 🚧 **Where It Runs** — on the manual's own deployment, behind the Cloudflare Access that already guards it; the store's "not an application" rule names it as its one exception

## Results

- 🚧 **One Verdict per Row** — where Web or Mobile is in play, a person's marks decide; automation decides alone only on a case nobody can walk
  - **Automation Disagrees** — an automated fail beside a person's pass counts as a pass, and the phase cannot sign off until it is triaged
  - **Worst First** — fail, then blocked, then not run, then skipped, then pass; a case takes its worst row
  - **Latest Run, Same Revision** — the newest run on the phase's QA environment counts, while the case's revision matches the one in the run
- 🚧 **Triage** — one per row, beside its results, with the issue it links
  - **Bug** — the product is wrong; failing, for the issue's assignee
  - **Spec** — product and page disagree and nobody decided; failing, for the product manager, as an open question on the page
  - **Case** — the case is wrong; walked again once QA fixes it in its suite
  - **Environment** — the environment was down or behind, or the section is not deployed yet; walked again once deployed
  - **Data** — the test data was missing; walked again once QA prepares it
  - **Flaky** — an automated test failed where the product works; its author fixes the test
  - **Not a Bug** — the mark was wrong; walked again
  - **Deferred** — skipped on purpose; a P0 section waits for it
- 🚧 **Row Identity** — a case run once per row of its test data is one row each, so a failure names its row
- 🚧 **Results on the Page** — a section's chip, the QA tab and the phase board show the run desk's latest verdicts as they are marked; results never reach git

## Releasing a Phase

- 🚧 **Checked** — once every case of a unit passes, its lines marked being built lose the mark, in one commit
- 🚧 **Sign-Off** — every P0 unit passed, every P1 passed or moved, and no automated fail left untriaged
- 🚧 **Release** — one command records the release date and removes the phase's blocks, so its lines read as launched; its message lists the sections released
  - **A Slip** — a P1 that moves is a one-line edit of its block, so git keeps the slip

:::detail{title="How it is written" for="engineer"}
- **Registry** — `phases.yaml` beside the team map: one entry per phase with its id, name, an optional target and its QA environment; `released` is written by the release command alone
- **Block** — `::phase{id="store-launch-2" priority="P1"}` under the heading; `rules="held-codes"` names rule anchors, the ones case traces already use
- **Checks** — the manual's check fails an unknown phase, a priority outside P0 to P2, a rule the section does not have, a rule named twice and two whole-section blocks under one heading; it warns on a line being built in no phase on a page that names one, and on a block naming a released phase
- **One Reader** — the manual and the run sheet read units and readiness from the same pure reader, so a board and a run cannot disagree
- **Run Desk** — one Durable Object holds every run in SQLite storage and sends each mark to every open page; Cloudflare Access names the tester, and the team map turns the e-mail into a handle
- **Idempotent Marks** — each mark carries an id, so a retried mark is a no-op and marks made offline send on reconnect
:::

:::detail{title="Product decisions" for="pm"}
QA deciding what to walk next, the product manager deciding what a phase holds, and whoever cuts a release read the same sections. Phases are written today as words on each page, and the same words already name different releases.

- **A phase is a release** — five phases in one registry for every product, so a phase's name means one launch wherever it is written
- **Every line, not only open ones** — pages such as Main Page, Product Details, Tiers and Top-ups carry no mark, yet have not launched; marks say what is built, and a phase says when it launches
- **A block, not words** — the check can hold a block, the editor can offer it and the run sheet can select on it; a phase written into a line's words was ruled out
- **Release priority, not priority** — a case's priority is already its run order
- **No deployment state** — of the 204 sections with lines being built, 110 are linked from no change and only 58 from an active one, so a built or deployed state read through changes would be wrong more often than right; a section not yet deployed shows as Blocked when QA runs it
- **Results where QA marks them** — the run desk holds only what QA creates and nothing else holds, and it replaces the Sheet's second copy of every case
- **Derived, never set** — readiness is read from the pages, the suites and the run desk; a status somebody sets goes stale when nobody updates it
- **The case rules are untouched** — outside the store a section reaches its cases through its capability's suite; where results live is reworded by the rules' owner when the Sheet retires
- **Not in scope** — a phase calendar or burndown, and moving work between phases from the manual
- ❓ **Measured by** — days from Prepared to a section's first run, and P0 sections passed by their phase's target; nothing records them yet. Product confirms
:::
