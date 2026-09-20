## 1. Catalog, stories, and contract (grade10-spec)

- [x] 1.1 Mark Sign-In · Following the Link and keep the proposal References linked
- [x] 1.2 Add `linkExpired`, `linkInvalid`, and `linkBanned` to shared `signIn` catalogs in every locale
- [x] 1.3 Add Auth Sign In / Link Follow Toasts stories for the three failure toasts (shared-auth-sign-in-SC-37, SC-38–SC-40, SC-41)
- [x] 1.4 Verify: `pnpm check:manual && pnpm run tcs:validate && pnpm run typecheck`

## 2. Verify failure feedback (grade10) (owner: @sean)

- [x] 2.1 On magic-link verify failure, redirect to the brand home with `link_expired`, `link_invalid`, or `link_banned` (shared-auth-sign-in-SC-37 through SC-41)
- [x] 2.2 On the brand home, read that reason once, fire the matching `signIn` toast, and clear it from the URL (shared-auth-sign-in-SC-37 through SC-41)
- [x] 2.3 Verify: app typecheck and the feature cases for US-06
