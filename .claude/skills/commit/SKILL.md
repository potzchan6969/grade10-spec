---
name: commit
description: "Create local git commits from scoped working-tree changes with this repo's type(domain) messages. Invoke with /commit; chain /pr-push to publish afterward."
disable-model-invocation: true
---

# Commit

- **Scope** - Run when `/commit` is invoked or [pr-push](../pr-push/SKILL.md) delegates dirty files belonging to its PR. Accept the requested files or change scope; leave unrelated work uncommitted.
- **Git Rules** - Follow [git-operations](../git-operations/SKILL.md) for inspection, validation, staged review and Git safety. Include untracked files when resolving the scope.
- **Branch** - On `main` or detached HEAD, create a feature branch from the current revision before committing. Use git-operations' branch naming rule; keep an existing feature branch.
- **Completion** - Stop when each scoped logical change is committed or there is nothing to commit. Report hashes, subjects, validation and excluded files. Publish only when `/pr-push` or equivalent explicit authorization accompanies the request.

## Grouping

- **File Groups** - Split unrelated implementation, documentation, refactoring and generated output at file boundaries. Do not use partial staging. If a file-level split is ambiguous, use one commit.
- **Domain** - Use the domain owning the outcome. Split independent domains where practical; never combine domain names in the subject.

## Message

```text
type(domain): brief description

Optional body when the reason is not clear from the subject.
```

- **Type** - Use `feat`, `fix`, `build`, `chore`, `refactor`, `docs`, `test` or `ci`. `feat` adds a capability; `fix` remedies broken or missing behavior.
- **Required Domain** - Use the affected product domain, an app-independent developer tool, or `base` for internal process and shared infrastructure. Brands and implementation roles are not domains.
- **Subject** - Keep it short and imperative, naming the outcome. Omit issue and PR prefixes; repository tooling adds them.

## Commit Each Group

1. **Stage** - Name every file explicitly. Exclude files outside the authorized group, including unrelated files already staged.

   ```bash
   git add -- <file1> <file2>
   ```

2. **Review** - Inspect the staged changes under git-operations before committing. Recheck the branch and staged set if another action may have changed them.
3. **Commit** - Pass the same explicit path list to keep unrelated staged work out. For a multiline message, write the exact text to a temporary file and pass its path.

   ```bash
   git commit -F <message-file> -- <file1> <file2>
   ```

4. **Verify** - Check the remaining working-tree state and report the created commits.

   ```bash
   git status --short
   ```
