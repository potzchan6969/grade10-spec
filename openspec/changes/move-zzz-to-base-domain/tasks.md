## 1. The site registry (grade10)

`packages/app-env` decides every ZZZ host. This group lands first; groups 2
and 3 both read the address it sets.

- [ ] 1.1 Move ZZZ to its base domain in `packages/app-env/src/sites.ts` —
      `BRAND_SITES.zzz` becomes `["web"]` and `BRAND_STOREFRONT.zzz` becomes
      `"web"` — making *The site answers at the base domain* and *The brand
      runs exactly one site* pass in `packages/app-env/test/sites.test.ts`.
- [ ] 1.2 Retire the `store` site id from `SiteId` and `SITE_SUBDOMAIN`, and
      point the ZZZ SPA's `vite.config.ts` and `vitest.config.ts` — its two
      callers — at `id: "web"`, so no vocabulary word names a site no brand
      runs.
- [ ] 1.3 Pin *A sign-in mail links to the base domain* on `storefrontUrl`,
      which `signInUrl` in
      `packages/grade10-auth/backend/src/core/createAuth.ts` and the VAPID
      subject in `packages/grade10-store/backend/src/worker/push/vapid.ts`
      both read, and *A collector's session survives the move* on
      `cookieDomain` — the cookie is held on the brand's parent domain, not
      on the host its site answers at.
- [ ] 1.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      `pnpm run test:backend`.

## 2. The new address (grade10)

Needs group 1 landed.

- [ ] 2.1 Point each environment's `custom_domain` route in
      `apps/frontend/zzz/wrangler.jsonc` at the base domain
      (`zzz.9jokes.com`, `zzz.com`); run `pnpm run cf-typegen`.
- [ ] 2.2 Move the browser-storage prefix in `apps/frontend/zzz/src/config.ts`
      from `zzz-store` to `zzz`, so no string in the app names a storefront.
- [ ] 2.3 Rename the nginx vhost `store.zzz.dev` → `zzz.dev` with its
      upstream — the existing zone certificate already covers the base
      domain — and re-sync with `pnpm run nginx:setup`.
- [ ] 2.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      `pnpm run build`, and `pnpm dev --only=zzz` serving the site at
      `https://zzz.dev`.

## 3. Retire the storefront address (grade10)

Needs group 2 landed, and needs both ZZZ zones registered — they are still
unregistered placeholders. Task 3.1 is configured before 3.2 deploys, so the
old address is answered from the moment the new one is.

- [ ] 3.1 Add a Cloudflare Redirect Rule to each ZZZ zone forwarding
      `store.<base>` to the same path at `<base>`, making *A saved storefront
      link still lands*, *A deep link keeps its path and query*, and *The
      redirect is permanent* pass; record the rule in `docs/deployment.md`
      beside the DNS and provider registrations.
- [ ] 3.2 Deploy staging with `pnpm run deploy --component=zzz
      --env=staging`, then confirm `zzz.9jokes.com` serves the site and
      `store.zzz.9jokes.com/<path>?<query>` lands on it unchanged.

## 4. The documented map (grade10)

Claimable in parallel with group 3 once group 2 has landed.

- [ ] 4.1 Close the **Open** item in `docs/architecture/multi-product.md` —
      "ZZZ still runs one storefront on a subdomain rather than a whole
      site" — and update the SPA list's host.
- [ ] 4.2 Update the host each ZZZ node shows in
      `docs/architecture/handbook.html`, and the band label.
- [ ] 4.3 Verify: `pnpm run check:handbook`, `pnpm run lint`.
