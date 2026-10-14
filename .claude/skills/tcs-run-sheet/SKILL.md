---
name: tcs-run-sheet
description: Pick cases for a manual pass, print a trial Google Sheet, and finalize one recorded snapshot per run. Use for test runs, regression passes, smoke passes, and cases affected by a change. Invoke as /tcs-run-sheet <what to walk>.
---

# Writing a Run Sheet

| Record | Value |
| --- | --- |
| Sheet | Production unless the person asks for sandbox |
| Environment | `staging` unless the person names `production` |
| Identity | Spreadsheet id and run id; tab name and `gid` can change before merge |
| Trial | Temporary Sheet registry and workflow artifact; no commit |
| Finalized | Human-confirmed snapshot; one commit on a dedicated run branch |
| Merged | Immutable; a later pass is a new run |

The durable boundary is [The Run Sheet](../../../docs/governance/specs-to-test-cases.md#the-run-sheet).
Execution results stay in Sheets. A manifest records coverage and provenance.

## Selection

- **Property filters** — `--suites`, `--priority` and `--level` intersect. A comma-separated value matches any value of that property
- **Scope** — `--scope <path>` selects eligible cases whose suite path contains that capability or domain path. It also narrows property filters and explicit ids
- **Explicit ids** — `--cases` or `--cases-file` wins over property filters. Repeated ids print once. A missing, deprecated or otherwise ineligible explicit id stops the run
- **Changed scope** — `--changed-since <sha>` selects whole suites affected by changed specs, PRDs or suites. It cannot combine with explicit ids. It is a scope hint, not proof each case changed
- **Eligibility** — `actual` cases, automated included. Add `--include-draft` only when requested; drafts are grey. `deprecated` never prints. Use `--exclude-automated` only when requested
- **Judgment** — read the capability's spec, journeys, feature suite and relevant domain suite; resolve the request to explicit ids
- **A release pass** — its tiers and its bar come from [Manual QA Passes](../../../docs/governance/manual-qa-passes.md): the bar prints by `--cases-file`, each tier as its own run
- **Intentional exclusions** — record ids and reasons in a JSON array, `[{"id":"...","reason":"..."}]`. Several ids may use the same reason. The array removes cases from property-filter selections. An id cannot be both explicitly selected and excluded. Natural filter exclusions need no individual reason. Intentionally removing an eligible case from an explicit reprint list requires a reason
- **Copied runs** — `--copy-run <id>` takes a merged run's ids, resolves the latest accepted cases and creates a new run. Missing or deprecated ids stop for a revised selection. The new record names its source run

## Printing

1. **Refresh main** — `git fetch origin main`. Real writes fetch latest main themselves; the dry run reads the pinned Git snapshot and makes no network calls
2. **Dry-run the selection** — `pnpm tcs:run-sheet --name auction --scope grade10-site/auction --include-draft --sha origin/main --dry-run`. Use the requested eligibility flags, not this example's draft flag by default
3. **Show coverage and stop** — group the printed ids by path. Give selected, draft and automated counts, exclusions with reasons, environment and fingerprint. Wait for the person's confirmation before any Sheet write. A request to make a run does not confirm its contents
4. **Dispatch the confirmed fingerprint** — CI holds the credentials. Use the exact selection and flags from the dry run:

   ```bash
   gh workflow run run-sheet.yml \
     -f action=print -f name=auction \
     -f selection="auction regression" \
     -f cases="<confirmed comma-separated ids>" \
     -f confirmed="<printed fingerprint>" -f env=staging
   ```

   Pass filters instead of `cases` when they resolved the list. Changing the
   selection route can change the fingerprint; dry-run the actual dispatch
   arguments. Pass `exclusions` as JSON where needed. Add `sandbox=true` only
   for an explicitly requested sandbox sheet, not merely a feature test run.
   Sandbox uses `TCS_SHEET_SANDBOX_ID`; never hardcode that id.
   To test unmerged suite changes, use `--sandbox --source-ref <commit>` in
   the preview and pass that same commit as workflow input `source_ref`.
   Production refuses this option. Sandbox source overrides must target the
   configured sandbox sheet and cannot target the production sheet.

5. **Report the run** — give run id, tab name, URL, fingerprint and workflow run id. A production write uploads `run-record`; trial receipts are not committed

## Reprinting

- **Identity** — use `overwrite=<run id>` only after the person names the run this conversation created. Changing its name or TC scope keeps that run id
- **Confirmation** — dry-run the revised arguments and confirm coverage before dispatch. The fingerprint covers rendered content, selected ids and revisions, scope, exclusions, name and environment. A source SHA change alone does not require a rewrite
- **Unchanged** — identical trial content writes no cells and creates no commit
- **Changed** — the writer recreates the run tab and replaces its Summary block and temporary record. The `gid` changes. Existing result marks are discarded; walk the finalized print
- **Finalized** — explicitly cancel finalization before reprinting. Dispatch `action=reopen` with `run_id`; download its trial receipt and run `pnpm tcs:run-record --record <receipt> --cancel`. This removes only that run branch's local print commit. Do not publish a trial
- **Merged** — the writer refuses reopening and reprinting. Offer a new run using the merged selection
- **Missing or renamed tab** — stop. Report run id, expected tab name, `gid` and link. The person restores the tab in Sheets; do not invent a suffix or replacement tab
- **Legacy run** — a run printed before the registry exists cannot be overwritten or finalized. Create a new run; do not infer its old coverage from current suites

## Finalizing

1. **Confirm finalization** — the person names the run and confirms its printed fingerprint. Dispatch `action=finalize`, `run_id` and `confirmed`. The writer checks selected cases against latest main; changed cases require a reprint and renewed coverage confirmation
2. **Download the finalized receipt** — `gh run download <workflow-run-id> --name run-record --dir /tmp/run-<id>`. Repeating finalization exports the same snapshot without resyncing it
3. **Create its commit** — from a clean checkout run `pnpm tcs:run-record --record /tmp/run-<id>/run-record.json`. It creates a dedicated `codex/print-run-<sheet-key>-<id>` branch with one manifest commit. An identical receipt creates no new commit
4. **Replace before merge** — after explicit reopening, reprinting and refinalizing, use `--replace` if the old local print commit remains. The command only amends a dedicated branch containing that one manifest commit; unrelated work refuses. If already published, update only that branch with `git push --force-with-lease`. Never rewrite main
5. **Publish through a PR** — only after finalization. Require the `tcs/run-finalized` check before merge. It compares the manifest with the live registry and refuses cancelled, stale, missing or renamed prints. Keep one print commit per run; never mix tool changes into that branch

No source-suite change automatically updates a finalized run.

## Run Records

Trial provenance lives in the Google Sheet `_Run records` tab and the workflow artifact.
Finalized manifests live at `docs/test-runs/<spreadsheet-id>/run-<run-id>.json`.
Each run has one manifest commit on its dedicated branch. Execution results stay in Sheets.

- **Identity** — spreadsheet id, run id, tab name and numeric sheet id (`gid`)
- **Source** — accepted-suite commit confirmed at finalization; optional source run when copying a pass
- **Selection** — requested scope, environment, eligibility options, ordered case ids, source paths, trace marker ids, revisions and content digests
- **Exclusions** — intentionally omitted ids and reasons; property-filter exclusions are not intentional omissions
- **Confirmation** — printed-content fingerprint and finalization time

Merged manifests are immutable. Configure `tcs/run-finalized` as a required PR check.
The check reads the live registry and refuses cancelled or stale receipts.

| Code | Path |
| --- | --- |
| Writer | `scripts/openspec/run-sheet.mjs` |
| Record and fingerprint | `scripts/openspec/lib/run-sheet-records.mjs` |
| Local commit | `scripts/openspec/run-sheet-record.mjs` |
| Merge verification | `scripts/openspec/verify-run-record.mjs`, executed from main against candidate JSON files |

## Printed Cases

- **Order** — specs folder path, then numeric US, then numeric TC. One capability header holds its selected journeys and cases. US1 precedes US12
- **Case id** — the displayed id ends with the trace marker suffix: `g10.auction-bid-increments.US1-TC5 (TC-kyx)`. Selection still uses the original id. Every expanded row repeats the suffix. A legacy case without a marker keeps its original id
- **Data** — `Field | Value` setup and single-row column tables fill matching placeholders in Steps and Expected Results. Names match case-sensitively, ignoring header backticks and outer angle brackets. Values print as `[value]`, without enclosing backticks. Missing names and shared fields with several different values print as `` `<name>` ``
- **Pre-conditions** — retain placeholders as `` `<name>` ``; never substitute them
- **Multiple rows** — a case saying `Runs once per row of **Test data**.` expands once per run-table value row. Shared setup fills each row; row values take precedence. Filled values are not recursively substituted. Test data remains visible; the per-row reminder is omitted on expanded rows
- **Four surfaces** — Web, Mobile, Auto web and Auto mobile are separate results. `manual` only: Web/Mobile `to_do`, Auto `n/a`; `automation` only: Web/Mobile `n/a`, Auto `to_do`; mixed: Web/Mobile `to_do`, Auto `to_do` only when automated, otherwise `n/a`
- **Editing** — the four results and Notes belong to the tester. Case and classification cells are locked. Sort in the Walk filter view, not at sheet level; fix wrong case content in its source suite
- **Summary** — four rows per run, one per surface. Identity, environment and source SHA appear on the first. `n/a` is excluded from the pass rate; `skipped` counts against it

## Boundaries

- **Credentials** — only the workflow writes Sheets. Do not edit layout by hand; change `scripts/openspec/lib/run-sheet-layout.mjs`
- **Results** — never put execution results into suites or manifests
- **Tabs** — never delete other runs, clear Summary, or rename tabs manually
- **Verification** — test the writer with fixtures or sandbox only after its coverage is confirmed. Never dispatch a production print to validate code changes
