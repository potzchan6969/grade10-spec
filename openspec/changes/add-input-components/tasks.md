# Tasks

Prerequisite, landed first and separately:

- [x] **Add `--color-destructive-foreground` and `--color-success-ring` to `theme.preamble.css`, regenerate, and backfill both variables into `default.css`.** Neither slot existed, so `text-destructive-foreground` was not a utility at all and `button.tsx:21`, `link.tsx:18` and `badge.tsx:17` rendered an inherited colour. Landed in its own commit because it also restyles those three.

  `--destructive-foreground` is derived in the baseline as the destructive *text* tone, which is how every component binds it. Note the consequence: `Badge`'s `error` variant pairs it with `bg-destructive`, which in the baseline theme is shadcn's solid red rather than acetrader's dark tint, so that one pairing is now visibly low-contrast where it was previously invisible. Left for whoever owns Badge's baseline treatment.

Then:

- [x] Rename the Figma set `Text Input Search` to `Search Input` (`2132:2782`), so the file, the export and the design agree. Variant names untouched, so no instance was repointed.
- [x] Build `InputShell` and reduce `Input` to a bare control in `forms/input.tsx` — the shell owns fill, border, radius, height and padding. Breaking for anyone rendering `<Input />` standalone.
- [x] `forms/text-input.tsx` — `status` cva axis (`default`/`error`/`success`), `label`, `message`, `loading`, native `disabled`.
- [x] `forms/number-input.tsx` — the above plus `unit` and `onClear`.
- [x] `forms/search-input.tsx` — leading magnifier, `onClear`, no status or message.
- [x] Export all three from `src/index.ts`.
- [x] `text-input.figma.ts`, `number-input.figma.ts`, `search-input.figma.ts`, each covering every option of every VARIANT property, with `status=placeholder` collapsing onto `default`.
- [x] Stories per component, plus a rewritten `input.stories.tsx` covering `InputShell`, whose cva the `contracts` project reads.
- [x] Run the checks. `check:design-system` against the published listing: **zero errors**, and all three sets resolve to a code component with every axis mapped. 65 contract tests, 214 story tests across 27 files, typecheck and lint all pass.
- [x] Verify in a browser rather than trusting the smoke tests: every status, disabled, loading, the unit and both clear buttons render as drawn, and `focus-within` switches an error field's border from `--destructive-ring` to `--ring` — confirmed by reading the computed style, since a 1px border is not something to judge from a thumbnail.
- [ ] Confirm with design whether `Search Input` should gain a status axis, or whether a search field genuinely cannot be invalid. Only the search component's prop surface depends on it.
- [ ] Publish Code Connect for the three sets. `get_code_connect_map` returns `{}` for this file, so nothing reaches Dev Mode until a human publishes in Figma.

## Known gap in the mechanical check

`check-components.mjs` reads cva axes from the file whose basename matches the Figma set. The `status` cva lives in `input.tsx`, on `InputShell`, so for all three components the checker sees no cva and reports `status: mapped to a non-variant prop` — meaning **the `status` option names are not mechanically diffed against Figma for these three**. `input.tsx` is not checked either, because no Figma set is named `Input`.

TypeScript covers the seam between the components and the shell, since each imports `InputStatus`. What is unchecked is the seam between the templates' emitted strings and the cva. Closing it would mean teaching the checker to follow the shell import, or duplicating the axis into each component, which would mean duplicating the class strings — the worse of the two.

Decisions still open, from the proposal:

- [ ] Does `Input` stay exported now that it is no longer a self-contained box? It is currently exported, and has no Figma counterpart.
- [x] `unit` takes `ReactNode`, not `string` — it costs nothing and allows a currency glyph or a small control where Figma draws only text.
