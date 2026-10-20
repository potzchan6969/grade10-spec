# Task Planning Route (Legacy OpenSpec)

For an OpenSpec change opened before Page First. New work follows [SKILL.md](SKILL.md).

- **Route** - `/workflow-tasks <change>` routes to [planning-dev](../planning-dev/LEGACY.md). Pass the change and any task-planning input to its integrated planning run.
- **Task Contract** - Read the repository's enriched task instructions below. The template is the example; `scripts/openspec/tasks-template.test.mjs` holds the contract.

```bash
openspec instructions tasks --change <change>
```

- **Completion** - Return that run's accepted and published plan, including `tasks.md`, or its unresolved questions and blockers. Do not start a separate task-planning round.
