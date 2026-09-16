## Context

- **Editor** — `RewardEditor` in `packages/loyalty/admin-frontend` composes
  `@grade10/frontend-console` words. Every word wraps an Astryx component, and
  no console imports Astryx directly (`pnpm run check:libs`)
- **Theme** — `grade10AdminTheme` is Stone with Grade10 colours; type, radii
  and control sizes are Stone's. The ZZZ admin renders Stone, and shares the
  console words
- **Draft** — `rewardCouponDraft.ts` folds the form into the fulfilment input.
  `{ kind: "free" }` is a Money off discount that saves as 10000 basis points
  with no cap
- **A live bug** — five Grade10 colour tokens (`--color-accent-muted`,
  `--color-neutral`, `--color-overlay`, `--color-overlay-hover`,
  `--color-error-muted`) ship as `COLOR-MIX(... VAR(--PRIMARY) ...)`: the
  theme upper-cases values, custom property names are case-sensitive, and the
  tokens resolve to nothing. The segmented track, the kind card fill and the
  dialog backdrop depend on them

## Goals / Non-Goals

**Goals:**

- The mock's controls and look on the three reward views, through console
  words and the theme only
- Nothing staging can do is lost

**Non-Goals:**

- No wire, backend or contract change
- No hint under its control: Astryx draws a field's description above the
  control, with no theme hook, and redrawing it in a dozen field words would
  re-wire each one's `aria-describedby`

## Decisions

The programme spec governs which kinds the form offers and how a stored
coupon reopens. The rest is appearance.

### Theme

Every value lives in `grade10AdminTheme`, the one brand mechanism, or in a
console word's structure — never a colour literal in a word.

| Value | Where it lives |
| --- | --- |
| Inter | `typography.body` and `heading` family `Inter Variable`; `@fontsource-variable/inter` imported in `apps/admin/grade10/src/index.css` |
| Code in the system monospace | `typography.code` `ui-monospace` |
| 14px body, 20px page title | `typography.scale` `{ base: 14, ratio: 1.2 }`, Stone's bold heading weights dropped |
| 13px secondary, 12px hints | tokens `--font-size-sm` 0.8125rem, `--font-size-xs` 0.75rem |
| 13px labels, buttons and segments | tokens `--text-label-size`, `--text-label-leading` |
| Panel title 14px | tokens `--text-heading-3-size` and leading, pointing at level 4's |
| Labels in main ink | `field-label` rule redirecting the secondary ink token; a disabled label keeps its own grey |
| Radii 8px / 6px | tokens `--radius-container`, `--radius-element` |
| Controls 36px, focus ring 2px out | tokens `--size-element-md`, `--focus-outline-offset` |
| Tints | brand rows `--color-success-muted`, `--color-warning-muted`, `--color-error-muted`; `--color-background-green/yellow/red/gray` refer to them |
| Field refusal text in main ink | `field-status` rules set `--color-text-primary`; badges keep dark status text |
| Marks 13px, code 12px | `input-group-text` and `code` rules |
| Basket check title 13px/500 | `collapsible-trigger` rule |
| Rewards list cells aligned to the top | `Table verticalAlign="top"` on that page; other tables stay middle |
| Segmented track and options | `segmented-control` rule; `segmented-control-item` base weight 400, chosen 500 on the muted fill |
| Table header 12px/500, cells 13px, small buttons 12px | `table-header-cell`, `table-cell` and `button` `size:sm` rules |
| Panel padding 20px | `Panel` word: normal padding 5, tight 3 |
| Kind card padding 16px | `ChoiceList` cards: `padding={4}` |
| Gaps 16px / 24px | word props: between panels 4, `Split` gap 6 |
| Kind card chosen | border `var(--color-accent)`, fill `var(--color-accent-muted)` |
| Rail label caps | `Text caps size="xs" weight="semibold" tone="secondary"`; `caps` adds only uppercase and letter spacing |

- **Built on Stone** — `defineTheme({ extends: stoneTheme })`, so each rule
  merges into Stone's per variant and states only what differs;
  `--text-supporting-size` stays pinned at 12px, which the 14px base would
  otherwise raise
- **Every reference resolves** — the theme keeps values in their written case,
  and `grade10AdminTheme.test.ts` expands each `var()` in tokens and component
  rules through the theme's tokens, then Astryx's defaults, failing on a name
  neither defines
- *Rejected:* overriding card padding in the theme — `Panel` always passes a
  padding, so the theme's card tokens never reach it; editing `stoneInput`,
  which is vendored and restyles ZZZ; the mock's tint hex values, which are
  not the brand's

### Headings

The outline is upside down today: `Panel` draws an `h3` announced as level 2,
and `SectionHeader` a plain `h3`, so a page's title sits under its own panels.
`SectionHeader` becomes a real `h2` and `Panel` a real `h3`; titles inside a
panel move to level 4. The end-to-end helpers that find the page title by
`heading level 3` move to level 2.

### Console Words

- **`ChoiceList appearance`** — `list` over Astryx `RadioList`; `segmented`
  over `SegmentedControl`, whose items are `radio` in a `radiogroup`, with
  `flexWrap: wrap` so options wrap inside the panel and the label drawn as
  text above; `cards` as `Card`s each holding a native radio stretched across
  it at opacity 0, named by the card title and described by its line, with a
  focus ring from the input. A group `disabled` sits beside each option's
  own. `Choice` throws on a `description` under `segmented`. `horizontal` is removed in the same commit as its eleven call
  sites. *Rejected:* `SelectableCard`, which announces a checkbox
- **`Filter` removed** — a second name for a hidden-label segmented choice;
  its eight callers and its announced-selection test move to `ChoiceList`
