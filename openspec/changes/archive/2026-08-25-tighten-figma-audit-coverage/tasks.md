## 1. Detect an omitted value (grade10-spec)

- [x] 1.1 Raise a fill expectation from the node rather than from the class list, so a node drawing a visible solid fill that no `bg-*` class claims is a finding naming the drawn value — making *The design fills a frame the code does not* and *The code paints a fill the design does not* pass.
- [x] 1.2 Raise the same expectation for a visible stroke against `border-*`, in both directions — making *A stroke on one side only* pass.
- [x] 1.3 Hold the silent cases: a node with no fill and an element with no background reports nothing, and a property the node may leave unstated still reports as unchecked — making *Neither draws the value* and *A property the node may leave unstated* pass.
- [x] 1.4 Confirm the tightened rail leaves the existing corpus green: `pnpm run figma:audit --all-blocks` still passes all 9 entries across `store-home` and `store-product-listing`, none of whose nodes states a solid fill.

## 2. Reach every audited component (grade10-spec)

- [x] 2.1 Turn the sweep's single root into a list covering both `packages/ui/src/blocks` and the design-system component directories, keeping the `shared/` exemption keyed by path — making *A design-system component carries an audit table* pass.
- [x] 2.2 Group the uncovered tail by root so a gap in the design system is distinguishable from a gap in the blocks — making *A component with no audit table* pass.
- [x] 2.3 Verify the summary still names unchecked classes individually and distinguishes a run that checked nothing from one that matched everything — making *A run with unchecked classes* and *Nothing could be checked* pass.

## 3. Put the site chrome under the rail (grade10-spec)

- [x] 3.1 Write `packages/design-system/src/components/layout/audit.json` covering `Nav` and `Footer` — their roots plus the regions each conversion styled (promo bar, utility row, nav bar; footer grid, bottom bar), each entry naming its Figma node — making *The site chrome is covered* pass.
- [x] 3.2 Run the sweep and record what it finds; every finding against `Nav` must be absent and every finding against `Footer` must be the palette drift group 4 resolves.

## 4. Repaint the footer to its design source (grade10-spec)

- [x] 4.1 Move the `Footer` frame onto `primary` with `primary-foreground` strings throughout, per ui-design.md — Site footer.
- [x] 4.2 Move the outer stroke off the `<footer>` element and onto the bottom bar's top edge only, and settle the stroke token question ui-design.md — Components leaves open: settled as the primitive bound directly, because that is what Figma binds — the stroke aliases the Foundation primitive, not a Semantic slot.
- [x] 4.3 Remove the divergence note from `footer.tsx`'s JSDoc and describe the palette the component now renders.
- [x] 4.4 Re-check every footer story against the dark palette, including the absent-section states ui-design.md — States lists; no story may show a string at the same tone as its ground.
- [x] 4.5 Run `pnpm run figma:audit --all-blocks` and confirm it is green with the chrome covered.

## 5. Record the product and verify (grade10-spec)

- [x] 5.1 Add the `design-sync` product bullet to `openspec/specs/README.md`, per its "Adding a product" note.
- [x] 5.2 Update the audit step's description in `.github/workflows/design-sync.yml` to say it sweeps both packages, so the nightly's own text does not still call it a block sweep.
- [x] 5.3 Run `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run check:design-system`, and `pnpm run figma:audit --all-blocks`; then `openspec validate tighten-figma-audit-coverage --strict`.
