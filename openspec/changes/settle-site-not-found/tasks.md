# Tasks

Group 1 lands first — every other group needs the submodule pin it moves.
Groups 2 and 3 are then independent of each other and claimable in parallel.
`tech-design.md` has the full account of what changed where and why; read it
before claiming a group.

## 1. Submodule pin (grade10) (owner: @sean)

- [x] 1.1 Bump the `external/grade10-spec` submodule pin to a commit at or
      after `4818e80e4`, in its own commit — this carries the static
      `notFound` catalogs and the `Pages/Not Found` Storybook assembly
      already shipped in grade10-spec.
- [x] 1.2 Verify: `pnpm run typecheck`, `pnpm run build`

## 2. grade10-site not-found (grade10) (owner: @sean)

Needs group 1.

- [x] 2.1 Add or update the tests naming `grade10-site-site-navigation-SC-03`
      and `grade10-site-site-navigation-SC-26` for this app, in their own
      commit: the not-found surface renders its static title and description
      with the failed address appearing nowhere on the page, and Back to
      Home returns to the brand home.
- [x] 2.2 Drop the `pathname` prop from
      `apps/frontend/grade10/src/pages/not-found/NotFoundPage.tsx` and its
      now-inert interpolation argument to `tNotFound("title", ...)`; remove
      the matching `pathname={...}` argument from every caller —
      `routes/not-found.tsx`, `routes/auction-listing.tsx`,
      `routes/store-product.tsx`, `pages/orders/OrderDetailsPage.tsx`, and
      `pages/book/BookManagePage.tsx` (two call sites).
- [x] 2.3 Rewrite `e2e/helpers/not-found.ts`'s `waitForNotFoundSurface` to
      wait for the static title instead of building
      `` `There is nothing at ${pathname}` ``, and update its doc-comment;
      leave its one caller, `e2e/tests/auction/domain.spec.ts`, to the
      helper's existing signature.
- [x] 2.4 Drop the now-inert `{ pathname: ROUTES.bookManage }` interpolation
      argument from `pages/book/BookManagePage.test.tsx`'s expected-title
      helper.
- [x] 2.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      `pnpm run build` (apps/frontend/grade10)

## 3. zzz-site not-found (grade10) (owner: @sean)

Needs group 1. Independent of group 2 — claim and land in parallel.

- [x] 3.1 Rewrite `src/chrome/navigation.test.tsx`'s not-found case: drop
      `notFound.title.replace("{pathname}", "/nowhere")` and its "naming it"
      title in favor of asserting the static title renders and the failed
      address appears nowhere, add a case for Back to Home returning to
      home, and one for not-found never correcting itself to home on its own
      (`zzz-site-site-navigation-SC-03`, `zzz-site-site-navigation-SC-24`).
- [x] 3.2 Drop the `pathname` prop from
      `apps/frontend/zzz/src/pages/not-found/NotFoundPage.tsx` and its
      now-inert interpolation argument to `tNotFound("title", ...)`; remove
      the matching `pathname={...}` argument from `routes/not-found.tsx`.
- [x] 3.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      `pnpm run build` (apps/frontend/zzz)

## 4. PRD (grade10-spec)

Needs groups 2 and 3 deployed — the PRD states what is live, not what has
merged.

- [ ] 4.1 Remove the `🚧 **Not-found words**` line from
      `docs/prds/products/grade10-site/site/navigation.md` and
      `docs/prds/products/zzz-site/site/navigation.md`, folding each into
      its surrounding prose as settled fact.
- [ ] 4.2 Verify: `pnpm check:manual`
