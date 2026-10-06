---
name: spec-push
description: "Land planning commits on main with `pnpm push:main` - rebase onto origin/main, settle conflicts by reading the OpenSpec change, run the fast gate, push. Invoke with /spec-push. Only when invoked."
disable-model-invocation: true
---

# Spec push

Kept until the team has adopted the line commands (`Q84` of
`run-a-round-on-every-artifact`). `/workflow-land` lands one artifact on
`main` on the hand's word; this lands whatever planning commits sit ahead of
`origin/main`.

Landing is the handoff. The application repository reads this store at its
`main`, so a change sitting on a branch reaches nobody: `pnpm plan board` there
flags it and `pnpm plan claim` refuses it.

**Done when:** the commits are on `main`, or their pull request is open and set
to merge once green. **Stop when:** a conflict the change itself
cannot decide, or a check that fails for a reason outside the change.

## Chain

May follow `/commit` in the same message. Invoking this skill is the
authorisation to rebase the commits ahead of `origin/main` and push them to
`main`. It authorises nothing on a branch someone else pushed to.

## Gather

Run each as its own command:

- `git status`
- `git log --oneline origin/main..HEAD`
- `git log --format='%an' origin/main..HEAD | sort -u`

Stop before touching anything when:

- **The tree is dirty.** Commit through `/commit`, or stash.
- **Nothing is ahead of `origin/main`.** There is nothing to land.
- **The commits are not all yours.** Rebasing rewrites them. Name whose they
  are and ask first.

## Push

```bash
pnpm push:main
```

It fetches, rebases onto `origin/main`, runs the fast checks the paths owe
(`scripts/push-main/paths.mjs`), and pushes. Planning text — `openspec/changes`,
`openspec/specs` and `docs/` — lands on `main`; anything else goes to a pull
request that merges itself once its checks pass. `main`
moving under the push is a rebase and a gate again, three times at most.
`--dry-run` rebases and gates and pushes nothing; `--pr` sends anything through
a pull request, when the author wants someone to read it first.

- **Exit 1, a check failed** — fix it in a new commit and run it again.
- **Exit 2, a conflict** — the rebase was aborted and nothing moved; the next
  section.
- **Exit 3, lost the race three times** — run it again.

The hook `pnpm install` sets runs the same gate on any other push to `main`,
and refuses a shared surface there. Never pass `--no-verify`.

## Resolve by reading the change

A conflict here is two people writing the same requirement. Picking a side
records a requirement neither of them settled, and `openspec validate` still
passes — nothing downstream will catch it. Rebase by hand with
`git rebase origin/main`, and read first:

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
- **`openspec/changes/<id>/tasks.md`** — claims and checkmarks `pnpm plan`
  recorded on `main`. **Never resolve toward your side.** A checked box is a
  fact about work that landed, and dropping one under-reports the board with
  nothing to catch it. `pnpm run plan:preflight <change-id>` prints the state you are resolving
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
pnpm push:main
```


## Beyond the gate

The gate is what every push owes. The pull request's CI runs the rest for a
shared surface; for planning text, these are still yours:

**A delta with journeys and no suite does not push**, and that now includes a
capability whose journeys say `**Walked by:** nobody` — it is anchored on its
feature set, not exempt. If a `spec.md` on this branch has a `user-journeys.md`
and no `feature-tcs.md` beside it, stop and run `/spec-to-tcs <change-id>`, then
commit the suites before pushing — `pnpm run tcs:validate --require-suites`
names them. The blind pass belongs in the spec's own push, and lands
before the scenarios commit; see `docs/governance/specs-to-test-cases.md`.

**A suite with no `## Reconciliation` does not push either.** The section is the
only evidence the blind pass ran: without it a pass that found nothing and a
pass that never happened are the same diff.

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

## Confirm

Report where it landed — the new `main` SHA or the pull request URL — what the
rebase moved over, every conflict and how each was settled, and anything left
for a human. Then say the handoff out loud: the change is on `main`, so an
engineer can claim it with `pnpm plan claim` in the application repository.

## Related

- `/workflow-land` — one artifact, on the hand's word.
- `/planning-pm`, `/planning-qa`, `/planning-dev`, `/openspec-propose` — where
  the change was written.
