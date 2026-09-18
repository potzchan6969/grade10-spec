---
name: tcs-run-sheet
description: Pick the test cases a manual pass should walk and write them to a new tab of the run spreadsheet. Use when QA or a PM asks for a test run, a regression pass, a smoke pass, or the cases affected by a feature or a change. Invoke as /tcs-run-sheet <what to walk>, for example /tcs-run-sheet regression or /tcs-run-sheet auction and related sign-in features.
---

# Writing a Run Sheet

A run tab is a snapshot: written once, pinned to a commit, never resynced. It
is where a tester marks results, and the store never reads it back.

Your job is the selection. Whatever the request, it ends as an explicit list of
case ids that a human confirms before anything is written — a run whose
contents cannot be restated is a run nobody can repeat.

## The two kinds of request

**A filter.** `regression`, `smoke on the store`, `every high-priority case`.
These are properties the suites already carry, so resolve them with the
script's own flags rather than by reading files:

```bash
pnpm run tcs:run-sheet -- --name regression --suites regression --dry-run
```

**A judgment.** `auction and related sign-in features`, `everything a bidder
touches when the increment ladder changes`. No property expresses these, so
read for them: the capability's `spec.md`, its `user-journeys.md`, the
`feature-tcs.md` beside them, and the domain suite above them. Then collapse
what you found to ids and pass them explicitly:

```bash
pnpm run tcs:run-sheet -- --name auction-signin --cases-file /tmp/pick.txt --dry-run
```

Cross levels freely. A feature case and the domain case that crosses it belong
in the same pass when the request covers both.

## The steps

1. **Resolve the request** to a selection, by either route above.
2. **Dry run it.** `--dry-run` prints every case it would write and touches no
   network. Read the list yourself first: a case that does not belong is
   cheaper to drop now than to explain in the tab.
3. **Show the list and wait.** Name the count, the suites and capabilities it
   spans, and any draft cases. Do not dispatch before the person confirms.
4. **Dispatch.** The run tab is written by CI, which holds the only credentials:

   ```bash
   gh workflow run run-sheet.yml \
     -f name=<run name> \
     -f selection="<the request, in their words>" \
     -f cases="<id,id,id>"
   ```

   Pass `suites=`, `priority=`, `level=` or `scope=` instead of `cases=` when a
   filter resolved it. Add `include_draft=true` only when the person asked for
   drafts.
5. **Report the tab.** Give them the run id, the tab name and the link the job
   prints.

## What to tell them

- **Four surfaces, `Notes`, `Tester` and `Date` are theirs.** `Web`, `Mobile`,
  `Auto web` and `Auto mobile` are separate answers: one case can pass in a
  browser and fail on a phone. The case to their left and the classification to
  their right are locked, and an edit there is refused at the cell. A wrong case
  is fixed in `openspec/`, not in the sheet.
- **Every case starts at `to_do`, so the Summary counts down.** An automation
  column reading `n/a` is a case no automated test covers; `skipped` is a case
  somebody chose not to walk. The pass rate ignores `n/a` and counts `skipped`
  against the run.
- **The Summary tab gives each run four rows**, one per surface, counted live.
  Marking a row moves them; no second sync is needed.
- **Sort inside the `Walk` filter view, not the sheet.** A sheet-level sort
  would lift the cases out from under their journey banners.
- **Do not rename or delete the tab.** The Summary rows point at it by name,
  and Google Sheets cannot prevent either — they will read `tab deleted`.
- **Amber rows are draft cases**, which no reviewer has approved. They appear
  only when the run asked for them.

## What not to do

- **Do not write a tab nobody confirmed.** The dry run is the conversation.
- **Do not take `deprecated` cases.** The spec stopped stating them; walking one
  proves nothing. The script refuses them outright.
- **Do not put results back in the store.** A suite carries no execution record
  — `docs/governance/specs-to-test-cases.md` says so, and a run lives in the
  sheet.
- **Do not edit the spreadsheet by hand to fix a layout.** The layout is
  `scripts/openspec/lib/run-sheet-layout.mjs`; change it there.
