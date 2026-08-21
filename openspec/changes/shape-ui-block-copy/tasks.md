# Tasks: The words a block renders, shaped and typed as words

Groups 1 to 4 land in grade10-spec, one block family at a time so each is
reviewable on its own; group 5 is the application, behind the submodule bump.
Group 1 establishes the rule and the first worked example — the rest follow
its shape and can be claimed in parallel once it lands.

## 1. The rule, and the listing surface (grade10-spec) (owner: @sean)

- [ ] 1.1 Make `A consumer reads what a block needs`, `A slot takes markup, a
      word does not` and `A word can be an accessible name` pass for the
      listing blocks: `ProductBrowse`, `FilterPanel`, `CollectionMenu`,
      `CollectionMenuItem`, `ProductListHeader`, `ProductList` and
      `ProductCard` each export a copy type and take one `copy` prop, every
      word in it typed `string`, slots and values left as their own props.
- [ ] 1.2 Make `A tile is named once` pass: a tile's card name and its cart
      control's name come from the copy type, and `ariaLabel` retires.
- [ ] 1.3 Make `A surface declares its words once` and `A part is reused
      alone` pass: `ProductBrowseCopy` composes the copy types of the blocks
      it renders, and each of those still renders outside it.
- [ ] 1.4 Update the listing stories and the preview assemblies to pass copy
      objects, and record the rule in
      `docs/governance/ui-component-contracts.md` — a word is a string, a slot
      is a node, values stay their own props.
- [ ] 1.5 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and
      `pnpm run test:stories` as this group's verification.

## 2. The site chrome (grade10-spec)

Depends on group 1 landing: it follows the shape group 1 sets.

- [ ] 2.1 Make `The chrome's words arrive as one group` and `An application
      imports the chrome` pass: `Nav` and `Footer` export `NavCopy` and
      `FooterCopy`, take one `copy` prop each, and keep destinations,
      handlers, regions and the locale set as their own props.
- [ ] 2.2 Make `A page renders one without the other` pass over the new shape,
      and update the chrome stories.
- [ ] 2.3 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and
      `pnpm run test:stories` as this group's verification.

## 3. The auction listing blocks (grade10-spec)

Depends on group 1 landing.

- [ ] 3.1 Give `ListingBidPanel`, `ListingGallery`, `ListingDetails` and
      `ListingProduct` a copy type each and one `copy` prop, every word typed
      `string`, with `standing`, `watchAction`, `history` and `actions` left
      as slots and `price`, `remaining`, `deadline` and `bidCount` as values.
- [ ] 3.2 Retire `showHistoryLabel` and `hideHistoryLabel`, which are already
      deprecated and have no behavior behind them.
- [ ] 3.3 Update the auction stories, including the live bidding demo, and run
      `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and
      `pnpm run test:stories` as this group's verification.

## 4. The sign-in, two-factor and profile blocks (grade10-spec)

Depends on group 1 landing.

- [ ] 4.1 Give `SignInCard`, `SignInEmailForm`, `SignInCodeForm`,
      `TwoFactorEnrollment`, `TwoFactorVerifyForm`, `ProfileCard`,
      `ProfileDetails` and `ProfileForm` a copy type each and one `copy` prop,
      keeping `providerSlot` and the async body as slots.
- [ ] 4.2 Note in the proposal's non-goals what remains: these blocks still
      have no capability spec naming their exports, and this change does not
      add one.
- [ ] 4.3 Update their stories and run `pnpm run typecheck`, `pnpm run lint`,
      `pnpm run test`, and `pnpm run test:stories` as this group's
      verification.

## 5. The applications compose the blocks' copy (grade10)

Depends on groups 1 to 4 being pushed.

- [ ] 5.1 Bump `external/grade10-spec` and rebuild each slice's copy type from
      the blocks' — `ListingViewCopy`, `ProfileViewCopy` and `SignInFlowCopy`
      compose rather than restate — with the catalog mapping written for
      `add-site-localization` re-pointed at the composed shape.
- [ ] 5.2 Confirm nothing a collector reads changed: the pages render the same
      strings in every language, and `No raw key on screen` still holds at
      typecheck.
- [ ] 5.3 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      `pnpm run test:backend`, and `pnpm run build` as this group's
      verification.
