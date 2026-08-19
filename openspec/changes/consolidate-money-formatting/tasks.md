## 1. The shared money module (grade10) (owner: @sean)

- [x] 1.1 Add `packages/utils/src/money.ts` with the ISO 4217 exponent table moved from `packages/shopify/backend/src/money/minorUnits.ts` and a `currencyExponent` lookup that throws naming the code and the platform's money handling, satisfying "An unrecognized currency stops the operation" for all three scenarios; register the `./money` subpath in `packages/utils/package.json`.
- [x] 1.2 Add `toMinorUnits` and `fromMinorUnits` as string-exact conversions driven by that table, satisfying "An amount converts by its own currency's exponent" for "A decimal amount from an external system" and "A decimal amount too precise for its currency"; move `packages/shopify/backend/test/money/minorUnits.test.ts` in with them, renaming the inverse.
- [x] 1.3 Add `formatMoney(minor, code, { locale, currencyDisplay })`, taking fraction digits and the divisor from the same table and memoizing formatters on locale, currency and display, satisfying "A two-decimal currency", "A currency with no minor unit" and "A three-decimal currency", plus the shape halves of "An operator sees the currency code" and "A collector reads their own locale".
- [x] 1.4 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test` for the `@grade10/utils` suite.

## 2. The payment integration (grade10) (owner: @sean)

- [x] 2.1 Repoint `packages/shopify/backend/src/{wire/mappers,admin/createShopifyAdmin,webhooks/payloads}.ts` at `@grade10/utils/money`, delete `packages/shopify/backend/src/money/`, and drop its entry from the package barrel, satisfying "The error does not name one integration".
- [x] 2.2 Repoint `packages/shopify/demo/src/useCases/{browseCatalog,moneyMath}.tsx` and `moneyMath.test.tsx` at `@grade10/utils/money`, keeping the use case's prose accurate to the exports it now names.
- [x] 2.3 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`, and the shopify demo suite.

## 3. Auction messages (grade10) (owner: @sean)

- [ ] 3.1 Render the amounts in `packages/grade10-auction/backend/src/email/render.tsx` with `formatMoney` at `locale: "en"`, satisfying "An auction email".
- [ ] 3.2 Delete `formatMinorAmount` and its formatter cache from `packages/grade10-auction/backend/src/amounts.ts`, leaving `isMinorAmount` and its callers in `bidding/placeBid.ts` and `auctionItems/schedule.ts` untouched.
- [ ] 3.3 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`.

## 4. Collector-facing surfaces (grade10)

- [ ] 4.1 Repoint `apps/frontend/grade10/src/pages/{store/StorePage,auctions/AuctionsPage}.tsx` at `formatMoney` with the default symbol shape, delete `apps/frontend/grade10/src/money.ts`, and add `@grade10/utils` to the app's `package.json`, satisfying "Two collector surfaces agree" and "A collector reads their own locale".
- [ ] 4.2 Repoint the four `packages/grade10-store/demo/src/useCases/*.tsx` and four `packages/grade10-auction/demo/src/useCases/*.tsx` call sites at `formatMoney` with an explicit `locale` so their assertions stay deterministic, delete both local `money.ts` files, and add `@grade10/utils` to the auction demo's `package.json`.
- [ ] 4.3 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`.

## 5. Operator-facing surfaces (grade10)

- [ ] 5.1 Render money in `apps/admin/grade10/src/pages/{auction/parts,store/OrdersTable,members/MemberLedgerTable}.tsx` with `formatMoney` at `currencyDisplay: "code"`, removing each local formatter and adding `@grade10/utils` to the panel's `package.json`, satisfying "An operator sees the currency code" and "Two operator tables agree".
- [ ] 5.2 Do the same for `apps/admin/zzz/src/pages/store/OrdersTable.tsx`, so both panels read one module.
- [ ] 5.3 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test`.

## 6. Keeping it consolidated (grade10)

This group's check fails until groups 1 through 5 have landed their deletions.

- [ ] 6.1 Add a script in the `scripts/lib/` family, wired into `pnpm run check:libs`, that fails when `style: "currency"` or a minor-unit division appears outside `packages/utils/src/money.ts`, and name the money module in `docs/conventions/code-layout.md` as the one place either belongs.
- [ ] 6.2 Update `docs/architecture/handbook.html` for the `@grade10/utils/money` subpath and the surface Shopify no longer publishes.
- [ ] 6.3 Run `pnpm run check:libs`, `pnpm run check:handbook`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`, and `pnpm run build`.
