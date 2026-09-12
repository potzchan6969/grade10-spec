## Context

Two repositories hold the workflow. The store owns the pages, the changes, the durable specs, and `pnpm check:manual`, which runs on every pull request and push to `main` through `lint.yml`. The application repository owns the code, the deploys, and `pnpm plan`, which reads the store through the `openspec` CLI's machine registry and writes claims and checkmarks to it as commits.

`check:manual` reads the store through one set of readers in `tools/manual/src/store/`. An in-flight change arrives as a `ChangeEntry` with its `deltas`, the page sections its proposal links (`sections`, from `## References`), and its task groups with their repository tags. The `marks` rule asks, page by page, whether an in-flight change delivers each 🚧 line. The check never reads the archive today.

The store cannot see the application repository's git history or its deploys. `archive-preflight.mjs` takes `--deployed-at <sha>` on trust, checks its shape, and prints a line for a commit message nobody verifies. Nothing parses `No domain impact:`; it is a convention `spec-push` reads by eye.

## Goals / Non-Goals

**Goals:**

- Every gap closes with a check that runs in CI, or with a record a check in CI can read.
- Every exemption is a line in the change's own record, never a hidden constant.
- No second parser: the new rules read the `ChangeEntry` the readers already build.

**Non-Goals:**

- Writing the 🚧 lines for the changes already in flight.
- Making `openspec archive` itself refuse; the record it moves is what gets checked.

## Decisions

**Exemptions live in `.openspec.yaml`.** `page_waived: <why>`, `design_waived: <why>`, `deploy_waived: <who, why>`, and the record `deployed_at: <sha>` with `deployed_env: <environment>`. The manifest already carries `promoted_by`, `depends_on`, `skip_specs`; `openspec validate --strict` tolerates the keys, `openspec archive` moves the file whole, and one reader in `read-changes.mts` reads them all. A waiver in proposal prose or a `tasks.md` preamble would need its own regex and would not show in the same diff as the change's metadata.

**No start date.** The changes in flight that a rule would fail get the matching waiver written into their manifest by this change, in one sweep, each reading `predates the <rule> rule`. That is the store's own idiom for an exemption: on record, never an omission. A date constant would be code that only fits today, and `created` is author-typed, so a rule keyed on it fails open on a missing or backdated date. Archives are the one exception: the archive date prefix is written by the CLI, not typed, and rewriting seventy-four history records to say they predate a rule is worse than one line saying so. `archived` applies to archives dated on or after `2026-09-12`.

**`unmarked`, a FAIL rule.** An in-flight change with deltas passes when its proposal links at least one section of a page under `docs/prds/products/` and a 🚧 line sits under one of the sections it links, or when `page_waived` is set. The link is the binding: it is what the governance page asks the author to write, and the `marks` rule already accepts a section link as delivery. A rule keyed on the page's `spec:` would let a change pass on a 🚧 line another change put on the same page, which is the common case today on the listing and cart pages. A mark belongs to the `##` heading it sits under, which is the heading a link can name; `OpenMark` gains that section beside `where`, because `where` names a detail or example block, which no link can reach, and fourteen marks today sit above any heading and have no `where` at all. Linking a section for context without marking it is allowed: one marked linked section is enough.

**`design`, a FAIL rule.** An in-flight change whose `tasks.md` holds a group not tagged `(grade10-spec)` passes when `tech-design.md` exists or `design_waived` is set. A group with no tag counts: nine groups in flight carry none. Three changes fail it today. The store's `planning-dev` skill and the schema's `tech-design` entry are rewritten to say the same: a change with an application task group writes its design, and a change that skips it says why in the manifest.

**`archived`, a FAIL rule.** An archived change dated on or after `DEPLOY_RECORD_SINCE` passes when its manifest carries `deployed_at` or `deploy_waived`, or when every task group it has is tagged `(grade10-spec)`: nothing in a store-only change deploys, and the tag is the same signal `design` trusts. A missing manifest fails. The constant is set to the day this change merges, so no archive lands in the gap without a record to fix it with. `check-manual.mjs` gains `readArchivedChanges` beside `readChanges`, inside the block the `--pages` deploy mode skips.

The three rules live in one module, `tools/manual/check/record.mjs`: they are about the change record, not the pages or the fold. Each is registered in `RULES` in `context.mjs`, or its findings never print.

