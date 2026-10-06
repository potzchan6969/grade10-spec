## 1. SiteHeader's closed item set (grade10-spec)

- [ ] 1.1 Tests first, in their own commit: a type test beside
      `packages/ui/src/blocks/site-chrome/site-header.tsx` asserting with
      `expectTypeOf` that `SiteHeaderProps` has no `onOrders` and
      `SiteHeaderCopy` no `orders` (`shared-ui-site-chrome-SC-41`)
- [ ] 1.2 Remove `onOrders` and `copy.orders` from `SiteHeaderProps` and
      `SiteHeaderCopy`, with their render path and the docstring's Orders
      sentence (`shared-ui-site-chrome-SC-17`,
      `shared-ui-site-chrome-SC-41`). The commit stops at the Design Override
      hook; it changes no drawn state, so show the person
      its lines and add the trailer only on their yes
- [ ] 1.3 Waits on Q7. In the account-menu story Q7 settles, with every
      handler supplied, assert in its play that the menu lists Profile, My
      Orders, My Auctions, Membership, then Sign Out, and nothing else
      (`shared-ui-site-chrome-SC-17`)
- [ ] 1.4 Page Shell · Account Menu: write Q1's answer over the ❓ Profile
      line and its decisions row - unmarked on "wherever carried", which
      already runs; 🚧 on "never", which group 3 delivers - and take
      `page_waived` off `.openspec.yaml`
- [ ] 1.5 Verify: `pnpm --filter @grade10/ui run typecheck`,
      `pnpm --filter @grade10/ui exec vitest run --project storybook src/blocks/site-chrome`,
      `pnpm check:manual` and `pnpm run lint`

## 2. Account-menu tests (grade10)

The settled scope already runs, so this group is its tests alone, in one
commit; each passes on arrival and fails if a handler leaves its gate. Every
account-menu citation moves off the retired ids, per `tech-design.md` § The
Menu Requirement Is Replaced.

- [ ] 2.1 Rewrite the signed-in menu test in
      `apps/frontend/grade10/src/chrome/SiteShell.test.tsx` to assert My
      Orders immediately before My Auctions, Sign Out last and reading
      "Sign Out", and no KYC or My Auction Orders, with no Profile
      assertion; its Profile click moves to group 3
      (`grade10-site-site-page-shell-SC-54`, `grade10-site-site-page-shell-SC-60`)
- [ ] 2.2 Add `membership` to the test's `gateState` and assert each
      withheld page: `store` shut gives no My Orders and Sign Out last;
      `profile` shut with `store` open opens on My Orders with no Profile;
      `membership` shut with `store` open gives no Membership; all three
      shut give exactly My Auctions then Sign Out. In
      `src/store-shut.test.tsx`, drop the Profile assertion from the
      no-My-Orders test
      (`grade10-site-site-page-shell-SC-56`, `grade10-site-site-page-shell-SC-57`,
      `grade10-site-site-page-shell-SC-61`, `grade10-site-site-page-shell-SC-58`)
- [ ] 2.3 Destinations in `SiteShell.test.tsx`: cite the My Orders
      (`ROUTES.orderHistory`) and My Auctions (`ROUTES.auctionWatchlist`)
      tests and delete the duplicate My Orders test that cites a retired
      case id; add one where activating Sign Out in the menu runs sign-out
      (`grade10-site-site-page-shell-SC-62`, `grade10-site-site-page-shell-SC-63`,
      `grade10-site-site-page-shell-SC-55`)
- [ ] 2.4 Move the sign-in email tests in `SiteShell.test.tsx` and
      `src/chrome/navigation.test.tsx` from `grade10-site-site-page-shell-SC-17`
      to their own scenario, and delete the label-fallback test: a signed-in
      session always carries an email, and the fallback is `SiteHeader`'s
      (`grade10-site-site-page-shell-SC-59`)
- [ ] 2.5 Cite the account page's Sign Out test in
      `src/pages/profile/ProfilePage.test.tsx`
      (`grade10-site-site-page-shell-SC-08`)
- [ ] 2.6 Verify: `pnpm --dir apps/frontend/grade10 run typecheck && pnpm --dir apps/frontend/grade10 run test`

## 3. Profile by Q1 (grade10)

Waits on Q1 and the scenario its row adds; `tech-design.md` § Profile
Follows Q1 holds both rows.

- [ ] 3.1 Tests first, in their own commit, citing the scenarios Q1's row
      adds: on "wherever carried", Profile first with `profile` open and
      its click opening `ROUTES.profile`; on "never", no Profile with
      `profile` open, in `SiteShell.test.tsx` and `src/store-shut.test.tsx`
- [ ] 3.2 On "never", delete the `onProfile` prop at
      `src/chrome/SiteShell.tsx:156-158`; on "wherever carried", no code
- [ ] 3.3 Verify: `pnpm --dir apps/frontend/grade10 run typecheck && pnpm --dir apps/frontend/grade10 run test`

## 4. The walk (grade10)

Uses draft `feature-tcs.md` as its input once groups 1 to 3 have landed.
Human QA reviews the cases after deployment with
`/tcs-review omit-profile-account-menu`, and `/tcs-run-sheet` runs the
manual ones. `grade10-site-auction-auction-orders-US-01` moves no behaviour
here, so its walk stays with its own suite.

- [ ] 4.1 Export the lane's deploy env from `apps/frontend/grade10/e2e/helpers/env.ts`
      beside the origins, set by `e2e/run.sh` and each hosted lane's env
      module, so a walk reads its gates from `gatesFor`
- [ ] 4.2 Add `e2e/tests/auth/account-menu.spec.ts`, walking
      `grade10-site-site-page-shell-US-03` on the lane's gates: signed out,
      Sign In leads to sign-in; signed in on a Store lane, My Orders comes
      immediately before My Auctions, Sign Out is last, no My Auction
      Orders item shows, My Orders opens `/profile/orders`, the account page
      offers Sign Out, and Sign Out in the menu signs out; on a lane
      withholding Store, the account page and the membership page, the menu
      is exactly My Auctions then Sign Out. Kept as the change's end-to-end
      suite
- [ ] 4.3 Flip the cases the walk decides with
      `pnpm run tcs:automated <case…> --decided-by grade10:apps/frontend/grade10/e2e/tests/auth/account-menu.spec.ts`,
      in the walk's own commit; the ones that stay manual are named in the
      suite and in the walk's `rounds.md` row
- [ ] 4.4 Verify: `pnpm --dir apps/frontend/grade10 run typecheck`,
      `pnpm --dir apps/frontend/grade10 run e2e` and
      `pnpm --dir apps/frontend/grade10 run e2e:uat` green
