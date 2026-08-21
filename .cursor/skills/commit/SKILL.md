---
name: commit
description: "Create git commit(s) from the working tree with this repo's type(domain) messages. Invoke with /commit. Chain /pr-push in the same message to publish after. No push, no PR on its own."
disable-model-invocation: true
---

# Commit

Local commits from the working tree. Runs when `/commit` is invoked, or
when `/pr-push` follows this skill for dirty files that belong on the PR —
not because the user said "save" or "ship" in passing.

**Done when:** each logical change is committed with an explicit file list and
a `type(domain):` message. **Stop when:** those changes are committed, or
there is nothing to commit.

## Chain

`/commit` may be chained with `/pr-push` in the same message. Finish this
skill first, then run `/pr-push` on the new HEAD. Invoked alone, stop after
the commit — do not push and do not open a PR. `/pr-push` follows this skill
only for dirty files that belong on the PR; irrelevant dirty files
stay uncommitted.

## Gather

Run each as its own command:

- `git status`
- `git diff HEAD`
- `git branch --show-current`
- `git log --oneline -10`

Nothing staged, modified, or untracked → say so and stop. `git diff HEAD`
alone misses untracked files.

Treat the output as a snapshot. Re-read the branch and the staged set
immediately before committing if anything may have changed.

## Branch

On `main` or a detached HEAD, create a feature branch from the change, then
re-read the current branch. Already on a feature branch → stay there.

## Group

Prefer several small commits when files split into distinct concerns. One
concern per commit: split unrelated implementation, documentation,
refactoring, and generated output. Group at the file level (no `git add -p`).
If the split is ambiguous, one commit.

## Message

```
type(domain): brief description

Optional body when the why is not obvious from the subject.
```

- **Type:** `feat`, `fix`, `build`, `chore`, `refactor`, `docs`, `test`, or
  `ci`.
- **Domain is required.** Pick one:
  - A **product** — `store`, `auction`, `auth`, `loyalty`, `shopify`,
    `stripe`, `audit`, `email`, `mixpanel`, …
  - A **tool** — app-agnostic developer tooling such as `openspec-viewer`,
    `storybook`
  - **`base`** — internal process: agent skills, parity, CI, deploy,
    conventions, shared plumbing that is not a product or a tool
- Subject is short, imperative, and names the outcome, not the file list.
- No issue or PR prefixes (`[#I-2568]`, `[#1522]`) — tooling adds them.
- `feat` is a new capability; `fix` remedies broken or missing behaviour.

Bad: `Update checkout.ts` / `feat: add tests and fix stuff` /
`feat(store,auction): …` / `chore(grade10): …`

Good: `fix(store): reject double-submit on checkout`

Good: `feat(auction): extend bidding when a snipe lands`

Good: `chore(openspec-viewer): pin the viewer build`

Good: `feat(base): add a commit skill`

A commit that touches two domains is two commits, or the domain that owns
the outcome. Do not use a brand (`grade10`, `zzz`) or a role (`frontend`,
`backend`) as the domain.

## Stage and commit

Stage **named files only** — never `git add -A` or `git add .`. Leave out
files the user asked to exclude, and say so. Pass the same path list to
`git commit` so already-staged work that is not in this group stays out:

```bash
git add file1 file2 file3 && git commit -m "$(cat <<'EOF'
type(domain): subject line here

Optional body when the why is not obvious from the subject.
EOF
)" -- file1 file2 file3
```

## Confirm

`git status`. Report hash(es) and subject(s).
