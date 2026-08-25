## Screens

This change alters one rendered surface: the site footer, on every page of
every store that renders it. No new screen is added.

### Site footer

[Figma `Footer` — `4171:9653`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9653)

The frame is the layout's source of truth and is unchanged by this work. What
changes is that the implementation comes to match it: the frame fills with
`Base/primary` and sets every string in `Base/primary-foreground`, and the only
stroke in the frame sits on the top edge of `Footer Bottom Bar` (`4171:9598`),
not on the outer frame.

### Site header

[Figma `Nav` — `4171:9937`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9937)

Listed because it enters audit coverage, not because it changes. Its root fill
(`Base/background`) was corrected ahead of this change; the frame draws no
stroke on any edge.

## Components

Both are design-system exports and neither gains, loses, or renames a prop:

- `Nav`, `NavProps`, `NavItem`, `NavLink`, `NavCopy`
- `Footer`, `FooterProps`, `FooterColumn`, `FooterLink`, `FooterCopy`

The export contract is `openspec/specs/shared-ui/site-chrome/spec.md` and is
untouched — see proposal.md, Modified Capabilities.

Tokens the repaint moves `Footer` onto, all of which exist today in
`packages/design-system/tokens.json`; none is new work:

- `primary` — the frame fill, in place of `background`
- `primary-foreground` — every string in the frame, in place of `foreground`
  and `secondary-foreground`

One token gap to resolve during implementation: the bottom bar's stroke in
Figma is `colors/gray/500-opacity-20` (`rgba(118,118,118,0.2)`), while the code
uses `border` (`gray-300`). `gray-500-opacity-20` exists as a primitive but has
no semantic slot pointing at it. Whether it earns one, or the bar binds the
primitive directly, is a design-system call to make in the task — not a new
token value.

## States

The footer has no loading or error state. Its variable states are the absent
sections, each already owned by a scenario in
`openspec/specs/shared-ui/site-chrome/spec.md`:

| State | Scenario that defines it |
| --- | --- |
| Every section supplied | *Every section is supplied* |
| No social links, no legal links, or no columns | *A section has no content* |
| A column whose links do not exist yet | *A section has no content* |

Each must read correctly against the dark palette, which is the repaint's
acceptance evidence: a light-on-light or dark-on-dark string in any of them
means the repaint is incomplete. No scenario is added or changed — if the
repaint turns up a state with no scenario behind it, the spec is missing one
and the fix belongs there, not here.
