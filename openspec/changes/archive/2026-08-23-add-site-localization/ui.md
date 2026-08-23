# UI: Site localization

No new screen exists in this change: every existing page renders as designed,
in another language. The one visible element is the locale control the chrome
already ships, wired for the first time.

## Screens

- **Locale switcher (grade10 header)** — the `Nav` component set's own frame
  is the layout's source of truth:
  [Grade10 DS — Nav](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9937).
  No new frame is needed; the control and its menu are what the component set
  defines. If design wants the switcher to look different from the shipped
  control, that is a design-system change first, out of this change's scope.
- **All other surfaces** — unchanged layouts from their own existing frames;
  only the copy's language varies. CJK and Korean text runs longer or taller
  than English in places; any layout that breaks under it is a bug against
  the surface's existing frame, not a new design.

## Components

All existing; nothing new to build in this repository.

- `Nav` (design system, `shared-ui/site-chrome`): the grade10 site supplies
  `localeLabel`, `locales` (three entries — labels `English`, `繁體中文`,
  `简体中文`), `locale`, and `onLocaleChange`. The ZZZ site supplies
  `localeLabel` (`한국어`) and no handler — the display-only state the
  site-chrome spec already defines.
- `Footer` (design system): each site supplies its `locale` slot with the
  same label as the header.
- `DropdownMenu` / `DropdownMenuItem` (design system): already what the
  chrome's locale control opens; no direct application use is added.

## States

- **Display-only label (ZZZ)** — scenario *One language needs no switcher*:
  label rendered, nothing about it invites a click.
- **Current locale marked (grade10)** — the `Nav` `locale` prop marks the
  active entry, per the site-chrome spec's selected-locale behavior.
- **Switching on a public surface** — scenario *The address wins over the
  memory* and *A prefixed visit stays in its language*: picking a locale
  navigates to the same surface's address in that locale; the transition is
  the router's ordinary navigation, no bespoke loading state.
- **Switching on a session-shaped surface** — scenario *An explicit pick
  outlives the visit*: the page re-renders in place in the picked locale; the
  address does not change.
- **Not found under a prefix** — scenario *An unknown prefixed address is
  refused honestly*: the existing not-found surface, rendered in the
  address's locale.
