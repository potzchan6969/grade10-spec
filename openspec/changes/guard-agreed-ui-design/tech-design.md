## Context

Neither repository installs a git hook: `.git/hooks` holds only samples, and
there is no `core.hooksPath`, lefthook or husky. Work reaches `main` by
pull request today and increasingly by direct push (`plan:land`, the relay,
`pnpm plan claim`), and nothing on either path reads which UI lines a commit
removes. CI on `main` reports and never reverts.

The designer is the one `design` handle in `docs/prds/team.yaml`, keyed by
the e-mail her commits carry. No handle has a Slack member id yet. The
application pins the store at `external/grade10-spec`, and the store's root is
not one of its workspace packages, so a script run from there resolves only
what the application's own root installs. The application holds page code to its layers in
`scripts/checks/check-frontend-layers.mjs`, with an `EXEMPT` map of files
that break a rule on purpose, but it reads only `apps/*`, not the site
packages' `frontend` folders.

## Goals / Non-Goals

**Goals:**

- One check, one set of rules per repository, the same answer at commit, at
  push and on `main`
- Stateless: every answer is read from git and the commit message, with
  nothing recorded between runs
- A stop names every line it stops on, so it can be answered without the diff

**Non-Goals:**

- Blocking `main`, or reverting on it
- Deciding whether a visual change is right; the check only asks

## Decisions

**One engine in the store, one list in the application.**
`scripts/design-override/` is plain Node, so the application runs it from
`external/grade10-spec` with nothing installed there; the one package it
imports, `yaml`, through the store's own `team-parse.mjs`, resolves from
either repository's root. The store's four watched paths and the look
patterns live in the engine, and are its look and merge paths when it runs
in its own repository, the submodule included. The application's
`design-override.config.json` holds one list of git pathspecs, `sites` -
`apps/frontend/grade10`, `apps/frontend/zzz` and the `frontend` folders of
`appointment`, `doc-sign`, `e-kyc`, `grade10-auction`, `grade10-auth`,
`grade10-store`, `loyalty` and `vault` - read as the merge rule's paths
there, with no look rule, and as the block check's roots. Anywhere else with
no config, the engine exits 2, naming the file. The team map is the engine's own store's
`docs/prds/team.yaml`, so the application reads its pinned copy. A copy per
repository would drift the way the UI did.

**Two hook modes, one evaluation, and a separate report.** The evaluation
takes one commit sha and returns its stops, its people and its
`Design-Override:` reason. At commit, `check.mjs` first builds that commit
without recording it: `git write-tree`, then `git commit-tree` with
`-p HEAD`, `-p MERGE_HEAD` when present, and the message as git will record
it, under the author and committer git gives the hook. The unreferenced
objects are pruned by `git gc`.

| Entry | Called by | Reads |
| --- | --- | --- |
| `check.mjs --message <file>` | `.githooks/commit-msg` | The commit it builds from the index, `HEAD`, `MERGE_HEAD` and the message file |
| `check.mjs --push <remote>` | `.githooks/pre-push`, with its standard input | Each commit a pushed ref would send |
| `report.mjs <before> <after>` | The workflow on push to `main` | Each commit in `before..after`, or `after^!` when `before` is all zeros; posts through `gh api` |

A rebase or cherry-pick replays commits without `commit-msg`, which is why
the push checks again. For each pre-push line whose local sha is not all
zeros, the commits are `git rev-list <local> --not --remotes`, plus
`^<remote sha>` when that commit is known locally - one form for a new
branch, a push to a URL and an unfetched remote. Exit codes: 0 passes, 1
stops, 2 could not read something, naming it. The report exits 0 after
posting every comment, and 2 on a read or a post that failed. Stops are
sorted by file, then line. Every git call pins the settings whose output
the engine parses - `merge.conflictStyle=merge`, `core.quotePath=false`,
and on the diff `--no-color`, `--no-ext-diff` and fixed `a/` `b/` prefixes - so a
person's own config cannot change an answer, and git older than 2.38, which
lacks `merge-tree --write-tree`, exits 2. At commit, the hook reads the
message as git will record it by default; the push reads the recorded
message, so it is the final word when `-m`, `commit.cleanup` or a custom
comment character clean it differently.

