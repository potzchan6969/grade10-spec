## Where this lands

`apps/frontend/grade10` only. `@grade10/design-system` already exports
`NavLink.external` and `Nav` already honours it in every region (wide primary
nav, compact drawer, utility strip); `@grade10/ui`'s `SiteHeader` re-exports
the same `NavItem`/`NavLink` types unchanged. The Storybook fixtures listed in
`ui-design.md` and the 🚧 marks on both PRD pages already carry this change's
shape. Nothing in `grade10-spec` needs new component or spec work — only the
`chrome.nav.help` word, and the application wiring below.

## The `help` nav key resolves through the shared catalog alone

`chrome.nav.help` is added to `packages/i18n/messages/shared/{en,ko,zh-Hans,zh-Hant}/chrome.json`'s
`nav` object only — never to `messages/grade10/*/chrome.json`, which already
overrides `nav` for `store`/`auction`/`vault`/`book`.

`getMessages` (`packages/i18n/src/index.ts`) deep-merges layers key by key
(`merge`), not object by object, so a brand's `nav` override still falls back
to the shared object for any key it does not name — `help` reaches
`grade10-site` without touching the brand file. Rejected: duplicating the
string into the grade10 brand catalog too — "Help" carries no brand voice, and
a duplicate is one more place a future edit has to remember.

## Help never becomes a `RouteId`

`surfaces.ts` types only addresses this site itself answers, and
`siteContent.ts`'s `NAV_LINKS` / `navLinksFor` exist specifically to keep every
primary-nav entry checked against that table (`SiteShell.test.tsx`: "links to
addresses this site answers, or to nowhere yet"). Help is off-site, so it stays
out of both.

`siteContent.ts` gets one more exported constant beside `FOOTER_HELP_COLUMN`:

```ts
/** ❓ Provisional Mintlify host; Product has not confirmed the durable
 * documentation address (add-site-header-help-link open question). */
export const HELP_NAV_LINK: { label: NavKey; href: string } = {
  label: "help",
  href: "https://grade10.mintlify.io/",
};
```

`SiteShell.tsx` appends it to `navItems` after mapping `navLinksFor`, as a
literal `external: true` entry carrying no `current`:

```ts
navItems={[
  ...navLinks.map((link) => ({
    label: tNav(link.label),
    href: hrefOf(link.to, locale),
    current: current != null && isWithin(current, link.to),
  })),
  { label: tNav(HELP_NAV_LINK.label), href: HELP_NAV_LINK.href, external: true },
]}
```

Rejected: folding Help into `NAV_LINKS` as a `Destination`-typed row — that
table's whole point is "every entry is a `RouteId` this build may or may not
carry"; giving one row an off-site href would force `navLinksFor`'s `to in
served` check and its test (`grade10-site-site-carried-surfaces-SC-11`) to grow
a special case for the one entry that never appears in `served`.

## Ordering falls out, it is not stated

Today `grade10-site` carries no `storeLocator` surface, so `NAV_LINKS` never
produces a Store Locator entry and appending Help last is equivalent to
"follows Store Locator when present, else follows Auction" — there is only one
case live. The day a Store Locator change adds its row to `NAV_LINKS`, placing
that row last in the table keeps Help trailing it with no further edit here;
that ordering constraint is a note for that change, not a task of this one.

## Test coverage adjusts one existing assertion

`SiteShell.test.tsx`'s "links to addresses this site answers, or to nowhere
yet" test currently asserts every rendered link's href is either `UNWRITTEN`
or in the site's own `ROUTES`. Help's href is neither, which is exactly what
`grade10-site-site-page-shell-SC-10` (modified) states — the test needs Help
carved out the same way the spec does, not loosened generally.

## Out of scope

- `zzz-site` — non-goal in the proposal; the shared `nav.help` key exists in
  its catalogs after this change (the merge is per-language, not per-brand)
  but nothing in `zzz-site` wires it into a nav item.
- `@grade10/app-env` — it registers hostnames this platform itself serves
  (`docs/conventions/frontend-backend.md`); a third-party docs host is not one
  of them, and a provisional, unconfirmed address is not something to name in
  the registry yet regardless.
- Confirming the documentation host — tracked as this change's own open
  question and a named follow-on change.
