## Context

Neither repository installs a git hook: `.git/hooks` holds only samples, and
there is no `core.hooksPath`, lefthook or husky. Work reaches `main` by
pull request today and increasingly by direct push (`plan:land`, the relay,
`pnpm plan claim`), and nothing on either path reads which UI lines a commit
removes. CI on `main` reports and never reverts.

The designer is the one `design` handle in `docs/prds/team.yaml`, keyed by
the e-mail her commits carry. No handle has a Slack member id yet. The
application pins the store at `external/grade10-spec`, but the store's root is
not one of its workspace packages, so a script run from there resolves only
Node's own modules. The application already holds page code to its layers in
`scripts/checks/check-frontend-layers.mjs`, with an `EXEMPT` map of files
that break a rule on purpose.

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

**One engine in the store, a config in each repository.**
`scripts/design-override/check.mjs` is plain Node with no dependency, so the
application runs it from `external/grade10-spec` without installing
anything there. `design-override.config.json` at each repository root names
the watched paths and the path to `team.yaml`. A submodule bump moves the
engine for the application; a copy per repository would drift the way the UI
did.

**Three modes, one evaluation.** The evaluation takes a commit's diff, its
message and its people, and returns the stops.

| Mode | Called by | Reads |
| --- | --- | --- |
| `--message <file>` | `.githooks/commit-msg` | The staged diff, `MERGE_HEAD` when present, the message file, `git var GIT_AUTHOR_IDENT` and `GIT_COMMITTER_IDENT` |
| `--range <a>..<b>` | `.githooks/pre-push`, one call per pushed ref | Each commit in the range: its parents, its diff, its message, its author and committer |
| `--range <a>..<b> --report` | The workflow on push to `main` | As above, then posts on each commit that stops or carries the line |

A rebase or cherry-pick replays commits without `commit-msg`, and an amend is
checked against the commit it replaces, which is why the push checks the
range again. Pre-push reads `<local ref> <local sha> <remote ref> <remote sha>`
lines: an all-zero local sha is a deletion and is skipped; an all-zero remote
sha is a new branch, checked as `git rev-list <local sha> --not
--remotes=<remote>`.

**The look rule reads a single-parent commit's removed lines.**
`git diff -w -U0 --no-renames` over the watched paths. A removed line counts
when it is not blank, not an import, a type or a comment, not added back
anywhere in the same commit, and it matches one of the look patterns: a class
string, `cn(`, `cva(`, a variant key, `style=`, a motion key (`initial`,
`animate`, `exit`, `transition`, `duration`, `ease`, `delay`), a constant
ending `_MS`, `_S`, `_EASE` or `_PX`, or a story `title:`. `tokens.json` is
compared parsed: a token path removed or its value changed counts, and a
comma rewritten by an added token does not. `-w` passes formatting; the
added-back test passes moves. On September's `main`, 107 of 256 non-designer
commits touching those paths would stop, and #667, #185 and #547 all would.

**A merge runs the merge rule only.** Diffed against its first parent, a
merge would show the other side's own removals as its own, and every pull
would stop. So for a commit with two parents, each watched file is read from
the base, both parents and the result, as lines trimmed and with whitespace
collapsed, blanks and lone brackets left out. A line one parent holds and the
result drops stops the commit, unless the base held it and the other parent
removed it. Lines both parents hold and the merge itself removes are caught by
the same test. It applies to every committer: `c865b8565` drops 45 lines by it.

**Exempt by e-mail.** The author, committer or a `Co-authored-by:` e-mail,
matched case-insensitively, belonging to a `design` handle in `team.yaml`. A
commit whose people `team.yaml` does not know is never exempt. The merge rule
ignores the exemption.

**The line is a trailer.** `git interpret-trailers --parse` reads
`Design-Override` from the message's last paragraph. A value empty after
trimming is refused. One line covers every stop in the commit.

**The stop reads as an instruction.** Grouped by file: the removed line, the
line that replaced it in the same hunk when there is one, and `git blame -L
<n>,<n>` at the commit's first parent (`HEAD` at commit time) for who set it,
when and in which commit. It ends with what to ask the person and, as its own
last paragraph, the exact trailer to add. It exits 1.

**Rebuilt blocks are a layer rule.** `check-frontend-layers.mjs` gains one
rule over site page code: no import of the block-shaped primitives - `card`,
`dialog`, `dialog-header`, `drawer`, `tabs`, `table*`, `stepper`, `step*`,
`list`, `empty-state`, `pagination*`, `breadcrumb*`, `radio-card` - and no
`className` inside the opening tag of an element imported from `@grade10/ui`,
found by scanning that tag's text to its closing `>`. A page that does it on
purpose is an `EXEMPT` entry with its reason; today's rebuilt pages, among
them `AuctionWinnerOrderPage.tsx`, `ListingCatalogueCard.tsx` and
`AccountAuctionRecordPage.tsx`, are listed that way, so each is visible debt.
The application's `commit-msg` hook runs it on the staged files. Its reason
lives with the page because the page keeps rebuilding the block after the
commit. Measured on September's `main`, 24 commits added such an import.

**Hooks set on install.** A `prepare` script runs
`git config core.hooksPath .githooks`; the application's also runs it inside
`external/grade10-spec`. `.githooks/commit-msg` and `.githooks/pre-push` are
POSIX `sh` calling Node. When the store's engine is missing under
`external/grade10-spec`, the application's hook fails and names the
submodule command to run, rather than passing.

**`main` posts a commit comment.** The workflow on push to `main` in each
repository runs the report mode over `before..after` and posts a comment on
each commit that stops or carries the line, mentioning every `design` handle
and listing the lines. It declares `permissions: contents: write`; the
application's checks out with `submodules: true`. A comment carries the
marker `<!-- design-override -->`, and a commit that already has one is
skipped, so a re-run posts nothing twice. A comment that cannot be posted
fails the job. A push that creates the branch, where `before` is all zeros,
reads `after`'s first parent.

**Instructions are one rule in each `AGENTS.md`.** Under the heading
`Design Override`: implementation keeps the agreed look; a missing state or
variant is the designer's; a stop is shown to the person, and the
`Design-Override:` line or an `EXEMPT` reason is written only on their yes;
`--no-verify` is never used. `workflow-build`, `fix-bug` and
`frontend-structure` link that heading rather than restate it.

**Tests build throwaway repositories.** `node --test` under
`scripts/design-override/`, each case a `git init` in a temporary directory:
a move, a reformat, a new story, an added token, each look pattern, a merge
that drops either side and a clean pull, a new branch and a deleted one at
push, the designer as author, committer and co-author, an agent committing
for the designer, an empty trailer, and #667, #185, #547 and `c865b8565`
rebuilt as minimal commits. They run in the store's `pnpm run test`. The
rebuilt-block rule is tested beside the other layer rules in the application,
with a `className` on a tag that spans lines.

## Migration Plan

1. **Store** - the engine, its tests, the config, the hooks, `prepare`, the
   workflow and the `AGENTS.md` rule land together
2. **Application** - one commit bumps `external/grade10-spec` to that store
   version and adds the hooks, the config, `prepare`, the workflow, the layer
   rule with today's rebuilt pages listed, and the `AGENTS.md` rule, so its
   hooks never call an engine its pin lacks
3. **Everyone** - runs `pnpm install` once in each repository to set the
   hooks path

## Risks / Trade-offs

- **About 5 stops a day** - a stop that fires too often gets confirmed
  unread. The patterns live in the config, and the stops per week are read
  after the first two weeks
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
