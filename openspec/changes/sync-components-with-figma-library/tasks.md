# Tasks

Done:

- [x] Enumerate every published component in `jlrBVwtKcun1NnJgohmFcn` via `list_file_components_for_code_connect` — 35 components across 20 pages, with the exhaustive VARIANT option list and property keys for each.
- [x] Record that `get_metadata` with no node id returns only the "Tokens" page for this file, so the component pages are reachable only through the published-components listing.
- [x] Map all 35 against the 19 components in `packages/design-system/src/components`, classifying each as matched, partial, missing, or code-only. Result is the inventory table in the proposal.
- [x] Read `get_design_context` for Avatar (`2159:3275`), Badge (`2132:2294`) and Card (`2176:3946`) to get resolved values rather than variable names.
- [x] Retarget Avatar's `size` axis onto Figma's rungs: rename `md` → `default` and move the three rungs from 24/32/40px to 32/48/64px. Scale `AvatarBadge` and `AvatarGroupCount` proportionally, flagging in source that Figma draws neither.
- [x] Replace Badge's six shadcn variants with Figma's `default`/`success`/`error`/`warning`, add the `size` axis (24px / 20px), bind `Radius/radius-sm` directly rather than through the derived `rounded-sm` ladder, and add the `--border` hairline every variant carries.
- [x] Replace Card's `size` axis with Figma's `padding` boolean, driving it through the existing `--card-spacing` variable so the sub-parts stay the single place spacing is read. Move to `rounded-lg` (8px) and a `--border` hairline.
- [x] Write `avatar.figma.ts`, `badge.figma.ts` and `card.figma.ts`, each with a `getEnum` covering every option of every VARIANT property. Card's body is read with `getSlot("Slot#2176:171")` rather than by walking children, so nested instances keep their own templates.
- [x] Update `badge.stories.tsx`, `avatar.stories.tsx` and `card.stories.tsx` so every cva option has a story — required by the `contracts` vitest project, which reads the option list out of the cva itself.
- [x] Run `pnpm run typecheck` — passes. Caught `getChildren()` not existing on `InstanceHandle`; the SLOT property is read with `getSlot`.
- [x] Run `pnpm --filter @acetrader/design-system exec vitest run --project contracts` — 46 tests pass.
- [x] Run `pnpm run lint` — passes. Caught a `Badge` story exported as `Error`, shadowing the global; renamed to `ErrorStatus`.

Remaining:

- [ ] **Re-run `pnpm run check:design-system` with a `FIGMA_TOKEN` set.** This audit was done through the MCP server because no token is available in this environment. The checker compares resolved colour and geometry values per variant, which the MCP listing does not, so it may find value-level drift this sweep did not. It is also the only mechanical confirmation that the three new templates map cleanly.
- [ ] **Publish Code Connect for Avatar, Badge and Card.** `get_code_connect_map` still returns `{}` for this file, so Dev Mode shows no connected code for any component regardless of template correctness. Needs a human in Figma.
- [ ] Decide the Badge migration path for consuming applications, and write it up — `outline`, `ghost` and `link` have no replacement.
- [ ] Reconcile `Blur/blur-md`: Figma reports 6px, `tokens.json` says 12px. Fix in `tokens.json` and regenerate, or correct the Figma variable. The Figma leg needs a human running the plugin.

Missing components, each needing its own change (`<name>.tsx` + `.figma.ts` + `.stories.tsx`). Ordered so dependencies land first:

- [x] `Icon Button` (`2159:3195`) — `variant` outline/ghost, `size` sm/xs, `state` default/hover/disabled, landed as `forms/icon-button.tsx`. Square box at `Size/size-8` and `Size/size-6` with 14px and 12px icons, `Radius/radius-sm` bound directly, `Base/border` on `outline` only, `Base/accent` on hover for both tones, and `Custom/disabled-foreground` when disabled. Unblocks Banner, Toast and Dialog Header, all of which compose it. Closes the icon-button gap [`adopt-figma-button-styling`](../adopt-figma-button-styling/proposal.md) recorded when it deleted the `icon-*` rungs.

  The icon is a bare INSTANCE_SWAP with no BOOLEAN gate, so the template always emits it. The component has no visible label, so the snippet carries an `aria-label` placeholder rather than emitting an unnamed control; `aria-label` is not a required prop, because `DialogClose render={<IconButton />}` names itself with a visually hidden child instead.

