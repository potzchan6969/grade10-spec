# Sync design-system components with the Figma library

PRD: Not applicable. This records a design-side inventory against the code package; every requirement below already exists as a published Figma component set.

## Why

`packages/design-system` was audited component-by-component against every published component in `jlrBVwtKcun1NnJgohmFcn` (Sean-x-Constance). The library publishes **35 components across 20 pages**; the package ships **19 components**, of which **6 have no Figma counterpart at all** and **only 2 matched the design before this change** (Button, from [`adopt-figma-button-styling`](../adopt-figma-button-styling/proposal.md), and Tooltip).

The audit could not be run through `scripts/check-components.mjs`, which needs a `FIGMA_TOKEN` that is not set in this environment. It was done instead through `list_file_components_for_code_connect`, which returns the exhaustive published property graph, plus `get_design_context` per component for the resolved values. The checker should be re-run with a token to confirm the findings mechanically.

Note that `get_metadata` with no node id reports a single page named "Tokens" for this file. That is not the library — it is the token-documentation page. The component pages are only reachable through the published-components listing, which is worth knowing before concluding the file is empty.

## Inventory

**Matched and synced in this change** — the design defines axes the code did not have:

| Figma | Node | Code | Was | Now |
| --- | --- | --- | --- | --- |
| Avatar | `2159:3275` | `display/avatar.tsx` | `size` = `sm`/`md`/`lg` at 24/32/40px | `size` = `sm`/`default`/`lg` at 32/48/64px |
| Badge | `2132:2294` | `display/badge.tsx` | `variant` = 6 shadcn tones, no `size` | `variant` = `default`/`success`/`error`/`warning`, `size` = `default`/`sm` |
| Card | `2176:3946` | `display/card.tsx` | `size` = `default`/`sm` | `padding` boolean |

**Matched already:** Button (`86:3459`), Tooltip (`2159:3379`).

**Partial — the code component exists but models none of the design's axes:**

| Figma | Node | Code | Gap |
| --- | --- | --- | --- |
| Text Input | `2132:2715` | `forms/input.tsx` | Design has `status` (default/placeholder/error/success) and `state` (default/focus/disabled/loading), plus label, message and placeholder properties. Code is a bare `<input>` with no axes. |
| Checkbox Button | `2176:4089` | `forms/checkbox.tsx` | Design splits `value` and `disabled` into VARIANT axes; code carries neither as a prop. |
| Tab | `2121:1139` | `display/tabs.tsx` | Design has `selected` and `state`, and leading/trailing icon slots. Code's `TabsList` has a `variant` = `default`/`line` axis the design does not define. |
| Tab List | `2121:1331` | `display/tabs.tsx` | Slot only in Figma. |
| Dialog / Dialog Header | `2159:3169`, `2159:3156` | `overlays/dialog.tsx` | Roughly aligned; Figma's header carries `title` and `close` as properties. |
| Dropdown Menu / Item | `2132:1693`, `2121:1385` | `overlays/dropdown-menu.tsx` | Design's item has `state` = default/hover/disabled; code has `variant` = default/destructive. |
| Toast | `2159:3352` | `overlays/sonner.tsx` | **Basename mismatch.** `check-components.mjs` resolves Figma → code by basename, so `Toast` will report "no code component" against `sonner.tsx` however well they agree. |

**Built in this change:**

| Figma | Node | Code | Axes |
| --- | --- | --- | --- |
| Icon Button | `2159:3195` | `forms/icon-button.tsx` | `variant` outline/ghost, `size` sm/xs, `state` → `disabled` |
| Link | `96:341` | `forms/link.tsx` | `variant` default/secondary/error, `size` default/sm/xs, `state` → `disabled` |

Both close gaps [`adopt-figma-button-styling`](../adopt-figma-button-styling/proposal.md) recorded as explicit non-goals when it deleted Button's `link` variant and its four `icon-*` rungs as undesigned.

**Missing — published in Figma, absent from code (17):**

Banner (`2176:3488`), Clickable Card (`2176:3951`), Checkbox List (`2213:240`), Checkbox List Input (`2176:3979`), Icon Dialog (`2213:104`), Empty State (`2176:4183`), Number Input (`2176:4273`), Text Input Search (`2132:2782`), List (`2176:4224`), List Item (`2176:4213`), Radio Button (`2213:130`), Radio List (`2213:392`), Radio List Item (`2213:142`), Segmented Control (`2121:1039`), Segmented Control Item (`2121:898`), Stat (`2132:2201`), Inline Text Tooltip (`2159:3382`).

Table Header Cell (`2220:498`) and Table Cell (`2220:642`) sit on a page named "Table (WIP)" and are excluded until design marks them ready.

`Link` is the component [`adopt-figma-button-styling`](../adopt-figma-button-styling/proposal.md) named as its explicit non-goal when it deleted `Button variant="link"`. That gap is still open, and so is the icon-button gap the same change recorded.

