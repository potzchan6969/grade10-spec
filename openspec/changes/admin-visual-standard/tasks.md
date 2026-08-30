# Tasks — admin-visual-standard

Every group is in the `grade10` clone. Nothing here is work in grade10-spec:
no design-system component, variant, or token changes, so there is no
submodule bump and no grade10-spec group.

## 1. The runtime, the theme, and the stylesheets land (grade10) (owner: @sean)

Unblocked: `admin-console-blocks` archived as
`2026-08-29-admin-console-blocks`, so the markup this change migrates has
stopped moving and the submodule bump it depended on has landed.

- [x] 1.1 Add `@astryxdesign/core` and `@astryxdesign/theme-neutral` at exact `0.5.0` to both admin applications, no caret, leaving `tools/openspec-viewer` on its own workspace and version, so `visual-standard-SC-09` has a version it can hold
- [x] 1.2 Add `packages/admin-theme` exporting `grade10AdminTheme` via `defineTheme`, carrying the `themes/grade10.css` values as its literal input, with a test asserting each mapped token still resolves to the brand value it came from
- [x] 1.3 Import `reset.css`, `astryx.css`, and the theme sheet after the design-system imports in both `src/index.css`, so the single `--radius-full` overlap resolves to Astryx, and re-run the collision probe against `0.5.0` to confirm no other name is declared by both
- [x] 1.4 Render `<Theme>` at both application roots — `grade10AdminTheme` in the grade10 app, Astryx's base theme in zzz — so the two brands differ only by the applied theme (`visual-standard-SC-04`, `visual-standard-SC-05`)
- [x] 1.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`

## 2. The shared two-factor surface proves the palette (grade10) (owner: @sean)

Needs group 1 landed: the theme has to be applied before the block can be read against it.

- [x] 2.1 Move both applications' `pages/security/TwoFactorPage.tsx` onto Astryx for everything around the block, leaving `TwoFactorVerifyForm` and `TwoFactorEnrollment` imported unchanged from `@grade10/ui`, so one definition still serves the admin and the storefront (`visual-standard-SC-03`)
- [x] 2.2 Move `packages/grade10-auth/admin-frontend`'s `EnrollTwoFactor` view onto Astryx around its unchanged `@grade10/ui` block and `parseTotpUri` import (`visual-standard-SC-03`)
- [x] 2.3 Read the two-factor page beside a migrated console page in both brands; where the block reads as foreign, correct `grade10AdminTheme` rather than the block, keeping `visual-standard-SC-03` true by palette and not by a fork
- [x] 2.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 3. The console blocks change vocabulary (grade10) (owner: @sean)

Needs group 2 landed: the theme is settled before the blocks are rebuilt on it.

- [x] 3.1 Rebuild `Table`, `Row`, `Cell`, `At`, `Money`, and `Status` on Astryx's `Table` and `Text`, exports and props unchanged, keeping the three distinguishable async states with refusal in the error tone (`visual-standard-SC-06`) and the ISO 4217 code on tabular amounts
- [x] 3.2 Rebuild `SectionHeader`, `StatusBadge`, `Figure`, and `OperatorIdentity` on Astryx's `Heading`, `Text`, `Badge`, and layout exports, props unchanged (`visual-standard-SC-01`)
- [x] 3.3 Rebuild `FormDialog` on Astryx's `Dialog`, keeping the confirmation a rendered dialog with the platform's own confirm uninvoked and cancel reporting nothing (`visual-standard-SC-08`)
- [x] 3.4 Rebuild `CursorPager` on Astryx's `Pagination`, keeping the way on and the way back on a queue longer than its page
- [x] 3.5 Rebuild `UserTable` and the three user-directory dialogs on the package's own furniture, keeping `user-directory-SC-01` through `user-directory-SC-10` passing from their existing tests
- [x] 3.6 Move each block test's design-system class and structure assertions onto the operator-visible fact the scenario names — tone, role, announced state — so the suites prove `visual-standard-SC-06` rather than a markup shape
- [x] 3.7 Drop `@grade10/design-system` from the console package's dependencies and its `@source` entry from both applications' `index.css`, proving no block reaches a second vocabulary (`visual-standard-SC-01`)
- [x] 3.8 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 4. Audit, store, and auth consoles migrate (grade10) (owner: @sean)

Needs group 3 landed. Groups 4 through 7 are independent of each other.

- [x] 4.1 Move `packages/audit/admin-frontend`'s trail section onto the blocks and Astryx wherever it reaches a primitive directly (`visual-standard-SC-01`, `visual-standard-SC-06`)
- [x] 4.2 Move `packages/grade10-store/admin-frontend`'s order and till views onto the blocks and Astryx (`visual-standard-SC-01`, `visual-standard-SC-06`)
- [x] 4.3 Move the rest of `packages/grade10-auth/admin-frontend` onto the blocks and Astryx, leaving the two-factor feature as group 2 left it (`visual-standard-SC-01`)
- [x] 4.4 Drop the three packages' `@source` entries from both applications' `index.css` and their `@grade10/design-system` dependencies
- [x] 4.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 5. Loyalty and appointment consoles migrate (grade10) (owner: @sean)

Needs group 3 landed.

- [x] 5.1 Move `packages/loyalty/admin-frontend`'s programme surfaces onto the blocks and Astryx, keeping amounts naming their ISO 4217 code (`visual-standard-SC-01`, `visual-standard-SC-06`)
- [x] 5.2 Move `packages/appointment/admin-frontend`'s diary panels onto the blocks and Astryx (`visual-standard-SC-01`, `visual-standard-SC-06`)
- [x] 5.3 Drop both packages' `@source` entries and `@grade10/design-system` dependencies
- [x] 5.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 6. Vault console migrates (grade10) (owner: @sean)

Needs group 3 landed.

- [x] 6.1 Move `packages/vault/admin-frontend`'s custody panels — case queue, timeline, payouts, documents — onto the blocks and Astryx (`visual-standard-SC-01`, `visual-standard-SC-06`)
- [x] 6.2 Move the custody surfaces' panel switches onto Astryx's `TabList` and their row filters onto `SegmentedControl`, keeping the panel announced as tabs and the selected filter option announced (`visual-standard-SC-07`)
- [x] 6.3 Drop the package's `@source` entry and `@grade10/design-system` dependency
- [x] 6.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 7. Auction console migrates (grade10) (owner: @sean)

Needs group 3 landed.

- [x] 7.1 Move `packages/grade10-auction/admin-frontend`'s catalog and post-sale panels onto the blocks and Astryx (`visual-standard-SC-01`, `visual-standard-SC-06`)
- [x] 7.2 Keep the post-sale confirmations on the package's `FormDialog` through the swap, with the platform's native confirm still uninvoked (`visual-standard-SC-08`)
- [x] 7.3 Move the bidders and fulfillment filters onto Astryx's `SegmentedControl` with the selected option announced, and the bidders queue's pager onto the rebuilt `CursorPager` (`visual-standard-SC-07`)
- [x] 7.4 Drop the package's `@source` entry and `@grade10/design-system` dependency
- [x] 7.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 8. Both application shells migrate (grade10) (owner: @sean)

Needs groups 4 through 7 landed: the pages compose migrated consoles before the shell around them changes.

- [x] 8.1 Move the grade10 admin shell onto Astryx's `AppShell` and `SideNav`, entries and order unchanged, with its operator identity strip on the rebuilt `OperatorIdentity` (`visual-standard-SC-01`)
- [x] 8.2 Move the grade10 admin's 23 pages onto the blocks and Astryx, including the dashboard's refused read in the error tone (`visual-standard-SC-06`), panel switches on `TabList` and window filters on `SegmentedControl` (`visual-standard-SC-07`), and the settings deactivation on `FormDialog` (`visual-standard-SC-08`)
- [x] 8.3 Apply the same moves to the zzz admin shell and its 9 pages, including its dashboard's error tone (`visual-standard-SC-06`)
- [x] 8.4 Add each control that Astryx has no counterpart for to the console package, composed from Astryx, so no page reaches outside the vocabulary for it (`visual-standard-SC-02`)
- [x] 8.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`

## 9. The standard is closed and held (grade10)

- [ ] 9.1 Narrow both `index.css` files to the design-system and `packages/ui` `@source` entries the two-factor block still needs, and confirm no other admin source is listed
- [ ] 9.2 Add the lint rule allowing `@astryxdesign/*` imports only from `packages/frontend-console/src` and the two application roots, so no admin surface takes a dependency the revert route cannot undo (`visual-standard-SC-10`)
- [ ] 9.3 Record the vocabulary, the pin, the theme mechanism, and the revert route in `docs/conventions/code-layout.md` and `docs/architecture/multi-product.md`, and run `pnpm run check:handbook` for the reshaped console package surface
- [ ] 9.4 Confirm no admin surface renders a design-system component outside the two-factor block, closing `visual-standard-SC-01`
- [ ] 9.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`
