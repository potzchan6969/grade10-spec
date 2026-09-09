---
name: spec-push
description: "Land a spec branch on main - rebase onto origin/main, resolve conflicts by reading the OpenSpec change, validate, force-push, and merge the PR once it is settled and the author says go. Invoke with /spec-push. Only when invoked."
disable-model-invocation: true
---

# Spec push

Rebase this branch onto `main`, settle what conflicts by reading the change
rather than the hunk, and merge the PR once nothing is outstanding.

Merging here is the handoff, not a formality. The application repository reads
this store at its `main`, so a change sitting on a branch reaches nobody:
`pnpm plan board` there flags it and `pnpm plan claim` refuses it. Until this
runs, the work cannot be picked up.

**Done when:** the PR is merged into `main`, or the merge is the only thing
left and the author has been asked for it. **Stop when:** something is
unsettled — a conflict the change itself cannot decide, a red check, or a
review still asking for something.

## Chain

May follow `/commit` and `/pr-push` in the same message. Invoked alone it
expects a pushed branch with an open PR; no PR yet → run `/pr-push` first
rather than opening one here.

Invoking this skill is the authorisation to rebase published work and
force-push **this** branch. It authorises nothing on any other branch, never
`main` directly, and not the merge itself — that is asked for at the end.

## Gather

Run each as its own command:

- `git status`
- `git branch --show-current`
- `git fetch origin`
- `git log --oneline origin/main..HEAD`
- `git log --oneline HEAD..origin/main`
- `git log --format='%an' origin/main..HEAD | sort -u`
- `gh pr list --head <branch> --state open --json url,isDraft,mergeable,reviewDecision`

Stop before touching anything when:

- **The tree is dirty.** Commit through `/commit`, or stash. A rebase either
  refuses or carries the work into a conflict nobody meant to resolve.
- **HEAD is detached, or the branch is `main`.** `/pr-push` is what makes a
  branch out of work sitting on `main`.
- **Nothing is ahead of `origin/main`.** There is nothing to land.
- **The commits are not all yours.** Rebasing rewrites them and the force-push
  discards what their author pushed. Name whose they are and ask first.

Then name the OpenSpec changes the branch touches — the directories under
`openspec/changes/` in `git diff --name-only origin/main...HEAD`. Those are
what the review below is about.

## Rebase

```bash
git rebase origin/main
```

Clean → skip to **Validate**. Conflict → the next section. `git rebase --abort`
returns to exactly where you started, and is the right move whenever the
resolution is not decided by the change itself.

## Resolve by reading the change

A conflict here is two people writing the same requirement. Picking a side
records a requirement neither of them settled, and `openspec validate` still
passes — nothing downstream will catch it. Read first:

```bash
openspec show <change-id>
git log --oneline origin/main -- <conflicted-path>
```

**In a rebase, `--ours` is `main` and `--theirs` is your branch.** Backwards is
how a resolution silently drops a side.

By what conflicted:

- **`openspec/changes/<id>/specs/**/spec.md`** — a delta, and `main` moved the
  capability under it. Re-read the durable spec as it now stands and rewrite
  the delta against that. A delta that only re-states what `main` already says
  is deleted, not merged.
- **`openspec/specs/**/spec.md`** — a durable spec, usually because `main`
  archived a change that folded its deltas in. The durable spec is the source
  of truth: your side survives only where it says something that one does not.
- **`openspec/changes/<id>/tasks.md`** — checkmarks written from the other
  clone. **Never resolve toward your side.** A checked box is a fact about work
  that landed, and dropping one under-reports the board with nothing to catch
  it. `pnpm run plan:preflight <change-id>` prints the state you are resolving
  against.
- **`proposal.md`, `tech-design.md`, `ui-design.md`** — prose. Both sides usually belong;
  say the merged thing once rather than stacking two paragraphs.
- **Generated files** — never resolved by hand. Take either side, regenerate,
  commit the output: `packages/design-system/src/theme.css` and
  `src/themes/grade10.css` from `pnpm run tokens:build`, `.codex/skills` and
  `.claude/skills` from `pnpm run agent:sync-parity`, `pnpm-lock.yaml` from
  `pnpm install`.
- **`packages/i18n/messages/**`** — both sides' keys, unioned. `pnpm run test`
  refuses a key left unanswered or answered twice.