**The look rule reads a single-parent commit's removed lines.**
`git diff -w -U0 --no-renames` over `look`. A removed line counts when it is
not blank, an import, a type line or a comment, and matches a look pattern:
`class=` or `className=`; `cn(`, `cva(`, `clsx(`, `twMerge(`, `tv(`;
`variants`, `defaultVariants`, `compoundVariants` or `variant` followed by `=`
or `:`; `style=` or `style:` with a brace; a motion key (`initial`,
`animate`, `exit`, `transition`, `duration`, `ease`, `delay`) at the start of
the line; a constant ending `_MS`, `_S`, `_EASE` or `_PX`; a string holding a
class token with a `-<value>` part on a Tailwind utility name, or a
`<state>:` prefix; a story's `title:`; any line
of a `.css` file. Lines added in the commit's `look` paths are counted,
trimmed with whitespace collapsed, and each one excuses one removed line
equal to it: a move passes, a reordered class list or a line moved out of
`look` does not. `tokens.json` is left out of the line diff and compared
parsed: a token (an object holding `$value`) removed or changed, its
`$description` aside. On September's `main`, 107 of 256 non-designer commits
touching those paths would stop, and #667, #185 and #547 all would.

**A merge is compared with git's own merge.** A commit with more than one
parent skips the look rule. `git merge-tree --write-tree` merges its parents
(folding a third parent onto a throwaway commit of the first two), and the
result is diffed against that tree over `merge`, read like the look rule but
keeping every removed line that is not blank, a lone bracket or a conflict
marker. A line git would have kept and the result drops is a stop; a pull
that brings the other side's own removals matches git's merge and passes.
Renames and criss-cross bases are git's. Each stop names the parent whose
file holds the line. It applies to everyone: `c865b8565` drops 45 lines by
it.

**Exempt by e-mail.** The author, committer or a `Co-authored-by:` e-mail,
matched without case, belonging to a `design` handle in the team map, read
through `parseTeamMap`. A commit whose people the map does not know is never
exempt, and the merge rule and the block check ignore the exemption. A map
that cannot be read or parsed exits 2, naming the file.

**The line is a trailer.** The message is read as git will record it: in
`--message` mode the file is cut at the scissors line and lines starting
with `core.commentChar` are dropped. `Design-Override:` is found in the last
paragraph, beside other trailers. A value empty after trimming is refused.
One line covers every stop in the commit. `git interpret-trailers` is not
used: its rule that the whole paragraph be trailers would refuse a line an
agent writes under a closing sentence.

**The stop reads as an instruction.** Grouped by file: the removed line, the
line that replaced it in the same hunk when there is one, the parent that
held it for a merge, and `git blame --porcelain` at that parent (the first
parent for the look rule) for who set it, when and in
which commit. It ends with what to ask the person and, as its own last
paragraph, the exact trailer to add.

**Rebuilt blocks are their own check.** `scripts/checks/check-store-blocks.mjs`
in the application reads the site roots from the application's `sites` list
for two rules: no import of a block-shaped primitive - `card`, `dialog`,
`dialog-header`, `drawer`, `tabs`, `table*`, `stepper`, `step*`, `list`,
`empty-state`, `pagination*`, `breadcrumb*`, `radio-card` - and no
`className` inside the opening tag of an element imported from
`@grade10/ui`, found by scanning the tag to its closing `>` outside braces and strings, and
through `import { X as Y }`. It
exports its rule over `(path, text)` and its `EXEMPT` map, and walks files
only when run: the working tree in `check:libs`, and otherwise a tree with
`--rev <tree-ish>` - `$(git write-tree)` from `commit-msg`, each pushed tip
from `pre-push` - read through `git ls-tree -r` and `git cat-file`. A
page that rebuilds a block on purpose is an `EXEMPT` entry with its reason,
covering the whole page; today's rebuilt pages, among them
`AuctionWinnerOrderPage.tsx`, `OrderDetailsPage.tsx` and
`AccountAuctionRecordPage.tsx`, are listed so each is visible debt. An entry
with an empty reason, or naming a page that is gone or rebuilds nothing,
fails the check. A block rebuilt from plain elements, as
`ListingCatalogueCard.tsx` rebuilds a card, is not seen and stays with
review. Measured on September's `main`, 24 commits added such an
import. Folding it into `check-frontend-layers.mjs` was rejected: that
check's roots are the apps, and widening them would hold the site packages
to layer rules written for apps.

