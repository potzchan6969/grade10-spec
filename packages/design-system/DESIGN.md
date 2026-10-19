# @grade10/design-system

The Grade10 look, and the tokens and shadcn primitives that draw it. Read the
visual language before building a screen; read the token pipeline before
touching `tokens.json`, `tokens.config.json` or the theme CSS.

Every rule below names the token or the primitive that carries it. Where a
rule and Figma disagree, Figma is correct and the code is a bug — see
[Design Code Sync](../../docs/governance/design-code-sync.md).

## Values

| Rule | Value |
| --- | --- |
| **Theme** | `.theme-grade10` on `<html>` — `src/themes/grade10.css` |
| **Brand colour** | `--primary` → `orange-400` `#C4903D` · text on it `--primary-foreground` `#FFFFFF` |
| **Ink** | `--foreground` → `gray-900` `#1B1918` |
| **Page** | `--background` `#FFFFFF` · raised areas `--background-subtle` `gray-50` |
| **Border** | `--border` `gray-200` `#E6E5E5` · hover `--border-strong` `gray-300` |
| **Typeface** | Gibson (`canada-type-gibson`), weights 400 and 500; 700 for a lone figure |
| **Icons** | Phosphor, `bold` weight by default |
| **Disabled** | The element's own colours at `opacity-50` |
| **Spacing step** | 4px — `xs` 4 · `sm` 8 · `md` 16 · `lg` 24 |
| **Mode** | Light only; no dark palette ships |

## Colour Roles

One role per job. Pick by what the element does, never by the colour wanted.

| Role | Token | Used for |
| --- | --- | --- |
| **Primary** | `primary` / `primary-foreground` | The main action, a selected day or slot, a checked control, the active tab underline, a step in progress, a brand link, a location pin |
| **Primary tint** | `primary-muted`, `primary/5` | The fill behind a selected card or row |
| **Primary border** | `primary-border` | The edge or underline of a selected item that has no fill — tabs, gallery thumbnails |
| **Foreground** | `foreground` | Headings, body text, labels, outline and ghost button labels |
| **Secondary text** | `secondary-foreground` `gray-500` | Field labels, descriptions, a secondary link |
| **Muted** | `muted` `gray-100` / `muted-foreground` `gray-400` | Secondary button fill, step chips, today in a calendar; placeholders and struck-out days |
| **Destructive** | `destructive` / `destructive-muted` / `destructive-border` | Cancel a booking, delete, an invalid field, an error banner |
| **Success** | `success` / `success-muted` / `success-border` | A done banner, a valid field, a success badge |
| **Warning, Info** | `warning-*`, `info-*` | Warning banners and badges; info badges |
| **Inverse** | `background-inverse` `gray-950` | Footer and tooltip only |

- **Foreground is ink, never a fill** — a button, chip, day or tab never fills
  with `foreground`; selection is `primary`
- **Accent is a hover wash** — `accent` is 4% black, used behind hovered
  items; `accent-foreground` is the brand gold

## Actions

`Button` is a pill in every size (`radius-full`). One primary action per
region — a card, a dialog, a page header.

| The action | Variant | Looks |
| --- | --- | --- |
| **Main** — Continue, Book, Pay, Add to Calendar | `default` | Gold fill, white label |
| **Alternative** — Back, Cancel, See all | `outline` | White pill, 1px `border`, ink label |
| **Quiet** — Appointments, Shop Now beside no other action | `secondary` | `muted` fill, ink label |
| **Inline** — Change, Not you, Sign in in a header | `ghost`, or `Link` | Label only, or underlined text |
| **Harmful** — Cancel Visit, Delete | `destructive` | Red fill |

- **Sizes** — `lg` 48px default · `md` 40px in cards and forms · `sm` 32px in
  dense lists and slot grids
- **Disabled** — the same variant at 50% opacity: a disabled main action is
  pale gold, never grey
- **Loading** — `loading` swaps the leading icon for a spinner and disables
  the button
- **Icon only** — `IconButton`, a circle; `outline` by default, `primary` for
  the one main icon action
- **Labels** — Title Case, short prepositions lower: `Add to Cart`,
  `Choose a Date and Time`

## Selected States

Selected means `primary`. One state per control, the same on every page.

| Control | Selected looks | Primitive |
| --- | --- | --- |
| **Calendar day** | Gold circle, white digit; today unselected is a `muted` circle | `Calendar` |
| **Time slot** | `default` button among `outline` buttons | `Button` with `aria-pressed` |
| **Radio card** | `primary` border, `primary` at 5% fill | `RadioCard` |
| **Radio, checkbox, switch** | `primary` dot, fill or track | `RadioButton`, `CheckboxButton`, `Switch` |
| **Tabs** | `list`: 2px `primary-border` underline · `pill`: white pill on the `muted` track | `Tabs` |
| **Chip** | `primary` variant — gold fill, white label; others `default` | `Chip` |
| **Segmented control** | White pill, ink label | `SegmentedControl` |
| **Navigation link** | `muted` pill | `NavigationLink` |
| **Step in progress** | `primary` ring and dot | `StepIndicator` |

