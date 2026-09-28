## 1. The check, its hooks and the report (grade10-spec)

- [ ] 1.1 Tests in `scripts/design-override/`, run by a `test:design-override` script chained into `test`, each case a throwaway repository, in their own commit before the check (`shared-design-sync-design-override-SC-02` to `SC-16`, `SC-24` to `SC-26`, `SC-28` to `SC-36`, `SC-40` to `SC-47`, `SC-49`), with #667, #185, #547 and `c865b8565` rebuilt as minimal commits
- [ ] 1.2 The look rule and the stop it prints, over the engine's watched paths, making `shared-design-sync-design-override-SC-02` to `SC-12` and `SC-46` pass
- [ ] 1.3 The merge rule, making `shared-design-sync-design-override-SC-13` to `SC-16` and `SC-47` pass
- [ ] 1.4 The `Design-Override:` trailer, the designer's exemption read from `docs/prds/team.yaml`, and the refusal when either cannot be read, making `shared-design-sync-design-override-SC-24` to `SC-26`, `SC-28` to `SC-31` and `SC-49` pass
- [ ] 1.5 The commit and push modes, `.githooks/commit-msg` and `.githooks/pre-push`, and `prepare` setting the hooks path outside CI, making `shared-design-sync-design-override-SC-32` to `SC-36` pass
- [ ] 1.6 `report.mjs` and the workflow on push to `main`, making `shared-design-sync-design-override-SC-40` to `SC-45` pass
- [ ] 1.7 The `Design Override` heading in `AGENTS.md`, linked from the `workflow-build` and `fix-bug` skills; the Design Override page's marks kept to what lands
- [ ] 1.8 Verify: `pnpm run test`, `pnpm run lint`, `pnpm run agent:check-parity`, `pnpm check:manual`, `pnpm run validate:changes guard-agreed-ui-design`

## 2. The application's hooks and block check (grade10)

Needs group 1 on the store's `main`: its first commit bumps `external/grade10-spec` to it.

- [ ] 2.1 Tests in `scripts/checks/test/` for the block check and the application's hooks, in their own commit after the bump and before the code (`shared-design-sync-design-override-SC-17` to `SC-23`, `SC-37` to `SC-39`, `SC-48`)
- [ ] 2.2 `scripts/checks/check-store-blocks.mjs`, with today's rebuilt pages listed with their reasons, run by `check:libs` and with `--rev <tree-ish>`, making `shared-design-sync-design-override-SC-18` to `SC-23` and `SC-48` pass
- [ ] 2.3 `design-override.config.json` listing the `sites`; `.githooks/commit-msg` and `.githooks/pre-push` running the store's check from `external/grade10-spec` and the block check; `prepare` setting the hooks path in the application and in `external/grade10-spec` outside CI; and the report workflow on push to `main`, checking out with `fetch-depth: 0` and `submodules: true`, making `shared-design-sync-design-override-SC-17` and `SC-37` to `SC-39` pass
- [ ] 2.4 The `Design Override` heading in `AGENTS.md`, linked from the `frontend-structure` and `fix-bug` skills
- [ ] 2.5 Verify: `pnpm run check:libs`, `pnpm run lint`, `bash scripts/agent-platform/check-parity.sh`

## 3. The walk (grade10)

Needs `feature-tcs.md` reviewed (`/tcs-review guard-agreed-ui-design`) as its input, and groups 1 and 2 landed.

- [ ] 3.1 One walk of `shared-design-sync-design-override-US1` through git in a terminal: throwaway copies of the store and the application, hooks set by their own `prepare`, every row of the suite's cases committed and pushed to a local remote, kept as the change's end-to-end suite
- [ ] 3.2 Flip the cases the walk decides with `pnpm run tcs:automated <case…> --decided-by <walk path>`, in the walk's own commit; the agent waiting for its person and the comments on GitHub stay manual, named in the suite and in the walk's `rounds.md` row
- [ ] 3.3 Verify: the walk passes, `pnpm run tcs:validate` in the store
