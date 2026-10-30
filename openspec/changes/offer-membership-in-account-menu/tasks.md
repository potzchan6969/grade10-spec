## 1. The site offers Membership (grade10) (owner: @seankcw)

The pinned `external/grade10-spec` already draws Membership right after
Profile, so no store work precedes it.

- [ ] 1.1 Tests in their own commit, ticked last: in `apps/frontend/grade10/src/chrome/shell/SiteShell.test.tsx`, the menu with Store answering and both pages carried reads Profile, Membership, My Orders, My Auctions, Sign Out; Membership navigates to `ROUTES.membership`; with the account page withheld and the membership page carried it opens on Membership with no Profile; with the account page and the membership page withheld it opens on My Orders; with a loyalty programme client failing every read Membership is still offered; the item reads "Membership", 会员 and 會員 in en, zh-Hans and zh-Hant. In `apps/frontend/grade10/src/store-shut.test.tsx`, a build without Store reads Profile, Membership, My Auctions, Sign Out (`grade10-site-site-page-shell-SC-59`, `grade10-site-site-page-shell-SC-80`, `grade10-site-site-page-shell-SC-81`, `grade10-site-site-page-shell-SC-82`, `grade10-site-site-page-shell-SC-83`, `grade10-site-site-page-shell-SC-84`)
- [ ] 1.2 In `SiteShell`, supply `copy.membership` from the brand chrome catalog's `membership` and `onMembership` on `config.gates.membership`, navigating to `ROUTES.membership` - the draft on `claude/membership-account-menu` (`grade10-site-site-page-shell-SC-59`, `grade10-site-site-page-shell-SC-80`, `grade10-site-site-page-shell-SC-81`, `grade10-site-site-page-shell-SC-82`, `grade10-site-site-page-shell-SC-83`, `grade10-site-site-page-shell-SC-84`)
- [ ] 1.3 Bump `external/grade10-spec` to a store `main` that holds this change's accepted specs, so every id the tests cite resolves in the pin
- [ ] 1.4 Verify: `pnpm check:quick`, the site's typecheck against `apps/frontend/grade10/tsconfig.app.json`, `pnpm run check:submodules`, `pnpm plan validate offer-membership-in-account-menu`

## 2. The walk (grade10)

Uses draft `feature-tcs.md` as its planning input, and group 1 landed.

- [ ] 2.1 Extend `apps/frontend/grade10/e2e/tests/auth/account-menu.spec.ts`, which walks `grade10-site-site-page-shell-US-03` on the lane's own gates, on the isolated stack: on a lane that carries the membership page, Membership comes right after Profile and ahead of My Orders, and pressing it lands on `/membership`; on a lane that withholds it, the menu offers no Membership. Kept as the change's end-to-end suite (`grade10-site-site-page-shell-US-03`)
- [ ] 2.2 Flip the cases the walk decides with `pnpm run tcs:automated <case…> --decided-by grade10:apps/frontend/grade10/e2e/tests/auth/account-menu.spec.ts`, in the walk's own commit; a case no lane can arrange - the account page withheld with the membership page carried, or the loyalty programme down - stays manual and is named in the suite
- [ ] 2.3 Verify: the walk green on the isolated stack, `pnpm run check:store-tcs`, and in the store `node scripts/openspec/validate-test-cases.mjs openspec/changes/offer-membership-in-account-menu`
