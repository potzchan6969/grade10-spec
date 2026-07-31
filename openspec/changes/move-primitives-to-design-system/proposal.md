# Move the portable primitives onto the design system

PRD: Not applicable. No product surface, flow, or user outcome changes. This is a package-boundary decision about where a primitive lives, which `AGENTS.md` requires be recorded before the two packages are allowed to depend on each other.

## Why

`packages/ui-components` shipped its own primitive layer — `Button`, `Badge`, `Skeleton`, `Stack`, `Surface`, `Text`, `SegmentedControl` — styled by hand-written `.at-*` rules in `styles.css` against a private `--at-*` token set. `packages/design-system` shipped a second primitive layer over the same product, styled by Tailwind utilities against the tokens generated from `tokens.json`.

Two consequences followed:

- The `--at-*` palette was a hardcoded copy of a design decision. `--at-brand: #a78bfa` had no relationship to `--primary`, so a token pulled from Figma reached the design-system Button and never reached the portable one. Nothing detected the drift, because nothing compared them.
- The portable Button offered `variant="primary" | "secondary" | "ghost"` and `size="small" | "medium"`. `docs/governance/design-code-sync.md` requires that a component not offer a rung the Figma set does not define; that rule was enforced on the design-system Button and not on this one, which is how the two ended up disagreeing about what a "primary" button looks like.

The portable package's reason to exist is the composites — `FeaturedMarkets` and the payment dialog suite — not a second Button.

## Scope

- Delete all seven primitives from `packages/ui-components/src` and from its public export surface.
- Add `Skeleton`, `Text`, and `Stack` to `packages/design-system`, which had no counterpart for them.
- Recompose `FeaturedMarkets*` and `PaymentDialogs` on the design-system primitives.
- Rewrite `packages/ui-components/styles.css` so it carries composite layout and chrome only, reading the design-system tokens rather than a private `--at-*` set.
- Replace the `tsc` build with a bundling build so the published artifact stays installable by a submodule consumer (see `design.md`).

## Consumer impact

**Breaking.** Seven components and nine types leave the public API of `@acetrader/pred-spec-ui`:

| Removed export | Replacement |
| --- | --- |
| `Button`, `ButtonProps` | `Button` from `@acetrader/design-system` |
| `Badge`, `BadgeProps` | `Badge` from `@acetrader/design-system` |
| `Skeleton`, `SkeletonProps` | `Skeleton` from `@acetrader/design-system` |
| `Stack`, `StackProps` | `Stack` from `@acetrader/design-system` |
| `Text`, `TextProps` | `Text` from `@acetrader/design-system` |
| `Surface`, `SurfaceProps`, `SurfaceButtonProps` | `Card` from `@acetrader/design-system`, or the consumer's own container |
| `SegmentedControl`, `SegmentedControlOption`, `SegmentedControlProps` | `Tabs` from `@acetrader/design-system` |

A consumer importing any of them fails to compile, deliberately. The design system is not published, so a consumer that used the portable primitives directly must either take the design-system primitives from this repository's source or supply its own — the portable package no longer offers a primitive layer.

Every composite export keeps its name and its prop types. `FeaturedMarketsProps`, `PaymentDialogProps`, and the rest are unchanged, including the `tone` unions on `FeaturedMarketStat`, `FeaturedAsset.odds`, and `FeaturedMarketOutcomeValue`. A consumer that only renders composites needs no code change.

Two visible behaviour changes inside the composites:

- The payment action button now uses the design-system Button's `loading` prop, so a loading action shows a spinner beside its own label instead of replacing the label with "Loading…".
- The mobile tab strip and the market source selector are now `Tabs`, which is keyboard-navigable with arrow keys where `SegmentedControl` was not.

Styling moves from `--at-*` to the design-system tokens. A consumer that overrode `--at-brand` or `--at-layer` on an ancestor loses that override; the equivalents are `--primary` and `--card`, and `class="theme-acetrader"` selects the AceTrader values.

## Non-goals

- `PaymentDialog` keeps its own focus-containment implementation rather than moving to the design-system `Dialog`. It is a composite with a controlled `open`/`onOpenChange` contract, not a primitive, and swapping its internals is a separate change with its own consumer-visible surface.
- The two packages are not merged. `packages/ui-components` now depends on `packages/design-system`; the reverse dependency is still forbidden.
- No Figma work. See "Open decisions".

## Open decisions

| Question | Owner | Note |
| --- | --- | --- |
| `Skeleton`, `Text`, and `Stack` have no Figma component set. | Design | `design-code-sync.md` requires the Figma set first, and these three were added the other way round because the composites already depended on the contract. Their axes are a port of what `packages/ui-components` already shipped, not a new design. They need drawing and publishing, then a `.figma.ts` template each, before `pnpm run check:design-system` can say anything about them. Recorded here rather than absorbed silently. |
| Badge has no success rung. | Design | `FeaturedAsset.odds.tone` is `"success" \| "error"`. Badge defines `destructive` but nothing positive, so the success tone is applied from the `--success` / `--success-foreground` pair through `className` at the one call site instead of being invented as a Badge variant. If a positive badge is a real design concept, it belongs in the Figma set. |
| Button has no icon-only rung. | Design | Removed from the design-system Button by [`adopt-figma-button-styling`](../adopt-figma-button-styling/proposal.md) as a rung Figma does not define. The two market header actions were `iconOnly` buttons and now apply `aspect-square px-0` through `className`, the same workaround `dialog.tsx` uses. This is the second component to need it. |
| Should the portable package ship the AceTrader theme values at all? | Product + Design | `styles.css` currently vendors `default.css` and `acetrader.css` both, so a consumer can opt in with `class="theme-acetrader"`. Shipping only the baseline would make the portable components look unbranded by default. |
