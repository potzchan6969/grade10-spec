---
name: git-operations
description: Safely inspect, branch, commit, publish, and review repository changes across Codex, Cursor, and generic agent environments. Use when Git or GitHub actions are requested, including status, branches, commits, pushes, pull requests, review comments, or CI checks.
---

# Git Operations

Use local `git` for repository state in every environment. Use the environment's GitHub capability only for GitHub-hosted work such as pull requests, reviews, labels, and CI checks.

## Start safely

1. Read repository instructions and inspect `git status --short`, the current branch, and relevant diffs before changing Git state.
2. Preserve unrelated or pre-existing changes. Stage explicit paths; do not use blanket staging unless the user clearly scoped the entire worktree.
3. Use a `codex/` branch prefix when creating branches unless repository instructions or the user specify another convention.
4. Before committing, run the applicable repository validation and review staged changes. Use Conventional Commit subjects and keep logically separate concerns in separate commits when practical.
5. Never force-push, amend, reset, discard, rebase published work, or bypass hooks unless the user explicitly asks and the exact target is understood.

## Select the GitHub adapter

Determine the current environment from available tools; do not assume credentials or a preferred integration is available.

| Environment | Prefer for GitHub work | Fallback |
| --- | --- | --- |
| Codex | Its integrated GitHub connection and GitHub-specific workflows | `gh` only when available and needed for missing capability |
| Cursor | GitHub CLI (`gh`) | GitHub web UI; report the blocked action if neither is authenticated |
| Generic agent | Any configured GitHub integration | `gh`, then GitHub web UI |

Use `git` directly for status, diff, branching, staging, commits, and pushes in every adapter. Do not represent an integration-only action as completed until its result confirms success.

## GitHub actions

- **PR discovery, review, and checks:** read the relevant PR metadata, review context, and CI status before proposing or applying fixes.
- **Publishing:** confirm the branch, remote, commit scope, and PR title/body before pushing or opening a pull request. Apply a repository-approved label when the selected adapter supports labels.
- **Authentication or capability failure:** identify the unavailable action and the required next step; do not attempt to obtain, print, store, or alter credentials.

## Handoff

Report the branch, validation performed, commit and push/PR result, plus any GitHub action that could not be completed. Link or identify the PR only after it exists.
