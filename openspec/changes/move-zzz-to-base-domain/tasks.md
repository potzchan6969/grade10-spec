## 1. The site registry (grade10)

`packages/app-env` decides every ZZZ host. This group lands first; groups 2
and 3 both read the address it sets.

- [ ] 1.1 Move ZZZ to its base domain in `packages/app-env/src/sites.ts` —
      `BRAND_SITES.zzz` becomes `["web"]` and `BRAND_STOREFRONT.zzz` becomes
      `"web"` — making *The site answers at the base domain* and *The brand
      runs exactly one site* pass in `packages/app-env/test/sites.test.ts`.
- [ ] 1.2 Retire the `store` site id from `SiteId` and `SITE_SUBDOMAIN`, and
      point the ZZZ SPA's `vite.config.ts` — its one caller — at `id: "web"`,
      so no vocabulary word names a site no brand runs.
- [ ] 1.3 Pin *A sign-in mail links to the base domain* against the derived
      callers that never name a host: `signInUrl` in
      `packages/grade10-auth/backend/src/core/createAuth.ts`, the VAPID
      subject in `packages/grade10-store/backend/src/worker/push/vapid.ts`,
      and `STORE_ORIGIN` in `apps/backend/zzz/store/test/helpers/fixture.ts`.
- [ ] 1.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      `pnpm run test:backend`.

## 2. The ZZZ app's identity (grade10)

Needs group 1 landed — the two touch `vite.config.ts`, and the route this
group writes has to agree with the registry that group sets.

- [ ] 2.1 Move `apps/frontend/zzz-store` to `apps/frontend/zzz` and rename
      the package to `@grade10/zzz-spa`, updating the root `package.json`
      `build` script and regenerating `pnpm-lock.yaml` with `pnpm install`.
- [ ] 2.2 Rename the Cloudflare worker in `apps/frontend/zzz/wrangler.jsonc`
      to `zzz-web` and point each environment's `custom_domain` route at the
      base domain (`zzz.9jokes.com`, `zzz.com`); run `pnpm run cf-typegen`.
- [ ] 2.3 Move the browser-storage prefix in `apps/frontend/zzz/src/config.ts`
      from `zzz-store` to `zzz`, so no string in the app names a storefront.
- [ ] 2.4 Move the dev environment onto `zzz.dev`: the service entry in
      `scripts/dev/services.mjs` (name and dir), an `OLD_APP_HOMES` entry in
      `scripts/dev/preflight.mjs` so leftover state at the old path is
      reported, and the nginx vhost renamed `store.zzz.dev` → `zzz.dev` with
      its upstream — the existing zone certificate already covers the base
      domain. Re-sync with `pnpm run nginx:setup`.
- [ ] 2.5 Point the deploy workflow's ZZZ SPA step at the new directory in
      `.github/workflows/deploy.yml`; `scripts/deploy/components.mjs` derives
      from the dev registry and needs no edit.
- [ ] 2.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      `pnpm run build`, `pnpm run check:libs`, and `pnpm dev --only=zzz`
      serving the site at `https://zzz.dev`.

## 3. Retire the storefront address (grade10)

Needs group 2 landed. Task 3.1 is configured before 3.2 deploys, so the old
address is answered from the moment the new one is.

- [ ] 3.1 Add a Cloudflare Redirect Rule to each ZZZ zone forwarding
      `store.<base>` to the same path at `<base>`, making *A saved storefront
      link still lands*, *A deep link keeps its path and query*, and *The
      redirect is permanent* pass; record the rule in `docs/deployment.md`
      beside the DNS and provider registrations.
- [ ] 3.2 Deploy staging with `pnpm run deploy --component=zzz
      --env=staging`, then confirm `zzz.9jokes.com` serves the site and
      `store.zzz.9jokes.com/<path>?<query>` lands on it unchanged.
- [ ] 3.3 Delete the `zzz-store-web-staging` and `zzz-store-web-production`
      workers from Cloudflare and add them to the *Retired workers* list in
      `docs/deployment.md`, alongside `grade10-store-web`.

## 4. The documented map (grade10)

Claimable in parallel with group 3 once group 2 has landed.

- [ ] 4.1 Correct the layout rules in `AGENTS.md` — the flat SPA list and the
      `@grade10/zzz-store-spa` naming example — and the two references in
      `.claude/skills/react-clean-architecture/SKILL.md`.
- [ ] 4.2 Update `docs/architecture/multi-product.md`: the SPA list, and its
      **Open** item — "ZZZ still runs one storefront on a subdomain rather
      than a whole site" — which this change closes.
- [ ] 4.3 Update the ZZZ band in `docs/architecture/handbook.html`: the
      `zzz-store-spa` node id, its label and host, and the card's title and
      path.
- [ ] 4.4 Verify: `pnpm run check:handbook`, `pnpm run agent:check-parity`,
      `pnpm run lint`.
