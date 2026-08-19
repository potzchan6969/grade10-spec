## 1. The ZZZ app's identity (grade10) (owner: @sean)

The rename lands whole: a directory moved without its package name is a
broken workspace, so 1.1 through 1.5 are one unit of work.

- [ ] 1.1 Move `apps/frontend/zzz-store` to `apps/frontend/zzz` and rename
      the package to `@grade10/zzz-spa`, updating the root `package.json`
      `build` script and regenerating `pnpm-lock.yaml` with `pnpm install`.
- [ ] 1.2 Rename the Cloudflare worker in `apps/frontend/zzz/wrangler.jsonc`
      to `zzz-web`, `zzz-web-staging`, and `zzz-web-production`, leaving
      every `routes` pattern on `store.zzz.*` untouched; run
      `pnpm run cf-typegen`.
- [ ] 1.3 Rename the dev service to `zzz` in `scripts/dev/services.mjs` and
      point it at the new directory, and add
      `"apps/frontend/zzz-store": "apps/frontend/zzz"` to `OLD_APP_HOMES` in
      `scripts/dev/preflight.mjs` so leftover `.dev.vars` or `.wrangler`
      state at the old path is reported rather than silently ignored. The
      nginx vhost stays `store.zzz.dev` — the hostname is not changing.
- [ ] 1.4 Point the ZZZ SPA's deploy step at the new directory in
      `.github/workflows/deploy.yml`.
- [ ] 1.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      `pnpm run build`, `pnpm run check:libs`, and `pnpm dev --only=zzz`
      serving the app at `https://store.zzz.dev`.

## 2. The documented map (grade10)

Claimable once group 1 has landed.

- [ ] 2.1 Correct the layout rules in `AGENTS.md` — the flat SPA list and
      the `@grade10/zzz-store-spa` naming example — and the two references
      in `.claude/skills/react-clean-architecture/SKILL.md`.
- [ ] 2.2 Update the SPA list in `docs/architecture/multi-product.md`, and
      point its **Open** item — "ZZZ still runs one storefront on a
      subdomain rather than a whole site" — at `move-zzz-to-base-domain` by
      name, so the app being `zzz` at `store.zzz.*` reads as scheduled
      rather than half-finished.
- [ ] 2.3 Update the ZZZ band in `docs/architecture/handbook.html`: the
      `zzz-store-spa` node id and its card's title and path. The host it
      shows, `store.zzz.com`, is still correct and stays.
- [ ] 2.4 Verify: `pnpm run check:handbook`, `pnpm run agent:check-parity`,
      `pnpm run lint`.
