## 1. Email step gates cross-command (this repo) (owner: @sean)

- [ ] 1.1 Make "One sign-in email per intent", "Only the running command looks busy", and "A settled request frees the step" pass in `SignInEmailForm` — both controls disabled while either flag is set, `loading` staying per-command, stories updated to show the gated states

Verify: `pnpm run test:stories:ui`, `pnpm run typecheck`, `pnpm run lint`.

## 2. Sign-in commands guard themselves (grade10 repo)

Independent of group 1; "One sign-in email per intent" needs group 1 landed
and the `external/grade10-spec` submodule bumped before it holds end to end.

- [ ] 2.1 Make "Activating again during flight does nothing" pass at the package seam — the shared command helper in `@grade10/auth-frontend` keeps an in-flight ref, matching its sign-out command; exercised through the fixture client for send-link, send-code, and verify
- [ ] 2.2 Bump `external/grade10-spec` past group 1 so the gated email step ships, and verify the flow against it

Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`.
