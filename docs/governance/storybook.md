# Storybook

The workbench (`pnpm storybook`) is where a designer and an agent draw a
feature's screens, states and journeys before an application builds them. Its
sidebar reads like the manual: domain, then feature, then what you are looking
at.

## Commands

| Command | Opens or runs |
| --- | --- |
| `pnpm storybook` | The workbench: every story, on port 6006 when free |
| `pnpm storybook:pages` | The page assemblies in `apps/preview` alone |
| `pnpm storybook:ui` · `pnpm storybook:design-system` | One package's stories |
| `pnpm storybook:check` | The grammar below, every cited story id and journey |
| `pnpm storybook:coverage` | What each feature holds, and the journeys no story walks yet (`--gaps` for only those) |
| `pnpm storybook:rename <map>` | Retitles stories from an `old title<TAB>new title` map and rewrites every id that cites them |
| `pnpm test:stories` | Every story's `play` and accessibility check, in Chromium |

Published from `main` at
[storybook.grade10-stg.com](https://storybook.grade10-stg.com).

## Sidebar Grammar

| Kind | Title | File |
| --- | --- | --- |
| **Screen** | `<Domain>/<Feature>/Screens/<Screen>[/<Aspect>]` | `apps/preview/src/pages/<domain>/<feature>/` |
| **Prototype** | `<Domain>/<Feature>/Prototypes/<Piece>` | `apps/preview/src/prototypes/<domain>/<feature>/` |
| **Part** | `<Domain>/<Feature>/Parts/<Component>[/<Aspect>]` | beside the screens |
| **Block** | `<Domain>/<Feature>/Blocks/<Component>[/<Aspect>]` | `packages/ui/src/blocks/<dir>/` |
| **Primitive** | `Design System/<Group>/<Component>[/<Aspect>]` | `packages/design-system/src/components/<group>/` |
| **Guide** | `Start Here` | `apps/preview/src/start-here.mdx` |

- **Domain** — a folder under `docs/prds/products/grade10-site/`, or
  `shared/auth`, in Title Case: `post-bidding` is `Post Bidding`, `kyc` is
  `KYC`
- **Feature** — a page file in that folder: `booking.md` is `Booking`. A
  feature with no manual page gets one first
- **Screen** — the name at the top of the screen, or the page section it
  serves; no `Page` suffix. A dialog open on a screen is an
  aspect of it: `Vault/Portfolio/Screens/Asset Detail/Retrieval Dialog`
- **Component** — the meta's `component`, or the file's name in PascalCase.
  A part promoted to `@grade10/ui` swaps `Parts` for `Blocks` and nothing else
- **Part or Block** — a Block is an `@grade10/ui` export an application can
  import; a Part is drawn for this feature only and lives in `apps/preview`
- **Group** — the primitive's folder: Display, Forms, Layout, Overlays,
  Providers
- **Folders** — a feature holds only `Screens`, `Prototypes`, `Parts` and
  `Blocks`; nothing sits loose beside them
- **Crowding** — five or more loose stories under one `<Component>` (or one
  `<Aspect>`) deserve a subgroup: split them into named `<Aspect>` folders
  by what they vary, so related states sit together — e.g. the drawer's
  `Header`, `Body` and `Footer` inside `CartDrawer`. Retitle with
  `pnpm storybook:rename <map>` so every cited id is rewritten with the move
- **Order** — Start Here, the domains in `docs/prds/manual.yaml` order, then
  Design System; inside a feature, Screens, Prototypes, Parts and Blocks

A story id is its title and export, sanitized:
`Appointment/Booking/Screens/Book Visit` →
`appointment-booking-screens-book-visit--default`, which starts with the
manual's route, `/p/grade10-site/appointment/booking`. The application's own
Storybook titles stories the same way, so an id alone does not say which
Storybook holds it.

## Files

- **One feature, one folder** — a screen's content, stand-in data and parts
  sit beside its stories in `pages/<domain>/<feature>/`
- **Shared files** — a file several features use sits in the nearest folder
  above all of them: the domain, or `pages/` for what crosses domains
  (`workbench-story-nav.ts`, `store-content.ts`)
- **No sibling imports** — a feature never imports from another feature's
  folder; move what both use up
- **Draft words** — copy not yet in `@grade10/i18n` lives in the feature's
  `*-content.ts`

## States

- **One story per state** — named with the words the page uses for it: `No
  slots this month`, `Retrieval requested`
- **On what it dresses** — a state of a whole screen is a story on the
  screen; a state of one block is a story on the block
- **Whole pages** — a screen story renders the page a collector sees, header
  to footer, and declares `parameters: { layout: "fullscreen" }`. The page
  owns its state and callbacks; packages only receive props
- **Narrow** — a `Narrow` story sets `globals: { viewport: { value: "mobile1" } }`

## Journeys

- **Click-through** — a screen's controls open the next screen's story with
  `navigateToStory` or a `storyHref` link from `pages/workbench-story-nav.ts`,
  so a journey is walked in the canvas the way a collector walks it
- **Combinations** — a journey whose outcome turns on what staging is set to
  is walked by the Screen's Scenario, below; there is no separate Flows folder
- **Journeys cited** — a click-through screen or a Scenario names the journeys
  it walks, by a product page's flow or case, `<page>#<id>`, or by their ids
  in the `user-journeys.md` beside a legacy spec:
  `parameters: { journeys: ["grade10-site/loyalty/membership#pass-rotates"] }`, on
  the meta or one story. The workbench lists them under the canvas in their
  own words
- **Collector journeys** — the workbench draws what a collector, member,
  bidder or winner walks; a journey only staff or operators walk is not drawn
  here
- **Play** — a click-through's `play` steps through it, so
  `pnpm test:stories` keeps it working

## Scenarios

A Scenario is a Screen given what staging can be set to, so a reader sees how
a combination behaves without a staging order, and checks staging against it.

- **Where** - one story file beside the Screen's states,
  `<screen>.scenario.stories.tsx`, titled `<Domain>/<Feature>/Screens/<Screen>/Scenario`
  and tagged `scenario`. The canvas is the designer's Screen at its real size;
  the state stories stay as they are
- **Settings** - each condition staging can be set to is an `argTypes` entry: a
  `name`, a `description` saying where staging sets it, and a radio of its
  values. `render` maps the settings to the props the Screen already takes,
  computed by a walk module beside the feature, as `pages/basket-walk.ts` prices
  the basket
- **Rules** - each setting names the case that decides it,
  `parameters: { rules: { points: "<page>#<case id>" } }`, or a legacy spec's
  requirement, `"<capability>: <requirement title>"`; `pnpm storybook:check`
  refuses a case the page does not hold, a title the spec does not hold, and a Scenario
  with no settings
- **One story** - the file holds the one `Scenario` story and no presets
  beside it; its settings reach every case worth checking, and the Given
  panel's link shares any one. `pnpm storybook:check` refuses another story
- **Cases** - every combination the settings reach is a row of a unit test
  beside the walk module, as `pages/basket-walk.test.ts` asserts each basket;
  the Scenario's `play` checks its default settings in the browser
- **Given** - the panel beside Controls lists each setting in words, the
  requirement deciding it, a link to this Scenario with these settings to paste
  beside a staging report, and the journeys it walks

## Prototypes

- **Not yet designed** — a screen whose manual page marks it ❓, or whose
  boards are not carried, is drawn as a wireframe `Prototypes/<Screen>`: its
  states from the journeys and the page, composed of existing blocks and
  plain layout, with a note on what the design must still settle. It renders
  and passes accessibility like a screen
- **Explore** — `/prototype` builds three directions behind its picker, in
  one `Prototypes/<Piece>` story tagged `!test`, so a rough draft never fails
  a run
- **Outside the agreed look** — `apps/preview/src/prototypes/` is not under
  Design Override, so trying and deleting stops nothing
- **Promote, then delete** — the picked direction, or the agreed design of a
  wireframe, folds into the screen, part or block; the prototype file goes in
  the same commit

## Coverage

Every feature page under `grade10-site/` and `shared/auth/` holds Screens, or
Prototypes until its design is agreed. A feature with no screen of its own
(events, policy, or a piece drawn on another feature's screen, whose
Scenarios still walk its journeys) or one only operators see is declared once, with
why, in `apps/preview/coverage.yaml`.
`pnpm storybook:coverage` prints each feature's counts and, per capability,
the collector journeys a story walks and those it does not yet, and each
Scenario's settings.

## Product Details

A rule found while drawing goes to the manual page first, marked 🚧 or ❓; a
state lives in its story, cited with `::story` under the line it dresses. Motion and words are worked on the
story in place with `/animate`, `/transitions-polish` and `/ux-copy`.

## Agents

- **Skill** — `.claude/skills/storybook-workbench/SKILL.md` places a story,
  names its states and hands back links
- **MCP** — with `pnpm storybook` running, `.mcp.json` connects an agent to
  `http://localhost:6006/mcp`: story instructions, previews, component docs
  and `run-story-tests` for `apps/preview`. Package stories run with
  `pnpm test:stories`
- **Manual link** — every docs page links its feature's manual page

## Checks

`pnpm storybook:check` refuses, at `pnpm push:main` and in CI:

- **Title** — outside the grammar, or a domain or feature with no manual page
- **Place** — a story outside its kind's folder, or a leaf that is not the
  component's name
- **Imports** — one feature reaching into another's folder
- **Order** — a workbench `storySort` root list that is not the manual's
- **Journeys** — a journey id no
  `user-journeys.md` holds; one only an active change holds warns
- **Coverage** — a key in `coverage.yaml` that is no feature; a collector
  feature with no Screens or Prototypes warns
- **Ids** — a cited story id no story answers, in `docs/`, `openspec/specs/`
  and code: `::story` cards, `?path=/story/` and `iframe.html?id=` links,
  `*_STORY_ID` constants, `storyHref` and `navigateToStory`, and backticked
  ids in markdown

An id an active change cites but has yet to build only warns; the archive is
not read.
