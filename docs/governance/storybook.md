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
| `pnpm storybook:check` | The grammar below, and every cited story id |
| `pnpm storybook:rename <map>` | Retitles stories from an `old title<TAB>new title` map and rewrites every id that cites them |
| `pnpm test:stories` | Every story's `play` and accessibility check, in Chromium |

Published from `main` at
[storybook.grade10-stg.com](https://storybook.grade10-stg.com).

## Sidebar Grammar

| Kind | Title | File |
| --- | --- | --- |
| **Screen** | `<Domain>/<Feature>/Screens/<Screen>[/<Aspect>]` | `apps/preview/src/pages/<domain>/<feature>/` |
| **Flow** | `<Domain>/<Feature>/Flows/<Name>` | beside the screens |
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
- **Screen** — the name at the top of the screen, or in the change's
  `ui-design.md` Screens; no `Page` suffix. A dialog open on a screen is an
  aspect of it: `Vault/Portfolio/Screens/Asset Detail/Retrieval Dialog`
- **Component** — the meta's `component`, or the file's name in PascalCase.
  A part promoted to `@grade10/ui` swaps `Parts` for `Blocks` and nothing else
- **Part or Block** — a Block is an `@grade10/ui` export an application can
  import; a Part is drawn for this feature only and lives in `apps/preview`
- **Group** — the primitive's folder: Display, Forms, Layout, Overlays,
  Providers
- **Folders** — a feature holds only `Screens`, `Flows`, `Prototypes`,
  `Parts` and `Blocks`; nothing sits loose beside them
- **Order** — Start Here, the domains in `docs/prds/manual.yaml` order, then
  Design System; inside a feature, Screens, Flows, Prototypes, Parts and
  Blocks

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

- **One story per state** — named with the words of the State column in the
  change's `ui-design.md`: `No slots this month`, `Retrieval requested`
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
- **Flows** — a behaviour or a short journey shown as a sequence sits under
  `Flows/` in `FlowContainer` (`packages/ui/src/blocks/shared/flow-container.tsx`):
  one behaviour per story, its cases in one container, and a description
  below the cards naming the journey id it walks and the outcome expected
- **Play** — a flow's `play` steps through it, so `pnpm test:stories` keeps
  it working

## Prototypes

- **Explore** — `/prototype` builds three directions behind its picker, in
  one `Prototypes/<Piece>` story tagged `!test`, so a rough draft never fails
  a run
- **Outside the agreed look** — `apps/preview/src/prototypes/` is not under
  Design Override, so trying and deleting stops nothing
- **Promote, then delete** — the picked direction folds into the screen, part
  or block; the prototype file goes in the same commit

## Product Details

A rule found while drawing goes to the manual page first, marked 🚧 or ❓; a
state goes to the change's `ui-design.md`. Motion and words are worked on the
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
- **Ids** — a cited story id no story answers, in `docs/`, `openspec/specs/`
  and code: `::story` cards, `?path=/story/` and `iframe.html?id=` links,
  `*_STORY_ID` constants, `storyHref` and `navigateToStory`, and backticked
  ids in markdown

An id an active change cites but has yet to build only warns; the archive is
not read.
