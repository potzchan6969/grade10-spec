---
title: Release Phases
order: 2
---

Which release each open section of the manual ships in, how ready it is for QA, and the run that proves it. Every fact is read from the pages, the suites, the changes, the deployment receipts and the run sheet, so nothing is set by hand - [Change Stages](/p/shared/planning/change-stages).

## Phases

- 🚧 **Phase** — a named release, in the order work ships: its name, a target day or month, and the environment its QA runs on, listed once for every product
- 🚧 **Release Priority** — how much a phase depends on a section
  - **P0** — the phase does not ship without it
  - **P1** — ships in the phase if it is ready; otherwise it moves to the next phase
  - **P2** — stretch; never holds the phase
  - **Not a Case's Priority** — a case's priority is its run order, so the two keep separate names and separate values
- ❓ **One Numbering** — Consigning and Store Listings write "Phase 1: the Tills" for the tills-only sale the vault's plan delivers in its second phase, Consign and Sell, on 6 December; one registry would make them one release. Product confirms

## Marking a Section

The phase sits on the section it belongs to, and part of a section can take another.

- 🚧 **Phase Block** — a block under a section's heading names the section's phase and release priority
  - **Open Lines Only** — it covers the lines under it being built or unconfirmed; a line with no mark already runs and takes no phase
  - **Nearest Block Wins** — a rule takes the phase named for it, else its section's, else the phase of the heading above, else the page's
  - **Children Follow** — a rule's nested rules take its phase
- 🚧 **Part of a Section** — a second block names the rules that take another phase; every other open line keeps the section's
- 🚧 **Adopted per Page** — once a page names one phase, every open line on it needs one; a page that names none is never asked
- 🚧 **Renames Carry It** — renaming a rule moves the blocks that name it, as it moves the cases that trace it

## Reading a Phase

- 🚧 **Phase Chip** — beside each section's heading: its phase, its release priority and how ready it is; a section with rules in later phases says how many
- 🚧 **Rule Chip** — on a rule whose phase differs from its section's
- 🚧 **Readiness Card** — opened from a chip: each step the section has passed, the one holding it, and whose turn it is
- 🚧 **Phase Board** — every section in a phase, P0 first, with its readiness, its open lines, its cases, where it is serving and its last run
  - **QA's Queue** — the sections ready for QA, ordered by the phase's target, then release priority, then how long each has waited
  - **Every Phase** — each phase's sections counted by readiness, beside its target

## Readiness

A section in a phase is one unit of QA's work, so a section split across phases is one unit per phase.

- 🚧 **Readiness Ladder** — where a unit stands, each step proven by something the build reads
  1. **Planned** — a phase block covers open lines
  2. **Building** — a change that links the section has its first claim
  3. **Built** — every such change has recorded its implementation
  4. **Ready for QA** — serving on the phase's QA environment, nothing unconfirmed, and cases in place
  5. **In QA** — its cases are in a finalized run on that environment
  6. **Passed** — every case's latest verdict passes, at the revision printed; Failing or Blocked where one does not
  7. **Released** — serving on production, with its marks taken off
- 🚧 **Ready for QA** — the moment a section goes to QA: in the current or next phase, settled, built, serving on the phase's QA environment, and with its cases in place
  - **Serving** — the latest receipt for that environment lists every change that links the section as newly or still serving
  - **Cases in Place** — on a store page, every open rule is traced by a case; elsewhere, the change that delivers the section carries cases
- 🚧 **Overlays** — beside the step, never a step of their own
  - **Questions** — unconfirmed lines under the unit, counted
  - **Unlinked** — no change links the section, so nothing proves it is built
  - **Stale** — a case revised, or the section redeployed, after the run that marked it
  - **At Risk** — a P0 unit not yet passed within 7 days of its phase's target
- ❓ **Shown on the Manual** — the manual would show each section's phase and readiness, and a change only as a link to the OpenSpec viewer, amending the Planning views decision on [Change Stages](/p/shared/planning/change-stages). Product confirms

## Handing a Phase to QA

- 🚧 **A Run per Phase** — the run sheet selects by phase, release priority and readiness, resolves to explicit cases, and is confirmed in a dry run like every other selection
  - **No Phase on the Run** — results attach to cases, so a run need not be printed per phase
