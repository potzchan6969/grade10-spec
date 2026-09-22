## 1. Cover the brand-sans contract with tests (grade10)

`root.tsx`'s Typekit link (`use.typekit.net/lnk7gwq.css`) and the design
system's `canada-type-gibson` mapping for grade10-site already ship on
`main` — added in `167d9c4c7d`, the day after this change was proposed and
before anyone planned it. Nothing in this group is new implementation; it
backfills the test coverage the requirements never got.

- [x] 1.1 Assert the document head requests `https://use.typekit.net/lnk7gwq.css` on every surface, extending `apps/frontend/grade10/src/serving/document.test.tsx`'s `linkHrefs` helper the way it already checks `manifest` (`grade10-site-site-typography-SC-01`)
- [x] 1.2 Assert no second brand-sans stylesheet is requested (`apps/frontend/grade10/src/serving/document.test.tsx`), and that body and heading text load and register the `canada-type-gibson` face through the imported design-system theme (`apps/frontend/grade10/e2e/tests/typography.spec.ts`, real-browser `document.fonts` check — `getComputedStyle().fontFamily` echoes the declared stack whether or not the face loaded, so it cannot decide this) (`grade10-site-site-typography-SC-02`, `grade10-site-site-typography-SC-03`)
- [x] 1.3 Add an e2e case that blocks the `use.typekit.net` request and asserts the page renders its full content immediately, in the browser's fallback sans, with no loading, empty, or error surface (`grade10-site-site-typography-SC-04`)
- [x] 1.4 Cases stay `manual`: `pnpm run tcs:automated --decided-by` requires a path that resolves inside the grade10-spec store, and both tests live in `apps/frontend/grade10` (the application repository) — a structural gap in the flip tooling for every grade10-site/grade10-admin/zzz-site capability, not particular to this one. Worth a change of its own; not fixed here.
- [x] 1.5 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test` (66 files, 1206 tests) all green in `apps/frontend/grade10`; `e2e/tests/typography.spec.ts` run directly against a live local stack (2/2 passed) rather than the full `test:e2e` suite, which this change does not otherwise touch