- ❓ **Filter chip** — `FilterChip` selected fills with `foreground`, as the
  Figma set `ChipSelectable` (`4313:28`) draws it; whether it moves to
  `primary` is the designer's call

## Type

| Use | Size | Weight | Token |
| --- | --- | --- | --- |
| **Page title** | 30px, 36px from `md` | 500 | `text-3xl md:text-4xl` |
| **Section title** | 18–20px | 500 | `Text size="lg"`, `size="xl"` |
| **Card title** | 16px | 500 | `CardTitle` |
| **Body** | 16px, 14px in cards | 400 | `Text` |
| **Label, caption** | 12–14px | 400 | `Text size="sm" tone="secondary"` |
| **Lone figure** | 30px | 700 | `Text size="display"` |

- **Medium for emphasis** — headings and values are 500; bold is kept for a
  figure the reader copies
- **Digits line up** — `tabular-nums` on prices, times and counts;
  `face="mono"` on a code read back at a counter
- **Ink, then grey** — a value in `foreground`, its label above it in
  `secondary-foreground`

## Spacing

A 4px step. `Stack`, `VStack` and `HStack` take the rungs; a page never
invents a gap.

- **`xs` 4px** — icon to label, label to value
- **`sm` 8px** — items in a list, buttons in a row
- **`md` 16px** — card padding, fields in a form
- **`lg` 24px** — sections inside a page; panels pad 20–24px

## Radii

| Element | Radius | Token |
| --- | --- | --- |
| **Buttons, inputs, selects, chips, badges** | Pill | `radius-full` |
| **Cards, banners, panels** | 16px | `radius-2xl` |
| **Radio cards, list rows, step rows** | 12px | `radius-xl` |
| **Thumbnails, small tiles** | 8px | `radius-lg` |
| **Step chips, calendar days, avatars** | Circle | `rounded-full` |

## Surfaces and Borders

- **Page** — `background` white; cards and banners carry no shadow
- **Card** — `Card`: white `card` fill, 1px `border`, `radius-2xl`, 16px padding
- **Split panel** — one bordered card, columns divided by a 1px `border` line
- **Hover** — a card or outline control moves to `border-strong` and
  `background-subtle`
- **Divider** — `Separator`, 1px `border`

## Banners and Badges

- **Banner** — `Alert`: `radius-2xl`, 1px tinted border, 10% tinted fill, a
  status icon in the status colour, title in 500 ink, description in
  `secondary-foreground`. `success` is the soft green of a done booking
- **Neutral notice** — `Alert` `default`: white, `border`, own icon through
  `icon`
- **Badge** — a pill; `default` muted, status variants filled, `brand` gold

## Chips and Steps

- **Numbered step chip** — a 28px `muted` circle, 14px 500 digit, beside the
  step text in a bordered `radius-lg` row
- **Stepper** — `Stepper` and `Step`; done and current steps in ink, upcoming
  in `secondary-foreground`

## Links

`Link` is underlined text, no pill.

- **`default`** — ink; the inline action in a sentence or a card footer
- **`secondary`** — grey; Change beside a summary row
- **`brand`** — gold; a link that should read as the brand
- **`error`** — red; a link inside an error

## Form Controls

- **Field** — `TextInput`, `Select`: 40px pill, 1px `border`, white `input`
  fill, `ring` on focus; label above in `secondary-foreground`
- **Invalid** — `destructive-ring` border and the message below in red
- **Valid** — `success-ring` border
- **Textarea** — the same field, a rounded rectangle
- **Choice** — two to four options with a line each are `RadioCard`s; more
  are a `RadioList` or `Select`

## Icons

- **Library** — Phosphor through `IconProvider`, `bold` weight
- **Size** — follows the control: 16px in `lg`, 14px in `md`, 12px in `sm`
- **Colour** — inherits the label; a location pin or brand mark is `primary`

## Do and Don't

- **Do** — give each region one `default` button; make the rest `outline`,
  `ghost` or a `Link`
- **Do** — show selection with `primary` and a tint, never with ink
- **Do** — use `Card`, `Alert`, `RadioCard` and the blocks instead of a
  bordered `div`
- **Do** — let disabled be the variant at 50% opacity
- **Don't** — fill a button, chip or day with `foreground`, `gray-900` or
  `background-inverse`
- **Don't** — pass a colour class to `Button` to restyle it; a missing
  variant is the designer's — [Design Override](../../docs/prds/products/shared/design-sync/design-override.md)
- **Don't** — render outside `.theme-grade10`; the `:root` default theme
  paints `primary` near-black
- **Don't** — square a button or field; every action and field is a pill

## Package

