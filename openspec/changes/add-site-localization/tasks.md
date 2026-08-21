# Tasks: Site localization

Group 1 lands in grade10-spec; the submodule bump is the boundary, so every
grade10 group needs group 1 landed and the submodule moved. Groups 3, 4, and
5 all depend on group 2; group 5 additionally depends on group 4's remembered
locale. Groups 3 and 4 are independent of each other. Nothing here waits on
another change: crawlable public pages have shipped.

## 1. Brand-keyed catalogs and the shared vocabulary (grade10-spec) (owner: @sean)

- [x] 1.1 Restructure `packages/i18n` brand-first — one catalog per brand and locale, a per-brand registry of locale set and default, lookup by brand and locale — keeping the key-by-key overlay merge so `A partial translation falls back key by key` passes, and naming locales as the spec does (`zh-Hant`, `zh-Hans`) in place of today's lowercase `zh-hant`, since the same tag reaches `lang` and the address prefixes.
- [x] 1.2 Make `A single-locale brand is missing a string` pass: ZZZ's Korean catalog is typechecked as complete against the vocabulary, so a missing value fails `pnpm run typecheck` in this repository.
- [x] 1.3 Inventory the user-facing strings of both sites' surfaces and the shared feature slices, and author the vocabulary with engineer-drafted values for `en`, `zh-Hant`, `zh-Hans`, and `ko`, including the login-email branch — marked for native review — so `A Chinese sign-in gets a Chinese email` and `The ZZZ email is Korean` have values to render.
- [x] 1.4 Run `pnpm run typecheck` and `pnpm run lint` in grade10-spec as this group's verification.

## 2. Shared surfaces speak the vocabulary (grade10) (owner: @sean)

- [x] 2.1 Bump `external/grade10-spec` to the new catalogs and mount the intl provider at each SPA's root — brand catalog plus active locale (grade10 still `en`, ZZZ still `en` until group 3) — with message keys typed against the vocabulary so `No raw key on screen` holds at typecheck.
- [x] 2.2 Make `A shared surface renders each brand's language` pass: the auth and store feature slices render their strings through the vocabulary instead of hardcoded copy, while `Commerce content stays in its source language`.
- [x] 2.3 Make `A month in Traditional Chinese` pass: date rendering on every localized surface names the active locale as its language input.
- [x] 2.4 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test` as this group's verification.

## 3. ZZZ in Korean (grade10) (owner: @sean)

- [x] 3.1 Make `Every ZZZ surface is Korean`, `The ZZZ document is Korean`, and `One language needs no switcher` pass: the ZZZ root renders from the Korean catalog with the locale constant, the document declares `ko`, and the chrome's locale label is supplied with no handler.
- [x] 3.2 Make `The ZZZ email is Korean` pass: the ZZZ auth worker replaces its hardcoded English email catalog with the brand's Korean catalog.
- [x] 3.3 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run test:backend` as this group's verification.

## 4. grade10 resolves the locale, then remembers it (grade10) (owner: @sean)

- [ ] 4.1 Make `A Hong Kong browser arrives`, `An unsupported language falls to the default`, and `An explicit pick outlives the visit` pass: first-visit negotiation from the browser's languages with the regional Chinese mapping, and the pick persisted in the `locale` cookie the auth service already reads.
- [ ] 4.2 Make `A Chinese page says so` pass and wire the chrome's switcher: `Nav` receives the three locales and the change handler, the footer its locale slot, and the document declares the active locale.
- [ ] 4.3 Make `A Chinese sign-in gets a Chinese email` pass: a sign-in started on a localized page mails in that page's locale through the existing cookie seam, falling back to English when none is carried.
- [ ] 4.4 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run test:backend` as this group's verification.

## 5. Localized public addresses (grade10)

Depends on group 4's remembered locale.

The prefixes cover the surfaces the build writes a document for —
`PRERENDERED_SURFACES` in `apps/frontend/grade10/src/surfaces.ts`. A rendered
surface (`RENDERED_SURFACES`, a card's page) is 5.4 and gets no prefix.

- [ ] 5.1 Make `A Chinese address answers whole` pass: the route table gains the `/tc` and `/sc` prefixes over the prerendered public route modules, each identity record answers per locale from the catalogs, and the build prerenders every variant's document in its own language.
- [ ] 5.2 Make `A variant declares its alternates` and `The sitemap lists every variant` pass: alternate-language links derive from the identity records, default included, and the sitemap lists each surface it already names once per locale — no card address joins it, so `grade10-store/product-page`'s `The sitemap names no pattern` stays green.
- [ ] 5.3 Make `The address wins over the memory`, `A prefixed visit stays in its language`, and `The memory redirects an unprefixed arrival` pass: a variant renders its address's locale deterministically, in-site navigation keeps the prefix, and the one post-hydration cookie read sends an unprefixed arrival to its remembered variant.
- [ ] 5.4 Make `A rendered surface keeps its one address` and `A crawler reads a rendered surface in the default locale` pass: the worker renders a card's page in the locale the request carries and declares it, falling back to English when the request carries none, with the card's address unchanged and `serving/prerender.test.tsx` and `serving/hydration.test.tsx` green over it.
- [ ] 5.5 Make `An unknown prefixed address is refused honestly` pass: serving resolves prefixed addresses through the route config, answering 404 with the not-found surface in the address's locale.
- [ ] 5.6 Run the full check suite and a production build as this group's verification, and confirm the localized addresses, alternates, statuses, and a card's page in a non-default locale against a deployed staging preview.