**`archive-preflight.mjs` writes the record and refuses unchecked tasks.** On a clear run it writes `deployed_at` and `deployed_env`, or `deploy_waived`, and `tasks_waived` when given, into the manifest and prints the commit to make. A write drops the key's line at column zero and appends `key: "<value>"`, quoted because a waiver starts with `@`. It refuses while any task in `tasks.md` is unchecked unless `--tasks-waived "<who, why>"` names the decision: eight of seventy-four archives shipped with open boxes, one at none of twenty-six, and a refusal with no waiver would be bulk-checked into silence. A change with no `tasks.md` owes nothing here.

**`pnpm plan shipped <change-id> [--env staging|production] [--merged <sha>...]`** in `plan.mjs`:

1. Open the change's manifest in the store through `openStoreFile(changeId, rel, { requireSettled: true })`, the generalisation of today's `openStoreTasks`: the change exists, the store is a repository, the file is clean, the store is not behind, the change is settled on main. First, because the preflight writes the file the dirty check reads.
2. Read the newest successful run of the deploy workflow for the environment's branch: `gh run list --workflow=deploy.yml --branch <branch> --status success --limit 1 --json headSha,url`. `production` deploys from the `production` branch only; `staging` from `main`, and a merge-labelled staging run keeps the dispatch sha as its head, so the check under-reports, never over-reports. The deployments API is not used: the migration and reconcile workflows write into the same GitHub environment, so its newest record is not a code deploy.
3. Resolve the merge commits: `--merged` when given, else the merged pull requests whose body carries a line `Change: <change-id>`, read from `gh pr list --state merged --limit 1000 --json number,body,mergeCommit,mergedAt` and filtered here, never through GitHub search, which tokenizes across hyphens and lags. Refuse when none is found, naming `--merged`; refuse loudly when the oldest pull request returned is newer than the change's `created`, because the window ran out rather than the change having no pull request; refuse a change whose groups are all in the store with "nothing here deploys", since the `archived` rule already passes it.
4. `git fetch`, then `git merge-base --is-ancestor <sha> <deployed>` for each: exit 0 is contained, 1 is not, anything else is a sha this clone does not have. Refuse on the first miss, naming it.
5. Run the store's preflight in place with `node`, never `pnpm run`, which installs first: `archive-preflight.mjs <id> --deployed-at <sha> --deployed-env <env>`.
6. Commit and push the manifest through `commitStore`, as `Record <id> deployed at <sha> (<env>)`.

`--env` defaults to `production`. A staging sha is recorded as staging; the archive skill keeps its line that staging-only is a judgement call, and the record says which it was. `--deploy-waived` is not accepted here: a waiver is written in the store, by hand, on an owner's say-so.

**PR descriptions close with `Change: <change-id>`** when the branch implements a change, as a footer beside the session line; `Also includes: <what>` drops its `outside <change-id>` suffix, which said the same thing. `shipped` reads it; a PR that predates the rule is named with `--merged`.

**Board.** A change whose `openspec list` row reads `no-tasks` prints `still being planned · since <created> (<n> days)`, reading `created` from the manifest at the store path the CLI resolved, and prints nothing extra when the field is absent. A row that reads `complete` prints `all tasks done · pnpm plan shipped <id> once it is deployed`; `done` prints that line in place of the one it prints today. The header counts page waivers, and separately the ones that do not read `predates the page rule`, so a new one shows on the day it is written.

**`lint.yml` gains an `openspec` job**: install the pinned CLI (`OPENSPEC_VERSION` as `manual.yml` pins it), `openspec validate --changes --strict`, `openspec validate --specs`. Both pass on the store today.

**`reality-sweep` reads `docs/prds/products/` on `origin/main`.** Lane (c) becomes *page silent*: a 🚧 line whose delivering change has every task checked, and a capability page with no divergence callout for a finding from (a) or (b).

**`review-changes`** gains one line on its Spec axis: a change with `page_waived` is reviewed on whether the waiver reads true.

**One name.** Where this change touches prose, the thing under `docs/prds/` is "the capability's page". The application repository's `AGENTS.md` and `archive-change` say so; `development.md` names `pnpm check:manual` there as this repository's engineering manual; `validation.md` gets one row for `pnpm plan validate`.

## Risks / Trade-offs

- Forty-odd manifests gain a `page_waived` line in one commit. Accepted: it is the honest state of those changes, it is grep-able, and each line leaves with its change at archive.
- `page_waived` can become the line every author writes. The board counts them, `review-changes` reads them, and the rule's message names what the line is standing in for.
- `shipped` depends on `gh` being authenticated and on the PR footer. Both refusals say what to do instead.
- A partial deploy (`component: grade10`) and a preview dispatch, which runs on the `production` branch and ships to preview hosts, are indistinguishable from a full production deploy in the run list. `shipped` prints the run URL so the reader can look.
