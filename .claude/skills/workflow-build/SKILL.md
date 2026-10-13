---
name: workflow-build
description: Run a round on one task group - its tests in their own commit, then its code, then its readers, then the landing summary - and land the group's row before the tick. Use when implementing a group of a change whose tasks.md is on main. Invoke as /workflow-build <change> <group>.
---

# A Task Group's Round

**The artifact:** one task group of `tasks.md`, and the code and tests it
names. One round per group.

- **Baseline** - Read the acceptance record and snapshot, proposal, designs,
  tasks, current durable contract and PRD. Before the first task, record the
  claim baseline and target scope:

  ```bash
  pnpm plan claim <change> <group>
  ```

- **Contract** - Implement against the rolling durable contract. Put changed
  product outcomes on the PRD first, then update the contract through a change;
  keep implementation mechanisms in the technical design. Follow
  [PRD maintenance](../../../docs/governance/prd-and-openspec.md#maintenance-workflow-for-future-agents).
- **Shared UI** - Use `design-system-primitives` for primitives. Shared blocks
  live in `packages/ui`; app state and wiring stay in the consuming app. Apply
  [package validation](../../../AGENTS.md#validation) and
  [system design](../../../docs/governance/system-design.md).
  Verify shared block changes with their stories:

  ```bash
  pnpm run test:stories:ui
  ```

- **Closeout** - Keep unaffected groups moving when the durable contract is
  refined. Follow [verified closeout](../../../docs/governance/prd-and-openspec.md#7-finish-a-change-without-losing-context)
  for implementation evidence, compatibility acknowledgement and archive.

Then follow `workflow-round`, and [Round Summary and
Landing](../../../docs/governance/round-summary.md) for what a round owes its
hand. The group's readers are the schema's `apply` block's.

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
   and names it), before its tasks are ticked through `pnpm plan done`. `pnpm plan done` refuses a tick of a group whose row
   has not landed

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
- **Never edit the durable specs** — `openspec/specs/` changes through accepted deltas;
  archive does not fold it again
- **Never restyle [the agreed look](../../../AGENTS.md#design-override)**
- **Never invent a product policy** — a product detail lands on the page as a
  ❓ line, and the group stops for it
