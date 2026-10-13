---
name: workflow-plan
description: Run a round on the product manager's three artifacts of a change - proposal.md, decisions.md and the journeys - and open the change where there is none. Use when a product manager or a designer says what is wanted, in the planning channel or a terminal. Invoke as /workflow-plan <what is wanted>, or /workflow-plan <change>.
---

# The Product Manager's Round

- **Scope** - Accept a requested outcome or existing change id. Draft `proposal.md`, `decisions.md` and `specs/<capability>/user-journeys.md`, in that order.
- **Artifact Rules** - Use [planning-pm](../planning-pm/SKILL.md) for the interview, PRD marks, artifact contents and delivery-planning handoff. The [Interview](../../../docs/governance/round-summary.md#interview) owns the questions.
- **Round** - Follow `workflow-round` ([skill](../workflow-round/SKILL.md)) once per artifact for readers, questions, summary and landing. Read each artifact's enriched instructions as you reach it:

```bash
openspec instructions proposal --change <change>
```

```bash
openspec instructions decisions --change <change>
```

```bash
openspec instructions user-journeys --change <change>
```

## Opening a Change From One Sentence

- **Input** - A planning-channel sentence naming no change comes from the first of `.round/relay.json`'s `messages`; a terminal sentence is the argument. A message naming an existing change uses its thread and opens nothing.
- **Overlap** - Read active changes before opening one. A change whose proposal links the page sections the sentence would mark overlaps it too. The manual's stage comes from [stageOf](../../../tools/manual/src/api/stages.ts). Read archive only for the last table row. Where a change overlaps, answer in that change's thread and use its stage and asker below.
- **Active Changes** - List the changes:

```bash
pnpm run plan:preflight
```

- **Capability Deltas** - Identify the change carrying the capability's delta:

```bash
pnpm run spec:id <capability>
```

| The change in flight is | The run does |
| --- | --- |
| Proposed or Designed, and the sentence is its product manager's | Extends it: the sentence is a remark on its proposal, the chain is redrawn, and the reply names the change - decided by the round |
| Proposed or Designed, and the sentence is another hand's | Writes a held row on its product manager: extend, recommended |
| Specified, Planned or Accepted | Writes a held row on its product manager: extend where the moved part is smaller than a task group of work, split otherwise |
| Building | Writes a held row on its product manager: split, recommended; supersede where the sentence contradicts what is built |
| Implementation complete or Archived | Opens a change, `depends_on:` naming it |


Where no change overlaps, or the table opens a new one:

1. **Id** - Derive it from the sentence with `slugOf` in [propose.ts](../../../tools/manual/src/editor/propose.ts).
2. **Record** - Create it with the repository schema; add `depends_on: <change>` where the table requires it.

   ```bash
   pnpm openspec new change <id> --schema grade10-planning
   ```

   From a wake, bind the thread immediately after creation:

   ```bash
   node scripts/openspec/relay-post.mjs --bind <change>
   ```

3. **Hand** - Set `hands: pm: @<handle>` from `docs/prds/team.yaml`. If the asker is absent from the map, leave the PM unnamed and request their handle in the reply.
4. **Branch** - Create and push `claude/<id>`, the round workflow's branch convention.
5. **Reply** - Name the change id in the originating thread. Use workflow-round's thread-recording procedure.

## The Whole Plan in One Wake

- **Draft Chain** - Draft the three artifacts in the order the schema gives them, landed nowhere; workflow-round owns the draft-ahead procedure.
- **Completion** - Return the three drafts and round outcome. Hand the settled artifacts to planning-dev as planning-pm directs; if requirements cannot start, record `awaiting: specs:` with the missing input.