- **`UnitField unitAt`** — `start` or `end`; `MoneyField` passes `start`.
  `InputGroup` names the input by ids, so the accessible name stays
  `Amount HKD`. The mark stays the ISO code until the currency-mark question
  settles
- **`Split`** — wrap-based: the container wraps, the rail grows from its
  width, and the content keeps a minimum of `min(100%, 28rem)`, so the rail
  stacks when the form would get narrower, with no stylesheet or media query.
  At 1280px the reward rail sits beside the form; the product schemas page's
  560px rail stacks below 1440px, its own width choice. `sticky` pins the
  rail and is typed to `side: "end"` only, so a stacked rail never pins over
  the form. `ListingEditor` moves onto `Split side="end" sticky`
- **`Panel sticky="bottom"`** — the one way to pin a panel; `SaveBar` uses it.
  A pinned panel or rail sits one layer above the fields it passes over, as
  Astryx's own pinned header does; menus open in the browser's top layer, so
  they still open over it
- **`Notice`** — always a tinted Astryx `Card` (muted, yellow, red or green by
  tone, padding 3, element radius, no icon), with an optional `detail` and a
  `neutral` tone. The message is semibold only when a detail follows. Its
  words, message then detail, are read through Astryx `useAnnounce` when the
  notice appears and whenever they change: at once for an error with no
  detail, politely otherwise, and not at all for a neutral note, which states
  a fact about the page. A field's own refusal still goes through that
  field's `status`, tied to its control. A page announces an outcome of its
  own through `useAnnouncement(words, tone)`, the hook `Notice` uses, keeping
  the words in the one value it renders. *Rejected:* Astryx `Banner` and
  `FieldStatus` for notices, which draw an icon and, detached from a field,
  describe nothing; an `announce` prop on `Text` and `Stack`, which reads the
  words back from the page on every render and runs lines together
- **`UnitField` and `NumberField` units** — one internal frame, `InputGroup`
  with the mark in `InputGroupText`, 260px, with an optional placeholder; the
  field is named by its label then its mark (`Amount HKD`, `Cost points`).
  `compact` is a 44px count with no clear button, and cannot take `units`
- **`CheckList appearance="inline"`** — a group label over a wrapping row of
  checkboxes; `Check` throws on a description under it
- **`SearchPicker nothingPicked`** — opt-in words for an empty picked list;
  the list is framed with dividers and small remove buttons. An item may
  carry its own `name` for its remove button, so two variants of one product
  never share a label
- **On a surface** — `Panel`, `FormDialog`, `InfoDialog` and the sessions
  dialog tell their contents through context; `Table` draws its own frame
  only when not on one
- **`Text`** — `tone: "success"`, `weight: "semibold"`, `caps`
- **`Disclosure`** — over Astryx `Collapsible`, open when it appears
- **`SectionHeader back`** — `{ label, onPress }`, drawn as an Astryx `Link`
  with `onClick` and no `href`; the arrow is hidden from screen readers, so
  the link is named by its label alone

### Reward Editor

- **Free item is a draft kind** — `RewardHandoverDraft` gains
  `{ kind: "free_item"; variantId }`. `draftOf` maps 10000 basis points, no
  cap, and a variants target of length 1 to it; anything else stays money
  off. The fold writes the same product coupon Money off with `free` writes.
  `rewardGaps` names a missing `item`, and the basket bench seeds from the
  free item's variant. *Rejected:* choosing the card from the money-off fields
  on every render, which flips the card while an operator is still picking
- **One fold** — `foldReward(draft, editing, context)` returns the coupon, or
  none, with the parts still missing. The save, the save bar, the rail
  sentence and the basket check all read that one result, so the rail never
  shows a coupon the save bar refuses. A gift draft keeps the product handle
  it was picked with, so the fold depends on the draft alone
- **Sentence as parts** — `rewardSentence` returns `{ text, strong }[]` so
  the rail bolds values; `rewardTermsOf` for the list stays a string
- **Rail** — a `Stack` of tight `Panel`s (menu card, sentence) and the
  basket `Disclosure`, no outer panel; `Split sticky` keeps it in view
- **Verdict** — `basketVerdict.ts` is a pure module beside the draft, and the
  bench renders its result as a `Notice` with `detail`. The basket total
  comes from `goodsOf`, which `@grade10/coupons-contracts` exports, so it is
  the sum the minimum spend is checked against; a line's cut comes from the
  evaluator's per-line result, never recomputed in the view
- **Save bar** — `Panel sticky="bottom"` at the end of the page, after the
  form and the rail, so it stays on screen on a phone once the rail stacks
  under the form; the ready sentence in the success tone; a gap stays a quiet
  button that lands on its field

## Risks / Trade-offs

- [Every Grade10 admin page, and ZZZ's shared console pages, change look]
  → one before and after capture pass of the pages that use the changed
  words, posted on the pull request
- [Page titles move from heading level 3 to 2] → every assertion on the old
  level moves in the same commit; the suites fail loudly on any missed
- [A stored reward reopens as Free item although authored under Money off]
  → the two save the same coupon, so nothing an operator saves changes
- [Disabled segmented options carry `aria-disabled`, not `disabled`] → tests
  assert the attribute
- [Messages inside a modal dialog are not read: Astryx attaches its live
  regions to the page body, which an open modal hides] → not new; an issue
  on Astryx to attach them to the open dialog

## Migration Plan

No data. Rollback is a revert of the grade10 commits.

## Open Questions

- ❓ **Currency mark** — `HKD` or `HK$` in front of fields. If `HK$`,
  `MoneyField` takes it from `Intl.NumberFormat` `formatToParts`, and the
  accessible name follows the visible mark
