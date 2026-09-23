## 1. Shared copy and Storybook (grade10-spec)

- [x] 1.1 Add the `signIn.settledElsewhere` catalog key to every `shared/`
      locale and the `Settled elsewhere` Storybook story with its
      interaction test (`shared-auth-sign-in-SC-70` through `SC-77`)
- [x] 1.2 Write `ui-design.md` for the change, closing every `## States` row
      against the landed scenarios
- [x] 1.3 Mark `docs/prds/products/shared/auth/sign-in.md` with the 🚧 line
      and the Product decisions row
- [x] 1.4 Verify: `pnpm run test` (packages/i18n, 43/43), `tsc --noEmit` on
      `@grade10/ui`, `biome check` on the touched files, `openspec validate
      --strict`, `pnpm run check:manual` — landed on PR #594; merge before
      starting Group 3 or 4

## 2. Shared contracts (grade10) (owner: @sean)

- [x] 2.1 Add the poll response type (`{ settled: boolean }`) and the
      optional `watchId` field on the magic-link send response to
      `packages/grade10-auth/contracts` — the wire shapes `SC-70` and
      `SC-79` need
- [x] 2.2 Verify: `pnpm run typecheck`

## 3. Backend and API (grade10) (owner: @sean)

- [x] 3.1 Write the backend tests this group makes pass, in their own
      commit before its code: a send returns a `watchId` that resolves to
      `settled: true` only once that address's session is created by any
      method (`shared-auth-sign-in-SC-70`, `SC-71`), stays `false` for a
      different address (`SC-73`) and for a failed attempt on the token
      itself (`SC-74`), is never answerable from a bare email (`SC-79`), and
      leaves the magic-link verification row untouched (`SC-78`)
- [x] 3.2 Mint and return `watchId` from `sendMagicLink`'s callback in
      `createAuth.ts`, writing `sign-in-watch:{watchId}` to Cloudflare KV via
      `secondaryStorage` (`SC-70`, `SC-71`)
- [x] 3.3 Add the session-creation hook in `securityHooks.ts` that writes
      `sign-in-settled:{sha256(email)}` for any sign-in method (`SC-71`,
      `SC-73`)
- [x] 3.4 Add `GET /sign-in/magic-link/watch/{watchId}`, resolving through
      both KV entries per `tech-design.md`'s Decisions (`SC-74`, `SC-78`,
      `SC-79`)
- [x] 3.5 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 4. Frontend (grade10) (owner: @sean)

- [x] 4.1 Write the frontend tests this group makes pass, in their own
      commit before its code: the Check Your Email step unmounts and the
      settled-elsewhere toast fires once polling reports settled, with no
      session read or request (`SC-70`, `SC-71`, `SC-72`), every surface
      waiting on the address ends its wait independently (`SC-75`), a
      backgrounded surface catches up on foreground (`SC-76`), the settle is
      independent of the resend countdown's state (`SC-77`), and a
      different address or a failed attempt elsewhere changes nothing
      (`SC-73`, `SC-74`)
- [x] 4.2 Capture `watchId` from the send/resend response in the sign-in
      flow's state alongside its existing `sent: {email, at}`
- [x] 4.3 Add the poll effect (interval, plus once immediately on
      `visibilitychange`) and the settle handler (unmount the step, fire
      `toast.info(signIn.settledElsewhere)`) — stop polling on dismissal or
      once the link's own lifetime has elapsed
- [x] 4.4 Verify: `pnpm run typecheck`, `pnpm run test`, `pnpm run lint`

## 5. The walk (grade10) (owner: @sean)

Needs `feature-tcs.md` reviewed (`/tcs-review sync-sign-in-link-across-devices`) as its input.

- [x] 5.1 Walk `shared-auth-sign-in-US-10` end to end through the sign-in
      dialog on two browser contexts for one address, kept as the change's
      end-to-end suite
- [ ] 5.2 Flip the cases the walk decides to automated with `pnpm run
      tcs:automated <case…> --decided-by <walk path>`, in the walk's own
      commit; name the ones that stay manual in the suite and in the walk's
      `rounds.md` row
- [x] 5.3 Verify: the e2e suite run named in `docs/architecture/e2e.md`

## 6. Fix: settle through Postgres, not KV (grade10) (owner: @sean)

- [ ] 6.1 Write the backend tests this group makes pass, in their own commit
      before its code: `settled: true` is answered from the Postgres row
      alone, with the KV settle row absent (`shared-auth-sign-in-SC-71`),
      and a watch minted before the Postgres row existed still settles
      through the KV row (`SC-71`)
- [ ] 6.2 Widen `secondaryStorage.ts`'s Postgres routing from the single
      `POSTGRES_KEY_PREFIX` to a small set of prefixes, adding
      `sign-in-settled-fast:` alongside `verification:` without merging their
      scans
- [ ] 6.3 In the settle-marking hook (`securityHooks.ts`), write
      `sign-in-settled-fast:{hash}` to Postgres alongside the existing
      `sign-in-settled:{hash}` KV write, on every sign-in
- [ ] 6.4 In `resolveSignInWatch`, check `sign-in-settled-fast:{hash}` first,
      falling back to the existing `sign-in-settled:{hash}` KV check
- [ ] 6.5 Verify: `pnpm run typecheck`, `pnpm run test:backend`
