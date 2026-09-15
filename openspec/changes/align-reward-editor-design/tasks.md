# Tasks

## 1. The manual (grade10-spec)

- [x] 1.1 Rewards · Reward Catalog marks the free item this change delivers
- [x] 1.2 Verify: `pnpm check:manual`, `pnpm run tcs:validate`, `pnpm openspec validate align-reward-editor-design --strict`

## 2. Console words (grade10)

- [x] 2.1 The branch sits on a main whose frontend lane is green
- [x] 2.2 Short choices across the admin are segmented controls with a visible label, kind choices can be cards, and each still announces one checked radio by name
- [x] 2.3 Money fields show the currency before the amount, with the same accessible name
- [x] 2.4 Page titles are the page's top heading and panel titles sit under them; rails stack under the form on a narrow screen
- [x] 2.5 A notice can carry a detail line, a section can fold, text can read as success, semibold or caps, and a page title can carry a back link
- [x] 2.6 Verify: `pnpm run test`, `pnpm run check:libs`, `pnpm run typecheck`, `pnpm run lint`

## 3. Grade10 admin theme (grade10)

Runs beside group 2.

- [x] 3.1 Every Grade10 colour token resolves to a colour, and the theme test fails on one that does not
- [x] 3.2 Grade10 admin pages take the type, heading sizes, radii, tints and segmented look in `ui-design.md`, with no colour literal in a console word
- [x] 3.3 Verify: `pnpm run test frontend-admin-theme @grade10/admin zzz-admin`, `pnpm run check:libs`, `pnpm run typecheck`

## 4. Reward editor (grade10)

Needs group 2.

- [x] 4.1 An operator chooses Money off, Free item or Gift with a purchase from cards, and a stored reward reopens on the right card, so *A free item is created from one variant* (`grade10-site-loyalty-programme-SC-187`), *A stored free item reopens as a free item* (`SC-188`) and *A capped or wider 100% discount stays money off* (`SC-189`) pass in `rewardCouponDraft.test.ts`, beside `SC-158`
- [x] 4.2 The rail shows the menu card with its Redeem pill, the sentence with bold values, and a folding basket check whose verdicts read as `ui-design.md` tables them
- [x] 4.3 The page has a back link, the mock's words and units, and a save bar pinned to the bottom
- [x] 4.4 Verify: `pnpm run test`, `pnpm run check:libs`, `pnpm run typecheck`, `pnpm run lint`

## 5. End to end (grade10)

Needs groups 3 and 4.

- [x] 5.1 `rewards.spec.ts` creates a free item and reopens it, and opens and duplicates a free item stored through the admin API; at 1280px, with the basket verdict shown, the rail and the save button stay in view while the form scrolls, and at 400px the rail sits under the form, a wrapped strip fills its rows and the rewards list's title keeps its width; each width's last frame attaches to the report
- [ ] 5.2 One before and after capture pass at 1280px and 400px, through `e2e-snapshot-verification`, of the reward editor (new and edit), the rewards list, the users directory with an account panel open, the diary services panel, the booking dialog with an error, product schemas, the auction listing editor, the checkout test coupon bench, and one shared console page in the ZZZ admin
- [ ] 5.3 Verify: `pnpm --dir apps/frontend/grade10 run e2e -- e2e/tests/loyalty/rewards.spec.ts` passes, and the pull request's `e2e` labelled run is green
