## 1. Product pages and platform records (grade10-spec)

- [ ] 1.3 Update `docs/prds/platform/admin-access.md`: the elevated ladder reads the console's own session, and a site session never passes it; the recent sign-in and second factor are the console session's
- [ ] 1.4 Update `docs/prds/platform/multi-product.md` and `docs/prds/platform/e2e.md`: one session cookie scope per brand holds two cookie names, one for the site and one for the console, and the isolated stack's shared jar tells them apart by name
- [ ] 1.5 Verify: `pnpm check:manual`

## 2. Surface registry and contracts (grade10)

Lands first. Groups 3 to 6 depend on it, not on each other.

- [ ] 2.1 Tests for the registry, in their own commit: the surface of an origin over production, staging, flat staging-2 and uat hosts, the isolated stack's console origin, an absent or unknown origin, and the cookie prefix of each surface
- [ ] 2.2 Add `surface.ts` to `@grade10/auth-contracts`: the `Surface` type, each surface's cookie prefix with the site's unchanged, and the origin test over `runningAdminUrl`
- [ ] 2.3 Add `surface` to the listed-session shape and say in `GetSessionOptions` that `elevation` reads the console's session
- [ ] 2.4 Delete `sessionCoversHost` and its test, which state the brand-wide rule
- [ ] 2.5 Verify: `pnpm run typecheck && pnpm run lint && node scripts/test.mjs auth-contracts`

## 3. The auth worker keeps two sessions (grade10)

Needs group 2 landed.

