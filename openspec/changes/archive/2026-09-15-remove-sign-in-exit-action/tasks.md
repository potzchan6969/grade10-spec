# Tasks — remove-sign-in-exit-action

## 1. Shared UI (grade10-spec)

- [x] 1.1 Drop `exitAction` from `SignInCard` and the ghost button it drew, and take `SignInCardAction` off the public entry and its export contract test — satisfies *The dialog offers no exit beside dismissal* (`shared-ui-auth-sign-in-SC-09`)
- [x] 1.2 Retire the story that exercised the exit, and the `exitAction` arg on the legal-order story, so the block's stories render only what a consumer can reach
- [x] 1.3 Verify: `pnpm run typecheck`, `pnpm run lint`, and the `auth-sign-in` suites under `pnpm --filter @grade10/ui run test:stories`

## 2. Sign-in frontend (grade10)

Independent of group 1: the prop is optional on the pinned `@grade10/ui`, so
this compiles before and after that group lands.

- [x] 2.1 Stop building an exit action in `SignInFlow` — its `onExit` handler and the `exitLabel` word go with the prop they fed, and the flow test loses the case that passed a handler nothing else passes — satisfies *The dialog offers no exit beside dismissal* (`shared-ui-auth-sign-in-SC-09`)
- [x] 2.2 Verify: `pnpm run typecheck` and the sign-in frontend suites

## 3. Submodule bump (grade10) (owner: @sean)

Lands after group 1 merges to the store's `main`.

- [x] 3.1 Move the `external/grade10-spec` pin onto the merged store SHA, so the application builds against an export set without `SignInCardAction`
- [x] 3.2 Verify: `pnpm run typecheck` and `pnpm run lint`
