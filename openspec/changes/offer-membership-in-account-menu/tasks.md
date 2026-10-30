## 1. The shared header's order and its record (grade10-spec)

`SiteHeader` already draws the order; this group proves it against the
restated contract and keeps the pages in step.

- [ ] 1.1 Tests in their own commit, ticked last: on `Site/Page Shell/Blocks/SiteHeader/Auction & Store/Account menu`, `WithProfile`'s play function cites the restated fixed order and asserts every handler supplied draws Profile, Membership, My Orders, My Auctions, Sign Out and nothing else; a new `Open, without My Orders` story supplies `onProfile`, `onMembership`, `copy.membership` and `onMyAuctions` and no My Orders handler and asserts Profile, Membership, My Auctions, Sign Out; a new `Open, without Profile` story supplies `onMembership`, `copy.membership` and a My Orders handler and no `onProfile` and asserts the menu opens on Membership (`shared-ui-site-chrome-SC-53`, `shared-ui-site-chrome-SC-49`, `shared-ui-site-chrome-SC-50`)
- [ ] 1.2 Correct the `Open` story's note that no site supplies Membership - grade10 now does where it carries the membership page - with no change to `SiteHeader` or its public types (`shared-ui-site-chrome-SC-53`, `shared-ui-site-chrome-SC-49`, `shared-ui-site-chrome-SC-50`)
- [ ] 1.3 Reconcile `docs/prds/products/grade10-site/site/page-shell.md` (Account Menu) and `docs/prds/products/shared/ui/site-chrome.md` (Account Entry, Account menu stories) with the accepted deltas and the two new stories, adding no rule a requirement states; keep this change's 🚧 marks until archive
- [ ] 1.4 Verify: `pnpm --filter @grade10/ui run test:stories` with the account-menu play functions green, `pnpm --filter @grade10/ui run typecheck`, `pnpm storybook:check`, `pnpm check:manual`, `pnpm run validate:changes offer-membership-in-account-menu`

## 2. The site offers Membership (grade10)

Claimable beside group 1: the pinned `external/grade10-spec` already draws
Membership right after Profile.

- [ ] 2.1 Tests in their own commit, ticked last: in `apps/frontend/grade10/src/chrome/shell/SiteShell.test.tsx`, the menu with Store answering and both pages carried reads Profile, Membership, My Orders, My Auctions, Sign Out; Membership navigates to `ROUTES.membership`; with the account page withheld and the membership page carried it opens on Membership with no Profile; with the account page and the membership page withheld it opens on My Orders; with a loyalty programme client failing every read Membership is still offered; the item reads "Membership", 会员 and 會員 in en, zh-Hans and zh-Hant. In `apps/frontend/grade10/src/store-shut.test.tsx`, a build without Store reads Profile, Membership, My Auctions, Sign Out (`grade10-site-site-page-shell-SC-59`, `grade10-site-site-page-shell-SC-80`, `grade10-site-site-page-shell-SC-81`, `grade10-site-site-page-shell-SC-82`, `grade10-site-site-page-shell-SC-83`, `grade10-site-site-page-shell-SC-84`)
- [ ] 2.2 In `SiteShell`, supply `copy.membership` from the brand chrome catalog's `membership` and `onMembership` on `config.gates.membership`, navigating to `ROUTES.membership` - the draft on `claude/membership-account-menu` (`grade10-site-site-page-shell-SC-59`, `grade10-site-site-page-shell-SC-80`, `grade10-site-site-page-shell-SC-81`, `grade10-site-site-page-shell-SC-82`, `grade10-site-site-page-shell-SC-83`, `grade10-site-site-page-shell-SC-84`)
- [ ] 2.3 Bump `external/grade10-spec` to a store `main` that holds this change's accepted specs, so every id the tests cite resolves in the pin
- [ ] 2.4 Verify: `pnpm check:quick`, the site's typecheck against `apps/frontend/grade10/tsconfig.app.json`, `pnpm run check:submodules`, `pnpm plan validate offer-membership-in-account-menu`

## 3. The walk (grade10)

Uses draft `feature-tcs.md` as its planning input, and groups 1 and 2 landed.

- [ ] 3.1 Extend `apps/frontend/grade10/e2e/tests/auth/account-menu.spec.ts`, which walks `grade10-site-site-page-shell-US-03` on the lane's own gates, on the isolated stack: on a lane that carries the membership page, Membership comes right after Profile and ahead of My Orders, and pressing it lands on `/membership`; on a lane that withholds it, the menu offers no Membership. Kept as the change's end-to-end suite (`grade10-site-site-page-shell-US-03`)
- [ ] 3.2 Flip the cases the walk decides with `pnpm run tcs:automated <case…> --decided-by grade10:apps/frontend/grade10/e2e/tests/auth/account-menu.spec.ts`, in the walk's own commit; a case no lane can arrange - the account page withheld with the membership page carried, or the loyalty programme down - stays manual and is named in the suite
- [ ] 3.3 Verify: the walk green on the isolated stack, `pnpm run check:store-tcs`, and in the store `node scripts/openspec/validate-test-cases.mjs openspec/changes/offer-membership-in-account-menu`
