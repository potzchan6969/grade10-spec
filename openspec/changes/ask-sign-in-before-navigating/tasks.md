## 1. Manual (grade10-spec) (owner: @sean)

- [x] 1.1 Mark Navigation with what a collector without a session meets on a surface that needs an account: asked before the address changes, signing in finishing the move, an address opened from outside answered where it lands, and a link carrying its own secret never asked (grade10-site-site-navigation-SC-15, grade10-site-site-navigation-SC-17, grade10-site-site-navigation-SC-21)
- [x] 1.2 Verify: `pnpm check:manual`

## 2. Shared sign-in overlay (grade10) (owner: @sean)

- [x] 2.1 Carry what an asking was for on the shared overlay, and tell a session arriving apart from a dismissal, so what the collector was stopped on can resume (grade10-site-site-navigation-SC-19)
- [x] 2.2 Point the grade10 and ZZZ sign-in dialogs at the session exit rather than the dismissal one, so a success runs what the ask was for (grade10-site-site-navigation-SC-19)
- [x] 2.3 Verify: `pnpm run typecheck && pnpm run lint && node scripts/test.mjs auth-frontend`

## 3. Site addressing (grade10) (owner: @sean)

- [x] 3.1 Declare on every session-shaped surface what it does for a collector with no session, so a surface added without the answer does not compile (grade10-site-site-navigation-SC-15, grade10-site-site-navigation-SC-16)
- [x] 3.2 Read the surfaces that wait for a session from that same declaration, so the set that waits and the set that asks cannot drift (grade10-site-site-navigation-SC-21, grade10-site-site-navigation-SC-24)
- [x] 3.3 Verify: `pnpm run typecheck && pnpm run lint && node scripts/test.mjs web-spa`

## 4. Asking before the navigation (grade10) (owner: @sean)

Needs group 2's overlay and group 3's declaration landed: the guard reads the
one and resumes through the other.

- [x] 4.1 Hold an in-app navigation to a surface that asks, open the dialog over the surface the collector is on, and leave the address where it was (grade10-site-site-navigation-SC-17)
- [x] 4.2 Drop the held navigation on dismissal, leaving the collector's page as it was and no history entry behind (grade10-site-site-navigation-SC-18, grade10-site-site-navigation-SC-20)
- [x] 4.3 Finish the held navigation when a session arrives, withdrawing the dialog with it (grade10-site-site-navigation-SC-19)
- [x] 4.4 Let a surface that answers the signed-out through unheld, so it renders its own invitation (grade10-site-site-navigation-SC-15, grade10-site-site-navigation-SC-16)
- [x] 4.5 Leave an address opened from outside the site, and back and forward, to the surface itself, uncorrected (grade10-site-site-navigation-SC-21, grade10-site-site-navigation-SC-22, grade10-site-site-navigation-SC-23)
- [ ] 4.6 Verify: `pnpm run typecheck && pnpm run lint && node scripts/test.mjs web-spa`

## 5. Leaving the ask at the address (grade10)

- [ ] 5.1 Take a collector who dismisses the ask at the address they opened to the brand home, replacing the entry the surface holds (grade10-site-site-navigation-SC-25)
- [ ] 5.2 Verify: `pnpm run typecheck && pnpm run lint && node scripts/test.mjs web-spa`
