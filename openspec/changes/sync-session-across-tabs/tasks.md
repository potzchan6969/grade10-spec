# Tasks — sync-session-across-tabs

## 1. The record (grade10-spec)

- [x] 1.1 Mark Session · Open Tabs and Sign-In · Following the Link with what a collector sees when a tab keeps up
- [x] 1.2 Verify: `pnpm check:manual && pnpm run tcs:validate`

## 2. Session announcement and read (grade10) (owner: @sean)

Groups 3 and 4 build against the session state this group publishes. They do
not need it landed to be claimed — both can be verified against fixtures — but
the promptness cases in each wait on 2.1.

- [x] 2.1 Announce on the browser auth client once per document load, on the first session read that finds somebody, so every other tab of the site re-reads at once (shared-auth-session-SC-22)
- [x] 2.2 Bind that announcement into both sites' browser entries beside the existing session bind, and confirm a sign-out still reaches the other tabs on better-auth's own announcement (shared-auth-session-SC-12, shared-auth-session-SC-16)
- [x] 2.3 Cover the read that fails: a surface that cannot reach the auth service keeps the person it last held, and only an answer of nobody signs it out (shared-auth-session-SC-25, shared-auth-session-SC-26)
- [x] 2.4 Cover the session that ran out and the session that became somebody else, including that the same person signing in again never flickers through signed-out (shared-auth-session-SC-13, shared-auth-session-SC-14, shared-auth-session-SC-23)
- [x] 2.5 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test`

## 3. Sign-in surfaces carry on (grade10) (owner: @sean)

- [x] 3.1 Have each site's sign-in dialog watch the session and call the overlay's `signedIn` when one arrives while it is open, closing the dialog and announcing nothing (shared-auth-sign-in-SC-50, shared-auth-sign-in-SC-51, shared-auth-session-SC-15)
- [x] 3.2 Change the arrival gate to exit through `signedIn` rather than `closeSignIn`, so a held resume is carried on instead of dropped, and prove the refused add and the refused navigation both complete without a second activation (shared-auth-sign-in-SC-52, shared-auth-sign-in-SC-53)
- [x] 3.3 Prove a dialog with nothing behind it only closes, that the refused action runs at most once however often the surface is returned to, and that an action which can no longer be done reports its ordinary refusal rather than being passed over (shared-auth-sign-in-SC-54, shared-auth-sign-in-SC-56, shared-auth-sign-in-SC-57)
- [x] 3.4 Prove a follow that creates no session leaves the asking surface exactly as it was, dialog and all, announcing nothing (shared-auth-sign-in-SC-55)
- [x] 3.5 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test`

## 4. Per-person surfaces follow the person (grade10) (owner: @sean)

- [x] 4.1 Audit every per-member read on both sites — cart, watchlist, orders, bids, member card — and key each on the person the session names, so a person change re-reads rather than serving the previous person's rows (shared-auth-session-SC-19, shared-auth-session-SC-20)
- [x] 4.2 Have a surface that needs a session to have anything to show answer a session that ended exactly as it answers somebody arriving with none, and stop showing what it held about the person who left (shared-auth-session-SC-21, shared-auth-session-SC-24)
- [x] 4.3 Confirm a session ending elsewhere does not run the cleanup a confirmed sign-out runs, which stays the sign-out path's (shared-auth-session-SC-21)
- [x] 4.4 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test`

## 5. Cross-tab end-to-end (grade10) (owner: @sean)

- [x] 5.1 Walk the headline path in one browser context: a refused add in the first tab, the link followed in a second, the first tab signed in with the add completed and a third tab of the brand naming the collector without a reload (shared-auth-e2e-US7-TC1-1)
- [x] 5.2 Walk the negatives that bound the reach: another brand's tab and another browser's tab both stay as they were (shared-auth-session-SC-17, shared-auth-session-SC-18)
- [x] 5.3 Verify: the site's e2e suite, then `pnpm run build`