- 🚧 **Which Cases** — what each section brings to a run
  - **Store Pages** — the cases tracing a rule in the unit
  - **Other Pages** — the cases of each change that links the section, since journeys name no section
  - **No Change Links It** — the page's capability suite, flagged as not narrowed
- 🚧 **Re-Run** — the failed and blocked rows of a finalized run, printed as a new run

## Results

- 🚧 **One Verdict per Row** — where Web or Mobile is in play, a person's marks decide; automation decides alone only on a case nobody can walk
  - **Automation Disagrees** — an automated fail beside a person's pass counts as a pass, and the phase cannot sign off until it is triaged
  - **Worst First** — fail, then blocked, then not run, then skipped, then pass; a case takes its worst row
  - **Latest Run, Same Revision** — the newest finalized run on the phase's QA environment counts, while the case's revision matches the one printed
- 🚧 **Triage** — a cell beside a row's results, and a cell for the issue it links
  - **Bug** — the product is wrong; failing, for the change's developer
  - **Spec** — product and page disagree and nobody decided; failing, for the product manager, as an open question on the page
  - **Case** — the case is wrong; walked again once QA fixes it in its suite
  - **Environment** — the environment was down or behind; walked again once redeployed
  - **Data** — the test data was missing; walked again once QA prepares it
  - **Flaky** — an automated test failed where the product works; the test is fixed
  - **Not a Bug** — the mark was wrong; walked again
  - **Deferred** — skipped on purpose; a P0 section waits for it
  - **Whose Turn** — read from the hands of the change that delivers the section, so the sheet names no owner
- 🚧 **Row Identity** — a case run once per row of its test data names the row it failed on, such as row 2; the Summary keeps counting rows
- 🚧 **Read Back** — the manual reads the marks of finalized runs when it builds, read-only, and never writes them to git
  - **Refresh** — when QA publishes results, and on a schedule
- ❓ **Results Outside the Sheet** — the run sheet keeps results in the Sheet alone, and showing them on sections changes that. QA confirms
- ❓ **The Verdict Rule** — a person's pass standing over an automated fail, with the fail triaged before sign-off. QA confirms

## Releasing a Phase

- 🚧 **Sign-Off** — every P0 unit passed, every P1 passed or moved, no automated fail left untriaged, and every delivering change serving on production
- 🚧 **Release Commit** — one command takes the marks off the passed lines and the spent phase blocks, and records the release date; its message lists the sections released
  - **A Slip** — a P1 that moves is a one-line edit of its block, so git keeps the slip

:::detail{title="How it is written" for="engineer"}
- **Registry** — `phases.yaml` beside the team map: one entry per phase with its id, name, target and QA environment; `released` is written by the release command alone
- **Block** — `::phase{id="phase-2" priority="P0"}` under the heading; `rules="the-shops-counter"` names rule anchors, the ones case traces already use
- **Checks** — the manual's check fails an unknown phase, a priority outside P0 to P2, a rule the section does not have, a rule named twice and two whole-section blocks under one heading; it warns on an open line under no phase on a page that names one, and on a block over lines that all run
- **One Reader** — the manual and the run sheet read units and readiness from the same pure reader, so a board and a run cannot disagree
- **Results** — fetched read-only beside the deployment receipts, with when they were read; never stored
:::

:::detail{title="Product decisions" for="pm"}
QA deciding what to walk next, the product manager deciding what a phase holds, and whoever cuts a release read the same sections. Phases are written today as words on each page, and the same words already name two releases.

- **A phase is a release** — one registry for every product, so a phase's name means one date wherever it is written
- **The phase belongs to the open lines** — most sections mix lines that run with lines being built, and only the second need a date
- **A block, not words** — the check can hold a block, the editor can offer it and the run sheet can select on it; a phase written into a line's words was ruled out
- **Release priority, not priority** — a case's priority is already its run order
- **Derived, never set** — readiness is read on every build; a status somebody sets goes stale when nobody updates it
- **The case rules are untouched** — outside the store a section reaches its cases through the change that delivers it, because journeys name no section and the case rules have one owner
- **Not in scope** — a phase calendar or burndown, and moving work between phases from the manual
- ❓ **Measured by** — days from Ready for QA to a section's first run, and P0 sections passed by their phase's target; nothing records them yet. Product confirms
:::
