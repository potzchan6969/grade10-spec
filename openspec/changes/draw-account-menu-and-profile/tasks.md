# Tasks

## 1. The menu avatar (grade10-spec)

- [x] 1.1 `SiteHeader` takes `accountAvatarSrc` and shows it in the account menu's `xs` avatar, falling back to the initial of the address before the `@` when it is absent or fails to load; the label alone, with no avatar, when no email is supplied (`shared-ui-site-chrome-SC-49`)
- [x] 1.2 Stories under Auction & Store / Account menu: with a profile image, and with one that fails to load, each with a play test
- [x] 1.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:stories:ui`

## 2. The site passes the profile's image (grade10)

- [x] 2.1 The grade10 site reads the profile's avatar through `useProfile` wherever the account page is carried and the collector is signed in, and passes it to `SiteHeader` through `SiteShell` (`grade10-site-site-page-shell-SC-79`)
- [x] 2.2 Verify: `pnpm run typecheck`, `pnpm run lint`, and the site's chrome tests

## 3. The manual (grade10-spec)

- [x] 3.1 Take the 🚧 off the menu avatar on the Site Header and Footer page, and state it on Page Shell; the two ADDED requirements fold into the durable specs when the change archives

## 4. The walk

- [ ] 4.1 Walk `grade10-site-site-page-shell-US-03` on staging: set a profile image, open the account menu, see it; remove it, see the initial — blocked: needs a deployed stack with the `AVATARS` bucket (add-account-profile 6.1)