A conflict that turns on a product decision is not yours. Abort, say what each
side claims, and let the change's author decide.

```bash
git add <paths> && git rebase --continue
```

## Validate

On the rebased commits, not the ones you started with:

- `openspec validate <change-id> --strict` — every change on the branch.
- `openspec validate --specs` — a durable spec was touched or conflicted.
- `pnpm run lint` and `pnpm run typecheck` — always.
- `pnpm run design-sync:check` — a primitive under
  `packages/design-system/src/components/` changed.
- `pnpm run test` — `packages/i18n` or `packages/ui` changed.
- `pnpm run agent:check-parity` — agent instructions, rules, or skills changed.
- `pnpm run tcs:validate` — always. It is cheap, it needs no install, and it
  catches a suite whose header contradicts its cases or whose trace points at
  an id the spec no longer issues.

**A delta with journeys and no suite does not push.** If a `spec.md` on this
branch has a `user-journeys.md` and no `feature-tcs.md` beside it, stop and run
`/spec-to-tcs <change-id>`, then commit the suites before pushing —
`pnpm run tcs:validate --require-suites` names them. Generation belongs in the
spec's own pull request; see `docs/governance/specs-to-test-cases.md`.

**A change that moves a cross-feature path settles its domain suite.** Do not
ask; compute it. For each domain the branch touches that holds an
`openspec/specs/<product>/<domain>/domain-tcs.md`, intersect the journeys of the
capabilities the change carries with the `**Trace:**` lines in that `domain-tcs.md`.
A hit — or a capability new to a domain that already has an `domain-tcs.md` — means
the change either carries an `domain-tcs.md` edit or one line in its `proposal.md`:

```text
No domain impact: <why>
```

Neither present, no push: run `/spec-to-tcs domain <domain>`, or write the
line. No hit, nothing to say — most changes never trip this. `## Impact` is
not the signal; it records affected code and packages, not the paths a person
walks.

A regenerated file is a commit, not a dirty tree left behind.

## Push

```bash
git push --force-with-lease
```

Never `--force`: the lease refuses when the remote moved under you, which is
exactly the case where someone else pushed to this branch. Refused → re-gather,
do not escalate. No rebase happened → plain `git push`.

## Merge when settled

Settled is all of these, checked rather than assumed:

```bash
gh pr checks <pr-url>
gh pr view <pr-url> --json isDraft,mergeable,mergeStateStatus,reviewDecision,reviewRequests
```

- Checks green. Pending is not green — wait, or report and stop. A failure is
  compared against the same check on the base first:

  ```bash
  gh run list --branch main --workflow=<workflow> --limit 3 --json conclusion,headSha
  ```

  Red on the base too → inherited, not yours. Still not green, so it still
  stops, but say which commits on `main` it has been failing on rather than
  letting it read as something this branch broke. Landing onto a red base is
  the author's call to make, not yours.
- `reviewDecision` is not `CHANGES_REQUESTED`.
- `reviewRequests` is empty. Someone was asked to look and has not yet.
- `mergeable` is `MERGEABLE`.
- Validation above passed.

Any one unmet or unknown → stop and say which. Do not merge through it.

All met, and the PR is a draft:

```bash
gh pr ready <pr-url>
```

A draft here is `/pr-push`'s default, not a decision anyone made — every PR
from that skill starts as one. Invoking `/spec-push` is the author saying the
change is finished, which is the same thing clicking *Ready for review* says,
so clear it rather than stopping on it. A reviewer who was actually asked for
is the case above, and that one does stop.

Then ask before merging. Say what lands — the change ids, the commits, the
base — and wait. Everything up to here is recoverable: a rebase from the
reflog, a force-push from the remote's old SHA. The merge is not, and it is the
step that puts a requirement in front of every engineer reading the store.

On the go-ahead:

```bash
gh pr merge <pr-url> --merge
```

A merge commit, matching this repository's history. The branch stays behind;
deleting it is the author's call.

## Confirm

Report the PR URL and whether it merged, what the rebase moved over, every
conflict and how each was settled, what validation ran, and anything left for a
human.

Then say the handoff out loud: the change is on `main`, so an engineer can
`pnpm plan sync` in the application repository and claim it.

## Related

- `/pr-push` — opens the PR this one lands.
- `/planning-pm`, `/planning-dev`, `/openspec-propose` — where the change was
  written.
