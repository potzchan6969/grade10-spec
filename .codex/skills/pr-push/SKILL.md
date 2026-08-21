---
name: pr-push
description: "Create a feature branch when needed, push it, and ensure an open pull request exists. Invoke with /pr-push. Dirty files that belong on this PR are committed via /commit first; irrelevant dirty files do not block the push. When this repo and a submodule both have new commits, push the submodule first so CI can fetch that SHA. Chain after /commit in the same message. Re-run to create the PR if missing; rewrite the description only when code changed."
disable-model-invocation: true
---

# Push and pull request

Publish the current branch and make sure an open PR exists. Runs only when
`/pr-push` is invoked — not because the user said "ship" in passing.
Re-run any time in the session.

**Done when:** the branch is on the remote and an open PR URL is in hand.
**Stop when:** there is nothing to publish.

## Chain

`/pr-push` may be chained after `/commit` in the same message. If this
message also invoked `/commit`, that skill runs first and this one sees
the new commits. Invoked alone, follow `/commit` only for dirty files that
belong on this PR (read `.cursor/skills/commit/SKILL.md`). Irrelevant dirty
files stay uncommitted — still push.

## Session memory

Keep two facts for this branch across invocations in this session:

- `pr_url` — the open PR, once known
- `described_at` — `HEAD` SHA at the last time this skill wrote the title
  or body

Judge from that memory and from whether **this session** changed code
(edits that were committed, new commits). Do **not** read the PR body to
decide, and do **not** fetch it "to sync". Existence checks must not request
`body` — `gh pr view --json url` or `gh pr list --head <branch> --json url`.
Never a bare `gh pr view`; it prints the description.

## Gather

Run each as its own command:

- `git status`
- `git branch --show-current`
- `git rev-parse HEAD`
- `git log --oneline origin/main..HEAD`
- `git submodule status`
- `git diff --submodule origin/main...HEAD`

Then:

1. Unstaged, staged, or untracked files:
   - Belong on this PR (this session's change, or otherwise part of what
     is being published) → follow `/commit` for those files, then
     re-gather. A dirty submodule worktree is committed in that checkout
     first only when this PR is pinning that gitlink.
   - Irrelevant (unrelated WIP, a submodule checkout that is not being
     pinned here) → leave them. Do not stop. Say what was left out.
2. On `main` with publishable work (dirty files or commits ahead of
   `origin/main`) → create a feature branch before committing or pushing.
   Name it `<type>/<short-description>` using the commit type that describes
   the change (`feat/`, `fix/`, `build/`, `chore/`, `docs/`, `refactor/`,
   `test/`, or `ci/`), and run `git switch -c <branch>`; then re-gather the
   branch and status. Never push `main` directly.
3. Detached HEAD → stop. A named feature branch is required.
4. No commits ahead of `origin/main` → stop. Nothing to PR.

## Push

When this repo and a submodule both have new commits, push the submodule
first. CI checks out each submodule at the SHA this repo records; that SHA
must already exist on the submodule remote.

A submodule needs a push when unpublished commits here change its gitlink,
or its worktree has commits not on any remote-tracking branch:

```bash
git -C <path> log --oneline --branches --not --remotes
```

Skip uninitialized submodules (`-` in `git submodule status`). For each
that needs a push, on a branch:

```bash
git -C <path> push -u origin HEAD
```

Detached HEAD whose SHA is not on a remote → stop. Do not push this repo
until that SHA is fetchable.

Then:

```bash
git push -u origin HEAD
```

Do this on every run so new commits land on an existing PR. A dirty tree
does not block this step.

## Ensure a PR

If this session already has `pr_url`, reuse it. Otherwise probe existence
(`url` only). A non-zero probe is unknown — fix auth or connectivity; do
not treat it as "no PR".

**No open PR** → create one. Write the title and body from this session
and the local `origin/main...HEAD` log/diff. Create as a draft unless the
user asked otherwise. Apply one label: `feature`, `bug`, `ci`, `agent`,
`enhancement`, `maintenance`, or `documentation`. Pass the body through a
file (`--body-file`), never `--body` on stdin. Where `gh` cannot create PRs,
use the host's PR tool the same way. Remember `pr_url` and set
`described_at` to `HEAD`.

```bash
gh pr create --draft --title "<title>" --body-file "$BODY_FILE"
```

**Open PR already** → do not touch the description unless **code changed
in this session** since `described_at` (or since the start of the session,
if this is the first run and the session itself modified code). No code
change → report `pr_url` and stop. Code change → rewrite title and body
from the session and the local log/diff, without reading the existing
body, then:

```bash
gh pr edit --title "<title>" --body-file "$BODY_FILE"
```

Set `described_at` to `HEAD`.

A later run with no new commits is a no-op on the description even if the
PR is empty or stale-looking — you did not look.

## Description

The diff is on the PR. The body says what the diff cannot: what is now
possible or fixed, and any decision a reviewer must judge. Short,
important first. No issue or PR prefixes in the title; tooling adds them.

When the branch implements an OpenSpec change and carries commits outside
it, name them on one closing line — `Also includes: <what>, outside
<change-id>` — rather than folding them into the summary, so the reviewer
knows which part the spec covers. Judge that from what this session did and
the local log; do not go hunting for a change to match. No change in play,
or nothing outside it, means no line. It is information, never a reason to
hold the push.

## Confirm

Report the PR URL, whether this run created or only pushed, whether
submodules were pushed first, whether dirty files were left out, and
whether the description was written, rewritten, or left alone.
