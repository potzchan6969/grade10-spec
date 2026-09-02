# Design: The grade10 site shell

Capability deltas:
[`grade10-site/site/page-shell`](specs/grade10-site/site/page-shell/spec.md),
[`shared/ui/site-chrome`](specs/shared/ui/site-chrome/spec.md).
Screens and components: [ui.md](ui.md).
Motivation: [proposal.md](proposal.md) — Why.

## Context

`Nav` and `Footer` ship from `@grade10/design-system`, each mapped to its
published Figma set, and nothing renders either one — the preview app's
product-list page story is their only consumer. The grade10 application wraps
its six surfaces in `SiteHeader`, which arranges primitives by hand and holds
the sign-in/sign-out affordance, and in no footer.

Two existing rules decide most of what follows.

- **Presentation is brand-owned.** A package may not import a design system,
  so the shell that composes `Nav` and `Footer` with this site's content is
  application code, not a shared package.
- **A route is a compile-time fact.** `navigation/routes.ts` is the one table
  of addresses the site answers, and it exists so "a link to a surface that
  does not exist is a compile error".

`Nav` renders its four icon controls unconditionally today; `onSearchClick`
and friends are optional, so the button renders with nothing behind it.

## Goals / Non-Goals

- **Goal:** one shell, applied by the application root, that no new surface can
  forget to use.
- **Goal:** make "this control has no surface" a fact the type system and the
  route table carry, not a comment.
- **Non-goal:** a shared `PageShell` component. One consumer today, and zzz's
  shell will differ in content, not in layout.
- **Non-goal:** any change to `Footer`'s layout.

## Decisions

### The handler is the switch

A control renders when it has a handler. No `showSearch`-style booleans, and no
`controls` list.

*Alternatives:* explicit visibility props — rejected, two props describing one
fact, free to disagree; the consumer hiding controls with CSS — rejected, it
leaves them in the accessibility tree; a `variant` axis on the set — rejected,
the Figma set has no variant axes and this is composition, not appearance.

Makes pass: `A storefront with no cart`, `Only the supplied controls appear`,
`Absent surfaces are absent controls`.

### The shell composes from the route table, never from paths

The shell's navigation items, footer columns, and legal links are declared as
route ids and resolved through `ROUTES`. A destination the site does not answer
cannot be named, so `A link is present only when the site answers it` is
enforced by the compiler rather than by review.

*Alternatives:* content declared with literal paths — rejected, it is exactly
how a link to a not-found page gets shipped; content fetched from a CMS —
rejected, no CMS exists and the copy is in the frame.

### The chrome renders before the session, and the account control never moves

The shell renders `Nav` and `Footer` on the first paint. The account control is
always present; only its destination depends on the session, and while the
session is unresolved it points at sign-in. Nothing about the header changes
when the session arrives.

*Alternatives:* render the header after the session resolves — rejected, it
makes the whole site's chrome wait on a network call; swap the control for a
signed-in variant — rejected, that is the layout shift the requirement forbids.

Makes pass: `A first paint while the session resolves`, `No layout shift when
the session arrives`, `Signed in`, `Signed out`.

### Sign-out moves to the profile

`SiteHeader`'s email link and Sign out button have no home in `Nav`, which
carries an icon. The profile is where a collector manages their account, so
sign-out goes there and the header keeps one account control.

*Alternatives:* an account dropdown in `Nav` — rejected, a component with no
requirement behind it; keeping a bespoke session row beside `Nav` — rejected,
it is the hand-arranged header this change removes.

### Small widths reflow; they do not get a menu

`Nav`'s bar centres its navigation with absolute positioning, which collides
with the logo and controls on a narrow viewport. The bar wraps below a
breakpoint instead: logo and controls on one row, navigation beneath. No
burger, no drawer, no hidden navigation.

*Alternatives:* a collapsing menu — rejected, it is a designed interaction with
no frame; horizontal scrolling of the nav row — rejected, the requirement
forbids horizontal overflow.

Makes pass: `A narrow viewport`.

## Risks / Trade-offs

- **The frame shows four icon controls; this site will render one** → the frame
  stays the reference for a storefront that has those surfaces. The subset is
  the consumer's composition, not a divergence from the design. Worth design's
  confirmation before the components land.
- **`add-account-profile` also edits the profile page** → the sign-out control
  is additive and touches neither the profile feature nor its view's props;
  whichever change lands second rebases on the other.
- **No mobile frame exists** → the reflow is specified as a constraint (no
  horizontal overflow at 375px) rather than as a layout, so nothing here
  pre-empts a designed mobile navigation.
- **Removing a rendered control is a visible change to a published component**
  → the preview story is the only consumer and is checked in the same group.

## Migration Plan

1. `Nav` changes in grade10-spec, with stories covering a header that supplies
   every handler and one that supplies none; the preview story is checked.
2. The submodule is bumped in grade10.
3. The shell replaces `SiteHeader` in the application root; `SiteHeader` is
   deleted in the same commit so no surface can reach the old header.
4. Sign-out lands on the profile page before the header loses it, so the site
   is never without a way to sign out.

*Rollback:* revert the application commit; the design-system change is
backward compatible for any consumer that supplies handlers.

## Open Questions

None.
