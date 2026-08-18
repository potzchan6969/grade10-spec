# UI: The grade10 site shell

## Screens

### The shell, in a page

[Store `4171:9023`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9023)
— the reference composition: `Nav`, page content, `Footer`. Everything between
the two chrome instances is the store page's own content and is out of scope
here; the frame is linked for the chrome, the content region's width, and the
rhythm between them.

### Header

[Nav `4171:9937`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9937)
— mapped in code by
`packages/design-system/src/components/layout/nav.figma.ts`.

### Footer

[Footer `4171:9653`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9653)
— mapped in code by
`packages/design-system/src/components/layout/footer.figma.ts`.

### Missing frame: the shell below 768px

No frame exists for the header or the footer at a narrow viewport, so the
reflow behind `The shell stays usable at small widths` has no layout source of
truth. The requirement constrains it (no horizontal overflow at 375px, nothing
clipped, every control reachable) without deciding it. Publish a frame and this
section links it; until then engineering satisfies the constraint and design
owns anything beyond it.

## Components

From `@grade10/design-system`:

- `Nav`, with `NavProps`, `NavItem`, `NavLink` — **changes in this repo**: a
  search, account, wishlist, or cart control renders only with a handler; the
  promo bar and the utility row are omitted when they have no content; the bar
  wraps instead of overflowing at narrow widths.
- `Footer`, with `FooterProps`, `FooterColumn`, `FooterLink` — **changes in
  this repo**: a section with no content is omitted rather than rendered empty.
  Layout otherwise unchanged.

No new component, variant, or token. `packages/ui` is untouched.

The composition — which items, links, and handlers this site supplies — is
application code in grade10 and is named in
[tasks.md](tasks.md), group 2.

## States

### Header

| State | Spec scenario |
| --- | --- |
| Signed out — account control leads to sign-in | `Signed out` |
| Signed in — account control leads to the profile | `Signed in` |
| Session unresolved — chrome already rendered, destination is sign-in | `A first paint while the session resolves`, `No layout shift when the session arrives` |
| Only the account control present; no search, wishlist, or cart | `Absent surfaces are absent controls`, `Only the supplied controls appear` |
| Locale label, not interactive | `The locale label without a handler` |
| No promo bar, no utility row | `The promo bar and utility row wait for their pages`, `No promo content`, `No utility links` |
| Current surface marked | `A surface is current`, `A collector is on a listed surface` |
| Profile, sign-in, or unrecognized address — nothing marked | `A collector is on an unlisted surface`, `No surface is current` |

### Footer

| State | Spec scenario |
| --- | --- |
| Columns reduced to reachable destinations | `The footer drops what it cannot reach` |
| A section with no content omitted | `A section has no content` |

### Content region

| State | Spec scenario |
| --- | --- |
| Surface loading while the session resolves | `A first paint while the session resolves` |
| Unrecognized address — not-found inside the shell | `Every address is wrapped` |
| Any surface — shell adds nothing to it | `The shell is not a page`, `The page has one of each landmark` |

### Every screen

| State | Spec scenario |
| --- | --- |
| 375px viewport — reflowed, nothing clipped | `A narrow viewport` |
