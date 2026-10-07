# Tasks

## 1. The manual (grade10-spec)

- [x] 1.1 Operator Console · Authoring a Reward, Rewards · Reward Types and Reward Shop, and Coupons · Validity and Refusals state the reward form, the currency mark and the online-only rule by product or filter, marking what this change delivers
- [x] 1.2 Verify: `pnpm check:manual`, `pnpm run tcs:validate`, `pnpm openspec validate align-reward-editor-design --strict`
- [ ] 1.3 Once groups 4, 6 and 7 are verified, take the 🚧 off Free item on Operator Console · Authoring a Reward, Online only on the menu on Rewards · Reward Shop, and Online only by scope on Coupons · Refusals

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

## 5. The walk (grade10) (owner: @ecchochan)

Uses draft `feature-tcs.md` as its input; human QA reviews cases after deployment (`/tcs-review align-reward-editor-design`), and `/tcs-run-sheet` executes manual cases when needed, and groups 3 and 4 landed.

- [x] 5.1 `rewards.spec.ts` creates a free item and reopens it, and opens and duplicates a free item stored through the admin API; at 1280px, with the basket verdict shown, the rail and the save button stay in view while the form scrolls, and at 400px the rail sits under the form, a wrapped strip fills its rows and the rewards list's title keeps its width; each width's last frame attaches to the report
- [x] 5.2 One before and after capture pass at 1280px and 400px, through `e2e-snapshot-verification`, of the reward editor (new and edit), the rewards list, the users directory with an account panel open, the diary services panel, the booking dialog with an error, product schemas, the auction listing editor, the checkout test coupon bench, and one shared console page in the ZZZ admin
- [x] 5.3 Verify: `pnpm --dir apps/frontend/grade10 run e2e -- e2e/tests/loyalty/rewards.spec.ts` passes, and the pull request's `e2e` labelled run is green

## 6. Rules built before this change (grade10)

Built before this change, bar four things: the till refusing a coupon its
scope keeps online whatever channels it names, the member's reward menu saying
so, the retired handover's note and list terms naming a handover rather than a
kind, and the rail's menu card reading a retired handover as the member's menu
does.
Each test lands first and cites its scenario; one that fails names a gap, and
its fix lands in this group.

- [ ] 6.1 The uncapped percentage case in `evaluate.test.ts` cites *A percentage coupon with no maximum takes its whole rate* (`grade10-site-loyalty-programme-SC-247`)
- [ ] 6.2 One scope rule, `tillCanMatch` in `@grade10/loyalty-contracts`, is what `rewardCouponGuard`, the console's `onlineOnly` and the till's `panelCoupon` read: `coupons.test.ts` refuses the till for a coupon scoped to named products, and one scoped to a catalog filter, each naming both channels, and accepts online and refuses the till for one scoped to named products naming the till alone; `sale.test.ts` shows each as online only on the till panel; `view.test.ts` offers staff no way to apply it; and `present.test.ts` refuses the member presenting it from their own session with `coupon_refused`, leaving the sale unchanged (`grade10-site-loyalty-programme-SC-248`)
- [ ] 6.3 `RewardEditor.test.tsx` scopes a new reward to named products, then to a catalog filter: each shows online only with In store and Both disabled, and saves online alone (`grade10-site-loyalty-programme-SC-249`)
- [ ] 6.4 `RewardEditor.test.tsx` opens a stored reward scoped to named products for both channels: Online is chosen, saving it unchanged sends online alone, and moving the scope to named variants, or to the whole order, shows both channels again (`grade10-site-loyalty-programme-SC-250`)
- [ ] 6.5 `rewardGaps.test.ts` and `RewardEditor.test.tsx` hold a save for each missing part and for a window that ends before it starts, naming it in the save bar, and save a window that starts and ends on one day (`grade10-site-loyalty-programme-SC-251`); `basketVerdict.test.ts` states each verdict from the evaluator's result (`grade10-site-loyalty-programme-SC-252`)
- [ ] 6.6 `menu.test.ts` offers a reward scoped to named products, and one scoped to a catalog filter, each stored for both channels, and one scoped to named products stored for the till alone, each with online alone in its terms, read from the same `effectiveChannels` the guard reads (`grade10-site-loyalty-programme-SC-245`)
- [ ] 6.7 `rewardCouponDraft.test.ts` opens a stored manual handover and a stored counter collection, saves each with its name changed and its handover unchanged, duplicates each into Money off, and saves each as a product coupon once Money off is chosen; `RewardEditor.test.tsx` reads the edit page's note and `rewardCopy.test.ts` the rewards list's terms as `ui-design.md`'s Copy words them, naming a handover rather than a kind (`grade10-site-loyalty-programme-SC-246`)
- [ ] 6.8 `evaluate.test.ts`'s fixed amount online, and `sale.test.ts` planning a fixed amount scoped to named variants at the till, beside the cases of 6.2, take that amount off the lines the scope matches (`grade10-site-loyalty-programme-SC-152`)
- [ ] 6.9 `RewardEditor.test.tsx` picks a variant under Free item, then chooses Money off: an amount with none entered and named variants with none picked; choosing Free item again shows no variant picked (`grade10-site-loyalty-programme-SC-253`)
- [ ] 6.10 `ReadBackRail.test.tsx` opens a stored manual handover and a stored counter collection: the menu card states no coupon limit for the first and the collection days for the second, never the form's 30-day validity, as the member's menu reads them; the sentence reads the stored handover, and the basket check asks for the coupon to be finished (`grade10-site-loyalty-programme-SC-246`)
- [ ] 6.11 Verify: `pnpm run test`, `pnpm run typecheck`, `pnpm run lint`

## 7. The walk - online only by product or filter (grade10)

Uses draft `feature-tcs.md` as its input; human QA reviews cases after deployment (`/tcs-review align-reward-editor-design`), and `/tcs-run-sheet` executes manual cases when needed, and group 6 landed.

- [ ] 7.1 `rewards.spec.ts` creates a reward scoped to named products with Both chosen first: the form shows online only, and the reopened reward and the rewards list read online only
- [ ] 7.2 `rewards.spec.ts` opens a reward stored through the admin API, scoped to named products for both channels, saves it unchanged, and reopens it online only
- [ ] 7.3 `rewards.spec.ts` stores a reward scoped to named products for both channels through the admin API, and the member's reward menu reads it `Online store only`
- [ ] 7.4 `presented-coupon.spec.ts` grants a member a coupon scoped to named products for both channels: the member presenting it from their own phone reads `This coupon cannot be used on this sale.`, and the sale's price is unchanged
- [ ] 7.5 Verify: `pnpm --dir apps/frontend/grade10 run e2e -- e2e/tests/loyalty/rewards.spec.ts e2e/tests/pos/presented-coupon.spec.ts` passes
