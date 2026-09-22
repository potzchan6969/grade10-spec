## 1. Shared header contract (grade10-spec) (owner: @sean)

- [x] 1.1 Make `onProfile` optional on `SiteHeaderProps` in
      `packages/ui/src/blocks/site-chrome/site-header.tsx`; the account menu
      offers Profile only when supplied, first ahead of My Orders, and
      activating it invokes the handler
      (`shared-ui-site-chrome-SC-17`, `shared-ui-site-chrome-SC-29`,
      `shared-ui-site-chrome-SC-30`, `shared-ui-site-chrome-SC-31`,
      `shared-ui-site-chrome-SC-32`, `shared-ui-site-chrome-SC-33`)
- [x] 1.2 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test`

## 2. The gate (grade10) (owner: @sean)

Needs group 1 landed and its submodule bump in place (group 5) before the
account-menu half of this group can compile against the new prop, but the
surface-table half is independent of group 1.

- [x] 2.1 Add `"profile"` to `Gate` and a `profile:` row to `gatesFor` in
      `apps/frontend/grade10/src/surfaces.ts`, and set `gate: "profile"` on
      the `profile` entry in `SURFACES`
      (`grade10-site-site-carried-surfaces-SC-35`)
- [x] 2.2 Update every exhaustive `Gates` literal the compiler flags with a
      fifth `profile:` entry — `src/surfaces.test.ts`,
      `src/store-shut.test.tsx`, `src/serving/webManifest.test.ts`,
      `src/serving/crawlerDirectory.test.ts`, `src/serving/worker.test.ts`,
      `src/chrome/siteContent.test.ts`, `scripts/check-public-pages.mjs`
- [x] 2.3 Verify: `pnpm run typecheck && pnpm run test`

## 3. Chrome and in-app links (grade10) (owner: @sean)

Needs group 1's landed `SiteHeader` contract, reached through the submodule
bump (group 5), to compile — write these against the new optional prop.

- [x] 3.1 Gate `SiteShell.tsx`'s `onProfile` on `config.gates.profile`, the
      same shape `onMyOrders` already has
      (`grade10-site-site-page-shell-SC-17`,
      `grade10-site-site-page-shell-SC-28`,
      `grade10-site-site-page-shell-SC-29`)
- [x] 3.2 Gate the profile link/button on each of `CheckoutPage.tsx`,
      `AuctionWinnerOrderPage.tsx`, `AccountAuctionRecordPage.tsx`,
      `OrderDetailsPage.tsx` and `OrderHistoryPage.tsx` behind the same
      `carries("profile")` check `routes/profile.tsx` already uses for
      `onViewOrders`
      (`grade10-site-site-carried-surfaces-SC-34`,
      `grade10-site-site-carried-surfaces-SC-37`)
- [x] 3.3 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test`

## 4. Order history stays on its own gate (grade10) (owner: @sean)

Independent of groups 2 and 3; touches no shared code, only proof that the
existing `store` gate on `orderHistory`/`orderDetail` was left alone.

- [x] 4.1 Add a test asserting `/profile/orders` and
      `/profile/orders/:orderId` still resolve on a build that carries
      `store` but not `profile`, while `/profile` itself 404s
      (`grade10-site-site-carried-surfaces-SC-36`)
- [x] 4.2 Verify: `pnpm run test`

## 5. Submodule bump and proof on a built bundle (grade10) (owner: @sean)

Needs groups 1 through 4.

- [x] 5.1 Bump `external/grade10-spec` to the commit carrying group 1
- [x] 5.2 Verify: `pnpm run build`, then
      `pnpm --dir apps/frontend/grade10 run build:staging` and
      `pnpm --dir apps/frontend/grade10 run build:preview`, then
      `pnpm --dir apps/frontend/grade10 run check:quality`

## 6. Manual (grade10-spec) (owner: @sean)

- [x] 6.1 Take the 🚧 marks off
      `docs/prds/products/grade10-site/site/carried-surfaces.md`,
      `docs/prds/products/grade10-site/site/page-shell.md` and
      `docs/prds/products/shared/ui/site-chrome.md` once shipped, confirming
      each states the lane table and the account-menu order as they now run
- [x] 6.2 Verify: `pnpm check:manual`