| Path | Contents |
| --- | --- |
| `tokens.json` | Designer-owned token values — the source of truth |
| `tokens.config.json` | Engineer-owned projection rules — `slotMap`, selectors, Figma collection names |
| `src/theme.css` | Generated — the `@theme inline` mapping and primitive values |
| `src/themes/grade10.css` | Generated — Grade10 semantic values under `.theme-grade10` |
| `src/themes/default.css` | Hand-maintained stock shadcn baseline at `:root`, outside the pipeline |
| `src/components/**` | Primitives with colocated stories and Code Connect templates |
| `src/index.ts` | Barrel export |

- **Storybook** — `pnpm run storybook:design-system`; the combined workbench
  is https://storybook.grade10-stg.com
- **Story tests** — `pnpm run test:stories:design-system` runs every story in
  headless Chromium with axe; `color-contrast` is off until the designer
  settles the palette (Q63, `complete-vault-collector-flow`)
- **Design source** — the Figma file, through the token pipeline below

## Consuming

```css
/* app src/index.css */
@import "tailwindcss";
@import "@grade10/design-system/theme.css";
@import "@grade10/design-system/themes/default.css";
@import "@grade10/design-system/themes/grade10.css";
@source "../../../../packages/design-system/src";
```

```html
<html class="theme-grade10">
<link rel="stylesheet" href="https://use.typekit.net/lnk7gwq.css" />
```

- **All three imports, in order** — `theme.css` has no slot values;
  `default.css` sets them on `:root`; `grade10.css` overrides them under
  `.theme-grade10`
- **Theme on `<html>`** — overlays portal into `<body>`, so a theme class on
  a wrapper `div` leaves dialogs, drawers and menus on the default theme
- **Typeface by `<link>`** — a nested `@import` of the Typekit kit is dropped
  once `theme.css` follows Tailwind in the bundle
- **Imports** — `@grade10/design-system/*`, never `@/`

## Tokens

`tokens.json` is the source of truth. Figma and the CSS are projections of it.

```
   Figma Variables ──tokens:import──▶  tokens.json  ──tokens:build──▶  theme.css + themes/*.css
                          ◀──tokens:push──┘
```

| Command | Direction | Does |
| --- | --- | --- |
| `pnpm tokens:pull` | Figma → CSS | `tokens:import` then `tokens:build` — the normal entry point |
| `pnpm tokens:import` | Figma → code | Dump → `tokens.json`; needs `FIGMA_DUMP=<file>` |
| `pnpm tokens:build` | code → CSS | `tokens.json` + config → `theme.css`, `themes/grade10.css` |
| `pnpm tokens:push` | code → Figma | Writes a plugin script that updates or seeds a Figma file |
| `pnpm tokens:plugin <dump\|push\|seed>` | — | Builds the importable Figma plugins |

- **Run from the repository root** — the scripts live in `scripts/tokens-sync/`
- **Never hand-edit the generated CSS** — edit `tokens.json` or
  `tokens.config.json`, run `pnpm tokens:build`, commit both together
- **A human runs every Figma leg** — the REST variables endpoint is
  Enterprise-only, so the pull reads a dump from the DS Token Dump plugin.
  Procedure and failures: [Figma Token Export](../../docs/governance/figma-token-export.md)
- **Which file** — the plugin runs in whichever file is open;
  `tokens.config.json` → `figmaFile` is printed as a guard, not used to route
- **Ownership** — designers own values in Figma and land them by
  `tokens:pull`; engineers own `slotMap` and the default theme. `tokens.json`
  is the merge point and a conflict is resolved by a person
- **Identity** — the normalized name (`slate-950`, `layer-01`); a push updates
  a variable of that name in place, so the alias graph survives
- **Seeding** — a push creates missing collections, modes and variables,
  filed under a group from the name; a second run creates nothing
- **Collections read** — every `primitiveCollections` entry (`Foundation`,
  `Typography`) plus `semanticCollection`, each in its own `tokens.json`
  section so a push files it back. `Motion` and `Sizing` are not read; a
  green pull is not the whole file
- **Collisions fail** — two collections normalizing to one name stop the pull
- **Units** — inferred from Figma scopes, then the name, else `px`; font
  weight is unitless, opacity a percentage; a STRING passes through.
  `tokens:push` creates only COLOR and FLOAT variables
- **A missing theme fails** — a renamed Figma mode exits 1 before
  `tokens.json` is written
- **Lossless round trip** — push into an empty file, dump, pull: `tokens.json`
  comes back byte for byte

## Adding a Primitive

```bash
cd packages/design-system
pnpm dlx shadcn@latest add <component> --yes
```

- **Then** — export it from `src/index.ts`, add its story beside it, and
  follow [Design-System Workflows](../../docs/governance/design-system-workflows.md#primitives)
- **Before handing off** — `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run design-sync:check`

## Publishing

Consumed from source: `exports` point at `src/`, with no build step and no
committed `dist/`. A release cadence of its own would publish it to npm or a
shadcn registry and move consumers off `workspace:*`.
