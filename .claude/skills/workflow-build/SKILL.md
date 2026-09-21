---
name: workflow-build
description: Run a round on one task group - its tests in their own commit, then its code, then its readers, then the landing summary - and land the group's row before the tick. Use when implementing a group of a change whose tasks.md is on main. Invoke as /workflow-build <change> <group>.
---

# A Task Group's Round

**The artifact:** one task group of `tasks.md`, and the code and tests it
names. One round per group.

**The rules:** `openspec-apply-change` - what to read before editing, where a
product detail goes, and the checks each kind of work owes - plus
[`docs/governance/system-design.md`](../../../docs/governance/system-design.md),
which the group's readers hold the code to.

Then follow `workflow-round`: it holds the six steps, the readers, the questions, the
landing and the re-read. The group's readers come from the schema's `apply`
block rather than an artifact's.

## The Order Inside a Group

1. **The tests** — the tests the group's scenario ids name, in their own
   commit, carrying no code for the group. They fail
2. **The code** — one task at a time, with the checks each one owes
3. **The readers** — the group's perspectives read the landing, and their
   findings are verified
4. **The summary** — one reply in the thread naming the perspectives that read
   the group and, per scenario id, the tests that landed
5. **The row, then the tick** — the group's `rounds.md` row lands with the
   landing, `pnpm run plan:land <change> <group> --perspectives <a,b> --stood
   "<what stood>" --tests "<sc>: <files>"`, one `--tests` entry per scenario
   id the group's tasks cite (the landing refuses a group that leaves one out,
   and names it), before its tasks are ticked through `pnpm plan done`. `pnpm plan done` refuses a tick whose task names a
   scenario id no test in the group's tree cites, and takes a tick whose task
   names none

## In the Application Repository

Code lands in `grade10`, and the round is still this one. That session reaches
this store through `/add-dir` on a clone of it and reads the `workflow-round` skill, the
schema's perspectives and the reader definitions under `.claude/agents/` from
there - never from the submodule directory pinned to an older sha, because a
round read from a pin is a round held to last month's rules. The group's row
lands on this store's `main` through `plan:land`, run against the store clone;
the ticks that follow go through `pnpm plan done`.

## Never

- **Never weaken a test** — no skip, no relaxed assertion, no deleted case; a
  finding that asks for one is not carried
- **Never edit the durable specs** — `openspec/specs/` moves at the fold, and
  the fold is the archive's
- **Never invent a product policy** — a product detail lands on the page as a
  ❓ line, and the group stops for it
