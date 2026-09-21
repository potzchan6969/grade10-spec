# Tasks

Group 1 lands in **grade10-spec**; its submodule bump is the boundary group 2
waits on. Design decisions: [`tech-design.md`](tech-design.md). Screens and
states: [`ui-design.md`](ui-design.md).

## 1. Copy, preview fixtures, and Profile-first coverage (grade10-spec)

- [ ] 1.1 Add a Storybook story (or `play` block) asserting the Profile-first composition — `onProfile` supplied alongside every other handler renders Profile, My Orders, My Auctions, Membership, then Sign Out, in that order (`packages/ui/src/blocks/site-chrome/site-header.auction-store.account.stories.tsx` or a sibling) (`shared-ui-site-chrome-SC-17`, `SC-29`, `SC-32`; `grade10-site-site-page-shell-SC-17`, `SC-27`)
- [ ] 1.2 Title Case `signOut` to "Sign Out" in `packages/i18n/messages/shared/en/common.json` — English only, ko/zh-Hans/zh-Hant unchanged (`shared-ui-site-chrome-SC-37`; `grade10-site-site-page-shell-SC-33`)
- [ ] 1.3 Add a `membership` key ("Membership") to `packages/i18n/messages/grade10/en/chrome.json`, `zh-Hans/chrome.json`, and `zh-Hant/chrome.json` (`shared-ui-site-chrome-SC-39`, `SC-40`; `grade10-site-site-page-shell-SC-32`)
- [ ] 1.4 Update `apps/preview/src/pages/store-content.ts` and `auction-lot-details-content.ts`: supply `accountEmail` (the auction fixture reuses its existing `VIEWER_INITIALS` address; the store fixture takes a fixture email of its own) and Title Case `signOut` — leave the existing `onProfile` wiring as is (`grade10-site-site-page-shell-SC-17`, `SC-27`, `SC-30`, `SC-31`)
- [ ] 1.5 Confirm `docs/prds/products/grade10-site/site/page-shell.md` and `docs/prds/products/shared/ui/site-chrome.md` 🚧 lines match the delivered composition
- [ ] 1.6 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test:stories`

## 2. Header wiring (grade10)

- [ ] 2.1 `SiteShell`/`root.tsx`: thread `accountEmail` from the signed-in session's email (`root.tsx`'s `session.user`) down through `SiteShell` into `SiteHeader` (`apps/frontend/grade10/src/chrome/SiteShell.tsx`). `onProfile` wiring is untouched — it already follows `config.gates.profile` (`grade10-site-site-page-shell-SC-17`, `SC-27`, `SC-28`, `SC-29`, `SC-30`, `SC-31`)
- [ ] 2.2 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test`
