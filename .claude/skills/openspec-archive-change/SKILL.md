---
name: openspec-archive-change
description: Finalize a completed OpenSpec change and preserve its decision history.
---

# Archive an OpenSpec change

1. Confirm every required task is checked off on this store's `main`, where `pnpm plan` records checkmarks; call out any intentional exception. `pnpm run archive:preflight <change>` reads them there and prints what still refuses the archive.
2. Record the deploy: `pnpm plan shipped <change>` in the application repository. It finds the deploy run that contains every merge commit of the change, runs this store's preflight with that sha, and commits `deployed_at` and `deployed_env` into the change's `.openspec.yaml` — `pnpm plan shipped <change> --build <tag>` names the build QA walked, `deployed_build`, beside them, and `archive:preflight`'s own `--deployed-build <tag>` writes it by hand, refused without `--deployed-at` the way `--deployed-env` is. A change whose task groups are all tagged `(grade10-spec)` deploys nothing and needs no record. On an owner's explicit say-so the waiver is written here by hand instead — `pnpm run archive:preflight <change> --deploy-waived "<who, why>"`, with `--tasks-waived "<who, why>"` where tasks are still unchecked. The preflight refuses either way while the change's `## Feature set` and its `user-journeys.md` are not carried across to the durable capability — the fold keeps `## Requirements` only. Carry the change's `feature-tcs.md` across to the capability beside its spec, a `domain-tcs.md` into the domain directory and a `product-tcs.md` into the product's, by hand as well, every case whole, in whatever status the file holds. The preflight refuses a suite that leaves a case behind, or lands one under another `<v>` or status.
3. Fold accepted delta requirements from `openspec/changes/<change>/specs/` into `openspec/specs/`, then re-read the capability spec and confirm it describes the shipped behavior. It is the only record consuming applications build from.
4. Run `openspec validate --specs` and `pnpm run trace -- validate`. Before
   archive, `archive:preflight` runs `pnpm run trace -- fold --change <id>`
   where a carried feature suite has trace markers. It accepts the exact
   active-to-durable case handover; after archive, normal validation is strict
   against the durable graph.
5. Move what outlives the change from `decisions.md` onto the capability's PRD, in its `Product decisions` block — the option each row dropped, where the reason still binds. That file is folded nowhere and archives with the change, and the blind suite pass may not read `openspec/changes/archive/`, so a rejection left there alone is invisible to the pass most likely to raise it again. `archive:preflight` asks for `--decisions-carried "<what went where>"`, or `none` where nothing outlived it.
6. Take the 🚧 marks off every line on the capability's PRD in `docs/prds/` that this change delivered — the line stays, flat — in the same commit as the fold, and run `pnpm check:manual`: it fails a 🚧 line no in-flight change delivers, and warns on every page the fold left older than its spec — read each against what moved and clear it with the edit it needs, or with `reviewed: <date>` in its frontmatter when it already reads right. Leave requirements out of it.
7. Move the change to `openspec/changes/archive/YYYY-MM-DD-<change-name>/` without dropping its proposal, design, task history or `rounds.md` — the rounds are folded into no capability and archive with the change, and `archive:preflight` refuses a copy that left the file behind.
8. Summarize the archived path, the durable specs updated, the deploy evidence recorded, and any follow-up work.
