`NavLink.external`, the `Nav` rendering it in every region, and both PRDs' 🚧
marks already ship in this store — see `tech-design.md`. Group 2 needs group
1's `nav.help` key landed in the `external/grade10-spec` submodule before it
can reference the label through `NavKey`.

## 1. The `help` nav word (grade10-spec) (owner: @sean)

- [ ] 1.1 Add `nav.help` to the shared `chrome` catalog for `en`, `ko`,
      `zh-Hans`, and `zh-Hant`, matching the word each language already uses
      for `footer.help` — production copy for
      `grade10-site-site-page-shell-SC-25`, `SC-26` and
      `shared-ui-site-chrome-SC-27`, `SC-28`.
- [ ] 1.2 Verify: `pnpm run typecheck`, `pnpm run test` (i18n
      `resolution.test.ts` coverage), `pnpm check:manual`.

## 2. Help in the grade10-site header (grade10)

- [ ] 2.1 Add the provisional `HELP_NAV_LINK` constant to
      `apps/frontend/grade10/src/chrome/siteContent.ts` (❓ Mintlify host,
      pending Product's confirmation) and append it as the last `navItems`
      entry in `SiteShell.tsx` with `external: true` and no `current` —
      `grade10-site-site-page-shell-SC-25`, `SC-26`: Help follows Auction on
      the current auction-only build.
- [ ] 2.2 Update `SiteShell.test.tsx`'s "links to addresses this site answers,
      or to nowhere yet" assertion to carve out Help's off-site href, and add
      coverage that Help renders last, carries `target="_blank"` and
      `rel="noopener noreferrer"`, and is never marked `aria-current` —
      `grade10-site-site-page-shell-SC-10`, `SC-25`, `SC-26`.
- [ ] 2.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`.
