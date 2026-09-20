# Tasks

Depends on `stage-changes-and-notify-hands` for the page this change marks and the messages that point at it. Each group's tests land in their own commit before the group's code, so the test task is written first and its box is ticked last, once the code it names is pushed. Group 4 is Operations', and nothing in groups 2 and 3 is visible to anybody until it lands. Group 5 is the walk of the banner groups 2 and 3 build, and runs after them.

## 1. The relay holds `main`'s head (grade10-spec)

- [ ] 1.1 Tests: `tools/relay/test/github-events.test.ts` for the signature, the branch and repository filter and a body that is not a push; `tools/relay/test/live.test.ts` for the stored record, one broadcast per new sha, no broadcast on the same sha, and a socket sent the head on accept; `worker.test.ts` for the two GET routes and the eighth secret's refusal - `shared-planning-change-stages-SC-72`, `shared-planning-change-stages-SC-75`
- [ ] 1.2 `GITHUB_WEBHOOK_SECRET` in `Env` and in `REQUIRED_SECRETS`, so a relay deployed without it answers 500 and names it - `shared-planning-change-stages-SC-75`
- [ ] 1.3 `POST /github/events`: the raw body read once, `x-hub-signature-256` verified against the secret with `hmacSha256` and `equalBytes`, 401 on a bad signature, and only `refs/heads/main` of `REPO` carried on - `shared-planning-change-stages-SC-72`
- [ ] 1.4 The `Live` Durable Object: binding `LIVE`, migration `v2` with `new_sqlite_classes: ["Live"]`, addressed `idFromName("main")`, storing `{ main, at, subject }` from `after`, `head_commit.timestamp` and the first line of `head_commit.message`, and broadcasting only when the sha changes - `shared-planning-change-stages-SC-72`
- [ ] 1.5 `GET /live` upgrading through `ctx.acceptWebSocket` and sending the stored record on accept, `GET /head` answering it with `access-control-allow-origin: *`, and the router's method gate carrying both - `shared-planning-change-stages-SC-72`, `shared-planning-change-stages-SC-75`
- [ ] 1.6 `tools/relay/README.md` Deploying names the eighth secret, migration `v2` and the webhook step; `docs/references/agent-runner.md` gains the webhook row and the secret row
- [ ] 1.7 Verify: `pnpm --dir tools/relay test && pnpm --dir tools/relay typecheck`

## 2. The banner on the hosted manual (grade10-spec)

- [ ] 2.1 Tests: `tools/manual/test/main-moved.test.tsx` over the banner's states with the head and `/api/head` stubbed - behind with the subject and the age, caught up, a focused text field holding the refresh, and no relay - and a snapshot-build test that `dist/api/live` carries what the environment gave and `dist/api/head` the snapshot's own head - `shared-planning-change-stages-SC-72`, `shared-planning-change-stages-SC-75`
- [ ] 2.2 `GET /api/live` and `GET /api/head` in `storeEndpoints`, and `build-snapshot.mts` writing `dist/api/live` from `RELAY_URL` - `{}` when it is unset - and `dist/api/head` from `snapshot.storeHead` - `shared-planning-change-stages-SC-75`
- [ ] 2.3 `useMainHead()` in `tools/manual/src/api/head.ts`: `/api/live` read once, `wss://<relay>/live` opened where there is a relay, and `GET /head` polled every 60 s where the socket cannot be held - `shared-planning-change-stages-SC-72`
- [ ] 2.4 `MainMoved` in `tools/manual/src/shell/main-moved.tsx`, mounted in the shell above the page heading: the notice while the head is not the snapshot's, naming the subject and how long ago, with Refresh now; one notice on the latest commit however many land; `GET /api/head` polled every 30 s while behind and the snapshot provider's reload called when it changes, never `location.reload()`, and held while a text field has focus - `shared-planning-change-stages-SC-72`
- [ ] 2.5 Verify: `pnpm --dir tools/manual test && pnpm run typecheck && pnpm run lint`

## 3. The banner on the locally run manual (grade10-spec)

- [ ] 3.1 Tests: `tools/manual/test/upstream-endpoint.test.ts` over `test/git-store.ts` with a bare remote - the two counts, the dirty tree, the 60 s throttle, a checkout with no remote, the fast-forward, and each 409 - and the local rows of `main-moved.test.tsx` - `shared-planning-change-stages-SC-73`, `shared-planning-change-stages-SC-74`
- [ ] 3.2 `GET /api/upstream`: `git fetch origin main` at most once every 60 s, then `git rev-list --left-right --count HEAD...origin/main` and `git status --porcelain`, answering `{ behind, ahead, dirty, fetchedAt }`, and `{ dirty }` alone where there is no remote - `shared-planning-change-stages-SC-73`
- [ ] 3.3 `POST /api/pull`: `git pull --ff-only origin main` behind the confinement `/api/propose` already runs under, answering 409 `{ reason }` on a dirty tree, on a checkout ahead, and on a fast-forward git itself refuses, with the checkout left as it was - `shared-planning-change-stages-SC-74`
- [ ] 3.4 The banner's local variant in `MainMoved`: the commits-behind count and Pull, the refusal's one line in the button's place, and nothing at all where there is no count - `shared-planning-change-stages-SC-73`, `shared-planning-change-stages-SC-74`
- [ ] 3.5 Verify: `pnpm --dir tools/manual test && pnpm run typecheck && pnpm run lint`

## 4. The deploy (grade10-spec)

Held since 2026-09-20 on Operations for the webhook, the secret and `RELAY_URL`; 4.5 lands on its own, and the hosted banner shows nothing until all three are in.

- [ ] 4.1 Tests: `scripts/openspec/openspec-version.test.mjs`, which already reads `.github/workflows/manual.yml`, gains the two assertions - the build step passes `RELAY_URL`, and the workflow carries no `paths:` filter
- [ ] 4.2 The push webhook on the repository, delivering `push` to `<relay origin>/github/events` with the shared secret (Operations)
- [ ] 4.3 `GITHUB_WEBHOOK_SECRET` put on the relay, and the relay redeployed so migration `v2` runs (Operations)
- [ ] 4.4 `RELAY_URL` on the repository variables, holding the relay's own origin (Operations)
- [ ] 4.5 `manual.yml` passes `RELAY_URL: ${{ vars.RELAY_URL }}` to the build step and drops its `paths:` filter, so every push to `main` rebuilds the site the banner promises will catch up
- [ ] 4.6 Verify: `curl "$RELAY_URL/head"` after the next push to `main` answers the sha `main` is on, and a page left open across a push shows the banner and then what landed

## 5. The walk (grade10-spec)

- [ ] 5.1 `tools/manual/walk/main-moved.walk.ts`: the banner driven off a stubbed `/api/live` and `/api/head` as the other walks drive the fixture snapshot - behind with the subject, then the page taken through one refresh, then no banner - `shared-planning-change-stages-SC-72`
- [ ] 5.2 Flip the cases the walk decides with `pnpm run tcs:automated`, in the walk's own commit, and say in the suite which stay manual: everything that needs a push to `main`, a deploy, or a checkout with a remote
- [ ] 5.3 The two 🚧 lines under Surfaces on `docs/prds/products/shared/planning/change-stages.md` stand while the groups land, and the fold takes them off
- [ ] 5.4 Verify: `pnpm --dir tools/manual run test:walk && pnpm run tcs:validate && pnpm check:manual`
