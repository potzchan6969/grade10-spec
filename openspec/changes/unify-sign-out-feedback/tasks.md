## 1. Session command in the auth frontend package (owner: @sean)

- [ ] 1.1 Make "The control is busy while sign-out runs", "A refused sign-out is reported", and "A retry clears the failure" pass at the package seam — the shared sign-out command in `@grade10/auth-frontend` (new `/sign-out` subpath), with the session client port and its fixture carrying the sign-out call

Verify: `pnpm run typecheck`, auth-frontend package tests, `pnpm run check:handbook` (the package surface changes).

## 2. Every surface adopts the command

Depends on group 1.

- [ ] 2.1 Make "An operator signs out of an admin panel" and "A refused sign-out is reported" pass across both admin panels — settings, users, store, and no-access surfaces drop their inline handlers for the shared command and show the inline failure state
- [ ] 2.2 Make "A collector signs out of the grade10 site" and "A retry clears the failure" pass on the grade10 site and the zzz storefront — profile surfaces adopt the command, keeping surface-owned after-effects (marketing-page return, cart clearing) on the confirmed outcome

Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`.
