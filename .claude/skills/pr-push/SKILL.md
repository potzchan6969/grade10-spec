---
name: pr-push
description: "Publish a feature branch and ensure an open pull request exists. Invoke with /pr-push, optionally after /commit. Commit only dirty files belonging to the PR; refresh its description only for committed changes made in this session."
disable-model-invocation: true
---

# Push and Pull Request

- **Scope** - Run for `/pr-push` or an explicit request to publish a PR. Accept the current branch and authorized change scope. Planning text normally lands through [spec-push](../spec-push/SKILL.md); an explicit PR request uses this skill.
- **Git Rules** - Follow [git-operations](../git-operations/SKILL.md) for local inspection, validation, branch naming, Git safety and adapter selection. Use the integrated GitHub connection first; use `gh` only when that connection is unavailable or lacks the needed capability.
- **Completion** - Finish with the branch published and a confirmed open PR URL, or report that no commits need publishing. Report the branch, validation, push result, excluded dirty files and whether the PR and description were created, updated or unchanged.

## Session Memory

- **PR URL** - Keep `pr_url` for this branch once confirmed.
- **Described Revision** - Keep `described_at`, the HEAD SHA when this skill last wrote the title or body.
- **Description Reads** - Decide whether to refresh from session changes and local history. Do not read or fetch the PR body to make that decision; existence probes request metadata only. A body read explicitly required by the user or higher-priority instructions takes precedence.

## Publish

1. **Resolve Scope** - Inspect local state through git-operations. If the request also invokes `/commit`, finish it first. Otherwise delegate only dirty files belonging to this PR to [commit](../commit/SKILL.md), then recheck state. Unrelated dirty files do not block publication.
2. **Branch** - On `main` or detached HEAD with publishable work, create a feature branch from the current revision using git-operations' naming rule. Recheck the branch before pushing; never push `main` through this skill.
3. **Compare** - Fetch the current base, then read the commits and diff against its full remote-tracking ref. Stop if there are no commits ahead. Use the resulting scope to verify the PR title and body.

   ```bash
   git fetch origin main
   ```

   ```bash
   git log --oneline refs/remotes/origin/main..HEAD
   ```

   ```bash
   git diff refs/remotes/origin/main...HEAD
   ```

4. **Push** - Push on every invocation so new commits reach an existing PR. Git-operations owns refusals and recovery; this skill grants no force-push authorization.

   ```bash
   git push -u origin HEAD
   ```

5. **Find the PR** - Confirm the remembered PR is still open, or query open PRs for the branch with the selected GitHub adapter. A failed probe leaves existence unknown; resolve the failure before creating anything. CLI fallback:

   ```bash
   gh pr list --head <branch> --state open --json url
   ```

6. **Create or Refresh** - If no open PR exists, create a draft unless the user requested otherwise. Apply an available repository-approved label from [AGENTS.md](../../../AGENTS.md#pushes-pull-requests-and-commits). For an existing PR, refresh only when this session committed changes after `described_at`, or since session start when no described revision exists. A repeat run without such changes leaves its title and body alone. Save `pr_url` and, after writing a description, set `described_at` to HEAD.

## Description

- **Content** - Lead with what becomes possible or is fixed, then decisions a reviewer must judge and relevant validation. Derive it from the session and local branch log/diff. Omit issue and PR prefixes in the title.
- **OpenSpec Scope** - If the branch implements a known OpenSpec change and includes commits outside it, add one closing line: `Also includes: <what>, outside <change-id>`. Use the session and local history; do not search for a change solely to add this line.
- **Write Method** - Prefer structured arguments in the integrated GitHub tool. For CLI fallback, write the exact multiline body to a temporary file and pass it through `--body-file`.

Create with the CLI fallback:

```bash
gh pr create --draft --title "<title>" --body-file <body-file>
```

Update with the CLI fallback:

```bash
gh pr edit <pr-url> --title "<title>" --body-file <body-file>
```