**Code-only — no Figma counterpart (6):** `display/separator.tsx`, `display/skeleton.tsx`, `display/text.tsx`, `forms/label.tsx`, `forms/select.tsx`, `layout/stack.tsx`.

Per [`design-code-sync.md`](../../docs/governance/design-code-sync.md) these are warnings, not errors — a code-only surface may be deliberate. `select.tsx` is the notable one: it is a real interactive control with a `size` axis that no designer has drawn.

## Scope

This change lands the three matched components above and their Code Connect templates. Everything else is recorded as a task rather than implemented, because each missing component is a new public contract that consuming applications must adopt, and because several depend on components that do not exist yet (Banner and Toast both compose Icon Button; the Radio and Checkbox lists compose their own item sets).

## Consumer impact

All three synced components are **breaking** changes to the exported contract, shipped from source with no version bump.

**Badge** is the sharpest. Its variant vocabulary shares only the name `default` with what it had, and `default` itself changes meaning — from a solid `--primary` fill to the `--muted` tint Figma draws.

| Removed | Nearest replacement |
| --- | --- |
| `variant="secondary"` | `variant="default"` — both now resolve to `--muted`. |
| `variant="destructive"` | `variant="error"`. Note the fill changes from `--destructive/10` to solid `--destructive`. |
| `variant="outline"` | None. Every variant now carries the `--border` hairline. |
| `variant="ghost"` | None. |
| `variant="link"` | None — same reasoning as Button's: a link is the separate `Link` set. |

The badge is also no longer a pill: Figma binds `Radius/radius-sm` (4px), not a full round. It gains a `size` axis (24px / 20px) and drops the `has-data-[icon=*]` padding tightening, since Figma pads both sides equally and separates the icon with `gap-1`.

`move-primitives-to-design-system`'s migration table maps `Badge tone="success"` onto `variant="secondary"` plus utility classes with the note "No success rung exists". One does now — that row is superseded.

**Avatar** renames the middle rung `md` → `default` and moves every rung up roughly 1.5×. Any layout assuming a 32px avatar now gets 48px. `AvatarBadge`, `AvatarGroup` and `AvatarGroupCount` have no Figma counterpart; their sizes are derived proportionally from the new rungs and are flagged as such in the source.

**Card** replaces `size` with `padding` and drops from a 16px to Figma's 12px spacing, an `--radius-lg` (8px) corner instead of `rounded-xl`, and a `--border` hairline instead of `ring-1 ring-foreground/10`.

## Non-goals

No component is created here. The sixteen missing ones are enumerated as tasks, not built, and each needs its own change once design confirms the page is settled.

The `line` variant on `TabsList` is left in place rather than deleted. Governance classes a code-only surface as a warning that may be deliberate, and removing it is a breaking change with no design counterpart to replace it — that decision belongs to design, not to this sweep.

`Toast` / `sonner.tsx` is left unrenamed for the same reason: the rename is mechanical but it changes an export path that consuming apps import.

## Open decisions

| Question | Owner | Note |
| --- | --- | --- |
| **Does `Link` have a hover state?** | Design | The set has a `state=hover` option for all three tones, but every hover variant binds exactly the same variables as its `default` twin — `get_variable_defs` on `86:3524` and `86:3508` returns `Base/foreground` for both, and nothing else. `link.tsx` therefore ships with no hover treatment, which is almost certainly not the intent for a text link. Either the hover variants need a distinct binding, or the axis should be dropped. |
| Should `Dialog`'s close button be repointed onto `IconButton`? | Eng | It currently renders `Button variant="ghost"` with `className` sizing, a workaround from when no icon button existed. Figma's `Dialog Header` composes `Icon Button`, so the two should converge — left out of this change to keep it reviewable. |
| Does Badge's variant rename need a codemod for consuming apps? | Eng | `secondary` → `default` and `destructive` → `error` are mechanical; `outline`, `ghost` and `link` have no target and need a human. |
| Should `TabsList variant="line"` be drawn in Figma, or dropped from code? | Design | It is the only code-only variant on an otherwise matched component. |
| Should `select.tsx` be drawn in Figma? | Design | It is a real control with a `size` axis and no design counterpart. Figma has `Dropdown Menu`, which is a menu, not a form select. |
| Rename `sonner.tsx` → `toast.tsx` so the checker can resolve it? | Eng | Required for `check-components.mjs` to ever match Figma's `Toast`; breaks the import path. |
| Is `Blur/blur-md` 6px or 12px? | Design + Eng | Figma's Blur collection reports 6px; `tokens.json` and the generated theme both say 12px. Badge's status variants bind `backdrop-blur-md`, so the drift is now visible. This is a token-pipeline fix, and the Figma leg needs a human running the plugin. |
| Should Card's sub-parts be drawn? | Design | Figma's Card is a shell around one slot. The code ships `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent` and `CardFooter`, none of which the design defines. |