- [ ] 3.1 Tests in their own commit, in one shared suite both brands run (`apps/backend/grade10/auth/test/db/surfaces.spec.ts`, `apps/backend/zzz/auth/test/db/surfaces.spec.ts`), with `useAuthFixture().login` taking a surface: sessions on each surface are independent, a site sign-in leaves the console signed out and the reverse, both held as different accounts, and each runs out alone; a tab of one surface does not follow the other's session, a console tab follows its own, and a site sign-in covers the site's other pages (`shared-auth-session-SC-39`, `shared-auth-session-SC-40`, `shared-auth-session-SC-41`, `shared-auth-session-SC-27`, `shared-auth-session-SC-28`, `shared-auth-session-SC-29`, `shared-auth-session-SC-30`, `shared-auth-session-SC-31`, `shared-auth-session-SC-32`)
- [ ] 3.2 Tests, same commit: a site session that holds a role is refused for an operator action and the site instance refuses the admin and two-factor paths as defence in depth, a site cookie renamed to the console's name is refused at the HTTP route and at the session read, and recent sign-in and second factor are read on the console session (`shared-auth-session-SC-33`, `shared-auth-session-SC-34`, `shared-auth-session-SC-35`, `shared-auth-session-SC-36`)
- [ ] 3.3 Tests, same commit: a session in the pre-release shape, with no surface and the shared cookie name, is signed out on the console and unchanged on the site (`shared-auth-session-SC-37`, `shared-auth-session-SC-38`)
- [ ] 3.4 Make `createAuth` take the surface, set the cookie prefix from the registry, stamp `surface` on every session it mints through a field default, and prefix the cookie-cache version for the console only (`shared-auth-session-SC-27`, `shared-auth-session-SC-28`, `shared-auth-session-SC-30`)
- [ ] 3.5 Choose the surface per request: `Origin` for browser calls, the console for any read that asks for elevation, the site for a product's own sign-in, and route every caller of `createAuth` and `readSession` through it (`shared-auth-session-SC-33`)
- [ ] 3.6 Refuse a session stamped for the other surface in the security hooks and in `readSession`, and refuse `/admin/*` and `/two-factor/*` on the site instance, each logged and counted; both are defence in depth that adds no behaviour a requirement states (`shared-auth-session-SC-34`, `shared-auth-session-SC-33`)
- [ ] 3.7 Take the metric names and tags through `/datadog-custom-metrics` and add the two counters, foreign session refused and admin path refused on the site (`shared-auth-session-SC-34`)
- [ ] 3.8 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test:backend`

## 4. Sign-in signs in the surface that asked (grade10)

Needs group 2 landed.

- [ ] 4.1 Tests in their own commit: a link asked from the console signs in the console only, a link asked from the site the site only, a resend keeps the surface, Google on the console signs in the console only, a product's sign-in is the site's, a console link followed while the site is signed in is no mismatch, a location on the other surface is ignored, a site link an elevated console action sends signs in the site only and lands on the site's location, following it leaves the sender's console session as it was, and a console request for a site link with no console session, from a console role without `user:create`, or from a console session whose second factor is not proved is refused and sends nothing, and Google's auto-prompt, the site's, reads the site's session, so a console session does not withhold it (`shared-auth-sign-in-SC-86`, `shared-auth-sign-in-SC-91`, `shared-auth-sign-in-SC-92`, `shared-auth-sign-in-SC-93`, `shared-auth-sign-in-SC-94`, `shared-auth-sign-in-SC-95`, `shared-auth-sign-in-SC-96`, `shared-auth-sign-in-SC-97`, `shared-auth-sign-in-SC-108`, `shared-auth-sign-in-SC-109`, `shared-auth-sign-in-SC-110`, `shared-auth-sign-in-SC-111`, `shared-auth-sign-in-SC-112`, `shared-auth-sign-in-SC-114`)
- [ ] 4.2 Tests, same commit, for the per-surface keys and the console's landing: the send cap and supersession count per address and surface, a sign-in on one surface ends only the waits that asked from it, a failed or banned console-asked link lands on the console's sign-in page with an inline message, a console session as a different account is kept when a console link is followed, and the console's different-account choice offers Switch and Stay inline (`shared-auth-sign-in-SC-98`, `shared-auth-sign-in-SC-99`, `shared-auth-sign-in-SC-100`, `shared-auth-sign-in-SC-101`, `shared-auth-sign-in-SC-102`, `shared-auth-sign-in-SC-103`, `shared-auth-sign-in-SC-104`, `shared-auth-sign-in-SC-105`, `shared-auth-sign-in-SC-106`, `shared-auth-sign-in-SC-107`)
- [ ] 4.3 Tests, same commit, that the existing mismatch, redirect and link scenarios still hold on the site (`shared-auth-sign-in-SC-31`, `shared-auth-sign-in-SC-32`, `shared-auth-sign-in-SC-35`, `shared-auth-sign-in-SC-36`, `shared-auth-sign-in-SC-37`, `shared-auth-sign-in-SC-38`, `shared-auth-sign-in-SC-39`, `shared-auth-sign-in-SC-40`, `shared-auth-sign-in-SC-41`, `shared-auth-sign-in-SC-63`, `shared-auth-sign-in-SC-64`, `shared-auth-sign-in-SC-75`)
- [ ] 4.4 Generate each link's token with its surface as a prefix, choose the instance from that prefix on the follow route, and read a token with no prefix as the site (`shared-auth-sign-in-SC-91`, `shared-auth-sign-in-SC-92`, `shared-auth-sign-in-SC-93`)
- [ ] 4.5 Make `brandCallbackTarget` and `brandMagicLinkUrl` take the surface and land a location that is not the asker's on the asker's own origin, on send and again on follow (`shared-auth-sign-in-SC-97`, `shared-auth-sign-in-SC-31`, `shared-auth-sign-in-SC-32`)
- [ ] 4.6 Sign One Tap and a product's verified-email sign-in on the surface of their request and of the site respectively, and let `/dev/login` and `/dev/prepare-user` take a surface for tests and the dev widget (`shared-auth-sign-in-SC-94`, `shared-auth-sign-in-SC-95`)
- [ ] 4.7 Judge the signed-in mismatch on the instance's own session (`shared-auth-sign-in-SC-96`)
- [ ] 4.8 Key `invalidateEarlierSignInMail`, `assertSignInSendAllowed` and the settled marks in `signInWatch.ts` by address and surface, the surface read from the token's prefix (`shared-auth-sign-in-SC-99`, `shared-auth-sign-in-SC-100`, `shared-auth-sign-in-SC-101`, `shared-auth-sign-in-SC-102`)
- [ ] 4.9 Redirect a console token's failed or different-account follow to the console's sign-in page, and show the failure or the Switch and Stay choice inline there, since the console has no toasts (`shared-auth-sign-in-SC-103`, `shared-auth-sign-in-SC-104`, `shared-auth-sign-in-SC-105`, `shared-auth-sign-in-SC-106`, `shared-auth-sign-in-SC-107`, `shared-auth-sign-in-SC-98`)
- [ ] 4.10 Add the console's words for a failed, expired, banned and different-account link to `SignInFlowCopy` and `consoleCopy`, have `AdminSignInFlow` render them as a `Notice` above the card with Switch and Stay as its `actions`, and add stories for the five console sign-in states in `ui-design.md` (`shared-auth-sign-in-SC-103`, `shared-auth-sign-in-SC-104`, `shared-auth-sign-in-SC-105`, `shared-auth-sign-in-SC-106`, `shared-auth-sign-in-SC-107`)
- [ ] 4.11 Let an elevated console action ask for a site link: read `surface: "site"` on the console's send before choosing the instance, accept it only from the console `Origin`, walk `elevationRefusal` for `user:create` on the console session, serve the send on the site instance, and refuse any other name and every failed ladder with its own code, logged, sending nothing (`shared-auth-sign-in-SC-108`, `shared-auth-sign-in-SC-109`, `shared-auth-sign-in-SC-110`, `shared-auth-sign-in-SC-111`, `shared-auth-sign-in-SC-112`)
- [ ] 4.12 Test in its own commit that the test winners panel's send names the site: `apps/admin/grade10/src/pages/auction-test/AuctionTestPage.test.tsx` expects the console client's `signIn.magicLink` call to carry `surface: "site"` beside `email` and the order's `callbackURL`, where it expects those two alone today (`shared-auth-sign-in-SC-108`)
- [ ] 4.13 Make `emailSignInLink` in `AuctionTestWinners` (`apps/admin/grade10/src/pages/auction-test/AuctionTestPage.tsx`), the console's Email sign-in link of `complete-auction-post-sale`, send `surface: "site"`, and let the `SignInClient` port's `magicLink` input and its fixture client carry the field; the auth worker reads it in 4.11, and the current endpoint ignores it, so this ships before the worker (`shared-auth-sign-in-SC-108`)
- [ ] 4.14 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test:backend && pnpm run test`