- [x] `Link` (`96:341`) — `variant` default/secondary/error, `state`, `size` default/sm/xs, landed as `forms/link.tsx`. Closes the other gap that change recorded. Built on `useRender` rather than an `<a>` so a router link can supply navigation, matching how `Badge` handles the same problem.

  Sized off the Sizing collection at 16/24, 14/20 and 12/16, each with an icon matching its type size. Tones are `Base/foreground`, `Base/secondary-foreground` and `Status/destructive-foreground`; `state=disabled` collapses all three onto `Custom/disabled-foreground`, so `disabled` is a boolean gate rather than a tone. It sets `aria-disabled`, since `<a>` has no `disabled` attribute.

  **Figma's `hover` binds the same variables as `default`.** Confirmed by reading `get_variable_defs` on `86:3524` and `86:3508` separately — both return `Base/foreground` and nothing else. The link is therefore shipped with no hover treatment, because inventing one would be a code-only surface. Raised as an open decision below.

- [x] `List Item` (`2176:4213`) and `List` (`2176:4224`), landed together in `display/list.tsx`. Both are variant-less COMPONENTs, and `check-components.mjs` only collects `COMPONENT_SET` nodes, so neither needs its own basename to resolve — the same reason `dialog.tsx` already holds several Figma components. Each still gets its own template.

  Figma draws the divider as a bottom hairline belonging to the item, not as a separator between items, which is why the last item switches it off rather than the list dropping the final one. `showDescription` and the label are expressed as the presence of a value rather than as their own booleans.

- [x] `Radio Button` (`2213:130`), `Radio List Item` (`2213:142`), `Radio List` (`2213:392`). The first two are COMPONENT_SETs, so they take their own basenames — `radio-button.tsx` and `radio-list-item.tsx` — to resolve under the checker's `norm()`. Built on base-ui's `radio` and `radio-group`, with the group owning the value and the items stateless.

  `RadioListItem` wraps both parts in a `<label>`, which is what makes the text clickable; Figma draws the pair but cannot express the association. `disabled` dims the label as well as the control, so the tone sits on the label.

  The capitalisation split is real and is now load-bearing: `Radio Button` uses `True`/`False` and `Radio List Item` uses `true`/`false`. Both templates match their own set verbatim, and each carries a comment saying so. Still worth normalising in Figma — an unannounced rename on either set is a checker error.

- [x] **Backfilled the `Custom/field` token, which was missing from `tokens.json` entirely.** Figma's Radio binds it (`#f9f9f91a`, confirmed via `get_variable_defs` on `2213:131`), and `theme.css` already mapped `--color-field: var(--field)` from the preamble, but no `--field` value existed in `tokens.json` or in either theme — so `bg-field` would have rendered no background at all under both. Added to `tokens.json` as `{slate-50-opacity-10}`, which resolves to exactly the Figma value, and regenerated. Backfilled a derived `--field` into `default.css` in both `:root` and `.dark` per the theme-coverage rule.

  This was reached through the sanctioned edit point rather than by substituting `bg-muted`, which resolves to the same colour in the acetrader theme and would have hidden the gap behind a wrong name. `--field-border` and `--field-disabled` are mapped in the preamble and still have no token behind them; nothing binds them yet.
- [ ] `Checkbox Button` (`2176:4089`), `Checkbox List Input` (`2176:3979`), `Checkbox List` (`2213:240`) — extends the existing `forms/checkbox.tsx`.
- [ ] `Text Input` (`2132:2715`) `status` and `state` axes onto `forms/input.tsx`, then `Number Input` (`2176:4273`) and `Text Input Search` (`2132:2782`).
- [ ] `Segmented Control Item` (`2121:898`) and `Segmented Control` (`2121:1039`).
- [ ] `Banner` (`2176:3488`) — `status` default/warning/error/success. Composes Icon Button and Link.
- [ ] `Empty State` (`2176:4183`) — composes Button.
- [ ] `Stat` (`2132:2201`) — composes Link.
- [ ] `Clickable Card` (`2176:3951`) — `padding` and `state` default/hover.
- [ ] `Icon Dialog` (`2213:104`) — composes Button.
- [ ] `Inline Text Tooltip` (`2159:3382`) — `variant` primary/secondary, `size` default/sm. Distinct from the existing `Tooltip`.
- [ ] Add `selected` and `state` to `Tab`, and the leading/trailing icon slots, on `display/tabs.tsx`.
- [ ] `Table Header Cell` (`2220:498`) and `Table Cell` (`2220:642`) — deferred while the page is marked WIP. `Table Cell` is also the one set still using capitalised property names (`Type`, `State`, `Alignment`), against the lowercase convention every other set adopted.
