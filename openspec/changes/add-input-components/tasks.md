# Tasks

Blocked on, and not part of this change:

- [ ] **Add `--color-destructive-foreground` and `--color-success-ring` to `theme.preamble.css`, regenerate, and backfill both variables into `default.css`.** Neither slot exists today, so `text-destructive-foreground` is not a utility and `button.tsx:21`, `link.tsx:18` and `badge.tsx:17` all render an inherited colour. Its own change, because it restyles three shipped primitives. The `error` and `success` statuses below cannot bind anything until it lands.

Then:

- [ ] Confirm with design whether `Text Input Search` should gain a status axis, or whether a search field genuinely cannot be invalid. Blocks only the search component's prop surface; the other two can proceed.
- [ ] Build `InputShell` and reduce `Input` to a bare control in `forms/input.tsx` — the shell owns fill, border, radius, height and padding. Note the breaking change for anyone rendering `<Input />` standalone.
- [ ] `forms/text-input.tsx` — `status` cva axis (`default`/`error`/`success`), `label`, `message`, `loading`, native `disabled`.
- [ ] `forms/number-input.tsx` — the above plus `unit` and `onClear`.
- [ ] `forms/text-input-search.tsx` — leading magnifier, `onClear`, no status or message unless the question above changes that.
- [ ] Export all three from `src/index.ts`.
- [ ] `text-input.figma.ts`, `number-input.figma.ts`, `text-input-search.figma.ts`, each covering every option of every VARIANT property, with `status=placeholder` collapsing onto `default`.
- [ ] Stories per component: one per `status` option plus `Disabled`, `Loading`, `WithoutLabel`, `WithoutMessage`, and the component-specific ones. Do not export a story named `Error` — it shadows the global.
- [ ] Run `pnpm run check:design-system` with a `FIGMA_TOKEN` and get to zero errors. All three sets should stop reporting "no code component".
- [ ] Run `pnpm --filter @acetrader/design-system exec vitest run --project contracts`, `pnpm run typecheck`, `pnpm run lint`.
- [ ] Publish Code Connect for the three sets. `get_code_connect_map` returns `{}` for this file, so nothing reaches Dev Mode until a human publishes in Figma.

Decisions to settle before or during implementation, from the proposal:

- [ ] Does `Input` stay exported once it is no longer a self-contained box?
- [ ] Is `TextInputSearch` the export name, or does the Figma set get renamed to `Search Input`?
- [ ] `unit` as `string` or `ReactNode`?
