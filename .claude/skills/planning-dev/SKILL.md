---
name: planning-dev
description: Take a marked product page to build - a fresh reading of its 🚧 sections, ids on every rule a test proves, then page-build. Routes a change still open under openspec/changes/ to its legacy procedure of QA1 blind cases, Dev design, scenarios and tasks, QA2 reconciliation and acceptance.
---

# Take a Page to Build

**An open OpenSpec change** - when the argument names a directory under
`openspec/changes/` (not `archive/`), follow [LEGACY.md](LEGACY.md) and stop
reading here.

Anything else is new work, built from its page -
[Page First](../../../docs/governance/page-first.md). There is no spec
delta, tech design, task list or acceptance:

1. **Read it fresh** - a fresh sub-agent reads the 🚧 sections alone with
   the `page-cases` questions. Answers the page gives become tests; gaps
   become ❓ lines; cases no example walks go to its cases file.
2. **Settle** - a question that changes scope goes to the person in the
   Clarification Request format of `AGENTS.md`; the rest stay ❓.
3. **Id the rules** - every rule a test proves ends in `{#id}`;
   `pnpm pages:check`.
4. **Build** - `page-build`: tests titled `<page>#<id>`, then code. A
   mechanism a later reader needs goes to the application's
   `docs/architecture/`, linked from `Code map`.
