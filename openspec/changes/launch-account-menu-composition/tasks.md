# Tasks

Group 1 lands in **grade10-spec**; its submodule bump is the boundary group 2
waits on. Design decisions and the risks kept from becoming a bandaid fix:
[`tech-design.md`](tech-design.md). Screens and states: [`ui-design.md`](ui-design.md).

## 1. Component contract and copy (grade10-spec)

- [ ] 1.1 Remove `SiteHeader`'s handler-gated Profile menu item (`packages/ui/src/blocks/site-chrome/site-header.tsx`) so the menu never offers Profile, whether or not `onProfile` is supplied; keep `onProfile` on `SiteHeaderProps`, unused, and update the component doc comment (`shared-ui-site-chrome-SC-30`, `SC-32`, `SC-33`; `grade10-site-site-page-shell-SC-28`, `SC-29`)
- [ ] 1.2 Add a play-function assertion to `site-header.auction-store.account.stories.tsx`'s `Open` story (or a sibling story) proving that supplying `onProfile` still renders no Profile item (`shared-ui-site-chrome-SC-32`)
- [ ] 1.3 Title Case `signOut` to "Sign Out" in `packages/i18n/messages/shared/en/common.json` — English only, ko/zh-Hans/zh-Hant unchanged (`shared-ui-site-chrome-SC-37`; `grade10-site-site-page-shell-SC-33`)
- [ ] 1.4 Add a `membership` key ("Membership") to `packages/i18n/messages/grade10/en/chrome.json`, `zh-Hans/chrome.json`, and `zh-Hant/chrome.json` (`shared-ui-site-chrome-SC-39`, `SC-40`; `grade10-site-site-page-shell-SC-32`)
- [ ] 1.5 Update `apps/preview/src/pages/store-content.ts` and `auction-lot-details-content.ts`: drop the `onProfile` fixture, supply `accountEmail` (the auction fixture reuses its existing `VIEWER_INITIALS` address), and Title Case `signOut` (`grade10-site-site-page-shell-SC-17`, `SC-27`, `SC-30`, `SC-31`)
- [ ] 1.6 Confirm `docs/prds/products/grade10-site/site/page-shell.md` and `docs/prds/products/shared/ui/site-chrome.md` 🚧 lines match the delivered composition
- [ ] 1.7 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test:stories`

## 2. Header wiring (grade10)

- [ ] 2.1 `SiteShell`/`root.tsx`: stop passing `onProfile` to `SiteHeader` (drop the `config.gates.profile` wiring in `apps/frontend/grade10/src/chrome/SiteShell.tsx`), and thread `accountEmail` from the signed-in session's email (`root.tsx`'s `session.user`) down through `SiteShell` into `SiteHeader` (`grade10-site-site-page-shell-SC-17`, `SC-27`, `SC-28`, `SC-29`, `SC-30`, `SC-31`)
- [ ] 2.2 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test`
