# Tasks: The grade10 site shell

Group 1 lands in this repository; the submodule bump at the top of group 2 is
the boundary. Groups 2, 3, and 4 are grade10 and depend on that bump.

## 1. Site chrome (owner: @sean)

- [x] 1.1 Make `An application imports the chrome` and `A page renders one without the other` pass: `Nav`, `Footer`, `NavProps`, `NavItem`, `NavLink`, `FooterProps`, `FooterColumn`, and `FooterLink` exported from the design system's entry.
- [x] 1.2 Make `A storefront with no cart`, `Only the supplied controls appear`, and `The locale label without a handler` pass — a search, account, wishlist, or cart control renders only with its handler, and the locale renders as a label without one.
- [x] 1.3 Make `No promo content` and `No utility links` pass by omitting each region, leaving no reserved height.
- [x] 1.4 Make `A surface is current` and `No surface is current` pass, marking the current item visually and to assistive technology.
- [x] 1.5 Make `Every section is supplied` and `A section has no content` pass in `Footer`.
- [x] 1.6 Make `Nothing is defaulted` pass — no visible copy either component supplies itself.
- [x] 1.7 Make `A narrow viewport` pass for the header alone: the bar wraps rather than overflowing, with no absolute-positioned navigation at narrow widths.
- [ ] 1.8 Cover a header with every handler and a header with none in the stories, check `apps/preview`'s product-list page still composes, and run this repository's checks.

## 2. The shell (owner: @sean)

- [x] 2.1 Bump the `external/grade10-spec` submodule to the commit carrying group 1.
- [x] 2.2 Make `Every address is wrapped`, `The shell is not a page`, and `The page has one of each landmark` pass: the application root renders `Nav`, one content region, and `Footer` around every surface including not-found.
- [x] 2.3 Declare the header and footer content as route ids resolved through `ROUTES`, so `Navigation lists real surfaces` and `The footer drops what it cannot reach` pass and an unanswered destination cannot be named.
- [x] 2.4 Make `The promo bar and utility row wait for their pages` pass — no promo content, no utility links, until those pages exist.
- [x] 2.5 Take the shell's copy from the reference frame: brand block, catalog description, corporate attribution, social links, copyright, and locale label.
- [x] 2.6 Run `pnpm run typecheck`, `pnpm run lint`, and the grade10 app's test lane.

## 3. Session and the account control (owner: @sean)

- [x] 3.1 Add sign-out to the profile page, before the header loses it, so the site is never without one.
- [x] 3.2 Make `Signed in`, `Signed out`, and `Sign-out has one home` pass through the account control's destination.
- [x] 3.3 Make `A first paint while the session resolves` and `No layout shift when the session arrives` pass — chrome renders before the session, and nothing in it moves when the session arrives.
- [x] 3.4 Make `Absent surfaces are absent controls` pass by supplying a handler only for the account control.
- [x] 3.5 Make `A collector is on a listed surface` and `A collector is on an unlisted surface` pass, including addresses beneath a listed surface.
- [x] 3.6 Delete `navigation/SiteHeader.tsx` in the commit that stops rendering it.
- [x] 3.7 Run the grade10 app's test lane and `pnpm run typecheck`.

## 4. Small widths (owner: @sean)

- [x] 4.1 Make `A narrow viewport` pass across every surface at a 375px viewport: vertical scrolling only, nothing clipped, every control reachable.
- [x] 4.2 Run `pnpm run build` and check each surface at 375px and at the frame's 1440px.

## 5. Delivery and review

- [ ] 5.1 Confirm with design that a storefront supplying fewer handlers renders fewer controls, rather than diverging from the published set.
- [ ] 5.2 Verify every scenario in both deltas, then run `openspec validate add-grade10-site-shell` and `openspec validate --specs`.
- [ ] 5.3 Review the branch for convention drift and for delta coverage separately: requirements missing, partial, or implemented differently than specified.
- [ ] 5.4 After rollout is confirmed, fold both accepted deltas into `openspec/specs/`, adding the `grade10-site` product directory, and archive this change.