**Hooks set on install, not in CI.** `prepare` runs an install script that
sets `core.hooksPath .githooks`, and in the application also inside
`external/grade10-spec`. It does nothing outside a git checkout and when
`CI` is set, so the lint autofix, the design-sync verdict and the bug-fix
commits in CI are read by the report rather than stopped with no person to
ask; the tests that install run with `CI` cleared. `.githooks/commit-msg` and `.githooks/pre-push` are POSIX `sh` calling
Node. When the store's engine is missing under `external/grade10-spec`, the
application's hooks fail and name `git submodule update --init
external/grade10-spec`.

**`main` posts a commit comment.** The workflow on push to `main` in each
repository checks out with `fetch-depth: 0` (and `submodules: true` in the
application) and `permissions: contents: write`, then runs `report.mjs`. It
posts on each commit that stops, with or without the line, mentioning every
`design` handle and listing the lines. A comment carries the marker
`<!-- design-override -->`, and a commit that already has one is skipped, so
a re-run posts nothing twice. The report refuses a shallow clone, naming
`git fetch --unshallow`.

**Instructions are one rule in each `AGENTS.md`.** Under the heading
`Design Override`: implementation keeps the agreed look; a missing state or
variant is the designer's; a stop is shown to the person, and the
`Design-Override:` line or an `EXEMPT` reason is written only on their yes;
`--no-verify` is never used. `workflow-build`, `fix-bug` and
`frontend-structure` link that heading rather than restate it.

**Tests build throwaway repositories.** `scripts/design-override/*.test.mjs`,
run by a `test:design-override` script chained into the store's `test`: one
case per scenario task 1.1 names, titled by its id, plus the staged-only
case, each a `git init` in a temporary directory with
`GIT_CONFIG_GLOBAL=/dev/null`, `GIT_CONFIG_NOSYSTEM=1` and fixed people and
dates. The report's tests put a stub `gh` first on `PATH`. #667, #185, #547
and `c865b8565` are rebuilt as minimal commits. In the application,
`scripts/checks/test/check-store-blocks.test.mjs` and
`scripts/checks/test/githooks.test.mjs` run in `check:libs`.

## Migration Plan

1. **Store** - the engine, its tests, the hooks, `prepare`, the workflow and
   the `AGENTS.md` rule land together
2. **Application** - its first commit bumps `external/grade10-spec` to a
   store `main` holding step 1, so its hooks never call an engine its pin
   lacks; the tests, then the block check with today's rebuilt pages listed,
   then the config, the hooks, `prepare` and the workflow, then the
   `AGENTS.md` rule follow in their own commits, so no hook is turned on
   before its check exists
3. **Everyone** - runs `pnpm install` once in each repository to set the
   hooks path

## Risks / Trade-offs

- **About 5 stops a day** - a stop that fires too often gets confirmed
  unread. The patterns live in the engine, one set for both repositories, and
  the stops per week are read after the first two weeks
- **A pattern misses a change** - a renamed constant or a moved class that
  changes nothing the patterns read passes. Screenshots are the follow-on
  that closes this
- **A hook is skipped** - `--no-verify`, or a clone that never ran
  `pnpm install`. The `main` report catches both after the fact
- **A co-author line is trusted** - naming the designer as co-author passes
  unreported; writing it falsely is deliberate, which this guard does not
  defend against
- **The application runs the pinned engine** - a rule fixed in the store
  reaches the application at its next bump
