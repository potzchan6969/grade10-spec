---
name: fix-bug
description: "Fix a reported bug in a primitive, a block, a token or a catalog through the bug rounds - a diagnosis challenged by independent readers, a red test, a green fix, a review and the symptom walked again - with no OpenSpec change; or stop and route it to planning when the fix would move what is settled. Use when asked to fix something that does not work or look as it should, rather than to build something new."
---

# Fix a bug

[Bug Fixes](../../../docs/governance/bug-fixes.md) owns the rounds, the diagnosis template, the gates and the outcomes; read it before anything else. This skill runs those rounds from a session. The `agent-fix` label runs the same rounds from a report, in `.github/workflows/bug-fix.yml`.

**Done when:** the run ends `fixed` and its commits are on a branch. **Stop when:** it ends any other way - report the outcome and the posted rounds, and do not fix around the gate that stopped it. A fix restores the agreed look and never moves it; a commit the Design Override check stops follows [Design Override](../../../AGENTS.md#design-override).

## 1. Write the report down

- Put what was reported in a file: the symptom, the steps, where it was seen, the width, and the evidence. A screenshot is described in words, with its path.
- Start from a clean tree on a new branch.

## 2. Run the rounds

```bash
node scripts/bug-fix/run.mjs --report <file> \
  --agent scripts/bug-fix/claude-agent.sh --out <scratch>/bug-fix \
  --check 'pnpm run lint && pnpm run typecheck'
```

- `<out>/result.json` names the outcome, `<out>/comments/` holds each round, and `<out>/answers/` every agent's answer.
- A diagnosis that lands in the application repository ends as `moved`: the report is filed there and runs through that repository's `/fix-bug`.

## 3. By hand, only where the script cannot run

Run the same six rounds yourself and hold the same gates - the script's are the floor, never a suggestion:

- **Readers** - `node scripts/openspec/bug-readers.mjs <diagnosis|fix> --diagnosis <file> [--diff <file>]` names them. Dispatch each as its own subagent with its `.claude/agents/` definition, the report, the diagnosis and the diff, and nothing another reader said; then one verifier over all of them.
- **Red** - commit the test alone, and only after its command fails on the unfixed tree.
- **Green** - the test passes, the checks pass, the test files are unchanged since red, and no protected path moved.

## 4. Hand off

- Post each round on the report, or give them in the reply when there is none.
- Publishing is a pull request labelled `bug`, only when the user asks. The application picks the fix up when its pin moves to a `main` commit that holds it.
