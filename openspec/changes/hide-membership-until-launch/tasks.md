## 1. The gate (grade10) (owner: @sean)

- [x] 1.1 Add `"membership"` to `Gate` and a `membership:` row to `gatesFor`
      in `apps/frontend/grade10/src/surfaces.ts`, and set
      `gate: "membership"` on both the `membership` and `join` entries in
      `SURFACES`
      (`grade10-site-site-carried-surfaces-SC-38`)
- [x] 1.2 Update every exhaustive `Gates` literal the compiler flags with a
      sixth `membership:` entry — `src/surfaces.test.ts`,
      `src/store-shut.test.tsx`, `src/serving/webManifest.test.ts`,
      `src/serving/crawlerDirectory.test.ts`, `src/serving/worker.test.ts`,
      `src/chrome/siteContent.test.ts`, `scripts/check-public-pages.mjs`
- [x] 1.3 Verify: `pnpm run typecheck && pnpm run test`

## 2. Membership's own gate (grade10) (owner: @sean)

Needs group 1 landed to compile against the sixth `Gates` member.

- [x] 2.1 Add a `describe("membership's own gate", ...)` block to
      `src/surfaces.test.ts`, alongside the existing "the profile's own
      gate" block: assert `carriedSurfaces` carries both `membership` and
      `join` together on `OPEN` and withholds both together on `SHUT`, and
      that `gatesFor` reads `membership: true` on development and staging,
      `false` on preview and production
      (`grade10-site-site-carried-surfaces-SC-38`)
- [x] 2.2 Add a case proving `/membership` and `/join` never split — no
      build in the route table carries one without the other
      (`grade10-site-site-carried-surfaces-SC-39`)
- [x] 2.3 Verify: `pnpm run typecheck && pnpm run test`

## 3. Manual (grade10-spec) (owner: @sean)

- [ ] 3.1 Take the 🚧 marks off
      `docs/prds/products/grade10-site/site/carried-surfaces.md` once
      shipped, confirming the lane table, the Membership bullet and the
      "Membership now waits too" decision row all state the shipped
      behaviour as fact
- [ ] 3.2 Verify: `pnpm check:manual`
