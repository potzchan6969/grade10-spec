## 1. Cover the brand-sans contract with tests (grade10)

`root.tsx`'s Typekit link (`use.typekit.net/lnk7gwq.css`) and the design
system's `canada-type-gibson` mapping for grade10-site already ship on
`main` — added in `167d9c4c7d`, the day after this change was proposed and
before anyone planned it. Nothing in this group is new implementation; it
backfills the test coverage the requirements never got.

- [ ] 1.1 Assert the document head requests `https://use.typekit.net/lnk7gwq.css` on every surface, extending `apps/frontend/grade10/src/serving/document.test.tsx`'s `linkHrefs` helper the way it already checks `manifest` (`grade10-site-site-typography-SC-01`)
- [ ] 1.2 Assert body and heading text resolve to the `canada-type-gibson` family through the imported design-system theme, and that no second brand-sans stylesheet, `@font-face`, or `font-family` declaration exists anywhere in `apps/frontend/grade10/src` (`grade10-site-site-typography-SC-02`, `grade10-site-site-typography-SC-03`)
- [ ] 1.3 Add an e2e case that blocks the `use.typekit.net` request and asserts the page renders its full content immediately, in the browser's fallback sans, with no loading, empty, or error surface (`grade10-site-site-typography-SC-04`)
- [ ] 1.4 Flip the suite cases these tests decide with `pnpm run tcs:automated <case ids> --decided-by <test path(s)>`, in the same commit as the tests that prove them; leave any case that stays manual named in `feature-tcs.md` and in this walk's `rounds.md` row
- [ ] 1.5 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test && pnpm run test:e2e`
