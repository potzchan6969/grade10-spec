## 1. SiteHeader's closed item set (grade10-spec)

- [ ] 1.1 Tests first, in their own commit: a type test beside
      `packages/ui/src/blocks/site-chrome/site-header.tsx` asserting with
      `expectTypeOf` that `SiteHeaderProps` has no `onOrders` and
      `SiteHeaderCopy` no `orders` (`shared-ui-site-chrome-SC-42`); and a
      play in an account-menu story that clicks My Orders and asserts
      `onMyOrders` is invoked once and no other handler is
      (`shared-ui-site-chrome-SC-43`)
- [ ] 1.2 Remove `onOrders` and `copy.orders` from `SiteHeaderProps` and
      `SiteHeaderCopy`, with their render path and the docstring's Orders
      sentence (`shared-ui-site-chrome-SC-17`,
      `shared-ui-site-chrome-SC-42`). The commit stops at the Design Override
      hook; it changes no drawn state, so show the person
      its lines and add the trailer only on their yes
- [ ] 1.3 In `site-header.auction-store.account.stories.tsx`, restore
      `WithProfile` with every handler supplied and assert in its play that
      the menu lists Profile, My Orders, My Auctions, Membership, then Sign
      Out, and nothing else (`shared-ui-site-chrome-SC-17`), and take over
      the Membership click from `Open` (`shared-ui-site-chrome-SC-39`); in
      `Open`, supply no `onMembership` and assert My Orders, My Auctions,
      then Sign Out, with the avatar before the email
      (`shared-ui-site-chrome-SC-34`); add
      `WithoutEmail`, with no `accountEmail`, asserting
      `copy.accountMenuLabel` shows and no avatar does
      (`shared-ui-site-chrome-SC-35`). The commit stops at the Design
      Override hook like 1.2
- [ ] 1.4 Verify: `pnpm --filter @grade10/ui run typecheck`,
      `pnpm --filter @grade10/ui exec vitest run --project storybook src/blocks/site-chrome`,
      `pnpm check:manual` and `pnpm run lint`

## 2. Account-menu tests (grade10)

The settled scope already runs, so this group is its tests alone, in one
commit; each passes on arrival and fails if a handler leaves its gate. Every
account-menu citation moves off the retired ids, per `tech-design.md` § The
Menu Requirement Is Replaced.

- [ ] 2.1 Split the signed-in menu test in
      `apps/frontend/grade10/src/chrome/SiteShell.test.tsx`: one test
      asserts My Orders immediately before My Auctions, Sign Out last and
      reading "Sign Out", and no KYC or My Auction Orders
      (`grade10-site-site-page-shell-SC-56`, `grade10-site-site-page-shell-SC-62`);
      with `profile` open, the other asserts Profile is the first item and
      its click opens `ROUTES.profile`
      (`grade10-site-site-page-shell-SC-66`, `grade10-site-site-page-shell-SC-67`)
- [ ] 2.2 Add `membership` to the test's `gateState` and assert each
      withheld page: `store` shut gives no My Orders and Sign Out last;
      `profile` shut with `store` open opens on My Orders with no Profile;
      `membership` shut with `store` open gives no Membership; all three
      shut give exactly My Auctions then Sign Out. In
      `src/store-shut.test.tsx`, where `profile` is open and `store` shut,
      the no-My-Orders test asserts Profile, My Auctions, then Sign Out
      (`grade10-site-site-page-shell-SC-58`, `grade10-site-site-page-shell-SC-59`,
      `grade10-site-site-page-shell-SC-63`, `grade10-site-site-page-shell-SC-60`,
      `grade10-site-site-page-shell-SC-66`)
- [ ] 2.3 Destinations in `SiteShell.test.tsx`: cite the My Orders
      (`ROUTES.orderHistory`) and My Auctions (`ROUTES.auctionWatchlist`)
      tests and delete the duplicate My Orders test that cites a retired
      case id; add one where activating Sign Out in the menu runs sign-out
      (`grade10-site-site-page-shell-SC-64`, `grade10-site-site-page-shell-SC-65`,
      `grade10-site-site-page-shell-SC-57`)
- [ ] 2.4 Move the sign-in email tests in `SiteShell.test.tsx` and
      `src/chrome/navigation.test.tsx` from `grade10-site-site-page-shell-SC-17`
      to their own scenario, and delete the label-fallback test: a signed-in
      session always carries an email, and the fallback is `SiteHeader`'s
      (`grade10-site-site-page-shell-SC-61`)
- [ ] 2.5 Cite the account page's Sign Out test in
      `src/pages/profile/ProfilePage.test.tsx`
      (`grade10-site-site-page-shell-SC-08`)
- [ ] 2.6 Verify: `pnpm --dir apps/frontend/grade10 run typecheck && pnpm --dir apps/frontend/grade10 run test`

## 3. The walk (grade10)

Uses draft `feature-tcs.md` as its input once groups 1 and 2 have landed.
`grade10-site-auction-auction-orders-US-01` moves no behaviour
here, so its walk stays with its own suite.

- [ ] 3.1 Export the lane's deploy env from `apps/frontend/grade10/e2e/helpers/env.ts`
      beside the origins, set by `e2e/run.sh` and each hosted lane's env
      module, so a walk reads its gates from `gatesFor`
- [ ] 3.2 Add `e2e/tests/auth/account-menu.spec.ts`, walking
      `grade10-site-site-page-shell-US-03` on the lane's gates: signed out,
      Sign In leads to sign-in; signed in on a Store lane, My Orders comes
      immediately before My Auctions, Sign Out is last, no My Auction
      Orders item shows, Profile is first and opens the account page where
      the lane carries it, My Orders opens `/profile/orders`, the account
      page offers Sign Out, and Sign Out in the menu signs out; on a lane
      withholding Store, the account page and the membership page, the menu
      is exactly My Auctions then Sign Out. Kept as the change's end-to-end
      suite
- [ ] 3.3 Flip the cases the walk decides with
      `pnpm run tcs:automated <case…> --decided-by grade10:apps/frontend/grade10/e2e/tests/auth/account-menu.spec.ts`,
      in the walk's own commit; the ones that stay manual are named in the
      suite and in the walk's `rounds.md` row
- [ ] 3.4 Verify: `pnpm --dir apps/frontend/grade10 run typecheck`,
      `pnpm --dir apps/frontend/grade10 run e2e` and
      `pnpm --dir apps/frontend/grade10 run e2e:uat` green
