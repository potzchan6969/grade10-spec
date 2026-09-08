## 1. Vocabulary descriptions and the derived view (grade10) (owner: @rita-liu)

- [ ] 1.1 Permission descriptions in `@grade10/auth-contracts` + census (`grade10-admin-console-roles-and-permissions-SC-08`, `SC-09`).
- [ ] 1.2 Generate committed roles/permissions JSON (`SC-12`).
- [ ] 1.3 Drift test in `test:backend` (`SC-11`).
- [ ] 1.4 Verify: typecheck, lint, `test:backend`, test.

## 2. UserTable role chip links (grade10) (owner: @rita-liu)

- [ ] 2.1 Optional `roleHrefs` (`shared-console-user-directory-SC-11`, `SC-13`).
- [ ] 2.2 CTAs unchanged (`SC-12`).
- [ ] 2.3 Verify: typecheck, lint, frontend-console tests.

## 3. Roles & Permissions surface (grade10) (owner: @rita-liu)

Needs group 1; group 2 before chip wiring in 3.4.

- [ ] 3.1 Section under Users; `user:set-role` gate (`SC-01`, `SC-02`).
- [ ] 3.2 Roles matrix + elevated marks; read-only; stacking note (`SC-03`–`SC-07`, `SC-13`).
- [ ] 3.3 Permissions tab (`SC-08`, `SC-09`).
- [ ] 3.4 `?role=` highlight; Users `roleHrefs` with `user:set-role` (`SC-10`; user-directory `SC-11`–`SC-13`).
- [ ] 3.5 Verify: typecheck, lint, test, admin build, `check:frontend-layers`.

## 4. Manual and archive (grade10-spec) (owner: @rita-liu)

- [ ] 4.1 Manual page under `docs/prds/products/grade10-admin/console/`; link from console index; note chips on user-directory page. `pnpm check:manual`.
- [ ] 4.2 Archive: fold page + user-directory deltas; copy feature sets + journeys; `::journeys` / `::cases`. `pnpm run archive:preflight`.
