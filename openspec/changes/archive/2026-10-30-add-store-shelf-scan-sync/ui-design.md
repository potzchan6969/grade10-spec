## Screens

### Hosted scanner, item label and pick sheet

The hosted scanner at `/scan/hosted` is Glint, a standalone product with its
own look, outside grade10's design system
([PLATFORM.md § Decisions](https://github.com/9gag/grade10/blob/main/apps/backend/grade10/tcg-ar/docs/PLATFORM.md#decisions)).
It has no Figma frame. Its layout source is its code: the label drawn over an
item in view (`ItemLabel` in `apps/backend/grade10/tcg-ar/src/app/hosted/HostedApp.tsx`)
and the bottom sheet the consumer scanner already draws
(`src/app/ui/CardSheet.tsx`, classes `sheet`, `sheet-header`, `sheet-body`).
This change adds one surface, the pick sheet, built from those parts.

```text
 Two close matches                 Pick sheet                     Picked
┌───────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────────┐
│ ┌───────────────────┐ │   │                           │   │                           │
│ │[Available][2 match│ │   │      (camera, dimmed)     │   │      (camera, dimmed)     │
│ │Pikachu 025/165 EN │ │   │                           │   ├───────────────────────────┤
│ │HK$80  Tap for de… │ │   ├───────────────────────────┤   │ ‹ Back                 ✕  │
│ └────────┬──────────┘ │   │ Pick the one in your hand ✕│   │ [Available] [Sale]        │
│     ┌────┴────┐       │   │ Pikachu 025/165 EN        │   │ Pikachu 025/165 JP        │
│     │  card   │  tap  │──▶│ HK$80        [Available] ›│──▶│ HK$72                     │
│     │         │       │   │ Pikachu 025/165 JP        │   │ [ Open store page ]       │
│     └─────────┘       │   │ HK$72 [Sale] [Available] ›│   │  (only where carried)     │
└───────────────────────┘   └───────────────────────────┘   └───────────────────────────┘
```

## Components

Glint's own Preact parts; nothing from `@grade10/ui` or
`@grade10/design-system`, and no `@grade10/i18n` keys: the scanner's copy is
English in its code.

| Part | Exists | Use |
| --- | --- | --- |
| `ItemLabel` (callout and compact tag) | Yes | Adds a `<n> matches` chip; grade and cert chips only on a label read |
| `chip`, `name`, `price`, `meta` classes | Yes | Rows of the pick sheet, the `Sale` badge |
| `sheet`, `sheet-header`, `sheet-body` classes | Yes, `src/app/styles.css`, which the hosted page loads | The pick sheet |
| `IconClose` | Yes | Dismiss |
| Pick sheet (`PickSheet`) | **New** | The list, the picked item, Back and dismiss |

New copy, English only: `<n> matches`, `Pick the one in your hand`, `Back`,
`Open store page`, `Sale`.

## States

### Item label

| State | Shows | Anchor |
| --- | --- | --- |
| One match | Title, price, availability chip, `Tap for details ›` where a store page exists | `g10.store-shelf-scanning.SC35` |
| Two or more close matches | The closest item's title and price, a `<n> matches` chip, no availability chip | `g10.store-shelf-scanning.SC36` |
| Slab read by its label | A `<grader> <grade>` chip and a `Cert <cert>` chip | `g10.store-shelf-scanning.SC11` |
| Slab matched by its photos | The slab's title, price and availability; no grade or cert chip | `g10.store-shelf-scanning.SC39` |
| Slab matched by its label | The slab's title, price and availability, its grade and cert chips; no `<n> matches` | `g10.store-shelf-scanning.SC43` |
| On sale | A `Sale` chip beside availability; the price is what the shopper pays | `g10.store-shelf-scanning.SC25` |
| No store page in this build | No `Tap for details ›` | `g10.store-shelf-scanning.SC28` |
| Not recognised | "Not recognised yet — hold steady" | `g10.store-shelf-scanning.SC19` |

### Pick sheet

| State | Shows | Anchor |
| --- | --- | --- |
| List | `Pick the one in your hand`, one row per match closest first: title, price, `Sale` and availability chips, `›`; a close control | `g10.store-shelf-scanning.SC36` |
| List holding a slab | A slab's row as any other: title, price, `Sale` and availability chips; no grade or cert chip | `g10.store-shelf-scanning.SC41`, `g10.store-shelf-scanning.SC42` |
| Picked | `‹ Back`, the picked item's chips, title and price, and `Open store page` where the build carries the store | `g10.store-shelf-scanning.SC37` |
| Dismissed | The sheet closes and the camera view returns; nothing is chosen | `g10.store-shelf-scanning.SC38` |
| Item leaves the camera while open | The sheet keeps what it shows until dismissed | **Out of suite:** the hosted page's component test in `apps/backend/grade10/tcg-ar/test/app/`, task 3.1 |
| Embedded in a project's page | No sheet: the tap goes to the embedding page with every match, as today | **Out of suite:** `apps/backend/grade10/tcg-ar/test/app/` embed event test, task 3.1; no shop surface embeds the scanner in this change |
