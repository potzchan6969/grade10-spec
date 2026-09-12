---
name: openspec-archive-change
description: Finalize a completed OpenSpec change and preserve its decision history.
---

# Archive an OpenSpec change

1. Read `tasks.md` and confirm every required task is complete; call out any intentional exception. `pnpm run archive:preflight <change>` prints what still refuses the archive.
2. Record the deploy: `pnpm plan shipped <change>` in the application repository. It finds the deploy run that contains every merge commit of the change, runs this store's preflight with that sha, and commits `deployed_at` and `deployed_env` into the change's `.openspec.yaml`. A change whose task groups are all tagged `(grade10-spec)` deploys nothing and needs no record. On an owner's explicit say-so the waiver is written here by hand instead — `pnpm run archive:preflight <change> --deploy-waived "<who, why>"`, with `--tasks-waived "<who, why>"` where tasks are still unchecked. The preflight refuses either way while the change's `## Feature set` and its `user-journeys.md` are not carried across to the durable capability — the fold keeps `## Requirements` only. Carry an approved `feature-tcs.md` across to the capability beside its spec, and a `domain-tcs.md` into the domain directory, by hand as well: the preflight does not check the suites.
3. Fold accepted delta requirements from `openspec/changes/<change>/specs/` into `openspec/specs/`, then re-read the capability spec and confirm it describes the shipped behavior. It is the only record consuming applications build from.
4. Run `openspec validate --specs`.
5. Take the 🚧 marks off every line on the capability's page in `docs/prds/` that this change delivered — the line stays, flat — in the same commit as the fold, and run `pnpm check:manual`: it fails a 🚧 line no in-flight change delivers, and warns on every page the fold left older than its spec — read each against what moved and clear it with the edit it needs, or with `reviewed: <date>` in its frontmatter when it already reads right. Leave requirements out of it.
6. Move the change to `openspec/changes/archive/YYYY-MM-DD-<change-name>/` without dropping its proposal, design, or task history.
7. Summarize the archived path, the durable specs updated, the deploy evidence recorded, and any follow-up work.
