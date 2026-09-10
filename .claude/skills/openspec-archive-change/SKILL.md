---
name: openspec-archive-change
description: Finalize a completed OpenSpec change and preserve its decision history.
---

# Archive an OpenSpec change

1. Read `tasks.md` and confirm every required task is complete; call out any intentional exception.
2. Run the gate: `pnpm run archive:preflight <change> --deployed-at <sha>` (or `--deploy-waived "<who, why>"` on an owner's explicit say-so). It refuses while the change's `## Feature set` and its `user-journeys.md` are not carried across to the durable capability — the fold keeps `## Requirements` only — and it prints the `Deployed-at:` / `Deploy-waived:` line the archive commit message must carry.
3. Fold accepted delta requirements from `openspec/changes/<change>/specs/` into `openspec/specs/`, then re-read the capability spec and confirm it describes the shipped behavior. It is the only record consuming applications build from.
4. Run `openspec validate --specs`.
5. Take the 🚧 marks off every line on the capability's page in `docs/prds/` that this change delivered — the line stays, flat — in the same commit as the fold, and run `pnpm check:manual`: it fails a 🚧 line no in-flight change delivers, and warns on every page the fold left older than its spec — read each against what moved and clear it with the edit it needs, or with `reviewed: <date>` in its frontmatter when it already reads right. Leave requirements out of it.
6. Move the change to `openspec/changes/archive/YYYY-MM-DD-<change-name>/` without dropping its proposal, design, or task history.
7. Summarize the archived path, the durable specs updated, the deploy evidence recorded, and any follow-up work.