## 5. Sign-out and sessions follow the surface (grade10)

Needs group 2 landed.

- [ ] 5.1 Tests in their own commit: signing out of one surface leaves the other signed in, the list names each session's surface and reads a missing stamp as the site, the sessions dialog and the account panel each show the surface the console supplies beside a session and none for a session supplied without one, the users desk passes each listed session's surface to the panel in words, ending one session, from the dialog or the panel's sessions area, leaves the other's surface standing, revoke-all and a ban end both and bump the version, revoking one session leaves the other surface (`shared-auth-sign-out-SC-06`, `shared-auth-sign-out-SC-07`, `shared-auth-sessions-SC-10`, `shared-auth-sessions-SC-14`, `shared-console-user-directory-SC-40`, `shared-console-user-directory-SC-41`, `shared-console-user-directory-SC-42`, `shared-auth-sessions-SC-11`, `shared-auth-sessions-SC-12`, `shared-auth-sessions-SC-13`)
- [ ] 5.2 Tests, same commit, that the existing sign-out, list and revoke scenarios still hold, including the 70-second close for a cached read on both surfaces (`shared-auth-sign-out-SC-02`, `shared-auth-sign-out-SC-03`, `shared-auth-sessions-SC-01`, `shared-auth-sessions-SC-04`, `shared-auth-sessions-SC-05`, `shared-auth-sessions-SC-09`)
- [ ] 5.3 End only the request's surface on sign-out, relying on the instance's own cookie names, and confirm each SPA's sign-out control needs no change (`shared-auth-sign-out-SC-06`, `shared-auth-sign-out-SC-07`)
- [ ] 5.4 Return `surface` per row from the operator list, reading a missing stamp as the site, add `surface` to `AdminSession` in `@grade10/auth-admin-frontend` so the users desk receives it (D7), and keep revoke by token or id across surfaces (`shared-auth-sessions-SC-10`, `shared-auth-sessions-SC-13`, `shared-auth-sessions-SC-14`)
- [ ] 5.5 Add `surface` to `UserSessionRow`, which `UserSessionsDialog` and the sessions area of `UserAccountPanel` both render: a surface heading in `UserSessionsDialog`'s `copy.headings` and in `UserAccountPanel`'s `copy.sessions.headings`, the surface as a `Badge` on each row of both when the console supplies one and none when it does not (the backend reads a missing stamp as the site in 5.4, so the console's row always supplies one), and stories for the four session-list states in `ui-design.md` on both; then `UserDirectorySection` in `@grade10/auth-admin-frontend`, the users desk, passes `AdminSession.surface` in the console's words, the site or the console, as `UserSessionRow.surface` to the sessions area of `UserAccountPanel`, the one session list the desk renders; it does not render `UserSessionsDialog` (`shared-auth-sessions-SC-10`, `shared-auth-sessions-SC-14`, `shared-console-user-directory-SC-40`, `shared-console-user-directory-SC-41`, `shared-console-user-directory-SC-42`)
- [ ] 5.6 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test:backend && pnpm run test`

## 6. End-to-end helpers and specs sign in per surface (grade10)

Needs groups 3 and 4 landed.

- [ ] 6.1 Add a console login to `e2e/helpers/auth.ts`: `loginViaMagicLink` with a surface that sends with `origin: ADMIN_ORIGIN` and a console `callbackURL`, asserts the console session cookie, and keeps the site's suffix match unchanged
- [ ] 6.2 Send `Origin` on helper calls that reach console-only endpoints, and carry the surface through the staging and uat test-door seam; `add-staging-auth-test-door` captures the last sign-in mail and clears the wait per address, so with per-surface keys the door returns the latest mail across surfaces and clears both surfaces' keys
- [ ] 6.3 Move every spec that signs in on the site and then opens `ADMIN_ORIGIN` to the console login, and correct the comment on `ADMIN_ORIGIN` in `e2e/helpers/env.ts`
- [ ] 6.4 Verify: `pnpm --dir apps/frontend/grade10 run e2e`

## 7. Architecture record (grade10)

- [ ] 7.1 Update `docs/architecture/security.md`, `docs/architecture/multi-product.md`, `docs/architecture/account-data.md` and `docs/architecture/e2e.md`: two cookie names under one scope, how the surface is chosen and why a forged signal gains nothing, the elevated read, and the isolated stack's shared jar
- [ ] 7.2 Verify: `pnpm run lint`

## 8. The walk (grade10)

Uses draft `feature-tcs.md` as its input; human QA reviews cases after deployment (`/tcs-review separate-site-and-admin-sessions`), and `/tcs-run-sheet` executes manual cases when needed. Needs groups 3 to 6 landed.

- [ ] 8.1 Walk each journey of the five capabilities end to end through the interface its actor uses, on the isolated stack with one browser context holding both cookies, and keep the walks as the change's end-to-end suite (`shared-auth-session-US-07`, `shared-auth-session-US-08`, `shared-auth-session-US-02`, with `shared-auth-session-SC-39`, `shared-auth-session-SC-40` and `shared-auth-session-SC-41` walked among them, `shared-auth-sign-in-US-12`, `shared-auth-sign-out-US-03`, `shared-auth-sessions-US-03`, `shared-auth-sessions-US-04`, `shared-console-user-directory-US-02`)
- [ ] 8.2 Flip the cases the walks decide with `pnpm run tcs:automated <case…> --decided-by grade10:apps/frontend/grade10/e2e/tests/auth/surfaces.spec.ts`, in the walks' own commit; the cases that stay manual are named in the suite and in the walk's `rounds.md` row
- [ ] 8.3 Leave trace markers to the trace CLI, which allocates them at the walk; add none by hand
- [ ] 8.4 Verify: `pnpm --dir apps/frontend/grade10 run e2e` and the hosted auth lane on staging
