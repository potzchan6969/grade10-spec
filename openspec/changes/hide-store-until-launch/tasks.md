## 1. The surface table and the gate (grade10) (owner: @sean)

- [x] 1.1 Declare the store gate on the nine store surfaces in
      `apps/frontend/grade10/src/surfaces.ts`, and add `gatesFor(deployEnv)`
      beside the table as the one statement of which lanes carry them
      (`grade10-site-site-carried-surfaces-SC-17`)
- [x] 1.2 Turn `SERVED_PATTERNS`, `PRERENDERED_SURFACES`, `RENDERED_SURFACES`
      and `PUBLIC_SURFACES` into functions of the gates, leaving `DEV_SURFACES`
      on `kind` (`grade10-site-site-carried-surfaces-SC-01`,
      `grade10-site-site-carried-surfaces-SC-06`,
      `grade10-site-site-carried-surfaces-SC-07`)
- [x] 1.3 Add `gates: gatesFor(deployEnv)` to
      `apps/frontend/grade10/src/config.ts`, beside the stage it already parses
- [x] 1.4 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test`

## 2. Serving, the route table and the crawler files (grade10) (owner: @sean)

Needs group 1's landed table: every task here reads the gated lists.

- [x] 2.1 Filter `src/routes.ts` and `react-router.config.ts` by
      `gatesFor(resolveDeployEnv())`, so a build that does not carry the store
      registers no store route and writes no store document
      (`grade10-site-site-carried-surfaces-SC-03`,
      `grade10-site-site-carried-surfaces-SC-04`,
      `grade10-site-site-carried-surfaces-SC-05`)
- [x] 2.2 Resolve addresses through the gated patterns in
      `src/serving/serveAddress.ts`, including every address beneath an
      uncarried surface, a prefixed one, and one asked for with a session
      (`grade10-site-site-carried-surfaces-SC-08`,
      `grade10-site-site-carried-surfaces-SC-09`,
      `grade10-site-site-carried-surfaces-SC-10`,
      `grade10-site-site-carried-surfaces-SC-18`,
      `grade10-site-site-carried-surfaces-SC-19`)
- [x] 2.3 Pass the carried prerendered surfaces into
      `src/serving/crawlerDirectory.ts`'s `publicAddresses` from
      `src/routes/sitemap.ts`, the way the site and the target are already
      passed, so neither crawler file names a store address and a card the
      catalogue gains is not listed either
      (`grade10-site-site-carried-surfaces-SC-14`,
      `grade10-site-site-carried-surfaces-SC-15`)
- [x] 2.4 Read the gate in `apps/frontend/grade10/scripts/check-public-pages.mjs`,
      which asserts a written document per prerendered surface and runs inside
      `pnpm run build`
- [x] 2.5 Verify: `pnpm run typecheck && pnpm run test`, then
      `pnpm --dir apps/frontend/grade10 run build:staging` and
      `pnpm --dir apps/frontend/grade10 run build:preview`

## 3. The chrome, the front door and the profile (grade10) (owner: @sean)

Needs group 1's landed table. Independent of group 2.

- [x] 3.1 Drop the store navigation item and the cart control where the store
      is not carried — `src/chrome/siteContent.ts` and `src/root.tsx`'s
      `cartEnabled`, so `SiteShell` gets no handler and `CartDrawerHost` never
      mounts (`grade10-site-site-carried-surfaces-SC-11`)
- [x] 3.2 Return no shop column from `src/chrome/useShopColumn.ts` where the
      store is not carried, so the collections read never runs
      (`grade10-site-site-carried-surfaces-SC-12`)
- [x] 3.3 Render neither the store button nor the store card in
      `src/pages/marketing/MarketingPage.tsx`
      (`grade10-site-site-carried-surfaces-SC-13`)
- [x] 3.4 Stop passing `onViewOrders` to the profile page where the order
      surfaces are not carried
- [x] 3.5 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test`

## 4. Proof on a built bundle (grade10) (owner: @sean)

Needs groups 1 to 3.

- [ ] 4.1 Assert no store page code and no store document reach a build made
      without the store, reading `dist/` rather than the module graph
      (`grade10-site-site-carried-surfaces-SC-02`)
- [ ] 4.2 Assert a staging build still browses, fills a basket, pays and reads
      an order back unchanged
      (`grade10-site-site-carried-surfaces-SC-16`)
- [x] 4.3 Verify: `pnpm run build`, then
      `pnpm --dir apps/frontend/grade10 run check:quality`

## 5. Manual (grade10-spec) (owner: @sean)

- [x] 5.1 Confirm `docs/prds/products/grade10-site/site/carried-surfaces.md`
      and `docs/prds/products/grade10-site/store/index.md` state what shipped,
      including the lane table
- [x] 5.2 Verify: `pnpm check:manual`
