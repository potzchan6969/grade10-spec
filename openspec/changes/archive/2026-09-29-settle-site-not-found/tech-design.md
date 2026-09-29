# Tech Design

## Already shipped, here

`packages/i18n`'s shared `notFound` catalogs (`en`, `ko`, `zh-Hans`,
`zh-Hant`) are already static — `837bd468b feat(i18n): settle static
not-found catalog copy` dropped the `{pathname}` placeholder from every
locale's title and description. `apps/preview`'s `Pages/Not Found` Storybook
assembly is already built to `ui-design.md` — `4818e80e4 feat(preview): add
Pages/Not Found story`. Neither needs a task below; `grade10`'s work is
picking both up through its submodule pin and matching the call site to the
catalog it already carries.

## What changes in `grade10`

`grade10`'s `external/grade10-spec` submodule is still pinned behind both
commits above: its copy of `shared/en/notFound.json` still reads `"There is
nothing at {pathname}"`. Bumping the pin is step one, and everything else in
this change is downstream of it.

Both site apps render not-found through one component each,
`NotFoundPage.tsx`, that takes a `pathname` prop and passes it to
`useTranslations("notFound")("title", { pathname })`. Once the catalog holds
no `{pathname}` token, that interpolation argument does nothing — it is not
merely stale, it is dead: nothing reads `pathname` inside `NotFoundPage`
after the interpolation goes. The structural fix is to drop the prop
entirely rather than leave it threaded through for an interpolation that no
longer happens, so a later reader does not have to work out why a value is
carried three components deep and never used.

grade10-site threads `pathname` into `NotFoundPage` from six call sites:
`routes/not-found.tsx` (`useLocation().pathname`, the catch-all), plus four
callers rendering it inline as a refusal — `routes/auction-listing.tsx`,
`routes/store-product.tsx`, `pages/orders/OrderDetailsPage.tsx`, and
`pages/book/BookManagePage.tsx` (twice). Every one of those callers loses its
`pathname={...}` argument in the same pass. zzz-site has one call site,
`routes/not-found.tsx`.

Two tests currently assert the interpolated text and go stale once the
catalog is static:

- `apps/frontend/grade10/e2e/helpers/not-found.ts`'s `waitForNotFoundSurface`
  waits for a heading built as `` `There is nothing at ${pathname}` `` —
  the not-found surface's own address-naming, which this change removes. Its
  one caller, `e2e/tests/auction/domain.spec.ts`, only needs the surface to
  render; it does not need the pathname in the wait itself.
- `apps/frontend/zzz/src/chrome/navigation.test.tsx` builds its expected
  title as `notFound.title.replace("{pathname}", "/nowhere")` and its test
  name reads "resolves an unknown address to not-found, **naming it**" — the
  opposite of `zzz-site-site-navigation-SC-03` once this change lands.

`apps/frontend/grade10/src/pages/book/BookManagePage.test.tsx` builds its
expected title with the same now-inert `{ pathname: ROUTES.bookManage }`
argument; it still passes today because the interpolation is already a
no-op, but it reads as though the address still renders — worth cleaning up
in the same pass rather than leaving a misleading interpolation call behind.

## Rejected

**Keeping the `pathname` prop for a later use (analytics, logging).**
Nothing in this change or the spec calls for it, and a prop nobody reads is
exactly the kind of thing that reads as a hook for something and is not —
YAGNI; add it back the day something needs it.

**A shared `@grade10/ui` not-found block**, so grade10-site and zzz-site
share one component instead of two. Already decided against in
`decisions.md` (Q3): pages stay brand-owned assemblies, matching the
archived ZZZ navigation tech design.

## No new export, no data model change

Nothing here adds a dependency, changes a data shape, or introduces a new
`@grade10/ui` or `@grade10/design-system` export. The two `NotFoundPage.tsx`
components keep their existing shape, minus the one dead prop.
