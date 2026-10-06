## 1. Store-cart empty state and contents (grade10-spec)

The block already renders this contract (commit `2c2a019a7`); this group adds
the evidence and fixes only what a test exposes.

- [ ] 1.1 Write the tests in their own commit, before any code: in `packages/ui/src/index.test.ts`, the store-cart export set exactly, the absent slot exports, and type assertions on both copy types; in the `CartDrawer` and `CartDrawerBody` stories, play functions on `Default`, `OverflowItems`, `EmptyState` and `Empty`, plus new stories `EmptyStateWithoutDescription`, `LoadingWithLines` with an applied promo, `LoadingNoLines` with `loading` as an arg the Controls panel can turn off, `OnlyDelistedLines`, opened by an Open Cart button as `UnavailableItemsRemoved` is, whose every line turns `unavailable` after the open read, and `OnlySoldOutLines`, whose every line is `soldOut`. Read empty-state parts through their `data-slot` attributes. Ticked last (`shared-ui-store-cart-SC-01`, `shared-ui-store-cart-SC-08`, `shared-ui-store-cart-SC-22`, `shared-ui-store-cart-SC-23`, `shared-ui-store-cart-SC-24`, `shared-ui-store-cart-SC-25`, `shared-ui-store-cart-SC-40`, `shared-ui-store-cart-SC-41`, `shared-ui-store-cart-SC-42`, `shared-ui-store-cart-SC-43`, `shared-ui-store-cart-SC-44`, `shared-ui-store-cart-SC-45`)
- [ ] 1.2 Make the export contract pass: the public entry exports exactly the named store-cart components and types, no slot export, and `emptyTitle` required with `emptyDescription` optional on `CartDrawerCopy` and `CartDrawerBodyProps` (`shared-ui-store-cart-SC-01`, `shared-ui-store-cart-SC-22`, `shared-ui-store-cart-SC-43`)
- [ ] 1.3 Make the contents and empty state pass: only the cart's lines, scrolling past the body, and on an empty cart a cart icon, the title, the description where supplied, no action, no count badge and no footer, in the drawer and in the body alone; a cart of only sold-out lines lists them with the footer and no count badge (`shared-ui-store-cart-SC-23`, `shared-ui-store-cart-SC-24`, `shared-ui-store-cart-SC-25`, `shared-ui-store-cart-SC-41`, `shared-ui-store-cart-SC-44`, `shared-ui-store-cart-SC-45`)
- [ ] 1.4 Make loading and delisted cleanup pass: skeletons and a disabled Checkout for a cart with lines, a blank body, a badge skeleton and no footer for a cart with none, and a cart of only delisted lines ending on the empty state with one toast (`shared-ui-store-cart-SC-08`, `shared-ui-store-cart-SC-40`, `shared-ui-store-cart-SC-42`)
- [ ] 1.5 On the Cart Drawer page, once 1.1 has created the stories: replace the `store-cart-cartdrawer--fetching-on-open` embed with `store-cart-cartdrawer--loading-with-lines`, and embed `store-cart-cartdrawer--loading-no-lines` beside the Not read yet line; `pnpm check:manual --pages` passes
- [ ] 1.6 Verify: `pnpm run test:stories:ui`, `pnpm --filter @grade10/ui exec vitest run --project audit`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run validate:changes cart-drawer-empty-state`, `pnpm openspec validate cart-drawer-empty-state --strict`, `pnpm run tcs:validate openspec/changes/cart-drawer-empty-state/specs/shared/ui/store-cart/feature-tcs.md` and `pnpm check:manual`

## 2. Grade10 cart tests and the unread-cart fix (grade10)

The pinned store commit already carries the block, so no submodule bump. The
host's one change is its `loading`, which a failed review ends over a basket it
never read (`apps/frontend/grade10/src/chrome/CartDrawerHost.tsx:593`,
`:616-617`); the open handler refetches the review after a failed basket read
(`:409-414`), so the defect needs both reads to fail.

- [ ] 2.1 In `apps/frontend/grade10/src/chrome/CartDrawer.test.tsx`, in their own commit before the fix: re-cite the tests at `:920`, `:938` and `:955` from the retired five-row scenarios to the ones that replace them, drop every query for `Add more items to cart` (also in the test at `:622`), add two tests for a first open of a basket never read, each expecting the drawer still loading with no empty state and no footer: one that fails both `getCart` and `reviewCart`, which fails before 2.2, and one whose `getCart` never answers; and have the test at `:748`, whose first basket read fails, expect no empty state too. Ticked last (`shared-ui-store-cart-SC-08`, `shared-ui-store-cart-SC-23`, `shared-ui-store-cart-SC-24`, `shared-ui-store-cart-SC-25`, `shared-ui-store-cart-SC-48`)
- [ ] 2.2 Make the host hold `loading` until the basket is read: `loading = !basket.hasData || (!reviewUnchecked && (isOpening || !review.hasData))` in `CartDrawerHost.tsx`, so a failed review over a read basket still shows its lines unchecked; the host passes catalog `emptyTitle` and `emptyDescription` and the reviewed lines only (`shared-ui-store-cart-SC-23`, `shared-ui-store-cart-SC-24`, `shared-ui-store-cart-SC-25`, `shared-ui-store-cart-SC-48`)
- [ ] 2.3 Verify: the focused `CartDrawer.test.tsx` run, `pnpm run typecheck` and `pnpm run lint`; do not run `pnpm run test:backend`, since the group adds no backend files

## 3. The walk (grade10)

Uses draft `feature-tcs.md` as its input, after groups 1 and 2 land; human QA
reviews cases after deployment (`/tcs-review cart-drawer-empty-state`), and
`/tcs-run-sheet` executes manual cases when needed. It walks the journeys this
change's scenarios serve; the drawer's other journeys keep their own walks.

- [ ] 3.1 In `apps/frontend/grade10/e2e/tests/store/cart-drawer.spec.ts`, walk as a signed-in shopper on the Store: open an empty cart and meet the empty state with no action, count badge or footer; add one product and meet only its line; open a cart and meet skeletons before current prices; open a cart whose only line the review answers `unavailable`, using a response fixture as `cart-count.spec.ts` does, and meet one toast and the empty state. Kept as the change's end-to-end suite (`shared-ui-store-cart-US-02`, `shared-ui-store-cart-US-03`, `shared-ui-store-cart-US-06`)
- [ ] 3.2 Flip the cases the walk decides with `pnpm run tcs:automated <case…> --decided-by grade10:apps/frontend/grade10/e2e/tests/store/cart-drawer.spec.ts`, in the walk's own commit; name the cases that stay manual in the suite and in the walk's `rounds.md` row
- [ ] 3.3 Verify: the walk passes against the local stack from `docs/conventions/development.md`, and `pnpm run tcs:validate` passes in grade10-spec
