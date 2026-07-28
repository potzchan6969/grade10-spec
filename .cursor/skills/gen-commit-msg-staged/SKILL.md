---
name: gen-commit-msg-staged
description: Drafts conventional commit messages from staged git changes by analyzing diffs and recent history. Use when the user asks for a commit message, help committing staged changes, or /gen-commit-msg-staged — do not run git commit unless explicitly requested.
disable-model-invocation: true
---

# Gen Commit Message (Staged)

Draft a commit message for **staged** changes only. Do not commit unless the user explicitly asks.

## Gather context

Run these in **parallel** (read-only):

```bash
git status
git diff --staged
git log -10 --oneline
```

If nothing is staged, say so and suggest `git add` paths or offer to message unstaged changes only if the user agrees.

## Analyze

1. **Scope** — What changed (feature, fix, refactor, docs, chore, test)?
2. **Why** — User-visible or operational intent, not a file list.
3. **Split?** — When several files change, group them into small, reviewable commits by concern. If staged changes mix unrelated work (feature + docs + refactor), recommend per-chunk staging paths and commit messages instead of one combined commit.
4. **Style** — Match recent `git log` tone and length on this branch.
5. **Repo rules** — See [.cursor/rules/commits-and-prs.mdc](../../rules/commits-and-prs.mdc).

## Message format

**Do not** add issue/PR prefixes (`[#I-2568]`, `[#1522]`, `[AT]` in subject) — tooling adds those.

```
type: short imperative summary

Optional body: why and notable behavior; wrap at ~72 chars.
```

| Type | Use when |
| --- | --- |
| `feat` | New behavior or capability |
| `fix` | Bug or incorrect behavior |
| `refactor` | Behavior-preserving restructure |
| `chore` | Tooling, deps, config without product change |
| `ci` | GitHub Actions or other continuous-integration workflow changes |
| `agent` | Agent specifications, including skills, rules, and `AGENT.md` guidance |
| `docs` | Documentation only |
| `test` | Tests only |

Subject: lowercase type, colon, space, imperative phrase (no trailing period). Body optional; use when the why is not obvious from the subject.

## Output

Return:

1. **Recommended message** — ready to paste (subject + body if any).
2. **One-line rationale** — why this type and wording.
3. **Split suggestion** — when multiple files span distinct reviewable concerns, include suggested file groups, staging order, and a message for each commit.
4. **Optional commit command** — only if the user asked to commit; use HEREDOC:

```bash
git commit -m "$(cat <<'EOF'
type: short imperative summary

Optional body here.

EOF
)"
```

Never use `-i`, `--no-verify`, or amend unless the user explicitly requests it and git safety rules allow it.

## Examples

**Staged:** add a portable component and its Storybook states

```
feat: add prediction outcome summary component

Provide a reusable controlled summary for consumer apps.
```

**Staged:** correct a component label

```
fix: correct outcome label in prediction summary
```

**Staged:** feature code plus unrelated documentation edit

Recommend two commits:

```
feat: ...
```

```
docs: ...
```
